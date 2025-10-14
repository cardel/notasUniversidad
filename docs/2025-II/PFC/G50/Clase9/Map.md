
Los map son asociaciones llave, valor, donde la llave **es unica** y esta asociada a un valor, es similar a los arreglos o vectores solamente que la busqueda no se hace por indice sino por la llave (diferente tipo)

```scala
scala> val map1 = Map("Colombia" -> "Bogota", "Peru" -> "Lima", "Venezuela"
-> "Caracas", "Brazil" -> "Brasilia", "Mexico" -> "DF")
val map1: scala.collection.immutable.Map[String,String] = HashMap(Venezuela -> Caracas, Mexico -> DF, Peru -> Lima, Brazil -> Brasilia, Colombia -> Bogota)

scala> val map2 = Map(10 -> "Lunes", 11 -> "Martes", 12 -> "Miercoles", 12 -> "Jueves")
val map2: scala.collection.immutable.Map[Int,String] = Map(10 -> Lunes, 11 -> Martes, 12 -> Jueves)
```

En caso que una llave se repita se sobreescribe el valor.

```scala
scala> map1("Colombia")
val res1: String = Bogota

scala> map1("Argentina")
java.util.NoSuchElementException: key not found: Argentina
  at scala.collection.immutable.BitmapIndexedMapNode.apply(HashMap.scala:670)
  at scala.collection.immutable.HashMap.apply(HashMap.scala:132)
  ... 34 elided
```

En caso que una llave no exista se retorna un mensaje de error

```scala
scala> val map1 = Map("Colombia" -> "Bogota", "Peru" -> "Lima", "Venezuela"
-> "Caracas", "Brazil" -> "Brasilia", "Mexico" -> "DF") withDefaultValue "No esta"
val map1: scala.collection.immutable.Map[String,String] = Map(Venezuela -> Caracas, Mexico -> DF, Peru -> Lima, Brazil -> Brasilia, Colombia -> Bogota)

scala> map1("Argentina")
val res4: String = No esta
```

Con withDefaultValue evitan el error

```scala
scala> map1.toList
val res6: List[(String, String)] = List((Venezuela,Caracas), (Mexico,DF), (Peru,Lima), (Brazil,Brasilia), (Colombia,Bogota))

scala> map2.toArray
val res7: Array[(Int, String)] = Array((10,Lunes), (11,Martes), (12,Jueves))

scala> List((1,1),(2,2),(3,3)).toMap
val res9: scala.collection.immutable.Map[Int,Int] = Map(1 -> 1, 2 -> 2, 3 -> 3)
```

Podemos obtener las llaves, los valores o los pares separados asi:

```scala
scala> map1.values
val res10: Iterable[String] = Iterable(Caracas, DF, Lima, Brasilia, Bogota)

scala> map1.keys
val res11: Iterable[String] = Set(Venezuela, Mexico, Peru, Brazil, Colombia)

scala> val (x,y) = (map1.keys, map1.values)
val x: Iterable[String] = Set(Venezuela, Mexico, Peru, Brazil, Colombia)
val y: Iterable[String] = Iterable(Caracas, DF, Lima, Brasilia, Bogota)
```