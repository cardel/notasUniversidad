# Componentes 2-arista-conexos y arbol de puentes de un grafo no dirigido,
# en Theta(V+E): una profundidad para los puentes, un recorrido que no los
# cruza para etiquetar cada vertice, y una pasada por las aristas puente.
# La profundidad va en sus dos formas, la recursiva y la de pila explicita.
# El grafo es un diccionario de adyacencia y cada vecino viene con el
# identificador de su arista, de modo que las aristas repetidas se manejan
# igual que las demas.

# Triangulo 0-1-2, puente 2-3, el vertice 3 solo, puente 3-4,
# triangulo 4-5-6, puente 5-7, triangulo 7-8-9.
ARISTAS = [(0, 1), (1, 2), (2, 0),
           (2, 3),
           (3, 4),
           (4, 5), (5, 6), (6, 4),
           (5, 7),
           (7, 8), (8, 9), (9, 7)]


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


# ---- los puentes, en las dos formas ----

def puentes_aux(G, u, entrada, reloj, d, low, es_puente):
    # entrada: el id de la arista que bajo a u; -1 en la raiz.
    descubrir(u, reloj, d, low)
    for v, i in G[u]:
        if d[v] == 0:
            puentes_aux(G, v, i, reloj, d, low, es_puente)
            low[u] = min(low[u], low[v])
            if low[v] > d[u]:
                es_puente.add(i)
        elif i != entrada:
            low[u] = min(low[u], d[v])


def puentes(G):
    # Devuelve el conjunto de ids de arista que son puente.
    d = {}
    low = {}
    for u in G:
        d[u] = 0
        low[u] = 0
    es_puente = set()
    reloj = [0]
    for u in G:
        if d[u] == 0:
            puentes_aux(G, u, -1, reloj, d, low, es_puente)
    return es_puente


def puentes_desde(G, s, reloj, d, low, es_puente):
    # Ternas [u, entrada, k]: por cual vecino de u va el ciclo.
    descubrir(s, reloj, d, low)
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
                if low[u] > d[p]:
                    es_puente.add(entrada)


def puentes_con_pila(G):
    # Lo mismo que puentes, con la profundidad en una lista.
    d = {}
    low = {}
    for u in G:
        d[u] = 0
        low[u] = 0
    es_puente = set()
    reloj = [0]
    for s in G:
        if d[s] == 0:
            puentes_desde(G, s, reloj, d, low, es_puente)
    return es_puente


# ---- el etiquetado, en las dos formas ----

def etiquetar(G, u, numero, es_puente, comp):
    # No cruza puentes: lo que alcanza es un componente.
    comp[u] = numero
    for v, i in G[u]:
        if comp[v] == -1 and i not in es_puente:
            etiquetar(G, v, numero, es_puente, comp)


def componentes(G, es_puente):
    # comp[v]: el componente de v, y el total de componentes.
    comp = {}
    for u in G:
        comp[u] = -1
    total = 0
    for u in G:
        if comp[u] == -1:
            etiquetar(G, u, total, es_puente, comp)
            total = total + 1
    return comp, total


def etiquetar_con_pila(G, s, numero, es_puente, comp):
    comp[s] = numero
    pila = [s]
    while len(pila) > 0:
        u = pila.pop()
        for v, i in G[u]:
            if comp[v] == -1 and i not in es_puente:
                comp[v] = numero
                pila.append(v)


def componentes_con_pila(G, es_puente):
    comp = {}
    for u in G:
        comp[u] = -1
    total = 0
    for u in G:
        if comp[u] == -1:
            etiquetar_con_pila(G, u, total, es_puente, comp)
            total = total + 1
    return comp, total


# ---- el arbol ----

def arbol_de_puentes(aristas, es_puente, comp, total):
    # Un nodo por componente, una arista por puente.
    T = {}
    for c in range(total):
        T[c] = []
    for i in sorted(es_puente):
        a, b = aristas[i]
        T[comp[a]].append(comp[b])
        T[comp[b]].append(comp[a])
    return T


def contraer(n, aristas):
    # Las tres pasadas seguidas. Theta(V+E) en total.
    G = construir(range(n), aristas)
    es_puente = puentes_con_pila(G)
    comp, total = componentes_con_pila(G, es_puente)
    T = arbol_de_puentes(aristas, es_puente, comp, total)
    return T, comp, es_puente


# ---- comprobacion: quitar cada arista y contar componentes ----

def contar_componentes(n, aristas, sin_arista):
    G = construir(range(n), aristas)
    visto = {}
    for u in G:
        visto[u] = False
    total = 0
    for s in G:
        if not visto[s]:
            total = total + 1
            visto[s] = True
            pila = [s]
            while len(pila) > 0:
                u = pila.pop()
                for v, i in G[u]:
                    if not visto[v] and i != sin_arista:
                        visto[v] = True
                        pila.append(v)
    return total


def puentes_bruto(n, aristas):
    base = contar_componentes(n, aristas, -1)
    es_puente = set()
    for i in range(len(aristas)):
        if contar_componentes(n, aristas, i) > base:
            es_puente.add(i)
    return es_puente


def es_arbol(T, total, conexo):
    # Un bosque con tantas aristas como nodos menos componentes.
    grados = 0
    for c in T:
        grados = grados + len(T[c])
    sin_ciclo = grados // 2 == total - contar_componentes_t(T, total)
    resultado = sin_ciclo and (not conexo or contar_componentes_t(T, total) == 1)
    return resultado


def contar_componentes_t(T, total):
    visto = {}
    for c in T:
        visto[c] = False
    piezas = 0
    for s in T:
        if not visto[s]:
            piezas = piezas + 1
            visto[s] = True
            pila = [s]
            while len(pila) > 0:
                u = pila.pop()
                for v in T[u]:
                    if not visto[v]:
                        visto[v] = True
                        pila.append(v)
    return piezas


def grafo_aleatorio(n, m, semilla):
    import random
    random.seed(semilla)
    aristas = []
    for _ in range(m):
        a = random.randrange(n)
        b = random.randrange(n)
        if a != b:
            aristas.append((a, b))
    return aristas


if __name__ == "__main__":
    G = construir(range(10), ARISTAS)
    print("puentes recursivo:", sorted(puentes(G)))
    print("puentes con pila: ", sorted(puentes_con_pila(G)))
    T, comp, es_puente = contraer(10, ARISTAS)
    print("componente de cada vertice:", [comp[u] for u in range(10)])
    print("arbol de puentes:", T)

    fallos = 0
    for semilla in range(500):
        n = 2 + semilla % 9
        m = semilla % 14
        aristas = grafo_aleatorio(n, m, semilla)
        bruto = puentes_bruto(n, aristas)
        G = construir(range(n), aristas)
        comp_r, total_r = componentes(G, puentes(G))
        T, comp, hallados = contraer(n, aristas)
        conexo = contar_componentes(n, aristas, -1) == 1
        if hallados != bruto or puentes(G) != bruto:
            fallos = fallos + 1
        if comp_r != comp or total_r != len(T):
            fallos = fallos + 1
        if not es_arbol(T, len(T), conexo):
            fallos = fallos + 1
    print("grafos probados: 500 | fallos:", fallos)
