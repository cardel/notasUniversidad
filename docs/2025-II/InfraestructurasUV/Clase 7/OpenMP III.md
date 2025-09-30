Las directivas en OpenMP, permiten realizar diferentes tareas de paralelizacion.

## Directivas Principales de OpenMP

### 1. `parallel` - Región Paralela
```cpp
#pragma omp parallel
{
    // Este bloque se ejecuta por todos los hilos
    int thread_id = omp_get_thread_num();
    printf("Hilo %d ejecutando\n", thread_id);
}
```

### 2. `for` - Paralelización de Loops
```cpp
#pragma omp parallel for
for (int i = 0; i < n; i++) {
    // Cada iteración se asigna a un hilo diferente
    result[i] = data[i] * 2;
}
```

### 3. `reduction` - Operaciones de Reducción
```cpp
int sum = 0;
#pragma omp parallel for reduction(+:sum)
for (int i = 0; i < n; i++) {
    sum += array[i];  // Cada hilo tiene su copia, se combinan al final
}

// También funciona con: *, -, &, |, &&, ||, max, min
#pragma omp parallel for reduction(max:max_value)
for (int i = 0; i < n; i++) {
    if (array[i] > max_value) max_value = array[i];
}
```

### 4. `critical` - Sección Crítica
```cpp
int shared_counter = 0;
#pragma omp parallel for
for (int i = 0; i < n; i++) {
    // Solo un hilo puede ejecutar esta sección a la vez
    #pragma omp critical
    {
        shared_counter++;  // Acceso seguro a variable compartida
    }
}
```

### 5. `atomic` - Operaciones Atómicas
```cpp
int atomic_counter = 0;
#pragma omp parallel for
for (int i = 0; i < n; i++) {
    #pragma omp atomic
    atomic_counter++;  // Más eficiente que critical para operaciones simples
}
```

### 6. `sections` - Tareas Independientes
```cpp
#pragma omp parallel sections
{
    #pragma omp section
    {
        // Tarea 1 - ejecutada por un hilo
        process_task1();
    }
    
    #pragma omp section
    {
        // Tarea 2 - ejecutada por otro hilo
        process_task2();
    }
}
```

### 7. `single` y `master`
```cpp
#pragma omp parallel
{
    #pragma omp single  // Solo un hilo ejecuta (cualquiera)
    {
        initialize_shared_data();
    }
    
    #pragma omp master  // Solo el hilo maestro (id=0)
    {
        print_progress();
    }
    
    // Todos los hilos ejecutan esto
    process_data();
}
```

### 8. `barrier` - Sincronización
```cpp
#pragma omp parallel
{
    process_phase1();
    
    #pragma omp barrier  // Todos los hilos esperan aquí
    
    process_phase2();  // Solo comienza cuando todos terminaron phase1
}
```

### 9. `schedule` - Planificación de Iteraciones
```cpp
// Distribución estática de chunks
#pragma omp parallel for schedule(static, chunk_size)
for (int i = 0; i < n; i++) { ... }

// Distribución dinámica (load balancing)
#pragma omp parallel for schedule(dynamic, chunk_size)
for (int i = 0; i < n; i++) { ... }

// Distribución guiada
#pragma omp parallel for schedule(guided, chunk_size)
for (int i = 0; i < n; i++) { ... }
```

### 10. `nowait` - Eliminar Barrera Implícita
```cpp
#pragma omp parallel
{
    #pragma omp for nowait  // No esperar al final del loop
    for (int i = 0; i < n; i++) {
        independent_work(i);
    }
    
    // Los hilos continúan inmediatamente aquí
    additional_work();
}
```

### 11. `private`, `firstprivate`, `shared` - Cláusulas de Datos
```cpp
int global_var = 10;
int private_var = 20;

#pragma omp parallel private(private_var) firstprivate(global_var) shared(shared_var)
{
    // private: cada hilo tiene su copia (no inicializada)
    // firstprivate: cada hilo tiene copia inicializada
    // shared: todos los hilos comparten la misma variable
}
```

