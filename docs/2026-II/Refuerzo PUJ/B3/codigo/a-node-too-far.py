import sys
from collections import deque


def indiceDe(indice, adj, nodo):
    # El índice del nodo; si es la primera vez que aparece, se le asigna uno.
    if nodo not in indice:
        indice[nodo] = len(indice)
        adj.append([])
    return indice[nodo]


def bfs(adj, inicio, ttl):
    # Cuántos nodos quedan a distancia menor o igual a ttl desde inicio.
    dist = [-1] * len(adj)
    cola = deque()
    dist[inicio] = 0
    cola.append(inicio)
    alcanzados = 1
    while len(cola) > 0:
        u = cola.popleft()
        if dist[u] < ttl:
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    alcanzados = alcanzados + 1
                    cola.append(v)
    return alcanzados


def main():
    datos = sys.stdin.read().split()
    pos = 0
    caso = 0
    salida = []
    conexiones = int(datos[pos])
    pos = pos + 1
    while conexiones != 0:
        indice = {}
        adj = []
        i = 0
        while i < conexiones:
            ia = indiceDe(indice, adj, int(datos[pos]))
            ib = indiceDe(indice, adj, int(datos[pos + 1]))
            pos = pos + 2
            adj[ia].append(ib)
            adj[ib].append(ia)
            i = i + 1
        nodo = int(datos[pos])
        ttl = int(datos[pos + 1])
        pos = pos + 2
        while nodo != 0 or ttl != 0:
            caso = caso + 1
            alcanzados = 0
            if nodo in indice:
                alcanzados = bfs(adj, indice[nodo], ttl)
            salida.append('Case ' + str(caso) + ': ' + str(len(adj) - alcanzados)
                          + ' nodes not reachable from node ' + str(nodo)
                          + ' with TTL = ' + str(ttl) + '.')
            nodo = int(datos[pos])
            ttl = int(datos[pos + 1])
            pos = pos + 2
        conexiones = int(datos[pos])
        pos = pos + 1
    print('\n'.join(salida))


main()
