/* El interpretador de procedimientos del curso, escrito en JavaScript para
   poder mostrar lo que hace. Calca al de `5.SemanticaProcedimientos`: su
   sintaxis, su semántica y sus verificaciones.

      <expresion> ::= <numero> | <identificador> | true | false
                  ::= if <exp> then <exp> else <exp>
                  ::= let {<id> = <exp>}* in <exp>
                  ::= proc ( {<id>}*(,) ) <exp>
                  ::= ( <exp> {<exp>}* )
                  ::= <primitiva> ( {<exp>}*(,) )
      <primitiva> ::= + | - | * | / | add1 | sub1 | > | >= | < | <= | ==

   El ambiente inicial es el del curso: [x=4, y=2, z=5] sobre
   [a=4, b=5, c=6] sobre el vacío.

   Acepta { dinamico: true } para evaluar con alcance dinámico, que no es la
   regla del lenguaje y está solo para contrastarla con la estática. */
var InterpreteClausuras = (function () {
  "use strict";

  var PRIMITIVAS = ["+", "-", "*", "/", "add1", "sub1", ">=", "<=", "==", ">", "<"];
  var PALABRAS = ["if", "then", "else", "let", "in", "proc", "true", "false"];

  /* --- Scanner ------------------------------------------------------- */
  function tokenizar(texto) {
    var tokens = [], i = 0;
    function letra(c) { return /[a-zA-Z]/.test(c); }
    function digito(c) { return /[0-9]/.test(c); }

    while (i < texto.length) {
      var c = texto[i];
      if (/\s/.test(c)) { i++; continue; }
      if (c === "%") { while (i < texto.length && texto[i] !== "\n") { i++; } continue; }

      /* Un menos pegado a un dígito es parte del número. */
      if ((digito(c)) || (c === "-" && digito(texto[i + 1] || ""))) {
        var j = i + (c === "-" ? 1 : 0);
        while (j < texto.length && digito(texto[j])) { j++; }
        if (texto[j] === "." && digito(texto[j + 1] || "")) {
          j++;
          while (j < texto.length && digito(texto[j])) { j++; }
        }
        tokens.push({ clase: "numero", lexema: texto.slice(i, j), valor: parseFloat(texto.slice(i, j)) });
        i = j;
        continue;
      }
      if (letra(c)) {
        var k = i;
        while (k < texto.length && (letra(texto[k]) || digito(texto[k]) ||
                                    texto[k] === "?" || texto[k] === "$")) { k++; }
        var palabra = texto.slice(i, k);
        tokens.push({ clase: PALABRAS.indexOf(palabra) !== -1 ? "palabra"
                            : PRIMITIVAS.indexOf(palabra) !== -1 ? "primitiva" : "identificador",
                      lexema: palabra });
        i = k;
        continue;
      }
      var prim = PRIMITIVAS.filter(function (p) {
        return !letra(p[0]) && texto.slice(i, i + p.length) === p;
      })[0];
      if (prim) { tokens.push({ clase: "primitiva", lexema: prim }); i += prim.length; continue; }
      if ("(),=".indexOf(c) !== -1) { tokens.push({ clase: "signo", lexema: c }); i++; continue; }
      throw new Error("El scanner no reconoce el carácter " + c + ".");
    }
    return tokens;
  }

  /* --- Parser --------------------------------------------------------- */
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

      if (t.clase === "numero") { pos++; return { v: "lit-exp", campos: [t.valor] }; }
      if (t.clase === "identificador") { pos++; return { v: "var-exp", campos: [t.lexema] }; }
      if (t.lexema === "true") { pos++; return { v: "true-exp", campos: [] }; }
      if (t.lexema === "false") { pos++; return { v: "false-exp", campos: [] }; }

      if (t.lexema === "if") {
        pos++;
        var prueba = expresion();
        comer("then");
        var siSi = expresion();
        comer("else");
        return { v: "if-exp", campos: [prueba, siSi, expresion()] };
      }
      if (t.lexema === "let") {
        pos++;
        var ids = [], rands = [];
        while (mirar() && mirar().clase === "identificador") {
          ids.push(mirar().lexema);
          pos++;
          comer("=");
          rands.push(expresion());
        }
        comer("in");
        return { v: "let-exp", campos: [ids, rands, expresion()] };
      }
      if (t.lexema === "proc") {
        pos++;
        comer("(");
        var params = [];
        if (mirar() && mirar().lexema !== ")") {
          params.push(comerIdentificador());
          while (mirar() && mirar().lexema === ",") { pos++; params.push(comerIdentificador()); }
        }
        comer(")");
        return { v: "proc-exp", campos: [params, expresion()] };
      }
      if (t.clase === "primitiva") {
        pos++;
        comer("(");
        var args = [];
        if (mirar() && mirar().lexema !== ")") {
          args.push(expresion());
          while (mirar() && mirar().lexema === ",") { pos++; args.push(expresion()); }
        }
        comer(")");
        return { v: "prim-exp", campos: [t.lexema, args] };
      }
      if (t.lexema === "(") {
        pos++;
        var rator = expresion();
        var rands2 = [];
        while (mirar() && mirar().lexema !== ")") { rands2.push(expresion()); }
        comer(")");
        return { v: "app-exp", campos: [rator, rands2] };
      }
      fallar("una expresión");
    }

    function comerIdentificador() {
      var t = mirar();
      if (!t || t.clase !== "identificador") { fallar("un identificador"); }
      pos++;
      return t.lexema;
    }

    var arbol = expresion();
    if (pos < tokens.length) {
      throw new Error("El parser terminó la expresión y todavía quedaban tokens, desde " +
                      tokens[pos].lexema + ".");
    }
    return arbol;
  }

  /* --- Cómo se escribe cada cosa -------------------------------------- */
  function texto(n) {
    switch (n.v) {
      case "lit-exp": return String(n.campos[0]);
      case "var-exp": return n.campos[0];
      case "true-exp": return "true";
      case "false-exp": return "false";
      case "prim-exp": return n.campos[0] + "(" + n.campos[1].map(texto).join(", ") + ")";
      case "if-exp": return "if " + texto(n.campos[0]) + " then " + texto(n.campos[1]) +
        " else " + texto(n.campos[2]);
      case "let-exp": return "let " + n.campos[0].map(function (id, k) {
        return id + " = " + texto(n.campos[1][k]); }).join(" ") + " in " + texto(n.campos[2]);
      case "proc-exp": return "proc(" + n.campos[0].join(", ") + ") " + texto(n.campos[1]);
      case "app-exp": return "(" + texto(n.campos[0]) +
        (n.campos[1].length ? " " + n.campos[1].map(texto).join(" ") : "") + ")";
    }
    return "?";
  }

  function escribir(v) {
    if (v === true) { return "#t"; }
    if (v === false) { return "#f"; }
    if (v && v.clausura) {
      return "(closure (" + v.ids.join(", ") + ") " + texto(v.cuerpo) + " " + v.env.nombre + ")";
    }
    return String(v);
  }

  /* --- Ambiente inicial del curso ------------------------------------- */
  function ambienteInicial() {
    return { nombre: "amb0", ligaduras: [["x", 4], ["y", 2], ["z", 5]],
             viejo: { nombre: "base", ligaduras: [["a", 4], ["b", 5], ["c", 6]], viejo: null } };
  }

  /* --- Evaluador ------------------------------------------------------ */
  function evaluar(arbol, opciones) {
    opciones = opciones || {};
    var dinamico = !!opciones.dinamico;
    var traza = [], creados = 0, clausuras = [], masProfundo = null, ultimaLlamada = null;
    var cuenta = { valueOf: 0, applyProc: 0, variables: 0, ambientes: 0, clausuras: 0 };

    function hondura(env) { var n = 0; while (env) { n++; env = env.viejo; } return n; }

    function buscar(env, id) {
      cuenta.variables++;
      var e = env;
      while (e) {
        for (var i = 0; i < e.ligaduras.length; i++) {
          if (e.ligaduras[i][0] === id) { return e.ligaduras[i][1]; }
        }
        e = e.viejo;
      }
      throw new Error("No se encontró la variable " + id + " en el ambiente.");
    }

    function extender(env, ids, vals) {
      creados++;
      cuenta.ambientes++;
      var nuevo = { nombre: "amb" + creados, viejo: env,
                    ligaduras: ids.map(function (id, k) { return [id, vals[k]]; }) };
      if (!masProfundo || hondura(nuevo) >= hondura(masProfundo)) { masProfundo = nuevo; }
      return nuevo;
    }

    /* Las primitivas del curso: + y * recorren todos los operandos, - y /
       toman el primero contra el resto, y las comparaciones los dos
       primeros. */
    function aplicarPrim(prim, args) {
      function pide(n) {
        if (args.length < n) {
          throw new Error("La primitiva " + prim + " lee " + n + " operando(s) y le llegaron " +
                          args.length + ".");
        }
      }
      switch (prim) {
        case "+": return args.reduce(function (a, b) { return a + b; }, 0);
        case "*": return args.reduce(function (a, b) { return a * b; }, 1);
        case "-": pide(1); return args[0] - args.slice(1).reduce(function (a, b) { return a + b; }, 0);
        case "/": pide(1); return args[0] / args.slice(1).reduce(function (a, b) { return a * b; }, 1);
        case "add1": pide(1); return args[0] + 1;
        case "sub1": pide(1); return args[0] - 1;
        case ">": pide(2); return args[0] > args[1];
        case ">=": pide(2); return args[0] >= args[1];
        case "<": pide(2); return args[0] < args[1];
        case "<=": pide(2); return args[0] <= args[1];
        case "==": pide(2); return args[0] === args[1];
      }
    }

    function anotar(exp, env, valor) {
      traza.push({ expresion: texto(exp), ambiente: env.nombre, valor: escribir(valor),
                   env: env, consulta: exp.v === "var-exp" });
    }

    function valueOf(exp, env) {
      cuenta.valueOf++;
      var valor;
      switch (exp.v) {
        case "lit-exp": valor = exp.campos[0]; break;
        case "true-exp": valor = true; break;
        case "false-exp": valor = false; break;
        case "var-exp": valor = buscar(env, exp.campos[0]); break;
        case "prim-exp":
          valor = aplicarPrim(exp.campos[0],
                              exp.campos[1].map(function (r) { return valueOf(r, env); }));
          break;
        case "if-exp":
          var prueba = valueOf(exp.campos[0], env);
          if (typeof prueba !== "boolean") {
            throw new Error("El test-exp debe ser un booleano y llegó " + escribir(prueba) + ".");
          }
          valor = valueOf(exp.campos[prueba ? 1 : 2], env);
          break;
        case "let-exp":
          var vals = exp.campos[1].map(function (r) { return valueOf(r, env); });
          var nuevo = extender(env, exp.campos[0], vals);
          traza.push({ creacion: true, ambiente: nuevo.nombre, env: nuevo,
                       expresion: "se crea " + nuevo.nombre + " = [" +
                         exp.campos[0].map(function (id, k) {
                           return id + "=" + escribir(vals[k]); }).join(", ") + "]" + env.nombre });
          valor = valueOf(exp.campos[2], nuevo);
          break;
        case "proc-exp":
          cuenta.clausuras++;
          valor = { clausura: true, ids: exp.campos[0], cuerpo: exp.campos[1], env: env };
          clausuras.push({ texto: escribir(valor), env: env, creada: texto(exp) });
          break;
        case "app-exp":
          /* El interpretador evalúa primero los operandos y después el
             operador, y verifica el procval y la cantidad de argumentos. */
          var args = exp.campos[1].map(function (r) { return valueOf(r, env); });
          var proc = valueOf(exp.campos[0], env);
          if (!(proc && proc.clausura)) {
            throw new Error("No puede evaluarse algo que no sea un procedimiento: " +
                            escribir(proc) + ".");
          }
          if (proc.ids.length !== args.length) {
            throw new Error("El número de argumentos no es correcto: debe enviar " +
                            proc.ids.length + " y usted ha enviado " + args.length + ".");
          }
          cuenta.applyProc++;
          var dentro = extender(dinamico ? env : proc.env, proc.ids, args);
          ultimaLlamada = dentro;
          valor = valueOf(proc.cuerpo, dentro);
          break;
      }
      anotar(exp, env, valor);
      return valor;
    }

    var amb0 = ambienteInicial();
    var valor = valueOf(arbol, amb0);
    return { valor: valor, texto: escribir(valor), traza: traza, cuenta: cuenta,
             env0: amb0, clausuras: clausuras, masProfundo: masProfundo || amb0,
             ultimaLlamada: ultimaLlamada, dinamico: dinamico };
  }

  function ejecutar(programa, opciones) {
    var salida = { programa: programa };
    var tokens;
    try { tokens = tokenizar(programa); salida.tokens = tokens; }
    catch (e) { salida.error = e.message; salida.etapa = "scanner"; return salida; }
    try { salida.arbol = parsear(tokens); }
    catch (e) { salida.error = e.message; salida.etapa = "parser"; return salida; }
    try {
      var r = evaluar(salida.arbol, opciones);
      salida.valor = r.valor; salida.texto = r.texto;
      salida.traza = r.traza; salida.cuenta = r.cuenta;
      salida.clausuras = r.clausuras; salida.masProfundo = r.masProfundo;
      salida.ultimaLlamada = r.ultimaLlamada; salida.env0 = r.env0;
    } catch (e) { salida.error = e.message; salida.etapa = "evaluador"; return salida; }
    return salida;
  }

  /* La cadena de ambientes en el momento en que se evalúa la expresión que
     se nombre, del eslabón más nuevo al más viejo. */
  function cadenaEn(salida, expresion) {
    if (!salida.traza) { return null; }
    var fila = salida.traza.filter(function (f) {
      return !f.creacion && f.expresion === expresion;
    })[0];
    if (!fila) { return null; }
    var cadena = [], env = fila.env;
    while (env) { cadena.push(env); env = env.viejo; }
    return cadena;
  }

  return { tokenizar: tokenizar, parsear: parsear, evaluar: evaluar, ejecutar: ejecutar,
           texto: texto, escribir: escribir, cadenaEn: cadenaEn };
})();

if (typeof module !== "undefined") { module.exports = InterpreteClausuras; }
