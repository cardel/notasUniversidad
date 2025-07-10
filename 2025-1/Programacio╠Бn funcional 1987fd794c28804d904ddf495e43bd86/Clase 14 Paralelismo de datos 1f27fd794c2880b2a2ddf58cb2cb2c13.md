# Clase 14: Paralelismo de datos

# Paralelización sobre datos

La paralelización de datos distribuye la ejecución de las tareas a través de diferentes hilos

La idea es:

- Divida un conjunto en subconjuntos
- Haga la misma tarea para los subconjuntos (map)
- Luego una los resultados (reduce)
- Para el caso de Scala usaremos las colecciones paralelas, que es: use .par cuando las trabaje

```scala
// Ejemplo 1: Suma de elementos en una colección paralela
val numeros = (1 to 1000000).par
val suma = numeros.sum
println(s"La suma es: $suma")

// Ejemplo 2: Conversión de una colección a mayúsculas usando map
val palabras = List("hola", "mundo", "scala", "paralelismo").par
val palabrasMayusculas = palabras.map(_.toUpperCase)
println(s"Palabras en mayúsculas: $palabrasMayusculas")

// Ejemplo 3: Filtrar números pares en una colección paralela
val numerosGrandes = (1 to 100000).par
val pares = numerosGrandes.filter(_ % 2 == 0)
println(s"Cantidad de números pares: ${pares.size}")

// Ejemplo 4: Cálculo de factoriales en paralelo
val numerosFactorial = (1 to 10).par
val factoriales = numerosFactorial.map(n => (n, (1 to n).product))
println("Factoriales calculados en paralelo:")
factoriales.foreach { case (n, factorial) => println(s"$n! = $factorial") }

// Ejemplo 5: Combinación de reduce con paralelismo
val lista = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).par
val producto = lista.reduce(_ * _)
println(s"El producto de los números es: $producto")

```

## Limitaciones

- Operaciones paralelizables: No hay dependencia de otros resultados
- Operaciones no paralelizables. Hay dependencia con otros resultados v(i) = v(i-1) + 1 para esto existen los syncronized

Se pueden combinar paralelización con tareas con datos.

Tamaño   Secuencial (ms)   Paralelo (ms)
1,000        0.211         2.806
10,000       0.925         2.802
100,000     10.623         8.667
1,000,000   36.994        10.830

Hay una conclusión importante: Paralelice desde un cierto tamaño de la entrada (benchmarking) y para tamaños inferiores es mejor secuencial.

En Scala, las colecciones paralelas son versiones de las colecciones estándar que permiten realizar operaciones en paralelo de manera eficiente. Algunas de las colecciones paralelas disponibles incluyen:

- `ParArray`: Versión paralela de un `Array`.
- `ParVector`: Versión paralela de un `Vector`.
- `ParSeq`: Versión paralela de una secuencia.
- `ParMap`: Versión paralela de un `Map`.
- `ParSet`: Versión paralela de un `Set`.

Estas colecciones se obtienen a través del método `.par` aplicado a las colecciones estándar, lo que permite aprovechar múltiples núcleos del procesador para realizar operaciones como `map`, `reduce`, `filter`, entre otras, de manera concurrente.

## Operaciones paralelizables

La paralelización de datos permite ejecutar tareas simultáneamente dividiendo un conjunto de datos en subconjuntos, realizando operaciones independientes en esos subconjuntos (como `map`) y luego combinando los resultados (como `reduce`). Esto es especialmente útil para aprovechar múltiples núcleos de un procesador y mejorar el rendimiento en tareas que involucren grandes volúmenes de datos. Sin embargo, no todas las operaciones son paralelizables debido a dependencias secuenciales entre los datos.

### Ejemplo práctico

Supongamos que queremos calcular el factorial de los números del 1 al 10 en paralelo. Esto se puede hacer con el siguiente código en Scala:

```scala
val numerosFactorial = (1 to 10).par
val factoriales = numerosFactorial.map(n => (n, (1 to n).product))
println("Factoriales calculados en paralelo:")
factoriales.foreach { case (n, factorial) => println(s"$n! = $factorial") }

```

