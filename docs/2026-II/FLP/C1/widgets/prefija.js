/* Notación prefija y definición de funciones. El primer contacto con Racket:
   el operador va adelante, los paréntesis son la llamada y una definición no
   es más que darle nombre a una expresión. El código del estudiante corre
   sobre mini-scheme.js. */
var RETOS = (function () {
  "use strict";
  return [
    {
      id: "promedio",
      titulo: "1. El operador va primero",
      enunciado:
        "En Racket no se escribe <code>(a + b) / 3</code> sino que el " +
        "operador encabeza cada paréntesis. Escriba <code>promedio</code>, " +
        "que recibe tres números y devuelve el promedio. El paréntesis de " +
        "afuera decide qué operación manda: aquí manda la división, y la " +
        "suma es uno de sus dos argumentos.",
      gramatica: null,
      esqueleto:
        "(define (promedio a b c)\n" +
        "  ???)\n",
      pruebas: [
        { llamada: "(promedio 3 4 5)", esperado: "4" },
        { llamada: "(promedio 10 20 30)", esperado: "20" },
        { llamada: "(promedio 0 0 3)", esperado: "1" },
        { llamada: "(promedio 6 6 6)", esperado: "6" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(promedio 3 4 5)" && obtenido === "8.666666666666666") {
          return "Se dividió solo el último número. La suma completa tiene " +
            "que quedar dentro del paréntesis de la división, como su primer " +
            "argumento.";
        }
        if (obtenido === "12" || obtenido === "60" || obtenido === "18") {
          return "Eso es la suma sin dividir. Falta el paréntesis de " +
            "afuera, que es el que aplica la división al resultado.";
        }
        return "Revise cuál operación queda por fuera. La que encabeza el " +
          "paréntesis exterior es la última que se aplica.";
      },
      cierre:
        "El anidamiento de los paréntesis es el orden de evaluación, y por " +
        "eso no hacen falta reglas de precedencia: lo que en otro lenguaje " +
        "decide una tabla, aquí lo decide dónde se abre el paréntesis."
    },
    {
      id: "grados",
      titulo: "2. Una fórmula con tres operaciones",
      enunciado:
        "La conversión de grados Celsius a Fahrenheit es multiplicar por " +
        "nueve quintos y sumar treinta y dos. Escríbala como " +
        "<code>celsius-&gt;fahrenheit</code>. El nombre incluye una flecha " +
        "porque en Racket un identificador admite signos que en otros " +
        "lenguajes son operadores: <code>-&gt;</code>, <code>?</code> y " +
        "<code>!</code> son letras más, y la convención los usa para decir " +
        "qué hace el procedimiento.",
      gramatica: null,
      esqueleto:
        "(define (celsius->fahrenheit c)\n" +
        "  ???)\n",
      pruebas: [
        { llamada: "(celsius->fahrenheit 0)", esperado: "32" },
        { llamada: "(celsius->fahrenheit 100)", esperado: "212" },
        { llamada: "(celsius->fahrenheit 25)", esperado: "77" },
        { llamada: "(celsius->fahrenheit -40)", esperado: "-40" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(celsius->fahrenheit 0)" && obtenido !== "32") {
          return "Con cero grados el producto se anula y debe quedar solo el " +
            "treinta y dos. Si dio otra cosa, la suma está adentro del " +
            "producto en vez de afuera.";
        }
        if (llamada === "(celsius->fahrenheit 100)" && obtenido === "180") {
          return "Falta sumar treinta y dos: eso es solo el producto por " +
            "nueve quintos.";
        }
        return "Multiplicar y después sumar significa que la suma queda en " +
          "el paréntesis de afuera y el producto adentro.";
      },
      cierre:
        "La fórmula quedó escrita como se lee de afuera hacia adentro: sumar " +
        "treinta y dos a algo, y ese algo es el producto."
    },
    {
      id: "entre",
      titulo: "3. Comparar también es prefijo",
      enunciado:
        "Escriba <code>entre?</code>, que responde si <code>x</code> está " +
        "entre <code>a</code> y <code>b</code>, incluyendo los extremos. " +
        "Las comparaciones se escriben igual que la aritmética, con el " +
        "operador adelante, y <code>and</code> junta las dos condiciones. " +
        "El signo de interrogación al final del nombre es la convención " +
        "para los procedimientos que devuelven un booleano.",
      gramatica: null,
      esqueleto:
        "(define (entre? x a b)\n" +
        "  (and ??? ???))\n",
      pruebas: [
        { llamada: "(entre? 5 1 10)", esperado: "#t" },
        { llamada: "(entre? 1 1 10)", esperado: "#t" },
        { llamada: "(entre? 10 1 10)", esperado: "#t" },
        { llamada: "(entre? 0 1 10)", esperado: "#f" },
        { llamada: "(entre? 11 1 10)", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(entre? 1 1 10)" || llamada === "(entre? 10 1 10)") {
          return "El extremo cuenta como adentro, así que la comparación es " +
            "<= y no <.";
        }
        if (llamada === "(entre? 11 1 10)" && obtenido === "#t") {
          return "Se está verificando un solo lado. Con las dos " +
            "comparaciones puestas, un valor por encima de b tiene que " +
            "fallar la segunda.";
        }
        return "Son dos comparaciones: que a no supere a x, y que x no " +
          "supere a b.";
      },
      cierre:
        "<code>and</code> no es un procedimiento cualquiera: evalúa de " +
        "izquierda a derecha y se detiene apenas algo resulte falso. Esa " +
        "parada temprana es lo que permite poner primero la condición que " +
        "protege a la segunda."
    },
    {
      id: "signo",
      titulo: "4. Tres casos y un símbolo por respuesta",
      enunciado:
        "Escriba <code>signo</code>, que devuelve el símbolo " +
        "<code>positivo</code>, <code>negativo</code> o <code>cero</code> " +
        "según el número que reciba. Un símbolo se escribe con una comilla " +
        "adelante, <code>'positivo</code>, y la comilla es lo que impide " +
        "que Racket lo trate como el nombre de una variable y salga a " +
        "buscar su valor.",
      gramatica: null,
      esqueleto:
        "(define (signo n)\n" +
        "  (cond (??? ???)\n" +
        "        (??? ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(signo 7)", esperado: "positivo" },
        { llamada: "(signo -3)", esperado: "negativo" },
        { llamada: "(signo 0)", esperado: "cero" },
        { llamada: "(signo -0.5)", esperado: "negativo" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("no está ligada") !== -1) {
          return "Falta la comilla: sin ella Racket lee positivo como una " +
            "variable y sale a buscar qué vale.";
        }
        if (llamada === "(signo 0)" && obtenido !== "cero") {
          return "El cero cae en una cláusula que no le corresponde. Ni es " +
            "mayor ni es menor, así que solo lo atrapa la cláusula que " +
            "quede de última.";
        }
        return "Las cláusulas se prueban en orden y gana la primera que " +
          "resulte verdadera.";
      },
      cierre:
        "Un símbolo es un dato, no un texto ni una variable. Compararlos con " +
        "<code>eq?</code> es inmediato, y por eso son la forma natural de " +
        "nombrar los casos de un lenguaje: las etiquetas de los árboles de " +
        "sintaxis abstracta son símbolos."
    },
    {
      id: "reloj",
      titulo: "5. Nombrar los resultados intermedios",
      enunciado:
        "Escriba <code>reloj</code>, que convierte una cantidad de segundos " +
        "en una lista de tres números: horas, minutos y segundos. " +
        "<code>quotient</code> da la división entera y <code>remainder</code> " +
        "el residuo. Con <code>let*</code> cada ligadura puede usar las " +
        "anteriores, que es justo lo que hace falta cuando el resto de una " +
        "división alimenta la siguiente.",
      gramatica: null,
      esqueleto:
        "(define (reloj segs)\n" +
        "  (let* ((horas ???)\n" +
        "         (resto ???)\n" +
        "         (minutos ???))\n" +
        "    (list horas minutos ???)))\n",
      pruebas: [
        { llamada: "(reloj 3725)", esperado: "(1 2 5)" },
        { llamada: "(reloj 59)", esperado: "(0 0 59)" },
        { llamada: "(reloj 60)", esperado: "(0 1 0)" },
        { llamada: "(reloj 7200)", esperado: "(2 0 0)" },
        { llamada: "(reloj 0)", esperado: "(0 0 0)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(reloj 3725)" && obtenido === "(1 62 5)") {
          return "Los minutos se sacaron de los segundos originales y no de " +
            "lo que sobró al quitar las horas. Ahí es donde entra resto.";
        }
        if (obtenido.indexOf("3725") !== -1 || obtenido.indexOf("59") === 0) {
          return "El último elemento son los segundos que sobran después de " +
            "quitar horas y minutos, no los que entraron.";
        }
        return "Tres mil seiscientos segundos son una hora y sesenta son un " +
          "minuto. Cada división entera deja un residuo, y ese residuo es " +
          "lo que se sigue repartiendo.";
      },
      cierre:
        "<code>let*</code> encadena: cada nombre queda visible para los que " +
        "vienen después. Con <code>let</code> a secas las tres ligaduras se " +
        "evalúan contra el ambiente de afuera y <code>resto</code> no " +
        "existiría todavía."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
