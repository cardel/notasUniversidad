# Caminos más cortos en DAG y Dijkstra · AyG C15

**Viernes 23 de octubre de 2026, de 9:00 a 11:00, sesión compartida por los grupos A y B.**

Bellman-Ford hace $n-1$ rondas y en cada una relaja todas las aristas, porque
no sabe en qué orden conviene relajarlas. ¿Y si se supiera? ¿Bastaría con
relajar cada arista una sola vez? Hay dos casos en que la respuesta es sí. En
un grafo dirigido acíclico, el orden topológico dice qué vértice va primero, y
una pasada da las distancias aunque haya pesos negativos. Si el grafo tiene
ciclos pero ningún peso es negativo, el orden lo decide una cola de prioridad,
y eso es el algoritmo de Dijkstra. La sesión cierra con UVa 10269, *Adventure
of Super Mario*, un grafo de estados cuyas transiciones cuestan distinto y que
por eso pide Dijkstra en lugar de la búsqueda en amplitud.

Al terminar la sesión se espera poder:

- Calcular los caminos más cortos desde una fuente en un grafo dirigido
  acíclico con una sola pasada en orden topológico.
- Seguir en una tabla el algoritmo de Dijkstra con cola de prioridad y decir
  qué hace con una pareja vieja.
- Explicar por qué Dijkstra exige pesos no negativos y dar el costo de cada
  algoritmo.
- Modelar UVa 10269 como un grafo de estados con costos, con su estado, sus
  transiciones, el estado inicial y los finales, y resolverlo con Dijkstra.

## Diapositivas

[clase15-dag-dijkstra.pdf](./clase15-dag-dijkstra.pdf){ target=_blank rel=noopener },
95 páginas. Las trazas crecen fila por fila de una lámina a la siguiente, y
los tres grafos de la sesión aparecen dibujados con sus pesos.

## Lo que ya se tiene: Bellman-Ford-Moore

Relajar la arista $(u,v)$ de peso $w$ es comparar y, si mejora, actualizar:
si `dist[u] + w < dist[v]`, entonces `dist[v] = dist[u] + w` y `pred[v] = u`.
Bellman-Ford relaja todas las aristas en cada una de sus $n-1$ rondas y
cuesta $O(nm)$. Una ronda más le dice si hay un ciclo negativo alcanzable
desde la fuente. El detalle está en la
[nota de Bellman-Ford-Moore](../C13/Bellman-Ford-Moore.md).

## Caminos más cortos en un DAG

### La idea

Si el grafo no tiene ciclos, las aristas se relajan una sola vez, procesando
las de cada vértice en orden topológico (CLRS, Sección 24.2). Se empieza con
las aristas del primer vértice del orden y el efecto se propaga hacia
adelante. Las aristas que faltan por relajar salen de vértices que están más
adelante en el orden, y ninguna llega a un vértice ya procesado. Por eso,
cuando se revisan las aristas de $u$, el costo del camino más corto hasta $u$
ya no puede mejorar.

**Teorema (CLRS, Teorema 24.5).** Si $G$ es un grafo dirigido acíclico con
pesos y fuente $s$, al terminar el algoritmo $\mathit{dist}[v] = \delta(s,v)$
para todo $v \in V$, y $\mathit{pred}$ forma un árbol de caminos más cortos.

Sin ciclos no hay ciclos negativos, así que los pesos pueden ser negativos.

### El pseudocódigo

```text
para cada v: dist[v] = ∞; pred[v] = -1
dist[s] = 0
topo = orden topológico de G
para cada u en topo
    para cada arista (u, v) de peso w
        si dist[u] + w < dist[v]: dist[v] = dist[u] + w; pred[v] = u
```

Es Bellman-Ford con una sola ronda, en la que las aristas se recorren en el
orden topológico de su origen.

### El grafo del ejemplo

El grafo tiene ocho vértices, del $0$ al $7$, y doce aristas, tres de ellas
negativas. La fuente es $s = 2$. `G[u]` es la lista de pares `(v, peso)`,
ordenada por `v`.

| $u$ | `G[u]` |
|---|---|
| $0$ | `[(1, -1), (6, 3)]` |
| $1$ | `[(5, 2)]` |
| $2$ | `[(1, 4), (3, 2)]` |
| $3$ | `[(1, -7), (5, 3)]` |
| $4$ | `[(0, 4), (2, 6)]` |
| $5$ | `[(7, -2)]` |
| $6$ | `[(5, 1), (7, 4)]` |
| $7$ | `[]` |

¿Desde $2$ se llega a $4$, a $0$ o a $6$? No. A $4$ no llega ninguna arista,
y a $0$ y a $6$ solo se llega desde $4$, así que su distancia queda en
$\infty$.

### El código completo

[250325-agra-sssp-dag.py](./codigo/250325-agra-sssp-dag.py) trae las dos
funciones. Los números de línea son los que citan las diapositivas y el resto
de la nota.

```python linenums="1"
"""
Implementación Algoritmo Caminos más Cortos para DAG

Octubre 1 de 2024

"""

from collections import deque

INF = float("inf")

# Kahn: G[u] tiene pares (v, peso)
def topoSort(G):
  q, topo, inc = deque(), [], [0 for _ in range(len(G))]
  # inc[v]: cuántas aristas llegan a v
  for u in range(len(G)):
    for (v, _) in G[u]:
      inc[v] += 1

  # sin aristas de entrada: van primero
  for u in range(len(G)):
    if inc[u] == 0:
      q.append(u)

  while len(q) != 0:
    u = q.popleft()
    topo.append(u)

    # quitar las aristas de u
    for (v, _) in G[u]:
      inc[v] -= 1
      if inc[v] == 0:
        q.append(v)
  return topo

# Complejidad: n = |V|, m = |E| ---> O(n + m)
def ssspDAG(G, s):
  dist, pred = [INF for _ in range(len(G))], [-1 for _ in range(len(G))]
  dist[s] = 0

  topo = topoSort(G)
  # una pasada, en orden topológico
  for u in topo:
    for (v, duv) in G[u]:
      # relajar la arista (u, v)
      if dist[u] + duv < dist[v]:
        dist[v] = dist[u] + duv
        pred[v] = u
  return dist, pred
```

### topoSort: cuántas aristas llegan a cada vértice

```python linenums="13"
def topoSort(G):
  q, topo, inc = deque(), [], [0 for _ in range(len(G))]
  # inc[v]: cuántas aristas llegan a v
  for u in range(len(G)):
    for (v, _) in G[u]:
      inc[v] += 1

  # sin aristas de entrada: van primero
  for u in range(len(G)):
    if inc[u] == 0:
      q.append(u)
```