En este caso, cada número es independiente de los demás, por lo que se pueden calcular los factoriales de forma concurrente sin problemas. La paralelización distribuye las operaciones entre varios hilos, lo que mejora el tiempo de ejecución en conjuntos de datos grandes.

### ¿Por qué `foldLeft` no es paralelizable?

La operación `foldLeft` no es paralelizable porque introduce una dependencia secuencial entre sus cálculos. Revisemos su tipo y semántica:

Tipo:

```scala
foldLeft : B → ((B, A) → B) → (Seq[A] → B)

```

Semántica:

```scala
foldLeft(b)(f)(List(a1, a2, ..., an)) = (((b f a1) f a2) ... f an)

```

La operación `foldLeft` comienza con un valor inicial `b` y aplica una función `f` de manera secuencial desde el primer elemento `a1` hasta el último `an` de la lista. Esto significa que el cálculo de `b2` depende de `b1`, el de `b3` depende de `b2`, y así sucesivamente, lo que obliga a realizar las operaciones de manera estrictamente secuencial. No es posible dividir el cálculo en partes independientes que puedan ejecutarse en paralelo.

Por ejemplo, si quisiéramos sumar una lista de números con `foldLeft`:

```scala
val suma = List(1, 2, 3, 4).foldLeft(0)(_ + _)

```

El cálculo sería:

```
((0 + 1) + 2) + 3 + 4

```

Cada suma depende del resultado anterior, lo que impide realizar el cálculo en paralelo.

Lo mismo sucede con operaciones como `foldRight`, `reduceLeft`, `reduceRight`, `scanLeft` y `scanRight`. Todas estas operaciones tienen dependencias secuenciales que las hacen no adecuadas para paralelización.

### Solución: Variar las operaciones

Para realizar cálculos en paralelo, se deben usar operaciones diseñadas para dividir el trabajo en subtareas independientes, como `reduce` o `aggregate`. Estas operaciones permiten combinar resultados parciales sin depender de cálculos previos. Por ejemplo, `reduce` aplica una función asociativa que no requiere un orden específico, lo que permite dividir el trabajo y combinar los resultados de manera eficiente:

```scala
val numeros = List(1, 2, 3, 4).par
val suma = numeros.reduce(_ + _)
println(s"La suma es: $suma")

```

En este caso, `reduce` puede dividir los números en subgrupos, sumar cada subgrupo en paralelo y luego combinar los resultados parciales. Esto elimina la dependencia secuencial y permite aprovechar la paralelización de manera efectiva.

### Explicación del contenido

El contenido describe cómo paralelizar operaciones sobre datos utilizando colecciones paralelas en Scala. La paralelización permite dividir un conjunto de datos en subconjuntos, realizar operaciones independientes en esos subconjuntos, y luego combinar los resultados. Esto es útil para mejorar el rendimiento en tareas que involucran grandes volúmenes de datos. Sin embargo, no todas las operaciones son paralelizables, especialmente aquellas que dependen de cálculos secuenciales, como `foldLeft`.

Por otro lado, se menciona que ciertas operaciones, como `reduce`, son paralelizables porque no dependen del orden de los cálculos y pueden ejecutarse en paralelo eficientemente. Además, se introduce el concepto de un monoide, que establece ciertas propiedades necesarias para que las operaciones como `fold` sean correctas.

### Precondiciones para la corrección de `fold`

Para que un `fold` funcione correctamente, deben cumplirse las siguientes condiciones:

1. **Asociatividad**: La operación debe ser asociativa. Esto significa que el orden en el que se agrupan los operandos no afecta el resultado:
    
    ```
    f(a, f(b, c)) = f(f(a, b), c)
    
    ```
    
2. **Elemento neutro**: Debe existir un elemento neutro `z`, tal que:
    
    ```
    f(a, z) == f(z, a) == a
    
    ```
    
    Esto asegura que el elemento neutro no altere el resultado de la operación.
    

