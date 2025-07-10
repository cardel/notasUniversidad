# Clase 19 de Feb Listas

```scala

object patrones {

  def sumarLista(l:List[Int]):Int = {
    l match {
      case Nil => 0
      case x::xs => x + sumarLista(xs)
    }
  }

  def maxList(l:List[Int]):Int = {
    l match {
      case Nil => throw new RuntimeException("Lista vacía")
      case x::Nil => x
      case x::xs => {
        Math.max(x, maxList(xs))
      }
    }
  }

  def elevarCuadrado(l:List[Int]):List[Int] = {
    l match {
      case Nil => Nil
      case x::xs => x*x :: elevarCuadrado(xs)
    }
  }

  def main(l:Array[String]):Unit = {
    val l = List(1,2,3,4,5,6,7)
    println(sumarLista(l))
  }
}

```