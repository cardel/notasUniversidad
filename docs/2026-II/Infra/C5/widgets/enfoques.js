if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Tres versiones del mismo ciclo: sumar un vector de 1.000.000 de enteros con
   std::thread, con TBB y con OpenMP. Aqui estan los cuatro tiempos medidos, la
   tabla de los siete criterios, el costo de mil repeticiones y los tres casos
   de uso. Todo sale de las cifras de la sesion, sin DOM y sin azar.        */

var VECTOR = 1000000;        // enteros del vector de la medicion
var HILOS = 4;               // hilos en las tres versiones paralelas
var SECUENCIAL = 0.13;       // ms de la version de un hilo

var TIEMPOS = [
  { id: "secuencial", corto: "secuencial", nombre: "Secuencial",
    detalle: "un hilo", ms: 0.13, color: "var(--gris)" },
  { id: "thread", corto: "std::thread", nombre: "std::thread",
    detalle: "4 hilos por llamada", ms: 0.21, color: "var(--azul)" },
  { id: "tbb", corto: "TBB", nombre: "TBB parallel_reduce",
    detalle: "equipo de hilos de la biblioteca", ms: 0.09, color: "var(--verde)" },
  { id: "openmp", corto: "OpenMP", nombre: "OpenMP parallel for reduction",
    detalle: "equipo de 4 hilos", ms: 0.13, color: "var(--ambar)" }
];

/* Cuantas veces cabe b en a: 0,21 contra 0,13 da 1,62. */
function relacion(a, b) { return a / b; }

var REPETICIONES = [
  { id: "openmp", estrategia: "OpenMP, 1.000 regiones paralelas",
    total: 24, repeticiones: 1000, color: "var(--ambar)" },
  { id: "thread", estrategia: "std::thread, crear 4 hilos cada vez",
    total: 116, repeticiones: 1000, color: "var(--azul)" }
];

function porRepeticion(fila) { return fila.total / fila.repeticiones; }

var TABLA_CUALITATIVA = [
  { criterio: "Líneas para el ejemplo", thread: 14, tbb: 12, openmp: 3 },
  { criterio: "Facilidad", thread: "baja", tbb: "media", openmp: "alta" },
  { criterio: "Control sobre los hilos", thread: "total", tbb: "escaso",
    openmp: "por cláusulas" },
  { criterio: "Balance de carga", thread: "manual", tbb: "automático",
    openmp: "schedule" },
  { criterio: "Reutiliza los hilos", thread: "no", tbb: "sí", openmp: "sí" },
  { criterio: "Dependencias", thread: "solo el estándar",
    tbb: "biblioteca externa", openmp: "bandera -fopenmp" },
  { criterio: "Volver a secuencial", thread: "reescribir", tbb: "reescribir",
    openmp: "quitar la bandera" }
];

var ENFOQUES = ["thread", "tbb", "openmp"];

var CASOS = [
  {
    id: "a",
    texto: "Hay que paralelizar un ciclo de un programa que ya funciona, sin " +
      "tocar su estructura.",
    correcta: "openmp",
    razones: {
      openmp: "Sí. La directiva y el ciclo son tres líneas y el resto del " +
        "programa queda como estaba. Si la medición no acompaña, se quita " +
        "-fopenmp y el binario vuelve a ser el secuencial, sin editar una " +
        "sola línea del ciclo.",
      thread: "Pide sacar el cuerpo del ciclo a una función aparte, repartir " +
        "los índices a mano y combinar los cuatro parciales: catorce líneas " +
        "contra tres, y el programa que ya funcionaba cambia de estructura. " +
        "Para volver a secuencial hay que reescribirlo.",
      tbb: "parallel_reduce resuelve este ciclo en doce líneas, pero el " +
        "cuerpo tiene que convertirse en dos lambdas y hay que instalar y " +
        "enlazar la biblioteca. OpenMP solo necesita la bandera del compilador."
    }
  },
  {
    id: "b",
    texto: "El programa necesita hilos de larga vida que hacen tareas " +
      "distintas, con control sobre cuándo se crean y cuándo se sincronizan.",
    correcta: "thread",
    razones: {
      thread: "Sí. Es el único de los tres con control total sobre los hilos: " +
        "el objeto thread se crea donde convenga, recibe la función que ese " +
        "hilo va a correr y el join se pone donde haga falta esperarlo. Las " +
        "catorce líneas del ejemplo son el precio de esa libertad.",
      openmp: "El control que da OpenMP son cláusulas: private, shared, " +
        "reduction, schedule. Los hilos nacen al entrar en la región paralela " +
        "y se quedan esperando al salir; no hay un objeto por hilo al que " +
        "darle una tarea propia y esperarlo aparte.",
      tbb: "TBB administra los hilos por su cuenta y por eso en la tabla el " +
        "control sobre ellos queda en escaso. Reparte tareas cortas entre su " +
        "propio equipo, no sostiene cuatro hilos de larga vida con trabajos " +
        "distintos."
    }
  },
  {
    id: "c",
    texto: "La aplicación arma un grafo de tareas, comparte contenedores " +
      "concurrentes y necesita que el tamaño de bloque se ajuste solo.",
    correcta: "tbb",
    razones: {
      tbb: "Sí. Grafos de tareas, contenedores concurrentes y robo de trabajo " +
        "vienen con la biblioteca, y blocked_range parte el rango en bloques " +
        "sin que nadie fije el tamaño. Cuesta la dependencia externa: hay que " +
        "instalarla y enlazarla, mientras OpenMP vive de una bandera.",
      openmp: "El balance de OpenMP se ajusta con schedule, estático o " +
        "dinámico, sobre un ciclo. No trae grafo de tareas ni contenedores " +
        "concurrentes, así que esa parte habría que escribirla a mano.",
      thread: "Con std::thread el balance de carga es manual: quien escribe " +
        "el programa fija los subrangos, como los SIZE/4 del ejemplo. El " +
        "grafo de tareas y los contenedores concurrentes habría que " +
        "construirlos desde cero sobre el estándar."
    }
  }
];

