# Clase 15. Caminos más cortos en DAG y Dijkstra · AyG C15

**Viernes 23 de octubre de 2026, de 9:00 a 11:00, sesión compartida por los grupos A y B.**

Bellman-Ford relaja todas las aristas en cada ronda porque no sabe en qué
orden conviene hacerlo. Cuando el grafo no tiene ciclos, ese orden existe: con
una sola pasada en orden topológico, el grafo del ejemplo deja la distancia
$-5$ hasta el vértice $7$, con tres pesos negativos de por medio. Cuando hay
ciclos y ningún peso es negativo, el orden lo decide una cola de prioridad, y
eso es el algoritmo de Dijkstra, que la sesión sigue en una tabla con
`heapq` y sus parejas viejas. Un contraejemplo de tres vértices muestra qué
pasa con un peso negativo. La sesión cierra con UVa 10269, *Adventure of
Super Mario*, un grafo de estados donde caminar cuesta la longitud de la vía y
correr con la bota cuesta $0$; Dijkstra sobre esos estados da los $9$ de la
respuesta del enunciado.

<div class="grid cards" markdown>

-   :material-map-marker-path:{ .lg .middle } **Caminos más cortos en DAG y Dijkstra**

    ---

    La pasada en orden topológico con su traza, las dos versiones de
    Dijkstra, la pareja vieja, el contraejemplo con pesos negativos, Super
    Mario como grafo de estados, tres problemas de juez y seis ejercicios con
    pistas.

    [:octicons-arrow-right-24: Entrar](./DAG%20y%20Dijkstra.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck de la sesión, con los tres grafos dibujados con sus pesos y las
    trazas que crecen fila por fila.

    [:octicons-arrow-right-24: Abrir](./clase15-dag-dijkstra.pdf)

</div>

## Ejercicios

Las actividades interactivas de caminos más cortos en DAG y de Dijkstra están
en la [página de ejercicios](../../../actividades/ayg-puj/caminos-dag-dijkstra/index.md){ target=_blank rel=noopener }.
Para Super Mario sirven las de la
[página de grafos de estado](../../../actividades/ayg-puj/grafos-de-estado/index.md){ target=_blank rel=noopener },
donde se practica encontrar el estado y sus transiciones. Los seis ejercicios
de las diapositivas, con sus pistas, están al final de la
[nota](./DAG%20y%20Dijkstra.md#ejercicios). Van desde seguir `ssspDAG` a mano
sobre un grafo nuevo hasta demostrar que la pasada en orden topológico da la
distancia de cada vértice.

## Antes de entrar

La relajación y el costo $O(nm)$ de Bellman-Ford están en la
[nota de Bellman-Ford-Moore](../C13/Bellman-Ford-Moore.md). Super Mario se
modela como *The New Villa*, con estados y transiciones, y conviene tener a la
mano la [nota de grafos de estado](../C14/Grafos%20de%20estado.md). La pasada
usa el orden topológico por conteo de aristas de entrada, que se compara con
el de la profundidad en la
[nota de orden topológico y Tarjan](../C10/Orden%20topologico%20y%20Tarjan.md#kahn-o-profundidad).
