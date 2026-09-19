"""Busqueda binaria sobre un arreglo ordenado, por indices.

Imprime la traza de la clase y comprueba el algoritmo contra el
operador `in` de Python sobre arreglos ordenados generados de forma
sistematica.
"""


def buscar(lista, v, ini, fin):
    # Determina si v esta en lista[ini..fin), que viene ordenado
    if fin - ini == 1:
        resultado = lista[ini] == v
    else:
        mitad = (ini + fin) // 2
        if v < lista[mitad]:
            resultado = buscar(lista, v, ini, mitad)
        else:
            resultado = buscar(lista, v, mitad, fin)
    return resultado


def traza(lista, v):
    # Imprime, chequeo por chequeo, como se cierra el intervalo
    ini = 0
    fin = len(lista)
    print("buscar({}, {}, 0, {})".format(lista, v, len(lista)))
    print("  {:<10} {:>5} {:>9}  {}".format("intervalo", "mitad", "A[mitad]", "decision"))
    while fin - ini > 1:
        mitad = (ini + fin) // 2
        rango = "[{}..{})".format(ini, fin)
        if v < lista[mitad]:
            decision = "mitad izquierda"
            fin = mitad
        else:
            decision = "mitad derecha"
            ini = mitad
        print("  {:<10} {:>5} {:>9}  {}".format(rango, mitad, lista[mitad], decision))
    print("  caso base [{}..{}): A[{}] = {} -> {}".format(
        ini, fin, ini, lista[ini], lista[ini] == v))


def combinaciones_ordenadas(largo, valores):
    # Todos los arreglos ordenados de ese largo con esos valores
    if largo == 0:
        resultado = [[]]
    else:
        resultado = []
        colas = combinaciones_ordenadas(largo - 1, valores)
        for cola in colas:
            for x in valores:
                if len(cola) == 0 or x <= cola[0]:
                    resultado.append([x] + cola)
    return resultado


def comprobar():
    # Contrasta buscar contra el operador in, sin usar azar
    valores = [0, 1, 2, 3]
    casos = 0
    for largo in range(1, 7):
        for arreglo in combinaciones_ordenadas(largo, valores):
            for v in range(-1, 5):
                esperado = v in arreglo
                obtenido = buscar(arreglo, v, 0, len(arreglo))
                assert obtenido == esperado, (arreglo, v, obtenido, esperado)
                casos = casos + 1
    print("{} casos comprobados, ningun assert fallo".format(casos))


A = [1, 4, 6, 8, 10, 13, 20, 22]

traza(A, 13)
print()
traza(A, 5)
print()
comprobar()
