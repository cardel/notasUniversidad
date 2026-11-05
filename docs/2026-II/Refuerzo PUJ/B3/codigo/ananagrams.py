# UVa 156 - Ananagrams
import sys


def clave(palabra):
    # las letras en minúscula y ordenadas: dos anagramas dan la misma clave
    letras = sorted(palabra.lower())
    resultado = ""
    for c in letras:
        resultado = resultado + c
    return resultado


def main():
    datos = sys.stdin.read().split()
    palabras = []
    cuenta = {}
    i = 0
    while i < len(datos) and datos[i] != "#":
        k = clave(datos[i])
        if k in cuenta:
            cuenta[k] = cuenta[k] + 1
        else:
            cuenta[k] = 1
        palabras.append(datos[i])
        i = i + 1
    for p in sorted(palabras):
        if cuenta[clave(p)] == 1:
            print(p)


main()
