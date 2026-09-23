"""Las dos maneras de llenar una matriz de NumPy: con dos ciclos de Python o
con el método del arreglo. El resultado es el mismo y el tiempo no."""
import sys
import time

import numpy as np

N = int(sys.argv[1]) if len(sys.argv) > 1 else 10000


def con_ciclos(m):
    filas, columnas = m.shape
    for i in range(filas):
        for j in range(columnas):
            m[i, j] = 5


def con_fill(m):
    m.fill(5)


if __name__ == "__main__":
    a = np.zeros((N, N), dtype=np.int64)
    t0 = time.perf_counter()
    con_ciclos(a)
    t1 = time.perf_counter()
    b = np.zeros((N, N), dtype=np.int64)
    t2 = time.perf_counter()
    con_fill(b)
    t3 = time.perf_counter()
    print(f"n = {N} x {N}")
    print(f"ciclos anidados {t1 - t0:8.2f} s")
    print(f"fill(5)         {t3 - t2:8.2f} s")
    print(f"iguales: {np.array_equal(a, b)}")
