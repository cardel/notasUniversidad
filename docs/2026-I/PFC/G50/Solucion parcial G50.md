
---

## Pregunta 1 - Intercalación de hilos y no determinismo

**Escenario:** el hilo `A` imprime `m1`, `m2`; el hilo `B` imprime `n1`, `n2`. ¿Qué salidas son posibles?

**Respuestas correctas: B, C, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | `m2` aparece antes que `m1`: viola el orden de programa del hilo `A`. |
| **B** | **Correcta** | El hilo `A` corre completo y luego el `B`: ejecución válida sin intercalación. |
| **C** | **Correcta** | Intercalación válida: respeta `m1` antes de `m2` y `n1` antes de `n2`. |
| **D** | Incorrecta | `m2` aparece antes que `m1`: viola el orden de programa del hilo `A`. |
| **E** | **Correcta** | Intercalación válida; el orden interno de cada hilo se conserva. |

---

## Pregunta 2 - Garantías de join

**Escenario:** un hilo `t` escribe un resultado; el principal hace `start`, `join` y luego lo imprime.

**Respuestas correctas: B, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | `join` no reparte trabajo ni acelera; solo espera la terminación de `t`. |
| **B** | **Correcta** | `join` crea una relación de orden: el hilo principal ve lo que `t` escribió. |
| **C** | Incorrecta | Sin `join` el resultado es no determinista: puede ser 0 o el valor, no «siempre 0». |
| **D** | Incorrecta | `join` se invoca después de `start`; antes de arrancar el hilo no tendría sentido. |
| **E** | **Correcta** | Sin `join`, el `println` puede ejecutarse antes de que `t` termine y leer el valor por defecto. |

---

## Pregunta 3 - Condición de carrera y atomicidad

**Escenario:** dos hilos incrementan 100 000 veces un contador compartido, sin sincronización.

**Respuestas correctas: A, C, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Leer-sumar-escribir no es atómico; las intercalaciones pierden incrementos. |
| **B** | Incorrecta | El valor final no es fijo: queda entre 100 000 y 200 000. |
| **C** | **Correcta** | Actualización perdida: dos hilos leen el mismo valor y uno se descarta al escribir. |
| **D** | Incorrecta | La JVM no garantiza atomicidad de un incremento sobre un entero ordinario. |
| **E** | **Correcta** | `synchronized` sobre un objeto común vuelve atómica la secuencia. |

---

## Pregunta 4 - Interbloqueo

**Escenario:** dos hilos toman dos candados en orden opuesto.

**Respuestas correctas: A, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Cada hilo retiene un candado que el otro necesita: ninguno avanza. |
| **B** | Incorrecta | La JVM no detecta ni deshace interbloqueos por sí sola. |
| **C** | Incorrecta | El interbloqueo depende de la intercalación; no ocurre en todas las ejecuciones. |
| **D** | **Correcta** | Pedir los candados en un orden común rompe el ciclo de espera. |
| **E** | Incorrecta | Usar candados en orden opuesto es justo lo que causa el interbloqueo. |

---

## Pregunta 5 - Trabajo y profundidad

**Escenario:** suma de `n` elementos, versión lineal frente a divide y vencerás con `parallel`.

**Respuestas correctas: A, C, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Ambas suman los `n` elementos: `W(n) = O(n)`. |
| **B** | Incorrecta | Con `P` tendiendo a infinito el tiempo tiende a `D(n)`, no a `W(n)`. |
| **C** | **Correcta** | En la versión lineal cada suma depende de la anterior: `D(n) = O(n)`. |
| **D** | Incorrecta | La versión 2 reduce la profundidad, no el trabajo. |
| **E** | **Correcta** | Dividir por la mitad con `parallel` da profundidad `O(log n)`. |

---

## Pregunta 6 - Ley de Amdahl

**Escenario:** 80 % paralelizable, 20 % secuencial; aceleración máxima.

**Respuesta correcta: C**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | 4 no es el techo. |
| **B** | Incorrecta | 10 no es alcanzable. |
| **C** | **Correcta** | Con infinitos procesadores: `1/(1-0,8) = 1/0,2 = 5`. |
| **D** | Incorrecta | 8 no es alcanzable. |
| **E** | Incorrecta | La fracción secuencial del 20 % impone un techo. |

---

## Pregunta 7 - Medición empírica de programas paralelos

**Escenario:** un estudiante mide su programa con una sola ejecución, al arrancar la JVM.

**Respuestas correctas: A, B, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | La primera ejecución incluye el calentamiento de la JVM y el JIT: no es representativa. |
| **B** | **Correcta** | Repetir y descartar valores atípicos reduce el ruido de la medición. |
| **C** | Incorrecta | El tiempo de un programa no es constante; varía entre corridas. |
| **D** | **Correcta** | El recolector de basura puede activarse durante la medición y sumar tiempo ajeno. |
| **E** | Incorrecta | ScalaMeter mide con más fiabilidad; no acelera el programa. |

---

## Pregunta 8 - Aceleración y sobrecarga del paralelismo

**Escenario:** la versión paralela resulta más lenta que la secuencial para entradas pequeñas.

**Respuestas correctas: A, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Crear y coordinar tareas cuesta; para entradas pequeñas supera la ganancia. |
| **B** | Incorrecta | El propio escenario muestra un caso donde la versión paralela es más lenta. |
| **C** | Incorrecta | El número de núcleos influye directamente en la aceleración. |
| **D** | **Correcta** | Un umbral evita pagar la sobrecarga en entradas pequeñas. |
| **E** | Incorrecta | La versión paralela calcula lo mismo; no entrega un resultado distinto. |

---

## Pregunta 9 - Semántica de parallel

