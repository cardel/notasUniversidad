/* Traza: suma(f, prox, a, b) como tabla, una fila por llamada. El estudiante
   llena a, f(a) y prox(a) de cada fila y el total antes de ver la ejecución.
   Reproduce 02_suma_hof.scala con dos pares de funciones; los valores
   (341 y 12) salen de correrlo con scala-cli. */
(function () {
  var CODIGO = [
    { txt: "def suma(f: Int => Int, prox: Int => Int, a: Int, b: Int): Int =", num: null },
    { txt: "  if (a > b) 0", num: 1 },
    { txt: "  else f(a) + suma(f, prox, prox(a), b)", num: 2 }
  ];

  var PRESETS = [
    { rotulo: "suma(x => x * x, x => x * 2, 1, 20)", fTxt: "x * x", proxTxt: "x * 2", a: 1, b: 20,
      f: function (x) { return x * x; }, prox: function (x) { return x * 2; } },
    { rotulo: "suma(x => 10 - x, x => x + 4, 1, 13)", fTxt: "10 - x", proxTxt: "x + 4", a: 1, b: 13,
      f: function (x) { return 10 - x; }, prox: function (x) { return x + 4; } }
  ];

  /* Una fila por llamada; la última es la que devuelve 0. */
  function filas(p) {
    var F = [], a = p.a;
    while (a <= p.b) {
      F.push({ a: a, fa: p.f(a), prox: p.prox(a), base: false });
      a = p.prox(a);
    }
    F.push({ a: a, fa: null, prox: null, base: true });
    return F;
  }

  function total(p) {
    return filas(p).reduce(function (s, f) { return f.base ? s : s + f.fa; }, 0);
  }

  /* Pasos: bajada (una por llamada, línea 2; la base, línea 1) y subida
     (una suma por término, de adentro hacia afuera). */
  function simular(idx) {
    var p = PRESETS[idx], F = filas(p), pasos = [], i, acumulado = 0;
    for (i = 0; i < F.length; i = i + 1) {
      pasos.push({ linea: F[i].base ? 1 : 2, a: F[i].a, fa: F[i].base ? "–" : F[i].fa,
        fila: i, fase: "baja", acumulado: null, pendientes: F[i].base ? F.length - 1 : i + 1 });
    }
    for (i = F.length - 2; i >= 0; i = i - 1) {
      acumulado = acumulado + F[i].fa;
      pasos.push({ linea: null, a: F[i].a, fa: F[i].fa, fila: i, fase: "sube",
        acumulado: acumulado, pendientes: i });
    }
    return pasos;
  }

  var API = { PRESETS: PRESETS, filas: filas, total: total, simular: simular, CODIGO: CODIGO };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var actual = 0;

  function celdaEntrada(id, dada) {
    var td = document.createElement("td");
    if (dada !== undefined) {
      td.textContent = dada;
      td.className = "dada";
      return td;
    }
    var inp = document.createElement("input");
    inp.type = "number"; inp.id = id; inp.placeholder = "?";
    td.appendChild(inp);
    var real = document.createElement("span");
    real.className = "real"; real.id = "real-" + id;
    td.appendChild(real);
    return td;
  }

  function construirTabla(idx) {
    var p = PRESETS[idx], F = filas(p);
    var cuerpo = document.getElementById("cuerpo-tabla");
    cuerpo.innerHTML = "";
    document.getElementById("cab-f").textContent = "f(a) = " + p.fTxt;
    document.getElementById("cab-prox").textContent = "prox(a) = " + p.proxTxt;
    F.forEach(function (f, i) {
      var tr = document.createElement("tr");
      tr.id = "fila-" + i;
      tr.appendChild(celdaEntrada("a-" + i, i === 0 ? f.a : undefined));
      if (f.base) {
        var td = document.createElement("td");
        td.colSpan = 2; td.className = "que";
        td.textContent = "a > " + p.b + ": devuelve 0";
        tr.appendChild(td);
      } else {
        tr.appendChild(celdaEntrada("fa-" + i));
        tr.appendChild(celdaEntrada("prox-" + i));
      }
      var que = document.createElement("td");
      que.className = "que"; que.id = "que-" + i;
      que.textContent = f.base ? "" : "f(a) + suma(f, prox, prox(a), " + p.b + ")";
      tr.appendChild(que);
      cuerpo.appendChild(tr);
    });
    document.getElementById("total").value = "";
    document.getElementById("real-total").textContent = "";
    var ver = document.getElementById("veredicto-tabla");
    ver.className = "veredicto"; ver.textContent = "";
  }

  function comprobar() {
    var p = PRESETS[actual], F = filas(p), malas = 0, vacias = 0;
    function revisar(id, esperado) {
      var inp = document.getElementById(id);
      if (!inp) { return; }
      var v = parseInt(inp.value, 10);
      if (isNaN(v)) { vacias = vacias + 1; inp.className = ""; return; }
      inp.className = v === esperado ? "bien" : "mal";
      if (v !== esperado) { malas = malas + 1; }
    }
    F.forEach(function (f, i) {
      if (i > 0) { revisar("a-" + i, f.a); }
      if (!f.base) { revisar("fa-" + i, f.fa); revisar("prox-" + i, f.prox); }
    });
    revisar("total", total(p));
    var ver = document.getElementById("veredicto-tabla");
    if (vacias > 0) {
      ver.className = "veredicto mal";
      ver.textContent = "Faltan " + vacias + " casillas.";
    } else if (malas === 0) {
      ver.className = "veredicto bien";
      ver.textContent = "Correcto. El a de cada fila es el prox(a) de la anterior, y el total es la suma de la columna f(a): " + total(p) + ".";
    } else {
      ver.className = "veredicto mal";
      ver.textContent = malas + " casilla(s) en rojo. Dos cosas que se cruzan: f se aplica al a de la misma fila, y prox produce el a de la fila siguiente. El último a es el primero que pasa de " + p.b + ".";
    }
  }

  function pintar(e) {
    var p = PRESETS[e.params], F = filas(p);
    F.forEach(function (f, i) {
      var tr = document.getElementById("fila-" + i);
      if (!tr) { return; }
      tr.classList.toggle("actual", e.actual && e.actual.fila === i);
      var visto = e.actual && (e.actual.fase === "sube" || e.actual.fila >= i);
      ["a", "fa", "prox"].forEach(function (c) {
        var real = document.getElementById("real-" + c + "-" + i);
        if (real) { real.textContent = visto ? "= " + f[c] : ""; }
      });
    });
    document.getElementById("real-total").textContent = e.terminado ? "= " + total(p) : "";
    var pie = document.getElementById("pie-tabla");
    if (!e.actual) {
      pie.textContent = p.rotulo + " todavía no ha empezado.";
    } else if (e.actual.fase === "baja" && e.actual.linea === 2) {
      pie.textContent = "Llamada con a = " + e.actual.a + ": f(a) = " + e.actual.fa + " queda esperando y la siguiente entra con a = " + p.prox(e.actual.a) + ".";
    } else if (e.actual.fase === "baja") {
      pie.textContent = "a = " + e.actual.a + " ya pasó de " + p.b + ": devuelve 0. Hay " + e.actual.pendientes + " sumas esperando.";
    } else {
      pie.textContent = "Sube: " + e.actual.fa + " + lo que volvió = " + e.actual.acumulado + ". Faltan " + e.actual.pendientes + " por cerrar.";
    }
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: 0,
    chips: [
      { campo: "a", rotulo: "a" },
      { campo: "fa", rotulo: "f(a)" },
      { campo: "acumulado", rotulo: "acumulado", clase: "alerta" }
    ],
    simular: simular,
    alPintar: pintar
  });

  document.getElementById("btn-comprobar-tabla").addEventListener("click", comprobar);
  construirTabla(actual);
  Motor.repintar();

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-preset]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      actual = parseInt(b.getAttribute("data-preset"), 10);
      construirTabla(actual);
      Motor.reiniciar(actual);
    });
  });
})();
