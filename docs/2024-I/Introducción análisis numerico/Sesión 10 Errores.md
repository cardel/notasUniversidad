# Sesión 10: Errores

¿Porque tenemos errores en el computador?

1. Porque no podemos representar todos los datos de la recta numérica (Error de redondeo)
2. Porque no podemos calcular sistemas que tengan un número infinito de términos, serie infinita, nos toca parar en algún modelo (Error de truncamiento)
- Error de redondeo: Por ejemplo, cuando tratamos de representar el número π en el computador, esto resulta en un error de redondeo ya que π es un número irracional que tiene una secuencia infinita de dígitos después del punto decimal y no puede ser representado exactamente en la mayoría de los sistemas de computadoras.
- Error de truncamiento: Un ejemplo común de error de truncamiento es cuando utilizamos una serie de Taylor para aproximar una función. La serie de Taylor es una serie infinita, pero en la práctica, solo podemos sumar un número finito de términos. Esto puede llevar a un error de truncamiento.

---

Exactitud y precisión

La exactitud tiene que ver que el PROMEDIO de los datos es CERCANO al correcto

La presición es que los datos cuando los tomamos nos dan muy PARECIDOS o CERCANOS

Por ejemplo, si lanzamos dardos a un tablero, la exactitud se refiere a cuán cerca están nuestros lanzamientos del centro del tablero (el objetivo). Si todos nuestros lanzamientos aterrizan cerca del centro, somos exactos. La precisión, por otro lado, se refiere a cuán cerca están nuestros lanzamientos uno del otro. Si todos nuestros lanzamientos aterrizan muy cerca uno del otro, independientemente de si están cerca o lejos del centro del tablero, somos precisos.

---

¿Que tipos de errores tenemos?

- Error absoluto: Diferencia entre el valor aproximado y el real (es independiente de la escala)
- Error relativo: Es una relación entre la diferencia de los valores aproximado y real y el valor real
- Error aproximado: Es comparar la diferencia (relativa) entre el valor actual que tengo de aproximación y el anterior, es un criterio de parada para los algoritmos iterativos
- Error absoluto: Si medimos la longitud de un objeto y obtenemos 10 cm, pero en realidad mide 10.5 cm, el error absoluto es de 0.5 cm.
- Error relativo: Siguiendo con el ejemplo anterior, el error relativo sería 0.5 cm dividido por 10.5 cm, que es aproximadamente 0.048 o 4.8%.
- Error aproximado: Si estamos calculando la raíz cuadrada de un número mediante un algoritmo iterativo y en la primera iteración obtenemos 3.1, pero en la segunda iteración obtenemos 3.14, el error aproximado sería la diferencia entre estos dos valores, que es 0.04.

---

Valor teorico para el error aproximado

---

Serie de Taylor punto a cualquiera conocido

Serie de Maclaurin es cuando a = 0

Tomando n cifras significativas

$$
e_s = (0.5*10^{2-n})
$$

Es una herramienta para calcular funciones en un punto x a partir de un conocido a

$$
f(x) = \sum \limits_{n=0}^{\infty} \frac{f^n(a)}{n!}(x-a)^n
$$

Un ejemplo de la Serie de Taylor es la expansión de la función exponencial alrededor del punto a = 0. En este caso, x es el valor en el que queremos calcular la función exponencial usando la Serie de Taylor. La serie se ve de la siguiente manera:

$$

e^x = \sum \limits_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \frac{x^4}{4!} + \ldots

$$

Por ejemplo, si queremos calcular e^2 usando la Serie de Taylor, x sería igual a 2. Entonces, sustituimos x por 2 en la Serie de Taylor para obtener una aproximación de e^2.

---

¿Como se representan los números en el computador?

Caso de los enteros: usamos signo magnitud, tomamos una cantidad de n bits y asumimos el primero como el signo: int, long, short, byte, rango de trabajo

$$
[-2^{n-1},2^{n-1}-1]
$$

Si quisiéramos representar el número -25 en signo magnitud de 32 bits, cambiaríamos el primer bit a 1 para indicar que el número es negativo. Por lo tanto, -25 se representaría como:

10000000000000000000000000011001

Caso de los flotantes: HAY INFINITOS DE ELLOS, tenemos un problema y eso nos introduce un ERROR DE REDONDEO, el sistema es:

1 bit para signo

e bits para exponente

m bits para mantisa

En el caso del float tenemos 32 bits en total, para ello usamos 1 bit para signo, 8 para el exponente y 23 para la mantiza

En el caso del double tenemos 64 bits en total, para ello usamos 1 para signo, 11 para el exponente, 53 para la mantisa

Consideremos el número decimal 0.1.

La representación en binario de este número es una secuencia infinita: 0.0001100110011001100110011001100110011001100110011...

Para convertir este número en la representación IEEE 754 para float (32 bits) y double (64 bits), debemos redondearlo, lo que introduce un error de redondeo.

**Para float:**

La representación IEEE 754 de 32 bits para 0.1 es 00111101110011001100110011001101, donde el primer bit es para el signo (0 para positivo), los siguientes 8 bits para el exponente (01111011 en binario que es 123 en decimal), y los últimos 23 bits para la mantisa (10011001100110011001101).

**Para double:**

