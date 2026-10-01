# Puntos de articulacion y puentes de un grafo no dirigido con una
# sola busqueda en profundidad y el valor low de cada vertice
# (CLRS, Problema 22-2). La profundidad va en sus dos formas, la
# recursiva y la de pila explicita. Se asume un grafo sin aristas
# repetidas.

# Dos triangulos que comparten el vertice 2, una arista 4-5 y un
# tercer triangulo 5-6-7.
GRAFO = [[1, 2],        # 0
         [0, 2],        # 1
         [0, 1, 3, 4],  # 2
         [2, 4],        # 3
         [2, 3, 5],     # 4
         [4, 6, 7],     # 5
         [5, 7],        # 6
         [5, 6]]        # 7


def marcados(es_art):
    # Los vertices con es_art en True, en orden.
    articulaciones = []
    u = 0
    while u < len(es_art):
        if es_art[u]:
            articulaciones.append(u)
        u = u + 1
    return articulaciones


def articulaciones_ingenuo(G):
    # Quita cada vertice y cuenta los componentes que quedan.
    base = contar_componentes(G, -1, None)
    articulaciones = []
    u = 0
    while u < len(G):
        if len(G[u]) > 0 and contar_componentes(G, u, None) > base:
            articulaciones.append(u)
        u = u + 1
    return articulaciones


def descubrir(u, reloj, d, low):
    reloj[0] = reloj[0] + 1
    d[u] = reloj[0]
    low[u] = reloj[0]


def revisar_hijo(u, v, es_raiz, d, low, es_art, puentes):
    # v es hijo de u y ya termino: su low es definitivo.
    low[u] = min(low[u], low[v])
    if not es_raiz and low[v] >= d[u]:
        es_art[u] = True
    if low[v] > d[u]:
        puentes.append((u, v))


def cortes_aux(G, u, padre, reloj, d, low, es_art, puentes):
    # padre = -1 dice que u es la raiz de su arbol.
    descubrir(u, reloj, d, low)
    hijos = 0
    for v in G[u]:
        if d[v] == 0:
            hijos = hijos + 1
            cortes_aux(G, v, u, reloj, d, low, es_art, puentes)
            revisar_hijo(u, v, padre == -1, d, low, es_art, puentes)
        elif v != padre:
            low[u] = min(low[u], d[v])
    if padre == -1 and hijos >= 2:
        es_art[u] = True


def cortes(G):
    # Devuelve (articulaciones, puentes). d[v] = 0: sin descubrir.
    n = len(G)
    d = [0] * n
    low = [0] * n
    es_art = [False] * n
    puentes = []
    reloj = [0]
    for u in range(n):
        if d[u] == 0:
            cortes_aux(G, u, -1, reloj, d, low, es_art, puentes)
    resultado = (marcados(es_art), puentes)
    return resultado


def cortes_desde(G, s, reloj, d, low, es_art, puentes):
    # llamadas guarda ternas [u, padre, i]. Devuelve los hijos de s.
    descubrir(s, reloj, d, low)
    hijos = 0
    llamadas = [[s, -1, 0]]
    while len(llamadas) > 0:
        u, padre, i = llamadas[-1]
        if i < len(G[u]):
            llamadas[-1][2] = i + 1
            v = G[u][i]
            if d[v] == 0:
                if u == s:
                    hijos = hijos + 1
                descubrir(v, reloj, d, low)
                llamadas.append([v, u, 0])
            elif v != padre:
                low[u] = min(low[u], d[v])
        else:
            llamadas.pop()
            if padre != -1:
                revisar_hijo(padre, u, padre == s, d, low, es_art, puentes)
    return hijos


def cortes_con_pila(G):
    # Lo mismo que cortes, con la profundidad en una lista.
    n = len(G)
    d = [0] * n
    low = [0] * n
    es_art = [False] * n
    puentes = []
    reloj = [0]
    for s in range(n):
        if d[s] == 0 and cortes_desde(G, s, reloj, d, low, es_art, puentes) >= 2:
            es_art[s] = True
    resultado = (marcados(es_art), puentes)
    return resultado


# ---- comprobacion: quitar cada pieza y contar componentes ----

def contar_componentes(G, sin_vertice, sin_arista):
    n = len(G)
    visto = [False] * n
    total = 0
    s = 0
    while s < n:
        if not visto[s] and s != sin_vertice:
            total = total + 1
            visto[s] = True
            pila = [s]
            while len(pila) > 0:
                u = pila.pop()
                for v in G[u]:
                    usable = v != sin_vertice and not visto[v]
                    if (u, v) == sin_arista or (v, u) == sin_arista:
                        usable = False
                    if usable:
                        visto[v] = True
                        pila.append(v)
        s = s + 1
    return total


def cortes_bruto(G):
    n = len(G)
    base = contar_componentes(G, -1, None)
    articulaciones = []
    puentes = []
    u = 0
    while u < n:
        if contar_componentes(G, u, None) > base - (1 if len(G[u]) == 0 else 0):
            articulaciones.append(u)
        for v in G[u]:
            if u < v and contar_componentes(G, -1, (u, v)) > base:
                puentes.append((u, v))
        u = u + 1
    resultado = (articulaciones, sorted(puentes))
    return resultado


def ordenar_puentes(puentes):
    resultado = sorted([(min(u, v), max(u, v)) for (u, v) in puentes])
    return resultado


def grafo_aleatorio(n, m, semilla):
    import random
    random.seed(semilla)
    G = []
    i = 0
    while i < n:
        G.append([])
        i = i + 1
    puestas = set()
    m = min(m, n * (n - 1) // 2)
    while len(puestas) < m:
        u = random.randrange(n)
        v = random.randrange(n)
        if u != v and (min(u, v), max(u, v)) not in puestas:
            puestas.add((min(u, v), max(u, v)))
            G[u].append(v)
            G[v].append(u)
    return G


if __name__ == "__main__":
    print("recursiva:", cortes(GRAFO))
    print("con pila: ", cortes_con_pila(GRAFO))
    print("ingenuo:  ", articulaciones_ingenuo(GRAFO))

    fallos = 0
    semilla = 0
    while semilla < 600:
        n = 1 + semilla % 9
        m = semilla % (n * (n - 1) // 2 + 1)
        G = grafo_aleatorio(n, m, semilla)
        art_b, pue_b = cortes_bruto(G)
        for art, pue in [cortes(G), cortes_con_pila(G)]:
            if art != art_b or articulaciones_ingenuo(G) != art_b or ordenar_puentes(pue) != pue_b:
                fallos = fallos + 1
        semilla = semilla + 1
    print("grafos probados: 600 | fallos:", fallos)
