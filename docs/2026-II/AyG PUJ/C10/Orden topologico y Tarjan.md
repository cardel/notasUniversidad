# Orden topológico con la profundidad y el valor low

**Viernes 2 de octubre de 2026.**

Kosaraju encuentra los componentes fuertemente conexos con dos búsquedas en
profundidad y una copia del grafo al revés. Los puntos de articulación y los
puentes quedaron solo como definición, y para hallarlos no había más recurso
que quitar cada pieza y volver a contar. La pregunta de la sesión es cuánto de
eso se puede sacar de *una sola* búsqueda en profundidad, mirando los tiempos
que deja en cada vértice. La respuesta pasa por un número nuevo, $v.low$, y
empieza por algo que ya se había insinuado: el orden topológico sale de los
tiempos de finalización.

Al terminar la sesión se espera poder:

- Obtener un orden topológico con la búsqueda en profundidad y demostrar por
  qué el orden por $f$ decreciente lo es.
- Detectar un ciclo con los colores de la profundidad.
- Calcular $v.low$ y explicar qué dice de un vértice.
- Ejecutar a mano e implementar el algoritmo de Tarjan para componentes
  fuertemente conexos, en $\Theta(V+E)$.
- Encontrar los puntos de articulación y los puentes de un grafo no dirigido
  con una sola profundidad, y justificar cada criterio.

## Diapositivas

[clase10-tarjan.pdf](clase10-tarjan.pdf){ target=_blank rel=noopener }, 86
páginas. Los tres grafos de ejemplo van dibujados: el plan de estudios de siete
materias, el dirigido de ocho vértices de la conectividad con $d/low$ escrito
debajo de cada vértice, y el no dirigido de tres triángulos con el puente
resaltado en rojo.

## Lo que dejó la conectividad

El recorrido completo está en la nota de [conectividad](../C9/Conectividad.md);
aquí van solo las piezas que se usan en esta sesión.

**Definición (los dos tiempos, CLRS Sección 22.3).** $v.d$ es el instante en
que la profundidad descubre $v$ y lo pinta de gris; $v.f$, el instante en que
termina con él y lo pinta de negro. Un vértice está gris exactamente en
$[v.d, v.f]$.

**Teorema (del paréntesis, Teorema 22.7 de CLRS).** Para dos vértices $u$ y
$v$, los intervalos $[u.d, u.f]$ y $[v.d, v.f]$ son disjuntos, o uno está
contenido en el otro. Está contenido exactamente cuando ese vértice es
descendiente del otro en el bosque de la profundidad.

**Teorema (del camino blanco, Teorema 22.9 de CLRS).** $v$ es descendiente de
$u$ si y solo si, en el instante $u.d$, hay un camino de $u$ a $v$ hecho solo
de vértices blancos.

La arista $(u,v)$ se clasifica por el color de $v$ en el momento en que se
explora:

| Color de $v$ | Tipo | Qué significa |
|---|---|---|
| blanco | árbol | $v$ se descubre desde $u$ |
| gris | retroceso | $v$ es ancestro de $u$ y sigue abierto |
| negro, con $u.d < v.d$ | hacia adelante | va a un descendiente ya terminado |
| negro, con $u.d > v.d$ | cruzada | va a otra rama o a otro árbol |

En un grafo no dirigido solo hay aristas de árbol y de retroceso
(Teorema 22.10 de CLRS). Cada arista se ve desde los dos extremos, y desde el
primero que se explora ya sale como de árbol o de retroceso.

**$Kosaraju(G)$**

1. Profundidad sobre $G$; los vértices por $f$ decreciente en $ord$.
2. Construir $G^{T}$.
3. Recorrer $ord$ y, desde cada vértice sin asignar, una profundidad sobre
   $G^{T}$: lo que alcanza es un componente.

Son dos profundidades y una copia del grafo: $\Theta(V+E)$ en tiempo y
$\Theta(V+E)$ de memoria extra por $G^{T}$. Sobre el grafo de ocho vértices
salió $\{a,b,e\}$, $\{c,d\}$, $\{f,g\}$, $\{h\}$, en ese orden, que es un
orden topológico de $G^{SCC}$.

## Orden topológico con la profundidad

El plan de estudios de la nota de [orden topológico](../C8/Orden%20topologico.md)
tiene siete materias, Árboles y grafos (AyG), Programación (Prog), Matemáticas
discretas (MD), Estructuras de datos (ED), Análisis de algoritmos (AA), Lógica
(Lóg) y Bases de datos (BD), y seis prerrequisitos: Prog $\to$ ED,
Lóg $\to$ MD, ED $\to$ AyG, MD $\to$ AyG, ED $\to$ BD y AyG $\to$ AA. En el
código las materias son los números $0$ a $6$, en ese mismo orden, y las listas
de adyacencia quedan AyG: $[\text{AA}]$; Prog: $[\text{ED}]$;
MD: $[\text{AyG}]$; ED: $[\text{AyG}, \text{BD}]$; AA: $[\,]$;
Lóg: $[\text{MD}]$; BD: $[\,]$.

### Por tanteo

Kahn empieza por las fuentes, lo que puede ir *primero*. La profundidad no
cuenta grados de entrada, pero sí sabe cuándo termina con un vértice. Si se
arranca en AyG, ¿cuál termina primero? ¿Puede ese ir al principio del plan, o
le toca ir al final?

El primero en terminar es AA. No tiene salidas, así que nada tiene que ir
después de él, y puede ir *de último*. Luego termina AyG, cuando ya no le
falta nada por debajo. La profundidad arma el plan desde el final hacia el
principio: el que termina se pone adelante de los que ya estaban.

### El algoritmo

**$TopologicalSort(G)$, CLRS Sección 22.4**

1. Ejecutar $DFS(G)$ para calcular $v.f$ de cada vértice
2. Cada vez que un vértice termina, insertarlo al principio de una lista
3. Devolver la lista

