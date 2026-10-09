/* Ejercicio interactivo: las candidatas a capital, SPOJ CAPCITY (clase 11).
   Una ciudad es candidata cuando se alcanza desde todas las demas, y eso pasa
   exactamente cuando su componente fuertemente conexo es el sumidero de la
   condensacion. Con dos sumideros no hay candidatas. Los numeros salen de
   capital.cpp: aqui los componentes se calculan con Tarjan en lugar de Gabow,
   que devuelve lo mismo. Las ciudades van de 1 a n. */
var EJERCICIO = (function () {
  var GRAFOS = [
    { boton: "Ocho ciudades, la capital es un par",
      texto: "Un triángulo de ciudades que desagua en un par de puertos, y de ahí a dos ciudades del interior que se comunican entre sí.",
      n: 8,
      aristas: [[1, 2], [2, 3], [3, 1], [1, 4], [2, 6], [6, 5], [4, 5], [5, 4], [4, 7], [7, 8], [8, 7]],
      pos: { 1: [0.0, 2.2], 2: [0.0, 0.8], 3: [-1.2, 1.5], 4: [1.6, 2.4], 5: [2.4, 1.1],
             6: [1.2, -0.1], 7: [3.9, 2.4], 8: [3.9, 1.0] } },
    { boton: "Siete ciudades, dos sumideros",
      texto: "Un par de ciudades manda al nudo central, y del nudo salen dos ramales que no se comunican entre sí.",
      n: 7,
      aristas: [[1, 2], [2, 1], [1, 3], [3, 4], [4, 5], [5, 4], [3, 6], [6, 7], [7, 6]],
      pos: { 1: [0.0, 2.1], 2: [0.0, 0.7], 3: [1.3, 1.4], 4: [2.7, 2.4], 5: [4.0, 2.4],
             6: [2.7, 0.4], 7: [4.0, 0.4] } },
    { boton: "Nueve ciudades, la capital es una sola",
      texto: "Un anillo de cuatro ciudades con dos salidas que vuelven a juntarse más abajo y terminan en una sola ciudad.",
      n: 9,
      aristas: [[1, 2], [2, 3], [3, 4], [4, 1], [1, 5], [5, 6], [6, 5], [2, 8], [6, 7], [8, 7], [7, 9]],
      pos: { 1: [0.3, 2.6], 2: [1.6, 2.8], 3: [1.8, 1.6], 4: [0.6, 1.4], 5: [-0.9, 1.9],
             6: [-1.3, 0.6], 7: [1.4, 0.2], 8: [3.2, 1.8], 9: [2.6, -0.7] } }
  ];

  function construir(n, aristas) {
    var G = [], H = [], i = 0;
    while (i <= n) { G.push([]); H.push([]); i = i + 1; }
    i = 0;
    while (i < aristas.length) {
      G[aristas[i][0]].push(aristas[i][1]);
      H[aristas[i][1]].push(aristas[i][0]);
      i = i + 1;
    }
    return { G: G, H: H };
  }

  /* Tarjan iterativo: ind[v] es el componente de v, numerados en el orden en
     que se cierran. Devuelve lo mismo que el Gabow de capital.cpp. */
  function componentes(n, aristas) {
    var ady = construir(n, aristas).G;
    var d = [], low = [], ind = [], enPila = [], pila = [], reloj = 0, i = 0, total = 0;
    while (i <= n) { d.push(0); low.push(0); ind.push(-1); enPila.push(false); i = i + 1; }
    function aux(v) {
      reloj = reloj + 1;
      d[v] = reloj;
      low[v] = reloj;
      pila.push(v);
      enPila[v] = true;
      var j = 0;
      while (j < ady[v].length) {
        var w = ady[v][j];
        if (d[w] === 0) {
          aux(w);
          low[v] = Math.min(low[v], low[w]);
        } else if (enPila[w]) {
          low[v] = Math.min(low[v], d[w]);
        }
        j = j + 1;
      }
      if (low[v] === d[v]) {
        var cerrado = false;
        while (!cerrado) {
          var u = pila.pop();
          enPila[u] = false;
          ind[u] = total;
          cerrado = u === v;
        }
        total = total + 1;
      }
    }
    i = 1;
    while (i <= n) { if (d[i] === 0) { aux(i); } i = i + 1; }
    var listas = [];
    i = 0;
    while (i < total) { listas.push([]); i = i + 1; }
    i = 1;
    while (i <= n) { listas[ind[i]].push(i); i = i + 1; }
    i = 0;
    while (i < total) { listas[i].sort(function (a, b) { return a - b; }); i = i + 1; }
    var rep = [];
    i = 0;
    while (i <= n) { rep.push(i === 0 ? 0 : listas[ind[i]][0]); i = i + 1; }
    return { ind: ind, total: total, listas: listas, rep: rep, d: d, low: low };
  }

  /* La condensacion: cuantas carreteras salen de cada componente hacia otro y
     que parejas de componentes quedan unidas. */
  function condensar(n, aristas, C) {
    var salidas = [], vistas = {}, arcos = [], i = 0;
    while (i < C.total) { salidas.push(0); i = i + 1; }
    i = 0;
    while (i < aristas.length) {
      var a = C.ind[aristas[i][0]], b = C.ind[aristas[i][1]];
      if (a !== b) {
        salidas[a] = salidas[a] + 1;
        var clave = a + ">" + b;
        if (!vistas[clave]) { vistas[clave] = true; arcos.push([a, b]); }
      }
      i = i + 1;
    }
    var sumideros = [];
    i = 0;
    while (i < C.total) { if (salidas[i] === 0) { sumideros.push(i); } i = i + 1; }
    return { salidas: salidas, arcos: arcos, sumideros: sumideros };
  }

  /* La respuesta del juez: la lista ordenada, o la lista vacia con dos
     sumideros o mas. */
  function candidatas(n, aristas) {
    var C = componentes(n, aristas), K = condensar(n, aristas, C), lista = [];
    if (K.sumideros.length === 1) { lista = C.listas[K.sumideros[0]].slice(); }
    return { C: C, K: K, lista: lista, hay: K.sumideros.length === 1 };
  }

  /* Las ciudades desde las que se llega a v, por la definicion y sin tocar los
     componentes: un recorrido sobre las carreteras al reves. */
  function alcanzanA(n, aristas, v) {
    var H = construir(n, aristas).H, visto = [], pila = [v], llegan = [], i = 0;
    while (i <= n) { visto.push(false); i = i + 1; }
    visto[v] = true;
    while (pila.length > 0) {
      var u = pila.pop(), j = 0;
      while (j < H[u].length) {
        if (!visto[H[u][j]]) { visto[H[u][j]] = true; pila.push(H[u][j]); }
        j = j + 1;
      }
    }
    i = 1;
    while (i <= n) { if (visto[i] && i !== v) { llegan.push(i); } i = i + 1; }
    return llegan;
  }

  function nombreComp(C, k) {
    return "{" + C.listas[k].join(", ") + "}";
  }

  /* Por que la ciudad u queda con ese representante. */
  function explicarCiudad(n, aristas, C, u) {
    var compa = C.listas[C.ind[u]], texto;
    if (compa.length === 1) {
      texto = "La ciudad " + u + " está sola en su componente: ninguna otra ciudad se alcanza desde " +
        u + " y alcanza de vuelta a " + u + ". Su representante es ella misma.";
    } else {
      var otras = compa.filter(function (x) { return x !== u; });
      texto = "Desde " + u + " se llega a " + otras.join(", ") + " y desde " + (otras.length === 1 ? "esa ciudad" : "cada una de esas ciudades") +
        " se vuelve a " + u + ", así que las " + compa.length + " están en el mismo componente " + nombreComp(C, C.ind[u]) +
        ". El representante es la menor, " + compa[0] + ".";
    }
    return texto;
  }

  /* El error que mas aparece al agrupar: confundir alcanzar con alcanzarse. */
  function diagnosticoRep(n, aristas, C, u, dado) {
    var msg;
    if (dado < 1 || dado > n) {
      msg = "El representante es el número de una ciudad, entre 1 y " + n + ".";
    } else if (C.ind[dado] === C.ind[u]) {
      msg = "El componente está bien agrupado, pero el representante es la ciudad de número menor, " +
        C.listas[C.ind[u]][0] + ", no " + dado + ".";
    } else {
      var ida = alcanzanA(n, aristas, dado).indexOf(u) >= 0;
      var vuelta = alcanzanA(n, aristas, u).indexOf(dado) >= 0;
      if (ida && !vuelta) {
        msg = "Desde " + u + " se llega a " + dado + ", pero de " + dado + " no se vuelve a " + u +
          ". Un componente fuertemente conexo pide las dos direcciones.";
      } else if (!ida && vuelta) {
        msg = "A " + u + " se llega desde " + dado + ", pero de " + u + " no se vuelve a " + dado +
          ". Hace falta el camino de ida y el de vuelta.";
      } else {
        msg = "Entre " + u + " y " + dado + " no hay camino en ninguna de las dos direcciones. Están en componentes distintos.";
      }
    }
    return msg;
  }

  return { grafos: GRAFOS, construir: construir, componentes: componentes,
           condensar: condensar, candidatas: candidatas, alcanzanA: alcanzanA,
           nombreComp: nombreComp, explicarCiudad: explicarCiudad,
           diagnosticoRep: diagnosticoRep };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var presetActual = 0, R = null, agrupado = false, marcado = {}, mirada = -1;

    function g() { return EJERCICIO.grafos[presetActual]; }

    /* Flecha de a a b, recortada en el radio de los dos circulos. Las parejas
       antiparalelas se curvan a lados opuestos. */
    function flecha(xa, ya, xb, yb, r, curva, color, grosor) {
      var dx = xb - xa, dy = yb - ya, largo = Math.sqrt(dx * dx + dy * dy);
      var ux = dx / largo, uy = dy / largo, px = -uy, py = ux;
      var cx = (xa + xb) / 2 + px * curva, cy = (ya + yb) / 2 + py * curva;
      var x1 = xa + ux * r * 0.95, y1 = ya + uy * r * 0.95;
      var tx = xb - cx, ty = yb - cy, tl = Math.sqrt(tx * tx + ty * ty);
      var vx = tx / tl, vy = ty / tl;
      var x2 = xb - vx * (r + 7), y2 = yb - vy * (r + 7);
      var ax = x2 + vx * 7, ay = y2 + vy * 7;
      var qx = -vy, qy = vx;
      var svg = "<path d='M " + x1 + " " + y1 + " Q " + cx + " " + cy + " " + x2 + " " + y2 +
        "' fill='none' stroke='" + color + "' stroke-width='" + grosor + "'/>";
      svg += "<polygon points='" + ax + "," + ay + " " + (x2 + qx * 3.8) + "," + (y2 + qy * 3.8) +
        " " + (x2 - qx * 3.8) + "," + (y2 - qy * 3.8) + "' fill='" + color + "'/>";
      return svg;
    }

    var COLORES = ["#e3edf8", "#e7f2e8", "#fdf1dc", "#f3e8f8", "#e8f4f4", "#fbe9e7"];
    var BORDES = ["#1f5fa8", "#2e7d32", "#a86a12", "#7b4397", "#2f7a7a", "#b3261e"];

    function escala(pos, claves, ancho, alto, mx, my) {
      var minX = pos[claves[0]][0], maxX = minX, minY = pos[claves[0]][1], maxY = minY, i = 0;
      while (i < claves.length) {
        var p = pos[claves[i]];
        if (p[0] < minX) { minX = p[0]; }
        if (p[0] > maxX) { maxX = p[0]; }
        if (p[1] < minY) { minY = p[1]; }
        if (p[1] > maxY) { maxY = p[1]; }
        i = i + 1;
      }
      var anchoU = maxX - minX || 1, altoU = maxY - minY || 1;
      var esc = Math.min((ancho - 2 * mx) / anchoU, (alto - 2 * my) / altoU);
      return { esc: esc, minX: minX, maxY: maxY,
               ox: (ancho - esc * anchoU) / 2, oy: (alto - esc * altoU) / 2 };
    }

    function dibujar() {
      var p = g(), ancho = 560, alto = 290, r = 17;
      var claves = Object.keys(p.pos);
      var E = escala(p.pos, claves, ancho, alto, 40, 36);
      function X(k) { return E.ox + (p.pos[k][0] - E.minX) * E.esc; }
      function Y(k) { return E.oy + (E.maxY - p.pos[k][1]) * E.esc; }
      var hayVuelta = {}, i = 0;
      while (i < p.aristas.length) { hayVuelta[p.aristas[i][0] + ">" + p.aristas[i][1]] = true; i = i + 1; }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:600px'>";
      i = 0;
      while (i < p.aristas.length) {
        var u = p.aristas[i][0], v = p.aristas[i][1];
        var doble = hayVuelta[v + ">" + u] === true;
        var mismo = agrupado && R.C.ind[u] === R.C.ind[v];
        var color = mismo ? BORDES[R.C.ind[u] % BORDES.length] : "#9aa3ad";
        svg += flecha(X(u), Y(u), X(v), Y(v), r, doble ? 16 : 0, color, mismo ? 2.8 : 2.2);
        i = i + 1;
      }
      i = 0;
      while (i < claves.length) {
        var w = parseInt(claves[i], 10);
        var relleno = "#ffffff", borde = "#1f5fa8", grueso = 2.4;
        if (agrupado) {
          relleno = COLORES[R.C.ind[w] % COLORES.length];
          borde = BORDES[R.C.ind[w] % BORDES.length];
          if (R.hay && R.lista.indexOf(w) >= 0) { grueso = 4; }
        }
        if (mirada === w) { borde = "#b3261e"; grueso = 4; }
        svg += "<circle cx='" + X(w) + "' cy='" + Y(w) + "' r='" + r + "' fill='" + relleno +
          "' stroke='" + borde + "' stroke-width='" + grueso + "'/>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + w + "</text>";
        if (agrupado) {
          svg += "<text x='" + X(w) + "' y='" + (Y(w) - r - 6) + "' text-anchor='middle' font-size='10.5' font-family='ui-monospace, monospace' fill='" +
            BORDES[R.C.ind[w] % BORDES.length] + "' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
            EJERCICIO.nombreComp(R.C, R.C.ind[w]) + "</text>";
        }
        i = i + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    /* La condensacion, con cada componente en el centro de sus ciudades. */
    function dibujarCondensacion() {
      if (!agrupado) {
        document.getElementById("panel-condensacion").innerHTML =
          "<p class='nota' style='text-align:center'>Agrupe los componentes arriba y la condensación aparece aquí.</p>";
      } else {
        var p = g(), ancho = 560, alto = 240, r = 24, pos = {}, k = 0;
        while (k < R.C.total) {
          var lista = R.C.listas[k], sx = 0, sy = 0, j = 0;
          while (j < lista.length) { sx = sx + p.pos[lista[j]][0]; sy = sy + p.pos[lista[j]][1]; j = j + 1; }
          pos[k] = [sx / lista.length, sy / lista.length];
          k = k + 1;
        }
        var claves = Object.keys(pos);
        var E = escala(pos, claves, ancho, alto, 58, 40);
        function X(c) { return E.ox + (pos[c][0] - E.minX) * E.esc; }
        function Y(c) { return E.oy + (E.maxY - pos[c][1]) * E.esc; }
        var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:600px'>";
        var i = 0;
        while (i < R.K.arcos.length) {
          svg += flecha(X(R.K.arcos[i][0]), Y(R.K.arcos[i][0]), X(R.K.arcos[i][1]), Y(R.K.arcos[i][1]), r, 0, "#6b7280", 2.4);
          i = i + 1;
        }
        i = 0;
        while (i < R.C.total) {
          var esSumidero = R.K.salidas[i] === 0;
          svg += "<circle cx='" + X(i) + "' cy='" + Y(i) + "' r='" + r + "' fill='" + COLORES[i % COLORES.length] +
            "' stroke='" + (esSumidero ? "#b3261e" : BORDES[i % BORDES.length]) + "' stroke-width='" + (esSumidero ? 4 : 2.4) + "'/>";
          svg += "<text x='" + X(i) + "' y='" + (Y(i) + 4) + "' text-anchor='middle' font-size='11' font-family='ui-monospace, monospace' fill='#24292f'>" +
            R.C.listas[i].join(",") + "</text>";
          svg += "<text x='" + X(i) + "' y='" + (Y(i) + r + 14) + "' text-anchor='middle' font-size='10.5' fill='#6b7280'>salen " + R.K.salidas[i] + "</text>";
          i = i + 1;
        }
        svg += "</svg>";
        document.getElementById("panel-condensacion").innerHTML = svg;
      }
    }

    function armarEntradas() {
      var p = g(), h = "", i = 1;
      while (i <= p.n) {
        h += "<label class='campo-valor'><span class='mono'>rep[" + i + "]</span>" +
          "<input type='number' id='rep-" + i + "' min='1' max='" + p.n + "'></label>";
        i = i + 1;
      }
      document.getElementById("entradas").innerHTML = h;
    }

    function armarMarcas() {
      if (!agrupado) {
        document.getElementById("marcas").innerHTML =
          "<p class='nota' style='margin-top:0'>Primero agrupe los componentes.</p>";
      } else {
        var h = "", i = 0;
        while (i < R.C.total) {
          h += "<div class='barra-fila'><span class='rotulo' style='width:9rem;font-family:ui-monospace,monospace'>" +
            EJERCICIO.nombreComp(R.C, i) + "</span>" +
            "<span class='opciones' id='op-" + i + "'>" +
            "<button type='button' data-comp='" + i + "' data-sale='si'>sale alguna</button>" +
            "<button type='button' data-comp='" + i + "' data-sale='no'>no sale ninguna</button>" +
            "</span></div>";
          i = i + 1;
        }
        document.getElementById("marcas").innerHTML = h;
        Array.prototype.forEach.call(document.querySelectorAll("#marcas button"), function (b) {
          b.addEventListener("click", function () {
            var c = parseInt(b.getAttribute("data-comp"), 10);
            marcado[c] = b.getAttribute("data-sale");
            Array.prototype.forEach.call(document.querySelectorAll("#op-" + c + " button"), function (x) { x.classList.remove("primario"); });
            b.classList.add("primario");
            comprobarMarcas();
          });
        });
      }
    }

    function comprobarMarcas() {
      var v = document.getElementById("veredicto-marcas"), h = "", bien = 0, puestas = 0, i = 0;
      while (i < R.C.total) {
        if (marcado[i] !== undefined) {
          puestas = puestas + 1;
          var sale = R.K.salidas[i] > 0, ok = (marcado[i] === "si") === sale;
          if (ok) { bien = bien + 1; }
          h += "<div class='veredicto " + (ok ? "bien" : "mal") + "' style='display:block;margin-top:0.35rem'><b>" +
            EJERCICIO.nombreComp(R.C, i) + "</b>: " +
            (sale ? "salen " + R.K.salidas[i] + " carretera" + (R.K.salidas[i] === 1 ? "" : "s") +
              " hacia otro componente, así que no es sumidero y ninguna de sus ciudades puede ser capital."
                  : "no sale ninguna carretera hacia otro componente: es un sumidero.") + "</div>";
        }
        i = i + 1;
      }
      v.className = puestas === R.C.total && bien === R.C.total ? "veredicto bien" : "veredicto mal";
      v.textContent = bien + " de " + R.C.total + " componentes clasificados, con " + puestas + " respondidos. " +
        (puestas === R.C.total
          ? "Hay " + R.K.sumideros.length + " sumidero" + (R.K.sumideros.length === 1 ? "." : "s.")
          : "Falta clasificar " + (R.C.total - puestas) + ".");
      document.getElementById("detalle-marcas").innerHTML = h;
    }

    function comprobarRep() {
      var p = g(), i = 1, vacios = 0, bien = 0, h = "";
      while (i <= p.n) {
        if (isNaN(parseInt(document.getElementById("rep-" + i).value, 10))) { vacios = vacios + 1; }
        i = i + 1;
      }
      var v = document.getElementById("veredicto");
      if (vacios > 0) {
        v.className = "veredicto mal";
        v.textContent = "Faltan " + vacios + " representantes por escribir.";
      } else {
        i = 1;
        while (i <= p.n) {
          var campo = document.getElementById("rep-" + i);
          var dado = parseInt(campo.value, 10), ok = dado === R.C.rep[i];
          if (ok) { bien = bien + 1; }
          campo.style.borderColor = ok ? "#2e7d32" : "#b3261e";
          campo.style.background = ok ? "#e7f2e8" : "#fbe9e7";
          h += "<div class='veredicto " + (ok ? "bien" : "mal") + "' style='display:block;margin-top:0.4rem'><b>" + i + "</b>: " +
            (ok ? "correcto, " + R.C.rep[i] + ". " : "usted escribió " + dado + "; va " + R.C.rep[i] + ". ") +
            EJERCICIO.explicarCiudad(p.n, p.aristas, R.C, i) +
            (ok ? "" : "<br><i>" + EJERCICIO.diagnosticoRep(p.n, p.aristas, R.C, i, dado) + "</i>") + "</div>";
          i = i + 1;
        }
        v.className = bien === p.n ? "veredicto bien" : "veredicto mal";
        v.textContent = bien + " de " + p.n + " representantes correctos. En el dibujo, cada componente queda de un color y sobre cada ciudad va el conjunto al que pertenece.";
        document.getElementById("explicaciones").innerHTML = h;
        if (bien === p.n) {
          agrupado = true;
          marcado = {};
          armarMarcas();
          document.getElementById("veredicto-marcas").className = "veredicto";
          document.getElementById("veredicto-marcas").textContent = "";
          document.getElementById("detalle-marcas").innerHTML = "";
          dibujarCondensacion();
        }
        dibujar();
      }
    }

    function armarMiradas() {
      var p = g(), h = "", i = 1;
      h += "<button type='button' class='pieza primario' data-mirar='-1'>ninguna</button>";
      while (i <= p.n) {
        h += "<button type='button' class='pieza' data-mirar='" + i + "'>" + i + "</button>";
        i = i + 1;
      }
      document.getElementById("botones-mirar").innerHTML = h;
      Array.prototype.forEach.call(document.querySelectorAll("#botones-mirar button"), function (b) {
        b.addEventListener("click", function () {
          Array.prototype.forEach.call(document.querySelectorAll("#botones-mirar button"), function (x) { x.classList.remove("primario"); });
          b.classList.add("primario");
          mirada = parseInt(b.getAttribute("data-mirar"), 10);
          var vm = document.getElementById("veredicto-mirar");
          if (mirada < 0) {
            vm.className = "veredicto";
            vm.textContent = "";
          } else {
            var llegan = EJERCICIO.alcanzanA(p.n, p.aristas, mirada);
            var completo = llegan.length === p.n - 1;
            vm.className = completo ? "veredicto bien" : "veredicto mal";
            vm.textContent = "A la ciudad " + mirada + " se llega desde " + llegan.length + " de las " + (p.n - 1) +
              " ciudades restantes" + (llegan.length === 0 ? "." : ": " + llegan.join(", ") + ".") +
              (completo ? " Cumple la definición, y por eso está en la lista."
                        : " No cumple: le faltan " + (p.n - 1 - llegan.length) + ".");
          }
          dibujar();
        });
      });
    }

    function comprobarSalida() {
      var p = g(), texto = document.getElementById("salida").value.trim();
      var v = document.getElementById("veredicto-salida");
      var dada = texto.length === 0 ? [] : texto.split(/[\s,]+/).map(function (x) { return parseInt(x, 10); });
      var esperada = R.hay ? R.lista : [0];
      var igual = dada.length === esperada.length, i = 0;
      while (i < esperada.length) { if (dada[i] !== esperada[i]) { igual = false; } i = i + 1; }
      if (dada.some(isNaN)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba los números separados por espacios, o un 0 si no hay candidatas.";
      } else if (igual) {
        v.className = "veredicto bien";
        v.textContent = R.hay
          ? "Correcto. El único sumidero es " + EJERCICIO.nombreComp(R.C, R.K.sumideros[0]) +
            ", así que el juez recibe primero el " + R.lista.length + " y después la lista " + R.lista.join(" ") + "."
          : "Correcto: 0. Los sumideros son " + R.K.sumideros.map(function (k) { return EJERCICIO.nombreComp(R.C, k); }).join(" y ") +
            ", y entre ellos no hay camino en ninguna dirección, así que ninguna ciudad se alcanza desde todas.";
      } else {
        var msg;
        if (!R.hay && dada.length > 1) {
          msg = "Hay " + R.K.sumideros.length + " sumideros, " +
            R.K.sumideros.map(function (k) { return EJERCICIO.nombreComp(R.C, k); }).join(" y ") +
            ". Las ciudades de uno no se alcanzan desde las del otro, así que la respuesta es 0 y no la unión de los dos.";
        } else if (R.hay && dada.length === R.C.listas[R.K.sumideros[0]].length) {
          msg = "El conjunto es el del sumidero, pero el orden va creciente: " + R.lista.join(" ") + ".";
        } else if (R.hay) {
          msg = "La lista es " + R.lista.join(" ") + ", que son las ciudades del sumidero " +
            EJERCICIO.nombreComp(R.C, R.K.sumideros[0]) + ". Las de un componente con alguna carretera de salida quedan fuera: de allá no se vuelve.";
        } else {
          msg = "La respuesta es 0.";
        }
        v.className = "veredicto mal";
        v.textContent = msg;
      }
    }

    function armar() {
      var p = g();
      R = EJERCICIO.candidatas(p.n, p.aristas);
      agrupado = false;
      marcado = {};
      mirada = -1;
      document.getElementById("ver-texto").textContent = p.texto;
      document.getElementById("ver-datos").textContent =
        p.n + " ciudades y " + p.aristas.length + " carreteras de una sola vía: " +
        p.aristas.map(function (a) { return a[0] + "→" + a[1]; }).join("   ");
      armarEntradas();
      armarMarcas();
      armarMiradas();
      document.getElementById("explicaciones").innerHTML = "";
      document.getElementById("detalle-marcas").innerHTML = "";
      document.getElementById("salida").value = "";
      ["veredicto", "veredicto-prediccion", "veredicto-marcas", "veredicto-salida", "veredicto-mirar"].forEach(function (id) {
        var v = document.getElementById(id);
        v.className = "veredicto";
        v.textContent = "";
      });
      document.getElementById("prediccion").value = "";
      dibujar();
      dibujarCondensacion();
    }

    document.getElementById("btn-comprobar").addEventListener("click", comprobarRep);
    document.getElementById("btn-salida").addEventListener("click", comprobarSalida);
    document.getElementById("btn-prediccion").addEventListener("click", function () {
      var valor = parseInt(document.getElementById("prediccion").value, 10);
      var v = document.getElementById("veredicto-prediccion"), p = g();
      var total = R.lista.length;
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba un número primero.";
      } else if (valor === total) {
        v.className = "veredicto bien";
        v.textContent = total === 0
          ? "Correcto: ninguna. Esta red tiene " + R.K.sumideros.length + " componentes sin salida, y las ciudades de uno no se alcanzan desde las del otro."
          : "Correcto: " + total + ". Son las ciudades del único componente sin carreteras de salida.";
      } else if (total === 0 && valor > 0) {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Busque los componentes de los que no sale ninguna carretera: aquí hay más de uno, y eso deja la red sin capital.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide: son " + total + ". Cuente las ciudades del componente del que no sale ninguna carretera hacia otro.";
      }
    });
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
