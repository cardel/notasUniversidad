El reconocimiento de patrones lo podemos utilizar con números, booleanos, objetos y con listas

```scala
import scala.annotation.tailrec
object Listas {
  @tailrec
  final def sumar(l:List[Int])(acc:Int):Int = {
    l match {
      case List() => acc
      case h :: t => sumar(t)(h + acc)
      case _ => throw new Exception("This is not a list")
    }
  }

  def cuadrado(l:List[Int])(acc:List[Int]):List[Int] = {
    l match {
      case List() => acc
      case h :: t => cuadrado(t)(acc :+ h*h)
    }
  }

def mapeo(l:List[Int])(f: Int => Int)(acc:List[Int]):List[Int] = {
    l match {
      case List() => acc
      case x :: xs => mapeo(xs)(f)(acc :+ f(x))

    }

  }


  def filtro(l:List[Int])(f:Int => Boolean)(acc:List[Int]):List[Int] = {
    l match {
      case List() => acc
      case h :: t => {
          if (f(h)) filtro(t)(f)(acc :+ h)
          else filtro(t)(f)(acc)
      }

    }

  }
  def main(arr:Array[String]):Unit = {
    val l = List(1,2,3,4,5)
    println(sumar(l)(0))
    println(cuadrado(l)(List()))
    println(mapeo(l)(x => x*x)(List()))
    println(l.map(x=>x*x))
    println(mapeo(l)(x => x*x*x)(List()))
    println(l.map(x => x*x*x))
    println(filtro(l)(x => x%2 == 0)(List()))
    println(l.filter(x => x%2 == 0))
  }

}
```

En el caso de listas usamos los siguientes patrones:

1. List() para reconocer la lista vacia
2. h :: t para reconocer las listas no vacias, en el cual h es la cabeza y t es la cola

Revisar https://docs.scala-lang.org/tour/pattern-matching.html