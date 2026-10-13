if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Un programa paralelo visto desde afuera: una foto de top, los dos listados de
   ps y un perf stat sobre ./paralelo 900, en una maquina de 6 nucleos fisicos y
   12 logicos. Las cuentas son el techo de %CPU, los nucleos equivalentes, el
   reparto de PSR entre los doce hilos y la suma de sus porcentajes. */

var NUCLEOS_LOGICOS = 12;
var NUCLEOS_FISICOS = 6;

/* top -b -n1 con ./paralelo 900 corriendo. RES en kB, como lo imprime top. */
var TOP = {
  pid: 102237, estado: "R", pcpu: 919.1, pmem: 1.2, res: 395268,
  tiempo: "1:21.05", comando: "./paralelo 900"
};
var TOP_VECINO = { comando: "dockerd", pcpu: 51.8 };
var TOP_ENCABEZADO = { us: 91.9, sy: 5.1, ni: 0.0, idle: 1.7, carga: [3.48, 3.41, 3.28] };

/* ps -o user,pid,thcount,pcpu,pmem,cputime,cmd -p 102237 */
var PS_PROCESO = { thcount: 12, pcpu: 981, pmem: 1.2, cputime: "00:01:21" };

/* ps -o pid,tid,psr,pcpu,comm -T -p 102237: una fila por hilo. */
var HILOS = [
  { tid: 102237, psr: 5, pcpu: 86.4 },
  { tid: 102239, psr: 5, pcpu: 79.6 },
  { tid: 102240, psr: 6, pcpu: 83.4 },
  { tid: 102241, psr: 11, pcpu: 84.8 },
  { tid: 102242, psr: 4, pcpu: 81.2 },
  { tid: 102243, psr: 2, pcpu: 85.2 },
  { tid: 102244, psr: 1, pcpu: 84.8 },
  { tid: 102245, psr: 8, pcpu: 82.2 },
  { tid: 102246, psr: 10, pcpu: 84.5 },
  { tid: 102247, psr: 0, pcpu: 82.3 },
  { tid: 102248, psr: 10, pcpu: 83.8 },
  { tid: 102249, psr: 3, pcpu: 83.8 }
];

/* perf stat -p 102237 sleep 5 sobre el mismo proceso. */
var PERF = { ventanaS: 5, taskClockMs: 51361.10, cpus: 10.2, ipc: 0.9 };

/* ---------- las cuentas ---------- */

/* %CPU se mide sobre un nucleo, asi que el techo es cien por nucleo logico. */
function techoCpu(nucleos) { return nucleos * 100; }

/* Cuantos nucleos tiene ocupados, en promedio, un proceso con ese %CPU. */
function nucleosEquivalentes(pcpu) { return pcpu / 100; }

/* Que parte del techo de la maquina se lleva el proceso, en por ciento. */
function fraccionDelTecho(pcpu, nucleos) { return pcpu / techoCpu(nucleos) * 100; }

/* RAM del equipo que implican RES y %MEM, en GB. */
function ramImplicada(resKb, pmem) { return resKb / pmem * 100 / 1048576; }

function sumaCpu(hilos) {
  return hilos.reduce(function (a, h) { return a + h.pcpu; }, 0);
}

function promedioCpu(hilos) { return sumaCpu(hilos) / hilos.length; }

function extremosCpu(hilos) {
  var v = hilos.map(function (h) { return h.pcpu; });
  return { min: Math.min.apply(null, v), max: Math.max.apply(null, v) };
}

/* Diferencia entre la suma de las filas de hilo y el %CPU del proceso, en %. */
function desvioFrentePs(hilos, pcpuProceso) {
  return (sumaCpu(hilos) - pcpuProceso) / pcpuProceso * 100;
}

/* Nucleos que aparecen en la columna PSR, ordenados y sin repetir. */
function nucleosOcupados(hilos) {
  var vistos = [];
  hilos.forEach(function (h) { if (vistos.indexOf(h.psr) < 0) { vistos.push(h.psr); } });
  return vistos.sort(function (a, b) { return a - b; });
}

/* Los que no aparecen en ninguna fila. */
function nucleosLibres(hilos, total) {
  var ocupados = nucleosOcupados(hilos), libres = [];
  for (var c = 0; c < total; c++) { if (ocupados.indexOf(c) < 0) { libres.push(c); } }
  return libres;
}

/* Nucleos con mas de un hilo encima en esta foto: [{ psr, tids }]. */
function nucleosCompartidos(hilos) {
  return nucleosOcupados(hilos).map(function (c) {
    return { psr: c, tids: hilos.filter(function (h) { return h.psr === c; })
      .map(function (h) { return h.tid; }) };
  }).filter(function (n) { return n.tids.length > 1; });
}

