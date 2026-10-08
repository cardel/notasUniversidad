# Problemas de cortes · AyG C11

**Viernes 9 de octubre de 2026.**

Una sola búsqueda en profundidad deja $v.d$ y $v.low$ en cada vértice, y con
esos dos números salen los puntos de articulación y los puentes en
$\Theta(V+E)$. El problema es que casi ningún enunciado de juez se queda ahí.
Pide orientar calles, contar en cuántos pedazos queda una red, medir
distancias. La lista de puentes es un paso intermedio, no la respuesta. La
pregunta de la sesión es qué se construye *con* los puentes para que esas
preguntas se vuelvan fáciles, y la respuesta es contraer: se encogen a un
nodo los pedazos que quedan al quitarlos, y lo que resulta es un árbol. Sobre
un árbol casi todo es un recorrido más.

Al terminar la sesión se espera poder:

- Construir el árbol de puentes de un grafo no dirigido en $\Theta(V+E)$ y
  demostrar que lo que sale es un árbol.
- Reconocer, leyendo un enunciado de juez, si el corte que pide es por
  vértice o por arista.
- Orientar las calles de una ciudad para que quede fuertemente conexa, y
  decir cuáles no se pueden orientar.
- Contar en cuántos pedazos queda una red al quitarle un vértice, con los
  hijos de la raíz y la comparación $w.low \geq v.d$.
- Escribir la profundidad con pila explícita cuando la entrada pasa del
  límite de recursión de Python.

## Diapositivas

[clase11-problemas-cortes.pdf](./clase11-problemas-cortes.pdf){ target=_blank rel=noopener },
108 páginas. Los grafos van dibujados: el de diez vértices con los tres
puentes en rojo, el mismo con $d/low$ debajo de cada vértice, el mismo con
cada componente encerrado en una caja, el árbol de puentes que sale de
contraerlo, la ciudad de siete intersecciones antes y después de orientarla,
y la red de ocho estaciones.

## Recuento

### Los tres criterios

**Definición ($v.low$, CLRS Problema 22-2).**
$v.low = \min\{\, v.d,\ w.d : (u,w) \text{ es de retroceso para algún
descendiente } u \text{ de } v \,\}$.

Es lo más arriba del árbol a donde se llega desde el subárbol de $v$ con un
solo salto de retroceso. En un grafo no dirigido solo hay aristas de árbol y
de retroceso (Teorema 22.10 de CLRS), así que no hace falta llevar pila de
vértices sin componente como en Tarjan: basta excluir la arista por la que se
bajó.

**Teorema (la raíz, CLRS Problema 22-2a).** La raíz de un árbol de la
profundidad es punto de articulación si y solo si tiene al menos dos hijos en
ese árbol.

**Teorema (los demás vértices, CLRS Problema 22-2b).** Un vértice $v$ que no
es raíz es punto de articulación si y solo si tiene un hijo $w$ con
$w.low \geq v.d$.

**Teorema (los puentes, CLRS Problema 22-2).** Una arista de árbol $(v,w)$,
con $w$ hijo de $v$, es puente si y solo si $w.low > v.d$. Una arista de
retroceso nunca es puente.

El recorrido completo, con las demostraciones de los tres criterios, está en
la nota del [valor low](../C10/Orden%20topologico%20y%20Tarjan.md). Aquí van
solo los dos detalles que esta sesión usa de otra manera.

### La desigualdad estricta

Los dos criterios comparan el mismo par de números y no admiten lo mismo en la
igualdad. Con $w.low = v.d$ hay un retroceso desde el subárbol de $w$ hasta
$v$ mismo. Contra la articulación ese salto no sirve, porque $v$ es el que se
quita; contra el puente sí, porque $v$ se queda y cierra un ciclo que contiene
a $(v,w)$. De ahí el $\geq$ en uno y el $>$ en el otro.

### La arista de entrada se excluye por su identificador

Preguntar `v != padre` alcanza mientras no haya dos aristas entre el mismo par
de vértices. Si las hay, la segunda copia es un retroceso legítimo hasta el
padre, queda descartada por error, y una arista doble sale como puente sin
serlo. Dos vías entre las mismas dos estaciones forman un ciclo de longitud
dos: ninguna de las dos es puente.

El arreglo es numerar las aristas. Cada vecino viene con el número de su
arista y la comparación pasa a ser `i != entrada`, que distingue las dos
copias porque tienen identificadores distintos. Las aristas repetidas se
manejan entonces igual que las demás, sin un caso aparte, y es la forma en que
está escrito todo el código de esta sesión.

Lo que cuesta no cambia: una profundidad, $\Theta(V+E)$, para las dos
respuestas a la vez.

## El árbol de puentes

### Por tanteo

El grafo de la sección tiene diez vértices y doce aristas: un triángulo
$0$–$1$–$2$, el vértice $3$ colgando entre dos puentes, el triángulo
$4$–$5$–$6$ y el triángulo $7$–$8$–$9$. La lista de aristas, en el orden en
que el código las numera de $0$ a $11$, es $0$–$1$, $1$–$2$, $2$–$0$,
$2$–$3$, $3$–$4$, $4$–$5$, $5$–$6$, $6$–$4$, $5$–$7$, $7$–$8$, $8$–$9$,
$9$–$7$. Los puentes son $2$–$3$, $3$–$4$ y $5$–$7$.

Bórrelos. ¿Cuántos pedazos quedan y quién está en cada uno? Y después: si cada
pedazo se encoge a un solo nodo y los tres puentes se dejan como aristas entre
esos nodos, ¿qué forma tiene el dibujo que queda?

Quedan cuatro pedazos y tres aristas entre ellos, y el dibujo es un camino.
Que no se cierre ningún ciclo no es casualidad. Una arista dentro de un ciclo
nunca es puente, de modo que los puentes son precisamente las aristas por las
que no hay por dónde volver.

### Los componentes 2-arista-conexos

**Definición.** Los *componentes 2-arista-conexos* de un grafo no dirigido $G$
son los componentes conexos del grafo que queda al borrar de $G$ todas sus
aristas puente.

Adentro de un componente no queda ningún puente, y el argumento es corto. Una
arista $e$ que sobrevive al borrado no es puente de $G$, así que está en un
ciclo de $G$. Ninguna arista de ese ciclo es puente, luego el ciclo entero
sobrevivió y vive dentro de un solo componente. Entonces $e$ tampoco es puente
de su componente.

