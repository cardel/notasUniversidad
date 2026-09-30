# Clase 1 - Repaso de estructuras de datos y notacion asintotica
# Contar operaciones linea a linea para estimar T(n).
# Referencia: CLRS, Seccion 2.2, p. 23.


def suma(datos):
    total = 0
    i = 0
    while i < len(datos):
        total = total + datos[i]
        i = i + 1
    return total


def suma_contando(datos):
    # La misma funcion, con un contador por linea: reproduce la tabla
    # de la diapositiva. La comparacion del while se ejecuta n + 1
    # veces porque la ultima vez es la que falla y termina el ciclo.
    veces = {
        'total = 0': 0,
        'i = 0': 0,
        'while i < len(datos)': 0,
        'total = total + datos[i]': 0,
        'i = i + 1': 0,
        'return total': 0,
    }

    total = 0
    veces['total = 0'] = veces['total = 0'] + 1

    i = 0
    veces['i = 0'] = veces['i = 0'] + 1

    while i < len(datos):
        veces['while i < len(datos)'] = veces['while i < len(datos)'] + 1
        total = total + datos[i]
        veces['total = total + datos[i]'] = veces['total = total + datos[i]'] + 1
        i = i + 1
        veces['i = i + 1'] = veces['i = i + 1'] + 1

    veces['while i < len(datos)'] = veces['while i < len(datos)'] + 1
    veces['return total'] = veces['return total'] + 1

    return (total, veces)


def mostrar_tabla(n):
    datos = list(range(n))
    total, veces = suma_contando(datos)

    print('n = ' + str(n) + ', suma = ' + str(total))
    for linea in veces:
        print('  {:26s} {:3d}'.format(linea, veces[linea]))
    print()


if __name__ == '__main__':
    print('suma([1, 2, 3, 4]) =', suma([1, 2, 3, 4]))
    print()

    mostrar_tabla(0)
    mostrar_tabla(5)
    mostrar_tabla(10)

    # T(n) = (c3 + c4 + c5) n + (c1 + c2 + c3 + c6): una recta en n.
    # Al duplicar n, el total de operaciones se duplica.
    for n in [10, 20, 40, 80]:
        _, veces = suma_contando(list(range(n)))
        operaciones = sum(veces.values())
        print('n = {:3d}   operaciones = {:3d}'.format(n, operaciones))
