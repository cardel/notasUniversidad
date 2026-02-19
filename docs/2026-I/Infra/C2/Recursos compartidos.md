# Recursos compartidos en sistemas paralelos

## Concepto fundamental

Cuando tenemos paralelización, la memoria es un recurso que todos los procesos e hilos tienen en común. El acceso eficiente a este recurso compartido es crítico para el rendimiento de programas paralelos.

## Localidades de memoria

### 1. Localidad espacial

La localidad espacial se refiere al principio de que si se accede a una dirección de memoria, es probable que se acceda a direcciones cercanas en el futuro próximo. Los sistemas de caché aprovechan esto cargando bloques de memoria (líneas de caché) en lugar de palabras individuales.

```scala
// Ejemplo: acceso a elementos consecutivos de un arreglo
for (int i = 0; i < 10; i++) {
  // Se acceden elementos consecutivos arr[0], arr[1], arr[2], ...
  // Una vez que arr[0] es cargado en caché, los elementos arr[1], arr[2], etc.
  // ya están disponibles porque se cargan juntos en la misma línea de caché
  printf("%d", arr[i])
}

// El patrón de acceso secuencial favorece la localidad espacial:
// - arr[0] genera un cache miss, carga arr[0]...arr[7] (típicamente)
// - arr[1]...arr[7] generan cache hits (datos ya cargados)
// - arr[8] genera otro cache miss, carga arr[8]...arr[15]
```

**Implicación**: los accesos secuenciales a arreglos son eficientes porque aprovechan la localidad espacial. Accesos aleatorios o saltados causan más cache misses.

### 2. Localidad temporal

La localidad temporal se refiere al principio de que si se accede a una dirección de memoria, es probable que se acceda a la misma dirección nuevamente en el futuro próximo. Los datos más recientemente usados se mantienen en caché.

```scala
// Ejemplo: variables accedidas repetidamente
for (int i = 0; i < 100; i++) {
  // Las variables i, sum, y los elementos a[i] se acceden repetidamente
  // - i se accede cada iteración (comparación y incremento)
  // - sum se accede cada iteración (lectura y escritura)
  // - a[i] se accede una vez por iteración
  //
  // Almacenar estas variables en caché evita múltiples accesos a memoria RAM
  // que sería mucho más lento
  sum = sum + a[i]
}

// Gracias a localidad temporal:
// - sum permanece en caché L1 (más rápida)
// - i permanece en caché (probable que en registros)
// - a[i] puede permanecer en caché si el arreglo es pequeño
```

**Implicación**: los datos usados frecuentemente deben mantenerse en caché. Reutilizar variables es más eficiente que crear nuevas.

## Impacto en diseño de programas paralelos

En el diseño de programas paralelos se debe tener en cuenta estos dos aspectos de localidad, dado que un acceso deficiente a memoria puede producir latencias al tener que recargar la caché (cache miss).

### Ejemplo: Matrices bidimensionales

Una matriz bidimensional es internamente un arreglo unidimensional en memoria. Los elementos se almacenan secuencialmente, pero designamos ciertos segmentos como filas y columnas.

**Cálculo de posición en memoria**:
Para acceder al elemento en fila $i$ y columna $j$ de una matriz con $m$ columnas, la posición en el arreglo 1D es:

$$\text{posición} = i \times m + j$$

**Ejemplo concreto: matriz 2×2**

```
Matriz:
[0,0] [0,1]
[1,0] [1,1]

Almacenamiento en memoria (1D con 2 columnas):
Posición 0: [0,0]  (0×2 + 0 = 0)
Posición 1: [0,1]  (0×2 + 1 = 1)
Posición 2: [1,0]  (1×2 + 0 = 2)
Posición 3: [1,1]  (1×2 + 1 = 3)

Los elementos de cada fila están consecutivos en memoria.
```

**Acceso eficiente (por filas)**:

```scala
// Acceso por filas: [0,0] → [0,1] → [1,0] → [1,1]
// Secuencia en memoria: 0 → 1 → 2 → 3 (secuencial)
for (int i = 0; i < 2; i++) {
  for (int j = 0; j < 2; j++) {
    // Acceso a matriz[i][j] = matriz[i*2 + j]
    // Cuando accedemos a matriz[0][0] (posición 0), se carga la línea de caché
    // con elementos 0, 1, 2, 3 (toda la matriz en este caso)
    // Elementos posteriores son cache hits
    procesarElemento(matriz[i][j])
  }
}

// Resultado: excelente localidad espacial, muy pocos cache misses
```

**Acceso ineficiente (por columnas)**:

