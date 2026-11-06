import heapq
import sys


def primeras(consultas, k):
    # Los números de las primeras k respuestas, en orden.
    periodo = {}
    cola = []
    for num, p in consultas:
        periodo[num] = p
        heapq.heappush(cola, (p, num))
    salida = []
    respondidas = 0
    while respondidas < k:
        instante, num = heapq.heappop(cola)
        salida.append(str(num))
        heapq.heappush(cola, (instante + periodo[num], num))
        respondidas = respondidas + 1
    return salida


def main():
    datos = sys.stdin.read().split()
    pos = 0
    consultas = []
    while datos[pos] != '#':
        consultas.append((int(datos[pos + 1]), int(datos[pos + 2])))
        pos = pos + 3
    k = int(datos[pos + 1])
    print('\n'.join(primeras(consultas, k)))


main()
