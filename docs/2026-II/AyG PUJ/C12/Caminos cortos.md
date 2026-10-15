# Caminos más cortos: generalidades, BFS y la idea de Bellman-Ford-Moore · AyG C12

**Viernes 16 de octubre de 2026, grupo B.**

La búsqueda en amplitud ya entrega la distancia en aristas desde una fuente.
Cuando las aristas pesan distinto, el camino de menos aristas puede salir caro,
y la amplitud no corrige una distancia que ya asignó. La sesión plantea el
problema en sus dos versiones, un origen y todos los pares, mira qué hacen los
ciclos con un camino más corto y construye la idea de Bellman-Ford-Moore:
calcular los caminos más cortos que usan a lo sumo $0, 1, 2, \ldots$ aristas,
hasta $n-1$, y usar una fila más para detectar un ciclo negativo.

Al terminar la sesión se espera poder:

- Distinguir el problema de un solo origen del de todos los pares y decir qué
  algoritmo resuelve cada uno, y con qué costo.
- Ejecutar la búsqueda en amplitud a mano, llenar los arreglos de distancias y
  de predecesores y reconstruir un camino.
- Explicar por qué un camino más corto no repite vértices y por qué un ciclo
  negativo deja el problema sin solución.
- Calcular los caminos más cortos de a lo sumo $0, 1, \ldots, n-1$ aristas y
  usar la fila $n$ para detectar un ciclo negativo.

## Diapositivas

[clase12-caminos-cortos.pdf](./clase12-caminos-cortos.pdf){ target=_blank rel=noopener },
52 páginas. Allí están dibujados los grafos de esta nota, con el árbol de
caminos pintado en verde fila por fila.

## Las dos versiones del problema

**Un origen, múltiples destinos (SSSP).**
*Entrada:* un grafo dirigido $G=(V,E)$ con una función de peso
$w: E \to \mathbb{R}$ y un nodo $s \in V$.
*Salida:* un arreglo $A[0..|V|)$ tal que para cada $u \in [0..|V|)$, $A[u]$
es el costo del camino más corto entre $s$ y $u$.

**Múltiples orígenes, múltiples destinos (APSP).**
*Entrada:* un grafo dirigido $G=(V,E)$ con una función de peso
$w: E \to \mathbb{R}$.
*Salida:* una matriz $M[0..|V|)[0..|V|)$ tal que para cada
$u, v \in [0..|V|)$, $M[u][v]$ es el costo del camino más corto entre $u$ y
$v$.

SSSP viene de *single source shortest paths*; APSP, de *all pairs shortest
paths*.

### El costo de un camino

**Definición (CLRS, Capítulo 24).** Sea $G=(V,E)$ dirigido con una función de
peso $w: E \to \mathbb{R}$. El peso de un camino
$p = \langle v_0, v_1, \ldots, v_k \rangle$ es

$$
w(p) = \sum_{i=1}^{k} w(v_{i-1}, v_i),
$$

y el costo del camino más corto de $u$ a $v$, $\delta(u,v)$, es el menor
$w(p)$ entre los caminos de $u$ a $v$; vale $\infty$ si no hay camino.

Por ejemplo, si $w(0,2) = 4$, $w(2,3) = 1$ y $w(0,3) = 7$, el camino
$\langle 0,2,3 \rangle$ pesa $4+1 = 5$ y el camino $\langle 0,3 \rangle$ pesa
$7$. El de más aristas es el más corto, y $\delta(0,3) = 5$ si no hay otros
caminos.

### Los algoritmos de cada versión

Con $n = |V|$ y $m = |E|$:

| Versión | Algoritmo | Tiempo |
|---|---|---|
| SSSP | Búsqueda en amplitud (BFS) | $O(n+m)$ |
| SSSP | Algoritmo para grafos dirigidos acíclicos | $O(n+m)$ |
| SSSP | Bellman-Ford-Moore | $O(n \cdot m)$ |
| SSSP | Dijkstra | $O((n+m)\log n)$ |
| APSP | Floyd-Warshall | $O(n^3)$ |

