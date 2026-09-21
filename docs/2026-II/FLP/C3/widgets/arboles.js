/* ¿Cuál árbol es? Programas del lenguaje de la sesión y tres árboles
   candidatos para cada uno, dibujados; y al revés, un árbol y tres programas.
   Los árboles se dibujan con dibujar-arbol.js a partir de la construcción
   con los constructores del datatype. */
var BLOQUES = (function () {
  "use strict";

  /* En la página, un árbol dibujado; en node, el texto. */
  function arbol(texto) {
    if (typeof DibujarArbol === "undefined") { return "<code>" + texto + "</code>"; }
    return DibujarArbol.svg(DibujarArbol.desdeTexto(texto));
  }
  function candidatos(a, b, c) {
    return '<div class="candidatos">' +
      '<figure>' + arbol(a) + '<figcaption>A</figcaption></figure>' +
      '<figure>' + arbol(b) + '<figcaption>B</figcaption></figure>' +
      '<figure>' + arbol(c) + '<figcaption>C</figcaption></figure>' +
      '</div>';
  }
  function programa(texto) { return '<code class="programa">' + texto + '</code>'; }

  var GRAMATICA =
    "&lt;expresion&gt; ::= &lt;number&gt;                                   const-exp (num)\n" +
    "            ::= &lt;identifier&gt;                               var-exp (id)\n" +
    "            ::= (- &lt;expresion&gt; &lt;expresion&gt;)                 diff-exp (exp1 exp2)\n" +
    "            ::= (zero? &lt;expresion&gt;)                         zero?-exp (exp1)\n" +
    "            ::= (if &lt;expresion&gt; then &lt;expresion&gt; else &lt;expresion&gt;)   if-exp (exp1 exp2 exp3)\n" +
    "            ::= (let &lt;identifier&gt; = &lt;expresion&gt; in &lt;expresion&gt;)     let-exp (id exp1 body)";

  return [
    {
      id: "del-programa-al-arbol",
      titulo: "1. Del programa al árbol",
      definicion: GRAMATICA,
      explicacion:
        "Cada programa está escrito en sintaxis concreta. De los tres " +
        "árboles, uno es el que construye <code>parse</code>; los otros dos " +
        "tienen un error que se repite en cada semestre. Escoja el correcto.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: programa("(- x 1)") + candidatos(
            "(diff-exp (const-exp 1) (var-exp x))",
            "(diff-exp (var-exp x) (const-exp 1))",
            "(diff-exp x 1)"),
          correcta: 1,
          razon: "Es B. En A los operandos están al revés: la resta no es conmutativa y el árbol guarda el orden. En C las hojas están sin envolver: x y 1 tienen que ser var-exp y const-exp, porque un campo de diff-exp es una expresion, no un símbolo ni un número." },
        { valor: programa("(zero? (- y 2))") + candidatos(
            "(zero?-exp (diff-exp (var-exp y) (const-exp 2)))",
            "(zero?-exp (var-exp y) (const-exp 2))",
            "(diff-exp (zero?-exp (var-exp y)) (const-exp 2))"),
          correcta: 0,
          razon: "Es A. En B el zero? quedó con dos campos, como si la resta se hubiera disuelto: zero?-exp tiene un solo campo, y ese campo es la resta completa. En C la raíz está invertida: el programa empieza por zero?, así que la raíz es zero?-exp." },
        { valor: programa("(if (zero? n) then 0 else n)") + candidatos(
            "(if-exp (zero?-exp (var-exp n)) then (const-exp 0) else (var-exp n))",
            "(if-exp (zero?-exp (var-exp n)) (var-exp n) (const-exp 0))",
            "(if-exp (zero?-exp (var-exp n)) (const-exp 0) (var-exp n))"),
          correcta: 2,
          razon: "Es C. En A sobrevivieron then y else como hojas: son andamiaje de la sintaxis concreta y no llevan información, así que no tienen campo. En B las ramas están cambiadas, y el orden de los campos de if-exp es prueba, consecuente, alternativa." },
        { valor: programa("(let y = 5 in (- y x))") + candidatos(
            "(let-exp (var-exp y) (const-exp 5) (diff-exp (var-exp y) (var-exp x)))",
            "(let-exp y (const-exp 5) (diff-exp (var-exp y) (var-exp x)))",
            "(let-exp y (diff-exp (var-exp y) (var-exp x)) (const-exp 5))"),
          correcta: 1,
          razon: "Es B. En A el identificador ligado está envuelto en var-exp, y no va: el primer campo de let-exp es un símbolo, porque ahí se declara la variable, no se usa. En C están intercambiados la expresión ligada y el cuerpo." },
        { valor: programa("(- (- a 1) (- b 1))") + candidatos(
            "(diff-exp (diff-exp (var-exp a) (const-exp 1)) (diff-exp (var-exp b) (const-exp 1)))",
            "(diff-exp (var-exp a) (const-exp 1) (var-exp b) (const-exp 1))",
            "(diff-exp (diff-exp (var-exp a) (var-exp b)) (diff-exp (const-exp 1) (const-exp 1)))"),
          correcta: 0,
          razon: "Es A. B aplanó las dos restas interiores en una sola con cuatro campos, y diff-exp tiene dos. C emparejó mal: cada resta interior tiene su propia variable y su propio 1." }
      ],
      cierre:
        "Los tres errores tienen nombre: hojas sin envolver, palabras clave " +
        "que sobreviven, y campos en otro orden. Los tres los detecta el " +
        "constructor o los detecta parse, y por eso el árbol correcto es el " +
        "único que los dos aceptan."
    },
    {
      id: "del-arbol-al-programa",
      titulo: "2. Del árbol al programa",
      definicion: GRAMATICA,
      explicacion:
        "Ahora al revés: el árbol está dibujado y hay que escoger el programa " +
        "que <code>unparse</code> produce. Los tres programas usan los mismos " +
        "símbolos; lo que cambia es dónde quedó cada cosa.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: arbol("(let-exp a (const-exp 2) (zero?-exp (var-exp a)))") +
            '<ol class="programas" type="A"><li><code>(let a = 2 in (zero? a))</code></li><li><code>(let a = (zero? a) in 2)</code></li><li><code>(zero? (let a = 2 in a))</code></li></ol>',
          correcta: 0,
          razon: "Es A. La raíz es let-exp, así que el programa empieza por let; su segundo campo, la expresión ligada, es el 2, y el cuerpo es el zero?. B intercambia los dos y C pone el zero? por fuera, donde tendría que ser la raíz." },
        { valor: arbol("(diff-exp (diff-exp (var-exp x) (const-exp 1)) (var-exp y))") +
            '<ol class="programas" type="A"><li><code>(- x (- 1 y))</code></li><li><code>(- (- x 1) y)</code></li><li><code>(- (- 1 x) y)</code></li></ol>',
          correcta: 1,
          razon: "Es B. El diff-exp interior es el primer campo, así que la resta anidada va a la izquierda; y sus campos son x y 1 en ese orden. A la anida a la derecha y C invierte x y 1." },
        { valor: arbol("(if-exp (zero?-exp (var-exp k)) (var-exp k) (diff-exp (var-exp k) (const-exp 1)))") +
            '<ol class="programas" type="A"><li><code>(if (zero? k) then (- k 1) else k)</code></li><li><code>(if k then (zero? k) else (- k 1))</code></li><li><code>(if (zero? k) then k else (- k 1))</code></li></ol>',
          correcta: 2,
          razon: "Es C. Los tres campos, en orden: la prueba es el zero?, el consecuente es k y la alternativa es la resta. A cambia las dos ramas y B corrió todo un lugar, poniendo la prueba donde iba el consecuente." },
        { valor: arbol("(let-exp x (diff-exp (var-exp y) (const-exp 1)) (let-exp y (var-exp x) (var-exp y)))") +
            '<ol class="programas" type="A"><li><code>(let x = (- y 1) in (let y = x in y))</code></li><li><code>(let x = (let y = x in y) in (- y 1))</code></li><li><code>(let y = (- y 1) in (let x = x in y))</code></li></ol>',
          correcta: 0,
          razon: "Es A. Dos let anidados: el de afuera liga x a la resta y su cuerpo es el let de adentro, que liga y a x. B intercambió expresión ligada y cuerpo del let de afuera; C cambió los identificadores de lugar." }
      ],
      cierre:
        "unparse recorre el árbol y vuelve a poner el andamiaje: los " +
        "paréntesis, then, else, el signo igual. Lo que no puede inventar es " +
        "el orden, porque el orden está en los campos. Por eso de un árbol " +
        "sale un solo programa, y de ese programa, con parse, el mismo árbol."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
