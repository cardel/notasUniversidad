if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Dos ciclos llenan la misma matriz de 10.000 x 10.000 enteros: A recorre por
   filas y B por columnas. Mismas asignaciones, ningun hilo, 6,7 s contra
   126,7 s en un AMD Ryzen 5 3600 (6 nucleos, 12 hilos de hardware) con
   La traza de los primeros 17 accesos y las latencias de la
   jerarquia son las del repaso de memoria cache.                           */

var N = 10000;                                 // lado de la matriz
var BYTES_ENTERO = 4;                          // tamano de un int
var BYTES_LINEA = 64;                          // tamano de una linea de cache
var POR_LINEA = BYTES_LINEA / BYTES_ENTERO;    // enteros que entran en la linea
var PASO_FILA = N * BYTES_ENTERO;              // bytes de una fila a la siguiente
var ASIGNACIONES = N * N;                      // escrituras de cada version
var TIEMPO_FILAS = 6.7;
var TIEMPO_COLUMNAS = 126.7;
var PASOS_TRAZA = 17;
var HILOS_FALSA = 4;                           // hilos del caso de falsa comparticion

/* Fallos de cache de un recorrido completo. Por filas el dato siguiente ya
   vino con la linea anterior, asi que se paga uno cada POR_LINEA accesos; por
   columnas cada acceso cae en otra fila y trae su propia linea.             */
function fallos(n, elementosPorLinea, orden) {
  var accesos = n * n;
  return orden === "filas" ? accesos / elementosPorLinea : accesos;
}

function factor(tiempoA, tiempoB) {
  return tiempoA / tiempoB;
}

/* Los primeros accesos de las dos versiones. A avanza dentro de la fila 0 y B
   baja por la columna 0, saltando PASO_FILA bytes en cada paso.             */
function traza(pasos, elementosPorLinea) {
  var filas = [];
  for (var k = 0; k < pasos; k++) {
    filas.push({
      paso: k + 1,
      accesoA: "arr[0][" + k + "]",
      cacheA: k % elementosPorLinea === 0 ? "fallo" : "acierto",
      accesoB: "arr[" + k + "][0]",
      desplazamientoB: k * PASO_FILA,
      cacheB: "fallo"
    });
  }
  return filas;
}

/* Fallos de cada version en los primeros k pasos de la traza. */
function acumulado(filas, k) {
  var a = 0, b = 0;
  for (var i = 0; i < k && i < filas.length; i++) {
    if (filas[i].cacheA === "fallo") { a += 1; }
    if (filas[i].cacheB === "fallo") { b += 1; }
  }
  return { fallosA: a, fallosB: b, relacion: a === 0 ? 0 : b / a };
}

/* Veces que la linea compartida cambia de nucleo: la primera escritura y cada
   vez que escribe un hilo distinto del anterior.                            */
function transferencias(secuencia) {
  var n = 0;
  for (var i = 0; i < secuencia.length; i++) {
    if (i === 0 || secuencia[i] !== secuencia[i - 1]) { n += 1; }
  }
  return n;
}

function filasTiempos() {
  return [
    { orden: "A, por filas", tiempo: TIEMPO_FILAS },
    { orden: "B, por columnas", tiempo: TIEMPO_COLUMNAS }
  ];
}

function explicarLinea(bien, real, dicho) {
  var s = bien
    ? "Sí: " + real + " accesos por cada línea que entra. "
    : "Son " + real + ", no " + Motor.num(dicho, 1) + ". ";
  s += BYTES_LINEA + " entre " + BYTES_ENTERO + ": en una línea caben " + real +
    " enteros seguidos. Por filas esos " + real + " son justamente los " + real +
    " accesos que siguen, así que se paga un fallo y luego " + (real - 1) +
    " aciertos. Por columnas el acceso siguiente cae " + Motor.num(PASO_FILA) +
    " bytes más adelante, en otra fila y fuera de la línea: un fallo cada vez. " +
    "De esa relación de " + real + " a 1 salen los dos tiempos.";
  return s;
}

function describirPaso(filas, i) {
  var f = filas[i];
  var s = "Paso " + f.paso + ". A toca " + f.accesoA + ": ";
  if (f.cacheA === "fallo") {
    s += "fallo. La línea que entra trae ese entero y los " + (POR_LINEA - 1) +
      " que le siguen en la fila. ";
  } else {
    s += "acierto, ese entero llegó con la línea del paso " +
      (Math.floor((f.paso - 1) / POR_LINEA) * POR_LINEA + 1) + ". ";
  }
  s += "B toca " + f.accesoB + ": ";
  if (f.desplazamientoB === 0) {
    s += "el mismo entero y el mismo fallo. La diferencia está en lo que viene " +
      "con la línea: " + (POR_LINEA - 1) + " vecinos de la fila 0 que B no " +
      "vuelve a mirar hasta dentro de " + Motor.num(N) + " accesos.";
  } else {
    s += "fallo. Está " + Motor.num(f.desplazamientoB) +
      " bytes más adelante, en otra fila y en otra línea.";
  }
  return s;
}

