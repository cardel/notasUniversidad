"""
Conjuntos disjuntos con union por rango y compresion de caminos
Noviembre 11 de 2026

"""


def make_set(p, rango, x):
    p[x] = x
    rango[x] = 0


def find_set(p, x):
    if p[x] != x:
        p[x] = find_set(p, p[x])
    return p[x]


def union(p, rango, x, y):
    rx = find_set(p, x)
    ry = find_set(p, y)
    if rx != ry:
        if rango[rx] < rango[ry]:
            p[rx] = ry
        elif rango[rx] > rango[ry]:
            p[ry] = rx
        else:
            p[ry] = rx
            rango[rx] = rango[rx] + 1


if __name__ == '__main__':
    p = {}
    rango = {}
    for x in range(1, 10):
        make_set(p, rango, x)
    for (x, y) in [(5, 1), (1, 3), (7, 2), (4, 8), (6, 9), (3, 2), (8, 9)]:
        union(p, rango, x, y)
    print('p     =', p)
    print('rango =', rango)
    print('find_set(9) =', find_set(p, 9))
    print('p tras find_set(9) =', p)
