# Árboles de segmentos · AyG C19

Un arreglo al que se le preguntan muchas sumas de rango admite dos respuestas
conocidas. Se puede recorrer el rango en cada pregunta, y se pueden guardar de
antemano las sumas acumuladas para que cada pregunta salga de una resta. La
primera paga $O(N)$ por consulta. La segunda responde en $O(1)$, y se cae en
cuanto una posición del arreglo cambia, porque hay que rehacer todos los
prefijos que la contienen. El árbol de segmentos renuncia al $O(1)$ de la
consulta para quedarse con $O(\log N)$ en las dos operaciones a la vez.

Esta nota desarrolla la estructura sobre un arreglo de diez posiciones, con la
traza de una consulta y de una actualización, y termina en los dos problemas de
juez del tema. El arreglo de trabajo es `8 5 3 9 0 1 2 3 4 9`, que suma $44$, y
la consulta que se sigue de principio a fin es la del rango de la posición $3$ a
la $8$.

## El problema

### La pregunta que se repite

| $i$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| $A[i]$ | 8 | 5 | 3 | 9 | 0 | 1 | 2 | 3 | 4 | 9 |

Escrita como función, $q(ql, qr)$ devuelve la suma de $A[ql..qr]$. Sobre este
arreglo, $q(3,8) = 9 + 0 + 1 + 2 + 3 + 4 = 19$. Después vendrá otra consulta, y
otra, hasta $Q$ preguntas sobre el mismo arreglo.

### Recorrer el rango

Seis sumas y la respuesta sale. Lo que decide es el caso peor: un rango puede
abarcar el arreglo entero, así que una consulta cuesta $O(N)$ y las $Q$ juntas
$O(Q \cdot N)$. Con $N$ y $Q$ de cien mil son diez mil millones de sumas.

Con esa cifra la idea se descarta sin programarla. La regla práctica es que un
caso límite por encima de cien millones de operaciones ya va a ser lento, y diez
mil millones lo pasa por dos órdenes de magnitud.

### Las sumas acumuladas

$P[i]$ guarda la suma de $A[0..i]$. Las diez se construyen en un recorrido, y
después cada consulta sale de una resta, $q(ql,qr) = P[qr] - P[ql-1]$.

| $i$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| $A[i]$ | 8 | 5 | 3 | 9 | 0 | 1 | 2 | 3 | 4 | 9 |
| $P[i]$ | 8 | 13 | 16 | 25 | 25 | 26 | 28 | 31 | 35 | 44 |

La misma consulta queda en $q(3,8) = P[8] - P[2] = 35 - 16 = 19$. Preparar
cuesta $O(N)$ y responder $O(1)$, de modo que las $Q$ consultas juntas quedan en
$O(N + Q)$: la multiplicación del método anterior se volvió una suma.

### Lo que rompe una actualización

El arreglo se mueve y ahora $A[3] = 10$.

| $i$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| antes | 8 | 13 | 16 | 25 | 25 | 26 | 28 | 31 | 35 | 44 |
| después | 8 | 13 | 16 | 26 | 26 | 27 | 29 | 32 | 36 | 45 |

Siete de los diez prefijos quedaron con un valor viejo. Cambiar una posición
arrastra todos los prefijos que la contienen, del $3$ al $9$, y rehacerlos
cuesta $O(N)$. Con $U$ actualizaciones intercaladas entre las consultas, el
total vuelve a $O(U \cdot N)$.

### Las tres formas, lado a lado

| | preparar | consultar | actualizar |
|---|---|---|---|
| Recorrer el rango | sin preparación | $O(N)$ | $O(1)$ |
| Sumas acumuladas | $O(N)$ | $O(1)$ | $O(N)$ |
| Árbol de segmentos | $O(N)$ | $O(\log N)$ | $O(\log N)$ |

Con el arreglo quieto, las sumas acumuladas son imbatibles y no hace falta nada
más. El árbol de segmentos no gana ninguna columna por separado, y es el único
que sostiene las dos últimas al mismo tiempo.

## El árbol sobre el arreglo

### Qué guarda cada vértice

Guardar solo las posiciones obliga a recorrer el rango. Guardar los diez
prefijos obliga a rehacerlos cuando una posición cambia. Queda una salida
intermedia: tener sumados de antemano algunos pedazos del arreglo, escogidos de
modo que con pocos de ellos se arme cualquier rango.

Cada vértice del árbol representa un intervalo $[l,r]$ de posiciones y guarda el
resultado de aplicar la operación a ese intervalo. Las hojas representan una
posición cada una.

La raíz representa $[0,9]$ y guarda $44$, la suma de las diez posiciones. Su
hijo izquierdo representa $[0,4]$ y guarda $8 + 5 + 3 + 9 + 0 = 25$. El derecho
representa $[5,9]$ y guarda $19$.

### La operación y su neutro

A la operación se le piden dos cosas. Que sea asociativa, de modo que el orden en
que se agrupen los pedazos no cambie el resultado. Y que tenga elemento neutro,
para que un vértice que no aporta nada tenga qué devolver.

