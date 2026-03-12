# Threading en Python

Un **proceso** es una instancia de un programa que se ejecuta en un espacio de memoria independiente. Cada proceso tiene su propio espacio de direcciones, recursos del sistema y estado de ejecución.

Un **hilo** (thread) es la unidad más pequeña de ejecución dentro de un proceso. Múltiples hilos comparten el mismo espacio de memoria del proceso padre, lo que permite comunicación más eficiente pero requiere sincronización para evitar condiciones de carrera.

Un proceso puede contener múltiples hilos, lo que se conoce como **programación multihilo**.

**Regla general de selección**:
- Para procesos intensivos en **entrada/salida (I/O)** (lectura/escritura de archivos, operaciones de red, acceso a bases de datos): usar hilos.
- Para procesos intensivos en **CPU** (cálculos matemáticos, procesamiento de datos): usar procesos múltiples (multiprocessing).

# Aspectos de Threading en Python

## GIL (Global Interpreter Lock)

El Global Interpreter Lock es un mecanismo de sincronización en CPython (la implementación estándar de Python) que protege el acceso a los objetos internos de Python, permitiendo que solo un hilo ejecute bytecode Python a la vez. Es similar a un baño público con una sola puerta: hasta que una persona no termine de usarlo, la siguiente debe esperar.

Debido al GIL, los hilos en Python no logran **paralelismo real** para código CPU-bound (intensivo en CPU), ya que hay latencias impuestas por la alternancia del GIL entre hilos. Sin embargo, para código I/O-bound, los hilos son efectivos porque el GIL se libera durante las operaciones de espera de I/O.

# Módulo Threading

Es un módulo nativo de Python que proporciona una API de alto nivel para trabajar con hilos.

```python
import threading

# Creación de un hilo que ejecutará 'funcion' con los argumentos especificados
t1 = threading.Thread(target=funcion, args=(arg1, arg2, arg3, ..., argn))

t1.start()  # Inicia la ejecución del hilo

t1.join()   # Espera a que el hilo termine su ejecución
```

Es fundamental colocar `join()` para evitar que el programa principal termine antes de que el hilo complete su trabajo. Debe colocarse en la parte del código donde estrictamente necesitamos los resultados del hilo.

## Ejemplo: Suma paralela con múltiples hilos

```python
import threading
import time

size = 100_000_000  # 100 millones de elementos
l = [2] * size  # Lista con 100 millones de doses

def sumar(lst, ini, fin):
    """Suma los elementos de la lista desde el índice 'ini' hasta 'fin'-1"""
    sum = 0
    for i in range(ini, fin):
        sum += lst[i]
    return sum

if __name__ == "__main__":
    # Probar con diferentes números de hilos
    for num_hilos in [2, 4, 6, 8, 10, 12, 14, 16]:
        inicial = time.perf_counter()  # Tiempo de inicio de alta precisión
        hilos = []
        ini = 0
        fin = size // num_hilos  # Tamaño de cada segmento
        
        # Crear y lanzar los hilos
        # Por ejemplo, si num_hilos = 4:
        # Segmentos: (0, n/4), (n/4, n/2), (n/2, 3n/4), (3n/4, n)
        for i in range(num_hilos):
            t = threading.Thread(target=sumar, args=(l, ini, fin))
            t.start()  # Inicia el hilo
            ini = fin  # Actualiza inicio para el siguiente segmento
            fin += size // num_hilos  # Actualiza fin para el siguiente segmento
            hilos.append(t)  # Guarda referencia al hilo

        # Esperar a que todos los hilos terminen
        for t in hilos:
            t.join()

        final = time.perf_counter()
        print(f"El tiempo de ejecución con {num_hilos} hilos es {final - inicial} s")
```

## Versión optimizada usando NumPy

```python
import threading
import time
import numpy as np

size = 100_000_000  # 100 millones de elementos
l = np.ones(size) * 2  # Arreglo NumPy con 100 millones de doses (más eficiente)

def sumar(lst, ini, fin):
    """Suma un segmento del arreglo NumPy usando operaciones vectorizadas"""
    sum = lst[ini:fin].sum()  # Suma vectorizada del segmento
    return sum

if __name__ == "__main__":
    for num_hilos in [2, 4, 6, 8, 10, 12, 14, 16]:
        inicial = time.perf_counter()
        hilos = []
        ini = 0
        fin = size // num_hilos
        
        for i in range(num_hilos):
            t = threading.Thread(target=sumar, args=(l, ini, fin))
            t.start()
            ini = fin
            fin += size // num_hilos
            hilos.append(t)

        for t in hilos:
            t.join()

        final = time.perf_counter()
        print(f"El tiempo de ejecución con {num_hilos} hilos es {final - inicial} s")
```

Esta es una implementación del patrón **Map-Reduce**:
- **Map**: Dividir el problema en segmentos y procesarlos en paralelo (hilos).
- **Reduce**: Combinar los resultados parciales (en este caso, implícitamente).

# Thread Pool

Un thread pool es un conjunto de hilos pre-creados que son gestionados automáticamente por un ejecutor. No controlamos directamente cuándo se inician o terminan, pero debemos esperar a que el pool complete todas las tareas.

