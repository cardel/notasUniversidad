if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Descomposicion de tareas: tres recorridos independientes sobre el mismo
   vector de 50 millones (maximo, suma y cuantos son pares), cada uno en su
   propio hilo. Lo medido en el deck: 94 ms uno tras otro, 44 ms con tres
   hilos. Las tres preguntas son de opciones y cada distractor lleva su
   razon.                                                                  */

var N = 50000000;

var MEDIDO = { secuencial: 94, paralelo: 44 };

/* Los trabajos que reparte el codigo del deck, en el orden de los hilos. */
var TAREAS = [
  { id: "maximo", hilo: "t_a", resultado: "m" },
  { id: "suma",   hilo: "t_b", resultado: "s" },
  { id: "pares",  hilo: "t_c", resultado: "p" }
];

var CODIGO = [
  "thread t_a(maximo, cref(v), ref(m));",
  "thread t_b(suma,   cref(v), ref(s));",
  "thread t_c(pares,  cref(v), ref(p));",
  "t_a.join(); t_b.join(); t_c.join();"
];

/* Aceleracion redondeada a un decimal, como se lee en el deck. */
function aceleracion(medido) {
  return Math.round(medido.secuencial / medido.paralelo * 10) / 10;
}

/* Cuantos hilos reciben trabajo: nunca mas que tareas hay. */
function hilosConTrabajo(hilos, tareas) {
  return Math.min(hilos, tareas.length);
}

var PREGUNTAS = [
  {
    id: "a",
    enunciado: "Con tres hilos, uno por recorrido, ¿cuánto acelera?",
    opciones: [
      { op: "mas3",     texto: "Más de 3" },
      { op: "tres",     texto: "Exactamente 3" },
      { op: "correcta", texto: "Menos de 3" },
      { op: "menos1",   texto: "Menos de 1" }
    ],
    razones: {
      correcta: "Eso es. Medido: 94 ms uno tras otro contra 44 ms con tres " +
        "hilos, una aceleración de 2,1. Las tres tareas no cuestan lo mismo " +
        "y el total lo marca la más lenta; además las tres recorren el mismo " +
        "vector al tiempo y compiten por la memoria.",
      mas3: "Más de 3 pediría que cada hilo hiciera menos que un tercio del " +
        "trabajo, y aquí cada uno recorre los 50 millones enteros. Lo medido " +
        "es 44 ms contra 94: aceleración 2,1.",
      tres: "Sería 3 si las tres tareas duraran lo mismo y la memoria " +
        "atendiera a tres hilos igual que a uno. Ninguna de las dos cosas " +
        "pasa: 94 ms contra 44 ms, aceleración 2,1.",
      menos1: "Menos de 1 significaría que los tres hilos tardan más que la " +
        "versión secuencial. Lo medido es lo contrario: 44 ms contra 94, " +
        "aceleración 2,1."
    }
  },
  {
    id: "b",
    enunciado: "¿Qué hace un cuarto hilo?",
    opciones: [
      { op: "mitad",    texto: "Toma la mitad de la tarea más lenta" },
      { op: "memoria",  texto: "Reparte la memoria" },
      { op: "correcta", texto: "Nada: no hay cuarto trabajo" },
      { op: "combina",  texto: "Combina los parciales" }
    ],
    razones: {
      correcta: "Eso es. Hay tres trabajos y tres hilos; el cuarto no tiene " +
        "nada que tomar. Al repartir trabajos el tope lo pone el número de " +
        "tareas, no el de núcleos.",
      mitad: "Partir la tarea más lenta en dos es otra estrategia, la de " +
        "datos, y hay que escribirla: dos hilos sobre mitades del vector y " +
        "una combinación al final. El código de arriba reparte trabajos, y " +
        "son tres.",
      memoria: "La memoria no se reparte por poner hilos. Los tres siguen " +
        "leyendo el mismo vector de 50 millones, y un cuarto hilo sería otro " +
        "lector sobre el mismo bus.",
      combina: "Los tres resultados no se combinan: el máximo, la suma y el " +
        "conteo de pares son tres respuestas distintas. No hay un paso final " +
        "que un cuarto hilo pueda hacer."
    }
  },
  {
    id: "c",
    enunciado: "¿Cuándo conviene repartir trabajos y no datos?",
    opciones: [
      { op: "nucleos",  texto: "Siempre que haya más de un núcleo" },
      { op: "enormes",  texto: "Cuando los datos son enormes y la operación es una sola" },
      { op: "correcta", texto: "Cuando hay varias operaciones independientes sobre datos que caben" },
      { op: "dependen", texto: "Cuando una operación necesita el resultado de otra" }
    ],
    razones: {
      correcta: "Eso es. Varias operaciones que no se necesitan entre sí, " +
        "sobre datos que caben en memoria: cada hilo toma una operación " +
        "completa y no hay nada que combinar al final.",
      nucleos: "Tener más de un núcleo no dice qué repartir. Con un solo " +
        "trabajo sobre un vector enorme lo que se parte es el vector; con " +
        "varios trabajos independientes se parten los trabajos.",
      enormes: "Ese es el caso de repartir datos: una operación y muchos " +
        "elementos, así que cada hilo toma un trozo. Aquí hay tres " +
        "operaciones distintas sobre el mismo vector.",
      dependen: "Si una operación necesita el resultado de otra, no pueden " +
        "correr al tiempo: la segunda espera a la primera y el reparto " +
        "queda en secuencia, igual que los 94 ms."
    }
  }
];

