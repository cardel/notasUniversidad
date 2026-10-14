# UVa 321 - The New Villa
# Grafo de estados: un estado es (habitacion, luces), donde luces es una
# tupla de booleanos y luces[i] dice si la luz de la habitacion i esta
# prendida (la posicion 0 no se usa). Cada paso cuesta 1, asi que la
# busqueda en amplitud da el camino con menos pasos.
import sys
from collections import deque


def sucesores(estado, puertas, interruptores):
  # Los estados a un paso de estado, cada uno con el texto de ese paso.
  (hab, luces) = estado
  res = []
  for l in interruptores[hab]:
    # nunca se apaga la luz de la habitacion donde se esta
    if l != hab:
      nuevas = list(luces)
      nuevas[l] = not nuevas[l]
      if nuevas[l]:
        texto = '- Switch on light in room ' + str(l) + '.'
      else:
        texto = '- Switch off light in room ' + str(l) + '.'
      res.append(((hab, tuple(nuevas)), texto))
  for j in puertas[hab]:
    # solo se entra a una habitacion con la luz prendida
    if luces[j]:
      res.append(((j, luces), '- Move to room ' + str(j) + '.'))
  return res


def ssspBFS(s, puertas, interruptores):
  # d[u]: pasos de s a u; p[u]: (estado anterior, texto del paso).
  # Un estado que no esta en d no se ha descubierto: costo infinito.
  q = deque()
  d, p = {}, {}
  q.append(s)
  d[s] = 0

  while len(q) > 0:
    v = q.popleft()
    for (u, texto) in sucesores(v, puertas, interruptores):
      if u not in d:
        q.append(u)
        d[u] = d[v] + 1
        p[u] = (v, texto)

  return d, p


def resolver(r, puertas, interruptores):
  # (hay, pasos): si se llega a la meta y el texto de cada paso.
  luces = [False] * (r + 1)
  luces[1] = True
  s = (1, tuple(luces))
  luces = [False] * (r + 1)
  luces[r] = True
  meta = (r, tuple(luces))
  d, p = ssspBFS(s, puertas, interruptores)
  hay = meta in d
  pasos = []
  if hay:
    x = meta
    while x != s:
      (anterior, texto) = p[x]
      pasos.append(texto)
      x = anterior
    pasos.reverse()
  return (hay, pasos)


def main():
  datos = sys.stdin.read().split()
  k = 0
  caso = 1
  r = int(datos[0])
  while r != 0:
    nd = int(datos[k + 1])
    ns = int(datos[k + 2])
    k = k + 3
    puertas = []
    interruptores = []
    for i in range(r + 1):
      puertas.append([])
      interruptores.append([])
    for i in range(nd):
      a = int(datos[k])
      b = int(datos[k + 1])
      puertas[a].append(b)
      puertas[b].append(a)
      k = k + 2
    for i in range(ns):
      interruptores[int(datos[k])].append(int(datos[k + 1]))
      k = k + 2
    for i in range(r + 1):
      puertas[i].sort()
      interruptores[i].sort()
    (hay, pasos) = resolver(r, puertas, interruptores)
    print('Villa #' + str(caso))
    if hay:
      print('The problem can be solved in ' + str(len(pasos)) + ' steps:')
      for texto in pasos:
        print(texto)
    else:
      print('The problem cannot be solved.')
    print()
    caso = caso + 1
    r = int(datos[k])


if __name__ == '__main__':
  main()
