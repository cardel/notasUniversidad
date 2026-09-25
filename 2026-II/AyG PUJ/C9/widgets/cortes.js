/* Ejercicio interactivo: puntos de articulacion y puentes (clase 9).
   Las respuestas se obtienen quitando la pieza y volviendo a contar
   componentes con componentes_conexos, que es la definicion misma. */
var EJERCICIO = (function () {
  function componentesConexos(G) {
    var n = G.length, visitado = [], componentes = [], i = 0;
    while (i < n) { visitado.push(false); i = i + 1; }
    function aux(v, actual) {
      actual.push(v);
      visitado[v] = true;
      var j = 0;
      while (j < G[v].length) {
        if (!visitado[G[v][j]]) { aux(G[v][j], actual); }
        j = j + 1;
      }
    }
    i = 0;
    while (i < n) {
      if (!visitado[i]) { var actual = []; aux(i, actual); componentes.push(actual); }
      i = i + 1;
    }
    return componentes;
  }

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

  /* Los componentes que quedan al quitar el vertice x, con los nombres
     originales de los vertices. */
  function sinVertice(n, aristas, x) {
    var indice = {}, nombre = [], k = 0, i = 0;
    while (i < n) {
      if (i !== x) { indice[i] = k; nombre.push(i); k = k + 1; }
      i = i + 1;
    }
    var resto = [];
    i = 0;
    while (i < aristas.length) {
      if (aristas[i][0] !== x && aristas[i][1] !== x) {
        resto.push([indice[aristas[i][0]], indice[aristas[i][1]]]);
      }
      i = i + 1;
    }
    return componentesConexos(construir(k, resto)).map(function (c) {
      return c.map(function (t) { return nombre[t]; }).sort(function (a, b) { return a - b; });
    });
  }

  /* Los componentes que quedan al quitar la arista numero e. */
  function sinArista(n, aristas, e) {
    var resto = [], i = 0;
    while (i < aristas.length) {
      if (i !== e) { resto.push(aristas[i]); }
      i = i + 1;
    }
    return componentesConexos(construir(n, resto)).map(function (c) {
      return c.slice().sort(function (a, b) { return a - b; });
    });
  }

  function puntosDeArticulacion(n, aristas) {
    var base = componentesConexos(construir(n, aristas)).length;
    var res = [], i = 0;
    while (i < n) {
      if (sinVertice(n, aristas, i).length > base) { res.push(i); }
      i = i + 1;
    }
    return res;
  }

  function puentes(n, aristas) {
    var base = componentesConexos(construir(n, aristas)).length;
    var res = [], i = 0;
    while (i < aristas.length) {
      if (sinArista(n, aristas, i).length > base) { res.push(i); }
      i = i + 1;
    }
    return res;
  }

  /* Un ciclo que pase por la arista e, si existe: el camino alterno entre
     sus extremos cuando la arista se borra. */
  function caminoAlterno(n, aristas, e) {
    var origen = aristas[e][0], destino = aristas[e][1];
    var resto = [], i = 0;
    while (i < aristas.length) { if (i !== e) { resto.push(aristas[i]); } i = i + 1; }
    var G = construir(n, resto), previo = [], visitado = [], cola = [origen], cabeza = 0;
    i = 0;
    while (i < n) { previo.push(-1); visitado.push(false); i = i + 1; }
    visitado[origen] = true;
    while (cabeza < cola.length) {
      var w = cola[cabeza];
      cabeza = cabeza + 1;
      var j = 0;
      while (j < G[w].length) {
        if (!visitado[G[w][j]]) { visitado[G[w][j]] = true; previo[G[w][j]] = w; cola.push(G[w][j]); }
        j = j + 1;
      }
    }
    var camino = null;
    if (visitado[destino]) {
      camino = [destino];
      var t = destino;
      while (previo[t] !== -1) { t = previo[t]; camino.push(t); }
      camino.reverse();
    }
    return camino;
  }

  return {
    componentesConexos: componentesConexos, construir: construir,
    sinVertice: sinVertice, sinArista: sinArista,
    puntosDeArticulacion: puntosDeArticulacion, puentes: puentes,
    caminoAlterno: caminoAlterno
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { n: 9,
        aristas: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 3], [5, 6], [6, 7], [6, 8]],
        pos: [[0.0, 2.4], [0.9, 3.2], [1.8, 2.4], [0.9, 1.6], [1.9, 0.9], [2.6, 1.8], [3.8, 1.8], [4.7, 2.7], [4.7, 0.9]] },
      { n: 6,
        aristas: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [1, 4]],
        pos: [[0.0, 1.5], [0.9, 2.7], [2.3, 2.7], [3.2, 1.5], [2.3, 0.3], [0.9, 0.3]] },
      { n: 7,
        aristas: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]],
        pos: [[2.0, 2.8], [1.0, 1.6], [3.0, 1.6], [0.3, 0.4], [1.6, 0.4], [2.5, 0.4], [3.8, 0.4]] }
    ];
    var COLORES = [
      { relleno: "#e7f2e8", borde: "#2e7d32" },
      { relleno: "#fdf1dc", borde: "#e8a13d" },
      { relleno: "#e3edf8", borde: "#1f5fa8" },
      { relleno: "#fbe9e7", borde: "#b3261e" },
      { relleno: "#efe4f7", borde: "#6b3fa0" }
    ];
    var presetActual = 0;
    var quitado = null;

    function P() { return PRESETS[presetActual]; }

    function componentesVisibles() {
      var p = P(), lista;
      if (quitado === null) {
        lista = EJERCICIO.componentesConexos(EJERCICIO.construir(p.n, p.aristas)).map(function (c) {
          return c.slice().sort(function (a, b) { return a - b; });
        });
      } else if (quitado.tipo === "v") {
        lista = EJERCICIO.sinVertice(p.n, p.aristas, quitado.k);
      } else {
        lista = EJERCICIO.sinArista(p.n, p.aristas, quitado.k);
      }
      return lista;
    }

    function pintarLista(lista) {
      return lista.map(function (c) { return "{" + c.join(", ") + "}"; }).join(", ");
    }

    function dibujar() {
      var p = P(), pos = p.pos, n = p.n;
      var G = EJERCICIO.construir(n, p.aristas);
      var ancho = 470, alto = 250, r = 16;
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

      var lista = componentesVisibles();
      var comp = [], c = 0;
      i = 0;
      while (i < n) { comp.push(-1); i = i + 1; }
      while (c < lista.length) {
        var t = 0;
        while (t < lista[c].length) { comp[lista[c][t]] = c; t = t + 1; }
        c = c + 1;
      }

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:520px'>";
      var e = 0;
      while (e < p.aristas.length) {
        var u = p.aristas[e][0], v = p.aristas[e][1];
        var fuera = (quitado !== null && quitado.tipo === "e" && quitado.k === e) ||
                    (quitado !== null && quitado.tipo === "v" && (quitado.k === u || quitado.k === v));
        var estilo = fuera ? " stroke-dasharray='5,4' stroke='#c9ced6'" : " stroke='#9aa3ad'";
        svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) +
               "'" + estilo + " stroke-width='" + (fuera ? 2 : 1.8) + "'/>";
        e = e + 1;
      }
      var w = 0;
      while (w < n) {
        var fueraV = quitado !== null && quitado.tipo === "v" && quitado.k === w;
        var col = fueraV ? { relleno: "#f1f3f6", borde: "#c9ced6" }
                         : (comp[w] >= 0 ? COLORES[comp[w] % COLORES.length] : { relleno: "#ffffff", borde: "#d8dee6" });
        svg += "<circle cx='" + X(w) + "' cy='" + Y(w) + "' r='" + r + "' fill='" + col.relleno +
               "' stroke='" + col.borde + "' stroke-width='2.2'" + (fueraV ? " stroke-dasharray='4,3'" : "") + "/>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='" +
               (fueraV ? "#c9ced6" : "#24292f") + "'>" + w + "</text>";
        w = w + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;

      var rot;
      if (quitado === null) { rot = "Grafo completo: " + lista.length + " " + (lista.length === 1 ? "componente" : "componentes") + ", " + pintarLista(lista) + "."; }
      else if (quitado.tipo === "v") { rot = "Sin el vértice " + quitado.k + ": " + lista.length + " " + (lista.length === 1 ? "componente" : "componentes") + ", " + pintarLista(lista) + "."; }
      else { rot = "Sin la arista " + p.aristas[quitado.k][0] + "–" + p.aristas[quitado.k][1] + ": " + lista.length + " " + (lista.length === 1 ? "componente" : "componentes") + ", " + pintarLista(lista) + "."; }
      document.getElementById("ver-quitado").textContent = rot;
    }

    function armarListas() {
      var p = P();
      var cajaV = document.getElementById("lista-vertices");
      var cajaE = document.getElementById("lista-aristas");
      var html = "", i = 0;
      while (i < p.n) {
        html += "<label class='fila-item'><input type='checkbox' data-v='" + i + "'> <b>" + i +
                "</b> <button type='button' class='mini' data-quitav='" + i + "'>quitarlo</button>" +
                " <span class='resultado' id='rv-" + i + "'></span></label>";
        i = i + 1;
      }
      cajaV.innerHTML = html;
      html = ""; i = 0;
      while (i < p.aristas.length) {
        html += "<label class='fila-item'><input type='checkbox' data-e='" + i + "'> <b>" +
                p.aristas[i][0] + "–" + p.aristas[i][1] +
                "</b> <button type='button' class='mini' data-quitae='" + i + "'>quitarla</button>" +
                " <span class='resultado' id='re-" + i + "'></span></label>";
        i = i + 1;
      }
      cajaE.innerHTML = html;

      Array.prototype.forEach.call(document.querySelectorAll("[data-quitav]"), function (b) {
        b.addEventListener("click", function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          var k = parseInt(b.getAttribute("data-quitav"), 10);
          quitado = (quitado !== null && quitado.tipo === "v" && quitado.k === k) ? null : { tipo: "v", k: k };
          dibujar();
        });
      });
      Array.prototype.forEach.call(document.querySelectorAll("[data-quitae]"), function (b) {
        b.addEventListener("click", function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          var k = parseInt(b.getAttribute("data-quitae"), 10);
          quitado = (quitado !== null && quitado.tipo === "e" && quitado.k === k) ? null : { tipo: "e", k: k };
          dibujar();
        });
      });
    }

    function limpiarVeredictos() {
      ["veredicto", "veredicto-vertices", "veredicto-aristas", "veredicto-relacion"].forEach(function (id) {
        var v = document.getElementById(id);
        v.className = "veredicto"; v.textContent = "";
      });
      var i = 0, p = P();
      while (i < p.n) { var c = document.getElementById("rv-" + i); if (c) { c.textContent = ""; } i = i + 1; }
      i = 0;
      while (i < p.aristas.length) { var d = document.getElementById("re-" + i); if (d) { d.textContent = ""; } i = i + 1; }
    }

    document.getElementById("btn-comprobar").addEventListener("click", function () {
      var p = P();
      var art = EJERCICIO.puntosDeArticulacion(p.n, p.aristas);
      var campo = document.getElementById("prediccion");
      var v = document.getElementById("veredicto");
      var valor = parseInt(campo.value, 10);
      if (isNaN(valor)) {
        v.className = "veredicto mal"; v.textContent = "Escriba un número primero.";
      } else if (valor === art.length) {
        v.className = "veredicto bien";
        v.textContent = art.length === 0
          ? "Correcto: ninguno. Quitando cualquier vértice el grafo sigue de una pieza, porque entre cada par hay dos caminos que no comparten vértices intermedios."
          : "Correcto: " + art.length + ". Márquelos abajo y compruebe uno por uno con el botón de quitar.";
      } else if (valor === p.n) {
        v.className = "veredicto mal";
        v.textContent = "Ese es el número de vértices. Un vértice de grado 1 nunca es punto de articulación: al quitarlo no queda nadie incomunicado, solo desaparece él.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Pruebe con el botón de quitar de cada vértice y cuente los que dejan más componentes que el grafo completo.";
      }
    });

    document.getElementById("btn-vertices").addEventListener("click", function () {
      var p = P();
      var art = EJERCICIO.puntosDeArticulacion(p.n, p.aristas);
      var base = EJERCICIO.componentesConexos(EJERCICIO.construir(p.n, p.aristas)).length;
      var aciertos = 0, i = 0;
      while (i < p.n) {
        var marcado = document.querySelector("input[data-v='" + i + "']").checked;
        var es = art.indexOf(i) >= 0;
        var lista = EJERCICIO.sinVertice(p.n, p.aristas, i);
        var celda = document.getElementById("rv-" + i);
        celda.textContent = (marcado === es ? "✓ " : "✗ ") +
          (es ? "sí: al quitarlo quedan " + lista.length + " componentes, " + pintarLista(lista)
              : "no: al quitarlo quedan " + lista.length + ", " + pintarLista(lista) + ", los mismos " + base + " de antes");
        celda.className = "resultado " + (marcado === es ? "bien" : "mal");
        if (marcado === es) { aciertos = aciertos + 1; }
        i = i + 1;
      }
      var v = document.getElementById("veredicto-vertices");
      v.className = aciertos === p.n ? "veredicto bien" : "veredicto mal";
      v.textContent = aciertos === p.n
        ? "Los " + p.n + " bien. La razón de cada uno está al lado: se quita el vértice, se cuentan los componentes y se compara con " + base + "."
        : aciertos + " de " + p.n + ". Al lado de cada vértice queda cuántos componentes deja al quitarlo; los que dejan más de " + base + " son los puntos de articulación.";
    });

    document.getElementById("btn-aristas").addEventListener("click", function () {
      var p = P();
      var puentes = EJERCICIO.puentes(p.n, p.aristas);
      var base = EJERCICIO.componentesConexos(EJERCICIO.construir(p.n, p.aristas)).length;
      var aciertos = 0, i = 0;
      while (i < p.aristas.length) {
        var marcado = document.querySelector("input[data-e='" + i + "']").checked;
        var es = puentes.indexOf(i) >= 0;
        var lista = EJERCICIO.sinArista(p.n, p.aristas, i);
        var celda = document.getElementById("re-" + i);
        var texto;
        if (es) {
          texto = "sí: al borrarla quedan " + lista.length + " componentes, " + pintarLista(lista) +
                  ", y no hay otro camino entre " + p.aristas[i][0] + " y " + p.aristas[i][1];
        } else {
          var camino = EJERCICIO.caminoAlterno(p.n, p.aristas, i);
          texto = "no: sin ella todavía va " + camino.join(" – ") + ", así que la arista está en un ciclo";
        }
        celda.textContent = (marcado === es ? "✓ " : "✗ ") + texto;
        celda.className = "resultado " + (marcado === es ? "bien" : "mal");
        if (marcado === es) { aciertos = aciertos + 1; }
        i = i + 1;
      }
      var v = document.getElementById("veredicto-aristas");
      var total = p.aristas.length;
      v.className = aciertos === total ? "veredicto bien" : "veredicto mal";
      v.textContent = aciertos === total
        ? "Las " + total + " bien. La que no es puente trae al lado el camino que queda cuando se borra; ese camino, más la arista, es el ciclo que la contiene."
        : aciertos + " de " + total + ". Una arista es puente cuando no pertenece a ningún ciclo: si al borrarla todavía hay camino entre sus extremos, no lo es.";
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        quitado = null;
        armarListas();
        limpiarVeredictos();
        dibujar();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-relacion button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        var v = document.getElementById("veredicto-relacion");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Correcto. En el primer grafo el 3 es punto de articulación y ninguna de sus cuatro aristas es puente: todas están en un ciclo, y aun así quitar el vértice parte el grafo en dos. Los extremos de un puente sí suelen ser puntos de articulación, pero un vértice de grado 1 como el 7 no lo es.";
        } else if (op === "siempre") {
          v.className = "veredicto mal";
          v.textContent = "No: en el primer grafo el 3 es punto de articulación y no tiene ningún puente al lado. Quite el 3 y después quite sus aristas una por una para verlo.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Al revés tampoco: el 7 es extremo del puente 6–7 y no es punto de articulación, porque al quitarlo nadie queda incomunicado. Un vértice de grado 1 nunca lo es.";
        }
      });
    });

    armarListas();
    dibujar();
  })();
}
