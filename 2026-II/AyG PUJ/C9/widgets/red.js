/* Ejercicio interactivo final (clase 9): quince paginas enlazadas, y todo lo
   de la sesion sobre el mismo grafo. Los calculos salen del codigo de la
   clase: componentes_conexos sobre el no dirigido subyacente y kosaraju
   sobre el dirigido. */
var EJERCICIO = (function () {
  var N = 15;
  var ARISTAS = [[0, 1], [1, 2], [2, 3], [3, 0],
                 [4, 5], [5, 4],
                 [6, 7], [7, 8], [8, 6],
                 [10, 11], [11, 10],
                 [13, 14], [14, 13],
                 [1, 4], [2, 6], [5, 6], [5, 9], [7, 9], [8, 10], [9, 12],
                 [11, 12], [12, 13], [10, 14]];

  function dirigido(n, aristas) {
    var G = [], i = 0;
    while (i < n) { G.push([]); i = i + 1; }
    i = 0;
    while (i < aristas.length) { G[aristas[i][0]].push(aristas[i][1]); i = i + 1; }
    i = 0;
    while (i < n) { G[i].sort(function (a, b) { return a - b; }); i = i + 1; }
    return G;
  }

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

  /* Las aristas sin direccion y sin repetir. */
  function subyacente(aristas) {
    var vistas = {}, res = [], i = 0;
    while (i < aristas.length) {
      var a = Math.min(aristas[i][0], aristas[i][1]);
      var b = Math.max(aristas[i][0], aristas[i][1]);
      if (a !== b && !vistas[a + "-" + b]) { vistas[a + "-" + b] = true; res.push([a, b]); }
      i = i + 1;
    }
    return res;
  }

  function componentesConexos(G) {
    var n = G.length, visitado = [], componentes = [], i = 0;
    while (i < n) { visitado.push(false); i = i + 1; }
    function aux(v, actual) {
      actual.push(v);
      visitado[v] = true;
      var j = 0;
      while (j < G[v].length) { if (!visitado[G[v][j]]) { aux(G[v][j], actual); } j = j + 1; }
    }
    i = 0;
    while (i < n) {
      if (!visitado[i]) { var actual = []; aux(i, actual); componentes.push(actual); }
      i = i + 1;
    }
    return componentes;
  }

  function transpuesto(G) {
    var n = G.length, GT = [], i = 0, j;
    while (i < n) { GT.push([]); i = i + 1; }
    i = 0;
    while (i < n) {
      j = 0;
      while (j < G[i].length) { GT[G[i][j]].push(i); j = j + 1; }
      i = i + 1;
    }
    return GT;
  }

  function ordenPorFinalizacion(G) {
    var n = G.length, visitado = [], orden = [], i = 0;
    while (i < n) { visitado.push(false); i = i + 1; }
    function aux(v) {
      visitado[v] = true;
      var j = 0;
      while (j < G[v].length) { if (!visitado[G[v][j]]) { aux(G[v][j]); } j = j + 1; }
      orden.push(v);
    }
    i = 0;
    while (i < n) { if (!visitado[i]) { aux(i); } i = i + 1; }
    orden.reverse();
    return orden;
  }

  function agrupar(n, comp, orden) {
    var claves = [], vistas = {}, i = 0;
    while (i < orden.length) {
      if (!vistas[comp[orden[i]]]) { vistas[comp[orden[i]]] = true; claves.push(comp[orden[i]]); }
      i = i + 1;
    }
    var grupos = {};
    i = 0;
    while (i < claves.length) { grupos[claves[i]] = []; i = i + 1; }
    i = 0;
    while (i < n) { grupos[comp[i]].push(i); i = i + 1; }
    var res = [];
    i = 0;
    while (i < claves.length) { res.push(grupos[claves[i]]); i = i + 1; }
    return res;
  }

  function kosaraju(G) {
    var n = G.length, orden = ordenPorFinalizacion(G), GT = transpuesto(G);
    var comp = [], i = 0;
    while (i < n) { comp.push(null); i = i + 1; }
    function asignar(v, g) {
      if (comp[v] === null) {
        comp[v] = g;
        var j = 0;
        while (j < GT[v].length) { asignar(GT[v][j], g); j = j + 1; }
      }
    }
    i = 0;
    while (i < orden.length) { asignar(orden[i], orden[i]); i = i + 1; }
    return agrupar(n, comp, orden);
  }

  /* La segunda pasada, una llamada de ord por paso. Cada entrada dice si la
     llamada pinto un componente nuevo o se topo con un vertice ya asignado. */
  function pasosSegundaPasada(G) {
    var n = G.length, orden = ordenPorFinalizacion(G), GT = transpuesto(G);
    var comp = [], i = 0, pasos = [], numero = 0;
    while (i < n) { comp.push(null); i = i + 1; }
    function asignar(v, g) {
      if (comp[v] === null) {
        comp[v] = g;
        var j = 0;
        while (j < GT[v].length) { asignar(GT[v][j], g); j = j + 1; }
      }
    }
    i = 0;
    while (i < orden.length) {
      var v = orden[i];
      if (comp[v] === null) {
        var antes = comp.slice();
        asignar(v, v);
        var nuevos = [], t = 0;
        while (t < n) { if (antes[t] === null && comp[t] !== null) { nuevos.push(t); } t = t + 1; }
        numero = numero + 1;
        pasos.push({ posicion: i, v: v, pinta: nuevos, numero: numero, comp: comp.slice() });
      } else {
        pasos.push({ posicion: i, v: v, pinta: null, comp: comp.slice() });
      }
      i = i + 1;
    }
    return { orden: orden, pasos: pasos };
  }

  function indiceDeComponente(n, componentes) {
    var comp = [], i = 0, c, t;
    while (i < n) { comp.push(-1); i = i + 1; }
    c = 0;
    while (c < componentes.length) {
      t = 0;
      while (t < componentes[c].length) { comp[componentes[c][t]] = c; t = t + 1; }
      c = c + 1;
    }
    return comp;
  }

  function condensacion(aristas, comp) {
    var vistas = {}, res = [], i = 0;
    while (i < aristas.length) {
      var a = comp[aristas[i][0]], b = comp[aristas[i][1]];
      if (a !== b && !vistas[a + "-" + b]) { vistas[a + "-" + b] = true; res.push([a, b, aristas[i][0], aristas[i][1]]); }
      i = i + 1;
    }
    return res;
  }

  function puentes(n, aristas) {
    var base = componentesConexos(noDirigido(n, aristas)).length;
    var res = [], i = 0;
    while (i < aristas.length) {
      var resto = [], j = 0;
      while (j < aristas.length) { if (j !== i) { resto.push(aristas[j]); } j = j + 1; }
      if (componentesConexos(noDirigido(n, resto)).length > base) { res.push(aristas[i]); }
      i = i + 1;
    }
    return res;
  }

  function puntosDeArticulacion(n, aristas) {
    var base = componentesConexos(noDirigido(n, aristas)).length;
    var res = [], x = 0;
    while (x < n) {
      var indice = {}, k = 0, i = 0;
      while (i < n) { if (i !== x) { indice[i] = k; k = k + 1; } i = i + 1; }
      var resto = [];
      i = 0;
      while (i < aristas.length) {
        if (aristas[i][0] !== x && aristas[i][1] !== x) {
          resto.push([indice[aristas[i][0]], indice[aristas[i][1]]]);
        }
        i = i + 1;
      }
      if (componentesConexos(noDirigido(k, resto)).length > base) { res.push(x); }
      x = x + 1;
    }
    return res;
  }

  return {
    n: N, aristas: ARISTAS, dirigido: dirigido, noDirigido: noDirigido,
    subyacente: subyacente, componentesConexos: componentesConexos,
    transpuesto: transpuesto, ordenPorFinalizacion: ordenPorFinalizacion,
    kosaraju: kosaraju, pasosSegundaPasada: pasosSegundaPasada,
    indiceDeComponente: indiceDeComponente, condensacion: condensacion,
    puentes: puentes, puntosDeArticulacion: puntosDeArticulacion
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var N = EJERCICIO.n;
    var G = EJERCICIO.dirigido(N, EJERCICIO.aristas);
    var SUB = EJERCICIO.subyacente(EJERCICIO.aristas);
    var SCC = EJERCICIO.kosaraju(G);
    var COMP = EJERCICIO.indiceDeComponente(N, SCC);
    var CONDENSA = EJERCICIO.condensacion(EJERCICIO.aristas, COMP);
    var SEGUNDA = EJERCICIO.pasosSegundaPasada(G);
    var POS = [
      [0.2, 4.0], [1.3, 4.6], [1.3, 3.0], [0.2, 2.4],
      [2.6, 4.4], [2.6, 3.0],
      [4.0, 4.6], [4.9, 3.8], [4.0, 3.0],
      [3.6, 1.6],
      [6.2, 4.2], [7.1, 3.3],
      [5.6, 1.3],
      [7.3, 1.2], [7.9, 2.4]
    ];
    var COLORES = [
      { relleno: "#e7f2e8", borde: "#2e7d32" },
      { relleno: "#fdf1dc", borde: "#e8a13d" },
      { relleno: "#e3edf8", borde: "#1f5fa8" },
      { relleno: "#efe4f7", borde: "#6b3fa0" },
      { relleno: "#fbe9e7", borde: "#b3261e" },
      { relleno: "#e0f2f1", borde: "#00695c" },
      { relleno: "#fff3cd", borde: "#8a6d00" }
    ];
    var NOMBRES = ["A", "B", "C", "D", "E", "F", "G"];

    var paso = 0;          /* cuantas llamadas de ord se han ejecutado */
    var verCondensacion = false;

    function conj(c) {
      return "{" + c.slice().sort(function (a, b) { return a - b; }).join(", ") + "}";
    }
    function lista(l) { return l.map(conj).join(", "); }

    function estadoActual() {
      var comp = [], i = 0;
      while (i < N) { comp.push(null); i = i + 1; }
      var pintados = [];
      var k = 0;
      while (k < paso) {
        var p = SEGUNDA.pasos[k];
        if (p.pinta !== null) { pintados.push(p.pinta); }
        k = k + 1;
      }
      k = 0;
      while (k < pintados.length) {
        var t = 0;
        while (t < pintados[k].length) { comp[pintados[k][t]] = k; t = t + 1; }
        k = k + 1;
      }
      return { comp: comp, pintados: pintados };
    }

    function dibujar() {
      var estado = estadoActual();
      var ancho = 700, alto = 330, r = 15;
      var minX = 0.2, maxX = 7.9, minY = 1.2, maxY = 4.6;
      var mx = r + 22, my = r + 18;
      function X(k) { return mx + (POS[k][0] - minX) / (maxX - minX) * (ancho - 2 * mx); }
      function Y(k) { return my + (maxY - POS[k][1]) / (maxY - minY) * (alto - 2 * my); }
      function existe(a, b) {
        var j = 0, hay = false;
        while (j < G[a].length) { if (G[a][j] === b) { hay = true; } j = j + 1; }
        return hay;
      }
      var actual = paso > 0 ? SEGUNDA.pasos[paso - 1] : null;

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:760px'>";
      svg += "<defs><marker id='fg' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#8d949d'/></marker></defs>";
      var i = 0;
      while (i < EJERCICIO.aristas.length) {
        var u = EJERCICIO.aristas[i][0], v = EJERCICIO.aristas[i][1];
        var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
        var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
        if (existe(v, u)) {
          var cx = (x1 + x2) / 2 - dy / dd * 20, cy = (y1 + y2) / 2 + dx / dd * 20;
          var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
          var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
          svg += "<path d='M" + (x1 + (cx - x1) / l1 * (r + 1)) + "," + (y1 + (cy - y1) / l1 * (r + 1)) +
                 " Q" + cx + "," + cy + " " + (x2 + (cx - x2) / l2 * (r + 3)) + "," + (y2 + (cy - y2) / l2 * (r + 3)) +
                 "' fill='none' stroke='#8d949d' stroke-width='1.5' marker-end='url(#fg)'/>";
        } else {
          svg += "<line x1='" + (x1 + dx / dd * (r + 1)) + "' y1='" + (y1 + dy / dd * (r + 1)) +
                 "' x2='" + (x2 - dx / dd * (r + 3)) + "' y2='" + (y2 - dy / dd * (r + 3)) +
                 "' stroke='#8d949d' stroke-width='1.5' marker-end='url(#fg)'/>";
        }
        i = i + 1;
      }
      i = 0;
      while (i < N) {
        var col = estado.comp[i] !== null
          ? COLORES[estado.comp[i] % COLORES.length]
          : { relleno: "#ffffff", borde: "#d8dee6" };
        var foco = actual !== null && actual.v === i;
        svg += "<circle cx='" + X(i) + "' cy='" + Y(i) + "' r='" + r + "' fill='" + col.relleno +
               "' stroke='" + (foco ? "#24292f" : col.borde) + "' stroke-width='" + (foco ? 3.6 : 2.2) + "'/>";
        svg += "<text x='" + X(i) + "' y='" + (Y(i) + 5) + "' text-anchor='middle' font-size='13' font-weight='700' fill='#24292f'>" + i + "</text>";
        i = i + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;

      /* La lista ord con la posicion actual resaltada. */
      var html = "", k = 0;
      while (k < SEGUNDA.orden.length) {
        var clase = "ficha";
        var estilo = " style='background:#cfd6de;color:#4b5563'";
        if (k < paso) {
          if (SEGUNDA.pasos[k].pinta === null) {
            clase = "ficha tachada";
            estilo = "";
          } else {
            var idx = 0, cuantos = 0;
            while (idx <= k) { if (SEGUNDA.pasos[idx].pinta !== null) { cuantos = cuantos + 1; } idx = idx + 1; }
            estilo = " style='background:" + COLORES[(cuantos - 1) % COLORES.length].borde + "'";
          }
        }
        if (k === paso) { estilo = " style='background:#cfd6de;color:#24292f;outline:3px solid #e8a13d'"; }
        html += "<span class='" + clase + "'" + estilo + ">" + SEGUNDA.orden[k] + "</span>";
        k = k + 1;
      }
      document.getElementById("ver-ord").innerHTML = html;

      var filas = "", m = 0, cuenta = 0;
      while (m < paso) {
        var q = SEGUNDA.pasos[m];
        if (q.pinta !== null) {
          cuenta = cuenta + 1;
          filas = filas + "<tr><td>" + cuenta + "</td><td>" + q.v + "</td><td>" + conj(q.pinta) +
                  "</td><td>" + q.pinta.length + "</td></tr>";
        }
        m = m + 1;
      }
      document.getElementById("cuerpo-traza").innerHTML = filas !== "" ? filas :
        "<tr><td colspan='4' class='pend'>Avance: cada llamada que encuentra su página sin asignar agrega una fila.</td></tr>";

      var nota;
      if (paso === 0) {
        nota = "La segunda pasada todavía no arranca. La lista de abajo es ord, por tiempo de finalización decreciente.";
      } else {
        var p2 = SEGUNDA.pasos[paso - 1];
        nota = p2.pinta === null
          ? "La página " + p2.v + " ya tenía componente: la llamada entra, la comprobación comp[v] is None falla y se devuelve sin hacer nada."
          : "asignar(" + p2.v + ", " + p2.v + ") pintó " + conj(p2.pinta) + ", " + p2.pinta.length +
            (p2.pinta.length === 1 ? " página." : " páginas.");
      }
      document.getElementById("ver-nota").textContent = nota;
      document.getElementById("ver-progreso").textContent = paso + " de " + SEGUNDA.orden.length;
    }

    function dibujarCondensacion() {
      var caja = document.getElementById("panel-condensa");
      if (!verCondensacion) { caja.innerHTML = ""; return; }
      var pos = [[0.2, 2.0], [1.5, 2.8], [1.5, 1.2], [2.8, 2.6], [2.8, 1.0], [4.0, 1.8], [5.2, 1.8]];
      var ancho = 660, alto = 200, anchoCaja = 108, altoCaja = 34;
      var minX = 0.2, maxX = 5.2, minY = 1.0, maxY = 2.8;
      function X(k) { return 70 + (pos[k][0] - minX) / (maxX - minX) * (ancho - 150); }
      function Y(k) { return 35 + (maxY - pos[k][1]) / (maxY - minY) * (alto - 80); }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:720px'>";
      svg += "<defs><marker id='fc' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker></defs>";
      var i = 0;
      while (i < CONDENSA.length) {
        var a = CONDENSA[i][0], b = CONDENSA[i][1];
        var x1 = X(a), y1 = Y(a), x2 = X(b), y2 = Y(b);
        var dx = x2 - x1, dy = y2 - y1;
        var t1 = Math.min((anchoCaja / 2 + 5) / Math.abs(dx === 0 ? 0.001 : dx),
                          (altoCaja / 2 + 5) / Math.abs(dy === 0 ? 0.001 : dy));
        svg += "<line x1='" + (x1 + dx * t1) + "' y1='" + (y1 + dy * t1) +
               "' x2='" + (x2 - dx * t1) + "' y2='" + (y2 - dy * t1) +
               "' stroke='#6b7280' stroke-width='1.7' marker-end='url(#fc)'/>";
        i = i + 1;
      }
      i = 0;
      while (i < SCC.length) {
        var col = COLORES[i % COLORES.length];
        svg += "<rect x='" + (X(i) - anchoCaja / 2) + "' y='" + (Y(i) - altoCaja / 2) + "' width='" + anchoCaja +
               "' height='" + altoCaja + "' rx='9' fill='" + col.relleno + "' stroke='" + col.borde + "' stroke-width='2.2'/>";
        svg += "<text x='" + X(i) + "' y='" + (Y(i) + 5) + "' text-anchor='middle' font-size='12' font-weight='700' fill='#24292f'>" +
               NOMBRES[i] + " " + conj(SCC[i]) + "</text>";
        i = i + 1;
      }
      svg += "</svg>";
      caja.innerHTML = svg;
    }

    /* 1. Cuantos componentes fuertemente conexos. */
    document.getElementById("btn-cuantos").addEventListener("click", function () {
      var v = document.getElementById("veredicto-cuantos");
      var valor = parseInt(document.getElementById("cuantos").value, 10);
      if (isNaN(valor)) {
        v.className = "veredicto mal"; v.textContent = "Escriba un número primero.";
      } else if (valor === SCC.length) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: " + SCC.length + ". " + lista(SCC) + ". Ejecute la segunda pasada y véalos aparecer uno por uno.";
      } else if (valor === N) {
        v.className = "veredicto mal";
        v.textContent = "Ese es el número de páginas. Solo sería la respuesta si ningún par de páginas se enlazara en los dos sentidos, y aquí hay varios ciclos.";
      } else if (valor === 1) {
        v.className = "veredicto mal";
        v.textContent = "Con un solo componente se podría volver desde la página 13 hasta la 0. Siga las flechas desde el 13 y vea hasta dónde llega.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Los ciclos del dibujo agrupan páginas; las que no están en ningún ciclo con nadie forman componente por su cuenta. Ejecute la segunda pasada y compare.";
      }
    });

    /* 2. La segunda pasada, una llamada por vez. */
    document.getElementById("btn-siguiente").addEventListener("click", function () {
      if (paso < SEGUNDA.orden.length) { paso = paso + 1; }
      dibujar();
    });
    document.getElementById("btn-componente").addEventListener("click", function () {
      var sigue = true;
      while (sigue && paso < SEGUNDA.orden.length) {
        paso = paso + 1;
        if (SEGUNDA.pasos[paso - 1].pinta !== null) { sigue = false; }
      }
      dibujar();
    });
    document.getElementById("btn-final").addEventListener("click", function () {
      paso = SEGUNDA.orden.length;
      dibujar();
    });
    document.getElementById("btn-reiniciar").addEventListener("click", function () {
      paso = 0;
      dibujar();
    });

    /* 3. El grafo de componentes. */
    document.getElementById("btn-aristas").addEventListener("click", function () {
      var v = document.getElementById("veredicto-aristas");
      var valor = parseInt(document.getElementById("aristas").value, 10);
      verCondensacion = true;
      dibujarCondensacion();
      var detalle = CONDENSA.map(function (a) {
        return NOMBRES[a[0]] + " → " + NOMBRES[a[1]] + " por " + a[2] + " → " + a[3];
      }).join("; ");
      if (isNaN(valor)) {
        v.className = "veredicto mal"; v.textContent = "Escriba un número primero.";
      } else if (valor === CONDENSA.length) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: " + CONDENSA.length + ". " + detalle +
          ". El orden en que Kosaraju los entrega, " + NOMBRES.slice(0, SCC.length).join(", ") +
          ", es un orden topológico de este grafo: todas las flechas van hacia adelante.";
      } else if (valor === EJERCICIO.aristas.length) {
        v.className = "veredicto mal";
        v.textContent = "Esas son las " + EJERCICIO.aristas.length + " flechas del grafo original. Las que quedan dentro de un componente no aparecen, y varias flechas entre los mismos dos componentes cuentan como una.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. De las " + EJERCICIO.aristas.length + " flechas, descarte las que empiezan y terminan en el mismo componente y cuente parejas distintas entre las que quedan.";
      }
    });

    /* 4. El mismo grafo sin direcciones. */
    document.getElementById("btn-sin").addEventListener("click", function () {
      var v = document.getElementById("veredicto-sin");
      var debiles = EJERCICIO.componentesConexos(EJERCICIO.noDirigido(N, SUB)).length;
      var art = EJERCICIO.puntosDeArticulacion(N, SUB);
      var pts = EJERCICIO.puentes(N, SUB);
      var a = parseInt(document.getElementById("sin-comp").value, 10);
      var b = parseInt(document.getElementById("sin-art").value, 10);
      if (isNaN(a) || isNaN(b)) {
        v.className = "veredicto mal"; v.textContent = "Escriba los dos números primero.";
      } else if (a === debiles && b === art.length) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: " + debiles + " componente y " + art.length +
          " puntos de articulación; tampoco tiene puentes, porque cada una de las " + SUB.length +
          " aristas está en algún ciclo. Sin direcciones el sitio es una sola pieza que aguanta la caída de cualquier página; con las direcciones puestas se parte en " +
          SCC.length + " bloques. Un solo componente débil nunca implica conectividad fuerte.";
      } else if (a !== debiles) {
        v.className = "veredicto mal";
        v.textContent = "El número de componentes sin direcciones no es " + a + ". Borre mentalmente las puntas y siga cualquier camino: desde el 0 se llega a las quince páginas.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Los puntos de articulación no son " + b + ". Pruebe a quitar cualquier página del dibujo sin direcciones: las demás siguen comunicadas, porque entre cada par hay dos caminos que no comparten páginas intermedias.";
      }
    });

    /* 5. La flecha de mas. */
    document.getElementById("btn-extra").addEventListener("click", function () {
      var v = document.getElementById("veredicto-extra");
      var conExtra = EJERCICIO.kosaraju(EJERCICIO.dirigido(N, EJERCICIO.aristas.concat([[14, 0]])));
      var valor = parseInt(document.getElementById("extra").value, 10);
      if (isNaN(valor)) {
        v.className = "veredicto mal"; v.textContent = "Escriba un número primero.";
      } else if (valor === conExtra.length) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: " + conExtra.length + ". " + lista(conExtra) +
          ". Cada uno de los siete bloques está en algún camino de A a G, así que el enlace de vuelta los cierra a todos en un solo ciclo. Una sola flecha vuelve fuertemente conexo un sitio que estaba partido en siete.";
      } else if (valor === SCC.length) {
        v.className = "veredicto mal";
        v.textContent = "Esos son los " + SCC.length + " de antes. El enlace 14 → 0 va del último bloque al primero y cierra el recorrido: mire qué bloques quedan dentro de ese ciclo.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Un componente se funde con otro cuando hay camino de ida y de vuelta entre los dos. Con 14 → 0 puesto, pregúntese desde cuáles bloques se llega a G y desde A se llega a cuáles.";
      }
    });

    dibujar();
  })();
}
