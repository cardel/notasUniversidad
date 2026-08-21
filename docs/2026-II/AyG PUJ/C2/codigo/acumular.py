# Apendice, ejemplo 1 - Acumular las sumas en el mismo arreglo.
#
# Aqui el arreglo SI cambia dentro del ciclo, asi que la invariante I1
# tiene que hablar de el. A0 es la copia A' del arreglo antes de arrancar:
# los asserts comparan contra ella en cada chequeo.
#
#   I0: 1 <= i <= N
#   I1: para k <  i:  A[k] = A0[0] + ... + A0[k]   (zona ya transformada)
#       para k >= i:  A[k] = A0[k]                 (zona todavia intacta)
#
# Para correrlo:  python3 acumular.py


def sumaPrefijo(A0, k):
    # I1 escrito de la forma mas lenta y mas obvia posible.
    total = 0
    t = 0
    while t <= k:
        total = total + A0[t]
        t = t + 1
    return total


def invariantes(A, A0, i):
    # Verifica I0 e I1 en un chequeo de la condicion.
    N = len(A0)
    assert 1 <= i <= N, 'I0 se rompio con i = %d' % i
    k = 0
    while k < N:
        if k < i:
            assert A[k] == sumaPrefijo(A0, k), \
                'I1 (zona transformada) se rompio en k = %d, chequeo i = %d' % (k, i)
        else:
            assert A[k] == A0[k], \
                'I1 (zona intacta) se rompio en k = %d, chequeo i = %d' % (k, i)
        k = k + 1


def acumular(A):
    A0 = list(A)          # la copia A' del original, solo para los asserts
    i = 1
    while i < len(A):
        invariantes(A, A0, i)
        A[i] = A[i - 1] + A[i]
        i = i + 1
    invariantes(A, A0, i)  # el ultimo chequeo tambien cuenta
    return A


def traza(A):
    # Imprime la cadena de estados (i, A) como en la clase.
    A0 = list(A)
    filas = []
    i = 1
    filas.append((i, list(A)))
    while i < len(A):
        A[i] = A[i - 1] + A[i]
        i = i + 1
        filas.append((i, list(A)))
    return A0, filas


if __name__ == '__main__':
    A0, filas = traza([9, 4, -5, 1, 8, 3])
    print('A original =', A0)
    print()
    print('chequeo   (i, A)')
    for (i, estado) in filas:
        print('          ({}, {})'.format(i, estado))
    print()

    # Todos los arreglos de largo 1 a 5 sobre {-1, 0, 2}: 363 casos.
    alfabeto = [-1, 0, 2]
    arreglos = [[x] for x in alfabeto]
    frontera = [[x] for x in alfabeto]
    largo = 1
    while largo < 5:
        siguiente = []
        for a in frontera:
            for x in alfabeto:
                siguiente.append(a + [x])
        arreglos = arreglos + siguiente
        frontera = siguiente
        largo = largo + 1

    casos = 0
    for a in arreglos:
        esperado = [sumaPrefijo(a, k) for k in range(len(a))]
        assert acumular(list(a)) == esperado
        casos = casos + 1
    print(casos, 'arreglos probados con los asserts puestos: ningun assert fallo')
