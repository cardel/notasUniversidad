/* reversaFold: la solución y la traza de los frames Ejercicio guiado: invertir
   una lista con foldLeft y Traza de reverse(List(1,2,3)) del deck
   ListasParte2. El panel de código lleva reverse y la definición de foldLeft
   del frame de implementación interna del mismo deck, que es la que marca los
   pasos. La simulación reproduce la tabla del deck: con List(1,2,3) el
   acumulador pasa por List(), List(1), List(2, 1) y List(3, 2, 1). */
(function () {

  var ATAJOS = [
    { id: "tres", lista: [1, 2, 3] },
    { id: "cuatro", lista: [1, 2, 3, 4] },
    { id: "nums", lista: [2, 4, 7, 3, 8, 1] },
    { id: "vacia", lista: [] }
  ];

  function textoLista(xs) {
    return xs.length === 0 ? "List()" : "List(" + xs.join(", ") + ")";
  }

  function entradaDe(xs) { return xs.length === 0 ? "List[Int]()" : textoLista(xs); }

  /* reverse tal como la escribe el deck: foldLeft con Nil y x :: acc. */
  function reverse(xs) {
    return foldLeft(xs, [], function (acc, x) { return [x].concat(acc); });
  }

  function foldLeft(xs, z, op) {
    if (xs.length === 0) { return z; }
    return foldLeft(xs.slice(1), op(z, xs[0]), op);
  }

  /* La misma operación con foldRight, que es el distractor del ítem. */
  function foldRight(xs, z, op) {
    if (xs.length === 0) { return z; }
    return op(xs[0], foldRight(xs.slice(1), z, op));
  }

  function conFoldRight(xs) {
    return foldRight(xs, [], function (x, acc) { return [x].concat(acc); });
  }

  var CODIGO = [
    { num: null, txt: "def reverse[T](xs: List[T]): List[T] =" },
    { num: 2, txt: "  (xs foldLeft List[T]())((acc, x) => x :: acc)", bloque: 1 },
    { num: null, txt: "" },
    { num: null, txt: "def foldLeft[U](z: U)(op: (U, T) => U): U = this match {" },
    { num: 5, txt: "  case Nil     => z", bloque: 2 },
    { num: 6, txt: "  case x :: xs => (xs foldLeft op(z, x))(op)", bloque: 3 },
    { num: null, txt: "}" }
  ];

  /* ── La simulación: un paso por cada vuelta de foldLeft ──────────── */

  function simular(lista) {
    var pasos = [];

    function anotar(linea, extra) {
      var paso = {
        linea: linea, paso: null, x: null, operacion: null, acc: null,
        porRecorrer: null, vistos: 0, devuelve: null
      };
      Object.keys(extra || {}).forEach(function (k) { paso[k] = extra[k]; });
      pasos.push(paso);
    }

    function vuelta(xs, acc, n) {
      var x, nuevo;
      if (xs.length === 0) {
        anotar(5, {
          paso: n, operacion: "no queda elemento, devuelve el acumulador",
          acc: textoLista(acc), porRecorrer: "List()", vistos: n,
          devuelve: textoLista(acc)
        });
        return acc;
      }
      x = xs[0];
      nuevo = [x].concat(acc);
      anotar(6, {
        paso: n + 1, x: x,
        operacion: x + " :: " + textoLista(acc),
        acc: textoLista(nuevo), porRecorrer: textoLista(xs.slice(1)),
        vistos: n + 1
      });
      return vuelta(xs.slice(1), nuevo, n + 1);
    }

    anotar(2, {
      paso: 0, operacion: "valor inicial z = List()",
      acc: "List()", porRecorrer: textoLista(lista), vistos: 0
    });
    vuelta(lista, [], 0);
    return pasos;
  }

  /* La tabla del deck, con una fila por paso. */
  function filasDeTabla(lista) {
    return simular(lista)
      .filter(function (p) { return p.linea === 2 || p.linea === 6; })
      .map(function (p) {
        return {
          paso: p.paso,
          x: p.x === null ? "---" : String(p.x),
          operacion: p.linea === 2 ? "valor inicial z" : p.operacion,
          acc: p.acc
        };
      });
  }

  function buscarAtajo(id) {
    var hallado = null;
    ATAJOS.forEach(function (a) { if (a.id === id) { hallado = a; } });
    return hallado;
  }

  /* ── El ítem sobre el operador ──────────────────────────────────── */

  var PREGUNTA = {
    enunciado: "El operador que recibe foldLeft se escribe (acc, x) => x :: acc. " +
      "¿Por qué en ese orden?",
    opciones: [
      {
        clave: "ok",
        txt: "Porque :: pide el elemento a la izquierda y la lista a la derecha, " +
          "y foldLeft entrega el acumulador en el primer parámetro del operador."
      },
      {
        clave: "igual",
        txt: "Porque da igual: acc :: x devuelve lo mismo con los nombres cambiados."
      },
      {
        clave: "alFinal",
        txt: "Porque x :: acc agrega x al final del acumulador, y así la lista " +
          "queda en orden inverso."
      },
      {
        clave: "foldRight",
        txt: "Porque con foldRight y el mismo operador la lista también saldría " +
          "invertida, y el orden de los nombres es lo único que cambia."
      }
    ],
    exito: "Eso es. El tipo de :: es (T, List[T]) => List[T], y el de la " +
      "operación de foldLeft es (U, T) => U con el acumulador de primero. Las dos " +
      "exigencias se cumplen a la vez con (acc, x) => x :: acc: el acumulador " +
      "entra como primer parámetro y sale a la derecha del ::, donde va la lista.",
    fallo: {
      igual: "acc :: x le pasa la lista donde :: espera un elemento y el entero " +
        "donde espera una lista. El compilador rechaza la expresión: los dos " +
        "lados del operador no son intercambiables.",
      alFinal: ":: agrega al inicio, no al final. Ahí está el giro del ejercicio: " +
        "cada elemento se mete delante de todos los que ya estaban, y el último " +
        "que se recorre queda de cabeza en la lista.",
      foldRight: "Con foldRight el mismo operador reconstruye la lista en su " +
        "orden original: (List(1,2,3) foldRight List[Int]())((x, acc) => x :: acc) " +
        "devuelve " + textoLista(conFoldRight([1, 2, 3])) + ". Lo que invierte es " +
        "la dirección del recorrido de foldLeft, no el operador por sí solo."
    }
  };

  var API = {
    ATAJOS: ATAJOS, CODIGO: CODIGO, PREGUNTA: PREGUNTA,
    reverse: reverse, foldLeft: foldLeft, foldRight: foldRight,
    conFoldRight: conFoldRight, textoLista: textoLista, entradaDe: entradaDe,
    simular: simular, filasDeTabla: filasDeTabla, buscarAtajo: buscarAtajo
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ════════════════ la página ════════════════ */

  var atajoActual = ATAJOS[0].id;

  function construirTabla(lista) {
    var tabla = document.getElementById("tabla-traza");
    var cab = document.createElement("tr");
    tabla.innerHTML = "";
    ["paso", "x", "operación", "acc tras el paso"].forEach(function (t) {
      var th = document.createElement("th");
      th.textContent = t;
      cab.appendChild(th);
    });
    tabla.appendChild(cab);
    filasDeTabla(lista).forEach(function (f, i) {
      var tr = document.createElement("tr");
      tr.id = "fila-" + i;
      [String(f.paso), f.x, f.operacion, f.acc].forEach(function (v, j) {
        var td = document.createElement("td");
        td.textContent = "";
        td.className = "pend";
        td.id = "celda-" + i + "-" + j;
        tr.appendChild(td);
      });
      tabla.appendChild(tr);
    });
  }

  function pintarTabla(lista, vistos) {
    filasDeTabla(lista).forEach(function (f, i) {
      var valores = [String(f.paso), f.x, f.operacion, f.acc];
      valores.forEach(function (v, j) {
        var td = document.getElementById("celda-" + i + "-" + j);
        if (td === null) { return; }
        if (i <= vistos) {
          td.textContent = v;
          td.className = j === 2 || j === 3 ? "expr" : "";
        } else {
          td.textContent = "";
          td.className = "pend";
        }
      });
    });
  }

  function pintarFichas(e) {
    var lista = buscarAtajo(atajoActual).lista;
    var a = e.actual;
    var vistos = a === null ? 0 : a.vistos;
    var cajaEntrada = document.getElementById("fila-entrada");
    var cajaAcc = document.getElementById("fila-acc");
    var acc = [];
    var i;

    cajaEntrada.innerHTML = "";
    if (lista.length === 0) {
      cajaEntrada.appendChild(document.createTextNode("List() no tiene elementos"));
    }
    lista.forEach(function (v, j) {
      var f = document.createElement("span");
      f.className = "ficha";
      f.textContent = String(v);
      if (j < vistos - 1) { f.className = "ficha usada"; }
      if (j === vistos - 1) { f.className = "ficha usada reciente"; }
      if (j > vistos - 1) { f.className = "ficha pendiente"; }
      cajaEntrada.appendChild(f);
    });

    for (i = 0; i < vistos; i = i + 1) { acc = [lista[i]].concat(acc); }
    cajaAcc.innerHTML = "";
    if (acc.length === 0) {
      cajaAcc.appendChild(document.createTextNode("List()"));
    }
    acc.forEach(function (v, j) {
      var f = document.createElement("span");
      f.className = j === 0 ? "ficha acc reciente" : "ficha acc";
      f.textContent = String(v);
      cajaAcc.appendChild(f);
    });

    pintarTabla(lista, a === null ? -1 : vistos);
    document.getElementById("devuelve").textContent =
      a !== null && a.devuelve !== null ? a.devuelve : "sin cerrar todavía";
  }

  function construirAtajos() {
    var caja = document.getElementById("presets");
    ATAJOS.forEach(function (a) {
      var b = document.createElement("button");
      b.textContent = entradaDe(a.lista);
      b.setAttribute("data-atajo", a.id);
      caja.appendChild(b);
    });
  }

  function marcarAtajo(id) {
    document.querySelectorAll("[data-atajo]").forEach(function (b) {
      b.className = b.getAttribute("data-atajo") === id ? "primario" : "";
    });
  }

  function construirPregunta() {
    var caja = document.getElementById("opciones");
    document.getElementById("enunciado").textContent = PREGUNTA.enunciado;
    PREGUNTA.opciones.forEach(function (o) {
      var b = document.createElement("button");
      b.textContent = o.txt;
      b.setAttribute("data-clave", o.clave);
      caja.appendChild(b);
    });
  }

  construirAtajos();
  marcarAtajo(atajoActual);
  construirTabla(buscarAtajo(atajoActual).lista);
  construirPregunta();

  document.querySelectorAll("[data-atajo]").forEach(function (b) {
    b.addEventListener("click", function () {
      atajoActual = b.getAttribute("data-atajo");
      marcarAtajo(atajoActual);
      construirTabla(buscarAtajo(atajoActual).lista);
      Motor.reiniciar(buscarAtajo(atajoActual).lista);
    });
  });

  document.querySelectorAll("[data-clave]").forEach(function (b) {
    b.addEventListener("click", function () {
      var clave = b.getAttribute("data-clave");
      var v = document.getElementById("veredicto");
      document.querySelectorAll("[data-clave]").forEach(function (o) { o.className = ""; });
      if (clave === "ok") {
        b.className = "primario";
        v.className = "veredicto bien";
        v.textContent = PREGUNTA.exito;
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        b.className = "errada";
        v.className = "veredicto mal";
        v.textContent = PREGUNTA.fallo[clave];
      }
    });
  });

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: buscarAtajo(atajoActual).lista,
    simular: simular,
    chips: [
      { campo: "x", rotulo: "x" },
      { campo: "operacion", rotulo: "operación" },
      { campo: "acc", rotulo: "acc" },
      { campo: "porRecorrer", rotulo: "por recorrer" },
      { campo: "paso", rotulo: "paso", clase: "cuenta" }
    ],
    alPintar: pintarFichas
  });
})();
