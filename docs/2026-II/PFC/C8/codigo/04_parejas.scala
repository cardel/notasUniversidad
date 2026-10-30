// Parejas (i, j) con i < j cuya suma es prima. Dos generadores y un
// filtro: el segundo generador arranca donde va el primero, y así no
// se repite la misma pareja al revés.

object Parejas {

  def esPrimo(n: Int): Boolean =
    n >= 2 && (2 to Math.sqrt(n).toInt).forall(x => n % x != 0)

  def generadorFor(n: Int): Seq[(Int, Int)] = {
    for {
      i <- 1 to n
      j <- i + 1 to n
      if esPrimo(i + j)
    } yield (i, j)
  }

  def generadorMap(n: Int): Seq[(Int, Int)] =
    (1 to n).flatMap(i =>
      (i + 1 to n).filter(j => esPrimo(i + j)).map(j => (i, j)))

  def main(args: Array[String]): Unit = {
    println(generadorFor(10))
    println(generadorFor(10) == generadorMap(10))
  }
}