| operación | neutro |
|---|---|
| suma | $0$ |
| producto | $1$ |
| máximo | $-\infty$ |
| mínimo | $+\infty$ |

### Cómo se parte el arreglo

El punto de corte es $m = \lfloor (l+r)/2 \rfloor$: el hijo izquierdo recibe
$[l,m]$ y el derecho $[m+1,r]$. Para la raíz, $m = \lfloor (0+9)/2 \rfloor = 4$,
con lo que el izquierdo queda con $[0,4]$ y el derecho con $[5,9]$. Lo que
guarda la raíz sale de los dos, $25 + 19 = 44$.

Cada hijo se parte igual. De $[0,4]$ salen $[0,2]$ con $16$ y $[3,4]$ con $9$. De
$[5,9]$ salen $[5,7]$ con $6$ y $[8,9]$ con $13$. Cuando el intervalo tiene
largo impar, la mitad corta queda a la derecha. La partición se detiene cuando
$l = r$, y ahí el vértice guarda $A[l]$.

El arreglo de diez posiciones ocupa $19$ vértices, que es $2N - 1$, con hojas a
profundidad $3$ y a profundidad $4$. El árbol queda perfecto solo cuando $N$ es
potencia de dos, y $10$ no lo es.

### Cómo se numeran los vértices

La raíz es el vértice $0$ y los hijos de $v$ son $2v + 1$ y $2(v + 1)$. Ningún
vértice guarda enlaces a sus hijos: el árbol entero vive en un arreglo plano y
bajar un nivel es una cuenta.

| $v$ | intervalo | valor |
|---|---|---|
| 0 | $[0,9]$ | 44 |
| 1 | $[0,4]$ | 25 |
| 2 | $[5,9]$ | 19 |
| 3 | $[0,2]$ | 16 |
| 4 | $[3,4]$ | 9 |
| 5 | $[5,7]$ | 6 |
| 6 | $[8,9]$ | 13 |
| 7 | $[0,1]$ | 13 |
| 8 | $[2]$ | 3 |
| 9 | $[3]$ | 9 |
| 10 | $[4]$ | 0 |
| 11 | $[5,6]$ | 3 |
| 12 | $[7]$ | 3 |
| 13 | $[8]$ | 4 |
| 14 | $[9]$ | 9 |
| 15 | $[0]$ | 8 |
| 16 | $[1]$ | 5 |
| 23 | $[5]$ | 1 |
| 24 | $[6]$ | 2 |

Los hijos del vértice $1$ son el $3$ y el $4$, que llevan $[0,2]$ y $[3,4]$. El
salto entre el $16$ y el $23$ son los huecos: los índices del $17$ al $22$
serían los hijos de las hojas $[2]$, $[3]$ y $[4]$, que no tienen. Las dos hojas
del fondo, $[5]$ y $[6]$, caen en el $23$ y el $24$.

## La construcción

### El código

```python
def build_rec(tree, A, v, l, r):
    if l == r:
        tree[v] = A[l]
    else:
        m = (l + r) // 2
        build_rec(tree, A, 2 * v + 1, l, m)
        build_rec(tree, A, 2 * (v + 1), m + 1, r)
        tree[v] = tree[2 * v + 1] + tree[2 * (v + 1)]


def build(A):
    N = len(A)
    tree = [0] * (4 * N)
    build_rec(tree, A, 0, 0, N - 1)
    return {"tree": tree, "N": N}
```

Cuando el vértice representa una sola posición, $l = r$, guarda $A[l]$ y la
recursión se detiene. Si no, parte el intervalo en $m$, construye el hijo
izquierdo con $[l,m]$ y el derecho con $[m+1,r]$, y al volver guarda la suma de
los dos. El valor de un vértice se arma con los de sus hijos y nunca recorriendo
el arreglo.

La última línea de la rama recursiva corre después de los dos llamados, así que
el árbol se llena de abajo hacia arriba. La raíz es el último vértice que recibe
su valor.

### Lo que cuesta y por qué se reservan $4N$ casillas

Cada vértice se visita una vez y hace una suma, de modo que construir es
$\Theta(N)$.

Los $19$ vértices no ocupan las primeras $19$ casillas del arreglo. Con $N = 10$
el índice más grande que se usa es el $24$, de modo que una reserva de $2N = 20$
casillas se sale por la derecha y el programa escribe donde no debe. La reserva
de $4N$ es la cota que alcanza en todos los casos: para este arreglo son $40$
casillas, de las que se tocan $19$ y quedan sin usar las seis del $17$ al $22$ y
todo lo que va del $25$ al $39$.

## La consulta

### El rango no es el intervalo de ningún vértice

Ningún vértice guarda la suma de $[3,8]$. La raíz abarca de más y las hojas de
menos, así que la respuesta hay que armarla con varios vértices. Para eso la
recursión baja desde la raíz preguntándole a cada uno qué puede aportar.

