/* Ejercicio interactivo: el valor paloma de cada vertice, UVa 10765 (clase 11).
   El valor de v es en cuantos componentes queda la red al quitarlo: uno por
   cada subarbol que se desprende, mas el pedazo que se queda con el padre. La
   raiz no tiene padre, asi que su valor es el numero de hijos. Los numeros
   salen de paloma_aux de uva10765_doves_and_bombs.py. */
var EJERCICIO = (function () {
  var GRAFOS = [
    { boton: "Siete estaciones, la raíz con dos hijos",
      texto: "Una red de riego: dos triángulos de canales que cuelgan del tanque 0, cada uno por un solo canal.",
      n: 7, m: 4,
      aristas: [[0, 1], [0, 4], [1, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 6]],
      pos: [[2.1, 2.4], [1.0, 1.4], [0.0, 2.1], [0.0, 0.7], [3.2, 1.4], [4.2, 2.1], [4.2, 0.7]] },
    { boton: "Nueve estaciones, una vale cuatro",
      texto: "Una red de sensores: un nudo del que salen tres cosas distintas, y una cola que llega hasta él.",
      n: 9, m: 4,
      aristas: [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [2, 8], [3, 4], [5, 6], [5, 7], [6, 7]],
      pos: [[0.0, 1.2], [1.1, 1.2], [2.2, 1.2], [2.8, 2.5], [1.6, 2.5], [3.4, 1.2], [4.5, 2.0], [4.5, 0.4], [2.2, -0.1]] },
    { boton: "Once estaciones, la raíz con tres hijos",
      texto: "Un centro de cómputo: tres salas que solo se comunican por el pasillo central 0.",
      n: 11, m: 5,
      aristas: [[0, 1], [0, 4], [0, 7], [1, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 6], [7, 8], [7, 10], [8, 9], [9, 10]],
      pos: [[2.3, 1.6], [1.2, 2.6], [0.1, 3.3], [0.1, 1.9], [1.2, 0.6], [0.1, 1.0], [0.1, -0.4], [3.6, 1.6], [4.7, 2.4], [5.8, 1.6], [4.7, 0.8]] }
  ];

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

  /* paloma_aux del deck, guardando ademas el arbol y la comparacion de cada
     hijo para poder explicar cada cuenta. */
  function analizar(n, aristas) {
    var G = construir(n, aristas);
    var d = [], low = [], valor = [], padre = [], hijos = [], raiz = [];
    var arbol = [], retro = [], suma = [], reloj = 0, i = 0;
    while (i < n) {
      d.push(0); low.push(0); valor.push(1); padre.push(-1); hijos.push([]);
      raiz.push(false); suma.push([]); i = i + 1;
    }
    function aux(u, entrada, laRaiz) {
      reloj = reloj + 1;
      d[u] = reloj;
      low[u] = reloj;
      if (u === laRaiz) { valor[u] = 0; raiz[u] = true; }
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j][0], idx = G[u][j][1];
        if (d[v] === 0) {
          padre[v] = u;
          hijos[u].push(v);
          arbol.push([u, v, idx]);
          aux(v, idx, laRaiz);
          low[u] = Math.min(low[u], low[v]);
          var cuenta = low[v] >= d[u] || u === laRaiz;
          suma[u].push({ hijo: v, lowv: low[v], du: d[u], cuenta: cuenta });
          if (cuenta) { valor[u] = valor[u] + 1; }
        } else if (idx !== entrada) {
          if (d[v] < d[u]) { retro.push([u, v, idx]); }
          low[u] = Math.min(low[u], d[v]);
        }
        j = j + 1;
      }
    }
    i = 0;
    while (i < n) { if (d[i] === 0) { aux(i, -1, i); } i = i + 1; }
    return { n: n, aristas: aristas, G: G, d: d, low: low, valor: valor,
             padre: padre, hijos: hijos, raiz: raiz, arbol: arbol, retro: retro,
             suma: suma };
  }

  /* Los componentes de G - x, para comprobar el valor por definicion. */
  function pedazos(n, aristas, x) {
    var ady = [], i = 0;
    while (i < n) { ady.push([]); i = i + 1; }
    i = 0;
    while (i < aristas.length) {
      var a = aristas[i][0], b = aristas[i][1];
      if (a !== x && b !== x) { ady[a].push(b); ady[b].push(a); }
      i = i + 1;
    }
    var grupo = [], total = 0;
    i = 0;
    while (i < n) { grupo.push(-1); i = i + 1; }
    i = 0;
    while (i < n) {
      if (i !== x && grupo[i] === -1) {
        grupo[i] = total;
        var pila = [i];
        while (pila.length > 0) {
          var u = pila.pop(), j = 0;
          while (j < ady[u].length) {
            if (grupo[ady[u][j]] === -1) { grupo[ady[u][j]] = total; pila.push(ady[u][j]); }
            j = j + 1;
          }
        }
        total = total + 1;
      }
      i = i + 1;
    }
    var listas = [];
    i = 0;
    while (i < total) { listas.push([]); i = i + 1; }
    i = 0;
    while (i < n) { if (grupo[i] !== -1) { listas[grupo[i]].push(i); } i = i + 1; }
    return { grupo: grupo, total: total, listas: listas };
  }

  /* mejores del deck: valor decreciente y, a igual valor, numero creciente. */
  function mejores(valor, m) {
    var pares = [], i = 0;
    while (i < valor.length) { pares.push([-valor[i], i]); i = i + 1; }
    pares.sort(function (a, b) { return a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]; });
    var lineas = [], k = 0;
    while (k < m) { lineas.push([pares[k][1], -pares[k][0]]); k = k + 1; }
    return lineas;
  }

  function explicarValor(a, u) {
    var piezas = pedazos(a.n, a.aristas, u), texto;
    if (a.raiz[u]) {
      texto = "El vértice " + u + " es la raíz. valor[" + u + "] se pone en 0 al descubrirla, porque no tiene padre, y suma un hijo por cada llamada que vuelve: hijos en el árbol " +
        (a.hijos[u].length === 0 ? "ninguno" : a.hijos[u].join(", ")) + ", o sea " + a.hijos[u].length +
        ". Para la raíz la comparación de low no decide nada: d[" + u + "] = 1 es el valor más bajo que hay y low[w] ≥ 1 se cumple siempre.";
    } else if (a.hijos[u].length === 0) {
      texto = "El vértice " + u + " es hoja del árbol: valor[" + u + "] se queda en el 1 con que arranca, el pedazo que se queda con el padre. Nada se desprende al quitarlo.";
    } else {
      var filas = [], k = 0;
      while (k < a.suma[u].length) {
        var s = a.suma[u][k];
        filas.push("low[" + s.hijo + "] = " + s.lowv + (s.lowv >= s.du ? " ≥ " : " < ") + "d[" + u + "] = " + s.du +
          (s.cuenta ? " (suma)" : " (no suma)"));
        k = k + 1;
      }
      var cuantos = 0;
      k = 0;
      while (k < a.suma[u].length) { if (a.suma[u][k].cuenta) { cuantos = cuantos + 1; } k = k + 1; }
      texto = "valor[" + u + "] arranca en 1, el pedazo que se queda con el padre. " + filas.join("; ") +
        ". Suman " + cuantos + (cuantos === 1 ? " hijo" : " hijos") + ", así que valor[" + u + "] = 1 + " + cuantos + " = " + a.valor[u] + ".";
    }
    return texto + " Quitando " + u + " quedan " + piezas.total + (piezas.total === 1 ? " pedazo" : " pedazos") +
      ": " + piezas.listas.map(function (l) { return "{" + l.join(", ") + "}"; }).join(", ") + ".";
  }

  /* Los dos errores del recuento, para diagnosticar un valor equivocado. */
  function diagnosticoValor(a, u, dado) {
    var estricto = 1, k = 0, msg = null;
    while (k < a.suma[u].length) {
      if (a.suma[u][k].lowv > a.suma[u][k].du) { estricto = estricto + 1; }
      k = k + 1;
    }
    var vecinos = a.G[u].length;
    if (a.raiz[u] && dado === vecinos && vecinos !== a.valor[u]) {
      msg = "Contó los vecinos de " + u + " en el grafo, que son " + vecinos +
        ", y no los hijos en el árbol de la profundidad, que son " + a.hijos[u].length +
        ". Un vecino que ya fue descubierto por otra rama no es hijo: la arista hacia él es de retroceso.";
    } else if (a.raiz[u] && dado === a.hijos[u].length + 1) {
      msg = "Le sumó el 1 del padre, y la raíz no tiene padre: su valor es el número de hijos, " + a.hijos[u].length + ".";
    } else if (!a.raiz[u] && dado === estricto && estricto !== a.valor[u]) {
      msg = "Usó low[w] > d[u], con desigualdad estricta. Esa es la prueba del puente. Para contar pedazos vale la igualdad: si el subárbol de w vuelve a u pero no sube más, quitar a u lo deja aparte igual.";
    } else if (!a.raiz[u] && dado === a.valor[u] - 1) {
      msg = "Olvidó el 1 con que arranca valor[u]: el pedazo que se queda con el padre también cuenta.";
    } else if (!a.raiz[u] && dado === a.hijos[u].length + 1 && a.hijos[u].length + 1 !== a.valor[u]) {
      msg = "Sumó todos los hijos. Solo cuentan los que cumplen low[w] ≥ d[u]: desde los demás hay un retroceso que salta por encima de " + u + " y los deja pegados al resto.";
    } else {
      msg = "No coincide. Quite " + u + " del dibujo y cuente los pedazos; después verifique con la fórmula: 1 más los hijos con low[w] ≥ d[u], o el número de hijos si es la raíz.";
    }
    return msg;
  }

  return { grafos: GRAFOS, construir: construir, analizar: analizar,
           pedazos: pedazos, mejores: mejores, explicarValor: explicarValor,
           diagnosticoValor: diagnosticoValor };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var presetActual = 0, A = null, comprobado = false, quitado = -1;

    function g() { return EJERCICIO.grafos[presetActual]; }

    function dibujar() {
      var p = g(), n = p.n, pos = p.pos;
      var ancho = 520, alto = 265, r = 17;
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
      function deArbol(idx) {
        var hay = false, k = 0;
        while (k < A.arbol.length) { if (A.arbol[k][2] === idx) { hay = true; } k = k + 1; }
        return hay;
      }
      var COLORES = ["#e3edf8", "#e7f2e8", "#fdf1dc", "#f3e8f8", "#e8f4f4"];
      var piezas = quitado >= 0 ? EJERCICIO.pedazos(n, p.aristas, quitado) : null;

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:560px'>";
      var e = 0;
      while (e < p.aristas.length) {
        var u = p.aristas[e][0], v = p.aristas[e][1];
        var fuera = quitado >= 0 && (u === quitado || v === quitado);
        var arbol = deArbol(e);
        var trazo = arbol ? "#1f5fa8" : "#2e7d32", grosor = arbol ? 3 : 2.6;
        var punteada = arbol ? "" : " stroke-dasharray='3,5' stroke-linecap='round'";
        if (fuera) { trazo = "#e3e6ea"; grosor = 2; punteada = " stroke-dasharray='2,4'"; }
        svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) +
               "' stroke='" + trazo + "' stroke-width='" + grosor + "'" + punteada + "/>";
        e = e + 1;
      }
      var w = 0;
      while (w < n) {
        var relleno = "#ffffff", borde = "#1f5fa8", grueso = 2.4;
        if (piezas !== null) {
          if (w === quitado) {
            relleno = "#f1f3f6"; borde = "#b3261e"; grueso = 3.4;
          } else {
            relleno = COLORES[piezas.grupo[w] % COLORES.length];
            borde = "#9aa3ad";
          }
        } else if (comprobado && A.valor[w] > 1) {
          relleno = "#fbe9e7"; borde = "#b3261e";
        }
        svg += "<circle cx='" + X(w) + "' cy='" + Y(w) + "' r='" + r + "' fill='" + relleno +
               "' stroke='" + borde + "' stroke-width='" + grueso + "'/>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + w + "</text>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) - r - 5) + "' text-anchor='middle' font-size='11' font-family='ui-monospace, monospace' fill='#24292f' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
               A.d[w] + "/" + A.low[w] + "</text>";
        if (comprobado && piezas === null) {
          svg += "<text x='" + X(w) + "' y='" + (Y(w) + r + 14) + "' text-anchor='middle' font-size='11.5' font-weight='700' fill='#b3261e'>" +
                 A.valor[w] + "</text>";
        }
        w = w + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function armar() {
      var p = g();
      A = EJERCICIO.analizar(p.n, p.aristas);
      comprobado = false;
      quitado = -1;
      var h = "", i = 0;
      while (i < p.n) {
        h += "<label class='campo-valor'><span class='mono'>valor[" + i + "]</span>" +
             "<span class='nota' style='margin:0'>(" + A.d[i] + "/" + A.low[i] + ")</span>" +
             "<input type='number' id='valor-" + i + "' min='1'></label>";
        i = i + 1;
      }
      document.getElementById("entradas").innerHTML = h;
      document.getElementById("explicaciones").innerHTML = "";
      document.getElementById("ver-texto").textContent = p.texto;
      document.getElementById("ver-datos").textContent =
        p.n + " estaciones y " + p.aristas.length + " vías: " +
        p.aristas.map(function (a) { return a[0] + "–" + a[1]; }).join("   ");
      var v = document.getElementById("veredicto");
      v.className = "veredicto";
      v.textContent = "";
      var vp = document.getElementById("veredicto-prediccion");
      vp.className = "veredicto";
      vp.textContent = "";
      document.getElementById("prediccion").value = "";
      document.getElementById("cuerpo-salida").innerHTML = "";
      document.getElementById("ver-m").textContent = p.m;
      armarQuitar();
      dibujar();
    }

    function armarQuitar() {
      var p = g(), h = "", i = 0;
      h += "<button type='button' class='pieza primario' data-quitar='-1'>ninguna</button>";
      while (i < p.n) {
        h += "<button type='button' class='pieza' data-quitar='" + i + "'>" + i + "</button>";
        i = i + 1;
      }
      document.getElementById("botones-quitar").innerHTML = h;
      var vq = document.getElementById("veredicto-quitar");
      vq.className = "veredicto";
      vq.textContent = "";
      Array.prototype.forEach.call(document.querySelectorAll("#botones-quitar button"), function (b) {
        b.addEventListener("click", function () {
          Array.prototype.forEach.call(document.querySelectorAll("#botones-quitar button"), function (x) { x.classList.remove("primario"); });
          b.classList.add("primario");
          quitado = parseInt(b.getAttribute("data-quitar"), 10);
          var vq2 = document.getElementById("veredicto-quitar");
          if (quitado < 0) {
            vq2.className = "veredicto";
            vq2.textContent = "";
          } else {
            var piezas = EJERCICIO.pedazos(p.n, p.aristas, quitado);
            vq2.className = "veredicto bien";
            vq2.textContent = "Sin la estación " + quitado + " quedan " + piezas.total +
              (piezas.total === 1 ? " pedazo: " : " pedazos: ") +
              piezas.listas.map(function (l) { return "{" + l.join(", ") + "}"; }).join(", ") +
              ". Su valor paloma es " + A.valor[quitado] + ", que es lo mismo, y hacen falta " +
              piezas.total + (piezas.total === 1 ? " paloma." : " palomas.");
          }
          dibujar();
        });
      });
    }

    function comprobar() {
      var p = g(), n = p.n, i = 0, vacios = 0, bien = 0, h = "";
      while (i < n) {
        if (isNaN(parseInt(document.getElementById("valor-" + i).value, 10))) { vacios = vacios + 1; }
        i = i + 1;
      }
      var v = document.getElementById("veredicto");
      if (vacios > 0) {
        v.className = "veredicto mal";
        v.textContent = "Faltan " + vacios + " valores por escribir.";
      } else {
        comprobado = true;
        quitado = -1;
        i = 0;
        while (i < n) {
          var campo = document.getElementById("valor-" + i);
          var dado = parseInt(campo.value, 10), ok = dado === A.valor[i];
          if (ok) { bien = bien + 1; }
          campo.style.borderColor = ok ? "#2e7d32" : "#b3261e";
          campo.style.background = ok ? "#e7f2e8" : "#fbe9e7";
          h += "<div class='veredicto " + (ok ? "bien" : "mal") + "' style='display:block;margin-top:0.4rem'><b>" + i +
               "</b>" + (A.raiz[i] ? " (raíz)" : "") + ": " + (ok ? "correcto, vale " + A.valor[i] + ". " : "usted escribió " + dado + "; vale " + A.valor[i] + ". ") +
               EJERCICIO.explicarValor(A, i) + (ok ? "" : "<br><i>" + EJERCICIO.diagnosticoValor(A, i, dado) + "</i>") + "</div>";
          i = i + 1;
        }
        v.className = bien === n ? "veredicto bien" : "veredicto mal";
        v.textContent = bien + " de " + n + " valores correctos. En el dibujo, el número rojo bajo cada vértice es su valor paloma.";
        document.getElementById("explicaciones").innerHTML = h;
        pintarSalida();
        dibujar();
      }
    }

    function pintarSalida() {
      var p = g();
      var lineas = EJERCICIO.mejores(A.valor, p.m), h = "", k = 0;
      while (k < lineas.length) {
        h += "<tr><td>" + (k + 1) + "</td><td><code>" + lineas[k][0] + " " + lineas[k][1] + "</code></td><td>" +
             (k > 0 && lineas[k][1] === lineas[k - 1][1]
               ? "mismo valor que la anterior, y gana el número menor"
               : "valor " + lineas[k][1]) + "</td></tr>";
        k = k + 1;
      }
      document.getElementById("cuerpo-salida").innerHTML = h;
    }

    document.getElementById("btn-comprobar").addEventListener("click", comprobar);
    document.getElementById("btn-prediccion").addEventListener("click", function () {
      var valor = parseInt(document.getElementById("prediccion").value, 10);
      var v = document.getElementById("veredicto-prediccion");
      var maximo = A.valor[0], i = 1;
      while (i < A.valor.length) { if (A.valor[i] > maximo) { maximo = A.valor[i]; } i = i + 1; }
      var cuales = [];
      i = 0;
      while (i < A.valor.length) { if (A.valor[i] === maximo) { cuales.push(i); } i = i + 1; }
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba un número primero.";
      } else if (valor === maximo) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: " + maximo + ", en " + (cuales.length === 1 ? "la estación " : "las estaciones ") +
          cuales.join(", ") + ". Un valor de " + maximo + " quiere decir que al bombardearla hacen falta " + maximo +
          " palomas para que el mensaje llegue a todo lo que sigue en pie.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. El valor más alto es " + maximo +
          ". Busque el vértice del que salen más ramas que no vuelven a juntarse por otro lado, y acuérdese de contar el pedazo que se queda con el padre.";
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
