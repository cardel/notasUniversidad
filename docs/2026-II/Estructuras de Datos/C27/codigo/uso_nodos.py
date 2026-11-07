# La pila y la lista sobre nodos, en uso.
from pila_nodos import Pila
from lista_nodos import Lista

p = Pila()
p.apilar(8)
p.apilar(3)
p.apilar(6)
print("tope:", p.tope(), " tamano:", p.tamano())
p.desapilar()
print("tope:", p.tope(), " tamano:", p.tamano())

lista = Lista()
lista.insertar(0, 20)
lista.insertar(1, 50)
lista.insertar(1, 35)
lista.insertar(0, 10)
lista.imprimir()
lista.eliminar(2)
lista.imprimir()
print("obtener(1):", lista.obtener(1))
