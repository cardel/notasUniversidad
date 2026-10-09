"""
Problem D - Interplanetary
Homework 04 AGRA 2026-1

CC, Bridges

"""

from sys import stdin
import sys

sys.setrecursionlimit(10 ** 6)

G = [[] for _ in range(100001)]
vis, low, p = [None for _ in range(100001)], [None for _ in range(100001)], [None for _ in range(100001)]
bridges, inflComps, comps = None, None, None
infl, ccInd = [None for _ in range(100001)], [None for _ in range(100001)]

def bridgesAux(v):
  global t
  vis[v] = low[v] = t
  t += 1

  for w in G[v]:
    if vis[w] == -1:
      p[w] = v
      bridgesAux(w)
      low[v] = min(low[v], low[w])

      # verificar si es un puente
      if low[w] > vis[v]:
        bridges.add((v, w))
        bridges.add((w, v))
    elif w != p[v]:
      low[v] = min(low[v], vis[w])

def bridgesTarjan():
  for i in range(1, n + 1):
    low[i] = vis[i] = p[i] =-1

  for i in range(1, n + 1):
    if vis[i] == -1:
      bridgesAux(i)

def getCCAux(u, ind):
  ans = infl[u]
  comps[ind].append(u)
  ccInd[u] = ind
  for v in G[u]:
    if ccInd[v] == -1 and (u, v) not in bridges:
      ans += getCCAux(v, ind)
  return ans

def getCC():
  for u in range(1, n + 1):
    ccInd[u] = -1

  for u in range(1, n + 1):
    if ccInd[u] == -1:
      comps.append([])
      inflComps.append(getCCAux(u, len(comps) - 1))

def dfs(u):
  vis[u] = 1
  reach.append(u)

  for w in G[u]:
    if vis[w] == -1 and ((u, w) not in bridges or inflComps[ccInd[u]] < inflComps[ccInd[w]]):
      dfs(w)

def solve(ini):
  bridgesTarjan()
  getCC()
  
  for i in range(1, n + 1):
    vis[i] = -1

  dfs(ini)
  reach.sort(key = lambda x: (inflComps[ccInd[x]], infl[x], x))
  print(*reach)

def main():
  global t, n, reach, comps, inflComps, bridges
  line = stdin.readline().strip()
  while len(line) > 0:
    n, m = map(int, line.split())
    t = 0
    reach, comps = [], []
    inflComps, bridges = [], set()

    line = stdin.readline().split()
    for i in range(1, n + 1):
      G[i], infl[i] = [], int(line[i - 1])
    for i in range(m):
      u, v = map(int, stdin.readline().split())
      G[u].append(v)
      G[v].append(u)

    ini = int(stdin.readline())
    solve(ini)
    line = stdin.readline().strip()

main()
