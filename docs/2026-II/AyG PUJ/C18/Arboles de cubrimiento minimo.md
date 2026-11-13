# Árboles de cubrimiento mínimo · AyG C18

Un grafo conexo y con pesos admite muchas formas de quedar conectado gastando
menos aristas de las que tiene. La más barata de todas es un árbol, y hay dos
algoritmos voraces que la encuentran sin equivocarse nunca: el de Kruskal, que
va mirando las aristas en orden de precio, y el de Prim, que hace crecer un
solo árbol desde donde uno quiera. Los dos se apoyan en el mismo resultado, la
propiedad de corte, que es lo que garantiza que una arista aceptada no haya que
devolverla después.

Esta nota desarrolla el problema, la propiedad de corte con su demostración,
los dos algoritmos sobre un mismo grafo de siete vértices y lo que cuesta cada
uno. El grafo de trabajo es además el caso de ejemplo del problema de juez que
cierra la sesión, de modo que la traza que se hace a mano sirve para comprobar
el programa.

## De dónde venimos

La estructura de conjuntos disjuntos ya quedó vista. Lo que se usa aquí son sus
tres operaciones:

| operación | qué hace | cuánto cuesta |
|---|---|---|
| `make_set(x)` | arma el conjunto $\{x\}$, con $x$ de raíz | $\Theta(1)$ |
| `find_set(x)` | devuelve la raíz del conjunto donde está $x$ | $O(\alpha(n))$ |
| `union(x, y)` | cuelga un conjunto del otro | $O(\alpha(n))$ |

La unión por rango cuelga el árbol bajo del alto, con lo que ninguno crece más
de lo necesario, y la compresión de caminos aprovecha cada búsqueda para dejar
apuntando a la raíz todo lo que encontró de paso. Con las dos, el costo
amortizado de una operación es $O(\alpha(n))$, donde $\alpha$ es la inversa de
la función de Ackermann, que para cualquier $n$ que quepa en un computador no
pasa de $4$.

### El bosque, con un ejemplo

Cada elemento guarda a quién apunta, y la raíz es quien se apunta a sí mismo.
Sobre los nueve elementos del ejemplo del curso, después de las uniones
$(5,1)$, $(1,3)$, $(7,2)$, $(4,8)$, $(6,9)$, $(3,2)$ y $(8,9)$, el bosque
queda en dos árboles:

| raíz | cuelgan de ella | más abajo | rango |
|---|---|---|---|
| 5 | 1, 3, 7 | 2, bajo el 7 | 2 |
| 4 | 8, 6 | 9, bajo el 6 | 2 |

Las siete llamadas, una por una:

| | llamado | raíces | rangos | qué cambia |
|---|---|---|---|---|
| 1 | `union(5, 1)` | 5, 1 | 0 = 0 | `p[1] = 5` y el rango de 5 sube a 1 |
| 2 | `union(1, 3)` | 5, 3 | 1 > 0 | `p[3] = 5` y el rango se queda |
| 3 | `union(7, 2)` | 7, 2 | 0 = 0 | `p[2] = 7` y el rango de 7 sube a 1 |
| 4 | `union(4, 8)` | 4, 8 | 0 = 0 | `p[8] = 4` y el rango de 4 sube a 1 |
| 5 | `union(6, 9)` | 6, 9 | 0 = 0 | `p[9] = 6` y el rango de 6 sube a 1 |
| 6 | `union(3, 2)` | 5, 7 | 1 = 1 | `p[7] = 5` y el rango de 5 sube a 2 |
| 7 | `union(8, 9)` | 4, 6 | 1 = 1 | `p[6] = 4` y el rango de 4 sube a 2 |

Dos cosas se leen en las columnas del medio. Lo que se cuelga son las raíces y
no los argumentos: la sexta línea pide unir 3 con 2, y lo que se mueve es el 7
debajo del 5. Y el rango sube en un solo caso, cuando los dos llegan iguales;
la segunda línea dice por qué, porque ahí el 3 se cuelga de un árbol que ya era
más alto, así que la altura no cambió y el rango tampoco.

Preguntar si $2$ y $3$ están en el mismo conjunto es subir desde cada uno
hasta su raíz y comparar: los dos llegan a $5$, así que sí. El rango es una
cota de la altura y no el tamaño, y por eso el de $5$ es $2$ aunque de él
cuelguen cuatro elementos.

Al llamar `find_set(9)` el recorrido pasa por $6$ y llega a $4$, y al volver
reengancha a $9$ directamente bajo $4$. El árbol pierde un nivel sin que nadie
lo haya pedido, y la siguiente consulta sobre $9$ cuesta un solo salto. Esa es
la compresión de caminos: no se hace en una pasada aparte, se hace mientras se
busca.

Lo único que hace falta recordar es que **dos elementos están en el mismo
conjunto si `find_set` les devuelve la misma raíz**. Esa es, palabra por
palabra, la pregunta de si dos ciudades ya quedaron conectadas. El detalle de
la estructura, con su ejemplo paso a paso, está en la
[nota de conjuntos disjuntos del semestre anterior](../../../2026-I/AyG%20PUJ/C29/Clase%2029%20Union%20Find.md).

### Fuera de Kruskal

La pregunta que los conjuntos disjuntos contestan barato es si dos elementos ya
se alcanzan, sobre una red a la que le van llegando enlaces. Con un recorrido
cada pregunta cuesta $O(V + E)$ y hay que volver a recorrer en cuanto entre un
enlace nuevo; aquí la pregunta cuesta $O(\alpha(n))$ y el enlace nuevo es una
unión.

