# Grafos implícitos

**Viernes 18 de septiembre de 2026.**

Recorrer un grafo que nadie guardó. La cuadrícula del simio y el café es el
primer caso; después, dos problemas del estilo de la tarea con el método
completo.

## Diapositivas

[Grafos implícitos](clase07-implicitos.pdf){ target=_blank } — 55 láminas.

## Lo que cuestan los recorridos

**Teorema.** Recorrer un grafo $G = (V, E)$ en profundidad o en amplitud,
guardado como lista de adyacencia, cuesta $\Theta(V + E)$.

*Demostración.* Se procede contando por separado lo que aporta cada vértice y
lo que aporta cada arista. Cada vértice se marca una sola vez, porque antes de
entrar se pregunta por la marca: $\Theta(V)$ en total. Estando en $u$ se
recorre su lista de vecinos, de $\delta(u)$ entradas, y como $u$ se visita una
vez esa lista se recorre una vez; la suma sobre todos los vértices es
$\sum_u \delta(u)$, que vale $2|E|$ en el grafo no dirigido y $|E|$ en el
dirigido: $\Theta(E)$. Sumando, $\Theta(V+E)$. $\blacksquare$

Sobre matriz de adyacencia cuestan $\Theta(V^2)$, porque los vecinos de $u$
obligan a recorrer su fila completa; sobre lista de aristas,
$\Theta(V \cdot E)$.

## Un simio y una taza de café

Un laberinto de $R$ filas y $C$ columnas; cada celda es pared o es libre. El
simio se mueve a una celda libre contigua por paso: arriba, abajo, izquierda o
derecha. ¿Puede llegar al café? Y si puede, ¿en cuántos pasos como mínimo?

```
S..#....
.#.#.##.
.#...#..
.####.#.
......#C
```

**Definición (grafo implícito).** Un grafo cuyos vértices y aristas no están
guardados en ninguna estructura: hay una regla que dice qué es un vértice y
una regla que, dado un vértice, produce sus vecinos. El recorrido llama a esa
regla cada vez que necesita la lista de adyacencia de alguien.

En el laberinto los vértices son las celdas libres $(r, c)$; las aristas,
los pares de celdas libres contiguas, con $|r - r'| + |c - c'| = 1$; y los
vecinos de $(r, c)$ se obtienen sumando $(1,0)$, $(-1,0)$, $(0,1)$ y $(0,-1)$
y descartando lo que se sale del tablero o cae en pared.

No se construye porque no hace falta: la lista de adyacencia de un laberinto
de $500 \times 500$ tendría $250\,000$ listas y hasta un millón de entradas,
todas deducibles de una suma.

### La regla de los vecinos

```python
DR = [1, -1, 0, 0]
DC = [0, 0, 1, -1]

def es_libre(laberinto, r, c):
    # (r, c) existe y no es pared
    R = len(laberinto)
    C = len(laberinto[0])
    return r >= 0 and r < R and c >= 0 and c < C and laberinto[r][c] != "#"

def vecinos(laberinto, r, c):
    # Las celdas contiguas a (r, c) por las que se puede pasar
    res = []
    k = 0
    while k < 4:
        nr = r + DR[k]
        nc = c + DC[k]
        if es_libre(laberinto, nr, nc):
            res.append((nr, nc))
        k = k + 1
    return res
```

`DR[k]` y `DC[k]` son el $k$-ésimo movimiento. Escribirlos así evita cuatro
`if` y sirve igual para ocho direcciones o para los saltos de un caballo:
cambia la tabla, no el recorrido.

### ¿Puede llegar? Profundidad

```python
def dfs(laberinto, r, c, visitado):
    # Marca (r, c) y sigue por cada vecino que falte
    visitado[r][c] = True
    for celda in vecinos(laberinto, r, c):
        if not visitado[celda[0]][celda[1]]:
            dfs(laberinto, celda[0], celda[1], visitado)

def puede_llegar(laberinto, r0, c0, rf, cf):
    # True si hay camino de (r0, c0) a (rf, cf)
    R = len(laberinto)
    C = len(laberinto[0])
    visitado = []
    r = 0
    while r < R:
        visitado.append([False] * C)
        r = r + 1
    dfs(laberinto, r0, c0, visitado)
    return visitado[rf][cf]
```

Es el $DFSAux$ de siempre. Donde antes decía `G[u]` ahora dice
`vecinos(laberinto, r, c)`, y la marca es una matriz porque el vértice tiene
dos coordenadas.

### ¿En cuántos pasos? Amplitud

