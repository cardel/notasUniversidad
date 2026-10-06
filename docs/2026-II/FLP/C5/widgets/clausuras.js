/* Qué es un procedimiento como valor. Qué guarda la clausura, cuándo se
   evalúa el cuerpo y qué verifica el interpretador antes de aplicar. Los
   resultados están medidos con el interpretador de la sesión; el ambiente
   inicial es [x=4, y=2, z=5] sobre [a=4, b=5, c=6]. */
var BLOQUES = (function () {
  "use strict";
  function c(t) { return "<code>" + t.replace(/</g, "&lt;") + "</code>"; }

  return [
    {
      id: "que-guarda",
      titulo: "1. Qué guarda una clausura",
      definicion:
        "(define-datatype procval procval?\n" +
        "  (closure (lid (list-of symbol?))\n" +
        "           (body expresion?)\n" +
        "           (amb ambiente?)))\n\n" +
        "(proc-exp (ids body) (closure ids body amb))",
      explicacion:
        "Al evaluar un <code>proc</code> no se ejecuta nada del cuerpo: se " +
        "construye un valor con tres cosas adentro. Juzgue cada afirmación.",
      opciones: ["Cierto", "Falso"],
      items: [
        { valor: "La clausura guarda el cuerpo sin evaluar, tal como quedó en el árbol", correcta: 0,
          razon: "El cuerpo es una expresión del árbol y ahí se queda hasta que alguien aplique el procedimiento. Evaluarlo antes sería imposible: faltan los valores de los parámetros." },
        { valor: "La clausura guarda el ambiente donde se la creó", correcta: 0,
          razon: "Ese tercer campo es toda la diferencia entre tener alcance estático y no tenerlo. Sin él, al aplicar el procedimiento el único ambiente a la mano sería el de la llamada." },
        { valor: "La clausura guarda los valores de las variables libres de su cuerpo", correcta: 1,
          razon: "Guarda el ambiente entero, no una copia de los valores que le hacen falta. Es más simple y da lo mismo mientras los ambientes no se modifiquen, que es el caso aquí." },
        { valor: c("let f = proc(u) (g u) in 7") + " se detiene porque " + c("g") + " no existe", correcta: 1,
          razon: "Da 7. El cuerpo (g u) no se evalúa nunca: el let liga f a la clausura y el cuerpo del let no la aplica. Un procedimiento que nadie llama puede mencionar lo que quiera." },
        { valor: c("let f = proc(u) (g u) in (f 1)") + " se detiene porque " + c("g") + " no existe", correcta: 0,
          razon: "Ahora sí se aplica, el cuerpo se evalúa y la búsqueda de g recorre la cadena sin encontrarla. El mismo cuerpo, inofensivo mientras no se use." },
        { valor: "Evaluar " + c("proc(u) *(u,u)") + " a solas no sirve de nada porque no se puede imprimir", correcta: 1,
          razon: "Es una expresión válida y su valor es una clausura, que es un valor del lenguaje como cualquier otro: se puede ligar con let, pasar como argumento y devolver. Que su forma impresa sea incómoda de leer es otra cosa." }
      ],
      cierre:
        "Tres campos y ninguna ejecución: eso es evaluar un proc. El cuerpo " +
        "espera, los parámetros esperan y el ambiente queda guardado. Todo " +
        "el trabajo ocurre después, al aplicar."
    },
    {
      id: "aplicar",
      titulo: "2. Qué pasa al aplicar",
      definicion:
        "(app-exp (rator rands)\n" +
        "  (let ((lrands (map evaluar rands))\n" +
        "        (procV  (evaluar-expresion rator amb)))\n" +
        "    (if (procval? procV)\n" +
        "        (cases procval procV\n" +
        "          (closure (lid body old-amb)\n" +
        "            (if (= (length lid) (length lrands))\n" +
        "                (evaluar-expresion body\n" +
        "                  (ambiente-extendido lid lrands old-amb))\n" +
        "                (eopl:error \"El número de argumentos no es correcto\"))))\n" +
        "        (eopl:error \"No puede evaluarse algo que no sea un procedimiento\"))))",
      explicacion:
        "Con el interpretador de la sesión, diga qué da cada programa.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: c("(proc(u) *(u,3) 5)") +
            ' <span class="candidatos"><b>A.</b> 15 &nbsp; <b>B.</b> se detiene: falta el let &nbsp; <b>C.</b> una clausura</span>',
          correcta: 0,
          razon: "Da 15. El operador de una aplicación es una expresión cualquiera, no hace falta que sea un nombre: aquí el proc se evalúa a una clausura y se aplica de inmediato al 5." },
        { valor: c("(3 4)") +
            ' <span class="candidatos"><b>A.</b> 12 &nbsp; <b>B.</b> se detiene: el operador no es un procedimiento &nbsp; <b>C.</b> 3</span>',
          correcta: 1,
          razon: "La gramática la acepta: entre paréntesis, una expresión seguida de otras es una aplicación. Es el evaluador el que verifica con procval? y aborta, igual que el if verifica con boolean?." },
        { valor: c("let f = proc(u,v) +(u,v) in (f 1 2 3)") +
            ' <span class="candidatos"><b>A.</b> 6 &nbsp; <b>B.</b> 3 &nbsp; <b>C.</b> se detiene: sobra un argumento</span>',
          correcta: 2,
          razon: "Se detiene. Antes de evaluar el cuerpo, el interpretador compara la cantidad de parámetros con la de argumentos y aborta cuando no coinciden: debe enviar 2 y usted ha enviado 3." },
        { valor: c("let f = proc(u,v) +(u,v) in (f 1)") +
            ' <span class="candidatos"><b>A.</b> 1 &nbsp; <b>B.</b> se detiene al buscar v &nbsp; <b>C.</b> se detiene: la cantidad de argumentos no coincide</span>',
          correcta: 2,
          razon: "Se detiene por la misma verificación, ahora al revés: esperaba dos argumentos y llegó uno. El cuerpo no llega a evaluarse, así que el mensaje habla de la llamada y no de v." },
        { valor: c("let doble = proc(n) *(n,2) in (doble (doble z))") +
            ' <span class="candidatos"><b>A.</b> 10 &nbsp; <b>B.</b> 20 &nbsp; <b>C.</b> 25</span>',
          correcta: 1,
          razon: "Da 20. El argumento de la aplicación de afuera es otra aplicación, que se evalúa primero: (doble 5) da 10 y (doble 10) da 20. En este interpretador los operandos se evalúan incluso antes que el operador." }
      ],
      cierre:
        "Aplicar son cuatro pasos: evaluar los operandos, evaluar el " +
        "operador, verificar que sea un procedimiento y que la cantidad de " +
        "argumentos coincida, y recién entonces evaluar el cuerpo en el " +
        "ambiente de la clausura extendido con los parámetros. Las dos " +
        "verificaciones son las que evitan que (3 4) devuelva un número " +
        "inventado o que un argumento de más pase inadvertido."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
