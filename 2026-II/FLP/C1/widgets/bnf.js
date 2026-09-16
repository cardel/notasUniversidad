/* Gramáticas BNF. Una gramática con cerradura de Kleene y cerradura positiva,
   y los procedimientos que salen de leerla. El código del estudiante corre
   sobre mini-scheme.js. */
var GRAMATICA =
  "&lt;exp&gt; ::= &lt;número&gt;\n" +
  "      ::= (suma {&lt;exp&gt;}*)\n" +
  "      ::= (mayor {&lt;exp&gt;}+)";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "bnf-reconoce",
      titulo: "1. Cero o más, uno o más",
      enunciado:
        "La gramática tiene dos operaciones y se diferencian en cuántos " +
        "argumentos admiten: la estrella significa cero o más, y la cruz, uno " +
        "o más. Escriba <code>es-exp?</code>, que decide si un valor pertenece " +
        "al conjunto. <code>todas-exp?</code> es el procedimiento que revisa " +
        "una tira de argumentos, y es donde se traduce la cerradura.",
      gramatica: GRAMATICA,
      esqueleto:
        "(define (es-exp? e)\n" +
        "  (cond ((number? e) #t)\n" +
        "        ((not (pair? e)) #f)\n" +
        "        ((eq? (car e) 'suma) ???)\n" +
        "        ((eq? (car e) 'mayor) ???)\n" +
        "        (else #f)))\n" +
        "\n" +
        "(define (todas-exp? lst)\n" +
        "  (cond ((null? lst) #t)\n" +
        "        ((es-exp? (car lst)) ???)\n" +
        "        (else #f)))\n",
      pruebas: [
        { llamada: "(es-exp? 5)", esperado: "#t" },
        { llamada: "(es-exp? '(suma))", esperado: "#t" },
        { llamada: "(es-exp? '(mayor))", esperado: "#f" },
        { llamada: "(es-exp? '(suma 1 (mayor 2 3)))", esperado: "#t" },
        { llamada: "(es-exp? '(resta 1 2))", esperado: "#f" },
        { llamada: "(es-exp? '(suma 1 x))", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(es-exp? '(mayor))" && obtenido === "#t") {
          return "La cruz pide al menos un argumento, así que mayor sin nada " +
            "adentro no pertenece. Ahí hay una condición de más que en suma.";
        }
        if (llamada === "(es-exp? '(suma))" && obtenido === "#f") {
          return "La estrella admite cero argumentos: una suma vacía sigue " +
            "siendo una expresión.";
        }
        if (llamada === "(es-exp? '(suma 1 (mayor 2 3)))" && obtenido === "#f") {
          return "Los argumentos anidados no se están mirando. Cada uno es a " +
            "su vez una expresión y le toca la misma pregunta.";
        }
        return "Las dos cláusulas revisan la tira de argumentos con " +
          "todas-exp?, y una de ellas exige además que no esté vacía.";
      },
      cierre:
        "Las abreviaturas de la notación se vuelven condiciones concretas: la " +
        "estrella no agrega ninguna, la cruz agrega la de no estar vacía. Todo " +
        "lo demás lo decide la recursión sobre los argumentos."
    },
    {
      id: "bnf-evalua",
      titulo: "2. Darle valor a la expresión",
      enunciado:
        "Escriba <code>evalua</code>, que calcula el número que representa una " +
        "expresión. Un número vale por sí mismo; una suma vale la suma de sus " +
        "argumentos y una suma vacía vale cero; un <code>mayor</code> vale el " +
        "mayor de los suyos, y por eso pide al menos uno. Los dos " +
        "procedimientos auxiliares recorren la tira de argumentos.",
      gramatica: GRAMATICA,
      esqueleto:
        "(define (evalua e)\n" +
        "  (cond ((number? e) ???)\n" +
        "        ((eq? (car e) 'suma) (suma-de (cdr e)))\n" +
        "        (else (mayor-de (cdr e)))))\n" +
        "\n" +
        "(define (suma-de lst)\n" +
        "  (if (null? lst)\n" +
        "      ???\n" +
        "      (+ ??? ???)))\n" +
        "\n" +
        "(define (mayor-de lst)\n" +
        "  (if (null? (cdr lst))\n" +
        "      ???\n" +
        "      (max ??? ???)))\n",
      pruebas: [
        { llamada: "(evalua 7)", esperado: "7" },
        { llamada: "(evalua '(suma))", esperado: "0" },
        { llamada: "(evalua '(suma 1 2 3))", esperado: "6" },
        { llamada: "(evalua '(mayor 3))", esperado: "3" },
        { llamada: "(evalua '(suma 1 (mayor 2 5) 3))", esperado: "9" },
        { llamada: "(evalua '(mayor (suma 1 1) 5))", esperado: "5" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(evalua '(suma))" && obtenido !== "0") {
          return "Sumar nada da cero, que es el neutro de la suma. Ese es el " +
            "caso base del recorrido de argumentos.";
        }
        if (llamada === "(evalua '(mayor 3))" && obtenido !== "3") {
          return "Con un solo argumento, el mayor es ese mismo. Como la cruz " +
            "garantiza que hay al menos uno, el caso base es la lista de un " +
            "elemento y no la vacía.";
        }
        if (llamada === "(evalua '(suma 1 (mayor 2 5) 3))" && obtenido === "6") {
          return "El argumento anidado se contó como cero. Cada argumento " +
            "hay que evaluarlo antes de sumarlo.";
        }
        return "Los auxiliares evalúan el primer argumento y lo combinan con " +
          "el resultado del resto.";
      },
      cierre:
        "Esto ya es un intérprete, aunque de un lenguaje diminuto: hay una " +
        "sintaxis definida por una gramática, un recorrido por casos sobre esa " +
        "sintaxis, y un valor por cada forma. Lo que falta para el del curso " +
        "son variables y un ambiente donde buscarlas."
    },
    {
      id: "bnf-cuenta",
      titulo: "3. Contar las operaciones",
      enunciado:
        "Escriba <code>cuenta-operaciones</code>, que dice cuántos nodos de " +
        "operación tiene la expresión. Un número no es una operación; una suma " +
        "o un mayor cuentan como una, más las que traigan sus argumentos. " +
        "Una suma vacía cuenta como una operación aunque no tenga adentro nada " +
        "que contar.",
      gramatica: GRAMATICA,
      esqueleto:
        "(define (cuenta-operaciones e)\n" +
        "  (if (number? e)\n" +
        "      ???\n" +
        "      (+ 1 (cuenta-en-lista (cdr e)))))\n" +
        "\n" +
        "(define (cuenta-en-lista lst)\n" +
        "  (if (null? lst)\n" +
        "      0\n" +
        "      (+ ??? ???)))\n",
      pruebas: [
        { llamada: "(cuenta-operaciones 5)", esperado: "0" },
        { llamada: "(cuenta-operaciones '(suma))", esperado: "1" },
        { llamada: "(cuenta-operaciones '(suma 1 (mayor 2 3)))", esperado: "2" },
        { llamada: "(cuenta-operaciones '(mayor (suma 1) (suma 2)))", esperado: "3" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(cuenta-operaciones 5)" && obtenido !== "0") {
          return "Un número solo no tiene ninguna operación.";
        }
        if (llamada === "(cuenta-operaciones '(suma 1 (mayor 2 3)))" && obtenido === "1") {
          return "Los argumentos no se están recorriendo: el mayor de adentro " +
            "también cuenta.";
        }
        return "Cada elemento de la tira aporta lo suyo, y esos aportes se " +
          "suman.";
      },
      cierre:
        "El uno que se suma antes de recorrer los argumentos es el nodo " +
        "actual. Es el mismo esquema de contar nodos en un árbol, con la " +
        "diferencia de que aquí la cantidad de hijos no está fija."
    },
    {
      id: "bnf-profundidad",
      titulo: "4. Qué tan hondo llega",
      enunciado:
        "Escriba <code>profundidad</code>, que mide cuántos niveles de " +
        "operación tiene la expresión. Un número está a profundidad cero. Una " +
        "operación es uno más la mayor profundidad de sus argumentos, y si no " +
        "tiene argumentos esa mayor profundidad es cero.",
      gramatica: GRAMATICA,
      esqueleto:
        "(define (profundidad e)\n" +
        "  (if (number? e)\n" +
        "      ???\n" +
        "      (+ 1 (mayor-profundidad (cdr e)))))\n" +
        "\n" +
        "(define (mayor-profundidad lst)\n" +
        "  (if (null? lst)\n" +
        "      ???\n" +
        "      (max ??? ???)))\n",
      pruebas: [
        { llamada: "(profundidad 5)", esperado: "0" },
        { llamada: "(profundidad '(suma))", esperado: "1" },
        { llamada: "(profundidad '(suma 1 2))", esperado: "1" },
        { llamada: "(profundidad '(suma 1 (mayor 2 (suma 3))))", esperado: "3" },
        { llamada: "(profundidad '(mayor (suma 1) 9))", esperado: "2" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(profundidad '(suma 1 (mayor 2 (suma 3))))" && obtenido === "6") {
          return "Las profundidades se están sumando. Entre los argumentos se " +
            "toma la mayor, no el total.";
        }
        if (llamada === "(profundidad '(suma))" && obtenido !== "1") {
          return "Sin argumentos, la mayor profundidad de la tira vacía es " +
            "cero, y la operación agrega su propio nivel.";
        }
        return "Cada argumento tiene su profundidad y entre todas gana la más " +
          "grande.";
      },
      cierre:
        "Comparar en vez de sumar es lo que distingue la altura de la " +
        "cantidad, y es la misma decisión que en cualquier árbol. Lo que " +
        "cambia con la cerradura es que el número de ramas no se sabe de " +
        "antemano."
    },
    {
      id: "bnf-hojas",
      titulo: "5. Los números que aparecen",
      enunciado:
        "Escriba <code>hojas</code>, que devuelve la lista de los números que " +
        "aparecen en la expresión, en el orden en que se leen y sin quitar " +
        "repetidos. Un número solo es una lista de un elemento; una operación " +
        "es lo que traigan sus argumentos, uno tras otro.",
      gramatica: GRAMATICA,
      esqueleto:
        "(define (hojas e)\n" +
        "  (if (number? e)\n" +
        "      ???\n" +
        "      (hojas-de (cdr e))))\n" +
        "\n" +
        "(define (hojas-de lst)\n" +
        "  (if (null? lst)\n" +
        "      '()\n" +
        "      (append ??? ???)))\n",
      pruebas: [
        { llamada: "(hojas 5)", esperado: "(5)" },
        { llamada: "(hojas '(suma))", esperado: "()" },
        { llamada: "(hojas '(suma 1 (mayor 2 3)))", esperado: "(1 2 3)" },
        { llamada: "(hojas '(mayor (suma 4 4) 9))", esperado: "(4 4 9)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(hojas 5)" && obtenido === "5") {
          return "El resultado es una lista, así que el número solo se " +
            "devuelve envuelto en una.";
        }
        if (obtenido.indexOf("append esperaba") !== -1) {
          return "append junta listas. Como cada llamada ya devuelve una " +
            "lista, las dos partes entran tal cual.";
        }
        return "Lo que trae el primer argumento va adelante de lo que traiga " +
          "el resto.";
      },
      cierre:
        "Devolver una lista de un elemento en el caso base es lo que permite " +
        "que todos los niveles se junten con la misma operación. Si el caso " +
        "base devolviera el número pelado, cada nivel tendría que preguntar " +
        "qué le llegó."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
