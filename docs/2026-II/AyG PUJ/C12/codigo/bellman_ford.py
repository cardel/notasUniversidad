# Caminos mas cortos desde una fuente con pesos que pueden ser negativos
# (CLRS, Capitulo 24). G[u] es la lista de parejas (v, w): una arista de u
# a v con peso w. Los vertices son 0..n-1.
# Tres versiones de Bellman-Ford: la ingenua, que relaja |V|-1 rondas
# completas; la que para cuando una ronda no cambia nada; y la de Moore,
# que solo relaja las aristas de los vertices cuya distancia cambio.
from collections import deque

INF = float('inf')

# El grafo de la traza: la arista 2 -> 1 es negativa y no hay ciclo
# negativo. El ciclo 2 -> 1 -> 3 -> 4 -> 2 pesa -2 + 3 + 2 + 1 = 4.
ARISTAS = [(0, 1, 4), (0, 2, 5), (1, 3, 3), (2, 1, -2), (2, 4, 6),
           (3, 4, 2), (4, 2, 1)]

# El mismo grafo con 4 -> 2 de peso -4: el ciclo pasa a pesar -1.
ARISTAS_CICLO = [(0, 1, 4), (0, 2, 5), (1, 3, 3), (2, 1, -2), (2, 4, 6),
                 (3, 4, 2), (4, 2, -4)]


def construir(n, aristas):
    # Listas de adyacencia de un grafo dirigido con pesos.
    G = []
    for u in range(n):
        G.append([])
    for (u, v, w) in aristas:
        G[u].append((v, w))
    return G


def inicializar(n, s):
    # INITIALIZE-SINGLE-SOURCE: infinito salvo en la fuente.
    d = [INF] * n
    pi = [-1] * n
    d[s] = 0
    return (d, pi)


def relajar(u, v, w, d, pi):
    # RELAX; devuelve True si d[v] cambio.
    cambio = False
    if d[u] + w < d[v]:
        d[v] = d[u] + w
        pi[v] = u
        cambio = True
    return cambio


def hay_arista_tensa(G, d):
    # Una arista tensa despues de las rondas delata un ciclo
    # negativo alcanzable desde la fuente.
    tensa = False
    for u in range(len(G)):
        for (v, w) in G[u]:
            if d[u] + w < d[v]:
                tensa = True
    return tensa


def bellman_ford_ingenuo(G, s):
    # |V|-1 rondas completas, pase lo que pase.
    n = len(G)
    d, pi = inicializar(n, s)
    ronda = 1
    while ronda <= n - 1:
        for u in range(n):
            for (v, w) in G[u]:
                relajar(u, v, w, d, pi)
        ronda = ronda + 1
    sin_ciclo = not hay_arista_tensa(G, d)
    return (d, pi, sin_ciclo)


def bellman_ford(G, s):
    # Si una ronda no cambia nada, las siguientes tampoco.
    n = len(G)
    d, pi = inicializar(n, s)
    ronda = 1
    hubo_cambio = True
    while ronda <= n - 1 and hubo_cambio:
        hubo_cambio = False
        for u in range(n):
            for (v, w) in G[u]:
                if relajar(u, v, w, d, pi):
                    hubo_cambio = True
        ronda = ronda + 1
    sin_ciclo = not hay_arista_tensa(G, d)
    return (d, pi, sin_ciclo)


def bellman_ford_moore(G, s):
    # Solo se relajan las aristas de los vertices cuya d cambio.
    # veces[v]: cuantas veces ha entrado v a la cola.
    n = len(G)
    d, pi = inicializar(n, s)
    en_cola = [False] * n
    veces = [0] * n
    cola = deque()
    cola.append(s)
    en_cola[s] = True
    veces[s] = 1
    sin_ciclo = True
    while len(cola) > 0 and sin_ciclo:
        u = cola.popleft()
        en_cola[u] = False
        for (v, w) in G[u]:
            if relajar(u, v, w, d, pi) and not en_cola[v]:
                cola.append(v)
                en_cola[v] = True
                veces[v] = veces[v] + 1
                if veces[v] >= n:
                    sin_ciclo = False
    return (d, pi, sin_ciclo)


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
# Conteo de relajaciones para comparar las versiones sobre un grafo

def contar_relajaciones(G, s):
    # Cuantas veces se examina una arista en cada version, sin contar la
    # pasada final de deteccion.
    n = len(G)
    m = 0
    for u in range(n):
        m = m + len(G[u])
    ingenuo = (n - 1) * m
    d, pi = inicializar(n, s)
    rondas = 0
    hubo_cambio = True
    while rondas < n - 1 and hubo_cambio:
        hubo_cambio = False
        for u in range(n):
            for (v, w) in G[u]:
                if relajar(u, v, w, d, pi):
                    hubo_cambio = True
        rondas = rondas + 1
    temprano = rondas * m
    d, pi = inicializar(n, s)
    en_cola = [False] * n
    cola = deque()
    cola.append(s)
    en_cola[s] = True
    moore = 0
    while len(cola) > 0:
        u = cola.popleft()
        en_cola[u] = False
        moore = moore + len(G[u])
        for (v, w) in G[u]:
            if relajar(u, v, w, d, pi) and not en_cola[v]:
                cola.append(v)
                en_cola[v] = True
    return (ingenuo, rondas, temprano, moore)


