# Orden topológico

**Semana del 21 de septiembre de 2026.**

Un grafo dirigido dice qué va antes de qué: prerrequisitos, dependencias,
tareas que esperan a otras. El orden topológico es una forma de ponerlo todo
en fila sin violar ninguna flecha, y el algoritmo de Kahn lo encuentra con
una cola de fuentes y un contador por vértice. El mismo algoritmo dice,
cuando no puede, que el grafo tiene un ciclo.

## Diapositivas

[Orden topológico](clase08-orden-topologico.pdf){ target=_blank } — 72
páginas: las 71 láminas con las anotaciones de la sesión y una de tablero.
La ejecución del algoritmo va lámina por lámina: en cada una, un color por
vértice —blanco pendiente, naranja en la cola, verde ya emitido— y el
contador de entrada al lado.

## Un plan de estudios

Siete materias y seis prerrequisitos, cada uno dibujado como una flecha de
la materia que se cursa antes hacia la que se cursa después:

| Antes | Después |
|---|---|
| Programación (Prog) | Estructuras de datos (ED) |
| Lógica (Lóg) | Matemáticas discretas (MD) |
| Estructuras de datos | Árboles y grafos (AyG) |
| Matemáticas discretas | Árboles y grafos |
| Estructuras de datos | Bases de datos (BD) |
| Árboles y grafos | Análisis de algoritmos (AA) |

Hay que cursarlas de a una, en algún orden que no viole ningún prerrequisito.
Antes de cualquier algoritmo, tres intentos a mano:

- Prog, ED, Lóg, MD, AyG, AA, BD sirve: cada materia aparece después de sus
  prerrequisitos.
- Lóg, MD, Prog, ED, BD, AyG, AA también sirve, y es distinto.
- Prog, AyG, … no sirve desde la segunda posición: a AyG le llegan dos
  flechas y ninguna de las dos materias ha pasado.

Lo que dejan los intentos: hay varios órdenes que sirven; los que sirven
empiezan por una materia a la que no le llega ninguna flecha; y una materia
se puede poner cuando todas las que le llegan ya están puestas, y no antes.

## La definición

**Definición (orden topológico, CLRS Sección 22.4, p. 612).** Un orden
topológico de un grafo dirigido $G = (V, E)$ es un orden lineal de todos sus
vértices tal que, si $G$ contiene la arista $(u, v)$, entonces $u$ aparece
antes que $v$ en el orden.

**Definición (grafo dirigido acíclico).** Un grafo dirigido es acíclico
cuando no contiene ningún ciclo dirigido. CLRS lo abrevia *dag*.

**Entrada:** un grafo dirigido $G$ en lista de adyacencia. **Salida:** una
lista con los $n$ vértices, cada uno una sola vez, donde para toda arista
$(u, v)$ el vértice $u$ está antes que $v$; o el aviso de que no existe tal
lista.

Con los vértices numerados $0$ AyG, $1$ Prog, $2$ MD, $3$ ED, $4$ AA,
$5$ Lóg, $6$ BD, el plan de estudios es
`[[4], [3], [0], [0, 6], [], [2], []]` y el primer intento de arriba es la
salida `[1, 3, 5, 2, 0, 4, 6]`.

### Cuándo no existe

**Teorema.** Si un grafo dirigido $G$ contiene un ciclo, entonces $G$ no
tiene orden topológico.

*Demostración.* Se procede por contradicción. Supóngase que $G$ contiene el
ciclo $v_1 \to v_2 \to \cdots \to v_k \to v_1$ y que existe un orden
topológico; sea $p(v)$ la posición de $v$ en ese orden. Cada arista del ciclo
obliga a que su cola vaya antes que su punta:
$p(v_1) < p(v_2) < \cdots < p(v_k)$ por las aristas
$(v_1, v_2), \ldots, (v_{k-1}, v_k)$, y $p(v_k) < p(v_1)$ por la arista
$(v_k, v_1)$. Encadenando, $p(v_1) < p(v_1)$, que es imposible. Por lo tanto,
se puede concluir que un grafo con un ciclo dirigido no tiene orden
topológico. $\blacksquare$

### No es único

El plan de estudios tiene $22$ órdenes válidos. En todos, $1$ y $5$ van antes
que $3$ y $2$; $3$ y $2$ antes que $0$; $0$ antes que $4$; $3$ antes que $6$.
Lo demás es libre: dos vértices sin camino entre ellos, como BD y MD, pueden
ir en cualquier orden relativo. Cuando un enunciado dice *cualquier orden
válido* se refiere a esto; cuando pide uno en particular, hay que leer cuál.

