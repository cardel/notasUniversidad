# Ejercicios · Estructuras C26

Heapsort y la cola de prioridad: construir un montículo a partir de un arreglo
cualquiera en Θ(n), ordenar con él sin arreglo auxiliar, las funciones de
montículo de la STL, el TAD cola de prioridad y el contenedor
`priority_queue`. Cada enlace abre una actividad que se trabaja directo en el
navegador, en el orden de los temas de la sesión. Los arreglos y los programas
son una ronda nueva sobre el mismo tema. Las más exigentes son `ordenar` y
`priority-queue`.

## Construir un montículo

### [construir](../../../actividades/estructuras-de-datos/heapsort/construir.html){ target=_blank rel=noopener }

Por qué se empieza en la casilla n / 2 − 1, la traza de cada llamado a `bajar`,
un arreglo de diez claves para hacer a mano y el peor caso con 1023 claves
contra las inserciones una por una.

## Heapsort

### [ordenar](../../../actividades/estructuras-de-datos/heapsort/ordenar.html){ target=_blank rel=noopener }

Seis claves ordenadas paso a paso, por qué el máximo va a a[fin], dos rondas a
mano, lo que pasa con dos claves iguales y lo que heapsort tiene frente a merge
sort y quicksort.

## El montículo en la STL

### [stl-heap](../../../actividades/estructuras-de-datos/monticulo/stl-heap.html){ target=_blank rel=noopener }

Lo que deja cada llamada de `make_heap`, `push_heap` y `pop_heap` sobre un
`vector`, en qué orden van con `push_back` y `pop_back`, cómo se ordena con
`sort_heap` y el montículo de mínimos con `greater<int>()`.

## El TAD cola de prioridad

### [contrato](../../../actividades/estructuras-de-datos/cola-prioridad/contrato.html){ target=_blank rel=noopener }

Lo que devuelve una secuencia de operaciones, qué dice el contrato de extraer
de una cola vacía, qué TAD guarda los eventos de un simulador y cómo quedarse
con las cinco lecturas más altas de un millón guardando solo cinco.

## El contenedor `priority_queue`

### [priority-queue](../../../actividades/estructuras-de-datos/cola-prioridad/priority-queue.html){ target=_blank rel=noopener }

Lo que imprime un programa con `push`, `top` y `pop`, un comparador que deja
el menor arriba, llamadas de soporte con la misma prioridad y lo que la cola no
deja hacer.
