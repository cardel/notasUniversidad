"""
Tres formas de guardar un arbol con raiz

  padre[x]        el padre de x, o -1 si x es la raiz
  hijoIzq[x]      el primer hijo de x, o -1 si x es hoja
  hermanoDer[x]   el siguiente hermano de x, o -1 si es el ultimo

El arbol del ejemplo: a es la raiz y tiene a b, c y d; b tiene a e y
f; d tiene a g. Los nodos van de 0 a 6, con a = 0.

"""

nombre = 'abcdefg'
padre      = [-1,  0,  0,  0,  1,  1,  3]
hijoIzq    = [ 1,  4, -1,  6, -1, -1, -1]
hermanoDer = [-1,  2,  3, -1,  5, -1, -1]

# el mismo arbol como listas anidadas: [valor, subarbol, ..., subarbol]
T = ['a', ['b', ['e'], ['f']], ['c'], ['d', ['g']]]

def caminoALaRaiz(x):
  ans = [x]
  while padre[x] != -1:
    x = padre[x]
    ans.append(x)
  return ans

def profundidad(x):
  ans = 0
  while padre[x] != -1:
    x = padre[x]
    ans = ans + 1
  return ans

def hijos(x):
  ans = []
  v = hijoIzq[x]
  while v != -1:
    ans.append(v)
    v = hermanoDer[v]
  return ans

def esHoja(x):
  return hijoIzq[x] == -1

def altura(x):
  ans = 0
  if hijoIzq[x] != -1:
    mayor = -1
    for v in hijos(x):
      h = altura(v)
      if h > mayor: mayor = h
    ans = 1 + mayor
  return ans

def aridad():
  ans = 0
  for x in range(len(padre)):
    if len(hijos(x)) > ans: ans = len(hijos(x))
  return ans

def contarNodos(A):
  ans = 1
  for i in range(1, len(A)):
    ans = ans + contarNodos(A[i])
  return ans

def main():
  print([nombre[v] for v in caminoALaRaiz(4)])
  print(profundidad(4), altura(0), aridad())
  print([nombre[v] for v in hijos(0)], [nombre[v] for v in hijos(1)])
  print([nombre[x] for x in range(len(padre)) if esHoja(x)])
  print(contarNodos(T), contarNodos(T[1]))

main()
