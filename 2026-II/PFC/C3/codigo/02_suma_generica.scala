// El término deja de estar escrito en el cuerpo y entra como parámetro:
// f dice qué se le hace a cada n. Las tres sumas anteriores pasan a ser
// tres llamadas a la misma función, con nombre o con literal.

import scala.annotation.tailrec

object SumaGenerica {

  def sumaGenerico(n: Int, f: Int => Int): Int = {
    @tailrec
    def sumarAux(n: Int, acc: Int): Int = {
      if (n == 0) acc
      else sumarAux(n - 1, acc + f(n))
    }
    sumarAux(n, 0)
  }

  def identidad(n: Int): Int = n
  def cuadrado(n: Int): Int = n * n
  def cubo(n: Int): Int = n * n * n

  def main(args: Array[String]): Unit = {
    println(sumaGenerico(10, identidad))
    println(sumaGenerico(10, cuadrado))
    println(sumaGenerico(10, cubo))

    println(sumaGenerico(10, (x: Int) => x))
    println(sumaGenerico(10, (x: Int) => x * x))
    println(sumaGenerico(10, (x: Int) => x * x * x))
  }
}
