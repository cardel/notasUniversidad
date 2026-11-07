# TAD Pila sobre nodos: la cima es la cabeza de la cadena.


class Nodo:
    def __init__(self, dato, siguiente):
        self.dato = dato
        self.siguiente = siguiente


class Pila:
    def __init__(self):
        self.cima = None
        self.n = 0

    def apilar(self, e):
        nuevo = Nodo(e, self.cima)
        self.cima = nuevo
        self.n = self.n + 1

    # exige not vacia()
    def desapilar(self):
        assert not self.vacia()
        self.cima = self.cima.siguiente
        self.n = self.n - 1

    # exige not vacia()
    def tope(self):
        assert not self.vacia()
        return self.cima.dato

    def tamano(self):
        return self.n

    def vacia(self):
        return self.n == 0
