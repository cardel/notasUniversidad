
La estructuras pueden ser recursivas, es decir estar compuestas por elementos del mismo tipo. Ejemplo Listas

# Lista

Una lista tiene dos partes

1. Cabeza: Tipo
2. Cola: Lista de Tipo


El operador :: es asociativo por la derecha

```scala
val res1: List[Int] = List(1, 2, 3)

scala> 1 :: 2 :: 3 :: Nil
val res2: List[Int] = List(1, 2, 3)

scala> 1 :: 2 :: 3
              ^
       error: value :: is not a member of Int

scala> (1 :: 2) :: 3 :: Nil
          ^
       error: value :: is not a member of Int

scala> 1 :: 2 :: (3 :: Nil)
val res5: List[Int] = List(1, 2, 3)

scala> 1 :: 2 :: List(3)
val res6: List[Int] = List(1, 2, 3)

scala> 1 :: List(2,3)
val res7: List[Int] = List(1, 2, 3)

scala> List(1,2,3)
val res8: List[Int] = List(1, 2, 3)

scala> (1 :: (2 :: (3 :: Nil)))
val res9: List[Int] = List(1, 2, 3)
```

```scala
val x = List(2,4,6,8)
x.head
x.tail //List(4,6,8)
x.tail.head
x.tail.tail //List(6,8)
x.tail.tail.head //6
x.tail.tail.tail //List(8)  8 :: Nil
x.tail.tail.tail.tail // Nil
```

Tener encuenta

El elemento se accede con head

Recursivamos llegamo a Nil aplicando tail muchas veces

Vamos allamar a la funcion recursivamente usando tail


```scala
object Ejemplo {

  def sumarLista(lst:List[Int]):Int = {
    if (lst.isEmpty) 0
    else lst.head + sumarLista(lst.tail)
  }

  def main(args: Array[String]): Unit = {
    println(sumarLista(List(1,2,3,4,5,6,7,8)))
  }
}
```

El caso base esta ubicado cuando lista es vacia

El caso recursivo
1. Acumula la suma con la cabeza
2. Llama la función con la cola

```scala
sumarLista(List(1,2,3,4,5,6,7,8))
1 + sumarLista(List(2,3,4,5,6,7,8))
1 + 2 + sumarLista(List(3,4,5,6,7,8))
1 + 2 + 3 + sumarLista(List(4,5,6,7,8))

....
1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + sumarLista(List())
1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 0 //Caso base
```


# Receta de diseño

```scala
object Ejemplo {

  def sumarLista(lst:List[Int]):Int = {
    if (lst.isEmpty) 0
    else lst.head + sumarLista(lst.tail)
  }

  def invertirAux(n:Int, lst:List[Int]):List[Int] = {
    if (lst.isEmpty) List(n)
    else lst.head :: invertirAux(n, lst.tail)
  }

  def invertir(lst:List[Int]):List[Int] = {
    if (lst.isEmpty) List()
    else invertirAux(lst.head, invertir(lst.tail))
  }

  def ordenarAux(n:Int, lst:List[Int]):List[Int] = {
    if (lst.isEmpty) List(n)
    else {
      if (lst.head < n) lst.head :: ordenarAux(n, lst.tail)
      else n :: lst
    }
  }

  def ordenar(lst:List[Int]):List[Int] = {
    if (lst.isEmpty) List()
    else ordenarAux(lst.head, ordenar(lst.tail))
  }

  def main(args: Array[String]): Unit = {
    println(sumarLista(List(1,2,3,4,5,6,7,8)))
    println(invertir(List(1,2,3,4,5,6,7,8,9)))
    println(ordenar(List(10,1,2,12,20,4,5,6,7,11,100,99,44)))
  }
}
```

1. El caso base nos da respuesta inmediata, el caso base es cuando la lista es vacia
2. El caso recursivo compone la solución e invoca la función con el tail, buscando el caso base (vacio)