La línea 14 crea la cola `q`, la lista `topo` y el contador `inc`, en cero. En
las líneas 16 a 18 cada arista $(u,v)$ suma uno a `inc[v]`. Las líneas 21 a 23
meten a la cola los vértices sin aristas de entrada, que pueden ir primero.

### topoSort: sacar y quitar aristas

```python linenums="25"
  while len(q) != 0:
    u = q.popleft()
    topo.append(u)

    # quitar las aristas de u
    for (v, _) in G[u]:
      inc[v] -= 1
      if inc[v] == 0:
        q.append(v)
  return topo
```

En las líneas 26 y 27 sale el primero de la cola y pasa al orden. Las líneas
30 a 33 quitan sus aristas, y el vértice que se queda sin aristas de entrada
entra a la cola. Cada vértice y cada arista se tocan una vez, de modo que
`topoSort` cuesta $O(n+m)$.

### topoSort sobre el grafo del ejemplo

Al empezar, las líneas 16 a 18 dejan `inc = [1, 3, 1, 1, 0, 3, 1, 2]`.

| Sale (26) | Entran (33) | `q` |
|---|---|---|
| | $4$ (línea 23) | $[4]$ |
| $4$ | $0$, $2$ | $[0, 2]$ |
| $0$ | $6$ | $[2, 6]$ |
| $2$ | $3$ | $[6, 3]$ |
| $6$ | | $[3]$ |
| $3$ | $1$ | $[1]$ |
| $1$ | $5$ | $[5]$ |
| $5$ | $7$ | $[7]$ |
| $7$ | | $[\,]$ |

El orden que devuelve es `topo = [4, 0, 2, 6, 3, 1, 5, 7]`.

### ssspDAG: la inicialización

```python linenums="37"
def ssspDAG(G, s):
  dist, pred = [INF for _ in range(len(G))], [-1 for _ in range(len(G))]
  dist[s] = 0

  topo = topoSort(G)
```

La línea 38 pone todas las distancias en $\infty$ y todos los predecesores en
$-1$. En la 39 la fuente queda a distancia $0$, y la 41 calcula el orden
topológico en $O(n+m)$.

### ssspDAG: la pasada

```python linenums="43"
  for u in topo:
    for (v, duv) in G[u]:
      # relajar la arista (u, v)
      if dist[u] + duv < dist[v]:
        dist[v] = dist[u] + duv
        pred[v] = u
  return dist, pred
```

Las líneas 43 y 44 recorren los vértices en orden topológico y, de cada uno,
sus aristas: cada arista se mira una vez. Las líneas 46 a 48 son la
relajación de Bellman-Ford, sin cambios.

## La pasada, vértice por vértice

La tabla sigue `ssspDAG(G, 2)` sobre el orden `[4, 0, 2, 6, 3, 1, 5, 7]`. Los
números entre paréntesis son las líneas del código.

| $u$ (43) | Arista (44) | Candidato (46) | `dist[v]` | Qué pasa |
|---|---|---|---|---|
| $4$ | $(4,0)$, $(4,2)$ | $\infty+4$, $\infty+6$ | | no mejora: `dist[4]` es $\infty$ |
| $0$ | $(0,1)$, $(0,6)$ | $\infty-1$, $\infty+3$ | | no mejora |
| $2$ | $(2,1)$ | $0+4=4$ | $\infty$ | $\mathit{dist}[1] \gets 4$, $\mathit{pred}[1] \gets 2$ |
| $2$ | $(2,3)$ | $0+2=2$ | $\infty$ | $\mathit{dist}[3] \gets 2$, $\mathit{pred}[3] \gets 2$ |
| $6$ | $(6,5)$, $(6,7)$ | $\infty+1$, $\infty+4$ | | no mejora |
| $3$ | $(3,1)$ | $2-7=-5$ | $4$ | $\mathit{dist}[1] \gets -5$, $\mathit{pred}[1] \gets 3$ |
| $3$ | $(3,5)$ | $2+3=5$ | $\infty$ | $\mathit{dist}[5] \gets 5$, $\mathit{pred}[5] \gets 3$ |
| $1$ | $(1,5)$ | $-5+2=-3$ | $5$ | $\mathit{dist}[5] \gets -3$, $\mathit{pred}[5] \gets 1$ |
| $5$ | $(5,7)$ | $-3-2=-5$ | $\infty$ | $\mathit{dist}[7] \gets -5$, $\mathit{pred}[7] \gets 5$ |
| $7$ | | | | no tiene aristas de salida |

Los dos primeros del orden, $4$ y $0$, van antes que la fuente y sus
distancias son $\infty$. En la línea 46, $\infty$ más cualquier peso da
$\infty$, y $\infty < \infty$ es falso. Las aristas de la fuente dan los
primeros valores finitos: $4$ para el vértice $1$ y $2$ para el vértice $3$.

$\mathit{dist}[1]$ pasa de $4$ a $-5$ cuando sale $3$. Cuando le llegue el
turno a $1$, ¿puede volver a cambiar? No. Las tres aristas que llegan a $1$
salen de $0$, $2$ y $3$, que van antes en el orden y ya se procesaron. Cuando
sale $1$, $-5$ es su distancia final, y por eso $(1,5)$ se relaja con el
valor correcto.

### Lo que deja la pasada

| | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ |
|---|---|---|---|---|---|---|---|---|
| `dist` | $\infty$ | $-5$ | $0$ | $2$ | $\infty$ | $-3$ | $\infty$ | $-5$ |
| `pred` | $-1$ | $3$ | $-1$ | $2$ | $-1$ | $1$ | $-1$ | $5$ |

El camino hasta $7$ se reconstruye subiendo por `pred` desde $7$:
$7 \leftarrow 5 \leftarrow 1 \leftarrow 3 \leftarrow 2$. Es
$\langle 2, 3, 1, 5, 7 \rangle$, de peso $2 - 7 + 2 - 2 = -5$.

### Cualquier orden topológico sirve

El mismo grafo tiene otro orden topológico, $4, 0, 6, 2, 3, 1, 5, 7$. Si la
pasada usa ese orden, no cambia ninguna distancia. El argumento solo usa que
las aristas que llegan a $u$ salen de vértices que van antes en el orden, y
eso lo cumple todo orden topológico. Entre $6$ y $2$ no hay camino, así que da
igual cuál vaya primero.

El orden sí tiene que ser topológico. Si $3$ fuera después de $1$, la arista
$(1,5)$ se relajaría con $\mathit{dist}[1] = 4$ y $\mathit{dist}[5]$
terminaría en $5$, no en $-3$.

