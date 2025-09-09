# Perfiladores time y timeit

Son perfiladores incluidos en la biblioteca estándar de Python que permiten medir el tiempo de ejecución de operaciones. Se basan en tomar un tiempo inicial antes de las operaciones y un tiempo final después, permitiendo estudiar la complejidad computacional mediante la diferencia temporal.

## time

```python
import numpy as np
import time

def full_matrix(matrix):
    """Llena una matriz iterando por cada elemento (implementación lenta)"""
    rows, cols = matrix.shape
    for i in range(rows):
        for j in range(cols):
            matrix[i, j] = 5

def full_matriz_optimized(matrix):
    """Llena una matriz usando el método fill() de numpy (implementación optimizada)"""
    matrix.fill(5)

if __name__ == "__main__":
    # Crear matriz de 10000x10000
    arr = np.zeros((10000, 10000), dtype=int)
    
    # Medir tiempo de la implementación lenta
    start_time = time.time()
    full_matrix(arr)
    end_time = time.time()
    print(f"Tiempo de ejecución: {end_time - start_time} segundos")
    print(arr[0:3,0:5])

    # Crear segunda matriz para la implementación optimizada
    arr2 = np.zeros((10000, 10000), dtype=int)
    
    # Medir tiempo de la implementación optimizada
    start_time = time.time()
    full_matriz_optimized(arr2)
    end_time = time.time()
    print(f"Tiempo de ejecución optimizado: {end_time - start_time} segundos")
    print(arr2[0:3,0:5])
```

La librería `time` permite tomar mediciones temporales básicas. Se obtiene un timestamp inicial con `time.time()`, se ejecuta el código, y se toma otro timestamp final. La diferencia entre ambos proporciona el tiempo de ejecución.

Aunque NumPy está implementado en C y es eficiente, la indexación elemento por elemento en Python introduce overhead significativo, haciendo que la iteración manual sea mucho más lenta que usar operaciones vectorizadas.

**Resultado esperado:**
```bash
Tiempo de ejecución: 15.394351482391357 segundos
[[5 5 5 5 5]
 [5 5 5 5 5]
 [5 5 5 5 5]]
Tiempo de ejecución optimizado: 0.10234594345092773 segundos
[[5 5 5 5 5]
 [5 5 5 5 5]
 [5 5 5 5 5]]
```

### Limitaciones de time

- **Número de mediciones**: Solo se realiza una medición por ejecución
- **Confiabilidad**: Baja, debido a la interferencia de otros procesos del sistema
- **Solución**: Se requieren múltiples ejecuciones y promediado de resultados

## timeit

`timeit` es una versión mejorada que permite mediciones repetidas, aumentando la confianza estadística mediante múltiples ejecuciones.

```python
import numpy as np
from timeit import timeit

def full_matrix(matrix):
    """Llena una matriz iterando por cada elemento"""
    rows, cols = matrix.shape
    for i in range(rows):
        for j in range(cols):
            matrix[i, j] = 5

def full_matriz_optimized(matrix):
    """Llena una matriz usando el método fill() de numpy"""
    matrix.fill(5)

if __name__ == "__main__":
    n = 1000  # Tamaño reducido para múltiples ejecuciones
    arr = np.zeros((n, n), dtype=int)

    # Medir 100 ejecuciones de la función lenta
    t1 = timeit("full_matrix(arr)", globals=globals(), number=100)
    print(f"Tiempo promedio de ejecución: {t1/100} segundos")

    # Medir 100 ejecuciones de la función optimizada
    arr2 = np.zeros((n, n), dtype=int)
    t2 = timeit("full_matriz_optimized(arr2)", globals=globals(), number=100)
    print(f"Tiempo promedio de ejecución optimizado: {t2/100} segundos")
```

### Ventajas de timeit

- **Múltiples ejecuciones**: El parámetro `number` especifica cuántas veces ejecutar el código
- **Mayor confianza estadística**: El promediado mitiga el impacto de procesos externos
- **Precisión mejorada**: Usa el temporizador de mayor resolución disponible
- **Configuración flexible**: Permite especificar el contexto de ejecución con `globals`

### Uso adicional de timeit

```python
# Desde línea de comandos
python -m timeit "import numpy as np; np.zeros(1000).fill(5)"

# Con setup para inicialización
t = timeit(
    "matrix.fill(5)", 
    setup="import numpy as np; matrix = np.zeros((100, 100))", 
    number=1000
)
```

Ambas herramientas son útiles para benchmarking inicial, pero para profiling detallado se recomienda complementar con herramientas más avanzadas como `cProfile` o `pyInstrument`.