¿Se puede resolver APSP con un algoritmo de SSSP? Sí: se invoca $n$ veces, una
por cada origen, y cada invocación llena una fila de $M$. El problema aparece
cuando el grafo es denso, porque ahí $m$ crece como $n^2$. Con
Bellman-Ford-Moore, las $n$ invocaciones cuestan
$O(n \cdot n \cdot m) = O(n^4)$; con Dijkstra,
$O(n \cdot n^2 \log n) = O(n^3 \log n)$. Floyd-Warshall resuelve el mismo
problema en $O(n^3)$, y en ese caso es el que conviene.

## Repaso: la búsqueda en amplitud

La amplitud resuelve SSSP en grafos sin peso o en grafos en los que todas las
aristas tienen el mismo peso, porque ahí el camino más corto es el de menos
aristas (CLRS, Sección 22.2). Todos los algoritmos de caminos más cortos del
curso dejan su respuesta en dos arreglos:

- `dist[v]`: el costo del camino más corto de $s$ a $v$;
- `pred[v]`: el vértice anterior a $v$ en ese camino, $-1$ para $s$ y para los
  que no se alcanzan.

### El código

El código de la amplitud que se usa en el curso está en
[bfs.py](./codigo/bfs.py). Ahí los dos arreglos se llaman `d` y `p`. La
primera versión, con un único origen:

```python
from collections import deque

# Implementación con un único origen s
def ssspBFS(G, s):
  q = deque()
  vis, d, p = [False for _ in range(len(G))], [float("inf") for _ in range(len(G))], [-1 for _ in range(len(G))]
  q.append(s)
  vis[s], d[s] = True, 0

  while len(q) > 0:
    v = q.popleft()
    for u in G[v]:
      if not vis[u]:
        q.append(u)
        vis[u] = True
        d[u] = d[v] + 1
        p[u] = v

  return d, p
```

El archivo trae dos variantes más. Una arranca con dos orígenes en la cola, y
`d[u]` termina siendo la distancia al más cercano de los dos. La otra quita el
arreglo `vis`: un vértice no descubierto tiene costo infinito, así que la
pregunta `d[u] == float("inf")` hace el mismo trabajo.

### Un ejemplo de ejecución

El grafo es dirigido y sin pesos, con vértices $0$ a $5$, fuente $5$ y estas
aristas: $0 \to 1$, $1 \to 0$, $0 \to 5$, $0 \to 3$, $5 \to 3$, $3 \to 0$,
$3 \to 2$, $2 \to 4$, $3 \to 4$, $4 \to 3$ y $4 \to 1$. Con las listas en
orden creciente, ¿en qué orden salen los vértices de la cola y qué queda en
`dist` y en `pred`?

| Sale | Descubre | Cola después |
|---|---|---|
| $5$ | $3$ | $[3]$ |
| $3$ | $0, 2, 4$ | $[0, 2, 4]$ |
| $0$ | $1$ ($3$ y $5$ ya se vieron) | $[2, 4, 1]$ |
| $2$ | nada ($4$ ya se vio) | $[4, 1]$ |
| $4$ | nada ($1$ y $3$ ya se vieron) | $[1]$ |
| $1$ | nada ($0$ ya se vio) | $[\,]$ |

| | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ |
|---|---|---|---|---|---|---|
| `dist` | $2$ | $3$ | $2$ | $1$ | $2$ | $0$ |
| `pred` | $3$ | $0$ | $3$ | $5$ | $3$ | $-1$ |

### Reconstruir el camino

Para llegar al nodo $1$ se sube por `pred` desde $1$: $\texttt{pred}[1] = 0$,
$\texttt{pred}[0] = 3$, $\texttt{pred}[3] = 5$ y $\texttt{pred}[5] = -1$.
Leído al revés, el camino más corto es $5, 3, 0, 1$, con
$\texttt{dist}[1] = 3$ aristas.

