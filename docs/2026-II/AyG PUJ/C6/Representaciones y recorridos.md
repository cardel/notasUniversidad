# Representaciones de grafos y recorridos

**Viernes 11 de septiembre de 2026.**

Cuatro formas de guardar un grafo, con lo que ocupa cada una y lo que cuesta
cada consulta. De ahí sale cuál conviene, y de ahí la pregunta que viene
después: cómo se recorre un grafo, en profundidad y en amplitud.

## Diapositivas

[Repaso de grafos](clase06-repaso.pdf){ target=_blank } — definiciones, los
cinco tipos, terminología, familias, topologías y complementos.

[Representaciones y recorridos](clase06-representaciones.pdf){ target=_blank }
— la clase.

## Los dos grafos

$G_1$ tiene siete vértices y las aristas
$\{0,1\}, \{0,4\}, \{0,5\}, \{1,2\}, \{1,3\}, \{1,4\}, \{2,5\}$, no dirigidas.
El vértice $6$ queda aislado.

$G_2$ tiene siete vértices y las aristas dirigidas
$(0,1), (0,2), (1,3), (2,1), (2,4), (3,5), (4,3), (4,5), (6,2)$. Al $6$ no
llega ninguna.

Los vértices se numeran desde cero. Los enunciados suelen numerar de $1$ a
$n$ y Python indexa desde $0$: se corren los índices al leer, una sola vez.

## Las cuatro representaciones

### Lista de adyacencia

**Definición** (CLRS, Sección 22.1, p. 589). El grafo se representa como una
lista $G$ de listas, donde $G[u]$ contiene los vértices adyacentes a $u$.

```python
G1 = [[1, 4, 5],     # 0
      [0, 2, 3, 4],  # 1
      [1, 5],        # 2
      [1],           # 3
      [0, 1],        # 4
      [0, 2],        # 5
      []]            # 6
```

Una entrada por vértice y, dentro de ellas, una por cada extremo de cada
arista. En el grafo no dirigido cada arista aparece dos veces y en el dirigido
una sola, de modo que el espacio es $\Theta(V + E)$ en los dos casos.

### Matriz de adyacencia

**Definición** (CLRS, Sección 22.1, p. 589). Una matriz $m$ de
$|V| \times |V|$ donde $m_{uv}$ vale $1$ si existe la arista de $u$ a $v$, y
$0$ si no. En el grafo no dirigido la matriz es simétrica.

Ocupa $\Theta(V^2)$, sin importar cuántas aristas haya. La fila del vértice
$6$ son siete ceros y ocupa lo mismo que cualquier otra.

### Lista de aristas

Una lista cuyos elementos son las aristas. Ocupa $\Theta(E)$ y es la más
parecida a como llega la entrada de un problema: casi siempre hay que
convertirla antes de trabajar.

### Matriz de incidencia

Una matriz de $|V| \times |E|$ donde la posición $(i, j)$ vale $1$ si la
arista $j$ toca al vértice $i$. La suma de la fila $i$ es el grado de $i$, y
la columna de una arista tiene exactamente dos unos. Ocupa $\Theta(V \cdot E)$
y aparece cuando la matriz misma es el dato de entrada del problema.

En un grafo dirigido hay que distinguir por dónde entra y por dónde sale la
arista, así que la celda vale $-1$ si la arista $j$ sale del vértice $i$ y
$1$ si entra (CLRS, Ejercicio 22.1-7). Cada columna queda con un $-1$ y un
$1$, de modo que suma cero, y la suma de la fila $i$ es el grado de entrada
de $i$ menos su grado de salida.

Las dos matrices se cruzan en $E = V$: $G_1$ tiene siete vértices y siete
aristas, y las dos ocupan $49$ posiciones. De ahí en adelante la de incidencia
crece más rápido, y como casi todo grafo útil tiene más aristas que vértices,
en la práctica es la más grande de las cuatro.

### Construir las tres desde la lista de aristas

