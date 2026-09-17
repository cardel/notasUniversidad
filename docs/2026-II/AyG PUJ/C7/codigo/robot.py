# Robot con turbo: el vertice del grafo implicito no es la celda sino el
# par (celda, cuantos obstaculos seguidos lleva). Entrar a un obstaculo suma
# uno a la racha y no puede pasar de k; entrar a una celda libre la vuelve 0.

from collections import deque

DR = [1, -1, 0, 0]
DC = [0, 0, 1, -1]


def tabla_vacia(m, n, k):
    # d[r][c][t] = -1 para todos los estados: ninguno visto todavia
    d = []
    r = 0
    while r < m:
        fila = []
        c = 0
        while c < n:
            fila.append([-1] * (k + 1))
            c = c + 1
        d.append(fila)
        r = r + 1
    return d


def vecinos_robot(m, n, k, a, r, c, t):
    # Los estados a los que se pasa desde (r, c, t) en un movimiento
    res = []
    i = 0
    while i < 4:
        nr = r + DR[i]
        nc = c + DC[i]
        if nr >= 0 and nr < m and nc >= 0 and nc < n:
            nt = 0
            if a[nr][nc] == 1:
                nt = t + 1
            if nt <= k:
                res.append((nr, nc, nt))
        i = i + 1
    return res


def movimientos_minimos(m, n, k, a):
    # BFS sobre los estados (r, c, t); -1 si (m-1, n-1) no se alcanza
    d = tabla_vacia(m, n, k)
    d[0][0][0] = 0
    cola = deque()
    cola.append((0, 0, 0))
    while len(cola) > 0:
        e = cola.popleft()
        for s in vecinos_robot(m, n, k, a, e[0], e[1], e[2]):
            if d[s[0]][s[1]][s[2]] == -1:
                d[s[0]][s[1]][s[2]] = d[e[0]][e[1]][e[2]] + 1
                cola.append(s)
    return d[m - 1][n - 1][0]


def leer_y_resolver(entrada):
    datos = entrada.read().split()
    p = 0
    casos = int(datos[p])
    p = p + 1
    salida = []
    caso = 0
    while caso < casos:
        m = int(datos[p])
        n = int(datos[p + 1])
        k = int(datos[p + 2])
        p = p + 3
        a = []
        r = 0
        while r < m:
            fila = []
            c = 0
            while c < n:
                fila.append(int(datos[p]))
                p = p + 1
                c = c + 1
            a.append(fila)
            r = r + 1
        salida.append(str(movimientos_minimos(m, n, k, a)))
        caso = caso + 1
    return "\n".join(salida)


if __name__ == "__main__":
    import sys
    print(leer_y_resolver(sys.stdin))
