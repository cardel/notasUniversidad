# Solución - Primer Examen Parcial

**Curso:** Infraestructuras Paralelas y Distribuidas  
**Semestre:** 2026 - I (Agosto - Diciembre 2026)  
**Docente:** Carlos Andrés Delgado Saavedra  
**Duración:** 1 hora  
**Tipo:** Selección múltiple con múltiple respuesta (15 preguntas, 5 opciones cada una)

---

## Pregunta 1 - Ley de Amdahl

**Enunciado:** Un programa tarda 100 segundos en ejecutarse de forma secuencial. El 80% del código es paralelizable. Se ejecuta con 4 procesadores. Según la Ley de Amdahl, indique cuáles afirmaciones son correctas.

**Respuestas correctas: A, B, C, E**

**Datos clave:**
- Tiempo secuencial: T = 100 s
- Fracción paralelizable: P = 0.80
- Fracción secuencial: S = 1 - P = 0.20
- Procesadores: N = 4

**Fórmula de Amdahl:**  
Speedup(N) = 1 / (S + P/N) = 1 / ((1 - P) + P/N)

| Opción | Texto                                                                    | Correcta       | Explicación                                                                                                                                                                                                                                                                                  |
| ------ | ------------------------------------------------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A**  | El speedup máximo teórico con infinitos procesadores es 5                | **Correcta**   | Speedup(inf) = 1 / S = 1 / 0.20 = **5**. Cuando N tiende a infinito, P/N tiende a 0 y el speedup queda limitado únicamente por la fracción secuencial.                                                                                                                                       |
| **B**  | Con 4 procesadores el tiempo de ejecución es 40 segundos                 | **Correcta**   | T(4) = T_secuencial + T_paralelo/N = 100 x 0.20 + 100 x 0.80/4 = 20 + 20 = **40 s**.                                                                                                                                                                                                         |
| **C**  | Con 4 procesadores el speedup es 2.5                                     | **Correcta**   | Speedup(4) = T_original / T(4) = 100 / 40 = **2.5**. Alternativamente: 1 / (0.20 + 0.80/4) = 1 / (0.20 + 0.20) = 1/0.40 = 2.5.                                                                                                                                                               |
| **D**  | Duplicar los procesadores a 8 reduciría el tiempo exactamente a la mitad | **Incorrecta** | T(8) = 20 + 80/8 = 20 + 10 = **30 s**. La mitad de 40 sería 20 s, pero se obtienen 30 s. La Ley de Amdahl muestra rendimientos decrecientes: la parte secuencial (20 s) es un piso inamovible. Duplicar procesadores **nunca** reduce el tiempo exactamente a la mitad a menos que P = 100%. |
| **E**  | La parte no paralelizable tarda 20 segundos                              | **Correcta**   | T_secuencial = 100 x 0.20 = **20 s**. Este es el cuello de botella irreducible del programa.                                                                                                                                                                                                 |

---

## Pregunta 2 - Identificar paralelización

**Enunciado:** Dado el siguiente fragmento de código en C++:

```cpp
// Ciclo 1
for(int i=0; i<N; i++) a[i] = b[i] + c[i];
// Ciclo 2
for(int i=1; i<N; i++) a[i] = a[i-1] * 2;
// Ciclo 3
for(int i=0; i<N; i++) d[i] = sqrt(a[i]);
```

Indique cuáles afirmaciones son correctas.

**Respuestas correctas: A, C, D**

| Opción | Texto | Correcta | Explicación |
|--------|-------|----------|-------------|
| **A** | El Ciclo 1 es paralelizable porque cada iteración es independiente | **Correcta** | Cada `a[i]` se calcula a partir de `b[i]` y `c[i]`, que son elementos distintos leídos independientemente. No hay dependencia entre iteraciones (no hay dependencia loop-carried). |
| **B** | El Ciclo 2 es paralelizable porque cada elemento solo se multiplica por 2 | **Incorrecta** | Aunque la operación es una simple multiplicación por 2, `a[i]` depende de `a[i-1]`. Esto es una **dependencia de flujo** (RAW - Read After Write) entre iteraciones consecutivas. Cada iteración necesita el resultado de la anterior, formando una cadena secuencial. |
| **C** | El Ciclo 2 NO es paralelizable porque cada iteración depende de la anterior | **Correcta** | `a[i] = a[i-1] * 2` genera una dependencia loop-carried: la iteración `i` necesita el valor producido por la iteración `i-1`. Esto impide la paralelización directa. |
| **D** | El Ciclo 3 es paralelizable una vez que el Ciclo 2 haya terminado | **Correcta** | `d[i] = sqrt(a[i])` lee de `a[i]` (que ya fue calculado por el Ciclo 2) y escribe en `d[i]`. Cada iteración es independiente entre sí. Solo requiere que el Ciclo 2 haya completado la escritura del arreglo `a`. |
| **E** | Los tres ciclos pueden ejecutarse simultáneamente entre sí | **Incorrecta** | El Ciclo 2 **lee y escribe** el arreglo `a`, que fue escrito por el Ciclo 1. El Ciclo 3 **lee** el arreglo `a` que fue modificado por el Ciclo 2. Hay dependencias de datos entre los ciclos: Ciclo 1 -> Ciclo 2 -> Ciclo 3. Deben ejecutarse en orden. |