/* Cada pregunta trae exactamente una opcion "correcta", una razon por cada
   opcion y ninguna razon sin opcion. Devuelve true si todo cuadra.        */
function validar(preguntas) {
  var ids = {};
  for (var i = 0; i < preguntas.length; i++) {
    var q = preguntas[i];
    if (!q.id || ids[q.id]) { return false; }
    ids[q.id] = true;
    if (!q.enunciado || !q.opciones || !q.opciones.length) { return false; }
    var correctas = 0, vistas = {};
    for (var j = 0; j < q.opciones.length; j++) {
      var op = q.opciones[j].op;
      if (!op || vistas[op] || !q.opciones[j].texto) { return false; }
      vistas[op] = true;
      if (op === "correcta") { correctas += 1; }
      if (typeof q.razones[op] !== "string" || !q.razones[op]) { return false; }
    }
    if (correctas !== 1) { return false; }
    var claves = Object.keys(q.razones);
    for (var k = 0; k < claves.length; k++) {
      if (!vistas[claves[k]]) { return false; }
    }
  }
  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    N: N, MEDIDO: MEDIDO, TAREAS: TAREAS, CODIGO: CODIGO, PREGUNTAS: PREGUNTAS,
    aceleracion: aceleracion, hilosConTrabajo: hilosConTrabajo, validar: validar
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var COLORES = ["bloque-1", "bloque-2", "bloque-3"];

  function pintarCodigo() {
    document.getElementById("codigo-deck").innerHTML = CODIGO.map(function (l, i) {
      var clase = i < TAREAS.length ? " " + COLORES[i] : "";
      return "<div class=\"linea" + clase + "\"><span class=\"num\">" + (i + 1) +
        "</span><span class=\"txt\">" + l + "</span></div>";
    }).join("");
  }

  function pintarMedido() {
    var acel = aceleracion(MEDIDO);
    Motor.pintarGantt("panel-gantt", [
      { rotulo: "uno tras otro", valor: num(MEDIDO.secuencial) + " ms",
        bloques: [{ inicio: 0, fin: MEDIDO.secuencial, color: "var(--azul)",
                    texto: "máximo, luego suma, luego pares" }] },
      { rotulo: "tres hilos", valor: num(MEDIDO.paralelo) + " ms",
        bloques: [{ inicio: 0, fin: MEDIDO.paralelo, color: "var(--verde)",
                    texto: "los tres a la vez" }] }
    ], MEDIDO.secuencial);
    Motor.pintarChips("panel-chips", [
      { texto: "secuencial", valor: num(MEDIDO.secuencial) + " ms" },
      { texto: "tres hilos", valor: num(MEDIDO.paralelo) + " ms" },
      { texto: "aceleración", valor: num(acel, 1), cuenta: true }
    ]);
    document.getElementById("panel-medido").hidden = false;
  }

  PREGUNTAS.forEach(function (q) {
    Motor.conectarOpciones("opciones-" + q.id, "veredicto-" + q.id, q.razones);
  });
  // La medicion aparece al responder la primera pregunta, acierte o no.
  document.querySelectorAll("#opciones-a button").forEach(function (b) {
    b.addEventListener("click", pintarMedido);
  });

  pintarCodigo();
})();