Formalmente, estas propiedades garantizan que el neutro y la operación binaria forman un monoide. La conmutatividad, sin embargo, no es una propiedad necesaria para la corrección del `fold`. Es decir, no se requiere que:

```
f(a, b) == f(b, a)

```

### Ejemplo práctico

Supongamos que queremos sumar una lista de números en paralelo usando `reduce`. La operación de suma cumple con las propiedades necesarias para ser paralelizable:

1. Es asociativa: `(a + (b + c)) == ((a + b) + c)`
2. Tiene un elemento neutro: `0`

Código en Scala:

```scala
val numeros = List(1, 2, 3, 4, 5, 6).par
val suma = numeros.reduce(_ + _)
println(s"La suma de los números es: $suma")

```

En este caso, la lista se divide en subconjuntos y se realizan sumas parciales en paralelo. Los resultados parciales se combinan para obtener el resultado final. Esto mejora el rendimiento en listas grandes, siempre que la operación utilizada sea asociativa y tenga un elemento neutro.

Por ejemplo, la suma puede calcularse así:

```
(1 + 2) + (3 + 4) + (5 + 6)

```

Cada par se suma en paralelo, y luego los resultados parciales se combinan, respetando las propiedades del monoide.

Sin embargo el Fold tiene limitaciones con los tipos, para resolverlo se utilizan funciones de agregación para separarlos de la operación

```scala
/*
 * This Scala source file was generated by the Gradle 'init' task.
 */
package taller
import org.scalameter._
//importa paralel collections
import scala.collection.parallel.CollectionConverters._

object App {
  def main(args: Array[String]): Unit = {
    println((1 to 100).toList.par.foldLeft(0)(_ + _))
    println((1 to 100).par.fold(0)(_ + _))

    //Contar vocales de una lista
    //
    //println((List("a", "b", "c", "d", "e", "f", "g", "h", "i", "j").par.fold(0)((acc:Any, x:Any) => acc + (if (x == "a" || x == "e" || x == "i" || x == "o" || x == "u") 1 else 0))))
    // Este falla porque requiere que acc y x sea del mismo tipo de la lista
    println((List("a", "b", "c", "d", "e", "f", "g", "h", "i", "j").par.aggregate(0)((acc, x) => if (x == "a" || x == "e" || x == "i" || x == "o" || x == "u") 1 else 0, _ + _)))

    println(List("a", "b", "c", "d", "e", "f", "g", "h", "i", "j").par.foldLeft(0)((acc, x) => acc + (if (x == "a" || x == "e" || x == "i" || x == "o" || x == "u") 1 else 0)))
    
 }

  def greeting(): String = "Hello, world!"
}
```

## Abstracciones de paralelismo de datos

- Iteradores (iterators)
- Constructores (builders)
- divisores (splitters)
- combinadores (combiners)

En el contexto del paralelismo de datos, un **iterador** es una abstracción que permite recorrer una colección de elementos de manera secuencial. En Scala, el `trait Iterator[A]` representa un iterador que puede devolver elementos de tipo `A`. Este iterador tiene dos métodos principales:

1. **`next`:** Devuelve el siguiente elemento de la colección.
2. **`hasNext`:** Indica si hay más elementos en la colección que se puedan recorrer.

El iterador tiene las siguientes propiedades y especificaciones importantes:

- El método `next` solo puede ser invocado si `hasNext` devuelve `true`.
- Una vez que `hasNext` devuelve `false`, significa que todos los elementos han sido recorridos, y cualquier invocación posterior de `hasNext` seguirá devolviendo `false`.

Un iterador simplificado en Scala puede representarse como:

```scala
trait Iterator[A] {
  def next(): A
  def hasNext: Boolean
}

```

Todas las colecciones en Scala implementan este `trait` y pueden devolver un iterador a través del método `iterator`.

### Implementación de `foldLeft` sobre un iterador

El método `foldLeft` se utiliza para aplicar una función acumulativa sobre los elementos de una colección de forma secuencial, comenzando con un valor inicial `z`. En el caso de un iterador, la implementación de `foldLeft` puede realizarse de la siguiente manera:

