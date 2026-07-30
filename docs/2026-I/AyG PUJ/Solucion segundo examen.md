# Codigos

[Codigos segundo examen](Codigos%20segundo%20examen.md)
# Solución — Segundo Parcial Árboles y Grafos 2026-1


## Pregunta 1 — Conceptos teóricos [12 pts.]

### Tipo 1, ítem (a) [6 pts.] — Tiempos de finalización entre SCC

**Enunciado.** Sea $G = (V, E)$ dirigido y $G^T$ su transpuesto. Sean
$C_1, C_2$ dos componentes fuertemente conexos distintos. Si existe una
arista $(u, v) \in E$ con $u \in C_1$ y $v \in C_2$, ¿es cierto que
$f(C_1) > f(C_2)$ al hacer DFS sobre $G$?

**Respuesta.** **Sí, es cierto.** Esta es la afirmación del **Lema 22.14
(CLRS)**, enunciado tal cual en la **Clase 16 — Componentes fuertemente
conexos** (sección "Teoremas clave", frame *Tiempos de finalización y
SCCs*), donde se define

$$f(C) \;=\; \max_{w \in C} f[w]$$

y se demuestra que si hay arista de $C$ a $C'$, entonces $f(C) > f(C')$.

**Demostración (idea).** Sean $x \in C_1$ con $f[x] = f(C_1)$ y
$y \in C_2$ con $f[y] = f(C_2)$. Hay dos casos para el orden de
descubrimiento:

1. **$d(C_1) < d(C_2)$.** Por el **teorema del camino blanco** (visto en
   la **Clase 13 — Propiedades BFS-DFS**), todos los vértices alcanzables
   por caminos blancos desde el primer vértice descubierto de $C_1$ se
   vuelven sus descendientes en el árbol DFS. Como existe la arista
   $C_1 \to C_2$ y $C_2$ es SCC, todo $C_2$ es alcanzable por caminos
   blancos. Por el **teorema del paréntesis**, los descendientes terminan
   antes que el ancestro, así que $f(C_1) > f(C_2)$.

2. **$d(C_2) < d(C_1)$.** El primer vértice descubierto de $C_2$ no puede
   alcanzar a $C_1$ por caminos blancos (no existe arista $C_2 \to C_1$;
   si existiera, $C_1$ y $C_2$ serían el mismo SCC). Entonces todo $C_2$
   termina antes de que se descubra $C_1$. En particular
   $f(C_2) < d(C_1) \leq f(C_1)$. $\blacksquare$

> **Por qué importa.** Es la base del **algoritmo de Kosaraju** (Clase 16,
> sección "Algoritmo de Kosaraju"): al procesar los vértices en orden
> decreciente de $f$ sobre $G^T$, el primer SCC en aparecer es la
> "fuente" del DAG de SCC.

### Tipo 2, ítem (a) [6 pts.] — Dijkstra con pesos negativos

**Enunciado.** ¿Por qué Dijkstra puede producir resultados incorrectos si
existe una arista $(u, v)$ con $w(u, v) < 0$?

**Respuesta.** Dijkstra (Clase 21) se apoya en una invariante
codiciosa: cuando un vértice $u$ se extrae de $Q$ con $d[u]$
mínimo, ese valor es ya la distancia definitiva. La justificación es que
extender un camino sólo agrega aristas, y como las aristas son no
negativas, agregar más nunca disminuye el costo.

Con una arista negativa esa invariante deja de valer: un vértice puede
extraerse con un valor que más tarde un camino con arista negativa logre
reducir.

**Contraejemplo mínimo.** Vértices $\{s, a, b\}$ y aristas
$s \to a$ con peso $1$, $s \to b$ con peso $2$, $a \to b$ con peso $-2$.

| Paso | Acción              | $d[s]$ | $d[a]$ | $d[b]$ | $Q$         |
|------|---------------------|--------|--------|--------|-------------|
| init |                     | 0      | $\infty$ | $\infty$ | $\{s, a, b\}$ |
| 1    | extract $s$         | 0      | 1      | 2      | $\{a, b\}$ |
| 2    | extract $a$ (relaja $b$ a $1+(-2)=-1$) | 0 | 1 | $-1$ | $\{b\}$ |
| 3    | extract $b$         | 0      | 1      | $-1$   | $\emptyset$ |

En este ejemplo Dijkstra "se salva" porque $b$ aún no había salido de $Q$
cuando se relajó. Pero si las aristas se ordenan distinto:
$s \to a$ con peso $5$, $s \to b$ con peso $2$, $a \to b$ con peso $-10$.
Dijkstra extrae $b$ primero (con $d[b] = 2$), lo marca definitivo, y
nunca aplica la relajación $1 \cdot 5 + (-10) = -5$ que vendría desde
$a$. La distancia correcta es $-5$, pero Dijkstra reporta $2$.

