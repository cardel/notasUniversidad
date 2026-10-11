/* Ejercicio interactivo: sumar los elementos de la lista, la pila y la cola (clase 19). */
var EJERCICIO = (function () {
  var N = 12;

  /* Lista sobre nodos: obtener(p) camina p nodos desde la cabeza (nodoEn). */
  function sumarLista(datos) {
    var cuenta = { avances: 0, nuevos: 0, apilar: 0 };
    var cabeza = null;
    var k = datos.length - 1;
    while (k >= 0) {
      cabeza = { dato: datos[k], siguiente: cabeza };
      k = k - 1;
    }
    function obtener(p) {
      var actual = cabeza;
      var i = 0;
      while (i < p) {
        actual = actual.siguiente;
        cuenta.avances = cuenta.avances + 1;
        i = i + 1;
      }
      return actual.dato;
    }
    var suma = 0;
    var p = 0;
    while (p < datos.length) {
      suma = suma + obtener(p);
      p = p + 1;
    }
    return { suma: suma, cuenta: cuenta };
  }

  /* Cola sobre nodos: cada vuelta lleva el frente al final con encolar y desencolar. */
  function sumarCola(datos) {
    var cuenta = { avances: 0, nuevos: 0, apilar: 0 };
    var cola = { cabeza: null, ultimo: null, n: 0 };
    function encolar(e) {
      var nuevo = { dato: e, siguiente: null };
      cuenta.nuevos = cuenta.nuevos + 1;
      if (cola.ultimo === null) {
        cola.cabeza = nuevo;
      } else {
        cola.ultimo.siguiente = nuevo;
      }
      cola.ultimo = nuevo;
      cola.n = cola.n + 1;
    }
    function desencolar() {
      cola.cabeza = cola.cabeza.siguiente;
      if (cola.cabeza === null) {
        cola.ultimo = null;
      }
      cola.n = cola.n - 1;
    }
    datos.forEach(function (d) { encolar(d); });
    cuenta.nuevos = 0;
    var suma = 0;
    var k = 0;
    var n = cola.n;
    while (k < n) {
      suma = suma + cola.cabeza.dato;
      encolar(cola.cabeza.dato);
      desencolar();
      k = k + 1;
    }
    var queda = [];
    var actual = cola.cabeza;
    while (actual !== null) {
      queda.push(actual.dato);
      actual = actual.siguiente;
    }
    return { suma: suma, cuenta: cuenta, queda: queda };
  }

  /* Pila sobre nodos: se vacia en una auxiliar y se devuelve. */
  function sumarPila(datos) {
    var cuenta = { avances: 0, nuevos: 0, apilar: 0 };
    function apilar(pila, e) {
      pila.cima = { dato: e, siguiente: pila.cima };
      cuenta.apilar = cuenta.apilar + 1;
    }
    function desapilar(pila) {
      pila.cima = pila.cima.siguiente;
    }
    var p = { cima: null };
    datos.forEach(function (d) { apilar(p, d); });
    cuenta.apilar = 0;
    var aux = { cima: null };
    var suma = 0;
    while (p.cima !== null) {
      suma = suma + p.cima.dato;
      apilar(aux, p.cima.dato);
      desapilar(p);
    }
    while (aux.cima !== null) {
      apilar(p, aux.cima.dato);
      desapilar(aux);
    }
    var queda = [];
    var actual = p.cima;
    while (actual !== null) {
      queda.push(actual.dato);
      actual = actual.siguiente;
    }
    return { suma: suma, cuenta: cuenta, queda: queda };
  }

  function datosDe(n) {
    var v = [];
    var k = 0;
    while (k < n) {
      v.push(k + 1);
      k = k + 1;
    }
    return v;
  }

  return { n: N, datosDe: datosDe, sumarLista: sumarLista, sumarCola: sumarCola,
           sumarPila: sumarPila };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var N = EJERCICIO.n;
    var D = EJERCICIO.datosDe(N);
    var L = EJERCICIO.sumarLista(D);
    var C = EJERCICIO.sumarCola(D);
    var P = EJERCICIO.sumarPila(D);
    function decir(id, bien, texto) {
      var ver = document.getElementById(id);
      ver.className = "veredicto " + (bien ? "bien" : "mal");
      ver.textContent = texto;
    }
    function valor(id) {
      return parseInt(document.getElementById(id).value, 10);
    }
    var logradas = { lista: false, cola: false, pila: false, cuadratica: false };
    function revisar() {
      if (logradas.lista && logradas.cola && logradas.pila && logradas.cuadratica) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    document.getElementById("btn-lista").addEventListener("click", function () {
      var d = valor("pred-lista");
      var e = L.cuenta.avances;
      if (d === e) {
        decir("veredicto-lista", true, "Correcto: " + e + " = 0 + 1 + 2 + ... + 11. obtener(p) arranca siempre en la cabeza y avanza p nodos; ninguna llamada aprovecha dónde quedó la anterior.");
        logradas.lista = true; revisar();
      } else if (d === N || d === N - 1) {
        decir("veredicto-lista", false, "Eso costaría un solo recorrido. Pero cada obtener(p) vuelve a empezar en la cabeza: el de p = 11 camina once nodos por su cuenta.");
      } else if (d === N * N) {
        decir("veredicto-lista", false, "Cerca, pero obtener(p) da p avances, no n: la suma es 0 + 1 + ... + 11.");
      } else if (d === N * (N + 1) / 2) {
        decir("veredicto-lista", false, "Sobra el último término: obtener(0) no avanza y obtener(11) avanza once, no doce.");
      } else {
        decir("veredicto-lista", false, "Sume lo que avanza cada llamada: obtener(0) avanza 0, obtener(1) avanza 1, y así hasta obtener(11).");
      }
    });

    document.getElementById("btn-cola").addEventListener("click", function () {
      var a = valor("pred-cola-avances");
      var nu = valor("pred-cola-nuevos");
      if (a === C.cuenta.avances && nu === C.cuenta.nuevos) {
        decir("veredicto-cola", true, "Correcto: " + C.cuenta.avances + " avances y " + C.cuenta.nuevos + " nodos nuevos. La cola nunca camina: lee el frente, lo encola al final y lo saca de adelante. Tras doce vueltas cada elemento dio la vuelta una vez y la cola queda como empezó. A cambio, cada vuelta reserva un nodo con new y libera otro con delete.");
        logradas.cola = true; revisar();
      } else if (a !== C.cuenta.avances) {
        decir("veredicto-cola", false, "frente, encolar y desencolar trabajan en los extremos, que la cola tiene a mano con cabeza y ultimo. Ninguna de las tres recorre la cadena.");
      } else {
        decir("veredicto-cola", false, "encolar reserva un nodo nuevo cada vez que se llama, aunque el dato ya estuviera en la cola. ¿Cuántas veces se llama?");
      }
    });

    document.getElementById("btn-pila").addEventListener("click", function () {
      var d = valor("pred-pila");
      var e = P.cuenta.apilar;
      if (d === e) {
        decir("veredicto-pila", true, "Correcto: " + e + ". Doce para pasar los elementos a aux y doce para devolverlos. Pasar dos veces deja el orden original: la primera pila invierte y la segunda deshace la inversión. El tiempo es Θ(n), y aux ocupa Θ(n) de espacio aparte cuando está llena.");
        logradas.pila = true; revisar();
      } else if (d === N) {
        decir("veredicto-pila", false, "Esos son los del primer ciclo. Si la función termina ahí, p queda vacía: el segundo ciclo los devuelve.");
      } else {
        decir("veredicto-pila", false, "Cuente los apilar de los dos ciclos: cada elemento pasa a aux y vuelve a p.");
      }
    });

    var MSJ = {
      lista: "Correcto: la de la lista. Cada obtener cuesta Θ(p), y la suma de 0 a n − 1 da n(n − 1)/2, Θ(n²). Las otras dos son Θ(n) porque solo tocan los extremos. Recorrer la lista con un puntero que avanza un nodo por vuelta, como hace el destructor, la dejaría en Θ(n), pero eso se escribe dentro de la clase, donde se ven los nodos. Desde afuera, el contrato lee por posición con obtener(p).",
      cola: "La cola hace doce vueltas de Θ(1) cada una: Θ(n). Lo que paga son las reservas de nodos, no recorridos.",
      pila: "La pila hace dos pasadas de Θ(1) por elemento: Θ(n) en tiempo, con Θ(n) de espacio en aux. El espacio no la vuelve cuadrática."
    };
    document.querySelectorAll("#opciones-cuadratica button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        decir("veredicto-cuadratica", op === "lista", MSJ[op]);
        if (op === "lista") { logradas.cuadratica = true; revisar(); }
      });
    });
  })();
}
