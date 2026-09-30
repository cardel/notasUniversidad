/* ¿Cuánto vale este dato? Un mismo valor de Racket leído bajo distintas
   representaciones del TAD natural. Tres de ellas las vio la sesión; las
   otras dos no, y se definen aquí mismo. */
var BLOQUES = (function () {
  "use strict";
  return [
    {
      id: "leer",
      titulo: "1. Leer el número que hay detrás del dato",
      definicion:
        "unaria      ⌈0⌉ = ()        ⌈n+1⌉ = (cons #t ⌈n⌉)\n" +
        "bignum N    ⌈0⌉ = ()        ⌈n⌉ = (cons r ⌈q⌉) con n = q·N + r, 0 ≤ r < N\n" +
        "anidada     ⌈0⌉ = ()        ⌈n+1⌉ = (list ⌈n⌉)",
      explicacion:
        "En bignum el primer elemento es el dígito <b>menos</b> significativo. " +
        "La representación anidada no aparece en la sesión: un natural es una " +
        "lista vacía envuelta tantas veces como diga el número. Para cada " +
        "dato, escoja el valor.",
      items: [
        { valor: "unaria: <code>(#t #t #t #t)</code>", opciones: ["3", "4", "5"], correcta: 1,
          razon: "Cuatro elementos, cuatro aplicaciones de succ sobre la lista vacía." },
        { valor: "bignum base 10: <code>(1 2)</code>", opciones: ["12", "21", "3"], correcta: 1,
          razon: "El 1 es el dígito de las unidades y el 2 el de las decenas: 1 + 2·10. Leerlo de izquierda a derecha como en papel da 12, que está al revés." },
        { valor: "bignum base 16: <code>(1 2)</code>", opciones: ["18", "33", "21"], correcta: 1,
          razon: "Mismo dato que el anterior y otro número: 1 + 2·16. El valor no está en la lista, está en la lista más la base." },
        { valor: "bignum base 2: <code>(1 0 1)</code>", opciones: ["5", "101", "4"], correcta: 0,
          razon: "1 + 0·2 + 1·4. En base 2 el dato es el número en binario, con el bit menos significativo adelante." },
        { valor: "anidada: <code>(((())))</code>", opciones: ["3", "4", "1"], correcta: 0,
          razon: "La lista vacía es cero; cada par de paréntesis que la envuelve es un succ. Hay tres envolturas alrededor de ()." },
        { valor: "bignum base 10: <code>(0 0 1)</code>", opciones: ["1", "100", "001"], correcta: 1,
          razon: "0 + 0·10 + 1·100. Los ceros adelante son las unidades y las decenas, y valen cero, pero ocupan su posición." },
        { valor: "bignum base 16: <code>(15 15)</code>", opciones: ["30", "255", "1515"], correcta: 1,
          razon: "15 + 15·16 = 255. Es el mayor número que cabe en dos dígitos de base 16, igual que 99 en base 10." },
        { valor: "unaria: <code>()</code>", opciones: ["0", "1", "no es un natural"], correcta: 0,
          razon: "La lista vacía es ⌈0⌉ en las tres representaciones con listas. Es el único dato que las tres comparten." }
      ],
      cierre:
        "Un mismo dato es un número distinto según la representación, y la " +
        "representación no viene escrita en el dato. Por eso el cliente no " +
        "puede leerlo por su cuenta: solo la interfaz sabe qué significa."
    },
    {
      id: "ambiguo",
      titulo: "2. Lo que el dato solo no puede decir",
      explicacion:
        "Ahora sin decir la representación, o con un dato que no encaja en " +
        "ella. La pregunta cambia: ya no es cuánto vale, sino si se puede " +
        "saber.",
      items: [
        { valor: "<code>(1 2)</code>, sin saber la representación. ¿Qué número es?", opciones: ["12", "21", "No se puede saber"], correcta: 2,
          razon: "Es 21 en base 10, 33 en base 16, 5 en base 2, y no es un natural en la unaria ni en la anidada. Sin la representación, la lista no dice nada." },
        { valor: "<code>(#t #t)</code> leído como bignum base 10", opciones: ["2", "11", "No es un dato de esa representación"], correcta: 2,
          razon: "Los elementos tienen que ser dígitos entre 0 y 9. #t no lo es: el dato está bien formado para la unaria y mal formado para bignum." },
        { valor: "<code>(10)</code> leído como bignum base 10", opciones: ["10", "1", "No es un dato de esa representación"], correcta: 2,
          razon: "Un dígito en base 10 va de 0 a 9. El 10 se escribe (0 1). Que Racket acepte la lista no la vuelve un ⌈n⌉." },
        { valor: "<code>(3 0)</code> leído como bignum base 10", opciones: ["3", "30", "No es un dato de esa representación"], correcta: 2,
          razon: "Sumando da 3, pero la definición no lo produce: ⌈0⌉ es la lista vacía, así que ⌈3⌉ es (3) y nada más. Un cero al final solo sale de armar el dato a mano. Que la cuenta cuadre no lo hace legal." },
        { valor: "¿<code>(equal? '(3 0) '(3))</code>?", opciones: ["#t", "#f"], correcta: 1,
          razon: "Son listas distintas. Si un cliente armó (3 0) a mano creyendo que vale 3, equal? contra el ⌈3⌉ legítimo dice que no. Por eso los datos solo se construyen con los constructores y se comparan por la interfaz." },
        { valor: "En bignum, ¿<code>(is-zero? '(0))</code>?", opciones: ["#t", "#f"], correcta: 1,
          razon: "is-zero? compara con zero, que es la lista vacía. (0) no es (), así que responde #f aunque valga cero. Es el precio de una representación donde un número tiene varias formas, y la razón para que succ y pred nunca produzcan (0)." }
      ],
      cierre:
        "La representación es un contrato entre el constructor y el " +
        "observador. Un dato que llega por fuera de ese contrato —armado a " +
        "mano, o con una forma que los constructores nunca producen— puede " +
        "ser aceptado por Racket y aun así no significar nada."
    },
    {
      id: "operar",
      titulo: "3. Operar sin salirse de la representación",
      explicacion:
        "Los constructores tienen que producir datos bien formados, y en " +
        "bignum eso significa manejar el acarreo y el préstamo. Prediga cada " +
        "resultado.",
      items: [
        { valor: "bignum base 10: <code>(succ '(9))</code>", opciones: ["(10)", "(0 1)", "(9 1)"], correcta: 1,
          razon: "9 + 1 = 10, que no cabe en un dígito: queda 0 y se lleva 1 a la siguiente posición, que no existía y se crea." },
        { valor: "bignum base 10: <code>(succ '(9 9))</code>", opciones: ["(0 0 1)", "(10 9)", "(0 10)"], correcta: 0,
          razon: "El acarreo se propaga: 9 pasa a 0 y lleva, el siguiente 9 también pasa a 0 y lleva, y el 1 final abre una posición nueva. 99 + 1 = 100." },
        { valor: "bignum base 10: <code>(pred '(0 1))</code>", opciones: ["(9)", "(-1 1)", "(0 0)"], correcta: 0,
          razon: "10 − 1 = 9. El 0 de las unidades pide prestado: se vuelve 9 y la decena baja a 0. Y esa decena en cero, al final, se quita: el resultado es (9), no (9 0)." },
        { valor: "bignum base 16: <code>(succ '(15))</code>", opciones: ["(16)", "(0 1)", "(15 1)"], correcta: 1,
          razon: "En base 16 el dígito máximo es 15. Un paso más lo lleva a 0 con acarreo: 16 = (0 1)." },
        { valor: "unaria: <code>(pred '(#t #t #t))</code>", opciones: ["(#t #t)", "(#t #t #f)", "2"], correcta: 0,
          razon: "pred es cdr: quita un #t. El resultado sigue siendo un dato de la representación unaria, no un número de Racket." },
        { valor: "anidada: <code>(succ '(()))</code>", opciones: ["(() ())", "((()))", "(#t ())"], correcta: 1,
          razon: "succ envuelve una vez más: (list ⌈1⌉) = ((())). Poner dos vacías una al lado de la otra sería otra representación, no esta." }
      ],
      cierre:
        "El acarreo y el préstamo no son detalles de la aritmética: son lo " +
        "que mantiene el dato dentro de la representación. Un succ que " +
        "devolviera (10) rompería a todos los demás procedimientos, aunque " +
        "el número fuera el correcto."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