La entrada de un problema casi siempre trae $n$ y la lista de aristas. Las
tres construcciones recorren esa lista una vez; la del grafo no dirigido
escribe cada arista en los dos sentidos.

```python
def lista_de_adyacencia(n, aristas, dirigido):
    # G[u] guarda los vecinos de u: una lista por vertice
    G = []
    u = 0
    while u < n:
        G.append([])
        u = u + 1
    for arista in aristas:
        u = arista[0]
        v = arista[1]
        G[u].append(v)
        if not dirigido:
            G[v].append(u)
    return G


def matriz_de_adyacencia(n, aristas, dirigido):
    # m[u][v] vale 1 si la arista existe y 0 si no existe
    m = []
    u = 0
    while u < n:
        fila = []
        v = 0
        while v < n:
            fila.append(0)
            v = v + 1
        m.append(fila)
        u = u + 1
    for arista in aristas:
        u = arista[0]
        v = arista[1]
        m[u][v] = 1
        if not dirigido:
            m[v][u] = 1
    return m


def lista_de_aristas(n, aristas, dirigido):
    # El grafo es la lista de sus aristas; sin direccion se guarda el par al reves
    E = []
    for arista in aristas:
        u = arista[0]
        v = arista[1]
        E.append((u, v))
        if not dirigido:
            E.append((v, u))
    return E
```

La lista de adyacencia y la de aristas cuestan $\Theta(V + E)$: crear las $V$
listas vacías y recorrer las $E$ aristas. La matriz cuesta $\Theta(V^2)$ y no
puede costar menos, porque hay que escribir el cero en cada posición que no es
arista antes de poner los unos.

## Cuál conviene

### La memoria

| Representación | Espacio |
|---|---|
| Lista de adyacencia | $\Theta(V+E)$ |
| Matriz de adyacencia | $\Theta(V^2)$ |
| Lista de aristas | $\Theta(E)$ |

Una red de $V = 10^5$ vértices y $E = 2 \cdot 10^5$ aristas: la lista de
adyacencia guarda $4 \cdot 10^5$ entradas; la matriz guarda $10^{10}$
posiciones, de las cuales el 99,9998 % son ceros. La matriz no cabe en
memoria.

Un grafo es **denso** cuando $E$ se acerca a $V^2$ y **ralo** cuando $E$ es
del orden de $V$. Las redes viales, las sociales y casi todo lo que llega de
un problema real son ralos.

### El acceso

| | Lista de ady. | Matriz de ady. | Lista de aristas |
|---|---|---|---|
| Espacio | $\Theta(V+E)$ | $\Theta(V^2)$ | $\Theta(E)$ |
| ¿Existe $(u,v)$? | $O(\delta(u))$ | $O(1)$ | $O(E)$ |
| Vecinos de $u$ | $\Theta(\delta(u))$ | $\Theta(V)$ | $\Theta(E)$ |
| Recorrer todo | $\Theta(V+E)$ | $\Theta(V^2)$ | $\Theta(V \cdot E)$ |
| Agregar arista | $O(1)$ | $O(1)$ | $O(1)$ |

Si el grafo es ralo, lista de adyacencia. La matriz se justifica cuando $V$ es
pequeño, cuando el grafo es denso, o cuando el algoritmo hace muchas consultas
de adyacencia sueltas y ningún recorrido.

Pasar de lista de aristas a lista de adyacencia cuesta $\Theta(V+E)$, una sola
pasada. Si el algoritmo va a hacer más trabajo que eso, conviene construir la
representación que le sirve en lugar de forzarlo sobre la que llegó.

## Recorrer un grafo

Una lista se recorre del primero al último; una pila y una cola se vacían
sacando de a uno. Un grafo no trae orden: no hay primero ni último. Se puede
empezar por cualquier vértice, y el arranque cambia el orden de visita, no el
conjunto de vértices que se alcanzan.

