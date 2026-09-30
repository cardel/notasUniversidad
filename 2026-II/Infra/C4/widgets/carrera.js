if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Dos hilos abonan sobre el mismo saldo. Un abono son tres micro-pasos
   (leer, sumar, escribir) y el intercalado dice quien ejecuta cada uno.
   Las cifras son las de actualizacion_perdida.py: 200.000 abonos por hilo,
   esperado 400.000, y cinco corridas seguidas del mismo archivo medidas en
   un AMD Ryzen 5 3600 (6 nucleos, 12 hilos de hardware), 32 GB, Python 3.14
   sobre Linux, con sys.setswitchinterval(1e-6).                            */

var ABONOS = 200000;              // REPETICIONES por hilo
var ESPERADO = 2 * ABONOS;
var ABONOS_PASO = 2;              // los que se recorren a mano en la carta 3

var MEDIDO = [282983, 276219, 293310, 284237, 286280];

/* Los extremos de esas cinco corridas: 106.690 y 123.781 abonos perdidos. */
var PERDIDA_MIN = (ESPERADO - 293310) / ESPERADO;
var PERDIDA_MAX = (ESPERADO - 276219) / ESPERADO;

var ACCIONES = ["leer", "sumar", "escribir"];
var ETIQUETA = { leer: "v = consultar()", sumar: "v + 1", escribir: "guardar(v)" };

function porcentaje(saldo, esperado) {
  var e = esperado === undefined ? ESPERADO : esperado;
  return (e - saldo) / e * 100;
}

/* intercalado es una lista de "A"/"B" que dice quien ejecuta cada micro-paso.
   La aparicion k de un hilo es su micro-paso k, asi que el orden interno de
   cada hilo (leer, sumar, escribir) nunca se altera.                        */
function pasos(intercalado) {
  var cuenta = { A: 0, B: 0 };
  return intercalado.map(function (hilo, i) {
    var k = cuenta[hilo]++;
    return {
      instante: i + 1, hilo: hilo,
      accion: ACCIONES[k % 3], abono: Math.floor(k / 3) + 1
    };
  });
}

/* Acepta la lista de etiquetas o la de micro-pasos ya armada. */
function normalizar(intercalado) {
  if (!intercalado.length) { return []; }
  return typeof intercalado[0] === "string" ? pasos(intercalado) : intercalado;
}

/* Ejecuta el intercalado: leer copia el saldo al registro del hilo, sumar
   trabaja sobre esa copia y escribir la devuelve al saldo compartido. Lo que
   se pierde son escrituras tapadas, no vueltas del bucle: por eso las
   perdidas son abonos hechos menos saldo.                                   */
function simular(intercalado) {
  var micro = normalizar(intercalado);
  var saldo = 0, reg = { A: null, B: null }, abonos = 0;
  var traza = micro.map(function (p) {
    if (p.accion === "leer") { reg[p.hilo] = saldo; }
    else if (p.accion === "sumar") { reg[p.hilo] = reg[p.hilo] + 1; }
    else { saldo = reg[p.hilo]; abonos++; }
    return {
      instante: p.instante, hilo: p.hilo, accion: p.accion, abono: p.abono,
      registroA: reg.A, registroB: reg.B, saldo: saldo
    };
  });
  return { traza: traza, saldo: saldo, abonos: abonos, perdidas: abonos - saldo };
}

/* Con el cerrojo tomado los tres pasos de un abono no se parten: nadie lee
   entre esa lectura y esa escritura, y los dos hilos dejan 2n. Las tres
   corridas de actualizacion_con_cerrojo.py dieron 400.000 y cero perdidas. */
function conCerrojo(n) { return 2 * n; }

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

/* abonos por hilo -> micro-pasos intercalados. Se barajan las etiquetas, no
   los micro-pasos: asi la aparicion k de "A" sigue siendo el micro-paso k
   del hilo A y su orden interno queda intacto.                             */
function generarIntercalado(abonos, semilla) {
  var etiquetas = [];
  for (var i = 0; i < abonos * 3; i++) { etiquetas.push("A"); etiquetas.push("B"); }
  return pasos(barajar(etiquetas, semilla));
}

