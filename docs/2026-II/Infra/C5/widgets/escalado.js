if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Barrido de la integral de 4/(1+x^2) con mil millones de rectangulos, de 1 a
   12 hilos, en un AMD Ryzen 5 3600 de 6 nucleos y 12 hilos de hardware con
   g++ -O2. Cada tiempo es el minimo de tres repeticiones y OMP_DYNAMIC=false.
   De esos doce numeros salen la aceleracion, la eficiencia y la fraccion
   secuencial que estima Karp-Flatt; la tabla de Amdahl se calcula aparte.   */

var TIEMPOS = [1253.6, 637.7, 466.6, 346.8, 302.6, 252.6,
               272.9, 240.4, 227.5, 256.3, 275.8, 256.1];

var NUCLEOS = 6;          // nucleos fisicos de la maquina
var HILOS_HW = 12;        // hilos de hardware
var PI_IMPRESO = "3,1415926536";
var P_KARP = [2, 4, 6, 8, 12];
var F_AMDAHL = [0.01, 0.05, 0.10, 0.25];
var P_AMDAHL = [4, 12, 64];

/* Dos decimales fijos: Motor.num recorta los ceros del final y la columna de
   S(p) se lee mejor con todas las filas iguales. */
function num2(x) {
  var s = Motor.num(x, 2), c = s.indexOf(",");
  if (c < 0) { return s + ",00"; }
  if (s.length - c === 2) { return s + "0"; }
  return s;
}

function pct(x) { return Motor.num(x * 100, 0) + " %"; }

function tiempo(p) { return TIEMPOS[p - 1]; }

function speedup(p) { return TIEMPOS[0] / TIEMPOS[p - 1]; }

function eficiencia(p) { return speedup(p) / p; }

/* La fila de menos milisegundos del barrido. */
function mejorTiempo() {
  var mejor = { p: 1, ms: TIEMPOS[0] };
  TIEMPOS.forEach(function (ms, i) {
    if (ms < mejor.ms) { mejor = { p: i + 1, ms: ms }; }
  });
  return mejor;
}

/* Fraccion secuencial que explica la aceleracion medida con p hilos. Con un
   solo hilo la formula divide por cero y no dice nada. */
function karpFlatt(p) {
  if (p <= 1) { return NaN; }
  return (1 / speedup(p) - 1 / p) / (1 - 1 / p);
}

function amdahl(f, p) { return 1 / (f + (1 - f) / p); }

function techo(f) { return 1 / f; }

/* Una fila por numero de hilos: la aceleracion medida y, en claro, lo que
   faltaria para llegar a la diagonal ideal S = p. */
function filasCurva() {
  return TIEMPOS.map(function (ms, i) {
    var p = i + 1, s = speedup(p);
    var rotulo = p === NUCLEOS
      ? p + " hilos · " + NUCLEOS + " núcleos"
      : p + (p === 1 ? " hilo" : " hilos");
    return {
      rotulo: rotulo,
      valor: num2(s),
      bloques: [
        { inicio: 0, fin: s, color: p <= NUCLEOS ? "var(--azul)" : "var(--ambar)",
          texto: num2(s),
          titulo: p + (p === 1 ? " hilo: " : " hilos: ") + Motor.num(ms, 1) +
                  " ms, S = " + num2(s) + ", E = " + pct(eficiencia(p)) },
        { inicio: s, fin: p, color: "var(--azul-suave)", texto: "",
          titulo: "la diagonal ideal con " + p + " hilos daría S = " + p }
      ]
    };
  });
}

function explicarPrediccion(bien, real, dicho) {
  var m = mejorTiempo();
  var t = bien
    ? "Sí: nueve hilos, " + Motor.num(m.ms, 1) + " ms."
    : "No: el mejor tiempo sale con nueve hilos, " + Motor.num(m.ms, 1) +
      " ms, y no con " + num2(dicho) + ".";
  t += " Con doce hilos el programa tarda " + Motor.num(tiempo(12), 1) + " ms, " +
    Motor.num(tiempo(12) - m.ms, 1) + " ms más que con nueve. Pasados los seis " +
    "núcleos físicos la curva se aplana y los tiempos empiezan a subir y bajar " +
    "sin mejorar: " + Motor.num(tiempo(7), 1) + " ms con siete hilos, " +
    Motor.num(tiempo(8), 1) + " con ocho, " + Motor.num(tiempo(10), 1) + " con diez.";
  return t;
}

