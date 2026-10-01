/* Ejercicio interactivo: orden topologico con la busqueda en profundidad (clase 10).
   La simulacion reproduce topo_aux, orden_topologico_dfs, topo_aux_con_pila y
   orden_topologico_dfs_con_pila tal como estan en el codigo de la clase, linea por linea. */
/* Dibujo de grafos dirigidos en SVG, con nombres de vertice y anotaciones. */
var DIB = (function () {
  var COL = {
    gris: "#6b7280", azul: "#1f5fa8", verde: "#2e7d32", rojo: "#b3261e",
    ambar: "#e8a13d", morado: "#6b3fa0", claro: "#c4cad3"
  };
  var RY = 16;

  function rxDe(nombre) {
    var r = 3.2 * nombre.length + 8;
    return r < 18 ? 18 : r;
  }

  /* o.pos, o.G, o.nombres; o.nodo(i) -> {relleno, borde, tinta, grueso, nota, notaColor};
     o.arista(u, v) -> {color, grueso, trazo}. */
  function dibujar(o) {
    var pos = o.pos, G = o.G, nom = o.nombres, n = pos.length;
    var ancho = 560, alto = o.alto || 300, mx = 56, my = 40;
    var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
    while (i < n) {
      if (pos[i][0] < minX) { minX = pos[i][0]; }
      if (pos[i][0] > maxX) { maxX = pos[i][0]; }
      if (pos[i][1] < minY) { minY = pos[i][1]; }
      if (pos[i][1] > maxY) { maxY = pos[i][1]; }
      i = i + 1;
    }
    function X(k) { return mx + (pos[k][0] - minX) / (maxX - minX) * (ancho - 2 * mx); }
    function Y(k) { return my + (maxY - pos[k][1]) / (maxY - minY) * (alto - 2 * my); }
    function existe(p, q) {
      var j = 0, hay = false;
      while (j < G[p].length) { if (G[p][j] === q) { hay = true; } j = j + 1; }
      return hay;
    }
    /* Distancia del centro al borde de la elipse en la direccion (ux, uy). */
    function borde(k, ux, uy) {
      var a = rxDe(nom[k]);
      return 1 / Math.sqrt((ux / a) * (ux / a) + (uy / RY) * (uy / RY));
    }

    var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:640px'>";
    svg += "<defs>";
    var c;
    for (c in COL) {
      svg += "<marker id='ah-" + c + "' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'>" +
             "<path d='M0,0 L0,6 L9,3 z' fill='" + COL[c] + "'/></marker>";
    }
    svg += "</defs>";

    var u = 0, j;
    while (u < n) {
      j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        var e = o.arista(u, v);
        var dash = e.trazo ? " stroke-dasharray='" + e.trazo + "'" : "";
        var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
        var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
        var pie = "' fill='none' stroke='" + COL[e.color] + "' stroke-width='" + e.grueso + "'" + dash +
                  " marker-end='url(#ah-" + e.color + ")'/>";
        if (existe(v, u)) {
          var cx = (x1 + x2) / 2 - dy / dd * 26, cy = (y1 + y2) / 2 + dx / dd * 26;
          var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
          var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
          var a1 = borde(u, (cx - x1) / l1, (cy - y1) / l1) + 2;
          var a2 = borde(v, (cx - x2) / l2, (cy - y2) / l2) + 5;
          svg += "<path d='M" + (x1 + (cx - x1) / l1 * a1) + "," + (y1 + (cy - y1) / l1 * a1) +
                 " Q" + cx + "," + cy + " " + (x2 + (cx - x2) / l2 * a2) + "," + (y2 + (cy - y2) / l2 * a2) + pie;
        } else {
          var b1 = borde(u, dx / dd, dy / dd) + 2;
          var b2 = borde(v, -dx / dd, -dy / dd) + 5;
          svg += "<path d='M" + (x1 + dx / dd * b1) + "," + (y1 + dy / dd * b1) +
                 " L" + (x2 - dx / dd * b2) + "," + (y2 - dy / dd * b2) + pie;
        }
        j = j + 1;
      }
      u = u + 1;
    }
    u = 0;
    while (u < n) {
      var s = o.nodo(u);
      svg += "<ellipse cx='" + X(u) + "' cy='" + Y(u) + "' rx='" + rxDe(nom[u]) + "' ry='" + RY +
             "' fill='" + s.relleno + "' stroke='" + s.borde + "' stroke-width='" + (s.grueso || 2.2) + "'/>";
      svg += "<text x='" + X(u) + "' y='" + (Y(u) + 4) + "' text-anchor='middle' font-size='11.5' font-weight='700' fill='" +
             (s.tinta || "#24292f") + "'>" + nom[u] + "</text>";
      if (s.nota) {
        svg += "<text x='" + X(u) + "' y='" + (Y(u) - RY - 4) + "' text-anchor='middle' font-size='11' font-weight='700' fill='" +
               (s.notaColor || "#1f5fa8") + "'>" + s.nota + "</text>";
      }
      u = u + 1;
    }
    svg += "</svg>";
    return svg;
  }
  return { dibujar: dibujar, COL: COL };
})();