/* Los tres intercalados de la carta 3. */
function intercaladoPreset(clave, abonos, semilla) {
  var e = [], i;
  if (clave === "ordenado") {
    for (i = 0; i < abonos * 3; i++) { e.push("A"); }
    for (i = 0; i < abonos * 3; i++) { e.push("B"); }
    return pasos(e);
  }
  if (clave === "alternado") {
    for (i = 0; i < abonos * 3; i++) { e.push("A"); e.push("B"); }
    return pasos(e);
  }
  return generarIntercalado(abonos, semilla);
}

/* Una corrida de 200.000 abonos por hilo no se recorre micro-paso a
   micro-paso. Barajar 1.200.000 micro-pasos con peso uniforme pierde mucho
   mas que la maquina: el interprete no cambia de hilo en cada operacion,
   solo cuando vence el switchinterval, y entre dos cambios un hilo alcanza a
   cerrar miles de abonos completos. Asi que la cifra sale de un LCG
   calibrado al rango medido, entre 26,7 % y 30,9 % de abonos perdidos.     */
function corrida(abonos, semilla) {
  var r = lcg(semilla);
  r();                  // el primer valor arrastra la semilla; se descarta
  var p = PERDIDA_MIN + r() * (PERDIDA_MAX - PERDIDA_MIN);
  return Math.round(2 * abonos * (1 - p));
}

/* Estado despues de los primeros k micro-pasos, para las chips. */
function estado(res, k) {
  if (k <= 0) { return { abonos: 0, saldo: 0, perdidas: 0 }; }
  var abonos = 0;
  for (var i = 0; i < k; i++) {
    if (res.traza[i].accion === "escribir") { abonos++; }
  }
  var saldo = res.traza[k - 1].saldo;
  return { abonos: abonos, saldo: saldo, perdidas: abonos - saldo };
}

/* Celda de la columna Accion. Sin ejecutar solo se ve la instruccion; el
   valor aparece cuando el micro-paso ya corrio.                            */
function textoAccion(f, hecho) {
  if (!hecho) { return ETIQUETA[f.accion]; }
  var reg = f.hilo === "A" ? f.registroA : f.registroB;
  if (f.accion === "leer") { return "v = consultar() → " + Motor.num(reg); }
  if (f.accion === "sumar") { return "v + 1 → " + Motor.num(reg); }
  return "guardar(" + Motor.num(reg) + ")";
}

function describirPaso(res, i) {
  var num = Motor.num;
  var f = res.traza[i];
  var antes = i > 0 ? res.traza[i - 1] : { saldo: 0 };
  var reg = f.hilo === "A" ? f.registroA : f.registroB;
  var s = "Instante " + f.instante + ", hilo " + f.hilo + ", abono " + f.abono + ": ";
  if (f.accion === "leer") {
    s += "lee el saldo y se lleva " + num(reg) + " a su registro. El saldo sigue en " +
      num(f.saldo) + " y ese " + num(reg) + " ya no cambia aunque el otro hilo escriba.";
  } else if (f.accion === "sumar") {
    s += "le suma uno a lo que leyó: su registro pasa de " + num(reg - 1) + " a " +
      num(reg) + ". El saldo compartido sigue en " + num(f.saldo) + ".";
  } else {
    s += "escribe " + num(reg) + " en el saldo, que estaba en " + num(antes.saldo) + ".";
    if (f.saldo <= antes.saldo) {
      s += " El saldo no se mueve: este hilo había leído " + num(reg - 1) +
        " antes de que el otro escribiera " + num(antes.saldo) +
        ", así que su escritura reemplaza la anterior en lugar de sumarse a ella.";
    }
  }
  return s;
}

function describirCierre(res) {
  var num = Motor.num;
  var s = "Los dos hilos hicieron " + num(res.abonos) + " abonos y el saldo quedó en " +
    num(res.saldo) + ". ";
  if (res.perdidas === 0) {
    s += "Ningún hilo leyó mientras el otro tenía un abono a medias, así que no se tapó " +
      "ninguna escritura. El mismo programa con otro intercalado da otro número.";
  } else {
    s += "Faltan " + num(res.perdidas) +
      (res.perdidas === 1 ? " abono" : " abonos") + ", uno por cada escritura que cayó " +
      "sobre un saldo leído antes de tiempo. Ninguna vuelta del bucle se saltó: lo que " +
      "se pierde son escrituras.";
  }
  return s;
}

