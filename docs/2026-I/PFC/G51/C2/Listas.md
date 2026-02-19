# Listas

Las listas son una estructura de datos inmutable compuesta por elementos **del mismo tipo**. Esta característica garantiza seguridad de tipos en tiempo de compilación y previene errores relacionados con operaciones entre tipos incompatibles.

Las listas son una estructura recursiva que tiene dos partes fundamentales:

1. **Cabeza (head)**: El primer elemento de la lista
2. **Cola (tail)**: La misma lista pero sin el primer elemento (también es una lista)

```scala
// Ejemplo 1: Creación de una lista usando el constructor List()
scala> val x = List(4,5,6,7)
val x: List[Int] = List(4, 5, 6, 7)
// Se crea una lista 'x' con cuatro elementos enteros
// El tipo List[Int] indica que es una lista de enteros

// Ejemplo 2: Creación de una lista usando el operador :: (cons)
scala> 4 :: 5 :: 6 :: 7 :: Nil
val res14: List[Int] = List(4, 5, 6, 7)
// El operador :: (cons) prepende un elemento a una lista
// Se lee de derecha a izquierda: 4 prepended to (5 prepended to (6 prepended to (7 prepended to Nil)))
// Nil representa la lista vacía, es el caso base de la recursión
```

## Estructura recursiva de las listas

Las listas tienen dos casos fundamentales:

- **Nil**: Representa una lista vacía, es el caso base de la recursión
- **Lista no vacía**: Representada como `x :: l`, donde `x` es un elemento (la cabeza) y `l` es una lista (la cola)

```scala
// Ejemplo 1: Lista vacía
scala> Nil
val res15: scala.collection.immutable.Nil.type = List()
// Nil es el objeto que representa una lista vacía

// Ejemplo 2: Lista con un elemento
scala> 1 :: Nil
val res16: List[Int] = List(1)
// Se prepende el elemento 1 a una lista vacía (Nil)
// Resultado: una lista con un único elemento

// Ejemplo 3: Lista con dos elementos
scala> 2 :: 1 :: Nil
val res17: List[Int] = List(2, 1)
// Se prepende 2 a la lista (1 :: Nil)
// Resultado: una lista con dos elementos [2, 1]
```

## Acceso a elementos de una lista

Para acceder a los elementos de una lista, utilizamos dos operaciones fundamentales:

- **head**: Retorna el primer elemento de la lista
- **tail**: Retorna la cola, es decir, la lista sin el primer elemento

Para acceder a elementos posteriores al primero, se debe aplicar `tail` de forma recursiva y luego `head`.

```scala
// La lista original
scala> x
val res19: List[Int] = List(4, 5, 6, 7)

// Acceso al primer elemento (cabeza)
scala> x.head
val res20: Int = 4
// head retorna el primer elemento: 4

// Acceso a la cola (lista sin el primer elemento)
scala> x.tail
val res21: List[Int] = List(5, 6, 7)
// tail retorna una nueva lista con los elementos restantes

// Acceso al segundo elemento
scala> x.tail.head
val res22: Int = 5
// Primero extraemos la cola: List(5, 6, 7)
// Luego obtenemos el head de esa cola: 5

// Acceso a la cola de la cola
scala> x.tail.tail
val res23: List[Int] = List(6, 7)
// Se aplica tail dos veces, obteniendo los últimos dos elementos

// Acceso al tercer elemento
scala> x.tail.tail.head
val res24: Int = 6
// Se aplica tail dos veces y luego head para obtener el tercero

// Acceso a la cola de la cola de la cola
scala> x.tail.tail.tail
val res25: List[Int] = List(7)
// Se aplica tail tres veces, obteniendo solo el último elemento

// Acceso al cuarto elemento
scala> x.tail.tail.tail.head
val res26: Int = 7
// Se aplica tail tres veces y luego head para obtener el cuarto

// Acceso a la cola cuando solo queda un elemento
scala> x.tail.tail.tail.tail
val res27: List[Int] = List()
// Se aplica tail cuatro veces, obteniendo una lista vacía (Nil)
```

