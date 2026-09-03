# Clase 8. Punteros, arreglos y arreglos bidimensionales

Miércoles 2 de septiembre de 2026.

El manejo de memoria dejó una pregunta sin responder. En el mapa de
direcciones, `A` empezaba en 2000 y `A[3]` vivía en 2012, y la explicación
que se dio entonces —cuatro bytes por casilla— describía el resultado sin
decir quién hace la cuenta. Hoy se ve quién: el corchete. `A[i]` no es una
operación aparte del lenguaje, es una suma de direcciones escrita de forma
cómoda, y en cuanto eso queda claro la misma idea sirve para las tablas.

Al final de la sesión el objetivo era poder operar direcciones con la
aritmética de punteros y explicar la equivalencia entre `A[i]` y `*(A + i)`,
recorrer un arreglo con índice y con puntero pasando de una forma a la otra,
explicar cómo se guarda una matriz en memoria y calcular la dirección de
`M[i][j]`, y reservar, recorrer y liberar una matriz cuyo tamaño se conoce
en ejecución.

## Diapositivas

![](clase08.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Lo que quedó del manejo de memoria

La memoria es una calle de celdas numeradas y cada variable ocupa las suyas.
Los tamaños de la sesión anterior siguen siendo la referencia: un `int` mide
4 bytes, que son 32 bits; un `long` mide 8, que son 64. Y el `char` mide
exactamente un byte, por una razón que se puede reconstruir: el código ASCII
va de 0 a 255, y 256 valores son justo lo que se puede escribir con ocho
bits. Ahí caben los caracteres imprimibles y también los que no se ven —el
espacio, el salto de línea, la tabulación—.

Las direcciones reales se escriben en hexadecimal, base 16, con dígitos de
`0` a `9` y de `a` a `f`. Conviene porque cada dígito hexadecimal describe
cuatro bits: dos dígitos son un byte exacto, y por eso cualquier volcado de
memoria se lee agrupado de a dos.

De un puntero quedaron tres cosas: guarda una dirección, `*p` usa la celda
apuntada, y el contrato con el montículo es asignar, verificar contra `NULL`,
usar, liberar y aterrizar el puntero en `NULL`.

## La aritmética de las direcciones

Si `p` es un `int *` que vale 2000, ¿cuánto vale `p + 1`?

La respuesta no es 2001.

!!! note "Aritmética de punteros (Thareja, capítulo 6)"

    Sumarle $k$ a un puntero lo avanza $k$ **casillas del tipo apuntado**, no
    $k$ bytes. Para un `int *`,

    $$\texttt{p + k} = \texttt{p} + k \cdot \texttt{sizeof(int)} = \texttt{p} + 4k.$$

| Expresión | Dirección |
|---|---:|
| `p` | 2000 |
| `p + 1` | 2004 |
| `p + 2` | 2008 |
| `p + 3` | 2012 |

El 4 no está en la aritmética, está en el tipo. Con un `double *` en 3000,
`q + 2` vale 3016, porque cada casilla mide 8. El compilador multiplica por
`sizeof` sin que uno lo escriba, y esa es exactamente la razón por la que la
trampa funciona: si uno está en la dirección 5 y suma 1, no llega a la 6.

### Por qué llegar a `A[i]` cuesta $O(1)$

Calcular `p + k` es una multiplicación y una suma sobre números, no un
recorrido. `p + 1` y `p + 100` cuestan lo mismo, y ese costo no depende del
tamaño del arreglo:

$$\text{costo de acceder a una casilla} = O(1).$$

Vale la pena guardarlo, porque no es una propiedad de todas las estructuras.
Cuando aparezcan las listas enlazadas, llegar al elemento $k$ va a costar
$O(k)$, y la diferencia entre indexar y recorrer va a decidir qué estructura
sirve para qué problema. Recorrer el arreglo completo sí cuesta $O(n)$: $n$
accesos de $O(1)$ cada uno.

### La resta también funciona

Entre dos punteros al mismo arreglo, `q - p` no da bytes: da casillas.

```c
int *p = A + 1;   /* 2004 */
int *q = A + 4;   /* 2016 */
```

`q - p` vale 3, no 12. Es la cuenta inversa de la suma: se divide por el
tamaño del tipo. Y conviene no confundirla con `*q - *p`, que resta los
valores guardados y no tiene nada que ver con las direcciones.

## El arreglo es una dirección

Cuando se declara `int A[4] = {5, 8, 2, 9}` y se imprime `A`, no salen los
cuatro números: sale una dirección. Lo que está guardado bajo ese nombre es
dónde empieza el bloque.

!!! note "Punteros y arreglos (Thareja, capítulo 6)"

    En una expresión, el nombre de un arreglo vale la dirección de su primera
    casilla: `A` equivale a `&A[0]`. Y el corchete es aritmética disfrazada:

    $$\texttt{A[i]} \;\equiv\; \texttt{*(A + i)}.$$

Con eso, la pregunta pendiente se responde sola: `A[3]` es `*(A + 3)`, la
casilla que está tres lugares después de 2000, es decir
$2000 + 3 \cdot 4 = 2012$.

`A[i]` es azúcar sintáctico: la misma operación, escrita de forma que se
pueda leer. Al café se le echa azúcar porque solo sabe amargo, y `*(A + i)`
sabe amargo: a primera vista nadie ve un elemento de un arreglo ahí, ve un
asterisco y una suma. El corchete no agrega poder, agrega legibilidad.

### La máquina está de acuerdo

```c
int A[4] = {5, 8, 2, 9};
int i;

printf("A vale %p\n", (void *) A);
i = 0;
while (i < 4) {
    printf("A[%d] = %d   *(A+%d) = %d   A+%d = %p\n",
           i, A[i], i, *(A + i), i, (void *) (A + i));
    i = i + 1;
}
```

```text
A vale 0x7ffdb78df870
A[0] = 5   *(A+0) = 5   A+0 = 0x7ffdb78df870
A[1] = 8   *(A+1) = 8   A+1 = 0x7ffdb78df874
A[2] = 2   *(A+2) = 2   A+2 = 0x7ffdb78df878
A[3] = 9   *(A+3) = 9   A+3 = 0x7ffdb78df87c
```

Las dos columnas de valores coinciden casilla por casilla, y las direcciones
suben de 4 en 4 desde `A`. En hexadecimal el salto se ve como `870`, `874`,
`878`, `87c`: el último dígito pasando de 0 a c de cuatro en cuatro.

### Recorrer con índice o caminando el puntero

El mismo recorrido, escrito dos veces:

```c
/* con indice */
suma = 0;
i = 0;
while (i < n) {
    suma = suma + A[i];
    i = i + 1;
}

/* con puntero */
suma = 0;
p = A;
while (p < A + n) {
    suma = suma + *p;
    p = p + 1;
}
```

El índice cuenta casillas desde 0; el puntero se para en cada casilla. El
tope `p < A + n` es el mismo `i < n` traducido a direcciones, y la traducción
tiene que ser exacta: si el arreglo reservó $n$ enteros a partir de la
dirección base, la última casilla legítima es la $n - 1$, y la primera
dirección prohibida es `A + n`, que en bytes queda en $\text{base} + 4n$. La
condición es `<` y no `<=` por la misma razón por la que el arreglo se indexa
desde 0.

Las dos versiones cuestan $O(n)$ y elegir una es cuestión de claridad. En el
curso se usan ambas.

### El arreglo viaja como dirección

Empaquetado en una función, el recorrido con puntero queda así:

```c
/* Suma los n enteros que empiezan en la direccion inicio */
int suma(int *inicio, int n) {
    int total = 0;
    int *p = inicio;

    while (p < inicio + n) {
        total = total + *p;
        p = p + 1;
    }
    return total;
}

int main(void) {
    int A[5] = {4, 7, 1, 3, 5};

    printf("La suma es %d\n", suma(A, 5));
    return 0;
}
```

```text
La suma es 20
```

Dos detalles del cuerpo de la función. El primero es que `p` arranca como
copia de `inicio` en vez de mover `inicio` directamente: si el ciclo avanzara
el parámetro, al terminar ya nadie sabría dónde empieza el bloque, y la
condición `p < inicio + n` se quedaría sin referencia. El segundo es que la
función necesita que le pasen `n`: con la dirección sola no hay forma de
saber dónde termina el arreglo, porque lo que viajó en la llamada fue
`&A[0]` y nada más.

Que viaje la dirección y no una copia es lo razonable: copiar un arreglo de
un millón de enteros en cada llamada costaría 4 MB y $O(n)$ por el solo hecho
de llamar. Este viaje de direcciones se vuelve tema propio en el paso de
parámetros por referencia.

### La culebra hace lo mismo, sin decirlo

Vale la pena verlo en un lenguaje donde uno cree que no hay punteros:

```python
def sumar(lst):
    suma = 0
    for e in lst:
        suma += e
    lst[0] = 1000
    return suma


if __name__ == "__main__":
    lista = [x for x in range(0, 101)]
    print(lista[0:20])
    print(sumar(lista))
    print(lista[0:20])
```

```text
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
5050
[1000, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
```

La lista de afuera quedó modificada, y nadie la tocó desde afuera. La función
recibió la ubicación en memoria de la lista, no la lista, así que
`lista[0] = 1000` escribió en el mismo objeto que ve el programa principal.
Es exactamente lo que pasa en C con `suma(A, 5)`, solo que allá el `int *` en
la firma lo dice y aquí no lo dice nada.

Con un entero el efecto no aparece, y esa asimetría es la que enreda: pasar
un número se siente distinto de pasar una lista sin que el código muestre por
qué. Los detalles que un lenguaje esconde no dejan de ocurrir; simplemente
hay que aprenderlos en otra parte.

### ¿Qué imprime?

Antes de correrlo:

```c
int A[5] = {2, 4, 6, 8, 10};
int *p = A + 1;

printf("%d\n", *p + *(p + 2));
```

Con `A` en 2000:

| Expresión | Dirección | Valor |
|---|---:|---:|
| `p = A + 1` | 2004 | — |
| `*p` | 2004 | 4 |
| `p + 2` | 2012 | — |
| `*(p + 2)` | 2012 | 8 |

$$\texttt{*p + *(p + 2)} = 4 + 8 = 12.$$

Lo que hay que separar es el direccionamiento de la recuperación: `p + 2`
calcula una dirección y no lee nada; el asterisco de adelante es el que va a
buscar el valor. El puntero puede arrancar en mitad del arreglo, y desde ahí
`p + 2` es `&A[3]`, no `&A[2]`.

### La casa de al lado

`A` tiene cuatro casillas, de `A[0]` a `A[3]`. ¿Y si se lee `A[4]`?

```c
int A[4] = {1, 2, 3, 4};

printf("A[3] = %d\n", A[3]);
printf("A[4] = %d\n", A[4]);   /* la casa de al lado */
```

```text
A[3] = 4
A[4] = 0
```

!!! warning "El lenguaje no revisa los límites"

    `A[4]` es `*(A + 4)`: una dirección válida como cualquiera, la casa de al
    lado. Esta corrida imprimió 0; otra puede imprimir basura, es decir, bytes
    que están ahí y no significan nada en este programa. Y una *escritura* en
    esa dirección corrompe la variable vecina. El compilador no dijo nada, ni
    con `-Wall -Wextra`.

Otros lenguajes sí revisan. Python levanta un `IndexError` y Java lanza
`ArrayIndexOutOfBoundsException`, que son errores controlados: el programa se
entera y puede reaccionar. C no ofrece esa red. Si el desbordamiento es
grande y el programa toca memoria que no le pertenece, quien reacciona es el
núcleo del sistema operativo, y lo hace matando el proceso: `Segmentation
fault`. Un fallo de segmentación no es un error del lenguaje, es el sistema
avisando que el programa se salió de lo suyo.

En C el límite lo cuida la condición del ciclo. No hay nadie más.

## La tabla en una sola calle

Tres estudiantes y cuatro tareas:

| | T1 | T2 | T3 | T4 |
|---|---:|---:|---:|---:|
| Ana | 10 | 11 | 12 | 13 |
| Benito | 20 | 21 | 22 | 23 |
| Clara | 30 | 31 | 32 | 33 |

Los datos son una tabla, pero la memoria sigue siendo una calle de celdas
consecutivas. Y ahí está el truco: los arreglos bidimensionales no existen
físicamente. La memoria no tiene filas ni columnas; tiene una hilera larga.
La tabla es una forma de *leer* esa hilera.

!!! note "Definición (Thareja, capítulo 3, *Two-dimensional Arrays*)"

    `int M[3][4]` declara un arreglo de 3 filas y 4 columnas; `M[i][j]` es la
    casilla de la fila `i` y la columna `j`. En memoria, las filas se guardan
    una tras otra, sin huecos (orden por filas, *row-major*).

La imagen que sirve es la del barrio: una cuadra larga de casas numeradas
consecutivamente, y alguien que decide pintar de un color cada grupo de
cuatro vecinos. Las casas no se movieron; el color es lo que crea las filas.
La fila 0 son las cuatro primeras casillas, la fila 1 las cuatro siguientes,
y así. La misma lógica vale para tres dimensiones o para $n$: lo único que
cambia es cuántos grupos anidados se pintan.

### La cuenta del compilador

Si `M` tiene $m$ columnas y empieza en la dirección $b$:

$$\text{dirección de } \texttt{M[i][j]} = b + (i \cdot m + j) \cdot \texttt{sizeof(int)}.$$

Se leen dos movimientos: saltar $i$ filas completas, que son $i \cdot m$
casillas, y avanzar $j$ dentro de la fila. El $m$ que multiplica es el número
de **columnas**, no el de filas, y esa es la confusión más común: el ancho de
la fila es lo que determina cuánto hay que saltar para bajar una.

Con `int M[3][4]` en 4000, ¿dónde vive `M[2][1]`?

$$4000 + (2 \cdot 4 + 1) \cdot 4 = 4000 + 36 = 4036.$$

Las direcciones reales confirman la disposición:

```text
M[0][0] vive en 0x7ffe0b991c20
M[0][3] vive en 0x7ffe0b991c2c
M[1][0] vive en 0x7ffe0b991c30
M[2][0] vive en 0x7ffe0b991c40
```

De `M[0][3]` a `M[1][0]` hay 4 bytes: la fila 1 empieza donde termina la fila
0, sin huecos. De fila a fila hay 16, que son cuatro casillas de cuatro. En
hexadecimal la planilla completa arranca en `...c20` y las doce casillas
quedan en `c20 c24 c28 c2c` para la fila 0, `c30 c34 c38 c3c` para la fila 1
y `c40 c44 c48 c4c` para la fila 2. El salto de `c2c` a `c30` es el mismo
`+4` de siempre, solo que ahí el hexadecimal acarrea.

### Cuando el número de columnas es un símbolo

El ejercicio se puso interesante al quitarle el dato. Si de la matriz solo se
sabe que tiene $m$ columnas y empieza en 4000, las direcciones quedan en
función de $m$:

$$\text{dirección de } \texttt{M[3][4]} = 4000 + (3m + 4) \cdot 4 = 4000 + 12m + 16,$$

$$\text{dirección de } \texttt{M[2][1]} = 4000 + (2m + 1) \cdot 4 = 4000 + 8m + 4.$$

No hay forma de dar un número, y no es una limitación del método: sin conocer
el ancho de la fila la dirección no está determinada. Inventarle un valor a
$m$ sería responder otra pregunta.

De ahí salió la pregunta que cierra el punto: ¿por qué $m$ tiene que ser
mayor o igual que 5? Porque `M[3][4]` accede a la columna 4, y las columnas
se numeran desde 0. Para que la columna 4 exista tiene que haber al menos
cinco columnas; con menos, la fórmula sigue dando un número y ese número cae
en la fila de al lado. El desbordamiento en dos dimensiones no se sale de la
matriz: se mete en otra fila, y el programa no se entera.

### El mapa de la planilla

Con `int M[3][4]` en 2000, casilla por casilla:

| | col 0 | col 1 | col 2 | col 3 |
|---|---:|---:|---:|---:|
| **fila 0** | 2000 | 2004 | 2008 | 2012 |
| **fila 1** | 2016 | 2020 | 2024 | 2028 |
| **fila 2** | 2032 | 2036 | 2040 | 2044 |

Moverse a la derecha suma 4; bajar una fila suma 16, que es el bloque
completo. Las dos cifras son el mismo `sizeof(int)`, una vez sola y cuatro
veces.

### Recorrer la planilla

Un ciclo por dimensión: el externo elige la fila, el interno la recorre.

```c
int M[3][4] = {
    {10, 11, 12, 13},
    {20, 21, 22, 23},
    {30, 31, 32, 33}
};
int i, j, total;

i = 0;
while (i < 3) {
    total = 0;
    j = 0;
    while (j < 4) {
        total = total + M[i][j];
        j = j + 1;
    }
    printf("Fila %d: suma %d\n", i, total);
    i = i + 1;
}
```

```text
Fila 0: suma 46
Fila 1: suma 86
Fila 2: suma 126
```

Son los ciclos anidados independientes del análisis de complejidad: $3 \times
4$ vueltas del cuerpo, $O(n \cdot m)$ en general. Conviene no mezclar las dos
cuentas que aparecen aquí: **llegar** a una casilla cuesta $O(1)$, porque es
una multiplicación y una suma; **recorrerlas todas** cuesta $O(n \cdot m)$,
porque son $n \cdot m$ accesos.

### Sumar una columna

Para sumar la columna 2 basta un ciclo: la columna queda fija y la fila
avanza.

```c
total = 0;
i = 0;
while (i < 3) {
    total = total + M[i][2];
    i = i + 1;
}
```

Tres vueltas, y $\texttt{total} = 12 + 22 + 32 = 66$.

En la calle, esas tres casillas no son vecinas: viven en 2008, 2024 y 2040, a
16 bytes una de otra. Recorrer por filas camina la memoria en orden; recorrer
por columnas salta. Las dos versiones dan el mismo resultado y tienen la
misma complejidad, pero no el mismo tiempo real: la memoria caché trae
bloques contiguos, y un recorrido que salta desperdicia cada bloque que trae.
La diferencia llega a ser de un orden de magnitud cuando las matrices crecen.
Por eso la costumbre es recorrer primero filas y después columnas.

## La matriz del tamaño justo

La planilla real no es de $3 \times 4$: cuántos estudiantes y cuántas tareas
se sabe al ejecutar. La herramienta es la misma del manejo de memoria,
`malloc`, con una idea prestada del compilador.

!!! note "Una matriz en un solo bloque"

    Reservar $n \cdot m$ casillas seguidas y hacer a mano la cuenta del
    *row-major*: la casilla $(i, j)$ es `M[i * m + j]`.

```c
M = malloc(n * m * sizeof(int));
```

La reserva es por número de filas por número de columnas, no por una de las
dos: una matriz de $4 \times 4$ necesita 16 enteros. Y como el bloque es uno
solo, hay un solo `NULL` que revisar y un solo `free` que escribir.

```c
printf("Filas y columnas? ");
if (scanf("%d %d", &n, &m) != 2 || n <= 0 || m <= 0) {
    printf("Tamano invalido\n");
    estado = 1;
} else {
    M = malloc(n * m * sizeof(int));
    if (M == NULL) {
        printf("No hay memoria disponible\n");
        estado = 1;
    } else {
        i = 0;
        while (i < n) {
            j = 0;
            while (j < m) {
                M[i * m + j] = 10 * (i + 1) + j;
                j = j + 1;
            }
            i = i + 1;
        }
        /* ... imprimir igual, con M[i * m + j] ... */
        free(M);
        M = NULL;
    }
}
```

```text
Filas y columnas? 3 4
  10  11  12  13
  20  21  22  23
  30  31  32  33
```

Aquí se cierra el círculo del azúcar sintáctico. `M[i][j]` y `M[i * m + j]`
son la misma dirección; la primera se la calcula el compilador y la segunda
se la calcula uno. Cualquier matriz se puede manejar como un arreglo
unidimensional, porque en la memoria eso es lo único que hay: la segunda
dimensión existe en la cabeza del programador y en la sintaxis, no en el
hardware.

### La otra forma de armar una matriz

Existe una variante: un arreglo de punteros, donde cada fila pide su propio
bloque. Se escribió en clase, y lo interesante es lo que exige.

```c
int **arr;
int *ptr;

arr = malloc(rows * sizeof(int *));
if (arr == NULL) {
    printf("No hay memoria disponible\n");
    estado = 1;
} else {
    i = 0;
    while (i < rows) {
        arr[i] = malloc(cols * sizeof(int));
        ptr = arr[i];
        if (ptr != NULL) {
            j = 0;
            while (j < cols) {
                ptr[j] = 10 * (i + 1) + j;
                j = j + 1;
            }
        }
        i = i + 1;
    }
```

`arr` es un puntero a punteros. Lo que guarda son direcciones —8 bytes cada
una, porque la máquina es de 64 bits—, y cada una de esas direcciones apunta
a un arreglo de `cols` enteros. Dentro del ciclo, `ptr[j] = ...` y
`arr[i][j] = ...` escriben en la misma celda; la variable intermedia solo
evita repetir la búsqueda.

Cada `malloc` trae su verificación: la del arreglo de punteros y la de cada
fila. Son $n + 1$ reservas y $n + 1$ preguntas por `NULL`.

!!! danger "Liberar de adentro hacia afuera"

    Un `free(arr)` solo no basta. Si se libera primero el arreglo de punteros,
    las direcciones de las filas se pierden y esos $n$ bloques quedan
    reservados sin que nadie sepa dónde están: una fuga de memoria por cada
    fila. Primero se liberan las filas, después el arreglo que las contenía.

```c
    i = 0;
    while (i < rows) {
        ptr = arr[i];
        if (ptr != NULL) {
            free(ptr);
            arr[i] = NULL;
        }
        i = i + 1;
    }
    free(arr);
    arr = NULL;
}
```

```text
  10  11  12  13
  20  21  22  23
  30  31  32  33
```

El resultado es idéntico al del bloque único. Lo que cambia es el precio: la
variante de punteros permite escribir `M[i][j]` con tamaño dinámico y admite
filas de largos distintos, a cambio de $n + 1$ reservas, $n + 1$
verificaciones y una liberación en dos pasos. En el curso se usa el bloque
único, con la cuenta del *row-major* a la vista.

### Tres detalles al pasarlo en limpio

El archivo que quedó en pantalla, `bidimensional.c`, compila sin una queja con
`-Wall -Wextra` y corre sin que valgrind reporte un solo error. Aun así hay
tres cosas que conviene mirar antes de tomarlo como modelo, y ninguna de las
tres la puede ver una herramienta.

**La verificación llega después de usar el puntero.** Ahí las filas se
reservan en un ciclo y solo entonces se pregunta `if (arr != NULL)`. Si la
reserva del arreglo de punteros hubiera fallado, `arr[i] = malloc(...)` ya
habría escrito a través de un puntero nulo, y para cuando llega la pregunta el
programa ya se cayó. El orden del contrato no es decorativo: reservar,
verificar, y solo entonces usar.

**`ptr[i]` no es `ptr[j]`.** Dentro del ciclo interno, el índice que avanza es
`j`; escribir `ptr[i] = 10` usa el índice de la fila para elegir la columna.
Con tres filas y cuatro columnas la escritura cae dentro del bloque —por eso
nadie protesta—, pero solo se toca una celda por fila y las otras tres quedan
sin inicializar. Si la matriz fuera de 5 × 3, `ptr[4]` se saldría del bloque y
volvería la casa de al lado, esta vez con una escritura.

**Aterrizar la copia no aterriza el original.** En el ciclo de liberación,
`ptr` es una copia de `arr[i]`; hacerle `ptr = NULL` después del `free` deja
en `NULL` la copia y no toca `arr[i]`, que queda apuntando a memoria devuelta.
Aquí no alcanza a doler porque `arr` se libera acto seguido, pero es la
diferencia entre `ptr = NULL` y `arr[i] = NULL`, y es exactamente el puntero
colgante del manejo de memoria. La versión que aterriza `arr[i]` es la que
está arriba.

## Ejercicios de la sesión

### El mayor de la planilla, y dónde está

Encontrar el mayor valor de la matriz y en qué fila y columna vive. La
pregunta previa es qué hay que recordar mientras se recorre: el mayor visto
hasta ahora y sus dos coordenadas, que se actualizan juntos o quedan
inconsistentes.

```c
int M[3][4] = {
    {3, 9, 1, 4},
    {7, 2, 8, 5},
    {6, 0, 2, 1}
};
int mayor = M[0][0];
int fila = 0;
int columna = 0;

i = 0;
while (i < 3) {
    j = 0;
    while (j < 4) {
        if (M[i][j] > mayor) {
            mayor = M[i][j];
            fila = i;
            columna = j;
        }
        j = j + 1;
    }
    i = i + 1;
}
printf("El mayor es %d, en la fila %d y la columna %d\n",
       mayor, fila, columna);
```

```text
El mayor es 9, en la fila 0 y la columna 1
```

Es el esqueleto de buscar el mayor que ya se había usado sobre un arreglo,
ahora con dos coordenadas por recordar. La inicialización con `M[0][0]` y no
con cero importa: con una matriz de valores negativos, arrancar en cero daría
una respuesta que no está en los datos.

### Ejercicio de cierre

Un programa completo que lea $n$ y $m$, reserve una matriz de $n \times m$
enteros en un solo bloque, lea sus $n \cdot m$ valores, encuentre la fila de
mayor suma y la imprima con su índice, y devuelva la memoria. Con las
verificaciones y las tres reglas del contrato con el montículo.

## La tarea 1

Los cinco problemas quedaron publicados en la arena y se entregan el lunes 14
de septiembre a las 23:59. El enunciado de cada uno se abre desde la lista de
problemas y viene en inglés, con sus formatos de entrada y de salida. Cómo
entrar, enviar y leer los veredictos está en el
[apéndice del juez automático](../A1/Apéndice%20A.%20El%20juez%20automático.md).

La tarea es individual. Todas las entregas pasan por MOSS, el detector de
similitud de la Universidad de Stanford —el mismo tipo de herramienta que se
usa en litigios sobre código—, que compara todas contra todas y entrega un
puntaje; los casos que salen marcados se revisan uno por uno. Después corre
una segunda rutina, que busca las firmas que dejan los modelos generativos al
escribir código.

Usar un modelo para entender un problema no está prohibido y no hay nada en
contra de que se ayuden entre ustedes a entender. Copiar y pegar una solución
sí es otra cosa, y en este curso eso es lo que se penaliza.

!!! warning "Validar antes de enviar"

    Antes de enviar hay que comprobar en la máquina propia que el programa
    corre y termina. Un envío con un ciclo infinito o con una reserva que se
    come toda la memoria puede tumbar la arena para todo el grupo, y eso tiene
    consecuencias distintas a las de un veredicto negativo. Si la arena falla
    por su cuenta, eso no es culpa de nadie; si falla por un envío que nunca
    se probó, sí.

## Para practicar en casa

### Propuesto 1

Sin correrlo: ¿qué imprime? Dibuje las seis casillas y los dos punteros, y
siga las vueltas en una tabla.

```c
int A[6] = {1, 3, 5, 7, 9, 11};
int *p = A;
int *q = A + 5;
int suma = 0;

while (p < q) {
    suma = suma + *p + *q;
    p = p + 1;
    q = q - 1;
}
printf("suma = %d\n", suma);
```

### Propuesto 2

Escriba una función que invierta un arreglo en su lugar, sin arreglo
auxiliar, usando dos punteros que se acercan como los del propuesto 1.
Pruébela con largos par e impar.

```c
void invertir(int *inicio, int n);
```

### Propuesto 3

`int M[4][4]` guarda una matriz cuadrada. Escriba el recorrido que suma su
diagonal (`M[0][0]`, `M[1][1]`, …) y responda: si `M` empieza en 5000, ¿en
qué direcciones viven las casillas de la diagonal?

### Propuesto 4

Sin correrlo: ¿qué imprime? ¿Qué mide cada una de las dos restas?

```c
int A[5] = {10, 20, 30, 40, 50};
int *p = A + 4;
int *q = A + 1;

printf("%d %ld\n", *p - *q, (long) (p - q));
```

### Pistas

- **Propuesto 1**: los punteros avanzan uno hacia el otro y cada vuelta
  aporta una pareja extremo–extremo: $1 + 11$, luego $3 + 9$, luego $5 + 7$.
  Tras la tercera vuelta se cruzan y el ciclo termina, así que
  `suma = 36`.
- **Propuesto 2**: un puntero en cada extremo; intercambiar `*p` y `*q` con
  una variable auxiliar y acercarlos. El ciclo es `while (p < q)`: con largo
  impar, la casilla del centro no necesita moverse.
- **Propuesto 3**: la diagonal es `M[i][i]`, así que basta un ciclo. Con la
  fórmula, la casilla $(i, i)$ vive en $5000 + (4i + i) \cdot 4 = 5000 + 20i$:
  direcciones 5000, 5020, 5040 y 5060, a paso constante.
- **Propuesto 4**: `*p - *q` resta valores, $50 - 20 = 30$. `p - q` resta
  direcciones y da casillas: 3, no 12 bytes. La salida es `30 3`.

## Ejercicios interactivos

Dos actividades de esta sesión se pueden trabajar en el navegador: la cadena
de preguntas sobre `p + 1`, sobre un puntero que arranca en mitad del arreglo
y sobre la resta de punteros, y el cálculo de direcciones en una matriz de
$3 \times 4$ con la calle aplanada al frente:
[página de ejercicios interactivos](./Ejercicios.md).

## Código de la clase

Compilación y ejecución:

```bash
gcc -Wall -Wextra archivo.c -o archivo && ./archivo
```

`matriz_dinamica.c` lee las dimensiones de la entrada estándar:

```bash
gcc -Wall -Wextra matriz_dinamica.c -o matriz && echo "3 4" | ./matriz
```

**La aritmética de las direcciones**

- [aritmetica.c](codigo/aritmetica.c) — `A[i]` y `*(A + i)`, casilla por
  casilla
- [recorrido_puntero.c](codigo/recorrido_puntero.c) — el recorrido caminando
  el puntero, dentro de una función
- [que_imprime.c](codigo/que_imprime.c) — el ejercicio de `*p + *(p + 2)`
- [fuera_de_rango.c](codigo/fuera_de_rango.c) — la casa de al lado
- [paso.py](codigo/paso.py) — la demostración en Python del paso por
  referencia

**Arreglos bidimensionales**

- [filas_contiguas.c](codigo/filas_contiguas.c) — las direcciones reales de
  la planilla
- [suma_filas.c](codigo/suma_filas.c) — un ciclo por dimensión
- [mayor_matriz.c](codigo/mayor_matriz.c) — el mayor y su posición

**Matrices en el montículo**

- [matriz_dinamica.c](codigo/matriz_dinamica.c) — un solo bloque, con
  `M[i * m + j]`
- [bidimensional.c](codigo/bidimensional.c) — el arreglo de punteros tal como
  quedó en pantalla
- [matriz_punteros.c](codigo/matriz_punteros.c) — la misma idea con las
  verificaciones en su sitio, llenando y mostrando la planilla

**Para practicar**

- [parejas_extremos.c](codigo/parejas_extremos.c) — el propuesto 1

## Referencias

- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 3 (*Arrays*, incluidas las secciones de arreglos
  bidimensionales) y capítulo 6 (aritmética de punteros, punteros y
  arreglos, asignación dinámica de memoria).
- N. Kalicharan. *Data Structures in C*. 2008. Arreglos, punteros y memoria
  dinámica.
