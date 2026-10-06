/* Dibujar la cadena de ambientes. Cinco programas y, para cada uno, un
   momento concreto de la evaluación: hay que escribir los eslabones que
   existen entonces, del más nuevo al más viejo. La página los dibuja
   mientras se escriben y los compara con los del interpretador. */
var EJERCICIOS = [
  {
    id: "dibujar-dos-lets",
    titulo: "1. Dos let anidados",
    enunciado:
      "Cada <code>let</code> crea un eslabón sobre el que ya había. Empiece " +
      "por el que exista cuando se evalúa el cuerpo más interno.",
    programa: "(let a = 3 in (let b = (* a a) in (- a b)))",
    momento: "(- a b)",
    pista:
      "Hay dos let, así que hay dos eslabones sobre env0. El más nuevo es el " +
      "del let interno.",
    cierre:
      "Los eslabones aparecen en el orden en que se entró a los let, y el " +
      "más nuevo queda al frente: es donde empieza toda búsqueda."
  },
  {
    id: "dibujar-let-multiple",
    titulo: "2. Un let que liga dos nombres",
    enunciado:
      "Aquí el primer <code>let</code> liga dos nombres de una sola vez. " +
      "Decida si eso son uno o dos eslabones.",
    programa: "(let m = 2 n = 5 in (let p = (* m n) in (+ p m)))",
    momento: "(+ p m)",
    pista:
      "Un let con varias ligaduras extiende una sola vez: los dos nombres " +
      "van juntos en el mismo eslabón, separados por coma.",
    cierre:
      "Dos nombres en un eslabón y no dos eslabones. Por eso las partes " +
      "derechas de ese let no se ven entre sí: cuando se evalúan, ese " +
      "eslabón todavía no existe."
  },
  {
    id: "dibujar-de-paso",
    titulo: "3. El ambiente de paso",
    enunciado:
      "El momento que se pide está <em>dentro</em> de la parte derecha del " +
      "<code>let</code> externo, antes de que ese <code>let</code> ligue " +
      "nada. Mire bien qué existe ya y qué no.",
    programa: "(let t = (let u = 2 in (* u u)) in (add1 t))",
    momento: "(* u u)",
    pista:
      "El let externo todavía no ha creado su eslabón: está calculando el " +
      "valor que va a ligar. El único que existe es el del let interno.",
    cierre:
      "Ese eslabón vive mientras se calcula la parte derecha y después nadie " +
      "lo alcanza. De él sobrevive el valor que se ligó a t, no sus " +
      "ligaduras."
  },
  {
    id: "dibujar-clausura",
    titulo: "4. El cuerpo de un procedimiento",
    enunciado:
      "Ahora el momento está dentro del cuerpo de un procedimiento. El " +
      "eslabón del parámetro cuelga de alguna parte: decida de cuál, y qué " +
      "eslabones quedan por debajo.",
    programa: "(let f = (proc (k) (+ k y)) in (let y = 100 in (f 3)))",
    momento: "(+ k y)",
    pista:
      "El cuerpo se evalúa en el ambiente que la clausura capturó, extendido " +
      "con el parámetro. ¿Qué había cuando se evaluó el proc? Los eslabones " +
      "creados después de eso no están en esta cadena.",
    cierre:
      "Ni el eslabón de f ni el de y aparecen: la clausura capturó env0, " +
      "que era lo que había cuando se evaluó el proc. Por eso la y del " +
      "cuerpo vale 2 y no 100, y por eso el alcance es estático."
  },
  {
    id: "dibujar-currificado",
    titulo: "5. Un procedimiento que devolvió otro",
    enunciado:
      "El procedimiento que se aplica al final lo devolvió otra aplicación " +
      "que ya terminó. Su cadena conserva algo de aquella.",
    programa: "(let s = (proc (a) (proc (b) (+ a b))) in (let d = (s 4) in (d 6)))",
    momento: "(+ a b)",
    pista:
      "Dos eslabones sobre env0: el del parámetro de la aplicación que está " +
      "corriendo y el de la aplicación que creó esta clausura.",
    cierre:
      "El eslabón con a sigue ahí aunque la aplicación de s haya terminado " +
      "hace rato: la clausura lo guardó y eso lo mantiene vivo. Es lo que " +
      "hace que un procedimiento devuelto recuerde con qué se construyó."
  }
];

if (typeof module !== "undefined") { module.exports = { EJERCICIOS: EJERCICIOS }; }

if (typeof document !== "undefined") {
  MotorDibujo.montar({ ejercicios: EJERCICIOS, destino: "ejercicios" });
}
