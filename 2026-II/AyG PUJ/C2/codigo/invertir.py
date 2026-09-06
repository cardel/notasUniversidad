# Apendice, ejemplo 2 - Invertir un arreglo en sitio.
#
# Dos indices acoplados que avanzan uno hacia el otro intercambiando
# extremos. El arreglo cambia, asi que I1 habla de el; y los indices
# guardan entre si una ecuacion que tambien es invariante.
#
#   I0: 0 <= i,  j <= N-1,  i + j = N - 1
#   I1: para k <  i:        A[k] = A0[N-1-k]  y  A[N-1-k] = A0[k]
#       para i <= k <= j:   A[k] = A0[k]      (el centro intacto)
#
# Para correrlo:  python3 invertir.py


def invariantes(A, A0, i, j):
    N = len(A0)
    assert 0 <= i, 'I0 se rompio: i = %d' % i
    assert j <= N - 1, 'I0 se rompio: j = %d' % j
    assert i + j == N - 1, 'I0 se rompio: i + j = %d con N = %d' % (i + j, N)
    k = 0
    while k < N:
        if k < i:
            assert A[k] == A0[N - 1 - k] and A[N - 1 - k] == A0[k], \
                'I1 (extremos ya intercambiados) se rompio en k = %d' % k
        elif i <= k <= j:
            assert A[k] == A0[k], \
                'I1 (centro intacto) se rompio en k = %d' % k
        k = k + 1


def invertir(A):
    A0 = list(A)          # la copia A' del original, solo para los asserts
    i = 0
    j = len(A) - 1
    while i < j:
        invariantes(A, A0, i, j)
        t = A[i]
        A[i] = A[j]
        A[j] = t
        i = i + 1
        j = j - 1
    invariantes(A, A0, i, j)  # el ultimo chequeo tambien cuenta
    return A


def traza(A):
    filas = []
    i = 0
    j = len(A) - 1
    filas.append((i, j, list(A)))
    while i < j:
        t = A[i]
        A[i] = A[j]
        A[j] = t
        i = i + 1
        j = j - 1
        filas.append((i, j, list(A)))
    return filas


if __name__ == '__main__':
    print('chequeo   (i, j, A)')
    for (i, j, estado) in traza([9, 4, -5, 1, 8, 3]):
        print('          ({}, {}, {})'.format(i, j, estado))
    print()

    # Todos los arreglos de largo 0 a 6 sobre {0, 1, 2}: cubre par e impar.
    alfabeto = [0, 1, 2]
    arreglos = [[]]
    frontera = [[]]
    largo = 0
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
        esperado = list(reversed(a))
        assert invertir(list(a)) == esperado
        casos = casos + 1
    print(casos, 'arreglos probados con los asserts puestos: ningun assert fallo')
