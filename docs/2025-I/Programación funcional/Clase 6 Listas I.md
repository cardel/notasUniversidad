# Clase 6: Listas I

# Descomposición del diseño de datos

DIseño tradicional

1. Trait

```scala
trait Expr {
  def esNumero: Boolean
  def esSuma: Boolean
  def esMult: Boolean
  def defNum: Int
  def opIzq: Expr
  def opDer: Expr
}
```

2. Clases (Suma, Numero, etc)

```scala
class Suma(e1:Expr, e2:Expr) extends Expr {
  def esNumero = false
  def esSuma = true
  def esMult = false
  def defNum = throw new Error("No es un número")
  def opIzq = e1
  def opDer = e2
}
```

3. método que las usa

```scala
  def eval(e:Expr):Int = {
    if (e.esNumero) e.defNum
    else if (e.esSuma) eval(e.opIzq) + eval(e.opDer)
    else if (e.esMult) eval(e.opIzq) * eval(e.opDer)
    else throw new Error("No es una expresion definida")
  }
```

¿Cual el problema del diseño? Para extenderlo se requiere crear más clases y editar las actuales, además el condicional debe rediseñanse

Diseño con case class

1. Diseñar el trait y las case clase

```scala
trait Expr
  case class Numero(val valor: Int) extends Expr
  case class Suma(val expr1: Expr, val expr2: Expr) extends Expr
  case class Resta(val expr1: Expr, val expr2: Expr) extends Expr
  case class Multiplicacion(val expr1: Expr, val expr2: Expr) extends Expr
  case class Division(val expr1: Expr, val expr2: Expr) extends Expr
  case class Potencia(val expr1: Expr, val expr2: Expr) extends Expr

```

2. Diseñamos la función que utiliza la expresión usando reconocimiento de patrones

```scala
  def eval(e: Expr): Int = e match {
    case Numero(n:Int) => n
    case Suma(e1, e2) => eval(e1) + eval(e2)
    case Resta(e1, e2) => eval(e1) - eval(e2)
    case Multiplicacion(e1, e2) => eval(e1) * eval(e2)
    case Division(e1, e2) => eval(e1) / eval(e2)
    case Potencia(e1, e2) => Math.pow(eval(e1), eval(e2)).toInt
  
  }

```

# Listas

Definiciones

|

- Son recursivas e inmutables
- Dos casos
    - Caso base: Nil
    - Caso recursivo: x :: xs
- Trabajarlas con funciones recursivas, preferiblemente con reconocimiento de patrones

```scala
import scala.annotation.tailrec

object Main {

  def sumaLista(l:List[Int]): Int = {
    l match {
      case Nil => 0
      case x::xs => x + sumaLista(xs)
    }
  }

  @tailrec
  final def sumaListaTailR(l:List[Int], acc:Int = 0):Int = {
    l match{
      case Nil => acc
      case x::xs => sumaListaTailR(xs, acc + x)
    }
  }

  @tailrec
  final def cuadradoLista(l:List[Int], acc:List[Int] = Nil):List[Int] = {
    l match {
      case Nil => acc
      case x::xs => cuadradoLista(xs, acc :+ x*x)
    }
  }
  
  @tailrec
  final def sumaListas(listaA:List[Int], listaB:List[Int], acc:List[Int] = Nil):List[Int] = {
    listaA match {
      case Nil => acc
      case x::xs => listaB match {
        case Nil => acc
        case y::ys =>  sumaListas(xs,ys, acc :+ (x + y))
      }
    }
  }

  @tailrec
  final def sumaListasPro(listaA:List[Int], listaB:List[Int], acc:List[Int] = Nil):List[Int] = {
    (listaA, listaB) match {
      case (Nil, Nil) => acc
      case (_, Nil) => throw new Exception("Las listas no tienen el mismo tamaño")
      case (Nil, _) => throw new Exception("Las listas no tienen el mismo tamaño")
      case (x::xs, y::ys) => sumaListasPro(xs,ys, acc :+ (x + y))
    }
  }

  def main(args: Array[String]): Unit = {
    val l = List(1,2,3,4,5)
    println(sumaLista(l))
    println(sumaListaTailR(l))
    println(cuadradoLista(l))

    val la = List(1,2,3,4,5)
    val lb = List(1,2,3,4,5)
    println(sumaListas(la,lb))
    println(sumaListasPro(la,lb))
      
  }
}
```

