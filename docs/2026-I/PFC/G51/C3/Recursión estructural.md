Las listas son una estructura recursiva, que tiene dos campos

1. Cabeza: Elemento
2. Cola: Lista

```scala
val x = List(5,6,7)
x.head //5
x.tail //List(6,7)
x.tail.head //6
x.tail.tail //List(7)
x.tail.tail.head //7
x.tail.tail.tail // Nil o List()
```

Las funciones que utilizan listas

1. ¿Cual es su caso base? Lista vacia
2. Como el caso recursivo nos lleva al caso base? Si pregunto muchas veces por la cola entonces debo llevar a la lista vacia


```scala
@scala.annotation.tailrec
final def sumarList(lst:List[Int], acc:Int = 0):Int = {
	if (l.isEmpty) acc
	else sumarList(lst.tail, lst.head + acc)
}

sumarList(List(2,4,6,8,10), 0)
sumarList(List(4,6,8,10),2)
sumarList(List(6,8,10),6)
sumarList(List(8,10),12)
sumarList(List(10),20)
sumarList(List(),30)
30
```

Condiciones

1. El caso base debe retornar el acc, que este arranca en el valor del caso base
2. El caso recursivo, me lleva la lista al caso base (empty) a través de tail
3. El acumulador va sumando paulatinamente los elementos de la lista

En este caso la función sigue la idea de estructura recursiva que tiene la lista (head,tail), head es un elementos y tail es una lista, que paulatinamente llegamos la lista.