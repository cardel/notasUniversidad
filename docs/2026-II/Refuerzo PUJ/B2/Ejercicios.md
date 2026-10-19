# Ejercicios · Refuerzo PUJ 24 de octubre

Ocho actividades para trabajar en el navegador lo que se vio en la
[sesión del 24 de octubre](./24%20de%20octubre.%20Tramos,%20matrices,%20recursi%C3%B3n%20e%20invariantes.md).
Las tres primeras recorren paso a paso los problemas de clase y la cuarta
pregunta por el costo de las soluciones. Las cuatro últimas son de lógica:
encontrar el invariante de un ciclo, escribirlo como fórmula y demostrarlo en
tres pasos.

## [mejor-tramo](../../../actividades/estructuras-de-datos/recorridos-arreglos/mejor-tramo.html){ target=_blank rel=noopener }

UVa 507: decidir en cada posición si el tramo sigue o se reinicia, con el
desempate por el tramo más largo y después por el que empieza antes.

## [acumulados](../../../actividades/estructuras-de-datos/matrices/acumulados.html){ target=_blank rel=noopener }

UVa 108: con la tabla de acumulados de una matriz, obtener la suma de
cualquier rectángulo con cuatro lecturas.

## [movil](../../../actividades/ayg-puj/recursion/movil.html){ target=_blank rel=noopener }

UVa 839: seguir la función recursiva lectura por lectura, con el móvil
dibujado a la izquierda y la pila de llamadas a la derecha. En cada barra se
elige el caso, y en cada retorno se escribe el peso y si está en equilibrio.

## [tamano](../../../actividades/estructuras-de-datos/ejercicios-complejidad/tamano.html){ target=_blank rel=noopener }

Ocho soluciones de juez, entre ellas las de 507, 108, 839, 100, 10189 y 620:
decir de qué variable depende el tamaño, cuántas veces corre cada ciclo o
llamada, el total en $O$ y si alcanza contra los límites del enunciado.

## [sumar](../../../actividades/ayg-puj/recursion/sumar.html){ target=_blank rel=noopener }

La suma de un arreglo: predecir qué devuelve, mirar la traza de estados y
encontrar los invariantes $I_0$ e $I_1$, que se demuestran con
inicialización, estabilidad y terminación.

## [mayores](../../../actividades/ayg-puj/invariantes/mayores.html){ target=_blank rel=noopener }

El mayor y el segundo mayor en un recorrido: ninguno de los dos invariantes se
demuestra por separado, y un arreglo con todos los valores iguales decide cómo
escribir el del segundo.

## [credito](../../../actividades/ayg-puj/invariantes/credito.html){ target=_blank rel=noopener }

UVa 11078: los invariantes de `maximo` y de `mejor` en el ciclo de la
solución. Al elegir un candidato errado, la traza marca en rojo el chequeo
donde falla, y el invariante de `mejor` muestra por qué el valor inicial
cuenta.

## [tramo](../../../actividades/ayg-puj/invariantes/tramo.html){ target=_blank rel=noopener }

UVa 507 sin el desempate: el invariante de `suma` y el de `mejor`, con el
tramo vacío como el 0. El de `mejor` no se deja demostrar sin el de `suma`.
