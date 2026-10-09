/* mcdEnMemoria: cuántas veces corre mcd en cada variante de Racional.
   El estudiante llena la tabla de memoria y después corre
   val r = new Racional(66, 42); r.numer; r.numer; r.denom
   sobre las cuatro variantes, con los contadores por línea.
   El código es el de los frames "Variantes de diseño: def vs val",
   "Racionales con simplificación automática" y "¿Qué es un método?". */
(function () {
  var X = 66, Y = 42;

  /* Las cuatro variantes en un solo panel; cada línea numerada lleva su
     contador. El campo v dice a qué variante pertenece la línea. */
  var CODIGO = [
    { txt: "// Opción A: calcular cada vez", num: null, v: "A", bloque: 1 },
    { txt: "class Racional(x: Int, y: Int) {", num: null, v: "A", bloque: 1 },
    { txt: "  private def mcd(a: Int, b: Int): Int =", num: 1, v: "A", bloque: 1 },
    { txt: "    if (b == 0) a", num: 2, v: "A", bloque: 1 },
    { txt: "    else mcd(b, a % b)", num: 3, v: "A", bloque: 1 },
    { txt: " ", num: null, v: "A", bloque: 1 },
    { txt: "  def numer = x / mcd(x, y)", num: 4, v: "A", bloque: 1 },
    { txt: "  def denom = y / mcd(x, y)", num: 5, v: "A", bloque: 1 },
    { txt: "}", num: null, v: "A", bloque: 1 },
    { txt: " ", num: null, v: null },

    { txt: "// Opción B: pre-calcular", num: null, v: "B", bloque: 2 },
    { txt: "class Racional(x: Int, y: Int) {", num: null, v: "B", bloque: 2 },
    { txt: "  private def mcd(a: Int, b: Int): Int =", num: 6, v: "B", bloque: 2 },
    { txt: "    if (b == 0) a", num: 7, v: "B", bloque: 2 },
    { txt: "    else mcd(b, a % b)", num: 8, v: "B", bloque: 2 },
    { txt: " ", num: null, v: "B", bloque: 2 },
    { txt: "  val numer = x / mcd(x, y)", num: 9, v: "B", bloque: 2 },
    { txt: "  val denom = y / mcd(x, y)", num: 10, v: "B", bloque: 2 },
    { txt: "}", num: null, v: "B", bloque: 2 },
    { txt: " ", num: null, v: null },

    { txt: "// Con private val m", num: null, v: "M", bloque: 3 },
    { txt: "class Racional(x: Int, y: Int) {", num: null, v: "M", bloque: 3 },
    { txt: "  private def mcd(a: Int, b: Int): Int =", num: 11, v: "M", bloque: 3 },
    { txt: "    if (b == 0) a", num: 12, v: "M", bloque: 3 },
    { txt: "    else mcd(b, a % b)", num: 13, v: "M", bloque: 3 },
    { txt: " ", num: null, v: "M", bloque: 3 },
    { txt: "  private val m = mcd(x, y)", num: 14, v: "M", bloque: 3 },
    { txt: " ", num: null, v: "M", bloque: 3 },
    { txt: "  def numer = x / m", num: 15, v: "M", bloque: 3 },
    { txt: "  def denom = y / m", num: 16, v: "M", bloque: 3 },
    { txt: "}", num: null, v: "M", bloque: 3 },
    { txt: " ", num: null, v: null },

    { txt: "// Sin simplificación", num: null, v: "S" },
    { txt: "class Racional(x: Int, y: Int) {", num: null, v: "S" },
    { txt: "  def numer = x", num: 17, v: "S" },
    { txt: "  def denom = y", num: 18, v: "S" },
    { txt: "}", num: null, v: "S" }
  ];

  var VARIANTES = [
    { id: "A", rotulo: "Opción A: calcular cada vez", clave: "def numer = x / mcd(x, y)",
      simplifica: true, lineas: { def: 1, si: 2, sino: 3, numer: 4, denom: 5 } },
    { id: "B", rotulo: "Opción B: pre-calcular", clave: "val numer = x / mcd(x, y)",
      simplifica: true, lineas: { def: 6, si: 7, sino: 8, numer: 9, denom: 10 } },
    { id: "M", rotulo: "Con private val m", clave: "private val m = mcd(x, y)",
      simplifica: true, lineas: { def: 11, si: 12, sino: 13, m: 14, numer: 15, denom: 16 } },
    { id: "S", rotulo: "Sin simplificación", clave: "def numer = x",
      simplifica: false, lineas: { numer: 17, denom: 18 } }
  ];

  var LECTURAS = [
    { txt: "r.numer", campo: "numer" },
    { txt: "r.numer", campo: "numer" },
    { txt: "r.denom", campo: "denom" }
  ];

  /* Un marco por llamada a mcd; el último es el que entra con b = 0. */
  function marcosMcd(a, b) {
    if (b === 0) { return [{ a: a, b: b }]; }
    return [{ a: a, b: b }].concat(marcosMcd(b, a % b));
  }

  function mcdDe(a, b) {
    var marcos = marcosMcd(a, b);
    return marcos[marcos.length - 1].a;
  }

  function nuevoEstado() {
    return { mcd: 0, constr: 0, sel: 0 };
  }

  function paso(est, linea, fase, llamada, valor, detalle) {
    return {
      linea: linea, fase: fase, llamada: llamada, valor: valor, detalle: detalle,
      mcd: est.mcd, mcdConstr: est.constr, mcdSel: est.sel
    };
  }

  /* Los pasos de una cadena completa de mcd: entrada, condición y, cuando
     b no es 0, la llamada de vuelta. */
  function pasosMcd(v, a, b, est, fase) {
    var marcos = marcosMcd(a, b), pasos = [], i, f, q;
    for (i = 0; i < marcos.length; i = i + 1) {
      f = marcos[i];
      est.mcd = est.mcd + 1;
      if (fase === "construcción") { est.constr = est.constr + 1; } else { est.sel = est.sel + 1; }
      q = "mcd(" + f.a + ", " + f.b + ")";
      pasos.push(paso(est, v.lineas.def, fase, q, "–",
        "Llamada " + est.mcd + " a mcd, con a = " + f.a + " y b = " + f.b + "."));
      pasos.push(paso(est, v.lineas.si, fase, q, "–",
        f.b === 0
          ? "b llegó a 0: mcd devuelve a = " + f.a + "."
          : "b = " + f.b + " no es 0, así que falta por lo menos una llamada más."));
      if (f.b !== 0) {
        pasos.push(paso(est, v.lineas.sino, fase, q, "–",
          "Entra de nuevo con a = " + f.b + " y b = " + f.a + " % " + f.b + " = " + (f.a % f.b) + "."));
      }
    }
    return pasos;
  }

  function valorDe(v, campo) {
    if (!v.simplifica) { return campo === "numer" ? X : Y; }
    var m = mcdDe(X, Y);
    return campo === "numer" ? X / m : Y / m;
  }

  function lineaDe(v, campo) {
    return campo === "numer" ? v.lineas.numer : v.lineas.denom;
  }

  function expresionDe(campo) {
    return campo === "numer" ? "x / mcd(x, y)" : "y / mcd(x, y)";
  }

  /* val r = new Racional(66, 42); r.numer; r.numer; r.denom */
  function simular(idx) {
    var v = VARIANTES[idx], est = nuevoEstado(), pasos = [], m;

    if (v.id === "A") {
      pasos.push(paso(est, -1, "construcción", "new Racional(66, 42)", "–",
        "El constructor guarda x = 66 y y = 42. Con def, el cuerpo de numer y denom no se ha evaluado."));
      LECTURAS.forEach(function (l) {
        pasos.push(paso(est, lineaDe(v, l.campo), "lectura", l.txt, "–",
          l.txt + " evalúa " + expresionDe(l.campo) + ", y la cadena de mcd arranca otra vez desde 66 y 42."));
        pasos = pasos.concat(pasosMcd(v, X, Y, est, "lectura"));
        pasos.push(paso(est, -1, "lectura", l.txt, valorDe(v, l.campo),
          l.txt + " devuelve " + valorDe(v, l.campo) + " y el mcd calculado se descarta."));
      });
    } else if (v.id === "B") {
      pasos.push(paso(est, v.lineas.numer, "construcción", "val numer", "–",
        "Al construir el objeto se evalúa el lado derecho de val numer."));
      pasos = pasos.concat(pasosMcd(v, X, Y, est, "construcción"));
      pasos.push(paso(est, -1, "construcción", "val numer", valorDe(v, "numer"),
        "numer queda guardado en " + valorDe(v, "numer") + "."));
      pasos.push(paso(est, v.lineas.denom, "construcción", "val denom", "–",
        "El segundo val repite la cadena entera: cada uno llama a mcd por su cuenta."));
      pasos = pasos.concat(pasosMcd(v, X, Y, est, "construcción"));
      pasos.push(paso(est, -1, "construcción", "val denom", valorDe(v, "denom"),
        "denom queda guardado en " + valorDe(v, "denom") + "."));
      LECTURAS.forEach(function (l) {
        pasos.push(paso(est, -1, "lectura", l.txt, valorDe(v, l.campo),
          l.txt + " lee el campo ya calculado: devuelve " + valorDe(v, l.campo) + " sin llamar a mcd."));
      });
    } else if (v.id === "M") {
      m = mcdDe(X, Y);
      pasos.push(paso(est, v.lineas.m, "construcción", "val m", "–",
        "private val m se evalúa una vez, al construir el objeto."));
      pasos = pasos.concat(pasosMcd(v, X, Y, est, "construcción"));
      pasos.push(paso(est, -1, "construcción", "val m", m,
        "m queda en " + m + ", y ese valor sirve para numer y para denom."));
      LECTURAS.forEach(function (l) {
        pasos.push(paso(est, lineaDe(v, l.campo), "lectura", l.txt, valorDe(v, l.campo),
          l.txt + " divide por m, que ya está calculado: una división y nada más."));
      });
    } else {
      pasos.push(paso(est, -1, "construcción", "new Racional(66, 42)", "–",
        "Esta clase no tiene mcd: el constructor guarda 66 y 42 como llegaron."));
      LECTURAS.forEach(function (l) {
        pasos.push(paso(est, lineaDe(v, l.campo), "lectura", l.txt, valorDe(v, l.campo),
          l.txt + " devuelve " + valorDe(v, l.campo) + ", el valor sin reducir."));
      });
    }
    return pasos;
  }

  /* La fila de la tabla que corresponde a la variante, leída del último paso. */
  function fila(idx) {
    var pasos = simular(idx), ult = pasos[pasos.length - 1], v = VARIANTES[idx];
    return {
      construccion: ult.mcdConstr,
      selectoras: ult.mcdSel,
      total: ult.mcd,
      numer: valorDe(v, "numer")
    };
  }

  var COLUMNAS = [
    { campo: "construccion", id: "c" },
    { campo: "selectoras", id: "s" },
    { campo: "total", id: "t" },
    { campo: "numer", id: "n" }
  ];

  var API = {
    X: X, Y: Y, CODIGO: CODIGO, VARIANTES: VARIANTES, LECTURAS: LECTURAS,
    marcosMcd: marcosMcd, mcdDe: mcdDe, simular: simular, fila: fila
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var actual = 0;
  var resuelta = false;

  function construirTabla() {
    var cuerpo = document.getElementById("cuerpo-tabla");
    cuerpo.innerHTML = "";
    VARIANTES.forEach(function (v, i) {
      var tr = document.createElement("tr");
      tr.id = "fila-" + i;
      var td = document.createElement("td");
      td.className = "variante";
      var b = document.createElement("b");
      b.textContent = v.rotulo;
      td.appendChild(b);
      td.appendChild(document.createElement("br"));
      var code = document.createElement("code");
      code.textContent = v.clave;
      td.appendChild(code);
      tr.appendChild(td);
      COLUMNAS.forEach(function (c) {
        var celda = document.createElement("td");
        var inp = document.createElement("input");
        inp.type = "number";
        inp.id = c.id + "-" + i;
        inp.placeholder = "?";
        celda.appendChild(inp);
        var real = document.createElement("span");
        real.className = "real";
        real.id = "real-" + c.id + "-" + i;
        celda.appendChild(real);
        tr.appendChild(celda);
      });
      cuerpo.appendChild(tr);
    });
  }

  function comprobar() {
    var malas = 0, vacias = 0;
    VARIANTES.forEach(function (v, i) {
      var esperado = fila(i);
      COLUMNAS.forEach(function (c) {
        var inp = document.getElementById(c.id + "-" + i);
        var valor = parseInt(inp.value, 10);
        if (isNaN(valor)) {
          vacias = vacias + 1;
          inp.className = "";
          return;
        }
        inp.className = valor === esperado[c.campo] ? "bien" : "mal";
        if (valor !== esperado[c.campo]) { malas = malas + 1; }
      });
    });
    var ver = document.getElementById("veredicto-tabla");
    if (vacias > 0) {
      ver.className = "veredicto mal";
      ver.textContent = vacias === 1
        ? "Falta una casilla por llenar."
        : "Faltan " + vacias + " casillas por llenar.";
      return;
    }
    if (malas === 0) {
      resuelta = true;
      ver.className = "veredicto bien";
      ver.textContent = "Correcto: 15, 10, 5 y 0. La cadena de mcd siempre mide 5 llamadas; " +
        "lo que cambia es cuántas veces arranca.";
      document.getElementById("carta-cierre").classList.remove("bloqueado");
    } else {
      ver.className = "veredicto mal";
      ver.textContent = (malas === 1 ? "Una casilla en rojo. " : malas + " casillas en rojo. ") +
        "Dos preguntas por fila: ¿el lado derecho se evalúa al construir el objeto o en cada " +
        "lectura?, y ¿cuántos lados derechos llaman a mcd?";
    }
  }

  function revelar(i) {
    var esperado = fila(i);
    COLUMNAS.forEach(function (c) {
      var real = document.getElementById("real-" + c.id + "-" + i);
      if (real) { real.textContent = "= " + esperado[c.campo]; }
    });
  }

  function pintar(e) {
    var v = VARIANTES[e.params];
    CODIGO.forEach(function (l, idx) {
      var div = document.getElementById("linea-" + idx);
      if (!div) { return; }
      div.classList.toggle("apagado", l.v !== null && l.v !== v.id);
    });
    VARIANTES.forEach(function (otra, i) {
      var tr = document.getElementById("fila-" + i);
      if (tr) { tr.classList.toggle("sel", i === e.params); }
    });
    if (e.terminado) { revelar(e.params); }

    var pie = document.getElementById("pie");
    if (!e.actual) {
      pie.textContent = v.rotulo + ": val r = new Racional(66, 42) todavía no ha corrido.";
    } else {
      pie.textContent = e.actual.detalle + "  [" + e.actual.fase + "; mcd al construir: " +
        e.actual.mcdConstr + ", en las lecturas: " + e.actual.mcdSel + "]";
    }
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: 0,
    chips: [
      { campo: "llamada", rotulo: "evaluando" },
      { campo: "mcd", rotulo: "mcd corridos", clase: "cuenta" },
      { campo: "valor", rotulo: "devuelve" }
    ],
    simular: simular,
    alPintar: pintar
  });

  construirTabla();
  document.getElementById("btn-comprobar-tabla").addEventListener("click", comprobar);
  Motor.repintar();

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-preset]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      actual = parseInt(b.getAttribute("data-preset"), 10);
      Motor.reiniciar(actual);
      if (resuelta) { revelar(actual); }
    });
  });
})();
