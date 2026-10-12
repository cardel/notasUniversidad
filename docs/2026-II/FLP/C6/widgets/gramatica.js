/* La producción de letrec, trabajada en los dos sentidos: de la gramática a
   los programas que genera, del árbol a los cuatro campos de la variante, y
   de un árbol que la gramática no genera a lo que habría que cambiarle. */
var BLOQUES = (function () {
  "use strict";

  function programa(texto) { return '<code class="programa">' + texto + "</code>"; }

  var PRODUCCION =
    "&lt;expresion&gt; ::= letrec { &lt;identificador&gt; ( {&lt;identificador&gt;}*(,) ) = &lt;expresion&gt; }*\n" +
    "                in &lt;expresion&gt;\n" +
    "                letrec-exp (procnames idss cuerpos cuerpo-letrec)";

  return [
    {
      id: "gramatica-genera",
      titulo: "1. De la gramática a los programas",
      definicion: PRODUCCION,
      explicacion:
        "El <code>*</code> de afuera son las declaraciones y el " +
        "<code>*(,)</code> de adentro son los parámetros de cada una: uno " +
        "repite sin separador y el otro repite con comas. Para cada " +
        "programa, diga si la producción lo genera.",
      opciones: ["Sí la genera", "No la genera"],
      items: [
        { valor: programa("letrec f(n) = add1(n) in (f 1)"),
          correcta: 0,
          razon: "Una declaración con un parámetro y un cuerpo, y después el in con su expresión. Es la forma mínima con una declaración." },
        { valor: programa("letrec x = 5 in +(x,1)"),
          correcta: 1,
          razon: "Falta la lista de parámetros. La producción exige los paréntesis después del identificador, aunque la lista vaya vacía, y por eso letrec solo puede declarar procedimientos. El parser lo rechaza antes de que el evaluador lo vea." },
        { valor: programa("letrec in +(x,1)"),
          correcta: 0,
          razon: "El * de afuera admite cero declaraciones, así que esto se parsea y vale 5: el marco recursivo se construye vacío y la búsqueda de x pasa de largo hasta el ambiente inicial." },
        { valor: programa("letrec tres() = 3 in (tres)"),
          correcta: 0,
          razon: "La lista de parámetros puede ir vacía, y entonces la aplicación va sin argumentos: (tres). Vale 3." },
        { valor: programa("letrec f(n) = add1(n) g(m) = sub1(m) in +((f 1), (g 2))"),
          correcta: 0,
          razon: "Dos declaraciones seguidas, sin separador entre ellas. El * de afuera las junta, y el marco recursivo guarda las dos en sus tres listas paralelas." },
        { valor: programa("letrec f(n) = add1(n), g(m) = sub1(m) in (f 1)"),
          correcta: 1,
          razon: "La coma está entre declaraciones, y ahí no va: el * de afuera repite sin separador. Las comas son del *(,) de adentro, el de los parámetros." },
        { valor: programa("letrec f(n, m) = +(n,m) in (f 1 2)"),
          correcta: 0,
          razon: "Dos parámetros separados por coma, que es lo que pide el *(,). La aplicación, en cambio, va sin comas: (f 1 2)." },
        { valor: programa("letrec f(n m) = +(n,m) in (f 1 2)"),
          correcta: 1,
          razon: "Los dos parámetros van sin separador, y el *(,) pide la coma. Es la confusión al revés de la anterior: la lista de parámetros lleva comas y la de argumentos no." },
        { valor: programa("letrec f = proc(n) add1(n) in (f 1)"),
          correcta: 1,
          razon: "Esto es la forma de let, no de letrec: la parte derecha de una declaración de letrec es el cuerpo del procedimiento, no una expresión proc. Los parámetros van antes del =, entre paréntesis." },
        { valor: programa("letrec f(n) = add1(n) in"),
          correcta: 1,
          razon: "Después del in va una expresión, y aquí no hay ninguna. El cuerpo del letrec no es opcional: es el cuarto campo de la variante." }
      ],
      cierre:
        "Los dos errores que más se repiten son de separador: coma entre " +
        "declaraciones, donde no va, y falta de coma entre parámetros, donde " +
        "sí. Y la forma que parece la de let, con proc en la parte derecha, " +
        "tampoco se parsea, porque los parámetros son parte de la declaración."
    },
    {
      id: "gramatica-campos",
      titulo: "2. Del programa a los cuatro campos",
      definicion:
        "letrec f(n) = add1(n) g(m,k) = *(m,k) in (f (g 2 3))\n\n" +
        "letrec-exp (procnames idss cuerpos cuerpo-letrec)",
      explicacion:
        "El <code>arbno</code> entrega las declaraciones como tres listas " +
        "paralelas, una de nombres, una de listas de parámetros y una de " +
        "cuerpos. Para el programa de arriba, diga qué tiene cada campo.",
      items: [
        { valor: "<code>procnames</code>",
          opciones: ["<code>(f g)</code>", "<code>((f) (g))</code>", "<code>(f (n) g (m k))</code>"],
          correcta: 0,
          razon: "Una lista plana de símbolos, uno por declaración. Los parámetros viven en otro campo." },
        { valor: "<code>idss</code>",
          opciones: ["<code>(n m k)</code>", "<code>((n) (m k))</code>", "<code>((n m k))</code>"],
          correcta: 1,
          razon: "Una lista de listas: la posición i trae los parámetros de la declaración i. Aplanarla perdería de quién es cada parámetro, que es lo que apply-env necesita para armar la clausura." },
        { valor: "<code>cuerpos</code>",
          opciones: ["los árboles de <code>add1(n)</code> y <code>*(m,k)</code>",
                     "los árboles de <code>add1(n)</code>, <code>*(m,k)</code> y <code>(f (g 2 3))</code>",
                     "las clausuras de <code>f</code> y de <code>g</code>"],
          correcta: 0,
          razon: "Dos cuerpos, uno por declaración, y sin evaluar: son árboles de sintaxis abstracta. El cuerpo del letrec es el cuarto campo, aparte. Clausuras no hay ninguna todavía." },
        { valor: "<code>cuerpo-letrec</code>",
          opciones: ["<code>(g 2 3)</code>", "<code>(f (g 2 3))</code>", "<code>add1(n)</code>"],
          correcta: 1,
          razon: "La expresión completa que sigue al in, con su aplicación anidada adentro. Es la única que se evalúa cuando el evaluador llega a la rama letrec-exp." },
        { valor: "El largo de las tres listas de declaraciones",
          opciones: ["siempre es el mismo", "procnames puede ser más corta", "idss puede ser más larga"],
          correcta: 0,
          razon: "Son paralelas: la posición i de las tres describe la declaración i. Por eso apply-env busca la posición del nombre y con ese número indexa las otras dos." }
      ],
      cierre:
        "Cuatro campos, y la forma de cada uno sale de la producción: lo que " +
        "está bajo una estrella llega como lista, y lo que está bajo dos " +
        "—los parámetros, que repiten dentro de una declaración que repite— " +
        "llega como lista de listas."
    },
    {
      id: "gramatica-falta",
      titulo: "3. Del árbol que no se genera a lo que falta",
      explicacion:
        "Cada renglón describe algo que se quisiera escribir y que esta " +
        "producción no genera. Diga qué habría que cambiar para admitirlo.",
      items: [
        { valor: "Declarar un valor: <code>letrec x = 5 in +(x,1)</code>",
          opciones: ["una variante con un campo de expresiones ligadas, en vez de parámetros y cuerpos",
                     "permitir que la lista de parámetros vaya vacía",
                     "nada: ya se genera"],
          correcta: 0,
          razon: "El marco recursivo guarda parámetros y cuerpos, no valores. Admitir x = 5 pide un campo distinto, y con él vuelve el problema que esta forma evita: letrec x = +(x,1) in x pediría el valor de x para calcular el valor de x." },
        { valor: "Un procedimiento sin parámetros: <code>letrec ahora() = 7 in (ahora)</code>",
          opciones: ["una variante nueva", "nada: ya se genera", "quitar los paréntesis de la declaración"],
          correcta: 1,
          razon: "El *(,) admite cero parámetros, así que la lista vacía ya está cubierta y la aplicación va sin argumentos. Vale 7." },
        { valor: "Declarar exactamente un procedimiento y ninguno más",
          opciones: ["cambiar el <code>*</code> de afuera por una sola declaración",
                     "no se puede expresar",
                     "agregar un campo al final"],
          correcta: 0,
          razon: "Sería una producción distinta, con un identificador, una lista de parámetros y un cuerpo en vez del arbno. La variante pasaría de tres listas a tres campos sueltos, y apply-env ya no tendría que buscar posición: compararía un solo nombre." },
        { valor: "Dos declaraciones con el mismo nombre: <code>letrec f(n) = 1 f(n) = 2 in (f 0)</code>",
          opciones: ["la producción no lo genera", "lo genera, y gana la primera", "lo genera, y gana la segunda"],
          correcta: 1,
          razon: "La gramática no mira los nombres, así que el programa se parsea. apply-env recorre procnames de izquierda a derecha y devuelve la clausura del primero que coincida, así que vale 1 y la segunda declaración queda inalcanzable." }
      ],
      cierre:
        "Ir de la gramática al árbol es seguir la receta; ir del árbol que " +
        "falta a la producción es lo que se hace al extender un lenguaje. De " +
        "ahí salen, en este orden, la producción, la variante con sus campos, " +
        "y las cláusulas de parse, unparse y el evaluador."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
