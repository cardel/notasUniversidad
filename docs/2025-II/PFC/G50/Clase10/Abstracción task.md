# Abstracción task

Esta abstracción permite un **control más granular** sobre la ejecución paralela en comparación con `parallel`.

## Sintaxis básica

```scala
val t1 = task(e1)
val t2 = task(e2)
val v1 = t1.join()
val v2 = t2.join()
```

- **`task`** lanza la tarea de forma paralela
- **`join`** espera a que la tarea termine y toma su resultado

## Ejemplo implementado

```scala
package taller
import common._

object App {

  def sumaParcial(r: Int, a: Int, ini: Int, fin: Int): Long = {
    (ini to fin).foldLeft(0L)((acc: Long, i: Int) => (acc + a * Math.pow(r, i).toLong))
  }

  def main(args: Array[String]): Unit = {
    val r = 2 
    val a = 3
    val n = 50
    
    // Versión con 2 hilos usando task
    val t1 = task(sumaParcial(r, a, 0, n/2))
    val t2 = task(sumaParcial(r, a, n/2 + 1, n))
    val v1 = t1.join()
    val v2 = t2.join()
    println(v1 + v2)
    println(sumaParcial(r, a, 0, n))
    println((a * Math.pow(r, n + 1) - a) / (r - 1))

    // Versión con 4 hilos usando task
    val t3 = task(sumaParcial(r, a, 0, n/4))
    val t4 = task(sumaParcial(r, a, n/4 + 1, n/2))
    val t5 = task(sumaParcial(r, a, n/2 + 1, 3 * n/4))
    val t6 = task(sumaParcial(r, a, 3 * n/4 + 1, n))
    val v3 = t3.join()
    val v4 = t4.join()
    val v5 = t5.join()
    val v6 = t6.join()
    println(v3 + v4 + v5 + v6)
  }
}
```

## Ventaja sobre `parallel`

A diferencia de `parallel`, con `task` se tiene **control explícito** sobre cuándo se ejecutan y cuándo se unen los hilos, permitiendo una gestión más flexible de la ejecución paralela.