---

## Pregunta 3 - Power Wall y Memory Wall

**Enunciado:** Un ingeniero intenta mejorar el rendimiento de un servidor aumentando la frecuencia de reloj de 3 GHz a 5 GHz, pero observa que el consumo de energía se dispara, el procesador se sobrecalienta, y los programas no mejoran proporcionalmente porque la memoria RAM no entrega datos al ritmo de la CPU.

**Respuestas correctas: A, B, D, E**

| Opción | Texto                                                                                                   | Correcta       | Explicación                                                                                                                                                                                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A**  | El sobrecalentamiento y consumo excesivo es una manifestación del Power Wall                            | **Correcta**   | El Power Wall se refiere al límite en el que aumentar la frecuencia de reloj incrementa exponencialmente el consumo de energía y la generación de calor (P ~ C x V^2 x f). La potencia dinámica crece con la frecuencia y con el voltaje al cuadrado, y aumentar frecuencia requiere también más voltaje.                   |
| **B**  | La discrepancia entre velocidad de CPU y RAM ilustra el Memory Wall                                     | **Correcta**   | El Memory Wall describe la brecha creciente entre la velocidad del procesador y la latencia/ancho de banda de la memoria principal. La CPU puede procesar datos mucho más rápido de lo que la RAM puede suministrarlos, creando cuellos de botella.                                                                         |
| **C**  | Agregar más módulos de RAM solucionaría la discrepancia de velocidades                                  | **Incorrecta** | Agregar más módulos de RAM aumenta la **capacidad** (cantidad de datos almacenables), pero **no** la **velocidad** de acceso. El Memory Wall es un problema de latencia y ancho de banda, no de capacidad. La solución pasa por jerarquías de caché, memorias más rápidas (como HBM), y optimización de localidad de datos. |
| **D**  | Estos problemas explican por qué la frecuencia de reloj se estabilizó alrededor de 3 GHz                | **Correcta**   | Desde aproximadamente 2005, la frecuencia de reloj de los procesadores comerciales se ha mantenido en torno a 3-5 GHz debido al Power Wall. En lugar de aumentar frecuencia, la industria migró hacia más núcleos por chip.                                                                                                 |
| **E**  | La solución a largo plazo es escribir programas explícitamente paralelos que reduzcan accesos a memoria | **Correcta**   | Ante el estancamiento de la frecuencia, la respuesta de la industria fue el paralelismo: más núcleos, instrucciones vectoriales (SIMD/AVX), y programación explícitamente paralela. Además, optimizar la localidad de datos reduce la presión sobre la memoria.                                                             |

---

## Pregunta 4 - Herramientas de profiling en Python

**Enunciado:** Un desarrollador tiene un programa Python que tarda 30 minutos en ejecutarse y no sabe qué función consume más tiempo. Necesita identificar el cuello de botella.

**Respuestas correctas: B, D, E**

| Opción | Texto | Correcta | Explicación |
|--------|-------|----------|-------------|
| **A** | Usar `time.time()` al inicio y fin del programa le permite identificar qué función es la problemática | **Incorrecta** | `time.time()` solo mide el tiempo total de ejecución del programa completo (o de un bloque de código si se instrumenta manualmente). **No desglosa** el tiempo por función automáticamente. El desarrollador tendría que agregar mediciones manuales en cada función, lo cual es impráctico y no identifica el cuello de botella directamente. |
| **B** | `cProfile` le permitiría ver el número de llamadas y tiempo acumulado por cada función | **Correcta** | `cProfile` es un profiler determinístico que instrumenta cada llamada a función y reporta: número de llamadas (`ncalls`), tiempo total en la función (`tottime`), tiempo acumulado incluyendo sub-llamadas (`cumtime`), y tiempo por llamada. Es la herramienta ideal para este escenario. |
| **C** | `timeit` es la herramienta adecuada para este escenario | **Incorrecta** | `timeit` está diseñado para medir el tiempo de ejecución de **fragmentos pequeños de código** (benchmarks de micro-operaciones). Ejecuta el fragmento múltiples veces para obtener una medición estadísticamente confiable. No es práctico para perfilar un programa completo de 30 minutos ni para identificar qué función es la más costosa. |
| **D** | Pyinstrument tendría menor overhead que cProfile para este análisis | **Correcta** | Pyinstrument es un profiler de muestreo (sampling profiler) que toma muestras periódicas del call stack en lugar de instrumentar cada llamada. Esto produce **menos overhead** que cProfile (que es determinístico y registra cada entrada/salida de función), lo cual es especialmente relevante en programas de larga duración como este de 30 minutos. |
| **E** | cProfile muestra las métricas ncalls, tottime y cumtime para cada función | **Correcta** | Las columnas estándar de la salida de cProfile son: `ncalls` (número de llamadas), `tottime` (tiempo total excluyendo sub-llamadas), `percall` (tottime/ncalls), `cumtime` (tiempo acumulado incluyendo sub-llamadas), y `percall` (cumtime/ncalls). |

