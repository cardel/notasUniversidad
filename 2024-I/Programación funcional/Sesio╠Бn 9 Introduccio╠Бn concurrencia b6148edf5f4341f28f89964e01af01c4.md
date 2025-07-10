# Sesión 9: Introducción concurrencia

Complejidad computacional

Es el número de operaciones que se requiere para resolver un problema usando un algoritmo, esta la denotamos con las cotas, usualmente

$$
O(f(n))
$$

Donde f(n) es una función en términos del tamaño de la entrada 

---

Complejidad de los programas secuenciales

La complejidad computacional no se puede reducir en términos de las operaciones que tiene que hacer, ejemplo sumar un arreglo

- Solución sumando los elementos: O(n)
- Solución utilizando divide y vencerás, partiendo a la mitad el arreglo y sumando los segmentos que tengan un tamaño establecido O(n) ←- Igual que tiene que sumar TODOS los elementos

Cuando tienen recursión de árbol, se va a resolver de izquierda a derecha, una por una.

Complejidad considerando paralelismo

Dependemos del número de procesadores disponibles (recursos paralelos)

La complejidad va a depender de:

$$
T(n) = D(ln(n)) + f(n)/P

$$

Esto nos dice dos cosas

1. Si el número de recursos paralelos es limitado y la entrada crece, a la larga la complejidad es f(n)
2. Si el número de recursos paralelos es ilimitado tendemos D(ln(n))
3. En todo caso NUESTRO OBJETIVO es acercarnos al segundo caso

---

Ley ahmdal

Si un proceso se puede hacer así f secuencial y 1-f paralelo.

Entonces el proceso se puede hacer considerando P recursos paralelos

$$
T(n) = \frac{1}{f+\frac{1-f}{P}}
$$

Esta ecuación nos dice, si P es limitado va tener a 1 si la entrada crece, si P es ilimitado tiene a $\frac{1}{f}$

---

Ejemplo ley de Ahmdal

Suponiendo que el porcentaje de la tarea que puede ser paralelizado (1-f) es el 60% del total y la parte que no puede ser paralelizada (f) es el 40%. Si tenemos P recursos paralelos, la Ley de Amdahl nos dice que el tiempo total para completar la tarea (T(n)) se calculará así:

$$
T(n) = \frac{1}{0.4 + \frac{0.6}{P}}
$$

Por lo tanto, si tuviéramos 4 procesadores en paralelo, por ejemplo, el tiempo total sería:

$$
T(n) = \frac{1}{0.4 + \frac{0.6}{4}} = 1.42857
$$

Esto significa que, con 4 procesadores, el tiempo para completar la tarea sería aproximadamente 1.43 veces más rápido que si se hiciera de manera secuencial. Sin embargo, incluso si tuviéramos un número ilimitado de procesadores, el tiempo más rápido que podríamos lograr debido a la parte secuencial sería:

$$
T(n) = \frac{1}{0.4} = 2.5
$$

Por lo tanto, incluso con un número ilimitado de procesadores, sólo podríamos hacer la tarea 2.5 veces más rápida debido al 40% de la tarea que no puede ser paralelizada.

---

Medición de rendimiento de la paralelización

- Pruebas de regresión: ejecutar varias veces el programar y analizar los datos
- Pruebas de rendimiento (benchmarking) es una sola ejecución probar diferentes casos

---

Medir del rendimiento

- Utilizamos una librería especializada scalaMetter (compatible con Scala 2)
- Tenemos el problema del calentamiento (el Java carga cosas y toma tiempo estabilizarse)
- Este nos permite tomar las medidas en estado estable

---

Ejemplo de scalametter

Ejemplo 1: Medición sin Warmer

```scala
import org.scalameter._
val time = measure {
  val lista = List.range(1, 1000000)
  lista.map(_ * 2)
}
println(s"Tiempo de ejecución: $time ms")

```

En este código, estamos midiendo el tiempo que tarda en duplicar todos los elementos de una lista de 1 a 1,000,000. Sin embargo, no estamos utilizando `Warmer`, por lo que no estamos considerando el tiempo que la JVM tarda en "calentarse" y estabilizarse.

Ejemplo 2: Medición con Warmer

```scala
import org.scalameter._
val time = withWarmer(new Warmer.Default) measure {
  val lista = List.range(1, 1000000)
  lista.map(_ * 2)
}
println(s"Tiempo de ejecución: $time ms")

```

Este código es similar al anterior, pero antes de medir el tiempo de ejecución, la JVM se "calentará" gracias a `withWarmer(new Warmer.Default)`. Esto permite que la medición del tiempo de ejecución sea más precisa.

---

## Resumen

La complejidad en el caso secuencial se refiere al número de operaciones que se requiere para resolver un problema usando un algoritmo, denotado generalmente con O(n). Este se basa en la idea de que cada operación se realiza una tras otra de forma secuencial.

¿Cual es la diferencia entre complejidad secuencial y paralela?Por otro lado, la complejidad en el caso paralelo depende del número de procesadores disponibles. En un entorno paralelo, la computación puede ser dividida entre varios procesadores, lo que puede llevar a una reducción significativa en el tiempo de ejecución. Sin embargo, la complejidad final dependerá de la ecuación T(n) = D(ln(n)) + f(n)/P, donde D(ln(n)) es el tiempo de la tarea secuencial (despues de dividir) y f(n)/P es el tiempo de ejecución dividido entre el número de procesadores. Si el número de recursos paralelos es limitado y la entrada crece, a la larga la complejidad es f(n). Pero si el número de recursos paralelos es ilimitado, tendemos a D(ln(n)).

¿Como afecta el calentamiento a los tiempos de ejecución?

El "calentamiento" se refiere al tiempo que necesita la Máquina Virtual de Java (JVM) para optimizar ciertos aspectos del programa durante su ejecución. Este proceso puede afectar el tiempo de ejecución inicial de un programa, ya que la JVM está aún optimizando el código. Al usar un "Warmer", permitimos que la JVM se "caliente" y llegue a un estado estable antes de comenzar a medir el tiempo de ejecución. Esto proporciona una medición más precisa del rendimiento del programa, ya que no se ve afectada por las optimizaciones iniciales de la JVM.

¿Que se busca con la paralelización?

Con la paralelización, se busca optimizar y acelerar la ejecución de tareas complejas dividiéndolas en subprocesos más pequeños que pueden ejecutarse simultáneamente en diferentes procesadores. Esto puede resultar en una reducción significativa del tiempo total de ejecución.

¿Cuales son las limitaciones de la paralelización en la práctica?

Las limitaciones de la paralelización en la práctica incluyen la ley de Amdahl, que establece que el rendimiento mejorado que se puede obtener mediante la paralelización es limitado por la porción del programa que no se puede paralelizar. Además, la paralelización puede introducir complejidad adicional en el diseño y la implementación del programa. También puede haber limitaciones en el número de procesadores disponibles y en la capacidad de la infraestructura para soportar la ejecución paralela.