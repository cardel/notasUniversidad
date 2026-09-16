# Clase 1 - Tabla hash con encadenamiento.
#
# Reproduce el ejemplo del tablero: una tabla de 10 casillas y la funcion
# hash del metodo de la division, h(k) = k mod 10. Sirve para ver de donde
# sale el O(1 + alpha) y, sobre todo, que pasa cuando la funcion hash no
# reparte bien las llaves.
#
# Para correrlo:  python3 tabla_hash.py


def tabla_vacia(m):
    # m casillas, cada una con su propia cadena (una lista enlazada, que
    # aqui se simula con una lista de Python).
    tabla = []
    for casilla in range(m):
        tabla.append([])
    return tabla


def h(llave, m):
    # Metodo de la division. Se puede usar modulo m porque el residuo de
    # dividir entre m siempre cae entre 0 y m-1, que es justo el rango de
    # casillas disponibles. Es una operacion aritmetica: O(1).
    return llave % m


def insertar(tabla, llave):
    # Calcular h cuesta O(1) y llegar a la casilla tambien, porque la tabla
    # es un arreglo y esta direccionada. Lo que se paga aparte es la cadena.
    casilla = h(llave, len(tabla))
    tabla[casilla].append(llave)
    return tabla


def buscar(tabla, llave):
    # El costo total se descompone en tres partes:
    #   1. calcular h(llave)          -> O(1)
    #   2. llegar a la casilla        -> O(1)
    #   3. recorrer la cadena de ahi  -> alpha en promedio
    # De ahi el O(1 + alpha). Devuelve tambien cuantos pasos costo la
    # cadena, para poder verlo.
    casilla = h(llave, len(tabla))
    cadena = tabla[casilla]
    i = 0
    encontrada = False

    while i < len(cadena) and not encontrada:
        encontrada = cadena[i] == llave
        i = i + 1

    return (encontrada, casilla, i)


def factor_de_carga(tabla):
    # alpha = n / m, o sea el promedio de elementos por casilla.
    n = 0
    for cadena in tabla:
        n = n + len(cadena)
    return n / len(tabla)


def largos(tabla):
    # Cuantos elementos quedo guardando cada casilla.
    resultado = []
    for cadena in tabla:
        resultado.append(len(cadena))
    return resultado


if __name__ == '__main__':
    m = 10

    print('El ejemplo del tablero')
    tabla = tabla_vacia(m)
    for llave in [11, 23, 101]:
        insertar(tabla, llave)
        print('  h({:3d}) = {}'.format(llave, h(llave, m)))

    print('  casillas:', tabla)
    print('  el 101 colisiona con el 11 y se encadena detras de el')

    encontrada, casilla, pasos = buscar(tabla, 101)
    print('  buscar 101 -> encontrada:', encontrada,
          '| casilla:', casilla, '| pasos en la cadena:', pasos)

    # Las dos tablas de abajo guardan 100 llaves en 10 casillas, asi que
    # las dos tienen el mismo factor de carga. Lo que cambia es como
    # quedan repartidas, y eso es lo que decide el costo real.
    print()
    print('100 llaves bien repartidas frente a 100 llaves multiplos de 10')

    buena = tabla_vacia(m)
    mala = tabla_vacia(m)
    for llave in range(100):
        insertar(buena, llave)         # 0, 1, 2, ... caen parejo
        insertar(mala, llave * 10)     # todas terminan en 0

    print('  alpha =', factor_de_carga(buena),
          'en las dos tablas (mismo n, mismo m)')
    print('  cadenas con buena distribucion:', largos(buena))
    print('  cadenas con mala  distribucion:', largos(mala))
    print('  la cadena mas larga pasa de', max(largos(buena)),
          'a', max(largos(mala)), 'elementos')
    print('  con la mala distribucion la tabla degenera en una sola lista')
    print('  enlazada y la busqueda vuelve a costar O(n)')