**Conclusión.** La precondición $w \geq 0$ no es accidental: con pesos
arbitrarios se debe usar **Bellman-Ford** (Clase 20).

> **Por qué importa.** Es exactamente la separación de algoritmos de la
> **Clase 19 — Introducción a caminos cortos**: pesos uniformes ⇒ BFS
> (Clase 11); pesos no negativos ⇒ Dijkstra (Clase 21); pesos
> arbitrarios sin ciclo negativo en el camino ⇒ Bellman-Ford (Clase 20);
> all-pairs ⇒ Floyd-Warshall (Clase 22).

### Ítem (b) [6 pts., ambos tipos] — Cuándo $(u, v)$ es puente en DFS no dirigido

**Enunciado.** Sea $G = (V, E)$ no dirigido. Sea $(u, v) \in E$ tal que
$u$ se descubrió antes que $v$ al hacer DFS. ¿Qué tendría que ocurrir
para concluir que $(u, v)$ es un puente?

**Respuesta.** En grafos no dirigidos las aristas del DFS son sólo
**tree edges** o **back edges** (Clase 13 — Propiedades BFS-DFS). Como
$u$ se descubrió antes que $v$ y $(u, v) \in E$, esa arista se recorre
como **tree edge** desde $u$ hacia el blanco $v$, así que $u$ es padre de
$v$ en $T$.

Para que $(u, v)$ sea **puente** (Clase 17 — Puentes y articulaciones,
frame *Puente (arista de corte)*) tiene que ocurrir que **al eliminarla
no quede otro camino entre $u$ y $v$**. En términos del DFS, ni $v$ ni
ninguno de sus descendientes pueden tener un back edge que llegue a $u$
o a un ancestro propio de $u$. Formalmente, usando la función $low$ de
Tarjan,

$$
\boxed{\;\;low[v] \;>\; d[u]\;\;}
$$

donde

$$
low[v] \;=\; \min\Big(d[v],\; \min\{d[w] : (x, w) \text{ back edge desde } x \text{ descendiente de } v\}\Big).
$$

**Justificación.**

- Si $low[v] \leq d[u]$, hay un back edge desde $T(v)$ a $u$ o a un
  ancestro propio de $u$. Esto cierra un ciclo que pasa por $(u, v)$;
  removerla deja un camino alterno, así que **no** es puente.
- Si $low[v] > d[u]$, ningún back edge "escapa" de $T(v) \cup \{u\}$.
  Removida la arista $(u, v)$, $T(v)$ queda desconectado del resto del
  grafo: **es** puente. $\blacksquare$

> **Por qué importa.** Es el criterio de Tarjan visto en la
> **Clase 17 — Puentes y articulaciones** (secciones de articulación y
> puente, y el frame *Clasificación de aristas en DFS (repaso)*). Se
> calcula en una sola pasada de DFS junto con $d[v]$, en $O(V + E)$.

---

## Sokoban [21 pts.]

**(Tipo 1: Pregunta 2 | Tipo 2: Pregunta 3)**

> **Implementación:** 
>
> **Diapositivas de referencia:** Clase 21 — *Grafos de estado*, junto
> con los dos ejemplos trabajados de esa clase (Super Mario y New
> Villa), que son exactamente el patrón "BFS/Dijkstra sobre grafo de
> estado implícito".



### (a) [2 pts.] — Por qué no aplica un algoritmo "directo"

Si modeláramos el grafo ingenuamente (nodos = casillas, aristas =
adyacencia ortogonal), BFS o Dijkstra resolverían "el guardián caminando
solo", ignorando el efecto de las cajas.

El problema real es distinto: las **cajas son móviles**, bloquean
caminos y para empujar una hay que tener al guardián en la casilla
opuesta a la dirección del empujón. La distancia mínima en el laberinto
fijo no corresponde con el número mínimo de empujones, ni siquiera con
la factibilidad del juego (un mismo laberinto admite o no admite ganar
según dónde estén las cajas).

La "configuración del juego" es más rica que la posición del guardián:
toca trabajar sobre el **grafo de estados implícito** (Clase 21,
*Grafos de estado*).

### (b) [9 pts.] — Estados y transiciones

**Estado.** Una dupla

$$s \;=\; \big(p_g,\;\, B\big),$$

con $p_g = (r, c)$ la posición del guardián y
$B = \{(r_1, c_1), \ldots, (r_k, c_k)\}$ las posiciones de las $k$ cajas.

