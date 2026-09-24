# Componentes fuertemente conexos de un grafo dirigido con el
# algoritmo de Kosaraju. La primera profundidad y la asignacion
# sobre el transpuesto van cada una en sus dos formas, la
# recursiva y la de pila explicita.


BLANCO, GRIS, NEGRO = 0, 1, 2


def en_blanco(grafo):
    # Los tres diccionarios del recorrido, uno por vertice.
    color = {}
    d = {}
    f = {}
    for v in grafo:
        color[v] = BLANCO
        d[v] = 0
        f[v] = 0
    resultado = (color, d, f)
    return resultado


def tiempos(grafo):
    # Los tiempos de descubrimiento y de finalizacion.
    color, d, f = en_blanco(grafo)
    reloj = [0]

    def visit(u):
        color[u] = GRIS
        reloj[0] = reloj[0] + 1
        d[u] = reloj[0]
        for v in grafo[u]:
            if color[v] == BLANCO:
                visit(v)
        color[u] = NEGRO
        reloj[0] = reloj[0] + 1
        f[u] = reloj[0]

    for u in grafo:
        if color[u] == BLANCO:
            visit(u)
    resultado = (d, f)
    return resultado


def orden_aux(grafo, v, visitado, orden):
    # v se agrega al terminar con el: orden queda por f creciente.
    visitado[v] = True
    for u in grafo[v]:
        if not visitado[u]:
            orden_aux(grafo, u, visitado, orden)
    orden.append(v)


def orden_por_finalizacion(grafo):
    # Los vertices por tiempo de finalizacion decreciente.
    visitado = {}
    for v in grafo:
        visitado[v] = False
    orden = []
    for v in grafo:
        if not visitado[v]:
            orden_aux(grafo, v, visitado, orden)
    orden.reverse()
    return orden


def orden_aux_con_pila(grafo, v, visitado, orden):
    # Cada vertice entra dos veces: la primera lo descubre y
    # la segunda lo finaliza, que es cuando se agrega a orden.
    pila = [(v, False)]
    while len(pila) > 0:
        w, finalizando = pila.pop()
        if finalizando:
            orden.append(w)
        elif not visitado[w]:
            visitado[w] = True
            pila.append((w, True))
            for u in grafo[w]:
                if not visitado[u]:
                    pila.append((u, False))


def orden_por_finalizacion_con_pila(grafo):
    visitado = {}
    for v in grafo:
        visitado[v] = False
    orden = []
    for v in grafo:
        if not visitado[v]:
            orden_aux_con_pila(grafo, v, visitado, orden)
    orden.reverse()
    return orden


def grafo_transpuesto(grafo):
    # Las mismas aristas con la direccion invertida.
    GT = {}
    for v in grafo:
        GT[v] = []
    for v in grafo:
        for u in grafo[v]:
            GT[u].append(v)
    return GT


def asignar(GT, v, g, comp):
    # v y lo que alcance en GT sin asignar quedan con g.
    if comp[v] is None:
        comp[v] = g
        for u in GT[v]:
            asignar(GT, u, g, comp)


def asignar_con_pila(GT, v, g, comp):
    # Lo pendiente queda en una lista, no en la pila de llamadas.
    pila = [v]
    while len(pila) > 0:
        w = pila.pop()
        if comp[w] is None:
            comp[w] = g
            for u in GT[w]:
                pila.append(u)


def agrupar(grafo, comp, orden):
    # Junta los vertices con el mismo representante, en el
    # orden en que los componentes fueron apareciendo.
    grupos = {}
    for v in orden:
        if comp[v] not in grupos:
            grupos[comp[v]] = []
    for v in grafo:
        grupos[comp[v]].append(v)
    componentes = []
    for g in grupos:
        componentes.append(grupos[g])
    return componentes


def kosaraju(grafo):
    # grafo: dict que asocia cada vertice a la lista de sucesores.
    # Devuelve la lista de componentes fuertemente conexos.
    orden = orden_por_finalizacion(grafo)
    GT = grafo_transpuesto(grafo)
    comp = {}
    for v in grafo:
        comp[v] = None
    for v in orden:
        asignar(GT, v, v, comp)
    componentes = agrupar(grafo, comp, orden)
    return componentes


def kosaraju_con_pila(grafo):
    orden = orden_por_finalizacion_con_pila(grafo)
    GT = grafo_transpuesto(grafo)
    comp = {}
    for v in grafo:
        comp[v] = None
    for v in orden:
        asignar_con_pila(GT, v, v, comp)
    componentes = agrupar(grafo, comp, orden)
    return componentes


if __name__ == "__main__":
    # Grafo dirigido de ocho vertices con cuatro componentes
    # fuertemente conexos.
    grafo = {
        'a': ['b'],
        'b': ['c', 'e', 'f'],
        'c': ['d', 'g'],
        'd': ['c', 'h'],
        'e': ['a', 'f'],
        'f': ['g'],
        'g': ['f', 'h'],
        'h': ['h'],
    }

    d, f = tiempos(grafo)
    for v in grafo:
        print(v + ': d = ' + str(d[v]) + ', f = ' + str(f[v]))

    print("orden =", orden_por_finalizacion(grafo),
          "esperado", ['a', 'b', 'e', 'c', 'g', 'f', 'd', 'h'])
    print("GT =", grafo_transpuesto(grafo))

    esperado = [['a', 'b', 'e'], ['c', 'd'], ['f', 'g'], ['h']]
    print("recursiva =", kosaraju(grafo), "esperado", esperado)
    print("con pila  =", kosaraju_con_pila(grafo), "esperado", esperado)
