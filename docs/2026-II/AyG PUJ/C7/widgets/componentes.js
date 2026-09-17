/* Ejercicio interactivo: contar componentes conexos y su tamano (clase 7). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def componentes(G):",                num: null },
    { txt: "    n = len(G)",                     num: 1 },
    { txt: "    visitado = [False] * n",         num: 2 },
    { txt: "    tamanos = []",                   num: 3 },
    { txt: "    u = 0",                          num: 4 },
    { txt: "    while u < n:",                   num: 5,  bloque: 1 },
    { txt: "        if not visitado[u]:",        num: 6,  bloque: 1 },
    { txt: "            tamanos.append(tamano_desde(G, u, visitado))", num: 7, bloque: 1 },
    { txt: "        u = u + 1",                  num: 8,  bloque: 1 },
    { txt: "    return tamanos",                 num: 9 },
    { txt: "",                                   num: null },
    { txt: "def tamano_desde(G, s, visitado):",  num: null },
    { txt: "    cuenta = 0",                     num: 10, bloque: 2 },
    { txt: "    visitado[s] = True",             num: 11, bloque: 2 },
    { txt: "    pila = [s]",                     num: 12, bloque: 2 },
    { txt: "    while len(pila) > 0:",           num: 13, bloque: 2 },
    { txt: "        u = pila.pop()",             num: 14, bloque: 2 },
    { txt: "        cuenta = cuenta + 1",        num: 15, bloque: 2 },
    { txt: "        for v in G[u]:",             num: 16, bloque: 2 },
    { txt: "            if not visitado[v]:",    num: 17, bloque: 2 },
    { txt: "                visitado[v] = True", num: 18, bloque: 2 },
    { txt: "                pila.append(v)",     num: 19, bloque: 2 },
    { txt: "    return cuenta",                  num: 20, bloque: 2 }
  ];

  function simular(params) {
    var G = params.G;
    var n = G.length;
    var pasos = [];
    var visitado = null, tamanos = null, u = null, comp = null, cuenta = null, pila = null;
    var color = [];
    var t = 0;
    while (t < n) { color.push(-1); t = t + 1; }
    function snap(linea, extra) {
      var q = { linea: linea, u: u === null ? "–" : u, cuenta: cuenta === null ? "–" : cuenta,
                comp: comp === null ? "–" : comp, color: color.slice(),
                tamanos: tamanos === null ? [] : tamanos.slice(),
                pila: pila === null ? [] : pila.slice() };
      if (extra) { for (var x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }
    snap(1);
    visitado = []; t = 0; while (t < n) { visitado.push(false); t = t + 1; }
    snap(2);
    tamanos = []; snap(3);
    var uu = 0; u = 0; snap(4);
    var sigue = true;
    while (sigue) {
      snap(5, { chequeoExterno: true });
      if (uu < n) {
        u = uu; snap(6);
        if (!visitado[uu]) {
          comp = tamanos.length;
          cuenta = 0; snap(10, { arranca: uu });
          visitado[uu] = true; color[uu] = comp; snap(11);
          pila = [uu]; snap(12);
          var dentro = true;
          while (dentro) {
            snap(13);
            if (pila.length > 0) {
              var w = pila.pop(); u = w; snap(14, { sale: w });
              cuenta = cuenta + 1; snap(15);
              var i = 0;
              while (i < G[w].length) {
                var v = G[w][i];
                snap(16); snap(17, { mira: v });
                if (!visitado[v]) {
                  visitado[v] = true; color[v] = comp; snap(18);
                  pila.push(v); snap(19);
                }
                i = i + 1;
              }
            } else { dentro = false; }
          }
          snap(20, { cierra: comp, tamano: cuenta });
          tamanos.push(cuenta); u = uu; snap(7);
          cuenta = null; pila = null;
        }
        uu = uu + 1; u = uu; snap(8);
      } else { sigue = false; }
    }
    u = null;
    snap(9, { fin: true });
    return pasos;
  }

  function tamanosRef(G) {
    var n = G.length, visitado = [], res = [];
    var t = 0; while (t < n) { visitado.push(false); t = t + 1; }
    var u = 0;
    while (u < n) {
      if (!visitado[u]) {
        var cuenta = 0, pila = [u]; visitado[u] = true;
        while (pila.length > 0) {
          var w = pila.pop(); cuenta = cuenta + 1;
          var i = 0;
          while (i < G[w].length) { if (!visitado[G[w][i]]) { visitado[G[w][i]] = true; pila.push(G[w][i]); } i = i + 1; }
        }
        res.push(cuenta);
      }
      u = u + 1;
    }
    return res;
  }

  return { codigo: CODIGO, simular: simular, tamanosRef: tamanosRef };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function grafo(n, aristas) {
      var G = []; var i = 0; while (i < n) { G.push([]); i = i + 1; }
      i = 0;
      while (i < aristas.length) { G[aristas[i][0]].push(aristas[i][1]); G[aristas[i][1]].push(aristas[i][0]); i = i + 1; }
      i = 0; while (i < n) { G[i].sort(function (a, b) { return a - b; }); i = i + 1; }
      return G;
    }
    var PRESETS = [
      { G: grafo(9, [[0, 1], [1, 2], [3, 4], [5, 6], [6, 7], [7, 5]]), nombre: "nueve, cuatro grupos" },
      { G: grafo(8, [[0, 3], [3, 6], [6, 1], [1, 4], [4, 7], [7, 2], [2, 5]]), nombre: "ocho en fila" },
      { G: grafo(6, []), nombre: "seis sueltos" }
    ];
    var POS = [[0, 2], [1, 2.6], [2, 2], [3.2, 2.6], [4.2, 2.6], [0.4, 0.4], [1.6, 0.9], [2.8, 0.4], [4.2, 0.9]];
    var COLORES = ["#1f5fa8", "#e8a13d", "#2e7d32", "#b3261e", "#6d28d9", "#0e7490", "#9d174d", "#4d7c0f", "#7c2d12"];
    var externoOK = false;

    function dibujar(params, color, actual) {
      var G = params.G, n = G.length;
      var ancho = 400, alto = 230;
      function X(i) { return 40 + (POS[i][0] / 4.2) * (ancho - 80); }
      function Y(i) { return 30 + ((2.6 - POS[i][1]) / 2.6) * (alto - 60); }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:420px'>";
      var u = 0;
      while (u < n) {
        var i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          if (u < v) { svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) + "' stroke='#6b7280' stroke-width='1.6'/>"; }
          i = i + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        var c = color !== null && color[u] >= 0 ? COLORES[color[u] % COLORES.length] : "#ffffff";
        var esActual = actual !== null && actual === u;
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='15' fill='" + c + "' stroke='" + (esActual ? "#24292f" : (c === "#ffffff" ? "#d8dee6" : c)) + "' stroke-width='" + (esActual ? 4 : 2) + "'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='" + (c === "#ffffff" ? "#24292f" : "#ffffff") + "'>" + u + "</text>";
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(e.params, a ? a.color : null, a && a.u !== "–" ? a.u : null);
      document.getElementById("ver-pila").textContent = a && a.pila.length > 0 ? a.pila.join(", ") : "vacía";
      document.getElementById("ver-tamanos").textContent = a && a.tamanos.length > 0 ? "[" + a.tamanos.join(", ") + "]" : "[ ]";
      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var fila = 0, m;
      for (m = 0; m < e.k; m = m + 1) {
        var q = e.pasos[m];
        if (q.cierra !== undefined) {
          fila = fila + 1;
          var miembros = [];
          var t = 0;
          while (t < q.color.length) { if (q.color[t] === q.cierra) { miembros.push(t); } t = t + 1; }
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + (q.cierra + 1) + "</td><td>" + miembros[0] + "</td><td>{" + miembros.join(", ") + "}</td><td>" + q.tamano + "</td>";
          tr.style.borderLeft = "6px solid " + COLORES[q.cierra % COLORES.length];
          cuerpo.appendChild(tr);
        }
      }
      if (fila === 0) { cuerpo.innerHTML = "<tr><td colspan='4' class='pend'>Ejecute: cada componente que se cierra agrega una fila.</td></tr>"; }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "u", rotulo: "u" }, { campo: "comp", rotulo: "componente" }, { campo: "cuenta", rotulo: "cuenta", clase: "cuenta" }],
      paramsIniciales: PRESETS[0], alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var tam = EJERCICIO.tamanosRef(params.G);
      var n = params.G.length;
      var aristas = 0; var u = 0; while (u < n) { aristas = aristas + params.G[u].length; u = u + 1; } aristas = aristas / 2;
      if (valor === tam.length) {
        return { ok: true, msg: "Correcto: " + tam.length + " componentes, de tamaños [" + tam.join(", ") + "]. Ejecute y mire cuántas veces entra la línea 7." };
      }
      if (valor === n) { return { ok: false, msg: "Ese es el número de vértices. Serían " + n + " componentes solo si no hubiera ninguna arista." }; }
      if (valor === aristas) { return { ok: false, msg: "Ese es el número de aristas. Los componentes se cuentan por grupos de vértices que se alcanzan entre sí." }; }
      return { ok: false, msg: "No coincide. Agrupe en el dibujo los vértices que se alcanzan entre sí y cuente los grupos; un vértice suelto es un grupo." };
    });

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        Motor.limpiarVeredicto();
        Motor.reiniciar(PRESETS[parseInt(btn.getAttribute("data-preset"), 10)]);
      });
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id); v.className = ok ? "veredicto bien" : "veredicto mal"; v.innerHTML = texto;
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-externo button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          externoOK = true;
          veredicto("veredicto-externo", true, "Correcto: cada vez que el ciclo externo encuentra un vértice sin marcar es porque nada de lo recorrido antes lo alcanzaba, y eso es exactamente un componente nuevo.");
          document.getElementById("paso-1").classList.remove("bloqueado");
        } else if (op === "vertices") {
          veredicto("veredicto-externo", false, "La línea 8 pasa por los n vértices, pero la 7 solo entra cuando el vértice está sin marcar. Ejecute y compare cuántas veces se ejecuta cada una.");
        } else {
          veredicto("veredicto-externo", false, "El recorrido interno no cuenta componentes: cuenta vértices dentro de uno. Lo que separa los componentes es el if de la línea 6.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p1");
        if (op === "lineal") {
          veredicto("veredicto-p1", true, "Correcto: es un recorrido completo, Θ(n + m). Que se cuenten los componentes de paso no agrega nada al orden.");
          document.getElementById("paso-1").classList.add("hecho");
        } else if (op === "cuadratico") {
          veredicto("veredicto-p1", false, "Cada vértice entra a la pila una sola vez y cada lista de vecinos se recorre una sola vez. Los k recorridos internos, sumados, tocan cada vértice y cada arista una vez: no se multiplican.");
        } else {
          veredicto("veredicto-p1", false, "Depende de n y de m, no solo de k. Un grafo con un solo componente y m aristas cuesta Θ(n + m) igual.");
        }
      });
    });
  })();
}
