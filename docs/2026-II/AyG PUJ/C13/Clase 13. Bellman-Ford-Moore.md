# Clase 13. Implementaciones de Bellman-Ford-Moore y grafos de estado

**Viernes 16 de octubre de 2026, grupo A.** El grupo B la ve en la sesión
siguiente.

La idea de Bellman-Ford cabe en cuarenta líneas de C++, y de una versión a la
siguiente cambia lo que se guarda y lo que se recorre. La matriz de $n$ filas
conserva cada $d_k$ y gasta $\Theta(n^2)$ de memoria; un solo vector baja a
$\Theta(n)$ y deja de saber cuántas aristas usa cada camino. Con el
predecesor se recupera el ciclo negativo, una ronda sin cambios permite parar,
y la cola de Moore solo examina las aristas que pueden mejorar algo: en el
ejemplo de cinco vértices y nueve aristas, $9$ aristas examinadas contra $45$
de las rondas completas. Al final, UVa 321 muestra un grafo cuyos vértices son
estados y que se recorre con la búsqueda en amplitud.

<div class="grid cards" markdown>

-   :material-map-marker-path:{ .lg .middle } **Bellman-Ford-Moore**

    ---

    Las cinco versiones con su código C++ y su traza, el costo de cada una en
    tiempo y en espacio, la recuperación del ciclo negativo, la cola de Moore
    con `enCola` y `conteo`, *The New Villa* como grafo de estados y los
    problemas UVa 558 y 11280.

    [:octicons-arrow-right-24: Entrar](./Bellman-Ford-Moore.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck de la sesión, con los dos grafos de ejemplo dibujados y la villa
    del enunciado como grafo de estados.

    [:octicons-arrow-right-24: Abrir](./clase13-bellman-ford-moore.pdf)

</div>

## Ejercicios

Seis interactivos, por los temas de la sesión y en su mismo orden, y cinco más
para resolver en papel, en la [página de ejercicios](../../../actividades/ayg-puj/bellman-ford-moore/index.md).
Los siete de las diapositivas, con sus pistas, están al final de la
[nota](./Bellman-Ford-Moore.md#ejercicios). Van desde llenar la matriz a mano
hasta resolver otra villa de cuatro habitaciones.

## Antes de entrar

Conviene repasar los [caminos más cortos](../C12/Caminos%20cortos.md): la
tabla de los caminos de a lo sumo $k$ aristas, la fila $n$ que delata un ciclo
negativo y la relajación. También la búsqueda en amplitud de la misma nota,
que es la que recorre el grafo de estados.
