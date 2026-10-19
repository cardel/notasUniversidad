# UVa 913 - Joana and the Odd Numbers
import sys


def suma_ultimos(n):
    k = (n + 1) // 2
    ultimo = 2 * k * k - 1
    return 3 * ultimo - 6


def main():
    datos = sys.stdin.read().split()
    t = 0
    while t < len(datos):
        print(suma_ultimos(int(datos[t])))
        t = t + 1


main()
