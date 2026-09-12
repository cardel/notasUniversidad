# Clase 1 - Repaso de estructuras de datos y notacion asintotica
# Listas: collections.deque mantiene referencias a los dos extremos,
# de modo que agregar y quitar por cualquiera de ellos cuesta O(1).

from collections import deque


def operaciones_en_los_extremos():
    l = deque()

    l.append(10)           # push_back,  O(1)
    l.appendleft(5)        # push_front, O(1)
    l.append(20)
    print('deque       =', list(l))

    print('front       =', l[0])      # O(1)
    print('back        =', l[-1])     # O(1)
    print('size        =', len(l))    # O(1)
    print('empty       =', len(l) == 0)

    ultimo = l.pop()       # pop_back,   O(1)
    primero = l.popleft()  # pop_front,  O(1)
    print('pop()       =', ultimo)
    print('popleft()   =', primero)
    print('deque       =', list(l))


def operaciones_en_una_posicion():
    # Llegar a la posicion k obliga a recorrer la secuencia: O(k).
    l = deque([1, 2, 3, 4, 5])

    l.insert(2, 99)        # insert(pos, x), O(k)
    print('tras insert =', list(l))

    del l[2]               # del l[pos],     O(k)
    print('tras del    =', list(l))


if __name__ == '__main__':
    print('Operaciones en los extremos')
    operaciones_en_los_extremos()

    print()
    print('Operaciones en una posicion intermedia')
    operaciones_en_una_posicion()
