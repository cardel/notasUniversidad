/* ¿Sobrevive el cliente? Fragmentos de código que usan un TAD, y la pregunta
   de si cada uno sigue funcionando cuando la representación cambia. Lo que se
   juzga es si el cliente pasa por la interfaz o mete la mano en el dato. */
var BLOQUES = (function () {
  "use strict";
  return [
    {
      id: "natural",
      titulo: "1. Clientes del TAD número natural",
      opciones: ["Sobrevive", "Se rompe"],
      definicion:
        "zero              = ⌈0⌉\n" +
        "(is-zero? ⌈n⌉)    = #t si n = 0, #f en otro caso\n" +
        "(succ ⌈n⌉)        = ⌈n+1⌉\n" +
        "(pred ⌈n+1⌉)      = ⌈n⌉",
      explicacion:
        "Esta es toda la interfaz. Hay tres implementaciones a la mano: los " +
        "números de Racket, la unaria con listas de <code>#t</code> y la " +
        "bignum en base 16. Para cada cliente, decida si funciona con " +
        "<b>las tres</b> sin cambiarle una letra, o si alguna lo rompe.",
      items: [
        { valor: "(define (doble n)<br>&nbsp;&nbsp;(if (is-zero? n) zero (succ (succ (doble (pred n))))))",
          correcta: 0,
          razon: "Solo aparecen zero, is-zero?, succ y pred. No importa qué sea ⌈n⌉ por dentro: el cliente nunca lo mira." },
        { valor: "(define (doble n) (* 2 n))",
          correcta: 1,
          razon: "Multiplicar supone que ⌈n⌉ es un número de Racket. Con la representación unaria, (* 2 '(#t #t)) revienta." },
        { valor: "(define (es-uno? n) (equal? n '(#t)))",
          correcta: 1,
          razon: "Compara contra la forma unaria. Con los números nativos, (equal? 1 '(#t)) es #f, y el cliente responde mal sin dar error, que es peor." },
        { valor: "(define (es-uno? n)<br>&nbsp;&nbsp;(and (not (is-zero? n)) (is-zero? (pred n))))",
          correcta: 0,
          razon: "Uno es el natural que no es cero y cuyo predecesor sí lo es. Está dicho con la interfaz y nada más." },
        { valor: "(define (mayor? a b) (> (length a) (length b)))",
          correcta: 1,
          razon: "length pide una lista: funciona en la unaria y se cae con los números de Racket. Y en bignum length cuenta dígitos, no el valor: ⌈255⌉ = (15 15) y ⌈17⌉ = (1 1) tienen los mismos, y el cliente diría que ninguno es mayor." },
        { valor: "(define (mayor? a b)<br>&nbsp;&nbsp;(cond [(is-zero? b) (not (is-zero? a))]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(is-zero? a) #f]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[else (mayor? (pred a) (pred b))]))",
          correcta: 0,
          razon: "Baja los dos al tiempo hasta que uno se agota. Cada paso es una operación de la interfaz, así que da igual la representación." },
        { valor: "(define tres (list #t #t #t))",
          correcta: 1,
          razon: "Construye el dato a mano, en la forma unaria. Con cualquier otra representación ese valor no es ⌈3⌉ y todo lo que lo reciba responde mal." },
        { valor: "(define tres (succ (succ (succ zero))))",
          correcta: 0,
          razon: "Tres aplicaciones de succ sobre zero producen ⌈3⌉ en la representación que esté activa. El cliente no decide la forma: la pide." },
        { valor: "(define (igual? a b) (equal? a b))",
          correcta: 1,
          razon: "Funciona con las tres de hoy, y eso es lo engañoso. La especificación no promete que cada número tenga una sola forma: una bignum que admita ceros a la izquierda tiene (3) y (3 0) para el mismo valor, y equal? los ve distintos. Comparar el dato en vez de la interfaz es apostar a una propiedad que nadie garantizó." }
      ],
      cierre:
        "Un cliente sobrevive cuando todo lo que sabe del dato lo sabe por la " +
        "interfaz. Los que se rompen no siempre dan error: los que responden " +
        "mal en silencio son los que más cuestan encontrar."
    },
    {
      id: "ambiente",
      titulo: "2. Clientes del TAD ambiente",
      opciones: ["Sobrevive", "Se rompe"],
      definicion:
        "(empty-env)                    (empty-env? env)\n" +
        "(extend-env id val env)        (extend-env? env)\n" +
        "(extend-env->id env)           (extend-env->val env)\n" +
        "(extend-env->old-env env)      (apply-env env id)",
      explicacion:
        "La representación en uso es la de listas: " +
        "<code>(extend-env id val old)</code> es literalmente esa lista de " +
        "cuatro elementos. Decida si cada cliente sigue funcionando cuando el " +
        "ambiente pase a ser una clausura.",
      items: [
        { valor: "(define (primer-nombre env) (extend-env->id env))",
          correcta: 0,
          razon: "Pide el nombre por el extractor. Cómo lo saque el extractor de adentro es asunto de la representación, no del cliente." },
        { valor: "(define (primer-nombre env) (cadr env))",
          correcta: 1,
          razon: "cadr es la posición del identificador en la lista. Una clausura no tiene cadr: el cliente sabía demasiado." },
        { valor: "(define (vacio? env) (null? (cdr env)))",
          correcta: 1,
          razon: "Confía en que el ambiente vacío sea la lista (empty-env), de un solo elemento. Con procedimientos ni siquiera hay cdr." },
        { valor: "(define (vacio? env) (empty-env? env))",
          correcta: 0,
          razon: "El predicado de la interfaz existe justamente para esta pregunta." },
        { valor: "(define (tiene? env id)<br>&nbsp;&nbsp;(cond [(empty-env? env) #f]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(eq? (extend-env->id env) id) #t]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[else (tiene? (extend-env->old-env env) id)]))",
          correcta: 0,
          razon: "Es apply-env sin el error: recorre la cadena por los extractores y se detiene en el vacío. Todo por la interfaz." },
        { valor: "(define (cuantos env) (if (empty-env? env) 0 (+ 1 (cuantos (cadddr env)))))",
          correcta: 1,
          razon: "Mezcla. Pregunta bien por el vacío, pero baja al ambiente anterior con cadddr en vez de extend-env->old-env. Basta un acceso posicional para que el cliente dependa de la lista." }
      ],
      cierre:
        "Un cliente que pasa por la interfaz en cinco lugares y mete la mano " +
        "en uno depende de la representación igual que si lo hiciera en los " +
        "seis. La independencia no admite grados."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}
