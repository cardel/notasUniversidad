# Ejercicios · AyG C12

Nueve ejercicios para el navegador, organizados por los temas de la sesión y en
el mismo orden; el último junta todo sobre dos redes más grandes. Ninguno usa
los grafos de las diapositivas ni los de sus ejercicios propuestos: los temas y
las técnicas son los mismos, los grafos y los pesos son otros.

## Recuento: la búsqueda en amplitud

### [amplitud](./widgets/amplitud.html){ target=_blank rel=noopener }

La búsqueda en amplitud como caminos más cortos sin pesos, paso a paso: la cola, `d` y `pi` sobre cada vértice y, al terminar `bfs`, la reconstrucción de una ruta con `camino`, que se marca en verde sobre el dibujo. Antes de ejecutar se predice la distancia a un vértice elegido. Cuatro grafos: uno de ocho vértices, un anillo de siete con una cuerda, uno de nueve con dos componentes, donde el destino no se alcanza y `camino` devuelve la lista vacía, y uno de cuatro vértices con pesos, donde la búsqueda entrega el camino de menos aristas y no el más barato. La tarjeta final pregunta por qué la amplitud falla cuando las aristas pesan.

## Caminos más cortos con pesos

### [distancias](./widgets/distancias.html){ target=_blank rel=noopener }

La distancia δ(s, v) con pesos, que puede ser un entero, ∞ o −∞. Tres grafos dirigidos de siete u ocho vértices con una fuente marcada: uno con pesos de ambos signos y sin ciclos negativos, uno con un ciclo negativo alcanzable desde la fuente del que salen flechas hacia otros vértices, y uno con un ciclo negativo fuera de alcance y un vértice que la fuente no llega a tocar. Para cada vértice se escribe la distancia (un entero, `inf` o `-inf`) y la comprobación muestra el camino más corto, o el ciclo negativo que lo vuelve −∞ con la ruta que lo conecta con la fuente, o la razón de que no haya camino. Entre las respuestas equivocadas se explican tres: dar un número donde hay −∞, marcar −∞ en el ciclo negativo que la fuente no alcanza y confundir ∞ con −∞. La tarjeta final pregunta por qué un camino más corto no repite vértices cuando no hay ciclos negativos, y se responde con los ciclos de peso cero y de peso positivo.

## Relajación

### [relajar](./widgets/relajar.html){ target=_blank rel=noopener }

Diez escenarios de una arista `(u, v, w)` con `d[u]`, `d[v]` y `pi[v]` dados. Hay que decir si la relajación cambia algo y con qué valores quedan `d[v]` y `pi[v]`. Entre los escenarios hay un `d[u]` infinito, pesos negativos, dos empates donde la comparación estricta no cambia nada, un predecesor que se reescribe y una arista que entra a la fuente. Cada respuesta equivocada explica lo que falló, y debajo se ejecuta `relajar` con los valores del escenario, línea por línea.

### [propiedades](./widgets/propiedades.html){ target=_blank rel=noopener }

Dos grafos dirigidos con pesos y un estado intermedio de `d` y `pi`, junto a las distancias reales δ. Ocho afirmaciones, cuatro por grafo: hay que decir cuál de las propiedades de la Sección 24.5 de CLRS la garantiza (desigualdad triangular, cota superior, ausencia de camino, convergencia o relajación de caminos) o si es falsa. Tres de las ocho son falsas y parecen una propiedad a la que le falta una hipótesis; cada opción equivocada trae su explicación.

## Bellman-Ford

### [bellman](./widgets/bellman.html){ target=_blank rel=noopener }

Bellman-Ford paso a paso en sus dos versiones: la ingenua, con `|V| − 1` rondas completas, y la que se detiene en cuanto una ronda no cambia nada. Se ven el contador de aristas examinadas, la ronda actual, `d/pi` sobre cada vértice y el árbol que dibuja `pi`, además de una tabla con el estado al final de cada ronda. Antes de ejecutar se predice la ronda en que `d` cambia por última vez. Tres grafos con pesos, al menos una arista negativa y sin ciclos negativos: en el primero la parada temprana no ahorra nada, en el segundo pasa de 45 a 27 aristas y en el tercero, con la fuente en 3 y un vértice inalcanzable, de 40 a 24. La tarjeta final compara las aristas examinadas por las dos versiones.

