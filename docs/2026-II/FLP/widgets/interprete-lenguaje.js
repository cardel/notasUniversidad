/* El interpretador de la sesión, escrito en JavaScript para poder mostrar sus
   etapas en la página: el scanner, el parser y el evaluador del lenguaje de
   expresiones aritméticas con variables y ligadura local.

   Calca el comportamiento del interpretador en Racket con SLLGEN, incluidas
   sus tres decisiones observables: los literales de la gramática se
   reconocen antes que los identificadores (por eso add1 no sirve como nombre
   de variable), el signo menos pegado a un dígito es parte del número, y las
   primitivas no verifican cuántos operandos reciben.

   Expone: tokenizar, parsear, evaluar, y ejecutar, que hace las tres y
   devuelve también la traza y los conteos. */
var InterpreteLenguaje = (function () {
  "use strict";

  /* Los literales de la gramática, del más largo al más corto: el scanner
     toma el bocado más largo que coincida. */
  var LITERALES = ["add1", "sub1", "let", "in", "+", "-", "*", "(", ")", ",", "="];
  var PALABRAS = { "let": 1, "in": 1, "add1": 1, "sub1": 1 };
  var PRIMITIVAS = { "+": "add-prim", "-": "substract-prim", "*": "mult-prim",
                     "add1": "incr-prim", "sub1": "decr-prim" };

  function esLetra(c) { return /[a-zA-Z]/.test(c); }
  function esDigito(c) { return /[0-9]/.test(c); }
  function esEspacio(c) { return /\s/.test(c); }

  /* --- Scanner ------------------------------------------------------
     Devuelve la lista de tokens, cada uno con su lexema y su clase. Los
     espacios y los comentarios no emiten token. */
  function tokenizar(texto) {
    var tokens = [], i = 0;
    while (i < texto.length) {
      var c = texto[i];
      if (esEspacio(c)) { i++; continue; }
      if (c === "%") { while (i < texto.length && texto[i] !== "\n") { i++; } continue; }

      /* Un menos pegado a un dígito es un número negativo. */
      if (c === "-" && esDigito(texto[i + 1] || "")) {
        var j = i + 1;
        while (j < texto.length && esDigito(texto[j])) { j++; }
        tokens.push({ lexema: texto.slice(i, j), clase: "número", valor: parseInt(texto.slice(i, j), 10) });
        i = j;
        continue;
      }
      if (esDigito(c)) {
        var k = i;
        while (k < texto.length && esDigito(texto[k])) { k++; }
        tokens.push({ lexema: texto.slice(i, k), clase: "número", valor: parseInt(texto.slice(i, k), 10) });
        i = k;
        continue;
      }
      /* Los literales de la gramática van antes que el identificador. Uno
         que se escribe con letras solo cuenta si no sigue otra letra o
         dígito: en «adding» no hay un add1 escondido. */
      var literal = null;
      for (var L = 0; L < LITERALES.length; L++) {
        var lit = LITERALES[L];
        if (texto.slice(i, i + lit.length) === lit) {
          var siguiente = texto[i + lit.length] || "";
          if (esLetra(lit[0]) && (esLetra(siguiente) || esDigito(siguiente) || siguiente === "?")) { continue; }
          literal = lit;
          break;
        }
      }
      if (literal) {
        tokens.push({ lexema: literal,
                      clase: PALABRAS[literal] ? "palabra reservada" : "literal" });
        i += literal.length;
        continue;
      }
      if (esLetra(c)) {
        var m = i;
        while (m < texto.length && (esLetra(texto[m]) || esDigito(texto[m]) || texto[m] === "?")) { m++; }
        tokens.push({ lexema: texto.slice(i, m), clase: "identificador" });
        i = m;
        continue;
      }
      throw new Error("El scanner no reconoce el carácter " + c + ".");
    }
    return tokens;
  }

  /* --- Parser -------------------------------------------------------
     Descendente recursivo sobre los tokens, una función por no terminal.
     Produce el árbol con las mismas variantes que genera SLLGEN. */
  function parsear(tokens) {
    var pos = 0;

    function mirar() { return tokens[pos]; }
    function fallar(que) {
      var t = mirar();
      throw new Error("El parser esperaba " + que +
        (t ? " y encontró " + t.lexema : " y el programa se acabó") + ".");
    }
    function comer(lexema) {
      var t = mirar();
      if (!t || t.lexema !== lexema) { fallar(lexema); }
      pos++;
      return t;
    }

    function expresion() {
      var t = mirar();
      if (!t) { fallar("una expresión"); }
      if (t.clase === "número") { pos++; return { v: "lit-exp", campos: [t.valor] }; }
      if (t.clase === "identificador") { pos++; return { v: "var-exp", campos: [t.lexema] }; }
      if (t.lexema === "let") {
        pos++;
        var id = mirar();
        if (!id || id.clase !== "identificador") { fallar("un identificador después de let"); }
        pos++;
        comer("=");
        var ligada = expresion();
        comer("in");
        var cuerpo = expresion();
        return { v: "let-exp", campos: [id.lexema, ligada, cuerpo] };
      }
      if (PRIMITIVAS[t.lexema]) {
        pos++;
        var prim = { v: PRIMITIVAS[t.lexema], campos: [] };
        comer("(");
        var rands = [];
        if (mirar() && mirar().lexema !== ")") {
          rands.push(expresion());
          while (mirar() && mirar().lexema === ",") { pos++; rands.push(expresion()); }
        }
        comer(")");
        return { v: "primapp-exp", campos: [prim, { lista: rands }] };
      }
      fallar("una expresión");
    }

    var arbol = expresion();
    if (pos < tokens.length) {
      throw new Error("El parser terminó la expresión y todavía quedaban tokens, desde " +
                      tokens[pos].lexema + ".");
    }
    return { v: "a-program", campos: [arbol] };
  }

  /* El árbol como texto, que es lo que dibujar-arbol.js sabe leer. */
  function aTexto(n) {
    if (n === null || n === undefined) { return "?"; }
    if (typeof n === "number" || typeof n === "string") { return String(n); }
    if (n.lista) { return "(" + n.lista.map(aTexto).join(" ") + ")"; }
    if (!n.campos.length) { return "(" + n.v + ")"; }
    return "(" + n.v + " " + n.campos.map(aTexto).join(" ") + ")";
  }

  /* El programa en su sintaxis concreta, reconstruido desde el árbol. */
  function aPrograma(n) {
    switch (n.v) {
      case "a-program": return aPrograma(n.campos[0]);
      case "lit-exp": return String(n.campos[0]);
      case "var-exp": return n.campos[0];
      case "let-exp": return "let " + n.campos[0] + " = " + aPrograma(n.campos[1]) +
        " in " + aPrograma(n.campos[2]);
      case "primapp-exp":
        var nombre = Object.keys(PRIMITIVAS).filter(function (k) {
          return PRIMITIVAS[k] === n.campos[0].v;
        })[0];
        return nombre + "(" + n.campos[1].lista.map(aPrograma).join(", ") + ")";
    }
    return "?";
  }

  /* --- Ambientes ----------------------------------------------------
     Una cadena de eslabones. Cada uno se nombra ρ0, ρ1, … en el orden en
     que se crea, para poder señalarlos en la traza. */
  function ambienteInicial() {
    return { nombre: "ρ0", ligaduras: [["i", 1], ["v", 5], ["x", 10]], viejo: null };
  }
  function extender(env, id, valor, nombre) {
    return { nombre: nombre, ligaduras: [[id, valor]], viejo: env };
  }
  function buscar(env, id) {
    while (env) {
      for (var i = 0; i < env.ligaduras.length; i++) {
        if (env.ligaduras[i][0] === id) { return env.ligaduras[i][1]; }
      }
      env = env.viejo;
    }
    throw new Error("La variable " + id + " no está ligada en el ambiente.");
  }
  function textoAmbiente(env) {
    var partes = [];
    while (env) {
      partes.push("[" + env.ligaduras.map(function (l) { return l[0] + "=" + l[1]; }).join(", ") + "]");
      env = env.viejo;
    }
    return partes.join(" → ");
  }

  /* --- Evaluador ----------------------------------------------------
     Una fila de traza por cada llamada a eval-expression, anotada cuando
     termina: ahí es cuando se conoce el valor. */
  function evaluar(arbol) {
    var traza = [], creados = 0;
    var cuenta = { evalExp: 0, applyPrim: 0, applyEnv: 0 };

    function aplicar(prim, args) {
      cuenta.applyPrim++;
      switch (prim) {
        case "add-prim": return args[0] + args[1];
        case "substract-prim": return args[0] - args[1];
        case "mult-prim": return args[0] * args[1];
        case "incr-prim": return args[0] + 1;
        case "decr-prim": return args[0] - 1;
      }
    }

    function evalExp(exp, env, nivel) {
      cuenta.evalExp++;
      var mio = cuenta.evalExp, valor, consulta = false, prim = null;
      switch (exp.v) {
        case "lit-exp":
          valor = exp.campos[0];
          break;
        case "var-exp":
          cuenta.applyEnv++;
          consulta = true;
          valor = buscar(env, exp.campos[0]);
          break;
        case "primapp-exp":
          var args = exp.campos[1].lista.map(function (r) { return evalExp(r, env, nivel + 1); });
          prim = exp.campos[0].v;
          if (prim !== "incr-prim" && prim !== "decr-prim" && args.length < 2) {
            throw new Error("La primitiva recibió " + args.length +
              " operando(s) y lee dos: el interpretador de la sesión no verifica cuántos llegan, " +
              "así que aquí falla al leer el segundo.");
          }
          valor = aplicar(prim, args);
          break;
        case "let-exp":
          var ligado = evalExp(exp.campos[1], env, nivel + 1);
          creados++;
          var nuevo = extender(env, exp.campos[0], ligado, "ρ" + creados);
          traza.push({ n: 0, expresion: "se crea " + nuevo.nombre + " = [" + exp.campos[0] +
                       "=" + ligado + "]" + env.nombre, ambiente: "", valor: "", nivel: nivel,
                       creacion: true });
          valor = evalExp(exp.campos[2], nuevo, nivel + 1);
          break;
      }
      traza.push({ n: mio, expresion: aPrograma(exp), ambiente: env.nombre,
                   valor: valor, nivel: nivel, consulta: consulta, prim: prim });
      return valor;
    }

    var env0 = ambienteInicial();
    var valor = evalExp(arbol.campos[0], env0, 0);
    return { valor: valor, traza: traza, cuenta: cuenta, ambiente0: env0 };
  }

  /* Las tres etapas de una vez. Devuelve lo que la página muestra. */
  function ejecutar(texto) {
    var salida = { texto: texto };
    try {
      salida.tokens = tokenizar(texto);
    } catch (e) { salida.error = e.message; salida.etapa = "scanner"; return salida; }
    try {
      salida.arbol = parsear(salida.tokens);
      salida.arbolTexto = aTexto(salida.arbol.campos[0]);
    } catch (e) { salida.error = e.message; salida.etapa = "parser"; return salida; }
    try {
      var r = evaluar(salida.arbol);
      salida.valor = r.valor;
      salida.traza = r.traza;
      salida.cuenta = r.cuenta;
    } catch (e) { salida.error = e.message; salida.etapa = "interprete"; return salida; }
    return salida;
  }

  return { tokenizar: tokenizar, parsear: parsear, evaluar: evaluar,
           ejecutar: ejecutar, aTexto: aTexto, aPrograma: aPrograma,
           textoAmbiente: textoAmbiente };
})();

if (typeof module !== "undefined") { module.exports = InterpreteLenguaje; }