## El algoritmo de Kahn

**Definición (fuente).** Un vértice con grado de entrada $0$: no le llega
ninguna arista.

Una fuente puede ir de primera, porque nada tiene que ir antes que ella. Una
vez puesta, se retira del grafo con sus aristas de salida; en lo que queda
puede haber fuentes nuevas, y se repite. Lo que hace falta es que siempre haya
una fuente que sacar mientras queden vértices.

**Lema.** Todo grafo dirigido acíclico con al menos un vértice tiene al menos
una fuente.

*Demostración.* Se procede por contradicción: supóngase que $G$ es acíclico,
tiene $n \geq 1$ vértices y ninguno es fuente. Entonces a todo vértice le
llega al menos una arista. Se toma cualquier $w_0$ y se camina hacia atrás:
$w_1$ es un vértice con arista $(w_1, w_0)$, $w_2$ uno con arista
$(w_2, w_1)$, y así. La caminata nunca se detiene, porque cada vértice tiene
un predecesor. Tras $n$ pasos se han nombrado $n + 1$ vértices
$w_0, \ldots, w_n$ y el grafo solo tiene $n$: alguno se repite, $w_i = w_j$
con $i < j$. El tramo $w_j \to w_{j-1} \to \cdots \to w_i$ es un ciclo
dirigido, contra la hipótesis. Por lo tanto, se puede concluir que todo grafo
dirigido acíclico no vacío tiene una fuente. $\blacksquare$

Como quitar vértices no crea ciclos, lo que queda después de retirar una
fuente sigue siendo acíclico y vuelve a tener una: el procedimiento no se
atasca hasta vaciar el grafo.

### La versión que uno escribe primero

Buscar una fuente entre los no emitidos, emitirla, restar uno al contador de
cada sucesor, y volver a buscar.

**$KahnIngenuo(G)$**

1. Calcular $v.entrada$ para cada vértice $v$
2. Marcar todos los vértices como no emitidos; $orden$ vacío
3. Buscar, recorriendo los vértices desde el primero, uno no emitido con $v.entrada = 0$
4. Mientras la búsqueda encuentre un vértice $u$:
    1. Agregar $u$ al final de $orden$ y marcarlo emitido
    2. Para cada $v$ adyacente a $u$: $v.entrada = v.entrada - 1$
    3. Repetir la búsqueda del paso 3
5. Retornar $orden$

```python
def grados_de_entrada(G):
    # entrada[v]: cuantas aristas llegan a v
    n = len(G)
    entrada = [0] * n
    u = 0
    while u < n:
        for v in G[u]:
            entrada[v] = entrada[v] + 1
        u = u + 1
    return entrada


def fuente_pendiente(entrada, emitido):
    # El primer vertice sin emitir con contador 0, o -1
    n = len(entrada)
    resultado = -1
    u = 0
    while u < n and resultado == -1:
        if not emitido[u] and entrada[u] == 0:
            resultado = u
        u = u + 1
    return resultado


def kahn_ingenuo(G):
    # Cada vuelta busca una fuente desde el principio de la lista
    n = len(G)
    entrada = grados_de_entrada(G)
    emitido = [False] * n
    orden = []
    u = fuente_pendiente(entrada, emitido)
    while u != -1:
        orden.append(u)
        emitido[u] = True
        for v in G[u]:
            entrada[v] = entrada[v] - 1
        u = fuente_pendiente(entrada, emitido)
    return orden
```

Cada búsqueda recorre hasta $n$ vértices y hay $n$ búsquedas: $\Theta(n^2)$.
Los decrementos suman $m$ en total. En conjunto, $\Theta(n^2 + m)$: con
$10^5$ vértices son $10^{10}$ pasos. Sobre el plan de estudios devuelve
`[1, 3, 5, 2, 0, 4, 6]`; como la búsqueda arranca siempre desde el vértice
$0$, sale la fuente de número más bajo que haya en ese momento.

### Dónde se pierde el tiempo

La búsqueda del paso 3 recorre la lista entera para encontrar una fuente que
el algoritmo ya sabía dónde estaba: un vértice se vuelve fuente en el instante
exacto en que su contador llega a $0$, y eso pasa dentro del paso 4.2, con
$v$ en la mano.

En vez de buscarlas, las fuentes se guardan a medida que aparecen. Al
arrancar, las que ya tienen contador $0$; después, cada $v$ cuyo contador
llegue a $0$ al restar. Una cola sirve: se saca por el frente y se agrega por
el final, y cada vértice entra una sola vez, porque su contador llega a $0$
una sola vez.