Las aristas $(\texttt{pred}[v], v)$, que son $5 \to 3$, $3 \to 0$, $3 \to 2$,
$3 \to 4$ y $0 \to 1$, forman un árbol con raíz en $5$. El camino del árbol
hasta cada vértice es un camino más corto (CLRS, Teorema 22.5).

### Cuando las aristas tienen pesos distintos

Tres vértices, fuente $0$, y las aristas $0 \to 2$ de peso $10$, $0 \to 1$ de
peso $1$ y $1 \to 2$ de peso $1$. La amplitud descubre $2$ desde $0$ en el
primer nivel y ahí lo deja: $\texttt{dist}[2]$ queda con el camino $0, 2$, que
cuesta $10$. El camino $0, 1, 2$ tiene una arista más y cuesta $2$. Con pesos
distintos hace falta poder corregir una distancia ya asignada.

## Ciclos en un camino más corto

### Un ciclo positivo nunca ayuda

El grafo tiene vértices $0$ a $5$, fuente $0$ y estas aristas con su peso:
$0 \to 1$ ($5$), $1 \to 3$ ($2$), $3 \to 1$ ($-1$), $3 \to 0$ ($-2$),
$0 \to 2$ ($4$), $2 \to 3$ ($1$), $2 \to 4$ ($6$), $3 \to 5$ ($8$),
$3 \to 4$ ($2$) y $4 \to 5$ ($1$).

El camino más corto de $0$ a $5$ es $0, 2, 3, 4, 5$, de costo $8$. Si antes de
seguir a $4$ se da la vuelta $0, 2, 3, 0$, de peso $4+1-2 = 3$, el camino
llega a $5$ con costo $11$.

| | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ |
|---|---|---|---|---|---|---|
| `dist` | $0$ | $4$ | $4$ | $5$ | $7$ | $8$ |

El argumento general: si un camino más corto pasara dos veces por el mismo
vértice, el tramo entre las dos visitas sería un ciclo. Con peso positivo,
quitarlo da un camino más barato, y el camino no era el más corto. Con peso
cero, quitarlo da otro camino del mismo costo.

Una arista negativa sola no causa problemas. Este grafo tiene dos y todas las
distancias son finitas. A $1$ se llega por $0, 2, 3, 1$, con costo
$4+1-1 = 4$, más barato que la arista directa de peso $5$. Los ciclos
$0, 2, 3, 0$ y $1, 3, 1$ pesan $3$ y $1$.

**Consecuencia.** Sin ciclos negativos siempre hay un camino más corto simple,
y un camino simple en un grafo de $n$ vértices tiene a lo sumo $n-1$ aristas.

### Un ciclo negativo

Dos vértices, fuente $0$, con $0 \to 1$ de peso $2$ y $1 \to 0$ de peso $-4$.
¿Cuál es el camino más corto de $0$ a $1$?

No existe. El ciclo $0, 1, 0$ pesa $2-4 = -2$: el camino $0, 1$ cuesta $2$, el
camino $0, 1, 0, 1$ cuesta $0$, el siguiente $-2$, y cada vuelta resta $2$
más. Siempre hay uno más barato. Cuando hay un ciclo negativo que se alcanza
desde el origen, el problema no está bien definido: no hay mínimo para los
vértices a los que se llega pasando por el ciclo (CLRS, Capítulo 24, pesos
negativos).

### Un ciclo negativo dentro de un grafo

Vértices $0$ a $5$, fuente $0$, con las aristas $0 \to 1$ ($5$), $0 \to 3$
($2$), $1 \to 3$ ($1$), $3 \to 1$ ($-2$), $0 \to 2$ ($4$), $2 \to 3$ ($1$),
$2 \to 4$ ($6$), $3 \to 5$ ($8$), $3 \to 4$ ($2$) y $4 \to 5$ ($1$).

El ciclo $1, 3, 1$ pesa $1-2 = -1$ y se alcanza desde $0$. A $1$, $3$, $4$ y
$5$ se llega pasando por él, y ninguno tiene camino más corto. El arreglo
`dist` que pide la salida del problema no está definido.

### Un ciclo negativo al que no se llega

