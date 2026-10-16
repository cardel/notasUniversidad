import sys


def contar(campo, n, m, f, c):
    total = 0
    df = -1
    while df <= 1:
        dc = -1
        while dc <= 1:
            g = f + df
            h = c + dc
            if (df != 0 or dc != 0) and g >= 0 and g < n and h >= 0 and h < m:
                if campo[g][h] == "*":
                    total = total + 1
            dc = dc + 1
        df = df + 1
    return total


def main():
    datos = sys.stdin.read().split()
    pos = 0
    numero = 0
    n = int(datos[pos])
    m = int(datos[pos + 1])
    pos = pos + 2
    while n != 0 or m != 0:
        campo = datos[pos:pos + n]
        pos = pos + n
        numero = numero + 1
        if numero > 1:
            print("")
        print("Field #%d:" % numero)
        f = 0
        while f < n:
            fila = ""
            c = 0
            while c < m:
                if campo[f][c] == "*":
                    fila = fila + "*"
                else:
                    fila = fila + str(contar(campo, n, m, f, c))
                c = c + 1
            print(fila)
            f = f + 1
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2


main()
