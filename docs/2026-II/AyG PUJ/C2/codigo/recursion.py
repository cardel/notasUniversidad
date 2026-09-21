# Apendice - Recursion: que pasar en la llamada y donde parar.
#
# Las funciones del apendice, con una traza que muestra la pila de llamadas
# bajando (cada llamada con sus argumentos) y subiendo (cada valor que se
# devuelve). Al final, cada funcion se contrasta contra su version iterativa
# sobre muchos casos.
#
# Para correrlo:  python3 recursion.py

import sys


def suma_hasta(n):
    # 0 + 1 + ... + n
    if n == 0:
        resultado = 0
    else:
        resultado = suma_hasta(n - 1) + n
    return resultado


def contar_digitos(n):
    # Cuantos digitos decimales tiene n, con n >= 1
    if n < 10:
        resultado = 1
    else:
        resultado = contar_digitos(n // 10) + 1
    return resultado


def suma_arreglo(A, ini, fin):
    # A[ini] + ... + A[fin]; el rango vacio suma 0
    if ini > fin:
        resultado = 0
    else:
        resultado = A[ini] + suma_arreglo(A, ini + 1, fin)
    return resultado


def potencia(b, e):
    # b elevado a e, con e >= 0, partiendo el exponente por la mitad
    if e == 0:
        resultado = 1
    else:
        parcial = potencia(b, e // 2)
        if e % 2 == 0:
            resultado = parcial * parcial
        else:
            resultado = parcial * parcial * b
    return resultado


def esta(A, ini, fin, v):
    # True si v aparece en A[ini..fin]
    if ini > fin:
        resultado = False
    elif A[ini] == v:
        resultado = True
    else:
        resultado = esta(A, ini + 1, fin, v)
    return resultado


# ---- la traza: la misma funcion, anotando cada llamada y cada retorno ----

def suma_hasta_con_traza(n, nivel, filas):
    filas.append((nivel, "llama", "suma_hasta(" + str(n) + ")"))
    if n == 0:
        resultado = 0
    else:
        resultado = suma_hasta_con_traza(n - 1, nivel + 1, filas) + n
    filas.append((nivel, "devuelve", "suma_hasta(" + str(n) + ") = " + str(resultado)))
    return resultado


def suma_arreglo_con_traza(A, ini, fin, nivel, filas):
    filas.append((nivel, "llama", "suma_arreglo(A, " + str(ini) + ", " + str(fin) + ")"))
    if ini > fin:
        resultado = 0
    else:
        resultado = A[ini] + suma_arreglo_con_traza(A, ini + 1, fin, nivel + 1, filas)
    filas.append((nivel, "devuelve", str(resultado)))
    return resultado


def imprimir_traza(filas):
    for fila in filas:
        print("  " * fila[0] + fila[1] + "  " + fila[2])


# ---- las versiones iterativas contra las que se contrasta ----

def suma_hasta_iter(n):
    total = 0
    k = 1
    while k <= n:
        total = total + k
        k = k + 1
    return total


def contar_digitos_iter(n):
    cuenta = 1
    resto = n
    while resto >= 10:
        resto = resto // 10
        cuenta = cuenta + 1
    return cuenta


def suma_arreglo_iter(A, ini, fin):
    total = 0
    k = ini
    while k <= fin:
        total = total + A[k]
        k = k + 1
    return total


def potencia_iter(b, e):
    total = 1
    k = 0
    while k < e:
        total = total * b
        k = k + 1
    return total


def esta_iter(A, ini, fin, v):
    encontrado = False
    k = ini
    while k <= fin:
        if A[k] == v:
            encontrado = True
        k = k + 1
    return encontrado


if __name__ == "__main__":
    print("suma_hasta(3), la pila bajando y subiendo:")
    filas = []
    suma_hasta_con_traza(3, 0, filas)
    imprimir_traza(filas)
    print()
    print("suma_arreglo([5, 2, 8], 0, 2):")
    filas = []
    suma_arreglo_con_traza([5, 2, 8], 0, 2, 0, filas)
    imprimir_traza(filas)
    print()

    # contraste contra las iterativas
    fallos = 0
    n = 0
    while n <= 200:
        if suma_hasta(n) != suma_hasta_iter(n):
            fallos = fallos + 1
        n = n + 1
    n = 1
    while n <= 100000:
        if contar_digitos(n) != contar_digitos_iter(n):
            fallos = fallos + 1
        n = n + 7
    b = -3
    while b <= 3:
        e = 0
        while e <= 12:
            if potencia(b, e) != potencia_iter(b, e):
                fallos = fallos + 1
            e = e + 1
        b = b + 1
    arreglos = [[], [4], [4, 4], [1, 2, 3, 4, 5], [9, -2, 7, 0, 7, 3], [3, 1, 4, 1, 5, 9, 2, 6]]
    casos = 0
    for A in arreglos:
        ini = 0
        while ini <= len(A):
            fin = ini - 1
            while fin < len(A):
                casos = casos + 1
                if suma_arreglo(A, ini, fin) != suma_arreglo_iter(A, ini, fin):
                    fallos = fallos + 1
                v = -3
                while v <= 9:
                    if esta(A, ini, fin, v) != esta_iter(A, ini, fin, v):
                        fallos = fallos + 1
                    v = v + 1
                fin = fin + 1
            ini = ini + 1
    print("rangos de arreglo probados:", casos, "| fallos en total:", fallos)

    # el limite de la recursion en Python
    print("limite de recursion de Python:", sys.getrecursionlimit())