Hay una lectura equivalente que explica el nombre: dos vértices distintos caen
en el mismo componente exactamente cuando hay entre ellos dos caminos sin
ninguna arista en común. Es el teorema de Menger para aristas, que este curso
no demuestra. La definición de arriba es la que se programa.

**No son los componentes biconexos.** Los 2-arista-conexos reparten los
vértices: cada uno cae en exactamente uno. Los biconexos reparten las aristas,
y un punto de articulación queda en varios a la vez. Unos se obtienen quitando
puentes; los otros, quitando puntos de corte.

### El árbol

**Teorema.** Sea $G$ un grafo no dirigido conexo. Sea $T$ el grafo cuyos nodos
son los componentes 2-arista-conexos de $G$ y que tiene una arista
$\{\,comp(u), comp(v)\,\}$ por cada puente $(u,v)$ de $G$. Entonces $T$ es un
árbol.

*Demostración.* Se procede en dos partes: la conexidad de forma directa, y la
ausencia de ciclos por contradicción.

**La conexidad.** Un camino de $G$ entre dos vértices cualesquiera recorre
vértices de uno u otro componente, y cada vez que cambia de componente lo hace
por una arista puente, que en $T$ es una arista entre esos dos nodos. Borrando
los tramos que se quedan dentro de un mismo componente queda un camino de $T$.
Como $G$ es conexo, entre dos nodos cualesquiera de $T$ hay camino.

**La ausencia de ciclos.** Supóngase que $T$ tiene un ciclo
$C_0, e_1, C_1, e_2, \ldots, e_k, C_k$ con $C_k = C_0$, los nodos
$C_0, \ldots, C_{k-1}$ distintos y $k \geq 2$. Cada $e_i$ es un puente de $G$
con un extremo en $C_{i-1}$ y el otro en $C_i$. Escríbase $e_1 = (u,v)$ con
$u \in C_0$ y $v \in C_1$.

Desde $v$ se llega a $u$ sin usar $e_1$: dentro de $C_1$ hay camino de $v$
hasta el extremo de $e_2$, se cruza $e_2$, y así hasta cruzar $e_k$ y llegar
dentro de $C_0$ hasta $u$. Los tramos interiores no usan puentes, porque
quedan dentro de un componente, y los cruces usan $e_2, \ldots, e_k$, todos
distintos de $e_1$. Ese camino más $e_1$ es un ciclo que contiene a $e_1$, y
entonces $e_1$ no es puente, en contra de lo supuesto.

Por lo tanto, se puede concluir que $T$ es conexo y sin ciclos, es decir un
árbol. Si $G$ no es conexo el mismo argumento corre dentro de cada componente
conexo, y $T$ es un bosque con un árbol por componente. $\blacksquare$

Del teorema salen dos cuentas sin trabajo adicional. Con $G$ conexo, $T$ tiene
tantas aristas como puentes tiene $G$, y tantos nodos como esas aristas más
uno. Y un componente que es hoja de $T$ cuelga del resto del grafo por un solo
puente.

### Cómo se construye

Son tres pasadas, cada una lineal:

1. **Los puentes, con Tarjan.** Una profundidad que calcula $d$ y $low$ y
   marca las aristas de árbol con $w.low > v.d$. $\Theta(V+E)$.
2. **El etiquetado.** Para cada vértice sin componente, un recorrido que *no
   cruza puentes*; a todo lo que alcanza se le pone el mismo número.
   $\Theta(V+E)$.
3. **El árbol.** Una pasada por las aristas puente, agregando a $T$ la arista
   entre los números de sus dos extremos. $\Theta(E)$.

En total, $\Theta(V+E)$ en tiempo y $\Theta(V+E)$ de memoria. Son tres
recorridos completos, no uno por vértice ni uno por arista.

La condición de la segunda pasada es la única que tiene, y es la que separa
los pedazos. Si el recorrido cruza un puente, dos componentes vecinos quedan
con el mismo número, $T$ pierde una arista y el árbol sale mal armado sin que
nada avise.

Al final quedan guardados tres datos: `es_puente`, el conjunto de
identificadores de arista; `comp[v]`, el número de componente de cada vértice;
y `T`, las listas de adyacencia del árbol. Con esos tres se responde casi
cualquier pregunta del enunciado.

### El grafo y sus aristas

```python
# Triangulo 0-1-2, puente 2-3, el vertice 3 solo, puente 3-4,
# triangulo 4-5-6, puente 5-7, triangulo 7-8-9.
ARISTAS = [(0, 1), (1, 2), (2, 0),
           (2, 3),
           (3, 4),
           (4, 5), (5, 6), (6, 4),
           (5, 7),
           (7, 8), (8, 9), (9, 7)]


def construir(vertices, aristas):
    # G[u] guarda parejas (vecino, id de la arista).
    G = {}
    for u in vertices:
        G[u] = []
    for i in range(len(aristas)):
        a, b = aristas[i]
        G[a].append((b, i))
        G[b].append((a, i))
    return G


def descubrir(u, reloj, d, low):
    reloj[0] = reloj[0] + 1
    d[u] = reloj[0]
    low[u] = reloj[0]
```

La lista de aristas manda: la arista $i$ es `aristas[i]`, y los dos extremos la
ven con el mismo número. Eso permite excluir la arista de entrada sin mirar
quién es el padre, y marcar un puente guardando un entero.

### Los puentes, versión recursiva

```python
def puentes_aux(G, u, entrada, reloj, d, low, es_puente):
    # entrada: el id de la arista que bajo a u; -1 en la raiz.
    descubrir(u, reloj, d, low)
    for v, i in G[u]:
        if d[v] == 0:
            puentes_aux(G, v, i, reloj, d, low, es_puente)
            low[u] = min(low[u], low[v])
            if low[v] > d[u]:
                es_puente.add(i)
        elif i != entrada:
            low[u] = min(low[u], d[v])


def puentes(G):
    # Devuelve el conjunto de ids de arista que son puente.
    d = {}
    low = {}
    for u in G:
        d[u] = 0
        low[u] = 0
    es_puente = set()
    reloj = [0]
    for u in G:
        if d[u] == 0:
            puentes_aux(G, u, -1, reloj, d, low, es_puente)
    return es_puente
```

