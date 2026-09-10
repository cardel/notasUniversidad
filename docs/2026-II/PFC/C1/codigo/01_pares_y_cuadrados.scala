// La suma de los cuadrados de los pares, en las dos formas que se
// compararon en clase: acumulando y describiendo.

def paresHasta(n: Int): List[Int] = (2 to n by 2).toList

def cuadrado(x: Int): Int = x * x

def sumaCuadradosPares(n: Int): Int = paresHasta(n).map(cuadrado).sum

@main def demo(): Unit =
  println(s"paresHasta(10)          = ${paresHasta(10)}")
  println(s"cuadrados               = ${paresHasta(10).map(cuadrado)}")
  println(s"sumaCuadradosPares(10)  = ${sumaCuadradosPares(10)}")
  println(s"sumaCuadradosPares(100) = ${sumaCuadradosPares(100)}")

  // el error de sumar todos los enteros y no solo los pares
  val todos = (1 to 10).map(cuadrado).sum
  println(s"cuadrados de 1 a 10     = $todos")

  // division entera frente a division de flotantes
  println(s"1 / 3                   = ${1 / 3}")
  println(s"1.0 / 3                 = ${1.0 / 3}")
