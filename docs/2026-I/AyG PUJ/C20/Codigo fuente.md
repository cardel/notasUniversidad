
```python
def bellman_ford(V, edges, s):
    # Inicializacion
    d = {}
    pi = {}
    for v in V:
        d[v] = float('inf')
        pi[v] = None
    d[s] = 0

    # Relajacion: |V|-1 iteraciones
    i = 0
    while i < len(V) - 1:
        for (u, v, w) in edges:
            if d[v] > d[u] + w:
                d[v] = d[u] + w
                pi[v] = u
        i = i + 1

    # Deteccion de ciclo negativo
    hay_ciclo_negativo = False
    for (u, v, w) in edges:
        if d[v] > d[u] + w:
            hay_ciclo_negativo = True

    resultado = (d, pi, not hay_ciclo_negativo)
    return resultado

```

```python
from bellman_ford import bellman_ford


V = ['s', 't', 'x', 'y', 'z']
edges = [
    ('t', 'x', 5),  ('t', 'y', 8),  ('t', 'z', -4),
    ('x', 't', -2), ('y', 'x', -3), ('y', 'z', 9),
    ('z', 'x', 7),  ('z', 's', 2),  ('s', 't', 6),
    ('s', 'y', 7)
]

(d, pi, sin_ciclo) = bellman_ford(V, edges, 's')
# d = {'s': 0, 't': 2, 'x': 4, 'y': 7, 'z': -2}
# sin_ciclo = True

print("Distancias:", d)
print("Predecesores:", pi)
print("Sin ciclo negativo:", sin_ciclo)

```