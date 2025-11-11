# Paralelismo de tareas con Reduce

## Operaciones de reducción en programación funcional

En programación funcional existen dos operaciones fundamentales para reducción:

1. **reduce**: Utiliza el primer o último elemento como acumulador inicial
2. **fold**: Permite especificar explícitamente el acumulador inicial

## Asociatividad y paralelización

La asociatividad es crucial para la paralelización. Podemos asociar por la izquierda o por la derecha, obteniendo el mismo resultado siempre que la operación sea **asociativa**.

**Ejemplo con suma:**
```
1, 2, 3, 4
((1 + 2) + 3) + 4 = 10
1 + (2 + (3 + 4)) = 10
```

Cuando la operación es asociativa, podemos dividir el problema en múltiples partes:

```
1, 2, ..., 50 + 51, 52, ..., 100
```

Esta propiedad permite distribuir el cómputo entre múltiples procesadores.

## Implementación con árboles de operaciones

Los árboles de operaciones modelan expresiones en notación infija:
- **Nodos** almacenan operaciones
- **Hojas** contienen valores numéricos

![Árbol de operaciones](attachments/Pasted%20image%2020251111093757.png)

## Definición de la estructura de árbol

```scala
package taller

// Árbol binario para representar operaciones
sealed abstract class Tree[A]

// Hoja: contiene un valor individual
case class Leaf[A](value: A) extends Tree[A]

// Nodo: combina dos subexpresiones
case class Node[A](left: Tree[A], right: Tree[A]) extends Tree[A]
```

## Implementación de reduce paralelo

```scala
package taller
import common._

object App {

  /**
   * Reduce paralelo que aplica una función asociativa a un árbol
   * @param tree Árbol de entrada
   * @param f Función asociativa binaria
   * @tparam A Tipo de los elementos
   * @return Resultado de aplicar la reducción
   */
  def reduce[A](tree: Tree[A], f: (A, A) => A): A = tree match {
    case Leaf(value) => 
      // Caso base: retornar el valor de la hoja
      value
    case Node(left, right) =>
      // Caso recursivo: procesar subárboles en paralelo
      val (rl, rr) = parallel(
        reduce[A](left, f),  // Reducir subárbol izquierdo
        reduce[A](right, f)  // Reducir subárbol derecho
      )
      f(rl, rr)  // Combinar resultados
  }

  def main(args: Array[String]): Unit = {
    // Construir árbol para valores 1, 2, 3, 4, 5, 6, 7, 8
    val t1 = Node(
      Node(
        Node(Leaf(1), Leaf(2)),  // Subárbol: 1, 2
        Node(Leaf(3), Leaf(4))   // Subárbol: 3, 4
      ),
      Node(
        Node(Leaf(5), Leaf(6)),  // Subárbol: 5, 6
        Node(Leaf(7), Leaf(8))   // Subárbol: 7, 8
      ) 
    )
    
    val rt1 = reduce[Int](t1, (a: Int, b: Int) => a + b)
    println(s"Resultado de la suma: ${rt1}")
  }
}
```

## Discusión sobre paralelización de reduce

### Requisitos para paralelización

1. **Asociatividad**: La operación `f` debe cumplir `f(a, f(b, c)) = f(f(a, b), c)`
2. **Neutralidad del orden**: El resultado debe ser independiente del orden de evaluación

### Ventajas del enfoque con árboles

- **Paralelismo explícito**: La estructura del árbol define naturalmente las tareas paralelas
- **Balance automático**: El árbol balanceado distribuye equitativamente el trabajo
- **Composición**: Fácil extensión a operaciones más complejas

### Ejecución del ejemplo

El árbol `t1` representa:
```
      /\
     /  \
    /\   /\
   /\ /\ /\ \
  1 2 3 4 5 6 7 8
```

La evaluación paralela:
- Nivel 1: `(1+2)`, `(3+4)`, `(5+6)`, `(7+8)` en paralelo
- Nivel 2: `(3+7)`, `(11+15)` en paralelo  
- Nivel 3: `10+26 = 36`

### Consideraciones de implementación

- La función `parallel` ejecuta las reducciones de subárboles concurrentemente
- Cada nivel del árbol puede procesarse en paralelo
- El tiempo de ejecución es proporcional a la profundidad del árbol en lugar del número total de elementos

### Aplicaciones típicas

- Operaciones matemáticas: suma, multiplicación, máximo, mínimo
- Operaciones lógicas: AND, OR
- Concatenación de strings (cuando es asociativa)
- Operaciones sobre colecciones grandes