var EJERCICIO = (function () {
  var BLANCO = 0, GRIS = 1, NEGRO = 2;

  var CODIGO_REC = [
    { txt: "def topo_aux(G, u, color, orden, ciclo):",       num: null },
    { txt: "    color[u] = GRIS",                              num: 1, bloque: 1 },
    { txt: "    for v in G[u]:",                               num: 2, bloque: 1 },
    { txt: "        if color[v] == BLANCO:",                   num: 3, bloque: 1 },
    { txt: "            topo_aux(G, v, color, orden, ciclo)",  num: 4, bloque: 1 },
    { txt: "        elif color[v] == GRIS:",                   num: 5, bloque: 1 },
    { txt: "            ciclo[0] = True",                      num: 6, bloque: 1 },
    { txt: "    color[u] = NEGRO",                             num: 7, bloque: 1 },
    { txt: "    orden.append(u)",                              num: 8, bloque: 1 },
    { txt: "",                                                 num: null },
    { txt: "def orden_topologico_dfs(G):",                     num: null },
    { txt: "    n = len(G)",                                   num: 9,  bloque: 2 },
    { txt: "    color = [BLANCO] * n",                         num: 10, bloque: 2 },
    { txt: "    orden = []",                                   num: 11, bloque: 2 },
    { txt: "    ciclo = [False]",                              num: 12, bloque: 2 },
    { txt: "    u = 0",                                        num: 13, bloque: 2 },
    { txt: "    while u < n:",                                 num: 14, bloque: 2 },
    { txt: "        if color[u] == BLANCO:",                   num: 15, bloque: 2 },
    { txt: "            topo_aux(G, u, color, orden, ciclo)",  num: 16, bloque: 2 },
    { txt: "        u = u + 1",                                num: 17, bloque: 2 },
    { txt: "    orden.reverse()",                              num: 18, bloque: 2 },
    { txt: "    resultado = (orden, ciclo[0])",                num: 19, bloque: 2 },
    { txt: "    return resultado",                             num: 20, bloque: 2 }
  ];

  var CODIGO_PILA = [
    { txt: "def topo_aux_con_pila(G, u, color, orden, ciclo):", num: null },
    { txt: "    pila = [(u, False)]",                          num: 21, bloque: 1 },
    { txt: "    while len(pila) > 0:",                         num: 22, bloque: 1 },
    { txt: "        w, finalizando = pila.pop()",              num: 23, bloque: 1 },
    { txt: "        if finalizando:",                          num: 24, bloque: 1 },
    { txt: "            color[w] = NEGRO",                     num: 25, bloque: 1 },
    { txt: "            orden.append(w)",                      num: 26, bloque: 1 },
    { txt: "        elif color[w] == BLANCO:",                 num: 27, bloque: 1 },
    { txt: "            color[w] = GRIS",                      num: 28, bloque: 1 },
    { txt: "            pila.append((w, True))",               num: 29, bloque: 1 },
    { txt: "            for v in G[w]:",                       num: 30, bloque: 1 },
    { txt: "                if color[v] == BLANCO:",           num: 31, bloque: 1 },
    { txt: "                    pila.append((v, False))",      num: 32, bloque: 1 },
    { txt: "                elif color[v] == GRIS:",           num: 33, bloque: 1 },
    { txt: "                    ciclo[0] = True",              num: 34, bloque: 1 },
    { txt: "",                                                 num: null },
    { txt: "def orden_topologico_dfs_con_pila(G):",            num: null },
    { txt: "    n = len(G)",                                   num: 35, bloque: 2 },
    { txt: "    color = [BLANCO] * n",                         num: 36, bloque: 2 },
    { txt: "    orden = []",                                   num: 37, bloque: 2 },
    { txt: "    ciclo = [False]",                              num: 38, bloque: 2 },
    { txt: "    u = 0",                                        num: 39, bloque: 2 },
    { txt: "    while u < n:",                                 num: 40, bloque: 2 },
    { txt: "        if color[u] == BLANCO:",                   num: 41, bloque: 2 },
    { txt: "            topo_aux_con_pila(G, u, color, orden, ciclo)", num: 42, bloque: 2 },
    { txt: "        u = u + 1",                                num: 43, bloque: 2 },
    { txt: "    orden.reverse()",                              num: 44, bloque: 2 },
    { txt: "    resultado = (orden, ciclo[0])",                num: 45, bloque: 2 },
    { txt: "    return resultado",                             num: 46, bloque: 2 }
  ];

  function codigoDe(version) { return version === "pila" ? CODIGO_PILA : CODIGO_REC; }

  function simular(params) {
    var G = params.G, nom = params.nombres, pila = params.version === "pila";
    var n = G.length, pasos = [], color = [], d = [], f = [], orden = [];
    var ciclo = null, reloj = 0, llamadas = [], pend = [];
    var cu = null, cv = null, cw = null, foco = null, invertido = false, i = 0;
    while (i < n) { color.push(BLANCO); d.push(0); f.push(0); i = i + 1; }

    function N(k) { return k === null || k >= n ? "–" : nom[k]; }
    function snap(linea, extra) {
      var q = {
        linea: linea, color: color.slice(), d: d.slice(), f: f.slice(), orden: orden.slice(),
        ciclo: ciclo === null ? "–" : (ciclo ? "True" : "False"),
        u: N(cu), v: N(cv), w: N(cw), foco: foco,
        llamadas: llamadas.slice(),
        pend: pend.map(function (p) { return [p[0], p[1]]; }),
        invertido: invertido, hecho: false
      };
      if (extra) { var x; for (x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }

    /* ---- version recursiva ---- */
    function aux(w) {
      llamadas.push(w); cu = w; cv = null; foco = w;
      color[w] = GRIS; reloj = reloj + 1; d[w] = reloj; snap(1, { descubre: w });
      var j = 0;
      while (j < G[w].length) {
        var x = G[w][j];
        cu = w; cv = x; foco = w;
        snap(2, { mira: [w, x] });
        snap(3, { mira: [w, x] });
        if (color[x] === BLANCO) {
          snap(4, { baja: [w, x] });
          aux(x);
          cu = w; cv = x; foco = w;
        } else {
          snap(5, { mira: [w, x] });
          if (color[x] === GRIS) {
            ciclo = true;
            snap(6, { retroceso: [w, x] });
          }
        }
        j = j + 1;
      }
      cu = w; cv = null; foco = w;
      color[w] = NEGRO; reloj = reloj + 1; f[w] = reloj; snap(7, { cierra: w });
      orden.push(w); snap(8, { cierra: w });
      llamadas.pop();
    }

    function recursiva() {
      snap(9);
      snap(10);
      snap(11);
      ciclo = false; snap(12);
      var u = 0;
      cu = 0; snap(13);
      while (u < n) {
        cu = u; foco = u; snap(14);
        snap(15);
        if (color[u] === BLANCO) {
          snap(16, { raiz: u });
          aux(u);
          cu = u; cv = null; foco = u;
        }
        u = u + 1;
        cu = u; foco = null; snap(17);
      }
      cu = u; snap(14);
      cu = null; foco = null;
      orden.reverse(); invertido = true; snap(18);
      snap(19);
      snap(20, { hecho: true });
    }

    /* ---- version con pila ---- */
    function auxPila(u0) {
      pend = [[u0, false]]; snap(21);
      while (pend.length > 0) {
        cw = null; cv = null; snap(22);
        var t = pend.pop();
        var w = t[0], fin = t[1];
        cw = w; foco = w;
        snap(23, { saca: [w, fin] });
        snap(24);
        if (fin) {
          color[w] = NEGRO; reloj = reloj + 1; f[w] = reloj; snap(25, { cierra: w });
          orden.push(w); snap(26, { cierra: w });
        } else {
          snap(27);
          if (color[w] === BLANCO) {
            color[w] = GRIS; reloj = reloj + 1; d[w] = reloj; snap(28, { descubre: w });
            pend.push([w, true]); snap(29);
            var j = 0;
            while (j < G[w].length) {
              var x = G[w][j];
              cv = x;
              snap(30, { mira: [w, x] });
              snap(31, { mira: [w, x] });
              if (color[x] === BLANCO) {
                pend.push([x, false]); snap(32, { baja: [w, x] });
              } else {
                snap(33, { mira: [w, x] });
                if (color[x] === GRIS) {
                  ciclo = true; snap(34, { retroceso: [w, x] });
                }
              }
              j = j + 1;
            }
            cv = null;
          }
        }
      }
      cw = null; cv = null; snap(22);
      foco = null; pend = [];
    }

    function conPila() {
      snap(35);
      snap(36);
      snap(37);
      ciclo = false; snap(38);
      var u = 0;
      cu = 0; snap(39);
      while (u < n) {
        cu = u; snap(40);
        snap(41);
        if (color[u] === BLANCO) {
          snap(42, { raiz: u });
          auxPila(u);
          cu = u;
        }
        u = u + 1;
        cu = u; snap(43);
      }
      cu = u; snap(40);
      cu = null;
      orden.reverse(); invertido = true; snap(44);
      snap(45);
      snap(46, { hecho: true });
    }

    if (pila) { conPila(); } else { recursiva(); }
    var ult = pasos[pasos.length - 1];
    ult.resultadoOrden = orden.slice();
    ult.resultadoCiclo = ciclo === true;
    return pasos;
  }

  /* Resumen de una corrida: orden, ciclo, tiempos, raices y primer retroceso. */
  function resumen(params) {
    var pasos = simular(params), ult = pasos[pasos.length - 1], raices = [], retro = null, m = 0;
    while (m < pasos.length) {
      if (pasos[m].raiz !== undefined) { raices.push(pasos[m].raiz); }
      if (pasos[m].retroceso !== undefined && retro === null) { retro = pasos[m].retroceso; }
      m = m + 1;
    }
    return { orden: ult.resultadoOrden, ciclo: ult.resultadoCiclo, d: ult.d, f: ult.f, raices: raices, retroceso: retro };
  }

  return { codigoDe: codigoDe, simular: simular, resumen: resumen };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var GRAFOS = [
      { boton: "Receta, siete vértices",
        texto: "Preparar una lasaña: una flecha dice qué tiene que estar listo antes de qué.",
        nombres: ["salsa", "pasta", "queso", "cebolla", "armar", "hornear", "servir"],
        G: [[4], [4], [4, 6], [0], [5], [6], []],
        pos: [[1.2, 2.6], [1.2, 1.4], [1.2, 0.2], [0.0, 2.6], [2.6, 1.5], [3.8, 1.5], [5.0, 1.5]],
        ciclo: false },
      { boton: "Proyecto, ocho",
        texto: "Tareas de un proyecto de software: una flecha va de la tarea que se hace antes a la que depende de ella.",
        nombres: ["pruebas", "despliegue", "código", "diseño", "requisitos", "manual", "revisión", "formación"],
        G: [[6], [7], [0], [2, 5], [3, 0], [7], [1], []],
        pos: [[3.3, 2.6], [4.6, 1.5], [2.2, 2.6], [1.1, 1.5], [0.0, 1.5], [2.2, 0.4], [4.6, 2.6], [3.5, 0.4]],
        ciclo: false },
      { boton: "Paquetes, nueve",
        texto: "Compilar un sistema: una flecha va del paquete que debe estar compilado al que lo necesita.",
        nombres: ["libc", "zlib", "ssl", "red", "app", "pruebas", "json", "gui", "log"],
        G: [[1, 2], [2], [3], [4], [5], [], [3, 7], [4], [3, 7]],
        pos: [[0.0, 2.0], [1.2, 3.0], [2.4, 2.0], [3.6, 2.0], [4.6, 2.0], [5.6, 2.0], [1.0, 0.8], [4.2, 0.7], [2.4, 0.0]],
        ciclo: false },
      { boton: "Con un ciclo, seis",
        texto: "Señales entre módulos de un sistema de monitoreo: una flecha va del módulo que emite al que recibe.",
        nombres: ["sensor", "filtro", "mezcla", "alarma", "registro", "ajuste"],
        G: [[1], [2], [3, 4], [5], [], [1]],
        pos: [[0.0, 1.5], [1.2, 1.5], [2.4, 1.5], [3.6, 2.5], [3.6, 0.5], [2.4, 3.2]],
        ciclo: true }
    ];
    var BLANCO = 0;
    var COLOR_NODO = [
      { relleno: "#ffffff", borde: "#6b7280", tinta: "#24292f" },
      { relleno: "#b8bec7", borde: "#4b5563", tinta: "#24292f" },
      { relleno: "#3c3f44", borde: "#24292f", tinta: "#ffffff" }
    ];
    var NOMBRE_COLOR = ["blanco", "gris", "negro"];
    var presetActual = 0, version = "recursiva";

    function g() { return GRAFOS[presetActual]; }
    function paramsActuales() { return { G: g().G, nombres: g().nombres, pos: g().pos, version: version }; }
    function lista(ids, nom) { return ids.length === 0 ? "[ ]" : "[" + ids.map(function (k) { return nom[k]; }).join(", ") + "]"; }

    function dibujar(a) {
      var p = g();
      var svg = DIB.dibujar({
        pos: p.pos, G: p.G, nombres: p.nombres,
        nodo: function (i) {
          var s = { relleno: "#ffffff", borde: "#6b7280", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (a) {
            var c = COLOR_NODO[a.color[i]];
            s = { relleno: c.relleno, borde: c.borde, tinta: c.tinta, grueso: 2.2, nota: "" };
            if (a.d[i] > 0) { s.nota = a.d[i] + "/" + (a.f[i] > 0 ? a.f[i] : "·"); }
            if (a.foco === i) { s.borde = "#e8a13d"; s.grueso = 4.2; }
          }
          return s;
        },
        arista: function (u, v) {
          var e = { color: "gris", grueso: 1.6 };
          if (a && a.retroceso && a.retroceso[0] === u && a.retroceso[1] === v) { e = { color: "rojo", grueso: 3.4 }; }
          else if (a && a.baja && a.baja[0] === u && a.baja[1] === v) { e = { color: "verde", grueso: 2.9 }; }
          else if (a && a.mira && a.mira[0] === u && a.mira[1] === v) { e = { color: "azul", grueso: 2.9 }; }
          return e;
        }
      });
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function alPintar(e) {
      var a = e.actual, p = g(), nom = p.nombres, n = nom.length;
      dibujar(a);
      var rotulo, texto;
      if (version === "pila") {
        rotulo = "pila (la cima es el último)";
        texto = a && a.pend.length > 0
          ? "[" + a.pend.map(function (t) { return "(" + nom[t[0]] + ", " + (t[1] ? "True" : "False") + ")"; }).join(", ") + "]"
          : "[ ]";
      } else {
        rotulo = "Pila de llamadas";
        texto = a && a.llamadas.length > 0
          ? a.llamadas.map(function (k) { return "topo_aux(" + nom[k] + ")"; }).join(" › ")
          : "vacía";
      }
      document.getElementById("rot-estructura").textContent = rotulo;
      document.getElementById("ver-estructura").textContent = texto;
      document.getElementById("rot-orden").textContent = a && a.invertido
        ? "orden, ya invertida (el orden topológico)" : "orden (se llena por f creciente)";
      document.getElementById("ver-orden").textContent = a ? lista(a.orden, nom) : "[ ]";

      var filas = "", i = 0;
      while (i < n) {
        var col = a ? a.color[i] : BLANCO;
        filas += "<tr><td>" + nom[i] + "</td><td>" + (a && a.d[i] > 0 ? a.d[i] : "–") + "</td><td>" +
                 (a && a.f[i] > 0 ? a.f[i] : "–") + "</td><td>" + NOMBRE_COLOR[col] + "</td></tr>";
        i = i + 1;
      }
      document.getElementById("cuerpo-tabla").innerHTML = filas;

      var cierre = "";
      if (a && a.hecho) {
        if (a.resultadoCiclo) {
          cierre = "<b>ciclo[0] terminó en True.</b> La lista " + lista(a.orden, nom) +
                   " no es un orden topológico: en un grafo con ciclo no existe ninguno.";
        } else {
          cierre = "<b>Orden topológico:</b> " + a.orden.map(function (k) { return nom[k]; }).join(" → ") +
                   ". Cada flecha del grafo va de un vértice a otro que queda más a la derecha.";
        }
      }
      var caja = document.getElementById("resultado-final");
      caja.className = cierre === "" ? "veredicto" : (a.resultadoCiclo ? "veredicto mal" : "veredicto bien");
      caja.innerHTML = cierre;
    }

    function chipsDe(v) {
      return v === "pila"
        ? [{ campo: "u", rotulo: "u" }, { campo: "w", rotulo: "w" }, { campo: "v", rotulo: "v" }, { campo: "ciclo", rotulo: "ciclo[0]", clase: "cuenta" }]
        : [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "ciclo", rotulo: "ciclo[0]", clase: "cuenta" }];
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
        chips: chipsDe(version), paramsIniciales: paramsActuales(), alPintar: alPintar
      });
    }

    function prepararPrediccion() {
      var p = g(), sel = document.getElementById("eleccion"), html = "<option value=''>Escoja un vértice</option>", i = 0;
      while (i < p.nombres.length) { html += "<option value='" + i + "'>" + p.nombres[i] + "</option>"; i = i + 1; }
      sel.innerHTML = html;
      document.getElementById("pregunta").innerHTML = p.ciclo
        ? "La búsqueda va a topar con un vértice gris. ¿Cuál?"
        : "¿Cuál vértice queda de primero en <code>orden</code> después de invertirla?";
      document.getElementById("ver-texto").textContent = p.texto;
      var v = document.getElementById("veredicto");
      v.className = "veredicto"; v.textContent = "";
    }

    function evaluar() {
      var p = g(), nom = p.nombres, n = nom.length;
      var sel = parseInt(document.getElementById("eleccion").value, 10);
      var v = document.getElementById("veredicto");
      if (isNaN(sel)) { v.className = "veredicto mal"; v.textContent = "Escoja un vértice primero."; return; }
      var r = EJERCICIO.resumen(paramsActuales());
      var ok = false, msg = "";
      if (p.ciclo) {
        var dest = r.retroceso[1], orig = r.retroceso[0];
        if (sel === dest) {
          ok = true;
          msg = "Correcto: " + nom[dest] + ". La búsqueda lo encuentra gris cuando mira la flecha " + nom[orig] + " → " + nom[dest] +
                ": " + nom[dest] + " todavía no terminó y " + nom[orig] + " es descendiente suyo, así que esa flecha cierra un ciclo y ciclo[0] pasa a True.";
        } else if (sel === orig) {
          msg = "Ese es el vértice desde el que se mira la flecha, no al que llega. El que se topa gris es el destino de esa flecha.";
        } else if (sel === 0) {
          msg = "El vértice 0 arranca la búsqueda y queda gris mucho tiempo, pero nada en el ciclo vuelve a él. Busque una flecha que apunte hacia atrás, a un vértice que sigue abierto.";
        } else {
          msg = "No. Ejecute hasta que ciclo[0] cambie y mire adónde apunta la flecha roja: el destino es un vértice que todavía no terminó.";
        }
      } else {
        var ans = r.orden[0], ult = r.raices[r.raices.length - 1];
        if (sel === ans) {
          ok = true;
          msg = "Correcto: " + nom[ans] + ". Es el último en terminar (f = " + r.f[ans] + ") y la raíz del último árbol del bosque; la lista se llena por f creciente y al invertirla queda de primero.";
        } else if (sel === r.orden[n - 1]) {
          msg = "Ese es el primero en terminar (f = " + r.f[sel] + "), el que se agrega primero a orden. La inversión lo deja de último.";
        } else if (sel === 0 && ans !== 0) {
          msg = "El " + nom[0] + " es el que arranca la búsqueda, pero arrancar primero no es quedar primero: termina antes que los árboles que arrancan después, y la inversión los pone delante.";
        } else if (r.raices.indexOf(sel) >= 0) {
          msg = "El " + nom[sel] + " es la raíz de un árbol, pero después arranca otro árbol (el de " + nom[ult] + ") y todo lo suyo termina más tarde que " + nom[sel] + ".";
        } else {
          msg = "El " + nom[sel] + " no es raíz de ningún árbol, y el último en terminar siempre lo es. Cuente los árboles del bosque y mire el último.";
        }
      }
      v.className = ok ? "veredicto bien" : "veredicto mal";
      v.textContent = msg;
    }

    arrancar();
    prepararPrediccion();
    document.getElementById("btn-comprobar").addEventListener("click", evaluar);

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        prepararPrediccion();
        Motor.reiniciar(paramsActuales());
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        version = btn.getAttribute("data-version");
        prepararPrediccion();
        arrancar();
      });
    });
  })();
}
