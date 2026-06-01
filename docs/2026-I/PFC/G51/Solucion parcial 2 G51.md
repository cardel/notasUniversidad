# Solución - Segundo Examen Parcial


---

## Pregunta 1 - Intercalación de hilos y no determinismo

**Escenario:** el hilo `X` imprime `p1`, `p2`; el hilo `Y` imprime `q1`, `q2`. ¿Qué salidas son posibles?

**Respuestas correctas: A, C, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | El hilo `X` corre completo y luego el `Y`: ejecución válida sin intercalación. |
| **B** | Incorrecta | `q2` aparece antes que `q1`: viola el orden de programa del hilo `Y`. |
| **C** | **Correcta** | Intercalación válida: respeta `p1` antes de `p2` y `q1` antes de `q2`. |
| **D** | **Correcta** | El hilo `Y` corre completo y luego el `X`: ejecución válida. |
| **E** | Incorrecta | `q2` aparece antes que `q1`: viola el orden de programa del hilo `Y`. |

---

## Pregunta 2 - Garantías de join

**Escenario:** un hilo `t` llena un arreglo `datos`; el principal hace `start`, `join` y luego lo usa.

**Respuestas correctas: A, C**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | `join` garantiza que, al continuar, el hilo principal ve el arreglo completamente lleno. |
| **B** | Incorrecta | `join` no reparte el llenado ni lo acelera; solo espera la terminación de `t`. |
| **C** | **Correcta** | Sin `join`, el hilo principal podría usar `datos` cuando `t` aún no terminó. |
| **D** | Incorrecta | Sin `join` no hay un error garantizado; el comportamiento es no determinista. |
| **E** | Incorrecta | `join` puede invocarse las veces que haga falta. |

---

## Pregunta 3 - Condición de carrera y atomicidad

**Escenario:** dos hilos actualizan muchas veces un total compartido, sin sincronización.

**Respuestas correctas: B, D, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | La conmutatividad no salva: leer-sumar-escribir no es una operación atómica. |
| **B** | **Correcta** | Actualización perdida: dos hilos leen el mismo total y uno se descarta al escribir. |
| **C** | Incorrecta | Con `val` no se podría actualizar el total; no corrige la carrera conservando el comportamiento. |
| **D** | **Correcta** | El total final depende de la intercalación: el resultado es no determinista. |
| **E** | **Correcta** | `synchronized` sobre un objeto común vuelve atómica la actualización. |

---

## Pregunta 4 - Interbloqueo

**Escenario:** dos hilos bloquean dos cuentas en orden opuesto.

**Respuestas correctas: B, C**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | Aunque sean cuentas distintas, los candados se piden en orden opuesto: sí puede haber interbloqueo. |
| **B** | **Correcta** | Cada hilo espera el candado que retiene el otro: ambos quedan bloqueados. |
| **C** | **Correcta** | Un orden fijo de adquisición de candados rompe el ciclo de espera. |
| **D** | Incorrecta | La JVM no detecta el interbloqueo ni reinicia hilos. |
| **E** | Incorrecta | El interbloqueo cuelga el programa; no lo termina con un error. |

---

## Pregunta 5 - Trabajo y profundidad

**Escenario:** máximo de `n` elementos, versión lineal frente a divide y vencerás con `parallel`.

**Respuestas correctas: B, D, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | La versión 2 reduce la profundidad, no el trabajo. |
| **B** | **Correcta** | Ambas recorren los `n` elementos: `W(n) = O(n)`. |
| **C** | Incorrecta | Con un procesador no hay paralelismo; el tiempo lo fija el trabajo. |
| **D** | **Correcta** | La versión lineal encadena las comparaciones: `D(n) = O(n)`. |
| **E** | **Correcta** | Dividir por la mitad con `parallel` da profundidad `O(log n)`. |

---

## Pregunta 6 - Ley de Amdahl

