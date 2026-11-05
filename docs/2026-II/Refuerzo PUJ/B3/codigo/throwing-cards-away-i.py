# UVa 10935 - Throwing cards away I
import sys
from collections import deque


def jugar(n):
    # devuelve la línea de descartadas y la carta que queda
    mazo = deque()
    for carta in range(1, n + 1):
        mazo.append(carta)
    linea = "Discarded cards:"
    primera = True
    while len(mazo) >= 2:
        if primera:
            linea = linea + " " + str(mazo.popleft())
            primera = False
        else:
            linea = linea + ", " + str(mazo.popleft())
        mazo.append(mazo.popleft())
    return linea, mazo[0]


def main():
    datos = sys.stdin.read().split()
    i = 0
    while i < len(datos) and int(datos[i]) != 0:
        linea, ultima = jugar(int(datos[i]))
        print(linea)
        print("Remaining card: %d" % ultima)
        i = i + 1


main()