function buscarCaso(id) {
  var hallados = CASOS.filter(function (c) { return c.id === id; });
  return hallados.length ? hallados[0] : null;
}

/* Devuelve el enfoque que le conviene al caso: 'thread', 'tbb' u 'openmp'. */
function elegir(caso) {
  var c = buscarCaso(caso);
  return c ? c.correcta : null;
}

/* Las razones con la clave del enfoque correcto renombrada a "correcta",
   que es lo que espera Motor.conectarOpciones.                            */
function razonesOpciones(caso) {
  var c = buscarCaso(caso);
  var r = {};
  if (!c) { return r; }
  ENFOQUES.forEach(function (k) {
    r[k === c.correcta ? "correcta" : k] = c.razones[k];
  });
  return r;
}

var RAZONES_OVERHEAD = {
  correcta: "Sí. OpenMP crea el equipo de cuatro hilos una vez y lo deja " +
    "esperando entre región y región, así que cada repetición cuesta " +
    "0,024 ms. La versión con std::thread crea y destruye cuatro hilos en " +
    "cada repetición, a decenas de microsegundos por hilo, y la repetición " +
    "sube a 0,116 ms. Mil repeticiones de esa diferencia son los 92 ms que " +
    "separan los 24 de los 116.",
  "menos-hilos": "Los dos corren con cuatro hilos y reparten el mismo vector " +
    "de 100.000 enteros. Lo que cambia es cuántas veces se crean esos cuatro " +
    "hilos: una sola vez en OpenMP, mil veces en la versión con std::thread.",
  "menos-trabajo": "El ciclo es el mismo en los dos casos, el mismo vector de " +
    "100.000 enteros repetido mil veces, y las sumas que hace cada hilo son " +
    "idénticas. Los 92 ms de diferencia no son suma: son creación y " +
    "destrucción de hilos.",
  tbb: "TBB también mantiene su equipo de hilos vivo entre llamadas, igual " +
    "que OpenMP. En el vector de un millón quedó en 0,09 ms, el mejor de los " +
    "cuatro tiempos. El que paga la creación en cada repetición es std::thread."
};

function explicarPrediccion(bien, real, dicho) {
  var num = Motor.num;
  var s = bien
    ? "Sí: " + num(real, 2) + " ms. "
    : "No: " + num(real, 2) + " ms, no " + num(dicho, 2) + ". ";
  s += "Un millón de enteros es poco trabajo. Son " +
    num(relacion(real, SECUENCIAL), 2) + " veces el tiempo secuencial, " +
    num(SECUENCIAL, 2) + " ms, porque crear y destruir cuatro hilos cuesta " +
    "más que recorrer el vector. TBB y OpenMP mantienen un equipo de hilos " +
    "vivo y bajan a " + num(TIEMPOS[2].ms, 2) + " y " + num(TIEMPOS[3].ms, 2) +
    " ms. La ganancia de verdad aparece con vectores de mil millones.";
  return s;
}

/* Filas para Motor.pintarGantt. Mientras destapado sea falso, las barras van
   vacias y el valor queda en "?".                                          */
function filasBarras(destapado) {
  return TIEMPOS.map(function (t) {
    return {
      rotulo: t.corto,
      valor: destapado ? Motor.num(t.ms, 2) + " ms" : "?",
      bloques: destapado
        ? [{ inicio: 0, fin: t.ms, color: t.color,
             titulo: t.nombre + ", " + t.detalle }]
        : []
    };
  });
}

