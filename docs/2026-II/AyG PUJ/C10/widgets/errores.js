/* Ejercicio interactivo: tres fallas con una linea cambiada (clase 10).
   Dos en cortes (sin la guarda v != padre, y con >= en la condicion del
   puente) y una en tarjan (d[v] != 0 en lugar de en_pila[v]). Las tres
   corren y devuelven algo con apariencia de respuesta. */
var EJERCICIO = (function () {
  function construir(n, aristas) {
    var G = [], i = 0;
    while (i < n) { G.push([]); i = i + 1; }
    i = 0;
    while (i < aristas.length) {
      G[aristas[i][0]].push(aristas[i][1]);
      G[aristas[i][1]].push(aristas[i][0]);
      i = i + 1;
    }
    i = 0;
    while (i < n) { G[i].sort(function (a, b) { return a - b; }); i = i + 1; }
    return G;
  }

  /* cortes con dos interruptores: sinPadre quita la guarda v != padre
     (el elif pasa a else) y puenteMayorIgual cambia > por >= en la
     condicion del puente de revisar_hijo. */
  function cortes(G, opciones) {
    var n = G.length, d = [], low = [], esArt = [], puentes = [], reloj = 0, i = 0;
    var op = opciones || {};
    while (i < n) { d.push(0); low.push(0); esArt.push(false); i = i + 1; }
    function descubrir(u) { reloj = reloj + 1; d[u] = reloj; low[u] = reloj; }
    function revisarHijo(u, v, esRaiz) {
      low[u] = Math.min(low[u], low[v]);
      if (!esRaiz && low[v] >= d[u]) { esArt[u] = true; }
      var esPuente = op.puenteMayorIgual ? low[v] >= d[u] : low[v] > d[u];
      if (esPuente) { puentes.push([u, v]); }
    }
    function aux(u, padre) {
      descubrir(u);
      var hijos = 0, j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        if (d[v] === 0) {
          hijos = hijos + 1;
          aux(v, u);
          revisarHijo(u, v, padre === -1);
        } else if (op.sinPadre || v !== padre) {
          low[u] = Math.min(low[u], d[v]);
        }
        j = j + 1;
      }
      if (padre === -1 && hijos >= 2) { esArt[u] = true; }
    }
    i = 0;
    while (i < n) { if (d[i] === 0) { aux(i, -1); } i = i + 1; }
    var arts = [];
    i = 0;
    while (i < n) { if (esArt[i]) { arts.push(i); } i = i + 1; }
    return { articulaciones: arts, puentes: puentes, d: d, low: low };
  }

  /* tarjan sobre un arreglo de listas de sucesores; con dNoCero la condicion
     del elif es d[v] != 0 en vez de en_pila[v]. */
  function tarjan(G, opciones) {
    var n = G.length, d = [], low = [], enPila = [], pila = [], comps = [], reloj = 0, i = 0;
    var op = opciones || {};
    while (i < n) { d.push(0); low.push(0); enPila.push(false); i = i + 1; }
    function descubrir(u) {
      reloj = reloj + 1; d[u] = reloj; low[u] = reloj;
      pila.push(u); enPila[u] = true;
    }
    function sacar(u) {
      var comp = [], w = null;
      while (w !== u) { w = pila.pop(); enPila[w] = false; comp.push(w); }
      comps.push(comp);
    }
    function visit(u) {
      descubrir(u);
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        if (d[v] === 0) {
          visit(v);
          low[u] = Math.min(low[u], low[v]);
        } else if (op.dNoCero ? d[v] !== 0 : enPila[v]) {
          low[u] = Math.min(low[u], d[v]);
        }
        j = j + 1;
      }
      if (low[u] === d[u]) { sacar(u); }
    }
    i = 0;
    while (i < n) { if (d[i] === 0) { visit(i); } i = i + 1; }
    return { componentes: comps, d: d, low: low };
  }

  var CASOS = [
    {
      clave: "padre",
      titulo: "1. La arista por la que se llegó",
      dirigido: false,
      n: 6, aristas: [[0, 1], [1, 2], [2, 3], [3, 1], [3, 4], [4, 5]],
      pos: [[0.0, 1.0], [1.2, 1.0], [2.2, 1.9], [2.2, 0.1], [3.4, 0.1], [4.6, 0.1]],
      codigo: [
        { txt: "def cortes_aux(G, u, padre, reloj, d, low, es_art, puentes):" },
        { txt: "    # padre = -1 dice que u es la raiz de su arbol." },
        { txt: "    descubrir(u, reloj, d, low)" },
        { txt: "    hijos = 0" },
        { txt: "    for v in G[u]:" },
        { txt: "        if d[v] == 0:" },
        { txt: "            hijos = hijos + 1" },
        { txt: "            cortes_aux(G, v, u, reloj, d, low, es_art, puentes)" },
        { txt: "            revisar_hijo(u, v, padre == -1, d, low, es_art, puentes)" },
        { txt: "        else:", cambiada: true },
        { txt: "            low[u] = min(low[u], d[v])" },
        { txt: "    if padre == -1 and hijos >= 2:" },
        { txt: "        es_art[u] = True" }
      ],
      lineaBuena: "        elif v != padre:",
      mensajesLinea: {
        10: "Esa línea baja low[u] con una arista de retroceso y debe estar: es la línea que lo hace bien. Lo que le falla es la condición de arriba, que ahora la deja pasar también para el padre.",
        8: "revisar_hijo está igual que en la correcta y decide bien con los low que recibe. El problema son los low que le llegan: el low de cada hijo ya viene más bajo de lo debido.",
        5: "La condición d[v] == 0 separa los vecinos nuevos de los ya descubiertos y está igual en las dos versiones. La falla está en la rama de los ya descubiertos.",
        11: "Los puntos de articulación salen iguales en las dos versiones, y esta es la línea de la raíz. Mire qué lista es la que cambia: la de los puentes."
      },
      defecto: "Esa línea es igual a la de la versión correcta. Compare las dos filas de low en la tabla y busque la rama donde un vértice ya descubierto cambia un low.",
      explicacion: function (mala, buena) {
        return "Sin la guarda <code>v != padre</code>, la arista por la que se llegó cuenta como si fuera de retroceso: cada hijo baja su low hasta <code>d[padre]</code>. " +
          "Con eso <code>low[v] &gt; d[u]</code> no se cumple nunca, y la versión devuelve " + textoPuentes(mala.puentes) +
          " cuando los puentes son " + textoPuentes(buena.puentes) + ". Los puntos de articulación coinciden, " + textoLista(mala.articulaciones) +
          ", porque su prueba es <code>≥</code> y low[v] = d[u] ya la cumple.";
      }
    },
    {
      clave: "mayor",
      titulo: "2. La condición del puente",
      dirigido: false,
      n: 6, aristas: [[0, 1], [1, 2], [2, 3], [0, 3], [2, 4], [4, 5], [2, 5]],
      pos: [[0.0, 1.8], [1.4, 1.8], [1.4, 0.2], [0.0, 0.2], [2.8, 1.1], [2.8, -0.5]],
      codigo: [
        { txt: "def revisar_hijo(u, v, es_raiz, d, low, es_art, puentes):" },
        { txt: "    # v es hijo de u y ya termino: su low es definitivo." },
        { txt: "    low[u] = min(low[u], low[v])" },
        { txt: "    if not es_raiz and low[v] >= d[u]:" },
        { txt: "        es_art[u] = True" },
        { txt: "    if low[v] >= d[u]:", cambiada: true },
        { txt: "        puentes.append((u, v))" }
      ],
      lineaBuena: "    if low[v] > d[u]:",
      mensajesLinea: {
        3: "Esa línea es la del punto de articulación y ahí el ≥ está bien: basta con que el subárbol no suba más arriba de u. Para el puente se pide algo más fuerte, y esa es otra línea.",
        2: "El mínimo con low[v] es el mismo en las dos versiones, y los puntos de articulación salen iguales. Lo que cambia es la lista de puentes.",
        4: "Marcar a u es lo correcto cuando la condición de la línea anterior se cumple; los puntos de articulación coinciden en las dos versiones.",
        6: "Agregar la arista a puentes es correcto cuando la condición se cumple. La falla está en cuándo se cumple."
      },
      defecto: "Esa línea es igual a la de la versión correcta. Compare las dos listas de puentes: las aristas de más tienen algo en común, y lo dice una comparación.",
      explicacion: function (mala, buena) {
        return "Con <code>≥</code> en la condición del puente, una arista cuyo subárbol vuelve exactamente a <code>u</code> pasa como puente, cuando la arista de retroceso cierra un ciclo con ella. " +
          "La versión devuelve " + textoPuentes(mala.puentes) + " y los puentes son " + textoPuentes(buena.puentes) +
          ". Pasa también con la raíz: como d[raíz] = 1 es lo más bajo que hay, low[v] ≥ d[raíz] se cumple siempre y toda arista de la raíz a un hijo sale como puente. " +
          "Un puente pide <code>&gt;</code>: el subárbol no llega ni a u.";
      }
    },
    {
      clave: "tarjan",
      titulo: "3. La arista que apunta a un componente ya cerrado",
      dirigido: true,
      n: 5, aristas: [[0, 1], [0, 3], [1, 2], [2, 1], [3, 1], [3, 4]],
      pos: [[0.0, 1.0], [1.6, 2.0], [3.2, 2.0], [1.6, 0.0], [3.2, 0.0]],
      codigo: [
        { txt: "def visit(u):" },
        { txt: "    descubrir(u, reloj, d, low, pila, en_pila)" },
        { txt: "    for v in grafo[u]:" },
        { txt: "        if d[v] == 0:" },
        { txt: "            visit(v)" },
        { txt: "            low[u] = min(low[u], low[v])" },
        { txt: "        elif d[v] != 0:", cambiada: true },
        { txt: "            low[u] = min(low[u], d[v])" },
        { txt: "    if low[u] == d[u]:" },
        { txt: "        sacar_componente(u, pila, en_pila, componentes)" }
      ],
      lineaBuena: "        elif en_pila[v]:",
      mensajesLinea: {
        7: "Bajar low[u] con d[v] es lo que hace el algoritmo cuando la arista va hacia un vértice que sigue en la pila. Lo que está mal es a quiénes se les permite entrar por ahí.",
        8: "La comparación low[u] == d[u] decide cuándo u es raíz de un componente y está igual en las dos versiones; el problema es que low[u] llega más bajo de lo que debía.",
        3: "La condición d[v] == 0 separa los sucesores nuevos de los ya descubiertos, y está igual en las dos versiones.",
        5: "El mínimo con low[v] al volver del hijo es el mismo en las dos versiones. Mire la rama de los vértices ya descubiertos."
      },
      defecto: "Esa línea es igual a la de la versión correcta. Compare los low de la tabla: el primero que baja de más es el de un vértice con una flecha hacia uno ya descubierto.",
      explicacion: function (mala, buena) {
        return "Con <code>d[v] != 0</code> entra cualquier vértice ya descubierto, esté o no en la pila. La flecha 3 → 1 apunta al 1, cuyo componente {1, 2} ya se cerró y salió de la pila: no hay camino de vuelta, y esa flecha no debe bajar low[3]. " +
          "Sin el filtro, low[3] baja a d[1] = " + mala.d[1] + ", el 3 deja de ser raíz de su propio componente y se lleva consigo al 0. " +
          "La versión devuelve " + textoComponentes(mala.componentes) + " y los componentes son " + textoComponentes(buena.componentes) + ".";
      }
    }
  ];

  function textoLista(l) { return l.length === 0 ? "ninguno" : "{" + l.join(", ") + "}"; }
  function textoPuentes(p) {
    return p.length === 0 ? "ningún puente" : p.map(function (x) { return "(" + x[0] + ", " + x[1] + ")"; }).join(", ");
  }
  function textoComponentes(cs) {
    return cs.map(function (c) { return "{" + c.join(", ") + "}"; }).join(", ");
  }

  /* Corre un caso: la version mala y la correcta. */
  function correr(caso) {
    var G;
    if (caso.clave === "tarjan") {
      G = [[], [], [], [], []];
      var i = 0;
      while (i < caso.aristas.length) { G[caso.aristas[i][0]].push(caso.aristas[i][1]); i = i + 1; }
      return { mala: tarjan(G, { dNoCero: true }), buena: tarjan(G, {}) };
    }
    G = construir(caso.n, caso.aristas);
    var opciones = caso.clave === "padre" ? { sinPadre: true } : { puenteMayorIgual: true };
    return { mala: cortes(G, opciones), buena: cortes(G, {}) };
  }

  /* La linea que el estudiante senala: verdadero si es la cambiada. */
  function evaluar(caso, indice) {
    var cambiada = -1, k = 0;
    while (k < caso.codigo.length) { if (caso.codigo[k].cambiada) { cambiada = k; } k = k + 1; }
    var res = correr(caso);
    var ok = indice === cambiada;
    var msg;
    if (ok) {
      msg = "Correcto: esa es la línea cambiada. La versión correcta dice <code>" + caso.lineaBuena.trim() + "</code>. " + caso.explicacion(res.mala, res.buena);
    } else if (caso.mensajesLinea[indice] !== undefined) {
      msg = caso.mensajesLinea[indice];
    } else {
      msg = caso.defecto;
    }
    return { ok: ok, msg: msg, cambiada: cambiada };
  }

  return {
    casos: CASOS, construir: construir, cortes: cortes, tarjan: tarjan,
    correr: correr, evaluar: evaluar,
    textoLista: textoLista, textoPuentes: textoPuentes, textoComponentes: textoComponentes
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var corrido = {};

    function escapar(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

    function dibujar(caso, caja) {
      var pos = caso.pos, n = caso.n, ancho = 460, alto = 170, r = 15;
      var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
      while (i < n) {
        if (pos[i][0] < minX) { minX = pos[i][0]; }
        if (pos[i][0] > maxX) { maxX = pos[i][0]; }
        if (pos[i][1] < minY) { minY = pos[i][1]; }
        if (pos[i][1] > maxY) { maxY = pos[i][1]; }
        i = i + 1;
      }
      var mx = 34, my = 26;
      var esc = Math.min((ancho - 2 * mx) / (maxX - minX), (alto - 2 * my) / (maxY - minY));
      var ox = (ancho - esc * (maxX - minX)) / 2, oy = (alto - esc * (maxY - minY)) / 2;
      function X(k) { return ox + (pos[k][0] - minX) * esc; }
      function Y(k) { return oy + (maxY - pos[k][1]) * esc; }
      function existe(a, b) {
        var j = 0, hay = false;
        while (j < caso.aristas.length) { if (caso.aristas[j][0] === a && caso.aristas[j][1] === b) { hay = true; } j = j + 1; }
        return hay;
      }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:480px'>";
      if (caso.dirigido) {
        svg += "<defs><marker id='fe' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker></defs>";
      }
      var e = 0;
      while (e < caso.aristas.length) {
        var u = caso.aristas[e][0], v = caso.aristas[e][1];
        var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
        var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
        if (!caso.dirigido) {
          svg += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 + "' stroke='#9aa3ad' stroke-width='2'/>";
        } else if (existe(v, u)) {
          var cx = (x1 + x2) / 2 - dy / dd * 22, cy = (y1 + y2) / 2 + dx / dd * 22;
          var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
          var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
          svg += "<path d='M" + (x1 + (cx - x1) / l1 * (r + 1)) + "," + (y1 + (cy - y1) / l1 * (r + 1)) +
                 " Q" + cx + "," + cy + " " + (x2 + (cx - x2) / l2 * (r + 3)) + "," + (y2 + (cy - y2) / l2 * (r + 3)) +
                 "' fill='none' stroke='#6b7280' stroke-width='1.8' marker-end='url(#fe)'/>";
        } else {
          svg += "<line x1='" + (x1 + dx / dd * (r + 1)) + "' y1='" + (y1 + dy / dd * (r + 1)) +
                 "' x2='" + (x2 - dx / dd * (r + 3)) + "' y2='" + (y2 - dy / dd * (r + 3)) +
                 "' stroke='#6b7280' stroke-width='1.8' marker-end='url(#fe)'/>";
        }
        e = e + 1;
      }
      i = 0;
      while (i < n) {
        svg += "<circle cx='" + X(i) + "' cy='" + Y(i) + "' r='" + r + "' fill='#ffffff' stroke='#9aa3ad' stroke-width='2.2'/>";
        svg += "<text x='" + X(i) + "' y='" + (Y(i) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + i + "</text>";
        i = i + 1;
      }
      svg += "</svg>";
      caja.innerHTML = svg;
    }

    function listaAristas(caso) {
      var flecha = caso.dirigido ? " → " : "–";
      return caso.aristas.map(function (a) { return a[0] + flecha + a[1]; }).join(", ");
    }

    function armar() {
      var raiz = document.getElementById("casos");
      var html = "", c = 0;
      while (c < EJERCICIO.casos.length) {
        var caso = EJERCICIO.casos[c];
        html += "<div class='carta caso' data-caso='" + c + "'><h2>" + caso.titulo + "</h2>";
        html += "<div class='grafo-caso'></div>";
        html += "<p class='nota' style='margin-top:0'>" + (caso.dirigido ? "Grafo dirigido" : "Grafo no dirigido") + " de " + caso.n +
                " vértices: " + listaAristas(caso) + ".</p>";
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
        carta.querySelector(".btn-correr").addEventListener("click", function () { mostrarCorrida(carta, caso, idx); });
        Array.prototype.forEach.call(carta.querySelectorAll(".lin"), function (b) {
          b.addEventListener("click", function () {
            var v = carta.querySelector(".veredicto");
            if (!corrido[idx]) {
              v.className = "veredicto mal";
              v.textContent = "Corra primero la versión y compare con la correcta; la línea se señala mirando qué cambió en la salida.";
              return;
            }
            var res = EJERCICIO.evaluar(caso, parseInt(b.getAttribute("data-linea"), 10));
            v.className = res.ok ? "veredicto bien" : "veredicto mal";
            v.innerHTML = res.msg;
          });
        });
      });
    }

    function celda(a, b) {
      return a === b ? "<td>" + b + "</td>" : "<td style='background:var(--rojo-suave);color:var(--rojo);font-weight:700'>" + b + "</td>";
    }

    function mostrarCorrida(carta, caso, idx) {
      corrido[idx] = true;
      var res = EJERCICIO.correr(caso), n = caso.n, v;
      var html = "";
      if (caso.clave === "tarjan") {
        html += "<p><b>Devuelve esta versión:</b> <code>" + EJERCICIO.textoComponentes(res.mala.componentes) + "</code><br>" +
                "<b>Devuelve la correcta:</b> <code>" + EJERCICIO.textoComponentes(res.buena.componentes) + "</code></p>";
      } else {
        html += "<p><b>Devuelve esta versión:</b> puntos de articulación <code>" + EJERCICIO.textoLista(res.mala.articulaciones) +
                "</code>, puentes <code>" + EJERCICIO.textoPuentes(res.mala.puentes) + "</code><br>" +
                "<b>Devuelve la correcta:</b> puntos de articulación <code>" + EJERCICIO.textoLista(res.buena.articulaciones) +
                "</code>, puentes <code>" + EJERCICIO.textoPuentes(res.buena.puentes) + "</code></p>";
      }
      html += "<div class='envoltura-tabla'><table><thead><tr><th>Vértice</th>";
      for (v = 0; v < n; v = v + 1) { html += "<th>" + v + "</th>"; }
      html += "</tr></thead><tbody><tr><th>d</th>";
      for (v = 0; v < n; v = v + 1) { html += "<td>" + res.buena.d[v] + "</td>"; }
      html += "</tr><tr><th>low, correcta</th>";
      for (v = 0; v < n; v = v + 1) { html += "<td>" + res.buena.low[v] + "</td>"; }
      html += "</tr><tr><th>low, esta versión</th>";
      for (v = 0; v < n; v = v + 1) { html += celda(res.buena.low[v], res.mala.low[v]); }
      html += "</tr></tbody></table></div>";
      var s = carta.querySelector(".salida");
      s.style.display = "block";
      s.innerHTML = html;
    }

    armar();
  })();
}
