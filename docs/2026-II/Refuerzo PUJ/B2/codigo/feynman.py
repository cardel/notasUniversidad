# UVa 12149 - Feynman
import sys


def cuadrados(n):
    # suma de m * m para m de 1 a n: los cuadrados de lado n - m + 1
    return n * (n + 1) * (2 * n + 1) // 6


def main():
    datos = sys.stdin.read().split()
    pos = 0
    n = int(datos[pos])
    while n != 0:
        print(cuadrados(n))
        pos = pos + 1
        n = int(datos[pos])


main()
