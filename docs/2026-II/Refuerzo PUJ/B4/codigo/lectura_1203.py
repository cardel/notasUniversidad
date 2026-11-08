import sys

datos = sys.stdin.read().split()
pos = 0
while datos[pos] != '#':
    num = int(datos[pos + 1])
    p = int(datos[pos + 2])
    pos = pos + 3
    # aquí va la inserción en la cola de prioridad
k = int(datos[pos + 1])
