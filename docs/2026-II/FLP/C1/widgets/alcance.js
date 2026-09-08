/* Declaración, referencia y alcance. Cada referencia se resuelve con la
   declaración más cercana hacia afuera que la contenga, y eso se decide
   leyendo el texto. Los cinco procedimientos hacen ejecutable esa lectura.
   El código del estudiante corre sobre mini-scheme.js. */
var GRAMATICA =
  "&lt;lc-exp&gt; ::= &lt;identificador&gt;\n" +
  "         ::= (lambda (&lt;identificador&gt;) &lt;lc-exp&gt;)\n" +
  "         ::= (&lt;lc-exp&gt; &lt;lc-exp&gt;)";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "declaradas",
      titulo: "1. Las apariciones que declaran",
      enunciado:
        "Escriba <code>declaradas</code>, que devuelve los identificadores que " +
        "las lambdas declaran, de afuera hacia adentro y de izquierda a " +
        "derecha. Un identificador suelto no declara nada: es una referencia. " +
        "En <code>(lambda (x) ...)</code> la <code>x</code> que va entre " +
        "paréntesis después de <code>lambda</code> es la declaración.",
      gramatica: GRAMATICA,
      esqueleto:
        "(define (declaradas e)\n" +
        "  (cond ((symbol? e) ???)\n" +
        "        ((eq? (car e) 'lambda) (cons ??? ???))\n" +
        "        (else (append ??? ???))))\n",
      pruebas: [
        { llamada: "(declaradas 'x)", esperado: "()" },
        { llamada: "(declaradas '(x y))", esperado: "()" },
        { llamada: "(declaradas '(lambda (x) (lambda (y) (x y))))", esperado: "(x y)" },
        { llamada: "(declaradas '((lambda (a) a) (lambda (b) b)))", esperado: "(a b)" },
        { llamada: "(declaradas '(lambda (x) x))", esperado: "(x)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(declaradas 'x)" && obtenido === "(x)") {
          return "Un identificador solo es una referencia, no una " +
            "declaración. Ese caso devuelve la lista vacía.";
        }
        if (llamada === "(declaradas '(lambda (x) x))" && obtenido === "(x x)") {
          return "La x del cuerpo se está contando también. Solo declara la " +
            "que aparece entre paréntesis después de lambda.";
        }
        if (obtenido.indexOf("(x)") === 0 && esperado === "(x y)") {
          return "Falta seguir hacia adentro: el cuerpo de la lambda puede " +
            "traer más declaraciones.";
        }
        return "La lambda aporta su identificador y lo que traiga su cuerpo; " +
          "la aplicación junta lo de sus dos partes.";
      },
      cierre:
        "Declaración y referencia son apariciones distintas del mismo nombre, " +
        "y la gramática dice cuál es cuál por la posición: entre paréntesis " +
        "tras <code>lambda</code>, declara; en cualquier otro lugar, refiere."
    },
    {
      id: "referencias",
      titulo: "2. Las apariciones que usan",
      enunciado:
        "Ahora al revés: <code>referencias</code> devuelve los identificadores " +
        "que se usan, en orden de lectura y con sus repeticiones, porque cada " +
        "aparición cuenta por separado. El identificador que la lambda declara " +
        "no entra en la cuenta: declararlo no es usarlo.",
      gramatica: GRAMATICA,
      esqueleto:
        "(define (referencias e)\n" +
        "  (cond ((symbol? e) ???)\n" +
        "        ((eq? (car e) 'lambda) ???)\n" +
        "        (else (append ??? ???))))\n",
      pruebas: [
        { llamada: "(referencias 'x)", esperado: "(x)" },
        { llamada: "(referencias '(lambda (x) x))", esperado: "(x)" },
        { llamada: "(referencias '(lambda (x) (x (y x))))", esperado: "(x y x)" },
        { llamada: "(referencias '(lambda (z) (lambda (w) z)))", esperado: "(z)" },
        { llamada: "(referencias '(a b))", esperado: "(a b)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(referencias '(lambda (x) x))" && obtenido === "(x x)") {
          return "El identificador declarado se está contando como uso. La " +
            "lambda solo aporta lo que haya en su cuerpo.";
        }
        if (llamada === "(referencias '(lambda (x) (x (y x))))" && obtenido === "(x y)") {
          return "Se están quitando repeticiones. Cada aparición es una " +
            "referencia distinta y todas van.";
        }
        return "Un identificador solo es una referencia; la lambda entrega lo " +
          "de su cuerpo; la aplicación junta las dos partes en orden.";
      },
      cierre:
        "Con los dos procedimientos escritos, la pregunta del ejemplo de " +
        "clase queda partida en dos listas: la de las apariciones que " +
        "introducen un nombre y la de las que lo usan. Falta emparejarlas, y " +
        "eso es lo que hace el alcance."
    },
    {
      id: "libres",
      titulo: "3. Las que no encuentran su declaración",
      enunciado:
        "Escriba <code>libres</code>, que devuelve los identificadores con " +
        "referencias que ninguna lambda de la expresión declara. Sin " +
        "repetidos. Una lambda quita de las libres de su cuerpo el nombre que " +
        "declara, y una aplicación junta las de sus dos partes. " +
        "<code>quita</code> y <code>une</code> vienen resueltos.",
      gramatica: GRAMATICA,
      esqueleto:
        "(define (esta? v lst)\n" +
        "  (cond ((null? lst) #f)\n" +
        "        ((eq? v (car lst)) #t)\n" +
        "        (else (esta? v (cdr lst)))))\n" +
        "\n" +
        "(define (quita v lst)\n" +
        "  (cond ((null? lst) '())\n" +
        "        ((eq? v (car lst)) (quita v (cdr lst)))\n" +
        "        (else (cons (car lst) (quita v (cdr lst))))))\n" +
        "\n" +
        "(define (une a b)\n" +
        "  (cond ((null? a) b)\n" +
        "        ((esta? (car a) b) (une (cdr a) b))\n" +
        "        (else (cons (car a) (une (cdr a) b)))))\n" +
        "\n" +
        "(define (libres e)\n" +
        "  (cond ((symbol? e) ???)\n" +
        "        ((eq? (car e) 'lambda) (quita ??? ???))\n" +
        "        (else (une ??? ???))))\n",
      pruebas: [
        { llamada: "(libres 'x)", esperado: "(x)" },
        { llamada: "(libres '(lambda (x) x))", esperado: "()" },
        { llamada: "(libres '(lambda (x) (x y)))", esperado: "(y)" },
        { llamada: "(libres '(a b))", esperado: "(a b)" },
        { llamada: "(libres '((lambda (x) (x y)) x))", esperado: "(y x)" },
        { llamada: "(libres '(lambda (x) (lambda (y) (x y))))", esperado: "()" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(libres '(lambda (x) x))" && obtenido === "(x)") {
          return "La lambda tiene que quitar de las libres de su cuerpo el " +
            "nombre que declara: adentro ya no está libre.";
        }
        if (llamada === "(libres '(lambda (x) (x y)))" && obtenido === "()") {
          return "Se está quitando de más. Solo sale el identificador " +
            "declarado por esta lambda, y la y no es ese.";
        }
        if (llamada === "(libres 'x)" && obtenido === "()") {
          return "Un identificador suelto no tiene ninguna lambda encima, así " +
            "que está libre y es el único elemento de la respuesta.";
        }
        return "Tres casos: el identificador solo, la lambda que quita el " +
          "suyo, y la aplicación que une las dos partes.";
      },
      cierre:
        "Una expresión sin variables libres se puede evaluar sin saber nada " +
        "del contexto. Las libres son justamente lo que habrá que buscar en " +
        "un ambiente, y por eso este procedimiento reaparece cuando se " +
        "construyen clausuras."
    },
    {
      id: "sombra",
      titulo: "4. Un nombre que tapa a otro",
      enunciado:
        "Escriba <code>sombra?</code>, que responde si alguna lambda declara " +
        "un nombre que ya había sido declarado por otra que la contiene. El " +
        "procedimiento interno lleva la lista de los nombres declarados hasta " +
        "el momento, que es la parte que no se ve desde afuera. Dos lambdas " +
        "hermanas con el mismo nombre no se tapan: ninguna está dentro de la " +
        "otra.",
      gramatica: GRAMATICA,
      esqueleto:
        "(define (esta? v lst)\n" +
        "  (cond ((null? lst) #f)\n" +
        "        ((eq? v (car lst)) #t)\n" +
        "        (else (esta? v (cdr lst)))))\n" +
        "\n" +
        "(define (sombra? e)\n" +
        "  (mirar e '()))\n" +
        "\n" +
        "(define (mirar e vistas)\n" +
        "  (cond ((symbol? e) #f)\n" +
        "        ((eq? (car e) 'lambda)\n" +
        "         (if (esta? ??? vistas)\n" +
        "             ???\n" +
        "             (mirar ??? (cons ??? vistas))))\n" +
        "        (else (or ??? ???))))\n",
      pruebas: [
        { llamada: "(sombra? 'x)", esperado: "#f" },
        { llamada: "(sombra? '(lambda (x) (lambda (y) x)))", esperado: "#f" },
        { llamada: "(sombra? '(lambda (x) (lambda (x) x)))", esperado: "#t" },
        { llamada: "(sombra? '((lambda (x) x) (lambda (x) x)))", esperado: "#f" },
        { llamada: "(sombra? '(lambda (a) ((lambda (b) b) (lambda (a) a))))", esperado: "#t" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(sombra? '((lambda (x) x) (lambda (x) x)))" && obtenido === "#t") {
          return "Las dos lambdas son hermanas y cada una empieza con lo que " +
            "traía de afuera. Lo declarado por una no viaja a la otra.";
        }
        if (llamada === "(sombra? '(lambda (x) (lambda (x) x)))" && obtenido === "#f") {
          return "El nombre que la lambda declara hay que buscarlo en la " +
            "lista de los ya declarados antes de agregarlo.";
        }
        return "Al entrar a una lambda: si su nombre ya estaba, hay sombra; " +
          "si no, se agrega y se sigue por el cuerpo.";
      },
      cierre:
        "La lista de nombres vistos crece al bajar y nunca se comparte entre " +
        "ramas hermanas, que es exactamente cómo se comporta el alcance " +
        "léxico. Ese acumulador es un ambiente en miniatura: guarda qué " +
        "nombres están declarados en el punto donde uno va leyendo."
    },
    {
      id: "renombra",
      titulo: "5. Cambiar el nombre sin cambiar el significado",
      enunciado:
        "Escriba <code>renombra</code>, que reemplaza por otro las referencias " +
        "libres de un identificador. Las que están bajo una lambda que declara " +
        "ese mismo nombre no se tocan: pertenecen a otra declaración y " +
        "cambiarlas cambiaría el significado. Cuando la lambda declara " +
        "justamente el nombre buscado, la expresión se devuelve tal como está.",
      gramatica: GRAMATICA,
      esqueleto:
        "(define (renombra viejo nuevo e)\n" +
        "  (cond ((symbol? e) (if (eq? e viejo) ??? ???))\n" +
        "        ((eq? (car e) 'lambda)\n" +
        "         (if (eq? (car (cadr e)) viejo)\n" +
        "             ???\n" +
        "             (list 'lambda (cadr e) ???)))\n" +
        "        (else (list ??? ???))))\n",
      pruebas: [
        { llamada: "(renombra 'x 'z 'x)", esperado: "z" },
        { llamada: "(renombra 'x 'z 'y)", esperado: "y" },
        { llamada: "(renombra 'x 'z '(lambda (x) x))", esperado: "(lambda (x) x)" },
        { llamada: "(renombra 'x 'z '(lambda (y) x))", esperado: "(lambda (y) z)" },
        { llamada: "(renombra 'x 'z '(x (lambda (x) x)))", esperado: "(z (lambda (x) x))" },
        { llamada: "(renombra 'x 'z '((lambda (y) x) x))", esperado: "((lambda (y) z) z)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(renombra 'x 'z '(lambda (x) x))" && obtenido === "(lambda (z) z)") {
          return "Esa lambda declara el mismo nombre, así que su cuerpo se " +
            "refiere a otra cosa. Cuando eso pasa, la expresión se devuelve " +
            "sin tocar.";
        }
        if (llamada === "(renombra 'x 'z '(lambda (y) x))" && obtenido === "(lambda (y) x)") {
          return "Esta lambda declara otro nombre, así que la referencia de " +
            "adentro sigue siendo libre y sí se cambia.";
        }
        if (llamada === "(renombra 'x 'z 'y)" && obtenido === "z") {
          return "Solo se cambia el identificador buscado; los demás quedan " +
            "como están.";
        }
        return "Tres casos: el identificador, que se cambia solo si es el " +
          "buscado; la lambda, que corta el cambio si declara ese nombre; y " +
          "la aplicación, que rehace sus dos partes.";
      },
      cierre:
        "Lo que detiene el cambio es la declaración, no la profundidad ni la " +
        "posición. Este procedimiento es la parte fácil de la sustitución que " +
        "usan los lenguajes funcionales; la difícil aparece cuando lo que se " +
        "mete adentro trae sus propias variables libres."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
