"""Dos ciclos cuya salida es una lista que crece.

El invariante ya no habla de un numero: tiene que decir cuantos elementos
lleva la lista y que hay en cada posicion ya escrita. Los dos ejemplos se
diferencian en si la lista crece en todas las vueltas o solo en algunas.
"""


def posiciones_pares(A):
    # I0: 0 <= i <= N
    # I1: res es la lista creciente de las posiciones j < i con A[j] par
    N = len(A)
    res = []
    i = 0
    while i < N:
        if A[i] % 2 == 0:
            res.append(i)
        i = i + 1
    return res


def maximos_parciales(A):
    # Precondicion: N >= 1
    # I0: 1 <= i <= N
    # I1: m es el maximo de A[0..i)
    # I2: len(res) == i, y res[j] es el maximo de A[0..j] para todo j < i
    N = len(A)
    m = A[0]
    res = [A[0]]
    i = 1
    while i < N:
        if A[i] > m:
            m = A[i]
        res.append(m)
        i = i + 1
    return res


def maximo_hasta(A, j):
    # El maximo de A[0..j], calculado a la brava
    m = A[0]
    k = 0
    while k <= j:
        if A[k] > m:
            m = A[k]
        k = k + 1
    return m


def comprobar(A):
    # Contrasta las dos funciones contra su especificacion
    esperado_pares = []
    i = 0
    while i < len(A):
        if A[i] % 2 == 0:
            esperado_pares.append(i)
        i = i + 1
    assert posiciones_pares(A) == esperado_pares, A

    res = maximos_parciales(A)
    assert len(res) == len(A), A
    j = 0
    while j < len(A):
        assert res[j] == maximo_hasta(A, j), (A, j)
        j = j + 1
    return len(A)


casos = [[7], [4, 2, 9, 9, 1], [1, 3, 5, 7], [8, 6, 4, 2], [-3, -1, -4, -1, -5]]
c = 0
while c < len(casos):
    comprobar(casos[c])
    c = c + 1

print("posiciones_pares([4, 2, 9, 9, 1]) =", posiciones_pares([4, 2, 9, 9, 1]))
print("maximos_parciales([4, 2, 9, 9, 1]) =", maximos_parciales([4, 2, 9, 9, 1]))
print("casos comprobados:", c)
