import sys


def longitud_ciclo(n):
    cuenta = 1
    while n != 1:
        if n % 2 == 1:
            n = 3 * n + 1
        else:
            n = n // 2
        cuenta = cuenta + 1
    return cuenta


def maximo_ciclo(a, b):
    mejor = 0
    k = a
    while k <= b:
        c = longitud_ciclo(k)
        if c > mejor:
            mejor = c
        k = k + 1
    return mejor


def main():
    datos = sys.stdin.read().split()
    t = 0
    while t + 1 < len(datos):
        i = int(datos[t])
        j = int(datos[t + 1])
        if i <= j:
            m = maximo_ciclo(i, j)
        else:
            m = maximo_ciclo(j, i)
        print("%d %d %d" % (i, j, m))
        t = t + 2


main()
