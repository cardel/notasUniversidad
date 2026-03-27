# Map y Filter

## Map

La función `map` es una función de alto orden que permite aplicar una función a cada elemento de una lista, transformándolos y retornando una nueva lista. La lista resultante puede ser de un tipo diferente al de la lista original.

```scala
// Implementación de map en la clase List
def map[U](f: T => U): List[U] = this match {
    case Nil => Nil  // Caso base: lista vacía retorna lista vacía
    case x :: xs => f(x) :: xs.map(f)  // Aplica f al primer elemento y recursivamente al resto
}
```

Como está implementado dentro de la clase `List`, `this` se refiere a la instancia actual de la lista sobre la cual se invoca el método.

Ejemplos de uso:

```scala
scala> val l = List(1,2,3,4)
val l: List[Int] = List(1, 2, 3, 4)

// Multiplica cada elemento por 2
scala> l.map(x => x*2)
val res13: List[Int] = List(2, 4, 6, 8)

// Transforma cada entero en un booleano (verifica si es par)
scala> l.map(x => x%2 == 0)
val reds14: List[Boolean] = List(false, true, false, true)

// Crea cadenas con "a" repetida x veces
scala> l.map(x => "a"*x)
val res15: List[String] = List(a, aa, aaa, aaaa)
```

## Filter

La función `filter` es una función de alto orden que genera una nueva lista con los elementos que cumplen una condición específica (predicado). Si ningún elemento cumple la condición, retorna una lista vacía.

```scala
// Implementación de filter en la clase List
def filter(p: T => Boolean): List[T] = this match {
    case Nil => Nil  // Caso base: lista vacía retorna lista vacía
    case x :: xs =>
        if (p(x)) x :: xs.filter(p)  // Si cumple el predicado, incluye x y filtra el resto
        else xs.filter(p)  // Si no cumple, solo filtra el resto
}
```

Ejemplos de uso:

```scala
scala> l
val res16: List[Int] = List(1, 2, 3, 4)

// Filtra elementos mayores que 2
scala> l.filter(x => x > 2)
val res17: List[Int] = List(3, 4)

// Filtra elementos menores que 0 (ninguno cumple)
scala> l.filter(x => x < 0)
val res18: List[Int] = List()

// Notación alternativa sin punto (sintaxis de operador)
scala> l filter (x => x % 2 == 0)
val res19: List[Int] = List(2, 4)
```

## Tabla de resumen

Concepto | Descripción | Características clave
--- | --- | ---
`map` | Función de alto orden que aplica una función a cada elemento de una lista, produciendo una nueva lista | - Transforma cada elemento individualmente<br>- Puede cambiar el tipo de los elementos<br>- Retorna lista del mismo tamaño<br>- Preserva el orden de los elementos
`filter` | Función de alto orden que selecciona elementos de una lista que cumplen un predicado | - Retorna subconjunto de la lista original<br>- Puede reducir el tamaño de la lista<br>- Preserva el orden de los elementos seleccionados<br>- Retorna lista vacía si ningún elemento cumple
Función de alto orden | Función que recibe otra función como parámetro o retorna una función | `map` y `filter` son ejemplos clásicos
Predicado | Función que retorna un valor booleano | Usado en `filter` para determinar qué elementos incluir
Inmutabilidad | Las operaciones no modifican la lista original | Tanto `map` como `filter` retornan nuevas listas

## Comentarios adicionales

1. **Composabilidad**: Las funciones `map` y `filter` pueden encadenarse para crear transformaciones complejas, por ejemplo: `lista.map(f).filter(p).map(g)`.

2. **Evaluación perezosa**: En Scala, las listas son estrictas por defecto, pero existen estructuras como `Stream` o `LazyList` que permiten evaluación perezosa de `map` y `filter`.

3. **Relación con for-comprehensions**: En Scala, las expresiones `for` se traducen internamente a combinaciones de `map`, `filter` y `flatMap`.

4. **Eficiencia**: Ambas funciones tienen complejidad O(n) donde n es el tamaño de la lista, ya que deben procesar cada elemento.

5. **Uso con funciones anónimas**: Como se muestra en los ejemplos, comúnmente se usan funciones lambda (anónimas) con `map` y `filter`, pero también pueden usarse funciones definidas.

6. **Notación de operador**: En Scala, los métodos que toman un solo parámetro pueden usarse con notación de operador (sin punto), como en `l filter (x => x > 2)`.

7. **Preservación de tipos**: `filter` siempre retorna una lista del mismo tipo que la original, mientras que `map` puede cambiar el tipo de los elementos.

8. **Alternativas relacionadas**: Existen variantes como `collect` (combina `map` y `filter`), `filterNot` (negación de `filter`), y `mapFilter` (para opciones).