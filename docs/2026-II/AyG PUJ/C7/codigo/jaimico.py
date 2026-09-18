# Jaimico y el cafe: la cuadricula como grafo implicito.
# M[i][j] = 0 si la celda esta libre, 1 donde esta Jaimico, 2 si es pared
# y 3 si es el cafe. Los vecinos de (r, c) se calculan con las tablas dr, dc.

from collections import deque

dr = [0, -1, 0, 1]
dc = [-1, 0, 1, 0]


def posicion_de(M, valor):
    # Fila y columna de la celda que contiene valor
    fila = -1
    col = -1
    i = 0
    while i < len(M):
        j = 0
        while j < len(M[i]):
            if M[i][j] == valor:
                fila = i
                col = j
            j = j + 1
        i = i + 1
    return (fila, col)


def tabla(n, m, valor):
    # n filas por m columnas, todas con valor
    t = []
    i = 0
    while i < n:
        t.append([valor] * m)
        i = i + 1
    return t


def dfsAuxIngenuo(rJ, cJ, rC, cC, M, vis):
    # Primer intento: un if por direccion
    vis[rJ][cJ] = True
    ans = rJ == rC and cJ == cC
    if not ans and rJ - 1 >= 0 and not vis[rJ - 1][cJ] and M[rJ - 1][cJ] != 2:
        ans = dfsAuxIngenuo(rJ - 1, cJ, rC, cC, M, vis)
    if not ans and rJ + 1 < len(M) and not vis[rJ + 1][cJ] and M[rJ + 1][cJ] != 2:
        ans = dfsAuxIngenuo(rJ + 1, cJ, rC, cC, M, vis)
    if not ans and cJ - 1 >= 0 and not vis[rJ][cJ - 1] and M[rJ][cJ - 1] != 2:
        ans = dfsAuxIngenuo(rJ, cJ - 1, rC, cC, M, vis)
    if not ans and cJ + 1 < len(M[rJ]) and not vis[rJ][cJ + 1] and M[rJ][cJ + 1] != 2:
        ans = dfsAuxIngenuo(rJ, cJ + 1, rC, cC, M, vis)
    return ans


def dfsAux(rJ, cJ, rC, cC, M, vis):
    # True si desde (rJ, cJ) se llega al cafe; se detiene al encontrarlo
    vis[rJ][cJ] = True
    ans = rJ == rC and cJ == cC
    i = 0
    while i < 4 and not ans:
        nr = rJ + dr[i]
        nc = cJ + dc[i]
        if nr >= 0 and nr < len(M) and nc >= 0 and nc < len(M[nr]):
            if not vis[nr][nc] and M[nr][nc] != 2:
                ans = dfsAux(nr, nc, rC, cC, M, vis)
        i = i + 1
    return ans


def dfs(M):
    # Puede Jaimico llegar al cafe?
    n = len(M)
    m = len(M[0])
    jaimico = posicion_de(M, 1)
    cafe = posicion_de(M, 3)
    vis = tabla(n, m, False)
    return dfsAux(jaimico[0], jaimico[1], cafe[0], cafe[1], M, vis)


def bfs(M):
    # Pasos minimos de Jaimico al cafe; -1 si no se llega
    n = len(M)
    m = len(M[0])
    jaimico = posicion_de(M, 1)
    cafe = posicion_de(M, 3)
    d = tabla(n, m, -1)
    d[jaimico[0]][jaimico[1]] = 0
    cola = deque()
    cola.append(jaimico)
    while len(cola) > 0:
        actual = cola.popleft()
        r = actual[0]
        c = actual[1]
        i = 0
        while i < 4:
            nr = r + dr[i]
            nc = c + dc[i]
            if nr >= 0 and nr < n and nc >= 0 and nc < m:
                if M[nr][nc] != 2 and d[nr][nc] == -1:
                    d[nr][nc] = d[r][c] + 1
                    cola.append((nr, nc))
            i = i + 1
    return d[cafe[0]][cafe[1]]


M = [
    [1, 0, 0, 2, 0, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 2, 0],
    [0, 2, 0, 0, 0, 2, 0, 0],
    [0, 2, 2, 2, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 2, 3],
]

if __name__ == "__main__":
    print("puede llegar:", dfs(M))
    print("pasos minimos:", bfs(M))
