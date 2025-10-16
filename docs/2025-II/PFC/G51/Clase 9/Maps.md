Los maps son colecciones que relacionan llave con valor, es equivalente a los Arrays o Vectores considerando que estos tienen llaves numericas incrementales que van desde 0

```scala
val arr = Array(1,2,3)
arr[0] // 0 es la llave o posición
arr[1]
```

Los maps son colecciones que asocian llave con valor y la llave puede ser diferentes tipo, pero esta debe ser única

```scala
scala> val map1 = Map("Colombia" -> "Bogota", "Peru" -> "Lima", "Venezuela" -> "Caracas", "Argentina" -> "Buenos Aires")
val map1: scala.collection.immutable.Map[String,String] = Map(Colombia -> Bogota, Peru -> Lima, Venezuela -> Caracas, Argentina -> Buenos Aires)

scala> map1("Colombia")
val res0: String = Bogota

scala> map1("Venezuela")
val res1: String = Caracas
```

Al intentar duplicar una llave, se nos sobreescribe la información, por otra parte intentar consulta una llave que no existe dará lugar a una excepción.

```scala
scala> val map1 = Map("Colombia" -> "Bogota", "Peru" -> "Lima", "Venezuela" -> "Caracas", "Argentina" -> "Buenos Aires", "Argentina" -> "Cordoba")
val map1: scala.collection.immutable.Map[String,String] = Map(Colombia -> Bogota, Peru -> Lima, Venezuela -> Caracas, Argentina -> Cordoba)

scala> map1("Panama")
java.util.NoSuchElementException: key not found: Panama
  at scala.collection.immutable.Map$Map4.apply(Map.scala:535)
  ... 34 elided
```

Ahora para evitar este problema usar withDefaultValue

```scala
scala> val map1 = Map("Colombia" -> "Bogota", "Peru" -> "Lima", "Venezuela" -> "Car
acas", "Argentina" -> "Buenos Aires") withDefaultValue("No esta")
val map1: scala.collection.immutable.Map[String,String] = Map(Colombia -> Bogota, P
eru -> Lima, Venezuela -> Caracas, Argentina -> Buenos Aires)

scala> map1("Panama")
val res3: String = No esta

scala> map1(1)
            ^
       error: type mismatch;
        found   : Int(1)
        required: String
```

Podemos transformar los Maps a otras colecciones, y estas quedan como colecciones de tuplas

```scala
scala> map1
val res7: scala.collection.immutable.Map[String,String] = Map(Colombia -> Bogota, Peru -> Lima, Venezuela -> Caracas, Argentina -> Buenos Aires)

scala> map1.toList
val res8: List[(String, String)] = List((Colombia,Bogota), (Peru,Lima), (Venezuela,Caracas), (Argentina,Buenos Aires))

scala> map1.toArray
val res9: Array[(String, String)] = Array((Colombia,Bogota), (Peru,Lima), (Venezuela,Caracas), (Argentina,Buenos Aires))

scala> map1.toSet
val res10: scala.collection.immutable.Set[(String, String)] = Set((Colombia,Bogota), (Peru,Lima), (Venezuela,Caracas), (Argentina,Buenos Aires))
```

Se pueden separar usando unzip

```scala
scala> map1.toArray
val res11: Array[(String, String)] = Array((Colombia,Bogota), (Peru,Lima), (Venezuela,Caracas), (Argentina,Buenos Aires))

scala> map1.toArray.unzip
val res12: (Array[String], Array[String]) = (Array(Colombia, Peru, Venezuela, Argentina),Array(Bogota, Lima, Caracas, Buenos Aires))

scala> val (x,y) = map1.toArray.unzip
val x: Array[String] = Array(Colombia, Peru, Venezuela, Argentina)
val y: Array[String] = Array(Bogota, Lima, Caracas, Buenos Aires)
```

Para esto podemos obtener las llaves o los valores

```scala
scala> map1.keys
val res15: Iterable[String] = Set(Colombia, Peru, Venezuela, Argentina)

scala> map1.values
val res16: Iterable[String] = Iterable(Bogota, Lima, Caracas, Buenos Aires)
```