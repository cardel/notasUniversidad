// Un número es primo cuando ningún entero entre 2 y su raíz lo divide.
// Basta llegar a la raíz: si n tiene un divisor mayor que ella, el
// cociente es otro divisor menor, y ese ya se habría encontrado.

object EsPrimo {

  def esPrimo(n: Int): Boolean =
    n >= 2 && (2 to Math.sqrt(n).toInt).forall(x => n % x != 0)

  def main(args: Array[String]): Unit = {
    println((2 to Math.sqrt(17).toInt) map (x => 17 % x != 0))  // Vector(true, true, true)
    println((2 to Math.sqrt(22).toInt) map (x => 22 % x != 0))  // Vector(false, true, true)

    println(esPrimo(2))   // true
    println(esPrimo(3))   // true
    println(esPrimo(4))   // false

    println((1 to 21) map (x => (x, esPrimo(x))))
    println(for { i <- 1 to 100; if esPrimo(i) } yield i)
  }
}
