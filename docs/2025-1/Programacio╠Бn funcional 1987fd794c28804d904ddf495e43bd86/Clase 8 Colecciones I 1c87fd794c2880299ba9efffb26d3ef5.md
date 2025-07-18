# Clase 8 Colecciones I

# Vectores

Son colecciones que pueden ser indexadas

```scala
val x = Vector(1,2,3,4)
```

# Arrays

Son colecciones que son inmutables y pueden ser indexadas

Ocupan menos espacio en memoria que otras colecciones como los vectores

```scala
val p = Array("Hola", "Perro")
```

# Conjuntos

Son colecciones no ordenadas que no permiten elementos repetidos

```scala
val t = Set(1,2,3,4,1,1,1)
```

# Rangos

Los rangos son secuencias de números

```scala
(1 to 10) // 1 hasta 10 incluidos
(1 until 10) // 1 hasta 9
(1 to 10 by 2) //1 hasta 10 de 2 en 2
(1 to -10 by -1)
```

# Conversiones

Dado que las colecciones heredan desde Seq, tienen una implementación similara

1. .toList nos convierte a Listas
2. .toArray
3. .toSet
4. .toVector
5. .toString Colección de char

# Funciones de alto orden en colecciones

Map, filter, foldLeft, reduceLeft, reduceRight, foldRight

Trabajan de igual forma que en las listas

## flatMap

¿Para que sirve?

Permite hacer operaciones de producto cartesiano entre dos o más colecciones

```scala
val a1 = (1 to 10).toArray
val a2 = (1 to 20).toArray

val res = a1 flatMap (x -> a2 map (y => (x,y)))
```

# Expresiones for

¿Para que sirven?

Integran

- Flatmap (poder integrar dos o mas colecciones)
- map: yield
- filter if

```scala
{for{
 i <- 1 to 10
 j <- 1 to 20
 //i y j trabajan como un flatMap
 if j < i //filtro
} yield (i+j) //map
}.toLoqueQuiera //Cast
```