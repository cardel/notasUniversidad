/* Ejercicio interactivo: cuántos elementos corre insert y erase en deque y vector (clase 20).
   La regla es la de la biblioteca de GCC: con n elementos, insert en la posición p
   corre los p de adelante si p < n / 2 y los n - p de atrás en otro caso; erase en p
   corre los p de adelante si p < n / 2 y los n - p - 1 de atrás en otro caso.
   vector siempre corre los de atrás. */
var EJERCICIO = (function () {
  var N = 12;

  function insertDeque(n, p) { return p < Math.floor(n / 2) ? p : n - p; }
  function eraseDeque(n, p) { return p < Math.floor(n / 2) ? p : n - p - 1; }
  function insertVector(n, p) { return n - p; }
  function eraseVector(n, p) { return n - p - 1; }

  function spec() {
    return {
      contenedor: "tarjetas",
      cierre: "El deque puede crecer y achicarse por los dos extremos, así que para abrir o cerrar un hueco corre el lado más corto: O(min(p, n − p)). El vector solo crece por el final y siempre corre lo que está detrás de p: O(n − p). Cerca de los extremos el deque casi no corre nada; en la mitad, los dos corren unos n/2, y el deque lo hace casilla por casilla saltando entre bloques, mientras el vector mueve un tramo seguido de memoria.",
      cartas: [
        { tipo: "respuesta", titulo: "Insertar cerca del frente",
          html: "<p>Un <code>deque&lt;int&gt; d</code> con " + N + " elementos. Se cuenta un elemento corrido por cada uno que cambia de casilla. Con la biblioteca de GCC, <code>insert</code> en la posición <code>p</code> corre los <code>p</code> de adelante si <code>p &lt; n / 2</code>, y los <code>n − p</code> de atrás en otro caso.</p><p>¿Cuántos corre <code>d.insert(d.begin() + 2, 40)</code>?</p>",
          campos: [{ rotulo: "corridos:", esperado: String(insertDeque(N, 2)) }],
          bien: "Correcto: " + insertDeque(N, 2) + ". Los dos de adelante se corren una casilla hacia el frente, donde el deque tiene espacio, y el 40 entra en el hueco. Los diez de atrás no se tocan.",
          distractores: [{ valores: [String(insertVector(N, 2))], msg: "Esos son los de atrás, los que correría un vector. El deque escoge el lado corto." }],
          otro: "p = 2 es menor que n / 2 = 6: se corren los de adelante." },
        { tipo: "respuesta", titulo: "Insertar cerca del final",
          html: "<p>Con el mismo deque de " + N + ", ¿cuántos corre <code>d.insert(d.begin() + 10, 40)</code>?</p>",
          campos: [{ rotulo: "corridos:", esperado: String(insertDeque(N, 10)) }],
          bien: "Correcto: " + insertDeque(N, 10) + ". p = 10 no es menor que 6, así que se corren los de atrás: las posiciones 10 y 11.",
          distractores: [{ valores: ["10"], msg: "Ese sería el lado de adelante. Del 10 hacia atrás solo hay dos elementos." }],
          otro: "Cuente cuántos elementos hay desde la posición 10 hasta el final." },
        { tipo: "respuesta", titulo: "Insertar en la mitad",
          html: "<p>¿Y <code>d.insert(d.begin() + 6, 40)</code>? ¿Y la misma inserción en un <code>vector&lt;int&gt;</code> de " + N + "?</p>",
          campos: [{ rotulo: "deque:", esperado: String(insertDeque(N, 6)) }, { rotulo: "vector:", esperado: String(insertVector(N, 6)) }],
          bien: "Correcto: " + insertDeque(N, 6) + " y " + insertVector(N, 6) + ". En la mitad los dos lados miden lo mismo y el deque no ahorra nada: los dos son Θ(n) cuando se inserta en el centro.",
          distractores: [{ valores: ["0", null], msg: "El deque no inserta en Θ(1) en medio: eso es de list. Tiene que abrir un hueco corriendo un lado." }],
          otro: "En la mitad, cualquiera de los dos lados tiene seis." },
        { tipo: "respuesta", titulo: "Borrar",
          html: "<p><code>erase</code> cierra el hueco por el lado corto: corre los <code>p</code> de adelante si <code>p &lt; n / 2</code>, y los <code>n − p − 1</code> de atrás en otro caso. Con " + N + " elementos, ¿cuántos corre <code>d.erase(d.begin() + 3)</code> en el deque, y cuántos en un vector?</p>",
          campos: [{ rotulo: "deque:", esperado: String(eraseDeque(N, 3)) }, { rotulo: "vector:", esperado: String(eraseVector(N, 3)) }],
          bien: "Correcto: " + eraseDeque(N, 3) + " y " + eraseVector(N, 3) + ". El deque corre hacia atrás los tres de adelante y el frente avanza una casilla; el vector corre hacia adelante los ocho que siguen al borrado.",
          distractores: [{ valores: [null, "9"], msg: "El que se borra no se corre: detrás de la posición 3 hay 12 − 3 − 1 = 8." }],
          otro: "Cuente los elementos antes de la posición 3 y los que vienen después de ella." },
        { tipo: "opciones", titulo: "Cuál conviene", columna: true, correcta: "deque",
          html: "<p>Un programa mantiene una secuencia de unos 100 000 números y, en cada paso, inserta uno en una posición que casi siempre está entre las diez primeras o entre las diez últimas. Además lee posiciones al azar con <code>[i]</code>. ¿Qué contenedor usa?</p>",
          opciones: [
            { op: "vector", texto: "<code>vector</code>", msg: "Las inserciones cerca del frente correrían casi los 100 000 elementos cada vez." },
            { op: "deque", texto: "<code>deque</code>", msg: "Correcto. Cerca de cualquiera de los dos extremos el lado corto tiene a lo sumo diez elementos, y d[i] sigue en O(1)." },
            { op: "list", texto: "<code>list</code>", msg: "La inserción sería Θ(1) con el iterador, pero leer la posición i camina i nodos. Con lecturas al azar eso domina." }
          ] }
      ]
    };
  }

  return { n: N, insertDeque: insertDeque, eraseDeque: eraseDeque,
           insertVector: insertVector, eraseVector: eraseVector, spec: spec };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  Tarjetas.montar(EJERCICIO.spec());
}
