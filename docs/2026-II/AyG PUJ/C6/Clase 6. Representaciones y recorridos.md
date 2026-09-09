# Clase 6. Representaciones de grafos y recorridos

**Viernes 11 de septiembre de 2026.**

La sesión anterior llegó hasta las representaciones y dejó abierta la pregunta
de cuál conviene, mirando la memoria de cada una y qué tan fácil es llegar a
las conexiones de un vértice. Esta clase la cierra y sigue con lo que viene
después: cómo se recorre un grafo, en profundidad y en amplitud.

<div class="grid cards" markdown>

-   :material-table:{ .lg .middle } **Representaciones y recorridos**

    ---

    Las cuatro formas de guardar un grafo con su costo, los dos recorridos en
    pseudocódigo y en Python, y por qué ambos cuestan $\Theta(V+E)$ sobre
    listas y $\Theta(V^2)$ sobre matriz.

    [:octicons-arrow-right-24: Entrar](Representaciones%20y%20recorridos.md)

-   :material-book-open-variant:{ .lg .middle } **Repaso de grafos**

    ---

    Definiciones, los cinco tipos, terminología, el teorema del apretón de
    manos, las familias, topologías, subgrafos y complementos.

    [:octicons-arrow-right-24: Diapositivas](clase06-repaso.pdf)

</div>

## Ejercicios

Siete interactivos, uno por cada tema de la sesión y en el mismo orden en que
se dieron: construir las representaciones, comparar el costo de una consulta
sobre las tres, ver qué pasa sin la marca de visitados, los dos recorridos
paso a paso, el costo con controles y los cuatro errores que más cuestan.
Después, siete para resolver en papel, incluido un problema de juez.

Todos están en la [página de ejercicios](./Ejercicios.md).

## Antes de entrar

Conviene tener a mano las
[definiciones y familias](../C5/Introduccion%20a%20grafos.md) de la sesión
anterior, que son la base de todo lo que sigue.
