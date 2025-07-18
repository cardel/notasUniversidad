# Clase 02 de Mayo: Funciones de alto orden

# Colecciones

Listas

- Inmutables
- Forma recursiva (cabeza, cola: Lista) parada Nil, List()

```scala
val l = List(1,2,3,4)
```

---

Tuplas

- Inmutables
- Indexar, primera posición, segunda posición

```scala
val tupla = (1,2,3,4,5)
tupla._1
tupla._2

scala> (1,2,3,4)._1
val res0: Int = 1

scala> (1,2,3,4)._2
val res1: Int = 2
```

---

Arrays

- Inmutables
- Secuenciales (Es decir se acceden a través de un posición que va desde 0 hasta n-1)

```scala
val arreglo = Array(1,2,3,4)
arreglo(0)
```

---

Conjuntos

- inmutables
- No son secuenciales (no hay un orden de acceso)
- No permiten elementos repetidos

```scala
val conjunto = Set(1,2,3,4)
```

---

Maps

- Inmutables
- No son secuenciales, se acceden a través de una llave única
- Son pares llave, valor

```scala
val mapa = Map("Col" -> "Bog", "Ven" -> "Cara", "Peru" -> "Lima")
mapa("Col")
```

---

Vector

- Es inmutable
- A diferencia de array esta pensando para que su tamaño sea variable

```scala
scala> val p = Vector(1,2,3)
val p: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3)

scala> p :+ 2
val res63: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 2)
```

# Mapeo

El mapeo es aplicar una función a todos los elementos en una colección y retornar una coleccion con los resultados

```scala
scala> val k = (1 to 20).toList
val k: List[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20)

scala> k.map(x => x*x)
val res5: List[Int] = List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400)

scala> val conjuntoSalvaje = Set(1,2,2,3,21,312,321,3,12)
val conjuntoSalvaje: scala.collection.immutable.Set[Int] = HashSet(321, 21, 2, 12, 3, 1, 312)

scala> conjuntoSalvaje.map(x => x +2)
val res6: scala.collection.immutable.Set[Int] = HashSet(5, 14, 323, 3, 314, 23, 4)

scala> mapa.map(x => x._1 -> (x._2+"hola"))
val res12: scala.collection.immutable.Map[String,String] = Map(Col -> Boghola, Ven -> Carahola, Peru -> Limahola)
```

# Filter

Filter toma una colección y nos retorna una colección con los elementos que cumplen criterio, la función a aplicar debe retornar un **booleano**

```scala
scala> l
val res20: scala.collection.immutable.Set[Int] = Set(1, 2, 3, 5)

scala> l filter (x => x >= 3)
val res21: scala.collection.immutable.Set[Int] = Set(3, 5)

scala> mapa
val res25: scala.collection.immutable.Map[String,String] = Map(Col -> Bog, Ven -> Cara, Peru -> Lima)

scala> mapa filter (x => x._2 >= "C")
val res26: scala.collection.immutable.Map[String,String] = Map(Ven -> Cara, Peru -> Lima)
```

# Reduce

Tomar una colección y reducirla (operar los elementos) para obtener un valor de salida

- reduceLeft
- reduceRight

List(1,2,3,4,5,6)

Con `reduceLeft` y `reduceRight`, los elementos de la lista son combinados paso a paso usando una función binaria. La diferencia principal radica en cómo se asocian los elementos:

### `reduceLeft`

En `reduceLeft`, la operación comienza desde el primer elemento y avanza hacia la derecha. Para la lista `List(1,2,3,4,5,6)` y una función binaria `(x, y) => x + y`, el proceso sería:

1. ((1 + 2) + 3) + 4) + 5) + 6
2. (3 + 3) + 4) + 5) + 6
3. 6 + 4) + 5) + 6
4. 10 + 5) + 6
5. 15 + 6
6. Resultado final: 21

### `reduceRight`

En `reduceRight`, la operación comienza desde el último elemento y avanza hacia la izquierda. Para la misma lista y función binaria `(x, y) => x + y`, el proceso sería:

1. 1 + (2 + (3 + (4 + (5 + 6))))
2. 1 + (2 + (3 + (4 + 11)))
3. 1 + (2 + (3 + 15))
4. 1 + (2 + 18)
5. 1 + 20
6. Resultado final: 21