Vértices $1$ a $6$, con las aristas $1 \to 2$ ($-5$), $2 \to 4$ ($2$),
$2 \to 3$ ($2$), $4 \to 3$ ($3$), $3 \to 1$ ($1$), $1 \to 5$ ($4$) y
$5 \to 6$ ($8$). El ciclo $1, 2, 3, 1$ pesa $-5+2+1 = -2$. Con origen en $5$,
¿está definido el problema?

Sí. Desde $5$ solo se llega a $6$: $\texttt{dist}[5] = 0$,
$\texttt{dist}[6] = 8$ y los demás quedan en $\infty$. Un ciclo negativo solo
daña el problema si se alcanza desde el origen.

## Caminos de a lo sumo $k$ aristas

En lugar de buscar de una vez el camino más corto, se calculan los caminos más
cortos que usan:

- a lo sumo $0$ aristas: solo el origen, con costo $0$;
- a lo sumo $1$ arista;
- a lo sumo $2$ aristas, y así hasta a lo sumo $n-1$ aristas.

**Por qué alcanza con $n-1$.** Sin ciclos negativos alcanzables, el camino más
corto es simple y tiene a lo sumo $n-1$ aristas. Los caminos de a lo sumo
$n-1$ aristas ya contienen la respuesta.

**Cómo se pasa de $k-1$ a $k$.** Un camino más corto de a lo sumo $k$ aristas
hasta $v$ es el que ya se tenía con $k-1$, o uno de a lo sumo $k-1$ aristas
hasta algún $u$ seguido de la arista $(u, v)$. Se prueban todas las aristas y
se queda el más barato.

### El ejemplo

Seis vértices, origen $3$, y estas aristas con su peso:

| Arista | Peso | Arista | Peso | Arista | Peso |
|---|---|---|---|---|---|
| $0 \to 2$ | $3$ | $2 \to 1$ | $-2$ | $3 \to 4$ | $6$ |
| $0 \to 5$ | $3$ | $2 \to 3$ | $-5$ | $4 \to 1$ | $3$ |
| $1 \to 0$ | $2$ | $2 \to 4$ | $-3$ | $4 \to 5$ | $2$ |
| $1 \to 2$ | $4$ | $3 \to 1$ | $1$ | $5 \to 1$ | $-2$ |

Como hay seis vértices, los caminos más cortos tienen a lo sumo $5$ aristas.
La fila $k$ de la tabla guarda el costo del camino más corto de a lo sumo $k$
aristas hasta cada vértice; en negrilla, lo que cambió respecto a la fila
anterior.

| $k$ | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ |
|---|---|---|---|---|---|---|
| $0$ | $\infty$ | $\infty$ | $\infty$ | $0$ | $\infty$ | $\infty$ |
| $1$ | $\infty$ | **$1$** | $\infty$ | $0$ | **$6$** | $\infty$ |
| $2$ | **$3$** | $1$ | **$5$** | $0$ | $6$ | **$8$** |
| $3$ | $3$ | $1$ | $5$ | $0$ | **$2$** | **$6$** |
| $4$ | $3$ | $1$ | $5$ | $0$ | $2$ | **$4$** |
| $5$ | $3$ | $1$ | $5$ | $0$ | $2$ | $4$ |

Y el arreglo `pred` después de cada fila:

| Después de $k$ | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ |
|---|---|---|---|---|---|---|
| $0$ | $-1$ | $-1$ | $-1$ | $-1$ | $-1$ | $-1$ |
| $1$ | $-1$ | $3$ | $-1$ | $-1$ | $3$ | $-1$ |
| $2$ | $1$ | $3$ | $1$ | $-1$ | $3$ | $4$ |
| $3$ | $1$ | $3$ | $1$ | $-1$ | $2$ | $0$ |
| $4$ y $5$ | $1$ | $3$ | $1$ | $-1$ | $2$ | $4$ |

Fila por fila:

- **$0$ aristas.** Solo se llega a $3$, con costo $0$.
- **$1$ arista.** Las aristas que salen de $3$: a $1$ con costo $1$ y a $4$
  con costo $6$.