### Ejemplo Combinado:
```cpp
#include <omp.h>

int main() {
    const int n = 1000;
    double data[n], result[n];
    double max_val = 0.0;
    
    #pragma omp parallel for reduction(max:max_val) schedule(dynamic, 16)
    for (int i = 0; i < n; i++) {
        data[i] = some_computation(i);
        if (data[i] > max_val) max_val = data[i];
    }
    
    #pragma omp parallel
    {
        #pragma omp single
        printf("Máximo calculado: %f\n", max_val);
        
        #pragma omp for
        for (int i = 0; i < n; i++) {
            result[i] = data[i] / max_val;
        }
    }
    
    return 0;
}
```

Estas directivas permiten controlar la ejecución paralela, sincronización y manejo de datos compartidos de manera eficiente.

# Tipos de schedule

1. static: Divide las iteraciones en bloques de tamaño fijo
2. dynamic Asigna bloques dinamicamente (pueden ser de diferente tamaño)
3. guided Es como dinámico pero con bloques mas pequeños
4. auto Decisión automática del compilador
5. runtime El tipo se determina en tiempo de ejecución
## Ejemplos de Schedule en OpenMP

### 1. `schedule(static)`
```cpp
#include <omp.h>
#include <stdio.h>

int main() {
    const int n = 12;
    
    printf("schedule(static) - chunks iguales:\n");
    #pragma omp parallel for schedule(static) num_threads(3)
    for (int i = 0; i < n; i++) {
        printf("Hilo %d procesa iteración %d\n", omp_get_thread_num(), i);
    }
    
    printf("\nschedule(static, 2) - chunks de tamaño 2:\n");
    #pragma omp parallel for schedule(static, 2) num_threads(3)
    for (int i = 0; i < n; i++) {
        printf("Hilo %d procesa iteración %d\n", omp_get_thread_num(), i);
    }
    return 0;
}
```

**Salida esperada:**
```
schedule(static) - chunks iguales:
Hilo 0 procesa iteración 0
Hilo 0 procesa iteración 1
Hilo 0 procesa iteración 2
Hilo 0 procesa iteración 3
Hilo 1 procesa iteración 4
Hilo 1 procesa iteración 5
Hilo 1 procesa iteración 6
Hilo 1 procesa iteración 7
Hilo 2 procesa iteración 8
Hilo 2 procesa iteración 9
Hilo 2 procesa iteración 10
Hilo 2 procesa iteración 11

schedule(static, 2) - chunks de tamaño 2:
Hilo 0 procesa iteración 0
Hilo 0 procesa iteración 1
Hilo 1 procesa iteración 2
Hilo 1 procesa iteración 3
Hilo 2 procesa iteración 4
Hilo 2 procesa iteración 5
Hilo 0 procesa iteración 6
Hilo 0 procesa iteración 7
Hilo 1 procesa iteración 8
Hilo 1 procesa iteración 9
Hilo 2 procesa iteración 10
Hilo 2 procesa iteración 11
```

### 2. `schedule(dynamic)`
```cpp
#include <omp.h>
#include <stdio.h>
#include <unistd.h>

int main() {
    const int n = 12;
    
    printf("schedule(dynamic, 2) - carga variable:\n");
    #pragma omp parallel for schedule(dynamic, 2) num_threads(3)
    for (int i = 0; i < n; i++) {
        // Simula carga variable
        usleep((i % 3) * 100000);
        printf("Hilo %d procesa iteración %d\n", omp_get_thread_num(), i);
    }
    return 0;
}
```

**Salida típica (orden variable):**
```
schedule(dynamic, 2) - carga variable:
Hilo 0 procesa iteración 0
Hilo 1 procesa iteración 2
Hilo 2 procesa iteración 4
Hilo 0 procesa iteración 1
Hilo 1 procesa iteración 3
Hilo 2 procesa iteración 5
Hilo 0 procesa iteración 6
Hilo 1 procesa iteración 8
Hilo 2 procesa iteración 10
Hilo 0 procesa iteración 7
Hilo 1 procesa iteración 9
Hilo 2 procesa iteración 11
```

