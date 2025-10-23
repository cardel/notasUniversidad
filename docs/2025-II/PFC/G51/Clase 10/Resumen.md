# Resumen de Computación Paralela y Concurrente

## Conceptos Fundamentales

| Concepto | Definición | Características | Aplicación |
|----------|------------|-----------------|------------|
| **Computación Paralela** | Ejecución simultánea de cálculos usando sistemas multinúcleo | Enfoque en aceleración y eficiencia | División de problemas en subproblemas |
| **Programación Paralela** | Uso de hardware paralelo para computaciones rápidas | Eficiencia y velocidad | Algoritmos paralelos |
| **Programación Concurrente** | Ejecución que puede o no ser simultánea | Modularidad, capacidad de respuesta, escalabilidad | Desarrollo de software |
| **Proceso** | Instancia de sistema operativo con tareas paralelas | Aislamiento de memoria entre procesos | Ejecución de aplicaciones |
| **Hilo** | Unidad de ejecución de instrucciones secuenciales | Comparte memoria del proceso, tiene pila propia | Programación concurrente |
| **No Determinismo** | Ejecución no predecible de hilos | Orden variable entre ejecuciones | Programación concurrente |

## Niveles de Paralelismo

| Nivel | Descripción | Ejemplos |
|-------|-------------|----------|
| **Bits** | Procesamiento paralelo de bits | Instrucciones a nivel de CPU |
| **Instrucciones** | Ejecución simultánea de diferentes instrucciones | Pipeline de CPU |
| **Tareas** | Ejecución paralela de flujos de instrucciones | Algoritmos paralelos |

## Abstracciones en Scala

| Abstracción | Propósito | Ventajas | Ejemplo |
|-------------|-----------|----------|---------|
| **Parallel** | Ejecutar tareas en paralelo | Automatización de start/join | `parallel(e1, e2)` |
| **Task** | Control granular de ejecución | Flexibilidad en gestión de hilos | `task(e1).join()` |
| **Synchronized** | Garantizar atomicidad | Prevenir condiciones de carrera | `synchronized { ... }` |
| **Join** | Sincronizar finalización de hilos | Esperar resultados | `t1.join()` |

## Patrones de Paralelización

| Patrón                     | Estrategia                                                                                | Caso de Uso                           |
| -------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- |
| **División por Segmentos** | Partición lógica del problema. Segumento disyuntos y que su union de el segmento original | Suma de cuadrados, promedio ponderado |
| **Paralelismo de Datos**   | Procesamiento paralelo de colecciones                                                     | Colecciones paralelas en Scala        |
| **Partición Lógica**       | Dividir rangos de procesamiento                                                           | `[0, n/2)` y `[n/2, n)`               |

## Problemas y Soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| **No Determinismo** | Orden de ejecución variable | Aceptar en diseño |
| **Condición de Carrera** | Acceso concurrente a datos compartidos | `synchronized` |
| **Falta de Atomicidad** | Intercalación de instrucciones | Secciones críticas sincronizadas |

## Métricas de Rendimiento

| Método | Ventajas | Casos de Uso |
|--------|----------|-------------|
| **Secuencial** | Simplicidad | Pequeños conjuntos de datos |
| **Parallel** | Automatización | División simple en 2-4 tareas |
| **Task** | Control granular | Gestión avanzada de concurrencia |