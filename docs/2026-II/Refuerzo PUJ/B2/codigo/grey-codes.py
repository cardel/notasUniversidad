# UVa 11173 - Grey Codes
import sys


def gris(ini, fin, k):
    # código que ocupa la posición k del rango [ini, fin) de posiciones
    if fin - ini == 1:
        codigo = 0
    else:
        mitad = (ini + fin) // 2
        if k < mitad:
            # mitad de arriba: bit 0, mismo orden
            codigo = gris(ini, mitad, k)
        else:
            # mitad de abajo: bit 1, la de arriba reflejada
            codigo = (mitad - ini) + gris(ini, mitad, ini + fin - 1 - k)
    return codigo


def main():
    datos = sys.stdin.read().split()
    casos = int(datos[0])
    salida = []
    for c in range(casos):
        n = int(datos[1 + 2 * c])
        k = int(datos[2 + 2 * c])
        salida.append(str(gris(0, 2 ** n, k)))
    print("\n".join(salida))


main()
