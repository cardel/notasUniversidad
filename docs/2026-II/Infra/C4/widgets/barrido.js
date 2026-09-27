if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* El barrido de hilos sobre la suma de cien millones de enteros, con las dos
   versiones del mismo programa: la lista de Python recorrida por indices y el
   arreglo de NumPy sumado con lst[ini:fin].sum(). Los tiempos son los medidos
   en un Ryzen 5 3600 (6 nucleos, 12 hilos de hardware), 32 GB, Python 3.14
   sobre Linux. El campo ms guarda la medida en segundos, tal como la imprimio
   perf_counter.                                                            */

var ELEMENTOS = 100000000;
var MEGAS = 800;            // lo que ocupa el arreglo de NumPy en memoria

var PURO = [
  { hilos: 1, ms: 5.05 },
  { hilos: 2, ms: 6.27 },
  { hilos: 4, ms: 7.04 },
  { hilos: 6, ms: 6.23 },
  { hilos: 8, ms: 6.23 },
  { hilos: 10, ms: 6.17 },
  { hilos: 12, ms: 5.54 },
  { hilos: 14, ms: 6.06 },
  { hilos: 16, ms: 5.48 }
];

var NUMPY = [
  { hilos: 1, ms: 0.045 },
  { hilos: 2, ms: 0.027 },
  { hilos: 4, ms: 0.029 },
  { hilos: 8, ms: 0.025 },
  { hilos: 16, ms: 0.024 }
];

/* La medicion de un numero de hilos dentro de una tabla. */
function fila(tabla, hilos) {
  var f = tabla.filter(function (x) { return x.hilos === hilos; })[0];
  if (!f) { throw new Error("sin medicion para " + hilos + " hilos"); }
  return f;
}

/* Ganancia sobre el secuencial: el tiempo de un hilo dividido por el de la
   corrida. Menor que 1 significa que la corrida tardo mas.                 */
function ganancia(tabla, hilos) { return tabla[0].ms / fila(tabla, hilos).ms; }

/* El mejor tiempo entre las corridas con hilos. La de un hilo es la
   referencia contra la que se comparan, no una competidora mas.            */
function mejor(tabla) {
  return tabla.slice(1).reduce(function (a, b) { return b.ms < a.ms ? b : a; });
}

/* Cuantas veces mas rapido corre el secuencial de NumPy que el de la lista. */
function factorSecuencial() { return PURO[0].ms / NUMPY[0].ms; }

function segundos(ms, d) { return Motor.num(ms, d === undefined ? 2 : d) + " s"; }
function veces(g) { return Motor.num(g, 2) + "×"; }

/* Filas de una tabla listas para pintar. sube marca la ganancia mayor que 1,
   que es la que se lee en verde; la fila de un hilo no lleva ganancia.      */
function filasTabla(tabla, decimales) {
  return tabla.map(function (f, i) {
    return {
      hilos: f.hilos,
      rotulo: i === 0 ? f.hilos + " (secuencial)" : String(f.hilos),
      tiempo: segundos(f.ms, decimales),
      ganancia: i === 0 ? "—" : veces(tabla[0].ms / f.ms),
      sube: f.ms < tabla[0].ms
    };
  });
}

/* La barra mas larga del panel es el peor tiempo de esa misma tabla. */
function escala(tabla) {
  return tabla.reduce(function (m, f) { return Math.max(m, f.ms); }, 0);
}

/* Un panel de barras por tabla: una fila por numero de hilos, el ancho es el
   tiempo y el color dice si la corrida mejoro o empeoro al secuencial.      */
function filasBarras(tabla, decimales) {
  return tabla.map(function (f, i) {
    var g = tabla[0].ms / f.ms;
    var color = i === 0 ? "var(--azul)"
      : (f.ms < tabla[0].ms ? "var(--verde)" : "var(--rojo)");
    return {
      rotulo: f.hilos === 1 ? "1 hilo" : f.hilos + " hilos",
      valor: segundos(f.ms, decimales),
      bloques: [{
        inicio: 0, fin: f.ms, color: color,
        texto: i === 0 ? "" : veces(g),
        titulo: f.hilos + (f.hilos === 1 ? " hilo: " : " hilos: ") +
          segundos(f.ms, decimales) +
          (i === 0 ? ", la referencia" : ", " + veces(g) + " el secuencial")
      }]
    };
  });
}

