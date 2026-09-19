"""Lee un grafo de la entrada y reporta los grados de sus vertices.

La entrada trae en la primera linea el numero de vertices n y el numero
de aristas m, y despues m lineas con los dos extremos de cada arista,
numerados de 1 a n. El grafo se guarda en una lista de adyacencia con
los vertices corridos a 0..n-1, que es como los indexa Python.

    python leergrafo.py < grafo.in
"""

import sys


def leer_grafo(entrada):
    # Primera linea: n y m. Despues, m lineas con una arista cada una
    datos = entrada.read().split()
    n = int(datos[0])
    m = int(datos[1])
    G = []
    u = 0
    while u < n:
        G.append([])
        u = u + 1
    i = 0
    while i < m:
        u = int(datos[2 + 2 * i]) - 1
        v = int(datos[3 + 2 * i]) - 1
        G[u].append(v)
        G[v].append(u)
        i = i + 1
    return (n, m, G)


def grados(n, G):
    # El grado de u es cuantos vecinos quedaron en su lista
    d = []
    u = 0
    while u < n:
        d.append(len(G[u]))
        u = u + 1
    return d


n, m, G = leer_grafo(sys.stdin)
d = grados(n, G)
u = 0
while u < n:
    print("grado({}) = {}".format(u + 1, d[u]))
    u = u + 1
print("suma de los grados = {}, aristas = {}".format(sum(d), m))
assert sum(d) == 2 * m
