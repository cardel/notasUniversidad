/* Ejercicio interactivo: relajar una arista (clase 12).
   La simulacion reproduce el pseudocodigo de RELAJAR del deck, linea por linea. */
/* Dibujo de grafos en SVG, con nombres de vertice, pesos y anotaciones. */
var DIB = (function () {
  var COL = {
    gris: "#6b7280", azul: "#1f5fa8", verde: "#2e7d32", rojo: "#b3261e",
    ambar: "#e8a13d", morado: "#6b3fa0", claro: "#c4cad3"
  };
  var RY = 16;

  function rxDe(nombre) {
    var r = 3.2 * String(nombre).length + 8;
    return r < 18 ? 18 : r;
  }

  function signo(w) { return String(w).replace("-", "−"); }

  /* o.pos, o.G, o.nombres, o.dirigido (por defecto true), o.peso(u, v) opcional;
     o.nodo(i) -> {relleno, borde, tinta, grueso, nota, notaColor};
     o.arista(u, v) -> {color, grueso, trazo}. En un grafo no dirigido cada
     arista se pregunta una vez, con u menor que v. */
  function dibujar(o) {
    var pos = o.pos, G = o.G, nom = o.nombres, n = pos.length, dir = o.dirigido !== false;
    var ancho = 560, alto = o.alto || 300, mx = 56, my = 40;
    var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
    while (i < n) {
      if (pos[i][0] < minX) { minX = pos[i][0]; }
      if (pos[i][0] > maxX) { maxX = pos[i][0]; }
      if (pos[i][1] < minY) { minY = pos[i][1]; }
      if (pos[i][1] > maxY) { maxY = pos[i][1]; }
      i = i + 1;
    }
    var rx = maxX - minX === 0 ? 1 : maxX - minX, ry = maxY - minY === 0 ? 1 : maxY - minY;
    function X(k) { return mx + (pos[k][0] - minX) / rx * (ancho - 2 * mx); }
    function Y(k) { return my + (maxY - pos[k][1]) / ry * (alto - 2 * my); }
    function existe(p, q) {
      var j = 0, hay = false;
      while (j < G[p].length) { if (G[p][j] === q) { hay = true; } j = j + 1; }
      return hay;
    }
    function borde(k, ux, uy) {
      var a = rxDe(nom[k]);
      return 1 / Math.sqrt((ux / a) * (ux / a) + (uy / RY) * (uy / RY));
    }
    function etiqueta(x, y, u, v, e) {
      var w = o.peso ? o.peso(u, v) : null;
      if (w === null || w === undefined) { return ""; }
      return "<text x='" + x + "' y='" + (y + 4) + "' text-anchor='middle' font-size='11.5' font-weight='700' fill='" +
             COL[e.color] + "' stroke='#ffffff' stroke-width='4' paint-order='stroke' stroke-linejoin='round'>" + signo(w) + "</text>";
    }

    var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:640px'>";
    svg += "<defs>";
    var c;
    for (c in COL) {
      svg += "<marker id='ah-" + c + "' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto'>" +
             "<path d='M0,0 L10,5 L0,10 z' fill='" + COL[c] + "'/></marker>";
    }
    svg += "</defs>";

    var rotulos = "", u = 0;
    while (u < n) {
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        if (dir || u < v) {
          var e = o.arista(u, v);
          var dash = e.trazo ? " stroke-dasharray='" + e.trazo + "'" : "";
          var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
          var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
          var pie = "' fill='none' stroke='" + COL[e.color] + "' stroke-width='" + e.grueso + "'" + dash +
                    (dir ? " marker-end='url(#ah-" + e.color + ")'/>" : "/>");
          var extra = dir ? 5 : 0;
          if (dir && existe(v, u)) {
            var cx = (x1 + x2) / 2 - dy / dd * 26, cy = (y1 + y2) / 2 + dx / dd * 26;
            var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
            var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
            var a1 = borde(u, (cx - x1) / l1, (cy - y1) / l1) + 2;
            var a2 = borde(v, (cx - x2) / l2, (cy - y2) / l2) + 5;
            var p1x = x1 + (cx - x1) / l1 * a1, p1y = y1 + (cy - y1) / l1 * a1;
            var p2x = x2 + (cx - x2) / l2 * a2, p2y = y2 + (cy - y2) / l2 * a2;
            svg += "<path d='M" + p1x + "," + p1y + " Q" + cx + "," + cy + " " + p2x + "," + p2y + pie;
            rotulos += etiqueta(0.25 * p1x + 0.5 * cx + 0.25 * p2x, 0.25 * p1y + 0.5 * cy + 0.25 * p2y, u, v, e);
          } else {
            var b1 = borde(u, dx / dd, dy / dd) + 2;
            var b2 = borde(v, -dx / dd, -dy / dd) + 2 + extra;
            svg += "<path d='M" + (x1 + dx / dd * b1) + "," + (y1 + dy / dd * b1) +
                   " L" + (x2 - dx / dd * b2) + "," + (y2 - dy / dd * b2) + pie;
            rotulos += etiqueta((x1 + x2) / 2, (y1 + y2) / 2, u, v, e);
          }
        }
        j = j + 1;
      }
      u = u + 1;
    }
    svg += rotulos;
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
  var INF = Infinity;
  /* El pseudocodigo de RELAJAR del deck, con sus nombres. */
  var CODIGO = [
    { txt: "RELAJAR(u, v, w):",             num: null },
    { txt: "  si d[v] > d[u] + w(u, v):",   num: 1, bloque: 1 },
    { txt: "    d[v] = d[u] + w(u, v)",     num: 2, bloque: 1 },
    { txt: "    pred[v] = u",               num: 3, bloque: 1 }
  ];

  /* Escenarios ordenados por dificultad. tipo: lo que explica que no cambie nada. */
  var ESCENARIOS = [
    { u: 2, v: 4, w: 3,  du: 4,   dv: 11,  pv: -1, tipo: null,
      ok: "Cambia: 4 + 3 = 7 es menor que 11, así que d[v] baja a 7 y pred[v] pasa a ser u = 2." },
    { u: 1, v: 3, w: 3,  du: 6,   dv: 8,   pv: 0,  tipo: "mayor",
      ok: "No cambia: 6 + 3 = 9 no es menor que 8. Llegar a v por u cuesta más de lo que v ya tiene, y d[v] = 8 y pred[v] = 0 se quedan." },
    { u: 4, v: 1, w: 4,  du: INF, dv: INF, pv: -1, tipo: "inf",
      ok: "No cambia: con d[u] = ∞ la suma es ∞ + 4 = ∞, y ∞ no es menor que ∞. Relajar desde un vértice que todavía no se alcanzó nunca mejora nada." },
    { u: 1, v: 2, w: -4, du: 5,   dv: 3,   pv: 0,  tipo: null,
      ok: "Cambia: 5 + (-4) = 1 es menor que 3. Un peso negativo no cambia la regla: se suma y se compara. Queda d[v] = 1 y pred[v] = 1." },
    { u: 3, v: 5, w: 6,  du: 4,   dv: 10,  pv: 1,  tipo: "empate",
      ok: "No cambia: 4 + 6 = 10 no es menor que 10, es igual. La comparación es estricta, así que el empate no reescribe nada y pred[v] sigue en 1." },
    { u: 2, v: 6, w: -5, du: INF, dv: 7,   pv: 3,  tipo: "inf",
      ok: "No cambia: d[u] = ∞, y ∞ + (-5) sigue siendo ∞. Que el peso sea negativo no vuelve finito a un infinito. d[v] = 7 y pred[v] = 3 se quedan." },
    { u: 4, v: 1, w: 2,  du: 3,   dv: 8,   pv: 2,  tipo: null,
      ok: "Cambia: 3 + 2 = 5 es menor que 8. d[v] pasa a 5 y pred[v] se reescribe: de 2 a u = 4. Cada vez que d[v] baja, el predecesor es el vértice desde el que se mejoró." },
    { u: 5, v: 2, w: -2, du: 7,   dv: 5,   pv: 4,  tipo: "empate",
      ok: "No cambia: 7 + (-2) = 5 no es menor que 5. Otro empate, ahora con un peso negativo de por medio; pred[v] sigue en 4." },
    { u: 1, v: 6, w: 9,  du: -4,  dv: INF, pv: -1, tipo: null,
      ok: "Cambia: -4 + 9 = 5 es menor que ∞. Un d[u] negativo se trata igual que cualquier otro, y cualquier suma finita le gana a ∞: d[v] = 5 y pred[v] = 1." },
    { u: 3, v: 0, w: -6, du: 4,   dv: 0,   pv: -1, tipo: null,
      ok: "Cambia: 4 + (-6) = -2 es menor que 0. Aquí v es la fuente y d[v] baja de 0. Si el 4 de d[u] salió de relajar caminos desde la fuente, el camino hasta u más esta arista cierra un ciclo de peso -2, un ciclo negativo. Sin ciclos negativos la fuente se queda en 0." }
  ];

  function fmt(x) { return x === INF ? "∞" : String(x); }

  function simular(params) {
    var u = params.u, v = params.v, w = params.w, n = Math.max(u, v) + 1, d = [], pred = [], i = 0;
    while (i < n) { d.push(INF); pred.push(-1); i = i + 1; }
    d[u] = params.du; d[v] = params.dv; pred[v] = params.pv;
    var cambio = false, pasos = [];
    function snap(linea) {
      pasos.push({ linea: linea, suma: fmt(d[u] + w), dv: fmt(d[v]), pv: String(pred[v]), hecho: false });
    }
    snap(1);
    if (d[v] > d[u] + w) {
      d[v] = d[u] + w; snap(2);
      pred[v] = u; snap(3);
      cambio = true;
    }
    var ult = pasos[pasos.length - 1];
    ult.hecho = true;
    ult.resultado = { cambio: cambio, dv: d[v], pv: pred[v] };
    return pasos;
  }

  function resultado(sc) {
    return simular(sc).pop().resultado;
  }

  /* Texto de lo que falla en una respuesta {cambia, dv, pv}; "" si todo esta bien. */
  function diagnostico(sc, r) {
    var real = resultado(sc), suma = sc.du + sc.w, msg = [];
    if (r.cambia !== real.cambio) {
      if (real.cambio) {
        msg.push("Sí cambia: d[u] + w = " + fmt(suma) + " es menor que d[v] = " + fmt(sc.dv) + ", y la condición se cumple.");
      } else if (sc.tipo === "inf") {
        msg.push("No cambia. Con d[u] = ∞ la suma sigue siendo ∞, y ∞ no es menor que nada, ni siquiera que otro ∞. Un peso negativo no vuelve finito a un infinito.");
      } else if (sc.tipo === "empate") {
        msg.push("No cambia. d[u] + w = " + fmt(suma) + " es igual a d[v], no menor: la comparación es estricta y un empate no reescribe d[v] ni pred[v].");
      } else {
        msg.push("No cambia. d[u] + w = " + fmt(suma) + " no es menor que d[v] = " + fmt(sc.dv) + ": llegar a v por u cuesta más de lo que ya se tenía.");
      }
    }
    if (r.dv !== real.dv) {
      if (real.cambio && r.dv === sc.du) {
        msg.push("d[v] recibe d[u] + w = " + fmt(real.dv) + ", no solo d[u]: falta sumar el peso de la arista.");
      } else if (real.cambio && r.dv === sc.dv) {
        msg.push("d[v] no se queda en " + fmt(sc.dv) + ": la condición se cumple y baja a d[u] + w = " + fmt(real.dv) + ".");
      } else if (!real.cambio && r.dv === suma) {
        msg.push("Ese d[v] es la suma d[u] + w aplicada sin mirar la comparación. Como la suma no es menor que " + fmt(sc.dv) + ", d[v] se queda en " + fmt(sc.dv) + ".");
      } else if (real.cambio) {
        msg.push("d[v] debe quedar en d[u] + w = " + fmt(real.dv) + ".");
      } else {
        msg.push("d[v] no cambia: sigue en " + fmt(sc.dv) + ".");
      }
    }
    if (r.pv !== real.pv) {
      if (real.cambio && r.pv === sc.pv) {
        msg.push("pred[v] también se reescribe: cuando d[v] baja, pred[v] pasa a ser u = " + sc.u + ".");
      } else if (real.cambio) {
        msg.push("pred[v] debe quedar en u = " + sc.u + ", el vértice desde el que se mejoró d[v].");
      } else {
        msg.push("pred[v] queda como estaba (" + sc.pv + "): si d[v] no baja, relajar no toca el predecesor.");
      }
    }
    return msg.join(" ");
  }

  /* Interpreta el texto escrito para d[v]: numero, "inf", "∞" o "infinito". */
  function leerDistancia(texto) {
    var t = String(texto).trim().toLowerCase().replace("−", "-"), r;
    if (t === "inf" || t === "∞" || t === "infinito" || t === "+inf") { r = INF; }
    else if (/^-?\d+$/.test(t)) { r = parseInt(t, 10); }
    else { r = null; }
    return r;
  }

  return { codigo: CODIGO, escenarios: ESCENARIOS, simular: simular, resultado: resultado,
           diagnostico: diagnostico, leerDistancia: leerDistancia, fmt: fmt };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var ESC = EJERCICIO.escenarios, actual = 0;

    function sc() { return ESC[actual]; }

    function dibujar() {
      var p = sc(), F = EJERCICIO.fmt;
      var G = [[1], []];
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: [[0, 1], [3, 1]], G: G, nombres: [String(p.u), String(p.v)], alto: 130,
        peso: function () { return p.w; },
        nodo: function (i) {
          return i === 0
            ? { relleno: "#e3edf8", borde: "#1f5fa8", tinta: "#24292f", grueso: 2.2, nota: "d[" + p.u + "] = " + F(p.du) }
            : { relleno: "#fdf1dc", borde: "#e8a13d", tinta: "#24292f", grueso: 2.2, nota: "d[" + p.v + "] = " + F(p.dv) + ", pred[" + p.v + "] = " + p.pv, notaColor: "#a86a12" };
        },
        arista: function () { return { color: "gris", grueso: 2.2 }; }
      });
    }

    function llenarPi() {
      var p = sc(), sel = document.getElementById("resp-pv"), h = "<option value=''>Escoja</option><option value='-1'>-1</option>", i = 0;
      while (i <= 6) { h += "<option value='" + i + "'>" + i + "</option>"; i = i + 1; }
      sel.innerHTML = h;
    }

    function mostrar() {
      var p = sc();
      dibujar();
      document.getElementById("rot-escenario").textContent = (actual + 1) + " de " + ESC.length;
      document.getElementById("enunciado").innerHTML = "Se relaja la arista <code>(u, v, w)</code> = <code>(" + p.u + ", " + p.v + ", " + EJERCICIO.fmt(p.w) +
        ")</code> con <code>d[" + p.u + "] = " + EJERCICIO.fmt(p.du) + "</code>, <code>d[" + p.v + "] = " + EJERCICIO.fmt(p.dv) + "</code> y <code>pred[" + p.v + "] = " + p.pv + "</code>.";
      Array.prototype.forEach.call(document.querySelectorAll("input[name=cambia]"), function (b) { b.checked = false; });
      document.getElementById("resp-dv").value = "";
      llenarPi();
      Motor.limpiarVeredicto();
      Array.prototype.forEach.call(document.querySelectorAll("#presets-esc button"), function (b, k) {
        b.classList.toggle("primario", k === actual);
      });
    }

    function comprobar() {
      var p = sc(), v = document.getElementById("veredicto");
      var marca = document.querySelector("input[name=cambia]:checked");
      var dv = EJERCICIO.leerDistancia(document.getElementById("resp-dv").value);
      var pvTxt = document.getElementById("resp-pv").value;
      if (marca === null || dv === null || pvTxt === "") {
        v.className = "veredicto mal";
        v.textContent = "Responda las tres preguntas: si cambia algo, el nuevo d[v] (un entero o inf) y el nuevo pred[v].";
        return;
      }
      var r = { cambia: marca.value === "si", dv: dv, pv: parseInt(pvTxt, 10) };
      var texto = EJERCICIO.diagnostico(p, r);
      if (texto === "") {
        v.className = "veredicto bien";
        v.textContent = "Correcto. " + p.ok;
      } else {
        v.className = "veredicto mal";
        v.textContent = texto;
      }
    }

    function arrancar() {
      Motor.iniciar({
        codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
        chips: [
          { campo: "suma", rotulo: "d[u] + w" }, { campo: "dv", rotulo: "d[v]" },
          { campo: "pv", rotulo: "pred[v]" }
        ],
        paramsIniciales: sc()
      });
    }

    var botones = "", k = 0;
    while (k < ESC.length) { botones += "<button data-k='" + k + "'>" + (k + 1) + "</button>"; k = k + 1; }
    document.getElementById("presets-esc").innerHTML = "<span class='nota' style='margin-top:0'>Escenario:</span>" + botones;
    arrancar();
    mostrar();
    document.getElementById("btn-comprobar").addEventListener("click", comprobar);
    Array.prototype.forEach.call(document.querySelectorAll("#presets-esc button"), function (b) {
      b.addEventListener("click", function () {
        actual = parseInt(b.getAttribute("data-k"), 10);
        mostrar();
        Motor.reiniciar(sc());
      });
    });
  })();
}
