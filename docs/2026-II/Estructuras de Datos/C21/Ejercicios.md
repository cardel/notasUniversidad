# Ejercicios · Estructuras C21

Actividades para trabajar en el navegador, en el orden de los temas de la
[clase](./Clase%2021.%20Tablas%20de%20direccionamiento%20directo%20y%20tablas%20hash.md).
Los programas y los valores no son los de la sesión: mismo tema, ronda nueva.

## TAD tabla de direccionamiento directo

### [casillas](../../../actividades/estructuras-de-datos/tabla-direccionamiento-directo/casillas.html){ target=_blank rel=noopener }

Una tabla de ocho casillas y nueve operaciones: qué casilla toca cada una, qué
queda guardado y qué pasa con una clave fuera del universo.

### [costos](../../../actividades/estructuras-de-datos/tabla-direccionamiento-directo/costos.html){ target=_blank rel=noopener }

El costo de buscar, de crear la tabla y de encontrar la clave más pequeña, y
tres universos para decidir si la tabla directa sirve: edades, habitaciones de
hotel y placas de carro.

### [contar](../../../actividades/estructuras-de-datos/tabla-direccionamiento-directo/contar.html){ target=_blank rel=noopener }

Puntajes de un quiz contados en una tabla de contadores, el recorrido que la
imprime y los bytes que ocupan dos tablas.

### [banderas](../../../actividades/estructuras-de-datos/tabla-direccionamiento-directo/banderas.html){ target=_blank rel=noopener }

Un arreglo con dos valores repetidos: dónde se detiene la versión que compara
pares y dónde la que marca banderas, y cuándo deja de convenir la tabla.

## Pocas claves, universo enorme: la función hash

### [universo](../../../actividades/estructuras-de-datos/tabla-hash/universo.html){ target=_blank rel=noopener }

Cuánto ocupa una tabla de direccionamiento directo para teléfonos de 7 dígitos,
qué parte de ella se usa y cuánto cuesta buscar en una lista enlazada.

### [casilla](../../../actividades/estructuras-de-datos/tabla-hash/casilla.html){ target=_blank rel=noopener }

El método de la división con m = 17: la casilla de cada clave, los pares que
chocan y lo que pasa con una tabla de 1000 casillas.

### [cadenas](../../../actividades/estructuras-de-datos/tabla-hash/cadenas.html){ target=_blank rel=noopener }

La suma de los códigos y el polinomio en base 31 sobre `mar` y `ram`, paso a
paso.

## Encadenamiento

### [encadenar](../../../actividades/estructuras-de-datos/tabla-hash/encadenar.html){ target=_blank rel=noopener }

Seis claves que entran a una tabla de cinco casillas, colgando al frente de
cada lista, y el factor de carga que queda.

### [buscar](../../../actividades/estructuras-de-datos/tabla-hash/buscar.html){ target=_blank rel=noopener }

Cuántas comparaciones hace cada búsqueda y qué puntero cambia al eliminar.

## Lo que cuesta

### [carga](../../../actividades/estructuras-de-datos/tabla-hash/carga.html){ target=_blank rel=noopener }

El promedio de las listas frente a la más larga, la búsqueda en el peor caso y
la cota de 1 + α.

### [escoger](../../../actividades/estructuras-de-datos/tabla-hash/escoger.html){ target=_blank rel=noopener }

Las mismas claves con m = 100, 128 y 97: cuántas casillas se usan y cuánto
mide la lista más larga.

## Para el juez

### [negativos](../../../actividades/estructuras-de-datos/tabla-hash/negativos.html){ target=_blank rel=noopener }

El residuo de C++ con claves negativas y la corrección que deja la casilla
entre 0 y m − 1.