### Diferencias clave

Ambos métodos producen el mismo resultado para operaciones conmutativas como la suma. Sin embargo, para operaciones no conmutativas, como la resta, los resultados pueden diferir:

- `reduceLeft` para `List(1,2,3,4,5,6)` y `(x, y) => x - y`:
    - ((((1 - 2) - 3) - 4) - 5) - 6 = -19
- `reduceRight` para `List(1,2,3,4,5,6)` y `(x, y) => x - y`:
    - 1 - (2 - (3 - (4 - (5 - 6)))) = 3

```scala
scala> us
val res33: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67,
 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100)

scala> us reduceLeft ((acc,x) => acc + x)
val res34: Int = 5050

scala> us reduceRight ((acc,x) => acc + x)
val res35: Int = 5050
```

Limitación: No trabaja sobre colecciones vacías

# Fold

- FoldLeft
- FoldRight

### `foldLeft` con `Array(1,2,3,4,5,6)` y acumulador inicial `0`

En `foldLeft`, la operación comienza desde el acumulador inicial (en este caso, `0`) y avanza hacia la derecha, combinando cada elemento con el acumulador actual usando una función binaria. Para el caso de `(acc, x) => acc + x`:

1. Comenzamos con el acumulador inicial `0`.
2. (0 + 1) = 1
3. (1 + 2) = 3
4. (3 + 3) = 6
5. (6 + 4) = 10
6. (10 + 5) = 15
7. (15 + 6) = 21

**Resultado final:** `21`.

---

### `foldRight` con `Array(1,2,3,4,5,6)` y acumulador inicial `0`

En `foldRight`, la operación comienza desde el lado derecho de la colección, pero el acumulador inicial aún se usa al final. Para `(x, acc) => x + acc`:

1. El acumulador inicial es `0`.
2. (6 + 0) = 6
3. (5 + 6) = 11
4. (4 + 11) = 15
5. (3 + 15) = 18
6. (2 + 18) = 20
7. (1 + 20) = 21

**Resultado final:** `21`.

---

### Diferencias clave entre `foldLeft` y `foldRight`

Aunque ambos métodos producen el mismo resultado para operaciones conmutativas como la suma, el orden en que se combinan los elementos difiere:

- `foldLeft` asocia de izquierda a derecha: `(((0 + 1) + 2) + 3) + 4) + 5) + 6`.
- `foldRight` asocia de derecha a izquierda: `1 + (2 + (3 + (4 + (5 + (6 + 0)))))`.

En operaciones no conmutativas, como la resta, los resultados pueden diferir debido al orden de asociación.

```scala
(us foldLeft (0))_
val res52: ((Int, Int) => Int) => Int = $Lambda$2819/0x0000729cc8682c30@6f8ac388
```

Esto significa que nos retorna una función que espera una función con dos parametros que retorna un entero.

```scala
scala> (us foldRight (0))((acc:Int,x:Int) => acc+x)
val res53: Int = 5050
```

foldLeft y foldRight son funciones **currificadas** es decir siempre reciben un argumento, se requieren mas se retorna una función que espera un argumento y así hasta completar los argumentos.

## Ejemplos Prácticos

### Map

```scala
val numeros = List(1, 2, 3, 4, 5)
val cuadrados = numeros.map(x => x * x)
println(cuadrados) // List(1, 4, 9, 16, 25)

```

### Filter

```scala
val numeros = List(1, 2, 3, 4, 5)
val mayoresQueTres = numeros.filter(x => x > 3)
println(mayoresQueTres) // List(4, 5)

```

### ReduceLeft

```scala
val numeros = List(1, 2, 3, 4, 5)
val sumaTotal = numeros.reduceLeft((acc, x) => acc + x)
println(sumaTotal) // 15

```

### ReduceRight

```scala
val numeros = List(1, 2, 3, 4, 5)
val resta = numeros.reduceRight((x, acc) => x - acc)
println(resta) // 3 (1 - (2 - (3 - (4 - 5))))

```

### FoldLeft

```scala
val numeros = List(1, 2, 3, 4, 5)
val producto = numeros.foldLeft(1)((acc, x) => acc * x)
println(producto) // 120

```