`low[v] > d[u]` se evalúa al volver de la recursión, cuando `low[v]` ya es
definitivo. Lo que se guarda es `i`, el número de la arista de árbol que acaba
de bajar.

### Los puentes, con pila explícita

```python
def puentes_desde(G, s, reloj, d, low, es_puente):
    # Ternas [u, entrada, k]: por cual vecino de u va el ciclo.
    descubrir(s, reloj, d, low)
    llamadas = [[s, -1, 0]]
    while len(llamadas) > 0:
        u, entrada, k = llamadas[-1]
        if k < len(G[u]):
            llamadas[-1][2] = k + 1
            v, i = G[u][k]
            if d[v] == 0:
                descubrir(v, reloj, d, low)
                llamadas.append([v, i, 0])
            elif i != entrada:
                low[u] = min(low[u], d[v])
        else:
            llamadas.pop()
            if len(llamadas) > 0:
                p = llamadas[-1][0]
                low[p] = min(low[p], low[u])
                if low[u] > d[p]:
                    es_puente.add(entrada)


def puentes_con_pila(G):
    # Lo mismo que puentes, con la profundidad en una lista.
    d = {}
    low = {}
    for u in G:
        d[u] = 0
        low[u] = 0
    es_puente = set()
    reloj = [0]
    for s in G:
        if d[s] == 0:
            puentes_desde(G, s, reloj, d, low, es_puente)
    return es_puente
```

Cambia solo dónde queda lo pendiente. Cada terna $[u, entrada, k]$ dice por
cuál vecino de $u$ va el ciclo; lo que la recursiva hace al volver de la
llamada pasa aquí al sacar la terna de $u$, con el padre `p` que queda arriba.
El `entrada` que se guarda en `es_puente` es el de la terna que se acaba de
sacar, es decir el identificador de la arista de árbol que bajó a $u$.

### El etiquetado, versión recursiva

```python
def etiquetar(G, u, numero, es_puente, comp):
    # No cruza puentes: lo que alcanza es un componente.
    comp[u] = numero
    for v, i in G[u]:
        if comp[v] == -1 and i not in es_puente:
            etiquetar(G, v, numero, es_puente, comp)


def componentes(G, es_puente):
    # comp[v]: el componente de v, y el total de componentes.
    comp = {}
    for u in G:
        comp[u] = -1
    total = 0
    for u in G:
        if comp[u] == -1:
            etiquetar(G, u, total, es_puente, comp)
            total = total + 1
    return comp, total
```

`i not in es_puente` es todo lo que distingue este recorrido de una
profundidad corriente. `comp[v] == -1` dice que $v$ sigue sin componente.

### El etiquetado, con pila explícita

```python
def etiquetar_con_pila(G, s, numero, es_puente, comp):
    comp[s] = numero
    pila = [s]
    while len(pila) > 0:
        u = pila.pop()
        for v, i in G[u]:
            if comp[v] == -1 and i not in es_puente:
                comp[v] = numero
                pila.append(v)


def componentes_con_pila(G, es_puente):
    comp = {}
    for u in G:
        comp[u] = -1
    total = 0
    for u in G:
        if comp[u] == -1:
            etiquetar_con_pila(G, u, total, es_puente, comp)
            total = total + 1
    return comp, total
```

`comp[v] = numero` va antes de `pila.append(v)`, no al sacarlo. Si se deja para
después, un vértice entra a la pila varias veces y el recorrido deja de ser
lineal.

### Contraer el grafo

```python
def arbol_de_puentes(aristas, es_puente, comp, total):
    # Un nodo por componente, una arista por puente.
    T = {}
    for c in range(total):
        T[c] = []
    for i in sorted(es_puente):
        a, b = aristas[i]
        T[comp[a]].append(comp[b])
        T[comp[b]].append(comp[a])
    return T


def contraer(n, aristas):
    # Las tres pasadas seguidas. Theta(V+E) en total.
    G = construir(range(n), aristas)
    es_puente = puentes_con_pila(G)
    comp, total = componentes_con_pila(G, es_puente)
    T = arbol_de_puentes(aristas, es_puente, comp, total)
    return T, comp, es_puente
```

`contraer` devuelve el árbol, la etiqueta de cada vértice y el conjunto de
puentes, en ese orden, y es la función que los problemas llaman.

### Paso a paso, arrancando en $0$

La profundidad baja $0, 1, 2, 3, 4, 5, 6, 7, 8, 9$ en una sola rama. Las
aristas de retroceso son $2$–$0$, $6$–$4$ y $9$–$7$. Cada vértice con $d/low$
al terminar:

| Vértice | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | $9$ |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $d/low$ | $1/1$ | $2/1$ | $3/1$ | $4/4$ | $5/5$ | $6/5$ | $7/5$ | $8/8$ | $9/8$ | $10/8$ |

Las aristas de árbol, en el orden en que la recursión vuelve por ellas:

| Arista de árbol $(v,w)$ | $w.low$ frente a $v.d$ | ¿Puente? | Quién es |
|---|---|---|---|
| $(8,9)$ | $8 < 9$ | no | |
| $(7,8)$ | $8 = 8$ | no | |
| $(5,7)$ | $8 > 6$ | sí | arista $8$ |
| $(5,6)$ | $5 < 6$ | no | |
| $(4,5)$ | $5 = 5$ | no | |
| $(3,4)$ | $5 > 4$ | sí | arista $4$ |
| $(2,3)$ | $4 > 3$ | sí | arista $3$ |
| $(1,2)$ | $1 < 2$ | no | |
| $(0,1)$ | $1 = 1$ | no | |

Las dos igualdades valen la pena. En $(0,1)$ y en $(7,8)$ el retroceso llega
hasta $v$ mismo y cierra un ciclo que contiene la arista, así que no hay
puente. Con el criterio de articulación, que admite la igualdad, el $0$ y el
$7$ serían puntos de corte; el $7$ lo es y el $0$ no, porque la raíz se decide
contando hijos y tiene uno solo.

### Los cuatro componentes

El etiquetado arranca en $0$ y alcanza el $1$ y el $2$ sin cruzar la arista
$3$: componente $A = 0$. Sigue con el $3$, que tiene sus dos aristas marcadas
y queda solo: $B = 1$. Después el $4$, que alcanza el $5$ y el $6$: $C = 2$. Y
el $7$, que alcanza el $8$ y el $9$: $D = 3$.