### Los tres casos

El vértice que lleva $[l,r]$ se compara con el rango pedido $[ql,qr]$ y cae en
uno de tres casos.

1. **Disjunto**, cuando $qr < l$ o $r < ql$. El intervalo del vértice queda
   entero por fuera del rango y devuelve el neutro, que para la suma es $0$.
2. **Contenido**, cuando $ql \leq l$ y $r \leq qr$. El intervalo cabe dentro del
   rango y el vértice devuelve lo que guarda, sin bajar más.
3. **Solapado**, el resto. Parte del intervalo está dentro del rango y parte
   fuera, así que el vértice baja a sus dos hijos y combina lo que devuelven.

El contenido es el que ahorra el trabajo. Un vértice contenido entrega de un
golpe la suma de todas sus posiciones, y la recursión no visita a ninguno de sus
descendientes. Sirve la imagen del sancocho: si al destapar la olla el pollo ya
está hecho, se sirve como está y no se vuelve a cocinar.

Una hoja nunca cae en el caso solapado. Con $l = r$ el intervalo tiene una sola
posición, que está dentro del rango o está fuera.

El solapado es el único caso que produce dos llamadas, y por eso es el que
decide cuántos vértices se visitan.

### La traza de $q(3,8)$

Antes de leer la tabla vale predecir cuáles vértices devuelven su valor sin
bajar, cuáles devuelven $0$ y cuántos de los $19$ se visitan.

| $v$ | intervalo | caso | devuelve |
|---|---|---|---|
| 0 | $[0,9]$ | solapado | baja a $1$ y $2$ |
| 1 | $[0,4]$ | solapado | baja a $3$ y $4$ |
| 3 | $[0,2]$ | disjunto | $0$ |
| 4 | $[3,4]$ | contenido | $9$ |
| 2 | $[5,9]$ | solapado | baja a $5$ y $6$ |
| 5 | $[5,7]$ | contenido | $6$ |
| 6 | $[8,9]$ | solapado | baja a $13$ y $14$ |
| 13 | $[8]$ | contenido | $4$ |
| 14 | $[9]$ | disjunto | $0$ |

Fila por fila. La raíz tiene parte de $[0,9]$ dentro del rango y parte fuera, así
que se solapa y baja al $1$ y al $2$. El vértice $1$ guarda $25$, pero las
posiciones $0$, $1$ y $2$ no entran en el rango, de modo que vuelve a ser
solapado. El $3$ lleva $[0,2]$, que termina en la posición $2$ cuando el rango
empieza en la $3$: no comparten nada, devuelve $0$ y sus tres hojas no se
visitan. El $4$ lleva $[3,4]$, que cabe entero en $[3,8]$, y entrega los $9$ que
guarda sin bajar a sus dos hojas.

De vuelta en la raíz, la recursión sigue por el $2$. $[5,9]$ deja la posición $9$
por fuera, así que se solapa. El $5$ lleva $[5,7]$, que cabe entero y entrega el
$6$ de un golpe, con lo que tres posiciones se resuelven en una sola lectura. El
$6$ lleva $[8,9]$, con la $8$ dentro y la $9$ fuera, y baja a sus dos hojas: la
$[8]$ está contenida y da $4$, la $[9]$ queda fuera y da $0$.

La respuesta son los $9 + 6 + 4 = 19$ que aportan los tres vértices contenidos.
La recursión visitó nueve vértices de diecinueve, y los diez que no se tocaron
son los cuatro descendientes de $[0,2]$, los cuatro de $[5,7]$ y las dos hojas de
$[3,4]$.

### El código

```python
def query_rec(S, v, l, r, ql, qr):
    resultado = 0
    if not (qr < l or r < ql):
        if ql <= l and r <= qr:
            resultado = S["tree"][v]
        else:
            m = (l + r) // 2
            resultado = (query_rec(S, 2 * v + 1, l, m, ql, qr)
                         + query_rec(S, 2 * (v + 1), m + 1, r, ql, qr))
    return resultado


def query(S, ql, qr):
    return query_rec(S, 0, 0, S["N"] - 1, ql, qr)
```

La condición de afuera deja el caso disjunto: si el vértice no toca el rango, el
resultado se queda en el $0$ con que se inicializó, el neutro de la suma. El `if`
de adentro es el caso contenido y entrega lo que guarda el vértice. El `else` es el
solapado, que parte en $m$ y suma lo que traen las dos llamadas. El llamado
inicial va sobre la raíz y el intervalo completo, `query_rec(S, 0, 0, N-1, ql, qr)`.

### Lo que cuesta

En cada nivel hay a lo sumo dos vértices solapados, uno por cada extremo del
rango. Los dos extremos se separan al bajar, y desde ahí cada uno arrastra a lo
sumo un vértice solapado por nivel, porque un extremo cae de un solo lado del
corte. El árbol tiene altura $\lceil \log_2 N \rceil$, así que la consulta visita
$O(\log N)$ vértices. De diez mil consultas al azar sobre un árbol de cien mil
posiciones, ninguna pasó de $67$ vértices.