---

## Pregunta 5 - Interpretar salida de cProfile

**Enunciado:** Al perfilar un programa con cProfile se obtiene la siguiente salida:

```
ncalls      tottime cumtime  funcion
29860703/1  12.023  12.023   calcular
1000         0.500   0.500   procesar
1            0.001  12.524   main
```

**Respuestas correctas: A, B, D, E**

| Opción | Texto | Correcta | Explicación |
|--------|-------|----------|-------------|
| **A** | La función `calcular` es el cuello de botella principal del programa | **Correcta** | `calcular` consume 12.023 s de tottime, que representa el 96% del tiempo total del programa (12.524 s). Es claramente la función dominante. |
| **B** | El formato 29860703/1 en ncalls indica que `calcular` es recursiva | **Correcta** | En cProfile, el formato `X/Y` en ncalls significa que la función fue llamada `X` veces en total, pero solo `Y` veces de forma no recursiva (llamadas primitivas). Aquí, `calcular` se llamó 29,860,703 veces en total pero solo 1 vez de forma directa, lo que indica **recursión profunda**. |
| **C** | La función `procesar` consume más tiempo total que `calcular` | **Incorrecta** | `procesar` tiene tottime = 0.500 s, mientras que `calcular` tiene tottime = 12.023 s. `calcular` consume **24 veces más** tiempo que `procesar`. |
| **D** | La memoización podría reducir drásticamente las llamadas a `calcular` | **Correcta** | La función es recursiva con ~30 millones de llamadas pero solo 1 llamada primitiva. Esto sugiere un patrón de recursión con subproblemas repetidos (como Fibonacci). La memoización cachea resultados de sub-llamadas ya calculadas, reduciendo dramáticamente el número de llamadas redundantes. |
| **E** | El tottime de `main` (0.001s) indica que gasta casi todo su tiempo en las sub-llamadas, no en código propio | **Correcta** | `main` tiene tottime = 0.001 s (tiempo propio) pero cumtime = 12.524 s (tiempo acumulado). La diferencia (12.523 s) es tiempo gastado dentro de las funciones que `main` invoca (`calcular` y `procesar`). Esto significa que `main` en sí no hace casi nada; solo orquesta las llamadas. |

---

## Pregunta 6 - GIL y threading vs multiprocessing

**Enunciado:** Un estudiante escribe un programa Python que calcula la suma de los cuadrados de 10 millones de números. Usa 4 hilos con `threading`, pero observa que el tiempo de ejecución es similar al secuencial.

**Respuestas correctas: A, B, D, E**

| Opción | Texto                                                                                         | Correcta       | Explicación                                                                                                                                                                                                                                                                 |
| ------ | --------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A**  | El GIL impide que los hilos ejecuten bytecode Python en paralelo en tareas CPU-bound          | **Correcta**   | El Global Interpreter Lock (GIL) de CPython permite que solo un hilo ejecute bytecode Python a la vez. En tareas CPU-bound, los hilos compiten por el GIL y se ejecutan de forma efectivamente secuencial, sin aprovechar múltiples núcleos.                                |
| **B**  | Usar `multiprocessing` solucionaría el problema porque cada proceso tiene su propio GIL       | **Correcta**   | `multiprocessing` crea procesos separados, cada uno con su propio intérprete Python y su propio GIL. Esto permite verdadera ejecución paralela en múltiples núcleos para tareas CPU-bound.                                                                                  |
| **C**  | Los hilos en Python nunca ofrecen beneficio en ningún escenario                               | **Incorrecta** | Los hilos sí ofrecen beneficio en tareas **I/O-bound** (lectura de archivos, peticiones de red, acceso a bases de datos). Durante operaciones I/O, el hilo libera el GIL, permitiendo que otros hilos avancen. Esta afirmación es demasiado absoluta y falsa.               |
| **D**  | Esta tarea es CPU-bound, por lo que `threading` no aprovecha múltiples núcleos                | **Correcta**   | Calcular la suma de cuadrados de 10 millones de números es una operación puramente computacional (CPU-bound). El GIL serializa la ejecución de bytecode Python, impidiendo que `threading` aproveche el paralelismo real en múltiples núcleos para este tipo de tarea.      |
| **E**  | Si la tarea fuera descargar archivos de Internet (I/O-bound), `threading` sí ofrecería mejora | **Correcta**   | Las descargas de red son I/O-bound: el hilo pasa la mayor parte del tiempo esperando respuestas de red. Durante esa espera, el GIL se libera, permitiendo que otros hilos ejecuten o inicien sus propias operaciones I/O. `threading` es ideal para concurrencia I/O-bound. |

