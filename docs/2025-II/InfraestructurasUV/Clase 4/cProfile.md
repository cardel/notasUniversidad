# cProfile

cProfile es un profiler nativo de Python que permite analizar la ejecución de programas, proporcionando información detallada sobre:

- Número de llamadas a cada función
- Tiempos de ejecución (total y por llamada)
- Estadísticas de uso de memoria (en algunas implementaciones)
- Jerarquía de llamadas entre funciones

## Ejemplo de uso

```python
from cProfile import Profile
from pstats import SortKey, Stats
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n):
    """Implementación de Fibonacci con memoización usando lru_cache"""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def fibonacci_recursive(n):
    """Implementación recursiva simple de Fibonacci (sin optimización)"""
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)

if __name__ == "__main__":
   n = 35
   
   print("Sin memoization:")
   with Profile() as profiler:
       print(fibonacci_recursive(n))
       (
           Stats(profiler)
           .sort_stats(SortKey.CUMULATIVE)
           .print_stats()
       )
   
   print("Con memoization:")
   with Profile() as profiler:
         print(fibonacci(n))
         (
              Stats(profiler)
              .sort_stats(SortKey.CUMULATIVE)
              .print_stats()
         )
```

```bash
Sin memoization:
9227465
         29860713 function calls (10 primitive calls) in 12.023 seconds

   Ordered by: cumulative time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
29860703/1   12.023    0.000   12.023   12.023 /home/cardel/repositorios/infra/clase4/ejemplo3.py:11(fibonacci_recursive)
        1    0.000    0.000    0.000    0.000 /usr/lib/python3.13/pstats.py:108(__init__)
        1    0.000    0.000    0.000    0.000 /usr/lib/python3.13/pstats.py:118(init)
        1    0.000    0.000    0.000    0.000 /usr/lib/python3.13/pstats.py:137(load_stats)
        1    0.000    0.000    0.000    0.000 /usr/lib/python3.13/cProfile.py:54(create_stats)
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}
        1    0.000    0.000    0.000    0.000 {built-in method builtins.print}
        1    0.000    0.000    0.000    0.000 {built-in method builtins.isinstance}
        1    0.000    0.000    0.000    0.000 {built-in method builtins.hasattr}
        1    0.000    0.000    0.000    0.000 {built-in method builtins.len}


Con memoization:
9227465
         45 function calls (10 primitive calls) in 0.000 seconds

   Ordered by: cumulative time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
     36/1    0.000    0.000    0.000    0.000 /home/cardel/repositorios/infra/clase4/ejemplo3.py:5(fibonacci)
        1    0.000    0.000    0.000    0.000 /usr/lib/python3.13/pstats.py:108(__init__)
        1    0.000    0.000    0.000    0.000 /usr/lib/python3.13/pstats.py:118(init)
        1    0.000    0.000    0.000    0.000 /usr/lib/python3.13/pstats.py:137(load_stats)
        1    0.000    0.000    0.000    0.000 /usr/lib/python3.13/cProfile.py:54(create_stats)
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}
        1    0.000    0.000    0.000    0.000 {built-in method builtins.print}
        1    0.000    0.000    0.000    0.000 {built-in method builtins.hasattr}
        1    0.000    0.000    0.000    0.000 {built-in method builtins.isinstance}
        1    0.000    1.000    0.000    0.000 {built-in method builtins.len}



```


## Sin memoización (implementación recursiva simple)

**Resultado:** 9,227,465 (Fibonacci de 35)
```
29860713 function calls (10 primitive calls) in 12.023 seconds
```

### Estadísticas críticas:
- **29,860,703 llamadas** a `fibonacci_recursive`
- **12.023 segundos** de tiempo total de ejecución
- **Complejidad exponencial**: $O(2^n) \approx 2^{35}$ = 34,359,738,368 operaciones (teórico)
- **29.8 millones de llamadas reales** (el profiler captura menos debido a casos base)

