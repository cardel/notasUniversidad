# Ejercicio TBB

La multiplicación escalar (producto de Hadamard) entre dos vectores **u** y **v** está definida así:

Para cada $i \in [0, n)$, $w[i] = u[i] \times v[i]$

Utilizando **TBB (Threading Building Blocks)** como librería, realice:

- Llenado de **u** y **v** con un valor constante pequeño (menor que 10)
- Calcular la multiplicación entre los dos vectores de forma paralelizada
- Calcular la suma del vector resultante
- Imprimir el resultado
- Imprimir el tiempo de ejecución

El classroom sólo valida que el programa compile; el docente revisará manualmente la implementación de cada estudiante.

```c++
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

// Declaración de los tres vectores: u, v (operandos) y w (resultado)
vector<long> v(VECTOR_SIZE);
vector<long> u(VECTOR_SIZE);
vector<long> w(VECTOR_SIZE);

// Función para llenar los vectores en paralelo usando TBB
void fillVector() {
  tbb::parallel_for(tbb::blocked_range<int>(0, VECTOR_SIZE),
                    [&](tbb::blocked_range<int> r) {
                      // Cada hilo procesa un subrango del rango total
                      for (int i = r.begin(); i < r.end(); i++) {
                        v[i] = 10L;  // Valor constante para v
                        u[i] = 20L;  // Valor constante para u
                        w[i] = 0L;   // Inicializar vector resultado
                      }
                    });
}

// Versión secuencial para comparación de rendimiento
void fillVectorSeq() {
  for (int i = 0; i < VECTOR_SIZE; i++) {
    v[i] = 10;
    u[i] = 20;
    w[i] = 0;
  }
}

// Función para calcular la multiplicación elemento a elemento en paralelo
void multiplyVectors() {
  tbb::parallel_for(tbb::blocked_range<int>(0, VECTOR_SIZE),
                    [&](tbb::blocked_range<int> r) {
                      for (int i = r.begin(); i < r.end(); i++) {
                        w[i] = v[i] * u[i];  // Producto Hadamard
                      }
                    });
}

// Versión secuencial de la multiplicación
void multiplyVectorsSeq() {
  for (int i = 0; i < VECTOR_SIZE; i++) {
    w[i] = v[i] * u[i];
  }
}

// Función para sumar elementos del vector w usando reducción paralela
void sumVector(long &result) {
  result = tbb::parallel_reduce(
      // Rango completo a procesar
      tbb::blocked_range<int>(0, VECTOR_SIZE), 
      // Valor inicial de la reducción
      0,
      // Función lambda: suma parcial en cada subrango
      [&](tbb::blocked_range<int> r, long init) -> long {
        for (int i = r.begin(); i < r.end(); i++) {
          init += w[i];  // Acumular elementos de w
        }
        return init;
      },
      // Función combinadora: suma resultados parciales
      [](long x, long y) -> long { return x + y; });
}

// Versión secuencial de la suma
long sumVectorSeq() {
  long result = 0;
  for (int i = 0; i < VECTOR_SIZE; i++) {
    result += w[i];  
  }
  return result;
}

int main() {
  // ========== VERSIÓN PARALELA CON TBB ==========
  auto start = high_resolution_clock::now();

  fillVector();        // Llenado paralelo de vectores
  multiplyVectors();   // Multiplicación paralela
  
  long result = 0;
  sumVector(result);   // Suma paralela con reducción

  auto stop = high_resolution_clock::now();
  auto duration = duration_cast<milliseconds>(stop - start);
  cout << "Time TBB: " << duration.count() << " ms" << endl;
  cout << "Result: " << result << endl;

  // ========== VERSIÓN SECUENCIAL (PARA COMPARACIÓN) ==========
  auto start2 = high_resolution_clock::now();
  fillVectorSeq();
  multiplyVectorsSeq();
  long resultSeq = sumVectorSeq();  // Nota: función con error

  auto stop2 = high_resolution_clock::now();
  auto duration2 = duration_cast<milliseconds>(stop2 - start2);
  cout << "Time seq: " << duration2.count() << " ms" << endl;
  cout << "Result: " << resultSeq << endl;

  return 0;
}
```

