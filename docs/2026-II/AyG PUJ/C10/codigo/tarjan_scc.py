# Componentes fuertemente conexos de un grafo dirigido con el
# algoritmo de Tarjan: una sola busqueda en profundidad, una pila de
# vertices y el valor low de cada uno. La profundidad va en sus dos
# formas, la recursiva y la de pila explicita.


def en_blanco(grafo):
    # d[v] = 0 dice que v no ha sido descubierto.
    d = {}
    low = {}
    en_pila = {}
    for v in grafo:
        d[v] = 0
        low[v] = 0
        en_pila[v] = False
    resultado = (d, low, en_pila)
    return resultado


def sacar_componente(u, pila, en_pila, componentes):
    # Desapila hasta u, incluido: eso es un componente.
    comp = []
    w = None
    while w != u:
        w = pila.pop()
        en_pila[w] = False
        comp.append(w)
    componentes.append(comp)


def descubrir(u, reloj, d, low, pila, en_pila):
    # u recibe su numero de descubrimiento y entra a la pila.
    reloj[0] = reloj[0] + 1
    d[u] = reloj[0]
    low[u] = reloj[0]
    pila.append(u)
    en_pila[u] = True


def tarjan(grafo):
    # grafo: dict que asocia cada vertice a la lista de sucesores.
    # Devuelve los componentes en el orden en que se cierran.
    d, low, en_pila = en_blanco(grafo)
    reloj = [0]
    pila = []
    componentes = []

    def visit(u):
        descubrir(u, reloj, d, low, pila, en_pila)
        for v in grafo[u]:
            if d[v] == 0:
                visit(v)
                low[u] = min(low[u], low[v])
            elif en_pila[v]:
                low[u] = min(low[u], d[v])
        if low[u] == d[u]:
            sacar_componente(u, pila, en_pila, componentes)

    for u in grafo:
        if d[u] == 0:
            visit(u)
    return componentes


def tarjan_desde(grafo, s, reloj, d, low, pila, en_pila, componentes):
    # llamadas guarda pares [u, i]: i es el sucesor de u que toca
    # revisar cuando la busqueda vuelva a u.
    descubrir(s, reloj, d, low, pila, en_pila)
    llamadas = [[s, 0]]
    while len(llamadas) > 0:
        u, i = llamadas[-1]
        if i < len(grafo[u]):
            llamadas[-1][1] = i + 1
            v = grafo[u][i]
            if d[v] == 0:
                descubrir(v, reloj, d, low, pila, en_pila)
                llamadas.append([v, 0])
            elif en_pila[v]:
                low[u] = min(low[u], d[v])
        else:
            llamadas.pop()
            if low[u] == d[u]:
                sacar_componente(u, pila, en_pila, componentes)
            if len(llamadas) > 0:
                p = llamadas[-1][0]
                low[p] = min(low[p], low[u])


def tarjan_con_pila(grafo):
    # Lo mismo que tarjan, con la profundidad en una lista.
    d, low, en_pila = en_blanco(grafo)
    reloj = [0]
    pila = []
    componentes = []
    for s in grafo:
        if d[s] == 0:
            tarjan_desde(grafo, s, reloj, d, low, pila, en_pila,
                         componentes)
    return componentes


# ---- comprobacion ----

def alcanzables(grafo, s):
    visto = {s: True}
    pila = [s]
    while len(pila) > 0:
        u = pila.pop()
        for v in grafo[u]:
            if v not in visto:
                visto[v] = True
                pila.append(v)
    return visto


def componentes_bruto(grafo):
    # u y v juntos si cada uno alcanza al otro.
    alc = {}
    for v in grafo:
        alc[v] = alcanzables(grafo, v)
    clave = {}
    for u in grafo:
        grupo = []
        for v in grafo:
            if v in alc[u] and u in alc[v]:
                grupo.append(v)
        clave[u] = tuple(sorted(grupo))
    resultado = sorted(set(clave.values()))
    return resultado


def normalizar(componentes):
    resultado = sorted([tuple(sorted(c)) for c in componentes])
    return resultado


def grafo_aleatorio(n, m, semilla):
    import random
    random.seed(semilla)
    grafo = {}
    for v in range(n):
        grafo[v] = []
    puestas = set()
    while len(puestas) < m:
        u = random.randrange(n)
        v = random.randrange(n)
        if (u, v) not in puestas:
            puestas.add((u, v))
            grafo[u].append(v)
    return grafo


if __name__ == "__main__":
    # El grafo dirigido de ocho vertices de la clase de conectividad.
    grafo = {
        'a': ['b'],
        'b': ['c', 'e', 'f'],
        'c': ['d', 'g'],
        'd': ['c', 'h'],
        'e': ['a', 'f'],
        'f': ['g'],
        'g': ['f', 'h'],
        'h': ['h'],
    }
    print("recursiva =", tarjan(grafo))
    print("con pila  =", tarjan_con_pila(grafo))

    fallos = 0
    semilla = 0
    while semilla < 500:
        n = 1 + semilla % 9
        m = semilla % (n * n + 1)
        G = grafo_aleatorio(n, m, semilla)
        esperado = componentes_bruto(G)
        if normalizar(tarjan(G)) != esperado:
            fallos = fallos + 1
        if tarjan_con_pila(G) != tarjan(G):
            fallos = fallos + 1
        semilla = semilla + 1
    print("grafos probados: 500 | fallos:", fallos)
