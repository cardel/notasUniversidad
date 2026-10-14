/* Ejercicio interactivo: Bellman-Ford en sus dos versiones (clase 12).
   La simulacion reproduce inicializar, relajar, hay_arista_tensa,
   bellman_ford_ingenuo y bellman_ford tal como estan en el codigo de la clase, linea por linea. */
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

  /* Cada entrada es [clave, texto, bloque]; la clave null es una linea sin conteo.
     Los numeros se reparten en orden, y L[clave] da el numero de cada linea. */
  var DEF_INICIALIZAR = [
    [null, "def inicializar(n, s):", 0],
    ["i1", "    d = [INF] * n", 3],
    ["i2", "    pi = [-1] * n", 3],
    ["i3", "    d[s] = 0", 3],
    ["i4", "    return (d, pi)", 3],
    [null, "", 0]
  ];
  var DEF_RELAJAR = [
    [null, "def relajar(u, v, w, d, pi):", 0],
    ["r1", "    cambio = False", 3],
    ["r2", "    if d[u] + w < d[v]:", 3],
    ["r3", "        d[v] = d[u] + w", 3],
    ["r4", "        pi[v] = u", 3],
    ["r5", "        cambio = True", 3],
    ["r6", "    return cambio", 3],
    [null, "", 0]
  ];
  var DEF_TENSA = [
    [null, "def hay_arista_tensa(G, d):", 0],
    ["h1", "    tensa = False", 3],
    ["h2", "    for u in range(len(G)):", 3],
    ["h3", "        for (v, w) in G[u]:", 3],
    ["h4", "            if d[u] + w < d[v]:", 3],
    ["h5", "                tensa = True", 3],
    ["h6", "    return tensa", 3]
  ];
  var DEF_INGENUO = [
    [null, "def bellman_ford_ingenuo(G, s):", 0],
    ["b1", "    n = len(G)", 1],
    ["b2", "    d, pi = inicializar(n, s)", 1],
    ["b3", "    ronda = 1", 1],
    ["b4", "    while ronda <= n - 1:", 1],
    ["b5", "        for u in range(n):", 1],
    ["b6", "            for (v, w) in G[u]:", 1],
    ["b7", "                relajar(u, v, w, d, pi)", 1],
    ["b8", "        ronda = ronda + 1", 1],
    ["b9", "    sin_ciclo = not hay_arista_tensa(G, d)", 1],
    ["b10", "    return (d, pi, sin_ciclo)", 1],
    [null, "", 0]
  ];
  var DEF_TEMPRANO = [
    [null, "def bellman_ford(G, s):", 0],
    ["b1", "    n = len(G)", 2],
    ["b2", "    d, pi = inicializar(n, s)", 2],
    ["b3", "    ronda = 1", 2],
    ["c0", "    hubo_cambio = True", 2],
    ["b4", "    while ronda <= n - 1 and hubo_cambio:", 2],
    ["c1", "        hubo_cambio = False", 2],
    ["b5", "        for u in range(n):", 2],
    ["b6", "            for (v, w) in G[u]:", 2],
    ["b7", "                if relajar(u, v, w, d, pi):", 2],
    ["c2", "                    hubo_cambio = True", 2],
    ["b8", "        ronda = ronda + 1", 2],
    ["b9", "    sin_ciclo = not hay_arista_tensa(G, d)", 2],
    ["b10", "    return (d, pi, sin_ciclo)", 2],
    [null, "", 0]
  ];

  function armarCodigo(version) {
    var defs = (version === "ingenuo" ? DEF_INGENUO : DEF_TEMPRANO).concat(DEF_INICIALIZAR, DEF_RELAJAR, DEF_TENSA);
    var codigo = [], L = {}, num = 1;
    defs.forEach(function (e) {
      var linea = { txt: e[1], num: null };
      if (e[0] !== null) { linea.num = num; L[e[0]] = num; num = num + 1; }
      if (e[2] > 0) { linea.bloque = e[2]; }
      codigo.push(linea);
    });
    return { codigo: codigo, L: L };
  }
  var CODIGOS = { ingenuo: armarCodigo("ingenuo"), temprano: armarCodigo("temprano") };

  /* Listas de adyacencia de un grafo dirigido con pesos. */
  function construir(n, aristas) {
    var G = [], u = 0, k = 0;
    while (u < n) { G.push([]); u = u + 1; }
    while (k < aristas.length) { G[aristas[k][0]].push([aristas[k][1], aristas[k][2]]); k = k + 1; }
    return G;
  }

  function fmt(x) { return x === INF ? "∞" : String(x); }

  /* params: {G, s, version}. Devuelve la lista de pasos. */
  function simular(params) {
    var G = params.G, s = params.s, n = G.length, ing = params.version === "ingenuo";
    var L = CODIGOS[params.version].L, pasos = [];
    var d = null, pi = null, ronda = null, hubo = null, ex = 0;
    var u = null, v = null, w = null, foco = null, hist = [], cambioRonda = [], cambiosDe = [];
    var cambiaAhora = null;

    function snap(clave, extra) {
      var q = {
        linea: L[clave], d: d === null ? null : d.slice(), pi: pi === null ? null : pi.slice(),
        ronda: ronda === null ? "–" : ronda, hubo: hubo === null ? "–" : (hubo ? "True" : "False"),
        ex: ex, u: u === null ? "–" : u, v: v === null ? "–" : v, w: w === null ? "–" : w,
        foco: foco, hist: hist.slice(), hecho: false
      };
      if (extra) { var y; for (y in extra) { q[y] = extra[y]; } }
      pasos.push(q);
    }

    /* relajar(u, v, w, d, pi), con el borde de la arista mirada. */
    function relajar(a, b, peso, marca) {
      var cambio = false;
      u = a; v = b; w = peso;
      snap("r1", { mira: marca });
      snap("r2", { mira: marca });
      if (d[a] + peso < d[b]) {
        d[b] = d[a] + peso; snap("r3", { mira: marca, cambia: marca });
        pi[b] = a; snap("r4", { mira: marca, cambia: marca });
        cambio = true; snap("r5", { mira: marca, cambia: marca });
      }
      snap("r6", { mira: marca, cambia: cambio ? marca : null });
      return cambio;
    }

    snap("b1");
    snap("b2");
    d = []; pi = []; var i = 0;
    while (i < n) { d.push(INF); pi.push(-1); i = i + 1; }
    snap("i1");
    snap("i2");
    d[s] = 0; snap("i3");
    snap("i4");
    ronda = 1; snap("b3");
    if (!ing) { hubo = true; snap("c0"); }
    snap("b4");
    while (ronda <= n - 1 && (ing || hubo)) {
      if (!ing) { hubo = false; snap("c1"); }
      var hayCambio = false, lista = [];
      var a = 0;
      while (a < n) {
        u = a; v = null; w = null; foco = a;
        snap("b5");
        var j = 0;
        while (j < G[a].length) {
          v = G[a][j][0]; w = G[a][j][1]; u = a;
          var marca = [a, v];
          snap("b6", { mira: marca });
          ex = ex + 1;
          snap("b7", { mira: marca });
          var c = relajar(a, v, w, marca);
          if (c) { hayCambio = true; lista.push([a, v]); }
          if (!ing && c) { hubo = true; snap("c2", { mira: marca, cambia: marca }); }
          j = j + 1;
        }
        a = a + 1;
      }
      foco = null; u = null; v = null; w = null;
      cambioRonda.push(hayCambio); cambiosDe.push(lista);
      hist.push({ ronda: ronda, d: d.slice(), cambio: hayCambio });
      ronda = ronda + 1; snap("b8");
      snap("b4");
    }
    snap("b9");
    var tensa = false;
    snap("h1");
    var a2 = 0;
    while (a2 < n) {
      u = a2; foco = a2; v = null; w = null;
      snap("h2");
      var j2 = 0;
      while (j2 < G[a2].length) {
        v = G[a2][j2][0]; w = G[a2][j2][1];
        snap("h3", { mira: [a2, v] });
        snap("h4", { mira: [a2, v] });
        if (d[a2] + w < d[v]) { tensa = true; snap("h5", { tensa: [a2, v] }); }
        j2 = j2 + 1;
      }
      a2 = a2 + 1;
    }
    foco = null; u = null; v = null; w = null;
    snap("h6");
    snap("b10", { hecho: true });

    var ult = pasos[pasos.length - 1], ultimaConCambio = 0, r = 0;
    while (r < cambioRonda.length) { if (cambioRonda[r]) { ultimaConCambio = r + 1; } r = r + 1; }
    ult.resultado = {
      d: d.slice(), pi: pi.slice(), sinCiclo: !tensa, rondas: cambioRonda.length, examinadas: ex,
      estab: ultimaConCambio, cambiosDe: cambiosDe
    };
    return pasos;
  }

  function resumen(G, s, version) {
    return simular({ G: G, s: s, version: version }).pop().resultado;
  }

  var GRAFOS = [
    { boton: "Cinco vértices, cadena inversa",
      texto: "Cinco vértices, fuente 0. Las aristas se recorren por vértice de origen, de 0 a 4, y el camino más barato corre hacia atrás en esa numeración.",
      n: 5, s: 0,
      aristas: [[0, 4, 3], [0, 2, 9], [1, 3, 5], [2, 1, 1], [3, 2, 2], [4, 3, -1]],
      pos: [[0.0, 1.5], [5.2, 2.7], [3.8, 1.5], [2.8, 2.7], [1.3, 2.7]] },
    { boton: "Seis vértices, dos rondas",
      texto: "Seis vértices, fuente 0, con dos aristas negativas y un par antiparalelo entre 1 y 3.",
      n: 6, s: 0,
      aristas: [[0, 1, 2], [0, 2, 5], [1, 2, -1], [1, 3, 6], [2, 4, 3], [3, 1, 4], [3, 5, 1], [4, 3, -2], [5, 4, 2]],
      pos: [[0.0, 1.5], [1.5, 2.7], [1.5, 0.3], [3.3, 2.7], [3.3, 0.3], [5.0, 1.5]] },
    { boton: "Seis vértices, fuente 3",
      texto: "Seis vértices con la fuente en 3. El vértice 0 solo tiene una arista de salida y nadie llega a él.",
      n: 6, s: 3,
      aristas: [[0, 1, 4], [1, 2, -3], [2, 4, 5], [3, 2, 6], [3, 4, 1], [4, 5, 2], [4, 1, 2], [5, 2, -1]],
      pos: [[0.0, 3.0], [1.7, 3.0], [3.4, 3.0], [0.0, 0.2], [1.9, 0.9], [3.6, 0.2]] }
  ];

  function adyacenciaDe(g) { return construir(g.n, g.aristas); }

  return { codigos: CODIGOS, grafos: GRAFOS, construir: construir, simular: simular, resumen: resumen,
           adyacenciaDe: adyacenciaDe, fmt: fmt };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var GRAFOS = EJERCICIO.grafos, presetActual = 0, version = "ingenuo";
    var F = EJERCICIO.fmt;

    function g() { return GRAFOS[presetActual]; }
    function paramsActuales() { return { G: EJERCICIO.adyacenciaDe(g()), s: g().s, version: version }; }
    function par(p, a, b) { return p && p[0] === a && p[1] === b; }
    function lista(a) { return "[" + a.map(F).join(", ") + "]"; }
    function pesoDe(u, v) {
      var k = 0, w = null;
      while (k < g().aristas.length) { if (g().aristas[k][0] === u && g().aristas[k][1] === v) { w = g().aristas[k][2]; } k = k + 1; }
      return w;
    }

    function dibujar(a) {
      var p = g(), nom = [], i = 0;
      while (i < p.n) { nom.push(String(i)); i = i + 1; }
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: p.pos, G: EJERCICIO.adyacenciaDe(p).map(function (l) { return l.map(function (e) { return e[0]; }); }),
        nombres: nom, peso: pesoDe,
        nodo: function (k) {
          var s = { relleno: k === p.s ? "#e7f2e8" : "#ffffff", borde: k === p.s ? "#2e7d32" : "#6b7280", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (a && a.d !== null) {
            s.nota = F(a.d[k]) + "/" + (a.pi[k] === -1 ? "–" : a.pi[k]);
            if (a.d[k] !== Infinity) { s.relleno = k === p.s ? "#e7f2e8" : "#e3edf8"; s.borde = k === p.s ? "#2e7d32" : "#1f5fa8"; }
            if (a.foco === k) { s.borde = "#e8a13d"; s.grueso = 4.2; }
          }
          return s;
        },
        arista: function (u, v) {
          var e = { color: "gris", grueso: 1.6 };
          if (a && a.pi !== null && a.pi[v] === u) { e = { color: "morado", grueso: 2.6 }; }
          if (a && par(a.tensa, u, v)) { e = { color: "rojo", grueso: 3.4 }; }
          else if (a && par(a.cambia, u, v)) { e = { color: "verde", grueso: 3.2 }; }
          else if (a && par(a.mira, u, v)) { e = { color: "azul", grueso: 3.0 }; }
          return e;
        }
      });
    }

    function tablaRondas(a) {
      var p = g(), h = "<tr><th>Ronda</th>", i = 0;
      while (i < p.n) { h += "<th>d[" + i + "]</th>"; i = i + 1; }
      h += "<th>¿Cambió algo?</th></tr>";
      var cuerpo = "";
      if (a) {
        a.hist.forEach(function (r) {
          cuerpo += "<tr><td>" + r.ronda + "</td>" + r.d.map(function (x) { return "<td>" + F(x) + "</td>"; }).join("") +
                    "<td>" + (r.cambio ? "sí" : "no") + "</td></tr>";
        });
      }
      if (cuerpo === "") { cuerpo = "<tr><td colspan='" + (p.n + 2) + "' class='pend'>Todavía no termina ninguna ronda.</td></tr>"; }
      document.getElementById("tabla-rondas").innerHTML = "<thead>" + h + "</thead><tbody>" + cuerpo + "</tbody>";
    }

    function comparar(a) {
      var p = g(), G = EJERCICIO.adyacenciaDe(p), m = p.aristas.length, caja = document.getElementById("comparacion");
      if (!(a && a.hecho)) {
        caja.innerHTML = "<p class='nota' style='margin-top:0'>Ejecute hasta el final para ver la comparación.</p>";
        return;
      }
      var ri = EJERCICIO.resumen(G, p.s, "ingenuo"), rt = EJERCICIO.resumen(G, p.s, "temprano");
      var sobran = ri.examinadas - rt.examinadas;
      caja.innerHTML = "<div class='envoltura-tabla'><table><thead><tr><th>Versión</th><th>Rondas</th><th>Aristas examinadas</th><th>Cuenta</th></tr></thead><tbody>" +
        "<tr><td>Ingenua</td><td>" + ri.rondas + "</td><td><b>" + ri.examinadas + "</b></td><td>(|V| − 1) · |E| = " + (p.n - 1) + " · " + m + "</td></tr>" +
        "<tr><td>Con parada temprana</td><td>" + rt.rondas + "</td><td><b>" + rt.examinadas + "</b></td><td>rondas · |E| = " + rt.rondas + " · " + m + "</td></tr>" +
        "</tbody></table></div>" +
        "<p style='margin-bottom:0'>" + (sobran > 0
          ? "La parada temprana se ahorra " + sobran + " aristas: después de la ronda " + rt.estab + " no cambia nada, y la ronda " + rt.rondas + " solo sirve para comprobarlo."
          : "Las dos examinan lo mismo: la ronda " + rt.estab + " es la última con cambios, y la " + rt.rondas + ", que lo comprueba, es también la última que permiten las |V| − 1 = " + (p.n - 1) + " rondas. La bandera no tiene nada que ahorrar.") +
        " Ambas dejan <code>d = " + lista(ri.d) + "</code> y <code>sin_ciclo = " + (ri.sinCiclo ? "True" : "False") + "</code>.</p>";
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(a);
      tablaRondas(a);
      comparar(a);
      document.getElementById("ver-d").textContent = a && a.d !== null ? lista(a.d) : "sin crear";
      document.getElementById("ver-pi").textContent = a && a.pi !== null ? lista(a.pi) : "sin crear";
    }

    function chipsDe(v) {
      var base = [
        { campo: "ronda", rotulo: "ronda" }, { campo: "ex", rotulo: "aristas examinadas", clase: "cuenta" },
        { campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "w", rotulo: "w" }
      ];
      if (v === "temprano") { base.splice(1, 0, { campo: "hubo", rotulo: "hubo_cambio" }); }
      return base;
    }

    function arrancar() {
      var ids = ["btn-paso", "btn-auto", "btn-fin", "btn-reiniciar"], t = 0;
      while (t < ids.length) {
        var b = document.getElementById(ids[t]);
        b.parentNode.replaceChild(b.cloneNode(true), b);
        t = t + 1;
      }
      Motor.iniciar({
        codigo: EJERCICIO.codigos[version].codigo, simular: EJERCICIO.simular,
        chips: chipsDe(version), paramsIniciales: paramsActuales(), alPintar: alPintar
      });
    }

    function preparar() {
      document.getElementById("ver-texto").textContent = g().texto;
      document.getElementById("prediccion").value = "";
      Motor.limpiarVeredicto();
    }

    function evaluar(valor, params) {
      var p = g(), r = EJERCICIO.resumen(params.G, params.s, "temprano"), n = p.n, res;
      var cambia = r.cambiosDe[r.estab - 1], ar = cambia[0];
      if (valor === r.estab) {
        res = { ok: true, msg: "Correcto: la ronda " + r.estab + ". Es la última en la que alguna relajación baja un d (por ejemplo la arista (" + ar[0] + ", " + ar[1] + ")). " +
          (r.rondas > r.estab
            ? "La ronda " + r.rondas + " no cambia nada, y ahí se detiene la versión con parada temprana."
            : "Es también la última ronda permitida, la " + (n - 1) + ", así que la parada temprana no ahorra nada.") };
      } else if (valor < 1 || valor > n - 1) {
        res = { ok: false, msg: "Las rondas van de 1 a |V| − 1 = " + (n - 1) + ": ni la ingenua ni la temprana hacen más." };
      } else if (valor < r.estab) {
        res = { ok: false, msg: "Todavía cambia algo después de la ronda " + valor + ": en la ronda " + r.estab + " la arista (" + ar[0] + ", " + ar[1] + ") baja un d. Siga la ejecución ronda por ronda y mire en cuál deja de pasar." };
      } else {
        res = { ok: false, msg: "En la ronda " + valor + " ya no cambia nada; el último cambio es antes, en la " + r.estab + ". Una ronda que no cambia nada no es la que estabiliza, es la que lo comprueba." };
      }
      return res;
    }

    arrancar();
    preparar();
    Motor.prediccionNumerica(function (valor, params) { return evaluar(valor, params); });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        preparar();
        Motor.reiniciar(paramsActuales());
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        version = btn.getAttribute("data-version");
        arrancar();
      });
    });
  })();
}
