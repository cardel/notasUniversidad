# Listas

Las listas son estructuras recursivas inmutables. Tienen dos casos:

1. **Nil**: que es la lista vacía `List[Nothing]`
2. **head :: tail**: donde tenemos la cabeza y la cola

Las funciones con listas consideran estos dos casos:

```scala
// Función recursiva para sumar los elementos de una lista usando pattern matching
def sumaList(lst: List[Int]): Int = {
  lst match {
    case Nil => 0  // Caso base: lista vacía, suma es 0
    case x :: xs => x + sumaList(xs)  // Caso recursivo: suma cabeza + suma de la cola
  }
}

// Esto es equivalente usando métodos de la lista
def sumaList(lst: List[Int]): Int = {
  if (lst.isEmpty) 0  // Si la lista está vacía, retorna 0
  else {
    lst.head + sumaList(lst.tail)  // Suma la cabeza con la suma recursiva de la cola
  }
}
```

El reconocimiento de patrones sobre listas considera:

1. **Nil** o **List()**: es la lista vacía
2. **x :: xs**: x es la cabeza, xs es la cola
3. **List(x)**: lista de un solo elemento, es equivalente a `x :: Nil`

Preferimos el operador **::** ya que es más expresivo que `List`, el cual no nos permite capturar la cola directamente en el pattern matching.

## Operaciones con listas

1. **head**: Extrae la cabeza (primer elemento)
2. **tail**: Extrae la cola (todos los elementos excepto el primero)
3. **length**: Da el tamaño de la lista
4. **drop(n)**: elimina los n primeros elementos
5. **take(n)**: retorna los primeros n elementos
6. **splitAt(n)**: divide la lista en dos, la primera tiene n elementos y la segunda el resto
7. **x.init**: Retorna la lista sin el último elemento
8. **x.last**: Retorna el último elemento

En general, las funciones se pueden consultar aquí: [Documentación Scala Listas](https://www.scala-lang.org/api/current/scala/collection/immutable/List.html)

Ahora podemos hacer reconocimiento de listas de cualquier tipo usando **wildcards** (comodines de tipo):

```scala
// Función genérica para calcular la longitud de una lista de cualquier tipo
def longitud[T](lst: List[T]): Int = {
  lst match {
    case Nil => 0  // Caso base: lista vacía tiene longitud 0
    case x :: xs => 1 + longitud(xs)  // Caso recursivo: 1 + longitud de la cola
  }
}
```

Cuando ejecutamos por ejemplo:

```scala
longitud(List(1, 2, 3))  // T = Int, porque asocia List[T] = List[Int]
longitud(List("a", "hola"))  // T = String porque List[T] = List[String]
```

El **genérico** es muy útil cuando no nos importa el tipo de los elementos de la lista, solo queremos operar sobre su estructura.

## Conceptos teóricos adicionales

**Inmutabilidad**: Las listas en Scala son inmutables por defecto. Cada operación que parece modificar una lista en realidad crea una nueva lista. Esto es fundamental para la programación funcional y evita efectos secundarios.

**Recursividad estructural**: Las listas son estructuras recursivas por naturaleza. La definición de una lista es: una lista es vacía (Nil) o un elemento seguido de otra lista (head :: tail). Esta definición se presta naturalmente a algoritmos recursivos.

**Pattern matching exhaustivo**: Al usar pattern matching con listas, es importante cubrir todos los casos posibles. Para listas, esto generalmente significa cubrir el caso Nil (lista vacía) y el caso x :: xs (lista no vacía).

**Evaluación perezosa vs estricta**: Las listas en Scala son estrictas (eager), lo que significa que todos sus elementos se calculan inmediatamente. Scala también ofrece versiones perezosas (lazy) como LazyList para procesamiento de secuencias infinitas o grandes.

**Complejidad temporal**: 
- Acceder al primer elemento (head): $O(1)$
- Acceder al último elemento (last): $O(n)$
- Añadir elemento al principio (::): $O(1)$
- Añadir elemento al final: $O(n)$ (requiere reconstruir toda la lista)

**Constructores de lista**: Además de `List()` y `::`, Scala ofrece:
- `List.fill(n)(elemento)`: crea una lista con n copias del elemento
- `List.range(inicio, fin)`: crea una lista de números en un rango
- `List.tabulate(n)(f)`: crea una lista aplicando la función f a índices 0..n-1

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scala | Complejidad |
|----------|-------------|------------------|-------------|
| **Lista inmutable** | Estructura de datos que no puede modificarse después de creada | `val lst = List(1, 2, 3)` | - |
| **Nil** | Representa la lista vacía | `Nil` o `List()` | - |
| **Operador ::** | Constructor de listas (cons) | `1 :: 2 :: Nil` | $O(1)$ para añadir al inicio |
| **Pattern matching** | Descomposición de listas en casos | `case x :: xs => ...` | - |
| **head** | Primer elemento de la lista | `lst.head` | $O(1)$ |
| **tail** | Todos los elementos excepto el primero | `lst.tail` | $O(1)$ |
| **isEmpty** | Verifica si la lista está vacía | `lst.isEmpty` | $O(1)$ |
| **length** | Número de elementos en la lista | `lst.length` | $O(n)$ |
| **drop(n)** | Elimina los primeros n elementos | `lst.drop(2)` | $O(n)$ |
| **take(n)** | Toma los primeros n elementos | `lst.take(2)` | $O(n)$ |
| **init** | Lista sin el último elemento | `lst.init` | $O(n)$ |
| **last** | Último elemento de la lista | `lst.last` | $O(n)$ |
| **splitAt(n)** | Divide la lista en posición n | `lst.splitAt(2)` | $O(n)$ |
| **Genéricos [T]** | Permite trabajar con listas de cualquier tipo | `def f[T](lst: List[T])` | - |
| **Recursividad estructural** | Algoritmos que siguen la estructura recursiva de la lista | Funciones como `sumaList` | - |

## Comentarios adicionales

1. **Ventajas de la inmutabilidad**: 
   - Seguridad en concurrencia (thread-safe)
   - Predictibilidad del código
   - Facilita el razonamiento sobre el programa
   - Permite compartir estructura entre listas

2. **Uso de recursividad vs métodos de orden superior**: Aunque la recursividad es fundamental para entender listas, en la práctica se prefieren métodos como `map`, `filter`, `fold`, `reduce` que son más expresivos y menos propensos a errores.

3. **Listas vs Arrays**: Las listas son mejores para operaciones recursivas y procesamiento secuencial, mientras que los arrays son mejores para acceso aleatorio por índice.

4. **Estructura de lista enlazada**: Internamente, las listas de Scala son listas enlazadas simples, donde cada nodo contiene un elemento y una referencia al siguiente nodo.

5. **Optimización de recursividad de cola**: Para listas grandes, es importante escribir funciones recursivas de cola (tail-recursive) para evitar desbordamiento de pila. Scala puede optimizar estas funciones.

6. **Combinación de operaciones**: Las operaciones de lista se pueden encadenar: `lst.filter(_ > 0).map(_ * 2).take(5)`

7. **Listas y for-comprehensions**: Scala permite usar listas en expresiones for:
   ```scala
   for (x <- List(1, 2, 3); y <- List(4, 5)) yield x + y
   ```

8. **Listas infinitas**: Aunque las listas regulares no pueden ser infinitas, Scala ofrece `LazyList` (antes Stream) para representar secuencias potencialmente infinitas evaluadas perezosamente.