### Lo que cuesta

`topoSort` cuesta $O(n+m)$, la inicialización $O(n)$, y la pasada mira cada
arista una vez, $O(n+m)$. El total es $O(n+m)$, contra el $O(nm)$ de
Bellman-Ford. En espacio se usa $O(n)$ para `dist`, `pred`, `inc`, la cola y
el orden, además de las listas de adyacencia.

¿Qué devuelve `topoSort` si el grafo tiene un ciclo? Los vértices del ciclo
nunca llegan a `inc` igual a cero y no entran a la cola. `topo` queda con
menos de $n$ vértices, y `ssspDAG` no relaja las aristas que salen de los que
faltan. La revisión es barata: si `len(topo) != len(G)`, el grafo tiene un
ciclo y hay que usar otro algoritmo.

## El algoritmo de Dijkstra

### Si hay ciclos, ¿qué vértice va primero?

Con ciclos no hay orden topológico, y hace falta otra forma de saber cuándo
la distancia de un vértice ya no puede mejorar. La idea de Dijkstra (CLRS,
Sección 24.3) parte de los pesos. Si ningún peso es negativo, el vértice
pendiente con la menor distancia conocida ya tiene su distancia final:
cualquier otro camino hasta él pasa por un vértice pendiente que ya está
igual de lejos o más, y lo que falta no resta.

El algoritmo solo se aplica a grafos sin pesos negativos. Usa una cola de
prioridad de la que sale primero el vértice con la menor distancia, y cuesta
$O((n+m)\log n)$.

### El pseudocódigo: primera versión

En la primera versión todos los vértices están en la cola desde el
principio.

```text
para cada v: dist[v] = ∞; pred[v] = -1
dist[s] = 0
Q = todos los vértices, con prioridad dist
mientras Q no esté vacía
    u = el de menor dist en Q; sacarlo de Q
    para cada arista (u, v) de peso w
        si dist[u] + w < dist[v]: dist[v] = dist[u] + w; pred[v] = u
```

Frente al DAG, el orden en que se procesan los vértices ya no se calcula
antes: lo decide la cola, por distancia.

### La primera versión sobre un grafo con ciclos

El grafo tiene los vértices $1$ a $7$, y la fuente es $7$.

| $u$ | aristas `(v, peso)` |
|---|---|
| $1$ | $(2, 4)$, $(3, 10)$ |
| $2$ | $(5, 2)$ |
| $3$ | $(2, 3)$ |
| $4$ | $(1, 2)$, $(3, 1)$, $(5, 6)$, $(6, 3)$ |
| $5$ | $(3, 7)$, $(4, 1)$, $(6, 1)$, $(7, 4)$ |
| $6$ | $(3, 5)$, $(7, 2)$ |
| $7$ | $(1, 2)$, $(2, 3)$ |

Cada fila de la traza dice qué vértice sale, con su distancia entre
paréntesis, y cómo quedan las distancias después de relajar sus aristas.

| Sale | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | Qué cambia |
|---|---|---|---|---|---|---|---|---|
| | $\infty$ | $\infty$ | $\infty$ | $\infty$ | $\infty$ | $\infty$ | $0$ | inicio |
| $7$ ($0$) | **$2$** | **$3$** | $\infty$ | $\infty$ | $\infty$ | $\infty$ | $0$ | $\mathit{pred}[1]=\mathit{pred}[2]=7$ |
| $1$ ($2$) | $2$ | $3$ | **$12$** | $\infty$ | $\infty$ | $\infty$ | $0$ | $\mathit{pred}[3]=1$ |
| $2$ ($3$) | $2$ | $3$ | $12$ | $\infty$ | **$5$** | $\infty$ | $0$ | $\mathit{pred}[5]=2$ |
| $5$ ($5$) | $2$ | $3$ | $12$ | **$6$** | $5$ | **$6$** | $0$ | $\mathit{pred}[4]=\mathit{pred}[6]=5$ |
| $6$ ($6$) | $2$ | $3$ | **$11$** | $6$ | $5$ | $6$ | $0$ | $\mathit{pred}[3]=6$ |
| $4$ ($6$) | $2$ | $3$ | **$7$** | $6$ | $5$ | $6$ | $0$ | $\mathit{pred}[3]=4$ |
| $3$ ($7$) | $2$ | $3$ | $7$ | $6$ | $5$ | $6$ | $0$ | nada: $7+3 > 3$ |

Primero sale la fuente, la única con distancia finita, y sus aristas dan $2$
al vértice $1$ y $3$ al vértice $2$. Después de sacar $1$ y $2$ quedan en la
cola $3$ con $12$ y $5$ con $5$, y los demás con $\infty$. ¿Cuál sale, y qué
vértices cambian? Sale $5$. Sus aristas dan $6$ a $4$ y a $6$. La arista
$(5,3)$ da $5+7 = 12$, que no es menor que $12$, y $(5,7)$ llega a la fuente,
que ya salió.

Luego hay un empate: $4$ y $6$ salen con $6$. En la tabla sale primero $6$, y
$\mathit{dist}[3]$ pasa por $11$ antes de llegar a $7$; con $4$ primero, pasa
de $12$ a $7$. Las distancias finales son las mismas.

### La segunda versión: la que se implementa

La primera versión baja la prioridad de un vértice que ya está en la cola, y
`heapq` no sabe hacerlo: solo mete y saca. La segunda versión lo resuelve de
otra forma. En la cola van parejas `(distancia, vértice)`, y al principio solo
la de la fuente. Cuando una distancia mejora, se mete otra pareja con el valor
nuevo y la de antes se queda en la cola. Al sacar una pareja se compara con
`dist`: si no coincide, es una pareja vieja y se descarta.

### El código completo

[250331-agra-dijkstra.py](./codigo/250331-agra-dijkstra.py) trae la versión
uno a uno, `dijkstraST`, y la versión uno a todos, `dijkstra`.

