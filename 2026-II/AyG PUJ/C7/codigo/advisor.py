# UVa 11749 - Poor Trade Advisor. Solo las carreteras con la mayor PPA
# pueden estar en la provincia; sobre ese grafo, el componente conexo mas
# grande. Un recorrido por componente que cuenta ciudades.

import sys


def tamano_desde(adj, s, visitado):
    # Cuenta las ciudades del componente de s
    total = 0
    visitado[s] = True
    pila = [s]
    while len(pila) > 0:
        u = pila.pop()
        total = total + 1
        for v in adj[u]:
            if not visitado[v]:
                visitado[v] = True
                pila.append(v)
    return total


def tamano_desde_recursivo(adj, u, visitado):
    # La misma cuenta, con la pila de llamadas en lugar de la lista
    visitado[u] = True
    total = 1
    for v in adj[u]:
        if not visitado[v]:
            total = total + tamano_desde_recursivo(adj, v, visitado)
    return total


def ppa_maxima(aristas):
    # La mayor PPA entre todas las carreteras
    mayor = aristas[0][2]
    for arista in aristas:
        if arista[2] > mayor:
            mayor = arista[2]
    return mayor


def grafo_de_las_mejores(n, aristas, mayor):
    # Lista de adyacencia con solo las carreteras de PPA igual a mayor
    adj = []
    i = 0
    while i <= n:
        adj.append([])
        i = i + 1
    for arista in aristas:
        if arista[2] == mayor:
            adj[arista[0]].append(arista[1])
            adj[arista[1]].append(arista[0])
    return adj


def provincia_mas_grande(n, aristas):
    # aristas: lista de (u, v, ppa); el componente mas grande del grafo
    # que queda con solo las carreteras de PPA maxima
    adj = grafo_de_las_mejores(n, aristas, ppa_maxima(aristas))
    visitado = [False] * (n + 1)
    mejor = 0
    u = 1
    while u <= n:
        if not visitado[u]:
            t = tamano_desde(adj, u, visitado)
            if t > mejor:
                mejor = t
        u = u + 1
    return mejor


def leer_y_resolver(entrada):
    datos = entrada.read().split()
    p = 0
    salida = []
    fin = False
    while not fin:
        n = int(datos[p])
        m = int(datos[p + 1])
        p = p + 2
        if n == 0 and m == 0:
            fin = True
        else:
            aristas = []
            i = 0
            while i < m:
                aristas.append((int(datos[p]), int(datos[p + 1]), int(datos[p + 2])))
                p = p + 3
                i = i + 1
            salida.append(str(provincia_mas_grande(n, aristas)))
    return "\n".join(salida)


if __name__ == "__main__":
    print(leer_y_resolver(sys.stdin))
