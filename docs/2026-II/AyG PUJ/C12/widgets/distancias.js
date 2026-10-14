/* Ejercicio interactivo: distancias con pesos, con ciclos negativos y sin camino (clase 12).
   Las delta salen de Bellman-Ford con deteccion de los vertices a los que llega
   un ciclo negativo alcanzable desde la fuente. */
/* Dibujo de grafos en SVG, con nombres de vertice, pesos y anotaciones. */
var DIB = (function () {
  var COL = {
    gris: "#6b7280", azul: "#1f5fa8", verde: "#2e7d32", rojo: "#b3261e",
    ambar: "#e8a13d", morado: "#6b3fa0", claro: "#c4cad3"
  };
  var RY = 16;

  function rxDe(nombre) {
    var r = 3.2 * String(nombre).length + 8;
    return r < 18 ? 18 : r;
  }

  function signo(w) { return String(w).replace("-", "−"); }

  /* o.pos, o.G, o.nombres, o.dirigido (por defecto true), o.peso(u, v) opcional;
     o.nodo(i) -> {relleno, borde, tinta, grueso, nota, notaColor};
     o.arista(u, v) -> {color, grueso, trazo}. En un grafo no dirigido cada
     arista se pregunta una vez, con u menor que v. */
  function dibujar(o) {
    var pos = o.pos, G = o.G, nom = o.nombres, n = pos.length, dir = o.dirigido !== false;
    var ancho = 560, alto = o.alto || 300, mx = 56, my = 40;
    var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
    while (i < n) {
      if (pos[i][0] < minX) { minX = pos[i][0]; }
      if (pos[i][0] > maxX) { maxX = pos[i][0]; }
      if (pos[i][1] < minY) { minY = pos[i][1]; }
      if (pos[i][1] > maxY) { maxY = pos[i][1]; }
      i = i + 1;
    }
    var rx = maxX - minX === 0 ? 1 : maxX - minX, ry = maxY - minY === 0 ? 1 : maxY - minY;
    function X(k) { return mx + (pos[k][0] - minX) / rx * (ancho - 2 * mx); }
    function Y(k) { return my + (maxY - pos[k][1]) / ry * (alto - 2 * my); }
    function existe(p, q) {
      var j = 0, hay = false;
      while (j < G[p].length) { if (G[p][j] === q) { hay = true; } j = j + 1; }
      return hay;
    }
    function borde(k, ux, uy) {
      var a = rxDe(nom[k]);
      return 1 / Math.sqrt((ux / a) * (ux / a) + (uy / RY) * (uy / RY));
    }
    function etiqueta(x, y, u, v, e) {
      var w = o.peso ? o.peso(u, v) : null;
      if (w === null || w === undefined) { return ""; }
      return "<text x='" + x + "' y='" + (y + 4) + "' text-anchor='middle' font-size='11.5' font-weight='700' fill='" +
             COL[e.color] + "' stroke='#ffffff' stroke-width='4' paint-order='stroke' stroke-linejoin='round'>" + signo(w) + "</text>";
    }

    var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:640px'>";
    svg += "<defs>";
    var c;
    for (c in COL) {
      svg += "<marker id='ah-" + c + "' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto'>" +
             "<path d='M0,0 L10,5 L0,10 z' fill='" + COL[c] + "'/></marker>";
    }
    svg += "</defs>";

    var rotulos = "", u = 0;
    while (u < n) {
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        if (dir || u < v) {
          var e = o.arista(u, v);
          var dash = e.trazo ? " stroke-dasharray='" + e.trazo + "'" : "";
          var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
          var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
          var pie = "' fill='none' stroke='" + COL[e.color] + "' stroke-width='" + e.grueso + "'" + dash +
                    (dir ? " marker-end='url(#ah-" + e.color + ")'/>" : "/>");
          var extra = dir ? 5 : 0;
          if (dir && existe(v, u)) {
            var cx = (x1 + x2) / 2 - dy / dd * 26, cy = (y1 + y2) / 2 + dx / dd * 26;
            var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
            var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
            var a1 = borde(u, (cx - x1) / l1, (cy - y1) / l1) + 2;
            var a2 = borde(v, (cx - x2) / l2, (cy - y2) / l2) + 5;
            var p1x = x1 + (cx - x1) / l1 * a1, p1y = y1 + (cy - y1) / l1 * a1;
            var p2x = x2 + (cx - x2) / l2 * a2, p2y = y2 + (cy - y2) / l2 * a2;
            svg += "<path d='M" + p1x + "," + p1y + " Q" + cx + "," + cy + " " + p2x + "," + p2y + pie;
            rotulos += etiqueta(0.25 * p1x + 0.5 * cx + 0.25 * p2x, 0.25 * p1y + 0.5 * cy + 0.25 * p2y, u, v, e);
          } else {
            var b1 = borde(u, dx / dd, dy / dd) + 2;
            var b2 = borde(v, -dx / dd, -dy / dd) + 2 + extra;
            svg += "<path d='M" + (x1 + dx / dd * b1) + "," + (y1 + dy / dd * b1) +
                   " L" + (x2 - dx / dd * b2) + "," + (y2 - dy / dd * b2) + pie;
            rotulos += etiqueta((x1 + x2) / 2, (y1 + y2) / 2, u, v, e);
          }
        }
        j = j + 1;
      }
      u = u + 1;
    }
    svg += rotulos;
    u = 0;
    while (u < n) {
      var s = o.nodo(u);
      svg += "<ellipse cx='" + X(u) + "' cy='" + Y(u) + "' rx='" + rxDe(nom[u]) + "' ry='" + RY +
             "' fill='" + s.relleno + "' stroke='" + s.borde + "' stroke-width='" + (s.grueso || 2.2) + "'/>";
      svg += "<text x='" + X(u) + "' y='" + (Y(u) + 4) + "' text-anchor='middle' font-size='11.5' font-weight='700' fill='" +
             (s.tinta || "#24292f") + "'>" + nom[u] + "</text>";
      if (s.nota) {
        svg += "<text x='" + X(u) + "' y='" + (Y(u) - RY - 4) + "' text-anchor='middle' font-size='11' font-weight='700' fill='" +
               (s.notaColor || "#1f5fa8") + "'>" + s.nota + "</text>";
      }
      u = u + 1;
    }
    svg += "</svg>";
    return svg;
  }
  return { dibujar: dibujar, COL: COL };
})();

