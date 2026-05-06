
# Sokoban (Tipo 1: Pregunta 2 / Tipo 2: Pregunta 3).
```python
"""


Mínimo número de empujones para llevar todas las cajas a sus metas, partiendo
de una configuración del tablero.

Modelado: grafo de estados implícito (Clase 11 — Grafos implícitos).
  - Nodo: (posición del guardián, conjunto de posiciones de cajas).
  - Aristas: 4 direcciones; un movimiento simple cuesta 0 empujones,
    un empujón cuesta 1.

Algoritmo: 0–1 BFS con cola doble (Clase 19 — Caminos cortos en grafos
con pesos {0,1}). Equivalente a Dijkstra (Clase 21) restringido a
costos binarios.
"""

from collections import deque


def parsear_mapa(mapa):
    """
    Recibe el mapa como lista de strings y devuelve:
      paredes : conjunto de (r, c) que son '#'.
      metas   : conjunto de (r, c) que son '.', '*' o '+'.
      guardian: tupla (r, c) inicial del guardián.
      cajas   : tupla ordenada con las posiciones iniciales de las cajas.
    """
    paredes = set()
    metas = set()
    guardian = (0, 0)
    cajas_lista = []

    r = 0
    while r < len(mapa):
        c = 0
        while c < len(mapa[r]):
            ch = mapa[r][c]
            if ch == '#':
                paredes.add((r, c))
            elif ch == '.':
                metas.add((r, c))
            elif ch == '*':
                metas.add((r, c))
                cajas_lista.append((r, c))
            elif ch == '$':
                cajas_lista.append((r, c))
            elif ch == '@':
                guardian = (r, c)
            elif ch == '+':
                metas.add((r, c))
                guardian = (r, c)
            c = c + 1
        r = r + 1

    cajas_lista.sort()
    return paredes, metas, guardian, tuple(cajas_lista)


def es_final(cajas, metas):
    """Estado final: todas las cajas están sobre casillas de meta."""
    todas_en_meta = True
    i = 0
    while i < len(cajas):
        if cajas[i] not in metas:
            todas_en_meta = False
        i = i + 1
    return todas_en_meta


def transicion(estado, direccion, paredes):
    """
    Aplica una dirección al guardián y devuelve (nuevo_estado, costo).
    Si la transición es inválida, devuelve (None, None).
    Costo 0 = movimiento, 1 = empujón.
    """
    (gr, gc), cajas = estado
    dr, dc = direccion
    nr, nc = gr + dr, gc + dc

    cajas_set = set(cajas)
    nuevo = None
    costo = None

    if (nr, nc) in paredes:
        nuevo = None
    elif (nr, nc) in cajas_set:
        # Hay una caja: intentar empujarla
        nr2, nc2 = nr + dr, nc + dc
        if (nr2, nc2) not in paredes and (nr2, nc2) not in cajas_set:
            nuevas_cajas = list(cajas)
            j = 0
            while j < len(nuevas_cajas):
                if nuevas_cajas[j] == (nr, nc):
                    nuevas_cajas[j] = (nr2, nc2)
                j = j + 1
            nuevas_cajas.sort()
            nuevo = ((nr, nc), tuple(nuevas_cajas))
            costo = 1
    else:
        # Casilla libre: movimiento sin empujón
        nuevo = ((nr, nc), cajas)
        costo = 0

    return nuevo, costo


def sokoban(mapa):
    """
    Devuelve el mínimo número de empujones para resolver el mapa,
    o -1 si no es posible.
    """
    paredes, metas, guardian, cajas = parsear_mapa(mapa)
    estado_inicial = (guardian, cajas)
    direcciones = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    INF = float('inf')
    dist = {estado_inicial: 0}
    cola = deque()
    cola.append(estado_inicial)

    respuesta = -1
    encontrado = False

    while len(cola) > 0 and not encontrado:
        estado = cola.popleft()
        d_actual = dist[estado]

        if es_final(estado[1], metas):
            respuesta = d_actual
            encontrado = True
        else:
            i = 0
            while i < len(direcciones):
                nuevo, costo = transicion(estado, direcciones[i], paredes)
                if nuevo is not None:
                    nd = d_actual + costo
                    if nd < dist.get(nuevo, INF):
                        dist[nuevo] = nd
                        if costo == 0:
                            cola.appendleft(nuevo)
                        else:
                            cola.append(nuevo)
                i = i + 1

    return respuesta


# --- Verificación con el mapa del enunciado ---
if __name__ == "__main__":
    mapa = [
        "####    ",
        "#  .#   ",
        "#  ###  ",
        "#*@  #  ",
        "#  $ #  ",
        "#  ###  ",
        "####    ",
    ]
    print("Empujones mínimos:", sokoban(mapa))
```

