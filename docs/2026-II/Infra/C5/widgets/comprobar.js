if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Como saber si un programa con pragmas de OpenMP de verdad uso los hilos que
   uno cree. Dos juegos de medidas de la misma maquina, un AMD Ryzen 5 3600 de
   6 nucleos y 12 hilos de hardware con g++ -O2: el mismo binario compilado
   sin -fopenmp (SIN_BANDERA) y la salida de perf stat del binario con la
   bandera, con 1 y con 12 hilos (PERF, con los valores crudos en CRUDO). Las
   cuentas que destapan las dos tablas son nucleos(), ipc() y diagnostico().  */

/* Las dos corridas del binario sin -fopenmp. */
var SIN_BANDERA = [
  { invocacion: "OMP_NUM_THREADS=1 ./escalado_sin", pi: "3.1415926536", ms: 1292.7 },
  { invocacion: "OMP_NUM_THREADS=12 ./escalado_sin", pi: "3.1415926536", ms: 1283.6 }
];

/* Los cinco contadores de perf stat, como los muestra la tabla de la clase. */
var PERF = [
  { contador: "Tiempo transcurrido", uno: "3,803 s", doce: "0,850 s" },
  { contador: "task-clock (CPU consumida)", uno: "3.802 ms", doce: "7.078 ms" },
  { contador: "instructions", uno: "36,00 × 10⁹", doce: "36,09 × 10⁹" },
  { contador: "cycles", uno: "15,06 × 10⁹", doce: "25,71 × 10⁹" },
  { contador: "Instrucciones por ciclo", uno: "2,39", doce: "1,40" }
];

/* Lo que imprime perf antes de redondear, para las cuentas. */
var CRUDO = {
  uno:  { taskClockMs: 3802.01, transcurridoS: 3.80345247,
          instrucciones: 36002844782, ciclos: 15064780544, mejorMs: 1251.4 },
  doce: { taskClockMs: 7077.69, transcurridoS: 0.850174855,
          instrucciones: 36086300862, ciclos: 25707955499, mejorMs: 263.2 }
};

/* Debajo de esta relacion los dos tiempos son el mismo tiempo. */
var UMBRAL = 1.1;

var CLAVES = ["perf", "gdb", "tsan", "bandera"];

var HERRAMIENTAS = {
  perf: "perf stat",
  gdb: "gdb con info threads",
  tsan: "ThreadSanitizer",
  bandera: "Revisar la bandera de compilación"
};

/* Motor.num borra el cero final y aqui los dos decimales son el resultado. */
function dec2(x) { return x.toFixed(2).replace(".", ","); }

function relacion(t1, t12) { return t1 / t12; }

/* task-clock contra tiempo de reloj: cuantos nucleos estuvieron ocupados. */
function nucleos(taskClockMs, transcurridoS) {
  return taskClockMs / (transcurridoS * 1000);
}

function ipc(instrucciones, ciclos) { return instrucciones / ciclos; }

function diagnostico(t1, t12) {
  return relacion(t1, t12) < UMBRAL ? "sin paralelismo" : "paralelo";
}

/* Carta 1: la relacion entre los dos tiempos del binario sin la bandera. */
function explicarRelacion(bien, real, dicho) {
  var r = SIN_BANDERA;
  var t = bien
    ? "Sí: " + dec2(real) + ", es decir lo mismo. "
    : "No: " + dec2(real) + ", no " + dec2(dicho) + ". Las dos corridas " +
      "tardan lo mismo. ";
  t += "Pedir doce hilos no movió el reloj: " + Motor.num(r[1].ms, 1) +
    " ms contra " + Motor.num(r[0].ms, 1) + " ms es la diferencia que hay entre " +
    "dos corridas cualesquiera. Doce tiempos iguales señalan un binario " +
    "secuencial, y la causa está en la compilación: faltó -fopenmp, y sin esa " +
    "bandera el compilador descarta las pragmas.";
  return t;
}

