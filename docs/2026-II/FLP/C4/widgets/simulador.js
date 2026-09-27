/* El interpretador por dentro. Primero se predice qué hace el interpretador
   con un programa, y después la página muestra sus tres etapas: los tokens
   que emite el scanner, el árbol que arma el parser y la traza del
   evaluador, fila por fila con su ambiente y su valor. Al final, la misma
   máquina abierta para cualquier programa que se escriba.

   El ambiente inicial es el de la sesión: i = 1, v = 5, x = 10. */
var PREDICCIONES = [
  {
    id: "predecir-primitivas",
    titulo: "1. Una expresión con dos primitivas",
    enunciado:
      "Antes de ver nada, responda: ¿cuánto vale el programa, cuántas veces " +
      "se llama a <code>eval-expression</code> y cuántas a " +
      "<code>apply-primitive</code>? Recuerde el ambiente inicial: " +
      "<code>i = 1</code>, <code>v = 5</code>, <code>x = 10</code>.",
    programa: "+(sub1(v), *(i, x))",
    campos: ["valor", "evalExp", "applyPrim"],
    pista:
      "eval-expression se llama una vez por cada nodo del árbol, y el árbol " +
      "tiene un nodo por cada número, por cada variable y por cada llamada a " +
      "una primitiva. apply-primitive se llama una vez por cada primitiva."
  },
  {
    id: "predecir-ambiente",
    titulo: "2. Dónde se busca cada variable",
    enunciado:
      "La misma variable aparece tres veces. ¿Cuántas búsquedas en el " +
      "ambiente hace el interpretador, y cuánto da?",
    programa: "*(v, -(v, sub1(v)))",
    campos: ["valor", "applyEnv", "applyPrim"],
    pista:
      "Cada var-exp que se evalúa es una búsqueda, aunque sea la misma " +
      "variable: el interpretador no recuerda lo que ya buscó."
  },
  {
    id: "predecir-let",
    titulo: "3. Un let que usa la variable que va a tapar",
    enunciado:
      "La expresión ligada menciona la misma variable que el <code>let</code> " +
      "declara. ¿Cuánto da, y cuántos ambientes se crean además del inicial?",
    programa: "let v = *(v, v) in -(v, x)",
    campos: ["valor", "ambientes", "evalExp"],
    pista:
      "La expresión ligada se evalúa en el ambiente de afuera, donde v " +
      "todavía vale lo de antes. El ambiente nuevo solo existe para el cuerpo."
  },
  {
    id: "predecir-anidados",
    titulo: "4. Tres let, uno dentro de otro",
    enunciado:
      "Aquí la cadena de ambientes crece tres veces y un nombre se repite. " +
      "¿Cuánto da el programa y cuántas búsquedas en el ambiente hace?",
    programa: "let a = add1(i) in let b = *(a, v) in let a = -(b, x) in +(a, b)",
    campos: ["valor", "applyEnv", "ambientes"],
    pista:
      "La búsqueda recorre la cadena desde el eslabón más nuevo y se detiene " +
      "en la primera ligadura que encuentra con ese nombre."
  },
  {
    id: "predecir-tokens",
    titulo: "5. Lo que ve el scanner",
    enunciado:
      "Esta vez la pregunta es sobre la primera etapa. ¿Cuántos tokens emite " +
      "el scanner? El comentario empieza en <code>%</code> y llega hasta el " +
      "fin de la línea.",
    programa: "sub1(add1(x))   % dos primitivas seguidas",
    campos: ["tokens", "valor", "evalExp"],
    pista:
      "Los espacios y el comentario no dejan token. Cada paréntesis y cada " +
      "coma sí, y el nombre de una primitiva es un token completo."
  }
];

var EJEMPLOS = [
  "let x = 5 in -(x, 3)",
  "*(add1(x), -(v, i))",
  "let z = -(x, i) in *(z, z)",
  "add1(x, 3)",
  "-(x, -3)",
  "let add1 = 5 in add1",
  "5x"
];

if (typeof module !== "undefined") { module.exports = { PREDICCIONES: PREDICCIONES, EJEMPLOS: EJEMPLOS }; }

if (typeof document !== "undefined") {
  MotorSimulador.montar({
    predicciones: PREDICCIONES, destino: "predicciones",
    libre: "libre", ejemplos: EJEMPLOS
  });
}
