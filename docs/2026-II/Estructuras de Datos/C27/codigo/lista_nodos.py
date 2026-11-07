# TAD Lista, implementacion enlazada: un nodo por elemento.
from pila_nodos import Nodo


class Lista:
    def __init__(self):
        self.cabeza = None
        self.n = 0

    # devuelve el nodo de la posicion p; exige 0 <= p < n
    def nodo_en(self, p):
        actual = self.cabeza
        i = 0
        while i < p:
            actual = actual.siguiente
            i = i + 1
        return actual

    # exige 0 <= p <= tamano()
    def insertar(self, p, e):
        assert 0 <= p and p <= self.n
        if p == 0:
            self.cabeza = Nodo(e, self.cabeza)
        else:
            anterior = self.nodo_en(p - 1)
            anterior.siguiente = Nodo(e, anterior.siguiente)
        self.n = self.n + 1

    # exige 0 <= p < tamano()
    def eliminar(self, p):
        assert 0 <= p and p < self.n
        if p == 0:
            self.cabeza = self.cabeza.siguiente
        else:
            anterior = self.nodo_en(p - 1)
            anterior.siguiente = anterior.siguiente.siguiente
        self.n = self.n - 1

    # exige 0 <= p < tamano()
    def obtener(self, p):
        assert 0 <= p and p < self.n
        return self.nodo_en(p).dato

    def tamano(self):
        return self.n

    def imprimir(self):
        actual = self.cabeza
        texto = ""
        while actual is not None:
            texto = texto + " " + str(actual.dato)
            actual = actual.siguiente
        print(texto, "  n =", self.n)
