"""
Algoritmo de Kruskal sobre conjuntos disjuntos
Noviembre 13 de 2026

"""


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


def kruskal(V, aristas):
    ordenadas = sorted(aristas, key=lambda e: e[2])
    p = {}
    rango = {}
    for v in V:
        make_set(p, rango, v)
    mst = []
    peso = 0
    i = 0
    while i < len(ordenadas) and len(mst) < len(V) - 1:
        u, v, w = ordenadas[i]
        if find_set(p, u) != find_set(p, v):
            union(p, rango, u, v)
            mst.append((u, v, w))
            peso = peso + w
        i = i + 1
    return mst, peso


if __name__ == '__main__':
    V = [0, 1, 2, 3, 4, 5, 6]
    E = [
        (0, 1, 7),
        (0, 3, 5),
        (1, 2, 8),
        (1, 3, 9),
        (1, 4, 7),
        (2, 4, 5),
        (3, 4, 15),
        (3, 5, 6),
        (4, 5, 8),
        (4, 6, 9),
        (5, 6, 11),
    ]
    mst, peso = kruskal(V, E)
    print('el MST tiene', len(mst), 'aristas y peso', peso)
    for a in mst:
        print('  ', a)
