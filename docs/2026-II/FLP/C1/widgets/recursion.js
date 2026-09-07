/* Recursión lineal y recursión de cola. Los dos calculan lo mismo; lo que
   cambia es qué queda pendiente después de la llamada recursiva, y eso se
   nota cuando el dato crece. El código del estudiante corre sobre
   mini-scheme.js. */
var RETOS = (function () {
  "use strict";
  return [
    {
      id: "suma-lineal",
      titulo: "1. Sumar hasta n, dejando trabajo pendiente",
      enunciado:
        "Escriba <code>suma-hasta</code>, que devuelve " +
        "<code>1 + 2 + ... + n</code>. La forma directa es la lineal: se " +
        "pide la suma hasta <code>n - 1</code> y, cuando llega, se le agrega " +
        "<code>n</code>. Fíjese en que la suma queda esperando a que la " +
        "llamada termine, porque esa espera es el tema de los dos retos que " +
        "siguen.",
      gramatica: null,
      esqueleto:
        "(define (suma-hasta n)\n" +
        "  (if (zero? n)\n" +
        "      ???\n" +
        "      ???))\n",
      pruebas: [
        { llamada: "(suma-hasta 0)", esperado: "0" },
        { llamada: "(suma-hasta 1)", esperado: "1" },
        { llamada: "(suma-hasta 5)", esperado: "15" },
        { llamada: "(suma-hasta 100)", esperado: "5050" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(suma-hasta 0)" && obtenido !== "0") {
          return "Sumar hasta cero no suma nada, y el neutro de la suma es " +
            "el cero. Devolver otra cosa desplaza todos los resultados.";
        }
        if (llamada === "(suma-hasta 5)" && obtenido === "10") {
          return "Faltó el propio n. La llamada devuelve la suma hasta " +
            "n - 1, así que hay que agregarle n al volver.";
        }
        if (llamada === "(suma-hasta 5)" && obtenido === "14") {
          return "Se está bajando de más o de menos. La llamada recursiva va " +
            "sobre n - 1 exactamente.";
        }
        return "El caso base responde por el cero y el otro caso agrega n a " +
          "lo que devuelva la llamada.";
      },
      cierre:
        "Mientras la llamada trabaja, el <code>+</code> y el valor de " +
        "<code>n</code> quedan guardados esperándola. Con n valiendo cinco " +
        "son cinco sumas esperando; con n grande, esa pila es el problema."
    },
    {
      id: "suma-cola",
      titulo: "2. La misma suma, sin nada pendiente",
      enunciado:
        "Ahora la versión de cola: en lugar de sumar al volver, se lleva un " +
        "acumulador con lo sumado hasta el momento y la llamada recursiva es " +
        "lo último que ocurre. Cuando el conteo se agota, el acumulador ya " +
        "es la respuesta y solo hay que devolverlo. " +
        "<b>Una advertencia sobre la última prueba:</b> suma hasta cincuenta " +
        "mil, y la versión del reto anterior no la pasa. El mensaje que sale " +
        "menciona el caso base aunque el caso base esté bien; lo que se acabó " +
        "fue el espacio para tanta suma esperando.",
      gramatica: null,
      esqueleto:
        "(define (suma-hasta n)\n" +
        "  (sumar n ???))\n" +
        "\n" +
        "(define (sumar n ac)\n" +
        "  (if (zero? n)\n" +
        "      ???\n" +
        "      (sumar ??? ???)))\n",
      pruebas: [
        { llamada: "(suma-hasta 0)", esperado: "0" },
        { llamada: "(suma-hasta 5)", esperado: "15" },
        { llamada: "(suma-hasta 100)", esperado: "5050" },
        { llamada: "(suma-hasta 50000)", esperado: "1250025000" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(suma-hasta 0)" && obtenido !== "0") {
          return "El acumulador arranca en cero: antes de sumar nada, lo " +
            "sumado es nada.";
        }
        if (llamada === "(suma-hasta 5)" && obtenido === "10") {
          return "Se está acumulando n - 1 en vez de n. Al acumulador entra " +
            "el valor de este paso, y la cuenta baja aparte.";
        }
        return "El caso base devuelve el acumulador tal como llegó, y el " +
          "otro caso llama de nuevo con la cuenta bajada y el acumulador " +
          "crecido.";
      },
      cierre:
        "La llamada recursiva quedó de última, sin ninguna operación " +
        "esperándola, y el evaluador puede reemplazar la llamada actual en " +
        "vez de apilarla. Eso es lo que convierte la recursión en un ciclo, " +
        "y por eso cincuenta mil pasa sin problema."
    },
    {
      id: "factorial",
      titulo: "3. Factorial con acumulador",
      enunciado:
        "Escriba <code>factorial</code> en versión de cola. El cambio " +
        "respecto de la suma es de una letra: la operación deja de ser " +
        "sumar y pasa a multiplicar, y con eso cambia también con qué valor " +
        "arranca el acumulador.",
      gramatica: null,
      esqueleto:
        "(define (factorial n)\n" +
        "  (multiplicar n ???))\n" +
        "\n" +
        "(define (multiplicar n ac)\n" +
        "  (if (zero? n)\n" +
        "      ???\n" +
        "      (multiplicar ??? ???)))\n",
      pruebas: [
        { llamada: "(factorial 0)", esperado: "1" },
        { llamada: "(factorial 1)", esperado: "1" },
        { llamada: "(factorial 5)", esperado: "120" },
        { llamada: "(factorial 10)", esperado: "3628800" },
        { llamada: "(factorial 15)", esperado: "1307674368000" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "0") {
          return "El acumulador arrancó en cero y cualquier producto por " +
            "cero es cero. El neutro de la multiplicación es el uno.";
        }
        if (llamada === "(factorial 5)" && obtenido === "24") {
          return "Se multiplicó hasta cuatro. Al acumulador entra el n de " +
            "este paso antes de bajarlo.";
        }
        return "Mismo esqueleto de la suma, con el uno en lugar del cero y " +
          "el producto en lugar de la suma.";
      },
      cierre:
        "El valor con que arranca el acumulador es el elemento neutro de la " +
        "operación que se está acumulando. Cero para sumar, uno para " +
        "multiplicar, la lista vacía para construir listas."
    },
    {
      id: "largo",
      titulo: "4. Contar los elementos de una lista",
      enunciado:
        "Escriba <code>largo</code>, que cuenta cuántos elementos tiene una " +
        "lista, con acumulador. Aquí lo que se agota no es un número sino la " +
        "lista: el caso base pregunta por <code>null?</code> y el paso baja " +
        "por el <code>cdr</code>. Los elementos anidados no se miran hacia " +
        "adentro, solo cuentan como uno.",
      gramatica:
        "&lt;lista&gt; ::= ()\n" +
        "        ::= (&lt;valor&gt; . &lt;lista&gt;)",
      esqueleto:
        "(define (largo lst)\n" +
        "  (contar lst ???))\n" +
        "\n" +
        "(define (contar lst ac)\n" +
        "  (if (null? lst)\n" +
        "      ???\n" +
        "      (contar ??? ???)))\n",
      pruebas: [
        { llamada: "(largo '())", esperado: "0" },
        { llamada: "(largo '(a b c))", esperado: "3" },
        { llamada: "(largo '((a b) (c)))", esperado: "2" },
        { llamada: "(largo '(a (b (c (d)))))", esperado: "2" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(largo '((a b) (c)))" && obtenido === "3") {
          return "Se están contando los elementos de adentro. La lista " +
            "tiene dos elementos, y que cada uno sea a su vez una lista no " +
            "cambia la cuenta del nivel de afuera.";
        }
        if (llamada === "(largo '(a b c))" && obtenido === "0") {
          return "El acumulador nunca crece. En cada paso se cuenta uno más " +
            "y ese uno entra al acumulador.";
        }
        return "El caso base entrega lo contado y el paso avanza por el cdr " +
          "sumando uno.";
      },
      cierre:
        "El mismo esqueleto de la suma cambiando el dato que se agota. La " +
        "recursión no la decide el tipo del argumento sino cómo está " +
        "construido: un número baja de uno en uno, una lista baja por el cdr."
    },
    {
      id: "invertir",
      titulo: "5. Invertir una lista",
      enunciado:
        "Escriba <code>invertir</code> con acumulador. Este es el caso donde " +
        "el acumulador hace algo más que llevar la cuenta: cada elemento que " +
        "se saca del frente de la lista se pone al frente del acumulador, y " +
        "eso solo alcanza a dar la vuelta a la lista. No se necesita " +
        "<code>append</code> ni <code>reverse</code>.",
      gramatica:
        "&lt;lista&gt; ::= ()\n" +
        "        ::= (&lt;valor&gt; . &lt;lista&gt;)",
      esqueleto:
        "(define (invertir lst)\n" +
        "  (voltear lst ???))\n" +
        "\n" +
        "(define (voltear lst ac)\n" +
        "  (if (null? lst)\n" +
        "      ???\n" +
        "      (voltear ??? ???)))\n",
      pruebas: [
        { llamada: "(invertir '())", esperado: "()" },
        { llamada: "(invertir '(1))", esperado: "(1)" },
        { llamada: "(invertir '(a b c))", esperado: "(c b a)" },
        { llamada: "(invertir '(1 2 3 4))", esperado: "(4 3 2 1)" },
        { llamada: "(invertir '((a b) c))", esperado: "(c (a b))" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(invertir '(a b c))" && obtenido === "(a b c)") {
          return "La lista salió como entró. El elemento se está agregando " +
            "por detrás del acumulador; ponerlo al frente con cons es lo " +
            "que la voltea.";
        }
        if (obtenido === "()" && esperado !== "()") {
          return "El caso base está devolviendo la lista vacía en vez del " +
            "acumulador, y con eso se pierde todo lo que se venía juntando.";
        }
        return null;
      },
      cierre:
        "Que el resultado salga volteado no es un efecto secundario que " +
        "haya que corregir: es la consecuencia de construir mientras se " +
        "baja en vez de construir al volver. La versión lineal, que arma la " +
        "lista al regresar, la deja en el orden original."
    },
    {
      id: "fib",
      titulo: "6. Fibonacci con dos acumuladores",
      enunciado:
        "Escriba <code>fib</code>, donde <code>fib(0) = 0</code>, " +
        "<code>fib(1) = 1</code> y cada término es la suma de los dos " +
        "anteriores. La definición directa hace dos llamadas y repite " +
        "trabajo hasta volverse impracticable; con dos acumuladores que " +
        "guarden esos dos términos anteriores basta con una sola llamada. " +
        "La última prueba pide el término cuarenta, que la versión de dos " +
        "llamadas no alcanza a calcular.",
      gramatica: null,
      esqueleto:
        "(define (fib n)\n" +
        "  (avanzar n ??? ???))\n" +
        "\n" +
        "(define (avanzar n a b)\n" +
        "  (if (zero? n)\n" +
        "      ???\n" +
        "      (avanzar ??? ??? ???)))\n",
      pruebas: [
        { llamada: "(fib 0)", esperado: "0" },
        { llamada: "(fib 1)", esperado: "1" },
        { llamada: "(fib 2)", esperado: "1" },
        { llamada: "(fib 10)", esperado: "55" },
        { llamada: "(fib 40)", esperado: "102334155" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(fib 0)" && obtenido === "1") {
          return "Los dos acumuladores arrancan con los dos primeros " +
            "términos, y el que se devuelve al agotarse la cuenta es el " +
            "primero de ellos.";
        }
        if (llamada === "(fib 10)" && obtenido === "89") {
          return "Va un término adelantado. Con n valiendo cero ya no hay " +
            "que avanzar más, así que ahí se devuelve a tal como está.";
        }
        if (llamada === "(fib 10)" && obtenido === "34") {
          return "Va un término atrasado: la cuenta se agotó antes de " +
            "tiempo. Revise que cada paso baje n exactamente en uno.";
        }
        return "En cada paso los dos términos se corren: el segundo pasa a " +
          "ser el primero, y el nuevo segundo es la suma de los dos.";
      },
      cierre:
        "Dos llamadas recursivas por paso dan un árbol que se duplica y " +
        "recalcula lo mismo una y otra vez; una sola llamada con los " +
        "resultados que ya se tienen a la mano da un recorrido. El mismo " +
        "cálculo, en un caso impracticable y en el otro instantáneo."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
