/* El ambiente extendido recursivo, construido con listas etiquetadas. Seis
   retos que levantan el marco de letrec de abajo hacia arriba: el
   reconocedor, los extractores, la posición de un nombre, el constructor, la
   clausura que el marco fabrica y apply-env con los tres tipos de marco.
   EOPL §3.4. El código del estudiante corre sobre mini-scheme.js. */
var GRAMATICA =
  "&lt;marco&gt; ::= (ambiente-vacio)\n" +
  "        ::= (ambiente-extendido &lt;ids&gt; &lt;valores&gt; &lt;marco&gt;)\n" +
  "        ::= (ambiente-extendido-recursivo &lt;nombres&gt; &lt;idss&gt; &lt;cuerpos&gt; &lt;marco&gt;)\n" +
  "&lt;clausura&gt; ::= (closure &lt;ids&gt; &lt;cuerpo&gt; &lt;marco&gt;)";

var MARCOS =
  ";; Un ambiente es una lista cuyo primer elemento dice de qué tipo de marco\n" +
  ";; se trata. Las dos primeras variantes ya están escritas.\n" +
  "(define ambiente-vacio (lambda () (list 'ambiente-vacio)))\n" +
  "(define ambiente-extendido\n" +
  "  (lambda (lids lvals old-env)\n" +
  "    (list 'ambiente-extendido lids lvals old-env)))\n" +
  "(define vacio? (lambda (env) (and (pair? env) (equal? (car env) 'ambiente-vacio))))\n" +
  "(define ext?   (lambda (env) (and (pair? env) (equal? (car env) 'ambiente-extendido))))\n" +
  "(define ext->lids    (lambda (env) (list-ref env 1)))\n" +
  "(define ext->lvals   (lambda (env) (list-ref env 2)))\n" +
  "(define ext->old-env (lambda (env) (list-ref env 3)))\n" +
  "\n" +
  ";; Las clausuras se representan igual: etiqueta, parámetros, cuerpo y el\n" +
  ";; ambiente que capturaron.\n" +
  "(define closure (lambda (ids cuerpo env) (list 'closure ids cuerpo env)))\n" +
  "(define closure? (lambda (v) (and (pair? v) (equal? (car v) 'closure))))\n" +
  "(define closure->ids    (lambda (c) (list-ref c 1)))\n" +
  "(define closure->cuerpo (lambda (c) (list-ref c 2)))\n" +
  "(define closure->env    (lambda (c) (list-ref c 3)))\n";

var CADENA =
  "\n;; Una cadena armada a mano. El marco recursivo declara salta y recorta;\n" +
  ";; los cuerpos van como marcadores, porque lo que se mide es el marco.\n" +
  "(define base\n" +
  "  (ambiente-extendido '(n tope) '(3 9)\n" +
  "    (ambiente-extendido '(paso) '(2) (ambiente-vacio))))\n" +
  "\n" +
  "(define marco-rec\n" +
  "  (list 'ambiente-extendido-recursivo\n" +
  "        '(salta recorta)\n" +
  "        '((k) (k corte))\n" +
  "        '(cuerpo-salta cuerpo-recorta)\n" +
  "        base))\n";

var RECONOCEDORES =
  "\n;; El marco recursivo: reconocedor y extractores.\n" +
  "(define rec?\n" +
  "  (lambda (env)\n" +
  "    (and (pair? env) (equal? (car env) 'ambiente-extendido-recursivo))))\n" +
  "(define rec->procnames (lambda (env) (list-ref env 1)))\n" +
  "(define rec->idss      (lambda (env) (list-ref env 2)))\n" +
  "(define rec->cuerpos   (lambda (env) (list-ref env 3)))\n" +
  "(define rec->old-env   (lambda (env) (list-ref env 4)))\n";

var CONSTRUCTOR =
  "\n;; El constructor del marco recursivo.\n" +
  "(define ambiente-extendido-recursivo\n" +
  "  (lambda (procnames idss cuerpos old-env)\n" +
  "    (list 'ambiente-extendido-recursivo procnames idss cuerpos old-env)))\n";

