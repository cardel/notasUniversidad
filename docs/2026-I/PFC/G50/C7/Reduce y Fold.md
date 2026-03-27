# Reduce y Fold

La operación de reducción permite transformar una lista en un valor, aplicando una operación binaria a los elementos de la lista para obtener un resultado que no conserva necesariamente el orden original de los elementos (a diferencia de `map`, que preserva la estructura).

Por ejemplo, sumar los elementos de una lista o invertir una lista son casos típicos de reducción.

```scala
scala> l                                                        
val res20: List[Int] = List(1, 2, 3, 4)

// Suma de izquierda a derecha: (((1 + 2) + 3) + 4) = 10
scala> l reduceLeft (_ + _)
val res21: Int = 10

// Suma de derecha a izquierda: (1 + (2 + (3 + 4))) = 10
scala> l reduceRight (_ + _)
val res22: Int = 10

// Resta de izquierda a derecha: (((1 - 2) - 3) - 4) = -8
scala> l reduceLeft (_ - _)
val res23: Int = -8

// Resta de derecha a izquierda: (1 - (2 - (3 - 4))) = -2
scala> l reduceRight (_ - _)
val res24: Int = -2
```

**Observación importante:** La operación utilizada en `reduce` debe ser asociativa para que `reduceLeft` y `reduceRight` den el mismo resultado. Si la operación no es asociativa (como la resta), los resultados serán diferentes según la dirección de la reducción.

Además, `reduce` no puede trabajar con listas vacías, ya que no hay un valor inicial definido.

```scala
scala> List[Int]() reduceLeft ( _ + _)
java.lang.UnsupportedOperationException: empty.reduceLeft
  at scala.collection.IterableOnceOps.reduceLeft(IterableOnce.scala:864)
  at scala.collection.IterableOnceOps.reduceLeft$(IterableOnce.scala:862)
  at scala.collection.AbstractIterable.reduceLeft(Iterable.scala:936)
  ... 38 elided
```

**Fold** resuelve este problema al aceptar un valor acumulador inicial. `fold` está currificado: primero recibe el acumulador y luego la lista.

```scala
(l foldLeft 0) // Retorna una función que espera la operación binaria
(l foldLeft 0)(_ + _) // Aplica la suma con 0 como valor inicial
```

Ejemplo con lista vacía:

```scala
scala> (List[Int]() foldLeft 0)_
val res30: ((Int, Int) => Int) => Int = $Lambda$1350/0x00007f70dc5e9000@59ba2555

// Con foldLeft, una lista vacía devuelve el acumulador inicial (0)
scala> (List[Int]() foldLeft 0)(_ + _)
val res31: Int = 0
```

**¿Cuándo usar `foldLeft` y `foldRight`?**
- `foldLeft`: Se debe usar cuando la operación es asociativa por la izquierda y se desea eficiencia en memoria, ya que utiliza recursión de cola (tail recursion).
- `foldRight`: Se recomienda cuando se van a estructurar listas, especialmente con el operador `::` (cons), que es asociativo por la derecha.

Ejemplo de concatenación de listas:

```scala
scala> l
val res32: List[Int] = List(1, 2, 3, 4)

scala> val j = List(4,5,6,7)
val j: List[Int] = List(4, 5, 6, 7)

// foldRight permite usar :: para prepender elementos de 'l' a 'j'
scala> (l foldRight j)(_ :: _)
val res33: List[Int] = List(1, 2, 3, 4, 4, 5, 6, 7)

// foldLeft no funciona aquí porque :: espera un elemento a la izquierda y una lista a la derecha
scala> (l foldLeft j)(_ :: _)
                        ^
       error: value :: is not a member of Int
```

Ejemplo de inversión de una lista:

