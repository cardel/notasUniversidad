if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Las dos corridas de perf stat sobre el mismo calculo, una con cuatro hilos
   y otra con cuatro procesos, y la misma suma en cinco tamanos de entrada.
   Medido en un AMD Ryzen 5 3600 (6 nucleos, 12 hilos de hardware), 32 GB,
   Python 3.14 sobre Linux.                                                 */

var MAQUINA = { nucleosFisicos: 6, hilosHardware: 12 };
var PROCESOS = 4;
var HILOS = 4;
var ARRANQUE_MS = 17;   // crear los cuatro procesos, medido
var NS_MEDIDO = 48;     // trabajo por elemento que sale de la tabla de tamanos

/* task-clock y tiempo transcurrido de cada corrida de perf stat. */
var MEDIDO_PERF = [
  { clave: "hilos", etiqueta: "4 hilos", cpuMs: 1607.65, relojMs: 1617 },
  { clave: "procesos", etiqueta: "4 procesos", cpuMs: 1750.13, relojMs: 550 }
];

/* Sumar n elementos, secuencial contra cuatro procesos, en milisegundos. */
var TAMANOS = [
  { n: 10000, sec: 0.35, par: 16.86 },
  { n: 100000, sec: 4.11, par: 16.89 },
  { n: 1000000, sec: 47.59, par: 29.02 },
  { n: 10000000, sec: 458.18, par: 136.02 },
  { n: 100000000, sec: 4855.86, par: 1460.77 }
];

/* perf suma el tiempo de CPU de todos los hilos y procesos del programa; al
   dividirlo entre el transcurrido sale cuantos nucleos estuvieron ocupados. */
function nucleos(cpuMs, relojMs) { return cpuMs / relojMs; }

function speedup(fila) { return fila.sec / fila.par; }

/* Modelo de la decision: el trabajo se reparte entre los procesos y el
   arranque se paga una sola vez, completo, asi la tarea dure nada.        */
function modelo(n, nsPorElemento, arranqueMs, procesos) {
  var trabajo = n * nsPorElemento / 1e6;
  return { sec: trabajo, par: arranqueMs + trabajo / procesos };
}

/* n donde el modelo empata: trabajo = arranque + trabajo / procesos. */
function cruce(nsPorElemento, arranqueMs, procesos) {
  if (procesos <= 1) { return Infinity; }
  return arranqueMs * 1e6 * procesos / (nsPorElemento * (procesos - 1));
}

/* Primer tamano medido con speedup mayor que uno. */
function crucePorTabla(tabla) {
  for (var i = 0; i < tabla.length; i++) {
    if (speedup(tabla[i]) > 1) { return tabla[i].n; }
  }
  return null;
}

/* Lo mismo, pero con los tiempos que da el modelo y no los medidos. */
function crucePorModelo(tabla, nsPorElemento, arranqueMs, procesos) {
  for (var i = 0; i < tabla.length; i++) {
    var m = modelo(tabla[i].n, nsPorElemento, arranqueMs, procesos);
    if (m.par < m.sec) { return tabla[i].n; }
  }
  return null;
}

function rotuloTiempo(ms) {
  return ms >= 1000 ? Motor.num(ms / 1000, 2) + " s" : Motor.num(ms, 2) + " ms";
}

/* Cuatro hilos con el GIL: el reloj se parte en tandas y en cada tanda hay un
   solo hilo ejecutando bytecode; el resto de la fila es espera.            */
function filasHilos(medida, hilos, tandas) {
  var tanda = medida.relojMs / tandas;   // ancho de un turno en el reloj
  var trabajo = medida.cpuMs / tandas;   // bytecode que cabe en un turno
  var filas = [];
  for (var h = 0; h < hilos; h++) {
    var bloques = [], gris = null;
    for (var j = 0; j < tandas; j++) {
      var ini = j * tanda;
      if (j % hilos === h) {
        if (gris) { bloques.push(gris); gris = null; }
        bloques.push({ inicio: ini, fin: ini + trabajo, color: "var(--azul)",
          texto: "bytecode", titulo: "el hilo " + (h + 1) + " tiene el GIL" });
      } else if (gris) {
        gris.fin = ini + tanda;
      } else {
        gris = { inicio: ini, fin: ini + tanda, color: "var(--gris)",
          titulo: "espera el GIL" };
      }
    }
    if (gris) { bloques.push(gris); }
    filas.push({ rotulo: "hilo " + (h + 1), bloques: bloques,
      valor: Motor.num(medida.cpuMs / hilos, 0) + " ms" });
  }
  return filas;
}

