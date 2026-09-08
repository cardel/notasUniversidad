/* Ligaduras locales al recorrer la gramática. Los procedimientos son los
   mismos recorridos de siempre; lo que cambia es que el resultado de una
   llamada se necesita dos veces, o que hace falta un procedimiento auxiliar
   que no debe verse por fuera. El código del estudiante corre sobre
   mini-scheme.js. */
var RETOS = (function () {
  "use strict";
  return [
    {
      id: "rango",
      titulo: "1. Una llamada, dos usos",
      enunciado:
        "Escriba <code>rango</code>, que devuelve una lista con el menor y el " +
        "mayor de una lista de números, en ese orden. La llamada recursiva " +
        "entrega los dos valores del resto y hacen falta los dos, así que " +
        "conviene ligarla a un nombre en vez de escribirla dos veces: " +
        "escribirla dos veces la evalúa dos veces, y el trabajo se duplica en " +
        "cada nivel.",
      gramatica:
        "&lt;lista-no-vacía&gt; ::= (&lt;número&gt;)\n" +
        "                 ::= (&lt;número&gt; . &lt;lista-no-vacía&gt;)",
      esqueleto:
        "(define (rango lst)\n" +
        "  (if (null? (cdr lst))\n" +
        "      (list (car lst) (car lst))\n" +
        "      (let ((resto ???))\n" +
        "        (list ???\n" +
        "              ???))))\n",
      pruebas: [
        { llamada: "(rango '(7))", esperado: "(7 7)" },
        { llamada: "(rango '(3 1 4))", esperado: "(1 4)" },
        { llamada: "(rango '(5 5))", esperado: "(5 5)" },
        { llamada: "(rango '(-2 0 9))", esperado: "(-2 9)" },
        { llamada: "(rango '(2 8 1 6))", esperado: "(1 8)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(rango '(3 1 4))" && obtenido === "(3 3)") {
          return "El resto no se está mirando: la respuesta solo tiene en " +
            "cuenta el primer elemento.";
        }
        if (llamada === "(rango '(3 1 4))" && obtenido === "(1 1)") {
          return "Los dos lugares están recibiendo lo mismo. El primero es el " +
            "menor entre el car y el menor del resto; el segundo, el mayor.";
        }
        if (obtenido.indexOf("car") !== -1 || obtenido.indexOf("no es") !== -1) {
          return "resto queda ligado a una lista de dos elementos, así que " +
            "sus partes se sacan con car y cadr.";
        }
        return "Del resultado del resto se toman sus dos componentes y cada " +
          "una se compara con el primer elemento.";
      },
      cierre:
        "Sin la ligadura, cada nivel dispararía dos recorridos del resto y el " +
        "costo se duplicaría en cada paso. Ligar el resultado una vez lo deja " +
        "en un solo recorrido."
    },
    {
      id: "quita-y-cuenta",
      titulo: "2. Devolver dos cosas de un mismo recorrido",
      enunciado:
        "Escriba <code>quita-y-cuenta</code>, que devuelve una lista de dos " +
        "elementos: la lista sin las apariciones del símbolo dado, y cuántas " +
        "quitó. Un solo recorrido produce las dos respuestas, y para eso hay " +
        "que ligar el resultado de la llamada y usar sus dos partes.",
      gramatica:
        "&lt;lista-de-símbolos&gt; ::= ()\n" +
        "                    ::= (&lt;símbolo&gt; . &lt;lista-de-símbolos&gt;)",
      esqueleto:
        "(define (quita-y-cuenta s lst)\n" +
        "  (cond ((null? lst) (list '() 0))\n" +
        "        ((eq? (car lst) s)\n" +
        "         (let ((resto (quita-y-cuenta s (cdr lst))))\n" +
        "           (list ??? ???)))\n" +
        "        (else\n" +
        "         (let ((resto (quita-y-cuenta s (cdr lst))))\n" +
        "           (list ??? ???)))))\n",
      pruebas: [
        { llamada: "(quita-y-cuenta 'a '(a b a c))", esperado: "((b c) 2)" },
        { llamada: "(quita-y-cuenta 'a '())", esperado: "(() 0)" },
        { llamada: "(quita-y-cuenta 'z '(a b))", esperado: "((a b) 0)" },
        { llamada: "(quita-y-cuenta 'a '(a a a))", esperado: "(() 3)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(quita-y-cuenta 'a '(a b a c))" && obtenido === "((b c) 0)") {
          return "La lista quedó bien pero la cuenta no sube. En la cláusula " +
            "que encuentra el símbolo, el segundo componente es uno más que " +
            "el del resto.";
        }
        if (llamada === "(quita-y-cuenta 'z '(a b))" && obtenido === "(() 0)") {
          return "Se está descartando todo. La cláusula del else conserva el " +
            "primer elemento con cons y deja la cuenta como venía.";
        }
        return "Las dos cláusulas arman la misma pareja y se diferencian en " +
          "qué hacen con el primer elemento: una lo deja fuera y suma uno, la " +
          "otra lo conserva y no suma.";
      },
      cierre:
        "Un procedimiento que devuelve varias respuestas las empaqueta en una " +
        "lista, y quien lo llama las separa con <code>car</code> y " +
        "<code>cadr</code>. Es la manera de recorrer una sola vez cuando dos " +
        "preguntas se responden con el mismo recorrido."
    },
    {
      id: "resumen-arbol",
      titulo: "3. Un resultado que se arma por etapas",
      enunciado:
        "Escriba <code>resumen</code>, que devuelve la cantidad de nodos de " +
        "un árbol binario y su altura, en ese orden. Los dos números salen de " +
        "los resúmenes de las dos ramas, y esos resúmenes se calculan primero. " +
        "Con <code>let*</code> cada ligadura ve las anteriores, así que las " +
        "dos ramas se ligan antes y los dos números se calculan con ellas.",
      gramatica:
        "&lt;b-tree&gt; ::= ()\n" +
        "         ::= (&lt;número&gt; &lt;b-tree&gt; &lt;b-tree&gt;)",
      esqueleto:
        "(define (resumen arbol)\n" +
        "  (if (null? arbol)\n" +
        "      (list 0 0)\n" +
        "      (let* ((izq ???)\n" +
        "             (der ???)\n" +
        "             (nodos ???)\n" +
        "             (alto ???))\n" +
        "        (list nodos alto))))\n",
      pruebas: [
        { llamada: "(resumen '())", esperado: "(0 0)" },
        { llamada: "(resumen '(5 () ()))", esperado: "(1 1)" },
        { llamada: "(resumen '(5 (3 () ()) (8 () ())))", esperado: "(3 2)" },
        { llamada: "(resumen '(1 (2 (3 () ()) ()) ()))", esperado: "(3 3)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(resumen '(5 (3 () ()) (8 () ())))" && obtenido === "(3 3)") {
          return "La altura está sumando las dos ramas. Se toma la mayor de " +
            "las dos y se le suma uno por el nodo actual.";
        }
        if (llamada === "(resumen '(5 (3 () ()) (8 () ())))" && obtenido === "(2 2)") {
          return "Falta contar el nodo actual: los nodos son uno más la suma " +
            "de los de las dos ramas.";
        }
        if (obtenido.indexOf("no está ligada") !== -1) {
          return "El orden de let* manda: nodos y alto solo pueden nombrar a " +
            "izq y der si estas quedaron antes.";
        }
        return "Cada rama devuelve su propia pareja. La cantidad se suma; la " +
          "altura se compara con max.";
      },
      cierre:
        "El recorrido es el mismo de cualquier árbol binario y las cuatro " +
        "ligaduras son las cuatro etapas del cálculo escritas en orden. Sin " +
        "ellas, cada rama se recorrería dos veces, una por cada número."
    },
    {
      id: "con-posicion",
      titulo: "4. Un contador que no aparece en la interfaz",
      enunciado:
        "Escriba <code>con-posicion</code>, que empareja cada elemento con su " +
        "posición contando desde cero. Quien lo usa pasa la lista y nada más: " +
        "el contador es un asunto interno. <code>letrec</code> permite " +
        "definir adentro el procedimiento de dos argumentos que sí lo lleva.",
      gramatica:
        "&lt;lista&gt; ::= ()\n" +
        "        ::= (&lt;valor&gt; . &lt;lista&gt;)",
      esqueleto:
        "(define (con-posicion lst)\n" +
        "  (letrec ((numerar (lambda (l i)\n" +
        "                      (if (null? l)\n" +
        "                          ???\n" +
        "                          (cons (list ??? ???)\n" +
        "                                (numerar ??? ???))))))\n" +
        "    (numerar lst ???)))\n",
      pruebas: [
        { llamada: "(con-posicion '())", esperado: "()" },
        { llamada: "(con-posicion '(x))", esperado: "((x 0))" },
        { llamada: "(con-posicion '(a b c))", esperado: "((a 0) (b 1) (c 2))" },
        { llamada: "(con-posicion '((p q) r))", esperado: "(((p q) 0) (r 1))" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(con-posicion '(a b c))" && obtenido === "((a 1) (b 2) (c 3))") {
          return "La cuenta arranca en uno. Se pide desde cero, y ese valor " +
            "inicial es el que va en la llamada de abajo.";
        }
        if (llamada === "(con-posicion '(a b c))" && obtenido === "((a 0) (b 0) (c 0))") {
          return "El contador no está subiendo: cada llamada recibe el " +
            "siguiente número, no el mismo.";
        }
        return "Cada paso arma la pareja del primer elemento con el contador " +
          "actual y sigue con el resto y el contador aumentado.";
      },
      cierre:
        "La ligadura local separa lo que el procedimiento hace de cómo lo " +
        "logra. Un argumento de más en la interfaz obligaría a quien lo llama " +
        "a saber que existe un contador, y a arrancarlo bien."
    },
    {
      id: "dos-conjuntos",
      titulo: "5. Dos conjuntos, dos procedimientos ligados a la vez",
      enunciado:
        "Escriba <code>cuenta-simbolos</code>, que cuenta cuántos símbolos hay " +
        "en una s-list, a cualquier profundidad. La gramática nombra dos " +
        "conjuntos y por eso salen dos procedimientos que se llaman entre sí: " +
        "uno recorre la lista y otro decide qué hacer con cada elemento. " +
        "Un solo <code>letrec</code> liga los dos antes de construir " +
        "cualquiera de ellos, que es lo que permite que se nombren " +
        "mutuamente.",
      gramatica:
        "&lt;s-list&gt; ::= ()\n" +
        "         ::= (&lt;s-exp&gt; . &lt;s-list&gt;)\n" +
        "&lt;s-exp&gt;  ::= &lt;símbolo&gt; | &lt;s-list&gt;",
      esqueleto:
        "(define (cuenta-simbolos slist)\n" +
        "  (letrec ((en-lista (lambda (l)\n" +
        "                       (if (null? l)\n" +
        "                           ???\n" +
        "                           (+ (en-exp ???) (en-lista ???)))))\n" +
        "           (en-exp (lambda (x)\n" +
        "                     (if (symbol? x) ??? ???))))\n" +
        "    (en-lista slist)))\n",
      pruebas: [
        { llamada: "(cuenta-simbolos '())", esperado: "0" },
        { llamada: "(cuenta-simbolos '(a b))", esperado: "2" },
        { llamada: "(cuenta-simbolos '(a (b c) d))", esperado: "4" },
        { llamada: "(cuenta-simbolos '((()) ()))", esperado: "0" },
        { llamada: "(cuenta-simbolos '(a (b (c d)) e))", esperado: "5" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(cuenta-simbolos '(a (b c) d))" && obtenido === "3") {
          return "Las listas de adentro están contando como uno. Cuando el " +
            "elemento no es símbolo, es una s-list y hay que recorrerla.";
        }
        if (llamada === "(cuenta-simbolos '(a (b c) d))" && obtenido === "2") {
          return "Los elementos anidados se están descartando. El segundo " +
            "procedimiento devuelve la cuenta de adentro, no cero.";
        }
        if (obtenido.indexOf("no está ligada") !== -1) {
          return "Los dos nombres tienen que quedar en el mismo letrec; " +
            "definirlos por separado deja al primero sin ver al segundo.";
        }
        return "El de la lista recorre por el cdr y suma; el del elemento " +
          "responde uno si es símbolo y delega si no lo es.";
      },
      cierre:
        "La forma del procedimiento vuelve a salir de la forma de la " +
        "gramática: dos conjuntos que se nombran mutuamente dan dos " +
        "procedimientos que se llaman entre sí, y la ligadura que los " +
        "sostiene es la única que liga antes de construir."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
