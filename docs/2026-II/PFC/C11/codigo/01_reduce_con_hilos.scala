// Clase 11, sesión del grupo 50. Suma de un arreglo de diez millones de
// enteros medida con ScalaMeter en cinco formas: secuencial, con dos, cuatro
// y ocho hilos usando parallel anidado, con cuatro tareas usando task, y con
// umbral sobre una lista de valores.
//
// parallel y task vienen del paquete common de la plantilla del curso.

package taller

import org.scalameter._
import common._

object App {

  def medir(a: Array[Int], umbral: List[Int]): List[Any] =
    if (umbral.isEmpty) List()
    else {
      val time = withWarmer(new Warmer.Default) measure {
        val sum = reduceUmbral(a, umbral.head)
        // println(s"Suma con ${umbral.head}: $sum")
      }
      println(s"Tiempo con umbral ${umbral.head}: $time ms")
      time :: medir(a, umbral.tail)
    }

  def reduceSeq(a: Array[Int], i: Int, j: Int): Int = {
    @annotation.tailrec
    def aux(i: Int, acc: Int): Int =
      if (i >= j) acc
      else aux(i + 1, acc + a(i))
    aux(i, 0)
  }

  def reduceUmbral(a: Array[Int], umbral: Int): Int = {
    def reduce(a: Array[Int], i: Int, j: Int): Int =
      if (j - i <= umbral) reduceSeq(a, i, j) // Secuencial
      else {
        val m = i + (j - i) / 2
        val (r1, r2) = parallel(reduce(a, i, m), reduce(a, m, j))
        r1 + r2
      }
    reduce(a, 0, a.length)
  }

  def main(args: Array[String]): Unit = {
    val a = Array.fill(10000000)(1)
    // Secuencial
    val seqtime = withWarmer(new Warmer.Default) measure {
      val sum = reduceSeq(a, 0, a.length)
      // println(s"Sum: $sum")
    }
    println("El tiempo secuencial es: " + seqtime + " ms")
    // 2 hilos en paralelos
    val twothread = withWarmer(new Warmer.Default) measure {
      val (r1, r2) = parallel(reduceSeq(a, 0, a.length / 2), reduceSeq(a, a.length / 2, a.length))
      val sum = r1 + r2
      // println(s"Sum: $sum")
    }
    println("El tiempo con 2 hilos es: " + twothread + " ms")
    // 4 hilos en paralelos
    val fourthread = withWarmer(new Warmer.Default) measure {
      val ((r1, r2), (r3, r4)) =
        parallel(
          parallel(reduceSeq(a, 0, a.length / 4), reduceSeq(a, a.length / 4, a.length / 2)),
          parallel(
            reduceSeq(a, a.length / 2, 3 * a.length / 4),
            reduceSeq(a, 3 * a.length / 4, a.length)
          )
        )
      val sum = r1 + r2 + r3 + r4
      // println(s"Sum: $sum")
    }
    println("El tiempo con 4 hilos es: " + fourthread + " ms")
    // 8 hilos en paralelos
    val eightthread = withWarmer(new Warmer.Default) measure {
      val (((r1, r2), (r3, r4)), ((r5, r6), (r7, r8))) =
        parallel(
          parallel(
            parallel(reduceSeq(a, 0, a.length / 8), reduceSeq(a, a.length / 8, a.length / 4)),
            parallel(
              reduceSeq(a, a.length / 4, 3 * a.length / 8),
              reduceSeq(a, 3 * a.length / 8, a.length / 2)
            )
          ),
          parallel(
            parallel(
              reduceSeq(a, a.length / 2, 5 * a.length / 8),
              reduceSeq(a, 5 * a.length / 8, 3 * a.length / 4)
            ),
            parallel(
              reduceSeq(a, 3 * a.length / 4, 7 * a.length / 8),
              reduceSeq(a, 7 * a.length / 8, a.length)
            )
          )
        )
      val sum = r1 + r2 + r3 + r4 + r5 + r6 + r7 + r8
      // println(s"Sum: $sum")
    }

    println("El tiempo con 8 hilos es: " + eightthread + " ms")
    // Abstraccion task, 4 hilos
    //
    // El segundo rango va de a.length / 4 a a.length y se encima con los dos
    // siguientes, así que esta medición cubre más trabajo que las anteriores
    // y no se puede comparar con ellas. Para repartir en cuartos, el segundo
    // task va de a.length / 4 a a.length / 2.
    val fourthreadtask = withWarmer(new Warmer.Default) measure {
      val r1 = task(reduceSeq(a, 0, a.length / 4))
      val r2 = task(reduceSeq(a, a.length / 4, a.length))
      val r3 = task(reduceSeq(a, a.length / 2, 3 * a.length / 4))
      val r4 = task(reduceSeq(a, 3 * a.length / 4, a.length))
      val sum = r1.join() + r2.join() + r3.join() + r4.join()
    }
    println("El tiempo con 4 hilos con task es: " + fourthreadtask + " ms")
    val umbrales = List(100, 1000, 10000, 100000)
    medir(a, umbrales)
  }
}
