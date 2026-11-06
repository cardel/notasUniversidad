datos = sys.stdin.read().split()
pos = 0
while pos < len(datos):
    n = int(datos[pos])
    m = int(datos[pos + 1])
    pos = pos + 2
    c = [int(x) for x in datos[pos:pos + n]]
    pos = pos + n
    # aquí va la bisección
