// El racional como dato: dos enteros y las operaciones adentro. El
// constructor normaliza con el máximo común divisor y exige denominador
// positivo; cada operación construye un racional nuevo.

class Racional(a: Int, b: Int) {

  require(b > 0, "El denominador debe ser positivo")

  val num = a / mcd(a, b)
  val den = b / mcd(a, b)

  private def mcd(a: Int, b: Int): Int = {
    if (b == 0) a
    else mcd(b, a % b)
  }

  def suma(r: Racional): Racional = {
    new Racional(this.num * r.den + this.den * r.num,
      this.den * r.den)
  }

  def resta(r: Racional): Racional = {
    new Racional(this.num * r.den - this.den * r.num,
      this.den * r.den)
  }

  def multiplicacion(r: Racional): Racional = {
    new Racional(this.num * r.num, this.den * r.den)
  }

  def +(r: Racional): Racional = this.suma(r)
  def -(r: Racional): Racional = this.resta(r)
  def *(r: Racional): Racional = this.multiplicacion(r)

  override def toString(): String = this.num + "/" + this.den
}

object Racional {

  def main(args: Array[String]): Unit = {
    val r1 = new Racional(1, 3)
    val r2 = new Racional(1, 9)

    println(r1.suma(r2))
    println(r1.resta(r2))
    println(r1.multiplicacion(r2))

    println(r1 suma r2)
    println(r1 resta r2)
    println(r1 multiplicacion r2)

    println(r1 + r2)
    println(r1 - r2)
    println(r1 * r2)

    println(new Racional(12, 27))
  }
}