/* ---------- veredictos y textos ---------- */

function fmt(x, d) { return Motor.num(x, d); }

/* La suma de doce porcentajes se estima de cabeza, y el motor pide exactitud
   cuando el esperado cae en un entero. Vale la suma con 2 % de diferencia, y
   vale tambien el %CPU que ps imprime para el proceso: sale de la misma
   medicion y es la otra lectura razonable de la pregunta. */
function veredictoSuma(dicho, esperado, delPs) {
  if (isNaN(dicho)) { return { bien: false, motivo: "Escriba un número antes de comprobar." }; }
  var cerca = Math.abs(dicho - esperado) <= esperado * 0.02;
  return { bien: cerca || Math.abs(dicho - delPs) <= 1, motivo: "" };
}

function explicarTecho(bien, real) {
  return (bien ? "Correcto. " : "No. ") + "El techo es " + fmt(real) +
    " %: top y ps miden %CPU contra un núcleo, de modo que 100 % es un núcleo " +
    "saturado y esta máquina tiene " + NUCLEOS_LOGICOS + " núcleos lógicos sobre " +
    NUCLEOS_FISICOS + " físicos. Con 919,1 % el proceso se queda en el " +
    fmt(fraccionDelTecho(TOP.pcpu, NUCLEOS_LOGICOS), 1) + " % de ese techo.";
}

function explicarNucleos(bien, real, dicho) {
  var base = "919,1 % son " + fmt(real, 2) + " núcleos ocupados en promedio: se divide " +
    "entre 100, que es lo que marca un núcleo lleno. Quedan unos " +
    fmt(NUCLEOS_LOGICOS - real, 1) + " sin usar por este proceso.";
  if (bien) { return "Correcto. " + base; }
  if (dicho > NUCLEOS_LOGICOS) {
    return "No. " + base + " Ningún proceso pasa de " + NUCLEOS_LOGICOS +
      " en esta máquina, que es su techo.";
  }
  return "No. " + base;
}

function explicarSuma(bien, real, dicho) {
  var e = extremosCpu(HILOS);
  var base = "Las doce filas suman " + fmt(real, 1) + ", con un promedio de " +
    fmt(promedioCpu(HILOS), 1) + " por hilo entre " + fmt(e.min, 1) + " y " +
    fmt(e.max, 1) + ". El proceso completo aparece con " + fmt(PS_PROCESO.pcpu) +
    " en la otra invocación de ps, un " + fmt(desvioFrentePs(HILOS, PS_PROCESO.pcpu), 1) +
    " % menos: cada porcentaje es tiempo de CPU sobre tiempo de vida, redondeado a " +
    "un decimal y leído tarea por tarea, y el del proceso se calcula aparte. " +
    "Y perf stat, sobre una ventana de " + PERF.ventanaS + " s del mismo proceso, " +
    "reporta " + fmt(PERF.cpus, 1) + " CPUs utilized, mientras top promedia desde " +
    "que el programa arrancó.";
  if (bien && Math.abs(dicho - PS_PROCESO.pcpu) <= 1 &&
      Math.abs(dicho - real) > real * 0.02) {
    return "Ese es el %CPU del proceso completo. " + base;
  }
  return (bien ? "Correcto. " : "No. ") + base +
    (bien ? "" : " Doce hilos cerca de 83 cada uno pasan de mil.");
}

var RAZONES_PASA100 = {
  correcta: "Es la razón. %CPU es tiempo de CPU dividido por tiempo de reloj, y la " +
    "división se hace contra un solo núcleo: 100 % es un núcleo saturado durante toda " +
    "la vida del proceso. Con doce núcleos lógicos el techo queda en 1.200 %, y 919,1 " +
    "dice que el programa mantuvo ocupados algo más de nueve.",
  medido: "No. La medida es la que top y ps publican desde siempre, y ps la confirma " +
    "en otra columna con 981 %. Un proceso de un solo hilo nunca pasa de 100 en esta " +
    "misma escala, así que la escala sirve para distinguirlos.",
  memoria: "No. La memoria tiene su propia columna, %MEM, y ahí el proceso marca 1,2 %. " +
    "%CPU no sabe cuánta memoria se pidió: cuenta segundos de procesador.",
  doble: "No. El kernel lleva el tiempo de CPU de cada tarea una sola vez y %CPU suma " +
    "esas tareas. Los doce hilos lógicos son doce colas donde el planificador pone " +
    "trabajo, y el SMT se nota en el rendimiento de cada hilo, no en la contabilidad: " +
    "con seis núcleos físicos y doce lógicos el techo es 1.200, no 2.400."
};