### FoldRight

```scala
val numeros = List(1, 2, 3, 4, 5)
val restaConFold = numeros.foldRight(0)((x, acc) => x - acc)
println(restaConFold) // 3 (1 - (2 - (3 - (4 - (5 - 0)))))

```

---

## Ejercicios Sugeridos

1. Usa `map` para convertir una lista de palabras en mayúsculas.
2. Filtra una lista de números para quedarte solo con los pares.
3. Usa `reduceLeft` para encontrar el número más grande en una lista.
4. Usa `reduceRight` para concatenar una lista de cadenas en orden inverso.
5. Calcula el factorial de un número usando `foldLeft`.
6. Usa `foldRight` para invertir una lista.
7. Implementa una función con `filter` que devuelva los números primos de una lista.

¡Practica estos ejercicios para afianzar tus conocimientos y dominar las funciones de orden superior en Scala!

# Rangos

```scala
scala> (1 to 100)
val res66: scala.collection.immutable.Range.Inclusive = Range 1 to 100

scala> (1 until 100)
val res67: scala.collection.immutable.Range = Range 1 until 100

scala> (1 until 100).toArray
val res68: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99)

scala> (2 until 100).toArray
val res69: Array[Int] = Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99)

scala> (2 until 100 by 1).toArray
val res70: Array[Int] = Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99)

scala> (2 until 100 by 2).toArray
val res71: Array[Int] = Array(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98)

scala> (2 until 100 by 3).toArray
val res72: Array[Int] = Array(2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 83, 86, 89, 92, 95, 98)

scala> (100 to 1).toArray
val res73: Array[Int] = Array()

scala> (100 to 1 by -1).toArray
val res74: Array[Int] = Array(100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1)
```

## Otras funciones de alto orden

### forall, exists

```scala

scala> val l1 = List(1,2,3,4,5)
val l1: List[Int] = List(1, 2, 3, 4, 5)

scala> l1 forall (x => x%2 == 0)
val res75: Boolean = false

scala> List(2,4,6) forall (x => x%2 == 0)
val res76: Boolean = true

scala> Set(2,4,6,8) forall (x => x%2 == 0)
val res84: Boolean = true

scala> List(2,4,6) exists (x => x%2 == 0)
```

### zip

```scala
scala> val edad = List(10,20,15,20)
val edad: List[Int] = List(10, 20, 15, 20)

scala> val persona = List("Carlos", "Maria", "Sofia", "Juan")
val persona: List[String] = List(Carlos, Maria, Sofia, Juan)

scala> persona zip edad
val res86: List[(String, Int)] = List((Carlos,10), (Maria,20), (Sofia,15), (Juan,20))

scala> val edad = List(10,20,15,20,30)
val edad: List[Int] = List(10, 20, 15, 20, 30)

scala> persona zip edad
val res87: List[(String, Int)] = List((Carlos,10), (Maria,20), (Sofia,15), (Juan,20))

scala> (persona zip edad).unzip
val res88: (List[String], List[Int]) = (List(Carlos, Maria, Sofia, Juan),List(10, 20, 15, 20))

scala> val t = List(42.2,100.2,10.3,78.4)
val t: List[Double] = List(42.2, 100.2, 10.3, 78.4)

scala> persona zip edad zip t
val res89: List[((String, Int), Double)] = List(((Carlos,10),42.2), ((Maria,20),100.2), ((Sofia,15),10.3), ((Juan,20),78.4))

scala> persona.zip(edad,t)
                        ^
       error: too many arguments (found 2, expected 1) for method zip: (that: scala.collection.IterableOnce[B]): List[(String, B)]

scala> persona.zip(edad)
val res91: List[(String, Int)] = List((Carlos,10), (Maria,20), (Sofia,15), (Juan,20))

scala> (persona zip edad zip t)
val res92: List[((String, Int), Double)] = List(((Carlos,10),42.2), ((Maria,20),100.2), ((Sofia,15),10.3), ((Juan,20),78.4))
```

### Flatmap

Permite aplicar map con varios elementos, los cuales estén presentes en dos colecciones, retornando una sola colección 