/* Lo que dicen los cinco valores de Karp-Flatt juntos. */
function lecturaCodo() {
  return "Hasta seis hilos la fracción estimada no pasa de " +
    Motor.num(karpFlatt(6), 3) + ", un " + Motor.num(karpFlatt(6) * 100, 1) +
    " % del programa. Con ocho sube a " + Motor.num(karpFlatt(8), 3) +
    " y con doce llega a " + Motor.num(karpFlatt(12), 3) + ". El código secuencial " +
    "no cambió entre corridas. Lo que crece es el costo de repartir el ciclo entre " +
    "más hilos que núcleos.";
}

var AVISO_CODO = "Con doce hilos la aceleración es " + num2(speedup(12)) +
  " y la eficiencia " + pct(eficiencia(12)) + "; con seis, " + num2(speedup(6)) +
  " y " + pct(eficiencia(6)) + ". Casi la misma aceleración con la mitad del " +
  "equipo: la otra mitad cobra sin producir, y por eso la eficiencia se parte " +
  "en dos tramos.";

var RAZONES_CODO = {
  correcta: "Sí. Seis hilos dan " + num2(speedup(6)) + " con una eficiencia de " +
    pct(eficiencia(6)) + "; doce dan " + num2(speedup(12)) + " con " +
    pct(eficiencia(12)) + ". Los seis hilos de más agregan cambios de contexto, " +
    "no trabajo terminado.",
  carrera: "El programa imprime " + PI_IMPRESO + " en las doce corridas. Una " +
    "carrera de datos daría una suma distinta cada vez, y aquí reduction(+ : suma) " +
    "le da a cada hilo su copia y las junta al final.",
  nucleos: "Los hilos 7 a 12 no son núcleos nuevos: la máquina tiene " + NUCLEOS +
    " núcleos físicos y " + HILOS_HW + " hilos de hardware, así que esos seis se " +
    "turnan las mismas unidades de ejecución que los seis primeros.",
  medicion: "Cada tiempo es el mínimo de tres repeticiones con OMP_DYNAMIC=false, " +
    "así que el número de hilos quedó fijo en cada corrida. De la misma medición " +
    "salen los " + Motor.num(TIEMPOS[0], 1) + " ms de un hilo y los " +
    Motor.num(tiempo(6), 1) + " ms de seis."
};

