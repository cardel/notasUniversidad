/* Ejercicio interactivo: escoger el contenedor por las operaciones (clase 20). */
var EJERCICIO = (function () {
  var OPS = [
    { op: "vector", texto: "<code>vector</code>" },
    { op: "deque", texto: "<code>deque</code>" },
    { op: "list", texto: "<code>list</code>" },
    { op: "stack", texto: "<code>stack</code>" },
    { op: "queue", texto: "<code>queue</code>" }
  ];

  var PROGRAMAS = [
    { titulo: "La ventanilla con citas", correcta: "deque",
      html: "Una ventanilla atiende siempre a quien está adelante. Quien llega con cita entra de primero; quien llega sin cita, de último. Nadie sale por la mitad y nunca se pregunta quién va en el puesto i.",
      msgs: {
        vector: "Entrar de primero es insert(begin()): corre a todos los que esperan, Θ(n) por cada cita.",
        deque: "Correcto. push_front para las citas, push_back para los demás, front y pop_front para atender: todo O(1), y los datos van en bloques sin punteros por persona.",
        list: "También deja las tres operaciones en Θ(1), pero cada persona paga un nodo con dos punteros y una reserva. No se usa nada que solo la lista dé: ni iteradores guardados ni splice.",
        stack: "Una pila atiende al último que llegó. Aquí el que llega sin cita espera a todos los de adelante.",
        queue: "Casi: atiende por el frente y recibe por el final, pero no deja entrar a nadie por el frente, y las citas lo necesitan."
      } },
    { titulo: "El recorrido por niveles", correcta: "queue",
      html: "Un programa recorre las casillas de un laberinto desde la entrada. Cada casilla descubierta se anota para visitarla después, y siempre se visita la que lleva más tiempo anotada.",
      msgs: {
        vector: "Sacar la más vieja es erase(begin()), que corre todo lo anotado.",
        deque: "Sirve, con push_back y pop_front. Pero el programa solo usa el más viejo, y un contrato que solo dé eso dice al que lee el código lo que el programa hace.",
        list: "Sirve en Θ(1), con un nodo por casilla. No se inserta en medio ni se guardan iteradores: sobra.",
        stack: "La pila visita la última anotada: el recorrido se iría hasta el fondo de un pasillo antes de mirar los vecinos de la entrada. Ese es otro recorrido, el de profundidad.",
        queue: "Correcto. La más vieja sale primero: push al anotar, front y pop al visitar, todo O(1). Es el recorrido en anchura."
      } },
    { titulo: "Las etiquetas que abren y cierran", correcta: "stack",
      html: "Un verificador lee una página con etiquetas como <code>&lt;b&gt;</code> y <code>&lt;/b&gt;</code>. Cada etiqueta que cierra tiene que corresponder a la última que quedó abierta.",
      msgs: {
        vector: "Con push_back, back y pop_back sirve, pero el programa solo mira la última abierta, y la pila dice eso con su contrato.",
        deque: "Sirve, pero no se usa el frente ni el índice: es más de lo que hace falta.",
        list: "Sirve, a costa de un nodo por etiqueta abierta, sin usar nada que la lista tenga de más.",
        stack: "Correcto. Abrir es push, cerrar compara con top y hace pop: O(1) cada etiqueta, Θ(n) la página. Es el problema de los paréntesis balanceados con nombres.",
        queue: "La cola mira la más vieja: la primera etiqueta abierta, que es la que cierra al final."
      } },
    { titulo: "La carrera", correcta: "list",
      html: "Un programa sigue el orden de cien mil corredores en una carrera. Guarda, por cada corredor, un iterador a su lugar en la secuencia. Cada vez que uno adelanta al que va delante, el programa lo pasa un puesto adelante.",
      msgs: {
        vector: "Mover un corredor es borrar e insertar en medio, que corre elementos, y cada movimiento invalida los iteradores guardados de los demás.",
        deque: "insert y erase en medio corren el lado corto e invalidan todos los iteradores: los cien mil guardados dejarían de valer en el primer adelanto.",
        list: "Correcto. Pasar un nodo delante de su vecino es un splice de un solo nodo dentro de la misma lista, Θ(1), y ningún otro iterador se invalida, porque ningún nodo cambia de dirección.",
        stack: "La pila solo da acceso al último. Los adelantos pasan en cualquier lugar de la carrera.",
        queue: "La cola solo da los dos extremos. Los adelantos pasan en cualquier lugar de la carrera."
      } },
    { titulo: "El catálogo", correcta: "vector",
      html: "Se cargan un millón de códigos de producto, se ordenan una vez y después se responden millones de preguntas de si un código está, con <code>binary_search</code>.",
      msgs: {
        vector: "Correcto. Se llena con push_back, se ordena con sort y binary_search salta por índice en O(log n). Todo seguido en un arreglo, sin bloques ni punteros.",
        deque: "Funciona con el mismo orden de magnitud, pero cada acceso pasa por el mapa y por el bloque. El programa nunca usa el frente, que es lo que el deque agrega.",
        list: "No hay sort de la biblioteca para list, y binary_search sobre ella compila pero camina nodo a nodo para llegar a la mitad: Θ(n) por pregunta.",
        stack: "La pila solo deja ver el último. Buscar exige leer cualquier posición.",
        queue: "La cola solo deja ver los extremos. Buscar exige leer cualquier posición."
      } },
    { titulo: "El mazo", correcta: "deque",
      html: "En un juego de cartas se roba por arriba y por abajo del mazo, las cartas usadas vuelven por abajo, y un jugador puede pedir ver la carta número <code>i</code> contando desde arriba.",
      msgs: {
        vector: "Robar por arriba es borrar la posición 0: corre todo el mazo.",
        deque: "Correcto. pop_front y pop_back para robar, push_back para devolver, d[i] para ver: todo O(1).",
        list: "Los extremos salen en Θ(1), pero ver la carta i camina i nodos desde arriba.",
        stack: "La pila deja robar por un solo lado y no deja ver la carta i.",
        queue: "La cola no deja robar por abajo ni ver la carta i."
      } }
  ];

  function spec() {
    return {
      contenedor: "tarjetas",
      cierre: "Primero se listan las operaciones que el programa repite y después se busca el contenedor que las da todas baratas: índice y final, vector; los dos extremos, con o sin índice, deque; insertar, borrar o mover en medio con iteradores que deben seguir valiendo, list; solo el último, stack; solo el más viejo, queue. Cuando dos sirven, se escoge el de contrato más estrecho, o el que gasta menos memoria por elemento.",
      cartas: PROGRAMAS.map(function (p) {
        return { tipo: "opciones", titulo: p.titulo, correcta: p.correcta, html: "<p>" + p.html + "</p>",
                 opciones: OPS.map(function (o) { return { op: o.op, texto: o.texto, msg: p.msgs[o.op] }; }) };
      })
    };
  }

  return { programas: PROGRAMAS, spec: spec };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  Tarjetas.montar(EJERCICIO.spec());
}
