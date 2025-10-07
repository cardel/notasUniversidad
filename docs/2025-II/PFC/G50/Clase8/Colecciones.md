Las colecciones son agrupaciones de datos del mismo tipo

Iterable
	Seq: List, Stream, Vector, Range, Array, String: Son colecciones indexables (posición numérica)
	Set: HashSet y TreeSet, son colecciones desordenada de elementos, no permiten elementos repetidos
	 Map: (llave, valor) Hashmap, Treemap

# Vectores

Las listas son estructuras recursivas
1. Elementos de tipo T
2. Lista de tipo T
Siempre van a tener dos elementos (head, tail) son costosas de acceder, porque para acceder a un elemento en especifico se requiere haber recorrido todos los anteriores. $O(n)$ 

Un alternativa, los vectores son internamente arreglos

![](attachments/Pasted%20image%2020251007072140.png)

Los vectores son **reserva de espacio en memoria** lo que permite indexar mediante una operación de calculo de posiciones en memoria 0,1,2,3,....
```scala
scala> val pollito = Vector(1,2,3,4)
val pollito: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4)

scala> pollito(0)
val res0: Int = 1

scala> pollito :+ 0
val res2: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4, 0)

scala> 0 +: pollito
val res3: scala.collection.immutable.Vector[Int] = Vector(0, 1, 2, 3, 4)
```

# Rangos
Permiten generar una secuencia de enteros espaciados de forma uniforme. Esta coleccion no genera un valor directamente si un iterador.

```scala
scala> 1 to 3
val res9: scala.collection.immutable.Range.Inclusive = Range 1 to 3

scala> (1 to 3).toList
val res10: List[Int] = List(1, 2, 3)

scala> 1 until 3
val res11: scala.collection.immutable.Range = Range 1 until 3

scala> (1 until 3).toList
val res12: List[Int] = List(1, 2)
```

En el caso de los rangos to incluye el último y until no, además para poder ver los elementos es necesario iterar sobre ellos. Además, los rangos por defecto crecen de 1 en 1.

```scala
scala> 1 until 3 by 2
val res13: scala.collection.immutable.Range = Range 1 until 3 by 2

scala> (1 until 3 by 2).toList
val res14: List[Int] = List(1)

scala> 1 to 3 by 2
val res16: scala.collection.immutable.Range = Range 1 to 3 by 2

scala> (1 to 3 by 2).toList
val res17: List[Int] = List(1, 3)
```

Podemos especificar el incremento/decremento del rango utilizando by

```scala
scala> (1 to -10 by -1).toList
val res18: List[Int] = List(1, 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10)

scala> (1 to -10).toList
val res19: List[Int] = List()

scala> (1 to -10).toVector
val res20: scala.collection.immutable.Vector[Int] = Vector()

scala> (1 to -10).toArray
val res21: Array[Int] = Array()
```

# Array y String

Los arreglos y cadenamos soportan las mismas operaciones de seq y pueden ser convertidos a otras colecciones directamente.

```scala
scala> val x = Array(1,2,3)
val x: Array[Int] = Array(1, 2, 3)

scala> 1 +: x
val res22: Array[Int] = Array(1, 1, 2, 3)

scala> val p = "Hola mundo cruel"
val p: String = Hola mundo cruel

scala> 's' +: p
val res23: String = sHola mundo cruel

scala> p map (x => x.toUpper)
val res24: String = HOLA MUNDO CRUEL
```