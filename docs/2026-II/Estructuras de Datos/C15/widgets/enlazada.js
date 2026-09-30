/* Ejercicio interactivo: insertar en la lista enlazada (clase 15). */
var EJERCICIO = (function () {
  var LISTA = [5, 2, 7];
  var POSICION = 2;
  var VALOR = 9;
  var LIMITE = 8;
  var LINEAS = [
    "Nodo *nuevo = new Nodo;",
    "nuevo->dato = e;",
    "Nodo *anterior = nodoEn(p - 1);",
    "nuevo->siguiente = anterior->siguiente;",
    "anterior->siguiente = nuevo;"
  ];

  function cadena(datos) {
    var nodos = datos.map(function (d) { return { dato: d, siguiente: null }; });
    var i = 0;
    while (i < nodos.length - 1) {
      nodos[i].siguiente = nodos[i + 1];
      i = i + 1;
    }
    return nodos;
  }

  /* nodoEn(p): arranca en la cabeza y avanza p veces. */
  function nodoEn(cabeza, p) {
    var actual = cabeza;
    var i = 0;
    while (i < p) {
      actual = actual.siguiente;
      i = i + 1;
    }
    return { nodo: actual, pasos: p };
  }

  /* Lo que se alcanza desde un nodo, con tope para no colgarse en un ciclo. */
  function datosDesde(inicio, limite) {
    var salida = [];
    var actual = inicio;
    var vueltas = 0;
    while (actual !== null && actual !== undefined && vueltas < limite) {
      salida.push(actual.dato);
      actual = actual.siguiente;
      vueltas = vueltas + 1;
    }
    return { datos: salida, corta: actual !== null && actual !== undefined };
  }

  function nodosDesde(inicio, limite) {
    var vistos = [];
    var actual = inicio;
    var vueltas = 0;
    while (actual !== null && actual !== undefined && vueltas < limite) {
      if (vistos.indexOf(actual) === -1) { vistos.push(actual); }
      actual = actual.siguiente;
      vueltas = vueltas + 1;
    }
    return vistos;
  }

  /* Las cinco lineas del empalme, con una foto del estado tras cada una. */
  function traza(datos, p, e) {
    var nodos = cadena(datos);
    var cabeza = nodos[0];
    var nuevo = null;
    var anterior = null;
    var pasos = [];
    function rotulo(nodo) {
      if (nodo === undefined) { return "sin definir"; }
      if (nodo === null) { return "NULL"; }
      return "nodo del " + nodo.dato;
    }
    function foto(i) {
      pasos.push({
        linea: i,
        texto: LINEAS[i],
        cabeza: rotulo(cabeza),
        anterior: anterior === null ? "sin definir" : rotulo(anterior),
        nuevoDato: nuevo === null ? "sin reservar" : (nuevo.dato === undefined ? "sin definir" : String(nuevo.dato)),
        nuevoSiguiente: nuevo === null ? "sin reservar" : rotulo(nuevo.siguiente),
        cadena: datosDesde(cabeza, LIMITE).datos
      });
    }
    nuevo = { dato: undefined, siguiente: undefined };
    foto(0);
    nuevo.dato = e;
    foto(1);
    anterior = nodoEn(cabeza, p - 1).nodo;
    foto(2);
    nuevo.siguiente = anterior.siguiente;
    foto(3);
    anterior.siguiente = nuevo;
    foto(4);
    return { pasos: pasos, final: datosDesde(cabeza, LIMITE).datos };
  }

  /* Las dos ultimas lineas cambiadas de orden. */
  function ordenInvertido(datos, p, e) {
    var nodos = cadena(datos);
    var cabeza = nodos[0];
    var nuevo = { dato: e, siguiente: undefined };
    var anterior = nodoEn(cabeza, p - 1).nodo;
    anterior.siguiente = nuevo;
    nuevo.siguiente = anterior.siguiente;
    var recorrido = datosDesde(cabeza, LIMITE);
    var vistos = nodosDesde(cabeza, LIMITE);
    var inalcanzables = nodos.filter(function (x) { return vistos.indexOf(x) === -1; })
                             .map(function (x) { return x.dato; });
    return {
      seApuntaASiMismo: nuevo.siguiente === nuevo,
      termina: !recorrido.corta,
      primeros: recorrido.datos,
      inalcanzables: inalcanzables
    };
  }

  /* Pasos de nodoEn(p - 1) dentro de insertar. Con p = 0 no se llama: -1. */
  function pasosAnterior(p) {
    return p === 0 ? -1 : p - 1;
  }

  return { lista: LISTA, posicion: POSICION, valor: VALOR, lineas: LINEAS,
           traza: traza, ordenInvertido: ordenInvertido, pasosAnterior: pasosAnterior };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function pintarCodigo(id, lineas) {
      var caja = document.getElementById(id);
      var creadas = [];
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
        creadas.push(linea);
      });
      return creadas;
    }
    function leerLista(texto) {
      return texto.trim().split(/[\s,]+/).filter(function (x) { return x !== ""; }).map(Number);
    }
    function iguales(a, b) {
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }
    var logradas = { cadena: false, orden: false, pasos: false, cero: false };
    function revisar() {
      if (logradas.cadena && logradas.orden && logradas.pasos && logradas.cero) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var TRAZA = EJERCICIO.traza(EJERCICIO.lista, EJERCICIO.posicion, EJERCICIO.valor);
    var LINEAS_VISTA = pintarCodigo("codigo-insertar",
      EJERCICIO.lineas.map(function (t) { return [t, ""]; }));

    document.getElementById("btn-cadena").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-cadena");
      var dada = leerLista(document.getElementById("pred-cadena").value);
      if (iguales(dada, TRAZA.final)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: 5 2 9 7. anterior es el nodo del 2, que es el que estaba en la posición 1; el nodo nuevo se queda con el resto de la cadena, que empieza en el 7, y el anterior pasa a apuntarlo.";
        logradas.cadena = true; revisar();
      } else if (iguales(dada, [5, 9, 2, 7])) {
        ver.className = "veredicto mal";
        ver.textContent = "El elemento queda en la posición p, contando desde 0: con p = 2 hay dos elementos antes que él.";
      } else if (iguales(dada, [5, 2, 7, 9])) {
        ver.className = "veredicto mal";
        ver.textContent = "insertar(2, 9) no agrega al final: la posición 2 de una lista de tres elementos es la del 7, que se corre hacia atrás en la cadena.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Dibuje los tres nodos y la flecha de anterior sobre el que está en la posición p - 1. El paso a paso de abajo muestra cada línea.";
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
      var chips = document.getElementById("chips-traza");
      var caja = document.getElementById("cadena-traza");
      chips.innerHTML = "";
      caja.innerHTML = "";
      var i = vista.i;
      var estado = i === 0
        ? { cabeza: "nodo del 5", anterior: "sin definir", nuevoDato: "sin reservar",
            nuevoSiguiente: "sin reservar", cadena: EJERCICIO.lista.slice(), texto: "antes de la primera línea" }
        : TRAZA.pasos[i - 1];
      chip(chips, "cabeza", estado.cabeza, false);
      chip(chips, "anterior", estado.anterior, false);
      chip(chips, "nuevo->dato", estado.nuevoDato, true);
      chip(chips, "nuevo->siguiente", estado.nuevoSiguiente, true);
      estado.cadena.forEach(function (d, k) {
        var f = document.createElement("span");
        f.className = "ficha";
        f.textContent = d;
        caja.appendChild(f);
        var fl = document.createElement("span");
        fl.className = "flecha";
        fl.textContent = k === estado.cadena.length - 1 ? "→ NULL" : "→";
        caja.appendChild(fl);
      });
      LINEAS_VISTA.forEach(function (linea, k) {
        linea.className = "linea" + (k === i - 1 ? " actual" : "");
      });
      document.getElementById("progreso-traza").textContent =
        i === 0 ? "sin ejecutar ninguna línea" : "línea " + i + " de " + TRAZA.pasos.length + ": " + estado.texto;
      document.getElementById("btn-paso").disabled = i === TRAZA.pasos.length;
    }
    document.getElementById("btn-paso").addEventListener("click", function () {
      if (vista.i < TRAZA.pasos.length) { vista.i = vista.i + 1; pintarVista(); }
    });
    document.getElementById("btn-reinicio").addEventListener("click", function () {
      vista.i = 0; pintarVista();
    });
    pintarVista();

    var MENSAJES_ORDEN = {
      ciclo: null,
      igual: "No es igual: la segunda línea lee anterior->siguiente, y la primera ya lo cambió. Lo que se copia en nuevo->siguiente es la dirección del propio nodo nuevo.",
      alfinal: "El nodo nuevo no se mueve de donde lo puso el anterior: queda en la posición 2. Lo que cambia es a dónde apunta él."
    };
    document.querySelectorAll("#opciones-orden button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-orden");
        var m = MENSAJES_ORDEN[boton.dataset.op];
        if (m === null) {
          var r = EJERCICIO.ordenInvertido(EJERCICIO.lista, EJERCICIO.posicion, EJERCICIO.valor);
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: anterior->siguiente ya vale nuevo cuando se lee, así que nuevo->siguiente = nuevo. El recorrido desde cabeza da 5, 2 y después 9 sin parar, y el nodo del " + r.inalcanzables.join(" y el ") + " queda fuera de la cadena: no hay forma de llegar a él ni de liberarlo.";
          logradas.orden = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });

    document.getElementById("btn-pasos").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-pasos");
      var esperado = [1, 2, 3].map(EJERCICIO.pasosAnterior);
      var dada = leerLista(document.getElementById("pred-pasos").value);
      if (iguales(dada, esperado)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: 0, 1 y 2. nodoEn(p - 1) arranca en la cabeza y avanza p - 1 veces; para p = 1 la cabeza ya es el anterior y no avanza nada. En una lista de n elementos, el peor caso es insertar al final: n - 1 pasos.";
        logradas.pasos = true; revisar();
      } else if (iguales(dada, [1, 2, 3])) {
        ver.className = "veredicto mal";
        ver.textContent = "Se busca el nodo de la posición p - 1, no el de p: por eso el argumento es p - 1 y el ciclo da un paso menos.";
      } else if (dada.length !== 3) {
        ver.className = "veredicto mal";
        ver.textContent = "Tres números, uno por cada valor de p: 1, 2 y 3.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "El ciclo de nodoEn es while (i < p): con el argumento p - 1 da exactamente p - 1 avances desde la cabeza.";
      }
    });

    var MENSAJES_CERO = {
      nollama: null,
      cero: "Con p = 0 el código no entra a esa rama: la línea nuevo->siguiente = cabeza toma la cadena entera sin buscar a nadie.",
      menos: "nodoEn con -1 no se ejecuta nunca: el if de p == 0 se resuelve antes, y ahí el anterior no existe porque el nodo nuevo pasa a ser la cabeza."
    };
    document.querySelectorAll("#opciones-cero button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-cero");
        var m = MENSAJES_CERO[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: con p = 0 no hay nodo anterior y el código toma la otra rama, la que escribe nuevo->siguiente = cabeza y cabeza = nuevo. Son dos escrituras y ningún paso: Θ(1).";
          logradas.cero = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}
