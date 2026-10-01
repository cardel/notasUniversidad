/* Ejercicio interactivo: el algoritmo de Tarjan paso a paso (clase 10).
   La simulacion reproduce en_blanco, sacar_componente, descubrir, tarjan,
   tarjan_desde y tarjan_con_pila tal como estan en el codigo de la clase, linea por linea. */
/* Dibujo de grafos dirigidos en SVG, con nombres de vertice y anotaciones. */
var DIB = (function () {
  var COL = {
    gris: "#6b7280", azul: "#1f5fa8", verde: "#2e7d32", rojo: "#b3261e",
    ambar: "#e8a13d", morado: "#6b3fa0", claro: "#c4cad3"
  };
  var RY = 16;

  function rxDe(nombre) {
    var r = 3.2 * nombre.length + 8;
    return r < 18 ? 18 : r;
  }

  /* o.pos, o.G, o.nombres; o.nodo(i) -> {relleno, borde, tinta, grueso, nota, notaColor};
     o.arista(u, v) -> {color, grueso, trazo}. */
  function dibujar(o) {
    var pos = o.pos, G = o.G, nom = o.nombres, n = pos.length;
    var ancho = 560, alto = o.alto || 300, mx = 56, my = 40;
    var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
    while (i < n) {
      if (pos[i][0] < minX) { minX = pos[i][0]; }
      if (pos[i][0] > maxX) { maxX = pos[i][0]; }
      if (pos[i][1] < minY) { minY = pos[i][1]; }
      if (pos[i][1] > maxY) { maxY = pos[i][1]; }
      i = i + 1;
    }
    function X(k) { return mx + (pos[k][0] - minX) / (maxX - minX) * (ancho - 2 * mx); }
    function Y(k) { return my + (maxY - pos[k][1]) / (maxY - minY) * (alto - 2 * my); }
    function existe(p, q) {
      var j = 0, hay = false;
      while (j < G[p].length) { if (G[p][j] === q) { hay = true; } j = j + 1; }
      return hay;
    }
    /* Distancia del centro al borde de la elipse en la direccion (ux, uy). */
    function borde(k, ux, uy) {
      var a = rxDe(nom[k]);
      return 1 / Math.sqrt((ux / a) * (ux / a) + (uy / RY) * (uy / RY));
    }

    var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:640px'>";
    svg += "<defs>";
    var c;
    for (c in COL) {
      svg += "<marker id='ah-" + c + "' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'>" +
             "<path d='M0,0 L0,6 L9,3 z' fill='" + COL[c] + "'/></marker>";
    }
    svg += "</defs>";

    var u = 0, j;
    while (u < n) {
      j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        var e = o.arista(u, v);
        var dash = e.trazo ? " stroke-dasharray='" + e.trazo + "'" : "";
        var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
        var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
        var pie = "' fill='none' stroke='" + COL[e.color] + "' stroke-width='" + e.grueso + "'" + dash +
                  " marker-end='url(#ah-" + e.color + ")'/>";
        if (existe(v, u)) {
          var cx = (x1 + x2) / 2 - dy / dd * 26, cy = (y1 + y2) / 2 + dx / dd * 26;
          var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
          var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
          var a1 = borde(u, (cx - x1) / l1, (cy - y1) / l1) + 2;
          var a2 = borde(v, (cx - x2) / l2, (cy - y2) / l2) + 5;
          svg += "<path d='M" + (x1 + (cx - x1) / l1 * a1) + "," + (y1 + (cy - y1) / l1 * a1) +
                 " Q" + cx + "," + cy + " " + (x2 + (cx - x2) / l2 * a2) + "," + (y2 + (cy - y2) / l2 * a2) + pie;
        } else {
          var b1 = borde(u, dx / dd, dy / dd) + 2;
          var b2 = borde(v, -dx / dd, -dy / dd) + 5;
          svg += "<path d='M" + (x1 + dx / dd * b1) + "," + (y1 + dy / dd * b1) +
                 " L" + (x2 - dx / dd * b2) + "," + (y2 - dy / dd * b2) + pie;
        }
        j = j + 1;
      }
      u = u + 1;
    }
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
  var BASE = [
    { txt: "def en_blanco(grafo):",                              num: null },
    { txt: "    d = {}",                                         num: 1, bloque: 1 },
    { txt: "    low = {}",                                       num: 2, bloque: 1 },
    { txt: "    en_pila = {}",                                   num: 3, bloque: 1 },
    { txt: "    for v in grafo:",                                num: 4, bloque: 1 },
    { txt: "        d[v] = 0",                                   num: 5, bloque: 1 },
    { txt: "        low[v] = 0",                                 num: 6, bloque: 1 },
    { txt: "        en_pila[v] = False",                         num: 7, bloque: 1 },
    { txt: "    resultado = (d, low, en_pila)",                  num: 8, bloque: 1 },
    { txt: "    return resultado",                               num: 9, bloque: 1 },
    { txt: "",                                                   num: null },
    { txt: "def sacar_componente(u, pila, en_pila, componentes):", num: null },
    { txt: "    comp = []",                                      num: 10, bloque: 2 },
    { txt: "    w = None",                                       num: 11, bloque: 2 },
    { txt: "    while w != u:",                                  num: 12, bloque: 2 },
    { txt: "        w = pila.pop()",                             num: 13, bloque: 2 },
    { txt: "        en_pila[w] = False",                         num: 14, bloque: 2 },
    { txt: "        comp.append(w)",                             num: 15, bloque: 2 },
    { txt: "    componentes.append(comp)",                       num: 16, bloque: 2 },
    { txt: "",                                                   num: null },
    { txt: "def descubrir(u, reloj, d, low, pila, en_pila):",    num: null },
    { txt: "    reloj[0] = reloj[0] + 1",                        num: 17, bloque: 3 },
    { txt: "    d[u] = reloj[0]",                                num: 18, bloque: 3 },
    { txt: "    low[u] = reloj[0]",                              num: 19, bloque: 3 },
    { txt: "    pila.append(u)",                                 num: 20, bloque: 3 },
    { txt: "    en_pila[u] = True",                              num: 21, bloque: 3 },
    { txt: "",                                                   num: null }
  ];

  var REC = [
    { txt: "def tarjan(grafo):",                                 num: null },
    { txt: "    d, low, en_pila = en_blanco(grafo)",             num: 22 },
    { txt: "    reloj = [0]",                                    num: 23 },
    { txt: "    pila = []",                                      num: 24 },
    { txt: "    componentes = []",                               num: 25 },
    { txt: "",                                                   num: null },
    { txt: "    def visit(u):",                                  num: null },
    { txt: "        descubrir(u, reloj, d, low, pila, en_pila)", num: 26 },
    { txt: "        for v in grafo[u]:",                         num: 27 },
    { txt: "            if d[v] == 0:",                          num: 28 },
    { txt: "                visit(v)",                           num: 29 },
    { txt: "                low[u] = min(low[u], low[v])",       num: 30 },
    { txt: "            elif en_pila[v]:",                       num: 31 },
    { txt: "                low[u] = min(low[u], d[v])",         num: 32 },
    { txt: "        if low[u] == d[u]:",                         num: 33 },
    { txt: "            sacar_componente(u, pila, en_pila, componentes)", num: 34 },
    { txt: "",                                                   num: null },
    { txt: "    for u in grafo:",                                num: 35 },
    { txt: "        if d[u] == 0:",                              num: 36 },
    { txt: "            visit(u)",                               num: 37 },
    { txt: "    return componentes",                             num: 38 }
  ];

  var PILA = [
    { txt: "def tarjan_desde(grafo, s, reloj, d, low, pila, en_pila, componentes):", num: null },
    { txt: "    descubrir(s, reloj, d, low, pila, en_pila)",     num: 22 },
    { txt: "    llamadas = [[s, 0]]",                            num: 23 },
    { txt: "    while len(llamadas) > 0:",                       num: 24 },
    { txt: "        u, i = llamadas[-1]",                        num: 25 },
    { txt: "        if i < len(grafo[u]):",                      num: 26 },
    { txt: "            llamadas[-1][1] = i + 1",                num: 27 },
    { txt: "            v = grafo[u][i]",                        num: 28 },
    { txt: "            if d[v] == 0:",                          num: 29 },
    { txt: "                descubrir(v, reloj, d, low, pila, en_pila)", num: 30 },
    { txt: "                llamadas.append([v, 0])",            num: 31 },
    { txt: "            elif en_pila[v]:",                       num: 32 },
    { txt: "                low[u] = min(low[u], d[v])",         num: 33 },
    { txt: "        else:",                                      num: null },
    { txt: "            llamadas.pop()",                         num: 34 },
    { txt: "            if low[u] == d[u]:",                     num: 35 },
    { txt: "                sacar_componente(u, pila, en_pila, componentes)", num: 36 },
    { txt: "            if len(llamadas) > 0:",                  num: 37 },
    { txt: "                p = llamadas[-1][0]",                num: 38 },
    { txt: "                low[p] = min(low[p], low[u])",       num: 39 },
    { txt: "",                                                   num: null },
    { txt: "def tarjan_con_pila(grafo):",                        num: null },
    { txt: "    d, low, en_pila = en_blanco(grafo)",             num: 40 },
    { txt: "    reloj = [0]",                                    num: 41 },
    { txt: "    pila = []",                                      num: 42 },
    { txt: "    componentes = []",                               num: 43 },
    { txt: "    for s in grafo:",                                num: 44 },
    { txt: "        if d[s] == 0:",                              num: 45 },
    { txt: "            tarjan_desde(grafo, s, reloj, d, low, pila, en_pila,", num: 46 },
    { txt: "                         componentes)",              num: null },
    { txt: "    return componentes",                             num: 47 }
  ];

  function codigoDe(version) { return BASE.concat(version === "pila" ? PILA : REC); }

  function simular(params) {
    var G = params.G, nom = params.nombres, esPila = params.version === "pila";
    var n = G.length, pasos = [], d = [], low = [], enPila = [], pila = [], comps = [], compDe = [];
    var reloj = 0, llamadas = [], arbol = [], formando = [];
    var cs = null, cu = null, cv = null, cw = null, ci = null, cp = null, foco = null, i = 0;
    while (i < n) { d.push(null); low.push(null); enPila.push(null); compDe.push(-1); i = i + 1; }

    function N(k) { return k === null ? "–" : nom[k]; }
    function snap(linea, extra) {
      var q = {
        linea: linea, d: d.slice(), low: low.slice(), enPila: enPila.slice(), pila: pila.slice(),
        comps: comps.map(function (c) { return c.slice(); }), compDe: compDe.slice(),
        formando: formando.slice(), arbol: arbol.map(function (a) { return [a[0], a[1]]; }),
        llamadas: esPila ? llamadas.map(function (p) { return [p[0], p[1]]; }) : llamadas.slice(),
        reloj: reloj, s: N(cs), u: N(cu), v: N(cv), w: N(cw), i: ci === null ? "–" : ci, p: N(cp),
        foco: foco, hecho: false
      };
      if (extra) { var x; for (x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }

    function enBlancoSim(linea) {
      snap(linea);
      snap(1); snap(2); snap(3);
      var v = 0;
      while (v < n) {
        cv = v; snap(4);
        d[v] = 0; snap(5);
        low[v] = 0; snap(6);
        enPila[v] = false; snap(7);
        v = v + 1;
      }
      cv = null;
      snap(8); snap(9);
    }

    function descubrirSim(u) {
      reloj = reloj + 1; snap(17);
      d[u] = reloj; snap(18);
      low[u] = reloj; snap(19);
      pila.push(u); snap(20);
      enPila[u] = true; snap(21);
    }

    function sacarSim(u) {
      var comp = [], w = null, guardoW = cw;
      formando = comp;
      snap(10);
      snap(11);
      while (w !== u) {
        snap(12);
        w = pila.pop(); cw = w; snap(13, { saca: w });
        enPila[w] = false; snap(14);
        comp.push(w); snap(15);
      }
      snap(12);
      comps.push(comp.slice());
      var c = 0;
      while (c < comp.length) { compDe[comp[c]] = comps.length - 1; c = c + 1; }
      formando = [];
      snap(16, { cierre: comp.slice(), cerradoPor: u, numero: comps.length });
      cw = guardoW;
    }

    function visit(u) {
      llamadas.push(u); cu = u; cv = null; foco = u;
      snap(26);
      descubrirSim(u);
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        cu = u; cv = v; foco = u;
        snap(27, { mira: [u, v] });
        snap(28, { mira: [u, v] });
        if (d[v] === 0) {
          snap(29, { baja: [u, v] });
          arbol.push([u, v]);
          visit(v);
          cu = u; cv = v; foco = u;
          low[u] = Math.min(low[u], low[v]);
          snap(30, { sube: [u, v] });
        } else {
          snap(31, { mira: [u, v] });
          if (enPila[v]) {
            low[u] = Math.min(low[u], d[v]);
            snap(32, { usa: [u, v] });
          }
        }
        j = j + 1;
      }
      cv = null;
      snap(33);
      if (low[u] === d[u]) {
        snap(34);
        sacarSim(u);
        cu = u;
      }
      llamadas.pop();
    }

    function recursiva() {
      enBlancoSim(22);
      snap(23); snap(24); snap(25);
      var u = 0;
      while (u < n) {
        cu = u; cv = null; foco = null;
        snap(35);
        snap(36);
        if (d[u] === 0) {
          snap(37, { raiz: u });
          visit(u);
          cu = u; cv = null; foco = null;
        }
        u = u + 1;
      }
      cu = null; foco = null;
      snap(38, { hecho: true });
    }

    function desde(s) {
      cu = null;
      snap(46, { raiz: s });
      cu = s; foco = s;
      snap(22);
      descubrirSim(s);
      llamadas = [[s, 0]]; arbol = arbol.slice(); snap(23);
      while (llamadas.length > 0) {
        snap(24);
        var tope = llamadas[llamadas.length - 1];
        cu = tope[0]; ci = tope[1]; foco = cu; cv = null;
        snap(25);
        snap(26);
        if (ci < G[cu].length) {
          tope[1] = ci + 1; snap(27);
          var v = G[cu][ci]; cv = v; snap(28, { mira: [cu, v] });
          snap(29, { mira: [cu, v] });
          if (d[v] === 0) {
            snap(30, { baja: [cu, v] });
            descubrirSim(v);
            llamadas.push([v, 0]); arbol.push([cu, v]); snap(31, { baja: [cu, v] });
          } else {
            snap(32, { mira: [cu, v] });
            if (enPila[v]) {
              low[cu] = Math.min(low[cu], d[v]);
              snap(33, { usa: [cu, v] });
            }
          }
        } else {
          llamadas.pop(); snap(34);
          snap(35);
          if (low[cu] === d[cu]) {
            snap(36);
            sacarSim(cu);
          }
          snap(37);
          if (llamadas.length > 0) {
            cp = llamadas[llamadas.length - 1][0]; snap(38);
            low[cp] = Math.min(low[cp], low[cu]);
            snap(39, { sube: [cp, cu] });
          }
        }
      }
      snap(24);
      cu = null; ci = null; cv = null; cp = null; foco = null;
    }

    function conPila() {
      enBlancoSim(40);
      snap(41); snap(42); snap(43);
      var s = 0;
      while (s < n) {
        cs = s; snap(44);
        snap(45);
        if (d[s] === 0) { desde(s); }
        s = s + 1;
      }
      cs = null;
      snap(47, { hecho: true });
    }

    if (esPila) { conPila(); } else { recursiva(); }
    var ult = pasos[pasos.length - 1];
    ult.resultado = comps.map(function (c) { return c.slice(); });
    return pasos;
  }

  /* Componentes en el orden de cierre, sin instrumentar, y sus flechas entre componentes. */
  function condensacion(G, comps) {
    var n = G.length, de = [], c = 0, u, j, entre = [];
    while (c < n) { de.push(-1); c = c + 1; }
    c = 0;
    while (c < comps.length) { var t = 0; while (t < comps[c].length) { de[comps[c][t]] = c; t = t + 1; } c = c + 1; }
    u = 0;
    while (u < n) {
      j = 0;
      while (j < G[u].length) {
        if (de[u] !== de[G[u][j]]) { entre.push([u, G[u][j], de[u], de[G[u][j]]]); }
        j = j + 1;
      }
      u = u + 1;
    }
    return entre;
  }

  return { codigoDe: codigoDe, simular: simular, condensacion: condensacion };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var GRAFOS = [
      { boton: "Páginas web, siete vértices",
        texto: "Enlaces de un sitio web: una flecha va de la página que enlaza a la enlazada.",
        nombres: ["inicio", "blog", "foro", "tienda", "carrito", "pago", "ayuda"],
        G: [[1, 3], [2], [0], [4, 6], [5], [3], []],
        pos: [[0.0, 1.5], [1.3, 2.7], [1.3, 0.3], [2.9, 1.5], [4.2, 2.7], [4.2, 0.3], [5.6, 1.5]] },
      { boton: "Ciudad, ocho",
        texto: "Calles de sentido único entre ocho lugares: una flecha va del lugar de salida al de llegada.",
        nombres: ["plaza", "museo", "puerto", "estación", "mercado", "parque", "colegio", "estadio"],
        G: [[1, 4], [2], [1, 3], [], [5, 3], [6], [4, 7], [5]],
        pos: [[0.0, 1.5], [1.3, 2.8], [2.7, 2.8], [3.8, 2.8], [1.8, 0.4], [3.2, 1.5], [4.6, 0.4], [4.8, 1.7]] },
      { boton: "Seguidores, nueve",
        texto: "Quién sigue a quién en una red social: una flecha va del que sigue al seguido.",
        nombres: ["Ana", "Beto", "Caro", "Dani", "Eli", "Fabi", "Gus", "Hugo", "Ines"],
        G: [[1, 4, 7], [2], [3], [1], [5], [6], [4, 3], [8, 4], [7, 0]],
        pos: [[2.7, 1.6], [0.0, 2.0], [1.0, 0.9], [1.0, 2.9], [4.2, 0.9], [5.4, 2.0], [4.2, 2.9], [2.2, 0.0], [3.4, 0.0]] }
    ];
    var COLORES = [
      { relleno: "#e7f2e8", borde: "#2e7d32" },
      { relleno: "#fdf1dc", borde: "#e8a13d" },
      { relleno: "#efe4f7", borde: "#6b3fa0" },
      { relleno: "#fbe9e7", borde: "#b3261e" },
      { relleno: "#e0f2f1", borde: "#00695c" },
      { relleno: "#f3f0d2", borde: "#8a7d1c" }
    ];
    var presetActual = 0, version = "recursiva";

    function g() { return GRAFOS[presetActual]; }
    function paramsActuales() { return { G: g().G, nombres: g().nombres, pos: g().pos, version: version }; }
    function conjunto(ids, nom) { return "{" + ids.map(function (k) { return nom[k]; }).join(", ") + "}"; }
    function arreglo(ids, nom) { return ids.length === 0 ? "[ ]" : "[" + ids.map(function (k) { return nom[k]; }).join(", ") + "]"; }

    function dibujar(a) {
      var p = g();
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: p.pos, G: p.G, nombres: p.nombres,
        nodo: function (i) {
          var s = { relleno: "#ffffff", borde: "#9aa3af", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (a) {
            if (a.d[i] !== null && a.d[i] > 0) { s.nota = a.d[i] + "/" + a.low[i]; }
            if (a.d[i] > 0) { s.relleno = "#e3edf8"; s.borde = "#1f5fa8"; }
            if (a.formando.indexOf(i) >= 0) { s.relleno = "#ffe9a8"; s.borde = "#e8a13d"; }
            if (a.compDe[i] >= 0) {
              var c = COLORES[a.compDe[i] % COLORES.length];
              s.relleno = c.relleno; s.borde = c.borde;
            }
            if (a.foco === i) { s.borde = "#24292f"; s.grueso = 4; }
          }
          return s;
        },
        arista: function (u, v) {
          var e = { color: "gris", grueso: 1.6 };
          if (a) {
            var t = 0, enArbol = false;
            while (t < a.arbol.length) { if (a.arbol[t][0] === u && a.arbol[t][1] === v) { enArbol = true; } t = t + 1; }
            if (enArbol) { e = { color: "azul", grueso: 2.6 }; }
            if (a.sube && a.sube[0] === u && a.sube[1] === v) { e = { color: "morado", grueso: 3.6 }; }
            else if (a.usa && a.usa[0] === u && a.usa[1] === v) { e = { color: "morado", grueso: 3.6 }; }
            else if (a.baja && a.baja[0] === u && a.baja[1] === v) { e = { color: "verde", grueso: 3.6 }; }
            else if (a.mira && a.mira[0] === u && a.mira[1] === v) { e = { color: "ambar", grueso: 3.4 }; }
          }
          return e;
        }
      });
    }

    function alPintar(e) {
      var a = e.actual, p = g(), nom = p.nombres, n = nom.length;
      dibujar(a);
      document.getElementById("ver-pila").textContent = a ? arreglo(a.pila, nom) : "[ ]";
      var enP = [], i = 0;
      while (a && i < n) { if (a.enPila[i] === true) { enP.push(i); } i = i + 1; }
      document.getElementById("ver-enpila").textContent = enP.length > 0 ? conjunto(enP, nom) : "ninguno";
      var rot, txt;
      if (version === "pila") {
        rot = "llamadas";
        txt = a && a.llamadas.length > 0
          ? "[" + a.llamadas.map(function (q) { return "[" + nom[q[0]] + ", " + q[1] + "]"; }).join(", ") + "]" : "[ ]";
      } else {
        rot = "Pila de llamadas";
        txt = a && a.llamadas.length > 0 ? a.llamadas.map(function (k) { return "visit(" + nom[k] + ")"; }).join(" › ") : "vacía";
      }
      document.getElementById("rot-llamadas").textContent = rot;
      document.getElementById("ver-llamadas").textContent = txt;

      var filas = "";
      i = 0;
      while (i < n) {
        var dd = a ? a.d[i] : null, ll = a ? a.low[i] : null, ep = a ? a.enPila[i] : null;
        filas += "<tr><td>" + nom[i] + "</td><td>" + (dd === null ? "–" : dd) + "</td><td>" + (ll === null ? "–" : ll) +
                 "</td><td>" + (ep === null ? "–" : (ep ? "True" : "False")) + "</td><td>" +
                 (a && a.compDe[i] >= 0 ? a.compDe[i] + 1 : "–") + "</td></tr>";
        i = i + 1;
      }
      document.getElementById("cuerpo-tabla").innerHTML = filas;

      var cuerpo = "", m;
      for (m = 0; m < e.k; m = m + 1) {
        var q = e.pasos[m];
        if (q.cierre !== undefined) {
          cuerpo += "<tr><td>" + q.numero + "</td><td>" + nom[q.cerradoPor] + "</td><td>" + conjunto(q.cierre, nom) +
                    "</td><td>" + q.cierre.length + "</td></tr>";
        }
      }
      document.getElementById("cuerpo-comp").innerHTML = cuerpo !== "" ? cuerpo :
        "<tr><td colspan='4' class='pend'>Ejecute: cada vez que low[u] == d[u] se agrega una fila.</td></tr>";

      var obs = document.getElementById("observacion"), html = "";
      if (a && a.hecho) {
        var comps = a.resultado, entre = EJERCICIO.condensacion(p.G, comps), rev = [], c = comps.length - 1;
        while (c >= 0) { rev.push("C" + (c + 1) + " " + conjunto(comps[c], nom)); c = c - 1; }
        var vistas = {}, flechas = [];
        entre.forEach(function (x) {
          var clave = x[2] + "-" + x[3];
          if (!vistas[clave]) { vistas[clave] = true; flechas.push(nom[x[0]] + " → " + nom[x[1]] + " (C" + (x[2] + 1) + " → C" + (x[3] + 1) + ")"); }
        });
        html = "<b>El orden de cierre, leído al revés:</b> " + rev.join(", ") + ". ";
        html += flechas.length > 0
          ? "Las flechas entre componentes son " + flechas.join("; ") + ". En cada una el componente de origen se cierra después que el de llegada, así que leída al revés la lista deja el origen antes: es un orden topológico del grafo de componentes."
          : "No hay flechas entre componentes, así que cualquier orden sirve.";
      }
      obs.className = html === "" ? "veredicto" : "veredicto bien";
      obs.innerHTML = html;
      document.getElementById("ver-n").textContent = n;
    }

    function chipsDe(v) {
      return v === "pila"
        ? [{ campo: "s", rotulo: "s" }, { campo: "u", rotulo: "u" }, { campo: "i", rotulo: "i" }, { campo: "v", rotulo: "v" },
           { campo: "p", rotulo: "p" }, { campo: "w", rotulo: "w" }, { campo: "reloj", rotulo: "reloj[0]", clase: "cuenta" }]
        : [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "w", rotulo: "w" },
           { campo: "reloj", rotulo: "reloj[0]", clase: "cuenta" }];
    }

    function arrancar() {
      var ids = ["btn-paso", "btn-auto", "btn-fin", "btn-reiniciar"], t = 0;
      while (t < ids.length) {
        var b = document.getElementById(ids[t]);
        b.parentNode.replaceChild(b.cloneNode(true), b);
        t = t + 1;
      }
      Motor.iniciar({
        codigo: EJERCICIO.codigoDe(version), simular: EJERCICIO.simular,
        chips: chipsDe(version), paramsIniciales: paramsActuales(), alPintar: alPintar
      });
    }

    arrancar();
    document.getElementById("ver-texto").textContent = g().texto;

    Motor.prediccionNumerica(function (valor, params) {
      var pasos = EJERCICIO.simular(params), comps = pasos[pasos.length - 1].resultado, n = params.G.length;
      var nom = params.nombres;
      var lista = comps.map(function (c) { return conjunto(c, nom); }).join(", ");
      if (valor === comps.length) {
        return { ok: true, msg: "Correcto: " + comps.length + ". " + lista + ". Es el número de veces que se ejecuta la línea " + (version === "pila" ? 36 : 34) + "." };
      }
      if (valor === n) {
        return { ok: false, msg: "Ese es el número de vértices: cada vértice quedaría solo, lo que pasa únicamente si el grafo no tiene ningún ciclo. Busque los ciclos; todos los vértices de un ciclo van en el mismo componente." };
      }
      if (valor === 1) {
        return { ok: false, msg: "Con un solo componente, de cualquier vértice se llegaría a cualquier otro y de vuelta. Busque un vértice del que no se pueda regresar." };
      }
      return { ok: false, msg: "No coincide. Marque los ciclos del dibujo: los vértices de un mismo ciclo van juntos, y los que no están en ningún ciclo con otros forman un componente de un solo vértice." };
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        document.getElementById("ver-texto").textContent = g().texto;
        Motor.limpiarVeredicto();
        Motor.reiniciar(paramsActuales());
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        version = btn.getAttribute("data-version");
        Motor.limpiarVeredicto();
        arrancar();
      });
    });
  })();
}
