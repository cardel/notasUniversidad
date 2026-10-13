if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Los contadores del procesador. Dos binarios, ./bueno y ./malo, suman la
   misma matriz de 10.000 x 10.000 enteros y solo cambian el orden de los
   indices; perf stat --repeat 10 los midio en dos tandas de eventos (TANDA1 y
   TANDA2, corridas distintas, de ahi que los absolutos no coincidan). PARALELO
   guarda la corrida del programa con hilos vista con perf stat -p. Las cuentas
   son ipc(), razon(), tasaFallos(), nucleos() y digitosComunes().            */

var MATRIZ = { filas: 10000, columnas: 10000 };

/* Primera tanda: instrucciones, accesos y fallos de L1, ciclos. */
var TANDA1 = {
  eventos: [
    { clave: "instrucciones", nombre: "instructions:u", bueno: 3504983954, malo: 3504984293 },
    { clave: "cargasL1", nombre: "l1-dcache-loads:u", bueno: 1108892990, malo: 1111367503 },
    { clave: "fallosL1", nombre: "l1-dcache-load-misses:u", bueno: 13219995, malo: 120227697 },
    { clave: "ciclos", nombre: "cycles:u", bueno: 1177787894, malo: 2796626915 }
  ],
  segundos: { bueno: 0.43538, malo: 0.79385 }
};

/* Segunda tanda: el ultimo nivel de cache, con otros eventos. */
var TANDA2 = {
  eventos: [
    { clave: "instrucciones", nombre: "instructions", bueno: 3504981209, malo: 3504981715 },
    { clave: "referencias", nombre: "cache-references", bueno: 20315439, malo: 397645281 },
    { clave: "fallos", nombre: "cache-misses", bueno: 260870, malo: 108341596 },
    { clave: "ciclos", nombre: "cycles", bueno: 2001530252, malo: 3211385373 }
  ],
  segundos: { bueno: 0.7301, malo: 1.0448 }
};

/* El programa paralelo, medido con perf stat -p sobre el proceso vivo. */
var PARALELO = { ipc: 0.9, taskClockMs: 51361.10, transcurridoS: 5.006, cpusImpreso: "10,2" };

/* Motor.num quita el cero final y aqui los decimales son el resultado. */
function dec1(x) { return x.toFixed(1).replace(".", ","); }
function dec2(x) { return x.toFixed(2).replace(".", ","); }

/* Miles con punto y los dos decimales intactos: 51361.1 -> "51.361,10". */
function miles2(x) {
  var partes = x.toFixed(2).split(".");
  return Motor.num(Number(partes[0])) + "," + partes[1];
}

function ipc(instrucciones, ciclos) { return instrucciones / ciclos; }

/* Cuantas veces cabe el valor de ./bueno en el de ./malo. */
function razon(malo, bueno) { return malo / bueno; }

function tasaFallos(fallos, accesos) { return fallos / accesos * 100; }

/* task-clock contra tiempo de reloj: nucleos ocupados durante la corrida. */
function nucleos(taskClockMs, transcurridoS) {
  return taskClockMs / (transcurridoS * 1000);
}

function valor(tanda, clave, cual) {
  for (var i = 0; i < tanda.eventos.length; i++) {
    if (tanda.eventos[i].clave === clave) { return tanda.eventos[i][cual]; }
  }
  return NaN;
}

function ipcDe(tanda, cual) {
  return ipc(valor(tanda, "instrucciones", cual), valor(tanda, "ciclos", cual));
}

function razonDe(tanda, clave) {
  return razon(valor(tanda, clave, "malo"), valor(tanda, clave, "bueno"));
}

function razonTiempo(tanda) { return razon(tanda.segundos.malo, tanda.segundos.bueno); }

/* Hasta donde coinciden dos conteos leidos de izquierda a derecha. */
function digitosComunes(a, b) {
  var sa = String(a), sb = String(b), i = 0;
  while (i < sa.length && i < sb.length && sa[i] === sb[i]) { i += 1; }
  return i;
}

function nombreEvento(tanda, clave) {
  for (var i = 0; i < tanda.eventos.length; i++) {
    if (tanda.eventos[i].clave === clave) { return tanda.eventos[i].nombre; }
  }
  return clave;
}

