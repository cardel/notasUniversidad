# Ejercicios · Estructuras C3

Introducción a la complejidad computacional: el cortocircuito de `&&` y `||`,
por qué el reloj no mide el algoritmo, el conteo de instrucciones con la
evaluación que sale del ciclo, el mejor y el peor caso y los ciclos anidados.
Cada enlace abre una actividad que se trabaja directo en el navegador, en el
mismo orden de los temas de la
[sesión](./Clase%203.%20Introducci%C3%B3n%20a%20la%20complejidad%20computacional.md).
Los programas y los arreglos no son los de la sesión: mismo tema, ronda nueva.
Las más exigentes son `corte` y `parejas`.

## Los operadores de cortocircuito

### [cortocircuito](../../../actividades/estructuras-de-datos/introduccion-complejidad/cortocircuito.html){ target=_blank rel=noopener }

Cuántas veces se evalúa cada lado de `i < n && datos[i] != 0` con y sin un
cero, lo que lee `&` en la última vuelta, tres condiciones unidas con `||` y
el orden de los lados.

## El reloj no mide el algoritmo

### [reloj](../../../actividades/estructuras-de-datos/introduccion-complejidad/reloj.html){ target=_blank rel=noopener }

Un programa medido con `time` con tres tamaños, tres corridas iguales que no
coinciden, lo que cambia con `-O2` y el conteo de instrucciones con m = 70.

## El ciclo y la evaluación que sobra

### [cuadrados](../../../actividades/estructuras-de-datos/introduccion-complejidad/cuadrados.html){ target=_blank rel=noopener }

Un ciclo que arranca en 1 y compara con `<=`: cuántas veces se evalúa la
condición, la tabla de conteo línea por línea y T(m).

## Cuando el conteo depende de los datos

### [rango](../../../actividades/estructuras-de-datos/introduccion-complejidad/rango.html){ target=_blank rel=noopener }

El mayor menos el menor de un arreglo con dos `if` adentro del ciclo: cuatro
entradas del mismo tamaño, cuál es el mejor caso y T en el mejor y el peor.

## El mismo código, dos comportamientos

### [corte](../../../actividades/estructuras-de-datos/introduccion-complejidad/corte.html){ target=_blank rel=noopener }

La búsqueda del último cero que se detiene al encontrarlo: la traza con dos
ceros, los dos extremos con n = 5, T en términos de n y cuál caso se reporta.

## Un ciclo adentro de otro

### [parejas](../../../actividades/estructuras-de-datos/introduccion-complejidad/parejas.html){ target=_blank rel=noopener }

Dos ciclos anidados con tamaños n y m: las evaluaciones del ciclo de adentro,
T(n, m) y lo que pasa si m no crece.
