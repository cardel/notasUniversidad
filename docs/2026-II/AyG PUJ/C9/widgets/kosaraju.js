/* Ejercicio interactivo: el algoritmo de Kosaraju paso a paso (clase 9).
   La simulacion reproduce orden_por_finalizacion, grafo_transpuesto y
   asignar tal como estan en el codigo de la clase, linea por linea. */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def orden_aux(grafo, v, visitado, orden):",       num: null },
    { txt: "    visitado[v] = True",                           num: 1, bloque: 1 },
    { txt: "    for u in grafo[v]:",                           num: 2, bloque: 1 },
    { txt: "        if not visitado[u]:",                      num: 3, bloque: 1 },
    { txt: "            orden_aux(grafo, u, visitado, orden)", num: 4, bloque: 1 },
    { txt: "    orden.append(v)",                              num: 5, bloque: 1 },
    { txt: "",                                                 num: null },
    { txt: "def orden_por_finalizacion(grafo):",               num: null },
    { txt: "    visitado = {}",                                num: 6,  bloque: 2 },
    { txt: "    for v in grafo:",                              num: 7,  bloque: 2 },
    { txt: "        visitado[v] = False",                      num: 8,  bloque: 2 },
    { txt: "    orden = []",                                   num: 9,  bloque: 2 },
    { txt: "    for v in grafo:",                              num: 10, bloque: 2 },
    { txt: "        if not visitado[v]:",                      num: 11, bloque: 2 },
    { txt: "            orden_aux(grafo, v, visitado, orden)", num: 12, bloque: 2 },
    { txt: "    orden.reverse()",                              num: 13, bloque: 2 },
    { txt: "    return orden",                                 num: 14, bloque: 2 },
    { txt: "",                                                 num: null },
    { txt: "def asignar(GT, v, g, comp):",                     num: null },
    { txt: "    if comp[v] is None:",                          num: 15, bloque: 3 },
    { txt: "        comp[v] = g",                              num: 16, bloque: 3 },
    { txt: "        for u in GT[v]:",                          num: 17, bloque: 3 },
    { txt: "            asignar(GT, u, g, comp)",              num: 18, bloque: 3 },
    { txt: "",                                                 num: null },
    { txt: "def kosaraju(grafo):",                             num: null },
    { txt: "    orden = orden_por_finalizacion(grafo)",        num: 19 },
    { txt: "    GT = grafo_transpuesto(grafo)",                num: 20 },
    { txt: "    comp = {}",                                    num: 21 },
    { txt: "    for v in grafo:",                              num: 22 },
    { txt: "        comp[v] = None",                           num: 23 },
    { txt: "    for v in orden:",                              num: 24 },
    { txt: "        asignar(GT, v, v, comp)",                  num: 25 },
    { txt: "    componentes = agrupar(grafo, comp, orden)",    num: 26 },
    { txt: "    return componentes",                           num: 27 }
  ];

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

  function simular(params) {
    var G = params.G, n = G.length;
    var pasos = [], visitado = [], orden = [], comp = [], componentes = [];
    var GT = null, v = null, u = null, g = null, fase = "orden", i = 0;

    function snap(linea, extra) {
      var q = {
        linea: linea, fase: fase,
        v: v === null ? "–" : v,
        u: u === null ? "–" : u,
        g: g === null ? "–" : g,
        visitado: visitado.slice(),
        orden: orden.slice(),
        comp: comp.slice(),
        componentes: componentes.map(function (c) { return c.slice(); }),
        hayGT: GT !== null
      };
      if (extra) { var x; for (x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }

    snap(19, { entra: "orden" });
    visitado = []; i = 0;
    while (i < n) { visitado.push(undefined); i = i + 1; }
    snap(6);
    i = 0;
    while (i < n) {
      v = i; snap(7);
      visitado[i] = false; snap(8);
      i = i + 1;
    }
    v = null;
    orden = []; snap(9);

    function ordenAux(w) {
      v = w;
      visitado[w] = true; snap(1, { descubre: w });
      var j = 0;
      while (j < G[w].length) {
        v = w; u = G[w][j];
        snap(2, { mira: [w, u] });
        snap(3, { mira: [w, u] });
        if (!visitado[u]) {
          snap(4, { baja: [w, u] });
          ordenAux(u);
          v = w; u = G[w][j];
        }
        j = j + 1;
      }
      v = w; u = null;
      orden.push(w); snap(5, { cierra: w });
    }

    i = 0;
    while (i < n) {
      v = i; u = null;
      snap(10);
      snap(11);
      if (!visitado[i]) { snap(12, { raiz: i }); ordenAux(i); v = i; u = null; }
      i = i + 1;
    }
    v = null; u = null;
    orden.reverse(); snap(13, { invierte: true });
    snap(14);

    fase = "asignar";
    GT = transpuesto(G); snap(20, { construyeGT: true });
    comp = []; i = 0;
    while (i < n) { comp.push(undefined); i = i + 1; }
    snap(21);
    i = 0;
    while (i < n) {
      v = i; snap(22);
      comp[i] = null; snap(23);
      i = i + 1;
    }
    v = null;

    function asignarSim(w, nombre) {
      v = w; g = nombre;
      snap(15, { prueba: w });
      if (comp[w] === null) {
        comp[w] = nombre; snap(16, { pinta: w });
        var j = 0;
        while (j < GT[w].length) {
          v = w; u = GT[w][j];
          snap(17, { mira: [w, u] });
          snap(18, { baja: [w, u] });
          asignarSim(u, nombre);
          v = w; u = GT[w][j];
          j = j + 1;
        }
        u = null;
      }
      v = w; g = nombre;
    }

    i = 0;
    while (i < orden.length) {
      var w = orden[i];
      v = w; u = null; g = null;
      snap(24);
      var abierto = comp[w] === null;
      var antes = [];
      var t = 0;
      while (t < n) { antes.push(comp[t]); t = t + 1; }
      asignarSim(w, w);
      v = w; u = null;
      if (abierto) {
        var nuevos = [];
        t = 0;
        while (t < n) { if (antes[t] === null && comp[t] !== null) { nuevos.push(t); } t = t + 1; }
        componentes.push(nuevos);
        snap(25, { pintado: nuevos, nombre: w, numero: componentes.length });
      } else {
        snap(25, { saltado: w });
      }
      i = i + 1;
    }
    v = null; u = null; g = null;
    snap(26, { agrupa: true });
    snap(27, { terminado: true });
    return pasos;
  }

  return {
    codigo: CODIGO, simular: simular, kosaraju: kosaraju,
    ordenPorFinalizacion: ordenPorFinalizacion, transpuesto: transpuesto
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function dirigido(n, aristas) {
      var G = [], i = 0;
      while (i < n) { G.push([]); i = i + 1; }
      i = 0;
      while (i < aristas.length) { G[aristas[i][0]].push(aristas[i][1]); i = i + 1; }
      i = 0;
      while (i < n) { G[i].sort(function (a, b) { return a - b; }); i = i + 1; }
      return G;
    }

    var PRESETS = [
      { G: dirigido(8, [[0, 1], [1, 0], [0, 2], [2, 3], [3, 4], [4, 2], [3, 5], [4, 6], [5, 7], [6, 7], [7, 6]]),
        pos: [[0.0, 2.6], [0.0, 1.2], [1.2, 1.9], [2.2, 2.7], [2.2, 1.1], [3.3, 2.6], [3.5, 1.5], [4.6, 1.0]] },
      { G: dirigido(5, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [2, 0]]),
        pos: [[0.0, 1.6], [1.0, 2.8], [2.4, 2.4], [2.8, 1.0], [1.4, 0.0]] },
      { G: dirigido(5, [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]]),
        pos: [[0.0, 1.5], [1.2, 2.5], [1.2, 0.5], [2.4, 1.5], [3.6, 1.5]] }
    ];
    var COLORES = [
      { relleno: "#e7f2e8", borde: "#2e7d32" },
      { relleno: "#fdf1dc", borde: "#e8a13d" },
      { relleno: "#e3edf8", borde: "#1f5fa8" },
      { relleno: "#efe4f7", borde: "#6b3fa0" },
      { relleno: "#fbe9e7", borde: "#b3261e" },
      { relleno: "#e0f2f1", borde: "#00695c" }
    ];
    var presetActual = 0;

    function paramsActuales() {
      return { G: PRESETS[presetActual].G, pos: PRESETS[presetActual].pos };
    }

    function pintarConjunto(c) {
      return "{" + c.slice().sort(function (a, b) { return a - b; }).join(", ") + "}";
    }

    function dibujar(params, a) {
      var G = params.G, pos = params.pos, n = G.length;
      var enFase2 = a && a.fase === "asignar" && a.hayGT;
      var actual = enFase2 ? EJERCICIO.transpuesto(G) : G;
      var ancho = 470, alto = 260, r = 16;
      var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
      while (i < n) {
        if (pos[i][0] < minX) { minX = pos[i][0]; }
        if (pos[i][0] > maxX) { maxX = pos[i][0]; }
        if (pos[i][1] < minY) { minY = pos[i][1]; }
        if (pos[i][1] > maxY) { maxY = pos[i][1]; }
        i = i + 1;
      }
      var mx = r + 20, my = r + 18;
      function X(k) { return mx + (pos[k][0] - minX) / (maxX - minX) * (ancho - 2 * mx); }
      function Y(k) { return my + (maxY - pos[k][1]) / (maxY - minY) * (alto - 2 * my); }
      function existe(p, q) {
        var j = 0, hay = false;
        while (j < actual[p].length) { if (actual[p][j] === q) { hay = true; } j = j + 1; }
        return hay;
      }

      /* Color por componente ya pintado; en la fase 1, por visitado. */
      var color = [];
      i = 0;
      while (i < n) { color.push({ relleno: "#ffffff", borde: "#d8dee6" }); i = i + 1; }
      if (a && a.fase === "orden") {
        i = 0;
        while (i < n) {
          if (a.visitado[i] === true) { color[i] = { relleno: "#e3edf8", borde: "#1f5fa8" }; }
          i = i + 1;
        }
        var t = 0;
        while (t < a.orden.length) { color[a.orden[t]] = { relleno: "#3c3f44", borde: "#24292f" }; t = t + 1; }
      }
      if (a && a.fase === "asignar") {
        var c = 0;
        while (c < a.componentes.length) {
          var s = 0;
          while (s < a.componentes[c].length) {
            color[a.componentes[c][s]] = COLORES[c % COLORES.length];
            s = s + 1;
          }
          c = c + 1;
        }
        i = 0;
        while (i < n) {
          if (a.comp[i] !== null && a.comp[i] !== undefined) {
            var yaTiene = false, q = 0;
            while (q < a.componentes.length) {
              if (a.componentes[q].indexOf(i) >= 0) { yaTiene = true; }
              q = q + 1;
            }
            if (!yaTiene) { color[i] = COLORES[a.componentes.length % COLORES.length]; }
          }
          i = i + 1;
        }
      }
      var tintaNegra = a && a.fase === "orden";

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:520px'>";
      svg += "<defs>";
      svg += "<marker id='fg' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker>";
      svg += "<marker id='fa' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#1f5fa8'/></marker>";
      svg += "<marker id='fv' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#2e7d32'/></marker>";
      svg += "</defs>";
      var uu = 0, j;
      while (uu < n) {
        j = 0;
        while (j < actual[uu].length) {
          var vv = actual[uu][j];
          var mirando = a && a.mira && a.mira[0] === uu && a.mira[1] === vv;
          var bajando = a && a.baja && a.baja[0] === uu && a.baja[1] === vv;
          var trazo = bajando ? "#2e7d32" : (mirando ? "#1f5fa8" : "#6b7280");
          var punta = bajando ? "url(#fv)" : (mirando ? "url(#fa)" : "url(#fg)");
          var grueso = (mirando || bajando) ? 2.9 : 1.6;
          var x1 = X(uu), y1 = Y(uu), x2 = X(vv), y2 = Y(vv);
          var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
          if (existe(vv, uu)) {
            var cx = (x1 + x2) / 2 - dy / dd * 24, cy = (y1 + y2) / 2 + dx / dd * 24;
            var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
            var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
            svg += "<path d='M" + (x1 + (cx - x1) / l1 * (r + 1)) + "," + (y1 + (cy - y1) / l1 * (r + 1)) +
                   " Q" + cx + "," + cy + " " + (x2 + (cx - x2) / l2 * (r + 3)) + "," + (y2 + (cy - y2) / l2 * (r + 3)) +
                   "' fill='none' stroke='" + trazo + "' stroke-width='" + grueso + "' marker-end='" + punta + "'/>";
          } else {
            svg += "<line x1='" + (x1 + dx / dd * (r + 1)) + "' y1='" + (y1 + dy / dd * (r + 1)) +
                   "' x2='" + (x2 - dx / dd * (r + 3)) + "' y2='" + (y2 - dy / dd * (r + 3)) +
                   "' stroke='" + trazo + "' stroke-width='" + grueso + "' marker-end='" + punta + "'/>";
          }
          j = j + 1;
        }
        uu = uu + 1;
      }
      uu = 0;
      while (uu < n) {
        var negro = tintaNegra && color[uu].relleno === "#3c3f44";
        var foco = a && a.v === uu;
        svg += "<circle cx='" + X(uu) + "' cy='" + Y(uu) + "' r='" + r + "' fill='" + color[uu].relleno +
               "' stroke='" + (foco ? "#e8a13d" : color[uu].borde) + "' stroke-width='" + (foco ? 4 : 2.2) + "'/>";
        svg += "<text x='" + X(uu) + "' y='" + (Y(uu) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='" +
               (negro ? "#ffffff" : "#24292f") + "'>" + uu + "</text>";
        uu = uu + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
      document.getElementById("ver-fase").textContent = (a && a.fase === "asignar")
        ? "Segunda pasada: el dibujo es Gᵀ y cada llamada a asignar pinta un componente entero."
        : "Primera pasada: el dibujo es G y los vértices se ennegrecen al entrar a orden.";
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(e.params, a);
      var n = e.params.G.length;
      document.getElementById("ver-orden").textContent =
        a && a.orden.length > 0 ? "[" + a.orden.join(", ") + "]" : "[ ]";
      document.getElementById("rot-orden").textContent =
        a && a.fase === "asignar" ? "ord (por f decreciente)" : "orden (se llena por f creciente)";
      document.getElementById("ver-comp").textContent =
        a && a.componentes.length > 0
          ? a.componentes.map(pintarConjunto).join(", ")
          : "ninguno todavía";

      var filas = "", m;
      for (m = 0; m < e.k; m = m + 1) {
        var q = e.pasos[m];
        if (q.pintado !== undefined) {
          filas = filas + "<tr><td>" + q.numero + "</td><td>" + q.nombre + "</td><td>" +
                  pintarConjunto(q.pintado) + "</td><td>" + q.pintado.length + "</td></tr>";
        }
      }
      document.getElementById("cuerpo-traza").innerHTML = filas !== "" ? filas :
        "<tr><td colspan='4' class='pend'>Ejecute: cada llamada de la línea 25 que encuentra su vértice sin asignar agrega una fila.</td></tr>";
      document.getElementById("ver-n").textContent = n;
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "v", rotulo: "v" }, { campo: "u", rotulo: "u" }, { campo: "g", rotulo: "g", clase: "cuenta" }],
      paramsIniciales: paramsActuales(), alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var lista = EJERCICIO.kosaraju(params.G);
      var n = params.G.length;
      if (valor === lista.length) {
        return { ok: true, msg: "Correcto: " + lista.length + ". " + lista.map(pintarConjunto).join(", ") + "." };
      }
      if (valor === n) {
        return { ok: false, msg: "Ese es el número de vértices, y solo sería la respuesta si el grafo no tuviera ningún ciclo. Busque los ciclos: cada uno junta a todos sus vértices en un componente." };
      }
      if (valor === 1) {
        return { ok: false, msg: "Con un solo componente, de cualquier vértice se llegaría a cualquier otro y de vuelta. Busque un vértice del que no se pueda regresar." };
      }
      return { ok: false, msg: "No coincide. Marque los ciclos del dibujo; los vértices de un mismo ciclo van juntos, y los que no están en ningún ciclo con nadie van solos." };
    });

    document.getElementById("btn-ord").addEventListener("click", function () {
      var G = PRESETS[presetActual].G;
      var orden = EJERCICIO.ordenPorFinalizacion(G);
      var campo = document.getElementById("primero");
      var v = document.getElementById("veredicto-primero");
      var valor = parseInt(campo.value, 10);
      if (isNaN(valor)) {
        v.className = "veredicto mal"; v.textContent = "Escriba un vértice primero.";
      } else if (valor === orden[0]) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: el " + orden[0] + ". Es el de f más grande, y su componente es una fuente del grafo de componentes: nada le entra, así que en Gᵀ nada le sale y el recorrido no se puede escapar de él.";
      } else if (valor === orden[orden.length - 1]) {
        v.className = "veredicto mal";
        v.textContent = "Ese es el último de ord, el de f más pequeño. Su componente es un sumidero, y arrancar por ahí en Gᵀ recorrería medio grafo de una vez.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No: ord arranca con el vértice de mayor tiempo de finalización, y en este grafo es el " + orden[0] + ". Ejecute la primera pasada y mire cuál queda de último en la lista antes de invertirla.";
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        Motor.limpiarVeredicto();
        var v = document.getElementById("veredicto-primero");
        v.className = "veredicto"; v.textContent = "";
        Motor.reiniciar(paramsActuales());
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-porque button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        var v = document.getElementById("veredicto-porque");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Correcto. El primer vértice de ord está en un componente sin aristas entrantes en el grafo de componentes; al invertir las flechas, ese componente queda sin aristas salientes, y el recorrido sobre Gᵀ lo cubre entero sin poder irse a otro. Sobre G el mismo recorrido se escaparía hacia todo lo que el componente alcanza.";
        } else if (op === "rapido") {
          v.className = "veredicto mal";
          v.textContent = "No es cuestión de velocidad: recorrer Gᵀ cuesta lo mismo que recorrer G, y construirlo cuesta una pasada más. Lo que aporta es que encierra el recorrido dentro del componente.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Los componentes son los mismos en G y en Gᵀ, así que no se trata de calcularlos sobre otro grafo con otra respuesta. Se trata de por dónde puede escaparse el recorrido.";
        }
      });
    });
  })();
}