```python linenums="1"
"""
Implementación Algoritmo Dijkstra
Octubre 1 de 2024

"""

from heapq import heappush,heappop

INF = float('inf')

# Implementación algoritmo de Dijkstra para la versión uno a uno
def dijkstraST(G, s, t):
  dist = [INF for _ in range(len(G))] ; dist[s] = 0
  pqueue, found = list(), False
  #for u in range(len(G)): heappush(pqueue, (dist[u], u))
  heappush(pqueue, (dist[s], s))

  while len(pqueue)!=0 and not found:
    du,u = heappop(pqueue)
    # al salir t, su distancia es final
    if u == t:
      found = True
    else:
      # pareja vieja: se descarta
      if dist[u] == du:
        for v,duv in G[u]:
          if du+duv<dist[v]:
            dist[v] = du+duv
            heappush(pqueue, (dist[v], v))
  return dist[t]

# Implementación algoritmo de Dijkstra para la versión uno a todos
# Complejidad: T(n, m) E O((n + m) * log n)
def dijkstra(G, s):
  dist = [INF for _ in range(len(G))] ; dist[s] = 0
  pred = [-1 for _ in range(len(G))]
  pqueue = list()
  #for u in range(len(G)): heappush(pqueue, (dist[u], u))
  heappush(pqueue, (dist[s], s))

  while len(pqueue)!=0:
    # la pareja de menor distancia
    du,u = heappop(pqueue)
    # si no coincide, la pareja es vieja
    if dist[u] == du:
      for v,duv in G[u]:
        # si mejora, v entra otra vez
        if du+duv<dist[v]:
          dist[v] = du+duv
          pred[v] = u
          heappush(pqueue, (dist[v], v))
  return dist
```

### dijkstra: la inicialización

```python linenums="34"
def dijkstra(G, s):
  dist = [INF for _ in range(len(G))] ; dist[s] = 0
  pred = [-1 for _ in range(len(G))]
  pqueue = list()
  #for u in range(len(G)): heappush(pqueue, (dist[u], u))
  heappush(pqueue, (dist[s], s))
```

Las líneas 35 y 36 ponen las distancias en $\infty$, la de la fuente en $0$,
y los predecesores en $-1$. La cola es una lista que `heappush` y `heappop`
manejan como montículo; la línea 37 la crea y la 39 mete la pareja `(0, s)`.
La línea 38, comentada, es la primera versión, con todos los vértices en la
cola desde el principio.

### dijkstra: sacar la pareja menor

```python linenums="41"
  while len(pqueue)!=0:
    # la pareja de menor distancia
    du,u = heappop(pqueue)
    # si no coincide, la pareja es vieja
    if dist[u] == du:
```

El ciclo de la línea 41 sigue mientras haya parejas. En la 43, `heappop` saca
la pareja de menor distancia, porque las tuplas se comparan primero por la
distancia. Si en la línea 45 `dist[u]` ya no es `du`, la distancia de $u$
mejoró después de meter esta pareja: la pareja es vieja y no se procesa.

### dijkstra: la relajación

```python linenums="46"
      for v,duv in G[u]:
        # si mejora, v entra otra vez
        if du+duv<dist[v]:
          dist[v] = du+duv
          pred[v] = u
          heappush(pqueue, (dist[v], v))
  return dist
```

La línea 46 recorre las aristas de $u$ como pares `(v, duv)`. Las líneas 48 a
50 relajan con `du` en lugar de `dist[u]`, que en este punto valen lo mismo.
En la 51, $v$ entra a la cola con su distancia nueva, aunque ya tenga ahí una
pareja con la distancia anterior.

### La segunda versión sobre otro grafo

El grafo tiene los vértices $0$ a $7$, y la llamada es `dijkstra(G, 3)`. Entre
$4$ y $5$ hay una arista en cada sentido, las dos de peso $6$.

| $u$ | aristas `(v, peso)` |
|---|---|
| $0$ | $(1, 3)$, $(3, 1)$ |
| $1$ | $(2, 5)$, $(5, 2)$ |
| $2$ | $(0, 2)$, $(4, 5)$ |
| $3$ | $(2, 4)$, $(6, 2)$ |
| $4$ | $(0, 1)$, $(1, 5)$, $(5, 6)$, $(7, 3)$ |
| $5$ | $(4, 6)$, $(6, 3)$ |
| $6$ | $(2, 4)$, $(5, 1)$ |
| $7$ | $(2, 5)$, $(3, 4)$, $(4, 1)$ |

| Sale (43) | Cambia (48 a 51) | `pqueue` después |
|---|---|---|
| $(0, 3)$ | $\mathit{dist}[2] \gets 4$, $\mathit{dist}[6] \gets 2$, $\mathit{pred} = 3$ | $(2,6)$, $(4,2)$ |
| $(2, 6)$ | $\mathit{dist}[5] \gets 3$, $\mathit{pred}[5] = 6$; $(6,2)$ da $6 > 4$ | $(3,5)$, $(4,2)$ |
| $(3, 5)$ | $\mathit{dist}[4] \gets 9$, $\mathit{pred}[4] = 5$ | $(4,2)$, $(9,4)$ |
| $(4, 2)$ | $\mathit{dist}[0] \gets 6$, $\mathit{pred}[0] = 2$; $(2,4)$ da $9$, no mejora | $(6,0)$, $(9,4)$ |
| $(6, 0)$ | $\mathit{dist}[1] \gets 9$, $\mathit{pred}[1] = 0$ | $(9,1)$, $(9,4)$ |
| $(9, 1)$ | nada: $14 > 4$ y $11 > 3$ | $(9,4)$ |
| $(9, 4)$ | $\mathit{dist}[7] \gets 12$, $\mathit{pred}[7] = 4$ | $(12,7)$ |
| $(12, 7)$ | nada | vacía |

La columna de la cola lleva todas las parejas metidas, también las que no se
van a usar. En este grafo no sobra ninguna, porque ningún vértice mejora dos
veces; el caso contrario es el de la sección siguiente.

La línea 39 mete $(0,3)$, y al sacarla las aristas $(3,2)$ y $(3,6)$ meten dos
parejas. Cuando sale $(4,2)$, las aristas de $2$ van a $0$, con peso $2$, y a
$4$, con peso $5$. ¿Qué parejas entran a la cola? Solo $(6,0)$. Por $(2,4)$
el candidato es $4+5 = 9$, igual a `dist[4]`, y la línea 48 pide menor
estricto, así que $\mathit{pred}[4]$ sigue en $5$.

Al final quedan $\mathit{dist} = (6, 9, 4, 0, 9, 3, 2, 12)$ y
$\mathit{pred} = (2, 0, 3, -1, 5, 6, 3, 4)$. El camino a $7$ es
$\langle 3, 6, 5, 4, 7 \rangle$, de peso $2 + 1 + 6 + 3 = 12$.

### Una pareja vieja

En el grafo de la primera versión, con el código, `dijkstra(G, 7)`. La pareja
$(12, 3)$ entra cuando sale $1$ y se queda en la cola hasta el final sin que
nadie la use, porque el camino bueno hasta $3$ aparece después, por $4$. La
columna de la cola la lleva fila por fila, que es la única forma de ver
cuándo deja de servir.