```python
from collections import deque

def distancias(laberinto, r0, c0):
    # d[r][c] = pasos minimos desde (r0, c0); -1 si no se llega
    R = len(laberinto)
    C = len(laberinto[0])
    d = []
    r = 0
    while r < R:
        d.append([-1] * C)
        r = r + 1
    d[r0][c0] = 0
    cola = deque()
    cola.append((r0, c0))
    while len(cola) > 0:
        actual = cola.popleft()
        r = actual[0]
        c = actual[1]
        for celda in vecinos(laberinto, r, c):
            if d[celda[0]][celda[1]] == -1:
                d[celda[0]][celda[1]] = d[r][c] + 1
                cola.append(celda)
    return d
```

Sobre el laberinto de arriba, `distancias(LABERINTO, 0, 0)` deja:

```
 0  1  2  #  8  9 10 11
 1  #  3  #  7  #  # 12
 2  #  4  5  6  # 14 13
 3  #  #  #  # 10  # 14
 4  5  6  7  8  9  # 15
```

El café queda a 15 pasos. El corredor de abajo llega hasta la celda marcada 10
y ahí se cierra: la amplitud lo explora igual y lo descarta sola. El
Teorema 22.5 vale aquí sin cambios: todas las aristas cuestan lo mismo y nada
del argumento dependía de que el grafo estuviera guardado.

### Lo que cuesta

El grafo tiene a lo sumo $R \cdot C$ vértices y cada uno a lo sumo cuatro
aristas, así que $E \leq 2 R C$ y el $\Theta(V+E)$ se convierte en
$\Theta(R \cdot C)$. Calcular los vecinos cuesta $\Theta(1)$ por celda.

Un laberinto de $500 \times 500$ con un corredor largo lleva la profundidad
recursiva a $250\,000$ llamadas anidadas, y Python se detiene mucho antes.
Sobre cuadrículas, la amplitud con cola o la profundidad con pila explícita
son las versiones que corren.

## Un ejercicio tipo tarea: Rumor

Codeforces 893C, <https://codeforces.com/problemset/problem/893/C>.

En una ciudad hay $n$ personajes; algunos pares son amigos. Sobornar al
personaje $i$ cuesta $c_i$ monedas y hace que empiece a contar un rumor;
quien lo oye se lo cuenta a todos sus amigos, gratis. ¿Cuál es el mínimo de
monedas para que todos conozcan el rumor?

**Entrada:** varios casos; cada uno con $n$ y $m$ ($1 \leq n \leq 2 \cdot 10^4$,
$0 \leq m \leq 4 \cdot 10^4$), la línea de costos y $m$ pares de amigos
numerados desde $1$. Termina con $n = m = 0$. **Salida:** una línea por caso.

**¿Entendimos el problema?** Primer caso de la muestra: $n = 5$, costos
$2, 5, 3, 4, 8$, amigos $(1,4)$ y $(4,5)$. Tres grupos que no se hablan:
$\{1,4,5\}$, $\{2\}$ y $\{3\}$. En cada uno basta sobornar al más barato:
$2 + 5 + 3 = 10$. Sobornar solo al $1$ deja el rumor encerrado en su grupo.

**El grafo.** Vértices, los personajes; aristas, las amistades. Quien lo oye se
lo cuenta a todos sus amigos es exactamente *el rumor llega a todo lo
alcanzable*: un soborno cubre un componente conexo completo. La pregunta es
entonces, por cada componente, su menor costo, y la suma de esos mínimos.

$OroMinimo(G, c)$:

1. Marcar todos los nodos como no visitados; hacer $total = 0$
2. Para cada nodo $u$ de $G$:
    1. Si $u$ no ha sido visitado: recorrer el componente de $u$ llevando el
       menor $c$, y hacer $total = total +$ ese menor
3. Devolver $total$

El paso 2 es el $DFS(G)$ completo con un acumulador dentro del recorrido.

```python
def minimo_del_componente(G, s, visitado, costo):
    # Recorre el componente de s con una pila y devuelve su menor costo
    menor = costo[s]
    visitado[s] = True
    pila = [s]
    while len(pila) > 0:
        u = pila.pop()
        if costo[u] < menor:
            menor = costo[u]
        for v in G[u]:
            if not visitado[v]:
                visitado[v] = True
                pila.append(v)
    return menor


def oro_minimo(n, costo, G):
    # Suma el minimo de cada componente; el ciclo externo los descubre
    visitado = [False] * n
    total = 0
    u = 0
    while u < n:
        if not visitado[u]:
            total = total + minimo_del_componente(G, u, visitado, costo)
        u = u + 1
    return total
```

Costo $\Theta(n + m)$. Con $n$ hasta $2 \cdot 10^4$ la recursión puede pasarse
del límite de Python; la pila explícita marca al apilar para que nadie entre
dos veces. El orden de visita cambia, el componente no.

## Un ejercicio con estado: Robot

