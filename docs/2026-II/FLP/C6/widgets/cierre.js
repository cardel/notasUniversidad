/* Procedimientos recursivos y letrec (EOPL §3.4). Cinco retos de cierre: contar
   las clausuras que fabrica apply-env, decidir qué declaración cabe en el marco
   recursivo, armar el árbol de llamadas como dato, leer en un árbol las
   producciones que lo generan y evaluar la producción nueva. El código del
   estudiante corre sobre mini-scheme.js. */
var GRAMATICA =
  "&lt;expresion&gt; ::= &lt;numero&gt;                                        lit-exp (dato)\n" +
  "            ::= &lt;identificador&gt;                                 var-exp (id)\n" +
  "            ::= &lt;primitiva&gt; ( {&lt;expresion&gt;}*(,) )               prim-exp (prim args)\n" +
  "            ::= if &lt;expresion&gt; then &lt;expresion&gt; else &lt;expresion&gt;   if-exp\n" +
  "            ::= let {&lt;identificador&gt; = &lt;expresion&gt;}* in &lt;expresion&gt;   let-exp\n" +
  "            ::= proc ( {&lt;identificador&gt;}*(,) ) &lt;expresion&gt;      proc-exp\n" +
  "            ::= ( &lt;expresion&gt; {&lt;expresion&gt;}* )                  app-exp\n" +
  "            ::= letrec {&lt;identificador&gt; ( {&lt;identificador&gt;}*(,) ) = &lt;expresion&gt;}*\n" +
  "                in &lt;expresion&gt;                                  letrec-exp\n" +
  "&lt;primitiva&gt;  ::= + | - | * | / | add1 | sub1 | &gt; | &lt; | ==";

var GRAMATICA_UNO =
  "&lt;expresion&gt; ::= &lt;numero&gt;                                        lit-exp (dato)\n" +
  "            ::= &lt;identificador&gt;                                 var-exp (id)\n" +
  "            ::= &lt;primitiva&gt; ( {&lt;expresion&gt;}*(,) )               prim-exp (prim args)\n" +
  "            ::= if &lt;expresion&gt; then &lt;expresion&gt; else &lt;expresion&gt;   if-exp\n" +
  "            ::= let {&lt;identificador&gt; = &lt;expresion&gt;}* in &lt;expresion&gt;   let-exp\n" +
  "            ::= proc ( {&lt;identificador&gt;}*(,) ) &lt;expresion&gt;      proc-exp\n" +
  "            ::= ( &lt;expresion&gt; {&lt;expresion&gt;}* )                  app-exp\n" +
  "            ::= letrec1 &lt;identificador&gt; ( {&lt;identificador&gt;}*(,) ) = &lt;expresion&gt;\n" +
  "                in &lt;expresion&gt;    letrec1-exp (nombre params cuerpo-proc cuerpo)";

