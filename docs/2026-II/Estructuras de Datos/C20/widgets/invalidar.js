/* Ejercicio interactivo: qué sigue valiendo después de cada operación (clase 20).
   Las respuestas siguen las reglas de invalidación de la biblioteca (cppreference,
   secciones de vector, deque y list); el programa de prueba en C++ comprueba las
   direcciones de memoria en los casos donde se pueden observar. */
var EJERCICIO = (function () {
  var CASOS = [
    { id: "dequeptr", titulo: "Un puntero en el deque", correcta: "vale",
      codigo: "deque&lt;int&gt; d = {11, 22, 33, 44, 55, 66};\nint *ptr = &amp;d[3];      // el 44\nd.push_front(0);",
      pregunta: "¿Qué pasa con <code>ptr</code>?",
      opciones: [
        { op: "vale", texto: "Sigue valiendo y <code>*ptr</code> es 44, que ahora es <code>d[4]</code>", msg: "Correcto. push_front escribe en una casilla libre del primer bloque o en un bloque nuevo; ningún bloque se mueve, así que la dirección del 44 no cambia. Cambia su índice, porque entró uno adelante." },
        { op: "indice", texto: "Sigue valiendo, pero ahora <code>*ptr</code> es 33, el nuevo <code>d[3]</code>", msg: "ptr guarda una dirección, no un índice. El 44 no se movió de casilla; lo que cambió es que ahora es el elemento 4." },
        { op: "nada", texto: "Deja de valer, como en el vector", msg: "En el vector sí, si crece. En el deque los bloques no se mudan al entrar por un extremo: los punteros y referencias a los elementos siguen valiendo." }
      ] },
    { id: "dequeit", titulo: "Un iterador en el deque", correcta: "invalido",
      codigo: "deque&lt;int&gt; d = {11, 22, 33, 44, 55, 66};\ndeque&lt;int&gt;::iterator it = d.begin() + 3;\nd.push_back(77);",
      pregunta: "¿Qué pasa con <code>it</code>?",
      opciones: [
        { op: "vale", texto: "Sigue valiendo: el 44 no se movió", msg: "El 44 no se movió, pero el iterador del deque guarda además en qué ranura del mapa está, y el mapa pudo copiarse a otro lado. La biblioteca da por inválidos todos los iteradores tras push_back." },
        { op: "invalido", texto: "Deja de valer, aunque el 44 siga en su casilla", msg: "Correcto. push_back y push_front invalidan todos los iteradores del deque, porque el mapa pudo mudarse; los punteros a elementos sí siguen valiendo. Tras la operación, el iterador se vuelve a tomar." },
        { op: "fin", texto: "Pasa a señalar el 77", msg: "Un iterador no se corre solo. Lo que puede pasar es que deje de ser utilizable." }
      ] },
    { id: "vectorptr", titulo: "Un puntero en el vector lleno", correcta: "invalido",
      codigo: "vector&lt;int&gt; v(4);              // cuatro ceros, capacidad 4\nint *ptr = &amp;v[1];\nv.push_back(55);",
      pregunta: "¿Qué pasa con <code>ptr</code>?",
      opciones: [
        { op: "vale", texto: "Sigue valiendo: push_back escribe al final", msg: "Escribe al final si hay espacio. Con la capacidad llena, el vector reserva un arreglo más grande, copia los cuatro y libera el viejo: v[1] cambia de dirección." },
        { op: "invalido", texto: "Deja de valer: el vector se mudó", msg: "Correcto. Sin capacidad libre, push_back reserva otro arreglo, copia los elementos y libera el anterior. ptr queda señalando memoria liberada." },
        { op: "indice", texto: "Sigue valiendo, porque <code>v[1]</code> sigue siendo 0", msg: "v[1] sigue valiendo 0, pero en otra dirección. ptr guarda la dirección vieja." }
      ] },
    { id: "listit", titulo: "Un iterador en la lista", correcta: "vale",
      codigo: "list&lt;int&gt; l = {11, 22, 33, 44};\nlist&lt;int&gt;::iterator it = l.begin();\n++it;\n++it;                     // el 33\nl.push_front(0);\nl.erase(l.begin());       // borra el 0\nl.erase(--l.end());       // borra el 44",
      pregunta: "¿Qué pasa con <code>it</code>?",
      opciones: [
        { op: "vale", texto: "Sigue valiendo y señala el 33", msg: "Correcto. En list solo se invalidan los iteradores a nodos borrados, y el del 33 no se borró. Las tres operaciones tocan punteros de otros nodos." },
        { op: "invalido", texto: "Deja de valer, porque se borraron elementos", msg: "Borrar invalida solo los iteradores a los nodos que salen. El 33 sigue en su nodo." },
        { op: "corre", texto: "Señala el 22, porque al borrar el 0 todo se corrió", msg: "En la lista nada se corre: cada elemento se queda en su nodo y lo que cambia son los enlaces." }
      ] }
  ];

  function spec() {
    return {
      contenedor: "tarjetas",
      cierre: "Un iterador o un puntero deja de valer cuando lo que señala se muda o desaparece. El vector se muda entero cuando crece, y corre lo que está detrás al insertar o borrar. El deque no mueve sus bloques al entrar por los extremos, así que los punteros a elementos sobreviven, pero sus iteradores dependen del mapa y se toman de nuevo. La lista nunca mueve un nodo: solo pierde los iteradores de los nodos que borra.",
      cartas: CASOS.map(function (c) {
        return { tipo: "opciones", titulo: c.titulo, columna: true,
                 correcta: c.correcta, html: "<pre class=\"fragmento\">" + c.codigo + "</pre><p>" + c.pregunta + "</p>",
                 opciones: c.opciones };
      })
    };
  }

  return { casos: CASOS, spec: spec };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  Tarjetas.montar(EJERCICIO.spec());
}
