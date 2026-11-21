# Arbol de segmentos sobre suma, con la indexacion del titular:
# la raiz es 0 y los hijos de v son 2v+1 y 2(v+1).


def build_rec(tree, A, v, l, r):
    if l == r:
        tree[v] = A[l]
    else:
        m = (l + r) // 2
        build_rec(tree, A, 2 * v + 1, l, m)
        build_rec(tree, A, 2 * (v + 1), m + 1, r)
        tree[v] = tree[2 * v + 1] + tree[2 * (v + 1)]


def build(A):
    N = len(A)
    tree = [0] * (4 * N)
    build_rec(tree, A, 0, 0, N - 1)
    return {"tree": tree, "N": N}


def query_rec(S, v, l, r, ql, qr):
    resultado = 0
    if not (qr < l or r < ql):
        if ql <= l and r <= qr:
            resultado = S["tree"][v]
        else:
            m = (l + r) // 2
            resultado = (query_rec(S, 2 * v + 1, l, m, ql, qr)
                         + query_rec(S, 2 * (v + 1), m + 1, r, ql, qr))
    return resultado


def query(S, ql, qr):
    return query_rec(S, 0, 0, S["N"] - 1, ql, qr)


def update_rec(S, v, l, r, i, valor):
    if l == r:
        S["tree"][v] = valor
    else:
        m = (l + r) // 2
        if i <= m:
            update_rec(S, 2 * v + 1, l, m, i, valor)
        else:
            update_rec(S, 2 * (v + 1), m + 1, r, i, valor)
        S["tree"][v] = S["tree"][2 * v + 1] + S["tree"][2 * (v + 1)]


def update(S, i, valor):
    update_rec(S, 0, 0, S["N"] - 1, i, valor)
