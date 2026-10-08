# UVa 610 - Street Directions
# https://onlinejudge.org/external/6/610.pdf
#
# Se orienta cada calle para que la ciudad quede fuertemente conexa. La
# profundidad orienta las aristas de arbol del padre al hijo y las de
# retroceso del descendiente al ancestro; cada puente queda en doble via,
# porque una calle que al quitarla desconecta la ciudad no se puede orientar.
# Con n hasta 1000 la recursion llega al limite de Python, asi que el envio
# usa la version de pila explicita.

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


def orientar_aux(G, u, entrada, reloj, d, low, salida):
    descubrir(u, reloj, d, low)
    for v, i in G[u]:
        if d[v] == 0:
            salida.append((u, v))
            orientar_aux(G, v, i, reloj, d, low, salida)
            low[u] = min(low[u], low[v])
            if low[v] > d[u]:
                salida.append((v, u))
        elif i != entrada and d[v] < d[u]:
            salida.append((u, v))
            low[u] = min(low[u], d[v])


def orientar(G):
    d = {}
    low = {}
    for u in G:
        d[u] = 0
        low[u] = 0
    reloj = [0]
    salida = []
    for s in G:
        if d[s] == 0:
            orientar_aux(G, s, -1, reloj, d, low, salida)
    return salida


def orientar_desde(G, s, reloj, d, low, salida):
    descubrir(s, reloj, d, low)
    llamadas = [[s, -1, 0]]
    while len(llamadas) > 0:
        u, entrada, k = llamadas[-1]
        if k < len(G[u]):
            llamadas[-1][2] = k + 1
            v, i = G[u][k]
            if d[v] == 0:
                salida.append((u, v))
                descubrir(v, reloj, d, low)
                llamadas.append([v, i, 0])
            elif i != entrada and d[v] < d[u]:
                salida.append((u, v))
                low[u] = min(low[u], d[v])
        else:
            llamadas.pop()
            if len(llamadas) > 0:
                p = llamadas[-1][0]
                low[p] = min(low[p], low[u])
                if low[u] > d[p]:
                    salida.append((u, p))


def orientar_con_pila(G):
    d = {}
    low = {}
    for u in G:
        d[u] = 0
        low[u] = 0
    reloj = [0]
    salida = []
    for s in G:
        if d[s] == 0:
            orientar_desde(G, s, reloj, d, low, salida)
    return salida


def leer_pareja(datos, pos):
    # Los dos enteros desde pos, y la posicion siguiente.
    return int(datos[pos]), int(datos[pos + 1]), pos + 2


def main():
    datos = stdin.read().split()
    lineas = []
    caso = 1
    n, m, pos = leer_pareja(datos, 0)
    while n != 0 or m != 0:
        aristas = []
        for _ in range(m):
            a, b, pos = leer_pareja(datos, pos)
            aristas.append((a, b))
        G = construir(range(1, n + 1), aristas)
        lineas.append(str(caso))
        lineas.append("")
        for u, v in orientar_con_pila(G):
            lineas.append(str(u) + " " + str(v))
        lineas.append("#")
        caso = caso + 1
        n, m, pos = leer_pareja(datos, pos)
    print("\n".join(lineas))


main()
