if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Dos hilos suman sobre la misma variable c, que arranca en 0: el hilo 0
   aporta 5 y el hilo 1 aporta 7. Cada suma son tres micro-pasos (leer c,
   sumar dentro del registro del hilo, escribir ese registro en c) y el
   intercalado dice quien ejecuta cada uno. El primer preset es la traza del
   frame de carrera de datos: seis instantes y c en 7 en vez de 12.         */

var APORTE = [5, 7];

function correcto() { return APORTE[0] + APORTE[1]; }

/* Pares [hilo, accion] -> micro-pasos numerados. */
function micro(pares) {
  return pares.map(function (p, i) {
    return { instante: i + 1, hilo: p[0], accion: p[1] };
  });
}

var INTERCALADOS = {
  clase: micro([[0, "leer"], [1, "leer"], [0, "sumar"], [1, "sumar"],
               [0, "escribir"], [1, "escribir"]]),
  ordenado: micro([[0, "leer"], [0, "sumar"], [0, "escribir"],
                   [1, "leer"], [1, "sumar"], [1, "escribir"]]),
  tardio: micro([[1, "leer"], [1, "sumar"], [1, "escribir"],
                 [0, "leer"], [0, "sumar"], [0, "escribir"]])
};

/* Ejecuta el intercalado. leer copia c al registro del hilo, sumar trabaja
   sobre esa copia y escribir la devuelve a c. Una escritura tapa otra cuando
   c cambio entre la lectura de ese hilo y su escritura: ahi se pierde la
   suma del hilo que escribio antes, no una iteracion del ciclo.            */
function simular(intercalado) {
  var c = 0, reg = [null, null], leido = [null, null], perdidas = 0;
  var traza = intercalado.map(function (p) {
    var tapa = false;
    if (p.accion === "leer") { reg[p.hilo] = c; leido[p.hilo] = c; }
    else if (p.accion === "sumar") { reg[p.hilo] = reg[p.hilo] + APORTE[p.hilo]; }
    else {
      tapa = c !== leido[p.hilo];
      if (tapa) { perdidas++; }
      c = reg[p.hilo];
    }
    return {
      instante: p.instante, hilo: p.hilo, accion: p.accion,
      reg0: reg[0], reg1: reg[1], c: c, tapa: tapa
    };
  });
  return { traza: traza, resultado: c, perdidas: perdidas, perdio: perdidas > 0 };
}

/* Celda de la columna de un hilo. El hilo que no actua queda en blanco. */
function textoCelda(f, hilo) {
  if (f.hilo !== hilo) { return "—"; }
  var reg = hilo === 0 ? f.reg0 : f.reg1;
  if (f.accion === "leer") { return "lee c → " + Motor.num(reg); }
  if (f.accion === "sumar") {
    return "suma " + Motor.num(APORTE[hilo]) + ", obtiene " + Motor.num(reg);
  }
  return "escribe " + Motor.num(reg);
}

function describirPaso(res, i) {
  var num = Motor.num;
  var f = res.traza[i];
  var antes = i > 0 ? res.traza[i - 1].c : 0;
  var reg = f.hilo === 0 ? f.reg0 : f.reg1;
  var s = "Instante " + f.instante + ", hilo " + f.hilo + ": ";
  if (f.accion === "leer") {
    s += "lee c y se lleva " + num(reg) + " a su registro. c sigue en " + num(f.c) +
      ", y ese " + num(reg) + " ya no cambia aunque el otro hilo escriba.";
  } else if (f.accion === "sumar") {
    s += "suma su aporte de " + num(APORTE[f.hilo]) + " a lo que leyó y obtiene " +
      num(reg) + " en su registro. c compartida sigue en " + num(f.c) + ".";
  } else {
    s += "escribe " + num(reg) + " en c, que estaba en " + num(antes) + ".";
    if (f.tapa) {
      s += " El " + num(antes) + " que había dejado el otro hilo desaparece: este hilo leyó " +
        num(reg - APORTE[f.hilo]) + " antes de esa escritura y su valor la reemplaza, " +
        "en lugar de sumarse a ella.";
    }
  }
  return s;
}

