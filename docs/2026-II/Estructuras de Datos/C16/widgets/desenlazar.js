/* Ejercicio interactivo: desenlazar en la lista doblemente enlazada (clase 16). */
var EJERCICIO = (function () {
  var LISTA = [3, 9, 1, 6];
  var LIMITE = 8;
  var LINEAS = [
    "void desenlazar(Nodo *x) {",
    "  if (x->anterior == NULL) {",
    "    cabeza = x->siguiente;",
    "  } else {",
    "    x->anterior->siguiente = x->siguiente;",
    "  }",
    "  if (x->siguiente == NULL) {",
    "    ultimo = x->anterior;",
    "  } else {",
    "    x->siguiente->anterior = x->anterior;",
    "  }",
    "}"
  ];

  /* Cadena doble, con NULL en los dos extremos. */
  function cadena(datos) {
    var nodos = datos.map(function (d) {
      return { dato: d, anterior: null, siguiente: null };
    });
    var i = 0;
    while (i < nodos.length) {
      if (i > 0) { nodos[i].anterior = nodos[i - 1]; }
      if (i < nodos.length - 1) { nodos[i].siguiente = nodos[i + 1]; }
      i = i + 1;
    }
    return nodos;
  }

  /* Lo que se alcanza desde un nodo siguiendo un campo, con tope. */
  function desde(inicio, campo, limite) {
    var salida = [];
    var actual = inicio;
    var vueltas = 0;
    while (actual !== null && vueltas < limite) {
      salida.push(actual.dato);
      actual = actual[campo];
      vueltas = vueltas + 1;
    }
    return salida;
  }

  function buscar(nodos, dato) {
    var hallado = null;
    var i = 0;
    while (i < nodos.length) {
      if (nodos[i].dato === dato) { hallado = nodos[i]; }
      i = i + 1;
    }
    return hallado;
  }

  /* Las lineas que desenlazar ejecuta sobre x, con una foto tras cada una. */
  function traza(datos, objetivo) {
    var nodos = cadena(datos);
    var lista = { cabeza: nodos[0], ultimo: nodos[nodos.length - 1] };
    var x = buscar(nodos, objetivo);
    var pasos = [];
    var escrituras = 0;
    var escritos = [];
    function rotulo(nodo) { return nodo === null ? "NULL" : "nodo del " + nodo.dato; }
    function foto(linea, escrito) {
      pasos.push({
        linea: linea,
        texto: LINEAS[linea].trim(),
        escrito: escrito,
        escrituras: escrituras,
        cabeza: rotulo(lista.cabeza),
        ultimo: rotulo(lista.ultimo),
        adelante: desde(lista.cabeza, "siguiente", LIMITE),
        atras: desde(lista.ultimo, "anterior", LIMITE)
      });
    }
    foto(1, "");
    if (x.anterior === null) {
      lista.cabeza = x.siguiente;
      escrituras = escrituras + 1;
      escritos.push("cabeza");
      foto(2, "cabeza");
    } else {
      x.anterior.siguiente = x.siguiente;
      escrituras = escrituras + 1;
      escritos.push("el siguiente del " + x.anterior.dato);
      foto(4, "el siguiente del " + x.anterior.dato);
    }
    foto(6, "");
    if (x.siguiente === null) {
      lista.ultimo = x.anterior;
      escrituras = escrituras + 1;
      escritos.push("ultimo");
      foto(7, "ultimo");
    } else {
      x.siguiente.anterior = x.anterior;
      escrituras = escrituras + 1;
      escritos.push("el anterior del " + x.siguiente.dato);
      foto(9, "el anterior del " + x.siguiente.dato);
    }
    return {
      pasos: pasos,
      escrituras: escrituras,
      escritos: escritos,
      cadena: desde(lista.cabeza, "siguiente", LIMITE),
      cadenaAtras: desde(lista.ultimo, "anterior", LIMITE)
    };
  }

  /* En la enlazada simple hay que llegar al nodo que apunta a x. */
  function visitadosSimple(datos, objetivo) {
    var nodos = cadena(datos);
    var x = buscar(nodos, objetivo);
    var actual = nodos[0];
    var visitados = 0;
    var anterior = null;
    while (anterior === null && actual !== null) {
      visitados = visitados + 1;
      if (actual.siguiente === x) {
        anterior = actual;
      } else {
        actual = actual.siguiente;
      }
    }
    return visitados;
  }

  return { lista: LISTA, lineas: LINEAS, traza: traza,
           visitadosSimple: visitadosSimple };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function pintarCodigo(id, lineas) {
      var caja = document.getElementById(id);
      var creadas = [];
      lineas.forEach(function (texto, i) {
        var linea = document.createElement("div");
        linea.className = "linea";
        var num = document.createElement("span");
        num.className = "num";
        num.textContent = i + 1;
        var txt = document.createElement("span");
        txt.className = "txt";
        txt.textContent = texto;
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
    var logradas = { uno: false, cabeza: false, primerif: false, simple: false };
    function revisar() {
      if (logradas.uno && logradas.cabeza && logradas.primerif && logradas.simple) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var UNO = EJERCICIO.traza(EJERCICIO.lista, 1);
    var TRES = EJERCICIO.traza(EJERCICIO.lista, 3);
    var LINEAS_VISTA = pintarCodigo("codigo-desenlazar", EJERCICIO.lineas);

    document.getElementById("btn-uno").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-uno");
      var e = parseInt(document.getElementById("pred-escrituras").value, 10);
      var c = leerLista(document.getElementById("pred-cadena").value);
      if (e === UNO.escrituras && iguales(c, UNO.cadena)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + UNO.escrituras + " escrituras y la cadena " +
          UNO.cadena.join(" ") + ". El nodo del 1 tiene vecinos por los dos lados, así que " +
          "se ejecutan las dos ramas else: " + UNO.escritos.join(" y ") + ".";
        logradas.uno = true; revisar();
      } else if (e === 4) {
        ver.className = "veredicto mal";
        ver.textContent = "El código tiene cuatro líneas de asignación, pero cada if ejecuta una sola de sus dos ramas: son dos escrituras, no cuatro.";
      } else if (e === 1) {
        ver.className = "veredicto mal";
        ver.textContent = "Con una sola escritura la cadena queda mal por un lado: el 9 llegaría al 6 hacia adelante, y el 6 seguiría apuntando al 1 hacia atrás.";
      } else if (iguales(c, [3, 9, 1, 6])) {
        ver.className = "veredicto mal";
        ver.textContent = "El nodo del 1 sale de la cadena: nadie lo apunta después de las dos escrituras. Siga la traza de abajo.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Cuente las asignaciones que se ejecutan, no las que aparecen, y dibuje a dónde apuntan el 9 y el 6 al terminar.";
      }
    });

    var vista = { i: 0, cual: "uno" };
    function datos() { return vista.cual === "uno" ? UNO : TRES; }
    function chip(padre, rotulo, valor, cuenta) {
      var d = document.createElement("div");
      d.className = "chip" + (cuenta ? " cuenta" : "");
      var b = document.createElement("b");
      b.textContent = rotulo + ": ";
      d.appendChild(b);
      d.appendChild(document.createTextNode(String(valor)));
      padre.appendChild(d);
    }
    function pintarFila(id, rotulo, datosFila, flecha) {
      var caja = document.getElementById(id);
      caja.innerHTML = "";
      var etiqueta = document.createElement("span");
      etiqueta.className = "flecha";
      etiqueta.textContent = rotulo;
      caja.appendChild(etiqueta);
      datosFila.forEach(function (d, k) {
        var f = document.createElement("span");
        f.className = "ficha";
        f.textContent = d;
        caja.appendChild(f);
        var fl = document.createElement("span");
        fl.className = "flecha";
        fl.textContent = k === datosFila.length - 1 ? flecha + " NULL" : flecha;
        caja.appendChild(fl);
      });
    }
    function pintarVista() {
      var R = datos();
      var chips = document.getElementById("chips-traza");
      chips.innerHTML = "";
      var i = vista.i;
      var inicial = {
        escrituras: 0, cabeza: "nodo del 3", ultimo: "nodo del 6",
        adelante: EJERCICIO.lista.slice(),
        atras: EJERCICIO.lista.slice().reverse(),
        texto: "antes de entrar a desenlazar", escrito: ""
      };
      var estado = i === 0 ? inicial : R.pasos[i - 1];
      chip(chips, "x", "nodo del " + (vista.cual === "uno" ? "1" : "3"), false);
      chip(chips, "cabeza", estado.cabeza, false);
      chip(chips, "ultimo", estado.ultimo, false);
      chip(chips, "escrituras", estado.escrituras, true);
      pintarFila("adelante-traza", "desde cabeza:", estado.adelante, "→");
      pintarFila("atras-traza", "desde ultimo:", estado.atras, "←");
      LINEAS_VISTA.forEach(function (linea, k) {
        linea.className = "linea" + (i > 0 && k === estado.linea ? " actual" : "");
      });
      document.getElementById("progreso-traza").textContent = i === 0
        ? inicial.texto
        : "paso " + i + " de " + R.pasos.length + ": " + estado.texto +
          (estado.escrito === "" ? "" : ". Se escribe " + estado.escrito);
      document.getElementById("btn-paso").disabled = i === R.pasos.length;
    }
    document.getElementById("btn-paso").addEventListener("click", function () {
      if (vista.i < datos().pasos.length) { vista.i = vista.i + 1; pintarVista(); }
    });
    document.getElementById("btn-reinicio").addEventListener("click", function () {
      vista.i = 0; pintarVista();
    });
    document.getElementById("btn-nodo-1").addEventListener("click", function () {
      vista.cual = "uno"; vista.i = 0; pintarVista();
    });
    document.getElementById("btn-nodo-3").addEventListener("click", function () {
      vista.cual = "tres"; vista.i = 0; pintarVista();
    });
    pintarVista();

    document.getElementById("btn-cabeza").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-cabeza");
      var e = parseInt(document.getElementById("pred-escrituras-3").value, 10);
      var c = leerLista(document.getElementById("pred-cadena-3").value);
      if (e === TRES.escrituras && iguales(c, TRES.cadena)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + TRES.escrituras + " escrituras y la cadena " +
          TRES.cadena.join(" ") + ". Se escriben " + TRES.escritos.join(" y ") +
          ": el 3 no tiene anterior, así que la lista entera cambia de principio.";
        logradas.cabeza = true; revisar();
      } else if (e === 1) {
        ver.className = "veredicto mal";
        ver.textContent = "Siguen siendo dos: el primer if mueve cabeza y el segundo deja el anterior del 9 en NULL, que es lo que lo convierte en primero.";
      } else if (iguales(c, [3, 9, 1, 6])) {
        ver.className = "veredicto mal";
        ver.textContent = "El 3 sale de la cadena y cabeza pasa a señalar el 9: la cadena desde cabeza ya no empieza en 3.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Mire qué rama toma cada if cuando x es el primer nodo, y después recorra desde cabeza. El botón de arriba traza este caso.";
      }
    });

    var MENSAJES_PRIMERIF = {
      cabeza: null,
      ultimo: "El segundo if se resuelve igual que antes: el 3 sí tiene siguiente, el nodo del 9, así que se escribe su campo anterior y ultimo no se toca.",
      ninguna: "No son las mismas: con x->anterior igual a NULL el primer if toma la otra rama, la que escribe cabeza en vez del siguiente de un vecino."
    };
    document.querySelectorAll("#opciones-primerif button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-primerif");
        var m = MENSAJES_PRIMERIF[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: el primer if. Con x->anterior igual a NULL no hay vecino cuyo campo siguiente reescribir, y lo que apunta al nodo que se va es cabeza. El segundo if hace lo mismo que antes: escribe el anterior del 9.";
          logradas.primerif = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });

    var MENSAJES_SIMPLE = {
      "2": null,
      "0": "El puntero alcanza para leer el dato y para liberar la memoria, no para sacar el nodo de la cadena: hay que reescribir el campo siguiente del nodo anterior, y el nodo no sabe quién es.",
      "1": "Visitar solo la cabeza no alcanza: el siguiente del 3 es el 9, no el nodo que se busca. Hay que seguir hasta encontrar al que apunta al 1.",
      "4": "El recorrido para cuando aparece el nodo cuyo siguiente es x: eso ocurre en el 9, el segundo. Los cuatro nodos se visitan solo si el que se borra no está en la lista."
    };
    document.querySelectorAll("#opciones-simple button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-simple");
        var m = MENSAJES_SIMPLE[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: " + EJERCICIO.visitadosSimple(EJERCICIO.lista, 1) +
            ", el 3 y el 9. Se camina desde la cabeza hasta dar con el nodo cuyo campo siguiente apunta al que se borra. En el peor caso, borrar el último, se visita toda la lista: Θ(n) para un empalme que en sí es Θ(1).";
          logradas.simple = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}
