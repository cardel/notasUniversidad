# Ejercicios interactivos

Clase 14 — iteradores y algoritmos de la STL (23 de septiembre). Cada
enlace abre una actividad que se trabaja directo en el navegador, en el
mismo orden de los temas de la sesión. Los programas no son los de la
sesión: mismo tema, ronda nueva.

## Un iterador es un puntero que sabe recorrer

### [iterador](widgets/iterador.html){ target=_blank rel=noopener }

Posición e índice de `v.begin() + 3`, un recorrido con iterador que
imprime solo los pares contando cuántas veces se lee `*it`, y qué es
`end()` después de cinco avances.

## El iterador colgante

### [borrar](widgets/borrar.html){ target=_blank rel=noopener }

Quitar los negativos con `it = v.erase(it)`, el ciclo con `erase` y luego
`++it` que se salta un elemento, y cuántos corrimientos cuesta cada versión
frente a compactar.

## Los algoritmos que faltaban

### [buscar](widgets/buscar.html){ target=_blank rel=noopener }

`lower_bound` con cuatro consultas sobre un vector ordenado, incluidas una
que no está y una mayor que todos; `sort`, `unique` y `erase` sobre un
vector con repetidos; y `accumulate` con el 0 que desborda.

## Ejercicios con la biblioteca

### [ejercicios](widgets/ejercicios.html){ target=_blank rel=noopener }

La intersección con dos iteradores y sus vueltas del `while`, las
frecuencias de palabras con `sort`, y la mediana de un vector impar y de
uno par.

## Lo que cobra cada operación

### [costos](widgets/costos.html){ target=_blank rel=noopener }

Cuántas mitades hace `lower_bound` sobre 4096, qué cuesta borrar k
elementos uno a uno, qué conviene para un millón de consultas y cuánto
espacio pide `sort`.
