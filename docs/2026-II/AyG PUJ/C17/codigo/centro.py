"""
Centro, radio y diametro de un arbol pelando capas de hojas.

El arbol se representa con listas de adyacencia: un diccionario que a
cada vertice le asocia la lista de sus vecinos.
"""


def capaDeHojas(arbol, grado):
    # Los vertices vivos que tienen un solo vecino vivo.
    capa = []
    for v in arbol:
        if grado[v] <= 1:
            capa.append(v)
    return capa


def pelarCapa(arbol, grado, capa):
    # Quita la capa entera y devuelve las hojas que quedan al hacerlo.
    siguiente = []
    for v in capa:
        for u in arbol[v]:
            if grado[u] > 0:
                grado[u] = grado[u] - 1
                if grado[u] == 1:
                    siguiente.append(u)
        # el vertice no se borra: se marca con grado cero
        grado[v] = 0
    return siguiente


def centroArbol(arbol):
    # Devuelve el centro y cuantas capas se quitaron para llegar a el.
    grado = {}
    for v in arbol:
        grado[v] = len(arbol[v])
    capa = capaDeHojas(arbol, grado)
    vivos = len(arbol)
    vueltas = 0
    while vivos > 2:
        vivos = vivos - len(capa)
        capa = pelarCapa(arbol, grado, capa)
        vueltas = vueltas + 1
    return capa, vueltas


def radioDiametro(arbol):
    # El radio y el diametro salen de las vueltas y de cuantos centros quedan.
    (centro, vueltas) = centroArbol(arbol)
    if len(centro) == 1:
        radio = vueltas
        diametro = 2 * vueltas
    else:
        radio = vueltas + 1
        diametro = 2 * vueltas + 1
    return radio, diametro, centro


if __name__ == '__main__':
    arbol = {
        0: [1, 5, 8],
        1: [0, 2],
        2: [1, 3, 4],
        3: [2],
        4: [2],
        5: [0],
        6: [8, 10],
        7: [8],
        8: [0, 6, 7, 9],
        9: [8],
        10: [6],
    }
    (radio, diametro, centro) = radioDiametro(arbol)
    print('centro   =', centro)
    print('radio    =', radio)
    print('diametro =', diametro)
