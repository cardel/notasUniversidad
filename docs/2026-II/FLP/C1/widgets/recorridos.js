/* Recorridos (clase 1). Los reconocedores responden sí o no; estos retos
   recorren el dato y construyen uno nuevo, con la misma lectura de la
   gramática. El código del estudiante corre sobre mini-scheme.js. */
var RETOS = (function () {
  "use strict";
  return [
    {
      id: "nth",
      titulo: "1. El elemento en la posición n",
      enunciado:
        "Escriba <code>nth-element</code>, que devuelve el elemento que " +
        "ocupa la posición <code>n</code> contando desde cero. Si la lista " +
        "se acaba antes de llegar, devuelve <code>#f</code>. Son dos cosas " +
        "las que bajan al mismo tiempo: la lista por el <code>cdr</code> y " +
        "el número hacia el cero.",
      gramatica:
        "&lt;lista&gt; ::= ()\n" +
        "        ::= (&lt;valor&gt; . &lt;lista&gt;)",
      esqueleto:
        "(define (nth-element lst n)\n" +
        "  (cond ((null? lst) ???)\n" +
        "        ((zero? n) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(nth-element '(a b c d) 0)", esperado: "a" },
        { llamada: "(nth-element '(a b c d) 2)", esperado: "c" },
        { llamada: "(nth-element '(a b c d) 3)", esperado: "d" },
        { llamada: "(nth-element '(a b) 5)", esperado: "#f" },
        { llamada: "(nth-element '() 0)", esperado: "#f" },
        { llamada: "(nth-element '((1 2) (3 4)) 1)", esperado: "(3 4)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(nth-element '(a b c d) 2)" &&
            (obtenido === "b" || obtenido === "d")) {
          return "Se corrió una posición. La cuenta empieza en cero, así que " +
            "el caso que entrega el elemento es el que encuentra n valiendo " +
            "cero, no uno.";
        }
        if (obtenido === "(c d)" || obtenido === "(b c d)") {
          return "Devolvió el resto de la lista y no un elemento. Cuando la " +
            "cuenta llega a su fin lo que se entrega es el car, no la lista " +
            "que quedaba.";
        }
        if (llamada === "(nth-element '(a b) 5)") {
          return "La lista se acabó antes que la cuenta. Ese es el caso base " +
            "de la lista vacía, y va primero: preguntar por el car de una " +
            "lista vacía no devuelve nada, revienta.";
        }
        return null;
      },
      cierre:
        "Dos argumentos que descienden a la vez, y el orden de las cláusulas " +
        "decide qué pasa cuando los dos podrían aplicar. Preguntar primero " +
        "por la lista vacía es lo que hace que la posición inalcanzable " +
        "tenga respuesta en vez de error."
    },
    {
      id: "subst",
      titulo: "2. Reemplazar en cualquier nivel",
      enunciado:
        "Escriba <code>subst</code>, que reemplaza en una s-list todas las " +
        "apariciones de un símbolo por otro, incluidas las que estén dentro " +
        "de sublistas. La gramática nombra dos conjuntos, y de ahí salen dos " +
        "procedimientos que se llaman entre sí: el esqueleto trae los dos y " +
        "cada uno decide sobre el conjunto que le toca.",
      gramatica:
        "&lt;s-list&gt; ::= ()\n" +
        "          ::= (&lt;s-exp&gt; . &lt;s-list&gt;)\n" +
        "&lt;s-exp&gt;  ::= &lt;símbolo&gt;\n" +
        "          ::= &lt;s-list&gt;",
      esqueleto:
        "(define (subst nuevo viejo slist)\n" +
        "  (if (null? slist)\n" +
        "      ???\n" +
        "      (cons ???\n" +
        "            ???)))\n" +
        "\n" +
        "(define (subst-en-s-exp nuevo viejo sexp)\n" +
        "  (if (symbol? sexp)\n" +
        "      ???\n" +
        "      ???))\n",
      pruebas: [
        { llamada: "(subst 'a 'b '())", esperado: "()" },
        { llamada: "(subst 'a 'b '(b c b))", esperado: "(a c a)" },
        { llamada: "(subst 'a 'b '(c d))", esperado: "(c d)" },
        { llamada: "(subst 'a 'b '((b c) (b () d)))", esperado: "((a c) (a () d))" },
        { llamada: "(subst 'a 'b '(x (y (b))))", esperado: "(x (y (a)))" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "(a c b () d)" || obtenido === "(b c b () d)") {
          return "Las sublistas se abrieron: el resultado quedó plano y el " +
            "original no lo era. subst arma su respuesta con cons sobre lo " +
            "que devuelve el otro procedimiento, y ese devuelve una lista " +
            "cuando recibió una lista.";
        }
        if (llamada === "(subst 'a 'b '((b c) (b () d)))" &&
            obtenido === "((b c) (b () d))") {
          return "No reemplazó nada adentro de las sublistas. El " +
            "procedimiento que atiende los s-exp tiene dos casos, y el que " +
            "recibe una lista vuelve a entrar por subst en vez de devolverla " +
            "intacta.";
        }
        if (llamada === "(subst 'a 'b '(c d))" && obtenido === "(a a)") {
          return "Reemplazó símbolos que no eran el buscado. La comparación " +
            "va contra viejo: los demás símbolos se devuelven como estaban.";
        }
        if (llamada === "(subst 'a 'b '(b c b))" && obtenido === "(b c b)") {
          return "El símbolo buscado quedó igual. Revise cuál de los dos " +
            "argumentos se compara y cuál se entrega: viejo es el que se " +
            "busca, nuevo el que entra en su lugar.";
        }
        return null;
      },
      cierre:
        "Dos conjuntos que se nombran mutuamente dan dos procedimientos que " +
        "se llaman mutuamente, y ninguno de los dos necesita saber qué tan " +
        "hondo va: cada uno resuelve un nivel y le pasa el resto al otro. " +
        "Esa forma es la que sostiene los recorridos sobre árboles de " +
        "sintaxis abstracta, donde los conjuntos que se nombran entre sí " +
        "son varios."
    },
    {
      id: "profundidad",
      titulo: "3. La profundidad de un árbol",
      enunciado:
        "Sobre la misma gramática de árboles binarios, escriba " +
        "<code>profundidad</code>. Una hoja, que es un entero, tiene " +
        "profundidad cero; un nodo tiene uno más que la mayor de las " +
        "profundidades de sus dos hijos.",
      gramatica:
        "&lt;b-tree&gt; ::= &lt;int&gt;\n" +
        "          ::= (&lt;símbolo&gt; &lt;b-tree&gt; &lt;b-tree&gt;)",
      esqueleto:
        "(define (profundidad t)\n" +
        "  (if (number? t)\n" +
        "      ???\n" +
        "      ???))\n",
      pruebas: [
        { llamada: "(profundidad 5)", esperado: "0" },
        { llamada: "(profundidad '(f 1 2))", esperado: "1" },
        { llamada: "(profundidad '(f (k 2 3) 4))", esperado: "2" },
        { llamada: "(profundidad '(f (k 2 3) (l (s 2 4) 3)))", esperado: "3" },
        { llamada: "(profundidad '(a (b (c 1 2) 3) 4))", esperado: "3" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(profundidad '(f (k 2 3) 4))" && obtenido === "3") {
          return "Sumó las dos ramas en vez de quedarse con la más honda. " +
            "La profundidad del nodo es uno más que la mayor de las dos, no " +
            "uno más que su suma.";
        }
        if (llamada === "(profundidad '(f (k 2 3) 4))" && obtenido === "1") {
          return "Contó un solo nivel: bajó por una rama y no por la otra, o " +
            "se quedó con la profundidad del hijo sin sumarle el nodo que " +
            "acaba de mirar.";
        }
        if (llamada === "(profundidad 5)" && obtenido !== "0") {
          return "La hoja es el caso base y su profundidad es cero: no hay " +
            "ningún nodo encima de ella dentro de sí misma.";
        }
        return null;
      },
      cierre:
        "Las dos llamadas recursivas no se suman ni se encadenan: se " +
        "comparan. La regla nombra dos veces el conjunto, así que hay dos " +
        "llamadas, y qué se hace con esos dos resultados lo decide la " +
        "especificación de la función, no la gramática."
    },
    {
      id: "cuantas",
      titulo: "4. Cuántas veces ocurre libre",
      opcional: true,
      enunciado:
        "Ya se decidió <b>si</b> una variable ocurre libre. Ahora escriba " +
        "<code>cuantas-libres</code>, que dice <b>cuántas</b> veces ocurre " +
        "libre en la expresión. Las tres cláusulas son las mismas y cambia " +
        "lo que devuelve cada una: donde antes se combinaba con " +
        "<code>or</code>, ahora se suma.",
      gramatica:
        "&lt;lc-exp&gt; ::= &lt;identificador&gt;\n" +
        "          ::= (lambda (&lt;identificador&gt;) &lt;lc-exp&gt;)\n" +
        "          ::= (&lt;lc-exp&gt; &lt;lc-exp&gt;)",
      esqueleto:
        "(define (cuantas-libres exp var)\n" +
        "  (cond ((symbol? exp) ???)\n" +
        "        ((eq? (car exp) 'lambda) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(cuantas-libres 'x 'x)", esperado: "1" },
        { llamada: "(cuantas-libres 'y 'x)", esperado: "0" },
        { llamada: "(cuantas-libres '(lambda (x) (x x)) 'x)", esperado: "0" },
        { llamada: "(cuantas-libres '(x (lambda (x) x)) 'x)", esperado: "1" },
        { llamada: "(cuantas-libres '((x y) (lambda (y) (x y))) 'x)", esperado: "2" },
        { llamada: "(cuantas-libres '(lambda (y) (lambda (z) (x x))) 'x)", esperado: "2" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(cuantas-libres '(lambda (x) (x x)) 'x)" && obtenido === "2") {
          return "Ese lambda declara la misma variable, así que las dos " +
            "apariciones del cuerpo están ligadas y no cuenta ninguna. " +
            "Cuando el parámetro coincide, el aporte del cuerpo entero es " +
            "cero y no hace falta mirarlo.";
        }
        if (llamada === "(cuantas-libres '(x (lambda (x) x)) 'x)" && obtenido === "2") {
          return "Contó también la del cuerpo del lambda, que está ligada. " +
            "La misma variable puede estar libre en una parte de la " +
            "expresión y ligada en otra: son dos apariciones distintas.";
        }
        if (obtenido === "#t" || obtenido === "#f") {
          return "Está devolviendo un booleano. La respuesta ahora es un " +
            "número: cero cuando no hay ninguna, y la suma de los aportes " +
            "de las partes en los demás casos.";
        }
        return null;
      },
      cierre:
        "El recorrido no cambió: cambió el valor que devuelve cada cláusula " +
        "y el operador que junta las partes. Booleanos con or, cuentas con " +
        "una suma, y la lista de resultados con append. Una vez leído el " +
        "recorrido de la gramática, sirve para todas las preguntas que se " +
        "hagan sobre ese conjunto."
    },
    {
      id: "camino",
      titulo: "5. El camino hasta un número",
      opcional: true,
      enunciado:
        "Un árbol binario de búsqueda guarda en cada nodo un entero, a la " +
        "izquierda los menores y a la derecha los mayores. Escriba " +
        "<code>camino</code>, que recibe un número presente en el árbol y " +
        "devuelve la lista de giros que llevan hasta él: <code>izq</code> y " +
        "<code>der</code>. Si el número está en la raíz, el camino es vacío.",
      gramatica:
        "&lt;bst&gt; ::= ()\n" +
        "       ::= (&lt;int&gt; &lt;bst&gt; &lt;bst&gt;)",
      esqueleto:
        "(define (camino n bst)\n" +
        "  (cond ((= n (car bst)) ???)\n" +
        "        ((< n (car bst)) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(camino 14 '(14 () ()))", esperado: "()" },
        { llamada: "(camino 12 '(14 (7 () (12 () ())) (26 () ())))", esperado: "(izq der)" },
        { llamada: "(camino 7 '(14 (7 () (12 () ())) (26 () ())))", esperado: "(izq)" },
        { llamada: "(camino 17 '(14 (7 () (12 () ())) (26 (20 (17 () ()) ()) (31 () ()))))", esperado: "(der izq izq)" },
        { llamada: "(camino 31 '(14 (7 () (12 () ())) (26 (20 (17 () ()) ()) (31 () ()))))", esperado: "(der der)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "(izq)" && esperado === "(izq der)") {
          return "Se quedó con el primer giro. Cada llamada aporta el suyo y " +
            "lo pega delante de lo que devuelva la siguiente: el camino " +
            "completo se arma al regresar de la recursión.";
        }
        if (obtenido === "(der izq)" || obtenido === "(der der izq)") {
          return "Alguna comparación quedó al revés. A la izquierda están " +
            "los menores que el nodo, y ese es el lado al que hay que bajar " +
            "cuando el número buscado es menor.";
        }
        if (obtenido === "(izq der izq)" || obtenido === "(der izq izq der)") {
          return "El camino trae giros de más: está recorriendo las dos " +
            "ramas y juntando lo que encuentre. Con el árbol ordenado la " +
            "comparación decide el lado y solo se baja por uno.";
        }
        return null;
      },
      cierre:
        "El árbol está ordenado y por eso la recursión no explora: escoge. " +
        "Cada nodo descarta media estructura con una comparación, y el " +
        "camino se arma al volver, poniendo el giro de este nivel delante " +
        "del resto. Un recorrido que decide por dónde bajar es lo que " +
        "separa buscar de revisar todo."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