function explicarIpc(cual) {
  return function (bien, real) {
    var inst = valor(TANDA1, "instrucciones", cual);
    var cic = valor(TANDA1, "ciclos", cual);
    var otro = cual === "bueno" ? "malo" : "bueno";
    return (bien ? "Correcto. " : "No. ") + "El IPC de ./" + cual + " es " +
      dec2(real) + ": " + Motor.num(inst) + " instrucciones entre " +
      Motor.num(cic) + " ciclos. " +
      (bien ? "" : "La cuenta es una división, instrucciones sobre ciclos, y " +
        "los dos números están en la tabla; revise que no haya tomado los de ./" +
        otro + ".");
  };
}

function explicarFallos(bien, real) {
  return (bien ? "Correcto. " : "No. ") + "./malo tiene " + dec1(real) +
    " veces los " + nombreEvento(TANDA2, "fallos") + " de ./bueno: " +
    Motor.num(valor(TANDA2, "fallos", "malo")) + " contra " +
    Motor.num(valor(TANDA2, "fallos", "bueno")) + ". Con " +
    dec1(razonDe(TANDA2, "referencias")) + " veces más referencias al último " +
    "nivel de caché, casi todas las de ./malo terminan en memoria.";
}

function explicarTiempoT2(bien, real) {
  return (bien ? "Correcto. " : "No. ") + "El tiempo transcurrido sube " +
    dec2(real) + " veces, de " + dec2(TANDA2.segundos.bueno) + " a " +
    dec2(TANDA2.segundos.malo) + " s. Dos cifras de la misma corrida: " +
    dec1(razonDe(TANDA2, "fallos")) + " veces más fallos y " + dec2(real) +
    " veces más reloj.";
}

var RAZONES_CICLOS = {
  correcta: "Es la lectura. Los dos binarios ejecutan el mismo trabajo, y lo " +
    "que cambia es cuánto tarda cada instrucción: las de ./malo esperan datos " +
    "que no están en caché. El patrón de acceso es lo que se modificó, no el " +
    "algoritmo, y el IPC baja de 2,98 a 1,25 por eso.",
  compilador: "No. Los dos salieron del mismo compilador con las mismas " +
    "banderas, y el conteo lo confirma: una optimización que valiera la pena " +
    "habría quitado instrucciones, y hay 3.504.983.954 contra 3.504.984.293.",
  trabajo: "No. Más trabajo aparece como más instrucciones, y las dos cuentas " +
    "coinciden en los primeros seis dígitos. La diferencia está en los ciclos, " +
    "que son tiempo del procesador, no cantidad de operaciones.",
  frecuencia: "No. La frecuencia convierte ciclos en segundos, así que una " +
    "caída de frecuencia alargaría el tiempo con los mismos ciclos. Aquí los " +
    "ciclos se duplican, y eso no lo explica el reloj del procesador."
};

var RAZONES_BRECHA = {
  correcta: "Es la explicación. El tiempo de reloj incluye todo lo demás que " +
    "hace el programa, y el procesador alcanza a tapar parte de la espera " +
    "pidiendo varias líneas a la vez mientras sigue ejecutando. Cuanto más " +
    "abajo se mide, más limpia y más grande se ve la diferencia: 415 veces en " +
    "el contador de fallos, 1,43 en el cronómetro.",
  multiplexado: "No. Los porcentajes entre paréntesis que imprime perf son el " +
    "tiempo que el contador estuvo activo mientras se repartía entre pocos " +
    "registros, no una tasa de error. El conteo que publica ya está escalado a " +
    "la corrida completa.",
  barato: "No. Un fallo que llega a memoria cuesta del orden de cien ciclos, y " +
    "108.341.596 de ellos sí se notan: los ciclos suben 1,6 veces en esta misma " +
    "tanda. Lo que achica la diferencia en el reloj es que esa espera se " +
    "solapa con el resto del programa.",
  promedio: "No. Promediar repeticiones quita el ruido entre corridas, no una " +
    "diferencia que aparece en todas. Las dos tandas, con y sin repeticiones, " +
    "dejan a ./malo por encima."
};

