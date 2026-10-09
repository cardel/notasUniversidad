# Problema A - capital
#
# Las carreteras son de una sola via, asi que la pregunta se responde sobre la
# condensacion: se contraen los componentes fuertemente conexos y lo que queda
# es un DAG. Una ciudad es candidata exactamente cuando de su componente no
# sale ninguna carretera hacia otro componente. Un DAG tiene siempre al menos
# un componente sumidero; si tiene dos, esos dos no se alcanzan entre si y
# ninguna ciudad sirve.
#
# Tarjan da los componentes en una sola profundidad, en Theta(V+E), y va en sus
# dos formas, la recursiva y la de pila explicita. Con N hasta 100000 la
# recursiva pasa el limite de Python, asi que el envio usa la de pila.

from sys import stdin

# La muestra: cuatro ciudades y las carreteras 1->2, 3->2, 4->3 y 2->1.
CARRETERAS = [(1, 2), (3, 2), (4, 3), (2, 1)]


def construir(vertices, aristas):
    # G[u] guarda los vecinos de u; cada carretera entra en un solo sentido.
    G = {}
    for u in vertices:
        G[u] = []
    for a, b in aristas:
        G[a].append(b)
    return G


def descubrir(u, reloj, d, low):
    reloj[0] = reloj[0] + 1
    d[u] = reloj[0]
    low[u] = reloj[0]


# ---- los componentes fuertemente conexos, en las dos formas ----

def cerrar(u, pila, en_pila, comp, total):
    # u quedo como raiz de su componente: lo que esta encima de u en la pila,
    # y u mismo, son un componente.
    ultimo = None
    while ultimo != u:
        ultimo = pila.pop()
        en_pila[ultimo] = False
        comp[ultimo] = total[0]
    total[0] = total[0] + 1


def scc_aux(G, u, reloj, d, low, pila, en_pila, comp, total):
    # La pila guarda los vertices abiertos cuyo componente aun no se cierra.
    descubrir(u, reloj, d, low)
    pila.append(u)
    en_pila[u] = True
    for v in G[u]:
        if d[v] == 0:
            scc_aux(G, v, reloj, d, low, pila, en_pila, comp, total)
            low[u] = min(low[u], low[v])
        elif en_pila[v]:
            low[u] = min(low[u], d[v])
    if low[u] == d[u]:
        cerrar(u, pila, en_pila, comp, total)


def componentes(G):
    # comp[v]: el componente de v, y cuantos componentes hay.
    d = {}
    low = {}
    en_pila = {}
    comp = {}
    for u in G:
        d[u] = 0
        low[u] = 0
        en_pila[u] = False
        comp[u] = -1
    reloj = [0]
    total = [0]
    pila = []
    for s in G:
        if d[s] == 0:
            scc_aux(G, s, reloj, d, low, pila, en_pila, comp, total)
    return comp, total[0]


def scc_desde(G, s, reloj, d, low, pila, en_pila, comp, total):
    # Parejas [u, k]: por cual vecino de u va el recorrido.
    descubrir(s, reloj, d, low)
    pila.append(s)
    en_pila[s] = True
    llamadas = [[s, 0]]
    while len(llamadas) > 0:
        u, k = llamadas[-1]
        if k < len(G[u]):
            llamadas[-1][1] = k + 1
            v = G[u][k]
            if d[v] == 0:
                descubrir(v, reloj, d, low)
                pila.append(v)
                en_pila[v] = True
                llamadas.append([v, 0])
            elif en_pila[v]:
                low[u] = min(low[u], d[v])
        else:
            llamadas.pop()
            if low[u] == d[u]:
                cerrar(u, pila, en_pila, comp, total)
            if len(llamadas) > 0:
                p = llamadas[-1][0]
                low[p] = min(low[p], low[u])


def componentes_con_pila(G):
    # Lo mismo que componentes, con la profundidad en una lista.
    d = {}
    low = {}
    en_pila = {}
    comp = {}
    for u in G:
        d[u] = 0
        low[u] = 0
        en_pila[u] = False
        comp[u] = -1
    reloj = [0]
    total = [0]
    pila = []
    for s in G:
        if d[s] == 0:
            scc_desde(G, s, reloj, d, low, pila, en_pila, comp, total)
    return comp, total[0]


