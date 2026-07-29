# Algoritmo Dijkstra

Permite calcular los caminos más cortos en grafos ponderados con pesos estrictamente positivos.

Este algoritmo utiliza una estrategia voraz (greedy) para seleccionar los vértices. Parte de la idea de que si seleccionamos un vértice $u$, se cumple que $u.d = \delta(s,u)$; es decir, que ya tenemos la distancia mínima desde el origen $s$ hasta $u$.

Se basa en las siguientes propiedades:

1. **Propiedad de subcamino óptimo**: Todo subcamino de un camino más corto es también un camino más corto.
2. **Desigualdad triangular**: Para toda arista $(u,v) \in E$ se cumple que $\delta(s,v) \leq \delta(s,u) + w(u,v)$.
3. **Propiedad de selección voraz**: Si un vértice no procesado $u$ tiene la distancia estimada mínima entre todos los vértices no procesados, y todos los pesos son no negativos, entonces $u.d = \delta(s,u)$. Una vez que un vértice ha sido seleccionado, conocemos la distancia mínima definitiva hasta él.

## Otras propiedades

1. Una vez que $v.d = \delta(s,v)$, este valor no puede cambiar.
2. Si no hay camino desde $s$ hasta $v$, entonces $v.d = \delta(s,v) = \infty$.
3. Si existe un camino más corto entre $s$ y $v$ que pasa por $u$, entonces al relajar la arista $(u,v)$ obtenemos $\delta(s,v)$.

## Funcionamiento

Mantenemos un conjunto $S$ de vértices cuya distancia mínima ya es conocida. Repetimos los siguientes pasos:

1. Escogemos un vértice no procesado $u \in V - S$ con la menor distancia estimada.
2. Añadimos $u$ a $S$.
3. Relajamos cada arista saliente de $u$.

Para implementar esto eficientemente, utilizamos una cola de prioridad (min-heap) donde la clave de prioridad es $v.d$. Las operaciones de extraer el mínimo y disminuir clave tienen un costo de $O(\log |V|)$ cada una.

## Pseudocódigo comentado

```
DIJKSTRA(G, w, s)
1  INITIALIZE-SINGLE-SOURCE(G, s)   // Inicializa d[s]=0, d[v]=∞ para v≠s, π[v]=NIL
2  S ← ∅                            // Conjunto de vértices procesados (distancia final conocida)
3  Q ← G.V                          // Cola de prioridad con todos los vértices
4  mientras Q ≠ ∅:
   1  u ← EXTRACT-MIN(Q)            // Extrae el vértice con d[u] mínimo de Q
   2  S ← S ∪ {u}                   // Marca u como procesado
   3  para cada v ∈ G.Adj[u]:       // Para cada vecino v de u
      1  RELAX(u, v, w)             // Si d[v] > d[u] + w(u,v), actualiza d[v] y π[v]
```

## Tabla de resumen

Concepto | Descripción |
--- | --- |
**Propósito** | Encontrar los caminos más cortos desde un vértice origen a todos los demás en un grafo con pesos no negativos. |
**Estrategia** | Algoritmo voraz (greedy). |
**Complejidad** | $O((|V|+|E|) \log |V|)$ con cola de prioridad basada en heap. |
**Condición clave** | Todos los pesos de las aristas deben ser no negativos. |
**Estructuras de datos** | Cola de prioridad (min-heap), arreglos de distancias y predecesores. |
**Propiedad de subcamino óptimo** | Garantiza que los caminos construidos son óptimos en cada paso. |
**Relajación** | Operación fundamental que mejora la estimación de la distancia a un vértice. |
**Conjunto S** | Contiene los vértices cuya distancia mínima ya es definitiva. |

## Comentarios adicionales

- El algoritmo de Dijkstra no funciona correctamente si el grafo tiene aristas con peso negativo, ya que la propiedad de selección voraz deja de ser válida. En ese caso, se debe usar el algoritmo de Bellman-Ford.
- La inicialización `INITIALIZE-SINGLE-SOURCE` establece la distancia del origen en 0, las de los demás vértices en infinito, y los predecesores en nulo.
- La operación `RELAX(u, v, w)` comprueba si la distancia a `v` puede mejorarse pasando por `u`; si es así, actualiza la distancia y establece a `u` como predecesor de `v`.
- La eficiencia del algoritmo depende críticamente de la implementación de la cola de prioridad. Un heap de Fibonacci puede reducir la complejidad amortizada.
- El algoritmo termina cuando la cola de prioridad está vacía, lo que garantiza que se han procesado todos los vértices alcanzables desde el origen.