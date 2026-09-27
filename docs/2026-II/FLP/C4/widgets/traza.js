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
        "(define eval-expression\n" +
        "  (lambda (exp env)\n" +
        "    (cases expression exp\n" +
        "      (lit-exp (datum) datum)\n" +
        "      (var-exp (id) (apply-env env id))\n" +
        "      (primapp-exp (prim rands)\n" +
        "        (let ((args (eval-rands rands env)))\n" +
        "          (apply-primitive prim args))))))",
      explicacion:
        "Tres cláusulas y dos auxiliares se reparten todo el trabajo. Diga " +
        "a quién le toca cada cosa.",
      opciones: ["eval-expression", "eval-rands", "apply-primitive", "apply-env"],
      items: [
        { valor: "Decidir qué hacer según la variante del nodo", correcta: 0,
          razon: "Es el cases: la forma del árbol decide la acción. Esto es lo que significa evaluación dirigida por la sintaxis." },
        { valor: "Recorrer la lista de operandos", correcta: 1,
          razon: "eval-rands aplica el evaluador a cada elemento con map y devuelve la lista de valores. Un operando puede ser una expresión cualquiera, así que dentro se vuelve a entrar al evaluador." },
        { valor: "Sumar dos números", correcta: 2,
          razon: "Cuando apply-primitive entra en acción los operandos ya son valores: lo suyo es la aritmética, no la evaluación." },
        { valor: "Recorrer la cadena de ambientes buscando un nombre", correcta: 3,
          razon: "La cláusula de var-exp no busca: delega en apply-env, que es parte del TAD ambiente y no del interpretador." },
        { valor: "Necesitar el ambiente para hacer su trabajo", correcta: 0,
          razon: "eval-expression lo recibe y se lo pasa a quien lo necesite. apply-primitive no lo recibe siquiera: no le hace falta, porque no va a evaluar nada." },
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
        "Con el ambiente inicial <code>i = 1</code>, <code>v = 5</code>, " +
        "<code>x = 10</code>, escoja la secuencia de valores que el " +
        "interpretador va obteniendo, en el orden en que los obtiene.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: c("-(v, i)") + pasos(
            "5, 1, 4",
            "4, 5, 1",
            "1, 5, 4"),
          correcta: 0,
          razon: "Es A. Los operandos se evalúan de izquierda a derecha y solo después se aplica la resta: un nodo no tiene valor hasta que sus hijos lo tienen." },
        { valor: c("sub1(add1(v))") + pasos(
            "5, 4, 6",
            "5, 6, 5",
            "6, 5, 4"),
          correcta: 1,
          razon: "Es B. Primero v vale 5, después el add1 de adentro da 6, y al final el sub1 de afuera vuelve a 5. La primitiva de afuera es la última en actuar, aunque sea la primera que se lee." },
        { valor: c("*(add1(i), sub1(x))") + pasos(
            "1, 2, 10, 9, 18",
            "1, 10, 2, 9, 18",
            "2, 9, 1, 10, 18"),
          correcta: 0,
          razon: "Es A. El primer operando se termina por completo —i y después add1(i)— antes de empezar el segundo. La multiplicación va de última, con los dos valores ya listos." },
        { valor: c("let a = add1(v) in *(a, a)") + pasos(
            "5, 6, se crea el ambiente, 6, 6, 36",
            "se crea el ambiente, 5, 6, 6, 6, 36",
            "5, 6, 6, 36, se crea el ambiente"),
          correcta: 0,
          razon: "Es A. La expresión ligada se evalúa entera primero —v da 5 y add1(v) da 6— y en el ambiente viejo; solo con ese valor se puede construir el ambiente nuevo, y solo entonces se evalúa el cuerpo, donde las dos a valen 6." }
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
        "(define apply-primitive\n" +
        "  (lambda (prim args)\n" +
        "    (cases primitive prim\n" +
        "      (add-prim ()       (+ (car args) (cadr args)))\n" +
        "      (substract-prim () (- (car args) (cadr args)))\n" +
        "      (mult-prim ()      (* (car args) (cadr args)))\n" +
        "      (incr-prim ()      (+ (car args) 1))\n" +
        "      (decr-prim ()      (- (car args) 1)))))",
      explicacion:
        "La gramática admite cualquier cantidad de operandos entre los " +
        "paréntesis y apply-primitive lee los que necesita. Diga qué pasa " +
        "con cada programa.",
      opciones: ["Da un valor", "Se cae al ejecutar", "Lo rechaza el parser"],
      items: [
        { valor: c("add1(v, 99)"), correcta: 0,
          razon: "Da 6. incr-prim lee el primer operando y descarta el resto sin decir nada: el 99 se evaluó y no se usó. Es el error que no avisa, y verificar la longitud de args lo convertiría en un mensaje." },
        { valor: c("+(1, 2, 3)"), correcta: 0,
          razon: "Da 3. La suma lee los dos primeros y el tercero se pierde, igual que antes. Para que valga 6 habría que recorrer la lista entera con foldl." },
        { valor: c("-(7)"), correcta: 1,
          razon: "Se cae, y con un mensaje de Racket sobre cadr y no sobre el lenguaje: la resta pide el segundo operando de una lista que tiene uno solo. El parser lo había dejado pasar." },
        { valor: c("*()"), correcta: 1,
          razon: "Mismo caso, más temprano: la lista de operandos está vacía y car falla. La gramática admite cero operandos porque separated-list acepta la lista vacía." },
        { valor: c("add1 v"), correcta: 2,
          razon: "Sin los paréntesis no hay ninguna producción que reconozca esto: la de la primitiva los exige. Aquí sí hay un error de sintaxis, y aparece antes de ejecutar nada." }
      ],
      cierre:
        "La gramática es más permisiva que el lenguaje que uno tenía en " +
        "mente, y lo que ella deja pasar hay que atajarlo en el evaluador. " +
        "Cada vez que una primitiva lee car o cadr sin haber contado, hay un " +
        "programa que se cae con un mensaje que no habla del lenguaje sino " +
        "de Racket."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
