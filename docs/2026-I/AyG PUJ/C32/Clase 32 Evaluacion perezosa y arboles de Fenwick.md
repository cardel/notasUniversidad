
# Evaluación perezosa

Problema: Actualizar un rango en un árbol de segmento es costoso puede ser $O(nlog(n))$ pierde los beneficios de la estructura.

Idea, la siguiente

1. Si el rango esta solapado, propago a los hijos y tomo su resulto posteriormente
2. Si el rango esta contenido, hago el cambio (suma, operación), y coloco la bandera de Lazy, esta bandera contiene el cambio que debo realizar
3. Si el rango esta disjunto, no hago nada

```python
def build(arr, tree, lazy, v, l, r):
    lazy[v] = 0
    if l == r:
        tree[v] = arr[l]
    else:
        mid = (l + r) // 2
        build(arr, tree, lazy, 2*v+1, l, mid)
        build(arr, tree, lazy, 2*v+2, mid+1, r)
        tree[v] = tree[2*v+1] + tree[2*v+2]


def push_down(tree, lazy, v, l, r):
    if lazy[v] != 0:
        mid = (l + r) // 2
        lh = 2*v+1
        rh = 2*v+2
        tree[lh] += lazy[v] * (mid - l + 1)
        lazy[lh] += lazy[v]
        tree[rh] += lazy[v] * (r - mid)
        lazy[rh] += lazy[v]
        lazy[v] = 0


def query(tree, lazy, v, l, r, ql, qr):
    if qr < l or r < ql:
        resultado = 0
    elif ql <= l and r <= qr:
        resultado = tree[v]
    else:
        push_down(tree, lazy, v, l, r)
        mid = (l + r) // 2
        resultado = (query(tree, lazy, 2*v+1, l, mid, ql, qr)
                     + query(tree, lazy, 2*v+2, mid+1, r, ql, qr))
    return resultado


def update_rango(tree, lazy, v, l, r, ql, qr, delta):
    if qr < l or r < ql:
        pass
    elif ql <= l and r <= qr:
        tree[v] += delta * (r - l + 1)
        lazy[v] += delta
    else:
        push_down(tree, lazy, v, l, r)
        mid = (l + r) // 2
        update_rango(tree, lazy, 2*v+1, l, mid, ql, qr, delta)
        update_rango(tree, lazy, 2*v+2, mid+1, r, ql, qr, delta)
        tree[v] = tree[2*v+1] + tree[2*v+2]


if __name__ == "__main__":
    arr = [2, 3, 1, 6, 4]
    n = len(arr)
    tree = [0] * (4 * n)
    lazy = [0] * (4 * n)

    build(arr, tree, lazy, 0, 0, n - 1)
    print("Árbol inicial:", tree[:9])
    print("Lazy inicial:", lazy[:9])

    update_rango(tree, lazy, 0, 0, n-1, 2, 4, 3)
    print("Después update_rango(2,4,3):", tree[:9])
    print("Lazy:", lazy[:9])

    print("query(1,4):", query(tree, lazy, 0, 0, n-1, 1, 4))   # esperado 23
```

La operación debe ser asociativa.

# Arboles de Fenwick

Es una optimización en memoria de los arboles de segmento 4N vs N.

Dos funciones

1. g(i) calcula el inicial del rango
2. h(i) permite calcular el siguiente (hacemos actualización)

Tener en cuenta que estos únicamente se aplican la operación es reversible y asociativa.


