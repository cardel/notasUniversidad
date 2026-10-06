/* El interpretador por dentro. Primero se predice qué hace el interpretador
   con un programa, y después la página muestra sus tres etapas: los tokens
   que emite el scanner, el árbol que arma el parser y la traza del
   evaluador, fila por fila con su ambiente y su valor. Al final, la misma
   máquina abierta para cualquier programa que se escriba.

   El ambiente inicial tiene dos eslabones: x = 1, y = 2, z = 3 sobre
   a = 4, b = 5, c = 6, y de ahí al vacío. */
var PREDICCIONES = [
  {
    id: "predecir-primitivas",
    titulo: "1. Primitivas anidadas, y una con tres operandos",
    enunciado:
      "Antes de ver nada, responda: ¿cuánto vale el programa, cuántas veces " +
      "se llama a <code>evaluar-expresion</code> y cuántas a " +
      "<code>evaluar-primitiva</code>? El ambiente inicial liga " +
      "<code>x = 1</code>, <code>y = 2</code>, <code>z = 3</code> en el " +
      "primer eslabón y <code>a = 4</code>, <code>b = 5</code>, " +
      "<code>c = 6</code> en el segundo.",
    programa: "+(sub1(b), *(y, c), x)",
    campos: ["valor", "evalExp", "applyPrim"],
    pista:
      "evaluar-expresion se llama una vez por cada nodo del árbol, y el árbol " +
      "tiene un nodo por cada número, por cada variable y por cada llamada a " +
      "una primitiva. evaluar-primitiva se llama una vez por primitiva, con " +
      "todos sus operandos en una lista: la suma de tres operandos es una " +
      "sola llamada, no dos."
  },
  {
    id: "predecir-ambiente",
    titulo: "2. Dónde se busca cada variable",
    enunciado:
      "La misma variable aparece tres veces y la resta lleva tres operandos. " +
      "¿Cuántas búsquedas en el ambiente hace el interpretador, cuántas veces " +
      "aplica una primitiva y cuánto da?",
    programa: "*(b, -(b, sub1(b), y))",
    campos: ["valor", "applyEnv", "applyPrim"],
    pista:
      "Cada var-exp que se evalúa es una búsqueda, aunque sea la misma " +
      "variable: el interpretador no recuerda lo que ya buscó. Y la resta " +
      "n-aria es el primer operando menos la suma de los demás, así que " +
      "-(b, sub1(b), y) es 5 - (4 + 2)."
  },
  {
    id: "predecir-let",
    titulo: "3. Un let que usa la variable que va a tapar",
    enunciado:
      "La expresión ligada menciona la misma variable que el <code>let</code> " +
      "declara, y el cuerpo usa una del segundo eslabón. ¿Cuánto da, cuántos " +
      "ambientes se crean además del inicial y cuántas llamadas a " +
      "<code>evaluar-expresion</code> hay?",
    programa: "let b = *(b, b) in -(b, c)",
    campos: ["valor", "ambientes", "evalExp"],
    pista:
      "La expresión ligada se evalúa en el ambiente de afuera, donde b " +
      "todavía vale 5. El eslabón nuevo solo existe para el cuerpo, y la " +
      "búsqueda de c lo recorre sin encontrarla antes de seguir hacia el " +
      "segundo eslabón del ambiente inicial."
  },
  {
    id: "predecir-anidados",
    titulo: "4. Tres let, uno dentro de otro",
    enunciado:
      "Aquí la cadena de ambientes crece tres veces y dos de los nombres " +
      "ligados ya existían en el ambiente inicial. ¿Cuánto da el programa, " +
      "cuántas búsquedas en el ambiente hace y cuántos ambientes se crean?",
    programa: "let a = add1(y) in let b = *(a, c) in let a = -(b, y) in +(a, b)",
    campos: ["valor", "applyEnv", "ambientes"],
    pista:
      "La búsqueda recorre la cadena desde el eslabón más nuevo y se detiene " +
      "en la primera ligadura que encuentra con ese nombre, así que la a del " +
      "let tapa la a = 4 del segundo eslabón."
  },
  {
    id: "predecir-tokens",
    titulo: "5. Lo que ve el scanner",
    enunciado:
      "Esta vez la pregunta es sobre la primera etapa. ¿Cuántos tokens emite " +
      "el scanner? El comentario empieza en <code>%</code> y llega hasta el " +
      "fin de la línea.",
    programa: "/(c, add1(x))   % la primitiva nueva",
    campos: ["tokens", "valor", "evalExp"],
    pista:
      "Los espacios y el comentario no dejan token. Cada paréntesis y cada " +
      "coma sí, y el nombre de una primitiva es un token completo. La " +
      "división n-aria divide el primer operando por el producto de los demás."
  }
];

var EJEMPLOS = [
  "+(x, y, z)",
  "-(c, y, x)",
  "/(c, y)",
  "let w = -(c, y) in *(w, w)",
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
