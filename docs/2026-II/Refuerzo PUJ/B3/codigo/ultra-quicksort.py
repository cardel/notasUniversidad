import sys


def mezclar(a, aux, ini, medio, fin):
    # Mezcla a[ini:medio) con a[medio:fin) y cuenta las parejas que cruzan:
    # cada elemento que sale de la derecha aporta los que faltan a la izquierda.
    i = ini
    j = medio
    k = ini
    cruzadas = 0
    while k < fin:
        if i < medio and (j >= fin or a[i] <= a[j]):
            aux[k] = a[i]
            i = i + 1
        else:
            aux[k] = a[j]
            j = j + 1
            cruzadas = cruzadas + (medio - i)
        k = k + 1
    a[ini:fin] = aux[ini:fin]
    return cruzadas


def contar(a, aux, ini, fin):
    # Ordena a[ini:fin) en el lugar y devuelve cuántas inversiones tenía.
    total = 0
    if fin - ini > 1:
        medio = (ini + fin) // 2
        total = contar(a, aux, ini, medio)
        total = total + contar(a, aux, medio, fin)
        total = total + mezclar(a, aux, ini, medio, fin)
    return total


def main():
    datos = sys.stdin.buffer.read().split()
    pos = 0
    salida = []
    n = int(datos[pos])
    pos = pos + 1
    while n != 0:
        a = [0] * n
        i = 0
        while i < n:
            a[i] = int(datos[pos])
            pos = pos + 1
            i = i + 1
        aux = [0] * n
        salida.append(str(contar(a, aux, 0, n)))
        n = int(datos[pos])
        pos = pos + 1
    sys.stdout.write('\n'.join(salida) + '\n')


main()
