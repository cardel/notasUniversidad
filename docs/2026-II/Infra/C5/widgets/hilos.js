if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Cuantos hilos abre de verdad una region paralela de OpenMP. Un ambiente es
   { ompNumThreads, setNumThreads, clausulaNumThreads, nucleosLogicos }: los
   tres primeros son lo que fija quien corre el programa y el ultimo es lo que
   trae la maquina. La precedencia va de la clausula hacia la maquina. Las
   cifras medidas estan en MAQUINA y en INVOCACIONES.                        */

var MAQUINA = {
  nombre: "AMD Ryzen 5 3600",
  nproc: 12,
  nucleosPorSocket: 6,
  hilosPorNucleo: 2
};

/* En orden: la primera fuente fijada se queda con el equipo. */
var FUENTES = [
  { clave: "clausula", campo: "clausulaNumThreads", rotulo: "num_threads(n) en la directiva" },
  { clave: "llamada", campo: "setNumThreads", rotulo: "omp_set_num_threads(n)" },
  { clave: "variable", campo: "ompNumThreads", rotulo: "OMP_NUM_THREADS" },
  { clave: "maquina", campo: "nucleosLogicos", rotulo: "los hilos que trae la máquina" }
];

/* Salidas medidas de hilos.cpp en esa maquina. */
var INVOCACIONES = [
  { invocacion: "./hilos", max: 12, region: 12 },
  { invocacion: "OMP_NUM_THREADS=1 ./hilos", max: 1, region: 1 },
  { invocacion: "OMP_NUM_THREADS=4 ./hilos", max: 4, region: 4 }
];

var AMBIENTES = [
  {
    clave: "libre", rotulo: "sin fijar nada",
    ambiente: { nucleosLogicos: 12 },
    lineas: ["$ ./programa", "", "#pragma omp parallel"]
  },
  {
    clave: "variable", rotulo: "OMP_NUM_THREADS=4",
    ambiente: { ompNumThreads: 4, nucleosLogicos: 12 },
    lineas: ["$ OMP_NUM_THREADS=4 ./programa", "", "#pragma omp parallel"]
  },
  {
    clave: "las-tres", rotulo: "las tres a la vez",
    ambiente: { ompNumThreads: 4, setNumThreads: 8, clausulaNumThreads: 2, nucleosLogicos: 12 },
    lineas: ["$ OMP_NUM_THREADS=4 ./programa", "", "omp_set_num_threads(8);",
             "#pragma omp parallel num_threads(2)"]
  }
];

function ambientePorClave(clave) {
  for (var i = 0; i < AMBIENTES.length; i++) {
    if (AMBIENTES[i].clave === clave) { return AMBIENTES[i]; }
  }
  return AMBIENTES[0];
}

function rotuloDeFuente(clave) {
  for (var i = 0; i < FUENTES.length; i++) {
    if (FUENTES[i].clave === clave) { return FUENTES[i].rotulo; }
  }
  return "";
}

/* Hilos del equipo que abre la region. */
function hilosDeLaRegion(ambiente) {
  var a = ambiente || {};
  if (a.clausulaNumThreads) { return a.clausulaNumThreads; }
  if (a.setNumThreads) { return a.setNumThreads; }
  if (a.ompNumThreads) { return a.ompNumThreads; }
  return a.nucleosLogicos || MAQUINA.nproc;
}

/* Lo que responde omp_get_max_threads antes de la region: la clausula todavia
   no cuenta, porque vive en una directiva que no se ha ejecutado.           */
function maxThreads(ambiente) {
  var a = ambiente || {};
  if (a.setNumThreads) { return a.setNumThreads; }
  if (a.ompNumThreads) { return a.ompNumThreads; }
  return a.nucleosLogicos || MAQUINA.nproc;
}

/* omp_get_num_threads fuera de toda region paralela. */
function numThreadsFuera() { return 1; }

function fuenteDeLaRegion(ambiente) {
  var a = ambiente || {};
  for (var i = 0; i < FUENTES.length; i++) {
    if (a[FUENTES[i].campo]) { return FUENTES[i].clave; }
  }
  return "maquina";
}

/* Igual que la anterior, saltando la clausula. */
function fuenteDelMax(ambiente) {
  var a = ambiente || {};
  for (var i = 1; i < FUENTES.length; i++) {
    if (a[FUENTES[i].campo]) { return FUENTES[i].clave; }
  }
  return "maquina";
}