# Nameless (Tipo 1: Pregunta 3).

```python
"""
Hay N ciudades, K ya tienen aeropuerto, M parejas pueden recibir vuelo si
ambas ciudades tienen aeropuerto. Para una demanda (x, y), hallar el mínimo
número de aeropuertos a instalar para conectar x con y por una ruta de vuelos.

Modelado: G = (V, E) no dirigido (las parejas dadas).
Cada vértice v tiene costo c(v) = 0 si ya tiene aeropuerto, 1 si no.
Costo de un camino = suma de c(v) sobre los vértices del camino.

Algoritmo: 0–1 BFS (Clase 19), variante de Dijkstra (Clase 21) cuando los
pesos están en {0, 1}. Tiempo O(V + E).
"""

from collections import deque


def min_aeropuertos(N, tiene_aeropuerto, edges, x, y):
    """
    N                : número de ciudades (0..N-1).
    tiene_aeropuerto : conjunto (o set) con las ciudades que ya tienen aeropuerto.
    edges            : lista de pares (u, v) no ordenados.
    x, y             : ciudades de origen y destino.

    Devuelve el mínimo número de aeropuertos por instalar para conectar
    x con y, contando x e y si no tienen aeropuerto.
    """
    # Lista de adyacencia
    adj = {}
    v = 0
    while v < N:
        adj[v] = []
        v = v + 1

    i = 0
    while i < len(edges):
        u, v = edges[i]
        adj[u].append(v)
        adj[v].append(u)
        i = i + 1

    INF = float('inf')
    d = [INF] * N

    cx = 0
    if x not in tiene_aeropuerto:
        cx = 1
    d[x] = cx

    # 0–1 BFS: costo del vecino v es c(v) en {0, 1}
    cola = deque()
    cola.append(x)

    while len(cola) > 0:
        u = cola.popleft()
        for v in adj[u]:
            cv = 0
            if v not in tiene_aeropuerto:
                cv = 1
            if d[u] + cv < d[v]:
                d[v] = d[u] + cv
                if cv == 0:
                    cola.appendleft(v)
                else:
                    cola.append(v)

    return d[y]


# --- Verificación ---
if __name__ == "__main__":
    N = 6
    tiene_aeropuerto = {0, 2, 5}
    edges = [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5), (1, 5)]
    print(min_aeropuertos(N, tiene_aeropuerto, edges, 0, 5))  # 1 (0 y 5 ya, falta 1)
```

# Spring country (Tipo 2: Pregunta 2).

```python
"""


N ciudades, vías directas con pesos w(u, v) > 0, peajes t(v) >= 0 por
ciudad. El costo de un camino s = v_0, v_1, ..., v_k = d es la suma de los
pesos de las aristas más los peajes de los nodos intermedios (no se cobra
en s ni en d).

Modelado: absorbemos el peaje del nodo de llegada en cada arista,
salvo cuando el nodo de llegada es el destino:
    w'(u, v) = w(u, v) + t(v) * 1[v != d].
El origen no paga peaje porque nunca aparece como nodo de llegada.

Algoritmo: Dijkstra (Clase 21) con EXTRACT-MIN lineal sobre un set,
exactamente como en `slides/Clases/4-Grafos/Clase 21 Dijkstra/dijkstra.py`.
Tiempo O(V^2 + E).
"""


def min_costo_spring(N, w, tax, src, dst):
    """
    N    : número de ciudades.
    w    : matriz w[u][v] = peso de la vía u-v (None si no existe).
    tax  : tax[v] = peaje de la ciudad v.
    src  : ciudad origen.
    dst  : ciudad destino.

    Devuelve el costo mínimo de transportar el cargo de src a dst.
    """
    INF = float('inf')

    d = [INF] * N
    pi = [None] * N
    d[src] = 0
    Q = set(range(N))

    seguir = True
    while seguir:
        # EXTRACT-MIN por búsqueda lineal sobre Q (estilo Clase 21)
        u = None
        min_d = INF
        for v in Q:
            if d[v] < min_d:
                min_d = d[v]
                u = v

        if u is None:
            seguir = False
        else:
            Q.remove(u)
            v = 0
            while v < N:
                if w[u][v] is not None and v in Q:
                    extra = tax[v]
                    if v == dst:
                        extra = 0
                    nd = d[u] + w[u][v] + extra
                    if nd < d[v]:
                        d[v] = nd
                        pi[v] = u
                v = v + 1

    return d[dst]


# --- Verificación ---
if __name__ == "__main__":
    # 4 ciudades, peajes [0, 5, 7, 0]
    # vías: 0-1 (peso 3), 1-2 (peso 4), 0-2 (peso 20), 2-3 (peso 2)
    N = 4
    INF = None
    w = [[INF] * N for _ in range(N)]
    w[0][1] = 3; w[1][0] = 3
    w[1][2] = 4; w[2][1] = 4
    w[0][2] = 20; w[2][0] = 20
    w[2][3] = 2; w[3][2] = 2
    tax = [0, 5, 7, 0]
    # Camino 0 -> 1 -> 2 -> 3: 3 + 5 (peaje 1) + 4 + 7 (peaje 2) + 2 = 21
    # Camino 0 -> 2 -> 3: 20 + 7 (peaje 2) + 2 = 29
    print(min_costo_spring(N, w, tax, 0, 3))  # 21
```


