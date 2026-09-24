# Clase 9. Conectividad

**Viernes 25 de septiembre de 2026.**

Dados dos vértices, ¿se puede ir de uno al otro? Sin direcciones la respuesta
agrupa los vértices en bloques y basta un recorrido repetido para hallarlos.
Con direcciones hay que preguntar de ida y de vuelta, y las dos respuestas no
tienen por qué coincidir: de ahí salen los componentes fuertemente conexos, el
grafo transpuesto, el grafo de componentes y el algoritmo de Kosaraju, que los
encuentra con dos recorridos. Por el camino quedan los puntos de articulación
y los puentes, las piezas que sostienen la conexión.

<div class="grid cards" markdown>

-   :material-vector-link:{ .lg .middle } **Conectividad**

    ---

    El alcance como relación de equivalencia, los componentes conexos con
    profundidad y amplitud, los puntos de articulación y los puentes, $G^{T}$
    y $G^{SCC}$, Kosaraju con su demostración y su costo, y la traza completa
    sobre el grafo dirigido de ocho vértices.

    [:octicons-arrow-right-24: Entrar](Conectividad.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    Las 126 láminas de la sesión, con los tres grafos de ejemplo dibujados
    lámina por lámina: el no dirigido de tres componentes, los dos triángulos
    unidos por un puente y el dirigido donde Kosaraju pinta cuatro
    componentes.

    [:octicons-arrow-right-24: Abrir](clase09-conectividad.pdf)

</div>

## Ejercicios

Ocho interactivos, por los temas de la sesión y en su mismo orden: los dos
tiempos que deja la profundidad, decidir si un grafo es conexo y, en los
dirigidos, si lo es en sentido fuerte o débil, los componentes que encuentra
el recorrido repetido con sus tres versiones, el vértice y la arista cuya
salida parte el grafo, el transpuesto que conserva los componentes, Kosaraju
con sus dos pasadas línea por línea, y tres versiones con una línea cambiada
para encontrar cuál falla. Cierra uno más largo, sobre una red de quince
páginas y veintitrés enlaces. Después, ocho para resolver en papel.

Todos están en la [página de ejercicios](./Ejercicios.md).

## Antes de entrar

Conviene tener a mano los
[recorridos y su costo](../C6/Representaciones%20y%20recorridos.md), que son
el algoritmo de hoy repetido desde cada vértice sin visitar, y el
[orden topológico](../C8/Orden%20topologico.md): el grafo de componentes
admite uno, y el orden por tiempo de finalización que usa Kosaraju es
exactamente el que allí se calcula con la búsqueda en profundidad.