function filasPrecedencia(ambiente) {
  var a = ambiente || {};
  var gRegion = fuenteDeLaRegion(a), gMax = fuenteDelMax(a);
  return FUENTES.map(function (f) {
    var manda = f.clave === gRegion, mandaMax = f.clave === gMax;
    return {
      clave: f.clave,
      rotulo: f.rotulo,
      valor: a[f.campo],
      region: manda,
      max: mandaMax,
      decide: manda && mandaMax ? "las dos cifras"
        : manda ? "los hilos de la región"
        : mandaMax ? "omp_get_max_threads()"
        : "no"
    };
  });
}

function resumenPrecedencia(ambiente) {
  var num = Motor.num;
  var r = hilosDeLaRegion(ambiente), m = maxThreads(ambiente);
  var t = "A la región entran " + num(r) + " hilos. El número sale de " +
    rotuloDeFuente(fuenteDeLaRegion(ambiente)) + ". ";
  t += m === r
    ? "omp_get_max_threads() responde el mismo " + num(m) + ", porque ahí manda la misma fuente."
    : "omp_get_max_threads() responde " + num(m) + ", que sale de " +
      rotuloDeFuente(fuenteDelMax(ambiente)) +
      ": la cláusula no existe hasta que el hilo llega a la directiva.";
  var sueltas = filasPrecedencia(ambiente).filter(function (f) {
    return f.valor && f.decide === "no";
  });
  if (sueltas.length) {
    t += " Sin efecto aquí: " + sueltas.map(function (f) {
      return f.rotulo + " = " + num(f.valor);
    }).join(" y ") + ".";
  }
  return t;
}

function explicarPrediccion(bien, real, dicho) {
  var num = Motor.num;
  var t = bien
    ? "Sí: imprime " + num(real) + "."
    : "No: imprime " + num(real) + ", no " + num(dicho, 2) + ".";
  return t + " Fuera de una región paralela hay un solo hilo, el que arrancó el " +
    "programa, así que omp_get_num_threads() responde 1 siempre, con cualquier " +
    "OMP_NUM_THREADS. La que contesta cuántos hilos usaría la próxima región es " +
    "omp_get_max_threads(), y en el equipo de la clase devuelve " + num(MAQUINA.nproc) + ".";
}

var RAZONES_LOGICOS = {
  correcta: "Sí. Son hilos lógicos: los 6 núcleos de Core(s) per socket por los 2 de " +
    "Thread(s) per core. OpenMP toma los 12 por omisión, y dos de sus hilos se turnan " +
    "las unidades de ejecución de un mismo núcleo.",
  fisicos: "lscpu dice Core(s) per socket: 6, y el nombre del procesador también: " +
    "Ryzen 5 3600 6-Core. Los 12 de nproc salen de multiplicar esos 6 por los 2 hilos " +
    "por núcleo de la línea siguiente.",
  procesos: "Son hilos de un solo proceso. El equipo nace dentro de ./hilos al entrar a " +
    "la región, comparte su memoria y muere al salir; ps sobre esa corrida muestra un " +
    "proceso, no doce.",
  regiones: "nproc lee el hardware y no abre el programa: cuenta hilos lógicos. Cuántas " +
    "regiones paralelas tenga el código lo decide quien lo escribe, y esa cifra no mueve " +
    "el reparto del procesador."
};

