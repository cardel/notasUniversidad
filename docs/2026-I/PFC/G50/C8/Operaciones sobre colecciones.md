## Operaciones lógicas de predicados

1. **exists(p)**: Verifica si existe al menos un elemento en la colección que satisface el predicado `p`. Corresponde al cuantificador existencial $\exists x P(x)$.
2. **forall(p)**: Verifica si todos los elementos de la colección satisfacen el predicado `p`. Corresponde al cuantificador universal $\forall x P(x)$.

## Operaciones de empaquetamiento

1. **zip**: Dadas dos colecciones, genera una colección de tuplas donde el primer elemento de cada tupla proviene de la primera colección y el segundo de la segunda colección. Es útil para combinar colecciones paralelas (ejemplo: ciudades y temperaturas).
2. **unzip**: Genera dos colecciones a partir de una colección de tuplas, separando los primeros y segundos elementos.

## Operaciones numéricas

1. **sum**: Calcula la suma de todos los elementos.
2. **product**: Calcula el producto de todos los elementos.
3. **max**: Encuentra el elemento máximo.
4. **min**: Encuentra el elemento mínimo.
5. **average**: Calcula el promedio de los elementos (disponible en algunas colecciones como `Array` o mediante `sum/size`).

# FlatMap

Cuando aplicamos `map` sobre una colección que produce colecciones anidadas, obtenemos una estructura anidada. `flatMap` permite aplicar una función que devuelve una colección y luego "aplanar" (`flatten`) el resultado en una sola colección.

```scala
scala> val x = Vector(1, 2, 3)
val x: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3)

scala> val y = Vector(1, 2)
val y: scala.collection.immutable.Vector[Int] = Vector(1, 2)

// Resultado deseado: todas las combinaciones (i, j)
scala> val res = Vector((1,1), (1,2), (2,1), (2,2), (3,1), (3,2))
val res: scala.collection.immutable.Vector[(Int, Int)] = Vector((1,1), (1,2), (2,1), (2,2), (3,1), (3,2))

// Usando map: produce un Vector de Vectores (estructura anidada)
scala> x.map( u => y.map(v => (u, v)))
val res27: scala.collection.immutable.Vector[scala.collection.immutable.Vector[(Int, Int)]] = Vector(Vector((1,1), (1,2)), Vector((2,1), (2,2)), Vector((3,1), (3,2)))

// Usando flatMap: aplana el resultado en un solo Vector
scala> x.flatMap( u => y.map(v => (u, v)))
val res29: scala.collection.immutable.Vector[(Int, Int)] = Vector((1,1), (1,2), (2,1), (2,2), (3,1), (3,2))
```

# Ejemplo: Pares (i, j) donde i+j es primo

Dado un valor entero $n$, queremos generar todos los pares $(i, j)$ que cumplen $1 \leq j < i < n$ y donde $i+j$ es un número primo.

```scala
// Función que determina si un número es primo
scala> val esPrimo = ((n: Int) => n >= 2 && (2 until n).forall(x => n % x != 0))
val esPrimo: Int => Boolean = $Lambda$1228/0x00007fe5b45ba600@58e13c25

// Pruebas de la función esPrimo
scala> esPrimo(3)
val res30: Boolean = true

scala> esPrimo(7)
val res31: Boolean = true

scala> esPrimo(10)
val res32: Boolean = false

scala> esPrimo(2)
val res33: Boolean = true

// Versión inicial con map anidado: produce una secuencia de secuencias
scala> val rango = ((n: Int) => (2 to n).map(i => (1 until i).map(j => (i, j))))
val rango: Int => IndexedSeq[IndexedSeq[(Int, Int)]] = $Lambda$1234/0x00007fe5b45c3f00@e5ca0bd

scala> rango(4)
val res36: IndexedSeq[IndexedSeq[(Int, Int)]] = Vector(Vector((2,1)), Vector((3,1), (3,2)), Vector((4,1), (4,2), (4,3)))

scala> rango(3)
val res37: IndexedSeq[IndexedSeq[(Int, Int)]] = Vector(Vector((2,1)), Vector((3,1), (3,2)))

// Versión corregida con flatMap: produce una secuencia plana de pares
scala> val rango = ((n: Int) => (2 to n).flatMap(i => (1 until i).map(j => (i, j))))
val rango: Int => IndexedSeq[(Int, Int)] = $Lambda$1237/0x00007fe5b45c6958@49b79071

scala> rango(4)
val res38: IndexedSeq[(Int, Int)] = Vector((2,1), (3,1), (3,2), (4,1), (4,2), (4,3))

// Función que filtra los pares donde i+j es primo
scala> val primos = ((n: Int) => rango(n).filter({ case (x, y) => esPrimo(x + y) }))
val primos: Int => IndexedSeq[(Int, Int)] = $Lambda$1281/0x00007fe5b45e4a60@71593d1b

scala> primos(10)
val res39: IndexedSeq[(Int, Int)] = Vector((2,1), (3,2), (4,1), (4,3), (5,2), (6,1), (6,5), (7,4), (7,6), (8,3), (8,5), (9,2), (9,4), (9,8), (10,1), (10,3), (10,7), (10,9))
```

