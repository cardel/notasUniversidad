/* Ejercicio interactivo: la red, corrida con bfm5.cpp (clase 13).
   La simulacion vive en bfm-lib.js y reproduce bellmanFordOpt linea por linea. */
var LIB = (typeof module !== "undefined") ? require("./bfm-lib.js") : { BFM: BFM, DIB: DIB };

var EJERCICIO = (function () {
  var B = LIB.BFM;
  var CODIGO = B.armarCodigo("bfm5");
  function num(w) { return String(w).replace("-", "\u2212"); }
  function texD(x) { return x === B.INT_MAX ? "\u221e" : num(x); }

  var CAMBIO = [[0, 1, 85, 0.91816], [1, 0, -81, 1.084783], [1, 2, 142, 0.867262], [2, 1, -138, 1.148446], [2, 0, -234, 1.263291], [0, 2, 238, 0.78842], [1, 4, 46, 0.9546087], [4, 1, -42, 1.043364], [0, 3, -5009, 149.7], [3, 0, 5013, 0.006653333], [3, 6, 4594, 0.01011307], [6, 3, -4590, 98.48684], [0, 5, -305, 1.35728], [5, 0, 309, 0.7338235], [5, 7, -2530, 12.54838], [7, 5, 2534, 0.0793731], [7, 8, 1232, 0.2918129], [8, 7, -1228, 3.41316], [0, 9, -8279, 3942.1], [9, 0, 8283, 0.0002526582], [9, 10, 6962, 0.0009474684], [10, 9, -6958, 1051.227], [10, 11, -5522, 250.1653], [11, 10, 5526, 0.003981383], [3, 12, 3039, 0.047904], [12, 3, -3035, 20.79167]];

  var ESCENARIOS = [
    {
      clave: "cambio",
      boton: "Casa de cambio, trece monedas",
      texto: "Una casa de cambio publica la tasa de cada par de monedas: cambiar una cantidad por otra moneda la multiplica por la tasa. El peso de la flecha es −1000 · ln(tasa), redondeado al entero. Una cadena de cambios multiplica sus tasas, así que su peso es −1000 · ln del producto: un ciclo que termina con más dinero del que empezó pesa menos que cero.",
      nombres: ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "MXN", "BRL", "COP", "PEN", "CLP", "CNY"],
      pos: [[4.5, 2.5], [2.7, 3.9], [2.7, 1.1], [6.3, 3.9], [0.7, 4.4], [6.3, 1.1], [8.6, 3.0], [8.3, 1.1], [8.7, -0.7],
            [4.5, 0.2], [2.8, -0.8], [1.0, -0.8], [8.6, 4.6]],
      aristas: CAMBIO.map(function (e) { return [e[0], e[1], e[2]]; }),
      tasas: CAMBIO.map(function (e) { return e[3]; }),
      s: 0, pregunta: "ciclo", ciclo: [0, 1, 2], alto: 430
    },
    {
      clave: "reparto",
      boton: "Reparto con peajes y bonos, catorce nodos",
      texto: "Una empresa de transporte mueve carga entre catorce puntos. El peso de cada tramo, en miles de pesos, es lo que cuestan peajes y combustible menos el bono del convenio; cuando el bono supera el gasto, el tramo pesa menos que cero. Se busca el costo más bajo de llevar la carga de la Bodega al Puerto.",
      nombres: ["Bodega", "Acopio", "Cruce Oeste", "Planta", "Aduana", "Puerto", "Silo", "Centro", "Frigorífico", "Mercado", "Terminal", "Patio", "Estación", "Muelle"],
      pos: [[0.0, 2.2], [1.6, 3.8], [3.2, 4.8], [1.6, 0.6], [3.4, 3.2], [8.4, 3.4], [3.4, 0.0], [3.4, 1.6], [5.0, 0.8],
            [6.4, 0.0], [6.4, 1.8], [6.8, 4.9], [5.2, 4.9], [8.0, 1.2]],
      aristas: [[0, 1, 2], [0, 3, 4], [0, 7, 9], [1, 2, 3], [1, 4, 5], [1, 3, 3], [2, 12, 6], [2, 1, -1], [3, 6, 7], [3, 7, 5],
                [4, 5, 16], [4, 1, 2], [6, 7, -4], [6, 8, 6], [7, 3, 3], [7, 8, 5], [8, 9, 4], [8, 10, 5], [9, 10, -2], [10, 9, 3],
                [9, 13, 7], [10, 13, 6], [12, 11, 5], [11, 5, 14], [12, 1, 4], [13, 5, -3], [13, 9, 2]],
      s: 0, pregunta: "costo", t: 5, alto: 400
    }
  ];

  ESCENARIOS.forEach(function (e) { e.n = e.nombres.length; e.G = B.construir(e.n, e.aristas); });

  function simular(params) { return B.simular("bfm5", params.G, params.s); }

  function tasaTxt(r) {
    var t = r >= 1 ? r.toFixed(4) : r.toPrecision(4);
    return t.replace(".", ",");
  }
  function dec1(x) { return x.toFixed(1).replace(".", ","); }

  /* Todos los costos de caminos simples de s a t, con su ruta. */
  function caminosSimples(G, s, t) {
    var res = [], ruta = [s];
    function dfs(u, c) {
      if (u === t) { res.push({ costo: c, ruta: ruta.slice() }); }
      else {
        G[u].forEach(function (p) {
          if (ruta.indexOf(p[0]) < 0) { ruta.push(p[0]); dfs(p[0], c + p[1]); ruta.pop(); }
        });
      }
    }
    dfs(s, 0);
    res.sort(function (a, b) { return a.costo - b.costo; });
    return res;
  }

  function rutaPi(p, s, t) {
    var r = [t], x = t;
    while (x !== s && p[x] !== -1 && r.length <= p.length) { x = p[x]; r.push(x); }
    return r.reverse();
  }

  function evaluarPrediccion(dice, e) {
    var hay = e.pregunta === "ciclo", msg;
    if (hay) {
      msg = dice
        ? "Sí hay uno. Un ciclo negativo aquí es una secuencia de cambios que vuelve a la moneda de partida con más dinero. Aún no se sabe cuál es: eso lo entrega la ejecución, y se pregunta abajo."
        : "Sí hay uno. Un ciclo negativo aquí es una secuencia de cambios que vuelve a la moneda de partida con más dinero. Con solo dos monedas se pierde la diferencia entre comprar y vender, así que la ganancia está en una cadena más larga. Ejecute bfm5.cpp y búsquela.";
    } else {
      msg = dice
        ? "No hay ninguno, aunque hay flechas negativas y ciclos. Mercado ↔ Terminal suma −2 + 3 = 1 y Cruce Oeste ↔ Acopio suma 3 − 1 = 2; ningún otro ciclo pesa menos que cero. Un bono rebaja un tramo, no el ciclo completo."
        : "Correcto. Hay flechas negativas y hay ciclos, como Mercado ↔ Terminal, que suma −2 + 3 = 1, y Cruce Oeste ↔ Acopio, que suma 3 − 1 = 2. Ningún ciclo pesa menos que cero, y con eso las distancias existen.";
    }
    return { ok: dice === hay, msg: msg };
  }

  function nombresDe(e, ids) { return ids.map(function (k) { return e.nombres[k]; }); }
  function tasaDe(e, u, v) {
    var k = 0, t = 0;
    while (k < e.aristas.length) { if (e.aristas[k][0] === u && e.aristas[k][1] === v) { t = e.tasas[k]; } k = k + 1; }
    return t;
  }

  function evaluarCiclo(sel, ult, e) {
    var res;
    if (!ult || !ult.hecho) {
      return { ok: false, msg: "Ejecute bfm5.cpp hasta el final primero: el ciclo sale de los predecesores que quedan al detenerse." };
    }
    var r = ult.resultado;
    if (r.disparo === null) { return { ok: false, msg: "La cola se vació sin pasar de n: en esta red no hay ciclo que marcar." }; }
    var ciclo = B.cicloDePi(r.p, r.disparo, e.n);
    var esperado = ciclo.slice().sort(function (a, b) { return a - b; });
    var dado = sel.slice().sort(function (a, b) { return a - b; });
    var rec = ciclo.concat([ciclo[0]]), pesos = [], prod = 1, i = 0;
    while (i < ciclo.length) {
      var u = ciclo[i], v = rec[i + 1], k = 0;
      while (k < e.aristas.length) {
        if (e.aristas[k][0] === u && e.aristas[k][1] === v) { pesos.push(e.aristas[k][2]); prod = prod * e.tasas[k]; }
        k = k + 1;
      }
      i = i + 1;
    }
    var suma = pesos.reduce(function (a, b) { return a + b; }, 0);
    if (esperado.join() === dado.join()) {
      res = { ok: true, msg: "Correcto: " + nombresDe(e, rec).join(" → ") + ". Se halla subiendo por p desde " + e.nombres[r.disparo] +
        ", el vértice cuyo conteo llegó a " + r.conteo[r.disparo] + ", más que n = " + e.n + ", hasta repetir un vértice, y dando vuelta a la lista. " + e.nombres[r.disparo] +
        " no tiene por qué estar en el ciclo: basta con que se llegue a él desde el ciclo. Los pesos suman " +
        pesos.map(num).join(" + ").replace(/\+ \u2212/g, "\u2212 ") + " = " + num(suma) + ". Con las tasas, 1000 " + e.nombres[ciclo[0]] + " pasan a 1000 · " +
        ciclo.map(function (c, j) { return tasaTxt(tasaDe(e, c, rec[j + 1])); }).join(" · ") +
        " = " + dec1(1000 * prod) + " " + e.nombres[ciclo[0]] + "." };
    } else if (dado.length === 2) {
      res = { ok: false, msg: "Dos monedas no bastan: la ida y la vuelta entre las mismas dos monedas suman 4 en cada par, porque la casa vende más caro de lo que compra. La ganancia aparece en una cadena más larga." };
    } else if (dado.length === 0) {
      res = { ok: false, msg: "Marque las monedas del ciclo. Se encuentra subiendo por p desde el vértice cuyo conteo pasó de n." };
    } else {
      res = { ok: false, msg: "No coincide. Suba por p desde el vértice cuyo conteo llegó a " + (e.n + 1) + " y siga hasta repetir un vértice: lo que queda entre las dos apariciones es el ciclo. Recuerde que el vértice de partida puede estar fuera del ciclo." };
    }
    return res;
  }

  function evaluarCosto(valor, ult, e) {
    if (!ult || !ult.hecho) {
      return { ok: false, msg: "Ejecute bfm5.cpp hasta el final primero: el costo es d[" + e.t + "] cuando la cola se vacía." };
    }
    var d = ult.resultado.d[e.t], p = ult.resultado.p, ruta = rutaPi(p, e.s, e.t);
    var bonos = [], i = 0;
    while (i < ruta.length - 1) {
      var w = null;
      e.G[ruta[i]].forEach(function (q) { if (q[0] === ruta[i + 1]) { w = q[1]; } });
      if (w < 0) { bonos.push(e.nombres[ruta[i]] + " → " + e.nombres[ruta[i + 1]] + " (" + num(w) + ")"); }
      i = i + 1;
    }
    var todos = caminosSimples(e.G, e.s, e.t), res;
    if (valor === d) {
      res = { ok: true, msg: "Correcto: " + d + ". Es d[" + e.t + "] al vaciarse la cola, y subir por p desde " + e.nombres[e.t] + " da la ruta: " +
        nombresDe(e, ruta).join(" → ") + ", con " + (ruta.length - 1) + " tramos. Los tramos con bono que usa son " + bonos.join(", ") + "." };
    } else {
      var otro = null;
      todos.forEach(function (c) { if (c.costo === valor && otro === null) { otro = c; } });
      if (otro !== null) {
        res = { ok: false, msg: "Ese es el costo de la ruta " + nombresDe(e, otro.ruta).join(" → ") + ", que existe pero no es la más barata. Hay otra que cuesta menos: revise dónde aprovecha mejor los bonos." };
      } else if (valor < d) {
        res = { ok: false, msg: "Ese valor es menor que cualquier ruta. Una ruta no puede repetir un ciclo para bajar el costo, porque ningún ciclo pesa menos que cero." };
      } else {
        res = { ok: false, msg: "No coincide con el costo de una ruta. Lea d[" + e.t + "] en la tabla al terminar bfm5.cpp." };
      }
    }
    return res;
  }

  return { ESCENARIOS: ESCENARIOS, codigo: CODIGO, simular: simular, tasaTxt: tasaTxt, caminosSimples: caminosSimples,
           evaluarPrediccion: evaluarPrediccion, evaluarCiclo: evaluarCiclo, evaluarCosto: evaluarCosto, texD: texD, num: num };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var B = LIB.BFM, F = B.fmt, idx = 0, sel = {}, ultimo = null;
    var num = EJERCICIO.num;

    function esc() { return EJERCICIO.ESCENARIOS[idx]; }
    function paramsActuales() { return { G: esc().G, s: esc().s }; }

    function dibujar(a) {
      var p = esc();
      document.getElementById("panel-grafo").innerHTML = LIB.DIB.dibujar({
        pos: p.pos, G: p.G.map(function (l) { return l.map(function (e) { return e[0]; }); }), nombres: p.nombres, alto: p.alto, ancho: 720, maxAncho: 780,
        nodo: function (i) {
          var s = { relleno: "#ffffff", borde: "#9aa3af", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (i === p.s) { s.borde = "#1f5fa8"; s.grueso = 3.2; }
          if (a && a.linea >= 39) {
            s.nota = F(a.d[i]) + "/" + (a.p[i] === -1 ? "–" : p.nombres[a.p[i]]);
            if (a.d[i] !== B.INT_MAX) { s.relleno = "#e3edf8"; s.borde = "#1f5fa8"; }
            if (a.enCola[i]) { s.relleno = "#ffe9a8"; s.borde = "#e8a13d"; }
            if (a.linea >= 44 && a.u === i) { s.borde = "#24292f"; s.grueso = 4; }
          }
          return s;
        },
        peso: function (u, v) { var w = null; p.aristas.forEach(function (x) { if (x[0] === u && x[1] === v) { w = x[2]; } }); return w; },
        arista: function (u, v) {
          var e = { color: "gris", grueso: 1.5 };
          if (a && a.linea >= 39 && a.p[v] === u) { e = { color: "azul", grueso: 2.6 }; }
          if (a && a.mira && a.mira[0] === u && a.mira[1] === v) {
            e = a.cambia && a.cambia[0] === u && a.cambia[1] === v ? { color: "verde", grueso: 3.8 } : { color: "ambar", grueso: 3.6 };
          }
          return e;
        }
      });
    }

    function alPintar(e) {
      var a = e.actual, p = esc(), n = p.n, nom = p.nombres;
      ultimo = a;
      dibujar(a);
      document.getElementById("ver-cola").textContent = a && a.cola.length > 0 ? "[" + a.cola.map(function (k) { return nom[k]; }).join(", ") + "]" : "[ ]";
      var salidas = [], i = 0;
      while (i < n) { salidas.push(0); i = i + 1; }
      if (a) { e.pasos.slice(0, e.k).forEach(function (q) { if (q.linea === 44) { salidas[q.u] = salidas[q.u] + 1; } }); }
      var filas = "";
      i = 0;
      while (i < n) {
        filas += "<tr><td style='text-align:left'>" + i + " · " + nom[i] + "</td><td>" + (a && a.linea >= 34 ? F(a.d[i]) : "–") + "</td><td>" +
                 (a && a.linea >= 33 ? (a.p[i] === -1 ? "–" : nom[a.p[i]]) : "–") + "</td><td>" + (a && a.linea >= 35 ? a.enCola[i] : "–") + "</td><td>" +
                 (a && a.linea >= 36 ? a.conteo[i] : "–") + "</td><td>" + (a ? salidas[i] : "–") + "</td></tr>";
        i = i + 1;
      }
      document.getElementById("cuerpo-tabla").innerHTML = filas;
      var obs = document.getElementById("observacion");
      if (e.terminado && a && a.hecho) {
        var r = a.resultado;
        if (!r.ans) {
          obs.className = "veredicto mal";
          obs.textContent = "bfm5.cpp se detuvo: conteo[" + r.disparo + "] (" + nom[r.disparo] + ") llegó a " + r.conteo[r.disparo] + ", más que n = " + n +
            ", y ans quedó en false. La cola todavía tenía " + a.cola.length + " vértices. Las distancias de la tabla son las de ese instante y siguen bajando.";
        } else {
          obs.className = "veredicto bien";
          obs.textContent = "La cola se vació con ans en true. Las distancias son definitivas.";
        }
      } else {
        obs.className = "veredicto";
        obs.textContent = "";
      }
    }

    function llenarTabla() {
      var p = esc(), html = "", k = 0;
      if (p.clave === "cambio") {
        document.getElementById("rot-tabla").textContent = "Tasas publicadas y peso de cada flecha";
        html = "<thead><tr><th>De</th><th>A</th><th>Tasa</th><th>Peso</th></tr></thead><tbody>";
        while (k < p.aristas.length) {
          html += "<tr><td>" + p.nombres[p.aristas[k][0]] + "</td><td>" + p.nombres[p.aristas[k][1]] + "</td><td>" +
                  EJERCICIO.tasaTxt(p.tasas[k]) + "</td><td>" + num(p.aristas[k][2]) + "</td></tr>";
          k = k + 1;
        }
      } else {
        document.getElementById("rot-tabla").textContent = "Tramos y su peso";
        html = "<thead><tr><th>De</th><th>A</th><th>Peso, en miles de pesos</th></tr></thead><tbody>";
        while (k < p.aristas.length) {
          html += "<tr><td>" + p.nombres[p.aristas[k][0]] + "</td><td>" + p.nombres[p.aristas[k][1]] + "</td><td>" + num(p.aristas[k][2]) + "</td></tr>";
          k = k + 1;
        }
      }
      document.getElementById("tabla-aristas").innerHTML = html + "</tbody>";
    }

    function armarEscenario() {
      var p = esc();
      document.getElementById("ver-texto").textContent = p.texto;
      document.getElementById("ver-n").textContent = p.n;
      document.getElementById("ver-m").textContent = p.aristas.length;
      document.getElementById("ver-fuente").textContent = p.nombres[p.s];
      llenarTabla();
      sel = {};
      var html = "", i = 0;
      while (i < p.n) { html += "<button type='button' data-v='" + i + "'>" + p.nombres[i] + "</button> "; i = i + 1; }
      document.getElementById("monedas").innerHTML = html;
      Array.prototype.forEach.call(document.querySelectorAll("#monedas button"), function (b) {
        b.addEventListener("click", function () {
          var k = parseInt(b.getAttribute("data-v"), 10);
          sel[k] = !sel[k];
          b.classList.toggle("primario", sel[k]);
        });
      });
      document.getElementById("preg-ciclo").style.display = p.pregunta === "ciclo" ? "block" : "none";
      document.getElementById("preg-costo").style.display = p.pregunta === "costo" ? "block" : "none";
      if (p.pregunta === "costo") {
        document.getElementById("rot-costo").textContent = "¿Cuál es el costo mínimo de llevar la carga de " + p.nombres[p.s] + " a " + p.nombres[p.t] + "?";
      }
      ["veredicto-pred", "veredicto-ciclo", "veredicto-costo"].forEach(function (id) {
        var v = document.getElementById(id); v.className = "veredicto"; v.textContent = "";
      });
      document.getElementById("costo").value = "";
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "peso", rotulo: "peso" }, { campo: "ans", rotulo: "ans" }],
      paramsIniciales: paramsActuales(), alPintar: alPintar
    });
    armarEscenario();

    function responder(dice) {
      var r = EJERCICIO.evaluarPrediccion(dice, esc()), v = document.getElementById("veredicto-pred");
      v.className = r.ok ? "veredicto bien" : "veredicto mal";
      v.textContent = r.msg;
    }
    document.getElementById("btn-si").addEventListener("click", function () { responder(true); });
    document.getElementById("btn-no").addEventListener("click", function () { responder(false); });

    document.getElementById("btn-ciclo").addEventListener("click", function () {
      var ids = [], k;
      for (k in sel) { if (sel[k]) { ids.push(parseInt(k, 10)); } }
      var r = EJERCICIO.evaluarCiclo(ids, ultimo, esc()), v = document.getElementById("veredicto-ciclo");
      v.className = r.ok ? "veredicto bien" : "veredicto mal";
      v.textContent = r.msg;
    });
    document.getElementById("btn-costo").addEventListener("click", function () {
      var valor = parseInt(document.getElementById("costo").value, 10), v = document.getElementById("veredicto-costo"), r;
      if (isNaN(valor)) { r = { ok: false, msg: "Escriba un número primero." }; }
      else { r = EJERCICIO.evaluarCosto(valor, ultimo, esc()); }
      v.className = r.ok ? "veredicto bien" : "veredicto mal";
      v.textContent = r.msg;
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        idx = parseInt(btn.getAttribute("data-preset"), 10);
        armarEscenario();
        Motor.reiniciar(paramsActuales());
      });
    });
  })();
}