/* Cifras de cierre. Lo que todavia no se comprobo sale como ?. */
function chipsResumen(vistaPuro, vistaNumpy) {
  var m1 = mejor(PURO), m2 = mejor(NUMPY);
  return [
    { texto: "lista, un hilo", valor: vistaPuro ? segundos(PURO[0].ms) : "?" },
    { texto: "lista, lo mejor con hilos",
      valor: vistaPuro ? segundos(m1.ms) + " con " + m1.hilos + " hilos" : "?" },
    { texto: "NumPy, un hilo", valor: vistaNumpy ? segundos(NUMPY[0].ms, 3) : "?" },
    { texto: "NumPy, lo mejor con hilos",
      valor: vistaNumpy ? segundos(m2.ms, 3) + " con " + m2.hilos + " hilos" : "?" },
    { texto: "un hilo contra un hilo",
      valor: (vistaPuro && vistaNumpy)
        ? Motor.num(Math.round(factorSecuencial())) + "×" : "?", cuenta: true }
  ];
}

/* Veredicto de la prediccion sobre la lista de Python. */
function explicarPuro(bien, real, dicho) {
  var m = mejor(PURO);
  var t = bien ? "Sí: " + segundos(real) + ". "
               : "Son " + segundos(real) + ", no " + Motor.num(dicho, 2) + ". ";
  t += "Con cuatro hilos tarda más que con uno, 7,04 contra 5,05, porque al mismo trabajo se " +
    "le suma el vaivén del GIL: los cuatro hilos se turnan un intérprete que deja correr a uno " +
    "por vez, y cada cambio de turno cuesta. La ganancia queda en " + veces(ganancia(PURO, 4)) +
    " el secuencial, y ninguna de las nueve corridas baja de 5,05 s: la más rápida, con " +
    m.hilos + " hilos, llega a " + segundos(m.ms) + ".";
  return t;
}

/* Veredicto de la prediccion sobre NumPy con un solo hilo. */
function explicarNumpy(bien, real, dicho) {
  var t = bien ? "Sí: " + Motor.num(real) + " ms. "
               : "Son " + Motor.num(real) + " ms, no " + Motor.num(dicho, 2) + ". ";
  t += "0,045 s, unas " + Motor.num(Math.round(factorSecuencial())) + " veces más rápido que " +
    "los 5,05 s de la lista, sin usar un solo hilo: el cambio no fue paralelizar sino dejar de " +
    "ejecutar bytecode por elemento. Desde ahí los hilos todavía bajan el tiempo hasta " +
    segundos(mejor(NUMPY).ms, 3) + ", y ahí se quedan.";
  return t;
}

/* Carta 4: por que la misma receta de hilos funciona con NumPy. */
var RAZONES_ESCALA = {
  correcta: "lst[ini:fin].sum() no ejecuta bytecode: entra a una rutina compilada en C que " +
    "recorre memoria contigua con instrucciones vectoriales y libera el GIL mientras trabaja. " +
    "Con el cerrojo soltado los hilos avanzan a la vez, y el tiempo baja de 0,045 a 0,024 s en " +
    "lugar de subir.",
  procesos: "Son los mismos threading.Thread del programa de la lista: la misma clase, el " +
    "mismo join y el arreglo compartido sin copiarlo. Lo único que cambió está adentro de " +
    "sumar, en la línea que recorre el segmento.",
  pequeno: "Son los mismos cien millones de elementos, unos 800 MB, y NumPy los guarda en un " +
    "bloque contiguo del mismo tamaño. Cambia cómo se recorren, no cuántos son.",
  singil: "El GIL es del intérprete, no de la librería: NumPy corre en el mismo CPython con el " +
    "mismo cerrojo. Lo que hace la rutina de .sum() es soltarlo mientras trabaja en C y volver " +
    "a tomarlo al salir."
};

