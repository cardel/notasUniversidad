# Clase 10. Orden topológico con la profundidad y el valor low

**Viernes 2 de octubre de 2026.**

La búsqueda en profundidad deja en cada vértice un tiempo de finalización, y
con él sale un orden topológico sin contar grados de entrada: el vértice que
termina va delante de todo lo que ya terminó. Los colores dicen además si hay
ciclo, porque solo una arista hacia un vértice gris lo cierra. Con un segundo
número, $v.low$, la misma profundidad reconoce dónde empieza cada componente
fuertemente conexo, y Tarjan los saca de una sola pasada, sin el grafo
transpuesto. En un grafo no dirigido ese mismo número decide qué vértices son
puntos de articulación y qué aristas son puentes, en $\Theta(V+E)$ en lugar
de quitar las piezas una por una.

<div class="grid cards" markdown>

-   :material-sort-variant:{ .lg .middle } **Orden topológico y Tarjan**

    ---

    El orden por $f$ decreciente con su demostración, el ciclo como arista a
    un vértice gris, la definición de $v.low$, Tarjan con la traza completa
    sobre el grafo dirigido de ocho vértices, y los criterios para la raíz,
    los demás vértices y los puentes, con la tabla de un grafo de tres
    triángulos.

    [:octicons-arrow-right-24: Entrar](./Orden%20topologico%20y%20Tarjan.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck de la sesión, con el código de las tres piezas en sus dos formas,
    la recursiva y la de pila explícita.

    [:octicons-arrow-right-24: Abrir](clase10-tarjan.pdf)

</div>

## Ejercicios

Ocho interactivos, por los temas de la sesión y en su mismo orden, y ocho más
para resolver en papel. Todos están en la
[página de ejercicios](./Ejercicios.md).

## Antes de entrar

Conviene repasar la [conectividad](../C9/Conectividad.md): los tiempos $d$ y
$f$, el teorema del paréntesis, los componentes fuertemente conexos con
Kosaraju y la definición de punto de articulación y de puente. También el
[orden topológico con Kahn](../C8/Orden%20topologico.md), para comparar los
dos órdenes que salen sobre el plan de estudios.
