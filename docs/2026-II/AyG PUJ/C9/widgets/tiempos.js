/* Ejercicio interactivo: los dos tiempos de la busqueda en profundidad y el
   orden por finalizacion (clase 9). La simulacion reproduce la funcion
   tiempos del codigo de la clase, linea por linea. */
var EJERCICIO = (function () {
  var BLANCO = 0, GRIS = 1, NEGRO = 2;

  var CODIGO = [
    { txt: "def tiempos(grafo):",                    num: null },
    { txt: "    color, d, f = en_blanco(grafo)",      num: 1 },
    { txt: "    reloj = [0]",                         num: 2 },
    { txt: "",                                        num: null },
    { txt: "    def visit(u):",                       num: null },
    { txt: "        color[u] = GRIS",                 num: 3,  bloque: 1 },
    { txt: "        reloj[0] = reloj[0] + 1",         num: 4,  bloque: 1 },
    { txt: "        d[u] = reloj[0]",                 num: 5,  bloque: 1 },
    { txt: "        for v in grafo[u]:",              num: 6,  bloque: 1 },
    { txt: "            if color[v] == BLANCO:",      num: 7,  bloque: 1 },
    { txt: "                visit(v)",                num: 8,  bloque: 1 },
    { txt: "        color[u] = NEGRO",                num: 9,  bloque: 1 },
    { txt: "        reloj[0] = reloj[0] + 1",         num: 10, bloque: 1 },
    { txt: "        f[u] = reloj[0]",                 num: 11, bloque: 1 },
    { txt: "",                                        num: null },
    { txt: "    for u in grafo:",                     num: 12, bloque: 2 },
    { txt: "        if color[u] == BLANCO:",          num: 13, bloque: 2 },
    { txt: "            visit(u)",                    num: 14, bloque: 2 },
    { txt: "    resultado = (d, f)",                  num: 15 },
    { txt: "    return resultado",                    num: 16 }
  ];

  function simular(params) {
    var G = params.G, n = G.length;
    var pasos = [];
    var color = [], d = [], f = [], reloj = 0, i = 0;
    var u = null, v = null, raices = [], terminados = [];
    while (i < n) { color.push(BLANCO); d.push(0); f.push(0); i = i + 1; }

    function snap(linea, extra) {
      var q = {
        linea: linea,
        u: u === null ? "–" : u,
        v: v === null ? "–" : v,
        reloj: reloj,
        color: color.slice(), d: d.slice(), f: f.slice(),
        raices: raices.slice(), terminados: terminados.slice()
      };
      if (extra) { var x; for (x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }

    snap(1);
    snap(2);

    function visit(w) {
      var uAnterior = u;
      u = w;
      color[w] = GRIS; snap(3, { descubre: w });
      reloj = reloj + 1; snap(4);
      d[w] = reloj; snap(5, { marcaD: w });
      var j = 0;
      while (j < G[w].length) {
        u = w; v = G[w][j];
        snap(6, { mira: [w, v] });
        snap(7, { mira: [w, v], colorV: color[v] });
        if (color[v] === BLANCO) {
          snap(8, { baja: [w, v] });
          visit(v);
          u = w; v = G[w][j];
        }
        j = j + 1;
      }
      u = w; v = null;
      color[w] = NEGRO; snap(9, { cierra: w });
      reloj = reloj + 1; snap(10);
      f[w] = reloj; snap(11, { marcaF: w, fin: w, tiempoF: reloj });
      terminados.push(w);
      u = uAnterior;
    }

    var k = 0;
    while (k < n) {
      u = k; v = null;
      snap(12);
      snap(13);
      if (color[k] === BLANCO) {
        raices.push(k);
        snap(14, { raiz: k });
        visit(k);
        u = k; v = null;
      }
      k = k + 1;
    }
    u = null; v = null;
    snap(15);
    snap(16, { terminado: true });
    return pasos;
  }

  /* Referencia directa: los mismos tiempos sin instrumentacion. */
  function tiemposRef(G) {
    var n = G.length, color = [], d = [], f = [], reloj = 0, i = 0;
    while (i < n) { color.push(BLANCO); d.push(0); f.push(0); i = i + 1; }
    function visit(w) {
      color[w] = GRIS; reloj = reloj + 1; d[w] = reloj;
      var j = 0;
      while (j < G[w].length) {
        if (color[G[w][j]] === BLANCO) { visit(G[w][j]); }
        j = j + 1;
      }
      color[w] = NEGRO; reloj = reloj + 1; f[w] = reloj;
    }
    i = 0;
    while (i < n) { if (color[i] === BLANCO) { visit(i); } i = i + 1; }
    return { d: d, f: f };
  }

  /* El orden por finalizacion decreciente, como orden_por_finalizacion. */
  function ordenPorFinalizacion(G) {
    var n = G.length, visitado = [], orden = [], i = 0;
    while (i < n) { visitado.push(false); i = i + 1; }
    function aux(w) {
      visitado[w] = true;
      var j = 0;
      while (j < G[w].length) {
        if (!visitado[G[w][j]]) { aux(G[w][j]); }
        j = j + 1;
      }
      orden.push(w);
    }
    i = 0;
    while (i < n) { if (!visitado[i]) { aux(i); } i = i + 1; }
    orden.reverse();
    return orden;
  }

  function raicesDelBosque(G) {
    var n = G.length, visitado = [], raices = [], i = 0;
    while (i < n) { visitado.push(false); i = i + 1; }
    function aux(w) {
      visitado[w] = true;
      var j = 0;
      while (j < G[w].length) {
        if (!visitado[G[w][j]]) { aux(G[w][j]); }
        j = j + 1;
      }
    }
    i = 0;
    while (i < n) { if (!visitado[i]) { raices.push(i); aux(i); } i = i + 1; }
    return raices;
  }

  return {
    codigo: CODIGO, simular: simular, tiemposRef: tiemposRef,
    ordenPorFinalizacion: ordenPorFinalizacion, raicesDelBosque: raicesDelBosque
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function grafo(n, aristas) {
      var G = [], i = 0;
      while (i < n) { G.push([]); i = i + 1; }
      i = 0;
      while (i < aristas.length) { G[aristas[i][0]].push(aristas[i][1]); i = i + 1; }
      i = 0;
      while (i < n) { G[i].sort(function (a, b) { return a - b; }); i = i + 1; }
      return G;
    }

    var PRESETS = [
      { nombre: "Siete, dos árboles",
        G: grafo(7, [[0, 1], [0, 3], [1, 4], [2, 0], [2, 5], [3, 1], [4, 3], [5, 6], [6, 5]]),
        pos: [[0.6, 3.0], [1.9, 3.6], [0.0, 1.2], [1.9, 2.2], [3.1, 2.9], [1.5, 0.3], [2.9, 0.9]] },
      { nombre: "Seis, un solo árbol",
        G: grafo(6, [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 5], [5, 2]]),
        pos: [[0.0, 2.0], [1.2, 3.2], [1.2, 0.8], [2.4, 2.0], [3.6, 2.9], [3.6, 0.9]] },
      { nombre: "Ocho, cuatro árboles",
        G: grafo(8, [[0, 1], [1, 0], [2, 3], [3, 4], [4, 2], [5, 6]]),
        pos: [[0.0, 3.2], [1.1, 3.2], [0.2, 1.4], [1.4, 1.9], [1.4, 0.7], [2.9, 2.6], [3.9, 2.6], [3.4, 0.9]] }
    ];
    var presetActual = 0;
    var RELLENO = ["#ffffff", "#e3edf8", "#3c3f44"];
    var BORDE = ["#d8dee6", "#1f5fa8", "#24292f"];
    var TINTA = ["#24292f", "#24292f", "#ffffff"];

    function paramsActuales() {
      return { G: PRESETS[presetActual].G, pos: PRESETS[presetActual].pos };
    }

    function dibujar(params, a) {
      var G = params.G, pos = params.pos, n = G.length;
      var ancho = 470, alto = 270, r = 17;
      var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
      while (i < n) {
        if (pos[i][0] < minX) { minX = pos[i][0]; }
        if (pos[i][0] > maxX) { maxX = pos[i][0]; }
        if (pos[i][1] < minY) { minY = pos[i][1]; }
        if (pos[i][1] > maxY) { maxY = pos[i][1]; }
        i = i + 1;
      }
      var mx = r + 22, my = r + 20;
      function X(k) { return mx + (pos[k][0] - minX) / (maxX - minX) * (ancho - 2 * mx); }
      function Y(k) { return my + (maxY - pos[k][1]) / (maxY - minY) * (alto - 2 * my); }
      function existe(p, q) {
        var j = 0, hay = false;
        while (j < G[p].length) { if (G[p][j] === q) { hay = true; } j = j + 1; }
        return hay;
      }

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:520px'>";
      svg += "<defs>";
      svg += "<marker id='fg' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker>";
      svg += "<marker id='fa' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#1f5fa8'/></marker>";
      svg += "<marker id='fv' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#2e7d32'/></marker>";
      svg += "</defs>";

      var u = 0, j;
      while (u < n) {
        j = 0;
        while (j < G[u].length) {
          var v = G[u][j];
          var mirando = a && a.mira && a.mira[0] === u && a.mira[1] === v;
          var bajando = a && a.baja && a.baja[0] === u && a.baja[1] === v;
          var trazo = bajando ? "#2e7d32" : (mirando ? "#1f5fa8" : "#6b7280");
          var punta = bajando ? "url(#fv)" : (mirando ? "url(#fa)" : "url(#fg)");
          var grueso = (mirando || bajando) ? 2.8 : 1.6;
          var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
          var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
          if (existe(v, u)) {
            var cx = (x1 + x2) / 2 - dy / dd * 26, cy = (y1 + y2) / 2 + dx / dd * 26;
            var e1x = x1 + (cx - x1) / Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1)) * (r + 1);
            var e1y = y1 + (cy - y1) / Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1)) * (r + 1);
            var e2x = x2 + (cx - x2) / Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2)) * (r + 3);
            var e2y = y2 + (cy - y2) / Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2)) * (r + 3);
            svg += "<path d='M" + e1x + "," + e1y + " Q" + cx + "," + cy + " " + e2x + "," + e2y + "' fill='none' stroke='" + trazo + "' stroke-width='" + grueso + "' marker-end='" + punta + "'/>";
          } else {
            svg += "<line x1='" + (x1 + dx / dd * (r + 1)) + "' y1='" + (y1 + dy / dd * (r + 1)) + "' x2='" + (x2 - dx / dd * (r + 3)) + "' y2='" + (y2 - dy / dd * (r + 3)) + "' stroke='" + trazo + "' stroke-width='" + grueso + "' marker-end='" + punta + "'/>";
          }
          j = j + 1;
        }
        u = u + 1;
      }

      u = 0;
      while (u < n) {
        var c = a ? a.color[u] : 0;
        var esActual = a && a.u === u;
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='" + r + "' fill='" + RELLENO[c] + "' stroke='" + (esActual ? "#e8a13d" : BORDE[c]) + "' stroke-width='" + (esActual ? 4 : 2) + "'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='" + TINTA[c] + "'>" + u + "</text>";
        if (a && a.d[u] > 0) {
          var marca = a.d[u] + "/" + (a.f[u] > 0 ? a.f[u] : "·");
          svg += "<text x='" + X(u) + "' y='" + (Y(u) - r - 5) + "' text-anchor='middle' font-size='11.5' font-weight='700' fill='#1f5fa8'>" + marca + "</text>";
        }
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(e.params, a);
      var n = e.params.G.length;
      document.getElementById("ver-raices").textContent =
        a && a.raices.length > 0 ? a.raices.join(", ") : "ninguna todavía";
      var term = a ? a.terminados : [];
      document.getElementById("ver-term").textContent =
        term.length > 0 ? "[" + term.join(", ") + "]" : "[ ]";
      var inv = term.slice(); inv.reverse();
      document.getElementById("ver-orden").textContent =
        term.length === n ? "[" + inv.join(", ") + "]" : "(falta terminar)";

      var cuerpo = document.getElementById("cuerpo-tabla");
      var filas = "";
      var u = 0;
      while (u < n) {
        var dv2 = a && a.d[u] > 0 ? a.d[u] : "–";
        var fv2 = a && a.f[u] > 0 ? a.f[u] : "–";
        var est2 = a ? ["blanco", "gris", "negro"][a.color[u]] : "blanco";
        filas += "<tr><td>" + u + "</td><td>" + dv2 + "</td><td>" + fv2 + "</td><td>" + est2 + "</td></tr>";
        u = u + 1;
      }
      cuerpo.innerHTML = filas;
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" },
              { campo: "reloj", rotulo: "reloj", clase: "cuenta" }],
      paramsIniciales: paramsActuales(), alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var raices = EJERCICIO.raicesDelBosque(params.G);
      var n = params.G.length;
      if (valor === raices.length) {
        return { ok: true, msg: "Correcto: " + raices.length + ". La línea 14 se ejecuta " + raices.length + " " + (raices.length === 1 ? "vez" : "veces") + ", con " + (raices.length === 1 ? "la raíz " : "las raíces ") + raices.join(", ") + ". Cada arranque nuevo es un árbol del bosque." };
      }
      if (valor === n) {
        return { ok: false, msg: "Ese es el número de vértices. El ciclo de la línea 12 los recorre todos, pero solo llama a visit cuando el vértice sigue blanco: los que ya alcanzó un arranque anterior no abren árbol." };
      }
      if (valor === 1) {
        return { ok: false, msg: "Un solo árbol exige que desde el vértice 0 se alcance todo el grafo siguiendo las flechas. Mire en el dibujo si hay algún vértice al que no se llegue desde el 0." };
      }
      return { ok: false, msg: "No coincide. Cuente los arranques: el 0 abre el primero; después, cada vértice que quede blanco cuando el ciclo de la línea 12 llegue a él abre uno nuevo." };
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        Motor.limpiarVeredicto();
        var v2 = document.getElementById("veredicto-ultimo");
        v2.className = "veredicto"; v2.textContent = "";
        Motor.reiniciar(paramsActuales());
      });
    });

    document.getElementById("btn-ultimo").addEventListener("click", function () {
      var G = PRESETS[presetActual].G;
      var t = EJERCICIO.tiemposRef(G);
      var orden = EJERCICIO.ordenPorFinalizacion(G);
      var raices = EJERCICIO.raicesDelBosque(G);
      var campo = document.getElementById("ultimo");
      var v = document.getElementById("veredicto-ultimo");
      var valor = parseInt(campo.value, 10);
      var correcto = orden[0];
      if (isNaN(valor)) {
        v.className = "veredicto mal"; v.textContent = "Escriba un vértice primero.";
      } else if (valor === correcto) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: el " + correcto + ", con f = " + t.f[correcto] + ". Es la raíz del último árbol que abrió el ciclo de la línea 12, y por eso su llamada es la última en cerrar.";
      } else if (valor < 0 || valor >= G.length) {
        v.className = "veredicto mal"; v.textContent = "Ese vértice no está en el grafo.";
      } else {
        var esRaiz = false, i = 0;
        while (i < raices.length) { if (raices[i] === valor) { esRaiz = true; } i = i + 1; }
        v.className = "veredicto mal";
        v.textContent = esRaiz
          ? "El " + valor + " sí es raíz de un árbol, pero no del último: su f es " + t.f[valor] + " y el máximo es " + t.f[correcto] + ". La raíz que cierra de última es la del árbol que se abre de último."
          : "El " + valor + " tiene f = " + t.f[valor] + ". Un vértice que no es raíz cierra dentro de la llamada que lo descubrió, y esa llamada todavía tiene que cerrar después de él.";
      }
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id);
      v.className = ok ? "veredicto bien" : "veredicto mal";
      v.innerHTML = texto;
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-orden button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          veredicto("veredicto-orden", true, "Correcto: <code>orden</code> se arma agregando cada vértice en la línea 11, cuando su llamada cierra, y después se invierte. Leer los <code>f</code> de mayor a menor da lo mismo sin llevar el reloj.");
        } else if (op === "descubrimiento") {
          veredicto("veredicto-orden", false, "El orden de descubrimiento es otro. En el primer grafo, el 3 se descubre antes que el 5 y termina mucho antes; ordenar por <code>d</code> pone al 3 en un lugar y ordenar por <code>f</code> lo pone en el contrario. Kosaraju necesita el de finalización.");
        } else {
          veredicto("veredicto-orden", false, "El número del vértice no dice nada del recorrido: en el primer grafo el 2 es el último que arranca y el primero de la lista. El orden sale del reloj, no de la numeración.");
        }
      });
    });
  })();
}
