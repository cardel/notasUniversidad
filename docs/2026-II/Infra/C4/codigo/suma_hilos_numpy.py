"""La misma suma, con un arreglo de NumPy y sin ciclo de Python.

`lst[ini:fin].sum()` entra a una rutina compilada en C que recorre memoria
contigua con instrucciones vectoriales, y esa rutina suelta el bloqueo global
mientras trabaja. Por eso aquí los hilos sí avanzan a la vez.
"""
import sys
import threading
import time

import numpy as np

SIZE = int(sys.argv[1]) if len(sys.argv) > 1 else 100_000_000
arreglo = np.ones(SIZE) * 2


def sumar(lst, ini, fin):
    return lst[ini:fin].sum()   # suma vectorizada del segmento


def con_hilos(num_hilos):
    hilos = []
    ini, fin = 0, SIZE // num_hilos
    for _ in range(num_hilos):
        t = threading.Thread(target=sumar, args=(arreglo, ini, fin))
        t.start()
        ini = fin
        fin += SIZE // num_hilos
        hilos.append(t)
    for t in hilos:
        t.join()


if __name__ == "__main__":
    t0 = time.perf_counter()
    sumar(arreglo, 0, SIZE)
    base = time.perf_counter() - t0
    print(f"secuencial      {base * 1000:7.1f} ms")
    for num_hilos in [2, 4, 8, 16]:
        t0 = time.perf_counter()
        con_hilos(num_hilos)
        t = time.perf_counter() - t0
        print(f"{num_hilos:2d} hilos        {t * 1000:7.1f} ms   {base / t:4.2f}x")
