/* Predecir apply-env. Una cadena de ambientes nueva y preguntas sobre qué
   devuelve la búsqueda, en qué orden se construyó y cómo se escribe la misma
   cadena con let. */
var BLOQUES = (function () {
  "use strict";
  var CADENA =
    "(define e\n" +
    "  (extend-env 'a 1\n" +
    "    (extend-env 'b 2\n" +
    "      (extend-env 'a 3\n" +
    "        (extend-env 'c 4\n" +
    "          (empty-env))))))";
  return [
    {
      id: "buscar",
      titulo: "1. Qué devuelve la búsqueda",
      definicion: CADENA,
      explicacion:
        "<code>apply-env</code> avanza del eslabón más nuevo al más viejo y " +
        "se detiene en la primera coincidencia; si llega al vacío, es un " +
        "error. Prediga cada resultado.",
      items: [
        { valor: "<code>(apply-env e 'c)</code>", opciones: ["4", "error", "3"], correcta: 0,
          razon: "Está en el eslabón más viejo, pero está: la búsqueda pasa por a, b y a antes de llegar y lo encuentra." },
        { valor: "<code>(apply-env e 'a)</code>", opciones: ["1", "3", "error"], correcta: 0,
          razon: "Hay dos ligaduras de a y gana la más nueva, que es la primera que la búsqueda ve. La de valor 3 sigue ahí, oculta." },
        { valor: "<code>(apply-env e 'b)</code>", opciones: ["2", "error", "1"], correcta: 0,
          razon: "Una sola ligadura de b, en el segundo eslabón." },
        { valor: "<code>(apply-env e 'd)</code>", opciones: ["#f", "error", "0"], correcta: 1,
          razon: "Ningún eslabón la tiene y la búsqueda llega a (empty-env), que no puede responder: apply-env produce un error. No devuelve #f ni un valor por defecto." },
        { valor: "<code>(apply-env (extend-env->old-env e) 'a)</code>", opciones: ["1", "3", "error"], correcta: 1,
          razon: "extend-env->old-env quita el eslabón de afuera, que era a = 1. En lo que queda, la primera a es la de valor 3: dejó de estar oculta." },
        { valor: "<code>(apply-env (extend-env 'c 9 e) 'c)</code>", opciones: ["4", "9", "error"], correcta: 1,
          razon: "Extender no modifica a e: crea un ambiente nuevo con c = 9 al frente. La búsqueda en ese ambiente encuentra el 9 primero." },
        { valor: "<code>(apply-env e 'c)</code>, después de la anterior", opciones: ["4", "9", "error"], correcta: 0,
          razon: "e no cambió. El ambiente extendido es otro valor; e sigue teniendo c = 4 y ninguna otra c." }
      ],
      cierre:
        "Extender un ambiente produce uno nuevo y deja el viejo intacto. Eso " +
        "es lo que permite que una ligadura oculte a otra sin borrarla: al " +
        "salir del ámbito interior, el ambiente anterior sigue existiendo tal " +
        "como estaba."
    },
    {
      id: "orden",
      titulo: "2. El orden en que se construyó",
      definicion: CADENA,
      explicacion:
        "La expresión se lee de adentro hacia afuera: lo que está más " +
        "anidado se construyó primero.",
      items: [
        { valor: "¿Cuál es la ligadura más antigua?", opciones: ["a = 1", "c = 4", "b = 2"], correcta: 1,
          razon: "Es la que envuelve directamente a (empty-env). Todo lo demás se agregó después, encima de ella." },
        { valor: "¿Cuántos eslabones tiene e, sin contar el vacío?", opciones: ["3", "4", "5"], correcta: 1,
          razon: "Cuatro extend-env. Que dos de ellos liguen el mismo nombre no los funde: son dos eslabones." },
        { valor: "Si se construye <code>(extend-env 'b 7 e)</code>, ¿qué pasa con b = 2?", opciones: ["Se borra", "Queda oculta", "Se reemplaza por 7"], correcta: 1,
          razon: "Sigue en su eslabón. La búsqueda desde el nuevo ambiente encuentra b = 7 antes, pero desde e sigue encontrando b = 2." },
        { valor: "¿Cuál de estas expresiones produce exactamente la cadena e?",
          opciones: ["(let ([a 1]) (let ([b 2]) (let ([a 3]) (let ([c 4]) …))))",
                     "(let ([c 4]) (let ([a 3]) (let ([b 2]) (let ([a 1]) …))))"],
          correcta: 1,
          razon: "El let de afuera es el ambiente más viejo. Para que a = 1 quede al frente tiene que ser el let más interno, y c = 4 el más externo. La primera opción construye la cadena al revés." }
      ],
      cierre:
        "Una cadena de ambientes es la historia de los let anidados que la " +
        "produjeron, leída de adentro hacia afuera. El diagrama con la flecha " +
        "hacia el más viejo y la expresión con let dicen lo mismo."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
