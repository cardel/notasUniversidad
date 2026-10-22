"""
Implementación Algoritmo Caminos más Cortos para DAG

Octubre 1 de 2024

"""

from collections import deque

INF = float("inf")

# Kahn: G[u] tiene pares (v, peso)
def topoSort(G):
  q, topo, inc = deque(), [], [0 for _ in range(len(G))]
  # inc[v]: cuántas aristas llegan a v
  for u in range(len(G)):
    for (v, _) in G[u]:
      inc[v] += 1

  # sin aristas de entrada: van primero
  for u in range(len(G)):
    if inc[u] == 0:
      q.append(u)

  while len(q) != 0:
    u = q.popleft()
    topo.append(u)

    # quitar las aristas de u
    for (v, _) in G[u]:
      inc[v] -= 1
      if inc[v] == 0:
        q.append(v)
  return topo

# Complejidad: n = |V|, m = |E| ---> O(n + m)
def ssspDAG(G, s):
  dist, pred = [INF for _ in range(len(G))], [-1 for _ in range(len(G))]
  dist[s] = 0

  topo = topoSort(G)
  # una pasada, en orden topológico
  for u in topo:
    for (v, duv) in G[u]:
      # relajar la arista (u, v)
      if dist[u] + duv < dist[v]:
        dist[v] = dist[u] + duv
        pred[v] = u
  return dist, pred