function describirCierre(res) {
  var num = Motor.num;
  var s = "c quedó en " + num(res.resultado) + " y los dos aportes suman " +
    num(correcto()) + ". ";
  if (res.perdio) {
    s += "Se perdió " + (res.perdidas === 1 ? "una escritura" : num(res.perdidas) +
      " escrituras") + ": ningún hilo dejó de hacer su suma; lo que desapareció fue el valor " +
      "que uno ya había dejado en c. El orden lo decide el sistema operativo y cambia entre " +
      "corridas.";
  } else {
    s += "Cada hilo leyó c después de que el otro escribió, de modo que ninguna escritura " +
      "tapó a la otra. Sin protección, el mismo ciclo puede dar otro número en la corrida " +
      "siguiente: el orden lo decide el sistema operativo.";
  }
  return s;
}

/* Valor de c y escrituras tapadas tras los primeros k micro-pasos. */
function estado(res, k) {
  var perdidas = 0;
  for (var i = 0; i < k; i++) { if (res.traza[i].tapa) { perdidas++; } }
  return { c: k > 0 ? res.traza[k - 1].c : 0, perdidas: perdidas };
}

function explicarPrediccion(bien, real, dicho) {
  var num = Motor.num;
  var s = bien ? "Sí: c queda en " + num(real) + ". "
               : "c queda en " + num(real) + ", no en " + num(dicho, 2) + ". ";
  s += "Los dos leen 0, el hilo 0 escribe 5 y el hilo 1 escribe 7 encima. El 5 desaparece, " +
    "y el total correcto, " + num(correcto()) + ", no aparece en ninguna parte.";
  return s;
}

var MECANISMOS = [
  {
    nombre: "critical",
    protege: "Varias instrucciones que deben ejecutarse juntas",
    costo: "Alto: serializa el bloque completo"
  },
  {
    nombre: "atomic",
    protege: "Una sola operación de lectura y escritura sobre un escalar",
    costo: "Bajo: lo resuelve el hardware"
  },
  {
    nombre: "reduction",
    protege: "Un acumulador que recibe una operación por iteración (+, *, max, min)",
    costo: "Cada hilo acumula en una copia propia y OpenMP combina al final; es el más " +
      "rápido cuando el patrón es acumular"
  }
];

var RAZONES_ACUMULAR = {
  correcta: "reduction. Cada hilo acumula en una copia propia y OpenMP combina las copias una " +
    "sola vez al final, así que el millón de sumas no pasa por ningún punto compartido.",
  critical: "critical serializa el bloque completo: el millón de sumas entra de una en una, el " +
    "ciclo queda como secuencial y encima paga el cerrojo en cada iteración.",
  atomic: "atomic resuelve una operación simple en el hardware, que por vez cuesta poco, pero " +
    "sigue sincronizando un millón de veces sobre la misma dirección.",
  privada: "Con la variable private cada hilo tendría su propia copia, sin inicializar, y nadie " +
    "las combina: al cerrar la región el total se pierde y afuera la variable sigue como estaba."
};

var RAZONES_CASOS = {
  correcta: "El contador es una lectura y una escritura sobre un escalar, y eso lo resuelve " +
    "atomic en el hardware. Los tres campos tienen que quedar consistentes entre sí, y por eso " +
    "van juntos dentro de un critical, donde un hilo a la vez ejecuta el bloque.",
  invertida: "Al revés. critical sobre el contador serializa un bloque entero por un incremento " +
    "que el hardware resuelve solo. Y atomic protege una operación a la vez: con tres " +
    "campos, otro hilo alcanza a ver dos nuevos y uno viejo.",
  reduccion: "reduction combina copias con un operador sobre un acumulador escalar, uno por " +
    "cláusula. Tres campos que deben cambiar juntos no son un acumulador y no hay nada que " +
    "combinar al final.",
  ambos: "critical deja correcto el contador, pero cobra de más: serializa el bloque completo " +
    "por un incremento que atomic deja en el hardware."
};

