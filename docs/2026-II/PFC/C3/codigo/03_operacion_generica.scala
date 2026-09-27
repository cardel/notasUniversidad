// Quedan tres huecos: f, qué se le hace a cada término; g, cómo se pasa
// al siguiente; h, cómo se combinan los resultados. Con h cambiando de
// suma a multiplicación, el valor de arranque ya no puede ser fijo.

import scala.annotation.tailrec

object OperacionGenerica {

  def sumaGenericaV2(n: Int, f: Int => Int, g: Int => Int): Int = {
    @tailrec
    def aux(a: Int, b: Int, acc: Int): Int = {
      if (a > b) acc
      else aux(g(a), b, f(a) + acc)
    }
    aux(1, n, 0)
  }

  def operacionGenerica(n: Int, f: Int => Int, g: Int => Int, h: (Int, Int) => Int): Int = {
    @tailrec
    def aux(a: Int, b: Int, acc: Int): Int = {
      if (a > b) acc
      else aux(g(a), b, h(f(a), acc))
    }
    val neutro = if (h(0, 1) == 0) 1 else 0
    aux(1, n, neutro)
  }

  def identidad(x: Int): Int = x
  def cuadrado(x: Int): Int = x * x
  def suc(n: Int): Int = n + 1
  def dosEnDos(n: Int): Int = n + 2
  def suma(a: Int, b: Int): Int = a + b
  def mul(a: Int, b: Int): Int = a * b

  def main(args: Array[String]): Unit = {
    println(sumaGenericaV2(15, identidad, suc))       // 1 + 2 + ... + 15
    println(sumaGenericaV2(15, identidad, dosEnDos))  // 1 + 3 + 5 + ... + 15
    println(sumaGenericaV2(15, cuadrado, dosEnDos))   // 1 + 9 + 25 + ... + 225

    println(operacionGenerica(15, identidad, suc, suma))
    println(operacionGenerica(15, identidad, suc, mul))  // 15! no cabe en un Int
  }
}
