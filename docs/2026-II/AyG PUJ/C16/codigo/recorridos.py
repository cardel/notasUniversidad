"""
Recorridos de un arbol binario

Los tres de profundidad cambian donde se visita la raiz.
El de amplitud va por niveles.

"""

from collections import deque

T = [8,
     [5,
      [10, [2, [], []], [3, [], []]],
      [7, [], []]],
     [6,
      [4, [], []],
      [1, [9, [], []], []]]]

def preorden(A, ans):
  if len(A) > 0:
    ans.append(A[0])
    preorden(A[1], ans)
    preorden(A[2], ans)
  return ans

def posorden(A, ans):
  if len(A) > 0:
    posorden(A[1], ans)
    posorden(A[2], ans)
    ans.append(A[0])
  return ans

def inorden(A, ans):
  if len(A) > 0:
    inorden(A[1], ans)
    ans.append(A[0])
    inorden(A[2], ans)
  return ans

def niveles(A):
  ans, queue = [], deque()
  if len(A) > 0: queue.append(A)
  while len(queue) > 0:
    B = queue.popleft()
    ans.append(B[0])
    if len(B[1]) > 0: queue.append(B[1])
    if len(B[2]) > 0: queue.append(B[2])
  return ans

def main():
  print(preorden(T, []))
  print(posorden(T, []))
  print(inorden(T, []))
  print(niveles(T))

main()
