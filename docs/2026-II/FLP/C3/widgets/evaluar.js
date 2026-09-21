/* Evaluar y reescribir. Cuatro procedimientos con cases sobre las expresiones
   booleanas: dos que devuelven un valor de Scheme y dos que devuelven otra
   expresión booleana, reconstruida variante por variante. En estos dos el
   árbol esperado va dibujado bajo cada prueba. El código corre sobre
   mini-scheme.js. */
var GRAMATICA =
  "&lt;bexp&gt; ::= true                          true-exp ()\n" +
  "       ::= false                         false-exp ()\n" +
  "       ::= &lt;símbolo&gt;                      var-exp (nombre)\n" +
  "       ::= (not &lt;bexp&gt;)                   not-exp (arg)\n" +
  "       ::= (&lt;bexp&gt; and &lt;bexp&gt;)            and-exp (izq der)\n" +
  "       ::= (&lt;bexp&gt; or &lt;bexp&gt;)             or-exp (izq der)";

var DATATYPE =
  "(define-datatype bexp bexp?\n" +
  "  (true-exp)\n" +
  "  (false-exp)\n" +
  "  (var-exp   (nombre symbol?))\n" +
  "  (not-exp   (arg bexp?))\n" +
  "  (and-exp   (izq bexp?) (der bexp?))\n" +
  "  (or-exp    (izq bexp?) (der bexp?)))\n";

