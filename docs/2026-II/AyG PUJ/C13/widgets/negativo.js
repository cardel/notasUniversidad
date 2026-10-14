/* Ejercicio interactivo: recuperar el ciclo negativo con bfm3.cpp y detectarlo
   con bfm5.cpp (clase 13). Las simulaciones viven en bfm-lib.js. */
var LIB = (typeof module !== "undefined") ? require("./bfm-lib.js") : { BFM: BFM, DIB: DIB };

var EJERCICIO = (function () {
  var B = LIB.BFM;
  var VERSIONES = {
    bfm3: { texto: "bfm3.cpp hace n rondas sobre todas las aristas y deja en t el último vértice que relajó una arista en la ronda n. Si t no es -1, sube n veces por p desde t, que garantiza estar ya dentro del ciclo, y recorre el ciclo guardándolo en el vector ciclo." },
    bfm5: { texto: "bfm5.cpp saca vértices de la cola y relaja sus aristas. Cada entrada a la cola suma uno en conteo, y cuando algún conteo pasa de n pone ans en false y la cola deja de procesarse. No guarda el ciclo." }
  };
  var CODIGOS = { bfm3: B.armarCodigo("bfm3"), bfm5: B.armarCodigo("bfm5") };

  var GRAFOS = [
    { boton: "Seis vértices, ciclo de tres",
      texto: "Seis vértices, fuente 0. Los vértices 2, 3 y 4 forman un ciclo de peso negativo al que se llega por dos caminos.",
      n: 6, s: 0,
      aristas: [[0, 1, 2], [1, 2, 3], [2, 3, -4], [3, 4, 1], [4, 2, 1], [0, 5, 6], [5, 1, -1]],
      pos: [[0.0, 1.5], [1.7, 2.8], [3.5, 1.5], [5.2, 2.8], [5.2, 0.2], [1.7, 0.2]] },
    { boton: "Cinco vértices, ciclo que pasa por la fuente",
      texto: "Cinco vértices, fuente 0. La fuente está dentro de un ciclo negativo, y más adelante hay otro ciclo, este positivo, que no cuenta.",
      n: 5, s: 0,
      aristas: [[0, 1, 1], [1, 2, -3], [2, 0, 1], [2, 3, 2], [3, 4, 2], [4, 3, -1]],
      pos: [[0.0, 0.3], [1.5, 2.8], [3.2, 0.3], [4.8, 2.0], [6.2, 0.3]] },
    { boton: "Seis vértices, dos ciclos negativos",
      texto: "Seis vértices, fuente 0. Hay dos ciclos negativos, 1 con 2 y 3 con 4, y el programa recupera solo uno de los dos.",
      n: 6, s: 0,
      aristas: [[0, 1, 2], [1, 2, -1], [2, 1, -1], [2, 3, 1], [3, 4, -2], [4, 3, 1], [0, 5, 9]],
      pos: [[0.0, 1.5], [1.6, 2.9], [3.4, 2.9], [5.2, 2.9], [5.2, 0.1], [1.6, 0.1]] }
  ];
  GRAFOS.forEach(function (g) { g.G = B.construir(g.n, g.aristas); });

  function simular(params) { return B.simular(params.clave, params.G, params.s); }

  function pesoDe(g, u, v) {
    var k = 0, w = null;
    while (k < g.aristas.length) { if (g.aristas[k][0] === u && g.aristas[k][1] === v) { w = g.aristas[k][2]; } k = k + 1; }
    return w;
  }

  /* El ciclo en el sentido de las aristas, a partir de lo que guarda bfm3. */
  function sentidoDelCiclo(ciclo) { return ciclo.slice().reverse(); }

  /* Todos los ciclos simples de peso negativo, como conjuntos ordenados. */
  function ciclosNegativos(g) {
    var res = {}, n = g.n;
    function dfs(ini, u, camino, peso) {
      g.G[u].forEach(function (e) {
        var v = e[0], w = peso + e[1];
        if (v === ini && w < 0) { res[camino.slice().sort(function (a, b) { return a - b; }).join(",")] = camino.slice(); }
        else if (v > ini && camino.indexOf(v) < 0) { camino.push(v); dfs(ini, v, camino, w); camino.pop(); }
      });
    }
    var i = 0;
    while (i < n) { dfs(i, i, [i], 0); i = i + 1; }
    return res;
  }

  function evaluar(sel, g) {
    var r = B.resumen("bfm3", g.G, g.s), ciclo = r.ciclo, dado = sel.slice().sort(function (a, b) { return a - b; });
    var esperado = ciclo.slice().sort(function (a, b) { return a - b; });
    var f = sentidoDelCiclo(ciclo), suma = 0, i = 0, pesos = [];
    while (i < f.length) { var w = pesoDe(g, f[i], f[(i + 1) % f.length]); pesos.push(w); suma = suma + w; i = i + 1; }
    var camino = f.concat([f[0]]).join(" → ");
    var texPesos = pesos.map(function (w) { return String(w).replace("-", "−"); }).join(" + ").replace(/\+ −/g, "− ");
    var res;
    if (dado.join() === esperado.join()) {
      res = { ok: true, msg: "Correcto: " + camino + ", de peso " + texPesos + " = " + String(suma).replace("-", "−") + ". bfm3 imprime " + ciclo.join(", ") + ", en el orden en que sube por p, que es el contrario al de las aristas. Parte de t = " + r.t + " después de subir n veces." };
    } else if (dado.length === 0) {
      res = { ok: false, msg: "Marque los vértices del ciclo. Se llega a él subiendo por p desde el vértice que relajó una arista en la última ronda." };
    } else {
      var todos = ciclosNegativos(g), clave = dado.join(","), otro = todos[clave];
      if (otro) {
        res = { ok: false, msg: "Ese también es un ciclo negativo, pero no es el que recupera bfm3. Las aristas relajadas en la ronda n llegan a t, y subir n veces por p desde t = " + r.t + " cae en " + camino + ". El programa devuelve un ciclo, no todos." };
      } else {
        res = { ok: false, msg: "Esos vértices no forman un ciclo negativo. Un ciclo se recorre siguiendo aristas y vuelve al vértice de partida; sume los pesos de las aristas que lo componen y compruebe que dé menos que cero." };
      }
    }
    return res;
  }

  return { versiones: VERSIONES, codigos: CODIGOS, grafos: GRAFOS, simular: simular, evaluar: evaluar,
           resumen: B.resumen, sentidoDelCiclo: sentidoDelCiclo, ciclosNegativos: ciclosNegativos };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var B = LIB.BFM, F = B.fmt, presetActual = 0, version = "bfm3", sel = {};
    function g() { return EJERCICIO.grafos[presetActual]; }
    function paramsActuales() { return { clave: version, G: g().G, s: g().s }; }
    function par(p, a, b) { return p && p[0] === a && p[1] === b; }
    function pesoDe(u, v) {
      var k = 0, w = null;
      while (k < g().aristas.length) { if (g().aristas[k][0] === u && g().aristas[k][1] === v) { w = g().aristas[k][2]; } k = k + 1; }
      return w;
    }

    function dibujar(a) {
      var p = g(), nom = [], i = 0;
      while (i < p.n) { nom.push(String(i)); i = i + 1; }
      var listo = a && a.linea >= (version === "bfm3" ? 31 : 39);
      var cic = a && version === "bfm3" && a.hecho ? a.resultado.ciclo : [];
      document.getElementById("panel-grafo").innerHTML = LIB.DIB.dibujar({
        pos: p.pos, G: p.G.map(function (l) { return l.map(function (e) { return e[0]; }); }),
        nombres: nom, peso: pesoDe,
        nodo: function (k) {
          var s = { relleno: k === p.s ? "#e7f2e8" : "#ffffff", borde: k === p.s ? "#2e7d32" : "#6b7280", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (listo) {
            s.nota = F(a.d[k]) + "/" + (a.p[k] === -1 ? "–" : a.p[k]);
            if (a.d[k] !== B.INT_MAX) { s.relleno = k === p.s ? "#e7f2e8" : "#e3edf8"; s.borde = k === p.s ? "#2e7d32" : "#1f5fa8"; }
            if (version === "bfm5" && a.enCola[k]) { s.relleno = "#ffe9a8"; s.borde = "#e8a13d"; }
          }
          if (cic.indexOf(k) >= 0) { s.borde = "#b3261e"; s.grueso = 4.2; }
          if (version === "bfm5" && a && a.disparo === k) { s.borde = "#b3261e"; s.grueso = 4.2; }
          return s;
        },
        arista: function (u, v) {
          var e = { color: "gris", grueso: 1.6 };
          if (listo && a.p[v] === u && a.d[v] !== B.INT_MAX) { e = { color: "morado", grueso: 2.6 }; }
          if (a && par(a.cambia, u, v)) { e = { color: "verde", grueso: 3.2 }; }
          else if (a && par(a.mira, u, v)) { e = { color: "azul", grueso: 3.0 }; }
          return e;
        }
      });
    }

    function tabla(a) {
      var n = g().n, h, filas = "", i = 0;
      h = "<tr><th>Vértice</th><th>d</th><th>p</th>" + (version === "bfm5" ? "<th>enCola</th><th>conteo</th>" : "") + "</tr>";
      while (i < n) {
        filas += "<tr><td>" + i + "</td><td>" + (a ? F(a.d[i]) : "–") + "</td><td>" + (a ? a.p[i] : "–") + "</td>" +
                 (version === "bfm5" ? "<td>" + (a ? a.enCola[i] : "–") + "</td><td>" + (a ? a.conteo[i] : "–") + "</td>" : "") + "</tr>";
        i = i + 1;
      }
      document.getElementById("tabla-v").innerHTML = "<thead>" + h + "</thead><tbody>" + filas + "</tbody>";
    }

    function alPintar(e) {
      var a = e.actual, obs = document.getElementById("observacion"), n = g().n;
      dibujar(a);
      tabla(a);
      document.getElementById("ver-salida").textContent = a ? a.salida.join("\n") : "";
      document.getElementById("ver-ciclo").textContent = a && version === "bfm3" ? "[" + a.ciclo.join(", ") + "]" : "no lo guarda";
      obs.className = "veredicto"; obs.textContent = "";
      if (a && a.hecho) {
        var r = a.resultado;
        obs.className = "veredicto mal";
        if (version === "bfm3") {
          obs.textContent = "t quedó en " + r.t + " después de subir " + n + " veces por p. El vector ciclo guarda " + r.ciclo.join(", ") +
            ", y main lo imprime en ese orden. ans quedó en false.";
        } else {
          var k = B.cicloDePi(r.p, r.disparo, n), pos = r.extraidos.length;
          obs.textContent = "conteo[" + r.disparo + "] llegó a " + r.conteo[r.disparo] + ", más que n = " + n + ", en la salida número " + pos +
            " de la cola. El programa no dice cuál es el ciclo, pero subiendo " + n + " veces por p desde " + r.disparo + " se llega a " + k.join(" → ") + " → " + k[0] + ".";
        }
      }
    }

    function chipsDe(v) {
      return v === "bfm3"
        ? [{ campo: "i", rotulo: "i" }, { campo: "t", rotulo: "t" }, { campo: "cur", rotulo: "cur" }, { campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }]
        : [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "peso", rotulo: "peso" }, { campo: "ans", rotulo: "ans" }];
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
      sel = {};
      var html = "", i = 0;
      while (i < g().n) { html += "<button type='button' data-v='" + i + "'>" + i + "</button>"; i = i + 1; }
      document.getElementById("marcas").innerHTML = html;
      Array.prototype.forEach.call(document.querySelectorAll("#marcas button"), function (b) {
        b.addEventListener("click", function () {
          var k = parseInt(b.getAttribute("data-v"), 10);
          sel[k] = !sel[k];
          b.classList.toggle("primario", sel[k]);
        });
      });
      Motor.limpiarVeredicto();
    }

    arrancar();
    preparar();
    document.getElementById("btn-comprobar").addEventListener("click", function () {
      var ids = [], k, v = document.getElementById("veredicto");
      for (k in sel) { if (sel[k]) { ids.push(parseInt(k, 10)); } }
      var r = EJERCICIO.evaluar(ids, g());
      v.className = r.ok ? "veredicto bien" : "veredicto mal";
      v.textContent = r.msg;
    });

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