Dicho de otra forma, los vértices por tiempo de finalización decreciente. Es
el mismo $ord$ que Kosaraju calcula en su primer paso, ahora sobre un grafo
sin ciclos.

**Lema 22.11 de CLRS.** Un grafo dirigido es acíclico si y solo si la búsqueda
en profundidad no produce aristas de retroceso.

Con el lema, la misma profundidad decide si hay ciclo: basta ver si alguna
arista llega a un vértice gris. Si llega, no hay orden topológico y la lista
no sirve.

### Por qué el orden que sale es topológico

**Teorema (Teorema 22.12 de CLRS).** Si $G$ es un grafo dirigido acíclico,
para toda arista $(u,v)$ de $G$ se cumple $v.f < u.f$. En consecuencia,
$TopologicalSort(G)$ produce un orden topológico de $G$.

*Demostración.* Se procede de forma directa, por casos sobre el color de $v$
en el instante en que la profundidad explora la arista $(u,v)$. En ese
instante $u$ es gris.

- **$v$ gris.** Entonces $v$ es ancestro de $u$ y $(u,v)$ es de retroceso. Por
  el Lema 22.11, $G$ tendría un ciclo, en contra de la hipótesis. Este caso no
  ocurre.
- **$v$ blanco.** Por el teorema del camino blanco, $v$ queda como
  descendiente de $u$, y por el del paréntesis
  $[v.d, v.f] \subset [u.d, u.f]$. Luego $v.f < u.f$.
- **$v$ negro.** $v$ ya terminó y $v.f$ ya tiene valor; $u$ sigue gris, así que
  $u.f$ se asigna después. Como el reloj solo avanza, $v.f < u.f$.

Por lo tanto, se puede concluir que para toda arista $(u,v)$ de un grafo
acíclico $v.f < u.f$, y que al listar por $f$ decreciente $u$ queda antes que
$v$: la lista es un orden topológico. $\blacksquare$

### Sobre el plan de estudios

La profundidad recorre las materias en el orden de sus números. AyG abre el
reloj y baja a AA, que termina en $3$. Después arranca Prog, que baja a ED y de
ahí a BD; AyG ya está negro. Luego MD y por último Lóg. Son cuatro arranques:
AyG, Prog, MD y Lóg.

| Materia | AyG | Prog | MD | ED | AA | Lóg | BD |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $d/f$ | $1/4$ | $5/10$ | $11/12$ | $6/9$ | $2/3$ | $13/14$ | $7/8$ |

Por $f$ decreciente:

| Lóg | MD | Prog | ED | BD | AyG | AA |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $14$ | $12$ | $10$ | $9$ | $8$ | $4$ | $3$ |

Cada una de las seis aristas va de izquierda a derecha. Con la cola, Kahn dio
Prog, Lóg, ED, MD, BD, AyG, AA: otro orden, y también válido. Un grafo
acíclico puede tener muchos, y cada algoritmo encuentra uno.

Los otros se arman a mano, sin ejecutar nada. Todo orden válido empieza en una
fuente, un vértice sin predecesor, y el plan tiene dos: Prog y Lóg. Si se
arranca en Prog y se baja hasta donde alcance antes de pasar a Lóg queda Prog,
ED, BD, Lóg, MD, AyG, AA. Si se arranca en Lóg: Lóg, MD, Prog, ED, AyG, BD, AA.
Son veintidós órdenes en total para estas siete materias. El de la profundidad
es uno; el de Kahn, otro.

### La versión recursiva

```python
BLANCO, GRIS, NEGRO = 0, 1, 2


def topo_aux(G, u, color, orden, ciclo):
    # u se agrega a orden cuando termina con el: por f creciente.
    color[u] = GRIS
    for v in G[u]:
        if color[v] == BLANCO:
            topo_aux(G, v, color, orden, ciclo)
        elif color[v] == GRIS:
            ciclo[0] = True
    color[u] = NEGRO
    orden.append(u)


def orden_topologico_dfs(G):
    # Devuelve (orden, hay_ciclo). Si hay ciclo, orden no sirve.
    n = len(G)
    color = [BLANCO] * n
    orden = []
    ciclo = [False]
    u = 0
    while u < n:
        if color[u] == BLANCO:
            topo_aux(G, u, color, orden, ciclo)
        u = u + 1
    orden.reverse()
    resultado = (orden, ciclo[0])
    return resultado
```

`orden.append(u)` va *después* del ciclo: es el instante $u.f$, así que `orden`
se llena por $f$ creciente y al final se invierte. `ciclo` es una lista de un
elemento para que la recursión pueda cambiarlo; si queda en `True`, la lista
no es un orden topológico. Sobre el plan de estudios devuelve
`[5, 2, 1, 3, 6, 0, 4]`, que con los nombres es Lóg, MD, Prog, ED, BD, AyG, AA.

### La versión con pila explícita

```python
def topo_aux_con_pila(G, u, color, orden, ciclo):
    # Cada vertice entra dos veces: la primera lo pinta de gris y la
    # segunda lo pinta de negro y lo agrega a orden.
    pila = [(u, False)]
    while len(pila) > 0:
        w, finalizando = pila.pop()
        if finalizando:
            color[w] = NEGRO
            orden.append(w)
        elif color[w] == BLANCO:
            color[w] = GRIS
            pila.append((w, True))
            for v in G[w]:
                if color[v] == BLANCO:
                    pila.append((v, False))
                elif color[v] == GRIS:
                    ciclo[0] = True


def orden_topologico_dfs_con_pila(G):
    n = len(G)
    color = [BLANCO] * n
    orden = []
    ciclo = [False]
    u = 0
    while u < n:
        if color[u] == BLANCO:
            topo_aux_con_pila(G, u, color, orden, ciclo)
        u = u + 1
    orden.reverse()
    resultado = (orden, ciclo[0])
    return resultado
```

