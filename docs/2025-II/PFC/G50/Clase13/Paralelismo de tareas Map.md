# Paralelismo de tareas

## Operaciones disponibles para colecciones

1. **map**: Aplica una función a cada elemento
2. **fold**: Combina los elementos con una operación dada  
3. **scan**: Devuelve la lista de los resultados parciales de aplicar fold

## Consideraciones sobre estructuras de datos

La colección `List` no es la mejor opción para paralelizar. Al ser una estructura basada en cabeza y cola, es muy costoso dividirla en mitades:

```scala
(cons 1 (cons 2 (cons 3 (cons 4 (cons ... (cons n-1 empty)))))
```

Para paralelización se prefieren:
1. **Arrays** y **Vectores**
2. **Árboles**

## Paralelización de Map

El `map` es fácil de paralelizar porque aplica una función **independientemente** a cada elemento de la colección.

Ejemplo secuencial:
```scala
Vector(1, 2, 3, 4).map(x => x * x)
```

## Implementación paralela con división recursiva

```scala
package taller
import common._

object App {
  val limite = 1000  // Umbral para ejecución secuencial
  
  /**
   * Implementación paralela de map usando división recursiva
   * @param arr Vector de entrada
   * @param f Función a aplicar
   * @param ini Índice inicial del segmento
   * @param fin Índice final del segmento
   * @return Vector con la función aplicada a cada elemento
   */
  def mapP(arr: Vector[Int], f: Int => Int, ini: Int, fin: Int): Vector[Int] = {
    if (fin - ini >= limite) {
      // Caso paralelo: dividir el problema
      val mid = (fin + ini) / 2
      val (r1, r2) = parallel(
        mapP(arr, f, ini, mid),      // Procesar primera mitad en paralelo
        mapP(arr, f, mid + 1, fin)   // Procesar segunda mitad en paralelo
      )
      r1 ++ r2  // Combinar resultados
    } else {
      // Caso base: ejecución secuencial
      (ini to fin).map(i => f(arr(i))).toVector
    }
  }

  def main(args: Array[String]): Unit = {
    val n = 1000000
    val arr = (1 to n).toVector
    val res = mapP(arr, (x => 2 * x), 0, n - 1)
    println(res.length)
    println(res.take(10) ++ res.drop(n - 10))
  }
}
```

## Implementación con estructura de árbol

Definición del árbol para representar la división del problema:

```scala
// Árbol binario para representar la división del problema
sealed abstract class Tree[A] { val size: Int }

// Hoja: contiene un segmento del arreglo
case class Leaf[A](a: Array[A]) extends Tree[A] {
  override val size = a.size
}

// Nodo: combina dos subárboles
case class Node[A](l: Tree[A], r: Tree[A]) extends Tree[A] {
  override val size = l.size + r.size
}
```

Implementación de `map` paralelo usando árboles:

```scala
package taller
import common._

object App {
  val limite = 1000
  
  /**
   * Map paralelo usando estructura de árbol
   * @param t Árbol de entrada
   * @param f Función a aplicar
   * @tparam A Tipo de entrada
   * @tparam B Tipo de salida
   * @return Árbol con la función aplicada
   */
  def mapTree[A: Manifest, B: Manifest](t: Tree[A], f: A => B): Tree[B] = 
    t match {
      case Leaf(a) => 
        // Caso base: aplicar función secuencialmente al segmento
        Leaf(a.map(f))
      case Node(l, r) => 
        // Caso recursivo: procesar subárboles en paralelo
        val (lr, rr) = parallel(
          mapTree(l, f),  // Procesar subárbol izquierdo
          mapTree(r, f)   // Procesar subárbol derecho
        )
        Node(lr, rr)  // Combinar resultados
    }

  def main(args: Array[String]): Unit = {
    // Ejemplo pequeño
    val arr2 = Array(1, 2, 3, 4, 5, 6)
    val f = (x: Int) => 2 * x
    
    val t: Tree[Int] = Node(
      Leaf(arr2.slice(0, 3)),  // Primera mitad
      Leaf(arr2.slice(3, 6))   // Segunda mitad
    )
    
    val tf = mapTree[Int, Int](t, f)
    println(tf)
    
    // Ejemplo grande: dividir en 8 partes
    val n = 1000000
    val arr3 = (1 to n).toArray
    
    val t2 = Node(
      Node(
        Node(
          Leaf(arr3.slice(0, n/8)),        // Parte 1
          Leaf(arr3.slice(n/8, 2*n/8))     // Parte 2
        ),
        Node(
          Leaf(arr3.slice(2*n/8, 3*n/8)),  // Parte 3
          Leaf(arr3.slice(3*n/8, 4*n/8))   // Parte 4
        )
      ),
      Node(
        Node(
          Leaf(arr3.slice(4*n/8, 5*n/8)),  // Parte 5
          Leaf(arr3.slice(5*n/8, 6*n/8))   // Parte 6
        ),
        Node(
          Leaf(arr3.slice(6*n/8, 7*n/8)),  // Parte 7
          Leaf(arr3.slice(7*n/8, 8*n/8))   // Parte 8
        )
      )
    )
    
    val rt2 = mapTree[Int, Int](t2, f)
    println(rt2)
  }
}
```

## Discusión sobre paralelización en Scala

### Estrategias de paralelización

1. **División recursiva**: Divide el problema hasta alcanzar un tamaño umbral, luego procesa secuencialmente
2. **Estructuras de árbol**: Representan explícitamente la división del trabajo

### Consideraciones de rendimiento

- **Umbral óptimo**: El valor de `limite` debe calibrarse según el hardware y la complejidad de la función
- **Overhead de paralelización**: La creación de tareas tiene costo, por eso se usa un umbral mínimo
- **Balance de carga**: Las estructuras de árbol permiten un balance más controlado

### Resultados comparativos

- **División recursiva**: Aceleración de ~6x
- **Estructura de árbol**: Aceleración de ~6.6x

La mejor aceleración con árboles se debe a:
- Menor overhead en la división del trabajo
- Mejor balance de carga entre procesadores
- Estructura más adecuada para paralelismo de datos

### Buenas prácticas

- Usar `parallel` para ejecución concurrente
- Elegir estructuras con acceso aleatorio eficiente (Arrays, Vectores)
- Evitar estructuras secuenciales (List) para operaciones paralelas
- Calibrar el umbral según la aplicación específica