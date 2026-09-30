/* Ejercicio interactivo: el grafo transpuesto y el grafo de componentes
   (clase 9). Todo se calcula con el codigo de la clase: grafo_transpuesto,
   orden_por_finalizacion y kosaraju. */
var EJERCICIO = (function () {
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

  function ordenPorFinalizacion(G) {
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
    orden.reverse();
    return orden;
  }

  function kosaraju(G) {
    var n = G.length, orden = ordenPorFinalizacion(G), GT = transpuesto(G);
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
    var claves = [], vistas = {};
    i = 0;
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

  /* El indice del componente de cada vertice, segun una lista de componentes. */
  function indiceDeComponente(n, componentes) {
    var comp = [], i = 0, c, t;
    while (i < n) { comp.push(-1); i = i + 1; }
    c = 0;
    while (c < componentes.length) {
      t = 0;
      while (t < componentes[c].length) { comp[componentes[c][t]] = c; t = t + 1; }
      c = c + 1;
    }
    return comp;
  }

  /* El grafo de componentes: una arista por cada par de componentes unido
     por al menos una arista de G, sin lazos y sin repetir. */
  function condensacion(G, componentes) {
    var comp = indiceDeComponente(G.length, componentes);
    var vistas = {}, aristas = [], u = 0, j;
    while (u < G.length) {
      j = 0;
      while (j < G[u].length) {
        var a = comp[u], b = comp[G[u][j]];
        if (a !== b && !vistas[a + "-" + b]) {
          vistas[a + "-" + b] = true;
          aristas.push([a, b, u, G[u][j]]);
        }
        j = j + 1;
      }
      u = u + 1;
    }
    return aristas;
  }

  /* El camino mas corto de origen a destino, o null si no hay. */
  function camino(G, origen, destino) {
    var n = G.length, previo = [], visitado = [], cola = [origen], cabeza = 0, i = 0;
    while (i < n) { previo.push(-1); visitado.push(false); i = i + 1; }
    visitado[origen] = true;
    while (cabeza < cola.length) {
      var w = cola[cabeza];
      cabeza = cabeza + 1;
      var j = 0;
      while (j < G[w].length) {
        if (!visitado[G[w][j]]) { visitado[G[w][j]] = true; previo[G[w][j]] = w; cola.push(G[w][j]); }
        j = j + 1;
      }
    }
    var res = null;
    if (visitado[destino]) {
      res = [destino];
      var t = destino;
      while (previo[t] !== -1) { t = previo[t]; res.push(t); }
      res.reverse();
    }
    return res;
  }

  /* Dos listas de componentes son el mismo reparto si, ordenadas, coinciden. */
  function mismoReparto(a, b) {
    function normal(lista) {
      return lista.map(function (c) { return c.slice().sort(function (x, y) { return x - y; }); })
        .sort(function (p, q) { return p[0] - q[0]; });
    }
    return JSON.stringify(normal(a)) === JSON.stringify(normal(b));
  }

  return {
    transpuesto: transpuesto, kosaraju: kosaraju, condensacion: condensacion,
    camino: camino, mismoReparto: mismoReparto,
    indiceDeComponente: indiceDeComponente, ordenPorFinalizacion: ordenPorFinalizacion
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function dirigido(n, aristas) {
      var G = [], i = 0;
      while (i < n) { G.push([]); i = i + 1; }
      i = 0;
      while (i < aristas.length) { G[aristas[i][0]].push(aristas[i][1]); i = i + 1; }
      i = 0;
      while (i < n) { G[i].sort(function (a, b) { return a - b; }); i = i + 1; }
      return G;
    }

    var ARISTAS = [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4], [4, 3], [2, 5],
                   [5, 6], [6, 7], [7, 5], [4, 6], [6, 8], [3, 8]];
    var G = dirigido(9, ARISTAS);
    var GT = EJERCICIO.transpuesto(G);
    var POS = [[0.0, 1.9], [1.0, 2.9], [1.0, 0.9], [2.3, 3.3], [2.3, 2.2],
               [1.9, 0.0], [3.4, 0.5], [2.45, 1.25], [4.4, 1.8]];
    var SCC = EJERCICIO.kosaraju(G);
    var COMP = EJERCICIO.indiceDeComponente(9, SCC);
    var CONDENSA = EJERCICIO.condensacion(G, SCC);
    var COLORES = [
      { relleno: "#e7f2e8", borde: "#2e7d32" },
      { relleno: "#fdf1dc", borde: "#e8a13d" },
      { relleno: "#e3edf8", borde: "#1f5fa8" },
      { relleno: "#efe4f7", borde: "#6b3fa0" },
      { relleno: "#fbe9e7", borde: "#b3261e" }
    ];
    var NOMBRES = ["A", "B", "C", "D", "E"];

    var mostrandoT = false;
    var pintando = false;
    var resaltado = null;

    function pintarConjunto(c) {
      return "{" + c.slice().sort(function (a, b) { return a - b; }).join(", ") + "}";
    }

    function dibujar() {
      var actual = mostrandoT ? GT : G, n = 9;
      var ancho = 470, alto = 270, r = 16;
      var minX = POS[0][0], maxX = POS[0][0], minY = POS[0][1], maxY = POS[0][1], i = 0;
      while (i < n) {
        if (POS[i][0] < minX) { minX = POS[i][0]; }
        if (POS[i][0] > maxX) { maxX = POS[i][0]; }
        if (POS[i][1] < minY) { minY = POS[i][1]; }
        if (POS[i][1] > maxY) { maxY = POS[i][1]; }
        i = i + 1;
      }
      var mx = r + 20, my = r + 18;
      function X(k) { return mx + (POS[k][0] - minX) / (maxX - minX) * (ancho - 2 * mx); }
      function Y(k) { return my + (maxY - POS[k][1]) / (maxY - minY) * (alto - 2 * my); }
      function existe(a, b) {
        var j = 0, hay = false;
        while (j < actual[a].length) { if (actual[a][j] === b) { hay = true; } j = j + 1; }
        return hay;
      }
      function enCamino(a, b) {
        var t = 0, hay = false;
        if (resaltado !== null) {
          while (t + 1 < resaltado.length) {
            if (resaltado[t] === a && resaltado[t + 1] === b) { hay = true; }
            t = t + 1;
          }
        }
        return hay;
      }

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:520px'>";
      svg += "<defs>";
      svg += "<marker id='fg' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker>";
      svg += "<marker id='fr' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#b3261e'/></marker>";
      svg += "</defs>";
      var u = 0, j;
      while (u < n) {
        j = 0;
        while (j < actual[u].length) {
          var v = actual[u][j];
          var marcada = enCamino(u, v);
          var trazo = marcada ? "#b3261e" : "#6b7280";
          var punta = marcada ? "url(#fr)" : "url(#fg)";
          var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
          var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
          if (existe(v, u)) {
            var cx = (x1 + x2) / 2 - dy / dd * 24, cy = (y1 + y2) / 2 + dx / dd * 24;
            var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
            var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
            svg += "<path d='M" + (x1 + (cx - x1) / l1 * (r + 1)) + "," + (y1 + (cy - y1) / l1 * (r + 1)) +
                   " Q" + cx + "," + cy + " " + (x2 + (cx - x2) / l2 * (r + 3)) + "," + (y2 + (cy - y2) / l2 * (r + 3)) +
                   "' fill='none' stroke='" + trazo + "' stroke-width='" + (marcada ? 3 : 1.7) + "' marker-end='" + punta + "'/>";
          } else {
            svg += "<line x1='" + (x1 + dx / dd * (r + 1)) + "' y1='" + (y1 + dy / dd * (r + 1)) +
                   "' x2='" + (x2 - dx / dd * (r + 3)) + "' y2='" + (y2 - dy / dd * (r + 3)) +
                   "' stroke='" + trazo + "' stroke-width='" + (marcada ? 3 : 1.7) + "' marker-end='" + punta + "'/>";
          }
          j = j + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        var col = pintando ? COLORES[COMP[u] % COLORES.length] : { relleno: "#ffffff", borde: "#d8dee6" };
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='" + r + "' fill='" + col.relleno +
               "' stroke='" + col.borde + "' stroke-width='2.2'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + u + "</text>";
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
      document.getElementById("ver-cual").textContent = mostrandoT
        ? "Gᵀ: las mismas aristas con la punta al otro lado."
        : "G: el grafo tal como viene.";
    }

    function dibujarCondensacion() {
      var ancho = 470, alto = 170;
      var pos = [[0.2, 1.0], [1.4, 1.7], [1.4, 0.3], [2.6, 1.0]];
      var minX = 0.2, maxX = 2.6, minY = 0.3, maxY = 1.7;
      var anchoCaja = 86, altoCaja = 34;
      function X(k) { return 60 + (pos[k][0] - minX) / (maxX - minX) * (ancho - 130); }
      function Y(k) { return 30 + (maxY - pos[k][1]) / (maxY - minY) * (alto - 70); }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:520px'>";
      svg += "<defs><marker id='fc' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker></defs>";
      var i = 0;
      while (i < CONDENSA.length) {
        var a = CONDENSA[i][0], b = CONDENSA[i][1];
        var x1 = X(a), y1 = Y(a), x2 = X(b), y2 = Y(b);
        var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
        var rx = anchoCaja / 2 + 4, ry = altoCaja / 2 + 4;
        var t1 = Math.min(rx / Math.abs(dx || 0.001), ry / Math.abs(dy || 0.001));
        svg += "<line x1='" + (x1 + dx * t1) + "' y1='" + (y1 + dy * t1) +
               "' x2='" + (x2 - dx * t1) + "' y2='" + (y2 - dy * t1) +
               "' stroke='#6b7280' stroke-width='1.8' marker-end='url(#fc)'/>";
        i = i + 1;
      }
      i = 0;
      while (i < SCC.length) {
        var col = COLORES[i % COLORES.length];
        svg += "<rect x='" + (X(i) - anchoCaja / 2) + "' y='" + (Y(i) - altoCaja / 2) + "' width='" + anchoCaja +
               "' height='" + altoCaja + "' rx='9' fill='" + col.relleno + "' stroke='" + col.borde + "' stroke-width='2.2'/>";
        svg += "<text x='" + X(i) + "' y='" + (Y(i) + 5) + "' text-anchor='middle' font-size='13' font-weight='700' fill='#24292f'>" +
               NOMBRES[i] + " " + pintarConjunto(SCC[i]) + "</text>";
        i = i + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-condensa").innerHTML = svg;
    }

    /* Tarjeta 1: la prediccion. */
    document.getElementById("btn-comprobar").addEventListener("click", function () {
      var campo = document.getElementById("prediccion");
      var v = document.getElementById("veredicto");
      var valor = parseInt(campo.value, 10);
      if (isNaN(valor)) {
        v.className = "veredicto mal"; v.textContent = "Escriba un número primero.";
      } else if (valor === SCC.length) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: " + SCC.length + ". " + SCC.map(pintarConjunto).join(", ") +
          ". Pinte los componentes en el dibujo y siga los ciclos con el dedo.";
      } else if (valor === 9) {
        v.className = "veredicto mal";
        v.textContent = "Ese es el número de vértices. Un vértice forma componente por su cuenta solo cuando no comparte ida y vuelta con nadie; aquí hay tres ciclos que agrupan vértices.";
      } else if (valor === 1) {
        v.className = "veredicto mal";
        v.textContent = "Con un solo componente se podría ir del 8 a cualquier otro vértice. Mire qué flechas salen del 8.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Busque los ciclos del dibujo: cada ciclo agrupa a todos sus vértices, y lo que no esté en ningún ciclo con nadie queda solo.";
      }
    });

    document.getElementById("btn-voltear").addEventListener("click", function () {
      mostrandoT = !mostrandoT;
      resaltado = null;
      document.getElementById("btn-voltear").textContent = mostrandoT ? "Ver G" : "Ver Gᵀ";
      dibujar();
    });

    document.getElementById("btn-pintar").addEventListener("click", function () {
      pintando = !pintando;
      document.getElementById("btn-pintar").textContent = pintando ? "Quitar los colores" : "Pintar los componentes";
      dibujar();
    });

    /* Tarjeta 2: los componentes calculados sobre G y sobre Gᵀ. */
    document.getElementById("btn-comparar").addEventListener("click", function () {
      var enG = EJERCICIO.kosaraju(G);
      var enGT = EJERCICIO.kosaraju(GT);
      var v = document.getElementById("veredicto-comparar");
      v.className = "veredicto bien";
      v.innerHTML = "Sobre G: " + enG.map(pintarConjunto).join(", ") +
        ".<br>Sobre Gᵀ: " + enGT.map(pintarConjunto).join(", ") +
        ".<br>" + (EJERCICIO.mismoReparto(enG, enGT)
          ? "Los mismos grupos. Cambia el orden en que salen, porque en Gᵀ las flechas del grafo de componentes van al revés y el primero pasa a ser el último."
          : "Los grupos no coinciden.");
    });

    /* Tarjeta 3: un camino y su reverso. */
    document.getElementById("btn-camino").addEventListener("click", function () {
      var a = parseInt(document.getElementById("origen").value, 10);
      var b = parseInt(document.getElementById("destino").value, 10);
      var v = document.getElementById("veredicto-camino");
      if (isNaN(a) || isNaN(b) || a < 0 || a > 8 || b < 0 || b > 8) {
        v.className = "veredicto mal"; v.textContent = "Escriba dos vértices entre 0 y 8.";
      } else {
        var enG = EJERCICIO.camino(G, a, b);
        if (enG === null) {
          v.className = "veredicto mal";
          v.textContent = "En G no hay camino de " + a + " a " + b + ", y en Gᵀ tampoco lo hay de " + b + " a " + a + ": la ausencia también se refleja.";
          resaltado = null;
        } else {
          var alReves = enG.slice(); alReves.reverse();
          v.className = "veredicto bien";
          v.innerHTML = "En G: " + enG.join(" → ") + ".<br>En Gᵀ: " + alReves.join(" → ") +
            ". Es el mismo camino leído de derecha a izquierda, y por eso pedir ida y vuelta en G es pedir lo mismo en Gᵀ.";
          resaltado = mostrandoT ? alReves : enG;
          dibujar();
        }
      }
    });

    /* Tarjeta 4: cuantas aristas tiene el grafo de componentes. */
    document.getElementById("btn-aristas").addEventListener("click", function () {
      var campo = document.getElementById("cuantas");
      var v = document.getElementById("veredicto-aristas");
      var valor = parseInt(campo.value, 10);
      var total = CONDENSA.length;
      var detalle = CONDENSA.map(function (a) {
        return NOMBRES[a[0]] + " → " + NOMBRES[a[1]] + " por " + a[2] + " → " + a[3];
      }).join("; ");
      if (isNaN(valor)) {
        v.className = "veredicto mal"; v.textContent = "Escriba un número primero.";
      } else if (valor === total) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: " + total + ". " + detalle + ".";
      } else if (valor === 13) {
        v.className = "veredicto mal";
        v.textContent = "Esas son las trece aristas de G. Las que quedan dentro de un componente no aparecen —serían lazos— y varias aristas entre los mismos dos componentes se cuentan una sola vez.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Recorra las trece aristas de G, descarte las que empiezan y terminan en el mismo componente, y de las que quedan cuente parejas distintas de componentes.";
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-dag button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        var v = document.getElementById("veredicto-dag");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Correcto. Un ciclo entre componentes distintos daría camino de ida y de vuelta entre todos sus vértices, y entonces esos componentes serían uno solo: ninguno habría sido maximal. Por eso el grafo de componentes admite orden topológico, y ese orden es el que Kosaraju recorre.";
        } else if (op === "aristas") {
          v.className = "veredicto mal";
          v.textContent = "No es por el número de aristas: un grafo con pocas aristas puede tener ciclos y uno con muchas puede no tenerlos. El argumento es sobre la maximalidad de los componentes.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "El orden de los números tampoco lo explica: los componentes se pueden nombrar como se quiera y el grafo sigue sin ciclos. Lo que lo impide es que un ciclo fundiría esos componentes en uno.";
        }
      });
    });

    dibujar();
    dibujarCondensacion();
  })();
}
