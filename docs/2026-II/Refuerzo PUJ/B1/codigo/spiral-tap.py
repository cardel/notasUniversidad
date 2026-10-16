import sys


def anillo(p):
    r = 0
    while (2 * r + 1) * (2 * r + 1) < p:
        r = r + 1
    return r


def coordenadas(sz, p):
    c = (sz + 1) // 2
    r = anillo(p)
    if r == 0:
        linea = c
        col = c
    else:
        d = p - (2 * r - 1) * (2 * r - 1) - 1
        if d < 2 * r:
            linea = c + r
            col = c + r - 1 - d
        elif d < 4 * r:
            linea = c + r - (d - 2 * r + 1)
            col = c - r
        elif d < 6 * r:
            linea = c - r
            col = c - r + (d - 4 * r + 1)
        else:
            linea = c - r + (d - 6 * r + 1)
            col = c + r
    return (linea, col)


def main():
    datos = sys.stdin.read().split()
    t = 0
    sz = int(datos[t])
    p = int(datos[t + 1])
    while sz != 0 or p != 0:
        res = coordenadas(sz, p)
        print("Line = %d, column = %d." % (res[0], res[1]))
        t = t + 2
        sz = int(datos[t])
        p = int(datos[t + 1])


main()