**Lo que NO va en el estado.** Paredes ($\#$), casillas de meta
($.$, $*$, $+$) y dimensiones del tablero son fijas, no entran en el
estado: se consultan como información externa al evaluar transiciones.

**Transiciones.** Hasta 4 por estado, una por dirección
$d \in \{\uparrow, \downarrow, \leftarrow, \rightarrow\}$. Sea
$p' = p_g + d$ la casilla destino del guardián y $p'' = p' + d$ la
casilla detrás de ella.

| Caso | Condición | Acción | Costo |
|------|-----------|--------|-------|
| 1 | $p'$ es pared o está fuera del tablero | Inválida | — |
| 2 | $p'$ es casilla libre (sin caja) | $p_g \leftarrow p'$, $B$ no cambia | 0 (movimiento) |
| 3 | $p'$ contiene caja Y $p''$ es libre | $p_g \leftarrow p'$, la caja pasa de $p'$ a $p''$ | 1 (empujón) |
| 4 | $p'$ contiene caja Y $p''$ es pared u otra caja | Inválida | — |

```python
# Núcleo de la transición.
def transicion(estado, direccion, paredes):
    (gr, gc), cajas = estado
    dr, dc = direccion
    nr, nc = gr + dr, gc + dc

    cajas_set = set(cajas)
    nuevo = None
    costo = None

    if (nr, nc) in paredes:
        nuevo = None
    elif (nr, nc) in cajas_set:
        # Hay una caja: intentar empujarla
        nr2, nc2 = nr + dr, nc + dc
        if (nr2, nc2) not in paredes and (nr2, nc2) not in cajas_set:
            nuevas_cajas = list(cajas)
            j = 0
            while j < len(nuevas_cajas):
                if nuevas_cajas[j] == (nr, nc):
                    nuevas_cajas[j] = (nr2, nc2)
                j = j + 1
            nuevas_cajas.sort()
            nuevo = ((nr, nc), tuple(nuevas_cajas))
            costo = 1
    else:
        # Casilla libre: movimiento sin empujón
        nuevo = ((nr, nc), cajas)
        costo = 0

    return nuevo, costo
```

### (c) [2 pts.] — Estados inicial y finales

- **Inicial.** Lectura del mapa: $p_g$ es la única casilla con $@$ o $+$,
  y $B$ es el conjunto de casillas con $\$$ o $*$.
- **Final.** Cualquier estado $s = (p_g, B)$ tal que $B \subseteq M$, donde
  $M$ son las casillas de meta del mapa. La posición del guardián en el
  estado final es irrelevante; hay en general varios estados finales.

### (d) [6 pts.] — Ejemplo y porción del grafo de estados

Mapa $3 \times 5$ con una sola caja:

```
#####
#@$.#
#####
```

- Paredes en el borde.
- Guardián en $(1, 1)$.
- Caja en $(1, 2)$.
- Meta en $(1, 3)$.

Porción del grafo de estados (denotando $s = (p_g \mid B)$):

```
              s0 = ((1,1) | {(1,2)})              <-- INICIAL
                   |
                   | derecha (empujón, costo 1)
                   v
              s1 = ((1,2) | {(1,3)})              <-- FINAL
                   |
                   | izquierda (movimiento, costo 0)
                   v
              s2 = ((1,1) | {(1,3)})              <-- también final
```

Las transiciones $\uparrow, \downarrow, \leftarrow$ desde $s_0$ son
inválidas (paredes en arriba, abajo y a la izquierda de $(1,1)$). El
único camino útil es la flecha derecha: como $(1,2)$ contiene una caja y
$(1,3)$ es libre, se da un **empujón**.

Tableros más grandes dan grafos exponenciales en $k$ (número de cajas),
pero el patrón es el mismo: cada nodo es una configuración completa,
cada arista es la aplicación de una dirección.

### (e) [2 pts.] — Algoritmo apropiado

La medida que se minimiza es **empujones**, no movimientos. Hay dos
modelados naturales:

1. **Aristas con pesos $\{0, 1\}$** y **0–1 BFS** (deque: movimientos al
   frente, empujones al final). Equivale a Dijkstra (Clase 21)
   restringido a costos binarios. Es la versión que se entrega como
   solución.
2. **Contraer estados por "región alcanzable sin empujar"**: nodo es
   $(\text{región del guardián}, B)$ y todas las transiciones son
   empujones (costo 1) ⇒ **BFS** clásico. Es la versión clásica de
   *Sokoban* en *Competitive Programming 4* (Halim, Cap. 8).

Cualquiera de los dos da la respuesta óptima.

```python
# Bucle principal (0–1 BFS sobre el grafo de estados).
from collections import deque

def sokoban(mapa):
    paredes, metas, guardian, cajas = parsear_mapa(mapa)
    estado_inicial = (guardian, cajas)
    direcciones = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    INF = float('inf')
    dist = {estado_inicial: 0}
    cola = deque()
    cola.append(estado_inicial)

    respuesta = -1
    encontrado = False

    while len(cola) > 0 and not encontrado:
        estado = cola.popleft()
        d_actual = dist[estado]

        if es_final(estado[1], metas):
            respuesta = d_actual
            encontrado = True
        else:
            i = 0
            while i < len(direcciones):
                nuevo, costo = transicion(estado, direcciones[i], paredes)
                if nuevo is not None:
                    nd = d_actual + costo
                    if nd < dist.get(nuevo, INF):
                        dist[nuevo] = nd
                        if costo == 0:
                            cola.appendleft(nuevo)
                        else:
                            cola.append(nuevo)
                i = i + 1

    return respuesta
```

### Complejidad

Con $C$ casillas no-pared y $k$ cajas:

$$|V| \;\leq\; C \cdot \binom{C}{k},$$

cuatro sucesores por estado, así que $|E| \leq 4|V|$. La complejidad es
$O(|V| + |E|) = O(|V|)$. En la práctica se hashean los estados (tupla
ordenada de cajas + posición del guardián) para deduplicar.

---

## Pregunta sobre conectividad y caminos cortos [14 pts.]

A partir de aquí los dos tipos divergen: **Tipo 1** trae *Nameless*,
**Tipo 2** trae *Spring country*.

### Tipo 1 (Pregunta 3) — Nameless: mínimo número de aeropuertos

>
> **Diapositivas de referencia:** Clase 19 — *Introducción a caminos
> cortos* (separación BFS / Dijkstra / Bellman-Ford) y Clase 21 —
> *Dijkstra*, sección *Caso especial: 0-1 BFS* (deque y costos en
> $\{0, 1\}$).

**Especificación.**

- **Entrada:** $N$ ciudades; un conjunto $A$ con las $K$ ciudades que ya
  tienen aeropuerto; una lista $E$ de $M$ pares $(u, v)$ no ordenados
  con las parejas que pueden recibir vuelo si **ambas** tienen
  aeropuerto; una demanda $(x, y)$.
- **Salida:** mínimo número de aeropuertos **adicionales** que el rey
  debe instalar para que exista alguna ruta de vuelos $x \to y$.

**Modelado como grafo.** $G = (V, E)$ no dirigido con $V = \{0, \ldots, N{-}1\}$
y las aristas dadas. Cada vértice tiene costo

$$c(v) \;=\; \begin{cases} 0 & \text{si } v \in A, \\ 1 & \text{en otro caso.}\end{cases}$$

El costo de un camino $x = v_0, v_1, \ldots, v_t = y$ es
$\sum_{i=0}^{t} c(v_i)$. Se busca el camino de costo mínimo.

**Algoritmo: 0–1 BFS.** Como los pesos en los vértices son $\{0, 1\}$,
se trasladan a las aristas haciendo $w(u \to v) = c(v)$ y se ejecuta
0–1 BFS con `collections.deque`: cuando se relaja por una arista de
peso 0 se mete al frente, cuando es 1 se mete al final. Tiempo
$O(V + E) = O(N + M)$.

> **Por qué 0–1 BFS y no Dijkstra completo.** En la **Clase 21**
> (sección *Caso especial: 0-1 BFS*) se vio que con pesos en $\{0, 1\}$
> una deque basta y el costo cae a $O(V + E)$; usar Dijkstra con cola
> de prioridad sería correcto pero innecesariamente caro
> ($O((V+E)\log V)$).

```python
from collections import deque

def min_aeropuertos(N, tiene_aeropuerto, edges, x, y):
    adj = {}
    v = 0
    while v < N:
        adj[v] = []
        v = v + 1

    i = 0
    while i < len(edges):
        u, v = edges[i]
        adj[u].append(v)
        adj[v].append(u)
        i = i + 1

    INF = float('inf')
    d = [INF] * N

    cx = 0
    if x not in tiene_aeropuerto:
        cx = 1
    d[x] = cx

    cola = deque()
    cola.append(x)

    while len(cola) > 0:
        u = cola.popleft()
        for v in adj[u]:
            cv = 0
            if v not in tiene_aeropuerto:
                cv = 1
            if d[u] + cv < d[v]:
                d[v] = d[u] + cv
                if cv == 0:
                    cola.appendleft(v)
                else:
                    cola.append(v)

    return d[y]
```

### Tipo 2 (Pregunta 2) — Spring country: rutas con peajes

>
> **Diapositivas de referencia:** Clase 21 — *Dijkstra*, sección
> *Variaciones del modelo: pesos en vértices* (la reducción
> $w'(u \to v) = w(u, v) + t(v)$ y la excepción del destino se toman
> literal de allí). El estilo de EXTRACT-MIN lineal sobre un `set` y la
> estructura del bucle son los de la implementación vista en esa clase.

**Especificación.**

- **Entrada:** $N$ ciudades; matriz $w$ con $w(u, v) > 0$ si existe vía
  directa entre $u$ y $v$, ausente si no; peajes $t(v) \geq 0$ por
  ciudad; un par $(s, d)$ origen-destino del cargo.
- **Salida:** costo mínimo de un camino $s = v_0, \ldots, v_k = d$, donde

    $$\text{costo}(p) \;=\; \sum_{i=0}^{k-1} w(v_i, v_{i+1}) \;+\; \sum_{i=1}^{k-1} t(v_i).$$

    El peaje se cobra en cada ciudad **intermedia**; ni $s$ ni $d$ pagan.

**Reducción a Dijkstra estándar.** Construimos un grafo dirigido $G'$
con los mismos vértices y, por cada arista $(u, v)$ del original, dos
aristas dirigidas con pesos

$$w'(u \to v) \;=\; w(u, v) \;+\; t(v) \cdot \mathbb{1}[v \neq d].$$

Es decir, absorbemos el peaje de **llegada** en la arista, salvo si el
nodo de llegada es el destino. El origen $s$ no paga peaje porque al
ser inicio nunca aparece como nodo de llegada en el camino.

Sobre $G'$ los pesos son no negativos, así que Dijkstra desde $s$
resuelve el problema y la respuesta es $d'[d]$.

**Complejidad.** Igual a la versión del curso (Clase 21): $O(V^2 + E)$
con EXTRACT-MIN lineal; $O((V + E) \log V)$ si se usa cola de prioridad.

```python
def min_costo_spring(N, w, tax, src, dst):
    INF = float('inf')

    d = [INF] * N
    pi = [None] * N
    d[src] = 0
    Q = set(range(N))

    seguir = True
    while seguir:
        # EXTRACT-MIN por búsqueda lineal sobre Q (estilo Clase 21)
        u = None
        min_d = INF
        for v in Q:
            if d[v] < min_d:
                min_d = d[v]
                u = v

        if u is None:
            seguir = False
        else:
            Q.remove(u)
            v = 0
            while v < N:
                if w[u][v] is not None and v in Q:
                    extra = tax[v]
                    if v == dst:
                        extra = 0
                    nd = d[u] + w[u][v] + extra
                    if nd < d[v]:
                        d[v] = nd
                        pi[v] = u
                v = v + 1

    return d[dst]
```

---

## Pregunta 4 — Imperio de Zlatan en Cali [18 pts.]


>
> **Diapositivas de referencia:**
> - **SCC**: Clase 16 — *Componentes fuertemente conexos* (Kosaraju y
>   Tarjan).
> - **Bellman-Ford con detección de ciclo negativo**: Clase 20 —
>   *Bellman-Ford* (la detección por "una pasada extra" se toma literal
>   de allí).
> - **Dijkstra**: Clase 21 — *Dijkstra* (EXTRACT-MIN lineal sobre `set`).

### Especificación

**Entrada.** Grafo dirigido $G = (V, E)$ con $|V| = n$, $|E| = m$;
peso $w : E \to \mathbb{R}$ (puede ser negativo); valor
$\text{val} : V \to \mathbb{Z}_{>0}$; constante $z \geq 0$ para zonas
con ciclo negativo; vértices $s, t$.

**Salida.** Costo mínimo, en la representación contraída de la ciudad,
para desplazarse desde la zona que contiene a $s$ hasta la que contiene
a $t$.

### El algoritmo en cuatro fases

El problema combina **tres bloques** del curso, casi en el orden en que
se vieron en clase.

#### Fase 1 — Identificar las zonas (Clase 16)

Las "zonas donde Zlatan se desplaza libremente siguiendo las direcciones
de las rutas" son los **componentes fuertemente conexos** de $G$.
Calculamos la partición $\{C_1, \ldots, C_K\}$ con **Kosaraju** (dos
DFS, $O(V + E)$). El código sigue el patrón de la Clase 16, frame
*Kosaraju iterativa: evitar desborde de pila*: pila explícita con
iteradores `(v, iter(adj[v]))` para reproducir el post-orden sin
recursión.

#### Fase 2 — Representante y valor de cada zona (Clase 20)

Para cada SCC $C_j$:

1. **Representante $r_j$**: el vértice de $C_j$ que minimiza
   $\text{val}$; en empate, el de menor identificador.

   > **Nota sobre el enunciado.** El texto dice "selecciona el lugar con
   > el menor valor asociado", pero el ejemplo (representantes
   > $1, 5, 7, 8, 9$ con valores $20, 60, 80, 100, 35$) sugiere lo
   > contrario (mayor valor). Se implementa la regla del **enunciado**
   > (menor); cambiar a "mayor" es una sola línea: invertir la
   > comparación de tuplas en la implementación.

