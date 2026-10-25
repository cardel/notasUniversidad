# Tramos, matrices y lógica · Refuerzo PUJ 24 de octubre

La sesión empezó por los tramos de un arreglo: cómo se suma cualquiera de
ellos con una tabla de acumulados y cómo se encuentra el de mayor suma en un
solo recorrido. Con esa idea se escribió en C++ UVa 507, *Jill Rides Again*, y
se probó con `diff` contra la salida esperada; ahí aparecieron las dos cosas
que deciden el problema, la numeración de las paradas y el desempate por
longitud. La segunda hora llevó los acumulados a dos dimensiones, con la
resta de la esquina que se cuenta dos veces, y resolvió UVa 108, *Maximum
Sum*, fijando dos filas y reduciendo cada par al mejor tramo. El juez aceptó
esa solución. La hora de lógica recorrió proposiciones, cuantificadores
sobre las posiciones de un arreglo y la definición de $O$ escrita como
fórmula.

Al terminar la sesión se espera poder:

- Leer con `scanf` una entrada donde un número dice cuántos valores siguen,
  sin depender de cómo vienen partidas las líneas.
- Sumar cualquier tramo de un arreglo, o cualquier rectángulo de una matriz,
  con cuatro lecturas de una tabla de acumulados.
- Encontrar el tramo de mayor suma en $\Theta(n)$ y traducir sus índices a la
  numeración de un enunciado, con el desempate de UVa 507.
- Escribir una propiedad de un arreglo con su cuantificador y su rango, y leer
  los testigos $c$ y $k$ en la definición de $O$.

## Diapositivas y tablero

[programacion-anotada.pdf](./programacion-anotada.pdf){ target=_blank rel=noopener },
55 páginas: las 53 del deck de programación del bloque con lo escrito encima
durante la sesión y dos hojas de tablero, las páginas 33 y 34. En las dos
está la matriz de la muestra de UVa 108 con los vectores de columnas que se
forman al bajar la fila de abajo, primero con la fila de arriba en 0 y
después en 1. Lo demás escrito a mano está en la página 7, con la suma de
$v[1..3]$ leída de los acumulados; en la 12, con las dos ramas del mejor
tramo, y en la 28, con la suma de la matriz de 1 a 9 por la fórmula de Gauss
y el rectángulo $21 - 5 = 16$.

[logica-anotada.pdf](./logica-anotada.pdf){ target=_blank rel=noopener },
87 páginas: las 86 del deck de lógica y una hoja de tablero, la 61, con la
precondición del algoritmo de Dijkstra escrita con cuantificador. La página 7
tiene la columna del o exclusivo junto a la tabla de los conectivos; la 24,
la negación de la implicación, y la 51, los dos órdenes de los
cuantificadores.

