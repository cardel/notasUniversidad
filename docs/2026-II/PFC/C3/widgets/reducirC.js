/* ReducirC: el ejercicio de consolidación. Se llena, de abajo hacia
   arriba, lo que devuelve cada llamada pendiente, y luego se ve la
   ejecución. Los valores (24, 84 y 0) salen de correr reducirC con
   scala-cli. */
(function () {
  var CODIGO = [
    { txt: "def reducirC(op: (Int, Int) => Int)(inicio: Int)", num: null },
    { txt: "            (f: Int => Int, prox: Int => Int)", num: null },
    { txt: "            (a: Int, b: Int): Int =", num: null },
    { txt: "  if (a > b) inicio", num: 1 },
    { txt: "  else op(f(a), reducirC(op)(inicio)(f, prox)(prox(a), b))", num: 2 }
  ];

  var PRESETS = [
    { rotulo: "reducirC((x, y) => x * y)(1)(x => x, x => x + 1)(1, 4)", opTxt: "x * y", inicio: 1, a: 1, b: 4, fTxt: "x", proxTxt: "x + 1",
      op: function (x, y) { return x * y; }, f: function (x) { return x; }, prox: function (x) { return x + 1; }, valor: 24 },
    { rotulo: "reducirC((x, y) => x + y)(0)(x => x * x, x => x + 2)(1, 7)", opTxt: "x + y", inicio: 0, a: 1, b: 7, fTxt: "x * x", proxTxt: "x + 2",
      op: function (x, y) { return x + y; }, f: function (x) { return x * x; }, prox: function (x) { return x + 2; }, valor: 84 }
  ];

  /* Filas de arriba hacia abajo; devuelve se calcula de abajo hacia arriba. */
  function filas(p) {
    var F = [], a = p.a, i;
    while (a <= p.b) { F.push({ a: a, fa: p.f(a), base: false }); a = p.prox(a); }
    F.push({ a: a, fa: null, base: true, devuelve: p.inicio });
    for (i = F.length - 2; i >= 0; i = i - 1) { F[i].devuelve = p.op(F[i].fa, F[i + 1].devuelve); }
    return F;
  }

  function simular(idx) {
    var p = PRESETS[idx], F = filas(p), pasos = [], i;
    for (i = 0; i < F.length; i = i + 1) {
      pasos.push({ linea: F[i].base ? 1 : 2, a: F[i].a, fa: F[i].base ? "–" : F[i].fa, devuelve: F[i].base ? F[i].devuelve : null, fila: i, fase: F[i].base ? "base" : "baja" });
    }
    for (i = F.length - 2; i >= 0; i = i - 1) {
      pasos.push({ linea: null, a: F[i].a, fa: F[i].fa, devuelve: F[i].devuelve, fila: i, fase: "sube" });
    }
    return pasos;
  }

  var API = { PRESETS: PRESETS, filas: filas, simular: simular, CODIGO: CODIGO };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var actual = 0;

  function construirTabla(idx) {
    var p = PRESETS[idx], F = filas(p);
    var cuerpo = document.getElementById("cuerpo-tabla");
    cuerpo.innerHTML = "";
    document.getElementById("cab-f").textContent = "f(a) = " + p.fTxt;
    document.getElementById("cab-dev").textContent = "devuelve = op(f(a), lo de abajo), op = " + p.opTxt;
    F.forEach(function (f, i) {
      var tr = document.createElement("tr");
      tr.id = "fila-" + i;
      var c1 = document.createElement("td"); c1.textContent = f.a; tr.appendChild(c1);
      var c2 = document.createElement("td"); c2.textContent = f.base ? "–" : f.fa; tr.appendChild(c2);
      var c3 = document.createElement("td");
      if (f.base) {
        c3.textContent = f.devuelve; c3.className = "dada";
      } else {
        var inp = document.createElement("input");
        inp.type = "number"; inp.id = "dev-" + i; inp.placeholder = "?";
        c3.appendChild(inp);
        var real = document.createElement("span"); real.className = "real"; real.id = "real-" + i;
        c3.appendChild(real);
      }
      tr.appendChild(c3);
      var c4 = document.createElement("td"); c4.className = "que";
      c4.textContent = f.base ? f.a + " > " + p.b + ": devuelve inicio" : "op(" + f.fa + ", lo que devuelva la fila de abajo)";
      tr.appendChild(c4);
      cuerpo.appendChild(tr);
    });
    var ver = document.getElementById("veredicto-tabla");
    ver.className = "veredicto"; ver.textContent = "";
  }

  document.getElementById("btn-comprobar-tabla").addEventListener("click", function () {
    var p = PRESETS[actual], F = filas(p), malas = 0, vacias = 0;
    F.forEach(function (f, i) {
      if (f.base) { return; }
      var inp = document.getElementById("dev-" + i);
      var v = parseInt(inp.value, 10);
      if (isNaN(v)) { vacias = vacias + 1; inp.className = ""; return; }
      inp.className = v === f.devuelve ? "bien" : "mal";
      if (v !== f.devuelve) { malas = malas + 1; }
    });
    var ver = document.getElementById("veredicto-tabla");
    if (vacias > 0) { ver.className = "veredicto mal"; ver.textContent = "Faltan " + vacias + " casillas."; return; }
    if (malas === 0) {
      ver.className = "veredicto bien";
      ver.textContent = "Correcto. La primera fila devuelve " + p.valor + ": cada llamada combina su f(a) con lo que devolvió la de abajo, y la de abajo del todo devuelve inicio.";
    } else {
      ver.className = "veredicto mal";
      ver.textContent = malas + " en rojo. Se llena de abajo hacia arriba: la última fila devuelve inicio, y cada una de arriba es op(su f(a), lo de la fila de abajo).";
    }
  });

  document.getElementById("btn-inicio-cero").addEventListener("click", function () {
    var v = document.getElementById("ver-inicio-cero");
    var valor = parseInt(document.getElementById("pred-inicio-cero").value, 10);
    if (isNaN(valor)) { v.className = "veredicto mal"; v.textContent = "Escriba un número primero."; return; }
    if (valor === 0) {
      v.className = "veredicto bien";
      v.textContent = "Correcto: 0. La última llamada devuelve 0, la de arriba hace 4 · 0 = 0, y así hasta la primera. inicio tiene que ser el neutro de op: 1 para el producto, 0 para la suma.";
      document.getElementById("carta-cierre").classList.remove("bloqueado");
    } else {
      v.className = "veredicto mal";
      v.textContent = "No es " + valor + ". Llene la tabla otra vez con 0 en la última fila y mire qué pasa al multiplicar hacia arriba.";
    }
  });

  function pintar(e) {
    var p = PRESETS[e.params], F = filas(p);
    F.forEach(function (f, i) {
      var tr = document.getElementById("fila-" + i);
      if (!tr) { return; }
      tr.classList.toggle("actual", e.actual && e.actual.fila === i);
      var real = document.getElementById("real-" + i);
      if (real) { real.textContent = (e.actual && e.actual.fase === "sube" && e.actual.fila <= i) || e.terminado ? "= " + f.devuelve : ""; }
    });
    var pie = document.getElementById("pie-tabla");
    if (!e.actual) { pie.textContent = ""; }
    else if (e.actual.fase === "baja") { pie.textContent = "Llamada con a = " + e.actual.a + ": f(a) = " + e.actual.fa + " queda esperando a lo que devuelva la siguiente."; }
    else if (e.actual.fase === "base") { pie.textContent = "a = " + e.actual.a + " > " + p.b + ": devuelve inicio = " + e.actual.devuelve + ". Empieza la subida."; }
    else { pie.textContent = "Sube: op(" + e.actual.fa + ", lo de abajo) = " + e.actual.devuelve + "."; }
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: 0,
    chips: [
      { campo: "a", rotulo: "a" },
      { campo: "fa", rotulo: "f(a)" },
      { campo: "devuelve", rotulo: "devuelve", clase: "alerta" }
    ],
    simular: simular,
    alPintar: pintar
  });
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
