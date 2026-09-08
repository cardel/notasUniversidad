/* Condicionales: if y cond. La misma decisión escrita de las dos maneras, y
   los casos donde una de las dos es claramente la que corresponde. El código
   del estudiante corre sobre mini-scheme.js. */
var RETOS = (function () {
  "use strict";
  return [
    {
      id: "mayor-if",
      titulo: "1. Tres números, con if anidado",
      enunciado:
        "Escriba <code>mayor-de-tres</code> usando solamente <code>if</code>, " +
        "sin <code>max</code>. Un <code>if</code> decide entre dos cosas, así " +
        "que para escoger entre tres hace falta poner uno dentro de otro. " +
        "Fíjese en dónde queda cada rama, porque ese anidamiento es " +
        "justamente lo que <code>cond</code> viene a aplanar.",
      gramatica: null,
      esqueleto:
        "(define (mayor-de-tres a b c)\n" +
        "  (if (> a b)\n" +
        "      (if ??? ??? ???)\n" +
        "      (if ??? ??? ???)))\n",
      pruebas: [
        { llamada: "(mayor-de-tres 3 9 5)", esperado: "9" },
        { llamada: "(mayor-de-tres 9 3 5)", esperado: "9" },
        { llamada: "(mayor-de-tres 1 2 8)", esperado: "8" },
        { llamada: "(mayor-de-tres 4 4 4)", esperado: "4" },
        { llamada: "(mayor-de-tres -1 -7 -3)", esperado: "-1" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(mayor-de-tres 1 2 8)" && obtenido === "2") {
          return "El tercer número no se está comparando. En cada rama " +
            "quedan dos candidatos y falta enfrentarlos.";
        }
        if (llamada === "(mayor-de-tres 3 9 5)" && obtenido === "3") {
          return "Se está devolviendo el primero sin comparar. La prueba de " +
            "afuera ya decidió cuál de a y b sobrevive; la de adentro lo " +
            "enfrenta con c.";
        }
        return "Cuando a supera a b, los que quedan son a y c; cuando no, " +
          "son b y c.";
      },
      cierre:
        "Dos <code>if</code> anidados sirven para tres casos, tres para " +
        "cuatro, y de ahí en adelante la sangría crece más rápido que la " +
        "lógica. Ese es el problema que resuelve la forma que sigue."
    },
    {
      id: "mayor-cond",
      titulo: "2. El mismo, con cond",
      enunciado:
        "Ahora <code>mayor-de-tres</code> con <code>cond</code>, que prueba " +
        "sus cláusulas en orden y se queda con la primera verdadera. Las tres " +
        "condiciones quedan al mismo nivel en lugar de una dentro de otra, y " +
        "cada una dice directamente cuándo gana su candidato.",
      gramatica: null,
      esqueleto:
        "(define (mayor-de-tres a b c)\n" +
        "  (cond (??? a)\n" +
        "        (??? b)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(mayor-de-tres 3 9 5)", esperado: "9" },
        { llamada: "(mayor-de-tres 9 3 5)", esperado: "9" },
        { llamada: "(mayor-de-tres 1 2 8)", esperado: "8" },
        { llamada: "(mayor-de-tres 4 4 4)", esperado: "4" },
        { llamada: "(mayor-de-tres -1 -7 -3)", esperado: "-1" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(mayor-de-tres 4 4 4)" && obtenido !== "4") {
          return "Con los tres iguales ninguna comparación estricta se " +
            "cumple y todo cae en el else. Ahí conviene que las condiciones " +
            "admitan la igualdad.";
        }
        if (llamada === "(mayor-de-tres 1 2 8)" && obtenido === "2") {
          return "La segunda cláusula se está cumpliendo antes de tiempo: " +
            "para devolver b hay que exigir que supere a los otros dos.";
        }
        return "Cada cláusula pide que su candidato no sea superado por " +
          "ninguno de los otros dos, y el else recoge lo que quede.";
      },
      cierre:
        "Las mismas tres decisiones, sin anidar. <code>cond</code> no agrega " +
        "poder al lenguaje: es una abreviatura de <code>if</code> anidados, y " +
        "por eso un intérprete puede implementarla traduciéndola a ellos."
    },
    {
      id: "precio",
      titulo: "3. Un if en mitad de una cuenta",
      enunciado:
        "Escriba <code>precio</code>, que le resta un descuento de cinco al " +
        "precio base cuando la persona es socia y no le resta nada cuando no " +
        "lo es. Se pide con un solo <code>if</code>, y adentro de la resta: " +
        "en Racket <code>if</code> no es una instrucción sino una expresión " +
        "que produce un valor, así que puede ir donde vaya un número.",
      gramatica: null,
      esqueleto:
        "(define (precio base socio?)\n" +
        "  (- base (if ??? ??? ???)))\n",
      pruebas: [
        { llamada: "(precio 20 #t)", esperado: "15" },
        { llamada: "(precio 20 #f)", esperado: "20" },
        { llamada: "(precio 5 #t)", esperado: "0" },
        { llamada: "(precio 100 #f)", esperado: "100" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(precio 20 #f)" && obtenido === "15") {
          return "El descuento se está aplicando siempre. La rama del no " +
            "tiene que valer cero, que restado no cambia nada.";
        }
        if (llamada === "(precio 20 #t)" && obtenido === "20") {
          return "Las dos ramas están dando lo mismo. Una vale cinco y la " +
            "otra cero.";
        }
        return "Lo que decide el if no es si se resta, sino cuánto se resta.";
      },
      cierre:
        "Que <code>if</code> devuelva un valor es lo que permite ponerlo " +
        "adentro de otra expresión, y es también la razón por la que sus dos " +
        "ramas son obligatorias: una expresión siempre tiene que producir " +
        "algo, pase lo que pase."
    },
    {
      id: "clasifica",
      titulo: "4. Cuatro rangos, y el orden decide",
      enunciado:
        "Escriba <code>clasifica</code>, que traduce una calificación de 0 a " +
        "100 en un símbolo: <code>excelente</code> desde 90, " +
        "<code>bueno</code> desde 80, <code>aceptable</code> desde 60 y " +
        "<code>insuficiente</code> por debajo. Como las cláusulas se prueban " +
        "en orden, cada una solo necesita su propio límite inferior: las " +
        "anteriores ya descartaron lo que estaba por encima.",
      gramatica: null,
      esqueleto:
        "(define (clasifica n)\n" +
        "  (cond (??? ???)\n" +
        "        (??? ???)\n" +
        "        (??? ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(clasifica 95)", esperado: "excelente" },
        { llamada: "(clasifica 90)", esperado: "excelente" },
        { llamada: "(clasifica 85)", esperado: "bueno" },
        { llamada: "(clasifica 60)", esperado: "aceptable" },
        { llamada: "(clasifica 30)", esperado: "insuficiente" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "excelente" && esperado !== "excelente") {
          return "Todo está cayendo en la primera cláusula. Si esa pregunta " +
            "es muy amplia, las de abajo no llegan a probarse nunca.";
        }
        if (llamada === "(clasifica 90)" && obtenido === "bueno") {
          return "El noventa entra en excelente. La comparación tiene que " +
            "incluir el límite, con >= en vez de >.";
        }
        if (obtenido.indexOf("no está ligada") !== -1) {
          return "Las respuestas son símbolos y van con comilla adelante.";
        }
        return "Las cláusulas van de mayor a menor, cada una con su límite " +
          "inferior, y el else recoge el resto.";
      },
      cierre:
        "Escribir los rangos completos, con límite inferior y superior en " +
        "cada cláusula, da el mismo resultado y el doble de condiciones. El " +
        "orden es parte de la especificación, no un detalle de escritura."
    },
    {
      id: "describe",
      titulo: "5. Preguntar por la forma del dato",
      enunciado:
        "Escriba <code>describe</code>, que devuelve <code>vacia</code>, " +
        "<code>numero</code>, <code>simbolo</code>, <code>lista</code> u " +
        "<code>otro</code> según lo que reciba. Aquí el orden vuelve a " +
        "importar, y por una razón distinta: la lista vacía también responde " +
        "que sí a <code>list?</code>, así que preguntar en el orden " +
        "equivocado la clasifica mal.",
      gramatica: null,
      esqueleto:
        "(define (describe x)\n" +
        "  (cond (??? ???)\n" +
        "        (??? ???)\n" +
        "        (??? ???)\n" +
        "        (??? ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(describe '())", esperado: "vacia" },
        { llamada: "(describe 5)", esperado: "numero" },
        { llamada: "(describe 'a)", esperado: "simbolo" },
        { llamada: "(describe '(1 2))", esperado: "lista" },
        { llamada: "(describe #t)", esperado: "otro" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(describe '())" && obtenido === "lista") {
          return "La lista vacía se está yendo por la cláusula de las " +
            "listas. Preguntar primero por null? es lo que la separa.";
        }
        if (llamada === "(describe #t)" && obtenido !== "otro") {
          return "Un booleano no es ninguna de las cuatro formas anteriores " +
            "y le toca el else.";
        }
        if (obtenido.indexOf("no está ligada") !== -1) {
          return "Las respuestas son símbolos: van con comilla adelante.";
        }
        return "Cinco preguntas por el tipo, y la del caso vacío antes que " +
          "la de las listas.";
      },
      cierre:
        "Preguntar por la forma del dato antes de operar sobre él es lo mismo " +
        "que se hará al evaluar expresiones: mirar de qué variante se trata y " +
        "solo entonces decidir qué regla aplica."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
