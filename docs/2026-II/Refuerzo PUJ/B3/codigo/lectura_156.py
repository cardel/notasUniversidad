# UVa 156 - Ananagrams: solo la lectura, por palabras
# Imprime cada palabra que lee, hasta el #, sin importar en qué línea venga
# ni cuántos espacios la rodeen.
import sys


def main():
    datos = sys.stdin.read().split()
    palabras = []
    i = 0
    while i < len(datos) and datos[i] != "#":
        palabras.append(datos[i])
        i = i + 1
    print("%d palabras" % len(palabras))
    for i in range(len(palabras)):
        print("    palabra %d: %s" % (i + 1, palabras[i]))


main()
