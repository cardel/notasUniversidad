# Notas de compilación

Tiene que estar instalado onetbb

```bash
g++ -o ejecutable archivo.cpp -ltbb
```

# Librería TBB



A diferencia de `std::thread`, esta librería nos ofrece bloques para paralelizar utilizando un esquema de **pipeline** (los resultados se van recogiendo paulatinamente), aprovechando los espacios de espera entre hilos, a diferencia del enfoque map-reduce.

TBB (Threading Building Blocks) ofrece diferentes bloques:

1. **Bloque `parallel_for`**: Permite iterar paralelamente sobre un rango
2. **Bloque `blocked_range`**: Permite generar un iterador para recorrer una estructura de datos dividida en bloques
3. **Bloque `parallel_reduce`**: Sirve para acumular los resultados de una operación de reducción sobre una estructura de datos, por ejemplo, la suma de elementos

```C++
#include <chrono>
#include <iostream>
#include <tbb/blocked_range.h>
#include <tbb/parallel_for.h>
#include <tbb/parallel_reduce.h>
#include <vector>

using namespace std;
using namespace std::chrono;

const int VECTOR_SIZE = 1000000;
// Establece el número de hilos de TBB a 4 (comentado para usar configuración por defecto)
// tbb::task_scheduler_init init(4);

vector<long> v(VECTOR_SIZE);

// Función para llenar el vector usando paralelismo con TBB
void fillVector() {
  tbb::parallel_for(tbb::blocked_range<int>(0, VECTOR_SIZE),
                    [&](tbb::blocked_range<int> r) {
                      // Cada hilo procesa un subrango del vector
                      for (int i = r.begin(); i < r.end(); i++) {
                        v[i] = 10;
                      }
                    });
}

// Versión secuencial para comparación
void fillVectorSeq() {
  for (int i = 0; i < VECTOR_SIZE; i++) {
    v[i] = 10;
  }
}

// Función para sumar elementos del vector usando reducción paralela con TBB
void sumVector(long &result) {
  result = tbb::parallel_reduce(
      // Rango completo a procesar
      tbb::blocked_range<int>(0, VECTOR_SIZE), 
      // Valor inicial de la reducción
      0,
      // Función lambda que realiza la suma parcial en cada subrango
      [&](tbb::blocked_range<int> r, long init) -> long {
        for (int i = r.begin(); i < r.end(); i++) {
          init += v[i];
        }
        return init;
      },
      // Función de combinación: suma los resultados parciales
      [](long x, long y) -> long { return x + y; });
}

// Versión secuencial de la suma
long sumVectorSeq() {
  long result = 0;
  for (int i = 0; i < VECTOR_SIZE; i++) {
    result += v[i];
  }
  return result;
}

int main() {
  // ========== VERSIÓN PARALELA CON TBB ==========
  auto start = high_resolution_clock::now();

  fillVector();  // Llenado paralelo

  long result = 0;
  sumVector(result);  // Suma paralela con reducción

  auto stop = high_resolution_clock::now();
  auto duration = duration_cast<milliseconds>(stop - start);
  cout << "Time TBB: " << duration.count() << " ms" << endl;
  cout << "Result: " << result << endl;

  // ========== VERSIÓN SECUENCIAL (PARA COMPARACIÓN) ==========
  auto start2 = high_resolution_clock::now();
  fillVectorSeq();
  long resultSeq = sumVectorSeq();

  auto stop2 = high_resolution_clock::now();
  auto duration2 = duration_cast<milliseconds>(stop2 - start2);
  cout << "Time seq: " << duration2.count() << " ms" << endl;
  cout << "Result: " << resultSeq << endl;

  return 0;
}
```

## Conceptos Teóricos

- **TBB (Threading Building Blocks)**: Librería de C++ desarrollada por Intel para programación paralela que proporciona algoritmos paralelos genéricos y estructuras de datos concurrentes.
- **Paralelismo basado en tareas**: TBB usa un modelo de programación basado en tareas en lugar de hilos explícitos, lo que permite mejor escalabilidad y balanceo de carga automático.
- **Pipeline**: Patrón de diseño donde los datos fluyen a través de una serie de etapas de procesamiento, permitiendo solapamiento entre fases.
- **`parallel_for`**: Algoritmo que divide automáticamente un rango de iteraciones en subrangos que se ejecutan en paralelo.
- **`blocked_range`**: Objeto que representa un rango de índices que puede ser dividido recursivamente para balancear la carga de trabajo.
- **`parallel_reduce`**: Algoritmo que combina operaciones map y reduce, aplicando una función a subrangos y luego combinando los resultados parciales.
- **Granularidad**: TBB decide automáticamente cómo dividir el trabajo para optimizar el uso de los núcleos disponibles.
- **Balanceo de carga dinámico**: TBB redistribuye tareas entre hilos durante la ejecución para maximizar la utilización de recursos.

## Tabla de Resumen

| Concepto | Descripción | Ejemplo en TBB |
|----------|-------------|----------------|
| **`parallel_for`** | Divide un bucle en subrangos ejecutados en paralelo | `tbb::parallel_for(range, lambda)` |
| **`blocked_range`** | Representa un rango divisible para procesamiento paralelo | `tbb::blocked_range<int>(0, N)` |
| **`parallel_reduce`** | Combina procesamiento paralelo con reducción de resultados | `tbb::parallel_reduce(range, init, lambda, combiner)` |
| **Modelo basado en tareas** | Abstracción superior a los hilos, con planificación automática | Gestión automática por TBB runtime |
| **Balanceo de carga** | Distribución dinámica del trabajo entre hilos disponibles | Automático en TBB |
| **Pipeline** | Procesamiento en etapas con solapamiento | No mostrado en este ejemplo, pero parte de TBB |
| **Reducción paralela** | Acumulación de resultados parciales con combinación final | Función combinadora en `parallel_reduce` |
| **Lambda functions** | Funciones anónimas para definir el trabajo paralelo | `[&](range, init) { ... }` |

## Comentarios Adicionales

1. **Ventajas de TBB sobre `std::thread`**:
   - Mayor nivel de abstracción
   - Balanceo de carga automático
   - Mejor escalabilidad
   - Menor código boilerplate
   - Optimizado para arquitecturas multi-núcleo

2. **Configuración del scheduler**: La línea comentada `tbb::task_scheduler_init init(4)` permite controlar el número máximo de hilos. Sin ella, TBB usa la detección automática del hardware.

3. **Patrón pipeline vs map-reduce**:
   - **Pipeline**: Ideal para flujos de datos donde diferentes etapas pueden ejecutarse concurrentemente
   - **Map-reduce**: Mejor para operaciones independientes sobre colecciones de datos

4. **Consideraciones de rendimiento**:
   - TBB introduce overhead por gestión de tareas
   - Para problemas pequeños, la versión secuencial puede ser más rápida
   - El tamaño óptimo de grano (grain size) afecta el rendimiento

5. **Aplicaciones típicas**:
   - Procesamiento de imágenes y video
   - Simulaciones numéricas
   - Análisis de datos
   - Procesamiento de señales

6. **Integración con otras librerías**: TBB puede combinarse con OpenMP, MPI y otras tecnologías paralelas para soluciones híbridas.

7. **Compatibilidad**: TBB es multiplataforma (Windows, Linux, macOS) y compatible con los principales compiladores de C++.