
```bash
 git clone git@github.com:cardel/plantilla-funcional.git
 
 cd plantilla-funcional
 rm -rf .git
```
![](attachments/2025-11-06-Note-09-00_annotated.pdf){ type=application/pdf style="min-height:70vh;width:100%"}

```scala
import scala.util.Random
import common._
import org.scalameter._

object Promedio {

  def promedioMovil(a: Vector[Int], k: Int): Vector[Double] = {
    val n = a.length
    // Genera promedios móviles para cada ventana de tamaño k
    (0 to n - k).map { i =>
      // Suma los elementos en la ventana actual y calcula el promedio
      (0 until k).map(t => a(i + t)).sum / k.toDouble
    }.toVector
  }

  def main(arr: Array[String]): Unit = {
    // Prueba básica con vector pequeño
    val v = Vector(2, 4, 5, 1, 3)
    println(promedioMovil(v, 3))
    
    // Benchmarking con vector grande
    val n = 1000000
    val k = 10
    val rand = new Random()
    val v2 = (1 to n).map(_ => rand.nextInt(1000)).toVector
    
    // Versión secuencial
    val t1 = withWarmer(new Warmer.Default) measure {
      val res = promedioMovil(v2, k)
    }
    println(s"Tiempo secuencial ${t1}")
    
    // Mostrar primeros y últimos resultados
    val res = promedioMovil(v2, k) // Se necesita calcular fuera del measure para mostrarlo
    println(res.take(10))
    println(res.drop(res.length - 10))
    println(res.length)
    
    // Versión paralela dividiendo el vector
    val v21 = v2.slice(0, (n - k) / 2 + k)
    val v22 = v2.slice((n - k) / 2 + 1, n)
    
    val t2 = withWarmer(new Warmer.Default) measure {
      val (r1, r2) = parallel(
        promedioMovil(v21, k),
        promedioMovil(v22, k)
      )
    }
    
    val (r1, r2) = parallel( // Se necesita calcular fuera del measure para usar los resultados
      promedioMovil(v21, k),
      promedioMovil(v22, k)
    )
    val rt = r1 ++ r2
    
    println(rt.take(10))
    println(rt.drop(rt.length - 10))
    println(rt.length)
    println(s"Tiempo con dos hilos ${t2}")
  }
}
```