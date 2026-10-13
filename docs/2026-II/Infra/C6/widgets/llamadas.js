if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Contar llamadas al sistema: strace -c sobre ./lento (un write por linea),
   ./rapido (las mismas lineas con fprintf y un bufer de 4 kB) y ./bueno, el de
   la matriz. Las cuentas son las dos relaciones de la primera carta, el costo
   por llamada y la parte del reloj que se va dentro del nucleo. */

var LENTO = {
  nombre: "./lento", lineas: 200000,
  write: { llamadas: 200000, segundos: 0.855684, usecs: 4, porcentaje: 99.94 },
  total: { llamadas: 200067, segundos: 0.792353 },
  reloj: 0.12
};

var RAPIDO = {
  nombre: "./rapido", lineas: 200000, buferKb: 4,
  write: { llamadas: 315, segundos: 0.000526 },
  total: { llamadas: 383, segundos: 0.000822 },
  reloj: 0.01
};

/* El programa de la matriz, trazado con el mismo strace -c. */
var BUENO = {
  nombre: "./bueno", reloj: 0.79,
  brk: { llamadas: 2503, segundos: 0.008408 },
  total: { llamadas: 2567, segundos: 0.008549 }
};

/* Los dos tamanos que se comparan al hablar del costo de una llamada. */
var BYTES = { corto: 32, bloque: 8192 };

/* ---------- las cuentas ---------- */

function razonLlamadasWrite(a, b) { return a.write.llamadas / b.write.llamadas; }

function razonTiempoNucleo(a, b) { return a.total.segundos / b.total.segundos; }

function razonReloj(a, b) { return a.reloj / b.reloj; }

function llamadasAhorradas(a, b) { return a.write.llamadas - b.write.llamadas; }

/* Microsegundos por llamada: es lo que strace imprime en usecs/call. */
function usecPorLlamada(segundos, llamadas) { return segundos / llamadas * 1e6; }

/* Cuantas lineas carga cada write cuando la salida pasa por un bufer. */
function lineasPorLlamada(lineas, llamadas) { return lineas / llamadas; }

/* Parte del tiempo de reloj que el proceso pasa dentro de las llamadas, en %. */
function fraccionEnNucleo(segundos, reloj) { return segundos / reloj * 100; }

function fraccionFueraDelNucleo(segundos, reloj) {
  return 100 - fraccionEnNucleo(segundos, reloj);
}

function porcentajeDeLlamadas(parte, total) { return parte / total * 100; }

/* Lo que quedaria del reloj si una llamada dejara de costar. */
function relojSinLlamada(reloj, segundos) { return reloj - segundos; }

/* ---------- veredictos y textos ---------- */

function fmt(x, d) { return Motor.num(x, d); }

function explicarRazonLlamadas(bien, real) {
  return (bien ? "Correcto. " : "No. ") + "Son " + fmt(real, 1) + " veces: " +
    fmt(LENTO.write.llamadas) + " llamadas contra " + fmt(RAPIDO.write.llamadas) + ". " +
    "./lento baja al núcleo una vez por línea; ./rapido junta unas " +
    fmt(lineasPorLlamada(RAPIDO.lineas, RAPIDO.write.llamadas)) +
    " líneas en su búfer de " + RAPIDO.buferKb + " kB y escribe cuando se llena, " +
    "así que se ahorra " + fmt(llamadasAhorradas(LENTO, RAPIDO)) + " cruces.";
}

function explicarRazonTiempo(bien, real) {
  return (bien ? "Correcto. " : "No. ") + fmt(LENTO.total.segundos, 6) + " s contra " +
    fmt(RAPIDO.total.segundos, 6) + " s dentro del núcleo: " + fmt(real, 1) +
    " veces. Cada llamada de ./lento cuesta " +
    fmt(usecPorLlamada(LENTO.write.segundos, LENTO.write.llamadas), 2) +
    " microsegundos y en ./rapido cada write cuesta " +
    fmt(usecPorLlamada(RAPIDO.write.segundos, RAPIDO.write.llamadas), 2) +
    ", aunque entregue cientos de líneas de una vez.";
}

function explicarRazonReloj(bien, real) {
  return (bien ? "Correcto. " : "No. ") + "El reloj pasa de " + fmt(LENTO.reloj, 2) +
    " a " + fmt(RAPIDO.reloj, 2) + " s, " + fmt(real) + " veces, mientras el tiempo " +
    "dentro del núcleo cambia " + fmt(razonTiempoNucleo(LENTO, RAPIDO), 1) +
    " veces. Las dos cifras tienen alcances distintos: una cubre el programa entero y " +
    "la otra solo lo que pasó dentro de las llamadas.";
}