2. **Valor de la zona**: ejecutamos **Bellman-Ford** (estilo Clase 20)
   restringido al subgrafo de $C_j$ desde $r_j$:
   - Si la pasada de verificación detecta ciclo negativo,
     $\text{val}_{\text{zona}}(C_j) = z$.
   - En otro caso, $\text{val}_{\text{zona}}(C_j) = \sum_{v \in C_j} d[v]$.

   Es **necesario Bellman-Ford** y no Dijkstra: las aristas internas
   pueden ser negativas (precondición de Dijkstra violada — ver
   pregunta 1 Tipo 2).

#### Fase 3 — Grafo contraído

Construimos $H = (\mathcal{C}, F)$ no dirigido:

- Por cada $(u, v) \in E$ con $\text{scc}(u) \neq \text{scc}(v)$ se
  agrega arista no dirigida $(\text{scc}(u), \text{scc}(v))$ a $F$
  (sin duplicar).
- Peso: $\omega(C_i, C_j) = \text{val}_{\text{zona}}(C_i) + \text{val}_{\text{zona}}(C_j)$.

Como $\text{val}_{\text{zona}}(C) \geq 0$ siempre, los pesos de $H$ son
no negativos.

#### Fase 4 — Consulta con Dijkstra (Clase 21)

Dijkstra sobre $H$ desde $\text{scc}(s)$; la respuesta es la distancia
hasta $\text{scc}(t)$. Como los pesos son no negativos por
construcción, **aquí sí se puede** usar Dijkstra (a diferencia de la
fase 2).

