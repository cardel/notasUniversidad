# 24 de octubre · Refuerzo PUJ

**Tramos, matrices, recursión e invariantes.** Tres horas de programación
sobre el mejor tramo de un arreglo, los rectángulos de una matriz y la
recursión sobre un árbol, y una de lógica sobre predicados e invariantes de
ciclo.

## Diapositivas

### Programación

![](./Programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Lógica

![](./Logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Soluciones de programación

Trazas, código en Python y en C++, trampas y costo de UVa 507, UVa 108 y
UVa 839.

![](./Soluciones-programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Soluciones de lógica

Los tres ejercicios resueltos: predicados sobre un arreglo, el invariante de
un ciclo y los invariantes de UVa 11078 y UVa 507.

![](./Soluciones-logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

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

### Hora 1. UVa 507, Jill Rides Again

- Enunciado: <https://onlinejudge.org/external/5/507.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=448>

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

### Hora 2. UVa 108, Maximum Sum

- Enunciado: <https://onlinejudge.org/external/1/108.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=44>

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

### Hora 3. UVa 839, Not so Mobile

- Enunciado: <https://onlinejudge.org/external/8/839.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=780>

Un móvil es una barra con un objeto en cada extremo, y está en equilibrio si
$W_l \times D_l = W_r \times D_r$. Un peso 0 dice que de ese extremo cuelga
un submóvil, descrito en las líneas que siguen: primero el izquierdo y después
el derecho. El parámetro de la recursión es la barra que se está leyendo. El
extremo con objeto es el caso base y el de peso 0 el caso recursivo; la
función devuelve el peso del submóvil y si está en equilibrio, y el árbol de
llamadas tiene la forma del móvil. La trampa está en la lectura: aunque un
submóvil ya haya dado `NO`, la función lee todas sus líneas, porque las que
queden sin leer se tomarían como el caso siguiente. Tampoco basta revisar la
barra de arriba: puede estar en equilibrio con sus submóviles desequilibrados.

Costo: el tamaño es el número $n$ de barras, que el enunciado no acota. Hay
una llamada por barra, cada una con un trabajo fijo (leer cuatro números,
comparar dos productos y sumar dos pesos), así que el total es $\Theta(n)$ por
caso, lo mismo que leer la entrada. La pila llega a la altura del móvil, unos
$\log_2 n$ marcos si el árbol está lleno y $n$ si es una cadena; por eso la
solución en Python sube el límite de recursión.

## Lógica

Predicados y cuantificadores sobre un arreglo, con su dominio y el rango de
los índices, y el tramo vacío, que es lo que hace funcionar la
inicialización. Después, el invariante de ciclo escrito como fórmula y
demostrado en tres pasos: inicialización, estabilidad y terminación. El
primer ejemplo es la suma de un arreglo; los siguientes son los ciclos de los
problemas resueltos.

- UVa 11078, al empezar la vuelta $j$ con $1 \leq j \leq n$:
  $\mathit{mayor} = \max\{a_i : 0 \leq i < j\}$ y
  $\mathit{mejor} = \max(\{a_0 - a_1\} \cup \{a_i - a_k : 0 \leq i < k < j\})$.
  El término $a_0 - a_1$ sale del valor inicial de $\mathit{mejor}$; sin él la
  fórmula falla en el primer chequeo, porque no hay ninguna pareja con
  $k < 1$.
- UVa 507 sin el desempate, al empezar la vuelta $k$ con $0 \leq k \leq m$:
  $\mathit{suma}$ es el máximo entre 0 y las sumas $\sum_{t=i}^{k-1} v_t$ con
  $0 \leq i < k$, y $\mathit{mejor}$ es el máximo entre 0 y las sumas
  $\sum_{t=i}^{l} v_t$ con $0 \leq i \leq l < k$. El invariante de
  $\mathit{mejor}$ no se demuestra sin el de $\mathit{suma}$.

El cierre son ejercicios del nivel de los parciales de Árboles y Grafos: cuatro
fórmulas candidatas para un ciclo, y decidir cuál se sostiene, cuál se cumple
pero no alcanza y cuál se cae con un contraejemplo.

## Tarea

Se resuelve antes del 7 de noviembre y se envía al juez; la revisión abre
esa sesión. Cada solución va con su costo.

### Base. UVa 100, The 3n + 1 problem

- Enunciado: <https://onlinejudge.org/external/1/100.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=36>

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

- Enunciado: <https://onlinejudge.org/external/101/10189.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1130>

Por cada casilla sin mina se cuentan las minas de sus ocho vecinas, con los
dos desplazamientos recorriendo $-1, 0, 1$ y la comprobación de borde antes
del acceso. El primer número son las filas y el segundo las columnas. En la
salida, la línea en blanco va entre campos y no después del último; los bordes
y las esquinas tienen menos de ocho vecinas.

Costo: el tamaño es el número de casillas, $n \times m$, con
$1 \le n, m \le 100$. Cada casilla revisa nueve desplazamientos, un número fijo
que no crece con el campo: $O(nm)$ por campo, con $O(nm)$ de memoria.

### Exigente. UVa 620, Cellular Structure

- Enunciado: <https://onlinejudge.org/external/6/620.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=561>

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

- [Soluciones](./Soluciones.md) de UVa 839 y de los tres problemas de la tarea,
  con la idea, la complejidad y el código en Python y C++. Las de UVa 507 y
  UVa 108 están en las [soluciones del 17 de octubre](../B1/Soluciones.md).
- [Ejercicios interactivos](./Ejercicios.md) sobre el mejor tramo, los
  acumulados, el móvil, los invariantes de los problemas de clase y el costo de
  las soluciones.
