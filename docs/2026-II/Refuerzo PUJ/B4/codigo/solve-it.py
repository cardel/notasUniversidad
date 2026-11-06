import math
import sys


def f(p, q, r, s, t, u, x):
    # El lado izquierdo de la ecuación, evaluado en x.
    return (p * math.exp(-x) + q * math.sin(x) + r * math.cos(x)
            + s * math.tan(x) + t * x * x + u)


def resolver(p, q, r, s, t, u):
    # f es decreciente en [0, 1]: hay raíz solo si f(0) >= 0 >= f(1).
    if f(p, q, r, s, t, u, 0.0) < 0.0 or f(p, q, r, s, t, u, 1.0) > 0.0:
        respuesta = 'No solution'
    else:
        lo = 0.0
        hi = 1.0
        vuelta = 0
        while vuelta < 100:
            medio = (lo + hi) / 2.0
            if f(p, q, r, s, t, u, medio) > 0.0:
                lo = medio
            else:
                hi = medio
            vuelta = vuelta + 1
        respuesta = '%.4f' % ((lo + hi) / 2.0)
    return respuesta


def main():
    salida = []
    for linea in sys.stdin:
        datos = linea.split()
        if len(datos) == 6:
            p = int(datos[0])
            q = int(datos[1])
            r = int(datos[2])
            s = int(datos[3])
            t = int(datos[4])
            u = int(datos[5])
            salida.append(resolver(p, q, r, s, t, u))
    print('\n'.join(salida))


main()
