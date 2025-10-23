# Abstracción Task

Permite tener un **mayor control** de la ejecución a diferencia de `parallel`.

## Equivalencia entre Parallel y Task

```scala
val (v1, v2) = parallel(e1, e2)

// Es equivalente a:
val t1 = task(e1)
val t2 = task(e2)
val v1 = t1.join()
val v2 = t2.join()
```

Recordar que `join()` **detiene la ejecución** hasta que el hilo termine.

## Implementación con Task

```scala
def main(args: Array[String]): Unit = {
    val objSumar = new Sumar()
    val n = 50
    
    // Versión secuencial
    val resultado = objSumar.sumatoria(1, n)
    println(resultado)
    println(n*(n+1)*(2*n+1)/6) // Fórmula de Gauss para la suma de cuadrados

    // Paralelismo con 2 tareas usando task
    val t1 = task(objSumar.sumatoria(1, n/2))
    val t2 = task(objSumar.sumatoria(n/2 + 1, n))
    val r1 = t1.join()
    val r2 = t2.join()
    println(s"Resultados paralelos: ${r1 + r2}")
    
    // Paralelismo con 4 tareas usando task
    val t3 = task(objSumar.sumatoria(1, n/4))
    val t4 = task(objSumar.sumatoria(n/4 + 1, n/2))
    val t5 = task(objSumar.sumatoria(n/2 + 1, 3*n/4))
    val t6 = task(objSumar.sumatoria(3*n/4 + 1, n))
    val r3 = t3.join()
    val r4 = t4.join()
    val r5 = t5.join()  
    val r6 = t6.join()
    println(s"Resultados paralelos 4 tareas: ${r3 + r4 + r5 + r6}")
}
```

## Ventajas de Task sobre Parallel

Observese que a diferencia de `parallel` tenemos **control explícito** de cuándo se inician y se terminan los hilos.

## Tabla de Resumen

| Concepto | Definición | Ventajas | Ejemplo |
|----------|------------|----------|---------|
| **Abstracción Task** | Función que crea tareas ejecutables en paralelo | Control granular sobre ejecución | `task(objSumar.sumatoria(...))` |
| **Task vs Parallel** | Task ofrece más control que parallel | Inicio y fin explícitos de hilos | Separación entre creación y join |
| **Join** | Método que bloquea hasta que la tarea termine | Sincronización controlada | `t1.join()` |
| **Control de Hilos** | Gestión manual de ciclo de vida de hilos | Flexibilidad en la programación concurrente | Crear múltiples tasks antes de join |
| **Ejecución Asíncrona** | Las tasks se ejecutan concurrentemente | Mejor aprovechamiento de recursos | Múltiples tasks ejecutándose en paralelo |