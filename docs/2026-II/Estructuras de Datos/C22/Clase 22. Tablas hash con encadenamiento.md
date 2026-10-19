# Estructuras de Datos · Clase 22. Tablas hash con encadenamiento

Viernes 23 de octubre de 2026, de 14:00 a 17:00.

La tabla de direccionamiento directo busca, inserta y elimina en $\Theta(1)$
porque la clave es la dirección, pero reserva una casilla por cada clave
posible. Con códigos de 10 dígitos eso son $10^{10}$ casillas para guardar 40.
Esta sesión dobla ese universo sobre una tabla corta con una función hash,
resuelve los choques con una lista enlazada en cada casilla y mide lo que
cuesta cada operación según qué tan llenas están las listas.

Al terminar, el objetivo es poder calcular la casilla de una clave entera o de
una cadena con el método de la división y reconocer cuándo dos claves chocan;
insertar, buscar y eliminar a mano y en C++ en una tabla hash con
encadenamiento; dar el costo de cada operación en el peor caso y en el caso
promedio en función del factor de carga $\alpha = n/m$, junto con el espacio
que ocupa la tabla; y escoger el número de casillas $m$, explicando con claves
concretas qué pasa con una mala elección.

## Diapositivas

![](./clase22.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## La tabla de direccionamiento directo y su límite

La tabla de direccionamiento directo (CLRS, §11.1) guarda la clave $k$ en la
casilla $T[k]$. Con claves en $U = \{0, 1, \ldots, u - 1\}$:

| Operación | Tiempo | Por qué |
|---|---|---|
| buscar, insertar, eliminar | $\Theta(1)$ | la clave es la dirección |
| espacio | $\Theta(u)$ | una casilla por clave posible, se use o no |

## Pocas claves, universo enorme

Un curso tiene 40 estudiantes con códigos de 10 dígitos, y llegan miles de
consultas de la forma *¿el código $k$ está inscrito?*. Las entradas son los $n$
códigos y las consultas; la salida, `si` o `no` por consulta.

- La tabla directa pide $10^{10}$ casillas: aun con un byte por casilla son
  unos 10 GB para guardar 40 códigos.
- Una lista enlazada ocupa $\Theta(n)$, pero cada consulta que falla recorre
  los $n$ nodos: $\Theta(n)$ por consulta y $\Theta(q \cdot n)$ con $q$
  consultas.

| | Buscar | Espacio |
|---|---|---|
| Tabla directa | $\Theta(1)$ | $\Theta(u)$, con $u = 10^{10}$ |
| Lista enlazada | $\Theta(n)$ | $\Theta(n)$ |
| Lo que se quiere | cerca de $\Theta(1)$ | cerca de $\Theta(n)$ |

## La función hash

Con una tabla de 100 casillas y la casilla dada por los dos últimos dígitos,
`8920104417` va a la 17, `8920104452` a la 52 y `8920103990` a la 90. Buscar es
mirar una casilla. Pero `8920105517` también va a la 17: dos códigos distintos
piden la misma casilla.

**Definición (CLRS, §11.2).** Una *función hash*
$h : U \to \{0, 1, \ldots, m - 1\}$ asigna a cada clave del universo una
casilla de la tabla $T[0..m-1]$; la clave $k$ se guarda en $T[h(k)]$, y $h(k)$
es su *valor hash*. Dos claves distintas con el mismo valor hash forman una
*colisión*. Si $|U| > m$, las colisiones no se pueden evitar del todo.

**El método de la división (CLRS, §11.3).** $h(k) = k \bmod m$. Los dos últimos
dígitos son $k \bmod 100$. Con $m = 7$:

| $k$ | $k \bmod 7$ | $h(k)$ |
|---|---|---|
| 10 | $10 = 1 \cdot 7 + 3$ | 3 |
| 23 | $23 = 3 \cdot 7 + 2$ | 2 |
| 5 | $5 = 0 \cdot 7 + 5$ | 5 |
| 17 | $17 = 2 \cdot 7 + 3$ | 3 |

10 y 17 colisionan en la casilla 3. Calcular $h(k)$ es una división,
$\Theta(1)$. En C++, `k % m` da el residuo solo si $k \geq 0$.

### Claves que son palabras

Sumar los códigos de los caracteres no ve el orden: con $m = 13$, `sol` da
$115 + 111 + 108 = 334$ y $334 \bmod 13 = 9$, y `los` también da 9. Toda
palabra choca con sus anagramas.

La cadena $c_0 c_1 \cdots c_{L-1}$ se lee como un número en base $b$,
$(\cdots((c_0 \cdot b + c_1) \cdot b + c_2) \cdots) \cdot b + c_{L-1}$, y la
casilla es ese número módulo $m$. Con $b = 31$ y $m = 13$, reduciendo en cada
paso:

| Paso | Carácter | Código | $h \leftarrow (h \cdot 31 + c) \bmod 13$ |
|---|---|---|---|
| 1 | `s` | 115 | $(0 \cdot 31 + 115) \bmod 13 = 11$ |
| 2 | `o` | 111 | $452 \bmod 13 = 10$ |
| 3 | `l` | 108 | $418 \bmod 13 = 2$ |

Se reduce en cada paso porque, sin reducir, una palabra de seis letras
minúsculas ya pasa de $97 \cdot 31^5 \approx 2{,}8 \cdot 10^9$, más de lo que
cabe en un `int`. Con la reducción, $h < m$ siempre, y el residuo final es el
mismo. [hash_cadenas.cpp](./codigo/hash_cadenas.cpp) calcula las dos funciones:

| Palabra | Suma | Polinomio |
|---|---|---|
| `sol` | 9 | 2 |
| `los` | 9 | 3 |
| `gato` | 11 | 1 |
| `toga` | 11 | 12 |

Calcular el valor hash de una cadena de $L$ caracteres cuesta $\Theta(L)$.

## Encadenamiento

**Encadenamiento (CLRS, §11.2).** Cada casilla $T[i]$ guarda la cabeza de una
lista enlazada con todas las claves $k$ tales que $h(k) = i$; una casilla sin
claves guarda `NULL`. Cada nodo es el de la lista enlazada simple: la clave y
el puntero al siguiente.

Con $m = 7$ se insertan 10, 23, 5, 17, 12 y 31, en ese orden. Cada clave nueva
se cuelga al frente de su lista: el nodo nuevo apunta a la cabeza vieja y la
casilla apunta al nodo nuevo, dos punteros sin importar el largo de la lista.

| Clave | $h(k)$ | Largo de su lista | Casillas vacías |
|---|---|---|---|
| 10 | 3 | 1 | 6 |
| 23 | 2 | 1 | 5 |
| 5 | 5 | 1 | 4 |
| 17 | 3 | 2 | 4 |
| 12 | 5 | 2 | 4 |
| 31 | 3 | 3 | 4 |

La tabla queda así:

```text
0:
1:
2: 23
3: 31 17 10
4:
5: 12 5
6:
```

- **Buscar 17.** $h(17) = 3$: se compara con 31 y con 17. Dos comparaciones, y
  las listas de las casillas 2 y 5 no se miran.
- **Buscar 24.** $h(24) = 3$: se compara con 31, 17 y 10 y se llega a `NULL`.
  Una búsqueda que falla recorre la lista completa de su casilla.
- **Eliminar 17.** Se recorre la lista de la casilla 3 con `anterior` y
  `actual`; cuando `actual` llega al 17, el `siguiente` de 31 pasa a ser el 10 y
  el nodo se libera. Si la clave está en la cabeza no hay `anterior`, y la que
  cambia es la casilla: eliminar 31 deja `casillas[3]` en el 17.

!!! warning "Un arreglo de `Lista` no sirve"

    Con `Lista casillas[7]`, `insertar(0, k)` cuesta $\Theta(1)$, pero buscar con
    `obtener(p)` para $p = 0, 1, \ldots$ camina desde la cabeza en cada llamada:
    $0 + 1 + \cdots + (L - 1) = L(L-1)/2$ pasos en una lista de largo $L$,
    $\Theta(L^2)$ en lugar de $\Theta(L)$. La tabla recorre sus nodos con un
    puntero que avanza.

La implementación está en [tabla_hash.h](./codigo/tabla_hash.h): un arreglo
`Nodo **casillas` de $m$ cabezas creado con `new[]`, y `buscar`, `insertar`,
`eliminar`, `largo` e `imprimir`. `insertar` no revisa si la clave ya está; si
las claves pueden repetirse, se llama a `buscar` antes. El destructor libera
cada nodo con `delete` y el arreglo con `delete[]`.
[hash_uso.cpp](./codigo/hash_uso.cpp) corre el ejemplo y reproduce la tabla de
arriba.

## Lo que cuesta

**Factor de carga (CLRS, §11.2).** Con $n$ claves en $m$ casillas,
$\alpha = n/m$ es el largo promedio de las listas. En el ejemplo,
$\alpha = 6/7 \approx 0{,}86$, y tras eliminar 17, $5/7 \approx 0{,}71$.

**Peor caso.** Las claves 3, 10, 17, 24, 31 y 38 dejan todas residuo 3 con
$m = 7$: una sola lista con las $n$ claves y seis casillas vacías. Buscar 45
compara con las seis. Buscar y eliminar cuestan $\Theta(n)$, como en la lista
enlazada.

**Caso promedio.** Con hashing uniforme independiente (cada clave cae en
cualquiera de las $m$ casillas con la misma probabilidad, sin importar dónde
cayeron las demás), CLRS (teoremas 11.1 y 11.2) concluye que una búsqueda que
falla y una que acierta cuestan, en promedio, $\Theta(1 + \alpha)$: el 1 es
calcular $h(k)$ y llegar a la casilla, y $\alpha$ es el recorrido.

**Teorema.** Si la tabla tiene $m \geq n/2$ casillas, entonces
$f(n) = 1 + n/m$ es $O(1)$.

**Demostración.** Se procede de forma directa: se busca una constante $c$ y un
$k$ tales que $f(n) \leq c \cdot 1$ para todo $n \geq k$.

**Desarrollo.**

$$
\begin{aligned}
f(n) &= 1 + \frac{n}{m} && \text{definición de } \alpha \\
&\leq 1 + \frac{n}{n/2} && m \geq n/2\text{: dividir entre más da menos} \\
&= 1 + 2 = 3 && \frac{n}{n/2} = 2 \text{ para } n \geq 1 \\
&= 3 \cdot 1 && \text{se toma } c = 3
\end{aligned}
$$

La desigualdad vale desde $n = 1$, así que $k = 1$.

**Conclusión.** Por lo tanto, se puede concluir que $1 + \alpha \in O(1)$ con
testigos $c = 3$ y $k = 1$: si la tabla mantiene al menos una casilla por cada
dos claves, buscar y eliminar cuestan $O(1)$ en promedio. Con $m$ fijo, en
cambio, $\alpha$ crece con $n$ y buscar vuelve a ser lineal.

| Operación | Promedio | Peor caso | Por qué |
|---|---|---|---|
| $h(k)$, clave entera | $\Theta(1)$ | $\Theta(1)$ | una división |
| $h(s)$, cadena de $L$ | $\Theta(L)$ | $\Theta(L)$ | una vuelta por carácter |
| `insertar(k)` | $\Theta(1)$ | $\Theta(1)$ | se cuelga al frente de su lista |
| `buscar(k)` | $\Theta(1 + \alpha)$ | $\Theta(n)$ | se recorre una lista; en el peor caso tiene todas las claves |
| insertar sin repetir | $\Theta(1 + \alpha)$ | $\Theta(n)$ | primero se busca |
| `eliminar(k)` | $\Theta(1 + \alpha)$ | $\Theta(n)$ | se busca con `anterior`; desenlazar es $\Theta(1)$ |
| `largo(i)` | $\Theta(1 + \alpha)$ | $\Theta(n)$ | se cuentan los nodos de una lista |
| `imprimir`, destructor | $\Theta(m + n)$ | $\Theta(m + n)$ | se visitan las $m$ casillas y los $n$ nodos |
| constructor | $\Theta(m)$ | $\Theta(m)$ | $m$ cabezas en `NULL` |

La tabla ocupa $\Theta(m + n)$: el arreglo de $m$ cabezas y un nodo por clave.
Ninguna operación pide memoria aparte que crezca con $n$.

### Escoger $m$

[dispersion.cpp](./codigo/dispersion.cpp) inserta las 1000 claves
$k = \mathit{paso} \cdot i$, con $i = 1, \ldots, 1000$, y cuenta con `largo`:

| $m$ | paso | Casillas vacías | Lista más larga | $\alpha$ |
|---|---|---|---|---|
| 64 | 1 | 0 | 16 | 15,6 |
| 64 | 4 | 48 | 63 | 15,6 |
| 61 | 4 | 0 | 17 | 16,4 |
| 61 | 61 | 60 | 1000 | 16,4 |

- $64 = 2^6$, y $k \bmod 2^6$ son los últimos 6 bits de $k$. Un múltiplo de 4
  termina en `00`: solo quedan las 16 casillas múltiplos de 4, y las listas
  miden cuatro veces $\alpha$.
- Con el primo 61, los múltiplos de 4 recorren todos los residuos.
- Ningún $m$ resiste un patrón hecho a su medida: con paso 61, las 1000 claves
  caen en la casilla 0.

Con el método de la división se escoge un primo que no esté cerca de una
potencia de 2 (CLRS, §11.3). Una potencia de 2 o de 10 usa solo los últimos
bits o los últimos dígitos de la clave, como la tabla de 100 casillas con los
códigos.

## Para el juez

### UVa 484: The Department of Redundancy Department

*UVa 484, The Department of Redundancy Department*:
<https://onlinejudge.org/external/4/484.pdf>. Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=425>.

Una tabla hash con encadenamiento cuyo nodo guarda la clave y un contador.

La entrada es una secuencia de enteros positivos, negativos o cero, tan larga
como se quiera, hasta el fin del archivo. Por cada entero distinto se imprime
una línea con el entero y cuántas veces apareció, en el orden en que apareció
por primera vez. Con `3 1 2 2 1 3 5 3 3 2` sale `3 4`, `1 2`, `2 3` y `5 1`: el
3 va primero porque fue el primero en llegar.

Por cada número se busca en su lista: si está, se suma uno; si no, se cuelga
un nodo con cuenta 1 y el número se anota en un arreglo de claves en orden de
llegada. Al final se recorre ese arreglo y se busca la cuenta de cada una. Con
$m = 100\,003$, primo, cada número cuesta $\Theta(1 + \alpha)$ en promedio.

!!! warning "Las trampas"

    - Los negativos: en C++, `-7 % 5` da $-2$. Con `k % m` como casilla, un
      negativo escribe fuera del arreglo. La casilla es `((k % m) + m) % m`.
    - No se sabe cuántos números vienen, así que no hay $n$ para dimensionar:
      $m$ se fija grande desde el comienzo.
    - $-100\,003$, $0$ y $100\,003$ caen en la misma casilla y son claves
      distintas: la lista compara la clave, no la casilla.

### Soluciones

Lee la entrada de ejemplo del enunciado y reproduce su salida:
`./sol < uva484.in`.

- UVa 484, The Department of Redundancy Department:
  [uva484.cpp](./codigo/uva484.cpp), [entrada](./codigo/uva484.in),
  [salida](./codigo/uva484.out)

## Lo que se vio

- La tabla de direccionamiento directo busca en $\Theta(1)$ pero ocupa
  $\Theta(u)$, una casilla por clave posible: con códigos de 10 dígitos, $10^{10}$
  casillas para 40 claves.
- Una función hash $h : U \to \{0, \ldots, m - 1\}$ lleva cada clave a una
  casilla. Con el método de la división, $h(k) = k \bmod m$.
- Una cadena se lee como un número en base 31 y se reduce módulo $m$ en cada
  paso; sumar los códigos hace chocar a todos los anagramas. El valor hash de
  una cadena de $L$ caracteres cuesta $\Theta(L)$.
- Si el universo tiene más claves que la tabla casillas, las colisiones son
  inevitables. Con encadenamiento cada casilla es la cabeza de una lista
  enlazada, y una clave nueva se cuelga al frente en $\Theta(1)$.
- Buscar y eliminar recorren una sola lista, la de $h(k)$; eliminar en la
  cabeza cambia la casilla, no un `siguiente`.
- Con $\alpha = n/m$, buscar y eliminar cuestan $\Theta(1 + \alpha)$ en promedio
  bajo hashing uniforme independiente y $\Theta(n)$ en el peor caso; con
  $m \geq n/2$, $1 + \alpha \leq 3$. La tabla ocupa $\Theta(m + n)$.
- Con $m = 64$ y claves múltiplos de 4, 48 casillas quedaron vacías y la lista
  más larga midió 63; con $m = 61$, ninguna vacía y 17 la más larga.
- En C++ el residuo de un negativo es negativo: la casilla se calcula con
  `((k % m) + m) % m`.

## Ejercicios

### A mano

Inserten, en este orden, 22, 5, 16, 38, 27, 49 y 3 en una tabla con
encadenamiento de $m = 11$ casillas, colgando al frente. Dibujen la tabla.
¿Cuánto vale $\alpha$ y cuánto mide la lista más larga? ¿Cuántas comparaciones
hace buscar 60? Repitan con $m = 10$: ¿qué tabla queda mejor repartida, y por
qué no es la del primo?

Con $m = 11$, 22 va a la casilla 0, 3 a la 3, y 5, 16, 38, 27 y 49 a la 5, con
la lista `49 27 38 16 5`; $\alpha = 7/11 \approx 0{,}64$ y la lista más larga
mide 5. Buscar 60 hace cinco comparaciones y llega a `NULL`. Con $m = 10$ cada
clave va a su propia casilla: las claves 5, 16, 27, 38 y 49 van de 11 en 11, un
patrón hecho a la medida de $m = 11$.

### Dos que suman $x$

Dado un arreglo de $n$ enteros no negativos y un número $x$, decir si hay dos
casillas distintas cuyos valores suman $x$. Con
$a = \langle 8, 3, 11, 6, 2, 15 \rangle$: $x = 9$ sí ($3 + 6$), $x = 21$ sí
($6 + 15$) y $x = 12$ no, porque hay un solo 6. Probar todas las parejas cuesta
$\Theta(n^2)$. Con la tabla, al llegar a $a[i]$ se busca $x - a[i]$ entre los
ya vistos y después se guarda $a[i]$; buscar antes de guardar es lo que impide
usar el 6 dos veces. Son $n$ búsquedas e inserciones: $\Theta(n)$ en promedio
con $m$ proporcional a $n$, más $\Theta(n)$ de espacio aparte.
[sumapar.cpp](./codigo/sumapar.cpp) imprime `1`, `1` y `0`.

## Para practicar en casa

### Propuesto 1: distintos

Escriba una función que cuente cuántos valores distintos hay en un arreglo de
$n$ enteros no negativos con la tabla hash. ¿Cuánto cuesta? ¿Y ordenando
primero?

Pista: se busca cada valor y, si no estaba, se inserta y se suma uno.
$\Theta(n)$ en promedio con $m$ proporcional a $n$; ordenando,
$\Theta(n \log n)$ y un recorrido que compara vecinos.

### Propuesto 2: tabla de palabras

Cambie la clave de `TablaHash` a una cadena de hasta 20 letras, con
`hashPolinomio` como $h$. ¿Qué cambia en `buscar`?

Pista: el nodo guarda un arreglo de `char`; la comparación `actual->clave != k`
pasa a ser `strcmp`, y cada comparación cuesta lo que la cadena.

### Propuesto 3: el peor caso a la medida

Para $m = 13$, escriba ocho claves que caigan todas en la casilla 4, y cuente
cuántas comparaciones hace buscar una clave que no está.

Pista: sirve cualquier clave $4 + 13j$. Buscar una que no está recorre las
ocho.

### Propuesto 4: repartir códigos

Genere 2000 códigos de 10 dígitos que comparten los seis primeros y mida, con
`largo`, la lista más larga y las casillas vacías con $m = 100$, $m = 128$ y
$m = 101$.

Pista: con 100 casillas solo cuentan los dos últimos dígitos, y con 128, los
últimos 7 bits. Compare con el primo.

### Propuesto 5: eliminar con la lista doble

Si cada casilla fuera una lista doblemente enlazada y se tuviera el nodo en la
mano, ¿cuánto costaría eliminar?

Pista: con `anterior` en cada nodo no hay que buscar al de antes: desenlazar es
$\Theta(1)$ (CLRS, §11.2).

### Para pensar

Una tabla de $m = 101$ casillas recibe un millón de claves. ¿Qué le pasa a
$\alpha$, y cómo haría la tabla para mantener buscar en $O(1)$ en promedio sin
saber $n$ desde el comienzo?

## Ejercicios interactivos

Ocho actividades que se trabajan en el navegador, ordenadas por los temas de la
sesión, en la [página de ejercicios](./Ejercicios.md): cuánto ocupa una tabla
directa para teléfonos de 7 dígitos; la casilla de cada clave con $m = 17$ y
los pares que chocan; el polinomio de `mar` y `ram`; seis claves que entran a
una tabla de cinco casillas; cuántas comparaciones hace cada búsqueda y qué
puntero cambia al eliminar; el factor de carga frente a la lista más larga;
las mismas claves con $m = 100$, 128 y 97; y el residuo de C++ con claves
negativas. Las claves y las tablas no son las de la sesión: mismo tema, ronda
nueva.

## Lo que sigue

Más tablas hash: qué hacer cuando $\alpha$ crece, y el contenedor `map` de la
biblioteca, que guarda pares de clave y valor.

## Código de la sesión

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

- [tabla_hash.h](./codigo/tabla_hash.h): la tabla hash con encadenamiento:
  `buscar`, `insertar`, `eliminar`, `largo` e `imprimir`.
- [hash_uso.cpp](./codigo/hash_uso.cpp): el ejemplo con $m = 7$. Imprime el
  valor hash de 10, 23, 5, 17, 12 y 31, la tabla con `2: 23`, `3: 31 17 10` y
  `5: 12 5`, y después `buscar 17: 1`, `buscar 24: 0`, `eliminar 17: 1`,
  `largo de la casilla 3: 2` y `n = 5, m = 7`.
- [hash_cadenas.cpp](./codigo/hash_cadenas.cpp): la suma de los códigos y el
  polinomio en base 31 con $m = 13$ para `sol`, `los`, `gato` y `toga`.
- [dispersion.cpp](./codigo/dispersion.cpp): vacías y lista más larga con
  1000 claves para $m = 64$ y $m = 61$; imprime la tabla de *Escoger $m$*.
- [sumapar.cpp](./codigo/sumapar.cpp): dos que suman $x$; imprime `x = 9: 1`,
  `x = 21: 1` y `x = 12: 0`.

La solución del problema de juez está en la sección *Para el juez*, con su
entrada y su salida.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*, 4.ª ed. MIT Press, 2022. Capítulo 11, tablas hash: §11.1 tablas
  de direccionamiento directo; §11.2 tablas hash, encadenamiento y su análisis;
  §11.3 funciones hash, método de la división.
- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 15, hashing y colisiones.
- UVa Online Judge. Problema 484, *The Department of Redundancy Department*:
  <https://onlinejudge.org/external/4/484.pdf>.
