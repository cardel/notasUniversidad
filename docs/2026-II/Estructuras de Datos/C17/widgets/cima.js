/* Ejercicio interactivo: la pila directa sobre nodos (clase 17). */
var EJERCICIO = (function () {
  var PILA = [5, 1, 8];
  var VALOR = 3;
  var LIMITE = 8;
  var LINEAS_APILAR = [
    ["void apilar(Elemento e) {", ""],
    ["  Nodo *nuevo = new Nodo;", ""],
    ["  nuevo->dato = e;", ""],
    ["  nuevo->siguiente = cima;", "bloque-1"],
    ["  cima = nuevo;", "bloque-1"],
    ["  n = n + 1;", ""],
    ["}", ""]
  ];
  var LINEAS_OPERACIONES = [
    ["void apilar(Elemento e) {", ""],
    ["  Nodo *nuevo = new Nodo;", ""],
    ["  nuevo->dato = e;", ""],
    ["  nuevo->siguiente = cima;", "bloque-1"],
    ["  cima = nuevo;", "bloque-1"],
    ["  n = n + 1;", ""],
    ["}", ""],
    ["// exige !vacia()", ""],
    ["void desapilar() {", ""],
    ["  assert(!vacia());", ""],
    ["  Nodo *muerto = cima;", ""],
    ["  cima = cima->siguiente;", "bloque-2"],
    ["  delete muerto;", ""],
    ["  n = n - 1;", ""],
    ["}", ""],
    ["// exige !vacia()", ""],
    ["Elemento tope() {", ""],
    ["  assert(!vacia());", ""],
    ["  return cima->dato;", "bloque-3"],
    ["}", ""]
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

  /* apilar con las dos escrituras de puntero cambiadas de orden: cima ya
     vale nuevo cuando se lee para llenar nuevo->siguiente. */
  function ordenInvertido(datos, e) {
    var nodos = cadena(datos);
    var cima = nodos[0];
    var nuevo = { dato: e, siguiente: undefined };
    cima = nuevo;
    nuevo.siguiente = cima;
    var recorrido = datosDesde(cima, LIMITE);
    var vistos = nodosDesde(cima, LIMITE);
    var inalcanzables = nodos.filter(function (x) { return vistos.indexOf(x) === -1; })
                             .map(function (x) { return x.dato; });
    return {
      seApuntaASiMismo: nuevo.siguiente === nuevo,
      termina: !recorrido.corta,
      primeros: recorrido.datos,
      inalcanzables: inalcanzables
    };
  }

  /* La pila sobre nodos, instrumentada: se cuenta cada escritura de cima y
     cada escritura del campo siguiente de un nodo. */
  function nuevaPila() {
    return { cima: null, n: 0, escrituras: 0 };
  }

  function apilar(p, e) {
    var nuevo = { dato: e, siguiente: null };
    nuevo.siguiente = p.cima;
    p.escrituras = p.escrituras + 1;
    p.cima = nuevo;
    p.escrituras = p.escrituras + 1;
    p.n = p.n + 1;
  }

  function desapilar(p) {
    var muerto = p.cima;
    p.cima = muerto.siguiente;
    p.escrituras = p.escrituras + 1;
    p.n = p.n - 1;
  }

  function tope(p) {
    return p.cima.dato;
  }

  /* Escrituras de puntero de una sola operacion, medidas sobre una pila que
     ya tiene elementos. */
  function escriturasDe(operacion) {
    var p = nuevaPila();
    apilar(p, 5);
    apilar(p, 1);
    var antes = p.escrituras;
    if (operacion === "apilar") {
      apilar(p, 8);
    } else if (operacion === "desapilar") {
      desapilar(p);
    } else {
      tope(p);
    }
    return p.escrituras - antes;
  }

  /* Escrituras de una secuencia de a apilar y d desapilar. */
  function escriturasSecuencia(a, d) {
    return a * escriturasDe("apilar") + d * escriturasDe("desapilar");
  }

  return { pila: PILA, valor: VALOR, lineasApilar: LINEAS_APILAR,
           lineasOperaciones: LINEAS_OPERACIONES, ordenInvertido: ordenInvertido,
           escriturasDe: escriturasDe, escriturasSecuencia: escriturasSecuencia };
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
    var logradas = { orden: false, escrituras: false };
    function revisar() {
      if (logradas.orden && logradas.escrituras) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    pintarCodigo("codigo-apilar", EJERCICIO.lineasApilar);
    pintarCodigo("codigo-operaciones", EJERCICIO.lineasOperaciones);

    var MENSAJES_ORDEN = {
      ciclo: null,
      igual: "No queda igual: la segunda línea lee cima, y la primera ya la cambió. Lo que se copia en nuevo->siguiente es la dirección del propio nodo nuevo.",
      vacia: "cima no queda en NULL: apunta al nodo del 3, que sí se reservó. Lo que se pierde es la cadena que había debajo, no la cima.",
      uno: "Al perder el enlace hacia el nodo del 5 se pierde todo lo que colgaba de él, porque la única forma de llegar al 1 y al 8 era pasando por ahí."
    };
    document.querySelectorAll("#opciones-orden button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-orden");
        var m = MENSAJES_ORDEN[boton.dataset.op];
        if (m === null) {
          var r = EJERCICIO.ordenInvertido(EJERCICIO.pila, EJERCICIO.valor);
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: cima ya vale nuevo cuando se lee, así que nuevo->siguiente = nuevo. Recorrer la pila desde cima da 3, 3, 3 y no termina nunca, y los nodos del " + r.inalcanzables.join(", el ") + " quedan fuera: no hay forma de llegar a ellos ni de liberarlos. El contador dice que hay cuatro elementos y solo se alcanza uno.";
          logradas.orden = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });

    document.getElementById("btn-escrituras").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-escrituras");
      var ea = EJERCICIO.escriturasDe("apilar");
      var ed = EJERCICIO.escriturasDe("desapilar");
      var et = EJERCICIO.escriturasDe("tope");
      var a = parseInt(document.getElementById("pred-apilar").value, 10);
      var d = parseInt(document.getElementById("pred-desapilar").value, 10);
      var t = parseInt(document.getElementById("pred-tope").value, 10);
      if (a === ea && d === ed && t === et) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + ea + ", " + ed + " y " + et + ". apilar escribe nuevo->siguiente y cima; desapilar escribe cima y nada más, porque el nodo que sale se libera sin tocar su campo siguiente; tope solo lee cima->dato. Ninguna de las tres mira cuántos elementos hay: Θ(1) las tres.";
        logradas.escrituras = true; revisar();
        var nota = document.getElementById("nota-escrituras");
        nota.style.display = "block";
        nota.textContent = "Un programa que apila un millón de veces y desapila un millón de veces escribe " + EJERCICIO.escriturasSecuencia(1000000, 1000000).toLocaleString("es") + " punteros, y esa cuenta no cambia con el tamaño de la pila. Sobre la lista de arreglo con el tope al frente, la misma secuencia correría del orden de un billón de elementos.";
      } else if (a === 3 || d === 2) {
        ver.className = "veredicto mal";
        ver.textContent = "nuevo->dato = e escribe un entero, no un puntero, y Nodo *nuevo = new Nodo es una variable local que desaparece al salir de la función: no es parte de la estructura. Lo mismo con Nodo *muerto.";
      } else if (t !== et) {
        ver.className = "veredicto mal";
        ver.textContent = "tope() no cambia nada: lee cima->dato y devuelve el entero. Una consulta que escribiera punteros no sería una consulta.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Cuente las líneas que ponen algo a la izquierda del igual y son punteros de la estructura: cima o el campo siguiente de un nodo.";
      }
    });
  })();
}
