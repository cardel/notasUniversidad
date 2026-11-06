import sys


def alcanza(saltos, k):
    # Con fuerza inicial k, ¿se llega al último peldaño?
    fuerza = k
    puede = True
    for s in saltos:
        if s > fuerza:
            puede = False
        elif s == fuerza:
            fuerza = fuerza - 1
    return puede


def minimaFuerza(saltos):
    # El menor k que cumple alcanza(saltos, k).
    lo = max(saltos)
    hi = lo + len(saltos)
    while lo < hi:
        medio = (lo + hi) // 2
        if alcanza(saltos, medio):
            hi = medio
        else:
            lo = medio + 1
    return lo


def main():
    datos = sys.stdin.read().split()
    pos = 0
    casos = int(datos[pos])
    pos = pos + 1
    caso = 1
    salida = []
    while caso <= casos:
        n = int(datos[pos])
        pos = pos + 1
        alturas = []
        i = 0
        while i < n:
            alturas.append(int(datos[pos]))
            pos = pos + 1
            i = i + 1
        saltos = [alturas[0]]
        i = 1
        while i < n:
            saltos.append(alturas[i] - alturas[i - 1])
            i = i + 1
        salida.append('Case ' + str(caso) + ': ' + str(minimaFuerza(saltos)))
        caso = caso + 1
    print('\n'.join(salida))


main()
