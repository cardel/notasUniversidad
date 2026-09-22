# Clase 8. Orden topológico

**Semana del 21 de septiembre de 2026.**

Poner en fila los vértices de un grafo dirigido sin violar ninguna flecha. Un
plan de estudios con prerrequisitos es el primer ejemplo; de ahí salen la
definición, el algoritmo de Kahn con su cola de fuentes, la prueba de que el
orden que devuelve sirve, y la señal con la que el mismo algoritmo avisa que
el grafo tiene un ciclo. Cierra con un problema de juez y tres ejercicios
propuestos para el parcial.

<div class="grid cards" markdown>

-   :material-sort:{ .lg .middle } **Orden topológico**

    ---

    El plan de estudios, la definición, el lema de la fuente, Kahn en su
    versión ingenua y con la cola, la traza a mano, las demostraciones de
    correctitud y de costo, la detección de ciclos y Ordering Tasks.

    [:octicons-arrow-right-24: Entrar](Orden%20topologico.md)

-   :material-file-pdf-box:{ .lg .middle } **Diapositivas**

    ---

    Las 61 láminas de la sesión.

    [:octicons-arrow-right-24: Abrir](clase08-orden-topologico.pdf)

</div>

## Ejercicios

Ocho interactivos, por los temas de la sesión y en su mismo orden: contar
los grados de entrada, decidir a mano cuáles listas son órdenes topológicos,
el algoritmo de Kahn con los contadores a la vista, la cola que se vacía antes
de tiempo cuando hay ciclos, la entrada del juez convertida en grafo, tres
versiones con una línea equivocada, los colores y los tiempos de la búsqueda
en profundidad, y las variantes con cola, pila y fuente menor. Después, siete
en papel y tres para el juez.

Todos están en la [página de ejercicios](./Ejercicios.md).

## Antes de entrar

Conviene tener a mano los
[recorridos y su costo](../C6/Representaciones%20y%20recorridos.md): el
algoritmo de hoy cuesta lo mismo y por la misma cuenta.
