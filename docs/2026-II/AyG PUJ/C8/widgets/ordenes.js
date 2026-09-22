/* Ejercicio interactivo: decidir cuales listas son ordenes topologicos de
   un grafo (clase 8). Sin simulacion: la comprobacion revisa cada flecha. */
var EJERCICIO = (function () {
  /* Devuelve null si el orden es topologico, o la primera arista (u, v)
     con u despues de v, o con alguien faltante o repetido. */
  function falla(G, orden) {
    var n = G.length, pos = [], i = 0, u, res = null;
    while (i < n) { pos.push(-1); i = i + 1; }
    i = 0;
    while (i < orden.length) {
      if (pos[orden[i]] >= 0) { res = { repetido: orden[i] }; }
      pos[orden[i]] = i;
      i = i + 1;
    }
    if (res === null && orden.length !== n) { res = { incompleto: true }; }
    u = 0;
    while (u < n && res === null) {
      i = 0;
      while (i < G[u].length && res === null) {
        if (pos[u] > pos[G[u][i]]) { res = { u: u, v: G[u][i] }; }
        i = i + 1;
      }
      u = u + 1;
    }
    return res;
  }

  function contarOrdenes(G) {
    var n = G.length, entrada = [], u = 0, i, total = 0;
    while (u < n) { entrada.push(0); u = u + 1; }
    u = 0;
    while (u < n) { i = 0; while (i < G[u].length) { entrada[G[u][i]] = entrada[G[u][i]] + 1; i = i + 1; } u = u + 1; }
    var emitido = [];
    u = 0; while (u < n) { emitido.push(false); u = u + 1; }
    function extender(k) {
      if (k === n) { total = total + 1; }
      else {
        var w = 0;
        while (w < n) {
          if (!emitido[w] && entrada[w] === 0) {
            emitido[w] = true;
            var j = 0; while (j < G[w].length) { entrada[G[w][j]] = entrada[G[w][j]] - 1; j = j + 1; }
            extender(k + 1);
            j = 0; while (j < G[w].length) { entrada[G[w][j]] = entrada[G[w][j]] + 1; j = j + 1; }
            emitido[w] = false;
          }
          w = w + 1;
        }
      }
    }
    extender(0);
    return total;
  }

  return { falla: falla, contarOrdenes: contarOrdenes };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function grafo(n, aristas) {
      var G = []; var i = 0; while (i < n) { G.push([]); i = i + 1; }
      i = 0; while (i < aristas.length) { G[aristas[i][0]].push(aristas[i][1]); i = i + 1; }
      i = 0; while (i < n) { G[i].sort(function (a, b) { return a - b; }); i = i + 1; }
      return G;
    }
    var G = grafo(6, [[0, 3], [1, 3], [3, 2], [3, 5], [4, 5], [1, 4]]);
    var POS = [[0, 2.4], [0, 0.6], [4.2, 2.4], [2.1, 1.8], [2.1, 0], [4.2, 0.6]];
    var LISTAS = [[0, 1, 3, 4, 2, 5], [1, 0, 4, 3, 5, 2], [0, 3, 1, 2, 4, 5], [1, 4, 0, 3, 2, 5], [0, 1, 3, 2, 5, 4], [1, 0, 3, 5, 4, 2]];

    function dibujar() {
      var n = G.length, ancho = 460, alto = 250;
      function X(i) { return 40 + (POS[i][0] / 4.2) * (ancho - 80); }
      function Y(i) { return 30 + ((2.4 - POS[i][1]) / 2.4) * (alto - 60); }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:480px'>";
      svg += "<defs><marker id='flecha' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker></defs>";
      var u = 0, i;
      while (u < n) {
        i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          var dx = X(v) - X(u), dy = Y(v) - Y(u), d = Math.sqrt(dx * dx + dy * dy);
          svg += "<line x1='" + (X(u) + dx / d * 17) + "' y1='" + (Y(u) + dy / d * 17) + "' x2='" + (X(v) - dx / d * 19) + "' y2='" + (Y(v) - dy / d * 19) + "' stroke='#6b7280' stroke-width='1.6' marker-end='url(#flecha)'/>";
          i = i + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='15' fill='#ffffff' stroke='#d8dee6' stroke-width='2'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + u + "</text>";
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function armarListas() {
      var caja = document.getElementById("listas");
      caja.innerHTML = "";
      LISTAS.forEach(function (l, k) {
        var fila = document.createElement("label");
        fila.className = "lista";
        fila.innerHTML = "<input type='checkbox' data-k='" + k + "'> <code>[" + l.join(", ") + "]</code> <span class='resultado' id='res-" + k + "'></span>";
        caja.appendChild(fila);
      });
    }

    document.getElementById("btn-comprobar").addEventListener("click", function () {
      var aciertos = 0;
      LISTAS.forEach(function (l, k) {
        var marcada = document.querySelector("input[data-k='" + k + "']").checked;
        var f = EJERCICIO.falla(G, l);
        var es = f === null;
        var celda = document.getElementById("res-" + k);
        var texto;
        if (es) { texto = "es orden topológico"; }
        else if (f.u !== undefined) { texto = "no: la flecha " + f.u + " → " + f.v + " queda al revés"; }
        else { texto = "no: falta o sobra un vértice"; }
        celda.textContent = (marcada === es ? "✓ " : "✗ ") + texto;
        celda.className = "resultado " + (marcada === es ? "bien" : "mal");
        if (marcada === es) { aciertos = aciertos + 1; }
      });
      var v = document.getElementById("veredicto");
      v.className = aciertos === LISTAS.length ? "veredicto bien" : "veredicto mal";
      v.textContent = aciertos === LISTAS.length
        ? "Las seis bien. Cada una se decide mirando las seis flechas, y basta una al revés para descartarla."
        : aciertos + " de " + LISTAS.length + ". Para cada lista descartada, la flecha que la descarta está al lado; para cada lista que sí sirve, revise las seis flechas una por una.";
    });

    document.getElementById("btn-contar").addEventListener("click", function () {
      var campo = document.getElementById("cuantos");
      var v = document.getElementById("veredicto-contar");
      var valor = parseInt(campo.value, 10);
      var total = EJERCICIO.contarOrdenes(G);
      if (isNaN(valor)) { v.className = "veredicto mal"; v.textContent = "Escriba un número primero."; }
      else if (valor === total) { v.className = "veredicto bien"; v.textContent = "Correcto: " + total + ". El 3 tiene que ir después de 0 y 1, y el 5 después de 3 y 4; lo demás se acomoda de varias formas."; }
      else if (valor === 720) { v.className = "veredicto mal"; v.textContent = "Esas son todas las permutaciones de seis vértices. Las flechas descartan casi todas: cuente solo las que dejan cada vértice después de sus predecesores."; }
      else if (valor === 1) { v.className = "veredicto mal"; v.textContent = "Hay más de uno: las listas 1, 2 y 4 de arriba son tres distintos. El orden es único solo cuando las flechas encadenan todos los vértices en fila."; }
      else { v.className = "veredicto mal"; v.textContent = "No coincide. Una forma de contar: fije quién va de primero (solo puede ser 0 o 1), quite ese vértice y sus flechas, y cuente lo que queda."; }
    });

    dibujar();
    armarListas();
  })();
}
