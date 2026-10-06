/* La ligadura local. En qué ambiente se evalúa cada parte de un let, qué
   pasa cuando un nombre se repite y cómo crece la cadena. Los valores se
   midieron con el interpretador de la sesión, cuyo ambiente inicial liga
   x, y, z a 1, 2, 3 en un marco y a, b, c a 4, 5, 6 en el que sigue. */
var BLOQUES = (function () {
  "use strict";
  function c(t) { return "<code>" + t.replace(/</g, "&lt;") + "</code>"; }

  return [
    {
      id: "en-que-ambiente",
      titulo: "1. En qué ambiente se evalúa cada parte",
      definicion:
        "(let-exp (ids rands body)\n" +
        "  (let ((lvalues (map (lambda (x) (evaluar-expresion x amb)) rands)))\n" +
        "    (evaluar-expresion body (ambiente-extendido ids lvalues amb))))",
      explicacion:
        "Con <code>ρ0</code> el ambiente inicial, que son los dos eslabones " +
        "<code>[x=1, y=2, z=3]</code> sobre <code>[a=4, b=5, c=6]</code>, y " +
        "<code>ρ1</code> el que crea el <code>let</code>, diga en cuál se " +
        "evalúa cada parte de <code>let d = -(c, b) in *(d, b)</code>.",
      opciones: ["En ρ0, el de afuera", "En ρ1, el que crea el let"],
      items: [
        { valor: "La expresión ligada, " + c("-(c, b)"), correcta: 0,
          razon: "En el de afuera, y se ve en el código: el map que recorre los rands los evalúa en amb, no en el ambiente extendido, que todavía no existe. Hasta no tener los valores no hay con qué construirlo." },
        { valor: "El cuerpo, " + c("*(d, b)"), correcta: 1,
          razon: "En el nuevo, que es el único donde d significa algo. Ese ambiente se construye justo para esta llamada." },
        { valor: "La " + c("b") + " que aparece dentro del cuerpo", correcta: 1,
          razon: "La búsqueda empieza en ρ1, no la encuentra ahí, pasa de largo por el marco de x, y, z y la halla en el de a, b, c. Se evalúa en ρ1 aunque el valor venga de dos eslabones más atrás: el nuevo no tapa lo que no repite." },
        { valor: "La " + c("c") + " de la expresión ligada", correcta: 0,
          razon: "Está en la parte que se evalúa antes de extender, así que ni siquiera podría ver a ρ1." }
      ],
      cierre:
        "Las dos expresiones del let se evalúan en ambientes distintos, y " +
        "esa asimetría es toda la regla. Por eso let d = -(c, b) in … no es " +
        "circular aunque la parte ligada mencione nombres: los busca donde " +
        "ya estaban."
    },
    {
      id: "el-nombre-repetido",
      titulo: "2. Cuando el nombre ya existía",
      definicion: null,
      explicacion:
        "Recuerde el ambiente inicial: <code>[x=1, y=2, z=3]</code> sobre " +
        "<code>[a=4, b=5, c=6]</code>. Diga cuánto vale cada programa.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: c("let b = 2 in *(b, b)") + ' <span class="candidatos"><b>A.</b> 4 &nbsp; <b>B.</b> 25 &nbsp; <b>C.</b> 10</span>',
          correcta: 0,
          razon: "Da 4. Dentro del cuerpo la búsqueda de b encuentra primero el eslabón nuevo y no sigue hasta el marco donde b vale 5. La ligadura de afuera no se borró: quedó tapada." },
        { valor: c("let b = *(b, b) in b") + ' <span class="candidatos"><b>A.</b> 4 &nbsp; <b>B.</b> 25 &nbsp; <b>C.</b> error</span>',
          correcta: 1,
          razon: "Da 25. La expresión ligada se evalúa en el ambiente viejo, donde b vale 5, así que no hay circularidad: la b nueva vale 25 y solo existe en el cuerpo." },
        { valor: c("let b = 2 in let b = add1(b) in b") + ' <span class="candidatos"><b>A.</b> 3 &nbsp; <b>B.</b> 6 &nbsp; <b>C.</b> 2</span>',
          correcta: 0,
          razon: "Da 3. El add1 se evalúa en el ambiente del primer let, donde b vale 2, no en el inicial ni en el que está creando. Cada let mira el ambiente que tiene encima en ese momento." },
        { valor: c("*(let b = 2 in b, b)") + ' <span class="candidatos"><b>A.</b> 4 &nbsp; <b>B.</b> 10 &nbsp; <b>C.</b> error</span>',
          correcta: 1,
          razon: "Da 10. El ambiente que creó el let terminó con su cuerpo: el segundo operando se evalúa en ρ0, y ahí b sigue valiendo 5. La extensión vale para el cuerpo y para nada más." }
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
        "let m = 2\n" +
        "in let n = add1(m)\n" +
        "   in let m = *(n, n)\n" +
        "      in -(m, n)",
      explicacion:
        "Ese programa crea tres ambientes sobre el inicial. Juzgue cada " +
        "afirmación sobre la cadena que resulta.",
      opciones: ["Cierto", "Falso"],
      items: [
        { valor: "El programa vale 6", correcta: 0,
          razon: "m vale 2, n vale 3, la m nueva vale 9, y la resta da 9 menos 3. Las dos ligaduras de m conviven en la cadena; la búsqueda solo encuentra la última." },
        { valor: "Cuando se evalúa " + c("-(m, n)") + " hay cinco eslabones con ligaduras en la cadena", correcta: 0,
          razon: "Los tres que crearon los let, más los dos del ambiente inicial: [x=1, y=2, z=3] y [a=4, b=5, c=6], y al final el vacío. Nada se quita al entrar: la cadena solo crece hacia adelante." },
        { valor: "La " + c("m") + " que ve " + c("*(n, n)") + " ya no se puede alcanzar desde el cuerpo del tercer let", correcta: 0,
          razon: "Está tapada por la ligadura nueva del mismo nombre, que es la primera que encuentra la búsqueda. Sigue en la cadena, pero no hay forma de nombrarla." },
        { valor: "Si el tercer " + c("let") + " ligara " + c("w") + " en lugar de " + c("m") + ", el programa valdría lo mismo", correcta: 1,
          razon: "Valdría -(m, n) con la m de arriba, que es 2: da menos uno. El nombre escogido cambia qué tapa y qué no, y con eso el resultado." },
        { valor: "El ambiente inicial se consulta alguna vez en este programa", correcta: 1,
          razon: "Ninguna variable del programa es x, y, z, a, b ni c, así que la búsqueda se resuelve en los eslabones de los let y nunca llega a los dos del final. Están ahí, sin usarse." }
      ],
      cierre:
        "La cadena es la historia de los let que se entraron, con el más " +
        "reciente adelante, y debajo de todos los eslabones con que arrancó " +
        "el programa. Buscar es recorrerla desde el frente, y por eso el " +
        "alcance de una ligadura no es una regla aparte: sale de cómo está " +
        "armada la cadena y de por dónde empieza la búsqueda."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
