
[Problema UVA 11235](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2176)

```python
import sys

# UVa 11235 - Frequent values
# Secuencia ordenada de forma no decreciente. Para cada consulta (i, j)
# se pide cuantas veces aparece el valor mas frecuente en A[i..j].

MENOS_INF = float('-inf')


def build(longitudes, tree, v, l, r):
    # Arbol de segmentos de MAXIMO sobre las longitudes de corrida.
    if l == r:
        tree[v] = longitudes[l]
    else:
        m = (l + r) // 2
        build(longitudes, tree, 2*v+1, l, m)
        build(longitudes, tree, 2*v+2, m+1, r)
        tree[v] = max(tree[2*v+1], tree[2*v+2])


def query(tree, v, l, r, ql, qr):
    if qr < l or r < ql:
        resultado = MENOS_INF              # disjunto: neutro del maximo
    elif ql <= l and r <= qr:
        resultado = tree[v]                # contenido
    else:
        m = (l + r) // 2                   # solapado
        resultado = max(query(tree, 2*v+1, l, m, ql, qr),
                        query(tree, 2*v+2, m+1, r, ql, qr))
    return resultado


def comprimir(a, n):
    # A esta ordenada: los valores iguales forman corridas contiguas.
    # run_id[k]  = indice de corrida de la posicion k
    # run_ini/run_fin = extremos de cada corrida; run_len = su longitud
    run_id = [0] * n
    run_ini = []
    run_fin = []
    run_len = []
    inicio = 0
    for i in range(1, n + 1):
        if i == n or a[i] != a[inicio]:
            corrida = len(run_len)
            run_ini.append(inicio)
            run_fin.append(i - 1)
            run_len.append(i - inicio)
            for k in range(inicio, i):
                run_id[k] = corrida
            inicio = i
    return run_id, run_ini, run_fin, run_len


def resolver(n, a, consultas):
    run_id, run_ini, run_fin, run_len = comprimir(a, n)
    corridas = len(run_len)
    tree = [MENOS_INF] * (4 * corridas)
    build(run_len, tree, 0, 0, corridas - 1)

    respuestas = []
    for (qi, qj) in consultas:
        izq = qi - 1                       # las consultas llegan en base 1
        der = qj - 1
        if run_id[izq] == run_id[der]:
            # i y j caen en la misma corrida
            respuestas.append(der - izq + 1)
        else:
            ri = run_id[izq]
            rd = run_id[der]
            parte_izq = run_fin[ri] - izq + 1     # resto de la corrida de i
            parte_der = der - run_ini[rd] + 1     # tramo inicial de la de j
            medio = MENOS_INF
            if ri + 1 <= rd - 1:
                # corrida mas larga totalmente contenida entre ambas
                medio = query(tree, 0, 0, corridas - 1, ri + 1, rd - 1)
            respuestas.append(max(parte_izq, parte_der, medio))
    return respuestas


def main():
    datos = sys.stdin.read().split()
    pos = 0
    salida = []
    n = int(datos[pos])
    pos = pos + 1
    while n != 0:
        q = int(datos[pos])
        pos = pos + 1
        a = [0] * n
        for k in range(n):
            a[k] = int(datos[pos])
            pos = pos + 1
        consultas = []
        for k in range(q):
            qi = int(datos[pos])
            qj = int(datos[pos + 1])
            pos = pos + 2
            consultas.append((qi, qj))
        for valor in resolver(n, a, consultas):
            salida.append(str(valor))
        n = int(datos[pos])
        pos = pos + 1
    sys.stdout.write("\n".join(salida) + "\n")


main()

```