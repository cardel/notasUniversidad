# Cuantas veces aparece cada palabra, con un dict.
import sys

veces = {}
for linea in sys.stdin:
    for pal in linea.split():
        if pal in veces:
            veces[pal] = veces[pal] + 1
        else:
            veces[pal] = 1
for clave in veces:          # orden de llegada
    print(clave, veces[clave])
print("--- en orden de clave")
for clave in sorted(veces):
    print(clave, veces[clave])
