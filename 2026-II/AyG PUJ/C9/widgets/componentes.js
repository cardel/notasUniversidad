/* Ejercicio interactivo: los componentes conexos con los tres recorridos de
   la clase 9. La simulacion reproduce componentes_conexos,
   componentes_conexos_con_pila y componentes_conexos_bfs, linea por linea. */
var EJERCICIO = (function () {
  var CODIGOS = {
    recursiva: [
      { txt: "def cc_dfs_aux(grafo, v, visitado, actual):",       num: null },
      { txt: "    actual.append(v)",                               num: 1, bloque: 1 },
      { txt: "    visitado[v] = True",                             num: 2, bloque: 1 },
      { txt: "    for u in grafo[v]:",                             num: 3, bloque: 1 },
      { txt: "        if not visitado[u]:",                        num: 4, bloque: 1 },
      { txt: "            cc_dfs_aux(grafo, u, visitado, actual)", num: 5, bloque: 1 },
      { txt: "",                                                   num: null },
      { txt: "def componentes_conexos(grafo):",                    num: null },
      { txt: "    n = len(grafo)",                                 num: 6 },
      { txt: "    visitado = [False] * n",                         num: 7 },
      { txt: "    componentes = []",                               num: 8 },
      { txt: "    for v in grafo:",                                num: 9,  bloque: 2 },
      { txt: "        if not visitado[v]:",                        num: 10, bloque: 2 },
      { txt: "            actual = []",                            num: 11, bloque: 2 },
      { txt: "            cc_dfs_aux(grafo, v, visitado, actual)", num: 12, bloque: 2 },
      { txt: "            componentes.append(actual)",             num: 13, bloque: 2 },
      { txt: "    return componentes",                             num: 14 }
    ],
    pila: [
      { txt: "def cc_dfs_aux_con_pila(grafo, v, visitado, actual):", num: null },
      { txt: "    pila = [v]",                                       num: 1, bloque: 1 },
      { txt: "    visitado[v] = True",                               num: 2, bloque: 1 },
      { txt: "    while len(pila) > 0:",                             num: 3, bloque: 1 },
      { txt: "        w = pila.pop()",                               num: 4, bloque: 1 },
      { txt: "        actual.append(w)",                             num: 5, bloque: 1 },
      { txt: "        for u in grafo[w]:",                           num: 6, bloque: 1 },
      { txt: "            if not visitado[u]:",                      num: 7, bloque: 1 },
      { txt: "                visitado[u] = True",                   num: 8, bloque: 1 },
      { txt: "                pila.append(u)",                       num: 9, bloque: 1 },
      { txt: "",                                                     num: null },
      { txt: "def componentes_conexos_con_pila(grafo):",             num: null },
      { txt: "    n = len(grafo)",                                   num: 10 },
      { txt: "    visitado = [False] * n",                           num: 11 },
      { txt: "    componentes = []",                                 num: 12 },
      { txt: "    for v in grafo:",                                  num: 13, bloque: 2 },
      { txt: "        if not visitado[v]:",                          num: 14, bloque: 2 },
      { txt: "            actual = []",                              num: 15, bloque: 2 },
      { txt: "            cc_dfs_aux_con_pila(grafo, v, visitado, actual)", num: 16, bloque: 2 },
      { txt: "            componentes.append(actual)",               num: 17, bloque: 2 },
      { txt: "    return componentes",                               num: 18 }
    ],
    amplitud: [
      { txt: "def cc_bfs_aux(grafo, v, visitado, actual):", num: null },
      { txt: "    cola = [v]",                               num: 1, bloque: 1 },
      { txt: "    cabeza = 0",                               num: 2, bloque: 1 },
      { txt: "    visitado[v] = True",                       num: 3, bloque: 1 },
      { txt: "    actual.append(v)",                         num: 4, bloque: 1 },
      { txt: "    while cabeza < len(cola):",                num: 5, bloque: 1 },
      { txt: "        w = cola[cabeza]",                     num: 6, bloque: 1 },
      { txt: "        cabeza = cabeza + 1",                  num: 7, bloque: 1 },
      { txt: "        for u in grafo[w]:",                   num: 8, bloque: 1 },
      { txt: "            if not visitado[u]:",              num: 9, bloque: 1 },
      { txt: "                cola.append(u)",               num: 10, bloque: 1 },
      { txt: "                visitado[u] = True",           num: 11, bloque: 1 },
      { txt: "                actual.append(u)",             num: 12, bloque: 1 },
      { txt: "",                                             num: null },
      { txt: "def componentes_conexos_bfs(grafo):",          num: null },
      { txt: "    n = len(grafo)",                           num: 13 },
      { txt: "    visitado = [False] * n",                   num: 14 },
      { txt: "    componentes = []",                         num: 15 },
      { txt: "    for v in grafo:",                          num: 16, bloque: 2 },
      { txt: "        if not visitado[v]:",                  num: 17, bloque: 2 },
      { txt: "            actual = []",                      num: 18, bloque: 2 },
      { txt: "            cc_bfs_aux(grafo, v, visitado, actual)", num: 19, bloque: 2 },
      { txt: "            componentes.append(actual)",       num: 20, bloque: 2 },
      { txt: "    return componentes",                       num: 21 }
    ]
  };

  function codigoDe(version) { return CODIGOS[version]; }

  function simular(params) {
    var G = params.G, version = params.version, n = G.length;
    var pasos = [], visitado = [], componentes = [], actual = null;
    var v = null, u = null, w = null, estructura = [], rotuloEstructura = "";
    var i = 0;
    while (i < n) { visitado.push(false); i = i + 1; }

    function snap(linea, extra) {
      var q = {
        linea: linea,
        v: v === null ? "–" : v,
        u: u === null ? "–" : u,
        w: w === null ? "–" : w,
        visitado: visitado.slice(),
        actual: actual === null ? null : actual.slice(),
        componentes: componentes.map(function (c) { return c.slice(); }),
        estructura: estructura.slice(),
        rotuloEstructura: rotuloEstructura
      };
      if (extra) { var x; for (x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }

    /* Los tres cuerpos auxiliares, con la numeracion de su listado. */
    function auxRecursiva(p) {
      actual.push(p); snap(1, { agrega: p });
      visitado[p] = true; snap(2, { marca: p });
      var j = 0;
      while (j < G[p].length) {
        v = p; u = G[p][j];
        snap(3, { mira: [p, u] });
        snap(4, { mira: [p, u] });
        if (!visitado[u]) {
          snap(5, { baja: [p, u] });
          auxRecursiva(u);
          v = p; u = G[p][j];
        }
        j = j + 1;
      }
      v = p; u = null;
    }

    function auxPila(p) {
      rotuloEstructura = "Pila";
      estructura = [p]; snap(1);
      visitado[p] = true; snap(2, { marca: p });
      var sigue = true;
      while (sigue) {
        snap(3);
        if (estructura.length > 0) {
          w = estructura.pop(); snap(4, { saca: w });
          actual.push(w); snap(5, { agrega: w });
          var j = 0;
          while (j < G[w].length) {
            u = G[w][j];
            snap(6, { mira: [w, u] });
            snap(7, { mira: [w, u] });
            if (!visitado[u]) {
              visitado[u] = true; snap(8, { marca: u });
              estructura.push(u); snap(9, { empuja: u });
            }
            j = j + 1;
          }
          u = null;
        } else { sigue = false; }
      }
      w = null;
    }

    function auxAmplitud(p) {
      rotuloEstructura = "Cola";
      estructura = [p]; snap(1);
      var cabeza = 0; snap(2);
      visitado[p] = true; snap(3, { marca: p });
      actual.push(p); snap(4, { agrega: p });
      var sigue = true;
      while (sigue) {
        snap(5);
        if (cabeza < estructura.length) {
          w = estructura[cabeza]; snap(6, { saca: w });
          cabeza = cabeza + 1; snap(7);
          var j = 0;
          while (j < G[w].length) {
            u = G[w][j];
            snap(8, { mira: [w, u] });
            snap(9, { mira: [w, u] });
            if (!visitado[u]) {
              estructura.push(u); snap(10, { empuja: u });
              visitado[u] = true; snap(11, { marca: u });
              actual.push(u); snap(12, { agrega: u });
            }
            j = j + 1;
          }
          u = null;
        } else { sigue = false; }
      }
      w = null;
    }

    var base = { recursiva: 6, pila: 10, amplitud: 13 }[version];
    snap(base); snap(base + 1); snap(base + 2);
    var k = 0;
    while (k < n) {
      v = k; u = null; w = null;
      snap(base + 3);
      snap(base + 4);
      if (!visitado[k]) {
        actual = []; estructura = [];
        snap(base + 5, { abre: k });
        snap(base + 6, { abre: k });
        if (version === "recursiva") { auxRecursiva(k); }
        if (version === "pila") { auxPila(k); }
        if (version === "amplitud") { auxAmplitud(k); }
        v = k; u = null; w = null;
        componentes.push(actual.slice());
        snap(base + 7, { cierra: componentes.length, desde: k, lista: actual.slice() });
        actual = null; estructura = [];
      }
      k = k + 1;
    }
    v = null;
    snap(base + 8, { terminado: true });
    return pasos;
  }

  /* Las tres versiones sin instrumentacion, para comparar. */
  function componentesDe(G, version) {
    var n = G.length, visitado = [], componentes = [], i = 0, j;
    while (i < n) { visitado.push(false); i = i + 1; }
    function rec(p, actual) {
      actual.push(p); visitado[p] = true;
      var t = 0;
      while (t < G[p].length) { if (!visitado[G[p][t]]) { rec(G[p][t], actual); } t = t + 1; }
    }
    i = 0;
    while (i < n) {
      if (!visitado[i]) {
        var actual = [];
        if (version === "recursiva") { rec(i, actual); }
        if (version === "pila") {
          var pila = [i]; visitado[i] = true;
          while (pila.length > 0) {
            var w = pila.pop(); actual.push(w);
            j = 0;
            while (j < G[w].length) {
              if (!visitado[G[w][j]]) { visitado[G[w][j]] = true; pila.push(G[w][j]); }
              j = j + 1;
            }
          }
        }
        if (version === "amplitud") {
          var cola = [i], cabeza = 0; visitado[i] = true; actual.push(i);
          while (cabeza < cola.length) {
            var z = cola[cabeza]; cabeza = cabeza + 1;
            j = 0;
            while (j < G[z].length) {
              if (!visitado[G[z][j]]) { cola.push(G[z][j]); visitado[G[z][j]] = true; actual.push(G[z][j]); }
              j = j + 1;
            }
          }
        }
        componentes.push(actual);
      }
      i = i + 1;
    }
    return componentes;
  }

  return { codigoDe: codigoDe, simular: simular, componentesDe: componentesDe };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function noDirigido(n, aristas) {
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

    var PRESETS = [
      { G: noDirigido(9, [[0, 1], [1, 4], [4, 0], [4, 6], [6, 8], [2, 5], [5, 7]]),
        pos: [[0.0, 2.6], [1.2, 3.1], [0.2, 0.5], [4.2, 1.2], [1.0, 1.8], [1.4, 0.2], [2.2, 2.6], [2.5, 0.6], [3.3, 3.0]] },
      { G: noDirigido(6, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [2, 5]]),
        pos: [[0.0, 1.6], [0.8, 2.8], [2.2, 2.8], [3.0, 1.6], [2.2, 0.4], [0.8, 0.4]] },
      { G: noDirigido(10, [[0, 5], [5, 9], [9, 0], [1, 6], [2, 7], [7, 4], [4, 8], [8, 2]]),
        pos: [[0.0, 2.8], [2.2, 3.1], [0.2, 0.6], [4.2, 1.8], [2.4, 0.5], [1.0, 3.2], [3.2, 3.1], [1.3, 0.2], [1.5, 1.3], [0.8, 1.9]] }
    ];
    var COLORES = [
      { relleno: "#e7f2e8", borde: "#2e7d32" },
      { relleno: "#fdf1dc", borde: "#e8a13d" },
      { relleno: "#e3edf8", borde: "#1f5fa8" },
      { relleno: "#fbe9e7", borde: "#b3261e" },
      { relleno: "#efe4f7", borde: "#6b3fa0" }
    ];
    var presetActual = 0;
    var version = "recursiva";

    function G() { return PRESETS[presetActual].G; }
    function paramsActuales() {
      return { G: PRESETS[presetActual].G, pos: PRESETS[presetActual].pos, version: version };
    }

    function dibujar(params, a) {
      var Gr = params.G, pos = params.pos, n = Gr.length;
      var ancho = 470, alto = 260, r = 16;
      var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
      while (i < n) {
        if (pos[i][0] < minX) { minX = pos[i][0]; }
        if (pos[i][0] > maxX) { maxX = pos[i][0]; }
        if (pos[i][1] < minY) { minY = pos[i][1]; }
        if (pos[i][1] > maxY) { maxY = pos[i][1]; }
        i = i + 1;
      }
      var mx = r + 18, my = r + 16;
      function X(k) { return mx + (pos[k][0] - minX) / (maxX - minX) * (ancho - 2 * mx); }
      function Y(k) { return my + (maxY - pos[k][1]) / (maxY - minY) * (alto - 2 * my); }

      /* A que componente pertenece cada vertice segun lo que va del recorrido. */
      var comp = [];
      i = 0;
      while (i < n) { comp.push(-1); i = i + 1; }
      if (a) {
        var c = 0;
        while (c < a.componentes.length) {
          var t = 0;
          while (t < a.componentes[c].length) { comp[a.componentes[c][t]] = c; t = t + 1; }
          c = c + 1;
        }
        if (a.actual) {
          var s = 0;
          while (s < a.actual.length) { comp[a.actual[s]] = a.componentes.length; s = s + 1; }
        }
      }

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:520px'>";
      var u = 0, j;
      while (u < n) {
        j = 0;
        while (j < Gr[u].length) {
          var v = Gr[u][j];
          if (u < v) {
            var mirando = a && a.mira && ((a.mira[0] === u && a.mira[1] === v) || (a.mira[0] === v && a.mira[1] === u));
            var bajando = a && a.baja && ((a.baja[0] === u && a.baja[1] === v) || (a.baja[0] === v && a.baja[1] === u));
            var trazo = bajando ? "#2e7d32" : (mirando ? "#1f5fa8" : "#9aa3ad");
            svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) +
                   "' stroke='" + trazo + "' stroke-width='" + ((mirando || bajando) ? 3 : 1.7) + "'/>";
          }
          j = j + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        var col = comp[u] >= 0 ? COLORES[comp[u] % COLORES.length] : { relleno: "#ffffff", borde: "#d8dee6" };
        var foco = a && ((a.w !== "–" && a.w === u) || (a.w === "–" && a.v === u && a.actual !== null));
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='" + r + "' fill='" + col.relleno +
               "' stroke='" + (foco ? "#24292f" : col.borde) + "' stroke-width='" + (foco ? 3.5 : 2.2) + "'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + u + "</text>";
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(e.params, a);
      document.getElementById("ver-actual").textContent =
        a && a.actual ? "[" + a.actual.join(", ") + "]" : "(ninguno abierto)";
      document.getElementById("ver-estructura").textContent =
        a && a.estructura.length > 0 ? a.estructura.join(", ") : "vacía";
      document.getElementById("rot-estructura").textContent =
        a && a.rotuloEstructura !== "" ? a.rotuloEstructura : (version === "amplitud" ? "Cola" : (version === "pila" ? "Pila" : "Pendientes"));
      document.getElementById("ver-componentes").textContent =
        a && a.componentes.length > 0
          ? "[" + a.componentes.map(function (c) { return "[" + c.join(", ") + "]"; }).join(", ") + "]"
          : "[ ]";

      var filas = "", m;
      for (m = 0; m < e.k; m = m + 1) {
        var q = e.pasos[m];
        if (q.cierra !== undefined) {
          filas = filas + "<tr><td>" + q.cierra + "</td><td>" + q.desde + "</td><td>" +
                  q.lista.join(", ") + "</td><td>" + q.lista.length + "</td></tr>";
        }
      }
      document.getElementById("cuerpo-traza").innerHTML = filas !== "" ? filas :
        "<tr><td colspan='4' class='pend'>Ejecute: cada componente terminado agrega una fila.</td></tr>";
    }

    function arrancar() {
      var ids = ["btn-paso", "btn-auto", "btn-fin", "btn-reiniciar"], t = 0;
      while (t < ids.length) {
        var b = document.getElementById(ids[t]);
        b.parentNode.replaceChild(b.cloneNode(true), b);
        t = t + 1;
      }
      Motor.iniciar({
        codigo: EJERCICIO.codigoDe(version), simular: EJERCICIO.simular,
        chips: [{ campo: "v", rotulo: "v" }, { campo: "w", rotulo: "w" }, { campo: "u", rotulo: "u" }],
        paramsIniciales: paramsActuales(), alPintar: alPintar
      });
    }

    arrancar();

    Motor.prediccionNumerica(function (valor, params) {
      var lista = EJERCICIO.componentesDe(params.G, "recursiva");
      var n = params.G.length;
      var pintados = lista.map(function (c) {
        return "{" + c.slice().sort(function (x, y) { return x - y; }).join(", ") + "}";
      }).join(", ");
      if (valor === lista.length) {
        return { ok: true, msg: "Correcto: " + lista.length + ". " + pintados + ". Es el número de veces que se ejecuta la línea que abre un componente nuevo." };
      }
      if (valor === n) {
        return { ok: false, msg: "Ese es el número de vértices. Solo abriría un componente por vértice si el grafo no tuviera ninguna arista." };
      }
      if (valor === 1) {
        return { ok: false, msg: "Con un solo componente, el recorrido que arranca en el 0 tendría que tocar los " + n + " vértices. Cuente cuántos alcanza de verdad y siga con el primero que quede." };
      }
      return { ok: false, msg: "No coincide. Arranque en el 0, marque todo lo que alcanza, y repita desde el vértice de número más bajo que quedó sin marcar; cada arranque es un componente." };
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

    Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        version = btn.getAttribute("data-version");
        arrancar();
      });
    });

    /* Los tres repartos, para la tarjeta de comparacion. */
    function pintar(lista) {
      return "[" + lista.map(function (c) { return "[" + c.join(", ") + "]"; }).join(", ") + "]";
    }
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-comparar button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        var v = document.getElementById("veredicto-comparar");
        var rec = EJERCICIO.componentesDe(G(), "recursiva");
        var pil = EJERCICIO.componentesDe(G(), "pila");
        var amp = EJERCICIO.componentesDe(G(), "amplitud");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.innerHTML = "Correcto. Sobre el grafo que está a la vista: recursiva " + pintar(rec) +
            ", con pila " + pintar(pil) + ", amplitud " + pintar(amp) +
            ". Los mismos vértices en los mismos grupos; lo que cambia es el orden dentro de cada grupo, porque la pila entrega el último vecino que entró.";
        } else if (op === "reparto") {
          v.className = "veredicto mal";
          v.innerHTML = "El reparto no cambia: ninguna arista sale de un componente, así que un recorrido que arranca adentro se queda adentro, entregue por donde entregue lo pendiente. Compare " +
            pintar(rec) + " con " + pintar(pil) + ".";
        } else {
          v.className = "veredicto mal";
          v.innerHTML = "El número de componentes tampoco cambia: lo fija el ciclo que arranca un recorrido nuevo por cada vértice sin marcar, y los tres lo tienen igual. Los tres devuelven " +
            rec.length + ".";
        }
      });
    });
  })();
}