De ahí salen tres usos que no tienen que ver con árboles de cubrimiento. En
segmentación de imágenes hay un elemento por píxel, se unen los vecinos de
color parecido y cada conjunto queda una región. En percolación se unen las
celdas abiertas de un material poroso y la pregunta es si el borde de arriba
quedó en el mismo conjunto que el de abajo. Y un laberinto se genera tumbando
paredes mientras los dos lados estén en conjuntos distintos, que es Kruskal con
pesos al azar.

## El problema

### Conectar al menor costo

Una empresa tiene que dejar comunicados siete barrios con fibra. No todos los
pares se pueden tender, y cada tendido posible tiene su costo. Basta con que
cada barrio alcance a los demás, sea directo o pasando por otros.

Antes de cualquier algoritmo valen dos preguntas: ¿cuántos tendidos va a tener
la respuesta, y puede sobrar alguno?

### Por qué la respuesta es un árbol

Si la selección deja un ciclo, se puede quitar cualquier arista de ese ciclo y
todo sigue conectado, porque sus dos extremos se alcanzan por el otro lado del
ciclo. Como las aristas cuestan, la solución óptima no tiene ciclos. Y tiene
que tocar todos los vértices. Un grafo conexo y acíclico es un árbol, así que
la respuesta es un árbol de cubrimiento y tiene exactamente $|V| - 1$ aristas.

De ahí la definición, que es la del capítulo 23 de CLRS, página 624.

**Definición.** Sea $G = (V, E)$ un grafo no dirigido y conexo con pesos
$w : E \to \mathbb{R}$. Un **árbol de cubrimiento mínimo** es un subconjunto
$E' \subseteq E$ tal que $(V, E')$ es un árbol y

$$w(E') = \sum_{(u,v) \in E'} w(u,v)$$

es el menor posible entre todos los árboles de cubrimiento de $G$.

Nada en la definición pide que los pesos sean positivos, y eso va a importar
más adelante.

### El grafo de la sesión

Siete vértices y once aristas:

| arista | peso | | arista | peso | | arista | peso |
|---|---|---|---|---|---|---|---|
| $(0,1)$ | 7 | | $(1,4)$ | 7 | | $(4,5)$ | 8 |
| $(0,3)$ | 5 | | $(2,4)$ | 5 | | $(4,6)$ | 9 |
| $(1,2)$ | 8 | | $(3,4)$ | 15 | | $(5,6)$ | 11 |
| $(1,3)$ | 9 | | $(3,5)$ | 6 | | | |

Las once suman $90$. El árbol de cubrimiento mínimo pesa $39$ y lo forman
$(0,3)$, $(2,4)$, $(3,5)$, $(0,1)$, $(1,4)$ y $(4,6)$. Conviene escoger seis
tendidos a mano antes de seguir leyendo, y volver a esa suma al final.

### Probar todos no sirve

Este grafo tiene $141$ árboles de cubrimiento. Probados los $141$, el de peso
$39$ aparece una sola vez, el siguiente pesa $40$ y el más caro $59$. O sea que
acertar por tanteo no es tan difícil aquí, y por eso el grafo es chico.

La cuenta se desborda enseguida. En un grafo completo de $n$ vértices hay
$n^{n-2}$ árboles de cubrimiento, que es la fórmula de Cayley:

| vértices | árboles de cubrimiento del grafo completo |
|---|---|
| 7 | $16\,807$ |
| 10 | $10^{8}$ |
| 20 | $2{,}6 \times 10^{23}$ |

Desde veinte vértices enumerar queda descartado. Lo que sigue es un algoritmo
que escoge aristas de una en una y un teorema que garantiza que ninguna de esas
decisiones hay que deshacerla.

### Dónde aparece

Las redes que se construyen una vez son el caso directo: acueductos, fibra,
tendido eléctrico, las pistas de una placa de circuito impreso. El peso es lo
que cuesta poner ese tramo. El primer algoritmo conocido, el de Otakar Borůvka
en 1926, salió justamente de ahí: la empresa que estaba llevando luz eléctrica
a los pueblos de Moravia le pidió la forma más barata de cablearlos.

El otro grupo de aplicaciones no tiene nada que ver con cables. El agrupamiento
por enlace simple es el árbol de cubrimiento mínimo sobre las distancias entre
los puntos: quitarle las $k-1$ aristas más caras parte el árbol en $k$ pedazos,
y esos pedazos son los grupos. Con esa misma idea se segmentan imágenes,
tomando un vértice por píxel y el contraste como peso.

Y sirve para acotar un problema que no se sabe resolver rápido. Recorrer el
árbol mínimo de ida y vuelta da un circuito que pasa por todas las ciudades y
cuesta a lo sumo el doble del mejor circuito posible, que es la aproximación
clásica para el problema del vendedor viajero.

## La propiedad de corte

### Cuatro palabras

- Un **corte** $(S, V \setminus S)$ es una partición de los vértices en dos
  montones, ninguno vacío.
- Una arista **cruza** el corte si tiene una punta en $S$ y la otra en
  $V \setminus S$.
- El corte **respeta** a un conjunto de aristas $A$ si ninguna arista de $A$ lo
  cruza.
- Una arista **ligera** del corte es una de peso mínimo entre las que cruzan.

Con $S = \{0,1,3\}$ cruzan cuatro aristas, $(1,2)$ con $8$, $(1,4)$ con $7$,
$(3,4)$ con $15$ y $(3,5)$ con $6$, de modo que la ligera es $(3,5)$. Con
$S = \{0\}$ cruzan dos, $(0,1)$ con $7$ y $(0,3)$ con $5$, y la ligera es
$(0,3)$. **La arista ligera es del corte y no del grafo**: cambiar la partición
cambia la respuesta.