En el código, `comp` queda `[0, 0, 0, 1, 2, 2, 2, 3, 3, 3]` para los vértices
$0$ a $9$.

### El árbol que queda

Los cuatro nodos son $A = \{0,1,2\}$, $B = \{3\}$, $C = \{4,5,6\}$ y
$D = \{7,8,9\}$, y las tres aristas son los tres puentes: $A$–$B$ por $2$–$3$,
$B$–$C$ por $3$–$4$ y $C$–$D$ por $5$–$7$. `T` queda
`{0: [1], 1: [0, 2], 2: [1, 3], 3: [2]}`: un camino. Las hojas son $A$ y $D$,
los dos componentes que cuelgan por un solo puente.

Con esos tres datos las preguntas del enunciado se contestan en un recorrido:

- ¿Cuántos puentes hay que cruzar para ir del $1$ al $8$? La distancia de $A$
  a $D$ en el árbol: tres.
- ¿El $4$ y el $6$ siguen conectados si se cae cualquier arista sola?
  `comp[4] == comp[6]`, así que sí.
- ¿Qué arista separa más parejas de vértices? Un puente, y se mide con los
  tamaños de los dos lados en el árbol.

## UVa 610 — Street Directions

### El problema

Enunciado: <https://onlinejudge.org/external/6/610.pdf>.
Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=551>.

Hay $n$ intersecciones ($2 \leq n \leq 1000$) y $m$ calles de doble vía, a lo
sumo una por cada par. Hay que convertir en una vía tantas calles como se
pueda, de modo que desde cada intersección se siga pudiendo llegar a todas las
demás. La calle que no se pueda convertir se imprime en los dos sentidos.

La entrada trae varios casos. Cada uno abre con $n$ y $m$ y sigue con las $m$
parejas `i j`; la entrada termina con $n = m = 0$. Por caso se imprime el
número de caso, una línea en blanco, cada calle como la pareja orientada
`i j`, y una línea con `#`. Las calles pueden ir en cualquier orden, y
cualquier orientación que cumpla se acepta.

El dato del enunciado que decide todo es este: con todas las calles de doble
vía se puede ir de cualquier intersección a cualquier otra. El grafo es
conexo.

### Qué es el grafo

El segundo caso de ejemplo tiene siete intersecciones y nueve calles: $1$–$2$,
$1$–$3$, $1$–$4$, $2$–$4$, $3$–$4$, $4$–$5$, $5$–$6$, $5$–$7$, $7$–$6$.

Los vértices son las intersecciones y las aristas no dirigidas, las calles.
Convertir una calle en una vía es orientar una arista; que desde cada
intersección se llegue a todas las demás es que el grafo dirigido resultante
sea fuertemente conexo.

Antes del algoritmo conviene mirar el dibujo y preguntarse qué calle no se
puede orientar, y por qué las otras ocho sí.

### Un puente no se puede orientar

**Teorema.** Si $(u,v)$ es puente de $G$, ninguna orientación que le dé un
solo sentido a $(u,v)$ deja el grafo dirigido fuertemente conexo.

*Demostración.* Se procede de forma directa, partiendo el grafo por la arista.
Al quitar $(u,v)$ el grafo queda en dos pedazos, $U$ con $u$ y $V$ con $v$,
sin ninguna arista entre ellos. Todo camino de $v$ a $u$ en $G$ usa $(u,v)$,
porque es la única arista que cruza. Si se orienta $u \rightarrow v$, desde
$v$ no hay forma de volver a $u$; si se orienta $v \rightarrow u$, desde $u$
no hay forma de llegar a $v$. Por lo tanto, se puede concluir que un puente
tiene que quedar en doble vía, y las calles que el enunciado llama no
convertibles son exactamente los puentes. $\blacksquare$

### Las demás sí, y la profundidad las orienta

**Teorema.** Sea $G$ conexo y sea $r$ un vértice. Oriéntense las aristas de
árbol de la profundidad desde $r$ del padre al hijo, las de retroceso del
descendiente al ancestro, y cada puente en los dos sentidos. El grafo dirigido
que resulta es fuertemente conexo.

*Demostración.* Se procede de forma directa para la ida desde $r$, y por
contradicción sobre el vértice de menor $d$ que no logra volver.

**La ida.** Toda arista de árbol quedó orientada del padre al hijo, así que el
camino de árbol de $r$ a cualquier $x$ es un camino dirigido. Desde $r$ se
llega a todos.

**La vuelta.** Sea $S$ el conjunto de vértices desde los que se llega a $r$.
Si $S \neq V$, tómese $v \notin S$ con $v.d$ mínimo, y sea $p$ su padre. Hay
dos casos.

Si $(p,v)$ es puente, quedó en doble vía y existe $v \rightarrow p$, con
$p.d < v.d$.

Si no lo es, entonces $v.low \leq p.d$, y por la definición de $low$ hay un
descendiente $u$ de $v$ con un retroceso $(u,w)$ tal que
$w.d = v.low \leq p.d < v.d$. Bajando por aristas de árbol de $v$ a $u$, todas
orientadas hacia abajo, y cruzando $u \rightarrow w$, se llega a $w$.

En los dos casos $v$ alcanza un vértice de $d$ menor que $v.d$. Ese vértice
está en $S$, por la minimalidad de $v.d$ o porque es $r$. Entonces $v \in S$,
en contra de lo supuesto.

Por lo tanto, se puede concluir que desde $r$ se llega a todos y desde todos se
llega a $r$: el grafo dirigido es fuertemente conexo. Como solo los puentes
quedaron en doble vía y ninguno podía dejar de estarlo, la orientación
convierte el máximo número de calles. $\blacksquare$

El resultado es de Robbins, 1939: un grafo conexo admite una orientación
fuertemente conexa si y solo si no tiene puentes.

### El algoritmo

**$Orientar(G)$**

1. Para cada vértice $s$ sin descubrir, ejecutar $OrientarDesde(s)$

**$OrientarDesde(u)$**