## La variante de Moore

### [moore](./widgets/moore.html){ target=_blank rel=noopener }

Bellman-Ford-Moore paso a paso, con el código de la clase: `inicializar`, `relajar` y `bellman_ford_moore`. Se ven la cola, `en_cola`, cuántas veces ha entrado cada vértice y `d/π` sobre cada vértice, y la línea 24 cuenta las aristas examinadas. Antes de ejecutar se predice ese número. Tres grafos: una cadena de seis vértices donde Moore examina 12 aristas contra 40 de la parada temprana, uno de siete con dos vueltas positivas y un peine de siete vértices construido para que Moore no ahorre casi nada. Al terminar los tres, una tabla pone lado a lado las aristas examinadas por la ingenua, por la parada temprana y por Moore.

## Cuando hay un ciclo negativo

### [negativo](./widgets/negativo.html){ target=_blank rel=noopener }

Un grafo de ocho vértices con una arista cuyo peso se cambia con un control. Se corre `bellman_ford` y se ve cómo, cuando las |V| − 1 rondas no dejan de cambiar nada, `hay_arista_tensa` encuentra una arista tensa en la ronda |V|; después se corre Moore y se ve cómo un vértice entra a la cola |V| veces. Antes de ejecutar se predice si hay un ciclo negativo, y con el peso en −1 el ciclo pesa cero y no cuenta. Al final se marcan los vértices cuya distancia queda en −∞, que son el ciclo y todo lo que se alcanza desde él, y la comprobación da la razón de cada uno, incluido un vértice que entra al ciclo pero no se alcanza desde la fuente.

## Errores comunes

### [errores](./widgets/errores.html){ target=_blank rel=noopener }

Tres versiones con una línea cambiada, que corren y devuelven algo con aspecto de respuesta. En la primera, `relajar` usa `<=` en lugar de `<`: las distancias salen iguales, pero cambian la cuenta de relajaciones, las rondas, los `π` y, en Moore, la cola se repite. En la segunda, `bellman_ford` hace |V| − 2 rondas: falla en un camino de |V| − 1 aristas y declara un ciclo negativo que no existe. En la tercera, Moore pierde el `and not en_cola[v]` de la condición: el mismo vértice entra varias veces a la cola y se infla el trabajo. Se corre cada versión, se compara con la correcta y se señala la línea; la explicación aparece al acertar.

## Para cerrar

### [red](./widgets/red.html){ target=_blank rel=noopener }

El problema largo, sobre dos redes de más de doce nodos. La primera es una casa de cambio de trece monedas, con pesos −1000 · ln(tasa) que esconden un arbitraje; la segunda, un reparto de carga con peajes y bonos de catorce puntos, con tramos negativos y sin ciclo negativo. En las dos se predice primero si hay un ciclo negativo y después se corre Moore con el código de la clase. En la casa de cambio se marcan las monedas del arbitraje, que salen de subir por `π` desde el vértice que entró |V| veces, y la comprobación calcula cuánto se gana con mil dólares. En el reparto se contesta el costo mínimo de la Bodega al Puerto, y la comprobación da la ruta y reconoce el costo de las rutas que casi lo igualan.

## Para resolver en papel

Estos ejercicios entran en el material del parcial, igual que los de las
diapositivas.

1. Sea $G$ el grafo no dirigido con $V = \{0,1,\ldots,7\}$ y aristas
   $0\text{--}1$, $0\text{--}2$, $1\text{--}3$, $2\text{--}3$, $3\text{--}4$,
   $4\text{--}5$, $5\text{--}6$, $2\text{--}6$, $6\text{--}7$, con las listas
   en orden creciente. Corra la amplitud desde $0$ y escriba $d$ y $\pi$ de
   cada vértice, la cola después de cada extracción y el camino que devuelve
   `camino` hasta $5$. Deben salir $d = [0, 1, 1, 2, 3, 3, 2, 3]$ y el camino
   $0, 2, 6, 5$.