# Zlatan en Cali (Pregunta 4, ambos tipos).

```python
"""


Mezcla de tres temas del bloque 4-Grafos:
  - SCC con Kosaraju (Clase 16, FuertementeConexos.tex).
  - Bellman-Ford con detección de ciclo negativo (Clase 20, bellman_ford.py).
  - Dijkstra (Clase 21, dijkstra.py).

Pasos:
  1. Calcular los SCC de G.
  2. Por cada SCC: elegir representante (menor val, empate por id) y correr
     Bellman-Ford restringido al subgrafo de la SCC. Si hay ciclo negativo,
     valor de la zona = z; si no, suma de las distancias mínimas.
  3. Construir grafo no dirigido contraído H: una arista por cada par de
     SCC con al menos una arista entre ellos en G; peso = suma de los
     valores de ambas zonas.
  4. Dijkstra en H desde la zona de s hasta la de t.
"""


def kosaraju(n, adj, radj):
    """
    Devuelve (comp, K) con comp[v] = id de SCC en {0, ..., K-1}.
    Implementa Kosaraju con DFS iterativa para evitar recursión profunda.
    """
    orden = []
    visitado = [False] * n

    v = 0
    while v < n:
        if not visitado[v]:
            pila = [(v, iter(adj[v]))]
            visitado[v] = True
            while len(pila) > 0:
                top, it = pila[-1]
                siguiente = next(it, None)
                if siguiente is None:
                    orden.append(top)
                    pila.pop()
                else:
                    w_v = siguiente[0]
                    if not visitado[w_v]:
                        visitado[w_v] = True
                        pila.append((w_v, iter(adj[w_v])))
        v = v + 1

    comp = [-1] * n
    cid = 0
    i = len(orden) - 1
    while i >= 0:
        u = orden[i]
        if comp[u] == -1:
            pila = [u]
            comp[u] = cid
            while len(pila) > 0:
                x = pila.pop()
                for (y, _) in radj[x]:
                    if comp[y] == -1:
                        comp[y] = cid
                        pila.append(y)
            cid = cid + 1
        i = i - 1

    return comp, cid


def bellman_ford_subgrafo(vertices, sub_edges, src):
    """
    Bellman-Ford restringido: vertices es la lista de nodos de la SCC,
    sub_edges la lista de aristas internas (u, v, w).
    Devuelve (d, hay_ciclo_negativo). Estilo Clase 20.
    """
    INF = float('inf')
    d = {v: INF for v in vertices}
    d[src] = 0

    i = 0
    while i < len(vertices) - 1:
        for (u, v, peso) in sub_edges:
            if d[u] + peso < d[v]:
                d[v] = d[u] + peso
        i = i + 1

    hay_ciclo = False
    for (u, v, peso) in sub_edges:
        if d[u] + peso < d[v]:
            hay_ciclo = True

    return d, hay_ciclo


def dijkstra_contraido(K, adj_H, valZ, src):
    """
    Dijkstra en el grafo contraído. Peso de la arista (u, v) en H es
    valZ[u] + valZ[v]. EXTRACT-MIN lineal, estilo Clase 21.
    """
    INF = float('inf')
    d = [INF] * K
    d[src] = 0
    Q = set(range(K))

    seguir = True
    while seguir:
        u = None
        min_d = INF
        for v in Q:
            if d[v] < min_d:
                min_d = d[v]
                u = v
        if u is None:
            seguir = False
        else:
            Q.remove(u)
            for v in adj_H[u]:
                if v in Q:
                    nd = d[u] + valZ[u] + valZ[v]
                    if nd < d[v]:
                        d[v] = nd

    return d


def zlatan(n, edges, val, z, s, t):
    """
    n     : número de lugares (0..n-1).
    edges : lista de tripletas (u, v, w) con la arista dirigida u->v de peso w.
    val   : val[v] = valor positivo asociado al lugar v.
    z     : valor sustituto para zonas con ciclo negativo.
    s, t  : lugares de origen y destino.
    """
    # Adyacencias directa y transpuesta
    adj = {v: [] for v in range(n)}
    radj = {v: [] for v in range(n)}
    for (u, v, peso) in edges:
        adj[u].append((v, peso))
        radj[v].append((u, peso))

    # Fase 1: SCC
    comp, K = kosaraju(n, adj, radj)

    componentes = {j: [] for j in range(K)}
    v = 0
    while v < n:
        componentes[comp[v]].append(v)
        v = v + 1

    # Fase 2: representante y valor de cada SCC
    valZ = [0] * K
    j = 0
    while j < K:
        Cj = componentes[j]

        # Representante: menor (val, id)
        rep = Cj[0]
        for v in Cj:
            if (val[v], v) < (val[rep], rep):
                rep = v

        # Subgrafo interno
        en_cj = set(Cj)
        sub_edges = []
        for u in Cj:
            for (v, peso) in adj[u]:
                if v in en_cj:
                    sub_edges.append((u, v, peso))

        d_int, hay_ciclo = bellman_ford_subgrafo(Cj, sub_edges, rep)
        if hay_ciclo:
            valZ[j] = z
        else:
            suma = 0
            for v in Cj:
                suma = suma + d_int[v]
            valZ[j] = suma
        j = j + 1

    # Fase 3: grafo contraído (no dirigido)
    adj_H = {j: set() for j in range(K)}
    for (u, v, _) in edges:
        cu, cv = comp[u], comp[v]
        if cu != cv:
            adj_H[cu].add(cv)
            adj_H[cv].add(cu)

    # Fase 4: Dijkstra
    src, dst = comp[s], comp[t]
    dH = dijkstra_contraido(K, adj_H, valZ, src)
    return dH[dst]


# --- Ejemplo del enunciado ---
# Se usa n = 10 para indexar lugares 1..9 (el índice 0 queda sin usar pero
# pertenece al rango). El algoritmo es el mismo si se reindexan los nodos
# desde 0.
if __name__ == "__main__":
    n = 10
    val = [0, 20, 10, 30, 50, 60, 20, 80, 100, 35]  # val[1..9]; val[0] dummy
    edges = [
        (1, 2, 5), (2, 1, 3),
        (2, 3, 1),
        (3, 4, 2), (4, 3, 2),
        (4, 5, 1), (5, 3, -4),
        (4, 7, 1),
        (1, 6, 1),
        (6, 8, 1), (8, 6, 8),
        (8, 9, 1), (9, 7, 1),
    ]
    z = 10
    print("Costo Zone(2) -> Zone(7):", zlatan(n, edges, val, z, 2, 7))
```

