"""Busqueda sobre la respuesta: la capacidad minima de contenedor.

Imprime la traza de la clase para los envases [5, 2, 2, 3, 2] y
comprueba el resultado contra una fuerza bruta que revisa todas las
formas de repartir los envases en bloques consecutivos.
"""


def contenedores(envases, cap):
    # Contenedores de capacidad cap que exigen los envases, en orden
    cuenta = 1
    acumulado = 0
    i = 0
    while i < len(envases):
        if acumulado + envases[i] <= cap:
            acumulado = acumulado + envases[i]
        else:
            cuenta = cuenta + 1
            acumulado = envases[i]
        i = i + 1
    return cuenta


def capacidad_minima(envases, m):
    # Menor capacidad de contenedor con la que bastan m contenedores
    a = max(envases)
    b = sum(envases)
    while a < b:
        mitad = (a + b) // 2
        if contenedores(envases, mitad) <= m:
            b = mitad
        else:
            a = mitad + 1
    return a


def traza(envases, m):
    # Imprime como la busqueda binaria cierra el rango de respuestas
    a = max(envases)
    b = sum(envases)
    print("capacidad_minima({}, {})".format(envases, m))
    print("  {:<10} {:>6} {:>10}  {}".format("rango", "mitad", "f(mitad)", "decision"))
    while a < b:
        mitad = (a + b) // 2
        cuenta = contenedores(envases, mitad)
        rango = "[{}..{}]".format(a, b)
        if cuenta <= m:
            decision = "alcanza: b = {}".format(mitad)
            b = mitad
        else:
            decision = "no alcanza: a = {}".format(mitad + 1)
            a = mitad + 1
        print("  {:<10} {:>6} {:>10}  {}".format(rango, mitad, cuenta, decision))
    print("  respuesta: {}".format(a))


def repartos(envases, m):
    # Todas las formas de partir los envases en m bloques consecutivos
    if m == 1:
        resultado = [[envases]]
    else:
        resultado = []
        corte = 1
        while corte <= len(envases) - m + 1:
            for resto in repartos(envases[corte:], m - 1):
                resultado.append([envases[:corte]] + resto)
            corte = corte + 1
    return resultado


def optimo(envases, m):
    # La menor capacidad posible, revisando todos los repartos
    mejor = sum(envases)
    for reparto in repartos(envases, m):
        peor_bloque = 0
        for bloque in reparto:
            if sum(bloque) > peor_bloque:
                peor_bloque = sum(bloque)
        if peor_bloque < mejor:
            mejor = peor_bloque
    return mejor


def combinaciones(largo, valores):
    # Todos los arreglos de ese largo con esos valores
    if largo == 0:
        resultado = [[]]
    else:
        resultado = []
        for cola in combinaciones(largo - 1, valores):
            for x in valores:
                resultado.append([x] + cola)
    return resultado


def comprobar():
    # Contrasta la busqueda binaria contra la fuerza bruta
    casos = 0
    for largo in range(1, 7):
        for envases in combinaciones(largo, [1, 2, 5]):
            for m in range(1, largo + 1):
                esperado = optimo(envases, m)
                obtenido = capacidad_minima(envases, m)
                assert obtenido == esperado, (envases, m, obtenido, esperado)
                casos = casos + 1
    print("{} casos comprobados contra fuerza bruta, ningun assert fallo".format(casos))


E = [5, 2, 2, 3, 2]

traza(E, 3)
print()
traza(E, 2)
print()
comprobar()
