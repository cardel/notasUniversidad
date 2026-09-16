# Clase 2. Estrategias de paralelización

**Semana del 15 de septiembre de 2026.**

La sesión anterior dejó una máquina con seis núcleos y un programa que usa
uno, y midió qué frena el reparto. Esta responde las tres preguntas que van
antes de escribir el primer hilo: qué se reparte, los datos o los trabajos; de
qué tamaño conviene cada tarea; y cómo se asignan las tareas a los hilos. Todo
se mide, y varias veces la versión secuencial gana.

<div class="grid cards" markdown>

-   :material-call-split:{ .lg .middle } **Estrategias de paralelización**

    ---

    Repartir datos o repartir trabajos, el mergesort partido con corte por
    profundidad, la granularidad medida, el reparto fijo contra el reparto
    por demanda, los tres bloques de TBB, la suma de prefijos en dos
    pasadas, el pipeline, la tabla para elegir y lo que dejó el ejercicio
    resuelto en vivo.

    [:octicons-arrow-right-24: Entrar](Estrategias%20de%20paralelizacion.md)

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Diez actividades en el navegador, una por tema de la sesión: el reparto
    en trozos, el árbol del mergesort, el costo fijo de repartir, las 64
    tareas desiguales, lo que parte `blocked_range`, la suma de prefijos en
    dos pasadas, el pipeline de tres etapas y ocho situaciones para elegir
    estrategia.

    [:octicons-arrow-right-24: Entrar](Ejercicios.md)

-   :material-console:{ .lg .middle } **Código**

    ---

    Los ocho programas de la sesión, uno por estrategia, con su `Makefile`
    y las tres variantes que se probaron en vivo sobre la suma.

    [:octicons-arrow-right-24: Entrar](codigo/README.md)

</div>

## Antes de entrar

De la sesión anterior se usa el vocabulario de trabajo y span, la ley de
Amdahl y el false sharing: los parciales de hilos distintos van separados en
memoria. También `std::thread` con `join`, `ref` y `cref`, que aquí aparecen
desde el primer ejemplo sin volver a presentarlos.

## Lo que quedó pendiente

El ejercicio del repositorio se empezó en clase: el producto de Hadamard con
TBB, que el docente resolvió en vivo. Desde esta semana el repositorio tiene
cuatro partes, una por tema de la sesión, con un job del flujo por cada una:
Hadamard con `std::thread` y con TBB, el balanceo de carga con dos patrones de
costo, el máximo por divide y vencerás y el máximo acumulado en dos pasadas.
Quien hizo el fork en clase tiene la versión de una sola parte; conviene
borrar esa copia y volver a bifurcar. Está en la pestaña de ejercicios
prácticos del Campus Virtual y no lleva nota.

Las diez actividades del navegador de [Ejercicios](Ejercicios.md) siguen el
orden de la sesión. Las dos que más conviene tocar primero son la de las 64
tareas desiguales, que deja ver hilo por hilo quién esperó a quién, y la de la
suma de prefijos, que arma las dos pasadas paso a paso.
