# UVa 699 - The Falling Leaves
import sys


def sumar(pilas, x, valor):
    if x in pilas:
        pilas[x] = pilas[x] + valor
    else:
        pilas[x] = valor


def subarbol(datos, pos, x, pilas):
    # lee el subárbol que empieza en datos[pos], cuya raíz está en la
    # columna x, y devuelve dónde sigue la entrada
    valor = int(datos[pos])
    pos = pos + 1
    if valor != -1:
        sumar(pilas, x, valor)
        pos = subarbol(datos, pos, x - 1, pilas)
        pos = subarbol(datos, pos, x + 1, pilas)
    return pos


def main():
    sys.setrecursionlimit(100000)
    datos = sys.stdin.read().split()
    caso = 1
    pos = 0
    while int(datos[pos]) != -1:
        pilas = {}
        pos = subarbol(datos, pos, 0, pilas)
        linea = ""
        for x in sorted(pilas):
            if linea != "":
                linea = linea + " "
            linea = linea + str(pilas[x])
        print("Case %d:" % caso)
        print(linea)
        print("")
        caso = caso + 1


main()