/* Carta 3: los nucleos que ocupo la corrida de doce hilos. */
function explicarNucleos(bien, real, dicho) {
  var unoN = nucleos(3802, 3.803);
  var t = bien
    ? "Sí: " + dec2(real) + " núcleos. "
    : "No: " + dec2(real) + " núcleos, no " + dec2(dicho) + ". ";
  t += "7.078 / 850 = " + dec2(real) + " núcleos ocupados, de los 12 hilos de " +
    "hardware de la máquina; con un hilo la misma cuenta da " + dec2(unoN) + ". " +
    "El tiempo transcurrido bajó de 3,80 a 0,85 s y el de CPU casi se duplicó, " +
    "de 3,8 a 7,1 s. En un servidor compartido esa segunda cifra es la que decide " +
    "si pedir doce hilos.";
  return t;
}

var RAZONES_CICLOS = {
  correcta: "Sí. Los doce hilos reparten el mismo trabajo: 36,00 × 10⁹ " +
    "instrucciones con un hilo y 36,09 × 10⁹ con doce. Lo que cambia es con " +
    "quién se comparte el procesador. Seis núcleos atienden doce hilos, así que " +
    "cada pareja se turna las unidades de ejecución de su núcleo y además pelea " +
    "por la misma memoria: el IPC cae de 2,39 a 1,40 y hacen falta 71 % más " +
    "ciclos para las mismas instrucciones.",
  trabajo: "Las instrucciones son casi las mismas: 36,00 × 10⁹ contra " +
    "36,09 × 10⁹, un 0,2 % más. Ese 0,2 % es lo que cuesta repartir el ciclo " +
    "entre doce hilos, no trabajo nuevo.",
  carrera: "pi sale igual en las dos corridas, 3,1415926536. Una carrera de " +
    "datos daría un valor distinto cada vez; aquí la suma va con reduction y " +
    "cada hilo acumula en su propia copia.",
  compilador: "Es el mismo binario en las dos corridas. Lo único que cambia es " +
    "OMP_NUM_THREADS, que se lee al arrancar el programa: el compilador ya hizo " +
    "su trabajo una sola vez y no vuelve a intervenir."
};

