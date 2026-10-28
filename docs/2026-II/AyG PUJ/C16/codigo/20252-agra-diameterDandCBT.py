"""
Diametro arbol binario representacion listas de adyacencia
Autor: Carlos Ramirez
Fecha: Septiembre 14 de 2023

Este algoritmo requiere que se conozca cual es la raiz del arbol y solo
se incluye la arista que conecta un padre con su hijo pero no viceversa

"""

heights = None

def diameter(v):
  global heights
  ans, h1, h2, diamLeft, diamRight = None, 0, 0, 0, 0
  if len(G[v]) == 0:
    heights[v] = 0
    ans = 0
  else:
    left = G[v][0]
    diamLeft = diameter(left)
    heights[v] = heights[left] + 1
    h1 = heights[left] + 1

    if len(G[v])  > 1:
      right = G[v][1]
      diamRight = diameter(right)
      heights[v] = max(heights[v], heights[right] + 1)
      h2 = heights[right] + 1
    ans = max(h1 + h2, diamLeft, diamRight)
  return ans
 
