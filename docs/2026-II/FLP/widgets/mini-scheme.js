/* Un evaluador de Scheme pequeño, suficiente para la recursión estructural
   sobre listas que se trabaja en clase. No es Racket: no hay define-datatype
   ni cases, y el subconjunto se queda en lo que cabe en una sesión. Sirve
   para probar ideas sin salir del navegador; lo que se entrega se escribe en
   DrRacket. */
var MiniScheme = (function () {
  "use strict";

  /* --- Valores ---------------------------------------------------- */
  function Simbolo(nombre) { this.nombre = nombre; }
  var TABLA_SIMBOLOS = {};
  function simbolo(nombre) {
    if (!Object.prototype.hasOwnProperty.call(TABLA_SIMBOLOS, nombre)) {
      TABLA_SIMBOLOS[nombre] = new Simbolo(nombre);
    }
    return TABLA_SIMBOLOS[nombre];
  }
  function Par(car, cdr) { this.car = car; this.cdr = cdr; }
  var NULO = { nulo: true };
  function Cierre(params, resto, cuerpo, amb, nombre) {
    this.params = params; this.resto = resto; this.cuerpo = cuerpo;
    this.amb = amb; this.nombre = nombre || "procedimiento anónimo";
  }
  function Primitiva(nombre, minimo, maximo, fn) {
    this.nombre = nombre; this.minimo = minimo; this.maximo = maximo; this.fn = fn;
  }
  /* Un tipo declarado con define-datatype: su nombre y, por cada variante,
     los nombres de sus campos y las expresiones de sus predicados. */
  function TipoDato(nombre, predicado) {
    this.nombre = nombre; this.predicado = predicado; this.variantes = Object.create(null);
  }
  /* Un valor construido con uno de los constructores del tipo. */
  function Dato(tipo, variante, campos) {
    this.tipo = tipo; this.variante = variante; this.campos = campos;
  }

  function ErrorScheme(mensaje) { this.mensaje = mensaje; }
  function fallar(mensaje) { throw new ErrorScheme(mensaje); }

  function lista() {
    var r = NULO;
    for (var i = arguments.length - 1; i >= 0; i--) { r = new Par(arguments[i], r); }
    return r;
  }
  function desdeArreglo(xs) {
    var r = NULO;
    for (var i = xs.length - 1; i >= 0; i--) { r = new Par(xs[i], r); }
    return r;
  }
  function aArreglo(v) {
    var xs = [];
    while (v instanceof Par) { xs.push(v.car); v = v.cdr; }
    return xs;
  }
  function esLista(v) {
    while (v instanceof Par) { v = v.cdr; }
    return v === NULO;
  }

  /* --- Lectura ---------------------------------------------------- */
  function tokenizar(texto) {
    var tokens = [], i = 0;
    while (i < texto.length) {
      var c = texto[i];
      if (c === ";") { while (i < texto.length && texto[i] !== "\n") { i++; } continue; }
      if (/\s/.test(c)) { i++; continue; }
      if (c === "(" || c === ")" || c === "'") { tokens.push(c); i++; continue; }
      if (c === "[") { tokens.push("("); i++; continue; }
      if (c === "]") { tokens.push(")"); i++; continue; }
      if (c === '"') {
        var j = i + 1, s = "";
        while (j < texto.length && texto[j] !== '"') {
          if (texto[j] === "\\" && j + 1 < texto.length) { j++; s += texto[j] === "n" ? "\n" : texto[j]; }
          else { s += texto[j]; }
          j++;
        }
        if (j >= texto.length) { fallar("Falta cerrar una cadena con comillas."); }
        tokens.push({ cadena: s }); i = j + 1; continue;
      }
      var k = i;
      while (k < texto.length && !/[\s()\[\]';"]/.test(texto[k])) { k++; }
      tokens.push(texto.slice(i, k));
      i = k;
    }
    return tokens;
  }

  function atomo(t) {
    if (typeof t === "object") { return t.cadena; }
    if (t === "#t" || t === "#true") { return true; }
    if (t === "#f" || t === "#false") { return false; }
    if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)) { return parseFloat(t); }
    return simbolo(t);
  }

  function leerTodo(texto) {
    var tokens = tokenizar(texto), pos = 0;
    function leer() {
      if (pos >= tokens.length) { fallar("Se acabó el texto: falta cerrar un paréntesis."); }
      var t = tokens[pos++];
      if (t === "'") { return lista(simbolo("quote"), leer()); }
      if (t === ")") { fallar("Hay un paréntesis de cierre de más."); }
      if (t === "(") {
        var xs = [];
        while (pos < tokens.length && tokens[pos] !== ")") { xs.push(leer()); }
        if (pos >= tokens.length) { fallar("Falta un paréntesis de cierre."); }
        pos++;
        return desdeArreglo(xs);
      }
      return atomo(t);
    }
    var formas = [];
    while (pos < tokens.length) { formas.push(leer()); }
    return formas;
  }

  /* --- Impresión -------------------------------------------------- */
  function escribir(v) {
    if (v === NULO) { return "()"; }
    if (v === true) { return "#t"; }
    if (v === false) { return "#f"; }
    if (v === undefined || v === null) { return ""; }
    if (typeof v === "number") { return String(v); }
    if (typeof v === "string") { return '"' + v.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'; }
    if (v instanceof Simbolo) { return v.nombre; }
    if (v instanceof Cierre) { return "#<procedimiento " + v.nombre + ">"; }
    if (v instanceof Primitiva) { return "#<primitiva " + v.nombre + ">"; }
    if (v instanceof TipoDato) { return "#<tipo " + v.nombre + ">"; }
    if (v instanceof Dato) {
      return "(" + [v.variante].concat(v.campos.map(escribir)).join(" ") + ")";
    }
    if (v instanceof Par) {
      var partes = [], p = v;
      while (p instanceof Par) { partes.push(escribir(p.car)); p = p.cdr; }
      if (p === NULO) { return "(" + partes.join(" ") + ")"; }
      return "(" + partes.join(" ") + " . " + escribir(p) + ")";
    }
    return String(v);
  }

  function mostrar(v) {
    if (typeof v === "string") { return v; }
    return escribir(v);
  }

  function iguales(a, b) {
    if (a === b) { return true; }
    if (typeof a === "number" && typeof b === "number") { return a === b; }
    if (typeof a === "string" && typeof b === "string") { return a === b; }
    if (a instanceof Par && b instanceof Par) {
      return iguales(a.car, b.car) && iguales(a.cdr, b.cdr);
    }
    if (a instanceof Dato && b instanceof Dato) {
      if (a.tipo !== b.tipo || a.variante !== b.variante || a.campos.length !== b.campos.length) { return false; }
      for (var i = 0; i < a.campos.length; i++) { if (!iguales(a.campos[i], b.campos[i])) { return false; } }
      return true;
    }
    return false;
  }

  /* --- Ambientes -------------------------------------------------- */
  function Ambiente(padre) { this.tabla = Object.create(null); this.padre = padre; }
  Ambiente.prototype.buscar = function (nombre) {
    var a = this;
    while (a) {
      if (nombre in a.tabla) { return a.tabla[nombre]; }
      a = a.padre;
    }
    fallar("La variable " + nombre + " no está ligada.");
  };
  Ambiente.prototype.definir = function (nombre, valor) { this.tabla[nombre] = valor; };

  /* --- Primitivas ------------------------------------------------- */
  function numero(nombre, v) {
    if (typeof v !== "number") {
      fallar(nombre + " esperaba un número y recibió " + escribir(v) + ".");
    }
    return v;
  }
  function par(nombre, v) {
    if (!(v instanceof Par)) {
      fallar(nombre + " esperaba una lista no vacía y recibió " + escribir(v) + ".");
    }
    return v;
  }

  function ambienteGlobal(salida) {
    var g = new Ambiente(null);
    function prim(nombre, minimo, maximo, fn) {
      g.definir(nombre, new Primitiva(nombre, minimo, maximo, fn));
    }
    function plegarNum(nombre, inicial, op) {
      prim(nombre, 1, Infinity, function (args) {
        if (args.length === 1) { return op(inicial, numero(nombre, args[0])); }
        var r = numero(nombre, args[0]);
        for (var i = 1; i < args.length; i++) { r = op(r, numero(nombre, args[i])); }
        return r;
      });
    }
    plegarNum("+", 0, function (a, b) { return a + b; });
    plegarNum("*", 1, function (a, b) { return a * b; });
    prim("-", 1, Infinity, function (args) {
      if (args.length === 1) { return -numero("-", args[0]); }
      var r = numero("-", args[0]);
      for (var i = 1; i < args.length; i++) { r -= numero("-", args[i]); }
      return r;
    });
    prim("/", 1, Infinity, function (args) {
      var r = numero("/", args[0]);
      if (args.length === 1) { r = 1 / r; }
      for (var i = 1; i < args.length; i++) {
        var d = numero("/", args[i]);
        if (d === 0) { fallar("División por cero."); }
        r /= d;
      }
      return r;
    });
    function comparar(nombre, op) {
      prim(nombre, 2, Infinity, function (args) {
        for (var i = 0; i + 1 < args.length; i++) {
          if (!op(numero(nombre, args[i]), numero(nombre, args[i + 1]))) { return false; }
        }
        return true;
      });
    }
    comparar("=", function (a, b) { return a === b; });
    comparar("<", function (a, b) { return a < b; });
    comparar(">", function (a, b) { return a > b; });
    comparar("<=", function (a, b) { return a <= b; });
    comparar(">=", function (a, b) { return a >= b; });

    prim("quotient", 2, 2, function (a) {
      if (numero("quotient", a[1]) === 0) { fallar("División por cero."); }
      return Math.trunc(numero("quotient", a[0]) / a[1]);
    });
    prim("remainder", 2, 2, function (a) {
      if (numero("remainder", a[1]) === 0) { fallar("División por cero."); }
      return numero("remainder", a[0]) % a[1];
    });
    prim("modulo", 2, 2, function (a) {
      if (numero("modulo", a[1]) === 0) { fallar("División por cero."); }
      var r = numero("modulo", a[0]) % a[1];
      return r !== 0 && (r < 0) !== (a[1] < 0) ? r + a[1] : r;
    });
    prim("abs", 1, 1, function (a) { return Math.abs(numero("abs", a[0])); });
    prim("min", 1, Infinity, function (a) { return Math.min.apply(null, a.map(function (x) { return numero("min", x); })); });
    prim("max", 1, Infinity, function (a) { return Math.max.apply(null, a.map(function (x) { return numero("max", x); })); });
    prim("zero?", 1, 1, function (a) { return numero("zero?", a[0]) === 0; });
    prim("add1", 1, 1, function (a) { return numero("add1", a[0]) + 1; });
    prim("sub1", 1, 1, function (a) { return numero("sub1", a[0]) - 1; });
    prim("even?", 1, 1, function (a) { return numero("even?", a[0]) % 2 === 0; });
    prim("odd?", 1, 1, function (a) { return Math.abs(numero("odd?", a[0]) % 2) === 1; });

    prim("cons", 2, 2, function (a) { return new Par(a[0], a[1]); });
    prim("car", 1, 1, function (a) { return par("car", a[0]).car; });
    prim("cdr", 1, 1, function (a) { return par("cdr", a[0]).cdr; });
    /* Todas las combinaciones de car y cdr hasta cuatro niveles: caar, cadr,
       cdar, cddr, caaar, ..., cddddr. La secuencia se lee de derecha a
       izquierda, así que caddr es el car del cdr del cdr. */
    (function () {
      function bajar(seq, nombre) {
        return function (a) {
          var v = a[0];
          for (var i = seq.length - 1; i >= 0; i--) {
            var p = par(nombre, v);
            v = seq[i] === "a" ? p.car : p.cdr;
          }
          return v;
        };
      }
      function generar(seq) {
        if (seq.length >= 2) {
          var nombre = "c" + seq + "r";
          prim(nombre, 1, 1, bajar(seq, nombre));
        }
        if (seq.length === 4) { return; }
        generar(seq + "a");
        generar(seq + "d");
      }
      generar("");
    })();
    prim("list", 0, Infinity, function (a) { return desdeArreglo(a); });
    prim("null?", 1, 1, function (a) { return a[0] === NULO; });
    prim("pair?", 1, 1, function (a) { return a[0] instanceof Par; });
    prim("list?", 1, 1, function (a) { return esLista(a[0]); });
    /* (list-of pred) devuelve el predicado que acepta una lista cuyos
       elementos cumplen pred, todos. */
    prim("list-of", 1, 1, function (a) {
      var pred = a[0];
      return new Primitiva("(list-of " + escribir(pred) + ")", 1, 1, function (b, m) {
        if (!esLista(b[0])) { return false; }
        var xs = aArreglo(b[0]);
        for (var i = 0; i < xs.length; i++) { if (m.aplicar(pred, [xs[i]]) !== true) { return false; } }
        return true;
      });
    });
    prim("length", 1, 1, function (a) {
      if (!esLista(a[0])) { fallar("length esperaba una lista y recibió " + escribir(a[0]) + "."); }
      return aArreglo(a[0]).length;
    });
    prim("append", 0, Infinity, function (a) {
      if (a.length === 0) { return NULO; }
      var r = a[a.length - 1];
      for (var i = a.length - 2; i >= 0; i--) {
        if (!esLista(a[i])) {
          fallar("append esperaba listas y recibió " + escribir(a[i]) + ". " +
                 "Para agregar un solo elemento al frente se usa cons.");
        }
        var xs = aArreglo(a[i]);
        for (var j = xs.length - 1; j >= 0; j--) { r = new Par(xs[j], r); }
      }
      return r;
    });
    prim("reverse", 1, 1, function (a) { return desdeArreglo(aArreglo(a[0]).reverse()); });
    prim("not", 1, 1, function (a) { return a[0] === false; });
    prim("eq?", 2, 2, function (a) { return a[0] === a[1] || (typeof a[0] === "number" && a[0] === a[1]); });
    prim("equal?", 2, 2, function (a) { return iguales(a[0], a[1]); });
    prim("number?", 1, 1, function (a) { return typeof a[0] === "number"; });
    prim("symbol?", 1, 1, function (a) { return a[0] instanceof Simbolo; });
    prim("string?", 1, 1, function (a) { return typeof a[0] === "string"; });
    prim("boolean?", 1, 1, function (a) { return a[0] === true || a[0] === false; });
    prim("procedure?", 1, 1, function (a) { return a[0] instanceof Cierre || a[0] instanceof Primitiva; });
    prim("display", 1, 1, function (a) { salida.push(mostrar(a[0])); return undefined; });
    prim("newline", 0, 0, function () { salida.push("\n"); return undefined; });
    prim("error", 1, Infinity, function (a) {
      fallar(a.map(mostrar).join(" "));
    });
    return g;
  }

  /* --- Evaluación -------------------------------------------------- */
  var MAX_PASOS = 2000000;

  function Maquina(salida) {
    this.salida = salida;
    this.pasos = 0;
  }

  Maquina.prototype.evaluar = function (exp, amb) {
    this.pasos++;
    if (this.pasos > MAX_PASOS) {
      fallar("El programa lleva demasiados pasos. Puede que la recursión no llegue al caso base.");
    }
    for (;;) {
      if (typeof exp === "number" || typeof exp === "string" ||
          exp === true || exp === false || exp === NULO) {
        return exp;
      }
      if (exp instanceof Simbolo) { return amb.buscar(exp.nombre); }
      if (!(exp instanceof Par)) { fallar("No sé cómo evaluar " + escribir(exp) + "."); }

      var op = exp.car, args = aArreglo(exp.cdr);
      if (op instanceof Simbolo) {
        var nombre = op.nombre;
        if (nombre === "quote") { return args[0]; }
        if (nombre === "if") {
          if (args.length < 2) { fallar("if necesita al menos prueba y consecuente."); }
          var prueba = this.evaluar(args[0], amb);
          if (prueba !== true && prueba !== false) {
            fallar("La prueba de un if debe dar un booleano, y dio " + escribir(prueba) + ".");
          }
          if (prueba) { exp = args[1]; continue; }
          if (args.length < 3) { return undefined; }
          exp = args[2]; continue;
        }
        if (nombre === "cond") {
          var elegida = null;
          for (var i = 0; i < args.length && elegida === null; i++) {
            var clausula = aArreglo(args[i]);
            var esElse = clausula[0] instanceof Simbolo && clausula[0].nombre === "else";
            var v = esElse ? true : this.evaluar(clausula[0], amb);
            if (!esElse && v !== true && v !== false) {
              fallar("La prueba de una cláusula de cond debe dar un booleano, y dio " + escribir(v) + ".");
            }
            if (v === true) { elegida = clausula.slice(1); }
          }
          if (elegida === null) { return undefined; }
          if (elegida.length === 0) { return true; }
          for (var k = 0; k < elegida.length - 1; k++) { this.evaluar(elegida[k], amb); }
          exp = elegida[elegida.length - 1]; continue;
        }
        if (nombre === "define") {
          if (args[0] instanceof Par) {
            var cabeza = aArreglo(args[0]);
            var nom = cabeza[0].nombre;
            var proc = this.cerrar(desdeArreglo(cabeza.slice(1)), args.slice(1), amb, nom);
            amb.definir(nom, proc);
            return undefined;
          }
          var destino = args[0].nombre;
          var valor = args.length > 1 ? this.evaluar(args[1], amb) : undefined;
          if (valor instanceof Cierre && valor.nombre === "procedimiento anónimo") {
            valor.nombre = destino;
          }
          amb.definir(destino, valor);
          return undefined;
        }
        if (nombre === "lambda") {
          return this.cerrar(args[0], args.slice(1), amb, null);
        }
        if (nombre === "let" || nombre === "let*" || nombre === "letrec") {
          var nuevo = new Ambiente(amb);
          var ligaduras = aArreglo(args[0]).map(aArreglo);
          if (nombre === "letrec") {
            ligaduras.forEach(function (l) { nuevo.definir(l[0].nombre, undefined); });
          }
          for (var b = 0; b < ligaduras.length; b++) {
            var fuente = nombre === "let" ? amb : nuevo;
            var vb = this.evaluar(ligaduras[b][1], fuente);
            if (vb instanceof Cierre && vb.nombre === "procedimiento anónimo") {
              vb.nombre = ligaduras[b][0].nombre;
            }
            nuevo.definir(ligaduras[b][0].nombre, vb);
          }
          var cuerpo = args.slice(1);
          for (var c = 0; c < cuerpo.length - 1; c++) { this.evaluar(cuerpo[c], nuevo); }
          exp = cuerpo[cuerpo.length - 1]; amb = nuevo; continue;
        }
        if (nombre === "begin") {
          if (args.length === 0) { return undefined; }
          for (var s = 0; s < args.length - 1; s++) { this.evaluar(args[s], amb); }
          exp = args[args.length - 1]; continue;
        }
        if (nombre === "and") {
          if (args.length === 0) { return true; }
          for (var y = 0; y < args.length - 1; y++) {
            if (this.evaluar(args[y], amb) === false) { return false; }
          }
          exp = args[args.length - 1]; continue;
        }
        if (nombre === "or") {
          if (args.length === 0) { return false; }
          for (var o = 0; o < args.length - 1; o++) {
            var vo = this.evaluar(args[o], amb);
            if (vo !== false) { return vo; }
          }
          exp = args[args.length - 1]; continue;
        }
      }

      if (op instanceof Simbolo && op.nombre === "define-datatype") {
        this.definirTipo(args, amb);
        return undefined;
      }
      if (op instanceof Simbolo && op.nombre === "cases") {
        var eleccion = this.elegirCaso(args, amb);
        var cuerpoCaso = eleccion.cuerpo;
        for (var cc = 0; cc < cuerpoCaso.length - 1; cc++) { this.evaluar(cuerpoCaso[cc], eleccion.amb); }
        exp = cuerpoCaso[cuerpoCaso.length - 1]; amb = eleccion.amb; continue;
      }

      var proceso = this.evaluar(op, amb);
      var valores = [];
      for (var m = 0; m < args.length; m++) { valores.push(this.evaluar(args[m], amb)); }

      if (proceso instanceof Primitiva) {
        if (valores.length < proceso.minimo || valores.length > proceso.maximo) {
          fallar(proceso.nombre + " no recibe " + valores.length + " argumento(s).");
        }
        return proceso.fn(valores, this);
      }
      if (!(proceso instanceof Cierre)) {
        fallar("El valor " + escribir(proceso) + " no es un procedimiento y aparece en posición de llamada.");
      }
      amb = this.ligar(proceso, valores);
      var cuerpoP = proceso.cuerpo;
      for (var q = 0; q < cuerpoP.length - 1; q++) { this.evaluar(cuerpoP[q], amb); }
      exp = cuerpoP[cuerpoP.length - 1];
    }
  };

  /* Aplica un procedimiento desde JavaScript: sirve para los predicados de
     campo de define-datatype y para list-of. */
  Maquina.prototype.aplicar = function (proc, valores) {
    if (proc instanceof Primitiva) {
      if (valores.length < proc.minimo || valores.length > proc.maximo) {
        fallar(proc.nombre + " no recibe " + valores.length + " argumento(s).");
      }
      return proc.fn(valores, this);
    }
    if (!(proc instanceof Cierre)) {
      fallar("El valor " + escribir(proc) + " no es un procedimiento y se intentó usar como predicado.");
    }
    var ambLocal = this.ligar(proc, valores);
    var r;
    for (var i = 0; i < proc.cuerpo.length; i++) { r = this.evaluar(proc.cuerpo[i], ambLocal); }
    return r;
  };

  /* (define-datatype tipo tipo? (variante (campo predicado) ...) ...)
     Declara el tipo, su predicado y un constructor por variante. El
     constructor exige la cantidad exacta de campos y que cada uno cumpla su
     predicado, que se evalúa en el momento de construir para que un tipo
     pueda nombrarse a sí mismo. */
  Maquina.prototype.definirTipo = function (args, amb) {
    if (args.length < 2 || !(args[0] instanceof Simbolo) || !(args[1] instanceof Simbolo)) {
      fallar("define-datatype necesita el nombre del tipo y el de su predicado.");
    }
    var nombreTipo = args[0].nombre, nombrePred = args[1].nombre;
    var tipo = new TipoDato(nombreTipo, nombrePred);
    var maquina = this;
    if (args.length === 2) { fallar("El tipo " + nombreTipo + " no tiene ninguna variante."); }
    for (var i = 2; i < args.length; i++) {
      var decl = aArreglo(args[i]);
      if (decl.length === 0 || !(decl[0] instanceof Simbolo)) {
        fallar("Cada variante de " + nombreTipo + " empieza con su nombre entre paréntesis.");
      }
      var nombreVariante = decl[0].nombre;
      if (nombreVariante === nombreTipo) {
        fallar("La variante " + nombreVariante + " no puede llamarse igual que el tipo.");
      }
      var campos = [];
      for (var c = 1; c < decl.length; c++) {
        var campo = aArreglo(decl[c]);
        if (campo.length !== 2 || !(campo[0] instanceof Simbolo)) {
          fallar("En " + nombreVariante + " cada campo va como (nombre predicado); llegó " + escribir(decl[c]) + ".");
        }
        campos.push({ nombre: campo[0].nombre, predicado: campo[1] });
      }
      tipo.variantes[nombreVariante] = campos;
      amb.definir(nombreVariante, (function (variante, campos) {
        return new Primitiva(variante, campos.length, campos.length, function (valores, m) {
          for (var k = 0; k < campos.length; k++) {
            var pred = m.evaluar(campos[k].predicado, amb);
            var cumple = m.aplicar(pred, [valores[k]]);
            if (cumple !== true) {
              fallar("El campo " + campos[k].nombre + " de " + variante + " debe cumplir " +
                     escribir(campos[k].predicado) + " y recibió " + escribir(valores[k]) + ".");
            }
          }
          return new Dato(tipo, variante, valores.slice());
        });
      })(nombreVariante, campos));
    }
    amb.definir(nombreTipo, tipo);
    amb.definir(nombrePred, new Primitiva(nombrePred, 1, 1, function (a) {
      return a[0] instanceof Dato && a[0].tipo === tipo;
    }));
  };

  /* (cases tipo exp (variante (campo ...) cuerpo ...) ... (else cuerpo ...))
     Devuelve la cláusula elegida y el ambiente con sus campos ligados. */
  Maquina.prototype.elegirCaso = function (args, amb) {
    if (args.length < 2 || !(args[0] instanceof Simbolo)) {
      fallar("cases necesita el nombre del tipo y la expresión que se analiza.");
    }
    var tipo = amb.buscar(args[0].nombre);
    if (!(tipo instanceof TipoDato)) {
      fallar(args[0].nombre + " no es un tipo declarado con define-datatype.");
    }
    /* Sin else, las cláusulas tienen que cubrir todas las variantes: es lo
       que Racket exige al compilar, y se revisa antes de mirar el valor. */
    var cubiertas = Object.create(null), hayElse = false;
    for (var q = 2; q < args.length; q++) {
      var cab = aArreglo(args[q])[0];
      if (cab instanceof Simbolo) { if (cab.nombre === "else") { hayElse = true; } else { cubiertas[cab.nombre] = true; } }
    }
    if (!hayElse) {
      var faltan = Object.keys(tipo.variantes).filter(function (v) { return !cubiertas[v]; });
      if (faltan.length) {
        fallar("A este cases sobre " + tipo.nombre + " le faltan las variantes " + faltan.join(", ") + " y no tiene else.");
      }
    }
    var valor = this.evaluar(args[1], amb);
    if (!(valor instanceof Dato) || valor.tipo !== tipo) {
      fallar("cases sobre " + tipo.nombre + " recibió " + escribir(valor) + ", que no es un " + tipo.nombre + ".");
    }
    for (var i = 2; i < args.length; i++) {
      var clausula = aArreglo(args[i]);
      if (clausula.length === 0 || !(clausula[0] instanceof Simbolo)) {
        fallar("Cada cláusula de cases empieza con el nombre de una variante o con else.");
      }
      if (clausula[0].nombre === "else") {
        return { cuerpo: clausula.slice(1), amb: amb };
      }
      if (!(clausula[0].nombre in tipo.variantes)) {
        fallar(clausula[0].nombre + " no es una variante de " + tipo.nombre + ".");
      }
      if (clausula[0].nombre === valor.variante) {
        var nombres = aArreglo(clausula[1]);
        if (nombres.length !== valor.campos.length) {
          fallar("La cláusula " + valor.variante + " de cases nombra " + nombres.length +
                 " campo(s) y la variante tiene " + valor.campos.length + ".");
        }
        var nuevo = new Ambiente(amb);
        for (var k = 0; k < nombres.length; k++) { nuevo.definir(nombres[k].nombre, valor.campos[k]); }
        if (clausula.length < 3) { fallar("La cláusula " + valor.variante + " de cases no tiene cuerpo."); }
        return { cuerpo: clausula.slice(2), amb: nuevo };
      }
    }
    fallar("cases sobre " + tipo.nombre + " no tiene cláusula para la variante " + valor.variante + ".");
  };

  Maquina.prototype.cerrar = function (formales, cuerpo, amb, nombre) {
    var params = [], resto = null;
    if (formales instanceof Simbolo) {
      resto = formales.nombre;
    } else {
      var p = formales;
      while (p instanceof Par) {
        params.push(p.car.nombre);
        p = p.cdr;
      }
      if (p instanceof Simbolo) { resto = p.nombre; }
    }
    if (cuerpo.length === 0) { fallar("Un procedimiento necesita cuerpo."); }
    return new Cierre(params, resto, cuerpo, amb, nombre);
  };

  Maquina.prototype.ligar = function (cierre, valores) {
    if (cierre.resto === null && valores.length !== cierre.params.length) {
      fallar(cierre.nombre + " espera " + cierre.params.length +
             " argumento(s) y recibió " + valores.length + ".");
    }
    if (cierre.resto !== null && valores.length < cierre.params.length) {
      fallar(cierre.nombre + " espera al menos " + cierre.params.length +
             " argumento(s) y recibió " + valores.length + ".");
    }
    var nuevo = new Ambiente(cierre.amb);
    for (var i = 0; i < cierre.params.length; i++) { nuevo.definir(cierre.params[i], valores[i]); }
    if (cierre.resto !== null) { nuevo.definir(cierre.resto, desdeArreglo(valores.slice(cierre.params.length))); }
    return nuevo;
  };

  /* --- Fachada ----------------------------------------------------- */
  function nuevaSesion() {
    var salida = [];
    var global = ambienteGlobal(salida);
    return { global: global, salida: salida };
  }

  /* Corre un texto completo. Devuelve {valores, salida, error}. */
  function correr(texto, sesion) {
    var s = sesion || nuevaSesion();
    var resultado = { valores: [], salida: "", error: null, sesion: s };
    var largoPrevio = s.salida.length;
    try {
      var formas = leerTodo(texto);
      var maquina = new Maquina(s.salida);
      for (var i = 0; i < formas.length; i++) {
        resultado.valores.push(maquina.evaluar(formas[i], s.global));
      }
    } catch (e) {
      if (e instanceof ErrorScheme) { resultado.error = e.mensaje; }
      else if (e instanceof RangeError) {
        resultado.error = "La recursión bajó demasiado. Revise que el caso base se alcance.";
      } else { resultado.error = "Error inesperado: " + e.message; }
    }
    resultado.salida = s.salida.slice(largoPrevio).join("");
    return resultado;
  }

  /* Evalúa una expresión sobre una sesión ya cargada y devuelve su valor. */
  function evaluarExpresion(texto, sesion) {
    var r = correr(texto, sesion);
    return { valor: r.valores.length ? r.valores[r.valores.length - 1] : undefined,
             salida: r.salida, error: r.error };
  }

  /* Describe un valor como estructura plana, para dibujarlo. */
  function inspeccionar(v) {
    if (v instanceof Dato) {
      return { clase: "dato", variante: v.variante, campos: v.campos.map(inspeccionar) };
    }
    if (v instanceof Par && esLista(v)) {
      return { clase: "lista", items: aArreglo(v).map(inspeccionar) };
    }
    return { clase: "atomo", texto: escribir(v) };
  }

  return {
    inspeccionar: inspeccionar,
    correr: correr,
    evaluarExpresion: evaluarExpresion,
    nuevaSesion: nuevaSesion,
    escribir: escribir,
    leerTodo: leerTodo,
    iguales: iguales,
    NULO: NULO
  };
})();

if (typeof module !== "undefined") { module.exports = MiniScheme; }
