
# Representaciones


```python
def camino_a_raiz(padre, x):
    # Representacion por arreglo de padres:
    # padre[x] es el padre de x, o None si x es la raiz.
    # Devuelve la lista de vertices desde x hasta la raiz.
    camino = [x]
    actual = x
    while padre[actual] is not None:
        actual = padre[actual]
        camino.append(actual)
    return camino


def profundidad(padre, x):
    # Profundidad de x = numero de aristas de la raiz a x.
    d = 0
    actual = x
    while padre[actual] is not None:
        actual = padre[actual]
        d = d + 1
    return d


def hijos(hijo_izq, hermano_der, x):
    # Representacion hijo-izquierdo, hermano-derecho (CLRS 10.4):
    # hijo_izq[x]     = primer hijo de x (o None)
    # hermano_der[x]  = siguiente hermano de x (o None)
    # Devuelve la lista de hijos de x, de izquierda a derecha.
    lista = []
    actual = hijo_izq[x]
    while actual is not None:
        lista.append(actual)
        actual = hermano_der[actual]
    return lista


def es_hoja(hijo_izq, x):
    return hijo_izq[x] is None


def altura(hijo_izq, hermano_der, x):
    # Altura de x = longitud del camino mas largo desde x a una hoja.
    h = 0
    if hijo_izq[x] is not None:
        max_h = -1
        for c in hijos(hijo_izq, hermano_der, x):
            hc = altura(hijo_izq, hermano_der, c)
            if hc > max_h:
                max_h = hc
        h = 1 + max_h
    return h


def contar_nodos(arbol):
    # Representacion recursiva: arbol = (valor, [subarboles]).
    # Caso base implicito: si subarboles esta vacio, el for no itera.
    valor, subarboles = arbol
    total = 1
    for sub in subarboles:
        total = total + contar_nodos(sub)
    return total

```

# Ejemplos representaciones
```python
from arboles import (
    camino_a_raiz,
    profundidad,
    hijos,
    es_hoja,
    altura,
    contar_nodos,
)


# Arbol de ejemplo (con raiz en a), el mismo de los diagramas del deck:
#           a
#         / | \
#        b  c  d
#       / \    |
#      e   f   g
padre = {
    'a': None,
    'b': 'a', 'c': 'a', 'd': 'a',
    'e': 'b', 'f': 'b',
    'g': 'd',
}

hijo_izq = {
    'a': 'b',
    'b': 'e',
    'c': None,
    'd': 'g',
    'e': None, 'f': None, 'g': None,
}

hermano_der = {
    'a': None,
    'b': 'c', 'c': 'd', 'd': None,
    'e': 'f', 'f': None, 'g': None,
}


# Mismo arbol en notacion recursiva (vista BNF):
#   T = (valor, [subarboles])
arbol_recursivo = (
    'a',
    [
        ('b', [
            ('e', []),
            ('f', []),
        ]),
        ('c', []),
        ('d', [
            ('g', []),
        ]),
    ],
)


# Arreglo de padres
print("Camino a la raiz desde f:", camino_a_raiz(padre, 'f'))
# Esperado: ['f', 'b', 'a']

print("Profundidad de f:", profundidad(padre, 'f'))
# Esperado: 2

print("Profundidad de a:", profundidad(padre, 'a'))
# Esperado: 0

print()

# Hijo-izquierdo, hermano-derecho
print("Hijos de a:", hijos(hijo_izq, hermano_der, 'a'))
# Esperado: ['b', 'c', 'd']

print("Hijos de b:", hijos(hijo_izq, hermano_der, 'b'))
# Esperado: ['e', 'f']

print("c es hoja:", es_hoja(hijo_izq, 'c'))
# Esperado: True

print("a es hoja:", es_hoja(hijo_izq, 'a'))
# Esperado: False

print("Altura del arbol (desde a):", altura(hijo_izq, hermano_der, 'a'))
# Esperado: 2

print()

# Vista recursiva
print("Numero de nodos (vista recursiva):", contar_nodos(arbol_recursivo))
# Esperado: 7

```