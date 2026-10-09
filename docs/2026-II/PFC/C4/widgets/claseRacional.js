/* claseRacional: cuatro expresiones del REPL sobre class Racional(x: Int, y: Int).
   El estudiante predice la respuesta de cada una antes de verla. El modelo
   guarda aparte los parámetros del constructor y los miembros declarados con
   def, que es lo que separa x.numer de x.x. El código y el hash 2faf6e4a
   salen de FuncionesDatos.tex, frames "Definición de una clase en Scala" y
   "Creación de objetos". */
(function () {
  var HASH = "2faf6e4a";

  /* Un objeto Racional: los parámetros de la cabecera no son miembros, y los
     dos def sí lo son. */
  function nuevoRacional(x, y) {
    return {
      clase: "Racional",
      hash: HASH,
      parametros: { x: x, y: y },
      miembros: {
        numer: function (o) { return o.parametros.x; },
        denom: function (o) { return o.parametros.y; }
      }
    };
  }

  var OBJETO = nuevoRacional(1, 2);

  /* Evalúa una expresión del REPL contra el objeto. Con el punto se selecciona
     solo lo que está en miembros; lo demás no existe para el cliente. */
  function evaluar(expr, obj) {
    var partes = expr.split(".");
    var sel;
    if (partes.length === 1) {
      if (partes[0] !== "x") {
        return { tipo: "error", mensaje: "not found: value " + partes[0] };
      }
      return { tipo: "referencia", tipoScala: obj.clase, valor: obj.clase + "@" + obj.hash };
    }
    sel = partes[1];
    if (!Object.prototype.hasOwnProperty.call(obj.miembros, sel)) {
      return { tipo: "error", mensaje: "value " + sel + " is not a member of " + obj.clase };
    }
    return { tipo: "entero", tipoScala: "Int", valor: obj.miembros[sel](obj) };
  }

  var OPCIONES = ["1", "2", "1/2", "Racional@" + HASH, "no compila"];

  /* El resultado de evaluar, escrito como una de las opciones. */
  function comoOpcion(res) {
    if (res.tipo === "error") { return "no compila"; }
    return String(res.valor);
  }

  /* La línea que escribe el REPL de vuelta. */
  function lineaRepl(expr, res, numRes) {
    if (res.tipo === "error") {
      return "scala> " + expr + "\n-- Error -----\n" + res.mensaje;
    }
    return "scala> " + expr + "\nval res" + numRes + ": " + res.tipoScala + " = " + res.valor;
  }

  var EXPRESIONES = [
    {
      expr: "x.numer",
      res: 0,
      exito: "numer es un miembro: el def lo declara dentro del cuerpo de la clase y devuelve el Int que entró por el primer parámetro.",
      fallo: {
        "2": "Ese es denom. numer devuelve x, y x recibió el 1 de new Racional(1, 2).",
        "1/2": "El REPL no combina los dos miembros. numer se selecciona solo y devuelve un Int.",
        "Racional@2faf6e4a": "Eso responde x a secas. Con .numer el punto ya seleccionó un miembro, y lo que vuelve es su valor.",
        "no compila": "numer está declarado con def en el cuerpo de la clase, así que el punto lo alcanza."
      }
    },
    {
      expr: "x.denom",
      res: 1,
      exito: "denom devuelve y, el segundo parámetro, que recibió el 2.",
      fallo: {
        "1": "Ese es numer. denom devuelve y, y a y le entró el 2.",
        "1/2": "Son dos miembros distintos y cada uno se selecciona por separado; aquí vuelve un Int solo.",
        "Racional@2faf6e4a": "Esa es la respuesta de x sin punto. Aquí el punto ya seleccionó denom.",
        "no compila": "denom también es miembro, por el mismo def que numer."
      }
    },
    {
      expr: "x",
      res: 2,
      exito: "El nombre de la clase y un número en hexadecimal. Racional todavía no define su propio toString, así que responde el heredado, que no mira los campos.",
      fallo: {
        "1": "Ese es el valor de numer, no del objeto. x es el objeto completo y no se reduce a uno de sus miembros.",
        "2": "Ese es el valor de denom. x es el objeto, no el segundo parámetro.",
        "1/2": "Para que el REPL escriba 1/2 hay que darle a Racional su propio toString. Mientras no esté, el heredado imprime el nombre de la clase y una dirección.",
        "no compila": "x es un val del REPL y vale perfectamente; lo que ocurre es que su impresión no dice nada del contenido."
      }
    },
    {
      expr: "x.x",
      res: null,
      exito: "value x is not a member of Racional. El x de la cabecera nombra el parámetro del constructor y ese nombre no sale del cuerpo de la clase; lo que el cliente alcanza con el punto se llama numer.",
      fallo: {
        "1": "Dentro de la clase x vale 1, pero ese nombre vive en la cabecera y no es miembro. Desde afuera el 1 se consigue con x.numer.",
        "2": "Ni 1 ni 2: el problema no es cuál de los dos parámetros, es que ninguno de los dos se selecciona con el punto.",
        "1/2": "No hay nada que imprimir, porque la selección falla antes: a la derecha del punto va el nombre de un miembro.",
        "Racional@2faf6e4a": "Eso responde x a secas, sin el segundo punto. Al agregar .x se pide un miembro que no existe."
      }
    }
  ];

  /* La opción correcta de cada expresión sale de la simulación, no de una lista. */
  function correcta(i) {
    return comoOpcion(evaluar(EXPRESIONES[i].expr, OBJETO));
  }

  function replDe(i) {
    var e = EXPRESIONES[i];
    return lineaRepl(e.expr, evaluar(e.expr, OBJETO), e.res);
  }

  var API = {
    nuevoRacional: nuevoRacional, evaluar: evaluar, comoOpcion: comoOpcion,
    lineaRepl: lineaRepl, correcta: correcta, replDe: replDe,
    OPCIONES: OPCIONES, EXPRESIONES: EXPRESIONES, OBJETO: OBJETO
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var resueltas = [];

  function marcador() {
    var n = 0, i;
    for (i = 0; i < EXPRESIONES.length; i = i + 1) {
      if (resueltas[i]) { n = n + 1; }
    }
    return n;
  }

  function construir() {
    var caja = document.getElementById("predicciones");
    EXPRESIONES.forEach(function (e, i) {
      var bloque = document.createElement("div");
      bloque.className = "pred";
      bloque.id = "pred-" + i;

      var titulo = document.createElement("div");
      titulo.className = "expr";
      titulo.textContent = "scala> " + e.expr;
      bloque.appendChild(titulo);

      var opciones = document.createElement("div");
      opciones.className = "opciones-pred";
      OPCIONES.forEach(function (o) {
        var b = document.createElement("button");
        b.textContent = o;
        b.setAttribute("data-pred", String(i));
        b.setAttribute("data-opcion", o);
        opciones.appendChild(b);
      });
      bloque.appendChild(opciones);

      var ver = document.createElement("div");
      ver.className = "veredicto";
      ver.id = "veredicto-" + i;
      bloque.appendChild(ver);

      var repl = document.createElement("pre");
      repl.className = "repl";
      repl.id = "repl-" + i;
      bloque.appendChild(repl);

      caja.appendChild(bloque);
    });
  }

  function responder(i, opcion, boton) {
    var ver = document.getElementById("veredicto-" + i);
    var repl = document.getElementById("repl-" + i);
    var buena = correcta(i);
    document.querySelectorAll("[data-pred='" + i + "']").forEach(function (b) {
      b.className = "";
    });
    boton.className = opcion === buena ? "primario" : "";
    if (opcion === buena) {
      ver.className = "veredicto bien";
      ver.textContent = EXPRESIONES[i].exito;
      repl.textContent = replDe(i);
      repl.classList.add("visible");
      resueltas[i] = true;
    } else {
      ver.className = "veredicto mal";
      ver.textContent = EXPRESIONES[i].fallo[opcion];
      repl.textContent = "";
      repl.classList.remove("visible");
      resueltas[i] = false;
    }
    document.getElementById("contador").textContent =
      "predicciones acertadas: " + marcador() + " de " + EXPRESIONES.length;
    if (marcador() === EXPRESIONES.length) {
      document.getElementById("carta-tres").classList.remove("bloqueado");
    }
  }

  construir();
  document.getElementById("contador").textContent =
    "predicciones acertadas: 0 de " + EXPRESIONES.length;

  document.querySelectorAll("[data-pred]").forEach(function (b) {
    b.addEventListener("click", function () {
      responder(parseInt(b.getAttribute("data-pred"), 10),
        b.getAttribute("data-opcion"), b);
    });
  });

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-tres");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      if (b.getAttribute("data-razon") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. La cabecera recibe el 1 y el 2 con los nombres x y y, y esos nombres solo existen dentro del cuerpo. Los dos def son los que el cliente puede seleccionar, y por eso el 1 se pide como x.numer.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
