/* mismoTexto: dos arboles distintos que mostrar imprime igual.
   Prod(Suma(Numero(1), Numero(2)), Numero(3)) y
   Suma(Numero(1), Prod(Numero(2), Numero(3))) dan los dos "1 + 2 * 3" y valen
   9 y 7. Las tres funciones son las de 10_expresiones.scala. Medido con
   scala-cli -S 2.13: mostrar da "1 + 2 * 3" en ambos; eval da 9 y 7;
   mostrarConParentesis da "(1 + 2) * 3" y "(1 + 2 * 3)"; la igualdad de las
   case class entre los dos arboles da false; y con divisiones
   mostrarConParentesis(Div(Div(8,4),2)) y mostrarConParentesis(Div(8,Div(4,2)))
   dan los dos "8 / 4 / 2", con eval 1 y 4. */
(function () {

  function numero(n) { return { k: "Numero", n: n }; }
  function nodo(k, a, b) { return { k: k, a: a, b: b }; }

  var SIMBOLO = { Suma: "+", Resta: "-", Prod: "*", Div: "/" };

  function mostrarExpr(e) {
    if (e.k === "Numero") { return "Numero(" + e.n + ")"; }
    return e.k + "(" + mostrarExpr(e.a) + ", " + mostrarExpr(e.b) + ")";
  }

  /* eval: un caso por forma, y la recursion baja por los hijos. */
  function evaluar(e) {
    if (e.k === "Numero") { return e.n; }
    if (e.k === "Suma") { return evaluar(e.a) + evaluar(e.b); }
    if (e.k === "Resta") { return evaluar(e.a) - evaluar(e.b); }
    if (e.k === "Prod") { return evaluar(e.a) * evaluar(e.b); }
    return Math.trunc(evaluar(e.a) / evaluar(e.b));
  }

  /* mostrar: pega los dos lados con el operador y no escribe parentesis. */
  function mostrar(e) {
    if (e.k === "Numero") { return String(e.n); }
    return mostrar(e.a) + " " + SIMBOLO[e.k] + " " + mostrar(e.b);
  }

  /* mostrarConParentesis: la suma y la resta encierran lo que arman; el
     producto y la division, no. */
  function mostrarConParentesis(e) {
    if (e.k === "Numero") { return String(e.n); }
    if (e.k === "Suma" || e.k === "Resta") {
      return "(" + mostrarConParentesis(e.a) + " " + SIMBOLO[e.k] + " " +
        mostrarConParentesis(e.b) + ")";
    }
    return mostrarConParentesis(e.a) + " " + SIMBOLO[e.k] + " " +
      mostrarConParentesis(e.b);
  }

  var ARBOLES = {
    A: nodo("Prod", nodo("Suma", numero(1), numero(2)), numero(3)),
    B: nodo("Suma", numero(1), nodo("Prod", numero(2), numero(3)))
  };

  /* ── Donde va cada nodo al dibujarlo ──────────────────────────── */
  /* Las hojas ocupan columnas consecutivas de izquierda a derecha y cada nodo
     de operacion queda a mitad de camino entre sus dos hijos. */

  function disponer(e) {
    var nodos = [];
    var aristas = [];
    var columnas = 0;
    var honda = 0;

    function bajar(x, prof) {
      var id = nodos.length;
      var col, izq, der;
      nodos.push(null);
      if (prof > honda) { honda = prof; }
      if (x.k === "Numero") {
        col = columnas;
        columnas = columnas + 1;
      } else {
        izq = bajar(x.a, prof + 1);
        der = bajar(x.b, prof + 1);
        col = (nodos[izq].col + nodos[der].col) / 2;
        aristas.push({ de: id, a: izq });
        aristas.push({ de: id, a: der });
      }
      nodos[id] = {
        id: id, prof: prof, col: col,
        etiqueta: x.k === "Numero" ? String(x.n) : SIMBOLO[x.k],
        forma: x.k === "Numero" ? "hoja" : "operacion",
        nombre: x.k === "Numero" ? "Numero(" + x.n + ")" : x.k
      };
      return id;
    }

    bajar(e, 0);
    return { nodos: nodos, aristas: aristas, columnas: columnas, honda: honda };
  }

  /* ── Primera parte: qué vale cada árbol ───────────────────────── */

  var VALORES = [5, 6, 7, 9];

  var EXITO = {
    A: "El nodo de arriba es Prod, y su cuerpo multiplica lo que devuelven sus " +
      "dos hijos: la suma entrega 3 y la hoja entrega 3.",
    B: "El nodo de arriba es Suma: el hijo izquierdo entrega 1 y el producto de " +
      "la derecha entrega 6."
  };

  var FALLO = {
    A: {
      5: "5 sale de leer el texto como 1 * 2 + 3, con los operadores cambiados " +
        "de sitio. Los operadores no se leen del texto: cada nodo trae el suyo, " +
        "y en este árbol son Prod arriba y Suma abajo a la izquierda.",
      6: "6 es la suma de las tres hojas. El nodo de arriba de este árbol no es " +
        "una suma: es Prod, y su cuerpo multiplica lo que sus dos hijos devuelven.",
      7: "Ese es el valor del otro árbol, el que tiene la suma arriba y el " +
        "producto como hijo derecho. Aquí el producto es el nodo de arriba."
    },
    B: {
      5: "5 sale de leer el texto como 1 * 2 + 3. Los operadores no están en el " +
        "texto: este árbol tiene Suma arriba y Prod en el hijo derecho.",
      6: "6 es la suma de las tres hojas, y aquí hay una suma y un producto. El " +
        "hijo derecho de la raíz es Prod y entrega el resultado de multiplicar.",
      9: "Ese es el valor del otro árbol, el que tiene Prod arriba. Aquí la raíz " +
        "es Suma y el producto queda debajo, en el hijo derecho."
    }
  };

  function revisarValor(cual, elegido) {
    var real = evaluar(ARBOLES[cual]);
    if (elegido === real) {
      return { ok: true, msg: "eval responde " + real + ". " + EXITO[cual] };
    }
    return { ok: false, msg: FALLO[cual][elegido] };
  }

  /* ── Segunda parte: a qué árbol corresponde cada texto ────────── */

  var TEXTOS = [
    { id: "t1", cadena: mostrarConParentesis(ARBOLES.A), dueno: "A" },
    { id: "t2", cadena: mostrarConParentesis(ARBOLES.B), dueno: "B" }
  ];

  var RETRO_TEXTO = {
    t1: {
      ok: "Los paréntesis que se ven son los del caso de Suma, y en este árbol " +
        "la suma es el hijo izquierdo del producto: encierra 1 + 2 y ahí termina. " +
        "El caso de Prod no agrega ninguno, así que el * 3 queda afuera.",
      mal: "En el otro árbol la única suma es la raíz, y el caso de Suma encierra " +
        "todo lo que ella arma. Sus paréntesis quedarían por fuera de la cadena " +
        "completa, no alrededor de 1 + 2."
    },
    t2: {
      ok: "La suma es la raíz, y el caso de Suma encierra todo lo que ella arma: " +
        "los paréntesis abren al principio y cierran al final. El producto que " +
        "queda adentro no agrega ninguno.",
      mal: "En el otro árbol la suma es el hijo izquierdo del producto, así que " +
        "sus paréntesis cierran en el 2 y dejan el * 3 por fuera."
    }
  };

  function revisarTexto(id, elegido) {
    var hallado = null;
    TEXTOS.forEach(function (t) { if (t.id === id) { hallado = t; } });
    if (elegido === hallado.dueno) {
      return { ok: true, msg: RETRO_TEXTO[id].ok };
    }
    return { ok: false, msg: RETRO_TEXTO[id].mal };
  }

  var CODIGO_EVAL = [
    "def eval(e: Expr): Int = e match {",
    "  case Numero(n)    => n",
    "  case Suma(e1, e2) => eval(e1) + eval(e2)",
    "  case Prod(e1, e2) => eval(e1) * eval(e2)",
    "}",
    " ",
    "def mostrar(e: Expr): String = e match {",
    "  case Numero(n)    => n.toString",
    "  case Suma(e1, e2) =>",
    "    mostrar(e1) + \" + \" + mostrar(e2)",
    "  case Prod(e1, e2) =>",
    "    mostrar(e1) + \" * \" + mostrar(e2)",
    "}"
  ];

  var CODIGO_PARENTESIS = [
    "def mostrarConParentesis(e: Expr): String = e match {",
    "  case Numero(n) => n.toString",
    "  case Suma(e1, e2) =>",
    "    \"(\" + mostrarConParentesis(e1) + \" + \" +",
    "    mostrarConParentesis(e2) + \")\"",
    "  case Prod(e1, e2) =>",
    "    mostrarConParentesis(e1) + \" * \" +",
    "    mostrarConParentesis(e2)",
    "}"
  ];

  var API = {
    numero: numero, nodo: nodo, mostrarExpr: mostrarExpr, evaluar: evaluar,
    mostrar: mostrar, mostrarConParentesis: mostrarConParentesis,
    disponer: disponer, revisarValor: revisarValor, revisarTexto: revisarTexto,
    ARBOLES: ARBOLES, VALORES: VALORES, TEXTOS: TEXTOS,
    CODIGO_EVAL: CODIGO_EVAL, CODIGO_PARENTESIS: CODIGO_PARENTESIS
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ── La página ─────────────────────────────────────────────────── */

  var SVG = "http://www.w3.org/2000/svg";
  var PASO_X = 58;
  var PASO_Y = 56;
  var MARGEN = 26;
  var RADIO = 17;

  var valoresListos = {};
  var textosListos = {};

  function elemento(nombre, atributos) {
    var el = document.createElementNS(SVG, nombre);
    Object.keys(atributos).forEach(function (a) {
      el.setAttribute(a, String(atributos[a]));
    });
    return el;
  }

  function dibujar(expr) {
    var plano = disponer(expr);
    var ancho = (plano.columnas - 1) * PASO_X + 2 * MARGEN;
    var alto = plano.honda * PASO_Y + 2 * MARGEN;
    var svg = elemento("svg", {
      viewBox: "0 0 " + ancho + " " + alto,
      width: "100%", height: alto, role: "img"
    });

    function cx(n) { return MARGEN + n.col * PASO_X; }
    function cy(n) { return MARGEN + n.prof * PASO_Y; }

    plano.aristas.forEach(function (ar) {
      svg.appendChild(elemento("line", {
        x1: cx(plano.nodos[ar.de]), y1: cy(plano.nodos[ar.de]),
        x2: cx(plano.nodos[ar.a]), y2: cy(plano.nodos[ar.a]),
        stroke: "#9aa5b1", "stroke-width": 1.6
      }));
    });

    plano.nodos.forEach(function (n) {
      var hoja = n.forma === "hoja";
      svg.appendChild(elemento("circle", {
        cx: cx(n), cy: cy(n), r: RADIO,
        fill: hoja ? "#e7f2e8" : "#e3edf8",
        stroke: hoja ? "#2e7d32" : "#1f5fa8", "stroke-width": 1.6
      }));
      var t = elemento("text", {
        x: cx(n), y: cy(n) + 5, "text-anchor": "middle",
        "font-family": "ui-monospace, monospace", "font-size": 15,
        "font-weight": 700, fill: hoja ? "#2e7d32" : "#1f5fa8"
      });
      t.textContent = n.etiqueta;
      svg.appendChild(t);
    });
    return svg;
  }

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

  function contarValores() {
    return (valoresListos.A ? 1 : 0) + (valoresListos.B ? 1 : 0);
  }

  function contarTextos() {
    var n = 0;
    TEXTOS.forEach(function (t) { if (textosListos[t.id]) { n = n + 1; } });
    return n;
  }

  function construirArboles() {
    var caja = document.getElementById("arboles");
    ["A", "B"].forEach(function (cual) {
      var panel = document.createElement("div");
      panel.className = "arbol";
      panel.id = "arbol-" + cual;

      var titulo = document.createElement("h3");
      titulo.textContent = "Árbol " + cual;
      panel.appendChild(titulo);

      var term = document.createElement("div");
      term.className = "termino";
      term.textContent = mostrarExpr(ARBOLES[cual]);
      panel.appendChild(term);

      panel.appendChild(dibujar(ARBOLES[cual]));

      var salida = document.createElement("div");
      salida.className = "salida";
      salida.textContent = "mostrar  →  \"" + mostrar(ARBOLES[cual]) + "\"";
      panel.appendChild(salida);

      var pregunta = document.createElement("div");
      pregunta.className = "pregunta";
      pregunta.textContent = "¿Qué responde eval?";
      panel.appendChild(pregunta);

      var ops = document.createElement("div");
      ops.className = "opciones";
      VALORES.forEach(function (v) {
        var b = document.createElement("button");
        b.textContent = String(v);
        b.addEventListener("click", function () { elegirValor(cual, v, b); });
        ops.appendChild(b);
      });
      panel.appendChild(ops);

      var ver = document.createElement("div");
      ver.className = "veredicto";
      ver.id = "ver-valor-" + cual;
      panel.appendChild(ver);

      caja.appendChild(panel);
    });
  }

  function elegirValor(cual, v, boton) {
    var res = revisarValor(cual, v);
    var ver = document.getElementById("ver-valor-" + cual);
    var panel = document.getElementById("arbol-" + cual);
    panel.querySelectorAll(".opciones button").forEach(function (o) { o.className = ""; });
    boton.className = res.ok ? "primario" : "errada";
    ver.className = res.ok ? "veredicto bien" : "veredicto mal";
    ver.textContent = res.msg;
    if (res.ok) {
      valoresListos[cual] = true;
      panel.classList.add("listo");
    }
    document.getElementById("marcador-valores").textContent =
      "árboles evaluados: " + contarValores() + " de 2";
    if (contarValores() === 2) { abrirSegundaParte(); }
  }

  /* La segunda parte se arma cuando los dos valores están puestos. */
  function abrirSegundaParte() {
    var carta = document.getElementById("carta-dos");
    if (!carta.classList.contains("bloqueado")) { return; }
    carta.classList.remove("bloqueado");
    document.getElementById("codigo-parentesis").appendChild(panelCodigo(CODIGO_PARENTESIS));
    construirTextos();
    document.getElementById("marcador-textos").textContent =
      "textos asignados: 0 de " + TEXTOS.length;
  }

  function construirTextos() {
    var caja = document.getElementById("textos");
    TEXTOS.forEach(function (t) {
      var fila = document.createElement("div");
      fila.className = "caso";
      fila.id = "caso-" + t.id;

      var cadena = document.createElement("div");
      cadena.className = "cadena";
      cadena.textContent = "\"" + t.cadena + "\"";
      fila.appendChild(cadena);

      var ops = document.createElement("div");
      ops.className = "opciones";
      ["A", "B"].forEach(function (cual) {
        var b = document.createElement("button");
        b.textContent = "Árbol " + cual;
        b.addEventListener("click", function () { elegirTexto(t.id, cual, b); });
        ops.appendChild(b);
      });
      fila.appendChild(ops);

      var ver = document.createElement("div");
      ver.className = "veredicto";
      ver.id = "ver-texto-" + t.id;
      fila.appendChild(ver);

      caja.appendChild(fila);
    });
  }

  function elegirTexto(id, cual, boton) {
    var res = revisarTexto(id, cual);
    var ver = document.getElementById("ver-texto-" + id);
    var fila = document.getElementById("caso-" + id);
    fila.querySelectorAll(".opciones button").forEach(function (o) { o.className = ""; });
    boton.className = res.ok ? "primario" : "errada";
    ver.className = res.ok ? "veredicto bien" : "veredicto mal";
    ver.textContent = res.msg;
    if (res.ok) {
      textosListos[id] = true;
      fila.classList.add("listo");
    }
    document.getElementById("marcador-textos").textContent =
      "textos asignados: " + contarTextos() + " de " + TEXTOS.length;
    if (contarTextos() === TEXTOS.length) {
      document.getElementById("carta-tres").classList.remove("bloqueado");
    }
  }

  document.getElementById("codigo-eval").appendChild(panelCodigo(CODIGO_EVAL));
  construirArboles();
  document.getElementById("marcador-valores").textContent = "árboles evaluados: 0 de 2";

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-tres");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      b.className = b.getAttribute("data-razon") === "ok" ? "primario" : "errada";
      if (b.getAttribute("data-razon") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. El caso de Suma y el de Prod pegan los dos lados " +
          "con su operador y nada más, así que la cadena sale igual desde los dos " +
          "árboles. Quien lee \"1 + 2 * 3\" completa lo que falta con la precedencia " +
          "que aprendió en aritmética, y esa regla no está escrita en ninguna parte " +
          "del dato.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