### Complejidad

| Fase | Costo |
|------|-------|
| 1. Kosaraju (Clase 16) | $O(V + E)$ |
| 2. Bellman-Ford por SCC (Clase 20) | $O(\sum_j \lvert C_j \rvert \cdot \lvert E_j \rvert) = O(V \cdot E)$ peor caso |
| 3. Construcción de $H$ | $O(V + E)$ |
| 4. Dijkstra sobre $H$, EXTRACT-MIN lineal (Clase 21) | $O(K^2 + \lvert F \rvert)$ |

**Total:** $O(V \cdot E)$, dominada por los Bellman-Ford internos. El
peor caso ocurre cuando una sola SCC concentra casi todos los vértices
y aristas; en grafos con SCC pequeñas el costo es mucho menor.

### Implementación

```python
def kosaraju(n, adj, radj):
    """Devuelve (comp, K) con comp[v] = id de SCC. DFS iterativa."""
    orden = []
    visitado = [False] * n

    v = 0
    while v < n:
        if not visitado[v]:
            pila = [(v, iter(adj[v]))]
            visitado[v] = True
            while len(pila) > 0:
                top, it = pila[-1]
                siguiente = next(it, None)
                if siguiente is None:
                    orden.append(top)
                    pila.pop()
                else:
                    w_v = siguiente[0]
                    if not visitado[w_v]:
                        visitado[w_v] = True
                        pila.append((w_v, iter(adj[w_v])))
        v = v + 1

    comp = [-1] * n
    cid = 0
    i = len(orden) - 1
    while i >= 0:
        u = orden[i]
        if comp[u] == -1:
            pila = [u]
            comp[u] = cid
            while len(pila) > 0:
                x = pila.pop()
                for (y, _) in radj[x]:
                    if comp[y] == -1:
                        comp[y] = cid
                        pila.append(y)
            cid = cid + 1
        i = i - 1

    return comp, cid


def bellman_ford_subgrafo(vertices, sub_edges, src):
    """Bellman-Ford restringido al subgrafo de una SCC. Estilo Clase 20."""
    INF = float('inf')
    d = {v: INF for v in vertices}
    d[src] = 0

    i = 0
    while i < len(vertices) - 1:
        for (u, v, peso) in sub_edges:
            if d[u] + peso < d[v]:
                d[v] = d[u] + peso
        i = i + 1

    hay_ciclo = False
    for (u, v, peso) in sub_edges:
        if d[u] + peso < d[v]:
            hay_ciclo = True

    return d, hay_ciclo


def dijkstra_contraido(K, adj_H, valZ, src):
    """Dijkstra en el grafo contraído. Estilo Clase 21."""
    INF = float('inf')
    d = [INF] * K
    d[src] = 0
    Q = set(range(K))

    seguir = True
    while seguir:
        u = None
        min_d = INF
        for v in Q:
            if d[v] < min_d:
                min_d = d[v]
                u = v
        if u is None:
            seguir = False
        else:
            Q.remove(u)
            for v in adj_H[u]:
                if v in Q:
                    nd = d[u] + valZ[u] + valZ[v]
                    if nd < d[v]:
                        d[v] = nd

    return d


def zlatan(n, edges, val, z, s, t):
    # Adyacencias directa y transpuesta
    adj = {v: [] for v in range(n)}
    radj = {v: [] for v in range(n)}
    for (u, v, peso) in edges:
        adj[u].append((v, peso))
        radj[v].append((u, peso))

    # Fase 1: SCC
    comp, K = kosaraju(n, adj, radj)
    componentes = {j: [] for j in range(K)}
    v = 0
    while v < n:
        componentes[comp[v]].append(v)
        v = v + 1

    # Fase 2: representante y valor de cada zona
    valZ = [0] * K
    j = 0
    while j < K:
        Cj = componentes[j]
        rep = Cj[0]
        for v in Cj:
            if (val[v], v) < (val[rep], rep):
                rep = v

        en_cj = set(Cj)
        sub_edges = []
        for u in Cj:
            for (v, peso) in adj[u]:
                if v in en_cj:
                    sub_edges.append((u, v, peso))

        d_int, hay_ciclo = bellman_ford_subgrafo(Cj, sub_edges, rep)
        if hay_ciclo:
            valZ[j] = z
        else:
            suma = 0
            for v in Cj:
                suma = suma + d_int[v]
            valZ[j] = suma
        j = j + 1

    # Fase 3: grafo contraído (no dirigido)
    adj_H = {j: set() for j in range(K)}
    for (u, v, _) in edges:
        cu, cv = comp[u], comp[v]
        if cu != cv:
            adj_H[cu].add(cv)
            adj_H[cv].add(cu)

    # Fase 4: Dijkstra
    src, dst = comp[s], comp[t]
    dH = dijkstra_contraido(K, adj_H, valZ, src)
    return dH[dst]
```