var BUSCAR =
  "\n;; buscar-posicion: simbolo x lista-de-simbolos -> numero | #f\n" +
  "(define buscar-posicion\n" +
  "  (lambda (var lids)\n" +
  "    (letrec ((buscar (lambda (lids n)\n" +
  "                       (cond [(null? lids) #false]\n" +
  "                             [(equal? (car lids) var) n]\n" +
  "                             [else (buscar (cdr lids) (+ n 1))]))))\n" +
  "      (buscar lids 0))))\n";

var CADENA_ANIDADA =
  "\n;; Dos marcos recursivos en la misma cadena, y los dos declaran mide.\n" +
  "(define cadena\n" +
  "  (ambiente-extendido-recursivo '(mide) '((t)) '(cuerpo-mide-afuera)\n" +
  "    (ambiente-extendido '(t) '(7)\n" +
  "      (ambiente-extendido-recursivo '(mide escala) '((u) (u v))\n" +
  "                                    '(cuerpo-mide-adentro cuerpo-escala)\n" +
  "        (ambiente-extendido '(u) '(1) (ambiente-vacio))))))\n";

var APLICA_COMPLETO =
  "\n;; apply-env, ya resuelto. El marco vacío responde con el símbolo\n" +
  ";; variable-libre para poder inspeccionar el resultado; en Racket va un\n" +
  ";; eopl:error.\n" +
  "(define apply-env\n" +
  "  (lambda (env var)\n" +
  "    (cond [(vacio? env) 'variable-libre]\n" +
  "          [(ext? env) (buscar-en-marco (ext->lids env) (ext->lvals env)\n" +
  "                                       (ext->old-env env) var)]\n" +
  "          [(rec? env)\n" +
  "           (let ((pos (buscar-posicion var (rec->procnames env))))\n" +
  "             (if (number? pos)\n" +
  "                 (closure (list-ref (rec->idss env) pos)\n" +
  "                          (list-ref (rec->cuerpos env) pos)\n" +
  "                          env)\n" +
  "                 (apply-env (rec->old-env env) var)))]\n" +
  "          [else 'marco-desconocido])))\n" +
  "\n" +
  "(define buscar-en-marco\n" +
  "  (lambda (lids lvals old-env var)\n" +
  "    (cond [(null? lids) (apply-env old-env var)]\n" +
  "          [(equal? (car lids) var) (car lvals)]\n" +
  "          [else (buscar-en-marco (cdr lids) (cdr lvals) old-env var)])))\n";

