/* Ejercicio interactivo: cuatro lineas cambiadas en el C++ del titular (clase 13).
   Las simulaciones viven en bfm-lib.js; cada caso corre la version cambiada y la
   de referencia sobre el mismo grafo. */
var LIB = (typeof module !== "undefined") ? require("./bfm-lib.js") : { BFM: BFM, DIB: DIB };

var EJERCICIO = (function () {
  var B = LIB.BFM;

  var GRAFOS = {
    cadena: { nombre: "Cadena de cuatro vértices", n: 4, aristas: [[0, 1, 5], [1, 2, -2], [2, 3, 4]],
              pos: [[0.0, 1.0], [1.7, 2.0], [3.4, 1.0], [5.1, 2.0]] },
    triple: { nombre: "Cuatro vértices con dos caminos a 1", n: 4, aristas: [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 3]],
              pos: [[0.0, 1.5], [2.0, 2.6], [2.0, 0.4], [4.0, 1.5]] },
    inv: { nombre: "Cinco vértices, camino hacia atrás", n: 5, aristas: [[0, 4, 2], [4, 3, -1], [3, 2, 3], [2, 1, -2]],
           pos: [[0.0, 1.5], [3.0, 0.2], [4.5, 2.8], [3.0, 2.8], [1.5, 2.8]] },
    cadena5: { nombre: "Cadena de cinco vértices", n: 5, aristas: [[0, 1, 2], [1, 2, 3], [2, 3, -1], [3, 4, 4]],
               pos: [[0.0, 1.0], [1.4, 2.0], [2.8, 1.0], [4.2, 2.0], [5.6, 1.0]] },
    par5: { nombre: "Cinco aristas paralelas de 0 a 1", n: 4, aristas: [[0, 1, 9], [0, 1, 8], [0, 1, 7], [0, 1, 6], [0, 1, 5], [1, 2, 1], [2, 3, 1]],
            pos: [[0.0, 1.5], [1.7, 1.5], [3.4, 1.5], [5.1, 1.5]], sinDibujo: true }
  };
  var k0;
  for (k0 in GRAFOS) { GRAFOS[k0].clave = k0; GRAFOS[k0].G = B.construir(GRAFOS[k0].n, GRAFOS[k0].aristas); }

  var CASOS = [
    { letra: "a", titulo: "Versión A: la matriz de bfm1.cpp", base: "bfm1", linea: 35,
      mutaciones: [[35, "d[i - 1][j]", "INT_MAX"]], opc: { copia: "inf" }, refClave: "bfm2", refK: 2,
      refTexto: "la correcta, que es bfm2.cpp (un solo vector)",
      grafos: [GRAFOS.cadena, GRAFOS.triple],
      explicacion: "La línea 35 debe copiar la fila i - 1 en la fila i antes de relajar: cada ronda parte de lo que ya se sabía. Con INT_MAX la ronda i solo conserva las casillas que ella misma mejora, y lo que no cambió en esa ronda se pierde, incluida la distancia de la fuente, que ya en la fila 1 vuelve a ∞. Por eso las distancias finales salen en ∞ salvo la de los vértices que la última ronda alcanza." },
    { letra: "b", titulo: "Versión B: la cola de bfm5.cpp", base: "bfm5", linea: 55,
      mutaciones: [[55, "if(!enCola[v])", "if(true)"]], opc: { sinEnCola: true }, refClave: "bfm5", refK: 5,
      refTexto: "la correcta, que es bfm5.cpp tal como está",
      grafos: [GRAFOS.inv, GRAFOS.par5],
      explicacion: "Sin la pregunta por enCola, un vértice que ya está esperando entra otra vez a la cola cada vez que su d baja. En el camino hacia atrás eso no se nota, porque el resultado es el mismo. Pero conteo cuenta entradas, no vértices distintos, y con cinco aristas que mejoran d[1] una tras otra pasa de n = 4 aunque no haya ciclos: el programa anuncia un ciclo negativo que no existe. enCola evita las entradas repetidas, y con ellas ese falso aviso." },
    { letra: "c", titulo: "Versión C: bfm2.cpp con una ronda menos", base: "bfm2", linea: 32,
      mutaciones: [[32, "n - 1", "n - 2"]], opc: { rondas: "menos" }, refClave: "bfm2", refK: 2,
      refTexto: "la correcta, que es bfm2.cpp tal como está",
      grafos: [GRAFOS.inv, GRAFOS.cadena5],
      explicacion: "La línea 32 hace n - 2 rondas en lugar de n - 1, y aun así la salida es la misma. La fuente es el vértice 0, el primero que recorre el ciclo de u: la primera arista de cualquier camino sale de 0 y se relaja al comienzo de la primera ronda, antes que las demás. Un camino de n - 1 aristas queda entonces listo en a lo sumo n - 2 rondas, y la ronda n - 1 nunca cambia nada. Con otra fuente sí haría falta, y por eso el código mantiene n - 1." },
    { letra: "d", titulo: "Versión D: bfm1.cpp con una ronda menos", base: "bfm1", linea: 33,
      mutaciones: [[33, "n - 1", "n - 2"]], opc: { rondas: "menos" }, refClave: "bfm2", refK: 2,
      refTexto: "la correcta, que es bfm2.cpp (un solo vector)",
      grafos: [GRAFOS.cadena5, GRAFOS.inv],
      explicacion: "La línea 33 hace n - 2 rondas. En la matriz la ronda i lee solo la fila i - 1, así que cada ronda extiende los caminos en una arista, y para llegar al final de un camino de n - 1 aristas hacen falta las n - 1 rondas. Con una menos, d[n - 1] no alcanza el último vértice y los que dependen de él quedan en ∞; la revisión final no protesta porque la guarda de INT_MAX salta esas aristas." }
  ];

  function opcDe(c, G) {
    var o = {}, k;
    for (k in c.opc) { o[k] = c.opc[k]; }
    if (o.rondas === "menos") { o.rondas = G.length - 2; }
    return o;
  }

  function correrVariante(c, g) { return B.resumen(c.base, g.G, 0, opcDe(c, g.G)); }
  function correrReferencia(c, g) { return B.resumen(c.refClave, g.G, 0); }

  function lineasDe(c) {
    var buena = B.armarCodigo(c.base), mala = B.armarCodigo(c.base, c.mutaciones), res = [], i = 0;
    var desde = B.FUENTES[c.base].desde;
    while (i < mala.length) { res.push({ n: desde + i, txt: mala[i].txt, cambiada: mala[i].txt !== buena[i].txt }); i = i + 1; }
    return res;
  }

  function evaluar(c, numLinea) {
    var ls = lineasDe(c), hit = null;
    ls.forEach(function (l) { if (l.n === numLinea) { hit = l; } });
    var res;
    if (hit.cambiada) { res = { ok: true, msg: "Correcto: la línea " + numLinea + ". " + c.explicacion }; }
    else { res = { ok: false, msg: "La línea " + numLinea + " es igual a la de la versión correcta. Compare las dos salidas y piense qué paso del algoritmo produce la diferencia, o la falta de ella." }; }
    return res;
  }

  return { casos: CASOS, grafos: GRAFOS, correrVariante: correrVariante, correrReferencia: correrReferencia,
           lineasDe: lineasDe, evaluar: evaluar };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var B = LIB.BFM, F = B.fmt;
    function esc(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
    function num(w) { return String(w).replace("-", "−"); }

    function dibujar(g, caja) {
      if (g.sinDibujo) {
        caja.innerHTML = "<p class='aristas-txt'>Aristas, en el orden en que se leen: " + g.aristas.map(function (a) { return "(" + a[0] + ", " + a[1] + ", " + num(a[2]) + ")"; }).join(" ") + "</p>";
        return;
      }
      var nom = [], i = 0;
      while (i < g.n) { nom.push(String(i)); i = i + 1; }
      caja.innerHTML = LIB.DIB.dibujar({
        pos: g.pos, G: g.G.map(function (l) { return l.map(function (e) { return e[0]; }); }), nombres: nom, alto: 170, maxAncho: 520,
        peso: function (u, v) { var w = null; g.aristas.forEach(function (a) { if (a[0] === u && a[1] === v) { w = a[2]; } }); return w; },
        nodo: function (k) { return { relleno: k === 0 ? "#e7f2e8" : "#ffffff", borde: k === 0 ? "#2e7d32" : "#6b7280", tinta: "#24292f", grueso: 2.2 }; },
        arista: function () { return { color: "gris", grueso: 1.8 }; }
      });
    }

    function vector(a) { return a.map(F); }

    function mostrarCorrida(carta, c, g) {
      var v = EJERCICIO.correrVariante(c, g), r = EJERCICIO.correrReferencia(c, g), n = g.n, i = 0;
      var filas = "";
      function fila(rot, x, y, esD) {
        var h = "<tr><td style='text-align:left'>" + rot + "</td>", j = 0;
        while (j < n) {
          h += "<td class='" + (x[j] === y[j] ? "ig" : "dif") + "'>" + (esD ? F(x[j]) : x[j]) + "</td>";
          j = j + 1;
        }
        return h + "</tr>";
      }
      var cab = "<tr><th></th>";
      while (i < n) { cab += "<th>" + i + "</th>"; i = i + 1; }
      cab += "</tr>";
      var tabla = "<div class='envoltura-tabla'><table><thead>" + cab + "</thead><tbody>";
      var msgV = v.ans ? "imprime distancias" : "imprime El grafo tiene ciclos negativos";
      var msgR = r.ans ? "imprime distancias" : "imprime El grafo tiene ciclos negativos";
      if (v.ans && r.ans) {
        tabla += fila("d, versión correcta", r.d, v.d, true) + fila("d, esta versión", v.d, r.d, true) +
                 fila("p, versión correcta", r.p, v.p, false) + fila("p, esta versión", v.p, r.p, false);
      }
      tabla += "</tbody></table></div>";
      var extra = "";
      if (c.letra === "b") {
        var pv = EJERCICIO.correrVariante(c, g), pr = EJERCICIO.correrReferencia(c, g);
        extra = "<p>Salidas de la cola: la versión correcta hizo " + pr.extraidos.length + " y esta " + pv.extraidos.length + ".</p>";
      }
      var igual = v.salida === r.salida;
      carta.querySelector(".resultado").innerHTML =
        "<p>La versión correcta " + msgR + ". Esta versión " + msgV + ". " + (igual ? "La salida es idéntica, letra por letra." : "Las salidas son distintas.") + "</p>" +
        (v.ans && r.ans ? tabla : "") + extra;
    }

    function armar() {
      var raiz = document.getElementById("casos"), html = "";
      EJERCICIO.casos.forEach(function (c, ci) {
        html += "<div class='carta caso' data-c='" + ci + "'><h2>" + (ci + 1) + ". " + esc(c.titulo) + "</h2>" +
          "<p style='margin-top:0'>Se compara con " + c.refTexto + ".</p>" +
          "<div class='presets'><span class='nota' style='margin-top:0'>Grafo:</span>" +
          c.grafos.map(function (g, gi) { return "<button class='" + (gi === 0 ? "primario " : "") + "bg' data-g='" + gi + "'>" + esc(g.nombre) + "</button>"; }).join("") + "</div>" +
          "<div class='grafo-caso'></div>" +
          "<div class='prediccion'><button class='primario btn-correr'>Correr las dos versiones</button></div>" +
          "<div class='resultado'></div>" +
          "<p><b>¿Qué línea está cambiada?</b> Pulse sobre ella.</p>" +
          "<div class='lineas'>" + EJERCICIO.lineasDe(c).map(function (l) {
            return "<button type='button' class='lin' data-n='" + l.n + "'><span class='n'>" + l.n + "</span>" + esc(l.txt) + "</button>";
          }).join("") + "</div>" +
          "<div class='veredicto'></div></div>";
      });
      raiz.innerHTML = html;
      Array.prototype.forEach.call(raiz.querySelectorAll(".caso"), function (carta) {
        var c = EJERCICIO.casos[parseInt(carta.getAttribute("data-c"), 10)], gi = 0;
        function pintarGrafo() { dibujar(c.grafos[gi], carta.querySelector(".grafo-caso")); carta.querySelector(".resultado").innerHTML = ""; }
        pintarGrafo();
        Array.prototype.forEach.call(carta.querySelectorAll(".bg"), function (b) {
          b.addEventListener("click", function () {
            Array.prototype.forEach.call(carta.querySelectorAll(".bg"), function (x) { x.classList.remove("primario"); });
            b.classList.add("primario");
            gi = parseInt(b.getAttribute("data-g"), 10);
            pintarGrafo();
          });
        });
        carta.querySelector(".btn-correr").addEventListener("click", function () { mostrarCorrida(carta, c, c.grafos[gi]); });
        Array.prototype.forEach.call(carta.querySelectorAll(".lin"), function (b) {
          b.addEventListener("click", function () {
            var r = EJERCICIO.evaluar(c, parseInt(b.getAttribute("data-n"), 10)), v = carta.querySelector(".veredicto");
            v.className = r.ok ? "veredicto bien" : "veredicto mal";
            v.textContent = r.msg;
          });
        });
      });
    }
    armar();
  })();
}
