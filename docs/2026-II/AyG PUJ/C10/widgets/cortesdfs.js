/* Ejercicio interactivo: puntos de articulacion y puentes con una sola
   busqueda en profundidad (clase 10). La simulacion reproduce, linea por
   linea, marcados, descubrir, revisar_hijo, cortes_aux y cortes (recursiva)
   y cortes_desde con cortes_con_pila (pila explicita). */
var EJERCICIO = (function () {
  var COMUN = [
    { txt: "def marcados(es_art):",                    num: null },
    { txt: "    # Los vertices con es_art en True, en orden.", num: null },
    { txt: "    articulaciones = []",                  num: 1, bloque: 3 },
    { txt: "    u = 0",                                num: 2, bloque: 3 },
    { txt: "    while u < len(es_art):",               num: 3, bloque: 3 },
    { txt: "        if es_art[u]:",                    num: 4, bloque: 3 },
    { txt: "            articulaciones.append(u)",     num: 5, bloque: 3 },
    { txt: "        u = u + 1",                        num: 6, bloque: 3 },
    { txt: "    return articulaciones",                num: 7, bloque: 3 },
    { txt: "",                                         num: null },
    { txt: "def descubrir(u, reloj, d, low):",         num: null },
    { txt: "    reloj[0] = reloj[0] + 1",              num: 8, bloque: 1 },
    { txt: "    d[u] = reloj[0]",                      num: 9, bloque: 1 },
    { txt: "    low[u] = reloj[0]",                    num: 10, bloque: 1 },
    { txt: "",                                         num: null },
    { txt: "def revisar_hijo(u, v, es_raiz, d, low, es_art, puentes):", num: null },
    { txt: "    # v es hijo de u y ya termino: su low es definitivo.", num: null },
    { txt: "    low[u] = min(low[u], low[v])",         num: 11, bloque: 1 },
    { txt: "    if not es_raiz and low[v] >= d[u]:",   num: 12, bloque: 1 },
    { txt: "        es_art[u] = True",                 num: 13, bloque: 1 },
    { txt: "    if low[v] > d[u]:",                    num: 14, bloque: 1 },
    { txt: "        puentes.append((u, v))",           num: 15, bloque: 1 },
    { txt: "",                                         num: null }
  ];

  var CODIGOS = {
    recursiva: COMUN.concat([
      { txt: "def cortes_aux(G, u, padre, reloj, d, low, es_art, puentes):", num: null },
      { txt: "    # padre = -1 dice que u es la raiz de su arbol.", num: null },
      { txt: "    descubrir(u, reloj, d, low)",                   num: 16, bloque: 2 },
      { txt: "    hijos = 0",                                     num: 17, bloque: 2 },
      { txt: "    for v in G[u]:",                                num: 18, bloque: 2 },
      { txt: "        if d[v] == 0:",                             num: 19, bloque: 2 },
      { txt: "            hijos = hijos + 1",                     num: 20, bloque: 2 },
      { txt: "            cortes_aux(G, v, u, reloj, d, low, es_art, puentes)", num: 21, bloque: 2 },
      { txt: "            revisar_hijo(u, v, padre == -1, d, low, es_art, puentes)", num: 22, bloque: 2 },
      { txt: "        elif v != padre:",                          num: 23, bloque: 2 },
      { txt: "            low[u] = min(low[u], d[v])",            num: 24, bloque: 2 },
      { txt: "    if padre == -1 and hijos >= 2:",                num: 25, bloque: 2 },
      { txt: "        es_art[u] = True",                          num: 26, bloque: 2 },
      { txt: "",                                                  num: null },
      { txt: "def cortes(G):",                                    num: null },
      { txt: "    # Devuelve (articulaciones, puentes). d[v] = 0: sin descubrir.", num: null },
      { txt: "    n = len(G)",                                    num: 27 },
      { txt: "    d = [0] * n",                                   num: 28 },
      { txt: "    low = [0] * n",                                 num: 29 },
      { txt: "    es_art = [False] * n",                          num: 30 },
      { txt: "    puentes = []",                                  num: 31 },
      { txt: "    reloj = [0]",                                   num: 32 },
      { txt: "    for u in range(n):",                            num: 33 },
      { txt: "        if d[u] == 0:",                             num: 34 },
      { txt: "            cortes_aux(G, u, -1, reloj, d, low, es_art, puentes)", num: 35 },
      { txt: "    resultado = (marcados(es_art), puentes)",       num: 36 },
      { txt: "    return resultado",                              num: 37 }
    ]),
    pila: COMUN.concat([
      { txt: "def cortes_desde(G, s, reloj, d, low, es_art, puentes):", num: null },
      { txt: "    # llamadas guarda ternas [u, padre, i]. Devuelve los hijos de s.", num: null },
      { txt: "    descubrir(s, reloj, d, low)",                   num: 16, bloque: 2 },
      { txt: "    hijos = 0",                                     num: 17, bloque: 2 },
      { txt: "    llamadas = [[s, -1, 0]]",                       num: 18, bloque: 2 },
      { txt: "    while len(llamadas) > 0:",                      num: 19, bloque: 2 },
      { txt: "        u, padre, i = llamadas[-1]",                num: 20, bloque: 2 },
      { txt: "        if i < len(G[u]):",                         num: 21, bloque: 2 },
      { txt: "            llamadas[-1][2] = i + 1",               num: 22, bloque: 2 },
      { txt: "            v = G[u][i]",                           num: 23, bloque: 2 },
      { txt: "            if d[v] == 0:",                         num: 24, bloque: 2 },
      { txt: "                if u == s:",                        num: 25, bloque: 2 },
      { txt: "                    hijos = hijos + 1",             num: 26, bloque: 2 },
      { txt: "                descubrir(v, reloj, d, low)",       num: 27, bloque: 2 },
      { txt: "                llamadas.append([v, u, 0])",        num: 28, bloque: 2 },
      { txt: "            elif v != padre:",                      num: 29, bloque: 2 },
      { txt: "                low[u] = min(low[u], d[v])",        num: 30, bloque: 2 },
      { txt: "        else:",                                     num: null },
      { txt: "            llamadas.pop()",                        num: 31, bloque: 2 },
      { txt: "            if padre != -1:",                       num: 32, bloque: 2 },
      { txt: "                revisar_hijo(padre, u, padre == s, d, low, es_art, puentes)", num: 33, bloque: 2 },
      { txt: "    return hijos",                                  num: 34, bloque: 2 },
      { txt: "",                                                  num: null },
      { txt: "def cortes_con_pila(G):",                           num: null },
      { txt: "    # Lo mismo que cortes, con la profundidad en una lista.", num: null },
      { txt: "    n = len(G)",                                    num: 35 },
      { txt: "    d = [0] * n",                                   num: 36 },
      { txt: "    low = [0] * n",                                 num: 37 },
      { txt: "    es_art = [False] * n",                          num: 38 },
      { txt: "    puentes = []",                                  num: 39 },
      { txt: "    reloj = [0]",                                   num: 40 },
      { txt: "    for s in range(n):",                            num: 41 },
      { txt: "        if d[s] == 0 and cortes_desde(G, s, reloj, d, low, es_art, puentes) >= 2:", num: 42 },
      { txt: "            es_art[s] = True",                      num: 43 },
      { txt: "    resultado = (marcados(es_art), puentes)",       num: 44 },
      { txt: "    return resultado",                              num: 45 }
    ])
  };

  function codigoDe(version) { return CODIGOS[version]; }

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

  function simular(params) {
    var G = params.G, version = params.version, n = G.length;
    var pasos = [];
    var d = [], low = [], esArt = [], puentes = [], arbol = [], retro = [];
    var reloj = 0, frames = [], llamadas = [], resultado = null;
    var loc = { u: null, padre: null, v: null, hijos: null, i: null, s: null };
    var i0 = 0;
    while (i0 < n) { d.push(0); low.push(0); esArt.push(false); i0 = i0 + 1; }

    function copia(l) { return l.map(function (x) { return x.slice(); }); }
    function nv(x) { return x === undefined ? null : x; }

    function snap(linea, extra, msg) {
      var fr = (version === "recursiva" && frames.length > 0) ? frames[frames.length - 1] : null;
      var c = fr !== null ? fr : loc;
      var q = {
        linea: linea,
        u: nv(c.u), padre: nv(c.padre), v: nv(c.v), hijos: nv(c.hijos),
        i: nv(c.i), s: nv(loc.s), reloj: reloj,
        d: d.slice(), low: low.slice(), esArt: esArt.slice(),
        puentes: copia(puentes), arbol: copia(arbol), retro: copia(retro),
        pila: version === "recursiva"
          ? frames.map(function (f) { return [f.u, f.padre]; })
          : copia(llamadas),
        resultado: resultado === null ? null : resultado.slice(),
        mira: null, msg: msg || ""
      };
      if (extra) { var x; for (x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }

    function textoArticulacion(esRaiz, lowV, dU, u, v) {
      var t;
      if (esRaiz) {
        t = "u = " + u + " es la raíz: aquí no se compara. La raíz se decide al final, por su número de hijos.";
      } else if (lowV >= dU) {
        t = "low[" + v + "] = " + lowV + " ≥ d[" + u + "] = " + dU + ": el subárbol de " + v + " no llega más arriba que " + u + ". Quitar " + u + " lo deja aparte: punto de articulación.";
      } else {
        t = "low[" + v + "] = " + lowV + " < d[" + u + "] = " + dU + ": el subárbol de " + v + " llega más arriba que " + u + ". Por este hijo " + u + " no es punto de articulación.";
      }
      return t;
    }
    function textoPuente(lowV, dU, u, v) {
      var t;
      if (lowV > dU) {
        t = "low[" + v + "] = " + lowV + " > d[" + u + "] = " + dU + ": ninguna arista del subárbol de " + v + " llega a " + u + " ni más arriba. La arista " + u + "–" + v + " es puente.";
      } else {
        t = "low[" + v + "] = " + lowV + " ≤ d[" + u + "] = " + dU + ": el subárbol de " + v + " vuelve a " + u + " o más arriba. La arista " + u + "–" + v + " está en un ciclo.";
      }
      return t;
    }
    function textoRetroceso(u, v, baja, antes) {
      var t;
      if (baja) {
        t = "v = " + v + " ya estaba descubierto y no es el padre: " + u + "–" + v + " es de retroceso y baja low[" + u + "] de " + antes + " a " + d[v] + ".";
      } else {
        t = "v = " + v + " ya estaba descubierto y no es el padre, pero d[" + v + "] = " + d[v] + " no mejora low[" + u + "] = " + low[u] + ".";
      }
      return t;
    }

    /* descubrir(w, ...), lineas 8 a 10. */
    function descubrirSim(w) {
      var ov = { u: w, v: null, padre: null, hijos: null, i: null };
      reloj = reloj + 1; snap(8, ov);
      d[w] = reloj; snap(9, ov);
      low[w] = reloj; snap(10, ov, "El vértice " + w + " recibe d = low = " + reloj + ".");
    }

    /* revisar_hijo(u, v, es_raiz, ...), lineas 11 a 15. */
    function revisarHijoSim(u, v, esRaiz) {
      var ov = { u: u, v: v, padre: null, hijos: null, i: null };
      low[u] = Math.min(low[u], low[v]);
      snap(11, ov, "Al volver de " + v + ", low[" + u + "] queda en " + low[u] + ".");
      snap(12, ov, textoArticulacion(esRaiz, low[v], d[u], u, v));
      if (!esRaiz && low[v] >= d[u]) {
        esArt[u] = true;
        snap(13, ov, "El vértice " + u + " queda marcado como punto de articulación.");
      }
      snap(14, ov, textoPuente(low[v], d[u], u, v));
      if (low[v] > d[u]) {
        puentes.push([u, v]);
        snap(15, ov, "La arista " + u + "–" + v + " se agrega a puentes.");
      }
    }

    /* marcados(es_art), lineas 1 a 7. */
    function correrMarcados() {
      resultado = [];
      loc.u = null; loc.v = null; loc.padre = null; loc.i = null; loc.hijos = null; loc.s = null;
      snap(1);
      loc.u = 0; snap(2);
      while (true) {
        snap(3);
        if (loc.u >= n) { break; }
        snap(4);
        if (esArt[loc.u]) {
          resultado.push(loc.u);
          snap(5, null, "El vértice " + loc.u + " tiene es_art en True: entra a la lista.");
        }
        loc.u = loc.u + 1;
        snap(6);
      }
      snap(7);
    }

    function cortesAux(u, padre) {
      var fr = { u: u, padre: padre, v: null, hijos: null, i: null };
      frames.push(fr);
      snap(16, null, padre === -1 ? "Arranca un árbol nuevo en la raíz " + u + "." : "");
      descubrirSim(u);
      fr.hijos = 0; snap(17);
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        fr.v = v;
        snap(18);
        snap(19);
        if (d[v] === 0) {
          fr.hijos = fr.hijos + 1; snap(20);
          arbol.push([u, v]);
          snap(21, { mira: [u, v] }, "La arista " + u + "–" + v + " entra al árbol: se llama cortes_aux(G, " + v + ", " + u + ", ...).");
          cortesAux(v, u);
          fr.v = v;
          snap(22, null, "Vuelve la llamada sobre " + v + ": se revisa a ese hijo.");
          revisarHijoSim(u, v, padre === -1);
        } else {
          snap(23, null, v === padre
            ? "v = " + v + " es el padre de " + u + ": la arista por la que se llegó no cuenta como de retroceso."
            : "");
          if (v !== padre) {
            var antes = low[u];
            var baja = d[v] < low[u];
            low[u] = Math.min(low[u], d[v]);
            if (baja) { retro.push([u, v]); }
            snap(24, { mira: [u, v] }, textoRetroceso(u, v, baja, antes));
          }
        }
        j = j + 1;
      }
      fr.v = null;
      snap(25, null, padre === -1
        ? "u = " + u + " es la raíz y tiene " + fr.hijos + (fr.hijos === 1 ? " hijo." : " hijos.")
        : "u = " + u + " no es la raíz: esta línea no aplica.");
      if (padre === -1 && fr.hijos >= 2) {
        esArt[u] = true;
        snap(26, null, "La raíz tiene dos hijos o más: quitarla separa sus subárboles. Queda marcada.");
      }
      frames.pop();
    }

    function simularRecursiva() {
      var s0 = 27;
      while (s0 <= 32) { snap(s0); s0 = s0 + 1; }
      var u = 0;
      while (u < n) {
        loc.u = u;
        snap(33);
        snap(34, null, d[u] === 0 ? "d[" + u + "] = 0: el vértice no se ha descubierto." : "d[" + u + "] ya es " + d[u] + ": el recorrido anterior lo alcanzó.");
        if (d[u] === 0) {
          snap(35);
          cortesAux(u, -1);
        }
        u = u + 1;
      }
      loc.u = null;
      snap(36);
      correrMarcados();
      snap(37);
    }

    /* cortes_desde(G, s, ...), lineas 16 a 34: devuelve los hijos de s. */
    function cortesDesde(s) {
      loc.u = null; loc.padre = null; loc.i = null; loc.v = null; loc.hijos = null;
      snap(16);
      descubrirSim(s);
      loc.hijos = 0; snap(17);
      llamadas = [[s, -1, 0]]; snap(18);
      while (true) {
        snap(19);
        if (llamadas.length === 0) { break; }
        var t = llamadas[llamadas.length - 1];
        var u = t[0], padre = t[1], i = t[2];
        loc.u = u; loc.padre = padre; loc.i = i;
        snap(20);
        snap(21);
        if (i < G[u].length) {
          t[2] = i + 1; snap(22);
          var v = G[u][i];
          loc.v = v; snap(23);
          snap(24);
          if (d[v] === 0) {
            snap(25, null, u === s ? "u es s, la raíz: este hijo se cuenta." : "u no es la raíz: no se cuenta.");
            if (u === s) { loc.hijos = loc.hijos + 1; snap(26); }
            snap(27, null, "Se descubre " + v + ".");
            descubrirSim(v);
            arbol.push([u, v]);
            llamadas.push([v, u, 0]);
            snap(28, { mira: [u, v] }, "La arista " + u + "–" + v + " entra al árbol: se apila [" + v + ", " + u + ", 0].");
          } else {
            snap(29, null, v === padre
              ? "v = " + v + " es el padre de " + u + ": la arista por la que se llegó no cuenta como de retroceso."
              : "");
            if (v !== padre) {
              var antes = low[u];
              var baja = d[v] < low[u];
              low[u] = Math.min(low[u], d[v]);
              if (baja) { retro.push([u, v]); }
              snap(30, { mira: [u, v] }, textoRetroceso(u, v, baja, antes));
            }
          }
        } else {
          llamadas.pop();
          snap(31, null, "u = " + u + " ya revisó todos sus vecinos: sale de la pila.");
          snap(32);
          if (padre !== -1) {
            snap(33, null, "Se revisa al hijo " + u + " en su padre " + padre + ".");
            revisarHijoSim(padre, u, padre === s);
          }
        }
      }
      var hijos = loc.hijos;
      snap(34);
      return hijos;
    }

    function simularPila() {
      var s0 = 35;
      while (s0 <= 40) { snap(s0); s0 = s0 + 1; }
      var s = 0;
      while (s < n) {
        loc.s = s;
        loc.u = null; loc.padre = null; loc.i = null; loc.v = null; loc.hijos = null;
        snap(41);
        snap(42, null, d[s] === 0 ? "d[" + s + "] = 0: se llama cortes_desde sobre " + s + "." : "d[" + s + "] ya es " + d[s] + ": no se llama, el recorrido anterior lo alcanzó.");
        if (d[s] === 0) {
          var hijos = cortesDesde(s);
          loc.u = null; loc.padre = null; loc.i = null; loc.v = null; loc.hijos = null;
          snap(42, null, "cortes_desde devolvió " + hijos + (hijos === 1 ? " hijo" : " hijos") + " para la raíz " + s + (hijos >= 2 ? ": con dos o más, la raíz es punto de articulación." : ": con menos de dos, la raíz no lo es."));
          if (hijos >= 2) { esArt[s] = true; snap(43); }
        }
        s = s + 1;
      }
      loc.s = null;
      snap(44);
      correrMarcados();
      snap(45);
    }

    if (version === "recursiva") { simularRecursiva(); } else { simularPila(); }
    return pasos;
  }

  /* El resultado final de una version: lo que devuelve la funcion. */
  function resultadoDe(G, version) {
    var pasos = simular({ G: G, version: version });
    var ult = pasos[pasos.length - 1];
    return { articulaciones: ult.resultado, puentes: ult.puentes, d: ult.d, low: ult.low };
  }

  return { codigoDe: codigoDe, simular: simular, resultadoDe: resultadoDe, construir: construir };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { rotulo: "Nueve vértices, raíz con dos hijos", G: EJERCICIO.construir(9, [[0, 1], [1, 2], [2, 3], [3, 1], [0, 4], [4, 5], [5, 6], [6, 7], [7, 4], [5, 8]]),
        pos: [[3.2, 1.6], [1.8, 1.6], [0.9, 2.6], [0.9, 0.6], [4.6, 1.6], [5.6, 2.6], [6.8, 1.6], [5.6, 0.6], [5.6, 3.6]] },
      { rotulo: "Ocho vértices, raíz con un solo hijo", G: EJERCICIO.construir(8, [[0, 1], [1, 2], [2, 3], [0, 3], [2, 4], [4, 5], [5, 6], [4, 6], [6, 7]]),
        pos: [[0.0, 2.4], [1.3, 2.4], [1.3, 0.8], [0.0, 0.8], [2.8, 0.8], [3.6, 2.0], [4.4, 0.8], [5.7, 0.8]] },
      { rotulo: "Diez vértices, un punto sin puente", G: EJERCICIO.construir(10, [[0, 1], [1, 2], [2, 3], [3, 4], [0, 4], [2, 5], [5, 6], [6, 7], [2, 7], [7, 8], [5, 9]]),
        pos: [[0.0, 1.7], [0.8, 2.8], [2.1, 2.4], [2.1, 0.8], [0.8, 0.5], [3.4, 3.2], [4.6, 2.4], [3.4, 1.6], [3.4, 0.4], [3.4, 4.2]] }
    ];
    var presetActual = 0;
    var version = "recursiva";

    function paramsActuales() {
      return { G: PRESETS[presetActual].G, pos: PRESETS[presetActual].pos, version: version };
    }

    function tiene(lista, a, b) {
      var k = 0, hay = false;
      while (k < lista.length) {
        if ((lista[k][0] === a && lista[k][1] === b) || (lista[k][0] === b && lista[k][1] === a)) { hay = true; }
        k = k + 1;
      }
      return hay;
    }

    function dibujar(params, a) {
      var Gr = params.G, pos = params.pos, n = Gr.length;
      var ancho = 520, alto = 270, r = 17;
      var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
      while (i < n) {
        if (pos[i][0] < minX) { minX = pos[i][0]; }
        if (pos[i][0] > maxX) { maxX = pos[i][0]; }
        if (pos[i][1] < minY) { minY = pos[i][1]; }
        if (pos[i][1] > maxY) { maxY = pos[i][1]; }
        i = i + 1;
      }
      var mx = 38, my = 34;
      var esc = Math.min((ancho - 2 * mx) / (maxX - minX), (alto - 2 * my) / (maxY - minY));
      var ox = (ancho - esc * (maxX - minX)) / 2, oy = (alto - esc * (maxY - minY)) / 2;
      function X(k) { return ox + (pos[k][0] - minX) * esc; }
      function Y(k) { return oy + (maxY - pos[k][1]) * esc; }

      var arbol = a ? a.arbol : [], retro = a ? a.retro : [], puentes = a ? a.puentes : [];
      var enPila = {};
      if (a) {
        var m = 0;
        while (m < a.pila.length) { enPila[a.pila[m][0]] = true; m = m + 1; }
      }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:560px'>";
      var u = 0, j;
      while (u < n) {
        j = 0;
        while (j < Gr[u].length) {
          var v = Gr[u][j];
          if (u < v) {
            var trazo = "#c3c9d0", grosor = 1.7, punteada = "";
            if (tiene(arbol, u, v)) { trazo = "#1f5fa8"; grosor = 3; }
            if (tiene(retro, u, v)) { trazo = "#2e7d32"; grosor = 2.8; punteada = " stroke-dasharray='3,5' stroke-linecap='round'"; }
            if (tiene(puentes, u, v)) { trazo = "#b3261e"; grosor = 4.6; punteada = ""; }
            var mira = a && a.mira && ((a.mira[0] === u && a.mira[1] === v) || (a.mira[0] === v && a.mira[1] === u));
            if (mira) {
              svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) +
                     "' stroke='#e8a13d' stroke-width='9' opacity='0.45'/>";
            }
            svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) +
                   "' stroke='" + trazo + "' stroke-width='" + grosor + "'" + punteada + "/>";
          }
          j = j + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        var descubierto = a && a.d[u] > 0;
        var relleno = "#ffffff", borde = "#d8dee6";
        if (descubierto) { relleno = enPila[u] ? "#e3edf8" : "#f1f3f6"; borde = "#1f5fa8"; }
        if (a && a.esArt[u]) { relleno = "#fbe9e7"; borde = "#b3261e"; }
        var foco = a && a.pila.length > 0 && a.pila[a.pila.length - 1][0] === u;
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='" + r + "' fill='" + relleno +
               "' stroke='" + (foco ? "#24292f" : borde) + "' stroke-width='" + (foco ? 4 : 2.4) + "'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + u + "</text>";
        var dTxt = descubierto ? a.d[u] : "–", lTxt = descubierto ? a.low[u] : "–";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) - r - 5) + "' text-anchor='middle' font-size='11.5' font-family='ui-monospace, monospace' fill='#24292f' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
               dTxt + "/" + lTxt + "</text>";
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function parTxt(p) { return "(" + p[0] + ", " + p[1] + ")"; }

    function alPintar(e) {
      var a = e.actual;
      dibujar(e.params, a);
      var G = e.params.G, n = G.length;
      var arts = [], v;
      if (a) { for (v = 0; v < n; v = v + 1) { if (a.esArt[v]) { arts.push(v); } } }
      document.getElementById("ver-art").textContent = arts.length > 0 ? "{" + arts.join(", ") + "}" : "ninguno todavía";
      document.getElementById("ver-puentes").textContent = a && a.puentes.length > 0
        ? a.puentes.map(parTxt).join(", ") : "ninguno todavía";
      var pilaTxt;
      if (!a || a.pila.length === 0) {
        pilaTxt = "vacía";
      } else if (version === "recursiva") {
        pilaTxt = a.pila.map(function (f) { return "visit(" + f[0] + ", " + f[1] + ")"; }).join("  →  ");
      } else {
        pilaTxt = a.pila.map(function (t) { return "[" + t.join(", ") + "]"; }).join(", ");
      }
      document.getElementById("ver-pila").textContent = pilaTxt;
      document.getElementById("rot-pila").textContent = version === "recursiva" ? "Pila de llamadas" : "llamadas";
      document.getElementById("ver-msg").textContent = a && a.msg !== "" ? a.msg : "";

      var filas = "";
      for (v = 0; v < n; v = v + 1) {
        var desc = a && a.d[v] > 0;
        filas += "<tr><td>" + v + "</td><td>" + (desc ? a.d[v] : "–") + "</td><td>" + (desc ? a.low[v] : "–") +
                 "</td><td>" + (a && a.esArt[v] ? "punto de articulación" : "") + "</td></tr>";
      }
      document.getElementById("cuerpo-vertices").innerHTML = filas;
      if (a && a.resultado !== null && e.terminado) {
        document.getElementById("ver-devuelve").textContent =
          "([" + a.resultado.join(", ") + "], [" + a.puentes.map(parTxt).join(", ") + "])";
      } else {
        document.getElementById("ver-devuelve").textContent = "(aún no)";
      }
    }

    function marcarBotones(id, atributo, valor) {
      Array.prototype.forEach.call(document.querySelectorAll("#" + id + " button"), function (b) {
        if (b.getAttribute(atributo) === valor) { b.classList.add("primario"); } else { b.classList.remove("primario"); }
      });
    }

    function arrancar() {
      var ids = ["btn-paso", "btn-auto", "btn-fin", "btn-reiniciar"], t = 0;
      while (t < ids.length) {
        var b = document.getElementById(ids[t]);
        b.parentNode.replaceChild(b.cloneNode(true), b);
        t = t + 1;
      }
      var chips = version === "recursiva"
        ? [{ campo: "u", rotulo: "u" }, { campo: "padre", rotulo: "padre" }, { campo: "v", rotulo: "v" },
           { campo: "hijos", rotulo: "hijos" }, { campo: "reloj", rotulo: "reloj", clase: "cuenta" }]
        : [{ campo: "s", rotulo: "s" }, { campo: "u", rotulo: "u" }, { campo: "padre", rotulo: "padre" },
           { campo: "i", rotulo: "i" }, { campo: "v", rotulo: "v" }, { campo: "hijos", rotulo: "hijos" },
           { campo: "reloj", rotulo: "reloj", clase: "cuenta" }];
      Motor.iniciar({
        codigo: EJERCICIO.codigoDe(version), simular: EJERCICIO.simular,
        chips: chips, paramsIniciales: paramsActuales(), alPintar: alPintar
      });
    }

    arrancar();

    Motor.prediccionNumerica(function (valor, params) {
      var res = EJERCICIO.resultadoDe(params.G, "recursiva");
      var arts = res.articulaciones, n = params.G.length;
      if (valor === arts.length) {
        return { ok: true, msg: "Correcto: " + arts.length + ", los vértices {" + arts.join(", ") +
          "}. Ejecute y mire en qué línea se marca cada uno: la raíz sale de la línea de los dos hijos, los demás de la comparación low[v] ≥ d[u]." };
      }
      if (valor === res.puentes.length) {
        return { ok: false, msg: "Ese es el número de puentes, " + res.puentes.length + ". Los puentes son aristas; la pregunta es por vértices, y un vértice puede ser punto de articulación sin tener ningún puente al lado." };
      }
      if (valor === n) {
        return { ok: false, msg: "Ese es el número de vértices. Las hojas del árbol de la profundidad nunca son puntos de articulación: no tienen hijos que dejar aparte." };
      }
      return { ok: false, msg: "No coincide. Quite mentalmente cada vértice de grado 2 o más y mire si algún pedazo queda incomunicado del resto; la ejecución de abajo lo confirma." };
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        marcarBotones("presets-grafo", "data-preset", String(presetActual));
        Motor.limpiarVeredicto();
        Motor.reiniciar(paramsActuales());
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (btn) {
      btn.addEventListener("click", function () {
        version = btn.getAttribute("data-version");
        marcarBotones("presets-version", "data-version", version);
        arrancar();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-raiz button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        var v = document.getElementById("veredicto-raiz");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Correcto. En el primer grafo la raíz 0 tiene dos hijos, el 1 y el 4, y es punto de articulación. En el segundo tiene un solo hijo aunque dos vecinos: el 3 se descubre desde el 2, y 0–3 es una arista de retroceso. Con un hijo, todo lo demás cuelga de él y quitar la raíz no separa nada.";
        } else if (op === "vecinos") {
          v.className = "veredicto mal";
          v.textContent = "Contar vecinos no sirve. En el segundo grafo la raíz tiene dos vecinos, el 1 y el 3, y no es punto de articulación: el recorrido llega al 3 por el 1, el 2, y la arista 0–3 resulta de retroceso. Lo que cuenta son los hijos en el árbol.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "La raíz no pasa por la comparación low[v] ≥ d[u]. Para la raíz d[u] = 1, el valor más bajo que existe, y la desigualdad se cumpliría siempre, con un hijo o con diez. Por eso se decide aparte, con los hijos.";
        }
      });
    });
  })();
}