var RAZONES_MEM = {
  correcta: "Es la distinción. %CPU es tiempo de CPU sobre tiempo de reloj, normalizado " +
    "a un núcleo, y pasa de 100 en cuanto hay dos hilos trabajando. %MEM es memoria " +
    "residente sobre la RAM física del equipo y no puede pasar de 100: los 395.268 kB " +
    "de RES son 386 MiB, y que eso sea el 1,2 % implica unos 31 GiB instalados.",
  sube: "No. Los hilos de un proceso comparten el espacio de direcciones: doce hilos " +
    "trabajan sobre la misma matriz y no la copian. Lo que crece con cada hilo es su " +
    "pila, unos pocos cientos de kB frente a los 386 MiB residentes.",
  virtual: "No. %MEM se calcula con RES, la memoria residente, contra la RAM física. La " +
    "memoria virtual es la columna VIRT y suele ser mucho mayor, porque incluye lo que " +
    "el proceso reservó y todavía no ha tocado.",
  nousa: "No. RES dice 395.268 kB, es decir 386 MiB de memoria física ocupada ahora " +
    "mismo por este proceso. 1,2 % es lo que esos 386 MiB representan en la RAM del " +
    "equipo, no una señal de que el programa no trabaje con sus datos."
};

var RAZONES_PSR = {
  correcta: "Es lo que dice la columna. En esta foto los hilos 102237 y 102239 están en " +
    "el núcleo 5, el 102246 y el 102248 en el 10, y los núcleos 7 y 9 no aparecen. " +
    "El planificador mueve los hilos entre núcleos mientras el programa corre, así que " +
    "repetir la orden un segundo después devuelve otro reparto.",
  roto: "No. Los doce hilos aparecen con %CPU entre 79,6 y 86,4: todos trabajan casi lo " +
    "mismo. Un programa con un problema de reparto se vería con hilos cerca de 0 " +
    "mientras otros están cerca de 100.",
  faltan: "No. Están los doce TID, y THCNT confirma 12. Lo que falta en la columna PSR " +
    "son dos núcleos, el 7 y el 9, porque dos pares de hilos coincidieron en el mismo " +
    "núcleo en el instante de la captura.",
  afinidad: "No como regla. Fijar afinidad con taskset sirve para que una medición se " +
    "repita, y a cambio le quita al planificador la posibilidad de mover un hilo cuando " +
    "otro proceso entra, como el dockerd que aquí marca 51,8 %. Aquí el reparto no es " +
    "el problema: los doce hilos avanzan parejo."
};

var RAZONES_UNHILO = {
  correcta: "Es el diagnóstico. THCNT cuenta las tareas vivas del proceso, y un 1 " +
    "significa que nadie creó hilos: el ciclo corre completo en el hilo principal. La " +
    "causa habitual es un binario compilado sin -fopenmp, donde las pragmas quedaron " +
    "descartadas, y %CPU lo delata quedándose cerca de 100 en vez de 919,1.",
  termino: "No. THCNT lista las tareas vivas, y mientras el proceso exista hay al menos " +
    "una, la principal. Si el programa hubiera terminado, ps responde que no existe ese PID.",
  ciego: "No. ps lee /proc/102237/task, donde el kernel publica una entrada por tarea, " +
    "sin importar quién la creó. Con el binario de OpenMP esa misma orden mostró doce " +
    "entradas, una por hilo.",
  ocupada: "No. Con la máquina ocupada OpenMP crea sus doce hilos igual y se reparten el " +
    "tiempo que haya: THCNT seguiría en 12 y lo que bajaría es %CPU. Un THCNT de 1 no " +
    "depende de la carga del equipo."
};

/* ---------- pintado y conexiones ---------- */

function filasTop() {
  return [
    ["PID", fmt(TOP.pid)],
    ["S (estado)", TOP.estado + ", corriendo o lista para correr"],
    ["%CPU", fmt(TOP.pcpu, 1)],
    ["%MEM", fmt(TOP.pmem, 1)],
    ["RES", fmt(TOP.res) + " kB"],
    ["TIME+", TOP.tiempo],
    ["COMMAND", TOP.comando]
  ];
}

