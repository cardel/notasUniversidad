Es un API para paralelizar en C++, usando una escritura usando anotaciones, evitando alterar la estructura del código, a diferencia Threds o TBB

```bash
g++ -o exe archivo.cpp -fopenmp
```

OpenMP usa diferentes anotaciones de acuerdo a lo que se va hacer

```cpp
#include <cstdio>
#include <iostream>
#include <chrono>
#include <omp.h>

using namespace std;

// Inicialización del arreglo 2D - OPERACIÓN INDEPENDIENTE
void initialize(int ** arr, int n) {
  for (int i = 0; i < n; i++) {
    arr[i] = new int[n];
    for(int j = 0; j < n; j++) {
      arr[i][j] = i+j;  // Cada celda se calcula independientemente
    }
  }
  // PATRÓN DE ACCESO: Por filas (óptimo para cache)
  // Fácilmente paralelizable pero no se paralelizó aquí
}

// Reducción paralela - OPERACIÓN DE REDUCCIÓN
void reduce(int ** arr, int n, long &sum) {
  sum = 0;
  #pragma omp parallel for reduction(+:sum)  // DIRECTIVA OPENMP
  for (int i = 0; i < n; i++) {
    for(int j = 0; j < n; j++) {
      sum += arr[i][j];  // Cada hilo tiene suma parcial
    }
  }
  // MECANISMO: Cada hilo calcula suma local, luego se combinan
}

int main (int argc, char *argv[]) {
  const int size = 10000;
  int **ar = new int*[size];
  initialize(ar,size);
  long sum = 0;
  
  auto start = std::chrono::high_resolution_clock::now();
  reduce(ar,size,ref(sum));  // LLAMADA PARALELIZADA
  auto end = std::chrono::high_resolution_clock::now();
  
  printf("La suma es %ld\n", sum);
  printf("El tiempo en ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());
  return 0;
}
```

## Análisis de Resultados y Conceptos de Paralelismo

### Resultados Observados:
- **Sin OpenMP**: 237.78 ms
- **Con OpenMP**: 47.72 ms
- **Speedup**: ~5x (237.78 / 47.72)

### Conceptos Aplicados:

**1. Operación Fácilmente Paralelizable:**
- La reducción (suma de elementos) es **embarazosamente paralela**
- Cada elemento puede procesarse independientemente
- Solo necesita combinación final (reducción)

**2. Patrón de Acceso a Memoria Óptimo:**
```cpp
for (int i = 0; i < n; i++) {
    for(int j = 0; j < n; j++) {  // Acceso por filas
        sum += arr[i][j];
    }
}
```
- **Localidad espacial**: Acceso contiguo a memoria
- **Eficiencia en cache**: Cada hilo procesa filas completas
- **Minimiza cache misses**

**3. Mecanismo de Reducción OpenMP:**
- `reduction(+:sum)` crea variables locales por hilo
- Evita **condiciones de carrera** en la variable compartida
- Combina automáticamente resultados al final

**4. Escalabilidad:**
- Speedup de ~5x sugiere buen uso de múltiples núcleos
- La operación es **compute-bound** (más cálculo que acceso a memoria)
- Overhead de paralelización justificado por el trabajo

**Conclusión:** Este código demuestra paralelización efectiva donde el patrón de acceso a memoria y la naturaleza de la operación permiten aprovechar múltiples núcleos sin problemas de sincronización o falsa compartición.

## Análisis del Cambio: Acceso por Columnas

```cpp
void reduce(int ** arr, int n, long &sum) {
  sum = 0;
  #pragma omp parallel for reduction(+:sum)
  for (int j = 0; j < n; j++) {      // Loop externo por columnas
    for(int i = 0; i < n; i++) {     // Loop interno por filas
      sum += arr[i][j];              // Acceso: arr[0][j], arr[1][j], arr[2][j]...
    }
  }
}
```

### Resultados Comparativos:
- **Acceso por filas**: 47.72 ms
- **Acceso por columnas**: 140.24 ms
- **Degradación**: ~3x más lento

### Problemas de Paralelización por Columnas:

**1. Patrón de Acceso No Contiguo:**
```
Hilo 0: arr[0][0], arr[1][0], arr[2][0]... (salta n elementos entre accesos)
Hilo 1: arr[0][1], arr[1][1], arr[2][1]...
Hilo 2: arr[0][2], arr[1][2], arr[2][2]...
```
- Cada acceso salta `n * sizeof(int)` bytes
- **Cache misses frecuentes**

**2. Falsa Compartición (False Sharing):**
- Múltiples hilos acceden a diferentes `arr[i][j]`
- Pero `arr[0][0]`, `arr[0][1]`, `arr[0][2]` están en la misma línea de cache
- Cuando un hilo escribe, invalida la cache para otros hilos

**3. Efecto Ping-Pong en Cache:**
```
Línea de cache: [arr[0][0], arr[0][1], arr[0][2], arr[0][3]]
Hilo 0 accede arr[0][0] → carga línea
Hilo 1 accede arr[0][1] → misma línea, pero posible invalidación
Hilo 2 accede arr[0][2] → cache miss si línea fue invalidada
```

**4. Saturación del Bus de Memoria:**
- Múltiples hilos generan cache misses simultáneos
- El bus de memoria se congestiona
- Aumenta la latencia promedio

### Comparación de Comportamiento:

**Acceso por Filas (óptimo):**
- Cada hilo procesa bloques contiguos de memoria
- Alta localidad espacial
- Prefetching efectivo
- Mínima falsa compartición

**Acceso por Columnas (subóptimo):**
- Accesos dispersos en memoria
- Baja localidad espacial
- Prefetching ineficiente
- Alta falsa compartición

### Conclusión:
Aunque la operación de reducción es fácilmente paralelizable, el **patrón de acceso a memoria** determina el rendimiento final. El acceso por columnas introduce overhead de sincronización de cache que contrarresta los beneficios del paralelismo, resultando en un rendimiento 3x peor que el acceso por filas.