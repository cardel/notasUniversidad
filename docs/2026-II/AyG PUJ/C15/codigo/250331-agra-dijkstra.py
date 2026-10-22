"""
Implementación Algoritmo Dijkstra
Octubre 1 de 2024

"""

from heapq import heappush,heappop

INF = float('inf')

# Implementación algoritmo de Dijkstra para la versión uno a uno
def dijkstraST(G, s, t):
  dist = [INF for _ in range(len(G))] ; dist[s] = 0
  pqueue, found = list(), False
  #for u in range(len(G)): heappush(pqueue, (dist[u], u))
  heappush(pqueue, (dist[s], s))

  while len(pqueue)!=0 and not found:
    du,u = heappop(pqueue)
    # al salir t, su distancia es final
    if u == t:
      found = True
    else:
      # pareja vieja: se descarta
      if dist[u] == du:
        for v,duv in G[u]:
          if du+duv<dist[v]:
            dist[v] = du+duv
            heappush(pqueue, (dist[v], v))
  return dist[t]

# Implementación algoritmo de Dijkstra para la versión uno a todos
# Complejidad: T(n, m) E O((n + m) * log n)
def dijkstra(G, s):
  dist = [INF for _ in range(len(G))] ; dist[s] = 0
  pred = [-1 for _ in range(len(G))]
  pqueue = list()
  #for u in range(len(G)): heappush(pqueue, (dist[u], u))
  heappush(pqueue, (dist[s], s))

  while len(pqueue)!=0:
    # la pareja de menor distancia
    du,u = heappop(pqueue)
    # si no coincide, la pareja es vieja
    if dist[u] == du:
      for v,duv in G[u]:
        # si mejora, v entra otra vez
        if du+duv<dist[v]:
          dist[v] = du+duv
          pred[v] = u
          heappush(pqueue, (dist[v], v))
  return dist
