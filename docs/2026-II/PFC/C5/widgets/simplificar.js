/* simplificar: el ejercicio 3 del cierre del deck sobre la jerarquia de
   11_ejercicios.scala, con solo Numero, Suma y Prod. Las seis reglas quedan
   escritas como casos del match y se aplican recursivamente. El estudiante
   llena la tabla de lo que devuelve cada llamada sobre
   Suma(Prod(Numero(1), Numero(5)), Prod(Numero(0), Numero(7))), de las hojas
   hacia la raiz.

   Medido con scala-cli -S 2.13 sobre esa expresion:
     simplificar(Numero(5))        = Numero(5)
     simplificar(Prod(1,5))        = Numero(5)
     simplificar(Prod(0,7))        = Numero(0)
     simplificar(e)                = Suma(Numero(5),Numero(0))
     simplificar(simplificar(e))   = Numero(5)
     simplificarDesdeLasHojas(e)   = Numero(5)
     eval(e) = 5   y   eval(simplificar(e)) = 5
   Y sobre el segundo ejemplo del deck, d2 = Suma(Prod(Numero(0), Numero(99)), Numero(5)):
     simplificar(d2)               = Suma(Numero(0),Numero(5))
     simplificar(simplificar(d2))  = Numero(5)
     simplificarDesdeLasHojas(d2)  = Numero(5) */
