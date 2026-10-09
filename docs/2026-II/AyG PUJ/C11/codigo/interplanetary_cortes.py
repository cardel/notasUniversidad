# Problema D - interplanetary
#
# Un puente se cruza unicamente hacia el componente 2-arista-conexo de mas
# influencia, asi que la respuesta sale de tres pasadas sobre el mismo grafo:
# Tarjan marca los puentes, un etiquetado que no los cruza da los componentes
# y de paso la influencia sumada de cada uno, y el recorrido desde el inicio
# consulta esas sumas para decidir si pasa un puente. Las sumas crecen por
# donde va el recorrido, de modo que ningun puente se pasa en los dos sentidos
# y el recorrido termina.
#
# Cada vecino viene con el identificador de su arista, asi que una arista
# repetida se maneja igual que las demas. Las tres profundidades van en sus dos
# formas, la recursiva y la de pila explicita; el envio usa la de pila, porque
# la profundidad puede pasarse del limite de recursion de Python.

from sys import stdin

# El caso de trabajo: dos triangulos unidos por el puente 3-4, y el vertice 7
# colgado del 1 por el puente 1-7.
ARISTAS = [(1, 2), (2, 3), (1, 3),
           (3, 4),
           (4, 5), (5, 6), (4, 6),
           (1, 7)]
INFLUENCIA = {1: 2, 2: 1, 3: 3, 4: 4, 5: 3, 6: 5, 7: 1}


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
    for s in G:
        if d[s] == 0:
            puentes_aux(G, s, -1, reloj, d, low, es_puente)
    return es_puente


def puentes_desde(G, s, reloj, d, low, es_puente):
    # Ternas [u, entrada, k]: por cual vecino de u va el recorrido.
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


# ---- los componentes y su influencia, en las dos formas ----

def sumar_aux(G, u, numero, es_puente, influencia, comp, suma):
    # No cruza puentes: lo que alcanza es un componente, y de paso acumula la
    # influencia de cada vertice que etiqueta.
    comp[u] = numero
    suma[numero] = suma[numero] + influencia[u]
    for v, i in G[u]:
        if comp[v] == -1 and i not in es_puente:
            sumar_aux(G, v, numero, es_puente, influencia, comp, suma)


def componentes(G, es_puente, influencia):
    # comp[v]: el componente de v; suma[c]: la influencia de todo c.
    comp = {}
    for u in G:
        comp[u] = -1
    suma = []
    total = 0
    for u in G:
        if comp[u] == -1:
            suma.append(0)
            sumar_aux(G, u, total, es_puente, influencia, comp, suma)
            total = total + 1
    return comp, suma


def sumar_desde(G, s, numero, es_puente, influencia, comp, suma):
    comp[s] = numero
    suma[numero] = suma[numero] + influencia[s]
    pila = [s]
    while len(pila) > 0:
        u = pila.pop()
        for v, i in G[u]:
            if comp[v] == -1 and i not in es_puente:
                comp[v] = numero
                suma[numero] = suma[numero] + influencia[v]
                pila.append(v)


def componentes_con_pila(G, es_puente, influencia):
    comp = {}
    for u in G:
        comp[u] = -1
    suma = []
    total = 0
    for u in G:
        if comp[u] == -1:
            suma.append(0)
            sumar_desde(G, u, total, es_puente, influencia, comp, suma)
            total = total + 1
    return comp, suma


# ---- el recorrido, en las dos formas ----

def se_puede(u, v, i, es_puente, comp, suma):
    # Una arista que no es puente se cruza en los dos sentidos; un puente,
    # solo hacia el componente de influencia estrictamente mayor.
    return i not in es_puente or suma[comp[u]] < suma[comp[v]]


def alcance_aux(G, u, es_puente, comp, suma, visto, llegan):
    visto[u] = True
    llegan.append(u)
    for v, i in G[u]:
        if not visto[v] and se_puede(u, v, i, es_puente, comp, suma):
            alcance_aux(G, v, es_puente, comp, suma, visto, llegan)


def alcance(G, inicio, es_puente, comp, suma):
    # Los vertices a los que se llega desde inicio.
    visto = {}
    for u in G:
        visto[u] = False
    llegan = []
    alcance_aux(G, inicio, es_puente, comp, suma, visto, llegan)
    return llegan


