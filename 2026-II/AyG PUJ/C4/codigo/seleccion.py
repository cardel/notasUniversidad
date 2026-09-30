"""Ordenamiento por seleccion: un ciclo dentro de otro.

El ciclo interno busca la posicion del minimo de A[i..N) y esa conclusion es
lo unico que el ciclo externo necesita saber de el. Los assert escriben los
invariantes de los dos ciclos: los del interno con i fijo, los del externo
sobre el prefijo ya ordenado.
"""


def minimo_en(A, ini, fin):
    # El minimo de A[ini..fin), calculado a la brava
    m = A[ini]
    k = ini + 1
    while k < fin:
        if A[k] < m:
            m = A[k]
        k = k + 1
    return m


def ordenado(A, ini, fin):
    # A[ini..fin) esta en orden no decreciente
    ok = True
    k = ini + 1
    while k < fin:
        if A[k - 1] > A[k]:
            ok = False
        k = k + 1
    return ok


def prefijo_domina(A, i, N):
    # Todo elemento de A[0..i) es menor o igual que todo elemento de A[i..N)
    ok = True
    a = 0
    while a < i:
        b = i
        while b < N:
            if A[a] > A[b]:
                ok = False
            b = b + 1
        a = a + 1
    return ok


def ordenar_por_seleccion(A):
    N = len(A)
    i = 0
    while i < N - 1:
        assert 0 <= i <= N - 1
        assert ordenado(A, 0, i)
        assert prefijo_domina(A, i, N)
        p = i
        j = i + 1
        while j < N:
            assert i + 1 <= j <= N and i <= p < j
            assert A[p] == minimo_en(A, i, j)
            if A[j] < A[p]:
                p = j
            j = j + 1
            assert i + 1 <= j <= N and i <= p < j
            assert A[p] == minimo_en(A, i, j)
        temporal = A[i]
        A[i] = A[p]
        A[p] = temporal
        i = i + 1
        assert 0 <= i <= N - 1
        assert ordenado(A, 0, i)
        assert prefijo_domina(A, i, N)
    return A


def comprobar():
    # Todas las listas de largo 0 a 6 con valores en 0..2, y las permutaciones
    casos = 0
    largo = 0
    while largo <= 6:
        total = 3 ** largo
        codigo = 0
        while codigo < total:
            A = []
            resto = codigo
            k = 0
            while k < largo:
                A.append(resto % 3)
                resto = resto // 3
                k = k + 1
            esperado = sorted(A)
            assert ordenar_por_seleccion(A) == esperado, (codigo, largo)
            casos = casos + 1
            codigo = codigo + 1
        largo = largo + 1
    return casos


print("ordenar_por_seleccion([5, 2, 9, 1, 5, 6]) =",
      ordenar_por_seleccion([5, 2, 9, 1, 5, 6]))
print("listas comprobadas:", comprobar())
