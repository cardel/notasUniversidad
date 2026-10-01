/* Ejercicio interactivo: insertar y eliminar en la lista circular doble (clase 16). */
var EJERCICIO = (function () {
  var INICIAL = [4, 7, 2];
  var LIMITE = 9;
  var LINEAS = [
    "Nodo *nuevo = new Nodo;",
    "nuevo->dato = e;",
    "Nodo *x = cabeza;",
    "if (p < n) {",
    "  x = nodoEn(p);",
    "}",
    "nuevo->siguiente = x;",
    "nuevo->anterior = x->anterior;",
    "x->anterior->siguiente = nuevo;",
    "x->anterior = nuevo;",
    "if (p == 0) {",
    "  cabeza = nuevo;",
    "}",
    "n = n + 1;"
  ];

  /* Cadena cerrada: el ultimo apunta al primero y el primero al ultimo. */
  function construir(datos) {
    var nodos = datos.map(function (d) {
      return { dato: d, anterior: null, siguiente: null };
    });
    var i = 0;
    while (i < nodos.length) {
      nodos[i].siguiente = nodos[(i + 1) % nodos.length];
      nodos[i].anterior = nodos[(i - 1 + nodos.length) % nodos.length];
      i = i + 1;
    }
    return { cabeza: nodos[0], n: nodos.length };
  }

  /* Recorre hacia adelante hasta volver a la cabeza, con tope. */
  function cadenaCerrada(cabeza, limite) {
    var salida = [];
    if (cabeza === null) { return salida; }
    var actual = cabeza;
    var vueltas = 0;
    var cerro = false;
    while (!cerro && vueltas < limite) {
      salida.push(actual.dato);
      actual = actual.siguiente;
      vueltas = vueltas + 1;
      cerro = actual === cabeza;
    }
    return salida;
  }

  function nodoEn(lista, p) {
    var actual = lista.cabeza;
    var i = 0;
    while (i < p) {
      actual = actual.siguiente;
      i = i + 1;
    }
    return actual;
  }

  function rotulo(nodo) {
    if (nodo === null) { return "NULL"; }
    if (nodo.dato === undefined) { return "sin definir"; }
    return "nodo del " + nodo.dato;
  }

  /* insertar(p, e) con n > 0: las cuatro lineas del empalme y el if del final. */
  function insertar(lista, p, e) {
    var pasos = [];
    var escrituras = 0;
    var nuevo = null;
    var x = null;
    function foto(linea, comentario) {
      pasos.push({
        linea: linea,
        texto: LINEAS[linea].trim(),
        comentario: comentario,
        escrituras: escrituras,
        cabeza: rotulo(lista.cabeza),
        n: lista.n,
        x: x === null ? "sin definir" : rotulo(x),
        nuevoSiguiente: nuevo === null ? "sin reservar" : rotulo(nuevo.siguiente),
        nuevoAnterior: nuevo === null ? "sin reservar" : rotulo(nuevo.anterior),
        cabezaAnterior: rotulo(lista.cabeza.anterior),
        cadena: cadenaCerrada(lista.cabeza, LIMITE)
      });
    }
    nuevo = { dato: undefined, anterior: null, siguiente: null };
    foto(0, "se reserva el nodo, todavía sin dato");
    nuevo.dato = e;
    foto(1, "el nodo nuevo guarda el " + e);
    x = lista.cabeza;
    foto(2, "x arranca en la cabeza");
    if (p < lista.n) {
      foto(3, "p = " + p + " y n = " + lista.n + ": la condición es cierta");
      x = nodoEn(lista, p);
      foto(4, "x queda en la posición " + p + ", tras " + p + (p === 1 ? " paso" : " pasos"));
    } else {
      foto(3, "p = " + p + " y n = " + lista.n + ": la condición es falsa, x se queda en la cabeza");
    }
    nuevo.siguiente = x;
    escrituras = escrituras + 1;
    foto(6, "el nodo nuevo apunta hacia adelante al " + x.dato);
    nuevo.anterior = x.anterior;
    escrituras = escrituras + 1;
    foto(7, "y hacia atrás al " + x.anterior.dato + ", que era el que precedía a x");
    x.anterior.siguiente = nuevo;
    escrituras = escrituras + 1;
    foto(8, "el " + x.anterior.dato + " pasa a apuntar al " + e + ": aquí entra a la cadena");
    x.anterior = nuevo;
    escrituras = escrituras + 1;
    foto(9, "y el " + x.dato + " lo reconoce hacia atrás");
    if (p === 0) {
      foto(10, "p = 0: la condición es cierta");
      lista.cabeza = nuevo;
      escrituras = escrituras + 1;
      foto(11, "la cabeza pasa a ser el " + e);
    } else {
      foto(10, "p = " + p + ": la condición es falsa, la cabeza no se mueve");
    }
    lista.n = lista.n + 1;
    foto(13, "n queda en " + lista.n);
    return {
      pasos: pasos,
      escrituras: escrituras,
      cadena: cadenaCerrada(lista.cabeza, LIMITE),
      cabeza: lista.cabeza.dato,
      n: lista.n
    };
  }

  function eliminar(lista, p) {
    var muerto = nodoEn(lista, p);
    var caso = "";
    if (lista.n === 1) {
      lista.cabeza = null;
      caso = "el nodo era el único: no hay a quién reenlazar";
    } else {
      muerto.anterior.siguiente = muerto.siguiente;
      muerto.siguiente.anterior = muerto.anterior;
      caso = "los dos vecinos del " + muerto.dato + " quedan enlazados entre sí";
      if (muerto === lista.cabeza) {
        lista.cabeza = muerto.siguiente;
        caso = caso + " y la cabeza pasa al " + lista.cabeza.dato;
      }
    }
    lista.n = lista.n - 1;
    return { borrado: muerto.dato, caso: caso };
  }

  /* La escena completa: las dos inserciones y despues vaciar con eliminar(0). */
  function correr() {
    var lista = construir(INICIAL);
    var a = insertar(lista, 3, 8);
    var b = insertar(lista, 0, 5);
    var vaciado = [];
    var k = 1;
    while (lista.n > 0) {
      var r = eliminar(lista, 0);
      vaciado.push({
        llamado: k,
        borrado: r.borrado,
        caso: r.caso,
        cadena: cadenaCerrada(lista.cabeza, LIMITE),
        cabeza: lista.cabeza === null ? "NULL" : String(lista.cabeza.dato),
        soloUno: lista.n === 1,
        seApuntaASiMismo: lista.n === 1 &&
          lista.cabeza.siguiente === lista.cabeza &&
          lista.cabeza.anterior === lista.cabeza,
        n: lista.n
      });
      k = k + 1;
    }
    return { a: a, b: b, vaciado: vaciado };
  }

  return { inicial: INICIAL, lineas: LINEAS, correr: correr };
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
    var logradas = { a: false, b: false, unico: false, vacia: false };
    function revisar() {
      if (logradas.a && logradas.b && logradas.unico && logradas.vacia) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var R = EJERCICIO.correr();
    var LINEAS_VISTA = pintarCodigo("codigo-insertar", EJERCICIO.lineas);

    document.getElementById("btn-a").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-a");
      var c = leerLista(document.getElementById("pred-cadena-a").value);
      var h = parseInt(document.getElementById("pred-cabeza-a").value, 10);
      if (iguales(c, R.a.cadena) && h === R.a.cabeza) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + R.a.cadena.join(" ") + " y la cabeza sigue en el " +
          R.a.cabeza + ". Con p = n la condición p < n es falsa, así que x se queda en la cabeza " +
          "y el 8 se empalma justo antes de ella: en un círculo, antes del primero es después del último.";
        logradas.a = true; revisar();
      } else if (iguales(c, [8, 4, 7, 2])) {
        ver.className = "veredicto mal";
        ver.textContent = "El 8 queda antes de la cabeza en la cadena cerrada, pero la cabeza no se mueve: el if que la cambia solo se ejecuta con p = 0. Leyendo desde el 4, el 8 aparece al final.";
      } else if (iguales(c, [4, 7, 8, 2])) {
        ver.className = "veredicto mal";
        ver.textContent = "La posición 3 no es la del medio: con n = 3 las posiciones ocupadas son 0, 1 y 2, y la 3 es el lugar que queda al final.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Siga las cuatro líneas del empalme con x igual a la cabeza y después lea la cadena desde cabeza. La traza de abajo ejecuta este caso.";
      }
    });

    document.getElementById("btn-b").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-b");
      var c = leerLista(document.getElementById("pred-cadena-b").value);
      var h = parseInt(document.getElementById("pred-cabeza-b").value, 10);
      if (iguales(c, R.b.cadena) && h === R.b.cabeza) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + R.b.cadena.join(" ") + " y la cabeza pasa al " +
          R.b.cabeza + ". El empalme es el mismo de antes, con x en la cabeza; lo que cambia es que " +
          "con p = 0 se ejecuta cabeza = nuevo. Son " + R.b.escrituras +
          " escrituras de puntero contra las " + R.a.escrituras + " del caso anterior.";
        logradas.b = true; revisar();
      } else if (iguales(c, [4, 7, 2, 8, 5]) || iguales(c, [4, 5, 7, 2, 8])) {
        ver.className = "veredicto mal";
        ver.textContent = "El 5 entra antes del nodo de la posición 0, que es la cabeza, y después la cabeza pasa a ser el 5: la cadena se lee empezando por él.";
      } else if (iguales(c, [5, 4, 7, 2, 8])) {
        ver.className = "veredicto mal";
        ver.textContent = "La cadena está bien. La cabeza no se queda en el 4: la última línea del empalme la mueve al nodo nuevo.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Parta de 4 7 2 8 con la cabeza en el 4 y ejecute las mismas cuatro líneas con x igual a la cabeza, más el if de p = 0.";
      }
    });

    var vista = { i: 0, cual: "a" };
    function caso() { return vista.cual === "a" ? R.a : R.b; }
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
      var C = caso();
      var chips = document.getElementById("chips-traza");
      var caja = document.getElementById("cadena-traza");
      chips.innerHTML = "";
      caja.innerHTML = "";
      var i = vista.i;
      var estado = i === 0 ? C.pasos[0] : C.pasos[i - 1];
      if (i === 0) {
        estado = {
          escrituras: 0, cabeza: C.pasos[0].cabeza, n: C.pasos[0].n, x: "sin definir",
          nuevoSiguiente: "sin reservar", nuevoAnterior: "sin reservar",
          cabezaAnterior: C.pasos[0].cabezaAnterior, cadena: C.pasos[0].cadena,
          comentario: "antes de la primera línea", linea: -1, texto: ""
        };
      }
      chip(chips, "cabeza", estado.cabeza, false);
      chip(chips, "n", estado.n, false);
      chip(chips, "x", estado.x, false);
      chip(chips, "nuevo->siguiente", estado.nuevoSiguiente, true);
      chip(chips, "nuevo->anterior", estado.nuevoAnterior, true);
      chip(chips, "cabeza->anterior", estado.cabezaAnterior, false);
      chip(chips, "escrituras", estado.escrituras, true);
      estado.cadena.forEach(function (d, k) {
        var f = document.createElement("span");
        f.className = "ficha";
        f.textContent = d;
        caja.appendChild(f);
        var fl = document.createElement("span");
        fl.className = "flecha";
        fl.textContent = k === estado.cadena.length - 1 ? "→ vuelve al " + estado.cadena[0] : "→";
        caja.appendChild(fl);
      });
      LINEAS_VISTA.forEach(function (linea, k) {
        linea.className = "linea" + (k === estado.linea ? " actual" : "");
      });
      document.getElementById("progreso-traza").textContent = i === 0
        ? "sin ejecutar ninguna línea"
        : "paso " + i + " de " + C.pasos.length + ": " + estado.comentario;
      document.getElementById("btn-paso").disabled = i === C.pasos.length;
    }
    document.getElementById("btn-paso").addEventListener("click", function () {
      if (vista.i < caso().pasos.length) { vista.i = vista.i + 1; pintarVista(); }
    });
    document.getElementById("btn-reinicio").addEventListener("click", function () {
      vista.i = 0; pintarVista();
    });
    document.getElementById("btn-caso-a").addEventListener("click", function () {
      vista.cual = "a"; vista.i = 0; pintarVista();
    });
    document.getElementById("btn-caso-b").addEventListener("click", function () {
      vista.cual = "b"; vista.i = 0; pintarVista();
    });
    pintarVista();

    var vaciar = { i: 0 };
    function pintarVaciado() {
      var cuerpo = document.getElementById("tabla-vaciar");
      cuerpo.innerHTML = "";
      R.vaciado.forEach(function (v, k) {
        var fila = document.createElement("tr");
        var visible = k < vaciar.i;
        ["eliminar(0) #" + v.llamado,
         visible ? (v.cadena.length === 0 ? "vacía" : v.cadena.join(" ")) : "?",
         visible ? v.cabeza : "?",
         visible ? String(v.n) : "?"].forEach(function (texto, c) {
          var celda = document.createElement("td");
          if (!visible && c > 0) { celda.className = "pend"; }
          celda.textContent = texto;
          fila.appendChild(celda);
        });
        cuerpo.appendChild(fila);
      });
      document.getElementById("btn-vaciar").disabled = vaciar.i === R.vaciado.length;
    }
    document.getElementById("btn-vaciar").addEventListener("click", function () {
      if (vaciar.i < R.vaciado.length) { vaciar.i = vaciar.i + 1; pintarVaciado(); }
    });
    document.getElementById("btn-reinicio-vaciar").addEventListener("click", function () {
      vaciar.i = 0; pintarVaciado();
    });
    pintarVaciado();

    var unico = R.vaciado.filter(function (v) { return v.soloUno; })[0];
    var MENSAJES_UNICO = {
      mismo: null,
      "null": "En esta implementación no hay NULL en ningún enlace mientras la lista tenga nodos: eso es justo lo que se compró al cerrar el círculo. El único NULL posible es cabeza con la lista vacía.",
      mezcla: "Los dos campos quedan iguales: la cadena de un solo nodo se cierra sobre él por los dos sentidos, hacia adelante y hacia atrás."
    };
    document.querySelectorAll("#opciones-unico button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-unico");
        var m = MENSAJES_UNICO[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: a él mismo. Queda el nodo del " + unico.cabeza +
            ", con n = 1, y es su propio siguiente y su propio anterior. Recorrer la lista da " +
            "vueltas sobre ese nodo, y por eso el recorrido se controla con n y no buscando NULL.";
          logradas.unico = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });

    var fin = R.vaciado[R.vaciado.length - 1];
    var MENSAJES_VACIA = {
      nulo: null,
      colgante: "Ese es el caso que el if de n == 1 existe para evitar: sin él, cabeza quedaría apuntando a memoria liberada y el primer recorrido siguiente leería basura.",
      ciclo: "cabeza es un puntero de la lista, no un nodo: no tiene campo siguiente que pueda apuntarse a sí mismo. Con la lista vacía no hay nodo al que señalar."
    };
    document.querySelectorAll("#opciones-vacia button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-vacia");
        var m = MENSAJES_VACIA[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: cabeza en " + fin.cabeza + " y n en " + fin.n +
            ". Con un solo nodo no hay vecinos que reenlazar, así que el código toma la rama de n == 1, " +
            "pone cabeza en NULL y libera el nodo. Es el único caso que la lista circular no pudo borrar.";
          logradas.vacia = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}
