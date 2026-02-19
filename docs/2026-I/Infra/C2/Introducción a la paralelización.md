# Introducción a la paralelización

## Conceptos fundamentales

### 1. Definición y objetivo de la paralelización

Paralelizar implica dividir una tarea en subtareas más pequeñas y posteriormente unir los resultados. El enfoque principal es **reducir el tiempo de ejecución o span** del programa.

En un programa secuencial, todas las operaciones se ejecutan una tras otra. En un programa paralelo, múltiples operaciones se ejecutan simultáneamente en diferentes núcleos o hilos:

```
Ejecución secuencial:
Tarea A → Tarea B → Tarea C → Tarea D
[========][========][========][========]  Tiempo total: 4 unidades

Ejecución paralela (2 núcleos):
Tarea A → Tarea C
Tarea B → Tarea D
[====][====]                              Tiempo total: 2 unidades
```

El objetivo es maximizar el uso de los recursos disponibles y reducir el tiempo total de ejecución.

### 2. Ley de Amdahl

La **Ley de Amdahl** establece una relación fundamental entre el grado de paralelización y la mejora esperada en el tiempo de ejecución. Si una parte de un programa no puede paralelizarse, esta parte limita la mejora total posible.

La fórmula es:

$$S = \frac{1}{(1-p) + \frac{p}{n}}$$

Donde:
- $S$ = aceleración (speedup) teórica
- $p$ = fracción del programa que puede paralelizarse (entre 0 y 1)
- $n$ = número de procesadores disponibles

**Ejemplo práctico**:
- Si el 80% del programa puede paralelizarse ($p = 0.8$) y tenemos 4 procesadores ($n = 4$):

$$S = \frac{1}{0.2 + \frac{0.8}{4}} = \frac{1}{0.2 + 0.2} = \frac{1}{0.4} = 2.5$$

Esto significa que el programa se ejecutaría 2.5 veces más rápido en teoría, no 4 veces más rápido. El 20% que no se puede paralelizar (la parte secuencial) limita severamente el beneficio total.

**Implicaciones**:
- No siempre vale la pena paralelizar. Si solo el 10% del programa es paralelizable, aumentar procesadores da poco beneficio.
- Es crítico identificar cuáles son las partes paralelizables del código.
- La mejora máxima teórica es limitada por la parte secuencial.

### 3. Desafíos de determinismo en la paralelización

Un programa es **determinista** si produce el mismo resultado cada vez que se ejecuta con las mismas entradas. La paralelización introduce desafíos de no determinismo:

**Problema de dependencia de datos**:

Si los datos deben combinarse en un orden específico, la paralelización se ve limitada. Por ejemplo:

```scala
// Ejemplo: llenar un array con dependencia de datos
// A[i] = A[i-1] + 1
// La posición i-1 DEBE calcularse antes de la posición i

var A = Array(0, 0, 0, 0)

// Secuencial (determinista):
for (i <- 1 until A.length) {
  A(i) = A(i-1) + 1  // A(1) depende de A(0), A(2) depende de A(1), etc.
}
// Resultado: A = [0, 1, 2, 3]

// Intento paralelo (NO DETERMINISTA sin sincronización):
parallel for (i <- 1 until A.length) {
  A(i) = A(i-1) + 1  // ¿Qué pasa si el hilo i intenta leer A(i-1)
}                      // antes de que el hilo i-1 haya escrito su valor?
```

**Soluciones al problema de no determinismo**:

1. **Sentencias de sincronización**: algunos lenguajes incluyen primitivas de sincronización para ejecutar operaciones en hilos en un orden específico:

```scala
// Usando sincronización (con sacrificio de span)
var A = Array(0, 0, 0, 0)

parallel for (i <- 1 until A.length) {
  synchronized {  // Asegura que solo un hilo accede a la vez
    A(i) = A(i-1) + 1
  }
}
// Ahora es determinista, pero la sincronización serializa el acceso
// El span mejora poco o nada comparado con versión secuencial
```

2. **Reorganizar el algoritmo**: buscar una forma de expresar el problema sin dependencias entre iteraciones:

```scala
// Versión paralelizable sin dependencias
// Usar reduce o fold para acumular resultados en paralelo
val resultado = (1 until A.length)
  .par  // Marcar como paralelizable
  .map(i => (i, i))  // Cada iteración es independiente
  .fold(Array(0, 0, 0, 0)) { (arr, pair) =>
    val (idx, val) = pair
    arr(idx) = val
    arr
  }
```