La grabación de la sesión, partida en videos cortos por tema, está en la
[lista de reproducción del refuerzo](https://www.youtube.com/playlist?list=PLKsjj1jEesqU){ target=_blank rel=noopener }.

## Código de la sesión

Los programas están en
[codigo/sesion2](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/Refuerzo%20PUJ/B2/codigo/sesion2):

| Archivo | Qué muestra |
|---|---|
| `lectura_507.cpp` | la lectura de UVa 507: cada ruta trae $s$ y después $s - 1$ valores |
| `lectura_108.cpp` | la lectura de UVa 108: $N$ y los $N^2$ números, partidos en líneas de cualquier forma |
| `uva507.cpp` | UVa 507 con el mejor tramo, la numeración de las paradas y los dos desempates |
| `uva108.cpp` | UVa 108 con dos filas fijas y el mejor tramo de las sumas por columna |
| `uva507.in`, `uva108.in` | las muestras de los enunciados |

Se compilan y se prueban como en la sesión anterior:

```bash
g++ -std=c++17 -Wall -Wextra -g -o uva507 uva507.cpp
./uva507 < uva507.in > salida.txt
diff salida.txt esperado.txt
```

La versión en Python de los dos problemas está en las
[soluciones del 17 de octubre](../B1/Soluciones.md#uva-507-jill-rides-again).

## Leer la entrada con `scanf`

### UVa 507: $s$ paradas dan $s - 1$ tramos

La entrada empieza con $b$, el número de rutas. Cada ruta trae $s$, las
paradas, y después un valor por cada calle entre dos paradas seguidas: con
$s$ paradas hay $s - 1$ calles. En la muestra, la primera ruta tiene 3 paradas
y por eso la siguen dos valores, $-1$ y $6$; la segunda tiene 10 y la siguen
nueve. El enunciado numera las paradas desde 1 y el arreglo empieza en 0, así
que el valor `v[k]` es la calle que une las paradas $k + 1$ y $k + 2$.

```cpp
// UVa 507 - Jill Rides Again: solo la lectura, con scanf
// Imprime cada ruta que lee: cuántas paradas tiene y la bondad de cada
// tramo entre dos paradas consecutivas.
#include <cstdio>
#include <vector>

using namespace std;

int main() {
    int b;
    scanf("%d", &b);
    for (int r = 1; r <= b; r++) {
        int s;
        scanf("%d", &s);
        // s paradas dejan s - 1 tramos; el tramo k va de la parada k + 1
        // a la k + 2, contando las paradas desde 1
        vector<int> v(s - 1);
        for (int k = 0; k < s - 1; k++) {
            scanf("%d", &v[k]);
        }
        printf("ruta %d: %d paradas, %d tramos\n", r, s, s - 1);
        for (int k = 0; k < s - 1; k++) {
            printf("    tramo de la parada %d a la %d: %d\n", k + 1, k + 2, v[k]);
        }
    }
    return 0;
}
```

Con `uva507.in` imprime

```text
ruta 1: 3 paradas, 2 tramos
    tramo de la parada 1 a la 2: -1
    tramo de la parada 2 a la 3: 6
ruta 2: 10 paradas, 9 tramos
    tramo de la parada 1 a la 2: 4
    tramo de la parada 2 a la 3: -5
    tramo de la parada 3 a la 4: 4
    tramo de la parada 4 a la 5: -3
    tramo de la parada 5 a la 6: 4
    tramo de la parada 6 a la 7: 4
    tramo de la parada 7 a la 8: -4
    tramo de la parada 8 a la 9: 4
    tramo de la parada 9 a la 10: -5
ruta 3: 4 paradas, 3 tramos
    tramo de la parada 1 a la 2: -2
    tramo de la parada 2 a la 3: -3
    tramo de la parada 3 a la 4: -4
```

### UVa 108: $N^2$ números en líneas cualesquiera

Después de $N$ vienen los $N^2$ números de la matriz por filas, pero el
enunciado solo dice que van separados por espacios y saltos de línea. En la
muestra, la primera línea trae ocho números, la segunda cinco y la tercera
tres, y ninguna coincide con una fila:

```text
4
0 -2 -7 0 9 2 -6 2
-4 1 -4 1 -1
8 0 -2
```

`scanf("%d", ...)` salta todo el espacio en blanco antes del número, saltos
de línea incluidos, así que dos ciclos de $N$ vueltas leen la matriz sin mirar
dónde se parte cada línea.

```cpp
// UVa 108 - Maximum Sum: solo la lectura, con scanf y printf
// Lee N y los N * N números de la matriz, que llegan por filas pero
// repartidos en las líneas de cualquier forma, y la imprime ordenada.
#include <cstdio>
#include <vector>

using namespace std;

int main() {
    int n;
    scanf("%d", &n);
    vector<vector<int>> m(n, vector<int>(n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            scanf("%d", &m[i][j]);
        }
    }
    printf("matriz de %d x %d\n", n, n);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("%4d", m[i][j]);
        }
        printf("\n");
    }
    return 0;
}
```

```text
matriz de 4 x 4
   0  -2  -7   0
   9   2  -6   2
  -4   1  -4   1
  -1   8   0  -2
```

## Tramos y acumulados

Un tramo $v[i..j]$, con $i \le j$, es un bloque de casillas seguidas. Un
arreglo de $n$ casillas tiene $n$ tramos que terminan en la última, $n - 1$
que terminan en la penúltima y así hasta uno, $n(n+1)/2$ en total: con
$n = 4$ son 10. Sumarlos todos casilla por casilla cuesta $O(n^3)$.

La tabla de acumulados guarda en `acum[k]` la suma de las $k$ primeras
casillas, con `acum[0] = 0` para el tramo vacío:

$$
\mathit{acum}[0] = 0, \qquad \mathit{acum}[k+1] = \mathit{acum}[k] + v[k].
$$

La suma de $v[i..j]$ es lo acumulado hasta $j$ menos lo acumulado antes de
$i$:

$$
\sum_{t=i}^{j} v[t] = \mathit{acum}[j+1] - \mathit{acum}[i].
$$

Llenar la tabla es un recorrido, $\Theta(n)$, y después cada tramo se suma con
dos lecturas, $O(1)$. Con $v = [4, -5, 4, -3]$:

| $k$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $v[k]$ | 4 | $-5$ | 4 | $-3$ | |
| $\mathit{acum}[k]$ | 0 | 4 | $-1$ | 3 | 0 |

$v[1..2] = \mathit{acum}[3] - \mathit{acum}[1] = 3 - 4 = -1$, que es
$-5 + 4$, y $v[1..3] = \mathit{acum}[4] - \mathit{acum}[1] = 0 - 4 = -4$,
que es $-5 + 4 - 3$. Con la tabla, probar los $n(n+1)/2$ tramos cuesta
$\Theta(n^2)$. Para el mejor tramo sobra incluso eso.

## El mejor tramo en un recorrido

En lugar de mirar todos los tramos, en cada casilla se pregunta por el mejor
tramo que termina ahí. El que termina en $k$ es el que terminaba en $k - 1$
alargado con $v[k]$, o $v[k]$ solo. Decide el signo de lo que se lleva: un
tramo que llega negativo solo le resta a lo que venga, y conviene empezar de
nuevo en $v[k]$; uno que llega en cero o positivo se alarga. El mejor de todo
el arreglo es el mayor de esos mejores por casilla, y se guarda en otra
variable.

Con $v = [2, -3, 4, -1, 2]$, el arreglo que se trazó en clase:

| $k$ | $v[k]$ | ¿arrastra? | actual | mejor |
|---|---|---|---|---|
| inicio | 2 | | 2 | 2 |
| 1 | $-3$ | sí, $2 \ge 0$ | $-1$ | 2 |
| 2 | 4 | no, $-1 < 0$ | 4 | 4 |
| 3 | $-1$ | sí, $4 \ge 0$ | 3 | 4 |
| 4 | 2 | sí, $3 \ge 0$ | 5 | 5 |

El mejor es $v[2..4] = 4 - 1 + 2 = 5$. Los acumulados de ese arreglo son
$[0, 2, -1, 3, 2, 4]$, y $\mathit{acum}[5] - \mathit{acum}[2] = 4 - (-1) = 5$
da lo mismo. Con todo negativo, como $[-4, -2, -7]$, cada casilla reinicia y
el recorrido devuelve $-2$, la casilla menos mala; arrancar `mejor` en 0
daría la suma del tramo vacío, que solo sirve si el enunciado acepta no tomar
nada.

Son dos variables y una vuelta por casilla con trabajo fijo: $\Theta(n)$.

La actividad
[mejor-tramo](../../../actividades/estructuras-de-datos/recorridos-arreglos/mejor-tramo.html){ target=_blank rel=noopener }
recorre la traza paso a paso.

## UVa 507: Jill Rides Again

- Enunciado: <https://onlinejudge.org/external/5/507.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=448>

Jill recorre en bicicleta una parte de una ruta de bus y quiere la de mayor
suma de *niceness*, el valor que le da a cada calle entre dos paradas; ningún
valor es cero. Llegan $b$ rutas, cada una con $2 \le s \le 20\,000$ paradas. Por
ruta se imprime `The nicest part of route r is between stops i and j`, o
`Route r has no nice parts` si la mayor suma no es positiva. Si dos tramos
empatan en suma gana el más largo, el de mayor $j - i$, y si también empatan
en largo, el que empieza antes.

### La muestra

| Ruta | Paradas | Valores | Salida |
|---|---|---|---|
| 1 | 3 | $-1, 6$ | paradas 2 y 3 |
| 2 | 10 | $4, -5, 4, -3, 4, 4, -4, 4, -5$ | paradas 3 y 9 |
| 3 | 4 | $-2, -3, -4$ | no nice parts |

En la segunda ruta, de la parada 3 a la 7 suman 9, y de la 3 a la 9 también:
las dos calles que se agregan, $-4$ y $4$, suman cero. Gana la de la 3 a la 9
por ser más larga.

### La solución

```cpp
// UVa 507 - Jill Rides Again
#include <cstdio>
#include <vector>

using namespace std;

// arr tiene los size tramos de una ruta; el tramo i va de la parada i + 1
// a la i + 2. Imprime el mejor tramo, el más largo si hay empate y, entre
// los de igual largo, el que empieza antes.
void solve(const vector<int> &arr, int size, int cnt) {
  int ini = 1;
  int fin = 2;
  int iniTemp = 1;

  int mejor = arr[0];
  int curr = arr[0];

  for (int i = 1; i < size; i++) {
    if (curr < 0) {
      curr = arr[i];
      iniTemp = i + 1;
    } else {
      curr += arr[i];
    }

    int longitudActual = i + 1 - iniTemp + 1;
    int longitudMejor = fin - ini;

    if (curr > mejor || (curr == mejor && longitudActual > longitudMejor)) {
      ini = iniTemp;
      mejor = curr;
      fin = i + 2;
    }
  }

  if (mejor <= 0) {
    printf("Route %d has no nice parts\n", cnt);
  } else {
    printf("The nicest part of route %d is between stops %d and %d\n", cnt, ini,
           fin);
  }
}

int main() {
  int b;
  scanf("%d", &b);

  for (int r = 1; r <= b; r++) {
    int s;
    scanf("%d", &s);

    vector<int> arr(s - 1);

    for (int i = 0; i < s - 1; i++) {
      scanf("%d", &arr[i]);
    }

    solve(arr, s - 1, r);
  }

  return 0;
}
```

`curr` es la suma del tramo que termina en la calle $i$ e `iniTemp` la parada
donde empezó; `mejor`, `ini` y `fin` guardan el mejor tramo visto y sus dos
paradas. `ini` no puede cambiar cada vez que el tramo reinicia, porque el
tramo que reinicia todavía no es el mejor: si se copiara ahí, la salida
juntaría el comienzo de un tramo con el final de otro. Por eso el comienzo
del tramo en curso va en `iniTemp`, y pasa a `ini` solo cuando ese tramo
mejora lo guardado.

Las paradas salen de la regla de la lectura: la calle $i$ va de la parada
$i + 1$ a la $i + 2$. Un tramo que reinicia en la calle $i$ empieza en la
parada $i + 1$, y uno que termina en la calle $i$ acaba en la parada $i + 2$.
El largo del tramo en curso, $(i + 2) - \mathit{iniTemp}$, se compara con el
del guardado, $\mathit{fin} - \mathit{ini}$, en la misma unidad: número de
calles.

La condición de mejora junta los dos desempates. Un tramo nuevo reemplaza al
guardado si suma más, o si suma lo mismo y es estrictamente más largo. Con
la desigualdad estricta, entre dos tramos de igual suma e igual largo se
queda el que ya estaba, que es el que empieza antes. Con la segunda ruta de
la muestra:

| $i$ | `arr[i]` | rama | `curr` | `iniTemp` | `mejor` | `ini` | `fin` |
|---|---|---|---|---|---|---|---|
| inicio | 4 | | 4 | 1 | 4 | 1 | 2 |
| 1 | $-5$ | alarga | $-1$ | 1 | 4 | 1 | 2 |
| 2 | 4 | reinicia | 4 | 3 | 4 | 1 | 2 |
| 3 | $-3$ | alarga | 1 | 3 | 4 | 1 | 2 |
| 4 | 4 | alarga | 5 | 3 | 5 | 3 | 6 |
| 5 | 4 | alarga | 9 | 3 | 9 | 3 | 7 |
| 6 | $-4$ | alarga | 5 | 3 | 9 | 3 | 7 |
| 7 | 4 | alarga | 9 | 3 | 9 | 3 | 9 |
| 8 | $-5$ | alarga | 4 | 3 | 9 | 3 | 9 |

En $i = 2$ el tramo de la parada 3 a la 4 empata en suma y en largo con el de
la 1 a la 2, y se queda el de la 1. En $i = 7$ empata en suma con el de la 3
a la 7 y es más largo: pasa a ser el guardado. La salida es
`between stops 3 and 9`.

El reinicio es con `curr < 0` y no con `curr <= 0`. Un tramo que llega en cero
no cambia la suma de lo que se le agregue, pero sí la alarga. Con la ruta de
4 paradas y valores $3, -3, 3$, el programa imprime las paradas 1 y 4, la
respuesta correcta; con `<=` reinicia en la tercera calle y se queda con las
paradas 1 y 2.

### Dónde arranca `fin`

Antes del ciclo, el tramo guardado es la primera calle sola, `arr[0]`, que va
de la parada 1 a la 2. Por eso `ini` y `iniTemp` arrancan en 1 y `fin` en 2.
Con `fin = 1` la muestra sale idéntica, porque en las tres rutas el tramo
guardado cambia en el ciclo o no se imprime. El valor inicial se nota cuando
el mejor tramo es la primera calle sola. Con la ruta de 3 paradas y valores
$5, -10$:

| `fin` inicial | Salida |
|---|---|
| 2 | `The nicest part of route 1 is between stops 1 and 2` |
| 1 | `The nicest part of route 1 is between stops 1 and 1` |

De la parada 1 a la 1 no hay ninguna calle. El valor inicial de
$\mathit{fin} - \mathit{ini}$ también es el largo con que se compara el
primer empate, así que tiene que valer 1, el largo de un tramo de una calle.

Costo: el tamaño es $s$, con $s \le 20\,000$. La lectura y el recorrido dan
$s - 1$ vueltas cada uno con trabajo fijo, $\Theta(s)$ por ruta, y el arreglo
ocupa $\Theta(s)$. Probar todos los tramos con acumulados serían unos
$2 \cdot 10^8$ con $s = 20\,000$.

## Acumulados en dos dimensiones

En una matriz de $f \times c$, `m[i][j]` se lee en $O(1)$, sumar una fila
cuesta $\Theta(c)$ y recorrerla entera $\Theta(fc)$. Sumar un rectángulo
recorriéndolo cuesta hasta $fc$ sumas por consulta: con una matriz de
$100 \times 100$ son $10^4$, y con mil consultas $10^7$, cada una repitiendo
el trabajo de la anterior. Se busca lo mismo que en una dimensión, una tabla
que se llena una vez y responde cada rectángulo en $O(1)$.

La tabla $P$ tiene una fila y una columna más que la matriz. $P[i][j]$ es la
suma de todo lo que queda arriba y a la izquierda de la celda $(i, j)$, sin
incluirla; la fila 0 y la columna 0 quedan en cero, que es el tramo vacío
visto en dos dimensiones. Cada casilla sale de tres vecinas ya llenas:

$$
P[i+1][j+1] = m[i][j] + P[i][j+1] + P[i+1][j] - P[i][j].
$$

Lo de arriba y lo de la izquierda comparten el rectángulo de la diagonal,
$P[i][j]$, que quedó sumado dos veces y se resta una. Con la matriz de 1 a 9:

| $m$ | 0 | 1 | 2 |
|---|---|---|---|
| **0** | 1 | 2 | 3 |
| **1** | 4 | 5 | 6 |
| **2** | 7 | 8 | 9 |

| $P$ | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| **0** | 0 | 0 | 0 | 0 |
| **1** | 0 | 1 | 3 | 6 |
| **2** | 0 | 5 | 12 | 21 |
| **3** | 0 | 12 | 27 | 45 |

$P[2][2] = m[1][1] + P[1][2] + P[2][1] - P[1][1] = 5 + 3 + 5 - 1 = 12$, que es
$1 + 2 + 4 + 5$. La esquina, $P[3][3] = 45$, es la matriz entera, $1 + 2 + \dots + 9 = 9 \cdot 10 / 2$; y $P[2][3] = 21 = 6 \cdot 7 / 2$ son las dos
primeras filas.

Un rectángulo que no toca la esquina de arriba a la izquierda se saca por
inclusión y exclusión. El de filas 0 a 1 y columnas 1 a 2, con las celdas 2,
3, 5 y 6, es el de las dos primeras filas, $P[2][3] = 21$, menos la columna 0
de esas filas, $P[2][1] = 1 + 4 = 5$: $21 - 5 = 16$. Cuando el rectángulo no
toca ni la fila ni la columna 0, se restan lo de arriba y lo de la izquierda,
y la esquina que comparten se suma de vuelta. Para las filas $f_1$ a $f_2$ y
las columnas $c_1$ a $c_2$:

$$
P[f_2+1][c_2+1] - P[f_1][c_2+1] - P[f_2+1][c_1] + P[f_1][c_1].
$$

Las celdas 5, 6, 8 y 9 son $P[3][3] - P[1][3] - P[3][1] + P[1][1] = 45 - 6 - 12 + 1 = 28$. Sin el $+1$ la cuenta da 27: la celda del 1 está en
lo que se restó por arriba y en lo que se restó por la izquierda. Las celdas
4, 5, 7 y 8 son $P[3][2] - P[1][2] - P[3][0] + P[1][0] = 27 - 3 - 0 + 0 = 24$.

Llenar $P$ cuesta $\Theta(fc)$ y cada rectángulo, cuatro lecturas. Los
índices van corridos en uno: la celda $(i, j)$ de la matriz vive en
$P[i+1][j+1]$.

La actividad
[acumulados](../../../actividades/estructuras-de-datos/matrices/acumulados.html){ target=_blank rel=noopener }
llena la tabla y lee rectángulos.

## UVa 108: Maximum Sum

- Enunciado: <https://onlinejudge.org/external/1/108.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=44>

La entrada es una sola matriz de $N \times N$, con $N \le 100$ y valores en
$[-127, 127]$, y la salida es la mayor suma de un subrectángulo, un bloque de
filas y columnas seguidas. En la muestra es 15, el rectángulo de las filas 1
a 3 y las columnas 0 a 1:

$$
\begin{matrix} 9 & 2 \\ -4 & 1 \\ -1 & 8 \end{matrix}
$$

Con la tabla $P$ de la muestra sale igual:
$P[4][2] - P[1][2] - P[4][0] + P[1][0] = 13 - (-2) - 0 + 0 = 15$.

Hay $(N(N+1)/2)^2$ rectángulos, unos $2{,}6 \cdot 10^7$ con $N = 100$. Con
$P$ cada uno cuesta $O(1)$ y el total es $O(N^4)$. Lo que baja un factor de
$N$ es el problema de la hora anterior.

### Fijar arriba y abajo

Con la fila de arriba y la de abajo fijas, todo rectángulo entre ellas es un
tramo de columnas. Si cada columna se reemplaza por su suma entre esas dos
filas, `col[c]`, el mejor rectángulo con esas filas es el mejor tramo de
`col`. Al bajar `abajo` una fila no se suma todo de nuevo: a cada columna se
le suma la celda que entra, `col[c] = col[c] + m[abajo][c]`, en $\Theta(N)$.
Cuando `arriba` cambia, `col` vuelve a ceros, y así lo de las filas de arriba
no hay que restarlo.

```cpp
// UVa 108 - Maximum Sum
#include <cstdio>
#include <vector>

using namespace std;

int mejor_tramo(const vector<int> &v) {
  int mejor = v[0];
  int suma = 0;
  for (int c = 0; c < (int)v.size(); c++) {
    suma = suma + v[c];
    if (suma > mejor) {
      mejor = suma;
    }
    if (suma < 0) {
      suma = 0;
    }
  }
  return mejor;
}

int mayor_rectangulo(const vector<vector<int>> &m) {
  int n = m.size();
  int mejor = m[0][0];
  for (int arriba = 0; arriba < n; arriba++) {
    vector<int> col(n, 0);
    for (int abajo = arriba; abajo < n; abajo++) {
      for (int c = 0; c < n; c++) {
        col[c] = col[c] + m[abajo][c];
      }
      int s = mejor_tramo(col);
      if (s > mejor) {
        mejor = s;
      }
    }
  }
  return mejor;
}

int main() {
  int n;
  scanf("%d", &n);
  vector<vector<int>> m(n, vector<int>(n));
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      scanf("%d", &m[i][j]);
    }
  }
  printf("%d\n", mayor_rectangulo(m));
  return 0;
}
```

`mejor_tramo` es el recorrido de UVa 507 escrito de otra forma: suma la
casilla, compara, y si la suma quedó negativa la deja en 0, de modo que la
casilla siguiente empieza un tramo nuevo. `mejor` arranca en `v[0]` y el
rectángulo, en `m[0][0]`, que son un tramo y un rectángulo que existen; con
la matriz de $2 \times 2$ de valores $-1, -2, -3, -4$ el programa imprime
$-1$. El problema pide solo la suma, así que no se guardan los límites.

Con la muestra, cada fila de la tabla es un par de filas fijas:

| `arriba` | `abajo` | `col` | mejor tramo | `mejor` |
|---|---|---|---|---|
| 0 | 0 | $[0, -2, -7, 0]$ | 0 | 0 |
| 0 | 1 | $[9, 0, -13, 2]$ | 9 | 9 |
| 0 | 2 | $[5, 1, -17, 3]$ | 6 | 9 |
| 0 | 3 | $[4, 9, -17, 1]$ | 13 | 13 |
| 1 | 1 | $[9, 2, -6, 2]$ | 11 | 13 |
| 1 | 2 | $[5, 3, -10, 3]$ | 8 | 13 |
| 1 | 3 | $[4, 11, -10, 1]$ | 15 | 15 |
| 2 | 2 | $[-4, 1, -4, 1]$ | 1 | 15 |
| 2 | 3 | $[-5, 9, -4, -1]$ | 9 | 15 |
| 3 | 3 | $[-1, 8, 0, -2]$ | 8 | 15 |

El 15 aparece con `arriba = 1` y `abajo = 3`, en el tramo $4 + 11$ de las
columnas 0 y 1. Con `uva108.in` el programa imprime 15.

Costo: el tamaño es el lado $N$, con $N \le 100$, y la entrada trae $N^2$
números. Hay $N(N+1)/2$ pares de filas, 5050 con $N = 100$, y cada uno hace
$N$ vueltas para poner al día `col` y otras $N$ para el mejor tramo:
$O(N^3)$, unos $10^6$ pasos con $N = 100$. La matriz ocupa $\Theta(N^2)$.

## Lógica

### Proposiciones y conectivos

Una proposición es un enunciado verdadero o falso, y no ambos. $x + 1 > 3$ no
lo es mientras $x$ no tenga valor. Los cinco conectivos son la negación, la
conjunción, la disyunción, la implicación y la doble implicación; el o
exclusivo no está entre ellos y se arma con los otros. Es verdadero cuando
exactamente una de las dos lo es:

$$
p \oplus q \;\equiv\; (p \wedge \neg q) \vee (\neg p \wedge q).
$$

Con $p$ y $q$ verdaderas los dos disyuntos son falsos, y con las dos falsas
también; en los otros dos renglones uno de ellos es verdadero. La columna
queda F, V, V, F.

$p \to q$ es falsa en un solo renglón: $p$ verdadera y $q$ falsa. Si alguien
promete que si lo eligen bajará los impuestos, la promesa solo queda falsa
cuando lo eligen y no los baja. Por eso $p \to q \equiv \neg p \vee q$. Una
fórmula se evalúa de los paréntesis de adentro hacia afuera, y según su tabla
es una tautología si todos los renglones dan V, una contradicción si todos
dan F y una contingencia si hay de los dos.

### La implicación y sus variantes

Dada $p \to q$, la recíproca es $q \to p$, la contrarrecíproca
$\neg q \to \neg p$ y la inversa $\neg p \to \neg q$. Con $p$ = llueve y
$q$ = el césped está mojado, la contrarrecíproca dice que si el césped no
está mojado no llovió, y es verdadera. La recíproca no: el césped puede
estar mojado por otra causa. Dos fórmulas son equivalentes cuando tienen la
misma tabla, y

$$
p \to q \;\equiv\; \neg q \to \neg p, \qquad q \to p \;\equiv\; \neg p \to \neg q.
$$

Con un arreglo $A[0..n-1]$, $n \ge 1$: si $A$ está ordenado ascendentemente,
entonces $A[0] \le A[n-1]$. La contrarrecíproca, si $A[0] > A[n-1]$ entonces
$A$ no está ordenado, también vale. La recíproca falla con $A = [1, 3, 2, 4]$:
$1 \le 4$ y el arreglo no está ordenado.

La negación de una implicación no es la inversa. Como $p \to q$ falla solo
con $p$ verdadera y $q$ falsa, por De Morgan sobre $\neg p \vee q$:

$$
\neg(p \to q) \;\equiv\; p \wedge \neg q.
$$

### Cuantificadores sobre un arreglo

Un predicado $P(x)$ se vuelve proposición al darle valor a $x$, y el dominio
es el conjunto de valores que puede tomar. Con $P(x)$: $x + 1 > 3$ sobre los
enteros, $P(5)$ es verdadera y $P(2)$ falsa. $\forall x\, P(x)$ pide que se
cumpla en todo el dominio; $\exists x\, P(x)$, en al menos un valor, el
testigo. El dominio cambia la respuesta: $\exists x\, (x + 1 = 0)$ es
verdadera en los enteros y falsa en los naturales.

En $A[0..n-1]$ las posiciones válidas son $0 \le i < n$, y ese rango va
dentro de la fórmula. El universal lo lleva con implicación y el existencial
con conjunción:

$$
\forall i\, (0 \le i < n \to A[i] > 0), \qquad \exists i\, (0 \le i < n \wedge A[i] = 0).
$$

Cruzarlos da fórmulas inútiles. $\exists i\, (0 \le i < n \to A[i] = 0)$ es
verdadera para cualquier arreglo, porque con $i = -1$ el antecedente es falso
y la implicación vale. $\forall i\, (0 \le i < n \wedge A[i] > 0)$ es falsa
para cualquier arreglo, porque $i = -1$ no está en el rango. Con el arreglo
vacío, $n = 0$, ningún $i$ cumple $0 \le i < 0$: el universal es verdadero,
porque nadie lo contradice, y el existencial es falso, porque no hay testigo.

Al negar, el universal pasa a existencial y su $\to$ a $\wedge$, y al revés.
El rango no se niega:

$$
\neg \forall i\, (0 \le i < n \to A[i] > 0) \;\equiv\; \exists i\, (0 \le i < n \wedge A[i] \le 0),
$$

$$
\neg \exists i\, (0 \le i < n \wedge A[i] = x) \;\equiv\; \forall i\, (0 \le i < n \to A[i] \ne x).
$$

$\neg(A[i] > 0)$ es $A[i] \le 0$ y no $A[i] < 0$, porque el cero también
contradice.

### De la frase a la fórmula

Primero se fijan el dominio y los predicados, después el cuantificador y el
rango de cada variable, y al final se prueba la fórmula con un caso que
cumple la frase y con otro que no.

Sobre las personas de la lista de un curso, con $I(e)$, $e$ está inscrito, y
$N(e)$, $e$ tiene nota, todo inscrito tiene nota es
$\forall e\, (I(e) \to N(e))$. El predicado $I(e)$ hace de rango: quien está
en la lista sin inscribirse no la contradice. Los predicados se escriben en
forma positiva, y la negación se aplica aparte con $\neg$.

Sobre los horarios de un estudiante, con $C(a, b)$, $a$ y $b$ ocupan una
misma hora, ningún horario se cruza con otro es

$$
\neg \exists a\, \exists b\, (a \ne b \wedge C(a, b)) \;\equiv\; \forall a\, \forall b\, (a \ne b \to \neg C(a, b)).
$$

Sin $a \ne b$ la fórmula es falsa en cuanto haya un horario, porque todo
horario ocupa la misma hora que él mismo. La misma condición aparece al pedir
que los elementos de un arreglo sean distintos.

Con $Ap(e, m)$, $e$ aprobó $m$, hay un estudiante que aprobó todas las
materias es $\exists e\, \forall m\; Ap(e, m)$: se escoge primero al
estudiante y se recorren las materias con él fijo. $\forall m\, \exists e\; Ap(e, m)$ dice otra cosa, que cada materia la aprobó alguien. Con dos
materias, si un estudiante aprobó solo Cálculo y otro solo Física, la
segunda fórmula es verdadera y la primera falsa.

### Propiedades de un arreglo

| Frase | Fórmula |
|---|---|
| $A$ está ordenado de menor a mayor, con repetidos | $\forall i\, (0 \le i < n-1 \to A[i] \le A[i+1])$ |
| $x$ aparece en $A[i..j)$ | $\exists t\, (i \le t < j \wedge A[t] = x)$ |
| $m$ es el máximo de $A$, con $n \ge 1$ | $\exists t\, (0 \le t < n \wedge A[t] = m) \wedge \forall t\, (0 \le t < n \to A[t] \le m)$ |
| $A$ no tiene repetidos | $\forall s\, \forall t\, (0 \le s < t < n \to A[s] \ne A[t])$ |

En la primera el rango termina en $n - 2$, porque cada elemento se compara
con el de su derecha y con $i = n - 1$ se leería $A[n]$. En la segunda la
variable cuantificada es $t$, una letra nueva, porque $i$ y $j$ son datos.
Para el máximo no basta que ningún elemento supere a $m$: con
$A = [4, 8, 1, 6, 3]$ y $m = 100$ eso se cumple, y 100 no está en el arreglo.
En la última, $s < t$ hace el papel de $a \ne b$ y además revisa cada pareja
una vez.

La hoja de tablero de la página 61 tiene una precondición del algoritmo de
Dijkstra: en un grafo $G = (V, E)$ con función de peso $w$, ninguna arista
pesa menos de cero.

$$
\forall u\, \forall v\, \bigl((u, v) \in E \to w(u, v) \ge 0\bigr)
$$

Se escribe no negativo y no positivo, porque el peso 0 está permitido.

### La definición de $O$

$f \in O(g)$ si existen $c > 0$ y $k \ge 0$ tales que $f(n) \le c \cdot g(n)$
para todo $n \ge k$:

$$
\exists c\, \exists k\, \bigl(c > 0 \wedge k \ge 0 \wedge \forall n\, (n \ge k \to f(n) \le c \cdot g(n))\bigr).
$$

$c$ y $k$ son los testigos: se escogen primero, quedan fijos y no pueden
depender de $n$. Con $f(n) = 3n + 5$ y $g(n) = n$, el intento $c = 3$ pide
$3n + 5 \le 3n$, que equivale a $5 \le 0$ y es falso para todo $n$. Con
$c = 4$, $3n + 5 \le 4n$ equivale a $5 \le n$:

| $n$ | $3n + 5$ | $4n$ | $3n + 5 \le 4n$ |
|---|---|---|---|
| 3 | 14 | 12 | F |
| 4 | 17 | 16 | F |
| 5 | 20 | 20 | V |
| 6 | 23 | 24 | V |
| 10 | 35 | 40 | V |

La desigualdad empieza a cumplirse en $n = 5$, y ese es el testigo $k$. La
tabla solo muestra dónde arranca; la demostración lo comprueba para todo
$n \ge k$:

- **Teorema.** $3n + 5 \in O(n)$.
- **Estrategia.** Demostración directa: exhibir $c$ y $k$ y comprobar la
  desigualdad desde $k$.
- **Desarrollo.** Sean $c = 4$, $k = 5$ y $n \ge 5$. Sumando $3n$ a los dos
  lados de $5 \le n$ se obtiene $3n + 5 \le 4n = c \cdot n$.
- **Conclusión.** Con $c = 4$ y $k = 5$ se cumple $3n + 5 \le c \cdot n$ para
  todo $n \ge k$; por tanto, $3n + 5 \in O(n)$.

Los testigos no son únicos: con $c = 8$ y $k = 1$ también se cumple, porque
$5 \le 5n$ desde $n = 1$. Para afirmar $f \notin O(g)$ se niega la fórmula
de afuera hacia adentro, conservando los rangos $c > 0$ y $k \ge 0$:

$$
f \notin O(g) \;\equiv\; \forall c\, \forall k\, \bigl(c > 0 \wedge k \ge 0 \to \exists n\, (n \ge k \wedge f(n) > c \cdot g(n))\bigr).
$$

Para cualquier pareja de testigos tiene que haber un $n$, desde $k$ en
adelante, donde $f$ supera a $c \cdot g$. Escribir $c \le 0$ en la negación
cambia el problema.

## Lo que sigue

La recursión sobre un árbol con UVa 839, *Not so Mobile*, y los invariantes
de ciclo pasan a la siguiente sesión. El enunciado, el envío y el consejo
están en la
[página de la sesión](./24%20de%20octubre.%20Tramos,%20matrices,%20recursi%C3%B3n%20e%20invariantes.md#hora-3-uva-839-not-so-mobile),
y la solución en las [soluciones](./Soluciones.md).

Queda propuesto el ejercicio 6 del deck de lógica, en la página 82 de
[logica-anotada.pdf](./logica-anotada.pdf){ target=_blank rel=noopener }:
demostrar en cuatro partes que $2n^2 + 3n \in O(n^2)$, con sus testigos, y
mostrar que la fórmula $\forall n\, \exists c\, (c > 0 \wedge f(n) \le c \cdot g(n))$ dejaría a $n^2$ en $O(n)$. La solución está en las páginas 83 a 85.