Cambia solo dónde queda lo pendiente. Cada vértice entra dos veces a la pila:
con `False` para descubrirlo y con `True` para terminarlo. El par con `True`
queda debajo de los vecinos, así que sale cuando ya se terminó con todos
ellos, igual que en la recursiva. Sobre el plan de estudios devuelve el mismo
orden.

### Cuando hay un ciclo

Al plan se le agrega un prerrequisito de más, AA $\to$ ED. La profundidad
arranca en AyG, baja a AA y de ahí a ED: los tres están grises. ED mira a AyG y
lo encuentra gris.

ED $\to$ AyG llega a un ancestro que sigue abierto: es una arista de
retroceso. Junto con el camino de árbol AyG $\to$ AA $\to$ ED cierra el ciclo,
y `orden_topologico_dfs` devuelve `ciclo = True`.

Llegar a un vértice negro no es un ciclo. Es una arista hacia adelante o
cruzada, como ED $\to$ AyG en el plan original: la profundidad llega a ED
desde Prog cuando AyG ya terminó. Solo el gris marca el ciclo, porque
solo el gris está todavía en el camino de la recursión.

### Kahn o profundidad

| | Kahn | Profundidad |
|---|---|---|
| Qué mira | grados de entrada | tiempos de finalización |
| Construye el orden | del principio al final | del final al principio |
| Ciclo | sobran vértices sin emitir | arista a un gris |
| Estructura | cola | pila o recursión |
| Costo | $\Theta(V+E)$ | $\Theta(V+E)$ |

En la profundidad cada vértice se pinta de gris una vez y de negro una vez, y
cada lista de adyacencia se recorre una vez: $\Theta(V+E)$. Invertir la lista
al final cuesta $\Theta(V)$.

## El valor low

### Dónde empieza un componente

En la profundidad de Kosaraju sobre el grafo de ocho vértices, $\{c,d\}$ se
descubrió completo dentro del intervalo de $c$, y $\{f,g\}$ dentro del de $g$.
No es casualidad.

Sea $r$ el primer vértice de un componente $C$ que la profundidad descubre. En
el instante $r.d$, todos los demás vértices de $C$ son blancos y se alcanzan
desde $r$ por caminos que no salen de $C$, todos blancos. Por el teorema del
camino blanco, todo $C$ queda como descendiente de $r$.

Cada componente fuertemente conexo cuelga entonces de un solo vértice, su
*raíz*, dentro de un mismo árbol de la profundidad. Si se sabe reconocer la
raíz en el momento en que termina, el componente es lo que se descubrió desde
ella y todavía no se ha repartido.

$r$ es raíz cuando desde su subárbol no hay forma de subir a un vértice
descubierto antes que $r$ que siga sin componente. Si la hubiera, $r$ y ese
vértice estarían en el mismo componente, y $r$ no sería el primero.

### La definición

**Definición ($v.low$, Tarjan 1972).** En la búsqueda en profundidad, $v.low$
es el menor $w.d$ entre $v$ y los vértices $w$ a los que se llega desde el
subárbol de $v$ con *una* arista que no es de árbol, siempre que $w$ siga en la
pila de vértices sin componente.

Se calcula en la misma recursión:

- Al descubrir $v$: $v.low = v.d$.
- Al volver de un hijo $w$: $v.low = \min(v.low, w.low)$.
- Ante una arista $(v,w)$ con $w$ en la pila: $v.low = \min(v.low, w.d)$.

Siempre $v.low \leq v.d$. Hay igualdad cuando nada del subárbol de $v$ sube
por encima de $v$, y en ese caso $v$ es la raíz de su componente.

Los $low$ de un componente no tienen que coincidir. Lo que lo marca es su raíz,
el único de sus vértices con $low = d$. Con las aristas $1 \to 2$, $2 \to 1$,
$1 \to 3$ y $3 \to 2$, arrancando la profundidad en $1$:

| Vértice | $1$ | $2$ | $3$ |
|---|:-:|:-:|:-:|
| $d/low$ | $1/1$ | $2/1$ | $3/2$ |

Los tres se alcanzan entre sí, así que el componente es $\{1,2,3\}$, y aun así
$3.low = 2$: la única arista que sale del subárbol de $3$ es $3 \to 2$, y $2$
está en la pila pero no es la raíz. El componente sale completo cuando termina
$1$.

El mismo grafo con un componente más, donde los dos $low$ sí coinciden, y los
catorce pasos de la ejecución están en
[esta página](tarjan-valor-low.pdf){ target=_blank rel=noopener }.

Para $low$ solo importan las comparaciones entre tiempos de descubrimiento, así
que el reloj avanza solo al descubrir y $v.d$ va de $1$ a $|V|$: es el orden en
que la profundidad encuentra los vértices.

### Por qué la pila

Cada vértice entra a la pila al ser descubierto y sale cuando se cierra su
componente. Los descendientes de una raíz $r$ que siguen en la pila quedan
encima de $r$, juntos, porque se descubrieron después de él. Cuando
$r.low = r.d$ se desapila hasta $r$ incluido, y lo que sale es el componente:
los descendientes de $r$ que no se habían ido con una raíz más profunda.

Una arista $(v,w)$ hacia un $w$ que ya salió de la pila lleva a un componente
cerrado. De allí no se vuelve a $v$: si se pudiera, $v$ y $w$ estarían en el
mismo componente y $w$ no se habría cerrado sin $v$. Esa arista no puede bajar
$v.low$, y por eso se pregunta por `en_pila[w]` y no por si $w$ ya fue
descubierto.

De fondo está la definición de componente, que pide las dos direcciones: camino
de $v$ a $w$ y camino de $w$ a $v$. La arista $(v,w)$ da el primero, así que lo
único en duda es el de vuelta. Mientras $w$ esté en la pila su componente sigue
abierto, el camino de vuelta no está descartado y los dos vértices pueden
terminar juntos; de ahí que $w.d$ entre al mínimo de $v.low$. Un componente ya
cerrado no admite ese camino y la arista no aporta nada.

