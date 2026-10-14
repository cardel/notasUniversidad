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

/* Ejercicio interactivo: tres versiones con una linea cambiada (clase 12).
   Una en relajar (el empate cuenta como mejora), una en el numero de rondas
   de bellman_ford y una en la guarda en_cola de bellman_ford_moore. Las tres
   corren y devuelven algo con apariencia de respuesta. */
var EJERCICIO = (function () {
  function lista(a) {
    return "[" + a.map(function (x) { return texD(x); }).join(", ") + "]";
  }
  function listaPi(a) {
    return "[" + a.map(function (x) { return x === -1 ? "–" : x; }).join(", ") + "]";
  }
  function unir(xs) {
    var t = xs.map(String);
    return t.length <= 1 ? t.join("") : t.slice(0, -1).join(", ") + " y " + t[t.length - 1];
  }
  function esc(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function distintos(a, b) {
    var res = [], i = 0;
    while (i < a.length) { if (a[i] !== b[i]) { res.push(i); } i = i + 1; }
    return res;
  }
  function tensasDe(G, d) {
    var res = [], u = 0;
    while (u < G.length) {
      G[u].forEach(function (p) { if (d[u] + p[1] < d[p[0]]) { res.push([u, p[0]]); } });
      u = u + 1;
    }
    return res;
  }
  function pesoDe(G, u, v) {
    var w = null;
    G[u].forEach(function (p) { if (p[0] === v) { w = p[1]; } });
    return w;
  }

  var CASOS = [
    {
      clave: "empate",
      titulo: "1. La condición de relajar",
      n: 6, s: 0,
      aristas: [[0, 1, 2], [0, 2, 3], [1, 3, 2], [2, 3, 1], [3, 4, 4], [3, 5, 1], [4, 5, -3], [2, 5, 6]],
      pos: [[0.0, 1.5], [1.5, 2.8], [1.5, 0.2], [3.1, 1.5], [4.6, 2.8], [4.6, 0.2]],
      op: { empate: true },
      runs: ["bf", "moore"],
      codigo: [
        { txt: "def relajar(u, v, w, d, pi):" },
        { txt: "    cambio = False" },
        { txt: "    if d[u] + w <= d[v]:", cambiada: true },
        { txt: "        d[v] = d[u] + w" },
        { txt: "        pi[v] = u" },
        { txt: "        cambio = True" },
        { txt: "    return cambio" }
      ],
      lineaBuena: "    if d[u] + w < d[v]:",
      mensajesLinea: {
        1: "El indicador arranca en False y solo se pone en True dentro del if. Es igual en las dos versiones; lo que cambia es cuántas veces se entra al if.",
        3: "La asignación es la misma. Lo que cambia es que se ejecuta también cuando la nueva distancia empata con la que ya había.",
        4: "Esta línea es igual en las dos versiones, pero con la condición nueva se ejecuta en cada empate, y por eso el predecesor cambia en la tabla.",
        5: "Poner True es lo correcto cuando algo cambió. La pregunta es cuándo se llega aquí.",
        6: "Devolver el indicador es lo que usan bellman_ford y Moore para decidir si seguir. Está igual en las dos versiones."
      },
      defecto: "Esa línea es igual a la de la versión correcta. Las distancias coinciden en los dos lados; compare las rondas, las relajaciones contadas y los predecesores.",
      explicacion: function (r, caso) {
        var bf = r.bf, mo = r.moore, dif = distintos(bf.buena.pi, bf.mala.pi);
        var cambios = dif.map(function (v) { return "π[" + v + "] pasa de " + bf.buena.pi[v] + " a " + bf.mala.pi[v]; });
        var rep = [], i = 0;
        while (i < mo.mala.veces.length) {
          if (mo.mala.veces[i] > mo.buena.veces[i]) { rep.push(i); }
          i = i + 1;
        }
        return "Con <code>&lt;=</code> una arista que empata se relaja otra vez: reescribe el mismo <code>d</code>, le cambia el predecesor al vértice y devuelve True. Las distancias salen iguales, " +
          lista(bf.buena.d) + ", y por eso nadie lo nota en el resultado. Pero <code>bellman_ford</code> hace " + bf.mala.rondas +
          " rondas en lugar de " + bf.buena.rondas + ", porque cada ronda ve un cambio aunque ninguna distancia baje, y cuenta " + bf.mala.cambios +
          " relajaciones exitosas en lugar de " + bf.buena.cambios + ". " + (cambios.length > 0 ? "Los predecesores cambian: " + cambios.join(", ") + ", porque el último empate se queda con el vértice. " : "") +
          "En Moore, " + (rep.length > 0 ? "el vértice " + unir(rep) + " vuelve a entrar a la cola sin que su distancia baje" : "la cola se repite") +
          ": las salidas son [" + mo.mala.salidas.join(", ") + "] en lugar de [" + mo.buena.salidas.join(", ") + "]. " +
          "Con un ciclo de peso cero el empate se repetiría sin fin, <code>veces</code> llegaría a |V| y Moore informaría un ciclo negativo que no existe.";
      }
    },
    {
      clave: "rondas",
      titulo: "2. El número de rondas de Bellman-Ford",
      n: 7, s: 6,
      aristas: [[6, 5, 2], [5, 4, -1], [4, 3, 3], [3, 2, -2], [2, 1, 4], [1, 0, 1], [6, 4, 5], [5, 2, 8], [3, 0, 20], [3, 1, 9]],
      pos: [[6.0, 2.2], [5.0, 0.6], [4.0, 2.2], [3.0, 0.6], [2.0, 2.2], [1.0, 0.6], [0.0, 2.2]],
      op: { menosUna: true },
      runs: ["bf"],
      codigo: [
        { txt: "def bellman_ford(G, s):" },
        { txt: "    n = len(G)" },
        { txt: "    d, pi = inicializar(n, s)" },
        { txt: "    ronda = 1" },
        { txt: "    hubo_cambio = True" },
        { txt: "    while ronda <= n - 2 and hubo_cambio:", cambiada: true },
        { txt: "        hubo_cambio = False" },
        { txt: "        for u in range(n):" },
        { txt: "            for (v, w) in G[u]:" },
        { txt: "                if relajar(u, v, w, d, pi):" },
        { txt: "                    hubo_cambio = True" },
        { txt: "        ronda = ronda + 1" },
        { txt: "    sin_ciclo = not hay_arista_tensa(G, d)" },
        { txt: "    return (d, pi, sin_ciclo)" }
      ],
      lineaBuena: "    while ronda <= n - 1 and hubo_cambio:",
      mensajesLinea: {
        3: "Empezar la cuenta en 1 es lo correcto: la primera ronda es la 1. La falla está en hasta dónde llega.",
        4: "hubo_cambio arranca en True para entrar a la primera ronda. Está igual en las dos versiones.",
        6: "Reiniciar el indicador al empezar cada ronda es lo mismo en las dos versiones.",
        9: "La relajación de cada arista es la misma. Lo que cambia es cuántas rondas se llegan a hacer.",
        11: "Subir la cuenta al final de cada ronda es igual en las dos versiones.",
        12: "Esa línea es la que recibe el resultado: está igual y hace bien su trabajo con las distancias que le llegan. Revise si las distancias que le llegan son definitivas.",
        2: "La inicialización es la misma: infinito salvo la fuente."
      },
      defecto: "Esa línea es igual a la de la versión correcta. Compare d[0] y sin_ciclo con los de la correcta: la diferencia nace en el número de rondas que se permiten.",
      explicacion: function (r, caso) {
        var x = r.bf, G = r.G, ruta = rutaPi(x.buena.pi, caso.s, 0), t = tensasDe(G, x.mala.d);
        var tt = t.length > 0 ? t[0] : null;
        return "El camino más barato de " + caso.s + " a 0 es " + ruta.join(", ") + " y tiene " + (ruta.length - 1) +
          " aristas, que son |V| − 1. Sus aristas van de un índice mayor a uno menor mientras <code>u</code> recorre de 0 a |V| − 1, así que cada ronda avanza una sola arista del camino y hacen falta las |V| − 1. " +
          "Con |V| − 2 = " + (caso.n - 2) + " rondas el vértice 0 queda con d = " + texD(x.mala.d[0]) + " y no con " + texD(x.buena.d[0]) + ". " +
          (tt ? "Entonces <code>hay_arista_tensa</code> encuentra tensa la arista (" + tt[0] + ", " + tt[1] + "): d[" + tt[0] + "] + w = " +
            texD(x.mala.d[tt[0]] + pesoDe(G, tt[0], tt[1])) + " es menor que d[" + tt[1] + "] = " + texD(x.mala.d[tt[1]]) +
            ", y la versión declara <code>sin_ciclo = False</code>: informa un ciclo negativo en un grafo que no lo tiene. " : "") +
          "El programa no falla; responde otra cosa.";
      }
    },
    {
      clave: "sinencola",
      titulo: "3. La guarda en_cola de Moore",
      n: 7, s: 0,
      aristas: [[0, 1, 1], [0, 2, 2], [1, 3, 4], [2, 3, 1], [3, 4, 1], [3, 5, 2], [3, 6, 3], [4, 6, -2], [5, 6, -1], [1, 4, 5]],
      pos: [[0.0, 1.5], [1.5, 2.8], [1.5, 0.2], [3.1, 1.5], [4.6, 2.8], [4.6, 0.2], [6.2, 1.5]],
      op: { sinEnCola: true },
      runs: ["moore"],
      codigo: [
        { txt: "def bellman_ford_moore(G, s):" },
        { txt: "    n = len(G)" },
        { txt: "    d, pi = inicializar(n, s)" },
        { txt: "    en_cola = [False] * n" },
        { txt: "    veces = [0] * n" },
        { txt: "    cola = deque()" },
        { txt: "    cola.append(s)" },
        { txt: "    en_cola[s] = True" },
        { txt: "    veces[s] = 1" },
        { txt: "    sin_ciclo = True" },
        { txt: "    while len(cola) > 0 and sin_ciclo:" },
        { txt: "        u = cola.popleft()" },
        { txt: "        en_cola[u] = False" },
        { txt: "        for (v, w) in G[u]:" },
        { txt: "            if relajar(u, v, w, d, pi):", cambiada: true },
        { txt: "                cola.append(v)" },
        { txt: "                en_cola[v] = True" },
        { txt: "                veces[v] = veces[v] + 1" },
        { txt: "                if veces[v] >= n:" },
        { txt: "                    sin_ciclo = False" },
        { txt: "    return (d, pi, sin_ciclo)" }
      ],
      lineaBuena: "            if relajar(u, v, w, d, pi) and not en_cola[v]:",
      mensajesLinea: {
        3: "El arreglo en_cola se crea y se mantiene al día en las dos versiones. Lo que falta es consultarlo.",
        8: "veces[s] = 1 cuenta la entrada inicial de la fuente. Está igual en las dos versiones.",
        12: "Marcar que u salió de la cola es correcto. Esa marca solo sirve si alguien la mira antes de volver a encolar.",
        16: "Marcar a v como encolado está igual en las dos versiones, pero aquí ya no se consulta antes de entrar.",
        15: "Agregar a v a la cola es lo que hace avanzar el algoritmo. La pregunta es cuántas veces puede estar v en ella al mismo tiempo.",
        17: "El contador está igual en las dos versiones. Sube una vez por cada entrada a la cola, y por eso la comparación veces[v] >= n acaba contando entradas repetidas.",
        18: "Esa comparación es la misma en las dos versiones. Con las entradas repetidas el contador sube más rápido de lo que debería."
      },
      defecto: "Esa línea es igual a la de la versión correcta. Las distancias coinciden; compare las salidas de la cola y las aristas examinadas.",
      explicacion: function (r, caso) {
        var x = r.moore, rep = [], i = 0;
        while (i < x.mala.veces.length) {
          if (x.mala.veces[i] > x.buena.veces[i]) { rep.push(i + " (" + x.mala.veces[i] + " veces)"); }
          i = i + 1;
        }
        return "Sin <code>not en_cola[v]</code> un vértice que ya espera en la cola entra de nuevo cada vez que otra relajación le baja la distancia. Entran más de una vez: " +
          unir(rep) + ". La segunda salida de cada uno llega con la misma distancia que la primera y no mejora nada, pero examina otra vez todas sus aristas: " +
          x.mala.examinadas + " aristas examinadas en lugar de " + x.buena.examinadas + ", y " + x.mala.entradas + " entradas a la cola en lugar de " + x.buena.entradas +
          ". Las salidas son [" + x.mala.salidas.join(", ") + "] y no [" + x.buena.salidas.join(", ") + "]. Las distancias y los predecesores son los mismos, " +
          lista(x.buena.d) + ", así que la respuesta no delata el trabajo de más. Además <code>veces[v] &gt;= n</code> pasa a contar entradas repetidas, y en un grafo más grande podría acusar un ciclo negativo que no existe.";
      }
    }
  ];
  CASOS.forEach(function (c) { c.G = construir(c.n, c.aristas); });

  function correr(caso) {
    var res = { G: caso.G }, k = 0;
    while (k < caso.runs.length) {
      var t = caso.runs[k];
      res[t] = t === "bf"
        ? { buena: correrBF(caso.G, caso.s, {}), mala: correrBF(caso.G, caso.s, caso.op) }
        : { buena: correrMoore(caso.G, caso.s, {}), mala: correrMoore(caso.G, caso.s, caso.op) };
      k = k + 1;
    }
    return res;
  }

  function evaluar(caso, indice) {
    var cambiada = -1, k = 0;
    while (k < caso.codigo.length) { if (caso.codigo[k].cambiada) { cambiada = k; } k = k + 1; }
    var res = correr(caso), msg;
    var ok = indice === cambiada;
    if (ok) {
      msg = "Correcto: esa es la línea cambiada. La versión correcta dice <code>" +
        esc(caso.lineaBuena.trim()) + "</code>. " + caso.explicacion(res, caso);
    } else if (caso.mensajesLinea[indice] !== undefined) {
      msg = caso.mensajesLinea[indice];
    } else {
      msg = caso.defecto;
    }
    return { ok: ok, msg: msg, cambiada: cambiada };
  }

  return { casos: CASOS, correr: correr, evaluar: evaluar, lista: lista, listaPi: listaPi,
           util: { construir: construir, correrBF: correrBF, correrMoore: correrMoore } };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var corrido = {};

    function escapar(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

    function dibujar(caso, caja) {
      var nombres = [], i = 0;
      while (i < caso.n) { nombres.push(String(i)); i = i + 1; }
      caja.innerHTML = DIB.dibujar({
        pos: caso.pos, G: caso.G, nombres: nombres, alto: 220, maxAncho: 560,
        nodo: function (k) {
          var s = { relleno: "#ffffff", borde: "#9aa3af", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (k === caso.s) { s.relleno = "#e3edf8"; s.borde = "#1f5fa8"; s.grueso = 3.4; s.nota = "fuente"; }
          return s;
        },
        arista: function () { return { color: "gris", grueso: 1.8 }; }
      });
    }

    function celda(a, b) {
      return a === b ? "<td>" + b + "</td>"
        : "<td style='background:var(--rojo-suave);color:var(--rojo);font-weight:700'>" + b + "</td>";
    }

    function tablaVectores(n, buena, mala, esPi) {
      var f = esPi ? function (x) { return x === -1 ? "–" : String(x); } : texD;
      var rot = esPi ? "pi" : "d", v, html = "<tr><th>" + rot + ", correcta</th>";
      for (v = 0; v < n; v = v + 1) { html += "<td>" + f(buena[v]) + "</td>"; }
      html += "</tr><tr><th>" + rot + ", esta versión</th>";
      for (v = 0; v < n; v = v + 1) { html += celda(f(buena[v]), f(mala[v])); }
      return html + "</tr>";
    }

    function filaMedida(rotulo, a, b) {
      return "<tr><td style='text-align:left'>" + rotulo + "</td><td>" + a + "</td>" + celda(String(a), String(b)) + "</tr>";
    }

    function mostrarCorrida(carta, caso, idx) {
      corrido[idx] = true;
      var res = EJERCICIO.correr(caso), n = caso.n, v, html = "";
      caso.runs.forEach(function (t) {
        var b = res[t].buena, m = res[t].mala;
        html += "<p style='margin-bottom:0.3rem'><b>" + (t === "bf" ? "bellman_ford" : "bellman_ford_moore") + " desde " + caso.s + "</b></p>";
        html += "<div class='envoltura-tabla'><table><thead><tr><th>Vértice</th>";
        for (v = 0; v < n; v = v + 1) { html += "<th>" + v + "</th>"; }
        html += "</tr></thead><tbody>" + tablaVectores(n, b.d, m.d, false) + tablaVectores(n, b.pi, m.pi, true) + "</tbody></table></div>";
        html += "<div class='envoltura-tabla' style='margin-top:0.5rem'><table><thead><tr><th>Medida</th><th>Correcta</th><th>Esta versión</th></tr></thead><tbody>";
        html += filaMedida("sin_ciclo", b.sinCiclo ? "True" : "False", m.sinCiclo ? "True" : "False");
        if (t === "bf") {
          html += filaMedida("rondas hechas", b.rondas, m.rondas);
          html += filaMedida("relajaciones que devolvieron True", b.cambios, m.cambios);
        } else {
          html += filaMedida("aristas examinadas", b.examinadas, m.examinadas);
          html += filaMedida("relajaciones que devolvieron True", b.cambios, m.cambios);
          html += filaMedida("entradas a la cola", b.entradas, m.entradas);
          html += filaMedida("salidas de la cola, en orden", "[" + b.salidas.join(", ") + "]", "[" + m.salidas.join(", ") + "]");
        }
        html += "</tbody></table></div>";
      });
      var s = carta.querySelector(".salida");
      s.style.display = "block";
      s.innerHTML = html;
    }

    function armar() {
      var raiz = document.getElementById("casos"), html = "", c = 0;
      while (c < EJERCICIO.casos.length) {
        var caso = EJERCICIO.casos[c];
        html += "<div class='carta caso' data-caso='" + c + "'><h2>" + caso.titulo + "</h2>";
        html += "<div class='grafo-caso'></div>";
        html += "<p class='nota' style='margin-top:0'>Grafo dirigido de " + caso.n + " vértices con fuente " + caso.s + ". Aristas (u, v, w): " +
                caso.aristas.map(function (a) { return "(" + a[0] + ", " + a[1] + ", " + num(a[2]) + ")"; }).join(" ") + ".</p>";
        html += "<div class='prediccion'><button class='primario btn-correr'>Correr esta versión</button></div>";
        html += "<div class='salida'></div>";
        html += "<p style='margin-bottom:0.2rem'><b>Señale la línea que cambió.</b></p><div class='lineas'>";
        var k = 0;
        while (k < caso.codigo.length) {
          html += "<button type='button' class='lin' data-linea='" + k + "'>" + escapar(caso.codigo[k].txt) + "</button>";
          k = k + 1;
        }
        html += "</div><div class='veredicto'></div></div>";
        c = c + 1;
      }
      raiz.innerHTML = html;
      Array.prototype.forEach.call(raiz.querySelectorAll(".caso"), function (carta) {
        var idx = parseInt(carta.getAttribute("data-caso"), 10);
        var caso = EJERCICIO.casos[idx];
        dibujar(caso, carta.querySelector(".grafo-caso"));
        carta.querySelector(".btn-correr").addEventListener("click", function () {
          mostrarCorrida(carta, caso, idx);
        });
        Array.prototype.forEach.call(carta.querySelectorAll(".lin"), function (b) {
          b.addEventListener("click", function () {
            var v = carta.querySelector(".veredicto");
            if (!corrido[idx]) {
              v.className = "veredicto mal";
              v.textContent = "Corra primero la versión y compare con la correcta; la línea se señala mirando qué cambió en la salida.";
            } else {
              var res = EJERCICIO.evaluar(caso, parseInt(b.getAttribute("data-linea"), 10));
              v.className = res.ok ? "veredicto bien" : "veredicto mal";
              v.innerHTML = res.msg;
            }
          });
        });
      });
    }

    armar();
  })();
}
