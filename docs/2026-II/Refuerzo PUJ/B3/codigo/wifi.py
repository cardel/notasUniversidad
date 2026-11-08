import sys


def antenasNecesarias(casas, ancho):
    # Cuántas antenas hacen falta si cada una cubre un tramo de 'ancho' metros.
    # casas viene ordenada; cada antena se pone para la primera casa sin cubrir.
    antenas = 1
    cubreHasta = casas[0] + ancho
    for c in casas:
        if c > cubreHasta:
            antenas = antenas + 1
            cubreHasta = c + ancho
    return antenas


def menorAncho(casas, n):
    # El menor ancho entero con el que alcanzan n antenas.
    lo = 0
    hi = casas[-1] - casas[0]
    while lo < hi:
        medio = (lo + hi) // 2
        if antenasNecesarias(casas, medio) <= n:
            hi = medio
        else:
            lo = medio + 1
    return lo


def main():
    datos = sys.stdin.read().split()
    pos = 0
    casos = int(datos[pos])
    pos = pos + 1
    salida = []
    caso = 0
    while caso < casos:
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2
        casas = []
        i = 0
        while i < m:
            casas.append(int(datos[pos]))
            pos = pos + 1
            i = i + 1
        casas.sort()
        ancho = menorAncho(casas, n)
        # la distancia máxima es la mitad del ancho: termina en .0 o en .5
        if ancho % 2 == 0:
            salida.append(str(ancho // 2) + '.0')
        else:
            salida.append(str(ancho // 2) + '.5')
        caso = caso + 1
    print('\n'.join(salida))


main()
