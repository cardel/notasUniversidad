/* Construir el árbol a mano. Programas del lenguaje del curso escritos en
   sintaxis concreta, y para cada uno la expresión con los constructores que
   arma su árbol; el árbol esperado va dibujado bajo cada prueba y, si el
   código construye otro, aparece al lado. Al cierre, un recorrido que
   devuelve las hojas. El código corre sobre mini-scheme.js. */
var GRAMATICA =
  "&lt;expresion&gt; ::= &lt;number&gt;                                   const-exp (num)\n" +
  "            ::= &lt;identifier&gt;                               var-exp (id)\n" +
  "            ::= (- &lt;expresion&gt; &lt;expresion&gt;)                 diff-exp (exp1 exp2)\n" +
  "            ::= (zero? &lt;expresion&gt;)                         zero?-exp (exp1)\n" +
  "            ::= (if &lt;expresion&gt; then &lt;expresion&gt; else &lt;expresion&gt;)   if-exp (exp1 exp2 exp3)\n" +
  "            ::= (let &lt;identifier&gt; = &lt;expresion&gt; in &lt;expresion&gt;)     let-exp (id exp1 body)";

var DATATYPE =
  "(define-datatype expresion expresion?\n" +
  "  (const-exp (num number?))\n" +
  "  (var-exp   (id symbol?))\n" +
  "  (diff-exp  (exp1 expresion?) (exp2 expresion?))\n" +
  "  (zero?-exp (exp1 expresion?))\n" +
  "  (if-exp    (exp1 expresion?) (exp2 expresion?) (exp3 expresion?))\n" +
  "  (let-exp   (id symbol?) (exp1 expresion?) (body expresion?)))\n";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "construir-resta",
      titulo: "1. Una resta dentro de otra",
      enunciado:
        "Escriba con los constructores el árbol del programa " +
        "<code>(- (- a b) 4)</code>. Cada número y cada identificador que se " +
        "usa va envuelto en su variante; el orden de los campos es el orden " +
        "del programa.",
      gramatica: GRAMATICA,
      arbol: true,
      esqueleto:
        DATATYPE + "\n" +
        "(define e1 ???)\n",
      pruebas: [
        { llamada: "e1", esperado: "(diff-exp (diff-exp (var-exp a) (var-exp b)) (const-exp 4))" },
        { llamada: "(expresion? e1)", esperado: "#t" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "(diff-exp (const-exp 4) (diff-exp (var-exp a) (var-exp b)))") {
          return "Los operandos quedaron al revés. El primer campo de " +
            "diff-exp es lo que va primero en el programa: la resta interior.";
        }
        if (obtenido === "(diff-exp (diff-exp (var-exp b) (var-exp a)) (const-exp 4))") {
          return "La resta interior tiene a antes que b, y el árbol guarda " +
            "ese orden.";
        }
        return "La raíz es diff-exp con dos campos: el primero es otra " +
          "diff-exp sobre (var-exp 'a) y (var-exp 'b); el segundo, " +
          "(const-exp 4). Los símbolos van con comilla.";
      },
      cierre:
        "Dos niveles de diff-exp y tres hojas envueltas. Compare el árbol " +
        "dibujado con el programa: los paréntesis del programa son los " +
        "niveles del árbol, y no hay ninguna hoja que diga menos."
    },
    {
      id: "construir-if",
      titulo: "2. Un if con una resta en la prueba",
      enunciado:
        "El árbol de <code>(if (zero? (- n 1)) then n else 0)</code>. Las " +
        "palabras <code>then</code> y <code>else</code> no aparecen en el " +
        "árbol; lo que sí queda es el orden: prueba, consecuente, " +
        "alternativa.",
      gramatica: GRAMATICA,
      arbol: true,
      esqueleto:
        DATATYPE + "\n" +
        "(define e2 ???)\n",
      pruebas: [
        { llamada: "e2", esperado: "(if-exp (zero?-exp (diff-exp (var-exp n) (const-exp 1))) (var-exp n) (const-exp 0))" },
        { llamada: "(expresion? e2)", esperado: "#t" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "(if-exp (zero?-exp (diff-exp (var-exp n) (const-exp 1))) (const-exp 0) (var-exp n))") {
          return "Las ramas están cambiadas: el segundo campo es lo que va " +
            "después de then y el tercero lo que va después de else.";
        }
        if (obtenido === "(if-exp (zero?-exp (var-exp n) (const-exp 1)) (var-exp n) (const-exp 0))") {
          return "zero?-exp tiene un solo campo, y ese campo es la resta " +
            "completa: (diff-exp (var-exp 'n) (const-exp 1)).";
        }
        return "if-exp con tres campos: la prueba es un zero?-exp cuyo " +
          "campo es una diff-exp; el consecuente es (var-exp 'n) y la " +
          "alternativa (const-exp 0).";
      },
      cierre:
        "Cuatro niveles: if-exp, zero?-exp, diff-exp y las hojas. En el " +
        "dibujo se ve que la prueba es el subárbol más hondo, y que then y " +
        "else no dejaron rastro: el orden de los tres hijos ya dice cuál es " +
        "cuál."
    },
    {
      id: "construir-let",
      titulo: "3. Dos let anidados",
      enunciado:
        "El árbol de <code>(let a = 2 in (let b = (- a 1) in (if (zero? b) " +
        "then a else b)))</code>. El identificador que cada <code>let</code> " +
        "declara es un símbolo suelto, sin envolver, porque se declara y no " +
        "se evalúa; las ocurrencias de <code>a</code> y <code>b</code> " +
        "dentro de las expresiones sí van en <code>var-exp</code>.",
      gramatica: GRAMATICA,
      arbol: true,
      esqueleto:
        DATATYPE + "\n" +
        "(define e3 ???)\n",
      pruebas: [
        { llamada: "e3", esperado: "(let-exp a (const-exp 2) (let-exp b (diff-exp (var-exp a) (const-exp 1)) (if-exp (zero?-exp (var-exp b)) (var-exp a) (var-exp b))))" },
        { llamada: "(expresion? e3)", esperado: "#t" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "(let-exp a (let-exp b (diff-exp (var-exp a) (const-exp 1)) (if-exp (zero?-exp (var-exp b)) (var-exp a) (var-exp b))) (const-exp 2))") {
          return "En el let de afuera se intercambiaron la expresión ligada y " +
            "el cuerpo: el segundo campo es lo que va después del igual, " +
            "(const-exp 2), y el tercero lo que va después de in.";
        }
        return "let-exp con tres campos: el símbolo 'a, la expresión ligada " +
          "(const-exp 2) y como cuerpo otro let-exp, que a su vez tiene por " +
          "cuerpo un if-exp.";
      },
      cierre:
        "Los dos let se encadenan por el campo body, y las hojas a y b " +
        "aparecen dos veces con formas distintas: sueltas donde se declaran " +
        "y dentro de var-exp donde se usan. En el dibujo se distinguen a " +
        "simple vista."
    },
    {
      id: "declarar-desde-arbol",
      titulo: "4. El datatype que construye estos árboles",
      enunciado:
        "Un lenguaje de figuras que no se ha visto, y de él solo se tienen " +
        "los árboles de las pruebas, dibujados abajo. Complete los campos de " +
        "cada variante leyéndolos del árbol: cuántos hijos tiene el nodo, y " +
        "si cada hijo es una hoja con un número, una hoja con una palabra, " +
        "otra figura o una lista de figuras. Los nombres de los campos los " +
        "escoge usted.",
      gramatica:
        "El árbol dice qué va en cada campo:\n\n" +
        "  una hoja con un número          number?\n" +
        "  una hoja con una palabra        symbol?\n" +
        "  un nodo del mismo lenguaje      figura?\n" +
        "  el nodo lista                   (list-of figura?)",
      arbol: true,
      esqueleto:
        "(define-datatype figura figura?\n" +
        "  (vacia-fig)\n" +
        "  (circulo-fig ???)\n" +
        "  (cuadrado-fig ???)\n" +
        "  (color-fig ??? ???)\n" +
        "  (encima-fig ??? ???)\n" +
        "  (repetir-fig ??? ???)\n" +
        "  (grupo-fig ???))\n",
      pruebas: [
        { llamada: "(figura? (vacia-fig))", esperado: "#t" },
        { llamada: "(circulo-fig 3)", esperado: "(circulo-fig 3)" },
        { llamada: "(encima-fig (circulo-fig 3) (cuadrado-fig 5))", esperado: "(encima-fig (circulo-fig 3) (cuadrado-fig 5))" },
        { llamada: "(repetir-fig 4 (circulo-fig 2))", esperado: "(repetir-fig 4 (circulo-fig 2))" },
        { llamada: "(color-fig 'rojo (cuadrado-fig 5))", esperado: "(color-fig rojo (cuadrado-fig 5))" },
        { llamada: "(grupo-fig (list (circulo-fig 1) (cuadrado-fig 2) (vacia-fig)))", esperado: "(grupo-fig ((circulo-fig 1) (cuadrado-fig 2) (vacia-fig)))" },
        { llamada: "(grupo-fig '())", esperado: "(grupo-fig ())" },
        { llamada: "(figura? '(circulo-fig 3))", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        return "Cuente los hijos de cada nodo en el árbol dibujado y mire " +
          "qué es cada uno. Cuando el predicado no corresponde, el " +
          "constructor lo dice con el nombre del campo y el valor que " +
          "recibió; cuando sobran o faltan campos, lo dice con el número de " +
          "argumentos.";
      },
      cierre:
        "Con el datatype escrito ya se tiene la gramática: cada variante es " +
        "una producción, cada campo un no terminal o un terminal con " +
        "información, y el campo con list-of, unos puntos suspensivos. Lo " +
        "único que el árbol no dice es cómo se escriben los programas: si el " +
        "círculo se teclea (circulo 3), circulo(3) o 3 circulo. Esa decisión " +
        "es de la sintaxis concreta, y la toman el parser y el unparser."
    },
    {
      id: "hojas",
      titulo: "5. Las hojas, de izquierda a derecha",
      enunciado:
        "Escriba <code>hojas</code>, que devuelve la lista de las hojas del " +
        "árbol en el orden en que se leen: los números, los identificadores " +
        "que se usan y los identificadores que un <code>let</code> declara. " +
        "Es un recorrido con <code>cases</code> que junta con " +
        "<code>append</code> las listas de los hijos.",
      gramatica: GRAMATICA,
      esqueleto:
        DATATYPE + "\n" +
        "(define e1 (diff-exp (diff-exp (var-exp 'a) (var-exp 'b)) (const-exp 4)))\n" +
        "(define e2 (if-exp (zero?-exp (diff-exp (var-exp 'n) (const-exp 1)))\n" +
        "               (var-exp 'n) (const-exp 0)))\n" +
        "(define e3 (let-exp 'a (const-exp 2)\n" +
        "             (let-exp 'b (diff-exp (var-exp 'a) (const-exp 1))\n" +
        "               (if-exp (zero?-exp (var-exp 'b)) (var-exp 'a) (var-exp 'b)))))\n" +
        "\n" +
        "(define (hojas e)\n" +
        "  (cases expresion e\n" +
        "    (const-exp (num) ???)\n" +
        "    (var-exp (id) ???)\n" +
        "    (diff-exp (exp1 exp2) ???)\n" +
        "    (zero?-exp (exp1) ???)\n" +
        "    (if-exp (exp1 exp2 exp3) ???)\n" +
        "    (let-exp (id exp1 body) ???)))\n",
      pruebas: [
        { llamada: "(hojas (const-exp 7))", esperado: "(7)" },
        { llamada: "(hojas e1)", esperado: "(a b 4)" },
        { llamada: "(hojas e2)", esperado: "(n 1 n 0)" },
        { llamada: "(hojas e3)", esperado: "(a 2 b a 1 b a b)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(hojas e3)" && obtenido === "(2 a 1 b a b)") {
          return "Los identificadores que los let declaran no están en la " +
            "lista. En let-exp, id es un símbolo suelto: se pone con " +
            "(list id) delante de lo demás.";
        }
        if (llamada === "(hojas e1)" && obtenido === "(4 b a)") {
          return "El orden se invirtió: las hojas del primer campo van " +
            "antes que las del segundo, (append (hojas exp1) (hojas exp2)).";
        }
        if (llamada === "(hojas (const-exp 7))" && obtenido === "7") {
          return "hojas devuelve una lista aunque haya una sola hoja: " +
            "(list num), para que append pueda juntarla con las demás.";
        }
        return "Las hojas devuelven una lista de un elemento. Las demás " +
          "cláusulas juntan con append las listas de sus hijos, en orden; " +
          "en let-exp el id va primero, como (list id).";
      },
      cierre:
        "La lista de hojas es el programa sin andamiaje ni paréntesis: lo " +
        "que quedaría si se leyera el árbol de izquierda a derecha. Dos " +
        "árboles distintos pueden tener las mismas hojas, y por eso las " +
        "hojas solas no bastan para recuperar el programa: la estructura " +
        "está en los nodos."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
