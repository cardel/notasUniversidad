/* Ejercicio interactivo: Bellman-Ford en C++ (clase 13).
   La simulacion de bfm1.cpp, bfm2.cpp y bfm4.cpp vive en bfm-lib.js y
   reproduce la funcion bellmanFord de cada archivo, linea por linea. */
var LIB = (typeof module !== "undefined") ? require("./bfm-lib.js") : { BFM: BFM, DIB: DIB };

var EJERCICIO = (function () {
  var B = LIB.BFM;

  var VERSIONES = {
    bfm1: { archivo: "bfm1.cpp", texto: "bfm1.cpp guarda el resultado de cada ronda en una fila de la matriz d. La ronda i lee la fila i - 1 y escribe la fila i, y las distancias finales están en la fila n - 1.",
            relajar: 40, nombre: "bfm1 (matriz)" },
    bfm2: { archivo: "bfm2.cpp", texto: "bfm2.cpp usa un solo vector d que se actualiza en el sitio. Hace siempre n - 1 rondas.",
            relajar: 37, nombre: "bfm2 (vector)" },
    bfm4: { archivo: "bfm4.cpp", texto: "bfm4.cpp es bfm2.cpp con una variable t: si una ronda no relaja ninguna arista, t queda en -1 y el ciclo de rondas termina. Imprime cuántas rondas hizo.",
            relajar: 39, nombre: "bfm4 (parada)" }
  };
  var CODIGOS = { bfm1: B.armarCodigo("bfm1"), bfm2: B.armarCodigo("bfm2"), bfm4: B.armarCodigo("bfm4") };

  var GRAFOS = [
    { boton: "Cinco vértices, un atajo con peso negativo",
      texto: "Cinco vértices, fuente 0. Desde el 0 hay una arista directa al 3, pero un camino más largo que pasa por una arista negativa llega más barato.",
      n: 5, s: 0,
      aristas: [[0, 2, 7], [2, 1, -3], [1, 3, 2], [0, 3, 9], [3, 4, -1], [2, 4, 5]],
      pos: [[0.0, 1.5], [3.4, 2.7], [1.7, 2.7], [3.4, 0.3], [5.0, 1.5]] },
    { boton: "Seis vértices, el camino va hacia atrás",
      texto: "Seis vértices, fuente 0. El camino más barato recorre los vértices en orden decreciente, el contrario al del recorrido de los for, y una arista directa de peso 20 no sirve.",
      n: 6, s: 0,
      aristas: [[0, 5, 2], [5, 4, -1], [4, 3, 3], [3, 2, -2], [2, 1, 4], [0, 1, 20], [1, 2, 1]],
      pos: [[0.0, 1.5], [1.8, 0.1], [4.5, 0.1], [4.5, 2.9], [2.9, 2.9], [1.3, 2.9]] },
    { boton: "Cinco vértices, uno inalcanzable",
      texto: "Cinco vértices, fuente 0. El vértice 4 no tiene aristas: nadie llega a él y su distancia se queda en INT_MAX.",
      n: 5, s: 0,
      aristas: [[0, 1, 3], [0, 2, 5], [1, 3, -2], [2, 3, 1], [3, 1, 4]],
      pos: [[0.0, 1.5], [1.7, 2.7], [1.7, 0.3], [3.5, 1.5], [5.2, 1.5]] }
  ];
  GRAFOS.forEach(function (g) { g.G = B.construir(g.n, g.aristas); });

  function contar(pasos, linea) {
    var c = 0;
    pasos.forEach(function (q) { if (q.linea === linea) { c = c + 1; } });
    return c;
  }

  /* Rondas terminadas de bfm2 o bfm4 hasta el paso k: [{ronda, d}]. */
  function historial(pasos, k, clave) {
    var ini = clave === "bfm2" ? 32 : 33, fin = clave === "bfm2" ? 45 : 48;
    var res = [], abierta = null, prev = null, m = 0;
    while (m < k) {
      var q = pasos[m];
      if (q.linea === ini || q.linea === fin) {
        if (abierta !== null) { res.push({ ronda: abierta, d: prev.d.slice() }); abierta = null; }
        if (q.linea === ini) { abierta = q.i; }
      }
      prev = q;
      m = m + 1;
    }
    return res;
  }

  function evaluar(valor, g) {
    var r = B.resumen("bfm4", g.G, g.s), n = g.n, cr = r.cambioPorRonda, ult = 0, i = 0, res;
    while (i < cr.length) { if (cr[i]) { ult = i + 1; } i = i + 1; }
    var real = r.iteraciones;
    if (valor === real) {
      res = { ok: true, msg: "Correcto: " + real + ". " + (ult === real
        ? "Es la última ronda que permite el ciclo, n - 1 = " + (n - 1) + ", y todavía cambió algo: la parada por falta de cambios no llegó a ocurrir, y la revisión final comprueba el resultado."
        : "La última ronda que cambia algo es la " + ult + ", y la " + real + " no relaja ninguna arista: t queda en -1 y la condición de la línea 33 deja de cumplirse.") };
    } else if (valor < 1 || valor > n - 1) {
      res = { ok: false, msg: "El ciclo de la línea 33 va de i = 1 hasta n - 1 = " + (n - 1) + ", así que el programa no imprime menos de 1 ni más de " + (n - 1) + "." };
    } else if (valor < ult) {
      res = { ok: false, msg: "Todavía cambia algo después de la iteración " + valor + ": la ronda " + ult + " baja un d. Siga las rondas en la tabla y mire cuál es la última con cambios." };
    } else if (valor === ult) {
      res = { ok: false, msg: "La ronda " + ult + " todavía baja un d, y bfm4 solo se entera de que ya no hay cambios cuando hace una ronda más y t queda en -1. Falta esa iteración." };
    } else {
      res = { ok: false, msg: "Se detiene antes. La última ronda con cambios es la " + ult + "; en la " + real + " ninguna relajación baja un d, t queda en -1 y la línea 33 ya no deja entrar a otra ronda." };
    }
    return res;
  }

  function simular(params) { return B.simular(params.clave, params.G, params.s); }

  return { versiones: VERSIONES, codigos: CODIGOS, grafos: GRAFOS, simular: simular, evaluar: evaluar,
           contar: contar, historial: historial, resumen: B.resumen };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var B = LIB.BFM, F = B.fmt, presetActual = 0, version = "bfm1";

    function g() { return EJERCICIO.grafos[presetActual]; }
    function paramsActuales() { return { clave: version, G: g().G, s: g().s }; }
    function par(p, a, b) { return p && p[0] === a && p[1] === b; }
    function pesoDe(u, v) {
      var k = 0, w = null;
      while (k < g().aristas.length) { if (g().aristas[k][0] === u && g().aristas[k][1] === v) { w = g().aristas[k][2]; } k = k + 1; }
      return w;
    }
    function lista(a) { return "[" + a.map(F).join(", ") + "]"; }

    /* Que fila de la matriz de bfm1 se ve en el grafo. */
    function filaVista(a) {
      var res = null;
      if (version !== "bfm1") { res = null; }
      else if (a.linea >= 48) { res = g().n - 1; }
      else if (a.linea >= 36) { res = a.i; }
      else if (a.linea >= 33) { res = a.i - 1; }
      else if (a.linea >= 32) { res = 0; }
      return res;
    }

    function dibujar(a) {
      var p = g(), nom = [], i = 0, dv = null;
      while (i < p.n) { nom.push(String(i)); i = i + 1; }
      if (a) {
        if (version === "bfm1") { var f = filaVista(a); dv = f === null ? null : a.d[f]; }
        else { dv = a.d; }
      }
      var pv = a ? a.p : null;
      var listo = a && ((version === "bfm1" && a.linea >= 32) || (version !== "bfm1" && a.linea >= (version === "bfm2" ? 31 : 31)));
      document.getElementById("panel-grafo").innerHTML = LIB.DIB.dibujar({
        pos: p.pos, G: p.G.map(function (l) { return l.map(function (e) { return e[0]; }); }),
        nombres: nom, peso: pesoDe,
        nodo: function (k) {
          var s = { relleno: k === p.s ? "#e7f2e8" : "#ffffff", borde: k === p.s ? "#2e7d32" : "#6b7280", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (listo && dv) {
            s.nota = F(dv[k]) + "/" + (pv[k] === -1 ? "–" : pv[k]);
            if (dv[k] !== B.INT_MAX) { s.relleno = k === p.s ? "#e7f2e8" : "#e3edf8"; s.borde = k === p.s ? "#2e7d32" : "#1f5fa8"; }
          }
          if (a && a.mira && (a.mira[1] === k)) { s.borde = "#e8a13d"; s.grueso = 4.2; }
          return s;
        },
        arista: function (u, v) {
          var e = { color: "gris", grueso: 1.6 };
          if (listo && pv && pv[v] === u && dv && dv[v] !== B.INT_MAX) { e = { color: "morado", grueso: 2.6 }; }
          if (a && par(a.tensa, u, v)) { e = { color: "rojo", grueso: 3.4 }; }
          else if (a && par(a.cambia, u, v)) { e = { color: "verde", grueso: 3.2 }; }
          else if (a && par(a.mira, u, v)) { e = { color: "azul", grueso: 3.0 }; }
          return e;
        }
      });
    }

    function encabezado(n, primera) {
      var h = "<tr><th>" + primera + "</th>", i = 0;
      while (i < n) { h += "<th>" + i + "</th>"; i = i + 1; }
      return h + "</tr>";
    }

    function tabla(e) {
      var a = e.actual, p = g(), n = p.n, h, cuerpo = "", i, j;
      var tit = document.getElementById("rot-tabla"), nota = document.getElementById("nota-tabla");
      if (version === "bfm1") {
        tit.textContent = "3. La matriz d, fila por fila";
        nota.textContent = "La fila i se escribe durante la ronda i. Al comenzar, todas las filas valen cero porque así las crea vector; las líneas 26 a 29 las llenan con INT_MAX (∞). Se resalta la fila de la ronda en curso y la casilla que acaba de bajar.";
        h = encabezado(n, "d[i][v]");
        i = 0;
        while (i < n) {
          var viva = a && a.linea >= 33 && a.linea <= 42 && a.i === i;
          cuerpo += "<tr" + (viva ? " class='viva'" : "") + "><td><b>d[" + i + "]</b></td>";
          j = 0;
          while (j < n) {
            var cambio = a && a.cambia && a.linea >= 41 && a.linea <= 42 && a.i === i && a.cambia[1] === j;
            cuerpo += "<td" + (cambio ? " class='cambio'" : "") + ">" + (a ? F(a.d[i][j]) : "–") + "</td>";
            j = j + 1;
          }
          cuerpo += "</tr>";
          i = i + 1;
        }
        cuerpo += "<tr><td><b>p</b></td>";
        j = 0;
        while (j < n) { cuerpo += "<td>" + (a ? a.p[j] : "–") + "</td>"; j = j + 1; }
        cuerpo += "</tr>";
      } else {
        tit.textContent = "3. El vector d al terminar cada ronda";
        nota.textContent = version === "bfm2"
          ? "La fila de arriba es el vector en este instante; las de abajo, lo que quedó al terminar cada ronda. bfm2 hace siempre n - 1 rondas."
          : "La fila de arriba es el vector en este instante; las de abajo, lo que quedó al terminar cada ronda. Cuando una fila repite a la anterior, esa ronda no cambió nada y bfm4 se detiene.";
        h = encabezado(n, "");
        cuerpo += "<tr class='viva'><td><b>d ahora</b></td>";
        j = 0;
        while (j < n) { cuerpo += "<td>" + (a ? F(a.d[j]) : "–") + "</td>"; j = j + 1; }
        cuerpo += "</tr><tr><td><b>p ahora</b></td>";
        j = 0;
        while (j < n) { cuerpo += "<td>" + (a ? a.p[j] : "–") + "</td>"; j = j + 1; }
        cuerpo += "</tr>";
        EJERCICIO.historial(e.pasos, e.k, version).forEach(function (r) {
          cuerpo += "<tr><td>ronda " + r.ronda + "</td>" + r.d.map(function (x) { return "<td>" + F(x) + "</td>"; }).join("") + "</tr>";
        });
      }
      document.getElementById("tabla-d").innerHTML = "<thead>" + h + "</thead><tbody>" + cuerpo + "</tbody>";
    }

    function comparar(e) {
      var caja = document.getElementById("comparacion"), p = g(), m = p.aristas.length;
      if (!(e.actual && e.actual.hecho)) {
        caja.innerHTML = "<p class='nota' style='margin-top:0'>Ejecute hasta el final para ver la comparación.</p>";
        return;
      }
      var filas = "", rondas = {};
      ["bfm1", "bfm2", "bfm4"].forEach(function (c) {
        var pasos = EJERCICIO.simular({ clave: c, G: p.G, s: p.s }), r = pasos[pasos.length - 1].resultado;
        var ex = EJERCICIO.contar(pasos, EJERCICIO.versiones[c].relajar);
        var ro = c === "bfm4" ? r.iteraciones : p.n - 1;
        rondas[c] = ro;
        filas += "<tr><td>" + EJERCICIO.versiones[c].archivo + "</td><td>" + ro + "</td><td><b>" + ex + "</b></td><td>" + ro + " · " + m + "</td></tr>";
      });
      var sobran = (p.n - 1) * m - rondas.bfm4 * m;
      caja.innerHTML = "<div class='envoltura-tabla'><table><thead><tr><th>Archivo</th><th>Rondas</th><th>Aristas examinadas</th><th>Cuenta</th></tr></thead><tbody>" + filas + "</tbody></table></div>" +
        "<p style='margin-bottom:0'>" + (sobran > 0
          ? "bfm4.cpp se ahorra " + sobran + " aristas: examina " + m + " por ronda y hace " + rondas.bfm4 + " rondas en lugar de " + (p.n - 1) + "."
          : "Las tres examinan lo mismo: bfm4.cpp tampoco alcanza a detenerse antes de la ronda " + (p.n - 1) + ".") +
        " Las tres dejan <code>d = " + lista(EJERCICIO.resumen("bfm2", p.G, p.s).d) + "</code>.</p>";
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(a);
      tabla(e);
      comparar(e);
      document.getElementById("ver-salida").textContent = a ? a.salida.join("\n") : "";
    }

    function chipsDe(v) {
      var base = [{ campo: "i", rotulo: "i" }, { campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "peso", rotulo: "peso" }];
      if (v === "bfm4") { base.push({ campo: "t", rotulo: "t" }); base.push({ campo: "hechas", rotulo: "rondas hechas", clase: "cuenta" }); }
      else { base.push({ campo: "ans", rotulo: "ans" }); }
      return base;
    }

    function arrancar() {
      var ids = ["btn-paso", "btn-auto", "btn-fin", "btn-reiniciar"], t = 0;
      while (t < ids.length) {
        var b = document.getElementById(ids[t]);
        b.parentNode.replaceChild(b.cloneNode(true), b);
        t = t + 1;
      }
      document.getElementById("ver-version").textContent = EJERCICIO.versiones[version].texto;
      Motor.iniciar({
        codigo: EJERCICIO.codigos[version], simular: EJERCICIO.simular,
        chips: chipsDe(version), paramsIniciales: paramsActuales(), alPintar: alPintar
      });
    }

    function preparar() {
      document.getElementById("ver-texto").textContent = g().texto;
      document.getElementById("prediccion").value = "";
      Motor.limpiarVeredicto();
    }

    arrancar();
    preparar();
    Motor.prediccionNumerica(function (valor) { return EJERCICIO.evaluar(valor, g()); });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        preparar();
        Motor.reiniciar(paramsActuales());
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        version = btn.getAttribute("data-version");
        arrancar();
      });
    });
  })();
}
