/* Ejercicio interactivo: agregar sin recorrer (clase 15). */
var EJERCICIO = (function () {
  var LISTA = [2, 5, 1];
  var NUEVO = 7;

  function construir(datos) {
    var nodos = datos.map(function (d) { return { dato: d, siguiente: null, libre: false }; });
    var i = 0;
    while (i < nodos.length - 1) {
      nodos[i].siguiente = nodos[i + 1];
      i = i + 1;
    }
    return {
      cabeza: nodos.length > 0 ? nodos[0] : null,
      ultimo: nodos.length > 0 ? nodos[nodos.length - 1] : null,
      n: nodos.length,
      nodos: nodos
    };
  }

  function nodoEn(estado, p) {
    var actual = estado.cabeza;
    var i = 0;
    while (i < p) {
      actual = actual.siguiente;
      i = i + 1;
    }
    return actual;
  }

  /* agregar(e) sin puntero al ultimo: llama a insertar(n, e), que llama a
     nodoEn(n - 1) y camina hasta el final. Cuenta los nodos tocados. */
  function tocadosSinUltimo(datos) {
    var n = datos.length;
    var tocados = 0;
    if (n > 0) {
      tocados = 1;
      var i = 0;
      while (i < n - 1) {
        tocados = tocados + 1;
        i = i + 1;
      }
    }
    return tocados;
  }

  /* agregar(e) con puntero al ultimo: escribe ultimo->siguiente sin caminar. */
  function tocadosConUltimo() {
    return 0;
  }

  function agregar(estado, e) {
    var nuevo = { dato: e, siguiente: null, libre: false };
    if (estado.cabeza === null) {
      estado.cabeza = nuevo;
    } else {
      estado.ultimo.siguiente = nuevo;
    }
    estado.ultimo = nuevo;
    estado.n = estado.n + 1;
    estado.nodos.push(nuevo);
  }

  /* eliminar(p) de la version con ultimo, con sus dos casos nuevos. */
  function eliminar(estado, p) {
    var muerto;
    if (p === 0) {
      muerto = estado.cabeza;
      estado.cabeza = estado.cabeza.siguiente;
      if (estado.cabeza === null) {
        estado.ultimo = null;
      }
    } else {
      var anterior = nodoEn(estado, p - 1);
      muerto = anterior.siguiente;
      anterior.siguiente = muerto.siguiente;
      if (muerto === estado.ultimo) {
        estado.ultimo = anterior;
      }
    }
    muerto.libre = true;
    estado.n = estado.n - 1;
    return muerto.dato;
  }

  function foto(estado) {
    var salida = [];
    var actual = estado.cabeza;
    while (actual !== null) {
      salida.push(actual.dato);
      actual = actual.siguiente;
    }
    return {
      cadena: salida,
      cabeza: estado.cabeza === null ? "NULL" : String(estado.cabeza.dato),
      ultimo: estado.ultimo === null ? "NULL" : String(estado.ultimo.dato),
      ultimoLiberado: estado.ultimo !== null && estado.ultimo.libre,
      n: estado.n
    };
  }

  /* agregar(7) y despues eliminar del ultimo. */
  function agregarYBorrarElUltimo(datos, e) {
    var estado = construir(datos);
    agregar(estado, e);
    var borrado = eliminar(estado, estado.n - 1);
    var r = foto(estado);
    r.borrado = borrado;
    return r;
  }

  /* eliminar(0) hasta vaciar la lista. */
  function vaciarPorElFrente(datos) {
    var estado = construir(datos);
    var veces = 0;
    while (estado.n > 0) {
      eliminar(estado, 0);
      veces = veces + 1;
    }
    var r = foto(estado);
    r.veces = veces;
    return r;
  }

  return { lista: LISTA, nuevo: NUEVO,
           tocadosSinUltimo: tocadosSinUltimo, tocadosConUltimo: tocadosConUltimo,
           agregarYBorrarElUltimo: agregarYBorrarElUltimo,
           vaciarPorElFrente: vaciarPorElFrente };
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
    var logradas = { visitas: false, ultimo: false, vaciar: false };
    function revisar() {
      if (logradas.visitas && logradas.ultimo && logradas.vaciar) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    pintarCodigo("codigo-sin", [
      ["// sin puntero al ultimo", ""],
      ["void agregar(Elemento e) {", "bloque-1"],
      ["  insertar(n, e);       // llama a nodoEn(n - 1)", "bloque-2"],
      ["}", ""]
    ]);
    pintarCodigo("codigo-con", [
      ["// con puntero al ultimo", ""],
      ["void agregar(Elemento e) {", "bloque-1"],
      ["  Nodo *nuevo = new Nodo;", ""],
      ["  nuevo->dato = e;", ""],
      ["  nuevo->siguiente = NULL;", ""],
      ["  if (cabeza == NULL) {", "bloque-2"],
      ["    cabeza = nuevo;", "bloque-2"],
      ["  } else {", ""],
      ["    ultimo->siguiente = nuevo;", "bloque-3"],
      ["  }", ""],
      ["  ultimo = nuevo;", "bloque-3"],
      ["  n = n + 1;", ""],
      ["}", ""]
    ]);

    document.getElementById("btn-visitas").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-visitas");
      var esperadoSin = EJERCICIO.tocadosSinUltimo(EJERCICIO.lista);
      var esperadoCon = EJERCICIO.tocadosConUltimo();
      var sin = parseInt(document.getElementById("pred-sin").value, 10);
      var con = parseInt(document.getElementById("pred-con").value, 10);
      if (sin === esperadoSin && con === esperadoCon) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: 3 y 0. Sin el puntero al último, nodoEn(2) arranca en el nodo del 2 y avanza dos veces, así que pasa por los tres nodos; con mil elementos serían mil. Con ultimo guardado, la dirección del final ya está y agregar escribe dos punteros: Θ(1).";
        logradas.visitas = true; revisar();
      } else if (sin === esperadoSin) {
        ver.className = "veredicto mal";
        ver.textContent = "La primera está bien. La segunda versión no camina: ultimo->siguiente es la única escritura que necesita sobre la cadena vieja.";
      } else if (sin === 2) {
        ver.className = "veredicto mal";
        ver.textContent = "Cuente también el nodo donde arranca: nodoEn empieza en la cabeza y después avanza. Son dos avances y tres nodos tocados.";
      } else if (sin === 4) {
        ver.className = "veredicto mal";
        ver.textContent = "El nodo nuevo no está en la cadena vieja: la pregunta es por los nodos que hay que recorrer para llegar al final.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Siga nodoEn(n - 1) sobre los tres nodos y cuente por dónde pasa; después mire cuántos nodos toca la versión que ya sabe dónde termina la cadena.";
      }
    });

    var MENSAJES_ULTIMO = {
      anterior: null,
      colgante: "Ese es el error que el caso nuevo evita: el nodo del 7 se liberó, y ultimo apuntando ahí es un puntero colgante. El próximo agregar escribiría en memoria que ya no es del programa.",
      nulo: "La lista no quedó vacía: quedan tres elementos, y el último de ellos es el 1. ultimo pasa a NULL solo cuando se borra el único nodo que había."
    };
    document.querySelectorAll("#opciones-ultimo button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-ultimo");
        var m = MENSAJES_ULTIMO[boton.dataset.op];
        if (m === null) {
          var r = EJERCICIO.agregarYBorrarElUltimo(EJERCICIO.lista, EJERCICIO.nuevo);
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: la lista queda " + r.cadena.join(" → ") + ", cabeza en el " + r.cabeza + " y ultimo en el nodo del " + r.ultimo + ". eliminar compara el nodo que va a borrar con ultimo, y cuando son el mismo, ultimo pasa a ser anterior.";
          logradas.ultimo = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });

    var MENSAJES_VACIAR = {
      dosnulos: null,
      soloCabeza: "El nodo del 1 también se borró: los tres eliminar(0) sacan el 2, el 5 y el 1. Dejar ultimo ahí sería apuntar a un nodo liberado.",
      sintocar: "El caso p == 0 revisa si la cabeza quedó en NULL, y ahí pone ultimo en NULL: por eso el invariante de que ultimo es el último nodo cuando n > 0 se sostiene."
    };
    document.querySelectorAll("#opciones-vaciar button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-vaciar");
        var m = MENSAJES_VACIAR[boton.dataset.op];
        if (m === null) {
          var r = EJERCICIO.vaciarPorElFrente(EJERCICIO.lista);
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: cabeza en " + r.cabeza + " y ultimo en " + r.ultimo + " tras los " + r.veces + " borrados. En el tercero la cabeza queda en NULL, y esa es la señal de que la lista se vació: n vuelve a 0 y los dos punteros quedan en NULL.";
          logradas.vaciar = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}
