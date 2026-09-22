/* Ejercicio interactivo: Kahn cuando el grafo tiene ciclos (clase 8).
   El mismo kahn de la clase; lo que cambia es que la cola se vacia antes
   de tiempo, y len(orden) < n es la senal. */
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
    { txt: "    return orden",                       num: 17 },
    { txt: "",                                       num: null },
    { txt: "def tiene_ciclo(G):",                    num: null },
    { txt: "    return len(kahn(G)) < len(G)",       num: 18 }
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
        if (entrada[uu] === 0) { cola.push(uu); estado[uu] = "cola"; snap(7, { entra: uu }); }
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
    var fuera = [];
    t = 0;
    while (t < n) { if (estado[t] !== "salio") { fuera.push(t); estado[t] = "fuera"; } t = t + 1; }
    snap(17, { fin: true, fuera: fuera });
    snap(18, { fin: true, fuera: fuera, ciclo: fuera.length > 0 });
    return pasos;
  }

  function emitidos(G) {
    var entrada = gradosDeEntrada(G), cola = [], orden = [], u = 0, i;
    while (u < G.length) { if (entrada[u] === 0) { cola.push(u); } u = u + 1; }
    while (cola.length > 0) {
      u = cola.shift(); orden.push(u); i = 0;
      while (i < G[u].length) { entrada[G[u][i]] = entrada[G[u][i]] - 1; if (entrada[G[u][i]] === 0) { cola.push(G[u][i]); } i = i + 1; }
    }
    return orden;
  }

  /* Los vertices que estan en algun ciclo: se alcanzan a si mismos */
  function enCiclo(G) {
    var n = G.length, res = [], s = 0;
    while (s < n) {
      var visitado = [], pila = [s], hay = false, t = 0;
      while (t < n) { visitado.push(false); t = t + 1; }
      while (pila.length > 0 && !hay) {
        var u = pila.pop(); var i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          if (v === s) { hay = true; } else if (!visitado[v]) { visitado[v] = true; pila.push(v); }
          i = i + 1;
        }
      }
      if (hay) { res.push(s); }
      s = s + 1;
    }
    return res;
  }

  return { codigo: CODIGO, simular: simular, emitidos: emitidos, enCiclo: enCiclo, gradosDeEntrada: gradosDeEntrada };
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
      { G: grafo(6, [[0, 1], [1, 2], [2, 3], [3, 1], [3, 4], [5, 0]]),
        pos: [[1.4, 1.2], [2.8, 1.2], [3.5, 2.4], [4.2, 1.2], [4.2, 0], [0, 1.2]] },
      { G: grafo(7, [[0, 1], [1, 0], [2, 3], [3, 4], [4, 2], [5, 6], [4, 6]]),
        pos: [[0, 2.4], [1.4, 2.4], [0, 0.8], [1.4, 0], [1.4, 1.4], [4.2, 2.4], [3.2, 1.2]] },
      { G: grafo(5, [[0, 1], [1, 2], [0, 3], [3, 2], [2, 4]]),
        pos: [[0, 1.2], [1.4, 2.4], [2.8, 1.2], [1.4, 0], [4.2, 1.2]] }
    ];
    var presetActual = 0;
    var COLOR = { libre: "#ffffff", cola: "#fdf1dc", actual: "#e3edf8", salio: "#e7f2e8", fuera: "#fbe9e7" };
    var BORDE = { libre: "#d8dee6", cola: "#e8a13d", actual: "#1f5fa8", salio: "#2e7d32", fuera: "#b3261e" };

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
          var antiparalela = G[v].indexOf(u) >= 0;
          var ox = antiparalela ? -dy / d * 6 : 0, oy = antiparalela ? dx / d * 6 : 0;
          var x1 = X(u) + dx / d * 17 + ox, y1 = Y(u) + dy / d * 17 + oy, x2 = X(v) - dx / d * 19 + ox, y2 = Y(v) - dy / d * 19 + oy;
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
      document.getElementById("ver-orden").textContent = a && a.orden.length > 0 ? "[" + a.orden.join(", ") + "] (" + a.orden.length + " de " + e.params.G.length + ")" : "[ ]";
      var caja = document.getElementById("ver-fuera");
      if (a && a.fin) {
        caja.innerHTML = a.fuera.length > 0
          ? "Quedaron por fuera: <b>" + a.fuera.join(", ") + "</b>. tiene_ciclo devuelve <b>True</b>."
          : "Salieron los " + e.params.G.length + ". tiene_ciclo devuelve <b>False</b>.";
      } else {
        caja.textContent = "";
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }],
      paramsIniciales: paramsActuales(), alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var em = EJERCICIO.emitidos(params.G);
      var n = params.G.length;
      var ciclo = EJERCICIO.enCiclo(params.G);
      if (valor === em.length) {
        if (em.length === n) {
          return { ok: true, msg: "Correcto: salen los " + n + ". Este grafo no tiene ciclos y la cola no se vacía hasta el final." };
        }
        return { ok: true, msg: "Correcto: salen " + em.length + " (" + em.join(", ") + ") y la cola se vacía con " + (n - em.length) + " vértices sin salir. Ejecute y mire qué contadores nunca llegan a 0." };
      }
      if (valor === n) { return { ok: false, msg: "Saldrían los " + n + " solo sin ciclos. Aquí los vértices " + ciclo.join(", ") + " están en algún ciclo, y ninguno de ellos puede llegar a contador 0: su predecesor en el ciclo nunca sale." }; }
      if (valor === n - ciclo.length) { return { ok: false, msg: "Los del ciclo no salen, pero tampoco sale nadie que dependa de ellos: un vértice al que le llega una flecha desde el ciclo se queda con contador al menos 1 para siempre." }; }
      return { ok: false, msg: "No coincide. Arranque por las fuentes y siga restando; en algún momento no queda ningún contador en 0 y la cola se vacía. Cuente los que alcanzaron a salir." };
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

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-fuera button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          veredicto("veredicto-fuera", true, "Correcto: en el primer grafo el 4 no está en el ciclo, pero le llega una flecha desde el 3, que sí está; su contador nunca baja de 1. Por fuera quedan los del ciclo y todo lo que tenga un camino desde un ciclo.");
        } else if (op === "solo") {
          veredicto("veredicto-fuera", false, "Ejecute el primer grafo: el 4 se queda por fuera y no está en el ciclo 1 → 2 → 3 → 1. Lo que lo deja afuera es la flecha 3 → 4.");
        } else {
          veredicto("veredicto-fuera", false, "El contador inicial no decide: el 2 del primer grafo arranca en 1 y aun así se queda. Lo que importa es si alguno de sus predecesores nunca sale.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-senal button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          veredicto("veredicto-senal", true, "Correcto: sin ciclos siempre queda una fuente entre los que faltan, así que la cola no se vacía hasta emitir los n. Con un ciclo, ninguno de sus vértices sale. Las dos direcciones juntas hacen que la comparación sea la prueba.");
        } else if (op === "cola") {
          veredicto("veredicto-senal", false, "Que la cola se vacíe es lo normal: también se vacía al terminar bien. La señal es que se vacíe con vértices sin salir, y eso es lo que mide len(orden) < n.");
        } else {
          veredicto("veredicto-senal", false, "Un contador que arranca en 2 o más es corriente en grafos sin ciclos: el 4 del ejercicio anterior tenía 2 y salió. No es señal de nada.");
        }
      });
    });
  })();
}
