# UVa 10765 - Doves and Bombs
# https://onlinejudge.org/external/107/10765.pdf
#
# El valor paloma de una estacion es en cuantos componentes queda la red al
# quitarla: uno por cada subarbol que se desprende, mas el pedazo que se
# queda con el padre. La raiz no tiene padre, asi que su valor es el numero
# de hijos. Con n hasta 10000 la recursion pasa el limite de Python, asi que
# el envio usa la version de pila explicita.

from sys import stdin


def construir(vertices, aristas):
    # G[u] guarda parejas (vecino, id de la arista).
    G = {}
    for u in vertices:
        G[u] = []
    for i in range(len(aristas)):
        a, b = aristas[i]
        G[a].append((b, i))
        G[b].append((a, i))
    return G


def descubrir(u, reloj, d, low):
    reloj[0] = reloj[0] + 1
    d[u] = reloj[0]
    low[u] = reloj[0]


def paloma_aux(G, u, entrada, raiz, reloj, d, low, valor):
    descubrir(u, reloj, d, low)
    if u == raiz:
        valor[u] = 0
    for v, i in G[u]:
        if d[v] == 0:
            paloma_aux(G, v, i, raiz, reloj, d, low, valor)
            low[u] = min(low[u], low[v])
            if low[v] >= d[u] or u == raiz:
                valor[u] = valor[u] + 1
        elif i != entrada:
            low[u] = min(low[u], d[v])


def valores_paloma(G):
    d = {}
    low = {}
    valor = {}
    for u in G:
        d[u] = 0
        low[u] = 0
        valor[u] = 1
    reloj = [0]
    for s in G:
        if d[s] == 0:
            paloma_aux(G, s, -1, s, reloj, d, low, valor)
    return valor


def paloma_desde(G, s, reloj, d, low, valor):
    descubrir(s, reloj, d, low)
    valor[s] = 0
    llamadas = [[s, -1, 0]]
    while len(llamadas) > 0:
        u, entrada, k = llamadas[-1]
        if k < len(G[u]):
            llamadas[-1][2] = k + 1
            v, i = G[u][k]
            if d[v] == 0:
                descubrir(v, reloj, d, low)
                llamadas.append([v, i, 0])
            elif i != entrada:
                low[u] = min(low[u], d[v])
        else:
            llamadas.pop()
            if len(llamadas) > 0:
                p = llamadas[-1][0]
                low[p] = min(low[p], low[u])
                if low[u] >= d[p] or p == s:
                    valor[p] = valor[p] + 1


def valores_paloma_con_pila(G):
    d = {}
    low = {}
    valor = {}
    for u in G:
        d[u] = 0
        low[u] = 0
        valor[u] = 1
    reloj = [0]
    for s in G:
        if d[s] == 0:
            paloma_desde(G, s, reloj, d, low, valor)
    return valor


def mejores(valor, m):
    # Valor decreciente y, a igual valor, numero creciente.
    pares = []
    for v in valor:
        pares.append((-valor[v], v))
    pares.sort()
    lineas = []
    for k in range(m):
        peso, v = pares[k]
        lineas.append(str(v) + " " + str(-peso))
    return lineas


def leer_pareja(datos, pos):
    # Los dos enteros desde pos, y la posicion siguiente.
    return int(datos[pos]), int(datos[pos + 1]), pos + 2


def main():
    datos = stdin.read().split()
    bloques = []
    n, m, pos = leer_pareja(datos, 0)
    while n != 0 or m != 0:
        aristas = []
        a, b, pos = leer_pareja(datos, pos)
        while a != -1 or b != -1:
            aristas.append((a, b))
            a, b, pos = leer_pareja(datos, pos)
        G = construir(range(n), aristas)
        bloques.append("\n".join(mejores(valores_paloma_con_pila(G), m)))
        n, m, pos = leer_pareja(datos, pos)
    for bloque in bloques:
        print(bloque)
        print()


main()