| Sale (43) | Línea 45 | `pqueue` después |
|---|---|---|
| $(0, 7)$ | $0 = 0$: se procesa | $(2,1)$, $(3,2)$ |
| $(2, 1)$ | $2 = 2$: se procesa; mete $(12,3)$ | $(3,2)$, $(12,3)$ |
| $(3, 2)$ | $3 = 3$: se procesa; mete $(5,5)$ | $(5,5)$, $(12,3)$ |
| $(5, 5)$ | $5 = 5$: se procesa; mete $(6,4)$ y $(6,6)$ | $(6,4)$, $(6,6)$, $(12,3)$ |
| $(6, 4)$ | $6 = 6$: se procesa; mete $(7,3)$ | $(6,6)$, $(7,3)$, $(12,3)$ |
| $(6, 6)$ | $6 = 6$: se procesa | $(7,3)$, $(12,3)$ |
| $(7, 3)$ | $7 = 7$: se procesa | $(12,3)$ |
| $(12, 3)$ | $\mathit{dist}[3] = 7 \neq 12$: se descarta | vacía |

En el empate entre $(6,4)$ y $(6,6)$, `heappop` sacó primero $(6,4)$, aunque
en la traza de la primera versión salió primero $6$. Con distancias iguales,
Python compara el segundo elemento de la tupla, y $4 < 6$. En la primera
versión el empate se rompió a mano. Con $4$ primero, $\mathit{dist}[3]$ pasa
de $12$ a $7$ sin pasar por $11$.

### dijkstraST: uno a uno

```python linenums="18"
  while len(pqueue)!=0 and not found:
    du,u = heappop(pqueue)
    # al salir t, su distancia es final
    if u == t:
      found = True
    else:
      # pareja vieja: se descarta
      if dist[u] == du:
        for v,duv in G[u]:
          if du+duv<dist[v]:
            dist[v] = du+duv
            heappush(pqueue, (dist[v], v))
  return dist[t]
```

El ciclo de la línea 18 para cuando `found` es verdadero. Las líneas 21 y 22
reconocen la primera vez que sale $t$, y en ese momento su distancia es la
final. La línea 30 devuelve `dist[t]`, que es $\infty$ si $t$ no se alcanza.

### Por qué los pesos no pueden ser negativos

**Teorema (CLRS, Teorema 24.6).** Si $G$ es dirigido con pesos
$w(u,v) \geq 0$ y fuente $s$, al terminar Dijkstra
$\mathit{dist}[u] = \delta(s,u)$ para todo $u \in V$.

La demostración muestra que $u$ ya tiene ese valor cuando sale de la cola, y
la hipótesis entra en un solo paso. Sea $p$ un camino más corto de $s$ a $u$ y
sea $y$ el primer vértice de $p$ que sigue pendiente. Entonces
$\mathit{dist}[y] = \delta(s,y) \leq \delta(s,u) \leq \mathit{dist}[u]$. La
desigualdad del medio se cumple porque el tramo de $y$ a $u$ pesa $0$ o más.
Como $u$ salió primero, $\mathit{dist}[u] \leq \mathit{dist}[y]$, y todo es
igual.

### Un contraejemplo

El grafo tiene tres vértices y las aristas $(0,1)$ de peso $1$, $(0,2)$ de
peso $2$ y $(2,1)$ de peso $-2$. ¿Qué devuelve `dijkstraST(G, 0, 1)`, y cuál
es la distancia de $0$ a $1$?

Sale $(0,0)$ y entran $(1,1)$ y $(2,2)$. Sale $(1,1)$, que es $t$, y la
función devuelve $1$. Pero $\langle 0,2,1 \rangle$ pesa $2 - 2 = 0$.

La versión uno a todos, `dijkstra(G, 0)`, saca $(2,2)$, mejora
$\mathit{dist}[1]$ a $0$ y mete $(0,1)$. Aquí acierta, pero procesa el
vértice $1$ dos veces. Con pesos negativos un vértice puede salir muchas
veces y el costo $O((n+m)\log n)$ deja de valer; con un ciclo negativo, el
`while` no termina. Con pesos negativos se usa la pasada en orden topológico
si el grafo es un DAG, y Bellman-Ford-Moore si no lo es.

### Lo que cuesta Dijkstra

Con pesos no negativos cada vértice se procesa una vez, cuando sale su pareja
buena, y en ese momento cada una de sus aristas mete a lo sumo una pareja.
Entran a lo sumo $m+1$ parejas. Cada `heappush` y cada `heappop` cuesta
$O(\log m)$, y $\log m \leq \log n^2 = 2 \log n$. Con las $O(n+m)$ vueltas,
el total es $O((n+m)\log n)$.

| Algoritmo | Pesos | Tiempo |
|---|---|---|
| Búsqueda en amplitud | todos iguales | $O(n+m)$ |
| Pasada en orden topológico | cualquiera, sin ciclos | $O(n+m)$ |
| Dijkstra | no negativos | $O((n+m)\log n)$ |
| Bellman-Ford-Moore | cualquiera | $O(nm)$ |

Si todos los pesos valen $1$, ¿qué hace Dijkstra que no haga la búsqueda en
amplitud? Nada que haga falta. La búsqueda en amplitud ya saca los vértices en
orden de distancia, y su cola común hace el trabajo del montículo sin el
$\log n$. Dijkstra da las mismas distancias y paga ese logaritmo. En un grafo
de estados cuyas transiciones cuestan distinto, la búsqueda en amplitud deja
de servir y entra Dijkstra, como en Super Mario.

## UVa 10269, Adventure of Super Mario

### El problema

El enunciado está en <https://onlinejudge.org/external/102/10269.pdf> y el
envío se hace en <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1210>.

Hay $A$ aldeas, numeradas de $1$ a $A$, y $B$ castillos, de $A+1$ a $A+B$,
unidos por $M$ vías de doble sentido. Caminar por una vía de longitud $\ell$
toma $\ell$ unidades de tiempo. Mario sale del castillo $A+B$ y va a su casa,
en la aldea $1$.

Con la bota mágica puesta, Mario corre de un lugar a otro en tiempo $0$. Cada
carrera empieza y termina en una aldea o en un castillo, cubre a lo sumo $L$
kilómetros y nunca atraviesa un castillo: si hay uno en el camino, ahí para.
La bota se usa a lo sumo $K$ veces.

En la entrada, $1 \leq A, B \leq 50$, $1 \leq L \leq 500$, $0 \leq K \leq 10$
y las longitudes van de $1$ a $100$. Se imprime el menor tiempo para llegar a
casa.

### El ejemplo del enunciado

```text
1
4 2 6 9 1
4 6 1
5 6 10
4 5 5
3 5 4
2 3 4
1 2 3
```

