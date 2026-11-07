# Cuantas referencias caben en una list antes de que tenga que crecer.
# sys.getsizeof da los bytes del objeto; cada referencia ocupa 8.
import sys

def capacidad(lista):
    vacia = sys.getsizeof([])
    return (sys.getsizeof(lista) - vacia) // 8

lista = []
anterior = -1
i = 0
while i < 20:
    c = capacidad(lista)
    if c != anterior:
        print("len", len(lista), "cap", c)
        anterior = c
    lista.append(i)
    i = i + 1
