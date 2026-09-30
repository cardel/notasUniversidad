// El factorial escrito dos veces: la version que deja la multiplicacion
// esperando y la version que la hace antes de llamar. Las dos dan lo
// mismo; lo que cambia es cuantos marcos de pila hay abiertos al tiempo.

import scala.annotation.tailrec

object Factorial {

  // Recursion lineal: al volver de factorial(n - 1) todavia hay que
  // multiplicar por n, asi que ese marco no se puede cerrar.
  def factorial(n: Int): Int = {
    if (n == 0) 1
    else n * factorial(n - 1)
  }

  // Recursion de cola: el producto viaja en el acumulador y la llamada
  // es lo ultimo que se hace. @tailrec obliga al compilador a comprobarlo.
  def factorialTail(n: Int): Int = {

    @tailrec
    def factorial(n: Int, acc: Int): Int = {
      if (n == 0) acc
      else factorial(n - 1, n * acc)
    }

    factorial(n, 1)
  }

  def main(args: Array[String]): Unit = {
    println(s"factorial(5)     = ${factorial(5)}")
    println(s"factorialTail(5) = ${factorialTail(5)}")
    println(s"factorial(6)     = ${factorial(6)}")
    println(s"factorialTail(6) = ${factorialTail(6)}")
  }
}
