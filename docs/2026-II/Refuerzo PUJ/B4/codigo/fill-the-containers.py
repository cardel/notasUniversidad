import sys


def alcanza(c, m, t):
    # Con capacidad t, ¿bastan m contenedores?
    usados = 1
    lleno = 0
    for x in c:
        if lleno + x > t:
            usados = usados + 1
            lleno = x
        else:
            lleno = lleno + x
    return usados <= m


def menorCapacidad(c, m):
    # El menor t en [max(c), sum(c)] que cumple alcanza(c, m, t).
    lo = max(c)
    hi = sum(c)
    while lo < hi:
        medio = (lo + hi) // 2
        if alcanza(c, m, medio):
            hi = medio
        else:
            lo = medio + 1
    return lo


def main():
    datos = sys.stdin.read().split()
    pos = 0
    salida = []
    while pos < len(datos):
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2
        c = [int(x) for x in datos[pos:pos + n]]
        pos = pos + n
        salida.append(str(menorCapacidad(c, m)))
    print('\n'.join(salida))


main()
