/* Ejercicio interactivo: la pila sobre arreglo y su techo (clase 17). */
var EJERCICIO = (function () {
  var CAPACIDAD = 4;
  var OPERACIONES = [
    { nombre: "apilar(7)", clase: "apilar", valor: 7 },
    { nombre: "apilar(3)", clase: "apilar", valor: 3 },
    { nombre: "apilar(1)", clase: "apilar", valor: 1 },
    { nombre: "desapilar()", clase: "desapilar" },
    { nombre: "apilar(6)", clase: "apilar", valor: 6 },
    { nombre: "apilar(2)", clase: "apilar", valor: 2 },
    { nombre: "apilar(9)", clase: "apilar", valor: 9 }
  ];
  var LINEAS = [
    ["class Pila {", ""],
    ["private:", ""],
    ["  Elemento datos[CAPACIDAD];", ""],
    ["  int n;", ""],
    ["public:", ""],
    ["  void apilar(Elemento e) {", "bloque-1"],
    ["    assert(n < CAPACIDAD);", "bloque-1"],
    ["    datos[n] = e;", "bloque-1"],
    ["    n = n + 1;", "bloque-1"],
    ["  }", ""],
    ["  // exige !vacia()", ""],
    ["  void desapilar() {", "bloque-2"],
    ["    assert(!vacia());", "bloque-2"],
    ["    n = n - 1;", "bloque-2"],
    ["  }", ""],
    ["  // exige !vacia()", ""],
    ["  Elemento tope() {", "bloque-3"],
    ["    assert(!vacia());", "bloque-3"],
    ["    return datos[n - 1];", "bloque-3"],
    ["  }", ""],
    ["};", ""]
  ];

  /* Corre la secuencia sobre el arreglo. La operacion que no cumple su
     precondicion no se ejecuta: el assert detiene el programa y ni la
     casilla ni el contador cambian. */
  function correr(ops, capacidad) {
    var datos = [];
    var n = 0;
    var pasos = [];
    var k = 0;
    while (k < ops.length) {
      var o = ops[k];
      var ejecutada = true;
      if (o.clase === "apilar") {
        if (n < capacidad) {
          datos[n] = o.valor;
          n = n + 1;
        } else {
          ejecutada = false;
        }
      } else {
        if (n > 0) {
          n = n - 1;
        } else {
          ejecutada = false;
        }
      }
      pasos.push({
        nombre: o.nombre,
        ejecutada: ejecutada,
        n: n,
        tope: n === 0 ? null : datos[n - 1],
        escritas: datos.slice(0),
        dentro: n
      });
      k = k + 1;
    }
    return pasos;
  }

  /* Los topes y los valores de n de las operaciones que si se ejecutan. */
  function topes() {
    return correr(OPERACIONES, CAPACIDAD)
      .filter(function (p) { return p.ejecutada; })
      .map(function (p) { return p.tope; });
  }

  function enes() {
    return correr(OPERACIONES, CAPACIDAD)
      .filter(function (p) { return p.ejecutada; })
      .map(function (p) { return p.n; });
  }

  return { capacidad: CAPACIDAD, operaciones: OPERACIONES, lineas: LINEAS,
           correr: correr, topes: topes, enes: enes };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function pintarCodigo(id, lineas) {
      var caja = document.getElementById(id);
      lineas.forEach(function (par, i) {
        var linea = document.createElement("div");
        linea.className = "linea" + (par[1] ? " " + par[1] : "");
        var num = document.createElement("span");
        num.className = "num";
        num.textContent = i + 1;
        var txt = document.createElement("span");
        txt.className = "txt";
        txt.textContent = par[0];
        linea.appendChild(num);
        linea.appendChild(txt);
        caja.appendChild(linea);
      });
    }
    function leerLista(texto) {
      return texto.trim().split(/[\s,]+/).filter(function (x) { return x !== ""; }).map(Number);
    }
    function iguales(a, b) {
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }
    var logradas = { prediccion: false, septima: false };
    function revisar() {
      if (logradas.prediccion && logradas.septima) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var PASOS = EJERCICIO.correr(EJERCICIO.operaciones, EJERCICIO.capacidad);
    var TOPES = EJERCICIO.topes();
    var ENES = EJERCICIO.enes();
    pintarCodigo("codigo-pila", EJERCICIO.lineas);

    document.getElementById("btn-prediccion").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-prediccion");
      var t = leerLista(document.getElementById("pred-topes").value);
      var e = leerLista(document.getElementById("pred-enes").value);
      if (iguales(t, TOPES) && iguales(e, ENES)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: topes " + TOPES.join(", ") + " y n igual a " + ENES.join(", ") + ". Cada apilar escribe datos[n] y sube el contador, así que el tope es siempre el último que entró. El desapilar baja n a 2 y el tope vuelve a ser el 3, que estaba en datos[1]: el 1 sigue escrito en datos[2], pero ya no es parte de la pila.";
        logradas.prediccion = true; revisar();
      } else if (iguales(t, [7, 3, 1, 1, 6, 2])) {
        ver.className = "veredicto mal";
        ver.textContent = "Después de desapilar, el tope no es el que salió: n bajó a 2 y tope() lee datos[1], que es el 3.";
      } else if (iguales(t, [7, 3, 1, 7, 6, 2])) {
        ver.className = "veredicto mal";
        ver.textContent = "La pila saca por donde mete. El elemento que queda arriba tras desapilar es el que entró justo antes del que salió, no el primero de todos.";
      } else if (iguales(t, TOPES) && iguales(e, ENES) === false) {
        ver.className = "veredicto mal";
        ver.textContent = "Los topes están bien. n cuenta cuántos elementos hay: sube uno por cada apilar que se ejecuta y baja uno con desapilar.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Seis números en cada casilla, uno por operación. El paso a paso de abajo muestra el arreglo y el contador tras cada una.";
      }
    });

    var vista = { i: 0 };
    function chip(padre, rotulo, valor, cuenta) {
      var d = document.createElement("div");
      d.className = "chip" + (cuenta ? " cuenta" : "");
      var b = document.createElement("b");
      b.textContent = rotulo + ": ";
      d.appendChild(b);
      d.appendChild(document.createTextNode(String(valor)));
      padre.appendChild(d);
    }
    function pintarVista() {
      var chips = document.getElementById("chips-pila");
      var fila = document.getElementById("arreglo-pila");
      chips.innerHTML = "";
      fila.innerHTML = "";
      var i = vista.i;
      var estado = i === 0
        ? { nombre: "antes de la primera operación", ejecutada: true, n: 0,
            tope: null, escritas: [], dentro: 0 }
        : PASOS[i - 1];
      chip(chips, "n", estado.n, true);
      chip(chips, "tope()", estado.tope === null ? "la precondición no se cumple" : estado.tope, true);
      chip(chips, "vacia()", estado.n === 0 ? "true" : "false", false);
      var k = 0;
      while (k < EJERCICIO.capacidad) {
        var c = document.createElement("div");
        var adentro = k < estado.dentro;
        c.className = "caja" + (adentro ? " visitada" : "") + (k === estado.dentro - 1 ? " actual" : "");
        var idx = document.createElement("span");
        idx.className = "indice";
        idx.textContent = k;
        c.appendChild(idx);
        c.appendChild(document.createTextNode(
          estado.escritas[k] === undefined ? "" : String(estado.escritas[k])));
        fila.appendChild(c);
        k = k + 1;
      }
      document.getElementById("progreso-pila").textContent =
        i === 0
          ? "sin ejecutar ninguna operación"
          : "operación " + i + " de " + PASOS.length + ": " + estado.nombre +
            (estado.ejecutada ? "" : ", que no se ejecuta porque n ya vale " + EJERCICIO.capacidad);
      document.getElementById("btn-paso").disabled = i === PASOS.length;
    }
    document.getElementById("btn-paso").addEventListener("click", function () {
      if (vista.i < PASOS.length) { vista.i = vista.i + 1; pintarVista(); }
    });
    document.getElementById("btn-reinicio").addEventListener("click", function () {
      vista.i = 0; pintarVista();
    });
    pintarVista();

    var MENSAJES = {
      assert: null,
      entra: "No hay casilla donde ponerlo: datos tiene CAPACIDAD casillas, de la 0 a la 3, y las cuatro están ocupadas.",
      pierde: "La pila no descarta nada por su cuenta. Sacar el más viejo sería la cola, y aun así tendría que estar en el contrato: aquí no está.",
      escribe: "Eso es justo lo que el assert impide. Escribir en datos[4] pasa por encima de lo que haya en memoria después del arreglo, y el error aparecería mucho después, en otra variable."
    };
    document.querySelectorAll("#opciones-septima button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-septima");
        var m = MENSAJES[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: n vale " + EJERCICIO.capacidad + " y la condición n < CAPACIDAD es falsa, así que el assert detiene el programa antes de escribir. La pila se queda en " + EJERCICIO.capacidad + " elementos con el 2 en el tope. CAPACIDAD se fija al compilar, y subirla exige recompilar y volver a adivinar cuántos elementos van a llegar.";
          logradas.septima = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}
