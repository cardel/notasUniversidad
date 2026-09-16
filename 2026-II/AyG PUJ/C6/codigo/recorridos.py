# Recorridos en profundidad y en amplitud sobre lista de adyacencia.
# Los vecinos de cada vertice van en orden creciente, de modo que la traza
# del recorrido siempre sale igual.

from collections import deque


# G1: no dirigido, siete vertices. El vertice 6 esta aislado.
G1 = [[1, 4, 5],
      [0, 2, 3, 4],
      [1, 5],
      [1],
      [0, 1],
      [0, 2],
      []]

# G2: dirigido, siete vertices. Al 6 no se llega desde ningun otro.
G2 = [[1, 2],
      [3],
      [1, 4],
      [5],
      [3, 5],
      [],
      [2]]


def dfs(G, u, visitado, orden):
    # Marca u, lo anota y sigue por el primer vecino que falte
    visitado[u] = True
    orden.append(u)
    for v in G[u]:
        if not visitado[v]:
            dfs(G, v, visitado, orden)


def dfs_desde(G, inicio):
    # Los vertices alcanzables desde inicio, en el orden en que se visitan
    visitado = [False] * len(G)
    orden = []
    dfs(G, inicio, visitado, orden)
    return orden


def dfs_completo(G):
    # Recorre el grafo entero: al agotar lo alcanzable, arranca en el
    # primer vertice que siga sin visitar
    n = len(G)
    visitado = [False] * n
    orden = []
    u = 0
    while u < n:
        if not visitado[u]:
            dfs(G, u, visitado, orden)
        u = u + 1
    return orden


def dfs_con_pila(G, inicio):
    # La misma idea sin recursion: la pila guarda lo que falta por mirar
    visitado = [False] * len(G)
    orden = []
    pila = [inicio]
    while len(pila) > 0:
        u = pila.pop()
        if not visitado[u]:
            visitado[u] = True
            orden.append(u)
            i = len(G[u]) - 1
            while i >= 0:
                if not visitado[G[u][i]]:
                    pila.append(G[u][i])
                i = i - 1
    return orden


def bfs(G, inicio):
    # Visita por niveles: primero los vecinos de inicio, despues los
    # vecinos de esos. distancia[v] == -1 significa que v no se ha visto
    n = len(G)
    distancia = [-1] * n
    padre = [-1] * n
    orden = []
    distancia[inicio] = 0
    cola = deque()
    cola.append(inicio)
    while len(cola) > 0:
        u = cola.popleft()
        orden.append(u)
        for v in G[u]:
            if distancia[v] == -1:
                distancia[v] = distancia[u] + 1
                padre[v] = u
                cola.append(v)
    return (orden, distancia, padre)


def camino_hasta(padre, inicio, destino):
    # Reconstruye el camino subiendo por los padres desde destino
    camino = []
    v = destino
    while v != -1:
        camino.append(v)
        v = padre[v]
    camino.reverse()
    if len(camino) == 0 or camino[0] != inicio:
        camino = []
    return camino


print("G1 sin dirigir")
print("  dfs_desde(G1, 0):  ", dfs_desde(G1, 0))
print("  dfs_con_pila(G1,0):", dfs_con_pila(G1, 0))
print("  dfs_completo(G1):  ", dfs_completo(G1))
r1 = bfs(G1, 0)
print("  bfs(G1, 0) orden:  ", r1[0])
print("  bfs(G1, 0) dist:   ", r1[1])
print("  camino 0 -> 3:     ", camino_hasta(r1[2], 0, 3))

print("G2 dirigido")
print("  dfs_desde(G2, 0):  ", dfs_desde(G2, 0))
print("  dfs_completo(G2):  ", dfs_completo(G2))
r2 = bfs(G2, 0)
print("  bfs(G2, 0) orden:  ", r2[0])
print("  bfs(G2, 0) dist:   ", r2[1])
