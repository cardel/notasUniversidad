"""Las tres representaciones de un grafo, construidas desde la lista de aristas.

Comprueba que las tres contestan lo mismo a las dos preguntas que hace
un algoritmo sobre grafos: si existe la arista (u, v) y cuales son los
vecinos de un vertice. La comprobacion recorre todos los grafos
posibles sobre 4 vertices, dirigidos y no dirigidos.
"""


def lista_de_adyacencia(n, aristas, dirigido):
    # G[u] guarda los vecinos de u: una lista por vertice
    G = []
    u = 0
    while u < n:
        G.append([])
        u = u + 1
    for arista in aristas:
        u = arista[0]
        v = arista[1]
        G[u].append(v)
        if not dirigido:
            G[v].append(u)
    return G


def matriz_de_adyacencia(n, aristas, dirigido):
    # m[u][v] vale 1 si la arista existe y 0 si no existe
    m = []
    u = 0
    while u < n:
        fila = []
        v = 0
        while v < n:
            fila.append(0)
            v = v + 1
        m.append(fila)
        u = u + 1
    for arista in aristas:
        u = arista[0]
        v = arista[1]
        m[u][v] = 1
        if not dirigido:
            m[v][u] = 1
    return m


def lista_de_aristas(n, aristas, dirigido):
    # El grafo es la lista de sus aristas; sin direccion se guarda el par al reves
    E = []
    for arista in aristas:
        u = arista[0]
        v = arista[1]
        E.append((u, v))
        if not dirigido:
            E.append((v, u))
    return E


def hay_arista_en_lista(G, u, v):
    # Recorre los vecinos de u buscando a v
    encontrada = False
    for w in G[u]:
        if w == v:
            encontrada = True
    return encontrada


def hay_arista_en_matriz(m, u, v):
    # Una sola consulta: la posicion ya dice la respuesta
    return m[u][v] == 1


def hay_arista_en_lista_de_aristas(E, u, v):
    # Recorre todas las aristas del grafo, no solo las de u
    encontrada = False
    for arista in E:
        if arista[0] == u and arista[1] == v:
            encontrada = True
    return encontrada


def vecinos_en_lista(G, u):
    # Los vecinos ya estan juntos: la lista de u es la respuesta
    return G[u]


def vecinos_en_matriz(m, u):
    # Hay que revisar la fila completa, incluidos los ceros
    resultado = []
    v = 0
    while v < len(m):
        if m[u][v] == 1:
            resultado.append(v)
        v = v + 1
    return resultado


def vecinos_en_lista_de_aristas(E, u):
    # Hay que revisar todas las aristas del grafo
    resultado = []
    for arista in E:
        if arista[0] == u:
            resultado.append(arista[1])
    return resultado


def grados(n, G):
    # En un grafo no dirigido el grado de u es cuantos vecinos tiene
    d = []
    u = 0
    while u < n:
        d.append(len(G[u]))
        u = u + 1
    return d


def grados_dirigido(n, G):
    # De salida: los vecinos de u. De entrada: cuantas veces aparece u como vecino
    salida = []
    entrada = []
    u = 0
    while u < n:
        salida.append(len(G[u]))
        entrada.append(0)
        u = u + 1
    u = 0
    while u < n:
        for v in G[u]:
            entrada[v] = entrada[v] + 1
        u = u + 1
    return (entrada, salida)


def subconjuntos(elementos):
    # Todos los subconjuntos de la lista, para recorrer todos los grafos
    if len(elementos) == 0:
        resultado = [[]]
    else:
        primero = elementos[0]
        resto = subconjuntos(elementos[1:])
        resultado = []
        for s in resto:
            resultado.append(s)
            resultado.append([primero] + s)
    return resultado


def pares_posibles(n, dirigido):
    # Los pares de vertices distintos que pueden ser arista
    pares = []
    u = 0
    while u < n:
        v = 0
        while v < n:
            if u != v and (dirigido or u < v):
                pares.append((u, v))
            v = v + 1
        u = u + 1
    return pares


def comprobar(n, dirigido):
    # Las tres representaciones contestan lo mismo en todos los grafos de n vertices
    casos = 0
    for aristas in subconjuntos(pares_posibles(n, dirigido)):
        G = lista_de_adyacencia(n, aristas, dirigido)
        m = matriz_de_adyacencia(n, aristas, dirigido)
        E = lista_de_aristas(n, aristas, dirigido)
        u = 0
        while u < n:
            esperados = sorted(vecinos_en_lista(G, u))
            assert sorted(vecinos_en_matriz(m, u)) == esperados, (aristas, u)
            assert sorted(vecinos_en_lista_de_aristas(E, u)) == esperados, (aristas, u)
            v = 0
            while v < n:
                hay = hay_arista_en_lista(G, u, v)
                assert hay_arista_en_matriz(m, u, v) == hay, (aristas, u, v)
                assert hay_arista_en_lista_de_aristas(E, u, v) == hay, (aristas, u, v)
                v = v + 1
            u = u + 1
        if not dirigido:
            # Apreton de manos: la suma de los grados es dos veces el numero de aristas
            assert sum(grados(n, G)) == 2 * len(aristas), aristas
        else:
            entrada, salida = grados_dirigido(n, G)
            assert sum(entrada) == len(aristas) and sum(salida) == len(aristas), aristas
        casos = casos + 1
    return casos


no_dirigidos = comprobar(4, False)
dirigidos = comprobar(4, True)
print("grafos no dirigidos de 4 vertices comprobados: {}".format(no_dirigidos))
print("grafos dirigidos de 4 vertices comprobados: {}".format(dirigidos))
print("las tres representaciones contestaron lo mismo en todos los casos")
