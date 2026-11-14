from collections import deque


def grados_de_entrada(adj):
    # Cuantas aristas llegan a cada nodo.
    grado = [0] * len(adj)
    for u in range(len(adj)):
        for v in adj[u]:
            grado[v] = grado[v] + 1
    return grado


def sin_salir(salio):
    # Los nodos que la cola nunca entrego.
    quedan = []
    for u in range(len(salio)):
        if not salio[u]:
            quedan.append(u)
    return quedan


def cola_de_ceros(grado):
    # Los que no tienen aristas que les lleguen.
    cola = deque()
    for u in range(len(grado)):
        if grado[u] == 0:
            cola.append(u)
    return cola


def tiene_ciclo_kahn(adj):
    # Devuelve si hay ciclo y los nodos que nunca salen de la cola.
    grado = grados_de_entrada(adj)
    cola = cola_de_ceros(grado)
    salio = [False] * len(adj)
    while len(cola) > 0:
        u = cola.popleft()
        salio[u] = True
        for v in adj[u]:
            grado[v] = grado[v] - 1
            if grado[v] == 0:
                cola.append(v)
    quedan = sin_salir(salio)
    resultado = (len(quedan) > 0, quedan)
    return resultado


def main():
    g1 = [[1, 2], [2], [0], [1, 4], []]
    sin_2_0 = [[1, 2], [2], [], [1, 4], []]
    print(grados_de_entrada(g1))
    print(tiene_ciclo_kahn(g1))
    print(tiene_ciclo_kahn(sin_2_0))


if __name__ == "__main__":
    main()
