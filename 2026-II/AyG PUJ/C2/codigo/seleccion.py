# Apendice, ejemplo 3 - Ordenamiento por seleccion: dos ciclos anidados.
#
# Cada ciclo lleva su propia pareja de invariantes y la numeracion
# continua, como en el material del titular: I0 e I1 para el externo,
# I2 e I3 para el interno.
#
#   I0: 0 <= i <= N-1
#   I1: (a) A[0..i) esta ordenado ascendentemente
#       (b) todo elemento de A[0..i) es <= que todo elemento de A[i..N)
#       (c) A es una permutacion de A0
#
#   I2: i+1 <= k <= N  y  i <= m < k        (para el i fijo de esa vuelta)
#   I3: A[m] <= A[t] para todo t en [i..k)  (m apunta al minimo del tramo)
#
# Para correrlo:  python3 seleccion.py


def invariantesExterno(A, A0, i):
    N = len(A0)
    assert 0 <= i <= N - 1, 'I0 se rompio con i = %d' % i
    k = 1
    while k < i:
        assert A[k - 1] <= A[k], 'I1 (a) se rompio: prefijo desordenado en k = %d' % k
        k = k + 1
    p = 0
    while p < i:
        q = i
        while q < N:
            assert A[p] <= A[q], 'I1 (b) se rompio: A[%d] > A[%d]' % (p, q)
            q = q + 1
        p = p + 1
    assert sorted(A) == sorted(A0), 'I1 (c) se rompio: ya no es permutacion'


def invariantesInterno(A, i, m, k):
    N = len(A)
    assert i + 1 <= k <= N, 'I2 se rompio con k = %d' % k
    assert i <= m < k, 'I2 se rompio con m = %d, k = %d' % (m, k)
    t = i
    while t < k:
        assert A[m] <= A[t], 'I3 se rompio: A[%d] > A[%d] en el chequeo k = %d' % (m, t, k)
        t = t + 1


def seleccion(A):
    A0 = list(A)          # la copia A' del arreglo original, para los asserts
    i = 0
    while i < len(A) - 1:
        invariantesExterno(A, A0, i)
        m = i
        k = i + 1
        while k < len(A):
            invariantesInterno(A, i, m, k)
            if A[k] < A[m]:
                m = k
            k = k + 1
        invariantesInterno(A, i, m, k)   # el ultimo chequeo del interno
        t = A[i]
        A[i] = A[m]
        A[m] = t
        i = i + 1
    if len(A) >= 1:
        invariantesExterno(A, A0, i)     # el ultimo chequeo del externo
    return A


if __name__ == '__main__':
    A = [9, 4, -5, 1, 8, 3]
    print('A original  =', A)
    print('seleccion(A) =', seleccion(list(A)))
    print()

    # Todos los arreglos de largo 1 a 6 sobre {0, 1, 2}: 1092 casos.
    alfabeto = [0, 1, 2]
    arreglos = [[x] for x in alfabeto]
    frontera = [[x] for x in alfabeto]
    largo = 1
    while largo < 6:
        siguiente = []
        for a in frontera:
            for x in alfabeto:
                siguiente.append(a + [x])
        arreglos = arreglos + siguiente
        frontera = siguiente
        largo = largo + 1

    casos = 0
    for a in arreglos:
        assert seleccion(list(a)) == sorted(a)
        casos = casos + 1
    print(casos, 'arreglos probados con los asserts puestos: ningun assert fallo')