1. Asignar $u.d$ y $u.low$
2. Para cada vecino $v$ de $u$ por la arista $i$:
    1. Si $v$ no ha sido descubierto: emitir $(u,v)$, $OrientarDesde(v)$,
       $u.low = \min(u.low, v.low)$ y, si $v.low > u.d$, emitir también
       $(v,u)$
    2. Si no, y $i$ no es la arista de entrada y $v.d < u.d$: emitir $(u,v)$ y
       $u.low = \min(u.low, v.d)$

La comparación $v.d < u.d$ del paso 2.2 es la que evita imprimir dos veces la
misma calle. Una arista que no es de árbol se ve desde los dos extremos: desde
el descendiente el otro tiene $d$ menor, y desde el ancestro, mayor. La
comparación deja pasar una sola de las dos miradas.

Es una profundidad por caso, $\Theta(n+m)$ en tiempo y $\Theta(n+m)$ de
memoria. Con $n \leq 1000$ cada caso es inmediato; lo que suma es la cantidad
de casos, así que la salida se arma en una lista y se imprime de un golpe.

### El código, versión recursiva

```python
def orientar_aux(G, u, entrada, reloj, d, low, salida):
    descubrir(u, reloj, d, low)
    for v, i in G[u]:
        if d[v] == 0:
            salida.append((u, v))
            orientar_aux(G, v, i, reloj, d, low, salida)
            low[u] = min(low[u], low[v])
            if low[v] > d[u]:
                salida.append((v, u))
        elif i != entrada and d[v] < d[u]:
            salida.append((u, v))
            low[u] = min(low[u], d[v])


def orientar(G):
    d = {}
    low = {}
    for u in G:
        d[u] = 0
        low[u] = 0
    reloj = [0]
    salida = []
    for s in G:
        if d[s] == 0:
            orientar_aux(G, s, -1, reloj, d, low, salida)
    return salida
```

Hay tres emisiones y cada una ocurre en un momento distinto. La de árbol, al
bajar. La de retroceso, en el `elif`. Y la vuelta del puente, al subir, cuando
`low[v] > d[u]`.

### El código, con pila explícita

```python
def orientar_desde(G, s, reloj, d, low, salida):
    descubrir(s, reloj, d, low)
    llamadas = [[s, -1, 0]]
    while len(llamadas) > 0:
        u, entrada, k = llamadas[-1]
        if k < len(G[u]):
            llamadas[-1][2] = k + 1
            v, i = G[u][k]
            if d[v] == 0:
                salida.append((u, v))
                descubrir(v, reloj, d, low)
                llamadas.append([v, i, 0])
            elif i != entrada and d[v] < d[u]:
                salida.append((u, v))
                low[u] = min(low[u], d[v])
        else:
            llamadas.pop()
            if len(llamadas) > 0:
                p = llamadas[-1][0]
                low[p] = min(low[p], low[u])
                if low[u] > d[p]:
                    salida.append((u, p))


def orientar_con_pila(G):
    d = {}
    low = {}
    for u in G:
        d[u] = 0
        low[u] = 0
    reloj = [0]
    salida = []
    for s in G:
        if d[s] == 0:
            orientar_desde(G, s, reloj, d, low, salida)
    return salida
```

Esta es la que se envía. El límite de recursión de Python es de $1000$ marcos,
y una ciudad de $1000$ intersecciones en línea tiene una rama de profundidad
$1000$: la versión recursiva se cae antes de imprimir nada.

### La lectura y la salida

```python
def leer_pareja(datos, pos):
    # Los dos enteros desde pos, y la posicion siguiente.
    return int(datos[pos]), int(datos[pos + 1]), pos + 2


def main():
    datos = stdin.read().split()
    lineas = []
    caso = 1
    n, m, pos = leer_pareja(datos, 0)
    while n != 0 or m != 0:
        aristas = []
        for _ in range(m):
            a, b, pos = leer_pareja(datos, pos)
            aristas.append((a, b))
        G = construir(range(1, n + 1), aristas)
        lineas.append(str(caso))
        lineas.append("")
        for u, v in orientar_con_pila(G):
            lineas.append(str(u) + " " + str(v))
        lineas.append("#")
        caso = caso + 1
        n, m, pos = leer_pareja(datos, pos)
    print("\n".join(lineas))
```

Tres detalles del formato se cobran solos: después del número de caso va una
línea en blanco, cada caso cierra con una línea que trae solo `#`, y las
intersecciones van de $1$ a $n$, así que el diccionario se arma con
`range(1, n + 1)` y no con `range(n)`.

### El segundo caso, orientado

| Paso | Qué emite | Por qué |
|---|---|---|
| $1 \to 2 \to 4$ | `1 2`, `2 4` | aristas de árbol |
| $4$ mira el $1$ | `4 1` | retroceso, $1.d < 4.d$ |
| $4 \to 3$ | `4 3` | arista de árbol |
| $3$ mira el $1$ | `3 1` | retroceso |
| $4 \to 5 \to 6 \to 7$ | `4 5`, `5 6`, `6 7` | aristas de árbol |
| $7$ mira el $5$ | `7 5` | retroceso |
| $5$ termina | `5 4` | $5.low = 5 > 4.d = 3$: puente |

Diez líneas para nueve calles. El único puente es $4$–$5$ y sale en los dos
sentidos; las otras ocho salen una vez cada una.

La comprobación se hace a ojo sobre el dibujo orientado. Desde el $5$ se llega
al $4$ por el puente y de ahí al $1$; desde el $1$ se vuelve al $5$ por
$1 \to 2 \to 4 \to 5$. El triángulo $5$–$6$–$7$ gira en un sentido y el
$1$–$2$–$4$ en el otro.

## UVa 10765 — Doves and Bombs

### El problema

Enunciado: <https://onlinejudge.org/external/107/10765.pdf>.
Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1706>.

Una red conexa de $n$ estaciones ($3 \leq n \leq 10000$) unidas por vías. El
*valor paloma* de una estación es en cuántos pedazos queda la red al
bombardearla, que es cuántas palomas hacen falta para que un mensaje llegue a
todas las estaciones que siguen en pie. Hay que listar las $m$ estaciones de
mayor valor.

Cada caso abre con $n$ y $m$, sigue con las parejas `x y` de las vías y cierra
con una línea `-1 -1`. La entrada termina con $n = m = 0$. Por caso se imprimen
exactamente $m$ líneas con la estación y su valor, ordenadas por valor
decreciente y, a igual valor, por número creciente; después, una línea en
blanco.

