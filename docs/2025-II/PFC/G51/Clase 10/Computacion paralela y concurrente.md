# Computación Paralela y Concurrente

La **computación paralela** permite ejecutar varios cálculos al mismo tiempo, aprovechando que tenemos sistemas multinúcleo. Una computación se puede dividir en varias computaciones más pequeñas, las cuales se pueden resolver simultáneamente e integrar sus resultados para resolver la general.

El enfoque del **paralelismo** es la **aceleración**, es decir, resolver problemas más rápidamente.

## Paralelismo y Concurrencia

1. La **programación en paralelo** utiliza hardware en paralelo para realizar computaciones más rápidamente. Su enfoque es la **eficiencia**, es decir, qué tan rápido se realiza. En este curso, nos enfocaremos en programación en paralelo.
2. La **programación concurrente** puede o no realizar cálculos al mismo tiempo. Su principal preocupación es la **modularidad**, **capacidad de respuesta**, **escalabilidad**, etc. Aspectos del desarrollo de software.

## Niveles de Paralelismo

1. **Paralelismo a nivel de bits**: Procesamiento de bits en paralelo, lenguajes de bajo nivel, instrucciones a nivel de CPU.
2. **Paralelismo a nivel de instrucciones**: Ejecución de diferentes instrucciones al mismo tiempo.
3. **Paralelismo a nivel de tareas**: Ejecución de flujos de instrucciones en paralelo. En esto se va a enfocar este curso.

## Foco del Curso

- **Análisis y desarrollo de programas paralelos**
- **Paralelismo de tareas**: Algoritmos paralelos. Una estrategia conocida: **división por segmentos**.
- **Paralelismo de datos**: Colecciones paralelas en Scala.

## Tabla de Resumen

| Concepto                                 | Definición                                                                  | Enfoque Principal                                  |
| ---------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------- |
| **Computación Paralela**                 | Ejecución simultánea de múltiples cálculos utilizando sistemas multinúcleo  | Aceleración y eficiencia                           |
| **Programación en Paralelo**             | Uso de hardware paralelo para computaciones más rápidas                     | Eficiencia y velocidad                             |
| **Programación Concurrente**             | Ejecución que puede o no ser simultánea, enfocada en estructura de software | Modularidad, capacidad de respuesta, escalabilidad |
| **Paralelismo a Nivel de Bits**          | Procesamiento paralelo de bits a nivel de CPU                               | Instrucciones de bajo nivel                        |
| **Paralelismo a Nivel de Instrucciones** | Ejecución simultánea de diferentes instrucciones                            | Optimización del pipeline de CPU                   |
| **Paralelismo a Nivel de Tareas**        | Ejecución paralela de flujos de instrucciones                               | Algoritmos paralelos y división por segmentos      |
| **Paralelismo de Datos**                 | Procesamiento paralelo de colecciones de datos                              | Colecciones paralelas en Scala                     |