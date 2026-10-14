# Clase 12. Caminos más cortos: generalidades y la idea de Bellman-Ford-Moore

**Viernes 16 de octubre de 2026, grupo B.**

La búsqueda en amplitud da la distancia en aristas desde una fuente, pero con
pesos el camino de menos aristas puede salir caro, y la amplitud no corrige una
distancia que ya asignó. Un camino más corto no necesita repetir vértices,
salvo que haya un ciclo negativo alcanzable, y entonces el problema se queda
sin solución. De ahí sale la idea de Bellman-Ford-Moore: calcular los caminos
más cortos de a lo sumo $0, 1, \ldots, n-1$ aristas, cada fila a partir de la
anterior, y mirar si la fila $n$ todavía mejora algo.

<div class="grid cards" markdown>

-   :material-map-marker-path:{ .lg .middle } **Caminos más cortos**

    ---

    Las versiones SSSP y APSP con sus algoritmos, la amplitud con `dist` y
    `pred`, los ciclos positivos y negativos, la tabla de los caminos de a lo
    sumo $k$ aristas sobre un grafo de seis vértices, el Lema 24.1 de CLRS y
    la relajación.

    [:octicons-arrow-right-24: Entrar](./Caminos%20cortos.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    El deck de la sesión, con cada grafo dibujado y el árbol de caminos
    pintado fila por fila.

    [:octicons-arrow-right-24: Abrir](./clase12-caminos-cortos.pdf)

</div>

## Ejercicios

Los interactivos y los de papel están en la
[página de ejercicios](./Ejercicios.md). Los siete de las diapositivas, con
sus pistas, están al final de la [nota](./Caminos%20cortos.md#ejercicios).

## Antes de entrar

Conviene repasar la
[búsqueda en amplitud](../C6/Representaciones%20y%20recorridos.md): la cola,
las distancias, los predecesores y por qué cada vértice entra una sola vez.