### Interpretación:
- Cada llamada a Fibonacci(n) genera 2 llamadas recursivas
- Cálculos redundantes masivos: Fibonacci(3) se calcula millones de veces
- Tiempo de ejecución prohibitivo para valores mayores
- Demuestra por qué la recursión simple es inviable para Fibonacci

## Con memoización (usando lru_cache)

**Resultado:** 9,227,465 (mismo resultado correcto)
```
45 function calls (10 primitive calls) in 0.000 seconds
```

### Estadísticas críticas:
- **Solo 36 llamadas** a `fibonacci` (35 valores + caso base)
- **Tiempo insignificante**: < 0.001 segundos
- **Complejidad lineal**: O(n) - solo se calcula cada valor una vez
- **45 llamadas totales** (incluyendo overhead del sistema)

### Interpretación:
- `@lru_cache` almacena resultados previamente calculados
- Evita recomputación redundante completamente
- Reduce las llamadas de **29.8 millones** a **solo 36**
- Reduce el tiempo de **12 segundos** a **milisegundos**

## Comparativa directa

| Métrica | Sin memoización | Con memoización | Mejora |
|---------|-----------------|-----------------|--------|
| Llamadas a Fibonacci | 29,860,703 | 36 | 829,464x |
| Tiempo total | 12.023 segundos | < 0.001 segundos | > 12,000x |
| Complejidad | O(2^n) exponencial | O(n) lineal | Exponencial → Lineal |
| Escalabilidad | Inviable para n > 40 | Factible para n > 1000 | Múltiples órdenes de magnitud |

## Conclusión

La memoización transforma un algoritmo exponencialmente costoso en uno linealmente eficiente:
- **Mismo resultado**: Ambas implementaciones calculan correctamente Fibonacci(35)
- **Diferencia radical** en rendimiento: de segundos a microsegundos
- **Impacto práctico**: Hace viable el cálculo de valores grandes de Fibonacci
- **Demostración poderosa** del valor de la optimización algorítmica

Esta comparación ilustra por qué las técnicas de optimización como memoización y programación dinámica son esenciales en desarrollo de software.

## Características principales

### 1. Estadísticas del Profiler
El objeto `Profile` captura:
- **ncalls**: Número total de llamadas a cada función
- **tottime**: Tiempo total gastado en la función (excluyendo sub-llamadas)
- **cumtime**: Tiempo acumulado (incluyendo sub-llamadas)
- **percall**: Tiempo por llamada (tottime/ncalls o cumtime/ncalls)

### 2. Memoización con lru_cache
`@lru_cache(maxsize=None)` es un decorador que:
- Almacena resultados de llamadas anteriores
- Evita recomputación redundante en funciones recursivas
- Reduce la complejidad temporal de O(2^n) a O(n) para Fibonacci

### 3. Decoradores en Python
Las anotaciones (`@decorator`) son azúcar sintáctico que:
- Reciben una función como parámetro
- Retornan una función modificada o envuelta
- Permiten agregar funcionalidad sin cambiar el código original

## Resultados esperados

**Sin memoización:**
- Alto número de llamadas recursivas (~O(2^n))
- Tiempo de ejecución significativo
- Múltiples llamadas redundantes

**Con memoización:**
- Número lineal de llamadas (O(n))
- Tiempo de ejecución drásticamente reducido
- Reutilización de resultados previamente calculados

## Uso desde línea de comandos

```bash
# Ejecutar programa con cProfile
python -m cProfile mi_programa.py

# Ordenar por tiempo acumulado
python -m cProfile -s cumulative mi_programa.py

# Guardar resultados en archivo
python -m cProfile -o resultados.prof mi_programa.py

# Analizar archivo guardado
python -m pstats resultados.prof
```

## Limitaciones y consideraciones

- **Overhead**: cProfile introduce overhead significativo (~10-30%)
- **No mide memoria**: Solo tiempos de ejecución (usar `memory_profiler` para memoria)
- **Granularidad**: No proporciona información a nivel de línea
- **Alternativas**: Para profiling más detallado, considerar `line_profiler` o `pyinstrument`

cProfile es ideal para identificar cuellos de botella a nivel de función y optimizar el flujo de ejecución del programa.