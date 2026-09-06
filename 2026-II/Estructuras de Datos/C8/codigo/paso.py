def sumar(lst):
    suma = 0
    for e in lst:
        suma += e
    lst[0] = 1000
    return suma


if __name__ == "__main__":
    lista = [x for x in range(0, 101)]
    print(lista[0:20])
    print(sumar(lista))
    print(lista[0:20])
