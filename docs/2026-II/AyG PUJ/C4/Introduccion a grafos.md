# Introducción a los grafos

**Grupo A — viernes 4 de septiembre de 2026.**

Hasta aquí los datos venían acostados en una línea: un arreglo que se
parte por la mitad, un intervalo que se cierra, una función que se
recorre de izquierda a derecha. Esta clase rompe esa forma. Cuando lo que
importa no es el orden de los elementos sino qué par de ellos está unido,
ninguna estructura lineal alcanza, y aparece la que sostiene el resto del
curso.

## Diapositivas

![](clase04-grafos.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## De las estructuras lineales a los grafos

### Tres nombres que conviene separar

Una **estructura de datos** determina la forma en que se representa y se
organiza la información. Un **tipo de dato** es la representación
particular de un conjunto de valores, con sus valores posibles y sus
operaciones. Un **tipo abstracto de dato** define un conjunto de valores,
sus operaciones y sus propiedades, sin comprometerse con ninguna
implementación.

La distinción sirve hoy. Una cola es un tipo abstracto: encolar,
desencolar, mirar el frente. Que por debajo sea un arreglo circular o una
lista enlazada no cambia lo que la cola promete. Un grafo también va a
ser un tipo abstracto, y va a tener tres implementaciones distintas.

### Lo que ofrece cada estructura lineal

| Estructura | Operación | Costo |
|---|---|---|
| Arreglo, lista nativa | acceso por índice | $O(1)$ |
| Lista enlazada | insertar o borrar al frente | $O(1)$ |
| Pila | apilar, desapilar | $O(1)$ |
| Cola | encolar, desencolar | $O(1)$ |
| Mapa | consultar por llave | $O(1)$ promedio |
| Conjunto | pertenencia | $O(1)$ promedio |

Todas ordenan los datos uno detrás de otro, o los indexan por una llave.
Contestan «¿cuál sigue?» y «¿está este valor?». Ninguna contesta «¿quién
está conectado con quién?».

### Dónde se rompen

Las jerarquías —laborales, sociales, económicas, políticas— tienen
elementos con otros encima y debajo, y no siempre uno solo. Las
conexiones —redes sociales, redes eléctricas, redes viales— no tienen
principio ni fin: lo que importa es qué par de elementos está unido.

Quedan dos preguntas abiertas: ¿es posible representar estos datos con
las estructuras anteriores?, ¿hay algún tipo abstracto de dato debajo de
esta información?

### El intento con lo que ya tenemos

Suponga cinco personas: Ana y Beto son amigos; Ana y Carlos también; Beto
y Diana; Elena no conoce a nadie.

```python
personas = ["Ana", "Beto", "Carlos", "Diana", "Elena"]
```

La lista guarda quiénes son, y ahí se detiene. La amistad es una relación
entre dos, y en la lista no cabe. El segundo intento sí la guarda:

```python
amigos = {"Ana": ["Beto", "Carlos"], "Beto": ["Ana", "Diana"],
          "Carlos": ["Ana"], "Diana": ["Beto"], "Elena": []}
```

Y está hecho con las estructuras de siempre. Lo que falta no es la
implementación: falta nombrar la estructura, definir sus operaciones y
saber qué cuesta cada una. Ese diccionario de listas ya es una lista de
adyacencia, solo que todavía sin nombre.

## Qué es un grafo

### Los puentes de Königsberg

La ciudad estaba partida por el río Pregel, que formaba dos islas unidas
entre sí y con las orillas por siete puentes. Sus habitantes preguntaban
si se podía salir de cualquier punto, cruzar cada puente exactamente una
vez y volver al punto de partida. Euler demostró en 1736 que ese
recorrido no existe, y su argumento no usa distancias ni formas: solo
cuántos puentes llegan a cada región. Ese descarte de todo lo demás es lo
que queda cuando uno se queda con el grafo.

### La definición

> **Definición (grafo, CLRS Apéndice B.4, p. 1168).** Un grafo $G$ es una
> pareja $(V, E)$ donde $V = \{v_1, \ldots, v_n\}$ es un conjunto de nodos
> o vértices, y $E = \{(a_1,b_1), \ldots, (a_m,b_m)\}$ es un conjunto de
> arcos o aristas entre elementos de $V$, con $a_i \in V$ y $b_i \in V$
> para todo $i$.

Por ejemplo, $V = \{1,2,3,4,5,6,7\}$ con
$E = \{\{1,2\},\{1,5\},\{2,5\},\{3,4\},\{5,7\}\}$. El vértice 6 no tiene
aristas y sigue siendo parte del grafo.

El grafo $(\emptyset, \emptyset)$ se escribe $\emptyset$. El número de
vértices de $G$ es su **orden**, denotado $|G|$, y un grafo de orden 0 o
1 se llama **trivial**.

### Los cinco tipos

Un **grafo simple** cumple tres condiciones: cada arista conecta dos
vértices diferentes, no hay aristas paralelas y no hay bucles. Los demás
tipos se definen relajando alguna de las tres.

| Tipo | Aristas | Paralelas | Bucles |
|---|---|---|---|
| Grafo simple | no dirigidas | no | no |
| Multigrafo | no dirigidas | sí | no |
| Pseudografo | no dirigidas | sí | sí |
| Grafo dirigido | dirigidas | no | sí |
| Multigrafo dirigido | dirigidas | sí | sí |

En un grafo **no dirigido**, $E \subseteq V \times V$ es simétrica: si
$(u,v) \in E$ entonces $(v,u) \in E$. En un grafo **dirigido**,
$E \subseteq V \times V$ sin esa condición, y cada $(a,b) \in E$ es un
arco que va de $a$ hacia $b$. Que exista el arco de $u$ a $v$ no dice
nada sobre el arco de $v$ a $u$.

Casi todo lo que viene en el curso trabaja sobre grafos simples y sobre
grafos dirigidos. Los otros tres aparecen cuando el problema los impone,
como los siete puentes.

### Grafos con peso

> **Definición.** Un grafo dirigido con peso es un grafo $G = (V,E)$ con
> una función de peso $f: E \rightarrow \mathbb{R}$.

El peso no tiene por qué ser una distancia: puede ser tiempo, costo,
capacidad o probabilidad. Y puede ser negativo, lo que más adelante va a
decidir cuál algoritmo de caminos más cortos sirve.

### Dónde aparecen

En una red social cada persona es un vértice y cada amistad una arista,
sin dirección si la amistad es mutua y con dirección si es un «sigue a».
En las rutas del MIO las estaciones son vértices y los tramos son
aristas. En una red de comunicaciones los nodos son equipos y las aristas
los enlaces, con el peso como latencia o capacidad. En un árbol
genealógico las aristas van de padre a hijo.

Un algoritmo escrito sobre grafos sirve para los cuatro casos. La ruta
más corta entre dos estaciones del MIO y el grado de separación entre dos
personas son el mismo problema.

## Terminología

### Adyacencia, incidencia y vecindad

Dos vértices $u$ y $v$ de un grafo no dirigido son **adyacentes**, o
vecinos, si $\{u,v\}$ es una arista. Si $e = \{u,v\}$, la arista $e$ es
**incidente** con $u$ y con $v$, que son sus extremos; dos aristas son
adyacentes si comparten un vértice. La **vecindad** de $x$, denotada
$N(x)$, es el conjunto de todos los vértices adyacentes a $x$.

En el grafo de siete vértices de arriba, $N(5) = \{1,2,7\}$,
$N(3) = \{4\}$ y $N(6) = \emptyset$.

### Grado

El **grado** de un vértice $v$ en un grafo no dirigido es el número de
aristas incidentes con él, denotado $\delta(v)$. Los bucles cuentan dos
veces, porque tocan al vértice por sus dos extremos. Un vértice de grado
0 es **aislado**; uno de grado 1 es **colgante**.

| $v$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| $\delta(v)$ | 2 | 2 | 1 | 1 | 3 | 0 | 1 |

### El teorema del apretón de manos

> **Teorema (CLRS Ejercicio B.4-1).** Sea $G = (V,E)$ un grafo no dirigido
> con $e$ aristas. Entonces $2e = \sum_{v \in V} \delta(v)$.

**Demostración.** Se procede de forma directa, contando el mismo objeto de
dos maneras. Un par (arista, extremo suyo) se puede contar recorriendo las
aristas, y cada arista aporta exactamente 2 de esos pares, uno por cada
extremo; el total es $2e$. El mismo par se puede contar recorriendo los
vértices, y cada vértice $v$ aporta $\delta(v)$ pares, uno por cada arista
incidente con él; el total es $\sum_{v \in V} \delta(v)$. Como los dos
conteos cuentan lo mismo, las dos cantidades son iguales. Por lo tanto, se
puede concluir que $2e = \sum_{v \in V} \delta(v)$. $\blacksquare$

Sirve para contar sin dibujar: un grafo de 10 vértices, todos de grado 6,
tiene $2e = 60$, luego $e = 30$. Y sirve para descartar: un grafo simple
de 15 vértices, todos de grado 5, daría $2e = 75$, que es impar. No
existe, y no hubo que intentar dibujarlo.

> **Corolario.** Todo grafo no dirigido tiene un número par de vértices de
> grado impar.

**Demostración.** Se procede de forma directa. Sea $V_1$ el conjunto de
vértices de grado par y $V_2$ el de grado impar. Entonces

$$2e = \sum_{v \in V} \delta(v) = \sum_{v \in V_1} \delta(v) + \sum_{v \in V_2} \delta(v).$$

El lado izquierdo es par por ser $2e$, y $\sum_{v \in V_1} \delta(v)$ es
par por ser suma de números pares. Al despejar,
$\sum_{v \in V_2} \delta(v)$ es diferencia de dos pares, luego es par.
Cada sumando de esa suma es impar, y una suma de impares es par
únicamente cuando hay un número par de sumandos. Por lo tanto, se puede
concluir que $|V_2|$ es par. $\blacksquare$

### Grados en grafos dirigidos

En un grafo dirigido, el **grado de entrada** $\delta^-(v)$ cuenta los
arcos que tienen a $v$ como vértice final, y el **grado de salida**
$\delta^+(v)$ los que lo tienen como vértice inicial.

> **Teorema.** Sea $G = (V,E)$ un grafo dirigido. Entonces
> $\sum_{v \in V} \delta^-(v) = \sum_{v \in V} \delta^+(v) = |E|$.

**Demostración.** Se procede de forma directa. Cada arco $(u,v)$ tiene
exactamente un vértice inicial y exactamente uno final, de modo que aporta
1 a $\delta^+(u)$ y 1 a $\delta^-(v)$, y no aporta nada a los demás
vértices. Al sumar sobre todos los vértices, cada una de las dos sumas
cuenta cada arco una sola vez. Por lo tanto, se puede concluir que las dos
sumas valen $|E|$. $\blacksquare$

## Familias de grafos simples

El **grafo completo** $K_n$ tiene exactamente una arista entre cada par de
vértices distintos. Cada vértice tiene grado $n-1$, así que por el
apretón de manos $2e = n(n-1)$ y entonces $e = n(n-1)/2$. Es el grafo con
más aristas posible sobre $n$ vértices: cuando se dice que un algoritmo
cuesta $O(V^2)$ en el peor caso, el peor caso es este.

El **ciclo** $C_n$, con $n \geq 3$, tiene aristas
$\{v_1,v_2\}, \ldots, \{v_{n-1},v_n\}, \{v_n,v_1\}$; cada vértice tiene
grado 2 y hay $n$ aristas. La **rueda** $W_n$ agrega al ciclo un vértice
nuevo conectado con los $n$ del ciclo. El **bipartito completo**
$K_{m,n}$ parte los vértices en dos grupos, sin aristas dentro de cada
grupo y con todas las posibles entre ellos.

| Familia | Vértices | Aristas | Grado |
|---|---|---|---|
| $K_n$ | $n$ | $n(n-1)/2$ | $n-1$ |
| $C_n$ | $n$ | $n$ | 2 |
| $W_n$ | $n+1$ | $2n$ | no regular |
| $K_{m,n}$ | $m+n$ | $m \cdot n$ | regular solo si $m = n$ |

La **secuencia de grado** de $G$ es la lista de los grados de sus
vértices, ordenada de forma decreciente. La de $K_4$ es $3,3,3,3$; la de
$C_4$ es $2,2,2,2$; la de $W_4$ es $4,3,3,3,3$; la de $K_{2,3}$ es
$3,3,2,2,2$.

## Topologías y subgrafos

Las redes locales se modelan como grafos, y sus tres formas conocidas ya
tienen nombre en la teoría. La **estrella** es $K_{1,n}$: un nodo central
conectado con todos los demás, y si el central falla la red entera cae. El
**anillo** es $C_n$, y sobrevive a la caída de un enlace. La forma
**lineal** es el camino $P_n$, que aparece en arreglos de procesadores en
cómputo paralelo.

> **Definición (subgrafo, CLRS Apéndice B.4).** Si $G = (V,E)$ es un
> grafo, $G_1 = (V_1, E_1)$ es un subgrafo de $G$ si $V_1 \subseteq V$ y
> $E_1 \subseteq E$, con la condición de que las aristas de $E_1$ conecten
> vértices que estén en $V_1$.

Un subgrafo es **recubridor** si $V_1 = V$: conserva todos los vértices y
puede perder aristas. Para $W \subseteq V$, el subgrafo **inducido**
$\langle W \rangle$ tiene los vértices de $W$ y todas las aristas de $G$
con sus dos extremos en $W$, sin omitir ninguna.

Al quitar una arista $e$ queda $G - \{e\}$, con los mismos vértices; al
quitar un vértice $v$ queda $G - \{v\}$, que se lleva también todas las
aristas incidentes con $v$. Estas dos operaciones son la base del análisis
de conectividad y de la búsqueda de puntos de articulación.

## Grafos complementarios

El **complemento** $\overline{G}$ de un grafo simple no dirigido $G$ tiene
los mismos vértices, y dos de ellos son adyacentes en $\overline{G}$ si y
solo si no lo son en $G$. Si $G$ tiene $n$ vértices y $e$ aristas,
entonces $\overline{G}$ tiene $n(n-1)/2 - e$: las que le faltaban a $G$
para ser completo. El complemento de $K_n$ es el grafo de $n$ vértices sin
ninguna arista, llamado grafo nulo.

La **unión** de $G_1 = (V_1,E_1)$ y $G_2 = (V_2,E_2)$ es el grafo con
vértices $V_1 \cup V_2$ y aristas $E_1 \cup E_2$.

> **Teorema.** Si $G$ es un grafo simple de $n$ vértices, entonces
> $G \cup \overline{G} = K_n$.

**Demostración.** Se procede de forma directa. Tómese un par cualquiera de
vértices distintos $u$ y $v$. Por la definición de complemento, $\{u,v\}$
es arista de $G$ o es arista de $\overline{G}$, y nunca deja de estar en
las dos. Entonces $\{u,v\}$ pertenece a $E \cup \overline{E}$, que es el
conjunto de aristas de la unión. Como el par era cualquiera, la unión
tiene una arista entre cada par de vértices distintos. Por lo tanto, se
puede concluir que $G \cup \overline{G} = K_n$. $\blacksquare$

## Representaciones

### El grafo de trabajo

Las tres representaciones se escriben sobre el mismo grafo $G_1$, de
siete vértices y siete aristas, no dirigido:

$$\{0,1\},\ \{0,4\},\ \{0,5\},\ \{1,2\},\ \{1,3\},\ \{1,4\},\ \{2,5\}$$

El vértice 6 queda aislado. Los enunciados suelen numerar de 1 a $n$ y
Python indexa desde 0: se corren los índices al leer, una sola vez, y de
ahí en adelante todo el programa trabaja en $0..n-1$. Mezclar las dos
numeraciones es el error más frecuente al empezar con grafos.

### Lista de adyacencia

> **Definición (CLRS Sección 22.1, p. 589).** El grafo se representa como
> una lista $G$ de listas, donde $G[u]$ contiene los vértices adyacentes a
> $u$.

```python
G1 = [[4, 5, 1],     # 0
      [0, 2, 3, 4],  # 1
      [1, 5],        # 2
      [1],           # 3
      [0, 1],        # 4
      [0, 2],        # 5
      []]            # 6
```

Una entrada por vértice, y dentro de ellas una entrada por cada extremo de
cada arista. En el grafo no dirigido cada arista aparece dos veces, de
modo que el espacio es $\Theta(V + E)$.

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
```

Lo único que cambia entre dirigido y no dirigido es la línea que agrega el
par al revés. Sin ella, la arista solo se puede recorrer de $u$ hacia $v$.

### Cuando los vértices no son números

Los datos llegan con nombres —personas, estaciones, ciudades— y las listas
se indexan con enteros. Un mapa de nombre a índice resuelve la traducción
una sola vez:

```python
id = {"pepito": 0, "luisito": 1, "martita": 2,
      "juanito": 3, "maria": 4, "sofia": 5}

G = [[2, 3],     # pepito
     [0, 2, 4],  # luisito
     [0, 4, 5],  # martita
     [4, 5],     # juanito
     [1],        # maria
     [3]]        # sofia
```

También se puede usar un diccionario de listas,
`{"pepito": ["martita", "juanito"], ...}`. Se lee mejor y se paga con una
búsqueda por llave en cada acceso; el mapa a enteros deja el resto del
programa trabajando con índices.

### Con pesos

Para un grafo con peso hay dos formas de guardar la lista de adyacencia:
dos listas en paralelo, $G$ con los vecinos y $w$ con los pesos, de modo
que `w[u][i]` es el peso de la arista que va a `G[u][i]`; o una sola lista
de parejas, donde `G[u]` guarda `(vecino, peso)`.

### Matriz de adyacencia

> **Definición (CLRS Sección 22.1, p. 590).** El grafo se representa como
> una matriz $m$ de $n \times n$ donde $m_{ij}$ vale 1 si hay una arista
> entre $i$ y $j$, y 0 en caso contrario.

```python
G1 = [[0, 1, 0, 0, 1, 1, 0],   # 0
      [1, 0, 1, 1, 1, 0, 0],   # 1
      [0, 1, 0, 0, 0, 1, 0],   # 2
      [0, 1, 0, 0, 0, 0, 0],   # 3
      [1, 1, 0, 0, 0, 0, 0],   # 4
      [1, 0, 1, 0, 0, 0, 0],   # 5
      [0, 0, 0, 0, 0, 0, 0]]   # 6
```

En un grafo no dirigido la matriz es simétrica, $m_{ij} = m_{ji}$. La
diagonal es cero en un grafo simple, y un 1 en la diagonal es un bucle. El
espacio es $\Theta(V^2)$ aunque el grafo casi no tenga aristas: la fila
del vértice 6 ocupa lo mismo que las demás.

```python
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
```

Llenarla de ceros toma $n^2$ pasos antes de mirar una sola arista. En un
grafo de $10^5$ vértices eso no cabe en memoria, y ahí la representación
queda descartada sin discusión.

En un grafo con peso, en cada posición va el peso de la arista si existe e
$\infty$ si no existe. El 0 deja de servir como marca de ausencia, porque
un peso puede valer 0. Esa es la matriz con la que arranca
Floyd-Warshall.

### Lista de aristas

El grafo se representa como una lista cuyos elementos son las aristas. En
un grafo con peso, cada elemento es una tripla $(u, v, \text{peso})$.

```python
G1 = [(0, 1), (1, 0), (0, 4), (4, 0), (0, 5), (5, 0), (1, 2),
      (2, 1), (1, 3), (3, 1), (2, 5), (5, 2), (1, 4), (4, 1)]

G4 = [(0, 1, 3), (0, 4, 2), (1, 0, 6), (1, 6, 10), (2, 1, 7),
      (2, 3, 5), (2, 5, 8), (3, 6, 8), (4, 2, 7), (4, 0, -4),
      (5, 3, 1)]
```

Ocupa $\Theta(E)$ y nada más. Es la representación más compacta y la más
parecida a como llega la entrada de un problema.

### Matriz de incidencia

Una matriz $M$ de $|V| \times |E|$ donde $M_{ij}$ vale 1 si la arista $j$
es incidente con el vértice $i$. La suma de la fila $i$ es el grado del
vértice $i$, y la columna de una arista tiene exactamente dos unos, uno
por cada extremo. En grafos dirigidos se usa 1 para el origen y $-1$ para
el destino.

Casi nunca se usa para programar: ocupa $\Theta(V \cdot E)$ y no contesta
rápido ninguna de las dos preguntas que hacen los algoritmos. Aparece en
problemas donde la matriz misma es el dato de entrada.

### Las dos preguntas

Un algoritmo sobre grafos pregunta dos cosas: si existe la arista $(u,v)$
y cuáles son los vecinos de $u$.

```python
def hay_arista_en_lista(G, u, v):
    # Recorre los vecinos de u buscando a v
    encontrada = False
    for w in G[u]:
        if w == v:
            encontrada = True
    return encontrada


def hay_arista_en_matriz(m, u, v):
    # Una sola consulta: la posicion ya dice la respuesta
    return m[u][v] == 1


def vecinos_en_lista(G, u):
    # Los vecinos ya estan juntos: la lista de u es la respuesta
    return G[u]


def vecinos_en_matriz(m, u):
    # Hay que revisar la fila completa, incluidos los ceros
    resultado = []
    v = 0
    while v < len(m):
        if m[u][v] == 1:
            resultado.append(v)
        v = v + 1
    return resultado
```

|  | Lista de ady. | Matriz de ady. | Lista de aristas |
|---|---|---|---|
| Espacio | $\Theta(V+E)$ | $\Theta(V^2)$ | $\Theta(E)$ |
| ¿Existe $(u,v)$? | $O(\delta(u))$ | $O(1)$ | $O(E)$ |
| Vecinos de $u$ | $\Theta(\delta(u))$ | $\Theta(V)$ | $\Theta(E)$ |
| Recorrer todo | $\Theta(V+E)$ | $\Theta(V^2)$ | $\Theta(E)$ |
| Agregar arista | $O(1)$ | $O(1)$ | $O(1)$ |

Las tres construcciones y las dos consultas están comprobadas sobre los 64
grafos no dirigidos y los 4096 grafos dirigidos que existen sobre cuatro
vértices: en todos contestaron lo mismo.

## Cuál representación usar

### Primero la densidad

Un grafo es **denso** cuando $E$ se acerca a $V^2$, y **ralo** cuando $E$
es del orden de $V$. Las redes viales, las redes sociales y casi todo lo
que llega de un problema real son ralos. Con $V = 10^5$ y
$E = 2 \cdot 10^5$, la lista de adyacencia guarda $4 \cdot 10^5$ entradas
y la matriz guarda $10^{10}$ posiciones, de las cuales el 99,9998 % son
ceros.

Si el grafo es ralo, lista de adyacencia. La matriz se justifica cuando
$V$ es pequeño, cuando el grafo es denso, o cuando el algoritmo hace
muchas consultas de adyacencia sueltas.

### Después, qué pregunta hace el algoritmo

Los recorridos en profundidad y en amplitud piden los vecinos de cada
vértice, una vez por vértice: lista de adyacencia, y con ella cuestan
$\Theta(V+E)$. Los caminos más cortos entre todos los pares recorren la
matriz completa: matriz de adyacencia, con $\infty$ en las aristas que no
existen. Los algoritmos que relajan o que ordenan todas las aristas
recorren $E$ de principio a fin: lista de aristas.

Pasar de lista de aristas a lista de adyacencia cuesta $\Theta(V+E)$, una
sola pasada. Si el algoritmo va a hacer más trabajo que eso, conviene
construir la representación que le sirve en lugar de forzarlo sobre la que
llegó.

### Leer un grafo de la entrada

La primera línea trae $n$ y $m$; después vienen $m$ líneas con los dos
extremos de cada arista, numerados de 1 a $n$.

```python
def leer_grafo(entrada):
    # Primera linea: n y m. Despues, m lineas con una arista cada una
    datos = entrada.read().split()
    n = int(datos[0])
    m = int(datos[1])
    G = []
    u = 0
    while u < n:
        G.append([])
        u = u + 1
    i = 0
    while i < m:
        u = int(datos[2 + 2 * i]) - 1
        v = int(datos[3 + 2 * i]) - 1
        G[u].append(v)
        G[v].append(u)
        i = i + 1
    return (n, m, G)
```

Se lee todo de una vez y se parte por espacios, porque leer línea por
línea es lento cuando hay cientos de miles de aristas. Y se resta 1 al
leer, una sola vez.

## Errores comunes

- Olvidar la arista de vuelta en un grafo no dirigido. El programa corre,
  no falla, y contesta mal: el grafo quedó dirigido.
- Mezclar la numeración del enunciado con la de Python.
- Usar matriz de adyacencia cuando $n$ pasa de unos pocos miles. La
  memoria se acaba antes de que el algoritmo empiece.

Hay una forma de crear las listas que parece correcta y no lo es:

```python
vacia = []
G = [vacia] * n   # las n posiciones son la misma lista
G[0].append(3)
print(G[1])       # imprime [3]: el vecino se agrego a todos
```

Multiplicar una lista que contiene una lista vacía hace exactamente esto,
aunque se escriba en una sola línea. Hay que crear una lista nueva por
vértice, como en el ciclo de arriba.

Un vértice aislado no es un error: el 6 de $G_1$ tiene lista vacía y fila
de ceros. Los algoritmos deben funcionar con él, y suele ser el caso de
prueba que se olvida.

## Ejercicios

Los ejercicios de la clase, con los dos problemas de juez y los consejos
para atacarlos, están en la [página de ejercicios](Ejercicios.md).

## Código de la clase

- [representaciones.py](codigo/representaciones.py) — las tres
  representaciones, las dos consultas y los grados, contrastadas entre sí
  sobre los 64 grafos no dirigidos y los 4096 dirigidos de cuatro
  vértices.
- [leergrafo.py](codigo/leergrafo.py) — la lectura de un grafo desde la
  entrada y el conteo de grados, con el apretón de manos comprobado al
  final. Se corre con [grafo.in](codigo/grafo.in).

```bash
python3 representaciones.py
python3 leergrafo.py < grafo.in
```

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein. *Introduction to
  Algorithms*, 3.ª ed., MIT Press, 2009. Apéndice B.4, pp. 1168–1172, y
  Sección 22.1, pp. 589–593.
- K. H. Rosen. *Discrete Mathematics and Its Applications*, 7.ª ed.,
  McGraw-Hill, 2012. Capítulo 10.
- M. van Steen. *Graph Theory and Complex Networks: An Introduction*,
  2010.
- S. Halim, F. Halim, S. Effendy. *Competitive Programming 4*, Lulu, 2020.
  Sección 2.4.1.
