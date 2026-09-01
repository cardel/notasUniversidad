# Ejercicios

Los primeros se hacen en papel y no toman más de veinte minutos: sirven
para fijar el vocabulario antes de programar. Los dos últimos van al juez
en línea.

## Sobre el grafo de la clase

El grafo $G_1$ tiene siete vértices, numerados de 0 a 6, y las aristas
$\{0,1\}$, $\{0,4\}$, $\{0,5\}$, $\{1,2\}$, $\{1,3\}$, $\{1,4\}$,
$\{2,5\}$.

1. Escriba $N(1)$ y $N(6)$, y la secuencia de grado del grafo.
2. Verifique el apretón de manos contando las aristas por los dos lados.
3. Escriba $G_1$ en las tres representaciones y confirme que las tres dan
   los mismos vecinos para el vértice 1.
4. Agregue la arista $\{3,6\}$ y diga qué cambia en cada una de las tres.

## Sobre las familias

1. ¿Existe un grafo simple con secuencia de grado $3,3,3,3,2$? ¿Y con
   $1,2,3,4,4$? ¿Y con $1,2,3,4,5$? Use el apretón de manos antes de
   intentar dibujarlos.
2. ¿Cuántos vértices tiene un grafo regular de grado 4 con 10 aristas?
3. Dibuje el complemento de $C_5$ y diga qué familia resulta.
4. ¿Cuántas aristas tiene el complemento de $K_{3,3}$?

## Sobre las representaciones

1. Un grafo tiene $V = 10\,000$ y $E = 30\,000$. Calcule cuánta memoria
   ocupa en cada una de las tres representaciones, contando un entero por
   posición.
2. Escriba una función que reciba una matriz de adyacencia y devuelva la
   lista de adyacencia equivalente. ¿Cuánto cuesta?
3. Escriba la función inversa. ¿Cuánto cuesta ahora, y por qué no es lo
   mismo?
4. Un algoritmo pregunta $10^6$ veces si existe la arista $(u,v)$ sobre un
   grafo de 500 vértices. ¿Cuál representación conviene y por qué?

## UVa 10928 — My Dear Neighbours

Enunciado: <https://onlinejudge.org/external/109/10928.pdf>

Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1869>

Cada línea de la entrada trae los vecinos de un lugar, y no dice cuántos
son: hay que partir la línea y contar cuántos quedaron. El enunciado avisa
que si $P_1$ tiene a $P_2$ como vecino no se sigue lo contrario, así que el
grafo es dirigido y lo que se pide es el grado de salida. Se imprimen todos
los lugares que empatan en el mínimo, ordenados y separados por un espacio.
Los casos van separados por una línea en blanco.

## UVa 11550 — Demanding Dilemma

Enunciado: <https://onlinejudge.org/external/115/11550.pdf>

Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2545>

Dan una matriz de $n \times m$ y preguntan si puede ser la matriz de
incidencia de un grafo simple no dirigido. Las dos condiciones salen de la
definición: cada columna representa una arista, así que debe tener
exactamente dos unos, y como el grafo es simple no puede haber dos aristas
entre el mismo par de vértices, es decir, dos columnas iguales.

La página de envío pide iniciar sesión: no está rota, hay que tener cuenta
en el juez y entrar antes de enviar.
