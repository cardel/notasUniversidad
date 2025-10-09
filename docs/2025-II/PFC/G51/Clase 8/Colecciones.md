# Jeraquia de las colecciones

- Iterable: Superclase que agrupa todas las colecciones (recorrer)
	- Seq: (Indexadas) hay orden, primer elemento, segundo elemento, n-esimo elemento: List, Stream, Vector, Range, Array, String
	- Set: HashSet, TreeSet (Conjuntos)
	- Map: Hashmap, Treemap
# Secuenciales (Seq)

# Array

Un arreglo es un colecciones de elementos del mismo tipo, pero que en memoria es una reserva espacio (lineal), por lo tanto su acceso es en tiempo constante $O(1)$

![](attachments/Pasted%20image%2020251009072232.png)

Los arreglos son más adecuados para operaciones de acceso.
```scala
scala> val arr = Array(1,2,3,4)
val arr: Array[Int] = Array(1, 2, 3, 4)

scala> arr(0)
val res0: Int = 1

scala> arr.length
val res1: Int = 4

scala> 1 +: arr
val res2: Array[Int] = Array(1, 1, 2, 3, 4)
```

# Vector

Vector es una coleccion de datos del mismo inmutable, trabaja de forma similar a los Arrays, pero estan pensando en que pueden cambiar de tamaño.

```scala
scala> val vec = Vector(1,2,3,4)
val vec: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4)

scala> vec(0)
val res3: Int = 1

scala> vec.length
val res4: Int = 4

scala> 2 +: vec
val res7: scala.collection.immutable.Vector[Int] = Vector(2, 1, 2, 3, 4)

scala> vec :+ 2
val res8: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4, 2)
```
# Diferencias

## Array
- Es una colección **indexada** que pertenece a la categoría **Seq**
- En memoria es una **reserva de espacio lineal**
- **Acceso en tiempo constante** $O(1)$ - muy eficiente para acceso por índice
- Más adecuado para **operaciones de acceso** frecuente

## Vector
- También es una colección **indexada** dentro de **Seq**
- Estructura de datos **inmutable** por defecto en Scala
- Implementado como un **árbol trie de 32 elementos** (32-way trie)
- **Acceso casi constante** $O(log_32(n))$ - muy eficiente para tamaños grandes
- Excelente para **operaciones de actualización** (prepend, append)

## Diferencias clave:

| Característica | Array | Vector |
|---------------|-------|--------|
| **Mutabilidad** | Mutable | Inmutable |
| **Acceso** | $O(1)$ | $O(log_32(n))$ |
| **Actualizaciones** | Menos eficiente | Muy eficiente |
| **Uso ideal** | Acceso frecuente | Operaciones funcionales |
| **Memoria** | Reserva lineal | Estructura de árbol |

# Rangos

Son una colección de números enteros, pero que funciona con evaluación perezosa (los datos se calculan a medida que se necesitan), un Rango tiene 3 elementos

1. Valor inicial
2. Valor final
3. El incremento/decremento

```scala
scala> 0 to 3
val res9: scala.collection.immutable.Range.Inclusive = Range 0 to 3

scala> (0 to 3).toVector
val res10: scala.collection.immutable.Vector[Int] = Vector(0, 1, 2, 3)

scala> 0 until 3
val res11: scala.collection.immutable.Range = Range 0 until 3

scala> (0 until 3).toVector
val res12: scala.collection.immutable.Vector[Int] = Vector(0, 1, 2)

scala> (0 to 200 by 2).toVector
val res13: scala.collection.immutable.Vector[Int] = Vector(0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 174, 176, 178, 180, 182, 184, 186, 188, 190, 192, 194, 196, 198, 200)

scala> (1 to -10).toList
val res14: List[Int] = List()

scala> (1 to -10 by -1).toList
val res15: List[Int] = List(1, 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10)
```

Los rangos en sí no se evaluan, sin embargo, internamente se transforman a un IndexedSeq que es casteado a Vector

```scala
scala> (0 to 10) map (x => x*x)
val res3: IndexedSeq[Int] = Vector(0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100)
```

Dada que la conversión no es controlada es mejor trasnformarlo a un Array o un Vector directamente

```scala
scala> (0 to 10).toArray map (x => x*x)
val res2: Array[Int] = Array(0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100)
```

Los tipos de rangos son:

1. Inclusivos: to
2. No inclusivos: until


# String

Los String son una colección de char, que es inmutable y es equivalente a las otras colecciones como List, Array o Vector, solo que su tipo es estrictamente coleccion Char


```scala
scala> val f = "Hola mundo"
val f: String = Hola mundo

scala> f(0)
val res5: Char = H

scala> 'a' + f
           ^
       warning: method + in class Char is deprecated (since 2.13.0): Adding a number and a String is deprecated. Use the string interpolation `s"$num$str"`
val res6: String = aHola mundo
```
Así mismo se le pueden aplicar funciones de alto orden

```scala
scala> f
val res7: String = Hola mundo

scala> f map (x => x.toUpper)
val res8: String = HOLA MUNDO

scala> f map (_ < 'b')
val res10: IndexedSeq[Boolean] = ArraySeq(true, false, false, true, true, false, false, false, false, false)

scala> f filter (_ < 'b')
val res11: String = "Ha "

scala> 'A'.toInt
val res12: Int = 65

scala> 'a'.toInt
val res13: Int = 97
```
String se puede transformar a otras colecciones

```scala
scala> f
val res14: String = Hola mundo

scala> f.toArray
val res15: Array[Char] = Array(H, o, l, a,  , m, u, n, d, o)

scala> f.toList
val res16: List[Char] = List(H, o, l, a,  , m, u, n, d, o)

scala> f.toVector
val res17: scala.collection.immutable.Vector[Char] = Vector(H, o, l, a,  , m, u, n, d, o)
```