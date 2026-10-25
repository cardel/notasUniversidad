# Ejercicios · Estructuras C23

Árboles y árboles binarios, la recursión sobre ellos y los tres recorridos, con
recursión y con pila. Cada enlace abre una actividad que se trabaja directo en
el navegador, en el mismo orden de los temas de la
[sesión](./Clase%2023.%20%C3%81rboles%20y%20%C3%A1rboles%20binarios.md). Los
árboles y los programas no son los de la sesión: mismo tema, ronda nueva.

## Datos que se contienen unos a otros

### [contener](../../../actividades/estructuras-de-datos/arbol-binario/contener.html){ target=_blank rel=noopener }

Un organigrama guardado en una lista: dos organigramas distintos que dan la
misma lista y lo que cuesta preguntar qué depende de Producción.

## El TAD árbol

### [terminologia](../../../actividades/estructuras-de-datos/arbol-binario/terminologia.html){ target=_blank rel=noopener }

Padre, hermanos, grado, profundidad, altura y niveles en un árbol de once
nodos, y cuántos punteros quedan en `NULL` al guardarlo con primer hijo y
hermano siguiente.

## El árbol binario

### [vacios](../../../actividades/estructuras-de-datos/arbol-binario/vacios.html){ target=_blank rel=noopener }

Un árbol de nueve nodos armado con `crearNodo`: cuántos vacíos tiene, cuántos
hay con mil nodos y qué cambia al pasar un hijo como izquierdo en vez de
derecho.

## La recursión, desde el árbol

### [llamadas](../../../actividades/estructuras-de-datos/recursion-arboles/llamadas.html){ target=_blank rel=noopener }

`contarPares` sobre un árbol de cinco nodos: lo que devuelve cada llamada, la
pila de llamadas marco por marco y cuántos marcos conviven.

### [casobase](../../../actividades/estructuras-de-datos/recursion-arboles/casobase.html){ target=_blank rel=noopener }

Cuatro versiones del producto de los datos que solo cambian en el caso base:
una da siempre 0, una acierta y dos se caen. Al final, la altura con el vacío
en 0.

## Recorridos: preorden, inorden y posorden

### [predecir](../../../actividades/estructuras-de-datos/recorridos-arbol/predecir.html){ target=_blank rel=noopener }

Los tres recorridos de un árbol de nueve nodos, escritos antes de verlos
numerados, y qué árbol tiene el preorden igual al inorden.

### [expresion](../../../actividades/estructuras-de-datos/recorridos-arbol/expresion.html){ target=_blank rel=noopener }

El árbol de `(9 - 4) * 2 - 12 / (1 + 3)`: notación prefija y postfija, lo que
devuelve cada operador, la postfija evaluada con una pila y lo que da la cadena
sin paréntesis.

## Recorridos con pila explícita

### [pila](../../../actividades/estructuras-de-datos/recorridos-arbol/pila.html){ target=_blank rel=noopener }

`preordenPila`, `inordenPila` y `posordenPila` vuelta por vuelta sobre un
árbol de siete nodos, y la versión que apila los hijos al revés. Es de las más
largas de la página.

## Liberar el árbol

### [liberar](../../../actividades/estructuras-de-datos/recorridos-arbol/liberar.html){ target=_blank rel=noopener }

En qué orden borra `liberar` y qué falla en tres versiones que hacen el
`delete` antes de terminar con el nodo.

## Para el juez

### [reconstruir](../../../actividades/estructuras-de-datos/recorridos-arbol/reconstruir.html){ target=_blank rel=noopener }

Un árbol de ocho nodos rehecho a partir de su preorden y su inorden, rango por
rango, con su posorden; y por qué el preorden con el posorden no alcanzan. Es
la más exigente de la página.

### [columnas](../../../actividades/estructuras-de-datos/recorridos-arbol/columnas.html){ target=_blank rel=noopener }

Un árbol que llega en preorden con −1 en cada vacío, como en UVa 699: cuántos
nodos trae, en qué columna cae cada uno y qué sumas se imprimen.

## Lo que cuesta

### [costos](../../../actividades/estructuras-de-datos/recursion-arboles/costos.html){ target=_blank rel=noopener }

Llamadas, altura y marcos de la pila en un árbol lleno y en uno degenerado con
los mismos nodos, y cuál de los dos se cae con una pila de 1 MB.
