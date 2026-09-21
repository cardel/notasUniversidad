/* Leer el programa como lista. Una expresión lambda guardada como lista de
   Scheme, los accesos con car y cdr que la destripan, lo que pasa cuando la
   lista no tiene la forma esperada y qué se rompe cuando la representación
   cambia. Los ítems se juzgan; la consola de abajo permite comprobarlos. */
var BLOQUES = (function () {
  "use strict";

  function c(t) { return "<code>" + t + "</code>"; }

  var OCCURS_FREE =
    "(define occurs-free?\n" +
    "  (lambda (var exp)\n" +
    "    (cond\n" +
    "      ((symbol? exp) (eqv? var exp))\n" +
    "      ((eqv? (car exp) 'lambda)\n" +
    "       (and (not (eqv? var (caadr exp)))\n" +
    "            (occurs-free? var (caddr exp))))\n" +
    "      (else\n" +
    "       (or (occurs-free? var (car exp))\n" +
    "           (occurs-free? var (cadr exp)))))))";

  var ACCESOS =
    ";; Cinco accesos escritos para la representación de la sesión:\n" +
    ";; (lambda (id) cuerpo) y (operador operando)\n" +
    "(define (es-lambda? e) (and (pair? e) (eqv? (car e) 'lambda)))\n" +
    "(define (parametro e) (caadr e))\n" +
    "(define (cuerpo e) (caddr e))\n" +
    "(define (operador e) (car e))\n" +
    "(define (operando e) (cadr e))\n\n" +
    OCCURS_FREE;

  return [
    {
      id: "que-parte-sale",
      titulo: "1. Qué parte sale",
      definicion: "(define e '(lambda (y) ((g y) (lambda (z) (h z)))))",
      explicacion:
        "La expresión está guardada tal cual, como lista. Para cada acceso, " +
        "diga qué devuelve. Conviene contar los paréntesis antes de responder.",
      items: [
        { valor: c("(car e)"), opciones: [c("lambda"), c("(lambda (y))"), c("(y)")], correcta: 0,
          razon: "El primer elemento de la lista es la palabra clave. La lista tiene tres elementos: la palabra clave, la lista de parámetros y el cuerpo." },
        { valor: c("(cadr e)"), opciones: [c("y"), c("(y)"), c("((g y) (lambda (z) (h z)))")], correcta: 1,
          razon: "El segundo elemento es la lista de parámetros, con sus paréntesis. Para llegar al símbolo y hace falta otro car." },
        { valor: c("(caadr e)"), opciones: [c("y"), c("(y)"), c("g")], correcta: 0,
          razon: "car del cadr: el primer elemento de la lista de parámetros. Este es el acceso que muere si el equipo decide guardar el parámetro sin paréntesis." },
        { valor: c("(caddr e)"), opciones: [c("(g y)"), c("((g y) (lambda (z) (h z)))"), c("(lambda (z) (h z))")], correcta: 1,
          razon: "El tercer elemento es el cuerpo entero, que aquí es una aplicación: una lista de dos expresiones." },
        { valor: c("(car (caddr e))"), opciones: [c("g"), c("(g y)"), c("(lambda (z) (h z))")], correcta: 1,
          razon: "El operador de la aplicación, que a su vez es otra aplicación. Que sea una lista y no un símbolo es lo que obliga a occurs-free? a ser recursivo en el else." },
        { valor: c("(cadr (caddr e))"), opciones: [c("(h z)"), c("z"), c("(lambda (z) (h z))")], correcta: 2,
          razon: "El operando de la aplicación: una expresión lambda completa. Su cuerpo, (h z), está a un caddr más de distancia." },
        { valor: c("(caadr (cadr (caddr e)))"), opciones: [c("z"), c("(z)"), c("h")], correcta: 0,
          razon: "El parámetro del lambda interior: cadr del caddr llega al lambda, cadr de eso a la lista (z), car a z. Cuatro accesos encadenados para una sola letra, y ninguno dice qué está extrayendo." },
        { valor: c("(cdddr e)"), opciones: [c("()"), c("(h z)"), "Error"], correcta: 0,
          razon: "Tres cdr dejan la lista sin elementos: () y no un error. Nada avisa que un lambda tiene exactamente tres partes; una cuarta pasaría desapercibida." }
      ],
      cierre:
        "Cada acceso es una cadena de car y cdr que hay que contar a mano, y " +
        "el nombre no dice qué parte de la expresión trae. Con la lista abierta " +
        "al lado se puede; con una expresión que no está a la vista, cada caadr " +
        "es una apuesta."
    },
    {
      id: "nada-verifica",
      titulo: "2. Nada verifica la forma",
      definicion: OCCURS_FREE,
      explicacion:
        "El procedimiento de la sesión, sobre listas. Ninguna de estas " +
        "llamadas recibe una expresión lambda bien formada. Diga qué devuelve " +
        "cada una, o si aborta.",
      opciones: ["#t", "#f", "Error en ejecución"],
      items: [
        { valor: c("(occurs-free? 'f '(f))"), correcta: 0,
          razon: "(f) no es un símbolo y su car no es lambda, así que cae en el else: (or (occurs-free? 'f 'f) …), y la primera parte ya es #t. El cadr nunca se ejecutó. El procedimiento respondió sobre algo que no es una expresión." },
        { valor: c("(occurs-free? 'k '(f))"), correcta: 2,
          razon: "La primera parte del or da #f y la segunda pide cadr de una lista de un elemento: error. La misma lista mal formada da #t o error según qué variable se pregunte." },
        { valor: c("(occurs-free? 'x '(x y z))"), correcta: 0,
          razon: "Tres elementos, y el else solo mira los dos primeros. La z sobra y nadie lo nota." },
        { valor: c("(occurs-free? 'z '(x y z))"), correcta: 1,
          razon: "z está en la lista, pero el else solo revisa car y cadr. Con una lista que no tiene la forma de una aplicación, la respuesta es sobre otra cosa." },
        { valor: c("(occurs-free? 'x '(lambda (x)))"), correcta: 1,
          razon: "Un lambda sin cuerpo. El and se detiene en la primera parte, porque x sí es el parámetro, y el caddr que habría fallado nunca se evalúa. Devuelve #f sin haber visto que faltaba el cuerpo." },
        { valor: c("(occurs-free? 'y '(lambda (x)))"), correcta: 2,
          razon: "Ahora sí llega al caddr y no hay tercer elemento. La misma lista que en el ítem anterior devolvió #f." },
        { valor: c("(occurs-free? 'x '((lambda (x) x) x))"), correcta: 0,
          razon: "Esta sí está bien formada: una aplicación cuyo operador es un lambda. En el operador x está ligada y da #f; en el operando x está sola y da #t. Libre se decide por ocurrencia, no por nombre." }
      ],
      cierre:
        "Ningún acceso verifica la forma: la lista de un elemento, la de tres, " +
        "el lambda sin cuerpo, todas entran. A veces sale un error, a veces " +
        "una respuesta, y cuál de las dos depende de qué variable se preguntó, " +
        "no de si la lista estaba bien."
    },
    {
      id: "cambia-la-representacion",
      titulo: "3. Cambia la representación",
      definicion: ACCESOS,
      explicacion:
        "El equipo cambió la representación: las aplicaciones llevan ahora la " +
        "palabra <code>app</code> adelante, <code>(app g y)</code>, y el " +
        "parámetro va sin paréntesis, <code>(lambda y …)</code>. Los accesos " +
        "de arriba y <code>occurs-free?</code> quedaron como estaban. Cada " +
        "llamada trae la lista en la representación nueva: diga qué pasa.",
      opciones: ["La respuesta correcta", "Otra respuesta, sin aviso", "Error en ejecución"],
      items: [
        { valor: c("(es-lambda? '(lambda y (app g y)))"), correcta: 0,
          razon: "Solo mira el primer elemento, y la palabra lambda sigue ahí. Es el único de los cinco accesos al que el cambio no le llega." },
        { valor: c("(parametro '(lambda y (app g y)))"), correcta: 2,
          razon: "cadr da el símbolo y, y car sobre un símbolo aborta. El mensaje habla de pares, no de parámetros." },
        { valor: c("(cuerpo '(lambda y (app g y)))"), correcta: 0,
          razon: "El cuerpo sigue siendo el tercer elemento. Se salva porque la representación cambió en otra posición, no porque el acceso sepa qué es un cuerpo." },
        { valor: c("(operador '(app g y))"), correcta: 1,
          razon: "Devuelve la palabra app como si fuera el operador. No hay error: para car un símbolo es tan válido como otro, y el cliente que lo reciba se lo cree." },
        { valor: c("(operando '(app g y))"), correcta: 1,
          razon: "Devuelve g, que es el operador: todo corrió un lugar a la derecha y el acceso no se enteró." },
        { valor: c("(occurs-free? 'y '(app g y))"), correcta: 1,
          razon: "La y está en la lista, pero el else solo revisa car y cadr, que ahora son app y g. Responde #f sin quejarse, y esa es la peor de las tres salidas: una respuesta equivocada que parece buena." },
        { valor: c("(occurs-free? 'app '(app g y))"), correcta: 1,
          razon: "app no es una variable, es andamiaje de la representación nueva, y aun así sale como ocurrencia libre. El código no distingue palabras clave de identificadores porque nada le dijo cuáles son." },
        { valor: c("(occurs-free? 'g '(lambda y (app g y)))"), correcta: 2,
          razon: "Llega a la cláusula del lambda y el caadr aborta antes de mirar el cuerpo. Cada acceso que se escribió contra la forma vieja es una línea que hay que tocar." }
      ],
      cierre:
        "Cambiar la representación no rompe el código: lo deja corriendo sobre " +
        "otra cosa. Los accesos que fallan se notan; los que devuelven otra " +
        "respuesta no, y ese es el argumento para nombrar las partes y que el " +
        "lenguaje verifique la forma."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