---

## Pregunta 5 — Bonus

### Opción 1 [+9] — Clasificación de aristas con DFS modificado


>
> **Diapositivas de referencia:** Clase 13 — *Propiedades BFS-DFS*
> (clasificación según color del destino) y Clase 17 — *Puentes y
> articulaciones*, frame *Clasificación de aristas en DFS (repaso)*.

**Idea (CLRS 22.3, p. 610).** Mantenemos color, $d[v]$ y $f[v]$ durante
el DFS. Al recorrer la arista $(u, v)$ se clasifica según el color de
$v$:

| Color de $v$ | Comparación adicional | Tipo                                       |
| ------------ | --------------------- | ------------------------------------------ |
| Blanco       | —                     | **tree** (y se recursa)                    |
| Gris         | —                     | **back** ($v$ es ancestro en el árbol DFS) |
| Negro        | $d[u] < d[v]$         | **forward**                                |
| Negro        | $d[u] > d[v]$         | **cross**                                  |

**Complejidad.** Una sola pasada de DFS, $O(V + E)$.

```python
def clasificar_aristas(adj):
    n = len(adj)
    BLANCO, GRIS, NEGRO = 0, 1, 2

    color = [BLANCO] * n
    d = [0] * n
    f = [0] * n
    reloj = [0]
    aristas = []

    def visit(u):
        color[u] = GRIS
        reloj[0] = reloj[0] + 1
        d[u] = reloj[0]
        for v in adj[u]:
            if color[v] == BLANCO:
                aristas.append((u, v, "tree"))
                visit(v)
            elif color[v] == GRIS:
                aristas.append((u, v, "back"))
            elif d[u] < d[v]:
                aristas.append((u, v, "forward"))
            else:
                aristas.append((u, v, "cross"))
        color[u] = NEGRO
        reloj[0] = reloj[0] + 1
        f[u] = reloj[0]

    u = 0
    while u < n:
        if color[u] == BLANCO:
            visit(u)
        u = u + 1

    return aristas
```

