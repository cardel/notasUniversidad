# UVa 11516 - WiFi: solo la lectura
# Imprime cada caso que lee: las antenas y las casas, ya ordenadas.
import sys

datos = sys.stdin.read().split()
pos = 0
casos = int(datos[pos])
pos = pos + 1
caso = 1
while caso <= casos:
    n = int(datos[pos])
    m = int(datos[pos + 1])
    pos = pos + 2
    casas = []
    i = 0
    while i < m:
        casas.append(int(datos[pos]))
        pos = pos + 1
        i = i + 1
    casas.sort()
    print('caso ' + str(caso) + ': ' + str(n) + ' antenas, ' + str(m) + ' casas')
    print('    casas: ' + ' '.join(str(c) for c in casas))
    # aquí va la bisección sobre el ancho
    caso = caso + 1