var EJEMPLOS =
  "\n;; Tres expresiones, para las pruebas.\n" +
  ";; b1 es (p and (not q)); b2 es ((not (not p)) or false);\n" +
  ";; b3 es (not (true and (not q))).\n" +
  "(define b1 (and-exp (var-exp 'p) (not-exp (var-exp 'q))))\n" +
  "(define b2 (or-exp (not-exp (not-exp (var-exp 'p))) (false-exp)))\n" +
  "(define b3 (not-exp (and-exp (true-exp) (not-exp (var-exp 'q)))))\n";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "evalua",
      titulo: "1. Evaluar con una lista de verdades",
      enunciado:
        "Escriba <code>evalua</code>, que recibe una expresión y la lista de " +
        "los símbolos que valen verdad, y devuelve <code>#t</code> o " +
        "<code>#f</code>. Una variable vale verdad si está en la lista; " +
        "<code>esta?</code> ya lo revisa. Los conectivos se evalúan sobre el " +
        "valor de sus lados.",
      gramatica: GRAMATICA,
      esqueleto:
        DATATYPE + EJEMPLOS + "\n" +
        "(define (esta? x lst)\n" +
        "  (cond ((null? lst) #f)\n" +
        "        ((eq? x (car lst)) #t)\n" +
        "        (else (esta? x (cdr lst)))))\n" +
        "\n" +
        "(define (evalua b ciertas)\n" +
        "  (cases bexp b\n" +
        "    (true-exp () ???)\n" +
        "    (false-exp () ???)\n" +
        "    (var-exp (nombre) ???)\n" +
        "    (not-exp (arg) ???)\n" +
        "    (and-exp (izq der) ???)\n" +
        "    (or-exp (izq der) ???)))\n",
      pruebas: [
        { llamada: "(evalua (true-exp) '())", esperado: "#t" },
        { llamada: "(evalua (var-exp 'p) '(p))", esperado: "#t" },
        { llamada: "(evalua (var-exp 'p) '(q))", esperado: "#f" },
        { llamada: "(evalua b1 '(p))", esperado: "#t" },
        { llamada: "(evalua b1 '(p q))", esperado: "#f" },
        { llamada: "(evalua b2 '())", esperado: "#f" },
        { llamada: "(evalua b3 '(q))", esperado: "#t" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(evalua b1 '(p))" && obtenido === "#f") {
          return "p está en la lista y q no: (not q) vale #t y el and da #t. " +
            "Revise que not-exp niegue el valor de su argumento, no que lo " +
            "devuelva tal cual.";
        }
        if (llamada === "(evalua b2 '())" && obtenido === "#t") {
          return "Es ((not (not p)) or false) con p fuera de la lista: los " +
            "dos lados valen #f. Revise que false-exp devuelva #f y que dos " +
            "not seguidos se cancelen, cada uno negando el valor del suyo.";
        }
        if (llamada === "(evalua (var-exp 'p) '(q))" && obtenido === "#t") {
          return "La variable vale verdad solo si su nombre está en la lista. " +
            "La cláusula de var-exp pregunta con esta?, no devuelve #t de " +
            "una vez.";
        }
        return "Las hojas devuelven un booleano directo: #t, #f o lo que " +
          "diga esta?. Los conectivos evalúan sus lados con evalua y " +
          "combinan con not, and y or de Scheme.";
      },
      cierre:
        "Es un intérprete, el primero del curso: recorre el árbol y en cada " +
        "nodo combina los valores de sus hijos. La lista de verdades hace " +
        "de ambiente: es donde una variable va a buscar su valor."
    },
    {
      id: "negaciones",
      titulo: "2. Contar negaciones",
      enunciado:
        "Escriba <code>negaciones</code>, que cuenta cuántos <code>not</code> " +
        "hay en la expresión, incluidos los que están dentro de otro " +
        "<code>not</code>.",
      gramatica: GRAMATICA,
      esqueleto:
        DATATYPE + EJEMPLOS + "\n" +
        "(define (negaciones b)\n" +
        "  (cases bexp b\n" +
        "    (true-exp () ???)\n" +
        "    (false-exp () ???)\n" +
        "    (var-exp (nombre) ???)\n" +
        "    (not-exp (arg) ???)\n" +
        "    (and-exp (izq der) ???)\n" +
        "    (or-exp (izq der) ???)))\n",
      pruebas: [
        { llamada: "(negaciones (var-exp 'p))", esperado: "0" },
        { llamada: "(negaciones b1)", esperado: "1" },
        { llamada: "(negaciones b2)", esperado: "2" },
        { llamada: "(negaciones b3)", esperado: "2" },
        { llamada: "(negaciones (not-exp (not-exp (not-exp (var-exp 'p)))))", esperado: "3" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(negaciones b2)" && obtenido === "1") {
          return "Un not dentro de otro not también cuenta: la cláusula de " +
            "not-exp suma uno y sigue contando en el argumento.";
        }
        return "Las hojas aportan cero. not-exp aporta uno más lo que haya " +
          "en su argumento, y los conectivos suman lo de sus dos lados.";
      },
      cierre:
        "El mismo esqueleto de evalua con otra cosa en cada cláusula: cero " +
        "en las hojas, uno más el argumento en el not, la suma en los " +
        "conectivos. La forma del procedimiento la dicta el datatype; lo " +
        "que se calcula lo dicta la pregunta."
    },
    {
      id: "sin-doble-negacion",
      titulo: "3. Quitar las dobles negaciones",
      enunciado:
        "Escriba <code>sin-doble-negacion</code>, que devuelve la misma " +
        "expresión con cada <code>(not (not x))</code> reemplazado por " +
        "<code>x</code>, en todos los niveles. Devuelve una expresión " +
        "booleana, no un valor: cada cláusula reconstruye su variante con los " +
        "campos ya simplificados. La cláusula de <code>not-exp</code> tiene " +
        "que mirar qué variante es su argumento, y para eso lleva un " +
        "<code>cases</code> adentro.",
      gramatica: GRAMATICA,
      arbol: true,
      esqueleto:
        DATATYPE + EJEMPLOS + "\n" +
        "(define (sin-doble-negacion b)\n" +
        "  (cases bexp b\n" +
        "    (true-exp () b)\n" +
        "    (false-exp () b)\n" +
        "    (var-exp (nombre) b)\n" +
        "    (and-exp (izq der)\n" +
        "      (and-exp (sin-doble-negacion izq) (sin-doble-negacion der)))\n" +
        "    (or-exp (izq der) ???)\n" +
        "    (not-exp (arg)\n" +
        "      (cases bexp arg\n" +
        "        (not-exp (adentro) ???)\n" +
        "        (else ???)))))\n",
      pruebas: [
        { llamada: "(sin-doble-negacion b1)", esperado: "(and-exp (var-exp p) (not-exp (var-exp q)))" },
        { llamada: "(sin-doble-negacion b2)", esperado: "(or-exp (var-exp p) (false-exp))" },
        { llamada: "(sin-doble-negacion (not-exp (not-exp (not-exp (var-exp 'q)))))", esperado: "(not-exp (var-exp q))" },
        { llamada: "(sin-doble-negacion (not-exp (not-exp (not-exp (not-exp (var-exp 'q))))))", esperado: "(var-exp q)" },
        { llamada: "(sin-doble-negacion (not-exp (and-exp (not-exp (not-exp (var-exp 'p))) (var-exp 'q))))", esperado: "(not-exp (and-exp (var-exp p) (var-exp q)))" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(sin-doble-negacion b2)" && obtenido === "(or-exp (not-exp (not-exp (var-exp p))) (false-exp))") {
          return "El par de not sobrevivió. Cuando el argumento de un not es " +
            "otro not, el resultado es lo que hay dentro del segundo, " +
            "simplificado: no se reconstruye ningún not-exp.";
        }
        if (llamada === "(sin-doble-negacion (not-exp (not-exp (not-exp (not-exp (var-exp 'q))))))" && obtenido === "(not-exp (not-exp (var-exp q)))") {
          return "Quitó un par y se detuvo: lo que queda adentro puede traer " +
            "otro par. Se devuelve el argumento del argumento pasado por " +
            "sin-doble-negacion, no tal cual.";
        }
        if (llamada === "(sin-doble-negacion (not-exp (and-exp (not-exp (not-exp (var-exp 'p))) (var-exp 'q))))" && obtenido === "(not-exp (and-exp (not-exp (not-exp (var-exp p))) (var-exp q)))") {
          return "El not de afuera está bien, pero su argumento no se " +
            "simplificó por dentro. En el else del cases interior se " +
            "reconstruye (not-exp (sin-doble-negacion arg)).";
        }
        return "Tres salidas en la cláusula de not-exp: si el argumento es " +
          "otro not, se devuelve su interior simplificado; si no, se " +
          "reconstruye el not con el argumento simplificado. Los conectivos " +
          "se reconstruyen con sus lados simplificados.";
      },
      cierre:
        "Un cases dentro de otro: el de afuera dice que b es un not, el de " +
        "adentro pregunta qué es su argumento. El else del segundo cubre las " +
        "cinco variantes restantes de una vez, y ahí el not se reconstruye " +
        "con el argumento ya simplificado. El resultado es un bexp nuevo; el " +
        "original no se toca."
    },
    {
      id: "nnf",
      titulo: "4. Empujar el not hacia las hojas",
      enunciado:
        "Escriba <code>nnf</code>, que devuelve una expresión equivalente " +
        "donde ningún <code>not</code> tiene adentro un conectivo ni otro " +
        "<code>not</code>: solo puede negar una variable. Las reglas son las " +
        "leyes de De Morgan y la doble negación, aplicadas hasta el fondo:",
      gramatica:
        "(not (a and b))   se vuelve   ((not a) or (not b))\n" +
        "(not (a or b))    se vuelve   ((not a) and (not b))\n" +
        "(not (not a))     se vuelve   a\n" +
        "(not true)        se vuelve   false\n" +
        "(not false)       se vuelve   true\n" +
        "(not p)           se queda    (not p)",
      arbol: true,
      esqueleto:
        DATATYPE + EJEMPLOS + "\n" +
        "(define (nnf b)\n" +
        "  (cases bexp b\n" +
        "    (true-exp () b)\n" +
        "    (false-exp () b)\n" +
        "    (var-exp (nombre) b)\n" +
        "    (and-exp (izq der) (and-exp (nnf izq) (nnf der)))\n" +
        "    (or-exp (izq der) (or-exp (nnf izq) (nnf der)))\n" +
        "    (not-exp (arg)\n" +
        "      (cases bexp arg\n" +
        "        (true-exp () ???)\n" +
        "        (false-exp () ???)\n" +
        "        (var-exp (nombre) ???)\n" +
        "        (not-exp (adentro) ???)\n" +
        "        (and-exp (izq der) ???)\n" +
        "        (or-exp (izq der) ???)))))\n",
      pruebas: [
        { llamada: "(nnf b1)", esperado: "(and-exp (var-exp p) (not-exp (var-exp q)))" },
        { llamada: "(nnf (not-exp (true-exp)))", esperado: "(false-exp)" },
        { llamada: "(nnf (not-exp (and-exp (var-exp 'p) (var-exp 'q))))", esperado: "(or-exp (not-exp (var-exp p)) (not-exp (var-exp q)))" },
        { llamada: "(nnf (not-exp (or-exp (var-exp 'p) (not-exp (var-exp 'q)))))", esperado: "(and-exp (not-exp (var-exp p)) (var-exp q))" },
        { llamada: "(nnf (not-exp (not-exp (and-exp (var-exp 'p) (true-exp)))))", esperado: "(and-exp (var-exp p) (true-exp))" },
        { llamada: "(nnf (not-exp (and-exp (not-exp (var-exp 'p)) (or-exp (var-exp 'q) (var-exp 'r)))))", esperado: "(or-exp (var-exp p) (and-exp (not-exp (var-exp q)) (not-exp (var-exp r))))" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(nnf (not-exp (and-exp (var-exp 'p) (var-exp 'q))))") {
          if (obtenido === "(or-exp (var-exp p) (var-exp q))") {
            return "De Morgan niega cada lado: not (p and q) es (not p) or " +
              "(not q). Cada lado entra a nnf ya negado: (nnf (not-exp izq)).";
          }
          if (obtenido === "(and-exp (not-exp (var-exp p)) (not-exp (var-exp q)))") {
            return "not sobre and da or, y not sobre or da and. Se cambió el " +
              "conectivo equivocado.";
          }
        }
        if (llamada === "(nnf (not-exp (or-exp (var-exp 'p) (not-exp (var-exp 'q)))))" &&
            obtenido === "(and-exp (not-exp (var-exp p)) (not-exp (not-exp (var-exp q))))") {
          return "La negación quedó afuera: se aplicó nnf a cada lado y " +
            "después se le puso el not encima. Es al revés: se construye " +
            "(not-exp izq) y a eso se le aplica nnf, para que la negación " +
            "siga bajando.";
        }
        return "Sobre las hojas el not se resuelve: true se vuelve false, " +
          "false se vuelve true, una variable se queda negada. Sobre un not " +
          "se devuelve (nnf adentro). Sobre un conectivo se cambia and por " +
          "or, o al revés, y cada lado entra a nnf envuelto en not-exp.";
      },
      cierre:
        "La negación baja por el árbol y se resuelve en las hojas, o " +
        "desaparece contra otra negación. Cada llamada recursiva recibe una " +
        "expresión más pequeña o con la negación un nivel más abajo, y por " +
        "eso termina. Con esto la expresión queda en forma normal negativa, " +
        "que es el primer paso de varios algoritmos sobre fórmulas."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
