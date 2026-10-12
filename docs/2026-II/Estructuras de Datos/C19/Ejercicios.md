# Ejercicios · Estructuras de Datos C19

Clase 19 — ejercicios sobre las implementaciones y quicksort (14 de octubre).
Cada enlace abre una actividad que se trabaja directo en el navegador, en el
mismo orden de los temas de la sesión. Los programas y los arreglos no son los
de la sesión: mismo tema, ronda nueva.

## Las tres implementaciones enlazadas

### [caminar](./widgets/caminar.html){ target=_blank rel=noopener }

Sumar los doce elementos de una lista, una cola y una pila sobre nodos usando
solo el contrato: cuántos nodos recorre cada una, cuántos reserva y cuál de las
tres termina en Θ(n²).

## Ejercicios sobre las implementaciones

### [rotar](./widgets/rotar.html){ target=_blank rel=noopener }

Pasar el frente de la cola al final cambiando punteros: qué lista hace falta
debajo, cuál de tres órdenes de asignación pierde la cadena, qué pasa con un
solo elemento y cuánto cuesta.

### [concatenar](./widgets/concatenar.html){ target=_blank rel=noopener }

Colgar una cola detrás de otra en Θ(1) desde dentro de la clase, contra la
versión con el contrato que cuesta Θ(m), con el caso de la cola vacía y la
razón para dejar vacía la segunda.

## Pagar al partir: quicksort

### [particionar](./widgets/particionar.html){ target=_blank rel=noopener }

`particionar` sobre siete elementos, vuelta por vuelta, con `i`, `j` y la zona
de cada casilla: dónde queda el pivote antes de correrlo, cómo queda el arreglo
y cuántas veces se llama a `intercambiar`.

### [invariantes](./widgets/invariantes.html){ target=_blank rel=noopener }

Seis estados anotados durante una partición; en cada uno, cuál de los
invariantes I1 a I5 deja de cumplirse, si alguno.

### [libre](./widgets/libre.html){ target=_blank rel=noopener }

Un arreglo propio, de hasta doce enteros: la partición paso a paso y la tabla
de todas las llamadas de `quicksort` que lo ordenan, con las comparaciones y la
profundidad de la pila.

## Lo que cuesta quicksort

### [comparaciones](./widgets/comparaciones.html){ target=_blank rel=noopener }

Predecir las comparaciones de quicksort sobre una entrada ordenada, la misma al
revés y una balanceada, y cuántas llamadas llegan a estar abiertas a la vez.
Después, las llamadas una por una.

### [peorcaso](./widgets/peorcaso.html){ target=_blank rel=noopener }

Cuatro órdenes de los mismos siete valores: cuál es el peor caso aunque no lo
parezca, qué lo hace caro, cuánto ahorra el pivote del medio y qué pivote
impide que una entrada fija lo provoque siempre.