### 3. `schedule(guided)`
```cpp
#include <omp.h>
#include <stdio.h>

int main() {
    const int n = 20;
    
    printf("schedule(guided, 3) - bloques decrecientes:\n");
    #pragma omp parallel for schedule(guided, 3) num_threads(4)
    for (int i = 0; i < n; i++) {
        printf("Hilo %d procesa iteración %d\n", omp_get_thread_num(), i);
    }
    return 0;
}
```

**Salida típica:**
```
schedule(guided, 3) - bloques decrecientes:
Hilo 0 procesa iteración 0-4  (bloque grande inicial)
Hilo 1 procesa iteración 5-8  (bloque más pequeño)
Hilo 2 procesa iteración 9-11 (bloque más pequeño)
Hilo 3 procesa iteración 12-14
Hilo 0 procesa iteración 15-17
Hilo 1 procesa iteración 18-19
```

### 4. Comparación de Rendimiento
```cpp
#include <omp.h>
#include <stdio.h>
#include <chrono>

void test_schedule(const char* name, int schedule_type, int n) {
    auto start = std::chrono::high_resolution_clock::now();
    
    #pragma omp parallel for schedule(runtime)
    for (int i = 0; i < n; i++) {
        // Trabajo simulado
        volatile double x = i * 3.14159;
        for (int j = 0; j < 1000; j++) {
            x = x * 1.0001;
        }
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    double time = std::chrono::duration<double, std::milli>(end - start).count();
    printf("%s: %.2f ms\n", name, time);
}

int main() {
    const int n = 100000;
    omp_set_num_threads(4);
    
    // Configurar diferentes schedules
    omp_set_schedule(omp_sched_static, 1000);
    test_schedule("static,1000", omp_sched_static, n);
    
    omp_set_schedule(omp_sched_dynamic, 100);
    test_schedule("dynamic,100", omp_sched_dynamic, n);
    
    omp_set_schedule(omp_sched_guided, 50);
    test_schedule("guided,50", omp_sched_guided, n);
    
    return 0;
}
```

### 5. `schedule(auto)` y `schedule(runtime)`
```cpp
#include <omp.h>
#include <stdio.h>

int main() {
    const int n = 16;
    
    // auto - decisión del compilador
    printf("schedule(auto):\n");
    #pragma omp parallel for schedule(auto) num_threads(3)
    for (int i = 0; i < n; i++) {
        printf("Hilo %d procesa %d\n", omp_get_thread_num(), i);
    }
    
    // runtime - se define con variable de entorno OMP_SCHEDULE
    printf("\nschedule(runtime) - usar: export OMP_SCHEDULE=\"dynamic,2\"\n");
    #pragma omp parallel for schedule(runtime) num_threads(3)
    for (int i = 0; i < n; i++) {
        printf("Hilo %d procesa %d\n", omp_get_thread_num(), i);
    }
    
    return 0;
}
```

## Cuándo Usar Cada Schedule:

- **static**: Carga balanceada, overhead mínimo
- **dynamic**: Carga desbalanceada, buen load balancing
- **guided**: Compromiso entre overhead y balance
- **auto**: Cuando no se sabe cuál es mejor
- **runtime**: Para probar diferentes schedules sin recompilar

# Ejemplo

