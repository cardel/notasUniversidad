# Orden topologico con la busqueda en profundidad: los vertices por
# tiempo de finalizacion decreciente. Los colores detectan el ciclo:
# llegar a un vertice gris es encontrar una arista de retroceso.
# La profundidad va en sus dos formas, la recursiva y la de pila
# explicita.

BLANCO, GRIS, NEGRO = 0, 1, 2

# El plan de estudios de la clase de orden topologico:
# 0 Arboles y grafos, 1 Programacion, 2 Matematicas discretas,
# 3 Estructuras de datos, 4 Analisis de algoritmos, 5 Logica,
# 6 Bases de datos
MATERIAS = [[4], [3], [0], [0, 6], [], [2], []]

# Con Analisis de algoritmos antes de Estructuras de datos se cierra
# el ciclo 3 -> 0 -> 4 -> 3.
MATERIAS_CON_CICLO = [[4], [3], [0], [0, 6], [3], [2], []]


def topo_aux(G, u, color, orden, ciclo):
    # u se agrega a orden cuando termina con el: por f creciente.
    color[u] = GRIS
    for v in G[u]:
        if color[v] == BLANCO:
            topo_aux(G, v, color, orden, ciclo)
        elif color[v] == GRIS:
            ciclo[0] = True
    color[u] = NEGRO
    orden.append(u)


def orden_topologico_dfs(G):
    # Devuelve (orden, hay_ciclo). Si hay ciclo, orden no sirve.
    n = len(G)
    color = [BLANCO] * n
    orden = []
    ciclo = [False]
    u = 0
    while u < n:
        if color[u] == BLANCO:
            topo_aux(G, u, color, orden, ciclo)
        u = u + 1
    orden.reverse()
    resultado = (orden, ciclo[0])
    return resultado


def topo_aux_con_pila(G, u, color, orden, ciclo):
    # Cada vertice entra dos veces: la primera lo pinta de gris y la
    # segunda lo pinta de negro y lo agrega a orden.
    pila = [(u, False)]
    while len(pila) > 0:
        w, finalizando = pila.pop()
        if finalizando:
            color[w] = NEGRO
            orden.append(w)
        elif color[w] == BLANCO:
            color[w] = GRIS
            pila.append((w, True))
            for v in G[w]:
                if color[v] == BLANCO:
                    pila.append((v, False))
                elif color[v] == GRIS:
                    ciclo[0] = True


def orden_topologico_dfs_con_pila(G):
    n = len(G)
    color = [BLANCO] * n
    orden = []
    ciclo = [False]
    u = 0
    while u < n:
        if color[u] == BLANCO:
            topo_aux_con_pila(G, u, color, orden, ciclo)
        u = u + 1
    orden.reverse()
    resultado = (orden, ciclo[0])
    return resultado


def tiempos(G):
    # d y f de cada vertice, para leer el orden en la tabla.
    n = len(G)
    color = [BLANCO] * n
    d = [0] * n
    f = [0] * n
    reloj = [0]

    def visit(u):
        color[u] = GRIS
        reloj[0] = reloj[0] + 1
        d[u] = reloj[0]
        for v in G[u]:
            if color[v] == BLANCO:
                visit(v)
        color[u] = NEGRO
        reloj[0] = reloj[0] + 1
        f[u] = reloj[0]

    u = 0
    while u < n:
        if color[u] == BLANCO:
            visit(u)
        u = u + 1
    resultado = (d, f)
    return resultado


# ---- comprobacion ----

def es_orden_topologico(G, orden):
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


def tiene_ciclo_bruto(G):
    # Hay ciclo si algun vertice se alcanza a si mismo.
    n = len(G)
    hay = False
    s = 0
    while s < n:
        visitado = [False] * n
        pila = [s]
        while len(pila) > 0:
            u = pila.pop()
            for v in G[u]:
                if v == s:
                    hay = True
                elif not visitado[v]:
                    visitado[v] = True
                    pila.append(v)
        s = s + 1
    return hay


def grafo_aleatorio(n, m, semilla):
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
    d, f = tiempos(MATERIAS)
    for u in range(len(MATERIAS)):
        print(nombres[u], "d =", d[u], "f =", f[u])
    orden, ciclo = orden_topologico_dfs(MATERIAS)
    print("recursiva:", orden, [nombres[u] for u in orden], "ciclo:", ciclo)
    print("con pila: ", orden_topologico_dfs_con_pila(MATERIAS))
    print("con ciclo:", orden_topologico_dfs(MATERIAS_CON_CICLO)[1],
          orden_topologico_dfs_con_pila(MATERIAS_CON_CICLO)[1])

    fallos = 0
    semilla = 0
    while semilla < 400:
        n = 2 + semilla % 7
        m = semilla % (n * (n - 1) + 1)
        G = grafo_aleatorio(n, m, semilla)
        hay = tiene_ciclo_bruto(G)
        for orden, ciclo in [orden_topologico_dfs(G),
                             orden_topologico_dfs_con_pila(G)]:
            if ciclo != hay:
                fallos = fallos + 1
            if not hay and not es_orden_topologico(G, orden):
                fallos = fallos + 1
        semilla = semilla + 1
    print("grafos probados: 400 | fallos:", fallos)
