datos = sys.stdin.read().split()
pos = 0
casos = int(datos[pos])
pos = pos + 1
caso = 1
while caso <= casos:
    n = int(datos[pos])
    pos = pos + 1
    alturas = [int(x) for x in datos[pos:pos + n]]
    pos = pos + n
    # aquí va la bisección sobre k
    caso = caso + 1
