# Recursión en código

Para trabajar una función recursiva en un código debe especificarse:

1. **Caso base**: Retorno inmediato, que detiene la recursión
2. **Caso recursivo**: Me lleva al caso base y hace una operación que acumula los resultados

```scala
object Main{
  // Función: sumar una lista de enteros
  // Tipo: List[Int] -> Int
  // Caso base: si la lista está vacía, retorna 0
  // Caso recursivo: suma el primer elemento (head) con la suma del resto (tail)
  def sumar(l: List[Int]): Int = {
    if (l.isEmpty) 0  // Caso base
    else l.head + sumar(l.tail)  // Caso recursivo: acumula resultado
  }
  
  def main(args: Array[String]): Unit = {
    println(sumar(List(1, 2, 3, 4, 5, 6)))
  }
}
```

Cuando aplicamos `tail` muchas veces paulatinamente, vamos a llegar al caso base:

```scala
// Dada la lista x = List(1, 2, 3, 4, 5)

scala> x.head
val res5: Int = 1

scala> x.tail
val res6: List[Int] = List(2, 3, 4, 5)

scala> x.tail.head
val res7: Int = 2

scala> x.tail.tail
val res8: List[Int] = List(3, 4, 5)

scala> x.tail.tail.head
val res9: Int = 3

scala> x.tail.tail.tail
val res10: List[Int] = List(4, 5)

scala> x.tail.tail.tail.head
val res11: Int = 4

scala> x.tail.tail.tail.tail
val res12: List[Int] = List(5)

scala> x.tail.tail.tail.tail.head
val res13: Int = 5

scala> x.tail.tail.tail.tail.tail
val res14: List[Int] = List()  // Lista vacía: caso base alcanzado
```

**Traza de ejecución:**

Esto va a trabajar de la siguiente forma:

```
sumar(List(1, 2, 3, 4, 5, 6))
= 1 + sumar(List(2, 3, 4, 5, 6))
= 1 + 2 + sumar(List(3, 4, 5, 6))
= 1 + 2 + 3 + sumar(List(4, 5, 6))
= 1 + 2 + 3 + 4 + sumar(List(5, 6))
= 1 + 2 + 3 + 4 + 5 + sumar(List(6))
= 1 + 2 + 3 + 4 + 5 + 6 + sumar(List())  // Caso base alcanzado
= 1 + 2 + 3 + 4 + 5 + 6 + 0
= 21
```

---

# Conceptos teóricos complementarios

## Pila de llamadas (Call Stack)

Cuando se ejecuta una función recursiva, cada llamada se apila en la memoria. La profundidad de la pila corresponde a la cantidad de llamadas recursivas simultáneas. En el ejemplo anterior, la profundidad máxima es 6 (longitud de la lista).

```
Pila de llamadas para sumar(List(1, 2, 3)):

sumar(List(1, 2, 3))
  |
  +-- sumar(List(2, 3))
       |
       +-- sumar(List(3))
            |
            +-- sumar(List())  <- Caso base
```

## Recursión de cola (Tail Recursion)

Una función es **recursiva de cola** si la última operación es la llamada recursiva. En el ejemplo anterior, la función NO es recursiva de cola porque hace suma después de la llamada recursiva. Las funciones recursivas de cola pueden optimizarse para usar la misma pila.

**Ejemplo de recursión de cola:**

```scala
def sumarAcumulado(l: List[Int], acumulador: Int = 0): Int = {
  if (l.isEmpty) acumulador  // Caso base
  else sumarAcumulado(l.tail, acumulador + l.head)  // La llamada recursiva es la última operación
}
```

## Operaciones sobre listas

- **head**: Retorna el primer elemento de la lista
- **tail**: Retorna una nueva lista sin el primer elemento
- **isEmpty**: Verifica si la lista está vacía

---

# Tabla de resumen

| Concepto | Definición | Características | Ejemplo |
|---|---|---|---|
| **Caso Base** | Condición que detiene la recursión | Retorna un valor sin hacer llamadas recursivas | `if (l.isEmpty) 0` |
| **Caso Recursivo** | Llamada a la función sobre un problema menor | Se acerca al caso base en cada iteración | `l.head + sumar(l.tail)` |
| **Head** | Primer elemento de una lista | Acceso $O(1)$ | `List(1,2,3).head = 1` |
| **Tail** | Lista sin el primer elemento | Crea una nueva lista, acceso $O(1)$ | `List(1,2,3).tail = List(2,3)` |
| **Pila de llamadas** | Estructura que almacena llamadas activas | Cada recursión consume memoria | Profundidad máxima = tamaño del problema |
| **Recursión de cola** | Última operación es la llamada recursiva | Puede optimizarse (tail call optimization) | `sumarAcumulado(l.tail, acum + l.head)` |
| **isEmpty** | Verifica si una lista está vacía | Caso base típico para listas | `List().isEmpty = true` |

**Comentarios adicionales:**

- La recursión es especialmente útil para trabajar con **estructuras recursivas** como listas, árboles y grafos, donde cada elemento contiene una referencia a una estructura similar pero más pequeña.
- El orden de complejidad temporal de la función `sumar` es $O(n)$ donde $n$ es la longitud de la lista, ya que procesa cada elemento exactamente una vez.
- La complejidad espacial es $O(n)$ debido a la profundidad de la pila de llamadas. Para listas muy grandes, esto puede causar un **desbordamiento de pila** (stack overflow).
- La recursión de cola es preferible cuando es posible, ya que muchos compiladores (como el de Scala con la anotación `@tailrec`) pueden optimizarla a una iteración, eliminando el consumo adicional de pila.
- La **anotación `@tailrec`** en Scala verifica que una función sea recursiva de cola y permite optimizaciones del compilador.