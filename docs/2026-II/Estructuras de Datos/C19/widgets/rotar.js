/* Ejercicio interactivo: rotar la cola de nodos en Θ(1) (clase 19). */
var EJERCICIO = (function () {
  var COLA = [8, 3, 6, 1];
  var VECES = 3;
  var UNICO = [5];

  /* Tres ordenes de las mismas asignaciones; la 1 es la del enunciado. */
  var VERSIONES = {
    uno: [
      "Nodo *primero = cabeza;",
      "cabeza = cabeza->siguiente;",
      "primero->siguiente = NULL;",
      "ultimo->siguiente = primero;",
      "ultimo = primero;"
    ],
    dos: [
      "Nodo *primero = cabeza;",
      "primero->siguiente = NULL;",
      "cabeza = cabeza->siguiente;",
      "ultimo->siguiente = primero;",
      "ultimo = primero;"
    ],
    tres: [
      "ultimo->siguiente = cabeza;",
      "ultimo = cabeza;",
      "cabeza = cabeza->siguiente;",
      "ultimo->siguiente = NULL;"
    ]
  };

  function crear(datos) {
    var cola = { cabeza: null, ultimo: null, n: 0, escrituras: 0 };
    datos.forEach(function (d) {
      var nuevo = { dato: d, siguiente: null };
      if (cola.ultimo === null) {
        cola.cabeza = nuevo;
      } else {
        cola.ultimo.siguiente = nuevo;
      }
      cola.ultimo = nuevo;
      cola.n = cola.n + 1;
    });
    return cola;
  }

  /* El contenido desde cabeza, cortado en limite nodos por si la cadena da la vuelta. */
  function contenido(cola, limite) {
    var salida = [];
    var actual = cola.cabeza;
    while (actual !== null && salida.length < limite) {
      salida.push(actual.dato);
      actual = actual.siguiente;
    }
    return salida;
  }

  /* Ejecuta una version; conIf protege el caso cabeza == ultimo. Cuenta escrituras de puntero. */
  function rotar(cola, version, conIf) {
    if (!conIf || cola.cabeza !== cola.ultimo) {
      var primero = null;
      if (version === "uno") {
        primero = cola.cabeza;
        cola.cabeza = cola.cabeza.siguiente;
        primero.siguiente = null;
        cola.ultimo.siguiente = primero;
        cola.ultimo = primero;
        cola.escrituras = cola.escrituras + 4;
      } else if (version === "dos") {
        primero = cola.cabeza;
        primero.siguiente = null;
        cola.cabeza = cola.cabeza.siguiente;
        cola.ultimo.siguiente = primero;
        cola.ultimo = primero;
        cola.escrituras = cola.escrituras + 4;
      } else {
        cola.ultimo.siguiente = cola.cabeza;
        cola.ultimo = cola.cabeza;
        cola.cabeza = cola.cabeza.siguiente;
        cola.ultimo.siguiente = null;
        cola.escrituras = cola.escrituras + 4;
      }
    }
    return cola;
  }

  function describir(cola) {
    return {
      contenido: contenido(cola, 10),
      cabezaNula: cola.cabeza === null,
      ultimoNulo: cola.ultimo === null,
      ultimoSeApunta: cola.ultimo !== null && cola.ultimo.siguiente === cola.ultimo,
      n: cola.n,
      escrituras: cola.escrituras
    };
  }

  function varias(datos, veces, version, conIf) {
    var cola = crear(datos);
    var k = 0;
    while (k < veces) {
      rotar(cola, version, conIf);
      k = k + 1;
    }
    return describir(cola);
  }

  return { cola: COLA, veces: VECES, unico: UNICO, versiones: VERSIONES,
           varias: varias };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var X = EJERCICIO;
    var tres = X.varias(X.cola, X.veces, "uno", true);
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
    var logradas = { tres: false, lista: false, orden: false, unico: false, escrituras: false };
    function revisar() {
      if (Object.keys(logradas).every(function (k) { return logradas[k]; })) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    document.getElementById("btn-tres").addEventListener("click", function () {
      var d = leer(document.getElementById("pred-tres").value);
      if (iguales(d, tres.contenido)) {
        decir("veredicto-tres", true, "Correcto: " + tres.contenido.join(" ") + ". Cada rotar pasa el frente al final: 8 sale primero, después 3 y después 6. Con cuatro elementos, tres rotaciones equivalen a una rotación hacia atrás.");
        logradas.tres = true; revisar();
      } else if (iguales(d, [3, 6, 1, 8])) {
        decir("veredicto-tres", false, "Así queda después de una sola. Son tres seguidas.");
      } else if (iguales(d, [6, 1, 8, 3])) {
        decir("veredicto-tres", false, "Así queda después de dos. Falta una más.");
      } else {
        decir("veredicto-tres", false, "Rote a mano: el frente sale de adelante y entra por atrás, tres veces.");
      }
    });

    var MSJ_LISTA = {
      conultimo: "Correcto: la simple con cabeza y ultimo, la misma que ya lleva la cola. rotar toca la cabeza, que se quita, y el último, que recibe el nodo; los dos están a mano y ningún nodo intermedio cambia. Θ(1) en tiempo y Θ(1) en espacio aparte.",
      sinultimo: "Sin ultimo, colgar el nodo al final obliga a caminar desde la cabeza hasta el nodo cuyo siguiente es NULL: Θ(n) por cada rotación.",
      doble: "Funciona, pero no hace falta: rotar nunca necesita al penúltimo, que es lo único que daría el puntero anterior. Se pagaría un puntero más por nodo sin ganar nada."
    };
    document.querySelectorAll("#opciones-lista button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        decir("veredicto-lista", op === "conultimo", MSJ_LISTA[op]);
        if (op === "conultimo") { logradas.lista = true; revisar(); }
      });
    });

    var dos = X.varias(X.cola, 1, "dos", true);
    var uno = X.varias(X.cola, 1, "uno", true);
    var MSJ_ORDEN = {
      dos: "Correcto: la 2. Pone primero->siguiente en NULL antes de leerlo, y como primero es la cabeza, cabeza = cabeza->siguiente copia ese NULL. La cola queda con cabeza nula y n = " + dos.n + ", y los nodos 3, 6 y 1 ya no se alcanzan desde ningún puntero.",
      uno: "La 1 lee cabeza->siguiente antes de cortar el enlace del primero: queda " + uno.contenido.join(" ") + ": la cola rotada.",
      tres: "La 3 cuelga la cabeza del último antes de moverla, y corta el enlace al final, cuando cabeza ya avanzó. Queda " + X.varias(X.cola, 1, "tres", true).contenido.join(" ") + ": la cola rotada."
    };
    document.querySelectorAll("#opciones-orden button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        decir("veredicto-orden", op === "dos", MSJ_ORDEN[op]);
        if (op === "dos") { logradas.orden = true; revisar(); }
      });
    });

    var MSJ_UNICO = {
      roto: "Correcto. cabeza = cabeza->siguiente la deja en NULL, pero ultimo sigue en el nodo y n sigue en 1; después ultimo->siguiente = primero hace que el nodo se apunte a sí mismo. frente() lee una cabeza nula. Por eso el if: con un solo elemento, rotar no tiene nada que hacer.",
      nada: "Eso pasa con el if, que salta todo cuando cabeza == ultimo. Sin él, la primera asignación ya deja cabeza en NULL.",
      libera: "Ninguna línea llama a delete. El nodo sigue reservado; el problema es cómo quedan los punteros.",
      ultimo: "ultimo no pasa por NULL: la última asignación lo deja en primero, que es el mismo nodo de siempre. El que queda en NULL es otro."
    };
    document.querySelectorAll("#opciones-unico button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        decir("veredicto-unico", op === "roto", MSJ_UNICO[op]);
        if (op === "roto") { logradas.unico = true; revisar(); }
      });
    });

    document.getElementById("btn-escrituras").addEventListener("click", function () {
      var d = parseInt(document.getElementById("pred-escrituras").value, 10);
      if (d === tres.escrituras) {
        decir("veredicto-escrituras", true, "Correcto: " + tres.escrituras + ", cuatro por rotación: cabeza, primero->siguiente, ultimo->siguiente y ultimo. La cuenta no depende de cuántos elementos tenga la cola, así que rotar es Θ(1), y rotar k veces es Θ(k).");
        logradas.escrituras = true; revisar();
      } else if (d === 15) {
        decir("veredicto-escrituras", false, "primero es una variable local, no un puntero de la cadena ni de la cola. Sin ella quedan cuatro por rotación.");
      } else if (d === X.veces) {
        decir("veredicto-escrituras", false, "Cada rotación escribe más de un puntero. Cuente las asignaciones de la versión 1 que no son la declaración de primero.");
      } else {
        decir("veredicto-escrituras", false, "Cuente las asignaciones a cabeza, ultimo y a campos siguiente en una rotación, y multiplique.");
      }
    });
  })();
}
