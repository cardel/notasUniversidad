/* Ejercicio interactivo: tres fallas en Kosaraju (clase 9). Las tres corren
   sobre el mismo grafo y ninguna da error: todas devuelven una lista de
   listas, y hay que mirarla para darse cuenta. */
var EJERCICIO = (function () {
  /* Siete vertices, cuatro componentes: {0,1}, {2,3}, {4} y {5,6}. El grafo
     de componentes tiene dos sumideros, {4} y {5,6}. */
  var ARISTAS = [[0, 1], [1, 0], [0, 2], [2, 3], [3, 2], [2, 4], [3, 5], [5, 6], [6, 5]];
  var N = 7;

  function grafo() {
    var G = [], i = 0;
    while (i < N) { G.push([]); i = i + 1; }
    i = 0;
    while (i < ARISTAS.length) { G[ARISTAS[i][0]].push(ARISTAS[i][1]); i = i + 1; }
    i = 0;
    while (i < N) { G[i].sort(function (a, b) { return a - b; }); i = i + 1; }
    return G;
  }

  function transpuesto(G) {
    var n = G.length, GT = [], i = 0, j;
    while (i < n) { GT.push([]); i = i + 1; }
    i = 0;
    while (i < n) {
      j = 0;
      while (j < G[i].length) { GT[G[i][j]].push(i); j = j + 1; }
      i = i + 1;
    }
    return GT;
  }

  function ordenPorFinalizacion(G, invertir) {
    var n = G.length, visitado = [], orden = [], i = 0;
    while (i < n) { visitado.push(false); i = i + 1; }
    function aux(v) {
      visitado[v] = true;
      var j = 0;
      while (j < G[v].length) { if (!visitado[G[v][j]]) { aux(G[v][j]); } j = j + 1; }
      orden.push(v);
    }
    i = 0;
    while (i < n) { if (!visitado[i]) { aux(i); } i = i + 1; }
    if (invertir) { orden.reverse(); }
    return orden;
  }

  function agrupar(n, comp, orden) {
    var claves = [], vistas = {}, i = 0;
    while (i < orden.length) {
      if (!vistas[comp[orden[i]]]) { vistas[comp[orden[i]]] = true; claves.push(comp[orden[i]]); }
      i = i + 1;
    }
    var grupos = {};
    i = 0;
    while (i < claves.length) { grupos[claves[i]] = []; i = i + 1; }
    i = 0;
    while (i < n) { grupos[comp[i]].push(i); i = i + 1; }
    var res = [];
    i = 0;
    while (i < claves.length) { res.push(grupos[claves[i]]); i = i + 1; }
    return res;
  }

  /* La version correcta. */
  function kosaraju(G) {
    var n = G.length, orden = ordenPorFinalizacion(G, true), GT = transpuesto(G);
    var comp = [], i = 0;
    while (i < n) { comp.push(null); i = i + 1; }
    function asignar(v, g) {
      if (comp[v] === null) {
        comp[v] = g;
        var j = 0;
        while (j < GT[v].length) { asignar(GT[v][j], g); j = j + 1; }
      }
    }
    i = 0;
    while (i < orden.length) { asignar(orden[i], orden[i]); i = i + 1; }
    return agrupar(n, comp, orden);
  }

  /* 1. La segunda pasada corre sobre G en vez de sobre el transpuesto. */
  function sobreG(G) {
    var n = G.length, orden = ordenPorFinalizacion(G, true);
    var comp = [], i = 0;
    while (i < n) { comp.push(null); i = i + 1; }
    function asignar(v, g) {
      if (comp[v] === null) {
        comp[v] = g;
        var j = 0;
        while (j < G[v].length) { asignar(G[v][j], g); j = j + 1; }
      }
    }
    i = 0;
    while (i < orden.length) { asignar(orden[i], orden[i]); i = i + 1; }
    return agrupar(n, comp, orden);
  }

  /* 2. Se olvida orden.reverse(): la lista queda por f creciente. */
  function sinReverse(G) {
    var n = G.length, orden = ordenPorFinalizacion(G, false), GT = transpuesto(G);
    var comp = [], i = 0;
    while (i < n) { comp.push(null); i = i + 1; }
    function asignar(v, g) {
      if (comp[v] === null) {
        comp[v] = g;
        var j = 0;
        while (j < GT[v].length) { asignar(GT[v][j], g); j = j + 1; }
      }
    }
    i = 0;
    while (i < orden.length) { asignar(orden[i], orden[i]); i = i + 1; }
    return agrupar(n, comp, orden);
  }

  /* 3. La recursion pasa u como nombre del componente en vez de g. */
  function nombreU(G) {
    var n = G.length, orden = ordenPorFinalizacion(G, true), GT = transpuesto(G);
    var comp = [], i = 0;
    while (i < n) { comp.push(null); i = i + 1; }
    function asignar(v, g) {
      if (comp[v] === null) {
        comp[v] = g;
        var j = 0;
        while (j < GT[v].length) { asignar(GT[v][j], GT[v][j]); j = j + 1; }
      }
    }
    i = 0;
    while (i < orden.length) { asignar(orden[i], orden[i]); i = i + 1; }
    return agrupar(n, comp, orden);
  }

  return {
    aristas: ARISTAS, n: N, grafo: grafo, transpuesto: transpuesto,
    ordenPorFinalizacion: ordenPorFinalizacion, kosaraju: kosaraju,
    sobreG: sobreG, sinReverse: sinReverse, nombreU: nombreU
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var G = EJERCICIO.grafo();
    var GT = EJERCICIO.transpuesto(G);
    var POS = [[0.0, 2.4], [0.0, 1.0], [1.3, 1.7], [2.5, 1.7], [1.5, 0.0], [3.7, 2.5], [3.7, 0.9]];

    function pintarConjunto(c) {
      return "{" + c.slice().sort(function (a, b) { return a - b; }).join(", ") + "}";
    }
    function pintarLista(l) { return l.map(pintarConjunto).join(", "); }

    function dibujar() {
      var n = G.length, ancho = 460, alto = 230, r = 16;
      var minX = 0.0, maxX = 3.7, minY = 0.0, maxY = 2.5;
      var mx = r + 20, my = r + 16;
      function X(k) { return mx + (POS[k][0] - minX) / (maxX - minX) * (ancho - 2 * mx); }
      function Y(k) { return my + (maxY - POS[k][1]) / (maxY - minY) * (alto - 2 * my); }
      function existe(a, b) {
        var j = 0, hay = false;
        while (j < G[a].length) { if (G[a][j] === b) { hay = true; } j = j + 1; }
        return hay;
      }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:500px'>";
      svg += "<defs><marker id='fg' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker></defs>";
      var u = 0, j;
      while (u < n) {
        j = 0;
        while (j < G[u].length) {
          var v = G[u][j];
          var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
          var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
          if (existe(v, u)) {
            var cx = (x1 + x2) / 2 - dy / dd * 24, cy = (y1 + y2) / 2 + dx / dd * 24;
            var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
            var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
            svg += "<path d='M" + (x1 + (cx - x1) / l1 * (r + 1)) + "," + (y1 + (cy - y1) / l1 * (r + 1)) +
                   " Q" + cx + "," + cy + " " + (x2 + (cx - x2) / l2 * (r + 3)) + "," + (y2 + (cy - y2) / l2 * (r + 3)) +
                   "' fill='none' stroke='#6b7280' stroke-width='1.7' marker-end='url(#fg)'/>";
          } else {
            svg += "<line x1='" + (x1 + dx / dd * (r + 1)) + "' y1='" + (y1 + dy / dd * (r + 1)) +
                   "' x2='" + (x2 - dx / dd * (r + 3)) + "' y2='" + (y2 - dy / dd * (r + 3)) +
                   "' stroke='#6b7280' stroke-width='1.7' marker-end='url(#fg)'/>";
          }
          j = j + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='" + r + "' fill='#ffffff' stroke='#d8dee6' stroke-width='2.2'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + u + "</text>";
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    var CORRECTO = EJERCICIO.kosaraju(G);
    var ORD = EJERCICIO.ordenPorFinalizacion(G, true);
    var SIN_INVERTIR = EJERCICIO.ordenPorFinalizacion(G, false);

    document.getElementById("ver-bien").textContent = pintarLista(CORRECTO);
    document.getElementById("ver-ord").textContent = "[" + ORD.join(", ") + "]";
    document.getElementById("ver-gt").textContent = GT.map(function (l, k) {
      return k + ": [" + l.join(", ") + "]";
    }).join(";  ");

    var CASOS = {
      sobreg: {
        correcta: "b",
        salida: EJERCICIO.sobreG(G),
        mensajes: {
          a: "La lista <code>ord</code> está bien calculada: es " + "[" + ORD.join(", ") + "]" + ", la misma de la versión correcta. La falla está una línea más abajo.",
          b: "Correcto: <code>asignar</code> recorre <code>G</code> y no <code>GT</code>. Sobre G, arrancar en el 0 alcanza todo lo que el 0 alcanza, que es el grafo entero: el recorrido se sale del componente por la primera arista que apunta hacia afuera. Sobre Gᵀ esas aristas apuntan hacia adentro y no hay por dónde escaparse.",
          c: "La comprobación <code>comp[v] is None</code> está bien: es la que detiene la recursión en los vértices ya asignados y la que hace que cada vértice entre al cuerpo una sola vez."
        },
        cierre: "Devuelve " + pintarLista(EJERCICIO.sobreG(G)) + ": un solo grupo con los siete vértices, porque desde el 0 se alcanza todo el grafo."
      },
      reverse: {
        correcta: "c",
        salida: EJERCICIO.sinReverse(G),
        mensajes: {
          a: "El recorrido está bien: agrega cada vértice cuando su llamada termina, que es justo lo que deja la lista por <i>f</i> creciente.",
          b: "El ciclo que arranca desde cada vértice sin visitar también está bien: sin él quedarían por fuera los vértices que no se alcanzan desde el 0.",
          c: "Correcto: falta <code>orden.reverse()</code>. La lista sale por <i>f</i> creciente, [" + SIN_INVERTIR.join(", ") + "], y las llamadas dejan de recorrer los componentes desde las fuentes hacia los sumideros. La segunda arranca en el 6, que está en el sumidero {5, 6}; en Gᵀ un sumidero pasa a ser fuente, el recorrido sube por las flechas invertidas y se lleva el componente de arriba."
        },
        cierre: "Devuelve " + pintarLista(EJERCICIO.sinReverse(G)) + ": junta en un solo grupo dos componentes que el grafo tiene separados."
      },
      nombre: {
        correcta: "a",
        salida: EJERCICIO.nombreU(G),
        mensajes: {
          a: "Correcto: la recursión pasa <code>u</code> como nombre del componente en vez de <code>g</code>. El nombre deja de ser el vértice que arrancó la asignación y pasa a ser cada vértice, así que ningún par queda con el mismo nombre.",
          b: "La lista <code>ord</code> y el transpuesto están bien; el recorrido llega a los vértices que tiene que llegar. Lo que se pierde es la etiqueta que los agrupa.",
          c: "La comprobación <code>comp[v] is None</code> sigue en su sitio y sigue deteniendo la recursión. El problema es qué se guarda cuando no se detiene."
        },
        cierre: "Devuelve " + pintarLista(EJERCICIO.nombreU(G)) + ": siete grupos de un vértice. Dos vértices quedan en el mismo componente solo si les tocó el mismo <code>g</code>, y aquí a cada uno le toca el suyo."
      }
    };

    Array.prototype.forEach.call(document.querySelectorAll(".caso"), function (carta) {
      var clave = carta.getAttribute("data-caso");
      var caso = CASOS[clave];
      Array.prototype.forEach.call(carta.querySelectorAll(".opciones button"), function (btn) {
        btn.addEventListener("click", function () {
          var op = btn.getAttribute("data-op");
          var v = carta.querySelector(".veredicto");
          var s = carta.querySelector(".salida");
          v.className = op === caso.correcta ? "veredicto bien" : "veredicto mal";
          v.innerHTML = caso.mensajes[op];
          if (op === caso.correcta) {
            s.style.display = "block";
            s.innerHTML = "<b>Lo que devuelve:</b> " + pintarLista(caso.salida) +
              "<br><b>Lo correcto:</b> " + pintarLista(CORRECTO) + "<br>" + caso.cierre;
          }
        });
      });
    });

    document.getElementById("btn-cuantos").addEventListener("click", function () {
      var campo = document.getElementById("cuantos");
      var v = document.getElementById("veredicto-cuantos");
      var valor = parseInt(campo.value, 10);
      var total = EJERCICIO.sinReverse(G).length;
      if (isNaN(valor)) {
        v.className = "veredicto mal"; v.textContent = "Escriba un número primero.";
      } else if (valor === total) {
        v.className = "veredicto bien";
        v.innerHTML = "Correcto: " + total + ", contra " + CORRECTO.length + " de la versión correcta. Devuelve " +
          pintarLista(EJERCICIO.sinReverse(G)) + ". No es que pierda vértices: los junta mal.";
      } else if (valor === CORRECTO.length) {
        v.className = "veredicto mal";
        v.innerHTML = "Ese es el número correcto, " + CORRECTO.length + ". La versión sin invertir da otro: arranca por el vértice de <i>f</i> más pequeño y desde ahí, en Gᵀ, alcanza más de un componente.";
      } else if (valor === 1) {
        v.className = "veredicto mal";
        v.innerHTML = "No se funde todo en uno: el 4 queda aparte. Cuando le llega el turno, lo único que sale de él en Gᵀ es la arista hacia el 2, que ya tiene componente, y la recursión se detiene ahí.";
      } else {
        v.className = "veredicto mal";
        v.innerHTML = "No coincide. La lista sin invertir es [" + SIN_INVERTIR.join(", ") +
          "]; arranque la segunda pasada por su primer vértice, sobre Gᵀ, y vea hasta dónde llega.";
      }
    });

    dibujar();
  })();
}
