# Bisección y recorridos en grafos · Refuerzo PUJ 7 de noviembre

La sesión arrancó con la bisección sobre la respuesta. El ejemplo de las
antenas en una calle se trazó a mano con distancias reales, buscando el borde
entre la distancia que no alcanza y la que sí; resultó ser UVa 11516, *WiFi*,
que se resolvió en Python y el juez aceptó. La segunda hora fue para UVa 12032,
*The Monkey and the Oiled Bamboo*: la traza de la muestra, la trampa del
salto que gasta fuerza y la solución, que se envió al juez. Después vino el
recorrido en amplitud, con la cola en orden de distancia, el contagio desde
dos focos y UVa 336, *A Node Too Far*. Al final se presentó el recorrido en
profundidad con sus tres estados y UVa 11686, *Pick up sticks*, que queda para
resolver en casa con la solución ya mostrada. La hora de lógica no se dio y pasa al 14 de noviembre.

Al terminar la sesión se espera poder:

- Reconocer un problema de bisección sobre la respuesta, escribir la función
  que comprueba un candidato y verificar que es monótona antes de buscar.
- Fijar los límites de la búsqueda desde el peor y el mejor caso, y decidir
  si se busca sobre enteros o sobre reales con una tolerancia.
- Recorrer un grafo en amplitud con un tope de pasos, sabiendo por qué la
  cola sale en orden de distancia.
- Distinguir en un recorrido en profundidad un nodo en camino de uno
  terminado, y leer un orden válido en las llamadas que terminaron.

## Diapositivas y tablero

[programacion-anotada.pdf](./programacion-anotada.pdf){ target=_blank rel=noopener },
93 páginas: las 85 del deck de programación del bloque con lo escrito encima
durante la sesión y ocho hojas de tablero, las páginas 12 a 16, 19, 20 y 88.

- Las hojas 12 a 14 llevan la bisección del ejemplo de las cuatro casas,
  vuelta por vuelta, desde $[0, 24]$ hasta cerrar en $d = 2{,}5$, con el valor
  de $\varphi$ en cada candidato.
- La 15 y la 16 hacen lo mismo con la muestra de UVa 11516, las casas 1, 3 y
  10 con dos antenas, y en la 16 está la cuenta de cuántas vueltas pide una
  tolerancia $\varepsilon$.
- La 19 tiene la lectura de la entrada de UVa 12032 en Python y en C++, y la
  20, la subida de la muestra con la fuerza que queda después de cada salto.
- La 88 tiene la muestra de UVa 11686 con el grafo de los palitos dibujado.

Lo escrito encima del deck está en la página 8, con la distancia de cada casa
a cada antena; en la 9 y la 10, los tramos que cubre cada antena
con $d = 2$ y con $d = 2{,}5$; en la 11, el intervalo $[0, 24]$ y la condición
de parada $\mathit{fin} - \mathit{ini} > \varepsilon$. La 17 y la 18 tienen la
escalera de la muestra de UVa 12032 con sus saltos y sus límites, 5 y 13. En
la 22 están marcadas las dos representaciones, la matriz y la lista de
adyacencia; la 25 tiene la lista de Python con una inserción al principio que
corre todo lo demás, y la 39 y la 40, el tope del recorrido en amplitud y la
prueba de que un nodo no ha sido descubierto.

