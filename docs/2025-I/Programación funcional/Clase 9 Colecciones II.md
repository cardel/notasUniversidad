# Clase 9: Colecciones II

# Recursos

- REPL [https://scastie.scala-lang.org/](https://scastie.scala-lang.org/)

# Expresiones for continuación

Que podemos hacer con las expresions for

Tener un lenguaje de consultas sobre conjuntos (base de datos)

Esto nos permite relacionar el paradigma funcional con el paradigma relacional

```scala
{for {
	l1 <- libros //generador
	l2 <- libros //generador
	if l1 != l2 //filtro
	a1 <- l1.autores //generador
	a2 <- l2.autores //generador
	if a1 == a2 //filtro
} yield a1 //withfilter con un flatMap
}.distinct 
//Autores que tienen al menos dos libros
// SELECT UNIQUE autores FROM libros l1 JOIN libros l2 WHERE l1.autores == l2.autores and l1 != l2 Flatmap vs map
```

---

## flatMap vs Map

```scala
scala> val l1 = List(1,2,3)
val l1: List[Int] = List(1, 2, 3)

scala> val l2 = List(4,6,8)
val l2: List[Int] = List(4, 6, 8)

scala> l2 map (x => l1 map (y => (x,y)))
val res0: List[List[(Int, Int)]] = List(List((4,1), (4,2), (4,3)), List((6,1), (6,2), (6,3)), List((8,1), (8,2), (8,3)))

scala> l2 flatMap (x => l1 map (y => (x,y)))
val res1: List[(Int, Int)] = List((4,1), (4,2), (4,3), (6,1), (6,2), (6,3), (8,1), (8,2), (8,3))
```

## withFilter vs filter

```scala
scala> l1
val res11: List[Int] = List(1, 2, 3)

scala> l1 filter (x => x%2 == 0)
val res12: List[Int] = List(2)

scala> l1 withFilter (x => x%2 == 0)
val res13: scala.collection.WithFilter[Int,[_]List[_]] = scala.collection.IterableOps$WithFilter@5a8149f6

scala> l1 withFilter (x => x%2 == 0) map (x => x)
val res14: List[Int] = List(2)
```

# Maps

¿Que son?

Asociaciones de llave - valor, la llave debe ser única

Son coleccions inmutables

```scala
scala> val p:Map[Int,String] = Map(1->"perro", 2->"gato", 3->"lobo");
val p: Map[Int,String] = Map(1 -> perro, 2 -> gato, 3 -> lobo)

scala> p(1)
val res0: String = perro

scala> p(10)
java.util.NoSuchElementException: key not found: 10
  at scala.collection.immutable.Map$Map3.apply(Map.scala:417)
  ... 34 elided

scala> val p:Map[Int,String] = Map(1->"perro", 2->"gato", 3->"lobo") withDefaultValue "none";
val p: Map[Int,String] = Map(1 -> perro, 2 -> gato, 3 -> lobo)

scala> p(10)
val res2: String = none

//En caso de que hayan dos llaves iguales se reemplaza
scala> val p:Map[Int,String] = Map(1->"perro", 2->"gato", 3->"lobo", 1->"madre") withDefaultValue "none";
val p: Map[Int,String] = Map(1 -> madre, 2 -> gato, 3 -> lobo)
```

```scala
//Generar mapas
scala> l1
val res14: List[Int] = List(1, 2, 3)

scala> l2
val res15: List[String] = List(Hombre, Lobo, Gato)

scala> (l1 zip l2).toMap
val res16: scala.collection.immutable.Map[Int,String] = Map(1 -> Hombre, 2 -> Lobo, 3 -> Gato)

scala> (l1 zip l2)
val res17: List[(Int, String)] = List((1,Hombre), (2,Lobo), (3,Gato))

//Reemplazar un valor, genera un nuevo mapa
scala> m1 ++ Map(1 -> "Mujer")
val res21: scala.collection.immutable.Map[Int,String] = Map(1 -> Mujer, 2 -> Lobo, 3 -> Gato)
```

# Evaluación perezosa

¿Que es?

Algunas colecciones son muy grandes y requiere muchos calculos (complejidad computacional elevada) y muchas veces no requerimos todos los datos

La evaluación perezosa nos ofrece la posibilidad de calcular hasta donde se requiere

La diferencia con la evaluación ansiosa, esta necesita calcular todos los elementos

```scala
scala> def enteros(n:Int=0):LazyList[Int] =
     | n #:: enteros(n+1)
def enteros(n: Int): LazyList[Int]

scala> val l = enteros()
val l: LazyList[Int] = LazyList(<not computed>)

scala> l(0)
val res22: Int = 0

scala> l
val res23: LazyList[Int] = LazyList(0, <not computed>)

scala> l(4)
val res24: Int = 4

scala> l
val res25: LazyList[Int] = LazyList(0, 1, 2, 3, 4, <not computed>)

scala> l(20)
val res3: Int = 20

scala> l
val res4: LazyList[Int] = LazyList(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, <not computed>)
```

# Conclusiones

La programación funcional provee un conjunto coherente de conceptos y técnicas de programación basados en:

• Programación de alto orden: Funciones que reciben o retornan funciones, currying esto nos permite tener mayor expresividad
• Reconocimiento de patrones: Para agrupar condicionales y asignación
• Colecciones inmutables: No pueden cambiar su valor
• Ausencia de estado explícito: Los valores no cambian durante la ejecución
• Estrategias de evaluación flexible: ansiosa, perezosa y por nombre

La programación funcional ofrece una caja de herramientas útil para todo programador y brinda una forma diferente de pensar para programar.

# Resumen

La programación funcional combina conceptos como funciones de alto orden, colecciones inmutables, evaluación perezosa y patrones para mayor expresividad y eficiencia. Incluye técnicas como expresiones for, flatMap, mapas, reconocimiento de patrones y estrategias de evaluación flexible.