var RAZONES_IPC_PARALELO = {
  correcta: "Es la lectura que sirve. Un programa que solo suma debería " +
    "retirar varias instrucciones por ciclo; con 0,9 el procesador está " +
    "esperando datos la mayor parte del tiempo. Afinar la aritmética no mueve " +
    "ese número: hay que arreglar el acceso a memoria, que es lo que tiene " +
    "parados los núcleos.",
  normal: "No. El IPC no baja por el hecho de repartir el trabajo en hilos. La " +
    "versión secuencial con buen recorrido de la matriz llegó a 2,98 en la " +
    "misma máquina, y un programa paralelo que acierte la caché se le acerca.",
  hilos: "No. Los hilos están: 51.361,10 msec de task-clock en 5,006 s de " +
    "reloj son 10,26 núcleos ocupados. El problema no es cuántos corren, es " +
    "que cada uno avanza poco por ciclo.",
  compilado: "No. Un binario sin optimizar se delata en las instrucciones, que " +
    "se multiplican. El IPC mide cuántas se retiran por ciclo, y 0,9 con ese " +
    "task-clock apunta a espera de memoria."
};

var RAZONES_NO_SOPORTA = {
  correcta: "Es eso. Con kernel.perf_event_paranoid en 2 el núcleo solo " +
    "entrega contadores del proceso propio, y el modo de toda la máquina queda " +
    "sin respuesta. Se habilita con sudo sysctl -w kernel.perf_event_paranoid=1 " +
    "y la misma orden vuelve a contar.",
  procesador: "No. Es el mismo evento que la corrida sin -a sí cuenta, y la " +
    "unidad de monitoreo no cambia según quién lo pida. Si el procesador no " +
    "tuviera el contador, tampoco habría cifras para ./bueno y ./malo.",
  instalar: "No. perf está instalado: la orden se ejecuta, imprime la tabla de " +
    "eventos y el tiempo transcurrido. Lo que falta es el permiso para mirar " +
    "más allá del proceso propio.",
  programa: "No. Los contadores son del procesador y no dependen de que el " +
    "programa los consulte; por eso perf mide binarios ajenos sin recompilarlos."
};