**Análisis del procedimiento:**

1. La función `esPrimo` usa `forall` para verificar que ningún número entre 2 y n-1 divida a `n` (propiedad de número primo).
2. La función `rango` toma un `n` y genera todos los pares `(i, j)` donde `i > j` usando `flatMap` para evitar anidamientos.
3. La función `primos` aplica un filtro a la salida de `rango` usando `esPrimo` sobre la suma `i+j`.

Este procedimiento, aunque funcional, puede ser engorroso, extenso y difícil de entender cuando se escribe de manera explícita. En programación funcional se suele buscar composición mediante **for-comprehensions** para mejorar la legibilidad.

---

## Tabla de Resumen

Operación | Tipo | Descripción | Ejemplo de Uso | Notas
--- | --- | --- | --- | ---
`exists(p)` | Lógica/Predicado | Verifica si ∃ x que cumple p | `list.exists(_ > 0)` | Evalúa hasta encontrar el primer verdadero
`forall(p)` | Lógica/Predicado | Verifica si ∀ x cumple p | `list.forall(_ > 0)` | Evalúa hasta encontrar el primer falso
`zip` | Empaquetamiento | Combina dos colecciones en pares | `list1.zip(list2)` | Resultado truncado a la colección más corta
`unzip` | Empaquetamiento | Separa colección de tuplas en dos | `pairs.unzip` | Inverso de `zip`
`sum` | Numérica | Suma de elementos | `vector.sum` | Requiere tipo numérico
`product` | Numérica | Producto de elementos | `vector.product` | Requiere tipo numérico
`max` | Numérica | Elemento máximo | `vector.max` | Requiere ordenamiento
`min` | Numérica | Elemento mínimo | `vector.min` | Requiere ordenamiento
`map(f)` | Transformación | Aplica f a cada elemento | `list.map(_ * 2)` | Produce colección del mismo tamaño
`flatMap(f)` | Transformación | Aplica f y aplana resultado | `list.flatMap(x => List(x, x))` | Útil para evitar anidamientos
`filter(p)` | Filtrado | Elementos que cumplen p | `list.filter(_ % 2 == 0)` | Reduce el tamaño de la colección

**Comentarios adicionales:**

- **`flatMap` vs `map`**: `flatMap` es esencial cuando la función de transformación devuelve una colección y queremos evitar estructuras anidadas. Es equivalente a `map` seguido de `flatten`.
- **Eficiencia de `exists` y `forall`**: Ambas operaciones usan evaluación perezosa (short-circuit) y se detienen tan pronto como se determina el resultado.
- **Operaciones numéricas**: Para colecciones no numéricas, se pueden usar `reduce`, `foldLeft` o `foldRight` con operaciones personalizadas.
- **For-comprehensions**: En Scala, los `for-comprehensions` proporcionan una sintaxis más legible para secuencias de `map`, `flatMap` y `filter`. El ejemplo anterior podría reescribirse como:
  ```scala
  def primosFor(n: Int) = for {
    i <- 2 to n
    j <- 1 until i
    if esPrimo(i + j)
  } yield (i, j)
  ```
- **Manejo de errores**: Operaciones como `max` y `min` lanzan excepciones en colecciones vacías. Considerar `maxOption` o `minOption` para manejo seguro.
- **Interoperabilidad**: Muchas de estas operaciones están disponibles en todas las colecciones de Scala gracias al sistema de traits (`Iterable`, `Seq`, `Set`, etc.).