Un robot patrulla una cuadrícula de $m \times n$ ($1 \leq m, n \leq 100$). Se
mueve a una celda contigua por paso. Algunas celdas tienen obstáculos: entrar
en una obliga a usar el turbo, y el robot no puede pasar por más de $k$
celdas con obstáculo seguidas ($0 \leq k \leq 100$). Hallar el mínimo de pasos
de $(1,1)$ a $(m,n)$, que son celdas libres, o $-1$.

**¿Entendimos el problema?** Con $m = 4$, $n = 6$, $k = 1$ y la cuadrícula

```
0 1 1 0 0 0
0 0 1 0 1 1
0 1 1 1 1 0
0 1 1 1 0 0
```

la respuesta es $10$: un camino que pisa el obstáculo de la fila 2 columna 3 y
el de la fila 2 columna 6, nunca dos seguidos. Con $k = 0$ no hay solución.

**El primer intento, y por qué falla.** Recorrer las celdas llevando la racha
de obstáculos y marcar la celda al llegar. A una celda con obstáculo se puede
llegar con racha $1, 2, \ldots, k$ según por dónde se vino; si se marca la
celda la primera vez, se descarta una llegada posterior con racha menor que
sí deja seguir. El vértice del grafo **no es la celda**.

**El grafo implícito de los estados.** Vértices, los estados $(r, c, t)$ con
$t$ la racha, $0 \leq t \leq k$. Aristas, de $(r,c,t)$ a $(r',c',t')$ cuando
las celdas son contiguas y $t' = t+1 \leq k$ si $(r',c')$ es obstáculo, o
$t' = 0$ si es libre. Arranque $(0,0,0)$; llegada $(m-1, n-1, 0)$. Todas las
aristas valen un paso: amplitud. Hay $m \cdot n \cdot (k+1)$ estados con a lo
sumo cuatro aristas cada uno: $\Theta(m \cdot n \cdot k)$.

```python
def tabla_vacia(m, n, k):
    # d[r][c][t] = -1 para todos los estados: ninguno visto todavia
    d = []
    r = 0
    while r < m:
        fila = []
        c = 0
        while c < n:
            fila.append([-1] * (k + 1))
            c = c + 1
        d.append(fila)
        r = r + 1
    return d


def vecinos_robot(m, n, k, a, r, c, t):
    # Los estados a los que se pasa desde (r, c, t) en un movimiento
    res = []
    i = 0
    while i < 4:
        nr = r + DR[i]
        nc = c + DC[i]
        if nr >= 0 and nr < m and nc >= 0 and nc < n:
            nt = 0
            if a[nr][nc] == 1:
                nt = t + 1
            if nt <= k:
                res.append((nr, nc, nt))
        i = i + 1
    return res


def movimientos_minimos(m, n, k, a):
    # BFS sobre los estados (r, c, t); -1 si (m-1, n-1) no se alcanza
    d = tabla_vacia(m, n, k)
    d[0][0][0] = 0
    cola = deque()
    cola.append((0, 0, 0))
    while len(cola) > 0:
        e = cola.popleft()
        for s in vecinos_robot(m, n, k, a, e[0], e[1], e[2]):
            if d[s[0]][s[1]][s[2]] == -1:
                d[s[0]][s[1]][s[2]] = d[e[0]][e[1]][e[2]] + 1
                cola.append(s)
    return d[m - 1][n - 1][0]
```

Comparado con el laberinto del simio, lo único que cambió es la regla de los
vecinos: `vecinos_robot` lleva la racha y descarta lo que pasa de $k$. El
recorrido es el mismo.

## Errores comunes

Al calcular los vecinos: salirse del tablero —la regla revisa $0 \leq r < R$ y
$0 \leq c < C$ antes de mirar la celda, y en Python un índice negativo no
falla, lee desde el final— y confundir fila con columna o la numeración desde
$1$ con la desde $0$.

Al recorrer: marcar la celda cuando el vértice es la celda más un estado;
usar profundidad recursiva sobre una cuadrícula grande; buscar la distancia
mínima con profundidad, que llega pero no por el camino corto; y olvidar el
ciclo externo cuando la pregunta es por todos los componentes.

## El código de la clase

- [laberinto.py](codigo/laberinto.py) — la regla de vecinos, profundidad y
  amplitud sobre el laberinto de la clase.
- [rumor.py](codigo/rumor.py) — el mínimo por componente.
- [robot.py](codigo/robot.py) — la amplitud sobre estados.

## Ejercicios

Cuatro interactivos, seis en papel y tres para el juez: están en la
[página de ejercicios](./Ejercicios.md).

## Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, 3.ª ed. MIT
  Press, 2009. Secciones 22.2 (pp. 594–602) y 22.3 (pp. 603–612).
- Halim, Halim, Effendy. *Competitive Programming 4*. Lulu, 2020. Sección 4.2
  y su tratamiento de las cuadrículas como grafos implícitos.
- Codeforces Round 449, problema 893C, *Rumor*.
  <https://codeforces.com/problemset/problem/893/C>