```scala
scala> val l = List(1,2,3,3,4,4,4,4,4)
val l: List[Int] = List(1, 2, 3, 3, 4, 4, 4, 4, 4)

scala> l splitAt 2
val res0: (List[Int], List[Int]) = (List(1, 2),List(3, 3, 4, 4, 4, 4, 4))

scala> 1 :: 4 :: Nil
val res1: List[Int] = List(1, 4)

scala> (1 :: 4 :: Nil) :+ 3
val res2: List[Int] = List(1, 4, 3)

scala> (1 :: 4 :: Nil) :: 3 :: Nil
val res3: List[Any] = List(List(1, 4), 3)

scala> (1 :: 4 :: 3 :: Nil) . tail
val res5: List[Int] = List(4, 3)

scala> List(1,2,3,4)
val res8: List[Int] = List(1, 2, 3, 4)

scala> val a = 1 :: 2 :: 3 :: 4 :: Nil
val a: List[Int] = List(1, 2, 3, 4)

scala> a.head
val res9: Int = 1

scala> a.tail
val res10: List[Int] = List(2, 3, 4)

scala> a.tail.head
val res11: Int = 2

scala> a.tail.tail
val res12: List[Int] = List(3, 4)

scala> a.tail.tail.head
val res13: Int = 3

scala> a.tail.tail.tail
val res14: List[Int] = List(4)

scala> a.tail.tail.tail.head
val res15: Int = 4

scala> a.tail.tail.tail.tail
val res16: List[Int] = List()

scala> a.tail.tail.tail.tail.tail
java.lang.UnsupportedOperationException: tail of empty list
  at scala.collection.immutable.Nil$.tail(List.scala:665)
  at scala.collection.immutable.Nil$.tail(List.scala:662)
  ... 34 elided

scala> a.tail.tail.tail.tail.head
java.util.NoSuchElementException: head of empty list
  at scala.collection.immutable.Nil$.head(List.scala:663)
  at scala.collection.immutable.Nil$.head(List.scala:662)
  ... 34 elided
  
scala> a
val res19: List[Int] = List(1, 2, 3, 4)

scala> a.drop(3)
val res20: List[Int] = List(4)

scala> a.take(2)
val res21: List[Int] = List(1, 2)

scala> a splitAt 2
val res22: (List[Int], List[Int]) = (List(1, 2),List(3, 4))

scala> a.reverse
val res23: List[Int] = List(4, 3, 2, 1)

scala> a.init
val res24: List[Int] = List(1, 2, 3)

scala> a.length
val res25: Int = 4

scala> a :+ 3
val res26: List[Int] = List(1, 2, 3, 4, 3)

scala> a ++ a
val res27: List[Int] = List(1, 2, 3, 4, 1, 2, 3, 4)
```

# Ejercicio

Ejercicio

1. Función que tome dos listas y retorne la inversa de la concatenación, ejemplo

ejercicio1(List(1,2,3), List(4,5,6)
Retorna List(6,5,4,3,2,1) tener presente sólo recursión

1. Función que genere la lista de factoriales desde 0! hasta n!
ejemplo
ejercicio2(5) retorna List(1,1,2,6,24,120)

```scala
import scala.annotation.tailrec

object Main {
  /**
   * Función toma dos listas y retorna la concatenación invertida
  * @lista1: List[Int]
  * @lista2: List[Int]
  * @return: List[Int]
  */
  @tailrec
  final def concatenarInvertido(lista1: List[Int], lista2: List[Int], acc:List[Int]=Nil): List[Int] = {
    (lista1, lista2) match {
      case (Nil, Nil) => acc
      case (x::xs, _) => concatenarInvertido(xs, lista2, acc :+ x)
      case (Nil, y::ys) => concatenarInvertido(Nil, ys, acc :+ y)
    }
  }

  /**
   * Función para generar el factorial de un número
  * @param n: Int
  * @return: Int
  */
  @tailrec
  final def factorial(n:Int, acc:Int=1): Int = {
    if (n == 0) acc
    else factorial(n-1, n*acc)
  }

  /**
   * Función para obtener la lista de factorial desde 0 hasta n
   * @param n:Int
  * @return: List[Int]
  */
  @tailrec
  final def listaFactoriales(n:Int, i:Int = 1, acc:List[Int]=List(1)): List[Int] = {
    if (n < i) acc
    else listaFactoriales(n, i+1, acc :+ factorial(i))
      
  }

  def main(arg:Array[String]): Unit = {
    val lista1 = List(1, 2, 3)
    val lista2 = List(4, 5, 6)
    println(concatenarInvertido(lista1, lista2))
    println(listaFactoriales(5))
      
  }
}
```