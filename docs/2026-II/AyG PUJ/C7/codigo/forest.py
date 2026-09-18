# UVa 10977 - Enchanted Forest. La cuadricula como grafo implicito: antes
# de recorrer se marcan las celdas bloqueadas y las que quedan a distancia
# L o menos de algun Jigglypuff. Despues, amplitud de (1, 1) a (R, C).

from collections import deque

dr = [0, -1, 0, 1]
dc = [-1, 0, 1, 0]


def matriz(R, C, valor):
    # Filas de 0 a R y columnas de 0 a C, todas con valor; la fila y la
    # columna 0 no se usan porque el enunciado numera desde 1
    m = []
    i = 0
    while i <= R:
        m.append([valor] * (C + 1))
        i = i + 1
    return m


def mundo_vacio(R, C):
    # Todas las celdas libres
    return matriz(R, C, 0)


def marcar_peligro(mundo, R, C, x, y, L):
    # Bloquea las celdas a distancia euclidiana L o menos de (x, y)
    i = max(1, x - L)
    while i <= min(R, x + L):
        j = max(1, y - L)
        while j <= min(C, y + L):
            if (x - i) * (x - i) + (y - j) * (y - j) <= L * L:
                mundo[i][j] = -1
            j = j + 1
        i = i + 1


def salida_mas_corta(mundo, R, C):
    # Pasos minimos de (1, 1) a (R, C) por celdas con 0; -1 si no hay
    d = matriz(R, C, -1)
    cola = deque()
    if mundo[1][1] == 0:
        d[1][1] = 0
        cola.append((1, 1))
    while len(cola) > 0:
        actual = cola.popleft()
        r = actual[0]
        c = actual[1]
        k = 0
        while k < 4:
            nr = r + dr[k]
            nc = c + dc[k]
            if nr >= 1 and nr <= R and nc >= 1 and nc <= C:
                if mundo[nr][nc] == 0 and d[nr][nc] == -1:
                    d[nr][nc] = d[r][c] + 1
                    cola.append((nr, nc))
            k = k + 1
    return d[R][C]


def leer_y_resolver(entrada):
    datos = entrada.read().split()
    p = 0
    salida = []
    fin = False
    while not fin:
        R = int(datos[p])
        C = int(datos[p + 1])
        p = p + 2
        if R == 0 and C == 0:
            fin = True
        else:
            mundo = mundo_vacio(R, C)
            m = int(datos[p])
            p = p + 1
            i = 0
            while i < m:
                mundo[int(datos[p])][int(datos[p + 1])] = -1
                p = p + 2
                i = i + 1
            n = int(datos[p])
            p = p + 1
            i = 0
            while i < n:
                marcar_peligro(mundo, R, C, int(datos[p]), int(datos[p + 1]), int(datos[p + 2]))
                p = p + 3
                i = i + 1
            pasos = salida_mas_corta(mundo, R, C)
            if pasos == -1:
                salida.append("Impossible.")
            else:
                salida.append(str(pasos))
    return "\n".join(salida)


if __name__ == "__main__":
    import sys
    print(leer_y_resolver(sys.stdin))