```scala
scala> l
val res38: List[Int] = List(1, 2, 3, 4)

// Inversión con foldLeft: se acumula prependiendo cada elemento al acumulador
scala> (l foldLeft List[Int]())((acc:List[Int],x:Int) => x :: acc)
val res39: List[Int] = List(4, 3, 2, 1)

// foldRight no funciona directamente para invertir porque el orden de los parámetros es diferente
scala> (l foldRight List[Int]())((acc:List[Int],x:Int) => x :: acc)
                                                       ^
       error: type mismatch;
        found   : (List[Int], Int) => List[Int]
        required: (Int, List[Int]) => List[Int]
```

**Explicación del error:** En `foldRight`, la función recibe primero el elemento actual y luego el acumulador, es decir `(elem, acc) => ...`. Por lo tanto, para invertir con `foldRight` se debería usar `(x, acc) => acc ::: List(x)` o similar, pero no `x :: acc` directamente.

**Puntos clave a recordar:**
1. `foldLeft` es preferible para operaciones asociativas por la izquierda y cuando se busca eficiencia (tail recursion).
2. `foldRight` es útil cuando se van a estructurar listas, especialmente con operadores asociativos por la derecha como `::`.

Ejemplo adicional: duplicar cada elemento en una tupla y revertir el orden:

```scala
scala> (l foldLeft List[(Int,Int)]())((acc:List[(Int,Int)],x:Int) => (x,x) :: acc)
val res45: List[(Int, Int)] = List((4,4), (3,3), (2,2), (1,1))
```

**Diferencia con `map`:** En este caso, `foldLeft` no solo transforma cada elemento (duplicándolo en una tupla), sino que también invierte el orden de la lista resultante, algo que `map` por sí solo no haría.

---

## Tabla de Resumen

Concepto | Descripción | Cuándo Usarlo | Ejemplo
--- | --- | --- | ---
`reduceLeft` | Aplica una operación binaria de izquierda a derecha, sin valor inicial. | Cuando la operación es asociativa y la lista no está vacía. | `List(1,2,3).reduceLeft(_ + _)`
`reduceRight` | Aplica una operación binaria de derecha a izquierda, sin valor inicial. | Cuando la operación es asociativa por la derecha y la lista no está vacía. | `List(1,2,3).reduceRight(_ - _)`
`foldLeft` | Aplica una operación binaria de izquierda a derecha, con un valor acumulador inicial. | Para operaciones asociativas por la izquierda, eficiencia (tail recursion). | `List(1,2,3).foldLeft(0)(_ + _)`
`foldRight` | Aplica una operación binaria de derecha a izquierda, con un valor acumulador inicial. | Para estructurar listas (ej. con `::`) o operaciones asociativas por la derecha. | `List(1,2,3).foldRight(List.empty[Int])(_ :: _)`
Asociatividad | Propiedad de una operación donde el agrupamiento no afecta el resultado. | Crucial para elegir entre `reduceLeft`/`reduceRight` y `foldLeft`/`foldRight`. | La suma es asociativa: `(a+b)+c = a+(b+c)`
Valor Inicial | Acumulador provisto en `fold` que permite trabajar con listas vacías. | Siempre que se use `fold`, para evitar excepciones con listas vacías. | `foldLeft(0)` para sumas, `foldLeft(List())` para listas.

**Comentarios Adicionales:**
- `reduce` es un caso particular de `fold` donde el primer elemento actúa como acumulador inicial.
- En Scala, `foldLeft` y `foldRight` tienen alias: `/:` y `:\` respectivamente, aunque su uso no es común.
- Para operaciones conmutativas y asociativas (como suma de números), `foldLeft` y `foldRight` darán el mismo resultado si el valor inicial es el elemento neutro de la operación (0 para suma, 1 para multiplicación).
- Al invertir listas, `foldLeft` es natural porque prepende elementos, mientras que `foldRight` los añade al final.
- La elección entre `foldLeft` y `foldRight` también puede depender del orden de evaluación necesario para operaciones no estrictas (lazy evaluation).