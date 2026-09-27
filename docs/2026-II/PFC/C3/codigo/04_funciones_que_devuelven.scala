// El resultado ya no es un entero sino una función. sumador(10) fabrica
// la función que suma diez, y hace falta aplicarla otra vez para llegar
// al número.

object FuncionesQueDevuelven {

  def sumador(n: Int): Int => Int = (x: Int) => x + n

  def suma(a: Int, b: Int): Int = a + b

  def sumaR(a: Int): Int => Int = {
    (b: Int) => a + b
  }

  def main(args: Array[String]): Unit = {
    println(sumador(10))        // la referencia de la función, no un entero
    println(sumador(10)(15))

    println(suma(5, 1))
    println(suma(5, 11))

    val sumaCinco = sumaR(5)
    println(sumaCinco(1))
    println(sumaCinco(11))
    println(sumaCinco(18))
  }
}