var PREFERENCIA = "Preferencia: atomic para las operaciones simples (++, += y parecidas) y " +
  "critical para los bloques complejos.";

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    APORTE: APORTE, INTERCALADOS: INTERCALADOS, MECANISMOS: MECANISMOS,
    RAZONES_ACUMULAR: RAZONES_ACUMULAR, RAZONES_CASOS: RAZONES_CASOS,
    PREFERENCIA: PREFERENCIA, correcto: correcto, micro: micro, simular: simular,
    textoCelda: textoCelda, describirPaso: describirPaso, describirCierre: describirCierre,
    estado: estado, explicarPrediccion: explicarPrediccion
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var preset = "clase";
  var res = simular(INTERCALADOS[preset]);
  var k = 0;                   // micro-pasos ejecutados
  var destapado = false;       // la tabla de mecanismos espera la respuesta
  var NOMBRE = {
    clase: "los dos leen primero",
    ordenado: "un hilo y luego el otro",
    tardio: "lectura tardía"
  };

  function pintarPresets() {
    document.querySelectorAll("[data-preset]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.preset === preset);
    });
  }

  function pintarTraza() {
    document.getElementById("cuerpo-traza").innerHTML = res.traza.map(function (f, i) {
      var hecho = i < k;
      var pend = "<td class=\"pend\">?</td>";
      if (!hecho) {
        return "<tr><td>" + f.instante + "</td>" + pend + pend + pend + "</tr>";
      }
      return "<tr" + (i === k - 1 ? " class=\"actual\"" : "") + "><td>" + f.instante +
        "</td><td style=\"text-align:left\">" + textoCelda(f, 0) +
        "</td><td style=\"text-align:left\">" + textoCelda(f, 1) +
        "</td><td><b>" + num(f.c) + "</b></td></tr>";
    }).join("");
  }

  function pintarPaso() {
    var total = res.traza.length;
    var listo = k >= total;
    var e = estado(res, k);
    document.getElementById("progreso").textContent = k === 0
      ? "Orden: " + NOMBRE[preset] + ". " + total + " micro-pasos por recorrer."
      : "Micro-paso " + k + " de " + total + " · orden " + NOMBRE[preset] +
        (listo ? " · terminó" : "");
    document.getElementById("btn-siguiente").disabled = listo;
    var texto = k > 0 ? describirPaso(res, k - 1) : "";
    if (listo) { texto += " " + describirCierre(res); }
    document.getElementById("paso-texto").textContent = texto;
    Motor.pintarChips("chips-traza", [
      { texto: "valor de c", valor: num(e.c) },
      { texto: "los dos aportes suman", valor: num(correcto()) },
      { texto: "escrituras tapadas", valor: num(e.perdidas), cuenta: e.perdidas > 0 }
    ]);
    pintarTraza();
  }

  function cambiarPreset(clave) {
    preset = clave;
    res = simular(INTERCALADOS[preset]);
    k = 0;
    pintarPresets();
    pintarPaso();
  }

  function pintarMecanismos() {
    var pend = "<td class=\"pend\">?</td>";
    document.getElementById("cuerpo-mecanismos").innerHTML = MECANISMOS.map(function (m) {
      var celdas = destapado
        ? "<td style=\"text-align:left\">" + m.protege + "</td><td style=\"text-align:left\">" +
          m.costo + "</td>"
        : pend + pend;
      return "<tr><td><code>" + m.nombre + "</code></td>" + celdas + "</tr>";
    }).join("");
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

  Motor.conectarPrediccion(
    { entrada: "prediccion-c", boton: "btn-comprobar-c", veredicto: "veredicto-c" },
    function () { return simular(INTERCALADOS.clase).resultado; },
    explicarPrediccion);
  Motor.conectarOpciones("opciones-acumular", "veredicto-acumular", RAZONES_ACUMULAR);
  Motor.conectarOpciones("opciones-casos", "veredicto-casos", RAZONES_CASOS);

  document.querySelectorAll("#opciones-acumular button").forEach(function (b) {
    b.addEventListener("click", function () { destapado = true; pintarMecanismos(); });
  });
  document.querySelectorAll("#opciones-casos button").forEach(function (b) {
    b.addEventListener("click", function () {
      var caja = document.getElementById("alerta-preferencia");
      caja.textContent = PREFERENCIA;
      caja.hidden = false;
    });
  });

  pintarPresets();
  pintarPaso();
  pintarMecanismos();
})();
