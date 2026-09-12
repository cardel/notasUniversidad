# Ejercicio 3 - La posicion de la primera aparicion, o -1.
#
# Aqui I1 no es una ecuacion sino una disyuncion: o ya aparecio el valor y
# ans guarda la posicion de la PRIMERA aparicion, o no ha aparecido y ans
# sigue en -1. La estabilidad se parte en tres casos.
#
# La condicion "and ans == -1" es la que protege la primera aparicion: sin
# ella el algoritmo devolveria la ultima.
#
# Para correrlo:  python3 buscarPosicion.py


def buscarPosicion(A, v):
    # I0: 0 <= i <= N
    # I1: si v esta en A[0..i), ans es la posicion de su primera aparicion;
    #     si no esta, ans = -1
    i = 0
    ans = -1
    while i < len(A):
        if A[i] == v and ans == -1:
            ans = i
        i = i + 1
    return ans


def primeraAparicion(A, v):
    # I1 evaluado a mano, para contrastar con lo que lleva el algoritmo.
    resultado = -1
    p = len(A) - 1
    while p >= 0:
        if A[p] == v:
            resultado = p
        p = p - 1
    return resultado


def traza(A, v):
    filas = []
    i = 0
    ans = -1
    filas.append((i, ans, primeraAparicion(A[0:i], v)))
    while i < len(A):
        if A[i] == v and ans == -1:
            ans = i
        i = i + 1
        filas.append((i, ans, primeraAparicion(A[0:i], v)))
    return filas


if __name__ == '__main__':
    A = [3, 8, 5, 8, 1]
    v = 8
    print('A =', A, ' v =', v, ' (el 8 aparece dos veces: en 1 y en 3)')
    print()
    print('chequeo   (i, ans)     I1: primera aparicion en A[0..i)')
    for (i, ans, esperado) in traza(A, v):
        marca = 'ok' if ans == esperado else 'NO CUMPLE'
        print('          ({}, {:2d})       {:2d}   {}'.format(i, ans, esperado, marca))
    print()
    print('retorna', buscarPosicion(A, v), '| se espera 1, no 3')
    print('valor ausente:', buscarPosicion(A, 99), '(devuelve -1)')
