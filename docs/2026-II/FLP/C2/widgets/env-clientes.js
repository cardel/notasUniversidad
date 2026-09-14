/* Clientes del ambiente. La representación con listas y su interfaz vienen
   dadas; los cinco procedimientos se escriben sobre la interfaz y recorren la
   cadena sin mirar la lista. El código del estudiante corre sobre
   mini-scheme.js. */
var INTERFAZ =
  "(empty-env)                    (empty-env? env)\n" +
  "(extend-env id val env)        (extend-env? env)\n" +
  "(extend-env->id env)           (extend-env->val env)\n" +
  "(extend-env->old-env env)";

var CABECERA =
  ";; Representación con listas. El cliente no debe depender de ella.\n" +
  "(define (empty-env) '(empty-env))\n" +
  "(define (extend-env id val env) (list 'extend-env id val env))\n" +
  "(define (empty-env? env) (eq? (car env) 'empty-env))\n" +
  "(define (extend-env? env) (eq? (car env) 'extend-env))\n" +
  "(define (extend-env->id env) (cadr env))\n" +
  "(define (extend-env->val env) (caddr env))\n" +
  "(define (extend-env->old-env env) (cadddr env))\n" +
  "\n" +
  ";; El ambiente de las pruebas: m aparece tres veces.\n" +
  "(define e\n" +
  "  (extend-env 'm 1\n" +
  "    (extend-env 'n 2\n" +
  "      (extend-env 'm 3\n" +
  "        (extend-env 'm 4\n" +
  "          (extend-env 'k 5\n" +
  "            (empty-env)))))))\n";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "env-ligada",
      titulo: "1. Preguntar sin que falle",
      enunciado:
        "<code>apply-env</code> produce un error cuando el nombre no está. " +
        "Escriba <code>ligada?</code>, que responde <code>#t</code> o " +
        "<code>#f</code> y nunca falla. Es el mismo recorrido, con el vacío " +
        "respondiendo que no en lugar de reventar.",
      gramatica: INTERFAZ,
      esqueleto:
        CABECERA + "\n" +
        "(define (ligada? env id)\n" +
        "  (cond ((empty-env? env) ???)\n" +
        "        ((eq? (extend-env->id env) id) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(ligada? e 'k)", esperado: "#t" },
        { llamada: "(ligada? e 'm)", esperado: "#t" },
        { llamada: "(ligada? e 'z)", esperado: "#f" },
        { llamada: "(ligada? (empty-env) 'm)", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(ligada? e 'k)" && obtenido === "#f") {
          return "k está en el eslabón más viejo y la búsqueda no llegó. La " +
            "cláusula del else sigue con extend-env->old-env.";
        }
        return "Vacío: #f. El nombre coincide: #t. Si no, se sigue con el " +
          "ambiente anterior.";
      },
      cierre:
        "Es apply-env con otra respuesta en el caso base. Un cliente que " +
        "necesite saber si un nombre existe antes de pedir su valor usa " +
        "este, y no atrapa errores."
    },
    {
      id: "env-nombres",
      titulo: "2. Los nombres, del más nuevo al más viejo",
      enunciado:
        "Escriba <code>nombres</code>, que devuelve la lista de " +
        "identificadores de la cadena en el orden en que la búsqueda los " +
        "visita, con repeticiones: cada eslabón cuenta aunque su nombre ya " +
        "haya salido.",
      gramatica: INTERFAZ,
      esqueleto:
        CABECERA + "\n" +
        "(define (nombres env)\n" +
        "  (if ???\n" +
        "      ???\n" +
        "      (cons ??? ???)))\n",
      pruebas: [
        { llamada: "(nombres e)", esperado: "(m n m m k)" },
        { llamada: "(nombres (empty-env))", esperado: "()" },
        { llamada: "(nombres (extend-env 'q 0 e))", esperado: "(q m n m m k)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(nombres e)" && obtenido === "(m n k)") {
          return "Se están quitando repetidos. Cada eslabón es un nombre, " +
            "aunque otro eslabón tenga el mismo.";
        }
        if (llamada === "(nombres e)" && obtenido === "(k m m n m)") {
          return "Salió del más viejo al más nuevo. El cons pone el nombre " +
            "del eslabón actual adelante de los que trae el resto.";
        }
        return "El nombre de este eslabón, adelante de los nombres del " +
          "ambiente anterior.";
      },
      cierre:
        "(m n m m k) es la cadena vista desde afuera, y la primera m es la " +
        "única que apply-env alcanza a ver. Las otras dos están ahí, y esta " +
        "lista lo muestra."
    },
    {
      id: "env-cuantas",
      titulo: "3. Cuántas ligaduras tiene un nombre",
      enunciado:
        "Escriba <code>cuantas-veces</code>, que cuenta los eslabones que " +
        "ligan un nombre dado. Para <code>m</code> son tres, aunque " +
        "<code>apply-env</code> solo vea una.",
      gramatica: INTERFAZ,
      esqueleto:
        CABECERA + "\n" +
        "(define (cuantas-veces env id)\n" +
        "  (cond ((empty-env? env) ???)\n" +
        "        ((eq? (extend-env->id env) id) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(cuantas-veces e 'm)", esperado: "3" },
        { llamada: "(cuantas-veces e 'n)", esperado: "1" },
        { llamada: "(cuantas-veces e 'z)", esperado: "0" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(cuantas-veces e 'm)" && obtenido === "1") {
          return "Se detuvo en la primera. A diferencia de apply-env, aquí " +
            "encontrar el nombre no termina el recorrido: se cuenta uno y " +
            "se sigue.";
        }
        return "Vacío: cero. Coincide: uno más lo del resto. No coincide: lo " +
          "del resto.";
      },
      cierre:
        "La diferencia con apply-env está en una sola cláusula: al " +
        "encontrar el nombre, seguir en vez de parar. El mismo recorrido " +
        "responde preguntas distintas según qué haga en cada eslabón."
    },
    {
      id: "env-valores",
      titulo: "4. Lo que apply-env no muestra",
      enunciado:
        "Escriba <code>valores-de</code>, que devuelve todos los valores " +
        "ligados a un nombre, del más nuevo al más viejo. El primero de esa " +
        "lista es lo que <code>apply-env</code> devolvería; los demás son " +
        "las ligaduras ocultas.",
      gramatica: INTERFAZ,
      esqueleto:
        CABECERA + "\n" +
        "(define (valores-de env id)\n" +
        "  (cond ((empty-env? env) ???)\n" +
        "        ((eq? (extend-env->id env) id)\n" +
        "         (cons ??? ???))\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(valores-de e 'm)", esperado: "(1 3 4)" },
        { llamada: "(valores-de e 'k)", esperado: "(5)" },
        { llamada: "(valores-de e 'z)", esperado: "()" },
        { llamada: "(valores-de (extend-env 'm 0 e) 'm)", esperado: "(0 1 3 4)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(valores-de e 'm)" && obtenido === "(1)") {
          return "Solo el primero. Después de tomar el valor hay que seguir " +
            "buscando en el ambiente anterior.";
        }
        return "Al coincidir, el valor va adelante de lo que traiga el " +
          "resto; si no coincide, solo lo que traiga el resto.";
      },
      cierre:
        "(1 3 4): el 1 es lo visible y el 3 y el 4 lo que quedó tapado. " +
        "Extender con m = 0 no borra nada, solo pone un valor más adelante " +
        "de todos."
    },
    {
      id: "env-lista",
      titulo: "5. Todo el ambiente, como lista de pares",
      enunciado:
        "Escriba <code>env-&gt;lista</code>, que devuelve una lista de pares " +
        "<code>(id val)</code>, uno por eslabón, del más nuevo al más viejo. " +
        "Es la vista completa del ambiente, la que sirve para depurar, " +
        "construida sin saber que por dentro ya era una lista.",
      gramatica: INTERFAZ,
      esqueleto:
        CABECERA + "\n" +
        "(define (env->lista env)\n" +
        "  (if ???\n" +
        "      ???\n" +
        "      (cons (list ??? ???) ???)))\n",
      pruebas: [
        { llamada: "(env->lista (empty-env))", esperado: "()" },
        { llamada: "(env->lista (extend-env 'a 7 (empty-env)))", esperado: "((a 7))" },
        { llamada: "(env->lista e)", esperado: "((m 1) (n 2) (m 3) (m 4) (k 5))" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("extend-env") !== -1) {
          return "Devolvió el dato tal como está guardado. Aquí se construye " +
            "una lista nueva de pares con los extractores, no se devuelve " +
            "la representación.";
        }
        return "Un par con el nombre y el valor de este eslabón, adelante de " +
          "la lista del ambiente anterior.";
      },
      cierre:
        "Cinco clientes y ninguno tocó cadr ni cadddr. El día que el " +
        "ambiente pase a ser una clausura, los cinco seguirán funcionando y " +
        "solo cambiarán los siete procedimientos de arriba."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
