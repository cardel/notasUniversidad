# UVa 11080 - Place the Guards: solo la lectura
import sys

datos = sys.stdin.read().split()
pos = 0
casos = int(datos[pos])
pos = pos + 1
caso = 0
while caso < casos:
    v = int(datos[pos])
    e = int(datos[pos + 1])
    pos = pos + 2
    adj = [[] for _ in range(v)]
    i = 0
    while i < e:
        f = int(datos[pos])
        t = int(datos[pos + 1])
        pos = pos + 2
        adj[f].append(t)
        adj[t].append(f)
        i = i + 1
    # aquí va el coloreo de cada pedazo
    print('caso ' + str(caso + 1) + ': ' + str(v) + ' cruces, ' + str(e) + ' calles')
    u = 0
    while u < v:
        print('    ' + str(u) + ': ' + str(adj[u]))
        u = u + 1
    caso = caso + 1