# ---------------------------------------------------------------------
# Comprobacion contra fuerza bruta

def alcanzables(G, s):
    vistos = [False] * len(G)
    vistos[s] = True
    pila = [s]
    while len(pila) > 0:
        u = pila.pop()
        for (v, w) in G[u]:
            if not vistos[v]:
                vistos[v] = True
                pila.append(v)
    return vistos


def ciclo_negativo_bruto(G, s):
    # Enumera los ciclos simples que pasan por cada vertice alcanzable.
    vistos = alcanzables(G, s)
    n = len(G)
    hallado = [False]

    def extender(inicio, u, peso, en_ruta):
        for (v, w) in G[u]:
            if v == inicio and peso + w < 0:
                hallado[0] = True
            elif not en_ruta[v]:
                en_ruta[v] = True
                extender(inicio, v, peso + w, en_ruta)
                en_ruta[v] = False

    for x in range(n):
        if vistos[x]:
            en_ruta = [False] * n
            en_ruta[x] = True
            extender(x, x, 0, en_ruta)
    return hallado[0]


def distancias_bruto(G, s):
    # Sin ciclos negativos, delta(s, v) es el minimo sobre los caminos
    # simples de s a v: se enumeran todos.
    n = len(G)
    delta = [INF] * n
    delta[s] = 0
    en_ruta = [False] * n
    en_ruta[s] = True

    def extender(u, peso):
        for (v, w) in G[u]:
            if not en_ruta[v]:
                if peso + w < delta[v]:
                    delta[v] = peso + w
                en_ruta[v] = True
                extender(v, peso + w)
                en_ruta[v] = False

    extender(s, 0)
    return delta


def peso_de(G, u, v):
    p = None
    for (x, w) in G[u]:
        if x == v:
            p = w
    return p


def revisar(G, s, version):
    # Cuenta los fallos de una version sobre G desde s.
    fallos = 0
    hay_ciclo = ciclo_negativo_bruto(G, s)
    d, pi, sin_ciclo = version(G, s)
    if sin_ciclo == hay_ciclo:
        fallos = fallos + 1
    elif not hay_ciclo:
        if d != distancias_bruto(G, s):
            fallos = fallos + 1
        for v in range(len(G)):
            ruta = camino(pi, s, v)
            if d[v] == INF and ruta != []:
                fallos = fallos + 1
            if d[v] != INF:
                total = 0
                for i in range(len(ruta) - 1):
                    total = total + peso_de(G, ruta[i], ruta[i + 1])
                if ruta == [] or total != d[v]:
                    fallos = fallos + 1
    return fallos


def grafo_aleatorio(n, m, semilla):
    import random
    random.seed(semilla)
    G = []
    for u in range(n):
        G.append([])
    for _ in range(m):
        a = random.randrange(n)
        b = random.randrange(n)
        w = random.randint(-4, 9)
        if peso_de(G, a, b) is None:
            G[a].append((b, w))
    return G


if __name__ == "__main__":
    G = construir(5, ARISTAS)
    for version in [bellman_ford_ingenuo, bellman_ford, bellman_ford_moore]:
        d, pi, sin_ciclo = version(G, 0)
        print(version.__name__, "d:", d, "pi:", pi, "sin ciclo:", sin_ciclo)
    print("camino de 0 a 4:", camino(pi, 0, 4))
    print("examenes de arista (ingenuo, rondas, temprano, moore):",
          contar_relajaciones(G, 0))
    H = construir(5, ARISTAS_CICLO)
    for version in [bellman_ford_ingenuo, bellman_ford, bellman_ford_moore]:
        d, pi, sin_ciclo = version(H, 0)
        print(version.__name__, "con ciclo -> sin ciclo:", sin_ciclo)

    fallos = 0
    con_ciclo = 0
    for semilla in range(300):
        n = 1 + semilla % 7
        m = semilla % 18
        G = grafo_aleatorio(n, m, semilla)
        s = semilla % n
        if ciclo_negativo_bruto(G, s):
            con_ciclo = con_ciclo + 1
        for version in [bellman_ford_ingenuo, bellman_ford, bellman_ford_moore]:
            fallos = fallos + revisar(G, s, version)
    print("grafos probados: 300 | con ciclo negativo:", con_ciclo,
          "| fallos:", fallos)