## Conceptos teóricos adicionales

**Estructura recursiva**: Las listas en Scala están definidas recursivamente. Una lista es o bien vacía (Nil) o bien está compuesta por un elemento (head) y otra lista (tail). Esta definición recursiva permite procesar listas de manera elegante usando recursión.

**Inmutabilidad**: Las listas en Scala son inmutables, lo que significa que no se pueden modificar después de su creación. Cualquier operación que aparentemente "modifica" una lista en realidad crea una nueva lista. Esta característica es fundamental para la programación funcional y evita errores causados por cambios inesperados en los datos compartidos.

**Tipado paramétrico**: El tipo `List[Int]` indica que la lista está parametrizada por el tipo `Int`. Esto permite crear listas de cualquier tipo (p. ej., `List[String]`, `List[Boolean]`) mientras se mantiene la seguridad de tipos.

**Operador cons (::)**: El operador `::` es el operador de construcción (cons) que prepende un elemento a una lista. Es importante notar que es asociativo a la derecha, por lo que `a :: b :: c :: Nil` se evalúa como `a :: (b :: (c :: Nil))`.

**Estructura unaria recursiva**: Las listas son un caso especial de árboles unarios (también llamados listas enlazadas) donde cada nodo tiene exactamente un hijo (la cola). Esta estructura es fundamental en la teoría de estructuras de datos funcionales.

**Complejidad temporal**: El acceso a la cabeza (head) es O(1), pero el acceso a elementos arbitrarios requiere O(n) operaciones, donde n es la posición del elemento, ya que se debe recorrer la lista desde el inicio.

---

## Tabla de resumen

| Concepto | Definición | Ejemplo |
|---|---|---|
| **Lista** | Estructura de datos inmutable de elementos del mismo tipo | `List(1, 2, 3)` |
| **Cabeza (head)** | Primer elemento de la lista | `List(4, 5, 6).head = 4` |
| **Cola (tail)** | Lista sin el primer elemento | `List(4, 5, 6).tail = List(5, 6)` |
| **Nil** | Lista vacía, caso base de la recursión | `List() = Nil` |
| **Operador cons (::)** | Operador que prepende un elemento a una lista | `1 :: List(2, 3) = List(1, 2, 3)` |
| **Tipado paramétrico** | Forma de especificar el tipo de elementos en la lista | `List[Int]`, `List[String]` |
| **Recursión de lista** | Patrón de procesar listas aplicando operaciones de forma recursiva | `x.tail.tail.head` |
| **Inmutabilidad** | Propiedad que impide cambios en la lista después de su creación | Las listas no se pueden modificar directamente |
| **Asociatividad derecha** | Propiedad del operador :: que se evalúa de derecha a izquierda | `a :: b :: c` = `a :: (b :: c)` |
| **Árbol unario** | Estructura recursiva donde cada nodo tiene un hijo | Lista es un árbol unario |

### Comentarios adicionales

- **Acceso indexado alternativo**: Aunque los ejemplos muestran acceso mediante `head` y `tail`, Scala también proporciona el acceso mediante índices usando paréntesis (p. ej., `x(0)` para el primer elemento), aunque esto es menos eficiente que el acceso funcional.

- **Pattern matching**: Las listas en Scala trabajan muy bien con pattern matching, permitiendo descomponerlas elegantemente en su estructura de `head :: tail`.

- **Operaciones comunes**: Las listas proporcionan muchas operaciones de orden superior como `map`, `filter`, `fold`, `reduce` que operan sobre toda la lista de manera funcional.

- **Rendimiento**: Aunque las listas enlazadas ofrecen operaciones de O(1) en la cabeza, para acceso aleatorio frecuente es más eficiente usar `Vector` o `Array`.

- **Varianza**: `List` es covariante en su parámetro de tipo, lo que significa que `List[Int]` es un subtipo de `List[Any]`.

- **Conversiones**: Las listas pueden convertirse fácilmente a otras colecciones como `Array`, `Vector`, `Set`, etc., usando métodos como `.toArray`, `.toVector`, `.toSet`.