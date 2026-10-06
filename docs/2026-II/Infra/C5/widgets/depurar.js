if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Depurar un programa de OpenMP: la sesion de gdb sobre la integral de pi
   (mil millones de iteraciones, cuatro hilos, g++ -g -O0) y el reporte de
   ThreadSanitizer sobre la suma sin reduction. Las cuentas son el reparto por
   bloques (inicioBloque, hiloDe) y el recuento de lineas del reporte. */

var ITERACIONES = 1000000000;
var HILOS = 4;

/* schedule(static) sin tamano de bloque: un bloque contiguo por hilo. */
function tamanoBloque(n, hilos) { return Math.ceil(n / hilos); }

/* Primera iteracion del hilo `id` (gdb numera desde 1, OpenMP desde 0). */
function inicioBloque(id, n, hilos) { return (id - 1) * tamanoBloque(n, hilos); }

/* Ultima iteracion del hilo `id`. */
function finBloque(id, n, hilos) {
  return Math.min(id * tamanoBloque(n, hilos), n) - 1;
}

/* Hilo (numeracion de gdb) al que le toca la iteracion i. */
function hiloDe(i, n, hilos) { return Math.floor(i / tamanoBloque(n, hilos)) + 1; }

/* Lo que muestra el hilo detenido recien al entrar a su bloque. */
var VISTA_GDB = [
  { id: 1, i: 0 }, { id: 2, i: 250000000 }, { id: 3, i: 500000000 }, { id: 4, i: 750000000 }
];

var TSAN = {
  escritura: { linea: 9, hilo: "T2", tam: 8 },
  lectura: { linea: 7, hilo: "hilo principal", tam: 8 }
};

function fmt(x) { return Motor.num(x); }

function explicarHilo(id) {
  return function (bien, real) {
    var base = "El hilo " + id + " arranca en " + fmt(real) + ": cada bloque tiene " +
      fmt(tamanoBloque(ITERACIONES, HILOS)) + " iteraciones y el hilo " + id +
      " recibe el número " + id + " desde el comienzo. ";
    return (bien ? "Correcto. " : "No. ") + base +
      (bien ? "" : "El hilo 3, que muestra 500.000.000, es la referencia: reste o sume un bloque.");
  };
}

var RAZONES_ARRANQUE = {
  correcta: "Es la explicación. gdb muestra la copia privada que OpenMP creó para la " +
    "reducción, inicializada en 0 al entrar a la región. La variable original solo recibe " +
    "las cuatro copias cuando la región termina; solo desde ahí, fuera del ciclo paralelo, " +
    "print suma muestra el total.",
  roto: "No. Una suma que se calcula bien da 0 dentro de la región porque cada hilo lleva " +
    "su copia, no porque el ciclo falle. El resultado final del programa es correcto.",
  compilador: "No. Con -O0 el compilador no elimina la variable; la vería en el depurador " +
    "como optimizada, y eso ocurre con -O2, no aquí.",
  atomica: "No. No hay operación atómica en este programa: la cláusula reduction elige " +
    "copias privadas con combinación al final, sin sincronizar cada suma."
};

var RAZONES_NOMBRE = {
  correcta: "Es la explicación. GCC saca el cuerpo de la región paralela a una función nueva " +
    "que reciben los hilos; la llama _omp_fn.N, y _Z8integrarv es el nombre de integrar() " +
    "decorado por C++. Por eso el marco dice _Z8integrarv._omp_fn.0.",
  inlinea: "No. Si la función se hubiera copiado dentro del llamador desaparecería del " +
    "marco, y con -O0 no hay inline. Lo que se ve es una función distinta, creada para la región.",
  gdb: "No. gdb imprime el símbolo tal como está en el ejecutable; no inventa sufijos.",
  hilo: "No. El sufijo es el número de la región paralela dentro de la función, no el " +
    "identificador del hilo: los cuatro hilos aparecen en la misma _omp_fn.0."
};