var RAZONES_RELOJ = {
  correcta: "Es la razón. El reloj mide el programa completo: armar las 200.000 líneas, " +
    "el formato de cada número y, entre todo eso, las llamadas. La columna de segundos " +
    "de strace cuenta solo el tiempo dentro de las llamadas, y esa es la parte que se " +
    "redujo. Dos medidas con alcance distinto no se mueven en la misma proporción.",
  miente: "No. strace informa el tiempo que midió; lo que hay que leer es qué midió. " +
    "Su columna de segundos cuenta el tiempo dentro de cada llamada mientras el tracer " +
    "detiene el proceso a la entrada y a la salida, dos paradas por llamada. Ese costo " +
    "es real bajo strace y no aparece en el reloj de 0,12 s, que es de la corrida libre.",
  disco: "No. write vuelve cuando los datos quedaron en el caché del sistema; el disco " +
    "los recibe después y por su cuenta. Si el disco fuera el límite las dos corridas " +
    "tardarían lo mismo, porque escriben los mismos bytes.",
  iguales: "No. El reloj es tiempo de pared desde que arranca el proceso hasta que " +
    "termina; la columna de segundos suma solo lo que se pasó dentro de las llamadas " +
    "contadas. Por eso una baja 12 veces y la otra 964."
};

var RAZONES_CRUCE = {
  correcta: "Es el costo que se paga. Entrar al modo núcleo y volver cuesta casi lo " +
    "mismo con 32 bytes que con 8.192: hay que guardar el estado, validar los " +
    "argumentos y regresar. El búfer de 4 kB no escribe menos bytes, escribe el mismo " +
    "total en 315 cruces en vez de 200.000, y el cobro va por cruce.",
  bytes: "No. Los dos programas sacan las mismas 200.000 líneas y los mismos bytes. Lo " +
    "único distinto es en cuántas llamadas van, y eso es lo que cuenta strace.",
  disco: "Un disco sí entrega más con bloques grandes, y esa no es la cuenta que aparece " +
    "aquí. strace -c mide llamadas y el tiempo dentro de ellas; write regresa antes de " +
    "que el disco vea los datos, así que lo que se ahorró fueron cruces, no viajes al disco.",
  comprime: "No. fprintf formatea y acumula en un búfer de 4 kB, y cuando se llena hace " +
    "un write con su contenido. Los bytes que salen son los mismos, solo salen de 4 kB " +
    "en 4 kB."
};

var RAZONES_BUENO = {
  correcta: "Es la conclusión. De 0,79 s de reloj solo 8,549 ms están dentro del núcleo, " +
    "el 1,1 %: por ahí no se gana nada. El 98,9 % restante es trabajo en CPU y en " +
    "memoria, y ahí es donde sigue la medición, con perf y con las herramientas de " +
    "caché. Descartar una causa con una medición también es un resultado.",
  brk: "No alcanza. Las 2.503 llamadas a brk son 8,408 ms, el 1,1 % del reloj: " +
    "eliminarlas todas dejaría el programa en 0,78 s. Son muchas llamadas y poco tiempo.",
  optimizado: "No. Pocas llamadas dicen que el programa no pasa su tiempo en el núcleo, " +
    "y nada más. Los 0,79 s siguen ahí, y lo que falta por mirar son los accesos a " +
    "memoria y el reparto entre hilos.",
  bufer: "No. Aquí no hay salida que agrupar: la llamada que domina es brk, que aparece " +
    "cuando el programa le pide memoria al sistema para sus matrices, no cuando escribe."
};

/* ---------- pintado y conexiones ---------- */

function filasTrazas() {
  return [
    ["llamadas a write", fmt(LENTO.write.llamadas), fmt(RAPIDO.write.llamadas)],
    ["segundos en write", fmt(LENTO.write.segundos, 6), fmt(RAPIDO.write.segundos, 6)],
    ["microsegundos por write",
      fmt(usecPorLlamada(LENTO.write.segundos, LENTO.write.llamadas), 2),
      fmt(usecPorLlamada(RAPIDO.write.segundos, RAPIDO.write.llamadas), 2)],
    ["llamadas en total", fmt(LENTO.total.llamadas), fmt(RAPIDO.total.llamadas)],
    ["segundos en total", fmt(LENTO.total.segundos, 6), fmt(RAPIDO.total.segundos, 6)],
    ["tiempo de reloj, sin strace", fmt(LENTO.reloj, 2) + " s", fmt(RAPIDO.reloj, 2) + " s"]
  ];
}

function filasBueno() {
  return [
    ["brk", fmt(BUENO.brk.llamadas), fmt(BUENO.brk.segundos, 6),
      fmt(porcentajeDeLlamadas(BUENO.brk.llamadas, BUENO.total.llamadas), 1) + " %"],
    ["total de la traza", fmt(BUENO.total.llamadas), fmt(BUENO.total.segundos, 6), "100 %"]
  ];
}

