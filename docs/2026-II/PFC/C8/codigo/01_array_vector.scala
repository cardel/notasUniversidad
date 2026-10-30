// Array y Vector: la misma interfaz, distinta promesa sobre el cambio.
// Un Array se puede actualizar en su sitio; un Vector no, y el compilador
// lo dice al intentarlo.

object ArrayVector {

  def main(args: Array[String]): Unit = {
    val a = Array(1, 2, 3, 4)
    val b = Vector(1, 2, 3, 4)
    println(a.toList)            // List(1, 2, 3, 4)
    println(b)                   // Vector(1, 2, 3, 4)

    a(3) = 10
    println(a.toList)            // List(1, 2, 3, 10)
    // b(3) = 10  no compila: value update is not a member of Vector[Int]

    println((a map (_ * 2)).toList)      // List(2, 4, 6, 20)
    println(b filter (_ % 2 == 0))       // Vector(2, 4)
    println(b reduce ((acc, x) => x + acc))  // 10

    println(1 +: b)              // Vector(1, 1, 2, 3, 4)
    println(b :+ 1)              // Vector(1, 2, 3, 4, 1)
  }
}
