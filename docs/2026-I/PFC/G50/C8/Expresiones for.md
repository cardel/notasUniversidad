
Las expresiones for permiten juntar generadores, filter, map, flatMap, en una sola expresión, para el caso del problema anterior teniamos

1. Una funcion esPrimo para validar si un número es primo
2. Una función rango que generaba todos los i,j tales 1 <= j < i < n
3. APlicamos un filtro a la salida de rango con la función esPrimo
Esto como mencionamos era difil de entender, de leer y de mantener, en su lugar vamos a utilizr las expresiones for

```scala
scala > val n = 10
scala> for{
     | i <- 2 to n
     | j <- i until n
     | if esPrimo(i+j)
     | } yield (i,j)
val res41: IndexedSeq[(Int, Int)] = Vector((2,3), (2,5), (2,9), (3,4), (3,8), (4,7), (4,9), (5,6), (5,8), (6,7), (8,9))
```

Esta herramienta permite juntar las funciones y aplicar directamente el filtro. Yield es una palabra clave para la generación de coleccion en varios lenguajes de programacion para devolver un generador