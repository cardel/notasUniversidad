# Ejercicios · AyG C12

Cinco ejercicios para el navegador, organizados por los temas de la sesión y en
el mismo orden. Ninguno usa los grafos de las diapositivas ni los de sus
ejercicios propuestos: los temas y las técnicas son los mismos, los grafos y
los pesos son otros. Las implementaciones de Bellman-Ford-Moore y sus
actividades están en la [página de ejercicios de la clase 13](../C13/Ejercicios.md).

## Las dos versiones del problema

### [problemas](../../../actividades/ayg-puj/caminos-minimos-generalidades/problemas.html){ target=_blank rel=noopener }

Diez escenarios en palabras: una bodega con peajes negativos, 400 ciudades unidas casi todas con casi todas, un metro sin costos, etapas de producción sin ciclos, un mapa con 50 000 intersecciones, millas con promociones, 20 000 intersecciones de una ciudad, grados de separación en una red social, un robot en un almacén cuadriculado y 300 productos financieros. En cada uno se escoge la versión del problema, SSSP o APSP, y el algoritmo que conviene entre la amplitud, los caminos en un grafo acíclico, Dijkstra, Bellman-Ford-Moore, Floyd-Warshall y repetir n veces un algoritmo de SSSP. Cada respuesta equivocada explica qué supuesto no se cumple o qué costo sale peor, con las cuentas del orden de magnitud.

## Repaso: la búsqueda en amplitud

### [amplitud](../../../actividades/ayg-puj/caminos-minimos-generalidades/amplitud.html){ target=_blank rel=noopener }

La función `ssspBFS` del archivo `bfs.py` del curso, la versión sin arreglo de visitados, ejecutada línea por línea con sus nombres: `q`, `d`, `p`, `v` y `u`. Se ven la cola, `d` y `p` sobre cada vértice y, al terminar, la función `camino` sube por `p` y marca la ruta en verde. Antes de ejecutar se predice `d` para un destino, con `inf` cuando no se alcanza. Cuatro grafos: uno de ocho vértices, un anillo de siete con una cuerda, uno de nueve con dos componentes, donde `camino` devuelve la lista vacía, y uno de cuatro vértices con pesos, donde la búsqueda entrega el camino de menos aristas y no el más barato. La tarjeta final pregunta por qué la amplitud falla cuando las aristas pesan.

## Ciclos en un camino más corto

### [distancias](../../../actividades/ayg-puj/caminos-minimos-generalidades/distancias.html){ target=_blank rel=noopener }

La distancia δ(s, v) con pesos, que puede ser un entero, ∞ o −∞. Tres grafos dirigidos de siete u ocho vértices con una fuente marcada: uno con pesos de ambos signos y sin ciclos negativos, uno con un ciclo negativo alcanzable desde la fuente del que salen flechas hacia otros vértices, y uno con un ciclo negativo fuera de alcance y un vértice que la fuente no llega a tocar. Para cada vértice se escribe la distancia (un entero, `inf` o `-inf`) y la comprobación muestra el camino más corto, o el ciclo negativo que lo vuelve −∞ con la ruta que lo conecta con la fuente, o la razón de que no haya camino. La tarjeta final pregunta por qué un camino más corto no repite vértices cuando no hay ciclos negativos.

## Caminos de a lo sumo k aristas

### [karistas](../../../actividades/ayg-puj/caminos-minimos-generalidades/karistas.html){ target=_blank rel=noopener }

La tabla de los caminos más cortos de a lo sumo k aristas, llenada fila por fila de k = 0 a n − 1 sobre tres grafos dirigidos con pesos: uno de cinco vértices con pesos positivos, uno de seis con una arista negativa y un vértice que el origen no alcanza, y uno de cinco con un ciclo negativo, donde hay que seguir hasta la fila n. Cada fila se comprueba casilla por casilla: si se copia el valor de la fila anterior, si se usa un `dist[u]` ya bajado en la misma fila o si se escribe el costo de un camino con más aristas, el mensaje lo dice. Al acertar, la explicación nombra el camino que mejoró cada vértice y por qué hizo falta una arista más. En el último grafo la fila n todavía cambia y la explicación recupera el ciclo negativo subiendo por `pred`.

## Relajación y la idea del algoritmo

### [relajar](../../../actividades/ayg-puj/caminos-minimos-generalidades/relajar.html){ target=_blank rel=noopener }

Diez escenarios de una arista `(u, v, w)` con `d[u]`, `d[v]` y `pred[v]` dados. Hay que decir si la relajación cambia algo y con qué valores quedan `d[v]` y `pred[v]`. Entre los escenarios hay un `d[u]` infinito, pesos negativos, dos empates donde la comparación estricta no cambia nada, un predecesor que se reescribe y una arista que entra a la fuente. Cada respuesta equivocada explica lo que falló, y debajo se ejecuta el pseudocódigo de `RELAJAR` con los valores del escenario, línea por línea.

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


2. Sea $H$ el grafo dirigido con $V = \{0,\ldots,4\}$ y aristas
   $0 \to 1\ (6)$, $0 \to 2\ (7)$, $1 \to 2\ (8)$, $1 \to 3\ (5)$,
   $1 \to 4\ ({-4})$, $2 \to 3\ ({-3})$, $2 \to 4\ (9)$, $3 \to 1\ ({-2})$,
   $4 \to 0\ (2)$, $4 \to 3\ (7)$, el de la Figura 24.4 de CLRS. Con fuente
   $0$, escriba la tabla de las distancias más cortas usando a lo sumo
   $k$ aristas, para $k = 0, 1, \ldots, 4$. La fila 4 debe quedar
   $[0, 2, 7, 4, -2]$. Para cada casilla que cambia de una fila a la
   siguiente, diga qué camino nuevo la mejoró.

3. Demuestre que los caminos más cortos se componen de caminos más cortos
   (CLRS, Lema 24.1): si $p = \langle v_0, v_1, \ldots, v_k \rangle$ es un
   camino más corto de $v_0$ a $v_k$, todo subcamino de $p$ es un camino más
   corto entre sus extremos. Escriba la demostración en cuatro partes:
   teorema, estrategia, desarrollo y conclusión. Es el ejercicio sugerido de
   la sesión y puede aparecer como bono en el parcial.

4. Sea $N$ el grafo dirigido con aristas $0 \to 1\ (2)$, $1 \to 2\ (3)$,
   $2 \to 3\ ({-4})$, $3 \to 1\ (0)$, $3 \to 4\ (2)$, $5 \to 4\ (1)$ y fuente
   $0$. Encuentre el ciclo negativo y su peso, diga qué vértices tienen
   $\delta(0, v) = -\infty$ y cuáles $\delta(0, v) = \infty$.


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


## De las clases anteriores

La amplitud y sus dos formas de recorrer se practican en la
[página de la clase 6](../C6/Ejercicios.md); el orden topológico, que se usa
más adelante para los caminos en grafos acíclicos, en la
[de la clase 10](../C10/Ejercicios.md).
