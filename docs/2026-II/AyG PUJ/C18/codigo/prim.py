"""
Algoritmo de Prim, con busqueda lineal y con cola de prioridad
Noviembre 13 de 2026

"""

from heapq import heappush, heappop

INFTY = float('inf')


def extraer_minimo(clave, en_mst):
    minimo = None ; mejor = INFTY
    for v in clave:
        if not en_mst[v] and clave[v] < mejor:
            mejor = clave[v] ; minimo = v
    return minimo


def prim(grafo, raiz):
    clave = {} ; padre = {} ; en_mst = {}
    for v in grafo:
        clave[v] = INFTY ; padre[v] = None ; en_mst[v] = False
    clave[raiz] = 0
    peso = 0
    restantes = len(grafo)
    while restantes > 0:
        u = extraer_minimo(clave, en_mst)
        if u is None:
            restantes = 0
        else:
            en_mst[u] = True
            if padre[u] is not None:
                peso = peso + clave[u]
            for (v, w) in grafo[u]:
                if not en_mst[v] and w < clave[v]:
                    clave[v] = w ; padre[v] = u
            restantes = restantes - 1
    return padre, peso


def prim_cola(grafo, raiz):
    clave = {} ; padre = {} ; en_mst = {}
    for v in grafo:
        clave[v] = INFTY ; padre[v] = None ; en_mst[v] = False
    clave[raiz] = 0
    cola = list() ; heappush(cola, (clave[raiz], raiz))
    peso = 0
    while len(cola) != 0:
        cu, u = heappop(cola)
        # si u ya entro al arbol, la pareja es vieja y se descarta
        if not en_mst[u]:
            en_mst[u] = True
            peso = peso + cu
            for (v, w) in grafo[u]:
                if not en_mst[v] and w < clave[v]:
                    clave[v] = w ; padre[v] = u
                    heappush(cola, (clave[v], v))
    return padre, peso


if __name__ == '__main__':
    G = {
        0: [(1, 7), (3, 5)],
        1: [(0, 7), (2, 8), (3, 9), (4, 7)],
        2: [(1, 8), (4, 5)],
        3: [(0, 5), (1, 9), (4, 15), (5, 6)],
        4: [(1, 7), (2, 5), (3, 15), (5, 8), (6, 9)],
        5: [(3, 6), (4, 8), (6, 11)],
        6: [(4, 9), (5, 11)],
    }
    for (nombre, f) in [('busqueda lineal', prim), ('cola de prioridad', prim_cola)]:
        padre, peso = f(G, 0)
        print(nombre, '-> peso del MST =', peso)
        for v in padre:
            if padre[v] is not None:
                print('   (', padre[v], ',', v, ')')
