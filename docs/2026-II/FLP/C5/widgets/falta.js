/* Qué le falta al evaluador. Con el lenguaje de la sesión anterior —números,
   variables, primitivas y ligadura local— hay cosas que no se pueden
   escribir, y otras que se calculan pero no sirven para nada. De ahí salen
   el condicional y los procedimientos. */
var BLOQUES = (function () {
  "use strict";
  function c(t) { return "<code>" + t.replace(/</g, "&lt;") + "</code>"; }

  return [
    {
      id: "se-puede-escribir",
      titulo: "1. Lo que se puede y lo que no",
      definicion:
        "Lo que había hasta la sesión pasada, con env0 ligando x = 4, y = 2, z = 5:\n\n" +
        "  (+ e e)  (- e e)  (* e e)  (add1 e)  (sub1 e)  (zero? e)  (> e e)  (< e e)\n" +
        "  (let id = e … in e)",
      explicacion:
        "Para cada encargo, diga si con eso basta o si hace falta algo que " +
        "el lenguaje todavía no tiene.",
      opciones: ["Se puede escribir", "Falta algo en el lenguaje"],
      items: [
        { valor: "El doble de " + c("z") + " menos uno", correcta: 0,
          razon: "Es (sub1 (* z 2)): primitivas anidadas y nada más. Todo lo que sea una fórmula fija sobre valores conocidos ya se puede." },
        { valor: "Darle nombre a un cálculo largo para no repetirlo dentro de una expresión", correcta: 0,
          razon: "Para eso está el let: nombra el valor y el cuerpo lo usa las veces que quiera. Lo que no puede es nombrar el cálculo para repetirlo con otros datos." },
        { valor: "La diferencia entre " + c("x") + " e " + c("y") + ", restando siempre el menor del mayor", correcta: 1,
          razon: "Hay dos respuestas posibles según cuál sea mayor, y no hay forma de escoger entre ellas: falta el condicional. Se puede saber cuál es mayor con (> x y), pero no hacer nada distinto según la respuesta." },
        { valor: "Calcular " + c("(+ (* 3 3) (* 4 4))") + " y también " + c("(+ (* 5 5) (* 12 12))"), correcta: 0,
          razon: "Se puede, escribiendo las dos expresiones. Lo que no se puede es escribir una sola vez la forma del cálculo y aplicarla a los dos pares: para eso falta el procedimiento." },
        { valor: "Nombrar el cálculo " + c("x² + y²") + " y usarlo con dos pares distintos", correcta: 1,
          razon: "El let le da nombre a un valor ya calculado, no a un cálculo con huecos: fija los x e y del momento. Nombrar un cálculo dejando huecos para llenarlos después es lo que hace proc." },
        { valor: "Preguntar si " + c("(- x y)") + " es cero", correcta: 0,
          razon: "(zero? (- x y)) se escribe y se evalúa. Otra cosa es que sirva de algo: el booleano que produce no tiene adónde ir." }
      ],
      cierre:
        "Las dos cosas que faltan aparecen juntas en este diagnóstico: " +
        "escoger entre dos caminos, que es el condicional, y nombrar un " +
        "cálculo con huecos para llenarlos después, que es el " +
        "procedimiento. Ninguna de las dos se puede imitar con lo que había."
    },
    {
      id: "los-valores-crecen",
      titulo: "2. Los valores del lenguaje crecen",
      definicion:
        "Antes:  valor expresado = valor denotado = Número\n" +
        "Hoy:    valor expresado = valor denotado = Número + Booleano + Procedimiento",
      explicacion:
        "Juzgue cada afirmación sobre ese cambio.",
      opciones: ["Cierto", "Falso"],
      items: [
        { valor: c("(zero? (- x 4))") + " ya se podía escribir antes de esta sesión", correcta: 0,
          razon: "Se podía escribir y se podía evaluar: produce un booleano. Lo que no había era ninguna variante del lenguaje que recibiera ese booleano y decidiera algo con él, así que el valor se calculaba y se perdía." },
        { valor: "Los dos conjuntos crecen a la par porque un " + c("let") + " puede ligar cualquier expresión", correcta: 0,
          razon: "Lo que una expresión produce es también lo que una variable puede tener ligado, porque la parte derecha de un let es una expresión cualquiera. Por eso ahora una variable puede quedar ligada a un procedimiento." },
        { valor: "Un procedimiento es un valor como cualquier otro: se puede ligar con " + c("let") + " y pasar como argumento", correcta: 0,
          razon: "Esa es la consecuencia de que esté en los dos conjuntos. Un procedimiento que recibe o devuelve procedimientos no necesita ninguna regla nueva." },
        { valor: "Con valores de tres clases, el interpretador tiene que verificar antes de operar", correcta: 0,
          razon: "Cuando solo había números no había nada que confundir. Ahora la prueba de un if puede no ser booleana y el operador de una aplicación puede no ser un procedimiento, y las dos cosas hay que mirarlas antes de actuar." },
        { valor: "Para que un procedimiento sea un valor hay que agregar una variante al datatype de expresiones", correcta: 1,
          razon: "Las variantes del árbol son formas sintácticas, no valores. El procedimiento como valor vive en un datatype aparte, procval, que es donde está la clausura; proc-exp es la expresión que lo construye." }
      ],
      cierre:
        "Cada vez que el conjunto de valores crece aparecen dos tareas: una " +
        "forma sintáctica para construir los valores nuevos y una " +
        "verificación en los lugares donde antes no podía llegar otra cosa. " +
        "El condicional y la aplicación son esos dos lugares."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
