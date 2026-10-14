# Caminos más cortos: BFS y Bellman-Ford-Moore · AyG C12

**Viernes 16 de octubre de 2026.**

La búsqueda en amplitud recorre un grafo por niveles y deja en cada vértice
cuántas aristas lo separan de la fuente. Si cada arista tiene un costo, como el
tiempo de un vuelo o el precio de un peaje, ¿sigue siendo cierto que el camino
con menos aristas es el más barato? Y si algunos costos son negativos, ¿existe
siempre un camino más barato? La sesión responde las dos preguntas con una sola
operación, la relajación, y con el algoritmo que la repite por rondas,
Bellman-Ford, hasta llegar a la variante de Moore, que solo relaja lo que puede
cambiar algo.

Al terminar la sesión se espera poder:

- Calcular con la búsqueda en amplitud la distancia en aristas desde una
  fuente y reconstruir el camino con $\pi$.
- Definir $w(p)$ y $\delta(u,v)$, y decidir cuándo $\delta(s,v)$ vale
  $\infty$ o $-\infty$.
- Aplicar la relajación y usar sus propiedades para justificar un algoritmo.
- Ejecutar a mano e implementar Bellman-Ford, con parada temprana y con
  detección de ciclos negativos, en $O(VE)$.
- Construir la variante de Moore a partir de la versión por rondas y seguirla
  en una tabla.

## Diapositivas

[clase12-caminos-cortos.pdf](./clase12-caminos-cortos.pdf){ target=_blank rel=noopener },
82 páginas. Los grafos van dibujados: el no dirigido de seis vértices de la
amplitud con $d/\pi$ debajo de cada vértice, y el dirigido de cinco vértices
de la sesión con sus pesos, el árbol de caminos más cortos resaltado en verde
y, al final, la arista $4 \to 2$ cambiada a peso $-4$.

## Recuento: la búsqueda en amplitud

El recorrido completo está en la nota de
[representaciones y recorridos](../C6/Representaciones%20y%20recorridos.md);
aquí van las piezas que se usan para hablar de caminos más cortos.

### Lo que deja la amplitud en cada vértice

$BFS(G,s)$, de la Sección 22.2 de CLRS, deja dos valores en cada vértice $v$:

- $v.d$: el número de aristas con que se llegó a $v$ desde $s$; $\infty$ si
  nunca se llegó.
- $v.\pi$: el vértice desde el que se descubrió $v$; $NIL$ para $s$ y para los
  que no se alcanzan.

El grafo de ejemplo es no dirigido, con seis vértices y las aristas $0$–$1$,
$0$–$2$, $1$–$3$, $2$–$3$, $2$–$4$, $3$–$5$ y $4$–$5$. Desde $0$, con las
listas en orden creciente, la cola saca $0,1,2,3,4,5$, en ese orden: primero
todo lo que está a una arista, luego lo que está a dos.

| Vértice | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| $d/\pi$ | $0/-$ | $1/0$ | $1/0$ | $2/1$ | $2/2$ | $3/3$ |

### El código

```python
def bfs(G, s):
    # d[v]: aristas de s a v; pi[v]: el anterior en el camino.
    n = len(G)
    d = [-1] * n
    pi = [-1] * n
    d[s] = 0
    cola = deque()
    cola.append(s)
    while len(cola) > 0:
        u = cola.popleft()
        for v in G[u]:
            if d[v] == -1:
                d[v] = d[u] + 1
                pi[v] = u
                cola.append(v)
    return (d, pi)
```

`d[v] == -1` hace las veces de $\infty$ y de color blanco a la vez. Cada
vértice entra a la cola una sola vez, así que el costo es $\Theta(V+E)$.

### El teorema y la reconstrucción del camino

**Teorema (Teorema 22.5 de CLRS).** Sea $G=(V,E)$ un grafo, dirigido o no, y
$s \in V$. Al terminar $BFS(G,s)$, $v.d = \delta(s,v)$ para todo $v \in V$,
donde $\delta(s,v)$ es el menor número de aristas de un camino de $s$ a $v$.
Además, para todo $v \neq s$ alcanzable, uno de los caminos más cortos de $s$ a
$v$ es un camino más corto de $s$ a $v.\pi$ seguido de la arista
$(v.\pi, v)$.

En el grafo anterior, $5.\pi = 3$, $3.\pi = 1$ y $1.\pi = 0$: el camino es
$0,1,3,5$, con $5.d = 3$ aristas. No hay uno de dos, porque $5$ no es vecino
de $1$ ni de $2$.

```python
def camino(pi, s, v):
    # Sube por pi desde v y voltea la lista; [] si no se llega.
    ruta = []
    x = v
    while x != -1:
        ruta.append(x)
        x = pi[x]
    ruta.reverse()
    if ruta[0] != s:
        ruta = []
    return ruta
```

Es $PRINT\text{-}PATH$ de CLRS sin recursión: sube por $\pi$ desde $v$ hasta
$NIL$ y voltea la lista. Si lo que queda arriba no es $s$, $v$ no era
alcanzable.

### ¿Y si las aristas tienen peso?

Un grafo dirigido de tres vértices: $0 \to 2$ con peso $10$, $0 \to 1$ con
peso $1$ y $1 \to 2$ con peso $1$. Se ejecuta la amplitud desde $0$ con la
lista de $0$ en el orden $2, 1$. ¿Qué camino a $2$ deja en $\pi$? ¿Es el más
barato?

La amplitud descubre $2$ desde $0$ en el primer nivel y ahí se queda:
$2.\pi = 0$ y el camino cuesta $10$. El camino $0,1,2$ tiene una arista más y
cuesta $2$. Con el otro orden de la lista pasa lo mismo.

Lo que falla es que la amplitud fija la distancia de un vértice la primera vez
que lo ve. Con pesos, un camino que se descubre después puede ser más barato:
hace falta poder *corregir* una distancia ya asignada.