---

## Pregunta 7 - Condiciones de carrera en Python

**Enunciado:** Considere el siguiente código Python:

```python
import threading
contador = 0
def incrementar():
    global contador
    for _ in range(1_000_000):
        contador += 1

t1 = threading.Thread(target=incrementar)
t2 = threading.Thread(target=incrementar)
t1.start(); t2.start()
t1.join(); t2.join()
print(contador)
```

**Respuestas correctas: B, C, E**

| Opción | Texto | Correcta | Explicación |
|--------|-------|----------|-------------|
| **A** | El resultado siempre será 2,000,000 | **Incorrecta** | Debido a la condición de carrera, el resultado será frecuentemente **menor** que 2,000,000. La operación `contador += 1` no es atómica en Python: internamente implica leer el valor, incrementarlo y escribirlo. El GIL puede liberar el control entre estas operaciones, causando actualizaciones perdidas. |
| **B** | Existe una condición de carrera sobre la variable `contador` | **Correcta** | `contador += 1` se descompone en: (1) LOAD `contador`, (2) LOAD constante 1, (3) BINARY_ADD, (4) STORE `contador`. El GIL puede cambiar de hilo entre estas instrucciones de bytecode. Si ambos hilos leen el mismo valor antes de que uno escriba, se pierde un incremento. |
| **C** | Usar `threading.Lock()` resolvería el problema de concurrencia | **Correcta** | Un Lock asegura exclusión mutua: solo un hilo a la vez puede ejecutar la sección crítica protegida (`with lock: contador += 1`). Esto elimina la condición de carrera, aunque a costa de serializar los accesos. |
| **D** | El GIL de Python garantiza que no habrá condiciones de carrera en este caso | **Incorrecta** | El GIL **no** garantiza atomicidad a nivel de operaciones Python. El GIL solo asegura que un hilo ejecuta bytecode a la vez, pero `+=` se traduce a **varias instrucciones de bytecode**. El GIL puede liberar el control entre ellas (cada ~100 instrucciones de bytecode o en intervalos configurables). |
| **E** | Usar listas separadas por hilo y combinar los resultados al final evitaría el conflicto | **Correcta** | Si cada hilo acumula su resultado en una variable local independiente y al final se suman los parciales, se elimina el acceso compartido y la condición de carrera. Es un patrón clásico de reducción que evita la necesidad de sincronización durante el cómputo. |

---

## Pregunta 8 - Memoria independiente en multiprocessing

**Enunciado:** Un estudiante ejecuta el siguiente código Python:

```python
import multiprocessing
resultado = []
def llenar(lista):
    for i in range(5):
        lista.append(i * i)
    print('Dentro:', lista)

p = multiprocessing.Process(
    target=llenar, args=(resultado,))
p.start()
p.join()
print('Fuera:', resultado)
```

**Respuestas correctas: B, C, D, E**

