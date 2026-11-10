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


def bipartito(adj):
    # Un recorrido por cada pedazo del grafo.
    color = [-1] * len(adj)
    resultado = True
    for u in range(len(adj)):
        if color[u] == -1:
            if not pintar(adj, color, u, 0):
                resultado = False
    return resultado


def main():
    print(bipartito([[1, 3], [0, 2], [1, 3, 4], [0, 2], [2]]))
    print(bipartito([[1, 2], [0, 2], [0, 1]]))
    print(bipartito([[1], [0], [3, 4], [2, 4], [2, 3]]))


if __name__ == "__main__":
    main()
