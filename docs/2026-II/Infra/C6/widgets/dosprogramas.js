if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Dos programas que hacen la misma cuenta: la suma de una matriz de
   10.000 x 10.000 enteros recorrida por filas (bueno) y por columnas (malo).
   Las cifras son las de perf stat --repeat 10 de la sesion. Las cuentas que
   destapan las tarjetas son razon(), ipc() y diferenciaInstrucciones(). */

var MEDIDAS = {
  bueno: { instrucciones: 3504983954, ciclos: 1177787894, segundos: 0.43538 },
  malo:  { instrucciones: 3504984293, ciclos: 2796626915, segundos: 0.79385 }
};

var MATRIZ = { lado: 10000, bytesPorEntero: 4, suma: 999900000000 };

/* Cuantas veces mas grande es b que a. */
function razon(a, b) { return b / a; }

/* Instrucciones por ciclo: lo que el procesador alcanza a retirar en cada ciclo. */
function ipc(m) { return m.instrucciones / m.ciclos; }

/* Lo que separa las dos cuentas de instrucciones, en numero y en partes por millon. */
function diferenciaInstrucciones() {
  var d = MEDIDAS.malo.instrucciones - MEDIDAS.bueno.instrucciones;
  return { absoluta: d, ppm: (d / MEDIDAS.bueno.instrucciones) * 1e6 };
}

/* Memoria que ocupa la matriz, en megabytes. */
function memoriaMB() {
  return (MATRIZ.lado * MATRIZ.lado * MATRIZ.bytesPorEntero) / (1024 * 1024);
}

function fmt(x, d) { return Motor.num(x, d); }

function explicarTiempo(bien, real) {
  return (bien ? "Correcto. " : "No. ") + "El de columnas tarda " + fmt(real, 2) +
    " veces lo que el de filas: 0,79385 s contra 0,43538 s. Los dos calculan la misma " +
    "suma, " + fmt(MATRIZ.suma) + ", sobre los mismos " + fmt(memoriaMB()) + " MiB de datos.";
}

function explicarIpc(nombre) {
  return function (bien, real) {
    return (bien ? "Correcto. " : "No. ") + "El de " + nombre + " retira " + fmt(real, 2) +
      " instrucciones por ciclo. Se divide instrucciones entre ciclos, y el resultado dice " +
      "cuánto trabajo sale de cada ciclo de reloj.";
  };
}

var RAZONES_CAUSA = {
  correcta: "Es la explicación. Las dos versiones ejecutan las mismas instrucciones, así que " +
    "el trabajo aritmético es idéntico. Lo que cambia es de dónde salen los datos: por filas " +
    "cada línea de caché que llega sirve para dieciséis enteros seguidos, y por columnas se " +
    "usa uno solo y la siguiente lectura está a 40.000 bytes. El procesador pasa los ciclos " +
    "esperando memoria, y por eso los ciclos se duplican sin que las instrucciones se muevan.",
  algoritmo: "No. Si el algoritmo fuera distinto, la cuenta de instrucciones lo mostraría; " +
    "aquí las dos difieren en 339 instrucciones de tres mil quinientos millones, que son el " +
    "arranque del proceso. El recorrido es el mismo número de sumas.",
  compilador: "No. Los dos se compilan con las mismas banderas y el mismo compilador. Una " +
    "optimización que apareciera en uno y no en el otro cambiaría el número de instrucciones.",
  frecuencia: "No. La frecuencia afecta cuánto dura un ciclo, no cuántos ciclos hacen falta. " +
    "Aquí lo que creció es el número de ciclos: de 1.177 millones a 2.796."
};

var RAZONES_MEDIR = {
  correcta: "Es la razón de perfilar desde afuera. El código fuente de los dos programas se " +
    "diferencia en el orden de dos índices, y leerlo no dice cuál paga más. La medición sí: " +
    "mismas instrucciones, el doble de ciclos.",
  leer: "No. Leer el código sirve para entender qué hace el programa, pero el costo de un " +
    "acceso a memoria no está escrito en la línea: depende de si el dato ya estaba en caché.",
  contar: "No. Contar líneas o instrucciones da la misma cifra en los dos casos. Es " +
    "justamente lo que el ejemplo muestra: dos programas con el mismo conteo y el doble de tiempo.",
  probar: "No. Probar con una matriz pequeña esconde el problema: mientras los datos quepan " +
    "en la caché, los dos recorridos cuestan lo mismo."
};

