# Lo que viaja a la funcion no es la lista: es su ubicacion en memoria


def sumar(lista):
    suma = 0
    for valor in lista:
        suma = suma + valor
    lista[0] = 1000
    return suma


if __name__ == "__main__":
    lista = [i for i in range(0, 101)]
    print(lista[0:20])
    print(sumar(lista))
    print(lista[0:20])
