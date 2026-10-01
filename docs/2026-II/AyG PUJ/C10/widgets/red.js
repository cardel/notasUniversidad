/* Ejercicio interactivo final (clase 10): la red de fibra de un campus, quince
   edificios y veinte enlaces. Los calculos salen del codigo de la clase:
   cortes y cortes_con_pila, y se contrastan con quitar la pieza y contar
   componentes, que es la definicion. */
var EJERCICIO = (function () {
  var N = 15;
  var NOMBRES = ["Centro de datos", "Rectoría", "Biblioteca", "Ingenierías", "Ciencias",
                 "Laboratorios", "Auditorio", "Coliseo", "Cafetería", "Residencias A",
                 "Residencias B", "Enfermería", "Parqueadero", "Portería", "Taller"];
  var ARISTAS = [[0, 1], [1, 2], [2, 3], [0, 3], [1, 3],
                 [3, 4], [4, 5], [5, 6], [4, 6],
                 [2, 7], [7, 8], [8, 9], [7, 9], [9, 10], [10, 11], [9, 11],
                 [6, 12], [12, 13], [13, 14], [12, 14]];

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

  function nuevoEstado(n) {
    var e = { d: [], low: [], esArt: [], puentes: [], reloj: [0], padre: [], hijos: [] }, i = 0;
    while (i < n) { e.d.push(0); e.low.push(0); e.esArt.push(false); e.padre.push(-1); e.hijos.push([]); i = i + 1; }
    return e;
  }

  function marcados(esArt) {
    var res = [], u = 0;
    while (u < esArt.length) { if (esArt[u]) { res.push(u); } u = u + 1; }
    return res;
  }

  function descubrir(e, u) {
    e.reloj[0] = e.reloj[0] + 1;
    e.d[u] = e.reloj[0];
    e.low[u] = e.reloj[0];
  }

  function revisarHijo(e, u, v, esRaiz) {
    e.low[u] = Math.min(e.low[u], e.low[v]);
    if (!esRaiz && e.low[v] >= e.d[u]) { e.esArt[u] = true; }
    if (e.low[v] > e.d[u]) { e.puentes.push([u, v]); }
  }

  /* cortes: la profundidad recursiva. */
  function cortes(G) {
    var n = G.length, e = nuevoEstado(n), u;
    function aux(x, padre) {
      descubrir(e, x);
      var hijos = 0, j = 0;
      while (j < G[x].length) {
        var v = G[x][j];
        if (e.d[v] === 0) {
          hijos = hijos + 1;
          e.padre[v] = x; e.hijos[x].push(v);
          aux(v, x);
          revisarHijo(e, x, v, padre === -1);
        } else if (v !== padre) {
          e.low[x] = Math.min(e.low[x], e.d[v]);
        }
        j = j + 1;
      }
      if (padre === -1 && hijos >= 2) { e.esArt[x] = true; }
    }
    for (u = 0; u < n; u = u + 1) { if (e.d[u] === 0) { aux(u, -1); } }
    return { articulaciones: marcados(e.esArt), puentes: e.puentes, d: e.d, low: e.low, padre: e.padre, hijos: e.hijos };
  }

  /* cortes_con_pila: la misma busqueda con las llamadas en una lista. */
  function cortesConPila(G) {
    var n = G.length, e = nuevoEstado(n), s;
    function desde(raiz) {
      descubrir(e, raiz);
      var hijos = 0, llamadas = [[raiz, -1, 0]];
      while (llamadas.length > 0) {
        var t = llamadas[llamadas.length - 1];
        var u = t[0], padre = t[1], i = t[2];
        if (i < G[u].length) {
          t[2] = i + 1;
          var v = G[u][i];
          if (e.d[v] === 0) {
            if (u === raiz) { hijos = hijos + 1; }
            descubrir(e, v);
            llamadas.push([v, u, 0]);
          } else if (v !== padre) {
            e.low[u] = Math.min(e.low[u], e.d[v]);
          }
        } else {
          llamadas.pop();
          if (padre !== -1) { revisarHijo(e, padre, u, padre === raiz); }
        }
      }
      return hijos;
    }
    for (s = 0; s < n; s = s + 1) {
      if (e.d[s] === 0 && desde(s) >= 2) { e.esArt[s] = true; }
    }
    return { articulaciones: marcados(e.esArt), puentes: e.puentes, d: e.d, low: e.low };
  }

  function componentesConexos(G, sinVertice) {
    var n = G.length, visto = [], comps = [], i = 0;
    while (i < n) { visto.push(false); i = i + 1; }
    i = 0;
    while (i < n) {
      if (i !== sinVertice && !visto[i]) {
        var actual = [], pila = [i];
        visto[i] = true;
        while (pila.length > 0) {
          var w = pila.pop();
          actual.push(w);
          var j = 0;
          while (j < G[w].length) {
            var x = G[w][j];
            if (x !== sinVertice && !visto[x]) { visto[x] = true; pila.push(x); }
            j = j + 1;
          }
        }
        actual.sort(function (a, b) { return a - b; });
        comps.push(actual);
      }
      i = i + 1;
    }
    return comps;
  }

  function sinVertice(n, aristas, x) {
    return componentesConexos(construir(n, aristas), x);
  }

  function sinArista(n, aristas, k) {
    var resto = [], i = 0;
    while (i < aristas.length) { if (i !== k) { resto.push(aristas[i]); } i = i + 1; }
    return componentesConexos(construir(n, resto), -1);
  }

  /* Por definicion: quitar la pieza y contar componentes. */
  function articulacionesPorDefinicion(n, aristas) {
    var base = componentesConexos(construir(n, aristas), -1).length, res = [], x = 0;
    while (x < n) {
      if (sinVertice(n, aristas, x).length > base) { res.push(x); }
      x = x + 1;
    }
    return res;
  }

  function puentesPorDefinicion(n, aristas) {
    var base = componentesConexos(construir(n, aristas), -1).length, res = [], k = 0;
    while (k < aristas.length) {
      if (sinArista(n, aristas, k).length > base) { res.push(k); }
      k = k + 1;
    }
    return res;
  }

  function indiceDeArista(aristas, a, b) {
    var k = 0, idx = -1;
    while (k < aristas.length) {
      if ((aristas[k][0] === a && aristas[k][1] === b) || (aristas[k][0] === b && aristas[k][1] === a)) { idx = k; }
      k = k + 1;
    }
    return idx;
  }

  /* Camino entre los extremos de la arista k sin usarla, si existe. */
  function caminoAlterno(n, aristas, k) {
    var origen = aristas[k][0], destino = aristas[k][1], resto = [], i = 0;
    while (i < aristas.length) { if (i !== k) { resto.push(aristas[i]); } i = i + 1; }
    var G = construir(n, resto), previo = [], visto = [], cola = [origen], cabeza = 0;
    i = 0;
    while (i < n) { previo.push(-1); visto.push(false); i = i + 1; }
    visto[origen] = true;
    while (cabeza < cola.length) {
      var w = cola[cabeza];
      cabeza = cabeza + 1;
      var j = 0;
      while (j < G[w].length) {
        if (!visto[G[w][j]]) { visto[G[w][j]] = true; previo[G[w][j]] = w; cola.push(G[w][j]); }
        j = j + 1;
      }
    }
    var camino = null;
    if (visto[destino]) {
      camino = [destino];
      var t = destino;
      while (previo[t] !== -1) { t = previo[t]; camino.push(t); }
      camino.reverse();
    }
    return camino;
  }

  return {
    n: N, nombres: NOMBRES, aristas: ARISTAS, construir: construir,
    cortes: cortes, cortesConPila: cortesConPila, componentesConexos: componentesConexos,
    sinVertice: sinVertice, sinArista: sinArista,
    articulacionesPorDefinicion: articulacionesPorDefinicion, puentesPorDefinicion: puentesPorDefinicion,
    indiceDeArista: indiceDeArista, caminoAlterno: caminoAlterno
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var N = EJERCICIO.n, NOMBRES = EJERCICIO.nombres, ARISTAS = EJERCICIO.aristas;
    var POS = [[0.4, 4.0], [1.6, 5.0], [3.0, 4.0], [1.6, 3.0], [1.6, 1.8], [0.6, 0.8], [2.6, 0.8],
               [4.4, 4.0], [5.4, 5.0], [5.8, 3.6], [7.2, 4.4], [7.2, 2.8], [4.0, 0.8], [5.0, 1.7], [5.0, -0.1]];
    var COLORES = [
      { relleno: "#e7f2e8", borde: "#2e7d32" },
      { relleno: "#fdf1dc", borde: "#e8a13d" },
      { relleno: "#e3edf8", borde: "#1f5fa8" },
      { relleno: "#efe4f7", borde: "#6b3fa0" },
      { relleno: "#e0f2f1", borde: "#00695c" }
    ];
    var quitado = null;      /* { tipo: "v"|"e", k } */
    var corrida = null;      /* resultado de cortes, una vez ejecutado */
    var extra = null;        /* enlace de prueba [a, b] */

    function conj(c) { return "{" + c.join(", ") + "}"; }
    function listaDe(l) { return l.map(conj).join(", "); }
    function nombre(v) { return v + " " + NOMBRES[v]; }

    function componentesVisibles() {
      var comps;
      if (quitado === null) { comps = EJERCICIO.componentesConexos(EJERCICIO.construir(N, ARISTAS), -1); }
      else if (quitado.tipo === "v") { comps = EJERCICIO.sinVertice(N, ARISTAS, quitado.k); }
      else { comps = EJERCICIO.sinArista(N, ARISTAS, quitado.k); }
      return comps;
    }

    function dibujar() {
      var ancho = 780, alto = 420, r = 15, i = 0;
      var minX = POS[0][0], maxX = POS[0][0], minY = POS[0][1], maxY = POS[0][1];
      while (i < N) {
        if (POS[i][0] < minX) { minX = POS[i][0]; }
        if (POS[i][0] > maxX) { maxX = POS[i][0]; }
        if (POS[i][1] < minY) { minY = POS[i][1]; }
        if (POS[i][1] > maxY) { maxY = POS[i][1]; }
        i = i + 1;
      }
      var mx = 60, my = 36;
      var esc = Math.min((ancho - 2 * mx) / (maxX - minX), (alto - 2 * my) / (maxY - minY));
      var ox = (ancho - esc * (maxX - minX)) / 2, oy = (alto - esc * (maxY - minY)) / 2;
      function X(k) { return ox + (POS[k][0] - minX) * esc; }
      function Y(k) { return oy + (maxY - POS[k][1]) * esc; }

      var comps = componentesVisibles();
      var comp = [], c = 0;
      i = 0;
      while (i < N) { comp.push(-1); i = i + 1; }
      while (c < comps.length) {
        var t = 0;
        while (t < comps[c].length) { comp[comps[c][t]] = c; t = t + 1; }
        c = c + 1;
      }
      var puentesSet = {}, artSet = {};
      if (corrida !== null) {
        corrida.puentes.forEach(function (p) { puentesSet[Math.min(p[0], p[1]) + "-" + Math.max(p[0], p[1])] = true; });
        corrida.articulaciones.forEach(function (a) { artSet[a] = true; });
      }

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:820px'>";
      var e = 0;
      while (e < ARISTAS.length) {
        var u = ARISTAS[e][0], v = ARISTAS[e][1];
        var fuera = (quitado !== null && quitado.tipo === "e" && quitado.k === e) ||
                    (quitado !== null && quitado.tipo === "v" && (quitado.k === u || quitado.k === v));
        var esPuente = puentesSet[Math.min(u, v) + "-" + Math.max(u, v)];
        var estilo = fuera ? " stroke-dasharray='5,4' stroke='#c9ced6'" : (esPuente ? " stroke='#b3261e'" : " stroke='#9aa3ad'");
        svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) + "'" + estilo +
               " stroke-width='" + (fuera ? 2 : (esPuente ? 4.4 : 2)) + "'/>";
        e = e + 1;
      }
      if (extra !== null) {
        svg += "<line x1='" + X(extra[0]) + "' y1='" + Y(extra[0]) + "' x2='" + X(extra[1]) + "' y2='" + Y(extra[1]) +
               "' stroke='#1f5fa8' stroke-width='2.6' stroke-dasharray='2,5' stroke-linecap='round'/>";
      }
      var w = 0;
      while (w < N) {
        var fueraV = quitado !== null && quitado.tipo === "v" && quitado.k === w;
        var col = fueraV ? { relleno: "#f1f3f6", borde: "#c9ced6" }
                         : (comp[w] >= 0 ? COLORES[comp[w] % COLORES.length] : { relleno: "#ffffff", borde: "#d8dee6" });
        var borde = artSet[w] ? "#b3261e" : col.borde;
        svg += "<circle cx='" + X(w) + "' cy='" + Y(w) + "' r='" + r + "' fill='" + (artSet[w] ? "#fbe9e7" : col.relleno) +
               "' stroke='" + borde + "' stroke-width='" + (artSet[w] ? 3.6 : 2.2) + "'" + (fueraV ? " stroke-dasharray='4,3'" : "") + "/>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) + 4.5) + "' text-anchor='middle' font-size='13' font-weight='700' fill='" +
               (fueraV ? "#c9ced6" : "#24292f") + "'>" + w + "</text>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) + r + 12) + "' text-anchor='middle' font-size='10.5' fill='" +
               (fueraV ? "#c9ced6" : "#4b5563") + "' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" + NOMBRES[w] + "</text>";
        w = w + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;

      var rot;
      var cuantos = comps.length + (comps.length === 1 ? " componente" : " componentes");
      if (quitado === null) { rot = "Red completa: " + cuantos + "."; }
      else if (quitado.tipo === "v") { rot = "Sin " + nombre(quitado.k) + ": " + cuantos + ", " + listaDe(comps) + "."; }
      else { rot = "Sin el enlace " + ARISTAS[quitado.k][0] + "–" + ARISTAS[quitado.k][1] + ": " + cuantos + ", " + listaDe(comps) + "."; }
      document.getElementById("ver-quitado").textContent = rot;
    }

    function armarListas() {
      var cajaV = document.getElementById("lista-vertices");
      var cajaE = document.getElementById("lista-aristas");
      var html = "", i = 0;
      while (i < N) {
        html += "<label class='fila-item'><input type='checkbox' data-v='" + i + "'> <b>" + i + "</b> " + NOMBRES[i] +
                " <button type='button' class='mini' data-quitav='" + i + "'>quitarlo</button>" +
                " <span class='resultado' id='rv-" + i + "'></span></label>";
        i = i + 1;
      }
      cajaV.innerHTML = html;
      html = ""; i = 0;
      while (i < ARISTAS.length) {
        html += "<label class='fila-item'><input type='checkbox' data-e='" + i + "'> <b>" + ARISTAS[i][0] + "–" + ARISTAS[i][1] + "</b> " +
                NOMBRES[ARISTAS[i][0]] + " – " + NOMBRES[ARISTAS[i][1]] +
                " <button type='button' class='mini' data-quitae='" + i + "'>quitarlo</button>" +
                " <span class='resultado' id='re-" + i + "'></span></label>";
        i = i + 1;
      }
      cajaE.innerHTML = html;
      Array.prototype.forEach.call(document.querySelectorAll("[data-quitav]"), function (b) {
        b.addEventListener("click", function (ev) {
          ev.preventDefault(); ev.stopPropagation();
          var k = parseInt(b.getAttribute("data-quitav"), 10);
          quitado = (quitado !== null && quitado.tipo === "v" && quitado.k === k) ? null : { tipo: "v", k: k };
          dibujar();
        });
      });
      Array.prototype.forEach.call(document.querySelectorAll("[data-quitae]"), function (b) {
        b.addEventListener("click", function (ev) {
          ev.preventDefault(); ev.stopPropagation();
          var k = parseInt(b.getAttribute("data-quitae"), 10);
          quitado = (quitado !== null && quitado.tipo === "e" && quitado.k === k) ? null : { tipo: "e", k: k };
          dibujar();
        });
      });
    }

    function marcasDeVertices() {
      var res = [], i = 0;
      while (i < N) { if (document.querySelector("input[data-v='" + i + "']").checked) { res.push(i); } i = i + 1; }
      return res;
    }
    function marcasDeAristas() {
      var res = [], i = 0;
      while (i < ARISTAS.length) { if (document.querySelector("input[data-e='" + i + "']").checked) { res.push(i); } i = i + 1; }
      return res;
    }

    function tablaDeNumeros(res) {
      var filas = "", v = 0;
      while (v < N) {
        var padre = res.padre[v] === -1 ? "raíz" : res.padre[v];
        filas += "<tr><td>" + v + " " + NOMBRES[v] + "</td><td>" + res.d[v] + "</td><td>" + res.low[v] + "</td><td>" + padre +
                 "</td><td>" + (res.articulaciones.indexOf(v) >= 0 ? "punto de articulación" : "") + "</td></tr>";
        v = v + 1;
      }
      return filas;
    }

    function correr() {
      var G = EJERCICIO.construir(N, ARISTAS);
      var res = EJERCICIO.cortes(G);
      var pila = EJERCICIO.cortesConPila(G);
      corrida = res;
      var igual = JSON.stringify(res.articulaciones) === JSON.stringify(pila.articulaciones) &&
                  JSON.stringify(res.puentes) === JSON.stringify(pila.puentes);
      document.getElementById("ver-corrida").innerHTML =
        "<p><b>cortes devuelve:</b> puntos de articulación <code>[" + res.articulaciones.join(", ") + "]</code> y puentes <code>" +
        res.puentes.map(function (p) { return "(" + p[0] + ", " + p[1] + ")"; }).join(", ") + "</code>.<br>" +
        "<b>cortes_con_pila</b> " + (igual ? "devuelve exactamente lo mismo." : "devuelve otra cosa.") + "</p>";
      document.getElementById("cuerpo-numeros").innerHTML = tablaDeNumeros(res);
      document.getElementById("tabla-numeros").style.display = "block";
      dibujar();
      comparar(res);
    }

    function textoPorQue(res, u) {
      var t = "";
      if (res.padre[u] === -1) {
        t = "es la raíz y tiene " + res.hijos[u].length + " hijos en el árbol";
      } else {
        var k = 0, h = -1;
        while (k < res.hijos[u].length) { if (res.low[res.hijos[u][k]] >= res.d[u] && h === -1) { h = res.hijos[u][k]; } k = k + 1; }
        t = "su hijo " + h + " tiene low = " + res.low[h] + " ≥ d = " + res.d[u];
      }
      return t;
    }

    function comparar(res) {
      var arts = res.articulaciones, i = 0, aciertosV = 0, aciertosE = 0;
      var marV = marcasDeVertices(), marE = marcasDeAristas();
      while (i < N) {
        var marcado = marV.indexOf(i) >= 0, es = arts.indexOf(i) >= 0;
        var lista = EJERCICIO.sinVertice(N, ARISTAS, i);
        var celda = document.getElementById("rv-" + i);
        celda.textContent = (marcado === es ? "✓ " : "✗ ") +
          (es ? "sí: sin él quedan " + lista.length + " componentes, " + lista.map(conj).join(", ") + "; cortes lo marca porque " + textoPorQue(res, i)
              : "no: sin él la red sigue de una pieza");
        celda.className = "resultado " + (marcado === es ? "bien" : "mal");
        if (marcado === es) { aciertosV = aciertosV + 1; }
        i = i + 1;
      }
      var idxPuentes = res.puentes.map(function (p) { return EJERCICIO.indiceDeArista(ARISTAS, p[0], p[1]); });
      i = 0;
      while (i < ARISTAS.length) {
        var marcadoE = marE.indexOf(i) >= 0, esE = idxPuentes.indexOf(i) >= 0;
        var celdaE = document.getElementById("re-" + i);
        var texto;
        if (esE) {
          var lE = EJERCICIO.sinArista(N, ARISTAS, i);
          var p0 = ARISTAS[i][0], p1 = ARISTAS[i][1];
          var padreU = res.padre[p1] === p0 ? p0 : p1, hijoV = res.padre[p1] === p0 ? p1 : p0;
          texto = "sí: sin él quedan " + lE.length + " componentes, " + lE.map(conj).join(", ") +
                  "; low[" + hijoV + "] = " + res.low[hijoV] + " > d[" + padreU + "] = " + res.d[padreU];
        } else {
          var camino = EJERCICIO.caminoAlterno(N, ARISTAS, i);
          texto = "no: sin él todavía va " + camino.join(" – ") + ", así que está en un ciclo";
        }
        celdaE.textContent = (marcadoE === esE ? "✓ " : "✗ ") + texto;
        celdaE.className = "resultado " + (marcadoE === esE ? "bien" : "mal");
        if (marcadoE === esE) { aciertosE = aciertosE + 1; }
        i = i + 1;
      }
      var v = document.getElementById("veredicto-comparar");
      var todo = aciertosV === N && aciertosE === ARISTAS.length;
      v.className = todo ? "veredicto bien" : "veredicto mal";
      v.textContent = todo
        ? "Todo coincide: " + arts.length + " puntos de articulación y " + res.puentes.length + " puentes. Marcó a mano lo que cortes encuentra en una pasada."
        : "Coinciden " + aciertosV + " de " + N + " vértices y " + aciertosE + " de " + ARISTAS.length + " enlaces. Al lado de cada fila queda lo que pasa al quitar la pieza; las que marcó de más o dejó sin marcar traen el motivo.";
    }

    document.getElementById("btn-correr").addEventListener("click", correr);

    document.getElementById("btn-reforzar").addEventListener("click", function () {
      var a = parseInt(document.getElementById("sel-a").value, 10);
      var b = parseInt(document.getElementById("sel-b").value, 10);
      var v = document.getElementById("veredicto-refuerzo");
      if (a === b) {
        v.className = "veredicto mal"; v.textContent = "Escoja dos edificios distintos."; return;
      }
      if (EJERCICIO.indiceDeArista(ARISTAS, a, b) >= 0) {
        v.className = "veredicto mal"; v.textContent = "Ese enlace ya existe. Escoja otro par."; return;
      }
      var antes = EJERCICIO.cortes(EJERCICIO.construir(N, ARISTAS));
      var nuevas = ARISTAS.concat([[a, b]]);
      var despues = EJERCICIO.cortes(EJERCICIO.construir(N, nuevas));
      extra = [a, b];
      dibujar();
      var mejora = antes.articulaciones.length + antes.puentes.length - despues.articulaciones.length - despues.puentes.length;
      v.className = mejora > 0 ? "veredicto bien" : "veredicto mal";
      v.innerHTML = "Con el enlace " + a + "–" + b + " (" + NOMBRES[a] + " – " + NOMBRES[b] + ") y <code>cortes</code> otra vez: " +
        despues.articulaciones.length + (despues.articulaciones.length === 1 ? " punto" : " puntos") + " de articulación, <code>[" + despues.articulaciones.join(", ") + "]</code>, y " +
        despues.puentes.length + (despues.puentes.length === 1 ? " puente" : " puentes") + ", contra " + antes.articulaciones.length + " y " + antes.puentes.length + " antes. " +
        (mejora > 0 ? "Quita " + mejora + (mejora === 1 ? " punto único de falla." : " puntos únicos de falla.") : "No quita ningún punto único de falla.");
    });
    document.getElementById("btn-quitar-extra").addEventListener("click", function () {
      extra = null;
      var v = document.getElementById("veredicto-refuerzo");
      v.className = "veredicto"; v.textContent = "";
      dibujar();
    });

    var opciones = "", o = 0;
    while (o < N) { opciones += "<option value='" + o + "'>" + o + " " + NOMBRES[o] + "</option>"; o = o + 1; }
    document.getElementById("sel-a").innerHTML = opciones;
    document.getElementById("sel-b").innerHTML = opciones;
    document.getElementById("sel-b").value = "7";

    armarListas();
    dibujar();
  })();
}
