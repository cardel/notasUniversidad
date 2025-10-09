Los conjuntos son una colección de datos que no se repiten.

```scala
scala> val s1 = Set(1,1,1,1,1,1,1,1,1,1,1,1,2,3)
val s1: scala.collection.immutable.Set[Int] = Set(1, 2, 3)

scala> s1 union Set(4,5,6)
val res32: scala.collection.immutable.Set[Int] = HashSet(5, 1, 6, 2, 3, 4)

scala> s1 intersect Set(1,4,5)
val res33: scala.collection.immutable.Set[Int] = Set(1)

def diff(that: scala.collection.Set[Int]): scala.collection.immutable.Set[Int]

scala> s1 diff Set(1,4,5)
val res34: scala.collection.immutable.Set[Int] = Set(2, 3)
```

Si casteamos de una colección a un conjunto **podríamos tener perdida de datos y orden**

```scala
scala> (1 to 20).toArray
val res36: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20)

scala> (1 to 20).toArray.toSet
val res37: scala.collection.immutable.Set[Int] = HashSet(5, 10, 14, 20, 1, 6, 9, 13, 2, 17, 12, 7, 3, 18, 16, 11, 8, 19, 4, 15)

scala> (1 to 20).toArray.toSet.toArray
val res38: Array[Int] = Array(5, 10, 14, 20, 1, 6, 9, 13, 2, 17, 12, 7, 3, 18, 16, 11, 8, 19, 4, 15)

scala> Array(1,1,1,2,2,2,2,3,3,3)
val res39: Array[Int] = Array(1, 1, 1, 2, 2, 2, 2, 3, 3, 3)

scala> Array(1,1,1,2,2,2,2,3,3,3).toSet
val res40: scala.collection.immutable.Set[Int] = Set(1, 2, 3)

scala> Array(1,1,1,2,2,2,2,3,3,3).toSet.toArray
val res41: Array[Int] = Array(1, 2, 3)
```