3. **Barreras de sincronización**: permitir que algunos hilos continúen mientras otros esperan puntos específicos:

```scala
// Usando barreras: permite paralelización parcial
// Las iteraciones se dividen en fases, cada fase debe terminar
// antes de que la siguiente comience
barrier()  // Todos los hilos esperan aquí
A(i) = A(i-1) + 1
barrier()  // Siguiente fase comienza solo cuando todos terminan
```

### 4. Núcleos vs. hilos

Aunque relacionados, son conceptos diferentes:

**Núcleos (cores)**:
- Son componentes de **hardware**
- Cada núcleo es una unidad de procesamiento física independiente en el CPU
- Un procesador moderno tiene múltiples núcleos (2, 4, 8, 16 o más)
- El número de núcleos es limitado por la arquitectura física

**Hilos (threads)**:
- Son entidades de **software** (ejecutadas por el sistema operativo)
- El SO gestiona cuándo y dónde ejecuta cada hilo
- Un solo núcleo puede ejecutar múltiples hilos (el SO los alterna rápidamente)
- El número de hilos puede ser mayor que el número de núcleos

```
Hardware con 4 núcleos:

Núcleo 1  ↔ [Hilo 1, Hilo 5, Hilo 9]
Núcleo 2  ↔ [Hilo 2, Hilo 6]
Núcleo 3  ↔ [Hilo 3, Hilo 7, Hilo 10]
Núcleo 4  ↔ [Hilo 4, Hilo 8]

El SO realiza context switching: cada núcleo ejecuta un hilo a la vez,
pero alterna entre hilos según prioridades y disponibilidad.
```

**Relación con la paralelización**:
- La paralelización verdadera (sin esperas) solo es posible hasta el número de núcleos disponibles
- Crear más hilos que núcleos introduce **overhead** de context switching
- Idealmente, se crean tantos hilos como núcleos disponibles para minimizar overhead

### 5. El problema principal: gestión de memoria y caché

El desafío más significativo en la paralelización es la **gestión de memoria**, especialmente la caché:

**Problema de coherencia de caché**:

```
Escenario: Dos hilos accediendo a la misma variable

Hilo 1 en Núcleo 1          Hilo 2 en Núcleo 2
├─ Lee x = 10              ├─ Lee x = 10
│  (copia en caché L1)      │  (copia en caché L1)
├─ x = x + 1                │
│  (x = 11, actualiza L1)   │
└─ [Caché L1: x=11]         └─ ¿Cuál es el valor de x? ¿10 o 11?
```

La caché de cada núcleo puede tener copias diferentes de la misma variable en memoria, creando **inconsistencia**.

**Soluciones**:

1. **Protocolos de coherencia de caché (hardware)**: el hardware automáticamente sincroniza cachés cuando un núcleo escribe un valor que otro núcleo tiene cacheado.

```
Hilo 1 escribe x = 11
↓
Hardware detecta que Núcleo 2 también tiene x en caché
↓
Invalida la caché de Núcleo 2
↓
Hilo 2 debe releer x desde memoria (ahora x = 11)
```

Esto tiene un costo: invalidar y releer caché es más lento que acceso local a caché.

2. **False sharing (compartimiento falso)**: un problema común donde dos variables están en la misma línea de caché, causando invalidaciones innecesarias:

```
Línea de caché (típicamente 64 bytes):
[Variable A][Variable B][Variable C]...

Hilo 1 modifica A → Invalida toda la línea → Hilo 2 debe releer B y C
```

Solución: **padding** para asegurar que variables compartidas están en líneas de caché diferentes.

3. **Locality of reference**: organizar el código para que cada hilo acceda principalmente a su propia región de memoria, minimizando accesos remotos:

```scala
// Malo: falso compartimiento
var contador = 0
parallel for (i <- 1 to 1000000) {
  contador += 1  // Todos los hilos modifican la misma variable
}

// Mejor: cada hilo con su propia variable
val contadores = Array.fill(numHilos)(0)
parallel for (i <- 1 to 1000000) {
  contadores(threadId) += 1  // Cada hilo modifica su propia posición
}
val resultado = contadores.sum  // Combinar al final
```

## Conceptos teóricos adicionales

### Span vs. Work

En análisis de algoritmos paralelos se distinguen:

**Work (W)**: cantidad total de operaciones realizadas. Es lo mismo en versión secuencial y paralela.

**Span (S)**: el tiempo que tarda en completarse el algoritmo usando paralelización infinita. Es el camino crítico de dependencias.

