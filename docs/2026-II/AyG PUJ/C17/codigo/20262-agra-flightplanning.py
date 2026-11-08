"""
UVa 11695 Flight Planning
Autor: Carlos A Delgado S
Fecha: Noviembre 6 de 2026


"""

from sys import stdin

G = None
cortadaU, cortadaV = None, None


def cortada(v, w):
    return (v == cortadaU and w == cortadaV) or (v == cortadaV and w == cortadaU)


def pedazo(s):
    # los vertices del pedazo que contiene a s, sin cruzar el vuelo quitado
    visto = {s: True}
    cola, i = [s], 0
    while i < len(cola):
        v = cola[i]
        for w in G[v]:
            if w not in visto and not cortada(v, w):
                visto[w] = True
                cola.append(w)
        i += 1
    return cola


def grados(vs):
    grado = {}
    for v in vs:
        grado[v] = 0
        for w in G[v]:
            if not cortada(v, w):
                grado[v] += 1
    return grado


def capaDeHojas(vs, grado):
    capa = []
    for v in vs:
        if grado[v] <= 1:
            capa.append(v)
    return capa


def pelarCapa(grado, capa):
    siguiente = []
    for v in capa:
        for u in G[v]:
            if not cortada(v, u) and grado[u] > 0:
                grado[u] -= 1
                if grado[u] == 1:
                    siguiente.append(u)
        grado[v] = 0
    return siguiente


def medir(s):
    # radio, diametro y un centro del pedazo que contiene a s
    vs = pedazo(s)
    grado = grados(vs)
    capa = capaDeHojas(vs, grado)
    vivos, vueltas = len(vs), 0
    while vivos > 2:
        vivos -= len(capa)
        capa = pelarCapa(grado, capa)
        vueltas += 1
    radio, diametro = vueltas, 2 * vueltas
    if len(capa) == 2:
        radio, diametro = vueltas + 1, 2 * vueltas + 1
    return radio, diametro, capa[0]


def planear(aristas):
    global cortadaU, cortadaV
    mejor, quita, pone = None, None, None
    for a, b in aristas:
        cortadaU, cortadaV = a, b
        r1, d1, c1 = medir(a)
        r2, d2, c2 = medir(b)
        nuevo = max(d1, d2, r1 + r2 + 1)
        if mejor is None or nuevo < mejor:
            mejor, quita, pone = nuevo, (a, b), (c1, c2)
    return mejor, quita, pone


def main():
    global G
    datos = stdin.read().split()
    casos, pos = int(datos[0]), 1
    salida = []
    for _ in range(casos):
        n, pos = int(datos[pos]), pos + 1
        G = [[] for _ in range(n + 1)]
        aristas = []
        for _ in range(n - 1):
            a, b = int(datos[pos]), int(datos[pos + 1])
            pos += 2
            G[a].append(b)
            G[b].append(a)
            aristas.append((a, b))
        mejor, quita, pone = planear(aristas)
        salida.append(
            "%d\n%d %d\n%d %d" % (mejor, quita[0], quita[1], pone[0], pone[1])
        )
    print("\n".join(salida))


main()
