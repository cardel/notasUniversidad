"""
Adventures of Super Mario
https://onlinejudge.org/external/102/10269.pdf

Dijkstra - SSSP

"""

from sys import stdin
from heapq import heappop, heappush

def main():
  cases = int(stdin.readline())
  while cases:
    a, b, m, L, K = map(int, stdin.readline().split())
    G = [[] for _ in range(a + b + 1)]
    for _ in range(m):
      u, v, p = map(int, stdin.readline().split())
      G[u].append((v, p))
      G[v].append((u, p))

    # estado (u, l, k): lugar, carga que le
    # queda a la bota (0 sin bota) y usos
    # vis[estado]: menor tiempo conocido
    queue, vis, flag = [], dict(), False
    heappush(queue, (0, 1, 0, K))
    vis[(1, 0, K)] = 0
    while len(queue) > 0 and not flag:
      (c, u, l, k) = heappop(queue)

      # al salir a + b, c es el mínimo
      if u == a + b: flag = True
      else:
        # tupla vieja: se descarta
        if vis[(u, l, k)] == c:
          # se coloca los zapatos especiales
          if l != L and k > 0:
            if (u, L, k - 1) not in vis or vis[(u, L, k - 1)] > c:
              heappush(queue, (c, u, L, k - 1))
              vis[(u, L, k - 1)] = c
          for (v, p) in G[u]:
            if (v, 0, k) not in vis or vis[(v, 0, k)] > c + p:
              # se mueve sin usar los zapatos
              heappush(queue, (c + p, v, 0, k))
              vis[(v, 0, k)] = c + p
            # se mueve usando los zapatos
            # alcanza la carga y u es aldea
            # o la carrera empieza en u
            if l >= p and (u <= a or l == L):
              if (v, l - p, k) not in vis or vis[(v, l - p, k)] > c:
                heappush(queue, (c, v, l - p, k))
                vis[(v, l - p, k)] = c
    print(c)
    cases -= 1

main()