## La actualización puntual

### Solo cambian los ancestros de la hoja

La posición $3$ pasa de $9$ a $10$. De los $19$ vértices cambian cuatro, la hoja
$[3]$ y los tres que la contienen.

| $v$ | intervalo | antes | después |
|---|---|---|---|
| 9 | $[3]$ | 9 | 10 |
| 4 | $[3,4]$ | 9 | 10 |
| 1 | $[0,4]$ | 25 | 26 |
| 0 | $[0,9]$ | 44 | 45 |

Los otros quince representan intervalos que no contienen la posición $3$, así que
su valor sigue siendo el bueno. Con la raíz en $45$, la consulta $q(3,8)$ pasa a
devolver $20$: los mismos tres vértices contenidos de la traza, con $[3,4]$ ahora
en $10$.

La diferencia es la misma en toda la rama. El valor nuevo menos el viejo es $1$,
y ese $1$ es lo que se le suma a cada ancestro.

### Si la actualización se detiene en la hoja

Cambiar $[3]$ y volver sin recalcular deja la raíz en $44$ y el vértice $[0,4]$
en $25$. La consulta $q(3,8)$ sigue devolviendo $19$ y ninguna línea del programa
avisa, porque el árbol contesta con valores viejos en lugar de quedarse sin
respuesta. De ahí que cada ancestro rehaga su valor al volver de la recursión.

### El código

```python
def update_rec(S, v, l, r, i, valor):
    if l == r:
        S["tree"][v] = valor
    else:
        m = (l + r) // 2
        if i <= m:
            update_rec(S, 2 * v + 1, l, m, i, valor)
        else:
            update_rec(S, 2 * (v + 1), m + 1, r, i, valor)
        S["tree"][v] = S["tree"][2 * v + 1] + S["tree"][2 * (v + 1)]


def update(S, i, valor):
    update_rec(S, 0, 0, S["N"] - 1, i, valor)
```

Si el vértice es la hoja buscada, $l = r$, recibe el valor nuevo. Si no, la
posición $i$ cae de un solo lado: con $i \leq m$ baja al hijo izquierdo y si no al
derecho, nunca a los dos. La última línea es la del camino de vuelta, donde cada
ancestro rehace su valor con los de sus hijos.

Para $i = 3$ sobre el arreglo de la sesión, el recorrido es corto. En la raíz
$m = 4$ y $3 \leq 4$, así que baja por la izquierda a $[0,4]$. Ahí $m = 2$ y
$3 > 2$, así que baja por la derecha a $[3,4]$. Ahí $m = 3$ y $3 \leq 3$, así que
baja por la izquierda y llega a la hoja. Son tres comparaciones.

Bajar por un solo lado se parece a la búsqueda binaria, y la diferencia está en el
regreso. La búsqueda binaria descarta la mitad y no vuelve a mirarla. Aquí la
recursión deja los ancestros guardados en una pila implícita, la de los llamados
pendientes, y al desarmarse esa pila cada uno recalcula lo que guarda.

La línea del regreso suma los dos hijos y no solo el que cambió. Desde el vértice
no se sabe cuál de los dos se movió, solo que uno de los dos se movió, de modo que
se recogen los dos.

### Lo que cuesta

El camino de la raíz a una hoja tiene $O(\log N)$ vértices y en cada uno se hace
una suma. Consultar y actualizar cuestan lo mismo. El árbol paga $\log N$ en la
consulta, donde las sumas acumuladas pagaban $1$, y a cambio la actualización baja
de $N$ a $\log N$.

## El valor más frecuente de un rango

### UVa 11235, Frequent values

Llega una secuencia de $N$ enteros ordenada de forma no decreciente y después $Q$
consultas. Cada consulta trae dos posiciones $i$ y $j$, en base $1$, y pide
cuántas veces aparece el valor más frecuente entre ellas. $N$ y $Q$ llegan a cien
mil. La entrada trae varios casos: cada uno empieza con $N$ y $Q$, siguen los $N$
valores y después las $Q$ consultas, y un $N$ de $0$ cierra la entrada.

Enunciado y envío: <https://vjudge.net/problem/UVA-11235>. La página pide cuenta.

### Contar a mano no alcanza

Recorrer el rango llevando la cuenta del valor que más se repite cuesta $O(N)$ por
consulta. Con $N$ y $Q$ de cien mil, el programa no alcanza a responder.

El árbol de sumas de la primera parte tampoco contesta esta pregunta. Dos rangos
con la misma suma pueden tener frecuencias distintas, así que de la suma de un
rango no se saca su valor más frecuente.

### La secuencia se parte en corridas

El caso de ejemplo del enunciado tiene diez posiciones.

| posición | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| valor | $-1$ | $-1$ | 1 | 1 | 1 | 1 | 3 | 10 | 10 | 10 |

