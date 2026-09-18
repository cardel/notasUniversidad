# Grafos implícitos

**Viernes 18 de septiembre de 2026.**

Recorrer un grafo que nadie guardó. La cuadrícula de Jaimico y el café es el
primer caso; después, tres problemas de juez en línea con el método completo:
entrada y salida, qué es el grafo, el algoritmo, el código y el costo.

## Diapositivas

[Grafos implícitos](clase07-implicitos.pdf){ target=_blank } — 67 láminas.

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

## Jaimico y el café

Un laberinto de $n$ filas y $m$ columnas guardado en una matriz $M$:
$M[i][j]$ vale $0$ si la celda está libre, $1$ donde está Jaimico, $2$ si es
pared y $3$ donde está el café. En cada paso Jaimico se mueve a una celda
contigua que no sea pared. ¿Puede llegar al café? Y si puede, ¿en cuántos
pasos como mínimo?

```
1 0 0 2 0 0 0 0
0 2 0 2 0 2 2 0
0 2 0 0 0 2 0 0
0 2 2 2 2 0 2 0
0 0 0 0 0 0 2 3
```

**Definición (grafo implícito).** Un grafo cuyos vértices y aristas no están
guardados en ninguna estructura: hay una regla que dice qué es un vértice y
una regla que, dado un vértice, produce sus vecinos. El recorrido llama a esa
regla cada vez que necesita la lista de adyacencia de alguien.

En el laberinto los vértices son las celdas $(r, c)$ con $M[r][c] \neq 2$; las
aristas, los pares de celdas contiguas que no son pared; y los vecinos de
$(r, c)$ se obtienen sumando los cuatro desplazamientos y descartando lo que
se sale de la matriz o cae en pared. No se construye porque no hace falta: la
lista de adyacencia de un laberinto de $500 \times 500$ tendría $250\,000$
listas, todas deducibles de una suma.

### El primer intento

```python
def dfsAuxIngenuo(rJ, cJ, rC, cC, M, vis):
    # Primer intento: un if por direccion
    vis[rJ][cJ] = True
    ans = rJ == rC and cJ == cC
    if not ans and rJ - 1 >= 0 and not vis[rJ - 1][cJ] and M[rJ - 1][cJ] != 2:
        ans = dfsAuxIngenuo(rJ - 1, cJ, rC, cC, M, vis)
    if not ans and rJ + 1 < len(M) and not vis[rJ + 1][cJ] and M[rJ + 1][cJ] != 2:
        ans = dfsAuxIngenuo(rJ + 1, cJ, rC, cC, M, vis)
    if not ans and cJ - 1 >= 0 and not vis[rJ][cJ - 1] and M[rJ][cJ - 1] != 2:
        ans = dfsAuxIngenuo(rJ, cJ - 1, rC, cC, M, vis)
    if not ans and cJ + 1 < len(M[rJ]) and not vis[rJ][cJ + 1] and M[rJ][cJ + 1] != 2:
        ans = dfsAuxIngenuo(rJ, cJ + 1, rC, cC, M, vis)
    return ans
```

Funciona, y cuesta mantenerlo: cuatro veces la misma comprobación con los
números cambiados. Para permitir diagonales habría que escribir cuatro `if`
más.

### La regla de los vecinos en una tabla

```python
dr = [0, -1, 0, 1]
dc = [-1, 0, 1, 0]


def dfsAux(rJ, cJ, rC, cC, M, vis):
    # True si desde (rJ, cJ) se llega al cafe; se detiene al encontrarlo
    vis[rJ][cJ] = True
    ans = rJ == rC and cJ == cC
    i = 0
    while i < 4 and not ans:
        nr = rJ + dr[i]
        nc = cJ + dc[i]
        if nr >= 0 and nr < len(M) and nc >= 0 and nc < len(M[nr]):
            if not vis[nr][nc] and M[nr][nc] != 2:
                ans = dfsAux(nr, nc, rC, cC, M, vis)
        i = i + 1
    return ans


def dfs(M):
    # Puede Jaimico llegar al cafe?
    n = len(M)
    m = len(M[0])
    jaimico = posicion_de(M, 1)
    cafe = posicion_de(M, 3)
    vis = tabla(n, m, False)
    return dfsAux(jaimico[0], jaimico[1], cafe[0], cafe[1], M, vis)
```

`dr[i]` y `dc[i]` son el $i$-ésimo movimiento: izquierda, arriba, derecha,
abajo. La condición `and not ans` detiene la búsqueda en cuanto el café
aparece. `posicion_de(M, valor)` devuelve la fila y la columna donde está el
valor y `tabla(n, m, valor)` arma una matriz llena de ese valor, creando una
lista nueva por fila.

