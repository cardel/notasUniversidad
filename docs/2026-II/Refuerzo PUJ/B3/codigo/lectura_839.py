# UVa 839 - Not so Mobile: solo la lectura, por palabras
# Imprime cada barra que lee, con sangría según su nivel en el móvil,
# para ver en qué orden llegan las líneas.
import sys


def leer_barra(datos, pos, nivel):
    # lee la barra que empieza en datos[pos] y, si de algún lado cuelga un
    # submóvil, lo lee entero antes de seguir; devuelve dónde sigue la entrada
    wl = int(datos[pos])
    dl = int(datos[pos + 1])
    wr = int(datos[pos + 2])
    dr = int(datos[pos + 3])
    pos = pos + 4
    print("    " * nivel + "barra: Wl=%d Dl=%d Wr=%d Dr=%d" % (wl, dl, wr, dr))
    if wl == 0:
        pos = leer_barra(datos, pos, nivel + 1)
    if wr == 0:
        pos = leer_barra(datos, pos, nivel + 1)
    return pos


def main():
    datos = sys.stdin.read().split()
    casos = int(datos[0])
    pos = 1
    for c in range(casos):
        print("caso %d" % (c + 1))
        pos = leer_barra(datos, pos, 0)


main()
