/* El reparto del trabajo al evaluar: quién decide qué se evalúa, quién opera
   sobre los valores y en qué orden ocurre todo. Las trazas y los conteos se
   midieron con el interpretador de la sesión. */
var BLOQUES = (function () {
  "use strict";
  function c(t) { return "<code>" + t.replace(/</g, "&lt;") + "</code>"; }
  function pasos() {
    var l = Array.prototype.slice.call(arguments);
    return '<ol class="programas" type="A"><li>' + l.join("</li><li>") + "</li></ol>";
  }

  return [
    {
      id: "quien-hace-que",
      titulo: "1. Quién hace qué dentro del evaluador",
      definicion:
        "(define evaluar-expresion\n" +
        "  (lambda (exp amb)\n" +
        "    (cases expresion exp\n" +
        "      (lit-exp (dato) dato)\n" +
        "      (var-exp (id) (apply-env amb id))\n" +
        "      (prim-exp (prim args)\n" +
        "        (let ((lista-numeros (map (lambda (x) (evaluar-expresion x amb)) args)))\n" +
        "          (evaluar-primitiva prim lista-numeros))))))\n" +
        "\n" +
        "(define operacion-prim\n" +
        "  (lambda (lval op term)\n" +
        "    (cond\n" +
        "      [(null? lval) term]\n" +
        "      [else (op (car lval) (operacion-prim (cdr lval) op term))])))",
      explicacion:
        "Tres cláusulas y tres auxiliares se reparten todo el trabajo. Diga " +
        "a quién le toca cada cosa.",
      opciones: ["evaluar-expresion", "map", "evaluar-primitiva", "operacion-prim", "apply-env"],
      items: [
        { valor: "Decidir qué hacer según la variante del nodo", correcta: 0,
          razon: "Es el cases: la forma del árbol decide la acción. Esto es lo que significa evaluación dirigida por la sintaxis." },
        { valor: "Recorrer la lista de operandos evaluando cada uno", correcta: 1,
          razon: "map aplica el evaluador a cada elemento y devuelve la lista de valores. Un operando puede ser una expresión cualquiera, así que dentro se vuelve a entrar al evaluador." },
        { valor: "Escoger qué operación aritmética le corresponde a la primitiva", correcta: 2,
          razon: "Es el cases sobre primitiva. Cuando entra en acción los operandos ya son valores: lo suyo es la aritmética, no la evaluación." },
        { valor: "Plegar la lista de valores " + c("(1 2 3)") + " hasta el 6, con " + c("+") + " y el neutro 0", correcta: 3,
          razon: "Es el fold-right que hace n-arias a la suma y al producto. El programa +(x, y, z) llega a evaluar-primitiva como una lista de tres valores y sale de operacion-prim como uno solo." },
        { valor: "Recorrer la cadena de ambientes buscando un nombre", correcta: 4,
          razon: "La cláusula de var-exp no busca: delega en apply-env, que es parte del TAD ambiente y no del interpretador. La cadena tiene dos eslabones, y a, b y c solo aparecen en el segundo." },
        { valor: "Necesitar el ambiente para hacer su trabajo", correcta: 0,
          razon: "evaluar-expresion lo recibe y se lo pasa a quien lo necesite. evaluar-primitiva no lo recibe siquiera: no le hace falta, porque no va a evaluar nada." },
        { valor: "Ser la razón de que " + c("*(add1(x), 3)") + " funcione sin un caso especial", correcta: 1,
          razon: "Porque trata cada operando como una expresión completa y vuelve a llamar al evaluador. Si solo aceptara números, habría que escribir un caso por cada forma de anidamiento." }
      ],
      cierre:
        "El evaluador decide y delega; las primitivas operan sobre valores y " +
        "no saben de dónde salieron. Esa separación es la que permite " +
        "agregar una primitiva sin tocar el evaluador, y agregar una forma " +
        "sintáctica sin tocar las primitivas."
    },
    {
      id: "en-que-orden",
      titulo: "2. En qué orden ocurre",
      definicion: null,
      explicacion:
        "El ambiente inicial liga <code>x = 1</code>, <code>y = 2</code>, " +
        "<code>z = 3</code> en el primer eslabón y <code>a = 4</code>, " +
        "<code>b = 5</code>, <code>c = 6</code> en el segundo. Escoja la " +
        "secuencia de valores que el interpretador va obteniendo, en el " +
        "orden en que los obtiene.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: c("-(b, x)") + pasos(
            "5, 1, 4",
            "4, 5, 1",
            "1, 5, 4"),
          correcta: 0,
          razon: "Es A. Los operandos se evalúan de izquierda a derecha y solo después se aplica la resta: un nodo no tiene valor hasta que sus hijos lo tienen." },
        { valor: c("sub1(add1(b))") + pasos(
            "5, 4, 6",
            "5, 6, 5",
            "6, 5, 4"),
          correcta: 1,
          razon: "Es B. Primero b vale 5, después el add1 de adentro da 6, y al final el sub1 de afuera vuelve a 5. La primitiva de afuera es la última en actuar, aunque sea la primera que se lee." },
        { valor: c("*(add1(x), sub1(c))") + pasos(
            "1, 2, 6, 5, 10",
            "1, 6, 2, 5, 10",
            "2, 5, 1, 6, 10"),
          correcta: 0,
          razon: "Es A. El primer operando se termina por completo —x y después add1(x)— antes de empezar el segundo. La multiplicación va de última, con los dos valores ya listos. La búsqueda de c recorre el primer eslabón sin encontrarla y sigue al segundo." },
        { valor: c("+(x, y, z)") + pasos(
            "1, 2, 3, 6",
            "3, 2, 1, 6",
            "6, 1, 2, 3"),
          correcta: 0,
          razon: "Es A. Los tres operandos se evalúan de izquierda a derecha, y la suma actúa una sola vez al final sobre la lista completa. Las sumas parciales del plegado quedan dentro de operacion-prim y no son valores de ninguna llamada a evaluar-expresion." },
        { valor: c("let w = add1(b) in *(w, w)") + pasos(
            "5, 6, se crea el ambiente, 6, 6, 36",
            "se crea el ambiente, 5, 6, 6, 6, 36",
            "5, 6, 6, 36, se crea el ambiente"),
          correcta: 0,
          razon: "Es A. La expresión ligada se evalúa entera primero —b da 5 y add1(b) da 6— y en el ambiente viejo; solo con ese valor se puede construir el ambiente nuevo, y solo entonces se evalúa el cuerpo, donde las dos w valen 6." }
      ],
      cierre:
        "El orden lo fija la estructura del árbol: para tener el valor de un " +
        "nodo hacen falta antes los de sus hijos. Por eso la traza se lee de " +
        "abajo hacia arriba en el árbol, y la expresión completa siempre es " +
        "la última en obtener su valor."
    },
    {
      id: "lo-que-no-verifica",
      titulo: "3. Lo que el interpretador no verifica",
      definicion:
        "(define evaluar-primitiva\n" +
        "  (lambda (prim lval)\n" +
        "    (cases primitiva prim\n" +
        "      (sum-prim ()   (operacion-prim lval + 0))\n" +
        "      (minus-prim () (- (car lval) (operacion-prim (cdr lval) + 0)))\n" +
        "      (mult-prim ()  (operacion-prim lval * 1))\n" +
        "      (div-prim ()   (/ (car lval) (operacion-prim (cdr lval) * 1)))\n" +
        "      (add-prim ()   (+ (car lval) 1))\n" +
        "      (sub-prim ()   (- (car lval) 1)))))",
      explicacion:
        "La gramática admite cualquier cantidad de operandos entre los " +
        "paréntesis y evaluar-primitiva lee los que su operación necesita. " +
        "Diga qué pasa con cada programa.",
      opciones: ["Da un valor", "Se cae al ejecutar", "Lo rechaza el parser"],
      items: [
        { valor: c("add1(b, 99)"), correcta: 0,
          razon: "Da 6. add-prim lee el primer operando con car y descarta el resto sin decir nada: el 99 se evaluó y no se usó. Es el error que no avisa, y contar la longitud de lval lo convertiría en un mensaje." },
        { valor: c("+(1, 2, 3)"), correcta: 0,
          razon: "Da 6. La suma es n-aria: operacion-prim pliega la lista entera con el neutro 0, así que ningún operando se pierde. Aquí no hay nada que verificar." },
        { valor: c("+()"), correcta: 0,
          razon: "Da 0. La lista de operandos está vacía y el plegado devuelve el neutro de la suma, sin tocar car. La gramática admite cero operandos porque separated-list acepta la lista vacía, y en la suma eso no se nota." },
        { valor: c("*()"), correcta: 0,
          razon: "Da 1, el neutro del producto. Mismo caso que la suma vacía, con otro resultado y por la misma razón: operacion-prim llega primero al caso base." },
        { valor: c("-(7)"), correcta: 0,
          razon: "Da 7. minus-prim resta la suma del resto de la lista, que está vacía y vale 0. El programa parece incompleto y sin embargo da un valor." },
        { valor: c("-()"), correcta: 1,
          razon: "Se cae, y con un mensaje de Racket sobre car y no sobre el lenguaje: minus-prim pide el primer operando de una lista que no tiene ninguno. El parser lo había dejado pasar." },
        { valor: c("add1 b"), correcta: 2,
          razon: "Sin los paréntesis no hay ninguna producción que reconozca esto: la de la primitiva los exige. Aquí sí hay un error de sintaxis, y aparece antes de ejecutar nada." }
      ],
      cierre:
        "La gramática es más permisiva que el lenguaje que uno tenía en " +
        "mente, y lo que ella deja pasar hay que atajarlo en el evaluador. " +
        "Las cuatro primitivas n-arias se defienden solas de la lista vacía, " +
        "porque el plegado tiene un neutro con que responder. La resta y la " +
        "división son otra cosa: leen el primer operando con car sin haber " +
        "contado, y ahí un programa que el parser aceptó se cae con un " +
        "mensaje que habla de Racket y no del lenguaje."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
