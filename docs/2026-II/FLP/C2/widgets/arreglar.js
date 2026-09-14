/* Arreglar el cliente. Cuatro clientes que metían la mano en la
   representación, para reescribirlos con la interfaz. La representación del
   esqueleto no es ninguna de las que esos clientes suponían, así que la
   versión vieja no pasa y la nueva sí. El código del estudiante corre sobre
   mini-scheme.js. */
var INTERFAZ =
  "zero              = ⌈0⌉\n" +
  "(is-zero? ⌈n⌉)    = #t si n = 0, #f en otro caso\n" +
  "(succ ⌈n⌉)        = ⌈n+1⌉\n" +
  "(pred ⌈n+1⌉)      = ⌈n⌉";

var REP =
  ";; Representación anidada: ⌈0⌉ = () y ⌈n+1⌉ = (list ⌈n⌉).\n" +
  "(define zero '())\n" +
  "(define (is-zero? n) (null? n))\n" +
  "(define (succ n) (list n))\n" +
  "(define (pred n) (car n))\n";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "arreglar-uno",
      titulo: "1. es-uno?, que comparaba contra la lista",
      enunciado:
        "El cliente original era <code>(define (es-uno? n) (equal? n '(#t)))</code>, " +
        "escrito para la representación unaria. Con la representación de " +
        "abajo responde <code>#f</code> a todo. Reescríbalo con la interfaz: " +
        "uno es el natural que no es cero y cuyo predecesor sí lo es.",
      gramatica: INTERFAZ,
      esqueleto:
        REP + "\n" +
        "(define (es-uno? n)\n" +
        "  (and ??? ???))\n",
      pruebas: [
        { llamada: "(es-uno? (succ zero))", esperado: "#t" },
        { llamada: "(es-uno? zero)", esperado: "#f" },
        { llamada: "(es-uno? (succ (succ zero)))", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(es-uno? zero)" && obtenido !== "#f") {
          return "El cero no es uno, y preguntar por su predecesor revienta. " +
            "La primera condición tiene que descartar el cero antes de que " +
            "la segunda toque pred.";
        }
        return "Dos condiciones: que no sea cero, y que al quitarle uno sí " +
          "lo sea. El and evalúa en orden, y ese orden protege a pred.";
      },
      cierre:
        "El cliente arreglado no sabe si ⌈1⌉ es (#t), 1 o (()). Pregunta lo " +
        "único que la interfaz garantiza, y por eso pasa en esta " +
        "representación y en cualquier otra."
    },
    {
      id: "arreglar-numero",
      titulo: "2. Pasar a un número de Racket",
      enunciado:
        "Escriba <code>natural-&gt;numero</code>, que convierte un ⌈n⌉ en el " +
        "entero <code>n</code> de Racket usando solo la interfaz. Es el " +
        "puente que hace falta cuando un cliente necesita imprimir o " +
        "comparar con aritmética: en lugar de mirar el dato, lo cuenta.",
      gramatica: INTERFAZ,
      esqueleto:
        REP + "\n" +
        "(define (natural->numero n)\n" +
        "  (if ???\n" +
        "      ???\n" +
        "      (+ 1 ???)))\n",
      pruebas: [
        { llamada: "(natural->numero zero)", esperado: "0" },
        { llamada: "(natural->numero (succ zero))", esperado: "1" },
        { llamada: "(natural->numero (succ (succ (succ zero))))", esperado: "3" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("length") !== -1 || obtenido === "1" && esperado === "3") {
          return "length cuenta la lista de afuera, que siempre tiene un " +
            "elemento en esta representación. Hay que bajar con pred hasta " +
            "el cero.";
        }
        return "Cero vale cero; en otro caso, uno más lo que valga el " +
          "predecesor.";
      },
      cierre:
        "Contar con pred hasta llegar a cero es la única forma de saber " +
        "cuánto vale un natural sin conocer su forma. Cuesta n pasos, y ese " +
        "costo es el precio de la independencia."
    },
    {
      id: "arreglar-doble",
      titulo: "3. doble, que multiplicaba por dos",
      enunciado:
        "El original era <code>(define (doble n) (* 2 n))</code>, para los " +
        "números de Racket. Aquí <code>*</code> recibe una lista y revienta. " +
        "Reescríbalo con la interfaz: el doble de cero es cero, y el doble de " +
        "<code>n+1</code> es el doble de <code>n</code> más dos.",
      gramatica: INTERFAZ,
      esqueleto:
        REP + "\n" +
        "(define (doble n)\n" +
        "  (if ???\n" +
        "      ???\n" +
        "      (succ (succ ???))))\n",
      pruebas: [
        { llamada: "(doble zero)", esperado: "()" },
        { llamada: "(doble (succ zero))", esperado: "((()))" },
        { llamada: "(doble (succ (succ zero)))", esperado: "((((()))))" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(doble (succ zero))" && obtenido === "(())") {
          return "Dio uno, no dos: falta un succ. El doble de n+1 agrega dos " +
            "al doble de n.";
        }
        return "Caso base zero; en el otro, dos succ sobre el doble del " +
          "predecesor.";
      },
      cierre:
        "El resultado se ve raro, ((((())))) para ⌈4⌉, y eso es lo de " +
        "menos: el cliente no lo escribió ni lo leyó. Lo construyó con succ y " +
        "salió en la forma que la representación usa."
    },
    {
      id: "arreglar-mayor",
      titulo: "4. mayor?, que comparaba longitudes",
      enunciado:
        "El original era <code>(define (mayor? a b) (&gt; (length a) (length b)))</code>. " +
        "Con esta representación todo natural es una lista de un elemento, " +
        "así que responde <code>#f</code> siempre. Reescríbalo bajando los dos " +
        "al tiempo con <code>pred</code> hasta que uno se agote.",
      gramatica: INTERFAZ,
      esqueleto:
        REP + "\n" +
        "(define (mayor? a b)\n" +
        "  (cond ((is-zero? b) ???)\n" +
        "        ((is-zero? a) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(mayor? (succ (succ zero)) (succ zero))", esperado: "#t" },
        { llamada: "(mayor? (succ zero) (succ (succ zero)))", esperado: "#f" },
        { llamada: "(mayor? (succ zero) (succ zero))", esperado: "#f" },
        { llamada: "(mayor? zero zero)", esperado: "#f" },
        { llamada: "(mayor? (succ zero) zero)", esperado: "#t" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(mayor? zero zero)" && obtenido === "#t") {
          return "Cuando b se agota, a es mayor solo si a no se agotó " +
            "también. La primera cláusula tiene que preguntar por a.";
        }
        if (llamada === "(mayor? (succ zero) (succ zero))" && obtenido === "#t") {
          return "Iguales no es mayor. Al bajar los dos llegan a cero al " +
            "tiempo, y ahí la respuesta es #f.";
        }
        return "Si b llegó a cero, a es mayor cuando todavía no es cero; si " +
          "a llegó primero, no; si ninguno, se les quita uno a ambos.";
      },
      cierre:
        "Cuatro clientes que dependían de la forma del dato, reescritos " +
        "para depender solo de la interfaz. Ninguno de los originales pasa " +
        "estas pruebas, y ninguno de los nuevos dejaría de pasarlas si la " +
        "representación vuelve a cambiar."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