```c++
#include <cstdio>
#include <iostream>
#include <chrono>
#include <omp.h>

using namespace std;

void initialize(int ** arr, int n) {
  for (int i = 0; i < n; i++) {
    arr[i] = new int[n];
    for(int j = 0; j < n; j++) {
      arr[i][j] = i+j;
    }
  }
}

int main (int argc, char *argv[]) {
  const int n = 10000;
  int **arr = new int*[n];
  initialize(arr,n);
  
  auto start = std::chrono::high_resolution_clock::now();
  long sum = 0;
  

  #pragma omp parallel for reduction(+:sum) schedule(static)
  for (int i = 0; i < n; i++) {        // Loop externo: filas
    for(int j = 0; j < n; j++) {       // Loop interno: columnas
      sum += arr[i][j];                // Acceso: [i][0], [i][1], [i][2]...
    }
  }

  auto end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en static en ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());

  start = std::chrono::high_resolution_clock::now();
  // Schedule dynamic
  #pragma omp parallel for reduction(+:sum) schedule(dynamic)
  for (int i = 0; i < n; i++) {        // Filas
    for(int j = 0; j < n; j++) {       // Columnas
      sum += arr[i][j];
    }
  }
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en dynamic ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());

  start = std::chrono::high_resolution_clock::now();
  // Schedule guided
  #pragma omp parallel for reduction(+:sum) schedule(guided)
  for (int i = 0; i < n; i++) {        // Filas
    for(int j = 0; j < n; j++) {       // Columnas
      sum += arr[i][j];
    }
  }
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en guided ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());
  
  // Dynamic con chunk 2
  start = std::chrono::high_resolution_clock::now();
  #pragma omp parallel for reduction(+:sum) schedule(dynamic,2)
  for (int i = 0; i < n; i++) {        // Filas
    for(int j = 0; j < n; j++) {       // Columnas
      sum += arr[i][j];
    }
  }
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en dynamic con chunk 2 en ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());

  // Dynamic con chunk 10
  start = std::chrono::high_resolution_clock::now();
  #pragma omp parallel for reduction(+:sum) schedule(dynamic,10)
  for (int i = 0; i < n; i++) {        // Filas
    for(int j = 0; j < n; j++) {       // Columnas
      sum += arr[i][j];
    }
  }
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en dynamic con chunk 10 en ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());

  // Dynamic con chunk 100
  start = std::chrono::high_resolution_clock::now();
  #pragma omp parallel for reduction(+:sum) schedule(dynamic,100)
  for (int i = 0; i < n; i++) {        // Filas
    for(int j = 0; j < n; j++) {       // Columnas
      sum += arr[i][j];
    }
  }
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en dynamic con chunk 100 en ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());

  // Dynamic con chunk 1000
  start = std::chrono::high_resolution_clock::now();
  #pragma omp parallel for reduction(+:sum) schedule(dynamic,1000)
  for (int i = 0; i < n; i++) {        // Filas
    for(int j = 0; j < n; j++) {       // Columnas
      sum += arr[i][j];
    }
  }
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en dynamic con chunk 1000 en ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());
  
  return 0;
}
```

## Análisis de Resultados con Acceso por Filas

### Resultados Obtenidos:
1. **dynamic,2**: 49.83 ms ✅ **MEJOR**
2. **dynamic,10**: 53.00 ms
3. **static**: 57.05 ms
4. **guided**: 58.93 ms
5. **dynamic**: 62.57 ms
6. **dynamic,100**: 65.91 ms
7. **dynamic,1000**: 66.26 ms ❌ **PEOR**

## Explicación de los Resultados:

### 1. **¿Por qué dynamic con chunk pequeño es el mejor?**

**dynamic,2 (49.83 ms) vs static (57.05 ms):**
- **Mejor balance de carga**: Chunks pequeños permiten mejor distribución
- **Reducción de falsa compartición**: Menos probabilidad de que hilos compartan líneas de cache
- **Overhead aceptable**: El costo de scheduling se compensa con mejor balance

### 2. **¿Por qué chunks grandes son peores?**

**dynamic,1000 (66.26 ms) vs dynamic,2 (49.83 ms):**
- **Load balancing deficiente**: Algunos hilos terminan antes y quedan ociosos
- **Mayor falsa compartición**: Hilos trabajan en regiones de memoria cercanas
- **Menos oportunidades de paralelismo**: Pocos chunks para distribuir

### 3. **Comportamiento de Cada Schedule:**

**static (57.05 ms):**
- Distribución fija y predecible
- Overhead mínimo pero balance estático
- Bueno para carga uniforme

**guided (58.93 ms):**
- Bloques decrecientes (grandes al inicio, pequeños al final)
- Compromiso entre overhead y balance
- Ligeramente mejor que static para este caso

**dynamic sin chunk (62.57 ms):**
- Chunk por defecto = 1 (demasiado granular)
- Alto overhead de scheduling
- Demasiadas sincronizaciones

### 4. **Patrón de Acceso Óptimo + Scheduling Eficiente**