```scala
scala> arr flatMap (x => arrB.map(y => y + x))
val res100: Array[Int] = Array(21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, ...

scala> arr map (x => arrB.map(y => y + x))
val res101: Array[Array[Int]] = Array(Array(21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41), Array(22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42), Array(23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43), Array(24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44), Array(25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45), Array(26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46), Array(27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47), Array(28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48), Array...

scala> val q = Array(Array(1,2,3),Array(2,3,4))
val q: Array[Array[Int]] = Array(Array(1, 2, 3), Array(2, 3, 4))

scala> q.flatten
val res102: Array[Int] = Array(1, 2, 3, 2, 3, 4)
```

# Introducción a expresiones for

```scala
object Ejercicio {
  def esPrimo(n:Int):Boolean = {
    (2 to Math.ceil(Math.sqrt(n)).toInt).forall(i => n%i !=0)
    //not (2 to Math.ceil(Math.sqrt(n)).toInt).exits(i => n%i == 0)
  }

  def generarSecuencia(n:Int):List[(Int,Int)] = {
    ((1 until n).toArray flatMap (
      j => (j + 1 until n).toArray.map(i => (i,j))
    )
  ).toList filter (a => esPrimo(a._1 + a._2))
  }

  def main(arr:Array[String]):Unit = {
    val n = 7
    println((1 to 10) map (x => esPrimo(x)))
    println(generarSecuencia(n))

    val res = for {
      j <- (1 until n)
      i <- (j+1 until n)
      if esPrimo(i+j)
    } yield i+j 

    println(res)
  }
}
```

Las expresiones `for` en Scala ofrecen una forma más legible y concisa de combinar las operaciones de `map`, `flatMap` y `filter`. En lugar de encadenar múltiples funciones, las expresiones `for` permiten estructurar el flujo de generación, transformación y filtrado de datos de manera más intuitiva. Esto es especialmente útil cuando se trabaja con combinaciones o estructuras anidadas.

### Ventaja de las expresiones `for` al combinar `map`, `flatMap` y `filter`

1. **Legibilidad mejorada:**
    - Las expresiones `for` permiten expresar operaciones complejas en un formato que se asemeja al pseudocódigo, lo que facilita su comprensión, incluso para quienes no están familiarizados con Scala.
    - En lugar de escribir `flatMap` y luego encadenarlo con `map` y `filter`, la expresión `for` organiza estas operaciones en un flujo lógico.
2. **Simplificación del código:**
    - Las expresiones `for` abstraen la sintaxis más técnica de `flatMap` y `map`, permitiendo centrarse en la lógica del problema en lugar de los detalles de implementación.
    - Esto reduce la cantidad de paréntesis y anidaciones, haciendo que el código sea más limpio.
3. **Composición flexible:**
    - Las expresiones `for` permiten combinar múltiples generadores (`j`, `i`) y aplicar condiciones (`if`) directamente dentro del bloque, lo que simplifica la construcción de combinaciones complejas.

### Combinatoria entre `j` e `i` al usarlos como generadores

En el código, los valores de `j` e `i` se generan mediante rangos, y su interacción crea todas las combinaciones posibles de pares `(i, j)` dentro de los límites establecidos. La lógica es la siguiente:

1. **Generador externo (`j`):**
    - `j` toma valores en el rango `(1 until n)`, lo que significa que comienza desde `1` y llega hasta `n-1`.
    - Por cada valor de `j`, se evalúan los valores correspondientes de `i`.
2. **Generador interno (`i`):**
    - `i` toma valores dentro del rango `(j+1 until n)`, asegurando que cada combinación `(i, j)` cumpla con la condición `i > j`.
    - Esto evita combinaciones redundantes, como `(2, 1)` y `(1, 2)`, ya que solo genera las combinaciones donde `i` es mayor que `j`.
3. **Filtrado (`if esPrimo(i + j)`):**
    - Después de generar los pares `(i, j)`, se filtran aquellos que cumplen la condición de que `i + j` sea un número primo.
    - Esto garantiza que el resultado final solo contenga pares válidos según la lógica del problema.

### Ejecución de la expresión `for`

El bloque `for`:

```scala
for {
  j <- (1 until n)
  i <- (j + 1 until n)
  if esPrimo(i + j)
} yield i + j

```

Se traduce internamente a una combinación de `flatMap`, `map` y `filter`:

