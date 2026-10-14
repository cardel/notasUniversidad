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

/* Ejercicio interactivo: Bellman-Ford-Moore paso a paso (clase 12).
   La simulacion reproduce inicializar, relajar y bellman_ford_moore tal como
   estan en codigo/bellman_ford.py, linea por linea. */
var EJERCICIO = (function () {
  var GRAFOS = [
    { boton: "Cadena en contra, seis vértices",
      texto: "Una cadena de cinco vértices con una arista de vuelta, y tres atajos desde la fuente. Pesos negativos en tres tramos de la cadena.",
      n: 6, s: 0,
      aristas: [[0, 5, 2], [0, 1, 6], [0, 3, 7], [5, 4, -1], [4, 3, -2], [3, 2, 1], [2, 1, -3], [1, 5, 6]],
      pos: [[0.0, 1.5], [2.0, 0.0], [3.6, 0.0], [4.6, 1.5], [3.6, 3.0], [2.0, 3.0]] },
    { boton: "Dos vueltas positivas, siete",
      texto: "Siete vértices con dos pares de flechas de ida y vuelta. Ningún ciclo pesa menos que cero, aunque hay aristas negativas.",
      n: 7, s: 0,
      aristas: [[0, 5, -2], [2, 6, -2], [5, 6, 3], [3, 1, 2], [0, 3, 4], [2, 3, 2], [6, 5, 5], [2, 5, 3], [6, 4, 8], [4, 1, 6], [5, 2, 1]],
      pos: [[0.0, 1.6], [4.6, 0.0], [2.9, 1.5], [1.6, 0.0], [5.6, 1.6], [1.6, 3.0], [4.2, 3.0]] },
    { boton: "El peine, siete",
      texto: "La fuente tiene una arista de peso 2 a cada uno de los otros seis vértices, y estos forman una cadena de aristas de peso −1. Las aristas de la fuente se listan del 6 al 1.",
      n: 7, s: 0,
      aristas: [[0, 6, 2], [0, 5, 2], [0, 4, 2], [0, 3, 2], [0, 2, 2], [0, 1, 2],
                [1, 2, -1], [2, 3, -1], [3, 4, -1], [4, 5, -1], [5, 6, -1]],
      pos: [[2.5, 2.6], [0.0, 0.0], [1.0, 0.0], [2.0, 0.0], [3.0, 0.0], [4.0, 0.0], [5.0, 0.0]] }
  ];
  GRAFOS.forEach(function (g) {
    g.G = construir(g.n, g.aristas);
    g.nombres = [];
    var i = 0;
    while (i < g.n) { g.nombres.push(String(i)); i = i + 1; }
    g.cuenta = contarExamenes(g.G, g.s);
  });

  var CODIGO = COD_INIT.concat(COD_RELAJAR, COD_MOORE);

  function simular(params) { return simularMoore(params.G, params.s); }

  function listaAdy(G) {
    return G.map(function (l, u) {
      return "G[" + u + "] = [" + l.map(function (p) { return "(" + p[0] + ", " + num(p[1]) + ")"; }).join(", ") + "]";
    });
  }

  /* Mensaje de la prediccion: cuantas aristas examina Moore. */
  function evaluarPrediccion(valor, g) {
    var c = g.cuenta, n = g.n, res;
    var pasos = simular({ G: g.G, s: g.s }), fin = pasos[pasos.length - 1];
    var salidas = [], k = 0;
    while (k < pasos.length) { if (pasos[k].linea === 21) { salidas.push(pasos[k].u); } k = k + 1; }
    if (valor === c.moore) {
      res = { ok: true, msg: "Correcto: " + c.moore + ". Cada salida de la cola examina las aristas de ese vértice; las salidas, en orden, son " +
        salidas.join(", ") + ", " + salidas.length + " salidas en total. Es el número de veces que se ejecuta la línea 24." };
    } else if (valor === c.temprano) {
      res = { ok: false, msg: "Ese número, " + valor + ", es lo que cuesta la parada temprana: " + c.rondas + " rondas por " + c.m +
        " aristas. Moore no recorre rondas completas, solo las aristas de los vértices que están en la cola." };
    } else if (valor === c.ingenuo) {
      res = { ok: false, msg: "Ese número es (|V| − 1) · |E| = " + c.ingenuo + ", la versión que hace todas las rondas. Moore solo examina las aristas de los vértices que salen de la cola." };
    } else if (valor === c.m) {
      res = { ok: false, msg: "|E| = " + c.m + " sería la cuenta si cada vértice saliera de la cola una sola vez. Mire si algún vértice puede volver a entrar después de salir: entra cada vez que una relajación le baja la distancia y no está ya en la cola." };
    } else {
      res = { ok: false, msg: "No coincide. Siga la cola a mano: sale un vértice, se examinan las aristas de su lista, y entra a la cola cada vértice cuya distancia baja y que no estaba en ella. Sume la longitud de la lista de cada vértice que sale." };
    }
    return res;
  }

  /* El texto que sigue a la corrida de un grafo. */
  function observacion(g, fin) {
    var c = g.cuenta, veces = fin.veces, tot = 0, i = 0;
    while (i < veces.length) { tot = tot + veces[i]; i = i + 1; }
    var ahorro = Math.round((1 - c.moore / c.temprano) * 100);
    var txt = "Moore examina " + c.moore + " aristas; la parada temprana, " + c.temprano + " (" + c.rondas + " rondas de " + c.m + "). ";
    if (c.moore < c.temprano) {
      txt += "Se ahorra el " + ahorro + " % de los exámenes. ";
    } else {
      txt += "No hay ahorro. ";
    }
    txt += "Veces que entró cada vértice a la cola: [" + veces.join(", ") + "], " + tot + " entradas en total.";
    return txt;
  }

  return { GRAFOS: GRAFOS, codigo: CODIGO, simular: simular, listaAdy: listaAdy,
           evaluarPrediccion: evaluarPrediccion, observacion: observacion,
           util: { construir: construir, correrBF: correrBF, correrMoore: correrMoore,
                   contarExamenes: contarExamenes, simularMoore: simularMoore } };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var presetActual = 0;
    var corridos = {};

    function g() { return EJERCICIO.GRAFOS[presetActual]; }
    function paramsActuales() { return { G: g().G, s: g().s, nombres: g().nombres, pos: g().pos }; }

    function dibujar(a) {
      var p = g();
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: p.pos, G: p.G, nombres: p.nombres, alto: 280,
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
          if (a && a.pi && a.pi[v] === u) { e = { color: "azul", grueso: 2.6 }; }
          if (a && a.mira && a.mira[0] === u && a.mira[1] === v) {
            e = a.relaja && a.relaja[0] === u && a.relaja[1] === v
              ? { color: "verde", grueso: 3.8 } : { color: "ambar", grueso: 3.6 };
          }
          return e;
        }
      });
    }

    function alPintar(e) {
      var a = e.actual, p = g(), nom = p.nombres, n = p.n;
      dibujar(a);
      document.getElementById("ver-cola").textContent = a && a.cola.length > 0 ? "[" + a.cola.join(", ") + "]" : "[ ]";
      var enC = [], i = 0;
      while (a && a.enCola && i < n) { if (a.enCola[i]) { enC.push(i); } i = i + 1; }
      document.getElementById("ver-encola").textContent = enC.length > 0 ? "{" + enC.join(", ") + "}" : "ninguno";
      var filas = "";
      i = 0;
      while (i < n) {
        filas += "<tr><td>" + i + "</td><td>" + (a && a.d ? texD(a.d[i]) : "–") + "</td><td>" +
                 (a && a.pi ? texPi(a.pi[i], nom) : "–") + "</td><td>" +
                 (a && a.enCola ? (a.enCola[i] ? "True" : "False") : "–") + "</td><td>" +
                 (a && a.veces ? a.veces[i] : "–") + "</td></tr>";
        i = i + 1;
      }
      document.getElementById("cuerpo-tabla").innerHTML = filas;
      document.getElementById("ver-n").textContent = n;
      document.getElementById("ver-m").textContent = p.cuenta.m;

      var obs = document.getElementById("observacion");
      if (e.terminado && a && a.hecho) {
        corridos[presetActual] = EJERCICIO.observacion(p, a);
        obs.className = "veredicto bien";
        obs.textContent = corridos[presetActual];
      } else {
        obs.className = "veredicto";
        obs.textContent = "";
      }
      tablaFinal();
    }

    function tablaFinal() {
      var filas = "", k = 0, listos = 0;
      while (k < EJERCICIO.GRAFOS.length) {
        var q = EJERCICIO.GRAFOS[k], c = q.cuenta, hecho = corridos[k] !== undefined;
        if (hecho) { listos = listos + 1; }
        filas += "<tr" + (k === presetActual ? " style='background:var(--resalte)'" : "") + "><td style='text-align:left'>" + q.boton +
          "</td><td>" + q.n + "</td><td>" + c.m + "</td>" +
          "<td>" + (hecho ? c.ingenuo : "–") + "</td><td>" + (hecho ? c.rondas : "–") + "</td>" +
          "<td>" + (hecho ? c.temprano : "–") + "</td><td>" + (hecho ? "<b>" + c.moore + "</b>" : "–") + "</td>" +
          "<td>" + (hecho ? Math.round(c.moore / c.temprano * 100) + " %" : "–") + "</td></tr>";
        k = k + 1;
      }
      document.getElementById("cuerpo-final").innerHTML = filas;
      var cierre = document.getElementById("cierre-final");
      if (listos === EJERCICIO.GRAFOS.length) {
        var peine = EJERCICIO.GRAFOS[2], cp = peine.cuenta;
        cierre.className = "veredicto bien";
        cierre.textContent = "En el primer grafo Moore examina " + EJERCICIO.GRAFOS[0].cuenta.moore + " aristas contra " +
          EJERCICIO.GRAFOS[0].cuenta.temprano + ". En el peine examina " + cp.moore + " contra " + cp.temprano +
          ": la fuente deja en la cola a 6, 5, 4, 3, 2, 1 en ese orden, y cada vértice sale antes de que su antecesor en la cadena le mejore la distancia, de modo que vuelve a entrar. " +
          "Moore ahorra cuando las mejoras llegan antes de que el vértice salga y deja de ahorrar cuando llegan después. En el peor caso ambas versiones cuestan O(|V| · |E|).";
      } else {
        cierre.className = "veredicto";
        cierre.textContent = "";
      }
    }

    function mostrarGrafo() {
      document.getElementById("ver-texto").textContent = g().texto;
      document.getElementById("ver-lista").textContent = EJERCICIO.listaAdy(g().G).join("\n");
      document.getElementById("ver-fuente").textContent = g().s;
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "w", rotulo: "w" },
              { campo: "exam", rotulo: "aristas examinadas", clase: "cuenta" }, { campo: "sin", rotulo: "sin_ciclo" }],
      paramsIniciales: paramsActuales(), alPintar: alPintar
    });
    mostrarGrafo();

    Motor.prediccionNumerica(function (valor) { return EJERCICIO.evaluarPrediccion(valor, g()); });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        mostrarGrafo();
        Motor.limpiarVeredicto();
        document.getElementById("prediccion").value = "";
        Motor.reiniciar(paramsActuales());
      });
    });
  })();
}