Al venir ordenada, las posiciones de un mismo valor quedan pegadas. Un bloque de
posiciones consecutivas con el mismo valor es una corrida, y de una corrida lo
único que importa es su largo. La muestra tiene cuatro.

| corrida | posiciones | largo |
|---|---|---|
| 0 | 1 a 2 | 2 |
| 1 | 3 a 6 | 4 |
| 2 | 7 | 1 |
| 3 | 8 a 10 | 3 |

La respuesta a un rango que empieza y termina justo en el borde de una corrida es
el largo más grande de las corridas que abarca.

### El árbol de máximos sobre los largos

El árbol no se levanta sobre la secuencia sino sobre el vector de largos,
$[2,4,1,3]$, con una posición por corrida. La operación es el máximo y su neutro
es $-\infty$, de modo que un vértice disjunto devuelve $-\infty$ y pierde
cualquier comparación.

| $v$ | intervalo de corridas | valor |
|---|---|---|
| 0 | $[0,3]$ | 4 |
| 1 | $[0,1]$ | 4 |
| 2 | $[2,3]$ | 3 |
| 3 | $[0]$ | 2 |
| 4 | $[1]$ | 4 |
| 5 | $[2]$ | 1 |
| 6 | $[3]$ | 3 |

Cuatro corridas dan siete vértices y el árbol queda perfecto, porque $4$ es
potencia de dos. La raíz guarda $4$, el largo de la corrida más grande de toda la
secuencia.

### La trampa está en los extremos

La consulta `5 10` empieza dentro de la corrida de los unos, donde solo caben dos
de sus cuatro posiciones, la $5$ y la $6$. Preguntarle al árbol por las corridas
$1$ a $3$ devolvería $4$, y la respuesta correcta es $3$.

Lo que se cuenta aparte son los dos extremos. Por la izquierda, lo que queda de la
corrida de $i$ desde $i$ hasta su final. Por la derecha, lo que alcanza de la
corrida de $j$ desde su inicio hasta $j$. Al árbol solo va el máximo de las
corridas de en medio, que son las que entran completas. Y si $i$ y $j$ caen en la
misma corrida, el rango tiene un solo valor y la respuesta es $j - i + 1$, sin
tocar el árbol.

### La traza de las tres consultas

| consulta | corridas de $i$ y $j$ | izquierda | derecha | medio | respuesta |
|---|---|---|---|---|---|
| `2 3` | 0 y 1 | 1 | 1 | vacío | 1 |
| `1 10` | 0 y 3 | 2 | 3 | $\max(4,1) = 4$ | 4 |
| `5 10` | 1 y 3 | 2 | 3 | $\max(1) = 1$ | 3 |

La primera cae en dos corridas distintas pero pegadas. No queda ninguna corrida en
el medio, el árbol no se consulta, y cada extremo aporta una sola posición: la
$2$ de la corrida de los menos uno y la $3$ de la corrida de los unos.

La segunda abarca la secuencia entera. Los dos extremos entran completos, con $2$
y $3$, y en el medio quedan las corridas $1$ y $2$. El árbol devuelve
$\max(4,1) = 4$, que le gana a los dos extremos.

La tercera es la que delata el método. El medio es solo la corrida $2$ y devuelve
$1$. De la corrida de los unos alcanzan dos posiciones y de la de los dieces,
tres, así que gana el $3$.

### Comprimir la secuencia

```python
def comprimir(a, n):
    # A esta ordenada: los valores iguales forman corridas contiguas.
    # run_id[k]  = indice de corrida de la posicion k
    # run_ini/run_fin = extremos de cada corrida; run_len = su longitud
    run_id = [0] * n
    run_ini = []
    run_fin = []
    run_len = []
    inicio = 0
    for i in range(1, n + 1):
        if i == n or a[i] != a[inicio]:
            corrida = len(run_len)
            run_ini.append(inicio)
            run_fin.append(i - 1)
            run_len.append(i - inicio)
            for k in range(inicio, i):
                run_id[k] = corrida
            inicio = i
    return run_id, run_ini, run_fin, run_len
```

Cuatro arreglos salen de un recorrido: en qué corrida cae cada posición, dónde
empieza cada corrida, dónde termina y cuál es su largo. El recorrido llega hasta
`n` para que la condición `i == n` cierre la última corrida sin salirse del
arreglo. Una corrida termina cuando el valor cambia, y ahí se anotan sus dos
extremos, su largo y la corrida de cada una de sus posiciones.

Sobre el ejemplo, en base $0$, `run_ini` queda en `[0, 2, 6, 7]`, `run_fin` en
`[1, 5, 6, 9]` y `run_len` en `[2, 4, 1, 3]`.

### El árbol de máximos y la respuesta

```python
def query(tree, v, l, r, ql, qr):
    if qr < l or r < ql:
        resultado = MENOS_INF              # disjunto: neutro del maximo
    elif ql <= l and r <= qr:
        resultado = tree[v]                # contenido
    else:
        m = (l + r) // 2                   # solapado
        resultado = max(query(tree, 2*v+1, l, m, ql, qr),
                        query(tree, 2*v+2, m+1, r, ql, qr))
    return resultado
```

