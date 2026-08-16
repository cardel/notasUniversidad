# Ejercicios interactivos

Cada enlace abre un ejercicio de conteo que se trabaja directo en el
navegador. La mecánica es la misma en todos: elija el tamaño de la
entrada, escriba su predicción antes de ejecutar y recorra el código paso
a paso. Cada línea muestra al lado cuántas veces se ha ejecutado, la traza
se llena vuelta por vuelta y, cuando la ejecución llega al final, se
revelan las fórmulas para comparar contra lo simulado.

## [triangulo](widgets/triangulo.html)

El punto de partida de la clase: el ciclo interno depende del externo, así
que multiplicar las cotas engaña. El cuerpo corre 0, 1, 2, … veces y la
suma da n(n − 1)/2.

Prediga con n = 4 y ejecute. Después abra el dibujo de la escalera y use
el botón del truco de Gauss para ver de dónde sale la división entre 2.

## [contar_incluida](widgets/contar_incluida.html)

El mismo triángulo con la condición j <= i. Un signo igual corre toda la
fórmula: la suma pasa de 0 + 1 + … + (n − 1) a 1 + 2 + … + n.

Si ya trabajó el anterior, prediga sin ejecutar y compruebe. Compare las
dos escaleras: esta tiene un escalón más en cada fila.

## [suma_parejas](widgets/suma_parejas.html)

Aquí j arranca en i: la función recorre las parejas (i, j) con i ≤ j y el
patrón de veces baja (n, n − 1, …, 1) en vez de subir. La escalera queda
al revés y el total es el mismo n(n + 1)/2.

Mire la traza: la primera vuelta es la más pesada y la última corre una
sola vez. El espejo de Gauss también funciona con la escalera invertida.

## [potencias](widgets/potencias.html)

El índice no suma: se duplica (i = 2 · i). Las vueltas son ⌊log₂ n⌋ + 1 y
casi no crecen con n.

Use los botones de 10, 100 y 1000 y mire la secuencia de valores que
visita el índice. La tabla de crecimiento muestra por qué a este
comportamiento se le llama logarítmico.