```scala
// Acceso por columnas: [0,0] → [1,0] → [0,1] → [1,1]
// Secuencia en memoria: 0 → 2 → 1 → 3 (saltos)
for (int j = 0; j < 2; j++) {
  for (int i = 0; i < 2; i++) {
    // Acceso a matriz[i][j] = matriz[i*2 + j]
    // Cuando accedemos a matriz[0][0] (posición 0), se carga caché con 0,1,2,3
    // Cuando accedemos a matriz[1][0] (posición 2), ya está en caché (hit)
    // Cuando accedemos a matriz[0][1] (posición 1), ya está en caché (hit)
    // Cuando accedemos a matriz[1][1] (posición 3), ya está en caché (hit)
    procesarElemento(matriz[i][j])
  }
}

// Resultado: en este caso pequeño, también es eficiente porque toda la matriz
// cabe en una línea de caché. Con matrices grandes, causaría muchos cache misses.
```

**Caso con matriz grande (1000×1000)**:

```scala
// Una línea de caché típicamente almacena 64 bytes ≈ 8 elementos double (8 bytes cada uno)

// Acceso por filas: elementos [i][0]...[i][7] están juntos → cache hit
for (int i = 0; i < 1000; i++) {
  for (int j = 0; j < 1000; j++) {
    // Cada 8 elementos se genera un cache miss (necesita cargar nueva línea)
    // En 1000 iteraciones: ~125 cache misses por fila, ~125000 en total
    procesarElemento(matriz[i][j])
  }
}

// Acceso por columnas: elementos [0][j], [1][j]... están separados 1000 posiciones
// → cada acceso genera cache miss (líneas de caché diferentes)
for (int j = 0; j < 1000; j++) {
  for (int i = 0; i < 1000; i++) {
    // Cada elemento genera un cache miss (está en línea de caché diferente)
    // En 1000 iteraciones: 1000 cache misses por columna, 1000000 en total
    procesarElemento(matriz[i][j])
  }
}

// Resultado: acceso por filas es ~1000 veces más rápido que por columnas
```

## Tiempo de acceso a memoria

El rendimiento de un sistema de caché se evalúa usando el **Tiempo Promedio de Acceso a Memoria (AMAT - Average Memory Access Time)**. Representa el tiempo promedio que el CPU requiere para acceder a datos o instrucciones, considerando tanto cache hits como cache misses.

### Fórmula del AMAT

Sean:
- $T_c$ = Tiempo para acceder a memoria caché (típicamente 1-4 ciclos de CPU)
- $T_m$ = Tiempo para acceder a memoria principal/RAM (típicamente 50-300 ciclos de CPU)
- $h$ = Razón de cache hits (probabilidad de que el dato buscado esté en caché)

Entonces, el tiempo promedio de acceso a memoria es:

$$\text{AMAT} = h \times T_c + (1 - h) \times T_m$$

### Interpretación

1. **Si el dato está en caché**: se accede en tiempo $T_c$ (rápido)
2. **Si el dato no está en caché**: se debe cargar desde RAM en tiempo $T_m$ (lento)
3. **El AMAT ponderado**: depende de la frecuencia de hits

### Ejemplos numéricos

**Ejemplo 1: Sistema con buen hit ratio**

- $T_c = 4$ ciclos de CPU
- $T_m = 100$ ciclos de CPU
- $h = 0.95$ (95% de hits)

$$\text{AMAT} = 0.95 \times 4 + 0.05 \times 100 = 3.8 + 5 = 8.8 \text{ ciclos}$$

El tiempo promedio es cercano al tiempo de caché porque casi siempre hay hits.

**Ejemplo 2: Sistema con mal hit ratio**

- $T_c = 4$ ciclos de CPU
- $T_m = 100$ ciclos de CPU
- $h = 0.50$ (50% de hits)

$$\text{AMAT} = 0.50 \times 4 + 0.50 \times 100 = 2 + 50 = 52 \text{ ciclos}$$

El tiempo promedio se acerca al de memoria RAM porque hay muchos misses.

### Impacto en paralelización

En sistemas paralelos, cada hilo compite por acceso a la caché compartida. Un pobre hit ratio en un hilo no afecta solo a ese hilo, sino a todos:

```scala
// Problema: acceso caótico a caché
parallel for (int id <- 0 until numHilos) {
  // Cada hilo accede a posiciones aleatorias del arreglo
  // Causa invalidación de líneas de caché entre hilos (false sharing)
  // El hit ratio cae drásticamente
  // El AMAT aumenta de 8.8 a 52+ ciclos
  procesarPosicionAleatoria(arreglo(random()))
}

// Solución: acceso ordenado con particiones
parallel for (int id <- 0 until numHilos) {
  // Cada hilo accede solo a su partición del arreglo
  val inicio = id * (arreglo.length / numHilos)
  val fin = (id + 1) * (arreglo.length / numHilos)
  // Los accesos son secuenciales dentro de cada partición
  // Hit ratio se mantiene alto (>90%)
  // AMAT permanece cercano a 8.8 ciclos
  for (i <- inicio until fin) {
    procesarElemento(arreglo(i))
  }
}
```

## Conceptos teóricos adicionales