function iniciar() {
  var vistaTop = false, vistaHilos = false;

  function pintarTop() {
    document.getElementById("cuerpo-top").innerHTML = filasTop().map(function (f) {
      return "<tr><td style=\"text-align:left\">" + f[0] + "</td>" +
        (vistaTop ? "<td>" + f[1] + "</td>" : "<td class=\"pend\">?</td>") + "</tr>";
    }).join("");
    Motor.pintarChips("chips-top", [
      { texto: "techo de %CPU", valor: vistaTop ? fmt(techoCpu(NUCLEOS_LOGICOS)) + " %" : "?" },
      { texto: "núcleos equivalentes",
        valor: vistaTop ? fmt(nucleosEquivalentes(TOP.pcpu), 2) : "?", cuenta: true },
      { texto: "del techo de la máquina",
        valor: vistaTop ? fmt(fraccionDelTecho(TOP.pcpu, NUCLEOS_LOGICOS), 1) + " %" : "?" },
      { texto: "RAM que implican RES y %MEM",
        valor: vistaTop ? "unos " + fmt(ramImplicada(TOP.res, TOP.pmem)) + " GiB" : "?" }
    ]);
  }

  function pintarHilos() {
    document.getElementById("cuerpo-hilos").innerHTML = HILOS.map(function (h) {
      var compartido = HILOS.filter(function (o) { return o.psr === h.psr; }).length > 1;
      return "<tr><td>" + fmt(h.tid) + "</td><td" +
        (compartido ? " style=\"color:#a86a12;font-weight:700\"" : "") + ">" + h.psr +
        "</td><td>" + fmt(h.pcpu, 1) + "</td></tr>";
    }).join("");
    Motor.pintarChips("chips-hilos", [
      { texto: "hilos (THCNT)", valor: PS_PROCESO.thcount },
      { texto: "núcleos distintos", valor: nucleosOcupados(HILOS).length },
      { texto: "núcleos con dos hilos",
        valor: nucleosCompartidos(HILOS).map(function (n) { return n.psr; }).join(" y "),
        cuenta: true },
      { texto: "núcleos sin ningún hilo", valor: nucleosLibres(HILOS, NUCLEOS_LOGICOS).join(" y ") }
    ]);
    document.getElementById("tabla-hilos").hidden = false;
    document.getElementById("nota-hilos").hidden = false;
  }

  pintarTop();

  Motor.conectarPrediccion(
    { entrada: "pred-techo", boton: "btn-techo", veredicto: "ver-techo" },
    function () { return techoCpu(NUCLEOS_LOGICOS); },
    explicarTecho);

  Motor.conectarPrediccion(
    { entrada: "pred-nucleos", boton: "btn-nucleos", veredicto: "ver-nucleos" },
    function () { return nucleosEquivalentes(TOP.pcpu); },
    explicarNucleos);

  document.getElementById("btn-destapar-top").addEventListener("click", function () {
    vistaTop = true;
    pintarTop();
    document.getElementById("nota-top").hidden = false;
  });

  document.getElementById("btn-destapar-hilos").addEventListener("click", function () {
    vistaHilos = true;
    pintarHilos();
  });

  document.getElementById("btn-suma").addEventListener("click", function () {
    var dicho = Motor.leerNumero("pred-suma");
    var real = sumaCpu(HILOS);
    var v = veredictoSuma(dicho, real, PS_PROCESO.pcpu);
    var caja = document.getElementById("ver-suma");
    caja.className = "veredicto " + (v.bien ? "bien" : "mal");
    caja.textContent = isNaN(dicho) ? v.motivo : explicarSuma(v.bien, real, dicho);
    if (!vistaHilos) { vistaHilos = true; pintarHilos(); }
  });

  Motor.conectarOpciones("op-pasa100", "ver-pasa100", RAZONES_PASA100);
  Motor.conectarOpciones("op-mem", "ver-mem", RAZONES_MEM);
  Motor.conectarOpciones("op-psr", "ver-psr", RAZONES_PSR);
  Motor.conectarOpciones("op-unhilo", "ver-unhilo", RAZONES_UNHILO);
}

if (typeof document !== "undefined") { iniciar(); }

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    NUCLEOS_LOGICOS: NUCLEOS_LOGICOS, NUCLEOS_FISICOS: NUCLEOS_FISICOS,
    TOP: TOP, TOP_VECINO: TOP_VECINO, TOP_ENCABEZADO: TOP_ENCABEZADO,
    PS_PROCESO: PS_PROCESO, HILOS: HILOS, PERF: PERF,
    techoCpu: techoCpu, nucleosEquivalentes: nucleosEquivalentes,
    fraccionDelTecho: fraccionDelTecho, ramImplicada: ramImplicada,
    sumaCpu: sumaCpu, promedioCpu: promedioCpu, extremosCpu: extremosCpu,
    desvioFrentePs: desvioFrentePs, nucleosOcupados: nucleosOcupados,
    nucleosLibres: nucleosLibres, nucleosCompartidos: nucleosCompartidos,
    veredictoSuma: veredictoSuma, explicarTecho: explicarTecho,
    explicarNucleos: explicarNucleos, explicarSuma: explicarSuma,
    RAZONES_PASA100: RAZONES_PASA100, RAZONES_MEM: RAZONES_MEM,
    RAZONES_PSR: RAZONES_PSR, RAZONES_UNHILO: RAZONES_UNHILO
  };
}
