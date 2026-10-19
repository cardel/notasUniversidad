# UVa 10079 - Pizza Cutting
import sys


def piezas(n):
    r = n * (n + 1) // 2 + 1
    return r


def main():
    datos = sys.stdin.read().split()
    t = 0
    n = 0
    while t < len(datos) and n >= 0:
        n = int(datos[t])
        if n >= 0:
            print(piezas(n))
        t = t + 1


main()