La salida es `9`. Aquí $A = 4$, $B = 2$, $M = 6$, $L = 9$ y $K = 1$, y los
castillos son $5$ y $6$. Las aldeas forman una fila, $1$, $2$, $3$, con vías
de longitud $3$ y $4$; de $3$ al castillo $5$ hay $4$, de $5$ a la aldea $4$
hay $5$, de $4$ al castillo $6$ hay $1$, y de $5$ a $6$ hay una vía directa de
$10$.

Sin la bota, ¿cuánto tarda Mario de $1$ a $6$, y dónde conviene ponérsela? A
pie, $\langle 1,2,3,5,4,6 \rangle$ toma $3+4+4+5+1 = 17$. Con la bota puesta
en $2$, la carrera $\langle 2,3,5 \rangle$ cubre $8 \leq 9$ y para en el
castillo $5$. El resto va a pie, y el total es $3 + 0 + 5 + 1 = 9$.

### Por qué no basta el grafo de lugares

El lugar no lo dice todo. Desde la aldea $3$ se puede seguir corriendo o no,
según si Mario trae la bota puesta, cuánto le queda de la carrera y cuántos
usos le quedan. Dos llegadas a $3$ con el mismo tiempo pueden terminar en
tiempos distintos.

Los costos tampoco son iguales. Caminar cuesta la longitud de la vía y correr
cuesta $0$. La búsqueda en amplitud, que resolvió *The New Villa*, cuenta
pasos y aquí no sirve; sobre el grafo de estados se usa Dijkstra.

### Los estados

Un estado es una tupla $(a, b, c, d)$ con la ubicación de Mario,
$a \in [1, \ldots, A+B]$; los usos disponibles de la bota,
$b \in [0, \ldots, K]$; si tiene puesta la bota, $c \in \{0, 1\}$, y la
distancia pendiente con la bota, $d \in [0, \ldots, L]$.

El estado inicial es $(1, K, 0, 0)$, y los finales son los de la forma
$(A+B, b, c, d)$. Las vías son de doble sentido y una carrera al revés
también es válida, así que ir de $1$ a $A+B$ cuesta lo mismo que volver.

### Las transiciones

| Transición | Cambia | Condiciones | Costo |
|---|---|---|---|
| Moverse sin la bota, $(a,b,0,d) \to (a',b,0,d)$ | $a$ | $(a,a')$ es una arista de peso $v$ | $v$ |
| Moverse con la bota, $(a,b,1,d) \to (a',b,1,d-v)$ | $a$ y $d$ | $(a,a')$ es una arista de peso $v$, $d \geq v$, y $a \leq A$ o la carrera empieza en $a$ ($d = L$) | $0$ |
| Quitarse la bota, $(a,b,1,d) \to (a,b,0,0)$ | $c$ y $d$ | $c = 1$ | $0$ |
| Ponerse la bota, $(a,b,0,d) \to (a,b-1,1,L)$ | $b$, $c$ y $d$ | $c = 0$ y $b > 0$ | $0$ |

La condición $a \leq A$ o $d = L$ impide atravesar un castillo. Mario llega
corriendo al castillo $5$ con $d = 1$: ¿puede seguir corriendo hacia $4$? No,
por dos razones. $5$ es un castillo y la carrera no empezó ahí
($d = 1 \neq L$), y además la vía mide $5 > 1$. Puede quitarse la bota y
caminar, o ponérsela otra vez si le quedan usos; en el ejemplo $K = 1$ y no
le quedan.

### Una parte del grafo de estados

La tabla trae diez estados del ejemplo y las aristas entre ellos. Las
marcadas en la última columna forman el camino de la respuesta.

| Desde | Hasta | Costo | Qué hace | Camino |
|---|---|---|---|---|
| $(1,1,0,0)$ | $(1,0,1,9)$ | $0$ | se pone la bota en $1$ | |
| $(1,1,0,0)$ | $(2,1,0,0)$ | $3$ | camina a $2$ | sí |
| $(2,1,0,0)$ | $(3,1,0,0)$ | $4$ | camina a $3$ | |
| $(2,1,0,0)$ | $(2,0,1,9)$ | $0$ | se pone la bota en $2$ | sí |
| $(2,0,1,9)$ | $(3,0,1,5)$ | $0$ | corre a $3$ | sí |
| $(3,0,1,5)$ | $(5,0,1,1)$ | $0$ | corre al castillo $5$ | sí |
| $(5,0,1,1)$ | $(5,0,0,0)$ | $0$ | se quita la bota | sí |
| $(5,0,0,0)$ | $(4,0,0,0)$ | $5$ | camina a $4$ | sí |
| $(4,0,0,0)$ | $(6,0,0,0)$ | $1$ | camina a $6$ | sí |

El camino cuesta $3+0+0+0+0+5+1 = 9$: caminar a $2$, ponerse la bota, correr a
$3$ y a $5$, quitársela y caminar a $4$ y a $6$. $(6,0,0,0)$ es un estado
final.

### Cuántos estados y cuántas transiciones

En el peor caso,

$$
n = (A+B) \cdot 2 \cdot (K+1) \cdot (L+1), \qquad m = (A+B) \cdot n.
$$

Con $A+B = 100$, $K = 10$ y $L = 500$ son
$n = 100 \cdot 2 \cdot 11 \cdot 501 = 1\,102\,200$ estados, y Dijkstra cuesta
$O((n+m)\log n)$. El grafo de estados no se construye: los sucesores de cada
estado se calculan cuando sale de la cola, y solo se guardan los estados a
los que se llega.

### Del estado al código

El estado del código es `(u, l, k)`. `u` es $a$, el lugar, y `k` es $b$, los
usos que quedan. `l` es $d$, la distancia pendiente. No hace falta $c$,
porque quitarse la bota y caminar es una sola transición, que deja `l` en $0$.

En la cola van tuplas `(c, u, l, k)`, donde `c` es el tiempo. El diccionario
`vis` guarda el menor tiempo conocido de cada estado y hace el papel de
`dist`.

### El código completo

[10269-super-mario.py](./codigo/10269-super-mario.py) lee los casos de la
entrada estándar e imprime un tiempo por caso.

```python linenums="1"
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
```

### La lectura y el estado inicial

```python linenums="15"
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
```

La línea 16 crea las listas de los lugares $1$ a $a+b$; la posición $0$ no se
usa. En las líneas 19 y 20 cada vía entra en las dos listas. Las líneas 26 y
27 meten el estado inicial $(1, 0, K)$ con tiempo $0$: en la aldea $1$, sin la
bota y con los $K$ usos.

