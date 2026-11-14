# Ejercicios · Refuerzo PUJ 14 de noviembre

Actividades para trabajar en el navegador los temas de la
[sesión](./14%20de%20noviembre.%20Planteamiento%20e%20invariantes%20de%20ciclo.md).
Las tres primeras corren el código de los problemas que se resuelven en clase, y
las de invariantes acompañan a la hora de lógica. Las de colas de prioridad,
bisección y dividir y vencerás van con los problemas propuestos.

## Cómo se plantea la solución

### [repartir textos entre empleados](../../../actividades/ayg-puj/busqueda-binaria/turnos.html){ target=_blank rel=noopener }

Bisección sobre la respuesta: preguntas de planteamiento, y después se mueven `lo` y `hi` sobre la fila de textos hasta 1700.

### [una rejilla con zonas prohibidas](../../../actividades/ayg-puj/grafos-implicitos/zonas.html){ target=_blank rel=noopener }

Se marcan las zonas con la distancia euclidiana y se avanza el frente de la cola sobre el tablero, decidiendo qué vecinas entran.

### [dos colores](../../../actividades/ayg-puj/representaciones-y-recorridos/colores.html){ target=_blank rel=noopener }

Se escoge el color de cada nodo con la pila de llamadas a la vista, hasta ver el choque en el triángulo y el pedazo que queda sin mirar.

## Recorridos: tipos de arista y ciclos

### [los tipos de arista](../../../actividades/ayg-puj/orden-topologico-dfs-low/aristas.html){ target=_blank rel=noopener }

Antes de que la profundidad pinte cada arista hay que predecir si es de árbol, de
retroceso, de avance o cruzada, en un grafo dirigido y en el mismo sin flechas.

### [kahn](../../../actividades/ayg-puj/orden-topologico-kahn/kahn.html){ target=_blank rel=noopener }

Los grados de entrada y la cola, paso a paso.

### [ciclo](../../../actividades/ayg-puj/orden-topologico-kahn/ciclo.html){ target=_blank rel=noopener }

La cola se vacía antes de tiempo: cuántos nodos alcanzan a salir y quiénes se quedan.

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

## Colas de prioridad

### [priority-queue](../../../actividades/estructuras-de-datos/cola-prioridad/priority-queue.html){ target=_blank rel=noopener }

Lo que imprime un programa con `push`, `top` y `pop`, y un comparador que deja el
menor arriba. Es la operación de la que depende UVa 1203, uno de los propuestos.

## Bisección: cuando la función ya viene dada

### [resolver un problema de juez](../../../actividades/ayg-puj/busqueda-binaria/resolver.html){ target=_blank rel=noopener }

UVa 10341 atacado en diez tarjetas que se abren una
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

UVa 10810. Se predice el número de parejas sobre un
arreglo chico y después corre el código de la sesión, con las dos posiciones de
la mezcla marcadas y el aporte de cada elemento que sale de la derecha.

### [mezclar](../../../actividades/ayg-puj/recursion/mezclar.html){ target=_blank rel=noopener }

La mezcla sola, escritura por escritura, con su pareja de invariantes. Es el
paso de combinación del ejercicio anterior, sin el conteo encima.

### [ordenar](../../../actividades/ayg-puj/recursion/ordenar.html){ target=_blank rel=noopener }

El ordenamiento por mezcla completo, con el árbol de llamadas a la vista: de
cuánto trabajo hay en cada nivel y por qué hay logarítmicos niveles.
