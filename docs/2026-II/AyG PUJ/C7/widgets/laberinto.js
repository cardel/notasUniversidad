/* Ejercicio interactivo: la cuadricula como grafo implicito (clase 7).
   BFS sobre un laberinto sin construir la lista de adyacencia. */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def distancias(lab, r0, c0, DR, DC):", num: null },
    { txt: "    R = len(lab)",                 num: 1 },
    { txt: "    C = len(lab[0])",              num: 2 },
    { txt: "    d = tabla(R, C, -1)",          num: 3 },
    { txt: "    d[r0][c0] = 0",                num: 4 },
    { txt: "    cola = deque()",               num: 5 },
    { txt: "    cola.append((r0, c0))",        num: 6 },
    { txt: "    while len(cola) > 0:",         num: 7,  bloque: 1 },
    { txt: "        actual = cola.popleft()",  num: 8,  bloque: 1 },
    { txt: "        r = actual[0]",            num: 9,  bloque: 1 },
    { txt: "        c = actual[1]",            num: 10, bloque: 1 },
    { txt: "        k = 0",                    num: 11, bloque: 1 },
    { txt: "        while k < len(DR):",       num: 12, bloque: 2 },
    { txt: "            nr = r + DR[k]",       num: 13, bloque: 2 },
    { txt: "            nc = c + DC[k]",       num: 14, bloque: 2 },
    { txt: "            if es_libre(lab, nr, nc) and d[nr][nc] == -1:", num: 15, bloque: 2 },
    { txt: "                d[nr][nc] = d[r][c] + 1", num: 16, bloque: 2 },
    { txt: "                cola.append((nr, nc))",   num: 17, bloque: 2 },
    { txt: "            k = k + 1",            num: 18, bloque: 2 },
    { txt: "    return d",                     num: 19 }
  ];

  function esLibre(lab, r, c) {
    return r >= 0 && r < lab.length && c >= 0 && c < lab[0].length && lab[r].charAt(c) !== "#";
  }

  function simular(params) {
    var lab = params.lab, DR = params.DR, DC = params.DC;
    var R = lab.length, C = lab[0].length;
    var pasos = [];
    var d = null, cola = null, r = null, c = null;
    function copiaD() {
      var t = [];
      var i = 0;
      while (i < R) { t.push(d[i].slice()); i = i + 1; }
      return t;
    }
    function snap(linea, extra) {
      var q = { linea: linea, r: r === null ? "–" : r, c: c === null ? "–" : c,
                d: d === null ? null : copiaD(), cola: cola === null ? [] : cola.slice() };
      if (extra) { for (var x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }
    snap(1); snap(2);
    d = [];
    var i = 0;
    while (i < R) { d.push([]); var j = 0; while (j < C) { d[i].push(-1); j = j + 1; } i = i + 1; }
    snap(3);
    d[params.r0][params.c0] = 0; snap(4);
    cola = []; snap(5);
    cola.push([params.r0, params.c0]); snap(6);
    var corriendo = true;
    while (corriendo) {
      snap(7, { chequeo: true });
      if (cola.length > 0) {
        var actual = cola.shift();
        snap(8, { sale: actual });
        r = actual[0]; snap(9);
        c = actual[1]; snap(10);
        var k = 0; snap(11);
        var nuevos = [];
        var dentro = true;
        while (dentro) {
          snap(12);
          if (k < DR.length) {
            var nr = r + DR[k]; snap(13);
            var nc = c + DC[k]; snap(14);
            snap(15, { mira: [nr, nc] });
            if (esLibre(lab, nr, nc) && d[nr][nc] === -1) {
              d[nr][nc] = d[r][c] + 1; snap(16);
              cola.push([nr, nc]); snap(17);
              nuevos.push([nr, nc]);
            }
            k = k + 1; snap(18);
          } else { dentro = false; }
        }
        pasos[pasos.length - 1].salioDe = actual;
        pasos[pasos.length - 1].nuevos = nuevos;
      } else { corriendo = false; }
    }
    r = null; c = null;
    snap(19, { fin: true });
    return pasos;
  }

  function distanciasRef(lab, r0, c0, DR, DC) {
    var R = lab.length, C = lab[0].length;
    var d = [];
    var i = 0;
    while (i < R) { d.push([]); var j = 0; while (j < C) { d[i].push(-1); j = j + 1; } i = i + 1; }
    d[r0][c0] = 0;
    var cola = [[r0, c0]];
    var h = 0;
    while (h < cola.length) {
      var r = cola[h][0], c = cola[h][1];
      h = h + 1;
      var k = 0;
      while (k < DR.length) {
        var nr = r + DR[k], nc = c + DC[k];
        if (esLibre(lab, nr, nc) && d[nr][nc] === -1) { d[nr][nc] = d[r][c] + 1; cola.push([nr, nc]); }
        k = k + 1;
      }
    }
    return d;
  }

  function buscar(lab, letra) {
    var i = 0;
    while (i < lab.length) {
      var j = lab[i].indexOf(letra);
      if (j >= 0) { return [i, j]; }
      i = i + 1;
    }
    return null;
  }

  return { codigo: CODIGO, simular: simular, distanciasRef: distanciasRef, esLibre: esLibre, buscar: buscar };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var L1 = ["S.#....", ".##.##.", "...#...", ".#...#C"];
    var L2 = ["S.#....", ".##.##.", "...#.#.", ".#...#C"];
    var D4 = { DR: [1, -1, 0, 0], DC: [0, 0, 1, -1] };
    var D8 = { DR: [1, -1, 0, 0, 1, 1, -1, -1], DC: [0, 0, 1, -1, 1, -1, 1, -1] };
    function preset(lab, dir) {
      var s = EJERCICIO.buscar(lab, "S");
      return { lab: lab, r0: s[0], c0: s[1], DR: dir.DR, DC: dir.DC };
    }
    var PRESETS = [preset(L1, D4), preset(L1, D8), preset(L2, D4)];
    var verticeOK = false;

    function dibujar(params, d, sale, mira) {
      var lab = params.lab;
      var R = lab.length, C = lab[0].length;
      var cel = 34;
      var svg = "<svg viewBox='0 0 " + (C * cel + 2) + " " + (R * cel + 2) + "' width='100%' style='max-width:" + (C * cel + 2) + "px'>";
      var r = 0;
      while (r < R) {
        var c = 0;
        while (c < C) {
          var ch = lab[r].charAt(c);
          var x = c * cel + 1, y = r * cel + 1;
          var fill = "#ffffff";
          if (ch === "#") { fill = "#9ca3af"; }
          else if (d !== null && d[r][c] >= 0) { fill = "#e3edf8"; }
          if (sale && sale[0] === r && sale[1] === c) { fill = "#1f5fa8"; }
          var stroke = "#d8dee6";
          if (mira && mira[0] === r && mira[1] === c) { stroke = "#e8a13d"; }
          svg += "<rect x='" + x + "' y='" + y + "' width='" + cel + "' height='" + cel +
                 "' fill='" + fill + "' stroke='" + stroke + "' stroke-width='" + (mira && mira[0] === r && mira[1] === c ? 3 : 1) + "'/>";
          var texto = "";
          if (ch === "S" || ch === "C") { texto = ch; }
          else if (d !== null && d[r][c] >= 0) { texto = d[r][c]; }
          if (ch !== "#" && d !== null && d[r][c] >= 0 && (ch === "S" || ch === "C")) { texto = ch + "·" + d[r][c]; }
          if (texto !== "") {
            var color = (sale && sale[0] === r && sale[1] === c) ? "#ffffff" : "#24292f";
            svg += "<text x='" + (x + cel / 2) + "' y='" + (y + cel / 2 + 5) + "' text-anchor='middle' font-size='13' font-weight='700' fill='" + color + "'>" + texto + "</text>";
          }
          c = c + 1;
        }
        r = r + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grid").innerHTML = svg;
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(e.params, a ? a.d : null, a ? a.sale : null, a ? a.mira : null);
      document.getElementById("ver-cola").textContent =
        a && a.cola.length > 0 ? a.cola.map(function (p) { return "(" + p[0] + "," + p[1] + ")"; }).join(" ") : "vacía";
      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var fila = 0;
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var q = e.pasos[m];
        if (q.salioDe !== undefined) {
          fila = fila + 1;
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + fila + "</td><td>(" + q.salioDe[0] + "," + q.salioDe[1] + ")</td><td>" +
            q.d[q.salioDe[0]][q.salioDe[1]] + "</td><td>" +
            (q.nuevos.length ? q.nuevos.map(function (p) { return "(" + p[0] + "," + p[1] + ")"; }).join(" ") : "—") + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (fila === 0) {
        cuerpo.innerHTML = "<tr><td colspan='4' class='pend'>Ejecute: cada celda que sale de la cola agrega una fila.</td></tr>";
      }
      var cafe = EJERCICIO.buscar(e.params.lab, "C");
      var aviso = document.getElementById("aviso-final");
      if (a && a.fin) {
        var dc = a.d[cafe[0]][cafe[1]];
        aviso.className = "alerta";
        aviso.innerHTML = dc >= 0
          ? "El café quedó a <b>" + dc + "</b> pasos. La cola se vació después de visitar todas las celdas alcanzables, tengan café o no."
          : "El café quedó con <b>−1</b>: la cola se vació sin tocarlo. No hay camino.";
      } else { aviso.className = ""; aviso.innerHTML = ""; }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "r", rotulo: "r" }, { campo: "c", rotulo: "c" }],
      paramsIniciales: PRESETS[0], alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var cafe = EJERCICIO.buscar(params.lab, "C");
      var d = EJERCICIO.distanciasRef(params.lab, params.r0, params.c0, params.DR, params.DC);
      var real = d[cafe[0]][cafe[1]];
      var manhattan = Math.abs(cafe[0] - params.r0) + Math.abs(cafe[1] - params.c0);
      if (valor === real) {
        return { ok: true, msg: real >= 0
          ? "Correcto: " + real + " pasos. Ejecute y vea cómo las capas se van llenando alrededor de S."
          : "Correcto: no hay camino. Ejecute y vea dónde se detiene la cola." };
      }
      if (valor === manhattan && real !== manhattan) {
        return { ok: false, msg: "Esa es la distancia en línea recta, sin paredes (" + manhattan +
          "). Las paredes obligan a rodear; cuente sobre el dibujo." };
      }
      return { ok: false, msg: "No coincide. Siga con el dedo un camino que evite las paredes y cuente los pasos; después busque uno más corto." };
    });

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        Motor.limpiarVeredicto();
        Motor.reiniciar(PRESETS[parseInt(btn.getAttribute("data-preset"), 10)]);
      });
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id);
      v.className = ok ? "veredicto bien" : "veredicto mal";
      v.innerHTML = texto;
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-vertice button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          verticeOK = true;
          veredicto("veredicto-vertice", true, "Correcto: cada celda libre es un vértice y cada par de celdas libres contiguas, una arista. Nadie guarda esa lista: la línea 13 y la 14 la calculan cuando hace falta.");
          document.getElementById("paso-1").classList.remove("bloqueado");
        } else if (op === "filas") {
          veredicto("veredicto-vertice", false, "Una fila no se recorre como unidad: el simio pasa de una celda a otra, y esa es la escala del grafo.");
        } else if (op === "paredes") {
          veredicto("veredicto-vertice", false, "Las paredes no son vértices: por ellas no se pasa. Son justamente las celdas que la regla de vecinos descarta.");
        } else {
          veredicto("veredicto-vertice", false, "Los pasos son las aristas, no los vértices. Un vértice es un lugar donde el simio puede estar.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p1");
        if (op === "tabla") {
          veredicto("veredicto-p1", true, "Correcto: los ocho desplazamientos entran en DR y DC y el resto del recorrido no se toca. Cambie al segundo preset y compare la distancia.");
          document.getElementById("paso-1").classList.add("hecho");
        } else if (op === "todo") {
          veredicto("veredicto-p1", false, "No hace falta: el while de la línea 12 recorre len(DR) desplazamientos, sean cuatro u ocho. Solo cambia la tabla.");
        } else {
          veredicto("veredicto-p1", false, "La cola y la marca no saben cuántas direcciones hay. Lo único que las conoce es la tabla de desplazamientos.");
        }
      });
    });
  })();
}