## Conceptos Teóricos

- **Producto de Hadamard**: Multiplicación elemento a elemento entre dos vectores del mismo tamaño, a diferencia del producto punto que produce un escalar.
- **TBB (Threading Building Blocks)**: Librería de paralelismo de Intel que proporciona algoritmos paralelos genéricos y estructuras de datos thread-safe.
- **Paralelismo de datos**: Patrón donde la misma operación se aplica a múltiples elementos de datos simultáneamente, ideal para operaciones vectoriales.
- **`parallel_for`**: Algoritmo de TBB que automáticamente divide un rango de iteraciones y distribuye los subrangos entre los hilos disponibles.
- **`parallel_reduce`**: Combina la fase de mapeo (procesamiento de elementos) con la fase de reducción (combinación de resultados parciales).
- **Granularidad**: Tamaño de los bloques de trabajo. TBB ajusta automáticamente la granularidad para optimizar el balance entre overhead y paralelismo.
- **Reducción paralela**: Proceso donde múltiples hilos calculan sumas parciales que luego se combinan para obtener el resultado total.

## Tabla de Resumen

| Concepto | Descripción | Implementación en el código |
|----------|-------------|-----------------------------|
| **Producto Hadamard** | $w[i] = u[i] \times v[i]$ | `w[i] = v[i] * u[i]` en `multiplyVectors()` |
| **`parallel_for`** | Paralelización de bucles sobre rangos | Usado en `fillVector()` y `multiplyVectors()` |
| **`parallel_reduce`** | Reducción paralela con combinación | Usado en `sumVector()` para sumar elementos de w |
| **Lambda functions** | Funciones anónimas para definir trabajo paralelo | `[&](range, init) { ... }` en todos los algoritmos |
| **Benchmarking** | Comparación de tiempos entre versiones | `high_resolution_clock` y `duration_cast` |
| **Inicialización paralela** | Llenado concurrente de múltiples vectores | `fillVector()` inicializa u, v y w simultáneamente |
| **Configuración de hilos** | Control del número de hilos de TBB | Línea comentada `tbb::task_scheduler_init init(4)` |
| **Error de consistencia** | Inconsistencia entre versiones paralela y secuencial | `sumVectorSeq()` suma v en lugar de w |

## Comentarios Adicionales


2. **Valores constantes**: Los valores usados (10 y 20) no cumplen completamente con "valor constante pequeño (menor que 10)" especificado en el enunciado, aunque 10 es el límite superior.

3. **Ventajas de TBB en este ejercicio**:
   - Código más limpio y declarativo que con `std::thread`
   - Balanceo de carga automático
   - Menor overhead de sincronización
   - Escalabilidad automática con el número de núcleos

4. **Posibles mejoras**:
   - Usar `tbb::parallel_invoke` para ejecutar `fillVector()` y `multiplyVectors()` concurrentemente si no hay dependencias
   - Implementar una versión que use `tbb::flow` para un pipeline explícito
   - Añadir verificación de resultados para asegurar que las versiones paralela y secuencial producen el mismo resultado

5. **Consideraciones de rendimiento**:
   - Para vectores pequeños, el overhead de TBB puede superar las ganancias de paralelismo
   - La localidad de caché puede verse afectada por la división del trabajo
   - La versión secuencial podría optimizarse mejor por el compilador

6. **Aplicaciones reales**: Este patrón se usa en procesamiento de señales, gráficos por computadora, machine learning (operaciones elemento a elemento en tensores) y simulaciones científicas.

7. **Extensión del ejercicio**: Para un ejercicio más completo, se podría:
   - Medir speedup y eficiencia
   - Probar con diferentes tamaños de vector
   - Comparar con implementaciones usando OpenMP
   - Analizar el efecto del número de hilos en el rendimiento