### Opción 2 [+11] — La raíz con dos hijos en $T$ es articulación

**Enunciado.** Sea $G = (V, E)$ no dirigido y $T$ un árbol de DFS de
$G$. Sea $r$ la raíz de $T$. Si $r$ tiene al menos dos hijos en $T$,
entonces $r$ es punto de articulación de $G$.

**Demostración.** Sean $v_1, v_2$ dos hijos distintos de $r$ en $T$,
con subárboles $T(v_1)$ y $T(v_2)$.

**Paso 1.** En grafos no dirigidos, las únicas aristas del DFS son
**tree edges** y **back edges** (Clase 13). En particular, no existen
aristas que crucen entre subárboles "hermanos".

**Paso 2.** Probamos que no hay arista $(x, y) \in E$ con $x \in T(v_1)$
y $y \in T(v_2)$. Por contradicción, supóngase que existe. Sin pérdida
de generalidad, $d[x] < d[y]$. Como $T(v_1)$ se construye antes de
$T(v_2)$ en el DFS desde $r$, en el momento $f[x]$ el vértice $y$
todavía estaba blanco. Pero la arista $(x, y)$ existe, así que el DFS
la habría recorrido y descubierto $y$ como descendiente de $x$, poniendo
$y$ en $T(v_1)$, contradicción.