var DATATYPE_EXP =
  "(define-datatype expresion expresion?\n" +
  "  (lit-exp     (dato number?))\n" +
  "  (var-exp     (id symbol?))\n" +
  "  (prim-exp    (prim symbol?) (args (list-of expresion?)))\n" +
  "  (if-exp      (prueba expresion?) (entonces expresion?) (sino expresion?))\n" +
  "  (let-exp     (ids (list-of symbol?)) (rands (list-of expresion?)) (cuerpo expresion?))\n" +
  "  (proc-exp    (ids (list-of symbol?)) (cuerpo expresion?))\n" +
  "  (letrec1-exp (nombre symbol?) (params (list-of symbol?))\n" +
  "               (cuerpo-proc expresion?) (cuerpo expresion?))\n" +
  "  (app-exp     (rator expresion?) (rands (list-of expresion?))))\n";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "cierre-clausuras",
      titulo: "1. Cuántas clausuras fabrica apply-env",
      enunciado:
        "El marco que arma <code>letrec</code> no guarda clausuras: guarda el " +
        "nombre, la lista de parámetros y el cuerpo (EOPL §3.4). La clausura " +
        "nace cuando el nombre se consulta, y captura el marco mismo, así que " +
        "hay exactamente una clausura por consulta. Medido sobre el " +
        "interpretador de la sesión: " +
        "<code>letrec fact(n) = if ==(n,0) then 1 else *(n, (fact sub1(n))) in (fact 5)</code> " +
        "fabrica 6, y " +
        "<code>letrec bajar(n) = if ==(n,0) then 0 else (bajar sub1(n)) in (bajar 4)</code> " +
        "fabrica 5. Escriba <code>clausuras-lineal</code>, que da ese número " +
        "para <code>bajar</code> con cualquier argumento, y " +
        "<code>clausuras-fib</code>, que lo da para " +
        "<code>letrec fib(n) = if &lt;(n,2) then n else +((fib sub1(n)), (fib -(n,2))) in (fib n)</code>.",
      gramatica: GRAMATICA,
      esqueleto:
        "(define (clausuras-lineal n)\n" +
        "  (if (zero? n)\n" +
        "      ???\n" +
        "      (+ ??? ???)))\n" +
        "\n" +
        "(define (clausuras-fib n)\n" +
        "  (if (< n 2)\n" +
        "      ???\n" +
        "      (+ ??? ??? ???)))\n",
      pruebas: [
        { llamada: "(clausuras-lineal 0)", esperado: "1" },
        { llamada: "(clausuras-lineal 4)", esperado: "5" },
        { llamada: "(clausuras-lineal 7)", esperado: "8" },
        { llamada: "(clausuras-fib 0)", esperado: "1" },
        { llamada: "(clausuras-fib 2)", esperado: "3" },
        { llamada: "(clausuras-fib 5)", esperado: "15" },
        { llamada: "(clausuras-fib 6)", esperado: "25" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(clausuras-lineal 0)" && obtenido === "0") {
          return "Con n igual a cero ya hubo una consulta: la que el cuerpo " +
            "del letrec hizo para aplicar el procedimiento la primera vez.";
        }
        if (llamada === "(clausuras-lineal 4)" && obtenido === "4") {
          return "Falta la consulta del arranque. Son las cuatro llamadas que " +
            "bajan más la primera.";
        }
        if (llamada === "(clausuras-fib 5)" && obtenido === "5") {
          return "Ese es el valor de fib, no el conteo. Cada llamada consulta " +
            "fib una vez y además dispara las consultas de sus dos ramas.";
        }
        if (llamada === "(clausuras-fib 5)" && obtenido === "11") {
          return "Se está contando una rama. La llamada con n aporta una " +
            "consulta, y bajo ella están las de n-1 y las de n-2.";
        }
        return "La propia llamada cuenta uno, y a eso se suman las consultas " +
          "de las llamadas que dispara. Con n menor que 2 no dispara ninguna.";
      },
      cierre:
        "Las dos cuentas salen del mismo lugar: una consulta de apply-env, una " +
        "clausura. La recursión que baja de uno en uno deja n+1; la de " +
        "Fibonacci deja tantas como nodos tenga su árbol de llamadas, que para " +
        "n igual a 6 ya son 25 mientras el valor apenas llega a 8."
    },
    {
      id: "cierre-admisible",
      titulo: "2. Qué declaración cabe en el marco recursivo",
      enunciado:
        "El marco recursivo guarda nombres, listas de parámetros y cuerpos " +
        "(EOPL §3.4), y por eso la gramática pide paréntesis de parámetros " +
        "después del nombre: <code>letrec tope = 5 in +(tope, 1)</code> no " +
        "tiene dónde ir, porque el marco no almacena valores y evaluar el lado " +
        "derecho exigiría el marco antes de armarlo. Escriba " +
        "<code>admisible?</code>, que dice si una declaración cabe; " +
        "<code>nombres-admisibles</code>, que lista los nombres que el marco " +
        "acepta; y <code>primera-rechazada</code>, que da el nombre de la " +
        "primera que no cabe, o <code>#f</code> si todas caben.",
      gramatica:
        "(define-datatype declaracion declaracion?\n" +
        "  (dec-proc  (nombre symbol?) (params (list-of symbol?)) (cuerpo list?))\n" +
        "  (dec-valor (nombre symbol?) (valor list?)))\n",
      esqueleto:
        "(define-datatype declaracion declaracion?\n" +
        "  (dec-proc  (nombre symbol?) (params (list-of symbol?)) (cuerpo list?))\n" +
        "  (dec-valor (nombre symbol?) (valor list?)))\n" +
        "\n" +
        ";; Dos marcos para las pruebas.\n" +
        "(define marco-listas\n" +
        "  (list (dec-proc 'contar '(xs) '(if (null? xs) 0 (add1 (contar (cdr xs)))))\n" +
        "        (dec-proc 'juntar '(xs ys) '(append xs ys))))\n" +
        "(define marco-mezclado\n" +
        "  (list (dec-proc 'contar '(xs) '(add1 (contar (cdr xs))))\n" +
        "        (dec-valor 'tope '(5))\n" +
        "        (dec-proc 'juntar '(xs ys) '(append xs ys))\n" +
        "        (dec-valor 'piso '(0))))\n" +
        "\n" +
        "(define (admisible? d)\n" +
        "  (cases declaracion d\n" +
        "    (dec-proc (nombre params cuerpo) ???)\n" +
        "    (dec-valor (nombre valor) ???)))\n" +
        "\n" +
        "(define (nombre-de d)\n" +
        "  (cases declaracion d\n" +
        "    (dec-proc (nombre params cuerpo) ???)\n" +
        "    (dec-valor (nombre valor) ???)))\n" +
        "\n" +
        "(define (nombres-admisibles decls)\n" +
        "  (cond ((null? decls) '())\n" +
        "        ((admisible? (car decls)) ???)\n" +
        "        (else ???)))\n" +
        "\n" +
        "(define (primera-rechazada decls)\n" +
        "  (cond ((null? decls) ???)\n" +
        "        ((admisible? (car decls)) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(admisible? (dec-proc 'repetir '(n x) '(cons x (repetir (sub1 n) x))))", esperado: "#t" },
        { llamada: "(admisible? (dec-valor 'tope '(5)))", esperado: "#f" },
        { llamada: "(nombres-admisibles marco-listas)", esperado: "(contar juntar)" },
        { llamada: "(nombres-admisibles marco-mezclado)", esperado: "(contar juntar)" },
        { llamada: "(primera-rechazada marco-listas)", esperado: "#f" },
        { llamada: "(primera-rechazada marco-mezclado)", esperado: "tope" },
        { llamada: "(nombres-admisibles '())", esperado: "()" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(nombres-admisibles marco-mezclado)" &&
            obtenido === "(contar tope juntar piso)") {
          return "La rama del cond que descarta no debe agregar nada: sigue " +
            "con el resto de la lista y ya.";
        }
        if (llamada === "(primera-rechazada marco-listas)" && obtenido === "()") {
          return "Sobre una lista sin rechazos la respuesta es #f, no la " +
            "lista vacía: lo que se devuelve es un nombre o nada.";
        }
        if (llamada === "(primera-rechazada marco-mezclado)" && obtenido === "piso") {
          return "Se llegó hasta la última. Al encontrar la primera que no " +
            "cabe se devuelve su nombre, sin seguir recorriendo.";
        }
        return "Una declaración cabe si declara un procedimiento. Las dos " +
          "funciones sobre listas recorren con cond: la primera construye con " +
          "cons cuando cabe y salta cuando no; la segunda devuelve el nombre " +
          "en cuanto una no cabe.";
      },
      cierre:
        "Lo que decide no es el tipo del valor declarado sino la forma de la " +
        "declaración: el marco solo sabe reconstruir un procedimiento a partir " +
        "de parámetros y cuerpo. El parser rechaza antes " +
        "letrec tope = 5, porque la producción exige los " +
        "paréntesis de parámetros entre el nombre y el signo igual."
    },
    {
      id: "cierre-arbol",
      titulo: "3. El árbol de llamadas como dato",
      enunciado:
        "El conteo de clausuras es el número de nodos del árbol de llamadas. " +
        "<code>camina</code> baja de uno, de dos y de tres a la vez: " +
        "<code>letrec camina(n) = if &lt;(n,3) then 1 else +((camina sub1(n)), (camina -(n,2)), (camina -(n,3))) in (camina 5)</code>. " +
        "Medido sobre el interpretador de la sesión, esa corrida fabrica 13 " +
        "clausuras y devuelve 9. Arme el árbol como valor de un datatype con " +
        "<code>arbol-de</code> y mídalo con <code>nodos</code>, " +
        "<code>hojas</code> y <code>profundidad</code>: una hoja es una " +
        "llamada que no dispara ninguna otra, y la profundidad de una hoja es 1.",
      gramatica:
        "(define-datatype arbol-llamadas arbol-llamadas?\n" +
        "  (llamada-base (arg number?))\n" +
        "  (llamada-nodo (arg number?) (hijas (list-of arbol-llamadas?))))\n",
      esqueleto:
        "(define-datatype arbol-llamadas arbol-llamadas?\n" +
        "  (llamada-base (arg number?))\n" +
        "  (llamada-nodo (arg number?) (hijas (list-of arbol-llamadas?))))\n" +
        "\n" +
        ";; Las hijas van en el orden de la expresión: n-1, n-2 y n-3.\n" +
        "(define (arbol-de n)\n" +
        "  (if (< n 3)\n" +
        "      ???\n" +
        "      (llamada-nodo n (list ??? ??? ???))))\n" +
        "\n" +
        "(define (nodos a)\n" +
        "  (cases arbol-llamadas a\n" +
        "    (llamada-base (arg) ???)\n" +
        "    (llamada-nodo (arg hijas) (+ 1 (nodos-lista hijas)))))\n" +
        "\n" +
        "(define (nodos-lista hijas)\n" +
        "  (if (null? hijas) 0 (+ ??? ???)))\n" +
        "\n" +
        "(define (hojas a)\n" +
        "  (cases arbol-llamadas a\n" +
        "    (llamada-base (arg) ???)\n" +
        "    (llamada-nodo (arg hijas) (hojas-lista hijas))))\n" +
        "\n" +
        "(define (hojas-lista hijas)\n" +
        "  (if (null? hijas) 0 (+ ??? ???)))\n" +
        "\n" +
        "(define (profundidad a)\n" +
        "  (cases arbol-llamadas a\n" +
        "    (llamada-base (arg) ???)\n" +
        "    (llamada-nodo (arg hijas) (+ 1 (mayor-profundidad hijas)))))\n" +
        "\n" +
        "(define (mayor-profundidad hijas)\n" +
        "  (if (null? hijas) 0 (max ??? ???)))\n",
      pruebas: [
        { llamada: "(arbol-de 2)", esperado: "(llamada-base 2)" },
        { llamada: "(arbol-de 3)", esperado: "(llamada-nodo 3 ((llamada-base 2) (llamada-base 1) (llamada-base 0)))" },
        { llamada: "(nodos (arbol-de 3))", esperado: "4" },
        { llamada: "(nodos (arbol-de 5))", esperado: "13" },
        { llamada: "(nodos (arbol-de 6))", esperado: "25" },
        { llamada: "(hojas (arbol-de 5))", esperado: "9" },
        { llamada: "(profundidad (arbol-de 2))", esperado: "1" },
        { llamada: "(profundidad (arbol-de 5))", esperado: "4" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(arbol-de 3)" && obtenido.indexOf("llamada-nodo 3 ((llamada-base 0)") === 0) {
          return "Las hijas quedaron al revés. El orden es el de la " +
            "expresión: primero sub1(n), luego -(n,2) y luego -(n,3).";
        }
        if (llamada === "(nodos (arbol-de 5))" && obtenido === "9") {
          return "Ese es el conteo de hojas. nodos suma también los nodos " +
            "internos: uno por cada llamada, hoja o no.";
        }
        if (llamada === "(profundidad (arbol-de 5))" && obtenido === "13") {
          return "Entre las hijas se toma la mayor profundidad, no la suma.";
        }
        if (llamada === "(profundidad (arbol-de 2))" && obtenido === "0") {
          return "Una hoja ya es un nivel.";
        }
        return "El caso base construye una hoja con n; el otro, un nodo con " +
          "los árboles de n-1, n-2 y n-3. Los tres auxiliares recorren la " +
          "lista de hijas: dos suman y el tercero compara.";
      },
      cierre:
        "Las 13 clausuras son los 13 nodos y el valor 9 son las 9 hojas: cada " +
        "hoja aporta su 1 y los nodos internos solo suman lo que les llega. " +
        "La profundidad 4 es lo más que llega a crecer la pila de llamadas, y " +
        "es mucho menor que el número de nodos."
    },
    {
      id: "cierre-producciones",
      titulo: "4. Del árbol a las producciones que lo generan",
      enunciado:
        "La gramática de abajo cambia el <code>letrec</code> de varios " +
        "procedimientos por <code>letrec1</code>, que declara exactamente uno. " +
        "Leyendo un árbol al revés se recupera qué producciones lo generan: " +
        "escriba <code>producciones</code>, que las lista en preorden: el nodo " +
        "y después sus hijos de izquierda a derecha, en el orden en que la " +
        "producción los nombra. Escriba además <code>contiene?</code> sobre " +
        "listas de símbolos y <code>cabe-sin-letrec1?</code>, que dice si la " +
        "gramática sin la producción nueva alcanza para generar el árbol.",
      gramatica: GRAMATICA_UNO,
      esqueleto:
        DATATYPE_EXP + "\n" +
        ";; Dos árboles para las pruebas.\n" +
        "(define suma-local\n" +
        "  (let-exp '(a) (list (lit-exp 3))\n" +
        "           (prim-exp '+ (list (var-exp 'a) (lit-exp 4)))))\n" +
        "(define cuenta-atras\n" +
        "  (letrec1-exp 'bajar '(n)\n" +
        "    (if-exp (prim-exp '== (list (var-exp 'n) (lit-exp 0)))\n" +
        "            (lit-exp 0)\n" +
        "            (app-exp (var-exp 'bajar)\n" +
        "                     (list (prim-exp 'sub1 (list (var-exp 'n))))))\n" +
        "    (app-exp (var-exp 'bajar) (list (lit-exp 4)))))\n" +
        "\n" +
        "(define (producciones e)\n" +
        "  (cases expresion e\n" +
        "    (lit-exp (dato) (list 'lit-exp))\n" +
        "    (var-exp (id) (list 'var-exp))\n" +
        "    (prim-exp (prim args) (cons 'prim-exp (producciones-lista args)))\n" +
        "    (if-exp (prueba entonces sino)\n" +
        "            (cons 'if-exp (append ??? ??? ???)))\n" +
        "    (let-exp (ids rands cuerpo)\n" +
        "             (cons 'let-exp (append ??? ???)))\n" +
        "    (proc-exp (ids cuerpo) (cons 'proc-exp ???))\n" +
        "    (letrec1-exp (nombre params cuerpo-proc cuerpo)\n" +
        "                 (cons 'letrec1-exp (append ??? ???)))\n" +
        "    (app-exp (rator rands)\n" +
        "             (cons 'app-exp (append ??? ???)))))\n" +
        "\n" +
        "(define (producciones-lista es)\n" +
        "  (if (null? es) '() (append ??? ???)))\n" +
        "\n" +
        "(define (contiene? x xs)\n" +
        "  (cond ((null? xs) ???)\n" +
        "        ((eq? x (car xs)) ???)\n" +
        "        (else ???)))\n" +
        "\n" +
        "(define (cabe-sin-letrec1? e)\n" +
        "  ???)\n",
      pruebas: [
        { llamada: "(producciones (var-exp 'z))", esperado: "(var-exp)" },
        { llamada: "(producciones suma-local)", esperado: "(let-exp lit-exp prim-exp var-exp lit-exp)" },
        { llamada: "(producciones (proc-exp '(u v) (prim-exp '* (list (var-exp 'u) (var-exp 'v)))))", esperado: "(proc-exp prim-exp var-exp var-exp)" },
        { llamada: "(length (producciones cuenta-atras))", esperado: "13" },
        { llamada: "(contiene? 'proc-exp (producciones suma-local))", esperado: "#f" },
        { llamada: "(contiene? 'letrec1-exp (producciones cuenta-atras))", esperado: "#t" },
        { llamada: "(cabe-sin-letrec1? suma-local)", esperado: "#t" },
        { llamada: "(cabe-sin-letrec1? cuenta-atras)", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("append esperaba") !== -1) {
          return "append junta listas. producciones ya devuelve una lista por " +
            "cada hijo, y el nombre del nodo entra con cons, no con append.";
        }
        if (llamada === "(producciones suma-local)" && obtenido === "(let-exp prim-exp var-exp lit-exp lit-exp)") {
          return "El orden de la producción del let pone primero las " +
            "expresiones ligadas y después el cuerpo.";
        }
        if (llamada === "(cabe-sin-letrec1? cuenta-atras)" && obtenido === "#t") {
          return "El árbol tiene un nodo letrec1-exp en la raíz, y la " +
            "gramática sin esa producción no lo genera. cabe-sin-letrec1? " +
            "niega lo que encuentra contiene?.";
        }
        if (llamada === "(length (producciones cuenta-atras))" && obtenido === "3") {
          return "Se contaron solo los hijos del nodo raíz. El recorrido baja " +
            "hasta las hojas: el cuerpo del procedimiento también se recorre.";
        }
        return "Cada cláusula pone su nombre con cons al frente y concatena " +
          "con append lo que devuelvan sus hijos. El auxiliar sobre listas " +
          "recorre las subexpresiones una por una.";
      },
      cierre:
        "Trece producciones para un programa de cuatro líneas, y una sola de " +
        "ellas es la nueva. Esa lista es lo que hay que cubrir al extender un " +
        "lenguaje: un nodo que la gramática no genera señala la producción que " +
        "falta, y con ella vienen la variante del datatype y las cláusulas de " +
        "parse, unparse y evaluación."
    },
    {
      id: "cierre-evaluador",
      titulo: "5. Evaluar la producción nueva",
      enunciado:
        "Queda cerrar <code>letrec1</code> del lado del evaluador, con el " +
        "marco recursivo de EOPL §3.4. Tres huecos: la cláusula de " +
        "<code>letrec1-exp</code>, que decide en qué ambiente se evalúa el " +
        "cuerpo; el caso de <code>apply-env</code> sobre el marco recursivo, " +
        "que fabrica la clausura y elige qué ambiente captura; y la extensión " +
        "que arma <code>aplicar-clausura</code> al ligar los argumentos.",
      gramatica: GRAMATICA_UNO,
      esqueleto:
        DATATYPE_EXP + "\n" +
        "(define-datatype ambiente ambiente?\n" +
        "  (ambiente-vacio)\n" +
        "  (ambiente-extendido (ids (list-of symbol?)) (valores list?) (viejo ambiente?))\n" +
        "  (ambiente-recursivo (nombre symbol?) (params (list-of symbol?))\n" +
        "                      (cuerpo expresion?) (viejo ambiente?)))\n" +
        "\n" +
        "(define-datatype clausura clausura?\n" +
        "  (cerradura (ids (list-of symbol?)) (cuerpo expresion?) (amb ambiente?)))\n" +
        "\n" +
        "(define (buscar id ids valores viejo)\n" +
        "  (cond ((null? ids) (apply-env viejo id))\n" +
        "        ((eq? id (car ids)) (car valores))\n" +
        "        (else (buscar id (cdr ids) (cdr valores) viejo))))\n" +
        "\n" +
        "(define (apply-env env id)\n" +
        "  (cases ambiente env\n" +
        "    (ambiente-vacio () (error 'apply-env \"sin ligadura para\" id))\n" +
        "    (ambiente-extendido (ids valores viejo) (buscar id ids valores viejo))\n" +
        "    (ambiente-recursivo (nombre params cuerpo viejo)\n" +
        "                        (if (eq? id nombre)\n" +
        "                            ???\n" +
        "                            (apply-env viejo id)))))\n" +
        "\n" +
        "(define (evaluar-rands rands env)\n" +
        "  (if (null? rands)\n" +
        "      '()\n" +
        "      (cons (evaluar-expresion (car rands) env)\n" +
        "            (evaluar-rands (cdr rands) env))))\n" +
        "\n" +
        "(define (aplicar-clausura proc args)\n" +
        "  (cases clausura proc\n" +
        "    (cerradura (ids cuerpo amb) (evaluar-expresion cuerpo ???))))\n" +
        "\n" +
        "(define (aplicar-primitiva prim args)\n" +
        "  (cond ((eq? prim '+) (+ (car args) (cadr args)))\n" +
        "        ((eq? prim '-) (- (car args) (cadr args)))\n" +
        "        ((eq? prim '*) (* (car args) (cadr args)))\n" +
        "        ((eq? prim 'add1) (add1 (car args)))\n" +
        "        ((eq? prim 'sub1) (sub1 (car args)))\n" +
        "        ((eq? prim '==) (= (car args) (cadr args)))\n" +
        "        (else (error 'aplicar-primitiva \"primitiva desconocida\" prim))))\n" +
        "\n" +
        "(define (evaluar-expresion exp env)\n" +
        "  (cases expresion exp\n" +
        "    (lit-exp (dato) dato)\n" +
        "    (var-exp (id) (apply-env env id))\n" +
        "    (prim-exp (prim args) (aplicar-primitiva prim (evaluar-rands args env)))\n" +
        "    (if-exp (prueba entonces sino)\n" +
        "            (let ((valor-prueba (evaluar-expresion prueba env)))\n" +
        "              (if (boolean? valor-prueba)\n" +
        "                  (if valor-prueba\n" +
        "                      (evaluar-expresion entonces env)\n" +
        "                      (evaluar-expresion sino env))\n" +
        "                  (error 'if-exp \"la prueba no dio un booleano:\" valor-prueba))))\n" +
        "    (let-exp (ids rands cuerpo)\n" +
        "             (evaluar-expresion cuerpo\n" +
        "                                (ambiente-extendido ids (evaluar-rands rands env) env)))\n" +
        "    (proc-exp (ids cuerpo) (cerradura ids cuerpo env))\n" +
        "    (letrec1-exp (nombre params cuerpo-proc cuerpo) ???)\n" +
        "    (app-exp (rator rands)\n" +
        "             (let ((proc (evaluar-expresion rator env))\n" +
        "                   (args (evaluar-rands rands env)))\n" +
        "               (if (clausura? proc)\n" +
        "                   (aplicar-clausura proc args)\n" +
        "                   (error 'app-exp \"el operador no es un procedimiento\"))))))\n" +
        "\n" +
        ";; letrec1 doblar (n) = if ==(n,0) then 1 else *(2, (doblar sub1(n)))\n" +
        ";; in (doblar 6)\n" +
        "(define prog-doblar\n" +
        "  (letrec1-exp 'doblar '(n)\n" +
        "    (if-exp (prim-exp '== (list (var-exp 'n) (lit-exp 0)))\n" +
        "            (lit-exp 1)\n" +
        "            (prim-exp '* (list (lit-exp 2)\n" +
        "                               (app-exp (var-exp 'doblar)\n" +
        "                                        (list (prim-exp 'sub1 (list (var-exp 'n))))))))\n" +
        "    (app-exp (var-exp 'doblar) (list (lit-exp 6)))))\n" +
        "\n" +
        ";; El procedimiento recursivo se liga a otro nombre antes de aplicarlo.\n" +
        "(define prog-presta\n" +
        "  (letrec1-exp 'bajar '(n)\n" +
        "    (if-exp (prim-exp '== (list (var-exp 'n) (lit-exp 0)))\n" +
        "            (lit-exp 100)\n" +
        "            (app-exp (var-exp 'bajar)\n" +
        "                     (list (prim-exp 'sub1 (list (var-exp 'n))))))\n" +
        "    (let-exp '(g) (list (var-exp 'bajar))\n" +
        "             (app-exp (var-exp 'g) (list (lit-exp 3))))))\n" +
        "\n" +
        ";; Un letrec1 dentro del cuerpo de otro: el marco de adentro extiende\n" +
        ";; al de afuera, así que cuenta alcanza a bajar.\n" +
        "(define prog-anidado\n" +
        "  (letrec1-exp 'bajar '(n)\n" +
        "    (if-exp (prim-exp '== (list (var-exp 'n) (lit-exp 0)))\n" +
        "            (lit-exp 0)\n" +
        "            (app-exp (var-exp 'bajar)\n" +
        "                     (list (prim-exp 'sub1 (list (var-exp 'n))))))\n" +
        "    (letrec1-exp 'cuenta '(m)\n" +
        "      (if-exp (prim-exp '== (list (var-exp 'm) (lit-exp 0)))\n" +
        "              (app-exp (var-exp 'bajar) (list (lit-exp 2)))\n" +
        "              (prim-exp 'add1\n" +
        "                        (list (app-exp (var-exp 'cuenta)\n" +
        "                                       (list (prim-exp 'sub1 (list (var-exp 'm))))))))\n" +
        "      (app-exp (var-exp 'cuenta) (list (lit-exp 4))))))\n" +
        "\n" +
        ";; El cuerpo nunca consulta el nombre declarado.\n" +
        "(define prog-sin-uso\n" +
        "  (letrec1-exp 'nunca '(n) (lit-exp 7)\n" +
        "               (prim-exp '+ (list (lit-exp 1) (lit-exp 2)))))\n",
      pruebas: [
        { llamada: "(evaluar-expresion prog-doblar (ambiente-vacio))", esperado: "64" },
        { llamada: "(evaluar-expresion prog-presta (ambiente-vacio))", esperado: "100" },
        { llamada: "(evaluar-expresion prog-anidado (ambiente-vacio))", esperado: "4" },
        { llamada: "(evaluar-expresion prog-sin-uso (ambiente-vacio))", esperado: "3" },
        { llamada: "(clausura? (apply-env (ambiente-recursivo 'f '(x) (lit-exp 1) (ambiente-vacio)) 'f))", esperado: "#t" },
        { llamada: "(evaluar-expresion (app-exp (proc-exp '(u) (prim-exp '+ (list (var-exp 'u) (lit-exp 1)))) (list (lit-exp 9))) (ambiente-vacio))", esperado: "10" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("sin ligadura") !== -1) {
          return "El nombre declarado no se alcanza desde el cuerpo: el " +
            "cuerpo del letrec1 se evalúa en el marco recursivo, no en el " +
            "ambiente que venía.";
        }
        if (obtenido.indexOf("no es un procedimiento") !== -1) {
          return "La consulta del nombre tiene que devolver una clausura " +
            "armada con cerradura, a partir de los parámetros y el cuerpo que " +
            "guarda el marco.";
        }
        if (obtenido.indexOf("La recursión bajó demasiado") !== -1) {
          return "La clausura capturó el ambiente viejo, así que al volver a " +
            "consultar el nombre no está, o se capturó algo que se rearma sin " +
            "avanzar. El ambiente que captura es el marco recursivo mismo.";
        }
        if (llamada === "(evaluar-expresion prog-presta (ambiente-vacio))" &&
            obtenido.indexOf("64") === 0) {
          return "Revise aplicar-clausura: los parámetros se ligan sobre el " +
            "ambiente que la clausura guardó, no sobre el de la llamada.";
        }
        return "El marco se arma con ambiente-recursivo y el cuerpo se evalúa " +
          "ahí; apply-env devuelve (cerradura params cuerpo env) con el marco " +
          "que está consultando; y aplicar-clausura extiende el ambiente " +
          "guardado en la clausura.";
      },
      cierre:
        "La recursión no salió de ninguna asignación: salió de que la clausura " +
        "se fabrica en la consulta y captura el marco donde vive su propio " +
        "nombre, así que la siguiente consulta encuentra otra vez el " +
        "procedimiento. De ahí sale el conteo del primer reto: una consulta, " +
        "una clausura, un nodo del árbol de llamadas."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
