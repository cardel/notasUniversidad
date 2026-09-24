# Componentes conexos de un grafo no dirigido. La busqueda en
# profundidad va en sus dos formas, la recursiva y la de pila
# explicita, y despues la busqueda en amplitud.


def cc_dfs_aux(grafo, v, visitado, actual):
    # Marca v, lo agrega al componente y baja por sus vecinos.
    actual.append(v)
    visitado[v] = True
    for u in grafo[v]:
        if not visitado[u]:
            cc_dfs_aux(grafo, u, visitado, actual)


def componentes_conexos(grafo):
    # grafo: dict que asocia cada vertice a la lista de vecinos.
    # Devuelve los componentes, cada uno como lista de vertices.
    n = len(grafo)
    visitado = [False] * n
    componentes = []
    for v in grafo:
        if not visitado[v]:
            actual = []
            cc_dfs_aux(grafo, v, visitado, actual)
            componentes.append(actual)
    return componentes


def cc_dfs_aux_con_pila(grafo, v, visitado, actual):
    # Lo pendiente queda en una lista, no en la pila de llamadas.
    pila = [v]
    visitado[v] = True
    while len(pila) > 0:
        w = pila.pop()
        actual.append(w)
        for u in grafo[w]:
            if not visitado[u]:
                visitado[u] = True
                pila.append(u)


def componentes_conexos_con_pila(grafo):
    # Mismo reparto de vertices que la version recursiva.
    n = len(grafo)
    visitado = [False] * n
    componentes = []
    for v in grafo:
        if not visitado[v]:
            actual = []
            cc_dfs_aux_con_pila(grafo, v, visitado, actual)
            componentes.append(actual)
    return componentes


def cc_bfs_aux(grafo, v, visitado, actual):
    # La cola es una lista con un puntero de cabeza que avanza.
    cola = [v]
    cabeza = 0
    visitado[v] = True
    actual.append(v)
    while cabeza < len(cola):
        w = cola[cabeza]
        cabeza = cabeza + 1
        for u in grafo[w]:
            if not visitado[u]:
                cola.append(u)
                visitado[u] = True
                actual.append(u)


def componentes_conexos_bfs(grafo):
    n = len(grafo)
    visitado = [False] * n
    componentes = []
    for v in grafo:
        if not visitado[v]:
            actual = []
            cc_bfs_aux(grafo, v, visitado, actual)
            componentes.append(actual)
    return componentes


if __name__ == "__main__":
    # Grafo no dirigido de ocho vertices con tres componentes.
    grafo = {
        0: [1, 2],
        1: [0, 2],
        2: [0, 1],
        3: [4],
        4: [3],
        5: [6, 7],
        6: [5, 7],
        7: [5, 6],
    }
    print("recursiva =", componentes_conexos(grafo),
          "esperado", [[0, 1, 2], [3, 4], [5, 6, 7]])
    print("con pila  =", componentes_conexos_con_pila(grafo),
          "esperado", [[0, 2, 1], [3, 4], [5, 7, 6]])
    print("amplitud  =", componentes_conexos_bfs(grafo),
          "esperado", [[0, 1, 2], [3, 4], [5, 6, 7]])

    # Dos triangulos unidos por una arista: un solo componente.
    puente = {
        0: [1, 2],
        1: [0, 2],
        2: [0, 1, 3],
        3: [2, 4, 5],
        4: [3, 5],
        5: [3, 4],
    }
    print("dos triangulos =", componentes_conexos(puente),
          "esperado", [[0, 1, 2, 3, 4, 5]])
