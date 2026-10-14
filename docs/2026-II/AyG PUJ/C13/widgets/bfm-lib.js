/* Piezas comunes de los ejercicios de la clase 13: el dibujo de grafos, el
   texto exacto de bfm1.cpp a bfm5.cpp (la funcion bellmanFord de cada archivo,
   con la numeracion de linea del archivo) y la simulacion de cada version,
   linea por linea. Cada pagina trae sus grafos y su interfaz. */

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
    var ancho = o.ancho || 560, alto = o.alto || 300, mx = 56, my = 40;
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

    var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:" + (o.maxAncho || 640) + "px'>";
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


var BFM = (function () {
  var INT_MAX = 2147483647;

  var FUENTES = {
 "bfm1": {
  "desde": 22,
  "lineas": [
   "bool bellmanFord(int s){",
   "  int i, j, u, v, peso;",
   "  bool ans = true;",
   "",
   "  for(i = 0; i < n; ++i){",
   "    p[i] = -1;",
   "    for(j = 0; j < n; ++j)",
   "      d[i][j] = INT_MAX;",
   "  }",
   "",
   "  d[0][s] = 0;",
   "  for(i = 1; i <= n - 1; ++i){",
   "    for(j = 0; j < n; ++j)",
   "\td[i][j] = d[i - 1][j];",
   "    for(u = 0; u < n; u++){",
   "      for(j = 0; j < G[u].size(); ++j){",
   "\tv = G[u][j].first;",
   "\tpeso = G[u][j].second;",
   "\tif(d[i - 1][u] != INT_MAX && d[i - 1][u] + peso < d[i][v]){",
   "\t  d[i][v] = d[i - 1][u] + peso;",
   "\t  p[v] = u;",
   "\t}",
   "      }",
   "    }",
   "  }",
   "",
   "  u = 0;",
   "  while(ans && u < n){",
   "    i = 0;",
   "    while(ans && i < G[u].size()){",
   "      v = G[u][i].first;",
   "      peso = G[u][i].second;",
   "      if(d[n - 1][u] != INT_MAX && d[n - 1][u] + peso < d[n - 1][v])",
   "\tans = false;",
   "      i += 1;",
   "    }",
   "    u += 1;",
   "  }",
   "",
   "  return ans;",
   "}"
  ]
 },
 "bfm2": {
  "desde": 22,
  "lineas": [
   "bool bellmanFord(int s){",
   "  int i, j, u, v, peso;",
   "  bool ans = true;",
   "",
   "  for(i = 0; i < n; ++i){",
   "    p[i] = -1;",
   "    d[i] = INT_MAX;",
   "  }",
   "",
   "  d[s] = 0;",
   "  for(i = 1; i <= n - 1; ++i){",
   "    for(u = 0; u < n; u++){",
   "      for(j = 0; j < G[u].size(); ++j){",
   "\tv = G[u][j].first;",
   "\tpeso = G[u][j].second;",
   "\tif(d[u] != INT_MAX && d[u] + peso < d[v]){",
   "\t  d[v] = d[u] + peso;",
   "\t  p[v] = u;",
   "\t}",
   "      }",
   "    }",
   "  }",
   "",
   "  u = 0;",
   "  while(ans && u < n){",
   "    i = 0;",
   "    while(ans && i < G[u].size()){",
   "      v = G[u][i].first;",
   "      peso = G[u][i].second;",
   "      if(d[u] != INT_MAX && d[u] + peso < d[v])",
   "\tans = false;",
   "      i += 1;",
   "    }",
   "    u += 1;",
   "  }",
   "",
   "  return ans;",
   "}"
  ]
 },
 "bfm3": {
  "desde": 22,
  "lineas": [
   "bool bellmanFord(int s){",
   "  int i, j, u, v, peso, t, cur;",
   "  bool ans = true, flag = true;",
   "",
   "  for(i = 0; i < n; ++i){",
   "    p[i] = -1;",
   "    d[i] = INT_MAX;",
   "  }",
   "",
   "  d[s] = 0;",
   "  i = 0;",
   "  while(i < n){",
   "    t = -1;",
   "    for(v = 0; v < n; v++){",
   "      for(j = 0; j < adj[v].size(); ++j){",
   "\tu = adj[v][j].first;",
   "\tpeso = adj[v][j].second;",
   "\tif(d[v] != INT_MAX && d[u] > d[v] + peso){",
   "\t  d[u] = d[v] + peso;",
   "\t  p[u] = v;",
   "\t  t = v;",
   "\t}",
   "      }",
   "    }",
   "    ++i;",
   "  }",
   "",
   "  if(t != -1){",
   "    for(i = 0; i < n; ++i)",
   "      t = p[t];",
   "    cur = t;",
   "    ciclo = vector<int>();",
   "",
   "    while(cur != t || ciclo.size() == 0){",
   "      ciclo.push_back(cur);",
   "      cur = p[cur];",
   "      printf(\"aqui\\n\");",
   "    }",
   "    ans = false;",
   "  }",
   "  ",
   "  return ans;",
   "}"
  ]
 },
 "bfm4": {
  "desde": 22,
  "lineas": [
   "bool bellmanFord(int s){",
   "  int i, j, u, v, peso, t;",
   "  bool ans = true;",
   "",
   "  for(i = 0; i < n; ++i){",
   "    p[i] = -1;",
   "    d[i] = INT_MAX;",
   "  }",
   "",
   "  d[s] = 0;",
   "  t = 0;",
   "  for(i = 1; i < n && t != -1; ++i){",
   "    t = -1;",
   "    for(v = 0; v < n; v++){",
   "      for(j = 0; j < adj[v].size(); ++j){",
   "\tu = adj[v][j].first;",
   "\tpeso = adj[v][j].second;",
   "\tif(d[v] != INT_MAX && d[v] + peso < d[u]){",
   "\t  d[u] = d[v] + peso;",
   "\t  p[u] = v;",
   "\t  t = v;",
   "\t}",
   "      }",
   "    }",
   "  }",
   "",
   "  printf(\"Iteraciones realizadas: %d\\n\", i - 1);",
   "",
   "  if(t != -1){",
   "    u = 0;",
   "    while(u < n){",
   "      i = 0;",
   "      while(ans && i < adj[u].size()){",
   "\tv = adj[u][i].first;",
   "\tpeso = adj[u][i].second;",
   "\tif(d[u] + peso < d[v])",
   "\t  ans = false;",
   "\ti += 1;",
   "      }",
   "      u += 1;",
   "    }",
   "  }",
   "",
   "  return ans;",
   "}"
  ]
 },
 "bfm5": {
  "desde": 27,
  "lineas": [
   "bool bellmanFordOpt(int s){",
   "  int i, j, u, v, peso;",
   "  queue<int> cola;",
   "  bool ans = true;",
   "  ",
   "  for(i = 0; i < n; ++i){",
   "    p[i] = -1;",
   "    d[i] = INT_MAX;",
   "    enCola[i] = false;",
   "    conteo[i] = 0;",
   "  }",
   "",
   "  d[s] = 0;",
   "  cola.push(s);",
   "  enCola[s] = true;",
   "  ",
   "  while(ans && !cola.empty()){",
   "    u = cola.front();",
   "    cola.pop();",
   "    enCola[u] = false;",
   "",
   "    for(i = 0; i < adj[u].size(); ++i){",
   "      v = adj[u][i].first;",
   "      peso = adj[u][i].second;",
   "      if(d[u] != INT_MAX && d[u] + peso < d[v]){",
   "\td[v] = d[u] + peso;",
   "\tp[v] = u;",
   "",
   "\tif(!enCola[v]){",
   "\t  cola.push(v);",
   "\t  enCola[v] = true;",
   "\t  conteo[v]++;",
   "",
   "\t  //verifica si encontró un ciclo negativo",
   "\t  if(conteo[v] > n)",
   "\t    ans = false;",
   "\t}",
   "      }",
   "    }",
   "  }",
   "",
   "  return ans;",
   "}"
  ]
 }
};

  /* Lineas con sentencia (llevan numero y contador) y bandas de color. */
  var CONTABLES = {
    bfm1: [24, 26, 27, 28, 29, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 48, 49, 50, 51, 52, 53, 54, 55, 56, 58, 61],
    bfm2: [24, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 39, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 58],
    bfm3: [24, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 46, 49, 50, 51, 52, 53, 55, 56, 57, 58, 60, 63],
    bfm4: [24, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 48, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61, 65],
    bfm5: [30, 32, 33, 34, 35, 36, 39, 40, 41, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 55, 56, 57, 58, 61, 62, 68]
  };
  var BANDAS = {
    bfm1: [[26, 30, 1], [32, 46, 2], [48, 59, 3]],
    bfm2: [[26, 29, 1], [31, 43, 2], [45, 56, 3]],
    bfm3: [[26, 29, 1], [31, 47, 2], [49, 61, 3]],
    bfm4: [[26, 29, 1], [31, 46, 2], [48, 63, 3]],
    bfm5: [[32, 41, 1], [43, 66, 2]]
  };

  /* mutaciones: lista de [linea, texto que se cambia, texto nuevo]. */
  function armarCodigo(clave, mutaciones) {
    var f = FUENTES[clave], cont = CONTABLES[clave], bandas = BANDAS[clave], codigo = [], k = 0;
    while (k < f.lineas.length) {
      var linea = f.desde + k, txt = f.lineas[k], m = 0;
      while (mutaciones && m < mutaciones.length) {
        if (mutaciones[m][0] === linea) { txt = txt.replace(mutaciones[m][1], mutaciones[m][2]); }
        m = m + 1;
      }
      var e = { txt: txt, num: cont.indexOf(linea) >= 0 ? linea : null };
      var b = 0;
      while (b < bandas.length) {
        if (linea >= bandas[b][0] && linea <= bandas[b][1]) { e.bloque = bandas[b][2]; }
        b = b + 1;
      }
      codigo.push(e);
      k = k + 1;
    }
    return codigo;
  }

  function clonar(x) { return Array.isArray(x) ? x.map(clonar) : x; }

  /* snap(linea, extra): copia el estado E y lo agrega a la lista de pasos. */
  function fabricar(E, pasos) {
    return function (linea, extra) {
      var q = { linea: linea, hecho: false }, k;
      for (k in E) { q[k] = clonar(E[k]); }
      if (extra) { for (k in extra) { q[k] = extra[k]; } }
      pasos.push(q);
    };
  }

  function ceros(n) { var a = [], i = 0; while (i < n) { a.push(0); i = i + 1; } return a; }
  function matrizCeros(n) { var m = [], i = 0; while (i < n) { m.push(ceros(n)); i = i + 1; } return m; }

  function construir(n, aristas) {
    var G = [], u = 0, k = 0;
    while (u < n) { G.push([]); u = u + 1; }
    while (k < aristas.length) { G[aristas[k][0]].push([aristas[k][1], aristas[k][2]]); k = k + 1; }
    return G;
  }

  function fmt(x) { return x === INT_MAX ? "∞" : String(x).replace("-", "−"); }

  /* Lo que imprime main() cuando la funcion devolvio ans. */
  function salidaMain(ans, d, p, n, extra) {
    var s = [], i = 0;
    if (ans) {
      while (i < n) { s.push("Distancia a nodo " + i + ": " + d[i]); i = i + 1; }
      i = 0;
      while (i < n) { s.push("Predecesor nodo " + i + ": " + p[i]); i = i + 1; }
    } else {
      s.push("El grafo tiene ciclos negativos");
      if (extra) { s = s.concat(extra); }
    }
    return s;
  }

  function cerrar(pasos, snap, linea, E, resultado) {
    snap(linea, { hecho: true });
    pasos[pasos.length - 1].resultado = resultado;
    return pasos;
  }

  var LIMITE = 60000;

  /* bfm1.cpp: una fila de la matriz por ronda.
     opc.copia: "inf" escribe INT_MAX en la linea 35 en lugar de copiar la fila anterior.
     opc.rondas: cuantas rondas hace el ciclo de la linea 33 (n - 1 por omision). */
  function simBFM1(G, s, opc) {
    opc = opc || {};
    var n = G.length, pasos = [], i, j, u, v, peso, cond, mira;
    var rondas = opc.rondas === undefined ? n - 1 : opc.rondas;
    var E = { d: matrizCeros(n), p: ceros(n), ans: null, i: null, j: null, u: null, v: null, peso: null,
              mira: null, cambia: null, salida: [] };
    var snap = fabricar(E, pasos);
    function menor(a, b) { return a !== INT_MAX && a + peso < b; }
    E.ans = true; snap(24);
    for (i = 0; i < n; i++) {
      E.i = i; snap(26); E.p[i] = -1; snap(27);
      for (j = 0; j < n; j++) { E.j = j; snap(28); E.d[i][j] = INT_MAX; snap(29); }
      E.j = n;
    }
    E.i = n;
    E.d[0][s] = 0; snap(32);
    for (i = 1; i <= rondas; i++) {
      E.i = i; snap(33);
      for (j = 0; j < n; j++) { E.j = j; snap(34); E.d[i][j] = opc.copia === "inf" ? INT_MAX : E.d[i - 1][j]; snap(35); }
      E.j = n;
      for (u = 0; u < n; u++) {
        E.u = u; snap(36);
        for (j = 0; j < G[u].length; j++) {
          E.j = j; snap(37);
          v = G[u][j][0]; E.v = v; snap(38);
          peso = G[u][j][1]; E.peso = peso; snap(39);
          mira = [u, v];
          cond = menor(E.d[i - 1][u], E.d[i][v]);
          snap(40, { mira: mira });
          if (cond) {
            E.d[i][v] = E.d[i - 1][u] + peso; snap(41, { mira: mira, cambia: mira });
            E.p[v] = u; snap(42, { mira: mira, cambia: mira });
          }
        }
        E.j = G[u].length;
      }
    }
    E.i = rondas + 1;
    u = 0; E.u = 0; snap(48);
    while (E.ans && u < n) {
      E.u = u; snap(49);
      i = 0; E.i = 0; snap(50);
      while (E.ans && i < G[u].length) {
        E.i = i; snap(51);
        v = G[u][i][0]; E.v = v; snap(52);
        peso = G[u][i][1]; E.peso = peso; snap(53);
        mira = [u, v];
        cond = menor(E.d[n - 1][u], E.d[n - 1][v]);
        snap(54, { mira: mira });
        if (cond) { E.ans = false; snap(55, { mira: mira, tensa: mira }); }
        i = i + 1; E.i = i; snap(56);
      }
      u = u + 1; E.u = u; snap(58);
    }
    var fila = E.d[n - 1].slice();
    E.salida = salidaMain(E.ans, fila, E.p, n);
    return cerrar(pasos, snap, 61, E, { ans: E.ans, d: fila, p: E.p.slice(), salida: E.salida.join("\n"), matriz: clonar(E.d) });
  }

  /* bfm2.cpp: un solo vector. opc.rondas: cuantas rondas hace la linea 32. */
  function simBFM2(G, s, opc) {
    opc = opc || {};
    var n = G.length, pasos = [], i, j, u, v, peso, cond, mira;
    var rondas = opc.rondas === undefined ? n - 1 : opc.rondas;
    var E = { d: ceros(n), p: ceros(n), ans: null, i: null, j: null, u: null, v: null, peso: null,
              mira: null, cambia: null, salida: [] };
    var snap = fabricar(E, pasos);
    function menor(a, b) { return a !== INT_MAX && a + peso < b; }
    E.ans = true; snap(24);
    for (i = 0; i < n; i++) { E.i = i; snap(26); E.p[i] = -1; snap(27); E.d[i] = INT_MAX; snap(28); }
    E.i = n;
    E.d[s] = 0; snap(31);
    for (i = 1; i <= rondas; i++) {
      E.i = i; snap(32);
      for (u = 0; u < n; u++) {
        E.u = u; snap(33);
        for (j = 0; j < G[u].length; j++) {
          E.j = j; snap(34);
          v = G[u][j][0]; E.v = v; snap(35);
          peso = G[u][j][1]; E.peso = peso; snap(36);
          mira = [u, v];
          cond = menor(E.d[u], E.d[v]);
          snap(37, { mira: mira });
          if (cond) {
            E.d[v] = E.d[u] + peso; snap(38, { mira: mira, cambia: mira });
            E.p[v] = u; snap(39, { mira: mira, cambia: mira });
          }
        }
        E.j = G[u].length;
      }
    }
    E.i = rondas + 1;
    u = 0; E.u = 0; snap(45);
    while (E.ans && u < n) {
      E.u = u; snap(46);
      i = 0; E.i = 0; snap(47);
      while (E.ans && i < G[u].length) {
        E.i = i; snap(48);
        v = G[u][i][0]; E.v = v; snap(49);
        peso = G[u][i][1]; E.peso = peso; snap(50);
        mira = [u, v];
        cond = menor(E.d[u], E.d[v]);
        snap(51, { mira: mira });
        if (cond) { E.ans = false; snap(52, { mira: mira, tensa: mira }); }
        i = i + 1; E.i = i; snap(53);
      }
      u = u + 1; E.u = u; snap(55);
    }
    E.salida = salidaMain(E.ans, E.d, E.p, n);
    return cerrar(pasos, snap, 58, E, { ans: E.ans, d: E.d.slice(), p: E.p.slice(), salida: E.salida.join("\n") });
  }

  /* bfm3.cpp: n rondas y, si la ultima cambio algo, recupera el ciclo. */
  function simBFM3(G, s) {
    var n = G.length, pasos = [], i, j, u, v, peso, cond, mira;
    var E = { d: ceros(n), p: ceros(n), ans: null, flag: null, i: null, j: null, u: null, v: null, peso: null,
              t: null, cur: null, ciclo: [], mira: null, cambia: null, salida: [] };
    var snap = fabricar(E, pasos);
    E.ans = true; E.flag = true; snap(24);
    for (i = 0; i < n; i++) { E.i = i; snap(26); E.p[i] = -1; snap(27); E.d[i] = INT_MAX; snap(28); }
    E.d[s] = 0; snap(31);
    i = 0; E.i = 0; snap(32);
    while (i < n) {
      E.i = i; snap(33);
      E.t = -1; snap(34);
      for (v = 0; v < n; v++) {
        E.v = v; snap(35);
        for (j = 0; j < G[v].length; j++) {
          E.j = j; snap(36);
          u = G[v][j][0]; E.u = u; snap(37);
          peso = G[v][j][1]; E.peso = peso; snap(38);
          mira = [v, u];
          cond = E.d[v] !== INT_MAX && E.d[u] > E.d[v] + peso;
          snap(39, { mira: mira });
          if (cond) {
            E.d[u] = E.d[v] + peso; snap(40, { mira: mira, cambia: mira });
            E.p[u] = v; snap(41, { mira: mira, cambia: mira });
            E.t = v; snap(42, { mira: mira, cambia: mira });
          }
        }
        E.j = G[v].length;
      }
      E.v = n;
      i = i + 1; E.i = i; snap(46);
    }
    var cur, t = E.t, guardia = 0, ok = true;
    snap(49);
    if (E.t !== -1) {
      for (i = 0; i < n; i++) {
        E.i = i; snap(50);
        t = (t >= 0 && t < n) ? E.p[t] : 0; E.t = t; snap(51);
      }
      E.i = n;
      cur = t; E.cur = cur; snap(52);
      E.ciclo = []; snap(53);
      while ((cur !== t || E.ciclo.length === 0) && guardia < 1000) {
        snap(55);
        E.ciclo.push(cur); snap(56);
        cur = (cur >= 0 && cur < n) ? E.p[cur] : 0; E.cur = cur; snap(57);
        E.salida.push("aqui"); snap(58);
        guardia = guardia + 1;
      }
      ok = guardia < 1000;
      E.ans = false; snap(60);
    }
    var extra = ["Elementos ciclo negativo:"].concat(E.ciclo.map(String));
    var antes = E.salida.slice();
    E.salida = antes.concat(salidaMain(E.ans, E.d, E.p, n, extra));
    return cerrar(pasos, snap, 63, E, { ans: E.ans, d: E.d.slice(), p: E.p.slice(), ciclo: E.ciclo.slice(), t: t,
      salida: E.salida.join("\n"), completo: ok });
  }

  /* bfm4.cpp: se detiene cuando una ronda no cambia nada. */
  function simBFM4(G, s) {
    var n = G.length, pasos = [], i, j, u, v, peso, cond, mira;
    var E = { d: ceros(n), p: ceros(n), ans: null, i: null, j: null, u: null, v: null, peso: null, t: null,
              mira: null, cambia: null, salida: [], hechas: 0 };
    var snap = fabricar(E, pasos), cambioPorRonda = [];
    E.ans = true; snap(24);
    for (i = 0; i < n; i++) { E.i = i; snap(26); E.p[i] = -1; snap(27); E.d[i] = INT_MAX; snap(28); }
    E.d[s] = 0; snap(31);
    E.t = 0; snap(32);
    i = 1;
    while (i < n && E.t !== -1) {
      E.i = i; snap(33);
      E.t = -1; snap(34);
      for (v = 0; v < n; v++) {
        E.v = v; snap(35);
        for (j = 0; j < G[v].length; j++) {
          E.j = j; snap(36);
          u = G[v][j][0]; E.u = u; snap(37);
          peso = G[v][j][1]; E.peso = peso; snap(38);
          mira = [v, u];
          cond = E.d[v] !== INT_MAX && E.d[v] + peso < E.d[u];
          snap(39, { mira: mira });
          if (cond) {
            E.d[u] = E.d[v] + peso; snap(40, { mira: mira, cambia: mira });
            E.p[u] = v; snap(41, { mira: mira, cambia: mira });
            E.t = v; snap(42, { mira: mira, cambia: mira });
          }
        }
        E.j = G[v].length;
      }
      E.v = n;
      E.hechas = i;
      cambioPorRonda.push(E.t !== -1);
      i = i + 1;
    }
    E.i = i;
    E.salida.push("Iteraciones realizadas: " + (i - 1));
    snap(48);
    snap(50);
    if (E.t !== -1) {
      u = 0; E.u = 0; snap(51);
      while (u < n) {
        E.u = u; snap(52);
        i = 0; E.i = 0; snap(53);
        while (E.ans && i < G[u].length) {
          E.i = i; snap(54);
          v = G[u][i][0]; E.v = v; snap(55);
          peso = G[u][i][1]; E.peso = peso; snap(56);
          mira = [u, v];
          cond = ((E.d[u] + peso) | 0) < E.d[v];
          snap(57, { mira: mira });
          if (cond) { E.ans = false; snap(58, { mira: mira, tensa: mira }); }
          i = i + 1; E.i = i; snap(59);
        }
        u = u + 1; E.u = u; snap(61);
      }
    }
    var antes = E.salida.slice();
    E.salida = antes.concat(salidaMain(E.ans, E.d, E.p, n));
    return cerrar(pasos, snap, 65, E, { ans: E.ans, d: E.d.slice(), p: E.p.slice(), iteraciones: antes.length ? parseInt(antes[0].split(": ")[1], 10) : 0, cambioPorRonda: cambioPorRonda,
      salida: E.salida.join("\n") });
  }

  /* bfm5.cpp: cola de vertices cuyo d cambio. opc.sinEnCola cambia la linea 55
     por if(true). */
  function simBFM5(G, s, opc) {
    opc = opc || {};
    var n = G.length, pasos = [], i, u, v, peso, cond, mira, disparo = null, extraidos = [];
    var E = { d: ceros(n), p: ceros(n), enCola: [], conteo: ceros(n), salen: ceros(n), cola: [], ans: null,
              i: null, u: null, v: null, peso: null, mira: null, cambia: null, salida: [], disparo: null };
    for (i = 0; i < n; i++) { E.enCola.push(false); }
    var snap = fabricar(E, pasos);
    E.ans = true; snap(30);
    for (i = 0; i < n; i++) {
      E.i = i; snap(32);
      E.p[i] = -1; snap(33);
      E.d[i] = INT_MAX; snap(34);
      E.enCola[i] = false; snap(35);
      E.conteo[i] = 0; snap(36);
    }
    E.d[s] = 0; snap(39);
    E.cola.push(s); snap(40);
    E.enCola[s] = true; snap(41);
    while (E.ans && E.cola.length > 0 && pasos.length < LIMITE) {
      snap(43);
      u = E.cola[0]; E.u = u; snap(44);
      E.cola.shift(); snap(45);
      E.salen[u] = E.salen[u] + 1; extraidos.push(u);
      E.enCola[u] = false; snap(46, { sale: u });
      for (i = 0; i < G[u].length; i++) {
        E.i = i; snap(48);
        v = G[u][i][0]; E.v = v; snap(49);
        peso = G[u][i][1]; E.peso = peso; snap(50);
        mira = [u, v];
        cond = E.d[u] !== INT_MAX && E.d[u] + peso < E.d[v];
        snap(51, { mira: mira });
        if (cond) {
          E.d[v] = E.d[u] + peso; snap(52, { mira: mira, cambia: mira });
          E.p[v] = u; snap(53, { mira: mira, cambia: mira });
          var entra = opc.sinEnCola ? true : !E.enCola[v];
          snap(55, { mira: mira, cambia: mira });
          if (entra) {
            E.cola.push(v); snap(56, { mira: mira, cambia: mira });
            E.enCola[v] = true; snap(57, { mira: mira, cambia: mira });
            E.conteo[v] = E.conteo[v] + 1; snap(58, { mira: mira, cambia: mira });
            snap(61, { mira: mira, cambia: mira });
            if (E.conteo[v] > n) { E.ans = false; disparo = v; E.disparo = v; snap(62, { mira: mira, cambia: mira }); }
          }
        }
      }
      E.i = G[u].length;
    }
    var completo = pasos.length < LIMITE;
    E.salida = salidaMain(E.ans, E.d, E.p, n);
    return cerrar(pasos, snap, 68, E, { ans: E.ans, d: E.d.slice(), p: E.p.slice(), salen: E.salen.slice(),
      conteo: E.conteo.slice(), extraidos: extraidos, disparo: disparo, salida: E.salida.join("\n"), completo: completo });
  }

  function simular(clave, G, s, opc) {
    var f = { bfm1: simBFM1, bfm2: simBFM2, bfm3: simBFM3, bfm4: simBFM4, bfm5: simBFM5 }[clave];
    return f(G, s, opc);
  }
  function resumen(clave, G, s, opc) { return simular(clave, G, s, opc).pop().resultado; }

  /* Entrada de texto de un grafo, como la leen los programas. */
  function entradaDe(n, aristas) {
    return n + " " + aristas.length + "\n" + aristas.map(function (e) { return e.join(" "); }).join("\n") + "\n";
  }

  /* Ciclo que dejan los predecesores al subir n veces desde t (bfm3, bfm5). */
  function cicloDePi(p, desde, n) {
    var x = desde, i = 0, res = [], y;
    while (i < n) { x = p[x]; i = i + 1; }
    res.push(x);
    y = p[x];
    while (y !== x && res.length <= n) { res.push(y); y = p[y]; }
    return res.reverse();
  }

  return { INT_MAX: INT_MAX, armarCodigo: armarCodigo, construir: construir, fmt: fmt, simular: simular,
           resumen: resumen, entradaDe: entradaDe, cicloDePi: cicloDePi, FUENTES: FUENTES };
})();

if (typeof module !== "undefined") { module.exports = { BFM: BFM, DIB: DIB }; }