function describirCierre(filas) {
  var a = acumulado(filas, filas.length);
  return "En " + filas.length + " pasos A pagó " + a.fallosA + " fallos y B pagó " +
    a.fallosB + ". La proporción se mantiene hasta el final: la matriz completa " +
    "cuesta " + Motor.num(fallos(N, POR_LINEA, "filas")) + " fallos por filas y " +
    Motor.num(fallos(N, POR_LINEA, "columnas")) + " por columnas.";
}

function textoEscritura(secuencia) {
  if (!secuencia.length) {
    return "Pulse una casilla y vea qué le pasa a la línea cuando ese hilo escribe.";
  }
  var i = secuencia.length - 1;
  var h = secuencia[i];
  var s = "El hilo " + h + " escribe suma[" + h + "]. ";
  if (i === 0 || secuencia[i - 1] !== h) {
    s += "La línea viaja a su núcleo y la copia que tenían los otros " +
      (HILOS_FALSA - 1) + " queda inválida: el que escriba después tiene que " +
      "pedirla otra vez.";
  } else {
    s += "La línea ya estaba en su núcleo, así que esta escritura no mueve nada.";
  }
  return s;
}

var RAZONES_DIFERENCIA = {
  correcta: "Del número de fallos. Por filas se paga uno cada " + POR_LINEA +
    " accesos, " + Motor.num(fallos(N, POR_LINEA, "filas")) + " en total; por " +
    "columnas uno en cada acceso, " + Motor.num(fallos(N, POR_LINEA, "columnas")) +
    ". Cada fallo trae una línea de " + BYTES_LINEA + " bytes para usar " +
    BYTES_ENTERO + " y descartar los otros " + (BYTES_LINEA - BYTES_ENTERO) +
    " antes de volver a esa fila. El factor entre los dos tiempos queda en " +
    Motor.num(factor(TIEMPO_COLUMNAS, TIEMPO_FILAS), 1) + ".",
  trabajo: "Son las mismas " + Motor.num(ASIGNACIONES) + " asignaciones, el " +
    "mismo valor i + j y la misma posición arr[i][j]. Lo que cambia es el orden " +
    "en que se visitan, no cuántas hay.",
  nucleos: "Ninguno de los dos lanza un hilo: los dos ciclos corren en un solo " +
    "núcleo. Los 120 segundos de diferencia aparecieron sin tocar el número de " +
    "núcleos de la máquina.",
  tamano: "Es la misma matriz de " + Motor.num(N) + " × " + Motor.num(N) +
    ", declarada una sola vez, y los dos ciclos la llenan completa."
};

