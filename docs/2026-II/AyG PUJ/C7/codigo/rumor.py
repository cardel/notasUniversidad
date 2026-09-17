# Rumor: cada componente conexo necesita exactamente un soborno, y conviene
# el personaje mas barato del componente. Un recorrido por componente que
# lleva el minimo como acumulador.


def minimo_del_componente(G, s, visitado, costo):
    # Recorre el componente de s con una pila y devuelve su menor costo
    menor = costo[s]
    visitado[s] = True
    pila = [s]
    while len(pila) > 0:
        u = pila.pop()
        if costo[u] < menor:
            menor = costo[u]
        for v in G[u]:
            if not visitado[v]:
                visitado[v] = True
                pila.append(v)
    return menor


def oro_minimo(n, costo, G):
    # Suma el minimo de cada componente; el ciclo externo los descubre
    visitado = [False] * n
    total = 0
    u = 0
    while u < n:
        if not visitado[u]:
            total = total + minimo_del_componente(G, u, visitado, costo)
        u = u + 1
    return total


def leer_y_resolver(entrada):
    datos = entrada.read().split()
    p = 0
    salida = []
    fin = False
    while not fin:
        n = int(datos[p])
        m = int(datos[p + 1])
        p = p + 2
        if n == 0 and m == 0:
            fin = True
        else:
            costo = []
            i = 0
            while i < n:
                costo.append(int(datos[p + i]))
                i = i + 1
            p = p + n
            G = []
            i = 0
            while i < n:
                G.append([])
                i = i + 1
            i = 0
            while i < m:
                x = int(datos[p]) - 1
                y = int(datos[p + 1]) - 1
                G[x].append(y)
                G[y].append(x)
                p = p + 2
                i = i + 1
            salida.append(str(oro_minimo(n, costo, G)))
    return "\n".join(salida)


if __name__ == "__main__":
    import sys
    print(leer_y_resolver(sys.stdin))
