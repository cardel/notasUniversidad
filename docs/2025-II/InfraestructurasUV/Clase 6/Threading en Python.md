# Librería Thread

Es similar a la libreria thread de C++, requiere como parametros la función a paralelizar  y sus argumentos.

La función a paralelizar debe implementar la estrategia de paralelización. La estrategia utiliza es partir el rango usando los argumentos de entrada ini y fin

```python
"""
Autor: Carlos A Delgado
Fecha: 23 de Sep de 2025
Ejemplo de uso de threading en Python
"""
from threading import Thread
import time

# Función que genera números y los añade a una lista
def generador(ini, fin, l):
    for i in range(ini, fin):
        l.append(10)  # Añade el valor 10 a la lista 'l' en cada iteración

if __name__ == "__main__":
    n = 10000000  # Número total de elementos a generar
    
    # Ejecución secuencial (sin hilos)
    ini = time.time()  # Marca tiempo inicial
    l = []  # Lista vacía
    generador(0, n, l)  # Llama a la función con todo el rango
    fin = time.time()  # Marca tiempo final

    # Muestra primeros 20 elementos, longitud, suma total y tiempo
    print(l[:20], len(l), sum(l), "Tiempo en s " + str(fin-ini))
    
    # Ejecución con 4 hilos
    l1, l2, l3, l4 = [], [], [], []  # Cuatro listas para los hilos
    ini = time.time()  # Marca tiempo inicial para ejecución paralela
    
    # Creación de hilos dividiendo el trabajo en 4 partes
    t1 = Thread(target=generador, args=(0, n//4, l1))      # Hilo 1: 0 a n/4
    t2 = Thread(target=generador, args=(n//4, n//2, l2))   # Hilo 2: n/4 a n/2
    t3 = Thread(target=generador, args=(n//2, 3*n//4, l3)) # Hilo 3: n/2 a 3n/4
    t4 = Thread(target=generador, args=(3*n//4, n, l4))    # Hilo 4: 3n/4 a n

    # Inicia la ejecución de los hilos
    t1.start()
    t2.start()
    t3.start()
    t4.start()

    # Espera a que todos los hilos terminen
    t1.join()
    t2.join()
    t3.join()
    t4.join()
    
    fin = time.time()  # Marca tiempo final
    r = l1 + l2 + l3 + l4  # Combina resultados de los hilos
    # Muestra longitud, suma total y tiempo de ejecución paralela
    print(len(r), sum(r), "El tiempo en ms es " + str(fin-ini))
```

Los hilos en Python permiten ejecutar múltiples tareas concurrentemente dentro del mismo proceso. Cada hilo comparte el mismo espacio de memoria, lo que facilita el intercambio de datos pero requiere sincronización para evitar condiciones de carrera. El Global Interpreter Lock (GIL) en CPython limita la ejecución paralela real de código Python, pero los hilos siguen siendo útiles para operaciones de E/S o cuando se mezclan con extensiones que liberan el GIL.

En el código, los conceptos de hilos se aplican mediante: la creación de objetos Thread con target=generador para definir la función a ejecutar; args para pasar parámetros específicos a cada hilo; start() para iniciar la ejecución concurrente; y join() para sincronizar la finalización. La división del trabajo (n//4, n//2, etc.) demuestra cómo paralelizar una tarea computacionalmente intensiva, aunque el GIL puede limitar la ganancia de rendimiento en operaciones CPU-bound puras. Las listas l1, l2, l3, l4 actú como memoria compartida donde cada hilo escribe su resultado parcial.

# ThreadPool

El threadpool es una colección de hilos, los cuales indicamos cual es su tamaño máximo, cuando enviamos una tarea con submit esta es asignada a uno de los hilos disponibles.
Se debe esperar a que todos los hilos se terminen, esto lo hacemos con shutdown

```python
"""
Autor: Carlos A Delgado
Fecha: 23 de Sep de 2025
Ejemplo de uso de thread pool en Python
"""

from concurrent.futures import ThreadPoolExecutor
import time


def generador(ini, fin, l):
    for i in range(ini, fin):
        l.append(10)  # Añade el valor 10 a la lista 'l' en cada iteración


if __name__ == "__main__":
    n = 10000000  # Número total de elementos a generar
    num_thread = 16  # Número de hilos en el pool
    
    # Ejecución secuencial (sin hilos)
    ini = time.time()
    l = []
    generador(0, n, l)
    fin = time.time()

    print(l[:20], len(l), sum(l), "Tiempo en s " + str(fin - ini))
    
    # Ejecución con ThreadPoolExecutor

    ini = time.time()
    pool = ThreadPoolExecutor(max_workers=num_thread)  # Crea pool con 16 hilos
    cnt = 0
    l = []  # Lista para almacenar las listas de resultados de cada hilo
    
    for i in range(0, num_thread):
        s = []  # Nueva lista para cada tarea
        # Envía tarea al pool: divide el trabajo en num_thread partes
        pool.submit(generador, cnt * n // num_thread, (cnt + 1) * n // num_thread, s)
        cnt += 1
        l.append(s)  # Almacena la lista de resultados

    fin = time.time()
    pool.shutdown(wait=True)  # Espera a que todas las tareas terminen
    
    r = []
    for i in range(0, num_thread):
        r += l[i]  # Combina todos los resultados
    print(len(r), sum(r), "El tiempo en ms es " + str(fin - ini))
```

El ThreadPoolExecutor gestiona un grupo de hilos pre-inicializados que reutiliza para tareas, evitando el costo de crear y destruir hilos repetidamente. El método submit() encola tareas que son ejecutadas por los hilos disponibles en el pool. El parámetro max_workers=16 define el máximo de hilos concurrentes.

El shutdown(wait=True) asegura que el programa espere a la finalización de todas las tareas antes de continuar, similar al join() en threading.Thread.

La división del trabajo en 16 partes iguales mediante cnt * n // num_thread demuestra la distribución de carga, pero la implementación actual no garantiza la integridad de los datos debido al problema de concurrencia con listas no sincronizadas.