**Definición (camino).** Sea $G = (V, E)$ un grafo. Un camino de $u$ a $v$ es
una secuencia de vértices $u = x_0, x_1, \ldots, x_k = v$ tal que
$(x_{i-1}, x_i) \in E$ para todo $i$ con $1 \leq i \leq k$. El número $k$ de
aristas es su longitud.

**Definición (alcanzable).** $v$ es alcanzable desde $u$ si existe un camino
de $u$ a $v$. Todo vértice es alcanzable desde sí mismo por el camino de
longitud $0$.

Dado $s \in V$, un recorrido visita exactamente el conjunto de vértices
alcanzables desde $s$, cada uno una sola vez. En un grafo no dirigido la
relación es simétrica; en uno dirigido no, y por eso al $6$ de $G_2$ no se
llega desde el $0$ aunque exista la arista $(6,2)$.

Hay tres cosas que decidir. Dónde empezar: cualquier vértice sirve. Qué hacer
con los repetidos: a un vértice se puede llegar por varios caminos y hay
ciclos, así que sin una marca de visitado el recorrido no termina. Y por cuál
vecino seguir: ahí se separan los dos recorridos.

Cada vértice se marca la primera vez que se toca y no se vuelve a entrar en
él. Como hay $V$ vértices y cada uno se marca una sola vez, el recorrido no
puede dar vueltas para siempre.

## Búsqueda en profundidad

Desde el vértice actual se toma el primer vecino sin visitar y se sigue por
él, sin mirar los demás. Cuando ya no queda ninguno sin visitar, se devuelve
al vértice anterior y prueba con el siguiente de los suyos.

### El algoritmo

$DFS(G)$:

1. Para cada nodo $v$ de $G$:
    1. Marcar $v$ como no visitado
2. Para cada nodo $v$ de $G$:
    1. Si $v$ no ha sido visitado ejecutar $DFSAux(v)$

$DFSAux(v)$:

1. Marcar $v$ como visitado
2. Agregar $v$ al orden de visita
3. Para cada nodo $u$ adyacente a $v$:
    1. Si $u$ no ha sido visitado ejecutar $DFSAux(u)$

El paso 2 de $DFS$ es el ciclo externo, el que no deja a nadie por fuera.
$DFSAux$ es el recorrido propiamente dicho, y es recursivo: la pila de
llamadas guarda el camino de vuelta.

### Sobre $G_1$, a mano

| Paso | En | Vecinos | Qué hace |
|---|---|---|---|
| 1 | 0 | 1, 4, 5 | 1 sin visitar: baja a 1 |
| 2 | 1 | 0, 2, 3, 4 | 0 visitado; 2 no: baja a 2 |
| 3 | 2 | 1, 5 | 1 visitado; 5 no: baja a 5 |
| 4 | 5 | 0, 2 | los dos visitados: vuelve a 2 |
| 5 | 2 | — | no le quedan: vuelve a 1 |
| 6 | 1 | 3, 4 | 3 sin visitar: baja a 3 |
| 7 | 3 | 1 | visitado: vuelve a 1 |
| 8 | 1 | 4 | 4 sin visitar: baja a 4 |
| 9 | 4 | 0, 1 | visitados: vuelve |

Orden: $0, 1, 2, 5, 3, 4$. El $6$ no aparece.

Sobre $G_2$ el orden es $0, 1, 3, 5, 2, 4$, y el $6$ queda por fuera por otra
razón: existe la arista $(6,2)$, pero ninguna entra al $6$.

### El código

```python
def dfs(G, u, visitado, orden):
    # Marca u, lo anota y sigue por el primer vecino que falte
    visitado[u] = True
    orden.append(u)
    for v in G[u]:
        if not visitado[v]:
            dfs(G, v, visitado, orden)


def dfs_completo(G):
    # Al agotar lo alcanzable, arranca en el primer vertice sin visitar
    n = len(G)
    visitado = [False] * n
    orden = []
    u = 0
    while u < n:
        if not visitado[u]:
            dfs(G, u, visitado, orden)
        u = u + 1
    return orden
```

