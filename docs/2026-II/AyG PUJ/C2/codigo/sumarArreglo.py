# La suma de un arreglo - el ejemplo de la clase.
#
# Es el primer ciclo de la clase. Aqui esta para que usted pueda correr la
# traza que aparece en la diapositiva y comprobar el invariante por su
# cuenta: el programa imprime, en cada chequeo de la condicion, el estado
# (i, ans) y el valor que I1 predice para ese estado.
#
# Para correrlo:  python3 sumarArreglo.py


def sumarArreglo(A):
    # I0: 0 <= i <= N          (cotas del indice)
    # I1: ans = A[0] + ... + A[i-1]   (lo que lleva el acumulador)
    i = 0
    ans = 0
    while i < len(A):
        ans = ans + A[i]
        i = i + 1
    return ans


def traza(A):
    # Reproduce la cadena de estados de la diapositiva. La ultima columna
    # es I1 evaluado a mano: si alguna fila no coincide, el invariante
    # propuesto estaria mal.
    filas = []
    i = 0
    ans = 0
    filas.append((i, ans, sum(A[0:i])))
    while i < len(A):
        ans = ans + A[i]
        i = i + 1
        filas.append((i, ans, sum(A[0:i])))
    return filas


if __name__ == '__main__':
    A = [9, 4, -5, 1, 8, 3]
    print('A =', A)
    print()
    print('chequeo   (i, ans)     I1: A[0] + ... + A[i-1]')
    for (i, ans, esperado) in traza(A):
        marca = 'ok' if ans == esperado else 'NO CUMPLE'
        print('          ({}, {:2d})      {:2d}   {}'.format(i, ans, esperado, marca))
    print()
    print('retorna', sumarArreglo(A), '| suma real', sum(A))
