
## Excentricidad

```python
def bfs_distancias(grafo, s):
    # grafo: dict que asocia cada vertice a la lista de vecinos.
    # Devuelve un dict con las distancias desde s a todo vertice.
    dist = {s: 0}
    cola = [s]
    cabeza = 0
    while cabeza < len(cola):
        u = cola[cabeza]
        cabeza = cabeza + 1
        i = 0
        while i < len(grafo[u]):
            v = grafo[u][i]
            if v not in dist:
                dist[v] = dist[u] + 1
                cola.append(v)
            i = i + 1
    return dist


def excentricidad(grafo, u):
    dist = bfs_distancias(grafo, u)
    maximo = 0
    for v in dist:
        if dist[v] > maximo:
            maximo = dist[v]
    return maximo


if __name__ == '__main__':
    # Grafo de ejemplo de la Clase 24 (11 vertices, no dirigido y conexo)
    grafo = {
        0:  [1, 5, 8],
        1:  [0, 2, 3],
        2:  [1, 3, 4],
        3:  [1, 2],
        4:  [2],
        5:  [0],
        6:  [8, 10],
        7:  [8],
        8:  [0, 7, 6, 9],
        9:  [8],
        10: [6],
    }
    for v in grafo:
        print('eps(' + str(v) + ') = ' + str(excentricidad(grafo, v)))
```

## Diametro arbol

```python
def bfs_distancias(grafo, s):
    dist = {s: 0}
    cola = [s]
    cabeza = 0
    while cabeza < len(cola):
        u = cola[cabeza]
        cabeza = cabeza + 1
        i = 0
        while i < len(grafo[u]):
            v = grafo[u][i]
            if v not in dist:
                dist[v] = dist[u] + 1
                cola.append(v)
            i = i + 1
    return dist


def vertice_mas_lejano(grafo, s):
    # Devuelve (v, d) donde v es un vertice mas lejano de s,
    # y d = dist(s, v).
    dist = bfs_distancias(grafo, s)
    mejor = s
    mejor_d = 0
    for v in dist:
        if dist[v] > mejor_d:
            mejor_d = dist[v]
            mejor = v
    return mejor, mejor_d


def diametro_arbol(grafo):
    # grafo: dict adyacencia. Asume arbol (conexo y aciclico).
    vertices = list(grafo)
    raiz = vertices[0]
    u, _ = vertice_mas_lejano(grafo, raiz)
    w, diam = vertice_mas_lejano(grafo, u)
    return diam


if __name__ == '__main__':
    # Arbol obtenido del grafo de la Clase 24 eliminando las aristas de ciclos
    arbol = {
        0:  [1, 5, 8],
        1:  [0, 2],
        2:  [1, 3, 4],
        3:  [2],
        4:  [2],
        5:  [0],
        6:  [8, 10],
        7:  [8],
        8:  [0, 7, 6, 9],
        9:  [8],
        10: [6],
    }
    print('diametro =', diametro_arbol(arbol))
```