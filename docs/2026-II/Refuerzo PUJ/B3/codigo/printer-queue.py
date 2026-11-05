# UVa 12100 - Printer Queue
import sys
from collections import deque


def hay_mayor_prioridad(cuenta, p):
    hay = False
    for q in range(p + 1, 10):
        if cuenta[q] > 0:
            hay = True
    return hay


# cola de pares (prioridad, es_mio); cuenta[p] dice cuántos trabajos
# de prioridad p siguen en la cola
def minutos_hasta_imprimir(prioridades, m):
    cola = deque()
    cuenta = [0] * 10
    for i in range(len(prioridades)):
        cola.append((prioridades[i], i == m))
        cuenta[prioridades[i]] = cuenta[prioridades[i]] + 1
    minutos = 0
    impreso = False
    while not impreso:
        p, es_mio = cola.popleft()
        if hay_mayor_prioridad(cuenta, p):
            cola.append((p, es_mio))
        else:
            cuenta[p] = cuenta[p] - 1
            minutos = minutos + 1
            impreso = es_mio
    return minutos


def main():
    datos = sys.stdin.read().split()
    casos = int(datos[0])
    pos = 1
    for c in range(casos):
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2
        prioridades = []
        for i in range(n):
            prioridades.append(int(datos[pos + i]))
        pos = pos + n
        print(minutos_hasta_imprimir(prioridades, m))


main()
