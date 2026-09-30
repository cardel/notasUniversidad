"""Por qué el ciclo de Python arruina lo que NumPy hace bien.

Cuatro formas de sumar los mismos números: recorriendo una lista, indexando
una lista, indexando un arreglo de NumPy desde Python, y con np.sum. La
última es la única que llega al código en C compilado con instrucciones
vectoriales.
"""
import sys
import timeit

import numpy as np

N = int(sys.argv[1]) if len(sys.argv) > 1 else 10_000_000


def por_iterador(xs):
    total = 0
    for x in xs:
        total += x
    return total


def por_indice(xs):
    total = 0
    for i in range(len(xs)):
        total += xs[i]
    return total


def numpy_indexado(a):
    total = 0
    for i in range(len(a)):
        total += a[i]
    return total


def numpy_vectorizado(a):
    return int(np.sum(a))


if __name__ == "__main__":
    lista = list(range(N))
    arreglo = np.arange(N, dtype=np.int64)
    print(f"n = {N:,}".replace(",", " "))
    for nombre, f, datos in (("lista por iterador", por_iterador, lista),
                             ("lista por índice", por_indice, lista),
                             ("numpy indexado", numpy_indexado, arreglo),
                             ("numpy vectorizado", numpy_vectorizado, arreglo)):
        ms = timeit.timeit(lambda: f(datos), number=1) * 1000
        print(f"{nombre:22s} {ms:9.1f} ms")

    # El envolvente: un elemento de un arreglo de NumPy no es un int de Python.
    print()
    print("tipo de arreglo[0]:", type(arreglo[0]).__name__)
    print("tipo de lista[0]:  ", type(lista[0]).__name__)
    grande = np.int64(2**62)
    with np.errstate(over="ignore"):  # NumPy avisa del desbordamiento
        print("int64 desborda:    ", grande * 4)
    print("int de Python no:  ", 2**62 * 4)