var APLICA_INGENUO =
  "\n;; La otra versión: al encontrar el nombre, la clausura se queda con\n" +
  ";; old-env en lugar del marco recursivo.\n" +
  "(define apply-env-ingenuo\n" +
  "  (lambda (env var)\n" +
  "    (cond [(vacio? env) 'variable-libre]\n" +
  "          [(ext? env) (buscar-ingenuo (ext->lids env) (ext->lvals env)\n" +
  "                                      (ext->old-env env) var)]\n" +
  "          [(rec? env)\n" +
  "           (let ((pos (buscar-posicion var (rec->procnames env))))\n" +
  "             (if (number? pos)\n" +
  "                 (closure (list-ref (rec->idss env) pos)\n" +
  "                          (list-ref (rec->cuerpos env) pos)\n" +
  "                          (rec->old-env env))\n" +
  "                 (apply-env-ingenuo (rec->old-env env) var)))]\n" +
  "          [else 'marco-desconocido])))\n" +
  "\n" +
  "(define buscar-ingenuo\n" +
  "  (lambda (lids lvals old-env var)\n" +
  "    (cond [(null? lids) (apply-env-ingenuo old-env var)]\n" +
  "          [(equal? (car lids) var) (car lvals)]\n" +
  "          [else (buscar-ingenuo (cdr lids) (cdr lvals) old-env var)])))\n";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "listas-reconocedor",
      titulo: "1. Reconocer el marco recursivo y abrirlo",
      enunciado:
        "El marco que soporta a <code>letrec</code> guarda cuatro cosas: los " +
        "nombres de los procedimientos, la lista de parámetros de cada uno, " +
        "la lista de cuerpos y el ambiente anterior (EOPL §3.4). Con listas " +
        "etiquetadas, eso es una lista de cinco elementos cuyo primero es la " +
        "etiqueta. Escriba <code>rec?</code>, que responde si una lista es un " +
        "marco de esos, y los cuatro extractores. <code>rec?</code> recibe " +
        "cualquier valor, incluso un símbolo, así que primero pregunta si hay " +
        "un par.",
      gramatica: GRAMATICA,
      esqueleto:
        MARCOS + CADENA + "\n" +
        "(define rec?\n" +
        "  (lambda (env)\n" +
        "    (and ??? ???)))\n" +
        "\n" +
        "(define rec->procnames (lambda (env) ???))\n" +
        "(define rec->idss      (lambda (env) ???))\n" +
        "(define rec->cuerpos   (lambda (env) ???))\n" +
        "(define rec->old-env   (lambda (env) ???))\n",
      pruebas: [
        { llamada: "(rec? marco-rec)", esperado: "#t" },
        { llamada: "(rec? base)", esperado: "#f" },
        { llamada: "(rec? 'salta)", esperado: "#f" },
        { llamada: "(rec->procnames marco-rec)", esperado: "(salta recorta)" },
        { llamada: "(rec->idss marco-rec)", esperado: "((k) (k corte))" },
        { llamada: "(rec->cuerpos marco-rec)", esperado: "(cuerpo-salta cuerpo-recorta)" },
        { llamada: "(equal? (rec->old-env marco-rec) base)", esperado: "#t" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(rec? 'salta)") {
          return "Sobre un símbolo, car falla. El and pregunta primero si hay " +
            "un par y solo entonces mira la etiqueta.";
        }
        if (llamada === "(rec->procnames marco-rec)" && obtenido === "ambiente-extendido-recursivo") {
          return "Esa es la etiqueta, que ocupa la posición 0. Los nombres de " +
            "los procedimientos están una posición más adelante.";
        }
        if (llamada === "(rec->idss marco-rec)" && obtenido === "(salta recorta)") {
          return "Las posiciones están corridas en uno: la 1 trae los " +
            "nombres, la 2 las listas de parámetros, la 3 los cuerpos y la 4 " +
            "el ambiente anterior.";
        }
        return "La lista es (etiqueta nombres idss cuerpos old-env). Cada " +
          "extractor es un list-ref con la posición que le toca.";
      },
      cierre:
        "Cinco posiciones y una etiqueta al frente: eso basta para distinguir " +
        "este marco de uno simple y para sacarle sus cuatro partes. Lo que un " +
        "define-datatype resuelve con una cláusula de cases, aquí lo resuelven " +
        "un predicado sobre el primer elemento y cuatro list-ref."
    },
    {
      id: "listas-posicion",
      titulo: "2. La posición de un nombre entre los declarados",
      enunciado:
        "El marco guarda tres listas paralelas, así que encontrar un " +
        "procedimiento es encontrar su índice: con la posición se saca después " +
        "su lista de parámetros y su cuerpo. Escriba " +
        "<code>buscar-posicion</code>, que devuelve el índice desde cero del " +
        "primer nombre igual a <code>var</code>, y <code>#f</code> cuando no " +
        "está. El contador arranca afuera y crece con cada paso.",
      gramatica: GRAMATICA,
      esqueleto:
        MARCOS + CADENA + RECONOCEDORES + "\n" +
        "(define buscar-posicion\n" +
        "  (lambda (var lids)\n" +
        "    (letrec ((buscar (lambda (lids n)\n" +
        "                       (cond [??? ???]\n" +
        "                             [??? ???]\n" +
        "                             [else (buscar (cdr lids) ???)]))))\n" +
        "      (buscar lids ???))))\n",
      pruebas: [
        { llamada: "(buscar-posicion 'salta '(salta recorta))", esperado: "0" },
        { llamada: "(buscar-posicion 'recorta '(salta recorta))", esperado: "1" },
        { llamada: "(buscar-posicion 'tope '(salta recorta))", esperado: "#f" },
        { llamada: "(buscar-posicion 'nada '())", esperado: "#f" },
        { llamada: "(buscar-posicion 'd '(a b c d))", esperado: "3" },
        { llamada: "(buscar-posicion 'recorta (rec->procnames marco-rec))", esperado: "1" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (esperado === "0" && obtenido === "1") {
          return "El conteo empieza en cero, porque list-ref cuenta desde " +
            "cero: la llamada de afuera pasa 0, no 1.";
        }
        if (esperado === "#f" && obtenido !== "#f") {
          return "Cuando la lista se agota el nombre no estaba declarado en " +
            "este marco, y la respuesta es #false, no un número.";
        }
        if (obtenido.indexOf("car") !== -1) {
          return "El caso de la lista vacía va primero: si se compara antes " +
            "de preguntar por null?, car corre sobre la lista vacía.";
        }
        return "Tres casos: lista agotada, cabeza igual a var, y el resto con " +
          "el contador en uno más.";
      },
      cierre:
        "Un índice en lugar de un valor: ahí está la diferencia con el marco " +
        "simple, que guarda los valores ya hechos y los devuelve. El " +
        "recursivo guarda los ingredientes en tres listas paralelas, y la " +
        "posición es la que mantiene alineados el nombre, sus parámetros y su " +
        "cuerpo."
    },
    {
      id: "listas-constructor",
      titulo: "3. Construir el marco y fabricar la clausura",
      enunciado:
        "Escriba <code>ambiente-extendido-recursivo</code>, que arma la lista " +
        "de cinco elementos, y <code>rec->closure-en</code>, que recibe un " +
        "marco recursivo y una posición y devuelve la clausura del " +
        "procedimiento que está ahí. La clausura lleva los parámetros y el " +
        "cuerpo de esa posición, y como ambiente capturado el marco recursivo " +
        "que la contiene (EOPL §3.4).",
      gramatica: GRAMATICA,
      esqueleto:
        MARCOS + CADENA + RECONOCEDORES + "\n" +
        "(define ambiente-extendido-recursivo\n" +
        "  (lambda (procnames idss cuerpos old-env)\n" +
        "    (list ??? ??? ??? ??? ???)))\n" +
        "\n" +
        "(define rec->closure-en\n" +
        "  (lambda (env pos)\n" +
        "    (closure (list-ref ??? pos)\n" +
        "             (list-ref ??? pos)\n" +
        "             ???)))\n",
      pruebas: [
        { llamada: "(car (ambiente-extendido-recursivo '(gira) '((g)) '(cuerpo-gira) base))", esperado: "ambiente-extendido-recursivo" },
        { llamada: "(length (ambiente-extendido-recursivo '(gira) '((g)) '(cuerpo-gira) base))", esperado: "5" },
        { llamada: "(rec? (ambiente-extendido-recursivo '(gira) '((g)) '(cuerpo-gira) base))", esperado: "#t" },
        { llamada: "(rec->idss (ambiente-extendido-recursivo '(gira) '((g)) '(cuerpo-gira) base))", esperado: "((g))" },
        { llamada: "(closure->ids (rec->closure-en marco-rec 1))", esperado: "(k corte)" },
        { llamada: "(closure->cuerpo (rec->closure-en marco-rec 0))", esperado: "cuerpo-salta" },
        { llamada: "(rec? (closure->env (rec->closure-en marco-rec 0)))", esperado: "#t" },
        { llamada: "(equal? (closure->env (rec->closure-en marco-rec 0)) marco-rec)", esperado: "#t" },
        { llamada: "(equal? (closure->env (rec->closure-en marco-rec 1)) base)", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada.indexOf("(rec? (closure->env") === 0 && obtenido === "#f") {
          return "La clausura se quedó con otro ambiente. El tercer campo es " +
            "env, el marco recursivo que entró a rec->closure-en.";
        }
        if (llamada.indexOf("marco-rec)") !== -1 && esperado === "#t" && obtenido === "#f") {
          return "Con old-env en el tercer campo, la clausura mira hacia " +
            "afuera del marco y ya no alcanza los nombres que ese marco " +
            "declara. Tiene que quedar env.";
        }
        if (esperado === "#f" && obtenido === "#t") {
          return "El ambiente capturado no es base: es el marco recursivo " +
            "completo, y base es apenas su cuarto campo.";
        }
        if (llamada.indexOf("(length") === 0) {
          return "La lista lleva cinco elementos: la etiqueta entre comillas " +
            "y los cuatro parámetros en el orden en que llegan.";
        }
        return "El constructor pone la etiqueta y los cuatro campos; " +
          "rec->closure-en saca con list-ref los parámetros y el cuerpo de la " +
          "posición pos, y captura env.";
      },
      cierre:
        "El marco no guarda clausuras: guarda con qué fabricarlas y las " +
        "produce cuando alguien pregunta. Ese retardo es lo que permite que " +
        "la clausura apunte al mismo marco que la declara, algo imposible si " +
        "hubiera que tenerla lista en el momento de construirlo."
    },
    {
      id: "listas-caso-recursivo",
      titulo: "4. El caso recursivo de apply-env",
      enunciado:
        "El marco vacío y el simple ya están resueltos, y el vacío responde " +
        "con el símbolo <code>variable-libre</code> para poder inspeccionar el " +
        "resultado (en Racket va un <code>eopl:error</code>). Complete la " +
        "cláusula del marco recursivo: busque la posición del nombre entre los " +
        "declarados; si está, devuelva la clausura de esa posición; si no, " +
        "siga la búsqueda en el ambiente anterior (EOPL §3.4).",
      gramatica: GRAMATICA,
      esqueleto:
        MARCOS + CADENA + RECONOCEDORES + CONSTRUCTOR + BUSCAR + "\n" +
        "(define apply-env\n" +
        "  (lambda (env var)\n" +
        "    (cond [(vacio? env) 'variable-libre]\n" +
        "          [(ext? env) (buscar-en-marco (ext->lids env) (ext->lvals env)\n" +
        "                                       (ext->old-env env) var)]\n" +
        "          [(rec? env)\n" +
        "           (let ((pos (buscar-posicion var ???)))\n" +
        "             (if (number? pos)\n" +
        "                 (closure (list-ref ??? pos)\n" +
        "                          (list-ref ??? pos)\n" +
        "                          ???)\n" +
        "                 (apply-env ??? var)))]\n" +
        "          [else 'marco-desconocido])))\n" +
        "\n" +
        "(define buscar-en-marco\n" +
        "  (lambda (lids lvals old-env var)\n" +
        "    (cond [(null? lids) (apply-env old-env var)]\n" +
        "          [(equal? (car lids) var) (car lvals)]\n" +
        "          [else (buscar-en-marco (cdr lids) (cdr lvals) old-env var)])))\n",
      pruebas: [
        { llamada: "(apply-env marco-rec 'n)", esperado: "3" },
        { llamada: "(apply-env marco-rec 'paso)", esperado: "2" },
        { llamada: "(apply-env marco-rec 'otra)", esperado: "variable-libre" },
        { llamada: "(closure->ids (apply-env marco-rec 'recorta))", esperado: "(k corte)" },
        { llamada: "(closure->cuerpo (apply-env marco-rec 'salta))", esperado: "cuerpo-salta" },
        { llamada: "(rec? (closure->env (apply-env marco-rec 'salta)))", esperado: "#t" },
        { llamada: "(equal? (closure->env (apply-env marco-rec 'salta)) marco-rec)", esperado: "#t" },
        { llamada: "(equal? (closure->env (apply-env marco-rec 'salta)) base)", esperado: "#f" },
        { llamada: "(apply-env (ambiente-extendido-recursivo '() '() '() base) 'n)", esperado: "3" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(rec? (closure->env (apply-env marco-rec 'salta)))" && obtenido === "#f") {
          return "La clausura capturó el ambiente anterior. El tercer campo es " +
            "env, y por eso salta puede volver a encontrarse a sí misma.";
        }
        if (llamada === "(equal? (closure->env (apply-env marco-rec 'salta)) base)" && obtenido === "#t") {
          return "Con base en el tercer campo, la llamada recursiva de salta " +
            "no encontraría su propio nombre. Lo que se captura es el marco, " +
            "no lo que había antes de él.";
        }
        if (esperado === "3" && obtenido === "variable-libre") {
          return "Cuando el nombre no está entre los declarados, la búsqueda " +
            "sigue en el cuarto campo del marco, que es el ambiente anterior.";
        }
        if (llamada === "(closure->ids (apply-env marco-rec 'recorta))" && obtenido === "(k)") {
          return "Esa es la posición 0. La posición que devolvió " +
            "buscar-posicion es la que indexa las tres listas.";
        }
        return "Un let con la posición, un if sobre number?, y en la rama " +
          "afirmativa la clausura con env; en la otra, apply-env sobre " +
          "rec->old-env.";
      },
      cierre:
        "Las tres líneas que hacen posible la recursión en el intérprete: " +
        "buscar el nombre, armar la clausura con los ingredientes de esa " +
        "posición y capturar el marco donde se encontró. Cambiar env por " +
        "old-env deja un procedimiento que no se ve a sí mismo, y el error " +
        "aparece recién en la primera llamada recursiva."
    },
    {
      id: "listas-apply-env",
      titulo: "5. apply-env con los tres tipos de marco",
      enunciado:
        "Ahora la cadena tiene dos marcos recursivos y los dos declaran " +
        "<code>mide</code>. Escriba <code>apply-env</code> entero: el marco " +
        "vacío responde <code>variable-libre</code>, el simple recorre sus " +
        "listas paralelas y pasa al anterior cuando se agotan, y el recursivo " +
        "fabrica la clausura. El recorrido se detiene en el primer marco que " +
        "liga el nombre, así que el de afuera tapa al de adentro.",
      gramatica: GRAMATICA,
      esqueleto:
        MARCOS + RECONOCEDORES + CONSTRUCTOR + BUSCAR + CADENA_ANIDADA + "\n" +
        "(define apply-env\n" +
        "  (lambda (env var)\n" +
        "    (cond [(vacio? env) ???]\n" +
        "          [(ext? env) (buscar-en-marco (ext->lids env) (ext->lvals env)\n" +
        "                                       (ext->old-env env) var)]\n" +
        "          [(rec? env) ???]\n" +
        "          [else 'marco-desconocido])))\n" +
        "\n" +
        "(define buscar-en-marco\n" +
        "  (lambda (lids lvals old-env var)\n" +
        "    (cond [??? ???]\n" +
        "          [??? ???]\n" +
        "          [else (buscar-en-marco (cdr lids) (cdr lvals) old-env var)])))\n",
      pruebas: [
        { llamada: "(apply-env cadena 't)", esperado: "7" },
        { llamada: "(apply-env cadena 'u)", esperado: "1" },
        { llamada: "(apply-env cadena 'nada)", esperado: "variable-libre" },
        { llamada: "(closure->cuerpo (apply-env cadena 'mide))", esperado: "cuerpo-mide-afuera" },
        { llamada: "(closure->cuerpo (apply-env cadena 'escala))", esperado: "cuerpo-escala" },
        { llamada: "(closure->ids (apply-env cadena 'escala))", esperado: "(u v)" },
        { llamada: "(rec? (closure->env (apply-env cadena 'escala)))", esperado: "#t" },
        { llamada: "(equal? (closure->env (apply-env cadena 'escala)) cadena)", esperado: "#f" },
        { llamada: "(length (rec->procnames (closure->env (apply-env cadena 'escala))))", esperado: "2" },
        { llamada: "(closure->cuerpo (apply-env (closure->env (apply-env cadena 'escala)) 'mide))", esperado: "cuerpo-mide-adentro" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(closure->cuerpo (apply-env cadena 'mide))" && obtenido === "cuerpo-mide-adentro") {
          return "La búsqueda llegó demasiado lejos. El primer marco de la " +
            "cadena ya declara mide, y ese es el que responde.";
        }
        if (llamada === "(rec? (closure->env (apply-env cadena 'escala)))" && obtenido === "#f") {
          return "La clausura de escala se quedó con el ambiente anterior al " +
            "marco. El tercer campo es env, el marco donde se encontró el " +
            "nombre.";
        }
        if (llamada === "(equal? (closure->env (apply-env cadena 'escala)) cadena)" && obtenido === "#t") {
          return "Se capturó la cadena completa en vez del marco donde se " +
            "encontró el nombre. El env que entra a la cláusula recursiva es " +
            "el marco de ese paso, no el de arriba.";
        }
        if (llamada === "(closure->cuerpo (apply-env (closure->env (apply-env cadena 'escala)) 'mide))" && obtenido === "cuerpo-mide-afuera") {
          return "Dentro del marco de adentro, mide es el que ese marco " +
            "declara. Si se llega al de afuera, la clausura de escala quedó " +
            "con la cadena completa.";
        }
        if (esperado === "7" || esperado === "1") {
          return "En el marco simple, cuando las listas se agotan la búsqueda " +
            "pasa a old-env; mientras queden elementos se comparan cabeza " +
            "contra cabeza.";
        }
        return "Tres cláusulas en apply-env y tres casos en buscar-en-marco: " +
          "listas agotadas, cabeza igual a var, y el resto.";
      },
      cierre:
        "Dos marcos recursivos que declaran el mismo nombre, y cada clausura " +
        "se queda con el suyo. Eso es el alcance estático del letrec: la " +
        "respuesta a mide depende de dónde se pregunte, y las dos respuestas " +
        "conviven en la misma cadena."
    },
    {
      id: "listas-se-vuelve-a-ver",
      titulo: "6. Medir la autorreferencia",
      enunciado:
        "Dos versiones de la búsqueda vienen escritas: <code>apply-env</code>, " +
        "que captura el marco recursivo, y <code>apply-env-ingenuo</code>, que " +
        "captura el ambiente anterior. Escriba <code>se-vuelve-a-ver?</code>, " +
        "que recibe una de las dos como primer argumento. Busca " +
        "<code>var</code> en <code>env</code>; si lo que sale es una clausura, " +
        "la vuelve a buscar en el ambiente que esa clausura capturó y " +
        "responde si obtuvo la misma clausura. Un valor que no es clausura da " +
        "<code>#f</code>.",
      gramatica: GRAMATICA,
      esqueleto:
        MARCOS + RECONOCEDORES + CONSTRUCTOR + BUSCAR + CADENA_ANIDADA +
        APLICA_COMPLETO + APLICA_INGENUO + "\n" +
        "(define se-vuelve-a-ver?\n" +
        "  (lambda (buscar env var)\n" +
        "    (let ((c (buscar env var)))\n" +
        "      (and (closure? ???)\n" +
        "           (equal? (buscar ??? ???) ???)))))\n",
      pruebas: [
        { llamada: "(se-vuelve-a-ver? apply-env cadena 'mide)", esperado: "#t" },
        { llamada: "(se-vuelve-a-ver? apply-env cadena 'escala)", esperado: "#t" },
        { llamada: "(se-vuelve-a-ver? apply-env-ingenuo cadena 'mide)", esperado: "#f" },
        { llamada: "(se-vuelve-a-ver? apply-env-ingenuo cadena 'escala)", esperado: "#f" },
        { llamada: "(se-vuelve-a-ver? apply-env cadena 't)", esperado: "#f" },
        { llamada: "(se-vuelve-a-ver? apply-env cadena 'nada)", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (esperado === "#t" && obtenido === "#f") {
          return "La segunda búsqueda va sobre el ambiente de la clausura, " +
            "que se saca con closure->env, y con el mismo var de la primera.";
        }
        if (llamada === "(se-vuelve-a-ver? apply-env cadena 't)" && obtenido === "#t") {
          return "El valor de t es 7, no una clausura: cuando closure? " +
            "responde #f, el and corta ahí y no hay segunda búsqueda.";
        }
        if (obtenido.indexOf("list-ref") !== -1 || obtenido.indexOf("car") !== -1) {
          return "Sin el closure? adelante, closure->env corre sobre un " +
            "número o un símbolo. El and lo evita.";
        }
        return "Un let con el resultado de la primera búsqueda, closure? " +
          "sobre él, y la segunda búsqueda comparada con equal? contra ese " +
          "mismo resultado.";
      },
      cierre:
        "La prueba cabe en una línea: buscar el nombre en el ambiente de su " +
        "propia clausura devuelve la misma clausura. Con el ambiente anterior " +
        "en su lugar, el nombre queda libre o resuelve a otro procedimiento, y " +
        "la llamada recursiva falla en tiempo de ejecución. Es la única " +
        "diferencia entre las dos versiones, y se mide con equal?."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