### ¿En cuántos pasos? Amplitud

```python
def bfs(M):
    # Pasos minimos de Jaimico al cafe; -1 si no se llega
    n = len(M)
    m = len(M[0])
    jaimico = posicion_de(M, 1)
    cafe = posicion_de(M, 3)
    d = tabla(n, m, -1)
    d[jaimico[0]][jaimico[1]] = 0
    cola = deque()
    cola.append(jaimico)
    while len(cola) > 0:
        actual = cola.popleft()
        r = actual[0]
        c = actual[1]
        i = 0
        while i < 4:
            nr = r + dr[i]
            nc = c + dc[i]
            if nr >= 0 and nr < n and nc >= 0 and nc < m:
                if M[nr][nc] != 2 and d[nr][nc] == -1:
                    d[nr][nc] = d[r][c] + 1
                    cola.append((nr, nc))
            i = i + 1
    return d[cafe[0]][cafe[1]]
```

Sobre el laberinto de arriba, `bfs(M)` deja el café a 15 pasos:

```
 0  1  2  #  8  9 10 11
 1  #  3  #  7  #  # 12
 2  #  4  5  6  # 14 13
 3  #  #  #  # 10  # 14
 4  5  6  7  8  9  # 15
```

El corredor de abajo llega hasta la celda marcada 10 y ahí se cierra: la
amplitud lo explora igual y lo descarta sola.

### Lo que cuesta

El grafo tiene a lo sumo $n \cdot m$ vértices y cada uno a lo sumo cuatro
aristas: $\Theta(n \cdot m)$. Un laberinto de $500 \times 500$ con un corredor
largo lleva la profundidad recursiva a $250\,000$ llamadas anidadas, y Python
se detiene mucho antes; sobre cuadrículas grandes, la amplitud con cola o la
profundidad con pila explícita son las versiones que corren.

## UVa 10977 — Enchanted Forest

Enunciado en <https://onlinejudge.org/external/109/10977.pdf>; envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1918>.

Un bosque de $R \times C$ intersecciones. Se entra por $(1,1)$ y se sale por
$(R,C)$, moviendo una unidad por paso. Hay $m$ posiciones bloqueadas y $n$
Jigglypuffs; cada uno, en $(x, y)$ con volumen $L$, hace peligrosa toda
posición a distancia $L$ o menos. Longitud del camino más corto que evite lo
bloqueado y lo peligroso, o `Impossible.`.

**Entrada:** varios casos; $R$ y $C$ ($1 \leq R, C \leq 200$), luego $m$ y
$m$ pares, luego $n$ ($0 \leq n \leq 100$) y $n$ triplas $x$, $y$, $L$.
Termina con $R = C = 0$.

**¿Entendimos el problema?** La muestra es $5 \times 5$ con cinco bloqueadas y
un Jigglypuff en $(4,3)$ con $L = 1$; la respuesta es 8. Lo que cambia respecto
a Jaimico no está en el recorrido sino en cómo se arma la matriz: las celdas
peligrosas no vienen listadas, se calculan con la distancia euclidiana
$(x-i)^2 + (y-j)^2 \leq L^2$.

```python
def marcar_peligro(mundo, R, C, x, y, L):
    # Bloquea las celdas a distancia euclidiana L o menos de (x, y)
    i = max(1, x - L)
    while i <= min(R, x + L):
        j = max(1, y - L)
        while j <= min(C, y + L):
            if (x - i) * (x - i) + (y - j) * (y - j) <= L * L:
                mundo[i][j] = -1
            j = j + 1
        i = i + 1


def salida_mas_corta(mundo, R, C):
    # Pasos minimos de (1, 1) a (R, C) por celdas con 0; -1 si no hay
    d = matriz(R, C, -1)
    cola = deque()
    if mundo[1][1] == 0:
        d[1][1] = 0
        cola.append((1, 1))
    while len(cola) > 0:
        actual = cola.popleft()
        r = actual[0]
        c = actual[1]
        k = 0
        while k < 4:
            nr = r + dr[k]
            nc = c + dc[k]
            if nr >= 1 and nr <= R and nc >= 1 and nc <= C:
                if mundo[nr][nc] == 0 and d[nr][nc] == -1:
                    d[nr][nc] = d[r][c] + 1
                    cola.append((nr, nc))
            k = k + 1
    return d[R][C]
```

