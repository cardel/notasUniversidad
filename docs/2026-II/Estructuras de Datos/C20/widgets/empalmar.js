/* Ejercicio interactivo: splice y sort en list (clase 20). */
var EJERCICIO = (function () {
  var A = [4, 9, 1];
  var B = [7, 2, 6];

  /* Las listas guardan nodos; it es una referencia a un nodo y sigue al nodo. */
  function correr() {
    var a = A.map(function (v) { return { v: v }; });
    var b = B.map(function (v) { return { v: v }; });
    var it = b[1];
    var pasos = [];
    function foto(texto) {
      pasos.push({ texto: texto, a: a.map(function (n) { return n.v; }), b: b.map(function (n) { return n.v; }),
                   it: it.v, enA: a.indexOf(it) !== -1 });
    }
    foto("it = b.begin(); ++it;  it señala el 2");
    b.splice(b.indexOf(it), 1);
    a.push(it);
    foto("a.splice(a.end(), b, it);");
    a = b.concat(a);
    b = [];
    foto("a.splice(a.begin(), b);");
    a.sort(function (x, y) { return x.v - y.v; });
    foto("a.sort();");
    return pasos;
  }

  function texto(v) { return v.length === 0 ? "vacía" : v.join(" "); }

  function spec() {
    var P = correr();
    var tras2 = P[2];
    var fin = P[3];
    return {
      contenedor: "tarjetas",
      cierre: "<code>splice</code> cambia nodos de lista reescribiendo enlaces: un nodo suelto o una lista entera cuestan Θ(1), y ningún iterador se invalida, porque los nodos no se mudan de dirección; solo pasan a ser de otra lista. Un tramo de k nodos tomado de otra lista cuesta Θ(k), por la cuenta de <code>size()</code>. <code>a.sort()</code> es el merge sort sobre la lista enlazada, Θ(n log n), y también empalma nodos: el iterador sigue al 2 hasta su lugar nuevo.",
      cartas: [
        { tipo: "respuesta", titulo: "Las dos listas tras los dos <code>splice</code>",
          html: "<pre class=\"fragmento\">list&lt;int&gt; a = {4, 9, 1};\nlist&lt;int&gt; b = {7, 2, 6};\nlist&lt;int&gt;::iterator it = b.begin();\n++it;                         // señala el 2\na.splice(a.end(), b, it);     // mueve un solo nodo\na.splice(a.begin(), b);       // mueve lo que quede de b\na.sort();</pre><p>Antes de <code>a.sort()</code>, ¿qué tienen <code>a</code> y <code>b</code>?</p>",
          campos: [{ rotulo: "a =", esperado: tras2.a.join(" "), pista: "4 9 ...", ancho: "10rem" },
                   { rotulo: "<code>b.size()</code> =", esperado: String(tras2.b.length) }],
          bien: "Correcto: a = " + tras2.a.join(" ") + " y b vacía. El primer splice llevó el 2 al final de a; el segundo puso lo que quedaba de b, el 7 y el 6, delante del 4, y vació b.",
          distractores: [
            { valores: ["7 2 6 4 9 1", null], msg: "El 2 ya no estaba en b cuando llegó el segundo splice: el primero lo había movido al final de a." },
            { valores: ["4 9 1 2 7 6", null], msg: "El segundo splice recibe a.begin(): lo de b entra delante del 4, no al final." },
            { valores: [null, "3"], msg: "splice no copia: los nodos salen de b. Después del segundo, b no tiene ninguno." }
          ],
          otro: "Haga los dos splice uno por uno. El primero mueve el nodo de it; el segundo, todos los que queden en b." },
        { tipo: "respuesta", titulo: "El iterador después de ordenar",
          html: "<p>Después de <code>a.sort()</code>, ¿cuánto vale <code>*it</code>, y en qué posición de <code>a</code> está, contando desde 0?</p>",
          campos: [{ rotulo: "*it =", esperado: String(fin.it) },
                   { rotulo: "posición:", esperado: String(fin.a.indexOf(fin.it)) }],
          bien: "Correcto: *it = " + fin.it + " en la posición " + fin.a.indexOf(fin.it) + " de a = " + fin.a.join(" ") + ". El iterador señala un nodo, no una posición: el nodo del 2 pasó de b a a y sort lo reenganchó en su lugar sin copiar el dato.",
          distractores: [
            { valores: ["1", null], msg: "it no señala una posición fija: señala el nodo del 2, y ese nodo se movió con el dato." },
            { valores: [null, "5"], msg: "Ese es el lugar del 2 antes de ordenar. sort reengancha los nodos y el del 2 queda donde le toca en el orden." }
          ],
          otro: "it sigue al nodo del 2 a todas partes. Ordene a y busque el 2." },
        { tipo: "opciones", titulo: "Lo que cuesta cada línea", columna: true, correcta: "bien",
          html: "<p>Con <code>n</code> elementos en total, ¿cuál es el costo de las tres líneas, en orden?</p>",
          opciones: [
            { op: "bien", texto: "Θ(1), Θ(1) y Θ(n log n)", msg: "Correcto. Mover un nodo suelto o una lista entera reescribe un número fijo de punteros; ordenar es el merge sort de la lista." },
            { op: "lineal", texto: "Θ(1), Θ(m) con m = <code>b.size()</code>, y Θ(n log n)", msg: "Con la lista entera la biblioteca sabe cuántos nodos llegan, porque b guarda su tamaño: no cuenta nada. Son cuatro punteros sin importar cuántos traiga b." },
            { op: "sort", texto: "Θ(1), Θ(1) y Θ(n²)", msg: "a.sort() no es insertion sort: es merge sort sobre nodos, Θ(n log n) también en el peor caso." },
            { op: "copia", texto: "Θ(n), Θ(n) y Θ(n log n)", msg: "splice no recorre ni copia: desengancha nodos de b y los engancha en a." }
          ] },
        { tipo: "opciones", titulo: "Un tramo, no la lista entera", columna: true, correcta: "k",
          html: "<p>La versión <code>a.splice(pos, b, primero, ultimo)</code> mueve el tramo <code>[primero, ultimo)</code> de <code>b</code>, de <code>k</code> nodos. ¿Cuánto cuesta?</p>",
          opciones: [
            { op: "uno", texto: "Θ(1): son los mismos cuatro enlaces", msg: "Los enlaces sí son cuatro, pero a.size() y b.size() tienen que seguir respondiendo en O(1), y la lista no sabe cuántos nodos hay en el tramo sin contarlos." },
            { op: "k", texto: "Θ(k): hay que contar los nodos del tramo", msg: "Correcto. Reenganchar cuesta cuatro punteros, pero las dos listas guardan su tamaño y hay que restar y sumar k, que se obtiene recorriendo el tramo. Cuando el tramo es de la misma lista, el tamaño no cambia y vuelve a ser Θ(1)." },
            { op: "n", texto: "Θ(n): se recorre b entera", msg: "Solo hace falta recorrer el tramo, no toda b." }
          ] },
        { tipo: "pasos", titulo: "Paso a paso",
          pasos: P.map(function (st) {
            return { texto: st.texto,
                     html: "<p><code>a</code>: " + texto(st.a) + " · <code>b</code>: " + texto(st.b) + " · <code>*it</code> = " + st.it + ", en " + (st.enA ? "a" : "b") + "</p>" };
          }) }
      ]
    };
  }

  return { a: A, b: B, correr: correr, spec: spec };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  Tarjetas.montar(EJERCICIO.spec());
}