# Clasificación de aristas con DFS modificado

```python
"""
Bonus — Opción 1: clasificar las aristas de un grafo dirigido durante un DFS
en tree, back, forward y cross edges.

Visto en Clase 13 (Propiedades BFS-DFS, Sección 22.3 de CLRS, p. 610).

Regla por color del destino al recorrer (u, v):
  - blanco          -> tree edge   (y se recursa)
  - gris            -> back edge   (v es ancestro en el árbol DFS)
  - negro, d[u]<d[v] -> forward edge
  - negro, d[u]>d[v] -> cross edge

Tiempo O(V + E): una sola pasada de DFS.
"""


def clasificar_aristas(adj):
    """
    adj : dict u -> lista de vecinos v (grafo dirigido).
    Devuelve una lista de tripletas (u, v, tipo).
    """
    n = len(adj)
    BLANCO, GRIS, NEGRO = 0, 1, 2

    color = [BLANCO] * n
    d = [0] * n
    f = [0] * n
    reloj = [0]
    aristas = []

    def visit(u):
        color[u] = GRIS
        reloj[0] = reloj[0] + 1
        d[u] = reloj[0]
        for v in adj[u]:
            if color[v] == BLANCO:
                aristas.append((u, v, "tree"))
                visit(v)
            elif color[v] == GRIS:
                aristas.append((u, v, "back"))
            elif d[u] < d[v]:
                aristas.append((u, v, "forward"))
            else:
                aristas.append((u, v, "cross"))
        color[u] = NEGRO
        reloj[0] = reloj[0] + 1
        f[u] = reloj[0]

    u = 0
    while u < n:
        if color[u] == BLANCO:
            visit(u)
        u = u + 1

    return aristas


# --- Verificación con un grafo pequeño ---
if __name__ == "__main__":
    # Grafo dirigido con todos los tipos de arista:
    #   0 -> 1  (tree)
    #   1 -> 2  (tree)
    #   2 -> 0  (back, 0 es ancestro gris)
    #   0 -> 2  (forward, 2 ya negro y d[0]<d[2])
    #   3 -> 1  (cross, 1 ya negro y d[3]>d[1])
    adj = {
        0: [1, 2],
        1: [2],
        2: [0],
        3: [1],
    }
    for tripleta in clasificar_aristas(adj):
        print(tripleta)
```


