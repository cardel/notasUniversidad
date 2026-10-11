/* Ejercicio interactivo: concatenar dos colas de nodos (clase 19). */
var EJERCICIO = (function () {
  var C = [5, 2];
  var D = [9, 4, 7];

  function crear(datos) {
    var cola = { cabeza: null, ultimo: null, n: 0 };
    datos.forEach(function (d) { encolar(cola, d, null); });
    return cola;
  }

  function encolar(cola, e, cuenta) {
    var nuevo = { dato: e, siguiente: null };
    if (cuenta !== null) { cuenta.nuevos = cuenta.nuevos + 1; }
    if (cola.ultimo === null) {
      cola.cabeza = nuevo;
    } else {
      cola.ultimo.siguiente = nuevo;
    }
    cola.ultimo = nuevo;
    cola.n = cola.n + 1;
  }

  function desencolar(cola, cuenta) {
    cola.cabeza = cola.cabeza.siguiente;
    if (cola.cabeza === null) {
      cola.ultimo = null;
    }
    if (cuenta !== null) { cuenta.liberados = cuenta.liberados + 1; }
    cola.n = cola.n - 1;
  }

  function contenido(cola) {
    var salida = [];
    var actual = cola.cabeza;
    while (actual !== null && salida.length < 20) {
      salida.push(actual.dato);
      actual = actual.siguiente;
    }
    return salida;
  }

  /* La version que reengancha nodos; sinRama quita el caso de la cola vacia. */
  function concatenar(esta, otra, sinRama) {
    var fallo = null;
    if (otra.cabeza !== null) {
      if (esta.ultimo === null && !sinRama) {
        esta.cabeza = otra.cabeza;
      } else if (esta.ultimo === null) {
        fallo = "ultimo es NULL y se escribe ultimo->siguiente";
      } else {
        esta.ultimo.siguiente = otra.cabeza;
      }
      if (fallo === null) {
        esta.ultimo = otra.ultimo;
        esta.n = esta.n + otra.n;
        otra.cabeza = null;
        otra.ultimo = null;
        otra.n = 0;
      }
    }
    return fallo;
  }

  /* La version con el contrato: un encolar y un desencolar por elemento. */
  function concatenarContrato(esta, otra) {
    var cuenta = { nuevos: 0, liberados: 0 };
    while (otra.n !== 0) {
      encolar(esta, otra.cabeza.dato, cuenta);
      desencolar(otra, cuenta);
    }
    return cuenta;
  }

  function probar(c, d, version, sinRama) {
    var x = crear(c);
    var y = crear(d);
    var r = version === "contrato" ? concatenarContrato(x, y) : concatenar(x, y, sinRama);
    return { esta: contenido(x), n: x.n, otra: contenido(y), nOtra: y.n, resultado: r };
  }

  return { c: C, d: D, probar: probar };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var X = EJERCICIO;
    var R = X.probar(X.c, X.d, "punteros", false);
    var K = X.probar(X.c, X.d, "contrato", false);
    function decir(id, bien, texto) {
      var ver = document.getElementById(id);
      ver.className = "veredicto " + (bien ? "bien" : "mal");
      ver.textContent = texto;
    }
    function leer(texto) {
      return texto.trim().split(/[\s,;]+/).filter(function (x) { return x !== ""; })
                  .map(function (x) { return parseInt(x, 10); });
    }
    function iguales(a, b) {
      return a.length === b.length && a.every(function (x, k) { return x === b[k]; });
    }
    var logradas = { resultado: false, costo: false, contrato: false, vacia: false, vaciar: false };
    function revisar() {
      if (Object.keys(logradas).every(function (k) { return logradas[k]; })) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    document.getElementById("btn-resultado").addEventListener("click", function () {
      var dc = leer(document.getElementById("pred-c").value);
      var dn = parseInt(document.getElementById("pred-d").value, 10);
      if (iguales(dc, R.esta) && dn === R.nOtra) {
        decir("veredicto-resultado", true, "Correcto: c = " + R.esta.join(" ") + " y d.tamano() = " + R.nOtra + ". Los nodos de d se cuelgan detrás del 2, en su orden, y d queda vacía: sus nodos ahora son de c.");
        logradas.resultado = true; revisar();
      } else if (iguales(dc, [9, 4, 7, 5, 2])) {
        decir("veredicto-resultado", false, "d entra por el final de c, como haría encolar: lo que ya estaba en c sigue adelante.");
      } else if (dn === X.d.length) {
        decir("veredicto-resultado", false, "La función deja otra.cabeza, otra.ultimo y otra.n en cero: d ya no tiene nodos.");
      } else {
        decir("veredicto-resultado", false, "Siga el código: ultimo de c pasa a apuntar a la cabeza de d, y ultimo de c pasa a ser el último de d.");
      }
    });

    var MSJ_COSTO = {
      uno: "Correcto: Θ(1). Se escriben cuatro punteros y dos enteros, sin importar cuántos nodos tenga cada cola. En espacio aparte también Θ(1): ningún nodo se reserva.",
      m: "Θ(m) sería si hubiera que recorrer d. Aquí no se visita ningún nodo de d fuera de los dos extremos, que d ya tiene en cabeza y ultimo.",
      nm: "Θ(n + m) sería si hubiera que recorrer las dos. El último de c está en ultimo, así que no hace falta caminar por c tampoco."
    };
    document.querySelectorAll("#opciones-costo button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        decir("veredicto-costo", op === "uno", MSJ_COSTO[op]);
        if (op === "uno") { logradas.costo = true; revisar(); }
      });
    });

    document.getElementById("btn-contrato").addEventListener("click", function () {
      var nu = parseInt(document.getElementById("pred-nuevos").value, 10);
      var li = parseInt(document.getElementById("pred-liberados").value, 10);
      if (nu === K.resultado.nuevos && li === K.resultado.liberados) {
        decir("veredicto-contrato", true, "Correcto: " + K.resultado.nuevos + " y " + K.resultado.liberados + ". Cada elemento de d se copia a un nodo nuevo de c y su nodo viejo se libera. El resultado es el mismo, " + K.esta.join(" ") + ", pero cuesta Θ(m) en tiempo, con m = d.tamano(), y m reservas de memoria.");
        logradas.contrato = true; revisar();
      } else if (nu === 0 || li === 0) {
        decir("veredicto-contrato", false, "Desde afuera de la clase no se ven los nodos de d: encolar reserva uno nuevo por elemento, y desencolar libera el de d.");
      } else {
        decir("veredicto-contrato", false, "El ciclo da una vuelta por elemento de d, con un encolar y un desencolar en cada una.");
      }
    });

    var MSJ_VACIA = {
      falla: "Correcto. Con c vacía, ultimo vale NULL y ultimo->siguiente lee un puntero nulo: el programa se cae. La rama que falta es la que pone cabeza = otra.cabeza, igual que encolar sobre una cola vacía.",
      vacia: "La función sí hace algo: escribe ultimo->siguiente, y en una cola vacía ultimo es NULL.",
      bien: "Funcionaría si se saltara la escritura de ultimo->siguiente, pero el código la hace siempre que d tenga elementos."
    };
    document.querySelectorAll("#opciones-vacia button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        decir("veredicto-vacia", op === "falla", MSJ_VACIA[op]);
        if (op === "falla") { logradas.vacia = true; revisar(); }
      });
    });

    var MSJ_VACIAR = {
      doble: "Correcto. Sin esas tres líneas, d sigue apuntando a los nodos 9, 4 y 7, que ahora también son de c. Al salir del ámbito se destruyen las dos colas, y el destructor de cada una libera esos tres nodos: el segundo delete cae sobre memoria ya liberada.",
      tamano: "d.tamano() quedaría mal, es cierto, pero eso es lo de menos. El daño grave aparece al destruir las colas.",
      nada: "Las dos colas compartirían nodos. Cualquier operación sobre d cambia c, y al final los dos destructores liberan los mismos nodos."
    };
    document.querySelectorAll("#opciones-vaciar button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        decir("veredicto-vaciar", op === "doble", MSJ_VACIAR[op]);
        if (op === "doble") { logradas.vaciar = true; revisar(); }
      });
    });
  })();
}
