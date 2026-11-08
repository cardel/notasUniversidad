import sys

datos = sys.stdin.buffer.read().split()
pos = 0
n = int(datos[pos])
pos = pos + 1
while n != 0:
    a = [int(x) for x in datos[pos:pos + n]]
    pos = pos + n
    aux = [0] * n
    print(contar(a, aux, 0, n))
    n = int(datos[pos])
    pos = pos + 1
