
Las listas son una estructura recursiva, la cual esta compuesta por dos cosas

1. Un elemento (head)
2. Una cola (tail) que es una Lista

El caso base de las listas son la lista vacia

El operador para definir listas es cons (::)

```scala
scala> 1 :: 2 :: 3 :: 4 :: List()
val res1: List[Int] = List(1, 2, 3, 4)
```
Este operador es **asociativo a la derecha**
```scala
scala> (1 :: (2 :: (3 :: (4 :: List()))))
val res1: List[Int] = List(1, 2, 3, 4)
```
![](attachments/Pasted%20image%2020250923074228.png)

Siempre tener presente que el operador ::

1. Recibe un elemento y una lista, está en notación infija
2. Es asociativo a la derecha

# Operaciones
Dado x como una Lista tenemos

1. x. head retorna la cabeza
2. x.tail retorna la cola (lista)
3. x.length retorna el tamaño
4. x.splitAt(n) retorna dos listas la primera cn los n primer elementos y la segunda con el resto 
```scala
scala> val x = List(1,2,3,4,5,6)
val x: List[Int] = List(1, 2, 3, 4, 5, 6)

scala> x.splitAt(3)
val res6: (List[Int], List[Int]) = (List(1, 2, 3),List(4, 5, 6))
```
5. x.drop(n) elimina los primeros n elementos
6. x.take(n) retorna una lista con los primero n elementos
7. x(3) retorna el cuarto elemento, x.tail.tail.tail.head
8. ++ concatena dos listas
9. +. inserta un elemento al final

Otra información:

1. https://docs.scala-lang.org/overviews/scala-book/list-class.html
2. https://www.scala-lang.org/api/current/scala/collection/immutable/List.html

# Como trabajar listas

Las vamos a trabajar de forma recursiva, asumiendo que el caso base es la lista vacia

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
  
  @tailrec
  final def cuadrado(l:List[Int])(acc:List[Int]):List[Int] = {
    if (l.isEmpty) acc
    else cuadrado(l.tail)(acc ++ List(l.head*l.head)) 
  }

  def main(args: Array[String]):Unit = {
    val l = List(1,2,3,4,5)
    println(suma(l))
    println(cuadrado(l)(List()))
  }
}
```