La grabación de la sesión, partida en videos cortos por tema, está en la
[lista de reproducción del refuerzo](https://www.youtube.com/playlist?list=PLKsjj1jEesqU){ target=_blank rel=noopener }.

## Código de la sesión

Los programas están en
[codigo/sesion3](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/Refuerzo%20PUJ/B3/codigo/sesion3):

| Archivo | Qué muestra |
|---|---|
| `uva11516.py` | UVa 11516 como quedó escrito en clase: la función que cuenta antenas y la bisección sobre el ancho |
| `uva11516.cpp` | la misma solución en C++, con `scanf` y `printf` |
| `uva11516.in` | la muestra del enunciado |

Se compilan y se prueban como en las sesiones anteriores:

```bash
g++ -std=c++17 -Wall -Wextra -g -o uva11516 uva11516.cpp
./uva11516 < uva11516.in > salida.txt
diff salida.txt esperado.txt
```

Las soluciones de UVa 12032, UVa 336 y UVa 11686 que se mostraron en clase
están en las [soluciones de esta sesión](./Soluciones.md), con su código en
Python y en C++.

## Bisección sobre la respuesta

La búsqueda binaria en sí es corta: mirar la mitad y quedarse con una de las
dos partes. Lo difícil de estos problemas es encontrar sobre qué se busca. En
la calle del deck hay casas en 7, 12, 21 y 24, se instalan $M = 2$ antenas en
cualquier punto, y se pide la menor distancia máxima entre una casa y su
antena más cercana. Probar dónde poner las antenas no lleva a ninguna parte,
porque las posiciones son reales.

La pregunta se cambia por otra que sí se contesta de una pasada:

$$
\varphi(d): \text{¿alcanzan } M \text{ antenas si cada una cubre hasta } d \text{ metros?}
$$

Con las casas ordenadas, se toma la primera sin cubrir y se pone su antena lo
más a la derecha posible, en $\mathit{casa} + d$; desde ahí cubre hasta
$\mathit{casa} + 2d$. Se repite y se cuentan las antenas. Si con $d$ alcanzan,
con cualquier $d' > d$ también, porque cada antena cubre más: los candidatos
quedan partidos en un tramo falso y uno cierto, y la respuesta es el borde.
Sin esa monotonía no hay bisección, y por eso se comprueba antes de escribir
el ciclo.

Con $d = 2$ la primera antena va en 9 y cubre hasta 11; la segunda, en 14, y
cubre hasta 16; la tercera, en 23. Hacen falta tres y solo hay dos:
$\varphi(2)$ es falso. Con $d = 2{,}5$ bastan dos, en 9,5 y en 23,5. El deck
pone la segunda en 22, que también sirve, y la página 8 tiene la distancia de
cada casa a su antena más cercana con esa posición: 2,5, 2,5, 1 y 2. La
respuesta es la mayor de esas distancias, 2,5, no su promedio.

La búsqueda arranca en $[0, 24]$: con $d = 0$ cada casa necesitaría su antena,
y con la longitud de la calle una sola antena cubre todo. Estas son las vueltas
del tablero, con los extremos exactos:

| Intervalo | $d$ | Antenas | $\varphi(d)$ |
|---|---|---|---|
| $[0, 24]$ | 12 | 1 | cierto |
| $[0, 12]$ | 6 | 2 | cierto |
| $[0, 6]$ | 3 | 2 | cierto |
| $[0, 3]$ | 1,5 | 3 | falso |
| $[1{,}5;\ 3]$ | 2,25 | 3 | falso |
| $[2{,}25;\ 3]$ | 2,625 | 2 | cierto |
| $[2{,}25;\ 2{,}625]$ | 2,4375 | 3 | falso |
| $[2{,}4375;\ 2{,}625]$ | 2,53125 | 2 | cierto |
| $[2{,}4375;\ 2{,}53125]$ | 2,484375 | 3 | falso |

Cada vuelta deja la mitad del intervalo, y los extremos se cierran sobre 2,5.
En el tablero algunos puntos medios quedaron redondeados, como 2,5375 por
2,53125; la tabla trae los exactos. Como la respuesta es real, no hay un entero donde
parar: el ciclo corre mientras $\mathit{fin} - \mathit{ini} > \varepsilon$, y
en clase se recomendó una tolerancia del orden de $10^{-9}$.

## UVa 11516: WiFi

- Enunciado y envío: <https://vjudge.net/problem/UVA-11516>

El ejemplo de la calle es este problema. Cada caso trae $n$, los puntos de
acceso que se pueden instalar, y $m$, el número de casas, seguido de las $m$
posiciones. Se imprime la mayor distancia entre una casa y su punto de acceso
más cercano, la menor posible, con un decimal. La muestra:

```text
1
2 3
1
3
10
```

Las casas están en 1, 3 y 10, hay dos puntos de acceso y la salida es `1.0`:
uno en 2, que deja a 1 y a 3 a distancia 1, y otro en la casa 10.

### La muestra con la bisección

Las hojas 15 y 16 del tablero trazan la búsqueda sobre $d$ en $[0, 10]$:

| Intervalo | $d$ | Antenas | $\varphi(d)$ |
|---|---|---|---|
| $[0, 10]$ | 5 | 1 | cierto |
| $[0, 5]$ | 2,5 | 2 | cierto |
| $[0;\ 2{,}5]$ | 1,25 | 2 | cierto |
| $[0;\ 1{,}25]$ | 0,625 | 3 | falso |
| $[0{,}625;\ 1{,}25]$ | 0,9375 | 3 | falso |
| $[0{,}9375;\ 1{,}25]$ | 1,09375 | 2 | cierto |
| $[0{,}9375;\ 1{,}09375]$ | 1,015625 | 2 | cierto |

Con $d = 0{,}9375$ la primera antena cubre hasta $1 + 2 \cdot 0{,}9375 = 2{,}875$
y no alcanza la casa 3; con $d = 1{,}09375$ llega hasta 3,1875. Los
intervalos siguientes se cierran sobre 1.

### Sobre el ancho entero

La solución no busca $d$ sino el ancho $2d$ que cubre cada antena. En la
respuesta óptima, la casa más lejana de un punto de acceso está en un extremo
de su grupo, y la distancia es la mitad de lo que separa la primera casa del
grupo de la última. Como las posiciones son enteras, ese ancho es un entero, y
la búsqueda puede ir sobre enteros con una respuesta exacta. La salida es la
mitad del ancho, que termina en `.0` o en `.5`.

```python
import sys


def antenasNecesarias(casas, ancho):
    # Cuántas antenas hacen falta si cada una cubre un tramo de 'ancho' metros.
    # casas viene ordenada; cada antena se pone para la primera casa sin cubrir.
    antenas = 1
    cubreHasta = casas[0] + ancho
    for c in casas:
        if c > cubreHasta:
            antenas = antenas + 1
            cubreHasta = c + ancho
    return antenas


def menorAncho(casas, n):
    # El menor ancho entero con el que alcanzan n antenas.
    lo = 0
    hi = casas[-1] - casas[0]
    while (hi - lo) > 0.001:
        medio = (lo + hi) // 2
        if antenasNecesarias(casas, medio) <= n:
            hi = medio
        else:
            lo = medio + 1
    return lo


def main():
    datos = sys.stdin.read().split()
    pos = 0
    casos = int(datos[pos])
    pos = pos + 1
    salida = []
    caso = 0
    while caso < casos:
        n = int(datos[pos])
        m = int(datos[pos + 1])
        pos = pos + 2
        casas = []
        i = 0
        while i < m:
            casas.append(int(datos[pos]))
            pos = pos + 1
            i = i + 1
        casas.sort()
        ancho = menorAncho(casas, n)
        # la distancia máxima es la mitad del ancho: termina en .0 o en .5
        if ancho % 2 == 0:
            salida.append(str(ancho // 2) + ".0")
        else:
            salida.append(str(ancho // 2) + ".5")
        caso = caso + 1
    print("\n".join(salida))


if __name__ == "__main__":
    main()
```

`antenasNecesarias` es $\varphi$ escrita como conteo: la primera antena cubre
desde la primera casa hasta `casas[0] + ancho`, y cada casa que queda más allá
abre una antena nueva. `menorAncho` busca el menor ancho con el que el conteo
no pasa de $n$. Si alcanza, `hi` baja a `medio`, que puede ser la respuesta;
si no, `lo` sube a `medio + 1`, porque `medio` ya quedó descartado.

En clase la solución se envió primero con `while lo < hi`, y el juez la
aceptó. Después se cambió la condición por `(hi - lo) > 0.001`, la forma de la
búsqueda sobre reales, y se volvió a enviar. Con `lo` y `hi` enteros las dos
condiciones son la misma: la diferencia es 0 o al menos 1, de modo que la
tolerancia efectiva es 1 y el ciclo da las mismas vueltas. Con los casos de
prueba del ejercicio las dos versiones imprimen lo mismo. La de C++ de la
carpeta escribe `lo < hi`.

### Cuántas vueltas

Con un intervalo de largo $L$, después de $v$ vueltas queda uno de largo
$L / 2^v$. En la búsqueda sobre reales el ciclo para cuando eso baja de
$\varepsilon$:

$$
\frac{L}{2^v} < \varepsilon \iff 2^v > \frac{L}{\varepsilon} \iff v > \log_2 \frac{L}{\varepsilon}.
$$

Con $L = 1$ y $\varepsilon = 10^{-3}$, como en la hoja 16, son
$v > 3 \log_2 10 \approx 9{,}97$, diez vueltas. En el tablero la desigualdad
quedó escrita como $2^v < 10^3$; la que vale es la de arriba. Con la calle del
ejemplo, $L = 24$ y $\varepsilon = 10^{-9}$, salen 35 vueltas. La tolerancia
no depende de la entrada, así que el número de vueltas es una constante.

Costo: ordenar las $m$ casas cuesta $O(m \log m)$, y cada vuelta de la
bisección recorre las casas una vez. Sobre el ancho entero hay unas
$\log_2 L$ vueltas, con $L$ la distancia entre la primera y la última casa:
$O(m \log m + m \log L)$ por caso.

## UVa 12032: The Monkey and the Oiled Bamboo

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-12032>
- Actividad: [la escalera y el factor de fuerza](../../../actividades/ayg-puj/busqueda-binaria/escalera.html){ target=_blank rel=noopener }

Una escalera tiene $n$ peldaños a alturas $r_1 < \dots < r_n$, y se sube de
uno en uno desde el suelo, a altura 0. Se arranca con fuerza $k$: ningún salto
puede medir más de $k$, y el salto que mide exactamente $k$ baja la fuerza en
uno. Se pide el menor $k$ con el que se llega arriba.

La muestra trae dos casos. En el primero las alturas son 1, 6, 7, 11 y 13, y
los saltos, 1, 5, 1, 4 y 2. Con $k = 5$ la subida va así:

| Salto | 1 | 5 | 1 | 4 | 2 |
|---|---|---|---|---|---|
| Fuerza antes | 5 | 5 | 4 | 4 | 3 |
| ¿Mide la fuerza? | no | sí | no | sí | no |
| Fuerza después | 5 | 4 | 4 | 3 | 3 |

Llega arriba, y con 4 no se puede dar el salto de 5: la respuesta es 5. La
fuerza no se suma ni se gasta en cada salto; solo baja cuando el salto la
iguala. La trampa se vio cambiando el 11 por un 12. Los saltos quedan 1, 5, 1,
5 y 1, y con $k = 5$ el segundo salto de 5 llega con fuerza 4 y no se puede
dar: hace falta $k = 6$. En el segundo caso, alturas 3, 9, 10 y 14, la salida
es 6.

$\varphi(k)$ es *¿se llega arriba empezando con fuerza $k$?*, y se contesta
simulando la subida. Es monótona: con $k + 1$, ningún salto que cabía deja de
caber. El límite de abajo es el salto más grande, que hay que dar de todos
modos. Arriba sirve la altura del último peldaño, el salto único desde el
suelo, que es el 13 escrito en la página 18; la solución usa el salto más
grande más $n$, porque la fuerza baja a lo sumo una vez por salto y nunca
queda por debajo del salto más grande.

```python
def alcanza(saltos, k):
    # Con fuerza inicial k, ¿se llega al último peldaño?
    fuerza = k
    puede = True
    for s in saltos:
        if s > fuerza:
            puede = False
        elif s == fuerza:
            fuerza = fuerza - 1
    return puede


def minimaFuerza(saltos):
    # El menor k que cumple alcanza(saltos, k).
    lo = max(saltos)
    hi = lo + len(saltos)
    while lo < hi:
        medio = (lo + hi) // 2
        if alcanza(saltos, medio):
            hi = medio
        else:
            lo = medio + 1
    return lo
```

La bisección tiene la misma forma que la de UVa 11516; lo que cambia es la
función. La solución completa, con la lectura y la versión en C++, está en las
[soluciones](./Soluciones.md#hora-1-uva-12032-the-monkey-and-the-oiled-bamboo).
El primer envío en Python volvió con *runtime error*: al programa le faltaba
`import sys`, y `sys.stdin.read()` fallaba antes de leer nada.

Costo: armar los saltos es $\Theta(n)$, y cada vuelta de la bisección los
recorre una vez sobre un rango de $n + 1$ candidatos:
$\Theta(n \log n)$ por caso.

## Recorrido en amplitud

Un grafo se guarda de tres formas, y cada una contesta bien una pregunta
distinta. La lista de adyacencia da los vecinos de un nodo; la matriz de
adyacencia dice en $O(1)$ si una arista existe, y la lista de aristas guarda
cada arista una sola vez. El recorrido en amplitud pide vecinos, así que va con lista
de adyacencia.

En cada vuelta sale el primer nodo $u$ de la cola, se miran sus vecinos, y el
que no se ha tocado recibe $\mathit{dist}[u] + 1$ y entra al final. En la cola
solo hay nodos a distancia $d$ y, detrás, a distancia $d + 1$: los vecinos de
un nodo no salen antes que sus hermanos. Por eso el primer toque ya da la
menor distancia, y cada nodo entra y sale una sola vez. El costo es
$O(V + E)$, siempre que sacar de la cola cueste $O(1)$. Con una `list` de
Python, sacar el primero corre todos los demás una casilla, $O(V)$ por
operación; la cola va con `deque` en Python y con `queue` en C++.

### Un contagio con dos focos

En el grafo de la página 22, con las aristas $\{0, 1\}$, $\{0, 2\}$,
$\{1, 3\}$, $\{2, 3\}$, $\{3, 4\}$, $\{2, 5\}$ y $\{5, 6\}$, los
focos son 0 y 5, y cada día la enfermedad pasa a los vecinos. Con $K = 2$
días, los dos focos entran a la cola con distancia 0:

| Distancia | Nodos |
|---|---|
| 0 | 0, 5 |
| 1 | 1, 2, 6 |
| 2 | 3 |
| 3 | 4 |

El nodo 4 está a distancia 3 de los dos focos y no se contagia. Con 0 como
único foco, a distancia 1 quedan 1 y 2, a distancia 2 quedan 3 y 5, y ni 4 ni 6
se contagian.

El tope se pone en una sola línea. Un nodo a distancia $K$ se cuenta, pero no
se expande:

```python
def bfs(adj, inicio, k):
    # Cuántos nodos quedan a distancia menor o igual a k desde inicio.
    dist = [-1] * len(adj)
    cola = deque()
    dist[inicio] = 0
    cola.append(inicio)
    alcanzados = 1
    while len(cola) > 0:
        u = cola.popleft()
        if dist[u] < k:
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    alcanzados = alcanzados + 1
                    cola.append(v)
    return alcanzados
```

`dist[v] == -1` dice que $v$ no ha sido descubierto. La actividad
[el recorrido con tope de pasos](../../../actividades/ayg-puj/representaciones-y-recorridos/tope.html){ target=_blank rel=noopener }
corre esta función paso a paso.

## UVa 336: A Node Too Far

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-336>

Cada mensaje de una red lleva un TTL. La estación que lo recibe le resta uno y
lo reenvía solo si el resultado no es cero, de modo que llega a los nodos a
distancia menor o igual al TTL. Por cada consulta se pide cuántos nodos de la
red no alcanza. Es el recorrido con tope y un solo origen, y la respuesta es
el total de nodos menos los alcanzados.

La entrada fue lo que más se discutió en clase. Cada red empieza con su número de
conexiones, que no es el de nodos, seguido de esos pares; después vienen las
consultas `nodo TTL`, que terminan en `0 0`, y un número de conexiones igual
a 0 termina la entrada. En la muestra, la primera red tiene 16 conexiones y
dos consultas, desde el nodo 35 con TTL 2 y 3; la segunda tiene 14 conexiones
y cuatro consultas. El contador de casos sigue de una red a la siguiente:

```text
Case 1: 5 nodes not reachable from node 35 with TTL = 2.
Case 2: 1 nodes not reachable from node 35 with TTL = 3.
Case 3: 8 nodes not reachable from node 1 with TTL = 1.
Case 4: 5 nodes not reachable from node 1 with TTL = 2.
Case 5: 3 nodes not reachable from node 3 with TTL = 2.
Case 6: 1 nodes not reachable from node 3 with TTL = 3.
```

Los nodos son enteros positivos cualesquiera, no $0$ a $V - 1$. La solución
les asigna un índice con un diccionario en Python y con un `map` en C++, y
como el grafo no es dirigido, cada par entra en las dos listas. Una consulta
puede nombrar un nodo que no está en la red; en ese caso no alcanza a
ninguno. El `map` busca en $O(\log V)$; en clase se comentó que una tabla hash
lo haría en $O(1)$ en promedio, aunque con $V \le 30$ las dos versiones
pasan. El código completo está en las
[soluciones](./Soluciones.md#hora-2-uva-336-a-node-too-far).

Costo: $O(V + E)$ por consulta, con $V \le 30$ y $E \le 435$.

## Recorrido en profundidad y ciclos

El recorrido en profundidad se escribe con recursión, que es una pila
implícita, o con una pila explícita. Las llamadas abiertas forman el camino
del inicio al nodo actual. Para saber si un grafo dirigido tiene un ciclo, la
primera idea es marcar visitado y declarar ciclo cuando una arista llega a un
nodo ya visitado. En el diamante del deck, con aristas $0 \to 1$, $0 \to 2$,
$1 \to 3$ y $2 \to 3$, eso falla: al bajar por 2 se encuentra 3 ya visitado y
se declara un ciclo que no existe.

Hacen falta tres estados. Sin visitar es un nodo cuya llamada no ha empezado,
y la arista baja a él. En camino es uno cuya llamada sigue abierta, y una
arista hacia él cierra un ciclo, porque desde ese nodo ya se había bajado
hasta el actual. Terminado es uno cuya llamada ya devolvió, y la arista no
hace nada. El tiempo de descubrimiento es cuando se entra a un nodo, y el de
finalización, cuando su llamada sale por completo de la pila.

En el diamante las llamadas terminan en el orden 3, 1, 2, 0. Al revés, 0, 2, 1,
3, cada arista va de izquierda a derecha: cuando un nodo termina, todo lo que
sale de él ya terminó.

## UVa 11686: Pick up sticks

- Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-11686>

Hay $n$ palitos numerados de 1 a $n$ y $m$ pares `a b`, cada uno con el
significado de que $a$ está encima de $b$, con $n$ y $m$ hasta un millón. Un
palito se recoge cuando ya se recogieron todos los que tiene encima, y se pide un orden para recogerlos todos, o
`IMPOSSIBLE` si no existe. En la muestra de la hoja 88, con 3 palitos,
1 encima de 2 y 2 encima de 3, el recorrido desde 1 baja a 2 y a 3, las
llamadas terminan en el orden 3, 2, 1, y al revés queda la salida, 1, 2, 3.
Una arista hacia un nodo en camino es un ciclo, y entonces no hay orden.

Este problema queda para resolver en casa. Al final de la sesión se mostró la
solución en Python, que se envió al juez, y la que va en C++ tiene una
condición propia. En una cadena de palitos cada uno es una llamada abierta
encima de la anterior, y con una pila de 8 MB la recursiva de C++ reventó con
87 826 niveles, mientras el enunciado admite un millón. Al juez va la versión
con pila explícita. Las tres están en las
[soluciones](./Soluciones.md#hora-3-uva-11686-pick-up-sticks), y la actividad
[los tres estados y los ciclos](../../../actividades/ayg-puj/orden-topologico-dfs-low/palitos.html){ target=_blank rel=noopener }
corre el recorrido sobre la muestra.

Costo: $\Theta(n + m)$ por caso.

## Lo que sigue

La hora de lógica, con los invariantes de ciclo de UVa 11078 y el ejercicio en
papel de UVa 507, no se dio y pasa al
[14 de noviembre](../B4/14%20de%20noviembre.%20Colas%20de%20prioridad,%20bisecci%C3%B3n%20y%20dividir%20y%20vencer%C3%A1s.md#logica).
Sus diapositivas y sus soluciones están en la
[página de la sesión](./7%20de%20noviembre.%20Bisecci%C3%B3n%20y%20recorridos%20en%20grafos.md#logica).

Queda propuesto UVa 714, *Copying Books*, que el deck trae al final: repartir
libros en orden entre escribas para que el que más copie copie lo menos
posible. Es la bisección de UVa 11516 con otra función, *¿alcanzan los
escribas si ninguno copia más de $t$ páginas?* El enunciado y el envío están
en <https://vjudge.net/problem/UVA-714>.
