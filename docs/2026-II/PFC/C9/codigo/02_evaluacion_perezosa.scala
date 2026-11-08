// Evaluacion perezosa: la coleccion se calcula por demanda.
// El problema que la motiva: el segundo primo entre 1000 y 10000.

object EvaluacionPerezosa {

  def esPrimo(n: Int): Boolean =
    n >= 2 && (2 to Math.sqrt(n).toInt).forall(n % _ != 0)

  def rangoPerezoso(inicio: Int, fin: Int): LazyList[Int] =
    if (inicio > fin) LazyList.empty
    else inicio #:: rangoPerezoso(inicio + 1, fin)

  def naturales(n: Int): LazyList[Int] =
    if (n < 0) LazyList.empty
    else n #:: naturales(n + 1)

  def criba(n: Int): LazyList[Int] =
    if (n < 2) LazyList.empty
    else n #:: criba(n + 1).filter(_ % n != 0)

  def main(args: Array[String]): Unit = {
    val primos = (1000 to 10000).filter(esPrimo)
    println(primos(1))

    val primosPerezosos = rangoPerezoso(1000, 10000).filter(esPrimo)
    println(primosPerezosos)
    println(primosPerezosos(1))
    println(primosPerezosos)

    val nat = naturales(0)
    println(nat)
    println(nat(10))
    println(nat)

    val cri = criba(2)
    println(cri)
    println(cri(10))
    println(cri)
  }
}