2. Sea $H$ el grafo dirigido con $V = \{0,\ldots,4\}$ y aristas, en este
   orden, $0 \to 1\ (6)$, $0 \to 2\ (7)$, $1 \to 2\ (8)$, $1 \to 3\ (5)$,
   $1 \to 4\ ({-4})$, $2 \to 3\ ({-3})$, $2 \to 4\ (9)$, $3 \to 1\ ({-2})$,
   $4 \to 0\ (2)$, $4 \to 3\ (7)$. Es el grafo de la Figura 24.4 de CLRS.
   Ejecute Bellman-Ford desde $0$ con la parada temprana y escriba $d$ y $\pi$
   al final de cada ronda. Deben quedar $d = [0, 2, 7, 4, -2]$ en tres rondas.
   ¿Cuántas aristas examina la versión ingenua y cuántas la de Moore?

3. Sea $C$ el camino dirigido $0 \to 5\ (3)$, $5 \to 4\ ({-1})$,
   $4 \to 3\ ({-1})$, $3 \to 2\ ({-1})$, $2 \to 1\ ({-1})$, con fuente $0$.
   Muestre que la parada temprana necesita las cinco rondas y no ahorra nada
   frente a la versión ingenua, y que la variante de Moore examina solo cinco
   aristas. Explique qué tiene la numeración de los vértices que produce ese
   peor caso, y renumere el camino para que una sola ronda baste.

4. Sea $N$ el grafo dirigido con aristas $0 \to 1\ (2)$, $1 \to 2\ (3)$,
   $2 \to 3\ ({-4})$, $3 \to 1\ (0)$, $3 \to 4\ (2)$, $5 \to 4\ (1)$ y fuente
   $0$. Encuentre el ciclo negativo y su peso, diga qué vértices tienen
   $\delta(0, v) = -\infty$ y cuáles $\delta(0, v) = \infty$, y qué arista
   tensa reporta Bellman-Ford en la ronda $|V|$.

5. Demuestre la desigualdad triangular (CLRS, Lema 24.10): para toda arista
   $(u, v)$, $\delta(s, v) \leq \delta(s, u) + w(u, v)$. Escriba la
   demostración en cuatro partes: teorema, estrategia, desarrollo y
   conclusión, y separe los casos en que $\delta(s, u)$ es finito, $\infty$
   o $-\infty$.

6. Dé un grafo dirigido de cuatro vértices con pesos en el que la amplitud,
   aplicada como si no hubiera pesos, encuentre un camino de costo al menos
   diez veces el del camino más corto. Explique qué paso del Teorema 22.5 deja
   de valer cuando las aristas tienen peso.

7. Se tiene un grafo con todos los pesos iguales a un mismo $c > 0$. Muestre
   que la amplitud calcula $\delta(s, v) = c \cdot v.d$ y compare el costo
   con el de Bellman-Ford sobre el mismo grafo. ¿Qué pasa si $c < 0$ y el
   grafo tiene al menos un ciclo alcanzable desde $s$?

8. Modifique `bellman_ford_moore` para que, además de decir si hay ciclo
   negativo, devuelva los vértices de un ciclo negativo. Pista: desde el
   vértice que entró $|V|$ veces a la cola, siga $\pi$ hacia atrás $|V|$ veces
   para quedar dentro del ciclo y luego recórralo hasta volver al mismo vértice.
   Pruébelo sobre el grafo del ejercicio 4.

## Problemas de juez

Los tres de las diapositivas, con el enunciado y el enlace de envío:

- UVa 336, A Node Too Far:
  <https://onlinejudge.org/external/3/336.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=272>.
- UVa 558, Wormholes:
  <https://onlinejudge.org/external/5/558.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=499>.
- UVa 11280, Flying to Fredericton:
  <https://onlinejudge.org/external/112/11280.pdf>, envío en
  <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2255>.

## De las clases anteriores

La amplitud y sus dos formas de recorrer se practican en la
[página de la clase 6](../C6/Ejercicios.md); el orden topológico, que se usa
en lo que sigue, en la [de la clase 10](../C10/Ejercicios.md).
