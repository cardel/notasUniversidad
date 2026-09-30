/* Ejercicio interactivo: profundidades en el arbol de la busqueda en
   profundidad (clase 6). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def profundidades(G, s):",       num: null },
    { txt: "    p = [-1] * len(G)",          num: 1 },
    { txt: "    visitar(G, s, 0, p)",        num: 2 },
    { txt: "    return p",                   num: 3 },
    { txt: "",                               num: null },
    { txt: "def visitar(G, u, nivel, p):",   num: null },
    { txt: "    p[u] = nivel",               num: 4, bloque: 1 },
    { txt: "    for v in G[u]:",             num: 5, bloque: 1 },
    { txt: "        if p[v] == -1:",         num: 6, bloque: 1 },
    { txt: "            visitar(G, v, nivel + 1, p)", num: 7, bloque: 1 }
  ];

  function simular(params) {
    var G = params.G;
    var s = params.s;
    var pasos = [];
    var p = null;
    var pila = [];
    function snap(linea, u, nivel, extra) {
      var q = {
        linea: linea,
        u: u === undefined ? "–" : u,
        nivel: nivel === undefined ? "–" : nivel,
        p: p === null ? null : p.slice(),
        pila: pila.slice()
      };
      if (extra) { for (var c in extra) { q[c] = extra[c]; } }
      pasos.push(q);
    }
    p = [];
    var t = 0;
    while (t < G.length) { p.push(-1); t = t + 1; }
    snap(1);
    snap(2, s, 0);

    function visitar(u, nivel) {
      pila.push(u);
      p[u] = nivel;
      snap(4, u, nivel, { entra: u, nivelEntra: nivel });
      var i = 0;
      while (i < G[u].length) {
        var v = G[u][i];
        snap(5, u, nivel);
        snap(6, u, nivel, { mirando: v });
        if (p[v] === -1) {
          snap(7, u, nivel, { baja: v });
          visitar(v, nivel + 1);
          snap(5, u, nivel, { vuelveA: u });
        }
        i = i + 1;
      }
      pila.pop();
    }
    visitar(s, 0);
    snap(3);
    return pasos;
  }

  /* profundidad en el arbol de la busqueda, por referencia */
  function profundidadesRef(G, s) {
    var p = [];
    var t = 0;
    while (t < G.length) { p.push(-1); t = t + 1; }
    function ir(u, nivel) {
      p[u] = nivel;
      var i = 0;
      while (i < G[u].length) {
        if (p[G[u][i]] === -1) { ir(G[u][i], nivel + 1); }
        i = i + 1;
      }
    }
    ir(s, 0);
    return p;
  }

  /* distancia en aristas, por amplitud */
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
        if (d[G[u][i]] === -1) {
          d[G[u][i]] = d[u] + 1;
          cola.push(G[u][i]);
        }
        i = i + 1;
      }
    }
    return d;
  }

  return {
    codigo: CODIGO, simular: simular,
    profundidadesRef: profundidadesRef, distanciasRef: distanciasRef
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var H1 = [[2, 3], [2, 5], [0, 1, 3, 4], [0, 2], [2, 5], [1, 4]];
    var H2 = [[2, 3], [0], [4], [2, 5], [1], [4]];
    var PRESETS = [
      { G: H1, s: 0, dirigido: false, nombre: "H1 desde 0" },
      { G: H1, s: 2, dirigido: false, nombre: "H1 desde 2" },
      { G: H2, s: 0, dirigido: true, nombre: "H2 desde 0" }
    ];
    var ordenOK = false;

    var POS1 = [[0, 1.6], [3.2, 1.6], [1.6, 0.8], [0, -0.6], [3.2, -0.6], [1.6, -1.6]];
    var POS2 = [[0, 1.4], [3.4, 1.4], [1.7, 1.4], [0, -0.6], [3.4, -0.6], [1.7, -1.6]];

    function dibujar(params, p, actual) {
      var G = params.G;
      var pos = params.dirigido ? POS2 : POS1;
      var caja = document.getElementById("panel-grafo");
      var ancho = 380, alto = 230;
      var mx = 60, my = 60;
      function X(i) { return mx + (pos[i][0] / 3.4) * (ancho - 2 * mx) + 40; }
      function Y(i) { return my + ((1.6 - pos[i][1]) / 3.2) * (alto - 2 * my) + 20; }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:420px'>";
      if (params.dirigido) {
        svg += "<defs><marker id='p' markerWidth='9' markerHeight='9' refX='9' refY='3' orient='auto'>" +
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
              var dx = x2 - x1, dy = y2 - y1;
              var L = Math.sqrt(dx * dx + dy * dy);
              x2 = x2 - (dx / L) * 16; y2 = y2 - (dy / L) * 16;
              x1 = x1 + (dx / L) * 16; y1 = y1 + (dy / L) * 16;
              svg += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 +
                     "' stroke='#6b7280' stroke-width='1.6' marker-end='url(#p)'/>";
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
        var vis = p !== null && p[u] >= 0;
        var esActual = actual !== null && actual === u;
        var relleno = esActual ? "#1f5fa8" : (vis ? "#e3edf8" : "#ffffff");
        var texto = esActual ? "#ffffff" : "#24292f";
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='15' fill='" + relleno +
               "' stroke='" + (vis ? "#1f5fa8" : "#d8dee6") + "' stroke-width='2'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' " +
               "font-size='14' font-weight='700' fill='" + texto + "'>" + u + "</text>";
        if (vis) {
          svg += "<text x='" + (X(u) + 19) + "' y='" + (Y(u) - 12) + "' font-size='11' " +
                 "fill='#a86a12' font-weight='700'>" + p[u] + "</text>";
        }
        u = u + 1;
      }
      svg += "</svg>";
      caja.innerHTML = svg;
    }

    function alPintar(e) {
      var actual = e.actual;
      var p = actual ? actual.p : null;
      var enFoco = null;
      if (actual && actual.u !== "–") { enFoco = actual.u; }
      dibujar(e.params, p, enFoco);

      document.getElementById("ver-pila").textContent =
        actual && actual.pila.length > 0 ? actual.pila.join(" → ") : "–";

      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var fila = 0;
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var q = e.pasos[m];
        if (q.entra !== undefined) {
          fila = fila + 1;
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + fila + "</td><td>" + q.entra + "</td><td>" +
            q.nivelEntra + "</td><td>" + q.pila.join(" → ") + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (fila === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='4' class='pend'>Ejecute: cada llamada a visitar agrega una fila.</td>";
        cuerpo.appendChild(trv);
      }

      var comp = document.getElementById("cuerpo-comparacion");
      if (ordenOK && e.terminado) {
        var G = e.params.G, s = e.params.s;
        var pr = EJERCICIO.profundidadesRef(G, s);
        var dr = EJERCICIO.distanciasRef(G, s);
        comp.innerHTML = "";
        var t = 0;
        while (t < G.length) {
          var mal = pr[t] !== dr[t];
          var tr2 = document.createElement("tr");
          tr2.innerHTML = "<td>" + t + "</td><td>" + pr[t] + "</td><td>" + dr[t] +
            "</td><td>" + (mal ? "distintas" : "iguales") + "</td>";
          if (mal) { tr2.style.background = "#fdf1dc"; }
          comp.appendChild(tr2);
          t = t + 1;
        }
      } else {
        comp.innerHTML = "<tr><td colspan='4' class='pend'>Acierte la tarjeta 4 y lleve la ejecución hasta el final.</td></tr>";
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "u", rotulo: "u" },
        { campo: "nivel", rotulo: "nivel", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var p = EJERCICIO.profundidadesRef(params.G, params.s);
      var maximo = 0;
      var t = 0;
      while (t < p.length) {
        if (p[t] > maximo) { maximo = p[t]; }
        t = t + 1;
      }
      var d = EJERCICIO.distanciasRef(params.G, params.s);
      var maxd = 0;
      t = 0;
      while (t < d.length) {
        if (d[t] > maxd) { maxd = d[t]; }
        t = t + 1;
      }
      if (valor === maximo) {
        return { ok: true, msg: "Correcto: la rama más larga llega al nivel " +
          maximo + ". Ejecute y mire el número naranja que queda junto a cada " +
          "vértice." };
      }
      if (valor === maxd) {
        return { ok: false, msg: "Ese es el vértice más lejano contando aristas " +
          "por el camino corto (" + maxd + "). La búsqueda en profundidad no " +
          "va por el camino corto: baja por donde puede." };
      }
      if (valor === params.G.length - 1) {
        return { ok: false, msg: "Ese sería el nivel si la rama pasara por " +
          "todos los vértices en fila. Mire el dibujo: ¿la primera bajada " +
          "alcanza a tocarlos todos?" };
      }
      return { ok: false, msg: "No coincide. Siga la primera bajada con el dedo: " +
        "del arranque al primer vecino, de ahí a su primer vecino nuevo, y así." };
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

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-orden button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          ordenOK = true;
          veredicto("veredicto-orden", true, "Correcto: <code>p[v]</code> cuenta " +
            "las aristas del camino que la búsqueda tomó, no las del más corto. " +
            "La tabla de abajo pone las dos columnas lado a lado.");
          Motor.repintar();
          document.getElementById("paso-1").classList.remove("bloqueado");
        } else if (op === "corto") {
          veredicto("veredicto-orden", false, "No. Lleve la ejecución hasta el " +
            "final en H1 desde el 0: el vértice 4 queda en el nivel 4, y sin " +
            "embargo se llega a él con dos aristas, por el 2.");
        } else if (op === "grado") {
          veredicto("veredicto-orden", false, "El grado no interviene: " +
            "<code>nivel</code> solo crece de uno en uno en la línea 7, cada vez " +
            "que la búsqueda baja.");
        } else {
          veredicto("veredicto-orden", false, "El orden de visita y el nivel son " +
            "cosas distintas. En H1 desde el 0 el vértice 3 se visita de último y " +
            "queda en el nivel 2, no en el 5.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p1");
        if (op === "orden") {
          veredicto("veredicto-p1", true, "Correcto: el nivel depende de por " +
            "cuál vecino bajó primero, y eso lo decide el orden de la lista. " +
            "El conjunto de vértices alcanzados no cambia.");
          document.getElementById("paso-1").classList.add("hecho");
        } else if (op === "nada") {
          veredicto("veredicto-p1", false, "Sí cambia. Con los vecinos del 0 en " +
            "el otro orden, la búsqueda baja primero al 3 y los niveles de todo " +
            "el resto se corren.");
        } else {
          veredicto("veredicto-p1", false, "El conjunto alcanzado no depende del " +
            "orden: es el de los vértices con camino desde el arranque. Lo que " +
            "cambia es por dónde se llega a ellos.");
        }
      });
    });
  })();
}
