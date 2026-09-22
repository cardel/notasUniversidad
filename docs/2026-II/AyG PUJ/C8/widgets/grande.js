/* Ejercicio interactivo: el algoritmo de Kahn sobre un grafo grande
   (clase 8). Catorce modulos de un proyecto y sus dependencias; la misma
   funcion kahn de la clase, sin cambiar una linea. */
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

  var NOMBRES = ["base", "utiles", "log", "config", "red", "datos", "modelo",
                 "api", "cache", "ui", "informes", "auth", "pagos", "app"];
  var ARISTAS = [[0, 1], [0, 3], [2, 3], [2, 4], [1, 4], [3, 5], [4, 5], [3, 11],
                 [5, 6], [5, 8], [6, 7], [8, 7], [11, 7], [7, 9], [6, 10],
                 [11, 12], [12, 13], [9, 13], [10, 13]];
  var EXTRA = [13, 3];

  function grafo(conCiclo) {
    var G = [], i = 0;
    while (i < NOMBRES.length) { G.push([]); i = i + 1; }
    i = 0;
    while (i < ARISTAS.length) { G[ARISTAS[i][0]].push(ARISTAS[i][1]); i = i + 1; }
    if (conCiclo) { G[EXTRA[0]].push(EXTRA[1]); }
    return G;
  }

  function gradosDeEntrada(G) {
    var n = G.length, entrada = [], u = 0, i;
    while (u < n) { entrada.push(0); u = u + 1; }
    u = 0;
    while (u < n) { i = 0; while (i < G[u].length) { entrada[G[u][i]] = entrada[G[u][i]] + 1; i = i + 1; } u = u + 1; }
    return entrada;
  }

  function simular(params) {
    var G = params.G, n = G.length;
    var pasos = [];
    var entrada = null, cola = null, orden = null, u = null, v = null;
    var estado = [], t = 0;
    while (t < n) { estado.push("libre"); t = t + 1; }
    function snap(linea, extra) {
      var q = { linea: linea, u: u === null ? "–" : u, v: v === null ? "–" : v,
                entrada: entrada === null ? null : entrada.slice(),
                cola: cola === null ? [] : cola.slice(),
                orden: orden === null ? [] : orden.slice(), estado: estado.slice() };
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
          snap(13, { mira: [w, v] });
          entrada[v] = entrada[v] - 1;
          bajan.push(NOMBRES[v] + ": " + (entrada[v] + 1) + " → " + entrada[v]);
          snap(14, { mira: [w, v] });
          snap(15, { mira: [w, v] });
          if (entrada[v] === 0) {
            cola.push(v); estado[v] = "cola";
            bajan[bajan.length - 1] = bajan[bajan.length - 1] + ", entra";
            snap(16, { mira: [w, v], entra: v });
          }
          i = i + 1;
        }
        v = null; estado[w] = "salio";
        snap(10, { cierra: w, paso: paso, bajan: bajan, colaDespues: cola.slice() });
      } else { sigue = false; }
    }
    u = null;
    var fuera = [];
    t = 0;
    while (t < n) { if (estado[t] !== "salio") { fuera.push(t); estado[t] = "fuera"; } t = t + 1; }
    snap(17, { fin: true, fuera: fuera });
    return pasos;
  }

  function orden(G) {
    var pasos = simular({ G: G });
    return pasos[pasos.length - 1].orden;
  }

  function fuentes(G) {
    var entrada = gradosDeEntrada(G), res = [], u = 0;
    while (u < G.length) { if (entrada[u] === 0) { res.push(u); } u = u + 1; }
    return res;
  }

  /* Camino concreto de s a t, o null. Sirve para explicar por que el orden
     relativo de dos modulos esta fijo. */
  function camino(G, s, t) {
    var visto = [], pila = [[s, [s]]], i = 0, res = null;
    while (i < G.length) { visto.push(false); i = i + 1; }
    visto[s] = true;
    while (pila.length > 0 && res === null) {
      var par = pila.pop(), u = par[0], ruta = par[1];
      if (u === t) { res = ruta; }
      else {
        i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          if (!visto[v]) { visto[v] = true; pila.push([v, ruta.concat([v])]); }
          i = i + 1;
        }
      }
    }
    return res;
  }

  return { codigo: CODIGO, NOMBRES: NOMBRES, ARISTAS: ARISTAS, EXTRA: EXTRA, grafo: grafo,
           gradosDeEntrada: gradosDeEntrada, simular: simular, orden: orden,
           fuentes: fuentes, camino: camino };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var NOMBRES = EJERCICIO.NOMBRES;
    var conCiclo = false;
    var G = EJERCICIO.grafo(false);
    /* Posiciones por nivel, calculadas sobre el grafo sin la flecha de mas. */
    var NIVEL = [0, 1, 0, 1, 2, 3, 4, 5, 4, 6, 5, 2, 3, 7];
    var FILA = [0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0];
    var COLOR = { libre: "#ffffff", cola: "#fdf1dc", actual: "#e3edf8", salio: "#e7f2e8", fuera: "#fbe9e7" };
    var BORDE = { libre: "#d8dee6", cola: "#e8a13d", actual: "#1f5fa8", salio: "#2e7d32", fuera: "#b3261e" };

    function paramsActuales() { return { G: G }; }

    function dibujar(entrada, estado, actual, mira) {
      var n = G.length, ancho = 900, alto = 300;
      function X(i) { return 55 + (NIVEL[i] / 7) * (ancho - 110); }
      function Y(i) { return FILA[i] === 0 ? 85 : 215; }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%'>";
      svg += "<defs><marker id='fg' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#9aa1ac'/></marker>";
      svg += "<marker id='fa' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#1f5fa8'/></marker></defs>";
      var u = 0, i;
      while (u < n) {
        i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          var viva = mira !== null && mira !== undefined && mira[0] === u && mira[1] === v;
          var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
          var dx = x2 - x1, dy = y2 - y1, d = Math.sqrt(dx * dx + dy * dy);
          var atras = x2 < x1;
          if (atras) {
            svg += "<path d='M " + x1 + " " + (y1 - 22) + " C " + ((x1 + x2) / 2) + " " + (y1 - 95) + ", " + ((x1 + x2) / 2) + " " + (y2 - 95) + ", " + x2 + " " + (y2 - 22) +
                   "' fill='none' stroke='" + (viva ? "#1f5fa8" : "#b3261e") + "' stroke-width='2.2' marker-end='url(#" + (viva ? "fa" : "fg") + ")'/>";
          } else {
            svg += "<line x1='" + (x1 + dx / d * 22) + "' y1='" + (y1 + dy / d * 22) + "' x2='" + (x2 - dx / d * 24) + "' y2='" + (y2 - dy / d * 24) +
                   "' stroke='" + (viva ? "#1f5fa8" : "#9aa1ac") + "' stroke-width='" + (viva ? 3 : 1.5) + "' marker-end='url(#" + (viva ? "fa" : "fg") + ")'/>";
          }
          i = i + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        var est = estado ? estado[u] : "libre";
        var esActual = actual !== null && actual !== undefined && actual === u;
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='21' fill='" + COLOR[est] + "' stroke='" + (esActual ? "#24292f" : BORDE[est]) + "' stroke-width='" + (esActual ? 4 : 2) + "'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 4) + "' text-anchor='middle' font-size='11' font-weight='700' fill='#24292f'>" + NOMBRES[u] + "</text>";
        if (entrada) {
          svg += "<circle cx='" + (X(u) + 18) + "' cy='" + (Y(u) - 18) + "' r='10' fill='" + (entrada[u] === 0 ? "#2e7d32" : "#b3261e") + "'/>";
          svg += "<text x='" + (X(u) + 18) + "' y='" + (Y(u) - 14) + "' text-anchor='middle' font-size='11' font-weight='700' fill='#fff'>" + entrada[u] + "</text>";
        }
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(a ? a.entrada : null, a ? a.estado : null, a && a.u !== "–" && a.linea >= 10 ? a.u : null, a ? a.mira : null);
      document.getElementById("ver-cola").textContent = a && a.cola.length > 0 ? a.cola.map(function (w) { return NOMBRES[w]; }).join(", ") : "vacía";
      document.getElementById("ver-orden").textContent = a && a.orden.length > 0
        ? a.orden.map(function (w) { return NOMBRES[w]; }).join(" · ") + "  (" + a.orden.length + " de " + G.length + ")" : "–";
      var caja = document.getElementById("ver-fuera");
      if (a && a.fin) {
        caja.innerHTML = a.fuera.length > 0
          ? "Quedaron por fuera " + a.fuera.length + ": <b>" + a.fuera.map(function (w) { return NOMBRES[w]; }).join(", ") + "</b>. Con <code>len(orden) &lt; n</code> el programa reporta el ciclo."
          : "Salieron los " + G.length + ": el proyecto se puede compilar.";
      } else { caja.textContent = ""; }
      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var filas = 0, m;
      for (m = 0; m < e.k; m = m + 1) {
        var q = e.pasos[m];
        if (q.cierra !== undefined) {
          filas = filas + 1;
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + q.paso + "</td><td><b>" + NOMBRES[q.cierra] + "</b></td><td>" + (q.bajan.length > 0 ? q.bajan.join("; ") : "ninguno") + "</td><td>" + (q.colaDespues.length > 0 ? q.colaDespues.map(function (w) { return NOMBRES[w]; }).join(", ") : "vacía") + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (filas === 0) { cuerpo.innerHTML = "<tr><td colspan='4' class='pend'>Ejecute: cada módulo que sale de la cola agrega una fila.</td></tr>"; }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }],
      paramsIniciales: paramsActuales(), alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var o = EJERCICIO.orden(params.G);
      var n = params.G.length;
      if (valor === o.length) {
        if (o.length === n) {
          return { ok: true, msg: "Correcto: salen los " + n + ". El proyecto no tiene dependencias circulares, así que hay un orden de compilación; de hecho hay 1710 órdenes distintos, y el algoritmo devuelve uno de ellos." };
        }
        return { ok: true, msg: "Correcto: solo " + o.length + " (" + o.map(function (w) { return EJERCICIO.NOMBRES[w]; }).join(", ") + "). La flecha de más cierra el ciclo config → datos → modelo → api → ui → app → config, y ningún módulo del ciclo llega a contador 0; tampoco los que dependen de ellos." };
      }
      if (valor === n) { return { ok: false, msg: "Saldrían los " + n + " solo si no hubiera ciclos. Siga la flecha roja de app hacia config y verá que config espera por algo que espera por config." }; }
      return { ok: false, msg: "No coincide. Arranque por los módulos con contador 0 y vaya restando; cuando ningún contador quede en 0, la cola se vacía. Cuente los que alcanzaron a salir." };
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id); v.className = ok ? "veredicto bien" : "veredicto mal"; v.innerHTML = texto;
    }

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        conCiclo = btn.getAttribute("data-ciclo") === "si";
        G = EJERCICIO.grafo(conCiclo);
        document.getElementById("nota-grafo").innerHTML = conCiclo
          ? "Con una dependencia de más: <b>app → config</b>, la flecha que se devuelve."
          : "Diecinueve dependencias. Una flecha de <b>a</b> a <b>b</b> quiere decir que <b>a</b> se compila antes que <b>b</b>.";
        Motor.limpiarVeredicto();
        Motor.reiniciar(paramsActuales());
      });
    });

    /* Parejas: cuales tienen su orden relativo fijado por el grafo. */
    var PAREJAS = [[11, 5], [5, 9], [6, 8], [1, 6], [12, 10]];
    var base = EJERCICIO.grafo(false);
    function armarParejas() {
      var caja = document.getElementById("parejas");
      caja.innerHTML = "";
      PAREJAS.forEach(function (par, k) {
        var fila = document.createElement("label");
        fila.className = "pareja";
        fila.innerHTML = "<input type='checkbox' data-k='" + k + "'> <b>" + NOMBRES[par[0]] + "</b> y <b>" + NOMBRES[par[1]] + "</b> <span class='res' id='res-" + k + "'></span>";
        caja.appendChild(fila);
      });
    }

    document.getElementById("btn-parejas").addEventListener("click", function () {
      var aciertos = 0;
      PAREJAS.forEach(function (par, k) {
        var marcada = document.querySelector("input[data-k='" + k + "']").checked;
        var ida = EJERCICIO.camino(base, par[0], par[1]);
        var vuelta = EJERCICIO.camino(base, par[1], par[0]);
        var libre = ida === null && vuelta === null;
        var ruta = ida || vuelta;
        var celda = document.getElementById("res-" + k);
        celda.innerHTML = (marcada === libre ? "✓ " : "✗ ") + (libre
          ? "sin camino entre ellos: pueden ir en cualquier orden"
          : "el camino " + ruta.map(function (w) { return NOMBRES[w]; }).join(" → ") + " fija el orden");
        celda.className = "res " + (marcada === libre ? "bien" : "mal");
        if (marcada === libre) { aciertos = aciertos + 1; }
      });
      veredicto("veredicto-parejas", aciertos === PAREJAS.length,
        aciertos === PAREJAS.length
          ? "Las cinco bien. El grafo solo fija el orden de las parejas unidas por un camino; entre las demás, cada orden topológico puede ponerlas como quiera, y por eso hay 1710."
          : aciertos + " de " + PAREJAS.length + ". Para cada pareja, busque un camino de flechas de una a la otra; si no lo hay en ninguna dirección, su orden relativo es libre.");
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-ultimo button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          veredicto("veredicto-ultimo", true, "Correcto: a <b>app</b> le llegan tres flechas y, siguiéndolas hacia atrás, todos los demás módulos tienen camino hasta él. Un vértice al que todo llega no puede salir antes que nadie, y como es el único sumidero, sale de último en cualquier orden.");
        } else if (op === "contador") {
          veredicto("veredicto-ultimo", false, "El contador más alto no decide la posición: <b>api</b> también arranca en 3 y sale en el puesto 12 de 14. Lo que fija a app al final es que todos los demás tienen camino hasta él.");
        } else {
          veredicto("veredicto-ultimo", false, "El número del vértice no interviene en el algoritmo, solo en qué fuente entra primero a la cola. Renumere los módulos y app seguirá saliendo de último.");
        }
      });
    });

    dibujar(null, null, null, null);
    armarParejas();
  })();
}