| Opción | Texto                                                                                                | Correcta       | Explicación                                                                                                                                                                                                                                                |
| ------ | ---------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A**  | La salida de ``Fuera:'' será [0, 1, 4, 9, 16]                                                        | **Incorrecta** | El proceso hijo recibe una **copia** de la lista `resultado`. Las modificaciones que realiza el hijo ocurren en su propio espacio de memoria y **no se reflejan** en el proceso padre. La salida de ``Fuera:'' será `[]`.                                  |
| **B**  | La salida de ``Fuera:'' será [] (lista vacía)                                                        | **Correcta**   | `multiprocessing.Process` crea un proceso hijo con espacio de memoria independiente. La lista `resultado` se copia (via pickle/fork) al hijo. Los `append` del hijo modifican su copia local. El padre conserva la lista original vacía.                   |
| **C**  | Los procesos tienen espacios de memoria independientes, por eso el padre no ve los cambios           | **Correcta**   | A diferencia de los hilos (que comparten memoria), los procesos tienen espacios de direcciones separados. Esta es una propiedad fundamental del modelo de procesos del sistema operativo. Los cambios en variables del hijo no son visibles para el padre. |
| **D**  | Para compartir datos entre procesos se podría usar `multiprocessing.Array` o `multiprocessing.Queue` | **Correcta**   | `multiprocessing` ofrece mecanismos de comunicación inter-proceso (IPC): `Array` y `Value` usan memoria compartida; `Queue` y `Pipe` usan comunicación por mensajes. Estos permiten transferir datos entre procesos de forma segura.                       |
| **E**  | Si se cambiara `Process` por `threading.Thread`, el padre sí vería los cambios                       | **Correcta**   | Los hilos comparten el mismo espacio de memoria del proceso. Si se usa `threading.Thread`, la función `llenar` opera directamente sobre la misma lista `resultado` del hilo principal, por lo que los `append` serían visibles desde el padre.             |

---

## Pregunta 9 - Condición de carrera en OpenMP

**Enunciado:** Considere el siguiente código C++ con OpenMP:

```cpp
int suma = 0;
#pragma omp parallel for
for (int i = 0; i < 1000; i++)
    suma += i;
```

**Respuestas correctas: B, C, D, E**

| Opción | Texto | Correcta | Explicación |
|--------|-------|----------|-------------|
| **A** | El resultado siempre será 499500 | **Incorrecta** | Existe una condición de carrera: múltiples hilos leen, incrementan y escriben `suma` simultáneamente sin sincronización. El resultado será impredecible y generalmente menor que 499500 (la suma correcta de 0 a 999). |
| **B** | Existe una condición de carrera sobre la variable `suma` | **Correcta** | `suma += i` es una operación de lectura-modificación-escritura sobre una variable compartida. Sin protección, múltiples hilos pueden leer el mismo valor de `suma`, incrementarlo y escribirlo, perdiendo actualizaciones (condición de carrera clásica). |
| **C** | Agregar `reduction(+:suma)` a la directiva resolvería el problema | **Correcta** | La cláusula `reduction(+:suma)` crea una copia privada de `suma` para cada hilo (inicializada a 0 para el operador `+`). Al final de la región paralela, las copias se combinan con el operador especificado. Esto elimina la condición de carrera de forma eficiente. |
| **D** | Usar `#pragma omp critical` dentro del for también sería correcto pero menos eficiente | **Correcta** | `#pragma omp critical` serializa el acceso a `suma`, garantizando que solo un hilo a la vez ejecute `suma += i`. Es correcto, pero ineficiente: cada iteración requiere adquirir y liberar un lock, lo que serializa de facto todo el bucle y anula el beneficio del paralelismo. `reduction` es muy superior en rendimiento. |
| **E** | La variable `i` del ciclo for es automáticamente `private` en OpenMP | **Correcta** | En un `#pragma omp parallel for`, la variable de inducción del bucle (`i`) es automáticamente privada para cada hilo. Esto está definido en la especificación de OpenMP: el índice del bucle de un worksharing `for` es implícitamente `private`. |

---

## Pregunta 10 - Directivas sections y single en OpenMP

**Enunciado:** Un programa debe procesar audio, video y subtítulos de forma independiente, y al final un solo hilo debe imprimir un resumen. Indique las afirmaciones correctas sobre la implementación con OpenMP.

**Respuestas correctas: A, B, D, E**

| Opción | Texto | Correcta | Explicación |
|--------|-------|----------|-------------|
| **A** | Se debería usar `#pragma omp parallel sections` para ejecutar las tres tareas en paralelo | **Correcta** | `parallel sections` es la directiva adecuada cuando se tienen tareas independientes no iterativas que se quieren ejecutar en paralelo. Cada tarea (audio, video, subtítulos) se coloca en un `section` distinto. |
| **B** | Para que solo un hilo imprima el resumen, se puede usar `#pragma omp single` | **Correcta** | `#pragma omp single` asegura que solo un hilo del equipo ejecute el bloque de código. Al final incluye una barrera implícita (salvo `nowait`), lo que garantiza que el resumen se imprima después de que todos los hilos terminen. |
| **C** | `parallel for` es la directiva adecuada para este caso | **Incorrecta** | `parallel for` distribuye iteraciones de un bucle entre hilos. Este problema no tiene un bucle: son tres tareas independientes cualitativamente distintas (audio, video, subtítulos). La directiva correcta es `sections`, no `for`. |
| **D** | Cada tarea se encapsula dentro de `#pragma omp section` | **Correcta** | Dentro de un bloque `sections`, cada `section` define una unidad de trabajo que será asignada a un hilo disponible. La estructura sería: `sections { section { audio } section { video } section { subtitulos } }`. |
| **E** | `#pragma omp barrier` sirve para asegurar que las tres tareas terminen antes del resumen | **Correcta** | `barrier` es un punto de sincronización: ningún hilo puede continuar hasta que todos hayan llegado a la barrera. Aunque `sections` ya tiene una barrera implícita al final, una barrera explícita puede usarse para asegurar la sincronización antes de que un hilo imprima el resumen. |

