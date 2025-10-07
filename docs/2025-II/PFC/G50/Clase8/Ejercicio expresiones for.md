Deseo generar los pares i,j tal que i sea par, j sea multiplo de 3 e i + j sea un número primo, van entre 1 y m

Hacer
1. usando flatMap
2. usado expresiones for

# usando flatMap

Primer paso generar sin ninguna restricción
```scala
scala> val M = 10
val M: Int = 10

scala> (1 to M) flatMap (i => (1 to M) map (j => (i,j)))
val res91: IndexedSeq[(Int, Int)] = Vector((1,1), (1,2), (1,3), (1,4), (1,5), (1,6), (1,7), (1,8), (1,9), (1,10), (2,1), (2,2), (2,3), (2,4), (2,5), (2,6), (2,7), (2,8), (2,9), (2,10), (3,1), (3,2), (3,3), (3,4), (3,5), (3,6), (3,7), (3,8), (3,9), (3,10), (4,1), (4,2), (4,3), (4,4), (4,5), (4,6), (4,7), (4,8), (4,9), (4,10), (5,1), (5,2), (5,3), (5,4), (5,5), (5,6), (5,7), (5,8), (5,9), (5,10), (6,1), (6,2), (6,3), (6,4), (6,5), (6,6), (6,7), (6,8), (6,9), (6,10), (7,1), (7,2), (7,3), (7,4), (7,5), (7,6), (7,7), (7,8), (7,9), (7,10), (8,1), (8,2), (8,3), (8,4), (8,5), (8,6), (8,7), (8,8), (8,9), (8,10), (9,1), (9,2), (9,3), (9,4), (9,5), (9,6), (9,7), (9,8), (9,9), (9,10), (10,1), (10,2), (10,3), (10,4), (10,5), (10,6), (10,7), (10,8), (10,9), (10,10))
```

Vamos a aplicar la restricción de i par y j impar

```scala
scala> ((1 to M) flatMap (i => (1 to M) map (j => (i,j)))).toArray filter (t => t._1 % 2 == 0 && t._2 % 3 == 0)
val res101: Array[(Int, Int)] = Array((2,3), (2,6), (2,9), (4,3), (4,6), (4,9), (6,3), (6,6), (6,9), (8,3), (8,6), (8,9), (10,3), (10,6), (10,9))
```

Finalmente i+j es primo

```scala
scala> ((1 to M) flatMap (i => (1 to M) map (j => (i,j)))).toArray filter (t => t._1 % 2 == 0 && t._2 % 3 == 0 && ((2 to Math.ceil(Math.sqrt(t._1 + t._2
)).toInt).toVector forall (p => (t._1 + t._2) % p != 0)))
val res109: Array[(Int, Int)] = Array((2,3), (2,9), (4,3), (4,9), (8,3), (8,9), (10,3), (10,9))
```

# Expresiones for

```scala
scala> for {
     | x <- 1 to M
     | y <- 1 to M
     | if x%2 == 0 && y%3 == 0
     | if ((2 to Math.ceil(Math.sqrt(x+y)).toInt).toList) forall (p => (x+y)%p != 0)
     | }
     | yield (x,y)
val res110: IndexedSeq[(Int, Int)] = Vector((2,3), (2,9), (4,3), (4,9), (8,3), (8,9), (10,3), (10,9))
```