El problema que los tienen los hilos es que su gestión depende del interprete de Python, por lo que el rendimiento puede verse limitado por caracteristicas de este.

Por lo tanto resulta conveniente dividir el programa en diferentes procesos, que sea el S.O quien los gestione de forma independiente.

```python
"""
Autor: Carlos A Delgado
Fecha: 23 de Septiembre 2025
Ejemplo de multiprocessing en Python
"""

import numpy as np
import time
from multiprocessing import Process


def suma_lista(ini, fin, l):
    suma = 0
    for i in range(ini, fin):
        suma += l[i]  # Suma los elementos del segmento [ini, fin)
    return suma  # Retorna la suma parcial


def inicializar(ini, fin, l):
    for i in range(ini, fin):
        l[i] = i  # Inicializa cada posición con su índice


def main():
    size = 100_000_000  # 100 millones de elementos
    l = np.zeros(size)  # Crea array de ceros
    inicializar(0, size, l)  # Inicializa el array completo
    print(l[:20])  # Muestra primeros 20 elementos
    
    # Ejecución secuencial
    ini = time.time()
    print(suma_lista(0, size, l))  # Suma completa en un solo proceso
    fin = time.time()
    print("El tiempo secuencial es seg " + str(fin - ini))

    # Ejecución con multiprocessing
    ini = time.time()
    # Crea 4 procesos dividiendo el trabajo en segmentos iguales
    p1 = Process(target=suma_lista, args=(0, size // 4, l))
    p2 = Process(target=suma_lista, args=(size // 4, 2 * size // 4, l))
    p3 = Process(target=suma_lista, args=(2 * size // 4, 3 * size // 4, l))
    p4 = Process(target=suma_lista, args=(3 * size // 4, size, l))

    # Inicia los procesos
    p1.start()
    p2.start()
    p3.start()
    p4.start()

    # Espera a que todos los procesos terminen
    p1.join()
    p2.join()
    p3.join()
    p4.join()

    fin = time.time()
    print("El tiempo en 4 procesos en s es " + str(fin - ini))


if __name__ == "__main__":
    main()  # Ejecuta la función main solo si es el script principal
```

El multiprocessing en Python crea procesos independientes con memoria separada, evitando el GIL y permitiendo verdadero paralelismo en CPU. Cada proceso tiene su propio espacio de memoria, por lo que los datos no se comparten directamente.

Este código tiene un problema fundamental: los procesos hijos reciben una copia del array 'l' al iniciarse, pero las modificaciones (en este caso, el cálculo de sumas parciales) no se retornan al proceso padre. Las funciones suma_lista devuelven valores, pero Process no captura estos retornos. Los resultados de las sumas parciales se pierden porque no hay mecanismo de comunicación inter-procesos.

La división del trabajo en 4 segmentos iguales es correcta para la paralelización, pero la implementación carece de recolección de resultados. Para que funcione correctamente, se necesitaría usar Queue, Pipe o shared memory para comunicar los resultados parciales al proceso padre y combinarlos. El tiempo medido solo refleja la ejecución de procesos vacíos sin recolección de datos útiles.

# Observación en el S.O

Cuando se hace la parte secuencia
```bash
 cardel@portatil-gamer  ~  ps aux | grep python
cardel     47170 99.5  1.1 841680 193048 pts/2   R+   16:01   0:04 python MultiProcessing.py
```
Cuando se hace la parte multprocesos
```bash
 cardel@portatil-gamer  ~  ps aux | grep python
cardel     47170 97.4  5.0 841888 811356 pts/2   S+   16:01   0:30 python MultiProcessing.py
cardel     47299  101  4.9 841888 798628 pts/2   R+   16:01   0:00 python MultiProcessing.py
cardel     47300  101  4.9 841888 798628 pts/2   R+   16:01   0:00 python MultiProcessing.py
cardel     47301  100  4.9 841888 798628 pts/2   R+   16:01   0:00 python MultiProcessing.py
cardel     47302  100  4.9 841888 798628 pts/2   R+   16:01   0:00 python MultiProcessing.py
```
El resultado final
```bash
El tiempo secuencial es seg 15.8168785572052
El tiempo en 4 procesos en s es 3.8456006050109863
```

