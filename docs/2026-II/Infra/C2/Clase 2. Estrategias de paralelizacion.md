# Clase 2. Estrategias de paralelización

**Semana del 15 de septiembre de 2026.**

La sesión anterior dejó una máquina con seis núcleos y un programa que usa
uno, y midió qué frena el reparto. Esta responde las tres preguntas que van
antes de escribir el primer hilo: qué se reparte, los datos o los trabajos; de
qué tamaño conviene cada tarea; y cómo se asignan las tareas a los hilos. Todo
se mide, y varias veces la versión secuencial gana.

<div class="grid cards" markdown>

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Diez actividades en el navegador, una por tema de la sesión: el reparto
    en trozos, el árbol del mergesort, el costo fijo de repartir, las 64
    tareas desiguales, lo que parte `blocked_range`, la suma de prefijos en
    dos pasadas, el pipeline de tres etapas y ocho situaciones para elegir
    estrategia.

    [:octicons-arrow-right-24: Entrar](Ejercicios.md)

</div>

## Antes de entrar

De la sesión anterior se usa el vocabulario de trabajo y span, la ley de
Amdahl y el false sharing: los parciales de hilos distintos van separados en
memoria. También `std::thread` con `join`, `ref` y `cref`, que aquí aparecen
desde el primer ejemplo sin volver a presentarlos.

Los apuntes y el código de la sesión se publican después de las dos clases de
la semana.
