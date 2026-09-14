if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Granularidad: 400 tareas iguales en 100 tandas de 4 hilos, como en
   granularidad.cpp. El modelo tiene dos sumandos: lo que cuesta crear y unir
   un hilo (h, en microsegundos) y lo que cuesta una iteracion del ciclo de
   trabajo(n) (c, en nanosegundos).                                        */

var TAREAS = 400;
var HILOS = 4;
var TANDAS = TAREAS / HILOS;
var EXPONENTES = [3, 4, 5, 6, 7];

/* La tabla del deck, en ms. */
var MEDIDO = [
  { e: 3, sec: 0.4, par: 6.6 },
  { e: 4, sec: 4.0, par: 7.4 },
  { e: 5, sec: 39.4, par: 16.2 },
  { e: 6, sec: 393.6, par: 108.3 },
  { e: 7, sec: 3790.9, par: 1172.5 }
];

/* Tiempo secuencial en ms: 400 tareas de t iteraciones a c ns cada una. */
function sec(t, c) {
  return TAREAS * t * c / 1e6;
}

/* Tiempo con hilos en ms: en cada tanda se crean y unen 4 hilos (h us cada
   uno, uno tras otro en el hilo principal) y los cuatro calculan al tiempo. */
function par(t, h, c) {
  return TANDAS * (HILOS * h / 1000 + t * c / 1e6);
}

function relacion(t, h, c) {
  return sec(t, c) / par(t, h, c);
}

/* Exponente de la primera fila donde los hilos ganan, o null. */
function cruce(h, c) {
  for (var i = 0; i < EXPONENTES.length; i++) {
    if (relacion(Math.pow(10, EXPONENTES[i]), h, c) > 1) { return EXPONENTES[i]; }
  }
  return null;
}

/* Fraccion de una tanda que se va en administrar los hilos. */
function sobrecosto(t, h, c) {
  var admin = HILOS * h / 1000;
  return admin / (admin + t * c / 1e6);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TAREAS: TAREAS, HILOS: HILOS, TANDAS: TANDAS, EXPONENTES: EXPONENTES,
    MEDIDO: MEDIDO, sec: sec, par: par, relacion: relacion, cruce: cruce,
    sobrecosto: sobrecosto
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var h = 16;
  var c = 1;
  var destapada = false;

  function potencia(e) { return "10<sup>" + e + "</sup>"; }

  function pintarMedido() {
    var filas = MEDIDO.map(function (m) {
      var rel = m.sec / m.par;
      var celda = destapada
        ? "<td>" + num(rel, 2) + "</td>"
        : "<td class=\"pend\">?</td>";
      var modelo = destapada
        ? "<td>" + num(relacion(Math.pow(10, m.e), h, c), 2) + "</td>"
        : "";
      return "<tr><td>" + potencia(m.e) + "</td><td>" + num(m.sec, 1) +
        " ms</td><td>" + num(m.par, 1) + " ms</td>" + celda + modelo + "</tr>";
    }).join("");
    document.getElementById("cuerpo-medido").innerHTML = filas;
    document.getElementById("th-modelo").hidden = !destapada;
    document.getElementById("nota-modelo").hidden = !destapada;
  }

  function pintarModelo() {
    document.getElementById("ver-h").textContent = num(h);
    document.getElementById("ver-c").textContent = num(c, 1);
    var filas = EXPONENTES.map(function (e) {
      var t = Math.pow(10, e);
      var r = relacion(t, h, c);
      var gana = r > 1;
      return "<tr" + (e === cruce(h, c) ? " style=\"background:var(--resalte)\"" : "") +
        "><td>" + potencia(e) + "</td><td>" + num(sec(t, c), 1) + " ms</td><td>" +
        num(par(t, h, c), 1) + " ms</td><td style=\"color:" +
        (gana ? "var(--verde)" : "var(--rojo)") + "\">" + num(r, 2) + "</td></tr>";
    }).join("");
    document.getElementById("cuerpo-modelo").innerHTML = filas;

    var e = cruce(h, c);
    Motor.pintarChips("chips-modelo", [
      { texto: "una tanda gasta en hilos", valor: num(HILOS * h) + " µs", cuenta: true },
      { texto: "el cruce queda en", valor: e === null ? "ninguna fila" : "10<sup>" + e + "</sup>" },
      { texto: "relación en 10<sup>6</sup>", valor: num(relacion(1e6, h, c), 2) }
    ]);

    Motor.pintarGantt("panel-barras", EXPONENTES.map(function (e) {
      var t = Math.pow(10, e);
      var f = sobrecosto(t, h, c);
      return {
        rotulo: "tarea de 10<sup>" + e + "</sup>",
        valor: num(f * 100, 0) + " %",
        bloques: [
          { inicio: 0, fin: f, color: "var(--rojo)", titulo: "crear y unir hilos" },
          { inicio: f, fin: 1, color: "var(--azul)", titulo: "calcular" }
        ]
      };
    }), 1);
  }

  function explicar(bien, real, dicho) {
    destapada = true;
    pintarMedido();
    var base = "En 10⁴ la versión con hilos todavía pierde: 4,0 contra 7,4 ms. " +
      "En 10⁵ ya gana: 39,4 contra 16,2 ms. El cruce está entre 10⁴ y 10⁵, " +
      "así que la primera fila por encima de 1 es 10⁵.";
    if (bien) { return "Sí: 10⁵. " + base; }
    if (dicho < 5) {
      return "En 10^" + num(dicho) + " los hilos todavía pierden. " + base;
    }
    return "Cruza antes, en 10⁵. " + base;
  }

  var RAZONES = {
    correcta: "En la que se midió. En otra máquina, con otro sistema " +
      "operativo o con otro número de hilos, crear un hilo cuesta otra cosa " +
      "y la fila del cruce se mueve: se mide otra vez, no se hereda.",
    cuatro: "El costo de crear y unir un hilo depende del sistema operativo " +
      "y del procesador, no del número de núcleos. Dos máquinas de cuatro " +
      "núcleos pueden tener 16 y 160 µs, y el cruce queda una fila aparte.",
    algoritmo: "El algoritmo fija cuánto trabajo hay por tarea, no lo que " +
      "cuesta administrar un hilo. La perilla de arriba mueve el cruce sin " +
      "tocar una línea del programa.",
    memoria: "La memoria no entra en este ejemplo: trabajo(n) es un ciclo " +
      "sin arreglo. Lo que mueve el cruce es el costo del hilo y el costo de " +
      "cada iteración."
  };

  document.getElementById("rango-h").addEventListener("input", function (ev) {
    h = parseFloat(ev.target.value);
    pintarModelo();
    if (destapada) { pintarMedido(); }
  });
  document.getElementById("rango-c").addEventListener("input", function (ev) {
    c = parseFloat(ev.target.value);
    pintarModelo();
    if (destapada) { pintarMedido(); }
  });
  Motor.conectarPrediccion(
    { entrada: "prediccion", boton: "btn-comprobar", veredicto: "veredicto" },
    function () { return cruce(16, 1); },
    explicar);
  Motor.conectarOpciones("opciones-maquina", "veredicto-maquina", RAZONES);

  pintarMedido();
  pintarModelo();
})();
