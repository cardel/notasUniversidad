"""
Excentricidad de un nodo, con radio, diametro y centro

La distancia es el numero de aristas del camino mas corto, asi que
una amplitud desde el nodo la calcula hasta todos los demas.

"""

from collections import deque

# a b c d e f g h j, con los indices 0 a 8
G = [[1],
     [0, 2, 3, 4],
     [1],
     [1, 4],
     [1, 3, 5, 7],
     [4, 6],
     [5, 7],
     [4, 6, 8],
     [7]]

def amplitud(s):
  dist = [-1 for _ in range(len(G))]
  dist[s] = 0
  queue = deque()
  queue.append(s)
  while len(queue) > 0:
    v = queue.popleft()
    for w in G[v]:
      if dist[w] == -1:
        dist[w] = dist[v] + 1
        queue.append(w)
  return dist

def excentricidad(v):
  dist = amplitud(v)
  ans = 0
  for w in range(len(G)):
    if dist[w] > ans: ans = dist[w]
  return ans

def radioDiametroCentro():
  ecc = [excentricidad(v) for v in range(len(G))]
  radio, diametro = min(ecc), max(ecc)
  centro = [v for v in range(len(G)) if ecc[v] == radio]
  return ecc, radio, diametro, centro

def main():
  nombre = 'abcdefghj'
  ecc, radio, diametro, centro = radioDiametroCentro()
  for v in range(len(G)):
    print(nombre[v], ecc[v])
  print('radio', radio, 'diametro', diametro,
        'centro', [nombre[v] for v in centro])

main()