Basta mirar el cuadrado de lado $2L+1$ centrado en cada Jigglypuff, recortado
al tablero. Aquí las filas y columnas van de $1$ a $R$ y de $1$ a $C$ como en
el enunciado; la posición $0$ de `mundo` no se usa. Si la propia $(1,1)$ es
peligrosa no se encola nada y sale `Impossible.` sin caso aparte. Costo:
$\Theta(R \cdot C + n \cdot L^2)$ para armar el mundo y $\Theta(R \cdot C)$
para recorrerlo.

## UVa 627 — The Net

Enunciado en <https://onlinejudge.org/external/6/627.pdf>; envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=568>.

Una red de a lo sumo 300 enrutadores. Cada uno tiene su lista de enrutadores
visibles, en orden ascendente. Por consulta —origen y destino— la ruta con
menos saltos; si hay varias, la de identificadores más bajos; si no hay,
`connection impossible`.

**Entrada:** varias redes. Cada una trae $n$, luego $n$ líneas como
`3-1,2,5,6`, luego el número de consultas y una línea por consulta.
**Salida:** por red, una línea con cinco guiones y una línea por consulta.

**¿Entendimos el problema?** En la primera red de la muestra la consulta
`1 6` responde `1 3 6`. Las listas de visibles no son simétricas: en la
segunda red `5-1` pero `1-2`, así que el grafo es dirigido y `5 9` da
`connection impossible` aunque el 9 sí vea al 5.

**El grafo.** Vértices, los enrutadores; aristas, de $u$ a cada visible,
dirigidas. Menos saltos es la distancia en aristas: amplitud desde el origen.
Como la ruta se necesita completa, cada enrutador guarda desde cuál se llegó
a él y la ruta se reconstruye subiendo por los predecesores.

$Ruta(G, s, t)$:

1. Hacer $s.pred = NIL$ y agregar $s$ a la cola $P$
2. Mientras $P$ no esté vacía y $t$ no tenga predecesor:
    1. Retirar el frente $w$ de $P$
    2. Para cada $u$ visible desde $w$, en orden ascendente: si $u$ no
       tiene predecesor, hacer $u.pred = w$ y agregar $u$ a $P$
3. Si $t$ no tiene predecesor, no hay ruta; si no, subir por los
   predecesores desde $t$ hasta $s$ e invertir

Las listas vienen ascendentes y la primera vez que se descubre un enrutador
queda fijado su predecesor. Por capas, los enrutadores salen de la cola en el
orden de sus rutas, así que la primera ruta que llega a cada uno es la menor
de su largo.

```python
def ruta(grafo, inicio, destino):
    # Lista de enrutadores de inicio a destino, o [] si no hay conexion
    pred = {}
    pred[inicio] = -1
    cola = deque()
    cola.append(inicio)
    while len(cola) > 0 and destino not in pred:
        u = cola.popleft()
        for v in grafo[u]:
            if v not in pred:
                pred[v] = u
                cola.append(v)
    camino = []
    if destino in pred:
        v = destino
        while v != -1:
            camino.append(v)
            v = pred[v]
        camino.reverse()
    return camino
```

`pred` es un diccionario que hace de marca y de predecesor a la vez, y la
condición del `while` detiene la amplitud en cuanto el destino tiene
predecesor. Costo por consulta: $\Theta(V + E)$ con $V \leq 300$ y
$E \leq 300 \cdot 50$. Lo delicado es leer la red: partir cada línea por el
guion y después por las comas, aceptando la lista vacía de `2-`.

## UVa 11749 — Poor Trade Advisor

Enunciado en <https://onlinejudge.org/external/117/11749.pdf>; envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2849>.

$n$ ciudades y $m$ carreteras bidireccionales, cada una con una ganancia anual
(PPA). Una provincia es un conjunto conexo y no vacío de carreteras con sus
ciudades, y tiene que tener la mayor PPA promedio posible. ¿Cuántas ciudades
puede tener, como máximo?

**Entrada:** varios casos con $n$ ($1 < n \leq 500$) y $m$
($1 \leq m \leq 10^6$) y $m$ líneas con los extremos y la PPA; termina con
$n = m = 0$.

**¿Entendimos el problema?** En el primer caso de la muestra el promedio más
alto es 100 y solo se consigue con carreteras de PPA 100: meter una de PPA 1
baja el promedio. Con las de 100 quedan conectadas 1, 2 y 3: tres ciudades.

**La idea.** El promedio de un conjunto nunca supera a su elemento más grande
y lo iguala solo cuando todos son ese máximo. La provincia usa únicamente
carreteras de PPA máxima, y la pregunta se vuelve: en el grafo con solo esas
carreteras, ¿cuál es el componente conexo más grande?