var RAZONES_FALSA = {
  correcta: "Cada hilo acumula en una variable local, que vive en su pila y no " +
    "comparte línea con las de los otros. Al final se combinan los cuatro totales " +
    "y la escritura compartida pasa de millones de veces a " + HILOS_FALSA +
    ". Las otras dos salidas al mismo problema son repartir filas completas por " +
    "hilo, para que dos hilos no toquen la misma línea, y alinear cada contador " +
    "a un límite de línea de caché.",
  critico: "Un critical alrededor de la escritura serializa el cuerpo del ciclo: " +
    "los cuatro hilos hacen fila en cada vuelta. Queda más lento que el " +
    "ping-pong y más lento que la versión secuencial, y el resultado ya era " +
    "correcto antes.",
  privado: "Con el arreglo private cada hilo recibe una copia sin inicializar y " +
    "la copia muere al cerrar la región paralela. El arreglo de afuera queda " +
    "como estaba y los cuatro totales se pierden.",
  mas: "El problema no es cuántos hilos hay sino cuántos escriben en la misma " +
    "línea. Con ocho hilos sobre ocho enteros los 32 bytes siguen cabiendo en " +
    "los " + BYTES_LINEA + " de una línea y la invalidación va y viene entre " +
    "más núcleos."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    N: N, BYTES_ENTERO: BYTES_ENTERO, BYTES_LINEA: BYTES_LINEA,
    POR_LINEA: POR_LINEA, PASO_FILA: PASO_FILA, ASIGNACIONES: ASIGNACIONES,
    TIEMPO_FILAS: TIEMPO_FILAS, TIEMPO_COLUMNAS: TIEMPO_COLUMNAS,
    PASOS_TRAZA: PASOS_TRAZA, HILOS_FALSA: HILOS_FALSA,
    RAZONES_DIFERENCIA: RAZONES_DIFERENCIA, RAZONES_FALSA: RAZONES_FALSA,
    fallos: fallos, factor: factor, traza: traza, acumulado: acumulado,
    transferencias: transferencias, filasTiempos: filasTiempos,
    explicarLinea: explicarLinea, describirPaso: describirPaso,
    describirCierre: describirCierre, textoEscritura: textoEscritura
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var filas = traza(PASOS_TRAZA, POR_LINEA);
  var k = 0;                 // pasos recorridos de la traza
  var abierto = false;       // la fila del factor se destapa al responder
  var secuencia = [];        // hilos que ya escribieron, en orden
  var cajas = document.querySelectorAll("[data-hilo]");

  function pintarTraza() {
    var pend = "<td class=\"pend\">?</td>";
    document.getElementById("cuerpo-traza").innerHTML = filas.map(function (f, i) {
      if (i >= k) {
        return "<tr><td>" + f.paso + "</td>" + pend + pend + pend + pend + pend + "</tr>";
      }
      var cache = function (v) { return "<td class=\"" + v + "\">" + v + "</td>"; };
      return "<tr><td>" + f.paso + "</td><td>" + f.accesoA + "</td>" +
        cache(f.cacheA) + "<td>" + f.accesoB + "</td><td>" +
        num(f.desplazamientoB) + " B</td>" + cache(f.cacheB) + "</tr>";
    }).join("");
  }

  function pintarPaso() {
    var total = filas.length;
    var hechas = k >= total;
    var a = acumulado(filas, k);
    document.getElementById("progreso").textContent = k === 0
      ? total + " pasos por recorrer."
      : "Paso " + k + " de " + total + (hechas ? " · terminó" : "");
    document.getElementById("btn-siguiente").disabled = hechas;
    var texto = k > 0 ? describirPaso(filas, k - 1) : "";
    if (hechas) { texto += " " + describirCierre(filas); }
    document.getElementById("paso-texto").textContent = texto;
    Motor.pintarChips("chips-traza", [
      { texto: "fallos de A", valor: num(a.fallosA) },
      { texto: "fallos de B", valor: num(a.fallosB) },
      {
        texto: "fallos de B por cada uno de A",
        valor: a.fallosA === 0 ? "?" : num(a.relacion, 1),
        cuenta: true
      }
    ]);
    pintarTraza();
  }

  function pintarTiempos() {
    var pend = "<td class=\"pend\">?</td>";
    var html = filasTiempos().map(function (f) {
      return "<tr><td style=\"text-align:left\">" + f.orden + "</td><td>" +
        num(f.tiempo, 1) + " s</td></tr>";
    }).join("");
    html += "<tr><td style=\"text-align:left\">B dividido por A</td>" +
      (abierto
        ? "<td><b>" + num(factor(TIEMPO_COLUMNAS, TIEMPO_FILAS), 1) + "</b></td>"
        : pend) + "</tr>";
    document.getElementById("cuerpo-tiempos").innerHTML = html;
  }

  function pintarFalsa() {
    cajas.forEach(function (c) {
      var h = Number(c.dataset.hilo);
      var ultimo = secuencia.length && secuencia[secuencia.length - 1] === h;
      var escribio = secuencia.indexOf(h) >= 0;
      c.className = "caja" + (escribio ? " visitada" : "") + (ultimo ? " actual" : "");
    });
    document.getElementById("texto-falsa").textContent = textoEscritura(secuencia);
    Motor.pintarChips("chips-falsa", [
      { texto: "escrituras", valor: num(secuencia.length) },
      {
        texto: "veces que la línea cambió de núcleo",
        valor: num(transferencias(secuencia)),
        cuenta: true
      }
    ]);
  }

  document.getElementById("btn-siguiente").addEventListener("click", function () {
    k = Math.min(k + 1, filas.length); pintarPaso();
  });
  document.getElementById("btn-todo").addEventListener("click", function () {
    k = filas.length; pintarPaso();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    k = 0; pintarPaso();
  });

  Motor.conectarPrediccion(
    { entrada: "prediccion-linea", boton: "btn-comprobar-linea", veredicto: "veredicto-linea" },
    function () { return POR_LINEA; },
    explicarLinea);

  Motor.conectarOpciones("opciones-diferencia", "veredicto-diferencia", RAZONES_DIFERENCIA);
  document.querySelectorAll("#opciones-diferencia button").forEach(function (b) {
    b.addEventListener("click", function () {
      abierto = true;
      document.getElementById("alerta-cuello").hidden = false;
      pintarTiempos();
    });
  });

  Motor.conectarOpciones("opciones-falsa", "veredicto-falsa", RAZONES_FALSA);

  cajas.forEach(function (c) {
    c.addEventListener("click", function () {
      secuencia.push(Number(c.dataset.hilo));
      pintarFalsa();
    });
  });
  document.getElementById("btn-limpiar").addEventListener("click", function () {
    secuencia = []; pintarFalsa();
  });

  pintarPaso();
  pintarTiempos();
  pintarFalsa();
})();
