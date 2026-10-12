/* Ejercicio interactivo: un iterador de list a traves de insert y erase (clase 20). */
var EJERCICIO = (function () {
  var INICIAL = [5, 2, 8, 3];

  /* La lista se simula con nodos; un iterador es una referencia a un nodo.
     Un nodo borrado queda marcado, y los iteradores que lo senalan ya no valen. */
  function correr() {
    var nodos = INICIAL.map(function (v) { return { v: v, vivo: true }; });
    var lista = nodos.slice();
    var it = lista[2];
    var p = lista[0];
    var q = lista[2];
    var r = lista[3];
    var pasos = [];
    function foto(texto) {
      pasos.push({
        texto: texto,
        lista: lista.map(function (n) { return n.v; }),
        it: it.v,
        p: p.vivo, q: q.vivo, r: r.vivo
      });
    }
    function posicion(n) { return lista.indexOf(n); }
    function insertar(antes, v) {
      var nuevo = { v: v, vivo: true };
      lista.splice(posicion(antes), 0, nuevo);
      return nuevo;
    }
    function borrar(n) {
      var k = posicion(n);
      lista.splice(k, 1);
      n.vivo = false;
      return lista[k];
    }
    foto("it = l.begin(); ++it; ++it;  it señala el 8; p, q y r se guardan");
    insertar(it, 4);
    foto("l.insert(it, 4);");
    lista.unshift({ v: 7, vivo: true });
    foto("l.push_front(7);");
    it = borrar(it);
    foto("it = l.erase(it);");
    it = lista[posicion(it) - 1];
    it = lista[posicion(it) - 1];
    foto("--it; --it;");
    insertar(it, 1);
    foto("l.insert(it, 1);");
    borrar(p);
    foto("l.erase(p);");
    return pasos;
  }

  function nodosHtml(st) {
    var h = "<div class=\"lista-nodos con-marcas\">";
    var marcado = false;
    st.lista.forEach(function (v) {
      var es = !marcado && v === st.it;
      if (es) { marcado = true; }
      h = h + "<span class=\"nodo" + (es ? " cursor" : "") + "\">" + v +
          (es ? "<span class=\"marca\">it</span>" : "") + "</span>";
    });
    return h + "</div>";
  }

  function spec() {
    var P = correr();
    var fin = P[P.length - 1];
    return {
      contenedor: "tarjetas",
      cierre: "En <code>list</code>, insertar crea un nodo y reescribe los punteros de sus vecinos: ningún nodo cambia de lugar y ningún iterador deja de valer. Borrar invalida solo los iteradores del nodo borrado, y <code>erase</code> devuelve el que sigue para que el recorrido continúe. Cada operación del programa es Θ(1), incluidos los dos <code>--it</code>, que siguen el puntero <code>anterior</code>. Con un <code>vector</code>, la primera inserción ya habría dejado <code>it</code> sin valor.",
      cartas: [
        { tipo: "respuesta", titulo: "La lista al final",
          html: "<pre class=\"fragmento\">list&lt;int&gt; l = {5, 2, 8, 3};\nlist&lt;int&gt;::iterator it = l.begin();\n++it;\n++it;                            // señala el 8\nlist&lt;int&gt;::iterator p = l.begin();   // el 5\nlist&lt;int&gt;::iterator q = it;          // el 8\nlist&lt;int&gt;::iterator r = --l.end();   // el 3\n\nl.insert(it, 4);\nl.push_front(7);\nit = l.erase(it);\n--it;\n--it;\nl.insert(it, 1);\nl.erase(p);</pre><p>¿Qué contiene <code>l</code> al terminar?</p>",
          campos: [{ rotulo: "l =", esperado: fin.lista.join(" "), pista: "7 5 ...", ancho: "11rem" }],
          bien: "Correcto: " + fin.lista.join(" ") + ". El 8 salió con el primer erase y el 5 con el último; el 4, el 7 y el 1 entraron cada uno en su sitio sin mover a nadie.",
          distractores: [
            { valores: ["7 5 1 2 4 3"], msg: "Falta el último erase: p señala el 5, que sale de la lista." },
            { valores: ["7 1 2 4 8 3"], msg: "it = l.erase(it) borró el 8: it lo señalaba desde el principio, porque insertar el 4 antes de él no lo movió." }
          ],
          otro: "Siga el paso a paso de abajo." },
        { tipo: "respuesta", titulo: "A quién señala <code>it</code>",
          html: "<p>Al terminar, ¿cuánto vale <code>*it</code>?</p>",
          campos: [{ rotulo: "*it =", esperado: String(fin.it) }],
          bien: "Correcto: " + fin.it + ". erase dejó it en el 3, que seguía al 8; los dos --it lo llevaron al 4 y luego al 2. Insertar el 1 antes del 2 y borrar el 5 no lo tocaron.",
          distractores: [
            { valores: ["8"], msg: "El 8 ya no está: it = l.erase(it) lo sacó y dejó it en el nodo siguiente." },
            { valores: ["1"], msg: "insert pone el 1 antes de it y deja it donde estaba." },
            { valores: ["4"], msg: "Son dos --it, no uno: desde el 3, el primero llega al 4 y el segundo al 2." }
          ],
          otro: "Tras el erase, it señala el que seguía al 8. Desde ahí, retroceda dos nodos." },
        { tipo: "opciones", titulo: "Los iteradores guardados", columna: true, correcta: "r",
          html: "<p>Al terminar, ¿cuáles de <code>p</code>, <code>q</code> y <code>r</code> todavía se pueden usar?</p>",
          opciones: [
            { op: "todos", texto: "Los tres: en <code>list</code> ningún iterador se invalida", msg: "Insertar no invalida, pero borrar sí: el iterador al nodo borrado ya no señala nada." },
            { op: "pr", texto: "<code>p</code> y <code>r</code>", msg: "p señalaba el 5, que el último erase sacó de la lista." },
            { op: "r", texto: "Solo <code>r</code>", msg: "Correcto. q señalaba el 8 y p el 5, los dos nodos borrados. r señala el 3, que nunca se movió: las dos inserciones y el push_front reescribieron punteros de otros nodos." },
            { op: "ninguno", texto: "Ninguno", msg: "r señala el 3, que sigue en la lista y no cambió de nodo." }
          ] },
        { tipo: "opciones", titulo: "Con un <code>vector</code>", columna: true, correcta: "inval",
          html: "<p>Si <code>l</code> fuera un <code>vector&lt;int&gt;</code> con los mismos cuatro valores, ¿qué pasa con <code>it</code> después de <code>l.insert(it, 4)</code>?</p>",
          opciones: [
            { op: "igual", texto: "Sigue señalando el 8", msg: "En el vector, insert corre una casilla a la derecha todo lo que está desde it; el 8 cambia de casilla y el iterador viejo deja de valer." },
            { op: "cuatro", texto: "Señala el 4, que quedó en su casilla", msg: "Es lo que suele pasar en la memoria, pero la biblioteca no lo garantiza: si el vector tuvo que crecer, todo se mudó. Se toma como inválido." },
            { op: "inval", texto: "Deja de valer, y hay que usar el que devuelve <code>insert</code>", msg: "Correcto. vector::insert invalida los iteradores desde el punto de inserción, y todos si el vector crece. Por eso insert devuelve un iterador al elemento nuevo." }
          ] },
        { tipo: "pasos", titulo: "Paso a paso",
          pasos: P.map(function (st) {
            return { texto: st.texto,
                     html: nodosHtml(st) + "<p>p " + (st.p ? "vale" : "ya no vale") + " · q " + (st.q ? "vale" : "ya no vale") + " · r " + (st.r ? "vale" : "ya no vale") + "</p>" };
          }) }
      ]
    };
  }

  return { inicial: INICIAL, correr: correr, spec: spec };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  Tarjetas.montar(EJERCICIO.spec());
}
