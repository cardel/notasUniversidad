import sys

for linea in sys.stdin:
    datos = linea.split()
    if len(datos) == 6:
        p, q, r, s, t, u = [int(x) for x in datos]
        # un caso por línea, hasta el fin del archivo
