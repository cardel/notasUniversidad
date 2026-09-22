/* Ejercicio interactivo: de la entrada del juez al grafo (clase 8).
   UVa 10305 con una instancia que no es la de la muestra. La simulacion
   reproduce leer_grafo tal como esta en el codigo de la clase. */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def leer_grafo(datos, p, n, m):",                       num: null },
    { txt: "    G = []",                                            num: 1 },
    { txt: "    u = 0",                                             num: 2 },
    { txt: "    while u < n:",                                      num: 3, bloque: 1 },
    { txt: "        G.append([])",                                  num: 4, bloque: 1 },
    { txt: "        u = u + 1",                                     num: 5, bloque: 1 },
    { txt: "    k = 0",                                             num: 6 },
    { txt: "    while k < m:",                                      num: 7, bloque: 2 },
    { txt: "        G[int(datos[p]) - 1].append(int(datos[p + 1]) - 1)", num: 8, bloque: 2 },
    { txt: "        p = p + 2",                                     num: 9, bloque: 2 },
    { txt: "        k = k + 1",                                     num: 10, bloque: 2 },
    { txt: "    return (G, p)",                                     num: 11 }
  ];

  function simular(params) {
    var n = params.n, m = params.m, datos = params.datos, p0 = params.p0;
    var pasos = [];
    var G = null, u = null, k = null, p = null;
    function snap(linea, extra) {
      var q = { linea: linea, u: u === null ? "–" : u, k: k === null ? "–" : k, p: p === null ? "–" : p,
                G: G === null ? null : G.map(function (l) { return l.slice(); }) };
      if (extra) { for (var x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }
    p = p0;
    G = []; snap(1);
    var uu = 0; u = 0; snap(2);
    var sigue = true;
    while (sigue) {
      snap(3);
      if (uu < n) {
        G.push([]); snap(4);
        uu = uu + 1; u = uu; snap(5);
      } else { sigue = false; }
    }
    u = null;
    var kk = 0; k = 0; snap(6);
    sigue = true;
    while (sigue) {
      snap(7);
      if (kk < m) {
        var i = parseInt(datos[p], 10), j = parseInt(datos[p + 1], 10);
        G[i - 1].push(j - 1);
        snap(8, { par: [i, j], arista: [i - 1, j - 1] });
        p = p + 2; snap(9);
        kk = kk + 1; k = kk; snap(10);
      } else { sigue = false; }
    }
    k = null;
    snap(11, { fin: true });
    return pasos;
  }

  function kahn(G) {
    var n = G.length, entrada = [], u = 0, i;
    while (u < n) { entrada.push(0); u = u + 1; }
    u = 0;
    while (u < n) { i = 0; while (i < G[u].length) { entrada[G[u][i]] = entrada[G[u][i]] + 1; i = i + 1; } u = u + 1; }
    var cola = [];
    u = 0; while (u < n) { if (entrada[u] === 0) { cola.push(u); } u = u + 1; }
    var orden = [];
    while (cola.length > 0) {
      u = cola.shift(); orden.push(u); i = 0;
      while (i < G[u].length) { entrada[G[u][i]] = entrada[G[u][i]] - 1; if (entrada[G[u][i]] === 0) { cola.push(G[u][i]); } i = i + 1; }
    }
    return orden;
  }

  function linea(G) {
    var o = kahn(G), res = [], i = 0;
    while (i < o.length) { res.push(o[i] + 1); i = i + 1; }
    return res.join(" ");
  }

  return { codigo: CODIGO, simular: simular, kahn: kahn, linea: linea };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PARES = [[1, 4], [4, 2], [1, 3], [5, 4], [6, 1], [3, 2]];
    var n = 6, m = PARES.length;
    var datos = ["6", "6"];
    PARES.forEach(function (par) { datos.push(String(par[0])); datos.push(String(par[1])); });
    datos.push("0"); datos.push("0");
    var POS = [[1.4, 1.2], [4.2, 1.2], [2.8, 2.0], [2.8, 0.4], [0, 1.8], [0, 0.4]];

    function armarG() {
      var G = [], i = 0;
      while (i < n) { G.push([]); i = i + 1; }
      i = 0;
      while (i < PARES.length) { G[PARES[i][0] - 1].push(PARES[i][1] - 1); i = i + 1; }
      return G;
    }
    var G = armarG();

    function dibujar(parcial, arista) {
      var ancho = 460, alto = 250;
      function X(i) { return 40 + (POS[i][0] / 4.2) * (ancho - 80); }
      function Y(i) { return 30 + ((2.4 - POS[i][1]) / 2.4) * (alto - 60); }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:480px'>";
      svg += "<defs><marker id='flecha' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker>";
      svg += "<marker id='flechaAzul' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#1f5fa8'/></marker></defs>";
      var lista = parcial === null || parcial === undefined ? G : parcial;
      var u = 0, i;
      while (u < lista.length) {
        i = 0;
        while (i < lista[u].length) {
          var v = lista[u][i];
          var viva = arista !== null && arista !== undefined && arista[0] === u && arista[1] === v;
          var dx = X(v) - X(u), dy = Y(v) - Y(u), d = Math.sqrt(dx * dx + dy * dy);
          svg += "<line x1='" + (X(u) + dx / d * 17) + "' y1='" + (Y(u) + dy / d * 17) + "' x2='" + (X(v) - dx / d * 19) + "' y2='" + (Y(v) - dy / d * 19) +
                 "' stroke='" + (viva ? "#1f5fa8" : "#6b7280") + "' stroke-width='" + (viva ? 3 : 1.6) + "' marker-end='url(#" + (viva ? "flechaAzul" : "flecha") + ")'/>";
          i = i + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='15' fill='#ffffff' stroke='#d8dee6' stroke-width='2'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='13' font-weight='700' fill='#24292f'>" + (u + 1) + "</text>";
        u = u + 1;
      }
      svg += "<text x='" + (ancho - 8) + "' y='" + (alto - 8) + "' text-anchor='end' font-size='11' fill='#6b7280'>los números son las tareas, desde 1</text>";
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(a ? a.G : [], a ? a.arista : null);
      var texto = "–";
      if (a && a.G) {
        var partes = [], u = 0;
        while (u < a.G.length) { partes.push("[" + a.G[u].join(", ") + "]"); u = u + 1; }
        texto = "[" + partes.join(", ") + "]";
      }
      document.getElementById("ver-g").textContent = texto;
      document.getElementById("ver-par").textContent = a && a.par ? a.par[0] + " " + a.par[1] + "  →  arista (" + a.arista[0] + ", " + a.arista[1] + ")" : "–";
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "u", rotulo: "u" }, { campo: "k", rotulo: "k" }, { campo: "p", rotulo: "p" }],
      paramsIniciales: { n: n, m: m, datos: datos, p0: 2 }, alPintar: alPintar
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id); v.className = ok ? "veredicto bien" : "veredicto mal"; v.innerHTML = texto;
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-lista button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          veredicto("veredicto-lista", true, "Correcto. La pareja <code>1 4</code> deja la arista (0, 3): el <code>- 1</code> pasa las tareas, numeradas desde 1, a los índices de la lista, numerados desde 0. Las listas quedan en el orden en que las parejas aparecen en la entrada, sin ordenar. Ejecute el paso a paso y vea las seis parejas entrar.");
        } else if (op === "reves") {
          veredicto("veredicto-lista", false, "Esa es la lista con las flechas al revés. <i>La tarea i debe ejecutarse antes que la j</i> es la arista (i, j), de i hacia j: i es la cola.");
        } else if (op === "uno") {
          veredicto("veredicto-lista", false, "Esa es la lista sin el <code>- 1</code>, corrida una posición: la pareja <code>1 4</code> deja el 4 en <code>G[1]</code> en vez del 3 en <code>G[0]</code>, y la tarea 6 pediría <code>G[6]</code>, que con n = 6 no existe.");
        } else {
          veredicto("veredicto-lista", false, "Esa es la lista de un grafo no dirigido, con cada pareja puesta en las dos direcciones. Una precedencia va en un solo sentido.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-salida button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          veredicto("veredicto-salida", true, "Correcto: <code>" + EJERCICIO.linea(G) + "</code>. Las fuentes son las tareas 5 y 6, las únicas que no esperan a nadie, y salen en ese orden porque la cola las recibió así. Dentro de <code>G[0]</code> las aristas quedan en el orden de la entrada, 4 antes que 3, y por eso la tarea 4 sale antes que la 3. El juez acepta cualquier orden válido.");
        } else if (op === "reves") {
          veredicto("veredicto-salida", false, "Esa sale de poner las flechas al revés. Compruebe con la pareja <code>6 1</code>: en esa respuesta la tarea 1 sale antes que la 6, y el enunciado pide lo contrario.");
        } else {
          veredicto("veredicto-salida", false, "Esos son los índices de la lista, desde 0. El enunciado numera las tareas desde 1, así que al imprimir hay que devolver el <code>+ 1</code> que el <code>- 1</code> de la lectura quitó.");
        }
      });
    });

    dibujar([], null);
  })();
}