```scala
def foldLeft[B](z: B)(f: (B, A) => B): B = {
  var s = z
  while (hasNext) s = f(s, next())
  s
}

```

### Explicación del código:

1. **Valor inicial (`z`):** Se define una variable `s` que almacena el valor acumulado. Inicialmente, `s` toma el valor de `z`.
2. **Ciclo `while`:** Mientras haya elementos disponibles (`hasNext` devuelve `true`), se aplica la función `f` acumulativa sobre el valor actual de `s` y el siguiente elemento (`next()`).
3. **Resultado final:** Una vez que todos los elementos han sido procesados, el valor acumulado `s` se devuelve como resultado.

### Ejemplo práctico:

Supongamos que queremos calcular la suma de los números de una colección utilizando `foldLeft` sobre un iterador. El código sería:

```scala
val numeros = List(1, 2, 3, 4).iterator
val suma = numeros.foldLeft(0)(_ + _)
println(s"La suma de los números es: $suma")

```

**Proceso:**

1. Inicializamos `s` con `0`.
2. Recorremos la lista con el iterador:
    - En el primer paso: `s = 0 + 1 = 1`.
    - En el segundo paso: `s = 1 + 2 = 3`.
    - En el tercer paso: `s = 3 + 3 = 6`.
    - En el cuarto paso: `s = 6 + 4 = 10`.
3. Al final, `hasNext` devuelve `false` y el resultado `10` se retorna.

### Paralelismo y uso de iteradores

En el caso del paralelismo, los iteradores juegan un papel clave en la división de datos. Los iteradores son utilizados para recorrer subconjuntos de datos que pueden procesarse de manera independiente en diferentes hilos. Sin embargo, como los iteradores procesan elementos de forma secuencial, no son directamente paralelizables. En lugar de eso, se utilizan estructuras como divisores (`splitters`) o combinadores (`combiners`) para dividir y combinar los datos en paralelo.

Por ejemplo, en Scala, al convertir una colección en una colección paralela (usando `.par`), se crean divisores sobre los datos, los cuales actúan como iteradores especializados que dividen la colección en partes independientes para su procesamiento concurrente.

### Conclusión

El iterador es una abstracción fundamental para recorrer elementos secuencialmente en Scala. Aunque no es directamente paralelizable, su uso es esencial para implementar operaciones como `foldLeft`, que acumulan resultados sobre una colección. En el contexto del paralelismo, los iteradores se complementan con otras abstracciones como divisores y combinadores, que permiten dividir y procesar subconjuntos de datos en paralelo de manera eficiente.

En el contexto del paralelismo, un iterador es una abstracción que permite recorrer elementos de una colección de manera secuencial, uno a la vez, a través de los métodos `next` (para obtener el siguiente elemento) y `hasNext` (para verificar si hay más elementos disponibles). Aunque los iteradores son útiles para procesar datos de forma secuencial, no son directamente paralelizables debido a su naturaleza dependiente del orden.

Para resolver esto, en el paralelismo se emplean constructores (`Builders`) y divisores (`Splitters`) que permiten trabajar con subconjuntos de datos de manera independiente. Los constructores (implementados mediante el `trait Builder`) son herramientas clave que ayudan a construir nuevas colecciones a partir de elementos procesados. Su especificación básica es la siguiente:

```scala
trait Builder[A, Repr] {
  def +=(elem: A): Builder[A, Repr]
  def result: Repr
}
def newBuilder: Builder[A, Repr] // sobre cada colección

```

### Concepto de Builder y su uso en paralelismo

El objetivo del `Builder` es construir una nueva colección (`Repr`) agregando elementos mediante el método `+=`. Una vez que se invoca el método `result`, se devuelve la colección resultante y el estado del `Builder` queda indefinido, por lo que no puede reutilizarse.

