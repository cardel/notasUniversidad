"""
Diametro arbol n-ario representacion listas de adyacencia
Autor: Carlos Ramirez
Fecha: Septiembre 14 de 2023

Algoritmo que hace dos DFS

"""

from sys import stdin

distMax, nodoMax = None, None
G = None

def dfsAux(v, p, dist):
  global distMax, nodoMax
  dist += 1
  if dist > distMax: distMax, nodoMax = dist, v
  for w in  G[v]:
    if w != p:
      dfsAux(w, v, dist)

def diameter():
  global distMax
  distMax = 0

  #se escoge arbitrariamente iniciar en el nodo 0
  #el resultado seria el mismo asi se inicie en un nodo diferente
  dfsAux(0, -1, -1)
  dfsAux(nodoMax, -1, -1)
  return distMax

