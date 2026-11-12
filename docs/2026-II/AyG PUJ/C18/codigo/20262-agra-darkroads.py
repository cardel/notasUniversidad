"""
UVa 11631, Dark roads
Noviembre 13 de 2026

Lo que se ahorra es el peso de todas las calles menos el peso del
arbol de cubrimiento minimo.
"""

import sys


def make_set(p, rango, x):
    p[x] = x
    rango[x] = 0


def find_set(p, x):
    if p[x] != x:
        p[x] = find_set(p, p[x])
    return p[x]


def union(p, rango, x, y):
    rx = find_set(p, x)
    ry = find_set(p, y)
    if rx != ry:
        if rango[rx] < rango[ry]:
            p[rx] = ry
        elif rango[rx] > rango[ry]:
            p[ry] = rx
        else:
            p[ry] = rx
            rango[rx] = rango[rx] + 1


def ahorro(m, aristas):
    total = 0
    for (w, x, y) in aristas:
        total = total + w
    aristas.sort()
    p = [0] * m
    rango = [0] * m
    for v in range(m):
        make_set(p, rango, v)
    tendido = 0
    puestas = 0
    i = 0
    while i < len(aristas) and puestas < m - 1:
        (w, x, y) = aristas[i]
        if find_set(p, x) != find_set(p, y):
            union(p, rango, x, y)
            tendido = tendido + w
            puestas = puestas + 1
        i = i + 1
    return total - tendido


def main():
    datos = sys.stdin.buffer.read().split()
    i = 0
    salida = []
    m = int(datos[i])
    n = int(datos[i + 1])
    i = i + 2
    while m != 0:
        aristas = []
        for _ in range(n):
            x = int(datos[i])
            y = int(datos[i + 1])
            z = int(datos[i + 2])
            i = i + 3
            aristas.append((z, x, y))
        salida.append(str(ahorro(m, aristas)))
        m = int(datos[i])
        n = int(datos[i + 1])
        i = i + 2
    print('\n'.join(salida))


main()
