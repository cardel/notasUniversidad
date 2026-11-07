from collections import deque


def marcar(tablero, tripletas):
    # Matriz con las casillas por las que no se puede pasar.
    R = len(tablero)
    C = len(tablero[0])
    prohibida = []
    for r in range(R):
        fila = []
        for c in range(C):
            fila.append(tablero[r][c] == "#")
        prohibida.append(fila)
    for (ri, ci, radio) in tripletas:
        for r in range(max(0, ri - radio), min(R, ri + radio + 1)):
            for c in range(max(0, ci - radio), min(C, ci + radio + 1)):
                if (r - ri) * (r - ri) + (c - ci) * (c - ci) <= radio * radio:
                    prohibida[r][c] = True
    return prohibida


def entrar(prohibida, dist, cola, r, c, d):
    # Mete (r, c) a la cola si existe, se puede pisar y es nueva.
    if 0 <= r < len(dist) and 0 <= c < len(dist[0]):
        if not prohibida[r][c] and dist[r][c] == -1:
            dist[r][c] = d
            cola.append((r, c))


def bosque(tablero, tripletas):
    # Menor número de pasos de (0, 0) a (R-1, C-1); -1 si no se puede.
    prohibida = marcar(tablero, tripletas)
    R = len(tablero)
    C = len(tablero[0])
    dist = []
    for r in range(R):
        dist.append([-1] * C)
    cola = deque()
    entrar(prohibida, dist, cola, 0, 0, 0)
    while len(cola) > 0:
        (r, c) = cola.popleft()
        d = dist[r][c] + 1
        entrar(prohibida, dist, cola, r - 1, c, d)
        entrar(prohibida, dist, cola, r + 1, c, d)
        entrar(prohibida, dist, cola, r, c - 1, d)
        entrar(prohibida, dist, cola, r, c + 1, d)
    return dist[R - 1][C - 1]


def main():
    tablero = [".#.....", "..#.#..", ".......", ".......", "......."]
    print(bosque(tablero, [(4, 0, 2), (3, 4, 1)]))
    print(bosque(tablero, [(4, 0, 2), (3, 4, 1), (1, 6, 1)]))
    print(bosque(tablero, [(4, 6, 0)]))


if __name__ == "__main__":
    main()
