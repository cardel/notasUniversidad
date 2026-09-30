/* Leer una especificación de SLLGEN. Las tres partes de una regla léxica y
   su salida, y lo que cada producción de la gramática deja en el datatype
   que SLLGEN genera. */
var BLOQUES = (function () {
  "use strict";
  function c(t) { return "<code>" + t.replace(/</g, "&lt;") + "</code>"; }
  function bnf(t) {
    return '<pre class="codigo gramatica">' + t.replace(/</g, "&lt;") + "</pre>";
  }
  function opciones(a, b, d) {
    return '<ol class="programas gramaticas" type="A"><li>' +
      [a, b, d].map(bnf).join("</li><li>") + "</li></ol>";
  }

  return [
    {
      id: "la-salida-de-la-regla",
      titulo: "1. Qué salida lleva cada regla léxica",
      definicion:
        "(nombre  (expresión regular)  salida)\n\n" +
        "skip     no emite token\n" +
        "symbol   el lexema se vuelve un símbolo\n" +
        "number   el lexema se vuelve un número",
      explicacion:
        "Una regla léxica tiene tres partes: el nombre de la categoría, la " +
        "expresión regular que la reconoce y la salida que se ejecuta al " +
        "reconocerla. Escoja la salida que le corresponde a cada regla.",
      opciones: ["skip", "symbol", "number"],
      items: [
        { valor: c('(white-sp (whitespace) ???)'), correcta: 0,
          razon: "Los espacios se reconocen para poder descartarlos: sin esta regla el scanner se atascaría en el primer espacio, pero con salida symbol emitiría un token por cada uno." },
        { valor: c('(comment ("%" (arbno (not #\\newline))) ???)'), correcta: 0,
          razon: "Misma idea que los espacios: se reconoce para tirarlo. La expresión regular dice «un por ciento y después cualquier cosa que no sea fin de línea, cero o más veces»." },
        { valor: c('(identifier (letter (arbno (or letter digit "?"))) ???)'), correcta: 1,
          razon: "El lexema se convierte en símbolo de Scheme, que es lo que después guarda el campo id de var-exp y lo que apply-env compara con eqv?." },
        { valor: c('(number (digit (arbno digit)) ???)'), correcta: 2,
          razon: "La conversión de texto a número ocurre aquí, en el scanner. Por eso el campo datum de lit-exp ya trae un número y el evaluador se limita a devolverlo." },
        { valor: c('(number ("-" digit (arbno digit)) ???)'), correcta: 2,
          razon: "Es la misma categoría con otra expresión regular: un menos pegado a los dígitos. Dos reglas pueden compartir nombre, y el token que emiten es de la misma clase." }
      ],
      cierre:
        "La salida es lo que convierte una porción de texto en un dato de " +
        "Scheme, o en nada. Las dos reglas con skip explican por qué la " +
        "indentación y los comentarios no cambian el árbol: nunca salen del " +
        "scanner."
    },
    {
      id: "que-reconoce",
      titulo: "2. Qué reconoce esta expresión regular",
      definicion:
        "letter | digit | whitespace | any     un carácter de esa clase\n" +
        "(not c)                               cualquiera menos ese\n" +
        "(or e1 e2 …)                          alguna de ellas\n" +
        "(arbno e)                             cero o más repeticiones\n" +
        "(concat e1 e2 …)                      una tras otra",
      explicacion:
        "Diga si la cadena señalada la reconoce la regla del identificador, " +
        "<code>(letter (arbno (or letter digit \"?\")))</code>.",
      opciones: ["La reconoce", "No la reconoce"],
      items: [
        { valor: c("suma"), correcta: 0,
          razon: "Una letra y después tres letras: la parte del arbno admite cero o más, y aquí son tres." },
        { valor: c("a"), correcta: 0,
          razon: "Una letra y cero repeticiones. arbno significa cero o más, así que un identificador de una sola letra es válido." },
        { valor: c("x2y"), correcta: 0,
          razon: "Después de la primera letra la regla admite letras y dígitos mezclados, en cualquier orden." },
        { valor: c("2x"), correcta: 1,
          razon: "La regla exige que el primer carácter sea una letra. Esta cadena la empieza a reconocer la regla del número, que corta en el 2 y deja la x para el siguiente token." },
        { valor: c("dato?"), correcta: 0,
          razon: "El signo de interrogación está entre las alternativas del arbno, y por eso zero? podrá ser un solo lexema cuando la primitiva se agregue al lenguaje." },
        { valor: c("dos-partes"), correcta: 1,
          razon: "El guion no está en la regla: ni es letra, ni dígito, ni el signo de interrogación. El scanner cortaría en dos y el menos quedaría suelto, que es un token distinto." }
      ],
      cierre:
        "La regla dice exactamente qué se acepta como nombre, y lo que no " +
        "está escrito no se acepta. Es la primera decisión de diseño de un " +
        "lenguaje: qué puede escribir el programador como identificador."
    },
    {
      id: "produccion-y-variante",
      titulo: "3. De la producción de SLLGEN a la variante",
      definicion:
        "(no-terminal  (elementos del lado derecho)  nombre-de-la-producción)\n\n" +
        "Un elemento entre comillas es un literal y no deja campo;\n" +
        "un no terminal deja campo; (arbno …) y (separated-list … \",\")\n" +
        "dejan un campo que es una lista.",
      explicacion:
        "SLLGEN genera un <code>define-datatype</code> a partir de la " +
        "gramática: una variante por producción. Escoja la variante que " +
        "genera cada una.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: bnf('(expression (number) lit-exp)') + opciones(
            "(lit-exp (datum number?))",
            "(lit-exp (datum expression?))",
            "(lit-exp)"),
          correcta: 0,
          razon: "Es A. El no terminal number es un terminal con información, así que deja un campo con el predicado de Scheme que lo reconoce." },
        { valor: bnf('(expression\n  (primitive "(" (separated-list expression ",") ")")\n  primapp-exp)') + opciones(
            "(primapp-exp (prim primitive?) (rands expression?))",
            "(primapp-exp (prim primitive?) (rands (list-of expression?)))",
            "(primapp-exp (abre string?) (rands (list-of expression?)) (cierra string?))"),
          correcta: 1,
          razon: "Es B. Los paréntesis y la coma están entre comillas y no dejan campo; la separated-list deja uno solo, que es la lista de operandos. Por eso apply-primitive recibe una lista y no dos argumentos." },
        { valor: bnf('(expression\n  ("let" identifier "=" expression "in" expression)\n  let-exp)') + opciones(
            "(let-exp (id symbol?) (rand expression?) (body expression?))",
            "(let-exp (id expression?) (rand expression?) (body expression?))",
            "(let-exp (let string?) (id symbol?) (rand expression?) (body expression?))"),
          correcta: 0,
          razon: "Es A. Tres campos, uno por cada elemento que no está entre comillas: el identificador que se liga, la expresión ligada y el cuerpo. let, = e in sirven para reconocer la forma y desaparecen." },
        { valor: bnf('(primitive ("add1") incr-prim)') + opciones(
            "(incr-prim (nombre string?))",
            "(incr-prim (arg expression?))",
            "(incr-prim)"),
          correcta: 2,
          razon: "Es C. La producción solo tiene un literal, así que la variante no tiene campos. El operando no está aquí: vive en la lista de rands de primapp-exp, y por eso la misma primitiva sirve con cualquier operando." },
        { valor: bnf('(expression\n  ("begin" expression (arbno ";" expression) "end")\n  begin-exp)') + opciones(
            "(begin-exp (primera expression?) (resto (list-of expression?)))",
            "(begin-exp (exps (list-of expression?)))",
            "(begin-exp (primera expression?) (resto expression?))"),
          correcta: 0,
          razon: "Es A. Una expresión obligatoria y después el arbno, que deja una lista aparte: son dos campos, no uno. El punto y coma va entre comillas y no deja nada." }
      ],
      cierre:
        "Nadie escribe estos datatypes a mano: los genera " +
        "sllgen:make-define-datatypes leyendo la gramática. Por eso cambiar " +
        "una producción cambia la forma del árbol, y con ella las cláusulas " +
        "del cases que lo recorre."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
