/* Ejercicio interactivo: por que hace falta la marca de visitados (clase 6). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def recorrer(G, s, marcar, limite):", num: null },
    { txt: "    visitado = [False] * len(G)",     num: 1 },
    { txt: "    orden = []",                     num: 2 },
    { txt: "    pila = [s]",                     num: 3 },
    { txt: "    vueltas = 0",                    num: 4 },
    { txt: "    while len(pila) > 0 and vueltas < limite:", num: 5, bloque: 1 },
    { txt: "        u = pila.pop()",             num: 6, bloque: 1 },
    { txt: "        vueltas = vueltas + 1",      num: 7, bloque: 1 },
    { txt: "        if not marcar or not visitado[u]:", num: 8, bloque: 1 },
    { txt: "            visitado[u] = True",     num: 9, bloque: 1 },
    { txt: "            orden.append(u)",        num: 10, bloque: 1 },
    { txt: "            for v in G[u]:",         num: 11, bloque: 1 },
    { txt: "                if not marcar or not visitado[v]:", num: 12, bloque: 1 },
    { txt: "                    pila.append(v)", num: 13, bloque: 1 },
    { txt: "    return orden",                   num: 14 }
  ];

  function simular(params) {
    var G = params.G;
    var s = params.s;
    var marcar = params.marcar;
    var limite = params.limite;
    var pasos = [];
    var visitado = null, orden = null, pila = null, vueltas = null, u = null;
    function snap(linea, extra) {
      var q = {
        linea: linea,
        u: u === null ? "–" : u,
        vueltas: vueltas === null ? "–" : vueltas,
        distintos: orden === null ? "–" : contarDistintos(orden),
        pila: pila === null ? [] : pila.slice(),
        orden: orden === null ? [] : orden.slice(),
        visitado: visitado === null ? null : visitado.slice()
      };
      if (extra) { for (var c in extra) { q[c] = extra[c]; } }
      pasos.push(q);
    }
    visitado = [];
    var t = 0;
    while (t < G.length) { visitado.push(false); t = t + 1; }
    snap(1);
    orden = []; snap(2);
    pila = [s]; snap(3);
    vueltas = 0; snap(4);
    var corriendo = true;
    while (corriendo) {
      snap(5, { chequeo: true });
      if (pila.length > 0 && vueltas < limite) {
        u = pila.pop(); snap(6);
        vueltas = vueltas + 1; snap(7);
        snap(8);
        if (!marcar || !visitado[u]) {
          visitado[u] = true; snap(9);
          orden.push(u); snap(10, { anota: u });
          var i = 0;
          while (i < G[u].length) {
            var v = G[u][i];
            snap(11);
            snap(12, { mira: v });
            if (!marcar || !visitado[v]) {
              pila.push(v); snap(13, { apila: v });
            }
            i = i + 1;
          }
        }
      } else {
        corriendo = false;
      }
    }
    u = null;
    snap(14, { fin: true, agotada: pila.length === 0 });
    return pasos;
  }

  function contarDistintos(orden) {
    var vistos = [];
    var t = 0;
    while (t < orden.length) {
      if (vistos.indexOf(orden[t]) < 0) { vistos.push(orden[t]); }
      t = t + 1;
    }
    return vistos.length;
  }

  function alcanzables(G, s) {
    var visto = [];
    var t = 0;
    while (t < G.length) { visto.push(false); t = t + 1; }
    var pila = [s];
    var n = 0;
    while (pila.length > 0) {
      var u = pila.pop();
      if (!visto[u]) {
        visto[u] = true;
        n = n + 1;
        var i = 0;
        while (i < G[u].length) { pila.push(G[u][i]); i = i + 1; }
      }
    }
    return n;
  }

  return { codigo: CODIGO, simular: simular, contarDistintos: contarDistintos,
           alcanzables: alcanzables };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var H1 = [[2, 3], [2, 5], [0, 1, 3, 4], [0, 2], [2, 5], [1, 4]];
    var H3 = [[2, 3], [0], [4], [2, 5], [1], [4], [0]];
    var PRESETS = [
      { G: H1, s: 0, marcar: false, limite: 40, dirigido: false },
      { G: H1, s: 0, marcar: true, limite: 40, dirigido: false },
      { G: H3, s: 0, marcar: true, limite: 40, dirigido: true }
    ];
    var POS = [[0, 1.6], [3.2, 1.6], [1.6, 0.8], [0, -0.6], [3.2, -0.6], [1.6, -1.6], [4.6, 0.5]];

    function dibujar(params, visitado, actual) {
      var G = params.G;
      var caja = document.getElementById("panel-grafo");
      var ancho = 420, alto = 230, mx = 60, my = 60;
      function X(i) { return mx + (POS[i][0] / 4.6) * (ancho - 2 * mx) + 20; }
      function Y(i) { return my + ((1.6 - POS[i][1]) / 3.2) * (alto - 2 * my) + 20; }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:440px'>";
      if (params.dirigido) {
        svg += "<defs><marker id='m' markerWidth='9' markerHeight='9' refX='9' refY='3' orient='auto'>" +
               "<path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker></defs>";
      }
      var u = 0;
      while (u < G.length) {
        var i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          if (params.dirigido || u < v) {
            var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
            if (params.dirigido) {
              var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy);
              x1 = x1 + (dx / L) * 16; y1 = y1 + (dy / L) * 16;
              x2 = x2 - (dx / L) * 16; y2 = y2 - (dy / L) * 16;
              svg += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 +
                     "' stroke='#6b7280' stroke-width='1.6' marker-end='url(#m)'/>";
            } else {
              svg += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 +
                     "' stroke='#6b7280' stroke-width='1.6'/>";
            }
          }
          i = i + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < G.length) {
        var vis = visitado !== null && visitado[u];
        var esActual = actual !== null && actual === u;
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='15' fill='" +
               (esActual ? "#1f5fa8" : (vis ? "#e3edf8" : "#ffffff")) + "' stroke='" +
               (vis ? "#1f5fa8" : "#d8dee6") + "' stroke-width='2'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' " +
               "font-weight='700' fill='" + (esActual ? "#ffffff" : "#24292f") + "'>" + u + "</text>";
        u = u + 1;
      }
      svg += "</svg>";
      caja.innerHTML = svg;
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(e.params, a ? a.visitado : null, a && a.u !== "–" ? a.u : null);
      document.getElementById("ver-pila").textContent =
        a && a.pila.length > 0 ? a.pila.join(", ") : "vacía";
      document.getElementById("ver-orden").textContent =
        a && a.orden.length > 0 ? a.orden.join(", ") : "–";

      var aviso = document.getElementById("aviso-final");
      if (a && a.fin) {
        var alcanza = EJERCICIO.alcanzables(e.params.G, e.params.s);
        if (!e.params.marcar) {
          aviso.className = "alerta";
          aviso.innerHTML = "La pila <b>no</b> se vació: el recorrido se detuvo " +
            "porque llegó al límite de " + e.params.limite + " vueltas. Anotó " +
            a.orden.length + " visitas para " + a.distintos + " vértices " +
            "distintos. Sin la marca no termina.";
        } else {
          aviso.className = "alerta";
          aviso.style.background = "var(--verde-suave)";
          aviso.style.borderColor = "var(--verde)";
          aviso.innerHTML = "La pila se vació en " + a.vueltas + " vueltas y el " +
            "recorrido anotó " + a.distintos + " vértices, que son los " +
            alcanza + " alcanzables desde el " + e.params.s +
            (e.params.G.length > alcanza
              ? ". Los otros " + (e.params.G.length - alcanza) +
                " necesitan el ciclo externo."
              : ", es decir, todos.");
        }
      } else {
        aviso.className = "";
        aviso.innerHTML = "";
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "u", rotulo: "u" },
        { campo: "vueltas", rotulo: "vueltas", clase: "cuenta" },
        { campo: "distintos", rotulo: "distintos", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var pasos = EJERCICIO.simular(params);
      var fin = pasos[pasos.length - 1];
      var real = fin.vueltas;
      var alcanza = EJERCICIO.alcanzables(params.G, params.s);
      if (valor === real) {
        return { ok: true, msg: params.marcar
          ? "Correcto: " + real + " vueltas. Con la marca, cada vértice sale de " +
            "la pila a lo sumo unas pocas veces y el recorrido termina."
          : "Correcto: se detiene en " + real + " porque llegó al límite, no " +
            "porque haya terminado. Mire la pila: sigue llena." };
      }
      if (valor === alcanza) {
        return { ok: false, msg: params.marcar
          ? "Esos son los vértices distintos que visita (" + alcanza + "), pero " +
            "la pila entrega algunos más de una vez: la línea 8 los descarta."
          : "Esos son los vértices distintos del grafo. Sin marca, el mismo " +
            "vértice vuelve a la pila una y otra vez." };
      }
      return { ok: false, msg: "No coincide. Ejecute con Auto y mire el contador " +
        "de vueltas." };
    });

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) {
          b.classList.remove("primario");
        });
        btn.classList.add("primario");
        Motor.limpiarVeredicto();
        Motor.reiniciar(PRESETS[parseInt(btn.getAttribute("data-preset"), 10)]);
      });
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id);
      v.className = ok ? "veredicto bien" : "veredicto mal";
      v.innerHTML = texto;
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-porque button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          veredicto("veredicto-porque", true, "Ese es el argumento: cada vértice " +
            "se marca una sola vez y solo un vértice recién marcado apila a sus " +
            "vecinos. Como hay V vértices, el cuerpo se ejecuta un número acotado " +
            "de veces.");
          document.getElementById("paso-1").classList.remove("bloqueado");
        } else if (op === "ciclos") {
          veredicto("veredicto-porque", false, "Un grafo sin ciclos tampoco se " +
            "salva: en H1 sin marca, el 0 apila al 2 y el 2 vuelve a apilar al 0 " +
            "por la misma arista. En un grafo no dirigido eso basta para no " +
            "terminar.");
        } else {
          veredicto("veredicto-porque", false, "El límite es un andamio de este " +
            "ejercicio para poder mostrar el problema; el algoritmo de verdad no " +
            "lo tiene. Lo que lo hace terminar es la marca.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p1");
        if (op === "externo") {
          veredicto("veredicto-p1", true, "Correcto: un recorrido desde un solo " +
            "vértice visita lo alcanzable desde él, que puede no ser todo el " +
            "grafo. El ciclo externo vuelve a arrancar en cada vértice sin marcar.");
          document.getElementById("paso-1").classList.add("hecho");
        } else if (op === "otro") {
          veredicto("veredicto-p1", false, "Cambiar de arranque no siempre " +
            "alcanza. En H3 no hay ningún vértice desde el cual se llegue a " +
            "todos: pruebe desde el 6 y verá que sí, pero desde el 0 no.");
        } else {
          veredicto("veredicto-p1", false, "El grafo está bien: que no se llegue " +
            "a todos desde un vértice es lo normal, no un error del dato.");
        }
      });
    });
  })();
}
