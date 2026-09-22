# Orden topologico de un grafo dirigido con el algoritmo de Kahn, en la
# version que busca la fuente cada vez y en la que las guarda en una cola.
# Al final, las dos variantes que cambian la cola por una pila y por una
# cola de prioridad, y una comprobacion de todo contra fuerza bruta.

from collections import deque
import heapq


# Materias con sus prerrequisitos. Los numeros son los de la clase:
# 0 Arboles y grafos, 1 Programacion, 2 Matematicas discretas,
# 3 Estructuras de datos, 4 Analisis de algoritmos, 5 Logica, 6 Bases de datos
MATERIAS = [[4],      # Arboles y grafos -> Analisis de algoritmos
            [3],      # Programacion -> Estructuras de datos
            [0],      # Matematicas discretas -> Arboles y grafos
            [0, 6],   # Estructuras de datos -> Arboles y grafos, Bases de datos
            [],
            [2],      # Logica -> Matematicas discretas
            []]

# Las mismas materias con un prerrequisito de mas: Analisis de algoritmos
# antes de Estructuras de datos. Eso cierra un ciclo 3 -> 0 -> 4 -> 3.
MATERIAS_CON_CICLO = [[4], [3], [0], [0, 6], [3], [2], []]


def grados_de_entrada(G):
    # entrada[v]: cuantas aristas llegan a v
    n = len(G)
    entrada = [0] * n
    u = 0
    while u < n:
        for v in G[u]:
            entrada[v] = entrada[v] + 1
        u = u + 1
    return entrada


def fuente_pendiente(entrada, emitido):
    # El primer vertice sin emitir con contador 0, o -1
    n = len(entrada)
    resultado = -1
    u = 0
    while u < n and resultado == -1:
        if not emitido[u] and entrada[u] == 0:
            resultado = u
        u = u + 1
    return resultado


def kahn_ingenuo(G):
    # Cada vuelta busca una fuente desde el principio de la lista
    n = len(G)
    entrada = grados_de_entrada(G)
    emitido = [False] * n
    orden = []
    u = fuente_pendiente(entrada, emitido)
    while u != -1:
        orden.append(u)
        emitido[u] = True
        for v in G[u]:
            entrada[v] = entrada[v] - 1
        u = fuente_pendiente(entrada, emitido)
    return orden


def kahn(G):
    # Las fuentes esperan en una cola
    n = len(G)
    entrada = grados_de_entrada(G)
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


def tiene_ciclo(G):
    # Kahn emite todos los vertices exactamente cuando no hay ciclos
    return len(kahn(G)) < len(G)


def kahn_con_pila(G):
    # La misma idea con una pila: la ultima fuente que aparece es la que sale
    n = len(G)
    entrada = grados_de_entrada(G)
    pila = []
    u = 0
    while u < n:
        if entrada[u] == 0:
            pila.append(u)
        u = u + 1
    orden = []
    while len(pila) > 0:
        u = pila.pop()
        orden.append(u)
        for v in G[u]:
            entrada[v] = entrada[v] - 1
            if entrada[v] == 0:
                pila.append(v)
    return orden


def kahn_menor(G):
    # Entre las fuentes disponibles sale siempre la de numero mas bajo:
    # el orden topologico menor en orden lexicografico
    n = len(G)
    entrada = grados_de_entrada(G)
    fuentes = []
    u = 0
    while u < n:
        if entrada[u] == 0:
            heapq.heappush(fuentes, u)
        u = u + 1
    orden = []
    while len(fuentes) > 0:
        u = heapq.heappop(fuentes)
        orden.append(u)
        for v in G[u]:
            entrada[v] = entrada[v] - 1
            if entrada[v] == 0:
                heapq.heappush(fuentes, v)
    return orden


# ---- comprobacion ----

def es_orden_topologico(G, orden):
    # Todos los vertices una vez y, para cada arista (u, v), u antes que v
    n = len(G)
    posicion = [-1] * n
    i = 0
    while i < len(orden):
        posicion[orden[i]] = i
        i = i + 1
    bien = len(orden) == n and min(posicion) >= 0
    u = 0
    while u < n and bien:
        for v in G[u]:
            if posicion[u] > posicion[v]:
                bien = False
        u = u + 1
    return bien


