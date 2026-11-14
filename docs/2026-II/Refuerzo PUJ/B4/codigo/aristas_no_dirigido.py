BLANCO = 0
GRIS = 1
NEGRO = 2


def visitar_nd(adj, u, padre, color, aristas):
    # Como en el dirigido, pero la arista hacia el padre se salta.
    color[u] = GRIS
    for v in adj[u]:
        if v == padre:
            aristas.append((u, v, "padre"))
        elif color[v] == BLANCO:
            aristas.append((u, v, "arbol"))
            visitar_nd(adj, v, u, color, aristas)
        elif color[v] == GRIS:
            aristas.append((u, v, "retroceso"))
        else:
            aristas.append((u, v, "repetida"))
    color[u] = NEGRO


def clasificar_no_dirigido(adj):
    # La raiz de cada arranque no tiene padre: se usa -1.
    n = len(adj)
    color = [BLANCO] * n
    aristas = []
    for u in range(n):
        if color[u] == BLANCO:
            visitar_nd(adj, u, -1, color, aristas)
    return aristas


def main():
    g2 = [[1, 2], [0, 2, 3], [0, 1], [1, 4], [3]]
    for u, v, tipo in clasificar_no_dirigido(g2):
        print(u, "-", v, tipo)


if __name__ == "__main__":
    main()
