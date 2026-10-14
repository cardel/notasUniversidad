/* Ejercicio interactivo: caminos mas cortos sin pesos con la busqueda en amplitud (clase 12).
   La simulacion reproduce ssspBFS del titular (bfs.py) y una funcion camino, linea por linea. */
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
  /* Las lineas 1 a 12 son la funcion ssspBFS del titular (bfs.py, la version sin
     arreglo de visitados), con sus nombres. La reconstruccion no esta en ese archivo. */
  var CODIGO = [
    { txt: "def ssspBFS(G, s):",                                                   num: null },
    { txt: "  q = deque()",                                                         num: 1,  bloque: 1 },
    { txt: "  d, p = [float(\"inf\") for _ in range(len(G))], [-1 for _ in range(len(G))]", num: 2, bloque: 1 },
    { txt: "  q.append(s)",                                                         num: 3,  bloque: 1 },
    { txt: "  d[s] = 0",                                                            num: 4,  bloque: 1 },
    { txt: "  while len(q) > 0:",                                                   num: 5,  bloque: 1 },
    { txt: "    v = q.popleft()",                                                   num: 6,  bloque: 1 },
    { txt: "    for u in G[v]:",                                                    num: 7,  bloque: 1 },
    { txt: "      if d[u] == float(\"inf\"):",                                      num: 8,  bloque: 1 },
    { txt: "        q.append(u)",                                                   num: 9,  bloque: 1 },
    { txt: "        d[u] = d[v] + 1",                                               num: 10, bloque: 1 },
    { txt: "        p[u] = v",                                                      num: 11, bloque: 1 },
    { txt: "  return d, p",                                                         num: 12, bloque: 1 },
    { txt: "",                                                                      num: null },
    { txt: "# Reconstruccion: sube por p desde el destino t",                       num: null },
    { txt: "def camino(p, s, t):",                                                  num: null },
    { txt: "  ruta = []",                                                           num: 13, bloque: 2 },
    { txt: "  x = t",                                                               num: 14, bloque: 2 },
    { txt: "  while x != -1:",                                                      num: 15, bloque: 2 },
    { txt: "    ruta.append(x)",                                                    num: 16, bloque: 2 },
    { txt: "    x = p[x]",                                                          num: 17, bloque: 2 },
    { txt: "  ruta.reverse()",                                                      num: 18, bloque: 2 },
    { txt: "  if ruta[0] != s:",                                                    num: 19, bloque: 2 },
    { txt: "    ruta = []",                                                         num: 20, bloque: 2 },
    { txt: "  return ruta",                                                         num: 21, bloque: 2 }
  ];

  /* Listas de adyacencia de un grafo no dirigido, en el orden de la lista de aristas. */
  function construir(n, aristas) {
    var G = [], u = 0, k = 0;
    while (u < n) { G.push([]); u = u + 1; }
    while (k < aristas.length) {
      G[aristas[k][0]].push(aristas[k][1]);
      G[aristas[k][1]].push(aristas[k][0]);
      k = k + 1;
    }
    return G;
  }

  /* params: {G, s, t}. Corre ssspBFS(G, s) y despues camino(p, s, t).
     v es el vertice que sale de la cola y u el vecino que se mira, como en bfs.py.
     d usa Infinity donde el codigo usa float("inf"). */
  function simular(params) {
    var G = params.G, s = params.s, t = params.t, n = G.length, pasos = [];
    var d = null, p = null, q = [], salio = [], u = null, v = null, x = null;
    var ruta = null, foco = null, i = 0;
    while (i < n) { salio.push(false); i = i + 1; }

    function N(k) { return k === null ? "–" : String(k); }
    function snap(linea, extra) {
      var r = {
        linea: linea, d: d === null ? null : d.slice(), p: p === null ? null : p.slice(),
        q: q.slice(), salio: salio.slice(), u: N(u), v: N(v), x: N(x),
        ruta: ruta === null ? null : ruta.slice(), foco: foco, hecho: false
      };
      if (extra) { var y; for (y in extra) { r[y] = extra[y]; } }
      pasos.push(r);
    }

    snap(1);
    d = []; p = []; i = 0;
    while (i < n) { d.push(Infinity); p.push(-1); i = i + 1; }
    snap(2);
    q.push(s); snap(3);
    d[s] = 0; snap(4);
    snap(5);
    while (q.length > 0) {
      v = q.shift(); salio[v] = true; foco = v; u = null; snap(6);
      var j = 0;
      while (j < G[v].length) {
        u = G[v][j];
        snap(7, { mira: [v, u] });
        snap(8, { mira: [v, u] });
        if (d[u] === Infinity) {
          q.push(u); snap(9, { baja: [v, u] });
          d[u] = d[v] + 1; snap(10, { baja: [v, u] });
          p[u] = v; snap(11, { baja: [v, u] });
        }
        j = j + 1;
      }
      u = null;
      snap(5);
    }
    foco = null; v = null;
    snap(12, { finBfs: true });

    ruta = []; snap(13);
    x = t; snap(14);
    snap(15);
    while (x !== -1) {
      ruta.push(x); snap(16);
      x = p[x]; snap(17);
      snap(15);
    }
    ruta.reverse(); snap(18);
    snap(19);
    if (ruta[0] !== s) {
      ruta = []; snap(20);
    }
    snap(21, { hecho: true });
    var ult = pasos[pasos.length - 1];
    ult.resultadoD = d.slice(); ult.resultadoP = p.slice(); ult.resultadoRuta = ruta.slice();
    return pasos;
  }

  function resumen(params) {
    var ult = simular(params).pop();
    return { d: ult.resultadoD, p: ult.resultadoP, ruta: ult.resultadoRuta };
  }

  /* Peso del camino y menor peso entre todos los caminos simples de s a t. */
  function pesoDe(pesos, a, b) {
    var k = 0, w = null;
    while (k < pesos.length) {
      if ((pesos[k][0] === a && pesos[k][1] === b) || (pesos[k][0] === b && pesos[k][1] === a)) { w = pesos[k][2]; }
      k = k + 1;
    }
    return w;
  }
  function pesoRuta(pesos, ruta) {
    var total = 0, k = 0;
    while (k + 1 < ruta.length) { total = total + pesoDe(pesos, ruta[k], ruta[k + 1]); k = k + 1; }
    return total;
  }
  function mejorPeso(G, pesos, s, t) {
    var mejor = { peso: Infinity, ruta: [] }, enRuta = [], k = 0;
    while (k < G.length) { enRuta.push(false); k = k + 1; }
    var actual = [s];
    enRuta[s] = true;
    function ext(u) {
      if (u === t) {
        var p = pesoRuta(pesos, actual);
        if (p < mejor.peso) { mejor = { peso: p, ruta: actual.slice() }; }
      } else {
        var j = 0;
        while (j < G[u].length) {
          var v = G[u][j];
          if (!enRuta[v]) { enRuta[v] = true; actual.push(v); ext(v); actual.pop(); enRuta[v] = false; }
          j = j + 1;
        }
      }
    }
    ext(s);
    return mejor;
  }

  var NOMBRES9 = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
  var GRAFOS = [
    { boton: "Ocho vértices",
      texto: "Ocho vértices conectados, no dirigido. La búsqueda arranca en 0.",
      n: 8, s: 0, t: 3,
      aristas: [[0, 2], [0, 5], [1, 2], [2, 4], [4, 5], [5, 6], [1, 3], [4, 7], [6, 7], [3, 7]],
      pos: [[0.0, 1.5], [3.0, 3.0], [1.5, 2.6], [4.4, 3.0], [2.0, 0.8], [1.0, 0.0], [3.0, 0.0], [4.4, 1.2]] },
    { boton: "Anillo con cuerda, siete",
      texto: "Un anillo de siete vértices con una cuerda entre 1 y 5. La búsqueda arranca en 3.",
      n: 7, s: 3, t: 0,
      aristas: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [1, 5]],
      pos: [[0.4, 3.2], [1.6, 3.8], [3.2, 3.2], [3.6, 1.6], [2.6, 0.2], [1.0, 0.2], [0.0, 1.6]] },
    { boton: "Dos componentes, nueve",
      texto: "Nueve vértices en dos componentes que no se tocan. La búsqueda arranca en 1.",
      n: 9, s: 1, t: 7,
      aristas: [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [5, 6], [6, 7], [7, 8], [5, 8]],
      pos: [[0.0, 1.5], [1.2, 1.5], [2.4, 2.4], [2.4, 0.6], [3.6, 1.5], [4.4, 2.8], [5.8, 2.8], [5.8, 0.6], [4.4, 0.6]] },
    { boton: "Con pesos, cuatro",
      texto: "Cuatro vértices con un peso en cada arista. La búsqueda arranca en 0 y no mira los pesos.",
      n: 4, s: 0, t: 3,
      aristas: [[0, 3], [0, 1], [1, 2], [2, 3]],
      pesos: [[0, 3, 9], [0, 1, 2], [1, 2, 2], [2, 3, 2]],
      pos: [[0.0, 0.0], [0.0, 2.0], [3.0, 2.0], [3.0, 0.0]] }
  ];

  return { grafos: GRAFOS, nombres9: NOMBRES9, codigo: CODIGO, construir: construir, simular: simular, resumen: resumen, pesoRuta: pesoRuta, mejorPeso: mejorPeso };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var GRAFOS = EJERCICIO.grafos, NOMBRES9 = EJERCICIO.nombres9;
    var presetActual = 0, destino = GRAFOS[0].t;

    function g() { return GRAFOS[presetActual]; }
    function Gady() { return EJERCICIO.construir(g().n, g().aristas); }
    function paramsActuales() { return { G: Gady(), s: g().s, t: destino }; }
    function par(r, a, b) { return r && ((r[0] === a && r[1] === b) || (r[0] === b && r[1] === a)); }
    function f(x) { return x === Infinity ? "inf" : String(x); }
    function lista(a) { return "[" + a.map(f).join(", ") + "]"; }

    function enRuta(r, a, b) {
      var k = 0, si = false;
      while (r && k + 1 < r.length) { if (par([r[k], r[k + 1]], a, b)) { si = true; } k = k + 1; }
      return si;
    }

    function dibujar(a) {
      var gr = g(), G = Gady();
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: gr.pos, G: G, nombres: NOMBRES9.slice(0, gr.n), dirigido: false,
        peso: gr.pesos ? function (u, v) { return EJERCICIO.pesoRuta(gr.pesos, [u, v]); } : null,
        nodo: function (i) {
          var s = { relleno: "#ffffff", borde: "#6b7280", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (a && a.d !== null) {
            if (a.salio[i]) { s.relleno = "#b8bec7"; s.borde = "#4b5563"; }
            else if (a.d[i] !== Infinity) { s.relleno = "#e3edf8"; s.borde = "#1f5fa8"; }
            s.nota = (a.d[i] === Infinity ? "∞" : a.d[i]) + "/" + (a.p[i] === -1 ? "–" : a.p[i]);
            if (a.foco === i) { s.borde = "#e8a13d"; s.grueso = 4.2; }
          }
          if (a && a.ruta && a.ruta.indexOf(i) >= 0) { s.borde = "#2e7d32"; s.grueso = 4.2; }
          return s;
        },
        arista: function (u, v) {
          var e = { color: "gris", grueso: 1.6 };
          if (a && a.ruta && enRuta(a.ruta, u, v)) { e = { color: "verde", grueso: 3.6 }; }
          else if (a && par(a.baja, u, v)) { e = { color: "verde", grueso: 2.9 }; }
          else if (a && par(a.mira, u, v)) { e = { color: "azul", grueso: 2.9 }; }
          return e;
        }
      });
    }

    function alPintar(e) {
      var a = e.actual, gr = g();
      dibujar(a);
      document.getElementById("ver-cola").textContent = a && a.d !== null ? "deque(" + lista(a.q) + ")" : "sin crear";
      document.getElementById("ver-d").textContent = a && a.d !== null ? lista(a.d) : "sin crear";
      document.getElementById("ver-p").textContent = a && a.p !== null ? lista(a.p) : "sin crear";
      document.getElementById("ver-ruta").textContent = a && a.ruta !== null ? lista(a.ruta) : "sin crear";
      var caja = document.getElementById("resultado-final"), cierre = "";
      if (a && a.hecho) {
        var r = a.resultadoRuta;
        if (r.length === 0) {
          cierre = "<b>camino devuelve [ ]:</b> el vértice " + destino + " quedó con d = inf, no se alcanzó desde " + gr.s + ". " +
                   "La subida por p termina en " + destino + " mismo, que no es la fuente, y el <code>if</code> vacía la lista.";
        } else {
          cierre = "<b>camino devuelve " + lista(r) + ":</b> " + (r.length - 1) + (r.length === 2 ? " arista" : " aristas") + ", que es d[" + destino + "] = " + a.resultadoD[destino] + ".";
          if (gr.pesos) {
            var m = EJERCICIO.mejorPeso(Gady(), gr.pesos, gr.s, destino), mio = EJERCICIO.pesoRuta(gr.pesos, r);
            cierre += " Con los pesos del dibujo ese camino cuesta " + mio + ", y el camino " + lista(m.ruta) + " cuesta " + m.peso + ". " +
                      "La búsqueda entregó el de menos aristas, no el más barato.";
          }
        }
      }
      caja.className = cierre === "" ? "veredicto" : "veredicto bien";
      caja.innerHTML = cierre;
    }

    function llenarDestinos() {
      var sel = document.getElementById("destino"), h = "", i = 0;
      while (i < g().n) { h += "<option value='" + i + "'" + (i === destino ? " selected" : "") + ">" + i + "</option>"; i = i + 1; }
      sel.innerHTML = h;
      document.getElementById("rot-destino").textContent = String(destino);
      document.getElementById("ver-texto").textContent = g().texto;
      document.getElementById("ver-fuente").textContent = String(g().s);
    }

    function limpiar() {
      Motor.limpiarVeredicto();
      document.getElementById("prediccion").value = "";
      var r = document.getElementById("porque-veredicto");
      r.className = "veredicto"; r.textContent = "";
      Array.prototype.forEach.call(document.querySelectorAll("input[name=porque]"), function (b) { b.checked = false; });
    }

    function cambiarGrafo(i) {
      presetActual = i;
      destino = g().t;
      llenarDestinos();
      limpiar();
      Motor.reiniciar(paramsActuales());
    }

    /* valor: entero, o Infinity cuando se escribe inf. */
    function evaluar(valor, params) {
      var r = EJERCICIO.resumen(params), real = r.d[destino], res;
      if (real === Infinity) {
        res = valor === Infinity
          ? { ok: true, msg: "Correcto: d[" + destino + "] = inf. Ninguna arista une la componente de " + params.s + " con " + destino + ", así que la búsqueda nunca lo descubre y d conserva el infinito del inicio." }
          : { ok: false, msg: "No. Desde " + params.s + " no hay camino hasta " + destino + ": están en componentes distintas. Un vértice que la búsqueda no descubre se queda con d = inf, no con un número de aristas." };
      } else if (valor === real) {
        res = { ok: true, msg: "Correcto: d[" + destino + "] = " + real + ". Es el número de aristas del camino " + lista(r.ruta) + ", el más corto que la búsqueda por niveles encuentra." };
      } else if (valor === Infinity) {
        res = { ok: false, msg: "Sí hay camino de " + params.s + " a " + destino + ": ambos están en la misma componente. El inf queda solo para los vértices que la búsqueda no descubre." };
      } else if (valor === real + 1) {
        res = { ok: false, msg: "Un número de más: d cuenta aristas, no vértices. El camino tiene " + (real + 1) + " vértices y " + real + " aristas." };
      } else if (valor > real) {
        res = { ok: false, msg: "Ese número sirve para un camino de " + valor + " aristas, pero la amplitud descubre cada vértice en el nivel más bajo en que aparece. Cuente los niveles desde " + params.s + " hasta llegar a " + destino + "." };
      } else {
        res = { ok: false, msg: "Ningún camino de " + params.s + " a " + destino + " tiene tan pocas aristas. Los vértices a distancia 1 son los vecinos de " + params.s + "; vaya nivel por nivel." };
      }
      return res;
    }

    function arrancar() {
      Motor.iniciar({
        codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
        chips: [
          { campo: "v", rotulo: "v" }, { campo: "u", rotulo: "u" }, { campo: "x", rotulo: "x", clase: "cuenta" }
        ],
        paramsIniciales: paramsActuales(), alPintar: alPintar
      });
    }

    arrancar();
    llenarDestinos();
    document.getElementById("btn-comprobar").addEventListener("click", function () {
      var t = document.getElementById("prediccion").value.trim().toLowerCase().replace("∞", "inf");
      var ver = document.getElementById("veredicto"), res, valor;
      if (t === "inf") { valor = Infinity; }
      else if (/^-?\d+$/.test(t)) { valor = parseInt(t, 10); }
      else { valor = null; }
      if (valor === null) { res = { ok: false, msg: "Escriba un entero o inf." }; }
      else { res = evaluar(valor, paramsActuales()); }
      ver.className = res.ok ? "veredicto bien" : "veredicto mal";
      ver.textContent = res.msg;
    });
    document.getElementById("destino").addEventListener("change", function () {
      destino = parseInt(this.value, 10);
      document.getElementById("rot-destino").textContent = String(destino);
      limpiar();
      Motor.reiniciar(paramsActuales());
    });
    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        cambiarGrafo(parseInt(btn.getAttribute("data-preset"), 10));
      });
    });
    document.getElementById("btn-cargar-pesos").addEventListener("click", function () {
      Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) {
        b.classList.toggle("primario", b.getAttribute("data-preset") === "3");
      });
      cambiarGrafo(3);
    });

    var RESPUESTAS = {
      aristas: { ok: true, msg: "Correcto. La cola ordena los vértices por número de aristas desde la fuente y d[u] se escribe una sola vez, en el primer descubrimiento. Esa cuenta no sabe de pesos: en el grafo de la actividad el camino 0, 3 tiene una arista y cuesta 9, mientras que 0, 1, 2, 3 tiene tres aristas y cuesta 6." },
      vacia: { ok: false, msg: "La cola no se vacía antes de tiempo: la búsqueda llega a todos los vértices de la componente de la fuente, con o sin pesos. Lo que falla es lo que se les asigna: aristas, no costo." },
      p: { ok: false, msg: "p[u] se escribe una sola vez, no varias: la condición d[u] == float(\"inf\") solo deja pasar el primer descubrimiento. Ahí está el problema, pues con pesos un descubrimiento posterior podría ser más barato y el código ya no vuelve a mirarlo." },
      dirigido: { ok: false, msg: "La dirección no interviene. Con flechas el mismo grafo da el mismo resultado, y la búsqueda sigue entregando el camino de menos aristas aunque no sea el más barato." }
    };
    Array.prototype.forEach.call(document.querySelectorAll("input[name=porque]"), function (b) {
      b.addEventListener("change", function () {
        var r = RESPUESTAS[b.value], c = document.getElementById("porque-veredicto");
        c.className = r.ok ? "veredicto bien" : "veredicto mal";
        c.textContent = r.msg;
      });
    });
  })();
}