**Paso 3.** Las únicas aristas que conectan $T(v_1)$ con vértices fuera
de él son:
- la tree edge $(r, v_1)$, eliminada al quitar $r$;
- back edges desde $T(v_1)$ a ancestros propios de $v_1$ en $T$. El  único ancestro propio de $v_1$ es $r$, así que esas back edges   desaparecen al quitar $r$.

Análogamente con $T(v_2)$. Por tanto, en $G \setminus \{r\}$ no hay
camino entre $T(v_1)$ y $T(v_2)$: $r$ es punto de articulación.
$\blacksquare$

> **Por qué importa.** Es la **mitad raíz** del criterio de articulación
> de Tarjan visto en la **Clase 17**. Para vértices internos $u$ del
> árbol, $u$ es articulación si tiene un hijo $v$ con $low[v] \geq d[u]$;
> para la raíz basta con tener $\geq 2$ hijos. Esta demostración
> justifica esa segunda regla.

### Opción 3 [+6] — Subcaminos óptimos (Lema 24.1, CLRS)

**Enunciado.** Sea $G = (V, E)$ dirigido con peso $w : E \to \mathbb{R}$
y sea $p = v_0, v_1, \ldots, v_k$ un camino mínimo de $v_0$ a $v_k$.
Entonces, para todo $0 \leq i \leq j \leq k$, el subcamino
$p_{ij} = v_i, \ldots, v_j$ es un camino mínimo de $v_i$ a $v_j$.

**Demostración (por contradicción).** Descomponemos
$p = p_{0i} \cdot p_{ij} \cdot p_{jk}$ (concatenación), de modo que
$w(p) = w(p_{0i}) + w(p_{ij}) + w(p_{jk})$.

Supóngase, hacia contradicción, que existe $p'_{ij}$ con
$w(p'_{ij}) < w(p_{ij})$. Construimos
$p' = p_{0i} \cdot p'_{ij} \cdot p_{jk}$, de costo

$$w(p') \;=\; w(p_{0i}) + w(p'_{ij}) + w(p_{jk}) \;<\; w(p),$$

contradiciendo que $p$ es mínimo. $\blacksquare$

> **Por qué importa.** Es la **subestructura óptima** que justifica la
> relajación $d[v] \gets \min(d[v], d[u] + w(u, v))$ usada por
> Bellman-Ford (Clase 20), Dijkstra (Clase 21) y Floyd-Warshall
> (Clase 22). Sin este lema, ninguna de esas relaciones de recurrencia
> tendría sentido.

---

## Resumen — pregunta, código y diapositiva

| Pregunta          | Codigo                            | Diapositiva(s)                                                  | Tema                             |
| ----------------- | --------------------------------- | --------------------------------------------------------------- | -------------------------------- |
| 1(a) Tipo 1       | —                                 | C16 (Componentes fuertemente conexos)                           | Lema $f(C)$ y Kosaraju           |
| 1(a) Tipo 2       | —                                 | C19 (Intro. caminos cortos), C20 (Bellman-Ford), C21 (Dijkstra) | Limitaciones de Dijkstra         |
| 1(b)              | —                                 | C13 (Propiedades BFS-DFS), C17 (Puentes y articulaciones)       | Puentes y función `low`          |
| Sokoban           | `pregunta2_sokoban.py`            | C21 (Grafos de estado)                                          | Grafo de estados + 0–1 BFS       |
| Nameless (Tipo 1) | `pregunta3_nameless_tipo1.py`     | C19, C21                                                        | 0–1 BFS, costos en vértices      |
| Spring (Tipo 2)   | `pregunta2_spring_tipo2.py`       | C21 (Dijkstra)                                                  | Dijkstra con peajes en nodos     |
| Zlatan            | `pregunta4_zlatan.py`             | C16, C20, C21                                                   | SCC + Bellman-Ford + Dijkstra    |
| Bonus 1           | `bonus1_clasificacion_aristas.py` | C13 (Propiedades BFS-DFS)                                       | Clasificación de aristas         |
| Bonus 2           | —                                 | C17 (Puentes y articulaciones)                                  | Articulación en la raíz          |
| Bonus 3           | —                                 | C19, C20, C21, C22                                              | Subestructura óptima (Lema 24.1) |