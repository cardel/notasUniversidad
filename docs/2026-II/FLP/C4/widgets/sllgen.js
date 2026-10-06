/* Leer una especificación de SLLGEN. Las tres partes de una regla léxica y
   su salida, y lo que cada producción de la gramática deja en el datatype
   que SLLGEN genera. Las reglas y las producciones son las del sintaxis.rkt
   de la sesión. */
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
        "reconocerla. Escoja la salida que le corresponde a cada regla de la " +
        "especificación de la sesión.",
      opciones: ["skip", "symbol", "number"],
      items: [
        { valor: c('(espacio-blanco (whitespace) ???)'), correcta: 0,
          razon: "Los espacios se reconocen para poder descartarlos: sin esta regla el scanner se atascaría en el primer espacio, pero con salida symbol emitiría un token por cada uno." },
        { valor: c('(comentario ("%" (arbno (not #\\newline))) ???)'), correcta: 0,
          razon: "Misma idea que los espacios: se reconoce para tirarlo. La expresión regular dice «un por ciento y después cualquier cosa que no sea fin de línea, cero o más veces»." },
        { valor: c('(identificador (letter (arbno (or letter digit "?" "$"))) ???)'), correcta: 1,
          razon: "El lexema se convierte en símbolo de Scheme, que es lo que después guarda el campo del var-exp y lo que apply-env compara con equal? contra los nombres de cada marco." },
        { valor: c('(numero (digit (arbno digit)) ???)'), correcta: 2,
          razon: "La conversión de texto a número ocurre aquí, en el scanner. Por eso el campo del lit-exp ya trae un número y el evaluador se limita a devolverlo." },
        { valor: c('(numero ("-" digit (arbno digit)) ???)'), correcta: 2,
          razon: "Es la misma categoría con otra expresión regular: un menos pegado a los dígitos. La especificación tiene cuatro reglas de número, enteros y decimales, positivos y negativos, y las cuatro emiten tokens de la misma clase." }
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
        "<code>(letter (arbno (or letter digit \"?\" \"$\")))</code>.",
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
          razon: "El signo de interrogación está entre las alternativas del arbno, así que dato? es un solo lexema y sirve como nombre de variable." },
        { valor: c("dos-partes"), correcta: 1,
          razon: "El guion no está en la regla: ni es letra, ni dígito, ni el signo de interrogación, ni el de dólar. El scanner corta en tres tokens, dos y partes con el menos suelto en medio." }
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
        "dejan un campo por cada elemento no literal que repiten, y cada\n" +
        "uno de esos campos es una lista.",
      explicacion:
        "SLLGEN genera un <code>define-datatype</code> a partir de la " +
        "gramática: una variante por producción. Escoja la variante que " +
        "genera cada una. Los nombres de los campos son los que después les " +
        "pone la cláusula del <code>cases</code>; SLLGEN los numera.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: bnf('(expresion (numero) lit-exp)') + opciones(
            "(lit-exp (dato number?))",
            "(lit-exp (dato expresion?))",
            "(lit-exp)"),
          correcta: 0,
          razon: "Es A. numero es un terminal que lleva información, así que deja un campo, y el predicado es el de Scheme que reconoce lo que el scanner ya convirtió." },
        { valor: bnf('(expresion (identificador) var-exp)') + opciones(
            "(var-exp (id expresion?))",
            "(var-exp (id symbol?))",
            "(var-exp)"),
          correcta: 1,
          razon: "Es B. La regla léxica del identificador tiene salida symbol, así que lo que llega al campo es un símbolo, no una expresión. Ese símbolo es lo que apply-env busca en la cadena." },
        { valor: bnf('(expresion\n  (primitiva "(" (separated-list expresion ",") ")")\n  prim-exp)') + opciones(
            "(prim-exp (prim primitiva?) (args expresion?))",
            "(prim-exp (prim primitiva?) (args (list-of expresion?)))",
            "(prim-exp (abre string?) (args (list-of expresion?)) (cierra string?))"),
          correcta: 1,
          razon: "Es B. Los paréntesis y la coma están entre comillas y no dejan campo; la separated-list deja uno solo, que es la lista de operandos. Por eso evaluar-primitiva recibe una lista y las cuatro aritméticas son n-arias: +(x, y, z) vale 6." },
        { valor: bnf('(primitiva ("add1") add-prim)') + opciones(
            "(add-prim (nombre string?))",
            "(add-prim (arg expresion?))",
            "(add-prim)"),
          correcta: 2,
          razon: "Es C. La producción solo tiene un literal, así que la variante no tiene campos. El operando no está aquí: vive en la lista de args del prim-exp, y por eso la misma primitiva sirve con cualquier operando." },
        { valor: bnf('(expresion\n  ("let" (arbno identificador "=" expresion) "in" expresion)\n  let-exp)') + opciones(
            "(let-exp (ids (list-of symbol?)) (rands (list-of expresion?)) (body expresion?))",
            "(let-exp (ligaduras (list-of expresion?)) (body expresion?))",
            "(let-exp (id symbol?) (rand expresion?) (body expresion?))"),
          correcta: 0,
          razon: "Es A. El arbno repite tres elementos y uno de ellos es el literal =, que no deja campo: quedan dos listas paralelas, los nombres y las expresiones ligadas, y el cuerpo va aparte. Por eso let u = 1 v = 2 in +(u, v) liga dos nombres de una vez y el evaluador recibe ids, rands y body." }
      ],
      cierre:
        "Nadie escribe estos datatypes a mano: los genera " +
        "sllgen:make-define-datatypes leyendo la gramática, y no les pone " +
        "nombre a los campos, los numera. Por eso cambiar una producción " +
        "cambia la forma del árbol, y con ella las cláusulas del cases que " +
        "lo recorre."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
