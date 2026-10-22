# Clase 14. Grafos de estado · AyG C14

**Viernes 23 de octubre de 2026, de 7:00 a 9:00, grupo B.**

En *The New Villa*, UVa 321, la entrada trae habitaciones y puertas, y una
búsqueda en amplitud sobre ellas responde que el dormitorio está a un paso del
hall. La respuesta es falsa, porque el dormitorio empieza a oscuras. Lo que se
puede hacer en cada momento depende de dónde está el señor Black y de qué
luces están prendidas, y ese par es el vértice del grafo que hay que recorrer.
La sesión dibuja ese grafo por capas sobre la villa del enunciado, guarda el
conjunto de luces en un entero con `1 << i`, `&` y `^`, y sigue en una tabla
la búsqueda en amplitud de una implementación en C++, hasta la solución de
$6$ pasos.

<div class="grid cards" markdown>

-   :material-state-machine:{ .lg .middle } **Grafos de estado**

    ---

    Estados y transiciones de UVa 321, el grafo de la villa 1 capa por capa,
    las máscaras de bits con sus tablas, el código C++ línea por línea, la
    traza de la búsqueda, los errores comunes y seis ejercicios con pistas.

    [:octicons-arrow-right-24: Entrar](./Grafos%20de%20estado.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck de la sesión, con la villa del enunciado dibujada y su grafo de
    estados construido capa por capa, primero con conjuntos de luces y después
    con máscaras.

    [:octicons-arrow-right-24: Abrir](./clase14-grafos-de-estado.pdf)

</div>

## Ejercicios

Las actividades interactivas del tema están en la
[página de ejercicios](../../../actividades/ayg-puj/grafos-de-estado/index.md).
Los seis ejercicios de las diapositivas, con sus pistas, están al final de la
[nota](./Grafos%20de%20estado.md#ejercicios). Van desde dibujar las primeras
capas de otra villa hasta demostrar que la luz de la habitación donde se está
siempre queda prendida.

## Antes de entrar

Conviene repasar la sección de grafos de estado de la
[nota de Bellman-Ford-Moore](../C13/Bellman-Ford-Moore.md#grafos-de-estado),
que presenta el mismo problema y el mismo código, y los
[grafos implícitos](../C7/Grafos%20implicitos.md), donde los vecinos de un
vértice se calculan con una regla en lugar de leerse de una lista.
