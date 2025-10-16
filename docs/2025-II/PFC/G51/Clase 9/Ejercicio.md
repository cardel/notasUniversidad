1. Usando evaluación perezosa encontrar el quinto primo entre 20000 y 500000
2. Usando evaluación perezosa encontrar el cuarto número perfecto entre 1 y 10000, un numero perfecto es aquel que es igual a la suma de sus divisores.

```scala
def streamRange(min:Int, max:Int):LazyList[Int] = {
	if (min >= max) LazyList.empty
	else LazyList.cons(min, streamRange(min+1,max))
}

streamRange(inicial, final) // esto genera un rango perezoso
```

Solucion

```scala
object Reto2 {
  def streamRange(min:Int, max:Int):LazyList[Int] = {
    if (min >= max) LazyList.empty
	  else LazyList.cons(min, streamRange(min+1,max))
  }

  def problema1():LazyList[Int] = {
    for {
      x <- streamRange(20000,500000)
      if ((2 to Math.ceil(Math.sqrt(x)).toInt) forall (t => x % t != 0))
    } yield x
  }

  def problema2():LazyList[Int] = {
    for {
      x <- streamRange(1,10000)
      if ((1 to x-1).filter(t => x%t == 0).sum == x)
    } yield x

  }

  def main(arr:Array[String]):Unit = {
    val pr1 = problema1()
    println(pr1(0), pr1(1),pr1(2), pr1(3), pr1(4))
    val pr2 = problema2()
    println(pr2(0))
    println(pr2(1))
    println(pr2(2))
    println(pr2(3))
  }

}
```