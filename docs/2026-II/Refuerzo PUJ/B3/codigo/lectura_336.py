import sys

datos = sys.stdin.read().split()
pos = 0
caso = 0
conexiones = int(datos[pos])
pos = pos + 1
while conexiones != 0:
    i = 0
    while i < conexiones:
        a = int(datos[pos])
        b = int(datos[pos + 1])
        pos = pos + 2
        # aquí va el diccionario de número a índice
        i = i + 1
    nodo = int(datos[pos])
    ttl = int(datos[pos + 1])
    pos = pos + 2
    while nodo != 0 or ttl != 0:
        caso = caso + 1
        # aquí va el recorrido en amplitud
        nodo = int(datos[pos])
        ttl = int(datos[pos + 1])
        pos = pos + 2
    conexiones = int(datos[pos])
    pos = pos + 1