/* Cuatro procesos: cada uno paga su parte del arranque, uno tras otro, y
   despues los cuatro suman a la vez.                                      */
function filasProcesos(medida, procesos, arranqueMs) {
  var arranque = arranqueMs / procesos;
  var calculo = (medida.cpuMs - arranqueMs) / procesos;
  var filas = [];
  for (var p = 0; p < procesos; p++) {
    var ini = p * arranque;
    filas.push({ rotulo: "proceso " + (p + 1), bloques: [
      { inicio: ini, fin: ini + arranque, color: "var(--ambar)",
        titulo: "arrancar el intérprete: " + Motor.num(arranque, 2) + " ms" },
      { inicio: ini + arranque, fin: ini + arranque + calculo, color: "var(--azul)",
        texto: "cálculo", titulo: "suma su parte: " + Motor.num(calculo, 0) + " ms" }
    ], valor: Motor.num(arranque + calculo, 0) + " ms" });
  }
  return filas;
}

/* Dos barras por tamano. Cada pareja se dibuja a su propia escala, porque
   entre el primer tamano y el ultimo hay cuatro ordenes de magnitud.      */
function filasModelo(tabla, nsPorElemento, arranqueMs, procesos) {
  var filas = [];
  tabla.forEach(function (f) {
    var m = modelo(f.n, nsPorElemento, arranqueMs, procesos);
    var tope = Math.max(m.sec, m.par);
    var gana = m.par < m.sec;
    filas.push({ rotulo: Motor.num(f.n) + " · secuencial", valor: rotuloTiempo(m.sec),
      bloques: [{ inicio: 0, fin: m.sec / tope, color: "var(--azul)",
        titulo: Motor.num(f.n) + " × " + Motor.num(nsPorElemento) + " ns = " +
          rotuloTiempo(m.sec) }] });
    filas.push({ rotulo: Motor.num(f.n) + " · " + procesos + " procesos",
      valor: rotuloTiempo(m.par),
      bloques: [{ inicio: 0, fin: m.par / tope, color: gana ? "var(--verde)" : "var(--rojo)",
        texto: Motor.num(m.sec / m.par, 2) + "×",
        titulo: Motor.num(arranqueMs) + " ms de arranque + " +
          rotuloTiempo(m.sec / procesos) + " de trabajo = " + rotuloTiempo(m.par) }] });
  });
  return filas;
}

/* Veredicto de la prediccion de nucleos ocupados con cuatro hilos. */
function explicarNucleos(bien, real, dicho) {
  var num = Motor.num;
  var h = MEDIDO_PERF[0], p = MEDIDO_PERF[1];
  var s = bien ? "Sí: " + num(real, 2) + " núcleos."
               : "No: son " + num(real, 2) + " núcleos, no " + num(dicho, 2) + ".";
  s += " " + num(h.cpuMs, 2) + " ms de CPU entre " + num(h.relojMs) + " ms de reloj dan " +
    num(real, 2) + ": hubo un solo hilo ejecutando bytecode en todo momento y los otros tres " +
    "esperando el GIL. Por eso el tiempo con hilos no baja del secuencial. " +
    "La misma división con los cuatro procesos, " + num(p.cpuMs, 2) + " ms en " +
    num(p.relojMs / 1000, 3) + " s, da " + num(nucleos(p.cpuMs, p.relojMs), 2) +
    " núcleos ocupados de los " + num(MAQUINA.nucleosFisicos) + " físicos, y ahí el tiempo " +
    "de CPU sube porque arrancar cuatro intérpretes se paga aparte.";
  return s;
}