Con acceso por filas:
- Cada hilo procesa **filas completas contiguas**
- **Alta localidad espacial**: `arr[i][0], arr[i][1], arr[i][2]...`
- **Prefetching efectivo**: Hardware puede predecir accesos
- **Mínimos cache misses**

### 5. **Impacto del Tamaño de Chunk:**

| Chunk Size | Tiempo (ms) | Eficiencia |
|------------|-------------|------------|
| 2          | 49.83       | ✅ Óptimo   |
| 10         | 53.00       | ✅ Bueno    |
| 100        | 65.91       | ❌ Regular  |
| 1000       | 66.26       | ❌ Malo     |

**Tendencia**: Chunks más pequeños → mejor rendimiento (hasta cierto punto)

## Conclusión:

El **acceso por filas** combinado con **dynamic scheduling y chunk pequeño (2-10)** produce el mejor rendimiento porque:

1. **Elimina el cuello de botella de memoria** (acceso contiguo)
2. **Optimiza el balance de carga** (distribución granular)
3. **Minimiza la falsa compartición** (chunks pequeños separados)

**dynamic,2** es **17% más rápido** que **static** y **32% más rápido** que **dynamic,1000**, demostrando que el scheduling adecuado puede mejorar significativamente el rendimiento incluso con patrones de acceso óptimos.

# Runtime schedule

Sirve para probar diferentes schedules sin necesidad de reescribir el codigo

```c++
#include <cstdio>
#include <iostream>
#include <chrono>
#include <omp.h>

using namespace std;

void initialize(int ** arr, int n) {
  for (int i = 0; i < n; i++) {
    arr[i] = new int[n];
    for(int j = 0; j < n; j++) {
      arr[i][j] = i+j;
    }
  }
}

//Probar diferentes schedules
void sumar(int ** arr, int n, long &sum) {
  sum = 0;
  #pragma omp parallel for reduction(+:sum) schedule(runtime)
  for (int i = 0; i < n; i++) {        // Loop externo: filas
    for(int j = 0; j < n; j++) {       // Loop interno: columnas
      sum += arr[i][j];                // Acceso: [i][0], [i][1], [i][2]...
    }
  }
}

int main (int argc, char *argv[]) {
  const int n = 10000;
  int **arr = new int*[n];
  initialize(arr,n);
  
  auto start = std::chrono::high_resolution_clock::now();
  long sum = 0;
  
  omp_set_schedule(omp_sched_static,1);
  sumar(arr,n,sum);
  auto end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en static en ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());

  start = std::chrono::high_resolution_clock::now();
  // Schedule dynamic
  omp_set_schedule(omp_sched_dynamic, 1);
  sumar(arr,n,sum);
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en dynamic ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());

  start = std::chrono::high_resolution_clock::now();
  // Schedule guided
  omp_set_schedule(omp_sched_guided, 1);
  sumar(arr,n,sum);
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en guided ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());
  
  // Dynamic con chunk 2
  start = std::chrono::high_resolution_clock::now();
  end = std::chrono::high_resolution_clock::now();
  omp_set_schedule(omp_sched_dynamic, 2);
  sumar(arr,n,sum);
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en dynamic con chunk 2 en ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());

  // Dynamic con chunk 10
  start = std::chrono::high_resolution_clock::now();\
  omp_set_schedule(omp_sched_dynamic, 10);
  sumar(arr,n,sum);
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en dynamic con chunk 10 en ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());

  // Dynamic con chunk 100
  start = std::chrono::high_resolution_clock::now();
  omp_set_schedule(omp_sched_dynamic, 100);
  sumar(arr,n,sum);
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en dynamic con chunk 100 en ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());

  // Dynamic con chunk 1000
  start = std::chrono::high_resolution_clock::now();
  omp_set_schedule(omp_sched_dynamic, 1000);
  sumar(arr,n,sum);
  end = std::chrono::high_resolution_clock::now();
  printf("El tiempo en dynamic con chunk 1000 en ms es %f\n", std::chrono::duration<double, std::milli>(end - start).count());
  
  return 0;
}
```