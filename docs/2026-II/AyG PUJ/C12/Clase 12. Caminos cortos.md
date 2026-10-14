# Clase 12. Caminos más cortos: BFS y Bellman-Ford-Moore

**Viernes 16 de octubre de 2026.**

La búsqueda en amplitud ya da la distancia en aristas desde una fuente, pero
con pesos el camino de menos aristas puede salir caro, y la amplitud no
corrige una distancia que ya fijó. La relajación sí la corrige. Bellman-Ford
relaja todas las aristas $|V|-1$ veces, lo que basta para que cada camino más
corto quede relajado en orden, y una última pasada delata un ciclo negativo
alcanzable. La variante de Moore guarda en una cola solo los vértices cuya
distancia cambió: en el grafo de la sesión examina $10$ aristas donde la
versión por rondas examina $28$, con el mismo $O(VE)$ en el peor caso.

<div class="grid cards" markdown>

-   :material-map-marker-path:{ .lg .middle } **Caminos más cortos**

    ---

    La amplitud con $\pi$ y su límite con pesos, $\delta(u,v)$ con los ciclos
    negativos, las cinco propiedades de la relajación, Bellman-Ford con sus
    dos demostraciones y la traza ronda por ronda, la parada temprana, la
    construcción de Moore paso a paso y las dos trazas con el ciclo negativo.

    [:octicons-arrow-right-24: Entrar](./Caminos%20cortos.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck de la sesión, con el grafo de cinco vértices dibujado con sus
    pesos y el código de las tres versiones de Bellman-Ford.

    [:octicons-arrow-right-24: Abrir](./clase12-caminos-cortos.pdf)

</div>

## Ejercicios

Nueve interactivos, por los temas de la sesión y en su mismo orden, y ocho más
para resolver en papel. Todos están en la
[página de ejercicios](./Ejercicios.md).

## Antes de entrar

Conviene repasar la
[búsqueda en amplitud](../C6/Representaciones%20y%20recorridos.md): la cola,
$d$ y $\pi$, y por qué cada vértice entra una sola vez. También el
[orden topológico](../C10/Orden%20topologico%20y%20Tarjan.md) por tiempos de
finalización, que es el que permite relajar cada arista una sola vez en un
grafo sin ciclos, el tema que sigue.
