/* Piezas comunes: grafos dirigidos con pesos, dibujo en SVG y las versiones
   de Bellman-Ford de bellman_ford.py, escritas en JavaScript para que la
   pagina las ejecute y las compare. */
var INF = Infinity;

function construir(n, aristas) {
  var G = [], i = 0;
  while (i < n) { G.push([]); i = i + 1; }
  i = 0;
  while (i < aristas.length) { G[aristas[i][0]].push([aristas[i][1], aristas[i][2]]); i = i + 1; }
  return G;
}

function nuevoDP(n, s) {
  var d = [], pi = [], i = 0;
  while (i < n) { d.push(INF); pi.push(-1); i = i + 1; }
  d[s] = 0;
  return { d: d, pi: pi };
}

function texD(x) { return x === INF ? "∞" : (x === -INF ? "−∞" : String(x).replace("-", "−")); }
function texPi(x, nom) { return x === -1 ? "–" : (nom ? nom[x] : String(x)); }
function num(w) { return String(w).replace("-", "−"); }

/* Dibujo de grafos dirigidos con pesos.
   o.pos, o.G (listas de [v, w]), o.nombres;
   o.nodo(i) -> {relleno, borde, tinta, grueso, nota, notaColor};
   o.arista(u, v, w) -> {color, grueso, trazo}. */
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

  function dibujar(o) {
    var pos = o.pos, G = o.G, nom = o.nombres, n = pos.length;
    var ancho = o.ancho || 560, alto = o.alto || 300, mx = 56, my = 40;
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
      while (j < G[p].length) { if (G[p][j][0] === q) { hay = true; } j = j + 1; }
      return hay;
    }
    function borde(k, ux, uy) {
      var a = rxDe(nom[k]);
      return 1 / Math.sqrt((ux / a) * (ux / a) + (uy / RY) * (uy / RY));
    }
    function etiqueta(x, y, w, color) {
      return "<text x='" + x + "' y='" + (y + 3.5) + "' text-anchor='middle' font-size='11' font-weight='700' " +
             "fill='" + color + "' stroke='#ffffff' stroke-width='3.2' paint-order='stroke'>" + num(w) + "</text>";
    }

    var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:" + (o.maxAncho || 680) + "px'>";
    svg += "<defs>";
    var c;
    for (c in COL) {
      svg += "<marker id='ah-" + c + "' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'>" +
             "<path d='M0,0 L0,6 L9,3 z' fill='" + COL[c] + "'/></marker>";
    }
    svg += "</defs>";

    var textos = "";
    var u = 0, j;
    while (u < n) {
      j = 0;
      while (j < G[u].length) {
        var v = G[u][j][0], w = G[u][j][1];
        var e = o.arista(u, v, w);
        var dash = e.trazo ? " stroke-dasharray='" + e.trazo + "'" : "";
        var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
        var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
        var pie = "' fill='none' stroke='" + COL[e.color] + "' stroke-width='" + e.grueso + "'" + dash +
                  " marker-end='url(#ah-" + e.color + ")'/>";
        var tc = e.color === "gris" ? "#4b5563" : COL[e.color];
        if (existe(v, u)) {
          var cx = (x1 + x2) / 2 - dy / dd * 26, cy = (y1 + y2) / 2 + dx / dd * 26;
          var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
          var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
          var a1 = borde(u, (cx - x1) / l1, (cy - y1) / l1) + 2;
          var a2 = borde(v, (cx - x2) / l2, (cy - y2) / l2) + 5;
          var p1x = x1 + (cx - x1) / l1 * a1, p1y = y1 + (cy - y1) / l1 * a1;
          var p2x = x2 + (cx - x2) / l2 * a2, p2y = y2 + (cy - y2) / l2 * a2;
          svg += "<path d='M" + p1x + "," + p1y + " Q" + cx + "," + cy + " " + p2x + "," + p2y + pie;
          textos += etiqueta(0.25 * p1x + 0.5 * cx + 0.25 * p2x, 0.25 * p1y + 0.5 * cy + 0.25 * p2y, w, tc);
        } else {
          var b1 = borde(u, dx / dd, dy / dd) + 2;
          var b2 = borde(v, -dx / dd, -dy / dd) + 5;
          var q1x = x1 + dx / dd * b1, q1y = y1 + dy / dd * b1;
          var q2x = x2 - dx / dd * b2, q2y = y2 - dy / dd * b2;
          svg += "<path d='M" + q1x + "," + q1y + " L" + q2x + "," + q2y + pie;
          var lx = (q1x + q2x) / 2, ly = (q1y + q2y) / 2;
          if (Math.sqrt((q2x - q1x) * (q2x - q1x) + (q2y - q1y) * (q2y - q1y)) < 95) {
            var nx = -dy / dd, ny = dx / dd;
            if (ny > 0) { nx = -nx; ny = -ny; }
            lx = lx + nx * 9; ly = ly + ny * 9;
          }
          textos += etiqueta(lx, ly, w, tc);
        }
        j = j + 1;
      }
      u = u + 1;
    }
    svg += textos;
    u = 0;
    while (u < n) {
      var s = o.nodo(u);
      svg += "<ellipse cx='" + X(u) + "' cy='" + Y(u) + "' rx='" + rxDe(nom[u]) + "' ry='" + RY +
             "' fill='" + s.relleno + "' stroke='" + s.borde + "' stroke-width='" + (s.grueso || 2.2) + "'/>";
      svg += "<text x='" + X(u) + "' y='" + (Y(u) + 4) + "' text-anchor='middle' font-size='11.5' font-weight='700' fill='" +
             (s.tinta || "#24292f") + "'>" + nom[u] + "</text>";
      if (s.nota) {
        svg += "<text x='" + X(u) + "' y='" + (Y(u) - RY - 4) + "' text-anchor='middle' font-size='11' font-weight='700' " +
               "fill='" + (s.notaColor || "#1f5fa8") + "' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" + s.nota + "</text>";
      }
      u = u + 1;
    }
    svg += "</svg>";
    return svg;
  }
  return { dibujar: dibujar, COL: COL };
})();

