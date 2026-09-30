/* Ejercicio interactivo: Kahn con cola, con pila y con la fuente mas
   pequena (clase 8). Las tres versiones sobre el mismo grafo, y las tres
   devuelven un orden topologico distinto. */
var EJERCICIO = (function () {
  function codigoDe(version) {
    var crea, saca, mete;
    if (version === "pila") { crea = "    pila = []"; saca = "        u = pila.pop()"; mete = "pila.append("; }
    else if (version === "menor") { crea = "    fuentes = []"; saca = "        u = heapq.heappop(fuentes)"; mete = "heapq.heappush(fuentes, "; }
    else { crea = "    cola = deque()"; saca = "        u = cola.popleft()"; mete = "cola.append("; }
    var nombre = version === "pila" ? "kahn_con_pila" : (version === "menor" ? "kahn_menor" : "kahn");
    var estructura = version === "pila" ? "pila" : (version === "menor" ? "fuentes" : "cola");
    return [
      { txt: "def " + nombre + "(G):",                num: null },
      { txt: "    n = len(G)",                         num: 1 },
      { txt: "    entrada = grados_de_entrada(G)",     num: 2 },
      { txt: crea,                                     num: 3 },
      { txt: "    u = 0",                              num: 4 },
      { txt: "    while u < n:",                       num: 5,  bloque: 1 },
      { txt: "        if entrada[u] == 0:",            num: 6,  bloque: 1 },
      { txt: "            " + mete + "u)",             num: 7,  bloque: 1 },
      { txt: "        u = u + 1",                      num: 8,  bloque: 1 },
      { txt: "    orden = []",                         num: 9 },
      { txt: "    while len(" + estructura + ") > 0:", num: 10, bloque: 2 },
      { txt: saca,                                     num: 11, bloque: 2 },
      { txt: "        orden.append(u)",                num: 12, bloque: 2 },
      { txt: "        for v in G[u]:",                 num: 13, bloque: 2 },
      { txt: "            entrada[v] = entrada[v] - 1", num: 14, bloque: 2 },
      { txt: "            if entrada[v] == 0:",        num: 15, bloque: 2 },
      { txt: "                " + mete + "v)",         num: 16, bloque: 2 },
      { txt: "    return orden",                       num: 17 }
    ];
  }

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

  /* La estructura se guarda como lista; "sacar" depende de la version.
     Para la cola de prioridad la lista se mantiene ordenada, que sobre
     estos grafos muestra lo mismo que el monticulo: sale el menor. */
  function sacar(lista, version) {
    var u;
    if (version === "pila") { u = lista.pop(); }
    else if (version === "menor") { lista.sort(function (a, b) { return a - b; }); u = lista.shift(); }
    else { u = lista.shift(); }
    return u;
  }

  function simular(params) {
    var G = params.G, version = params.version;
    var n = G.length;
    var pasos = [];
    var entrada = null, lista = null, orden = null, u = null, v = null;
    var estado = [];
    var t = 0;
    while (t < n) { estado.push("libre"); t = t + 1; }
    function vista() {
      var l = lista === null ? [] : lista.slice();
      if (version === "menor") { l.sort(function (a, b) { return a - b; }); }
      return l;
    }
    function snap(linea, extra) {
      var q = { linea: linea, u: u === null ? "–" : u, v: v === null ? "–" : v,
                entrada: entrada === null ? null : entrada.slice(),
                lista: vista(), orden: orden === null ? [] : orden.slice(), estado: estado.slice() };
      if (extra) { for (var x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }
    snap(1);
    entrada = gradosDeEntrada(G); snap(2);
    lista = []; snap(3);
    var uu = 0; u = 0; snap(4);
    var sigue = true;
    while (sigue) {
      snap(5);
      if (uu < n) {
        u = uu; snap(6);
        if (entrada[uu] === 0) { lista.push(uu); estado[uu] = "cola"; snap(7, { entra: uu }); }
        uu = uu + 1; u = uu; snap(8);
      } else { sigue = false; }
    }
    u = null;
    orden = []; snap(9);
    sigue = true;
    while (sigue) {
      snap(10);
      if (lista.length > 0) {
        var disponibles = vista();
        var w = sacar(lista, version); u = w; estado[w] = "actual";
        snap(11, { sale: w, disponibles: disponibles });
        orden.push(w); snap(12);
        var i = 0;
        while (i < G[w].length) {
          v = G[w][i];
          snap(13, { mira: v });
          entrada[v] = entrada[v] - 1; snap(14, { resta: v });
          snap(15);
          if (entrada[v] === 0) { lista.push(v); estado[v] = "cola"; snap(16, { entra: v }); }
          i = i + 1;
        }
        v = null;
        estado[w] = "salio";
        snap(10, { cierra: w, disponibles: disponibles });
      } else { sigue = false; }
    }
    u = null;
    snap(17, { fin: true });
    return pasos;
  }

  function ordenDe(G, version) {
    var pasos = simular({ G: G, version: version });
    return pasos[pasos.length - 1].orden;
  }

  function esTopologico(G, orden) {
    var n = G.length, pos = [], i = 0, bien = orden.length === n, u;
    while (i < n) { pos.push(-1); i = i + 1; }
    i = 0; while (i < orden.length) { pos[orden[i]] = i; i = i + 1; }
    u = 0;
    while (u < n && bien) {
      i = 0;
      while (i < G[u].length) { if (pos[u] < 0 || pos[G[u][i]] < 0 || pos[u] > pos[G[u][i]]) { bien = false; } i = i + 1; }
      u = u + 1;
    }
    return bien;
  }

  return { codigoDe: codigoDe, simular: simular, ordenDe: ordenDe, esTopologico: esTopologico };
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
    var G = grafo(7, [[2, 0], [2, 5], [0, 1], [5, 1], [5, 4], [1, 3], [4, 3], [6, 4]]);
    var POS = [[1.4, 2.4], [2.8, 1.8], [0, 1.8], [4.2, 1.2], [2.8, 0.4], [1.4, 1.0], [1.4, 0]];
    var version = "cola";
    var COLOR = { libre: "#ffffff", cola: "#fdf1dc", actual: "#e3edf8", salio: "#e7f2e8" };
    var BORDE = { libre: "#d8dee6", cola: "#e8a13d", actual: "#1f5fa8", salio: "#2e7d32" };
    var ROTULO = { cola: "Cola", pila: "Pila", menor: "Fuentes (sale la menor)" };

    function dibujar(entrada, estado, actual) {
      var n = G.length, ancho = 460, alto = 250;
      function X(i) { return 40 + (POS[i][0] / 4.2) * (ancho - 80); }
      function Y(i) { return 30 + ((2.4 - POS[i][1]) / 2.4) * (alto - 60); }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:480px'>";
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
      dibujar(a ? a.entrada : null, a ? a.estado : null, a && a.u !== "–" && a.linea >= 10 ? a.u : null);
      document.getElementById("rotulo-lista").textContent = ROTULO[e.params.version];
      document.getElementById("ver-lista").textContent = a && a.lista.length > 0 ? a.lista.join(", ") : "vacía";
      document.getElementById("ver-orden").textContent = a && a.orden.length > 0 ? "[" + a.orden.join(", ") + "]" : "[ ]";
      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var filas = 0, m;
      for (m = 0; m < e.k; m = m + 1) {
        var q = e.pasos[m];
        if (q.cierra !== undefined) {
          filas = filas + 1;
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + filas + "</td><td>" + q.disponibles.join(", ") + "</td><td><b>" + q.cierra + "</b></td>";
          cuerpo.appendChild(tr);
        }
      }
      if (filas === 0) { cuerpo.innerHTML = "<tr><td colspan='3' class='pend'>Ejecute: cada vértice que sale agrega una fila con las fuentes que había para escoger.</td></tr>"; }
    }

    function arrancar() {
      var ids = ["btn-paso", "btn-auto", "btn-fin", "btn-reiniciar"];
      var t = 0;
      while (t < ids.length) {
        var b = document.getElementById(ids[t]);
        b.parentNode.replaceChild(b.cloneNode(true), b);
        t = t + 1;
      }
      Motor.iniciar({
        codigo: EJERCICIO.codigoDe(version), simular: EJERCICIO.simular,
        chips: [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }],
        paramsIniciales: { G: G, version: version }, alPintar: alPintar
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        version = btn.getAttribute("data-version");
        arrancar();
      });
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id); v.className = ok ? "veredicto bien" : "veredicto mal"; v.innerHTML = texto;
    }

    var ORDENES = { cola: EJERCICIO.ordenDe(G, "cola"), pila: EJERCICIO.ordenDe(G, "pila"), menor: EJERCICIO.ordenDe(G, "menor") };
    Array.prototype.forEach.call(document.querySelectorAll("[data-orden]"), function (el) {
      el.textContent = "[" + ORDENES[el.getAttribute("data-orden")].join(", ") + "]";
    });

    function cablear(idOpciones, idVeredicto, correcta, mensajes) {
      Array.prototype.forEach.call(document.querySelectorAll("#" + idOpciones + " button"), function (btn) {
        btn.addEventListener("click", function () {
          var op = btn.getAttribute("data-op");
          veredicto(idVeredicto, op === correcta, mensajes[op]);
        });
      });
    }

    cablear("opciones-pila", "veredicto-pila", "pila", {
      pila: "Correcto. Con la pila sale la última fuente que entró: arranca por el 6, que entró después del 2. Como el 6 no deja a nadie en 0, sigue con el 2, y de ahí con lo que el 2 destapa. Ejecute la versión con pila y compare fila por fila.",
      cola: "Ese es el orden de la cola: sale la fuente más antigua. Con la pila, al arrancar hay dos fuentes, 2 y 6, y sale el 6, que fue el último en entrar.",
      menor: "Ese es el orden que saca siempre la fuente de número más bajo. La pila no mira el número: saca la última que entró, y al arrancar esa es el 6."
    });
    cablear("opciones-menor", "veredicto-menor", "menor", {
      menor: "Correcto. En cada paso sale la fuente de número más bajo entre las disponibles; en el paso 2 hay 0, 5 y 6 y sale el 0, mientras que la cola saca el 6 por haber entrado antes.",
      cola: "Ese es el orden de la cola. Coinciden en el primer vértice porque el 2 entró primero y además es el menor, pero en el paso 2 la cola saca el 6 y la fuente menor es el 0.",
      pila: "Ese es el orden de la pila, que arranca por el 6. La versión que busca la fuente más pequeña arranca por el 2, que es la menor de las dos fuentes iniciales."
    });
    cablear("opciones-validos", "veredicto-validos", "todos", {
      todos: "Correcto: los tres son órdenes topológicos. Lo que sostiene el algoritmo, que un vértice entra a la estructura cuando su contador llega a 0, no depende de cuál de las fuentes disponibles sale primero. Cambia el orden, no la validez.",
      cola: "Los tres sirven. Pruebe con cualquiera de las ocho flechas: en los tres órdenes la cola de la flecha aparece antes que la punta. La cola no tiene nada de especial; es una de las formas de escoger entre las fuentes disponibles.",
      ninguno: "Al revés: los tres sirven. Lo que decide si un orden es topológico es que cada vértice salga después de sus predecesores, y eso lo garantiza el contador en las tres versiones."
    });

    arrancar();
  })();
}
