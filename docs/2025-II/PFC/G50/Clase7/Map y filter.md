# Map
Es una función que recibe una colección y nos retorna la misma colección aplicando una transformación (funcion) a cada uno de los elementos de una lista

1. Elevar los elementos de una lista al cuadrado
2. Retornar la tamaños de una lista de strings
3. Retornar una lista de booleanos a partir de una lista de enteros en la cual quiero saber quienes son pares

```scala
scala> val x = List(1,2,3,4)
val x: List[Int] = List(1, 2, 3, 4)

scala> x.map(x => x*x)
val res4: List[Int] = List(1, 4, 9, 16)

scala> x.map(x => x % 2)
val res5: List[Int] = List(1, 0, 1, 0)

scala> x.map(x => x % 2 == 0)
val res6: List[Boolean] = List(false, true, false, true)
```

La función map permite no preocuparnos por los tipos
```scala
object Mapas {

  // Función genérica que aplica una función a cada elemento de una lista (implementación de map)
  def mapeo[U,V](l : List[U], f : U => V) : List[V] = {
    l match {
      case Nil => Nil  // Caso base: lista vacía retorna lista vacía
      case x :: xs => f(x) :: mapeo(xs, f)  // Aplica función al elemento cabeza y procesa recursivamente la cola
    }
  }

  // Función principal para demostrar el uso de la función mapeo
  def main(args: Array[String]): Unit = {
    val lista = List(1, 2, 3, 4, 5)  // Lista original de enteros
    
    // Ejemplo 1: Transformar cada número a su doble
    val resultado = mapeo[Int,Int](lista, (x: Int) => x * 2)
    println(resultado) // Debería imprimir List(2, 4, 6, 8, 10)
    
    // Ejemplo 2: Transformar cada número a string con formato
    var resultado2 = mapeo[Int,String](lista, (x: Int) => s"Número: $x")
    println(resultado2) // Debería imprimir List("Número: 1", "Número: 2", "Número: 3", "Número: 4", "Número: 5")
  }
}
```

# Filter

El filter es una función que nos permite tomar los elementos de una lista que cumplan una condición

1. Retornar los elementos de una lista que son pares
2. Retornar los elementos de una lista de string que tienen cierto tamaño
3. Retorna los elementos de una lista que son primos

```scala
scala> x
val res11: List[Int] = List(1, 2, 3, 4)

scala> x filter (_ % 2 == 0)
val res12: List[Int] = List(2, 4)
```

```scala
object Filtro {
  // Función genérica que filtra elementos de una lista según un predicado
  def filtrar[U](l : List[U], f : U => Boolean) : List[U] = {
    l match {
      case Nil => Nil  // Caso base: lista vacía retorna lista vacía
      case x :: xs => if (f(x)) x :: filtrar(xs, f) else filtrar(xs, f)  // Si cumple condición incluye elemento, sino continúa
    }
  }

  // Función principal para demostrar el uso de la función filtrar
  def main(args: Array[String]): Unit = {
    val lista = List(1, 2, 3, 4, 5)  // Lista original de enteros
    
    // Ejemplo 1: Filtrar números pares
    val resultado = filtrar[Int](lista, (x: Int) => x % 2 == 0)
    println(resultado) // Debería imprimir List(2, 4)
    
    // Ejemplo 2: Filtrar números mayores que 3
    var resultado2 = filtrar[Int](lista, (x: Int) => x > 3)
    println(resultado2) // Debería imprimir List(4, 5)
  }
}
```

A diferencia de map la transformación de filter conserva el tipo de lista.