/* Ejercicio interactivo: el criterio de articulacion y de puente (clase 10).
   Cada escenario trae el grafo, el arbol de la profundidad que produce
   cortes (vecinos de menor a mayor, raiz en el 0) y los numeros que decide
   la comparacion. La verdad se calcula con los mismos valores d y low que
   da el codigo de la clase, y se verifica quitando la pieza. */
var EJERCICIO = (function () {
  var ESCENARIOS = [
    { n: 6, aristas: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 3]], u: 1, v: 3,
      pos: [[0.0, 1.0], [1.2, 1.0], [1.2, 2.2], [2.4, 1.0], [3.4, 1.9], [3.4, 0.1]] },
    { n: 5, aristas: [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [4, 2]], u: 1, v: 2,
      pos: [[0.0, 1.7], [0.0, 0.3], [1.2, 1.0], [2.4, 1.7], [2.4, 0.3]] },
    { n: 5, aristas: [[0, 1], [1, 2], [2, 3], [3, 1], [3, 4]], u: 1, v: 2,
      pos: [[0.0, 1.0], [1.1, 1.0], [2.2, 1.8], [2.2, 0.2], [3.4, 0.2]] },
    { n: 5, aristas: [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4]], u: 0, v: 1,
      pos: [[0.0, 1.0], [1.2, 1.0], [2.4, 1.9], [2.4, 0.1], [3.6, 1.0]] },
    { n: 6, aristas: [[0, 1], [1, 2], [2, 3], [3, 1], [0, 4], [4, 5]], u: 0, v: 1,
      pos: [[2.0, 1.0], [1.0, 1.0], [0.2, 1.8], [0.2, 0.2], [3.0, 1.0], [4.0, 1.0]] },
    { n: 5, aristas: [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4]], u: 2, v: 3,
      pos: [[0.0, 1.7], [0.0, 0.3], [1.2, 1.0], [2.4, 1.0], [3.6, 1.0]] },
    { n: 6, aristas: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [2, 5]], u: 0, v: 1,
      pos: [[0.0, 1.0], [0.9, 2.0], [2.2, 1.8], [2.2, 0.2], [0.9, 0.0], [3.4, 1.8]] },
    { n: 5, aristas: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 4]], u: 1, v: 2,
      pos: [[1.2, 0.2], [1.2, 1.8], [2.6, 1.8], [2.6, 0.2], [0.0, 1.8]] },
    { n: 6, aristas: [[0, 1], [0, 2], [0, 3], [3, 4], [4, 5], [5, 3]], u: 0, v: 3,
      pos: [[1.4, 1.0], [0.2, 1.8], [0.2, 0.2], [2.6, 1.0], [3.6, 1.9], [3.6, 0.1]] }
  ];

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

  /* cortes, con los datos que el ejercicio necesita: d, low, el padre de
     cada vertice, sus hijos y las aristas de retroceso. */
  function analizar(G) {
    var n = G.length, d = [], low = [], padreDe = [], hijosDe = [], retro = [], reloj = 0;
    var esArt = [], puentes = [], i = 0;
    while (i < n) { d.push(0); low.push(0); padreDe.push(-1); hijosDe.push([]); esArt.push(false); i = i + 1; }
    function visit(u, padre) {
      reloj = reloj + 1;
      d[u] = reloj;
      low[u] = reloj;
      var hijos = 0, j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        if (d[v] === 0) {
          hijos = hijos + 1;
          padreDe[v] = u;
          hijosDe[u].push(v);
          visit(v, u);
          low[u] = Math.min(low[u], low[v]);
          if (padre !== -1 && low[v] >= d[u]) { esArt[u] = true; }
          if (low[v] > d[u]) { puentes.push([u, v]); }
        } else if (v !== padre) {
          if (d[v] < d[u]) { retro.push([u, v]); }
          low[u] = Math.min(low[u], d[v]);
        }
        j = j + 1;
      }
      if (padre === -1 && hijos >= 2) { esArt[u] = true; }
    }
    i = 0;
    while (i < n) { if (d[i] === 0) { visit(i, -1); } i = i + 1; }
    var arts = [];
    i = 0;
    while (i < n) { if (esArt[i]) { arts.push(i); } i = i + 1; }
    return { d: d, low: low, padre: padreDe, hijos: hijosDe, retro: retro, articulaciones: arts, puentes: puentes };
  }

  /* Lo que el estudiante ve de un escenario y las respuestas correctas. */
  function datos(e) {
    var G = construir(e.n, e.aristas);
    var a = analizar(G);
    var u = e.u, v = e.v;
    var esRaiz = a.padre[u] === -1;
    var hijos = a.hijos[u];
    var otros = [], k = 0;
    while (k < hijos.length) {
      if (hijos[k] !== v && a.low[hijos[k]] >= a.d[u]) { otros.push(hijos[k]); }
      k = k + 1;
    }
    return {
      G: G, analisis: a,
      du: a.d[u], lowv: a.low[v], lowu: a.low[u], dv: a.d[v],
      esRaiz: esRaiz, hijos: hijos, otrosHijosArt: otros,
      articulacion: esRaiz ? hijos.length >= 2 : a.low[v] >= a.d[u],
      puente: a.low[v] > a.d[u]
    };
  }

  function alcanzable(n, aristas, origen, destino, sinVertice, sinArista) {
    var G = [], i = 0;
    while (i < n) { G.push([]); i = i + 1; }
    i = 0;
    while (i < aristas.length) {
      var a = aristas[i][0], b = aristas[i][1];
      var fuera = a === sinVertice || b === sinVertice || i === sinArista;
      if (!fuera) { G[a].push(b); G[b].push(a); }
      i = i + 1;
    }
    var visto = [], pila = [origen];
    i = 0;
    while (i < n) { visto.push(false); i = i + 1; }
    visto[origen] = true;
    while (pila.length > 0) {
      var w = pila.pop(), j = 0;
      while (j < G[w].length) {
        if (!visto[G[w][j]]) { visto[G[w][j]] = true; pila.push(G[w][j]); }
        j = j + 1;
      }
    }
    return visto[destino];
  }

  function componentesSinVertice(n, aristas, x) {
    var visto = [], total = 0, s = 0;
    while (s < n) { visto.push(false); s = s + 1; }
    s = 0;
    while (s < n) {
      if (s !== x && !visto[s]) {
        total = total + 1;
        var q = 0;
        while (q < n) {
          if (q !== x && !visto[q] && alcanzable(n, aristas, s, q, x, -1)) { visto[q] = true; }
          q = q + 1;
        }
      }
      s = s + 1;
    }
    return total;
  }

  /* La definicion ejecutada: sin u, v queda aparte de la raiz (u no raiz); u raiz:
     quitarla deja mas de un componente. Para el puente: sin la arista, v queda
     aparte de la raiz. */
  function verdadPorDefinicion(e) {
    var d = datos(e), u = e.u, v = e.v, r = 0;
    var art, k = 0, idx = -1;
    while (k < e.aristas.length) {
      if ((e.aristas[k][0] === u && e.aristas[k][1] === v) || (e.aristas[k][0] === v && e.aristas[k][1] === u)) { idx = k; }
      k = k + 1;
    }
    if (d.esRaiz) {
      art = componentesSinVertice(e.n, e.aristas, u) > 1;
    } else {
      art = !alcanzable(e.n, e.aristas, r, v, u, -1);
    }
    var puente = !alcanzable(e.n, e.aristas, r, v, -1, idx);
    return { articulacion: art, puente: puente };
  }

  function nombresHijos(lista) {
    return lista.join(", ");
  }

  /* Pregunta 1: ¿u es punto de articulacion (por este hijo, si no es raiz)? */
  function evaluarArticulacion(e, resp) {
    var d = datos(e), u = e.u, v = e.v, msg, ok = resp === d.articulacion;
    if (d.esRaiz) {
      if (d.articulacion) {
        msg = ok
          ? "Correcto. u = " + u + " es la raíz y tiene " + d.hijos.length + " hijos en el árbol, " + nombresHijos(d.hijos) +
            ". Entre subárboles de hijos distintos no hay aristas, porque si las hubiera uno se habría descubierto desde el otro. Sin la raíz quedan separados."
          : "La raíz " + u + " tiene " + d.hijos.length + " hijos en el árbol: " + nombresHijos(d.hijos) +
            ". Entre sus subárboles no hay ninguna arista, porque si la hubiera uno se habría descubierto desde el otro. Sin la raíz quedan separados, y con dos hijos basta.";
      } else {
        msg = ok
          ? "Correcto. u = " + u + " es la raíz y tiene un solo hijo en el árbol, el " + d.hijos[0] + ". Todo lo demás cuelga de él, así que quitar la raíz no separa nada."
          : "u = " + u + " es la raíz y tiene un solo hijo en el árbol, el " + d.hijos[0] +
            ". La condición low[v] ≥ d[u] es la de los vértices que no son raíz: en la raíz d[u] = 1, el menor valor posible, y se cumple siempre, así que no decide nada. La raíz necesita dos hijos." +
            (e.aristas.filter(function (a) { return a[0] === u || a[1] === u; }).length > 1
              ? " Aquí tiene más de un vecino pero un solo hijo: el otro vecino se descubre desde el " + d.hijos[0] + ", y su arista con la raíz es de retroceso."
              : "");
      }
    } else if (d.articulacion) {
      if (ok) {
        msg = "Correcto. low[" + v + "] = " + d.lowv + " y d[" + u + "] = " + d.du + ": " + d.lowv + " ≥ " + d.du +
          ", así que el subárbol de " + v + " no llega más arriba que " + u + ". Sin " + u + " queda aparte.";
      } else if (d.lowv === d.du) {
        msg = "Con low[" + v + "] = " + d.lowv + " y d[" + u + "] = " + d.du + " la comparación es de igualdad, y la condición es ≥, no >. " +
          "Si el subárbol de " + v + " vuelve a " + u + " pero no sube más, quitar " + u + " lo deja aparte igual. El > es la prueba del puente.";
      } else if (d.lowu < d.du) {
        msg = "La comparación usa low[" + v + "] = " + d.lowv + ", el del hijo, no low[" + u + "] = " + d.lowu + ". El low[" + u + "] ya incluye lo que alcanza el propio " + u +
          " hacia arriba y esconde que el subárbol de " + v + " no sube. Con " + d.lowv + " ≥ " + d.du + " el vértice " + u + " sí es punto de articulación.";
      } else {
        msg = "low[" + v + "] = " + d.lowv + " ≥ d[" + u + "] = " + d.du + ": el subárbol de " + v + " no llega más arriba que " + u + ", y sin " + u + " queda aparte.";
      }
    } else {
      if (ok) {
        msg = "Correcto. low[" + v + "] = " + d.lowv + " < d[" + u + "] = " + d.du +
          ": una arista del subárbol de " + v + " sube a un vértice descubierto antes que " + u + ", y sin " + u + " el subárbol sigue conectado al resto." +
          (d.otrosHijosArt.length > 0
            ? " El vértice " + u + " sí es punto de articulación, pero por otro hijo, el " + d.otrosHijosArt[0] + " (low[" + d.otrosHijosArt[0] + "] = " + d.analisis.low[d.otrosHijosArt[0]] + " ≥ " + d.du + "), no por este."
            : "");
      } else {
        msg = "low[" + v + "] = " + d.lowv + " < d[" + u + "] = " + d.du + ": el subárbol de " + v + " tiene una arista que sube a un vértice descubierto antes que " + u +
          ", y sin " + u + " sigue conectado al resto. Lo que importa no es que haya una arista de retroceso sino hasta dónde sube." +
          (d.otrosHijosArt.length > 0
            ? " El vértice " + u + " sí es punto de articulación, pero por otro hijo, el " + d.otrosHijosArt[0] + " (low[" + d.otrosHijosArt[0] + "] = " + d.analisis.low[d.otrosHijosArt[0]] + " ≥ " + d.du + "), no por este."
            : "");
      }
    }
    return { ok: ok, msg: msg, correcta: d.articulacion };
  }

  /* Pregunta 2: ¿(u, v) es puente? */
  function evaluarPuente(e, resp) {
    var d = datos(e), u = e.u, v = e.v, msg, ok = resp === d.puente;
    if (d.puente) {
      if (ok) {
        msg = "Correcto. low[" + v + "] = " + d.lowv + " > d[" + u + "] = " + d.du + ": ninguna arista del subárbol de " + v +
          " llega a " + u + " ni más arriba, y " + u + "–" + v + " es la única conexión." +
          (d.esRaiz ? " Para los puentes no hay excepción de raíz: la misma comparación sirve." : "");
      } else if (d.esRaiz) {
        msg = "Para los puentes no hay excepción de raíz. low[" + v + "] = " + d.lowv + " > d[" + u + "] = " + d.du + ", y ninguna arista del subárbol de " + v + " llega a " + u + ". La salvedad de los dos hijos es de los puntos de articulación.";
      } else if (d.lowu < d.du) {
        msg = "Se compara low[" + v + "] = " + d.lowv + ", el del hijo. Con low[" + u + "] = " + d.lowu + " la prueba no podría dar nunca: low[u] ≤ d[u] siempre, y low[u] > d[u] jamás se cumple. Con el del hijo, " + d.lowv + " > " + d.du + ": la arista es puente.";
      } else {
        msg = "low[" + v + "] = " + d.lowv + " > d[" + u + "] = " + d.du + ": el subárbol de " + v + " no tiene ninguna arista hacia " + u + " ni más arriba. Quitar " + u + "–" + v + " lo separa.";
      }
    } else {
      if (ok) {
        msg = d.lowv === d.du
          ? "Correcto. low[" + v + "] = " + d.lowv + " = d[" + u + "]: el subárbol de " + v + " vuelve a " + u + " y esa arista de retroceso cierra un ciclo con " + u + "–" + v + ". Hace falta >, no ≥."
          : "Correcto. low[" + v + "] = " + d.lowv + " ≤ d[" + u + "] = " + d.du + ": el subárbol de " + v + " vuelve a " + u + " o más arriba, y " + u + "–" + v + " está en un ciclo.";
      } else if (d.lowv === d.du) {
        msg = "Con low[" + v + "] = " + d.lowv + " y d[" + u + "] = " + d.du + " hay igualdad: el subárbol de " + v + " vuelve a " + u + ", y esa arista cierra un ciclo con " + u + "–" + v +
          ". Quitar la arista no desconecta. Un puente exige low[v] > d[u]; el ≥ es la prueba del punto de articulación.";
      } else {
        msg = "low[" + v + "] = " + d.lowv + " < d[" + u + "] = " + d.du + ": una arista del subárbol de " + v + " sube por encima de " + u + ", así que hay otro camino y " + u + "–" + v + " está en un ciclo.";
      }
    }
    return { ok: ok, msg: msg, correcta: d.puente };
  }

  return {
    escenarios: ESCENARIOS, construir: construir, analizar: analizar, datos: datos,
    verdadPorDefinicion: verdadPorDefinicion,
    evaluarArticulacion: evaluarArticulacion, evaluarPuente: evaluarPuente
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var actual = 0;
    var respondidas = [];   /* por escenario: { a: null|bool primera respuesta acertada, p: idem } */
    var i0 = 0;
    while (i0 < EJERCICIO.escenarios.length) { respondidas.push({ a: null, p: null }); i0 = i0 + 1; }

    function tiene(lista, a, b) {
      var k = 0, hay = false;
      while (k < lista.length) {
        if ((lista[k][0] === a && lista[k][1] === b) || (lista[k][0] === b && lista[k][1] === a)) { hay = true; }
        k = k + 1;
      }
      return hay;
    }

    function dibujar() {
      var e = EJERCICIO.escenarios[actual], d = EJERCICIO.datos(e), a = d.analisis;
      var pos = e.pos, n = e.n;
      var ancho = 400, alto = 190, r = 16;
      var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
      while (i < n) {
        if (pos[i][0] < minX) { minX = pos[i][0]; }
        if (pos[i][0] > maxX) { maxX = pos[i][0]; }
        if (pos[i][1] < minY) { minY = pos[i][1]; }
        if (pos[i][1] > maxY) { maxY = pos[i][1]; }
        i = i + 1;
      }
      var mx = 40, my = 34;
      var esc = Math.min((ancho - 2 * mx) / (maxX - minX), (alto - 2 * my) / (maxY - minY));
      var ox = (ancho - esc * (maxX - minX)) / 2, oy = (alto - esc * (maxY - minY)) / 2;
      function X(k) { return ox + (pos[k][0] - minX) * esc; }
      function Y(k) { return oy + (maxY - pos[k][1]) * esc; }
      var arbol = [];
      var w = 0;
      while (w < n) { if (a.padre[w] !== -1) { arbol.push([a.padre[w], w]); } w = w + 1; }

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:430px'>";
      var k = 0;
      while (k < e.aristas.length) {
        var p = e.aristas[k][0], q = e.aristas[k][1];
        var esArbol = tiene(arbol, p, q);
        var resalta = (p === e.u && q === e.v) || (p === e.v && q === e.u);
        var trazo = esArbol ? "#1f5fa8" : "#2e7d32";
        var punteada = esArbol ? "" : " stroke-dasharray='3,5' stroke-linecap='round'";
        if (resalta) {
          svg += "<line x1='" + X(p) + "' y1='" + Y(p) + "' x2='" + X(q) + "' y2='" + Y(q) + "' stroke='#e8a13d' stroke-width='10' opacity='0.5'/>";
        }
        svg += "<line x1='" + X(p) + "' y1='" + Y(p) + "' x2='" + X(q) + "' y2='" + Y(q) + "' stroke='" + trazo +
               "' stroke-width='" + (esArbol ? 3 : 2.6) + "'" + punteada + "/>";
        k = k + 1;
      }
      w = 0;
      while (w < n) {
        var esU = w === e.u, esV = w === e.v;
        var relleno = esU ? "#fdf1dc" : (esV ? "#e3edf8" : "#ffffff");
        var borde = esU ? "#e8a13d" : (esV ? "#1f5fa8" : "#9aa3ad");
        svg += "<circle cx='" + X(w) + "' cy='" + Y(w) + "' r='" + r + "' fill='" + relleno + "' stroke='" + borde +
               "' stroke-width='" + ((esU || esV) ? 3.6 : 2.2) + "'/>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + w + "</text>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) - r - 5) + "' text-anchor='middle' font-size='11.5' font-family='ui-monospace, monospace' fill='#24292f' stroke='#ffffff' stroke-width='3' paint-order='stroke'>d=" + a.d[w] + "</text>";
        if (esU || esV) {
          svg += "<text x='" + X(w) + "' y='" + (Y(w) + r + 14) + "' text-anchor='middle' font-size='12' font-weight='700' fill='" + borde + "'>" + (esU ? "u" : "v") + "</text>";
        }
        w = w + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function pintarEscenario() {
      var e = EJERCICIO.escenarios[actual], d = EJERCICIO.datos(e);
      document.getElementById("num-escenario").textContent = (actual + 1) + " de " + EJERCICIO.escenarios.length;
      dibujar();
      var filas = "<tr><td><code>u</code>, <code>v</code></td><td>u = " + e.u + ", v = " + e.v + ", hijo de u en el árbol</td></tr>" +
        "<tr><td><code>d[u]</code></td><td>" + d.du + "</td></tr>" +
        "<tr><td><code>low[v]</code></td><td>" + d.lowv + "</td></tr>" +
        "<tr><td><code>low[u]</code></td><td>" + d.lowu + "</td></tr>" +
        "<tr><td>¿u es la raíz?</td><td>" + (d.esRaiz ? "sí, y tiene " + d.hijos.length + (d.hijos.length === 1 ? " hijo" : " hijos") + " en el árbol: " + d.hijos.join(", ") : "no") + "</td></tr>";
      document.getElementById("cuerpo-datos").innerHTML = filas;
      document.getElementById("pregunta-art").textContent = d.esRaiz
        ? "u es la raíz. ¿Es u un punto de articulación?"
        : "¿Hace este hijo, por sí solo, que u sea un punto de articulación?";
      var v1 = document.getElementById("veredicto-art"), v2 = document.getElementById("veredicto-puente");
      v1.className = "veredicto"; v1.textContent = "";
      v2.className = "veredicto"; v2.textContent = "";
      actualizarMarcador();
    }

    function actualizarMarcador() {
      var buenas = 0, hechas = 0, k = 0;
      while (k < respondidas.length) {
        if (respondidas[k].a !== null) { hechas = hechas + 1; if (respondidas[k].a) { buenas = buenas + 1; } }
        if (respondidas[k].p !== null) { hechas = hechas + 1; if (respondidas[k].p) { buenas = buenas + 1; } }
        k = k + 1;
      }
      document.getElementById("marcador").textContent = "Aciertos a la primera: " + buenas + " de " + hechas + " respondidas, sobre " + (2 * EJERCICIO.escenarios.length) + " preguntas.";
    }

    function responder(tipo, valor) {
      var e = EJERCICIO.escenarios[actual];
      var res = tipo === "a" ? EJERCICIO.evaluarArticulacion(e, valor) : EJERCICIO.evaluarPuente(e, valor);
      var v = document.getElementById(tipo === "a" ? "veredicto-art" : "veredicto-puente");
      v.className = res.ok ? "veredicto bien" : "veredicto mal";
      v.textContent = res.msg;
      if (respondidas[actual][tipo] === null) { respondidas[actual][tipo] = res.ok; }
      actualizarMarcador();
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-pregunta]"), function (b) {
      b.addEventListener("click", function () {
        responder(b.getAttribute("data-pregunta"), b.getAttribute("data-resp") === "si");
      });
    });
    document.getElementById("btn-anterior").addEventListener("click", function () {
      actual = (actual + EJERCICIO.escenarios.length - 1) % EJERCICIO.escenarios.length;
      pintarEscenario();
    });
    document.getElementById("btn-siguiente").addEventListener("click", function () {
      actual = (actual + 1) % EJERCICIO.escenarios.length;
      pintarEscenario();
    });
    pintarEscenario();
  })();
}
