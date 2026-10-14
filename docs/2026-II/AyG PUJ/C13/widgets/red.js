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

/* Ejercicio interactivo final (clase 12): dos redes grandes sobre las que se
   corre bellman_ford_moore, tal como esta en codigo/bellman_ford.py. En la
   primera, las tasas de una casa de cambio como pesos -1000 ln(tasa) esconden
   un arbitraje; en la segunda, los peajes y los bonos de una ruta de carga dan
   tramos negativos sin ciclo negativo. */
var EJERCICIO = (function () {
  var CAMBIO = [[0, 1, 85, 0.91816], [1, 0, -81, 1.084783], [1, 2, 142, 0.867262], [2, 1, -138, 1.148446], [2, 0, -234, 1.263291], [0, 2, 238, 0.78842], [1, 4, 46, 0.9546087], [4, 1, -42, 1.043364], [0, 3, -5009, 149.7], [3, 0, 5013, 0.006653333], [3, 6, 4594, 0.01011307], [6, 3, -4590, 98.48684], [0, 5, -305, 1.35728], [5, 0, 309, 0.7338235], [5, 7, -2530, 12.54838], [7, 5, 2534, 0.0793731], [7, 8, 1232, 0.2918129], [8, 7, -1228, 3.41316], [0, 9, -8279, 3942.1], [9, 0, 8283, 0.0002526582], [9, 10, 6962, 0.0009474684], [10, 9, -6958, 1051.227], [10, 11, -5522, 250.1653], [11, 10, 5526, 0.003981383], [3, 12, 3039, 0.047904], [12, 3, -3035, 20.79167]];

  var ESCENARIOS = [
    {
      clave: "cambio",
      boton: "Casa de cambio, trece monedas",
      texto: "Una casa de cambio publica la tasa de cada par de monedas: cambiar una cantidad por otra moneda la multiplica por la tasa. El peso de la flecha es −1000 · ln(tasa), redondeado al entero. Una cadena de cambios multiplica sus tasas, así que su peso es −1000 · ln del producto: un ciclo que termina con más dinero del que empezó pesa menos que cero.",
      nombres: ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "MXN", "BRL", "COP", "PEN", "CLP", "CNY"],
      pos: [[4.5, 2.5], [2.7, 3.9], [2.7, 1.1], [6.3, 3.9], [0.7, 4.4], [6.3, 1.1], [8.6, 3.0], [8.3, 1.1], [8.7, -0.7],
            [4.5, 0.2], [2.8, -0.8], [1.0, -0.8], [8.6, 4.6]],
      aristas: CAMBIO.map(function (e) { return [e[0], e[1], e[2]]; }),
      tasas: CAMBIO.map(function (e) { return e[3]; }),
      s: 0, pregunta: "ciclo", ciclo: [0, 1, 2], alto: 430
    },
    {
      clave: "reparto",
      boton: "Reparto con peajes y bonos, catorce nodos",
      texto: "Una empresa de transporte mueve carga entre catorce puntos. El peso de cada tramo, en miles de pesos, es lo que cuestan peajes y combustible menos el bono del convenio; cuando el bono supera el gasto, el tramo pesa menos que cero. Se busca el costo más bajo de llevar la carga de la Bodega al Puerto.",
      nombres: ["Bodega", "Acopio", "Cruce Oeste", "Planta", "Aduana", "Puerto", "Silo", "Centro", "Frigorífico", "Mercado", "Terminal", "Patio", "Estación", "Muelle"],
      pos: [[0.0, 2.2], [1.6, 3.8], [3.2, 4.8], [1.6, 0.6], [3.4, 3.2], [8.4, 3.4], [3.4, 0.0], [3.4, 1.6], [5.0, 0.8],
            [6.4, 0.0], [6.4, 1.8], [6.8, 4.9], [5.2, 4.9], [8.0, 1.2]],
      aristas: [[0, 1, 2], [0, 3, 4], [0, 7, 9], [1, 2, 3], [1, 4, 5], [1, 3, 3], [2, 12, 6], [2, 1, -1], [3, 6, 7], [3, 7, 5],
                [4, 5, 16], [4, 1, 2], [6, 7, -4], [6, 8, 6], [7, 3, 3], [7, 8, 5], [8, 9, 4], [8, 10, 5], [9, 10, -2], [10, 9, 3],
                [9, 13, 7], [10, 13, 6], [12, 11, 5], [11, 5, 14], [12, 1, 4], [13, 5, -3], [13, 9, 2]],
      s: 0, pregunta: "costo", t: 5, alto: 400
    }
  ];
  ESCENARIOS.forEach(function (e) { e.n = e.nombres.length; e.G = construir(e.n, e.aristas); });

  var CODIGO = COD_INIT.concat(COD_RELAJAR, COD_MOORE);
  function simular(params) { return simularMoore(params.G, params.s); }

  function tasaTxt(r) {
    var t = r >= 1 ? r.toFixed(4) : r.toPrecision(4);
    return t.replace(".", ",");
  }
  function dec1(x) { return x.toFixed(1).replace(".", ","); }

  /* Todos los costos de caminos simples de s a t, con su ruta. */
  function caminosSimples(G, s, t) {
    var res = [], ruta = [s];
    function dfs(u, c) {
      if (u === t) { res.push({ costo: c, ruta: ruta.slice() }); }
      else {
        G[u].forEach(function (p) {
          if (ruta.indexOf(p[0]) < 0) { ruta.push(p[0]); dfs(p[0], c + p[1]); ruta.pop(); }
        });
      }
    }
    dfs(s, 0);
    res.sort(function (a, b) { return a.costo - b.costo; });
    return res;
  }

  /* El ciclo que dejan los predecesores al detenerse Moore: se sube |V| veces
     desde el vertice que disparo la alarma y se da la vuelta completa. */
  function cicloDePi(pi, desde) {
    var x = desde, i = 0, res = [];
    while (i < pi.length) { x = pi[x]; i = i + 1; }
    var inicio = x;
    res.push(inicio);
    var y = pi[inicio];
    while (y !== inicio) { res.push(y); y = pi[y]; }
    res.reverse();
    return res;
  }

  function evaluarPrediccion(dice, e) {
    var hay = e.pregunta === "ciclo", msg;
    if (hay) {
      msg = dice
        ? "Sí hay uno. Un ciclo negativo aquí es una secuencia de cambios que vuelve a la moneda de partida con más dinero. Aún no se sabe cuál es: eso lo entrega Moore, y se pregunta abajo."
        : "Sí hay uno. Un ciclo negativo aquí es una secuencia de cambios que vuelve a la moneda de partida con más dinero. Con solo dos monedas se pierde la diferencia entre comprar y vender, así que la ganancia está en una cadena más larga. Ejecute Moore: él la encuentra.";
    } else {
      msg = dice
        ? "No hay ninguno, aunque hay flechas negativas y ciclos. Mercado ↔ Terminal suma −2 + 3 = 1 y Cruce Oeste ↔ Acopio suma 3 − 1 = 2; ningún otro ciclo pesa menos que cero. Un bono rebaja un tramo, no el ciclo completo."
        : "Correcto. Hay flechas negativas y hay ciclos, como Mercado ↔ Terminal, que suma −2 + 3 = 1, y Cruce Oeste ↔ Acopio, que suma 3 − 1 = 2. Ningún ciclo pesa menos que cero, y con eso las distancias existen.";
    }
    return { ok: dice === hay, msg: msg };
  }

  function nombresDe(e, ids) { return ids.map(function (k) { return e.nombres[k]; }); }

  function evaluarCiclo(sel, ult, e) {
    var res;
    if (!ult || !ult.hecho) {
      return { ok: false, msg: "Ejecute Moore hasta el final primero: el ciclo sale de los predecesores que quedan al detenerse." };
    }
    var ciclo = cicloDePi(ult.resultado.pi, ult.disparo);
    var esperado = ciclo.slice().sort(function (a, b) { return a - b; });
    var dado = sel.slice().sort(function (a, b) { return a - b; });
    var rec = ciclo.concat([ciclo[0]]), pesos = [], prod = 1, i = 0;
    while (i < ciclo.length) {
      var u = ciclo[i], v = rec[i + 1], k = 0;
      while (k < e.aristas.length) {
        if (e.aristas[k][0] === u && e.aristas[k][1] === v) { pesos.push(e.aristas[k][2]); prod = prod * e.tasas[k]; }
        k = k + 1;
      }
      i = i + 1;
    }
    var suma = pesos.reduce(function (a, b) { return a + b; }, 0);
    if (esperado.join() === dado.join()) {
      res = { ok: true, msg: "Correcto: " + nombresDe(e, rec).join(" → ") + ". Se halla subiendo por π desde " + e.nombres[ult.disparo] +
        ", el vértice que entró " + ult.veces[ult.disparo] + " veces a la cola, hasta repetir un vértice, y dando vuelta a la lista. Los pesos suman " +
        pesos.map(num).join(" + ").replace(/\+ −/g, "− ") + " = " + num(suma) + ". Con las tasas, 1000 " + e.nombres[ciclo[0]] + " pasan a 1000 · " +
        ciclo.map(function (c, j) { var kk = 0, t = 0; while (kk < e.aristas.length) { if (e.aristas[kk][0] === c && e.aristas[kk][1] === rec[j + 1]) { t = e.tasas[kk]; } kk = kk + 1; } return tasaTxt(t); }).join(" · ") +
        " = " + dec1(1000 * prod) + " " + e.nombres[ciclo[0]] + "." };
    } else if (dado.length === 2) {
      res = { ok: false, msg: "Dos monedas no bastan: la ida y la vuelta entre las mismas dos monedas suman 4 en cada par, porque la casa vende más caro de lo que compra. La ganancia aparece en una cadena más larga." };
    } else if (dado.length === 0) {
      res = { ok: false, msg: "Marque las monedas del ciclo. Se encuentra subiendo por π desde el vértice que entró a la cola tantas veces como vértices hay." };
    } else {
      res = { ok: false, msg: "No coincide. Suba por π desde el vértice cuyo contador veces llegó a |V| = " + e.n + " y siga hasta repetir un vértice: lo que queda entre las dos apariciones es el ciclo." };
    }
    return res;
  }

  function evaluarCosto(valor, ult, e) {
    if (!ult || !ult.hecho) {
      return { ok: false, msg: "Ejecute Moore hasta el final primero: el costo es d[" + e.t + "] cuando la cola se vacía." };
    }
    var d = ult.resultado.d[e.t], pi = ult.resultado.pi, ruta = rutaPi(pi, e.s, e.t);
    var bonos = [], i = 0;
    while (i < ruta.length - 1) {
      var w = null;
      e.G[ruta[i]].forEach(function (p) { if (p[0] === ruta[i + 1]) { w = p[1]; } });
      if (w < 0) { bonos.push(e.nombres[ruta[i]] + " → " + e.nombres[ruta[i + 1]] + " (" + num(w) + ")"); }
      i = i + 1;
    }
    var todos = caminosSimples(e.G, e.s, e.t), res;
    if (valor === d) {
      res = { ok: true, msg: "Correcto: " + d + ". Es d[" + e.nombres[e.t] + "] al vaciarse la cola, y camino(pi, " + e.s + ", " + e.t + ") da la ruta: " +
        nombresDe(e, ruta).join(" → ") + ", con " + (ruta.length - 1) + " tramos. Los tramos con bono que usa son " + bonos.join(", ") + "." };
    } else {
      var otro = null;
      todos.forEach(function (c) { if (c.costo === valor && otro === null) { otro = c; } });
      if (otro !== null) {
        res = { ok: false, msg: "Ese es el costo de la ruta " + nombresDe(e, otro.ruta).join(" → ") + ", que existe pero no es la más barata. Hay otra que cuesta menos: revise dónde aprovecha mejor los bonos." };
      } else if (valor < d) {
        res = { ok: false, msg: "Ese valor es menor que cualquier ruta. Una ruta no puede repetir un ciclo para bajar el costo, porque ningún ciclo pesa menos que cero." };
      } else {
        res = { ok: false, msg: "No coincide con el costo de una ruta. Lea d[" + e.nombres[e.t] + "] en la tabla al terminar Moore." };
      }
    }
    return res;
  }

  return { ESCENARIOS: ESCENARIOS, codigo: CODIGO, simular: simular, tasaTxt: tasaTxt, caminosSimples: caminosSimples,
           cicloDePi: cicloDePi, evaluarPrediccion: evaluarPrediccion, evaluarCiclo: evaluarCiclo, evaluarCosto: evaluarCosto,
           util: { construir: construir, correrMoore: correrMoore, correrBF: correrBF, simularMoore: simularMoore } };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var idx = 0, sel = {}, ultimo = null;

    function esc() { return EJERCICIO.ESCENARIOS[idx]; }
    function paramsActuales() { return { G: esc().G, s: esc().s, nombres: esc().nombres, pos: esc().pos }; }

    function dibujar(a) {
      var p = esc();
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: p.pos, G: p.G, nombres: p.nombres, alto: p.alto, ancho: 720, maxAncho: 780,
        nodo: function (i) {
          var s = { relleno: "#ffffff", borde: "#9aa3af", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (i === p.s) { s.borde = "#1f5fa8"; s.grueso = 3.2; }
          if (a && a.d) {
            s.nota = texD(a.d[i]) + "/" + texPi(a.pi[i], p.nombres);
            if (a.d[i] !== INF) { s.relleno = "#e3edf8"; s.borde = "#1f5fa8"; }
            if (a.enCola && a.enCola[i]) { s.relleno = "#ffe9a8"; s.borde = "#e8a13d"; }
            if (a.u === i) { s.borde = "#24292f"; s.grueso = 4; }
          }
          return s;
        },
        arista: function (u, v) {
          var e = { color: "gris", grueso: 1.5 };
          if (a && a.pi && a.pi[v] === u) { e = { color: "azul", grueso: 2.6 }; }
          if (a && a.mira && a.mira[0] === u && a.mira[1] === v) {
            e = a.relaja && a.relaja[0] === u && a.relaja[1] === v ? { color: "verde", grueso: 3.8 } : { color: "ambar", grueso: 3.6 };
          }
          return e;
        }
      });
    }

    function alPintar(e) {
      var a = e.actual, p = esc(), n = p.n, nom = p.nombres;
      ultimo = a;
      dibujar(a);
      document.getElementById("ver-cola").textContent = a && a.cola.length > 0 ? "[" + a.cola.map(function (k) { return nom[k]; }).join(", ") + "]" : "[ ]";
      var filas = "", i = 0;
      while (i < n) {
        filas += "<tr><td style='text-align:left'>" + i + " · " + nom[i] + "</td><td>" + (a && a.d ? texD(a.d[i]) : "–") + "</td><td>" +
                 (a && a.pi ? texPi(a.pi[i], nom) : "–") + "</td><td>" + (a && a.enCola ? (a.enCola[i] ? "True" : "False") : "–") + "</td><td>" +
                 (a && a.veces ? a.veces[i] : "–") + "</td></tr>";
        i = i + 1;
      }
      document.getElementById("cuerpo-tabla").innerHTML = filas;
      var obs = document.getElementById("observacion");
      if (e.terminado && a && a.hecho) {
        if (!a.resultado.sinCiclo) {
          obs.className = "veredicto mal";
          obs.textContent = "Moore se detuvo: " + nom[a.disparo] + " entró a la cola " + a.veces[a.disparo] + " veces, |V| = " + n +
            ", y sin_ciclo quedó en False. La cola todavía tenía " + a.cola.length + " vértices. Las distancias de la tabla son las de ese instante y siguen bajando.";
        } else {
          obs.className = "veredicto bien";
          obs.textContent = "La cola se vació con sin_ciclo en True. Las distancias son definitivas.";
        }
      } else {
        obs.className = "veredicto";
        obs.textContent = "";
      }
    }

    function llenarTabla() {
      var p = esc(), html = "", k = 0;
      if (p.clave === "cambio") {
        document.getElementById("rot-tabla").textContent = "Tasas publicadas y peso de cada flecha";
        html = "<thead><tr><th>De</th><th>A</th><th>Tasa</th><th>Peso</th></tr></thead><tbody>";
        while (k < p.aristas.length) {
          html += "<tr><td>" + p.nombres[p.aristas[k][0]] + "</td><td>" + p.nombres[p.aristas[k][1]] + "</td><td>" +
                  EJERCICIO.tasaTxt(p.tasas[k]) + "</td><td>" + num(p.aristas[k][2]) + "</td></tr>";
          k = k + 1;
        }
      } else {
        document.getElementById("rot-tabla").textContent = "Tramos y su peso";
        html = "<thead><tr><th>De</th><th>A</th><th>Peso, en miles de pesos</th></tr></thead><tbody>";
        while (k < p.aristas.length) {
          html += "<tr><td>" + p.nombres[p.aristas[k][0]] + "</td><td>" + p.nombres[p.aristas[k][1]] + "</td><td>" + num(p.aristas[k][2]) + "</td></tr>";
          k = k + 1;
        }
      }
      document.getElementById("tabla-aristas").innerHTML = html + "</tbody>";
    }

    function armarEscenario() {
      var p = esc();
      document.getElementById("ver-texto").textContent = p.texto;
      document.getElementById("ver-n").textContent = p.n;
      document.getElementById("ver-m").textContent = p.aristas.length;
      document.getElementById("ver-fuente").textContent = p.nombres[p.s];
      llenarTabla();
      sel = {};
      var html = "", i = 0;
      while (i < p.n) { html += "<button type='button' data-v='" + i + "'>" + p.nombres[i] + "</button> "; i = i + 1; }
      document.getElementById("monedas").innerHTML = html;
      Array.prototype.forEach.call(document.querySelectorAll("#monedas button"), function (b) {
        b.addEventListener("click", function () {
          var k = parseInt(b.getAttribute("data-v"), 10);
          sel[k] = !sel[k];
          b.classList.toggle("primario", sel[k]);
        });
      });
      document.getElementById("preg-ciclo").style.display = p.pregunta === "ciclo" ? "block" : "none";
      document.getElementById("preg-costo").style.display = p.pregunta === "costo" ? "block" : "none";
      if (p.pregunta === "costo") {
        document.getElementById("rot-costo").textContent = "¿Cuál es el costo mínimo de llevar la carga de " + p.nombres[p.s] + " a " + p.nombres[p.t] + "?";
      }
      ["veredicto-pred", "veredicto-ciclo", "veredicto-costo"].forEach(function (id) {
        var v = document.getElementById(id); v.className = "veredicto"; v.textContent = "";
      });
      document.getElementById("costo").value = "";
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "w", rotulo: "w" },
              { campo: "exam", rotulo: "aristas examinadas", clase: "cuenta" }, { campo: "sin", rotulo: "sin_ciclo" }],
      paramsIniciales: paramsActuales(), alPintar: alPintar
    });
    armarEscenario();

    function responder(dice) {
      var r = EJERCICIO.evaluarPrediccion(dice, esc()), v = document.getElementById("veredicto-pred");
      v.className = r.ok ? "veredicto bien" : "veredicto mal";
      v.textContent = r.msg;
    }
    document.getElementById("btn-si").addEventListener("click", function () { responder(true); });
    document.getElementById("btn-no").addEventListener("click", function () { responder(false); });

    document.getElementById("btn-ciclo").addEventListener("click", function () {
      var ids = [], k;
      for (k in sel) { if (sel[k]) { ids.push(parseInt(k, 10)); } }
      var r = EJERCICIO.evaluarCiclo(ids, ultimo, esc()), v = document.getElementById("veredicto-ciclo");
      v.className = r.ok ? "veredicto bien" : "veredicto mal";
      v.textContent = r.msg;
    });
    document.getElementById("btn-costo").addEventListener("click", function () {
      var valor = parseInt(document.getElementById("costo").value, 10), v = document.getElementById("veredicto-costo"), r;
      if (isNaN(valor)) { r = { ok: false, msg: "Escriba un número primero." }; }
      else { r = EJERCICIO.evaluarCosto(valor, ultimo, esc()); }
      v.className = r.ok ? "veredicto bien" : "veredicto mal";
      v.textContent = r.msg;
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        idx = parseInt(btn.getAttribute("data-preset"), 10);
        armarEscenario();
        Motor.reiniciar(paramsActuales());
      });
    });
  })();
}