```python
from concurrent.futures import ThreadPoolExecutor

# Creación de un pool con un número específico de workers (hilos)
pool = ThreadPoolExecutor(max_workers=num_hilos)

# Envío de tareas al pool
pool.submit(tarea, arg1, arg2)

# Esperar a que todas las tareas terminen y cerrar el pool
pool.shutdown(wait=True)
```

- `submit()`: Envía tareas al pool para su ejecución.
- `shutdown(wait=True)`: Espera a que todas las tareas pendientes se completen antes de cerrar el pool.

## Ejemplo con ThreadPoolExecutor

```python
from concurrent.futures import ThreadPoolExecutor
import time

size = 100_000_000
l = [2] * size

def sumar(lst, ini, fin):
    """Suma los elementos de la lista desde el índice 'ini' hasta 'fin'-1"""
    sum = 0
    for i in range(ini, fin):
        sum += lst[i]
    return sum

if __name__ == "__main__":
    for num_hilos in [2, 4, 6, 8, 10, 12, 14, 16]:
        # Crear pool con el número especificado de workers
        pool = ThreadPoolExecutor(max_workers=num_hilos)
        inicial = time.perf_counter()
        
        ini = 0
        fin = size // num_hilos
        
        # Enviar tareas al pool
        for _ in range(num_hilos):
            pool.submit(sumar, l, ini, fin)
            ini = fin
            fin += size // num_hilos

        # Esperar a que todas las tareas terminen y cerrar el pool
        pool.shutdown(wait=True)
        
        final = time.perf_counter()
        print(f"El tiempo de ejecución con {num_hilos} hilos es {final - inicial} s")
```

En los resultados observamos que el ThreadPoolExecutor funciona más rápido que la gestión manual de hilos con `threading.Thread`, dado que la misma librería se encarga de gestionarlos eficientemente (arranque, reuso y terminación).

---

## Tabla de resumen

| Concepto | Descripción | Ejemplo/Implementación |
|----------|-------------|------------------------|
| **Proceso** | Instancia de un programa con espacio de memoria independiente, recursos propios y estado de ejecución aislado. | Programa Python ejecutándose en su propio intérprete. |
| **Hilo (Thread)** | Unidad mínima de ejecución dentro de un proceso; múltiples hilos comparten memoria y recursos del proceso padre. | `threading.Thread(target=func, args=(...))` |
| **GIL (Global Interpreter Lock)** | Mecanismo en CPython que permite solo un hilo ejecutando bytecode Python a la vez, limitando paralelismo real para CPU-bound. | Causa que hilos Python alternen ejecución en lugar de ejecutar en paralelo real. |
| **I/O-bound vs CPU-bound** | Clasificación de tareas: I/O-bound espera recursos externos; CPU-bound realiza cálculos intensivos. | I/O: lectura de archivos; CPU: procesamiento matemático. |
| **Módulo `threading`** | API nativa de Python para creación y gestión manual de hilos. | `Thread()`, `start()`, `join()`, `Lock()`, `Event()`, etc. |
| **ThreadPoolExecutor** | Ejecutor que gestiona automáticamente un pool de hilos reutilizables, más eficiente que gestión manual. | `concurrent.futures.ThreadPoolExecutor(max_workers=N)` |
| **Map-Reduce** | Patrón de programación paralela: dividir (map), procesar en paralelo, combinar resultados (reduce). | Dividir lista en segmentos, sumar cada segmento en hilos, combinar sumas. |
| **Condición de carrera** | Problema de concurrencia cuando múltiples hilos acceden/modifican datos compartidos sin sincronización. | Se evita con `Lock`, `RLock`, `Semaphore`, o estructuras thread-safe. |
| **`join()`** | Método que bloquea el hilo llamante hasta que el hilo objetivo termine su ejecución. | `t.join()` espera a que el hilo `t` termine. |
| **`submit()`** | Método de ThreadPoolExecutor para enviar tareas al pool de ejecución. | `pool.submit(func, arg1, arg2)` |

## Comentarios adicionales

- El GIL es específico de CPython; otras implementaciones como Jython (Java) y IronPython (.NET) no tienen GIL y permiten verdadero paralelismo con hilos.
- Para código CPU-bound en Python, el módulo `multiprocessing` es generalmente mejor opción que `threading`, ya que usa procesos separados que evitan el GIL.
- Los Thread Pools son más eficientes que crear y destruir hilos manualmente porque:
  1. Reutilizan hilos existentes (reduce overhead de creación/destrucción).
  2. Gestionan automáticamente la asignación de tareas a hilos disponibles.
  3. Proporcionan mecanismos para manejar excepciones y recuperar resultados.
- La sincronización entre hilos es crítica cuando comparten datos. Herramientas comunes:
  - `Lock`: Exclusión mutua simple.
  - `RLock`: Lock reentrante (mismo hilo puede adquirirlo múltiples veces).
  - `Semaphore`: Controla acceso a un número limitado de recursos.
  - `Event`: Comunicación simple entre hilos (señalización).
  - `Condition`: Sincronización más compleja con notificaciones.
- El parámetro `if __name__ == "__main__":` es esencial en scripts que usan concurrencia para evitar problemas en Windows y en multiprocessing.
- Para operaciones de I/O asíncronas, `asyncio` (disponible desde Python 3.5+) puede ser más eficiente que threading, especialmente para muchas conexiones simultáneas.