**$Kahn(G)$**

1. Calcular $v.entrada$ para cada vértice $v$
2. Para cada vértice $v$: si $v.entrada = 0$, agregar $v$ a la cola $P$
3. $orden$ vacío
4. Mientras la cola $P$ no esté vacía:
    1. Retirar el frente $u$ de $P$ y agregarlo al final de $orden$
    2. Para cada $v$ adyacente a $u$:
        1. $v.entrada = v.entrada - 1$
        2. Si $v.entrada = 0$: agregar $v$ a $P$
5. Retornar $orden$

```python
from collections import deque

def kahn(G):
    # Las fuentes esperan en una cola
    n = len(G)
    entrada = grados_de_entrada(G)
    cola = deque()
    u = 0
    while u < n:
        if entrada[u] == 0:
            cola.append(u)
        u = u + 1
    orden = []
    while len(cola) > 0:
        u = cola.popleft()
        orden.append(u)
        for v in G[u]:
            entrada[v] = entrada[v] - 1
            if entrada[v] == 0:
                cola.append(v)
    return orden
```

Dos detalles. Los vértices aislados tienen contador $0$ desde el principio y
entran a la cola en el paso 2: salen en el orden sin que nadie los mencione.
Y el contador se resta *antes* de preguntar si llegó a $0$; al revés, la
fuente nueva se pierde.

La cola no se cambia por recursión. Los llamados recursivos vuelven en orden
inverso al que se hicieron, que es una pila: el último en entrar es el primero
en atenderse. Con una pila el orden que sale sigue siendo topológico —toda
fuente se puede emitir— pero es otro, y se pierde la propiedad de la cola,
que atiende las fuentes en el orden en que aparecieron. El recorrido que sí se
escribe recursivo es la búsqueda en profundidad.

### A mano sobre el plan de estudios

Contadores al arrancar: AyG $2$, Prog $0$, MD $1$, ED $1$, AA $1$, Lóg $0$,
BD $1$. Fuentes: Prog y Lóg, y entran a la cola en orden de número:
$P = [\text{Prog}, \text{Lóg}]$.

| Paso | Sale $u$ | Contadores que bajan | Cola $P$ después |
|---|---|---|---|
| 1 | Prog | ED $1 \to 0$, entra | Lóg, ED |
| 2 | Lóg | MD $1 \to 0$, entra | ED, MD |
| 3 | ED | AyG $2 \to 1$; BD $1 \to 0$, entra | MD, BD |
| 4 | MD | AyG $1 \to 0$, entra | BD, AyG |
| 5 | BD | ninguno | AyG |
| 6 | AyG | AA $1 \to 0$, entra | AA |
| 7 | AA | ninguno | vacía |

$orden =$ Prog, Lóg, ED, MD, BD, AyG, AA, que en números es
`[1, 5, 3, 2, 6, 0, 4]`. AyG no entró a la cola en el paso 3, aunque ya había
salido una de sus dos materias previas, porque su contador quedó en $1$: le
faltaba MD.

### Por qué el orden que sale es topológico

Lo que sostiene el algoritmo: para todo vértice $v$ en la cola o ya emitido,
todos los predecesores de $v$ están en $orden$. Vale al arrancar, porque en la
cola solo hay vértices sin predecesores. Y se conserva, porque $v$ entra a la
cola en el instante en que su contador llega a $0$, y el contador bajó una
vez por cada predecesor que salió de la cola, es decir, que ya está en
$orden$.

**Teorema.** Si $G$ es un grafo dirigido acíclico, $Kahn(G)$ devuelve un
orden topológico de $G$.

*Demostración.* Se procede de forma directa, a partir de lo que sostiene el
algoritmo y del lema de la fuente. Sea $(u, v)$ una arista. Cuando $v$ sale de
la cola, todos sus predecesores, $u$ entre ellos, ya están en $orden$: $u$
aparece antes que $v$. Falta que salgan todos: mientras quede algún vértice
sin emitir, los no emitidos forman un subgrafo acíclico no vacío, que por el
lema tiene una fuente; su contador es $0$ y está en la cola, así que la cola
no se vacía antes de emitir los $n$. Por lo tanto, se puede concluir que
$orden$ contiene los $n$ vértices y respeta cada arista: es un orden
topológico de $G$. $\blacksquare$

### Cuando hay un ciclo