**Escenario:** 40 % secuencial, 60 % paralelizable; aceleración máxima.

**Respuesta correcta: A**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Con infinitos procesadores: `1/(1-0,6) = 1/0,4 = 2,5`. |
| **B** | Incorrecta | 1,67 es la aceleración con 3 procesadores, no el techo. |
| **C** | Incorrecta | 3 no es alcanzable. |
| **D** | Incorrecta | 6 no es alcanzable. |
| **E** | Incorrecta | La fracción secuencial del 40 % impone un techo. |

---

## Pregunta 7 - Medición empírica de programas paralelos

**Escenario:** un estudiante compara secuencial y paralelo con una sola ejecución de cada una.

**Respuestas correctas: B, C, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | La primera ejecución, antes del calentamiento, es la menos representativa. |
| **B** | **Correcta** | Una sola corrida de cada versión no es fiable: el tiempo varía. |
| **C** | **Correcta** | Repetir muchas veces y comparar un estadístico robusto, como la mediana, da fiabilidad. |
| **D** | Incorrecta | El recolector de basura sí puede activarse durante la medición e influir. |
| **E** | **Correcta** | Las primeras ejecuciones, antes del calentamiento de la JVM, se descartan. |

---

## Pregunta 8 - Aceleración y sobrecarga del paralelismo

**Escenario:** versión secuencial 12 s; paralela en 4 núcleos, 4 s.

**Respuestas correctas: C, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | La aceleración rara vez iguala el número de núcleos; suele ser menor. |
| **B** | Incorrecta | Duplicar los núcleos no garantiza reducir el tiempo a la mitad. |
| **C** | **Correcta** | La aceleración es el cociente de tiempos: `12 / 4 = 3`. |
| **D** | Incorrecta | Una aceleración por debajo del número de núcleos es normal, no un error. |
| **E** | **Correcta** | La sobrecarga de coordinación y la parte secuencial explican que no se llegue a 4. |

---

## Pregunta 9 - Semántica de parallel

**Escenario:** `parallel(parallel(f1(), f2()), parallel(f3(), f4()))` con cuatro funciones de ~1 s.

**Respuestas correctas: A, C, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Las cuatro funciones se solapan; el tiempo total ronda 1 segundo. |
| **B** | Incorrecta | El código compila: cada argumento de `parallel` es, a su vez, un `parallel`. |
| **C** | **Correcta** | Anidar `parallel` permite lanzar más de dos cálculos en paralelo. |
| **D** | Incorrecta | No son 4 segundos: las funciones se ejecutan concurrentemente. |
| **E** | **Correcta** | El resultado es `((a, b), (c, d))`: un par de pares con los cuatro valores. |

---

## Pregunta 10 - Reducción paralela y asociatividad

**Escenario:** reducción paralela de un arreglo combinando con `max`.

**Respuestas correctas: B, C, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | `max` es asociativa: el resultado no depende de cuál mitad termine primero. |
| **B** | **Correcta** | `max` es asociativa: el resultado paralelo coincide con el secuencial. |
| **C** | **Correcta** | La resta no es asociativa; al reagrupar, el resultado podría diferir. |
| **D** | **Correcta** | El umbral solo afecta el rendimiento, no el resultado. |
| **E** | Incorrecta | `max` no requiere que el arreglo esté ordenado. |

---

## Pregunta 11 - Tareas: task y ubicación de join

**Escenario:** dos tareas, cada una unida con `join()` justo al crearse.

**Respuesta correcta: B**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | `task` sí ejecuta su cálculo en paralelo. |
| **B** | **Correcta** | Cada tarea se une con `join()` antes de crear la siguiente: la segunda no empieza hasta que la primera termina. |
| **C** | Incorrecta | `calcular(a)` y `calcular(b)` son independientes. |
| **D** | Incorrecta | Se pueden tener varias tareas `task` activas a la vez. |
| **E** | Incorrecta | `join()` espera la tarea; no la ejecuta más lentamente. |