La marca se pone al entrar, no al salir: si se pusiera al salir, un ciclo
haría que el mismo vértice se visitara dos veces. El `for` recorre los vecinos
en el orden en que estén guardados, y ese orden decide la traza.

Cuidado con `[[]] * n`: deja $n$ referencias a la misma lista. `[False] * n`
está bien, porque los booleanos no se modifican.

La misma idea sin recursión usa una pila explícita, apilando los vecinos al
revés para que el primero de la lista salga primero, y poniendo la marca al
sacar y no al apilar.

## Búsqueda en amplitud

Primero el vértice de arranque, después todos sus vecinos, después los vecinos
de esos que no se hayan visto. El recorrido avanza por capas y no entra a la
siguiente hasta terminar la actual. Donde la profundidad usa una pila, la
amplitud usa una cola: ese cambio de estructura es la única diferencia entre
los dos algoritmos.

### El algoritmo

$BFS(G, s)$:

1. Para cada nodo $v$ de $G$:
    1. Hacer $v.distancia = \infty$ y $v.padre = NIL$
2. Hacer $s.distancia = 0$
3. Agregar $s$ a la cola $P$
4. Mientras la cola $P$ no esté vacía:
    1. Retirar el frente $w$ de la cola $P$
    2. Agregar $w$ al orden de visita
    3. Para cada nodo $u$ adyacente a $w$:
        1. Si $u.distancia = \infty$: hacer $u.distancia = w.distancia + 1$,
           $u.padre = w$, y agregar $u$ a la cola $P$

La distancia hace de marca: $u.distancia = \infty$ dice que $u$ no se ha
visto. Y la marca se pone al encolar, no al retirar.

### Sobre $G_1$, a mano

| Paso | Sale | Vecinos nuevos | Cola después |
|---|---|---|---|
| 1 | 0 | 1, 4, 5 a distancia 1 | 1, 4, 5 |
| 2 | 1 | 2, 3 a distancia 2 | 4, 5, 2, 3 |
| 3 | 4 | — | 5, 2, 3 |
| 4 | 5 | — | 2, 3 |
| 5 | 2 | — | 3 |
| 6 | 3 | — | vacía |

Orden: $0, 1, 4, 5, 2, 3$. Distancias desde el $0$: $d(0)=0$;
$d(1)=d(4)=d(5)=1$; $d(2)=d(3)=2$; y $d(6)$ no existe.

El mismo grafo y el mismo arranque dan dos órdenes distintos —$0,1,2,5,3,4$
en profundidad contra $0,1,4,5,2,3$ en amplitud— y dos árboles distintos.

### Lo que garantiza

**Teorema** (correctitud de la búsqueda en amplitud, CLRS Teorema 22.5,
p. 600). Sea $G = (V, E)$ un grafo dirigido o no dirigido y sea $s \in V$. Al
terminar $BFS(G, s)$, para todo $v \in V$ se tiene
$v.distancia = \delta(s, v)$, donde $\delta(s, v)$ es la longitud del camino
más corto de $s$ a $v$, e $\infty$ si $v$ no es alcanzable desde $s$.

Sale de que la cola nunca guarda vértices de más de dos capas consecutivas: si
el frente está en la capa $k$, todo lo que queda está en la capa $k$ o en la
$k+1$. Las capas salen entonces en orden, y un vértice recibe su distancia la
primera vez que alguien lo toca, que es por el camino más corto.

Vale porque todas las aristas cuestan lo mismo. Si llevaran pesos distintos,
la primera vez que se toca un vértice ya no sería por el camino más barato y
el teorema sería falso.

### El código

```python
from collections import deque

def bfs(G, inicio):
    # distancia[v] == -1 significa que v no se ha visto
    n = len(G)
    distancia = [-1] * n
    padre = [-1] * n
    orden = []
    distancia[inicio] = 0
    cola = deque()
    cola.append(inicio)
    while len(cola) > 0:
        u = cola.popleft()
        orden.append(u)
        for v in G[u]:
            if distancia[v] == -1:
                distancia[v] = distancia[u] + 1
                padre[v] = u
                cola.append(v)
    return (orden, distancia, padre)
```