/* El codigo de bellman_ford.py, linea por linea. */
var COD_INIT = [
  { txt: "def inicializar(n, s):",                              num: null },
  { txt: "    d = [INF] * n",                                    num: 1, bloque: 1 },
  { txt: "    pi = [-1] * n",                                    num: 2, bloque: 1 },
  { txt: "    d[s] = 0",                                         num: 3, bloque: 1 },
  { txt: "    return (d, pi)",                                   num: 4, bloque: 1 },
  { txt: "",                                                     num: null }
];
var COD_RELAJAR = [
  { txt: "def relajar(u, v, w, d, pi):",                        num: null },
  { txt: "    cambio = False",                                   num: 5, bloque: 2 },
  { txt: "    if d[u] + w < d[v]:",                              num: 6, bloque: 2 },
  { txt: "        d[v] = d[u] + w",                              num: 7, bloque: 2 },
  { txt: "        pi[v] = u",                                    num: 8, bloque: 2 },
  { txt: "        cambio = True",                                num: 9, bloque: 2 },
  { txt: "    return cambio",                                    num: 10, bloque: 2 },
  { txt: "",                                                     num: null }
];
var COD_MOORE = [
  { txt: "def bellman_ford_moore(G, s):",                       num: null },
  { txt: "    n = len(G)",                                       num: 11 },
  { txt: "    d, pi = inicializar(n, s)",                        num: 12 },
  { txt: "    en_cola = [False] * n",                            num: 13 },
  { txt: "    veces = [0] * n",                                  num: 14 },
  { txt: "    cola = deque()",                                   num: 15 },
  { txt: "    cola.append(s)",                                   num: 16 },
  { txt: "    en_cola[s] = True",                                num: 17 },
  { txt: "    veces[s] = 1",                                     num: 18 },
  { txt: "    sin_ciclo = True",                                 num: 19 },
  { txt: "    while len(cola) > 0 and sin_ciclo:",               num: 20 },
  { txt: "        u = cola.popleft()",                           num: 21 },
  { txt: "        en_cola[u] = False",                           num: 22 },
  { txt: "        for (v, w) in G[u]:",                          num: 23 },
  { txt: "            if relajar(u, v, w, d, pi) and not en_cola[v]:", num: 24 },
  { txt: "                cola.append(v)",                       num: 25 },
  { txt: "                en_cola[v] = True",                    num: 26 },
  { txt: "                veces[v] = veces[v] + 1",              num: 27 },
  { txt: "                if veces[v] >= n:",                    num: 28 },
  { txt: "                    sin_ciclo = False",                num: 29 },
  { txt: "    return (d, pi, sin_ciclo)",                        num: 30 }
];
var COD_TENSA = [
  { txt: "def hay_arista_tensa(G, d):",                         num: null },
  { txt: "    tensa = False",                                    num: 11, bloque: 3 },
  { txt: "    for u in range(len(G)):",                          num: 12, bloque: 3 },
  { txt: "        for (v, w) in G[u]:",                          num: 13, bloque: 3 },
  { txt: "            if d[u] + w < d[v]:",                      num: 14, bloque: 3 },
  { txt: "                tensa = True",                         num: 15, bloque: 3 },
  { txt: "    return tensa",                                     num: 16, bloque: 3 },
  { txt: "",                                                     num: null }
];
var COD_BF = [
  { txt: "def bellman_ford(G, s):",                             num: null },
  { txt: "    n = len(G)",                                       num: 17 },
  { txt: "    d, pi = inicializar(n, s)",                        num: 18 },
  { txt: "    ronda = 1",                                        num: 19 },
  { txt: "    hubo_cambio = True",                               num: 20 },
  { txt: "    while ronda <= n - 1 and hubo_cambio:",            num: 21 },
  { txt: "        hubo_cambio = False",                          num: 22 },
  { txt: "        for u in range(n):",                           num: 23 },
  { txt: "            for (v, w) in G[u]:",                      num: 24 },
  { txt: "                if relajar(u, v, w, d, pi):",          num: 25 },
  { txt: "                    hubo_cambio = True",               num: 26 },
  { txt: "        ronda = ronda + 1",                            num: 27 },
  { txt: "    sin_ciclo = not hay_arista_tensa(G, d)",           num: 28 },
  { txt: "    return (d, pi, sin_ciclo)",                        num: 29 }
];

