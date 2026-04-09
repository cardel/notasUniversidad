# Expresiones For

Las expresiones `for` permiten agrupar las operaciones `map`, `flatMap` y `filter` en un solo bloque que es más fácil de comprender y leer. Estas expresiones, conocidas como "for comprehensions", proporcionan una sintaxis declarativa para trabajar con colecciones y otros tipos monádicos.

```scala
// Sintaxis general de una expresión for
for{
    i <- generador1      // Generador: similar a flatMap
    j <- generador2      // Otro generador
    ...
    if condicion         // Filtro: similar a filter
    if condicion         // Puede haber múltiples filtros
} yield ...              // Transformación: similar a map
```

Los generadores (`<-`) corresponden inicialmente a operaciones `flatMap`, las condiciones de filtrado con `if` corresponden a operaciones `filter`, y finalmente `yield` actúa como `map` (genera la salida). Es importante tener cuidado porque la expresión nos produce un `IndexedSeq` que puede ser necesario convertir al tipo de colección deseado.

## Resolución del problema anterior usando for comprehension

```scala
// Definimos la función para verificar si un número es primo
scala> val esPrimo = ((n:Int) => (2 until n).forall(d => n % d != 0))
val esPrimo: Int => Boolean = $Lambda$1303/0x00007ffb1c5d1220@948335d

// Solución original usando flatMap, map y filter
scala> (1 to 10).flatMap(i => (1 to i).map(j => (i,j))).filter(x => esPrimo(x._1+x._2))
val res38: IndexedSeq[(Int, Int)] = Vector((1,1), (2,1), (3,2), (4,1), (4,3), (5,2), (6,1), (6,5), (7,4), (7,6), (8,3), (8,5), (9,2), (9,4), (9,8), (10,1), (10,3), (10,7), (10,9))

// Solución equivalente usando for comprehension (más legible)
scala> for{
     | i <- (1 to 10)           // Generador para i de 1 a 10
     | j <- (1 to i)            // Generador para j de 1 a i (depende de i)
     | if esPrimo(i+j)          // Filtro: solo pares cuya suma sea primo
     | } yield (i,j)            // Transformación: produce la tupla (i,j)
val res39: IndexedSeq[(Int, Int)] = Vector((1,1), (2,1), (3,2), (4,1), (4,3), (5,2), (6,1), (6,5), (7,4), (7,6), (8,3), (8,5), (9,2), (9,4), (9,8), (10,1), (10,3), (10,7), (10,9))

// Convertir el resultado a Vector explícitamente
scala> (for{
     | i <- (1 to 10)
     | j <- (1 to i)
     | if esPrimo(i+j)
     | } yield (i,j)).toVector
val res40: scala.collection.immutable.Vector[(Int, Int)] = Vector((1,1), (2,1), (3,2), (4,1), (4,3), (5,2), (6,1), (6,5), (7,4), (7,6), (8,3), (8,5), (9,2), (9,4), (9,8), (10,1), (10,3), (10,7), (10,9))
```

## Ejemplo del producto punto

```scala
// Definición de dos arrays
scala> val x: Array[Int] = Array(1, 2, 3)
val x: Array[Int] = Array(1, 2, 3)

scala> val y = Array(2,3,4)
val y: Array[Int] = Array(2, 3, 4)

// Combinar los arrays en pares usando zip
scala> x zip y
val res41: Array[(Int, Int)] = Array((1,2), (2,3), (3,4))

// Multiplicar los elementos de cada par usando pattern matching
scala> x zip y map ({case (a,b) => a*b})
val res42: Array[Int] = Array(2, 6, 12)

// Calcular la suma de los productos (producto punto)
scala> (x zip y map ({case (a,b) => a*b})).sum
val res45: Int = 20
```

# Conjuntos (Sets)

Un conjunto (Set) es una colección desordenada de elementos únicos que no se repiten. Los conjuntos en Scala son inmutables por defecto y proporcionan operaciones matemáticas de conjuntos.