function escalaBarras() {
  return TIEMPOS.reduce(function (m, t) { return Math.max(m, t.ms); }, 0);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    VECTOR: VECTOR, HILOS: HILOS, SECUENCIAL: SECUENCIAL,
    TIEMPOS: TIEMPOS, REPETICIONES: REPETICIONES,
    TABLA_CUALITATIVA: TABLA_CUALITATIVA, ENFOQUES: ENFOQUES, CASOS: CASOS,
    RAZONES_OVERHEAD: RAZONES_OVERHEAD,
    relacion: relacion, porRepeticion: porRepeticion, buscarCaso: buscarCaso,
    elegir: elegir, razonesOpciones: razonesOpciones,
    explicarPrediccion: explicarPrediccion, filasBarras: filasBarras,
    escalaBarras: escalaBarras
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var destapado = false;          // la carta 3 se abre al comprobar la prediccion
  var respondidos = {};           // casos de la carta 5 con respuesta

  function pintarLineas() {
    var f = TABLA_CUALITATIVA[0];
    Motor.pintarChips("chips-thread", [{ texto: "líneas", valor: num(f.thread) }]);
    Motor.pintarChips("chips-tbb", [{ texto: "líneas", valor: num(f.tbb) }]);
    Motor.pintarChips("chips-openmp",
      [{ texto: "líneas", valor: num(f.openmp), cuenta: true }]);
  }

  function pintarTiempos() {
    document.getElementById("cuerpo-tiempos").innerHTML =
      TIEMPOS.map(function (t) {
        var celdas = destapado
          ? "<td>" + num(t.ms, 2) + " ms</td><td>×" +
            num(relacion(t.ms, SECUENCIAL), 2) + "</td>"
          : "<td class=\"pend\">?</td><td class=\"pend\">?</td>";
        return "<tr><td style=\"text-align:left\">" + t.nombre + " (" +
          t.detalle + ")</td>" + celdas + "</tr>";
      }).join("");
    Motor.pintarGantt("barras-tiempos", filasBarras(destapado), escalaBarras());
    document.getElementById("nota-tiempos").textContent = destapado
      ? "Mejor de 20 repeticiones sobre un vector de " + num(VECTOR) +
        " de enteros con " + num(HILOS) + " hilos, en un AMD Ryzen 5 3600 de " +
        "6 núcleos y 12 hilos de hardware, compilado con g++ -O2. TBB es el " +
        "único que queda por debajo de la versión de un hilo; OpenMP la iguala."
      : "Los cuatro tiempos aparecen al comprobar la predicción de arriba.";
  }

  function pintarRepeticiones() {
    document.getElementById("cuerpo-repeticiones").innerHTML =
      REPETICIONES.map(function (f) {
        return "<tr><td style=\"text-align:left\">" + f.estrategia +
          "</td><td>" + num(f.total) + " ms</td><td>" +
          num(porRepeticion(f), 3) + " ms</td></tr>";
      }).join("");
    Motor.pintarChips("chips-repeticiones", [
      { texto: "vector", valor: num(100000) },
      { texto: "repeticiones", valor: num(REPETICIONES[0].repeticiones) },
      { texto: "hilos", valor: num(HILOS) },
      { texto: "std::thread contra OpenMP",
        valor: "×" + num(relacion(REPETICIONES[1].total,
          REPETICIONES[0].total), 2), cuenta: true }
    ]);
  }

  function pintarCualitativa() {
    document.getElementById("cuerpo-cualitativa").innerHTML =
      TABLA_CUALITATIVA.map(function (f) {
        return "<tr><td style=\"text-align:left\">" + f.criterio +
          "</td><td>" + f.thread + "</td><td>" + f.tbb + "</td><td>" +
          f.openmp + "</td></tr>";
      }).join("");
  }

  function pintarCasos() {
    CASOS.forEach(function (c) {
      document.getElementById("texto-caso-" + c.id).innerHTML =
        "<b>" + c.id + ")</b> " + c.texto;
    });
  }

  function revisarCierre() {
    var listos = CASOS.every(function (c) { return respondidos[c.id]; });
    if (listos) { document.getElementById("caja-cualitativa").hidden = false; }
  }

  Motor.conectarPrediccion(
    { entrada: "prediccion-thread", boton: "btn-comprobar-thread",
      veredicto: "veredicto-thread" },
    function () { return TIEMPOS[1].ms; },
    explicarPrediccion);

  document.getElementById("btn-comprobar-thread")
    .addEventListener("click", function () {
      destapado = true;
      pintarTiempos();
    });

  Motor.conectarOpciones("opciones-overhead", "veredicto-overhead",
    RAZONES_OVERHEAD);

  CASOS.forEach(function (c) {
    Motor.conectarOpciones("opciones-caso-" + c.id, "veredicto-caso-" + c.id,
      razonesOpciones(c.id));
    document.querySelectorAll("#opciones-caso-" + c.id + " button")
      .forEach(function (b) {
        b.addEventListener("click", function () {
          respondidos[c.id] = true;
          revisarCierre();
        });
      });
  });

  pintarLineas();
  pintarTiempos();
  pintarRepeticiones();
  pintarCualitativa();
  pintarCasos();
})();
