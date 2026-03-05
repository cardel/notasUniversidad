# Perfilado determinístico

En Python contamos con la librería `cProfile` que nos permite obtener estadísticas detalladas de los llamados a funciones durante la ejecución de un programa. Esta herramienta nos permite saber cuántas veces se llama cada función, cuánto tiempo consume cada una, y cómo se relacionan entre sí.

## Ejemplo: Fibonacci recursivo sin optimización

```python
from cProfile import Profile
from pstats import SortKey, Stats

def fib(n):
    """
    Implementación recursiva naive de Fibonacci.
    Tiene complejidad exponencial O(2^n) debido a llamadas redundantes.
    """
    if n <= 1:
        return n
    else:
        return fib(n - 1) + fib(n - 2)

# Crear un perfilador y ejecutar el código bajo su supervisión
with Profile() as profiler:
    print(fib(35))  # Ejecutar Fibonacci para n=35
    
    # Generar estadísticas ordenadas por tiempo acumulativo
    stats = Stats(profiler)
    stats.sort_stats(SortKey.CUMULATIVE)  # Ordenar por tiempo total (incluyendo subllamadas)
    stats.print_stats()  # Imprimir el reporte
```

Lo que nos da como resultado:

```bash
  29860712 function calls (10 primitive calls) in 4.957 seconds
```

En este caso tenemos aproximadamente 29 millones de llamadas a función, lo que demuestra la ineficiencia del enfoque recursivo naive para Fibonacci.

## Ejemplo optimizado: Fibonacci con memoización usando LRU Cache

```python
from cProfile import Profile
from pstats import SortKey, Stats
from functools import lru_cache

@lru_cache(maxsize=None)  # Decorador que implementa memoización automática
def fib(n):
    """
    Implementación de Fibonacci con memoización.
    Almacena resultados previos para evitar recomputación.
    Reduce la complejidad a O(n).
    """
    if n <= 1:
        return n
    else:
        return fib(n - 1) + fib(n - 2)

with Profile() as profiler:
    print(fib(35))  # Mismo valor que antes
    
    stats = Stats(profiler)
    stats.sort_stats(SortKey.CUMULATIVE)
    stats.print_stats()
```

Al hacer el profiling con memoización tenemos:

```bash
         45 function calls (10 primitive calls) in 0.000 seconds
```

En este caso solo tenemos 45 llamadas a función, una reducción drástica de más de 660,000 veces menos llamadas.

## Conceptos teóricos

**Perfilado determinístico vs. estadístico**:
- **Perfilado determinístico** (`cProfile`): Registra cada llamada a función, proporcionando información exacta pero con mayor overhead.
- **Perfilado estadístico** (`profile` o herramientas externas): Muestrea el estado del programa a intervalos regulares, con menor overhead pero menos precisión.

**Memoización**: Técnica de optimización que almacena los resultados de llamadas a funciones costosas y retorna el resultado almacenado cuando se llama nuevamente con los mismos parámetros. `@lru_cache` implementa memoización con política LRU (Least Recently Used).

**Overhead de cProfile**: `cProfile` introduce un overhead del 30% al 45% en el tiempo de ejecución, lo que significa que los tiempos reportados son aproximadamente 1.3-1.45 veces más lentos que la ejecución normal.

**Llamadas primitivas vs. no primitivas**:
- **Llamadas primitivas**: Número de llamadas únicas a funciones diferentes.
- **Llamadas totales**: Incluye todas las invocaciones recursivas y repetidas.

## Tabla de resumen

| Concepto | Descripción | Ejemplo | Impacto en rendimiento |
|----------|-------------|---------|------------------------|
| **cProfile** | Perfilador determinístico de Python | `with Profile() as profiler:` | Overhead 30-45% |
| **Memoización** | Almacenar resultados para evitar recomputación | `@lru_cache(maxsize=None)` | Reduce O(2^n) a O(n) |
| **LRU Cache** | Implementación de memoización con política LRU | `from functools import lru_cache` | Memoria adicional por velocidad |
| **Tiempo acumulativo** | Tiempo total incluyendo subllamadas | `SortKey.CUMULATIVE` | Útil para identificar cuellos de botella |
| **Llamadas primitivas** | Número de funciones diferentes llamadas | "10 primitive calls" | Indica diversidad de funciones |
| **Llamadas totales** | Todas las invocaciones incluyendo recursivas | "29860712 function calls" | Mide carga computacional |
| **Fibonacci naive** | Implementación recursiva sin optimización | `fib(n-1) + fib(n-2)` | O(2^n), exponencial |
| **Fibonacci memoizado** | Con almacenamiento de resultados | `@lru_cache` decorator | O(n), lineal |

## Comentarios adicionales

1. **Cuándo usar cProfile**: Ideal para análisis detallado durante desarrollo, especialmente para identificar funciones específicas que consumen mucho tiempo. No recomendado para producción debido al overhead.

2. **Interpretación de resultados**: 
   - **ncalls**: Número de llamadas totales
   - **tottime**: Tiempo total en la función (excluyendo subllamadas)
   - **percall**: Tottime dividido por ncalls
   - **cumtime**: Tiempo acumulado (incluyendo subllamadas)
   - **filename:lineno**: Ubicación del código

3. **Alternativas a cProfile**:
   - `profile`: Versión pura de Python (más lenta, mayor overhead)
   - `py-spy`: Perfilador estadístico sin overhead (requiere instalación)
   - `line_profiler`: Análisis línea por línea
   - `memory_profiler`: Análisis de uso de memoria

4. **Mejores prácticas**:
   - Perfilar siempre con datos representativos
   - Comparar antes y después de optimizaciones
   - Enfocarse en funciones con mayor `cumtime`
   - Considerar el contexto de ejecución (carga del sistema, etc.)

5. **Limitaciones de cProfile**:
   - No mide consumo de memoria
   - Overhead significativo
   - No funciona bien con código multihilo
   - Puede alterar el comportamiento de programas con tiempo real

6. **Optimización basada en profiling**:
   - Identificar funciones más llamadas (alto `ncalls`)
   - Optimizar bucles internos (alto `tottime` con bajo `ncalls`)
   - Considerar memoización para funciones puras
   - Evaluar algoritmos alternativos para problemas con complejidad alta