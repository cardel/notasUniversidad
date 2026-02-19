# Listas

Una lista es una estructura de datos recursiva que tiene dos partes:

1. Un valor (Entero, Double, String, ...)
2. Una lista

```scala
List() // Lista vacía
4 :: List() // List(4) - Operador :: (cons) agrega un elemento al inicio
1 :: List(4) // List(1, 4) - Construcción de lista con cons
```

## Ejemplos de construcción

```scala
scala> List()
val res0: List[Nothing] = List()

scala> 4 :: List()
val res1: List[Int] = List(4)

scala> 1 :: List(4)
val res2: List[Int] = List(1, 4)
```

Las listas son colecciones **de elementos del mismo tipo**. Esto significa que una lista no puede contener simultáneamente un entero y un string, por ejemplo.

## Estructura de una lista

Una lista tiene dos partes fundamentales:

1. **Cabeza (head)**: el primer elemento de la lista
2. **Cola (tail)**: el resto de la lista (también una lista)

```scala
val l: List[Int] = List(1, 2, 3, 4, 5)
// Internamente se representa como: 1 :: 2 :: 3 :: 4 :: 5 :: List()

// Acceso a la cabeza
scala> l.head
val res4: Int = 1

// Acceso a la cola (todos excepto el primero)
scala> l.tail
val res5: List[Int] = List(2, 3, 4, 5)

// Encadenamiento de operaciones para acceder a elementos
scala> l.tail.head // Segundo elemento
val res6: Int = 2

scala> l.tail.tail // Lista sin los dos primeros elementos
val res7: List[Int] = List(3, 4, 5)

scala> l.tail.tail.head // Tercer elemento
val res8: Int = 3

scala> l.tail.tail.tail // Lista sin los tres primeros elementos
val res9: List[Int] = List(4, 5)

scala> l.tail.tail.tail.head // Cuarto elemento
val res10: Int = 4

scala> l.tail.tail.tail.tail // Lista con un solo elemento
val res11: List[Int] = List(5)

scala> l.tail.tail.tail.tail.head // Quinto elemento
val res12: Int = 5

scala> l.tail.tail.tail.tail.tail // Lista vacía
val res13: List[Int] = List()
```

De una lista se pueden obtener dos partes: la cabeza (head) y la cola (tail). La cabeza es un elemento de la lista (el primero) y la cola es el resto, que también es una lista.

---

## Tabla de resumen de conceptos

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| **Lista (List)** | Estructura de datos recursiva y ordenada que contiene elementos del mismo tipo | `List(1, 2, 3, 4, 5)` |
| **Lista vacía** | Lista sin elementos, es el caso base de la recursión | `List()` |
| **Operador cons (::)** | Operador que agrega un elemento al inicio de una lista | `1 :: List(2, 3)` |
| **Cabeza (head)** | El primer elemento de una lista | `List(1, 2, 3).head` → `1` |
| **Cola (tail)** | Todos los elementos excepto el primero (es también una lista) | `List(1, 2, 3).tail` → `List(2, 3)` |
| **Tipo genérico** | Las listas usan tipos genéricos para especificar el tipo de sus elementos | `List[Int]`, `List[String]` |

## Comentarios adicionales

- Las listas en Scala son **inmutables**, lo que significa que no se pueden modificar después de su creación. Cualquier operación retorna una nueva lista.

- La naturaleza recursiva de las listas permite definir algoritmos recursivos de forma natural. Muchas operaciones sobre listas se implementan usando recursión sobre head y tail.

- El operador `::` es asociativo hacia la derecha, por lo que `1 :: 2 :: 3 :: List()` se evalúa como `1 :: (2 :: (3 :: List()))`.