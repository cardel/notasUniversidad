/* Qué puede escribir el cliente de Racional y qué queda cerrado. La
   simulación reproduce 03_racional_simplificacion.scala: require como
   precondición, mcd y m privados, numer y denom públicos. Dos cosas
   distintas separan las cinco expresiones: la visibilidad, que revisa el
   compilador, y las condiciones de require y assert, que se evalúan cuando
   el objeto se construye. */
(function () {
  function mcd(a, b) {
    if (b === 0) { return a; }
    return mcd(b, a % b);
  }

  /* División entera de Scala: trunca hacia cero. */
  function truncar(q) {
    return q < 0 ? Math.ceil(q) : Math.floor(q);
  }

  function FalloScala(tipo, msg) {
    this.tipo = tipo;
    this.msg = msg;
  }

  /* new Racional(x, y): require, el mcd una sola vez, numer y denom. */
  function nuevoRacional(x, y) {
    if (!(y > 0)) {
      throw new FalloScala("IllegalArgumentException",
        "requirement failed: El denominador debe ser positivo");
    }
    var m = mcd(Math.abs(x), y);
    var numer = truncar(x / m);
    var denom = truncar(y / m);
    if (!(denom > 0)) {
      throw new FalloScala("AssertionError",
        "assertion failed: Invariante: denom siempre positivo");
    }
    return { numer: numer, denom: denom, m: m, texto: numer + "/" + denom };
  }

  function menorQue(p, q) {
    return p.numer * q.denom < p.denom * q.numer;
  }

  function maximo(p, q) {
    return menorQue(p, q) ? q : p;
  }

  /* suma construye un Racional nuevo, y ese constructor alcanza mcd y m
     porque la llamada se escribe dentro de la clase. */
  function suma(p, q) {
    return nuevoRacional(p.numer * q.denom + p.denom * q.numer, p.denom * q.denom);
  }

  var MIEMBROS = {
    mcd: "private",
    m: "private",
    numer: "public",
    denom: "public",
    menorQue: "public",
    max: "public",
    suma: "public",
    toString: "public"
  };

  /* origen: "dentro" es código escrito en la clase; "fuera", el cliente. */
  function accesible(nombre, origen) {
    if (!Object.prototype.hasOwnProperty.call(MIEMBROS, nombre)) { return false; }
    return origen === "dentro" || MIEMBROS[nombre] === "public";
  }

  var BASE = { x: 66, y: 42 };

  var CASOS = [
    { id: "numer", expr: "r.numer", tipo: "acceso", miembro: "numer" },
    { id: "mcd", expr: "r.mcd(66, 42)", tipo: "acceso", miembro: "mcd" },
    { id: "m", expr: "r.m", tipo: "acceso", miembro: "m" },
    { id: "cero", expr: "new Racional(1, 0)", tipo: "construccion", x: 1, y: 0 },
    { id: "negativo", expr: "new Racional(-3, 4)", tipo: "construccion", x: -3, y: 4 }
  ];

  var VEREDICTOS = [
    { clave: "valor", rotulo: "Da un valor" },
    { clave: "noCompila", rotulo: "No compila" },
    { clave: "excepcion", rotulo: "Compila y lanza una excepción al correr" }
  ];

  function buscar(id) {
    var hallado = null;
    CASOS.forEach(function (c) { if (c.id === id) { hallado = c; } });
    return hallado;
  }

  /* Qué pasa con una expresión escrita por el cliente. */
  function evaluar(caso) {
    var r, hecho;
    if (caso.tipo === "acceso") {
      if (!accesible(caso.miembro, "fuera")) {
        return {
          veredicto: "noCompila",
          salida: "El compilador rechaza " + caso.expr + ": " + caso.miembro +
            " está declarado private y no se nombra desde fuera de la clase."
        };
      }
      r = nuevoRacional(BASE.x, BASE.y);
      return {
        veredicto: "valor",
        valor: r[caso.miembro],
        salida: caso.expr + " responde " + r[caso.miembro] + "."
      };
    }
    try {
      hecho = nuevoRacional(caso.x, caso.y);
    } catch (fallo) {
      return {
        veredicto: "excepcion",
        tipo: fallo.tipo,
        salida: caso.expr + " compila, y al correr lanza " + fallo.tipo + ": " + fallo.msg + "."
      };
    }
    return {
      veredicto: "valor",
      valor: hecho.texto,
      salida: caso.expr + " construye " + hecho.texto + "."
    };
  }

  var RETRO = {
    numer: {
      razon: "Con m = 6, el mcd de 66 y 42, la clase guarda 11 y 7. numer es un val sin private, " +
        "y el cliente lo lee como cualquier otro miembro público.",
      noCompila: "numer no lleva private: es parte de lo que la clase ofrece hacia fuera. " +
        "Los dos nombres cerrados son mcd y m.",
      excepcion: "Con y = 42 la condición de require se cumple y la de assert también, " +
        "así que la construcción termina y la expresión entrega un número."
    },
    mcd: {
      razon: "Adentro sí se llama: m = mcd(math.abs(x), y) está escrito en la misma clase, y de ahí " +
        "sale la simplificación. private cierra quién puede escribir la llamada, no desde dónde se ejecuta.",
      valor: "La clase lo usa para calcular m, y suma lo alcanza indirectamente cada vez que " +
        "construye un Racional nuevo. Para el cliente, en cambio, el nombre no existe.",
      excepcion: "Lanzar una excepción exige un programa compilado, y este se detiene antes: " +
        "el error llega en la compilación, no en la corrida."
    },
    m: {
      razon: "m es el estado interno donde queda guardado el mcd. Lo que el cliente ve de ese cálculo " +
        "son numer y denom, ya divididos por él.",
      valor: "Adentro m vale 6, pero ese 6 no sale de la clase: private sobre un val cierra la lectura " +
        "igual que sobre un método.",
      excepcion: "El programa no pasa de la compilación, y sin compilar no hay corrida donde lanzar nada."
    },
    cero: {
      razon: "La firma pide dos Int y 0 es un Int, así que el compilador no tiene nada que objetar. " +
        "La condición y > 0 se evalúa cuando el objeto se construye.",
      noCompila: "0 es un Int y la firma del constructor es (x: Int, y: Int). Lo que require exige " +
        "del valor no viaja en el tipo, entonces el compilador deja pasar la expresión.",
      valor: "require(y > 0, ...) es la primera línea del cuerpo, y con y = 0 la condición es falsa. " +
        "La construcción se interrumpe ahí y no hay objeto que devolver."
    },
    negativo: {
      razon: "require mira y, que es 4. El mcd se calcula con math.abs(x), entonces m = 1, el signo se " +
        "queda en numer y assert(denom > 0) se cumple.",
      noCompila: "-3 es un Int. Nada en la firma impide un numerador negativo.",
      excepcion: "require solo pide y > 0, y aquí y es 4. El numerador negativo no lo toca, y el mcd " +
        "sale de math.abs(x), así que denom queda positivo."
    }
  };

  /* Compara la opción elegida con lo que de verdad pasa. */
  function revisar(id, elegido) {
    var caso = buscar(id);
    var res = evaluar(caso);
    if (elegido === res.veredicto) {
      return { ok: true, msg: res.salida + " " + RETRO[id].razon };
    }
    return { ok: false, msg: RETRO[id][elegido] };
  }

  var API = {
    mcd: mcd, nuevoRacional: nuevoRacional, suma: suma, menorQue: menorQue,
    maximo: maximo, accesible: accesible, MIEMBROS: MIEMBROS, BASE: BASE,
    CASOS: CASOS, VEREDICTOS: VEREDICTOS, RETRO: RETRO,
    evaluar: evaluar, revisar: revisar, buscar: buscar
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var resueltos = {};

  function contar() {
    var n = 0;
    CASOS.forEach(function (c) { if (resueltos[c.id]) { n = n + 1; } });
    return n;
  }

  function construirCasos() {
    var caja = document.getElementById("casos");
    CASOS.forEach(function (c) {
      var fila = document.createElement("div");
      fila.className = "caso";
      fila.id = "caso-" + c.id;

      var expr = document.createElement("div");
      expr.className = "expr";
      expr.textContent = c.expr;
      fila.appendChild(expr);

      var ops = document.createElement("div");
      ops.className = "opciones";
      VEREDICTOS.forEach(function (v) {
        var b = document.createElement("button");
        b.textContent = v.rotulo;
        b.setAttribute("data-caso", c.id);
        b.setAttribute("data-veredicto", v.clave);
        ops.appendChild(b);
      });
      fila.appendChild(ops);

      var ver = document.createElement("div");
      ver.className = "veredicto";
      ver.id = "ver-" + c.id;
      fila.appendChild(ver);

      caja.appendChild(fila);
    });
  }

  function alElegir(boton) {
    var id = boton.getAttribute("data-caso");
    var elegido = boton.getAttribute("data-veredicto");
    var res = revisar(id, elegido);
    var ver = document.getElementById("ver-" + id);
    var fila = document.getElementById("caso-" + id);

    fila.querySelectorAll("button").forEach(function (o) { o.className = ""; });
    boton.className = res.ok ? "primario" : "errada";
    ver.className = res.ok ? "veredicto bien" : "veredicto mal";
    ver.textContent = res.msg;

    if (res.ok) {
      resueltos[id] = true;
      fila.classList.add("listo");
    }
    document.getElementById("contador").textContent =
      "expresiones clasificadas: " + contar() + " de " + CASOS.length;
    if (contar() === CASOS.length) {
      document.getElementById("carta-tres").classList.remove("bloqueado");
    }
  }

  construirCasos();
  document.getElementById("contador").textContent =
    "expresiones clasificadas: 0 de " + CASOS.length;

  document.querySelectorAll("[data-veredicto]").forEach(function (b) {
    b.addEventListener("click", function () { alElegir(b); });
  });

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-tres");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      b.className = b.getAttribute("data-razon") === "ok" ? "primario" : "errada";
      if (b.getAttribute("data-razon") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. Son dos revisiones en momentos distintos: la visibilidad la " +
          "resuelve el compilador leyendo la clase, y la condición de require se evalúa con el " +
          "valor que llega, cuando el objeto se construye.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
