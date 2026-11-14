BLANCO = 0
GRIS = 1
NEGRO = 2


def tipo_de(color, d, u, v):
    # La regla: el estado de v y, si es negro, los tiempos.
    tipo = "cruzada"
    if color[v] == BLANCO:
        tipo = "arbol"
    elif color[v] == GRIS:
        tipo = "retroceso"
    elif d[u] < d[v]:
        tipo = "avance"
    return tipo


def visitar(adj, u, color, d, f, reloj, aristas):
    # Recorre desde u y anota el tipo de cada arista que mira.
    color[u] = GRIS
    reloj[0] = reloj[0] + 1
    d[u] = reloj[0]
    for v in adj[u]:
        aristas.append((u, v, tipo_de(color, d, u, v)))
        if color[v] == BLANCO:
            visitar(adj, v, color, d, f, reloj, aristas)
    color[u] = NEGRO
    reloj[0] = reloj[0] + 1
    f[u] = reloj[0]


def clasificar(adj):
    # Un arranque por cada nodo que siga en blanco.
    n = len(adj)
    color = [BLANCO] * n
    d = [0] * n
    f = [0] * n
    reloj = [0]
    aristas = []
    for u in range(n):
        if color[u] == BLANCO:
            visitar(adj, u, color, d, f, reloj, aristas)
    resultado = (aristas, d, f)
    return resultado


def main():
    g1 = [[1, 2], [2], [0], [1, 4], []]
    aristas, d, f = clasificar(g1)
    for u, v, tipo in aristas:
        print(u, "->", v, tipo)
    print("d =", d)
    print("f =", f)


if __name__ == "__main__":
    main()
