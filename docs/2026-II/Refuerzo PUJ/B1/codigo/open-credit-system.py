# UVa 11078 - Open Credit System
import sys


def mayor_diferencia(a):
    mayor = a[0]
    mejor = a[0] - a[1]
    for j in range(1, len(a)):
        if mayor - a[j] > mejor:
            mejor = mayor - a[j]
        if a[j] > mayor:
            mayor = a[j]
    return mejor


def main():
    datos = sys.stdin.read().split()
    t = int(datos[0])
    pos = 1
    for caso in range(t):
        n = int(datos[pos])
        a = []
        for k in range(n):
            a.append(int(datos[pos + 1 + k]))
        pos = pos + 1 + n
        print(mayor_diferencia(a))


main()
