/* Ejercicio interactivo: el algoritmo de Kahn paso a paso (clase 8).
   La simulacion reproduce la funcion kahn de la clase, linea por linea. */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def kahn(G):",                          num: null },
    { txt: "    n = len(G)",                         num: 1 },
    { txt: "    entrada = grados_de_entrada(G)",     num: 2 },
    { txt: "    cola = deque()",                     num: 3 },
    { txt: "    u = 0",                              num: 4 },
    { txt: "    while u < n:",                       num: 5,  bloque: 1 },
    { txt: "        if entrada[u] == 0:",            num: 6,  bloque: 1 },
    { txt: "            cola.append(u)",             num: 7,  bloque: 1 },
    { txt: "        u = u + 1",                      num: 8,  bloque: 1 },
    { txt: "    orden = []",                         num: 9 },
    { txt: "    while len(cola) > 0:",               num: 10, bloque: 2 },
    { txt: "        u = cola.popleft()",             num: 11, bloque: 2 },
    { txt: "        orden.append(u)",                num: 12, bloque: 2 },
    { txt: "        for v in G[u]:",                 num: 13, bloque: 2 },
    { txt: "            entrada[v] = entrada[v] - 1", num: 14, bloque: 2 },
    { txt: "            if entrada[v] == 0:",        num: 15, bloque: 2 },
    { txt: "                cola.append(v)",         num: 16, bloque: 2 },
    { txt: "    return orden",                       num: 17 }
  ];

  function gradosDeEntrada(G) {
    var n = G.length, entrada = [], u = 0, i;
    while (u < n) { entrada.push(0); u = u + 1; }
    u = 0;
    while (u < n) {
      i = 0;
      while (i < G[u].length) { entrada[G[u][i]] = entrada[G[u][i]] + 1; i = i + 1; }
      u = u + 1;
    }
    return entrada;
  }

  function simular(params) {
    var G = params.G;
    var n = G.length;
    var pasos = [];
    var entrada = null, cola = null, orden = null, u = null, v = null;
    var estado = [];
    var t = 0;
    while (t < n) { estado.push("libre"); t = t + 1; }
    function snap(linea, extra) {
      var q = { linea: linea, u: u === null ? "–" : u, v: v === null ? "–" : v,
                entrada: entrada === null ? null : entrada.slice(),
                cola: cola === null ? [] : cola.slice(),
                orden: orden === null ? [] : orden.slice(),
                estado: estado.slice() };
      if (extra) { for (var x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }
    snap(1);
    entrada = gradosDeEntrada(G); snap(2);
    cola = []; snap(3);
    var uu = 0; u = 0; snap(4);
    var sigue = true;
    while (sigue) {
      snap(5);
      if (uu < n) {
        u = uu; snap(6);
        if (entrada[uu] === 0) {
          cola.push(uu); estado[uu] = "cola"; snap(7, { entra: uu, inicial: true });
        }
        uu = uu + 1; u = uu; snap(8);
      } else { sigue = false; }
    }
    u = null;
    orden = []; snap(9);
    var paso = 0;
    sigue = true;
    while (sigue) {
      snap(10);
      if (cola.length > 0) {
        var w = cola.shift(); u = w; estado[w] = "actual"; paso = paso + 1;
        snap(11, { sale: w, paso: paso });
        orden.push(w); snap(12);
        var bajan = [];
        var i = 0;
        while (i < G[w].length) {
          v = G[w][i];
          snap(13, { mira: v });
          entrada[v] = entrada[v] - 1;
          bajan.push(v + ": " + (entrada[v] + 1) + " → " + entrada[v]);
          snap(14, { resta: v });
          snap(15);
          if (entrada[v] === 0) {
            cola.push(v); estado[v] = "cola";
            bajan[bajan.length - 1] = bajan[bajan.length - 1] + ", entra";
            snap(16, { entra: v });
          }
          i = i + 1;
        }
        v = null;
        estado[w] = "salio";
        snap(10, { cierra: w, paso: paso, bajan: bajan, colaDespues: cola.slice() });
      } else { sigue = false; }
    }
    u = null;
    snap(17, { fin: true });
    return pasos;
  }

  function kahnRef(G) {
    var entrada = gradosDeEntrada(G), cola = [], orden = [], u = 0, i;
    while (u < G.length) { if (entrada[u] === 0) { cola.push(u); } u = u + 1; }
    while (cola.length > 0) {
      u = cola.shift(); orden.push(u); i = 0;
      while (i < G[u].length) { entrada[G[u][i]] = entrada[G[u][i]] - 1; if (entrada[G[u][i]] === 0) { cola.push(G[u][i]); } i = i + 1; }
    }
    return orden;
  }

  function fuentes(G) {
    var entrada = gradosDeEntrada(G), res = [], u = 0;
    while (u < G.length) { if (entrada[u] === 0) { res.push(u); } u = u + 1; }
    return res;
  }

  return { codigo: CODIGO, simular: simular, kahnRef: kahnRef, fuentes: fuentes, gradosDeEntrada: gradosDeEntrada };
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
    var PRESETS = [
      { G: grafo(6, [[3, 0], [3, 1], [0, 2], [1, 2], [2, 4], [2, 5], [4, 5]]),
        pos: [[1.4, 2.4], [1.4, 0.6], [2.8, 1.5], [0, 1.5], [4.2, 2.4], [4.2, 0.6]] },
      { G: grafo(8, [[0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 6], [5, 6], [7, 5]]),
        pos: [[0, 2.4], [0, 1.2], [1.4, 2.4], [1.4, 1.2], [2.8, 1.8], [2.8, 0.4], [4.2, 1.1], [1.4, 0]] },
      { G: grafo(7, [[1, 0], [2, 0], [0, 3], [4, 3], [5, 4]]),
        pos: [[1.4, 1.8], [0, 2.4], [0, 1.2], [2.8, 1.2], [1.4, 0.4], [0, 0], [4.2, 2.4]] }
    ];
    var presetActual = 0;
    var COLOR = { libre: "#ffffff", cola: "#fdf1dc", actual: "#e3edf8", salio: "#e7f2e8" };
    var BORDE = { libre: "#d8dee6", cola: "#e8a13d", actual: "#1f5fa8", salio: "#2e7d32" };

    function paramsActuales() { return { G: PRESETS[presetActual].G, pos: PRESETS[presetActual].pos }; }

    function dibujar(params, entrada, estado, actual) {
      var G = params.G, pos = params.pos, n = G.length;
      var ancho = 460, alto = 250;
      function X(i) { return 40 + (pos[i][0] / 4.2) * (ancho - 80); }
      function Y(i) { return 30 + ((2.4 - pos[i][1]) / 2.4) * (alto - 60); }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:480px'>";
      svg += "<defs><marker id='flecha' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker></defs>";
      var u = 0, i;
      while (u < n) {
        i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          var dx = X(v) - X(u), dy = Y(v) - Y(u), d = Math.sqrt(dx * dx + dy * dy);
          var x1 = X(u) + dx / d * 17, y1 = Y(u) + dy / d * 17, x2 = X(v) - dx / d * 19, y2 = Y(v) - dy / d * 19;
          svg += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 + "' stroke='#6b7280' stroke-width='1.6' marker-end='url(#flecha)'/>";
          i = i + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        var est = estado ? estado[u] : "libre";
        var esActual = actual !== null && actual === u;
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='15' fill='" + COLOR[est] + "' stroke='" + (esActual ? "#24292f" : BORDE[est]) + "' stroke-width='" + (esActual ? 3.5 : 2) + "'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + u + "</text>";
        if (entrada) {
          svg += "<circle cx='" + (X(u) + 14) + "' cy='" + (Y(u) - 14) + "' r='9' fill='" + (entrada[u] === 0 ? "#2e7d32" : "#b3261e") + "'/>";
          svg += "<text x='" + (X(u) + 14) + "' y='" + (Y(u) - 10.5) + "' text-anchor='middle' font-size='10' font-weight='700' fill='#fff'>" + entrada[u] + "</text>";
        }
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(e.params, a ? a.entrada : null, a ? a.estado : null, a && a.u !== "–" && a.linea >= 10 ? a.u : null);
      document.getElementById("ver-cola").textContent = a && a.cola.length > 0 ? a.cola.join(", ") : "vacía";
      document.getElementById("ver-orden").textContent = a && a.orden.length > 0 ? "[" + a.orden.join(", ") + "]" : "[ ]";
      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var filas = 0, m;
      for (m = 0; m < e.k; m = m + 1) {
        var q = e.pasos[m];
        if (q.cierra !== undefined) {
          filas = filas + 1;
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + q.paso + "</td><td>" + q.cierra + "</td><td>" + (q.bajan.length > 0 ? q.bajan.join("; ") : "ninguno") + "</td><td>" + (q.colaDespues.length > 0 ? q.colaDespues.join(", ") : "vacía") + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (filas === 0) { cuerpo.innerHTML = "<tr><td colspan='4' class='pend'>Ejecute: cada vértice que sale de la cola agrega una fila.</td></tr>"; }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }],
      paramsIniciales: paramsActuales(), alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var f = EJERCICIO.fuentes(params.G);
      var n = params.G.length;
      if (valor === f.length) {
        return { ok: true, msg: "Correcto: " + f.length + " fuentes, " + (f.length === 1 ? "el vértice " : "los vértices ") + f.join(", ") + ". Son los que tienen contador 0 antes de restar nada. Ejecute y mire cuántas veces entra la línea 7 en el primer ciclo." };
      }
      if (valor === n) { return { ok: false, msg: "Ese es el número de vértices. A la cola entran al arrancar solo los que no tienen ninguna flecha llegando." }; }
      if (valor === 0) { return { ok: false, msg: "Un grafo sin ciclos siempre tiene al menos una fuente. Busque en el dibujo un vértice al que no llegue ninguna flecha." }; }
      return { ok: false, msg: "No coincide. Cuente los vértices a los que no llega ninguna flecha: esos, y solo esos, tienen contador 0 al arrancar." };
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        Motor.limpiarVeredicto();
        Motor.reiniciar(paramsActuales());
      });
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id); v.className = ok ? "veredicto bien" : "veredicto mal"; v.innerHTML = texto;
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-entra button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          veredicto("veredicto-entra", true, "Correcto: la línea 16 se ejecuta solo cuando la resta de la línea 14 deja el contador en 0, y eso pasa una vez por vértice. El 2 del primer grafo recibe dos restas, una por el 0 y otra por el 1, y entra en la segunda.");
        } else if (op === "primera") {
          veredicto("veredicto-entra", false, "Con la primera resta el contador baja, pero si era 2 queda en 1: todavía le falta un predecesor. Mire el vértice 2 del primer grafo cuando sale el 0.");
        } else {
          veredicto("veredicto-entra", false, "Los vecinos de salida no importan para entrar a la cola; lo que cuenta son las flechas que llegan. Un vértice sin vecinos de salida puede entrar de primero, como una fuente sin aristas.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-orden button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          veredicto("veredicto-orden", true, "Correcto: cada vértice sale después de que su contador llegó a 0, y el contador bajó una vez por cada predecesor que ya salió. En la tabla, ningún vértice sale antes que los que le apuntan.");
        } else if (op === "numero") {
          veredicto("veredicto-orden", false, "El número no ordena: en el segundo grafo el 7 sale antes que el 2. La cola saca las fuentes en el orden en que aparecieron, y aparecen cuando su contador llega a 0.");
        } else {
          veredicto("veredicto-orden", false, "No es por distancia a las fuentes: en el segundo grafo el 7 es fuente y sale de tercero. Es el contador: sale quien ya no tiene predecesores pendientes, en el orden en que llegó a la cola.");
        }
      });
    });
  })();
}