La aceleración máxima es $\frac{W}{S}$, y es imposible hacerlo más rápido que $S$ incluso con infinitos procesadores.

```
Ejemplo:
Secuencial:  [A][B][C][D][E]  Work = 5, Span = 5

Paralelo:    [A,B,C][D][E]     Work = 5, Span = 3
             A, B, C en paralelo
```

### Speedup y eficiencia

**Speedup**: $Sp = \frac{T_{secuencial}}{T_{paralelo}}$

Idealmente es cercano a $n$ (número de procesadores), pero Amdahl limita esto.

**Eficiencia**: $E = \frac{Sp}{n}$

Una eficiencia de 1.0 significa speedup lineal (ideal pero raro).
Una eficiencia de 0.5 significa que los procesadores están siendo usados al 50% de su capacidad.

### Granularidad

La **granularidad** se refiere al tamaño de cada subtarea:

**Granularidad gruesa**: pocas tareas grandes
- Menos overhead de sincronización
- Menos oportunidad de balanceo de carga
- Riesgo de que algunos procesadores queden ociosos

**Granularidad fina**: muchas tareas pequeñas
- Mejor balanceo de carga
- Mayor overhead de sincronización y comunicación
- Puede ser contraproducente si el overhead supera el beneficio

## Tabla de resumen

| Concepto | Descripción | Implicación práctica |
|----------|-------------|----------------------|
| Paralelización | Dividir tarea en subtareas ejecutadas simultáneamente | Reduce tiempo de ejecución en sistemas multinúcleo |
| Ley de Amdahl | Limitación teórica de mejora: $S = \frac{1}{(1-p) + \frac{p}{n}}$ | Valida si vale la pena paralelizar cada sección |
| Determinismo | Capacidad de obtener mismo resultado cada ejecución | No determinismo por dependencias entre datos |
| Sincronización | Mecanismo para ordenar operaciones en múltiples hilos | Garantiza correctitud pero sacrifica span |
| Núcleo (core) | Unidad física de procesamiento en CPU | Limita paralelización verdadera |
| Hilo (thread) | Entidad de software ejecutada por el SO | Puede haber más hilos que núcleos |
| Coherencia de caché | Protocolo que mantiene consistencia entre cachés | Mayor costo de memoria en programas paralelos |
| False sharing | Variables compartidas en misma línea de caché | Invalida cachés innecesariamente |
| Locality of reference | Cada hilo accede a su región de memoria | Minimiza invalidaciones de caché |
| Span | Tiempo mínimo con paralelización infinita | Determina límite inferior de tiempo de ejecución |
| Work | Cantidad total de operaciones (independiente de paralelización) | Constante para un algoritmo dado |
| Granularidad | Tamaño de cada subtarea paralela | Afecta overhead vs. balanceo de carga |
| Speedup | $Sp = \frac{T_{secuencial}}{T_{paralelo}}$ | Medida de mejora real obtenida |
| Eficiencia | $E = \frac{Sp}{n}$ | Qué porcentaje de capacidad se utiliza |
| Context switching | Alternar entre hilos en un núcleo | Introduce latencia y overhead |

## Comentarios adicionales

### Cuándo es viable paralelizar

Basándose en la Ley de Amdahl:

1. **Vale la pena si $p$ es alto** (>80%): incluso con pocos procesadores, la mejora es significativa
2. **No vale la pena si $p$ es bajo** (<20%): el costo de sincronización supera el beneficio
3. **El número de procesadores importa menos si $p$ es bajo**: pasar de 4 a 16 procesadores da poco beneficio si solo el 10% es paralelizable

### Desafíos modernos

- **Escalabilidad**: pasar de 4 a 1000 núcleos introduce problemas nuevos (memoria distribuida, latencia de red)
- **Heterogeneidad**: no todos los núcleos son iguales (CPUs + GPUs, núcleos de alto rendimiento vs. bajo consumo)
- **Debugging**: los errores de concurrencia son no deterministas y muy difíciles de reproducir
- **Energía**: aunque paralelizar reduce tiempo, puede aumentar consumo total de energía

### Tendencias futuras

- **Computación distribuida**: paralelización más allá de un solo máquina (clusters, clouds)
- **Programación asíncrona**: alternativa a paralelización tradicional con hilos
- **Aceleradores**: GPUs y TPUs para paralelización masiva de ciertos tipos de tareas
- **Lenguajes diseñados para paralelización**: lenguajes modernos integran paralelización desde el diseño (Scala, Rust, Go)