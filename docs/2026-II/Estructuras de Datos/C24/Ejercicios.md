# Ejercicios · Estructuras C24

El árbol binario de búsqueda: la definición, buscar, insertar y borrar con
recursión y con ciclos, y lo que cuesta cada operación según la forma del
árbol. Cada enlace abre una actividad que se trabaja directo en el navegador,
en el mismo orden de los temas de la
[sesión](./Clase%2024.%20%C3%81rbol%20binario%20de%20b%C3%BAsqueda.md). Los
árboles y los programas no son los de la sesión: mismo tema, ronda nueva.

## Buscar rápido sin perder el orden

### [arreglo](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/arreglo.html){ target=_blank rel=noopener }

Un arreglo ordenado de quince claves: qué casillas mira la búsqueda binaria del
39, qué árbol forman sus comparaciones y cuánto cuesta agregar el 33 en el
arreglo y en ese árbol.

## El árbol binario de búsqueda

### [esabb](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/esabb.html){ target=_blank rel=noopener }

Cuatro árboles para decidir si son ABB, uno de ellos hecho para engañar a quien
solo mira los hijos, el inorden que delata al que falla y dos huecos con el
rango de claves que admiten.

## Buscar

### [buscar](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/buscar.html){ target=_blank rel=noopener }

Buscar el 32, el 70 y el 45 contando comparaciones, los marcos de la versión
recursiva, las vueltas de `buscarIterativa`, el mínimo y el máximo, y la peor
búsqueda de un árbol de altura 3.

## Insertar

### [insertar](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/insertar.html){ target=_blank rel=noopener }

Las claves 36 17 58 25 9 30 21 44 71 28 en un ABB vacío: el preorden y la
altura que dejan, una clave repetida, `insertarIterativa` con `padre` y
`actual`, y cuál de cuatro órdenes arma el mismo árbol.

### [reenganche](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/reenganche.html){ target=_blank rel=noopener }

`insertar` línea por línea con la pila de marcos a la vista: cuál de las
asignaciones `r->izq = insertar(r->izq, k)` cambia de verdad un puntero, y qué
pasa cuando falta la asignación.

## Borrar

### [borrar](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/borrar.html){ target=_blank rel=noopener }

Una hoja, un nodo con un hijo y dos nodos con dos hijos, uno de ellos la raíz,
cuyo sucesor tiene a su vez un hijo derecho. El preorden tras cada borrado,
`borrar(raiz, 47)` marco por marco y el olvido de `raiz =`.

## Lo que cuesta: la forma del árbol

### [forma](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/forma.html){ target=_blank rel=noopener }

Las claves 5, 10, …, 75 en orden decreciente, en zigzag, por niveles y
revueltas: la altura de cada árbol, las comparaciones que cuesta armarlo y las
cotas de h para 100 y 50 000 claves.

### [situaciones](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/situaciones.html){ target=_blank rel=noopener }

Turnos que llegan crecientes, códigos revueltos, un millón de claves y una
lista de 300 000 nodos: qué cobra el ABB en cada caso y cuándo le gana un
arreglo ordenado.

## Ejercicios con recursión

### [rango](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/rango.html){ target=_blank rel=noopener }

`esABBHijos` y `esABB` sobre un árbol con el 47 fuera de lugar: el rango que
hereda cada nodo, dónde corta el `&&` y qué valores arreglarían el árbol.

### [recorte](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/recorte.html){ target=_blank rel=noopener }

`contarRango` entre 27 y 55 y entre 92 y 99, y `kEsimo` con k = 3 y k = 7,
recursivo y con pila explícita: qué devuelven, en qué nodos entran y qué
subárboles se saltan.

## Para el juez

### [preorden](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/preorden.html){ target=_blank rel=noopener }

Del preorden 63 38 21 9 30 52 45 57 80 71 94 al posorden, un preorden que
llega ordenado, la raíz borrada con el sucesor frente al predecesor y el
espacio antes de cada clave en la salida.
