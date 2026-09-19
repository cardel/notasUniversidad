/* Ejercicio interactivo: UVa 10977, Enchanted Forest (clase 7). El peligro
   no viene listado: se calcula con la distancia euclidiana a cada
   Jigglypuff, y despues la amplitud va de (1, 1) a (R, C). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def salida_mas_corta(mundo, R, C):",   num: null },
    { txt: "    d = matriz(R, C, -1)",              num: 1 },
    { txt: "    cola = deque()",                    num: 2 },
    { txt: "    if mundo[1][1] == 0:",              num: 3 },
    { txt: "        d[1][1] = 0",                   num: 4 },
    { txt: "        cola.append((1, 1))",           num: 5 },
    { txt: "    while len(cola) > 0:",              num: 6,  bloque: 1 },
    { txt: "        actual = cola.popleft()",       num: 7,  bloque: 1 },
    { txt: "        r = actual[0]",                 num: 8,  bloque: 1 },
    { txt: "        c = actual[1]",                 num: 9,  bloque: 1 },
    { txt: "        k = 0",                         num: 10, bloque: 1 },
    { txt: "        while k < 4:",                  num: 11, bloque: 2 },
    { txt: "            nr = r + dr[k]",            num: 12, bloque: 2 },
    { txt: "            nc = c + dc[k]",            num: 13, bloque: 2 },
    { txt: "            if nr >= 1 and nr <= R and nc >= 1 and nc <= C:", num: 14, bloque: 2 },
    { txt: "                if mundo[nr][nc] == 0 and d[nr][nc] == -1:",  num: 15, bloque: 3 },
    { txt: "                    d[nr][nc] = d[r][c] + 1",                 num: 16, bloque: 3 },
    { txt: "                    cola.append((nr, nc))",                   num: 17, bloque: 3 },
    { txt: "            k = k + 1",                 num: 18, bloque: 2 },
    { txt: "    return d[R][C]",                    num: 19 }
  ];

  var DR = [0, -1, 0, 1];
  var DC = [-1, 0, 1, 0];

  /* Matriz de (R + 1) x (C + 1) con el mismo valor; la fila y la columna 0
     no se usan porque el enunciado numera desde 1. */
  function matriz(R, C, valor) {
    var m = [];
    var i = 0;
    while (i <= R) {
      var fila = [];
      var j = 0;
      while (j <= C) { fila.push(valor); j = j + 1; }
      m.push(fila);
      i = i + 1;
    }
    return m;
  }

  function esRoca(p, r, c) {
    var k = 0;
    var si = false;
    while (k < p.rocas.length) {
      if (p.rocas[k][0] === r && p.rocas[k][1] === c) { si = true; }
      k = k + 1;
    }
    return si;
  }

  function esJigglypuff(p, r, c) {
    var k = 0;
    var si = false;
    while (k < p.jig.length) {
      if (p.jig[k][0] === r && p.jig[k][1] === c) { si = true; }
      k = k + 1;
    }
    return si;
  }

  /* Celdas a distancia euclidiana L o menos de algun Jigglypuff, mirando
     solo el cuadrado de lado 2L + 1 recortado al bosque. */
  function peligroDe(p) {
    var marca = matriz(p.R, p.C, 0);
    var k = 0;
    while (k < p.jig.length) {
      var x = p.jig[k][0], y = p.jig[k][1], L = p.jig[k][2];
      var i = Math.max(1, x - L);
      while (i <= Math.min(p.R, x + L)) {
        var j = Math.max(1, y - L);
        while (j <= Math.min(p.C, y + L)) {
          if ((x - i) * (x - i) + (y - j) * (y - j) <= L * L) { marca[i][j] = 1; }
          j = j + 1;
        }
        i = i + 1;
      }
      k = k + 1;
    }
    return marca;
  }

  /* El mundo que recorre la amplitud: 0 libre, -1 bloqueado o peligroso. */
  function mundoDe(p) {
    var mundo = matriz(p.R, p.C, 0);
    var peligro = peligroDe(p);
    var i = 1;
    while (i <= p.R) {
      var j = 1;
      while (j <= p.C) {
        if (esRoca(p, i, j) || peligro[i][j] === 1) { mundo[i][j] = -1; }
        j = j + 1;
      }
      i = i + 1;
    }
    return mundo;
  }

  /* Las celdas que el estudiante tiene que marcar: peligrosas que no son
     roca ni el Jigglypuff mismo. */
  function porMarcar(p) {
    var peligro = peligroDe(p);
    var lista = [];
    var i = 1;
    while (i <= p.R) {
      var j = 1;
      while (j <= p.C) {
        if (peligro[i][j] === 1 && !esRoca(p, i, j) && !esJigglypuff(p, i, j)) { lista.push([i, j]); }
        j = j + 1;
      }
      i = i + 1;
    }
    return lista;
  }

  function simular(params) {
    var p = params.bosque;
    var R = p.R, C = p.C;
    var mundo = mundoDe(p);
    var pasos = [];
    var d = null, cola = null, r = null, c = null;
    function copiaD() {
      var t = [];
      var i = 0;
      while (i <= R) { t.push(d[i].slice()); i = i + 1; }
      return t;
    }
    function snap(linea, extra) {
      var q = { linea: linea, r: r === null ? "–" : r, c: c === null ? "–" : c,
                d: d === null ? null : copiaD(), cola: cola === null ? [] : cola.slice() };
      if (extra) { for (var x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }
    d = matriz(R, C, -1); snap(1);
    cola = []; snap(2);
    snap(3);
    if (mundo[1][1] === 0) {
      d[1][1] = 0; snap(4);
      cola.push([1, 1]); snap(5);
    }
    var corriendo = true;
    while (corriendo) {
      snap(6, { chequeo: true });
      if (cola.length > 0) {
        var actual = cola.shift();
        snap(7, { sale: actual });
        r = actual[0]; snap(8);
        c = actual[1]; snap(9);
        var k = 0; snap(10);
        var nuevos = [];
        var dentro = true;
        while (dentro) {
          snap(11);
          if (k < 4) {
            var nr = r + DR[k]; snap(12);
            var nc = c + DC[k]; snap(13);
            snap(14, { mira: [nr, nc] });
            if (nr >= 1 && nr <= R && nc >= 1 && nc <= C) {
              snap(15, { mira: [nr, nc] });
              if (mundo[nr][nc] === 0 && d[nr][nc] === -1) {
                d[nr][nc] = d[r][c] + 1; snap(16, { mira: [nr, nc] });
                cola.push([nr, nc]); snap(17, { mira: [nr, nc] });
                nuevos.push([nr, nc]);
              }
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

  /* La respuesta del problema: pasos minimos o -1. */
  function respuesta(p) {
    var mundo = mundoDe(p);
    var d = matriz(p.R, p.C, -1);
    var cola = [];
    if (mundo[1][1] === 0) { d[1][1] = 0; cola.push([1, 1]); }
    var h = 0;
    while (h < cola.length) {
      var r = cola[h][0], c = cola[h][1];
      h = h + 1;
      var k = 0;
      while (k < 4) {
        var nr = r + DR[k], nc = c + DC[k];
        if (nr >= 1 && nr <= p.R && nc >= 1 && nc <= p.C) {
          if (mundo[nr][nc] === 0 && d[nr][nc] === -1) { d[nr][nc] = d[r][c] + 1; cola.push([nr, nc]); }
        }
        k = k + 1;
      }
    }
    return d[p.R][p.C];
  }

  /* Distancia euclidiana al cuadrado desde (r, c) al Jigglypuff mas cercano
     y el volumen de ese Jigglypuff: para explicar por que una celda sobra. */
  function masCercano(p, r, c) {
    var mejor = null;
    var k = 0;
    while (k < p.jig.length) {
      var x = p.jig[k][0], y = p.jig[k][1], L = p.jig[k][2];
      var d2 = (x - r) * (x - r) + (y - c) * (y - c);
      if (mejor === null || d2 < mejor.d2) { mejor = { x: x, y: y, L: L, d2: d2 }; }
      k = k + 1;
    }
    return mejor;
  }

  /* Un Jigglypuff cuyo volumen cubre a (r, c), si lo hay. */
  function queCubre(p, r, c) {
    var cubre = null;
    var k = 0;
    while (k < p.jig.length) {
      var x = p.jig[k][0], y = p.jig[k][1], L = p.jig[k][2];
      var d2 = (x - r) * (x - r) + (y - c) * (y - c);
      if (cubre === null && d2 <= L * L) { cubre = { x: x, y: y, L: L, d2: d2 }; }
      k = k + 1;
    }
    return cubre;
  }

  return { codigo: CODIGO, matriz: matriz, mundoDe: mundoDe, peligroDe: peligroDe,
           porMarcar: porMarcar, esRoca: esRoca, esJigglypuff: esJigglypuff,
           simular: simular, respuesta: respuesta, masCercano: masCercano,
           queCubre: queCubre };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { nombre: "B1", R: 6, C: 7, rocas: [[1, 4]], jig: [[3, 4, 2]] },
      { nombre: "B2", R: 8, C: 7,
        rocas: [[3, 1], [3, 2], [3, 4], [3, 5], [3, 6], [6, 2], [6, 3], [6, 6], [6, 7]],
        jig: [[3, 3, 1], [6, 5, 1]] },
      { nombre: "B3", R: 5, C: 6, rocas: [[3, 3]], jig: [[4, 6, 1], [1, 3, 1]] }
    ];
    var actual = PRESETS[0];
    var marcas = null;      /* lo que el estudiante marco como peligroso */
    var revisado = null;    /* tras comprobar: matriz con "bien", "falta", "sobra" */
    var peligroOK = false;
    var volumenOK = false;

    function limpiarMarcas() {
      marcas = EJERCICIO.matriz(actual.R, actual.C, 0);
      revisado = null;
    }

    /* ---------- dibujo ---------- */
    function dibujar(idPanel, p, opciones) {
      var R = p.R, C = p.C;
      var cel = 30, cab = 16;
      var ancho = C * cel + cab + 2, alto = R * cel + cab + 2;
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:" + ancho + "px'>";
      var j = 1;
      while (j <= C) {
        svg += "<text x='" + (cab + (j - 1) * cel + cel / 2 + 1) + "' y='" + (cab - 4) +
               "' text-anchor='middle' font-size='10' fill='#6b7280'>" + j + "</text>";
        j = j + 1;
      }
      var i = 1;
      while (i <= R) {
        svg += "<text x='" + (cab - 5) + "' y='" + (cab + (i - 1) * cel + cel / 2 + 4) +
               "' text-anchor='end' font-size='10' fill='#6b7280'>" + i + "</text>";
        j = 1;
        while (j <= C) {
          var x = cab + (j - 1) * cel + 1, y = cab + (i - 1) * cel + 1;
          var roca = EJERCICIO.esRoca(p, i, j);
          var jig = EJERCICIO.esJigglypuff(p, i, j);
          var fill = "#ffffff", stroke = "#d8dee6", grosor = 1, texto = "", color = "#24292f";
          var peligroso = opciones.peligro !== null && opciones.peligro[i][j] === 1;
          if (roca) { fill = "#9ca3af"; }
          else if (jig) { fill = "#f4a3b0"; texto = "J"; }
          else if (peligroso) { fill = "#fbd5d5"; }
          if (opciones.revisado !== null && !roca && !jig) {
            if (opciones.revisado[i][j] === "sobra") { stroke = "#b3261e"; grosor = 3; }
            else if (opciones.revisado[i][j] === "falta") { stroke = "#e8a13d"; grosor = 3; texto = "?"; color = "#b3261e"; }
          }
          if (opciones.d !== null && opciones.d[i][j] >= 0) {
            fill = "#e3edf8";
            texto = String(opciones.d[i][j]);
          }
          if (opciones.sale && opciones.sale[0] === i && opciones.sale[1] === j) { fill = "#1f5fa8"; color = "#ffffff"; }
          if (opciones.mira && opciones.mira[0] === i && opciones.mira[1] === j) { stroke = "#e8a13d"; grosor = 3; }
          if (!roca && !jig && i === 1 && j === 1) { texto = texto === "" ? "E" : "E·" + texto; }
          if (!roca && !jig && i === R && j === C) { texto = texto === "" ? "S" : "S·" + texto; }
          var atrib = opciones.clic && !roca && !jig ? " class='celda-b' data-r='" + i + "' data-c='" + j + "' style='cursor:pointer'" : "";
          svg += "<rect" + atrib + " x='" + x + "' y='" + y + "' width='" + cel + "' height='" + cel +
                 "' fill='" + fill + "' stroke='" + stroke + "' stroke-width='" + grosor + "'/>";
          if (texto !== "") {
            svg += "<text pointer-events='none' x='" + (x + cel / 2) + "' y='" + (y + cel / 2 + 4) +
                   "' text-anchor='middle' font-size='12' font-weight='700' fill='" + color + "'>" + texto + "</text>";
          }
          j = j + 1;
        }
        i = i + 1;
      }
      svg += "</svg>";
      document.getElementById(idPanel).innerHTML = svg;
    }

    /* ---------- 2. marcar el peligro ---------- */
    function pintarMarcado() {
      dibujar("panel-marcar", actual, { peligro: marcas, revisado: revisado, d: null, sale: null, mira: null, clic: true });
      Array.prototype.forEach.call(document.querySelectorAll("#panel-marcar .celda-b"), function (celda) {
        celda.addEventListener("click", function () {
          var r = parseInt(celda.getAttribute("data-r"), 10);
          var c = parseInt(celda.getAttribute("data-c"), 10);
          marcas[r][c] = marcas[r][c] === 1 ? 0 : 1;
          revisado = null;
          peligroOK = false;
          limpiarVeredicto("veredicto-peligro");
          bloquearEjecucion();
          pintarMarcado();
        });
      });
    }

    function par(p) { return "(" + p[0] + "," + p[1] + ")"; }

    function comprobarPeligro() {
      var esperadas = EJERCICIO.porMarcar(actual);
      var esperada = EJERCICIO.matriz(actual.R, actual.C, 0);
      var k = 0;
      while (k < esperadas.length) { esperada[esperadas[k][0]][esperadas[k][1]] = 1; k = k + 1; }
      revisado = EJERCICIO.matriz(actual.R, actual.C, "");
      var faltan = [], sobran = [];
      var i = 1;
      while (i <= actual.R) {
        var j = 1;
        while (j <= actual.C) {
          if (!EJERCICIO.esRoca(actual, i, j) && !EJERCICIO.esJigglypuff(actual, i, j)) {
            if (esperada[i][j] === 1 && marcas[i][j] === 0) { revisado[i][j] = "falta"; faltan.push([i, j]); }
            else if (esperada[i][j] === 0 && marcas[i][j] === 1) { revisado[i][j] = "sobra"; sobran.push([i, j]); }
            else { revisado[i][j] = "bien"; }
          }
          j = j + 1;
        }
        i = i + 1;
      }
      pintarMarcado();
      if (faltan.length === 0 && sobran.length === 0) {
        peligroOK = true;
        var total = esperadas.length + actual.jig.length;
        veredicto("veredicto-peligro", true, "Correcto: " + total + " celdas peligrosas contando a " +
          (actual.jig.length === 1 ? "el Jigglypuff" : "los Jigglypuffs") + ". Ese es el mundo que " +
          "la amplitud va a recorrer; ya puede ejecutarla abajo.");
        desbloquearEjecucion();
      } else {
        peligroOK = false;
        var partes = [];
        if (faltan.length > 0) { partes.push("faltan " + faltan.map(par).join(" ")); }
        if (sobran.length > 0) { partes.push("sobran " + sobran.map(par).join(" ")); }
        var pista = "";
        if (sobran.length > 0) {
          var s = sobran[0];
          var cerca = EJERCICIO.masCercano(actual, s[0], s[1]);
          pista = " La celda " + par(s) + " está a distancia √" + cerca.d2 + " del Jigglypuff de (" +
            cerca.x + "," + cerca.y + "), y √" + cerca.d2 + " es mayor que " + cerca.L +
            ": el peligro es un círculo, no un cuadrado, y se decide con (x − i)² + (y − j)² ≤ L².";
        } else if (faltan.length > 0) {
          var f = faltan[0];
          var cercaF = EJERCICIO.queCubre(actual, f[0], f[1]);
          pista = " La celda " + par(f) + " está a distancia √" + cercaF.d2 + " del Jigglypuff de (" +
            cercaF.x + "," + cercaF.y + "), que no supera " + cercaF.L + ": cae dentro del volumen.";
        }
        veredicto("veredicto-peligro", false, "Todavía no: " + partes.join("; ") + "." + pista);
      }
    }

    function bloquearEjecucion() {
      document.getElementById("carta-ejecutar").classList.add("bloqueado");
      document.getElementById("carta-traza").classList.add("bloqueado");
    }

    function desbloquearEjecucion() {
      document.getElementById("carta-ejecutar").classList.remove("bloqueado");
      document.getElementById("carta-traza").classList.remove("bloqueado");
    }

    /* ---------- 3. ejecutar ---------- */
    function alPintar(e) {
      var a = e.actual;
      var p = e.params.bosque;
      dibujar("panel-grid", p, { peligro: EJERCICIO.peligroDe(p), revisado: null,
                                  d: a ? a.d : null, sale: a ? a.sale : null, mira: a ? a.mira : null, clic: false });
      document.getElementById("ver-cola").textContent =
        a && a.cola.length > 0 ? a.cola.map(par).join(" ") : "vacía";
      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var fila = 0;
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var q = e.pasos[m];
        if (q.salioDe !== undefined) {
          fila = fila + 1;
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + fila + "</td><td>" + par(q.salioDe) + "</td><td>" +
            q.d[q.salioDe[0]][q.salioDe[1]] + "</td><td>" +
            (q.nuevos.length ? q.nuevos.map(par).join(" ") : "—") + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (fila === 0) {
        cuerpo.innerHTML = "<tr><td colspan='4' class='pend'>Ejecute: cada celda que sale de la cola agrega una fila.</td></tr>";
      }
      var aviso = document.getElementById("aviso-final");
      if (a && a.fin) {
        var ds = a.d[p.R][p.C];
        aviso.className = "alerta";
        if (ds >= 0) {
          aviso.innerHTML = "La salida quedó a <b>" + ds + "</b> pasos: el juez espera esa cifra en una línea.";
        } else if (EJERCICIO.mundoDe(p)[1][1] !== 0) {
          aviso.innerHTML = "La entrada misma es peligrosa: la línea 3 no encoló nada, la cola arrancó vacía y " +
            "<code>d[R][C]</code> quedó en −1. El juez espera <code>Impossible.</code>";
        } else {
          aviso.innerHTML = "La salida quedó en <b>−1</b>: la cola se vació sin tocarla. El juez espera <code>Impossible.</code>";
        }
      } else { aviso.className = ""; aviso.innerHTML = ""; }
    }

    function limpiarVeredicto(id) {
      var v = document.getElementById(id);
      v.className = "veredicto";
      v.innerHTML = "";
    }

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id);
      v.className = ok ? "veredicto bien" : "veredicto mal";
      v.innerHTML = texto;
    }

    function textoBosque(p) {
      var rocas = p.rocas.map(par).join(" ");
      var jigs = p.jig.map(function (j) { return "(" + j[0] + "," + j[1] + ") con L = " + j[2]; }).join(", ");
      return "Bosque de " + p.R + " × " + p.C + ". Bloqueadas: " + (rocas === "" ? "ninguna" : rocas) +
        ". Jigglypuff" + (p.jig.length === 1 ? "" : "s") + ": " + jigs + ".";
    }

    function cambiarPreset(k) {
      actual = PRESETS[k];
      limpiarMarcas();
      peligroOK = false;
      document.getElementById("texto-bosque").textContent = textoBosque(actual);
      limpiarVeredicto("veredicto-peligro");
      bloquearEjecucion();
      pintarMarcado();
      Motor.limpiarVeredicto();
      document.getElementById("prediccion").value = "";
      Motor.reiniciar({ bosque: actual });
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "r", rotulo: "r" }, { campo: "c", rotulo: "c" }],
      paramsIniciales: { bosque: PRESETS[0] }, alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var p = params.bosque;
      var real = EJERCICIO.respuesta(p);
      var manhattan = (p.R - 1) + (p.C - 1);
      if (valor === real) {
        return { ok: true, msg: real >= 0
          ? "Correcto: " + real + " pasos. Ahora marque el peligro en la tarjeta 2 y después ejecute para ver las capas."
          : "Correcto: es Impossible. Marque el peligro en la tarjeta 2 y vea con la ejecución dónde se queda la cola." };
      }
      if (real === -1) {
        return { ok: false, msg: "Hay una celda que no se puede pisar y sin ella no se sale. Mire qué queda dentro de cada volumen." };
      }
      if (valor === -1) {
        return { ok: false, msg: "Sí hay camino. Rodee el peligro por el lado que quede libre y cuente los pasos." };
      }
      if (valor === manhattan && real !== manhattan) {
        return { ok: false, msg: "Esa es la distancia sin obstáculos (" + manhattan + "). Aquí hay que devolverse: cuente sobre el dibujo el camino que rodea las rocas y el peligro." };
      }
      return { ok: false, msg: "No coincide. Siga con el dedo un camino que evite rocas y peligro y cuente los pasos; después busque uno más corto." };
    });

    document.getElementById("btn-comprobar-peligro").addEventListener("click", comprobarPeligro);
    document.getElementById("btn-limpiar-peligro").addEventListener("click", function () {
      limpiarMarcas();
      peligroOK = false;
      limpiarVeredicto("veredicto-peligro");
      bloquearEjecucion();
      pintarMarcado();
    });

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        cambiarPreset(parseInt(btn.getAttribute("data-preset"), 10));
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-volumen button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          volumenOK = true;
          veredicto("veredicto-volumen", true, "Correcto. Las diagonales quedan a √2, y √2 es mayor que 1: " +
            "con L = 1 caen el Jigglypuff y sus cuatro vecinas ortogonales. La desigualdad " +
            "(x − i)² + (y − j)² ≤ L² dibuja un círculo, y el círculo de radio 1 " +
            "sobre la cuadrícula es esa cruz.");
          document.getElementById("paso-1").classList.remove("bloqueado");
        } else if (op === "ocho") {
          veredicto("veredicto-volumen", false, "Las cuatro diagonales están a √2 del Jigglypuff, más de 1. " +
            "El cuadrado de 3 × 3 es lo que sale de comparar cada coordenada por separado; " +
            "el enunciado compara la distancia, y la distancia es euclidiana.");
        } else if (op === "solo") {
          veredicto("veredicto-volumen", false, "El Jigglypuff sí cae, porque está a distancia 0, pero con L = 1 " +
            "también caen las celdas a distancia exactamente 1: la desigualdad es ≤, no <.");
        } else {
          veredicto("veredicto-volumen", false, "El peligro no depende de los caminos sino de la geometría: una roca " +
            "entre el Jigglypuff y una celda no la protege. Se mide en línea recta.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p1");
        if (op === "nada") {
          veredicto("veredicto-p1", true, "Correcto: la línea 3 no encola nada, el while de la línea 6 no entra ni " +
            "una vez y la función devuelve el −1 con que arrancó d[R][C]. El caso queda cubierto sin escribirlo aparte.");
          document.getElementById("paso-1").classList.add("hecho");
        } else if (op === "falla") {
          veredicto("veredicto-p1", false, "No falla: mundo[1][1] existe y vale −1. Lo que hace la línea 3 es " +
            "preguntar por ese valor antes de encolar.");
        } else {
          veredicto("veredicto-p1", false, "Si encolara (1, 1) de todas formas, la amplitud saldría de una celda " +
            "prohibida y podría llegar a la salida por un camino que el enunciado no permite.");
        }
      });
    });

    cambiarPreset(0);
  })();
}
