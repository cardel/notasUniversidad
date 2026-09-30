"""Fibonacci recursivo bajo cProfile, con y sin memoización.

La primera versión recalcula los mismos valores una y otra vez; la segunda
guarda cada resultado la primera vez que lo calcula. El encabezado del
reporte muestra el efecto en el número de llamadas.
"""
from cProfile import Profile
from functools import lru_cache
from pstats import SortKey, Stats

N = 35


def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)


@lru_cache(maxsize=None)
def fib_memo(n):
    if n <= 1:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)


def perfilar(funcion, n):
    with Profile() as perfil:
        print(funcion(n))
        estadisticas = Stats(perfil).sort_stats(SortKey.CUMULATIVE)
    estadisticas.print_stats(3)


if __name__ == "__main__":
    print("--- sin memoización")
    perfilar(fib, N)
    print("--- con memoización")
    perfilar(fib_memo, N)
