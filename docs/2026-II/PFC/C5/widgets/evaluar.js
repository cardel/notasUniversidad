/* evaluar: la reducción de eval sobre Suma(Prod(Numero(2), Numero(3)),
   Resta(Numero(10), Numero(4))). El estudiante elige en cada paso cuál de tres
   expresiones sigue. El código y los cinco casos del match salen de
   10_expresiones.scala. Medido con scala-cli -S 2.13: eval de la expresión
   completa da 12, eval(Prod(Numero(2), Numero(3))) da 6 y
   eval(Resta(Numero(10), Numero(4))) da 6. */
(function () {

  /* ── El tipo Expr ──────────────────────────────────────────────── */

  function numero(n) { return { k: "Numero", n: n }; }
  function nodo(k, a, b) { return { k: k, a: a, b: b }; }

  var OPERADOR = { Suma: "+", Resta: "-", Prod: "*", Div: "/" };
  /* El operador que un caso vecino pondría en su lugar. */
  var OPERADOR_VECINO = { Suma: "*", Resta: "+", Prod: "+", Div: "*" };

  function mostrarExpr(e) {
    if (e.k === "Numero") { return "Numero(" + e.n + ")"; }
    return e.k + "(" + mostrarExpr(e.a) + ", " + mostrarExpr(e.b) + ")";
  }

  var EXPRESION = nodo("Suma",
    nodo("Prod", numero(2), numero(3)),
    nodo("Resta", numero(10), numero(4)));

  /* ── Los términos de la reducción ──────────────────────────────── */
  /* ent: un entero ya calculado; pendiente: una llamada eval sin resolver;
     aritmetica: una operación entre dos términos; texto: lo que un paso mal
     dado deja escrito. */

  function ent(v) { return { t: "ent", v: v }; }
  function pendiente(e) { return { t: "pendiente", e: e }; }
  function aritmetica(s, a, b) { return { t: "aritmetica", s: s, a: a, b: b }; }
  function texto(txt) { return { t: "texto", txt: txt }; }

  function mostrarTermino(t, raiz) {
    if (t.t === "ent") { return String(t.v); }
    if (t.t === "texto") { return t.txt; }
    if (t.t === "pendiente") { return "eval(" + mostrarExpr(t.e) + ")"; }
    var cuerpo = mostrarTermino(t.a, false) + " " + t.s + " " + mostrarTermino(t.b, false);
    return raiz ? cuerpo : "(" + cuerpo + ")";
  }

  function calcular(s, x, y) {
    if (s === "+") { return x + y; }
    if (s === "-") { return x - y; }
    if (s === "*") { return x * y; }
    return Math.trunc(x / y);
  }

  /* Una operación con los dos lados ya en entero se calcula en el mismo paso.
     Con invertido en true los lados de la resta y la división cambian de sitio,
     que es lo que deja un caso escrito al revés. */
  function plegar(t, invertido) {
    var a, b;
    if (t.t !== "aritmetica") { return t; }
    a = plegar(t.a, invertido);
    b = plegar(t.b, invertido);
    if (a.t === "ent" && b.t === "ent") {
      if (invertido && (t.s === "-" || t.s === "/")) {
        return ent(calcular(t.s, b.v, a.v));
      }
      return ent(calcular(t.s, a.v, b.v));
    }
    return aritmetica(t.s, a, b);
  }

  /* La llamada eval que sigue: la de más a la izquierda, o la de más a la
     derecha para quien resuelve primero la otra rama. */
  function llamadaPendiente(t, lado) {
    var hallada = null;
    function recorrer(x) {
      if (hallada !== null) { return; }
      if (x.t === "pendiente") { hallada = x; return; }
      if (x.t === "aritmetica") {
        if (lado === "derecha") { recorrer(x.b); recorrer(x.a); }
        else { recorrer(x.a); recorrer(x.b); }
      }
    }
    recorrer(t);
    return hallada;
  }

  function reemplazar(t, objetivo, nuevo) {
    if (t === objetivo) { return nuevo; }
    if (t.t === "aritmetica") {
      return aritmetica(t.s, reemplazar(t.a, objetivo, nuevo),
        reemplazar(t.b, objetivo, nuevo));
    }
    return t;
  }

  /* El cuerpo del caso que coincide con la expresión, según el modo:
     recto      el del archivo del deck;
     otroCaso   el operador de un caso vecino;
     sinLlamada el cuerpo sin volver a llamar eval sobre los hijos;
     nodoEntero Numero(n) devuelto como nodo en lugar del entero n. */
  function cuerpoDelCaso(e, modo) {
    if (e.k === "Numero") {
      if (modo === "nodoEntero") { return texto("Numero(" + e.n + ")"); }
      return ent(e.n);
    }
    if (modo === "sinLlamada") {
      return aritmetica(OPERADOR[e.k], texto(mostrarExpr(e.a)), texto(mostrarExpr(e.b)));
    }
    if (modo === "otroCaso") {
      return aritmetica(OPERADOR_VECINO[e.k], pendiente(e.a), pendiente(e.b));
    }
    return aritmetica(OPERADOR[e.k], pendiente(e.a), pendiente(e.b));
  }

  /* Un paso de la reducción. Devuelve el término nuevo y el caso del match que
     coincidió, que es lo que lleva la cuenta del panel de código. */
  function reducir(t, modo, lado) {
    var llamada = llamadaPendiente(t, lado || "izquierda");
    var reemplazado;
    if (llamada === null) { return null; }
    reemplazado = reemplazar(t, llamada, cuerpoDelCaso(llamada.e, modo || "recto"));
    return {
      termino: plegar(reemplazado, modo === "ordenVolteado"),
      caso: llamada.e.k
    };
  }

  /* La reducción completa, de la expresión al entero. */
  function secuencia(expr) {
    var pasos = [{ termino: pendiente(expr), caso: null }];
    var siguiente = reducir(pasos[0].termino, "recto", "izquierda");
    while (siguiente !== null) {
      pasos.push(siguiente);
      siguiente = reducir(siguiente.termino, "recto", "izquierda");
    }
    return pasos;
  }

  var PASOS = secuencia(EXPRESION);

  /* Los dos distractores de cada paso, con la familia de la que salen. */
  var DISTRACTORES = [
    [{ modo: "otroCaso", lado: "izquierda" }, { modo: "sinLlamada", lado: "izquierda" }],
    [{ modo: "recto", lado: "derecha" }, { modo: "otroCaso", lado: "izquierda" }],
    [{ modo: "recto", lado: "derecha" }, { modo: "nodoEntero", lado: "izquierda" }],
    [{ modo: "recto", lado: "derecha" }, { modo: "nodoEntero", lado: "izquierda" }],
    [{ modo: "otroCaso", lado: "izquierda" }, { modo: "sinLlamada", lado: "izquierda" }],
    [{ modo: "recto", lado: "derecha" }, { modo: "nodoEntero", lado: "izquierda" }],
    [{ modo: "nodoEntero", lado: "izquierda" }, { modo: "ordenVolteado", lado: "izquierda" }]
  ];

  var RETRO = {
    "recto-derecha": "Esa reducción llega al mismo 12, pero no es la que corre " +
      "ahora: en eval(e1) + eval(e2) el operando izquierdo se evalúa primero y " +
      "la rama derecha espera su turno.",
    "otroCaso": "El operador lo pone el caso que coincidió, y hay uno por cada " +
      "forma del tipo. Con otro operador se está respondiendo por otra expresión.",
    "sinLlamada": "El cuerpo del caso vuelve a llamar eval sobre cada hijo. Sin " +
      "esas llamadas queda una Expr donde la operación espera un Int, y eso no compila.",
    "nodoEntero": "case Numero(n) => n entrega el entero que venía adentro. " +
      "Numero(3) es una Expr; lo que entra en la operación es el 3.",
    "ordenVolteado": "case Resta(e1, e2) => eval(e1) - eval(e2) le quita el " +
      "derecho al izquierdo: 10 - 4. Volteados dan -6 y la suma cierra en 0."
  };

  function clave(d) {
    return d.modo === "recto" ? "recto-" + d.lado : d.modo;
  }

  /* Las tres opciones de un paso: la correcta sale de la reducción, nunca de
     una lista escrita a mano. */
  function opciones(i) {
    var lista = [{
      texto: mostrarTermino(PASOS[i + 1].termino, true),
      correcta: true,
      familia: "recto-izquierda"
    }];
    DISTRACTORES[i].forEach(function (d) {
      var r = reducir(PASOS[i].termino, d.modo, d.lado);
      lista.push({
        texto: mostrarTermino(r.termino, true),
        correcta: false,
        familia: clave(d)
      });
    });
    /* Un giro fijo por paso: la correcta no cae siempre en el mismo sitio. */
    return lista.slice(i % 3).concat(lista.slice(0, i % 3));
  }

  /* Cuántas veces corrió cada caso del match hasta el paso k. */
  function conteos(k) {
    var cuenta = {};
    var i;
    for (i = 1; i <= k; i = i + 1) {
      cuenta[PASOS[i].caso] = (cuenta[PASOS[i].caso] || 0) + 1;
    }
    return cuenta;
  }

  var CODIGO = [
    { txt: "def eval(e: Expr): Int = e match {", caso: null },
    { txt: "  case Numero(n)     => n", caso: "Numero" },
    { txt: "  case Suma(e1, e2)  => eval(e1) + eval(e2)", caso: "Suma" },
    { txt: "  case Resta(e1, e2) => eval(e1) - eval(e2)", caso: "Resta" },
    { txt: "  case Prod(e1, e2)  => eval(e1) * eval(e2)", caso: "Prod" },
    { txt: "  case Div(e1, e2)   => eval(e1) / eval(e2)", caso: "Div" },
    { txt: "}", caso: null }
  ];

  var API = {
    numero: numero, nodo: nodo, mostrarExpr: mostrarExpr,
    mostrarTermino: mostrarTermino, plegar: plegar, reducir: reducir,
    secuencia: secuencia, opciones: opciones, conteos: conteos,
    EXPRESION: EXPRESION, PASOS: PASOS, CODIGO: CODIGO, RETRO: RETRO
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ── La página ─────────────────────────────────────────────────── */

  var k = 0;
  var errores = 0;

  function construirCodigo() {
    var panel = document.getElementById("panel-codigo");
    CODIGO.forEach(function (l, idx) {
      var div = document.createElement("div");
      var num = document.createElement("span");
      var txt = document.createElement("span");
      var cont;
      div.className = "linea";
      div.id = "linea-" + idx;
      num.className = "num";
      num.textContent = String(idx + 1);
      txt.className = "txt";
      txt.textContent = l.txt;
      div.appendChild(num);
      div.appendChild(txt);
      if (l.caso !== null) {
        cont = document.createElement("span");
        cont.className = "cont";
        cont.id = "cont-" + l.caso;
        cont.textContent = "× 0";
        div.appendChild(cont);
      }
      panel.appendChild(div);
    });
  }

  function pintarCodigo() {
    var cuenta = conteos(k);
    var casoActual = k > 0 ? PASOS[k].caso : null;
    CODIGO.forEach(function (l, idx) {
      var div = document.getElementById("linea-" + idx);
      var badge;
      div.classList.remove("actual");
      if (l.caso === null) { return; }
      badge = document.getElementById("cont-" + l.caso);
      badge.textContent = "× " + (cuenta[l.caso] || 0);
      badge.className = cuenta[l.caso] ? "cont activo" : "cont";
      if (l.caso === casoActual) { div.classList.add("actual"); }
    });
  }

  function pintarHistoria() {
    var caja = document.getElementById("historia");
    var i;
    caja.innerHTML = "";
    for (i = 0; i <= k; i = i + 1) {
      var fila = document.createElement("div");
      fila.className = "termino" + (i === k ? " vigente" : "");
      var flecha = document.createElement("span");
      flecha.className = "flecha-paso";
      flecha.textContent = i === 0 ? "   " : "→";
      var cuerpo = document.createElement("span");
      cuerpo.textContent = mostrarTermino(PASOS[i].termino, true);
      fila.appendChild(flecha);
      fila.appendChild(cuerpo);
      caja.appendChild(fila);
    }
  }

  function pintarMarcador() {
    document.getElementById("marcador").textContent =
      "pasos resueltos: " + k + " de " + (PASOS.length - 1) +
      "    ·    pasos mal elegidos: " + errores;
  }

  function pintarOpciones() {
    var caja = document.getElementById("opciones");
    var ver = document.getElementById("veredicto");
    caja.innerHTML = "";
    ver.className = "veredicto";
    ver.textContent = "";
    if (k >= PASOS.length - 1) {
      document.getElementById("rotulo-opciones").textContent =
        "La reducción llegó a " + mostrarTermino(PASOS[PASOS.length - 1].termino, true) + ".";
      document.getElementById("carta-tres").classList.remove("bloqueado");
      return;
    }
    document.getElementById("rotulo-opciones").textContent =
      "¿Cuál de las tres sigue?";
    opciones(k).forEach(function (o, j) {
      var b = document.createElement("button");
      b.textContent = o.texto;
      b.addEventListener("click", function () { elegir(o, b); });
      caja.appendChild(b);
    });
  }

  function elegir(o, boton) {
    var ver = document.getElementById("veredicto");
    if (o.correcta) {
      k = k + 1;
      pintarCodigo();
      pintarHistoria();
      pintarOpciones();
      pintarMarcador();
      return;
    }
    errores = errores + 1;
    boton.className = "errada";
    boton.disabled = true;
    ver.className = "veredicto mal";
    ver.textContent = RETRO[o.familia];
    pintarMarcador();
  }

  construirCodigo();
  pintarCodigo();
  pintarHistoria();
  pintarOpciones();
  pintarMarcador();

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-tres");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      b.className = b.getAttribute("data-razon") === "ok" ? "primario" : "errada";
      if (b.getAttribute("data-razon") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. Las cuatro hojas del árbol son Numero(2), " +
          "Numero(3), Numero(10) y Numero(4), y el caso de Numero corrió cuatro " +
          "veces. Los otros tres casos corrieron una vez cada uno, tantas como " +
          "nodos de su forma hay, y el de Div no corrió porque no hay ninguna división.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