El color no distingue los dos casos. Un vértice negro sigue en la pila mientras
su componente no se cierre, y una arista hacia él baja el $low$ igual que una
hacia un gris. El color dice si la recursión terminó con el vértice; la pila, si
su componente ya se repartió.

## El algoritmo de Tarjan

**$Tarjan(G)$**

1. Para cada vértice $u$ sin descubrir, ejecutar $Visit(u)$

**$Visit(u)$**

1. Asignar $u.d$ y $u.low$; apilar $u$
2. Para cada $v$ adyacente a $u$:
    1. Si $v$ no ha sido descubierto: $Visit(v)$ y
       $u.low = \min(u.low, v.low)$
    2. Si no, y $v$ está en la pila: $u.low = \min(u.low, v.d)$
3. Si $u.low = u.d$: desapilar hasta $u$; eso es un componente

Robert Tarjan lo publicó en 1972, en el artículo que mostró cuántos problemas
de grafos se resuelven en tiempo lineal con la búsqueda en profundidad. Usa
una sola profundidad y no construye $G^{T}$.

### Tarjan en Python

```python
def en_blanco(grafo):
    # d[v] = 0 dice que v no ha sido descubierto.
    d = {}
    low = {}
    en_pila = {}
    for v in grafo:
        d[v] = 0
        low[v] = 0
        en_pila[v] = False
    resultado = (d, low, en_pila)
    return resultado


def descubrir(u, reloj, d, low, pila, en_pila):
    # u recibe su numero de descubrimiento y entra a la pila.
    reloj[0] = reloj[0] + 1
    d[u] = reloj[0]
    low[u] = reloj[0]
    pila.append(u)
    en_pila[u] = True


def sacar_componente(u, pila, en_pila, componentes):
    # Desapila hasta u, incluido: eso es un componente.
    comp = []
    w = None
    while w != u:
        w = pila.pop()
        en_pila[w] = False
        comp.append(w)
    componentes.append(comp)


def tarjan(grafo):
    # grafo: dict que asocia cada vertice a la lista de sucesores.
    # Devuelve los componentes en el orden en que se cierran.
    d, low, en_pila = en_blanco(grafo)
    reloj = [0]
    pila = []
    componentes = []

    def visit(u):
        descubrir(u, reloj, d, low, pila, en_pila)
        for v in grafo[u]:
            if d[v] == 0:
                visit(v)
                low[u] = min(low[u], low[v])
            elif en_pila[v]:
                low[u] = min(low[u], d[v])
        if low[u] == d[u]:
            sacar_componente(u, pila, en_pila, componentes)

    for u in grafo:
        if d[u] == 0:
            visit(u)
    return componentes
```

`d[v] = 0` hace de marca de *sin descubrir*, porque el reloj empieza en $1$.
El paso 2.1 del algoritmo es la rama `if d[v] == 0`, con la actualización de
`low[u]` justo después de que `visit(v)` vuelve; el paso 2.2 es la rama
`elif en_pila[v]`.

`pila.append(u)` y `pila.pop()` trabajan al final de la lista y cuestan $O(1)$
amortizado: la lista reserva capacidad de sobra y solo de vez en cuando copia
todo a un bloque mayor. Insertar o sacar al principio costaría $O(n)$, porque
habría que correr los demás elementos una posición. Con el final, la pila no
cambia el $\Theta(V+E)$ del recorrido.

### Tarjan con pila explícita

```python
def tarjan_desde(grafo, s, reloj, d, low, pila, en_pila, componentes):
    # llamadas guarda pares [u, i]: i es el sucesor de u que toca
    # revisar cuando la busqueda vuelva a u.
    descubrir(s, reloj, d, low, pila, en_pila)
    llamadas = [[s, 0]]
    while len(llamadas) > 0:
        u, i = llamadas[-1]
        if i < len(grafo[u]):
            llamadas[-1][1] = i + 1
            v = grafo[u][i]
            if d[v] == 0:
                descubrir(v, reloj, d, low, pila, en_pila)
                llamadas.append([v, 0])
            elif en_pila[v]:
                low[u] = min(low[u], d[v])
        else:
            llamadas.pop()
            if low[u] == d[u]:
                sacar_componente(u, pila, en_pila, componentes)
            if len(llamadas) > 0:
                p = llamadas[-1][0]
                low[p] = min(low[p], low[u])


def tarjan_con_pila(grafo):
    # Lo mismo que tarjan, con la profundidad en una lista.
    d, low, en_pila = en_blanco(grafo)
    reloj = [0]
    pila = []
    componentes = []
    for s in grafo:
        if d[s] == 0:
            tarjan_desde(grafo, s, reloj, d, low, pila, en_pila,
                         componentes)
    return componentes
```

Hay dos pilas distintas. `pila` es la de Tarjan, con los vértices sin
componente. `llamadas` reemplaza la pila de la recursión: cada par $[u, i]$
dice por cuál sucesor de $u$ va el ciclo. Lo que la recursiva hace al volver
de $Visit(v)$, actualizar el $low$ del padre, aquí pasa al sacar el par de $u$
de `llamadas`, con el vértice `p` que queda arriba.

### Paso a paso

El grafo es el dirigido de ocho vértices de la conectividad, con las mismas
listas de adyacencia: $a$: $[b]$; $b$: $[c, e, f]$; $c$: $[d, g]$;
$d$: $[c, h]$; $e$: $[a, f]$; $f$: $[g]$; $g$: $[f, h]$; $h$: $[h]$. La
profundidad arranca en $a$. Cada vértice con $d/low$ al terminar:

| Vértice | $a$ | $b$ | $c$ | $d$ | $e$ | $f$ | $g$ | $h$ |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $d/low$ | $1/1$ | $2/1$ | $3/3$ | $4/3$ | $8/1$ | $7/6$ | $6/6$ | $5/5$ |