## Caminos más cortos con pesos

### Peso de un camino y distancia

**Definición (CLRS, Capítulo 24).** Sea $G=(V,E)$ dirigido con una función de
peso $w: E \to \mathbb{R}$. El peso de un camino
$p = \langle v_0, v_1, \ldots, v_k \rangle$ es

$$
w(p) = \sum_{i=1}^{k} w(v_{i-1}, v_i).
$$

El peso del camino más corto de $u$ a $v$ es

$$
\delta(u,v) =
\begin{cases}
  \min\{\, w(p) : u \overset{p}{\leadsto} v \,\} & \text{si hay camino de } u \text{ a } v,\\
  \infty & \text{si no lo hay.}
\end{cases}
$$

Un camino más corto de $u$ a $v$ es cualquier $p$ con $w(p) = \delta(u,v)$.

El grafo de toda la sesión es dirigido, con cinco vértices, fuente $0$ y siete
aristas, en este orden de las listas:

| Arista | $(0,1)$ | $(0,2)$ | $(1,3)$ | $(2,1)$ | $(2,4)$ | $(3,4)$ | $(4,2)$ |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Peso | $4$ | $5$ | $3$ | $-2$ | $6$ | $2$ | $1$ |

De $0$ a $4$ hay tres caminos simples:

- $\langle 0,1,3,4 \rangle$: $4+3+2 = 9$, con tres aristas.
- $\langle 0,2,4 \rangle$: $5+6 = 11$, con dos aristas.
- $\langle 0,2,1,3,4 \rangle$: $5-2+3+2 = 8$, con cuatro.

$\delta(0,4) = 8$, y lo da el camino con más aristas.

### Pesos negativos y ciclos negativos

Otro grafo dirigido, con fuente $0$ y las aristas $4 \to 0$ de peso $2$,
$0 \to 1$ de peso $1$, $1 \to 2$ de peso $-3$, $2 \to 1$ de peso $1$ y
$2 \to 3$ de peso $2$.

- El ciclo $\langle 1,2,1 \rangle$ pesa $-3+1 = -2$. Cada vuelta baja el costo
  en $2$: no hay mínimo y $\delta(0,1) = \delta(0,2) = -\infty$.
- $3$ cuelga del ciclo, así que también $\delta(0,3) = -\infty$.
- A $4$ no se llega desde $0$: $\delta(0,4) = \infty$, aunque $4$ sí llegue a
  $0$.

CLRS lo dice en el Capítulo 24, en el apartado de pesos negativos: las aristas
negativas no son el problema. El problema es un ciclo de peso negativo
*alcanzable desde la fuente*. Si existe, cualquier vértice al que se llegue
pasando por él tiene $\delta(s,v) = -\infty$. Un ciclo negativo al que no se
llega desde $s$ no afecta ninguna distancia desde $s$.

En el grafo de la sesión la única arista negativa es $2 \to 1$, de peso $-2$,
y el único ciclo es $\langle 2,1,3,4,2 \rangle$, de peso $-2+3+2+1 = 4$. No
hay ciclo negativo y todas las distancias desde $0$ son finitas.

### Subestructura óptima

**Lema (Lema 24.1 de CLRS).** Sea $p = \langle v_0, v_1, \ldots, v_k \rangle$
un camino más corto de $v_0$ a $v_k$ y, para $0 \leq i \leq j \leq k$, sea
$p_{ij} = \langle v_i, \ldots, v_j \rangle$ el subcamino de $p$ entre $v_i$ y
$v_j$. Entonces $p_{ij}$ es un camino más corto de $v_i$ a $v_j$.

En el grafo de la sesión, $\langle 0,2,1,3,4 \rangle$ es más corto de $0$ a
$4$. Su tramo $\langle 2,1,3 \rangle$ pesa $1$, y no hay otro camino de $2$ a
$3$: es más corto. Su tramo $\langle 0,2,1 \rangle$ pesa $3$, menos que la
arista directa $0 \to 1$, de peso $4$.

*Demostración.* Se procede por contradicción.

