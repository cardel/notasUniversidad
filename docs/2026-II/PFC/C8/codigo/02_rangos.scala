// Un rango guarda inicio, fin y paso, no sus elementos: por eso al
// imprimirlo se ve la descripción y no la lista.

object Rangos {

  def main(args: Array[String]): Unit = {
    println(2 to 8 by 2)             // Range 2 to 8 by 2
    println((2 to 8 by 2).toList)    // List(2, 4, 6, 8)
    println((2 until 8 by 2).toList) // List(2, 4, 6)
    println((2 to 8).toList)         // List(2, 3, 4, 5, 6, 7, 8)
    println((2 until 8).toList)      // List(2, 3, 4, 5, 6, 7)
  }
}
