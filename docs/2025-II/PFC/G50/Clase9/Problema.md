Deseo generar de forma perezosa las tripletas de números (i,j,k) que cumple i es par, j es multiplo de i y k es primo usando evaluación perezosa

```scala
object Ejercicio {
  def generador(min: Int, max :Int):LazyList[Int] = {
    if (min >= max) LazyList.empty
    else LazyList.cons(min, generador(min+1, max))
  }

  def solucion():LazyList[(Int,Int,Int)] = {
   for { 
    i <- generador(1,1000)
    j <- generador(1,1000)
    k <- generador(1,1000)
    if (i%2 == 0)        // i es par
    if (j%i == 0)        // j es multiplo de i
    if ((2 to Math.ceil(Math.sqrt(k)).toInt) forall (s => k <= 2 ||  (k % s != 0)))  // k es primo

    } yield (i,j,k)
  }

  def main(arr:Array[String]):Unit = {
    val t = solucion()
    println(t)
    println(t(9))
    println(t)
  }
}
```