/* Veredicto de la prediccion del primer tamano en que gana la version con
   procesos.                                                               */
function explicarCruce(bien, real, dicho) {
  var num = Motor.num;
  var chico = TAMANOS[0], antes = TAMANOS[1], gana = TAMANOS[2];
  var s = bien ? "Sí: " + num(real) + " elementos."
               : "No: el primero es " + num(real) + " elementos, no " + num(dicho) + ".";
  s += " Con " + num(chico.n) + " elementos el trabajo secuencial es " + num(chico.sec, 2) +
    " ms contra " + num(chico.par, 2) + " ms de la versión con procesos, " +
    num(chico.par / chico.sec) + " veces peor: casi todo lo que se mide ahí es el arranque. " +
    "En " + num(gana.n) + " el secuencial ya son " + num(gana.sec, 2) + " ms contra " +
    num(gana.par, 2) + " ms, speedup " + num(speedup(gana), 2) + "×. El cruce queda entre " +
    num(antes.n) + " y " + num(gana.n) + ", donde el trabajo empieza a superar el costo de " +
    "arrancar los cuatro procesos.";
  return s;
}

/* Carta 5: repartir 50.000 elementos de 2 ms entre cuatro procesos. */
var CASO = { elementos: 50000, msPorElemento: 2 };