/* Simulacion paso a paso. Cada paso trae la linea y una copia del estado. */
function nuevoRastro(G, s, algoritmo) {
  var n = G.length;
  var st = {
    G: G, s: s, n: n, algoritmo: algoritmo, pasos: [],
    d: null, pi: null, enCola: null, veces: null, cola: [],
    u: null, v: null, w: null, ronda: null, hubo: null, tensa: null, sin: null,
    exam: 0, cambios: 0, mira: null, relaja: null, tensas: [], hecho: false, resultado: null
  };
  st.snap = function (linea, extra) {
    var q = {
      linea: linea,
      d: st.d ? st.d.slice() : null, pi: st.pi ? st.pi.slice() : null,
      enCola: st.enCola ? st.enCola.slice() : null, veces: st.veces ? st.veces.slice() : null,
      cola: st.cola.slice(),
      u: st.u, v: st.v, w: st.w === null ? null : num(st.w),
      ronda: st.ronda, hubo: st.hubo === null ? null : (st.hubo ? "True" : "False"),
      tensa: st.tensa === null ? null : (st.tensa ? "True" : "False"),
      sin: st.sin === null ? null : (st.sin ? "True" : "False"),
      exam: st.exam, cambios: st.cambios, mira: st.mira, relaja: st.relaja,
      tensas: st.tensas.slice(), hecho: false, resultado: st.resultado
    };
    if (extra) { var x; for (x in extra) { q[x] = extra[x]; } }
    st.pasos.push(q);
  };
  return st;
}

function inicializarSim(st) {
  st.snap(12 + (st.algoritmo === "bf" ? 6 : 0));
  var dp = nuevoDP(st.n, st.s);
  st.d = []; st.pi = [];
  var i = 0;
  while (i < st.n) { st.d.push(INF); st.pi.push(-1); i = i + 1; }
  st.snap(1);
  st.snap(2);
  st.d[st.s] = 0;
  st.snap(3);
  st.snap(4);
}

function relajarSim(st, u, v, w) {
  st.snap(5);
  var cambio = false;
  st.snap(6);
  if (st.d[u] + w < st.d[v]) {
    st.d[v] = st.d[u] + w; st.snap(7);
    st.pi[v] = u; st.snap(8);
    cambio = true; st.relaja = [u, v]; st.cambios = st.cambios + 1; st.snap(9);
  }
  st.snap(10);
  return cambio;
}

function simularMoore(G, s) {
  var st = nuevoRastro(G, s, "moore"), n = G.length;
  st.snap(11);
  inicializarSim(st);
  st.enCola = []; st.veces = [];
  var i = 0;
  while (i < n) { st.enCola.push(false); st.veces.push(0); i = i + 1; }
  st.snap(13);
  st.snap(14);
  st.cola = []; st.snap(15);
  st.cola.push(s); st.snap(16);
  st.enCola[s] = true; st.snap(17);
  st.veces[s] = 1; st.snap(18);
  st.sin = true; st.snap(19);
  st.snap(20);
  while (st.cola.length > 0 && st.sin) {
    st.u = st.cola.shift(); st.mira = null; st.relaja = null; st.snap(21);
    st.enCola[st.u] = false; st.snap(22);
    var j = 0, u = st.u;
    while (j < G[u].length) {
      var v = G[u][j][0], w = G[u][j][1];
      st.v = v; st.w = w; st.mira = [u, v]; st.relaja = null;
      st.snap(23);
      st.exam = st.exam + 1;
      st.snap(24);
      var cambio = relajarSim(st, u, v, w);
      if (cambio && !st.enCola[v]) {
        st.cola.push(v); st.snap(25);
        st.enCola[v] = true; st.snap(26);
        st.veces[v] = st.veces[v] + 1; st.snap(27);
        st.snap(28);
        if (st.veces[v] >= n) { st.sin = false; st.disparo = v; st.snap(29); }
      }
      j = j + 1;
    }
    st.u = null; st.v = null; st.w = null; st.mira = null; st.relaja = null;
    st.snap(20);
  }
  st.resultado = { d: st.d.slice(), pi: st.pi.slice(), sinCiclo: st.sin };
  st.snap(30, { hecho: true, disparo: st.disparo === undefined ? null : st.disparo });
  return st.pasos;
}

