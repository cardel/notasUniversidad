/* Recorrer con cases. Un datatype nuevo, los comandos de un robot, y cuatro
   procedimientos que lo analizan por casos. Los valores no son listas, así
   que car y cdr no sirven sobre ellos: la única forma de abrirlos es cases.
   El código del estudiante corre sobre mini-scheme.js. */
var GRAMATICA =
  "&lt;cmd&gt; ::= (avanza &lt;número&gt;)              avanza-cmd (n)\n" +
  "      ::= (gira &lt;dirección&gt;)             gira-cmd (dir)\n" +
  "      ::= (repite &lt;número&gt; &lt;cmd&gt; ...)    repite-cmd (n cmds)";

var DATATYPE =
  "(define-datatype cmd cmd?\n" +
  "  (avanza-cmd (n number?))\n" +
  "  (gira-cmd   (dir symbol?))\n" +
  "  (repite-cmd (n number?) (cmds (list-of cmd?))))\n";

var EJEMPLOS =
  "\n;; Dos programas del robot, para las pruebas.\n" +
  "(define cuadrado\n" +
  "  (repite-cmd 4 (list (avanza-cmd 5) (gira-cmd 'der))))\n" +
  "(define zigzag\n" +
  "  (repite-cmd 2 (list (avanza-cmd 3)\n" +
  "                      (gira-cmd 'izq)\n" +
  "                      (repite-cmd 2 (list (avanza-cmd 1) (gira-cmd 'der))))))\n";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "cases-distancia",
      titulo: "1. Cuánto avanza en total",
      enunciado:
        "Escriba <code>distancia</code>, que suma todo lo que el robot avanza. " +
        "Un giro no avanza, y un <code>repite</code> avanza <code>n</code> " +
        "veces lo que avancen sus comandos. Los comandos de adentro vienen en " +
        "una lista, así que hace falta un auxiliar que la recorra y sume.",
      gramatica: GRAMATICA,
      esqueleto:
        DATATYPE + EJEMPLOS + "\n" +
        "(define (distancia c)\n" +
        "  (cases cmd c\n" +
        "    (avanza-cmd (n) ???)\n" +
        "    (gira-cmd (dir) ???)\n" +
        "    (repite-cmd (n cmds) ???)))\n" +
        "\n" +
        "(define (distancia-lista cmds)\n" +
        "  (if (null? cmds)\n" +
        "      ???\n" +
        "      (+ ??? ???)))\n",
      pruebas: [
        { llamada: "(distancia (avanza-cmd 7))", esperado: "7" },
        { llamada: "(distancia (gira-cmd 'izq))", esperado: "0" },
        { llamada: "(distancia cuadrado)", esperado: "20" },
        { llamada: "(distancia zigzag)", esperado: "10" },
        { llamada: "(distancia (repite-cmd 3 '()))", esperado: "0" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(distancia cuadrado)" && obtenido === "5") {
          return "Se contó una sola vuelta. El repite multiplica por n lo que " +
            "avancen sus comandos.";
        }
        if (llamada === "(distancia zigzag)" && obtenido === "8") {
          return "El repite de adentro también multiplica. distancia-lista " +
            "llama a distancia sobre cada comando, y distancia ya sabe qué " +
            "hacer con un repite.";
        }
        return "Tres cláusulas: el número, cero, y n por lo que sume la " +
          "lista. El auxiliar suma la distancia de cada comando de la lista.";
      },
      cierre:
        "cases abre el valor y liga los campos: en la cláusula de repite-cmd, " +
        "n y cmds ya son el número y la lista, sin pedirlos. La lista se " +
        "recorre aparte, con la recursión de siempre, y en cada elemento " +
        "vuelve a entrar cases."
    },
    {
      id: "cases-giros",
      titulo: "2. Cuántas veces gira",
      enunciado:
        "Escriba <code>giros</code>, que cuenta las veces que el robot gira, " +
        "con los repite multiplicando igual que antes. Es el mismo esqueleto " +
        "de <code>distancia</code> con dos cláusulas intercambiadas: la que " +
        "aporta es ahora la del giro.",
      gramatica: GRAMATICA,
      esqueleto:
        DATATYPE + EJEMPLOS + "\n" +
        "(define (giros c)\n" +
        "  (cases cmd c\n" +
        "    (avanza-cmd (n) ???)\n" +
        "    (gira-cmd (dir) ???)\n" +
        "    (repite-cmd (n cmds) ???)))\n" +
        "\n" +
        "(define (giros-lista cmds)\n" +
        "  (if (null? cmds)\n" +
        "      0\n" +
        "      (+ ??? ???)))\n",
      pruebas: [
        { llamada: "(giros (gira-cmd 'der))", esperado: "1" },
        { llamada: "(giros (avanza-cmd 9))", esperado: "0" },
        { llamada: "(giros cuadrado)", esperado: "4" },
        { llamada: "(giros zigzag)", esperado: "6" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(giros zigzag)" && obtenido === "4") {
          return "Faltan los giros del repite interno multiplicados: dos " +
            "vueltas de afuera, y cada una trae un giro más dos del repite " +
            "de adentro.";
        }
        return "Un giro cuenta uno, un avance cero, y el repite multiplica " +
          "lo que cuente su lista.";
      },
      cierre:
        "El recorrido es idéntico y solo cambió qué aporta cada variante. Esa " +
        "es la forma en que un intérprete recorre un programa: la estructura " +
        "del recorrido sale del tipo, y lo que se calcula en cada caso es lo " +
        "único que cambia de un procedimiento a otro."
    },
    {
      id: "cases-anidamiento",
      titulo: "3. Qué tan hondo se anidan los repite",
      enunciado:
        "Escriba <code>anidamiento</code>: cero para un avance o un giro, y " +
        "para un repite uno más el mayor anidamiento de sus comandos. Aquí el " +
        "auxiliar no suma: compara, y sobre la lista vacía responde cero.",
      gramatica: GRAMATICA,
      esqueleto:
        DATATYPE + EJEMPLOS + "\n" +
        "(define (anidamiento c)\n" +
        "  (cases cmd c\n" +
        "    (avanza-cmd (n) ???)\n" +
        "    (gira-cmd (dir) ???)\n" +
        "    (repite-cmd (n cmds) ???)))\n" +
        "\n" +
        "(define (mayor-anidamiento cmds)\n" +
        "  (if (null? cmds)\n" +
        "      ???\n" +
        "      (max ??? ???)))\n",
      pruebas: [
        { llamada: "(anidamiento (avanza-cmd 1))", esperado: "0" },
        { llamada: "(anidamiento (repite-cmd 3 '()))", esperado: "1" },
        { llamada: "(anidamiento cuadrado)", esperado: "1" },
        { llamada: "(anidamiento zigzag)", esperado: "2" },
        { llamada: "(anidamiento (repite-cmd 1 (list (repite-cmd 1 (list (repite-cmd 1 '()))))))", esperado: "3" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(anidamiento zigzag)" && obtenido === "3") {
          return "Se están sumando los niveles de los hermanos. Entre los " +
            "comandos de un repite se toma el mayor, no el total.";
        }
        if (llamada === "(anidamiento (repite-cmd 3 '()))" && obtenido === "0") {
          return "Un repite vacío ya es un nivel: uno más el mayor de una " +
            "lista vacía, que es cero.";
        }
        return "Las hojas valen cero; el repite, uno más el máximo de su " +
          "lista.";
      },
      cierre:
        "La misma pregunta de profundidad que en los árboles binarios, sobre " +
        "un tipo cuyos nodos tienen cualquier cantidad de hijos. Por eso el " +
        "máximo se toma en el auxiliar que recorre la lista, y no entre dos " +
        "ramas fijas."
    },
    {
      id: "cases-desdobla",
      titulo: "4. Desdoblar los repite",
      enunciado:
        "Escriba <code>desdobla</code>, que devuelve la lista de comandos " +
        "básicos que el robot ejecuta, en orden y sin ningún repite: un avance " +
        "o un giro dan una lista de uno; un repite da su lista desdoblada, " +
        "repetida <code>n</code> veces. Aquí cases construye una lista en vez " +
        "de un número.",
      gramatica: GRAMATICA,
      esqueleto:
        DATATYPE + EJEMPLOS + "\n" +
        "(define (desdobla c)\n" +
        "  (cases cmd c\n" +
        "    (avanza-cmd (n) ???)\n" +
        "    (gira-cmd (dir) ???)\n" +
        "    (repite-cmd (n cmds) (repetir n (desdobla-lista cmds)))))\n" +
        "\n" +
        "(define (desdobla-lista cmds)\n" +
        "  (if (null? cmds)\n" +
        "      '()\n" +
        "      (append ??? ???)))\n" +
        "\n" +
        "(define (repetir n lst)\n" +
        "  (if (zero? n)\n" +
        "      ???\n" +
        "      (append ??? ???)))\n",
      pruebas: [
        { llamada: "(desdobla (avanza-cmd 2))", esperado: "((avanza-cmd 2))" },
        { llamada: "(desdobla (repite-cmd 2 (list (avanza-cmd 1) (gira-cmd 'izq))))", esperado: "((avanza-cmd 1) (gira-cmd izq) (avanza-cmd 1) (gira-cmd izq))" },
        { llamada: "(length (desdobla cuadrado))", esperado: "8" },
        { llamada: "(length (desdobla zigzag))", esperado: "12" },
        { llamada: "(desdobla (repite-cmd 0 (list (avanza-cmd 1))))", esperado: "()" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(desdobla (avanza-cmd 2))" && obtenido === "(avanza-cmd 2)") {
          return "Devolvió el comando pelado. Cada hoja da una lista de un " +
            "elemento, para que append pueda juntarlas.";
        }
        if (obtenido.indexOf("append esperaba") !== -1) {
          return "append junta listas: cada parte tiene que ser una lista, " +
            "incluida la de un solo comando.";
        }
        return "Las hojas se envuelven en una lista; la lista de comandos se " +
          "desdobla elemento por elemento con append; repetir pega n copias.";
      },
      cierre:
        "El programa desdoblado es más largo y más plano: doce comandos " +
        "básicos donde había siete nodos. Es lo que hará más adelante un " +
        "intérprete con la recursión, solo que sin materializar la lista: " +
        "la recorre mientras la produce."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
