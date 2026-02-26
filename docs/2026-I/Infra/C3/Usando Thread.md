# Usando Thread

Thread es una librería de C++ para ejecución paralela. Para utilizarla, vamos a usar el esquema **map → reduce**.

Tenemos una tarea de tamaño $n$, y la vamos a dividir en $k$ tareas de tamaño $\frac{n}{k}$.

```c++
#include <chrono>
#include <iostream>
#include <thread>
#include <vector>

using namespace std;
using namespace std::chrono;

const int VECTOR_SIZE = 1000000;
vector<long> v(VECTOR_SIZE);

// Función para llenar una sección del vector con un valor fijo
void fillVector(int start, int end) {
  for (int i = start; i < end; i++) {
    v[i] = 10;
  }
}

// Función para sumar los elementos de una sección del vector
void sumVector(int start, int end, long &result) {
  for (int i = start; i < end; i++) {
    result += v[i];
  }
}

int main() {
  // ========== PRUEBA CON 2 HILOS ==========
  auto start = high_resolution_clock::now();

  // Crear dos hilos para llenar el vector en paralelo
  thread t1(fillVector, 0, VECTOR_SIZE / 2);
  thread t2(fillVector, VECTOR_SIZE / 2, VECTOR_SIZE);

  // Esperar a que ambos hilos terminen (sincronización)
  t1.join();
  t2.join();

  // Variables para almacenar resultados parciales de la suma
  long result1 = 0, result2 = 0;
  // Crear dos hilos para sumar las mitades del vector en paralelo
  thread t3(sumVector, 0, VECTOR_SIZE / 2, ref(result1));
  thread t4(sumVector, VECTOR_SIZE / 2, VECTOR_SIZE, ref(result2));

  t3.join();
  t4.join();

  auto stop = high_resolution_clock::now();
  auto duration = duration_cast<milliseconds>(stop - start);
  cout << "Time 2 threads: " << duration.count() << " ms" << endl;

  // Resultado final: suma de las dos mitades
  cout << "Result: " << result1 + result2 << endl;

  // ========== PRUEBA SECUENCIAL (SIN HILOS) ==========
  auto start2 = high_resolution_clock::now();
  fillVector(0, VECTOR_SIZE);
  long result = 0;
  sumVector(0, VECTOR_SIZE, result);
  auto stop2 = high_resolution_clock::now();
  auto duration2 = duration_cast<milliseconds>(stop2 - start2);
  cout << "Time seq: " << duration2.count() << " ms" << endl;
  cout << "Result: " << result << endl;

  // ========== PRUEBA CON 4 HILOS ==========
  start = high_resolution_clock::now();

  // Dividir el trabajo de llenado en 4 hilos
  thread t5(fillVector, 0, VECTOR_SIZE / 4);
  thread t6(fillVector, VECTOR_SIZE / 4, VECTOR_SIZE / 2);
  thread t7(fillVector, VECTOR_SIZE / 2, VECTOR_SIZE * 3 / 4);
  thread t8(fillVector, VECTOR_SIZE * 3 / 4, VECTOR_SIZE);

  t5.join();
  t6.join();
  t7.join();
  t8.join();

  // Variables para resultados parciales de la suma con 4 hilos
  long result5 = 0, result6 = 0, result7 = 0, result8 = 0;
  thread t9(sumVector, 0, VECTOR_SIZE / 4, ref(result5));
  thread t10(sumVector, VECTOR_SIZE / 4, VECTOR_SIZE / 2, ref(result6));
  thread t11(sumVector, VECTOR_SIZE / 2, VECTOR_SIZE * 3 / 4, ref(result7));
  thread t12(sumVector, VECTOR_SIZE * 3 / 4, VECTOR_SIZE, ref(result8));
  t9.join();
  t10.join();
  t11.join();
  t12.join();

  stop = high_resolution_clock::now();
  duration = duration_cast<milliseconds>(stop - start);
  cout << "Time 4 threads: " << duration.count() << " ms" << endl;

  // Resultado final: suma de los cuatro cuartos
  cout << "Result: " << result5 + result6 + result7 + result8 << endl;

  return 0;
}
```

## Conceptos Teóricos

- **Thread (hilo)**: Unidad básica de ejecución dentro de un proceso. Permite realizar múltiples tareas concurrentemente dentro del mismo espacio de memoria.
- **Paralelismo**: Ejecución simultánea de múltiples tareas para reducir el tiempo total de procesamiento.
- **Map-Reduce**: Patrón de programación paralela donde:
  - **Map**: Divide una tarea grande en subtareas independientes que se ejecutan en paralelo.
  - **Reduce**: Combina los resultados de las subtareas para obtener el resultado final.
- **División de trabajo**: En este ejemplo, el vector de tamaño $n$ se divide en $k$ segmentos de tamaño $\frac{n}{k}$, asignando cada segmento a un hilo diferente.
- **Sincronización**: El método `join()` bloquea el hilo principal hasta que el hilo secundario termine su ejecución, asegurando que todos los resultados estén disponibles antes de continuar.
- **Referencias en hilos**: Se usa `ref()` para pasar variables por referencia a los hilos, permitiendo que modifiquen los resultados directamente.

## Tabla de Resumen

| Concepto | Descripción | Ejemplo en el código |
|----------|-------------|----------------------|
| **Thread** | Unidad de ejecución paralela dentro de un proceso | `thread t1(fillVector, ...)` |
| **Map** | Fase de división de la tarea en subtareas paralelizables | Dividir `fillVector` y `sumVector` en segmentos |
| **Reduce** | Fase de combinación de resultados parciales | Sumar `result1 + result2` para obtener el total |
| **División de trabajo** | Distribuir partes iguales del trabajo entre hilos | `VECTOR_SIZE / 2`, `VECTOR_SIZE / 4` |
| **Sincronización** | Coordinación para esperar que los hilos terminen | Uso de `join()` después de crear cada hilo |
| **Benchmarking** | Comparación de tiempos entre versiones paralela y secuencial | Medición con `high_resolution_clock` |
| **Paso por referencia** | Compartir variables entre hilos para acumular resultados | `ref(result1)` en la llamada a `sumVector` |

## Comentarios Adicionales

- **Overhead de hilos**: Crear muchos hilos puede introducir overhead debido a la gestión del sistema operativo. No siempre más hilos significa mejor rendimiento.
- **Condiciones de carrera**: En este ejemplo no hay condiciones de carrera porque cada hilo trabaja en segmentos distintos del vector. Si varios hilos accedieran a la misma variable sin sincronización, se necesitarían mecanismos como mutex.
- **Escalabilidad**: El enfoque map-reduce escala bien para problemas con alta granularidad y baja dependencia entre subtareas.
- **Aplicaciones prácticas**: Este patrón es útil en procesamiento de imágenes, análisis de datos, simulaciones y cualquier tarea que pueda dividirse en partes independientes.
- **Consideraciones de memoria**: Todos los hilos comparten el mismo espacio de memoria, por lo que deben coordinarse para evitar accesos conflictivos a recursos compartidos.