def alcance_con_pila(G, inicio, es_puente, comp, suma):
    visto = {}
    for u in G:
        visto[u] = False
    visto[inicio] = True
    llegan = [inicio]
    pila = [inicio]
    while len(pila) > 0:
        u = pila.pop()
        for v, i in G[u]:
            if not visto[v] and se_puede(u, v, i, es_puente, comp, suma):
                visto[v] = True
                llegan.append(v)
                pila.append(v)
    return llegan


# ---- el orden de la salida ----

def ordenar(llegan, influencia, comp, suma):
    # Creciente por la influencia del componente, luego por la propia y al
    # final por el numero del vertice.
    claves = []
    for u in llegan:
        claves.append((suma[comp[u]], influencia[u], u))
    claves.sort()
    salida = []
    for total, propia, u in claves:
        salida.append(u)
    return salida


def resolver(vertices, aristas, influencia, inicio):
    # Las tres pasadas seguidas. Theta(V+E) en total, mas el orden final.
    G = construir(vertices, aristas)
    es_puente = puentes_con_pila(G)
    comp, suma = componentes_con_pila(G, es_puente, influencia)
    llegan = alcance_con_pila(G, inicio, es_puente, comp, suma)
    return ordenar(llegan, influencia, comp, suma)


def resolver_recursivo(vertices, aristas, influencia, inicio):
    # Las mismas tres pasadas, con las profundidades recursivas.
    G = construir(vertices, aristas)
    es_puente = puentes(G)
    comp, suma = componentes(G, es_puente, influencia)
    llegan = alcance(G, inicio, es_puente, comp, suma)
    return ordenar(llegan, influencia, comp, suma)


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
        influencia = {}
        for u in range(1, n + 1):
            influencia[u] = int(datos[pos + u - 1])
        pos = pos + n
        aristas = []
        for _ in range(m):
            a, b, pos = leer_pareja(datos, pos)
            aristas.append((a, b))
        inicio = int(datos[pos])
        pos = pos + 1
        numeros = []
        for u in resolver(range(1, n + 1), aristas, influencia, inicio):
            numeros.append(str(u))
        lineas.append(" ".join(numeros))
    print("\n".join(lineas))


# ---- comprobacion: quitar cada arista y contar componentes ----

def contar_componentes(G, sin_arista):
    # En cuantos pedazos queda el grafo al ignorar la arista sin_arista.
    visto = {}
    for u in G:
        visto[u] = False
    piezas = 0
    for s in G:
        if not visto[s]:
            piezas = piezas + 1
            visto[s] = True
            pila = [s]
            while len(pila) > 0:
                u = pila.pop()
                for v, i in G[u]:
                    if not visto[v] and i != sin_arista:
                        visto[v] = True
                        pila.append(v)
    return piezas


def puentes_bruto(G, cuantas):
    base = contar_componentes(G, -1)
    es_puente = set()
    for i in range(cuantas):
        if contar_componentes(G, i) > base:
            es_puente.add(i)
    return es_puente


def grafo_aleatorio(n, m, semilla):
    import random
    random.seed(semilla)
    influencia = {}
    for u in range(1, n + 1):
        influencia[u] = random.randrange(1, 5)
    aristas = []
    for _ in range(m):
        a = random.randrange(1, n + 1)
        b = random.randrange(1, n + 1)
        if a != b:
            aristas.append((a, b))
    return aristas, influencia


if __name__ == "__main__":
    print("alcanzados:", resolver(range(1, 8), ARISTAS, INFLUENCIA, 1),
          "| esperado: [2, 1, 3, 5, 4, 6]")

    # Empate: el puente 2-3 une dos componentes que suman 3 y no se pasa.
    empate = {1: 1, 2: 3, 3: 3}
    print("alcanzados:", resolver(range(1, 4), [(1, 2), (2, 3)], empate, 1),
          "| esperado: [1, 2]")

    fallos = 0
    for semilla in range(300):
        n = 2 + semilla % 8
        m = semilla % 14
        aristas, influencia = grafo_aleatorio(n, m, semilla)
        G = construir(range(1, n + 1), aristas)
        bruto = puentes_bruto(G, len(aristas))
        if puentes(G) != bruto or puentes_con_pila(G) != bruto:
            fallos = fallos + 1
        con_pila = resolver(range(1, n + 1), aristas, influencia, 1)
        recursivo = resolver_recursivo(range(1, n + 1), aristas, influencia, 1)
        if con_pila != recursivo:
            fallos = fallos + 1
    print("grafos probados: 300 | fallos:", fallos)