(function () {

  function numero(n) { return { k: "Numero", n: n }; }
  function nodo(k, a, b) { return { k: k, a: a, b: b }; }

  /* Como se escribe la expresion en el archivo fuente. */
  function fuente(e) {
    if (e.k === "Numero") { return "Numero(" + e.n + ")"; }
    return e.k + "(" + fuente(e.a) + ", " + fuente(e.b) + ")";
  }

  /* Como la imprime el toString de las case class. */
  function comoRepl(e) {
    if (e.k === "Numero") { return "Numero(" + e.n + ")"; }
    return e.k + "(" + comoRepl(e.a) + "," + comoRepl(e.b) + ")";
  }

  function esCero(e) { return e.k === "Numero" && e.n === 0; }
  function esUno(e) { return e.k === "Numero" && e.n === 1; }

  function evaluar(e) {
    if (e.k === "Numero") { return e.n; }
    if (e.k === "Suma") { return evaluar(e.a) + evaluar(e.b); }
    return evaluar(e.a) * evaluar(e.b);
  }

  /* ── Las seis reglas como casos del match ─────────────────────── */
  /* El orden de los if es el orden de los case: el primero que coincide
     responde. Cada caso dice con qué patrón coincidió, y eso es lo que la
     tabla muestra junto al resultado. */

  function aplicar(e, traza) {
    if (e.k === "Numero") {
      return { salida: e, caso: "case Numero(n) => Numero(n)" };
    }
    if (e.k === "Suma" && esCero(e.b)) {
      return { salida: simplificar(e.a, traza), caso: "case Suma(e1, Numero(0)) => simplificar(e1)" };
    }
    if (e.k === "Suma" && esCero(e.a)) {
      return { salida: simplificar(e.b, traza), caso: "case Suma(Numero(0), e2) => simplificar(e2)" };
    }
    if (e.k === "Prod" && esUno(e.b)) {
      return { salida: simplificar(e.a, traza), caso: "case Prod(e1, Numero(1)) => simplificar(e1)" };
    }
    if (e.k === "Prod" && esUno(e.a)) {
      return { salida: simplificar(e.b, traza), caso: "case Prod(Numero(1), e2) => simplificar(e2)" };
    }
    if (e.k === "Prod" && esCero(e.b)) {
      return { salida: numero(0), caso: "case Prod(_, Numero(0)) => Numero(0)" };
    }
    if (e.k === "Prod" && esCero(e.a)) {
      return { salida: numero(0), caso: "case Prod(Numero(0), _) => Numero(0)" };
    }
    if (e.k === "Suma") {
      return {
        salida: nodo("Suma", simplificar(e.a, traza), simplificar(e.b, traza)),
        caso: "case Suma(e1, e2) => Suma(simplificar(e1), simplificar(e2))"
      };
    }
    return {
      salida: nodo("Prod", simplificar(e.a, traza), simplificar(e.b, traza)),
      caso: "case Prod(e1, e2) => Prod(simplificar(e1), simplificar(e2))"
    };
  }

  /* Cada llamada se anota al terminar, así que la traza queda en el orden en
     que las llamadas devuelven: primero las hojas, de último la raíz. */
  function simplificar(e, traza) {
    var r = aplicar(e, traza);
    if (traza) { traza.push({ entrada: e, salida: r.salida, caso: r.caso }); }
    return r.salida;
  }

  /* Los hijos primero, y las reglas contra lo que ya quedó simplificado. */
  function simplificarDesdeLasHojas(e) {
    var s1, s2;
    if (e.k === "Numero") { return e; }
    s1 = simplificarDesdeLasHojas(e.a);
    s2 = simplificarDesdeLasHojas(e.b);
    if (e.k === "Suma") {
      if (esCero(s2)) { return s1; }
      if (esCero(s1)) { return s2; }
      return nodo("Suma", s1, s2);
    }
    if (esUno(s2)) { return s1; }
    if (esUno(s1)) { return s2; }
    if (esCero(s2)) { return numero(0); }
    if (esCero(s1)) { return numero(0); }
    return nodo("Prod", s1, s2);
  }

  var EXPRESION = nodo("Suma",
    nodo("Prod", numero(1), numero(5)),
    nodo("Prod", numero(0), numero(7)));

  function traza(e) {
    var pasos = [];
    simplificar(e, pasos);
    return pasos;
  }

  var TRAZA = traza(EXPRESION);

  /* ── Las opciones de cada fila ────────────────────────────────── */
  /* La respuesta correcta sale de la traza; aquí solo van los distractores y
     lo que cada uno deja por aclarar. */

  var DISTRACTORES = [
    {
      "5": "La función devuelve una Expr, no un Int: pasar del árbol al número " +
        "es el trabajo de eval. El caso de Numero devuelve el mismo nodo.",
      "Numero(0)": "Ninguna de las seis reglas mira un número solo: todas piden " +
        "una suma o un producto. Una hoja sale como entró."
    },
    {
      "Numero(1)": "La regla 1 * e = e se queda con el lado que no es el 1. El " +
        "patrón case Prod(Numero(1), e2) ata e2 a Numero(5), y el cuerpo " +
        "simplifica ese e2.",
      "Prod(Numero(1),Numero(5))": "Un producto por 1 es justo lo que la regla " +
        "1 * e = e atrapa, y ese caso está escrito antes que el caso general del " +
        "producto, así que el match entra por él."
    },
    {
      "Numero(7)": "Esa es la forma de las reglas del 1, que se quedan con el " +
        "otro lado. Las del 0 en un producto devuelven Numero(0), y el Numero(7) " +
        "se descarta: simplificar no llega a visitarlo.",
      "Prod(Numero(0),Numero(7))": "0 * e = 0 es una de las seis reglas y su caso " +
        "está antes que el caso general del producto."
    },
    {
      "Numero(5)": "Ese es el árbol simplificado del todo, y no es lo que esta " +
        "llamada devuelve. Las dos reglas de la suma se probaron contra los hijos " +
        "tal como llegaron, y el derecho era Prod(Numero(0),Numero(7)), no " +
        "Numero(0): ninguna coincidió y el match siguió hasta el caso general.",
      "Numero(0)": "e + 0 = e devuelve el otro sumando, nunca el cero. Y aquí el " +
        "hijo derecho todavía no era un cero cuando los patrones lo miraron.",
      "Suma(Numero(5),Prod(Numero(0),Numero(7)))": "El caso general llama " +
        "simplificar sobre los dos hijos, no sobre uno. El derecho también pasa " +
        "por la función, y la regla 0 * e = 0 lo deja en Numero(0)."
    }
  ];

  /* Las filas de la tabla, en el orden en que las llamadas devolvieron. */
  function filas() {
    return TRAZA.map(function (p, i) {
      var buena = comoRepl(p.salida);
      var lista = [buena].concat(Object.keys(DISTRACTORES[i]));
      return {
        indice: i,
        llamada: "simplificar(" + fuente(p.entrada) + ")",
        correcta: buena,
        caso: p.caso,
        /* Un giro fijo por fila: la correcta no cae siempre en el mismo sitio. */
        opciones: lista.slice(i % lista.length).concat(lista.slice(0, i % lista.length))
      };
    });
  }

  var FILAS = filas();

  function revisar(i, elegido) {
    var f = FILAS[i];
    if (elegido === f.correcta) {
      return { ok: true, msg: "Coincide con " + f.caso + "." };
    }
    return { ok: false, msg: DISTRACTORES[i][elegido] };
  }

  var CODIGO = [
    "sealed trait Expr",
    "case class Numero(valor: Int)       extends Expr",
    "case class Suma(e1: Expr, e2: Expr) extends Expr",
    "case class Prod(e1: Expr, e2: Expr) extends Expr",
    " ",
    "def simplificar(e: Expr): Expr = e match {",
    "  case Numero(n)           => Numero(n)",
    "  case Suma(e1, Numero(0)) => simplificar(e1)",
    "  case Suma(Numero(0), e2) => simplificar(e2)",
    "  case Prod(e1, Numero(1)) => simplificar(e1)",
    "  case Prod(Numero(1), e2) => simplificar(e2)",
    "  case Prod(_, Numero(0))  => Numero(0)",
    "  case Prod(Numero(0), _)  => Numero(0)",
    "  case Suma(e1, e2)        => Suma(simplificar(e1), simplificar(e2))",
    "  case Prod(e1, e2)        => Prod(simplificar(e1), simplificar(e2))",
    "}"
  ];

  var CODIGO_HOJAS = [
    "def simplificarDesdeLasHojas(e: Expr): Expr = e match {",
    "  case Numero(n) => Numero(n)",
    "  case Suma(e1, e2) =>",
    "    (simplificarDesdeLasHojas(e1), simplificarDesdeLasHojas(e2)) match {",
    "      case (s1, Numero(0)) => s1",
    "      case (Numero(0), s2) => s2",
    "      case (s1, s2)        => Suma(s1, s2)",
    "    }",
    "  case Prod(e1, e2) =>",
    "    (simplificarDesdeLasHojas(e1), simplificarDesdeLasHojas(e2)) match {",
    "      case (s1, Numero(1)) => s1",
    "      case (Numero(1), s2) => s2",
    "      case (_, Numero(0))  => Numero(0)",
    "      case (Numero(0), _)  => Numero(0)",
    "      case (s1, s2)        => Prod(s1, s2)",
    "    }",
    "}"
  ];

  var API = {
    numero: numero, nodo: nodo, fuente: fuente, comoRepl: comoRepl,
    evaluar: evaluar, simplificar: simplificar,
    simplificarDesdeLasHojas: simplificarDesdeLasHojas, traza: traza,
    filas: filas, revisar: revisar,
    EXPRESION: EXPRESION, TRAZA: TRAZA, FILAS: FILAS,
    CODIGO: CODIGO, CODIGO_HOJAS: CODIGO_HOJAS
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ── La página ─────────────────────────────────────────────────── */

  var listas = {};

  function panelCodigo(lineas) {
    var caja = document.createElement("div");
    caja.className = "codigo";
    lineas.forEach(function (l, i) {
      var div = document.createElement("div");
      var num = document.createElement("span");
      var txt = document.createElement("span");
      div.className = "linea";
      num.className = "num";
      num.textContent = String(i + 1);
      txt.className = "txt";
      txt.textContent = l;
      div.appendChild(num);
      div.appendChild(txt);
      caja.appendChild(div);
    });
    return caja;
  }

  function contar() {
    var n = 0;
    FILAS.forEach(function (f) { if (listas[f.indice]) { n = n + 1; } });
    return n;
  }

  function construirTabla() {
    var caja = document.getElementById("tabla");
    FILAS.forEach(function (f) {
      var fila = document.createElement("div");
      fila.className = "fila";
      fila.id = "fila-" + f.indice;

      var llamada = document.createElement("div");
      llamada.className = "llamada";
      llamada.textContent = f.llamada;
      fila.appendChild(llamada);

      var devuelve = document.createElement("div");
      devuelve.className = "devuelve";
      devuelve.id = "devuelve-" + f.indice;
      devuelve.textContent = "devuelve  →  ?";
      fila.appendChild(devuelve);

      var ops = document.createElement("div");
      ops.className = "opciones";
      f.opciones.forEach(function (o) {
        var b = document.createElement("button");
        b.textContent = o;
        b.addEventListener("click", function () { elegir(f.indice, o, b); });
        ops.appendChild(b);
      });
      fila.appendChild(ops);

      var ver = document.createElement("div");
      ver.className = "veredicto";
      ver.id = "ver-" + f.indice;
      fila.appendChild(ver);

      caja.appendChild(fila);
    });
  }

  function elegir(i, opcion, boton) {
    var res = revisar(i, opcion);
    var ver = document.getElementById("ver-" + i);
    var fila = document.getElementById("fila-" + i);
    fila.querySelectorAll(".opciones button").forEach(function (o) { o.className = ""; });
    boton.className = res.ok ? "primario" : "errada";
    ver.className = res.ok ? "veredicto bien" : "veredicto mal";
    ver.textContent = res.msg;
    if (res.ok) {
      listas[i] = true;
      fila.classList.add("listo");
      document.getElementById("devuelve-" + i).textContent =
        "devuelve  →  " + FILAS[i].correcta;
    }
    document.getElementById("marcador").textContent =
      "llamadas resueltas: " + contar() + " de " + FILAS.length;
    if (contar() === FILAS.length) { abrirCierre(); }
  }

  function abrirCierre() {
    var carta = document.getElementById("carta-tres");
    var resumen = document.getElementById("resumen");
    if (!carta.classList.contains("bloqueado")) { return; }
    carta.classList.remove("bloqueado");
    resumen.textContent =
      "simplificar(" + fuente(EXPRESION) + ")  devuelve  " +
      comoRepl(simplificar(EXPRESION)) + ", y ahí quedan una suma con un cero " +
      "y una regla sin aplicar.";
    resumen.className = "alerta";
  }

  construirTabla();
  document.getElementById("codigo").appendChild(panelCodigo(CODIGO));
  document.getElementById("marcador").textContent =
    "llamadas resueltas: 0 de " + FILAS.length;

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-tres");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      b.className = b.getAttribute("data-razon") === "ok" ? "primario" : "errada";
      if (b.getAttribute("data-razon") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. Los patrones de la raíz se comparan contra los " +
          "hijos sin simplificar, y el Numero(0) del lado derecho nace de " +
          "simplificarlo. Cuando aparece, las dos reglas de la suma ya fueron " +
          "descartadas y el match siguió de largo.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
        document.getElementById("codigo-hojas").appendChild(panelCodigo(CODIGO_HOJAS));
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
