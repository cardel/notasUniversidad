# Abstracción Parallel

Esta abstracción nos permite ejecutar dos o más instrucciones en **paralelo**.

`parallel(e1, e2)` toma dos instrucciones y las computa en paralelo:

![[Pasted image 20251023081213.png]]

Esto nos permite automatizar las tareas de:

1. **Start**: Arrancar el hilo
2. **Join**: Esperar a que el hilo termine y retornar al hilo main

## Implementación de Parallel

```scala
def parallel[A, B](taskA: => A, taskB: => B): (A, B) = {
    scheduler.value.parallel(taskA, taskB)
}

def parallel[A, B, C, D](taskA: => A, taskB: => B, taskC: => C, taskD: => D): (A, B, C, D) = {
    val ta = task { taskA }
    val tb = task { taskB }
    val tc = task { taskC }
    val td = taskD
    (ta.join(), tb.join(), tc.join(), td)
}
```

Tenemos dos versiones: una para dos tareas y otra para cuatro tareas.

Para las librerías provistas en el curso:

```scala
import common._
```

## Ejemplo: Suma de Cuadrados

![[Pasted image 20251023082716.png]]

En el caso de la $\sum \limits_{i=1}^{50} i^2$ puedo hacerla así: $\sum \limits_{i=1}^{25} i^2 + \sum \limits_{i=26}^{50} i^2$. Obsérvese que voy a tener un inicio (i = 1 o i = 26) y un final (n = 25 o n = 50), esta partición es una **partición lógica**.

## Implementación de la Sumatoria

```scala
class Sumar {
    def sumatoria(ini: Int, fin: Int): Int = {
        if (ini >= fin) ini*ini
        else ini*ini + sumatoria(ini + 1, fin)
        // Alternativa: (ini to fin).map(x => x * x).sum
    }
}
```

Aquí tenemos la **partición por segmentos**, desde inicio hasta final.

## Ejecución Paralela

```scala
def main(args: Array[String]): Unit = {
    val objSumar = new Sumar()
    val n = 50
    
    // Versión secuencial
    val resultado = objSumar.sumatoria(1, n)
    println(resultado)
    println(n*(n+1)*(2*n+1)/6) // Fórmula de Gauss para la suma de cuadrados

    // Paralelismo con 2 tareas
    val (r1, r2) = parallel(
        objSumar.sumatoria(1, n/2),
        objSumar.sumatoria(n/2 + 1, n)
    )
    println(s"Resultados paralelos: ${r1 + r2}")
    
    // Paralelismo con 4 tareas
    val (r3, r4, r5, r6) = parallel(
        objSumar.sumatoria(1, n/4),
        objSumar.sumatoria(n/4 + 1, n/2),
        objSumar.sumatoria(n/2 + 1, 3*n/4),
        objSumar.sumatoria(3*n/4 + 1, n)
    )
    println(s"Resultados paralelos 4 tareas: ${r3 + r4 + r5 + r6}")
}
```

## Tabla de Resumen

| Concepto | Definición | Propósito | Ejemplo |
|----------|------------|-----------|---------|
| **Abstracción Parallel** | Función que ejecuta tareas en paralelo | Automatizar ejecución concurrente | `parallel(taskA, taskB)` |
| **Partición Lógica** | División de un problema en subproblemas independientes | Permitir procesamiento paralelo | Dividir suma en rangos |
| **Sumatoria Paralela** | Cálculo distribuido de sumas | Acelerar operaciones matemáticas | `sumatoria(1, n/2)` |
| **Fórmula de Gauss** | Fórmula matemática para suma de cuadrados | Verificar resultados | $n(n+1)(2n+1)/6$ |
| **Task** | Unidad de trabajo en paralelo | Representar computación independiente | `task { sumatoria(...) }` |
| **Join** | Sincronización de finalización | Esperar resultados de tareas | `ta.join()` |