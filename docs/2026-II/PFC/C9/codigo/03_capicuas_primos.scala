// El ejercicio de la sesion: los numeros que se leen igual al derecho y al
// reves y que ademas son primos, como flujo infinito.

object CapicuasPrimos {

  def esPrimo(n: Int): Boolean = n >= 2 && ((2 until n) forall (n % _ != 0))

  def enterosDesde(n: Int): LazyList[Int] = n #:: enterosDesde(n + 1)

  def esCapicua(n: Int): Boolean = n.toString == n.toString.reverse

  val capicuaPrimo: LazyList[Int] = enterosDesde(0).filter(esCapicua).filter(esPrimo)

  def main(args: Array[String]): Unit = {
    println((1 to 20).filter(esCapicua).toList)
    println(capicuaPrimo.take(10).toList)
    println(capicuaPrimo(20))
    println(capicuaPrimo)
  }
}