La primera rama baja hasta $h$:

| Paso | Qué pasa | Pila |
|---|---|---|
| $a, b, c, d$ | se descubren con $d = 1,2,3,4$ | $a\,b\,c\,d$ |
| $d \to c$ | $c$ en la pila: $d.low = 3$ | |
| $d \to h$ | se descubre $h$, $d=5$ | $a\,b\,c\,d\,h$ |
| $h \to h$ | el lazo no baja nada | |
| $h$ termina | $h.low = h.d = 5$: sale $\{h\}$ | $a\,b\,c\,d$ |
| $d$ termina | $d.low = 3 \neq 4$: se queda | |

$d.low = 3$ dice que desde $d$ se vuelve a $c$. Para pensar: ¿qué habría
pasado si $d \to c$ no existiera?

El resto:

| Paso | Qué pasa | Pila |
|---|---|---|
| $c \to g$, $g \to f$ | $g$: $d=6$; $f$: $d=7$ | $a\,b\,c\,d\,g\,f$ |
| $f \to g$ | $g$ en la pila: $f.low = 6$ | |
| $g \to h$ | $h$ ya salió: no cuenta | |
| $g$ termina | $g.low = g.d = 6$: sale $\{f,g\}$ | $a\,b\,c\,d$ |
| $c$ termina | $c.low = c.d = 3$: sale $\{c,d\}$ | $a\,b$ |
| $b \to e$, $e \to a$ | $e$: $d=8$; $a$ en la pila: $e.low=1$ | $a\,b\,e$ |
| $e \to f$, $b \to f$ | $f$ ya salió: no cuentan | |
| $a$ termina | $a.low = a.d = 1$: sale $\{a,b,e\}$ | vacía |

Los componentes salen en el orden $\{h\}$, $\{f,g\}$, $\{c,d\}$, $\{a,b,e\}$:
los mismos cuatro de Kosaraju. Leídos al revés son un orden topológico de
$G^{SCC}$. Tarjan los entrega de los sumideros hacia las fuentes, porque un
componente solo se cierra cuando ya se cerró todo lo que se alcanza desde él.
Las dos versiones del código devuelven
`[['h'], ['f', 'g'], ['d', 'c'], ['e', 'b', 'a']]`, cada componente en el
orden en que se desapiló.

La arista $g \to h$ separa *en la pila* de *ya descubierto*. Si se contara,
$g.low$ bajaría a $5$, $g$ no sería raíz y $\{f,g\}$ se iría con $\{c,d\}$ en
un solo componente equivocado.

### Cuatro componentes en siete vértices

Ocho aristas sobre siete vértices numerados: $1 \to 4$, $4 \to 5$, $1 \to 2$,
$2 \to 3$, $3 \to 1$, $1 \to 6$, $6 \to 7$ y $7 \to 6$. Las listas:
$1$: $[4, 2, 6]$; $2$: $[3]$; $3$: $[1]$; $4$: $[5]$; $5$: $[\,]$; $6$: $[7]$;
$7$: $[6]$. La profundidad arranca en $1$. Cada vértice con $d/low$ al terminar:

| Vértice | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $d/low$ | $1/1$ | $4/1$ | $5/1$ | $2/2$ | $3/3$ | $6/6$ | $7/6$ |

| Paso | Qué pasa | Pila |
|---|---|---|
| $1, 4, 5$ | se descubren con $d = 1,2,3$ | $1\,4\,5$ |
| $5$ termina | $5.low = 5.d = 3$: sale $\{5\}$ | $1\,4$ |
| $4$ termina | $4.low = 4.d = 2$: sale $\{4\}$ | $1$ |
| $1 \to 2$, $2 \to 3$ | $2$: $d=4$; $3$: $d=5$ | $1\,2\,3$ |
| $3 \to 1$ | $1$ en la pila: $3.low = 1$ | |
| $3$ y $2$ terminan | $low = 1$ en los dos: se quedan | $1\,2\,3$ |
| $1 \to 6$, $6 \to 7$ | $6$: $d=6$; $7$: $d=7$ | $1\,2\,3\,6\,7$ |
| $7 \to 6$ | $6$ en la pila: $7.low = 6$ | |
| $6$ termina | $6.low = 6.d = 6$: sale $\{6,7\}$ | $1\,2\,3$ |
| $1$ termina | $1.low = 1.d = 1$: sale $\{1,2,3\}$ | vacía |

Son cuatro, y salen en el orden $\{5\}$, $\{4\}$, $\{6,7\}$, $\{1,2,3\}$.
Los dos primeros tienen un solo vértice: de $5$ no sale ninguna arista y la
única que sale de $4$ lleva a $5$. $\{6,7\}$ se cierra antes que
$\{1,2,3\}$ aunque $6$ se descubra después de $3$, porque $1$ tiene tres
sucesores y no termina hasta recorrer el último. Las dos versiones del código
devuelven `[[5], [4], [7, 6], [3, 2, 1]]`.

Con la lista de $1$ en otro orden cambian los $d$ y puede cambiar el orden de
cierre. Los cuatro componentes son los mismos.

### Tarjan o Kosaraju

| | Kosaraju | Tarjan |
|---|---|---|
| Profundidades | dos | una |
| Grafo transpuesto | sí | no |
| Datos por vértice | $f$ y componente | $d$, $low$, en pila |
| Orden de salida | fuentes primero | sumideros primero |
| Tiempo | $\Theta(V+E)$ | $\Theta(V+E)$ |

En Tarjan cada vértice se descubre una vez, entra a la pila una vez y sale una
vez, y cada arista se mira una vez desde su origen: $\Theta(V+E)$ en tiempo y
$\Theta(V)$ de memoria extra.

## Puntos de articulación y puentes

### El grafo de la sección

