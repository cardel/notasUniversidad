"""Cinco patrones sobre el mismo arreglo de cinco millones de float64.

Los dos primeros cambian cómo se accede a la memoria; los tres últimos
cambian qué se hace con cada elemento. Solo los patrones que cumplen las
cuatro condiciones de SIMD aprovechan los carriles del registro.
"""
import timeit

import numpy as np

N = 5_000_000
VECES = 5

rng = np.random.default_rng(7)
a = rng.random(N)
idx = rng.permutation(N)  # índices dispersos


def contiguo():
    return a * 2.5 + 1.0


def disperso():
    return a[idx] * 2.5 + 1.0


def bifurcacion_vectorizada():
    return np.where(a > 0.5, a * 2.5, -a)


def bifurcacion_en_bucle():
    s = np.empty(N)
    for i in range(N):
        s[i] = a[i] * 2.5 if a[i] > 0.5 else -a[i]
    return s


def recurrencia():
    s = np.empty(N)
    s[0] = a[0]
    for i in range(1, N):
        s[i] = 0.99 * s[i - 1] + a[i]
    return s


if __name__ == "__main__":
    base = None
    for f in (contiguo, disperso, bifurcacion_vectorizada,
              bifurcacion_en_bucle, recurrencia):
        ms = timeit.timeit(f, number=VECES) / VECES * 1000
        base = base or ms
        print(f"{f.__name__:28s} {ms:9.1f} ms {ms / base:7.1f}x")