Al plan se le agrega la flecha AA $\to$ ED: Análisis de algoritmos antes que
Estructuras de datos. Ahora ED $\to$ AyG $\to$ AA $\to$ ED es un ciclo y las
listas quedan `[[4], [3], [0], [0, 6], [3], [2], []]`. Contadores: AyG $2$,
Prog $0$, MD $1$, ED $2$, AA $1$, Lóg $0$, BD $1$.

| Paso | Sale $u$ | Contadores que bajan | Cola $P$ después |
|---|---|---|---|
| 1 | Prog | ED $2 \to 1$ | Lóg |
| 2 | Lóg | MD $1 \to 0$, entra | MD |
| 3 | MD | AyG $2 \to 1$ | vacía |

La cola se vacía con $orden =$ Prog, Lóg, MD: tres de siete. Quedan por fuera
ED, AyG y AA, que forman el ciclo, y BD, que no está en el ciclo pero depende
de él.

**Teorema.** $Kahn(G)$ emite los $n$ vértices de $G$ si y solo si $G$ no
tiene ciclos dirigidos.

*Demostración.* Se procede en las dos direcciones. Que sin ciclos salen los
$n$ es la segunda parte de la demostración anterior. Para la ida, supóngase
que $G$ tiene el ciclo $v_1 \to \cdots \to v_k \to v_1$ y que algún vértice
del ciclo sale de la cola; sea $w$ el primero en salir. Su predecesor en el
ciclo no había salido cuando $w$ entró a la cola, luego el contador de $w$
seguía en al menos $1$ y $w$ no pudo entrar: contradicción. Ningún vértice
del ciclo sale, y $orden$ queda con menos de $n$. Por lo tanto, se puede
concluir que `len(orden) < n` es exactamente la señal de que $G$ tiene un
ciclo. $\blacksquare$

```python
def tiene_ciclo(G):
    # Kahn emite todos los vertices exactamente cuando no hay ciclos
    return len(kahn(G)) < len(G)
```

Los vértices que no están en `orden` son los de los ciclos y los que tienen
algún camino desde un ciclo. En un sistema de módulos serían los que no se
pueden compilar; en el plan de estudios, las materias que nadie podría cursar
nunca.

### Lo que cuesta

**Teorema.** $Kahn(G)$ sobre un grafo $G = (V, E)$ en lista de adyacencia
cuesta $\Theta(V + E)$.

*Demostración.* Se procede contando por separado lo que aporta cada vértice y
lo que aporta cada arista, como en el costo de los recorridos. Los contadores
de entrada se calculan recorriendo todas las listas una vez: $\Theta(V + E)$.
Cada vértice entra a la cola a lo sumo una vez, porque su contador llega a
$0$ una sola vez, y sale una vez: $\Theta(V)$. Al salir $u$ se recorre su
lista, de $\delta^{+}(u)$ entradas, y la suma de los grados de salida es
$|E|$: $\Theta(E)$ en decrementos. Sumando, $\Theta(V + E)$. Por lo tanto, se
puede concluir que el algoritmo cuesta $\Theta(V + E)$, lo mismo que un
recorrido, y que la cola es lo que separa esa cuenta de la
$\Theta(V^2 + E)$ de la versión que busca la fuente cada vez.
$\blacksquare$

## UVa 10305 — Ordering Tasks

Enunciado: <https://onlinejudge.org/external/103/10305.pdf>. Envío:
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1246>.

John tiene $n$ tareas, numeradas de $1$ a $n$, y $m$ relaciones de
precedencia: la tarea $i$ debe ejecutarse antes que la $j$. Hay que imprimir
un orden posible de ejecución. Varias instancias; cada una empieza con $n$ y
$m$ ($1 \leq n \leq 100$), seguidos de $m$ líneas con $i$ y $j$, y termina
con $n = m = 0$. Por instancia, una línea con los $n$ números.

**Vértices:** las tareas. **Aristas:** $(i, j)$ por cada precedencia.
**Pregunta:** un orden topológico, cualquiera. El enunciado garantiza que
existe, así que no hace falta reportar ciclos. Los números vienen desde $1$;
el programa los pasa a desde $0$ al leer y los devuelve al imprimir.

La muestra leída a mano, con $n = 5$ y $m = 4$. Cada pareja se baja en uno y
se guarda en la lista del primero:

```
5 4
1 2   ->  0: 1
2 3   ->  1: 2
1 3   ->  0: 2
1 5   ->  0: 4
0 0   ->  fin de la entrada
```

$$
G = [\, [1, 2, 4],\ [2],\ [\,],\ [\,],\ [\,] \,]
$$

Las tareas $3$, $4$ y $5$ de la entrada, que en el programa son la $2$, la
$3$ y la $4$, quedan con la lista vacía: de ellas no sale ninguna
precedencia. La línea `0 0` no es un caso: es la señal de que ya no vienen
más.

