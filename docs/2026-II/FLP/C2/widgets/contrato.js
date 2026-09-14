/* ¿Cumple el contrato? Un TAD conjunto especificado con ecuaciones, y
   varias implementaciones candidatas de cada operación. Se juzga cada una
   contra las ecuaciones, no contra lo que parece razonable. */
var BLOQUES = (function () {
  "use strict";
  var ECUACIONES =
    "(member? v (empty-set))        = #f\n" +
    "(member? v (insert v s))       = #t\n" +
    "(member? w (insert v s))       = (member? w s)     si w ≠ v\n" +
    "(member? v (remove v s))       = #f\n" +
    "(member? w (remove v s))       = (member? w s)     si w ≠ v";
  return [
    {
      id: "listas",
      titulo: "1. El conjunto como lista de símbolos",
      definicion: ECUACIONES,
      explicacion:
        "La representación es una lista, <code>(empty-set)</code> es " +
        "<code>'()</code> y <code>member?</code> recorre la lista buscando con " +
        "<code>eq?</code>. Para cada candidata de <code>insert</code> o " +
        "<code>remove</code>, decida si cumple las ecuaciones en que aparece.",
      opciones: ["Cumple", "No cumple"],
      items: [
        { valor: "<code>(define (insert v s) (cons v s))</code>", correcta: 0,
          razon: "v queda adelante y member? lo encuentra; lo demás sigue ahí. Que pueda haber repetidos no viola ninguna ecuación: el contrato habla de pertenencia, no de cuántas veces." },
        { valor: "<code>(define (insert v s) (if (member? v s) s (cons v s)))</code>", correcta: 0,
          razon: "Igual que la anterior, sin repetidos. Las ecuaciones no distinguen entre las dos: son dos representaciones válidas del mismo conjunto." },
        { valor: "<code>(define (insert v s) (append s (list v)))</code>", correcta: 0,
          razon: "Poner v al final en vez de adelante no cambia qué está y qué no. member? recorre toda la lista, así que el orden es indiferente." },
        { valor: "<code>(define (insert v s) (list v))</code>", correcta: 1,
          razon: "Descarta s. Falla la tercera ecuación: (member? w (insert v s)) tiene que dar lo mismo que (member? w s), y aquí da #f siempre." },
        { valor: "<code>(define (remove v s) (cdr s))</code>", correcta: 1,
          razon: "Quita el primero, sea quien sea. (member? v (remove v s)) sigue dando #t cuando v no estaba al frente, y (member? w (remove v s)) pierde a w si w estaba adelante." },
        { valor: "<code>(define (remove v s) (filtra (lambda (x) (not (eq? x v))) s))</code>", correcta: 0,
          razon: "Quita todas las apariciones de v y deja lo demás. Las dos ecuaciones de remove se cumplen sin importar cuántas veces estuviera v." },
        { valor: "<code>(define (remove v s) (quita-primera v s))</code>, que quita solo la primera aparición",
          opciones: ["Cumple", "Cumple solo si insert no repite", "No cumple"], correcta: 1,
          razon: "Con el insert que evita repetidos, la única aparición se va y todo cumple. Con el insert de cons a secas, (remove v (insert v (insert v s))) deja un v adentro y (member? v …) da #t. La corrección de remove depende de qué haga insert: las operaciones se prueban juntas, no por separado." },
        { valor: "<code>(define (member? v s) (eq? (car s) v))</code>", correcta: 1,
          razon: "Solo mira el primero, y sobre la lista vacía car revienta: la primera ecuación ni siquiera llega a responder. Aunque insert y remove estén bien, un observador malo invalida todo el TAD." }
      ],
      cierre:
        "Las ecuaciones no dicen cómo se guarda el conjunto ni si hay " +
        "repetidos ni en qué orden. Tres insert distintos las cumplen y son " +
        "tres representaciones legítimas. Lo que sí dicen es cómo se " +
        "comportan las operaciones entre sí, y por eso una candidata puede " +
        "ser correcta o no según con cuál otra se combine."
    },
    {
      id: "clausuras",
      titulo: "2. El mismo contrato, con procedimientos",
      definicion: ECUACIONES,
      explicacion:
        "Ahora el conjunto es un predicado: <code>(member? v s)</code> es " +
        "simplemente <code>(s v)</code>, y <code>(empty-set)</code> es " +
        "<code>(lambda (x) #f)</code>. No hay lista que recorrer ni que " +
        "imprimir. Las mismas ecuaciones juzgan estas candidatas.",
      opciones: ["Cumple", "No cumple"],
      items: [
        { valor: "<code>(define (insert v s) (lambda (x) (or (eq? x v) (s x))))</code>", correcta: 0,
          razon: "El conjunto nuevo responde #t si x es v, y si no, lo que respondía el anterior. Es exactamente la segunda y la tercera ecuación escritas como procedimiento." },
        { valor: "<code>(define (insert v s) (lambda (x) (eq? x v)))</code>", correcta: 1,
          razon: "Olvida preguntarle a s: el conjunto nuevo solo contiene a v. Falla la tercera ecuación, igual que (list v) en la representación con listas." },
        { valor: "<code>(define (remove v s) (lambda (x) (and (not (eq? x v)) (s x))))</code>", correcta: 0,
          razon: "Responde #f para v y, para cualquier otro, lo que decía s. Las dos ecuaciones de remove, en una línea." },
        { valor: "<code>(define (remove v s) (lambda (x) (s x)))</code>", correcta: 1,
          razon: "No quita nada: es el mismo conjunto envuelto en otra lambda. (member? v (remove v s)) da lo mismo que (member? v s), y la ecuación exige #f." },
        { valor: "<code>(define (remove v s) (lambda (x) (not (s x))))</code>", correcta: 1,
          razon: "Es el complemento del conjunto, no el conjunto sin v. Para un w que no estaba, (member? w (remove v s)) da #t cuando debía dar #f." }
      ],
      cierre:
        "El contrato es el mismo y las candidatas correctas de esta " +
        "representación no se parecen en nada a las de la otra. Es lo que " +
        "las ecuaciones consiguen: juzgar cualquier representación sin " +
        "saber cuál es."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
