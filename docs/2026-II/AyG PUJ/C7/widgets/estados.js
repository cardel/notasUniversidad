/* Ejercicio interactivo: cuando el vertice no es la celda (clase 7).
   La misma cuadricula recorrida marcando la celda y marcando el estado. */
var EJERCICIO = (function () {
  var CODIGO_CELDA = [
    { txt: "def pasos_por_celda(a, k):",             num: null },
    { txt: "    m = len(a)",                          num: 1 },
    { txt: "    n = len(a[0])",                       num: 2 },
    { txt: "    d = tabla(m, n, -1)",                 num: 3 },
    { txt: "    racha = tabla(m, n, 0)",              num: 4 },
    { txt: "    d[0][0] = 0",                         num: 5 },
    { txt: "    cola = deque()",                      num: 6 },
    { txt: "    cola.append((0, 0))",                 num: 7 },
    { txt: "    while len(cola) > 0:",                num: 8,  bloque: 1 },
    { txt: "        e = cola.popleft()",              num: 9,  bloque: 1 },
    { txt: "        for s in vecinos(a, e[0], e[1]):", num: 10, bloque: 1 },
    { txt: "            nt = 0",                      num: 11, bloque: 1 },
    { txt: "            if a[s[0]][s[1]] == 1:",      num: 12, bloque: 1 },
    { txt: "                nt = racha[e[0]][e[1]] + 1", num: 13, bloque: 1 },
    { txt: "            if nt <= k and d[s[0]][s[1]] == -1:", num: 14, bloque: 1 },
    { txt: "                d[s[0]][s[1]] = d[e[0]][e[1]] + 1", num: 15, bloque: 1 },
    { txt: "                racha[s[0]][s[1]] = nt",  num: 16, bloque: 1 },
    { txt: "                cola.append(s)",          num: 17, bloque: 1 },
    { txt: "    return d[m - 1][n - 1]",              num: 18 }
  ];
  var CODIGO_ESTADO = [
    { txt: "def pasos_por_estado(a, k):",            num: null },
    { txt: "    m = len(a)",                          num: 1 },
    { txt: "    n = len(a[0])",                       num: 2 },
    { txt: "    d = tabla3(m, n, k + 1, -1)",         num: 3 },
    { txt: "    d[0][0][0] = 0",                      num: 4 },
    { txt: "    cola = deque()",                      num: 5 },
    { txt: "    cola.append((0, 0, 0))",              num: 6 },
    { txt: "    while len(cola) > 0:",                num: 7,  bloque: 1 },
    { txt: "        e = cola.popleft()",              num: 8,  bloque: 1 },
    { txt: "        for s in vecinos(a, e[0], e[1]):", num: 9,  bloque: 1 },
    { txt: "            nt = 0",                      num: 10, bloque: 1 },
    { txt: "            if a[s[0]][s[1]] == 1:",      num: 11, bloque: 1 },
    { txt: "                nt = e[2] + 1",           num: 12, bloque: 1 },
    { txt: "            if nt <= k and d[s[0]][s[1]][nt] == -1:", num: 13, bloque: 1 },
    { txt: "                d[s[0]][s[1]][nt] = d[e[0]][e[1]][e[2]] + 1", num: 14, bloque: 1 },
    { txt: "                cola.append((s[0], s[1], nt))", num: 15, bloque: 1 },
    { txt: "    return d[m - 1][n - 1][0]",           num: 16 }
  ];
  var DR = [1, -1, 0, 0], DC = [0, 0, 1, -1];

  function vecinos(a, r, c) {
    var res = [], i = 0;
    while (i < 4) {
      var nr = r + DR[i], nc = c + DC[i];
      if (nr >= 0 && nr < a.length && nc >= 0 && nc < a[0].length) { res.push([nr, nc]); }
      i = i + 1;
    }
    return res;
  }

  function simular(params) {
    var a = params.a, k = params.k, m = a.length, n = a[0].length;
    var pasos = [];
    var celdaD = null, cola = null, llegadas = [];   // llegadas: {celda, racha, aceptada, paso}
    function copia(t) { var o = []; var i = 0; while (i < t.length) { o.push(t[i].slice()); i = i + 1; } return o; }
    function snap(linea, extra) {
      var q = { linea: linea, d: celdaD === null ? null : copia(celdaD), cola: cola === null ? [] : cola.slice(), llegadas: llegadas.slice() };
      if (extra) { for (var x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }
    celdaD = []; var i = 0;
    while (i < m) { celdaD.push([]); var j = 0; while (j < n) { celdaD[i].push(-1); j = j + 1; } i = i + 1; }
    if (params.forma === "celda") {
      var racha = copia(celdaD);
      snap(1); snap(2); snap(3); snap(4);
      celdaD[0][0] = 0; snap(5);
      cola = []; snap(6);
      cola.push([0, 0]); snap(7);
      var sigue = true;
      while (sigue) {
        snap(8);
        if (cola.length > 0) {
          var e = cola.shift(); snap(9, { sale: e });
          var vs = vecinos(a, e[0], e[1]); var t = 0;
          while (t < vs.length) {
            var s = vs[t]; snap(10, { mira: s });
            var nt = 0; snap(11);
            snap(12);
            if (a[s[0]][s[1]] === 1) { nt = racha[e[0]][e[1]] + 1; snap(13); }
            snap(14, { mira: s });
            var acepta = nt <= k && celdaD[s[0]][s[1]] === -1;
            if (nt <= k) { llegadas.push({ celda: s, racha: nt, aceptada: acepta, desde: e }); }
            if (acepta) {
              celdaD[s[0]][s[1]] = celdaD[e[0]][e[1]] + 1; snap(15);
              racha[s[0]][s[1]] = nt; snap(16);
              cola.push(s); snap(17);
            }
            t = t + 1;
          }
        } else { sigue = false; }
      }
      snap(18, { fin: true, resultado: celdaD[m - 1][n - 1] });
    } else {
      var d3 = {};
      snap(1); snap(2); snap(3);
      d3["0,0,0"] = 0; celdaD[0][0] = 0; snap(4);
      cola = []; snap(5);
      cola.push([0, 0, 0]); snap(6);
      var sigue2 = true;
      while (sigue2) {
        snap(7);
        if (cola.length > 0) {
          var e2 = cola.shift(); snap(8, { sale: e2 });
          var vs2 = vecinos(a, e2[0], e2[1]); var t2 = 0;
          while (t2 < vs2.length) {
            var s2 = vs2[t2]; snap(9, { mira: s2 });
            var nt2 = 0; snap(10);
            snap(11);
            if (a[s2[0]][s2[1]] === 1) { nt2 = e2[2] + 1; snap(12); }
            snap(13, { mira: s2 });
            var clave = s2[0] + "," + s2[1] + "," + nt2;
            var acepta2 = nt2 <= k && d3[clave] === undefined;
            if (nt2 <= k) { llegadas.push({ celda: s2, racha: nt2, aceptada: acepta2, desde: e2 }); }
            if (acepta2) {
              d3[clave] = d3[e2[0] + "," + e2[1] + "," + e2[2]] + 1;
              if (celdaD[s2[0]][s2[1]] === -1) { celdaD[s2[0]][s2[1]] = d3[clave]; }
              snap(14);
              cola.push([s2[0], s2[1], nt2]); snap(15);
            }
            t2 = t2 + 1;
          }
        } else { sigue2 = false; }
      }
      var res = d3[(m - 1) + "," + (n - 1) + ",0"];
      snap(16, { fin: true, resultado: res === undefined ? -1 : res });
    }
    return pasos;
  }

  return { CODIGO_CELDA: CODIGO_CELDA, CODIGO_ESTADO: CODIGO_ESTADO, simular: simular, vecinos: vecinos };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var A = [[0, 1, 0, 0], [0, 0, 1, 1], [1, 1, 1, 1], [1, 1, 1, 0]];
    var PRESETS = [
      { a: A, k: 2, forma: "celda", codigo: EJERCICIO.CODIGO_CELDA },
      { a: A, k: 2, forma: "estado", codigo: EJERCICIO.CODIGO_ESTADO }
    ];
    var actual = 0;
    var porqueOK = false;

    function dibujar(params, d, sale, mira) {
      var a = params.a, m = a.length, n = a[0].length, cel = 40;
      var svg = "<svg viewBox='0 0 " + (n * cel + 2) + " " + (m * cel + 2) + "' width='100%' style='max-width:" + (n * cel + 2) + "px'>";
      var r = 0;
      while (r < m) {
        var c = 0;
        while (c < n) {
          var x = c * cel + 1, y = r * cel + 1;
          var fill = a[r][c] === 1 ? "#cbd5e1" : "#ffffff";
          if (d !== null && d[r][c] >= 0) { fill = a[r][c] === 1 ? "#e8a13d" : "#e3edf8"; }
          if (sale && sale[0] === r && sale[1] === c) { fill = "#1f5fa8"; }
          var stroke = (mira && mira[0] === r && mira[1] === c) ? "#b3261e" : "#d8dee6";
          svg += "<rect x='" + x + "' y='" + y + "' width='" + cel + "' height='" + cel + "' fill='" + fill + "' stroke='" + stroke + "' stroke-width='" + (stroke === "#b3261e" ? 3 : 1) + "'/>";
          var texto = (r === 0 && c === 0) ? "I" : ((r === m - 1 && c === n - 1) ? "F" : "");
          if (d !== null && d[r][c] >= 0 && texto === "") { texto = d[r][c]; }
          if (texto !== "") {
            svg += "<text x='" + (x + cel / 2) + "' y='" + (y + cel / 2 + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='" + ((sale && sale[0] === r && sale[1] === c) ? "#fff" : "#24292f") + "'>" + texto + "</text>";
          }
          c = c + 1;
        }
        r = r + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grid").innerHTML = svg;
    }

    function alPintar(e) {
      var q = e.actual;
      dibujar(e.params, q ? q.d : null, q ? q.sale : null, q ? q.mira : null);
      document.getElementById("ver-cola").textContent = q && q.cola.length > 0
        ? q.cola.map(function (p) { return "(" + p.join(",") + ")"; }).join(" ") : "vacía";
      var cuerpo = document.getElementById("cuerpo-llegadas");
      cuerpo.innerHTML = "";
      var n = 0;
      if (q) {
        var i = 0;
        while (i < q.llegadas.length) {
          var l = q.llegadas[i];
          if (l.celda[0] === 1 && l.celda[1] === 3) {
            n = n + 1;
            var tr = document.createElement("tr");
            tr.innerHTML = "<td>(" + l.desde.slice(0, 2).join(",") + ")</td><td>" + l.racha + "</td><td>" + (l.aceptada ? "entra a la cola" : "descartada") + "</td>";
            if (!l.aceptada) { tr.style.background = "var(--rojo-suave)"; }
            cuerpo.appendChild(tr);
          }
          i = i + 1;
        }
      }
      if (n === 0) { cuerpo.innerHTML = "<tr><td colspan='3' class='pend'>Ejecute: aquí se anotan las llegadas a la celda (1,3).</td></tr>"; }
      var aviso = document.getElementById("aviso-final");
      if (q && q.fin) {
        aviso.className = "alerta";
        aviso.innerHTML = e.params.forma === "celda"
          ? "Resultado: <b>" + q.resultado + "</b>. La cola se vació sin tocar la esquina final."
          : "Resultado: <b>" + q.resultado + "</b> pasos. La celda (1,3) entró dos veces a la cola, con racha 2 y con racha 1, y la segunda es la que sigue hasta el final.";
      } else { aviso.className = ""; aviso.innerHTML = ""; }
    }

    function evaluar(valor, params) {
      var pasos = EJERCICIO.simular(params);
      var real = pasos[pasos.length - 1].resultado;
      if (valor === real) {
        return { ok: true, msg: params.forma === "celda"
          ? "Correcto: −1. El programa no encuentra camino, y sin embargo hay uno de 6 pasos. Ejecute y mire qué pasa en la celda (1,3)."
          : "Correcto: 6 pasos. Ejecute y mire cómo la misma celda entra dos veces a la cola con rachas distintas." };
      }
      if (params.forma === "celda" && valor === 6) {
        return { ok: false, msg: "Ese es el camino que existe, pero no es lo que este programa devuelve. Ejecute hasta el final." };
      }
      if (params.forma === "estado" && valor === -1) {
        return { ok: false, msg: "Con el estado sí hay camino. Busque uno que pise dos obstáculos, nunca tres seguidos." };
      }
      return { ok: false, msg: "No coincide. Ejecute con Auto y lea el resultado al final." };
    }

    function arrancar(k) {
      actual = k;
      var ids = ["btn-paso", "btn-auto", "btn-fin", "btn-reiniciar", "btn-comprobar"];
      var t = 0;
      while (t < ids.length) { var b = document.getElementById(ids[t]); b.parentNode.replaceChild(b.cloneNode(true), b); t = t + 1; }
      Motor.iniciar({ codigo: PRESETS[k].codigo, simular: EJERCICIO.simular, chips: [], paramsIniciales: PRESETS[k], alPintar: alPintar });
      Motor.prediccionNumerica(evaluar);
      document.getElementById("prediccion").value = "";
      Motor.limpiarVeredicto();
    }

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        arrancar(parseInt(btn.getAttribute("data-preset"), 10));
      });
    });

    function veredicto(id, ok, texto) { var v = document.getElementById(id); v.className = ok ? "veredicto bien" : "veredicto mal"; v.innerHTML = texto; }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-porque button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          porqueOK = true;
          veredicto("veredicto-porque", true, "Eso es. A (1,3) se llega primero desde (1,2) con racha 2, y esa llegada no puede seguir a (2,3). La llegada desde (0,3) trae racha 1 y sí podría seguir, pero la celda ya estaba marcada y se descarta. Dos situaciones distintas del robot, una sola marca.");
          document.getElementById("paso-1").classList.remove("bloqueado");
        } else if (op === "orden") {
          veredicto("veredicto-porque", false, "El orden de la cola es el correcto para la amplitud. El problema no es cuándo llega cada cosa sino qué se marca al llegar.");
        } else {
          veredicto("veredicto-porque", false, "Con k = 2 sí se pueden pisar dos obstáculos seguidos, y el camino de 6 pasos nunca pisa tres. La cota no es el problema.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p1");
        if (op === "estados") {
          veredicto("veredicto-p1", true, "Correcto: m·n·(k+1) estados, cada uno con a lo sumo cuatro aristas. Aquí son 4·4·3 = 48 estados, contra 16 celdas del ingenuo.");
          document.getElementById("paso-1").classList.add("hecho");
        } else if (op === "celdas") {
          veredicto("veredicto-p1", false, "Ese es el costo del programa que falla. Distinguir las rachas multiplica los vértices por k + 1.");
        } else {
          veredicto("veredicto-p1", false, "No hay nada exponencial: los estados son m·n·(k+1) y cada uno se visita una vez.");
        }
      });
    });

    arrancar(0);
  })();
}
