/* Los dos conjuntos de valores y el punto de entrada. Qué puede resultar de
   evaluar una expresión, qué puede quedar ligado a un nombre, y qué hace
   eval-program antes de llamar al evaluador. */
var BLOQUES = (function () {
  "use strict";
  function c(t) { return "<code>" + t.replace(/</g, "&lt;") + "</code>"; }

  return [
    {
      id: "expresado-o-denotado",
      titulo: "1. Valores expresados y valores denotados",
      definicion:
        "Valor expresado: lo que puede resultar de evaluar una expresión.\n" +
        "Valor denotado:  lo que puede quedar ligado a una variable,\n" +
        "                 es decir, lo que guarda un ambiente.\n\n" +
        "En el lenguaje de esta sesión los dos conjuntos son el mismo: Número.",
      explicacion:
        "Juzgue cada afirmación sobre esos dos conjuntos en el lenguaje de " +
        "la sesión.",
      opciones: ["Cierto", "Falso"],
      items: [
        { valor: "Que los dos conjuntos coincidan es una casualidad de este lenguaje, no una ley", correcta: 0,
          razon: "Coinciden porque el único valor que hay es el número. En un lenguaje con paso por referencia lo denotado es una referencia y lo expresado un valor, y los dos conjuntos se separan." },
        { valor: c("eval-expression") + " puede devolver algo que no sea un valor expresado", correcta: 1,
          razon: "Por definición, los valores expresados son justamente los posibles resultados de evaluar una expresión. Si el evaluador devolviera algo más, el conjunto estaría mal definido." },
        { valor: "Agregar " + c("zero?") + " y el condicional obliga a agrandar los dos conjuntos", correcta: 0,
          razon: "zero? devuelve un booleano, así que el expresado pasa a ser número o booleano. Y como let puede ligar el resultado de cualquier expresión, lo denotado crece igual." },
        { valor: "El ambiente inicial guarda tres valores denotados", correcta: 0,
          razon: "init-env liga i, v y x a 1, 5 y 10. Son tres valores guardados en un ambiente, que es la definición de valor denotado." },
        { valor: "Definir estos dos conjuntos es parte de diseñar el lenguaje, no de programarlo", correcta: 0,
          razon: "Se deciden antes de escribir el evaluador y condicionan todo lo demás: qué puede devolver una primitiva, qué puede ligar un let y qué tiene que saber representar el ambiente." }
      ],
      cierre:
        "Los dos conjuntos son la primera decisión de un lenguaje y la que " +
        "más consecuencias tiene. Se escriben antes que el evaluador porque " +
        "son su especificación: dicen qué tipos de cosas van a circular."
    },
    {
      id: "el-punto-de-entrada",
      titulo: "2. El punto de entrada",
      definicion:
        "(define eval-program\n" +
        "  (lambda (pgm)\n" +
        "    (cases program pgm\n" +
        "      (a-program (body)\n" +
        "        (eval-expression body (init-env))))))\n\n" +
        "(define init-env\n" +
        "  (lambda ()\n" +
        "    (extend-env '(i v x) '(1 5 10) (empty-env))))",
      explicacion:
        "Ese es todo el punto de entrada del interpretador. Juzgue cada " +
        "afirmación.",
      opciones: ["Cierto", "Falso"],
      items: [
        { valor: "El datatype " + c("program") + " tiene una sola variante y aun así vale la pena", correcta: 0,
          razon: "Separa el programa de la expresión: hoy a-program solo envuelve una expresión, pero es el lugar donde después entran las declaraciones que van antes del cuerpo, como los registros del proyecto." },
        { valor: "Si el ambiente inicial estuviera vacío, " + c("*(v, i)") + " seguiría funcionando", correcta: 1,
          razon: "Con empty-env la búsqueda de v falla y el programa se detiene. Solo seguirían funcionando los que no mencionan ninguna variable, como sub1(7)." },
        { valor: "El interpretador es un cliente del TAD ambiente, como cualquier otro", correcta: 0,
          razon: "Usa empty-env, extend-env y apply-env sin saber cómo están hechos por dentro. Cambiar la representación de listas a procedimientos no obliga a tocar ni una línea del evaluador." },
        { valor: c("init-env") + " es un procedimiento y no una constante por una razón", correcta: 0,
          razon: "Se llama en cada ejecución, así que cada programa arranca con un ambiente recién construido. Con una constante compartida, cualquier cosa que lo modificara afectaría a la siguiente ejecución." },
        { valor: "Las variables " + c("i") + ", " + c("v") + " y " + c("x") + " son parte del lenguaje", correcta: 1,
          razon: "Son una comodidad del ambiente inicial para poder probar sin escribir un let. El lenguaje es el mismo si arranca con otro ambiente; la gramática no las menciona." }
      ],
      cierre:
        "El punto de entrada hace dos cosas y ninguna es evaluar: abre el " +
        "programa para sacar su expresión y arma el ambiente donde se " +
        "evaluará. Todo lo demás lo hace eval-expression."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
