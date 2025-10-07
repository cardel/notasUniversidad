
Son una colección desordenada de elementos (no hay indexación) de elementos que no se repiten.

```scala
scala> val s = Set(1,2,2,3,3,3,3,3,3,4)
val s: scala.collection.immutable.Set[Int] = Set(1, 2, 3, 4)

scala> s.toList
val res111: List[Int] = List(1, 2, 3, 4)

scala> s.toArray
val res112: Array[Int] = Array(1, 2, 3, 4)

scala> s union Set(4,5,6)
val res113: scala.collection.immutable.Set[Int] = HashSet(5, 1, 6, 2, 3, 4)

scala> s intersect Set(2,4,6)
val res114: scala.collection.immutable.Set[Int] = Set(2, 4)

scala> s diff Set(1,3)
val res116: scala.collection.immutable.Set[Int] = Set(2, 4)
```