En el contexto del paralelismo, los constructores permiten separar datos en subconjuntos, aplicar operaciones de manera independiente en múltiples hilos y luego combinar los resultados en una colección final. Este enfoque es especialmente útil en operaciones como `filter`, `map`, o `reduce`, donde los datos se dividen, procesan en paralelo y, finalmente, se reconstruyen en una colección consolidada.

### Ejemplo de implementación de `filter` con un Builder

La operación `filter` selecciona elementos de una colección que cumplen con un predicado (`p`). Aquí se muestra cómo se puede implementar `filter` utilizando un `Builder`:

```scala
def filter(p: T => Boolean): Repr = {
  val b = newBuilder
  for (x <- this) if (p(x)) b += x
  b.result
}

```

### Explicación del código:

1. **Inicialización del Builder:** Se crea un nuevo `Builder` (`newBuilder`) para construir la colección filtrada.
2. **Iteración sobre la colección:** Se recorre la colección original (`this`) y, para cada elemento `x`, se verifica si cumple con el predicado `p`.
3. **Adición de elementos:** Si el elemento `x` cumple el predicado, se agrega al `Builder` mediante el método `+=`.
4. **Resultado final:** Una vez procesados todos los elementos, se invoca `result` sobre el `Builder` para obtener la colección resultante que contiene solo los elementos que cumplen el predicado.

### Relación con el paralelismo

En el caso del paralelismo, el uso de `Builders` es crítico para dividir y procesar los datos en paralelo. Por ejemplo:

1. **División de datos:** Los datos originales se dividen en subconjuntos mediante divisores (`Splitters`), que actúan como iteradores especializados.
2. **Procesamiento en paralelo:** Cada subconjunto se procesa de manera independiente en diferentes hilos. Los elementos que cumplen con el predicado se agregan a un `Builder` correspondiente.
3. **Combinación de resultados:** Los resultados parciales de cada hilo se combinan para formar una colección final, utilizando el método `result` de los `Builders`.

Este enfoque permite aprovechar múltiples núcleos del procesador para realizar operaciones como `filter` de manera más eficiente sobre grandes volúmenes de datos.

### Ejemplo práctico con paralelismo

Supongamos que queremos filtrar números pares de una lista en paralelo:

```scala
val numeros = (1 to 100).par
val pares = numeros.filter(_ % 2 == 0)
println(s"Números pares: $pares")

```

En este caso:

1. Los datos se dividen automáticamente en subconjuntos mediante el método `.par`.
2. Cada subconjunto es procesado en un hilo independiente, utilizando un `Builder` para almacenar los números pares.
3. Los resultados parciales se combinan para producir la colección final de números pares.

Este enfoque demuestra cómo los iteradores, combinados con constructores (`Builders`), permiten implementar operaciones eficientes y paralelizables sobre datos.

El **`Splitter`** es un `trait` en Scala que extiende la funcionalidad de un `Iterator` para permitir la división eficiente de una colección en subconjuntos disjuntos. Esto es crucial en el contexto del paralelismo de datos, ya que habilita el procesamiento concurrente de los datos en diferentes hilos. La definición simplificada del `Splitter` es la siguiente:

```scala
trait Splitter[A] extends Iterator[A] {
  def split: Seq[Splitter[A]]
  def remaining: Int
}

```

### Especificaciones de un `Splitter`

1. **Estado indefinido tras `split`:** Una vez que se invoca el método `split`, el divisor original queda en un estado indefinido y no debe ser utilizado para recorrer datos.
2. **Subconjuntos disjuntos:** Los divisores resultantes (`Splitter[A]`) permiten recorrer subconjuntos disjuntos de la colección original. Esto asegura que no haya solapamiento de datos entre los subconjuntos.
3. **Cantidad de elementos restantes:** El método `remaining` devuelve el número de elementos que aún quedan por procesar en la colección original.
4. **Eficiencia:** El método `split` debe ser eficiente, idealmente con una complejidad de tiempo de O(log n) o mejor, para garantizar un buen rendimiento en la división de datos.

Además, cada colección paralela en Scala implementa un método `splitter` que genera el `Splitter` correspondiente para dividir los datos.

### Implementación de `fold` sobre un `Splitter`

