/* Ejercicio interactivo: caminos mas cortos de a lo sumo k aristas (clase 12).
   Cada fila se calcula solo a partir de la anterior, con copia por fila. */
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

  /* Grafos dirigidos con pesos. Las aristas van en el orden en que se relajan en la comparacion en el lugar. */
  var GRAFOS = [
    { boton: "Cinco vértices, pesos positivos",
      texto: "Cinco vértices, origen 0. Hay atajos caros de 0 a casi todos y una cadena barata con más aristas.",
      n: 5, s: 0, hasta: 4,
      aristas: [[0, 1, 2], [1, 2, 3], [2, 3, 1], [3, 4, 2], [0, 2, 9], [0, 3, 7], [0, 4, 12], [1, 4, 8]],
      pos: [[0.0, 1.5], [1.6, 2.8], [3.4, 2.8], [5.0, 1.5], [3.4, 0.0]] },
    { boton: "Seis vértices, un peso negativo",
      texto: "Seis vértices, origen 1. Una arista tiene peso negativo, no hay ciclos negativos y el vértice 0 no se alcanza desde el origen.",
      n: 6, s: 1, hasta: 5,
      aristas: [[1, 2, 5], [2, 3, -2], [3, 4, 3], [4, 5, 1], [1, 5, 9], [1, 4, 7], [1, 3, 6], [0, 1, 3], [5, 2, 4]],
      pos: [[0.0, 1.5], [1.4, 1.5], [3.0, 3.0], [4.6, 3.0], [6.0, 1.5], [4.6, 0.0]] },
    { boton: "Cinco vértices, ciclo negativo",
      texto: "Cinco vértices, origen 0. Las aristas 2 → 3, 3 → 4 y 4 → 2 forman un ciclo de peso menor que cero al que se llega desde el origen. Se llenan las filas de k = 0 a n.",
      n: 5, s: 0, hasta: 5,
      aristas: [[0, 1, 3], [1, 2, 2], [2, 3, 1], [3, 4, -5], [4, 2, 2], [0, 4, 20]],
      pos: [[0.0, 1.5], [1.6, 2.8], [3.6, 2.8], [5.4, 1.6], [3.6, 0.2]] }
  ];

  function adyacencia(g) {
    var G = [], i = 0;
    while (i < g.n) { G.push([]); i = i + 1; }
    i = 0;
    while (i < g.aristas.length) { G[g.aristas[i][0]].push(g.aristas[i][1]); i = i + 1; }
    return G;
  }

  function pesoDe(g, u, v) {
    var i = 0, w = null;
    while (i < g.aristas.length) { if (g.aristas[i][0] === u && g.aristas[i][1] === v) { w = g.aristas[i][2]; } i = i + 1; }
    return w;
  }

  function fmt(x) { return x === INF ? "∞" : String(x).replace("-", "−"); }

  /* Filas k = 0..n. Cada fila se calcula solo a partir de la anterior (copia por fila).
     mejoras: por cada vertice que bajo, {v, u, w, antes, despues, ruta}. */
  function filas(g) {
    var n = g.n, R = [], k = 0, v = 0, e = 0;
    var d0 = [], p0 = [], r0 = [];
    while (v < n) { d0.push(INF); p0.push(-1); r0.push(null); v = v + 1; }
    d0[g.s] = 0; r0[g.s] = [g.s];
    R.push({ k: 0, d: d0, pred: p0, ruta: r0, mejoras: [], enLugar: d0.slice() });
    k = 1;
    while (k <= n) {
      var prev = R[k - 1];
      var d = prev.d.slice(), p = prev.pred.slice(), r = prev.ruta.slice(), mej = [];
      var lugar = prev.d.slice();
      e = 0;
      while (e < g.aristas.length) {
        var u = g.aristas[e][0], x = g.aristas[e][1], w = g.aristas[e][2];
        var cand = prev.d[u] + w;
        if (cand < d[x]) {
          d[x] = cand; p[x] = u; r[x] = prev.ruta[u].concat([x]);
          var hallada = -1, q = 0;
          while (q < mej.length) { if (mej[q].v === x) { hallada = q; } q = q + 1; }
          var m = { v: x, u: u, w: w, antes: prev.d[x], despues: cand, ruta: r[x], dU: prev.d[u] };
          if (hallada >= 0) { mej[hallada] = m; } else { mej.push(m); }
        }
        if (lugar[u] + w < lugar[x]) { lugar[x] = lugar[u] + w; }
        e = e + 1;
      }
      R.push({ k: k, d: d, pred: p, ruta: r, mejoras: mej, enLugar: lugar });
      k = k + 1;
    }
    return R;
  }

  /* Ciclo al subir por pred desde x en la fila dada; devuelve los vertices en el sentido de las aristas. */
  function cicloDesde(fila, x, n) {
    var y = x, i = 0;
    while (i < n) { y = fila.pred[y]; i = i + 1; }
    var ciclo = [y], z = fila.pred[y];
    while (z !== y) { ciclo.push(z); z = fila.pred[z]; }
    ciclo.reverse();
    return ciclo;
  }

  function pesoCiclo(g, ciclo) {
    var t = 0, i = 0;
    while (i < ciclo.length) { t = t + pesoDe(g, ciclo[i], ciclo[(i + 1) % ciclo.length]); i = i + 1; }
    return t;
  }

  /* Texto de la ruta como 0, 1, 2. */
  function rutaTxt(r) { return r.join(", "); }

  /* Explicacion de una fila ya correcta. */
  function explicar(g, R, k) {
    var fila = R[k], n = g.n, partes = [], i = 0;
    if (k === 0) {
      return "Con cero aristas solo se llega al origen: dist[" + g.s + "] = 0 y los demás valen ∞.";
    }
    if (fila.mejoras.length === 0) {
      partes.push("Ninguna entrada cambia: ninguna arista (u, v) da dist[u] + w menor que lo que la fila " + (k - 1) + " ya tenía.");
    }
    while (i < fila.mejoras.length) {
      var m = fila.mejoras[i];
      partes.push("dist[" + m.v + "] baja de " + fmt(m.antes) + " a " + fmt(m.despues) + ": el camino " + rutaTxt(m.ruta) + " cuesta " + fmt(m.despues) +
        ", sale de dist[" + m.u + "] = " + fmt(m.dU) + " de la fila " + (k - 1) + " más la arista (" + m.u + ", " + m.v + ") de peso " + fmt(m.w) + ". " +
        (m.antes === INF ? "Con " + (k - 1) + " aristas o menos no se llegaba a " + m.v + "." : "Con " + (k - 1) + " aristas o menos lo mejor era " + fmt(m.antes) + ".") +
        " Este camino tiene " + k + " aristas: con " + (k - 1) + " no alcanzaba, y por eso aparece en esta fila.");
      i = i + 1;
    }
    if (k === n - 1) {
      partes.push("Un camino sin vértices repetidos tiene a lo sumo n − 1 = " + (n - 1) + " aristas. " +
        (g.hasta === n ? "Sin ciclos negativos esta fila sería la respuesta; falta comprobar que la siguiente no cambia."
                       : "Esta fila es la respuesta: ya no hay más caminos por buscar."));
    }
    if (k === n) {
      if (fila.mejoras.length > 0) {
        var c = cicloDesde(fila, fila.mejoras[0].v, n), pc = pesoCiclo(g, c);
        partes.push("La fila " + n + " todavía cambia. Un camino más corto sin ciclos negativos nunca necesita " + n + " aristas, así que este cambio solo puede venir de un ciclo negativo. Subiendo por pred desde " + fila.mejoras[0].v + " se recorre el ciclo " + rutaTxt(c.concat([c[0]])) + ", de peso " + fmt(pc) + ". Los valores de dist de los vértices a los que se llega por él no son costos de caminos más cortos: cada vuelta los baja un poco más.");
      }
    }
    return partes.join(" ");
  }

  /* Diagnostico de una celda equivocada. entrada: entero o INF. */
  function diagnosticoCelda(g, R, k, v, entrada) {
    var fila = R[k], prev = R[k - 1] || null, real = fila.d[v], msg = "";
    var m = null, i = 0;
    while (i < fila.mejoras.length) { if (fila.mejoras[i].v === v) { m = fila.mejoras[i]; } i = i + 1; }
    if (k === 0) {
      msg = v === g.s ? "dist[" + v + "] = 0: el origen cuesta cero." : "Con cero aristas solo se llega al origen; los demás valen ∞.";
    } else if (entrada === prev.d[v] && m !== null) {
      msg = "dist[" + v + "] no se queda en " + fmt(entrada) + ": la arista (" + m.u + ", " + v + ") de peso " + fmt(m.w) + " sobre dist[" + m.u + "] = " + fmt(m.dU) + " de la fila " + (k - 1) + " da " + fmt(real) + ".";
    } else if (entrada === fila.enLugar[v] && entrada !== real) {
      msg = "Ese valor de dist[" + v + "] usa un dist[u] ya bajado en esta misma fila. La fila " + k + " se calcula solo con la fila " + (k - 1) + ": un camino de a lo sumo " + k + " aristas no puede encadenar más.";
    } else if (entrada === INF && real !== INF) {
      msg = "Sí se llega a " + v + " con a lo sumo " + k + " aristas, con costo " + fmt(real) + ". Revise las aristas que entran a " + v + ".";
    } else if (entrada !== INF && real === INF) {
      msg = "Con a lo sumo " + k + " aristas todavía no se llega a " + v + ": ninguna arista que entra a " + v + " sale de un vértice alcanzado en la fila " + (k - 1) + ".";
    } else if (entrada < real) {
      msg = "Es demasiado bajo para " + k + " aristas. Ese costo corresponde a un camino con más aristas, que aparece en una fila posterior.";
    } else {
      msg = "dist[" + v + "] es el menor entre el valor de la fila " + (k - 1) + " (" + fmt(prev.d[v]) + ") y dist[u] + w sobre cada arista (u, " + v + "), con los dist[u] de la fila " + (k - 1) + ".";
    }
    return msg;
  }

  /* Revisa una fila completa: respuesta es un arreglo de enteros/INF. Devuelve {ok, errores:[{v, msg}]}. */
  function revisar(g, R, k, respuesta) {
    var errores = [], v = 0;
    while (v < g.n) {
      if (respuesta[v] !== R[k].d[v]) { errores.push({ v: v, msg: diagnosticoCelda(g, R, k, v, respuesta[v]) }); }
      v = v + 1;
    }
    return { ok: errores.length === 0, errores: errores };
  }

  function leerValor(texto) {
    var t = String(texto).trim().toLowerCase().replace("−", "-").replace("∞", "inf"), r;
    if (t === "inf" || t === "infinito") { r = INF; }
    else if (/^-?\d+$/.test(t)) { r = parseInt(t, 10); }
    else { r = null; }
    return r;
  }

  return { grafos: GRAFOS, adyacencia: adyacencia, pesoDe: pesoDe, filas: filas, explicar: explicar,
           revisar: revisar, leerValor: leerValor, cicloDesde: cicloDesde, pesoCiclo: pesoCiclo, fmt: fmt };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var GR = EJERCICIO.grafos, presetActual = 0, R = null, k = 0, mensajes = [];

    function g() { return GR[presetActual]; }

    function dibujar() {
      var gr = g(), G = EJERCICIO.adyacencia(gr), ult = k > 0 ? R[k - 1] : null;
      var noms = [], i = 0;
      while (i < gr.n) { noms.push(String(i)); i = i + 1; }
      var resalte = {}, ciclo = [];
      if (ult && ult.k > 0) {
        var q = 0;
        while (q < ult.mejoras.length) { resalte[ult.mejoras[q].u + "-" + ult.mejoras[q].v] = true; q = q + 1; }
        if (ult.k === gr.n && ult.mejoras.length > 0) { ciclo = EJERCICIO.cicloDesde(ult, ult.mejoras[0].v, gr.n); }
      }
      function enCiclo(u, v) {
        var j = 0, si = false;
        while (j < ciclo.length) { if (ciclo[j] === u && ciclo[(j + 1) % ciclo.length] === v) { si = true; } j = j + 1; }
        return si;
      }
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: gr.pos, G: G, nombres: noms, dirigido: true,
        peso: function (u, v) { return EJERCICIO.pesoDe(gr, u, v); },
        nodo: function (j) {
          var s = { relleno: "#ffffff", borde: "#6b7280", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (j === gr.s) { s.relleno = "#e5f3e6"; s.borde = "#2e7d32"; s.grueso = 3.4; }
          if (ult) { s.nota = "d = " + EJERCICIO.fmt(ult.d[j]); }
          return s;
        },
        arista: function (u, v) {
          var e = { color: "gris", grueso: 1.6 };
          if (enCiclo(u, v)) { e = { color: "rojo", grueso: 3.4 }; }
          else if (resalte[u + "-" + v]) { e = { color: "verde", grueso: 3.2 }; }
          return e;
        }
      });
    }

    function pintarTabla() {
      var gr = g(), h = "<tr><th>k</th>", v = 0, j = 0;
      while (v < gr.n) { h += "<th>dist[" + v + "]</th>"; v = v + 1; }
      h += "</tr>";
      while (j <= gr.hasta) {
        h += "<tr><th>" + j + (j === gr.n ? " (= n)" : "") + "</th>";
        v = 0;
        while (v < gr.n) {
          if (j < k) {
            var mejora = false, q = 0;
            while (q < R[j].mejoras.length) { if (R[j].mejoras[q].v === v) { mejora = true; } q = q + 1; }
            h += "<td" + (mejora ? " class='mejor'" : "") + ">" + EJERCICIO.fmt(R[j].d[v]) + "</td>";
          } else if (j === k) {
            h += "<td><input type='text' size='4' class='celda-in' id='in-" + v + "' autocomplete='off'></td>";
          } else {
            h += "<td class='pend'>·</td>";
          }
          v = v + 1;
        }
        h += "</tr>";
        j = j + 1;
      }
      document.getElementById("tabla").innerHTML = h;
    }

    function pintarMensajes() {
      var caja = document.getElementById("explicacion"), h = "", i = 0;
      while (i < mensajes.length) {
        h += "<p><b>Fila " + mensajes[i].k + ".</b> " + mensajes[i].texto + "</p>";
        i = i + 1;
      }
      caja.innerHTML = h;
    }

    function pintar() {
      var gr = g();
      document.getElementById("ver-texto").textContent = gr.texto;
      dibujar();
      pintarTabla();
      pintarMensajes();
      var fin = k > gr.hasta;
      document.getElementById("btn-comprobar").disabled = fin;
      document.getElementById("btn-ver").disabled = fin;
      document.getElementById("rot-fila").textContent = fin ? "completa" : String(k);
      var v = document.getElementById("veredicto");
      if (fin) {
        v.className = "veredicto bien";
        v.textContent = gr.hasta === gr.n
          ? "Tabla completa. La fila n sigue cambiando: hay un ciclo negativo alcanzable desde el origen y los valores de las últimas filas no son costos de caminos más cortos."
          : "Tabla completa. La fila " + gr.hasta + " es la respuesta: dist[v] es el costo del camino más corto de " + gr.s + " a v.";
      } else {
        v.className = "veredicto"; v.textContent = "";
      }
    }

    function cargar(i) {
      presetActual = i;
      R = EJERCICIO.filas(g());
      k = 0; mensajes = [];
      Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b, j) {
        b.classList.toggle("primario", j === i);
      });
      pintar();
    }

    function comprobar() {
      var gr = g(), resp = [], v = 0, vacio = false, malo = false;
      while (v < gr.n) {
        var x = EJERCICIO.leerValor(document.getElementById("in-" + v).value);
        if (x === null) { malo = true; }
        resp.push(x);
        v = v + 1;
      }
      var ver = document.getElementById("veredicto");
      if (malo) {
        ver.className = "veredicto mal";
        ver.textContent = "Cada casilla lleva un entero o inf.";
        return;
      }
      var r = EJERCICIO.revisar(gr, R, k, resp);
      if (r.ok) {
        mensajes.push({ k: k, texto: EJERCICIO.explicar(gr, R, k) });
        k = k + 1;
        pintar();
      } else {
        var txt = "", i = 0;
        while (i < r.errores.length) { txt += "dist[" + r.errores[i].v + "]: " + r.errores[i].msg + " "; i = i + 1; }
        ver.className = "veredicto mal";
        ver.textContent = txt;
        v = 0;
        while (v < gr.n) {
          document.getElementById("in-" + v).style.borderColor = resp[v] === R[k].d[v] ? "" : "#b3261e";
          v = v + 1;
        }
      }
    }

    function verFila() {
      var gr = g(), v = 0;
      while (v < gr.n) { document.getElementById("in-" + v).value = EJERCICIO.fmt(R[k].d[v]).replace("−", "-").replace("∞", "inf"); v = v + 1; }
    }

    var botones = "<span class='nota' style='margin-top:0'>Grafo:</span>", i = 0;
    while (i < GR.length) { botones += "<button data-k='" + i + "'>" + GR[i].boton + "</button>"; i = i + 1; }
    document.getElementById("presets-grafo").innerHTML = botones;
    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) {
      b.addEventListener("click", function () { cargar(parseInt(b.getAttribute("data-k"), 10)); });
    });
    document.getElementById("btn-comprobar").addEventListener("click", comprobar);
    document.getElementById("btn-ver").addEventListener("click", verFila);
    cargar(0);
  })();
}
