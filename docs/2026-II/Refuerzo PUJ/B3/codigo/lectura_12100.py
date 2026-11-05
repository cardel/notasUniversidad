# UVa 12100 - Printer Queue: solo la lectura, por palabras
# Imprime cada caso que lee: cuántos trabajos hay, cuál es el propio y la
# prioridad de cada uno.
import sys


def main():
    datos = sys.stdin.read().split()
    casos = int(datos[0])
    pos = 1
    for c in range(1, casos + 1):
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2
        prioridades = []
        for i in range(n):
            prioridades.append(int(datos[pos + i]))
        pos = pos + n
        print("caso %d: %d trabajos, el propio en la posicion %d" % (c, n, m))
        for i in range(n):
            print("    posicion %d: prioridad %d" % (i, prioridades[i]))


main()