Los tres casos son los mismos de la primera parte. Lo que cambia son dos cosas: el
neutro del disjunto, que pasa de $0$ a `MENOS_INF`, y la línea que combina, que
pasa de `+` a `max`.

```python
def resolver(n, a, consultas):
    run_id, run_ini, run_fin, run_len = comprimir(a, n)
    corridas = len(run_len)
    tree = [MENOS_INF] * (4 * corridas)
    build(run_len, tree, 0, 0, corridas - 1)

    respuestas = []
    for (qi, qj) in consultas:
        izq = qi - 1                       # las consultas llegan en base 1
        der = qj - 1
        if run_id[izq] == run_id[der]:
            # i y j caen en la misma corrida
            respuestas.append(der - izq + 1)
        else:
            ri = run_id[izq]
            rd = run_id[der]
            parte_izq = run_fin[ri] - izq + 1     # resto de la corrida de i
            parte_der = der - run_ini[rd] + 1     # tramo inicial de la de j
            medio = MENOS_INF
            if ri + 1 <= rd - 1:
                # corrida mas larga totalmente contenida entre ambas
                medio = query(tree, 0, 0, corridas - 1, ri + 1, rd - 1)
            respuestas.append(max(parte_izq, parte_der, medio))
    return respuestas
```

El árbol se reserva con $4C$ casillas, donde $C$ es el número de corridas, y se
llena con el neutro del máximo antes de construir. Las consultas llegan en base
$1$ y lo primero es restarles uno.

Cuando las dos posiciones pertenecen a la misma corrida, la respuesta es el largo
del rango. Cuando caen en corridas distintas hay tres candidatos, y el árbol solo
se consulta si queda al menos una corrida entre las dos. Si no queda ninguna, el
medio se va con el neutro y pierde la comparación.

### Cómo se lee la entrada

```python
def main():
    datos = sys.stdin.read().split()
    pos = 0
    salida = []
    n = int(datos[pos])
    pos = pos + 1
    while n != 0:
        q = int(datos[pos])
        pos = pos + 1
        a = [0] * n
        for k in range(n):
            a[k] = int(datos[pos])
            pos = pos + 1
        consultas = []
        for k in range(q):
            qi = int(datos[pos])
            qj = int(datos[pos + 1])
            pos = pos + 2
            consultas.append((qi, qj))
        for valor in resolver(n, a, consultas):
            salida.append(str(valor))
        n = int(datos[pos])
        pos = pos + 1
    sys.stdout.write("\n".join(salida) + "\n")
```

La entrada entera se lee de una vez y se parte en palabras, y un índice `pos`
avanza sobre la lista. El `while` de afuera se detiene con el $0$ del final. Leer
por tokens evita el problema de que los números de un caso no vengan repartidos en
líneas de la forma esperada.

### Lo que cuesta la solución entera

Comprimir es un recorrido, $O(N)$. Construir el árbol sobre las corridas es
$\Theta(C)$, y $C$ nunca pasa de $N$. Cada consulta hace aritmética de índices y a
lo sumo una consulta al árbol, $O(\log C)$. El total queda en $O(N + Q \log N)$.

Los dos casos extremos salen de la misma cuenta. Con todos los valores distintos
hay $N$ corridas de largo $1$ y la respuesta siempre es $1$. Con todos iguales hay
una sola corrida y ninguna consulta toca el árbol.

Esta solución se envió en Python durante la sesión y el juez la aceptó.

## Potentiometers

### UVa 12086

Hay $N$ potenciómetros en línea, numerados desde $1$, cada uno con su resistencia.
Dos acciones se repiten hasta la palabra `END`: `S x r` pone la resistencia $x$ en
$r$ ohmios, y `M x y` mide la suma de las resistencias de la $x$ a la $y$. La
entrada trae varios casos y un $N$ de $0$ la cierra.

Enunciado y envío: <https://vjudge.net/problem/UVA-12086>. La página pide cuenta.

Es el árbol de la sesión sin nada encima. `S` actualiza una posición y `M`
consulta la suma de un rango. Con cien mil acciones, recorrer el rango en cada `M`
no alcanza.

### La entrada, línea por línea

El caso de ejemplo del enunciado es este.

```text
10
1 2 3 4 5 6 7 8 9 10
M 1 10
S 1 10
M 1 10
END
0
```

Y esta es su salida.

```text
Case 1:
55
64
```

| la línea | qué dice |
|---|---|
| `10` | el caso trae diez potenciómetros |
| `1 2 3 4 5 6 7 8 9 10` | sus resistencias, en orden |
| `M 1 10` | mide del primero al décimo |
| `S 1 10` | pone la resistencia $1$ en $10$ ohmios |
| `M 1 10` | vuelve a medir lo mismo |
| `END` | el caso termina |
| `0` | no viene otro caso |

