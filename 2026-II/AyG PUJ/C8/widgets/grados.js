/* Ejercicio interactivo: grados de entrada y de salida (clase 8, recuento).
   Primero se llenan a mano, despues corre grados_de_entrada tal como esta
   en el codigo de la clase. */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def grados_de_entrada(G):",              num: null },
    { txt: "    n = len(G)",                          num: 1 },
    { txt: "    entrada = [0] * n",                   num: 2 },
    { txt: "    u = 0",                               num: 3 },
    { txt: "    while u < n:",                        num: 4, bloque: 1 },
    { txt: "        for v in G[u]:",                  num: 5, bloque: 1 },
    { txt: "            entrada[v] = entrada[v] + 1", num: 6, bloque: 1 },
    { txt: "        u = u + 1",                       num: 7, bloque: 1 },
    { txt: "    return entrada",                      num: 8 }
  ];

  function gradosDeEntrada(G) {
    var n = G.length, entrada = [], u = 0, i;
    while (u < n) { entrada.push(0); u = u + 1; }
    u = 0;
    while (u < n) {
      i = 0;
      while (i < G[u].length) { entrada[G[u][i]] = entrada[G[u][i]] + 1; i = i + 1; }
      u = u + 1;
    }
    return entrada;
  }

  function gradosDeSalida(G) {
    var res = [], u = 0;
    while (u < G.length) { res.push(G[u].length); u = u + 1; }
    return res;
  }

  function simular(params) {
    var G = params.G, n = G.length;
    var pasos = [];
    var entrada = null, u = null, v = null;
    function snap(linea, extra) {
      var q = { linea: linea, u: u === null ? "–" : u, v: v === null ? "–" : v,
                entrada: entrada === null ? null : entrada.slice() };
      if (extra) { for (var x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }
    snap(1);
    entrada = []; var t = 0;
    while (t < n) { entrada.push(0); t = t + 1; }
    snap(2);
    var uu = 0; u = 0; snap(3);
    var sigue = true;
    while (sigue) {
      snap(4);
      if (uu < n) {
        u = uu;
        var i = 0;
        while (i < G[uu].length) {
          v = G[uu][i];
          snap(5, { arista: [uu, v] });
          entrada[v] = entrada[v] + 1;
          snap(6, { arista: [uu, v], sube: v });
          i = i + 1;
        }
        if (G[uu].length === 0) { snap(5, { sinVecinos: true }); }
        v = null;
        uu = uu + 1; u = uu; snap(7);
      } else { sigue = false; }
    }
    u = null;
    snap(8, { fin: true });
    return pasos;
  }

  return { codigo: CODIGO, simular: simular, gradosDeEntrada: gradosDeEntrada, gradosDeSalida: gradosDeSalida };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function grafo(n, aristas) {
      var G = []; var i = 0; while (i < n) { G.push([]); i = i + 1; }
      i = 0; while (i < aristas.length) { G[aristas[i][0]].push(aristas[i][1]); i = i + 1; }
      i = 0; while (i < n) { G[i].sort(function (a, b) { return a - b; }); i = i + 1; }
      return G;
    }
    var G = grafo(7, [[0, 3], [1, 3], [1, 5], [2, 0], [2, 6], [3, 4], [5, 4], [6, 5]]);
    var POS = [[1.4, 2.4], [1.4, 1.2], [0, 1.8], [2.8, 1.8], [4.2, 1.2], [2.8, 0.4], [1.4, 0]];
    var ENT = EJERCICIO.gradosDeEntrada(G);
    var SAL = EJERCICIO.gradosDeSalida(G);

    function dibujar(entrada, arista) {
      var n = G.length, ancho = 460, alto = 250;
      function X(i) { return 40 + (POS[i][0] / 4.2) * (ancho - 80); }
      function Y(i) { return 30 + ((2.4 - POS[i][1]) / 2.4) * (alto - 60); }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:480px'>";
      svg += "<defs><marker id='flecha' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker>";
      svg += "<marker id='flechaAzul' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#1f5fa8'/></marker></defs>";
      var u = 0, i;
      while (u < n) {
        i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          var viva = arista !== null && arista !== undefined && arista[0] === u && arista[1] === v;
          var dx = X(v) - X(u), dy = Y(v) - Y(u), d = Math.sqrt(dx * dx + dy * dy);
          svg += "<line x1='" + (X(u) + dx / d * 17) + "' y1='" + (Y(u) + dy / d * 17) + "' x2='" + (X(v) - dx / d * 19) + "' y2='" + (Y(v) - dy / d * 19) +
                 "' stroke='" + (viva ? "#1f5fa8" : "#6b7280") + "' stroke-width='" + (viva ? 3 : 1.6) + "' marker-end='url(#" + (viva ? "flechaAzul" : "flecha") + ")'/>";
          i = i + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='15' fill='#ffffff' stroke='#d8dee6' stroke-width='2'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='#24292f'>" + u + "</text>";
        if (entrada) {
          svg += "<circle cx='" + (X(u) + 14) + "' cy='" + (Y(u) - 14) + "' r='9' fill='" + (entrada[u] === 0 ? "#2e7d32" : "#b3261e") + "'/>";
          svg += "<text x='" + (X(u) + 14) + "' y='" + (Y(u) - 10.5) + "' text-anchor='middle' font-size='10' font-weight='700' fill='#fff'>" + entrada[u] + "</text>";
        }
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function armarTabla() {
      var caja = document.getElementById("cuerpo-mano");
      caja.innerHTML = "";
      var u = 0;
      while (u < G.length) {
        var tr = document.createElement("tr");
        tr.innerHTML = "<td><b>" + u + "</b></td><td><code>[" + G[u].join(", ") + "]</code></td>" +
          "<td><input type='number' min='0' data-ent='" + u + "' style='width:4.5rem'></td>" +
          "<td><span class='res' id='res-" + u + "'></span></td>";
        caja.appendChild(tr);
        u = u + 1;
      }
    }

    document.getElementById("btn-mano").addEventListener("click", function () {
      var aciertos = 0, vacios = 0, u = 0;
      while (u < G.length) {
        var campo = document.querySelector("input[data-ent='" + u + "']");
        var valor = parseInt(campo.value, 10);
        var celda = document.getElementById("res-" + u);
        if (isNaN(valor)) { celda.textContent = "–"; celda.className = "res"; vacios = vacios + 1; }
        else if (valor === ENT[u]) { celda.textContent = "✓"; celda.className = "res bien"; aciertos = aciertos + 1; }
        else { celda.textContent = "✗ es " + ENT[u] + (valor === SAL[u] ? " (escribió el grado de salida)" : ""); celda.className = "res mal"; }
        u = u + 1;
      }
      var v = document.getElementById("veredicto-mano");
      if (vacios > 0) { v.className = "veredicto mal"; v.textContent = "Faltan " + vacios + " por llenar."; }
      else if (aciertos === G.length) {
        v.className = "veredicto bien";
        v.textContent = "Los siete bien. La suma de los grados de entrada es " + ENT.reduce(function (a, b) { return a + b; }, 0) +
          ", igual que la de los grados de salida y que el número de flechas: cada flecha aporta uno a cada suma.";
      } else {
        v.className = "veredicto mal";
        v.textContent = aciertos + " de " + G.length + ". El grado de entrada de u no se lee en la lista de u: se cuenta cuántas veces aparece u en las listas de los demás.";
      }
    });

    function alPintar(e) {
      var a = e.actual;
      dibujar(a ? a.entrada : null, a ? a.arista : null);
      document.getElementById("ver-entrada").textContent = a && a.entrada ? "[" + a.entrada.join(", ") + "]" : "–";
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }],
      paramsIniciales: { G: G }, alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor) {
      var total = ENT.reduce(function (a, b) { return a + b; }, 0);
      if (valor === total) {
        return { ok: true, msg: "Correcto: " + total + " veces, una por flecha. La línea 6 se ejecuta una vez por cada entrada de cada lista de adyacencia, y la suma de los largos de las listas es el número de flechas." };
      }
      if (valor === G.length) { return { ok: false, msg: "Ese es el número de vértices, que es cuántas veces se ejecuta la línea 7. La 6 está dentro del for, no del while." }; }
      if (valor === total * 2) { return { ok: false, msg: "Esa sería la cuenta en un grafo no dirigido, donde cada arista aparece en las dos listas. Aquí cada flecha aparece una sola vez: en la lista de su cola." }; }
      return { ok: false, msg: "No coincide. Sume los largos de las siete listas de adyacencia: la línea 6 se ejecuta una vez por cada elemento." };
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id); v.className = ok ? "veredicto bien" : "veredicto mal"; v.innerHTML = texto;
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-fuente button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          veredicto("veredicto-fuente", true, "Correcto: son 1 y 2, los dos con contador 0. El 4 tiene grado de <i>salida</i> 0, que es lo contrario: es un sumidero, y sale de último.");
        } else if (op === "sumidero") {
          veredicto("veredicto-fuente", false, "El 4 no recibe ninguna flecha... al revés: el 4 no <i>manda</i> ninguna. Su lista está vacía, pero le llegan dos flechas, así que su contador es 2.");
        } else {
          veredicto("veredicto-fuente", false, "La lista vacía es el grado de salida 0. Una fuente tiene grado de <i>entrada</i> 0, y eso no se ve en su propia lista sino en la ausencia de su número en las demás.");
        }
      });
    });

    dibujar(null, null);
    armarTabla();
  })();
}
