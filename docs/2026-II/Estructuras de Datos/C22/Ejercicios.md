# Ejercicios · Estructuras C22

Los contenedores `map` y `unordered_map`, y las claves compuestas. Cada enlace
abre una actividad que se trabaja directo en el navegador, en el mismo orden de
los temas de la [sesión](./Clase%2022.%20El%20contenedor%20map%20y%20ejercicios.md). Las claves y
los programas no son los de la sesión: mismo tema, ronda nueva.

## Un problema donde importa el orden

### [orden](../../../actividades/estructuras-de-datos/contenedor-map/orden.html){ target=_blank rel=noopener }

Las claves 23, 9, 41, 16 y 30 en una tabla hash de cinco casillas y en un
`map`: en qué orden sale cada recorrido y qué cuesta ordenar al final.

## El contenedor map

### [corchetes](../../../actividades/estructuras-de-datos/contenedor-map/corchetes.html){ target=_blank rel=noopener }

Un `map` línea por línea, con lo que inserta `m[k]` también cuando solo se
quería preguntar.

### [consultar](../../../actividades/estructuras-de-datos/contenedor-map/consultar.html){ target=_blank rel=noopener }

Lo que devuelven `count`, `find` y `erase`, qué es `end()` y qué se puede
cambiar por el iterador.

### [palabras](../../../actividades/estructuras-de-datos/contenedor-map/palabras.html){ target=_blank rel=noopener }

Un `map<string, int>` fila por fila, su recorrido en orden alfabético y lo que
pasa con una clave `char *`.

## Lo que cuesta

### [elegir](../../../actividades/estructuras-de-datos/contenedor-map/elegir.html){ target=_blank rel=noopener }

Cuántas comparaciones hace el `map` con mil y con mil millones de claves, y qué
estructura conviene en cuatro situaciones.

## El contenedor unordered_map

### Funciones hash

#### [multiplicacion](../../../actividades/estructuras-de-datos/tabla-hash/multiplicacion.html){ target=_blank rel=noopener }

El método de la multiplicación con A = 0,7071 paso a paso, los múltiplos de 32
con m = 32 y lo que hace una constante mala.

### Cubetas y recorrido

#### [cubetas](../../../actividades/estructuras-de-datos/contenedor-unordered-map/cubetas.html){ target=_blank rel=noopener }

Siete claves en 13 cubetas: la cubeta de cada una, el orden en que las recorre
g++ y una prueba que sale en orden por casualidad.

### Factor de carga y rehash

#### [rehash](../../../actividades/estructuras-de-datos/contenedor-unordered-map/rehash.html){ target=_blank rel=noopener }

Cuándo pasa `bucket_count()` de 13 a 29, dónde quedan las claves después y
cuántas claves vuelven a colgar los rehash de mil inserciones.

### ¿map o unordered_map?

#### [elegir](../../../actividades/estructuras-de-datos/contenedor-unordered-map/elegir.html){ target=_blank rel=noopener }

Cinco situaciones donde deciden el orden, un rango de fechas, el conteo o el
tiempo de cada operación por separado.

## Claves compuestas en map y unordered_map

### [comparador](../../../actividades/estructuras-de-datos/claves-compuestas/comparador.html){ target=_blank rel=noopener }

Seis personas ordenadas por edad, salario de mayor a menor y nombre, y lo que
queda cuando el comparador olvida el nombre o compara con `<=`.

### [hash-persona](../../../actividades/estructuras-de-datos/claves-compuestas/hash-persona.html){ target=_blank rel=noopener }

Tres funciones hash sobre cinco personas: qué parejas chocan, cuál conviene y
qué pasa cuando dos claves iguales dan hash distinto.

## Para el juez

### [combinacion](../../../actividades/estructuras-de-datos/contenedor-map/combinacion.html){ target=_blank rel=noopener }

Tres cursos ordenados y pegados en una clave entera, y cuántos estudiantes
ganan cuando dos combinaciones empatan.