```scala
// Creación de un conjunto: los elementos duplicados se eliminan automáticamente
scala> val s1 = Set(1,2,2,2,3,2,2,3)
val s1: scala.collection.immutable.Set[Int] = Set(1, 2, 3)

// Verificar si un elemento está en el conjunto
scala> s1 contains 3
val res46: Boolean = true

scala> s1 contains 10
val res47: Boolean = false

// Creación de otro conjunto
scala> val s2 = Set(2,4,6)
val s2: scala.collection.immutable.Set[Int] = Set(2, 4, 6)

// Unión de conjuntos (todos los elementos de ambos conjuntos)
scala> s1 union s2
val res48: scala.collection.immutable.Set[Int] = HashSet(1, 6, 2, 3, 4)

// Diferencia de conjuntos (elementos en s1 pero no en s2)
scala> s1 diff s2
val res51: scala.collection.immutable.Set[Int] = Set(1, 3)
```

Como se puede observar, aplicamos las mismas operaciones que en la lógica de conjuntos matemáticos, incluyendo unión, intersección (no mostrada pero disponible como `intersect`), diferencia y verificación de pertenencia.

## Tabla de Resumen

Concepto | Operación/Expresión | Descripción | Equivalencia Funcional | Uso Típico
--- | --- | --- | --- | ---
For Comprehension | `for { gen... if... } yield expr` | Sintaxis declarativa para operaciones con colecciones | `flatMap` + `filter` + `map` | Mejorar legibilidad de operaciones anidadas
Generador (`<-`) | `i <- coleccion` | Extrae elementos de una colección en un for comprehension | `flatMap` | Iterar sobre elementos de colecciones
Filtro (`if`) | `if condicion` | Filtra elementos que cumplen una condición | `filter` | Seleccionar elementos específicos
Transformación (`yield`) | `yield expresion` | Transforma cada elemento en un nuevo valor | `map` | Producir resultados transformados
Conjunto (Set) | `Set(elem1, elem2, ...)` | Colección de elementos únicos sin orden | Estructura matemática de conjuntos | Cuando se necesitan elementos únicos
Operación `zip` | `coll1 zip coll2` | Combina dos colecciones en pares | Combinación elemento a elemento | Operaciones entre colecciones paralelas
Operación `union` | `set1 union set2` | Unión de conjuntos (todos los elementos) | `∪` en matemáticas | Combinar conjuntos sin duplicados
Operación `diff` | `set1 diff set2` | Diferencia de conjuntos (elementos en set1 pero no en set2) | `\` en matemáticas | Encontrar elementos exclusivos

## Comentarios Adicionales

1. **Traducción de for comprehensions**: Internamente, Scala traduce las expresiones `for` a llamadas a `flatMap`, `filter` y `map`. Por ejemplo, `for(i <- c1; j <- c2) yield (i,j)` se traduce a `c1.flatMap(i => c2.map(j => (i,j)))`.


2. **For sin yield**: Cuando se usa `for` sin `yield`, se ejecutan efectos secundarios (similar a `foreach`). Esto es útil para iterar sobre colecciones para realizar acciones en lugar de transformarlas.

3. **Múltiples generadores**: Los generadores anidados en expresiones `for` producen el producto cartesiano de las colecciones, similar a bucles anidados.

4. **Sets y rendimiento**: Los conjuntos en Scala tienen generalmente complejidad O(1) para operaciones de búsqueda (`contains`), gracias a que internamente usan tablas hash (HashSet) o árboles balanceados (TreeSet para conjuntos ordenados).

5. **Inmutabilidad por defecto**: Los conjuntos creados con `Set()` son inmutables. Para conjuntos mutables se debe usar `scala.collection.mutable.Set`.

6. **Operaciones de conjuntos**: Además de `union` y `diff`, los conjuntos soportan `intersect` (intersección), `&` (intersección), `|` (unión), `&~` (diferencia), y `subsetOf` (verificación de subconjunto).

7. **Conversión entre tipos**: Los resultados de for comprehensions pueden convertirse a diferentes tipos de colecciones usando métodos como `.toList`, `.toVector`, `.toSet`, etc., según sea necesario.