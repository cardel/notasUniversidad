/* Ejercicio interactivo: la ruta con menos saltos, reconstruida con
   predecesores (clase 7). Red dirigida distinta a la de las diapositivas. */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def ruta(grafo, inicio, destino):",      num: null },
    { txt: "    pred = {}",                           num: 1 },
    { txt: "    pred[inicio] = -1",                   num: 2 },
    { txt: "    cola = deque()",                      num: 3 },
    { txt: "    cola.append(inicio)",                 num: 4 },
    { txt: "    while len(cola) > 0 and destino not in pred:", num: 5, bloque: 1 },
    { txt: "        u = cola.popleft()",              num: 6, bloque: 1 },
    { txt: "        for v in grafo[u]:",              num: 7, bloque: 1 },
    { txt: "            if v not in pred:",           num: 8, bloque: 1 },
    { txt: "                pred[v] = u",             num: 9, bloque: 1 },
    { txt: "                cola.append(v)",          num: 10, bloque: 1 },
    { txt: "    camino = []",                         num: 11 },
    { txt: "    if destino in pred:",                 num: 12 },
    { txt: "        v = destino",                     num: 13, bloque: 2 },
    { txt: "        while v != -1:",                  num: 14, bloque: 2 },
    { txt: "            camino.append(v)",            num: 15, bloque: 2 },
    { txt: "            v = pred[v]",                 num: 16, bloque: 2 },
    { txt: "        camino.reverse()",                num: 17, bloque: 2 },
    { txt: "    return camino",                       num: 18 }
  ];

  function simular(params) {
    var grafo = params.grafo, inicio = params.inicio, destino = params.destino;
    var pasos = [];
    var pred = null, cola = null, u = null, v = null, camino = null;
    function copiaPred() { var o = {}; for (var k in pred) { o[k] = pred[k]; } return o; }
    function snap(linea, extra) {
      var q = { linea: linea, u: u === null ? "–" : u, v: v === null ? "–" : v,
                pred: pred === null ? {} : copiaPred(), cola: cola === null ? [] : cola.slice(),
                camino: camino === null ? null : camino.slice() };
      if (extra) { for (var x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }
    pred = {}; snap(1);
    pred[inicio] = -1; snap(2);
    cola = []; snap(3);
    cola.push(inicio); snap(4);
    var sigue = true;
    while (sigue) {
      snap(5);
      if (cola.length > 0 && !(destino in pred)) {
        u = cola.shift(); snap(6, { sale: u });
        var i = 0;
        while (i < grafo[u].length) {
          v = grafo[u][i]; snap(7); snap(8, { mira: v });
          if (!(v in pred)) {
            pred[v] = u; snap(9, { descubre: v, desde: u });
            cola.push(v); snap(10);
          }
          i = i + 1;
        }
        v = null;
      } else { sigue = false; }
    }
    u = null;
    camino = []; snap(11);
    snap(12);
    if (destino in pred) {
      var w = destino; v = w; snap(13);
      var baja = true;
      while (baja) {
        snap(14);
        if (w !== -1) {
          camino.push(w); snap(15);
          w = pred[w]; v = w === -1 ? "–" : w; snap(16);
        } else { baja = false; }
      }
      camino.reverse(); v = null; snap(17);
    }
    snap(18, { fin: true, resultado: camino.slice() });
    return pasos;
  }

  function rutaRef(grafo, inicio, destino) {
    var pasos = simular({ grafo: grafo, inicio: inicio, destino: destino });
    return pasos[pasos.length - 1].resultado;
  }

  return { codigo: CODIGO, simular: simular, rutaRef: rutaRef };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var RED = { 1: [2, 3], 2: [5], 3: [4], 4: [7], 5: [7], 6: [1], 7: [] };
    var RED2 = { 1: [2, 3], 2: [6], 3: [7], 4: [], 5: [], 6: [7], 7: [] };
    var PRESETS = [
      { grafo: RED, inicio: 1, destino: 7 },
      { grafo: RED, inicio: 7, destino: 1 },
      { grafo: RED, inicio: 6, destino: 7 },
      { grafo: RED2, inicio: 1, destino: 7 }
    ];
    var POS = { 1: [0, 1.4], 2: [1.6, 2.4], 3: [1.6, 0.4], 4: [3.2, 0.4], 5: [3.2, 2.4], 6: [-1.4, 1.4], 7: [4.8, 1.4] };
    var predOK = false;

    function dibujar(params, q) {
      var grafo = params.grafo, pred = q ? q.pred : {};
      var ancho = 440, alto = 220;
      function X(i) { return 50 + ((POS[i][0] + 1.4) / 6.2) * (ancho - 100); }
      function Y(i) { return 30 + ((2.4 - POS[i][1]) / 2.4) * (alto - 60); }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:460px'>";
      svg += "<defs><marker id='f' markerWidth='9' markerHeight='9' refX='9' refY='3' orient='auto'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker>" +
             "<marker id='g' markerWidth='9' markerHeight='9' refX='9' refY='3' orient='auto'><path d='M0,0 L0,6 L9,3 z' fill='#2e7d32'/></marker></defs>";
      var enCamino = {};
      if (q && q.camino) { var t = 0; while (t < q.camino.length - 1) { enCamino[q.camino[t] + "-" + q.camino[t + 1]] = true; t = t + 1; } }
      for (var u in grafo) {
        var i = 0;
        while (i < grafo[u].length) {
          var v = grafo[u][i];
          var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
          var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy);
          x1 = x1 + (dx / L) * 16; y1 = y1 + (dy / L) * 16; x2 = x2 - (dx / L) * 16; y2 = y2 - (dy / L) * 16;
          var esPred = pred[v] !== undefined && String(pred[v]) === String(u);
          var esCam = enCamino[u + "-" + v];
          svg += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 + "' stroke='" +
                 (esCam ? "#2e7d32" : (esPred ? "#1f5fa8" : "#c4c9d1")) + "' stroke-width='" + (esCam ? 3.5 : (esPred ? 2.5 : 1.4)) +
                 "' marker-end='url(#" + (esCam ? "g" : "f") + ")'/>";
          i = i + 1;
        }
      }
      for (var w in grafo) {
        var visto = w in pred;
        var esActual = q && String(q.u) === String(w);
        svg += "<circle cx='" + X(w) + "' cy='" + Y(w) + "' r='15' fill='" + (esActual ? "#1f5fa8" : (visto ? "#e3edf8" : "#ffffff")) +
               "' stroke='" + (visto ? "#1f5fa8" : "#d8dee6") + "' stroke-width='2'/>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='" + (esActual ? "#fff" : "#24292f") + "'>" + w + "</text>";
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function alPintar(e) {
      var q = e.actual;
      dibujar(e.params, q);
      document.getElementById("ver-cola").textContent = q && q.cola.length > 0 ? q.cola.join(", ") : "vacía";
      var cuerpo = document.getElementById("cuerpo-pred");
      cuerpo.innerHTML = "";
      var n = 0;
      if (q) {
        var claves = Object.keys(q.pred).map(Number).sort(function (a, b) { return a - b; });
        var i = 0;
        while (i < claves.length) {
          var k = claves[i];
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + k + "</td><td>" + (q.pred[k] === -1 ? "— (arranque)" : q.pred[k]) + "</td>";
          cuerpo.appendChild(tr); n = n + 1; i = i + 1;
        }
      }
      if (n === 0) { cuerpo.innerHTML = "<tr><td colspan='2' class='pend'>Ejecute: cada enrutador descubierto agrega una fila.</td></tr>"; }
      var aviso = document.getElementById("aviso-final");
      if (q && q.fin) {
        aviso.className = "alerta";
        aviso.innerHTML = q.resultado.length > 0
          ? "Ruta: <b>" + q.resultado.join(" ") + "</b>, " + (q.resultado.length - 1) + " saltos. Se armó del destino hacia atrás y se invirtió."
          : "<b>connection impossible</b>: la cola se vació y el destino nunca recibió predecesor.";
      } else { aviso.className = ""; aviso.innerHTML = ""; }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }],
      paramsIniciales: PRESETS[0], alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var r = EJERCICIO.rutaRef(params.grafo, params.inicio, params.destino);
      var real = r.length > 0 ? r.length - 1 : -1;
      if (valor === real) {
        return { ok: true, msg: real >= 0
          ? "Correcto: " + real + " saltos, por " + r.join(" ") + ". Ejecute y mire en qué orden se llenan los predecesores."
          : "Correcto: no hay ruta. Ejecute y vea vaciarse la cola sin tocar el destino." };
      }
      if (real >= 0 && valor === real + 1) { return { ok: false, msg: "Eso es el número de enrutadores de la ruta. Los saltos son uno menos." }; }
      return { ok: false, msg: "No coincide. Siga las flechas desde el origen; las listas son dirigidas." };
    });

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        Motor.limpiarVeredicto();
        Motor.reiniciar(PRESETS[parseInt(btn.getAttribute("data-preset"), 10)]);
      });
    });

    function veredicto(id, ok, texto) { var v = document.getElementById(id); v.className = ok ? "veredicto bien" : "veredicto mal"; v.innerHTML = texto; }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-pred button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          predOK = true;
          veredicto("veredicto-pred", true, "Correcto: la amplitud sale por capas, así que el primero que descubre a v está en la capa anterior y llegó por una ruta mínima. Como las listas van en orden ascendente, entre los de esa capa el primero en salir es el de la ruta menor.");
          document.getElementById("paso-1").classList.remove("bloqueado");
        } else if (op === "ultimo") {
          veredicto("veredicto-pred", false, "Al revés: si se reescribiera el predecesor, la ruta podría alargarse. La línea 8 impide que un enrutador ya descubierto cambie de predecesor.");
        } else {
          veredicto("veredicto-pred", false, "No es el vecino de menor número: en la cuarta red, desde el 1 el vecino menor es el 2 y la ruta corta va por el 3. El predecesor lo decide la capa, no el número.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p1");
        if (op === "capa") {
          veredicto("veredicto-p1", true, "Correcto: todo lo que queda en la cola está en la capa del destino o en la siguiente, así que ninguna ruta pendiente puede ser más corta.");
          document.getElementById("paso-1").classList.add("hecho");
        } else if (op === "nunca") {
          veredicto("veredicto-p1", false, "Sí se puede: en cuanto el destino recibe predecesor, su ruta ya es mínima. Lo que sigue en la cola solo puede dar rutas iguales o más largas.");
        } else {
          veredicto("veredicto-p1", false, "Detenerse al encolarlo también sirve, y ahorra un poco más. Lo que no sirve es detenerse al primer vecino sin mirar la capa.");
        }
      });
    });
  })();
}