var SITUACIONES = [
  {
    id: "no-baja",
    rotulo: "El tiempo no baja",
    texto: "El tiempo no baja al subir los hilos y sospecho que el binario " +
      "quedó secuencial.",
    correcta: "bandera",
    razones: {
      bandera: "Sí. Sin -fopenmp las pragmas se descartan y OMP_NUM_THREADS no " +
        "cambia nada: 1.292,7 ms con un hilo y 1.283,6 ms con doce. Se revisa " +
        "primero porque no cuesta una corrida: basta leer la línea con que se " +
        "compiló.",
      perf: "perf stat también lo delata: el task-clock saldría igual al tiempo " +
        "transcurrido. Sirve, aunque instrumenta una corrida entera para " +
        "averiguar algo que ya está escrito en la línea de compilación.",
      gdb: "info threads mostraría un solo hilo, y esa sí es la pista. El " +
        "problema es atraparla: hay que detener el proceso dentro de la región " +
        "paralela, y el programa entero dura 1.292,7 ms.",
      tsan: "ThreadSanitizer busca accesos sin sincronizar. Un binario " +
        "secuencial no tiene dos hilos que se pisen, así que no reporta nada y " +
        "la corrida se alarga entre 5 y 15 veces para confirmar un silencio."
    }
  },
  {
    id: "cuantos-nucleos",
    rotulo: "Cuántos núcleos ocupó",
    texto: "Quiero saber cuántos núcleos ocupó de verdad la corrida.",
    correcta: "perf",
    razones: {
      perf: "Sí. El task-clock dividido por el tiempo transcurrido da los " +
        "núcleos ocupados; con un hilo, 3.802 ms en 3,803 s dan 1,00.",
      gdb: "info threads lista los hilos que existen en el instante en que uno " +
        "detiene el proceso, no la CPU que consumieron. Doce hilos listados y " +
        "varios núcleos ocupados conviven sin problema.",
      tsan: "ThreadSanitizer reporta accesos a memoria sin sincronizar, y de " +
        "paso multiplica el tiempo por un factor de entre 5 y 15. La cuenta de " +
        "núcleos que saliera de esa corrida no sería la del programa real.",
      bandera: "La bandera dice si las pragmas entraron al binario, no cuánta " +
        "CPU se gastó. Con -fopenmp puesto, el producto punto de la clase se " +
        "quedó igual en 1,9 de aceleración, y eso solo se ve midiendo."
    }
  },
  {
    id: "resultado-cambia",
    rotulo: "El resultado cambia",
    texto: "El resultado cambia entre corridas.",
    correcta: "tsan",
    razones: {
      tsan: "Sí, a costa de correr entre 5 y 15 veces más lento. Compilado con " +
        "-fsanitize=thread, el programa señala el par de accesos a la misma " +
        "variable y la pila de cada hilo; es lo que convierte un número raro en " +
        "una línea de código.",
      perf: "perf stat entrega ciclos, instrucciones y fallos de caché. Ninguno " +
        "de esos contadores dice quién escribió una variable mientras otro la " +
        "leía: el programa con la carrera ejecuta las mismas instrucciones que " +
        "el correcto.",
      gdb: "Con gdb habría que atrapar la carrera en el instante en que ocurre, " +
        "y detener los hilos la cambia de lugar. ThreadSanitizer no la atrapa: " +
        "registra los accesos y después los compara.",
      bandera: "Un binario sin la bandera corre en un hilo y da el mismo " +
        "resultado todas las veces. Que cambie entre corridas dice lo " +
        "contrario: los hilos sí están trabajando."
    }
  },
  {
    id: "cada-hilo",
    rotulo: "Qué hace cada hilo",
    texto: "Quiero ver qué está haciendo cada hilo en este instante.",
    correcta: "gdb",
    razones: {
      gdb: "Sí. Con el programa compilado -g -O0 y corrido bajo gdb, " +
        "info threads lista el equipo y thread N salta al que interese para ver " +
        "su pila. El -O0 importa: con -O2 el compilador mueve las líneas y la " +
        "pila deja de corresponder al archivo.",
      perf: "perf stat da totales de la corrida completa y perf record muestrea " +
        "por función. Ninguno de los dos para el programa para preguntarle a un " +
        "hilo en qué línea va.",
      tsan: "ThreadSanitizer avisa cuando ya encontró dos accesos en conflicto, " +
        "y lo que entrega es ese par. No es un sitio donde pararse a mirar el " +
        "estado del equipo de hilos.",
      bandera: "Leer la línea de compilación dice si OpenMP entró al binario, " +
        "no en qué va cada hilo. Para eso hay que detener el proceso."
    }
  }
];

/* Generador congruencial lineal: la misma semilla da la misma secuencia. */
function lcg(semilla) {
  var x = semilla >>> 0;
  return function () {
    x = (Math.imul(1664525, x) + 1013904223) >>> 0;
    return x / 4294967296;
  };
}

/* Copia barajada de la lista (Fisher-Yates) con el LCG de la semilla. */
function barajar(lista, semilla) {
  var r = lcg(semilla);
  var copia = lista.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(r() * (i + 1));
    var t = copia[i]; copia[i] = copia[j]; copia[j] = t;
  }
  return copia;
}

function buscar(situaciones, id) {
  for (var i = 0; i < situaciones.length; i++) {
    if (situaciones[i].id === id) { return situaciones[i]; }
  }
  return null;
}

/* El motor espera la clave "correcta" en la opcion que resuelve. */
function razonesPara(situacion) {
  var salida = {};
  CLAVES.forEach(function (c) {
    salida[c === situacion.correcta ? "correcta" : c] = situacion.razones[c];
  });
  return salida;
}

function contarAciertos(respuestas, situaciones) {
  return respuestas.filter(function (r) {
    var s = buscar(situaciones, r.id);
    return s !== null && s.correcta === r.primera;
  }).length;
}