```python
def ppa_maxima(aristas):
    # La mayor PPA entre todas las carreteras
    mayor = aristas[0][2]
    for arista in aristas:
        if arista[2] > mayor:
            mayor = arista[2]
    return mayor


def grafo_de_las_mejores(n, aristas, mayor):
    # Lista de adyacencia con solo las carreteras de PPA igual a mayor
    adj = []
    i = 0
    while i <= n:
        adj.append([])
        i = i + 1
    for arista in aristas:
        if arista[2] == mayor:
            adj[arista[0]].append(arista[1])
            adj[arista[1]].append(arista[0])
    return adj


def tamano_desde(adj, s, visitado):
    # Cuenta las ciudades del componente de s
    total = 0
    visitado[s] = True
    pila = [s]
    while len(pila) > 0:
        u = pila.pop()
        total = total + 1
        for v in adj[u]:
            if not visitado[v]:
                visitado[v] = True
                pila.append(v)
    return total


def provincia_mas_grande(n, aristas):
    # aristas: lista de (u, v, ppa); el componente mas grande del grafo
    # que queda con solo las carreteras de PPA maxima
    adj = grafo_de_las_mejores(n, aristas, ppa_maxima(aristas))
    visitado = [False] * (n + 1)
    mejor = 0
    u = 1
    while u <= n:
        if not visitado[u]:
            t = tamano_desde(adj, u, visitado)
            if t > mejor:
                mejor = t
        u = u + 1
    return mejor
```

`tamano_desde` es el mismo recorrido con la pila de llamadas en lugar de la
lista:

```python
def tamano_desde(adj, u, visitado):
    # La misma cuenta, con la pila de llamadas en lugar de la lista
    visitado[u] = True
    total = 1
    for v in adj[u]:
        if not visitado[v]:
            total = total + tamano_desde(adj, v, visitado)
    return total
```

Es el $DFSAux$ de los recorridos con un contador: cada llamado devuelve
cuántas ciudades tocó, y el de `u` suma las de sus vecinos nuevos más él
mismo. Lo que en la otra versión guardaba `pila` aquí lo guarda la pila de
llamadas: cada `tamano_desde` que espera a que vuelva el suyo es un vértice
apilado. Las dos marcan, cuentan y devuelven lo mismo; la diferencia está en
dónde queda lo pendiente. Una cadena de $n$ ciudades apila $n$ llamados y
Python corta cerca de los mil, así que para $n$ grande se envía la de la
lista. La recursiva es la que se escribe primero, porque es la que ya se sabe.

El `while` sobre `u` es el $DFS(G)$ completo: cada ciudad sin marcar arranca un
recorrido, y ese recorrido es un componente. Costo: $\Theta(m)$ para hallar
el máximo y armar el grafo, $\Theta(n + m)$ el recorrido. Con $m$ hasta un
millón lo que pesa es leer la entrada: se lee todo de una vez y se parte por
espacios.

## Errores comunes

Sobre cuadrículas: salirse del tablero —en Python un índice negativo no
falla, lee desde el final—, confundir fila con columna o la numeración desde
1 con la desde 0, usar profundidad recursiva sobre una cuadrícula grande, y
buscar la distancia mínima con profundidad.

Sobre rutas y componentes: tratar como no dirigido un grafo que el enunciado
da dirigido, reconstruir la ruta sin invertirla, olvidar el ciclo externo
cuando la pregunta es por todos los componentes, y leer un millón de líneas
con `input()`.

## El código de la clase

- [jaimico.py](codigo/jaimico.py) — las dos versiones de `dfsAux`, `dfs` y
  `bfs` sobre el laberinto de la clase.
- [forest.py](codigo/forest.py) — UVa 10977.
- [net.py](codigo/net.py) — UVa 627.
- [advisor.py](codigo/advisor.py) — UVa 11749, con `tamano_desde` en sus dos
  versiones, con pila y recursiva.

## Ejercicios

Seis interactivos, siete en papel y cinco para programar: están en la
[página de ejercicios](./Ejercicios.md).

## Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, 3.ª ed. MIT
  Press, 2009. Secciones 22.2 (pp. 594–602) y 22.3 (pp. 603–612).
- Halim, Halim, Effendy. *Competitive Programming 4*. Lulu, 2020. Sección 4.2
  y su tratamiento de las cuadrículas como grafos implícitos.
- Universidad de Valladolid Online Judge: problemas 627, 10977 y 11749.
  <https://onlinejudge.org>