---

## Pregunta 12 - Umbral y granularidad

**Escenario:** una versión «paralela» tarda lo mismo que la secuencial; el umbral se fijó muy alto.

**Respuestas correctas: B, C, D, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | Un umbral muy alto no acelera: deja el cálculo en secuencial. |
| **B** | **Correcta** | Con un umbral tan alto casi nunca se entra a la rama paralela. |
| **C** | **Correcta** | Bajar el umbral permite repartir el trabajo entre los núcleos. |
| **D** | **Correcta** | Un umbral demasiado bajo genera muchas tareas y la sobrecarga puede dominar. |
| **E** | **Correcta** | El umbral ajusta el rendimiento; no cambia el resultado del cálculo. |

---

## Pregunta 13 - foldLeft frente a fold

**Escenario:** un estudiante cambia `foldLeft` por `par.foldLeft` y no observa mejora.

**Respuestas correctas: A, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | `foldLeft` encadena el acumulador de izquierda a derecha: sigue siendo secuencial aunque la colección sea paralela. |
| **B** | Incorrecta | `par.foldLeft` compila sin problema. |
| **C** | Incorrecta | No se acelera por la dependencia del acumulador, no por el tamaño de la lista. |
| **D** | **Correcta** | `fold` o `aggregate` con una operación asociativa sí permiten el cálculo en paralelo. |
| **E** | Incorrecta | La solución no es un ciclo, sino una operación asociativa. |

---

## Pregunta 14 - Agregación paralela

**Escenario:** `List(3, 7, 1, 9, 4).par.fold(0)(_ + _)`.

**Respuestas correctas: A, B, D, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | `0` es el elemento neutro de la suma: combinar con `0` no altera el resultado. |
| **B** | **Correcta** | La suma es asociativa: `fold` puede reagrupar los sumandos. |
| **C** | Incorrecta | `1` no es el neutro; además, en un `fold` paralelo el valor inicial puede combinarse varias veces. |
| **D** | **Correcta** | `3 + 7 + 1 + 9 + 4 = 24`. |
| **E** | **Correcta** | `fold` exige que el tipo del resultado coincida con el de los elementos. |

---

## Pregunta 15 - Seguridad en el paralelismo de datos

**Escenario:** se inicializa un arreglo con `.par`; cada tarea escribe en su propia posición.

**Respuestas correctas: A, B, D, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Cada tarea escribe en una posición distinta: no hay condición de carrera. |
| **B** | **Correcta** | El cálculo es seguro porque las escrituras de las tareas no se solapan. |
| **C** | Incorrecta | No hace falta `synchronized`: no hay un dato compartido en disputa. |
| **D** | **Correcta** | El resultado no depende del orden en que terminen las tareas. |
| **E** | **Correcta** | El paralelismo de datos exige que el trabajo sobre cada elemento sea independiente. |

---

## Tabla resumen de respuestas

| Pregunta | Tema | Correctas |
|----------|------|-----------|
| 1 | Intercalación de hilos y no determinismo | A, C, D |
| 2 | Garantías de join | A, C |
| 3 | Condición de carrera y atomicidad | B, D, E |
| 4 | Interbloqueo | B, C |
| 5 | Trabajo y profundidad | B, D, E |
| 6 | Ley de Amdahl | A |
| 7 | Medición empírica de programas paralelos | B, C, E |
| 8 | Aceleración y sobrecarga del paralelismo | C, E |
| 9 | Semántica de parallel | A, C, E |
| 10 | Reducción paralela y asociatividad | B, C, D |
| 11 | Tareas: task y ubicación de join | B |
| 12 | Umbral y granularidad | B, C, D, E |
| 13 | foldLeft frente a fold | A, D |
| 14 | Agregación paralela | A, B, D, E |
| 15 | Seguridad en el paralelismo de datos | A, B, D, E |
