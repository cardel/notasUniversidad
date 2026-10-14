# Caminos mas cortos desde una fuente en un grafo sin pesos, con la
# busqueda en amplitud (CLRS, Seccion 22.2). d[v] es el numero de aristas
# del camino mas corto de s a v y pi[v] el vertice anterior en ese camino.
# d[v] == -1 hace las veces de infinito: v no se ha alcanzado.
from collections import deque

# El grafo de la seccion: no dirigido, seis vertices.
ARISTAS = [(0, 1), (0, 2), (1, 3), (2, 3), (2, 4), (3, 5), (4, 5)]


def construir(n, aristas):
    # Listas de adyacencia de un grafo no dirigido con vertices 0..n-1.
    G = []
    for u in range(n):
        G.append([])
    for (u, v) in aristas:
        G[u].append(v)
        G[v].append(u)
    return G


def bfs(G, s):
    # d[v]: aristas de s a v; pi[v]: el anterior en el camino.
    n = len(G)
    d = [-1] * n
    pi = [-1] * n
    d[s] = 0
    cola = deque()
    cola.append(s)
    while len(cola) > 0:
        u = cola.popleft()
        for v in G[u]:
            if d[v] == -1:
                d[v] = d[u] + 1
                pi[v] = u
                cola.append(v)
    return (d, pi)


def camino(pi, s, v):
    # Sube por pi desde v y voltea la lista; [] si no se llega.
    ruta = []
    x = v
    while x != -1:
        ruta.append(x)
        x = pi[x]
    ruta.reverse()
    if ruta[0] != s:
        ruta = []
    return ruta


# ---------------------------------------------------------------------
# Comprobacion contra fuerza bruta

def distancias_bruto(G, s):
    # Floyd sobre pesos unitarios: relajar todos los pares n veces.
    n = len(G)
    INF = n + 1
    D = []
    for i in range(n):
        D.append([INF] * n)
        D[i][i] = 0
        for j in G[i]:
            D[i][j] = 1
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if D[i][k] + D[k][j] < D[i][j]:
                    D[i][j] = D[i][k] + D[k][j]
    d = []
    for v in range(n):
        if D[s][v] >= INF:
            d.append(-1)
        else:
            d.append(D[s][v])
    return d


def grafo_aleatorio(n, m, semilla, dirigido):
    import random
    random.seed(semilla)
    G = []
    for u in range(n):
        G.append([])
    for _ in range(m):
        a = random.randrange(n)
        b = random.randrange(n)
        if a != b and b not in G[a]:
            G[a].append(b)
            if not dirigido:
                G[b].append(a)
    return G


def revisar(G, s):
    # Cuenta los fallos de bfs y camino sobre G desde s.
    fallos = 0
    d, pi = bfs(G, s)
    if d != distancias_bruto(G, s):
        fallos = fallos + 1
    for v in range(len(G)):
        ruta = camino(pi, s, v)
        if d[v] == -1:
            if ruta != []:
                fallos = fallos + 1
        else:
            if len(ruta) != d[v] + 1 or ruta[0] != s or ruta[-1] != v:
                fallos = fallos + 1
            for i in range(len(ruta) - 1):
                if ruta[i + 1] not in G[ruta[i]]:
                    fallos = fallos + 1
    return fallos


if __name__ == "__main__":
    G = construir(6, ARISTAS)
    d, pi = bfs(G, 0)
    print("d: ", d)
    print("pi:", pi)
    print("camino de 0 a 5:", camino(pi, 0, 5))

    fallos = 0
    for semilla in range(300):
        n = 1 + semilla % 8
        m = semilla % 16
        G = grafo_aleatorio(n, m, semilla, semilla % 2 == 0)
        fallos = fallos + revisar(G, semilla % n)
    print("grafos probados: 300 | fallos:", fallos)
