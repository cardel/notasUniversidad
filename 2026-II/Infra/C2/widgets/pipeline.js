if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Tres etapas encadenadas por colas sin tope, como en pipeline.cpp: Leer 10,
   Calcular 20 y Escribir 10 ms por lote, cada etapa en su propio hilo. Un
   lote entra a una etapa cuando salio de la anterior y hay un hilo libre.  */

var ETAPAS = [
  { nombre: "Leer", dura: 10, replicas: 1, color: "var(--azul)" },
  { nombre: "Calcular", dura: 20, replicas: 1, color: "var(--ambar)" },
  { nombre: "Escribir", dura: 10, replicas: 1, color: "var(--verde)" }
];
var LOTES = 24;
var MEDIDO = { secuencial: 964, pipeline: 501 };

function copiarEtapas(etapas) {
  return etapas.map(function (e) {
    return { nombre: e.nombre, dura: e.dura, replicas: e.replicas, color: e.color };
  });
}

/* Suma de las tres duraciones: lo que tarda el primer lote en salir. */
function llenado(etapas) {
  return etapas.reduce(function (s, e) { return s + e.dura; }, 0);
}

function secuencial(etapas, lotes) {
  return lotes * llenado(etapas);
}

/* Ritmo de una etapa: cada cuantos ms saca un lote con sus replicas. */
function ritmo(e) {
  return e.dura / e.replicas;
}

/* La etapa que manda es la de mayor ritmo; si empatan, van todas. */
function manda(etapas) {
  var peor = 0;
  etapas.forEach(function (e) { peor = Math.max(peor, ritmo(e)); });
  var indices = [];
  etapas.forEach(function (e, i) { if (ritmo(e) === peor) { indices.push(i); } });
  return { indices: indices, ritmo: peor };
}

function simular(etapas, lotes) {
  // libre[e][r]: instante en que el hilo r de la etapa e queda desocupado.
  var libre = etapas.map(function (e) {
    var v = [];
    for (var r = 0; r < e.replicas; r++) { v.push(0); }
    return v;
  });
  var porLote = [];
  var total = 0;

  for (var i = 0; i < lotes; i++) {
    var pasos = [];
    var listo = 0;
    for (var e = 0; e < etapas.length; e++) {
      // El hilo que se desocupa primero; a igualdad, el de menor indice.
      var r = 0;
      for (var k = 1; k < libre[e].length; k++) {
        if (libre[e][k] < libre[e][r]) { r = k; }
      }
      var inicio = Math.max(listo, libre[e][r]);
      var fin = inicio + etapas[e].dura;
      libre[e][r] = fin;
      pasos.push({ inicio: inicio, fin: fin, etapa: e, replica: r });
      listo = fin;
    }
    porLote.push(pasos);
    total = Math.max(total, listo);
  }

  var res = { total: total, porLote: porLote };
  res.ocupacion = function (t0, t1) { return ocupacion(res, t0, t1); };
  return res;
}

/* Por etapa, los lotes (numerados desde 1) que trabajan en [t0, t1). */
function ocupacion(res, t0, t1) {
  var etapas = res.porLote.length ? res.porLote[0].length : 0;
  var salida = [];
  for (var e = 0; e < etapas; e++) {
    var lotes = [];
    res.porLote.forEach(function (pasos, i) {
      var b = pasos[e];
      if (b.inicio < t1 && b.fin > t0) { lotes.push(i + 1); }
    });
    salida.push(lotes);
  }
  return salida;
}

/* Los primeros n intervalos del ancho de la etapa mas corta. */
function intervalos(etapas, lotes, n) {
  var paso = Infinity;
  etapas.forEach(function (e) { paso = Math.min(paso, e.dura); });
  var res = simular(etapas, lotes);
  var filas = [];
  for (var k = 0; k < n; k++) {
    filas.push({ t0: k * paso, t1: (k + 1) * paso,
                 celdas: res.ocupacion(k * paso, (k + 1) * paso) });
  }
  return filas;
}

