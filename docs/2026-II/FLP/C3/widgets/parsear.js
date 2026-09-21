/* Parser y unparser con sintaxis infija. Las expresiones booleanas se
   escriben con el conectivo en medio, (p and q), y el parser tiene que
   buscar la palabra clave en la segunda posición. El árbol esperado va
   dibujado bajo cada prueba y, si el código construye otro, aparece al lado.
   El código corre sobre mini-scheme.js. */
var GRAMATICA =
  "&lt;bexp&gt; ::= true                          true-exp ()\n" +
  "       ::= false                         false-exp ()\n" +
  "       ::= &lt;símbolo&gt;                      var-exp (nombre)\n" +
  "       ::= (not &lt;bexp&gt;)                   not-exp (arg)\n" +
  "       ::= (&lt;bexp&gt; and &lt;bexp&gt;)            and-exp (izq der)\n" +
  "       ::= (&lt;bexp&gt; or &lt;bexp&gt;)             or-exp (izq der)\n" +
  "\n" +
  "&lt;símbolo&gt; es cualquier símbolo distinto de true y false.";

var DATATYPE =
  "(define-datatype bexp bexp?\n" +
  "  (true-exp)\n" +
  "  (false-exp)\n" +
  "  (var-exp   (nombre symbol?))\n" +
  "  (not-exp   (arg bexp?))\n" +
  "  (and-exp   (izq bexp?) (der bexp?))\n" +
  "  (or-exp    (izq bexp?) (der bexp?)))\n";