function simularBF(G, s) {
  var st = nuevoRastro(G, s, "bf"), n = G.length, u, j, v, w;
  st.snap(17);
  inicializarSim(st);
  st.ronda = 1; st.snap(19);
  st.hubo = true; st.snap(20);
  st.snap(21);
  while (st.ronda <= n - 1 && st.hubo) {
    st.hubo = false; st.snap(22);
    u = 0;
    while (u < n) {
      st.u = u; st.v = null; st.w = null; st.mira = null; st.snap(23);
      j = 0;
      while (j < G[u].length) {
        v = G[u][j][0]; w = G[u][j][1];
        st.v = v; st.w = w; st.mira = [u, v]; st.relaja = null; st.snap(24);
        st.exam = st.exam + 1;
        st.snap(25);
        if (relajarSim(st, u, v, w)) { st.hubo = true; st.snap(26); }
        j = j + 1;
      }
      u = u + 1;
    }
    st.u = null; st.v = null; st.w = null; st.mira = null; st.relaja = null;
    st.ronda = st.ronda + 1; st.snap(27);
    st.snap(21);
  }
  st.snap(28);
  st.tensa = false; st.snap(11);
  u = 0;
  while (u < n) {
    st.u = u; st.v = null; st.w = null; st.mira = null; st.snap(12);
    j = 0;
    while (j < G[u].length) {
      v = G[u][j][0]; w = G[u][j][1];
      st.v = v; st.w = w; st.mira = [u, v]; st.snap(13);
      st.snap(14);
      if (st.d[u] + w < st.d[v]) { st.tensa = true; st.tensas.push([u, v]); st.snap(15); }
      j = j + 1;
    }
    u = u + 1;
  }
  st.u = null; st.v = null; st.w = null; st.mira = null;
  st.snap(16);
  st.sin = !st.tensa;
  st.resultado = { d: st.d.slice(), pi: st.pi.slice(), sinCiclo: st.sin, rondas: st.ronda - 1, tensas: st.tensas.slice() };
  st.snap(29, { hecho: true });
  return st.pasos;
}

/* Las versiones sin pasos, con interruptores para los errores:
   op.empate: relajar con <= ; op.menosUna: |V|-2 rondas; op.sinEnCola: sin la guarda en_cola. */
function correrBF(G, s, op) {
  op = op || {};
  var n = G.length, dp = nuevoDP(n, s), d = dp.d, pi = dp.pi;
  var ronda = 1, hubo = true, cambios = 0, exam = 0, u, j;
  var tope = op.menosUna ? n - 2 : n - 1;
  while (ronda <= tope && hubo) {
    hubo = false;
    u = 0;
    while (u < n) {
      j = 0;
      while (j < G[u].length) {
        var v = G[u][j][0], w = G[u][j][1];
        exam = exam + 1;
        var cond = op.empate ? d[u] + w <= d[v] : d[u] + w < d[v];
        if (cond) { d[v] = d[u] + w; pi[v] = u; cambios = cambios + 1; hubo = true; }
        j = j + 1;
      }
      u = u + 1;
    }
    ronda = ronda + 1;
  }
  var tensa = false;
  u = 0;
  while (u < n) {
    j = 0;
    while (j < G[u].length) { if (d[u] + G[u][j][1] < d[G[u][j][0]]) { tensa = true; } j = j + 1; }
    u = u + 1;
  }
  return { d: d, pi: pi, sinCiclo: !tensa, rondas: ronda - 1, cambios: cambios, examinadas: exam };
}

function correrMoore(G, s, op) {
  op = op || {};
  var n = G.length, dp = nuevoDP(n, s), d = dp.d, pi = dp.pi;
  var enCola = [], veces = [], cola = [s], salidas = [], i = 0;
  while (i < n) { enCola.push(false); veces.push(0); i = i + 1; }
  enCola[s] = true; veces[s] = 1;
  var sin = true, exam = 0, cambios = 0, entradas = 1;
  while (cola.length > 0 && sin) {
    var u = cola.shift();
    salidas.push(u);
    enCola[u] = false;
    var j = 0;
    while (j < G[u].length) {
      var v = G[u][j][0], w = G[u][j][1];
      exam = exam + 1;
      var cond = op.empate ? d[u] + w <= d[v] : d[u] + w < d[v];
      if (cond) { d[v] = d[u] + w; pi[v] = u; cambios = cambios + 1; }
      if (cond && (op.sinEnCola || !enCola[v])) {
        cola.push(v); enCola[v] = true; veces[v] = veces[v] + 1; entradas = entradas + 1;
        if (veces[v] >= n) { sin = false; }
      }
      j = j + 1;
    }
  }
  return { d: d, pi: pi, sinCiclo: sin, veces: veces, salidas: salidas, examinadas: exam, cambios: cambios, entradas: entradas };
}