var EJERCICIO = (function () {
  var INF = Infinity;

  var GRAFOS = [
    { boton: "Siete vértices, pesos de ambos signos",
      texto: "Una red de siete nodos con tramos que cuestan y tramos que devuelven. No hay ciclos negativos.",
      nombres: ["s", "a", "b", "c", "d", "e", "f"], s: 0,
      aristas: [[0, 1, 5], [0, 2, 3], [2, 1, -2], [1, 3, 4], [2, 4, 6], [3, 4, -3], [4, 5, 2], [3, 6, 7], [5, 6, -1], [5, 3, 2]],
      pos: [[0.0, 1.5], [1.6, 2.8], [1.6, 0.2], [3.4, 2.8], [3.4, 0.2], [5.0, 0.2], [6.4, 1.5]] },
    { boton: "Ocho vértices, un ciclo negativo alcanzable",
      texto: "Ocho nodos. Desde la fuente se llega a un ciclo, y del ciclo se sale hacia otros vértices.",
      nombres: ["s", "a", "b", "c", "d", "e", "f", "g"], s: 0,
      aristas: [[0, 1, 3], [1, 2, 2], [2, 3, -4], [3, 1, 1], [3, 4, 2], [4, 5, 1], [0, 6, 4], [6, 7, 2], [6, 3, 5], [7, 5, 3]],
      pos: [[0.0, 1.5], [1.6, 2.9], [3.4, 2.9], [2.5, 1.5], [4.6, 1.5], [6.2, 2.4], [1.6, 0.0], [4.0, 0.0]] },
    { boton: "Ocho vértices, ciclo negativo fuera de alcance",
      texto: "Ocho nodos. Hay un ciclo negativo, pero está en una parte del grafo a la que la fuente no llega.",
      nombres: ["s", "a", "b", "c", "d", "e", "f", "g"], s: 0,
      aristas: [[0, 1, 2], [1, 2, 3], [2, 3, -1], [0, 3, 6], [3, 4, 2], [5, 6, -3], [6, 5, 2], [5, 4, 1], [7, 3, 1], [7, 5, 3]],
      pos: [[0.0, 1.5], [1.5, 2.8], [3.2, 2.8], [3.2, 1.5], [4.8, 1.5], [3.8, 0.0], [5.8, 0.0], [2.2, 0.0]] }
  ];

  function adyacencia(g) {
    var G = [], i = 0;
    while (i < g.nombres.length) { G.push([]); i = i + 1; }
    i = 0;
    while (i < g.aristas.length) { G[g.aristas[i][0]].push(g.aristas[i][1]); i = i + 1; }
    return G;
  }

  function pesoDe(g, u, v) {
    var i = 0, w = null;
    while (i < g.aristas.length) {
      if (g.aristas[i][0] === u && g.aristas[i][1] === v) { w = g.aristas[i][2]; }
      i = i + 1;
    }
    return w;
  }

  /* Ruta de menos aristas de a a b, o null. */
  function ruta(g, a, b) {
    var G = adyacencia(g), n = G.length, padre = [], i = 0, cola = [a], k = 0;
    while (i < n) { padre.push(-2); i = i + 1; }
    padre[a] = -1;
    while (k < cola.length) {
      var u = cola[k], j = 0;
      while (j < G[u].length) {
        if (padre[G[u][j]] === -2) { padre[G[u][j]] = u; cola.push(G[u][j]); }
        j = j + 1;
      }
      k = k + 1;
    }
    var r = null;
    if (padre[b] !== -2) {
      r = [];
      var x = b;
      while (x !== -1) { r.unshift(x); x = padre[x]; }
    }
    return r;
  }

  function alcanzables(g, desde) {
    var n = g.nombres.length, r = [], i = 0;
    while (i < n) { r.push(ruta(g, desde, i) !== null); i = i + 1; }
    return r;
  }

  function costoRuta(g, r) {
    var c = 0, i = 0;
    while (i + 1 < r.length) { c = c + pesoDe(g, r[i], r[i + 1]); i = i + 1; }
    return c;
  }

  /* Ciclos simples de peso negativo, cada uno una sola vez (empieza en su vertice menor). */
  function ciclosNegativos(g) {
    var G = adyacencia(g), n = G.length, res = [], ini = 0;
    function dfs(u, cam, usado) {
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        if (v === ini) {
          var c = cam.concat([ini]);
          if (costoRuta(g, c) < 0) { res.push({ vs: c, peso: costoRuta(g, c) }); }
        } else if (v > ini && !usado[v]) {
          usado[v] = true;
          dfs(v, cam.concat([v]), usado);
          usado[v] = false;
        }
        j = j + 1;
      }
    }
    while (ini < n) {
      var usado = [], i = 0;
      while (i < n) { usado.push(false); i = i + 1; }
      usado[ini] = true;
      dfs(ini, [ini], usado);
      ini = ini + 1;
    }
    return res;
  }

  /* Bellman-Ford: n - 1 rondas; las aristas que aun se relajan marcan los vertices
     de los que parte el -infinito, que se propaga por alcanzabilidad. */
  function delta(g) {
    var n = g.nombres.length, d = [], pi = [], i = 0, r, e;
    while (i < n) { d.push(INF); pi.push(-1); i = i + 1; }
    d[g.s] = 0;
    r = 1;
    while (r <= n - 1) {
      e = 0;
      while (e < g.aristas.length) {
        var u = g.aristas[e][0], v = g.aristas[e][1], w = g.aristas[e][2];
        if (d[u] !== INF && d[u] + w < d[v]) { d[v] = d[u] + w; pi[v] = u; }
        e = e + 1;
      }
      r = r + 1;
    }
    var res = d.slice();
    e = 0;
    while (e < g.aristas.length) {
      var a = g.aristas[e][0], b = g.aristas[e][1], c = g.aristas[e][2];
      if (d[a] !== INF && d[a] + c < d[b]) {
        i = 0;
        while (i < n) { if (ruta(g, b, i) !== null) { res[i] = -INF; } i = i + 1; }
      }
      e = e + 1;
    }
    return { d: res, pi: pi };
  }

  function caminoPi(pi, v) {
    var r = [], x = v;
    while (x !== -1) { r.unshift(x); x = pi[x]; }
    return r;
  }

  /* El ciclo negativo alcanzable desde s que llega a v: {vs, peso, entrada, salida}. */
  function cicloQueLlega(g, v) {
    var cs = ciclosNegativos(g), k = 0, hallado = null;
    while (k < cs.length && hallado === null) {
      var c = cs[k], x = c.vs[0];
      if (ruta(g, g.s, x) !== null && ruta(g, x, v) !== null) {
        var mejor = 0, j = 1, e = ruta(g, g.s, c.vs[0]);
        while (j < c.vs.length - 1) {
          var rj = ruta(g, g.s, c.vs[j]);
          if (rj.length < e.length) { e = rj; mejor = j; }
          j = j + 1;
        }
        var vs = c.vs.slice(mejor, c.vs.length - 1).concat(c.vs.slice(0, mejor + 1));
        hallado = { vs: vs, peso: c.peso, entrada: e, salida: ruta(g, vs[0], v) };
      }
      k = k + 1;
    }
    return hallado;
  }

  /* Ciclo negativo (cualquiera) que contiene a v o que llega a v pero no se alcanza desde s. */
  function cicloFueraDeAlcance(g, v) {
    var cs = ciclosNegativos(g), k = 0, hallado = null;
    while (k < cs.length && hallado === null) {
      if (ruta(g, g.s, cs[k].vs[0]) === null && ruta(g, cs[k].vs[0], v) !== null) { hallado = cs[k]; }
      k = k + 1;
    }
    return hallado;
  }

  function parsear(txt) {
    var t = String(txt).trim().toLowerCase().replace(/−/g, "-").replace(/∞/g, "inf").replace(/\s+/g, ""), r = NaN;
    if (t === "inf" || t === "+inf" || t === "infinito") { r = INF; }
    else if (t === "-inf" || t === "-infinito") { r = -INF; }
    else if (/^[+-]?\d+$/.test(t)) { r = parseInt(t, 10); }
    return r;
  }

  function F(x) { return x === INF ? "∞" : (x === -INF ? "−∞" : String(x).replace("-", "−")); }

  function lista(g, vs, sep) { return vs.map(function (x) { return g.nombres[x]; }).join(sep || " → "); }

  /* Resultado de una respuesta: {ok, texto, aristas, color}. aristas = lista de [u, v] por resaltar. */
  function evaluar(g, dl, v, resp) {
    var nom = g.nombres, t = dl.d[v], ok = (resp === t), texto = "", aristas = [], color = "verde";
    function enAristas(vs) {
      var r = [], i = 0;
      while (i + 1 < vs.length) { r.push([vs[i], vs[i + 1]]); i = i + 1; }
      return r;
    }
    if (isNaN(resp)) {
      return { ok: false, texto: "Sin respuesta válida. Se espera un entero, inf o -inf. El valor correcto es " + F(t) + ".", aristas: [], color: "gris" };
    }
    if (t === -INF) {
      var cl = cicloQueLlega(g, v);
      var desc = "El ciclo " + lista(g, cl.vs) + " pesa " + F(cl.peso) + ", se alcanza desde " + nom[g.s] +
        " por " + lista(g, cl.entrada) + " y de él se llega a " + nom[v] + (cl.salida.length > 1 ? " por " + lista(g, cl.salida) : "") +
        ". Cada vuelta al ciclo baja el costo en " + Math.abs(cl.peso) + ", así que no existe un camino más corto.";
      aristas = enAristas(cl.entrada).concat(enAristas(cl.salida));
      var cic = enAristas(cl.vs);
      aristas = { amb: aristas, rojo: cic };
      color = "rojo";
      if (ok) { texto = "δ(" + nom[g.s] + ", " + nom[v] + ") = −∞. " + desc; }
      else if (resp === INF) { texto = "Sí hay camino de " + nom[g.s] + " a " + nom[v] + ", y por eso no es ∞. La respuesta es −∞: " + desc; }
      else { texto = "Dio " + F(resp) + ", un valor finito, y aquí no existe. Cualquier camino que se escriba se puede mejorar dando otra vuelta al ciclo. " + desc; }
    } else if (t === INF) {
      var fuera = cicloFueraDeAlcance(g, v);
      aristas = { amb: [], rojo: fuera ? enAristas(fuera.vs) : [] };
      color = "gris";
      var base = "No hay camino de " + nom[g.s] + " a " + nom[v] + ", así que δ(" + nom[g.s] + ", " + nom[v] + ") = ∞.";
      if (fuera) {
        base += " El ciclo " + lista(g, fuera.vs) + " pesa " + F(fuera.peso) + ", pero " + nom[g.s] + " no llega a ninguno de sus vértices: un ciclo negativo solo afecta a lo que la fuente alcanza.";
      }
      if (ok) { texto = base; }
      else if (resp === -INF) { texto = "Marcó −∞, pero el valor es ∞. " + base; }
      else { texto = "Dio " + F(resp) + ", y ningún número sirve cuando no hay camino. " + base; }
    } else {
      var cam = caminoPi(dl.pi, v), corto = ruta(g, g.s, v);
      aristas = { amb: [], verde: enAristas(cam) };
      color = "verde";
      var dsc = "El camino más corto es " + lista(g, cam) + " y cuesta " + F(t) + ".";
      if (ok) { texto = "δ(" + nom[g.s] + ", " + nom[v] + ") = " + F(t) + ". " + dsc; }
      else if (resp === -INF) { texto = "Ningún ciclo negativo alcanzable llega a " + nom[v] + ", así que el valor es finito. " + dsc; }
      else if (resp === INF) { texto = "Sí hay camino de " + nom[g.s] + " a " + nom[v] + ", así que el valor es finito. " + dsc; }
      else if (corto !== null && costoRuta(g, corto) === resp) {
        texto = "Ese es el costo del camino de menos aristas, " + lista(g, corto) + ", pero hay uno más barato que usa aristas negativas. " + dsc;
      } else { texto = "Dio " + F(resp) + ". " + dsc; }
    }
    return { ok: ok, texto: texto, aristas: aristas, color: color };
  }

  return { GRAFOS: GRAFOS, adyacencia: adyacencia, pesoDe: pesoDe, delta: delta, ciclosNegativos: ciclosNegativos,
           alcanzables: alcanzables, ruta: ruta, parsear: parsear, evaluar: evaluar, F: F, caminoPi: caminoPi };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var presetActual = 0, comprobado = false, resultados = [], resalte = null;

    function g() { return EJERCICIO.GRAFOS[presetActual]; }

    function dibujar() {
      var p = g(), dl = EJERCICIO.delta(p), G = EJERCICIO.adyacencia(p);
      function en(lista, u, v) {
        var i = 0, h = false;
        while (lista && i < lista.length) { if (lista[i][0] === u && lista[i][1] === v) { h = true; } i = i + 1; }
        return h;
      }
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: p.pos, G: G, nombres: p.nombres,
        peso: function (u, v) { return EJERCICIO.pesoDe(p, u, v); },
        nodo: function (k) {
          var s = { relleno: k === p.s ? "#e7f2e8" : "#e3edf8", borde: k === p.s ? "#2e7d32" : "#1f5fa8", tinta: "#24292f", grueso: 2.2 };
          if (comprobado) {
            s.nota = EJERCICIO.F(dl.d[k]);
            s.notaColor = dl.d[k] === -Infinity ? "#b3261e" : (dl.d[k] === Infinity ? "#6b7280" : "#1f5fa8");
          }
          return s;
        },
        arista: function (u, v) {
          var e = { color: "gris", grueso: 1.8 };
          if (resalte) {
            if (en(resalte.rojo, u, v)) { e = { color: "rojo", grueso: 3.6 }; }
            else if (en(resalte.verde, u, v)) { e = { color: "verde", grueso: 3.6 }; }
            else if (en(resalte.amb, u, v)) { e = { color: "ambar", grueso: 3.2 }; }
          }
          return e;
        }
      });
    }

    function armar() {
      var p = g(), h = "", k = 0;
      comprobado = false; resultados = []; resalte = null;
      while (k < p.nombres.length) {
        h += "<div class='prop' style='border:1px solid var(--borde);border-radius:8px;padding:0.5rem 0.7rem;margin-bottom:0.6rem'>" +
             "<label style='font-weight:600'>δ(" + p.nombres[p.s] + ", " + p.nombres[k] + ") = " +
             "<input type='text' id='resp-" + k + "' size='6' autocomplete='off' style='font:inherit;padding:0.2rem 0.4rem'></label>" +
             "<div id='ver-" + k + "' class='veredicto'></div>" +
             "<div id='btn-ver-" + k + "' style='display:none;margin-top:0.4rem'><button data-k='" + k + "'>Ver en el dibujo</button></div></div>";
        k = k + 1;
      }
      document.getElementById("respuestas").innerHTML = h;
      document.getElementById("resumen").className = "veredicto";
      document.getElementById("resumen").textContent = "";
      document.getElementById("ver-texto").textContent = p.texto;
      Array.prototype.forEach.call(document.querySelectorAll("#respuestas button"), function (b) {
        b.addEventListener("click", function () {
          var r = resultados[parseInt(b.getAttribute("data-k"), 10)];
          resalte = r.aristas;
          dibujar();
        });
      });
      dibujar();
    }

    function comprobar() {
      var p = g(), dl = EJERCICIO.delta(p), k = 0, aciertos = 0;
      resultados = [];
      while (k < p.nombres.length) {
        var r = EJERCICIO.evaluar(p, dl, k, EJERCICIO.parsear(document.getElementById("resp-" + k).value));
        resultados.push(r);
        if (r.ok) { aciertos = aciertos + 1; }
        var v = document.getElementById("ver-" + k);
        v.className = r.ok ? "veredicto bien" : "veredicto mal";
        v.textContent = (r.ok ? "Acierto. " : "Error. ") + r.texto;
        document.getElementById("btn-ver-" + k).style.display = (r.aristas.rojo && r.aristas.rojo.length) || (r.aristas.verde && r.aristas.verde.length) ? "block" : "none";
        k = k + 1;
      }
      comprobado = true; resalte = null;
      var s = document.getElementById("resumen");
      s.className = aciertos === p.nombres.length ? "veredicto bien" : "veredicto mal";
      s.textContent = aciertos + " de " + p.nombres.length + " distancias correctas.";
      dibujar();
    }

    document.getElementById("btn-comprobar").addEventListener("click", comprobar);
    document.getElementById("btn-respuesta").addEventListener("click", function () {
      var r = document.getElementById("respuesta-cierre");
      r.style.display = r.style.display === "block" ? "none" : "block";
    });
    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        armar();
      });
    });
    armar();
  })();
}
