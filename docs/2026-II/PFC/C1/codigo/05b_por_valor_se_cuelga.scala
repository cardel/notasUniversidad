// El mismo llamado, pero con el segundo parametro por valor. No termina.
// Se corre con timeout: el codigo de salida 124 dice que hubo que matarlo.

def bucle: Int = bucle

def primeroPorValor(x: Int, y: Int): Int = x

@main def demo(): Unit =
  println(primeroPorValor(1, bucle))
