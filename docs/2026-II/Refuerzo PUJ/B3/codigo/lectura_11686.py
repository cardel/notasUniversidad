import sys

datos = sys.stdin.buffer.read().split()
pos = 0
n = int(datos[pos])
m = int(datos[pos + 1])
pos = pos + 2
while n != 0 or m != 0:
    adj = [[] for u in range(n + 1)]
    i = 0
    while i < m:
        adj[int(datos[pos])].append(int(datos[pos + 1]))
        pos = pos + 2
        i = i + 1
    # aquí va el recorrido en profundidad
    n = int(datos[pos])
    m = int(datos[pos + 1])
    pos = pos + 2