```python
def leer_grafo(datos, p, n, m):
    # Las m parejas desde datos[p]; devuelve (G, posicion siguiente)
    G = []
    u = 0
    while u < n:
        G.append([])
        u = u + 1
    k = 0
    while k < m:
        G[int(datos[p]) - 1].append(int(datos[p + 1]) - 1)
        p = p + 2
        k = k + 1
    return (G, p)


def leer_y_resolver(entrada):
    datos = entrada.read().split()
    p = 0
    salida = []
    n = int(datos[p])
    m = int(datos[p + 1])
    p = p + 2
    while n != 0 or m != 0:
        leido = leer_grafo(datos, p, n, m)
        G = leido[0]
        p = leido[1]
        linea = []
        for u in kahn(G):
            linea.append(str(u + 1))
        salida.append(" ".join(linea))
        n = int(datos[p])
        m = int(datos[p + 1])
        p = p + 2
    print("\n".join(salida))
```

Sobre la muestra, con $n = 5$, $m = 4$ y las parejas $(1,2)$, $(2,3)$,
$(1,3)$, $(1,5)$: contadores $1{:}0$, $2{:}1$, $3{:}2$, $4{:}0$, $5{:}1$;
cola inicial $[1, 4]$; sale $1$ y entran $2$ y $5$; sale $4$; sale $2$ y
entra $3$; sale $5$; sale $3$. Imprime `1 4 2 5 3`, que es la salida de la
muestra. El juez acepta cualquier orden válido; que coincida es solo porque la
cola saca las fuentes en el orden en que aparecen.

## Errores comunes

- Preguntar si el contador es $0$ antes de restar: la fuente nueva nunca
  entra a la cola.
- Marcar visitados en lugar de contar entradas: un vértice con dos
  predecesores saldría apenas sale el primero.
- Olvidar que un vértice sin aristas también va en el orden.
- Dar por hecho que el orden es único, o que el juez espera el mismo que dio
  la muestra. Se lee qué pide: cualquiera, o uno en particular.
- Dar por hecho que no hay ciclos cuando el enunciado no lo garantiza:
  `len(orden) < n` es la comprobación y cuesta una línea.
- Poner la arista al revés: *$i$ antes que $j$* es $(i, j)$, de $i$ hacia
  $j$.

## El código de la clase

- [orden_topologico.py](codigo/orden_topologico.py): `grados_de_entrada`,
  `kahn_ingenuo`, `kahn`, `tiene_ciclo`, y las dos variantes de los
  ejercicios, `kahn_con_pila` y `kahn_menor`. Al correrlo imprime los cuatro
  órdenes del plan de estudios, lo que Kahn emite con el ciclo, y contrasta
  las cuatro versiones contra fuerza bruta sobre $400$ grafos aleatorios.
- [ordering_tasks.py](codigo/ordering_tasks.py): la solución de UVa 10305,
  lista para `python3 ordering_tasks.py < entrada.txt`.

## Ejercicios

Los interactivos, los de papel y los de juez están en la
[página de ejercicios](./Ejercicios.md). Tres de los de papel vienen de la
clase y pueden aparecer en el parcial: decidir si un grafo tiene ciclos con
búsqueda en profundidad, Kahn con una pila en vez de la cola, y Kahn
devolviendo el menor orden en orden lexicográfico.

## Lo que sigue

Kahn no es la única forma de ordenar un grafo acíclico. La búsqueda en
profundidad deja en cada vértice dos marcas de tiempo, la de descubrimiento y
la de finalización, y con ellas clasifica las aristas del grafo en cuatro
tipos. Una de esas clases, la arista hacia un ancestro, es exactamente un
ciclo, y el orden de finalización, leído al revés, es un orden topológico.
Para investigar: CLRS, Sección 22.3, qué son $v.d$ y $v.f$, qué dice el
teorema del paréntesis y cuáles son los cuatro tipos de arista. Los colores y
los dos tiempos se pueden ver corriendo sobre un grafo en el ejercicio
[marcas](widgets/marcas.html){ target=_blank rel=noopener }.

## Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, 3.ª ed. MIT
  Press, 2009. Sección 22.4 (pp. 612–615) y Ejercicio 22.4-5 (p. 615), que es
  el algoritmo de la clase.
- Kahn, A. B. Topological sorting of large networks. *Communications of the
  ACM*, 5(11):558–562, 1962.
- Halim, Halim, Effendy. *Competitive Programming 4*. Sección 4.2.5.
