/* Ejercicio interactivo: construir las tres representaciones de un grafo
   (clase 6). Las tres se escriben a mano y se comprueban por separado. */
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

  /* Extrae todos los numeros de un texto, en orden. */
  function numerosDe(texto) {
    var salida = [];
    var actual = "";
    var i = 0;
    while (i <= texto.length) {
      var c = i < texto.length ? texto.charAt(i) : " ";
      if (c >= "0" && c <= "9") {
        actual = actual + c;
      } else {
        if (actual.length > 0) { salida.push(parseInt(actual, 10)); }
        actual = "";
      }
      i = i + 1;
    }
    return salida;
  }

  /* Compara dos conjuntos de numeros: que falta y que sobra. */
  function comparar(propuesto, esperado) {
    var faltan = [], sobran = [], repetidos = [];
    var vistos = [];
    var i = 0;
    while (i < propuesto.length) {
      if (vistos.indexOf(propuesto[i]) >= 0) {
        if (repetidos.indexOf(propuesto[i]) < 0) { repetidos.push(propuesto[i]); }
      } else {
        vistos.push(propuesto[i]);
      }
      i = i + 1;
    }
    i = 0;
    while (i < esperado.length) {
      if (vistos.indexOf(esperado[i]) < 0) { faltan.push(esperado[i]); }
      i = i + 1;
    }
    i = 0;
    while (i < vistos.length) {
      if (esperado.indexOf(vistos[i]) < 0) { sobran.push(vistos[i]); }
      i = i + 1;
    }
    return { faltan: faltan, sobran: sobran, repetidos: repetidos,
             bien: faltan.length === 0 && sobran.length === 0 && repetidos.length === 0 };
  }

  /* Compara conjuntos de aristas dadas como pares. */
  function compararAristas(propuestas, esperadas, dirigido) {
    function clave(p) {
      if (dirigido) { return p[0] + "-" + p[1]; }
      return Math.min(p[0], p[1]) + "-" + Math.max(p[0], p[1]);
    }
    var claveEsp = esperadas.map(clave);
    var vistas = [], repetidas = [], sobran = [];
    var i = 0;
    while (i < propuestas.length) {
      var k = clave(propuestas[i]);
      if (vistas.indexOf(k) >= 0) {
        if (repetidas.indexOf(k) < 0) { repetidas.push(k); }
      } else {
        vistas.push(k);
        if (claveEsp.indexOf(k) < 0) { sobran.push(k); }
      }
      i = i + 1;
    }
    var faltan = [];
    i = 0;
    while (i < claveEsp.length) {
      if (vistas.indexOf(claveEsp[i]) < 0) { faltan.push(claveEsp[i]); }
      i = i + 1;
    }
    return { faltan: faltan, sobran: sobran, repetidas: repetidas,
             bien: faltan.length === 0 && sobran.length === 0 && repetidas.length === 0 };
  }

  return { H1: H1, H2: H2, matrizDe: matrizDe, aristasDe: aristasDe,
           entradasDeLista: entradasDeLista, numerosDe: numerosDe,
           comparar: comparar, compararAristas: compararAristas };
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
    var listo = { matriz: false, lista: false, aristas: false };
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

    /* ---------- 1. matriz ---------- */
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
          listo.matriz = false;
          pintarMatriz(false);
          limpiarVeredicto("veredicto-matriz");
          revisarTodo();
        });
      });
    }

    function limpiarVeredicto(id) {
      var v = document.getElementById(id);
      v.className = "veredicto";
      v.innerHTML = "";
    }

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id);
      v.className = ok ? "veredicto bien" : "veredicto mal";
      v.innerHTML = texto;
    }

    /* ---------- 2. lista de adyacencia ---------- */
    function pintarCamposLista() {
      var G = actual.G;
      var t = "";
      var u = 0;
      while (u < G.length) {
        t = t + "<div class='fila-ady'><label for='ady-" + u + "'>G[" + u + "] =</label>" +
            "<input type='text' id='ady-" + u + "' placeholder='vecinos separados por comas'>" +
            "<span class='marca-ady' id='marca-ady-" + u + "'></span></div>";
        u = u + 1;
      }
      document.getElementById("panel-lista").innerHTML = t;
      Array.prototype.forEach.call(document.querySelectorAll(".fila-ady input"), function (campo) {
        campo.addEventListener("input", function () {
          listo.lista = false;
          limpiarVeredicto("veredicto-lista");
          Array.prototype.forEach.call(document.querySelectorAll(".marca-ady"), function (m) {
            m.textContent = "";
          });
          revisarTodo();
        });
      });
    }

    function comprobarLista() {
      var G = actual.G;
      var filasMal = 0;
      var detalle = [];
      var u = 0;
      while (u < G.length) {
        var texto = document.getElementById("ady-" + u).value;
        var res = EJERCICIO.comparar(EJERCICIO.numerosDe(texto), G[u]);
        var marca = document.getElementById("marca-ady-" + u);
        if (res.bien) {
          marca.textContent = "✓";
          marca.className = "marca-ady ok";
        } else {
          marca.textContent = "✗";
          marca.className = "marca-ady no";
          filasMal = filasMal + 1;
          var partes = [];
          if (res.faltan.length > 0) { partes.push("faltan " + res.faltan.join(", ")); }
          if (res.sobran.length > 0) { partes.push("sobran " + res.sobran.join(", ")); }
          if (res.repetidos.length > 0) { partes.push("repetidos " + res.repetidos.join(", ")); }
          detalle.push("G[" + u + "]: " + partes.join("; "));
        }
        u = u + 1;
      }
      if (filasMal === 0) {
        listo.lista = true;
        veredicto("veredicto-lista", true, "Correcta. Fíjese en que la lista " +
          "guarda solo lo que existe: " + EJERCICIO.entradasDeLista(G) +
          " entradas contra las " + (G.length * G.length) + " posiciones de la matriz.");
      } else {
        listo.lista = false;
        veredicto("veredicto-lista", false, "Quedan " + filasMal + " filas mal.<br>" +
          detalle.join("<br>"));
      }
      revisarTodo();
    }

    /* ---------- 3. lista de aristas ---------- */
    function comprobarAristas() {
      var G = actual.G;
      var esperadas = EJERCICIO.aristasDe(G, actual.dirigido);
      var nums = EJERCICIO.numerosDe(document.getElementById("campo-aristas").value);
      if (nums.length % 2 !== 0) {
        listo.aristas = false;
        veredicto("veredicto-aristas", false, "Hay " + nums.length + " números, que " +
          "es impar: alguna arista quedó con un solo extremo.");
        revisarTodo();
        return;
      }
      var propuestas = [];
      var i = 0;
      while (i < nums.length) {
        propuestas.push([nums[i], nums[i + 1]]);
        i = i + 2;
      }
      var fuera = propuestas.filter(function (p) {
        return p[0] < 0 || p[0] >= G.length || p[1] < 0 || p[1] >= G.length;
      });
      if (fuera.length > 0) {
        listo.aristas = false;
        veredicto("veredicto-aristas", false, "Hay vértices fuera de rango: los " +
          "de este grafo van de 0 a " + (G.length - 1) + ".");
        revisarTodo();
        return;
      }
      var res = EJERCICIO.compararAristas(propuestas, esperadas, actual.dirigido);
      if (res.bien) {
        listo.aristas = true;
        veredicto("veredicto-aristas", true, "Correcta: " + esperadas.length +
          (actual.dirigido ? " aristas dirigidas." : " aristas.") +
          " Es la más compacta de las tres, y la más parecida a como llega la " +
          "entrada de un problema.");
      } else {
        listo.aristas = false;
        var partes = [];
        if (res.faltan.length > 0) { partes.push("faltan " + res.faltan.join(", ")); }
        if (res.sobran.length > 0) { partes.push("sobran " + res.sobran.join(", ")); }
        if (res.repetidas.length > 0) {
          partes.push("repetidas " + res.repetidas.join(", ") +
            (actual.dirigido ? "" : " — en un grafo no dirigido cada arista se escribe una sola vez"));
        }
        veredicto("veredicto-aristas", false, partes.join("; ") + ".");
      }
      revisarTodo();
    }

    /* ---------- cierre ---------- */
    function revisarTodo() {
      var caja = document.getElementById("panel-resumen");
      var marcador = document.getElementById("marcador");
      var hechas = (listo.matriz ? 1 : 0) + (listo.lista ? 1 : 0) + (listo.aristas ? 1 : 0);
      marcador.textContent = hechas + " de 3";
      marcador.className = hechas === 3 ? "valor-n" : "valor-n pendiente-n";
      if (hechas < 3) {
        caja.innerHTML = "";
        return;
      }
      var G = actual.G;
      var n = G.length;
      var entradas = EJERCICIO.entradasDeLista(G);
      var e = EJERCICIO.aristasDe(G, actual.dirigido).length;
      var t = "<table><thead><tr><th style='text-align:left'>Representación</th>" +
        "<th>Lo que guarda</th><th>En este grafo</th><th>En general</th></tr></thead><tbody>";
      t = t + "<tr><td style='text-align:left'>Lista de adyacencia</td><td>" + n +
        " listas con " + entradas + " entradas</td><td>" + (n + entradas) +
        "</td><td>Θ(V + E)</td></tr>";
      t = t + "<tr><td style='text-align:left'>Matriz de adyacencia</td><td>" +
        n + " × " + n + " posiciones</td><td>" + (n * n) + "</td><td>Θ(V²)</td></tr>";
      t = t + "<tr><td style='text-align:left'>Lista de aristas</td><td>" + e +
        " pares</td><td>" + (2 * e) + "</td><td>Θ(E)</td></tr>";
      t = t + "</tbody></table>";
      t = t + "<p class='nota'>Las tres guardan exactamente la misma información: " +
        "de cualquiera de ellas se puede reconstruir el dibujo. Lo que cambia es " +
        "cuánto ocupan y qué pregunta contestan rápido.</p>";
      caja.innerHTML = "<div class='alerta' style='background:var(--verde-suave); " +
        "border-color:var(--verde)'><b>Las tres, lado a lado</b>" + t + "</div>";
    }

    /* ---------- controles ---------- */
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
      if (errores === 0) {
        listo.matriz = true;
        veredicto("veredicto-matriz", true, "Correcta." +
          (actual.dirigido
            ? " Fíjese en que no es simétrica: la arista (3,2) pone un uno en la fila 3 y nada en la fila 2."
            : " Es simétrica, porque cada arista pone dos unos."));
      } else {
        listo.matriz = false;
        veredicto("veredicto-matriz", false, "Quedan " + errores + " celdas mal: " +
          faltantes + " aristas sin poner y " + sobrantes + " puestas de más." +
          (!actual.dirigido ? " Recuerde que cada arista pone <b>dos</b> unos." : ""));
      }
      revisarTodo();
    });

    document.getElementById("btn-limpiar-matriz").addEventListener("click", function () {
      limpiarMarcas();
      listo.matriz = false;
      pintarMatriz(false);
      limpiarVeredicto("veredicto-matriz");
      revisarTodo();
    });

    document.getElementById("btn-comprobar-lista").addEventListener("click", comprobarLista);
    document.getElementById("btn-comprobar-aristas").addEventListener("click", comprobarAristas);

    document.getElementById("btn-comprobar").addEventListener("click", function () {
      var valor = parseInt(document.getElementById("prediccion").value, 10);
      var G = actual.G;
      var entradas = EJERCICIO.entradasDeLista(G);
      var e = EJERCICIO.aristasDe(G, actual.dirigido).length;
      if (isNaN(valor)) {
        veredicto("veredicto", false, "Escriba un número primero.");
      } else if (valor === entradas) {
        veredicto("veredicto", true, "Correcto: " + entradas + " entradas" +
          (actual.dirigido
            ? ", una por arista, porque cada arista dirigida aparece una sola vez."
            : ", dos por arista, porque cada una aparece en las listas de sus dos extremos."));
      } else if (valor === e) {
        veredicto("veredicto", false, "Ese es el número de aristas (" + e + ")." +
          (actual.dirigido ? "" : " En un grafo no dirigido cada arista deja dos entradas."));
      } else if (valor === G.length * G.length) {
        veredicto("veredicto", false, "Ese es el tamaño de la matriz. La lista de " +
          "adyacencia solo guarda lo que existe.");
      } else {
        veredicto("veredicto", false, "No coincide. Sume el largo de las " +
          G.length + " listas.");
      }
    });

    function cambiarPreset(k) {
      actual = PRESETS[k];
      listo = { matriz: false, lista: false, aristas: false };
      limpiarMarcas();
      dibujar();
      pintarMatriz(false);
      pintarCamposLista();
      document.getElementById("campo-aristas").value = "";
      limpiarVeredicto("veredicto-matriz");
      limpiarVeredicto("veredicto-lista");
      limpiarVeredicto("veredicto-aristas");
      limpiarVeredicto("veredicto");
      document.getElementById("prediccion").value = "";
      document.getElementById("nota-aristas").innerHTML = actual.dirigido
        ? "El grafo es dirigido: el par (u, v) no es lo mismo que (v, u), y cada " +
          "arista se escribe una sola vez, en su sentido."
        : "El grafo es no dirigido: cada arista se escribe <b>una sola vez</b>. " +
          "Escribir (0,2) y (2,0) es contarla dos veces.";
      revisarTodo();
    }

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
