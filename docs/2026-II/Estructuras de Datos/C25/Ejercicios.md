# Ejercicios · Estructuras C25

El árbol rojinegro y el contenedor `set`: por qué un ABB con claves en orden
se vuelve una lista, las cinco reglas, las rotaciones, la inserción caso por
caso, el árbol que hay dentro de `map` y las operaciones del `set`. Cada
enlace abre una actividad que se trabaja directo en el navegador, en el mismo
orden de los temas de la
[sesión](./Clase%2025.%20%C3%81rboles%20rojinegros%20y%20el%20contenedor%20set.md).
Los árboles, las secuencias y los programas no son los de la sesión: mismo
tema, ronda nueva. Las más exigentes son `casos` e `insertar`.

## El problema: claves que llegan en orden

### [reconstruir](../../../actividades/estructuras-de-datos/arbol-rojinegro/reconstruir.html){ target=_blank rel=noopener }

Un contador de radicados que arma una lista en el ABB, las comparaciones que
cuesta, lo que cobra reconstruir el árbol balanceado tras cada inserción y lo
que de verdad hace falta.

## Las cinco reglas

### [reglas](../../../actividades/estructuras-de-datos/arbol-rojinegro/reglas.html){ target=_blank rel=noopener }

Cinco árboles coloreados para decidir si son rojinegros y qué regla rompen, uno
de ellos con un rojo de un solo hijo, y la coloración que arregla al que falla.

### [alturanegra](../../../actividades/estructuras-de-datos/arbol-rojinegro/alturanegra.html){ target=_blank rel=noopener }

La altura negra de tres nodos, el camino más largo frente al más corto y la
cota 2 log₂(n + 1) con 4095 claves.

## Rotaciones

### [rotar](../../../actividades/estructuras-de-datos/arbol-rojinegro/rotar.html){ target=_blank rel=noopener }

Una rotación a la derecha en la raíz y otra a la izquierda en un nodo interno:
los tres enlaces que cambian, el subárbol que cambia de padre, el inorden que se
conserva y lo que cuesta.

## Insertar y borrar

### [casos](../../../actividades/estructuras-de-datos/arbol-rojinegro/casos.html){ target=_blank rel=noopener }

Cinco claves que entran rojas a un árbol pequeño: decidir si no pasa nada, si
el tío rojo pide recolorear o si hay que rotar una o dos veces, y cómo queda.

### [insertar](../../../actividades/estructuras-de-datos/arbol-rojinegro/insertar.html){ target=_blank rel=noopener }

Los códigos 5 19 9 28 38 48 45 59 55 en un rojinegro vacío: el árbol tras las
cuatro primeras, los casos de cada clave, el árbol final y la comparación con el
ABB de la misma secuencia.

## Lo que hay dentro de `map`

### [dentromap](../../../actividades/estructuras-de-datos/arbol-rojinegro/dentromap.html){ target=_blank rel=noopener }

Un `map` de rutas visto como el rojinegro que lo guarda: por qué el recorrido
sale en orden, a dónde va `++it` y cuánto puede medir el árbol con trescientas mil
de claves.

## El contenedor `set`

### [operaciones](../../../actividades/estructuras-de-datos/contenedor-set/operaciones.html){ target=_blank rel=noopener }

Los buses que pasan por un peaje: qué imprime un programa que cuenta repetidos
con `count`, avanza con `++it` desde `find` y borra con `erase`.

### [bordes](../../../actividades/estructuras-de-datos/contenedor-set/bordes.html){ target=_blank rel=noopener }

Las salidas de un tren: `lower_bound` y `upper_bound`, la salida anterior a un
minuto, cuántas caen en un intervalo y la trampa del `lower_bound` de
`<algorithm>`.

### [elegir](../../../actividades/estructuras-de-datos/contenedor-set/elegir.html){ target=_blank rel=noopener }

Cinco situaciones para escoger entre `set`, `map`, `unordered_map` y un
`vector` ordenado una sola vez, con lo que falla en cada alternativa.

## Para el juez

### [compuestas](../../../actividades/estructuras-de-datos/contenedor-set/compuestas.html){ target=_blank rel=noopener }

*UVa 10391, Compound Words*, con un `set<string>`. Enunciado:
<https://onlinejudge.org/external/103/10391.pdf>. Envío:
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1332>.
Por qué una palabra de tres partes no sale, qué estrategia se descarta por
tiempo, qué imprime un diccionario propio y cuántos cortes se prueban.
