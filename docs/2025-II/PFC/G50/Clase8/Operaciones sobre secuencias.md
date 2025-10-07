Podemos aplicar operaciones utiliza funciones de alto orden para simplificar la forma en que se hacen

# Logica de predicados

```scala
scala> val v = Array(1,2,3,4)
val v: Array[Int] = Array(1, 2, 3, 4)

scala> v exists (x => x%3 == 0)
val res35: Boolean = true

scala> v exists (x => x%5 == 0)
val res36: Boolean = false

scala> v forall (x => x%3 == 0)
val res37: Boolean = false

scala> v forall (x => x < 5)
val res38: Boolean = true
```

Los cuantificadores $\exists P(x)$ y $\forall P(x)$ podemos aplicarlos con exists y forall respectivamente.

# Empaquetamiento

```scala
scala> x
val res39: Array[Int] = Array(1, 2, 3)

scala> val y = Array("Bogota", "Cali", "Medellin")
val y: Array[String] = Array(Bogota, Cali, Medellin)

scala> x zip y
val res40: Array[(Int, String)] = Array((1,Bogota), (2,Cali), (3,Medellin))

scala> (x zip y).unzip
val res42: (Array[Int], Array[String]) = (Array(1, 2, 3),Array(Bogota, Cali, Medellin))scala> (x zip y).unzip
val res42: (Array[Int], Array[String]) = (Array(1, 2, 3),Array(Bogota, Cali, Medellin))

scala> Array(1,2,3) zip Array(5,6)
val res43: Array[(Int, Int)] = Array((1,5), (2,6))

scala> Array(1,2,3) zip Array(4,5,6) zip Array(7,8,9)
val res44: Array[((Int, Int), Int)] = Array(((1,4),7), ((2,5),8), ((3,6),9))
```