var RAZONES_DINAMICO = {
  correcta: "Sí. Con OMP_DYNAMIC en true la biblioteca queda autorizada a usar menos hilos " +
    "de los pedidos cuando la máquina está cargada, y entonces cambian el tamaño del equipo " +
    "y el tiempo entre corridas. Para medir se deja en false y se fija OMP_NUM_THREADS.",
  subir: "El número pedido no es lo que falla: las dos corridas pidieron el mismo y " +
    "recibieron equipos distintos. Pedir más hilos deja en pie el permiso para recortarlos.",
  o3: "-O3 cambia el código que emite el compilador, no cuántos hilos arranca la región. " +
    "El tamaño del equipo lo decide la biblioteca al entrar a la directiva, con las mismas " +
    "reglas en -O2 y en -O3.",
  llamada: "omp_set_num_threads pide el número desde el código y manda sobre la variable, " +
    "pero la biblioteca puede recortar igual mientras el ajuste dinámico esté activo. " +
    "Cambia quién pide, no quién concede."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MAQUINA: MAQUINA, FUENTES: FUENTES, INVOCACIONES: INVOCACIONES, AMBIENTES: AMBIENTES,
    RAZONES_LOGICOS: RAZONES_LOGICOS, RAZONES_DINAMICO: RAZONES_DINAMICO,
    ambientePorClave: ambientePorClave, rotuloDeFuente: rotuloDeFuente,
    hilosDeLaRegion: hilosDeLaRegion, maxThreads: maxThreads,
    numThreadsFuera: numThreadsFuera, fuenteDeLaRegion: fuenteDeLaRegion,
    fuenteDelMax: fuenteDelMax, filasPrecedencia: filasPrecedencia,
    resumenPrecedencia: resumenPrecedencia, explicarPrediccion: explicarPrediccion
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var elegido = AMBIENTES[0].clave;
  var destapado = false;    // las dos cifras de la carta 3
  var vistaRegion = false;  // la columna de la carta 4, al responder

  function ambiente() { return ambientePorClave(elegido).ambiente; }

  function pintarMaquina() {
    Motor.pintarChips("chips-maquina", [
      { texto: "nproc", valor: num(MAQUINA.nproc) },
      { texto: "Core(s) per socket", valor: num(MAQUINA.nucleosPorSocket) },
      { texto: "Thread(s) per core", valor: num(MAQUINA.hilosPorNucleo) }
    ]);
  }

  function pintarPresets() {
    document.querySelectorAll("[data-ambiente]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.ambiente === elegido);
    });
  }

  function pintarMontaje() {
    document.getElementById("codigo-ambiente").innerHTML =
      ambientePorClave(elegido).lineas.map(function (l) {
        return "<div class=\"linea bloque-1\"><span class=\"num\"></span>" +
          "<span class=\"txt\">" + l + "</span></div>";
      }).join("");
  }

  function pintarPrecedencia() {
    var a = ambiente();
    document.getElementById("cuerpo-precedencia").innerHTML =
      filasPrecedencia(a).map(function (f) {
        var fondo = destapado && f.region ? " style=\"background:var(--resalte)\""
          : destapado && f.max ? " style=\"background:var(--ambar-suave)\"" : "";
        var ultima = destapado
          ? "<td>" + f.decide + "</td>"
          : "<td class=\"pend\">?</td>";
        return "<tr" + fondo + "><td style=\"text-align:left\">" + f.rotulo + "</td><td>" +
          (f.valor ? num(f.valor) : "sin fijar") + "</td>" + ultima + "</tr>";
      }).join("");
    Motor.pintarChips("chips-precedencia", [
      { texto: "omp_get_max_threads()", valor: destapado ? num(maxThreads(a)) : "?" },
      { texto: "hilos en la región", valor: destapado ? num(hilosDeLaRegion(a)) : "?", cuenta: true }
    ]);
    document.getElementById("resumen-precedencia").textContent =
      destapado ? resumenPrecedencia(a) : "";
    document.getElementById("btn-ver-precedencia").disabled = destapado;
  }

  function pintarInvocaciones() {
    document.getElementById("cuerpo-invocaciones").innerHTML =
      INVOCACIONES.map(function (f) {
        var ultima = vistaRegion
          ? "<td>" + num(f.region) + "</td>"
          : "<td class=\"pend\">?</td>";
        return "<tr><td style=\"text-align:left\"><code>" + f.invocacion + "</code></td><td>" +
          num(f.max) + "</td>" + ultima + "</tr>";
      }).join("");
  }

  document.querySelectorAll("[data-ambiente]").forEach(function (b) {
    b.addEventListener("click", function () {
      elegido = b.dataset.ambiente;
      destapado = false;
      pintarPresets();
      pintarMontaje();
      pintarPrecedencia();
    });
  });

  document.getElementById("btn-ver-precedencia").addEventListener("click", function () {
    destapado = true;
    pintarPrecedencia();
  });

  Motor.conectarPrediccion(
    { entrada: "prediccion-fuera", boton: "btn-comprobar-fuera", veredicto: "veredicto-fuera" },
    numThreadsFuera, explicarPrediccion);

  Motor.conectarOpciones("opciones-logicos", "veredicto-logicos", RAZONES_LOGICOS);
  document.querySelectorAll("#opciones-logicos button").forEach(function (b) {
    b.addEventListener("click", function () {
      vistaRegion = true;
      pintarInvocaciones();
      document.getElementById("alerta-nucleos").hidden = false;
    });
  });

  Motor.conectarOpciones("opciones-dinamico", "veredicto-dinamico", RAZONES_DINAMICO);
  document.querySelectorAll("#opciones-dinamico button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.getElementById("codigo-dinamico").hidden = false;
      document.getElementById("nota-dinamico").hidden = false;
    });
  });

  pintarMaquina();
  pintarPresets();
  pintarMontaje();
  pintarPrecedencia();
  pintarInvocaciones();
})();
