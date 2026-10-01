/* ExternasVsMetodos: la misma suma de racionales recorrida dos veces. En
   sumaRacional los operandos son los parámetros r y s; en suma el primero es
   el receptor, y numer y denom sin calificar son this.numer y this.denom. El
   código es el de 01_racional_funciones_externas.scala y
   02_racional_metodos.scala; la traza de x.suma(y) es la de seis pasos y
   x.suma(y).mult(z) cierra en 66/42. */
(function () {
  var CODIGO = [
    { txt: "// 01_racional_funciones_externas.scala", num: null },
    { txt: "def sumaRacional(r: Racional, s: Racional): Racional =", num: 1, bloque: 1 },
    { txt: "  new Racional(", num: 2, bloque: 1 },
    { txt: "    r.numer * s.denom + r.denom * s.numer,", num: 3, bloque: 1 },
    { txt: "    r.denom * s.denom", num: 4, bloque: 1 },
    { txt: "  )", num: null, bloque: 1 },
    { txt: " ", num: null },
    { txt: "def convertirEnCadena(r: Racional): String =", num: 5, bloque: 1 },
    { txt: "  r.numer.toString + \"/\" + r.denom.toString", num: 6, bloque: 1 },
    { txt: " ", num: null },
    { txt: "// 02_racional_metodos.scala", num: null },
    { txt: "class Racional(x: Int, y: Int) {", num: null, bloque: 2 },
    { txt: "  def numer = x", num: null, bloque: 2 },
    { txt: "  def denom = y", num: null, bloque: 2 },
    { txt: " ", num: null, bloque: 2 },
    { txt: "  def suma(r: Racional): Racional =", num: 7, bloque: 2 },
    { txt: "    new Racional(", num: 8, bloque: 2 },
    { txt: "      numer * r.denom + denom * r.numer,", num: 9, bloque: 2 },
    { txt: "      denom * r.denom", num: 10, bloque: 2 },
    { txt: "    )", num: null, bloque: 2 },
    { txt: " ", num: null, bloque: 2 },
    { txt: "  def mult(r: Racional): Racional =", num: 11, bloque: 2 },
    { txt: "    new Racional(numer * r.numer, denom * r.denom)", num: 12, bloque: 2 },
    { txt: " ", num: null, bloque: 2 },
    { txt: "  override def toString: String = numer + \"/\" + denom", num: 13, bloque: 2 },
    { txt: "}", num: null, bloque: 2 }
  ];

  /* Aritmética de racionales, sin reducir: es lo que hace el código. */
  function suma(a, b) { return { n: a.n * b.d + a.d * b.n, d: a.d * b.d }; }
  function mult(a, b) { return { n: a.n * b.n, d: a.d * b.d }; }
  function texto(r) { return r.n + "/" + r.d; }

  var L_EXT = { firma: 1, nuevo: 2, numerador: 3, denominador: 4 };
  var L_MET = { firma: 7, nuevo: 8, numerador: 9, denominador: 10 };

  var ETQ_EXT = {
    pri: "r", seg: "s", llamada: "sumaRacional(x, y)",
    entrada: "Los dos racionales entran como parámetros, r y s, y la clase solo guarda x e y. La función vive por fuera y no sabría a quién pertenecer.",
    origen: "r llegó como parámetro"
  };
  var ETQ_MET = {
    pri: "this", seg: "r", llamada: "x.suma(y)",
    entrada: "El receptor del mensaje es x y el argumento es y. Dentro del cuerpo, numer y denom sin calificar se entienden como this.numer y this.denom.",
    origen: "numer sin calificar es this.numer, el del receptor"
  };

  var PRESETS = [
    { rotulo: "sumaRacional(x, y) con x = 1/2, y = 2/3", version: "externa",
      x: { n: 1, d: 2 }, y: { n: 2, d: 3 } },
    { rotulo: "x.suma(y) con x = 1/3, y = 5/7", version: "metodos",
      x: { n: 1, d: 3 }, y: { n: 5, d: 7 } },
    { rotulo: "x.suma(y).mult(z) con z = 3/2", version: "metodos",
      x: { n: 1, d: 3 }, y: { n: 5, d: 7 }, z: { n: 3, d: 2 } }
  ];

  /* Los seis pasos de una suma: la entrada, los dos productos cruzados del
     numerador, su suma, el producto del denominador y la construcción. */
  function pasosSuma(a, b, etq, L) {
    var res = suma(a, b);
    var pri = etq.pri, seg = etq.seg;
    var p1 = a.n * b.d, p2 = a.d * b.n;
    var fijo = { primero: pri + " = " + texto(a), segundo: seg + " = " + texto(b) };

    function paso(linea, expr, estado, valor, nota) {
      return { linea: linea, expr: expr, estado: estado, valor: valor, nota: nota,
               primero: fijo.primero, segundo: fijo.segundo };
    }

    return [
      paso(L.firma, etq.llamada,
           pri + " = " + texto(a) + ", " + seg + " = " + texto(b), "–", etq.entrada),
      paso(L.numerador, pri + ".numer * " + seg + ".denom",
           a.n + " × " + b.d + " = " + p1, p1,
           etq.origen + ", y aporta " + a.n + "; " + seg + ".denom vale " + b.d +
           ", así que el producto es " + p1 + "."),
      paso(L.numerador, pri + ".denom * " + seg + ".numer",
           a.d + " × " + b.n + " = " + p2, p2,
           "El otro cruce va al revés: el denominador del primero por el numerador del segundo, " +
           a.d + " × " + b.n + " = " + p2 + "."),
      paso(L.numerador, "numerador del resultado",
           p1 + " + " + p2 + " = " + res.n, res.n,
           "El numerador es la suma de los dos cruces: " + p1 + " + " + p2 + " = " + res.n + "."),
      paso(L.denominador, pri + ".denom * " + seg + ".denom",
           a.d + " × " + b.d + " = " + res.d, res.d,
           "El denominador es el producto de los dos denominadores, " + a.d + " × " + b.d +
           " = " + res.d + "."),
      paso(L.nuevo, "new Racional(" + res.n + ", " + res.d + ")",
           texto(res), texto(res),
           "Se construye un racional nuevo, " + texto(res) + ". Ni " + texto(a) + " ni " +
           texto(b) + " cambiaron: la operación devuelve otro objeto.")
    ];
  }

  /* Cierre de la versión externa: la cadena se arma desde afuera. */
  function pasosCadena(res) {
    return [
      { linea: 5, expr: "convertirEnCadena(" + texto(res) + ")",
        estado: "r = " + texto(res), valor: "–",
        primero: "r = " + texto(res), segundo: "–",
        nota: "El racional recién construido vuelve a entrar como parámetro, ahora de la función que lo escribe." },
      { linea: 6, expr: "r.numer.toString + \"/\" + r.denom.toString",
        estado: "\"" + texto(res) + "\"", valor: texto(res),
        primero: "r = " + texto(res), segundo: "–",
        nota: "La cadena se arma desde afuera, pidiéndole a r sus dos campos uno por uno." }
    ];
  }

  /* Cierre de la versión con métodos: mult sobre el resultado de suma y el
     toString de la clase. */
  function pasosMult(a, b) {
    var res = mult(a, b);
    var fijo = { primero: "this = " + texto(a), segundo: "r = " + texto(b) };

    function paso(linea, expr, estado, valor, nota) {
      return { linea: linea, expr: expr, estado: estado, valor: valor, nota: nota,
               primero: fijo.primero, segundo: fijo.segundo };
    }

    return [
      paso(11, "(" + texto(a) + ").mult(z)",
           "this = " + texto(a) + ", r = " + texto(b), "–",
           "El receptor de mult es el racional que devolvió suma, y nunca recibió nombre: la llamada se encadena sobre el valor."),
      paso(12, "this.numer * r.numer",
           a.n + " × " + b.n + " = " + res.n, res.n,
           "mult no cruza nada: numerador por numerador, " + a.n + " × " + b.n + " = " + res.n + "."),
      paso(12, "this.denom * r.denom",
           a.d + " × " + b.d + " = " + res.d, res.d,
           "Y denominador por denominador, " + a.d + " × " + b.d + " = " + res.d + "."),
      paso(12, "new Racional(" + res.n + ", " + res.d + ")",
           texto(res), texto(res),
           texto(res) + " es el número correcto y no es su forma más simple: 11/7 vale lo mismo. Nada en la clase divide por el máximo común divisor."),
      paso(13, "numer + \"/\" + denom",
           "\"" + texto(res) + "\"", texto(res),
           "toString arma la cadena desde adentro, con los campos del propio objeto: el println imprime " + texto(res) + ".")
    ];
  }

  function simular(idx) {
    var p = PRESETS[idx];
    var externa = p.version === "externa";
    var pasos = pasosSuma(p.x, p.y, externa ? ETQ_EXT : ETQ_MET, externa ? L_EXT : L_MET);
    var res = suma(p.x, p.y);
    if (externa) { pasos = pasos.concat(pasosCadena(res)); }
    if (p.z) { pasos = pasos.concat(pasosMult(res, p.z)); }
    return pasos;
  }

  /* Veces que se evalúa algo en cada línea numerada. */
  function conteos(pasos) {
    var c = {};
    pasos.forEach(function (s) { c[s.linea] = (c[s.linea] || 0) + 1; });
    return c;
  }

  var API = { CODIGO: CODIGO, PRESETS: PRESETS, suma: suma, mult: mult,
              texto: texto, simular: simular, conteos: conteos };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function construirTraza(idx) {
    var pasos = simular(idx);
    var cuerpo = document.getElementById("cuerpo-traza");
    cuerpo.innerHTML = "";
    pasos.forEach(function (s, i) {
      var tr = document.createElement("tr");
      tr.id = "fila-" + i;
      var num = document.createElement("td");
      num.className = "paso";
      num.textContent = i + 1;
      var expr = document.createElement("td");
      expr.className = "expr";
      expr.textContent = s.expr;
      var val = document.createElement("td");
      val.className = "val pend";
      val.id = "val-" + i;
      val.textContent = "·";
      tr.appendChild(num);
      tr.appendChild(expr);
      tr.appendChild(val);
      cuerpo.appendChild(tr);
    });
  }

  function pintar(e) {
    e.pasos.forEach(function (s, i) {
      var tr = document.getElementById("fila-" + i);
      var val = document.getElementById("val-" + i);
      if (!tr || !val) { return; }
      tr.className = i === e.k - 1 ? "actual" : "";
      if (i < e.k) {
        val.className = "val";
        val.textContent = s.estado;
      } else {
        val.className = "val pend";
        val.textContent = "·";
      }
    });
    var pie = document.getElementById("pie");
    if (!e.actual) {
      pie.textContent = PRESETS[e.params].rotulo + ": todavía no ha empezado.";
    } else {
      pie.textContent = e.actual.nota;
    }
    if (e.terminado && e.pasos.length > 0) {
      document.getElementById("carta-dos").classList.remove("bloqueado");
    }
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: 0,
    chips: [
      { campo: "primero", rotulo: "operando 1" },
      { campo: "segundo", rotulo: "operando 2" },
      { campo: "valor", rotulo: "valor", clase: "cuenta" }
    ],
    simular: simular,
    alPintar: pintar
  });

  construirTraza(0);
  Motor.repintar();

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-preset]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      var idx = parseInt(b.getAttribute("data-preset"), 10);
      construirTraza(idx);
      Motor.reiniciar(idx);
    });
  });

  document.querySelectorAll("[data-op]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto");
      document.querySelectorAll("[data-op]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      if (b.getAttribute("data-op") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. El receptor entra al cuerpo como this, y los nombres sin calificar se resuelven contra él: en x.suma(y), numer es 1 y r.numer es 5. La aritmética es la misma de sumaRacional, con el primer operando llegando por otra puerta.";
        document.getElementById("carta-tres").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