/* contar_relajaciones: ingenuo, rondas, parada temprana, Moore. */
function contarExamenes(G, s) {
  var n = G.length, m = 0, u = 0;
  while (u < n) { m = m + G[u].length; u = u + 1; }
  var bf = correrBF(G, s, {});
  var mo = correrMoore(G, s, {});
  return { ingenuo: (n - 1) * m, rondas: bf.rondas, temprano: bf.rondas * m, moore: mo.examinadas, m: m };
}

/* Alcanzables desde un conjunto de vertices. */
function alcanzablesDe(G, fuentes) {
  var vistos = [], i = 0, pila = [];
  while (i < G.length) { vistos.push(false); i = i + 1; }
  fuentes.forEach(function (x) { if (!vistos[x]) { vistos[x] = true; pila.push(x); } });
  while (pila.length > 0) {
    var u = pila.pop(), j = 0;
    while (j < G[u].length) {
      if (!vistos[G[u][j][0]]) { vistos[G[u][j][0]] = true; pila.push(G[u][j][0]); }
      j = j + 1;
    }
  }
  return vistos;
}

/* Vertices con delta = -infinito: los alcanzables desde un ciclo negativo
   que a su vez se alcanza desde la fuente. Se hallan con |V|-1 rondas y una
   ronda mas: los que todavia bajan estan en el ciclo o cuelgan de el. */
function menosInfinito(G, s) {
  var n = G.length, dp = nuevoDP(n, s), d = dp.d, r = 1, u, j, marca = [];
  while (r <= n - 1) {
    u = 0;
    while (u < n) {
      j = 0;
      while (j < G[u].length) {
        if (d[u] + G[u][j][1] < d[G[u][j][0]]) { d[G[u][j][0]] = d[u] + G[u][j][1]; }
        j = j + 1;
      }
      u = u + 1;
    }
    r = r + 1;
  }
  u = 0;
  while (u < n) {
    j = 0;
    while (j < G[u].length) {
      if (d[u] + G[u][j][1] < d[G[u][j][0]]) { marca.push(G[u][j][0]); }
      j = j + 1;
    }
    u = u + 1;
  }
  var al = alcanzablesDe(G, marca), res = [], i = 0;
  while (i < n) { if (al[i]) { res.push(i); } i = i + 1; }
  return res;
}

function rutaPi(pi, s, v) {
  var ruta = [], x = v, guarda = 0;
  while (x !== -1 && guarda <= pi.length) { ruta.push(x); x = pi[x]; guarda = guarda + 1; }
  ruta.reverse();
  if (ruta[0] !== s) { ruta = []; }
  return ruta;
}

/* Ejercicio interactivo: el ciclo negativo (clase 12).
   Corre bellman_ford (con hay_arista_tensa) y bellman_ford_moore, tal como
   estan en codigo/bellman_ford.py, sobre un grafo cuya arista 3 -> 1 el
   estudiante puede cambiar. */
