/* Escribir el datatype. Tres gramáticas y, para cada una, la declaración con
   define-datatype que le corresponde: los nombres los da la gramática, los
   predicados los decide quien declara. Las pruebas construyen valores y
   preguntan por los predicados. El código corre sobre mini-scheme.js. */
var GRAMATICA_BEXP =
  "&lt;bexp&gt; ::= true                          true-exp ()\n" +
  "       ::= false                         false-exp ()\n" +
  "       ::= &lt;símbolo&gt;                      var-exp (nombre)\n" +
  "       ::= (not &lt;bexp&gt;)                   not-exp (arg)\n" +
  "       ::= (&lt;bexp&gt; and &lt;bexp&gt;)            and-exp (izq der)\n" +
  "       ::= (&lt;bexp&gt; or &lt;bexp&gt;)             or-exp (izq der)\n" +
  "\n" +
  "&lt;símbolo&gt; es cualquier símbolo distinto de true y false.";

var GRAMATICA_DIRECTORIO =
  "&lt;entrada&gt; ::= (archivo &lt;símbolo&gt; &lt;número&gt;)        archivo-entrada (nombre tamano)\n" +
  "          ::= (carpeta &lt;símbolo&gt; &lt;entrada&gt; ...)   carpeta-entrada (nombre hijos)";

