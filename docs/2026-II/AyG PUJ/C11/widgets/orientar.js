/* Ejercicio interactivo: orientar las calles de una ciudad, UVa 610 (clase 11).
   La simulacion reproduce linea por linea descubrir, orientar_aux con orientar
   (recursiva) y orientar_desde con orientar_con_pila (pila explicita), tal como
   estan en uva610_street_directions.py. Las intersecciones van de 1 a n. */
var EJERCICIO = (function () {
  var GRAFOS = [
    { boton: "Seis intersecciones, una calle sin alternativa",
      texto: "Dos manzanas triangulares unidas por una sola calle.",
      n: 6,
      aristas: [[1, 2], [1, 3], [2, 3], [3, 4], [4, 5], [4, 6], [5, 6]],
      pos: [[0.0, 1.8], [0.0, 0.2], [1.1, 1.0], [2.3, 1.0], [3.4, 1.8], [3.4, 0.2]] },
    { boton: "Ocho intersecciones, dos sin alternativa",
      texto: "Una manzana cuadrada, un triángulo colgado de ella y una intersección en punta.",
      n: 8,
      aristas: [[1, 2], [1, 4], [2, 3], [3, 4], [4, 5], [5, 6], [5, 7], [6, 7], [7, 8]],
      pos: [[0.0, 1.9], [1.2, 1.9], [1.2, 0.5], [0.0, 0.5], [2.4, 1.2], [3.6, 2.0], [3.6, 0.4], [4.8, 0.4]] },
    { boton: "Siete intersecciones, todas convertibles",
      texto: "Un anillo de siete intersecciones con dos atajos en diagonal.",
      n: 7,
      aristas: [[1, 2], [1, 4], [1, 7], [2, 3], [2, 6], [3, 4], [4, 5], [5, 6], [6, 7]],
      pos: [[1.3, 2.9], [2.6, 2.4], [3.1, 1.1], [2.2, 0.1], [0.9, 0.0], [0.0, 1.0], [0.1, 2.3]] }
  ];

  var COMUN = [
    { txt: "def descubrir(u, reloj, d, low):", num: null },
    { txt: "    reloj[0] = reloj[0] + 1",      num: 1, bloque: 1 },
    { txt: "    d[u] = reloj[0]",              num: 2, bloque: 1 },
    { txt: "    low[u] = reloj[0]",            num: 3, bloque: 1 },
    { txt: "",                                 num: null }
  ];

  var CODIGOS = {
    recursiva: COMUN.concat([
      { txt: "def orientar_aux(G, u, entrada, reloj, d, low, salida):", num: null },
      { txt: "    descubrir(u, reloj, d, low)",                   num: 4, bloque: 2 },
      { txt: "    for v, i in G[u]:",                             num: 5, bloque: 2 },
      { txt: "        if d[v] == 0:",                             num: 6, bloque: 2 },
      { txt: "            salida.append((u, v))",                 num: 7, bloque: 2 },
      { txt: "            orientar_aux(G, v, i, reloj, d, low, salida)", num: 8, bloque: 2 },
      { txt: "            low[u] = min(low[u], low[v])",          num: 9, bloque: 2 },
      { txt: "            if low[v] > d[u]:",                     num: 10, bloque: 2 },
      { txt: "                salida.append((v, u))",             num: 11, bloque: 2 },
      { txt: "        elif i != entrada and d[v] < d[u]:",        num: 12, bloque: 2 },
      { txt: "            salida.append((u, v))",                 num: 13, bloque: 2 },
      { txt: "            low[u] = min(low[u], d[v])",            num: 14, bloque: 2 },
      { txt: "",                                                  num: null },
      { txt: "def orientar(G):",                                  num: null },
      { txt: "    d = {}",                                        num: 15 },
      { txt: "    low = {}",                                      num: 16 },
      { txt: "    for u in G:",                                   num: 17 },
      { txt: "        d[u] = 0",                                  num: 18 },
      { txt: "        low[u] = 0",                                num: 19 },
      { txt: "    reloj = [0]",                                   num: 20 },
      { txt: "    salida = []",                                   num: 21 },
      { txt: "    for s in G:",                                   num: 22 },
      { txt: "        if d[s] == 0:",                             num: 23 },
      { txt: "            orientar_aux(G, s, -1, reloj, d, low, salida)", num: 24 },
      { txt: "    return salida",                                 num: 25 }
    ]),
    pila: COMUN.concat([
      { txt: "def orientar_desde(G, s, reloj, d, low, salida):", num: null },
      { txt: "    descubrir(s, reloj, d, low)",                  num: 4, bloque: 2 },
      { txt: "    llamadas = [[s, -1, 0]]",                      num: 5, bloque: 2 },
      { txt: "    while len(llamadas) > 0:",                     num: 6, bloque: 2 },
      { txt: "        u, entrada, k = llamadas[-1]",             num: 7, bloque: 2 },
      { txt: "        if k < len(G[u]):",                        num: 8, bloque: 2 },
      { txt: "            llamadas[-1][2] = k + 1",              num: 9, bloque: 2 },
      { txt: "            v, i = G[u][k]",                       num: 10, bloque: 2 },
      { txt: "            if d[v] == 0:",                        num: 11, bloque: 2 },
      { txt: "                salida.append((u, v))",            num: 12, bloque: 2 },
      { txt: "                descubrir(v, reloj, d, low)",      num: 13, bloque: 2 },
      { txt: "                llamadas.append([v, i, 0])",       num: 14, bloque: 2 },
      { txt: "            elif i != entrada and d[v] < d[u]:",   num: 15, bloque: 2 },
      { txt: "                salida.append((u, v))",            num: 16, bloque: 2 },
      { txt: "                low[u] = min(low[u], d[v])",       num: 17, bloque: 2 },
      { txt: "        else:",                                    num: null },
      { txt: "            llamadas.pop()",                       num: 18, bloque: 2 },
      { txt: "            if len(llamadas) > 0:",                num: 19, bloque: 2 },
      { txt: "                p = llamadas[-1][0]",              num: 20, bloque: 2 },
      { txt: "                low[p] = min(low[p], low[u])",     num: 21, bloque: 2 },
      { txt: "                if low[u] > d[p]:",                num: 22, bloque: 2 },
      { txt: "                    salida.append((u, p))",        num: 23, bloque: 2 },
      { txt: "",                                                 num: null },
      { txt: "def orientar_con_pila(G):",                        num: null },
      { txt: "    d = {}",                                       num: 24 },
      { txt: "    low = {}",                                     num: 25 },
      { txt: "    for u in G:",                                  num: 26 },
      { txt: "        d[u] = 0",                                 num: 27 },
      { txt: "        low[u] = 0",                               num: 28 },
      { txt: "    reloj = [0]",                                  num: 29 },
      { txt: "    salida = []",                                  num: 30 },
      { txt: "    for s in G:",                                  num: 31 },
      { txt: "        if d[s] == 0:",                            num: 32 },
      { txt: "            orientar_desde(G, s, reloj, d, low, salida)", num: 33 },
      { txt: "    return salida",                                num: 34 }
    ])
  };

  function codigoDe(version) { return CODIGOS[version]; }

  /* construir del deck, con las intersecciones de 1 a n. */
  function construir(n, aristas) {
    var G = [], i = 0;
    while (i <= n) { G.push([]); i = i + 1; }
    i = 0;
    while (i < aristas.length) {
      G[aristas[i][0]].push([aristas[i][1], i]);
      G[aristas[i][1]].push([aristas[i][0], i]);
      i = i + 1;
    }
    return G;
  }

  /* Los puentes, para contrastar con las calles que quedan de doble via. */
  function puentes(n, aristas) {
    var G = construir(n, aristas);
    var d = [], low = [], esPuente = [], reloj = 0, i = 0;
    while (i <= n) { d.push(0); low.push(0); i = i + 1; }
    i = 0;
    while (i < aristas.length) { esPuente.push(false); i = i + 1; }
    function aux(u, entrada) {
      reloj = reloj + 1;
      d[u] = reloj;
      low[u] = reloj;
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j][0], idx = G[u][j][1];
        if (d[v] === 0) {
          aux(v, idx);
          low[u] = Math.min(low[u], low[v]);
          if (low[v] > d[u]) { esPuente[idx] = true; }
        } else if (idx !== entrada) {
          low[u] = Math.min(low[u], d[v]);
        }
        j = j + 1;
      }
    }
    i = 1;
    while (i <= n) { if (d[i] === 0) { aux(i, -1); } i = i + 1; }
    var lista = [];
    i = 0;
    while (i < aristas.length) { if (esPuente[i]) { lista.push(i); } i = i + 1; }
    return { d: d, low: low, esPuente: esPuente, puentes: lista };
  }

  function simular(params) {
    var n = params.n, aristas = params.aristas, version = params.version;
    var G = construir(n, aristas);
    var pasos = [], d = [], low = [], salida = [], reloj = 0;
    var marcos = [], llamadas = [], devuelto = null;
    var loc = { u: null, v: null, i: null, entrada: null, k: null, s: null, p: null };
    var t = 0;
    while (t <= n) { d.push(0); low.push(0); t = t + 1; }

    function snap(linea, sobre, msg) {
      var fr = (version === "recursiva" && marcos.length > 0) ? marcos[marcos.length - 1] : loc;
      var c = sobre !== null && sobre !== undefined ? sobre : fr;
      pasos.push({
        linea: linea,
        u: c.u === undefined ? null : c.u,
        v: c.v === undefined ? null : c.v,
        i: c.i === undefined ? null : c.i,
        entrada: c.entrada === undefined ? null : c.entrada,
        k: c.k === undefined ? null : c.k,
        p: loc.p, s: loc.s, reloj: reloj,
        d: d.slice(), low: low.slice(),
        salida: salida.map(function (x) { return x.slice(); }),
        pila: version === "recursiva"
          ? marcos.map(function (f) { return [f.u, f.entrada]; })
          : llamadas.map(function (x) { return x.slice(); }),
        devuelto: devuelto === null ? null : devuelto.map(function (x) { return x.slice(); }),
        mira: c.i === undefined || c.i === null ? null : c.i,
        msg: msg || ""
      });
    }

    /* descubrir, lineas 1 a 3. */
    function descubrir(w, marco) {
      reloj = reloj + 1;
      snap(1, marco);
      d[w] = reloj;
      snap(2, marco);
      low[w] = reloj;
      snap(3, marco, "La intersección " + w + " recibe d = low = " + reloj + ".");
    }

    function textoPuente(lowV, dU, u, v) {
      return lowV > dU
        ? "low[" + v + "] = " + lowV + " > d[" + u + "] = " + dU +
          ": nada del subárbol de " + v + " vuelve a " + u + " ni más arriba. La calle " + u + "–" + v +
          " es puente y se emite también al revés, así que queda de doble vía."
        : "low[" + v + "] = " + lowV + " ≤ d[" + u + "] = " + dU +
          ": el subárbol de " + v + " vuelve a " + u + " o más arriba, así que hay otro camino de regreso. La calle queda de una vía.";
    }

    function textoRetroceso(u, v, idx, entrada) {
      var t2;
      if (idx === entrada) {
        t2 = "La calle " + idx + " es la de entrada a " + u + ": se descarta comparando identificadores.";
      } else if (d[v] >= d[u]) {
        t2 = "d[" + v + "] = " + d[v] + " no es menor que d[" + u + "] = " + d[u] +
          ": esta es la mirada desde el ancestro, y la calle ya se emitió desde el otro extremo. Sin esta comparación saldría dos veces.";
      } else {
        t2 = "d[" + v + "] = " + d[v] + " < d[" + u + "] = " + d[u] +
          ": retroceso del descendiente al ancestro. Se emite " + u + " → " + v + ".";
      }
      return t2;
    }

    function orientarAux(u, entrada) {
      var fr = { u: u, entrada: entrada, v: null, i: null, k: null };
      marcos.push(fr);
      snap(4, fr, entrada === -1 ? "Arranca la profundidad en la intersección " + u + "." : "");
      descubrir(u, fr);
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j][0], idx = G[u][j][1];
        fr.v = v;
        fr.i = idx;
        snap(5, fr);
        snap(6, fr);
        if (d[v] === 0) {
          salida.push([u, v]);
          snap(7, fr, "Se emite " + u + " → " + v + ": calle de árbol, del padre al hijo.");
          snap(8, fr, "Se llama orientar_aux sobre " + v + ".");
          orientarAux(v, idx);
          fr.v = v;
          fr.i = idx;
          low[u] = Math.min(low[u], low[v]);
          snap(9, fr, "Al volver de " + v + ", low[" + u + "] queda en " + low[u] + ".");
          snap(10, fr, textoPuente(low[v], d[u], u, v));
          if (low[v] > d[u]) {
            salida.push([v, u]);
            snap(11, fr, "Se emite también " + v + " → " + u + ".");
          }
        } else {
          snap(12, fr, textoRetroceso(u, v, idx, entrada));
          if (idx !== entrada && d[v] < d[u]) {
            salida.push([u, v]);
            snap(13, fr, "Se emite " + u + " → " + v + ".");
            low[u] = Math.min(low[u], d[v]);
            snap(14, fr, "low[" + u + "] baja a " + low[u] + ".");
          }
        }
        j = j + 1;
      }
      fr.v = null;
      fr.i = null;
      marcos.pop();
    }

    function orientarDesde(s) {
      loc.u = null;
      loc.v = null;
      loc.i = null;
      loc.entrada = null;
      loc.k = null;
      snap(4, loc, "Arranca la profundidad en la intersección " + s + ".");
      descubrir(s, loc);
      llamadas = [[s, -1, 0]];
      snap(5, loc, "La lista llamadas arranca con [" + s + ", -1, 0].");
      var seguir = true;
      while (seguir) {
        snap(6, loc);
        if (llamadas.length === 0) {
          seguir = false;
        } else {
          var terna = llamadas[llamadas.length - 1];
          var u = terna[0], entrada = terna[1], k = terna[2];
          loc.u = u;
          loc.entrada = entrada;
          loc.k = k;
          snap(7, loc);
          snap(8, loc);
          if (k < G[u].length) {
            terna[2] = k + 1;
            loc.k = k + 1;
            snap(9, loc);
            var v = G[u][k][0], idx = G[u][k][1];
            loc.v = v;
            loc.i = idx;
            snap(10, loc);
            snap(11, loc);
            if (d[v] === 0) {
              salida.push([u, v]);
              snap(12, loc, "Se emite " + u + " → " + v + ": calle de árbol.");
              snap(13, loc, "Se descubre " + v + ".");
              descubrir(v, loc);
              llamadas.push([v, idx, 0]);
              snap(14, loc, "Se apila [" + v + ", " + idx + ", 0].");
            } else {
              snap(15, loc, textoRetroceso(u, v, idx, entrada));
              if (idx !== entrada && d[v] < d[u]) {
                salida.push([u, v]);
                snap(16, loc, "Se emite " + u + " → " + v + ".");
                low[u] = Math.min(low[u], d[v]);
                snap(17, loc, "low[" + u + "] baja a " + low[u] + ".");
              }
            }
          } else {
            llamadas.pop();
            loc.v = null;
            loc.i = null;
            snap(18, loc, "La intersección " + u + " ya revisó todas sus calles: sale de la lista.");
            snap(19, loc);
            if (llamadas.length > 0) {
              var p = llamadas[llamadas.length - 1][0];
              loc.p = p;
              snap(20, loc, "Arriba quedó " + p + ", el padre de " + u + ".");
              low[p] = Math.min(low[p], low[u]);
              snap(21, loc, "low[" + p + "] queda en " + low[p] + ".");
              snap(22, loc, textoPuente(low[u], d[p], p, u));
              if (low[u] > d[p]) {
                salida.push([u, p]);
                snap(23, loc, "Se emite también " + u + " → " + p + ".");
              }
              loc.p = null;
            }
          }
        }
      }
      loc.u = null;
      loc.entrada = null;
      loc.k = null;
    }

    var base = version === "recursiva" ? 15 : 24;
    snap(base);
    snap(base + 1);
    var w = 1;
    while (w <= n) {
      loc.u = w;
      snap(base + 2);
      snap(base + 3);
      snap(base + 4);
      w = w + 1;
    }
    loc.u = null;
    snap(base + 5);
    snap(base + 6);
    var s = 1;
    while (s <= n) {
      loc.s = s;
      loc.u = s;
      snap(base + 7);
      snap(base + 8, loc, d[s] === 0
        ? "d[" + s + "] = 0: la intersección " + s + " no se ha descubierto."
        : "d[" + s + "] ya es " + d[s] + ": la profundidad anterior la alcanzó.");
      if (d[s] === 0) {
        snap(base + 9);
        if (version === "recursiva") { orientarAux(s, -1); } else { orientarDesde(s); }
        loc.u = null;
        loc.v = null;
        loc.i = null;
      }
      s = s + 1;
    }
    loc.s = null;
    loc.u = null;
    devuelto = salida.map(function (x) { return x.slice(); });
    snap(base + 10, loc, "La salida tiene " + salida.length + " líneas para " + aristas.length +
      (aristas.length === 1 ? " calle." : " calles."));
    return pasos;
  }

  /* El resultado de una version: la lista de parejas orientadas. */
  function resultadoDe(n, aristas, version) {
    var pasos = simular({ n: n, aristas: aristas, version: version });
    return pasos[pasos.length - 1].salida;
  }

  /* Por calle: los sentidos emitidos y si quedo de doble via. */
  function porCalle(n, aristas, salida) {
    var filas = [], i = 0;
    while (i < aristas.length) {
      var a = aristas[i][0], b = aristas[i][1], sentidos = [], j = 0;
      while (j < salida.length) {
        if ((salida[j][0] === a && salida[j][1] === b) || (salida[j][0] === b && salida[j][1] === a)) {
          sentidos.push(salida[j][0] + " → " + salida[j][1]);
        }
        j = j + 1;
      }
      filas.push({ calle: i, a: a, b: b, sentidos: sentidos, doble: sentidos.length === 2 });
      i = i + 1;
    }
    return filas;
  }

  /* A quien se llega desde una interseccion por la ciudad ya orientada. */
  function alcanzables(n, salida, origen) {
    var ady = [], i = 0;
    while (i <= n) { ady.push([]); i = i + 1; }
    i = 0;
    while (i < salida.length) { ady[salida[i][0]].push(salida[i][1]); i = i + 1; }
    var visto = [];
    i = 0;
    while (i <= n) { visto.push(false); i = i + 1; }
    visto[origen] = true;
    var pila = [origen];
    while (pila.length > 0) {
      var u = pila.pop(), j = 0;
      while (j < ady[u].length) {
        if (!visto[ady[u][j]]) { visto[ady[u][j]] = true; pila.push(ady[u][j]); }
        j = j + 1;
      }
    }
    var lista = [];
    i = 1;
    while (i <= n) { if (visto[i]) { lista.push(i); } i = i + 1; }
    return lista;
  }

  function fuertementeConexa(n, salida) {
    var todas = true, i = 1;
    while (i <= n) {
      if (alcanzables(n, salida, i).length !== n) { todas = false; }
      i = i + 1;
    }
    return todas;
  }

  return { grafos: GRAFOS, codigoDe: codigoDe, construir: construir,
           puentes: puentes, simular: simular, resultadoDe: resultadoDe,
           porCalle: porCalle, alcanzables: alcanzables,
           fuertementeConexa: fuertementeConexa };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var presetActual = 0, version = "pila", P = null, SALIDA = null;

    function g() { return EJERCICIO.grafos[presetActual]; }

    function paramsActuales() {
      var p = g();
      return { n: p.n, aristas: p.aristas, pos: p.pos, version: version };
    }

    function dibujar(caja, a) {
      var p = g(), n = p.n, pos = p.pos;
      var ancho = 520, alto = 260, r = 16;
      var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
      while (i < n) {
        if (pos[i][0] < minX) { minX = pos[i][0]; }
        if (pos[i][0] > maxX) { maxX = pos[i][0]; }
        if (pos[i][1] < minY) { minY = pos[i][1]; }
        if (pos[i][1] > maxY) { maxY = pos[i][1]; }
        i = i + 1;
      }
      var mx = 38, my = 34;
      var esc = Math.min((ancho - 2 * mx) / (maxX - minX), (alto - 2 * my) / (maxY - minY));
      var ox = (ancho - esc * (maxX - minX)) / 2, oy = (alto - esc * (maxY - minY)) / 2;
      function X(k) { return ox + (pos[k - 1][0] - minX) * esc; }
      function Y(k) { return oy + (maxY - pos[k - 1][1]) * esc; }

      var emitidas = a ? a.salida : [];
      function sentidos(idx) {
        var a2 = p.aristas[idx][0], b2 = p.aristas[idx][1], lista = [], j = 0;
        while (j < emitidas.length) {
          if ((emitidas[j][0] === a2 && emitidas[j][1] === b2) ||
              (emitidas[j][0] === b2 && emitidas[j][1] === a2)) {
            lista.push([emitidas[j][0], emitidas[j][1]]);
          }
          j = j + 1;
        }
        return lista;
      }

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:560px'>";
      svg += "<defs>";
      svg += "<marker id='pf-gris' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#1f5fa8'/></marker>";
      svg += "<marker id='pf-rojo' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#b3261e'/></marker>";
      svg += "</defs>";
      var e = 0;
      while (e < p.aristas.length) {
        var u = p.aristas[e][0], v = p.aristas[e][1];
        var lista = sentidos(e), doble = lista.length === 2;
        var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
        if (a && a.mira === e) {
          svg += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 +
                 "' stroke='#e8a13d' stroke-width='10' opacity='0.5'/>";
        }
        if (lista.length === 0) {
          svg += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 +
                 "' stroke='#c3c9d0' stroke-width='2'/>";
        } else {
          var k = 0;
          while (k < lista.length) {
            var oa = lista[k][0], ob = lista[k][1];
            var ax = X(oa), ay = Y(oa), bx = X(ob), by = Y(ob);
            var dx = bx - ax, dy = by - ay, dd = Math.sqrt(dx * dx + dy * dy);
            var color = doble ? "rojo" : "gris", tinte = doble ? "#b3261e" : "#1f5fa8";
            if (doble) {
              var cxx = (ax + bx) / 2 - dy / dd * 16, cyy = (ay + by) / 2 + dx / dd * 16;
              var l1 = Math.sqrt((cxx - ax) * (cxx - ax) + (cyy - ay) * (cyy - ay));
              var l2 = Math.sqrt((cxx - bx) * (cxx - bx) + (cyy - by) * (cyy - by));
              svg += "<path d='M" + (ax + (cxx - ax) / l1 * (r + 2)) + "," + (ay + (cyy - ay) / l1 * (r + 2)) +
                     " Q" + cxx + "," + cyy + " " + (bx + (cxx - bx) / l2 * (r + 5)) + "," + (by + (cyy - by) / l2 * (r + 5)) +
                     "' fill='none' stroke='" + tinte + "' stroke-width='3' marker-end='url(#pf-" + color + ")'/>";
            } else {
              svg += "<line x1='" + (ax + dx / dd * (r + 2)) + "' y1='" + (ay + dy / dd * (r + 2)) +
                     "' x2='" + (bx - dx / dd * (r + 5)) + "' y2='" + (by - dy / dd * (r + 5)) +
                     "' stroke='" + tinte + "' stroke-width='2.6' marker-end='url(#pf-" + color + ")'/>";
            }
            k = k + 1;
          }
        }
        svg += "<text x='" + ((x1 + x2) / 2) + "' y='" + ((y1 + y2) / 2 - 4) +
               "' text-anchor='middle' font-size='10' font-family='ui-monospace, monospace' fill='#6b7280' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
               e + "</text>";
        e = e + 1;
      }
      var w = 1;
      while (w <= n) {
        var desc = a && a.d[w] > 0;
        var relleno = desc ? "#e3edf8" : "#ffffff", borde = desc ? "#1f5fa8" : "#d8dee6";
        var foco = a && a.pila.length > 0 && a.pila[a.pila.length - 1][0] === w;
        svg += "<circle cx='" + X(w) + "' cy='" + Y(w) + "' r='" + r + "' fill='" + relleno +
               "' stroke='" + (foco ? "#24292f" : borde) + "' stroke-width='" + (foco ? 4 : 2.4) + "'/>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + w + "</text>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) - r - 5) + "' text-anchor='middle' font-size='11' font-family='ui-monospace, monospace' fill='#24292f' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
               (desc ? a.d[w] + "/" + a.low[w] : "–/–") + "</text>";
        w = w + 1;
      }
      svg += "</svg>";
      caja.innerHTML = svg;
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(document.getElementById("panel-traza"), a);
      document.getElementById("ver-salida").textContent = a && a.salida.length > 0
        ? a.salida.map(function (x) { return x[0] + " " + x[1]; }).join("   ") : "vacía";
      document.getElementById("ver-lineas").textContent = a ? a.salida.length : 0;
      var pilaTxt;
      if (!a || a.pila.length === 0) {
        pilaTxt = "vacía";
      } else if (version === "recursiva") {
        pilaTxt = a.pila.map(function (f) { return "orientar_aux(" + f[0] + ", " + f[1] + ")"; }).join("  →  ");
      } else {
        pilaTxt = a.pila.map(function (x) { return "[" + x.join(", ") + "]"; }).join(", ");
      }
      document.getElementById("ver-pila").textContent = pilaTxt;
      document.getElementById("rot-pila").textContent = version === "recursiva" ? "Pila de llamadas" : "llamadas";
      document.getElementById("ver-msg").textContent = a && a.msg !== "" ? a.msg : "";
      if (e.terminado && a && a.devuelto !== null) { pintarTabla(a.salida); }
    }

    function pintarTabla(salida) {
      var p = g();
      var filas = EJERCICIO.porCalle(p.n, p.aristas, salida), h = "", i = 0;
      var dobles = [];
      while (i < filas.length) {
        var f = filas[i];
        var esP = P.esPuente[f.calle];
        var coincide = f.doble === esP;
        h += "<tr><td>" + f.calle + "</td><td>" + f.a + "–" + f.b + "</td><td>" +
             (f.sentidos.length === 0 ? "aún no" : f.sentidos.join("<br>")) + "</td><td>" +
             (f.doble ? "<b style='color:#b3261e'>doble vía</b>" : "una vía") + "</td><td>" +
             (esP ? "sí" : "no") + "</td><td>" + (coincide ? "✓" : "✗") + "</td></tr>";
        if (f.doble) { dobles.push(f.calle); }
        i = i + 1;
      }
      document.getElementById("cuerpo-calles").innerHTML = h;
      var todas = true;
      i = 0;
      while (i < filas.length) {
        if (filas[i].doble !== P.esPuente[filas[i].calle]) { todas = false; }
        i = i + 1;
      }
      document.getElementById("ver-coincidencia").textContent = todas
        ? (dobles.length === 0
            ? "Ninguna calle quedó de doble vía, y el grafo no tiene ningún puente: la ciudad entera se puede orientar. Es el resultado de Robbins leído al revés."
            : "Las calles de doble vía son exactamente las " + dobles.length + " que son puente: " +
              dobles.map(function (c) { return p.aristas[c][0] + "–" + p.aristas[c][1]; }).join(", ") +
              ". Ninguna otra lo necesitaba, así que la orientación convierte el máximo número de calles.")
        : "Hay filas con ✗: la orientación y la lista de puentes no coinciden.";
      armarAlcance(salida);
    }

    function armarAlcance(salida) {
      var p = g(), h = "", i = 1;
      while (i <= p.n) {
        h += "<button type='button' class='pieza' data-origen='" + i + "'>" + i + "</button>";
        i = i + 1;
      }
      document.getElementById("origenes").innerHTML = h;
      var fuerte = EJERCICIO.fuertementeConexa(p.n, salida);
      document.getElementById("ver-fuerte").textContent = fuerte
        ? "Desde cada una de las " + p.n + " intersecciones se llega a las otras " + (p.n - 1) +
          ": el grafo dirigido es fuertemente conexo, que es lo que pide el enunciado."
        : "Hay intersecciones desde las que no se llega a todas.";
      Array.prototype.forEach.call(document.querySelectorAll("#origenes button"), function (b) {
        b.addEventListener("click", function () {
          var o = parseInt(b.getAttribute("data-origen"), 10);
          var lista = EJERCICIO.alcanzables(p.n, salida, o);
          var v = document.getElementById("veredicto-alcance");
          v.className = lista.length === p.n ? "veredicto bien" : "veredicto mal";
          v.textContent = "Desde la " + o + " se llega a " + lista.length + " intersecciones: " +
            lista.join(", ") + (lista.length === p.n ? ". Están todas." : ". Faltan algunas.");
        });
      });
    }

    function marcarBotones(id, atributo, valor) {
      Array.prototype.forEach.call(document.querySelectorAll("#" + id + " button"), function (b) {
        if (b.getAttribute(atributo) === valor) { b.classList.add("primario"); } else { b.classList.remove("primario"); }
      });
    }

    function arrancar() {
      var ids = ["btn-paso", "btn-auto", "btn-fin", "btn-reiniciar"], t = 0;
      while (t < ids.length) {
        var b = document.getElementById(ids[t]);
        b.parentNode.replaceChild(b.cloneNode(true), b);
        t = t + 1;
      }
      var chips = version === "recursiva"
        ? [{ campo: "u", rotulo: "u" }, { campo: "entrada", rotulo: "entrada" }, { campo: "v", rotulo: "v" },
           { campo: "i", rotulo: "i" }, { campo: "reloj", rotulo: "reloj", clase: "cuenta" }]
        : [{ campo: "u", rotulo: "u" }, { campo: "entrada", rotulo: "entrada" }, { campo: "k", rotulo: "k" },
           { campo: "v", rotulo: "v" }, { campo: "i", rotulo: "i" }, { campo: "reloj", rotulo: "reloj", clase: "cuenta" }];
      Motor.iniciar({
        codigo: EJERCICIO.codigoDe(version), simular: EJERCICIO.simular,
        chips: chips, paramsIniciales: paramsActuales(), alPintar: alPintar
      });
    }

    function armar() {
      var p = g();
      P = EJERCICIO.puentes(p.n, p.aristas);
      SALIDA = EJERCICIO.resultadoDe(p.n, p.aristas, "pila");
      document.getElementById("ver-texto").textContent = p.texto;
      document.getElementById("ver-datos").textContent =
        p.n + " intersecciones y " + p.aristas.length + " calles de doble vía: " +
        p.aristas.map(function (a, k) { return k + ": " + a[0] + "–" + a[1]; }).join("   ");
      dibujar(document.getElementById("panel-grafo"), null);
      document.getElementById("cuerpo-calles").innerHTML = "";
      document.getElementById("ver-coincidencia").textContent =
        "Ejecute hasta el final para llenar la tabla.";
      document.getElementById("origenes").innerHTML = "";
      document.getElementById("ver-fuerte").textContent = "";
      var v = document.getElementById("veredicto-alcance");
      v.className = "veredicto";
      v.textContent = "";
      Motor.limpiarVeredicto();
      Motor.reiniciar(paramsActuales());
    }

    arrancar();
    armar();

    Motor.prediccionNumerica(function (valor, params) {
      var p = g();
      var total = p.aristas.length + P.puentes.length, res;
      if (valor === total) {
        res = { ok: true, msg: "Correcto: " + total + ". Son " + p.aristas.length +
          " calles, y las " + P.puentes.length + " que son puente salen en los dos sentidos. " +
          "Cada calle que no es puente sale una sola vez porque la comparación d[v] < d[u] del elif deja pasar una sola de las dos miradas." };
      } else if (valor === p.aristas.length) {
        res = { ok: false, msg: "Ese es el número de calles, " + p.aristas.length +
          ". Las que son puente no se pueden orientar y salen dos veces, así que la salida tiene " + total + " líneas." };
      } else if (valor === 2 * p.aristas.length) {
        res = { ok: false, msg: "Eso sería emitir cada calle en los dos sentidos, y entonces no se convertiría ninguna. Solo los puentes van dobles: " + total + " líneas." };
      } else {
        res = { ok: false, msg: "No coincide. Cuente las calles y agregue una línea extra por cada puente: " + total + "." };
      }
      return res;
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        marcarBotones("presets-grafo", "data-preset", String(presetActual));
        armar();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (btn) {
      btn.addEventListener("click", function () {
        version = btn.getAttribute("data-version");
        marcarBotones("presets-version", "data-version", version);
        arrancar();
      });
    });
  })();
}
