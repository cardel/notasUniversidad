"""
Arboles como estructura recursiva

<arbol> ::= [] | [n <arbol> <arbol>]

"""

# a es una hoja vacia, b tiene un solo nodo y c tiene dos
a = []
b = [5, [], []]
c = [6, [3, [], []], []]

# el arbol de la clase: raiz 8, diez nodos
T = [8,
     [5,
      [10, [2, [], []], [3, [], []]],
      [7, [], []]],
     [6,
      [4, [], []],
      [1, [9, [], []], []]]]

def contarNodos(A):
  if len(A) == 0: ans = 0
  else:
    ans = 1 + contarNodos(A[1]) + contarNodos(A[2])
  return ans

def altura(A):
  if len(A) == 0: ans = -1
  else:
    ans = 1 + max(altura(A[1]), altura(A[2]))
  return ans

def main():
  print(contarNodos(a), contarNodos(b), contarNodos(c))
  print(contarNodos(T))
  print(altura(T))

main()
