# Bloque 1 · Refuerzo PUJ

**Arreglos y matrices.** Tres horas de programación sobre recorridos de
arreglos y matrices, y una de lógica sobre proposiciones y predicados.

## Diapositivas

### Programación

![](./Programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Lógica

![](./Logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Sesiones

- [Sesión 1. Estructuras, costos y UVa 11078](./Sesión%201.%20Estructuras,%20costos%20y%20UVa%2011078.md):
  la lectura de la entrada, el costo de cada operación, cómo están hechas las
  estructuras de la biblioteca estándar, el máximo que se arrastra y UVa 11078
  en un recorrido.
- [programacion-anotada.pdf](./programacion-anotada.pdf){ target=_blank rel=noopener }:
  el deck de programación con lo escrito durante la sesión y tres hojas de
  tablero.

## Problemas en clase

### Hora 1. UVa 11078, Open Credit System

- Enunciado: <https://onlinejudge.org/external/110/11078.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2019>

Se busca el mayor valor de $a_i - a_j$ con $i < j$, donde el índice menor es
el estudiante más antiguo. El parámetro es la posición $j$: para cada una, la
mejor resta usa el máximo de $a_0, \ldots, a_{j-1}$, y ese máximo se actualiza
al avanzar. Basta un recorrido; el doble ciclo revisa unos $5 \times 10^9$
pares en un caso con $n = 100\,000$, y la entrada trae varios. La trampa está
en la muestra: con una secuencia creciente la respuesta es $-1$, así que el
máximo arranca en la primera resta y no en 0.

### Hora 2. UVa 507, Jill Rides Again

- Enunciado: <https://onlinejudge.org/external/5/507.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=448>

Cada ruta trae $s - 1$ valores, uno por tramo entre paradas, y se pide el
tramo continuo de mayor suma. El parámetro es el valor donde termina el tramo.
El mejor que acaba ahí extiende al que acababa en el anterior, salvo cuando
esa suma ya es negativa: entonces conviene empezar de nuevo. Se reinicia con
suma negativa y no con cero, porque un prefijo de suma cero alarga el tramo
sin cambiar su valor, y el enunciado desempata por el tramo más largo. Las
paradas se numeran desde 1, así que el tramo que va del valor $i$ al $j$ se
imprime entre las paradas $i$ y $j+1$. Si la mejor suma no es positiva, la
salida es `Route r has no nice parts`.

### Hora 3. UVa 108, Maximum Sum

- Enunciado: <https://onlinejudge.org/external/1/108.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=44>

La matriz es de $N \times N$, con $N \le 100$, y se pide el subrectángulo de
mayor suma. Probar cada rectángulo con acumulados en dos dimensiones cuesta
$O(N^4)$. Lo que baja el costo es fijar la fila de arriba y la de abajo: con
ellas fijas, la suma de cada columna entre las dos forma un arreglo de $N$
valores, y el mejor rectángulo con esas filas es el mejor tramo de ese
arreglo, el problema de la hora 2. El total queda en $O(N^3)$. Los $N^2$
números llegan repartidos en líneas cualesquiera, así que se leen de corrido;
y si todo es negativo la respuesta es negativa, porque el rectángulo tiene al
menos una celda.

## Lógica

Proposiciones y conectivos, la implicación con su recíproca y su
contrarrecíproca, y cuantificadores con su dominio y el rango de los índices.
El ejercicio de la hora es traducir propiedades a fórmula: que todos los
elementos del arreglo son positivos, que el arreglo está ordenado, que un
valor aparece en un rango. Con eso se lee la definición que Árboles y Grafos
usa desde la primera clase: $f \in O(g)$ cuando existen $c > 0$ y $k \geq 0$
tales que $f(n) \leq c\,g(n)$ para todo $n \geq k$.

## Tarea

Se resuelve antes del bloque 2 y se envía al juez; la revisión abre ese
bloque.

### Base. UVa 100, The 3n + 1 problem

- Enunciado: <https://onlinejudge.org/external/1/100.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=36>

Un ciclo aplica la regla hasta llegar a 1 y cuenta los números que imprime; el
recorrido del rango se queda con el máximo. La longitud cuenta el 1, así que
la de 22 es 16. Puede llegar $i$ mayor que $j$: el recorrido va del menor al
mayor, pero la salida repite $i$ y $j$ en el orden en que llegaron.

### Intermedio. UVa 10189, Minesweeper

- Enunciado: <https://onlinejudge.org/external/101/10189.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1130>

Por cada celda sin mina se cuentan las minas de sus ocho vecinas, con los dos
desplazamientos recorriendo $-1, 0, 1$ y la comprobación de borde. El primer
número son las filas y el segundo las columnas. En la salida, la línea en
blanco va entre campos y no después del último.

### Exigente. UVa 10920, Spiral Tap

- Enunciado: <https://onlinejudge.org/external/109/10920.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1861>

La matriz no se puede construir: con un lado de hasta 100 000 son $10^{10}$
celdas. Se trabaja por anillos, cada uno con su rango de posiciones, y dentro
del anillo la posición se convierte en fila y columna con aritmética. La
posición llega hasta el lado al cuadrado y se pasa de 32 bits. La fila 1 es la
de abajo y el centro de la espiral es la posición 1.

## Para seguir

- [Soluciones de los seis problemas](./Soluciones.md), con la idea, la
  complejidad y el código en Python y C++.
- [Ejercicios interactivos](./Ejercicios.md) sobre recorridos, acumulados y
  el costo de cada operación.
