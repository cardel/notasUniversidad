# El simio y el cafe: una cuadricula como grafo implicito. Cada celda libre
# es un vertice y cada par de celdas contiguas es una arista, pero la lista
# de adyacencia nunca se construye: los vecinos de (r, c) se calculan cuando
# el recorrido los pide.

from collections import deque

DR = [1, -1, 0, 0]
DC = [0, 0, 1, -1]


def es_libre(laberinto, r, c):
    # (r, c) existe y no es pared
    R = len(laberinto)
    C = len(laberinto[0])
    return r >= 0 and r < R and c >= 0 and c < C and laberinto[r][c] != "#"


def vecinos(laberinto, r, c):
    # Las celdas contiguas a (r, c) por las que se puede pasar
    res = []
    k = 0
    while k < 4:
        nr = r + DR[k]
        nc = c + DC[k]
        if es_libre(laberinto, nr, nc):
            res.append((nr, nc))
        k = k + 1
    return res


def dfs(laberinto, r, c, visitado):
    # Marca (r, c) y sigue por cada vecino que falte
    visitado[r][c] = True
    for celda in vecinos(laberinto, r, c):
        if not visitado[celda[0]][celda[1]]:
            dfs(laberinto, celda[0], celda[1], visitado)


def puede_llegar(laberinto, r0, c0, rf, cf):
    # True si hay camino de (r0, c0) a (rf, cf)
    R = len(laberinto)
    C = len(laberinto[0])
    visitado = []
    r = 0
    while r < R:
        visitado.append([False] * C)
        r = r + 1
    dfs(laberinto, r0, c0, visitado)
    return visitado[rf][cf]


def distancias(laberinto, r0, c0):
    # d[r][c] = pasos minimos desde (r0, c0); -1 si no se llega
    R = len(laberinto)
    C = len(laberinto[0])
    d = []
    r = 0
    while r < R:
        d.append([-1] * C)
        r = r + 1
    d[r0][c0] = 0
    cola = deque()
    cola.append((r0, c0))
    while len(cola) > 0:
        actual = cola.popleft()
        r = actual[0]
        c = actual[1]
        for celda in vecinos(laberinto, r, c):
            if d[celda[0]][celda[1]] == -1:
                d[celda[0]][celda[1]] = d[r][c] + 1
                cola.append(celda)
    return d


LABERINTO = [
    "S..#....",
    ".#.#.##.",
    ".#...#..",
    ".####.#.",
    "......#C",
]


def posicion_de(laberinto, letra):
    # Fila y columna donde esta la letra
    R = len(laberinto)
    C = len(laberinto[0])
    res = (-1, -1)
    r = 0
    while r < R:
        c = 0
        while c < C:
            if laberinto[r][c] == letra:
                res = (r, c)
            c = c + 1
        r = r + 1
    return res


inicio = posicion_de(LABERINTO, "S")
cafe = posicion_de(LABERINTO, "C")
print("simio en", inicio, "cafe en", cafe)
print("puede llegar:", puede_llegar(LABERINTO, inicio[0], inicio[1], cafe[0], cafe[1]))
d = distancias(LABERINTO, inicio[0], inicio[1])
print("pasos minimos:", d[cafe[0]][cafe[1]])
for fila in d:
    print(" ".join("%2d" % x for x in fila))
