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

Cuando operamos con colecciones anidadas, al usar `map` sobre una colección que produce otra colección, obtenemos como resultado una colección de colecciones, lo cual generalmente no es el comportamiento deseado. Para resolver este problema, procedemos a "aplanar" (flatten) el resultado, combinando todas las colecciones internas en una sola colección plana.

```scala
// Creación de dos rangos
scala> val t = 1 to 4
val t: scala.collection.immutable.Range.Inclusive = Range 1 to 4

scala> val u = 2 to 5
val u: scala.collection.immutable.Range.Inclusive = Range 2 to 5

// Usando map: genera una colección de colecciones (anidamiento no deseado)
scala> t.map(ti => u.map(ui => (ti,ui)))
val res26: IndexedSeq[IndexedSeq[(Int, Int)]] = Vector(Vector((1,2), (1,3), (1,4), (1,5)), Vector((2,2), (2,3), (2,4), (2,5)), Vector((3,2), (3,3), (3,4), (3,5)), Vector((4,2), (4,3), (4,4), (4,5)))

// Usando flatMap: aplana el resultado en una sola colección
scala> t.flatMap(ti => u.map(ui => (ti,ui)))
val res28: IndexedSeq[(Int, Int)] = Vector((1,2), (1,3), (1,4), (1,5), (2,2), (2,3), (2,4), (2,5), (3,2), (3,3), (3,4), (3,5), (4,2), (4,3), (4,4), (4,5))
```

El efecto de aplanamiento que realiza `flatMap` es equivalente a aplicar primero `map` y luego `flatten`:

```scala
// Primero aplicamos map (genera colección anidada)
scala> t.map(ti => u.map(ui => (ti,ui)))
val res33: IndexedSeq[IndexedSeq[(Int, Int)]] = Vector(Vector((1,2), (1,3), (1,4), (1,5)), Vector((2,2), (2,3), (2,4), (2,5)), Vector((3,2), (3,3), (3,4), (3,5)), Vector((4,2), (4,3), (4,4), (4,5)))

// Luego aplicamos flatten para aplanar el resultado
scala> t.map(ti => u.map(ui => (ti,ui))).flatten
val res34: IndexedSeq[(Int, Int)] = Vector((1,2), (1,3), (1,4), (1,5), (2,2), (2,3), (2,4), (2,5), (3,2), (3,3), (3,4), (3,5), (4,2), (4,3), (4,4), (4,5))
```

# Ejercicio

Deseo generar las parejas (i,j) tales que i+j sea un número primo.

```scala
// Primero generamos todas las parejas (i,j) donde 1 ≤ j ≤ i ≤ 10
scala> (1 to 10).flatMap(i => (1 to i).map(j => (i,j)))
val res35: IndexedSeq[(Int, Int)] = Vector((1,1), (2,1), (2,2), (3,1), (3,2), (3,3), (4,1), (4,2), (4,3), (4,4), (5,1), (5,2), (5,3), (5,4), (5,5), (6,1), (6,2), (6,3), (6,4), (6,5), (6,6), (7,1), (7,2), (7,3), (7,4), (7,5), (7,6), (7,7), (8,1), (8,2), (8,3), (8,4), (8,5), (8,6), (8,7), (8,8), (9,1), (9,2), (9,3), (9,4), (9,5), (9,6), (9,7), (9,8), (9,9), (10,1), (10,2), (10,3), (10,4), (10,5), (10,6), (10,7), (10,8), (10,9), (10,10))

// Definimos una función para verificar si un número es primo
scala> val esPrimo = ((n:Int) => (2 until n).forall(d => n % d != 0))
val esPrimo: Int => Boolean = $Lambda$1288/0x00007ffb1c5d5a18@6cef7928

// Filtramos las parejas donde la suma sea un número primo
scala> (1 to 10).flatMap(i => (1 to i).map(j => (i,j))).filter(x => esPrimo(x._1+x._2))
val res37: IndexedSeq[(Int, Int)] = Vector((1,1), (2,1), (3,2), (4,1), (4,3), (5,2), (6,1), (6,5), (7,4), (7,6), (8,3), (8,5), (9,2), (9,4), (9,8), (10,1), (10,3), (10,7), (10,9))
```

Para resolver este problema necesitamos utilizar `flatMap`, `map` y `filter` para generar y filtrar las parejas, pero esta combinación puede volverse engorrosa y difícil de entender cuando las operaciones se anidan. Para abordar este problema de legibilidad, a continuación veremos las expresiones `for`.

## Tabla de Resumen

Concepto | Operación | Descripción | Entrada | Salida | Uso Típico
--- | --- | --- | --- | --- | ---
`map` | Transformación | Aplica una función a cada elemento de una colección | `Colección[A]`, `A => B` | `Colección[B]` | Transformar elementos individualmente
`flatMap` | Transformación y aplanamiento | Aplica una función que devuelve una colección y luego aplana el resultado | `Colección[A]`, `A => Colección[B]` | `Colección[B]` | Cuando la transformación produce colecciones anidadas
`flatten` | Aplanamiento | Convierte una colección de colecciones en una sola colección plana | `Colección[Colección[A]]` | `Colección[A]` | Simplificar estructuras anidadas
Combinación `map` + `flatten` | Equivalente a `flatMap` | Primero transforma y luego aplana | `Colección[A]`, `A => Colección[B]` | `Colección[B]` | Forma explícita de lograr lo que `flatMap` hace

## Comentarios Adicionales

1. **Relación entre `flatMap` y `map`+`flatten`**: `flatMap` es esencialmente la composición de `map` seguido de `flatten`. Es decir, `xs.flatMap(f)` es equivalente a `xs.map(f).flatten`.

2. **Monadas en Scala**: `flatMap` es una operación fundamental en el concepto de mónadas en programación funcional. Las colecciones de Scala (List, Vector, Option, Future, etc.) son mónadas, lo que permite encadenar operaciones de manera elegante.

3. **Legibilidad del código**: Cuando se anidan múltiples operaciones `flatMap` y `map`, el código puede volverse difícil de leer. Las expresiones `for` en Scala proporcionan una sintaxis más legible para estas operaciones anidadas.

4. **Rendimiento**: `flatMap` es generalmente eficiente, pero cuando se trabaja con colecciones muy grandes o anidamientos profundos, es importante considerar el rendimiento. En algunos casos, puede ser más eficiente usar bucles explícitos.


5. **Comprehensions en otros lenguajes**: La operación `flatMap` y su equivalente con expresiones `for` en Scala son similares a las "list comprehensions" en Python o Haskell, proporcionando una forma declarativa de trabajar con colecciones.

6. **Filtrado con `flatMap`**: A veces se usa `flatMap` para combinar transformación y filtrado: `xs.flatMap(x => if (cond(x)) Some(f(x)) else None)` aplica la función `f` solo a los elementos que cumplen la condición `cond`.