### Jerarquía de memoria

Los sistemas modernos tienen múltiples niveles de caché:

```
Registros (CPU interno)     ~1 ciclo        Bytes         (no programable)
L1 Cache                    ~4 ciclos       32-64 KB      (muy rápida)
L2 Cache                    ~10 ciclos      256 KB        (rápida)
L3 Cache (compartida)       ~40 ciclos      8 MB          (más lenta)
Memoria RAM                 ~100+ ciclos    Gigabytes     (muy lenta)
Almacenamiento (SSD/HDD)    ~100,000 ciclos Terabytes     (extremadamente lento)
```

El objetivo de la programación eficiente es mantener datos en los niveles más rápidos el mayor tiempo posible.

### Cache thrashing

Ocurre cuando el patrón de acceso a memoria causa invalidaciones constantes de líneas de caché. Típicamente sucede cuando:

- Múltiples hilos acceden a variables cercanas en memoria (false sharing)
- El tamaño del working set es mayor que el tamaño de la caché
- Hay acceso aleatorio sin localidad

### Arquitectura NUMA (Non-Uniform Memory Access)

En sistemas con múltiples CPUs, cada CPU tiene su propia memoria local más rápida y memoria remota más lenta:

```
CPU 1                          CPU 2
┌──────────────┐              ┌──────────────┐
│  L1/L2/L3    │              │  L1/L2/L3    │
│  RAM Local   │              │  RAM Local   │
└──────┬───────┘              └──────┬───────┘
       │                             │
       └─────────────┬───────────────┘
                     │
              Interconexión (lenta)

Acceso a RAM local: ~50 ciclos
Acceso a RAM remota: ~100+ ciclos
```

Para sistemas NUMA, es crítico que cada hilo acceda principalmente a memoria local.

## Tabla de resumen

| Concepto | Descripción | Implicación en paralelización |
|----------|-------------|-------------------------------|
| Localidad espacial | Acceso a direcciones cercanas de memoria | Favorecer acceso secuencial sobre aleatorio |
| Localidad temporal | Reutilización de mismas direcciones | Mantener variables frecuentes en caché |
| Cache hit | Dato encontrado en caché | Tiempo rápido (~4 ciclos) |
| Cache miss | Dato no en caché, requiere RAM | Tiempo lento (~100 ciclos) |
| Hit ratio (h) | Porcentaje de accesos que encuentran dato en caché | Afecta AMAT: mayor h → menor AMAT |
| AMAT | Tiempo promedio: $h \times T_c + (1-h) \times T_m$ | Métrica clave de rendimiento de memoria |
| Línea de caché | Bloque de memoria cargado junto (~64 bytes) | Múltiples elementos cargan juntos |
| False sharing | Variables compartidas en misma línea de caché | Causa invalidación innecesaria entre hilos |
| Matriz 2D en memoria | Almacenada como arreglo 1D, acceso por fila es óptimo | Acceso por columna causa cache misses |
| Posición en matriz | $\text{pos} = i \times m + j$ | Determina si acceso es secuencial |
| Jerarquía de memoria | Múltiples niveles de caché + RAM + almacenamiento | Optimizar para mantener datos en niveles rápidos |
| Cache thrashing | Invalidaciones constantes sin reuso | Evitar patrones caóticos de acceso |
| NUMA | Memoria local vs. remota con latencias diferentes | Cada hilo debe acceder memoria local |
| Context switching | Cambio entre hilos en un núcleo | Puede desalojar líneas de caché útiles |

## Comentarios adicionales

### Patrones de acceso recomendados para paralelización

1. **Particionamiento de datos**: dividir datos entre hilos de modo que cada hilo tenga su región continua
2. **Acceso secuencial**: dentro de cada partición, acceder elementos en orden
3. **Evitar false sharing**: asegurar que variables compartidas entre hilos no estén en misma línea de caché
4. **Minimizar comunicación**: reducir accesos a datos de otros hilos

### Herramientas de análisis

- **Profilers**: herramientas como `perf` (Linux), Intel VTune, o Apple Instruments pueden medir hit ratio y AMAT
- **Simuladores de caché**: cachegrind (parte de Valgrind) puede mostrar exactamente dónde ocurren misses
- **Análisis estático**: revisar código para identificar patrones de acceso ineficientes

### Optimización práctica

El principio general es: **los ciclos de CPU gastados accediendo a memoria son ciclos desperdiciados**. 

Una mejora pequeña en hit ratio (de 85% a 90%) puede resultar en speedup de 20-50% en programas limitados por memoria, que es la mayoría de programas paralelos reales.

### Relación con Ley de Amdahl

La eficiencia de memoria afecta directamente al coeficiente de paralelización en Ley de Amdahl. Si la paralelización introduce mucho cache thrashing, la fracción paralelizable $p$ disminuye efectivamente, reduciendo el beneficio esperado.