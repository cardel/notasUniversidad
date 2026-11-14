import sys


def pintar(adj, color, u, c):
    # Pinta u con c y sigue; devuelve si no hubo choque.
    color[u] = c
    sin_choque = True
    for v in adj[u]:
        if color[v] == -1:
            if not pintar(adj, color, v, 1 - c):
                sin_choque = False
        elif color[v] == c:
            sin_choque = False
    return sin_choque


def main():
    datos = sys.stdin.read().split()
    pos = 0
    salida = []
    n = int(datos[pos])
    pos = pos + 1
    while n != 0:
        l = int(datos[pos])
        pos = pos + 1
        adj = [[] for _ in range(n)]
        i = 0
        while i < l:
            a = int(datos[pos])
            b = int(datos[pos + 1])
            pos = pos + 2
            adj[a].append(b)
            adj[b].append(a)
            i = i + 1
        color = [-1] * n
        # el grafo es conexo: basta arrancar desde 0
        if pintar(adj, color, 0, 0):
            salida.append('BICOLORABLE.')
        else:
            salida.append('NOT BICOLORABLE.')
        n = int(datos[pos])
        pos = pos + 1
    print('\n'.join(salida))


main()
