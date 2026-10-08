# Ejercicios · Estructuras de Datos C15

Clase 15 — la lista enlazada (30 de septiembre). Cada enlace abre una
actividad que se trabaja directo en el navegador, en el mismo orden de los
temas de la sesión. Los programas no son los de la sesión: mismo tema, ronda
nueva.

## Lo que cuesta correr elementos

### [corrimientos](widgets/corrimientos.html){ target=_blank rel=noopener }

Seis operaciones seguidas sobre la lista estática, prediciendo cuántos
elementos corre cada `insertar` antes de verlo, y el contenido con el que
queda la lista.

## Un dato y una dirección

### [nodos](widgets/nodos.html){ target=_blank rel=noopener }

Qué imprime un recorrido cuya condición es `actual->siguiente != NULL`, con
los tres errores de lectura que produce, y cuál de dos formas de liberar la
cadena deja de funcionar.

## La lista enlazada

### [enlazada](widgets/enlazada.html){ target=_blank rel=noopener }

`insertar` paso a paso, línea por línea, siguiendo `cabeza`, `anterior` y
`nuevo`; qué queda si se invierten las dos líneas del empalme; y cuántos
pasos da la búsqueda del nodo anterior para cada posición.

## Agregar sin recorrer

### [agregar](widgets/agregar.html){ target=_blank rel=noopener }

Cuántos nodos visita `agregar` con y sin puntero al último, qué tiene que
pasar con `ultimo` al borrar el último nodo, y cómo quedan `cabeza` y
`ultimo` cuando la lista se vacía.

## Lo que cobra cada operación

### [costos](widgets/costos.html){ target=_blank rel=noopener }

Tres programas con perfiles de uso distintos y qué implementación conviene a
cada uno, con la razón de por qué las otras salen caras; y las cuentas de
insertar veinte veces al frente en cada una.

## Ordenar insertando

### [insertion](widgets/insertion.html){ target=_blank rel=noopener }

La traza de insertion sort vuelta por vuelta, prediciendo los corrimientos y
el arreglo de cada una, y cuánto cuesta la entrada que da el peor caso.
