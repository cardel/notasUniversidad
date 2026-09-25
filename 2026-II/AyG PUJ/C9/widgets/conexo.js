/* Ejercicio interactivo: clasificar un grafo por su conectividad (clase 9).
   Sin paso a paso: las respuestas se calculan con el codigo de la clase,
   componentes_conexos para el caso no dirigido y kosaraju para el dirigido. */
var EJERCICIO = (function () {
  /* componentes_conexos: recorrido en profundidad recursivo. */
  function componentesConexos(G) {
    var n = G.length, visitado = [], componentes = [], i = 0;
    while (i < n) { visitado.push(false); i = i + 1; }
    function aux(v, actual) {
      actual.push(v);
      visitado[v] = true;
      var j = 0;
      while (j < G[v].length) {
        if (!visitado[G[v][j]]) { aux(G[v][j], actual); }
        j = j + 1;
      }
    }
    i = 0;
    while (i < n) {
      if (!visitado[i]) { var actual = []; aux(i, actual); componentes.push(actual); }
      i = i + 1;
    }
    return componentes;
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

  /* kosaraju: los componentes fuertemente conexos, en el orden del deck. */
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

  /* El grafo no dirigido subyacente: cada flecha, sin direccion. */
  function subyacente(G) {
    var n = G.length, U = [], i = 0, j;
    while (i < n) { U.push([]); i = i + 1; }
    i = 0;
    while (i < n) {
      j = 0;
      while (j < G[i].length) {
        if (G[i][j] !== i) { U[i].push(G[i][j]); U[G[i][j]].push(i); }
        j = j + 1;
      }
      i = i + 1;
    }
    return U;
  }

  /* Devuelve la clave de la respuesta correcta para cada grafo. */
  function clasificar(G, esDirigido) {
    var res;
    if (!esDirigido) {
      res = componentesConexos(G).length === 1 ? "conexo" : "noconexo";
    } else if (kosaraju(G).length === 1) {
      res = "fuerte";
    } else if (componentesConexos(subyacente(G)).length === 1) {
      res = "debil";
    } else {
      res = "nidebil";
    }
    return res;
  }

  return {
    componentesConexos: componentesConexos, kosaraju: kosaraju,
    subyacente: subyacente, clasificar: clasificar,
    ordenPorFinalizacion: ordenPorFinalizacion, transpuesto: transpuesto
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
    function noDirigido(n, aristas) {
      var G = [], i = 0;
      while (i < n) { G.push([]); i = i + 1; }
      i = 0;
      while (i < aristas.length) {
        G[aristas[i][0]].push(aristas[i][1]);
        G[aristas[i][1]].push(aristas[i][0]);
        i = i + 1;
      }
      i = 0;
      while (i < n) { G[i].sort(function (a, b) { return a - b; }); i = i + 1; }
      return G;
    }

    var PRESETS = [
      { rotulo: "A · no dirigido", dir: false,
        G: noDirigido(7, [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 5], [4, 6], [5, 6]]),
        pos: [[0.0, 1.6], [1.1, 2.6], [1.1, 0.6], [2.2, 1.6], [3.3, 1.6], [4.3, 2.5], [4.3, 0.7]] },
      { rotulo: "B · no dirigido", dir: false,
        G: noDirigido(8, [[0, 4], [4, 7], [7, 2], [2, 0], [1, 5], [5, 3]]),
        pos: [[0.0, 2.4], [2.6, 2.5], [0.0, 0.8], [3.9, 1.4], [1.2, 2.4], [2.6, 0.9], [4.6, 2.6], [1.2, 0.8]] },
      { rotulo: "C · dirigido", dir: true,
        G: dirigido(5, [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 2]]),
        pos: [[0.0, 2.4], [1.3, 2.9], [1.3, 1.1], [2.8, 2.2], [2.8, 0.5]] },
      { rotulo: "D · dirigido", dir: true,
        G: dirigido(6, [[0, 1], [1, 2], [2, 3], [3, 1], [4, 0], [4, 5], [5, 2]]),
        pos: [[1.2, 2.7], [2.5, 2.7], [3.6, 1.6], [2.9, 0.4], [0.0, 1.6], [1.4, 0.5]] },
      { rotulo: "E · dirigido", dir: true,
        G: dirigido(6, [[0, 1], [1, 0], [2, 3], [3, 4], [4, 2]]),
        pos: [[0.0, 2.5], [1.1, 2.5], [2.4, 2.6], [3.5, 1.7], [2.6, 0.7], [4.6, 0.6]] }
    ];
    var presetActual = 0;

    function P() { return PRESETS[presetActual]; }

    function dibujar() {
      var p = P(), G = p.G, pos = p.pos, n = G.length;
      var ancho = 470, alto = 250, r = 17;
      var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
      while (i < n) {
        if (pos[i][0] < minX) { minX = pos[i][0]; }
        if (pos[i][0] > maxX) { maxX = pos[i][0]; }
        if (pos[i][1] < minY) { minY = pos[i][1]; }
        if (pos[i][1] > maxY) { maxY = pos[i][1]; }
        i = i + 1;
      }
      var mx = r + 18, my = r + 16;
      function X(k) { return mx + (pos[k][0] - minX) / (maxX - minX) * (ancho - 2 * mx); }
      function Y(k) { return my + (maxY - pos[k][1]) / (maxY - minY) * (alto - 2 * my); }
      function existe(a, b) {
        var j = 0, hay = false;
        while (j < G[a].length) { if (G[a][j] === b) { hay = true; } j = j + 1; }
        return hay;
      }

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:520px'>";
      svg += "<defs><marker id='fg' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker></defs>";
      var u = 0, j;
      while (u < n) {
        j = 0;
        while (j < G[u].length) {
          var v = G[u][j];
          var pintar = p.dir || u < v;
          if (pintar) {
            var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
            var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
            var punta = p.dir ? " marker-end='url(#fg)'" : "";
            if (p.dir && existe(v, u)) {
              var cx = (x1 + x2) / 2 - dy / dd * 24, cy = (y1 + y2) / 2 + dx / dd * 24;
              var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
              var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
              svg += "<path d='M" + (x1 + (cx - x1) / l1 * (r + 1)) + "," + (y1 + (cy - y1) / l1 * (r + 1)) +
                     " Q" + cx + "," + cy + " " + (x2 + (cx - x2) / l2 * (r + 3)) + "," + (y2 + (cy - y2) / l2 * (r + 3)) +
                     "' fill='none' stroke='#6b7280' stroke-width='1.7'" + punta + "/>";
            } else {
              svg += "<line x1='" + (x1 + dx / dd * (r + 1)) + "' y1='" + (y1 + dy / dd * (r + 1)) +
                     "' x2='" + (x2 - dx / dd * (p.dir ? r + 3 : r + 1)) + "' y2='" + (y2 - dy / dd * (p.dir ? r + 3 : r + 1)) +
                     "' stroke='#6b7280' stroke-width='1.7'" + punta + "/>";
            }
          }
          j = j + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='" + r + "' fill='#ffffff' stroke='#d8dee6' stroke-width='2'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + u + "</text>";
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
      document.getElementById("ver-tipo").textContent = p.dir
        ? "Dirigido: las aristas tienen punta y se recorren en un solo sentido."
        : "No dirigido: las aristas se recorren en los dos sentidos.";
      document.getElementById("rotulo-cuantos").textContent = p.dir
        ? "¿Cuántos componentes fuertemente conexos tiene?"
        : "¿Cuántos componentes conexos tiene?";
    }

    function limpiar() {
      ["veredicto-clase", "veredicto-cuantos"].forEach(function (id) {
        var v = document.getElementById(id);
        v.className = "veredicto"; v.textContent = "";
      });
    }

    var EXPLICA = {
      conexo: "Un solo componente conexo: entre cualquier par de vértices hay camino.",
      noconexo: "Más de un componente conexo: hay parejas de vértices sin ningún camino entre ellos.",
      fuerte: "Fuertemente conexo: de cualquier vértice se llega a cualquier otro siguiendo las flechas, y también de vuelta.",
      debil: "Débilmente conexo y no fuertemente: borrando las puntas queda conexo, pero con las puntas puestas hay parejas sin camino de ida o de vuelta.",
      nidebil: "Ni siquiera débilmente conexo: aun borrando las puntas el grafo queda partido."
    };

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-clase button"), function (btn) {
      btn.addEventListener("click", function () {
        var p = P(), op = btn.getAttribute("data-op");
        var correcta = EJERCICIO.clasificar(p.G, p.dir);
        var v = document.getElementById("veredicto-clase");
        var esDirigida = op === "fuerte" || op === "debil" || op === "nidebil";
        var texto;
        if (op === correcta) {
          v.className = "veredicto bien";
          texto = "Correcto. " + EXPLICA[correcta];
          if (correcta === "noconexo") {
            texto = texto + " Aquí son " + EJERCICIO.componentesConexos(p.G).length + ": " +
              EJERCICIO.componentesConexos(p.G).map(function (c) { return "{" + c.slice().sort(function (a, b) { return a - b; }).join(", ") + "}"; }).join(", ") + ".";
          }
          if (correcta === "debil") {
            texto = texto + " Los componentes fuertemente conexos son " +
              EJERCICIO.kosaraju(p.G).map(function (c) { return "{" + c.slice().sort(function (a, b) { return a - b; }).join(", ") + "}"; }).join(", ") + ".";
          }
          if (correcta === "nidebil") {
            texto = texto + " Sin las puntas quedan " + EJERCICIO.componentesConexos(EJERCICIO.subyacente(p.G)).length + " pedazos.";
          }
        } else {
          v.className = "veredicto mal";
          if (esDirigida && !p.dir) {
            texto = "Esa pregunta no está definida en un grafo no dirigido. Débil y fuerte se distinguen por la dirección de las aristas, y aquí no hay dirección que ignorar ni que respetar: lo que se pregunta es si el grafo es conexo.";
          } else if (!esDirigida && p.dir) {
            texto = "En un grafo dirigido hay que decir si se ignoran las puntas, y entonces la pregunta es por la conectividad débil, o si no se ignoran, y entonces es por la fuerte. Decir solo «conexo» deja la pregunta a medias.";
          } else if (op === "fuerte") {
            texto = "No: hay al menos una pareja sin camino de vuelta. Los componentes fuertemente conexos son " +
              EJERCICIO.kosaraju(p.G).map(function (c) { return "{" + c.slice().sort(function (a, b) { return a - b; }).join(", ") + "}"; }).join(", ") +
              ", y con más de uno el grafo no es fuertemente conexo.";
          } else if (op === "debil") {
            texto = correcta === "fuerte"
              ? "Se queda corto: de cualquier vértice se llega a cualquier otro respetando las flechas, así que el grafo es fuertemente conexo. Todo grafo fuertemente conexo es también débilmente conexo, pero aquí vale lo más fuerte."
              : "Borrando las puntas el grafo todavía queda partido en " + EJERCICIO.componentesConexos(EJERCICIO.subyacente(p.G)).length + " pedazos, así que ni siquiera es débilmente conexo.";
          } else if (op === "nidebil") {
            texto = "Borrando las puntas el grafo queda de una sola pieza, así que sí es débilmente conexo. Vuelva a mirar el dibujo sin fijarse en las flechas.";
          } else if (op === "conexo") {
            texto = "Hay vértices sin camino entre ellos: los componentes son " +
              EJERCICIO.componentesConexos(p.G).map(function (c) { return "{" + c.slice().sort(function (a, b) { return a - b; }).join(", ") + "}"; }).join(", ") + ".";
          } else {
            texto = "Desde cualquier vértice se alcanza el resto: el recorrido que arranca en el 0 toca los " + p.G.length + " vértices, así que hay un solo componente.";
          }
        }
        v.textContent = texto;
      });
    });

    document.getElementById("btn-cuantos").addEventListener("click", function () {
      var p = P();
      var lista = p.dir ? EJERCICIO.kosaraju(p.G) : EJERCICIO.componentesConexos(p.G);
      var total = lista.length;
      var campo = document.getElementById("cuantos");
      var v = document.getElementById("veredicto-cuantos");
      var valor = parseInt(campo.value, 10);
      var pintados = lista.map(function (c) { return "{" + c.slice().sort(function (a, b) { return a - b; }).join(", ") + "}"; }).join(", ");
      if (isNaN(valor)) {
        v.className = "veredicto mal"; v.textContent = "Escriba un número primero.";
      } else if (valor === total) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: " + total + ". " + pintados + ".";
      } else if (p.dir && valor === EJERCICIO.componentesConexos(EJERCICIO.subyacente(p.G)).length) {
        v.className = "veredicto mal";
        v.textContent = "Ese es el número de componentes débilmente conexos, que sale de ignorar las puntas. Con las puntas puestas hacen falta los dos caminos, de ida y de vuelta, y los componentes son " + pintados + ".";
      } else if (valor === p.G.length) {
        v.className = "veredicto mal";
        v.textContent = "Ese es el número de vértices. Un vértice solo forma componente por su cuenta cuando no comparte camino de ida y vuelta con ningún otro; aquí varios sí lo comparten.";
      } else if (valor === 1) {
        v.className = "veredicto mal";
        v.textContent = "Con un solo componente todo vértice alcanzaría a todos los demás. Busque una pareja sin camino y ya tiene dos componentes distintos.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Vaya vértice por vértice: agrupe cada uno con aquellos a los que llega y de los que puede volver, y cuente los grupos.";
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        limpiar();
        dibujar();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-tabla button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        var v = document.getElementById("veredicto-tabla");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Correcto. Componente conexo, punto de articulación y puente son del grafo no dirigido; débil, fuerte y componente fuertemente conexo son del dirigido. Pedir los componentes conexos de un grafo dirigido obliga a decir antes si se ignoran las direcciones.";
        } else if (op === "puente") {
          v.className = "veredicto mal";
          v.textContent = "Puente sí es una pregunta legítima, pero solo en el grafo no dirigido, que es donde está planteada.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Componente fuertemente conexo se pregunta en un grafo dirigido, y ahí la respuesta está bien definida.";
        }
      });
    });

    dibujar();
  })();
}
