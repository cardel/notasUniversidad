# Clase 1 - Monticulo (heap) de maximos.
#
# Reproduce paso a paso la traza que se hizo en el tablero. La idea central
# es que NO hace falta implementar el arbol con nodos y apuntadores: basta
# un arreglo indexado desde 1, y las formulas de la clase aplican directo.
#
#     hijo izquierdo de i  ->  2*i
#     hijo derecho de i    ->  2*i + 1
#     padre de i           ->  i // 2
#
# La posicion 0 del arreglo no se usa; queda de relleno para que los
# indices cuadren con esas formulas.
#
# Para correrlo:  python3 monticulo.py


def hijo_izquierdo(i):
    return 2 * i


def hijo_derecho(i):
    return 2 * i + 1


def padre(i):
    # La division entera es el piso de i/2, que es justo lo que se necesita.
    return i // 2


def heapify(monticulo, i, mostrar):
    # Hunde el elemento de la posicion i hasta que sus dos hijos sean
    # menores o iguales que el, es decir, hasta restablecer la propiedad
    # de orden.
    #
    # Cada intercambio cuesta O(1) (son dos posiciones de un arreglo) y baja
    # el elemento un nivel. Como el arbol esta balanceado por la propiedad
    # de forma, su altura es log n: de ahi sale el O(log n).
    n = len(monticulo) - 1     # -1 porque la posicion 0 no cuenta
    listo = False

    while not listo:
        mayor = i
        izq = hijo_izquierdo(i)
        der = hijo_derecho(i)

        # Se compara contra los dos hijos, siempre que existan.
        if izq <= n and monticulo[izq] > monticulo[mayor]:
            mayor = izq
        if der <= n and monticulo[der] > monticulo[mayor]:
            mayor = der

        if mayor == i:
            listo = True       # ya es mayor que sus hijos: termina
        else:
            monticulo[i], monticulo[mayor] = monticulo[mayor], monticulo[i]
            if mostrar:
                print('  intercambia con el hijo mayor:', monticulo[1:])
            i = mayor          # sigue hundiendose desde su nueva posicion

    return monticulo


def extraer_maximo(monticulo, mostrar):
    # El maximo siempre esta en la raiz, o sea la posicion 1: leerlo cuesta
    # O(1). Sacarlo es lo que cuesta, porque borrar la raiz partiria el
    # arbol en dos. Lo que se hace es:
    #   1. guardar el maximo,
    #   2. subir el ultimo elemento a la raiz,
    #   3. hundirlo con heapify.
    maximo = monticulo[1]
    ultimo = monticulo.pop()

    if len(monticulo) > 1:
        monticulo[1] = ultimo
        if mostrar:
            print('  sube el ultimo a la raiz  :', monticulo[1:])
        heapify(monticulo, 1, mostrar)

    return maximo


def insertar(monticulo, valor, mostrar):
    # El camino contrario: el elemento entra al final y sube mientras sea
    # mayor que su padre. Como maximo sube la altura del arbol, o sea
    # log n intercambios.
    monticulo.append(valor)
    i = len(monticulo) - 1
    listo = False

    while not listo:
        if i > 1 and monticulo[i] > monticulo[padre(i)]:
            p = padre(i)
            monticulo[i], monticulo[p] = monticulo[p], monticulo[i]
            i = p
            if mostrar:
                print('  sube', valor, 'un nivel      :', monticulo[1:])
        else:
            listo = True       # llego a la raiz o su padre ya es mayor

    return monticulo


if __name__ == '__main__':
    # El monticulo del tablero. La posicion 0 va en None y no se usa.
    monticulo = [None, 10, 8, 6, 3, 5, 4, 1]
    print('monticulo inicial          :', monticulo[1:])
    print('  raiz (el maximo)         :', monticulo[1])
    print('  hijo izquierdo de la pos 2:', monticulo[hijo_izquierdo(2)])
    print('  hijo derecho   de la pos 2:', monticulo[hijo_derecho(2)])

    print()
    print('pop: extraer el maximo')
    maximo = extraer_maximo(monticulo, True)
    print('  maximo extraido          :', maximo)
    print('  monticulo resultante     :', monticulo[1:])

    print()
    print('push: insertar el 20')
    insertar(monticulo, 20, True)
    print('  monticulo resultante     :', monticulo[1:])