El método `fold` permite aplicar una operación acumulativa sobre los elementos de una colección paralela utilizando un `Splitter`. Su implementación es la siguiente:

```scala
def fold(z: A)(f: (A, A) => A): A = {
  if (remaining < umbral)
    foldLeft(z)(f)
  else {
    val divisiones = for (division <- split) yield task { division.fold(z)(f) }
    divisiones.map(_.join()).foldLeft(z)(f)
  }
}

```

### Explicación del código:

1. **Caso base:** Si el número de elementos restantes (`remaining`) es menor que un umbral predefinido (`umbral`), se utiliza un algoritmo secuencial (`foldLeft`) para procesar los datos.
2. **División de datos:** Si el número de elementos excede el umbral, el método `split` divide la colección en subconjuntos disjuntos. Cada subconjunto es procesado de manera independiente en un hilo mediante la creación de una tarea (`task`).
3. **Procesamiento en paralelo:** Cada subconjunto utiliza recursivamente el método `fold` para aplicar la operación acumulativa sobre sus elementos.
4. **Combinación de resultados:** Los resultados parciales de las tareas se combinan utilizando `foldLeft` para obtener el resultado final.

### Beneficios de esta implementación:

- **Escalabilidad:** Divide y procesa los datos en paralelo, aprovechando múltiples núcleos de un procesador.
- **Eficiencia:** El uso de `split` asegura que la división de los datos sea rápida y balanceada entre los hilos.
- **Flexibilidad:** Puede manejar grandes volúmenes de datos, procesándolos secuencialmente o en paralelo según el tamaño de la colección.

### Ejemplo práctico:

Supongamos que queremos sumar los números de 1 a 10,000 utilizando `fold` sobre un `Splitter`. Para esto, el código podría verse así:

```scala
val numeros = (1 to 10000).par
val suma = numeros.fold(0)(_ + _)
println(s"La suma es: $suma")

```

En este ejemplo:

1. La colección de números se convierte en paralela mediante `.par`.
2. El método `fold` divide los datos en subconjuntos utilizando el `Splitter`.
3. Cada subconjunto se procesa en paralelo para calcular sumas parciales.
4. Los resultados parciales se combinan para obtener la suma total.

Este enfoque muestra cómo el `Splitter` permite la paralelización eficiente de operaciones acumulativas, maximizando el rendimiento en colecciones grandes.

### Combinadores (Combiners)

Un **Combiner** es una abstracción que extiende el concepto de un Builder (constructor) y que es utilizada en el contexto del paralelismo de datos para combinar eficientemente resultados parciales obtenidos de diferentes hilos. Es especialmente útil cuando los datos han sido divididos en subconjuntos y procesados en paralelo, ya que permite unir los resultados de manera eficiente y consistente.

El `trait` simplificado de un Combiner es el siguiente:

```scala
trait Combiner[A, Repr] extends Builder[A, Repr] {
  def combine(that: Combiner[A, Repr]): Combiner[A, Repr]
}
def newCombiner: Combiner[T, Repr] // sobre cada colección

```

### Especificación del Combiner

1. **Creación de un nuevo combinador:**
    - Al invocar el método `combine`, se crea un nuevo `Combiner` que contiene los elementos de los dos combinadores originales.
2. **Estado indefinido:**
    - Una vez que se invoca el método `combine`, los combinadores originales quedan en un estado indefinido y no deben ser utilizados nuevamente.
3. **Eficiencia:**
    - El método `combine` debe ser eficiente, idealmente con una complejidad de O(log n) o mejor, para asegurar un buen rendimiento al combinar resultados parciales.

### Implementación de `filter` en paralelo usando Splitter y newCombiner

El método `filter` en paralelo utiliza un Splitter para dividir la colección en subconjuntos, procesa cada subconjunto de manera independiente en diferentes hilos y luego combina los resultados parciales utilizando un Combiner. La implementación de `filter` podría lucir así:

