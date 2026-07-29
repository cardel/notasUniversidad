Una tupla es una colección inmutable de datos del mismo tipo a diferencia de las listas estas **no son recursivas**

```scala
scala> (1,2)
val res0: (Int, Int) = (1,2)

scala> val x = (1,2,3,4)
val x: (Int, Int, Int, Int) = (1,2,3,4)

scala> x._1
val res1: Int = 1

scala> x._2
val res2: Int = 2
```

Las tuplas se utilizan en el reconocimiento de patrones, podemos utilizarlas para ligar valores a identificadores

```scala
scala> val (x,y) = (1,3)
val x: Int = 1
val y: Int = 3

scala> x
val res3: Int = 1

scala> y
val res4: Int = 3

scala> val (a,b,c) = (1,2,3)
val a: Int = 1
val b: Int = 2
val c: Int = 3
```

En general nos permite empaquetar valores y asignarlos directamente, permitendo mayor expresividad

# Tuplas en el reconocimiento de patrones

$$
\begin{aligned}
u = \{u_1,u_2,\ldots,u_n\} \\
v = \{v_1,v_2,\ldots,v_n\} \\
u.v = \{u_1*v_1 + u_2*v_2+\ldots+u_n*v_n\}
\end{aligned}
$$
Ejemplo
$$
\begin{aligned}
v = \{1,2,3\} \\ 
u = \{4,5,6\} \\
u.v = 4 + 10 + 18 = 32
\end{aligned}
$$

Hasta el momento para reconocer patrones de listas paralelas es necesario identificar el caso de la primera y luego evaluar el de la segunda, esto hace que el código no sea facil de mantener o entender.

```scala
import scala.annotation.tailrec
object ProductoPunto {
  
  def prod(u:List[Int])(v:List[Int]):Int = {
    @tailrec
    def prodI(u:List[Int])(v:List[Int])(acc:Int):Int = {
      u match {
        case Nil => v match {
          case Nil => acc  // Ambas listas vacías, retorna acumulador
          case _ => throw new Exception("Las listas deben ser el mismo tamaño")
        }
          case x :: xs => v match {
            case Nil => throw new Exception("La listas deben ser el mismo tamaño") 
            case y :: ys => prodI(xs)(ys)(x*y + acc) // Multiplica elementos y suma al acumulador
          }
      }
    }
    prodI(u)(v)(0) // Llama a la función interna con acumulador inicial 0

  }

  def main(arr:Array[String]):Unit = {
    val u = List(1,2,3)
    val v = List(4,5,6)
    println(prod(u)(v)) // Calcula producto punto: 1*4 + 2*5 + 3*6 = 32
  }

}
```
Ahora podemos usar tuplas para reconocer patrones de más de una variable al mismo tiempo, **evitando anidamientos**

```scala
import scala.annotation.tailrec
object ProductoPunto {
  
  def prod(u:List[Int])(v:List[Int]):Int = {
    @tailrec
    def prodI(u:List[Int])(v:List[Int])(acc:Int):Int = {
      (u,v) match {  // Pattern matching sobre el par de listas
        case (Nil,Nil) => acc  // Ambas vacías, retorna acumulador
        case (Nil,_) => throw new Exception("Las listas deben ser el mimo tamaño")
        case (_,Nil) => throw new Exception("Las listas del mismo tamaño")
        case (x :: xs, y :: ys) => prodI(xs)(ys)(x*y + acc) // Multiplica y suma recursivamente
      }
    }
    prodI(u)(v)(0)  // Inicia recursión con acumulador 0

  }

  def main(arr:Array[String]):Unit = {
    val u = List(1,2,3)
    val v = List(4,5,6)
    println(prod(u)(v))  // Calcula: 1*4 + 2*5 + 3*6 = 32
  }

}
```
