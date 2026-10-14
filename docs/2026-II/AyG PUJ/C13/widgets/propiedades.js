/* Ejercicio interactivo: las propiedades de la relajacion (CLRS 24.5), clase 12.
   El estado de d y pi sale de aplicar relajar (la del codigo de la clase) a una
   sucesion de aristas, no de valores escritos a mano. */
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

  var OPCIONES = [
    { id: "tri",   texto: "Desigualdad triangular (Lema 24.10)" },
    { id: "cota",  texto: "Cota superior (Lema 24.11)" },
    { id: "aus",   texto: "Ausencia de camino (Corolario 24.12)" },
    { id: "conv",  texto: "Convergencia (Lema 24.14)" },
    { id: "cam",   texto: "Relajación de caminos (Lema 24.15)" },
    { id: "falsa", texto: "La afirmación es falsa" }
  ];

  var GRAFOS = [
    { boton: "Seis vértices, tres relajadas",
      texto: "Grafo dirigido con pesos, fuente 0. Se relajaron, en este orden, las aristas (0,1), (0,2) y (1,3). Las demás siguen sin tocarse.",
      n: 6, s: 0,
      aristas: [[0, 1, 3], [0, 2, 7], [1, 2, -2], [1, 3, 6], [2, 3, 1], [2, 4, 5], [3, 4, 2], [5, 3, 1]],
      secuencia: [[0, 1], [0, 2], [1, 3]],
      pos: [[0.0, 1.5], [1.6, 2.6], [1.6, 0.4], [3.4, 1.5], [5.0, 1.5], [3.4, 0.0]],
      afirmaciones: [
        { texto: "Para la arista (2,3): δ(0,3) ≤ δ(0,2) + w(2,3).", correcta: "tri",
          por: {
            tri: "Desigualdad triangular: para toda arista (u,v), δ(s,v) ≤ δ(s,u) + w(u,v). Aquí δ(0,3) = 2 ≤ δ(0,2) + w(2,3) = 1 + 1. Habla de las distancias reales, no de d, y vale sin haber relajado nada.",
            cota: "La cota superior compara d[v] con δ(s,v). La afirmación no menciona ningún d: compara dos distancias reales a través de una arista, que es lo que dice la desigualdad triangular.",
            aus: "Ausencia de camino habla de vértices que la fuente no alcanza. El 3 sí se alcanza (δ(0,3) = 2); la afirmación acota una distancia con la de otro vértice más el peso de una arista.",
            conv: "Convergencia garantiza un valor de d después de relajar una arista. Aquí no se relaja nada ni aparece d.",
            cam: "Relajación de caminos habla de relajar en orden las aristas de un camino más corto. La afirmación no menciona relajaciones.",
            falsa: "La afirmación es verdadera: δ(0,3) = 2, δ(0,2) = 1 y w(2,3) = 1, de modo que 2 ≤ 1 + 1. Vale para cualquier arista del grafo."
          } },
        { texto: "Ninguna sucesión de relajaciones puede dejar d[2] por debajo de 1.", correcta: "cota",
          por: {
            tri: "La desigualdad triangular compara distancias reales por una arista. Aquí la pregunta es hasta dónde puede bajar d[2] al relajar, y eso lo acota la cota superior.",
            cota: "Cota superior: d[v] ≥ δ(s,v) en todo momento. Con δ(0,2) = 1, d[2] = 7 puede bajar, pero nunca de 1.",
            aus: "Ausencia de camino es para vértices inalcanzables. Al 2 se llega por 0, 1, 2 con peso 3 + (-2) = 1.",
            conv: "Convergencia dice cuándo d[v] alcanza δ(s,v). Lo que se afirma aquí es que d[2] nunca queda por debajo de δ(0,2), y eso lo da la cota superior.",
            cam: "Relajación de caminos asegura que d llega a δ si se relajan en orden las aristas de un camino más corto. La afirmación habla de un piso, no de una llegada.",
            falsa: "La afirmación es verdadera: como d[2] ≥ δ(0,2) = 1 siempre, ninguna relajación deja d[2] en 0 o menos."
          } },
        { texto: "Después de relajar cualquier cantidad de aristas, en cualquier orden, d[5] sigue valiendo ∞.", correcta: "aus",
          por: {
            tri: "La desigualdad triangular compara distancias reales por una arista; con δ(0,5) = ∞ no dice nada del valor que toma d[5].",
            cota: "Con δ(0,5) = ∞, la cota d[5] ≥ ∞ sí implica d[5] = ∞, y así se prueba el corolario. Pero la propiedad que enuncia este caso, el de un vértice sin camino desde la fuente, es la ausencia de camino.",
            aus: "Ausencia de camino: ninguna arista entra al 5, así que no hay camino de 0 a 5 y d[5] vale ∞ siempre. Relajar una arista con d[u] = ∞ no cambia nada.",
            conv: "Convergencia necesita un camino más corto desde la fuente hasta v. A 5 no llega ninguno.",
            cam: "Relajación de caminos necesita las aristas de un camino más corto, y de 0 a 5 no hay camino.",
            falsa: "La afirmación es verdadera: sin camino de 0 a 5, ninguna relajación puede darle a d[5] un valor finito."
          } },
        { texto: "Si ahora se relaja la arista (1,2), d[2] queda en 1.", correcta: "conv",
          por: {
            tri: "La desigualdad triangular no habla de d ni de relajar; compara distancias reales.",
            cota: "La cota dice que d[2] no baja de 1, no que llegue a 1. Para llegar hace falta que d[1] ya valga δ(0,1), que es la hipótesis de la convergencia.",
            aus: "El 2 sí se alcanza desde 0; la ausencia de camino no aplica.",
            conv: "Convergencia: 0, 1, 2 es un camino más corto a 2 y d[1] = 3 = δ(0,1) antes de relajar (1,2). Entonces d[2] = 3 + (-2) = 1 = δ(0,2).",
            cam: "Relajación de caminos generaliza la convergencia a varias aristas en orden. Aquí queda una sola arista por relajar con d[1] ya correcto, que es justo el caso de la convergencia.",
            falsa: "La afirmación es verdadera: 3 + (-2) = 1 es menor que 7, así que d[2] baja a 1 = δ(0,2)."
          } }
      ] },
    { boton: "Seis vértices, cuatro relajadas",
      texto: "Otro grafo dirigido con pesos, fuente 0. Se relajaron, en este orden, las aristas (0,1), (0,2), (1,3) y (1,4).",
      n: 6, s: 0,
      aristas: [[0, 1, 5], [0, 2, 2], [1, 3, 4], [1, 4, 7], [2, 1, -1], [2, 3, 9], [3, 4, -3], [4, 5, 2]],
      secuencia: [[0, 1], [0, 2], [1, 3], [1, 4]],
      pos: [[0.0, 1.5], [1.6, 2.7], [1.6, 0.3], [3.4, 2.7], [4.6, 1.5], [5.6, 0.3]],
      afirmaciones: [
        { texto: "Con unas cuantas relajaciones más, d[1] puede llegar a 0.", correcta: "falsa",
          por: {
            tri: "La desigualdad triangular compara distancias reales por una arista; no sirve para decidir qué valores puede tomar d[1].",
            cota: "La cota superior no respalda la afirmación, la refuta: d[1] ≥ δ(0,1) = 1 en todo momento, de modo que d[1] no llega a 0.",
            aus: "El 1 sí se alcanza desde 0; la ausencia de camino no aplica.",
            conv: "Convergencia dice cuándo d[1] llega a δ(0,1) = 1, y 1 es el piso. No permite bajar más.",
            cam: "Relajación de caminos termina en δ(0,1) = 1, no en 0.",
            falsa: "La afirmación es falsa: δ(0,1) = 1, por 0, 2, 1 con peso 2 - 1, y por la cota superior d[1] ≥ 1. Llegar a 0 pediría un camino de peso 0 que no existe."
          } },
        { texto: "Si se relajan (0,2), (2,1), (1,3), (3,4) y (4,5) en ese orden, con otras relajaciones en medio, d[5] termina en 4.", correcta: "cam",
          por: {
            tri: "La desigualdad triangular no habla de relajaciones ni de d.",
            cota: "La cota superior dice que d[5] ≥ 4 siempre, pero no que llegue a 4. Para llegar hace falta relajar en orden el camino.",
            aus: "El 5 sí se alcanza desde 0 por 0, 2, 1, 3, 4, 5; la ausencia de camino no aplica.",
            conv: "Convergencia cubre una sola arista (u,v) cuando d[u] ya vale δ(s,u). Aquí son cinco aristas encadenadas y lo que las cubre es la relajación de caminos.",
            cam: "Relajación de caminos: 0, 2, 1, 3, 4, 5 es un camino más corto a 5 (2 - 1 + 4 - 3 + 2 = 4) y sus aristas se relajan en ese orden. Lo que se relaje entre ellas no importa: d[5] = 4 = δ(0,5).",
            falsa: "La afirmación es verdadera: el camino 0, 2, 1, 3, 4, 5 pesa 4 = δ(0,5) y sus aristas se relajan en orden."
          } },
        { texto: "Como d[2] = 2 = δ(0,2), relajar (2,3) deja d[3] = 5.", correcta: "falsa",
          por: {
            tri: "δ(0,3) = 5 ≤ δ(0,2) + w(2,3) = 11 es verdadera, pero habla de distancias reales y no de lo que deja una relajación.",
            cota: "La cota se cumple (d[3] queda en 9 ≥ 5), pero no permite afirmar que d[3] llegue a 5.",
            aus: "El 3 sí se alcanza desde 0; la ausencia de camino no aplica.",
            conv: "Convergencia pide que s ⇝ u → v sea un camino más corto. Aquí 0, 2, 3 pesa 2 + 9 = 11 y δ(0,3) = 5: la hipótesis falla.",
            cam: "Relajación de caminos pide las aristas de un camino más corto, y (2,3) no está en ninguno de los caminos más cortos a 3.",
            falsa: "La afirmación es falsa: 2 + 9 = 11 no es menor que d[3] = 9, así que relajar (2,3) no cambia nada. d[3] llega a 5 por 0, 2, 1, 3, un camino que no usa (2,3)."
          } },
        { texto: "Aunque nunca se relaje la arista (3,4), d[4] puede llegar a 2 = δ(0,4).", correcta: "falsa",
          por: {
            tri: "La desigualdad triangular habla de distancias reales y no dice qué aristas hay que relajar.",
            cota: "La cota dice que d[4] ≥ 2, lo cual no impide llegar a 2; pero llegar exige relajar (3,4), como se ve en el camino.",
            aus: "El 4 sí se alcanza desde 0; la ausencia de camino no aplica.",
            conv: "Convergencia necesita relajar la última arista del camino más corto, que aquí es (3,4). Si no se relaja, no actúa.",
            cam: "La propiedad exige relajar todas las aristas del camino más corto, (3,4) incluida. Con una que falte ya no garantiza nada.",
            falsa: "La afirmación es falsa: el único camino más corto a 4 es 0, 2, 1, 3, 4 y termina en (3,4). Sin relajarla, lo mejor que sale es por (1,4): 1 + 7 = 8."
          } }
      ] }
  ];

  function relajar(u, v, w, d, pi) {
    var cambio = false;
    if (d[u] + w < d[v]) { d[v] = d[u] + w; pi[v] = u; cambio = true; }
    return cambio;
  }

  function pesoDe(g, u, v) {
    var k = 0, w = null;
    while (k < g.aristas.length) { if (g.aristas[k][0] === u && g.aristas[k][1] === v) { w = g.aristas[k][2]; } k = k + 1; }
    return w;
  }

  /* Estado de d y pi tras aplicar relajar a la sucesion de aristas. */
  function estado(g, secuencia) {
    var d = [], pi = [], i = 0, sec = secuencia || g.secuencia;
    while (i < g.n) { d.push(INF); pi.push(-1); i = i + 1; }
    d[g.s] = 0;
    i = 0;
    while (i < sec.length) { relajar(sec[i][0], sec[i][1], pesoDe(g, sec[i][0], sec[i][1]), d, pi); i = i + 1; }
    return { d: d, pi: pi };
  }

  /* delta(s, v): relajar todas las aristas hasta que nada cambie. */
  function delta(g, sinArista) {
    var d = [], pi = [], i = 0, cambio = true;
    while (i < g.n) { d.push(INF); pi.push(-1); i = i + 1; }
    d[g.s] = 0;
    while (cambio) {
      cambio = false;
      var k = 0;
      while (k < g.aristas.length) {
        var a = g.aristas[k];
        var omitir = sinArista && sinArista[0] === a[0] && sinArista[1] === a[1];
        if (!omitir && relajar(a[0], a[1], a[2], d, pi)) { cambio = true; }
        k = k + 1;
      }
    }
    return d;
  }

  function adyacencia(g) {
    var G = [], i = 0;
    while (i < g.n) { G.push([]); i = i + 1; }
    g.aristas.forEach(function (a) { G[a[0]].push(a[1]); });
    return G;
  }

  return { opciones: OPCIONES, grafos: GRAFOS, estado: estado, delta: delta, adyacencia: adyacencia, pesoDe: pesoDe };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var GRAFOS = EJERCICIO.grafos, presetActual = 0, comprobado = false;
    var F = function (x) { return x === Infinity ? "∞" : String(x).replace("-", "−"); };

    function g() { return GRAFOS[presetActual]; }

    function dibujar() {
      var p = g(), est = EJERCICIO.estado(p), nom = [], i = 0;
      while (i < p.n) { nom.push(String(i)); i = i + 1; }
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: p.pos, G: EJERCICIO.adyacencia(p), nombres: nom,
        peso: function (u, v) { return EJERCICIO.pesoDe(p, u, v); },
        nodo: function (k) {
          return { relleno: k === p.s ? "#e7f2e8" : "#e3edf8", borde: k === p.s ? "#2e7d32" : "#1f5fa8",
                   tinta: "#24292f", grueso: 2.2, nota: "d = " + F(est.d[k]) };
        },
        arista: function () { return { color: "gris", grueso: 1.8 }; }
      });
    }

    function tabla() {
      var p = g(), est = EJERCICIO.estado(p), dl = EJERCICIO.delta(p), i = 0;
      var h = "<tr><th>Vértice</th>", a = "<tr><th><i>d</i></th>", b = "<tr><th><i>pi</i></th>", c = "<tr><th>δ(" + p.s + ", ·)</th>";
      while (i < p.n) {
        h += "<th>" + i + "</th>"; a += "<td>" + F(est.d[i]) + "</td>";
        b += "<td>" + (est.pi[i] === -1 ? "-1" : est.pi[i]) + "</td>"; c += "<td>" + F(dl[i]) + "</td>";
        i = i + 1;
      }
      document.getElementById("tabla-estado").innerHTML = "<thead>" + h + "</tr></thead><tbody>" + a + "</tr>" + b + "</tr>" + c + "</tr></tbody>";
    }

    function armar() {
      var p = g(), h = "", k = 0;
      comprobado = false;
      while (k < p.afirmaciones.length) {
        var opts = "";
        EJERCICIO.opciones.forEach(function (o) {
          opts += "<label style='display:block;margin:0.2rem 0;cursor:pointer'><input type='radio' name='af-" + k + "' value='" + o.id + "'> " + o.texto + "</label>";
        });
        h += "<div style='border:1px solid var(--borde);border-radius:8px;padding:0.5rem 0.7rem;margin-bottom:0.7rem'>" +
             "<p style='margin:0 0 0.3rem'><b>" + (k + 1) + ".</b> " + p.afirmaciones[k].texto + "</p>" + opts +
             "<div id='ver-" + k + "' class='veredicto'></div></div>";
        k = k + 1;
      }
      document.getElementById("afirmaciones").innerHTML = h;
      document.getElementById("resumen").className = "veredicto";
      document.getElementById("resumen").textContent = "";
      document.getElementById("ver-texto").textContent = p.texto;
      dibujar();
      tabla();
    }

    function comprobar() {
      var p = g(), aciertos = 0, sinResponder = 0, k = 0;
      while (k < p.afirmaciones.length) {
        var marca = document.querySelector("input[name=af-" + k + "]:checked");
        var v = document.getElementById("ver-" + k);
        if (marca === null) {
          sinResponder = sinResponder + 1;
          v.className = "veredicto mal";
          v.textContent = "Escoja una opción.";
        } else {
          var ok = marca.value === p.afirmaciones[k].correcta;
          if (ok) { aciertos = aciertos + 1; }
          v.className = ok ? "veredicto bien" : "veredicto mal";
          v.textContent = (ok ? "Acierto. " : "Error. ") + p.afirmaciones[k].por[marca.value] +
                          (ok ? "" : " La respuesta es: " + EJERCICIO.opciones.filter(function (o) { return o.id === p.afirmaciones[k].correcta; })[0].texto + ".");
        }
        k = k + 1;
      }
      var r = document.getElementById("resumen");
      r.className = aciertos === p.afirmaciones.length ? "veredicto bien" : "veredicto mal";
      r.textContent = aciertos + " de " + p.afirmaciones.length + " bien" + (sinResponder > 0 ? "; faltan " + sinResponder + " por responder." : ".");
    }

    document.getElementById("btn-comprobar").addEventListener("click", comprobar);
    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        armar();
      });
    });
    armar();
  })();
}
