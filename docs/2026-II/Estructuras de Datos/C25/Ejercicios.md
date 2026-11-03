# Ejercicios · Estructuras C25

El contenedor `set` y los montículos: las operaciones del `set` y sus bordes,
cuándo conviene frente a otros contenedores, y el montículo de máximos guardado
en un arreglo, con insertar subiendo, extraer bajando y lo que cuesta cada
operación. Cada enlace abre una actividad que se trabaja directo en el
navegador, en el mismo orden de los temas de la
[sesión](./Clase%2025.%20El%20contenedor%20set%20y%20los%20mont%C3%ADculos.md).
Los árboles, los arreglos y los programas no son los de la sesión: mismo tema,
ronda nueva. Las más exigentes son `errores` y `compuestas`.

## Repaso: el ABB y las claves en orden

### [forma](../../../actividades/estructuras-de-datos/arbol-binario-busqueda/forma.html){ target=_blank rel=noopener }

Las mismas claves insertadas en cuatro órdenes distintos: la altura de cada
árbol y lo que cuesta armarlo cuando llegan en orden.

## El contenedor `set`

### [operaciones](../../../actividades/estructuras-de-datos/contenedor-set/operaciones.html){ target=_blank rel=noopener }

Los buses que pasan por un peaje: qué imprime un programa que cuenta repetidos
con `count`, avanza con `++it` desde `find` y borra con `erase`.

### [bordes](../../../actividades/estructuras-de-datos/contenedor-set/bordes.html){ target=_blank rel=noopener }

Las salidas de un tren con `lower_bound` y `upper_bound`, la salida anterior a
un minuto, cuántas caen en un intervalo y lo que cuesta el `lower_bound` de
`<algorithm>` sobre un `set`.

### [elegir](../../../actividades/estructuras-de-datos/contenedor-set/elegir.html){ target=_blank rel=noopener }

Cinco situaciones para escoger entre `set`, `map`, `unordered_map` y un
`vector` ordenado una sola vez, con lo que falla en cada alternativa.

## Montículos

### [urgente](../../../actividades/estructuras-de-datos/monticulo/urgente.html){ target=_blank rel=noopener }

Una sala de urgencias que atiende por prioridad: qué se atiende, qué queda,
cuántas comparaciones paga el arreglo sin orden y cuántas casillas corre el
ordenado.

### [completo](../../../actividades/estructuras-de-datos/monticulo/completo.html){ target=_blank rel=noopener }

Cuáles de cuatro árboles son completos, el padre y los hijos de una casilla con
índices desde 0, y el paso del árbol al arreglo y del arreglo al árbol.

### [cuales](../../../actividades/estructuras-de-datos/monticulo/cuales.html){ target=_blank rel=noopener }

Cinco arreglos para decidir si son montículos de máximos, entre ellos uno con
una clave menor que la raíz que igual rompe el orden, uno con claves iguales y
un montículo de mínimos.

### [insertar](../../../actividades/estructuras-de-datos/monticulo/insertar.html){ target=_blank rel=noopener }

Tres claves que llegan a un montículo de once: el árbol y el arreglo en cada
intercambio, la traza en una tabla y una clave igual a su padre.

### [extraer](../../../actividades/estructuras-de-datos/monticulo/extraer.html){ target=_blank rel=noopener }

Dos extracciones paso a paso, el empate entre dos hijos iguales y lo que deja
un `bajar` que solo mira el hijo izquierdo.

### [errores](../../../actividades/estructuras-de-datos/monticulo/errores.html){ target=_blank rel=noopener }

Bajar con el primer hijo mayor, subir con el padre en `i / 2` y extraer
subiendo hijos: qué arreglo deja cada versión y qué se rompe.

### [costos](../../../actividades/estructuras-de-datos/monticulo/costos.html){ target=_blank rel=noopener }

La altura para 12, 200 y 70 000 claves, cuántos intercambios hacen insertar y
extraer en un árbol lleno, y por qué el montículo cabe en un arreglo.

## Para el juez

### [compuestas](../../../actividades/estructuras-de-datos/contenedor-set/compuestas.html){ target=_blank rel=noopener }

UVa 10391, Compound Words, con un `set<string>`: por qué una palabra de tres
partes no sale, qué estrategia se descarta por tiempo y cuántos cortes se
prueban.
