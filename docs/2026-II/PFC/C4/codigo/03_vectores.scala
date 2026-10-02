// El mismo esqueleto sobre otro dato. El constructor divide por la norma,
// y ahí la analogía con el racional deja de funcionar: dividir por el
// máximo común divisor no cambia el número, dividir por la norma sí
// cambia el vector.

class Vectores(a: Double, b: Double) {

  val x = a / norma(a, b)
  val y = b / norma(a, b)

  private def norma(x: Double, y: Double): Double = {
    Math.sqrt(x * x + y * y)
  }

  def suma(v: Vectores): Vectores = {
    new Vectores(this.x + v.x, this.y + v.y)
  }

  def resta(v: Vectores): Vectores = {
    new Vectores(this.x - v.x, this.y - v.y)
  }

  def mult(v: Vectores): Vectores = {
    new Vectores(this.x * v.x, this.y * v.y)
  }

  def +(v: Vectores): Vectores = this.suma(v)
  def -(v: Vectores): Vectores = this.resta(v)
  def *(v: Vectores): Vectores = this.mult(v)

  override def toString(): String = "(" + this.x + "," + this.y + ")"
}

object Vectores {

  def main(args: Array[String]): Unit = {
    val a = new Vectores(2, 3)
    val b = new Vectores(4, 5)
    val c = a.suma(b)

    println(a)
    println(b)
    println(c)
    println(a.resta(b))
    println(a.mult(b))

    // La precedencia la fija el símbolo, no el orden de lectura
    println(a * b + c)
    println(c + a * b)
    println((c + a) * b)
  }
}
