# UVa 10305 - Ordering Tasks. Las tareas son los vertices y cada precedencia
# "i antes que j" es la arista (i, j); un orden de ejecucion es un orden
# topologico, y el enunciado acepta cualquiera. Kahn con cola, tal cual.

import sys
from collections import deque


def kahn(G):
    n = len(G)
    entrada = [0] * n
    u = 0
    while u < n:
        for v in G[u]:
            entrada[v] = entrada[v] + 1
        u = u + 1
    cola = deque()
    u = 0
    while u < n:
        if entrada[u] == 0:
            cola.append(u)
        u = u + 1
    orden = []
    while len(cola) > 0:
        u = cola.popleft()
        orden.append(u)
        for v in G[u]:
            entrada[v] = entrada[v] - 1
            if entrada[v] == 0:
                cola.append(v)
    return orden


def leer_grafo(datos, p, n, m):
    # Las m parejas desde datos[p]; devuelve (G, posicion siguiente)
    G = []
    u = 0
    while u < n:
        G.append([])
        u = u + 1
    k = 0
    while k < m:
        G[int(datos[p]) - 1].append(int(datos[p + 1]) - 1)
        p = p + 2
        k = k + 1
    return (G, p)


def leer_y_resolver(entrada):
    datos = entrada.read().split()
    p = 0
    salida = []
    n = int(datos[p])
    m = int(datos[p + 1])
    p = p + 2
    while n != 0 or m != 0:
        leido = leer_grafo(datos, p, n, m)
        G = leido[0]
        p = leido[1]
        linea = []
        for u in kahn(G):
            linea.append(str(u + 1))
        salida.append(" ".join(linea))
        n = int(datos[p])
        m = int(datos[p + 1])
        p = p + 2
    print("\n".join(salida))


if __name__ == "__main__":
    leer_y_resolver(sys.stdin)
