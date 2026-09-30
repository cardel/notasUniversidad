# Apendice - El maximo recursivo y su correctitud por induccion estructural.
#
# El mismo codigo de la clase de divide y venceras. La prueba formal esta
# en el apendice; este archivo comprueba dos cosas por computador:
#
#   1. Que la particion siempre reduce: cada llamada trabaja sobre un
#      rango estrictamente mas pequenio (si no, la recursion no toca fondo).
#   2. Que el resultado coincide con el maximo real para todos los rangos
#      de todos los arreglos cortos de prueba.
#
# Para correrlo:  python3 maximo_recursivo.py


def maximo(lista, ini, fin):
    # Maximo de lista[ini..fin] partiendo el rango en dos
    n = fin - ini + 1
    if ini == fin:
        resultado = lista[ini]
    else:
        mitad = (ini + fin) // 2
        # la obligacion de la prueba: ambos subrangos son mas pequenios
        assert ini <= mitad < fin, 'la particion no separa: [%d..%d]' % (ini, fin)
        assert (mitad - ini + 1) < n, 'el subrango izquierdo no reduce'
        assert (fin - mitad) < n, 'el subrango derecho no reduce'
        max_izq = maximo(lista, ini, mitad)
        max_der = maximo(lista, mitad + 1, fin)
        if max_izq >= max_der:
            resultado = max_izq
        else:
            resultado = max_der
    return resultado


def maximoAMano(lista, ini, fin):
    # La version lenta y obvia contra la que se contrasta.
    mayor = lista[ini]
    k = ini + 1
    while k <= fin:
        if lista[k] > mayor:
            mayor = lista[k]
        k = k + 1
    return mayor


if __name__ == '__main__':
    A = [3, 9, 1, 7, 4, 8, 2, 6]
    print('A =', A)
    print('maximo(A, 0, 7) =', maximo(A, 0, 7))
    print()

    # Todos los arreglos de largo 1 a 5 sobre {0, 1, 2, 3} y TODOS sus
    # rangos [ini..fin]: la induccion promete correctitud para cada rango,
    # asi que se prueba cada rango.
    alfabeto = [0, 1, 2, 3]
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
        for ini in range(len(a)):
            for fin in range(ini, len(a)):
                assert maximo(a, ini, fin) == maximoAMano(a, ini, fin)
                casos = casos + 1
    print(casos, 'rangos probados: ningun assert fallo')
