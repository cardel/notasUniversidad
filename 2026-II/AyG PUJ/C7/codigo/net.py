# UVa 627 - The Net. Amplitud desde el origen guardando el predecesor de
# cada enrutador; la ruta se reconstruye subiendo por los predecesores. Como
# las listas de visibles vienen en orden ascendente, la primera vez que se
# descubre un enrutador es por la ruta de identificadores mas bajos.

from collections import deque


def ruta(grafo, inicio, destino):
    # Lista de enrutadores de inicio a destino, o [] si no hay conexion
    pred = {}
    pred[inicio] = -1
    cola = deque()
    cola.append(inicio)
    while len(cola) > 0 and destino not in pred:
        u = cola.popleft()
        for v in grafo[u]:
            if v not in pred:
                pred[v] = u
                cola.append(v)
    camino = []
    if destino in pred:
        v = destino
        while v != -1:
            camino.append(v)
            v = pred[v]
        camino.reverse()
    return camino


def leer_red(lineas, p):
    # Devuelve (grafo, posicion siguiente); lineas[p] trae n
    n = int(lineas[p])
    p = p + 1
    grafo = {}
    i = 0
    while i < n:
        partes = lineas[p].strip().split("-")
        enrutador = int(partes[0])
        vecinos = []
        if len(partes) > 1 and partes[1] != "":
            for texto in partes[1].split(","):
                vecinos.append(int(texto))
        grafo[enrutador] = vecinos
        p = p + 1
        i = i + 1
    return (grafo, p)


def leer_y_resolver(entrada):
    lineas = [l for l in entrada.read().split("\n") if l.strip() != ""]
    p = 0
    salida = []
    while p < len(lineas):
        leido = leer_red(lineas, p)
        grafo = leido[0]
        p = leido[1]
        salida.append("-----")
        consultas = int(lineas[p])
        p = p + 1
        i = 0
        while i < consultas:
            partes = lineas[p].split()
            camino = ruta(grafo, int(partes[0]), int(partes[1]))
            if len(camino) == 0:
                salida.append("connection impossible")
            else:
                salida.append(" ".join(str(v) for v in camino))
            p = p + 1
            i = i + 1
    return "\n".join(salida)


if __name__ == "__main__":
    import sys
    print(leer_y_resolver(sys.stdin))
