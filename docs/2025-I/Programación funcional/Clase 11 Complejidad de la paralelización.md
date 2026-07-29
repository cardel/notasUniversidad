# Clase 11: Complejidad de la paralelización

# Complejidad

1. La complejidad de los programas secuenciales O(T(n)) donde T(n) es el número de operaciones, supongamos una operación sobre un array O(n)
2. La complejidad de realizar una operación en un arbil binario balanceado O(log(n)) porque la altura es log(n)

¿Porque me hablan de un arbol?

El enfoque de la paralelización va ser dividir a la mitad sucesivamente las colecciones n - n/2 - n/4 ….

```scala
def segmentRec(a: Array[Int], p: Double, s: Int, t: Int): Double = {
  if (t - s < limite)
    sumSegment(a, p, s, t) // Segmento chico, suma secuencial
  else {
    val m = s + (t - s) / 2
    val (sum1, sum2) = (segmentRec(a, p, s, m),
                        segmentRec(a, p, m, t))
    sum1 + sum2
  }
}

```

Cuando trabajamos recursivamente por mitades una operación en un arreglo, secuencialmente nos da O(n)

Asumiendo paralelización infinita

```scala
def segmentRec(a: Array[Int], p: Double, s: Int, t: Int): Double = {
  if (t - s < limite)
    sumSegment(a, p, s, t) // Segmento chico, suma secuencial
  else {
    val m = s + (t - s) / 2
    val (sum1, sum2) = parallel(
      segmentRec(a, p, s, m),
      segmentRec(a, p, m, t)
    )
    sum1 + sum2
  }
}

```

Tomaria O(log(n))

## Notas programas paralelos

1. Hay trabajo que se hace secuencialmente W(e) no se pareliza
2. Hay trabajo D(e) que es el tamaño de las operaciones secuenciales suponiendo paralelismo infinito, tomando el hilo **mas lento**
3. La ejecución en paralelo suponiendo P hilos es

$$
D(e) + \frac{W(e)}{P}
$$

- Si P tiende a infinito, la velocidad seria el tiempo de hilo más lento
- Si P es pequeño y W(e) es grande, tiende a W(e)

## Ley de Amhdal

- Supone que hay una parte f que es secuencial y no se puede paralelizar
- Hay una parte 1-f que se puede paralelizar

$$
\frac{1}{(f+\frac{1-f}{P})}
$$

Ejemplo

Supongamos que secuencial es 40%, y la que puede paralizar es un 60%, si tenemos P infinito tiende a 1/f

## Resumen complejidad programas paralelos

La complejidad de la paralelización se centra en cómo dividir y optimizar tareas para mejorar el rendimiento en sistemas con múltiples hilos o procesadores. En los programas secuenciales, la complejidad está directamente relacionada con el número de operaciones realizadas, como O(n) para recorrer un arreglo o O(log(n)) para operaciones en un árbol binario balanceado. Sin embargo, cuando se utiliza paralelización, la complejidad puede reducirse significativamente, como en el caso de dividir un arreglo en mitades sucesivamente, donde la complejidad puede llegar a O(log(n)) asumiendo paralelización infinita.

Un ejemplo práctico sería calcular la suma de los elementos en un array grande. Sin paralelización, recorrer el array de principio a fin tomaría O(n). En cambio, al dividir el array en mitades y procesar cada mitad en paralelo, el tiempo se reduce a O(log(n)) si se dispone de recursos suficientes.

### Ventajas en un contexto real

Entender la complejidad de la paralelización es clave en aplicaciones como la computación científica, el procesamiento masivo de datos o gráficos y la inteligencia artificial. Por ejemplo, en el entrenamiento de modelos de machine learning, paralelizar operaciones puede reducir tiempos de ejecución desde horas hasta minutos, lo que permite ciclos de experimentación más rápidos. Además, la Ley de Amdahl destaca que identificar y minimizar la parte secuencial de un programa es crucial para maximizar los beneficios de la paralelización, especialmente cuando se trabaja con recursos limitados como un número finito de procesadores.

