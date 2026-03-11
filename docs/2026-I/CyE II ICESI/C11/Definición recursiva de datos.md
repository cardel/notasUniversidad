Los tipos se pueden definir de forma recursiva, podemos asumir que el caso pertenece pertenece al tipo y tenemos una regla para generar los otros casos

Ejemplo: Multiplos de 5
$$
5 \in S, x \in S \wedge y \in S \therefore x+y \in S
$$
Lista de Booleanos
$$
Nil \in S, x \in \{V,F\} \wedge l \in S, x::l \in S
$$
```scala
scala> Nil
val res0: collection.immutable.Nil.type = List()

scala> 1 :: Nil
val res1: List[Int] = List(1)

scala> "casita" :: Nil
val res2: List[String] = List(casita)

scala> (1 :: 2 :: Nil) :: Nil
val res3: List[List[Int]] = List(List(1, 2))
```



