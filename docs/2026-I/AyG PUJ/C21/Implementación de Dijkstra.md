
```python
def dijkstra(V, adj, s):
    # Inicializacion
    d = {}
    pi = {}
    for v in V:
        d[v] = float('inf')
        pi[v] = None
    d[s] = 0

    # Q: conjunto de vertices aun no extraidos
    Q = set(V)

    # Bucle principal: extraer el vertice con d minimo hasta agotar Q
    seguir = True
    while seguir:
        # EXTRACT-MIN por busqueda lineal sobre Q
        u = None
        min_d = float('inf')
        for v in Q:
            if d[v] < min_d:
                min_d = d[v]
                u = v

        if u is None:
            # Los vertices restantes son inalcanzables
            seguir = False
        else:
            Q.remove(u)
            # RELAX de cada arista saliente de u
            for (v, w) in adj[u]:
                if v in Q and d[v] > d[u] + w:
                    d[v] = d[u] + w
                    pi[v] = u

    resultado = (d, pi)
    return resultado
```


```python
from dijkstra import dijkstra


# Grafo de CLRS Figura 24.6 (todos los pesos no negativos)
V = ['s', 't', 'x', 'y', 'z']
adj = {
    's': [('t', 10), ('y', 5)],
    't': [('x', 1),  ('y', 2)],
    'y': [('t', 3),  ('x', 9), ('z', 2)],
    'x': [('z', 4)],
    'z': [('x', 6),  ('s', 7)],
}

(d, pi) = dijkstra(V, adj, 's')
# d = {'s': 0, 'y': 5, 'z': 7, 't': 8, 'x': 9}

print("Distancias:", d)
print("Predecesores:", pi)
```