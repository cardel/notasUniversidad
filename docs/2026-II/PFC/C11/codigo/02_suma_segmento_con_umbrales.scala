// Clase 11, sesión del grupo 51. La misma suma de diez millones de enteros,
// medida con ScalaMeter en secuencial, con dos y con cuatro hilos, y después
// con umbral sobre siete valores para buscar el que mejor rinde en la máquina
// donde se corre. medirRepetido toma varias mediciones del secuencial, que es
// de donde salen el promedio y la desviación del informe.
//
// parallel viene del paquete common de la plantilla del curso.

package taller

import org.scalameter._
import common._

object App {
  def sumaSeg(arr: Array[Int], s: Int, t: Int): Int = {
    @annotation.tailrec
    def aux(i: Int, acc: Int): Int =
      if (i >= t) acc
      else aux(i + 1, acc + arr(i))
    aux(s, 0)
  }

  // Partir el segmento en dos deja una suma pendiente después de las dos
  // llamadas, así que aux no es recursión de cola y no lleva @tailrec.
  def sumaSegPar(arr: Array[Int], umbral: Int): Int = {
    def aux(s: Int, t: Int): Int =
      if (t - s <= umbral) sumaSeg(arr, s, t)
      else {
        val m = (s + t) / 2
        val (r1, r2) = parallel(aux(s, m), aux(m, t))
        r1 + r2
      }
    aux(0, arr.length)
  }

  def medirUmbral(umbrales: List[Int], arr: Array[Int], warmer: Warmer): Unit =
    if (!umbrales.isEmpty) {
      val umbral = umbrales.head
      val time = withWarmer(warmer) measure {
        val result = sumaSegPar(arr, umbral)
      }
      println(s"Tiempo con umbral $umbral: $time ms")
      medirUmbral(umbrales.tail, arr, warmer)
    }

  // Para tomar varias mediciones
  // Ejemplo para el secuencial
  def medirRepetido(n: Int, arr: Array[Int]): Unit =
    if (n > 0) {
      val warmer = new Warmer.Default
      val time = withWarmer(warmer) measure {
        val result = sumaSeg(arr, 0, arr.length)
      }
      println(s"Tiempo secuencial: $time ms")
      medirRepetido(n - 1, arr)
    }

  def main(args: Array[String]): Unit = {
    val arr = Array.fill(10000000)(5)
    // Secuencial
    val warmer = new Warmer.Default
    val seqtime = withWarmer(warmer) measure {
      val result = sumaSeg(arr, 0, arr.length)
    }
    println(s"Tiempo secuencial: $seqtime ms")
    // Dos hilos con parallel
    val twothreadtime = withWarmer(warmer) measure {
      val (r1, r2) =
        parallel(sumaSeg(arr, 0, arr.length / 2), sumaSeg(arr, arr.length / 2, arr.length))
      val result = r1 + r2
    }
    println(s"Tiempo con dos hilos: $twothreadtime ms")
    // Cuatro hilos con parallel
    val fourthreadtime = withWarmer(warmer) measure {
      val ((r1, r2), (r3, r4)) = parallel(
        parallel(sumaSeg(arr, 0, arr.length / 4), sumaSeg(arr, arr.length / 4, arr.length / 2)),
        parallel(
          sumaSeg(arr, arr.length / 2, 3 * arr.length / 4),
          sumaSeg(arr, 3 * arr.length / 4, arr.length)
        )
      )
      val result = r1 + r2 + r3 + r4
    }
    println(s"Tiempo con cuatro hilos: $fourthreadtime ms")
    val umbrales = List(500, 1000, 2000, 5000, 10000, 20000, 50000)
    medirUmbral(umbrales, arr, warmer)
    medirRepetido(5, arr)
  }
}
