/* Ligaduras locales: let, let* y letrec. Las tres introducen nombres que solo
   viven dentro de una expresión, y se diferencian en qué ambiente ven las
   expresiones que calculan los valores. El código del estudiante corre sobre
   mini-scheme.js. */
var RETOS = (function () {
  "use strict";
  return [
    {
      id: "rota",
      titulo: "1. Las tres ligaduras se calculan a la vez",
      enunciado:
        "Escriba <code>rota</code>, que recibe tres valores y los devuelve " +
        "corridos una posición: el tercero pasa al frente y los otros dos " +
        "retroceden. Con <code>let</code> las tres expresiones de la derecha " +
        "se evalúan <b>antes</b> de que exista cualquiera de los nombres " +
        "nuevos, así que todas ven los valores que traía el procedimiento. " +
        "Eso es lo que permite reasignar los tres nombres sin perder ninguno.",
      gramatica: null,
      esqueleto:
        "(define (rota a b c)\n" +
        "  (let ([a ???]\n" +
        "        [b ???]\n" +
        "        [c ???])\n" +
        "    (list a b c)))\n",
      pruebas: [
        { llamada: "(rota 1 2 3)", esperado: "(3 1 2)" },
        { llamada: "(rota 'x 'y 'z)", esperado: "(z x y)" },
        { llamada: "(rota 7 7 9)", esperado: "(9 7 7)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "(3 3 3)" || obtenido === "(z z z)") {
          return "Las ligaduras se están leyendo en cadena, como si cada una " +
            "usara la anterior. Con let no ocurre: las tres derechas miran " +
            "los valores originales, no los que se están definiendo.";
        }
        if (llamada === "(rota 1 2 3)" && obtenido === "(1 2 3)") {
          return "Cada nombre quedó ligado a sí mismo. El primero recibe lo " +
            "que traía el tercero, y así corriendo.";
        }
        return "El resultado es (3 1 2): a toma el valor de c, b el de a y c " +
          "el de b, todos leídos antes de que la ligadura ocurra.";
      },
      cierre:
        "Esta es la propiedad que hace de <code>let</code> algo distinto de " +
        "una secuencia de asignaciones. Las derechas se evalúan en el " +
        "ambiente de afuera y solo después se extiende el ambiente con los " +
        "tres nombres a la vez."
    },
    {
      id: "resumen",
      titulo: "2. Cuando cada paso necesita el anterior",
      enunciado:
        "Escriba <code>resumen</code>, que devuelve una lista con la " +
        "cantidad de elementos, su suma y su promedio. El promedio necesita " +
        "los dos valores anteriores, y ahí <code>let</code> no sirve: hace " +
        "falta <code>let*</code>, donde cada ligadura ve las que vienen " +
        "antes. <code>largo</code> y <code>suma</code> vienen resueltos.",
      gramatica: null,
      esqueleto:
        "(define (largo lst)\n" +
        "  (if (null? lst) 0 (+ 1 (largo (cdr lst)))))\n" +
        "\n" +
        "(define (suma lst)\n" +
        "  (if (null? lst) 0 (+ (car lst) (suma (cdr lst)))))\n" +
        "\n" +
        "(define (resumen lst)\n" +
        "  (let* ([n ???]\n" +
        "         [total ???]\n" +
        "         [promedio ???])\n" +
        "    (list n total promedio)))\n",
      pruebas: [
        { llamada: "(resumen '(1 2 3))", esperado: "(3 6 2)" },
        { llamada: "(resumen '(4 4))", esperado: "(2 8 4)" },
        { llamada: "(resumen '(5))", esperado: "(1 5 5)" },
        { llamada: "(resumen '(2 4 6 8))", esperado: "(4 20 5)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("no está ligada") !== -1) {
          return "El nombre que falta se está usando antes de definirse. Con " +
            "let* el orden importa: primero la cantidad y la suma, y el " +
            "promedio de último.";
        }
        if (llamada === "(resumen '(1 2 3))" && obtenido === "(3 6 6)") {
          return "El promedio quedó igual al total. Es el total dividido " +
            "entre la cantidad de elementos.";
        }
        return "Tres ligaduras en orden: cuántos, cuánto suman y el " +
          "cociente entre las dos.";
      },
      cierre:
        "<code>let*</code> no es una forma nueva sino una abreviatura: " +
        "equivale a tres <code>let</code> anidados, cada uno adentro del " +
        "anterior. Por eso cada nombre alcanza a ver los que quedaron " +
        "afuera."
    },
    {
      id: "anidado",
      titulo: "3. Un let dentro de otro",
      enunciado:
        "Escriba <code>dos-pasos</code>, que devuelve una lista con el doble " +
        "del número que recibe y con ese doble aumentado en uno. Aquí no hay " +
        "<code>let*</code>: son dos <code>let</code>, uno dentro del otro. La " +
        "ligadura de adentro se calcula cuando la de afuera ya existe, así " +
        "que puede usarla.",
      gramatica: null,
      esqueleto:
        "(define (dos-pasos x)\n" +
        "  (let ([doble ???])\n" +
        "    (let ([mas-uno ???])\n" +
        "      (list doble mas-uno))))\n",
      pruebas: [
        { llamada: "(dos-pasos 5)", esperado: "(10 11)" },
        { llamada: "(dos-pasos 0)", esperado: "(0 1)" },
        { llamada: "(dos-pasos -3)", esperado: "(-6 -5)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("no está ligada") !== -1) {
          return "La ligadura de adentro está usando un nombre que todavía " +
            "no existe. Solo alcanza a ver doble y x.";
        }
        if (llamada === "(dos-pasos 5)" && obtenido === "(10 6)") {
          return "El segundo valor se calculó sobre x y no sobre el doble. " +
            "Para eso está anidado el segundo let.";
        }
        return "El primero duplica lo que llegó; el segundo le suma uno al " +
          "resultado del primero.";
      },
      cierre:
        "Anidar es lo que hace <code>let*</code> por debajo, y compararlos " +
        "aclara qué significa el ambiente de una expresión: el cuerpo de un " +
        "<code>let</code> se evalúa en un ambiente extendido, y por eso lo " +
        "que esté adentro ve una ligadura más que lo que esté afuera."
    },
    {
      id: "cual",
      titulo: "4. La que permite llamarse a sí misma",
      enunciado:
        "El procedimiento local <code>contar</code> se llama a sí mismo, y " +
        "la ligadura que lo permite no es cualquiera. Escriba en el hueco la " +
        "palabra que hace falta. Si escoge la equivocada, el mensaje será " +
        "que <code>contar</code> no está ligada: al construir el " +
        "procedimiento, su propio nombre todavía no existía.",
      gramatica: null,
      esqueleto:
        "(define (largo lst)\n" +
        "  (??? ([contar (lambda (l)\n" +
        "                  (if (null? l)\n" +
        "                      0\n" +
        "                      (+ 1 (contar (cdr l)))))])\n" +
        "    (contar lst)))\n",
      pruebas: [
        { llamada: "(largo '())", esperado: "0" },
        { llamada: "(largo '(a b c))", esperado: "3" },
        { llamada: "(largo '((a b) c))", esperado: "2" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        return "Son tres candidatas y solo una liga el nombre antes de " +
          "construir el procedimiento, de modo que el cuerpo pueda nombrarse " +
          "a sí mismo.";
      },
      cierre:
        "<code>letrec</code> extiende el ambiente primero y evalúa las " +
        "expresiones dentro de ese ambiente ya extendido. La clausura que " +
        "resulta guarda un ambiente donde su propio nombre existe, y esa es " +
        "toda la diferencia."
    },
    {
      id: "acumulador-local",
      titulo: "5. Un acumulador que no se ve por fuera",
      enunciado:
        "Escriba <code>suma-lista</code> con un procedimiento local de dos " +
        "argumentos que lleve el acumulador. Quien use <code>suma-lista</code> " +
        "no tiene por qué enterarse del acumulador ni pasarlo: la versión de " +
        "cola queda adentro y afuera solo se ve un procedimiento de un " +
        "argumento.",
      gramatica: null,
      esqueleto:
        "(define (suma-lista lst)\n" +
        "  (letrec ([sumar (lambda (l ac)\n" +
        "                    (if (null? l)\n" +
        "                        ???\n" +
        "                        (sumar ??? ???)))])\n" +
        "    (sumar lst ???)))\n",
      pruebas: [
        { llamada: "(suma-lista '())", esperado: "0" },
        { llamada: "(suma-lista '(1 2 3))", esperado: "6" },
        { llamada: "(suma-lista '(10 -3))", esperado: "7" },
        { llamada: "(suma-lista '(5 5 5 5))", esperado: "20" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(suma-lista '())" && obtenido !== "0") {
          return "Con la lista vacía se devuelve el acumulador tal como " +
            "llegó, y arranca en cero.";
        }
        if (llamada === "(suma-lista '(1 2 3))" && obtenido === "3") {
          return "Se está contando en vez de sumando: al acumulador entra el " +
            "car, no un uno.";
        }
        return "El caso base entrega el acumulador; el paso avanza por el " +
          "cdr y le agrega el primer elemento.";
      },
      cierre:
        "El acumulador es un detalle de cómo está resuelto, no de qué hace " +
        "el procedimiento, y con la ligadura local no se filtra a la " +
        "interfaz. Es la misma razón por la que un intérprete guarda sus " +
        "estructuras auxiliares en el ambiente y no en la gramática."
    },
    {
      id: "mutua",
      titulo: "6. Dos procedimientos que se llaman entre sí",
      enunciado:
        "Escriba <code>par-n?</code> sin usar <code>even?</code> ni " +
        "<code>modulo</code>: un número es par si al restarle uno queda " +
        "impar, y es impar si al restarle uno queda par. Los dos " +
        "procedimientos locales se nombran mutuamente, y un solo " +
        "<code>letrec</code> los liga a ambos antes de construir cualquiera " +
        "de los dos.",
      gramatica: null,
      esqueleto:
        "(define (par-n? n)\n" +
        "  (letrec ([par? (lambda (k)\n" +
        "                   (if (zero? k) #t (impar? ???)))]\n" +
        "           [impar? (lambda (k)\n" +
        "                     (if (zero? k) ??? (par? ???)))])\n" +
        "    (par? n)))\n",
      pruebas: [
        { llamada: "(par-n? 0)", esperado: "#t" },
        { llamada: "(par-n? 1)", esperado: "#f" },
        { llamada: "(par-n? 10)", esperado: "#t" },
        { llamada: "(par-n? 7)", esperado: "#f" },
        { llamada: "(par-n? 1001)", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(par-n? 0)" && obtenido === "#f") {
          return "El cero es par, y ese es el caso base del primero. El del " +
            "segundo responde lo contrario.";
        }
        if (llamada === "(par-n? 1)" && obtenido === "#t") {
          return "Los dos casos base están dando la misma respuesta. Si cero " +
            "es par, entonces cero no es impar.";
        }
        return "Cada uno baja el número en uno y le pasa la pregunta al " +
          "otro.";
      },
      cierre:
        "Un solo <code>letrec</code> con dos ligaduras alcanza para la " +
        "recursión mutua, porque el ambiente se extiende con los dos nombres " +
        "antes de evaluar cualquiera de las dos expresiones. Ninguno de los " +
        "dos podría existir sin el otro ya nombrado."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
