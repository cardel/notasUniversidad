/* Bignum en base 10. Los constructores tienen que mantener el dato dentro de
   la representación: succ con acarreo, pred con préstamo, y las conversiones
   en los dos sentidos. El código del estudiante corre sobre mini-scheme.js. */
var DEFINICION =
  "⌈0⌉ = ()\n" +
  "⌈n⌉ = (cons r ⌈q⌉)   con n = q·10 + r, 0 ≤ r < 10\n" +
  "el primer elemento es el dígito menos significativo";

var CABECERA =
  "(define N 10)\n" +
  "(define zero '())\n" +
  "(define (is-zero? n) (null? n))\n";

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "bignum-succ",
      titulo: "1. succ, con acarreo",
      enunciado:
        "Escriba <code>succ</code>. Sumar uno al primer dígito basta mientras " +
        "no llegue a diez; cuando llega, ese dígito vuelve a cero y el uno se " +
        "lleva al resto, que es a su vez un bignum. Sobre la lista vacía, " +
        "sumar uno crea el primer dígito.",
      gramatica: DEFINICION,
      esqueleto:
        CABECERA + "\n" +
        "(define (succ n)\n" +
        "  (cond ((null? n) ???)\n" +
        "        ((= (car n) (- N 1)) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(succ '())", esperado: "(1)" },
        { llamada: "(succ '(3 4))", esperado: "(4 4)" },
        { llamada: "(succ '(9))", esperado: "(0 1)" },
        { llamada: "(succ '(9 9))", esperado: "(0 0 1)" },
        { llamada: "(succ '(9 2))", esperado: "(0 3)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(succ '(9))" && obtenido === "(10)") {
          return "Diez no es un dígito. Cuando el primero está en nueve, " +
            "vuelve a cero y el uno se le suma al resto con succ.";
        }
        if (llamada === "(succ '(9 9))" && obtenido === "(0 10)") {
          return "El acarreo llegó al segundo dígito y ahí se quedó. Sumar " +
            "al resto es llamar a succ sobre el resto, no sumarle uno a su " +
            "car: así el acarreo se propaga solo.";
        }
        return "Tres casos: la lista vacía, el primer dígito en nueve, y " +
          "cualquier otro dígito.";
      },
      cierre:
        "El acarreo es una llamada recursiva: sumarle uno al resto con el " +
        "mismo succ. Con eso 99 + 1 recorre los dos nueves, los vuelve cero " +
        "y abre la posición del 1 al llegar a la lista vacía."
    },
    {
      id: "bignum-pred",
      titulo: "2. pred, con préstamo",
      enunciado:
        "Escriba <code>pred</code>. Restar uno al primer dígito basta mientras " +
        "no sea cero; si es cero, pasa a nueve y el préstamo se le cobra al " +
        "resto. Hay un caso más: cuando el resultado sería un cero al final, " +
        "ese cero no se escribe, porque ⌈0⌉ es la lista vacía y no " +
        "<code>(0)</code>. <code>pred</code> no está definido sobre cero.",
      gramatica: DEFINICION,
      esqueleto:
        CABECERA + "\n" +
        "(define (pred n)\n" +
        "  (cond ((zero? (car n)) (cons ??? ???))\n" +
        "        ((and (= (car n) 1) (null? (cdr n))) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(pred '(1))", esperado: "()" },
        { llamada: "(pred '(5 2))", esperado: "(4 2)" },
        { llamada: "(pred '(0 1))", esperado: "(9)" },
        { llamada: "(pred '(0 0 1))", esperado: "(9 9)" },
        { llamada: "(pred '(1 1))", esperado: "(0 1)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(pred '(1))" && obtenido === "(0)") {
          return "Ese cero sobra: uno menos uno es cero, y cero se escribe " +
            "como la lista vacía. Es el caso que la segunda cláusula atrapa.";
        }
        if (llamada === "(pred '(0 1))" && obtenido === "(9 0)") {
          return "El préstamo dejó un cero al final. Cobrarlo al resto es " +
            "llamar a pred sobre el resto, y pred de (1) ya devuelve la " +
            "lista vacía: el cero desaparece solo.";
        }
        if (llamada === "(pred '(1 1))" && obtenido === "(0)") {
          return "El uno de las unidades pasa a cero, pero el resto no está " +
            "vacío: ese cero sí se escribe, porque hay dígitos detrás.";
        }
        return "Primer dígito en cero: nueve y préstamo al resto. Un uno " +
          "solo: la lista vacía. Otro caso: se le resta uno al primero.";
      },
      cierre:
        "El préstamo es la operación inversa del acarreo y también es una " +
        "llamada recursiva. El caso del cero al final es lo que hace que " +
        "cada número tenga una sola forma, y sin él is-zero? dejaría de " +
        "funcionar."
    },
    {
      id: "bignum-a-numero",
      titulo: "3. Leer el número",
      enunciado:
        "Escriba <code>bignum-&gt;numero</code>, que devuelve el entero de " +
        "Racket que el dato representa. El primer dígito vale por sí mismo " +
        "y el resto vale diez veces lo que diga el resto.",
      gramatica: DEFINICION,
      esqueleto:
        CABECERA + "\n" +
        "(define (bignum->numero n)\n" +
        "  (if (null? n)\n" +
        "      ???\n" +
        "      (+ ??? (* N ???))))\n",
      pruebas: [
        { llamada: "(bignum->numero '())", esperado: "0" },
        { llamada: "(bignum->numero '(7))", esperado: "7" },
        { llamada: "(bignum->numero '(3 2 1))", esperado: "123" },
        { llamada: "(bignum->numero '(0 0 1))", esperado: "100" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(bignum->numero '(3 2 1))" && obtenido === "321") {
          return "Está leyendo la lista de izquierda a derecha como en papel. " +
            "El primer elemento es el de las unidades: 3 + 10·(2 + 10·1).";
        }
        return "El car aporta su valor; el cdr, diez veces el suyo.";
      },
      cierre:
        "La lectura sigue la definición al pie de la letra: n = r + 10·q, " +
        "y q es el resto de la lista, que se lee con la misma regla."
    },
    {
      id: "bignum-de-numero",
      titulo: "4. Escribir el número",
      enunciado:
        "Escriba <code>numero-&gt;bignum</code>, la conversión inversa. El " +
        "primer dígito es el residuo de dividir entre diez, y el resto es la " +
        "conversión del cociente. El cero se convierte en la lista vacía, y " +
        "eso es lo que impide que aparezcan ceros al final.",
      gramatica: DEFINICION,
      esqueleto:
        CABECERA + "\n" +
        "(define (numero->bignum k)\n" +
        "  (if (zero? k)\n" +
        "      ???\n" +
        "      (cons ??? ???)))\n",
      pruebas: [
        { llamada: "(numero->bignum 0)", esperado: "()" },
        { llamada: "(numero->bignum 7)", esperado: "(7)" },
        { llamada: "(numero->bignum 123)", esperado: "(3 2 1)" },
        { llamada: "(numero->bignum 100)", esperado: "(0 0 1)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(numero->bignum 123)" && obtenido === "(1 2 3)") {
          return "Salió al revés. El residuo de 123 entre 10 es 3 y va " +
            "primero; el cociente 12 se convierte después.";
        }
        return "remainder da el dígito de las unidades y quotient lo que " +
          "queda por convertir.";
      },
      cierre:
        "Las dos conversiones son inversas y ambas siguen la misma " +
        "definición, una leyéndola y la otra escribiéndola. Con ellas un " +
        "cliente puede entrar y salir de la representación sin tocarla."
    },
    {
      id: "bignum-multiplica",
      titulo: "5. Multiplicar solo con la interfaz",
      enunciado:
        "Con <code>suma</code> ya escrita sobre la interfaz, escriba " +
        "<code>multiplica</code> sin tocar la representación: <code>a·0</code> " +
        "es cero y <code>a·(b+1)</code> es <code>a·b + a</code>. Aunque el " +
        "código de arriba sepa que son listas, el suyo no debe saberlo.",
      gramatica: DEFINICION,
      esqueleto:
        CABECERA +
        "(define (succ n)\n" +
        "  (cond ((null? n) '(1))\n" +
        "        ((= (car n) (- N 1)) (cons 0 (succ (cdr n))))\n" +
        "        (else (cons (+ 1 (car n)) (cdr n)))))\n" +
        "(define (pred n)\n" +
        "  (cond ((zero? (car n)) (cons (- N 1) (pred (cdr n))))\n" +
        "        ((and (= (car n) 1) (null? (cdr n))) '())\n" +
        "        (else (cons (- (car n) 1) (cdr n)))))\n" +
        "(define (suma a b)\n" +
        "  (if (is-zero? b) a (suma (succ a) (pred b))))\n" +
        "\n" +
        "(define (multiplica a b)\n" +
        "  (if ???\n" +
        "      ???\n" +
        "      (suma ??? ???)))\n",
      pruebas: [
        { llamada: "(multiplica '(3) '())", esperado: "()" },
        { llamada: "(multiplica '(3) '(4))", esperado: "(2 1)" },
        { llamada: "(multiplica '(2 1) '(2 1))", esperado: "(4 4 1)" },
        { llamada: "(multiplica '(9) '(9))", esperado: "(1 8)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(multiplica '(3) '(4))" && obtenido === "(3)") {
          return "Dio a en vez de a·b: el caso base tiene que ser cero, no " +
            "a. Cero por cualquier cosa es cero.";
        }
        return "Si b es cero, zero; si no, a más el producto de a por el " +
          "predecesor de b.";
      },
      cierre:
        "multiplica no tiene un solo car ni cdr y sin embargo produce " +
        "(4 4 1), que es 144 en esta representación. Todo el acarreo lo hizo " +
        "succ, muchas veces, sin que multiplica se enterara."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
