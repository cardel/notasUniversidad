// Los argumentos se entregan en grupos separados, uno por paréntesis.
// Cada grupo que se llena deja fija una parte y devuelve una función
// que espera el resto.

object Currificacion {

  def sumaC(a: Int)(b: Int): Int = a + b

  def operacionGenerica(f: Int => Int)(g: Int => Int)(h: (Int, Int) => Int)(n: Int): Int = {
    @annotation.tailrec
    def aux(a: Int, b: Int, acc: Int): Int = {
      if (a > b) acc
      else aux(g(a), b, h(f(a), acc))
    }
    val neutro = if (h(0, 1) == 0) 1 else 0
    aux(1, n, neutro)
  }

  def main(args: Array[String]): Unit = {
    val g = sumaC(10) _
    println(g(11))
    println(g(15))

    val sumatoria = operacionGenerica((x: Int) => x)((y: Int) => y + 1)((a: Int, b: Int) => a + b) _
    println(sumatoria(15))
    println(sumatoria(10))

    val sumatoriaImpares = operacionGenerica((x: Int) => x)((y: Int) => y + 2)((a: Int, b: Int) => a + b) _
    println(sumatoriaImpares(15))
    println(sumatoriaImpares(10))
  }
}
