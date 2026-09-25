/* Parser y unparser de comandos. De la sintaxis concreta del robot al
   datatype y de vuelta. Cada prueba de parse muestra dibujado el árbol que
   se espera, y si el código construye otro, aparece al lado el que construyó.
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

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "parse-basico",
      titulo: "1. Del texto al árbol: avanzar y girar",
      enunciado:
        "Escriba <code>parse-cmd</code> para las dos primeras producciones. " +
        "Recibe la sintaxis concreta como lista, mira la primera palabra y " +
        "construye la variante con lo que la lista trae en cada posición. " +
        "Aquí sí se usan <code>car</code> y <code>cadr</code>: el dato que " +
        "llega es una lista, no un valor del datatype. Lo que no está en la " +
        "gramática se rechaza con <code>error</code>.",
      gramatica: GRAMATICA,
      arbol: true,
      esqueleto:
        DATATYPE + "\n" +
        "(define (parse-cmd dato)\n" +
        "  (cond ((eq? (car dato) 'avanza) ???)\n" +
        "        ((eq? (car dato) 'gira) ???)\n" +
        "        (else (error \"no es un comando:\" dato))))\n",
      pruebas: [
        { llamada: "(parse-cmd '(avanza 3))", esperado: "(avanza-cmd 3)" },
        { llamada: "(parse-cmd '(gira izq))", esperado: "(gira-cmd izq)" },
        { llamada: "(parse-cmd '(avanza 10))", esperado: "(avanza-cmd 10)" },
        { llamada: "(cmd? (parse-cmd '(gira der)))", esperado: "#t" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "(avanza 3)" || obtenido === "(gira izq)") {
          return "Devolvió la lista tal como llegó. parse-cmd construye con " +
            "el constructor: avanza-cmd o gira-cmd, con el campo que sale de " +
            "cadr.";
        }
        if (obtenido.indexOf("debe cumplir") !== -1) {
          return "Al constructor le llegó otra cosa en el campo. cadr es el " +
            "segundo elemento de la lista, que es el número o la dirección.";
        }
        return "Cada cláusula llama al constructor de su variante con el " +
          "segundo elemento de la lista.";
      },
      cierre:
        "parse es el único lugar del programa donde car y cadr son " +
        "legítimos, porque es donde el dato todavía es una lista. Desde que " +
        "el constructor devuelve, todo lo demás lo abre cases."
    },
    {
      id: "parse-repite",
      titulo: "2. Del texto al árbol: el repite y su lista",
      enunciado:
        "Complete <code>parse-cmd</code> con la tercera producción. Un " +
        "<code>repite</code> trae el número en la segunda posición y después " +
        "cero o más comandos, cada uno por analizar: el <code>cddr</code> es " +
        "la lista de esos comandos y hace falta un auxiliar que los recorra " +
        "llamando a <code>parse-cmd</code> sobre cada uno. Mire los árboles: " +
        "la lista de comandos aparece como un nodo intermedio con los hijos " +
        "en orden.",
      gramatica: GRAMATICA,
      arbol: true,
      esqueleto:
        DATATYPE + "\n" +
        "(define (parse-cmd dato)\n" +
        "  (cond ((eq? (car dato) 'avanza) (avanza-cmd (cadr dato)))\n" +
        "        ((eq? (car dato) 'gira) (gira-cmd (cadr dato)))\n" +
        "        ((eq? (car dato) 'repite) (repite-cmd ??? ???))\n" +
        "        (else (error \"no es un comando:\" dato))))\n" +
        "\n" +
        "(define (parse-cmds datos)\n" +
        "  (if (null? datos)\n" +
        "      ???\n" +
        "      (cons ??? ???)))\n",
      pruebas: [
        { llamada: "(parse-cmd '(repite 2 (avanza 1) (gira izq)))", esperado: "(repite-cmd 2 ((avanza-cmd 1) (gira-cmd izq)))" },
        { llamada: "(parse-cmd '(repite 3))", esperado: "(repite-cmd 3 ())" },
        { llamada: "(parse-cmd '(repite 2 (repite 2 (avanza 1))))", esperado: "(repite-cmd 2 ((repite-cmd 2 ((avanza-cmd 1)))))" },
        { llamada: "(parse-cmd '(repite 4 (avanza 5) (gira der)))", esperado: "(repite-cmd 4 ((avanza-cmd 5) (gira-cmd der)))" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("debe cumplir (list-of") !== -1) {
          return "El campo cmds recibió algo que no es una lista de " +
            "comandos. El árbol de al lado muestra la forma: los comandos " +
            "de adentro tienen que pasar por parse-cmd, uno por uno.";
        }
        if (obtenido === "(repite-cmd 2 ((avanza 1) (gira izq)))") {
          return "Los comandos de adentro quedaron como listas sin analizar. " +
            "parse-cmds tiene que llamar a parse-cmd sobre cada uno.";
        }
        return "El número es cadr; los comandos son cddr, y parse-cmds los " +
          "convierte uno por uno con parse-cmd.";
      },
      cierre:
        "La producción con puntos suspensivos es la que obliga al " +
        "auxiliar: parse-cmd analiza un comando y parse-cmds analiza una " +
        "lista de ellos, y los dos se llaman entre sí, como los dos conjuntos " +
        "de una gramática de s-lists. El árbol lo muestra: bajo repite-cmd " +
        "hay un nodo de lista y bajo él, los comandos."
    },
    {
      id: "unparse",
      titulo: "3. Del árbol al texto, y la ida y vuelta",
      enunciado:
        "Escriba <code>unparse-cmd</code>, la inversa: recibe un valor del " +
        "datatype y devuelve la lista con la sintaxis concreta. Aquí el dato " +
        "sí es del datatype, así que se abre con <code>cases</code>, y el " +
        "andamiaje que parse descartó se vuelve a poner: la palabra " +
        "<code>repite</code>, el número y los comandos, cada uno por " +
        "desarmar. Las dos últimas pruebas dan la vuelta completa.",
      gramatica: GRAMATICA,
      esqueleto:
        DATATYPE + "\n" +
        "(define (parse-cmd dato)\n" +
        "  (cond ((eq? (car dato) 'avanza) (avanza-cmd (cadr dato)))\n" +
        "        ((eq? (car dato) 'gira) (gira-cmd (cadr dato)))\n" +
        "        ((eq? (car dato) 'repite) (repite-cmd (cadr dato) (parse-cmds (cddr dato))))\n" +
        "        (else (error \"no es un comando:\" dato))))\n" +
        "(define (parse-cmds datos)\n" +
        "  (if (null? datos) '() (cons (parse-cmd (car datos)) (parse-cmds (cdr datos)))))\n" +
        "\n" +
        "(define (unparse-cmd c)\n" +
        "  (cases cmd c\n" +
        "    (avanza-cmd (n) ???)\n" +
        "    (gira-cmd (dir) ???)\n" +
        "    (repite-cmd (n cmds) (cons 'repite (cons ??? ???)))))\n" +
        "\n" +
        "(define (unparse-cmds cmds)\n" +
        "  (if (null? cmds)\n" +
        "      '()\n" +
        "      (cons ??? ???)))\n",
      pruebas: [
        { llamada: "(unparse-cmd (avanza-cmd 3))", esperado: "(avanza 3)" },
        { llamada: "(unparse-cmd (gira-cmd 'der))", esperado: "(gira der)" },
        { llamada: "(unparse-cmd (repite-cmd 2 (list (avanza-cmd 1) (gira-cmd 'izq))))", esperado: "(repite 2 (avanza 1) (gira izq))" },
        { llamada: "(unparse-cmd (parse-cmd '(repite 2 (repite 3 (avanza 1)) (gira der))))", esperado: "(repite 2 (repite 3 (avanza 1)) (gira der))" },
        { llamada: "(equal? (parse-cmd (unparse-cmd (repite-cmd 2 (list (avanza-cmd 1))))) (repite-cmd 2 (list (avanza-cmd 1))))", esperado: "#t" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "(repite 2 ((avanza 1) (gira izq)))") {
          return "Los comandos quedaron en una lista aparte, con un nivel de " +
            "más. En la sintaxis concreta van directamente después del " +
            "número: cons del número sobre la lista ya desarmada.";
        }
        if (obtenido.indexOf("esperaba una lista") !== -1) {
          return "Se intentó abrir un valor del datatype con car o cdr. Aquí " +
            "el dato es un cmd y solo cases lo abre.";
        }
        return "Cada variante arma su lista con la palabra clave adelante; " +
          "unparse-cmds desarma cada comando de la lista con unparse-cmd.";
      },
      cierre:
        "La última prueba es la propiedad que da sentido a las dos funciones: " +
        "parse tras unparse devuelve el mismo árbol. No es que las listas " +
        "sean iguales, es que los valores del datatype lo son, y equal? los " +
        "compara campo por campo."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
