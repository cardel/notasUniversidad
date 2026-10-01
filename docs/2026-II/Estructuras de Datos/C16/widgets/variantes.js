/* Ejercicio interactivo: lo que cobra cada implementacion de la lista (clase 16). */
var EJERCICIO = (function () {
  var DATOS = [4, 7, 2];
  var NUEVO = 5;

  /* La implementacion que conviene a cada perfil de uso. */
  var PERFILES = {
    borrar: "doble",
    rotar: "circular",
    final: "corto",
    frente: "simple"
  };

  function construir(variante, datos) {
    var nodos = datos.map(function (d) {
      return { dato: d, anterior: null, siguiente: null };
    });
    var i = 0;
    while (i < nodos.length) {
      if (variante === "simple") {
        nodos[i].siguiente = i < nodos.length - 1 ? nodos[i + 1] : null;
      } else if (variante === "doble") {
        nodos[i].siguiente = i < nodos.length - 1 ? nodos[i + 1] : null;
        nodos[i].anterior = i > 0 ? nodos[i - 1] : null;
      } else {
        nodos[i].siguiente = nodos[(i + 1) % nodos.length];
        nodos[i].anterior = nodos[(i - 1 + nodos.length) % nodos.length];
      }
      i = i + 1;
    }
    return { cabeza: nodos[0], ultimo: nodos[nodos.length - 1], n: nodos.length };
  }

  function cadena(variante, lista) {
    var salida = [];
    var actual = lista.cabeza;
    var i = 0;
    while (actual !== null && i < lista.n) {
      salida.push(actual.dato);
      actual = actual.siguiente;
      i = i + 1;
    }
    return salida;
  }

  /* insertar(0, e) sobre una lista no vacia, anotando cada asignacion de puntero. */
  function insertarAlFrente(variante) {
    var lista = construir(variante, DATOS);
    var nuevo = { dato: NUEVO, anterior: null, siguiente: null };
    var lineas = [];
    if (variante === "simple") {
      nuevo.siguiente = lista.cabeza;
      lineas.push("nuevo->siguiente = cabeza;");
      lista.cabeza = nuevo;
      lineas.push("cabeza = nuevo;");
    } else if (variante === "doble") {
      nuevo.anterior = null;
      lineas.push("nuevo->anterior = NULL;");
      nuevo.siguiente = lista.cabeza;
      lineas.push("nuevo->siguiente = cabeza;");
      lista.cabeza.anterior = nuevo;
      lineas.push("cabeza->anterior = nuevo;");
      lista.cabeza = nuevo;
      lineas.push("cabeza = nuevo;");
    } else {
      var x = lista.cabeza;
      nuevo.siguiente = x;
      lineas.push("nuevo->siguiente = x;");
      nuevo.anterior = x.anterior;
      lineas.push("nuevo->anterior = x->anterior;");
      x.anterior.siguiente = nuevo;
      lineas.push("x->anterior->siguiente = nuevo;");
      x.anterior = nuevo;
      lineas.push("x->anterior = nuevo;");
      lista.cabeza = nuevo;
      lineas.push("cabeza = nuevo;");
    }
    lista.n = lista.n + 1;
    return {
      variante: variante,
      escrituras: lineas.length,
      lineas: lineas,
      cadena: cadena(variante, lista)
    };
  }

  function escrituras() {
    return {
      simple: insertarAlFrente("simple"),
      doble: insertarAlFrente("doble"),
      circular: insertarAlFrente("circular"),
      corto: insertarAlFrente("corto")
    };
  }

  return { datos: DATOS, nuevo: NUEVO, perfiles: PERFILES,
           insertarAlFrente: insertarAlFrente, escrituras: escrituras };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var logradas = { borrar: false, rotar: false, final: false, frente: false,
                     escrituras: false };
    function revisar() {
      if (logradas.borrar && logradas.rotar && logradas.final &&
          logradas.frente && logradas.escrituras) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }
    var E = EJERCICIO.escrituras();
    var NOMBRES = { simple: "la simple", doble: "la doble",
                    circular: "la circular", corto: "la circular por el lado corto" };

    function conectar(grupo, clave, mensajes) {
      document.querySelectorAll("#" + grupo + " button").forEach(function (boton) {
        boton.addEventListener("click", function () {
          var ver = document.getElementById("veredicto-" + clave);
          var op = boton.dataset.op;
          if (op === EJERCICIO.perfiles[clave]) {
            ver.className = "veredicto bien";
            ver.textContent = mensajes.bien;
            logradas[clave] = true; revisar();
          } else {
            ver.className = "veredicto mal";
            ver.textContent = mensajes[op];
          }
        });
      });
    }

    conectar("opciones-borrar", "borrar", {
      bien: "Correcto: la doble. El campo anterior deja sacar el nodo de la cadena sin buscar a nadie, así que desenlazar son dos escrituras y ningún paso: Θ(1). De paso, el último se mantiene sin trabajo extra porque los enlaces van en los dos sentidos.",
      simple: "Con el puntero en la mano todavía falta el nodo anterior, que es el que hay que reescribir, y el nodo no sabe quién es: hay que buscarlo desde la cabeza. Θ(n) por cada borrado, aunque el empalme en sí sea Θ(1).",
      circular: "La circular hereda el campo anterior y desenlaza igual de rápido, pero lo que compra cerrar el círculo es borrar los casos de los extremos, y este programa no inserta al frente ni al final. La que paga justo lo que se usa es la doble.",
      corto: "El lado corto solo cambia nodoEn, que es el recorrido por posición. Este programa no pide posiciones: ya tiene los punteros a los nodos."
    });

    conectar("opciones-rotar", "rotar", {
      bien: "Correcto: la circular. Mover el frente es cabeza = cabeza->siguiente: una escritura, y ningún nodo cambia de sitio porque en un círculo todos ya están en su lugar relativo.",
      simple: "Hay que recorrer hasta el último para engancharle el viejo primero y después cerrar el nuevo final con NULL: Θ(n) en cada vuelta.",
      doble: "Con el puntero al último también es Θ(1), pero los extremos siguen teniendo NULL: hay que desenganchar el primero, cerrar el nuevo frente, enganchar el viejo al final y mover ultimo. Seis escrituras contra una.",
      corto: "El lado corto solo cambia nodoEn, y mover el frente un lugar no lo llama: es cabeza = cabeza->siguiente, igual que en la circular. El contador no agrega nada en este perfil."
    });

    conectar("opciones-final", "final", {
      bien: "Correcto: la circular por el lado corto. nodoEn compara p con n / 2 y escoge el sentido: una posición a k lugares del final sale en k pasos hacia atrás en vez de n - k hacia adelante. El peor caso baja de n - 1 pasos a ⌈n/2⌉.",
      simple: "Sin el campo anterior solo se camina hacia adelante, y cada consulta cerca del final recorre casi toda la lista.",
      doble: "Tiene los enlaces en los dos sentidos, pero su nodoEn arranca en la cabeza y avanza con siguiente: sigue siendo Θ(p). Para usar el enlace hacia atrás hay que decidir el lado, y eso exige saber cuántos elementos hay.",
      circular: "Cerrar el círculo quita los extremos, no los pasos: su nodoEn camina siempre hacia adelante desde la cabeza. Falta la versión que compara p con n / 2."
    });

    conectar("opciones-frente", "frente", {
      bien: "Correcto: la simple. Las dos operaciones que el programa usa, insertar al frente y recorrer una vez, cuestan Θ(1) y Θ(n) en las cuatro. La simple hace lo mismo con un puntero por nodo en vez de dos y con " + E.simple.escrituras + " asignaciones por inserción.",
      doble: "El campo anterior cuesta un puntero por nodo y " + (E.doble.escrituras - E.simple.escrituras) + " asignaciones más por inserción, y este programa nunca recorre hacia atrás ni borra nodos que ya tiene.",
      circular: "El círculo cuesta el puntero por nodo y " + E.circular.escrituras + " asignaciones por inserción al frente; a cambio da el acceso al último y el recorrido hacia atrás, que aquí no se usan.",
      corto: "El contador y el lado corto sirven para llegar a una posición, y este programa no consulta ninguna: inserta al frente y recorre una vez."
    });

    function pintarDetalle() {
      var cuerpo = document.getElementById("tabla-escrituras");
      cuerpo.innerHTML = "";
      ["simple", "doble", "circular", "corto"].forEach(function (clave) {
        var fila = document.createElement("tr");
        [NOMBRES[clave], E[clave].lineas.join("  "), String(E[clave].escrituras)]
          .forEach(function (texto) {
            var celda = document.createElement("td");
            celda.textContent = texto;
            fila.appendChild(celda);
          });
        cuerpo.appendChild(fila);
      });
      document.getElementById("detalle-escrituras").style.display = "block";
    }

    document.getElementById("btn-escrituras").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-escrituras");
      var dadas = {
        simple: parseInt(document.getElementById("pred-simple").value, 10),
        doble: parseInt(document.getElementById("pred-doble").value, 10),
        circular: parseInt(document.getElementById("pred-circular").value, 10),
        corto: parseInt(document.getElementById("pred-corto").value, 10)
      };
      var todas = ["simple", "doble", "circular", "corto"].every(function (k) {
        return dadas[k] === E[k].escrituras;
      });
      if (todas) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + E.simple.escrituras + ", " + E.doble.escrituras +
          ", " + E.circular.escrituras + " y " + E.corto.escrituras +
          ". Las cuatro son Θ(1), porque ninguna depende del tamaño, y aun así la última " +
          "escribe más del doble que la primera: ese es el precio del campo anterior y del círculo. " +
          "insertar es el mismo código en las dos circulares, y con p = 0 el lado corto no llega a caminar.";
        logradas.escrituras = true; revisar();
        pintarDetalle();
      } else if (dadas.doble === 3) {
        ver.className = "veredicto mal";
        ver.textContent = "En la rama p == 0 de la doble hay cuatro asignaciones y las cuatro se ejecutan: dejar nuevo->anterior en NULL también escribe un puntero.";
      } else if (dadas.circular === 4 || dadas.corto === 4) {
        ver.className = "veredicto mal";
        ver.textContent = "Las cuatro líneas del empalme son las que entran el nodo a la cadena, y después se ejecuta el if de p == 0, que mueve la cabeza: una más.";
      } else if (dadas.circular === dadas.simple) {
        ver.className = "veredicto mal";
        ver.textContent = "No pueden ser iguales: la simple deja un solo enlace por nodo y el círculo mantiene dos, y además no tiene NULL que marque el principio.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Escriba la rama que toma cada implementación con p = 0 sobre una lista no vacía y cuente las asignaciones de puntero, incluida la de cabeza.";
      }
    });
  })();
}
