# Contrasta el valor exacto de tres recurrencias contra la formula
# cerrada que sale de resolverlas por expansion.
#
# Se toma c = 1 (el trabajo de dividir y combinar) y T(1) = 1, para que
# las formulas queden en numeros redondos.


def maximo_exacto(n):
    # T(n) = 2 T(n/2) + 1, con T(1) = 1
    if n == 1:
        resultado = 1
    else:
        resultado = 2 * maximo_exacto(n // 2) + 1
    return resultado


def ordenar_exacto(n):
    # T(n) = 2 T(n/2) + n, con T(1) = 1
    if n == 1:
        resultado = 1
    else:
        resultado = 2 * ordenar_exacto(n // 2) + n
    return resultado


def buscar_exacto(n):
    # T(n) = T(n/2) + 1, con T(1) = 1
    if n == 1:
        resultado = 1
    else:
        resultado = buscar_exacto(n // 2) + 1
    return resultado


def logaritmo_base_2(n):
    # Cuantas veces hay que dividir n entre 2 para llegar a 1.
    # n se supone potencia de 2, asi que la division es exacta.
    k = 0
    actual = n
    while actual > 1:
        actual = actual // 2
        k = k + 1
    return k


def maximo_formula(n):
    # De la expansion: T(n) = (c + d) n - c, con c = d = 1
    return 2 * n - 1


def ordenar_formula(n):
    # De la expansion: T(n) = c n log2(n) + d n, con c = d = 1
    return n * logaritmo_base_2(n) + n


def buscar_formula(n):
    # De la expansion: T(n) = c log2(n) + d, con c = d = 1
    return logaritmo_base_2(n) + 1


def potencias_de_dos(exponente_maximo):
    # [1, 2, 4, ..., 2^exponente_maximo]
    tamanos = []
    for k in range(exponente_maximo + 1):
        tamanos.append(2 ** k)
    return tamanos


def tabla(tamanos):
    print("      n |  maximo   formula |    ordenar   formula |  buscar  formula")
    print("--------+-------------------+----------------------+-----------------")
    for n in tamanos[:8]:
        print("%7d | %7d %9d | %10d %9d | %7d %8d"
              % (n,
                 maximo_exacto(n), maximo_formula(n),
                 ordenar_exacto(n), ordenar_formula(n),
                 buscar_exacto(n), buscar_formula(n)))


def verificar(tamanos):
    # Cada valor exacto de la recurrencia contra su formula cerrada.
    for n in tamanos:
        assert maximo_exacto(n) == maximo_formula(n), \
            "maximo: la formula falla en n = %d" % n
        assert ordenar_exacto(n) == ordenar_formula(n), \
            "ordenar: la formula falla en n = %d" % n
        assert buscar_exacto(n) == buscar_formula(n), \
            "buscar: la formula falla en n = %d" % n
    print("%d tamanos verificados, de n = 1 a n = %d: ningun assert fallo"
          % (len(tamanos), tamanos[-1]))


def formula_mal_despejada(n):
    # Un error tipico: las dos recurrencias parten en dos mitades, asi que
    # se le aplica al ordenamiento la respuesta del maximo, sin notar que
    # el termino del nivel i cambio de 2^i c a c n.
    return 2 * n - 1


def mostrar_el_fallo(tamanos):
    # Una formula equivocada se cae sola en el primer tamano que no cuadra.
    try:
        for n in tamanos:
            assert ordenar_exacto(n) == formula_mal_despejada(n), \
                "formula mal despejada: falla en n = %d (exacto %d, formula %d)" \
                % (n, ordenar_exacto(n), formula_mal_despejada(n))
        print("la formula equivocada paso, cosa que no deberia ocurrir")
    except AssertionError as fallo:
        print("AssertionError: %s" % fallo)


tamanos = potencias_de_dos(20)
tabla(tamanos)
print()
verificar(tamanos)
mostrar_el_fallo(tamanos)