1. **`flatMap`:** Genera todas las combinaciones posibles de `j` e `i`.
    - Para cada valor de `j`, genera un nuevo conjunto de valores para `i`.
2. **`map`:** Aplica la transformación `i + j` a cada combinación `(i, j)`.
3. **`filter`:** Retiene solo aquellas combinaciones donde `i + j` es primo.

### Ejemplo práctico

Para `n = 7`, la generación y filtrado de combinaciones sigue este flujo:

1. `j = 1`, `i` toma valores de `2` a `6` → Pares generados: `(2, 1), (3, 1), (4, 1), (5, 1), (6, 1)`.
2. `j = 2`, `i` toma valores de `3` a `6` → Pares generados: `(3, 2), (4, 2), (5, 2), (6, 2)`.
3. Se continúa con el resto de valores de `j`.
4. Se filtran los pares donde `i + j` es primo.

### Resultado

El uso de expresiones `for` permite expresar este flujo de manera más clara y directa, mejorando la legibilidad y manteniendo la lógica del código fácil de entender. Esto es especialmente útil cuando se trabaja con combinaciones o con lógica compleja que involucra múltiples pasos de transformación y filtrado.

# Resumen

### Aspectos más importantes:

1. **Colecciones en Scala:**
    - **Listas:** Inmutables y definidas de forma recursiva. Ejemplo: `List(1,2,3)`.
    - **Tuplas:** Inmutables, permiten acceder a elementos específicos mediante índices (`_1`, `_2`).
    - **Arrays:** Secuenciales e inmutables, con acceso por índice (`arr(0)`).
    - **Conjuntos (Sets):** Inmutables, sin orden de acceso y sin elementos repetidos.
    - **Maps:** Pares llave-valor inmutables, con acceso utilizando la llave.
    - **Vectores:** Inmutables, pero con capacidad de variar su tamaño.
2. **Funciones de alto orden:**
    - **Map:** Aplica una función a todos los elementos de una colección, devolviendo una nueva colección.
    - **Filter:** Filtra elementos que cumplen un criterio, devolviendo una colección más pequeña.
    - **Reduce:** Combina elementos de una colección en un único valor utilizando operaciones específicas (`reduceLeft` y `reduceRight`).
    - **Fold:** Similar a `reduce`, pero requiere un valor inicial del acumulador (`foldLeft` y `foldRight`).
    - **FlatMap:** Combina `map` y `flatten`, aplanando los resultados en una sola colección.
3. **Rangos y funciones adicionales:**
    - Scala permite crear rangos (`1 to 100`, `1 until 100`) y manipularlos fácilmente.
    - Funciones como `forall`, `exists`, `zip`, y `flatMap` ofrecen una forma poderosa de trabajar con colecciones.

### Características, ventajas y desventajas:

- **Características:**
    - Scala favorece la inmutabilidad, promoviendo código más seguro y predecible.
    - Soporte para funciones de alto orden, currificación y programación funcional.
    - Uso eficiente de colecciones mediante métodos predefinidos.
- **Ventajas:**
    - Las colecciones inmutables reducen errores al evitar modificaciones inesperadas.
    - Operaciones como `map`, `filter` y `reduce` hacen que el código sea más expresivo y conciso.
    - La currificación permite estructurar funciones de manera modular.
- **Desventajas:**
    - Puede ser complejo para principiantes debido a la densidad del concepto.
    - Algunos métodos no funcionan con colecciones vacías (`reduce`).
    - La sintaxis funcional puede ser intimidante para quienes vienen de paradigmas imperativos.

### Mensaje de motivación:

¡No te desanimes! Scala puede parecer desafiante al principio, pero recuerda que dominar estas herramientas te preparará para resolver problemas de manera eficiente y elegante. Piensa en esto como aprender a usar herramientas avanzadas que te permitirán escribir menos código y lograr más. Tal vez aún no veas cómo aplicar esto, pero el mundo de la programación funcional está lleno de oportunidades, desde la creación de sistemas robustos hasta el análisis de datos. ¡Tú puedes! La clave está en practicar poco a poco y darte el tiempo necesario para comprender los conceptos. ¡El esfuerzo vale la pena y te hará destacar como programador! 🚀