El valor es el número de pedazos porque una paloma entra a un pedazo y de ahí
el mensaje sigue en tren. Cada pedazo necesita la suya, y una sola no alcanza
para dos pedazos: la paloma no vuelve a volar.

### Qué es el grafo

El caso de ejemplo tiene ocho estaciones y ocho vías: $0$–$4$, $1$–$2$,
$2$–$3$, $2$–$4$, $3$–$5$, $3$–$6$, $3$–$7$, $6$–$7$. Las cinco primeras son
puentes; las tres últimas forman el triángulo $3$–$6$–$7$.

Los vértices son las estaciones, numeradas de $0$ a $n-1$, y las aristas no
dirigidas son las vías. Bombardear una estación es quitar un vértice, así que
el corte es por vértice: el valor paloma de $v$ es el número de componentes de
$G - v$.

Antes del algoritmo, sobre el dibujo: ¿cuánto vale el $3$? ¿Y el $2$? ¿Y el
$6$? Una de las tres respuestas es $1$, y conviene ver por qué.

### De contar componentes a contar hijos

**Teorema.** Sea $G$ conexo y sea $T$ un árbol de la profundidad con raíz $r$.
El número de componentes de $G - v$ es

$$
  c(v) =
  \begin{cases}
    |\{\text{hijos de } r \text{ en } T\}| & \text{si } v = r,\\
    1 + |\{w \text{ hijo de } v : w.low \geq v.d\}| & \text{si } v \neq r.
  \end{cases}
$$

*Demostración.* Se procede de forma directa, contando qué queda pegado al
quitar $v$: los subárboles de sus hijos, por un lado, y lo que está fuera del
subárbol de $v$, por el otro.

**Los subárboles de los hijos.** Todo vértice de $G - v$ está en el subárbol de
algún hijo de $v$ o fuera del subárbol de $v$. El subárbol de un hijo $w$ se
mantiene conexo por sus propias aristas de árbol. Entre los subárboles de dos
hijos distintos no hay ninguna arista, porque sería cruzada y en un grafo no
dirigido no las hay (Teorema 22.10). Lo único que puede pegarlos a algo es un
retroceso que salte por encima de $v$, y eso pasa exactamente cuando
$w.low < v.d$.

**Lo de afuera.** Con $v \neq r$, lo que está fuera del subárbol de $v$ no es
vacío: contiene a $r$ y al padre de $v$. Y es un solo pedazo, porque ninguno
de sus vértices es descendiente de $v$ y su camino de árbol hasta $r$ no pasa
por $v$. Los subárboles con $w.low < v.d$ se le pegan y los de
$w.low \geq v.d$ quedan sueltos, uno por uno. De ahí el $1$ más la cuenta.

Con $v = r$ no hay nada afuera. Un retroceso desde el subárbol de un hijo solo
puede ir a un ancestro, y el único ancestro es $r$, que ya no está. Cada
subárbol queda suelto y los pedazos son tantos como hijos.

Por lo tanto, se puede concluir que al quitar $v$ quedan tantos pedazos como
hijos tiene la raíz, si $v$ es la raíz, y uno más el número de hijos con
$w.low \geq v.d$ en los demás casos. De paso, $c(v) \geq 2$ exactamente cuando
$v$ es punto de articulación: los dos criterios del recuento son ese caso de
esta cuenta. $\blacksquare$

Sobre el dibujo, el $3$ vale $3$: se desprenden el $5$ y el par $6$–$7$, y
queda el resto con el $2$. El $2$ vale $3$: se desprenden el $1$ y todo lo que
cuelga del $3$, y queda el lado del $4$. El $6$ vale $1$: está en el triángulo
con el $3$ y el $7$, y al quitarlo nada se parte.

### El código, versión recursiva

```python
def paloma_aux(G, u, entrada, raiz, reloj, d, low, valor):
    descubrir(u, reloj, d, low)
    if u == raiz:
        valor[u] = 0
    for v, i in G[u]:
        if d[v] == 0:
            paloma_aux(G, v, i, raiz, reloj, d, low, valor)
            low[u] = min(low[u], low[v])
            if low[v] >= d[u] or u == raiz:
                valor[u] = valor[u] + 1
        elif i != entrada:
            low[u] = min(low[u], d[v])


def valores_paloma(G):
    d = {}
    low = {}
    valor = {}
    for u in G:
        d[u] = 0
        low[u] = 0
        valor[u] = 1
    reloj = [0]
    for s in G:
        if d[s] == 0:
            paloma_aux(G, s, -1, s, reloj, d, low, valor)
    return valor
```

`valor[u]` arranca en $1$, que es el pedazo que se queda con el padre. Encima
se suma un hijo por cada `low[v] >= d[u]`. La raíz no tiene padre, así que se
pone en $0$ al descubrirla y suma todos sus hijos, que es lo que dice la otra
rama del teorema.

### El código, con pila explícita

```python
def paloma_desde(G, s, reloj, d, low, valor):
    descubrir(s, reloj, d, low)
    valor[s] = 0
    llamadas = [[s, -1, 0]]
    while len(llamadas) > 0:
        u, entrada, k = llamadas[-1]
        if k < len(G[u]):
            llamadas[-1][2] = k + 1
            v, i = G[u][k]
            if d[v] == 0:
                descubrir(v, reloj, d, low)
                llamadas.append([v, i, 0])
            elif i != entrada:
                low[u] = min(low[u], d[v])
        else:
            llamadas.pop()
            if len(llamadas) > 0:
                p = llamadas[-1][0]
                low[p] = min(low[p], low[u])
                if low[u] >= d[p] or p == s:
                    valor[p] = valor[p] + 1


def valores_paloma_con_pila(G):
    d = {}
    low = {}
    valor = {}
    for u in G:
        d[u] = 0
        low[u] = 0
        valor[u] = 1
    reloj = [0]
    for s in G:
        if d[s] == 0:
            paloma_desde(G, s, reloj, d, low, valor)
    return valor
```

Esta es la que se envía. Con $n = 10000$ en línea, la rama tiene profundidad
$10000$ y la recursiva levanta `RecursionError` contra el límite de $1000$
marcos. La de pila entrega la respuesta en centésimas de segundo.

### El orden de la salida

