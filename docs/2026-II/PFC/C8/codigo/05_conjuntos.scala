// Un conjunto no repite elementos y no promete orden. Ni siquiera
// promete con qué nombre se imprime: eso depende de la implementación
// que vaya quedando detrás.

object Conjuntos {

  def main(args: Array[String]): Unit = {
    val s1 = (1 to 6).toSet
    val s2 = Set(2, 3, 4, 5)
    println(s1)                    // HashSet(5, 1, 6, 2, 3, 4)
    println(s2)                    // Set(2, 3, 4, 5)

    println(s1 contains 1)         // true
    println(s1 contains 10)        // false
    println(s1(1))                 // true
    println(s1(10))                // false

    println(s1 union s2)
    println(s1 intersect s2)
    println(s1 diff s2)

    println(s1 filter (x => x > 2))
    println(s1 forall (x => x > 2))  // false
  }
}
