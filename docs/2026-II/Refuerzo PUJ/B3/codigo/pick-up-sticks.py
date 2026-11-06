import sys

SIN_VISITAR = 0
EN_CAMINO = 1
TERMINADO = 2


def dfs(adj, color, orden, u):
    # Recorre lo que sale de u y devuelve si encontró un ciclo.
    hayCiclo = False
    color[u] = EN_CAMINO
    for v in adj[u]:
        if color[v] == EN_CAMINO:
            hayCiclo = True
        elif color[v] == SIN_VISITAR:
            if dfs(adj, color, orden, v):
                hayCiclo = True
    color[u] = TERMINADO
    orden.append(u)
    return hayCiclo


def main():
    sys.setrecursionlimit(1100000)
    datos = sys.stdin.buffer.read().split()
    pos = 0
    salida = []
    n = int(datos[pos])
    m = int(datos[pos + 1])
    pos = pos + 2
    while n != 0 or m != 0:
        adj = [[] for u in range(n + 1)]
        i = 0
        while i < m:
            adj[int(datos[pos])].append(int(datos[pos + 1]))
            pos = pos + 2
            i = i + 1
        color = [SIN_VISITAR] * (n + 1)
        orden = []
        hayCiclo = False
        u = 1
        while u <= n:
            if color[u] == SIN_VISITAR:
                if dfs(adj, color, orden, u):
                    hayCiclo = True
            u = u + 1
        if hayCiclo:
            salida.append('IMPOSSIBLE')
        else:
            orden.reverse()
            salida.append('\n'.join([str(u) for u in orden]))
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2
    print('\n'.join(salida))


main()
