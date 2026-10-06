/* La ligadura local con varias ligaduras a la vez. Todas las partes
   derechas se evalúan en el ambiente de afuera y después se extiende una
   sola vez, y de ahí salen los casos al borde. env0 liga x = 4, y = 2,
   z = 5; los valores están medidos con el interpretador de la sesión. */
var BLOQUES = (function () {
  "use strict";
  function c(t) { return "<code>" + t.replace(/</g, "&lt;") + "</code>"; }

  return [
    {
      id: "cuanto-da",
      titulo: "1. Cuánto da cada let",
      definicion:
        "(let {<identificador> = <expresion>}* in <expresion>)     let-exp (ids rands body)\n\n" +
        "(let-exp (ids rands body)\n" +
        "  (value-of body (extend-env ids (eval-rands rands env) env)))\n\n" +
        "env0 liga  x = 4   y = 2   z = 5",
      explicacion:
        "Mire en qué ambiente se evalúa cada parte derecha antes de " +
        "responder.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: c("(let a = (+ y 1) in (let a = (* a 2) in (sub1 a)))") +
            ' <span class="candidatos"><b>A.</b> 5 &nbsp; <b>B.</b> 11 &nbsp; <b>C.</b> 2</span>',
          correcta: 0,
          razon: "Da 5. La a de afuera vale 3; la de adentro se calcula con esa, (* 3 2) = 6, y el cuerpo da 5. Cada let ve el ambiente que tiene encima en ese momento, no el inicial." },
        { valor: c("(let z = (add1 z) in (* z z))") +
            ' <span class="candidatos"><b>A.</b> 25 &nbsp; <b>B.</b> 36 &nbsp; <b>C.</b> se detiene: z se define en términos de sí misma</span>',
          correcta: 1,
          razon: "Da 36. La parte derecha se evalúa en el ambiente de afuera, donde z todavía vale 5, así que la z nueva vale 6. No hay circularidad: son dos ligaduras distintas que por casualidad comparten nombre." },
        { valor: c("(let x = 1 in (let x = (+ x 1) w = (* x 10) in (+ x w)))") +
            ' <span class="candidatos"><b>A.</b> 12 &nbsp; <b>B.</b> 22 &nbsp; <b>C.</b> 24</span>',
          correcta: 0,
          razon: "Da 12. Las dos partes derechas del let interno se evalúan donde x vale 1: x pasa a 2 y w a 10. Quien lea de arriba abajo esperará que w use la x nueva y calcule 20; la regla dice que no." },
        { valor: c("(let p = 10 q = (add1 p) in (- q p))") +
            ' <span class="candidatos"><b>A.</b> 1 &nbsp; <b>B.</b> 11 &nbsp; <b>C.</b> se detiene: p no está ligada</span>',
          correcta: 2,
          razon: "Se detiene. La ligadura de p todavía no existe cuando se evalúa la parte derecha de q, y en env0 no hay ninguna p. Un let con varias ligaduras no es una cadena de lets anidados." },
        { valor: c("(let t = (let p = 3 q = 4 in (* p q)) in (+ t y))") +
            ' <span class="candidatos"><b>A.</b> 14 &nbsp; <b>B.</b> 12 &nbsp; <b>C.</b> se detiene: p no está ligada en el cuerpo</span>',
          correcta: 0,
          razon: "Da 14. El let interno sí puede estar en una parte derecha: crea su ambiente, calcula 12 y ese ambiente desaparece. Lo que sobrevive es el valor, no las ligaduras que lo produjeron." }
      ],
      cierre:
        "La regla cabe en una línea: las partes derechas se evalúan en el " +
        "ambiente de afuera y después se extiende una sola vez con todos " +
        "los nombres. Los tres casos raros de arriba —la variable que se " +
        "redefine con su propio valor, la que no ve a su vecina, el " +
        "ambiente que aparece y desaparece— son consecuencias de esa línea."
    },
    {
      id: "una-sola-extension",
      titulo: "2. Una sola extensión, no varias",
      definicion:
        "(let a = e1  b = e2  c = e3  in  cuerpo)",
      explicacion:
        "Compare ese <code>let</code> de tres ligaduras con tres " +
        "<code>let</code> anidados que liguen lo mismo. Juzgue cada " +
        "afirmación.",
      opciones: ["Cierto", "Falso"],
      items: [
        { valor: "Los dos crean la misma cantidad de ambientes", correcta: 1,
          razon: "El de tres ligaduras crea uno solo, con los tres nombres adentro; los anidados crean tres eslabones. La cadena queda de distinto largo aunque el cuerpo vea los mismos nombres." },
        { valor: "En los anidados, " + c("e2") + " puede usar " + c("a"), correcta: 0,
          razon: "En los anidados la ligadura de a ya existe cuando se evalúa e2, porque e2 está en el cuerpo del primer let. Esa es la diferencia con la forma de una sola extensión." },
        { valor: "Si " + c("e1") + ", " + c("e2") + " y " + c("e3") + " no se mencionan entre sí, las dos formas dan el mismo valor", correcta: 0,
          razon: "Cuando ninguna parte derecha menciona los nombres que el let está ligando, da igual cuál de las dos formas se use: todas se evalúan en ambientes donde esos nombres significan lo mismo." },
        { valor: "El orden en que se escriben las tres ligaduras cambia el resultado", correcta: 1,
          razon: "Como todas se evalúan en el mismo ambiente, el orden no importa. En los anidados sí importaría, porque cada uno ve lo que ligó el anterior." },
        { valor: "Si dos ligaduras del mismo " + c("let") + " tienen el mismo nombre, la cadena queda con dos ligaduras de ese nombre en el mismo eslabón", correcta: 0,
          razon: "Van las dos al mismo eslabón y la búsqueda encuentra la primera de la lista: el interpretador arma el ambiente con los dos pares y ninguna se pierde." }
      ],
      cierre:
        "Que la extensión sea una sola es lo que hace que las ligaduras de " +
        "un mismo let sean simultáneas y no sucesivas. Cuando se quiere que " +
        "una vea a la otra, la forma es anidar, y escribirlo así lo deja " +
        "dicho en el programa."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