```scala
def filter(p: T => Boolean): Repr = {
  val splitter = this.splitter
  val combiners = for (part <- splitter.split) yield task {
    val combiner = newCombiner
    for (x <- part if p(x)) combiner += x
    combiner
  }
  combiners.map(_.join()).reduce(_.combine(_)).result
}

```

### Explicación del código

1. **División de la colección:**
    - Se utiliza el `splitter` para dividir la colección original en subconjuntos disjuntos. Cada subconjunto es procesado de manera independiente.
2. **Procesamiento de cada subconjunto:**
    - Para cada subconjunto (obtenido a través de `split`), se crea una tarea (`task`) que utiliza un `Combiner` para almacenar los elementos que cumplen con el predicado `p`.
    - Dentro de cada tarea, los elementos del subconjunto se recorren y, si cumplen con el predicado, se añaden al `Combiner` mediante el método `+=`.
3. **Unión de resultados parciales:**
    - Una vez que se completan todas las tareas, se combinan los `Combiners` de cada subconjunto utilizando el método `combine`.
    - Esto crea un nuevo `Combiner` que contiene los elementos filtrados de todos los subconjuntos.
4. **Construcción del resultado final:**
    - El método `result` se invoca sobre el `Combiner` final para obtener la colección resultante que contiene los elementos que cumplen con el predicado.

### Ejemplo práctico

Supongamos que queremos filtrar números pares de una colección en paralelo:

```scala
val numeros = (1 to 100).par
val pares = numeros.filter(_ % 2 == 0)
println(s"Números pares: $pares")

```

1. La colección `numeros` se convierte en paralela mediante `.par`.
2. El `filter` divide la colección en subconjuntos mediante un `Splitter`.
3. Cada subconjunto se procesa en paralelo utilizando un `Combiner` para almacenar los números pares.
4. Los resultados parciales se combinan eficientemente con `combine`, y el resultado final contiene todos los números pares.

### Ventajas del uso de Combinadores

- **Eficiencia:** Permiten combinar resultados parciales de manera eficiente, reduciendo el tiempo necesario para unir grandes volúmenes de datos.
- **Escalabilidad:** Facilitan el procesamiento de grandes conjuntos de datos en sistemas con múltiples núcleos de procesador.
- **Flexibilidad:** Pueden ser utilizados con diferentes tipos de colecciones y operaciones.

### Conclusión

El uso de combinadores en paralelo, junto con divisores (splitters), es una técnica poderosa para implementar operaciones como `filter`. Permiten dividir, procesar y combinar datos de manera eficiente, maximizando el rendimiento en colecciones grandes y paralelizando tareas de manera efectiva.

## Resumen: Paralelismo de Datos (Clase 14)

Este documento describe los conceptos, características y ejemplos relacionados con el paralelismo de datos en Scala, centrándose en cómo dividir, procesar y combinar datos de manera eficiente utilizando colecciones paralelas. A continuación, se resumen los aspectos más relevantes:

### Puntos Clave

1. **Concepto de Paralelismo de Datos:**
    - Divide un conjunto grande de datos en subconjuntos.
    - Realiza operaciones independientes en los subconjuntos (usando `map`).
    - Combina los resultados parciales (`reduce`).
    - Usa colecciones paralelas en Scala empleando `.par`.
2. **Ejemplos Prácticos:**
    - Suma de elementos en una colección paralela.
    - Filtrado de números pares.
    - Cálculo de factoriales en paralelo.
    - Uso de `reduce` para combinar resultados.
3. **Limitaciones:**
    - No todas las operaciones son paralelizables, como `foldLeft`, debido a dependencias secuenciales.
    - Las operaciones paralelizables deben ser independientes y asociativas.
4. **Abstracciones Clave:**
    - **Iteradores (`Iterators`):** Recorridos secuenciales básicos.
    - **Constructores (`Builders`):** Construcción de colecciones a partir de elementos procesados.
    - **Divisores (`Splitters`):** División eficiente de datos en subconjuntos para su procesamiento paralelo.
    - **Combinadores (`Combiners`):** Unión eficiente de resultados parciales procesados en paralelo.