Ocho vértices y diez aristas: dos triángulos, $0$–$1$–$2$ y $2$–$3$–$4$, que
comparten el $2$, la arista $4$–$5$ y un tercer triángulo, $5$–$6$–$7$. Las
listas: $0$: $[1,2]$; $1$: $[0,2]$; $2$: $[0,1,3,4]$; $3$: $[2,4]$;
$4$: $[2,3,5]$; $5$: $[4,6,7]$; $6$: $[5,7]$; $7$: $[5,6]$.

¿Cuáles son los puntos de articulación? ¿Y los puentes? Hay un punto de
articulación sin ningún puente al lado.

### La versión que uno escribe primero

```python
def articulaciones_ingenuo(G):
    # Quita cada vertice y cuenta los componentes que quedan.
    base = contar_componentes(G, -1, None)
    articulaciones = []
    u = 0
    while u < len(G):
        if len(G[u]) > 0 and contar_componentes(G, u, None) > base:
            articulaciones.append(u)
        u = u + 1
    return articulaciones
```

Es la definición ejecutada. `contar_componentes(G, u, None)` recorre el grafo
como si $u$ no existiera; la función está en el mismo archivo. Sobre el grafo
de la sección devuelve `[2, 4, 5]`.

Cuesta un recorrido completo por cada vértice, $\Theta(V \cdot (V+E))$. Para
los puentes es lo mismo con cada arista, $\Theta(E \cdot (V+E))$. Con $10^5$
vértices son del orden de $10^{10}$ pasos. La meta es sacar las dos respuestas
de una sola profundidad.

### $low$ en un grafo no dirigido

**Definición (CLRS, Problema 22-2).**
$v.low = \min\{\, v.d,\ w.d : (u,w) \text{ es de retroceso para algún
descendiente } u \text{ de } v \,\}$.

Frente a Tarjan para componentes cambian dos cosas. No hay aristas cruzadas ni
hacia adelante (Teorema 22.10), así que no hace falta la pila: todo vértice ya
descubierto que se ve desde $u$ es ancestro o descendiente. Lo único que hay
que excluir es la arista por la que se llegó, la que va al padre, que vista al
revés parece de retroceso y no lo es.

$v.low$ es lo más arriba en el árbol que se puede llegar desde el subárbol de
$v$ con un solo salto de retroceso. Si un hijo $w$ de $v$ tiene
$w.low \geq v.d$, todo el subárbol de $w$ depende de $v$ para llegar al resto
del grafo.

### La raíz

**Teorema (CLRS, Problema 22-2a).** La raíz de un árbol de la profundidad es
punto de articulación si y solo si tiene al menos dos hijos en ese árbol.

*Demostración.* Se procede de forma directa, en las dos direcciones, con el
Teorema 22.10. Si la raíz $r$ tiene dos hijos $w_1$ y $w_2$, no hay ninguna
arista entre el subárbol de $w_1$ y el de $w_2$: sería cruzada, y en un grafo
no dirigido no las hay. Sin $r$, quedan separados. Si $r$ tiene un solo hijo,
todos los demás vértices del árbol están en su subárbol, que sigue conexo por
las aristas de árbol sin pasar por $r$. Por lo tanto, se puede concluir que la
raíz es punto de articulación exactamente cuando tiene dos hijos o más.
$\blacksquare$

En el grafo de la sección, arrancando en $0$, la raíz baja a $1$, y desde $1$
se llega a $2$ y a todo lo demás: un solo hijo, y $0$ no es articulación.
Arrancando en $2$, la raíz tiene dos hijos, $0$ y $3$, y sí lo es: sin el $2$,
el $0$ y el $1$ quedan aislados del resto.

La raíz va aparte porque para ella siempre vale $w.low \geq r.d$, ya que $r.d$
es el mínimo del árbol. La condición de los demás vértices la marcaría
siempre.

### Los demás vértices

**Teorema (CLRS, Problema 22-2b).** Un vértice $v$ que no es raíz es punto de
articulación si y solo si tiene un hijo $w$ con $w.low \geq v.d$.

*Demostración.* Se procede de forma directa, leyendo qué dice $w.low$.
$w.low \geq v.d$ dice que ninguna arista de retroceso del subárbol de $w$
llega a un ancestro propio de $v$. Como no hay aristas cruzadas, el subárbol
de $w$ solo toca al resto del grafo a través de $v$: sin $v$, queda separado
del padre de $v$, que existe porque $v$ no es raíz. Si todos los hijos tienen
$w.low < v.d$, cada subárbol tiene una arista que salta por encima de $v$ y lo
mantiene unido al resto. Por lo tanto, se puede concluir que $v$ es punto de
articulación exactamente cuando algún hijo cumple $w.low \geq v.d$.
$\blacksquare$

### Los puentes

**Teorema (CLRS, Problema 22-2).** Una arista de árbol $(v,w)$,
con $w$ hijo de $v$, es puente si y solo si $w.low > v.d$. Una arista de
retroceso nunca es puente.

La desigualdad es estricta por lo que pasa en la igualdad. Con
$w.low = v.d$ hay una arista de retroceso desde el subárbol de $w$ hasta $v$
mismo, y con ella y el camino de árbol se cierra un ciclo que contiene a
$(v,w)$; una arista en un ciclo no es puente. Para el punto de articulación esa
arista no sirve, porque llega a $v$, que es el que se quita. Para el puente
sí, porque $v$ se queda.

Una arista de retroceso cierra un ciclo con el camino de árbol entre sus
extremos, y por eso tampoco es puente.

### Los dos criterios en Python