var RAZONES_O2 = {
  correcta: "Es lo que ocurre. El depurador se detiene en la línea, porque la tabla de " +
    "líneas sigue existiendo con -g, pero la variable vive en un registro o desapareció, " +
    "y print suma responde <optimized out>. Para inspeccionar valores se compila con -g -O0.",
  igual: "No. Con -O2 print suma ya no devuelve el mismo 0: el compilador guarda el " +
    "acumulador en un registro y gdb no encuentra la variable.",
  nodetiene: "No. El depurador sí se detiene: -g sigue guardando la correspondencia entre " +
    "instrucciones y líneas. Lo que se pierde es el contenido de las variables.",
  nohilos: "No. -O2 no cambia cuántos hilos arrancan; eso depende de OpenMP y de la " +
    "variable de ambiente."
};

var RAZONES_PARES = {
  correcta: "Es el conflicto del reporte. Una escritura de 8 bytes del hilo T2 en la línea 9 " +
    "(suma += i) choca con una lectura anterior de la misma dirección, hecha por el hilo " +
    "principal en la línea 7. Dos accesos a una dirección, uno de ellos escritura, sin " +
    "sincronización entre sí, son una carrera de datos.",
  dosescrituras: "No. El reporte nombra una escritura y una lectura previa, no dos escrituras. " +
    "Aunque suma += i sí lee y escribe, el reporte atribuye cada acción a un hilo y a una línea.",
  lineas: "No. Las líneas están invertidas: la escritura es la de la línea 9 y la lectura " +
    "previa es la de la 7.",
  mismohilo: "No. Un hilo solo no genera una carrera consigo mismo. El reporte distingue a T2 " +
    "del hilo principal, y por eso es una carrera."
};

var RAZONES_CLAUSULA = {
  correcta: "Es la que arregla la carrera. reduction(+ : suma) le da a cada hilo una copia " +
    "privada de suma, inicializada en 0, y combina las copias al salir de la región; ningún " +
    "hilo toca la variable compartida mientras corre el ciclo.",
  privada: "No. private(suma) crea copias sin inicializar y las descarta al terminar: la " +
    "carrera desaparece, pero el resultado se pierde y la suma original queda como estaba.",
  firstprivada: "No. firstprivate(suma) copia el valor inicial a cada hilo, pero tampoco " +
    "devuelve nada al terminar. Las sumas parciales se pierden.",
  dinamico: "No. schedule(dynamic) cambia cómo se reparten las iteraciones, no quién es " +
    "dueño de suma. Todos los hilos siguen escribiendo la misma variable."
};

function iniciar() {
  [[1, "p1"], [2, "p2"], [4, "p4"]].forEach(function (par) {
    var id = par[0];
    Motor.conectarPrediccion(
      { entrada: "pred-" + par[1], boton: "btn-" + par[1], veredicto: "ver-" + par[1] },
      function () { return inicioBloque(id, ITERACIONES, HILOS); },
      explicarHilo(id));
  });

  document.getElementById("btn-destapar").addEventListener("click", function () {
    document.getElementById("cuerpo-hilos").innerHTML = VISTA_GDB.map(function (h) {
      return "<tr><td>" + h.id + "</td><td>" + fmt(h.i) + "</td><td>" +
        fmt(inicioBloque(h.id, ITERACIONES, HILOS)) + " a " +
        fmt(finBloque(h.id, ITERACIONES, HILOS)) + "</td><td>0</td></tr>";
    }).join("");
    document.getElementById("tabla-hilos").hidden = false;
  });

  Motor.conectarOpciones("op-arranque", "ver-arranque", RAZONES_ARRANQUE);
  Motor.conectarOpciones("op-nombre", "ver-nombre", RAZONES_NOMBRE);
  Motor.conectarOpciones("op-o2", "ver-o2", RAZONES_O2);
  Motor.conectarOpciones("op-pares", "ver-pares", RAZONES_PARES);
  Motor.conectarOpciones("op-clausula", "ver-clausula", RAZONES_CLAUSULA);
}

if (typeof document !== "undefined") { iniciar(); }

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ITERACIONES: ITERACIONES, HILOS: HILOS, VISTA_GDB: VISTA_GDB, TSAN: TSAN,
    tamanoBloque: tamanoBloque, inicioBloque: inicioBloque, finBloque: finBloque,
    hiloDe: hiloDe, RAZONES_ARRANQUE: RAZONES_ARRANQUE, RAZONES_NOMBRE: RAZONES_NOMBRE,
    RAZONES_O2: RAZONES_O2, RAZONES_PARES: RAZONES_PARES, RAZONES_CLAUSULA: RAZONES_CLAUSULA
  };
}
