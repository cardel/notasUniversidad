# Map

Map es una función que toma una lista y nos retorna la lista con la aplicación de función a los elementos de la lista

1. Elevar al cuadrado los elementos de una lista de enteros
2. De una lista de string retornar los tamaños de cada uno

En general el map nos recibe una Lista de tipo U, una función de tipo U hacia V, y nos devuelve una Lista de tipo V

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

# Filter

El filtro es una función que toma una lista y retorna los elementos de esa lista que cumplen un criterio. Este criterio esta dado por una función predicado (recibe un elemento y nos retorna falso o verdadero)

1. Retornar la lista de los numeros pares
2. Retornar la lista de string cuyo tamaño sea mayor a 5

```scala
import scala.annotation.tailrec

object Filtro {
  
  def filtro[T](l:List[T])(f: T => Boolean):List[T] = {
    @tailrec
    def filtroI(l:List[T])(acc:List[T]):List[T] = {
      l match {
        case Nil => acc  // Lista vacía, retorna acumulador
        case x :: xs => if (f(x)) filtroI(xs)(acc :+ x) else filtroI(xs)(acc)  // Aplica filtro y recursión
      }
    }
    filtroI(l)(List())  // Inicia recursión con lista vacía
  }

  def main(arr: Array[String]):Unit = {
    println(filtro(List(1,2,3,4,5))(x => x%2 == 0))  // Filtra pares: List(2,4)
    println(filtro(List(1,2,3,4,5))(x => x > 3))  // Filtra mayores a 3: List(4,5)
    println(filtro(List("hola","mundo","cruel"))(x => x.length > 4))  // Filtra strings >4 chars: List("mundo","cruel")
    println(filtro(List("hola","mundo","cruel"))(x => x.length > 5))  // Filtra strings >5 chars: List("mundo")

    println(List(1,2,3,4,5) filter (x => x%2 == 0))  // Comparación con filter nativo
    println(List(1,2,3,4,5) filter (x => x > 3))  // Comparación con filter nativo
    println(List("hola","mundo","cruel") filter (x => x.length > 4))  // Comparación con filter nativo
    println(List("hola","mundo","cruel") filter (x => x.length > 5))  // Comparación con filter nativo
  }

}
```