def alcanza(G, s, t):
    # True si hay camino de s a t con al menos una arista
    n = len(G)
    visitado = [False] * n
    pila = [s]
    encontrado = False
    while len(pila) > 0 and not encontrado:
        u = pila.pop()
        for v in G[u]:
            if v == t:
                encontrado = True
            elif not visitado[v]:
                visitado[v] = True
                pila.append(v)
    return encontrado


def tiene_ciclo_bruto(G):
    # Hay ciclo si algun vertice se alcanza a si mismo
    n = len(G)
    hay = False
    u = 0
    while u < n:
        if alcanza(G, u, u):
            hay = True
        u = u + 1
    return hay


def ordenes_validos(G):
    # Todas las permutaciones que son orden topologico (solo para n chico)
    n = len(G)
    resultado = []

    def extender(prefijo, usado):
        if len(prefijo) == n:
            resultado.append(list(prefijo))
        else:
            u = 0
            while u < n:
                if not usado[u]:
                    usado[u] = True
                    prefijo.append(u)
                    if es_prefijo_valido(G, prefijo):
                        extender(prefijo, usado)
                    prefijo.pop()
                    usado[u] = False
                u = u + 1

    extender([], [False] * n)
    return resultado


def es_prefijo_valido(G, prefijo):
    # Ningun vertice del prefijo tiene un predecesor fuera del prefijo
    dentro = set(prefijo)
    bien = True
    u = 0
    while u < len(G):
        for v in G[u]:
            if v in dentro and u not in dentro:
                bien = False
        u = u + 1
    return bien


def grafo_aleatorio(n, m, semilla):
    # Grafo dirigido con m aristas sin repetir; puede traer ciclos
    import random
    random.seed(semilla)
    G = []
    i = 0
    while i < n:
        G.append([])
        i = i + 1
    puestas = set()
    while len(puestas) < m:
        u = random.randrange(n)
        v = random.randrange(n)
        if u != v and (u, v) not in puestas:
            puestas.add((u, v))
            G[u].append(v)
    return G


if __name__ == "__main__":
    nombres = ["AyG", "Prog", "MD", "ED", "AA", "Log", "BD"]

    def con_nombres(orden):
        return " ".join([nombres[u] for u in orden])

    print("grados de entrada:", grados_de_entrada(MATERIAS))
    print("kahn ingenuo:     ", kahn_ingenuo(MATERIAS), con_nombres(kahn_ingenuo(MATERIAS)))
    print("kahn con cola:    ", kahn(MATERIAS), con_nombres(kahn(MATERIAS)))
    print("kahn con pila:    ", kahn_con_pila(MATERIAS), con_nombres(kahn_con_pila(MATERIAS)))
    print("kahn menor:       ", kahn_menor(MATERIAS), con_nombres(kahn_menor(MATERIAS)))
    print("ordenes validos en total:", len(ordenes_validos(MATERIAS)))
    print("menor de todos:   ", ordenes_validos(MATERIAS)[0])
    print()
    print("con el ciclo, kahn emite:", kahn(MATERIAS_CON_CICLO),
          "| tiene ciclo:", tiene_ciclo(MATERIAS_CON_CICLO))
    print()

    fallos = 0
    casos = 0
    semilla = 0
    while semilla < 400:
        n = 2 + semilla % 7
        m = semilla % (n * (n - 1) + 1)
        G = grafo_aleatorio(n, m, semilla)
        ciclo = tiene_ciclo_bruto(G)
        if tiene_ciclo(G) != ciclo:
            fallos = fallos + 1
        if not ciclo:
            for orden in [kahn_ingenuo(G), kahn(G), kahn_con_pila(G), kahn_menor(G)]:
                if not es_orden_topologico(G, orden):
                    fallos = fallos + 1
            if n <= 7 and kahn_menor(G) != ordenes_validos(G)[0]:
                fallos = fallos + 1
        else:
            for orden in [kahn_ingenuo(G), kahn(G), kahn_con_pila(G), kahn_menor(G)]:
                if len(orden) == n:
                    fallos = fallos + 1
        casos = casos + 1
        semilla = semilla + 1
    print("grafos probados:", casos, "| fallos:", fallos)
