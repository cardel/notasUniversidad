Es un API para programacion paralela en C++, es ampliamente utilizado por su potencial y permite distribuir procesos e hilos en sistemas multinucleo.

# Tipos de operaciones

## Facilmente paralelizables

Es sencillo dividirlas en diferentes bloques

1. Reducción vectorial (sumar los elementos de un vector)
2. Suma vectorial w = u + v

**3. Multiplicación escalar de vectores**
```cpp
for (int i = 0; i < n; i++) {
    w[i] = alpha * v[i];
}
```

**4. Aplicar función a cada elemento**
```cpp
for (int i = 0; i < n; i++) {
    y[i] = f(x[i]);  // f es cualquier función independiente
}
```

**5 Búsqueda del máximo/mínimo**
```cpp
float max_val = array[0];
#pragma omp parallel for reduction(max:max_val)
for (int i = 1; i < n; i++) {
    if (array[i] > max_val) max_val = array[i];
}
```

**6. Filtrado/Selección**
```cpp
// Filtrar elementos que cumplen condición
int count = 0;
#pragma omp parallel for reduction(+:count)
for (int i = 0; i < n; i++) {
    if (condition(array[i])) count++;
}
```


**Características comunes:**
- Sin dependencias entre iteraciones
- Operaciones independientes por elemento
- Fácil división en chunks/bloques
- Reducciones simples al final si es necesario

# No facilmente paralelizables

1. El producto punto entre dos vectores. Porque hay dependencia en el orden que se hacen la operaciones, debe tenerse en cuenta en que orden se hacen las operaciones
2. Calcular un vector de esta manera v[i] = v[i] + v[i-1]

**Características de no paralelizabilidad:**

- Dependencias de datos entre iteraciones
- Estado acumulativo que depende de cálculos previos
- Operaciones que requieren orden estricto de ejecución

# Memoria cache
Las operaciones paralelizables deben tener acceso rapido a la memoria cache (inicializar por filas), dado que agrega latencia al compartir bloques de cache.

## Problemas de paralelización por columnas

### Condiciones de carrera en cache

**Escenario con múltiples hilos:**
```cpp
#pragma omp parallel for
for(int j = 0; j < n; j++) {
    for (int i = 0; i < n; i++) {
        arr[i][j] = 0;  // Acceso por columnas
    }
}
```

**Problema 1: Falsa compartición (False Sharing)**
- Los hilos acceden a diferentes elementos `arr[i][j]`
- Pero estos elementos pueden caer en la **misma línea de cache**
- Cuando un hilo escribe `arr[i][j]`, invalida la línea de cache para otros hilos
- Ejemplo: `arr[0][0]` y `arr[1][0`] pueden estar en la misma línea de cache

**Problema 2: Patrón de acceso no contiguo**
```
Hilo 0: accede arr[0][0], arr[1][0], arr[2][0]...
Hilo 1: accede arr[0][1], arr[1][1], arr[2][1]...
```
- Cada hilo salta `n * sizeof(int)` bytes entre accesos
- Múltiples hilos causan **conflictos en bancos de memoria**
- El controlador de memoria no puede optimizar accesos aleatorios

### Latencia aumentada

**Efecto ping-pong en cache:**
```
Línea de cache: [arr[0][0], arr[0][1], arr[0][2], arr[0][3]]
Hilo 0 escribe arr[0][0] → invalida línea para otros hilos
Hilo 1 necesita arr[0][1] → cache miss, carga nueva línea
Hilo 2 necesita arr[0][2] → cache miss, carga nueva línea
```

**Saturación del bus de memoria:**
- Múltiples hilos generan cache misses simultáneamente
- El bus de memoria se satura con solicitudes de líneas de cache
- Aumenta la latencia promedio por acceso

### Comparación con acceso por filas paralelizado

**Por filas (óptimo):**
```cpp
#pragma omp parallel for
for (int i = 0; i < n; i++) {
    for(int j = 0; j < n; j++) {
        arr[i][j] = 0;  // Cada hilo trabaja en filas contiguas
    }
}
```

- Cada hilo accede a memoria contigua
- Mínima falsa compartición
- Prefetching efectivo
- Mejor utilización de ancho de banda

**Resultado:** El paralelismo por columnas puede ser **más lento** que la versión secuencial debido a la sobrecarga de sincronización de cache entre hilos. Recordar que el principal cuello de botella en la paralelizacion es la memoria cache.

## Resumen: Paralelización y Memoria Cache

OpenMP permite paralelización en sistemas multinúcleo, pero el rendimiento depende críticamente del patrón de acceso a memoria.

### Operaciones Paralelizables vs No Paralelizables

**Paralelizables:** Operaciones independientes por elemento (map, filter, reducciones)
**No paralelizables:** Operaciones con dependencias secuenciales (prefix sum, recurrencias)

### Consejos para Desarrolladores

1. **Analizar dependencias de datos** antes de paralelizar
2. **Optimizar patrones de acceso a memoria:**
   - Preferir acceso por filas en arreglos 2D
   - Mantener datos contiguos para cada hilo

3. **Minimizar falsa compartición:**
   - Alinear datos en límites de línea de cache
   - Usar relleno (padding) entre datos de diferentes hilos

4. **Considerar la jerarquía de memoria:**
   - Dividir trabajo en chunks que caben en cache L1/L2
   - Balancear carga computacional vs acceso a memoria

5. **Evaluar overhead vs beneficio:**
   - Paralelizar solo loops con suficiente trabajo
   - Medir speedup real considerando sincronización

6. **Usar directivas de OpenMP apropiadas:**
   - `reduction` para operaciones acumulativas
   - `schedule` para optimizar distribución de trabajo

**Conclusión:** El cuello de botella principal no es la CPU, sino el acceso eficiente a la memoria cache. La paralelización debe diseñarse considerando la localidad espacial y temporal de los datos.