```python
def descubrir(u, reloj, d, low):
    reloj[0] = reloj[0] + 1
    d[u] = reloj[0]
    low[u] = reloj[0]


def revisar_hijo(u, v, es_raiz, d, low, es_art, puentes):
    # v es hijo de u y ya termino: su low es definitivo.
    low[u] = min(low[u], low[v])
    if not es_raiz and low[v] >= d[u]:
        es_art[u] = True
    if low[v] > d[u]:
        puentes.append((u, v))


def cortes_aux(G, u, padre, reloj, d, low, es_art, puentes):
    # padre = -1 dice que u es la raiz de su arbol.
    descubrir(u, reloj, d, low)
    hijos = 0
    for v in G[u]:
        if d[v] == 0:
            hijos = hijos + 1
            cortes_aux(G, v, u, reloj, d, low, es_art, puentes)
            revisar_hijo(u, v, padre == -1, d, low, es_art, puentes)
        elif v != padre:
            low[u] = min(low[u], d[v])
    if padre == -1 and hijos >= 2:
        es_art[u] = True


def cortes(G):
    # Devuelve (articulaciones, puentes). d[v] = 0: sin descubrir.
    n = len(G)
    d = [0] * n
    low = [0] * n
    es_art = [False] * n
    puentes = []
    reloj = [0]
    for u in range(n):
        if d[u] == 0:
            cortes_aux(G, u, -1, reloj, d, low, es_art, puentes)
    resultado = (marcados(es_art), puentes)
    return resultado


def marcados(es_art):
    # Los vertices con es_art en True, en orden.
    articulaciones = []
    u = 0
    while u < len(es_art):
        if es_art[u]:
            articulaciones.append(u)
        u = u + 1
    return articulaciones
```

`v != padre` excluye la arista por la que se llegó. Al volver de `cortes_aux`,
`revisar_hijo` hace las dos comparaciones: $\geq$ para el punto de
articulación, que no se aplica a la raíz, y $>$ para el puente. La raíz se
decide al final, contando sus hijos.

### Con pila explícita

```python
def cortes_desde(G, s, reloj, d, low, es_art, puentes):
    # llamadas guarda ternas [u, padre, i]. Devuelve los hijos de s.
    descubrir(s, reloj, d, low)
    hijos = 0
    llamadas = [[s, -1, 0]]
    while len(llamadas) > 0:
        u, padre, i = llamadas[-1]
        if i < len(G[u]):
            llamadas[-1][2] = i + 1
            v = G[u][i]
            if d[v] == 0:
                if u == s:
                    hijos = hijos + 1
                descubrir(v, reloj, d, low)
                llamadas.append([v, u, 0])
            elif v != padre:
                low[u] = min(low[u], d[v])
        else:
            llamadas.pop()
            if padre != -1:
                revisar_hijo(padre, u, padre == s, d, low, es_art, puentes)
    return hijos


def cortes_con_pila(G):
    # Lo mismo que cortes, con la profundidad en una lista.
    n = len(G)
    d = [0] * n
    low = [0] * n
    es_art = [False] * n
    puentes = []
    reloj = [0]
    for s in range(n):
        if d[s] == 0 and cortes_desde(G, s, reloj, d, low, es_art, puentes) >= 2:
            es_art[s] = True
    resultado = (marcados(es_art), puentes)
    return resultado
```

`revisar_hijo`, que la recursiva llama al volver de `cortes_aux`, aquí se
llama al sacar la terna de $u$ de `llamadas`, con su padre. En ese momento $u$
ya terminó y su $low$ es definitivo.

### Paso a paso, arrancando en $0$

La profundidad va $0, 1, 2, 3, 4, 5, 6, 7$ en una sola rama. Las aristas de
retroceso son $2$–$0$, $4$–$2$ y $7$–$5$. Cada vértice con $d/low$ al
terminar:

| Vértice | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $d/low$ | $1/1$ | $2/1$ | $3/1$ | $4/3$ | $5/3$ | $6/6$ | $7/6$ | $8/6$ |

Las aristas de árbol, en el orden en que la recursión vuelve por ellas:

| Arista de árbol $(v,w)$ | $w.low$ frente a $v.d$ | Articulación | Puente |
|---|---|---|---|
| $(6,7)$ | $6 < 7$ | no | no |
| $(5,6)$ | $6 = 6$ | $5$ sí | no |
| $(4,5)$ | $6 > 5$ | $4$ sí | sí |
| $(3,4)$ | $3 < 4$ | no | no |
| $(2,3)$ | $3 = 3$ | $2$ sí | no |
| $(1,2)$ | $1 < 2$ | no | no |
| $(0,1)$ | raíz con un hijo | $0$ no | no |

Los puntos de articulación son $2$, $4$ y $5$, y hay un solo puente, $(4,5)$.
El $2$ es articulación sin ningún puente al lado: separa dos triángulos que
solo lo comparten a él. Las dos versiones del código devuelven
`([2, 4, 5], [(4, 5)])`.

### Lo que cuesta

Cada vértice se descubre una vez y cada arista se mira dos veces, una desde
cada extremo. Las comparaciones son $O(1)$ por arista de árbol, así que las
dos respuestas salen a la vez en $\Theta(V+E)$.

Frente a la versión ingenua, se pasa de $\Theta(V \cdot (V+E))$ a
$\Theta(V+E)$. Con $10^5$ vértices y $2 \cdot 10^5$ aristas, de unos
$3 \cdot 10^{10}$ pasos a unos $3 \cdot 10^{5}$.

## Problemas de juez

- **UVa 796 — Critical Links.**
  Enunciado: <https://onlinejudge.org/external/7/796.pdf>.
  Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=737>.
  Pide los puentes de una red. La lista de salida va ordenada y cada puente
  con el extremo menor primero. El grafo puede venir desconectado y con
  vértices sin aristas, así que el ciclo externo arranca en todos.
- **UVa 315 — Network.**
  Enunciado: <https://onlinejudge.org/external/3/315.pdf>.
  Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=251>.
  Pide cuántos puntos de articulación hay. La trampa está en la lectura: cada
  línea trae un vértice seguido de sus vecinos, en cantidad variable, y una
  línea con un $0$ solo cierra el caso.
- **UVa 247 — Calling Circles.**
  Enunciado: <https://onlinejudge.org/external/2/247.pdf>.
  Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=183>.
  Los círculos de llamadas son los componentes fuertemente conexos. Los
  nombres se traducen a números con un diccionario antes de correr Tarjan.