# ---- el sumidero ----

def salidas(G, comp, total):
    # Cuantas carreteras salen de cada componente hacia otro componente.
    salen = {}
    for c in range(total):
        salen[c] = 0
    for u in G:
        for v in G[u]:
            if comp[u] != comp[v]:
                salen[comp[u]] = salen[comp[u]] + 1
    return salen


def capitales(G):
    # Los vertices del unico componente sumidero, en orden creciente. La lista
    # queda vacia cuando hay mas de un sumidero.
    comp, total = componentes_con_pila(G)
    salen = salidas(G, comp, total)
    sumideros = []
    for c in range(total):
        if salen[c] == 0:
            sumideros.append(c)
    elegidas = []
    if len(sumideros) == 1:
        for u in G:
            if comp[u] == sumideros[0]:
                elegidas.append(u)
    elegidas.sort()
    return elegidas


# ---- la lectura y la salida ----

def leer_pareja(datos, pos):
    # Los dos enteros desde pos, y la posicion siguiente.
    return int(datos[pos]), int(datos[pos + 1]), pos + 2


def main():
    datos = stdin.read().split()
    lineas = []
    pos = 0
    while pos + 1 < len(datos):
        n, m, pos = leer_pareja(datos, pos)
        aristas = []
        for _ in range(m):
            a, b, pos = leer_pareja(datos, pos)
            aristas.append((a, b))
        elegidas = capitales(construir(range(1, n + 1), aristas))
        lineas.append(str(len(elegidas)))
        if len(elegidas) > 0:
            numeros = []
            for u in elegidas:
                numeros.append(str(u))
            lineas.append(" ".join(numeros))
    print("\n".join(lineas))


# ---- comprobacion: probar cada ciudad una por una ----

def invertir(G):
    # El mismo grafo con las carreteras al reves.
    R = {}
    for u in G:
        R[u] = []
    for u in G:
        for v in G[u]:
            R[v].append(u)
    return R


def alcanzados(G, s):
    # visto[v]: si se llega de s a v.
    visto = {}
    for u in G:
        visto[u] = False
    visto[s] = True
    pila = [s]
    while len(pila) > 0:
        u = pila.pop()
        for v in G[u]:
            if not visto[v]:
                visto[v] = True
                pila.append(v)
    return visto


def capitales_bruto(G):
    # Una ciudad es candidata si en el grafo invertido alcanza a todas las
    # demas. Cuesta O(V(V+E)) y sirve para comprobar la version rapida.
    R = invertir(G)
    elegidas = []
    for c in G:
        visto = alcanzados(R, c)
        faltan = 0
        for u in G:
            if not visto[u]:
                faltan = faltan + 1
        if faltan == 0:
            elegidas.append(c)
    elegidas.sort()
    return elegidas


def grafo_aleatorio(n, m, semilla):
    import random
    random.seed(semilla)
    aristas = []
    for _ in range(m):
        a = random.randrange(1, n + 1)
        b = random.randrange(1, n + 1)
        if a != b:
            aristas.append((a, b))
    return aristas


if __name__ == "__main__":
    G = construir(range(1, 5), CARRETERAS)
    print("candidatas:", capitales(G), "| esperado: [1, 2]")

    # Dos sumideros, el {3} y el {4}: ninguna ciudad sirve.
    H = construir(range(1, 5), [(1, 2), (2, 1), (1, 3), (2, 4)])
    print("candidatas:", capitales(H), "| esperado: []")

    fallos = 0
    for semilla in range(400):
        n = 2 + semilla % 8
        m = semilla % 13
        G = construir(range(1, n + 1), grafo_aleatorio(n, m, semilla))
        comp_r, total_r = componentes(G)
        comp_p, total_p = componentes_con_pila(G)
        if capitales(G) != capitales_bruto(G):
            fallos = fallos + 1
        if total_r != total_p or comp_r != comp_p:
            fallos = fallos + 1
    print("grafos probados: 400 | fallos:", fallos)
