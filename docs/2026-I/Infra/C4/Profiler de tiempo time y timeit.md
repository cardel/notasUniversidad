# Profiler de tiempo: time y timeit

Cuando se miden tiempos de ejecución se deben tener en cuenta dos conceptos fundamentales:

1. **Tiempo de CPU**: Es el tiempo que tardan las operaciones (instrucciones) sin incluir tiempos de espera por hilos o por operaciones de I/O (Entrada/Salida). Representa el tiempo efectivo de procesamiento.
2. **Tiempo de proceso**: Es el tiempo total que tarda el proceso en terminar, incluyendo todas las esperas del sistema.

## Módulo `time`

Esta librería permite medir el tiempo en formato UNIX o timestamp (donde el tiempo 0 corresponde al 01 de Enero de 1970 a las 00:00:00 en GMT).

La principal limitación de `time` es que solo toma una medida individual, la cual puede estar afectada por factores externos como otros procesos del sistema, fluctuaciones en la carga del CPU, o operaciones de I/O.

### Ejemplos prácticos

1. **Optimización con NumPy**: Al usar numpy, es crucial utilizar funciones optimizadas de la librería. Por ejemplo, llenar una matriz con `M[i,j]=5` versus `M.fill(5)` puede mostrar diferencias de más de 150x en tiempo de ejecución.
2. **Procesos concurrentes**: En procesos con múltiples hilos, el tiempo de CPU representa el tiempo efectivo de ejecución de instrucciones, mientras que el tiempo de proceso incluye las esperas necesarias en operaciones bloqueantes.

```python
import time

# Medir tiempo con alta precisión (incluye tiempo de suspensión)
tiempo_inicio = time.perf_counter()
# ... código a medir ...
tiempo_fin = time.perf_counter()
tiempo_total = tiempo_fin - tiempo_inicio

# Tiempo de CPU del proceso actual (excluye tiempo de suspensión)
tiempo_cpu_inicio = time.process_time()
# ... código a medir ...
tiempo_cpu_fin = time.process_time()
tiempo_cpu_total = tiempo_cpu_fin - tiempo_cpu_inicio

# Obtener tiempo UNIX (timestamp actual)
timestamp_actual = time.time()
print(f"Timestamp UNIX: {timestamp_actual}")
```

## Módulo `timeit`

Permite medir tiempos de ejecución con múltiples repeticiones, lo que lo hace mucho más confiable que `time` para benchmarking. Al promediar múltiples ejecuciones, se reduce el ruido introducido por procesos de Python o del sistema operativo. Sin embargo, introduce un overhead significativo debido a la repetición y al entorno controlado de ejecución.

```python
import timeit

# Definir una función para medir
def full_matrix(arr):
    return [[5 for _ in range(arr)] for _ in range(arr)]

# Configurar el entorno de medición
t1 = timeit.timeit(
    "full_matrix(10)",           # Código a ejecutar (como string)
    globals=globals(),           # Contexto de ejecución (variables globales)
    number=100                   # Número de repeticiones
)

# El resultado es el tiempo total de todas las ejecuciones
tiempo_promedio = t1 / 100       # Calcular tiempo promedio por ejecución
print(f"Tiempo promedio: {tiempo_promedio:.6f} segundos")
```

**Nota importante**: `timeit.timeit()` retorna el tiempo total de todas las ejecuciones, por lo que debemos dividirlo entre el número de repeticiones para obtener el tiempo promedio por ejecución.

## Conceptos teóricos adicionales

**Benchmarking vs Profiling**:
- **Benchmarking**: Medición del rendimiento de código específico (lo que hacen `time` y `timeit`)
- **Profiling**: Análisis detallado de dónde se gasta el tiempo en un programa completo (usando herramientas como `cProfile`)

**Overhead de medición**: Toda medición de tiempo introduce cierto overhead. `timeit` minimiza este efecto mediante:
- Deshabilitar el recolector de basura temporalmente
- Ejecutar en un entorno aislado
- Usar la mejor función de tiempo disponible en el sistema

**Precisión temporal**: Diferentes sistemas operativos ofrecen diferentes precisiones:
- `time.perf_counter()`: Mayor precisión, tiempo absoluto
- `time.process_time()`: Solo tiempo de CPU del proceso
- `time.monotonic()`: Tiempo que nunca retrocede (útil para intervalos)

## Tabla de resumen

| Concepto | Descripción | Función Python | Uso recomendado |
|----------|-------------|----------------|-----------------|
| **Tiempo de CPU** | Tiempo efectivo de procesamiento, excluye I/O y esperas | `time.process_time()` | Medir eficiencia algorítmica |
| **Tiempo de proceso** | Tiempo total incluyendo esperas del sistema | `time.perf_counter()` | Medir experiencia de usuario |
| **Timestamp UNIX** | Segundos desde 01/01/1970 00:00:00 GMT | `time.time()` | Fechas absolutas, logging |
| **Benchmarking simple** | Una sola medición rápida | `time.perf_counter()` | Mediciones rápidas y sucias |
| **Benchmarking preciso** | Múltiples mediciones promediadas | `timeit.timeit()` | Comparaciones de rendimiento |
| **Overhead** | Tiempo adicional por la medición | N/A | Menor en `time`, mayor en `timeit` |
| **Precisión** | Exactitud de la medición | Variable por sistema | `perf_counter` > `process_time` |

## Comentarios adicionales

1. **Elección de herramienta**: Use `time` para mediciones rápidas durante el desarrollo y `timeit` para benchmarks formales que se incluirán en documentación o pruebas de rendimiento.

2. **Factores de confusión**: El rendimiento puede variar debido a:
   - Estado de la caché del CPU
   - Actividad de otros procesos
   - Frecuencia dinámica del CPU
   - Calentamiento del código (JIT compilation en algunos entornos)

3. **Mejores prácticas para `timeit`**:
   ```python
   # Usar setup para inicialización costosa
   tiempo = timeit.timeit(
       stmt="operacion(datos)",
       setup="datos = generar_datos(1000)",
       globals=globals(),
       number=1000
   )
   ```

4. **Alternativas avanzadas**: Para profiling completo, considere:
   - `cProfile` para análisis detallado
   - `py-spy` para profiling sin overhead
   - `line_profiler` para análisis línea por línea

5. **En entornos de producción**: Evite `timeit` por su overhead; use `time.perf_counter()` con mediciones estadísticas (múltiples ejecuciones y cálculo de desviación estándar).

6. **Consideraciones de sistema**: En sistemas con múltiples núcleos, `process_time()` puede sumar tiempos de todos los núcleos usados, mientras que `perf_counter()` mide tiempo de reloj de pared.