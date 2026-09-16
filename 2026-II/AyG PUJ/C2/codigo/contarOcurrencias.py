# Ejercicio 2 - Cuantas veces aparece un valor en un arreglo.
#
# El invariante es un conteo sobre el prefijo ya recorrido, y la
# estabilidad se parte en dos casos segun A[j] sea o no igual a v. Es el
# primer ejercicio de la clase donde la demostracion va por casos.
#
# Para correrlo:  python3 contarOcurrencias.py


def contarOcurrencias(A, v):
    # I0: 0 <= i <= N
    # I1: ans = cuantas posiciones p de [0..i) cumplen A[p] = v
    i = 0
    ans = 0
    while i < len(A):
        if A[i] == v:
            ans = ans + 1
        i = i + 1
    return ans


def traza(A, v):
    filas = []
    i = 0
    ans = 0
    filas.append((i, ans, A[0:i].count(v)))
    while i < len(A):
        if A[i] == v:
            ans = ans + 1
        i = i + 1
        filas.append((i, ans, A[0:i].count(v)))
    return filas


if __name__ == '__main__':
    A = [4, 7, 4, 2, 4]
    v = 4
    print('A =', A, ' v =', v)
    print()
    print('chequeo   (i, ans)     I1: apariciones de v en A[0..i)')
    for (i, ans, esperado) in traza(A, v):
        marca = 'ok' if ans == esperado else 'NO CUMPLE'
        print('          ({}, {})        {}   {}'.format(i, ans, esperado, marca))
    print()
    print('retorna', contarOcurrencias(A, v), '| conteo real', A.count(v))