- **$2$ aristas.** Se extienden los caminos que llegan a $1$ y a $4$:
  $1+2 = 3$ a $0$, $1+4 = 5$ a $2$ y $6+2 = 8$ a $5$. La arista $4 \to 1$
  daría $6+3 = 9$, peor que $1$.
- **$3$ aristas.** $2 \to 4$ da $5-3 = 2$, mejor que $6$, y $0 \to 5$ da
  $3+3 = 6$, mejor que $8$. La arista $2 \to 3$ da $5-5 = 0$ y no mejora a
  $3$.
- **$4$ aristas.** $4 \to 5$ da $2+2 = 4$, mejor que $6$.
- **$5$ aristas.** No mejora nada.

La fila de $5 = n-1$ aristas tiene los costos de los caminos más cortos. Hasta
$5$ se sube por `pred`: $4$, $2$, $1$, $3$. El camino es $3, 1, 2, 4, 5$, de
costo $1+4-3+2 = 4$, y usa cuatro aristas.

¿Qué pasaría si se calculara la fila de $6 = n$ aristas?

### Con $n$ aristas aparece el ciclo negativo

En el ejemplo no cambia nada. Un camino con $n$ aristas pasa por $n+1$
vértices y repite alguno, es decir, tiene un ciclo. Si con $n$ aristas aparece
un camino mejor, ese ciclo baja el costo, y es negativo.

Cuatro vértices, origen $0$, con las aristas $0 \to 1$ ($1$), $1 \to 2$
($3$), $2 \to 0$ ($-5$) y $2 \to 3$ ($2$):

| $k$ | $0$ | $1$ | $2$ | $3$ |
|---|---|---|---|---|
| $0$ | $0$ | $\infty$ | $\infty$ | $\infty$ |
| $1$ | $0$ | **$1$** | $\infty$ | $\infty$ |
| $2$ | $0$ | $1$ | **$4$** | $\infty$ |
| $3$ | **$-1$** | $1$ | $4$ | **$6$** |
| $4$ | $-1$ | **$0$** | $4$ | $6$ |

Con $n-1 = 3$ aristas, $\texttt{dist}[1] = 1$. Con $4$ aristas baja a $0$, por
el camino $0, 1, 2, 0, 1$: pasa dos veces por $1$, y en medio está el ciclo
$1, 2, 0, 1$, de peso $3-5+1 = -1$.

En resumen:

- Sin ciclos negativos alcanzables, la fila $n-1$ es la respuesta y la fila
  $n$ es igual.
- Si la fila $n$ mejora algún costo, hay un ciclo negativo alcanzable y el
  problema no está definido.

## Los caminos más cortos se componen de caminos más cortos

**Teorema (CLRS, Lema 24.1).** Sea $G = (V,E)$ un grafo dirigido con una
función de peso $w: E \to \mathbb{R}$ y sea
$p = \langle v_0, v_1, \ldots, v_k \rangle$ un camino más corto de $v_0$ a
$v_k$. Entonces, para todo $0 \leq i \leq j \leq k$, el subcamino
$p_{ij} = \langle v_i, v_{i+1}, \ldots, v_j \rangle$ es un camino más corto de
$v_i$ a $v_j$.

En el ejemplo de seis vértices, el camino más corto a $5$ es
$3, 1, 2, 4, 5$. Su tramo $3, 1, 2$ cuesta $5 = \texttt{dist}[2]$ y su tramo
$3, 1, 2, 4$ cuesta $2 = \texttt{dist}[4]$: los dos son caminos más cortos.

Las tablas usan el teorema todo el tiempo. El paso de $k-1$ a $k$ aristas toma
un camino más corto que ya se tenía y le agrega una arista, y cada `pred`
apunta a un vértice cuyo camino ya estaba en la fila anterior.

La demostración queda como ejercicio sugerido, en cuatro partes: teorema,
estrategia, desarrollo y conclusión. Los ejercicios sugeridos del segundo
corte pueden ser bonos en el parcial, y quien intente la demostración puede
enviarla para recibir correcciones.

