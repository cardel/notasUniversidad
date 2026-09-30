// Un valor se calcula una vez; una funcion se vuelve a usar con otros
// argumentos. Y el orden en que se reemplaza no es el orden en que se
// imprime.

val radio: Double = 3.0
val areaVal: Double = math.Pi * radio * radio

def areaDef(r: Double): Double = math.Pi * r * r

def doble(n: Int): Int = 2 * n

def dobleConRuido(n: Int): Int =
  println(s"calculando el doble de $n")
  2 * n

@main def demo(): Unit =
  println(s"areaVal        = $areaVal")
  println(s"areaDef(3.0)   = ${areaDef(3.0)}")
  println(s"areaDef(5.0)   = ${areaDef(5.0)}")

  println(s"doble(21) + doble(21) = ${doble(21) + doble(21)}")

  println("dobleConRuido(21) + dobleConRuido(21):")
  println(dobleConRuido(21) + dobleConRuido(21))

  println("con el resultado ligado a un nombre:")
  val d = dobleConRuido(21)
  println(d + d)
