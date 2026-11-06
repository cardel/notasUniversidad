# Ejercicios · Refuerzo PUJ 7 de noviembre

Actividades para trabajar en el navegador los temas de la
[sesión del 7 de noviembre](./7%20de%20noviembre.%20Bisecci%C3%B3n%20y%20dividir%20y%20vencer%C3%A1s.md).
Las tres primeras acompañan a los problemas que se resuelven en clase.

## Bisección: encontrar la función

### [la escalera y el factor de fuerza](../../../actividades/ayg-puj/busqueda-binaria/escalera.html){ target=_blank rel=noopener }

UVa 12032, el problema de la hora 1. Se predice la fuerza mínima mirando la
escalera y después corre el código de la sesión, las dos funciones: la que
simula la subida, que es la función de decisión, y la que la bisecta. Cuatro
escaleras, entre ellas una donde la respuesta no es el salto más grande.

### [buscar](../../../actividades/ayg-puj/busqueda-binaria/buscar.html){ target=_blank rel=noopener }

La búsqueda binaria sobre un arreglo ordenado, división por división, con las
posiciones descartadas tachándose. Es la mecánica que después se aplica sobre
una función de decisión en vez de sobre un arreglo.

## Bisección: cuando la función ya viene dada

### [resolver un problema de juez](../../../actividades/ayg-puj/busqueda-binaria/resolver.html){ target=_blank rel=noopener }

UVa 10341, el problema de la hora 2, atacado en diez tarjetas que se abren una
tras otra: entender la entrada, nombrar la función, demostrar término a término
que decrece, mirar el rango, decidir si la solución existe, fijar la tolerancia
y recién ahí escribir código. La tarjeta de la monotonía es la que decide el
problema.

### [biseccion](../../../actividades/ayg-puj/busqueda-binaria/biseccion.html){ target=_blank rel=noopener }

La bisección sobre una función continua, con tres funciones distintas, para ver
qué pasa cuando el objetivo queda fuera del rango.

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
dónde sale la recurrencia y por qué hay logarítmicos niveles.

## Costo

### [tamano](../../../actividades/estructuras-de-datos/ejercicios-complejidad/tamano.html){ target=_blank rel=noopener }

Ocho soluciones de juez, entre ellas la de UVa 839: decir de qué variable
depende el tamaño, cuántas veces corre cada ciclo o llamada, el total en $O$ y
si alcanza contra los límites del enunciado.

## Invariantes de ciclo

### [sumar](../../../actividades/ayg-puj/recursion/sumar.html){ target=_blank rel=noopener }

La suma de un arreglo: predecir qué devuelve, mirar la traza de estados y
encontrar los invariantes $I_0$ e $I_1$, que se demuestran con
inicialización, estabilidad y terminación.

### [credito](../../../actividades/ayg-puj/invariantes/credito.html){ target=_blank rel=noopener }

UVa 11078: los invariantes del mayor y de `mejor`, con el mayor llamado
`maximo`. Al elegir un candidato errado, la traza marca en rojo el chequeo
donde falla.

### [mayores](../../../actividades/ayg-puj/invariantes/mayores.html){ target=_blank rel=noopener }

El mayor y el segundo mayor en un recorrido: ninguno de los dos invariantes se
demuestra por separado, y un arreglo con todos los valores iguales decide cómo
escribir el del segundo.

### [tramo](../../../actividades/ayg-puj/invariantes/tramo.html){ target=_blank rel=noopener }

UVa 507 sin el desempate: los invariantes de `suma` y de `mejor`. Trae la
respuesta del ejercicio en papel, así que va después de intentarlo.