## Relajación y la idea del algoritmo

### Relajar una arista

Relajar la arista $(u, v)$ es preguntar si llegar a $v$ pasando por $u$ es más
barato que lo que se tiene: si $d[v] > d[u] + w(u,v)$, se cambia $d[v]$ por
$d[u] + w(u,v)$ y $\texttt{pred}[v]$ por $u$ (CLRS, Capítulo 24).

Con $d[u] = 5$ y $w(u,v) = 4$:

- si $d[v] = 8$, $5 + 4 = 9 > 8$ y nada cambia;
- si $d[v] = 11$, $5 + 4 = 9 < 11$ y $d[v]$ pasa a $9$.

En las tablas del ejemplo, al pasar de $2$ a $3$ aristas, relajar $2 \to 4$
con $d[2] = 5$ bajó $d[4]$ de $6$ a $5-3 = 2$. Esa es la corrección que la
amplitud no hacía.

### Bellman-Ford-Moore (CLRS, Sección 24.1)

1. Al comienzo $d[s] = 0$ y $d[v] = \infty$ para los demás; `pred` queda en
   $-1$.
2. Se hacen $n-1$ rondas. En cada ronda se relajan todas las aristas del
   grafo.
3. Se hace una ronda más, la $n$, solo para revisar: si al relajar alguna
   arista $d$ cambia, el grafo tiene un ciclo negativo alcanzable desde $s$.

Después de la ronda $k$, $d[v]$ es a lo sumo el costo del camino más corto de
a lo sumo $k$ aristas hasta $v$. Puede ser menor, porque dentro de una misma
ronda una arista ya usa los valores que otra acaba de mejorar.

Cada ronda revisa las $m$ aristas y hay $n$ rondas: $O(n \cdot m)$, la cifra de
la tabla de algoritmos.

## Errores comunes

- Hacer $n-2$ rondas: un camino más corto de $n-1$ aristas puede quedar sin
  terminar, y la revisión lo toma por un ciclo negativo.
- Leer `dist` cuando la ronda $n$ cambió algo: esos números no son costos de
  caminos más cortos.
- Usar la amplitud con pesos distintos: minimiza el número de aristas, no el
  costo.

## Avisos

- El parcial pasa al **sábado 31 de octubre**.
- Los ejercicios sugeridos del segundo corte pueden ser bonos en el parcial,
  como la demostración del teorema de esta sesión. Quien intente uno puede
  enviarlo para recibir correcciones.

## Ejercicios

Los interactivos están en la [página de ejercicios](../../../actividades/ayg-puj/caminos-minimos-generalidades/index.md). Estos
son los de las diapositivas:

1. **La amplitud a mano.** Sea $A$ el grafo no dirigido con
   $V = \{0,\ldots,6\}$ y aristas $\{0,3\}$, $\{0,4\}$, $\{3,1\}$, $\{4,1\}$,
   $\{4,5\}$, $\{1,6\}$, $\{5,6\}$, $\{5,2\}$, con las listas en orden
   creciente. Ejecute la amplitud desde $0$: escriba el orden en que salen de
   la cola, `dist` y `pred` de cada vértice, y reconstruya el camino a $6$ y el
   camino a $2$.
2. **Pesos enteros con la amplitud.** En un grafo dirigido con pesos enteros
   positivos, cada arista $(u,v)$ de peso $w$ se cambia por un camino de $w$
   aristas sin peso a través de $w-1$ vértices nuevos. Muestre que la amplitud
   sobre el grafo nuevo da los costos del grafo original y diga cuánto cuesta
   en función de $n$, $m$ y el peso máximo $W$. ¿Cuándo no conviene?
3. **Un ciclo de peso cero.** En el grafo del ejemplo de los caminos de a lo
   sumo $k$ aristas, con origen $3$, encuentre un ciclo de peso $0$ que pase
   por $3$. Escriba un camino de $3$ a $2$ que use ese ciclo y otro que no lo
   use, con el mismo costo. ¿Por qué basta buscar entre los caminos simples?