var RAZONES_TIPO = {
  correcta: "Es el que corresponde. Un perfilador determinista instrumenta el programa y " +
    "registra cada evento, así que puede decir en qué función y en qué línea se va el tiempo. " +
    "En Linux, callgrind; en Python, cProfile.",
  temporizador: "No. Un temporizador responde cuánto tardó, no dónde. Sirve para comparar dos " +
    "versiones, que es lo que se hizo aquí, pero no señala la función culpable.",
  estadistico: "No exactamente. Un perfilador estadístico, como perf o pyinstrument, muestrea " +
    "cada tantos milisegundos y reparte el tiempo entre las funciones que encuentra. Da un " +
    "mapa del tiempo con costo bajo, pero no cuenta cada evento.",
  monitor: "No. Un monitor del sistema operativo, como top o ps, mira el proceso desde afuera: " +
    "cuánta CPU y cuánta memoria consume. No entra a las funciones."
};

function iniciar() {
  Motor.conectarPrediccion(
    { entrada: "pred-tiempo", boton: "btn-tiempo", veredicto: "ver-tiempo" },
    function () { return razon(MEDIDAS.bueno.segundos, MEDIDAS.malo.segundos); },
    explicarTiempo);

  Motor.conectarPrediccion(
    { entrada: "pred-ipc-bueno", boton: "btn-ipc-bueno", veredicto: "ver-ipc-bueno" },
    function () { return ipc(MEDIDAS.bueno); },
    explicarIpc("filas"));

  Motor.conectarPrediccion(
    { entrada: "pred-ipc-malo", boton: "btn-ipc-malo", veredicto: "ver-ipc-malo" },
    function () { return ipc(MEDIDAS.malo); },
    explicarIpc("columnas"));

  document.getElementById("btn-destapar").addEventListener("click", function () {
    var filas = [
      ["Instrucciones ejecutadas", fmt(MEDIDAS.bueno.instrucciones), fmt(MEDIDAS.malo.instrucciones),
       fmt(razon(MEDIDAS.bueno.instrucciones, MEDIDAS.malo.instrucciones), 2) + "x"],
      ["Ciclos de CPU", fmt(MEDIDAS.bueno.ciclos), fmt(MEDIDAS.malo.ciclos),
       fmt(razon(MEDIDAS.bueno.ciclos, MEDIDAS.malo.ciclos), 2) + "x"],
      ["Instrucciones por ciclo", fmt(ipc(MEDIDAS.bueno), 2), fmt(ipc(MEDIDAS.malo), 2),
       fmt(razon(ipc(MEDIDAS.malo), ipc(MEDIDAS.bueno)), 2) + "x"],
      ["Tiempo transcurrido", fmt(MEDIDAS.bueno.segundos * 1000, 1) + " ms",
       fmt(MEDIDAS.malo.segundos * 1000, 1) + " ms",
       fmt(razon(MEDIDAS.bueno.segundos, MEDIDAS.malo.segundos), 2) + "x"]
    ];
    document.getElementById("cuerpo-medidas").innerHTML = filas.map(function (f) {
      return "<tr><td>" + f[0] + "</td><td>" + f[1] + "</td><td>" + f[2] +
        "</td><td>" + f[3] + "</td></tr>";
    }).join("");
    document.getElementById("tabla-medidas").hidden = false;

    var d = diferenciaInstrucciones();
    Motor.pintarChips("chips-instrucciones", [
      { texto: "instrucciones de más en el de columnas", valor: fmt(d.absoluta) },
      { texto: "partes por millón", valor: fmt(d.ppm, 2), cuenta: true },
      { texto: "datos de la matriz", valor: fmt(memoriaMB()) + " MiB" }
    ]);
  });

  Motor.conectarOpciones("op-causa", "ver-causa", RAZONES_CAUSA);
  Motor.conectarOpciones("op-medir", "ver-medir", RAZONES_MEDIR);
  Motor.conectarOpciones("op-tipo", "ver-tipo", RAZONES_TIPO);
}

if (typeof document !== "undefined") { iniciar(); }

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MEDIDAS: MEDIDAS, MATRIZ: MATRIZ,
    razon: razon, ipc: ipc, diferenciaInstrucciones: diferenciaInstrucciones,
    memoriaMB: memoriaMB,
    RAZONES_CAUSA: RAZONES_CAUSA, RAZONES_MEDIR: RAZONES_MEDIR, RAZONES_TIPO: RAZONES_TIPO
  };
}