/* Cada situacion trae razon para las cuatro opciones. */
function validar(situaciones) {
  for (var i = 0; i < situaciones.length; i++) {
    var s = situaciones[i];
    if (CLAVES.indexOf(s.correcta) < 0) { return false; }
    for (var j = 0; j < CLAVES.length; j++) {
      var r = s.razones[CLAVES[j]];
      if (typeof r !== "string" || !r.trim()) { return false; }
    }
  }
  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SIN_BANDERA: SIN_BANDERA, PERF: PERF, CRUDO: CRUDO, UMBRAL: UMBRAL,
    CLAVES: CLAVES, HERRAMIENTAS: HERRAMIENTAS, SITUACIONES: SITUACIONES,
    RAZONES_CICLOS: RAZONES_CICLOS,
    dec2: dec2, relacion: relacion, nucleos: nucleos, ipc: ipc,
    diagnostico: diagnostico, explicarRelacion: explicarRelacion,
    explicarNucleos: explicarNucleos, lcg: lcg, barajar: barajar,
    buscar: buscar, razonesPara: razonesPara, contarAciertos: contarAciertos,
    validar: validar
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var vistaRelacion = false;   // la relacion y el diagnostico se destapan al comprobar
  var vistaPerf = false;       // la columna de 12 hilos, igual

  function pintarSinBandera() {
    document.getElementById("cuerpo-sin-bandera").innerHTML =
      SIN_BANDERA.map(function (f) {
        return "<tr><td style=\"text-align:left\"><code>" + f.invocacion +
          "</code></td><td>" + f.pi + "</td><td>" + num(f.ms, 1) + " ms</td></tr>";
      }).join("");
    var r = relacion(SIN_BANDERA[0].ms, SIN_BANDERA[1].ms);
    Motor.pintarChips("chips-relacion", [
      { texto: "veces más rápido con doce hilos",
        valor: vistaRelacion ? dec2(r) : "?", cuenta: true },
      { texto: "diagnóstico",
        valor: vistaRelacion
          ? diagnostico(SIN_BANDERA[0].ms, SIN_BANDERA[1].ms) : "?" }
    ]);
  }

  function pintarPerf() {
    document.getElementById("cuerpo-perf").innerHTML = PERF.map(function (f) {
      var doce = vistaPerf
        ? "<td>" + f.doce + "</td>"
        : "<td class=\"pend\">?</td>";
      return "<tr><td style=\"text-align:left\">" + f.contador + "</td><td>" +
        f.uno + "</td>" + doce + "</tr>";
    }).join("");
    Motor.pintarChips("chips-perf", [
      { texto: "núcleos ocupados con 1 hilo",
        valor: vistaPerf ? dec2(nucleos(3802, 3.803)) : "?" },
      { texto: "núcleos ocupados con 12 hilos",
        valor: vistaPerf ? dec2(nucleos(7078, 0.850)) : "?", cuenta: true },
      { texto: "instrucciones por ciclo",
        valor: vistaPerf ? "2,39 y 1,40" : "?" }
    ]);
  }

  Motor.conectarPrediccion(
    { entrada: "prediccion-relacion", boton: "btn-comprobar-relacion",
      veredicto: "veredicto-relacion" },
    function () { return relacion(SIN_BANDERA[0].ms, SIN_BANDERA[1].ms); },
    explicarRelacion);

  document.getElementById("btn-comprobar-relacion").addEventListener("click",
    function () {
      vistaRelacion = true;
      pintarSinBandera();
      document.getElementById("nota-relacion").hidden = false;
    });

  Motor.conectarPrediccion(
    { entrada: "prediccion-nucleos", boton: "btn-comprobar-nucleos",
      veredicto: "veredicto-nucleos" },
    function () { return nucleos(7078, 0.850); },
    explicarNucleos);

  document.getElementById("btn-comprobar-nucleos").addEventListener("click",
    function () {
      vistaPerf = true;
      pintarPerf();
      document.getElementById("nota-perf").hidden = false;
    });

  Motor.conectarOpciones("opciones-ciclos", "veredicto-ciclos", RAZONES_CICLOS);

  /* Carta 5: banco de situaciones, una herramienta por situacion. */
  var orden = SITUACIONES.slice();
  var semilla = 1;
  var indice = 0;
  var respuestas = [];
  var razones = {};            // el motor lee este mismo objeto en cada clic

  var botones = document.querySelectorAll("#opciones-herramientas button");
  var caja = document.getElementById("veredicto-herramientas");
  var btnSiguiente = document.getElementById("btn-siguiente");
  var btnOtra = document.getElementById("btn-otra");
  var resumen = document.getElementById("resumen");

  function actual() { return orden[indice]; }

  function respondida() {
    return respuestas.length > 0 &&
      respuestas[respuestas.length - 1].id === actual().id;
  }

  function mostrarSituacion() {
    var s = actual();
    document.getElementById("progreso-herramientas").textContent =
      "Situación " + num(indice + 1) + " de " + num(orden.length);
    document.getElementById("texto-situacion").textContent = s.texto;
    var nuevas = razonesPara(s);
    Object.keys(razones).forEach(function (k) { delete razones[k]; });
    Object.keys(nuevas).forEach(function (k) { razones[k] = nuevas[k]; });
    // Los cuatro botones conservan su texto; solo cambia cual es la correcta.
    botones.forEach(function (b) {
      b.dataset.op = b.dataset.clave === s.correcta ? "correcta" : b.dataset.clave;
      b.classList.remove("elegida");
    });
    caja.className = "veredicto";
    caja.textContent = "";
    btnSiguiente.hidden = true;
    btnSiguiente.textContent = indice + 1 < orden.length
      ? "Siguiente situación" : "Ver el marcador";
  }

  function pintarMarcador() {
    Motor.pintarChips("panel-marcador", [
      { texto: "a la primera",
        valor: num(contarAciertos(respuestas, SITUACIONES)), cuenta: true },
      { texto: "respondidas",
        valor: num(respuestas.length) + " de " + num(orden.length) }
    ]);
  }

  function agregarFila(s, primera) {
    var color = primera === s.correcta ? "var(--verde)" : "var(--rojo)";
    document.getElementById("cuerpo-marcador").innerHTML +=
      "<tr><td>" + s.rotulo + "</td><td style=\"color:" + color + "\">" +
      HERRAMIENTAS[primera] + "</td><td>" + HERRAMIENTAS[s.correcta] +
      "</td></tr>";
  }

  function terminar() {
    var aciertos = contarAciertos(respuestas, SITUACIONES);
    document.getElementById("progreso-herramientas").textContent =
      "Las " + num(orden.length) + " situaciones respondidas";
    resumen.textContent = num(aciertos) + " de " + num(orden.length) +
      " a la primera. " + (aciertos === orden.length
        ? "Las cuatro preguntas que uno le hace a un programa con hilos, y la " +
          "herramienta que contesta cada una."
        : "La tabla dice en cuáles la primera lectura fue otra; vuelva a esas " +
          "y lea la razón de la que sí responde.");
    resumen.hidden = false;
    btnOtra.hidden = false;
    btnSiguiente.hidden = true;
  }

  function reiniciar() {
    orden = barajar(SITUACIONES, semilla);
    semilla += 1;
    indice = 0;
    respuestas = [];
    document.getElementById("cuerpo-marcador").innerHTML = "";
    resumen.hidden = true;
    btnOtra.hidden = true;
    mostrarSituacion();
    pintarMarcador();
  }

  Motor.conectarOpciones("opciones-herramientas", "veredicto-herramientas", razones);

  botones.forEach(function (b) {
    b.addEventListener("click", function () {
      botones.forEach(function (o) { o.classList.remove("elegida"); });
      b.classList.add("elegida");
      if (!respondida()) {
        respuestas.push({ id: actual().id, primera: b.dataset.clave });
        agregarFila(actual(), b.dataset.clave);
        pintarMarcador();
      }
      btnSiguiente.hidden = false;
    });
  });

  btnSiguiente.addEventListener("click", function () {
    if (indice + 1 < orden.length) { indice += 1; mostrarSituacion(); }
    else { terminar(); }
  });

  btnOtra.addEventListener("click", reiniciar);

  Motor.pintarChips("datos-herramientas", [
    { texto: "situaciones", valor: num(SITUACIONES.length) },
    { texto: "herramientas", valor: num(CLAVES.length) }
  ]);

  pintarSinBandera();
  pintarPerf();
  mostrarSituacion();
  pintarMarcador();
})();