- **UVa 11838 — Come and Go.**
  Enunciado: <https://onlinejudge.org/external/118/11838.pdf>.
  Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2938>.
  Pregunta si la ciudad es fuertemente conexa. Hay calles de una vía y de
  doble vía ($P = 2$ agrega las dos direcciones). Basta ver si Tarjan saca un
  solo componente.

## Errores comunes

- **Ordenar por $d$ en lugar de por $f$.** Sobre el plan de estudios, por $d$
  decreciente sale Lóg, MD, BD, ED, Prog, AA, AyG: AA queda antes que AyG, y la
  arista AyG $\to$ AA va al revés. El que garantiza el orden es $f$.
- **Llamar ciclo a cualquier vértice ya visitado.** En la profundidad, llegar
  a un negro no es ciclo; solo el gris lo es. Con `visitado` de dos estados, el
  plan de estudios parecería tener ciclo en Prog $\to$ ED $\to$ AyG.
- **En Tarjan, preguntar si $w$ fue descubierto.** Con `elif d[v] != 0` en vez
  de `elif en_pila[v]`, la arista $g \to h$ baja $g.low$ a $5$ y
  $\{c,d,f,g\}$ sale como un solo componente.
- **No excluir la arista al padre.** Sin `v != padre`, todo hijo tiene
  $w.low \leq v.d$ y $w.low > v.d$ no se cumple nunca: no aparece ningún
  puente. Los puntos de articulación siguen saliendo bien, porque su condición
  admite la igualdad, y por eso el error pasa inadvertido si solo se prueban
  ellos.
- **Usar $\geq$ para el puente.** En el triángulo $0$–$1$–$2$, la arista
  $(0,1)$ tiene $1.low = 1 = 0.d$ y saldría como puente, aunque está en un
  ciclo.
- **Aplicarle a la raíz la condición de los demás.** Para la raíz
  $w.low \geq r.d$ vale siempre. Arrancando en $0$, el $0$ saldría como
  articulación, y no lo es.

## El código de la clase

- [orden_topologico_dfs.py](codigo/orden_topologico_dfs.py): `topo_aux`,
  `orden_topologico_dfs`, `topo_aux_con_pila`, `orden_topologico_dfs_con_pila`
  y `tiempos`. Al correrlo imprime $d$ y $f$ de cada materia, el orden
  topológico con las dos versiones, el `True` del plan con el ciclo y la
  comparación contra una búsqueda de ciclos por fuerza bruta sobre 400 grafos
  aleatorios.
- [tarjan_scc.py](codigo/tarjan_scc.py): `en_blanco`, `descubrir`,
  `sacar_componente`, `tarjan`, `tarjan_desde` y `tarjan_con_pila`. Al correrlo
  imprime los cuatro componentes del grafo de ocho vértices con las dos
  versiones y los compara con la alcanzabilidad mutua calculada por fuerza
  bruta sobre 500 grafos aleatorios.
- [puentes_articulaciones.py](codigo/puentes_articulaciones.py):
  `articulaciones_ingenuo`, `contar_componentes`, `descubrir`, `revisar_hijo`,
  `cortes_aux`, `cortes`, `marcados`, `cortes_desde` y `cortes_con_pila`. Al
  correrlo imprime los puntos de articulación y los puentes del grafo de la
  sección con las dos versiones y con la ingenua, y los compara con quitar cada
  pieza y contar sobre 600 grafos aleatorios.

## Ejercicios

Los interactivos y los de papel están en la
[página de ejercicios](./Ejercicios.md). Los ocho de las diapositivas pueden
aparecer en el parcial: un orden topológico a mano sobre un grafo de siete
vértices, comparado con el de Kahn; el ciclo que aparece al agregarle una
arista y lo que devuelve `orden_topologico_dfs`; un grafo acíclico de tres
vértices donde el orden por $d$ creciente no es topológico y otro donde no lo
es el de $f$ creciente; Tarjan a mano sobre un grafo de siete vértices, con la
pila en cada cierre; un grafo de tres vértices donde `elif d[v] != 0` da
componentes equivocados; los cortes de un grafo no dirigido de siete vértices
calculados con $low$ y comparados con quitar pieza por pieza; la demostración
en cuatro partes del criterio de la raíz, y un grafo con una arista de árbol
$(v,w)$ en la que $w.low = v.d$.

## Lo que sigue

Los puntos de articulación parten un grafo no dirigido en pedazos que ya no
tienen ninguno: los *componentes biconexos*. Cada arista pertenece a
exactamente uno, y un punto de articulación está en varios a la vez. En el
grafo de la sección son los tres triángulos y la arista $4$–$5$.

Para investigar: CLRS, Problema 22-2, partes g y h. Por qué los componentes
biconexos reparten las aristas y no los vértices, y cómo la misma profundidad
con $low$ los saca guardando aristas en una pila en lugar de vértices.

## Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, 3.ª ed. MIT
  Press, 2009. Sección 22.3, Teoremas 22.7, 22.9 y 22.10 (tiempos, paréntesis,
  camino blanco y aristas en grafos no dirigidos); Sección 22.4, Lema 22.11 y
  Teorema 22.12 (orden topológico); Sección 22.5 (componentes fuertemente
  conexos); Problema 22-2 (puntos de articulación, puentes y componentes
  biconexos).
- Tarjan, R. E. Depth-first search and linear graph algorithms. *SIAM Journal
  on Computing*, 1(2):146–160, 1972.
- Halim, Halim, Effendy. *Competitive Programming 4*. Lulu, 2020. Capítulo 4:
  orden topológico, puntos de articulación y puentes, y componentes
  fuertemente conexos.
- Erickson, J. *Algorithms*. 2019. Capítulo 6, búsqueda en profundidad: orden
  topológico y componentes fuertemente conexos.
