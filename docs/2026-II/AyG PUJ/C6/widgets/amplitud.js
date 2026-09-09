/* Ejercicio interactivo: el vertice mas lejano, por amplitud (clase 6). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "from collections import deque", num: null },
    { txt: "",                              num: null },
    { txt: "def mas_lejano(G, s):",         num: null },
    { txt: "    d = [-1] * len(G)",         num: 1 },
    { txt: "    d[s] = 0",                  num: 2 },
    { txt: "    cola = deque()",            num: 3 },
    { txt: "    cola.append(s)",            num: 4 },
    { txt: "    lejano = s",                num: 5 },
    { txt: "    while len(cola) > 0:",      num: 6,  bloque: 1 },
    { txt: "        u = cola.popleft()",    num: 7,  bloque: 1 },
    { txt: "        if d[u] > d[lejano]:",  num: 8,  bloque: 1 },
    { txt: "            lejano = u",        num: 9,  bloque: 1 },
    { txt: "        for v in G[u]:",        num: 10, bloque: 1 },
    { txt: "            if d[v] == -1:",    num: 11, bloque: 1 },
    { txt: "                d[v] = d[u] + 1", num: 12, bloque: 1 },
    { txt: "                cola.append(v)", num: 13, bloque: 1 },
    { txt: "    return (lejano, d[lejano])", num: 14 }
  ];

  function simular(params) {
    var G = params.G;
    var s = params.s;
    var pasos = [];
    var d = null, cola = null, lejano = null, u = null;
    function snap(linea, extra) {
      var q = {
        linea: linea,
        u: u === null ? "–" : u,
        lejano: lejano === null ? "–" : lejano,
        d: d === null ? null : d.slice(),
        cola: cola === null ? [] : cola.slice()
      };
      if (extra) { for (var c in extra) { q[c] = extra[c]; } }
      pasos.push(q);
    }
    d = [];
    var t = 0;
    while (t < G.length) { d.push(-1); t = t + 1; }
    snap(1);
    d[s] = 0; snap(2);
    cola = []; snap(3);
    cola.push(s); snap(4);
    lejano = s; snap(5);
    var corriendo = true;
    while (corriendo) {
      snap(6, { chequeo: true });
      if (cola.length > 0) {
        u = cola.shift(); snap(7, { sale: u });
        snap(8);
        if (d[u] > d[lejano]) {
          lejano = u; snap(9);
        }
        var nuevos = [];
        var i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          snap(10);
          snap(11, { mirando: v });
          if (d[v] === -1) {
            d[v] = d[u] + 1; snap(12);
            cola.push(v); snap(13);
            nuevos.push(v);
          }
          i = i + 1;
        }
        pasos[pasos.length - 1].nuevosDe = u;
        pasos[pasos.length - 1].nuevos = nuevos.slice();
      } else {
        corriendo = false;
      }
    }
    u = null;
    snap(14);
    return pasos;
  }

  function distanciasRef(G, s) {
    var d = [];
    var t = 0;
    while (t < G.length) { d.push(-1); t = t + 1; }
    d[s] = 0;
    var cola = [s];
    var k = 0;
    while (k < cola.length) {
      var u = cola[k];
      k = k + 1;
      var i = 0;
      while (i < G[u].length) {
        if (d[G[u][i]] === -1) { d[G[u][i]] = d[u] + 1; cola.push(G[u][i]); }
        i = i + 1;
      }
    }
    return d;
  }

  function excentricidad(G, s) {
    var d = distanciasRef(G, s);
    var m = 0;
    var t = 0;
    while (t < d.length) { if (d[t] > m) { m = d[t]; } t = t + 1; }
    return m;
  }

  return { codigo: CODIGO, simular: simular, distanciasRef: distanciasRef,
           excentricidad: excentricidad };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var H1 = [[2, 3], [2, 5], [0, 1, 3, 4], [0, 2], [2, 5], [1, 4]];
    var H2 = [[2, 3], [0], [4], [2, 5], [1], [4]];
    var PRESETS = [
      { G: H1, s: 0, dirigido: false },
      { G: H1, s: 2, dirigido: false },
      { G: H2, s: 0, dirigido: true }
    ];
    var capaOK = false;
    var COLORES = ["#2e7d32", "#1f5fa8", "#e8a13d", "#b3261e", "#6d28d9"];
    var POS = [[0, 1.6], [3.2, 1.6], [1.6, 0.8], [0, -0.6], [3.2, -0.6], [1.6, -1.6]];

    function dibujar(params, d, actual) {
      var G = params.G;
      var caja = document.getElementById("panel-grafo");
      var ancho = 380, alto = 230, mx = 60, my = 60;
      function X(i) { return mx + (POS[i][0] / 3.4) * (ancho - 2 * mx) + 40; }
      function Y(i) { return my + ((1.6 - POS[i][1]) / 3.2) * (alto - 2 * my) + 20; }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:420px'>";
      if (params.dirigido) {
        svg += "<defs><marker id='q' markerWidth='9' markerHeight='9' refX='9' refY='3' orient='auto'>" +
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
                     "' stroke='#6b7280' stroke-width='1.6' marker-end='url(#q)'/>";
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
        var visto = d !== null && d[u] >= 0;
        var color = visto ? COLORES[d[u] % COLORES.length] : "#ffffff";
        var esActual = actual !== null && actual === u;
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='15' fill='" +
               (visto ? color : "#ffffff") + "' stroke='" + (esActual ? "#24292f" : (visto ? color : "#d8dee6")) +
               "' stroke-width='" + (esActual ? 4 : 2) + "'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' " +
               "font-weight='700' fill='" + (visto ? "#ffffff" : "#24292f") + "'>" + u + "</text>";
        if (visto) {
          svg += "<text x='" + (X(u) + 19) + "' y='" + (Y(u) - 12) + "' font-size='11' " +
                 "fill='#24292f' font-weight='700'>d=" + d[u] + "</text>";
        }
        u = u + 1;
      }
      svg += "</svg>";
      caja.innerHTML = svg;
    }

    function alPintar(e) {
      var actual = e.actual;
      dibujar(e.params, actual ? actual.d : null,
              actual && actual.u !== "–" ? actual.u : null);
      document.getElementById("ver-cola").textContent =
        actual && actual.cola.length > 0 ? actual.cola.join(", ") : "vacía";

      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var fila = 0;
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var q = e.pasos[m];
        if (q.nuevosDe !== undefined) {
          fila = fila + 1;
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + fila + "</td><td>" + q.nuevosDe + "</td><td>" +
            (q.nuevos.length > 0 ? q.nuevos.join(", ") : "—") + "</td><td>" +
            (q.cola.length > 0 ? q.cola.join(", ") : "vacía") + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (fila === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='4' class='pend'>Ejecute: cada vértice que sale de la cola agrega una fila.</td>";
        cuerpo.appendChild(trv);
      }

      var caja = document.getElementById("aviso-capas");
      if (capaOK) {
        var d = actual ? actual.d : null;
        if (d !== null) {
          var capas = {};
          var t = 0;
          while (t < d.length) {
            if (d[t] >= 0) {
              if (!capas[d[t]]) { capas[d[t]] = []; }
              capas[d[t]].push(t);
            }
            t = t + 1;
          }
          var txt = "";
          var k = 0;
          while (capas[k]) {
            txt = txt + "<b>capa " + k + ":</b> " + capas[k].join(", ") + " &nbsp; ";
            k = k + 1;
          }
          caja.innerHTML = txt;
        }
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "u", rotulo: "u" },
        { campo: "lejano", rotulo: "lejano", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var e = EJERCICIO.excentricidad(params.G, params.s);
      var n = params.G.length;
      if (valor === e) {
        return { ok: true, msg: "Correcto: el más lejano está a " + e +
          " aristas. Ejecute y vea cómo la cola nunca mezcla más de dos capas." };
      }
      if (valor === n - 1) {
        return { ok: false, msg: "Ese sería el caso si el grafo fuera una fila " +
          "de vértices uno tras otro. Mire el dibujo: hay atajos." };
      }
      return { ok: false, msg: "No coincide. Marque en el dibujo los vecinos " +
        "del arranque, luego los vecinos de esos, y cuente cuántas rondas " +
        "hacen falta para no dejar a nadie." };
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

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-capa button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          capaOK = true;
          veredicto("veredicto-capa", true, "Ese es el punto: mientras el frente " +
            "de la cola está en la capa k, todo lo que queda está en la capa k o " +
            "en la k+1. Por eso las capas salen en orden y la primera vez que " +
            "alguien toca a un vértice es por el camino más corto.");
          Motor.repintar();
          document.getElementById("paso-1").classList.remove("bloqueado");
        } else if (op === "todas") {
          veredicto("veredicto-capa", false, "No caben todas: un vértice entra a " +
            "la cola solo cuando su vecino sale, así que la cola nunca se " +
            "adelanta más de una capa. Ejecute y mire la columna de la cola.");
        } else if (op === "una") {
          veredicto("veredicto-capa", false, "Sí se mezclan dos. Ejecute H1 desde " +
            "el 0 hasta el segundo vértice que sale: la cola tiene al 3, que está " +
            "en la capa 1, y al 1, que está en la 2.");
        } else {
          veredicto("veredicto-capa", false, "El orden de la cola no depende del " +
            "número del vértice sino de cuándo entró. Ejecute H2 y verá salir al " +
            "2 antes que al 1.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p1");
        if (op === "encolar") {
          veredicto("veredicto-p1", true, "Correcto: la línea 12 asigna la " +
            "distancia en el momento de encolar, que es la primera vez que " +
            "alguien toca a ese vértice.");
          document.getElementById("paso-1").classList.add("hecho");
        } else if (op === "salir") {
          veredicto("veredicto-p1", false, "Si se asignara al salir, un vértice " +
            "con dos vecinos en la misma capa entraría dos veces a la cola y se " +
            "visitaría dos veces. Pruebe a seguir H1 con esa regla.");
        } else {
          veredicto("veredicto-p1", false, "La línea 8 solo actualiza cuál es el " +
            "más lejano; no toca las distancias.");
        }
      });
    });
  })();
}
