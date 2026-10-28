# Apoyo. Floyd-Warshall y los grafos de estado · AyG

**Material de apoyo del segundo corte.** El tema lo cubre el profesor titular en sus sesiones; esta página queda para consultarlo después, con el algoritmo desarrollado paso a paso y el código corriendo.

Con todas las parejas de vértices en juego, repetir Bellman-Ford-Moore desde
cada uno cuesta $\Theta(n^4)$ en un grafo denso. Floyd-Warshall llega al mismo
resultado en $\Theta(n^3)$ porque parte los caminos por el conjunto de
vértices que se dejan usar como intermedios y lo hace crecer de a uno. La
sesión lo sigue sobre un grafo de cinco vértices, doce aristas y dos pesos
negativos, con las seis matrices $D^{(0)}$ a $D^{(5)}$ una por una; un camino
en fila de cuatro vértices muestra qué se rompe cuando el ciclo de $k$ se pone
por dentro, y un teorema de dos líneas explica por qué las $n+1$ matrices, que
con $n = 500$ son $125$ millones de casillas, caben en una sola de $250$ mil.
El cierre vuelve sobre UVa 10269, *Adventure of Super Mario*, con las seis
preguntas de un grafo de estados y las dos implementaciones del problema: la
del estado de cuatro elementos, con $1\,102\,200$ estados en el peor caso, y
la que descubre que la bandera sobra y los deja en $551\,100$.

<div class="grid cards" markdown>

-   :material-grid:{ .lg .middle } **El algoritmo de Floyd-Warshall**

    ---

    La recurrencia de los vértices intermedios, las seis matrices del ejemplo,
    las dos implementaciones, la reconstrucción con `nex`, la correctitud y la
    diagonal, Super Mario con sus dos versiones, cuatro problemas de juez y
    cinco ejercicios con pistas.

    [:octicons-arrow-right-24: Entrar](./Floyd-Warshall.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck del tema, con las entradas que cambian marcadas en cada matriz
    y el grafo de estados de Super Mario dibujado con sus dos rutas.

    [:octicons-arrow-right-24: Abrir](./apoyo-floyd-warshall.pdf)

</div>

## Lo que conviene retener

- El ciclo de $k$ va por fuera porque las dos entradas que consulta la
  recurrencia son de la matriz completa del paso anterior. Con $k$ por dentro,
  en el camino en fila $1 \to 3 \to 2 \to 0$ la distancia de $1$ a $0$ se
  queda en $\infty$.
- Se puede escribir sobre la misma matriz porque la fila $k$ y la columna $k$
  no cambian en la vuelta $k$: ahí la recurrencia compara un valor contra sí
  mismo más $d_{kk} = 0$.
- La detección de ciclos negativos sale gratis y está en la diagonal. No hace
  falta la ronda extra de Bellman-Ford-Moore.
- `nex` guarda el vértice que sigue y no el anterior, así que el camino se
  arma hacia adelante y no hay que invertirlo.

## Ejercicios

Las actividades interactivas de Floyd-Warshall están en la
[página de ejercicios](../../../actividades/ayg-puj/floyd-warshall/index.md){ target=_blank rel=noopener },
donde se siguen las matrices paso a paso. Para Super Mario y el escenario del
carro eléctrico sirven las de la
[página de grafos de estado](../../../actividades/ayg-puj/grafos-de-estado/index.md){ target=_blank rel=noopener },
que practican encontrar el estado y sus transiciones. Los cinco ejercicios de
las diapositivas, con sus pistas, están al final de la
[nota](./Floyd-Warshall.md#ejercicios). Van desde construir las matrices a
mano hasta modelar una ciudad con estaciones de carga.

## Antes de entrar

La recurrencia se apoya en el mismo argumento de subestructura que sostiene a
Bellman-Ford-Moore, y conviene tenerlo fresco desde la
[nota de Bellman-Ford-Moore](../C13/Bellman-Ford-Moore.md). La comparación
contra repetir Dijkstra desde cada vértice usa su costo, que está en la
[nota de caminos más cortos en DAG y Dijkstra](../C15/DAG%20y%20Dijkstra.md).
Super Mario se trabajó primero ahí y el modelo con estados y transiciones
viene de la [nota de grafos de estado](../C14/Grafos%20de%20estado.md).