**Escenario:** `parallel(f(), g())` con `f` y `g` de ~1 s.

**Respuestas correctas: B, C, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | `parallel` no impone ningún orden entre `f()` y `g()`. |
| **B** | **Correcta** | Se evalúan a la vez; el tiempo total se acerca al del más lento, ~1 s. |
| **C** | **Correcta** | `parallel` recibe sus argumentos por nombre: no los evalúa antes de entrar. |
| **D** | **Correcta** | Devuelve una tupla con los dos resultados. |
| **E** | Incorrecta | Con paso por valor, `f()` y `g()` se evaluarían en secuencia: sin paralelismo. |

---

## Pregunta 10 - Reducción paralela y asociatividad

**Escenario:** reducción paralela de un arreglo combinando con la suma.

**Respuestas correctas: A, B, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | La suma es asociativa: el árbol de reducción da el mismo total que la versión secuencial. |
| **B** | **Correcta** | La resta no es asociativa; al reagrupar, el resultado paralelo puede diferir. |
| **C** | Incorrecta | Basta la asociatividad; el árbol conserva el orden, no se necesita conmutatividad. |
| **D** | Incorrecta | El umbral solo afecta el rendimiento, no el resultado. |
| **E** | **Correcta** | Con un umbral muy grande nunca se entra a la rama paralela. |

---

## Pregunta 11 - Tareas: task y ubicación de join

**Escenario:** una tarea con `t1.join()` invocado antes de calcular la segunda parte.

**Respuesta correcta: D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | `task` sí ejecuta su cálculo en paralelo. |
| **B** | Incorrecta | `parte1` y `parte2` son independientes. |
| **C** | Incorrecta | `task` también permite paralelizar. |
| **D** | **Correcta** | El `join` va antes de calcular `parte2`: el hilo principal espera a `t1` y solo después empieza. |
| **E** | Incorrecta | `task` no obliga a un `join` inmediato; ubicarlo ahí es el error. |

---

## Pregunta 12 - Umbral y granularidad

**Escenario:** un algoritmo de divide y vencerás con el umbral fijado en 1.

**Respuestas correctas: A, B, D, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Con umbral 1 se crean muchísimas tareas diminutas; la sobrecarga domina. |
| **B** | **Correcta** | Un umbral demasiado pequeño puede hacer la versión paralela más lenta que la secuencial. |
| **C** | Incorrecta | El umbral no cambia el resultado, solo el rendimiento. |
| **D** | **Correcta** | Un umbral demasiado grande deja casi todo el trabajo secuencial. |
| **E** | **Correcta** | Un umbral intermedio equilibra la sobrecarga de tareas con el uso de los núcleos. |

---

## Pregunta 13 - foldLeft frente a fold

**Escenario:** `lista.foldLeft(0)(_ + _)` y por qué `foldLeft` no se paraleliza.

**Respuestas correctas: B, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | Incorrecta | La suma sí es asociativa; no es esa la razón. |
| **B** | **Correcta** | Cada paso necesita el acumulador del paso anterior: el orden es estrictamente secuencial. |
| **C** | Incorrecta | `foldLeft` funciona sobre listas inmutables. |
| **D** | Incorrecta | `foldLeft` no exige conmutatividad. |
| **E** | **Correcta** | `fold` sí admite ejecución paralela si la operación es asociativa y tiene neutro. |

---

## Pregunta 14 - Agregación paralela

**Escenario:** `palabras.par.aggregate(0)(...)` que cuenta letras.

**Respuestas correctas: A, B, C, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | `aggregate` recibe un valor inicial, una función que acumula por elemento y otra que combina parciales. |
| **B** | **Correcta** | Admite que el acumulador (`Int`) sea de tipo distinto a los elementos (`String`). |
| **C** | **Correcta** | La función que combina los resultados parciales debe ser asociativa. |
| **D** | Incorrecta | Las dos funciones tienen roles distintos; no son idénticas. |
| **E** | **Correcta** | `4 + 5 + 5 + 3 = 17`. |

---

## Pregunta 15 - Seguridad en el paralelismo de datos

**Escenario:** un recorrido con `.par` donde cada tarea agrega a una lista compartida.

**Respuestas correctas: A, C, D, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Varias tareas modifican la misma estructura a la vez: condición de carrera. |
| **B** | Incorrecta | `.par` no vuelve seguras las operaciones con efectos colaterales. |
| **C** | **Correcta** | El resultado puede perder elementos o quedar corrupto, y varía entre ejecuciones. |
| **D** | **Correcta** | Es seguro cuando cada tarea trabaja sobre datos independientes. |
| **E** | **Correcta** | Lo correcto es expresar el cálculo con `map`, `filter` o `aggregate`, sin estado compartido. |

---

## Tabla resumen de respuestas

| Pregunta | Tema | Correctas |
|----------|------|-----------|
| 1 | Intercalación de hilos y no determinismo | B, C, E |
| 2 | Garantías de join | B, E |
| 3 | Condición de carrera y atomicidad | A, C, E |
| 4 | Interbloqueo | A, D |
| 5 | Trabajo y profundidad | A, C, E |
| 6 | Ley de Amdahl | C |
| 7 | Medición empírica de programas paralelos | A, B, D |
| 8 | Aceleración y sobrecarga del paralelismo | A, D |
| 9 | Semántica de parallel | B, C, D |
| 10 | Reducción paralela y asociatividad | A, B, E |
| 11 | Tareas: task y ubicación de join | D |
| 12 | Umbral y granularidad | A, B, D, E |
| 13 | foldLeft frente a fold | B, E |
| 14 | Agregación paralela | A, B, C, E |
| 15 | Seguridad en el paralelismo de datos | A, C, D, E |