Falta una palabra más. Una arista $e \notin A$ es **segura** para $A$ si
$A \cup \{e\}$ todavía cabe dentro de algún árbol de cubrimiento mínimo. Un
algoritmo que solo agregue aristas seguras termina en un árbol mínimo sin tener
que retroceder nunca. La dificultad está en reconocer una arista segura sin
conocer la respuesta, y el teorema que sigue da el criterio.

### El teorema

**Teorema (propiedad de corte; CLRS, teorema 23.1, página 626).** Sea $A$ un
subconjunto de algún árbol de cubrimiento mínimo $T$, sea
$(S, V \setminus S)$ un corte que respeta a $A$ y sea $e$ una arista ligera de
ese corte. Entonces $e$ es segura para $A$.

**Demostración.** Se procede de forma directa, construyendo a partir de $T$
otro árbol de cubrimiento mínimo que contenga a $A \cup \{e\}$. Si $e \in T$ no
hay nada que hacer, así que se supone $e = (u,v) \notin T$.

Como $T$ es un árbol, entre $u$ y $v$ hay un único camino, y agregarle $e$ lo
cierra en un ciclo. Ese camino arranca en $S$, porque $u \in S$, y termina
afuera, porque $v \notin S$, de modo que en algún paso salta de un lado al
otro. Sea $e' = (x,y)$ esa arista. Cruza el corte, y como el corte respeta a
$A$, no está en $A$. Como $e$ es ligera del corte y $e'$ también lo cruza,

$$w(e) \leq w(e').$$

Sea $T' = T \cup \{e\} \setminus \{e'\}$. Quitarle a un ciclo una arista deja
todo conectado, así que $T'$ sigue siendo un árbol de cubrimiento; contiene a
$A$, porque lo único que salió fue $e'$, que no estaba en $A$; y pesa

$$w(T') = w(T) + w(e) - w(e') \leq w(T).$$

