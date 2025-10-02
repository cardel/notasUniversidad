Scala es una lenguaje fuertemente tipado, que debes enviar los tipos que esperan las funciones de forma exacta, de lo contrario va a fallar

Para esto vamos a parametrizar las funciones asi:

```scala
def funcion[T](....)
  ...
  
funcion[Int](...)
funcion[String](...)
funcion[List[String]] (....)
```

```scala
import scala.annotation.tailrec

object Tipos {
  
  def concatT[U,V](u:List[U])(v:List[V]):List[(U,V)] = {
    @tailrec
    def concatTI(u:List[U])(v:List[V])(acc:List[(U,V)]):List[(U,V)] = {
      (u,v) match {
        case (Nil,Nil) => acc  // Ambas listas vacías, retorna acumulador
        case (Nil,_) => throw new Exception("Las listas deben ser del mismo tamaño")
        case (_,Nil) => throw new Exception("Las listas deben ser del mismo tamaño")
        case (x::xs, y::ys) => concatTI(xs)(ys)(acc :+ (x,y))  // Agrega tupla al final de la lista
      }
    }
    concatTI(u)(v)(List())  // Inicia recursión con lista vacía
  }

  def main(arr:Array[String]):Unit = {
    println(concatT[Int,Int](List(1,2,3))(List(4,5,6)))  // List((1,4), (2,5), (3,6))
    println(concatT[Double,Double](List(1.2,2.3,3.4))(List(4.5,5.6,6.7)))  // Tuplas con doubles
    println(concatT[String,Int](List("a","b","c"))(List(1,2,3)))  // Tuplas con tipos diferentes
  }
}
```