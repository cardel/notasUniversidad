Fold resuelve las limitaciones del reduce

1. Permite setear el acumulador, por lo tanto podemos trabajar con listas vacias
2. Permite trabajar transformaciones de tipos, por ejemplo sumar los tamaños de una lista de string
```scala
scala> List("Hola","Mundo","Cruel") reduceLeft ((acc,x) => acc + x.length)
val res5: String = Hola55

scala> List("Hola","Mundo","Cruel") reduceRight ((acc,x) => acc + x.length)
val res6: String = Hola6

scala> (List("Hola","Mundo","Cruel") foldLeft 0) _
val res7: ((Int, String) => Int) => Int = $Lambda$2624/0x00007f5f0c645218@193792e6
```
El foldLeft y foldRight retornar un reduce con el acc seteado

```scala
scala> (List("Hola","Mundo","Cruel") foldLeft 0) ( (acc,x) => x.length+acc)
val res11: Int = 14
```

# Implementación

```scala
import scala.annotation.tailrec

object Reducir {
  
  //FoldLeft
  def foldir[U,V](l:List[U])(acc:V)(f: (V,U) => V):V = {
    @tailrec
    def foldirI(l:List[U])(acc:V):V = {
      l match {
        case Nil => acc  // Lista vacía, retorna acumulador
        case x :: xs => foldirI(xs)(f(acc,x))  // Aplica función y recursión tail
      }
    }
    foldirI(l)(acc)  // Inicia recursión con acumulador proporcionado
  }

	// FoldRight
  def foldeR[U,V](l:List[U])(acc:V)(f : (U,V)=>V):V = {
    l match {
      case Nil => acc  // Caso base: lista vacía
      case x :: xs => f(x, foldeR(xs)(acc)(f))  // Recursión hacia atrás
    }
  }

  def main(args: Array[String]): Unit = {
    // Pruebas con foldir (foldLeft personalizado)
    println(foldir[Int,Int](List(1,2,3))(0)((acc,x) => acc+x))  // Suma: 0+1+2+3 = 6
    println(foldir[Int,Int](List(1,2,3,4))(0)((acc,x) => acc*x))  // Multiplicación: 0*1*2*3*4 = 0
  
    // Comparación resta con foldLeft (mismo orden)
    println(foldir[Int,Int](List(1,2,3,4))(0)((acc,x) => acc-x))  // ((0-1)-2)-3)-4 = -10
    println((List(1,2,3,4) foldLeft 0)((acc,x) => acc-x))  // Mismo resultado: -10
  
    // Comparación resta con foldRight (orden diferente)
    println(foldeR[Int,Int](List(1,2,3,4))(0)((acc,x) => acc-x))  // 1-(2-(3-(4-0))) = -2
    println((List(1,2,3,4) foldRight 0) ((acc,x) => acc-x))  // Mismo resultado: -2

    // Ejemplos con tipos diferentes (String -> Int)
    println((List("Hola","Mundo","Cruel") foldLeft 0) ( (acc,x) => x.length+acc))  // Suma longitudes: 4+5+5 = 14
    println(foldir[String,Int](List("Hola","Mundo","Cruel"))(0)( (acc,x) => x.length+acc))  // Mismo resultado: 14
  }
}
```