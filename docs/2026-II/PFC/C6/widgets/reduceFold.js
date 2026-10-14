/* reduceFold: ocho expresiones de los frames reduceLeft: reducción por la
   izquierda, reduceRight: reducción por la derecha, Limitación de reduce,
   foldLeft: reducción con acumulador, foldLeft: uso práctico y foldRight:
   reducción por la derecha con acumulador del deck ListasParte2. El panel de
   código son las cuatro definiciones de los frames de implementación interna
   del mismo deck. Cada valor, el correcto y los tres distractores, sale de
   correr esas definiciones; ninguno está escrito a mano. Valores del deck que
   la simulación reproduce: reduceLeft(_ + _) sobre List(1,2,3,4) da 10,
   reduceLeft(_ - _) da -8, reduceRight(_ - _) da -2,
   (List(1,2,3) foldLeft 0)(_ - _) da -6 y (List(1,2,3) foldRight 0)(_ - _)
   da 2. */
(function () {

  var MENSAJE_IZQ = "java.lang.UnsupportedOperationException: empty.reduceLeft";

  var OPS = {
    suma: { txt: "_ + _", calc: function (a, b) { return a + b; } },
    producto: { txt: "_ * _", calc: function (a, b) { return a * b; } },
    resta: { txt: "_ - _", calc: function (a, b) { return a - b; } }
  };

  /* ── Las cuatro definiciones, como las escribe el deck ───────────── */

  function foldLeft(xs, z, op) {
    if (xs.length === 0) { return z; }
    return foldLeft(xs.slice(1), op(z, xs[0]), op);
  }

  function reduceLeft(xs, op) {
    if (xs.length === 0) { throw new Error("Nil.reduceLeft"); }
    return foldLeft(xs.slice(1), xs[0], op);
  }

  function foldRight(xs, z, op) {
    if (xs.length === 0) { return z; }
    return op(xs[0], foldRight(xs.slice(1), z, op));
  }

  function reduceRight(xs, op) {
    if (xs.length === 0) { throw new Error("Nil.reduceRight"); }
    if (xs.length === 1) { return xs[0]; }
    return op(xs[0], reduceRight(xs.slice(1), op));
  }

  /* Corre una de las cuatro y devuelve el valor o el mensaje del error. */
  function intentar(f) {
    try {
      return { ok: true, txt: String(f()) };
    } catch (e) {
      return { ok: false, txt: MENSAJE_IZQ };
    }
  }

  /* Dos formas de equivocarse que no son otra asociatividad:
     por parejas parte la lista en dos mitades y combina los resultados;
     negarSuma le pone el signo menos a la suma de todos. */
  function porParejas(xs, op) {
    var mitad = Math.floor(xs.length / 2);
    return op(reduceLeft(xs.slice(0, mitad), op), reduceLeft(xs.slice(mitad), op));
  }

  function negarSuma(xs) {
    return -foldLeft(xs, 0, OPS.suma.calc);
  }

  var CODIGO = [
    "abstract class List[T] {",
    "  def foldLeft[U](z: U)(op: (U, T) => U): U = this match {",
    "    case Nil     => z",
    "    case x :: xs => (xs foldLeft op(z, x))(op)",
    "  }",
    "",
    "  def reduceLeft(op: (T, T) => T): T = this match {",
    "    case Nil     => throw new Error(\"Nil.reduceLeft\")",
    "    case x :: xs => (xs foldLeft x)(op)",
    "  }",
    "",
    "  def foldRight[U](z: U)(op: (T, U) => U): U = this match {",
    "    case Nil     => z",
    "    case x :: xs => op(x, (xs foldRight z)(op))",
    "  }",
    "",
    "  def reduceRight(op: (T, T) => T): T = this match {",
    "    case Nil      => throw new Error(\"Nil.reduceRight\")",
    "    case x :: Nil => x",
    "    case x :: xs  => op(x, xs.reduceRight(op))",
    "  }",
    "}"
  ];

  var CUATRO = [1, 2, 3, 4];
  var TRES = [1, 2, 3];

  /* ── Los ocho ítems ─────────────────────────────────────────────── */

  var ITEMS = [
    {
      id: "rl-suma",
      expr: "List(1, 2, 3, 4).reduceLeft(_ + _)",
      pregunta: "¿Qué responde?",
      opciones: [
        { clave: "ok", valor: function () { return reduceLeft(CUATRO, OPS.suma.calc); } },
        { clave: "producto", valor: function () { return reduceLeft(CUATRO, OPS.producto.calc); } },
        { clave: "primero", valor: function () { return CUATRO[0]; } },
        { clave: "largo", valor: function () { return CUATRO.length; } }
      ],
      exito: "Eso es: (1 + 2) = 3, (3 + 3) = 6, (6 + 4) = 10. reduceLeft arranca " +
        "con el primer elemento como acumulador y le va sumando los demás de " +
        "izquierda a derecha.",
      fallo: {
        producto: "24 es el mismo recorrido con _ * _. El operador que recibe " +
          "reduceLeft es el que combina los elementos, y aquí es la suma.",
        primero: "1 es el acumulador con que arranca reduceLeft, el primer " +
          "elemento de la lista. Falta combinarlo con los otros tres: la " +
          "implementación sigue con (xs foldLeft x)(op).",
        largo: "4 es cuántos elementos tiene la lista. reduceLeft no cuenta, " +
          "combina: devuelve un valor del mismo tipo que los elementos."
      }
    },
    {
      id: "rl-resta",
      expr: "List(1, 2, 3, 4).reduceLeft(_ - _)",
      pregunta: "¿Qué responde?",
      opciones: [
        { clave: "ok", valor: function () { return reduceLeft(CUATRO, OPS.resta.calc); } },
        { clave: "derecha", valor: function () { return reduceRight(CUATRO, OPS.resta.calc); } },
        { clave: "suma", valor: function () { return reduceLeft(CUATRO, OPS.suma.calc); } },
        { clave: "negada", valor: function () { return negarSuma(CUATRO); } }
      ],
      exito: "Eso es: (((1 - 2) - 3) - 4) = -8. Cada paso usa el resultado del " +
        "anterior como lado izquierdo de la resta.",
      fallo: {
        derecha: "-2 es lo que da reduceRight con la misma resta, " +
          "1 - (2 - (3 - 4)). La resta no es asociativa, así que las dos " +
          "asociaciones dan valores distintos.",
        suma: "10 es el resultado con _ + _. Con la suma las dos asociaciones " +
          "coinciden; con la resta no, y por eso el operador decide.",
        negada: "-10 sería restarle a cero la suma de los cuatro. El primer " +
          "elemento no entra negado: es el acumulador inicial, y la cadena " +
          "empieza en 1 - 2."
      }
    },
    {
      id: "rr-resta",
      expr: "List(1, 2, 3, 4).reduceRight(_ - _)",
      pregunta: "¿Qué responde?",
      opciones: [
        { clave: "ok", valor: function () { return reduceRight(CUATRO, OPS.resta.calc); } },
        { clave: "izquierda", valor: function () { return reduceLeft(CUATRO, OPS.resta.calc); } },
        { clave: "suma", valor: function () { return reduceRight(CUATRO, OPS.suma.calc); } },
        { clave: "parejas", valor: function () { return porParejas(CUATRO, OPS.resta.calc); } }
      ],
      exito: "Eso es: 1 - (2 - (3 - 4)) = 1 - (2 - (-1)) = 1 - 3 = -2. La cadena " +
        "se cierra desde el último par y el resultado vuelve hacia la cabeza.",
      fallo: {
        izquierda: "-8 es la asociación por la izquierda, (((1 - 2) - 3) - 4). " +
          "reduceRight pone el paréntesis al otro lado: el elemento queda a la " +
          "izquierda del operador y el resultado de la cola, a la derecha.",
        suma: "10 es el resultado con _ + _, donde la asociación no cambia nada. " +
          "Con la resta sí cambia, y es justo lo que el ítem pregunta.",
        parejas: "0 sale de emparejar (1 - 2) y (3 - 4) y restar los dos " +
          "resultados. reduceRight no parte la lista en mitades: encadena " +
          "elemento por elemento desde el final."
      }
    },
    {
      id: "rl-vacia",
      expr: "List[Int]().reduceLeft(_ + _)",
      pregunta: "¿Qué responde?",
      opciones: [
        { clave: "ok", valor: function () { return reduceLeft([], OPS.suma.calc); } },
        { clave: "cero", valor: function () { return foldLeft([], 0, OPS.suma.calc); } },
        { clave: "uno", valor: function () { return foldLeft([], 1, OPS.producto.calc); } },
        { clave: "vacia", valor: function () { return "List()"; } }
      ],
      exito: "Eso es. reduceLeft necesita al menos un elemento, porque el primero " +
        "es el acumulador con que arranca: la implementación del deck responde a " +
        "la lista vacía con throw new Error(\"Nil.reduceLeft\").",
      fallo: {
        cero: "0 es lo que devuelve (List[Int]() foldLeft 0)(_ + _). Ahí el cero " +
          "lo pone quien llama, como valor inicial; reduceLeft no recibe ninguno.",
        uno: "1 es el acumulador de (List[Int]() foldLeft 1)(_ * _), el neutro del " +
          "producto. reduceLeft no tiene de dónde sacar un neutro: el operador que " +
          "recibe no dice cuál es.",
        vacia: "reduceLeft devuelve un elemento, no una lista: su tipo de retorno " +
          "es T. Sobre la lista vacía no hay ningún T que devolver, y de ahí el error."
      }
    },
    {
      id: "fl-resta",
      expr: "(List(1, 2, 3) foldLeft 0)(_ - _)",
      pregunta: "¿Qué responde?",
      opciones: [
        { clave: "ok", valor: function () { return foldLeft(TRES, 0, OPS.resta.calc); } },
        { clave: "derecha", valor: function () { return foldRight(TRES, 0, OPS.resta.calc); } },
        { clave: "suma", valor: function () { return foldLeft(TRES, 0, OPS.suma.calc); } },
        { clave: "sinZeta", valor: function () { return reduceLeft(TRES, OPS.resta.calc); } }
      ],
      exito: "Eso es: ((0 - 1) - 2) - 3 = -6. El acumulador entra como lado " +
        "izquierdo de la primera resta y el recorrido sigue hacia la derecha.",
      fallo: {
        derecha: "2 es lo que da (List(1, 2, 3) foldRight 0)(_ - _), " +
          "1 - (2 - (3 - 0)). Con la resta las dos direcciones no coinciden.",
        suma: "6 es el resultado con _ + _, donde el cero no cambia nada y la " +
          "dirección tampoco. La resta es la que separa los dos casos.",
        sinZeta: "-4 es 1 - 2 - 3, el recorrido sin el acumulador inicial. El cero " +
          "no se ignora: op(z, x) lo usa en el primer paso, y de ahí sale 0 - 1."
      }
    },
    {
      id: "fr-resta",
      expr: "(List(1, 2, 3) foldRight 0)(_ - _)",
      pregunta: "¿Qué responde?",
      opciones: [
        { clave: "ok", valor: function () { return foldRight(TRES, 0, OPS.resta.calc); } },
        { clave: "izquierda", valor: function () { return foldLeft(TRES, 0, OPS.resta.calc); } },
        { clave: "suma", valor: function () { return foldRight(TRES, 0, OPS.suma.calc); } },
        { clave: "zeta", valor: function () { return foldRight([], 0, OPS.resta.calc); } }
      ],
      exito: "Eso es: 1 - (2 - (3 - 0)) = 1 - (2 - 3) = 1 - (-1) = 2. El " +
        "acumulador aparece al final de la cadena, pegado al último elemento.",
      fallo: {
        izquierda: "-6 es ((0 - 1) - 2) - 3, la asociación por la izquierda. En " +
          "foldRight el acumulador no abre la cadena, la cierra.",
        suma: "6 es el resultado con _ + _, que coincide con el de foldLeft. La " +
          "resta no es asociativa y ahí los dos se separan.",
        zeta: "0 es lo que devuelve foldRight cuando la lista está vacía, por el " +
          "caso case Nil => z. Con tres elementos el caso que corre es el otro, y " +
          "el cero queda como lado derecho de 3 - 0."
      }
    },
    {
      id: "fl-vacia",
      expr: "(List[Int]() foldLeft 1)(_ * _)",
      pregunta: "¿Qué responde?",
      opciones: [
        { clave: "ok", valor: function () { return foldLeft([], 1, OPS.producto.calc); } },
        { clave: "cero", valor: function () { return foldLeft([], 0, OPS.suma.calc); } },
        { clave: "error", valor: function () { return reduceLeft([], OPS.producto.calc); } },
        { clave: "vacia", valor: function () { return "List()"; } }
      ],
      exito: "Eso es. El primer caso de foldLeft es case Nil => z, así que la " +
        "lista vacía devuelve el acumulador tal como llegó. Con _ * _ el " +
        "acumulador que se escribe es 1, el neutro del producto.",
      fallo: {
        cero: "0 es el acumulador que se usa para sumar. Con el producto, un cero " +
          "inicial dejaría en cero cualquier lista: (List(2, 3) foldLeft 0)(_ * _) " +
          "responde 0.",
        error: "El error es lo que lanza reduceLeft, que no tiene valor inicial. " +
          "foldLeft sí lo tiene y por eso la lista vacía no es un caso aparte.",
        vacia: "foldLeft devuelve un valor del tipo del acumulador, U, no una " +
          "lista. Con U igual a Int lo que sale es el 1."
      }
    },
    {
      id: "cero-al-frente",
      expr: "def suma(xs: List[Int]): Int = (0 :: xs).reduceLeft(_ + _)",
      pregunta: "¿Qué hace el 0 :: xs de esta definición?",
      frases: true,
      opciones: [
        {
          clave: "ok",
          txt: "Garantiza que la lista tenga al menos un elemento, así que " +
            "reduceLeft nunca recibe Nil, y como 0 es el neutro de la suma el " +
            "resultado no cambia."
        },
        {
          clave: "parametro",
          txt: "Le pasa el valor inicial a reduceLeft, igual que el z de foldLeft."
        },
        {
          clave: "desplaza",
          txt: "Corrige el resultado, que sin el 0 saldría desplazado en una posición."
        },
        {
          clave: "asociar",
          txt: "Fija la asociación por la izquierda, que necesita un punto de partida."
        }
      ],
      exito: "Eso es. reduceLeft toma el primer elemento como acumulador, así que " +
        "sobre Nil no tiene con qué empezar; con el cero al frente, suma(Nil) " +
        "responde 0 en lugar de lanzar el error. El mismo arreglo con producto " +
        "usa 1 :: xs, porque el neutro del producto es 1.",
      fallo: {
        parametro: "La firma es reduceLeft(op: (T, T) => T): no hay parámetro " +
          "para un valor inicial. El 0 entra como un elemento más de la lista, " +
          "y es el operador el que lo absorbe.",
        desplaza: "Sin el 0 el resultado es el mismo: List(1, 2, 3) suma 6 con o " +
          "sin él. Lo que cambia es la lista vacía, donde reduceLeft lanza el " +
          "error y (0 :: Nil).reduceLeft(_ + _) responde 0.",
        asociar: "La asociación la fija reduceLeft por sí sola, y sin el 0 " +
          "arrancaría en el primer elemento de xs. El cero no cambia la dirección " +
          "del recorrido, solo asegura que haya con qué arrancar."
      }
    }
  ];

  /* El texto de una opción: para los ítems de valor sale de correr la
     definición, nunca de un número escrito a mano. */
  function textoOpcion(item, opcion) {
    if (item.frases) { return opcion.txt; }
    return intentar(opcion.valor).txt;
  }

  function opcionesDe(item, giro) {
    var lista = item.opciones.map(function (o) {
      return { clave: o.clave, txt: textoOpcion(item, o), correcta: o.clave === "ok" };
    });
    var corte = giro % lista.length;
    return lista.slice(corte).concat(lista.slice(0, corte));
  }

  function respuestaDe(item) {
    var ok = null;
    item.opciones.forEach(function (o) { if (o.clave === "ok") { ok = o; } });
    return textoOpcion(item, ok);
  }

  var API = {
    OPS: OPS, CODIGO: CODIGO, ITEMS: ITEMS,
    foldLeft: foldLeft, foldRight: foldRight,
    reduceLeft: reduceLeft, reduceRight: reduceRight,
    intentar: intentar, porParejas: porParejas, negarSuma: negarSuma,
    opcionesDe: opcionesDe, respuestaDe: respuestaDe, textoOpcion: textoOpcion
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ════════════════ la página ════════════════ */

  var k = 0;
  var errores = 0;

  function construirCodigo() {
    var panel = document.getElementById("panel-codigo");
    CODIGO.forEach(function (texto, i) {
      var div = document.createElement("div");
      var num = document.createElement("span");
      var txt = document.createElement("span");
      div.className = "linea";
      num.className = "num";
      num.textContent = String(i + 1);
      txt.className = "txt";
      txt.textContent = texto;
      div.appendChild(num);
      div.appendChild(txt);
      panel.appendChild(div);
    });
  }

  function pintarResueltos() {
    var caja = document.getElementById("resueltos");
    caja.innerHTML = "";
    ITEMS.slice(0, k).forEach(function (item) {
      var fila = document.createElement("div");
      var izq = document.createElement("span");
      var der = document.createElement("span");
      fila.className = "resuelto";
      izq.className = "expr-chica";
      izq.textContent = item.expr;
      der.className = "valor-chico";
      der.textContent = item.frases ? "resuelto" : "= " + respuestaDe(item);
      fila.appendChild(izq);
      fila.appendChild(der);
      caja.appendChild(fila);
    });
  }

  function pintarMarcador() {
    document.getElementById("marcador").textContent =
      "ítems resueltos: " + k + " de " + ITEMS.length +
      "    ·    opciones falladas: " + errores;
  }

  function pintarItem() {
    var caja = document.getElementById("opciones");
    var ver = document.getElementById("veredicto");
    var item;
    caja.innerHTML = "";
    ver.className = "veredicto";
    ver.textContent = "";
    if (k >= ITEMS.length) {
      document.getElementById("expresion").textContent = "";
      document.getElementById("enunciado").textContent =
        "Los ocho ítems quedaron resueltos.";
      document.getElementById("carta-cierre").classList.remove("bloqueado");
      return;
    }
    item = ITEMS[k];
    document.getElementById("expresion").textContent = item.expr;
    document.getElementById("enunciado").textContent = item.pregunta;
    opcionesDe(item, k).forEach(function (o) {
      var b = document.createElement("button");
      b.textContent = o.txt;
      b.className = item.frases ? "larga" : "";
      b.addEventListener("click", function () { elegir(item, o, b); });
      caja.appendChild(b);
    });
  }

  function elegir(item, opcion, boton) {
    var ver = document.getElementById("veredicto");
    if (opcion.correcta) {
      k = k + 1;
      pintarResueltos();
      pintarItem();
      pintarMarcador();
      return;
    }
    errores = errores + 1;
    boton.className = boton.className + " errada";
    boton.disabled = true;
    ver.className = "veredicto mal";
    ver.textContent = item.fallo[opcion.clave];
    pintarMarcador();
  }

  construirCodigo();
  pintarResueltos();
  pintarItem();
  pintarMarcador();
})();
