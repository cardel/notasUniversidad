/* Dibujar la cadena con un marco recursivo. Cuatro programas y, para cada
   uno, un momento de la evaluación: hay que escribir los eslabones que
   existen entonces, del más nuevo al más viejo. La página los dibuja
   mientras se escriben y los compara con los del interpretador. */
var EJERCICIOS = [
  {
    id: "dibujar-letrec-en-let",
    titulo: "1. El marco recursivo encima de un let",
    enunciado:
      "Un <code>let</code> por fuera y el <code>letrec</code> por dentro. El " +
      "momento que se pide es la primera aplicación, antes de que exista " +
      "ningún eslabón de parámetro. El marco recursivo no liga un nombre a " +
      "un valor: guarda las tres listas del <code>letrec</code>, " +
      "<code>procnames</code>, <code>idss</code> y <code>cuerpos</code>, y con " +
      "esos tres nombres se escribe. En <code>cuerpos</code> basta con decir " +
      "que son los cuerpos.",
    programa: "let b = 2 in letrec esc(n) = if ==(n,0) then 1 else *(b, (esc sub1(n))) in (esc 3)",
    momento: "(esc 3)",
    pista:
      "Dos eslabones: el del letrec y el del let. El del letrec va primero " +
      "porque es el más nuevo, y lo que guarda son las tres listas de la " +
      "declaración, no una ligadura con un número.",
    cierre:
      "El marco recursivo cuelga del eslabón del <code>let</code>, así que " +
      "<code>b</code> queda alcanzable desde el cuerpo del procedimiento: la " +
      "clausura captura ese marco y la cadena sigue hacia abajo. Es por eso " +
      "que el programa vale 8 y no se detiene buscando <code>b</code>."
  },
  {
    id: "dibujar-let-adentro",
    titulo: "2. Un let dentro del cuerpo del procedimiento",
    enunciado:
      "El cuerpo del procedimiento abre su propio <code>let</code>. El " +
      "momento es la expresión final de ese <code>let</code>, en la única " +
      "llamada que hay.",
    programa: "letrec f(n) = let d = +(n,1) in *(d,d) in (f 3)",
    momento: "*(d, d)",
    pista:
      "Tres eslabones, y en este orden: el del let del cuerpo, el del " +
      "parámetro de la llamada, y el del letrec. Cada uno cuelga del " +
      "siguiente.",
    cierre:
      "La cadena dentro de un procedimiento tiene tres capas: lo que el " +
      "cuerpo abre, los parámetros con que se lo llamó, y el marco que la " +
      "clausura capturó. Las dos primeras nacen y mueren con la llamada; la " +
      "tercera dura lo que dure el <code>letrec</code>."
  },
  {
    id: "dibujar-dos-marcos",
    titulo: "3. Dos marcos recursivos en la misma cadena",
    enunciado:
      "Hay un <code>letrec</code> dentro del cuerpo de otro " +
      "<code>letrec</code>. El momento es la expresión que se evalúa en el " +
      "fondo. Son cuatro eslabones y dos de ellos son marcos recursivos.",
    programa: "letrec f(n) = letrec g(m) = add1(m) in (g n) in (f 4)",
    momento: "add1(m)",
    pista:
      "Alterne: parámetro, marco, parámetro, marco. El más nuevo es el " +
      "parámetro de <code>g</code>, y el más viejo de los cuatro es el marco " +
      "que declara <code>f</code>.",
    cierre:
      "Un marco recursivo es un eslabón como cualquier otro y se apila igual. " +
      "La búsqueda de <code>m</code> termina en el primero, la de " +
      "<code>g</code> en el segundo y la de <code>f</code> en el cuarto: " +
      "cada nombre se encuentra en el eslabón donde se declaró."
  },
  {
    id: "dibujar-dos-veces-t",
    titulo: "4. El mismo nombre dos veces en la cadena",
    enunciado:
      "<code>t</code> se liga antes del <code>letrec</code> con 10 y después " +
      "con 99, y el cuerpo del procedimiento nombra <code>t</code>. El " +
      "momento es la aplicación, con los dos eslabones de <code>t</code> " +
      "vivos.",
    programa: "let t = 10 in letrec baja(n) = if ==(n,0) then t else (baja sub1(n)) in let t = 99 in (baja 2)",
    momento: "(baja 2)",
    pista:
      "Tres eslabones, y dos de ellos ligan <code>t</code> con valores " +
      "distintos. El orden es el de creación, del más nuevo al más viejo.",
    cierre:
      "En este momento el 99 es el que tapa al 10, y aun así el programa " +
      "vale 10: el cuerpo del procedimiento no se evalúa en esta cadena sino " +
      "en la que arranca del marco que la clausura capturó, y ese marco " +
      "cuelga del eslabón con <code>t = 10</code>. Dibujar las dos cadenas " +
      "—esta y la de la llamada— es lo que separa el alcance estático del " +
      "dinámico."
  }
];

if (typeof module !== "undefined") { module.exports = { EJERCICIOS: EJERCICIOS }; }

if (typeof document !== "undefined") {
  MotorDibujo.montar({ interprete: InterpreteRecursivos, ejercicios: EJERCICIOS,
                       destino: "ejercicios" });
}
