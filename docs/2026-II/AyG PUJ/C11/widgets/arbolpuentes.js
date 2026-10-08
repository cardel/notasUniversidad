/* Ejercicio interactivo: el arbol de puentes paso a paso (clase 11).
   Las tres pasadas de contraer: los puentes con Tarjan, el etiquetado que no
   cruza puentes y la contraccion. La simulacion reproduce etiquetar,
   componentes y arbol_de_puentes de arbol_de_puentes.py, en la version
   recursiva y en la de pila explicita. */
var EJERCICIO = (function () {
  var GRAFOS = [
    { boton: "Nueve vértices, dos puentes",
      texto: "Tres plazas de un pueblo, cada una con su manzana de calles, unidas en fila por dos callejones de un solo carril.",
      n: 9,
      aristas: [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [3, 5], [4, 5], [5, 6], [6, 7], [6, 8], [7, 8]],
      pos: [[0.0, 1.8], [0.0, 0.2], [1.1, 1.0], [2.3, 1.6], [2.3, 0.2], [3.4, 1.0], [4.6, 1.0], [5.7, 1.8], [5.7, 0.2]],
      pregunta: [1, 7] },
    { boton: "Once vértices, tres puentes",
      texto: "Una isla con un anillo de carreteras y tres penínsulas que cuelgan de él, cada una por un solo puente.",
      n: 11,
      aristas: [[0, 1], [0, 3], [0, 4], [1, 2], [2, 3], [2, 7], [3, 10], [4, 5], [4, 6], [5, 6], [7, 8], [7, 9], [8, 9]],
      pos: [[1.6, 1.4], [1.6, 2.6], [2.9, 2.6], [2.9, 1.4], [0.3, 1.4], [-0.9, 2.1], [-0.9, 0.7], [4.1, 3.3], [5.3, 3.9], [5.3, 2.7], [4.1, 0.9]],
      pregunta: [5, 10] },
    { boton: "Doce vértices, cuatro puentes",
      texto: "Una red de agua: un anillo, un tanque intermedio que no pertenece a ningún ciclo, y dos ramales que terminan en punta.",
      n: 12,
      aristas: [[0, 1], [0, 3], [1, 2], [1, 4], [2, 3], [3, 8], [4, 5], [5, 6], [5, 7], [6, 7], [6, 11], [8, 9], [8, 10], [9, 10]],
      pos: [[1.0, 2.6], [2.2, 2.6], [2.2, 3.8], [1.0, 3.8], [3.4, 2.6], [4.6, 2.6], [5.8, 3.2], [5.8, 1.9], [0.0, 4.6], [-1.2, 5.2], [-1.2, 4.0], [7.0, 3.2]],
      pregunta: [9, 11] }
  ];

  /* ---- el codigo que se traza ---- */
  var RECURSIVA = [
    { txt: "def etiquetar(G, u, numero, es_puente, comp):", num: null },
    { txt: "    # No cruza puentes: lo que alcanza es un componente.", num: null },
    { txt: "    comp[u] = numero",                               num: 1, bloque: 1 },
    { txt: "    for v, i in G[u]:",                              num: 2, bloque: 1 },
    { txt: "        if comp[v] == -1 and i not in es_puente:",    num: 3, bloque: 1 },
    { txt: "            etiquetar(G, v, numero, es_puente, comp)", num: 4, bloque: 1 },
    { txt: "",                                                   num: null },
    { txt: "def componentes(G, es_puente):",                     num: null },
    { txt: "    # comp[v]: el componente de v, y el total de componentes.", num: null },
    { txt: "    comp = {}",                                      num: 5, bloque: 2 },
    { txt: "    for u in G:",                                    num: 6, bloque: 2 },
    { txt: "        comp[u] = -1",                               num: 7, bloque: 2 },
    { txt: "    total = 0",                                      num: 8, bloque: 2 },
    { txt: "    for u in G:",                                    num: 9, bloque: 2 },
    { txt: "        if comp[u] == -1:",                          num: 10, bloque: 2 },
    { txt: "            etiquetar(G, u, total, es_puente, comp)", num: 11, bloque: 2 },
    { txt: "            total = total + 1",                      num: 12, bloque: 2 },
    { txt: "    return comp, total",                             num: 13, bloque: 2 },
    { txt: "",                                                   num: null },
    { txt: "def arbol_de_puentes(aristas, es_puente, comp, total):", num: null },
    { txt: "    # Un nodo por componente, una arista por puente.", num: null },
    { txt: "    T = {}",                                         num: 14, bloque: 3 },
    { txt: "    for c in range(total):",                         num: 15, bloque: 3 },
    { txt: "        T[c] = []",                                  num: 16, bloque: 3 },
    { txt: "    for i in sorted(es_puente):",                    num: 17, bloque: 3 },
    { txt: "        a, b = aristas[i]",                          num: 18, bloque: 3 },
    { txt: "        T[comp[a]].append(comp[b])",                 num: 19, bloque: 3 },
    { txt: "        T[comp[b]].append(comp[a])",                 num: 20, bloque: 3 },
    { txt: "    return T",                                       num: 21, bloque: 3 }
  ];

  var PILA = [
    { txt: "def etiquetar_con_pila(G, s, numero, es_puente, comp):", num: null },
    { txt: "    comp[s] = numero",                                num: 1, bloque: 1 },
    { txt: "    pila = [s]",                                      num: 2, bloque: 1 },
    { txt: "    while len(pila) > 0:",                             num: 3, bloque: 1 },
    { txt: "        u = pila.pop()",                               num: 4, bloque: 1 },
    { txt: "        for v, i in G[u]:",                            num: 5, bloque: 1 },
    { txt: "            if comp[v] == -1 and i not in es_puente:",  num: 6, bloque: 1 },
    { txt: "                comp[v] = numero",                     num: 7, bloque: 1 },
    { txt: "                pila.append(v)",                       num: 8, bloque: 1 },
    { txt: "",                                                     num: null },
    { txt: "def componentes_con_pila(G, es_puente):",              num: null },
    { txt: "    comp = {}",                                        num: 9, bloque: 2 },
    { txt: "    for u in G:",                                      num: 10, bloque: 2 },
    { txt: "        comp[u] = -1",                                 num: 11, bloque: 2 },
    { txt: "    total = 0",                                        num: 12, bloque: 2 },
    { txt: "    for u in G:",                                      num: 13, bloque: 2 },
    { txt: "        if comp[u] == -1:",                            num: 14, bloque: 2 },
    { txt: "            etiquetar_con_pila(G, u, total, es_puente, comp)", num: 15, bloque: 2 },
    { txt: "            total = total + 1",                        num: 16, bloque: 2 },
    { txt: "    return comp, total",                               num: 17, bloque: 2 },
    { txt: "",                                                     num: null },
    { txt: "def arbol_de_puentes(aristas, es_puente, comp, total):", num: null },
    { txt: "    # Un nodo por componente, una arista por puente.", num: null },
    { txt: "    T = {}",                                           num: 18, bloque: 3 },
    { txt: "    for c in range(total):",                           num: 19, bloque: 3 },
    { txt: "        T[c] = []",                                    num: 20, bloque: 3 },
    { txt: "    for i in sorted(es_puente):",                      num: 21, bloque: 3 },
    { txt: "        a, b = aristas[i]",                            num: 22, bloque: 3 },
    { txt: "        T[comp[a]].append(comp[b])",                   num: 23, bloque: 3 },
    { txt: "        T[comp[b]].append(comp[a])",                   num: 24, bloque: 3 },
    { txt: "    return T",                                         num: 25, bloque: 3 }
  ];

  function codigoDe(version) { return version === "recursiva" ? RECURSIVA : PILA; }

  /* construir del deck: cada vecino viene con el identificador de su arista. */
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

  /* Primera pasada: puentes_aux, con lo que hace falta para explicar cada
     comparacion. */
  function puentes(n, aristas) {
    var G = construir(n, aristas);
    var d = [], low = [], padre = [], hijos = [], esPuente = [], arbol = [];
    var reloj = 0, i = 0;
    while (i < n) { d.push(0); low.push(0); padre.push(-1); hijos.push([]); i = i + 1; }
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
          padre[v] = u;
          hijos[u].push(v);
          arbol.push([u, v, idx]);
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
    return { G: G, d: d, low: low, padre: padre, hijos: hijos, arbol: arbol,
             esPuente: esPuente, puentes: lista };
  }

  /* Las tres pasadas seguidas, sin traza: lo que devuelve contraer. */
  function contraer(n, aristas) {
    var p = puentes(n, aristas), G = p.G;
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
            if (comp[v] === -1 && !p.esPuente[idx]) { comp[v] = total; pila.push(v); }
            j = j + 1;
          }
        }
        total = total + 1;
      }
      i = i + 1;
    }
    var T = [];
    i = 0;
    while (i < total) { T.push([]); i = i + 1; }
    i = 0;
    while (i < p.puentes.length) {
      var a = aristas[p.puentes[i]][0], b = aristas[p.puentes[i]][1];
      T[comp[a]].push(comp[b]);
      T[comp[b]].push(comp[a]);
      i = i + 1;
    }
    var miembros = [];
    i = 0;
    while (i < total) { miembros.push([]); i = i + 1; }
    i = 0;
    while (i < n) { miembros[comp[i]].push(i); i = i + 1; }
    return { analisis: p, comp: comp, total: total, T: T, miembros: miembros,
             puentes: p.puentes };
  }

  /* Distancia en el arbol de puentes: cuantos puentes hay que cruzar. */
  function distancia(T, a, b) {
    var dist = [], i = 0;
    while (i < T.length) { dist.push(-1); i = i + 1; }
    dist[a] = 0;
    var cola = [a], frente = 0;
    while (frente < cola.length) {
      var u = cola[frente];
      frente = frente + 1;
      var j = 0;
      while (j < T[u].length) {
        if (dist[T[u][j]] === -1) { dist[T[u][j]] = dist[u] + 1; cola.push(T[u][j]); }
        j = j + 1;
      }
    }
    return dist[b];
  }

  function hojas(T) {
    var l = [], i = 0;
    while (i < T.length) { if (T[i].length === 1) { l.push(i); } i = i + 1; }
    return l;
  }

  /* ---- la traza de las pasadas dos y tres ---- */
  function simular(params) {
    var n = params.n, aristas = params.aristas, version = params.version;
    var p = puentes(n, aristas), G = p.G;
    var pasos = [], comp = [], total = null, T = null, pila = [], marcos = [];
    var loc = { u: null, v: null, i: null, numero: null, c: null, a: null, b: null };
    var k = 0;
    while (k < n) { comp.push(-1); k = k + 1; }

    function snap(linea, msg) {
      var fr = (version === "recursiva" && marcos.length > 0) ? marcos[marcos.length - 1] : loc;
      pasos.push({
        linea: linea,
        u: fr.u === undefined ? null : fr.u,
        v: fr.v === undefined ? null : fr.v,
        i: fr.i === undefined ? null : fr.i,
        numero: fr.numero === undefined ? null : fr.numero,
        c: loc.c, a: loc.a, b: loc.b,
        total: total,
        comp: comp.slice(),
        pila: pila.slice(),
        marcos: marcos.map(function (f) { return [f.u, f.numero]; }),
        T: T === null ? null : T.map(function (l) { return l.slice(); }),
        msg: msg || ""
      });
    }

    function textoVecino(u, v, idx) {
      var t;
      if (comp[v] !== -1) {
        t = "El vecino " + v + " ya tiene componente " + comp[v] + ": no se vuelve a etiquetar.";
      } else if (p.esPuente[idx]) {
        t = "La arista " + idx + " (" + u + "–" + v + ") es puente: el recorrido se detiene aquí. Cruzarla fundiría dos componentes en uno.";
      } else {
        t = "El vecino " + v + " no tiene componente y la arista " + idx + " no es puente: " + v + " entra al componente " + loc.numeroActivo + ".";
      }
      return t;
    }

    /* etiquetar recursiva, lineas 1 a 4. */
    function etiquetar(u, numero) {
      var fr = { u: u, numero: numero, v: null, i: null };
      marcos.push(fr);
      comp[u] = numero;
      snap(1, "comp[" + u + "] = " + numero + ".");
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j][0], idx = G[u][j][1];
        fr.v = v;
        fr.i = idx;
        snap(2);
        loc.numeroActivo = numero;
        snap(3, textoVecino(u, v, idx));
        if (comp[v] === -1 && !p.esPuente[idx]) {
          snap(4, "Se llama etiquetar sobre " + v + ".");
          etiquetar(v, numero);
          fr.v = v;
          fr.i = idx;
        }
        j = j + 1;
      }
      fr.v = null;
      fr.i = null;
      marcos.pop();
    }

    /* etiquetar_con_pila, lineas 1 a 8. */
    function etiquetarConPila(s, numero) {
      loc.u = null;
      loc.v = null;
      loc.i = null;
      loc.numero = numero;
      comp[s] = numero;
      snap(1, "comp[" + s + "] = " + numero + ".");
      pila = [s];
      snap(2, "La pila arranca con el " + s + ".");
      var seguir = true;
      while (seguir) {
        snap(3);
        if (pila.length === 0) {
          seguir = false;
        } else {
          var u = pila.pop();
          loc.u = u;
          snap(4, "Sale el " + u + " de la pila.");
          var j = 0;
          while (j < G[u].length) {
            var v = G[u][j][0], idx = G[u][j][1];
            loc.v = v;
            loc.i = idx;
            snap(5);
            loc.numeroActivo = numero;
            snap(6, textoVecino(u, v, idx));
            if (comp[v] === -1 && !p.esPuente[idx]) {
              comp[v] = numero;
              snap(7, "comp[" + v + "] = " + numero + ", antes de apilarlo: así nadie entra dos veces.");
              pila.push(v);
              snap(8, "Se apila el " + v + ".");
            }
            j = j + 1;
          }
          loc.v = null;
          loc.i = null;
        }
      }
    }

    var baseComp = version === "recursiva" ? 5 : 9;
    var baseArbol = version === "recursiva" ? 14 : 18;

    /* componentes, con el etiquetado que corresponda. */
    snap(baseComp, "Las aristas puente ya están marcadas: " +
      (p.puentes.length === 0 ? "este grafo no tiene ninguna."
        : p.puentes.map(function (x) { return x + " (" + aristas[x][0] + "–" + aristas[x][1] + ")"; }).join(", ") + "."));
    var u0 = 0;
    while (u0 < n) {
      loc.u = u0;
      snap(baseComp + 1);
      snap(baseComp + 2);
      u0 = u0 + 1;
    }
    loc.u = null;
    total = 0;
    snap(baseComp + 3);
    u0 = 0;
    while (u0 < n) {
      loc.u = u0;
      snap(baseComp + 4);
      snap(baseComp + 5, comp[u0] === -1
        ? "comp[" + u0 + "] sigue en -1: arranca un componente nuevo, el " + total + "."
        : "comp[" + u0 + "] ya es " + comp[u0] + ": un recorrido anterior lo alcanzó.");
      if (comp[u0] === -1) {
        snap(baseComp + 6);
        if (version === "recursiva") { etiquetar(u0, total); } else { etiquetarConPila(u0, total); }
        loc.u = u0;
        loc.v = null;
        loc.i = null;
        pila = [];
        total = total + 1;
        snap(baseComp + 7, "El componente " + (total - 1) + " quedó cerrado. total pasa a " + total + ".");
      }
      u0 = u0 + 1;
    }
    loc.u = null;
    snap(baseComp + 8, "Quedan " + total + (total === 1 ? " componente." : " componentes."));

    /* arbol_de_puentes. */
    T = [];
    snap(baseArbol, "Ahora la tercera pasada: un nodo por componente y una arista por puente.");
    var c = 0;
    while (c < total) {
      loc.c = c;
      snap(baseArbol + 1);
      T.push([]);
      snap(baseArbol + 2, "T[" + c + "] arranca vacío.");
      c = c + 1;
    }
    loc.c = null;
    var ordenados = p.puentes.slice();
    ordenados.sort(function (x, y) { return x - y; });
    var t = 0;
    while (t < ordenados.length) {
      loc.i = ordenados[t];
      snap(baseArbol + 3, "Toca el puente " + ordenados[t] + ".");
      loc.a = aristas[ordenados[t]][0];
      loc.b = aristas[ordenados[t]][1];
      snap(baseArbol + 4, "El puente " + ordenados[t] + " va de " + loc.a + " a " + loc.b + ".");
      T[comp[loc.a]].push(comp[loc.b]);
      snap(baseArbol + 5, "El nodo " + comp[loc.a] + " gana al " + comp[loc.b] + " como vecino.");
      T[comp[loc.b]].push(comp[loc.a]);
      snap(baseArbol + 6, "Y al revés: el nodo " + comp[loc.b] + " gana al " + comp[loc.a] + ".");
      t = t + 1;
    }
    loc.i = null;
    loc.a = null;
    loc.b = null;
    snap(baseArbol + 7, "El árbol quedó con " + total + (total === 1 ? " nodo y " : " nodos y ") +
      ordenados.length + (ordenados.length === 1 ? " arista." : " aristas."));
    return pasos;
  }

  /* Por que una arista es o no puente, para la tarjeta de marcarlas. */
  function explicarPuente(n, aristas, idx) {
    var p = puentes(n, aristas), texto;
    var deArbol = false, v = -1, w = -1, k = 0;
    while (k < p.arbol.length) {
      if (p.arbol[k][2] === idx) { deArbol = true; v = p.arbol[k][0]; w = p.arbol[k][1]; }
      k = k + 1;
    }
    if (!deArbol) {
      texto = "La arista " + aristas[idx][0] + "–" + aristas[idx][1] +
        " no es de árbol: es de retroceso y cierra un ciclo, así que no puede ser puente.";
    } else if (p.esPuente[idx]) {
      texto = "Arista de árbol con " + v + " padre de " + w + ": low[" + w + "] = " + p.low[w] +
        " > d[" + v + "] = " + p.d[v] + ". Nada del subárbol de " + w + " llega a " + v + " ni más arriba: es puente.";
    } else {
      texto = "Arista de árbol con " + v + " padre de " + w + ": low[" + w + "] = " + p.low[w] +
        (p.low[w] === p.d[v] ? " = " : " < ") + "d[" + v + "] = " + p.d[v] +
        ". El subárbol de " + w + " vuelve a " + v + " o más arriba, así que la arista está en un ciclo y no es puente.";
    }
    return texto;
  }

  return { grafos: GRAFOS, codigoDe: codigoDe, construir: construir,
           puentes: puentes, contraer: contraer, simular: simular,
           distancia: distancia, hojas: hojas, explicarPuente: explicarPuente };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var presetActual = 0, version = "pila";
    var R = null, marcas = [], etapa = 0;

    function g() { return EJERCICIO.grafos[presetActual]; }

    function paramsActuales() {
      var p = g();
      return { n: p.n, aristas: p.aristas, pos: p.pos, version: version };
    }

    function trazarGrafo(caja, a) {
      var p = g(), n = p.n, pos = p.pos;
      var ancho = 520, alto = 270, r = 16;
      var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
      while (i < n) {
        if (pos[i][0] < minX) { minX = pos[i][0]; }
        if (pos[i][0] > maxX) { maxX = pos[i][0]; }
        if (pos[i][1] < minY) { minY = pos[i][1]; }
        if (pos[i][1] > maxY) { maxY = pos[i][1]; }
        i = i + 1;
      }
      var mx = 36, my = 32;
      var esc = Math.min((ancho - 2 * mx) / (maxX - minX), (alto - 2 * my) / (maxY - minY));
      var ox = (ancho - esc * (maxX - minX)) / 2, oy = (alto - esc * (maxY - minY)) / 2;
      function X(k) { return ox + (pos[k][0] - minX) * esc; }
      function Y(k) { return oy + (maxY - pos[k][1]) * esc; }
      var COLORES = ["#e3edf8", "#e7f2e8", "#fdf1dc", "#f3e8f8", "#e8f4f4", "#fbe9e7"];

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:560px'>";
      var e = 0;
      while (e < p.aristas.length) {
        var u = p.aristas[e][0], v = p.aristas[e][1];
        var esP = R.analisis.esPuente[e];
        var trazo = esP ? "#b3261e" : "#9aa3ad", grosor = esP ? 4.4 : 2;
        var mira = a && a.i === e;
        if (mira) {
          svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) +
                 "' stroke='#e8a13d' stroke-width='10' opacity='0.5'/>";
        }
        svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) +
               "' stroke='" + trazo + "' stroke-width='" + grosor + "'/>";
        svg += "<text x='" + ((X(u) + X(v)) / 2) + "' y='" + ((Y(u) + Y(v)) / 2 - 3) +
               "' text-anchor='middle' font-size='10' font-family='ui-monospace, monospace' fill='#6b7280' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
               e + "</text>";
        e = e + 1;
      }
      var w = 0;
      while (w < n) {
        var comp = a ? a.comp[w] : -1;
        var relleno = comp === -1 ? "#ffffff" : COLORES[comp % COLORES.length];
        var borde = "#9aa3ad", grueso = 2.2;
        if (a && a.u === w) { borde = "#24292f"; grueso = 4; }
        if (a && a.pila.indexOf(w) >= 0) { borde = "#1f5fa8"; grueso = 3.2; }
        svg += "<circle cx='" + X(w) + "' cy='" + Y(w) + "' r='" + r + "' fill='" + relleno +
               "' stroke='" + borde + "' stroke-width='" + grueso + "'/>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + w + "</text>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) - r - 5) + "' text-anchor='middle' font-size='11' font-family='ui-monospace, monospace' fill='#24292f' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
               (comp === -1 ? "−1" : "c" + comp) + "</text>";
        w = w + 1;
      }
      svg += "</svg>";
      caja.innerHTML = svg;
    }

    /* El arbol de puentes, por niveles desde el nodo 0. */
    function trazarArbol(caja, T, miembros) {
      var total = T.length;
      var nivel = [], i = 0;
      while (i < total) { nivel.push(-1); i = i + 1; }
      nivel[0] = 0;
      var cola = [0], frente = 0;
      while (frente < cola.length) {
        var u = cola[frente];
        frente = frente + 1;
        var j = 0;
        while (j < T[u].length) {
          if (nivel[T[u][j]] === -1) { nivel[T[u][j]] = nivel[u] + 1; cola.push(T[u][j]); }
          j = j + 1;
        }
      }
      var porNivel = {}, maxNivel = 0, maxAncho = 1;
      i = 0;
      while (i < total) {
        var lv = nivel[i] < 0 ? 0 : nivel[i];
        if (porNivel[lv] === undefined) { porNivel[lv] = []; }
        porNivel[lv].push(i);
        if (lv > maxNivel) { maxNivel = lv; }
        if (porNivel[lv].length > maxAncho) { maxAncho = porNivel[lv].length; }
        i = i + 1;
      }
      var anchoNodo = 96, altoNodo = 34;
      var ancho = Math.max(360, (maxNivel + 1) * (anchoNodo + 34));
      var alto = Math.max(110, maxAncho * (altoNodo + 26));
      var cx = [], cy = [];
      i = 0;
      while (i < total) { cx.push(0); cy.push(0); i = i + 1; }
      var lv2;
      for (lv2 in porNivel) {
        var fila = porNivel[lv2], k = 0;
        while (k < fila.length) {
          cx[fila[k]] = 30 + parseInt(lv2, 10) * (anchoNodo + 34) + anchoNodo / 2;
          cy[fila[k]] = alto / 2 + (k - (fila.length - 1) / 2) * (altoNodo + 26);
          k = k + 1;
        }
      }
      var svg = "<svg viewBox='0 0 " + (ancho + 30) + " " + alto + "' width='100%' style='max-width:620px'>";
      var u2 = 0;
      while (u2 < total) {
        var j2 = 0;
        while (j2 < T[u2].length) {
          var v2 = T[u2][j2];
          if (u2 < v2) {
            svg += "<line x1='" + cx[u2] + "' y1='" + cy[u2] + "' x2='" + cx[v2] + "' y2='" + cy[v2] +
                   "' stroke='#b3261e' stroke-width='3.4'/>";
          }
          j2 = j2 + 1;
        }
        u2 = u2 + 1;
      }
      var COLORES = ["#e3edf8", "#e7f2e8", "#fdf1dc", "#f3e8f8", "#e8f4f4", "#fbe9e7"];
      u2 = 0;
      while (u2 < total) {
        svg += "<rect x='" + (cx[u2] - anchoNodo / 2) + "' y='" + (cy[u2] - altoNodo / 2) + "' width='" + anchoNodo +
               "' height='" + altoNodo + "' rx='9' fill='" + COLORES[u2 % COLORES.length] + "' stroke='#24292f' stroke-width='1.8'/>";
        svg += "<text x='" + cx[u2] + "' y='" + (cy[u2] + 4) + "' text-anchor='middle' font-size='12' font-weight='700' fill='#24292f'>{" +
               miembros[u2].join(",") + "}</text>";
        svg += "<text x='" + cx[u2] + "' y='" + (cy[u2] - altoNodo / 2 - 5) + "' text-anchor='middle' font-size='10.5' font-family='ui-monospace, monospace' fill='#6b7280'>c" + u2 + "</text>";
        u2 = u2 + 1;
      }
      svg += "</svg>";
      caja.innerHTML = svg;
    }

    function armarMarcas() {
      var p = g(), h = "", i = 0;
      while (i < p.aristas.length) {
        h += "<button type='button' class='pieza' data-arista='" + i + "'>" + i + ": " + p.aristas[i][0] + "–" + p.aristas[i][1] + "</button>";
        i = i + 1;
      }
      document.getElementById("marcas-aristas").innerHTML = h;
      Array.prototype.forEach.call(document.querySelectorAll("#marcas-aristas button"), function (b) {
        b.addEventListener("click", function () {
          var k = parseInt(b.getAttribute("data-arista"), 10);
          marcas[k] = !marcas[k];
          b.classList.toggle("primario");
        });
      });
    }

    function comprobarPuentes() {
      var p = g(), fallos = 0, h = "", i = 0;
      while (i < p.aristas.length) {
        var ok = marcas[i] === R.analisis.esPuente[i];
        if (!ok) { fallos = fallos + 1; }
        if (marcas[i] || R.analisis.esPuente[i]) {
          h += "<div class='veredicto " + (ok ? "bien" : "mal") + "' style='display:block;margin-top:0.4rem'><b>Arista " + i +
               " (" + p.aristas[i][0] + "–" + p.aristas[i][1] + ")</b>: " +
               (R.analisis.esPuente[i] ? "es puente" : "no es puente") + (ok ? "" : ", y usted la marcó al contrario") +
               ". " + EJERCICIO.explicarPuente(p.n, p.aristas, i) + "</div>";
        }
        i = i + 1;
      }
      var v = document.getElementById("veredicto-puentes");
      v.className = fallos === 0 ? "veredicto bien" : "veredicto mal";
      v.textContent = fallos === 0
        ? "Los " + R.puentes.length + " puentes quedaron marcados y ninguna otra arista. Ahora el dibujo los pinta en rojo y se puede etiquetar."
        : fallos + (fallos === 1 ? " arista quedó mal." : " aristas quedaron mal.") + " Las razones van abajo.";
      document.getElementById("detalle-puentes").innerHTML = h;
      if (fallos === 0) { etapa = Math.max(etapa, 1); }
      pintarGrafoEstatico();
    }

    function armarEtiquetas() {
      var p = g(), h = "", i = 0;
      while (i < p.n) {
        h += "<label class='campo-comp'><span class='mono'>comp[" + i + "]</span>" +
             "<input type='number' id='comp-" + i + "' min='0'></label>";
        i = i + 1;
      }
      document.getElementById("entradas-comp").innerHTML = h;
    }

    function comprobarEtiquetas() {
      var p = g(), n = p.n, i = 0, vacios = 0;
      var dados = [];
      while (i < n) {
        var x = parseInt(document.getElementById("comp-" + i).value, 10);
        if (isNaN(x)) { vacios = vacios + 1; }
        dados.push(x);
        i = i + 1;
      }
      var v = document.getElementById("veredicto-comp");
      if (vacios > 0) {
        v.className = "veredicto mal";
        v.textContent = "Faltan " + vacios + " números por escribir.";
      } else {
        /* Dos etiquetados valen lo mismo si parten los vertices igual. */
        var mismaParticion = true, iguales = 0, j;
        for (i = 0; i < n; i = i + 1) {
          for (j = i + 1; j < n; j = j + 1) {
            if ((dados[i] === dados[j]) !== (R.comp[i] === R.comp[j])) { mismaParticion = false; }
          }
          if (dados[i] === R.comp[i]) { iguales = iguales + 1; }
        }
        var piezas = [];
        for (i = 0; i < R.total; i = i + 1) {
          piezas.push("c" + i + " = {" + R.miembros[i].join(", ") + "}");
        }
        if (mismaParticion && iguales === n) {
          v.className = "veredicto bien";
          v.textContent = "Correcto, y con la numeración que da el código: " + piezas.join("; ") +
            ". El número sale del orden del segundo for, que recorre los vértices de 0 a " + (n - 1) +
            " y abre un componente nuevo con el primero que todavía tiene −1.";
          etapa = Math.max(etapa, 2);
        } else if (mismaParticion) {
          v.className = "veredicto bien";
          v.textContent = "Los grupos están bien, los números no. El código numera por el orden del segundo for: " +
            piezas.join("; ") + ". Vuelva a escribirlos así, que la tercera pasada usa esos números como nodos.";
          etapa = Math.max(etapa, 2);
        } else {
          v.className = "veredicto mal";
          v.textContent = "Los grupos no coinciden. El recorrido no cruza puentes, así que dos vértices caen juntos exactamente cuando hay camino entre ellos sin pasar por ningún puente. Lo correcto es " +
            piezas.join("; ") + ".";
        }
      }
    }

    function pintarGrafoEstatico() {
      var a = { comp: R.comp.map(function () { return -1; }), pila: [], u: null, i: null };
      if (etapa >= 2) { a.comp = R.comp.slice(); }
      trazarGrafo(document.getElementById("panel-grafo"), a);
    }

    function alPintar(e) {
      var a = e.actual;
      trazarGrafo(document.getElementById("panel-traza"), a);
      document.getElementById("ver-comp").textContent = a
        ? "[" + a.comp.join(", ") + "]" : "aún no";
      var pilaTxt;
      if (!a) {
        pilaTxt = "vacía";
      } else if (version === "recursiva") {
        pilaTxt = a.marcos.length === 0 ? "vacía"
          : a.marcos.map(function (f) { return "etiquetar(" + f[0] + ", " + f[1] + ")"; }).join("  →  ");
      } else {
        pilaTxt = a.pila.length === 0 ? "vacía" : "[" + a.pila.join(", ") + "]";
      }
      document.getElementById("ver-pila").textContent = pilaTxt;
      document.getElementById("rot-pila").textContent = version === "recursiva" ? "Pila de llamadas" : "pila";
      document.getElementById("ver-arbol").textContent = a && a.T !== null
        ? "{" + a.T.map(function (l, c) { return c + ": [" + l.join(", ") + "]"; }).join(", ") + "}"
        : "aún no";
      document.getElementById("ver-msg").textContent = a && a.msg !== "" ? a.msg : "";
    }

    function arrancar() {
      var ids = ["btn-paso", "btn-auto", "btn-fin", "btn-reiniciar"], t = 0;
      while (t < ids.length) {
        var b = document.getElementById(ids[t]);
        b.parentNode.replaceChild(b.cloneNode(true), b);
        t = t + 1;
      }
      var chips = version === "recursiva"
        ? [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "i", rotulo: "i" },
           { campo: "numero", rotulo: "numero" }, { campo: "total", rotulo: "total", clase: "cuenta" }]
        : [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "i", rotulo: "i" },
           { campo: "numero", rotulo: "numero" }, { campo: "total", rotulo: "total", clase: "cuenta" }];
      Motor.iniciar({
        codigo: EJERCICIO.codigoDe(version), simular: EJERCICIO.simular,
        chips: chips, paramsIniciales: paramsActuales(), alPintar: alPintar
      });
    }

    function armarArbol() {
      var p = g();
      trazarArbol(document.getElementById("panel-arbol"), R.T, R.miembros);
      var hojas = EJERCICIO.hojas(R.T);
      var par = p.pregunta;
      var dist = EJERCICIO.distancia(R.T, R.comp[par[0]], R.comp[par[1]]);
      document.getElementById("cuenta-arbol").innerHTML =
        "<tr><th>Nodos</th><td>" + R.total + ", uno por componente 2-arista-conexo</td></tr>" +
        "<tr><th>Aristas</th><td>" + R.puentes.length + ", una por puente</td></tr>" +
        "<tr><th>Nodos menos aristas</th><td>" + (R.total - R.puentes.length) +
        ", que es 1: el grafo es conexo y lo que sale es un árbol</td></tr>" +
        "<tr><th>Hojas</th><td>" + hojas.map(function (c) { return "c" + c + " = {" + R.miembros[c].join(", ") + "}"; }).join("; ") +
        ", los componentes que cuelgan del resto por un solo puente</td></tr>";
      document.getElementById("pregunta-dist").textContent =
        "¿Cuántos puentes hay que cruzar para ir del vértice " + par[0] + " al vértice " + par[1] + "?";
      document.getElementById("dato-dist").textContent =
        "El " + par[0] + " está en c" + R.comp[par[0]] + " y el " + par[1] + " en c" + R.comp[par[1]] + ".";
      var vd = document.getElementById("veredicto-dist");
      vd.className = "veredicto";
      vd.textContent = "";
      document.getElementById("dist-correcta").value = "";
      document.getElementById("btn-dist").onclick = function () {
        var valor = parseInt(document.getElementById("dist-correcta").value, 10);
        if (isNaN(valor)) {
          vd.className = "veredicto mal";
          vd.textContent = "Escriba un número primero.";
        } else if (valor === dist) {
          vd.className = "veredicto bien";
          vd.textContent = "Correcto: " + dist + ". Es la distancia de c" + R.comp[par[0]] + " a c" + R.comp[par[1]] +
            " en el árbol, y en un árbol ese camino es único. Dentro de un componente se va de un vértice a otro sin cruzar ningún puente, así que los puentes del camino son exactamente las aristas del árbol que se recorren.";
        } else if (valor === R.puentes.length) {
          vd.className = "veredicto mal";
          vd.textContent = "Ese es el total de puentes del grafo, " + R.puentes.length +
            ". El camino entre esos dos componentes no pasa por todos: son " + dist + ".";
        } else {
          vd.className = "veredicto mal";
          vd.textContent = "No coincide. Cuente las aristas del árbol entre c" + R.comp[par[0]] + " y c" + R.comp[par[1]] +
            "; la respuesta es " + dist + ".";
        }
      };
    }

    function armar() {
      var p = g();
      R = EJERCICIO.contraer(p.n, p.aristas);
      etapa = 0;
      marcas = [];
      var i = 0;
      while (i < p.aristas.length) { marcas.push(false); i = i + 1; }
      document.getElementById("ver-texto").textContent = p.texto;
      document.getElementById("ver-n").textContent = p.n + " vértices y " + p.aristas.length + " aristas";
      armarMarcas();
      armarEtiquetas();
      armarArbol();
      var v = document.getElementById("veredicto-puentes");
      v.className = "veredicto";
      v.textContent = "";
      document.getElementById("detalle-puentes").innerHTML = "";
      var v2 = document.getElementById("veredicto-comp");
      v2.className = "veredicto";
      v2.textContent = "";
      Motor.limpiarVeredicto();
      pintarGrafoEstatico();
      Motor.reiniciar(paramsActuales());
    }

    function marcarBotones(id, atributo, valor) {
      Array.prototype.forEach.call(document.querySelectorAll("#" + id + " button"), function (b) {
        if (b.getAttribute(atributo) === valor) { b.classList.add("primario"); } else { b.classList.remove("primario"); }
      });
    }

    R = EJERCICIO.contraer(g().n, g().aristas);
    arrancar();
    armar();

    Motor.prediccionNumerica(function (valor) {
      var res;
      if (valor === R.total) {
        res = { ok: true, msg: "Correcto: " + R.total + " nodos y " + R.puentes.length +
          " aristas, y la diferencia es 1 porque el grafo es conexo. Los componentes son " +
          R.miembros.map(function (l, c) { return "c" + c + " = {" + l.join(", ") + "}"; }).join("; ") + "." };
      } else if (valor === R.puentes.length) {
        res = { ok: false, msg: "Ese es el número de puentes, " + R.puentes.length +
          ", que son las aristas del árbol. Los nodos son uno más: " + R.total + "." };
      } else if (valor === R.puentes.length + 2) {
        res = { ok: false, msg: "Contó un componente de más. Un puente une dos componentes que ya existen; con " +
          R.puentes.length + " puentes y el grafo conexo, los nodos son " + R.total + "." };
      } else {
        res = { ok: false, msg: "No coincide. Borre mentalmente los puentes y cuente los pedazos que quedan: son " +
          R.total + ". Con el grafo conexo, los nodos del árbol son siempre los puentes más uno." };
      }
      return res;
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        marcarBotones("presets-grafo", "data-preset", String(presetActual));
        armar();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (btn) {
      btn.addEventListener("click", function () {
        version = btn.getAttribute("data-version");
        marcarBotones("presets-version", "data-version", version);
        arrancar();
      });
    });
    document.getElementById("btn-comprobar-puentes").addEventListener("click", comprobarPuentes);
    document.getElementById("btn-comprobar-comp").addEventListener("click", comprobarEtiquetas);
  })();
}
