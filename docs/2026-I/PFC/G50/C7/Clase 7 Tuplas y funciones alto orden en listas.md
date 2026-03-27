
# Como vamos

Estudiar el reconocimiento de patrones sobre listas considerando que son una estructura recursiva: cabeza y cola

```scala
def sumaLista(l:List[Int]):Int = {
	l match {
		case Nil => 0
		case x :: xs => x + sumaLista(xs)
	}
}


def sumaListaCola(l:List[Int]):Int = {
	@scala.annotation.tailrec
	def sumaLista(l:List[Int], acc:Int = 0):Int = {
		l match {
			case Nil => acc
			case x :: xs => sumaLista(xs, acc+x)
		}
	}
	sumaLista(l)
}

```

Esto representa una mejor forma de procesar datos a partir de su estructura, en este caso estamos considerando que una lista puede tener dos casos, el primero es Nil o lista vacia y el segundo cabeza :: cola, que es una lista no vacia. Como se puede observar el reconocimiento de patrones permite procesar los datos a partir de su estructura de entrada.

Con esto nos estamos evitando tener que pensar en acceder a l.head o l.tail y ligarlos a nombre (val)


# Temas

1. [Tuplas](Tuplas.md)
2. [Map y Filter](Map%20y%20Filter.md)
3. [Reduce y Fold](Reduce%20y%20Fold.md)
4. [Resumen](Resumen.md)
