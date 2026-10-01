/* Operadores como métodos: las siete líneas del demo de
   04_racional_operadores.scala, primero predichas y después ejecutadas.
   Cada paso dice qué método entró, con qué this y con qué r; numer y denom
   de r1 y r2 se repintan en cada paso y no se mueven. */
(function () {
  var LN = { suma: 1, resta: 2, mult: 3, div: 4, igual: 5, menor: 6, max: 7 };

  var CODIGO = [
    { txt: "class Racional(x: Int, y: Int) {", num: null },
    { txt: '  require(y > 0, "El denominador debe ser positivo")', num: null },
    { txt: " ", num: null },
    { txt: "  private def mcd(a: Int, b: Int): Int =", num: null },
    { txt: "    if (b == 0) a else mcd(b, a % b)", num: null },
    { txt: " ", num: null },
    { txt: "  private val m = mcd(math.abs(x), y)", num: null },
    { txt: " ", num: null },
    { txt: "  def numer: Int = x / m", num: null },
    { txt: "  def denom: Int = y / m", num: null },
    { txt: " ", num: null },
    { txt: "  def +(r: Racional): Racional =", num: LN.suma, bloque: 1 },
    { txt: "    new Racional(", num: null, bloque: 1 },
    { txt: "      numer * r.denom + denom * r.numer,", num: null, bloque: 1 },
    { txt: "      denom * r.denom", num: null, bloque: 1 },
    { txt: "    )", num: null, bloque: 1 },
    { txt: " ", num: null },
    { txt: "  def -(r: Racional): Racional =", num: LN.resta, bloque: 1 },
    { txt: "    new Racional(", num: null, bloque: 1 },
    { txt: "      numer * r.denom - denom * r.numer,", num: null, bloque: 1 },
    { txt: "      denom * r.denom", num: null, bloque: 1 },
    { txt: "    )", num: null, bloque: 1 },
    { txt: " ", num: null },
    { txt: "  def *(r: Racional): Racional =", num: LN.mult, bloque: 1 },
    { txt: "    new Racional(numer * r.numer, denom * r.denom)", num: null, bloque: 1 },
    { txt: " ", num: null },
    { txt: "  def /(r: Racional): Racional =", num: LN.div, bloque: 1 },
    { txt: "    new Racional(numer * r.denom, denom * r.numer)", num: null, bloque: 1 },
    { txt: " ", num: null },
    { txt: "  def ==(r: Racional): Boolean =", num: LN.igual, bloque: 2 },
    { txt: "    numer * r.denom == denom * r.numer", num: null, bloque: 2 },
    { txt: " ", num: null },
    { txt: "  def <(r: Racional): Boolean =", num: LN.menor, bloque: 2 },
    { txt: "    numer * r.denom < denom * r.numer", num: null, bloque: 2 },
    { txt: " ", num: null },
    { txt: "  def max(r: Racional): Racional =", num: LN.max, bloque: 3 },
    { txt: "    if (this < r) r else this", num: null, bloque: 3 },
    { txt: " ", num: null },
    { txt: '  override def toString: String = numer + "/" + denom', num: null },
    { txt: "}", num: null }
  ];

  /* El constructor de la clase: mcd una sola vez, numer y denom ya divididos. */
  function mcd(a, b) {
    return b === 0 ? a : mcd(b, a % b);
  }

  function racional(x, y) {
    if (!(y > 0)) { throw new Error("El denominador debe ser positivo"); }
    var m = mcd(Math.abs(x), y);
    return { numer: x / m, denom: y / m };
  }

  function texto(r) { return r.numer + "/" + r.denom; }

  function suma(a, b) {
    return racional(a.numer * b.denom + a.denom * b.numer, a.denom * b.denom);
  }
  function resta(a, b) {
    return racional(a.numer * b.denom - a.denom * b.numer, a.denom * b.denom);
  }
  function mult(a, b) {
    return racional(a.numer * b.numer, a.denom * b.denom);
  }
  function divide(a, b) {
    return racional(a.numer * b.denom, a.denom * b.numer);
  }
  function igual(a, b) { return a.numer * b.denom === a.denom * b.numer; }
  function menor(a, b) { return a.numer * b.denom < a.denom * b.numer; }
  function maximo(a, b) { return menor(a, b) ? b : a; }

  var R1 = racional(1, 2);
  var R2 = racional(2, 3);

  var DEMOS = [
    { txt: "r1 + r2", tipo: "racional" },
    { txt: "r1 * r2", tipo: "racional" },
    { txt: "r1 - r2", tipo: "racional" },
    { txt: "r1 == new Racional(2, 4)", tipo: "booleano" },
    { txt: "r1 < r2", tipo: "booleano" },
    { txt: "r1 max r2", tipo: "racional" },
    { txt: "r1 * r1 + r2 * r2", tipo: "racional" }
  ];

  function paso(linea, demo, nota, res, cierra) {
    return {
      linea: linea, demo: demo, nota: nota, res: res,
      r1: texto(R1), r2: texto(R2), cierra: cierra === true
    };
  }

  /* Un paso por invocación, en el orden en que Scala las hace. El valor de
     cada paso se calcula con los mismos métodos, no se escribe a mano. */
  function simular() {
    var p = [];
    var dosCuartos = racional(2, 4);

    p.push(paso(LN.suma, 0,
      "r1 + r2 es r1.+(r2): this es r1 y r es r2. El numerador sale de " +
      "numer * r.denom + denom * r.numer = 1 * 3 + 2 * 2 = 7 y el denominador " +
      "de denom * r.denom = 6.",
      texto(suma(R1, R2)), true));

    p.push(paso(LN.mult, 1,
      "numer * r.numer = 1 * 2 y denom * r.denom = 2 * 3. El constructor " +
      "divide los dos por mcd(2, 6) = 2 antes de guardarlos.",
      texto(mult(R1, R2)), true));

    p.push(paso(LN.resta, 2,
      "numer * r.denom - denom * r.numer = 1 * 3 - 2 * 2 = -1, sobre 6. " +
      "El signo se queda en el numerador: require pide denominador positivo.",
      texto(resta(R1, R2)), true));

    p.push(paso(null, 3,
      "Primero se construye el argumento. new Racional(2, 4) calcula " +
      "m = mcd(2, 4) = 2, de modo que numer es 1 y denom es 2: el objeto nace " +
      "como 1/2.",
      texto(dosCuartos), false));
    p.push(paso(LN.igual, 3,
      "numer * r.denom == denom * r.numer: 1 * 2 contra 2 * 1.",
      igual(R1, dosCuartos) ? "true" : "false", true));

    p.push(paso(LN.menor, 4,
      "numer * r.denom < denom * r.numer: 1 * 3 = 3 contra 2 * 2 = 4.",
      menor(R1, R2) ? "true" : "false", true));

    p.push(paso(LN.max, 5,
      "max se escribe entre los dos operandos igual que un símbolo: " +
      "r1 max r2 es r1.max(r2). Lo primero que hace adentro es preguntar this < r.",
      null, false));
    p.push(paso(LN.menor, 5,
      "La comparación de adentro: 1 * 3 = 3 contra 2 * 2 = 4, verdadero, " +
      "así que el if toma la rama r.",
      menor(R1, R2) ? "true" : "false", false));
    p.push(paso(null, 5,
      "Devuelve r, que es el mismo objeto r2. Aquí no hay new Racional: " +
      "max entrega uno de los dos que ya existían.",
      texto(maximo(R1, R2)), true));

    p.push(paso(LN.mult, 6,
      "El receptor de + se evalúa primero: r1 * r1 = 1/4.",
      texto(mult(R1, R1)), false));
    p.push(paso(LN.mult, 6,
      "Después el argumento: r2 * r2 = 4/9. Las dos multiplicaciones ya " +
      "ocurrieron y + todavía no ha entrado.",
      texto(mult(R2, R2)), false));
    p.push(paso(LN.suma, 6,
      "Ahora + recibe 1/4 y 4/9: 1 * 9 + 4 * 4 = 25 sobre 4 * 9 = 36.",
      texto(suma(mult(R1, R1), mult(R2, R2))), true));

    return p;
  }

  /* Lo que imprime cada línea: el valor del paso que la cierra. */
  function valores() {
    var v = [];
    simular().forEach(function (p) {
      if (p.cierra) { v[p.demo] = p.res; }
    });
    return v;
  }

  /* Acepta 14/12 por 7/6, 1/-6 por -1/6, 3 por 3/1, verdadero por true. */
  function normalizar(entrada) {
    var s = String(entrada === null || entrada === undefined ? "" : entrada)
      .replace(/\s+/g, "").toLowerCase();
    if (s === "") { return null; }
    if (s === "true" || s === "verdadero") { return "true"; }
    if (s === "false" || s === "falso") { return "false"; }
    var f = /^(-?\d+)\/(-?\d+)$/.exec(s);
    if (f) {
      var x = parseInt(f[1], 10);
      var y = parseInt(f[2], 10);
      if (y === 0) { return "?"; }
      if (y < 0) { x = -x; y = -y; }
      var g = mcd(Math.abs(x), y);
      if (g === 0) { g = 1; }
      return (x / g) + "/" + (y / g);
    }
    var e = /^(-?\d+)$/.exec(s);
    if (e) { return parseInt(e[1], 10) + "/1"; }
    return "?";
  }

  var PISTAS = [
    {
      "7/5": "El numerador quedó bien. Los denominadores no se suman: " +
        "denom * r.denom = 2 * 3 = 6.",
      "3/5": "Numerador con numerador y denominador con denominador no suma " +
        "fracciones. El método lleva las dos a denominador 6: 1 * 3 + 2 * 2 = 7.",
      general: "numer * r.denom + denom * r.numer sobre denom * r.denom, " +
        "con this = 1/2 y r = 2/3."
    },
    {
      general: "numer * r.numer = 1 * 2 y denom * r.denom = 2 * 3; el " +
        "constructor divide por mcd(2, 6) = 2."
    },
    {
      "1/6": "El orden de la resta es numer * r.denom - denom * r.numer, " +
        "o sea 1 * 3 - 2 * 2 = -1.",
      general: "1 * 3 - 2 * 2 = -1 sobre 2 * 3 = 6."
    },
    {
      "false": "new Racional(2, 4) no guarda 2 y 4: m = mcd(2, 4) = 2, y el " +
        "objeto nace con numer 1 y denom 2. == compara 1 * 2 con 2 * 1.",
      general: "La línea compara dos racionales: true o false."
    },
    {
      "false": "numer * r.denom < denom * r.numer es 1 * 3 < 2 * 2, " +
        "es decir 3 < 4.",
      general: "La línea compara dos racionales: true o false."
    },
    {
      "1/2": "max devuelve r cuando this < r. Como 1/2 < 2/3 es verdadero, " +
        "sale r2.",
      general: "max compara con < y devuelve uno de los dos objetos; " +
        "no construye ninguno."
    },
    {
      "11/18": "Eso sale de leer de izquierda a derecha: " +
        "((r1 * r1) + r2) * r2 = 11/12 por 2/3. El símbolo * se agrupa antes " +
        "que +, así que + recibe 1/4 y 4/9.",
      "11/12": "Ese es (r1 * r1) + r2. Al segundo r2 le falta multiplicar a " +
        "r2, no al resultado de la suma.",
      general: "Las dos multiplicaciones van primero, 1/4 y 4/9; después + " +
        "las junta: 1 * 9 + 4 * 4 = 25 sobre 36."
    }
  ];

  function revisar(i, entrada) {
    var esperado = valores()[i];
    var dado = normalizar(entrada);
    if (dado === null) { return { estado: "vacio", msg: "" }; }
    if (dado === esperado) { return { estado: "bien", msg: "" }; }
    var tabla = PISTAS[i] || {};
    return { estado: "mal", msg: tabla[dado] || tabla.general || "" };
  }

  var API = {
    mcd: mcd, racional: racional, texto: texto,
    suma: suma, resta: resta, mult: mult, divide: divide,
    igual: igual, menor: menor, maximo: maximo,
    R1: R1, R2: R2, DEMOS: DEMOS, CODIGO: CODIGO, LN: LN,
    simular: simular, valores: valores,
    normalizar: normalizar, revisar: revisar
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function construirTabla() {
    var cuerpo = document.getElementById("cuerpo-predicciones");
    cuerpo.innerHTML = "";
    DEMOS.forEach(function (d, i) {
      var tr = document.createElement("tr");
      tr.id = "fila-" + i;

      var expr = document.createElement("td");
      expr.className = "expr";
      expr.textContent = "println(" + d.txt + ")";
      tr.appendChild(expr);

      var celdaEntrada = document.createElement("td");
      var inp = document.createElement("input");
      inp.type = "text";
      inp.id = "pred-" + i;
      inp.placeholder = d.tipo === "racional" ? "a/b" : "true o false";
      celdaEntrada.appendChild(inp);
      tr.appendChild(celdaEntrada);

      var real = document.createElement("td");
      real.className = "real";
      real.id = "real-" + i;
      tr.appendChild(real);

      var nota = document.createElement("td");
      nota.className = "pista";
      nota.id = "pista-" + i;
      tr.appendChild(nota);

      cuerpo.appendChild(tr);
    });
  }

  function comprobar() {
    var malas = 0;
    var vacias = 0;
    DEMOS.forEach(function (d, i) {
      var inp = document.getElementById("pred-" + i);
      var pista = document.getElementById("pista-" + i);
      var r = revisar(i, inp.value);
      if (r.estado === "vacio") {
        inp.className = "";
        pista.textContent = "";
        vacias = vacias + 1;
      } else if (r.estado === "bien") {
        inp.className = "bien";
        pista.textContent = "";
      } else {
        inp.className = "mal";
        pista.textContent = r.msg;
        malas = malas + 1;
      }
    });
    var v = document.getElementById("veredicto");
    if (vacias > 0) {
      v.className = "veredicto mal";
      v.textContent = "Faltan " + vacias + " de las siete.";
    } else if (malas === 0) {
      v.className = "veredicto bien";
      v.textContent = "Las siete. Queda por ver el orden en que entran los " +
        "métodos en la última línea: eso lo muestra el paso a paso.";
    } else {
      v.className = "veredicto mal";
      v.textContent = malas + " en rojo, con la nota al lado de cada una.";
    }
  }

  function acercarLinea(linea) {
    if (linea === null || linea === undefined) { return; }
    var idx = -1;
    CODIGO.forEach(function (l, i) { if (l.num === linea) { idx = i; } });
    if (idx < 0) { return; }
    var panel = document.getElementById("panel-codigo");
    var el = document.getElementById("linea-" + idx);
    if (!panel || !el) { return; }
    panel.scrollTop = el.offsetTop - panel.clientHeight / 2;
  }

  function pintar(e) {
    var vals = valores();
    var revelado = {};
    var m;
    for (m = 0; m < e.k; m = m + 1) {
      if (e.pasos[m].cierra) { revelado[e.pasos[m].demo] = true; }
    }
    DEMOS.forEach(function (d, i) {
      var fila = document.getElementById("fila-" + i);
      var real = document.getElementById("real-" + i);
      if (!fila || !real) { return; }
      fila.className = e.actual && e.actual.demo === i ? "actual" : "";
      real.textContent = revelado[i] ? vals[i] : "";
    });

    var chip1 = document.getElementById("chip-r1");
    var chip2 = document.getElementById("chip-r2");
    if (chip1) { chip1.textContent = texto(R1); }
    if (chip2) { chip2.textContent = texto(R2); }

    var pie = document.getElementById("pie");
    if (pie && !e.actual) {
      pie.textContent = "Doce pasos para las siete líneas: cuatro llaman a un " +
        "solo método y tres llaman a varios.";
    } else if (pie) {
      pie.textContent = "println(" + DEMOS[e.actual.demo].txt + "): " + e.actual.nota;
    }

    if (e.actual) { acercarLinea(e.actual.linea); }
    if (e.terminado) {
      document.getElementById("carta-tres").classList.remove("bloqueado");
    }
  }

  function cablearOpciones(attr, idVeredicto, textoOk, idSiguiente) {
    var botones = document.querySelectorAll("[" + attr + "]");
    Array.prototype.forEach.call(botones, function (b) {
      b.addEventListener("click", function () {
        var v = document.getElementById(idVeredicto);
        Array.prototype.forEach.call(botones, function (o) { o.className = ""; });
        b.className = "primario";
        if (b.getAttribute(attr) === "ok") {
          v.className = "veredicto bien";
          v.textContent = textoOk;
          document.getElementById(idSiguiente).classList.remove("bloqueado");
        } else {
          v.className = "veredicto mal";
          v.textContent = b.getAttribute("data-msg");
        }
      });
    });
  }

  construirTabla();

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: null,
    chips: [
      { campo: "r1", rotulo: "r1" },
      { campo: "r2", rotulo: "r2" },
      { campo: "res", rotulo: "devuelve", clase: "cuenta" }
    ],
    simular: simular,
    alPintar: pintar
  });

  document.getElementById("btn-comprobar").addEventListener("click", comprobar);

  cablearOpciones("data-q1", "veredicto-tres",
    "r1 llega como this, r2 como r, y lo único que hace + es construir un " +
    "Racional nuevo con numer * r.denom + denom * r.numer sobre denom * r.denom. " +
    "Los chips repitieron 1/2 y 2/3 en los doce pasos.",
    "carta-cuatro");

  cablearOpciones("data-q2", "veredicto-cuatro",
    "* se agrupa antes que +, y la precedencia la fija el primer carácter del " +
    "nombre del método. En la corrida * entra dos veces y después + una sola, " +
    "con 1/4 y 4/9: 1 * 9 + 4 * 4 = 25 sobre 36.",
    "carta-cierre");
})();