La primera `M` mide las diez y da $55$. La `S` pone la primera resistencia en $10$
y la segunda `M` da $64$, que es $55 - 1 + 10$. La salida lleva el encabezado del
caso y una línea en blanco entre casos, sin línea antes del primero.

En la solución publicada la suma cabe en un entero de 32 bits: con $N$ hasta
$200\,000$ y resistencias de $0$ a $1000$, el total no pasa de $2 \cdot 10^8$.

### Cómo leer la entrada

```cpp
#include <cstdio>

// UVa 12086, solo la lectura. Tres cosas que cuidar en este formato:
// el caso termina con la palabra END y no con un numero, la accion llega
// como palabra antes de sus dos enteros, y un N de 0 cierra la entrada.

int main() {
    int n;
    while (scanf("%d", &n) == 1 && n != 0) {
        for (int i = 0; i < n; i++) {
            int r;
            scanf("%d", &r);
            // aqui va r a la posicion i del arreglo
        }
        char accion[8];
        scanf("%s", accion);
        while (accion[0] != 'E') {
            int x, y;
            scanf("%d %d", &x, &y);
            if (accion[0] == 'S') {
                // poner la resistencia x en y
            } else {
                // medir de x a y
            }
            scanf("%s", accion);
        }
    }
    return 0;
}
```

El `while` de afuera lee el $N$ de cada caso y se detiene con el $0$ del final.
Adentro entran las $N$ resistencias, que son las hojas del árbol, y después la
primera acción, que se lee como palabra.

Basta mirar la primera letra de la acción: `E` termina el caso, `S` actualiza y
`M` consulta. Los dos enteros se leen después de la palabra, y al final del ciclo
se lee la palabra siguiente para volver a preguntar. Un `scanf` de entero en el
sitio de la palabra se atora en la letra y todo lo que viene después se lee mal.

### Las posiciones vienen en base 1

`S x r` actualiza la posición $x - 1$ del arreglo y `M x y` consulta de $x - 1$ a
$y - 1$. Con cien mil acciones, $O(\log N)$ por acción alcanza y $O(N)$ no.

La solución en Python dio TLE en el juez y la misma solución en C++ pasó. El
algoritmo es idéntico en las dos, con la construcción, la consulta de tres casos y
la actualización de la primera parte.

## Hasta dónde llega la estructura

### Otras operaciones

A la operación se le pide ser asociativa y tener neutro. El mínimo con $+\infty$,
el máximo con $-\infty$ y el producto con $1$ entran sin cambiarle la forma al
árbol: cambian la línea que combina los hijos y el neutro del caso disjunto. El
árbol de máximos de UVa 11235 sale de hacerle ese cambio al de la primera parte.

### Actualizar un rango entero

Sumarle $10$ a cien mil posiciones, una por una, cuesta una actualización por
posición, $O(N \log N)$ para lo que debería ser una sola operación. La estructura
tal como está no baja de ahí.

Lo que lo resuelve es una marca pendiente. En vez de seguir bajando, el vértice ya
contenido en el rango anota que a todo su intervalo le falta sumar $10$, y la
marca baja a sus hijos solo cuando una consulta pasa por ahí. El curso no alcanzó
a cubrirlo.

### Los árboles de Fenwick

Los árboles de Fenwick atacan el mismo tipo de pregunta sobre rangos de un
arreglo que cambia, con la actualización limitada a una posición y con bastante
menos código.

## Errores comunes

- **Confundir la forma del montículo con la de este árbol.** Los dos viven en un
  arreglo plano y los dos bajan un nivel con una cuenta sobre el índice, y ahí
  termina el parecido. El montículo se llena de izquierda a derecha y no deja
  huecos. El árbol de segmentos deja huecos, por eso se reservan $4N$ casillas, y
  sus hojas quedan a dos profundidades distintas cuando $N$ no es potencia de dos.
- **Partir en $[m, R]$ en vez de $[m+1, R]$.** Si el hijo derecho recibe el mismo
  $m$ que el izquierdo, la posición $m$ queda contada dos veces, y además el
  intervalo del hijo derecho puede quedar igual al del padre, con lo que la
  recursión no llega nunca al caso base.
- **Olvidar que las posiciones del juez vienen en base 1.** En los dos problemas
  las posiciones llegan numeradas desde $1$ y el arreglo está numerado desde $0$.
  Restarle uno a un extremo y no al otro corre el rango una posición. No restarle a
  ninguno lo saca del arreglo por la derecha.
- **Preguntarle al árbol de máximos por una corrida que la consulta corta por la
  mitad.** Es lo que delata la consulta `5 10` de UVa 11235: el árbol devuelve $4$,
  el largo completo de la corrida de los unos, y de esa corrida el rango solo toma
  dos posiciones. Al árbol van las corridas que entran completas, y los dos
  extremos se cuentan con aritmética de índices.
