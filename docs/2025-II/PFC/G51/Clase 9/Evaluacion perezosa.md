
La evaluación perezosa es una técnica que permite calcular los valores a necesidad, es decir cuando se necesiten o requieran. Esto permite tener grandes cantidades de datos y no cargarlos en memoria.

Este caso vamos a trabajar una recursión infinita que genera los números naturales

```scala
object Ejemplo {
  
  def generador(n:Int = 0):LazyList[Int] = {
    LazyList.cons(n, generador(n+1))
  }
  def main(arr:Array[String]):Unit = {
    val lst = generador()
    println(lst)
    println(lst(3))
    println(lst)
    println(lst(9))
    println(lst)
    println(lst(4))
    println(lst)

  }
}
```

Al ejecutar encontramos

```bash
LazyList(0, 1, 2, 3, <not computed>)
9
LazyList(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, <not computed>)
4
LazyList(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, <not computed>)
```
Como se observa se está calculando la lista hasta el punto en que la necesito.

# Ejemplo

Podemos por ejemplo calcular el quinto elemento que cumple que $x^2 + y^2 + z^2 = w^2$ con los numeros naturales mayores que 0. 

```scala
object Reto {
  def generador(n:Int = 1):LazyList[Int] = {
    if (n >= 1000) LazyList.empty
    else LazyList.cons(n, generador(n+1))
  }

  def solucion():LazyList[(Int,Int,Int,Int)] = {
    for {
      x <- generador()
      y <- generador()
      z <- generador()
      w <- generador()
      if x*x + y*y +  z*z == w*w

    } yield (x,y,z,w)

  }
  def main(arr:Array[String]):Unit = {
    def sol = solucion()
    println(sol)
    println(sol(0))
    println(sol)
    println(sol(5))
    println(sol)
  }

}
```