function resumenAmdahl(f, p) {
  return "Con f = " + Motor.num(f * 100, 0) + " % y " + p +
    (p === 1 ? " hilo" : " hilos") + " la aceleración se topa en " +
    Motor.num(amdahl(f, p), 1) + ". Agregar hilos la acerca a " +
    Motor.num(techo(f), 1) + " y de ahí no pasa: esa es la parte del programa " +
    "que ningún hilo extra puede repartir.";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TIEMPOS: TIEMPOS, NUCLEOS: NUCLEOS, HILOS_HW: HILOS_HW, P_KARP: P_KARP,
    F_AMDAHL: F_AMDAHL, P_AMDAHL: P_AMDAHL, RAZONES_CODO: RAZONES_CODO,
    AVISO_CODO: AVISO_CODO, num2: num2, pct: pct, tiempo: tiempo,
    speedup: speedup, eficiencia: eficiencia, mejorTiempo: mejorTiempo,
    karpFlatt: karpFlatt, amdahl: amdahl, techo: techo, filasCurva: filasCurva,
    explicarPrediccion: explicarPrediccion, lecturaCodo: lecturaCodo,
    resumenAmdahl: resumenAmdahl
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var vistoTiempos = false;   // la columna de ms destapa la prediccion
  var vistoSE = false;        // S y E, la grafica y los chips
  var vistoKarp = false;

  function pintarEscalado() {
    document.getElementById("cuerpo-escalado").innerHTML = TIEMPOS.map(function (ms, i) {
      var p = i + 1;
      var fila = p === mejorTiempo().p && vistoTiempos
        ? " style=\"background:var(--resalte)\"" : "";
      return "<tr" + fila + "><td>" + p + "</td>" +
        (vistoTiempos ? "<td>" + num(ms, 1) + "</td>" : "<td class=\"pend\">?</td>") +
        (vistoSE ? "<td>" + num2(speedup(p)) + "</td><td>" + pct(eficiencia(p)) + "</td>"
                 : "<td class=\"pend\">?</td><td class=\"pend\">?</td>") +
        "</tr>";
    }).join("");

    var m = mejorTiempo();
    Motor.pintarChips("chips-escalado", [
      { texto: "mejor tiempo",
        valor: vistoSE ? num(m.ms, 1) + " ms con " + m.p + " hilos" : "?" },
      { texto: "mejor aceleración",
        valor: vistoSE ? num2(speedup(m.p)) + " con " + m.p + " hilos" : "?" },
      { texto: "eficiencia con 6 hilos", valor: vistoSE ? pct(eficiencia(6)) : "?" },
      { texto: "eficiencia con 12 hilos", valor: vistoSE ? pct(eficiencia(12)) : "?",
        cuenta: true }
    ]);

    if (vistoSE) {
      Motor.pintarGantt("grafica", filasCurva(), HILOS_HW);
      document.getElementById("leyenda-grafica").textContent =
        "La barra llena es la aceleración medida y la franja clara llega hasta " +
        "S = p, la diagonal ideal. Azul, hasta los seis núcleos físicos; ámbar, " +
        "de siete hilos en adelante, donde la curva se despega de la diagonal.";
    }
  }

  function pintarKarp() {
    var celdas = P_KARP.map(function (p) {
      return vistoKarp ? "<td>" + num(karpFlatt(p), 3) + "</td>"
                       : "<td class=\"pend\">?</td>";
    }).join("");
    document.getElementById("cuerpo-karp").innerHTML =
      "<tr><th>f estimada</th>" + celdas + "</tr>";
    document.getElementById("lectura-codo").textContent = vistoKarp ? lecturaCodo() : "";
  }

  function pintarAmdahl() {
    var f = Number(document.getElementById("f-amdahl").value) / 100;
    var p = Number(document.getElementById("p-amdahl").value);
    document.getElementById("valor-f").textContent = num(f * 100, 0) + " %";
    document.getElementById("valor-p").textContent = String(p);
    Motor.pintarChips("chips-amdahl", [
      { texto: "S(p)", valor: num(amdahl(f, p), 1) },
      { texto: "techo 1/f", valor: num(techo(f), 1) },
      { texto: "eficiencia", valor: pct(amdahl(f, p) / p), cuenta: true }
    ]);
    document.getElementById("cuenta-amdahl").textContent = resumenAmdahl(f, p);
    document.getElementById("cuerpo-amdahl").innerHTML = F_AMDAHL.map(function (ff) {
      var fila = "<tr><th>" + num(ff * 100, 0) + " %</th>";
      P_AMDAHL.forEach(function (pp) {
        var marca = Math.round(f * 100) === Math.round(ff * 100) && p === pp;
        fila += "<td" + (marca ? " class=\"marcada\"" : "") + ">" +
          num(amdahl(ff, pp), 1) + "</td>";
      });
      return fila + "<td>" + num(techo(ff), 0) + "</td></tr>";
    }).join("");
  }

  document.getElementById("btn-se").addEventListener("click", function () {
    vistoTiempos = true; vistoSE = true; pintarEscalado();
  });
  document.getElementById("btn-karp").addEventListener("click", function () {
    vistoKarp = true; pintarKarp();
  });
  document.getElementById("f-amdahl").addEventListener("input", pintarAmdahl);
  document.getElementById("p-amdahl").addEventListener("input", pintarAmdahl);

  Motor.conectarPrediccion(
    { entrada: "prediccion-mejor", boton: "btn-comprobar-mejor",
      veredicto: "veredicto-mejor" },
    function () { return mejorTiempo().p; },
    explicarPrediccion);
  document.getElementById("btn-comprobar-mejor").addEventListener("click", function () {
    vistoTiempos = true; pintarEscalado();
  });

  Motor.conectarOpciones("opciones-codo", "veredicto-codo", RAZONES_CODO);
  document.querySelectorAll("#opciones-codo button").forEach(function (b) {
    b.addEventListener("click", function () {
      var caja = document.getElementById("alerta-codo");
      caja.className = "alerta";
      caja.textContent = AVISO_CODO;
    });
  });

  pintarEscalado();
  pintarKarp();
  pintarAmdahl();
})();
