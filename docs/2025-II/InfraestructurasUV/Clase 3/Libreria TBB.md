# Explicación Detallada del Código con TBB (Threading Building Blocks)

## Configuración y Compilación de TBB

```bash
# Compilación con TBB
g++ -o programa programa.cpp -ltbb
```

**Requisitos previos:**
- Instalar TBB: `sudo apt-get install libtbb-dev` (Ubuntu/Debian)
- O descargar desde: https://github.com/oneapi-src/oneTBB

## Análisis del Código TBB

### Includes Específicos de TBB

```c++
#include <tbb/tbb.h>              // Biblioteca principal
#include <tbb/blocked_range.h>    // Para definir rangos de trabajo
#include <tbb/parallel_for.h>     // Para paralelización for
#include <tbb/parallel_reduce.h>  // Para reducción paralela
```

### Función Principal: `sumar_vector`

```c++
void sumar_vector(vector<int> &v, long & suma) {
    suma = tbb::parallel_reduce(
        // 1. Definir el rango de trabajo
        tbb::blocked_range<int>(0, SIZE),
        
        // 2. Valor inicial del acumulador
        0L,
        
        // 3. Función de MAP (operación por partición)
        [&](tbb::blocked_range<int> r, long init) -> long {
            for (int i = r.begin(); i < r.end(); i++) {
                init += v[i];
            }
            return init;
        },
        
        // 4. Función de REDUCE (combinación de resultados)
        [](long x, long y) -> long {
            return x + y;
        });
}
```

## Configuración y Gestión de TBB

### Control del Número de Hilos

TBB gestiona automáticamente el número de hilos, pero puedes configurarlo:

```c++
#include <tbb/task_scheduler_init.h>

// Configurar número máximo de hilos
tbb::task_scheduler_init init(4);  // Usar 4 hilos

// O usar todos los cores disponibles
tbb::task_scheduler_init init(tbb::task_scheduler_init::automatic);
```

### Estrategias de Paralelización en TBB

**1. `blocked_range`**: Divide el trabajo en bloques de tamaño óptimo
- `tbb::blocked_range<int>(inicio, fin)` - División automática
- `tbb::blocked_range<int>(inicio, fin, granularidad)` - Con tamaño de grano específico

**2. `parallel_reduce` vs `parallel_for`**:
- `parallel_for`: Solo ejecuta en paralelo, sin combinar resultados
- `parallel_reduce`: Ejecuta y combina resultados automáticamente

**3. Función Lambda con Captura**:
```c++
[&](tbb::blocked_range<int> r, long init) -> long {
    // [&] captura todas las variables por referencia
    // r contiene el subrango asignado a este hilo
    // init es el acumulador inicial para este subrango
}
```

## Ventajas de TBB sobre Threads Nativos

1. **Gestión Automática**: No necesitas crear/join hilos manualmente
2. **Balance de Carga**: TBB distribuye el trabajo dinámicamente
3. **Escalabilidad**: Se adapta al número de cores disponibles
4. **Menos Boilerplate**: Código más limpio y mantenible

## Configuración Avanzada de TBB

### Control de Granularidad

```c++
// Controlar el tamaño mínimo de los bloques
tbb::blocked_range<int> rango(0, SIZE, 1000); // Mínimo 1000 elementos por bloque
```

### Estrategias de Planificación

```c++
#include <tbb/task_scheduler_observer.h>

// Personalizar cómo TBB asigna tareas a los hilos
class MyObserver : public tbb::task_scheduler_observer {
public:
    MyObserver() { observe(true); }
    void on_scheduler_entry(bool) override {
        // Configuraciones específicas por hilo
    }
};
```

### Optimización del Rendimiento

```c++
// Para mejor performance con tipos primitivos
suma = tbb::parallel_reduce(
    tbb::blocked_range<int>(0, SIZE),
    0L,
    [&](tbb::blocked_range<int> r, long init) {
        // Usar variables locales para acumulación
        long local_sum = init;
        for (int i = r.begin(); i < r.end(); i++) {
            local_sum += v[i];
        }
        return local_sum;
    },
    std::plus<long>()  // Functor predefinido para suma
);
```

## Consideraciones de Performance

1. **Overhead**: TBB tiene overhead inicial, pero es negligible para trabajos grandes
2. **Cache Friendly**: Los blocked_range son optimizados para locality de cache
3. **Auto-tuning**: TBB ajusta automáticamente la estrategia basado en la carga de trabajo

El código proporcionado muestra perfectamente cómo TBB simplifica la paralelización mientras mantiene un control fino sobre la estrategia de ejecución.