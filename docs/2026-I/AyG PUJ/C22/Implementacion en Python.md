
```python
def floyd_warshall(W):
    n = len(W)
    # Copia para no modificar la entrada
    D = [fila[:] for fila in W]

    k = 0
    while k < n:
        i = 0
        while i < n:
            j = 0
            while j < n:
                candidato = D[i][k] + D[k][j]
                if candidato < D[i][j]:
                    D[i][j] = candidato
                j = j + 1
            i = i + 1
        k = k + 1

    return D


def floyd_warshall_con_pi(W):
    n = len(W)
    INF = float('inf')
    D = [fila[:] for fila in W]
    PI = [[None] * n for _ in range(n)]

    # Inicializacion de PI con k = 0
    i = 0
    while i < n:
        j = 0
        while j < n:
            if i != j and W[i][j] < INF:
                PI[i][j] = i
            j = j + 1
        i = i + 1

    k = 0
    while k < n:
        i = 0
        while i < n:
            j = 0
            while j < n:
                nuevo = D[i][k] + D[k][j]
                if nuevo < D[i][j]:
                    D[i][j] = nuevo
                    PI[i][j] = PI[k][j]
                j = j + 1
            i = i + 1
        k = k + 1

    resultado = (D, PI)
    return resultado


def tiene_ciclo_negativo(D):
    n = len(D)
    hay = False
    i = 0
    while i < n:
        if D[i][i] < 0:
            hay = True
        i = i + 1
    return hay


def reconstruir_camino(PI, i, j):
    # Devuelve la lista de vertices de un camino mas corto de i a j,
    # o None si no existe camino.
    camino = None
    if i == j:
        camino = [i]
    else:
        if PI[i][j] is None:
            camino = None
        else:
            prefijo = reconstruir_camino(PI, i, PI[i][j])
            if prefijo is None:
                camino = None
            else:
                camino = prefijo + [j]
    return camino
```

```python
from floyd_warshall import (
    floyd_warshall,
    floyd_warshall_con_pi,
    tiene_ciclo_negativo,
    reconstruir_camino,
)


INF = float('inf')

# Grafo de CLRS Figura 25.1 (pesos negativos, sin ciclos negativos).
# Etiquetado 0..4 corresponde a los vertices 1..5 del libro.
W = [
    [0,   3,   8,   INF, -4 ],
    [INF, 0,   INF, 1,   7  ],
    [INF, 4,   0,   INF, INF],
    [2,   INF, -5,  0,   INF],
    [INF, INF, INF, 6,   0  ],
]


def imprimir_matriz(M, etiqueta):
    print(etiqueta)
    for fila in M:
        print(" ", fila)


D = floyd_warshall(W)
imprimir_matriz(D, "D (distancias):")
# D[0] == [0, 1, -3, 2, -4]
# D[4] == [8, 5,  1, 6,  0]

print()
print("Tiene ciclo negativo:", tiene_ciclo_negativo(D))

print()
(D2, PI) = floyd_warshall_con_pi(W)
imprimir_matriz(PI, "PI (predecesores):")

print()
# Camino mas corto de 1 -> 3 (indice 0 -> 2) en etiquetas CLRS.
camino = reconstruir_camino(PI, 0, 2)
print("Camino mas corto 1 -> 3 (indices 0..4):", camino)
print("Peso total:", D2[0][2])
```