/* Cada opcion equivocada lleva su razon, y ninguna lista se queda sin correcta. */
function validarRazones(mapa) {
  var claves = Object.keys(mapa);
  if (claves.indexOf("correcta") < 0) { return false; }
  for (var i = 0; i < claves.length; i++) {
    var t = mapa[claves[i]];
    if (typeof t !== "string" || !t.trim()) { return false; }
  }
  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MATRIZ: MATRIZ, TANDA1: TANDA1, TANDA2: TANDA2, PARALELO: PARALELO,
    dec1: dec1, dec2: dec2, miles2: miles2, ipc: ipc, razon: razon, tasaFallos: tasaFallos,
    nucleos: nucleos, valor: valor, ipcDe: ipcDe, razonDe: razonDe,
    razonTiempo: razonTiempo, digitosComunes: digitosComunes,
    nombreEvento: nombreEvento, explicarIpc: explicarIpc,
    explicarFallos: explicarFallos, explicarTiempoT2: explicarTiempoT2,
    RAZONES_CICLOS: RAZONES_CICLOS, RAZONES_BRECHA: RAZONES_BRECHA,
    RAZONES_IPC_PARALELO: RAZONES_IPC_PARALELO,
    RAZONES_NO_SOPORTA: RAZONES_NO_SOPORTA, validarRazones: validarRazones
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var vistaTanda1 = false;
  /* Cada prediccion destapa solo su propia cuenta. */
  var vistaTanda2 = { fallos: false, tiempo: false };

  function fila(nombre, bueno, malo, resaltar) {
    var estilo = resaltar ? " style=\"background:var(--azul-suave)\"" : "";
    return "<tr" + estilo + "><td style=\"text-align:left\">" + nombre +
      "</td><td>" + bueno + "</td><td>" + malo + "</td></tr>";
  }

  function pintarTanda1() {
    var html = TANDA1.eventos.map(function (e) {
      return fila("<code>" + e.nombre + "</code>", num(e.bueno), num(e.malo));
    }).join("");
    html += fila("Tiempo transcurrido",
      dec2(TANDA1.segundos.bueno * 1000) + " ms",
      dec2(TANDA1.segundos.malo * 1000) + " ms");
    if (vistaTanda1) {
      html += fila("Instrucciones por ciclo", dec2(ipcDe(TANDA1, "bueno")),
        dec2(ipcDe(TANDA1, "malo")), true);
      html += fila("Fallos de L1 por cada 100 accesos",
        dec2(tasaFallos(valor(TANDA1, "fallosL1", "bueno"),
          valor(TANDA1, "cargasL1", "bueno"))),
        dec2(tasaFallos(valor(TANDA1, "fallosL1", "malo"),
          valor(TANDA1, "cargasL1", "malo"))), true);
    } else {
      html += "<tr><td style=\"text-align:left\">Instrucciones por ciclo</td>" +
        "<td class=\"pend\">?</td><td class=\"pend\">?</td></tr>";
      html += "<tr><td style=\"text-align:left\">Fallos de L1 por cada 100 " +
        "accesos</td><td class=\"pend\">?</td><td class=\"pend\">?</td></tr>";
    }
    document.getElementById("cuerpo-tanda1").innerHTML = html;
    Motor.pintarChips("chips-tanda1", [
      { texto: "veces más ciclos ./malo",
        valor: vistaTanda1 ? dec2(razonDe(TANDA1, "ciclos")) : "?", cuenta: true },
      { texto: "dígitos iguales en instructions:u",
        valor: vistaTanda1
          ? num(digitosComunes(valor(TANDA1, "instrucciones", "bueno"),
              valor(TANDA1, "instrucciones", "malo")))
          : "?" },
      { texto: "veces más tiempo ./malo",
        valor: vistaTanda1 ? dec2(razonTiempo(TANDA1)) : "?" }
    ]);
  }

  function pintarTanda2() {
    var html = TANDA2.eventos.map(function (e) {
      return fila("<code>" + e.nombre + "</code>", num(e.bueno), num(e.malo));
    }).join("");
    html += fila("Tiempo transcurrido", dec2(TANDA2.segundos.bueno) + " s",
      dec2(TANDA2.segundos.malo) + " s");
    document.getElementById("cuerpo-tanda2").innerHTML = html;
    Motor.pintarChips("chips-tanda2", [
      { texto: "veces más cache-misses",
        valor: vistaTanda2.fallos ? dec1(razonDe(TANDA2, "fallos")) : "?", cuenta: true },
      { texto: "veces más cache-references",
        valor: vistaTanda2.fallos ? dec1(razonDe(TANDA2, "referencias")) : "?" },
      { texto: "veces más tiempo",
        valor: vistaTanda2.tiempo ? dec2(razonTiempo(TANDA2)) : "?", cuenta: true }
    ]);
  }

  function pintarParalelo() {
    Motor.pintarChips("chips-paralelo", [
      { texto: "IPC", valor: dec1(PARALELO.ipc), cuenta: true },
      { texto: "núcleos ocupados",
        valor: dec2(nucleos(PARALELO.taskClockMs, PARALELO.transcurridoS)) },
      { texto: "task-clock", valor: miles2(PARALELO.taskClockMs) + " msec" }
    ]);
  }

  Motor.conectarPrediccion(
    { entrada: "pred-ipc-bueno", boton: "btn-ipc-bueno", veredicto: "ver-ipc-bueno" },
    function () { return ipcDe(TANDA1, "bueno"); }, explicarIpc("bueno"));

  Motor.conectarPrediccion(
    { entrada: "pred-ipc-malo", boton: "btn-ipc-malo", veredicto: "ver-ipc-malo" },
    function () { return ipcDe(TANDA1, "malo"); }, explicarIpc("malo"));

  document.getElementById("btn-destapar-tanda1").addEventListener("click",
    function () { vistaTanda1 = true; pintarTanda1(); });

  Motor.conectarPrediccion(
    { entrada: "pred-fallos", boton: "btn-fallos", veredicto: "ver-fallos" },
    function () { return razonDe(TANDA2, "fallos"); }, explicarFallos);

  Motor.conectarPrediccion(
    { entrada: "pred-tiempo", boton: "btn-tiempo", veredicto: "ver-tiempo" },
    function () { return razonTiempo(TANDA2); }, explicarTiempoT2);

  [["btn-fallos", "fallos"], ["btn-tiempo", "tiempo"]].forEach(function (par) {
    document.getElementById(par[0]).addEventListener("click", function () {
      vistaTanda2[par[1]] = true;
      pintarTanda2();
      if (vistaTanda2.fallos && vistaTanda2.tiempo) {
        document.getElementById("nota-brecha").hidden = false;
      }
    });
  });

  Motor.conectarOpciones("op-ciclos", "ver-ciclos", RAZONES_CICLOS);
  Motor.conectarOpciones("op-brecha", "ver-brecha", RAZONES_BRECHA);
  Motor.conectarOpciones("op-ipc-paralelo", "ver-ipc-paralelo", RAZONES_IPC_PARALELO);
  Motor.conectarOpciones("op-no-soporta", "ver-no-soporta", RAZONES_NO_SOPORTA);

  pintarTanda1();
  pintarTanda2();
  pintarParalelo();
})();
