/* Ejercicio interactivo: tres versiones con una linea cambiada (clase 11).
   Dos en el conteo por vertice de UVa 10765 (la desigualdad estricta y el
   arranque del valor de la raiz) y una en el etiquetado del arbol de puentes
   (un recorrido que cruza puentes). Las tres corren y devuelven algo con
   apariencia de respuesta. */
var EJERCICIO = (function () {
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

  /* El valor paloma con dos interruptores: estricta cambia >= por > en la
     condicion que suma un hijo, y raizPorVecinos arranca el valor de la raiz
     en len(G[u]) en lugar de 0. */
  function valores(n, aristas, opciones) {
    var G = construir(n, aristas);
    var op = opciones || {};
    var d = [], low = [], valor = [], hijos = [], reloj = 0, i = 0;
    while (i < n) { d.push(0); low.push(0); valor.push(1); hijos.push([]); i = i + 1; }
    function aux(u, entrada, raiz) {
      reloj = reloj + 1;
      d[u] = reloj;
      low[u] = reloj;
      if (u === raiz) { valor[u] = op.raizPorVecinos ? G[u].length : 0; }
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j][0], idx = G[u][j][1];
        if (d[v] === 0) {
          hijos[u].push(v);
          aux(v, idx, raiz);
          low[u] = Math.min(low[u], low[v]);
          var suma = op.estricta ? low[v] > d[u] : low[v] >= d[u];
          if (suma || u === raiz) { valor[u] = valor[u] + 1; }
        } else if (idx !== entrada) {
          low[u] = Math.min(low[u], d[v]);
        }
        j = j + 1;
      }
    }
    i = 0;
    while (i < n) { if (d[i] === 0) { aux(i, -1, i); } i = i + 1; }
    return { d: d, low: low, valor: valor, hijos: hijos, grados: G.map(function (l) { return l.length; }) };
  }

  /* Los puentes, siempre bien: el error del tercer caso esta despues. */
  function puentes(n, aristas) {
    var G = construir(n, aristas);
    var d = [], low = [], esPuente = [], reloj = 0, i = 0;
    while (i < n) { d.push(0); low.push(0); i = i + 1; }
    i = 0;
    while (i < aristas.length) { esPuente.push(false); i = i + 1; }
    function aux(u, entrada) {
      reloj = reloj + 1;
      d[u] = reloj;
      low[u] = reloj;
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j][0], idx = G[u][j][1];
        if (d[v] === 0) {
          aux(v, idx);
          low[u] = Math.min(low[u], low[v]);
          if (low[v] > d[u]) { esPuente[idx] = true; }
        } else if (idx !== entrada) {
          low[u] = Math.min(low[u], d[v]);
        }
        j = j + 1;
      }
    }
    i = 0;
    while (i < n) { if (d[i] === 0) { aux(i, -1); } i = i + 1; }
    var lista = [];
    i = 0;
    while (i < aristas.length) { if (esPuente[i]) { lista.push(i); } i = i + 1; }
    return { d: d, low: low, esPuente: esPuente, puentes: lista };
  }

  /* El etiquetado y la contraccion, con un interruptor: cruzaPuentes quita la
     condicion i not in es_puente del recorrido. */
  function contraer(n, aristas, opciones) {
    var op = opciones || {};
    var G = construir(n, aristas), p = puentes(n, aristas);
    var comp = [], i = 0;
    while (i < n) { comp.push(-1); i = i + 1; }
    var total = 0;
    i = 0;
    while (i < n) {
      if (comp[i] === -1) {
        comp[i] = total;
        var pila = [i];
        while (pila.length > 0) {
          var u = pila.pop(), j = 0;
          while (j < G[u].length) {
            var v = G[u][j][0], idx = G[u][j][1];
            if (comp[v] === -1 && (op.cruzaPuentes || !p.esPuente[idx])) {
              comp[v] = total;
              pila.push(v);
            }
            j = j + 1;
          }
        }
        total = total + 1;
      }
      i = i + 1;
    }
    var T = [], lazos = 0;
    i = 0;
    while (i < total) { T.push([]); i = i + 1; }
    i = 0;
    while (i < p.puentes.length) {
      var a = aristas[p.puentes[i]][0], b = aristas[p.puentes[i]][1];
      if (comp[a] === comp[b]) { lazos = lazos + 1; }
      T[comp[a]].push(comp[b]);
      T[comp[b]].push(comp[a]);
      i = i + 1;
    }
    var miembros = [];
    i = 0;
    while (i < total) { miembros.push([]); i = i + 1; }
    i = 0;
    while (i < n) { miembros[comp[i]].push(i); i = i + 1; }
    return { comp: comp, total: total, T: T, miembros: miembros, lazos: lazos,
             puentes: p.puentes, d: p.d, low: p.low };
  }

  function textoLista(l) { return l.length === 0 ? "ninguno" : "[" + l.join(", ") + "]"; }
  function textoArbol(T) {
    return "{" + T.map(function (l, c) { return c + ": [" + l.join(", ") + "]"; }).join(", ") + "}";
  }
  function textoComp(miembros) {
    return miembros.map(function (l, c) { return "c" + c + " = {" + l.join(", ") + "}"; }).join(", ");
  }

  var CASOS = [
    {
      clave: "estricta",
      titulo: "1. La desigualdad que suma un hijo",
      familia: "valor",
      n: 6,
      aristas: [[0, 1], [1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [4, 5]],
      pos: [[0.0, 1.0], [1.1, 1.0], [2.2, 1.0], [1.65, 2.2], [3.3, 1.8], [3.3, 0.2]],
      codigo: [
        { txt: "def paloma_aux(G, u, entrada, raiz, reloj, d, low, valor):" },
        { txt: "    descubrir(u, reloj, d, low)" },
        { txt: "    if u == raiz:" },
        { txt: "        valor[u] = 0" },
        { txt: "    for v, i in G[u]:" },
        { txt: "        if d[v] == 0:" },
        { txt: "            paloma_aux(G, v, i, raiz, reloj, d, low, valor)" },
        { txt: "            low[u] = min(low[u], low[v])" },
        { txt: "            if low[v] > d[u] or u == raiz:", cambiada: true },
        { txt: "                valor[u] = valor[u] + 1" },
        { txt: "        elif i != entrada:" },
        { txt: "            low[u] = min(low[u], d[v])" }
      ],
      lineaBuena: "            if low[v] >= d[u] or u == raiz:",
      mensajesLinea: {
        3: "Ahí el 0 está bien: la raíz no tiene padre, así que no hay pedazo que se le quede. Esta versión falla en otros vértices, no en la raíz.",
        7: "El mínimo con low[v] es el mismo en las dos versiones, y por eso los low de la tabla coinciden. Lo que cambia es la decisión que se toma con ellos.",
        9: "Sumar 1 es correcto cuando la condición se cumple. La falla está en cuándo se cumple.",
        11: "Esa línea baja low[u] con una arista de retroceso y está igual en las dos versiones: los low coinciden fila por fila.",
        10: "La guarda i != entrada descarta la arista por la que se llegó y está igual en las dos versiones."
      },
      defecto: "Esa línea es igual a la de la versión correcta. Los low coinciden en las dos, así que el error está en la comparación que decide si un hijo suma.",
      explicacion: function (mala, buena, caso) {
        var difiere = [], i = 0;
        while (i < caso.n) {
          if (mala.valor[i] !== buena.valor[i]) { difiere.push(i); }
          i = i + 1;
        }
        var casos = [];
        i = 0;
        while (i < difiere.length) {
          var u = difiere[i], hs = buena.hijos[u], k = 0, cuales = [];
          while (k < hs.length) {
            if (buena.low[hs[k]] === buena.d[u]) {
              cuales.push("low[" + hs[k] + "] = " + buena.low[hs[k]] + " = d[" + u + "]");
            }
            k = k + 1;
          }
          casos.push("en el " + u + ", " + cuales.join(" y "));
          i = i + 1;
        }
        return "Con la desigualdad estricta se pierden los vértices cuyo hijo tiene un retroceso que llega hasta ellos mismos: " +
          casos.join("; ") + ". Ese salto no sirve contra la articulación, porque el que se quita es " +
          "el propio vértice y el retroceso aterriza justo ahí; contra el puente sí sirve, y por eso " +
          "el criterio del puente es el que lleva el <code>&gt;</code>. La versión devuelve " +
          textoLista(mala.valor) + " y lo correcto es " + textoLista(buena.valor) +
          ": los vértices " + difiere.join(" y ") + " salen con valor 1 y la lista de salida deja de traerlos.";
      }
    },
    {
      clave: "raiz",
      titulo: "2. El valor con que arranca la raíz",
      familia: "valor",
      n: 7,
      aristas: [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [5, 6]],
      pos: [[0.6, 1.0], [0.0, 2.1], [1.4, 1.9], [1.5, 0.1], [2.9, 0.1], [4.0, 0.8], [4.0, -0.6]],
      codigo: [
        { txt: "def paloma_aux(G, u, entrada, raiz, reloj, d, low, valor):" },
        { txt: "    descubrir(u, reloj, d, low)" },
        { txt: "    if u == raiz:" },
        { txt: "        valor[u] = len(G[u])", cambiada: true },
        { txt: "    for v, i in G[u]:" },
        { txt: "        if d[v] == 0:" },
        { txt: "            paloma_aux(G, v, i, raiz, reloj, d, low, valor)" },
        { txt: "            low[u] = min(low[u], low[v])" },
        { txt: "            if low[v] >= d[u] or u == raiz:" },
        { txt: "                valor[u] = valor[u] + 1" },
        { txt: "        elif i != entrada:" },
        { txt: "            low[u] = min(low[u], d[v])" }
      ],
      lineaBuena: "        valor[u] = 0",
      mensajesLinea: {
        8: "Esa comparación está igual en las dos versiones, y para la raíz no decide nada: d[raíz] = 1 es el valor más bajo que hay, así que low[v] ≥ 1 se cumple siempre. Mire qué valor trae la raíz antes de entrar al ciclo.",
        2: "Distinguir la raíz es correcto: es el único vértice sin padre y por eso se trata aparte. Lo que está mal es con qué valor se la deja.",
        9: "Sumar un hijo al volver de cada llamada es lo que hacen las dos versiones, y para los vértices que no son raíz dan lo mismo.",
        11: "Esa línea baja low[u] con un retroceso y está igual en las dos versiones: los low coinciden fila por fila.",
        1: "descubrir pone d y low y está igual en las dos versiones: la tabla lo confirma."
      },
      defecto: "Esa línea es igual a la de la versión correcta. Los valores coinciden en todos los vértices menos uno: fíjese en cuál, y en qué lo distingue de los demás.",
      explicacion: function (mala, buena, caso) {
        return "La raíz no tiene padre, así que su valor arranca en 0 y crece un hijo por cada llamada que vuelve. " +
          "Aquí arranca en <code>len(G[0])</code> = " + buena.grados[0] + ", el número de vecinos, y encima suma su " +
          buena.hijos[0].length + " hijo: queda en " + mala.valor[0] + " cuando vale " + buena.valor[0] + ". " +
          "Son dos cosas a la vez. El 0 tiene " + buena.grados[0] + " vecinos y un solo hijo en el árbol, porque " +
          "los otros dos se descubren desde esa misma rama y sus aristas con la raíz resultan de retroceso; " +
          "hijos en el árbol y vecinos en el grafo no son lo mismo. Y el pedazo del padre no existe para la raíz. " +
          "La versión devuelve " + textoLista(mala.valor) + " y lo correcto es " + textoLista(buena.valor) +
          ": la salida sale encabezada por la estación equivocada.";
      }
    },
    {
      clave: "cruza",
      titulo: "3. El recorrido que etiqueta los componentes",
      familia: "arbol",
      n: 7,
      aristas: [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [3, 5], [4, 5], [5, 6]],
      pos: [[0.0, 1.8], [0.0, 0.2], [1.1, 1.0], [2.3, 1.0], [3.4, 1.8], [3.4, 0.2], [4.6, 0.2]],
      codigo: [
        { txt: "def etiquetar_con_pila(G, s, numero, es_puente, comp):" },
        { txt: "    comp[s] = numero" },
        { txt: "    pila = [s]" },
        { txt: "    while len(pila) > 0:" },
        { txt: "        u = pila.pop()" },
        { txt: "        for v, i in G[u]:" },
        { txt: "            if comp[v] == -1:", cambiada: true },
        { txt: "                comp[v] = numero" },
        { txt: "                pila.append(v)" }
      ],
      lineaBuena: "            if comp[v] == -1 and i not in es_puente:",
      mensajesLinea: {
        7: "Poner el número antes de apilar es lo correcto: si se deja para cuando el vértice sale de la pila, entra varias veces y el recorrido deja de ser lineal. Las dos versiones lo hacen igual.",
        8: "Apilar al vecino es lo que hace avanzar el recorrido, y está igual en las dos versiones.",
        1: "El primer vértice recibe su número antes de entrar al ciclo, igual en las dos versiones.",
        4: "Sacar de la pila es lo mismo en las dos versiones. Lo que cambia es a quiénes se les deja entrar.",
        5: "Recorrer los vecinos con su identificador de arista está igual en las dos versiones. Ese identificador es justamente el que la condición de abajo dejó de usar."
      },
      defecto: "Esa línea es igual a la de la versión correcta. Compare el número de componentes: esta versión saca uno solo donde hay varios, y la razón está en qué aristas tiene permitido cruzar el recorrido.",
      explicacion: function (mala, buena, caso) {
        return "Sin <code>i not in es_puente</code> el recorrido llega al otro lado del puente y los componentes vecinos se fusionan. " +
          "Los puentes se marcaron bien, son " + buena.puentes.length + " (" +
          buena.puentes.map(function (j) { return caso.aristas[j][0] + "–" + caso.aristas[j][1]; }).join(", ") +
          "), pero el etiquetado los cruza igual: devuelve " + mala.total +
          (mala.total === 1 ? " componente, " : " componentes, ") + textoComp(mala.miembros) +
          ", donde van " + buena.total + ": " + textoComp(buena.miembros) + ". " +
          "Y entonces la tercera pasada arma el árbol sobre esos números: cada puente pega el nodo " +
          "consigo mismo y T queda " + textoArbol(mala.T) + ", con " + mala.lazos +
          (mala.lazos === 1 ? " lazo" : " lazos") + " en lugar de " + textoArbol(buena.T) +
          ". El programa no se queja y las respuestas salen de otro grafo.";
      }
    }
  ];

  function correr(caso) {
    var res;
    if (caso.familia === "valor") {
      var opciones = caso.clave === "estricta" ? { estricta: true } : { raizPorVecinos: true };
      res = { mala: valores(caso.n, caso.aristas, opciones),
              buena: valores(caso.n, caso.aristas, {}) };
    } else {
      res = { mala: contraer(caso.n, caso.aristas, { cruzaPuentes: true }),
              buena: contraer(caso.n, caso.aristas, {}) };
    }
    return res;
  }

  function evaluar(caso, indice) {
    var cambiada = -1, k = 0;
    while (k < caso.codigo.length) { if (caso.codigo[k].cambiada) { cambiada = k; } k = k + 1; }
    var res = correr(caso), msg;
    var ok = indice === cambiada;
    if (ok) {
      msg = "Correcto: esa es la línea cambiada. La versión correcta dice <code>" +
        caso.lineaBuena.trim() + "</code>. " + caso.explicacion(res.mala, res.buena, caso);
    } else if (caso.mensajesLinea[indice] !== undefined) {
      msg = caso.mensajesLinea[indice];
    } else {
      msg = caso.defecto;
    }
    return { ok: ok, msg: msg, cambiada: cambiada };
  }

  return { casos: CASOS, construir: construir, valores: valores,
           puentes: puentes, contraer: contraer, correr: correr,
           evaluar: evaluar, textoLista: textoLista, textoArbol: textoArbol,
           textoComp: textoComp };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var corrido = {};

    function escapar(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

    function dibujar(caso, caja) {
      var pos = caso.pos, n = caso.n, ancho = 460, alto = 180, r = 15;
      var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
      while (i < n) {
        if (pos[i][0] < minX) { minX = pos[i][0]; }
        if (pos[i][0] > maxX) { maxX = pos[i][0]; }
        if (pos[i][1] < minY) { minY = pos[i][1]; }
        if (pos[i][1] > maxY) { maxY = pos[i][1]; }
        i = i + 1;
      }
      var mx = 34, my = 28;
      var esc = Math.min((ancho - 2 * mx) / (maxX - minX), (alto - 2 * my) / (maxY - minY));
      var ox = (ancho - esc * (maxX - minX)) / 2, oy = (alto - esc * (maxY - minY)) / 2;
      function X(k) { return ox + (pos[k][0] - minX) * esc; }
      function Y(k) { return oy + (maxY - pos[k][1]) * esc; }
      var P = EJERCICIO.puentes(caso.n, caso.aristas);
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:480px'>";
      var e = 0;
      while (e < caso.aristas.length) {
        var u = caso.aristas[e][0], v = caso.aristas[e][1];
        var esP = P.esPuente[e];
        svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) +
               "' stroke='" + (esP ? "#b3261e" : "#9aa3ad") + "' stroke-width='" + (esP ? 4 : 2) + "'/>";
        svg += "<text x='" + ((X(u) + X(v)) / 2) + "' y='" + ((Y(u) + Y(v)) / 2 - 3) +
               "' text-anchor='middle' font-size='9.5' font-family='ui-monospace, monospace' fill='#6b7280' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
               e + "</text>";
        e = e + 1;
      }
      i = 0;
      while (i < n) {
        svg += "<circle cx='" + X(i) + "' cy='" + Y(i) + "' r='" + r + "' fill='#ffffff' stroke='#9aa3ad' stroke-width='2.2'/>";
        svg += "<text x='" + X(i) + "' y='" + (Y(i) + 5) + "' text-anchor='middle' font-size='13.5' font-weight='700' fill='#24292f'>" + i + "</text>";
        svg += "<text x='" + X(i) + "' y='" + (Y(i) - r - 4) + "' text-anchor='middle' font-size='10.5' font-family='ui-monospace, monospace' fill='#24292f' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
               P.d[i] + "/" + P.low[i] + "</text>";
        i = i + 1;
      }
      svg += "</svg>";
      caja.innerHTML = svg;
    }

    function listaAristas(caso) {
      return caso.aristas.map(function (a, k) { return k + ": " + a[0] + "–" + a[1]; }).join("   ");
    }

    function armar() {
      var raiz = document.getElementById("casos"), html = "", c = 0;
      while (c < EJERCICIO.casos.length) {
        var caso = EJERCICIO.casos[c];
        html += "<div class='carta caso' data-caso='" + c + "'><h2>" + caso.titulo + "</h2>";
        html += "<div class='grafo-caso'></div>";
        html += "<p class='nota' style='margin-top:0'>Grafo no dirigido de " + caso.n +
                " vértices. Aristas: " + listaAristas(caso) + ". Los puentes van en rojo y sobre cada vértice está su <code>d/low</code>.</p>";
        html += "<div class='prediccion'><button class='primario btn-correr'>Correr esta versión</button></div>";
        html += "<div class='salida'></div>";
        html += "<p style='margin-bottom:0.2rem'><b>Señale la línea que cambió.</b></p><div class='lineas'>";
        var k = 0;
        while (k < caso.codigo.length) {
          html += "<button type='button' class='lin' data-linea='" + k + "'>" + escapar(caso.codigo[k].txt) + "</button>";
          k = k + 1;
        }
        html += "</div><div class='veredicto'></div></div>";
        c = c + 1;
      }
      raiz.innerHTML = html;
      Array.prototype.forEach.call(raiz.querySelectorAll(".caso"), function (carta) {
        var idx = parseInt(carta.getAttribute("data-caso"), 10);
        var caso = EJERCICIO.casos[idx];
        dibujar(caso, carta.querySelector(".grafo-caso"));
        carta.querySelector(".btn-correr").addEventListener("click", function () {
          mostrarCorrida(carta, caso, idx);
        });
        Array.prototype.forEach.call(carta.querySelectorAll(".lin"), function (b) {
          b.addEventListener("click", function () {
            var v = carta.querySelector(".veredicto");
            if (!corrido[idx]) {
              v.className = "veredicto mal";
              v.textContent = "Corra primero la versión y compare con la correcta; la línea se señala mirando qué cambió en la salida.";
            } else {
              var res = EJERCICIO.evaluar(caso, parseInt(b.getAttribute("data-linea"), 10));
              v.className = res.ok ? "veredicto bien" : "veredicto mal";
              v.innerHTML = res.msg;
            }
          });
        });
      });
    }

    function celda(a, b) {
      return a === b ? "<td>" + b + "</td>"
        : "<td style='background:var(--rojo-suave);color:var(--rojo);font-weight:700'>" + b + "</td>";
    }

    function mostrarCorrida(carta, caso, idx) {
      corrido[idx] = true;
      var res = EJERCICIO.correr(caso), n = caso.n, v, html = "";
      if (caso.familia === "valor") {
        html += "<p><b>Devuelve esta versión:</b> <code>" + EJERCICIO.textoLista(res.mala.valor) + "</code><br>" +
                "<b>Devuelve la correcta:</b> <code>" + EJERCICIO.textoLista(res.buena.valor) + "</code></p>";
        html += "<div class='envoltura-tabla'><table><thead><tr><th>Vértice</th>";
        for (v = 0; v < n; v = v + 1) { html += "<th>" + v + "</th>"; }
        html += "</tr></thead><tbody><tr><th>d</th>";
        for (v = 0; v < n; v = v + 1) { html += "<td>" + res.buena.d[v] + "</td>"; }
        html += "</tr><tr><th>low</th>";
        for (v = 0; v < n; v = v + 1) { html += "<td>" + res.buena.low[v] + "</td>"; }
        html += "</tr><tr><th>valor, correcta</th>";
        for (v = 0; v < n; v = v + 1) { html += "<td>" + res.buena.valor[v] + "</td>"; }
        html += "</tr><tr><th>valor, esta versión</th>";
        for (v = 0; v < n; v = v + 1) { html += celda(res.buena.valor[v], res.mala.valor[v]); }
        html += "</tr></tbody></table></div>";
      } else {
        html += "<p><b>Devuelve esta versión:</b> " + res.mala.total +
                (res.mala.total === 1 ? " componente, " : " componentes, ") + "<code>" +
                EJERCICIO.textoComp(res.mala.miembros) + "</code>, y <code>T = " +
                EJERCICIO.textoArbol(res.mala.T) + "</code><br>" +
                "<b>Devuelve la correcta:</b> " + res.buena.total + " componentes, <code>" +
                EJERCICIO.textoComp(res.buena.miembros) + "</code>, y <code>T = " +
                EJERCICIO.textoArbol(res.buena.T) + "</code></p>";
        html += "<div class='envoltura-tabla'><table><thead><tr><th>Vértice</th>";
        for (v = 0; v < n; v = v + 1) { html += "<th>" + v + "</th>"; }
        html += "</tr></thead><tbody><tr><th>d</th>";
        for (v = 0; v < n; v = v + 1) { html += "<td>" + res.buena.d[v] + "</td>"; }
        html += "</tr><tr><th>low</th>";
        for (v = 0; v < n; v = v + 1) { html += "<td>" + res.buena.low[v] + "</td>"; }
        html += "</tr><tr><th>comp, correcta</th>";
        for (v = 0; v < n; v = v + 1) { html += "<td>" + res.buena.comp[v] + "</td>"; }
        html += "</tr><tr><th>comp, esta versión</th>";
        for (v = 0; v < n; v = v + 1) { html += celda(res.buena.comp[v], res.mala.comp[v]); }
        html += "</tr></tbody></table></div>";
      }
      var s = carta.querySelector(".salida");
      s.style.display = "block";
      s.innerHTML = html;
    }

    armar();
  })();
}
