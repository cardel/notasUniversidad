// El enesimo numero triangular, definido de cinco maneras. Todas dan
// lo mismo dentro del rango donde la tabla alcanza.

// 1. Tabulacion: se escribe la respuesta para cada entrada.
def triangularTabla(n: Int): Int = n match
  case 0 => 0
  case 1 => 1
  case 2 => 3
  case 3 => 6
  case 4 => 10
  case _ => -1          // fuera de la tabla no hay respuesta

// 2. Formula directa.
def triangularFormula(n: Int): Int = n * (n + 1) / 2

// 3. Composicion: sumar el ultimo al triangular del anterior.
def sumar(a: Int, b: Int): Int = a + b
def triangularComposicion(n: Int): Int =
  if (n <= 0) 0 else sumar(n, triangularFormula(n - 1))

// 4. Por casos.
def triangularCasos(n: Int): Int =
  if (n <= 0) 0
  else if (n == 1) 1
  else triangularCasos(n - 1) + n

// 5. Recursion.
def triangularRecursivo(n: Int): Int =
  if (n <= 0) 0 else n + triangularRecursivo(n - 1)

@main def demo(): Unit =
  println("  n | tabla | formula | composicion | casos | recursivo")
  (0 to 6).foreach: n =>
    println(f"  $n | ${triangularTabla(n)}%5d | ${triangularFormula(n)}%7d | " +
            f"${triangularComposicion(n)}%11d | ${triangularCasos(n)}%5d | " +
            f"${triangularRecursivo(n)}%9d")
