Listas son estructuras de datos de un tipo,, List[T] donde T es un tipo.
Las listas tienen dos partes
1. Cabeza que es tipo T
2. Y una cola que es tipo List[T]
```scala
scala> val x = List(1,2,3)
val x: List[Int] = List(1, 2, 3)

scala> val y = List("a","b","c")
val y: List[String] = List(a, b, c)

scala> x.head
val res0: Int = 1

scala> x.tail
val res1: List[Int] = List(2, 3)
```
Por lo tanto como estructura recursiva, tenemos:
1. Caso base: List() o Nil
2. Caso recursivo:  Elemento::Lista


```scala
scala> 1 :: 2 :: 3 :: Nil
val res2: List[Int] = List(1, 2, 3)

scala> (1 :: (2 :: (3 :: Nil)))
val res3: List[Int] = List(1, 2, 3)

scala> (((1 :: 2) :: 3) :: Nil)
            ^
       error: value :: is not a member of Int
                  ^
       error: value :: is not a member of Int
```
Algunas otros metodos de listas
```scala
scala> x.length
val res5: Int = 3

scala> x.last
val res6: Int = 3

scala> x.take(2)
val res7: List[Int] = List(1, 2)

scala> x.drop(2)
val res8: List[Int] = List(3)

scala> x.splitAt(2)
val res9: (List[Int], List[Int]) = (List(1, 2),List(3))
```

# Trabajar listas

```scala
import scala.annotation.tailrec

object Listas {
  
  def suma(l:List[Int]):Int = {
    @tailrec
    def sumaR(l:List[Int])(acc:Int):Int = {
      if (l.isEmpty) acc
      else sumaR(l.tail)(l.head + acc)
    }
    sumaR(l)(0)
  }

  def main(arr:Array[String]):Unit = {
    val x = List(1,2,3,4,5)
    println(suma(x))
  }

}
```

Al trabajar listas se trabajan:
1. Con recursión
2. El caso base es la lista vacia
3. El caso recursivo debe llamar a la misma función con la cola de la lista