function explicarMaximo(bien, real, dicho) {
  var num = Motor.num;
  var mejor = Math.max.apply(null, MEDIDO);
  var peor = Math.min.apply(null, MEDIDO);
  var s = bien ? "Sí: como máximo " + num(real) + ". "
               : "Como máximo " + num(real) + ", no " + num(dicho) + ". ";
  s += "Y ese número sale solo si ningún hilo lee un saldo viejo. En las cinco corridas " +
    "medidas el mejor caso fue " + num(mejor) + ", un " + num(porcentaje(mejor), 1) +
    " % perdido, y el peor " + num(peor) + ", un " + num(porcentaje(peor), 1) + " %. " +
    "El saldo nunca pasa de " + num(real) + " porque no se hacen abonos de más: cada hilo " +
    "recorre su bucle completo y lo que desaparece son escrituras.";
  return s;
}

function filasMedidas() {
  return MEDIDO.map(function (s, i) {
    return {
      corrida: i + 1, obtenido: s, perdidas: ESPERADO - s, porcentaje: porcentaje(s)
    };
  });
}

var RAZONES = {
  correcta: "Un threading.Lock alrededor de los tres pasos. Con el cerrojo tomado nadie " +
    "lee mientras otro escribe, así que ninguna escritura llega con un saldo viejo: el " +
    "archivo con cerrojo dio " + Motor.num(conCerrojo(ABONOS)) + " y cero perdidas en las " +
    "tres corridas seguidas.",
  global: "El saldo ya es global, y por eso lo ven los dos hilos: guardar lo declara con " +
    "global antes de escribirlo. Que sea global no es la falla, es la condición para que " +
    "la falla exista, porque dos hilos escriben la misma variable.",
  intervalo: "Subir sys.setswitchinterval hace que el intérprete alterne con menos " +
    "frecuencia, y eso baja la probabilidad de que un cambio caiga entre la lectura y la " +
    "escritura, no la elimina. Con el intervalo por defecto de 0,005 s, 4 de 10 intentos " +
    "perdieron abonos; con 0,001 s, los 10 de 10. El resultado sigue dependiendo de dónde " +
    "caiga el cambio de hilo.",
  cuatro: "Con cuatro hilos hay más intercalados posibles y más ventanas abiertas entre " +
    "una lectura y su escritura, así que se pierden más abonos. El esperado subiría a " +
    Motor.num(4 * ABONOS) + " y el obtenido quedaría todavía más lejos."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ABONOS: ABONOS, ESPERADO: ESPERADO, ABONOS_PASO: ABONOS_PASO, MEDIDO: MEDIDO,
    RAZONES: RAZONES, porcentaje: porcentaje, pasos: pasos, simular: simular,
    conCerrojo: conCerrojo, lcg: lcg, barajar: barajar,
    generarIntercalado: generarIntercalado, intercaladoPreset: intercaladoPreset,
    corrida: corrida, estado: estado, textoAccion: textoAccion,
    describirPaso: describirPaso, describirCierre: describirCierre,
    explicarMaximo: explicarMaximo, filasMedidas: filasMedidas
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var preset = "alternado";
  var semilla = 3;
  var res = simular(intercaladoPreset(preset, ABONOS_PASO, semilla));
  var k = 0;                 // micro-pasos ejecutados
  var corridas = [];         // saldos de las corridas simuladas en la carta 4
  var semillaCorrida = 101;
  var NOMBRE = { ordenado: "ordenado", alternado: "alternado", barajado: "barajado" };

  function pintarPresets() {
    document.querySelectorAll("[data-preset]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.preset === preset);
    });
  }

  function pintarTraza() {
    document.getElementById("cuerpo-traza").innerHTML = res.traza.map(function (f, i) {
      var hecho = i < k;
      var pend = "<td class=\"pend\">?</td>";
      var celda = function (v) {
        if (!hecho) { return pend; }
        return "<td>" + (v === null ? "—" : num(v)) + "</td>";
      };
      return "<tr" + (i === k - 1 ? " class=\"actual\"" : "") + "><td>" + f.instante +
        "</td><td>" + f.hilo + "</td><td style=\"text-align:left\">" +
        textoAccion(f, hecho) + "</td>" + celda(f.registroA) + celda(f.registroB) +
        (hecho ? "<td><b>" + num(f.saldo) + "</b></td>" : pend) + "</tr>";
    }).join("");
  }

  function pintarPaso() {
    var total = res.traza.length;
    var hechas = k >= total;
    var e = estado(res, k);
    document.getElementById("progreso").textContent = k === 0
      ? "Intercalado " + NOMBRE[preset] + " con " + ABONOS_PASO + " abonos por hilo: " +
        total + " micro-pasos por recorrer."
      : "Micro-paso " + k + " de " + total + " · intercalado " + NOMBRE[preset] +
        (hechas ? " · terminó" : "");
    document.getElementById("btn-siguiente").disabled = hechas;
    var texto = k > 0 ? describirPaso(res, k - 1) : "";
    if (hechas) { texto += " " + describirCierre(res); }
    document.getElementById("paso-texto").textContent = texto;
    Motor.pintarChips("chips-traza", [
      { texto: "abonos hechos", valor: num(e.abonos) },
      { texto: "saldo", valor: num(e.saldo) },
      { texto: "perdidas", valor: num(e.perdidas), cuenta: e.perdidas > 0 }
    ]);
    pintarTraza();
  }

  function cambiarPreset(clave) {
    // volver a pulsar barajado da otro intercalado del mismo tamano
    if (clave === "barajado" && preset === "barajado") { semilla += 1; }
    preset = clave;
    res = simular(intercaladoPreset(preset, ABONOS_PASO, semilla));
    k = 0;
    pintarPresets();
    pintarPaso();
  }

  function pintarMedidas() {
    var abierta = corridas.length >= 5;
    var pend = "<td class=\"pend\">?</td>";
    document.getElementById("cuerpo-medidas").innerHTML = filasMedidas().map(function (f) {
      var celdas = abierta
        ? "<td>" + num(f.obtenido) + "</td><td>" + num(f.perdidas) + "</td><td>" +
          num(f.porcentaje, 1) + " %</td>"
        : pend + pend + pend;
      return "<tr><td>" + f.corrida + "</td>" + celdas + "</tr>";
    }).join("");
  }

  function pintarCorridas() {
    var n = corridas.length;
    var chips = corridas.map(function (s, i) {
      return {
        texto: "corrida " + (i + 1),
        valor: num(s) + " · " + num(porcentaje(s), 1) + " % perdido"
      };
    });
    if (n === 0) {
      chips = [{ texto: "corridas simuladas", valor: "ninguna todavía" }];
    }
    if (n >= 5) {
      chips.push({ texto: "corridas que dieron " + num(ESPERADO), valor: "0 de 5", cuenta: true });
    }
    Motor.pintarChips("chips-corridas", chips);
    document.getElementById("progreso-corridas").textContent = n === 0
      ? "El archivo y la máquina no cambian entre corridas: solo se repite la ejecución."
      : n < 5
        ? "Corridas simuladas: " + n + " de 5 · ninguna llegó a " + num(ESPERADO) + "."
        : "Cinco corridas, cinco saldos distintos y ninguno correcto. Abajo quedan las " +
          "cinco medidas en la máquina.";
    document.getElementById("btn-correr").disabled = n >= 5;
    pintarMedidas();
  }

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () { cambiarPreset(b.dataset.preset); });
  });
  document.getElementById("btn-siguiente").addEventListener("click", function () {
    k = Math.min(k + 1, res.traza.length); pintarPaso();
  });
  document.getElementById("btn-todo").addEventListener("click", function () {
    k = res.traza.length; pintarPaso();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    k = 0; pintarPaso();
  });
  document.getElementById("btn-correr").addEventListener("click", function () {
    if (corridas.length >= 5) { return; }
    corridas.push(corrida(ABONOS, semillaCorrida));
    semillaCorrida += 37;
    pintarCorridas();
  });
  Motor.conectarPrediccion(
    { entrada: "prediccion-maximo", boton: "btn-comprobar-maximo", veredicto: "veredicto-maximo" },
    function () { return ESPERADO; },
    explicarMaximo);
  Motor.conectarOpciones("opciones-arreglo", "veredicto-arreglo", RAZONES);
  document.querySelectorAll("#opciones-arreglo button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.getElementById("codigo-cerrojo").hidden = false;
    });
  });

  pintarPresets();
  pintarPaso();
  pintarCorridas();
})();
