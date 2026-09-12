# Ejercicio 4 - Cuantos digitos decimales tiene n.
#
# El invariante es numerico: aqui no hay arreglo ni indice, y lo que
# avanza es una division entera. La conclusion sale de apretar ans entre
# dos desigualdades, igual que en las demostraciones de cotas.
#
# La estabilidad usa la propiedad de pisos anidados
#     floor(floor(n / a) / b) = floor(n / (a * b))
# que el bloque de abajo comprueba antes de imprimir la traza.
#
# Para correrlo:  python3 contarDigitos.py


def contarDigitos(n):
    # I0: ac >= 0
    # I1: ac = floor(n / 10**ans)
    ac = n
    ans = 0
    while ac > 0:
        ac = ac // 10
        ans = ans + 1
    return ans


def traza(n):
    filas = []
    ac = n
    ans = 0
    filas.append((ans, ac, n // (10 ** ans)))
    while ac > 0:
        ac = ac // 10
        ans = ans + 1
        filas.append((ans, ac, n // (10 ** ans)))
    return filas


if __name__ == '__main__':
    n = 4057
    print('n =', n)
    print()
    print('chequeo   (ans, ac)    I1: floor(n / 10**ans)')
    for (ans, ac, esperado) in traza(n):
        marca = 'ok' if ac == esperado else 'NO CUMPLE'
        print('          ({}, {:4d})     {:4d}   {}'.format(ans, ac, esperado, marca))
    print()
    print('retorna', contarDigitos(n), '| digitos reales', len(str(n)))

    # La propiedad de pisos anidados, comprobada en un rango amplio.
    pisos = True
    m = 0
    while m < 20000:
        k = 0
        while k < 5:
            pisos = pisos and (m // (10 ** k)) // 10 == m // (10 ** (k + 1))
            k = k + 1
        m = m + 1
    print('pisos anidados floor(floor(n/10**k)/10) = floor(n/10**(k+1)):', pisos)

    # El caso limite del enunciado.
    print('contarDigitos(0) =', contarDigitos(0),
          '-> el 0 tiene un digito, pero la precondicion pide n >= 1')