var EJERCICIO = (function () {
  var N = 8, S = 0;
  var NOMBRES = ["0", "1", "2", "3", "4", "5", "6", "7"];
  var CICLO = [1, 2, 3];
  var POS = [[0.0, 1.5], [1.6, 2.8], [3.4, 2.8], [2.5, 1.0], [4.8, 1.0], [6.2, 1.0], [1.2, 0.0], [0.0, 3.6]];
  var MIN_X = -5, MAX_X = 4, X0 = 2;

  /* x es el peso de la arista 3 -> 1. */
  function aristas(x) {
    return [[0, 1, 4], [0, 6, 5], [1, 2, 3], [2, 3, -2], [3, 1, x], [3, 4, 2], [4, 5, -1], [6, 4, 3], [7, 1, 1]];
  }
  function grafo(x) { return construir(N, aristas(x)); }

  function codigoDe(version) {
    return version === "moore"
      ? COD_INIT.concat(COD_RELAJAR, COD_MOORE)
      : COD_INIT.concat(COD_RELAJAR, COD_TENSA, COD_BF);
  }
  function simular(params) {
    return params.version === "moore" ? simularMoore(params.G, params.s) : simularBF(params.G, params.s);
  }

  function hayCiclo(x) {
    return !correrBF(grafo(x), S, {}).sinCiclo;
  }

  /* El ciclo 1 -> 2 -> 3 -> 1 pesa 3 + (-2) + x. */
  function pesoCiclo(x) { return 3 - 2 + x; }

  function trayecto(G, desde, hasta) {
    var padre = [], i = 0, cola = [];
    while (i < G.length) { padre.push(-2); i = i + 1; }
    desde.forEach(function (x) { padre[x] = -1; cola.push(x); });
    while (cola.length > 0) {
      var u = cola.shift(), j = 0;
      while (j < G[u].length) {
        if (padre[G[u][j][0]] === -2) { padre[G[u][j][0]] = u; cola.push(G[u][j][0]); }
        j = j + 1;
      }
    }
    var ruta = [], x = hasta;
    if (padre[hasta] !== -2) {
      while (x !== -1) { ruta.push(x); x = padre[x]; }
      ruta.reverse();
    }
    return ruta;
  }

  /* La respuesta de la prediccion: hay ciclo negativo alcanzable. */
  function evaluarPrediccion(dice, x) {
    var p = pesoCiclo(x), hay = hayCiclo(x), msg;
    var suma = "3 + (−2) + (" + num(x) + ") = " + num(p);
    if (hay && dice) {
      msg = "Correcto. El ciclo 1 → 2 → 3 → 1 pesa " + suma + ", menos que cero, y se alcanza desde 0 por la arista 0 → 1. Cada vuelta baja las distancias de sus vértices en " + Math.abs(p) + ".";
    } else if (hay && !dice) {
      msg = "Sí hay uno. El ciclo 1 → 2 → 3 → 1 pesa " + suma + ", y se alcanza desde la fuente por 0 → 1. Cada vuelta le resta " + Math.abs(p) + " a las distancias de sus vértices.";
    } else if (!hay && p === 0 && dice) {
      msg = "El ciclo pesa " + suma + ": no es negativo. Dar la vuelta deja las distancias igual, y <code>relajar</code> solo cambia cuando <code>d[u] + w &lt; d[v]</code> con desigualdad estricta, así que el ciclo no vuelve a bajar nada.";
    } else if (!hay && dice) {
      msg = "El ciclo 1 → 2 → 3 → 1 pesa " + suma + ", positivo. Hay una arista negativa, la 2 → 3, pero la vuelta completa cuesta más de lo que ahorra.";
    } else if (!hay && p === 0) {
      msg = "Correcto. El ciclo pesa " + suma + ": no es negativo, y como la relajación es estricta no vuelve a bajar nada.";
    } else {
      msg = "Correcto. El ciclo 1 → 2 → 3 → 1 pesa " + suma + ", positivo, aunque la arista 2 → 3 sea negativa.";
    }
    return { ok: hay === dice, msg: msg };
  }

  /* Texto al terminar la corrida. */
  function observacion(version, G, ult) {
    var res = ult.resultado, txt;
    if (version === "moore") {
      if (!res.sinCiclo) {
        txt = "El vértice " + ult.disparo + " entró a la cola " + ult.veces[ult.disparo] + " veces, que son |V| = " + G.length +
          ": <code>veces[v] &gt;= n</code> se cumplió y <code>sin_ciclo</code> quedó en False. Sin ciclo negativo un vértice entra a lo sumo |V| − 1 veces, una por cada ronda de la cola. La cola todavía tenía " +
          ult.cola.length + " vértices, y las distancias que se ven son las de ese instante: no son definitivas.";
      } else {
        var mx = 0, i = 0;
        while (i < ult.veces.length) { if (ult.veces[i] > mx) { mx = ult.veces[i]; } i = i + 1; }
        txt = "La cola se vació. Ningún vértice entró más de " + mx + " veces, menos que |V| = " + G.length + ", y <code>sin_ciclo</code> sigue en True. Las distancias son definitivas.";
      }
    } else {
      if (!res.sinCiclo) {
        var t = res.tensas[0], d = ult.d;
        txt = "Se hicieron completas las |V| − 1 = " + (G.length - 1) + " rondas: en ninguna dejó de haber cambios. <code>hay_arista_tensa</code> mira las aristas una vez más, la ronda |V|-ésima, sin cambiar nada, y encuentra " +
          res.tensas.length + (res.tensas.length === 1 ? " arista tensa" : " aristas tensas") + ", la primera es (" + t[0] + ", " + t[1] + "): d[" + t[0] + "] + w = " +
          texD(d[t[0]] + peso(G, t[0], t[1])) + " es menor que d[" + t[1] + "] = " + texD(d[t[1]]) + ". Con distancias definitivas eso no puede pasar, así que hay un ciclo negativo alcanzable.";
      } else {
        txt = "Terminó en " + res.rondas + (res.rondas === 1 ? " ronda" : " rondas") + ", ninguna arista queda tensa y <code>sin_ciclo</code> es True. Las distancias son definitivas.";
      }
    }
    return txt;
  }

  function peso(G, u, v) {
    var w = null;
    G[u].forEach(function (p) { if (p[0] === v) { w = p[1]; } });
    return w;
  }

  /* Los vertices con distancia menos infinito y la razon de cada uno. */
  function razones(x) {
    var G = grafo(x), mi = menosInfinito(G, S), alc = alcanzablesDe(G, [S]), res = [];
    var dbf = correrBF(G, S, {}).d;
    var v = 0;
    while (v < N) {
      var en = mi.indexOf(v) >= 0, r;
      if (en) {
        var ruta = trayecto(G, CICLO, v);
        r = ruta.length === 1
          ? "está en el ciclo 1 → 2 → 3 → 1: cada vuelta le baja la distancia."
          : "se alcanza desde el ciclo por " + ruta.join(" → ") + ": todo lo que baja en el ciclo baja también en él.";
      } else if (!alc[v]) {
        r = "no se alcanza desde la fuente 0, así que d = ∞ y no −∞. La arista 7 → 1 entra al ciclo, pero nada llega a 7.";
      } else if (mi.length > 0) {
        r = "se alcanza desde 0 y su distancia es finita, " + texD(dbf[v]) + ": ningún camino que salga del ciclo llega hasta él.";
      } else {
        r = "su distancia es finita, " + texD(dbf[v]) + ".";
      }
      res.push({ v: v, menosInf: en, razon: r });
      v = v + 1;
    }
    return res;
  }

  return { N: N, S: S, NOMBRES: NOMBRES, POS: POS, CICLO: CICLO, MIN_X: MIN_X, MAX_X: MAX_X, X0: X0,
           aristas: aristas, grafo: grafo, codigoDe: codigoDe, simular: simular, hayCiclo: hayCiclo,
           pesoCiclo: pesoCiclo, evaluarPrediccion: evaluarPrediccion, observacion: observacion,
           razones: razones, util: { correrBF: correrBF, correrMoore: correrMoore, menosInfinito: menosInfinito,
                                      construir: construir, simularBF: simularBF, simularMoore: simularMoore } };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var x = EJERCICIO.X0, version = "bf", marcas = {};

    function paramsActuales() {
      return { G: EJERCICIO.grafo(x), s: EJERCICIO.S, version: version, nombres: EJERCICIO.NOMBRES, pos: EJERCICIO.POS };
    }

    function dibujar(a) {
      var p = paramsActuales();
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: p.pos, G: p.G, nombres: p.nombres, alto: 290,
        nodo: function (i) {
          var s = { relleno: "#ffffff", borde: "#9aa3af", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (a && a.d) {
            s.nota = texD(a.d[i]) + "/" + texPi(a.pi[i], p.nombres);
            if (a.d[i] !== INF) { s.relleno = "#e3edf8"; s.borde = "#1f5fa8"; }
            if (a.enCola && a.enCola[i]) { s.relleno = "#ffe9a8"; s.borde = "#e8a13d"; }
            if (a.u === i) { s.borde = "#24292f"; s.grueso = 4; }
          }
          return s;
        },
        arista: function (u, v) {
          var e = { color: "gris", grueso: 1.6 };
          if (u === 3 && v === 1) { e = { color: "morado", grueso: 2.4, trazo: "6 4" }; }
          if (a && a.pi && a.pi[v] === u) { e = { color: "azul", grueso: 2.6 }; }
          if (a && a.mira && a.mira[0] === u && a.mira[1] === v) {
            e = a.relaja && a.relaja[0] === u && a.relaja[1] === v ? { color: "verde", grueso: 3.8 } : { color: "ambar", grueso: 3.6 };
          }
          if (a && a.tensas) {
            var t = 0;
            while (t < a.tensas.length) {
              if (a.tensas[t][0] === u && a.tensas[t][1] === v) { e = { color: "rojo", grueso: 4 }; }
              t = t + 1;
            }
          }
          return e;
        }
      });
    }

    function alPintar(e) {
      var a = e.actual, nom = EJERCICIO.NOMBRES, n = EJERCICIO.N;
      dibujar(a);
      var esMoore = version === "moore";
      document.getElementById("fila-cola").style.display = esMoore ? "block" : "none";
      document.getElementById("fila-ronda").style.display = esMoore ? "none" : "block";
      if (esMoore) {
        document.getElementById("ver-cola").textContent = a && a.cola.length > 0 ? "[" + a.cola.join(", ") + "]" : "[ ]";
      } else {
        document.getElementById("ver-ronda").textContent = a && a.ronda !== null ? a.ronda : "–";
      }
      var filas = "", i = 0;
      document.getElementById("col-veces").style.display = esMoore ? "" : "none";
      while (i < n) {
        filas += "<tr><td>" + i + "</td><td>" + (a && a.d ? texD(a.d[i]) : "–") + "</td><td>" +
                 (a && a.pi ? texPi(a.pi[i], nom) : "–") + "</td>" +
                 (esMoore ? "<td>" + (a && a.veces ? a.veces[i] : "–") + "</td>" : "") + "</tr>";
        i = i + 1;
      }
      document.getElementById("cuerpo-tabla").innerHTML = filas;
      var obs = document.getElementById("observacion");
      if (e.terminado && a && a.hecho) {
        obs.className = "veredicto " + (a.resultado.sinCiclo ? "bien" : "mal");
        obs.innerHTML = EJERCICIO.observacion(version, paramsActuales().G, a);
      } else {
        obs.className = "veredicto";
        obs.innerHTML = "";
      }
    }

    function chipsDe(v) {
      return v === "moore"
        ? [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "w", rotulo: "w" },
           { campo: "exam", rotulo: "aristas examinadas", clase: "cuenta" }, { campo: "sin", rotulo: "sin_ciclo" }]
        : [{ campo: "ronda", rotulo: "ronda", clase: "cuenta" }, { campo: "hubo", rotulo: "hubo_cambio" },
           { campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "w", rotulo: "w" },
           { campo: "tensa", rotulo: "tensa" }, { campo: "sin", rotulo: "sin_ciclo" }];
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

    function mostrarPeso() {
      document.getElementById("ver-x").textContent = num(x);
      document.getElementById("rango-x").value = x;
    }

    function limpiarMarcas() {
      marcas = {};
      Array.prototype.forEach.call(document.querySelectorAll("#marcas button"), function (b) { b.classList.remove("primario"); });
      var r = document.getElementById("veredicto-marcas");
      r.className = "veredicto"; r.innerHTML = "";
      document.getElementById("razones").innerHTML = "";
    }

    function armarMarcas() {
      var html = "", v = 0;
      while (v < EJERCICIO.N) { html += "<button type='button' data-v='" + v + "'>" + v + "</button> "; v = v + 1; }
      document.getElementById("marcas").innerHTML = html;
      Array.prototype.forEach.call(document.querySelectorAll("#marcas button"), function (b) {
        b.addEventListener("click", function () {
          var k = parseInt(b.getAttribute("data-v"), 10);
          marcas[k] = !marcas[k];
          b.classList.toggle("primario", marcas[k]);
        });
      });
    }

    arrancar();
    mostrarPeso();
    armarMarcas();

    document.getElementById("rango-x").addEventListener("input", function () {
      x = parseInt(this.value, 10);
      mostrarPeso();
      var v = document.getElementById("veredicto-pred"); v.className = "veredicto"; v.innerHTML = "";
      limpiarMarcas();
      Motor.reiniciar(paramsActuales());
    });

    function responder(dice) {
      var r = EJERCICIO.evaluarPrediccion(dice, x), v = document.getElementById("veredicto-pred");
      v.className = r.ok ? "veredicto bien" : "veredicto mal";
      v.innerHTML = r.msg;
    }
    document.getElementById("btn-si").addEventListener("click", function () { responder(true); });
    document.getElementById("btn-no").addEventListener("click", function () { responder(false); });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        version = btn.getAttribute("data-version");
        arrancar();
      });
    });

    document.getElementById("btn-comprobar-marcas").addEventListener("click", function () {
      var rz = EJERCICIO.razones(x), bien = 0, html = "", v;
      rz.forEach(function (q) {
        var dijo = marcas[q.v] === true, ok = dijo === q.menosInf;
        if (ok) { bien = bien + 1; }
        html += "<div class='fila-item'>" + (ok ? "✓ " : "✗ ") + "Vértice <b>" + q.v + "</b>: " +
                (q.menosInf ? "sí queda en −∞, " : "no queda en −∞, ") + q.razon + "</div>";
      });
      document.getElementById("razones").innerHTML = html;
      var r = document.getElementById("veredicto-marcas");
      var hayMi = rz.some(function (q) { return q.menosInf; });
      r.className = bien === rz.length ? "veredicto bien" : "veredicto mal";
      r.textContent = (bien === rz.length ? "Todo coincide. " : "Coinciden " + bien + " de " + rz.length + ". ") +
        (hayMi ? "Quedan en −∞ el ciclo y todo lo que se alcanza desde él." : "Sin ciclo negativo no hay distancias −∞.");
    });
  })();
}
