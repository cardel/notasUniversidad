/* La ligadura local. En qué ambiente se evalúa cada parte de un let, qué
   pasa cuando un nombre se repite y cómo crece la cadena. Los valores se
   midieron con el interpretador de la sesión, con i = 1, v = 5, x = 10. */
var BLOQUES = (function () {
  "use strict";
  function c(t) { return "<code>" + t.replace(/</g, "&lt;") + "</code>"; }

  return [
    {
      id: "en-que-ambiente",
      titulo: "1. En qué ambiente se evalúa cada parte",
      definicion:
        "(let-exp (id rand body)\n" +
        "  (let ((val (eval-expression rand env)))\n" +
        "    (eval-expression body\n" +
        "                     (extend-env (list id) (list val) env))))",
      explicacion:
        "Con <code>ρ0</code> el ambiente inicial y <code>ρ1</code> el que " +
        "crea el <code>let</code>, diga en cuál se evalúa cada parte de " +
        "<code>let a = -(x, v) in *(a, v)</code>.",
      opciones: ["En ρ0, el de afuera", "En ρ1, el que crea el let"],
      items: [
        { valor: "La expresión ligada, " + c("-(x, v)"), correcta: 0,
          razon: "En el de afuera, y se ve en el código: la llamada usa env, no el ambiente extendido, que todavía no existe. Hasta no tener el valor no hay con qué construirlo." },
        { valor: "El cuerpo, " + c("*(a, v)"), correcta: 1,
          razon: "En el nuevo, que es el único donde a significa algo. Ese ambiente se construye justo para esta llamada." },
        { valor: "La " + c("v") + " que aparece dentro del cuerpo", correcta: 1,
          razon: "La búsqueda empieza en ρ1, no lo encuentra ahí y sigue por la cadena hasta ρ0. Se evalúa en ρ1 aunque el valor venga de más atrás: el eslabón nuevo no tapa lo que no repite." },
        { valor: "La " + c("x") + " de la expresión ligada", correcta: 0,
          razon: "Está en la parte que se evalúa antes de extender, así que ni siquiera podría ver a ρ1." }
      ],
      cierre:
        "Las dos expresiones del let se evalúan en ambientes distintos, y " +
        "esa asimetría es toda la regla. Por eso let a = -(x, v) in … no es " +
        "circular aunque la parte ligada mencione nombres: los busca donde " +
        "ya estaban."
    },
    {
      id: "el-nombre-repetido",
      titulo: "2. Cuando el nombre ya existía",
      definicion: null,
      explicacion:
        "Recuerde el ambiente inicial: <code>i = 1</code>, <code>v = 5</code>, " +
        "<code>x = 10</code>. Diga cuánto vale cada programa.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: c("let v = 2 in *(v, v)") + ' <span class="candidatos"><b>A.</b> 4 &nbsp; <b>B.</b> 25 &nbsp; <b>C.</b> 10</span>',
          correcta: 0,
          razon: "Da 4. Dentro del cuerpo la búsqueda de v encuentra primero el eslabón nuevo y no llega al inicial. La ligadura de afuera no se borró: quedó tapada." },
        { valor: c("let v = *(v, v) in v") + ' <span class="candidatos"><b>A.</b> 4 &nbsp; <b>B.</b> 25 &nbsp; <b>C.</b> error</span>',
          correcta: 1,
          razon: "Da 25. La expresión ligada se evalúa en el ambiente viejo, donde v vale 5, así que no hay circularidad: la v nueva vale 25 y solo existe en el cuerpo." },
        { valor: c("let v = 2 in let v = add1(v) in v") + ' <span class="candidatos"><b>A.</b> 3 &nbsp; <b>B.</b> 6 &nbsp; <b>C.</b> 2</span>',
          correcta: 0,
          razon: "Da 3. El add1 se evalúa en el ambiente del primer let, donde v vale 2, no en el inicial ni en el que está creando. Cada let mira el ambiente que tiene encima en ese momento." },
        { valor: c("*(let v = 2 in v, v)") + ' <span class="candidatos"><b>A.</b> 4 &nbsp; <b>B.</b> 10 &nbsp; <b>C.</b> error</span>',
          correcta: 1,
          razon: "Da 10. El ambiente que creó el let terminó con su cuerpo: el segundo operando se evalúa en ρ0, donde v sigue valiendo 5. La extensión vale para el cuerpo y para nada más." }
      ],
      cierre:
        "Extender no modifica: construye un eslabón nuevo que apunta al " +
        "anterior. Por eso una ligadura tapa a la que tenía el mismo nombre " +
        "mientras dura el cuerpo, y al salir reaparece la de antes sin que " +
        "nadie tenga que restaurarla."
    },
    {
      id: "la-cadena",
      titulo: "3. La cadena de ambientes",
      definicion:
        "let a = 2\n" +
        "in let b = add1(a)\n" +
        "   in let a = *(b, b)\n" +
        "      in -(a, b)",
      explicacion:
        "Ese programa crea tres ambientes sobre el inicial. Juzgue cada " +
        "afirmación sobre la cadena que resulta.",
      opciones: ["Cierto", "Falso"],
      items: [
        { valor: "El programa vale 6", correcta: 0,
          razon: "a vale 2, b vale 3, la a nueva vale 9, y la resta da 9 menos 3. Las dos ligaduras de a conviven en la cadena; la búsqueda solo encuentra la última." },
        { valor: "Cuando se evalúa " + c("-(a, b)") + " hay cuatro eslabones en la cadena", correcta: 0,
          razon: "Los tres que crearon los let más el inicial, que sigue al final con i, v y x. Nada se quita al entrar: la cadena solo crece hacia adelante." },
        { valor: "La " + c("a") + " de " + c("*(b, b)") + " ya no se puede alcanzar desde el cuerpo del tercer let", correcta: 0,
          razon: "Está tapada por la ligadura nueva del mismo nombre, que es la primera que encuentra la búsqueda. Sigue en la cadena, pero no hay forma de nombrarla." },
        { valor: "Si el tercer " + c("let") + " ligara " + c("z") + " en lugar de " + c("a") + ", el programa valdría lo mismo", correcta: 1,
          razon: "Valdría -(a, b) con la a de arriba, que es 2: da menos uno. El nombre escogido cambia qué tapa y qué no, y con eso el resultado." },
        { valor: "El ambiente inicial se consulta alguna vez en este programa", correcta: 1,
          razon: "Ninguna variable del programa es i, v ni x, así que la búsqueda nunca llega hasta el final de la cadena. El eslabón está ahí, sin usarse." }
      ],
      cierre:
        "La cadena es la historia de los let que se entraron, con el más " +
        "reciente adelante. Buscar es recorrerla desde el frente, y por eso " +
        "el alcance de una ligadura no es una regla aparte: sale de cómo " +
        "está armada la cadena y de por dónde empieza la búsqueda."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