var GRAMATICA_SLIST =
  "&lt;s-list&gt; ::= ()                          empty-s-list ()\n" +
  "         ::= (&lt;s-exp&gt; . &lt;s-list&gt;)        non-empty-s-list (first rest)\n" +
  "&lt;s-exp&gt;  ::= &lt;símbolo&gt;                    symbol-s-exp (sym)\n" +
  "         ::= &lt;s-list&gt;                     s-list-s-exp (slst)";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "declarar-bexp",
      titulo: "1. Expresiones booleanas",
      enunciado:
        "Complete la declaración de <code>bexp</code>. Las variantes y los " +
        "campos ya tienen nombre en la gramática; lo que falta es el " +
        "predicado de cada campo y las dos variantes de los conectivos. " +
        "Que <code>and</code> vaya en medio en la sintaxis concreta no cambia " +
        "nada aquí: el datatype no sabe dónde iba la palabra.",
      gramatica: GRAMATICA_BEXP,
      esqueleto:
        "(define-datatype bexp bexp?\n" +
        "  (true-exp)\n" +
        "  (false-exp)\n" +
        "  (var-exp (nombre ???))\n" +
        "  (not-exp (arg ???))\n" +
        "  ???\n" +
        "  ???)\n",
      pruebas: [
        { llamada: "(bexp? (true-exp))", esperado: "#t" },
        { llamada: "(var-exp 'p)", esperado: "(var-exp p)" },
        { llamada: "(not-exp (and-exp (true-exp) (var-exp 'q)))", esperado: "(not-exp (and-exp (true-exp) (var-exp q)))" },
        { llamada: "(or-exp (false-exp) (not-exp (var-exp 'p)))", esperado: "(or-exp (false-exp) (not-exp (var-exp p)))" },
        { llamada: "(bexp? '(p and q))", esperado: "#f" },
        { llamada: "(bexp? 'true)", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        return "El campo de not-exp y los dos de cada conectivo son " +
          "expresiones booleanas: su predicado es bexp?, el del propio tipo. " +
          "El nombre de una variable es un símbolo.";
      },
      cierre:
        "Seis producciones, seis variantes. Dos sin campos, una con un " +
        "símbolo y tres cuyos campos son del mismo tipo que se está " +
        "declarando: eso es lo que hace recursiva a la gramática y al tipo. " +
        "'true es un símbolo y (p and q) es una lista; ninguno salió de un " +
        "constructor, y bexp? lo sabe."
    },
    {
      id: "declarar-directorio",
      titulo: "2. Un directorio",
      enunciado:
        "Escriba los campos de las dos variantes de <code>entrada</code>. Un " +
        "archivo tiene nombre y tamaño; una carpeta tiene nombre y cero o " +
        "más entradas adentro, que pueden ser archivos u otras carpetas.",
      gramatica: GRAMATICA_DIRECTORIO,
      esqueleto:
        "(define-datatype entrada entrada?\n" +
        "  (archivo-entrada ??? ???)\n" +
        "  (carpeta-entrada ??? ???))\n",
      pruebas: [
        { llamada: "(entrada? (archivo-entrada 'notas 12))", esperado: "#t" },
        { llamada: "(carpeta-entrada 'docs (list (archivo-entrada 'a 1) (carpeta-entrada 'fotos '())))",
          esperado: "(carpeta-entrada docs ((archivo-entrada a 1) (carpeta-entrada fotos ())))" },
        { llamada: "(entrada? (carpeta-entrada 'vacia '()))", esperado: "#t" },
        { llamada: "(entrada? '(archivo a 1))", esperado: "#f" },
        { llamada: "(entrada? 'notas)", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        return "Cada campo va como (nombre predicado). Los puntos suspensivos " +
          "de la gramática son una lista de entradas: (list-of entrada?).";
      },
      cierre:
        "El campo hijos lleva (list-of entrada?), y con eso el constructor " +
        "revisa la lista entera: cada elemento tiene que haber salido de " +
        "archivo-entrada o de carpeta-entrada. La lista vacía cumple, y por " +
        "eso una carpeta sin nada adentro es un valor legal."
    },
    {
      id: "declarar-slist",
      titulo: "3. Dos tipos que se nombran entre sí",
      enunciado:
        "Las s-lists, con la gramática de EOPL §2.4: una lista de " +
        "s-expresiones, donde una s-expresión es un símbolo o una s-list. " +
        "Son dos no terminales y por lo tanto dos datatypes, y cada uno " +
        "tiene un campo del otro tipo. Complete los campos de " +
        "<code>non-empty-s-list</code> y escriba las dos variantes de " +
        "<code>s-exp</code>.",
      gramatica: GRAMATICA_SLIST,
      esqueleto:
        "(define-datatype s-list s-list?\n" +
        "  (empty-s-list)\n" +
        "  (non-empty-s-list (first ???) (rest ???)))\n" +
        "\n" +
        "(define-datatype s-exp s-exp?\n" +
        "  ???\n" +
        "  ???)\n",
      pruebas: [
        { llamada: "(s-list? (empty-s-list))", esperado: "#t" },
        { llamada: "(non-empty-s-list (symbol-s-exp 'a) (empty-s-list))", esperado: "(non-empty-s-list (symbol-s-exp a) (empty-s-list))" },
        { llamada: "(non-empty-s-list (s-list-s-exp (non-empty-s-list (symbol-s-exp 'b) (empty-s-list))) (empty-s-list))",
          esperado: "(non-empty-s-list (s-list-s-exp (non-empty-s-list (symbol-s-exp b) (empty-s-list))) (empty-s-list))" },
        { llamada: "(s-exp? (s-list-s-exp (empty-s-list)))", esperado: "#t" },
        { llamada: "(s-exp? (empty-s-list))", esperado: "#f" },
        { llamada: "(s-list? (symbol-s-exp 'a))", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        return "first es una s-expresión y rest una s-list: los predicados " +
          "son s-exp? y s-list?. Las variantes de s-exp envuelven un símbolo " +
          "o una s-list, con symbol? y s-list?.";
      },
      cierre:
        "s-list nombra a s-exp? antes de que s-exp esté declarado, y " +
        "funciona: el predicado de un campo se consulta cuando se construye " +
        "un valor, no cuando se declara el tipo. Es la misma s-list de la " +
        "primera sesión, la que se recorría con car y cdr; ahora una lista " +
        "vacía y una s-list vacía son valores distintos, y s-list? distingue."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
