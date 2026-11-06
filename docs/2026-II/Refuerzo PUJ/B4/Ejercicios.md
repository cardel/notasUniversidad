# Ejercicios · Refuerzo PUJ 14 de noviembre

Actividades para trabajar en el navegador los temas de la
[sesión del 14 de noviembre](./14%20de%20noviembre.%20Colas%20de%20prioridad,%20bisecci%C3%B3n%20y%20dividir%20y%20vencer%C3%A1s.md).
`resolver` e `inversiones` acompañan a dos de los problemas de clase.

## Colas de prioridad

### [priority-queue](../../../actividades/estructuras-de-datos/cola-prioridad/priority-queue.html){ target=_blank rel=noopener }

Lo que imprime un programa con `push`, `top` y `pop`, y un comparador que deja el
menor arriba. Es la operación de la que depende UVa 1203.

## Bisección: cuando la función ya viene dada

### [resolver un problema de juez](../../../actividades/ayg-puj/busqueda-binaria/resolver.html){ target=_blank rel=noopener }

UVa 10341, el primer problema de la hora 2, atacado en diez tarjetas que se abren una
tras otra: entender la entrada, nombrar la función, demostrar término a término
que decrece, mirar el rango, decidir si la solución existe, fijar la tolerancia
y recién ahí escribir código. La tarjeta de la monotonía es la que decide el
problema.

### [biseccion](../../../actividades/ayg-puj/busqueda-binaria/biseccion.html){ target=_blank rel=noopener }

La bisección sobre una función continua, con tres funciones distintas, para ver
qué pasa cuando el objetivo queda fuera del rango.

## Bisección sobre la respuesta

### [buscar](../../../actividades/ayg-puj/busqueda-binaria/buscar.html){ target=_blank rel=noopener }

La búsqueda binaria sobre un arreglo ordenado, división por división. UVa 11413
aplica la misma idea sobre las capacidades posibles.

## Dividir y vencerás

### [contar parejas fuera de orden](../../../actividades/ayg-puj/recursion/inversiones.html){ target=_blank rel=noopener }

UVa 10810, el problema de la hora 3. Se predice el número de parejas sobre un
arreglo chico y después corre el código de la sesión, con las dos posiciones de
la mezcla marcadas y el aporte de cada elemento que sale de la derecha.

### [mezclar](../../../actividades/ayg-puj/recursion/mezclar.html){ target=_blank rel=noopener }

La mezcla sola, escritura por escritura, con su pareja de invariantes. Es el
paso de combinación del ejercicio anterior, sin el conteo encima.

### [ordenar](../../../actividades/ayg-puj/recursion/ordenar.html){ target=_blank rel=noopener }

El ordenamiento por mezcla completo, con el árbol de llamadas a la vista: de
cuánto trabajo hay en cada nivel y por qué hay logarítmicos niveles.