- **Creer que la respuesta de un rango se puede sacar de la suma.** Dos rangos con
  la misma suma pueden tener frecuencias distintas, y lo mismo pasa con el máximo y
  con la mediana. Cada pregunta pide su propio árbol, con su operación y su neutro,
  y hay preguntas que no caben en ninguno porque la operación que piden no es
  asociativa.

## El código de la clase

[segmentos.py](./codigo/segmentos.py) trae el árbol de sumas de la sesión, con
`build`, `query` y `update` sobre la numeración que usa la raíz $0$ y los hijos
$2v+1$ y $2(v+1)$.
[uva11235.py](./codigo/uva11235.py) es la solución de Frequent values, con la
compresión en corridas, el árbol de máximos sobre los largos y el manejo de los
dos extremos.
[uva12086.py](./codigo/uva12086.py) es la solución de Potentiometers en Python, la
que da TLE en el juez.
[uva12086.cpp](./codigo/uva12086.cpp) es la misma solución en C++, la que pasa.
[lectura12086.cpp](./codigo/lectura12086.cpp) es solo la lectura de la entrada de
Potentiometers, con el ciclo de casos y la acción que llega como palabra.

## Ejercicios

### Para el navegador

[Los seis ejercicios del tema](../../../actividades/ayg-puj/arboles-de-segmentos/index.md){ target=_blank rel=noopener }
van en el mismo orden de la sesión, sobre otro arreglo y con otras consultas: la
construcción vértice por vértice con las casillas de $4N$ al lado, los tres casos
de la consulta pintados sobre el árbol, la actualización por la rama de ancestros,
los dos problemas de juez y una comparación de las tres formas que cuenta casillas
leídas.

### A mano

1. Cambie la operación a mínimo y diga qué devuelve cada uno de los tres casos.
   Después haga que el árbol devuelva el mínimo y la posición donde está.
2. Sobre el árbol de la sesión, haga la traza de $q(0,9)$ y la de $q(4,4)$. Diga
   cuántos vértices visita cada una y en qué caso cae el primer vértice de cada
   traza.
3. Ponga $A[9] = 0$ y diga cuáles vértices cambian y en cuánto. Compruebe que
   $q(3,8)$ no se mueve y explique por qué.
4. Encuentre un arreglo de cinco posiciones para el que una reserva de $2N$
   casillas alcance, y otro de cinco posiciones para el que no. Si no existe
   alguno de los dos, dígalo y justifíquelo con el índice más grande que se usa.

### UVa 11235, Frequent values

`https://vjudge.net/problem/UVA-11235`

Una secuencia de hasta cien mil enteros, ordenada de forma no decreciente, y
hasta cien mil consultas. Cada consulta trae $i$ y $j$ en base $1$ y pide cuántas
veces aparece el valor más frecuente en $A[i..j]$.

Cómo atacarlo. El parámetro no es la secuencia sino el vector de largos de
corrida: se comprime en un recorrido, guardando por corrida su inicio, su fin y su
largo, y sobre ese vector se levanta un árbol de máximos con neutro $-\infty$. La
propiedad que lo hace funcionar es el orden de la entrada, que deja juntas las
posiciones de un mismo valor. La trampa está en los extremos: la consulta puede
cortar una corrida por la mitad, así que al árbol van solo las corridas de en
medio y los dos extremos se cuentan con aritmética de índices. Y el caso de $i$ y
$j$ en la misma corrida se resuelve antes de tocar el árbol.

### UVa 12086, Potentiometers

`https://vjudge.net/problem/UVA-12086`

Una fila de hasta $200\,000$ resistencias, con la acción `S x r` que cambia una y
la acción `M x y` que mide un tramo, repetidas hasta `END`, y varios casos hasta
un $N$ de $0$.

Cómo atacarlo. Es el árbol de sumas tal como quedó, con `update` para `S` y
`query` para `M`. La trampa está en el formato: la acción llega como palabra antes
de sus dos enteros, de modo que un `scanf` de entero en ese sitio se atora en la
letra. Las posiciones vienen desde $1$ y hay que restarle uno a los dos extremos.
La salida lleva el encabezado `Case k:` y una línea en blanco entre casos, sin
línea antes del primero. En Python el envío da TLE, así que la versión que pasa es
la de C++.

## Referencias

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., Stein, C. *Introduction to
  Algorithms*, 3rd ed. MIT Press, 2009. Capítulo 14, aumentar estructuras de
  datos, y Sección 14.3, árboles de intervalos.
- de Berg, M., Cheong, O., van Kreveld, M., Overmars, M. *Computational Geometry:
  Algorithms and Applications*, 3rd ed. Springer, 2008. Sección 10.3, árboles de
  segmentos.
- Halim, S., Halim, F., Effendy, S. *Competitive Programming 4*. Lulu, 2020.
  Capítulo 2, estructuras de datos.
- UVa 11235, Frequent values. `https://vjudge.net/problem/UVA-11235`
- UVa 12086, Potentiometers. `https://vjudge.net/problem/UVA-12086`
