# UVa 12032 - The Monkey and the Oiled Bamboo: solo la lectura
# Imprime cada caso que lee: las alturas de los peldaños y los saltos.
import sys

datos = sys.stdin.read().split()
pos = 0
casos = int(datos[pos])
pos = pos + 1
caso = 1
while caso <= casos:
    n = int(datos[pos])
    pos = pos + 1
    alturas = []
    i = 0
    while i < n:
        alturas.append(int(datos[pos]))
        pos = pos + 1
        i = i + 1
    # el primer salto va desde el suelo, que está en 0
    saltos = [alturas[0]]
    i = 1
    while i < n:
        saltos.append(alturas[i] - alturas[i - 1])
        i = i + 1
    print('caso ' + str(caso) + ': ' + str(n) + ' peldaños')
    print('    alturas: ' + ' '.join(str(a) for a in alturas))
    print('    saltos:  ' + ' '.join(str(s) for s in saltos))
    caso = caso + 1
