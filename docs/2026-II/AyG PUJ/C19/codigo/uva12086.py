import sys

# UVa 12086 - Potentiometers
# Un arreglo de N resistencias. Dos acciones, repetidas hasta END:
#   S x r   pone la resistencia x en r ohmios
#   M x y   mide la suma de las resistencias de x a y
# Es el arbol de segmentos de la clase, sin nada encima: update para S
# y query para M.


def build(A, tree, v, l, r):
    if l == r:
        tree[v] = A[l]
    else:
        m = (l + r) // 2
        build(A, tree, 2 * v + 1, l, m)
        build(A, tree, 2 * v + 2, m + 1, r)
        tree[v] = tree[2 * v + 1] + tree[2 * v + 2]


def query(tree, v, l, r, ql, qr):
    if qr < l or r < ql:
        resultado = 0                      # disjunto: neutro de la suma
    elif ql <= l and r <= qr:
        resultado = tree[v]                # contenido
    else:
        m = (l + r) // 2                   # solapado
        resultado = (query(tree, 2 * v + 1, l, m, ql, qr)
                     + query(tree, 2 * v + 2, m + 1, r, ql, qr))
    return resultado


def update(tree, v, l, r, i, valor):
    if l == r:
        tree[v] = valor
    else:
        m = (l + r) // 2
        if i <= m:
            update(tree, 2 * v + 1, l, m, i, valor)
        else:
            update(tree, 2 * v + 2, m + 1, r, i, valor)
        tree[v] = tree[2 * v + 1] + tree[2 * v + 2]


def main():
    datos = sys.stdin.read().split()
    pos = 0
    salida = []
    caso = 1
    n = int(datos[pos])
    pos = pos + 1
    while n != 0:
        A = [0] * n
        for k in range(n):
            A[k] = int(datos[pos])
            pos = pos + 1
        tree = [0] * (4 * n)
        build(A, tree, 0, 0, n - 1)
        if caso > 1:
            salida.append("")              # linea en blanco entre casos
        salida.append("Case " + str(caso) + ":")
        accion = datos[pos]
        pos = pos + 1
        while accion != "END":
            x = int(datos[pos])
            y = int(datos[pos + 1])
            pos = pos + 2
            if accion == "S":
                update(tree, 0, 0, n - 1, x - 1, y)
            else:
                salida.append(str(query(tree, 0, 0, n - 1, x - 1, y - 1)))
            accion = datos[pos]
            pos = pos + 1
        caso = caso + 1
        n = int(datos[pos])
        pos = pos + 1
    sys.stdout.write("\n".join(salida) + "\n")


main()
