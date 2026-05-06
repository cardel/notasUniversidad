
# Centro 


```python
def grados_y_hojas(grafo):
    # Devuelve (grados, hojas_iniciales).
    grados = {}
    for v in grafo:
        grados[v] = len(grafo[v])
    hojas = []
    for v in grados:
        if grados[v] <= 1:
            hojas.append(v)
    return grados, hojas


def centro_arbol(grafo):
    # grafo: dict adyacencia. Asume arbol con |V| >= 1.
    grados, hojas = grados_y_hojas(grafo)
    restantes = len(grafo)
    while restantes > 2:
        nuevas = []
        i = 0
        while i < len(hojas):
            v = hojas[i]
            j = 0
            while j < len(grafo[v]):
                u = grafo[v][j]
                if grados[u] > 0:
                    grados[u] = grados[u] - 1
                    if grados[u] == 1:
                        nuevas.append(u)
                j = j + 1
            grados[v] = 0
            restantes = restantes - 1
            i = i + 1
        hojas = nuevas
    return hojas


if __name__ == '__main__':
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
    print('centro =', centro_arbol(arbol))
```

# Diametro

```python
def altura_y_diametro(grafo, v, padre):
    # Devuelve (altura, diametro) del subarbol enraizado en v.
    diam = 0
    alt1 = 0
    alt2 = 0
    i = 0
    while i < len(grafo[v]):
        u = grafo[v][i]
        if u != padre:
            au, du = altura_y_diametro(grafo, u, v)
            if du > diam:
                diam = du
            h = au + 1
            if h >= alt1:
                alt2 = alt1
                alt1 = h
            elif h > alt2:
                alt2 = h
        i = i + 1
    if alt1 + alt2 > diam:
        diam = alt1 + alt2
    return alt1, diam


def diametro_dv(grafo):
    # grafo: dict adyacencia. Asume arbol (conexo y aciclico).
    vertices = list(grafo)
    raiz = vertices[0]
    _, diam = altura_y_diametro(grafo, raiz, None)
    return diam


if __name__ == '__main__':
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
    print('diametro =', diametro_dv(arbol))
```