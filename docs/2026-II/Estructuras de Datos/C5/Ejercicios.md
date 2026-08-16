# Ejercicios interactivos

Cada enlace abre un ejercicio de conteo que se trabaja directo en el
navegador. La mecánica es la misma en todos: elija la entrada, escriba su
predicción antes de ejecutar y recorra el código paso a paso viendo
cuántas veces corre cada línea. Estos cuatro cubren las ideas nuevas de la
sesión: el mejor y el peor caso, los pasos que no son de uno en uno y los
bloques en secuencia.

## [todos_positivos](widgets/todos_positivos.html)

La función corta apenas encuentra un valor que no es positivo, así que el
conteo depende de los datos: entre 8 pasos (mejor caso) y 3n + 4 (peor
caso) con el mismo n.

Toque las casillas del arreglo para cambiar el signo de un valor, o use
los presets, y mire dónde se frena la ejecución y cómo cambia el total.

## [paso_grande](widgets/paso_grande.html)

El índice avanza de n/5 en n/5. El paso crece con n, pero el camino
también, y las vueltas quedan clavadas entre 6 y 8 para cualquier n ≥ 10:
el costo es constante.

Pruebe n = 20, 65 y 1000 con los botones y compare el contador. La nota de
alerta explica por qué el enunciado exige n ≥ 10.

## [mitades](widgets/mitades.html)

El índice arranca en n y se parte por la mitad en cada vuelta. Es el
espejo de potencias, el ejercicio del miércoles: bajar partiendo en dos
cuesta lo mismo que subir duplicando, ⌊log₂ n⌋ + 1 vueltas.

Suba n hasta 1000 y mire la secuencia n, n/2, n/4, … La división es
entera: el último valor visitado siempre es 1.

## [combinado](widgets/combinado.html)

Tres bloques en secuencia: buscar el mayor (lineal), contar las parejas
que lo superan (cuadrático) y duplicar hasta llegar a n (logarítmico).
Los conteos se suman, y al crecer n uno de los tres se come a los demás.

Antes de ejecutar, responda cuál bloque manda. Las barras muestran el
aporte de cada uno con el n elegido y la tabla final lo repite con
n = 10, 100 y 1000: la función es O(n²).