---

## Pregunta 11 - Schedule en OpenMP

**Enunciado:** Se paraleliza el cálculo de una función cuyo costo varía dependiendo del valor de `i` (por ejemplo, `fibonacci(i)`):

```cpp
#pragma omp parallel for schedule(???)
for(int i = 0; i < 10000; i++)
    resultado[i] = fibonacci(i);
```

**Respuestas correctas: B, C, D, E**

| Opción | Texto | Correcta | Explicación |
|--------|-------|----------|-------------|
| **A** | `schedule(static)` es ideal porque todas las iteraciones tienen el mismo costo | **Incorrecta** | La premisa es falsa: `fibonacci(i)` tiene un costo que crece con `i`. Las últimas iteraciones son exponencialmente más costosas que las primeras. Con `static`, un hilo recibiría las iteraciones más pesadas y sería el cuello de botella (desbalance de carga). |
| **B** | `schedule(dynamic)` ofrece mejor balance de carga cuando el costo por iteración varía | **Correcta** | Con `dynamic`, cada hilo solicita una nueva iteración (o bloque) cuando termina la actual. Los hilos que terminan iteraciones baratas (valores bajos de `i`) toman más iteraciones, mientras que los hilos con iteraciones costosas se mantienen ocupados. Esto balancea la carga automáticamente. |
| **C** | `schedule(guided)` asigna bloques decrecientes, combinando balance y bajo overhead | **Correcta** | `guided` asigna bloques grandes al inicio (reduciendo overhead de sincronización) y bloques progresivamente más pequeños al final (mejorando el balance de carga). Es un compromiso entre `static` (bajo overhead, mal balance) y `dynamic` (buen balance, más overhead). |
| **D** | Con `dynamic`, cada hilo solicita más trabajo cuando termina su bloque actual | **Correcta** | Esa es exactamente la semántica de `schedule(dynamic)`: funciona como una cola de trabajo. Cuando un hilo completa su bloque asignado, solicita el siguiente bloque disponible del runtime de OpenMP. |
| **E** | `static` divide las iteraciones en bloques contiguos iguales, lo cual sería ineficiente aquí | **Correcta** | `schedule(static)` divide las 10000 iteraciones en bloques de tamaño aproximadamente igual entre los hilos (ej. con 4 hilos: 0-2499, 2500-4999, 5000-7499, 7500-9999). El hilo con el rango 7500-9999 tendría iteraciones mucho más costosas, generando un severo desbalance. |

---

## Pregunta 12 - False sharing

**Enunciado:** Dos hilos trabajan sobre un arreglo donde el hilo 0 escribe en `arr[0]` y el hilo 1 escribe en `arr[1]`. Ambos elementos están en la misma línea de caché.

**Respuestas correctas: A, B, D, E**

| Opción | Texto | Correcta | Explicación |
|--------|-------|----------|-------------|
| **A** | Esto causa false sharing porque los hilos invalidan mutuamente la línea de caché | **Correcta** | Aunque cada hilo escribe en posiciones lógicamente independientes, ambas residen en la **misma línea de caché** (típicamente 64 bytes). Cuando un hilo escribe, el protocolo de coherencia de caché (MESI/MOESI) invalida esa línea en las cachés de los otros cores, forzando recarga. |
| **B** | El efecto ping-pong entre cachés de distintos cores reduce el rendimiento | **Correcta** | Cada escritura de un core invalida la línea en el otro core. El otro core debe recargarla antes de su siguiente escritura, lo que a su vez invalida la copia del primero. Este efecto ping-pong genera tráfico constante en el bus de coherencia y degrada severamente el rendimiento. |
| **C** | No hay problema porque cada hilo escribe en posiciones diferentes del arreglo | **Incorrecta** | A nivel lógico los datos son independientes, pero a nivel de hardware la **unidad de coherencia es la línea de caché**, no el byte individual. El protocolo de coherencia opera sobre líneas completas, causando invalidaciones innecesarias. Es precisamente por eso que se llama **false** sharing: los datos no se comparten realmente, pero la caché cree que sí. |
| **D** | Una solución es que cada hilo trabaje en bloques de memoria contiguos separados por al menos una línea de caché | **Correcta** | Si se asegura que los datos de cada hilo residen en líneas de caché diferentes (usando padding o alineación), las escrituras de un hilo no invalidan las líneas del otro. Una técnica común es usar `alignas(64)` o agregar bytes de relleno entre las posiciones de cada hilo. |
| **E** | Usar variables locales al hilo y combinar al final evita este problema | **Correcta** | Si cada hilo acumula resultados en variables locales (en su stack o en registros), no hay accesos concurrentes a memoria compartida. Al final, se combinan los resultados parciales. Esto elimina completamente el false sharing durante el cómputo. |

