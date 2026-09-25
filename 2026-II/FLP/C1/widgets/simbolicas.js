/* Listas simbólicas y procedimientos como valores. Los símbolos son datos que
   se comparan con eq?, y un procedimiento se pasa como argumento igual que un
   número. El código del estudiante corre sobre mini-scheme.js. */
var RETOS = (function () {
  "use strict";
  return [
    {
      id: "pertenece",
      titulo: "1. Buscar un símbolo en una lista",
      enunciado:
        "Escriba <code>pertenece?</code>, que responde si un símbolo aparece " +
        "en una lista de símbolos. Dos símbolos se comparan con " +
        "<code>eq?</code>, que responde inmediato porque un símbolo no se " +
        "recorre letra por letra: es un dato indivisible.",
      gramatica:
        "&lt;lista-de-símbolos&gt; ::= ()\n" +
        "                    ::= (&lt;símbolo&gt; . &lt;lista-de-símbolos&gt;)",
      esqueleto:
        "(define (pertenece? s lst)\n" +
        "  (cond ((null? lst) ???)\n" +
        "        ((eq? ??? ???) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(pertenece? 'a '(a b c))", esperado: "#t" },
        { llamada: "(pertenece? 'c '(a b c))", esperado: "#t" },
        { llamada: "(pertenece? 'z '(a b c))", esperado: "#f" },
        { llamada: "(pertenece? 'a '())", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(pertenece? 'a '())" && obtenido === "#t") {
          return "En la lista vacía no hay nada, así que la respuesta es " +
            "que no. Ese es el único caso base que decide por su cuenta.";
        }
        if (llamada === "(pertenece? 'c '(a b c))" && obtenido === "#f") {
          return "Se está mirando solo el primer elemento. Cuando el car no " +
            "es el buscado, la pregunta se repite sobre el resto.";
        }
        return "Tres casos: la lista se acabó, el primero es el buscado, o " +
          "hay que seguir buscando en el resto.";
      },
      cierre:
        "Comparar símbolos con <code>eq?</code> cuesta lo mismo sin importar " +
        "cómo se escriban. Por eso los ambientes de los intérpretes guardan " +
        "símbolos y no cadenas: buscar una variable es una comparación " +
        "directa, no un recorrido de caracteres."
    },
    {
      id: "solo-simbolos",
      titulo: "2. Quedarse con lo que es símbolo",
      enunciado:
        "Escriba <code>solo-simbolos</code>, que recibe una lista mezclada y " +
        "devuelve otra con los elementos que son símbolos, en el mismo " +
        "orden. <code>symbol?</code> pregunta por el tipo de un valor. Aquí " +
        "aparece una decisión nueva: cuando un elemento no va, el resultado " +
        "es sencillamente lo que devuelva la llamada, sin agregarle nada.",
      gramatica: null,
      esqueleto:
        "(define (solo-simbolos lst)\n" +
        "  (cond ((null? lst) ???)\n" +
        "        ((symbol? (car lst)) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(solo-simbolos '(a 1 b 2 c))", esperado: "(a b c)" },
        { llamada: "(solo-simbolos '(1 2 3))", esperado: "()" },
        { llamada: "(solo-simbolos '())", esperado: "()" },
        { llamada: "(solo-simbolos '(x y))", esperado: "(x y)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("1") !== -1 || obtenido.indexOf("2") !== -1) {
          return "Los números están pasando. La cláusula que los atrapa " +
            "devuelve la llamada sobre el resto y ya: no los vuelve a poner.";
        }
        if (llamada === "(solo-simbolos '(a 1 b 2 c))" && obtenido === "(a)") {
          return "Se detuvo en el primer número. Descartar un elemento no es " +
            "terminar: la lista sigue después de él.";
        }
        return "Cuando el elemento va, se hace cons con lo que devuelva la " +
          "llamada; cuando no va, se devuelve esa llamada sin más.";
      },
      cierre:
        "Filtrar y transformar tienen el mismo esqueleto y se diferencian en " +
        "una cláusula: aquí hay un caso que no reconstruye nada, y por eso " +
        "la lista que sale puede ser más corta que la que entró."
    },
    {
      id: "sin-repetidos",
      titulo: "3. Quitar los repetidos",
      enunciado:
        "Escriba <code>sin-repetidos</code>, que elimina las apariciones " +
        "sobrantes de cada símbolo. <code>pertenece?</code> viene resuelto y " +
        "se puede usar. De cada símbolo repetido queda <b>la última</b> " +
        "aparición, que es lo que sale solo al preguntar si el primero " +
        "vuelve a aparecer más adelante: por eso <code>(a b a c b)</code> da " +
        "<code>(a c b)</code> y no <code>(a b c)</code>.",
      gramatica: null,
      esqueleto:
        "(define (pertenece? s lst)\n" +
        "  (cond ((null? lst) #f)\n" +
        "        ((eq? s (car lst)) #t)\n" +
        "        (else (pertenece? s (cdr lst)))))\n" +
        "\n" +
        "(define (sin-repetidos lst)\n" +
        "  (cond ((null? lst) ???)\n" +
        "        ((pertenece? ??? ???) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(sin-repetidos '(a b c))", esperado: "(a b c)" },
        { llamada: "(sin-repetidos '(a a a))", esperado: "(a)" },
        { llamada: "(sin-repetidos '(a b a c b))", esperado: "(a c b)" },
        { llamada: "(sin-repetidos '())", esperado: "()" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(sin-repetidos '(a a a))" && obtenido === "(a a a)") {
          return "La consulta se está haciendo sobre la lista entera, donde " +
            "el primero siempre aparece. La pregunta es si vuelve a salir en " +
            "el resto, es decir en el cdr.";
        }
        if (llamada === "(sin-repetidos '(a b a c b))" && obtenido === "(a b c)") {
          return "Está quedando la primera aparición. Con esta forma de " +
            "resolverlo, el que se descarta es el de adelante cuando el " +
            "símbolo reaparece más atrás.";
        }
        return "Si el primero vuelve a aparecer en el resto, se descarta y " +
          "se sigue; si no, se conserva con cons.";
      },
      cierre:
        "El procedimiento del reto anterior se usó como una prueba más, sin " +
        "reescribirlo. Ese es el trato con los procedimientos: una vez " +
        "definido, un nombre vale tanto como una primitiva del lenguaje."
    },
    {
      id: "aplana",
      titulo: "4. Aplanar una lista simbólica",
      enunciado:
        "Escriba <code>aplana</code>, que recibe una s-list y devuelve la " +
        "lista de todos sus símbolos, sin anidamiento, en el orden en que " +
        "aparecen. Cada elemento es o un símbolo o una s-list, y eso da tres " +
        "cláusulas. Cuando el primero es a su vez una lista, sus símbolos " +
        "van adelante de los que traiga el resto, y para juntar dos listas " +
        "está <code>append</code>.",
      gramatica:
        "&lt;s-list&gt; ::= ()\n" +
        "         ::= (&lt;s-exp&gt; . &lt;s-list&gt;)\n" +
        "&lt;s-exp&gt;  ::= &lt;símbolo&gt; | &lt;s-list&gt;",
      esqueleto:
        "(define (aplana lst)\n" +
        "  (cond ((null? lst) ???)\n" +
        "        ((symbol? (car lst)) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(aplana '())", esperado: "()" },
        { llamada: "(aplana '(a b))", esperado: "(a b)" },
        { llamada: "(aplana '((a) ((b c))))", esperado: "(a b c)" },
        { llamada: "(aplana '(a (b (c)) d))", esperado: "(a b c d)" },
        { llamada: "(aplana '(() (a)))", esperado: "(a)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("(") !== obtenido.lastIndexOf("(")) {
          return "Quedó anidamiento en la salida. Cuando el primero es una " +
            "lista hay que aplanarlo y unir con append, no ponerlo con cons.";
        }
        if (llamada === "(aplana '(a (b (c)) d))" && obtenido === "(a d)") {
          return "Las listas de adentro se están descartando. Ese caso " +
            "aplana el car y le pega adelante lo que traiga el cdr.";
        }
        return "Tres cláusulas: lista vacía, primero símbolo, primero lista. " +
          "Las dos últimas se distinguen por cómo juntan: una con cons y la " +
          "otra con append.";
      },
      cierre:
        "La gramática nombra dos conjuntos y el procedimiento tiene una " +
        "cláusula por cada forma posible del primer elemento. La recursión " +
        "sobre el car es lo que le da fondo al anidamiento; la del cdr, lo " +
        "que lo recorre a lo ancho."
    },
    {
      id: "mapea",
      titulo: "5. Un procedimiento como argumento",
      enunciado:
        "Escriba <code>mapea</code>, que aplica un procedimiento a cada " +
        "elemento de una lista y devuelve la lista de los resultados. El " +
        "parámetro <code>f</code> no tiene nada de especial: se usa " +
        "poniéndolo en la primera posición de un paréntesis, igual que " +
        "cualquier otro procedimiento.",
      gramatica: null,
      esqueleto:
        "(define (mapea f lst)\n" +
        "  (if (null? lst)\n" +
        "      ???\n" +
        "      (cons ??? ???)))\n",
      pruebas: [
        { llamada: "(mapea add1 '(1 2 3))", esperado: "(2 3 4)" },
        { llamada: "(mapea car '((a b) (c d)))", esperado: "(a c)" },
        { llamada: "(mapea (lambda (x) (list x x)) '(a b))", esperado: "((a a) (b b))" },
        { llamada: "(mapea symbol? '(a 1))", esperado: "(#t #f)" },
        { llamada: "(mapea add1 '())", esperado: "()" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("no es un procedimiento") !== -1) {
          return "Para aplicar f hay que ponerlo en posición de llamada, es " +
            "decir escribir (f algo). Nombrarlo suelto solo entrega el " +
            "procedimiento sin usarlo.";
        }
        if (llamada === "(mapea add1 '(1 2 3))" && obtenido === "(1 2 3)") {
          return "La lista pasó intacta: f nunca se aplicó al elemento.";
        }
        return "El primer argumento de cons es f aplicado al car; el " +
          "segundo, la llamada sobre el cdr.";
      },
      cierre:
        "Que un procedimiento entre y salga como cualquier otro valor es lo " +
        "que hace falta para representar clausuras más adelante: un " +
        "procedimiento del lenguaje interpretado terminará siendo un dato " +
        "guardado en un ambiente."
    },
    {
      id: "filtra",
      titulo: "6. Un predicado como argumento",
      enunciado:
        "Escriba <code>filtra</code>, que conserva los elementos para los " +
        "que el predicado responde verdadero. Es el reto de los símbolos " +
        "otra vez, con la diferencia de que ahora la condición llega desde " +
        "afuera en lugar de estar escrita en el código.",
      gramatica: null,
      esqueleto:
        "(define (filtra p lst)\n" +
        "  (cond ((null? lst) ???)\n" +
        "        ((p (car lst)) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(filtra odd? '(1 2 3 4 5))", esperado: "(1 3 5)" },
        { llamada: "(filtra symbol? '(a 1 b))", esperado: "(a b)" },
        { llamada: "(filtra (lambda (x) (> x 2)) '(1 2 3 4))", esperado: "(3 4)" },
        { llamada: "(filtra number? '(a b))", esperado: "()" },
        { llamada: "(filtra odd? '())", esperado: "()" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(filtra odd? '(1 2 3 4 5))" && obtenido === "(1 2 3 4 5)") {
          return "Están pasando todos. La cláusula del else devuelve la " +
            "llamada sobre el resto sin conservar el elemento.";
        }
        if (obtenido === "#t" || obtenido === "#f") {
          return "El resultado es una lista, no la respuesta del predicado. " +
            "La condición decide qué se hace, no qué se devuelve.";
        }
        return "Mismo esqueleto que quedarse con los símbolos, con p en " +
          "lugar de symbol?.";
      },
      cierre:
        "Con <code>mapea</code> y <code>filtra</code> escritos, dos de los " +
        "tres recorridos habituales sobre listas quedan expresados una sola " +
        "vez. El que falta acumula un resultado en vez de construir una " +
        "lista, y es el mismo acumulador de la recursión de cola."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