5. **Precondiciones para Operaciones Paralelizables:**
    - **Asociatividad:** La operación debe cumplir con la propiedad asociativa.
    - **Elemento Neutro:** Debe existir un valor neutral para la operación.
6. **Ejemplo de Operaciones Paralelizables:**
    - Uso de `reduce` para sumar o combinar resultados parciales en paralelo.
    - Alternativas como `aggregate` para manejar tipos de datos complejos en paralelismo.
7. **Rendimiento:**
    - Comparación de tiempos de ejecución (secuencial vs paralelo) según el tamaño de los datos:
        
        
        | Tamaño | Secuencial (ms) | Paralelo (ms) |
        | --- | --- | --- |
        | 1,000 | 0.211 | 2.806 |
        | 10,000 | 0.925 | 2.802 |
        | 100,000 | 10.623 | 8.667 |
        | 1,000,000 | 36.994 | 10.830 |
    - Paralelizar solo con entradas grandes para evitar sobrecarga innecesaria.
8. **Diferencia entre `fold` y `reduce`:**
    - `fold` introduce dependencias secuenciales, mientras que `reduce` es paralelizable al ser asociativo y no depender del orden.

### Tabla de Operaciones Paralelizables y No Paralelizables

| Operación | Paralelizable | Razón |
| --- | --- | --- |
| `map` | Sí | Opera sobre elementos independientes. |
| `reduce` | Sí | Requiere operaciones asociativas. |
| `foldLeft` | No | Depende de cálculos secuenciales. |
| `aggregate` | Sí | Divide y combina resultados parciales. |
| `filter` | Sí | Procesa subconjuntos independientes. |

### Conclusión

El paralelismo de datos en Scala permite aprovechar múltiples núcleos de procesadores para mejorar el rendimiento en tareas con grandes volúmenes de datos. Para implementar paralelismo de manera eficiente:

- Utilizar colecciones paralelas (`.par`) junto con operaciones paralelizables (`map`, `reduce`, `filter`).
- Evitar operaciones con dependencias secuenciales (`foldLeft`).
- Usar abstracciones como `Splitters` y `Combiners` para dividir y combinar datos eficientemente.

Este documento proporciona ejemplos prácticos y explica cómo aplicar el paralelismo en Scala, destacando cuándo y cómo aprovecharlo según el tamaño de los datos.

## Mensaje de despedida

¡Felicitaciones por completar este curso de programación funcional y concurrente en Scala! A lo largo de este viaje, hemos explorado herramientas y conceptos fundamentales que van más allá de un lenguaje de programación, abriendo la puerta a un enfoque más expresivo, eficiente y robusto para resolver problemas complejos en ciencias de la computación.

Entender los principios de la programación funcional y concurrente no solo es un logro académico, sino también una ventaja competitiva en el campo laboral. Hoy en día, la programación funcional es ampliamente utilizada en el desarrollo de backend, donde las funciones de alto orden, como `map`, `filter`, y `reduce`, permiten procesar grandes volúmenes de datos de manera declarativa y mantenible. Estas herramientas no solo simplifican el código, sino que también optimizan su rendimiento, especialmente en sistemas distribuidos.

Por otro lado, la paralelización es un componente clave en el desarrollo de frontend moderno, donde el procesamiento concurrente juega un rol crítico para garantizar interfaces de usuario rápidas y fluidas. El manejo eficiente de operaciones asíncronas y paralelas no solo mejora la experiencia del usuario, sino que también permite integrar aplicaciones más complejas y escalables.

En resumen, los conceptos y técnicas aprendidos en este curso te preparan para abordar problemas reales en un entorno profesional, permitiéndote construir software más eficiente, modular y fácil de escalar. Recuerda que la clave está en aplicar estos principios de manera estratégica, eligiendo las herramientas adecuadas para cada contexto.

¡Gracias por tu esfuerzo y dedicación! Este es solo el comienzo de un camino lleno de oportunidades en el mundo de la programación funcional y concurrente. ¡Éxito en tus futuros proyectos y desafíos!