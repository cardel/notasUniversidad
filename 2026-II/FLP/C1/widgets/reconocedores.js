/* Reconocedores (clase 1). Cada reto entrega unas reglas y pide el
   procedimiento que decide la pertenencia. El código del estudiante corre de
   verdad sobre el evaluador de mini-scheme.js. */
var RETOS = (function () {
  "use strict";
  return [
    {
      id: "potencias",
      titulo: "1. Las potencias de dos",
      enunciado:
        "El conjunto <code>B</code> se define con dos reglas: el 1 está en " +
        "<code>B</code>, y si <code>n</code> está en <code>B</code>, entonces " +
        "<code>2n</code> también. Escriba <code>in-B?</code>, que decide si " +
        "un entero pertenece. La regla multiplica al construir, así que el " +
        "reconocedor divide al devolverse.",
      gramatica:
        "1 ∈ B\n" +
        "n ∈ B  ⟹  2n ∈ B",
      esqueleto:
        "(define (in-B? n)\n" +
        "  (cond ((= n 1) ???)\n" +
        "        (??? ???)\n" +
        "        (else (in-B? ???))))\n",
      pruebas: [
        { llamada: "(in-B? 1)", esperado: "#t" },
        { llamada: "(in-B? 8)", esperado: "#t" },
        { llamada: "(in-B? 1024)", esperado: "#t" },
        { llamada: "(in-B? 6)", esperado: "#f" },
        { llamada: "(in-B? 12)", esperado: "#f" },
        { llamada: "(in-B? 0)", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(in-B? 6)" || llamada === "(in-B? 12)") {
          return "Ese número es par y aun así no está en B: dividirlo entre " +
            "dos lleva a 3, que es impar y ya no puede venir de la regla. La " +
            "cláusula que descarta tiene que mirar la paridad, no solo el " +
            "tamaño.";
        }
        if (llamada === "(in-B? 0)") {
          return "El cero es par, y dividirlo entre dos vuelve a dar cero: " +
            "sin una cláusula que corte por debajo del caso base, la " +
            "recursión se queda ahí. Ningún número menor que 1 puede venir " +
            "de esta regla.";
        }
        return null;
      },
      cierre:
        "El reconocedor recorre la construcción al revés. La regla dice cómo " +
        "se fabrica un elemento a partir de otro más pequeño, y el " +
        "procedimiento deshace ese paso hasta caer en el caso base o en un " +
        "valor que ninguna regla pudo haber producido."
    },
    {
      id: "pares",
      titulo: "2. Un conjunto de parejas",
      enunciado:
        "Ahora los elementos son parejas de enteros, escritas como listas de " +
        "dos: <code>(n k)</code>. La pareja <code>(0 1)</code> está en " +
        "<code>S</code>, y de cada pareja que esté sale otra sumando uno al " +
        "primer componente y siete al segundo. Escriba <code>in-S?</code>.",
      gramatica:
        "(0, 1) ∈ S\n" +
        "(n, k) ∈ S  ⟹  (n+1, k+7) ∈ S",
      esqueleto:
        "(define (in-S? p)\n" +
        "  (cond ((equal? p '(0 1)) ???)\n" +
        "        (??? ???)\n" +
        "        (else (in-S? ???))))\n",
      pruebas: [
        { llamada: "(in-S? '(0 1))", esperado: "#t" },
        { llamada: "(in-S? '(1 8))", esperado: "#t" },
        { llamada: "(in-S? '(3 22))", esperado: "#t" },
        { llamada: "(in-S? '(2 9))", esperado: "#f" },
        { llamada: "(in-S? '(0 5))", esperado: "#f" },
        { llamada: "(in-S? '(4 29))", esperado: "#t" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(in-S? '(2 9))" || llamada === "(in-S? '(0 5))") {
          return "El primer componente cuadra con alguna pareja del " +
            "conjunto, pero el segundo no. La regla mueve los dos a la vez, " +
            "así que el paso de vuelta tiene que deshacer los dos: uno menos " +
            "en el primero y siete menos en el segundo.";
        }
        if (obtenido === "#f" && esperado === "#t") {
          return "Esa pareja sí sale de la regla. Cuente cuántas veces hay " +
            "que aplicarla desde (0 1) y revise si su condición de corte " +
            "está deteniendo la búsqueda antes de tiempo.";
        }
        return null;
      },
      cierre:
        "Que el elemento sea una pareja no cambia nada del método. El caso " +
        "base es la pareja que la primera regla entrega y el paso de vuelta " +
        "deshace la segunda regla completa, componente por componente. Con " +
        "dos condiciones que moverse al tiempo, verificar una sola deja " +
        "entrar valores ajenos."
    },
    {
      id: "tuplas",
      titulo: "3. Cuatro conjuntos, un solo reconocedor",
      enunciado:
        "Una lista de tuplas <code>(a b)</code> donde <code>a</code> es " +
        "múltiplo de cinco y <code>b</code> es impar. Son cuatro conjuntos " +
        "encadenados y cada uno pide su procedimiento. Escriba " +
        "<code>in-L?</code> y los auxiliares que necesite; el esqueleto trae " +
        "el último y usted define los otros arriba.",
      gramatica:
        "5 ∈ M      n ∈ M  ⟹  n+5 ∈ M\n" +
        "1 ∈ I      n ∈ I  ⟹  n+2 ∈ I\n" +
        "a ∈ M ∧ b ∈ I  ⟹  (a b) ∈ Tu\n" +
        "() ∈ L     t ∈ Tu ∧ l ∈ L  ⟹  (t . l) ∈ L",
      esqueleto:
        ";; Defina aquí in-M?, in-I? e in-Tu?\n" +
        "\n" +
        "(define (in-L? l)\n" +
        "  (cond ((null? l) ???)\n" +
        "        ((pair? l) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(in-L? '())", esperado: "#t" },
        { llamada: "(in-L? '((5 1) (10 7)))", esperado: "#t" },
        { llamada: "(in-L? '((15 3) (5 9) (100 101)))", esperado: "#t" },
        { llamada: "(in-L? '((5 1) (12 7)))", esperado: "#f" },
        { llamada: "(in-L? '((5 4)))", esperado: "#f" },
        { llamada: "(in-L? '((0 1)))", esperado: "#f" },
        { llamada: "(in-L? '((5 1) 10))", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(in-L? '((0 1)))") {
          return "El cero es divisible entre cinco, pero las reglas no lo " +
            "producen: arrancan en 5 y de ahí suben. Si resolvió la " +
            "pertenencia con modulo, está describiendo otro conjunto, uno " +
            "más grande que el que definen estas reglas.";
        }
        if (llamada === "(in-L? '((5 1) 10))") {
          return "El segundo elemento es el número 10, no una tupla. La " +
            "regla de la lista exige que cada elemento esté en Tu, así que " +
            "in-Tu? tiene que rechazar lo que ni siquiera tiene la forma de " +
            "una pareja antes de mirar sus componentes.";
        }
        if (llamada === "(in-L? '((5 4)))" || llamada === "(in-L? '((5 1) (12 7)))") {
          return "Una de las dos condiciones falla y la otra pasa. Revise " +
            "que in-Tu? exija las dos: basta con que un componente quede " +
            "fuera para que la tupla no entre.";
        }
        return null;
      },
      cierre:
        "Cuatro conjuntos encadenados dan cuatro procedimientos, y cada uno " +
        "solo sabe de lo suyo: in-L? no pregunta por múltiplos de cinco, le " +
        "pregunta a in-Tu?, que a su vez le pregunta a in-M?. Cuando la " +
        "definición se parte en conjuntos pequeños, el código se parte igual."
    },
    {
      id: "lcexp",
      titulo: "4. ¿Pertenece a la gramática?",
      enunciado:
        "Esta es la gramática de las expresiones lambda. Escriba " +
        "<code>in-lc-exp?</code>, que decide si un valor pertenece. Es el " +
        "mismo juicio que se hace a ojo mirando paréntesis, ahora escrito " +
        "como procedimiento: cada producción de la gramática se vuelve una " +
        "cláusula y cada no terminal, una llamada recursiva.",
      gramatica:
        "&lt;lc-exp&gt; ::= &lt;identificador&gt;\n" +
        "          ::= (lambda (&lt;identificador&gt;) &lt;lc-exp&gt;)\n" +
        "          ::= (&lt;lc-exp&gt; &lt;lc-exp&gt;)",
      esqueleto:
        "(define (in-lc-exp? e)\n" +
        "  (cond ((symbol? e) ???)\n" +
        "        ((not (pair? e)) ???)\n" +
        "        ((eq? (car e) 'lambda) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(in-lc-exp? 'x)", esperado: "#t" },
        { llamada: "(in-lc-exp? '(a b))", esperado: "#t" },
        { llamada: "(in-lc-exp? '(lambda (x) (x y)))", esperado: "#t" },
        { llamada: "(in-lc-exp? '((lambda (y) (z y)) x))", esperado: "#t" },
        { llamada: "(in-lc-exp? '(lambda x x))", esperado: "#f" },
        { llamada: "(in-lc-exp? '(lambda (x) (y z w)))", esperado: "#f" },
        { llamada: "(in-lc-exp? '(lambda (x) 5))", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(in-lc-exp? '(lambda x x))") {
          return "El parámetro va entre paréntesis: la producción dice " +
            "(lambda (<identificador>) <lc-exp>). Aquí el segundo elemento " +
            "es el símbolo x y no una lista de un identificador, así que la " +
            "expresión no entra por ninguna producción.";
        }
        if (llamada === "(in-lc-exp? '(lambda (x) (y z w)))") {
          return "El cuerpo tiene tres partes y la producción de la " +
            "aplicación tiene exactamente dos. Al bajar al cuerpo hay que " +
            "verificar también cuántos elementos trae, no solo que cada uno " +
            "sea una expresión válida.";
        }
        if (llamada === "(in-lc-exp? '(lambda (x) 5))") {
          return "El cuerpo es un número, y la gramática solo admite " +
            "identificadores, abstracciones y aplicaciones. Un valor que no " +
            "es símbolo ni par no entra por ninguna de las tres.";
        }
        if (llamada === "(in-lc-exp? '(a b))" && obtenido === "#f") {
          return "Una aplicación no necesita empezar por lambda: la tercera " +
            "producción admite cualquier par de expresiones, y dos " +
            "identificadores lo son.";
        }
        return null;
      },
      cierre:
        "Un reconocedor escrito sobre la gramática es lo que hace un " +
        "analizador sintáctico antes de construir nada: recorre el valor " +
        "preguntando por cuál producción entra cada parte, y rechaza en el " +
        "punto donde ninguna aplica. Lo que sigue es quedarse con esa " +
        "respuesta en vez de botarla, y eso ya es un árbol de sintaxis " +
        "abstracta."
    },
    {
      id: "btree",
      titulo: "5. Árboles binarios",
      enunciado:
        "Un árbol binario es un entero, o una lista de tres: un símbolo en " +
        "la raíz y dos árboles binarios. Escriba <code>in-b-tree?</code>. " +
        "Fíjese en el orden de las preguntas dentro del <code>and</code>: " +
        "pedir el tercer elemento de una lista que solo tiene dos no da " +
        "falso, da error.",
      gramatica:
        "&lt;b-tree&gt; ::= &lt;int&gt;\n" +
        "          ::= (&lt;símbolo&gt; &lt;b-tree&gt; &lt;b-tree&gt;)",
      esqueleto:
        "(define (in-b-tree? t)\n" +
        "  (cond ((number? t) ???)\n" +
        "        ((not (pair? t)) ???)\n" +
        "        (else (and ???))))\n",
      pruebas: [
        { llamada: "(in-b-tree? 5)", esperado: "#t" },
        { llamada: "(in-b-tree? '(f 1 2))", esperado: "#t" },
        { llamada: "(in-b-tree? '(f (k 2 3) (l (s 2 4) 3)))", esperado: "#t" },
        { llamada: "(in-b-tree? '())", esperado: "#f" },
        { llamada: "(in-b-tree? '(f 1))", esperado: "#f" },
        { llamada: "(in-b-tree? '(3 1 2))", esperado: "#f" },
        { llamada: "(in-b-tree? '(f a 2))", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(in-b-tree? '())") {
          return "La gramática no tiene caso vacío: el árbol más pequeño es " +
            "un entero solo. El caso base pregunta por number?, no por null?.";
        }
        if (llamada === "(in-b-tree? '(f 1))") {
          return "Le falta un hijo. La producción pide tres elementos, la " +
            "raíz y dos subárboles, y contarlos hace parte de reconocer la " +
            "forma.";
        }
        if (llamada === "(in-b-tree? '(3 1 2))") {
          return "La raíz es el número 3 y la producción pide un símbolo " +
            "ahí. Que los dos hijos estén bien no alcanza si el nodo no " +
            "tiene la forma que la regla describe.";
        }
        if (llamada === "(in-b-tree? '(f a 2))") {
          return "El hijo izquierdo es un símbolo suelto: ni es un entero ni " +
            "es una lista de tres. Aceptarlo significa que las llamadas " +
            "recursivas sobre los hijos no se están haciendo, o que su " +
            "resultado se está ignorando.";
        }
        return null;
      },
      cierre:
        "El árbol se reconoce con la misma forma de siempre, y aparecen dos " +
        "llamadas recursivas porque la producción nombra dos veces el " +
        "conjunto. Cuántas llamadas van no es algo que se decida: está " +
        "escrito en la regla."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
