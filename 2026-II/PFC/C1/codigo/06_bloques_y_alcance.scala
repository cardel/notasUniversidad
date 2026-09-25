// val evalua al ligar; def evalua cada vez que se usa. Un bloque calcula
// auxiliares y se reduce a su ultima expresion. Y lo de adentro tapa lo
// de afuera sin tocarlo.

def anuncia(): Int =
  println("hola")
  4

val conVal: Int = anuncia()      // imprime aqui, una sola vez
def conDef: Int = anuncia()      // imprime cada vez que se use

// Un bloque para calcular algo antes de devolver.
def cuadradoConSigno(x: Int): Int =
  val positivo = if (x < 0) -x else x
  positivo * x

// El if es una expresion: se reduce a un valor.
val umbral = 5
val k: Int = if (umbral < 3) 2 else 11

// Alcance lexico: el x de adentro tapa al de afuera.
val x = 5
def f(y: Int): Int = y + 1

val resultado: Int =
  val bloque =
    val x = f(3)
    x * x
  bloque + x

// Cortocircuito: && para al primer false, & evalua los dos.
def ruidosoBool(v: Boolean): Boolean =
  println(s"  evaluando $v")
  v

@main def demo(): Unit =
  println("--- val frente a def ---")
  println(s"conVal = $conVal")
  println(s"conVal = $conVal")
  println("ahora con def, dos usos:")
  println(s"conDef = $conDef")
  println(s"conDef = $conDef")

  println("--- el bloque ---")
  println(s"cuadradoConSigno(5)  = ${cuadradoConSigno(5)}")
  println(s"cuadradoConSigno(-5) = ${cuadradoConSigno(-5)}")

  println("--- el if es una expresion ---")
  println(s"k = $k")

  println("--- alcance lexico ---")
  println(s"resultado = $resultado")
  println(s"x de afuera sigue siendo $x")

  println("--- cortocircuito ---")
  println("false && ruidosoBool(true):")
  println(false && ruidosoBool(true))
  println("false & ruidosoBool(true):")
  println(false & ruidosoBool(true))
