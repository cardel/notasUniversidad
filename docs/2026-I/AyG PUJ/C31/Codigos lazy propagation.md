
```python
# Segment tree por niveles sobre suma.
# S = {'tree': [...], 'lazy': [...], 'N': N}
#   tree[v] agregado del intervalo de v, ya incorpora lazy[v]
#   lazy[v] suma pendiente de propagar a los hijos de v


def build_rec(tree, A, v, l, r):
    respuesta = None
    if l == r:
        tree[v] = A[l]
    else:
        m = (l + r) // 2
        build_rec(tree, A, 2 * v + 1, l, m)
        build_rec(tree, A, 2 * (v + 1), m + 1, r)
        tree[v] = tree[2 * v + 1] + tree[2 * (v + 1)]
    return respuesta


def build(A):
    N = len(A)
    tree = [0] * (4 * N)
    lazy = [0] * (4 * N)
    if N > 0:
        build_rec(tree, A, 0, 0, N - 1)
    return {"tree": tree, "lazy": lazy, "N": N}


def push_down(S, v, l, r):
    hecho = False
    if S["lazy"][v] != 0:
        delta = S["lazy"][v]
        m = (l + r) // 2
        izq = 2 * v + 1
        der = 2 * (v + 1)
        S["tree"][izq] = S["tree"][izq] + (m - l + 1) * delta
        S["lazy"][izq] = S["lazy"][izq] + delta
        S["tree"][der] = S["tree"][der] + (r - m) * delta
        S["lazy"][der] = S["lazy"][der] + delta
        S["lazy"][v] = 0
        hecho = True
    return hecho


def query_rec(S, v, l, r, ql, qr):
    resultado = 0
    if not (qr < l or r < ql):
        if ql <= l and r <= qr:
            resultado = S["tree"][v]
        else:
            push_down(S, v, l, r)
            m = (l + r) // 2
            resultado = query_rec(S, 2 * v + 1, l, m, ql, qr) + query_rec(
                S, 2 * (v + 1), m + 1, r, ql, qr
            )
    return resultado


def query(S, ql, qr):
    return query_rec(S, 0, 0, S["N"] - 1, ql, qr)


def update_rec(S, v, l, r, i, valor):
    respuesta = None
    if l == r:
        S["tree"][v] = valor
    else:
        push_down(S, v, l, r)
        m = (l + r) // 2
        if i <= m:
            update_rec(S, 2 * v + 1, l, m, i, valor)
        else:
            update_rec(S, 2 * (v + 1), m + 1, r, i, valor)
        S["tree"][v] = S["tree"][2 * v + 1] + S["tree"][2 * (v + 1)]
    return respuesta


def update(S, i, valor):
    update_rec(S, 0, 0, S["N"] - 1, i, valor)


def update_rango_rec(S, v, l, r, ql, qr, delta):
    respuesta = None
    if not (qr < l or r < ql):
        if ql <= l and r <= qr:
            S["tree"][v] = S["tree"][v] + (r - l + 1) * delta
            S["lazy"][v] = S["lazy"][v] + delta
        else:
            push_down(S, v, l, r)
            m = (l + r) // 2
            update_rango_rec(S, 2 * v + 1, l, m, ql, qr, delta)
            update_rango_rec(S, 2 * (v + 1), m + 1, r, ql, qr, delta)
            S["tree"][v] = S["tree"][2 * v + 1] + S["tree"][2 * (v + 1)]
    return respuesta


def update_rango(S, ql, qr, delta):
    update_rango_rec(S, 0, 0, S["N"] - 1, ql, qr, delta)


if __name__ == "__main__":
    # Ejemplo PDF guia Mayo 12 / 2025.
    A = [8, 1, 5, 3, 9, 1, 2, 7, 10]
    S = build(A)
    print(S)

    print("A =", A)
    print("query(0, 8) =", query(S, 0, 8), "esperado", sum(A))
    print("query(2, 5) =", query(S, 2, 5), "esperado", sum(A[2:6]))
    print("query(4, 4) =", query(S, 4, 4), "esperado", A[4])

    print()
    update(S, 4, 100)
    print("tras update(4, 100)")
    print("query(2, 5) =", query(S, 2, 5), "esperado", A[2] + A[3] + 100 + A[5])

    print()
    update_rango(S, 1, 3, 10)
    print("tras update_rango(1, 3, 10)")
    print(
        "query(0, 8) =",
        query(S, 0, 8),
        "esperado",
        8 + 11 + 15 + 13 + 100 + 1 + 2 + 7 + 10,
    )
    print("query(1, 3) =", query(S, 1, 3), "esperado", 11 + 15 + 13)

```