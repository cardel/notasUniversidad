"""
Caminos más cortos - BFS
Septiembre 26 de 2024

"""


from collections import deque

# Implementación con un único origen s
def ssspBFS(G, s):
  q = deque()
  vis, d, p = [False for _ in range(len(G))], [float("inf") for _ in range(len(G))], [-1 for _ in range(len(G))]
  q.append(s)
  vis[s], d[s] = True, 0

  while len(q) > 0:
    v = q.popleft()
    for u in G[v]:
      if not vis[u]:
        q.append(u)
        vis[u] = True
        d[u] = d[v] + 1
        p[u] = v

  return d, p

# Implementación con dos orígenes s1 y s2
def ssspBFS(G, s1, s2):
  q = deque()
  vis, d, p = [False for _ in range(len(G))], [float("inf") for _ in range(len(G))], [-1 for _ in range(len(G))]
  q.append(s1)
  q.append(s2)
  vis[s1] = vis[s2] = True
  d[s1] = d[s2] = 0

  while len(q) > 0:
    v = q.popleft()
    for u in G[v]:
      if not vis[u]:
        q.append(u)
        vis[u] = True
        d[u] = d[v] + 1
        p[u] = v

  return d, p

# Implementación con un único origen s.
# Se evita el uso del arreglo de visitados ya que cuando un elemento no ha
# sido descubiero su costo es infinito
def ssspBFS(G, s):
  q = deque()
  d, p = [float("inf") for _ in range(len(G))], [-1 for _ in range(len(G))]
  q.append(s)
  d[s] = 0

  while len(q) > 0:
    v = q.popleft()
    for u in G[v]:
      if d[u] == float("inf"):
        q.append(u)
        d[u] = d[v] + 1
        p[u] = v

  return d, p
