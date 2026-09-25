// Por valor los argumentos se reducen antes de entrar; por nombre entran
// tal cual y se reducen solo si el cuerpo los usa. La flecha => en el
// tipo de un parametro pide evaluacion por nombre.

def bucle: Int = bucle

def primeroPorNombre(x: Int, y: => Int): Int = x

def ruidoso(n: Int): Int =
  println(s"  evaluando $n")
  n

def porValor(x: Int, y: Int): Int = x * x
def porNombre(x: Int, y: => Int): Int = x * x
def dosVeces(y: => Int): Int = y + y

@main def demo(): Unit =
  println(s"primeroPorNombre(1, bucle) = ${primeroPorNombre(1, bucle)}")

  println("porValor(ruidoso(3), ruidoso(4)):")
  println(porValor(ruidoso(3), ruidoso(4)))

  println("porNombre(ruidoso(3), ruidoso(4)):")
  println(porNombre(ruidoso(3), ruidoso(4)))

  println("dosVeces(ruidoso(5)):")
  println(dosVeces(ruidoso(5)))