var RAZONES = {
  correcta: "En lotes grandes. 50.000 entre 4 son 12.500 elementos por proceso, y los 17 ms " +
    "de arranque se pagan una sola vez. El trabajo total es 50.000 × 2 ms = 100 s; repartido " +
    "en cuatro lotes queda en unos 25 s, con esos 17 ms encima.",
  uno: "Un proceso por elemento son 50.000 arranques. Crear cuatro cuesta 17 ms, unos 4,25 ms " +
    "cada uno: 50.000 × 4,25 ms son 212 s solo en levantar intérpretes, más del doble de los " +
    "100 s que tarda la versión secuencial.",
  pool: "Con chunksize=1 cada uno de los 50.000 elementos cruza el canal de ida y su " +
    "resultado de vuelta, serializado, en lugar de cuatro envíos de 12.500. Ese ir y venir se " +
    "paga 50.000 veces y el proceso queda esperando el siguiente elemento entre tarea y tarea.",
  hilos: "Crear un hilo cuesta menos, pero la función es cálculo puro y los hilos se turnan " +
    "el GIL: la medición con cuatro hilos dio 1.607,65 ms de CPU en 1,617 s de reloj, 0,99 " +
    "núcleos ocupados. Los 100 s seguirían siendo 100 s."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MAQUINA: MAQUINA, PROCESOS: PROCESOS, HILOS: HILOS, ARRANQUE_MS: ARRANQUE_MS,
    NS_MEDIDO: NS_MEDIDO, MEDIDO_PERF: MEDIDO_PERF, TAMANOS: TAMANOS, CASO: CASO,
    RAZONES: RAZONES,
    nucleos: nucleos, speedup: speedup, modelo: modelo, cruce: cruce,
    crucePorTabla: crucePorTabla, crucePorModelo: crucePorModelo,
    rotuloTiempo: rotuloTiempo, filasHilos: filasHilos, filasProcesos: filasProcesos,
    filasModelo: filasModelo, explicarNucleos: explicarNucleos, explicarCruce: explicarCruce
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  // las dos cuentas que piden las predicciones quedan en "?" hasta comprobarlas
  var destapado = { perf: false, tabla: false };
  var TANDAS = 8;

  function leerRango(id, minimo) {
    var v = parseInt(document.getElementById(id).value, 10);
    return isNaN(v) || v < minimo ? minimo : v;
  }
  function arranque() { return leerRango("rango-arranque", 1); }
  function nsElemento() { return leerRango("rango-ns", 10); }

  function pintarPerf() {
    document.getElementById("cuerpo-perf").innerHTML = MEDIDO_PERF.map(function (m) {
      return "<tr><td style=\"text-align:left\">" + m.etiqueta + "</td><td>" +
        num(m.cpuMs, 2) + " ms</td><td>" + num(m.relojMs / 1000, 3) + " s</td>" +
        (destapado.perf ? "<td>" + num(nucleos(m.cpuMs, m.relojMs), 2) + "</td>"
                        : "<td class=\"pend\">?</td>") + "</tr>";
    }).join("");
  }

  function pintarLadoALado() {
    var h = MEDIDO_PERF[0], p = MEDIDO_PERF[1];
    var escala = h.relojMs;   // las dos lineas de tiempo, al mismo ancho
    Motor.pintarGantt("panel-hilos", filasHilos(h, HILOS, TANDAS), escala);
    Motor.pintarGantt("panel-procesos", filasProcesos(p, PROCESOS, ARRANQUE_MS), escala);
    Motor.pintarChips("chips-nucleos", [
      { texto: "hilos", valor: num(h.cpuMs, 2) + " ms / " + num(h.relojMs / 1000, 3) + " s" },
      { texto: "hilos, núcleos ocupados", cuenta: true,
        valor: destapado.perf ? num(nucleos(h.cpuMs, h.relojMs), 2) : "?" },
      { texto: "procesos", valor: num(p.cpuMs, 2) + " ms / " + num(p.relojMs / 1000, 3) + " s" },
      { texto: "procesos, núcleos ocupados", cuenta: true,
        valor: destapado.perf ? num(nucleos(p.cpuMs, p.relojMs), 2) : "?" },
      { texto: "núcleos físicos", valor: num(MAQUINA.nucleosFisicos) }
    ]);
  }

  function pintarTamanos() {
    document.getElementById("cuerpo-tamanos").innerHTML = TAMANOS.map(function (f) {
      return "<tr><td>" + num(f.n) + "</td><td>" + num(f.sec, 2) + " ms</td><td>" +
        num(f.par, 2) + " ms</td>" +
        (destapado.tabla ? "<td>" + num(speedup(f), 2) + "×</td>"
                         : "<td class=\"pend\">?</td>") + "</tr>";
    }).join("");
  }

  function pintarModelo() {
    var a = arranque(), ns = nsElemento();
    document.getElementById("valor-arranque").textContent = num(a) + " ms";
    document.getElementById("valor-ns").textContent = num(ns) + " ns";
    Motor.pintarGantt("panel-modelo", filasModelo(TAMANOS, ns, a, PROCESOS), 1);
    var gana = crucePorModelo(TAMANOS, ns, a, PROCESOS);
    Motor.pintarChips("chips-modelo", [
      { texto: "arranque de los " + PROCESOS, valor: num(a) + " ms" },
      { texto: "trabajo por elemento", valor: num(ns) + " ns" },
      { texto: "el modelo empata en", cuenta: true,
        valor: num(Math.round(cruce(ns, a, PROCESOS))) + " elementos" },
      { texto: "primer tamaño que gana", cuenta: true,
        valor: gana === null ? "ninguno de los cinco" : num(gana) }
    ]);
  }

  function veredictoNucleos(bien, real, dicho) {
    destapado.perf = true;
    pintarPerf();
    pintarLadoALado();
    return explicarNucleos(bien, real, dicho);
  }

  function veredictoCruce(bien, real, dicho) {
    destapado.tabla = true;
    pintarTamanos();
    return explicarCruce(bien, real, dicho);
  }

  Motor.conectarPrediccion(
    { entrada: "prediccion-nucleos", boton: "btn-comprobar-nucleos", veredicto: "veredicto-nucleos" },
    function () { return nucleos(MEDIDO_PERF[0].cpuMs, MEDIDO_PERF[0].relojMs); },
    veredictoNucleos);
  Motor.conectarPrediccion(
    { entrada: "prediccion-cruce", boton: "btn-comprobar-cruce", veredicto: "veredicto-cruce" },
    function () { return crucePorTabla(TAMANOS); },
    veredictoCruce);
  Motor.conectarOpciones("opciones-reparto", "veredicto-reparto", RAZONES);

  ["rango-arranque", "rango-ns"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", pintarModelo);
  });

  pintarPerf();
  pintarLadoALado();
  pintarTamanos();
  pintarModelo();
})();
