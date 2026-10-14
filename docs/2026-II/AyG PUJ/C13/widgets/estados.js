/* Ejercicio interactivo: el grafo de estados de The New Villa (UVa 321), clase 13.
   La simulacion reproduce sucesores, ssspBFS y resolver de new_villa.py, linea
   por linea, con la numeracion de linea del archivo. */
var LIB = (typeof module !== "undefined") ? require("./bfm-lib.js") : { DIB: DIB };

var EJERCICIO = (function () {
  var PY = {
 "desde": 10,
 "lineas": [
  "def sucesores(estado, puertas, interruptores):",
  "  # Los estados a un paso de estado, cada uno con el texto de ese paso.",
  "  (hab, luces) = estado",
  "  res = []",
  "  for l in interruptores[hab]:",
  "    # nunca se apaga la luz de la habitacion donde se esta",
  "    if l != hab:",
  "      nuevas = list(luces)",
  "      nuevas[l] = not nuevas[l]",
  "      if nuevas[l]:",
  "        texto = '- Switch on light in room ' + str(l) + '.'",
  "      else:",
  "        texto = '- Switch off light in room ' + str(l) + '.'",
  "      res.append(((hab, tuple(nuevas)), texto))",
  "  for j in puertas[hab]:",
  "    # solo se entra a una habitacion con la luz prendida",
  "    if luces[j]:",
  "      res.append(((j, luces), '- Move to room ' + str(j) + '.'))",
  "  return res",
  "",
  "",
  "def ssspBFS(s, puertas, interruptores):",
  "  # d[u]: pasos de s a u; p[u]: (estado anterior, texto del paso).",
  "  # Un estado que no esta en d no se ha descubierto: costo infinito.",
  "  q = deque()",
  "  d, p = {}, {}",
  "  q.append(s)",
  "  d[s] = 0",
  "",
  "  while len(q) > 0:",
  "    v = q.popleft()",
  "    for (u, texto) in sucesores(v, puertas, interruptores):",
  "      if u not in d:",
  "        q.append(u)",
  "        d[u] = d[v] + 1",
  "        p[u] = (v, texto)",
  "",
  "  return d, p",
  "",
  "",
  "def resolver(r, puertas, interruptores):",
  "  # (hay, pasos): si se llega a la meta y el texto de cada paso.",
  "  luces = [False] * (r + 1)",
  "  luces[1] = True",
  "  s = (1, tuple(luces))",
  "  luces = [False] * (r + 1)",
  "  luces[r] = True",
  "  meta = (r, tuple(luces))",
  "  d, p = ssspBFS(s, puertas, interruptores)",
  "  hay = meta in d",
  "  pasos = []",
  "  if hay:",
  "    x = meta",
  "    while x != s:",
  "      (anterior, texto) = p[x]",
  "      pasos.append(texto)",
  "      x = anterior",
  "    pasos.reverse()",
  "  return (hay, pasos)"
 ]
};
  var CONTABLES = [12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 24, 26, 27, 28, 34, 35, 36, 37, 39, 40, 41, 42, 43, 44, 45, 47,
                   52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68];
  var BANDAS = [[12, 28, 1], [34, 47, 2], [52, 68, 3]];

  function armarCodigo() {
    var codigo = [], k = 0;
    while (k < PY.lineas.length) {
      var n = PY.desde + k, e = { txt: PY.lineas[k], num: CONTABLES.indexOf(n) >= 0 ? n : null }, b = 0;
      while (b < BANDAS.length) { if (n >= BANDAS[b][0] && n <= BANDAS[b][1]) { e.bloque = BANDAS[b][2]; } b = b + 1; }
      codigo.push(e);
      k = k + 1;
    }
    return codigo;
  }
  var CODIGO = armarCodigo();

  var VILLAS = [
    { boton: "Tres habitaciones, dos puertas desde la 1",
      texto: "Tres habitaciones. Las puertas salen de la 1 hacia la 2 y hacia la 3. Se empieza en la 1 con solo su luz prendida y se quiere terminar en la 3 con solo su luz prendida.",
      r: 3, puertas: [[1, 2], [1, 3]], interruptores: [[1, 2], [2, 3], [3, 1]],
      pos: [[1.8, 1.4], [0.2, 2.8], [3.4, 2.8]] },
    { boton: "Tres habitaciones en fila, sin solución",
      texto: "Tres habitaciones en fila: puertas 1-2 y 2-3. Los interruptores de la 1 prenden la 2 y la 3, y el de la 3 prende la 1. Desde la 2 no se puede cambiar ninguna luz.",
      r: 3, puertas: [[1, 2], [2, 3]], interruptores: [[1, 2], [1, 3], [3, 1]],
      pos: [[0.0, 0.6], [1.7, 2.4], [3.4, 0.6]] },
    { boton: "Tres habitaciones en fila, con solución",
      texto: "Tres habitaciones en fila: puertas 1-2 y 2-3. Desde la 1 se prenden la 2 y la 3; desde la 3 se prenden la 1 y la 2.",
      r: 3, puertas: [[1, 2], [2, 3]], interruptores: [[1, 2], [1, 3], [3, 1], [3, 2]],
      pos: [[0.0, 0.6], [1.7, 2.4], [3.4, 0.6]] }
  ];

  function listasDe(v) {
    var P = [], I = [], i = 0;
    while (i <= v.r) { P.push([]); I.push([]); i = i + 1; }
    v.puertas.forEach(function (d) { P[d[0]].push(d[1]); P[d[1]].push(d[0]); });
    v.interruptores.forEach(function (s) { I[s[0]].push(s[1]); });
    i = 0;
    while (i <= v.r) { P[i].sort(function (a, b) { return a - b; }); I[i].sort(function (a, b) { return a - b; }); i = i + 1; }
    return { r: v.r, puertas: P, interruptores: I };
  }
  VILLAS.forEach(function (v) { v.params = listasDe(v); });

  function clonar(x) { return Array.isArray(x) ? x.map(clonar) : x; }
  function clave(e) { return e[0] + ":" + e[1].map(function (b) { return b ? 1 : 0; }).join(""); }
  function etiqueta(e) {
    if (!e) { return null; }
    var on = [], i = 1;
    while (i < e[1].length) { if (e[1][i]) { on.push(i); } i = i + 1; }
    return "(" + e[0] + ", {" + on.join(",") + "})";
  }

  function simular(params) {
    var r = params.r, P = params.puertas, I = params.interruptores, pasos = [];
    var E = { v: null, hab: null, luces: null, res: null, l: null, j: null, nuevas: null, texto: null, u: null,
              estados: [], dist: [], padre: [], q: [], vId: null, x: null, hay: null, sol: [], s: null, meta: null,
              vTxt: null, uTxt: null };
    function snap(linea, extra) {
      var q = { linea: linea, hecho: false }, k;
      for (k in E) { q[k] = clonar(E[k]); }
      if (extra) { for (k in extra) { q[k] = extra[k]; } }
      pasos.push(q);
    }
    function idDe(e) {
      var k = clave(e), i = 0, res = -1;
      while (i < E.estados.length) { if (clave(E.estados[i]) === k) { res = i; } i = i + 1; }
      return res;
    }

    function sucesores(estado) {
      var l, j, i, j2;
      E.hab = estado[0]; E.luces = clonar(estado[1]); snap(12);
      E.res = []; snap(13);
      for (i = 0; i < I[estado[0]].length; i++) {
        l = I[estado[0]][i]; E.l = l; snap(14);
        snap(16);
        if (l !== estado[0]) {
          E.nuevas = clonar(estado[1]); snap(17);
          E.nuevas[l] = !E.nuevas[l]; snap(18);
          snap(19);
          if (E.nuevas[l]) { E.texto = "- Switch on light in room " + l + "."; snap(20); }
          else { E.texto = "- Switch off light in room " + l + "."; snap(22); }
          E.res.push([[estado[0], clonar(E.nuevas)], E.texto]); snap(23);
        }
      }
      for (j2 = 0; j2 < P[estado[0]].length; j2++) {
        j = P[estado[0]][j2]; E.j = j; snap(24);
        snap(26);
        if (estado[1][j]) { E.res.push([[j, clonar(estado[1])], "- Move to room " + j + "."]); snap(27); }
      }
      snap(28);
      return clonar(E.res);
    }

    function bfs(s) {
      var vid, v, lista, i, uid, u, texto;
      snap(34);
      snap(35);
      E.estados.push(s); E.dist.push(null); E.padre.push(null); E.q.push(0); snap(36);
      E.dist[0] = 0; snap(37);
      while (E.q.length > 0) {
        snap(39);
        vid = E.q[0]; E.q.shift(); v = E.estados[vid]; E.v = v; E.vId = vid; E.vTxt = etiqueta(v); snap(40);
        snap(41);
        lista = sucesores(v);
        for (i = 0; i < lista.length; i++) {
          u = lista[i][0]; texto = lista[i][1]; E.u = u; E.uTxt = etiqueta(u); E.texto = texto;
          snap(42);
          if (idDe(u) < 0) {
            uid = E.estados.length; E.estados.push(u); E.dist.push(null); E.padre.push(null); E.q.push(uid); snap(43);
            E.dist[uid] = E.dist[vid] + 1; snap(44);
            E.padre[uid] = [vid, texto]; snap(45);
          }
        }
      }
      snap(47);
    }

    var luces = [], i = 0;
    while (i <= r) { luces.push(false); i = i + 1; }
    luces[1] = true; var s = [1, clonar(luces)]; E.s = s; snap(52); snap(53); snap(54);
    var l2 = [], k = 0;
    while (k <= r) { l2.push(false); k = k + 1; }
    snap(55);
    l2[r] = true; snap(56);
    var meta = [r, clonar(l2)]; E.meta = meta; snap(57);
    bfs(s);
    var mid = idDe(meta), hay = mid >= 0;
    E.hay = hay; snap(59);
    E.sol = []; snap(60);
    snap(61);
    var pasosTxt = [];
    if (hay) {
      var x = mid; E.x = x; snap(62);
      while (x !== 0) {
        snap(63);
        var par = E.padre[x]; snap(64);
        pasosTxt.push(par[1]); E.sol = pasosTxt.slice(); snap(65);
        x = par[0]; E.x = x; snap(66);
      }
      pasosTxt.reverse(); E.sol = pasosTxt.slice(); snap(67);
    }
    var salida = ["Villa #1"];
    if (hay) { salida.push("The problem can be solved in " + pasosTxt.length + " steps:"); pasosTxt.forEach(function (t) { salida.push(t); }); }
    else { salida.push("The problem cannot be solved."); }
    salida.push("");
    snap(68, { hecho: true });
    pasos[pasos.length - 1].resultado = { hay: hay, pasos: pasosTxt, alcanzables: E.estados.length, salida: salida.join("\n"),
      estados: E.estados.map(function (e) { return etiqueta(e); }), dist: E.dist.slice(), padre: E.padre.slice(), total: r * Math.pow(2, r) };
    return pasos;
  }

  function resumen(params) { return simular(params).pop().resultado; }

  function entradaDe(v) {
    var s = v.r + " " + v.puertas.length + " " + v.interruptores.length + "\n";
    v.puertas.forEach(function (d) { s += d[0] + " " + d[1] + "\n"; });
    v.interruptores.forEach(function (w) { s += w[0] + " " + w[1] + "\n"; });
    return s + "0 0 0\n";
  }

  function evaluar(valor, v) {
    var r = resumen(v.params), total = r.total, res;
    if (valor === r.alcanzables) {
      res = { ok: true, msg: "Correcto: " + r.alcanzables + " de los " + total + " estados posibles (" + v.r + " habitaciones por " + Math.pow(2, v.r) + " combinaciones de luces). " +
        (r.hay ? "La meta está entre ellos, a " + r.pasos.length + " pasos." : "La meta no está entre ellos: la búsqueda se agota y el programa dice que no tiene solución.") +
        " La búsqueda no se detiene al llegar a la meta: ssspBFS descubre todo lo alcanzable." };
    } else if (valor > total) {
      res = { ok: false, msg: "Hay " + v.r + " habitaciones y cada luz está prendida o apagada: el total posible es " + v.r + " · 2^" + v.r + " = " + total + ", y no se puede alcanzar más que eso." };
    } else if (valor < 1) {
      res = { ok: false, msg: "Al menos el estado inicial está descubierto." };
    } else if (valor < r.alcanzables) {
      res = { ok: false, msg: "Se alcanzan más. Siga los movimientos desde el inicial: cada interruptor y cada puerta con la luz del destino prendida produce un estado nuevo, y de cada uno salen otros." };
    } else {
      res = { ok: false, msg: "Se alcanzan menos. Hay combinaciones que ningún interruptor produce, o que exigen entrar a una habitación con la luz apagada, y esas nunca se descubren." };
    }
    return res;
  }

  return { codigo: CODIGO, villas: VILLAS, simular: simular, resumen: resumen, evaluar: evaluar, entradaDe: entradaDe, etiqueta: etiqueta,
           listasDe: listasDe };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var presetActual = 0;
    function v() { return EJERCICIO.villas[presetActual]; }
    function paramsActuales() { return v().params; }

    function dibujar(a) {
      var p = v(), nom = [], i = 1, G = [];
      while (i <= p.r) { nom.push(String(i)); G.push([]); i = i + 1; }
      p.puertas.forEach(function (d) { G[d[0] - 1].push(d[1] - 1); G[d[1] - 1].push(d[0] - 1); });
      var est = a && a.v ? a.v : null;
      document.getElementById("panel-grafo").innerHTML = LIB.DIB.dibujar({
        pos: p.pos, G: G, nombres: nom, dirigido: false, alto: 190, maxAncho: 460,
        nodo: function (k) {
          var s = { relleno: "#ffffff", borde: "#6b7280", tinta: "#24292f", grueso: 2.2, nota: "" };
          if (est) {
            if (est[1][k + 1]) { s.relleno = "#ffe9a8"; s.borde = "#e8a13d"; s.nota = "luz"; s.notaColor = "#a86a12"; }
            if (est[0] === k + 1) { s.borde = "#1f5fa8"; s.grueso = 4.4; }
          }
          return s;
        },
        arista: function () { return { color: "gris", grueso: 2.2 }; }
      });
    }

    function alPintar(e) {
      var a = e.actual, p = v();
      dibujar(a);
      document.getElementById("ver-cola").textContent = a && a.q.length > 0 ? "[" + a.q.map(function (id) { return id; }).join(", ") + "]" : "[ ]";
      var filas = "";
      if (a) {
        a.estados.forEach(function (st, id) {
          var viva = a.vId === id && a.linea >= 40 && a.linea <= 41 ? " class='viva'" : "";
          filas += "<tr" + viva + "><td>" + id + "</td><td>" + EJERCICIO.etiqueta(st) + "</td><td>" + (a.dist[id] === null ? "–" : a.dist[id]) + "</td><td>" +
                   (a.padre[id] ? a.padre[id][0] : "–") + "</td><td style='text-align:left'>" + (a.padre[id] ? a.padre[id][1].replace("- ", "") : "") + "</td></tr>";
        });
      }
      if (filas === "") { filas = "<tr><td colspan='5' class='pend'>Todavía no se descubre ningún estado.</td></tr>"; }
      document.getElementById("cuerpo-tabla").innerHTML = filas;
      document.getElementById("ver-sucs").innerHTML = a && a.res && a.res.length > 0
        ? a.res.map(function (x) { return EJERCICIO.etiqueta(x[0]) + " " + x[1].replace("- ", ""); }).join("<br>") : "–";
      var sec = document.getElementById("secuencia");
      if (a && a.hecho) {
        var r = a.resultado;
        sec.className = r.hay ? "veredicto bien" : "veredicto mal";
        sec.innerHTML = r.hay ? "Se descubrieron " + r.alcanzables + " estados. La secuencia reconstruida, de la meta hacia atrás por p y luego invertida, tiene " + r.pasos.length + " pasos:<br>" + r.pasos.join("<br>")
                              : "Se descubrieron " + r.alcanzables + " estados y la meta no es uno de ellos: The problem cannot be solved.";
      } else { sec.className = "veredicto"; sec.textContent = ""; }
    }

    function preparar() {
      var p = v();
      document.getElementById("ver-texto").textContent = p.texto;
      document.getElementById("ver-inter").textContent = p.interruptores.map(function (s) { return "en la " + s[0] + " enciende o apaga la " + s[1]; }).join("; ") + ".";
      document.getElementById("prediccion").value = "";
      Motor.limpiarVeredicto();
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo, simular: EJERCICIO.simular,
      chips: [{ campo: "vTxt", rotulo: "v" }, { campo: "uTxt", rotulo: "u" }, { campo: "l", rotulo: "l" }, { campo: "j", rotulo: "j" }],
      paramsIniciales: paramsActuales(), alPintar: alPintar
    });
    preparar();
    Motor.prediccionNumerica(function (valor) { return EJERCICIO.evaluar(valor, v()); });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        preparar();
        Motor.reiniciar(paramsActuales());
      });
    });
  })();
}
