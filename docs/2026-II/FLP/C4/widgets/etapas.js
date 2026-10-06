/* ¿Quién hace cada cosa? El reparto del trabajo entre el scanner, el parser
   y el interpretador, y en qué etapa se detiene cada programa que no llega
   a dar un valor. Todo lo que se afirma aquí se comprobó contra el
   interpretador de la sesión. */
var BLOQUES = (function () {
  "use strict";
  function c(t) { return "<code>" + t.replace(/</g, "&lt;") + "</code>"; }

  return [
    {
      id: "quien-lo-hace",
      titulo: "1. ¿Quién hace cada cosa?",
      definicion: "texto  →  [scanner]  →  tokens  →  [parser]  →  AST  →  [interpretador]  →  valor",
      explicacion:
        "Las tres etapas se reparten el trabajo de convertir una cadena de " +
        "caracteres en un número. Para cada tarea, diga cuál de las tres la " +
        "hace.",
      opciones: ["Scanner", "Parser", "Interpretador"],
      items: [
        { valor: "Tirar a la basura los espacios que separan las palabras", correcta: 0,
          razon: "El scanner los consume y no emite token por ellos. Al parser nunca le llegan, y por eso escribir (x , 3) o (x,3) produce exactamente el mismo árbol." },
        { valor: "Tirar a la basura lo que va después de un <code>%</code>", correcta: 0,
          razon: "Un comentario es asunto léxico: la regla del comentario tiene salida skip, así que el scanner lo lee y no emite nada. Ninguna etapa posterior sabe que existió." },
        { valor: "Convertir los caracteres <code>4</code> y <code>2</code> en el número 42", correcta: 0,
          razon: "La salida number de la regla léxica es la que hace esa conversión: el token ya lleva un número de Racket, no una cadena. Por eso el evaluador nunca convierte texto." },
        { valor: "Decidir que en " + c("-(x, 3)") + " hay una primitiva con dos operandos", correcta: 1,
          razon: "Es la estructura del programa, y la estructura la arma el parser siguiendo la gramática. El scanner solo había visto seis tokens sueltos, sin relación entre ellos." },
        { valor: "Averiguar que " + c("b") + " vale 5", correcta: 2,
          razon: "La búsqueda en el ambiente ocurre al evaluar un var-exp. El parser puso el nombre en el árbol y no le interesó su valor: el mismo árbol sirve con cualquier ambiente." },
        { valor: "Rechazar " + c("let x 5 in x") + ", que perdió el signo igual", correcta: 1,
          razon: "Los tokens son legales uno por uno, así que el scanner los emite sin queja. Es el parser el que, siguiendo la producción del let, esperaba = y encontró 5." },
        { valor: "Rechazar " + c("w") + ", que nadie ligó", correcta: 2,
          razon: "El programa está bien escrito y el árbol se arma sin problema: (var-exp w). El error aparece al evaluar, cuando apply-env recorre la cadena y no encuentra el nombre." },
        { valor: "Rechazar " + c("let add1 = 5 in add1"), correcta: 1,
          razon: "add1 es un literal de la gramática, así que el scanner lo emite como tal y no como identificador. El parser pedía un identificador después de let y encontró otra cosa: el mensaje habla de eso." },
        { valor: "Calcular que " + c("add1(b, 3)") + " vale 6", correcta: 2,
          razon: "El parser acepta cualquier cantidad de operandos porque la gramática los declara como una lista separada por comas. Es evaluar-primitiva la que le suma 1 al primero y no mira el resto: devuelve 6 sin avisar que sobraba un operando." }
      ],
      cierre:
        "Cada etapa sabe menos de lo que uno supondría. El scanner no sabe " +
        "qué es un let: solo que esas tres letras forman un token. El parser " +
        "no sabe cuánto vale una variable ni cuántos operandos necesita una " +
        "primitiva. Y el interpretador ya no ve paréntesis ni comas, porque " +
        "el árbol se los comió."
    },
    {
      id: "entra-y-sale",
      titulo: "2. Qué recibe y qué produce",
      definicion: null,
      explicacion:
        "Cada etapa transforma una cosa en otra. Escoja qué produce la que " +
        "se nombra.",
      opciones: ["Una cadena de caracteres", "Una lista de tokens", "Un árbol de sintaxis abstracta", "Un valor"],
      items: [
        { valor: "El scanner produce…", correcta: 1,
          razon: "Una secuencia plana de tokens, cada uno con su lexema y su clase. Plana: el scanner no anida nada, solo corta." },
        { valor: "El parser produce…", correcta: 2,
          razon: "El árbol, que es donde aparece la jerarquía: qué operando pertenece a qué primitiva, qué expresión es el cuerpo de qué let." },
        { valor: "El interpretador produce…", correcta: 3,
          razon: "Un valor del lenguaje, que en esta sesión es siempre un número. Con las primitivas de comparación y el condicional el conjunto crece a números y booleanos." },
        { valor: "El parser recibe…", correcta: 1,
          razon: "Los tokens del scanner, no el texto. Por eso el parser no puede quejarse de un carácter raro: ese error ya lo habría dado el scanner." },
        { valor: "El interpretador recibe el árbol y además…", correcta: 3,
          razon: "Un ambiente, que es el otro argumento de evaluar-expresion y el que dice cuánto vale cada nombre libre. El mismo árbol con otro ambiente da otro valor." }
      ],
      cierre:
        "Lo que sale de una etapa es lo único que recibe la siguiente. Esa " +
        "es la razón de que se puedan cambiar por separado: escribir otro " +
        "scanner que acepte comentarios de bloque no obliga a tocar el " +
        "evaluador, y cambiar la aritmética del evaluador no obliga a tocar " +
        "la gramática."
    },
    {
      id: "donde-se-detiene",
      titulo: "3. ¿Hasta dónde llega cada programa?",
      definicion: null,
      explicacion:
        "Con el ambiente inicial <code>[x=1, y=2, z=3]</code> sobre " +
        "<code>[a=4, b=5, c=6]</code>, diga en qué etapa se detiene cada " +
        "programa, o si llega hasta el final y da un valor.",
      opciones: ["Se detiene en el scanner", "Se detiene en el parser", "Se detiene al evaluar", "Da un valor"],
      items: [
        { valor: c("*(c, b)"), correcta: 3,
          razon: "Pasa las tres etapas y da 30. Es el caso corriente y sirve de contraste con los demás." },
        { valor: c("let 5 = x in 5"), correcta: 1,
          razon: "El scanner emite let, 5, =, x, in, 5 sin problema: todos son tokens legales. El parser es el que pide un identificador después de let y encuentra un número." },
        { valor: c("*(b, w)"), correcta: 2,
          razon: "El árbol se arma completo, con (var-exp w) adentro. Solo al evaluar ese nodo se recorre la cadena de ambientes sin encontrar w." },
        { valor: c("-(c, 3"), correcta: 1,
          razon: "Falta el paréntesis de cierre. Los cinco tokens que hay son legales, así que el scanner no se queja; el parser llega al final de los tokens todavía esperando el paréntesis." },
        { valor: c("*(c, b) 7"), correcta: 1,
          razon: "La expresión está completa y el 7 sobra. El parser termina de armar el árbol y le quedan tokens sin consumir, que es otra forma de error de sintaxis." },
        { valor: c("sub1(7)"), correcta: 3,
          razon: "Da 6, y no hace falta que el 7 esté ligado a nada: es un literal. Este programa no consulta el ambiente ni una vez." },
        { valor: c("-(9)"), correcta: 3,
          razon: "Da 9. La resta es n-aria: el primer operando menos la suma de los demás, y la suma de ninguno es 0. Con un solo operando devuelve ese operando." },
        { valor: c("-()"), correcta: 2,
          razon: "El parser lo acepta porque la gramática admite cero o más operandos. La resta toma el primero con car y la lista está vacía: el mensaje viene de Racket y habla de pares, no del lenguaje." }
      ],
      cierre:
        "La etapa donde algo falla dice de qué tipo es el problema. Léxico: " +
        "hay un carácter que ninguna regla reconoce. Sintáctico: los tokens " +
        "están bien pero no en un orden que la gramática genere. Y lo que " +
        "aparece al evaluar es de otra clase: el programa estaba bien " +
        "escrito y lo que falla es lo que dice."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
