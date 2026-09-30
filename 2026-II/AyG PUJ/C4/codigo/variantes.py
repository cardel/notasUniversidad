"""Variantes de la busqueda binaria sobre un arreglo ordenado.

Las cuatro preguntas se responden con el mismo ciclo. Lo unico que cambia es
el predicado cuyo borde se busca: la condicion de la linea del if.
"""


def primera_posicion_mayor_o_igual(A, x):
    # El borde entre A[j] < x y A[j] >= x; len(A) si nunca se alcanza
    l = 0
    r = len(A)
    while l < r:
        mitad = (l + r) // 2
        if A[mitad] < x:
            l = mitad + 1
        else:
            r = mitad
    return l


def primera_posicion_mayor(A, x):
    # El borde entre A[j] <= x y A[j] > x
    l = 0
    r = len(A)
    while l < r:
        mitad = (l + r) // 2
        if A[mitad] <= x:
            l = mitad + 1
        else:
            r = mitad
    return l


def esta(A, x):
    # x aparece en A
    p = primera_posicion_mayor_o_igual(A, x)
    return p < len(A) and A[p] == x


def cuantas_veces(A, x):
    # Cuantas copias de x hay: el ancho del bloque entre los dos bordes
    return primera_posicion_mayor(A, x) - primera_posicion_mayor_o_igual(A, x)


def mayor_menor_o_igual(A, x):
    # Posicion del mayor elemento que no supera a x; -1 si no hay ninguno
    return primera_posicion_mayor(A, x) - 1


def comprobar():
    # Contra la busqueda lineal, sobre listas ordenadas con repetidos
    casos = 0
    largo = 0
    while largo <= 7:
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
            A = sorted(A)
            x = -1
            while x <= 3:
                menores = 0
                menores_o_iguales = 0
                copias = 0
                k = 0
                while k < largo:
                    if A[k] < x:
                        menores = menores + 1
                    if A[k] <= x:
                        menores_o_iguales = menores_o_iguales + 1
                    if A[k] == x:
                        copias = copias + 1
                    k = k + 1
                assert primera_posicion_mayor_o_igual(A, x) == menores, (A, x)
                assert primera_posicion_mayor(A, x) == menores_o_iguales, (A, x)
                assert esta(A, x) == (copias > 0), (A, x)
                assert cuantas_veces(A, x) == copias, (A, x)
                assert mayor_menor_o_igual(A, x) == menores_o_iguales - 1, (A, x)
                casos = casos + 1
                x = x + 1
            codigo = codigo + 1
        largo = largo + 1
    return casos


A = [1, 3, 3, 3, 7, 9]
print("A =", A)
print("primera posicion >= 3:", primera_posicion_mayor_o_igual(A, 3))
print("primera posicion  > 3:", primera_posicion_mayor(A, 3))
print("cuantas veces esta el 3:", cuantas_veces(A, 3))
print("mayor elemento <= 5, en la posicion:", mayor_menor_o_igual(A, 5))
print("esta el 5:", esta(A, 5))
print("consultas comprobadas:", comprobar())