/* Una fila del Gantt por etapa y por hilo, un bloque por lote. */
function filasGantt(etapas, res) {
  var filas = [];
  etapas.forEach(function (e, ie) {
    for (var r = 0; r < e.replicas; r++) {
      var bloques = [];
      res.porLote.forEach(function (pasos, i) {
        var b = pasos[ie];
        if (b.replica !== r) { return; }
        bloques.push({
          inicio: b.inicio, fin: b.fin,
          color: i % 2 ? "color-mix(in srgb, " + e.color + " 78%, white)" : e.color,
          texto: String(i + 1),
          titulo: "lote " + (i + 1) + ": " + b.inicio + " a " + b.fin + " ms"
        });
      });
      filas.push({
        rotulo: e.replicas > 1 ? e.nombre + ", hilo " + (r + 1) : e.nombre,
        bloques: bloques
      });
    }
  });
  return filas;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ETAPAS: ETAPAS, LOTES: LOTES, MEDIDO: MEDIDO,
    copiarEtapas: copiarEtapas, llenado: llenado, secuencial: secuencial,
    ritmo: ritmo, manda: manda, simular: simular, ocupacion: ocupacion,
    intervalos: intervalos, filasGantt: filasGantt
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;

  function leerEtapas() {
    var etapas = copiarEtapas(ETAPAS);
    etapas.forEach(function (e, i) {
      var d = parseInt(document.getElementById("dura-" + i).value, 10);
      e.dura = isNaN(d) || d < 1 ? 1 : d;
      e.replicas = parseInt(document.getElementById("rep-" + i).value, 10);
    });
    return etapas;
  }

  function leerLotes() {
    var n = parseInt(document.getElementById("lotes").value, 10);
    return isNaN(n) || n < 1 ? 1 : n;
  }

  function esDefecto(etapas, lotes) {
    return lotes === LOTES && etapas.every(function (e, i) {
      return e.dura === ETAPAS[i].dura && e.replicas === ETAPAS[i].replicas;
    });
  }

  function nombreManda(etapas) {
    var m = manda(etapas);
    if (m.indices.length === etapas.length) {
      return "ninguna: las tres a " + num(m.ritmo, 1) + " ms por lote";
    }
    return m.indices.map(function (i) { return etapas[i].nombre; }).join(" y ") +
      " (" + num(m.ritmo, 1) + " ms por lote)";
  }

  function pintarTabla(etapas, lotes) {
    var filas = intervalos(etapas, lotes, 6).map(function (f) {
      var celdas = f.celdas.map(function (l) {
        if (!l.length) { return "<td class=\"pend\">–</td>"; }
        return "<td>" + (l.length > 1 ? "lotes " : "lote ") +
          l.join(l.length === 2 ? " y " : ", ") + "</td>";
      }).join("");
      return "<tr><td>" + num(f.t0) + "–" + num(f.t1) + " ms</td>" + celdas + "</tr>";
    }).join("");
    document.getElementById("cuerpo-ocupacion").innerHTML = filas;
  }

  function pintar() {
    var etapas = leerEtapas();
    var lotes = leerLotes();
    var res = simular(etapas, lotes);
    var sec = secuencial(etapas, lotes);

    document.querySelectorAll(".ver-lotes").forEach(function (s) {
      s.textContent = num(lotes);
    });
    pintarTabla(etapas, lotes);
    Motor.pintarGantt("panel-gantt", filasGantt(etapas, res), res.total || 1);
    Motor.pintarChips("panel-chips", [
      { texto: "terminan en", valor: num(res.total) + " ms" },
      { texto: "en secuencia", valor: num(sec) + " ms" },
      { texto: "aceleración", valor: num(sec / res.total, 2) + "×" },
      { texto: "manda", valor: nombreManda(etapas), cuenta: true }
    ]);
    document.getElementById("veredicto").className = "veredicto";
  }

  function explicar(bien, real) {
    var etapas = leerEtapas();
    var lotes = leerLotes();
    var ll = llenado(etapas);
    var m = manda(etapas);
    var formula = ll + (lotes - 1) * m.ritmo;
    var quien = m.indices.length === etapas.length
      ? "el ritmo de las tres etapas, que empatan"
      : "el ritmo de " + m.indices.map(function (i) { return etapas[i].nombre; })
          .join(" y ") + ", la etapa lenta";
    var t = (bien ? "Sí, " : "No: son ") + num(real) + " ms. Primero " +
      num(ll) + " ms de llenado (" +
      etapas.map(function (e) { return num(e.dura); }).join(" + ") +
      " del primer lote) y después un lote cada " + num(m.ritmo, 1) + " ms, " +
      quien + ": " + num(ll) + " + " + num(lotes - 1) + " × " + num(m.ritmo, 1) +
      (formula === real ? " = " : " ≈ ") + num(real) + ".";
    if (esDefecto(etapas, lotes)) {
      t += " En la máquina del deck midió " + num(MEDIDO.pipeline) +
        " ms; en secuencia, " + num(secuencial(etapas, lotes)) +
        " (midió " + num(MEDIDO.secuencial) + ").";
    } else {
      t += " En secuencia serían " + num(secuencial(etapas, lotes)) + " ms.";
    }
    return t;
  }

  var RAZONES = {
    correcta: "Eso es. Con dos hilos, Calcular saca un lote cada 10 ms, lo " +
      "mismo que Leer y Escribir. Las tres empatan y acelerar una sola ya no " +
      "baja el total: 40 + 23 × 10 = 270.",
    calcular: "Cada paso por Calcular sigue durando 20 ms, pero con dos hilos " +
      "salen dos lotes en ese tiempo: uno cada 10 ms, igual que Leer y " +
      "Escribir. Lo que manda es el ritmo de salida, no lo que dura un paso.",
    leer: "El orden no manda; manda el tiempo por lote. Leer saca uno cada " +
      "10 ms y, con Calcular replicado, las otras dos también: ninguna se " +
      "queda atrás de la primera.",
    escribir: "Los huecos de Escribir eran espera a Calcular, que le " +
      "entregaba un lote cada 20 ms. Con Calcular replicado le llega uno " +
      "cada 10 ms y los huecos desaparecen; se ve en el Gantt."
  };

  document.querySelectorAll(".etapa input, .etapa select, #lotes")
    .forEach(function (el) { el.addEventListener("input", pintar); });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    ETAPAS.forEach(function (e, i) {
      document.getElementById("dura-" + i).value = e.dura;
      document.getElementById("rep-" + i).value = e.replicas;
    });
    document.getElementById("lotes").value = LOTES;
    pintar();
  });
  Motor.conectarPrediccion(
    { entrada: "prediccion", boton: "btn-comprobar", veredicto: "veredicto" },
    function () { return simular(leerEtapas(), leerLotes()).total; },
    explicar);
  Motor.conectarOpciones("opciones-manda", "veredicto-manda", RAZONES);

  pintar();
})();