---

## Pregunta 13 - Valgrind cachegrind y localidad de caché

**Enunciado:** Se compilan dos versiones de un programa que recorre una matriz 10000x10000. La versión A recorre por filas y la B por columnas. Valgrind con cachegrind reporta:

| Métrica | Versión A | Versión B |
|---------|-----------|-----------|
| D1 misses | 6,288,342 | 112,544,390 |
| D1 miss rate | 0.8% | 14.0% |

**Respuestas correctas: A, B, C, D**

| Opción | Texto | Correcta | Explicación |
|--------|-------|----------|-------------|
| **A** | La versión A tiene mejor localidad espacial de caché | **Correcta** | La versión A (por filas) accede a elementos contiguos en memoria. En C/C++, las matrices se almacenan en row-major order, por lo que elementos consecutivos de una fila son adyacentes en memoria. Esto aprovecha las líneas de caché: al cargar una línea, varios elementos siguientes ya están disponibles. |
| **B** | En C/C++, las matrices se almacenan en row-major order, por eso recorrer por filas es más eficiente | **Correcta** | En row-major order, `M[i][j]` y `M[i][j+1]` son adyacentes en memoria. Recorrer por filas (`j` en el bucle interno) produce accesos secuenciales que aprovechan la localidad espacial. Recorrer por columnas (`i` en el bucle interno) salta una fila completa (10000 elementos) entre accesos consecutivos. |
| **C** | La versión B genera aproximadamente 18 veces más fallos de caché L1 | **Correcta** | 112,544,390 / 6,288,342 = **17.9x**, aproximadamente 18 veces más fallos. Esto se debe a que recorrer por columnas salta filas enteras en memoria, desperdiciando las líneas de caché cargadas. |
| **D** | Valgrind simula la caché, por lo que los resultados son aproximados pero representativos | **Correcta** | Valgrind/cachegrind no usa contadores de hardware reales: ejecuta el programa en un entorno de instrumentación y **simula** el comportamiento de la caché usando un modelo configurable. Los resultados son aproximaciones del comportamiento real, pero son suficientemente representativos para identificar problemas de localidad. |
| **E** | La versión B es más lenta porque usa más memoria RAM | **Incorrecta** | Ambas versiones procesan la misma matriz y usan la misma cantidad de memoria RAM. La diferencia no es de consumo de memoria sino de **patrón de acceso a memoria**. La versión B es más lenta porque sus accesos no secuenciales causan fallos de caché L1, forzando accesos a niveles más lentos de la jerarquía de memoria. |

---

## Pregunta 14 - Interpretar perf stat

**Enunciado:** Al ejecutar `perf stat` sobre un programa C++ se obtiene la siguiente salida:

```
1,757,832,365 instructions  # 1.64 insn per cycle
1,073,534,542 cycles
  176,994,651 branches
    8,642,462 branch-misses # 4.88%
```

**Respuestas correctas: A, B, C, D, E (todas)**