### Sacar un estado

```python linenums="28"
    while len(queue) > 0 and not flag:
      (c, u, l, k) = heappop(queue)

      # al salir a + b, c es el mínimo
      if u == a + b: flag = True
      else:
        # tupla vieja: se descarta
        if vis[(u, l, k)] == c:
```

En la línea 29 sale la tupla de menor tiempo. Si es el castillo $a+b$, la
línea 32 toma ese tiempo como respuesta y el ciclo para, como en
`dijkstraST`. La línea 35 descarta la tupla vieja, como la línea 45 de
`dijkstra`.

### Ponerse la bota

```python linenums="36"
          # se coloca los zapatos especiales
          if l != L and k > 0:
            if (u, L, k - 1) not in vis or vis[(u, L, k - 1)] > c:
              heappush(queue, (c, u, L, k - 1))
              vis[(u, L, k - 1)] = c
```

La condición de la línea 37 pide que la carrera no esté recién empezada
(`l != L`) y que quede algún uso. Las líneas 38 a 40 meten el estado
$(u, L, k-1)$ con el mismo tiempo `c`, si mejora lo que hay en `vis`.

### Caminar

```python linenums="41"
          for (v, p) in G[u]:
            if (v, 0, k) not in vis or vis[(v, 0, k)] > c + p:
              # se mueve sin usar los zapatos
              heappush(queue, (c + p, v, 0, k))
              vis[(v, 0, k)] = c + p
```

La línea 41 recorre las vías que salen de $u$, con su longitud `p`. En las
líneas 42, 44 y 45, caminar a $v$ cuesta `p` y deja `l` en $0$. Si Mario traía
la bota puesta, se la quitó antes de caminar.

### Correr

```python linenums="46"
            # se mueve usando los zapatos
            # alcanza la carga y u es aldea
            # o la carrera empieza en u
            if l >= p and (u <= a or l == L):
              if (v, l - p, k) not in vis or vis[(v, l - p, k)] > c:
                heappush(queue, (c, v, l - p, k))
                vis[(v, l - p, k)] = c
```

La línea 49 exige que la carga alcance para la vía y que $u$ sea una aldea o
que la carrera empiece en $u$. Si $u$ es un castillo y `l < L`, Mario llegó
corriendo a él y ahí para. Las líneas 50 a 52 meten el estado $(v, l-p, k)$
con el mismo tiempo `c`.

### El código sobre el ejemplo

Las tuplas son `(c, u, l, k)`. Salen $25$, y la tabla muestra las primeras y
las del camino de la respuesta, con su turno.

| Turno | Sale (29) | De dónde viene |
|---|---|---|
| $1$ | $(0, 1, 0, 1)$ | estado inicial, líneas 26 y 27 |
| $2$ | $(0, 1, 9, 0)$ | se pone la bota en $1$, líneas 37 a 40 |
| $3$ | $(0, 2, 6, 0)$ | corre de $1$ a $2$, líneas 49 a 52 |
| $6$ | $(0, 3, 2, 0)$ | corre de $2$ a $3$ |
| $9$ | $(3, 2, 0, 1)$ | camina de $1$ a $2$, líneas 42 a 45 |
| $10$ | $(3, 2, 9, 0)$ | se pone la bota en $2$ |
| $13$ | $(3, 3, 5, 0)$ | corre de $2$ a $3$ |
| $15$ | $(3, 5, 1, 0)$ | corre de $3$ al castillo $5$ |
| $24$ | $(8, 4, 0, 0)$ | camina de $5$ a $4$ |
| $25$ | $(9, 6, 0, 0)$ | camina de $4$ a $6$: línea 32, imprime $9$ |

Las primeras en salir cuestan $0$: Mario se pone la bota en $1$ y corre a $2$
y a $3$. ¿Por qué ese camino no da la respuesta? Llega a $3$ con $2$ de carga
y la vía a $5$ mide $4$. Sin usos, todo lo demás es a pie, $4 + 5 + 1 = 10$.
Caminar primero a $2$ cuesta $3$, pero la carrera desde $2$ llega hasta el
castillo $5$.

$(9, 6, 0, 0)$ sale antes que cualquier otra tupla del castillo $6$, así que
$9$ es el menor tiempo. Es el camino de la tabla del grafo de estados.

### El tamaño en el código

El estado del código no guarda $c$. ¿Cuántos estados `(u, l, k)` hay en el
peor caso? Son $(A+B)(L+1)(K+1) = 100 \cdot 501 \cdot 11 = 551\,100$, la
mitad de la cuenta con $c$. Por cada estado se miran a lo sumo las vías de su
lugar.

**Consejo para el juez.** El estado es la pieza que hay que encontrar: el
lugar solo no basta, porque la carga que le queda a la bota y los usos deciden
qué se puede hacer después. La trampa está en los castillos. Una carrera que
llega a un castillo para ahí, y solo puede seguir corriendo desde él una
carrera que empieza en ese castillo.

## Problemas de juez

### UVa 10986, Sending email

El enunciado está en <https://onlinejudge.org/external/109/10986.pdf> y el
envío se hace en <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1927>.

Hay $n \leq 20\,000$ servidores y $m \leq 50\,000$ cables de doble sentido,
con latencias de $0$ a $10\,000$. Se pide el menor tiempo de $S$ a $T$, o
`unreachable`.

**Cómo atacarlo.** Los pesos no son negativos y hay un solo destino, así que
sirve `dijkstraST(G, S, T)`, con cada cable en las dos listas. Si devuelve
$\infty$, se imprime `unreachable`. La trampa es que $m$ puede ser $0$, y que
la salida lleva `Case #x:` delante.

### UVa 1112, Mice and Maze

El enunciado está en <https://onlinejudge.org/external/11/1112.pdf> y el
envío se hace en <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=3553>.

Hay $N \leq 100$ celdas y pasajes de un solo sentido, cada uno con un tiempo.
En cada celda hay un ratón que sigue el camino más rápido a la salida $E$.
¿Cuántos llegan en a lo sumo $T$ unidades?

**Cómo atacarlo.** Son $N$ caminos que terminan en $E$. Si se invierten las
aristas, son caminos que salen de $E$, y basta un solo `dijkstra(G, E)` sobre
el grafo invertido para contar las distancias $\leq T$. La trampa son las
líneas en blanco entre casos, a la entrada y a la salida.

### UVa 10000, Longest Paths

El enunciado está en <https://onlinejudge.org/external/100/10000.pdf> y el
envío se hace en <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=941>.

Se da un grafo dirigido sin ciclos de $n \leq 100$ vértices y un punto de
partida $s$. Se pide la longitud del camino más largo que sale de $s$ y el
vértice donde termina; si hay varios, el de menor número.