```python
def mejores(valor, m):
    # Valor decreciente y, a igual valor, numero creciente.
    pares = []
    for v in valor:
        pares.append((-valor[v], v))
    pares.sort()
    lineas = []
    for k in range(m):
        peso, v = pares[k]
        lineas.append(str(v) + " " + str(-peso))
    return lineas


def main():
    datos = stdin.read().split()
    bloques = []
    n, m, pos = leer_pareja(datos, 0)
    while n != 0 or m != 0:
        aristas = []
        a, b, pos = leer_pareja(datos, pos)
        while a != -1 or b != -1:
            aristas.append((a, b))
            a, b, pos = leer_pareja(datos, pos)
        G = construir(range(n), aristas)
        bloques.append("\n".join(mejores(valores_paloma_con_pila(G), m)))
        n, m, pos = leer_pareja(datos, pos)
    for bloque in bloques:
        print(bloque)
        print()
```

El signo menos hace todo el trabajo del ordenamiento. El orden pedido es
decreciente por valor y creciente por número; las parejas se arman como
$(-valor, v)$ y se ordenan de forma corriente, de modo que el signo invierte
el primer campo y deja el segundo como está.

### Paso a paso, arrancando en $0$

La rama es $0 \to 4 \to 2$, y de $2$ salen el $1$ y el $3$; de $3$ salen el
$5$ y el $6$, y de $6$ el $7$. El único retroceso es $7$–$3$, con $3.d = 5$:
baja $7.low$ y $6.low$ a $5$.

| Vértice | $0$ | $4$ | $2$ | $1$ | $3$ | $5$ | $6$ | $7$ |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $d$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ |
| $low$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $5$ | $5$ |

| Hijo $w$ de $v$ | $w.low$ frente a $v.d$ | ¿Suma? | $valor[v]$ |
|---|---|---|---|
| $1$ de $2$ | $4 \geq 3$ | sí | $2$ |
| $5$ de $3$ | $6 \geq 5$ | sí | $2$ |
| $7$ de $6$ | $5 \geq 7$ | no | $1$ |
| $6$ de $3$ | $5 \geq 5$ | sí | $3$ |
| $3$ de $2$ | $5 \geq 3$ | sí | $3$ |
| $2$ de $4$ | $3 \geq 2$ | sí | $2$ |
| $4$ de $0$ | raíz con un hijo | no | $1$ |

Los valores son $2{:}3$, $3{:}3$, $4{:}2$ y $1$ para las demás, así que con
$m = 4$ las cuatro líneas quedan `2 3`, `3 3`, `4 2`, `0 1`.

La fila del $7$ está en la tabla y no suma. $7.low = 5$ es menor que
$6.d = 7$: el retroceso $7$–$3$ salta por encima del $6$ y lo deja fuera del
corte. Es el mismo número que sí hace sumar al $3$, leído desde otro padre.

Cuesta una profundidad por caso, $\Theta(n+m)$, más $O(n \log n)$ por el
ordenamiento de la salida. Las estaciones tienen grado a lo sumo $10$, de modo
que $m = O(n)$.

## Interplanetary

El enunciado y la solución los trae el profesor titular, y el problema se
trabaja en la sesión con el material que él publica.

Se ataca con el árbol de puentes: Tarjan para marcarlos, el etiquetado que no
los cruza para darle a cada vértice su componente, y un recorrido del árbol
que queda.

## Cómo atacar estos problemas

Los tres comparten el mismo camino, y son cinco pasos:

1. **Leer el grafo.** Quiénes son los vértices y quiénes las aristas, y si
   viene dirigido o no. Intersecciones y calles; estaciones y vías.
2. **Decidir qué se corta.** Si lo que el enunciado quita o rompe es un
   vértice, el criterio es el de articulación ($w.low \geq v.d$ y los hijos de
   la raíz). Si es una arista, el de puente ($w.low > v.d$).
3. **Calcular con Tarjan.** Una profundidad, $d$ y $low$, $\Theta(V+E)$. Con
   pila explícita si la entrada puede dar una rama de más de mil vértices.
4. **Contraer, si la pregunta no es local.** Si pregunta por caminos,
   distancias o cuántos puentes se cruzan, se arma el árbol de puentes.
5. **Recorrer lo que quedó.** Sobre el árbol, una profundidad o una amplitud
   más; sobre el grafo original, una pasada por las aristas.

No todos llegan al final. UVa 10765 se queda en el paso 3, porque la respuesta
es una cuenta por vértice. UVa 610 llega al paso 3 y emite en la misma pasada.
Los problemas que piden distancias llegan al 5.

El paso que más se salta es el 2. Un enunciado que habla de destruir ciudades
pide articulaciones; uno que habla de cortar cables o inundar carreteras pide
puentes. Resolver el otro da una respuesta razonable que el juez rechaza.

## Errores comunes

- **Contar mal los hijos de la raíz.** Hijos en el árbol de la profundidad, no
  vecinos. En el ejemplo de UVa 10765 la raíz $0$ tiene un vecino y un hijo, y
  vale $1$; una raíz con tres vecinos de los que dos ya fueron descubiertos
  también tiene un solo hijo. Contar vecinos infla el valor de la raíz y la
  lista de salida sale encabezada por la estación equivocada.
- **Usar `low[v] > d[u]` para la articulación.** Con la desigualdad estricta se
  pierden los vértices cuyo hijo tiene un retroceso que llega hasta ellos
  mismos. En el ejemplo, el $3$ dejaría de sumar por su hijo $6$, porque
  $6.low = 5 = 3.d$, y saldría con valor $2$ en lugar de $3$. El criterio de
  articulación admite la igualdad; el de puente, no.
- **Olvidar las aristas repetidas.** Dos vías entre las mismas dos estaciones
  forman un ciclo de longitud dos, así que ninguna de las dos es puente. Con
  `v != padre` la segunda copia queda descartada por error y la primera sale
  como puente. Se arregla comparando identificadores de arista:
  `i != entrada`.
- **Cruzar puentes en el etiquetado.** Si el recorrido del paso 2 no revisa
  `i not in es_puente`, llega al otro lado del puente y dos componentes
  vecinos se fusionan. El árbol pierde nodos y aristas, el programa no se
  queja, y las respuestas salen de otro grafo. En el grafo de la sección
  quedaría un solo nodo en lugar de cuatro.