var PARSE_COMPLETO =
  "(define (parse-bexp d)\n" +
  "  (cond ((symbol? d) (parse-simbolo d))\n" +
  "        ((eq? (car d) 'not) (not-exp (parse-bexp (cadr d))))\n" +
  "        ((eq? (cadr d) 'and) (and-exp (parse-bexp (car d)) (parse-bexp (caddr d))))\n" +
  "        ((eq? (cadr d) 'or) (or-exp (parse-bexp (car d)) (parse-bexp (caddr d))))\n" +
  "        (else (error \"no es una expresión booleana:\" d))))\n" +
  "\n" +
  "(define (parse-simbolo d)\n" +
  "  (cond ((eq? d 'true) (true-exp))\n" +
  "        ((eq? d 'false) (false-exp))\n" +
  "        (else (var-exp d))))\n";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "parse-hojas",
      titulo: "1. Las hojas y el not",
      enunciado:
        "Escriba las cláusulas de <code>parse-bexp</code> para los símbolos " +
        "y para <code>not</code>. Un símbolo puede ser <code>true</code>, " +
        "<code>false</code> o una variable, y la gramática los distingue: " +
        "dentro de la cláusula del símbolo hay que preguntar cuál de los " +
        "tres es antes de construir.",
      gramatica: GRAMATICA,
      arbol: true,
      esqueleto:
        DATATYPE + "\n" +
        "(define (parse-bexp d)\n" +
        "  (cond ((symbol? d) ???)\n" +
        "        ((eq? (car d) 'not) ???)\n" +
        "        (else (error \"no es una expresión booleana:\" d))))\n",
      pruebas: [
        { llamada: "(parse-bexp 'true)", esperado: "(true-exp)" },
        { llamada: "(parse-bexp 'false)", esperado: "(false-exp)" },
        { llamada: "(parse-bexp 'p)", esperado: "(var-exp p)" },
        { llamada: "(parse-bexp '(not p))", esperado: "(not-exp (var-exp p))" },
        { llamada: "(parse-bexp '(not (not false)))", esperado: "(not-exp (not-exp (false-exp)))" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(parse-bexp 'true)" && obtenido === "(var-exp true)") {
          return "true es un símbolo, pero la gramática lo nombra aparte. " +
            "Dentro de la cláusula del símbolo hay que preguntar primero si " +
            "es true o false, y solo si no, construir var-exp.";
        }
        return "En la cláusula del símbolo va un cond con tres salidas: " +
          "(true-exp), (false-exp) o (var-exp d). En la del not, el " +
          "constructor not-exp sobre el parse de (cadr d).";
      },
      cierre:
        "Dos palabras reservadas que también son símbolos: el orden de las " +
        "preguntas decide. Primero se reconocen true y false, y lo que no " +
        "sea ninguno de los dos es una variable. Es la única parte del " +
        "parser donde el orden de las cláusulas cambia el resultado."
    },
    {
      id: "parse-infijo",
      titulo: "2. El conectivo en medio",
      enunciado:
        "Agregue las cláusulas de <code>and</code> y <code>or</code>. En la " +
        "sintaxis concreta la palabra va en medio, así que la pregunta no es " +
        "sobre <code>(car d)</code>. Decida qué posición se mira y de qué " +
        "posiciones salen los dos operandos.",
      gramatica: GRAMATICA,
      arbol: true,
      esqueleto:
        DATATYPE + "\n" +
        "(define (parse-bexp d)\n" +
        "  (cond ((symbol? d) (parse-simbolo d))\n" +
        "        ((eq? (car d) 'not) (not-exp (parse-bexp (cadr d))))\n" +
        "        ((eq? ??? 'and) ???)\n" +
        "        ((eq? ??? 'or) ???)\n" +
        "        (else (error \"no es una expresión booleana:\" d))))\n" +
        "\n" +
        "(define (parse-simbolo d)\n" +
        "  (cond ((eq? d 'true) (true-exp))\n" +
        "        ((eq? d 'false) (false-exp))\n" +
        "        (else (var-exp d))))\n",
      pruebas: [
        { llamada: "(parse-bexp '(p and q))", esperado: "(and-exp (var-exp p) (var-exp q))" },
        { llamada: "(parse-bexp '(true or p))", esperado: "(or-exp (true-exp) (var-exp p))" },
        { llamada: "(parse-bexp '((not p) or false))", esperado: "(or-exp (not-exp (var-exp p)) (false-exp))" },
        { llamada: "(parse-bexp '(p and (q or (not r))))", esperado: "(and-exp (var-exp p) (or-exp (var-exp q) (not-exp (var-exp r))))" },
        { llamada: "(parse-bexp '(not (p and q)))", esperado: "(not-exp (and-exp (var-exp p) (var-exp q)))" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("(var-exp and)") !== -1 || obtenido.indexOf("(var-exp or)") !== -1) {
          return "La palabra clave entró como operando: quedó un var-exp con " +
            "nombre and. En la forma infija la palabra está en (cadr d), y " +
            "los operandos están a cada lado de ella.";
        }
        if (llamada === "(parse-bexp '(p and q))" && obtenido === "(and-exp (var-exp q) (var-exp p))") {
          return "Los lados quedaron al revés. El campo izq es lo que va " +
            "antes de la palabra, (car d), y der lo que va después, (caddr d).";
        }
        return "La palabra clave está en (cadr d). El operando izquierdo " +
          "es (car d) y el derecho (caddr d), y los dos se parsean.";
      },
      cierre:
        "El parser mira (cadr d) para los conectivos y (car d) para el not, " +
        "y los operandos salen de (car d) y (caddr d). Compare el árbol de " +
        "(p and q) con el de un (- x 1) del lenguaje del curso: la palabra " +
        "clave cambió de posición y el árbol tiene la misma forma. La " +
        "sintaxis abstracta no sabe dónde iba la palabra."
    },
    {
      id: "unparse-infijo",
      titulo: "3. Del árbol al texto, y la ida y vuelta",
      enunciado:
        "Escriba <code>unparse-bexp</code>, que devuelve la sintaxis " +
        "concreta del árbol, con el conectivo en medio. Las dos últimas " +
        "pruebas hacen el viaje completo: parsear y desparsear devuelve el " +
        "programa con el que se empezó, y al revés devuelve el árbol.",
      gramatica: GRAMATICA,
      arbol: true,
      esqueleto:
        DATATYPE + "\n" + PARSE_COMPLETO + "\n" +
        "(define (unparse-bexp b)\n" +
        "  (cases bexp b\n" +
        "    (true-exp () 'true)\n" +
        "    (false-exp () ???)\n" +
        "    (var-exp (nombre) ???)\n" +
        "    (not-exp (arg) ???)\n" +
        "    (and-exp (izq der) ???)\n" +
        "    (or-exp (izq der) ???)))\n",
      pruebas: [
        { llamada: "(unparse-bexp (var-exp 'p))", esperado: "p" },
        { llamada: "(unparse-bexp (and-exp (var-exp 'p) (not-exp (var-exp 'q))))", esperado: "(p and (not q))" },
        { llamada: "(unparse-bexp (or-exp (true-exp) (and-exp (var-exp 'a) (var-exp 'b))))", esperado: "(true or (a and b))" },
        { llamada: "(unparse-bexp (parse-bexp '((p and q) or (not (r and false)))))", esperado: "((p and q) or (not (r and false)))" },
        { llamada: "(parse-bexp (unparse-bexp (not-exp (or-exp (var-exp 'p) (false-exp)))))", esperado: "(not-exp (or-exp (var-exp p) (false-exp)))" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "(and p (not q))" || obtenido === "(or true (and a b))") {
          return "Salió con el conectivo adelante. La sintaxis concreta es " +
            "infija: (list (unparse-bexp izq) 'and (unparse-bexp der)). El " +
            "árbol no guarda dónde iba la palabra; eso lo repone unparse.";
        }
        if (llamada === "(unparse-bexp (and-exp (var-exp 'p) (not-exp (var-exp 'q))))" && obtenido === "(p and (not (var-exp q)))") {
          return "El argumento del not quedó sin desparsear. Cada campo que " +
            "es un bexp pasa por unparse-bexp antes de entrar a la lista.";
        }
        if (llamada === "(unparse-bexp (var-exp 'p))" && obtenido === "(var-exp p)") {
          return "unparse de una variable es su nombre, el símbolo suelto: " +
            "el campo nombre ya lo trae.";
        }
        return "Las hojas devuelven un símbolo: 'true, 'false o nombre. El " +
          "not devuelve (list 'not …) y los conectivos una lista de tres " +
          "con la palabra en medio, con cada lado ya desparseado.";
      },
      cierre:
        "unparse repone el andamiaje en el lugar que la gramática dice, y " +
        "por eso la ida y vuelta devuelve el mismo programa: el árbol guardó " +
        "todo lo que llevaba información y la gramática dice dónde va el " +
        "resto. Si mañana el lenguaje pasa a escribir (and p q), cambian " +
        "parse y unparse; el datatype y todo lo que trabaja sobre él se " +
        "quedan como están."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
