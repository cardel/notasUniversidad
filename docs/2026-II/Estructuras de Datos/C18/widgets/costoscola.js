/* Ejercicio interactivo: lo que cobra cada cola (clase 18). */
var EJERCICIO = (function () {
  var N = 40;

  /* La implementacion que conviene a cada perfil de uso. */
  var PERFILES = {
    maximo: "circular",
    sintecho: "conultimo",
    propuesta: "encolarcamina"
  };

  /* Enlazada simple: agregar recorre hasta el ultimo nodo. */
  function tocadosSinUltimo(n) {
    var tocados = 0;
    var nodos = 0;
    var k = 0;
    while (k < n) {
      if (nodos > 0) {
        var actual = 1;
        while (actual < nodos) {
          actual = actual + 1;
          tocados = tocados + 1;
        }
      }
      nodos = nodos + 1;
      k = k + 1;
    }
    return tocados;
  }

  /* Con puntero al ultimo: los dos extremos se tocan sin recorrer nada. */
  function tocadosConUltimo(n) {
    var tocados = 0;
    var k = 0;
    while (k < n) {
      k = k + 1;
    }
    return tocados;
  }

  return { n: N, perfiles: PERFILES,
           tocadosSinUltimo: tocadosSinUltimo,
           tocadosConUltimo: tocadosConUltimo };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var logradas = { maximo: false, sintecho: false, propuesta: false, tocados: false };
    function revisar() {
      if (logradas.maximo && logradas.sintecho && logradas.propuesta && logradas.tocados) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }
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

    conectar("opciones-maximo", "maximo", {
      bien: "Correcto: el arreglo circular. Encolar escribe en (inicio + n) % CAPACIDAD y desencolar adelanta inicio, así que las dos son Θ(1) sin mover un elemento. Y cada medición guardada ocupa solo su dato: no paga el puntero siguiente que llevan las tres versiones de nodos. Con el máximo garantizado, el techo fijo no estorba.",
      listaarreglo: "También reserva las casillas de antemano y guarda solo el dato, pero desencolar saca de la posición 0 y eso corre todo lo demás: Θ(n). El residuo es lo que le ahorra el corrimiento al arreglo circular.",
      simple: "Paga un puntero por elemento, que es justo lo que hay que ahorrar, y además encolar camina hasta el final de la cadena: Θ(n).",
      conultimo: "Deja las dos operaciones en Θ(1), pero cada elemento carga su puntero siguiente y cada nodo se pide por separado. Cuando el máximo se conoce, el arreglo guarda los mismos datos con menos memoria."
    });

    conectar("opciones-sintecho", "sintecho", {
      bien: "Correcto: la lista con puntero al último. Encolar escribe ultimo->siguiente y mueve ultimo; desencolar mueve cabeza y libera el nodo. Las dos son Θ(1) y el número de peticiones lo limita la memoria disponible, no una constante escrita en el código.",
      circular: "CAPACIDAD se fija al compilar, así que hay que adivinar el pico: si se queda corta, el assert detiene el servidor en la petición que no cabe; si se pasa, el dispositivo reserva casillas que casi nunca se usan.",
      listaarreglo: "Arrastra el techo del arreglo y además desencolar corre todos los elementos. Con cientos de miles de peticiones, Θ(n) por llamada da un total cuadrático.",
      simple: "Sale barato por el frente, pero encolar arranca en la cabeza y recorre hasta el nodo cuyo siguiente es NULL: cada petición que llega recorre la cola entera."
    });

    conectar("opciones-propuesta", "propuesta", {
      bien: "Correcto. Lo que dice de desencolar es cierto: el frente es la cabeza y sacarla mueve un puntero. Lo que falta es el otro extremo, y una cola usa los dos: sin puntero al último, encolar recorre la cadena hasta el nodo cuyo siguiente es NULL. Encolando y desencolando 40 veces se tocan " + EJERCICIO.tocadosSinUltimo(EJERCICIO.n) + " nodos, contra " + EJERCICIO.tocadosConUltimo(EJERCICIO.n) + " de la versión que guarda el último.",
      sirve: "El nodo nuevo se cuelga del final, pero antes hay que llegar hasta allá: el while de agregar avanza mientras actual->siguiente no sea NULL, y eso recorre todos los nodos.",
      desencolarcaro: "Desencolar sí es Θ(1) aquí: el frente es la cabeza y sacarlo es moverla al siguiente. El extremo caro es el otro, el de entrada.",
      contador: "El contador dice cuántos elementos hay, no dónde está el último nodo. Deja tamano() y vacia() en Θ(1) y no cambia nada en encolar, que es la operación que recorre."
    });

    document.getElementById("btn-tocados").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-tocados");
      var esperado = EJERCICIO.tocadosConUltimo(EJERCICIO.n);
      var dado = parseInt(document.getElementById("pred-tocados").value, 10);
      if (dado === esperado) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + esperado +
          ". Encolar escribe dos punteros y desencolar otro, siempre los de los extremos. Ningún elemento intermedio se corre ni se visita, y por eso el total no depende de n: con 40 o con 400 000 sigue siendo " + esperado + ".";
        logradas.tocados = true; revisar();
      } else if (dado === EJERCICIO.tocadosSinUltimo(EJERCICIO.n)) {
        ver.className = "veredicto mal";
        ver.textContent = "Esos " + EJERCICIO.tocadosSinUltimo(EJERCICIO.n) + " son los de la enlazada simple, que camina hasta el final en cada encolar. La que guarda el último llega ahí por el puntero.";
      } else if (dado === EJERCICIO.n || dado === 2 * EJERCICIO.n) {
        ver.className = "veredicto mal";
        ver.textContent = "Las escrituras de puntero de los extremos no tocan elementos: lo que se cuenta es cuántos elementos se corren o cuántos nodos se visitan de paso.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Pregúntese cuántos nodos visita un encolar de esta versión y cuántos elementos corre un desencolar.";
      }
    });
  })();
}