4. **A lo sumo $k$ aristas a mano.** Sea $B$ el grafo dirigido con
   $V = \{0,\ldots,4\}$, origen $0$ y aristas $(0,4)$ de peso $6$, $(0,3)$ de
   peso $4$, $(0,2)$ de peso $7$, $(1,4)$ de peso $5$, $(2,1)$ de peso $-1$,
   $(3,2)$ de peso $2$ y $(4,3)$ de peso $-3$. Llene la tabla de los costos de
   los caminos más cortos de a lo sumo $k$ aristas, para $k = 0, \ldots, 5$,
   con el arreglo `pred` de cada fila, y dibuje el árbol de cada fila.
5. **Detectar el ciclo negativo.** Sea $C$ el grafo dirigido con
   $V = \{0,\ldots,5\}$, origen $0$ y aristas $(0,1)$ de peso $2$, $(1,2)$ de
   peso $1$, $(2,3)$ de peso $-4$, $(3,1)$ de peso $2$, $(3,4)$ de peso $3$ y
   $(5,4)$ de peso $1$. Llene la tabla de los caminos de a lo sumo $k$ aristas
   para $k = 0, \ldots, 6$. Diga qué costo mejora en la fila $6$, recupere el
   ciclo negativo subiendo por `pred` y diga qué pasa con el vértice $5$.
6. **Ejercicio sugerido: el teorema.** Demuestre que los caminos más cortos se
   componen de caminos más cortos (CLRS, Lema 24.1), en cuatro partes:
   teorema, estrategia, desarrollo y conclusión.
7. **Una ronda contra una fila.** En el grafo $B$, parta de
   $d = (0, \infty, \infty, \infty, \infty)$ y relaje todas las aristas una
   sola vez, en el orden en que aparecen en el ejercicio 4, usando cada vez los
   valores que ya cambiaron. Compare el resultado con la fila de a lo sumo $1$
   arista. ¿Con qué fila coincide, y por qué una ronda puede ir más adelante
   que la fila del mismo número?

### Pistas

1. Salen $0, 3, 4, 1, 5, 6, 2$. El vértice $2$ queda a tres aristas de $0$.
2. El grafo nuevo tiene hasta $n + m(W-1)$ vértices. Compare ese tamaño con
   $n \cdot m$.
3. Mire las aristas $1 \to 2$, $2 \to 3$ y $3 \to 1$.
4. La fila de $5$ aristas es $(0, 4, 5, 3, 6)$. El camino más corto a $1$ es
   $0, 4, 3, 2, 1$ y necesita las cuatro aristas.
5. En la fila $6$, $\texttt{dist}[3]$ baja de $-1$ a $-2$. Al vértice $5$ no
   se llega desde $0$.
6. Por contradicción: si un tramo tuviera un camino más barato, se cambia ese
   tramo y el camino completo baja.
7. Una ronda deja $(0, 6, 6, 3, 6)$.

## Lo que sigue

Las implementaciones de Bellman-Ford-Moore, de la que más gasta a la que menos:

- una matriz con una fila por cada $k$;
- un solo arreglo de distancias;
- la que se detiene cuando una ronda no cambia nada;
- la que usa una cola, que es la variante de Moore.

Para investigar en CLRS, Sección 24.1: ¿cuánto espacio pide la matriz y cómo
se baja a un solo arreglo?

Después vienen los grafos de estado: problemas en los que el grafo que se
recorre no es el del enunciado, sino uno cuyos vértices son estados. Las dos
cosas están en [Bellman-Ford-Moore](../C13/Bellman-Ford-Moore.md).

## Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, 3.ª ed. MIT
  Press, 2009. Sección 22.2 y Teorema 22.5 (amplitud y caminos más cortos sin
  pesos); Capítulo 24, introducción: variantes del problema, Lema 24.1, pesos
  negativos, ciclos y relajación; Sección 24.1 (Bellman-Ford).
- Erickson, J. *Algorithms*. 2019. Capítulo 8, caminos más cortos: relajación y
  Bellman-Ford.