| Opción | Texto | Correcta | Explicación |
|--------|-------|----------|-------------|
| **A** | Un IPC (instrucciones por ciclo) de 1.64 indica buen aprovechamiento del procesador | **Correcta** | El IPC mide cuántas instrucciones completa el procesador por ciclo de reloj. Un IPC de 1.64 indica que el pipeline superescalar del procesador está ejecutando más de una instrucción por ciclo en promedio. Valores entre 1 y 4 son típicamente buenos en procesadores modernos. |
| **B** | Un IPC menor a 1 indicaría stalls o esperas en el procesador | **Correcta** | Un IPC < 1 significa que en promedio se completa menos de una instrucción por ciclo, lo que indica que el procesador está parado frecuentemente (stalls). Las causas comunes son: fallos de caché (espera por datos de memoria), branch mispredictions, o dependencias de datos que bloquean el pipeline. |
| **C** | El 4.88% de branch-misses es un porcentaje aceptable (por debajo del 5%) | **Correcta** | Un porcentaje de branch-misses por debajo del 5% generalmente se considera aceptable. Significa que el predictor de saltos del procesador acierta el ~95% de las veces. Porcentajes mayores (>10-15%) indican lógica condicional muy impredecible que podría beneficiarse de refactorización. |
| **D** | `perf` accede a contadores reales de hardware, a diferencia de Valgrind que simula | **Correcta** | `perf` utiliza los Performance Monitoring Counters (PMC) integrados en el procesador. Estos son registros de hardware que cuentan eventos reales (ciclos, instrucciones, fallos de caché, branch-misses). Valgrind, en cambio, ejecuta el programa sobre una máquina virtual y simula el comportamiento. `perf` tiene menor overhead y mayor precisión. |
| **E** | Si las branch-misses superaran el 15%, indicaría lógica condicional altamente impredecible | **Correcta** | Un 15% o más de branch-misses indica que el predictor de saltos falla frecuentemente, lo cual degrada el rendimiento por las penalizaciones de pipeline flush (típicamente 10-20 ciclos por misprediction). Esto sugiere patrones de ramificación impredecibles que podrían optimizarse con técnicas como branchless programming o reorganización de condiciones. |

---

## Pregunta 15 - Elegir herramienta de profiling en Linux

**Enunciado:** Un estudiante necesita analizar un programa C++ paralelo con OpenMP. Quiere saber: (1) cuántos hilos está usando el proceso, (2) si hay fallos de caché, y (3) el rendimiento de hardware en tiempo real.

**Respuestas correctas: A, B, C, E**

| Opción | Texto                                                                                            | Correcta       | Explicación                                                                                                                                                                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A**  | Con `ps -p PID -o thcount` puede verificar el número de hilos del proceso                        | **Correcta**   | El comando `ps` con la opción `-o thcount` muestra la cantidad de hilos (threads) del proceso especificado. Esto permite verificar que el programa OpenMP está creando el número esperado de hilos.                                                           |
| **B**  | Valgrind con `cachegrind` le permite analizar los fallos de caché                                | **Correcta**   | `valgrind --tool=cachegrind` simula la jerarquía de caché y reporta fallos de caché L1 (D1, I1) y último nivel (LL). Es la herramienta adecuada para el objetivo (2) del enunciado.                                                                           |
| **C**  | `perf stat` le permite ver contadores de hardware como ciclos, instrucciones e IPC               | **Correcta**   | `perf stat` accede a los contadores de rendimiento del hardware y reporta métricas como ciclos, instrucciones, IPC, fallos de caché de hardware, y branch-misses. Cubre el objetivo (3) del enunciado.                                                        |
| **D**  | `top` es suficiente para analizar fallos de caché en detalle                                     | **Incorrecta** | `top` muestra métricas de uso de recursos a nivel de proceso (CPU%, memoria, etc.), pero **no** tiene acceso a contadores de caché ni reporta fallos de caché. Para análisis de caché se necesita `valgrind --tool=cachegrind` o `perf stat` / `perf record`. |
| **E**  | `htop` muestra barras de uso por núcleo, útil para verificar que el programa usa múltiples cores | **Correcta**   | `htop` presenta una vista gráfica con barras de uso **por cada núcleo/core** del procesador. Esto permite verificar visualmente que un programa OpenMP está distribuyendo trabajo entre múltiples cores (todos con uso alto) en lugar de usar un solo core.   |

---

## Resumen de respuestas

| Pregunta | Tema | Respuestas correctas |
|----------|------|---------------------|
| 1 | Ley de Amdahl | A, B, C, E |
| 2 | Identificar paralelización | A, C, D |
| 3 | Power Wall y Memory Wall | A, B, D, E |
| 4 | Herramientas profiling Python | B, D, E |
| 5 | Interpretar salida cProfile | A, B, D, E |
| 6 | GIL y threading vs multiprocessing | A, B, D, E |
| 7 | Condiciones de carrera en Python | B, C, E |
| 8 | Memoria independiente en multiprocessing | B, C, D, E |
| 9 | Condición de carrera en OpenMP | B, C, D, E |
| 10 | Directivas sections y single en OpenMP | A, B, D, E |
| 11 | Schedule en OpenMP | B, C, D, E |
| 12 | False sharing | A, B, D, E |
| 13 | Valgrind cachegrind localidad de caché | A, B, C, D |
| 14 | Interpretar perf stat | A, B, C, D, E |
| 15 | Elegir herramienta de profiling Linux | A, B, C, E |
