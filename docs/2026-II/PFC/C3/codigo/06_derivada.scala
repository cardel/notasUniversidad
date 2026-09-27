// Recibe una función y devuelve otra: la derivada aproximada con un paso
// fijo. El paso no puede ser cero, y cualquier paso mayor deja residuo.

object Derivada {

  def cubo(x: Double): Double = x * x * x

  def derivada(f: Double => Double): Double => Double =
    (x: Double) => (f(x + 0.001) - f(x)) / 0.001

  def main(args: Array[String]): Unit = {
    println(derivada(cubo)(1))   // 3x^2 en 1 vale 3
    println(derivada(cubo)(2))   // en 2 vale 12
    println(derivada(cubo)(3))   // en 3 vale 27
  }
}
