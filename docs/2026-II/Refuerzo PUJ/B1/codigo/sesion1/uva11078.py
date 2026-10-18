# UVa 11078, Open Credit System: mayor a[i] - a[j] con i < j en un recorrido.
# La entrada se lee por palabras, sin importar los saltos de linea.
import sys


def mayor_diferencia(pts):
    mayor = pts[0]
    diferencia = pts[0] - pts[1]
    for i in range(1, len(pts)):
        if mayor - pts[i] > diferencia:
            diferencia = mayor - pts[i]
        if pts[i] > mayor:
            mayor = pts[i]
    return diferencia


def main():
    datos = sys.stdin.read().split()
    casos = int(datos[0])
    pos = 1
    for c in range(casos):
        npts = int(datos[pos])
        pts = []
        for p in range(npts):
            pts.append(int(datos[pos + 1 + p]))
        pos = pos + 1 + npts
        print(mayor_diferencia(pts))


main()
