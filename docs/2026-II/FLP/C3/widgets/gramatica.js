/* ¿Cuál datatype le corresponde? Producciones de gramáticas de varios
   lenguajes pequeños y las variantes que les corresponden, en los dos
   sentidos, y el predicado que lleva cada campo. Lo que se ejercita es la
   receta: un nombre por producción, un campo por no terminal, nada para el
   andamiaje. */
var BLOQUES = (function () {
  "use strict";

  function g(t) { return "<code>" + t.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code>"; }
  function candidatos(a, b, c) {
    return '<ol class="programas" type="A"><li>' + g(a) + "</li><li>" + g(b) + "</li><li>" + g(c) + "</li></ol>";
  }

  var PREDICADOS = ["<code>number?</code>", "<code>symbol?</code>", "<code>expresion?</code>",
                    "<code>(list-of expresion?)</code>", "<code>(list-of symbol?)</code>"];

  return [
    {
      id: "de-la-produccion-a-la-variante",
      titulo: "1. De la producción a la variante",
      definicion: null,
      explicacion:
        "Dos nombres por producción: uno para la producción completa, que " +
        "será la variante, y uno para cada no terminal, que serán los campos; " +
        "los terminales sin información no dejan campo. Cada producción " +
        "viene de un lenguaje distinto y en todos <code>expresion?</code> " +
        "es el predicado del tipo que se está declarando. De las tres " +
        "variantes, una sigue la receta; escójala.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: g("(print <expresion>)") + candidatos(
            "(print-exp (exp1 expresion?))",
            "(print-exp (print symbol?) (exp1 expresion?))",
            "(print-exp (exp1 number?))"),
          correcta: 0,
          razon: "Es A. En B la palabra print sobrevivió como campo: es andamiaje, y el nombre de la variante ya dice de qué producción viene. En C el campo pide un número, y la gramática dice <expresion>: print podría imprimir una resta." },
        { valor: g("(set <identifier> = <expresion>)") + candidatos(
            "(set-exp (id symbol?) (igual symbol?) (exp1 expresion?))",
            "(set-exp (id symbol?) (exp1 expresion?))",
            "(set-exp (id expresion?) (exp1 expresion?))"),
          correcta: 1,
          razon: "Es B. El signo igual es andamiaje. El identificador que se asigna es un símbolo, no una expresión: se declara, no se evalúa, igual que el id del let." },
        { valor: g("(while <expresion> do <expresion>)") + candidatos(
            "(while-exp (exp1 expresion?) (body expresion?))",
            "(while-exp (exp1 expresion?) (do symbol?) (body expresion?))",
            "(while-exp (body expresion?))"),
          correcta: 0,
          razon: "Es A. Dos no terminales, dos campos: la prueba y el cuerpo. En B la palabra do quedó como campo, y en C se perdió la prueba." },
        { valor: g("(call <identifier> <expresion> ...)") + candidatos(
            "(call-exp (id symbol?) (args expresion?))",
            "(call-exp (id symbol?) (args (list-of expresion?)))",
            "(call-exp (ids (list-of symbol?)) (args (list-of expresion?)))"),
          correcta: 1,
          razon: "Es B. Los puntos suspensivos son cero o más expresiones, y eso es list-of. En A el campo admite una sola expresión y el constructor rechaza la lista. En C el identificador también se volvió lista, sin que la gramática lo diga." },
        { valor: g("(lambda (<identifier> ...) <expresion>)") + candidatos(
            "(lambda-exp (ids (list-of symbol?)) (body expresion?))",
            "(lambda-exp (id symbol?) (body expresion?))",
            "(lambda-exp (ids (list-of expresion?)) (body expresion?))"),
          correcta: 0,
          razon: "Es A. Cero o más identificadores: una lista de símbolos. B admite uno solo, que era el cálculo lambda de la sesión, no esta gramática. C convierte los parámetros en expresiones y el constructor aceptaría una resta como parámetro." },
        { valor: g("(<expresion> ? <expresion> : <expresion>)") + candidatos(
            "(cond-exp (exp1 expresion?) (exp2 expresion?) (exp3 expresion?))",
            "(cond-exp (exp1 expresion?) (pregunta symbol?) (exp2 expresion?) (dos-puntos symbol?) (exp3 expresion?))",
            "(cond-exp (exp1 expresion?) (exp2 expresion?))"),
          correcta: 0,
          razon: "Es A. El signo de interrogación y los dos puntos son andamiaje aunque vayan en medio: la posición de una palabra clave en la sintaxis concreta no le da un campo. Tres expresiones, tres campos, en el orden en que aparecen." },
        { valor: g("(repeat <number> <expresion>)") + candidatos(
            "(repeat-exp (n number?) (body expresion?))",
            "(repeat-exp (n expresion?) (body expresion?))",
            "(repeat-exp (n const-exp?) (body expresion?))"),
          correcta: 0,
          razon: "Es A. La gramática dice <number>, un terminal con información: el campo lleva number?. B admitiría cualquier expresión como cuenta, que la gramática no permite. C usa un predicado que no existe: const-exp es una variante, no un tipo, y define-datatype solo define el predicado del tipo." },
        { valor: g("(begin <expresion> <expresion> ...)") + candidatos(
            "(begin-exp (exps (list-of expresion?)))",
            "(begin-exp (exp1 expresion?) (exp2 expresion?))",
            "(begin-exp (exp1 expresion?) (exps (list-of expresion?)))"),
          correcta: 2,
          razon: "Es C. Una expresión obligatoria y después cero o más: un campo para la primera y una lista para el resto. A acepta un begin vacío, que la gramática no produce; B fija exactamente dos." }
      ],
      cierre:
        "Un campo por cada no terminal, en el orden en que aparecen, y " +
        "nada para las palabras clave ni para los signos, vayan adelante o " +
        "en medio. Los puntos suspensivos son list-of, y un terminal que " +
        "lleva información, como un número o un identificador, deja un " +
        "campo con el predicado de Scheme que lo reconoce."
    },
    {
      id: "de-la-variante-a-la-produccion",
      titulo: "2. De la variante a la producción",
      definicion: null,
      explicacion:
        "Ahora al revés: la variante está dada y hay que reconocer de qué " +
        "producción salió. Dos de las tres producciones no caben en esos " +
        "campos.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: g("(let2-exp (id1 symbol?) (exp1 expresion?) (id2 symbol?) (exp2 expresion?) (body expresion?))") + candidatos(
            "(let2 <identifier> = <expresion> <identifier> = <expresion> in <expresion>)",
            "(let2 (<identifier> ...) = (<expresion> ...) in <expresion>)",
            "(let2 <identifier> = <expresion> in <expresion>)"),
          correcta: 0,
          razon: "Es A. Dos identificadores y dos expresiones ligadas, uno tras otro, y el cuerpo. B pediría dos list-of; C tiene un solo par y le faltan dos campos." },
        { valor: g("(list-exp (exps (list-of expresion?)))") + candidatos(
            "(list <expresion>)",
            "(list <expresion> ...)",
            "(list <identifier> ...)"),
          correcta: 1,
          razon: "Es B. Un solo campo con list-of es una producción con puntos suspensivos. A tendría un campo expresion?, sin lista; C tendría (list-of symbol?)." },
        { valor: g("(letrec-exp (nombre symbol?) (param symbol?) (cuerpo-proc expresion?) (body expresion?))") + candidatos(
            "(letrec <identifier> (<identifier>) = <expresion> in <expresion>)",
            "(letrec <identifier> = <expresion> in <expresion>)",
            "(letrec <identifier> (<identifier> ...) = <expresion> in <expresion>)"),
          correcta: 0,
          razon: "Es A. Cuatro campos: el nombre del procedimiento, su único parámetro, su cuerpo y el cuerpo del letrec. B no tiene dónde poner el parámetro; C trae varios, que pedirían list-of." },
        { valor: g("(pair-exp (exp1 expresion?) (exp2 expresion?))") + candidatos(
            "(pair <expresion> , <expresion>)",
            "(pair <identifier> <expresion>)",
            "(pair <expresion> <expresion> ...)"),
          correcta: 0,
          razon: "Es A. La coma es andamiaje y no aparece en los campos. B tendría un símbolo en el primer campo; C tendría una lista en el segundo." },
        { valor: g("(emptylist-exp)") + candidatos(
            "emptylist",
            "(emptylist <expresion>)",
            "(emptylist <expresion> ...)"),
          correcta: 0,
          razon: "Es A. Sin campos: la producción es una palabra clave sola, sin no terminales. Cualquier no terminal habría dejado un campo, suelto o en lista." }
      ],
      cierre:
        "Los campos cuentan los no terminales y dicen de qué clase es cada " +
        "uno; lo que no dicen es qué palabras clave había ni dónde iban. " +
        "Por eso dos sintaxis concretas distintas pueden compartir la misma " +
        "sintaxis abstracta, y el intérprete solo ve la segunda."
    },
    {
      id: "que-predicado",
      titulo: "3. Qué predicado lleva el campo",
      definicion: null,
      explicacion:
        "Para cada producción se señala un campo. Escoja el predicado que le " +
        "corresponde en el <code>define-datatype</code>.",
      opciones: PREDICADOS,
      items: [
        { valor: g("(let <identifier> = <expresion> in <expresion>)") + " — el campo <code>id</code>", correcta: 1,
          razon: "Un identificador que se declara es un símbolo. Si fuera expresion? habría que envolverlo en var-exp, y entonces el let podría ligar un número." },
        { valor: g("(- <expresion> <expresion>)") + " — el campo <code>exp2</code>", correcta: 2,
          razon: "Una ocurrencia del no terminal que se está declarando: lleva el predicado del propio tipo." },
        { valor: g("(call <identifier> <expresion> ...)") + " — el campo <code>args</code>", correcta: 3,
          razon: "Cero o más expresiones: list-of del predicado del tipo. El constructor revisa la lista elemento por elemento." },
        { valor: g("(lambda (<identifier> ...) <expresion>)") + " — el campo <code>ids</code>", correcta: 4,
          razon: "Cero o más identificadores, y cada uno es un símbolo: (list-of symbol?)." },
        { valor: g("(repeat <number> <expresion>)") + " — el campo <code>n</code>", correcta: 0,
          razon: "Un número literal: number?. Si el lenguaje quisiera aceptar una expresión como cuenta, la gramática diría <expresion> y el campo llevaría expresion?." },
        { valor: g("<identifier>") + " — el campo <code>id</code> de <code>var-exp</code>", correcta: 1,
          razon: "El identificador que se usa también es un símbolo: var-exp lo envuelve para que sea una expresión, pero adentro guarda el nombre." },
        { valor: g("(if <expresion> then <expresion> else <expresion>)") + " — el campo <code>exp1</code>", correcta: 2,
          razon: "La prueba es una expresión cualquiera. Que valga booleano lo decide el intérprete al evaluarla, no el tipo, y por eso el if del curso verifica el booleano en tiempo de ejecución." }
      ],
      cierre:
        "El predicado se lee de la gramática: qué cosa va en esa posición. " +
        "Un terminal con información lleva el predicado de Scheme que lo " +
        "reconoce; un no terminal lleva el predicado de su tipo; los puntos " +
        "suspensivos envuelven cualquiera de los dos en list-of."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
