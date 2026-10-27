"""
Adventures of Super Mario
https://onlinejudge.org/external/102/10269.pdf

Dijkstra - SSSP

"""

from sys import stdin
from heapq import heappop, heappush

def solve(G, a, b, K, L):
  queue, vis, flag = [], dict(), False
  heappush(queue, (0, 1, 0, K, False))
  vis[(1, 0, K, False)] = 0
  while len(queue) > 0 and not flag:
    (c, u, l, k, boot) = heappop(queue)
      
    if u == a + b: flag = True
    else:
      if vis[(u, l, k, boot)] == c:
        # se coloca los zapatos especiales
        if k > 0 and not boot: 
          if (u, L, k - 1, True) not in vis or vis[(u, L, k - 1, True)] > c:              
            heappush(queue, (c, u, L, k - 1, True))
            vis[(u, L, k - 1, True)] = c
        # se quita los zapatos especiales
        if boot and ((u, 0, k, False) not in vis or vis[(u, 0, k, False)] > c):
          heappush(queue, (c, u, 0, k, False))
          vis[(u, 0, k, False)] = c
        # movimientos
        for (v, p) in G[u]:
          # se mueve sin usar los zapatos
          if not boot and ((v, 0, k, False) not in vis or vis[(v, 0, k, False)] > c + p):  
            heappush(queue, (c + p, v, 0, k, False))
            vis[(v, 0, k, False)] = c + p
          # se mueve usando los zapatos
          if boot and l >= p and (u <= a or l == L):
            if (v, l - p, k, boot) not in vis or vis[(v, l - p, k, boot)] > c:
              heappush(queue, (c, v, l - p, k, boot))
              vis[(v, l - p, k, boot)] = c
  return c

def main():
  cases = int(stdin.readline())
  while cases:
    a, b, m, L, K = map(int, stdin.readline().split())
    G = [[] for _ in range(a + b + 1)]
    for _ in range(m):
      u, v, p = map(int, stdin.readline().split())
      G[u].append((v, p))
      G[v].append((u, p))
    print(solve(G, a, b, K, L))
    cases -= 1

main()
