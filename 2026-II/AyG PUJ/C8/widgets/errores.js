/* Ejercicio interactivo: tres fallas en el algoritmo de Kahn (clase 8).
   Cada version corre sobre el mismo grafo y se compara con la correcta.
   Ninguna da error al ejecutar: las tres devuelven una lista. */
var EJERCICIO = (function () {
  /* Siete vertices. El 2 tiene dos predecesores, el 1 no es fuente y el 6
     no tiene ninguna arista. */
  var ARISTAS = [[0, 2], [1, 2], [2, 3], [2, 4], [5, 1]];
  var N = 7;

  function grafo() {
    var G = [], i = 0;
    while (i < N) { G.push([]); i = i + 1; }
    i = 0;
    while (i < ARISTAS.length) { G[ARISTAS[i][0]].push(ARISTAS[i][1]); i = i + 1; }
    return G;
  }

  function gradosDeEntrada(G) {
    var n = G.length, entrada = [], u = 0, i;
    while (u < n) { entrada.push(0); u = u + 1; }
    u = 0;
    while (u < n) { i = 0; while (i < G[u].length) { entrada[G[u][i]] = entrada[G[u][i]] + 1; i = i + 1; } u = u + 1; }
    return entrada;
  }

  function kahn(G) {
    var n = G.length, entrada = gradosDeEntrada(G), cola = [], orden = [], u = 0, i;
    while (u < n) { if (entrada[u] === 0) { cola.push(u); } u = u + 1; }
    while (cola.length > 0) {
      u = cola.shift(); orden.push(u); i = 0;
      while (i < G[u].length) {
        entrada[G[u][i]] = entrada[G[u][i]] - 1;
        if (entrada[G[u][i]] === 0) { cola.push(G[u][i]); }
        i = i + 1;
      }
    }
    return orden;
  }

  /* Pregunta por el contador ANTES de restarle uno. */
  function kahnAntesDeRestar(G) {
    var n = G.length, entrada = gradosDeEntrada(G), cola = [], orden = [], u = 0, i;
    while (u < n) { if (entrada[u] === 0) { cola.push(u); } u = u + 1; }
    while (cola.length > 0) {
      u = cola.shift(); orden.push(u); i = 0;
      while (i < G[u].length) {
        if (entrada[G[u][i]] === 0) { cola.push(G[u][i]); }
        entrada[G[u][i]] = entrada[G[u][i]] - 1;
        i = i + 1;
      }
    }
    return orden;
  }

  /* Marca visitados en vez de contar cuantos predecesores faltan. */
  function kahnConVisitado(G) {
    var n = G.length, entrada = gradosDeEntrada(G), visitado = [], cola = [], orden = [], u = 0, i;
    while (u < n) { visitado.push(false); u = u + 1; }
    u = 0;
    while (u < n) { if (entrada[u] === 0) { cola.push(u); visitado[u] = true; } u = u + 1; }
    while (cola.length > 0) {
      u = cola.shift(); orden.push(u); i = 0;
      while (i < G[u].length) {
        if (!visitado[G[u][i]]) { visitado[G[u][i]] = true; cola.push(G[u][i]); }
        i = i + 1;
      }
    }
    return orden;
  }

  /* Arma la cola inicial solo con los vertices que tienen vecinos. */
  function kahnSinAislados(G) {
    var n = G.length, entrada = gradosDeEntrada(G), cola = [], orden = [], u = 0, i;
    while (u < n) { if (entrada[u] === 0 && G[u].length > 0) { cola.push(u); } u = u + 1; }
    while (cola.length > 0) {
      u = cola.shift(); orden.push(u); i = 0;
      while (i < G[u].length) {
        entrada[G[u][i]] = entrada[G[u][i]] - 1;
        if (entrada[G[u][i]] === 0) { cola.push(G[u][i]); }
        i = i + 1;
      }
    }
    return orden;
  }

  /* null si el orden es topologico y completo; si no, qué falla. */
  function falla(G, orden) {
    var n = G.length, pos = [], i = 0, u, res = null;
    while (i < n) { pos.push(-1); i = i + 1; }
    i = 0; while (i < orden.length) { pos[orden[i]] = i; i = i + 1; }
    u = 0;
    while (u < n && res === null) {
      i = 0;
      while (i < G[u].length && res === null) {
        if (pos[u] >= 0 && pos[G[u][i]] >= 0 && pos[u] > pos[G[u][i]]) { res = { u: u, v: G[u][i] }; }
        i = i + 1;
      }
      u = u + 1;
    }
    if (res === null && orden.length < n) {
      var faltan = [];
      u = 0; while (u < n) { if (pos[u] < 0) { faltan.push(u); } u = u + 1; }
      res = { faltan: faltan };
    }
    return res;
  }

  return { ARISTAS: ARISTAS, N: N, grafo: grafo, gradosDeEntrada: gradosDeEntrada, kahn: kahn,
           kahnAntesDeRestar: kahnAntesDeRestar, kahnConVisitado: kahnConVisitado,
           kahnSinAislados: kahnSinAislados, falla: falla };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var G = EJERCICIO.grafo();
    var n = EJERCICIO.N;
    var POS = [[0, 2.4], [0, 0.8], [1.6, 1.6], [3.2, 2.4], [3.2, 0.8], [0, 0], [4.2, 0]];
    var bien = EJERCICIO.kahn(G);

    function dibujar() {
      var ancho = 460, alto = 240;
      function X(i) { return 40 + (POS[i][0] / 4.2) * (ancho - 80); }
      function Y(i) { return 30 + ((2.4 - POS[i][1]) / 2.4) * (alto - 60); }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:470px'>";
      svg += "<defs><marker id='flecha' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker></defs>";
      var u = 0, i;
      while (u < n) {
        i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          var dx = X(v) - X(u), dy = Y(v) - Y(u), d = Math.sqrt(dx * dx + dy * dy);
          svg += "<line x1='" + (X(u) + dx / d * 17) + "' y1='" + (Y(u) + dy / d * 17) + "' x2='" + (X(v) - dx / d * 19) + "' y2='" + (Y(v) - dy / d * 19) + "' stroke='#6b7280' stroke-width='1.6' marker-end='url(#flecha)'/>";
          i = i + 1;
        }
        u = u + 1;
      }
      var entrada = EJERCICIO.gradosDeEntrada(G);
      u = 0;
      while (u < n) {
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='15' fill='#ffffff' stroke='#d8dee6' stroke-width='2'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + u + "</text>";
        svg += "<circle cx='" + (X(u) + 14) + "' cy='" + (Y(u) - 14) + "' r='9' fill='" + (entrada[u] === 0 ? "#2e7d32" : "#b3261e") + "'/>";
        svg += "<text x='" + (X(u) + 14) + "' y='" + (Y(u) - 10.5) + "' text-anchor='middle' font-size='10' font-weight='700' fill='#fff'>" + entrada[u] + "</text>";
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function lista(a) { return "[" + a.join(", ") + "]"; }

    function diagnostico(orden) {
      var f = EJERCICIO.falla(G, orden);
      if (f === null) { return "es un orden topológico completo"; }
      if (f.faltan) { return "deja por fuera " + (f.faltan.length === 1 ? "el vértice " : "los vértices ") + f.faltan.join(", ") + ", y con <code>len(orden) &lt; n</code> el programa diría que hay un ciclo"; }
      return "pone " + f.v + " antes que " + f.u + ", y la flecha va de " + f.u + " a " + f.v;
    }

    var SALIDAS = {
      antes: function () {
        var mal = EJERCICIO.kahnAntesDeRestar(G);
        return "<b>Con el error:</b> devuelve <code>" + lista(mal) + "</code>, que " + diagnostico(mal) + ". Ningún vértice llega a la cola por la resta: cuando se pregunta, el contador todavía vale al menos 1, y cuando vale 0 ya nadie vuelve a preguntar.<br>" +
          "<b>Corregido:</b> <code>" + lista(bien) + "</code>, los " + n + ".";
      },
      visitado: function () {
        var mal = EJERCICIO.kahnConVisitado(G);
        return "<b>Con el error:</b> devuelve <code>" + lista(mal) + "</code>, que " + diagnostico(mal) + ". La marca dice <i>ya lo vi</i>, y para salir hace falta <i>ya salieron todos los que le apuntan</i>: el 2 entra a la cola apenas sale el 0, sin esperar al 1.<br>" +
          "<b>Corregido:</b> <code>" + lista(bien) + "</code>. El contador es lo que cuenta cuántos faltan; una marca de dos valores no alcanza.";
      },
      aislados: function () {
        var mal = EJERCICIO.kahnSinAislados(G);
        return "<b>Con el error:</b> devuelve <code>" + lista(mal) + "</code>, que " + diagnostico(mal) + ". El 6 no tiene aristas: ni le llegan ni salen de él, así que su contador es 0 desde el principio y nada lo va a meter después.<br>" +
          "<b>Corregido:</b> <code>" + lista(bien) + "</code>. Un vértice suelto también va en el orden, en cualquier posición.";
      }
    };

    var RESPUESTAS = {
      antes: { correcta: "b", pistas: {
        a: "La cola inicial está bien: entran todos los vértices con contador 0.",
        b: "Correcto: el <code>if</code> quedó antes de la resta, y para el vecino que acaba de perder su último predecesor la pregunta llega un instante temprano.",
        c: "El recorrido de los vecinos está bien: se miran todos los de la lista de u." } },
      visitado: { correcta: "c", pistas: {
        a: "La cola inicial está bien: son los vértices sin predecesores.",
        b: "Sacar por el frente es correcto; con una pila el orden cambiaría, pero seguiría siendo topológico.",
        c: "Correcto: <code>visitado</code> solo distingue visto de no visto, y hace falta saber cuántos predecesores le faltan a cada vértice." } },
      aislados: { correcta: "a", pistas: {
        a: "Correcto: la condición <code>len(G[u]) &gt; 0</code> deja fuera a los vértices sin aristas, que son fuentes igual que los demás.",
        b: "La resta y la pregunta están en el orden correcto: primero se resta, después se pregunta.",
        c: "Agregar al final de <code>orden</code> es lo correcto; el primero que sale es el primero del orden." } }
    };

    Array.prototype.forEach.call(document.querySelectorAll(".caso"), function (caso) {
      var clave = caso.getAttribute("data-caso");
      Array.prototype.forEach.call(caso.querySelectorAll(".opciones button"), function (btn) {
        btn.addEventListener("click", function () {
          var op = btn.getAttribute("data-op");
          var v = caso.querySelector(".veredicto");
          var ok = op === RESPUESTAS[clave].correcta;
          v.className = ok ? "veredicto bien" : "veredicto mal";
          v.innerHTML = RESPUESTAS[clave].pistas[op];
          if (ok) { var s = caso.querySelector(".salida"); s.innerHTML = SALIDAS[clave](); s.style.display = "block"; }
        });
      });
    });

    dibujar();
    document.getElementById("ver-bien").textContent = lista(bien);
  })();
}