**Cómo atacarlo.** El camino más largo con aristas de peso $1$ es el más corto
con aristas de peso $-1$. Sin ciclos, `ssspDAG` los calcula en una pasada, y
Dijkstra no sirve con esos pesos. La trampa está en el formato de la salida,
con una línea en blanco después de cada caso.

## Errores comunes

**Relajar en un orden que no es topológico.** Una sola pasada solo sirve en
orden topológico. Con otro orden, un vértice puede procesarse antes de tener
su distancia final.

**Dijkstra con pesos negativos.** `dijkstraST` puede devolver un valor
equivocado, y `dijkstra` pierde su costo o no termina.

**Procesar parejas viejas.** Sin la línea 45, un vértice se procesa una vez
por cada pareja suya en la cola, con distancias que ya no son las suyas.

**Meter en la cola `(v, distancia)`.** Las tuplas se comparan por su primer
elemento. Con el vértice adelante, sale primero el de menor número, no el más
cercano.

**Olvidar en el estado lo que decide el futuro.** En Super Mario, un estado
sin la carga que le queda a la bota junta llegadas que no son equivalentes.

## El código de la clase

[250325-agra-sssp-dag.py](./codigo/250325-agra-sssp-dag.py) tiene `topoSort`,
el orden topológico por conteo de aristas de entrada, y `ssspDAG`, la pasada
en orden topológico.
[250331-agra-dijkstra.py](./codigo/250331-agra-dijkstra.py) tiene
`dijkstraST`, que para al sacar el destino, y `dijkstra`, que da las
distancias a todos los vértices. [10269-super-mario.py](./codigo/10269-super-mario.py)
resuelve UVa 10269 con Dijkstra sobre los estados y lee de la entrada
estándar los casos en el formato del enunciado.

## Ejercicios

1. **Un DAG a mano.** Sea $D$ el grafo con $V = \{0, \ldots, 5\}$ y estas
   aristas, en este orden de entrada, como `u v peso`: `1 3 4`, `1 2 -1`,
   `0 1 2`, `2 4 5`, `2 3 1`, `3 5 3`, `3 4 -2`, `4 5 1`, `0 3 6`. Cada arista
   se agrega al final de `G[u]`. Dé el orden que devuelve `topoSort`, la tabla
   de `ssspDAG(G, 1)` y el camino de $1$ a $5$.
2. **Parejas viejas.** Sea $H$ el grafo con $V = \{0, \ldots, 5\}$ y aristas
   `0 1 7`, `0 2 2`, `2 1 3`, `2 3 8`, `1 3 1`, `1 4 6`, `3 4 2`, `4 5 1`,
   `3 5 5`, `2 4 9`, en ese orden. Haga la tabla de `dijkstra(G, 0)` con lo
   que sale y la cola después. ¿Cuántas parejas salen y cuántas descarta la
   línea 45?
3. **Un DAG con un peso negativo.** Sea $N$ el grafo con aristas `0 1 2`,
   `0 2 5`, `2 1 -4`, `1 3 1`. Calcule `dijkstraST(G, 0, 3)`, `dijkstra(G, 0)`
   y `ssspDAG(G, 0)`. ¿Cuáles aciertan? ¿Cuántas veces se procesa el vértice
   $3$ en `dijkstra`?
4. **El camino más largo.** Modifique `ssspDAG` para que calcule los caminos
   más largos desde $s$ en un DAG, sin cambiar los pesos de `G`. Aplíquelo al
   grafo del ejemplo de la pasada desde el vértice $4$: ¿cuál es el vértice
   más lejano y por qué camino?
5. **Otra aventura de Mario.** Sean $A = 3$, $B = 2$, $L = 7$, y las vías
   `1 2 4`, `2 3 3`, `3 5 6`, `2 4 2`, `4 5 3`, `1 3 9`. Liste los sucesores
   del estado inicial $(1, K, 0, 0)$ con su costo. Dé el menor tiempo para
   $K = 0$, $K = 1$ y $K = 2$, con el camino de cada uno. ¿Puede Mario correr
   de $1$ a $5$ en una sola carrera?
6. **Una demostración.** Demuestre que en un DAG, cuando `ssspDAG` procesa
   $u$, $\mathit{dist}[u] = \delta(s,u)$. Escriba la demostración en cuatro
   partes: teorema, estrategia, desarrollo y conclusión.

### Pistas

1. El orden es $0, 1, 2, 3, 4, 5$, y $0$ no se alcanza desde $1$.
   $\mathit{dist}[5] = -1$ por $\langle 1, 2, 3, 4, 5 \rangle$.
2. Salen $10$ parejas y $4$ son viejas. $\mathit{dist} = (0, 5, 2, 6, 8, 9)$.
3. `dijkstraST` devuelve $3$ y la distancia es $2$. Las otras dos aciertan.
4. Cambie $\infty$ por $-\infty$ y `<` por `>`. El más lejano es $5$, a $12$,
   por $\langle 4,2,1,5 \rangle$.
5. Los tiempos son $9$, $3$ y $0$. La carrera de $1$ a $4$ mide $6$ y para en
   el castillo.
6. Se procede por inducción sobre la posición de $u$ en el orden: las aristas
   que llegan a $u$ salen de vértices anteriores.

## Lo que sigue

Hasta aquí los caminos salen de una sola fuente. Para tener las distancias
entre todas las parejas de vértices se puede correr Dijkstra desde cada
vértice, o usar Floyd-Warshall, que trabaja sobre una matriz.

Para investigar:

- CLRS, Sección 25.2: ¿qué significa $d^{(k)}_{ij}$ en Floyd-Warshall, y por
  qué el ciclo de $k$ va por fuera?
- En Super Mario, ¿cómo se calcularía de antemano qué lugares alcanza una
  carrera desde cada lugar, pasando solo por aldeas? ¿Qué estado queda si ese
  dato se conoce?

## Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, 3.ª ed. MIT
  Press, 2009. Sección 24.2 y Teorema 24.5 (caminos más cortos en un DAG);
  Sección 24.3 y Teorema 24.6 (Dijkstra); Sección 25.2 (Floyd-Warshall).
- Dijkstra, E. W. A note on two problems in connexion with graphs.
  *Numerische Mathematik*, 1:269-271, 1959.
- Halim, Halim, Effendy. *Competitive Programming 4*. Lulu, 2020. Capítulo 4:
  caminos más cortos desde una fuente y grafos de estados.
- UVa Online Judge, problemas 1112, 10000, 10269 y 10986.
  <https://onlinejudge.org>
