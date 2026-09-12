# Comprobar invariantes con el computador.
#
# La idea es simple: un invariante afirma algo que debe ser cierto en CADA
# evaluacion de la condicion del ciclo. Si eso es cierto, se puede escribir
# tal cual como un assert y ponerlo justo ahi. Si el invariante esta mal,
# el assert falla y dice en que chequeo se rompio.
#
# Cada funcion de abajo es el algoritmo de la diapositiva con dos assert
# agregados: uno para I0 y otro para I1. Nada mas cambia.
#
# Para correrlo:  python3 comprobar.py


# ---------------------------------------------------------------------
# Las entradas de prueba: todos los arreglos cortos sobre un alfabeto
# pequenio. No hace falta azar; asi la prueba es siempre la misma y se
# puede repetir.
# ---------------------------------------------------------------------

def todosLosArreglos(alfabeto, largoMaximo):
    # Devuelve la lista de todos los arreglos de largo 0, 1, ..., largoMaximo
    # con elementos tomados del alfabeto.
    arreglos = [[]]
    frontera = [[]]
    largo = 0
    while largo < largoMaximo:
        siguiente = []
        for a in frontera:
            for x in alfabeto:
                siguiente.append(a + [x])
        arreglos = arreglos + siguiente
        frontera = siguiente
        largo = largo + 1
    return arreglos


# ---------------------------------------------------------------------
# La suma de la clase. I1: ans = A[0] + ... + A[i-1]
# ---------------------------------------------------------------------

def sumaAMano(A, i):
    # I1 escrito de la forma mas lenta y mas obvia posible. Es la version
    # con la que se contrasta lo que lleva el algoritmo.
    total = 0
    p = 0
    while p < i:
        total = total + A[p]
        p = p + 1
    return total


def sumarArreglo(A):
    i = 0
    ans = 0
    while i < len(A):
        assert 0 <= i <= len(A), 'I0 se rompio con i = %d' % i
        assert ans == sumaAMano(A, i), 'I1 se rompio en el chequeo i = %d' % i
        ans = ans + A[i]
        i = i + 1
    # El ultimo chequeo, el que hace terminar el ciclo, tambien cuenta.
    assert 0 <= i <= len(A), 'I0 se rompio al terminar'
    assert ans == sumaAMano(A, i), 'I1 se rompio al terminar'
    return ans


# ---------------------------------------------------------------------
# Ejercicio 1. I1: ans = cuantas posiciones de [0..i) tienen el valor v
# ---------------------------------------------------------------------

def ocurrenciasAMano(A, i, v):
    cuenta = 0
    p = 0
    while p < i:
        if A[p] == v:
            cuenta = cuenta + 1
        p = p + 1
    return cuenta


def contarOcurrencias(A, v):
    i = 0
    ans = 0
    while i < len(A):
        assert 0 <= i <= len(A), 'I0 se rompio con i = %d' % i
        assert ans == ocurrenciasAMano(A, i, v), 'I1 se rompio en el chequeo i = %d' % i
        if A[i] == v:
            ans = ans + 1
        i = i + 1
    assert 0 <= i <= len(A) and ans == ocurrenciasAMano(A, i, v), 'los invariantes se rompieron al terminar'
    return ans


# ---------------------------------------------------------------------
# Ejercicio 2. I1 es una disyuncion, asi que la version a mano devuelve
# la primera aparicion o -1, que es justo lo que el invariante afirma.
# ---------------------------------------------------------------------

def primeraAparicionAMano(A, i, v):
    resultado = -1
    p = i - 1
    while p >= 0:
        if A[p] == v:
            resultado = p
        p = p - 1
    return resultado


def buscarPosicion(A, v):
    i = 0
    ans = -1
    while i < len(A):
        assert 0 <= i <= len(A), 'I0 se rompio con i = %d' % i
        assert ans == primeraAparicionAMano(A, i, v), 'I1 se rompio en el chequeo i = %d' % i
        if A[i] == v and ans == -1:
            ans = i
        i = i + 1
    assert 0 <= i <= len(A) and ans == primeraAparicionAMano(A, i, v), 'los invariantes se rompieron al terminar'
    return ans


# ---------------------------------------------------------------------
# Ejercicio 3. I1: ac = floor(n / 10**ans). Aqui la version a mano es la
# division entera directa, que es la definicion del piso.
# ---------------------------------------------------------------------

def contarDigitos(n):
    ac = n
    ans = 0
    while ac > 0:
        assert ac >= 0, 'I0 se rompio con ans = %d' % ans
        assert ac == n // (10 ** ans), 'I1 se rompio en el chequeo ans = %d' % ans
        ac = ac // 10
        ans = ans + 1
    assert ac >= 0 and ac == n // (10 ** ans), 'los invariantes se rompieron al terminar'
    return ans


# ---------------------------------------------------------------------
# Un invariante MAL escrito, para ver como se ve la falla. Aqui I1 usa
# len(A) en vez de i: es la poscondicion disfrazada de invariante, el
# tropiezo de la diapositiva del ejercicio 1.
# ---------------------------------------------------------------------

def contarOcurrenciasConInvarianteMalo(A, v):
    i = 0
    ans = 0
    while i < len(A):
        assert ans == ocurrenciasAMano(A, len(A), v), \
            'I1 mal escrito: falla en el chequeo i = %d' % i
        if A[i] == v:
            ans = ans + 1
        i = i + 1
    return ans


if __name__ == '__main__':
    arreglos = todosLosArreglos([0, 1, 2], 5)
    print('arreglos de prueba:', len(arreglos), '(todos los de largo 0 a 5 sobre {0,1,2})')
    print()

    casos = 0
    for A in arreglos:
        assert sumarArreglo(A) == sumaAMano(A, len(A))
        for v in [0, 1, 2]:
            assert contarOcurrencias(A, v) == ocurrenciasAMano(A, len(A), v)
            assert buscarPosicion(A, v) == primeraAparicionAMano(A, len(A), v)
            casos = casos + 1
    print('la suma y los ejercicios 1 y 2:', casos, 'casos, ningun assert fallo')

    n = 1
    while n <= 20000:
        assert contarDigitos(n) == len(str(n))
        n = n + 1
    print('ejercicio 3: n de 1 a 20000, ningun assert fallo')

    print()
    print('Ahora a proposito, con el invariante mal escrito del ejercicio 1:')
    try:
        contarOcurrenciasConInvarianteMalo([1, 0, 1], 1)
        print('  no fallo (no deberia pasar)')
    except AssertionError as e:
        print('  AssertionError:', e)
        print('  Falla en el primer chequeo, que es la inicializacion: ese')
        print('  invariante ni siquiera arranca bien.')

    print()
    print('Correr no es demostrar: que ningun assert falle en estos casos no')
    print('prueba el algoritmo. Pero un assert que falla SI refuta el')
    print('invariante, y dice exactamente en que chequeo.')
