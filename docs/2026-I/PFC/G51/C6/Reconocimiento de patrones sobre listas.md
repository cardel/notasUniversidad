# Reconocimiento de patrones sobre listas

Una lista está compuesta por cabeza (head) y cola (tail), donde la cola es a su vez una lista, lo que la convierte en una definición recursiva. La lista tiene dos casos fundamentales:

1. **Nil**: Caso de lista vacía (equivalente a `List()`)
2. **x :: xs**: Patrón de cabeza (x) y cola (xs), donde `::` es el operador de construcción de listas (cons)

Podemos usar reconocimiento de patrones en listas validando primero el caso de vacío y luego los demás:

```scala
// Función genérica que utiliza pattern matching sobre listas
def funcion[T](lst: List[T]): T = {
  lst match {  // Inicio del pattern matching sobre la lista
    case Nil => ...  // Caso base: lista vacía
    case x :: xs => ...  // Caso recursivo: x es la cabeza, xs es la cola
  }
}
```

Esto es equivalente a usar métodos de la lista directamente:

```scala
// Versión alternativa usando métodos de la clase List
def funcion[T](lst: List[T]): T = {
  if (lst.isEmpty) ...  // Verificación explícita de lista vacía
  else {
    // lst.head para extraer la cabeza y lst.tail para extraer la cola
  }
}
```

En general, podemos usar pattern matching para evitar tener que validar manualmente si una lista está vacía y para acceder directamente a la cabeza y cola sin llamar a métodos explícitos.

Tener en cuenta algunas operaciones importantes sobre listas:

```scala
scala> val l = List(1, 2, 3, 4, 5)  // Creación de una lista de enteros
val l: List[Int] = List(1, 2, 3, 4, 5)

scala> l.head  // Obtiene el primer elemento de la lista
val res2: Int = 1

scala> l.tail  // Obtiene todos los elementos excepto el primero
val res3: List[Int] = List(2, 3, 4, 5)

scala> l.take(3)  // Toma los primeros 3 elementos de la lista
val res4: List[Int] = List(1, 2, 3)

scala> l.drop(3)  // Elimina los primeros 3 elementos de la lista
val res5: List[Int] = List(4, 5)

scala> l.splitAt(3)  // Divide la lista en dos partes en la posición 3
val res6: (List[Int], List[Int]) = (List(1, 2, 3), List(4, 5))
```

## Conceptos teóricos adicionales

**Estructura recursiva de listas**: En Scala, `List` es una estructura de datos recursiva donde cada lista es o bien `Nil` (vacía) o bien un elemento (`head`) seguido de otra lista (`tail`).

**Operador :: (cons)**: El operador `::` construye una nueva lista agregando un elemento al principio de una lista existente. Es asociativo por la derecha: `1 :: 2 :: 3 :: Nil` equivale a `1 :: (2 :: (3 :: Nil))`.

**Pattern matching exhaustivo**: Al trabajar con listas, es importante cubrir ambos casos (`Nil` y `x :: xs`) para evitar errores en tiempo de ejecución.

**Recursión estructural**: Muchas operaciones sobre listas se implementan naturalmente mediante recursión estructural, donde el caso base es `Nil` y el caso recursivo procesa `head` y llama recursivamente sobre `tail`.

**Inmutabilidad**: Las listas en Scala son inmutables por defecto. Operaciones como `tail`, `take`, `drop` y `splitAt` devuelven nuevas listas sin modificar la original.

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scala | Uso en pattern matching |
|----------|-------------|------------------|-------------------------|
| Lista vacía (Nil) | Caso base de la definición recursiva de listas | `Nil` o `List()` | `case Nil => ...` |
| Cons (::) | Operador para construir listas agregando elemento al inicio | `1 :: List(2, 3)` | `case x :: xs => ...` |
| Head | Primer elemento de una lista no vacía | `list.head` | Extraído como `x` en `x :: xs` |
| Tail | Todos los elementos excepto el primero | `list.tail` | Extraído como `xs` en `x :: xs` |
| Take | Toma los primeros n elementos | `list.take(3)` | No aplica directamente |
| Drop | Elimina los primeros n elementos | `list.drop(2)` | No aplica directamente |
| SplitAt | Divide la lista en dos partes | `list.splitAt(3)` | No aplica directamente |
| Recursión estructural | Patrón de procesamiento recursivo sobre estructura de datos | Procesar head y llamar recursivo sobre tail | Natural con `case x :: xs => f(x) :: procesar(xs)` |
| Inmutabilidad | Las listas no pueden modificarse después de creadas | Operaciones devuelven nuevas listas | Seguro para pattern matching |

## Comentarios adicionales

- El pattern matching sobre listas es más seguro que usar `head` y `tail` directamente, ya que evita `NoSuchElementException` cuando la lista está vacía.
- El operador `::` es un método del objeto `List` que se puede usar en notación infija debido a que termina con `:`.
- Para listas con más de un elemento en el patrón, se puede usar: `case x :: y :: rest => ...` para extraer los dos primeros elementos.
- El pattern matching sobre listas es fundamental para algoritmos como map, filter, fold, y otros transformadores de listas.
- La recursión sobre listas usando pattern matching es más eficiente que usar índices, ya que las listas enlazadas no tienen acceso aleatorio eficiente.
- Se pueden anidar patrones para estructuras más complejas: `case (x :: xs) :: yss => ...` para listas de listas.
- El uso de `@` (as-pattern) permite capturar tanto el patrón completo como sus partes: `case listaCompleta @ (x :: xs) => ...`
- Para optimizar la recursión sobre listas grandes, se puede usar recursión de cola (tail recursion) para evitar desbordamiento de pila.