En resumen, conocer estas técnicas y conceptos permite diseñar sistemas más eficientes, reducir costos y aprovechar al máximo la infraestructura disponible.

# Benchmarking (evaluación comparativa)

- Scalametter es una librería que permite medir los tiempos
- Sin embargo, tenemos un problema, que al medir tenemos ruido: GC, Proceso de planificación de hilos etc para esto nos ofrece el Warmer para asegurarse que se toman las medidas en estado estable (confiables)

```python

import org.scalameter._

object App {
  def main(args: Array[String]): Unit = {
    for (i <- 1 to 10) {
      val res = withWarmer(new Warmer.Default) measure  {
        (1 to 10000000).toArray.map(i => i * 2).filter(i => i % 2 == 0)
      }
      println(res)
    }
  }

```

# Resumen

La complejidad de la paralelización es un tema central en la optimización de programas que buscan aprovechar al máximo los recursos de hardware disponibles, como múltiples hilos o procesadores. En esencia, se trata de dividir tareas grandes en partes más pequeñas que se pueden ejecutar simultáneamente, reduciendo así el tiempo total de ejecución.

## Puntos clave del documento:

1. **Complejidad en programas secuenciales**:
    - Operaciones en un arreglo: O(n).
    - Operaciones en un árbol binario balanceado: O(log(n)).
2. **Paralelización**:
    - Al dividir tareas de manera recursiva y procesarlas en paralelo, la complejidad de ciertas operaciones puede reducirse de O(n) a O(log(n)), suponiendo paralelización infinita.
    - La fórmula para estimar el tiempo de ejecución con paralelización y P hilos es:
    
    $D(e) + \frac{W(e)}{P}$
    
    Donde:
        - \(D(e)\): Trabajo secuencial (no paralelizable).
        - \(W(e)\): Trabajo total (paralelizable y no paralelizable).
        - \(P\): Número de hilos.
3. **Ley de Amdahl**:
    - Muestra la importancia de reducir la parte secuencial de un programa (\(f\)) para maximizar el impacto de la paralelización.
    - Fórmula:
    $\frac{1}{(f+\frac{1-f}{P})}$
    - Ejemplo: Si el 40% de un programa es secuencial, incluso con paralelización infinita, el tiempo nunca será menor a 2.5 veces más rápido.
4. **Benchmarking**:
    - Es crucial medir el rendimiento de los programas para entender los beneficios reales de la paralelización.
    - Herramientas como Scalameter ayudan a medir tiempos de ejecución confiables, eliminando el ruido causado por factores como el recolector de basura o la planificación de hilos.

## Aplicaciones prácticas:

La paralelización tiene un impacto directo en campos como:

- **Computación científica**: Permite realizar simulaciones complejas en menos tiempo.
- **Procesamiento de datos masivo**: Procesar grandes volúmenes de datos en sistemas distribuidos.
- **Inteligencia artificial**: Reducir el tiempo de entrenamiento de modelos de machine learning.
- **Gráficos y videojuegos**: Mejorar el rendimiento para experiencias más fluidas.

## Mensaje de motivación:

¡La paralelización no solo es un tema técnico, es una puerta hacia un futuro más eficiente y emocionante! Aunque puede parecer complejo al principio, dominar estos conceptos te permitirá resolver problemas más rápido, crear sistemas más potentes y ser parte de proyectos innovadores que están transformando el mundo. Desde la creación de videojuegos hasta la exploración espacial, la paralelización está detrás de los grandes avances tecnológicos de nuestra era. Así que no te aburras, ¡aprende a dividir y conquistar! Cada línea de código que escribas optimizando procesos es un paso hacia un mejor programador y hacia un mundo más rápido y eficiente. ¡Tú puedes hacerlo!