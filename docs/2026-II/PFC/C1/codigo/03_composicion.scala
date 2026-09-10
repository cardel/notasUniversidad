// Componer es encadenar: la salida de una entra en la otra. El orden
// importa, y andThen y compose lo recorren al reves.

def siguiente(n: Int): Int = n + 1
def alCuadrado(n: Int): Int = n * n

val mismaCosa: Int => Int = siguiente andThen alCuadrado   // (x + 1)^2
val alReves: Int => Int = siguiente compose alCuadrado     // x^2 + 1

def area(r: Double): Double = math.Pi * r * r
def dosDecimales(x: Double): Double = math.round(x * 100) / 100.0

val areaRedondeada: Double => Double = area _ andThen dosDecimales

@main def demo(): Unit =
  println("  x | (x+1)^2 | x^2+1")
  (0 to 4).foreach(x => println(f"  $x | ${mismaCosa(x)}%7d | ${alReves(x)}%5d"))

  println(s"area(2.0)           = ${area(2.0)}")
  println(s"areaRedondeada(2.0) = ${areaRedondeada(2.0)}")
