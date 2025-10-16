1. Usando evaluación perezosa encontrar el quinto primo entre 20000 y 500000
2. Usando evaluación perezosa encontrar el cuarto número perfecto entre 1 y 10000, un numero perfecto es aquel que es igual a la suma de sus divisores.

```scala
def streamRange(min:Int, max:Int):LazyList[Int] = {
	if (min >= max) LazyList.empty
	else LazyList.cons(min, streamRange(min+1,max))
}

streamRange(inicial, final) // esto genera un rango perezoso
```