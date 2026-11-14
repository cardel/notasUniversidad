import sys


def kahn(adj, entrada, n):
    # entrada[v] trae cuántas aristas llegan a v, contadas al leer.
    # Devuelve las tareas en el orden en que salen de la cola.
    cola = []
    for u in range(1, n + 1):
        if entrada[u] == 0:
            cola.append(u)
    frente = 0
    while frente < len(cola):
        u = cola[frente]
        frente = frente + 1
        for v in adj[u]:
            entrada[v] = entrada[v] - 1
            if entrada[v] == 0:
                cola.append(v)
    return cola


def main():
    datos = sys.stdin.read().split()
    pos = 0
    salida = []
    n = int(datos[pos])
    m = int(datos[pos + 1])
    pos = pos + 2
    while n != 0 or m != 0:
        adj = [[] for u in range(n + 1)]
        entrada = [0] * (n + 1)
        i = 0
        while i < m:
            a = int(datos[pos])
            b = int(datos[pos + 1])
            adj[a].append(b)
            entrada[b] = entrada[b] + 1
            pos = pos + 2
            i = i + 1
        orden = kahn(adj, entrada, n)
        salida.append(' '.join([str(u) for u in orden]))
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2
    print('\n'.join(salida))


main()
