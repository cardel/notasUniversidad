"""Biseccion sobre una funcion monotona continua.

Imprime la traza de la clase para f(x) = x^3 + x con v = 10 y
comprueba que el error final nunca supera la tolerancia pedida.
"""


def f(x):
    # La funcion monotona del problema
    return x * x * x + x


def biseccion(v, a, b, eps):
    # Aproxima x en [a, b] con f(x) = v, para f creciente
    while b - a > eps:
        mitad = (a + b) / 2
        if f(mitad) < v:
            a = mitad
        else:
            b = mitad
    return (a + b) / 2


def traza(v, a, b, eps, vueltas):
    # Imprime las primeras vueltas del ciclo
    print("biseccion({}, {}, {}, {})".format(v, a, b, eps))
    print("  {:<20} {:>9} {:>10}  {}".format("intervalo", "mitad", "f(mitad)", "decision"))
    k = 0
    while b - a > eps and k < vueltas:
        mitad = (a + b) / 2
        rango = "[{:.4f}, {:.4f}]".format(a, b)
        if f(mitad) < v:
            decision = "sube a"
            a = mitad
        else:
            decision = "baja b"
            b = mitad
        print("  {:<20} {:>9.4f} {:>10.4f}  {}".format(rango, mitad, f(mitad), decision))
        k = k + 1
    print("  ... hasta que el intervalo mide menos que {}".format(eps))


def vueltas_necesarias(a, b, eps):
    # Cuantas veces hay que partir [a, b] para bajar de eps
    k = 0
    ancho = b - a
    while ancho > eps:
        ancho = ancho / 2
        k = k + 1
    return k


def comprobar():
    # El resultado siempre cae dentro de la tolerancia pedida
    casos = 0
    eps = 1e-7
    v = 1
    while v <= 200:
        x = biseccion(v, 0, 10, eps)
        # f es creciente, asi que basta acotar el error en x
        exacto = 0
        paso = 10.0
        while paso > 1e-12:
            if f(exacto + paso) <= v:
                exacto = exacto + paso
            else:
                paso = paso / 2
        assert abs(x - exacto) < 1e-5, (v, x, exacto)
        casos = casos + 1
        v = v + 1
    print("{} valores de v comprobados, ningun assert fallo".format(casos))


traza(10, 0, 3, 1e-6, 4)
print()
print("resultado: x = {:.7f}".format(biseccion(10, 0, 3, 1e-6)))
print("f(x)      = {:.7f}".format(f(biseccion(10, 0, 3, 1e-6))))
print("vueltas   = {}".format(vueltas_necesarias(0, 3, 1e-6)))
print()
comprobar()
