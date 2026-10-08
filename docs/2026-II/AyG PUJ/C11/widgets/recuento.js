/* Ejercicio interactivo: low, puntos de articulacion y puentes sobre un grafo
   no dirigido con la profundidad ya corrida (clase 11). La traza reproduce
   puentes_aux de arbol_de_puentes.py: cada vecino viene con el identificador
   de su arista y la de entrada se excluye comparando i != entrada. */
var EJERCICIO = (function () {
  var GRAFOS = [
    { boton: "Siete vértices, un puente",
      texto: "Senderos de un parque: un triángulo, un sendero que lo une al circuito de cuatro miradores.",
      n: 7,
      aristas: [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [3, 6], [4, 5], [5, 6]],
      pos: [[0.0, 1.8], [0.0, 0.2], [1.1, 1.0], [2.4, 1.0], [3.5, 1.9], [4.7, 1.9], [4.7, 0.3]] },
    { boton: "Ocho vértices, ningún puente",
      texto: "Pasillos de un edificio: tres ciclos encadenados, dos de ellos pegados por un solo salón.",
      n: 8,
      aristas: [[0, 1], [0, 3], [1, 2], [2, 3], [2, 4], [2, 5], [4, 5], [5, 6], [5, 7], [6, 7]],
      pos: [[0.0, 1.9], [1.2, 1.9], [1.2, 0.5], [0.0, 0.5], [2.4, 1.5], [2.9, 0.3], [4.1, 1.1], [4.1, -0.3]] },
    { boton: "Diez vértices, tres puentes",
      texto: "Tuberías de un acueducto: dos triángulos que comparten un nudo, y de ahí una cadena que se angosta.",
      n: 10,
      aristas: [[0, 1], [0, 2], [1, 2], [1, 3], [1, 4], [3, 4], [3, 5], [5, 6], [5, 7], [6, 7], [6, 8], [8, 9]],
      pos: [[0.0, 2.3], [0.9, 1.4], [0.0, 0.5], [2.1, 2.1], [2.1, 0.7], [3.3, 2.1], [4.5, 1.4], [4.5, 2.8], [5.7, 0.7], [6.8, 0.1]] }
  ];

  /* construir del deck: G[u] guarda parejas (vecino, id de la arista), en el
     orden en que las aristas estan escritas. */
  function construir(n, aristas) {
    var G = [], i = 0;
    while (i < n) { G.push([]); i = i + 1; }
    i = 0;
    while (i < aristas.length) {
      G[aristas[i][0]].push([aristas[i][1], i]);
      G[aristas[i][1]].push([aristas[i][0], i]);
      i = i + 1;
    }
    return G;
  }

  /* puentes_aux, guardando ademas el padre, los hijos, el arbol, las aristas
     de retroceso y los terminos del min de cada vertice. */
  function analizar(n, aristas) {
    var G = construir(n, aristas);
    var d = [], low = [], padre = [], hijos = [], terminos = [], entradaDe = [];
    var esPuente = [], arbol = [], retro = [], reloj = 0, i = 0;
    while (i < n) {
      d.push(0); low.push(0); padre.push(-1); hijos.push([]); terminos.push([]);
      entradaDe.push(-1); i = i + 1;
    }
    i = 0;
    while (i < aristas.length) { esPuente.push(false); i = i + 1; }

    function aux(u, entrada) {
      reloj = reloj + 1;
      d[u] = reloj;
      low[u] = reloj;
      entradaDe[u] = entrada;
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j][0], idx = G[u][j][1];
        if (d[v] === 0) {
          padre[v] = u;
          hijos[u].push(v);
          arbol.push([u, v, idx]);
          aux(v, idx);
          terminos[u].push({ t: "hijo", v: v, val: low[v], arista: idx });
          low[u] = Math.min(low[u], low[v]);
          if (low[v] > d[u]) { esPuente[idx] = true; }
        } else if (idx !== entrada) {
          terminos[u].push({ t: "retroceso", v: v, val: d[v], arista: idx });
          if (d[v] < d[u]) { retro.push([u, v, idx]); }
          low[u] = Math.min(low[u], d[v]);
        } else {
          terminos[u].push({ t: "entrada", v: v, val: null, arista: idx });
        }
        j = j + 1;
      }
    }
    i = 0;
    while (i < n) { if (d[i] === 0) { aux(i, -1); } i = i + 1; }

    var esArt = [], arts = [], puentes = [];
    i = 0;
    while (i < n) { esArt.push(false); i = i + 1; }
    i = 0;
    while (i < n) {
      if (padre[i] === -1) {
        if (hijos[i].length >= 2) { esArt[i] = true; }
      } else {
        var k = 0;
        while (k < hijos[i].length) {
          if (low[hijos[i][k]] >= d[i]) { esArt[i] = true; }
          k = k + 1;
        }
      }
      i = i + 1;
    }
    i = 0;
    while (i < n) { if (esArt[i]) { arts.push(i); } i = i + 1; }
    i = 0;
    while (i < aristas.length) { if (esPuente[i]) { puentes.push(i); } i = i + 1; }
    return { n: n, aristas: aristas, G: G, d: d, low: low, padre: padre,
             hijos: hijos, terminos: terminos, entradaDe: entradaDe,
             arbol: arbol, retro: retro, esArt: esArt, articulaciones: arts,
             esPuente: esPuente, puentes: puentes };
  }

  /* Cuenta los componentes que quedan al quitar un vertice o una arista. */
  function componentes(n, aristas, sinVertice, sinArista) {
    var ady = [], i = 0;
    while (i < n) { ady.push([]); i = i + 1; }
    i = 0;
    while (i < aristas.length) {
      var a = aristas[i][0], b = aristas[i][1];
      if (a !== sinVertice && b !== sinVertice && i !== sinArista) {
        ady[a].push(b);
        ady[b].push(a);
      }
      i = i + 1;
    }
    var visto = [], total = 0;
    i = 0;
    while (i < n) { visto.push(false); i = i + 1; }
    i = 0;
    while (i < n) {
      if (i !== sinVertice && !visto[i]) {
        total = total + 1;
        visto[i] = true;
        var pila = [i];
        while (pila.length > 0) {
          var u = pila.pop(), j = 0;
          while (j < ady[u].length) {
            if (!visto[ady[u][j]]) { visto[ady[u][j]] = true; pila.push(ady[u][j]); }
            j = j + 1;
          }
        }
      }
      i = i + 1;
    }
    return total;
  }

  /* De donde sale low[u]: los terminos del min y cual lo bajo. */
  function explicarLow(a, u) {
    var partes = ["d[" + u + "] = " + a.d[u]], extra = [], bajo = null, j = 0;
    while (j < a.terminos[u].length) {
      var x = a.terminos[u][j];
      if (x.t === "hijo") {
        partes.push("low[" + x.v + "] = " + x.val);
        if (x.val < a.d[u] && (bajo === null || x.val < bajo.val)) {
          bajo = { val: x.val, por: "el hijo " + x.v };
        }
      }
      if (x.t === "retroceso") {
        partes.push("d[" + x.v + "] = " + x.val);
        if (x.val < a.d[u] && (bajo === null || x.val < bajo.val)) {
          bajo = { val: x.val, por: "el retroceso " + u + "–" + x.v };
        }
      }
      if (x.t === "entrada") {
        extra.push("La arista " + u + "–" + x.v + " es la que bajó hasta " + u +
          ": el código la descarta comparando su identificador, " + x.arista +
          ", con entrada. Si contara, low[" + u + "] bajaría a " + a.d[x.v] + ".");
      }
      j = j + 1;
    }
    var texto = "low[" + u + "] = min(" + partes.join(", ") + ") = " + a.low[u] + ". ";
    if (bajo !== null && a.low[u] === bajo.val) {
      texto = texto + "Lo bajó " + bajo.por + ". ";
    } else if (a.low[u] === a.d[u]) {
      texto = texto + "Nada lo baja: ninguna arista del subárbol de " + u +
        " sale hacia un vértice descubierto antes. ";
    }
    if (extra.length > 0) { texto = texto + extra.join(" "); }
    return texto;
  }

  /* Los tres errores tipicos, para diagnosticar un low equivocado. */
  function diagnosticoLow(a, u, valor) {
    var conEntrada = [a.d[u]], conLowDelRetroceso = [a.d[u]], j = 0, msg = null;
    while (j < a.terminos[u].length) {
      var x = a.terminos[u][j];
      if (x.t === "hijo") { conEntrada.push(x.val); conLowDelRetroceso.push(x.val); }
      if (x.t === "retroceso") { conEntrada.push(x.val); conLowDelRetroceso.push(a.low[x.v]); }
      if (x.t === "entrada") { conEntrada.push(a.d[x.v]); }
      j = j + 1;
    }
    function menor(l) { var m = l[0], k = 1; while (k < l.length) { if (l[k] < m) { m = l[k]; } k = k + 1; } return m; }
    if (valor === a.d[u] && a.low[u] !== a.d[u]) {
      msg = "Escribió d[" + u + "]. Falta mirar lo que lo baja: el low de algún hijo o el d del otro extremo de un retroceso.";
    } else if (valor === menor(conEntrada) && menor(conEntrada) !== a.low[u]) {
      msg = "Contó la arista por la que la profundidad llegó a " + u +
        ". Esa no es de retroceso: es la de entrada, y el código la descarta por su identificador.";
    } else if (valor === menor(conLowDelRetroceso) && menor(conLowDelRetroceso) !== a.low[u]) {
      msg = "En un retroceso usó el low del otro extremo. Un retroceso aporta el d del otro extremo; el low solo lo aporta un hijo de árbol.";
    } else {
      msg = "No coincide. Empiece por las hojas del árbol y suba: cada hijo aporta su low, cada retroceso el d del otro extremo, y la arista de entrada no aporta nada.";
    }
    return msg;
  }

  /* Por que u es o no punto de articulacion, con la verificacion por
     definicion. */
  function explicarArticulacion(a, u) {
    var piezas = componentes(a.n, a.aristas, u, -1), texto;
    if (a.padre[u] === -1) {
      texto = "El vértice " + u + " es la raíz del árbol y tiene " + a.hijos[u].length +
        (a.hijos[u].length === 1 ? " hijo" : " hijos") + ": " + a.hijos[u].join(", ") +
        ". La raíz se decide contando hijos, no con la comparación de low. " +
        (a.esArt[u]
          ? "Con dos o más, entre sus subárboles no hay ninguna arista y quitarla los separa: es punto de articulación."
          : "Con un solo hijo, todo lo demás cuelga de él y quitarla no separa nada.");
    } else if (a.hijos[u].length === 0) {
      texto = "El vértice " + u + " es hoja del árbol de la profundidad: no tiene hijos, así que la comparación low[w] ≥ d[" + u +
        "] no se evalúa nunca. Una hoja no es punto de articulación.";
    } else {
      var filas = [], k = 0;
      while (k < a.hijos[u].length) {
        var w = a.hijos[u][k];
        filas.push("low[" + w + "] = " + a.low[w] + (a.low[w] >= a.d[u] ? " ≥ " : " < ") +
          "d[" + u + "] = " + a.d[u] + (a.low[w] >= a.d[u] ? " (sí)" : " (no)"));
        k = k + 1;
      }
      texto = "Hijos de " + u + " en el árbol: " + a.hijos[u].join(", ") + ". " + filas.join("; ") + ". " +
        (a.esArt[u]
          ? "Al menos un hijo cumple ≥, así que " + u + " es punto de articulación."
          : "Ningún hijo cumple ≥: desde cada subárbol hay un retroceso que salta por encima de " + u + ".");
    }
    return texto + " Quitando " + u + " quedan " + piezas + (piezas === 1 ? " pedazo." : " pedazos.");
  }

  /* Por que una arista es o no puente. */
  function explicarPuente(a, idx) {
    var p = a.aristas[idx], texto, piezas = componentes(a.n, a.aristas, -1, idx);
    var esDeArbol = false, v = -1, w = -1, k = 0;
    while (k < a.arbol.length) {
      if (a.arbol[k][2] === idx) { esDeArbol = true; v = a.arbol[k][0]; w = a.arbol[k][1]; }
      k = k + 1;
    }
    if (!esDeArbol) {
      texto = "La arista " + p[0] + "–" + p[1] + " es de retroceso: cierra un ciclo con el camino de árbol entre sus dos extremos, y una arista de un ciclo nunca es puente. El código solo evalúa la comparación en las aristas de árbol.";
    } else if (a.esPuente[idx]) {
      texto = "Arista de árbol, " + v + " padre de " + w + ". low[" + w + "] = " + a.low[w] +
        " > d[" + v + "] = " + a.d[v] + ": ninguna arista del subárbol de " + w + " llega a " + v +
        " ni más arriba. Es puente.";
    } else if (a.low[w] === a.d[v]) {
      texto = "Arista de árbol, " + v + " padre de " + w + ". low[" + w + "] = " + a.low[w] +
        " = d[" + v + "] = " + a.d[v] + ": hay un retroceso desde el subárbol de " + w + " hasta " + v +
        " mismo, y ese salto cierra un ciclo que contiene la arista. La comparación del puente es estricta, así que no lo es. Con la de articulación, que admite la igualdad, " +
        v + " sí queda marcado.";
    } else {
      texto = "Arista de árbol, " + v + " padre de " + w + ". low[" + w + "] = " + a.low[w] +
        " < d[" + v + "] = " + a.d[v] + ": el subárbol de " + w + " salta por encima de " + v + ". No es puente.";
    }
    return texto + " Quitando la arista quedan " + piezas + (piezas === 1 ? " pedazo." : " pedazos.");
  }

  return { grafos: GRAFOS, construir: construir, analizar: analizar,
           componentes: componentes, explicarLow: explicarLow,
           diagnosticoLow: diagnosticoLow,
           explicarArticulacion: explicarArticulacion,
           explicarPuente: explicarPuente };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var presetActual = 0, A = null;
    var comprobadoLow = false, marcasVert = [], marcasAristas = [];

    function g() { return EJERCICIO.grafos[presetActual]; }

    function dibujar() {
      var p = g(), n = p.n, pos = p.pos;
      var ancho = 520, alto = 260, r = 17;
      var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
      while (i < n) {
        if (pos[i][0] < minX) { minX = pos[i][0]; }
        if (pos[i][0] > maxX) { maxX = pos[i][0]; }
        if (pos[i][1] < minY) { minY = pos[i][1]; }
        if (pos[i][1] > maxY) { maxY = pos[i][1]; }
        i = i + 1;
      }
      var mx = 38, my = 34;
      var esc = Math.min((ancho - 2 * mx) / (maxX - minX), (alto - 2 * my) / (maxY - minY));
      var ox = (ancho - esc * (maxX - minX)) / 2, oy = (alto - esc * (maxY - minY)) / 2;
      function X(k) { return ox + (pos[k][0] - minX) * esc; }
      function Y(k) { return oy + (maxY - pos[k][1]) * esc; }

      function tipoArista(idx) {
        var t = "retroceso", k = 0;
        while (k < A.arbol.length) { if (A.arbol[k][2] === idx) { t = "arbol"; } k = k + 1; }
        return t;
      }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:560px'>";
      var e = 0;
      while (e < p.aristas.length) {
        var u = p.aristas[e][0], v = p.aristas[e][1];
        var deArbol = tipoArista(e) === "arbol";
        var trazo = deArbol ? "#1f5fa8" : "#2e7d32", grosor = deArbol ? 3 : 2.6;
        var punteada = deArbol ? "" : " stroke-dasharray='3,5' stroke-linecap='round'";
        if (comprobadoLow && A.esPuente[e]) { trazo = "#b3261e"; grosor = 4.6; punteada = ""; }
        svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) +
               "' stroke='" + trazo + "' stroke-width='" + grosor + "'" + punteada + "/>";
        var mitadX = (X(u) + X(v)) / 2, mitadY = (Y(u) + Y(v)) / 2;
        svg += "<text x='" + mitadX + "' y='" + (mitadY - 3) + "' text-anchor='middle' font-size='10' font-family='ui-monospace, monospace' fill='#6b7280' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
               e + "</text>";
        e = e + 1;
      }
      var w = 0;
      while (w < n) {
        var relleno = "#ffffff", borde = "#1f5fa8";
        if (comprobadoLow && A.esArt[w]) { relleno = "#fbe9e7"; borde = "#b3261e"; }
        svg += "<circle cx='" + X(w) + "' cy='" + Y(w) + "' r='" + r + "' fill='" + relleno +
               "' stroke='" + borde + "' stroke-width='2.4'/>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + w + "</text>";
        var etiqueta = comprobadoLow ? A.d[w] + "/" + A.low[w] : "d = " + A.d[w];
        svg += "<text x='" + X(w) + "' y='" + (Y(w) - r - 5) + "' text-anchor='middle' font-size='11.5' font-family='ui-monospace, monospace' fill='#24292f' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
               etiqueta + "</text>";
        w = w + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function armar() {
      var p = g();
      A = EJERCICIO.analizar(p.n, p.aristas);
      comprobadoLow = false;
      marcasVert = [];
      marcasAristas = [];
      var i = 0;
      while (i < p.n) { marcasVert.push(false); i = i + 1; }
      i = 0;
      while (i < p.aristas.length) { marcasAristas.push(false); i = i + 1; }

      var h = "";
      i = 0;
      while (i < p.n) {
        h += "<label class='campo-low'><span class='mono'>low[" + i + "]</span> " +
             "<span class='nota' style='margin:0'>(d = " + A.d[i] + ")</span> " +
             "<input type='number' id='low-" + i + "' min='1'></label>";
        i = i + 1;
      }
      document.getElementById("entradas").innerHTML = h;
      document.getElementById("explicaciones").innerHTML = "";
      document.getElementById("ver-texto").textContent = p.texto;
      document.getElementById("lista-aristas").textContent =
        p.aristas.map(function (a, k) { return k + ": " + a[0] + "–" + a[1]; }).join("   ");
      var v = document.getElementById("veredicto");
      v.className = "veredicto";
      v.textContent = "";
      armarMarcas();
      dibujar();
    }

    function armarMarcas() {
      var p = g(), h = "", i = 0;
      while (i < p.n) {
        h += "<button type='button' class='pieza' data-vert='" + i + "'>" + i + "</button>";
        i = i + 1;
      }
      document.getElementById("marcas-vertices").innerHTML = h;
      h = "";
      i = 0;
      while (i < p.aristas.length) {
        h += "<button type='button' class='pieza' data-arista='" + i + "'>" + p.aristas[i][0] + "–" + p.aristas[i][1] + "</button>";
        i = i + 1;
      }
      document.getElementById("marcas-aristas").innerHTML = h;
      var vv = document.getElementById("veredicto-marcas");
      vv.className = "veredicto";
      vv.textContent = "";
      document.getElementById("detalle-marcas").innerHTML = "";
      Array.prototype.forEach.call(document.querySelectorAll("#marcas-vertices button"), function (b) {
        b.addEventListener("click", function () {
          var k = parseInt(b.getAttribute("data-vert"), 10);
          marcasVert[k] = !marcasVert[k];
          b.classList.toggle("primario");
        });
      });
      Array.prototype.forEach.call(document.querySelectorAll("#marcas-aristas button"), function (b) {
        b.addEventListener("click", function () {
          var k = parseInt(b.getAttribute("data-arista"), 10);
          marcasAristas[k] = !marcasAristas[k];
          b.classList.toggle("primario");
        });
      });
    }

    function comprobarLow() {
      var p = g(), n = p.n, i = 0, vacios = 0, bien = 0, h = "";
      while (i < n) {
        if (isNaN(parseInt(document.getElementById("low-" + i).value, 10))) { vacios = vacios + 1; }
        i = i + 1;
      }
      var v = document.getElementById("veredicto");
      if (vacios > 0) {
        v.className = "veredicto mal";
        v.textContent = "Faltan " + vacios + " valores por escribir.";
      } else {
        comprobadoLow = true;
        i = 0;
        while (i < n) {
          var campo = document.getElementById("low-" + i);
          var valor = parseInt(campo.value, 10), ok = valor === A.low[i];
          if (ok) { bien = bien + 1; }
          campo.style.borderColor = ok ? "#2e7d32" : "#b3261e";
          campo.style.background = ok ? "#e7f2e8" : "#fbe9e7";
          h += "<div class='veredicto " + (ok ? "bien" : "mal") + "' style='display:block;margin-top:0.4rem'><b>" +
               i + "</b> (d = " + A.d[i] + "): " + (ok ? "correcto. " : "usted escribió " + valor + ". ") +
               EJERCICIO.explicarLow(A, i) +
               (ok ? "" : "<br><i>" + EJERCICIO.diagnosticoLow(A, i, valor) + "</i>") + "</div>";
          i = i + 1;
        }
        v.className = bien === n ? "veredicto bien" : "veredicto mal";
        v.textContent = bien + " de " + n + " valores correctos. Con los low a la vista, el dibujo ya marca los puentes en rojo y los puntos de articulación con borde rojo.";
        document.getElementById("explicaciones").innerHTML = h;
        dibujar();
      }
    }

    function comprobarMarcas() {
      var p = g(), n = p.n, i = 0, fallos = 0, h = "";
      while (i < n) {
        var ok = marcasVert[i] === A.esArt[i];
        if (!ok) { fallos = fallos + 1; }
        if (marcasVert[i] || A.esArt[i]) {
          h += "<div class='veredicto " + (ok ? "bien" : "mal") + "' style='display:block;margin-top:0.4rem'><b>Vértice " + i + "</b>: " +
               (A.esArt[i] ? "es punto de articulación" : "no es punto de articulación") +
               (ok ? "" : ", y usted lo marcó al contrario") + ". " + EJERCICIO.explicarArticulacion(A, i) + "</div>";
        }
        i = i + 1;
      }
      i = 0;
      while (i < p.aristas.length) {
        var okA = marcasAristas[i] === A.esPuente[i];
        if (!okA) { fallos = fallos + 1; }
        if (marcasAristas[i] || A.esPuente[i]) {
          h += "<div class='veredicto " + (okA ? "bien" : "mal") + "' style='display:block;margin-top:0.4rem'><b>Arista " +
               i + " (" + p.aristas[i][0] + "–" + p.aristas[i][1] + ")</b>: " +
               (A.esPuente[i] ? "es puente" : "no es puente") +
               (okA ? "" : ", y usted la marcó al contrario") + ". " + EJERCICIO.explicarPuente(A, i) + "</div>";
        }
        i = i + 1;
      }
      var vv = document.getElementById("veredicto-marcas");
      vv.className = fallos === 0 ? "veredicto bien" : "veredicto mal";
      vv.textContent = fallos === 0
        ? "Las " + (n + p.aristas.length) + " piezas quedaron bien: " + A.articulaciones.length +
          (A.articulaciones.length === 1 ? " punto de articulación y " : " puntos de articulación y ") +
          A.puentes.length + (A.puentes.length === 1 ? " puente." : " puentes.")
        : fallos + (fallos === 1 ? " pieza quedó mal." : " piezas quedaron mal.") +
          " Abajo van las razones de cada una que usted marcó y de cada una que iba marcada.";
      if (h === "") {
        h = "<div class='veredicto bien' style='display:block;margin-top:0.4rem'>No hay nada marcado y no había nada que marcar: este grafo no tiene puentes ni puntos de articulación.</div>";
      }
      document.getElementById("detalle-marcas").innerHTML = h;
    }

    document.getElementById("btn-comprobar").addEventListener("click", comprobarLow);
    document.getElementById("btn-comprobar-marcas").addEventListener("click", comprobarMarcas);
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