function iniciar() {
  var vistaTrazas = false;

  function pintarTrazas() {
    document.getElementById("cuerpo-trazas").innerHTML = filasTrazas().map(function (f) {
      var celdas = vistaTrazas
        ? "<td>" + f[1] + "</td><td>" + f[2] + "</td>"
        : "<td class=\"pend\">?</td><td class=\"pend\">?</td>";
      return "<tr><td style=\"text-align:left\">" + f[0] + "</td>" + celdas + "</tr>";
    }).join("");
    Motor.pintarChips("chips-trazas", [
      { texto: "veces más llamadas a write",
        valor: vistaTrazas ? fmt(razonLlamadasWrite(LENTO, RAPIDO), 1) : "?", cuenta: true },
      { texto: "veces más tiempo en el núcleo",
        valor: vistaTrazas ? fmt(razonTiempoNucleo(LENTO, RAPIDO), 1) : "?", cuenta: true },
      { texto: "líneas por write en ./rapido",
        valor: vistaTrazas ? fmt(lineasPorLlamada(RAPIDO.lineas, RAPIDO.write.llamadas)) : "?" },
      { texto: "cruces al núcleo que se ahorran",
        valor: vistaTrazas ? fmt(llamadasAhorradas(LENTO, RAPIDO)) : "?" }
    ]);
  }

  function destapar() {
    vistaTrazas = true;
    pintarTrazas();
    document.getElementById("nota-trazas").hidden = false;
  }

  function pintarBueno() {
    document.getElementById("cuerpo-bueno").innerHTML = filasBueno().map(function (f) {
      return "<tr><td style=\"text-align:left\"><code>" + f[0] + "</code></td><td>" +
        f[1] + "</td><td>" + f[2] + "</td><td>" + f[3] + "</td></tr>";
    }).join("");
    Motor.pintarChips("chips-bueno", [
      { texto: "tiempo de reloj", valor: fmt(BUENO.reloj, 2) + " s" },
      { texto: "dentro del núcleo", valor: fmt(BUENO.total.segundos * 1000, 3) + " ms" },
      { texto: "del reloj, dentro del núcleo",
        valor: fmt(fraccionEnNucleo(BUENO.total.segundos, BUENO.reloj), 1) + " %", cuenta: true },
      { texto: "del reloj, fuera del núcleo",
        valor: fmt(fraccionFueraDelNucleo(BUENO.total.segundos, BUENO.reloj), 1) + " %" }
    ]);
  }

  pintarTrazas();
  pintarBueno();

  Motor.conectarPrediccion(
    { entrada: "pred-llamadas", boton: "btn-llamadas", veredicto: "ver-llamadas" },
    function () { return razonLlamadasWrite(LENTO, RAPIDO); },
    explicarRazonLlamadas);
  document.getElementById("btn-llamadas").addEventListener("click", destapar);

  Motor.conectarPrediccion(
    { entrada: "pred-tiempo", boton: "btn-tiempo", veredicto: "ver-tiempo" },
    function () { return razonTiempoNucleo(LENTO, RAPIDO); },
    explicarRazonTiempo);
  document.getElementById("btn-tiempo").addEventListener("click", destapar);

  Motor.conectarPrediccion(
    { entrada: "pred-reloj", boton: "btn-reloj", veredicto: "ver-reloj" },
    function () { return razonReloj(LENTO, RAPIDO); },
    explicarRazonReloj);

  Motor.conectarOpciones("op-reloj", "ver-reloj-op", RAZONES_RELOJ);
  Motor.conectarOpciones("op-cruce", "ver-cruce", RAZONES_CRUCE);
  Motor.conectarOpciones("op-bueno", "ver-bueno", RAZONES_BUENO);
}

if (typeof document !== "undefined") { iniciar(); }

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    LENTO: LENTO, RAPIDO: RAPIDO, BUENO: BUENO, BYTES: BYTES,
    razonLlamadasWrite: razonLlamadasWrite, razonTiempoNucleo: razonTiempoNucleo,
    razonReloj: razonReloj, llamadasAhorradas: llamadasAhorradas,
    usecPorLlamada: usecPorLlamada, lineasPorLlamada: lineasPorLlamada,
    fraccionEnNucleo: fraccionEnNucleo, fraccionFueraDelNucleo: fraccionFueraDelNucleo,
    porcentajeDeLlamadas: porcentajeDeLlamadas, relojSinLlamada: relojSinLlamada,
    explicarRazonLlamadas: explicarRazonLlamadas, explicarRazonTiempo: explicarRazonTiempo,
    explicarRazonReloj: explicarRazonReloj, filasTrazas: filasTrazas, filasBueno: filasBueno,
    RAZONES_RELOJ: RAZONES_RELOJ, RAZONES_CRUCE: RAZONES_CRUCE, RAZONES_BUENO: RAZONES_BUENO
  };
}
