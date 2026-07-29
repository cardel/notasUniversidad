# Clase 7: Listas II

# Tuplas

Que son

- Datos inmutables
- Agrupaciones de elementos
- Son utiles para el reconocimiento de patrones

```scala
val l = (1,2)
l._1
l._2
val q = (1,2,3)
q._1
q._2
q._3
```

## Ejemplo

```scala

scala> def f(x:List[Int], y:List[Int]):List[Int] = {
     | (x,y) match
     | {
     | case (Nil, Nil) => Nil
     | case (x::xs, y::ys) => x+y :: f(xs,ys)
     | }
     |
     | }
       (x,y) match
       ^
On line 2: warning: match may not be exhaustive.
       It would fail on the following inputs: (List(_), Nil), (Nil, List(_))
def f(x: List[Int], y: List[Int]): List[Int]

```

```scala
scala> def g(x:List[Int], y:List[Int]):List[Int] = {
     | x match
     | {
     | case Nil => Nil
     | case x::xs => y match {
     | case Nil => Nil
     | case y::ys => x+y :: g(xs,ys)
     | }
     | }
     | }
def g(x: List[Int], y: List[Int]): List[Int]
```

# Funciones

Map

Aplica una función a una colección (lista), el espera una lista y una función, que retorna una lista aplicando la función a cada uno de los elementos de la lista

```scala

scala> l
val res12: List[Int] = List(1, 2, 3, 4, 5)

scala> l.map(x => x*2)
val res13: List[Int] = List(2, 4, 6, 8, 10)

scala> (1 to 100).toList.map(x => x/2.0)
val res18: List[Double] = List(0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0,
8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5, 16.0, 16.5, 17.0, 17.5,
18.0, 18.5, 19.0, 19.5, 20.0, 20.5, 21.0, 21.5, 22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0, 25.5, 26.0, 26.5, 27$
0, 27.5, 28.0, 28.5, 29.0, 29.5, 30.0, 30.5, 31.0, 31.5, 32.0, 32.5, 33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0,
36.5, 37.0, 37.5, 38.0, 38.5, 39.0, 39.5, 40.0, 40.5, 41.0, 41.5, 42.0, 42.5, 43.0, 43.5, 44.0, 44.5, 45.0, 45.
5, 46.0, 46.5, 47.0, 47.5, 48.0, 48.5, 49.0, 49.5, 50.0)
```

Filter

Recibe una colección (lista) y una función predicado (retorna un booleano)

Retorna una lista con los elementos que la función da verdadero

```scala
scala> l.filter(x => x % 2 == 0)
val res22: List[Int] = List(2, 4)
```

Reduce

Convierte una colección en un valor dado

- reduce (opera por la izquierda)
- reduceLeft (igual que reduce)
- reduceRight (opera por la izquierda)
- Limitación la lista no puede ser vacia

```scala
val l = List(1,2,3,4,5)
l.reduceLeft((acc,x) => acc - x)
/**
((((1 - 2) - 3) - 4) - 5)
(((-1 - 3) - 4) - 5)
(((-4) - 4) - 5)
((-8) - 5)
-13
**/

l.reduceRight((acc,x) => acc - x)
/*
(1 -  (2 -  (3 - (4 - 5)))
(1 -  (2 -  (3 - - 1))
(1 -  (2 -  4)
(1 -  - 2)
3
*/
```

---

foldLeft

foldRight

Son operaciones de reducción, que permiten establecer el acumulador, por lo tanto puede trabajar con listas vacias

Cuando invoco el fold (currificada) entonce me retorna un reduce

```scala
scala> (List() foldLeft (0))((acc:Int,x:Int)=>acc+x)
val res54: Int = 0

scala> (List() foldLeft (10))((acc:Int,x:Int)=>acc+x)
val res55: Int = 10

scala> (l foldLeft 0)_
val res56: ((Int, Int) => Int) => Int = $Lambda$2883/1090964764@d634eb0
```