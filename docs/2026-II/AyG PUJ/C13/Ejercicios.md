# Ejercicios · AyG C13

Seis ejercicios para el navegador, organizados por los temas de la sesión y en
el mismo orden. Los cuatro primeros corren el código C++ de la clase, línea
por línea; el de grafos de estado sigue el BFS de *The New Villa*. Ninguno usa
los grafos de las diapositivas ni los de sus ejercicios propuestos.

## Versión 1: una matriz de n filas

### [Bellman-Ford](./widgets/bellman.html){ target=_blank rel=noopener }

Se ejecuta el C++ de `bfm1.cpp` línea por línea, y también el de `bfm2.cpp` y el de `bfm4.cpp`, sobre tres grafos con pesos negativos y sin ciclos negativos. Antes de ejecutar se predice cuántas iteraciones imprime `bfm4.cpp`. En la matriz se ve llenarse una fila por ronda; en los vectores, lo que queda al terminar cada una. Al final una tabla compara las aristas que examina cada versión.

## Versión 3: recuperar el ciclo negativo

### [Ciclo negativo](./widgets/negativo.html){ target=_blank rel=noopener }

`bfm3.cpp` y `bfm5.cpp` sobre tres grafos con ciclos negativos. Antes de ejecutar se marcan los vértices del ciclo que imprime `bfm3.cpp`; en uno de los grafos hay dos ciclos negativos y el programa recupera solo uno. Con `bfm5.cpp` se sigue `conteo` hasta que algún vértice pasa de `n` y se sube por `p` para encontrar el ciclo.

## Versión 5: la cola de Moore

### [Moore](./widgets/moore.html){ target=_blank rel=noopener }

`bfm5.cpp` línea por línea sobre tres grafos sin ciclos negativos. Se ven la cola, `enCola` y `conteo`. Antes de ejecutar se predice cuántas veces sale de la cola cada vértice; en un grafo hay un vértice que nunca entra.

## Las cinco versiones juntas

### [La red](./widgets/red.html){ target=_blank rel=noopener }

Dos redes de trece y catorce nodos corridas con `bfm5.cpp`: una casa de cambio con un arbitraje escondido y un reparto con peajes y bonos sin ciclos negativos. Se predice si hay un ciclo negativo, se ejecuta el código y se contesta una pregunta sobre la red: qué monedas forman el ciclo, o cuál es el costo mínimo entre dos puntos.

## Grafos de estado

### [Grafo de estados](./widgets/estados.html){ target=_blank rel=noopener }

El grafo de estados de *The New Villa* sobre tres villas pequeñas distintas a la del enunciado. Se predice cuántos estados distintos descubre la búsqueda y luego se sigue `new_villa.py`: los sucesores de cada estado (moverse, prender o apagar), la cola, la tabla de distancias y predecesores y la reconstrucción de la secuencia de pasos. Una de las villas no tiene solución.

## Errores comunes

### [Líneas cambiadas](./widgets/errores.html){ target=_blank rel=noopener }

Cuatro versiones del C++ del titular con una línea cambiada: la copia de la fila anterior en `bfm1.cpp`, la comprobación de `enCola` en `bfm5.cpp` y una ronda menos en `bfm2.cpp` y en `bfm1.cpp`. Se corren contra la versión correcta sobre un grafo pequeño, se comparan las salidas y se señala la línea. Una de las versiones imprime lo mismo que la correcta, y la explicación dice por qué.

## Para resolver en papel

Estos ejercicios entran en el material del parcial, igual que los de las
diapositivas.

1. Sea $H$ el grafo dirigido con $V = \{0,\ldots,4\}$ y aristas, en este
   orden, $0 \to 1\ (6)$, $0 \to 2\ (7)$, $1 \to 2\ (8)$, $1 \to 3\ (5)$,
   $1 \to 4\ ({-4})$, $2 \to 3\ ({-3})$, $2 \to 4\ (9)$, $3 \to 1\ ({-2})$,
   $4 \to 0\ (2)$, $4 \to 3\ (7)$, el de la Figura 24.4 de CLRS, con fuente
   $0$. Llene la matriz de bfm1 fila por fila y diga en qué fila deja de
   cambiar. Corra después bfm4 y verifique que hace $3$ iteraciones y termina
   con $d = (0, 2, 7, 4, -2)$. Con bfm5, diga cuántas veces sale cada vértice
   de la cola.

2. Sea $C$ el camino dirigido $0 \to 5\ (3)$, $5 \to 4\ ({-1})$,
   $4 \to 3\ ({-1})$, $3 \to 2\ ({-1})$, $2 \to 1\ ({-1})$, con fuente $0$ y
   las aristas en ese orden. Muestre que bfm4 hace $5$ iteraciones, todas las
   posibles, y que bfm5 saca cada vértice de la cola una sola vez. Renumere
   los vértices del camino para que bfm4 termine en $2$ iteraciones y
   explique qué tiene el orden de las listas de adyacencia que produce cada
   caso.

3. bfm5 dice si hay un ciclo negativo, pero no cuál. Modifíquelo para que lo
   recupere, como hace bfm3: desde el vértice cuyo `conteo` pasó de $n$, siga
   `p` hacia atrás $n$ veces para quedar dentro del ciclo y luego recórralo
   hasta volver al mismo vértice. Pruébelo con un grafo de cinco vértices que
   tenga un ciclo negativo de tres.

4. Demuestre que si un vértice entra a la cola de bfm5 más de $n$ veces, el
   grafo tiene un ciclo negativo alcanzable desde la fuente. Escriba la
   demostración en cuatro partes: teorema, estrategia, desarrollo y
   conclusión. Use que, sin ciclos negativos, cada mejora de `d[v]`
   corresponde a un camino más corto con más aristas que el anterior.

5. En *The New Villa*, una casa tiene $r$ habitaciones. ¿Cuántos estados tiene
   el grafo de estados, contando la habitación donde está la persona y qué
   luces están prendidas? Para una casa de $3$ habitaciones con puertas
   $1\text{--}2$ y $2\text{--}3$, donde la habitación $1$ controla la luz de la
   $2$ y la $2$ controla la de la $3$, dibuje los estados alcanzables desde
   (habitación 1, solo la luz de la 1 prendida) y encuentre con BFS la
   secuencia más corta que lleva a (habitación 3, solo la luz de la 3
   prendida).

## Problemas de juez

Los tres de las diapositivas, con el enunciado y el enlace de envío:

- UVa 558, Wormholes:
  <https://onlinejudge.org/external/5/558.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=499>.
- UVa 11280, Flying to Fredericton:
  <https://onlinejudge.org/external/112/11280.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2255>.
- UVa 321, The New Villa:
  <https://onlinejudge.org/external/3/321.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=257>.

## De las clases anteriores

Los caminos de a lo sumo $k$ aristas y la relajación se practican en la
[página de la clase 12](../C12/Ejercicios.md); los grafos implícitos, de
donde salen los grafos de estado, en la [de la clase 7](../C7/Ejercicios.md).