Con `padre` se reconstruye el camino subiendo desde el destino y después
invirtiendo la lista. Cada vértice guarda de dónde se llegó a él, no hacia
dónde va.

## El costo

**Teorema.** Recorrer un grafo $G = (V, E)$ en profundidad o en amplitud,
guardado como lista de adyacencia, cuesta $\Theta(V + E)$.

*Demostración.* Se procede contando por separado lo que aporta cada vértice y
lo que aporta cada arista.

Cada vértice se marca una sola vez, porque antes de entrar en él se pregunta
por la marca. Entrar, marcar y anotar cuesta $\Theta(1)$, y hay $V$ vértices:
en total $\Theta(V)$.

Estando en $u$ se recorre su lista de vecinos, que tiene $\delta(u)$ entradas.
Como cada vértice se visita una vez, esa lista se recorre una vez, y la suma
sobre todos los vértices es $\sum_{u \in V} \delta(u) = 2|E|$ en el grafo no
dirigido y $|E|$ en el dirigido: en los dos casos $\Theta(E)$.

Sumando las dos partes, el costo total es $\Theta(V + E)$. Por lo tanto, se
puede concluir que ambos recorridos cuestan $\Theta(V+E)$ sobre lista de
adyacencia. El $V$ no se puede quitar: hay que pasar por todos los vértices
aunque no tengan aristas, como el $6$. $\blacksquare$

Sobre matriz de adyacencia el recorrido cuesta $\Theta(V^2)$, porque preguntar
por los vecinos de $u$ obliga a recorrer la fila entera. Sobre lista de
aristas, $\Theta(V \cdot E)$.

Con $V = 10^5$ y $E = 2 \cdot 10^5$: la lista de adyacencia hace unas
$3 \cdot 10^5$ operaciones; la matriz, $10^{10}$; la lista de aristas,
$2 \cdot 10^{10}$. La primera corre en menos de un segundo y las otras dos no
terminan.

De ahí sale cuál conviene. La lista de adyacencia gana porque guarda juntos
los vecinos de cada vértice, que es justo lo que los recorridos preguntan. La matriz gana cuando la pregunta es otra:
¿existe esta arista?

## Errores comunes

Al construir el grafo: olvidar la arista de vuelta en un grafo no dirigido
—el programa corre, no falla, y contesta mal—; mezclar la numeración del
enunciado con la de Python; crear las listas con `[[]] * n`.

Al recorrer: no marcar los visitados; marcar en el momento equivocado —en
profundidad se marca al entrar, en amplitud al encolar—; quedarse con un solo
arranque cuando el problema pide recorrer todo el grafo; y recorrer sobre
matriz de adyacencia por costumbre, pasando de $\Theta(V+E)$ a $\Theta(V^2)$
sin darse cuenta.

## El código de la clase

- [recorridos.py](codigo/recorridos.py) — los dos recorridos, la versión con
  pila y la reconstrucción del camino, sobre los dos grafos de la clase.
- [representaciones.py](codigo/representaciones.py) — las tres construcciones
  y las dos consultas, comprobadas sobre todos los grafos de cuatro vértices.

## Ejercicios

Siete interactivos, uno por tema, y diez en papel: están en la
[página de ejercicios](./Ejercicios.md).

## Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, 3.ª ed. MIT
  Press, 2009. Secciones 22.1 (pp. 589–593), 22.2 (pp. 594–602) y 22.3
  (pp. 603–612).
- Rosen. *Discrete Mathematics and Its Applications*, 7.ª ed. McGraw-Hill,
  2012. Capítulo 10.
- van Steen. *Graph Theory and Complex Networks: An Introduction*, 2010.
- Halim, Halim, Effendy. *Competitive Programming 4*. Lulu, 2020. Secciones
  2.4.1 y 4.2.
