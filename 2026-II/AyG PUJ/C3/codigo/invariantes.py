"""Los invariantes de los tres ciclos, escritos como assert.

Cada assert es el invariante traducido a codigo, puesto justo donde se
evalua la condicion del ciclo. Si alguno falla, el programa revienta y
dice en que chequeo: es la forma barata de descartar una formula falsa
antes de gastar media hora demostrandola.
"""


def hay_testigo(A, v, ini, fin):
    # Version lenta pero obviamente correcta de la formula de I1
    resultado = False
    p = ini
    while p < fin:
        if A[p] == v:
            resultado = True
        p = p + 1
    return resultado


def buscar(lista, v):
    # Busqueda binaria iterativa, con I0 e I1 comprobados en cada chequeo
    N = len(lista)
    respuesta_total = hay_testigo(lista, v, 0, N)
    ini = 0
    fin = N
    while fin - ini > 1:
        assert 0 <= ini < fin <= N                                  # I0
        assert respuesta_total == hay_testigo(lista, v, ini, fin)   # I1
        mitad = (ini + fin) // 2
        if v < lista[mitad]:
            fin = mitad
        else:
            ini = mitad
    assert 0 <= ini < fin <= N                                      # I0, ultimo chequeo
    assert respuesta_total == hay_testigo(lista, v, ini, fin)       # I1, ultimo chequeo
    assert fin - ini == 1                                           # terminacion
    return lista[ini] == v


def f(x):
    # La funcion monotona del ejemplo continuo
    return x * x * x + x


def biseccion(v, a, b, eps):
    # Biseccion continua, con I0 e I1 comprobados en cada chequeo
    a_original = a
    b_original = b
    while b - a > eps:
        assert a_original <= a <= b <= b_original                   # I0
        assert f(a) <= v <= f(b)                                    # I1
        mitad = (a + b) / 2
        if f(mitad) < v:
            a = mitad
        else:
            b = mitad
    assert a_original <= a <= b <= b_original                       # I0, ultimo chequeo
    assert f(a) <= v <= f(b)                                        # I1, ultimo chequeo
    assert b - a <= eps                                             # terminacion
    return (a + b) / 2


def contenedores(envases, cap):
    # Contenedores de capacidad cap que exigen los envases, en orden
    cuenta = 1
    acumulado = 0
    i = 0
    while i < len(envases):
        if acumulado + envases[i] <= cap:
            acumulado = acumulado + envases[i]
        else:
            cuenta = cuenta + 1
            acumulado = envases[i]
        i = i + 1
    return cuenta


def optimo_a_mano(envases, m):
    # Version lenta pero obviamente correcta del valor que I1 menciona
    cap = max(envases)
    resultado = sum(envases)
    while cap <= sum(envases):
        if contenedores(envases, cap) <= m and resultado > cap:
            resultado = cap
        cap = cap + 1
    return resultado


def capacidad_minima(envases, m):
    # Busqueda sobre la respuesta, con I0 e I1 comprobados en cada chequeo
    referencia = optimo_a_mano(envases, m)
    a = max(envases)
    b = sum(envases)
    while a < b:
        assert max(envases) <= a <= b <= sum(envases)               # I0
        assert a <= referencia <= b                                 # I1
        mitad = (a + b) // 2
        if contenedores(envases, mitad) <= m:
            b = mitad
        else:
            a = mitad + 1
    assert max(envases) <= a <= b <= sum(envases)                   # I0, ultimo chequeo
    assert a <= referencia <= b                                     # I1, ultimo chequeo
    assert a == b                                                   # terminacion
    return a


def arreglos_ordenados(largo, valores):
    # Todos los arreglos ordenados de ese largo con esos valores
    if largo == 0:
        resultado = [[]]
    else:
        resultado = []
        for cola in arreglos_ordenados(largo - 1, valores):
            for x in valores:
                if len(cola) == 0 or x <= cola[0]:
                    resultado.append([x] + cola)
    return resultado


def arreglos(largo, valores):
    # Todos los arreglos de ese largo con esos valores
    if largo == 0:
        resultado = [[]]
    else:
        resultado = []
        for cola in arreglos(largo - 1, valores):
            for x in valores:
                resultado.append([x] + cola)
    return resultado


def comprobar():
    # Corre los tres ciclos sobre familias completas de entradas
    casos = 0
    for largo in range(1, 7):
        for A in arreglos_ordenados(largo, [0, 1, 2, 3]):
            for v in range(-1, 5):
                assert buscar(A, v) == (v in A), (A, v)
                casos = casos + 1
    print("buscar: {} casos".format(casos))

    casos = 0
    v = 1
    while v <= 200:
        biseccion(v, 0, 10, 1e-7)
        casos = casos + 1
        v = v + 1
    print("biseccion: {} valores de v".format(casos))

    casos = 0
    for largo in range(1, 6):
        for envases in arreglos(largo, [1, 2, 5]):
            for m in range(1, largo + 1):
                assert capacidad_minima(envases, m) == optimo_a_mano(envases, m)
                casos = casos + 1
    print("capacidad_minima: {} casos".format(casos))


comprobar()
print("ningun assert fallo: los invariantes resistieron todos los chequeos")
