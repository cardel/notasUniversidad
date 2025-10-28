# Ejercicio: Paralelización de Sumatoria Geométrica

## Problema
Paralelizar la siguiente operación:

$$
\sum \limits_{i=0}^n (0.5)^i
$$

Usando la estrategia de profundidad controlada.

## Implementación Paralela

```scala
package taller
import common._
import org.scalameter._

object App {

  def sumaParcial(arr: Array[Int], ini: Int, fin:Int, prof: Int, cnt: Int = 0): Double = {
    // Si es por el limite
    // if ((fin-ini) <= limite)
    // El limite es el tamaño del arreglo que aceptamos para paralelizar
    if (cnt >= prof)
        (ini until fin).foldLeft(0.0)((acc,e) => acc + Math.pow(0.5,arr(e)))
    else {
        val mit:Int = (ini + fin)/2
        val (s1, s2) = parallel(
            sumaParcial(arr, ini, mit, prof, cnt+1),
            sumaParcial(arr, mit, fin, prof, cnt+1)
        )
        s1 + s2
    }
}

  def main(args: Array[String]): Unit = {
    val l1 = (0 to 100000000).toArray
    
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

## Análisis de la Implementación

### Características del Algoritmo

**Estructura recursiva**:
- **Caso base**: Cuando `cnt >= prof`, ejecuta la sumatoria secuencialmente
- **Caso recursivo**: Divide el problema en dos mitades y las procesa en paralelo

**Parámetros de control**:
- `prof`: Profundidad máxima de paralelización
- `cnt`: Contador actual de profundidad
- `arr`: Array con los índices de 0 a n

### Operación Matemática
La función calcula:
```scala
Math.pow(0.5, arr(e))  // Donde arr(e) = i
```
Que corresponde a $(0.5)^i$ para cada término de la sumatoria.

### Estrategia de Paralelización

**Profundidad vs Hilos**:
- Profundidad 0: 1 hilo (secuencial)
- Profundidad 1: 2 hilos
- Profundidad 2: 4 hilos  
- Profundidad 4: 16 hilos
- Profundidad 8: 256 hilos

### Benchmarking Configurado

El código incluye medición de rendimiento con:
- **Warm-up de JVM** para estabilizar mediciones
- **Array de 100,000,001 elementos** (0 a 100,000,000)
- **Comparación de 5 niveles** de paralelización

## Consideraciones de Rendimiento

**Operación costosa**: `Math.pow(0.5, i)` es computacionalmente más intensiva que una simple suma, lo que puede:
- Aumentar el beneficio del paralelismo
- Hacer más evidente el overhead de gestión de hilos

**Patrón de acceso**: Acceso secuencial a memoria en cada segmento, favorable para caché

**Balance de carga**: División equitativa del trabajo entre hilos

## Resultados Esperados

Basado en análisis previos, se anticipa:
- **Mejor rendimiento** en profundidad 2 (4 hilos)
- **Rendimientos decrecientes** a mayor profundidad
- **Overhead significativo** con 16+ hilos
- **Aceleración limitada** por la ley de Amdahl

La sumatoria converge a 2 cuando $n \rightarrow \infty$, pero con $n = 100,000,000$ el resultado será extremadamente cercano a 2.