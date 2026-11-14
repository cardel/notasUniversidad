import sys


def pintar(adj, color, u, c, cuenta):
    # Pinta u con c, cuenta cuántos quedan de cada color y avisa si hubo choque.
    color[u] = c
    cuenta[c] = cuenta[c] + 1
    sin_choque = True
    for v in adj[u]:
        if color[v] == -1:
            if not pintar(adj, color, v, 1 - c, cuenta):
                sin_choque = False
        elif color[v] == c:
            sin_choque = False
    return sin_choque


def guardias(adj):
    # Suma, pedazo por pedazo, el color menos usado; -1 si un pedazo choca.
    color = [-1] * len(adj)
    total = 0
    posible = True
    for u in range(len(adj)):
        if color[u] == -1:
            cuenta = [0, 0]
            if not pintar(adj, color, u, 0, cuenta):
                posible = False
            elif cuenta[1] == 0:
                total = total + 1
            else:
                total = total + min(cuenta[0], cuenta[1])
    respuesta = -1
    if posible:
        respuesta = total
    return respuesta


def main():
    sys.setrecursionlimit(10000)
    datos = sys.stdin.read().split()
    pos = 0
    casos = int(datos[pos])
    pos = pos + 1
    salida = []
    caso = 0
    while caso < casos:
        v = int(datos[pos])
        e = int(datos[pos + 1])
        pos = pos + 2
        adj = [[] for _ in range(v)]
        i = 0
        while i < e:
            f = int(datos[pos])
            t = int(datos[pos + 1])
            pos = pos + 2
            adj[f].append(t)
            adj[t].append(f)
            i = i + 1
        salida.append(str(guardias(adj)))
        caso = caso + 1
    print('\n'.join(salida))


main()