**Conclusión.** Como $T$ era mínimo, $w(T')$ no puede ser menor que $w(T)$, de
manera que los dos pesan lo mismo y $T'$ también es un árbol de cubrimiento
mínimo. Ese $T'$ contiene a $A \cup \{e\}$, que es exactamente lo que significa
que $e$ sea segura para $A$. $\blacksquare$

El argumento es un intercambio: si la arista ligera no estaba en el árbol,
había una arista del mismo corte que no es más barata y que se puede cambiar
por ella sin empeorar el total. De ahí sale todo lo demás.

### Cuándo el árbol es único

**Corolario.** Si los pesos de $G$ son todos distintos entre sí, el árbol de
cubrimiento mínimo es único.

**Demostración.** Se procede por contradicción. Supóngase que hay dos árboles
mínimos distintos $T_1$ y $T_2$, y sea $e$ la arista más liviana de la
diferencia simétrica $T_1 \triangle T_2$, que está bien definida porque los
pesos son distintos. Sin pérdida de generalidad, $e \in T_1 \setminus T_2$.

Agregarle $e$ a $T_2$ cierra un ciclo, y ese ciclo tiene al menos una arista
$e' \in T_2 \setminus T_1$, porque si todas sus aristas estuvieran en $T_1$,
$T_1$ tendría un ciclo. Por cómo se escogió $e$, $w(e) < w(e')$. Entonces
$T_2 \cup \{e\} \setminus \{e'\}$ es un árbol de cubrimiento de peso
estrictamente menor que $w(T_2)$, lo que contradice que $T_2$ fuera mínimo. Por
lo tanto no hay dos árboles mínimos distintos. $\blacksquare$

Los once pesos del grafo de la sesión no son todos distintos, hay dos cincos,
dos sietes, dos ochos y dos nueves, así que el corolario no aplica. Aun así el
árbol de $39$ resulta único, cosa que se comprobó enumerando los $141$: el
corolario da una condición suficiente, no necesaria.

Con pesos repetidos lo que sí se conserva es el peso total. Dos corridas
distintas pueden devolver árboles distintos, los dos mínimos y los dos del
mismo peso, que es lo que suele pedir un juez en línea.

### Cuándo una arista está en todos

Una arista $e$ pertenece a **todo** árbol de cubrimiento mínimo si y solo si
existe un corte que ella cruza y en el que es estrictamente más liviana que
cualquier otra que lo cruce. La ida sale de la propiedad de corte: si ninguna
otra arista del corte puede sustituirla, cruzar ese corte obliga a incluirla.
Si el peso mínimo del corte lo alcanzan dos aristas, la obligación desaparece y
hay un árbol mínimo con una y otro con la otra.

## El algoritmo de Kruskal

### La idea

Se ordenan las aristas por peso y se recorren de la más barata a la más cara.
Si los dos extremos están en pedazos distintos, la arista entra; si ya estaban
juntos, cerraría un ciclo y se descarta.

Que la arista que entra sea segura es la propiedad de corte aplicada a un corte
que no hay que dibujar. Sea $S$ el pedazo que contiene a $u$ en el momento de
mirar $(u,v)$. Ninguna arista ya aceptada cruza ese corte, porque todas viven
dentro de un pedazo, así que el corte respeta a lo que se lleva. Y $(u,v)$ es
ligera de ese corte: si alguna arista del corte pesara menos, se habría mirado
antes, y como une $S$ con afuera, se habría aceptado, de modo que $u$ y $v$ ya
estarían en el mismo pedazo.

### El código

```python
def kruskal(V, aristas):
    ordenadas = sorted(aristas, key=lambda e: e[2])
    p = {}
    rango = {}
    for v in V:
        make_set(p, rango, v)
    mst = []
    peso = 0
    i = 0
    while i < len(ordenadas) and len(mst) < len(V) - 1:
        u, v, w = ordenadas[i]
        if find_set(p, u) != find_set(p, v):
            union(p, rango, u, v)
            mst.append((u, v, w))
            peso = peso + w
        i = i + 1
    return mst, peso
```

La condición `len(mst) < len(V) - 1` es la que para apenas el árbol queda
completo. Sin ella el resultado sería el mismo, porque todas las aristas que
faltan cerrarían ciclo, pero habría que mirarlas.

### La traza

Las once aristas en orden ascendente son

$$(0,3,5),\ (2,4,5),\ (3,5,6),\ (0,1,7),\ (1,4,7),\ (1,2,8),$$
$$(4,5,8),\ (1,3,9),\ (4,6,9),\ (5,6,11),\ (3,4,15).$$

Antes de leer la tabla vale predecir cuáles entran y en cuál se completa el
árbol.

| | arista | lo que compara `find_set` | decisión | pedazos después |
|---|---|---|---|---|
| 1 | $(0,3,5)$ | $\{0\} \neq \{3\}$ | entra | $\{0,3\},\{1\},\{2\},\{4\},\{5\},\{6\}$ |
| 2 | $(2,4,5)$ | $\{2\} \neq \{4\}$ | entra | $\{0,3\},\{1\},\{2,4\},\{5\},\{6\}$ |
| 3 | $(3,5,6)$ | $\{0,3\} \neq \{5\}$ | entra | $\{0,3,5\},\{1\},\{2,4\},\{6\}$ |
| 4 | $(0,1,7)$ | $\{0,3,5\} \neq \{1\}$ | entra | $\{0,1,3,5\},\{2,4\},\{6\}$ |
| 5 | $(1,4,7)$ | $\{0,1,3,5\} \neq \{2,4\}$ | entra | $\{0,1,2,3,4,5\},\{6\}$ |
| 6 | $(1,2,8)$ | el mismo pedazo | descartar | sin cambio |
| 7 | $(4,5,8)$ | el mismo pedazo | descartar | sin cambio |
| 8 | $(1,3,9)$ | el mismo pedazo | descartar | sin cambio |
| 9 | $(4,6,9)$ | $\{0,\ldots,5\} \neq \{6\}$ | entra | $\{0,1,2,3,4,5,6\}$ |

En la novena ya hay seis aristas, que son $|V| - 1$, y el ciclo no vuelve a
entrar: $(5,6,11)$ y $(3,4,15)$ no se alcanzan a mirar. El peso es
$5+5+6+7+7+9 = 39$.

### El corte detrás de cada arista aceptada

El cuarto paso sirve de ejemplo. Al llegar a $(0,1)$ ya entraron $(0,3)$,
$(2,4)$ y $(3,5)$, de modo que el pedazo de $0$ es $S = \{0,3,5\}$. Cruzan ese
corte cinco aristas:

| arista | peso |
|---|---|
| $(0,1)$ | 7 |
| $(4,5)$ | 8 |
| $(1,3)$ | 9 |
| $(5,6)$ | 11 |
| $(3,4)$ | 15 |

La más barata es $(0,1)$, y no podía ser otra: una arista del corte que pesara
menos de $7$ ya se habría mirado y habría pegado los dos pedazos. Las tres
aristas aceptadas están dentro de $S$ o dentro de $V \setminus S$, así que el
corte las respeta. Las cinco filas de la tabla que dicen `entra` repiten este
mismo argumento con otro corte.

### Lo que cuesta

Ordenar las aristas es $O(|E| \log |E|)$. Después hay $2|E|$ llamados a
`find_set` y hasta $|V| - 1$ a `union`, que juntos cuestan
$O(|E| \cdot \alpha(|V|))$, prácticamente lineal. El ordenamiento domina y el
algoritmo queda en $O(|E| \log |E|)$, que también se escribe
$O(|E| \log |V|)$ porque $|E| \leq |V|^2$ y entonces
$\log |E| \leq 2 \log |V|$.

Si las aristas llegaran ya ordenadas, o si los pesos fueran enteros chicos y se
pudieran repartir en cubetas, lo que queda es casi lineal.

## El algoritmo de Prim

### La idea

Se arranca de una raíz y se mantiene $V_T$, el conjunto de vértices que ya
entraron al árbol. En cada paso se agrega la arista más barata que va de $V_T$
a algún vértice de afuera.

Aquí el corte no hay que buscarlo: es siempre $(V_T, V \setminus V_T)$, el
borde del árbol. Las aristas aceptadas viven dentro de $V_T$, así que el corte
las respeta, y la más barata que cruza es ligera por definición. Es la misma
propiedad de corte, aplicada siempre al mismo corte en lugar de a uno distinto
cada vez.

Para no recorrer todas las aristas del borde en cada paso se guardan dos cosas
por cada vértice de afuera: `clave[v]`, el peso de la arista más barata que lo
conecta con el árbol, y `padre[v]`, el vértice del árbol de donde sale esa
arista. Al entrar $u$ al árbol, sus vecinos revisan si $u$ les mejora la clave.

### El código con búsqueda lineal

```python
def extraer_minimo(clave, en_mst):
    minimo = None ; mejor = INFTY
    for v in clave:
        if not en_mst[v] and clave[v] < mejor:
            mejor = clave[v] ; minimo = v
    return minimo


def prim(grafo, raiz):
    clave = {} ; padre = {} ; en_mst = {}
    for v in grafo:
        clave[v] = INFTY ; padre[v] = None ; en_mst[v] = False
    clave[raiz] = 0
    peso = 0
    restantes = len(grafo)
    while restantes > 0:
        u = extraer_minimo(clave, en_mst)
        if u is None:
            restantes = 0
        else:
            en_mst[u] = True
            if padre[u] is not None:
                peso = peso + clave[u]
            for (v, w) in grafo[u]:
                if not en_mst[v] and w < clave[v]:
                    clave[v] = w ; padre[v] = u
            restantes = restantes - 1
    return padre, peso
```

El `if u is None` es el caso del grafo que no es conexo: cuando ya no queda
ningún vértice de afuera con clave finita, no hay más que alcanzar y el ciclo
termina con menos de $|V| - 1$ aristas.

### La traza desde la raíz 0

Cada fila trae las claves de los vértices que están afuera, con el mínimo en
negrita y la casilla vacía para el que ya entró.

| iter | 0 | 1 | 2 | 3 | 4 | 5 | 6 | extrae | arista |
|---|---|---|---|---|---|---|---|---|---|
| 0 | **0** | $\infty$ | $\infty$ | $\infty$ | $\infty$ | $\infty$ | $\infty$ | 0 | |
| 1 | | 7 | $\infty$ | **5** | $\infty$ | $\infty$ | $\infty$ | 3 | $(0,3,5)$ |
| 2 | | 7 | $\infty$ | | 15 | **6** | $\infty$ | 5 | $(3,5,6)$ |
| 3 | | **7** | $\infty$ | | 8 | | 11 | 1 | $(0,1,7)$ |
| 4 | | | 8 | | **7** | | 11 | 4 | $(1,4,7)$ |
| 5 | | | **5** | | | | 9 | 2 | $(4,2,5)$ |
| 6 | | | | | | | **9** | 6 | $(4,6,9)$ |

El vértice $4$ es el que más se mueve: su clave baja de $15$ a $8$ y después a
$7$, y con ella su padre pasa de $3$ a $5$ y a $1$. Cuando por fin le llega el
turno, la arista que entra es la última que lo mejoró. Las seis aristas suman
$39$, las mismas de Kruskal.

### Desde otra raíz

Con raíz $2$ el orden de extracción es $2, 4, 1, 0, 3, 5, 6$ y las aristas
entran en otro orden, pero son las mismas seis y el peso vuelve a ser $39$.

| iter | 0 | 1 | 2 | 3 | 4 | 5 | 6 | extrae | arista |
|---|---|---|---|---|---|---|---|---|---|
| 0 | $\infty$ | $\infty$ | **0** | $\infty$ | $\infty$ | $\infty$ | $\infty$ | 2 | |
| 1 | $\infty$ | 8 | | $\infty$ | **5** | $\infty$ | $\infty$ | 4 | $(2,4,5)$ |
| 2 | $\infty$ | **7** | | 15 | | 8 | 9 | 1 | $(4,1,7)$ |
| 3 | **7** | | | 9 | | 8 | 9 | 0 | $(1,0,7)$ |
| 4 | | | | **5** | | 8 | 9 | 3 | $(0,3,5)$ |
| 5 | | | | | | **6** | 9 | 5 | $(3,5,6)$ |
| 6 | | | | | | | **9** | 6 | $(4,6,9)$ |

Que coincidan no es casualidad de estos datos: el árbol mínimo de este grafo
resultó ser único, así que la raíz solo cambia el orden en que se descubre.

### Prim con cola de prioridad

`extraer_minimo` recorre todas las claves en cada vuelta, y esa pasada es lo
que deja la versión anterior en $O(|V|^2)$. Con una cola de prioridad el mínimo
sale en $O(\log |V|)$, y el algoritmo queda idéntico al de Dijkstra salvo por
una línea.

```python
def prim_cola(grafo, raiz):
    clave = {} ; padre = {} ; en_mst = {}
    for v in grafo:
        clave[v] = INFTY ; padre[v] = None ; en_mst[v] = False
    clave[raiz] = 0
    cola = list() ; heappush(cola, (clave[raiz], raiz))
    peso = 0
    while len(cola) != 0:
        cu, u = heappop(cola)
        # si u ya entro al arbol, la pareja es vieja y se descarta
        if not en_mst[u]:
            en_mst[u] = True
            peso = peso + cu
            for (v, w) in grafo[u]:
                if not en_mst[v] and w < clave[v]:
                    clave[v] = w ; padre[v] = u
                    heappush(cola, (clave[v], v))
    return padre, peso
```

En Dijkstra la comparación es $d_u + w(u,v) < \mathit{dist}[v]$, el costo de
llegar a $v$ pasando por $u$. Aquí es $w < \mathit{clave}[v]$ a secas, porque
lo que se mide es el precio de engancharlo al árbol, no el de llegar hasta él
desde la raíz. Todo lo demás es igual, incluida la forma de descartar las
parejas viejas.

### La cola guarda parejas viejas

Cuando a un vértice le mejora la clave, la pareja anterior se queda en la cola,
porque no hay forma de sacar un elemento de la mitad de un montón. Sale más
tarde, cuando el vértice ya entró al árbol, y ahí se descarta. Sobre el grafo
de la sesión, desde la raíz $0$:

| | sale | qué pasa | la cola queda |
|---|---|---|---|
| 1 | $(0,0)$ | entra, mete $(5,3)$ y $(7,1)$ | $(5,3),(7,1)$ |
| 2 | $(5,3)$ | entra, mete $(6,5)$ y $(15,4)$ | $(6,5),(7,1),(15,4)$ |
| 3 | $(6,5)$ | entra, mete $(8,4)$ y $(11,6)$ | $(7,1),(8,4),(11,6),(15,4)$ |
| 4 | $(7,1)$ | entra, mete $(7,4)$ y $(8,2)$ | $(7,4),(8,2),(8,4),(11,6),(15,4)$ |
| 5 | $(7,4)$ | entra, mete $(5,2)$ y $(9,6)$ | $(5,2),(8,2),(8,4),(9,6),(11,6),(15,4)$ |
| 6 | $(5,2)$ | entra, no mejora a nadie | $(8,2),(8,4),(9,6),(11,6),(15,4)$ |
| 7 | $(8,2)$ | **vieja**, se descarta | $(8,4),(9,6),(11,6),(15,4)$ |
| 8 | $(8,4)$ | **vieja**, se descarta | $(9,6),(11,6),(15,4)$ |
| 9 | $(9,6)$ | entra, no mejora a nadie | $(11,6),(15,4)$ |
| 10 | $(11,6)$ | **vieja**, se descarta | $(15,4)$ |
| 11 | $(15,4)$ | **vieja**, se descarta | vacía |

De las once parejas que salieron, cuatro no valían. Por eso la cola puede
llegar a tener $|E|$ parejas y no $|V|$, y por eso el costo se escribe
$O(|E| \log |E|)$, que es lo mismo que $O(|E| \log |V|)$.

### Lo que cuesta

| versión de Prim | costo |
|---|---|
| búsqueda lineal del mínimo | $O(\lvert V\rvert^2)$ |
| cola de prioridad binaria | $O(\lvert E\rvert \log \lvert V\rvert)$ |
| montón de Fibonacci | $O(\lvert E\rvert + \lvert V\rvert \log \lvert V\rvert)$ |

El montón de Fibonacci mejora la cota pero tiene constantes grandes, y en la
práctica no se usa.

## Kruskal o Prim

|  | Kruskal | Prim |
|---|---|---|
| qué recorre | las aristas, ordenadas | el borde del árbol |
| estructura | conjuntos disjuntos | cola de prioridad |
| cómo llega el grafo | lista de aristas | listas de adyacencia |
| costo | $O(\lvert E\rvert \log \lvert E\rvert)$ | $O(\lvert E\rvert \log \lvert V\rvert)$, o $O(\lvert V\rvert^2)$ |
| le conviene | grafos ralos | grafos densos |

Dibujados paso a paso sobre el mismo grafo, los dos se distinguen de una
mirada: lo que Kruskal lleva aceptado son varios pedazos sueltos que solo al
final se pegan, mientras que lo de Prim es siempre una sola pieza que se
estira. Esa es la diferencia entre descubrir un corte nuevo cada vez y
mantenerlo fijo en el borde del árbol.

En un grafo denso, con $|E|$ cerca de $|V|^2$, la búsqueda lineal de Prim
cuesta $|V|^2$ sin logaritmo ni estructura de por medio, mientras que ordenar
$|V|^2$ aristas sale más caro. En un grafo ralo pasa lo contrario, y además
Kruskal no necesita tener el grafo armado: le basta la lista de aristas tal
como viene de la entrada, que es como suelen llegar los problemas de juez.

Eso explica dónde corre cada uno. Kruskal es el que está dentro del
agrupamiento por enlace simple y de la segmentación de imágenes: ahí el dato
son las diferencias entre pares y lo que se busca son los pedazos que quedan al
dejar de unir, que es justo lo que Kruskal tiene a medio camino. Prim sirve
cuando el peso no está escrito sino que se calcula al momento, como la
distancia entre $n$ puntos del plano: con búsqueda lineal cuesta $|V|^2$ sin
guardar una sola arista, mientras que Kruskal tendría que generar y ordenar las
$n(n-1)/2$. Y el árbol de Prim crece desde un punto, que es el orden en que un
tendido se instala en terreno.

### Lo que no cambia el árbol

Sumarle una constante $c$ a todos los pesos no cambia el árbol mínimo, porque
todo árbol de cubrimiento tiene exactamente $|V| - 1$ aristas y entonces a
todos les sube lo mismo, $(|V|-1)c$. Multiplicar todos los pesos por una
constante positiva tampoco lo cambia. Y los pesos negativos no lo rompen: la
propiedad de corte compara pesos, nunca los suma, así que no supone signos.
Esa es una diferencia de fondo con Dijkstra.

Para el árbol de cubrimiento **máximo** sirve el mismo código con las aristas
ordenadas al revés, o con los pesos negados.

### Lo que el árbol mínimo sí garantiza

Entre cada pareja de vértices, el camino que los une dentro del árbol mínimo
tiene la propiedad de que su arista más pesada es la menor posible: ningún otro
camino del grafo entre esos dos vértices consigue una arista máxima más
pequeña. Sobre el grafo de la sesión eso se comprueba en las $21$ parejas. De
$0$ a $6$, por ejemplo, el camino del árbol pasa por $(0,1)$, $(1,4)$ y
$(4,6)$, con pesos $7$, $7$ y $9$, y ningún camino del grafo llega a $6$ sin
pasar por una arista de peso $9$ o más.

Esa propiedad es lo que hace al árbol mínimo útil en problemas de cuello de
botella, del tipo *qué tan pesado es el camión más pesado que puede ir de aquí
a allá*.

### El árbol de caminos más cortos es otro

Lo que el árbol mínimo no da son las distancias. El ejemplo más pequeño es un
triángulo: $a - b$ con peso $4$, $b - c$ con peso $3$ y $a - c$ con peso $6$.

- El árbol mínimo es $\{(a,b), (b,c)\}$ y pesa $7$.
- El árbol de caminos más cortos desde $a$ es $\{(a,b), (a,c)\}$ y pesa $10$.

Al mirar $c$, Prim compara el $3$ que cuesta engancharlo desde $b$; Dijkstra
compara $4+3$ contra el $6$ de la arista directa y se queda con el $6$. En el
árbol mínimo, ir de $a$ a $c$ cuesta $7$, que es más que la arista que se
descartó. Los dos algoritmos se parecen en el código y resuelven problemas
distintos.

## Errores comunes

- **Creer que el árbol es único.** Con pesos repetidos puede haber varios,
  todos del mismo peso total.
- **No ver que el grafo no es conexo.** Los dos algoritmos terminan con menos
  de $|V| - 1$ aristas. Eso se detecta y se reporta, en vez de imprimir la suma
  de los pedazos.
- **Usar Dijkstra por error.** Minimiza la suma del camino desde la raíz, no el
  precio de cada arista que entra.
- **Olvidar que el peso total puede desbordar.** Con $200\,000$ aristas de
  pesos de hasta $2^{31}$, la suma no cabe en un entero de 32 bits.
- **Ordenar y después no parar.** Kruskal puede seguir mirando aristas después
  de completar el árbol. No cambia el resultado, pero en un problema con
  $|E|$ grande es trabajo regalado.

## El código de la clase

[union_find.py](./codigo/union_find.py) trae `make_set`, `find_set` y `union`
con las dos heurísticas, y el ejemplo de nueve elementos con el estado de `p` y
`rango` después de cada unión.
[kruskal.py](./codigo/kruskal.py) tiene el algoritmo de Kruskal sobre una lista
de aristas, con el grafo de la sesión en el `main`.
[prim.py](./codigo/prim.py) tiene las dos versiones de Prim, la de búsqueda
lineal y la de cola de prioridad, sobre listas de adyacencia.
[20262-agra-darkroads.py](./codigo/20262-agra-darkroads.py) y
[20262-agra-darkroads.cpp](./codigo/20262-agra-darkroads.cpp) son la solución
del problema de juez de la sesión.

## Ejercicios

### A mano

1. Baje el peso de $(3,4)$ de $15$ a $4$ y vuelva a correr Kruskal. ¿Cambia el
   árbol? ¿Cuál arista sale?
2. Suba el peso de $(2,4)$ de $5$ a $7$, con lo que empata con $(0,1)$ y
   $(1,4)$. Muestre dos árboles distintos del mismo peso.
3. Corra Prim desde la raíz $6$ y compare las seis aristas con las de la traza
   desde $0$.
4. ¿Cuáles aristas del grafo de la sesión están en todo árbol mínimo? Justifique
   cada una exhibiendo un corte.
5. Agréguele a `kruskal` la detección de grafo que no es conexo.

Las tres primeras son las de la sesión. Para la primera, al bajar $(3,4)$ a $4$
esa arista pasa a ser la segunda de la lista ordenada y entra; la que sale es
la que cerraba el ciclo que se forma, y el peso baja. Para la cuarta, una
arista está en todos los árboles mínimos cuando es la única más liviana de
algún corte, y el corte más fácil de exhibir es el que separa a uno de sus
extremos del resto.

### En parejas

Construya un grafo de seis vértices donde Kruskal y Prim desde la raíz $0$
acepten las aristas en órdenes distintos y terminen en el mismo árbol, y otro
donde terminen en árboles distintos del mismo peso. Intercambie con la pareja
de al lado y verifique el del otro con el algoritmo que no usó.

### UVa 11631, Dark roads

Alumbrar un metro de calle cuesta un dólar por noche. El gobierno quiere apagar
calles para gastar menos, con la condición de que entre dos cruces cualesquiera
siga quedando un camino iluminado. Se pide cuánto es lo máximo que puede
ahorrar por noche.

Cada caso empieza con dos enteros, el número de cruces $m$ y el número de
calles $n$, con $1 \leq m \leq 200\,000$ y $m - 1 \leq n \leq 200\,000$, y
siguen $n$ tripletas $x$, $y$, $z$: una calle entre $x$ y $y$ de $z$ metros,
con los cruces numerados desde $0$. La entrada termina con $m = n = 0$. El
grafo de cada caso es conexo y el total de metros cabe en $2^{31}$.

Enunciado y envío: <https://vjudge.net/problem/UVA-11631>. La página pide
cuenta.

El caso de ejemplo del enunciado es el grafo de esta sesión, con sus once
calles sumando $90$ metros. El árbol mínimo pesa $39$, así que la respuesta es
$90 - 39 = 51$: lo que se ahorra es todo lo que no entra al árbol.

#### La entrada del caso de ejemplo

Antes del código conviene ver la entrada al lado del dibujo. El caso del
enunciado es este:

```text
7 11
0 1 7
0 3 5
1 2 8
1 3 9
1 4 7
2 4 5
3 4 15
3 5 6
4 5 8
4 6 9
5 6 11
0 0
```

| la línea | qué dice | en el dibujo |
|---|---|---|
| `7 11` | siete cruces y once calles | el tamaño del grafo |
| `0 1 7` | calle entre el cruce 0 y el 1, de siete metros | la arista $(0,1)$ con peso $7$ |
| `3 4 15` | calle entre el 3 y el 4, de quince metros | la arista $(3,4)$, la más larga |
| `0 0` | no viene otro caso | fin de la entrada |

Las once tripletas son las once aristas del grafo de la sesión, en el mismo
orden en que aparecen en la tabla de pesos. Los cruces vienen numerados desde
$0$, de modo que el grafo tiene vértices $0$ a $m-1$ y no hace falta restarle
uno a nada. Antes de la línea `0 0` puede venir otro caso completo, con su
propia primera línea y sus propias calles.

La salida es una línea por caso. Para este, las once calles suman $90$ metros,
el árbol de cubrimiento mínimo pesa $39$, y lo que se puede apagar es
$90 - 39 = 51$.

#### Cómo leer la entrada

```cpp
int m, n;
scanf("%d %d", &m, &n);
while (m != 0) {
  vector<pair<int, pair<int, int> > > aristas(n);
  long long total = 0;
  for (int i = 0; i < n; i++) {
    int x, y, z;
    scanf("%d %d %d", &x, &y, &z);
    aristas[i] = make_pair(z, make_pair(x, y));
    total = total + z;
  }
  /* aqui se corre Kruskal y se imprime total - peso del MST */
  scanf("%d %d", &m, &n);
}
```

Guardar la arista como la pareja `(peso, (x, y))` deja que `sort` la ordene por
peso sin escribir un comparador, porque las parejas se comparan primero por su
primera componente. `total` tiene que ser `long long`.

#### La solución

- [En Python](./codigo/20262-agra-darkroads.py)
- [En C++](./codigo/20262-agra-darkroads.cpp)

Las dos hacen lo mismo: suman todos los pesos, corren Kruskal con conjuntos
disjuntos y restan. Medidas sobre un caso generado de $200\,000$ cruces y
$200\,000$ calles, lo más grande que admite el enunciado, con la mejor de tres
corridas:

| | un caso | cinco casos |
|---|---|---|
| Python | 1,06 s | 3,14 s |
| C++ | 0,12 s | 0,61 s |

Sobre un solo caso la diferencia es de nueve veces, no de las veinte que se
midieron en el problema de la sesión anterior. La razón es que aquí el trabajo pesado es
ordenar $200\,000$ aristas, y el `sort` de Python corre en C; lo que queda en
el intérprete es un recorrido de las aristas con dos `find_set` por arista.

### UVa 10034, Freckles

Hay $n \leq 100$ pecas en la espalda de alguien, cada una con sus coordenadas
$(x, y)$ reales, y se quieren unir con trazos rectos gastando la menor cantidad
de tinta, de modo que de cualquier peca se pueda llegar a cualquier otra. Se
pide la longitud total con dos decimales. La entrada trae primero el número de
casos y una línea en blanco entre uno y otro.

Enunciado y envío: <https://vjudge.net/problem/UVA-10034>. La página pide
cuenta.

Es un árbol de cubrimiento mínimo sobre un grafo completo que no viene dado: la
arista entre dos pecas existe siempre y su peso es la distancia euclidiana. Con
$n \leq 100$ son a lo sumo $4\,950$ aristas, que caben de sobra; también sirve
Prim con búsqueda lineal, que en un grafo denso como este es la opción natural.
La trampa está en la entrada, con sus líneas en blanco y sus números reales.

### UVa 11228, Transportation system

Hay $n \leq 1000$ ciudades con coordenadas enteras. Dos ciudades están en el
mismo estado si la distancia entre ellas es a lo sumo $r$, y esa relación se
propaga: si $A$ está con $B$ y $B$ con $C$, las tres están en el mismo estado.
Dentro de un estado se construyen carreteras y entre estados vías férreas, y se
quiere lo mínimo de cada cosa para que todas las ciudades queden conectadas. Se
pide, por caso, el número de estados y los dos totales redondeados.

Enunciado y envío: <https://vjudge.net/problem/UVA-11228>. La página pide
cuenta.

Es el mismo Kruskal, con las aristas del árbol repartidas en dos sumas según su
longitud pase o no de $r$, y el número de estados sale de contar cuántas
aristas del árbol son largas: si el árbol tiene $n-1$ aristas y $k$ de ellas
son vías férreas, los estados son $k+1$. Con $n = 1000$ son casi medio millón
de aristas, así que conviene ordenarlas una sola vez.

## Lo que sigue

Lo que viene usa un árbol para responder preguntas sobre pedazos de un arreglo:
la suma de las posiciones de $i$ a $j$, o el mínimo, con el arreglo cambiando
entre pregunta y pregunta. Con el arreglo quieto, las sumas acumuladas
contestan cualquier rango en una resta; la pregunta para investigar es qué les
pasa cuando una posición cambia, y qué se gana guardando la suma de cada mitad,
y de cada mitad de la mitad, en vez de la de cada prefijo.

## Referencias

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., Stein, C. *Introduction to
  Algorithms*, 3rd ed. MIT Press, 2009. Capítulo 23, páginas 624 a 642.
- Borůvka, O. *O jistém problému minimálním*. Práce Moravské přírodovědecké
  společnosti, 3, 1926, páginas 37 a 58.
- Kruskal, J. B. *On the shortest spanning subtree of a graph and the traveling
  salesman problem*. Proceedings of the American Mathematical Society, 7(1),
  1956, páginas 48 a 50.
- Prim, R. C. *Shortest connection networks and some generalizations*. Bell
  System Technical Journal, 36(6), 1957, páginas 1389 a 1401.
- Halim, S., Halim, F., Effendy, S. *Competitive Programming 4*. Lulu, 2020.
  Capítulo 4.
