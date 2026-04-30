
```scala
// Sesion 11 - Complejidad de la PC
// ScalaMeter: version industrial de la rutina manual de 04_medir.scala.
// Esta es la presentacion minima que se usa en clase: 'measure { }'
// directo y, cuando aparece el problema de calentamiento, envolverlo
// con 'withWarmer(new Warmer.Default)'.
//
// Dependencia (build.sbt):
//   libraryDependencies +=
//     "com.storm-enroute" %% "scalameter" % "0.21"

package taller

import org.scalameter._

object App {

  // Suma recursiva de cola sobre un arreglo (caso de prueba).
  @scala.annotation.tailrec
  def sumarArray(arr: Array[Int], i: Int = 0, acc: Long = 0L): Long = {
    if (i == arr.length) acc
    else sumarArray(arr, i + 1, acc + arr(i))
  }

  // ---------------------------------------------------------------
  // Variante 1: 'measure' directo. Las primeras dos mediciones
  // suelen estar desfasadas por el calentamiento de la JVM.
  // ---------------------------------------------------------------
  def medir(n: Int, arr: Array[Int], i: Int = 1): Unit = {
    if (i <= n) {
      val t = measure {
        sumarArray(arr)
      }
      println(t)
      medir(n, arr, i + 1)
    }
  }

  // ---------------------------------------------------------------
  // Variante 2: con Warmer.Default. ScalaMeter espera al estado
  // estable de la JVM antes de devolver la medicion. El primer
  // tiempo ya no esta inflado.
  // ---------------------------------------------------------------
  def medirConWarmer(n: Int, arr: Array[Int], i: Int = 1): Unit = {
    if (i <= n) {
      val t = withWarmer(new Warmer.Default) measure {
        sumarArray(arr)
      }
      println(t)
      medirConWarmer(n, arr, i + 1)
    }
  }

  def main(args: Array[String]): Unit = {
    val arr: Array[Int] = (1 to math.pow(10, 8).toInt).toArray

    println("--- measure directo (primeros tiempos desfasados) ---")
    medir(10, arr)

    println("--- con Warmer.Default (estado estable) ---")
    medirConWarmer(10, arr)
  }
}

```