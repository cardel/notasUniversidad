/* El interpretador de la sesión de procedimientos, escrito en JavaScript
   para poder mostrar lo que hace: el lenguaje con condicionales, ligadura
   local múltiple, procedimientos y clausuras, en la notación de listas que
   reciben parse y value-of.

      (+ e e) (- e e) (* e e) (add1 e) (sub1 e) (zero? e) (> e e) (< e e)
      true   false   (if e then e else e)
      (let id = e  id = e … in e)   (proc (id …) e)   (e e …)

   El ambiente inicial liga x = 4, y = 2, z = 5.

   Dos reglas de alcance: con alcance estático —el del lenguaje— el cuerpo
   de un procedimiento se evalúa en el ambiente que la clausura capturó;
   con alcance dinámico, en el de quien la llama. La segunda existe para
   poder contrastarlas sobre el mismo programa. */
var InterpreteClausuras = (function () {
  "use strict";

  /* Cuántos operandos lee cada primitiva. La suma y el producto son
     asociativos y recorren todos los que lleguen, como en (+ a b c f g);
     las demás leen los que necesitan y no verifican cuántos llegaron, igual
     que el interpretador de la sesión: si sobran los ignoran y si faltan
     fallan al leerlos. */
  var PRIMITIVAS = {
    "+": "varios", "*": "varios", "-": 2, ">": 2, "<": 2,
    "add1": 1, "sub1": 1, "zero?": 1
  };

  /* --- Lector de s-expresiones -------------------------------------- */
  function leer(texto) {
    var i = 0;
    function espacios() {
      while (i < texto.length && (/\s/.test(texto[i]) || texto[i] === "%")) {
        if (texto[i] === "%") { while (i < texto.length && texto[i] !== "\n") { i++; } }
        else { i++; }
      }
    }
    function forma() {
      espacios();
      if (i >= texto.length) { throw new Error("El programa se acabó antes de tiempo."); }
      if (texto[i] === "(") {
        i++;
        var lista = [];
        for (;;) {
          espacios();
          if (i >= texto.length) { throw new Error("Falta un paréntesis de cierre."); }
          if (texto[i] === ")") { i++; return lista; }
          lista.push(forma());
        }
      }
      if (texto[i] === ")") { throw new Error("Hay un paréntesis de cierre de más."); }
      var j = i;
      while (j < texto.length && !/[\s()]/.test(texto[j])) { j++; }
      var pieza = texto.slice(i, j);
      i = j;
      return /^-?\d+$/.test(pieza) ? parseInt(pieza, 10) : { simbolo: pieza };
    }
    var r = forma();
    espacios();
    if (i < texto.length) { throw new Error("Sobra texto después de la expresión: " + texto.slice(i).trim()); }
    return r;
  }

  function esSimbolo(s, nombre) {
    return s && s.simbolo !== undefined && (nombre === undefined || s.simbolo === nombre);
  }

  /* --- Parser: de la lista al árbol de sintaxis abstracta ----------- */
  function parsear(s) {
    if (typeof s === "number") { return { v: "const-exp", campos: [s] }; }
    if (esSimbolo(s)) {
      if (s.simbolo === "true") { return { v: "true-exp", campos: [] }; }
      if (s.simbolo === "false") { return { v: "false-exp", campos: [] }; }
      return { v: "var-exp", campos: [s.simbolo] };
    }
    if (!s.length) { throw new Error("La lista vacía no es una expresión."); }
    var cabeza = s[0];
    if (esSimbolo(cabeza) && PRIMITIVAS[cabeza.simbolo] !== undefined) {
      return { v: "prim-exp", campos: [cabeza.simbolo, s.slice(1).map(parsear)] };
    }
    if (esSimbolo(cabeza, "if")) {
      if (s.length !== 6 || !esSimbolo(s[2], "then") || !esSimbolo(s[4], "else")) {
        throw new Error("Un if se escribe (if e then e else e).");
      }
      return { v: "if-exp", campos: [parsear(s[1]), parsear(s[3]), parsear(s[5])] };
    }
    if (esSimbolo(cabeza, "let")) {
      var ids = [], rands = [], k = 1;
      while (k < s.length && !esSimbolo(s[k], "in")) {
        if (!esSimbolo(s[k])) { throw new Error("Un let liga identificadores."); }
        if (!esSimbolo(s[k + 1], "=")) { throw new Error("Falta el = de una ligadura del let."); }
        ids.push(s[k].simbolo);
        rands.push(parsear(s[k + 2]));
        k += 3;
      }
      if (k >= s.length) { throw new Error("A este let le falta el in."); }
      if (k + 2 !== s.length) { throw new Error("Después del cuerpo del let sobra algo."); }
      return { v: "let-exp", campos: [ids, rands, parsear(s[k + 1])] };
    }
    if (esSimbolo(cabeza, "proc")) {
      if (s.length !== 3 || !Array.isArray(s[1])) {
        throw new Error("Un proc se escribe (proc (id …) cuerpo).");
      }
      return { v: "proc-exp", campos: [s[1].map(function (p) { return p.simbolo; }), parsear(s[2])] };
    }
    return { v: "call-exp", campos: [parsear(cabeza), s.slice(1).map(parsear)] };
  }

  /* --- Cómo se escribe cada cosa ------------------------------------ */
  function texto(n) {
    switch (n.v) {
      case "const-exp": return String(n.campos[0]);
      case "var-exp": return n.campos[0];
      case "true-exp": return "true";
      case "false-exp": return "false";
      case "prim-exp": return "(" + n.campos[0] + " " + n.campos[1].map(texto).join(" ") + ")";
      case "if-exp": return "(if " + texto(n.campos[0]) + " then " + texto(n.campos[1]) +
        " else " + texto(n.campos[2]) + ")";
      case "let-exp": return "(let " + n.campos[0].map(function (id, k) {
        return id + " = " + texto(n.campos[1][k]); }).join(" ") + " in " + texto(n.campos[2]) + ")";
      case "proc-exp": return "(proc (" + n.campos[0].join(" ") + ") " + texto(n.campos[1]) + ")";
      case "call-exp": return "(" + texto(n.campos[0]) +
        (n.campos[1].length ? " " + n.campos[1].map(texto).join(" ") : "") + ")";
    }
    return "?";
  }

  /* El árbol en la forma que dibuja dibujar-arbol.js. */
  function arbolTexto(n) {
    switch (n.v) {
      case "const-exp": case "var-exp": return "(" + n.v + " " + n.campos[0] + ")";
      case "true-exp": case "false-exp": return "(" + n.v + ")";
      case "prim-exp": return "(" + n.v + " " + n.campos[0] + " (" +
        n.campos[1].map(arbolTexto).join(" ") + "))";
      case "if-exp": return "(" + n.v + " " + n.campos.map(arbolTexto).join(" ") + ")";
      case "let-exp": return "(" + n.v + " (" + n.campos[0].join(" ") + ") (" +
        n.campos[1].map(arbolTexto).join(" ") + ") " + arbolTexto(n.campos[2]) + ")";
      case "proc-exp": return "(" + n.v + " (" + n.campos[0].join(" ") + ") " +
        arbolTexto(n.campos[1]) + ")";
      case "call-exp": return "(" + n.v + " " + arbolTexto(n.campos[0]) + " (" +
        n.campos[1].map(arbolTexto).join(" ") + "))";
    }
    return "?";
  }

  function escribir(v) {
    if (v === true) { return "#t"; }
    if (v === false) { return "#f"; }
    if (v && v.clausura) {
      return "(closure (" + v.ids.join(" ") + ") " + texto(v.cuerpo) + " " + v.env.nombre + ")";
    }
    return String(v);
  }

  /* --- Ambientes ----------------------------------------------------- */
  function ambienteInicial() {
    return { nombre: "env0", ligaduras: [["x", 4], ["y", 2], ["z", 5]], viejo: null };
  }

  /* --- Evaluador ------------------------------------------------------ */
  function evaluar(arbol, opciones) {
    opciones = opciones || {};
    var dinamico = !!opciones.dinamico;
    var traza = [], creados = 0, clausuras = [], masProfundo = null, ultimaLlamada = null;
    var cuenta = { valueOf: 0, applyProc: 0, variables: 0, ambientes: 0, clausuras: 0 };

    /* Una búsqueda por cada variable que se evalúa, y aparte los eslabones
       que hubo que recorrer para encontrarla. */
    function buscar(env, id) {
      cuenta.variables++;
      var e = env;
      while (e) {
        for (var i = 0; i < e.ligaduras.length; i++) {
          if (e.ligaduras[i][0] === id) { return e.ligaduras[i][1]; }
        }
        e = e.viejo;
      }
      throw new Error("La variable " + id + " no está ligada en el ambiente.");
    }

    function extender(env, ids, vals) {
      creados++;
      cuenta.ambientes++;
      var nuevo = { nombre: "env" + creados, viejo: env,
                    ligaduras: ids.filter(function (id, k) { return k < vals.length; })
                                  .map(function (id, k) { return [id, vals[k]]; }) };
      if (!masProfundo || hondura(nuevo) >= hondura(masProfundo)) { masProfundo = nuevo; }
      return nuevo;
    }

    /* Cuántos eslabones tiene la cadena, para quedarse con la más larga. */
    function hondura(env) {
      var n = 0;
      while (env) { n++; env = env.viejo; }
      return n;
    }

    function aplicarPrim(prim, args) {
      var n = PRIMITIVAS[prim];
      if (n === "varios" ? !args.length : args.length < n) {
        throw new Error("La primitiva " + prim + " lee " +
          (n === "varios" ? "al menos un operando" : n + " operando(s)") +
          " y solo le llegaron " + args.length + ".");
      }
      switch (prim) {
        case "+": return args.reduce(function (a, b) { return a + b; });
        case "-": return args[0] - args[1];
        case "*": return args.reduce(function (a, b) { return a * b; });
        case ">": return args[0] > args[1];
        case "<": return args[0] < args[1];
        case "add1": return args[0] + 1;
        case "sub1": return args[0] - 1;
        case "zero?": return args[0] === 0;
      }
    }

    /* No se verifica cuántos argumentos llegaron: los que sobran se
       ignoran y, si faltan, el parámetro se queda sin ligar y el error
       aparece cuando el cuerpo lo use. */
    function aplicarProc(proc, args, envLlamada) {
      cuenta.applyProc++;
      var base = dinamico ? envLlamada : proc.env;
      var dentro = extender(base, proc.ids, args);
      ultimaLlamada = dentro;
      return valueOf(proc.cuerpo, dentro);
    }

    function anotar(exp, env, valor, nota) {
      traza.push({ expresion: texto(exp), ambiente: env.nombre, valor: escribir(valor),
                   env: env, consulta: exp.v === "var-exp", nota: nota || "" });
    }

    function valueOf(exp, env) {
      cuenta.valueOf++;
      var valor;
      switch (exp.v) {
        case "const-exp": valor = exp.campos[0]; break;
        case "true-exp": valor = true; break;
        case "false-exp": valor = false; break;
        case "var-exp": valor = buscar(env, exp.campos[0]); break;
        case "prim-exp":
          valor = aplicarPrim(exp.campos[0], exp.campos[1].map(function (r) { return valueOf(r, env); }));
          break;
        case "if-exp":
          var prueba = valueOf(exp.campos[0], env);
          if (typeof prueba !== "boolean") {
            throw new Error("La prueba de un if debe ser booleana y llegó " + escribir(prueba) + ".");
          }
          valor = valueOf(exp.campos[prueba ? 1 : 2], env);
          break;
        case "let-exp":
          var vals = exp.campos[1].map(function (r) { return valueOf(r, env); });
          var nuevo = extender(env, exp.campos[0], vals);
          traza.push({ creacion: true, ambiente: nuevo.nombre, env: nuevo,
                       expresion: "se crea " + nuevo.nombre + " = [" +
                         exp.campos[0].map(function (id, k) { return id + "=" + escribir(vals[k]); }).join(", ") +
                         "]" + env.nombre });
          valor = valueOf(exp.campos[2], nuevo);
          break;
        case "proc-exp":
          cuenta.clausuras++;
          valor = { clausura: true, ids: exp.campos[0], cuerpo: exp.campos[1], env: env };
          clausuras.push({ texto: escribir(valor), env: env, creada: texto(exp) });
          break;
        case "call-exp":
          var proc = valueOf(exp.campos[0], env);
          var args = exp.campos[1].map(function (r) { return valueOf(r, env); });
          if (!(proc && proc.clausura)) {
            throw new Error("El operador no es un procedimiento: " + escribir(proc) + ".");
          }
          valor = aplicarProc(proc, args, env);
          break;
      }
      anotar(exp, env, valor);
      return valor;
    }

    var env0 = ambienteInicial();
    var valor = valueOf(arbol, env0);
    return { valor: valor, texto: escribir(valor), traza: traza, cuenta: cuenta,
             env0: env0, clausuras: clausuras, masProfundo: masProfundo || env0,
             ultimaLlamada: ultimaLlamada, dinamico: dinamico };
  }

  function ejecutar(programa, opciones) {
    var salida = { programa: programa };
    var s;
    try { s = leer(programa); } catch (e) { salida.error = e.message; salida.etapa = "lectura"; return salida; }
    try { salida.arbol = parsear(s); salida.arbolTexto = arbolTexto(salida.arbol); }
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
     se nombre, escrita del eslabón más nuevo al más viejo. Sirve para pedir
     «dibuje la cadena cuando se evalúa (+ k y)». */
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

  return { leer: leer, parsear: parsear, evaluar: evaluar, ejecutar: ejecutar,
           texto: texto, escribir: escribir, arbolTexto: arbolTexto,
           cadenaEn: cadenaEn };
})();

if (typeof module !== "undefined") { module.exports = InterpreteClausuras; }