*Desarrollo.* Se parte $p$ en tres tramos,
$v_0 \overset{p_{0i}}{\leadsto} v_i \overset{p_{ij}}{\leadsto} v_j \overset{p_{jk}}{\leadsto} v_k$,
así que $w(p) = w(p_{0i}) + w(p_{ij}) + w(p_{jk})$. Si existiera un camino
$p'_{ij}$ de $v_i$ a $v_j$ con $w(p'_{ij}) < w(p_{ij})$, el camino
$v_0 \overset{p_{0i}}{\leadsto} v_i \overset{p'_{ij}}{\leadsto} v_j \overset{p_{jk}}{\leadsto} v_k$
pesaría $w(p_{0i}) + w(p'_{ij}) + w(p_{jk}) < w(p)$, y $p$ no sería más corto.

*Conclusión.* Por lo tanto, se puede concluir que todo subcamino de un camino
más corto es un camino más corto entre sus extremos. $\blacksquare$

### Un camino más corto no tiene ciclos

Si un camino más corto repitiera un vértice, ¿qué peso podría tener el ciclo
entre las dos visitas? CLRS, en el Capítulo 24, separa tres casos:

- **Negativo**: entonces $\delta(s,v) = -\infty$ y no hay camino más corto.
- **Positivo**: quitarlo da un camino más barato, así que el camino no era más
  corto.
- **Cero**: quitarlo da otro camino con el mismo peso.

Sin ciclos negativos alcanzables siempre hay un camino más corto *simple*, con
a lo sumo $|V|-1$ aristas. En el grafo de la sesión,
$\langle 0,2,1,3,4,2,1,3,4 \rangle$ pesa $12$: le sobra una vuelta de peso
$4$.

### La representación con $\pi$

Como en la amplitud, cada vértice guarda su predecesor $v.\pi$. Al terminar,
el subgrafo $G_\pi$ de las aristas $(v.\pi, v)$ es un *árbol de caminos más
cortos* con raíz $s$: el camino del árbol de $s$ a $v$ es un camino más corto
en $G$ (CLRS, Capítulo 24, representación de los caminos).

¿Qué aristas forman el árbol en el grafo de la sesión? Cada vértice distinto
de $0$ tiene exactamente una arista que entra en él desde su $\pi$:

| Vértice | $0$ | $1$ | $2$ | $3$ | $4$ |
|---|:-:|:-:|:-:|:-:|:-:|
| $\delta/\pi$ | $0/-$ | $3/2$ | $5/0$ | $6/1$ | $8/3$ |

El árbol son las aristas $0 \to 2$, $2 \to 1$, $1 \to 3$ y $3 \to 4$. Desde
$4$ se sube a $3$, $1$, $2$ y $0$: el camino es $\langle 0,2,1,3,4 \rangle$, y
la misma función `camino` lo reconstruye.

## Relajación

### Inicializar y relajar

**CLRS, Capítulo 24, relajación.**

$INITIALIZE\text{-}SINGLE\text{-}SOURCE(G,s)$

1. para cada $v \in G.V$: $v.d = \infty$, $v.\pi = NIL$
2. $s.d = 0$

$RELAX(u,v,w)$

1. si $v.d > u.d + w(u,v)$
2. $\quad v.d = u.d + w(u,v)$
3. $\quad v.\pi = u$

$v.d$ es una *estimación*: el mejor camino de $s$ a $v$ conocido hasta ahora.
Relajar $(u,v)$ es preguntar si pasar por $u$ la mejora; es la corrección que
la amplitud no hacía.

```python
INF = float('inf')


def inicializar(n, s):
    # INITIALIZE-SINGLE-SOURCE: infinito salvo en la fuente.
    d = [INF] * n
    pi = [-1] * n
    d[s] = 0
    return (d, pi)


def relajar(u, v, w, d, pi):
    # RELAX; devuelve True si d[v] cambio.
    cambio = False
    if d[u] + w < d[v]:
        d[v] = d[u] + w
        pi[v] = u
        cambio = True
    return cambio
```

Hay una diferencia con CLRS: `relajar` devuelve si cambió `d[v]`. La parada
temprana y la variante de Moore usan ese valor.

### Relajar una arista

La Figura 24.3 de CLRS muestra los dos casos sobre una arista $(u,v)$ de peso
$2$, con $u.d = 5$.

| | $u.d$ | $v.d$ antes | $u.d + w(u,v)$ | $v.d$ después | $v.\pi$ |
|---|:-:|:-:|:-:|:-:|---|
| Mejora | $5$ | $9$ | $7$ | $7$ | pasa a ser $u$ |
| No cambia | $5$ | $6$ | $7$ | $6$ | se queda |

En el primer caso la arista mejora a $v$, porque $9 > 5+2$. En el segundo,
$v$ ya tenía algo mejor, $6 \leq 5+2$, y nada cambia.

### Las propiedades de la relajación

Todas las de la Sección 24.5 de CLRS suponen que $d$ y $\pi$ se inicializaron
con $INITIALIZE\text{-}SINGLE\text{-}SOURCE(G,s)$ y que después solo cambian
con $RELAX$, en cualquier orden y cualquier número de veces.

**Desigualdad triangular (Lema 24.10).** Para toda arista $(u,v)$:
$\delta(s,v) \leq \delta(s,u) + w(u,v)$.

En el grafo de la sesión, $\delta(0,4) = 8 \leq \delta(0,2) + w(2,4) = 5 + 6 = 11$.
La igualdad se da en las aristas del árbol:
$\delta(0,4) = \delta(0,3) + w(3,4) = 6 + 2$.

**Cota superior (Lema 24.11).** Siempre $v.d \geq \delta(s,v)$, y cuando $v.d$
alcanza $\delta(s,v)$ ya no cambia.

En la traza de Bellman-Ford, $3.d$ pasa por $\infty$, luego $7$, luego
$6 = \delta(0,3)$, y ahí se queda. Nunca baja de $6$.

**Ausencia de camino (Corolario 24.12).** Si no hay camino de $s$ a $v$,
siempre $v.d = \infty$.

En el grafo del ciclo negativo, $4.d$ se queda en $\infty$: ninguna arista
entra a $4$, y $RELAX$ solo baja $v.d$ a partir de un $u.d$ finito.

**Convergencia (Lema 24.14).** Si $s \leadsto u \to v$ es un camino más corto
y $u.d = \delta(s,u)$ antes de relajar $(u,v)$, después $v.d = \delta(s,v)$.

Cuando $1.d$ ya vale $3 = \delta(0,1)$, relajar $(1,3)$ deja
$3.d = 3 + 3 = 6 = \delta(0,3)$.

**Relajación de caminos (Lema 24.15).** Si
$p = \langle v_0, v_1, \ldots, v_k \rangle$ es un camino más corto de
$s = v_0$ a $v_k$ y se relajan sus aristas en el orden
$(v_0,v_1), (v_1,v_2), \ldots, (v_{k-1},v_k)$, aunque entre ellas se relajen
otras, al final $v_k.d = \delta(s,v_k)$.

Para $\langle 0,2,1,3,4 \rangle$ basta que $(0,2)$ se relaje antes que
$(2,1)$, esta antes que $(1,3)$ y esta antes que $(3,4)$. Las demás aristas
pueden relajarse en medio, cuantas veces sea.

Queda una pregunta: si no se conoce el camino más corto, ¿cómo garantizar que
sus aristas se relajen en orden? Ahí empieza Bellman-Ford.

## Bellman-Ford

### La idea: rondas completas

El camino más corto a $4$ tiene cuatro aristas. Si en cada ronda se relajan
*todas* las aristas del grafo, en la primera se relaja $(0,2)$, en la segunda
$(2,1)$, en la tercera $(1,3)$ y en la cuarta $(3,4)$: el orden del camino
queda garantizado sin conocerlo.

¿Cuántas rondas? Tantas como aristas tenga el camino más corto más largo. Sin
ciclos negativos hay uno simple, con a lo sumo $|V|-1$ aristas, así que
$|V|-1$ rondas alcanzan.

**$BELLMAN\text{-}FORD(G,w,s)$, CLRS Sección 24.1**

1. $INITIALIZE\text{-}SINGLE\text{-}SOURCE(G,s)$
2. para $i = 1$ hasta $|G.V| - 1$
3. $\quad$ para cada arista $(u,v) \in G.E$
4. $\quad\quad RELAX(u,v,w)$
5. para cada arista $(u,v) \in G.E$
6. $\quad$ si $v.d > u.d + w(u,v)$
7. $\quad\quad$ devolver $FALSE$
8. devolver $TRUE$

Las líneas 2 a 4 calculan las distancias; las líneas 5 a 7 buscan una arista
que todavía se pueda relajar.

### La versión ingenua

```python
def hay_arista_tensa(G, d):
    # Una arista tensa despues de las rondas delata un ciclo
    # negativo alcanzable desde la fuente.
    tensa = False
    for u in range(len(G)):
        for (v, w) in G[u]:
            if d[u] + w < d[v]:
                tensa = True
    return tensa
```

Una *arista tensa* es una arista $(u,v)$ con $v.d > u.d + w(u,v)$: relajarla
todavía cambia algo. La revisión se escribe aparte porque las tres versiones
la usan.

```python
def bellman_ford_ingenuo(G, s):
    # |V|-1 rondas completas, pase lo que pase.
    n = len(G)
    d, pi = inicializar(n, s)
    ronda = 1
    while ronda <= n - 1:
        for u in range(n):
            for (v, w) in G[u]:
                relajar(u, v, w, d, pi)
        ronda = ronda + 1
    sin_ciclo = not hay_arista_tensa(G, d)
    return (d, pi, sin_ciclo)
```

Inicializar cuesta $\Theta(V)$. Cada ronda recorre las listas completas,
$\Theta(V+E)$, y hay $|V|-1$ rondas. La revisión final es una ronda más. Total:
$\Theta(VE)$ cuando $E \geq V$, sin importar el grafo.

### Traza: ronda 1

Las aristas se relajan en el orden de las listas: $u = 0, 1, \ldots, 4$ y,
dentro de cada lista, en el orden en que aparecen. En negrilla, lo que cambia.

| Arista, peso | $0$ | $1$ | $2$ | $3$ | $4$ | ¿Cambia? |
|---|:-:|:-:|:-:|:-:|:-:|---|
| inicio | $0$ | $\infty$ | $\infty$ | $\infty$ | $\infty$ | |
| $(0,1)$, $4$ | $0$ | $\mathbf{4}$ | $\infty$ | $\infty$ | $\infty$ | sí, $1.\pi = 0$ |
| $(0,2)$, $5$ | $0$ | $4$ | $\mathbf{5}$ | $\infty$ | $\infty$ | sí, $2.\pi = 0$ |
| $(1,3)$, $3$ | $0$ | $4$ | $5$ | $\mathbf{7}$ | $\infty$ | sí, $3.\pi = 1$ |
| $(2,1)$, $-2$ | $0$ | $\mathbf{3}$ | $5$ | $7$ | $\infty$ | sí, $1.\pi = 2$ |
| $(2,4)$, $6$ | $0$ | $3$ | $5$ | $7$ | $\mathbf{11}$ | sí, $4.\pi = 2$ |
| $(3,4)$, $2$ | $0$ | $3$ | $5$ | $7$ | $\mathbf{9}$ | sí, $4.\pi = 3$ |
| $(4,2)$, $1$ | $0$ | $3$ | $5$ | $7$ | $9$ | no: $5 \leq 9+1$ |

### Traza: rondas 2 a 4

En la ronda 1, $3.d$ quedó en $7$ porque $(1,3)$ se relajó cuando $1.d$
todavía valía $4$. ¿Qué arista lo arregla en la ronda 2, y qué arrastra ese
cambio?

| Ronda 2 | $0$ | $1$ | $2$ | $3$ | $4$ | ¿Cambia? |
|---|:-:|:-:|:-:|:-:|:-:|---|
| $(0,1)$, $4$ | $0$ | $3$ | $5$ | $7$ | $9$ | no |
| $(0,2)$, $5$ | $0$ | $3$ | $5$ | $7$ | $9$ | no |
| $(1,3)$, $3$ | $0$ | $3$ | $5$ | $\mathbf{6}$ | $9$ | sí: $7 > 3+3$ |
| $(2,1)$, $-2$ | $0$ | $3$ | $5$ | $6$ | $9$ | no |
| $(2,4)$, $6$ | $0$ | $3$ | $5$ | $6$ | $9$ | no |
| $(3,4)$, $2$ | $0$ | $3$ | $5$ | $6$ | $\mathbf{8}$ | sí: $9 > 6+2$ |
| $(4,2)$, $1$ | $0$ | $3$ | $5$ | $6$ | $8$ | no |

En las rondas 3 y 4 ninguna arista cambia nada: $d = (0,3,5,6,8)$ y
$\pi = (NIL, 2, 0, 1, 3)$, que son las $\delta$ y el árbol de la sección
anterior. La revisión final no encuentra aristas tensas y la función devuelve
`True`.

La versión ingenua examinó $4 \times 7 = 28$ aristas en las rondas, más $7$ en
la revisión. Las rondas 3 y 4 no cambiaron nada: $14$ exámenes perdidos.

Las propiedades se ven en la traza. $1.d = 3$ se fijó en la ronda 1, por
convergencia desde $2$. $(1,3)$ se relajó con ese valor en la ronda 2 y
$(3,4)$ después, en la misma ronda: el camino $\langle 0,2,1,3,4 \rangle$ se
relajó en orden y $4.d = 8$. Dos rondas bastaron porque el orden de las listas
ayudó en la primera.

### Por qué $|V|-1$ rondas bastan

**Lema (Lema 24.2 de CLRS).** Sea $G=(V,E)$ dirigido con pesos $w$ y fuente
$s$, sin ciclos de peso negativo alcanzables desde $s$. Después de las $|V|-1$
rondas de las líneas 2 a 4, $v.d = \delta(s,v)$ para todo $v$ alcanzable
desde $s$.

*Demostración.* Se procede de forma directa, con la propiedad de relajación de
caminos.

*Desarrollo.* Sea $v$ alcanzable. Como no hay ciclos negativos alcanzables,
existe un camino más corto simple $p = \langle v_0, v_1, \ldots, v_k \rangle$
con $v_0 = s$, $v_k = v$ y $k \leq |V|-1$. Cada ronda relaja todas las aristas,
así que la ronda $i$ relaja $(v_{i-1}, v_i)$ para $i = 1, \ldots, k$. Las
aristas de $p$ quedan relajadas en el orden del camino, con otras relajaciones
en medio.

*Conclusión.* Por lo tanto, por la propiedad de relajación de caminos, después
de la ronda $k \leq |V|-1$ se tiene $v.d = \delta(s,v)$, y por la cota
superior ya no cambia en las rondas que siguen. $\blacksquare$

### Correctitud de Bellman-Ford

**Teorema (Teorema 24.4 de CLRS).** Sea $BELLMAN\text{-}FORD$ ejecutado sobre
$G$ con pesos $w$ y fuente $s$. Si $G$ no tiene ciclos negativos alcanzables
desde $s$, devuelve $TRUE$, $v.d = \delta(s,v)$ para todo $v \in V$ y $G_\pi$
es un árbol de caminos más cortos con raíz $s$. Si $G$ tiene un ciclo negativo
alcanzable desde $s$, devuelve $FALSE$.

La primera parte cabe en una línea. Por el Lema 24.2 y la ausencia de camino,
al terminar las rondas $v.d = \delta(s,v)$ para todo $v$. Entonces, por la
desigualdad triangular,
$v.d = \delta(s,v) \leq \delta(s,u) + w(u,v) = u.d + w(u,v)$ en cada arista,
ninguna está tensa y se devuelve $TRUE$.

*Demostración de la segunda parte.* Se procede por contradicción: se supone
que hay un ciclo negativo $c = \langle v_0, v_1, \ldots, v_k \rangle$, con
$v_0 = v_k$, alcanzable desde $s$, y que el algoritmo devuelve $TRUE$.

*Desarrollo.* Si devuelve $TRUE$, ninguna arista de $c$ está tensa:
$v_i.d \leq v_{i-1}.d + w(v_{i-1}, v_i)$ para $i = 1, \ldots, k$. Sumando las
$k$ desigualdades,

$$
\sum_{i=1}^{k} v_i.d \leq \sum_{i=1}^{k} v_{i-1}.d + \sum_{i=1}^{k} w(v_{i-1}, v_i).
$$

Como $v_0 = v_k$, las dos sumas de $d$ recorren los mismos vértices y son
iguales; son finitas porque cada $v_i$ es alcanzable. Restando,
$0 \leq w(c)$.

*Conclusión.* Eso contradice $w(c) < 0$. Por lo tanto, se puede concluir que
con un ciclo negativo alcanzable alguna arista queda tensa y el algoritmo
devuelve $FALSE$. $\blacksquare$

### Parada temprana

En la traza, las rondas 3 y 4 no cambiaron nada. Si una ronda completa no
cambia ningún $d$, ¿puede cambiar algo la siguiente?

No. La ronda siguiente relaja las mismas aristas con los mismos $d$, y ninguna
estaba tensa. Lo mismo vale para todas las que vienen después, así que se
puede parar en ese momento.

```python
def bellman_ford(G, s):
    # Si una ronda no cambia nada, las siguientes tampoco.
    n = len(G)
    d, pi = inicializar(n, s)
    ronda = 1
    hubo_cambio = True
    while ronda <= n - 1 and hubo_cambio:
        hubo_cambio = False
        for u in range(n):
            for (v, w) in G[u]:
                if relajar(u, v, w, d, pi):
                    hubo_cambio = True
        ronda = ronda + 1
    sin_ciclo = not hay_arista_tensa(G, d)
    return (d, pi, sin_ciclo)
```

Lo que cambió es la bandera `hubo_cambio`, que entra en la condición del
`while`. En el grafo de la sesión se hacen tres rondas, la tercera sin
cambios: $21$ exámenes de arista en lugar de $28$. El peor caso sigue siendo
$|V|-1$ rondas y $\Theta(VE)$.

## La variante de Moore

### ¿Qué aristas valía la pena relajar?

En la ronda 2 cambiaron $3.d$ y $4.d$. ¿Qué tenían en común las aristas que
produjeron esos cambios?

$(1,3)$ salió de $1$, cuyo $d$ había cambiado después de la última vez que se
relajó $(1,3)$. $(3,4)$ salió de $3$, que acababa de cambiar. Las aristas de
$0$ y de $2$ se relajaron con los mismos $d$ que ya habían usado: no podían
dar nada nuevo.

De ahí sale la observación de Moore. Relajar $(u,v)$ solo puede cambiar $v.d$
si $u.d$ cambió desde la última vez que se relajó $(u,v)$. Basta con llevar la
cuenta de los vértices cuyo $d$ cambió y relajar solo las aristas que salen de
ellos.

### De las rondas a la cola, paso a paso

**Paso 1: una cola de pendientes.** En lugar de recorrer todos los $u$ en cada
ronda, se guardan en una cola los vértices cuyo $d$ cambió. Al principio solo
está $s$. Las rondas desaparecen: se saca un $u$ y se relajan sus aristas.

```python
cola = deque()
cola.append(s)
while len(cola) > 0:
    u = cola.popleft()
    for (v, w) in G[u]:
        if relajar(u, v, w, d, pi):
            cola.append(v)
```

**Paso 2: nada repetido en la cola.** Si $v$ ya está esperando, cuando salga
usará su $d$ más reciente: meterlo otra vez no aporta nada. Un arreglo
`en_cola` lo evita.

```python
        if relajar(u, v, w, d, pi) and not en_cola[v]:
            cola.append(v)
            en_cola[v] = True
```

**Paso 3: el ciclo negativo.** Sin el contador de rondas, un ciclo negativo
alcanzable hace que la cola nunca se vacíe: las distancias bajan sin fin. Se
cuenta en `veces[v]` cuántas veces entra cada vértice; si alguno llega a
$|V|$, hay ciclo negativo y se para.

```python
            veces[v] = veces[v] + 1
            if veces[v] >= n:
                sin_ciclo = False
```

### Bellman-Ford-Moore

```python
def bellman_ford_moore(G, s):
    # Solo se relajan las aristas de los vertices cuya d cambio.
    # veces[v]: cuantas veces ha entrado v a la cola.
    n = len(G)
    d, pi = inicializar(n, s)
    en_cola = [False] * n
    veces = [0] * n
    cola = deque()
    cola.append(s)
    en_cola[s] = True
    veces[s] = 1
    sin_ciclo = True
    while len(cola) > 0 and sin_ciclo:
        u = cola.popleft()
        en_cola[u] = False
        for (v, w) in G[u]:
            if relajar(u, v, w, d, pi) and not en_cola[v]:
                cola.append(v)
                en_cola[v] = True
                veces[v] = veces[v] + 1
                if veces[v] >= n:
                    sin_ciclo = False
    return (d, pi, sin_ciclo)
```

¿Por qué basta contar hasta $|V|$? Como la cola es FIFO, los vértices salen
por tandas: la tanda $0$ es $\{s\}$ y la tanda $k$ son los que entraron
mientras salía la tanda $k-1$. Lo que la tanda $k$ consigue es lo que
conseguía la ronda $k$ de Bellman-Ford, o algo mejor, y por `en_cola` un
vértice entra a lo sumo una vez por tanda. Sin ciclos negativos alcanzables, a
partir de la tanda $|V|-1$ ya no cambia nada, así que ningún vértice entra
$|V|$ veces. Con un ciclo negativo la cola no se vacía y alguno llega a $|V|$.

Cada vez que $u$ sale de la cola se recorre su lista, en
$O(1 + \text{grado}(u))$. Si cada vértice sale a lo sumo $|V|-1$ veces, el
total es $O(VE)$ en el peor caso, como Bellman-Ford. La ganancia está en que
solo se examinan las aristas que pueden cambiar algo.

### Traza de Moore

Cada fila es una salida de la cola. *Cambian* son los vértices cuyo $d$ bajó
al relajar las aristas del que salió; en negrilla, el valor nuevo.

| Sale | Cambian | $d_0$ | $d_1$ | $d_2$ | $d_3$ | $d_4$ | Cola | `veces` |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| | | $0$ | $\infty$ | $\infty$ | $\infty$ | $\infty$ | $0$ | $1,0,0,0,0$ |
| $0$ | $1, 2$ | $0$ | $\mathbf{4}$ | $\mathbf{5}$ | $\infty$ | $\infty$ | $1, 2$ | $1,1,1,0,0$ |
| $1$ | $3$ | $0$ | $4$ | $5$ | $\mathbf{7}$ | $\infty$ | $2, 3$ | $1,1,1,1,0$ |
| $2$ | $1, 4$ | $0$ | $\mathbf{3}$ | $5$ | $7$ | $\mathbf{11}$ | $3, 1, 4$ | $1,2,1,1,1$ |
| $3$ | $4$ | $0$ | $3$ | $5$ | $7$ | $\mathbf{9}$ | $1, 4$ | $1,2,1,1,1$ |
| $1$ | $3$ | $0$ | $3$ | $5$ | $\mathbf{6}$ | $9$ | $4, 3$ | $1,2,1,2,1$ |
| $4$ | | $0$ | $3$ | $5$ | $6$ | $9$ | $3$ | $1,2,1,2,1$ |
| $3$ | $4$ | $0$ | $3$ | $5$ | $6$ | $\mathbf{8}$ | $4$ | $1,2,1,2,2$ |
| $4$ | | $0$ | $3$ | $5$ | $6$ | $8$ | vacía | $1,2,1,2,2$ |

Cuando sale $3$ en la cuarta fila, $4.d$ baja de $11$ a $9$, pero $4$ no se
agrega a la cola. ¿Por qué?

Porque $4$ ya estaba esperando: entró cuando salió $2$. Cuando le toque salir
usará $4.d = 9$, el valor más reciente, así que no hace falta otra copia. Eso
es lo que evita `en_cola`.

Hubo ocho salidas de la cola y $2+1+2+1+1+1+1+1 = 10$ aristas examinadas. En
el mismo grafo, la versión ingenua examinó $28$ en las rondas y la de parada
temprana $21$. El resultado es el mismo: $d = (0,3,5,6,8)$ y
$\pi = (NIL,2,0,1,3)$. Son las cifras de este grafo; en el peor caso las tres
versiones cuestan $O(VE)$.

## Cuando hay un ciclo negativo

### Una sola arista cambiada

Se toma el mismo grafo con $w(4,2) = -4$. El ciclo
$\langle 2,1,3,4,2 \rangle$ pasa a pesar $-2+3+2-4 = -1$ y es alcanzable
desde $0$. Entonces
$\delta(0,1) = \delta(0,2) = \delta(0,3) = \delta(0,4) = -\infty$.

Las cuatro rondas de Bellman-Ford van a terminar igual, con números finitos en
$d$. ¿Cómo se entera el algoritmo de que esos números no sirven?

### Bellman-Ford con el ciclo

| Al final de | $d_0$ | $d_1$ | $d_2$ | $d_3$ | $d_4$ | $\pi_0$ | $\pi_1$ | $\pi_2$ | $\pi_3$ | $\pi_4$ |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| inicio | $0$ | $\infty$ | $\infty$ | $\infty$ | $\infty$ | $-$ | $-$ | $-$ | $-$ | $-$ |
| ronda 1 | $0$ | $3$ | $5$ | $7$ | $9$ | $-$ | $2$ | $0$ | $1$ | $3$ |
| ronda 2 | $0$ | $3$ | $\mathbf{4}$ | $\mathbf{6}$ | $\mathbf{8}$ | $-$ | $2$ | $\mathbf{4}$ | $1$ | $3$ |
| ronda 3 | $0$ | $\mathbf{2}$ | $4$ | $6$ | $8$ | $-$ | $2$ | $4$ | $1$ | $3$ |
| ronda 4 | $0$ | $2$ | $\mathbf{3}$ | $\mathbf{5}$ | $\mathbf{7}$ | $-$ | $2$ | $4$ | $1$ | $3$ |

La respuesta está en la revisión final. Con $d = (0,2,3,5,7)$, la arista
$(2,1)$ está tensa: $1.d = 2 > 2.d + w(2,1) = 3 - 2 = 1$. La función devuelve
`False`. Una quinta ronda bajaría algo más, porque cada vuelta al ciclo mejora
un poco.

El ciclo está en $\pi$. Desde $1$: $1.\pi = 2$, $2.\pi = 4$, $4.\pi = 3$,
$3.\pi = 1$. Subir por $\pi$ desde la arista tensa termina dando vueltas en el
ciclo.

### Moore con el ciclo

Las siete primeras salidas son las de la traza sin ciclo. Desde la octava,
cuando sale $4$ con $4.d = 8$, la arista $(4,2)$ ya baja a $2$.

| Sale | Cambia | $d_0$ | $d_1$ | $d_2$ | $d_3$ | $d_4$ | Cola | `veces` |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $4$ | $2$ | $0$ | $3$ | $\mathbf{4}$ | $6$ | $8$ | $2$ | $1,2,2,2,2$ |
| $2$ | $1$ | $0$ | $\mathbf{2}$ | $4$ | $6$ | $8$ | $1$ | $1,3,2,2,2$ |
| $1$ | $3$ | $0$ | $2$ | $4$ | $\mathbf{5}$ | $8$ | $3$ | $1,3,2,3,2$ |
| $3$ | $4$ | $0$ | $2$ | $4$ | $5$ | $\mathbf{7}$ | $4$ | $1,3,2,3,3$ |
| $4$ | $2$ | $0$ | $2$ | $\mathbf{3}$ | $5$ | $7$ | $2$ | $1,3,3,3,3$ |
| $2$ | $1$ | $0$ | $\mathbf{1}$ | $3$ | $5$ | $7$ | $1$ | $1,4,3,3,3$ |
| $1$ | $3$ | $0$ | $1$ | $3$ | $\mathbf{4}$ | $7$ | $3$ | $1,4,3,4,3$ |
| $3$ | $4$ | $0$ | $1$ | $3$ | $4$ | $\mathbf{6}$ | $4$ | $1,4,3,4,4$ |
| $4$ | $2$ | $0$ | $1$ | $\mathbf{2}$ | $4$ | $6$ | $2$ | $1,4,4,4,4$ |
| $2$ | $1$ | $0$ | $\mathbf{0}$ | $2$ | $4$ | $6$ | $1$ | $1,\mathbf{5},4,4,4$ |

La cola nunca se vacía: cada vuelta al ciclo baja $1$ en los cuatro vértices y
los vuelve a meter. En la salida $17$, $1$ entra por quinta vez;
`veces[1]` $= 5 = |V|$ y la función devuelve `False` sin esperar más. Sin
`veces`, el `while` con un ciclo negativo alcanzable no termina.

## Problemas de juez

- **UVa 336, A Node Too Far.**
  Enunciado: <https://onlinejudge.org/external/3/336.pdf>.
  Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=272>.
  Una red no dirigida de a lo sumo $30$ nodos con identificadores
  arbitrarios. Para cada consulta, un nodo inicial y un $TTL$: cuántos nodos
  *no* recibe un mensaje que avanza a lo sumo $TTL$ saltos. Es un camino más
  corto sin pesos: una amplitud desde el nodo inicial, y se cuentan los nodos
  con $d = -1$ o $d > TTL$. Los identificadores no son $0..n-1$, así que un
  diccionario les asigna un índice. La trampa: la numeración de los casos
  sigue de una red a la siguiente. Conviene prever también una consulta cuyo
  nodo no aparezca en ninguna conexión.
- **UVa 558, Wormholes.**
  Enunciado: <https://onlinejudge.org/external/5/558.pdf>.
  Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=499>.
  Hasta $1000$ sistemas y $2000$ agujeros de gusano dirigidos, cada uno con un
  salto en el tiempo $t$, con $-1000 \leq t \leq 1000$. Desde el sistema $0$
  se llega a todos. ¿Hay un ciclo que lleve indefinidamente al pasado? Un
  ciclo al pasado es un ciclo de peso negativo, y todos son alcanzables desde
  $0$. Se corre Bellman-Ford desde $0$ y la respuesta sale de la revisión
  final: si queda una arista tensa, se imprime `possible`. Con
  $V \cdot E = 2 \times 10^6$ alcanza la versión por rondas; la de Moore
  también sirve, con el contador `veces`. La trampa: no confundir *hay aristas
  negativas* con *hay ciclo negativo*.
- **UVa 11280, Flying to Fredericton.**
  Enunciado: <https://onlinejudge.org/external/112/11280.pdf>.
  Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2255>.
  Hasta $100$ ciudades y $1000$ vuelos con costo; puede haber varios entre
  las mismas dos ciudades. Para cada consulta, un máximo de escalas: el vuelo
  más barato de Calgary a Fredericton con a lo sumo esas escalas. $k$ escalas
  son a lo sumo $k+1$ vuelos, y la ronda $i$ de Bellman-Ford es la que alcanza
  los caminos de $i$ aristas: se hacen $k+1$ rondas y se lee $d$ de
  Fredericton. La trampa: dentro de una ronda, relajar con los $d$ que la
  misma ronda acaba de cambiar encadena dos vuelos en una sola ronda. Cada
  ronda tiene que leer de una copia de $d$ tomada al empezar. Los nombres de
  las ciudades se pasan a índices con un diccionario.

## Errores comunes

- **Usar la amplitud con pesos.** La amplitud minimiza el número de aristas,
  no el peso. Solo sirve cuando todas las aristas pesan lo mismo.
- **Una ronda de menos.** Con `ronda = 1` y `while ronda < n - 1` se hacen
  $|V|-2$ rondas. Un camino más corto de $|V|-1$ aristas que el orden de las
  listas recorre al revés queda sin terminar, y la revisión lo toma por un
  ciclo negativo.
- **Relajar desde un $\infty$.** En lenguajes con enteros, $\infty$ suele ser
  un número grande, y $\infty + w$ con $w < 0$ da un valor menor que $\infty$:
  un vértice no alcanzado termina con una distancia. Se relaja solo si $u.d$
  es finito. En Python, `float('inf')` ya cumple $\infty + w = \infty$.
- **Leer $d$ cuando hay un ciclo negativo.** Si la función devuelve `False`,
  los números de $d$ no son distancias. Hay que mirar primero el resultado de
  la revisión.
- **Moore sin `en_cola` o sin `veces`.** Sin `en_cola` la cola se llena de
  copias. Sin `veces`, un ciclo negativo deja el `while` corriendo para
  siempre.
- **Creer que un ciclo negativo lejano da $FALSE$.** Un ciclo negativo al que
  no se llega desde $s$ no cambia ninguna distancia desde $s$, y Bellman-Ford
  devuelve $TRUE$. Para detectar cualquier ciclo negativo del grafo se agrega
  un vértice nuevo con aristas de peso $0$ hacia todos y se corre desde él.

## El código de la clase

- [bfs_caminos.py](./codigo/bfs_caminos.py): `construir`, `bfs` y `camino`.
  Al correrlo imprime $d$ y $\pi$ del grafo de seis vértices y el camino de
  $0$ a $5$, y compara `bfs` contra las distancias por fuerza bruta sobre 300
  grafos aleatorios.
- [bellman_ford.py](./codigo/bellman_ford.py): `construir`, `inicializar`,
  `relajar`, `hay_arista_tensa`, `bellman_ford_ingenuo`, `bellman_ford`,
  `bellman_ford_moore`, `camino` y `contar_relajaciones`. Al correrlo imprime
  $d$ y $\pi$ del grafo de la sesión con las tres versiones, el camino de $0$
  a $4$, los exámenes de arista de cada versión ($28$ la ingenua, $21$ la de
  parada temprana en tres rondas y $10$ la de Moore), el `False` de las tres
  sobre el grafo con el ciclo, y la comparación de las tres contra los ciclos
  negativos y las distancias por fuerza bruta sobre 300 grafos aleatorios, 97
  de ellos con ciclo negativo.

## Ejercicios

Los interactivos y los de papel están en la
[página de ejercicios](./Ejercicios.md). Los ocho de las diapositivas pueden
aparecer en el parcial: la amplitud a mano sobre un grafo no dirigido de siete
vértices, con los caminos a $6$ y a $2$; la reducción de pesos enteros a la
amplitud con su costo en función de $V$, $E$ y $W$; Bellman-Ford a mano sobre
un grafo de cinco vértices cuyo camino más corto va contra el orden de las
listas; un orden de las aristas con el que una sola ronda basta; Moore a mano
sobre ese mismo grafo; un ciclo negativo recuperado subiendo por $\pi$; la
demostración en cuatro partes de que la parada temprana es correcta, y los
caminos más baratos con a lo sumo $k$ aristas, que es UVa 11280 en pequeño.

## Lo que sigue

Bellman-Ford hace rondas porque no sabe en qué orden relajar. En un grafo
dirigido acíclico ese orden existe y ya se sabe calcular: es el
[orden topológico](../C10/Orden%20topologico%20y%20Tarjan.md).

Para investigar:

- CLRS, Sección 24.2: si las aristas se relajan una sola vez, vértice por
  vértice en orden topológico, ¿por qué basta una pasada? ¿Qué propiedad de la
  Sección 24.5 lo garantiza, y cuánto cuesta?
- CLRS, Sección 24.3, el algoritmo de Dijkstra: si ningún peso es negativo,
  ¿qué vértice conviene sacar primero, y por qué una cola de prioridad
  reemplaza a la cola de Moore?

## Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, 3.ª ed. MIT
  Press, 2009. Sección 22.2, Teorema 22.5 (amplitud y caminos más cortos sin
  pesos); Capítulo 24, introducción, Lema 24.1 y relajación; Sección 24.1,
  Lema 24.2 y Teorema 24.4 (Bellman-Ford); Sección 24.5, Lemas 24.10, 24.11,
  24.14 y 24.15 y Corolario 24.12 (propiedades de la relajación).
- Moore, E. F. The shortest path through a maze. En *Proceedings of the
  International Symposium on the Theory of Switching*, Harvard University
  Press, 1959, pp. 285–292.
- Halim, Halim, Effendy. *Competitive Programming 4*. Lulu, 2020. Capítulo 4:
  caminos más cortos desde una fuente, Bellman-Ford y su variante con cola.
- Erickson, J. *Algorithms*. 2019. Capítulo 8, caminos más cortos: relajación
  y Bellman-Ford.
