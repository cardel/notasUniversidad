# Temas

1. Hemos visto las listas como estructura de dato recursiva la cual está compuesta por cabeza y cola
2. Podemos utilizar reconocimiento de patrones para desarrollar funciones que trabajan las listas de forma estructura 
   
```scala
def buscarElementos(l:List[Int], elm:Int):Boolean = {
	l match {
		case Nil => false
		case x :: xs => if (x == elm) true else buscarElementos(xs,elm)
	}
}
```
Identificamos que las listas vienen en dos formas

1. Nil o List() lista vacia
2. cabeza :: cola para listas no vacias

# Temas

1. [Tuplas](Tuplas.md)
2. [Map y filter](Map%20y%20filter.md)
3. [Reduce y Fold](Reduce%20y%20Fold.md)
4. [Resumen](Resumen.md)