- **Reutilizar los arreglos entre casos.** Si $d$, $low$, el reloj o el
  conjunto de puentes se quedan con los valores del caso anterior, el segundo
  caso sale mal y el primero bien, que es la forma más costosa de buscar el
  error.
- **Mandar la versión recursiva.** Con $n = 10000$ y la red en línea, la
  profundidad recursiva se cae contra el límite de $1000$ marcos de Python.
  Subirlo con `setrecursionlimit` cambia el `RecursionError` por un
  desbordamiento de la pila del sistema. La versión de pila explícita no tiene
  ese techo.
- **Emitir dos veces la misma arista de retroceso.** En UVa 610, sin la
  comparación `d[v] < d[u]` cada arista que no es de árbol se emite desde sus
  dos extremos. La salida trae una calle de más en los dos sentidos y el juez
  la rechaza, aunque la orientación sea fuertemente conexa.
- **Imprimir dentro del ciclo de casos.** Con muchos casos, un `print` por
  línea es el cuello de botella. Las líneas se acumulan en una lista y se
  imprimen de un golpe al final.

## El código de la clase

- [arbol_de_puentes.py](./codigo/arbol_de_puentes.py): `construir`,
  `descubrir`, `puentes_aux`, `puentes`, `puentes_desde`, `puentes_con_pila`,
  `etiquetar`, `componentes`, `etiquetar_con_pila`, `componentes_con_pila`,
  `arbol_de_puentes` y `contraer`. Al correrlo imprime los tres puentes del
  grafo de diez vértices con las dos versiones, el componente de cada vértice
  y el árbol que queda, y los compara con quitar cada arista y contar
  componentes sobre 500 grafos aleatorios, comprobando además que lo contraído
  sea siempre un árbol o un bosque.
- [uva610_street_directions.py](./codigo/uva610_street_directions.py):
  `orientar_aux`, `orientar`, `orientar_desde`, `orientar_con_pila`,
  `leer_pareja` y `main`. Lee por `stdin` e imprime la orientación de cada
  caso, con el puente en doble vía.
- [uva10765_doves_and_bombs.py](./codigo/uva10765_doves_and_bombs.py):
  `paloma_aux`, `valores_paloma`, `paloma_desde`, `valores_paloma_con_pila`,
  `mejores`, `leer_pareja` y `main`. Lee por `stdin` e imprime las $m$
  estaciones de mayor valor paloma por caso.

## Ejercicios

Los interactivos y los de papel están en la
[página de ejercicios](./Ejercicios.md). Los ocho de las diapositivas pueden
aparecer en el parcial, y van sobre el mismo grafo $H$, con
$V = \{0, \ldots, 8\}$ y aristas $0$–$1$, $1$–$2$, $2$–$0$, $2$–$3$, $3$–$4$,
$4$–$2$, $4$–$5$, $5$–$6$, $6$–$7$, $7$–$5$, $7$–$8$: el árbol de puentes de
$H$ a mano, con $d$, $low$ y la tabla de aristas de árbol; qué pasa al
agregarle una segunda arista $4$–$5$ y qué devolvería un programa que excluye
la entrada con `v != padre`; los puntos de articulación y los puentes de $H$,
con un vértice que es articulación sin tener ningún puente incidente; el valor
paloma de los nueve vértices, calculado de las dos formas; la orientación de
$H$ con la regla de UVa 610 arrancando en $0$; las dos tablas de $d$ y $low$
que salen de arrancar en $0$ y en $4$, con la razón de que el conjunto de
puentes no dependa de la raíz; cuántas aristas nuevas hacen falta para dejar un
grafo conexo sin puentes, en función de las hojas del árbol; y el puente que
deja los dos pedazos más parejos, con el cálculo en $\Theta(V+E)$.

### Para enviar al juez

- **UVa 610 — Street Directions.**
  Enunciado: <https://onlinejudge.org/external/6/610.pdf>.
  Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=551>.
  El parámetro es la calle: hay que decidir cuáles se orientan. La propiedad
  está en que un puente no puede ser de una vía. La trampa es el formato:
  línea en blanco tras el número de caso y una línea con `#` al cerrar.
- **UVa 10765 — Doves and Bombs.**
  Enunciado: <https://onlinejudge.org/external/107/10765.pdf>.
  Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1706>.
  El parámetro es la estación y la propiedad es el conteo de hijos con
  $w.low \geq v.d$. La trampa es doble: el `-1 -1` que cierra las vías y los
  $10000$ vértices, que obligan a la pila explícita.
- **UVa 796 — Critical Links.**
  Enunciado: <https://onlinejudge.org/external/7/796.pdf>.
  Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=737>.
  Pide la lista de puentes ordenada, con el extremo menor primero. Sirve para
  probar la primera de las tres pasadas por separado, antes de armar el árbol.

## Lo que sigue

El árbol de puentes corta por aristas y agrupa vértices. Cortar por puntos de
articulación da otra partición, y esa reparte las *aristas*: cada arista
pertenece a un solo componente biconexo y un punto de articulación queda en
varios a la vez. La misma profundidad con $low$ los encuentra, guardando
aristas en una pila en lugar de vértices.

Para investigar: CLRS, Problema 22-2, partes g y h. Por qué la partición va
sobre las aristas y no sobre los vértices, y qué se apila en cada llamado para
sacar un componente al cerrar un punto de articulación.

## Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, 3.ª ed. MIT
  Press, 2009. Problema 22-2 (puntos de articulación, puentes y componentes
  biconexos); Sección 22.3, Teorema 22.10 (en un grafo no dirigido solo hay
  aristas de árbol y de retroceso).
- Robbins, H. E. A theorem on graphs, with an application to a problem of
  traffic control. *The American Mathematical Monthly*, 46(5):281–283, 1939.
- Tarjan, R. E. Depth-first search and linear graph algorithms. *SIAM Journal
  on Computing*, 1(2):146–160, 1972.
- Halim, Halim, Effendy. *Competitive Programming 4*. Lulu, 2020. Capítulo 4:
  puntos de articulación, puentes y orientación de grafos.
- UVa 610 — Street Directions.
  <https://onlinejudge.org/external/6/610.pdf>.
- UVa 10765 — Doves and Bombs.
  <https://onlinejudge.org/external/107/10765.pdf>.
