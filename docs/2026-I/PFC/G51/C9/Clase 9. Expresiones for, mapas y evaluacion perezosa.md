
# Como vamos

1. Vimos funciones de alto orden
	1. map: Aplicar una función a una colección
	2. filter: Retornar los elementos de una colección que cumplen una condición
	3. reduce/fold: Combinar los elementos de una colección mediante una operación
2. Flatmap: Cuando tenemos colecciones que trabajan con colecciones tenemos el problema que ucando aplicamos map nos da una colección de colecciones, con esto aplanamos

```scala
scala> val x = List(1,2,3)                             14:26 [3/34]
val x: List[Int] = List(1, 2, 3)

scala> val y = List("a","b","c")
val y: List[String] = List(a, b, c)

scala> x.map(xi => y.map(yi => (xi,yi)))
val res2: List[List[(Int, String)]] = List(List((1,a), (1,b), (1,c)
), List((2,a), (2,b), (2,c)), List((3,a), (3,b), (3,c)))

scala> x.flatMap(xi => y.map(yi => (xi,yi)))
val res3: List[(Int, String)] = List((1,a), (1,b), (1,c), (2,a), (2
,b), (2,c), (3,a), (3,b), (3,c))
```

3. Expresiones for nos permite combinar map, filter y flatMap

```scala
scala> for{
     | xi <- x
     | yi <- y
     | } yield (xi,yi)
val res0: List[(Int, String)] = List((1,a), (1,b), (1,c), (2,a), (2,b), (2,c), (3,a), (3,b), (3,c))
```

# Temas

1. [Expresiones for extendido](Expresiones%20for%20extendido.md)
2. [Map](Map.md)
3. [Evaluación perezosa](Evaluación%20perezosa.md)