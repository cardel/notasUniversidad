// Fibonacci con dos llamadas recursivas por vuelta: recursion de arbol.
// Cada llamada abre dos, y la de la derecha no arranca hasta que la de
// la izquierda devuelve.

object Fibonacci {

  def fibonacci(n: Int): Int = {
    if (n <= 1) n
    else fibonacci(n - 1) + fibonacci(n - 2)
  }

  def main(args: Array[String]): Unit = {
    println(s"fibonacci(5) = ${fibonacci(5)}")
    println(s"fibonacci(6) = ${fibonacci(6)}")
  }
}
