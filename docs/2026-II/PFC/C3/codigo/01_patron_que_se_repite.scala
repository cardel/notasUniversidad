// Tres funciones que suman o multiplican de 1 a n, cada una con su
// acumulador y su recursión de cola. Lo que cambia entre ellas cabe en
// una línea; el resto es el mismo esqueleto copiado tres veces.

import scala.annotation.tailrec

object PatronQueSeRepite {

  def sumar(n: Int): Int = {
    @tailrec
    def sumarAux(n: Int, acc: Int): Int = {
      if (n == 0) acc
      else sumarAux(n - 1, acc + n)
    }
    sumarAux(n, 0)
  }

  def sumarCuadrado(n: Int): Int = {
    @tailrec
    def sumarAux(n: Int, acc: Int): Int = {
      if (n == 0) acc
      else sumarAux(n - 1, acc + n * n)
    }
    sumarAux(n, 0)
  }

  def producto(n: Int): Int = {
    @tailrec
    def productoAux(n: Int, acc: Int): Int = {
      if (n == 0) acc
      else productoAux(n - 1, acc * n)
    }
    productoAux(n, 1)
  }

  def main(args: Array[String]): Unit = {
    println(sumar(10))          // 1 + 2 + ... + 10
    println(sumarCuadrado(10))  // n(n+1)(2n+1)/6 = 10*11*21/6
    println(producto(10))       // 10!
  }
}