La representación IEEE 754 de 64 bits para 0.1 es 0011111111110011001100110011001100110011001100110011001100110011, donde el primer bit es para el signo (0 para positivo), los siguientes 11 bits para el exponente (01111111111 en binario que es 1023 en decimal), y los últimos 52 bits para la mantisa.

Podemos ver que la representación en double es más precisa que la representación en float debido a más bits asignados para la mantisa. Sin embargo, incluso con la precisión adicional, todavía hay un error de redondeo debido a la naturaleza infinita de la representación binaria de 0.1.

00

1.11101110011001100110011   ~~001101~~

---

# Resumen

Los errores de redondeo y truncamiento son dos tipos de errores que pueden surgir cuando realizamos cálculos numéricos.

Un error de redondeo ocurre cuando un número no puede ser representado exactamente debido a las limitaciones en la precisión de nuestro sistema de representación numérica. Por ejemplo, si intentamos representar el número π en un sistema de computadora, nos encontramos con un error de redondeo porque π es un número irracional con una secuencia infinita de dígitos después del punto decimal.

Por otro lado, un error de truncamiento ocurre cuando interrumpimos una serie infinita después de un número finito de términos. Por ejemplo, si usamos una serie de Taylor para aproximar una función, la serie de Taylor es una serie infinita, pero en la práctica, solo podemos sumar un número finito de términos.

Un ejemplo salvaje podría ser intentar calcular la órbita de un planeta en un sistema solar simulado en una computadora. La verdadera órbita es una elipse perfecta, pero debido a los errores de redondeo en los cálculos de la posición del planeta en cada paso de tiempo, la órbita calculada puede desviarse de la elipse perfecta. Además, porque estamos simulando el sistema solar con un número finito de pasos de tiempo, estamos introduciendo un error de truncamiento porque en realidad, el movimiento del planeta es un proceso continuo.

En Java, las clases BigInteger y BigDecimal nos permiten realizar operaciones matemáticas con una precisión mucho mayor que la que ofrecen los tipos de datos primitivos como int, long, float y double. BigInteger se utiliza para operaciones con números enteros de precisión arbitraria y BigDecimal se utiliza para operaciones con números decimales de precisión arbitraria.

Por ejemplo, supongamos que necesitamos calcular el factorial de 100. Este número es extremadamente grande y no puede ser representado por un int o un long. Aquí es donde BigInteger resulta útil:

```java
import java.math.BigInteger;

public class Main {
    public static void main(String[] args) {
        BigInteger factorial = BigInteger.ONE;
        for (int i = 2; i <= 100; i++) {
            factorial = factorial.multiply(BigInteger.valueOf(i));
        }
        System.out.println("100! = " + factorial);
    }
}

```

Por otro lado, si queremos realizar cálculos con decimales con una precisión muy alta, podemos usar BigDecimal. Por ejemplo, si queremos calcular el valor de π con 50 dígitos decimales, podríamos hacer algo como esto:

```java
import java.math.BigDecimal;
import java.math.MathContext;

public class Main {
    public static void main(String[] args) {
        BigDecimal pi = new BigDecimal(Math.PI, MathContext.DECIMAL128);
        System.out.println("π = " + pi);
    }
}

```

Estas clases son muy útiles cuando necesitamos una precisión extremadamente alta en nuestros cálculos. Sin embargo, también es importante tener en cuenta que estas operaciones son más lentas que las operaciones con tipos de datos primitivos, por lo que solo deben usarse cuando la alta precisión es realmente necesaria.

```java
public class Main {
    public static void main(String[] args) {
        double piDouble = Math.PI;
        System.out.println("π (double) = " + piDouble);

        BigDecimal piBigDecimal = new BigDecimal(Math.PI, MathContext.DECIMAL128);
        System.out.println("π (BigDecimal) = " + piBigDecimal);
    }
}

```

Resultado de ejecución:

```
π (double) = 3.141592653589793
π (BigDecimal) = 3.1415926535897932384626433832795028841971693993751

```

Podemos observar que con `double` obtenemos 16 dígitos decimales de π, mientras que con `BigDecimal` obtenemos 51 dígitos decimales.

```java
public class Main {
    public static void main(String[] args) {
        double piDouble = Math.PI;
        System.out.println("π (double) = " + piDouble);

        BigDecimal piBigDecimal = new BigDecimal(Math.PI, MathContext.DECIMAL128);
        System.out.println("π (BigDecimal) = " + piBigDecimal);
    }
}

```

Resultado de ejecución:

```
π (double) = 3.141592653589793
π (BigDecimal) = 3.1415926535897932384626433832795028841971693993751

```

Podemos observar que con `double` obtenemos 16 dígitos decimales de π, mientras que con `BigDecimal` obtenemos 51 dígitos decimales.

## Error relativo vs error absoluto vs error aproximado

Error absoluto no considera la escala, no es lo mismo 1cm en 10cm que en 10000cm

Error relativo si considera la escala y porcentual (mas confiable)

Error de aproximación cuando estamos aproximando algun valor y no sabemos el valor real, este se calcula de acuerdo al número de cifras significativas

## Error de redondeo

Ocurre por la representación numerica de los reales, como sin infinitos, no es posible representarlos todos, esto nos introduce un error inevitablemente