// El punto de partida: representar un racional con Double. Un tercio no
// cabe exacto en 64 bits, así que lo que se guarda es una aproximación.

object RacionalesConDouble {

  def main(args: Array[String]): Unit = {
    val a: Double = 1 / 3.0
    val b: Double = 1 / 9.0

    println(a + b)
    println(4 / 9.0)
    println((a + b) == (4 / 9.0))

    // Dos sumas que deberían dar lo mismo y no lo dan
    println(0.1 + 0.2)
    println((0.1 + 0.2) == 0.3)
  }
}
