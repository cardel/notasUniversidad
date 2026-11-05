# UVa 11286 - Conformity
import sys


def ganadores(combinaciones):
    # combinaciones trae una tupla ordenada de cursos por estudiante
    cuenta = {}
    for k in combinaciones:
        if k in cuenta:
            cuenta[k] = cuenta[k] + 1
        else:
            cuenta[k] = 1
    mayor = 0
    total = 0
    for k in cuenta:
        if cuenta[k] > mayor:
            mayor = cuenta[k]
            total = cuenta[k]
        elif cuenta[k] == mayor:
            total = total + cuenta[k]
    return total


def main():
    datos = sys.stdin.read().split()
    pos = 0
    n = int(datos[pos])
    pos = pos + 1
    while n != 0:
        combinaciones = []
        for i in range(n):
            combinaciones.append(tuple(sorted(datos[pos:pos + 5])))
            pos = pos + 5
        print(ganadores(combinaciones))
        n = int(datos[pos])
        pos = pos + 1


main()