/* Carta 5: por que el tiempo con NumPy se aplana en 0,024 s. */
var RAZONES_TECHO = {
  correcta: "Sumar 800 MB está limitado por el ancho de banda de memoria, no por la CPU: dos " +
    "hilos ya saturan el bus y los demás esperan datos, no turno. De 2 a 16 hilos el tiempo va " +
    "de 0,027 a 0,024 s, ocho veces más hilos contra el mismo piso.",
  gil: "Si fuera el GIL el tiempo subiría al agregar hilos, como en la tabla de la lista de " +
    "Python, donde 4 hilos tardan 7,04 s contra los 5,05 s del secuencial. Aquí baja a 0,027 s " +
    "con dos hilos y se queda plano.",
  nucleos: "La máquina tiene 6 núcleos físicos y 12 hilos de hardware. Con 6 núcleos libres el " +
    "tiempo tendría que seguir bajando al menos hasta 6 hilos, y se aplana en 2.",
  creacion: "Crear 16 hilos cuesta bastante menos que 24 ms. Y si el piso fuera ese costo, el " +
    "tiempo crecería con el número de hilos en vez de mantenerse plano de 2 a 16."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ELEMENTOS: ELEMENTOS, MEGAS: MEGAS, PURO: PURO, NUMPY: NUMPY,
    RAZONES_ESCALA: RAZONES_ESCALA, RAZONES_TECHO: RAZONES_TECHO,
    fila: fila, ganancia: ganancia, mejor: mejor, factorSecuencial: factorSecuencial,
    segundos: segundos, veces: veces, filasTabla: filasTabla, escala: escala,
    filasBarras: filasBarras, chipsResumen: chipsResumen,
    explicarPuro: explicarPuro, explicarNumpy: explicarNumpy
  };
}

if (typeof document !== "undefined") (function () {
  var vistaPuro = false, vistaNumpy = false;

  /* Sin comprobar la prediccion, el tiempo y la ganancia quedan en ?. */
  function pintarTabla(id, tabla, decimales, vista) {
    document.getElementById(id).innerHTML = filasTabla(tabla, decimales).map(function (f) {
      if (!vista) {
        return "<tr><td>" + f.rotulo +
          "</td><td class=\"pend\">?</td><td class=\"pend\">?</td></tr>";
      }
      var clase = f.ganancia === "—" ? "" : (f.sube ? " class=\"sube\"" : " class=\"baja\"");
      return "<tr><td>" + f.rotulo + "</td><td>" + f.tiempo + "</td><td" + clase + ">" +
        f.ganancia + "</td></tr>";
    }).join("");
  }

  function pintarPanel(id, tabla, decimales, vista) {
    if (!vista) { document.getElementById(id).innerHTML = ""; return; }
    Motor.pintarGantt(id, filasBarras(tabla, decimales), escala(tabla));
  }

  function pintar() {
    pintarTabla("cuerpo-puro", PURO, 2, vistaPuro);
    pintarTabla("cuerpo-numpy", NUMPY, 3, vistaNumpy);
    pintarPanel("panel-puro", PURO, 2, vistaPuro);
    pintarPanel("panel-numpy", NUMPY, 3, vistaNumpy);
    Motor.pintarChips("chips-barrido", chipsResumen(vistaPuro, vistaNumpy));
  }

  Motor.conectarPrediccion(
    { entrada: "prediccion-puro", boton: "btn-comprobar-puro", veredicto: "veredicto-puro" },
    function () { return fila(PURO, 4).ms; },
    function (bien, real, dicho) {
      vistaPuro = true; pintar(); return explicarPuro(bien, real, dicho);
    });
  Motor.conectarPrediccion(
    { entrada: "prediccion-numpy", boton: "btn-comprobar-numpy", veredicto: "veredicto-numpy" },
    function () { return Math.round(NUMPY[0].ms * 1000); },
    function (bien, real, dicho) {
      vistaNumpy = true; pintar(); return explicarNumpy(bien, real, dicho);
    });
  Motor.conectarOpciones("opciones-escala", "veredicto-escala", RAZONES_ESCALA);
  Motor.conectarOpciones("opciones-techo", "veredicto-techo", RAZONES_TECHO);

  pintar();
})();
