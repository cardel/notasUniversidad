/* Ejercicio interactivo: construir las representaciones de un grafo (clase 6). */
var EJERCICIO = (function () {
  var H1 = [[2, 3], [2, 5], [0, 1, 3, 4], [0, 2], [2, 5], [1, 4]];
  var H2 = [[2, 3], [0], [4], [2, 5], [1], [4]];

  function matrizDe(G) {
    var m = [];
    var u = 0;
    while (u < G.length) {
      var fila = [];
      var v = 0;
      while (v < G.length) { fila.push(0); v = v + 1; }
      m.push(fila);
      u = u + 1;
    }
    u = 0;
    while (u < G.length) {
      var i = 0;
      while (i < G[u].length) { m[u][G[u][i]] = 1; i = i + 1; }
      u = u + 1;
    }
    return m;
  }

  function aristasDe(G, dirigido) {
    var e = [];
    var u = 0;
    while (u < G.length) {
      var i = 0;
      while (i < G[u].length) {
        var v = G[u][i];
        if (dirigido || u < v) { e.push([u, v]); }
        i = i + 1;
      }
      u = u + 1;
    }
    return e;
  }

  function entradasDeLista(G) {
    var n = 0;
    var u = 0;
    while (u < G.length) { n = n + G[u].length; u = u + 1; }
    return n;
  }

  return { H1: H1, H2: H2, matrizDe: matrizDe, aristasDe: aristasDe,
           entradasDeLista: entradasDeLista };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { G: EJERCICIO.H1, dirigido: false, nombre: "H1" },
      { G: EJERCICIO.H2, dirigido: true, nombre: "H2" }
    ];
    var actual = PRESETS[0];
    var marcas = null;
    var POS = [[0, 1.6], [3.2, 1.6], [1.6, 0.8], [0, -0.6], [3.2, -0.6], [1.6, -1.6]];

    function limpiarMarcas() {
      marcas = [];
      var u = 0;
      while (u < actual.G.length) {
        var fila = [];
        var v = 0;
        while (v < actual.G.length) { fila.push(0); v = v + 1; }
        marcas.push(fila);
        u = u + 1;
      }
    }

    function dibujar() {
      var G = actual.G;
      var caja = document.getElementById("panel-grafo");
      var ancho = 380, alto = 220, mx = 55, my = 55;
      function X(i) { return mx + (POS[i][0] / 3.4) * (ancho - 2 * mx) + 40; }
      function Y(i) { return my + ((1.6 - POS[i][1]) / 3.2) * (alto - 2 * my) + 20; }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:400px'>";
      if (actual.dirigido) {
        svg += "<defs><marker id='c' markerWidth='9' markerHeight='9' refX='9' refY='3' orient='auto'>" +
               "<path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker></defs>";
      }
      var u = 0;
      while (u < G.length) {
        var i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          if (actual.dirigido || u < v) {
            var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
            if (actual.dirigido) {
              var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy);
              x1 = x1 + (dx / L) * 16; y1 = y1 + (dy / L) * 16;
              x2 = x2 - (dx / L) * 16; y2 = y2 - (dy / L) * 16;
              svg += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 +
                     "' stroke='#6b7280' stroke-width='1.8' marker-end='url(#c)'/>";
            } else {
              svg += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 +
                     "' stroke='#6b7280' stroke-width='1.8'/>";
            }
          }
          i = i + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < G.length) {
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='15' fill='#e3edf8' stroke='#1f5fa8' stroke-width='2'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' " +
               "font-weight='700' fill='#24292f'>" + u + "</text>";
        u = u + 1;
      }
      svg += "</svg>";
      caja.innerHTML = svg;
    }

    function pintarMatriz(revisar) {
      var n = actual.G.length;
      var correcta = EJERCICIO.matrizDe(actual.G);
      var t = "<table><thead><tr><th></th>";
      var v = 0;
      while (v < n) { t = t + "<th>" + v + "</th>"; v = v + 1; }
      t = t + "</tr></thead><tbody>";
      var u = 0;
      while (u < n) {
        t = t + "<tr><th>" + u + "</th>";
        v = 0;
        while (v < n) {
          var val = marcas[u][v];
          var clase = "celda-m";
          if (revisar) {
            clase = clase + (val === correcta[u][v] ? " bien-m" : " mal-m");
          } else if (val === 1) {
            clase = clase + " puesta";
          }
          t = t + "<td class='" + clase + "' data-u='" + u + "' data-v='" + v + "'>" +
              (val === 1 ? "1" : "0") + "</td>";
          v = v + 1;
        }
        t = t + "</tr>";
        u = u + 1;
      }
      t = t + "</tbody></table>";
      document.getElementById("panel-matriz").innerHTML = t;
      Array.prototype.forEach.call(document.querySelectorAll(".celda-m"), function (celda) {
        celda.addEventListener("click", function () {
          var a = parseInt(celda.getAttribute("data-u"), 10);
          var b = parseInt(celda.getAttribute("data-v"), 10);
          marcas[a][b] = marcas[a][b] === 1 ? 0 : 1;
          pintarMatriz(false);
          document.getElementById("veredicto-matriz").className = "veredicto";
          document.getElementById("veredicto-matriz").textContent = "";
          document.getElementById("panel-derivadas").innerHTML = "";
        });
      });
    }

    function comoLista(a) { return "[" + a.join(", ") + "]"; }

    function mostrarDerivadas() {
      var G = actual.G;
      var e = EJERCICIO.aristasDe(G, actual.dirigido);
      var t = "<div class='alerta' style='background:var(--verde-suave); border-color:var(--verde)'>";
      t = t + "<b>La misma información, en las otras dos formas</b><br><br>";
      t = t + "<b>Lista de adyacencia</b> — cada fila de la matriz, sin los ceros:<br>";
      t = t + "<code>[";
      var u = 0;
      while (u < G.length) {
        t = t + comoLista(G[u]) + (u < G.length - 1 ? ", " : "");
        u = u + 1;
      }
      t = t + "]</code><br><br>";
      t = t + "<b>Lista de aristas</b> — " + e.length + " " +
          (actual.dirigido ? "aristas dirigidas" : "aristas") + ":<br><code>[";
      var i = 0;
      while (i < e.length) {
        t = t + "(" + e[i][0] + ", " + e[i][1] + ")" + (i < e.length - 1 ? ", " : "");
        i = i + 1;
      }
      t = t + "]</code><br><br>";
      t = t + "Espacio: la matriz ocupa " + (G.length * G.length) + " posiciones; " +
          "la lista de adyacencia, " + EJERCICIO.entradasDeLista(G) + " entradas más " +
          G.length + " listas; la de aristas, " + e.length + " pares.";
      t = t + "</div>";
      document.getElementById("panel-derivadas").innerHTML = t;
    }

    function cambiarPreset(k) {
      actual = PRESETS[k];
      limpiarMarcas();
      dibujar();
      pintarMatriz(false);
      document.getElementById("veredicto-matriz").className = "veredicto";
      document.getElementById("veredicto-matriz").textContent = "";
      document.getElementById("panel-derivadas").innerHTML = "";
      var v = document.getElementById("veredicto");
      v.className = "veredicto";
      v.textContent = "";
      document.getElementById("nota-simetria").innerHTML = actual.dirigido
        ? "En un grafo dirigido la matriz <b>no</b> tiene por qué ser simétrica: " +
          "la arista (3,2) pone un uno en la fila 3, y nada en la fila 2."
        : "En un grafo no dirigido la matriz es simétrica: cada arista pone dos " +
          "unos, uno a cada lado de la diagonal.";
    }

    document.getElementById("btn-comprobar-matriz").addEventListener("click", function () {
      var correcta = EJERCICIO.matrizDe(actual.G);
      var n = actual.G.length;
      var errores = 0, faltantes = 0, sobrantes = 0;
      var u = 0;
      while (u < n) {
        var v = 0;
        while (v < n) {
          if (marcas[u][v] !== correcta[u][v]) {
            errores = errores + 1;
            if (correcta[u][v] === 1) { faltantes = faltantes + 1; }
            else { sobrantes = sobrantes + 1; }
          }
          v = v + 1;
        }
        u = u + 1;
      }
      pintarMatriz(true);
      var ver = document.getElementById("veredicto-matriz");
      if (errores === 0) {
        ver.className = "veredicto bien";
        ver.innerHTML = "Correcta. Las otras dos representaciones salen de esta " +
          "sin volver a mirar el dibujo: abajo están.";
        mostrarDerivadas();
      } else {
        ver.className = "veredicto mal";
        ver.innerHTML = "Quedan " + errores + " celdas mal: " + faltantes +
          " aristas sin poner y " + sobrantes + " puestas de más. Las rojas son " +
          "las que hay que revisar." +
          (!actual.dirigido ? " Recuerde que cada arista pone <b>dos</b> unos." : "");
      }
    });

    document.getElementById("btn-limpiar-matriz").addEventListener("click", function () {
      limpiarMarcas();
      pintarMatriz(false);
      document.getElementById("veredicto-matriz").className = "veredicto";
      document.getElementById("veredicto-matriz").textContent = "";
      document.getElementById("panel-derivadas").innerHTML = "";
    });

    document.getElementById("btn-comprobar").addEventListener("click", function () {
      var campo = document.getElementById("prediccion");
      var v = document.getElementById("veredicto");
      var valor = parseInt(campo.value, 10);
      var G = actual.G;
      var entradas = EJERCICIO.entradasDeLista(G);
      var e = EJERCICIO.aristasDe(G, actual.dirigido).length;
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba un número primero.";
      } else if (valor === entradas) {
        v.className = "veredicto bien";
        v.innerHTML = "Correcto: " + entradas + " entradas" +
          (actual.dirigido
            ? ", una por arista, porque cada arista dirigida aparece una sola vez."
            : ", dos por arista, porque cada una aparece en las listas de sus dos extremos.");
      } else if (valor === e) {
        v.className = "veredicto mal";
        v.innerHTML = "Ese es el número de aristas (" + e + ")." +
          (actual.dirigido ? "" : " En un grafo no dirigido cada arista deja dos entradas.");
      } else if (valor === G.length * G.length) {
        v.className = "veredicto mal";
        v.innerHTML = "Ese es el tamaño de la matriz. La lista de adyacencia solo " +
          "guarda lo que existe.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Sume el largo de las seis listas.";
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) {
          b.classList.remove("primario");
        });
        btn.classList.add("primario");
        cambiarPreset(parseInt(btn.getAttribute("data-preset"), 10));
      });
    });

    cambiarPreset(0);
  })();
}
