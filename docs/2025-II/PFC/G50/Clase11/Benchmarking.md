Para evaluar programas paralelos debemos considerar los factores que afectan su ejecución

- Velocidad del CPU
- Número de CPUs/cores
- Latencia y acceso a memoria
- Comportamiento de la memoria caches
- Comportamiento en tiempo de ejecución de la JVM (recolector de basura, planificador de hilos, etc)

# Scalametter

- Permite hacer pruebas de rendimiento en tiempo de ejecución
- Es una librería externa que se debe agregar
- Evaluación comparativa es decir Benchmarking

# Medición

Para hacer la medición necesitamos

```scala
import org.scalameter._
```
Recordar que es necesario agregar la librería de scalameter en la compilación, sbt, maven o gradle. En el caso de gradle debo editar el archivo build.gradle y en la sección de dependencies agregar

```grovy
    implementation 'com.storm-enroute:scalameter-core_2.13:0.21'
```

Ahora para hacer una medición

```scala
    val s1 = measure {(1 to 100000).sum}
    val s2 = measure {(1 to 100000).sum}
    val s3 = measure {(1 to 100000).sum}
    println(s1)
    println(s2)
    println(s3)
```

Esto permite medir el tiempo que se tarda una operación.

Observe que en este caso los resultado son:

```bash
1.276233 ms
0.011542 ms
0.008977 ms
```
El primero tarda 100 veces más otros, dado que la JVM esta en proceso de **calentamiento** esta cargando cosas como el recolector de basuras, el JIT, etc y esto agrega tiempo de ejecución e interfiere con la medición.

Para evitar esto ScalaMeter ofrece un mecanismo para esperar la máquina virtual esté en estado estable.

```scala
   val s1 = withWarmer (new Warmer.Default) measure {(1 to 100000).sum}
    val s2 = withWarmer (new Warmer.Default) measure {(1 to 100000).sum}
    val s3 = withWarmer (new Warmer.Default) measure {(1 to 100000).sum}
    println(s1)
    println(s2)
    println(s3)
```

```bash
0.013906 ms
0.005731 ms
0.005661 ms
```

Observese que los tiempos dieron más similares.

# Analisis de rendimiento

```scala
package taller
import common._
import org.scalameter._

object App {

  def sumaParcial(arr: Array[Int], ini: Int, fin:Int, prof: Int, cnt: Int = 0): Int = {
if (cnt >= prof)
		  (ini until fin).foldLeft(0)((acc,e) => acc + arr(e))
	  else{
		val mit:Int = (ini + fin)/2
		val (s1, s2) = parallel(
			sumaParcial(arr, ini, mit, prof, cnt+1),
			sumaParcial(arr, mit, fin, prof, cnt+1)
		  )
		s1 + s2
	}
}

  def main(args: Array[String]): Unit = {
    val l1 = (1 to 100000000).toArray
    
    val t1 = withWarmer(new Warmer.Default) measure {
      val suma = sumaParcial(l1, 0, l1.length, 0)
      println(s"Suma: $suma")
    }
    val t2 = withWarmer(new Warmer.Default) measure {
      val suma = sumaParcial(l1, 0, l1.length, 1)
      println(s"Suma: $suma")
    }
    val t3 = withWarmer(new Warmer.Default) measure {
      val suma = sumaParcial(l1, 0, l1.length, 2)
      println(s"Suma: $suma")
    }
    val t4 = withWarmer(new Warmer.Default) measure {
      val suma = sumaParcial(l1, 0, l1.length, 4)
      println(s"Suma: $suma")
    }

    val t5 = withWarmer(new Warmer.Default) measure {
      val suma = sumaParcial(l1, 0, l1.length, 8)
      println(s"Suma: $suma")
    }
    println(t1)
    println(t2)
    println(t3)
    println(t4)
    println(t5)
  }

}
```

Los resultados son:

```scala
491.357642 ms
299.135194 ms
265.240235 ms
269.909813 ms
265.136039 ms
```
1. El primero es secuencial y tardo 491 ms
2. El segundo es con profundidad 1 (2 hilos) dio 300 ms
3. El tercero es con profundidad 2 (4 hilos) dio 265 ms.
4. El cuarto es con profundidad 4 (16 hilos) dio 269 ms (empeoro) hay dos limitaciones 1) el tiempo de gestion de hilos 2) Limitación del CPU
5. El quinto es con profundidad 8 (256 hilos) dio 265 ms presenta la misma razon
La aceleración se calcula tomando en cuenta el tiempo secuencial y el tiempo paralelo

6. $\frac{491}{299} = 1.667$ 
7. $\frac{499}{265}=1.85$
8. $\frac{499}{269} = 1.82$
9. $\frac{499}{265}=1.85$

En este caso la mejor configuración es con profunidad 2 que son 4 hilos, dando una aceleración de 1.85