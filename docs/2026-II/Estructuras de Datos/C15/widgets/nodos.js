/* Ejercicio interactivo: un dato y una direccion (clase 15). */
var EJERCICIO = (function () {
  var DATOS = [4, 1, 6, 8];

  /* Cuatro nodos enlazados a mano: el ultimo apunta a NULL. */
  function cadena(datos) {
    var nodos = datos.map(function (d) { return { dato: d, siguiente: null, libre: false }; });
    var i = 0;
    while (i < nodos.length - 1) {
      nodos[i].siguiente = nodos[i + 1];
      i = i + 1;
    }
    return nodos;
  }

  /* Recorrido con la condicion actual->siguiente != NULL. */
  function recorridoHastaElPenultimo(datos) {
    var nodos = cadena(datos);
    var salida = [];
    var actual = nodos.length > 0 ? nodos[0] : null;
    while (actual !== null && actual.siguiente !== null) {
      salida.push(actual.dato);
      actual = actual.siguiente;
    }
    return salida;
  }

  /* Recorrido con la condicion actual != NULL: el de la sesion. */
  function recorridoCompleto(datos) {
    var nodos = cadena(datos);
    var salida = [];
    var actual = nodos.length > 0 ? nodos[0] : null;
    while (actual !== null) {
      salida.push(actual.dato);
      actual = actual.siguiente;
    }
    return salida;
  }

  /* Version A: se guarda la direccion del siguiente antes del delete. */
  function liberarConGuardia(datos) {
    var nodos = cadena(datos);
    var liberados = 0;
    var lecturasDeLiberado = 0;
    var actual = nodos.length > 0 ? nodos[0] : null;
    while (actual !== null) {
      var muerto = actual;
      actual = actual.siguiente;
      muerto.libre = true;
      liberados = liberados + 1;
    }
    return { liberados: liberados, lecturasDeLiberado: lecturasDeLiberado,
             sinLiberar: nodos.filter(function (x) { return !x.libre; }).length };
  }

  /* Version B: se libera y despues se lee el campo siguiente del nodo muerto. */
  function liberarSinGuardia(datos) {
    var nodos = cadena(datos);
    var liberados = 0;
    var lecturasDeLiberado = 0;
    var actual = nodos.length > 0 ? nodos[0] : null;
    while (actual !== null && lecturasDeLiberado === 0) {
      actual.libre = true;
      liberados = liberados + 1;
      lecturasDeLiberado = lecturasDeLiberado + 1;
      actual = actual.siguiente;
    }
    return { liberados: liberados, lecturasDeLiberado: lecturasDeLiberado,
             sinLiberar: nodos.filter(function (x) { return !x.libre; }).length };
  }

  return { datos: DATOS, cadena: cadena,
           recorridoHastaElPenultimo: recorridoHastaElPenultimo,
           recorridoCompleto: recorridoCompleto,
           liberarConGuardia: liberarConGuardia,
           liberarSinGuardia: liberarSinGuardia };
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
    function pintarCadena(id, datos) {
      var caja = document.getElementById(id);
      caja.innerHTML = "";
      datos.forEach(function (d, i) {
        var f = document.createElement("span");
        f.className = "ficha";
        f.textContent = d;
        caja.appendChild(f);
        var fl = document.createElement("span");
        fl.className = "flecha";
        fl.textContent = "→";
        caja.appendChild(fl);
        if (i === datos.length - 1) {
          var nulo = document.createElement("span");
          nulo.className = "flecha";
          nulo.textContent = "NULL";
          caja.appendChild(nulo);
        }
      });
    }
    var logradas = { salida: false, liberar: false };
    function revisar() {
      if (logradas.salida && logradas.liberar) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    pintarCodigo("codigo-cadena", [
      ["Nodo *a = new Nodo;  Nodo *b = new Nodo;", ""],
      ["Nodo *c = new Nodo;  Nodo *d = new Nodo;", ""],
      ["a->dato = 4;  b->dato = 1;", "bloque-1"],
      ["c->dato = 6;  d->dato = 8;", "bloque-1"],
      ["a->siguiente = b;  b->siguiente = c;", "bloque-2"],
      ["c->siguiente = d;  d->siguiente = NULL;", "bloque-2"]
    ]);
    pintarCadena("cadena-nodos", EJERCICIO.datos);
    pintarCodigo("codigo-recorrido", [
      ["Nodo *actual = a;", ""],
      ["while (actual->siguiente != NULL) {", "bloque-1"],
      ["  std::cout << actual->dato << \" \";", "bloque-2"],
      ["  actual = actual->siguiente;", "bloque-3"],
      ["}", ""]
    ]);

    var MENSAJES_SALIDA = {
      tres: null,
      cuatro: "Esa es la salida con la condición actual != NULL, la del recorrido de la sesión. Aquí la condición mira el campo siguiente: cuando actual es el nodo del 8, actual->siguiente ya es NULL y el ciclo no entra.",
      sinprimero: "El cuerpo imprime primero y avanza después, así que el primer dato sí sale. Empiece la traza con actual = a y actual->dato = 4.",
      basura: "El ciclo no llega a pasar de NULL: se detiene antes, en el nodo del 8. La condición se evalúa sobre el nodo actual, que siempre es un nodo válido de la cadena."
    };
    document.querySelectorAll("#opciones-salida button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-salida");
        var m = MENSAJES_SALIDA[boton.dataset.op];
        if (m === null) {
          var r = EJERCICIO.recorridoHastaElPenultimo(EJERCICIO.datos);
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: imprime " + r.join(" ") + ". La condición pregunta por el campo siguiente del nodo actual, así que el ciclo termina cuando actual es el último: el 8 nunca se imprime. Con actual != NULL saldrían los cuatro.";
          logradas.salida = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });

    pintarCodigo("codigo-libre-a", [
      ["// version A", ""],
      ["actual = a;", ""],
      ["while (actual != NULL) {", "bloque-1"],
      ["  Nodo *muerto = actual;", "bloque-2"],
      ["  actual = actual->siguiente;", "bloque-2"],
      ["  delete muerto;", "bloque-3"],
      ["}", ""]
    ]);
    pintarCodigo("codigo-libre-b", [
      ["// version B", ""],
      ["actual = a;", ""],
      ["while (actual != NULL) {", "bloque-1"],
      ["  delete actual;", "bloque-3"],
      ["  actual = actual->siguiente;", "bloque-2"],
      ["}", ""]
    ]);
    var MENSAJES_LIBERAR = {
      b: null,
      a: "La A avanza antes de liberar: cuando llama a delete, la dirección del siguiente ya está guardada en actual y el nodo muerto no se vuelve a tocar. Libera los cuatro nodos.",
      ninguna: "Después de delete la memoria del nodo vuelve al sistema: leer actual->siguiente ahí es leer lo que ya no es del programa, y lo que devuelva no es una dirección de la cadena."
    };
    document.querySelectorAll("#opciones-liberar button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-liberar");
        var m = MENSAJES_LIBERAR[boton.dataset.op];
        if (m === null) {
          var a = EJERCICIO.liberarConGuardia(EJERCICIO.datos);
          var b = EJERCICIO.liberarSinGuardia(EJERCICIO.datos);
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: la B. El delete devuelve el nodo al sistema y la línea siguiente lee un campo de ese nodo para saber a dónde ir. La A libera " + a.liberados + " nodos; la B alcanza a liberar " + b.liberados + " y ya no tiene cómo llegar a los otros " + b.sinLiberar + ".";
          logradas.liberar = true; revisar();
          var nota = document.getElementById("nota-liberar");
          nota.style.display = "block";
          nota.textContent = "El orden es el mismo del destructor: se guarda la cabeza, se avanza y solo entonces se libera.";
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}
