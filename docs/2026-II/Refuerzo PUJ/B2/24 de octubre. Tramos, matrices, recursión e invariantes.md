# 24 de octubre · Refuerzo PUJ

**Tramos y matrices.** Tres horas de programación sobre el mejor tramo de un
arreglo y los rectángulos de una matriz, y una de lógica sobre proposiciones,
cuantificadores y la definición de $O$.

UVa 507 ocupó dos horas y UVa 108 la tercera. Los invariantes de ciclo pasan a
la [sesión del 7 de noviembre](../B3/7%20de%20noviembre.%20Bisecci%C3%B3n%20y%20recorridos%20en%20grafos.md), y la recursión sobre un árbol
con UVa 839 queda como problema propuesto.
La hora de lógica usó las
[diapositivas del 17 de octubre](../B1/Logica.pdf){ target=_blank rel=noopener };
están también las [anotadas en la sesión](./logica-anotada.pdf){ target=_blank rel=noopener }.

## Diapositivas

### Programación

El deck trae también UVa 839, que queda como problema propuesto.

![](./Programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Soluciones de programación

Trazas, código en Python y en C++, trampas y costo de UVa 507 y UVa 108. El
PDF trae también la solución de UVa 839.

![](./Soluciones-programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Sesiones

- [Sesión 2. Tramos, matrices y lógica](./Notas.%20Tramos,%20matrices%20y%20l%C3%B3gica.md):
  la lectura con `scanf`, los acumulados en una y dos dimensiones, el mejor
  tramo, UVa 507 y UVa 108, y la hora de lógica con cuantificadores y la
  definición de $O$.
- [programacion-anotada.pdf](./programacion-anotada.pdf){ target=_blank rel=noopener }
  y [logica-anotada.pdf](./logica-anotada.pdf){ target=_blank rel=noopener }:
  los dos decks con lo escrito durante la sesión y las hojas de tablero.

## Problemas en clase

Cada problema cierra con su costo: de qué depende el tamaño de la entrada,
cuántas veces corre cada ciclo o cuántas llamadas hay, y el total en $O$
frente a los límites del enunciado.

### Horas 1 y 2. UVa 507, Jill Rides Again

- Enunciado y envío: <https://vjudge.net/problem/UVA-507>

El mejor tramo que termina en cada parada se obtiene del que terminaba en la
anterior: se alarga, salvo cuando la suma ya es negativa y conviene empezar de
nuevo. El consejo completo, con el desempate por longitud y por inicio y la
numeración de las paradas, está en la
[página del 17 de octubre](../B1/17%20de%20octubre.%20Estructuras%20y%20un%20recorrido.md#uva-507-jill-rides-again).

Costo: el tamaño es $s$, el número de paradas de una ruta, con
$s \le 20\,000$. La lectura y el recorrido corren $s - 1$ veces cada uno, con
un trabajo fijo por vuelta, así que el total es $\Theta(s)$ por ruta. Probar
todos los tramos son unos $2 \cdot 10^8$ con $s = 20\,000$, y el juez da
3 segundos para el archivo entero.

### Hora 3. UVa 108, Maximum Sum

- Enunciado y envío: <https://vjudge.net/problem/UVA-108>

Con la fila de arriba y la de abajo fijas, la suma de cada columna entre las
dos forma un arreglo de $N$ valores, y el mejor rectángulo con esas filas es
el mejor tramo de ese arreglo: el problema de la hora anterior. El consejo
completo está en la
[página del 17 de octubre](../B1/17%20de%20octubre.%20Estructuras%20y%20un%20recorrido.md#uva-108-maximum-sum).

Costo: el tamaño es el lado $N$ de la matriz, con $N \le 100$, y la entrada
trae $N^2$ números. Hay menos de $N^2$ pares de filas, y por cada par $N$
vueltas ponen al día las sumas por columna y otras $N$ hacen el recorrido del
mejor tramo: $O(N^3)$, del orden de $10^6$ pasos con $N = 100$, y
$\Theta(N^2)$ de memoria. Con la tabla de acumulados en dos dimensiones y
todos los rectángulos el costo es $O(N^4)$.

UVa 839, *Not so Mobile*, queda como problema propuesto. El enunciado y el
envío están en <https://vjudge.net/problem/UVA-839> y la solución, en las
[soluciones de esta sesión](./Soluciones.md#hora-3-uva-839-not-so-mobile).

## Lógica

Proposiciones y conectivos; la implicación con su recíproca y su
contrarrecíproca; predicados y cuantificadores sobre las posiciones de un
arreglo, con dominio y rango; la traducción a fórmula de propiedades del mundo
real y de los arreglos. Con eso se leyó la definición de $O$: existen $c > 0$ y
$k \geq 0$ tales que $f(n) \leq c\,g(n)$ para todo $n \geq k$. El recorrido
completo está en las
[notas de la sesión](./Notas.%20Tramos,%20matrices%20y%20l%C3%B3gica.md#logica).

Los invariantes de ciclo de UVa 11078 y UVa 507 se trabajan en la
[hora de lógica del 7 de noviembre](../B3/7%20de%20noviembre.%20Bisecci%C3%B3n%20y%20recorridos%20en%20grafos.md#logica).

## Tarea

Se resuelve antes del 7 de noviembre y se envía al juez; la revisión abre
esa sesión. Cada solución va con su costo.

### Base. UVa 100, The 3n + 1 problem

- Enunciado y envío: <https://vjudge.net/problem/UVA-100>

Una función aplica la regla hasta llegar a 1 y cuenta los números que
imprime; otra recorre el rango del menor al mayor y se queda con el máximo.
La longitud cuenta el 1, así que la de 22 es 16. Puede llegar $i$ mayor que
$j$: el recorrido va del menor al mayor, pero la salida repite $i$ y $j$ en el
orden en que llegaron. Los valores intermedios pasan de 10 000, así que no
sirven como posición de un arreglo del tamaño de la entrada.

Costo: el tamaño es el ancho del rango, $b - a + 1$, y no la cantidad de
números leídos. Por cada número del rango la regla corre tantas vueltas como
la longitud de su ciclo, $L$, que para valores menores que 10 000 es de unos
cientos de pasos: $O((b - a + 1) \cdot L)$ por pareja y $O(1)$ de memoria.

### Intermedio. UVa 10189, Minesweeper

- Enunciado y envío: <https://vjudge.net/problem/UVA-10189>

Por cada casilla sin mina se cuentan las minas de sus ocho vecinas, con los
dos desplazamientos recorriendo $-1, 0, 1$ y la comprobación de borde antes
del acceso. El primer número son las filas y el segundo las columnas. En la
salida, la línea en blanco va entre campos y no después del último; los bordes
y las esquinas tienen menos de ocho vecinas.

Costo: el tamaño es el número de casillas, $n \times m$, con
$1 \le n, m \le 100$. Cada casilla revisa nueve desplazamientos, un número fijo
que no crece con el campo: $O(nm)$ por campo, con $O(nm)$ de memoria.

### Exigente. UVa 620, Cellular Structure

- Enunciado y envío: <https://vjudge.net/problem/UVA-620>

Una cadena sana es `A`, una sana seguida de `AB`, o `B` seguida de una sana y
de `A`. La función recibe el rango $[ini, fin]$ de la cadena: el caso base es
una letra, y la primera y la última letra deciden qué caso recursivo se
intenta. Cada llamada trabaja sobre un tramo dos letras más corto, sin copiar
la cadena. La trampa: lo de adentro tiene que ser una cadena sana y no vacía,
así que `AB` y `BA` son `MUTANT`, y contar letras no sirve, porque el interior
se clasifica completo. `BAABA` es `MUTAGENIC` porque `AAB` es sana, y `BAAB`
es `MUTANT` porque `BA` no lo es.

Costo: el tamaño es el largo $n$ de la cadena. Cada llamada hace a lo más una
llamada recursiva, porque una forma exige terminar en `B` y la otra en `A`, y
el tramo baja de a dos letras: unas $n/2$ llamadas con trabajo fijo, $O(n)$ por
cadena, y la pila llega a $n/2$ marcos. Copiar el interior en cada llamada
costaría $\Theta(n)$ por nivel y llevaría el total a $\Theta(n^2)$.

## Para seguir

- [Soluciones](./Soluciones.md) de los tres problemas de la tarea y de UVa 839,
  con la idea, la complejidad y el código en Python y C++. Las de UVa 507 y
  UVa 108 están en las [soluciones del 17 de octubre](../B1/Soluciones.md).
- [Ejercicios interactivos](./Ejercicios.md) sobre el mejor tramo, los
  acumulados y el costo de las soluciones, con el móvil y los invariantes que
  se trabajan el 7 de noviembre.
