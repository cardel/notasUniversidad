# Ejercicios · Estructuras C27

Las estructuras del curso en Python: la `list` por dentro y lo que cuesta
crecer, el `deque` como cola, `dict` y `set` como tablas hash, el montículo de
mínimos de `heapq`, la pila y la lista enlazada con una clase `Nodo`, y cómo
elegir la estructura por las operaciones que pide el problema. Cada enlace abre
una actividad que se trabaja directo en el navegador, en el mismo orden de los
temas de la [sesión](./Clase%2027.%20Estructuras%20de%20datos%20en%20Python.md).
Los programas y los valores no son los de la sesión: mismo tema, ronda nueva.
Las más exigentes son `dict-set`, `heapq` y `nodos`.

## Repaso: heapsort y la cola de prioridad

### [ordenar](../../../actividades/estructuras-de-datos/heapsort/ordenar.html){ target=_blank rel=noopener }

Seis claves ordenadas paso a paso con heapsort, dos rondas a mano y lo que pasa
con dos claves iguales.

### [priority-queue](../../../actividades/estructuras-de-datos/cola-prioridad/priority-queue.html){ target=_blank rel=noopener }

Lo que imprime un programa con `push`, `top` y `pop`, y un comparador que deja
el menor arriba.

## list: el vector de Python

### [crecer](../../../actividades/estructuras-de-datos/python-contenedores/crecer.html){ target=_blank rel=noopener }

Una lista que recibe m llamadas a `append`, línea por línea y con el arreglo
dibujado: cuántas veces cambia de arreglo y cómo crece ese número con m.

### [list](../../../actividades/estructuras-de-datos/python-contenedores/list.html){ target=_blank rel=noopener }

Diez `append` paso a paso, la capacidad después de cuarenta, lo que se corre al
insertar y al quitar, tres maneras de armar una lista y lo que cuesta buscar
muchas veces.

## deque: colas y pilas

### [deque](../../../actividades/estructuras-de-datos/python-contenedores/deque.html){ target=_blank rel=noopener }

Una cola de impresión paso a paso, un programa que usa los dos extremos, mil
atenciones con `pop(0)`, qué par de operaciones hace una cola y cuándo conviene
una `list`.

## dict y set: tablas hash

### [dict-set](../../../actividades/estructuras-de-datos/python-contenedores/dict-set.html){ target=_blank rel=noopener }

El orden en que un `dict` recorre sus claves, las casillas donde un `set` guarda
enteros, lo que imprime un `set`, el error de leer una clave que no está, qué
puede ser clave y lo que cuesta quitar repetidos.

## heapq: el montículo de Python

### [heapq](../../../actividades/estructuras-de-datos/python-contenedores/heapq.html){ target=_blank rel=noopener }

Seis `heappush` con el árbol y el arreglo, dos `heappop`, `heapify`, tuplas con
la misma prioridad, el mayor con las claves negadas y dónde está el segundo
menor.

## Nodos en Python: la pila y la lista enlazada

### [nodos](../../../actividades/estructuras-de-datos/python-nodos/nodos.html){ target=_blank rel=noopener }

Insertar y eliminar con el dibujo de la cadena, lo que imprime una pila, un
reenlace en el orden equivocado, los pasos de `nodo_en` y quién libera el nodo
que sale.

## Qué estructura elegir

### [elegir](../../../actividades/estructuras-de-datos/elegir-estructura/elegir.html){ target=_blank rel=noopener }

Seis problemas, de un sensor a un traductor, con la estructura que hace baratas
sus operaciones, lo que cuesta, y la tabla que los resume.
