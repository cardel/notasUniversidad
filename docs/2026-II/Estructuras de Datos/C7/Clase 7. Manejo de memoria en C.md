# Clase 7. Manejo de memoria en C

Viernes 28 de agosto de 2026.

Hasta ahora la pregunta era cuánto se demora un programa. La notación $O$
cerró ese capítulo: contar el costo y ponerle techo con testigos $c$ y $k$.
Queda la otra mitad de la cuenta, la que dice cuánto **ocupa**: la
complejidad espacial. Y para hablar de espacio hay que bajar a la máquina,
porque todos los ejemplos de conteo recorrían `datos[i]` sin preguntar
nunca dónde están esos datos ni qué es, físicamente, esa expresión.

Al final de la sesión el objetivo era poder explicar cómo organiza la
memoria un programa en C —direcciones, regiones y tamaños de los tipos—,
leer y escribir una variable a través de su dirección con `&` y `*`,
reservar memoria en ejecución con `malloc`, verificarla y devolverla con
`free`, y reconocer una fuga de memoria y un puntero colgante en un
programa ajeno.

## Diapositivas

![](clase07.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## El servidor cansado

Un servidor de la universidad lleva tres semanas prendido. Cada día
responde más lento, y hoy por la mañana dejó de responder. Se reinicia y
vuelve a andar perfecto. Nadie cambió el código.

¿Qué se estaba agotando?

La respuesta llega al final de la clase, pero el chiste vale desde ya: al
ingeniero de sistemas se le acusa de contestar siempre lo mismo, «reinicie».
Reiniciar funciona porque la gestión de memoria de los programas no es
perfecta, y el sistema recupera de golpe todo lo que el proceso pidió y no
devolvió. No es que la máquina se canse; es que los recursos se acaban.

## La memoria por dentro

!!! note "Definición (Thareja, sección 6.1)"

    La memoria principal es una secuencia de celdas de un byte. Cada celda
    tiene un número que la identifica, su **dirección**. Las direcciones
    son consecutivas: $0, 1, 2, \ldots$

Una ciudad con una sola calle larguísima: cada casa guarda un byte y tiene
su número. Los 16 GB de RAM de un portátil son una hilera de esas casas, y
en cada una cabe exactamente un byte —ocho bits— y nada más.

En clase las direcciones se inventan pequeñas y redondas (1000, 1004) para
que la traza se pueda seguir. La máquina real las escribe en hexadecimal,
base 16: los dígitos van del `0` al `9` y siguen de la `a` a la `f`, así
que `fa`, `1e` o `7f` son valores válidos. Dos dígitos hexadecimales
describen exactamente un byte, y por eso la base 16 es la forma cómoda de
mirar memoria: cada dígito corresponde a cuatro bits.

### Ocho bits por celda

Un byte tiene ocho bits, de `00000000` a `11111111`. Son $2^8 = 256$
combinaciones. Cómo se leen esas combinaciones depende del tipo: un
`unsigned char` las interpreta como $0$ a $255$, y un `signed char` como
$-128$ a $127$. La misma celda, dos lecturas distintas.

Un `int` ocupa cuatro celdas seguidas, o sea 32 bits. La relación es la
que se usa todo el semestre:

$$1 \text{ byte} = 8 \text{ bits}, \qquad 32 \text{ bits} = 4 \text{ bytes}.$$

### `sizeof` responde en bytes

```c
printf("int:    %zu bytes\n", sizeof(int));
printf("double: %zu bytes\n", sizeof(double));
printf("int *:  %zu bytes\n", sizeof(int *));
```

En la máquina del curso:

| Tipo | Bits | Bytes |
|---|---:|---:|
| `char` | 8 | 1 |
| `int` | 32 | 4 |
| `float` | 32 | 4 |
| `long` | 64 | 8 |
| `long long` | 64 | 8 |
| `double` | 64 | 8 |
| `int *` | 64 | 8 |

Las dos últimas filas son las interesantes. `double` ocupa el doble que
`int` porque necesita más bits para la parte decimal. Y `int *` no guarda
un número: guarda una **dirección de memoria**. Como el procesador es de
64 bits, una dirección son 64 bits, es decir 8 bytes; en un procesador de
32 bits ocuparía 4. El tamaño del puntero no depende de a qué apunte,
sino de qué tan grande es el espacio de direcciones de la máquina.

Los tamaños no son un dato de adorno: cuando aparezcan los problemas de
desborde, la pregunta «¿cuántos bytes almacena esto?» va a decidir si un
programa da la respuesta correcta o un número negativo absurdo.

### La aritmética de un arreglo

`int A[5]` empieza en la dirección 2000. Como cada casilla ocupa 4 bytes y
van pegadas:

| Casilla | `A[0]` | `A[1]` | `A[2]` | `A[3]` | `A[4]` |
|---|---:|---:|---:|---:|---:|
| Dirección | 2000 | 2004 | 2008 | 2012 | 2016 |

$$\text{dirección de } \texttt{A[i]} = 2000 + 4\,i
= \text{base} + \texttt{sizeof(int)} \cdot i.$$

De aquí salen dos cosas que se venían usando sin justificar.

**Por qué se indexa desde 0.** El primer elemento está en el inicio mismo
del bloque, y con $i = 0$ la fórmula da $2000 + 4 \cdot 0 = 2000$: la
dirección base, sin corrección. Indexar desde 1 obligaría a restar uno en
cada acceso. El 0 no es una manía de los lenguajes; es el desplazamiento
real desde el comienzo del arreglo.

**Por qué `A[i]` cuesta $O(1)$.** Llegar a `A[3]` es una multiplicación y
una suma, no un recorrido. Da lo mismo $i = 0$ que $i = 999$: son las
mismas dos operaciones elementales. La cuenta de las clases de complejidad
tiene aquí su porqué.

### La máquina real

El mismo experimento, preguntándole al programa dónde puso cada cosa. El
formato `%p` imprime direcciones:

```c
int x = 42;
int y = 7;
int A[3] = {10, 20, 30};

printf("x vale %d y vive en %p\n", x, (void *) &x);
```

Una corrida:

```text
x vale 42 y vive en 0x7ffed70e6c50
y vale 7 y vive en 0x7ffed70e6c54
A[0] vale 10 y vive en 0x7ffed70e6c5c
A[1] vale 20 y vive en 0x7ffed70e6c60
A[2] vale 30 y vive en 0x7ffed70e6c64
```

Las direcciones se leen en hexadecimal y las distancias se confirman
contando: de `c5c` a `c60` hay cuatro bytes (`c5c`, `c5d`, `c5e`, `c5f`),
y de `c60` a `c64` otros cuatro. El arreglo quedó continuo, casilla contra
casilla, que es justamente lo que permite calcular la dirección en vez de
buscarla.

Otra corrida da otras direcciones. El sistema ubica al proceso donde
quiera dentro de la RAM —al lado del kernel, del navegador con veinte
pestañas o de lo que esté corriendo—, y el programa solo administra la
porción que le prestaron. Lo que nunca cambia son las distancias
relativas.

## Dónde vive cada variable

La memoria del proceso no es un bloque uniforme. Se reparte en regiones,
y saber en cuál cae cada variable explica casi todos los errores del
resto del semestre.

!!! note "El mapa (Thareja, capítulo 6)"

    La memoria de un programa en ejecución se reparte en el **código**,
    los **datos globales**, la **pila** (locales de cada función) y el
    **montículo** o *heap* (memoria pedida en ejecución).

| Región | Qué guarda | Dirección |
|---|---|---|
| pila | locales de cada función, crece hacia abajo | altas |
| libre | el espacio que se disputan pila y montículo | |
| montículo (*heap*) | lo pedido con `malloc`, crece hacia arriba | |
| datos globales | variables globales y estáticas | |
| código | las instrucciones del programa | bajas |

Que el código comparta memoria con los datos no es un accidente: es el
modelo de von Neumann, en el que programa y datos viven en el mismo
almacenamiento. Se puede comprobar. Un ejecutable compilado, mirado con
`objdump` o con un volcado hexadecimal, es una secuencia de bytes como
cualquier otra:

```text
7f 45 4c 46 02 01 01 00 ...
```

Cada uno de esos bytes se carga en una celda y cada grupo es una
instrucción. El `45` que se lee ahí son los bits `0100 0101`; el `7f`,
`0111 1111`. Lo que el procesador ejecuta y lo que el programa manipula
están hechos de lo mismo.

### Una variable de cada región

```c
#include <stdio.h>
#include <stdlib.h>

int global = 5;

int main(void) {
    int local = 10;
    int *dinamico;
    int estado = 0;

    dinamico = malloc(sizeof(int));
    if (dinamico == NULL) {
        printf("No hay memoria disponible\n");
        estado = 1;
    } else {
        *dinamico = 15;
        printf("global:   %d en %p\n", global, (void *) &global);
        printf("local:    %d en %p\n", local, (void *) &local);
        printf("dinamico: %d en %p\n", *dinamico, (void *) dinamico);
        free(dinamico);
        dinamico = NULL;
    }
    return estado;
}
```

```text
global:   5 en 0x564e1c944038
local:    10 en 0x7ffed4709dc8
dinamico: 15 en 0x564e58e36010
```

| Variable | Región | Dirección |
|---|---|---|
| `global` | datos globales | `0x564e1c94...` |
| `local` | pila | `0x7ffed470...` |
| el `int` nuevo | montículo | `0x564e58e3...` |

Tres barrios distintos de la ciudad, y se distinguen a simple vista por el
prefijo: las dos que arrancan en `0x56` están abajo, cerca del código y
los datos globales; la de la pila arranca en `0x7f`, arriba del todo. La
diferencia entre un `5` y un `7` en el tercer dígito son terabytes de
distancia en el espacio de direcciones.

### La pila respira

Cada llamada a una función apila un **marco** con sus variables locales, y
el retorno lo desapila. Si `main` llama a `saludar`:

| Momento | Contenido de la pila |
|---|---|
| antes de llamar | `main`: `x`, `n` |
| durante `saludar` | `main`: `x`, `n` — `saludar`: `veces` |
| después del retorno | `main`: `x`, `n` |

La pila atiende siempre al último que llegó, que es la disciplina LIFO
que más adelante tendrá su propio TAD. La consecuencia práctica: `veces`
nace al entrar a `saludar` y muere al retornar, y su celda se reutiliza en
la siguiente llamada. Por eso una función no puede dejarle a otra un dato
en una variable local. Guardar algo que sobreviva a la función pide otra
región, y esa región es el montículo.

## La dirección como valor

!!! note "Definición (Thareja, capítulo 6)"

    Para una variable `v`, la expresión `&v` es la dirección donde `v`
    vive. Se lee «la dirección de `v`».

Esto ya se venía usando sin explicación:

```c
scanf("%d", &n);
```

`scanf` no recibe a `n`; recibe su dirección. Y tiene que ser así: la
función necesita escribir el valor leído en las celdas de `n`, y para
escribir en una celda hay que saber cuál es. Pasarle `n` le daría una
copia del valor, que se perdería al retornar. El `&` de las primeras
clases era exactamente esto.

Si una dirección es un valor, se puede guardar en una variable. ¿De qué
tipo?

!!! note "Definición (Thareja, capítulo 6)"

    Un **puntero** es una variable cuyo valor es la dirección de otra
    variable. `int *p` declara un puntero a `int`: `p` guarda la dirección
    de un entero.

```c
int x = 7;
int *p = &x;   /* p guarda la direccion de x */
```

Con `x` viviendo en 1000 y `p` en 2000, el contenido de `p` es el número
1000. `p` es una variable como cualquier otra: ocupa sus celdas y tiene su
propia dirección. Lo que cambia es cómo se lee su valor.

La expresión `*p` se lee «lo que hay donde apunta `p`», y a esa operación
se le llama **desreferenciar**. Leer `*p` da 7; asignar `*p = 9` cambia a
`x` sin nombrarla. El puntero es un segundo nombre para la misma celda.

Una cosa es el valor de una variable y otra dónde vive. La confusión entre
las dos es el origen de casi todo lo que sale mal en este tema.

### ¿Qué imprime?

```c
int x = 3;
int y = 8;
int *p;

p = &x;         /* p guarda la direccion de x */
*p = 7;         /* escribe a traves de p */
p = &y;         /* p ahora apunta a y */
*p = *p + 1;

printf("x = %d, y = %d\n", x, y);
```

Con `x` en 1000 y `y` en 1004, una fila por línea:

| Línea | `x` | `y` | `p` |
|---|---:|---:|---:|
| declaraciones | 3 | 8 | ? |
| `p = &x;` | 3 | 8 | 1000 |
| `*p = 7;` | 7 | 8 | 1000 |
| `p = &y;` | 7 | 8 | 1004 |
| `*p = *p + 1;` | 7 | 9 | 1004 |

```text
x = 7, y = 9
```

Tras `p = &y`, el mismo `*p` habla de otra variable. Qué toca `*p` no lo
decide el texto del programa sino el valor de `p` en ese momento.

Al imprimir se ve la distinción de una vez. Agregando dos líneas al final
del programa:

```c
printf("p %p", p);
printf("*p %d", *p);
```

```text
x = 7, y = 9
p 0x7fffc0d36dac*p 9
```

El primer `printf` saca la dirección donde vive `y`; el segundo, el 9 que
hay guardado ahí. Dos cosas distintas del mismo puntero. El formato
importa: `%d` sobre un puntero no compila limpio, porque un puntero no es
un entero de cuatro bytes; el que corresponde es `%p`.

### ¿Y si no se inicializa?

```c
#include "stdio.h"

int main() {
  int *p;
  printf("%p\n", p);
  *p = 10;
}
```

El compilador lo ve venir:

```text
Malo.cpp: In function 'int main()':
warning: 'p' is used uninitialized [-Wuninitialized]
    5 |   printf("%p\n", p);
      |   ~~~~~~^~~~~~~~~~~
```

Y al ejecutar:

```text
Segmentation fault (core dumped)
```

`p` contiene basura, así que la escritura cae en una dirección cualquiera.
Un fallo de segmentación es el sistema avisando que el programa metió las
narices donde no debe: es la señal inequívoca de un manejo incorrecto de
memoria. Lo incómodo es que no siempre llega. A veces el programa corrompe
un dato que sí le pertenece y falla mucho después, lejos del error, y ahí
la depuración se vuelve una cacería.

Además, esto no es un error de sintaxis. El programa está bien escrito
según la gramática de C; lo que está mal es lo que significa.

!!! warning "Regla de la casa"

    Todo puntero nace apuntando a algo concreto o a `NULL`, la dirección
    «a ninguna parte». Un puntero declarado y sin asignar no se usa. Por
    eso se compila siempre con `-Wall -Wextra`: ese aviso es el error
    anunciado con antelación.

## Memoria en ejecución

Un programa va a leer las temperaturas de la semana. ¿De cuántos días?
Eso lo decide quien lo ejecuta, no quien lo escribe.

```c
int datos[1000];   /* y si son 20? y si son 5000? */
```

Con 20 valores sobran 980 casillas reservadas en vano. Con 5000, el
programa no tiene dónde ponerlos. El arreglo de la pila exige decidir el
tamaño al escribir el programa, y el problema lo decide al correr. Se
necesita pedir memoria **durante** la ejecución, del tamaño exacto. Para
eso existe el montículo.

!!! note "Definición (Thareja, capítulo 6)"

    `malloc(k)` reserva un bloque de `k` bytes en el montículo y devuelve
    su dirección; si no hay memoria, devuelve `NULL`. `free(p)` devuelve
    el bloque que empieza en `p`. El bloque vive hasta su `free`, sin
    importar en qué función se pidió.

```c
datos = malloc(n * sizeof(int));   /* n enteros */
```

El tamaño se escribe con `sizeof` y no con el número pelado: $n$ enteros
son `n * sizeof(int)` bytes, que en esta máquina son $4n$. Escribir el 4 a
mano funciona hasta que el código se compila en otra parte.

La primera pregunta después de todo `malloc` es si devolvió `NULL`. Y
`calloc(n, sizeof(int))` hace lo mismo con una diferencia: deja el bloque
en ceros. `malloc` reserva pero no borra, así que el bloque recién pedido
contiene lo que hubiera antes.

### El arreglo del tamaño justo

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 0;
    int *datos;
    int i;
    int estado = 0;

    printf("Cuantos valores? ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Cantidad invalida\n");
        estado = 1;
    } else {
        datos = malloc(n * sizeof(int));
        if (datos == NULL) {
            printf("No hay memoria disponible\n");
            estado = 1;
        } else {
            i = 0;
            while (i < n) {
                datos[i] = i * i;
                i = i + 1;
            }
            i = 0;
            while (i < n) {
                printf("datos[%d] = %d\n", i, datos[i]);
                i = i + 1;
            }
            free(datos);
            datos = NULL;
        }
    }
    return estado;
}
```

```text
Cuantos valores? 4
datos[0] = 0
datos[1] = 1
datos[2] = 4
datos[3] = 9
```

Dos verificaciones antes de tocar el bloque: que la cantidad leída sea
válida y que la reserva haya llegado.

Lo notable es que el bloque se usa con la misma notación de siempre.
`datos[i]` es azúcar sintáctico: el compilador lo traduce a
`*(datos + i)`, que en bytes es la dirección guardada en `datos` más
`i * sizeof(int)`. Es la fórmula del arreglo estático, con la base ahora
en el montículo en vez de la pila. Por eso un bloque de `malloc` se
recorre, se indexa y se pasa a funciones exactamente igual que un arreglo.

Las dos formas se pueden escribir una al lado de la otra y hacen lo
mismo:

```c
scanf("%lf", &temperaturas[i]);
scanf("%lf", temperaturas + i);

suma = suma + temperaturas[i];
suma = suma + *(temperaturas + i);
```

En la primera pareja, `&temperaturas[i]` y `temperaturas + i` son la
misma dirección. En la segunda, los corchetes y el asterisco leen la misma
celda. La notación de arreglo es la cómoda; la de puntero es la que
explica por qué funciona.

### La traza en el mapa

Con $n = 4$:

| Momento | Pila | Montículo |
|---|---|---|
| antes de `malloc` | `n = 4`, `datos = ?` | vacío |
| después de `malloc` | `n = 4`, `datos = 5000` | bloque de 16 bytes en 5000 |
| después de `free` | `n = 4`, `datos = NULL` | bloque devuelto |

`datos` vive en la pila y guarda 16 bytes de datos que están en otra
región. La variable nunca almacena los valores: almacena la dirección
donde están. El puntero es el hilo que une las dos regiones, y si se
suelta el hilo, el bloque queda inalcanzable.

`free` devuelve el bloque pero no toca a `datos`, que sigue guardando la
dirección vieja. Por eso se asigna `NULL` a mano, en la línea siguiente.

Esto es, palabra por palabra, lo que hace automáticamente el *garbage
collector* de Java o de Python: detectar los bloques que ya nadie apunta y
recuperarlos. La comodidad se paga: el recolector es un programa corriendo
en segundo plano, con su costo en rendimiento. En C no hay recolector, y
la limpieza corre por cuenta de quien escribe el código.

En C++ existe `delete`, que se usa con la memoria pedida con `new`:
libera el bloque y llama al destructor del objeto. Lo que **no** hace es
aterrizar el puntero, así que la asignación `p = nullptr` sigue siendo
responsabilidad del programa. Y las dos parejas no se mezclan: lo pedido
con `malloc` se devuelve con `free`, y lo pedido con `new` se devuelve con
`delete`.

## Lo que sale mal

### El servidor, resuelto

El código del servidor hacía, en esencia, esto por cada solicitud:

```c
while (i < 1000) {
    int *pedido = malloc(250 * sizeof(int));
    if (pedido != NULL) {
        pedido[0] = i;
        atendidas = atendidas + 1;
    }
    i = i + 1;   /* el bloque queda reservado para siempre */
}
```

!!! danger "Fuga de memoria"

    En cada vuelta, `pedido` se sobreescribe y la dirección del bloque
    anterior se pierde. Ese bloque no se puede liberar nunca, porque ya no
    hay manera de nombrarlo. El montículo se llena poco a poco, el
    programa se arrastra y al final `malloc` empieza a devolver `NULL`.

Eso era lo que se agotaba. Reiniciar lo «cura» porque el sistema recupera
toda la memoria del proceso cuando muere, y el arreglo de verdad son dos
líneas dentro del ciclo:

```c
free(pedido);
pedido = NULL;
```

Vale la pena resistir la tentación de pensar que esto le pasa solo al
código de uno. Buena parte del software que se usa a diario tiene fugas;
por eso reiniciar sigue siendo un consejo que funciona.

### El puntero colgante

El error simétrico: devolver el bloque y seguirlo usando.

```c
p = malloc(sizeof(int));
if (p == NULL) {
    estado = 1;
} else {
    *p = 42;
    free(p);
    printf("%d\n", *p);   /* la memoria ya no es nuestra */
}
```

```text
warning: pointer 'p' used after 'free' [-Wuse-after-free]
```

!!! danger "Puntero colgante"

    Después de `free(p)`, la dirección guardada en `p` apunta a memoria
    que ya no es del programa: puede haberse entregado a otro `malloc`.
    Leerla o escribirla es comportamiento indefinido, el mismo veneno del
    puntero sin inicializar.

### Las tres reglas

!!! note "El contrato con el montículo"

    1. A todo `malloc` se le pregunta si devolvió `NULL` antes de usar el
       bloque.
    2. Todo `malloc` tiene su `free`: quien pide, devuelve.
    3. Después de `free(p)` se asigna `p = NULL`: un puntero a ninguna
       parte es mejor que un puntero a memoria ajena.

Las tres aparecen juntas en cada ejemplo del curso de aquí en adelante.
Cuando lleguen las listas enlazadas, serán el esqueleto de `crear` y
`destruir`.

## Ejercicios de la sesión

### Copiar valores no es copiar direcciones

```c
int a = 10;
int b = 20;
int *p = &a;
int *q = &b;

*p = *q;
q = p;
*q = 30;

printf("a = %d, b = %d\n", a, b);
```

Con `a` en 1000 y `b` en 1004:

| Línea | `a` | `b` | `p` | `q` |
|---|---:|---:|---:|---:|
| declaraciones | 10 | 20 | 1000 | 1004 |
| `*p = *q;` | 20 | 20 | 1000 | 1004 |
| `q = p;` | 20 | 20 | 1000 | 1000 |
| `*q = 30;` | 30 | 20 | 1000 | 1000 |

```text
a = 30, b = 20
```

Las dos asignaciones se parecen y hacen cosas opuestas. `*p = *q` copia el
**valor**: el 20 viaja a la celda de `a` y los punteros no se mueven.
`q = p` copia la **dirección**: desde esa línea los dos punteros hablan de
`a`, y `b` queda fuera del juego. La pregunta de cierre —¿en qué línea se
perdió el acceso a `b`?— tiene una respuesta exacta: en `q = p`, donde se
pisó la única copia de la dirección de `b` que quedaba.

### Dos errores que el compilador no ve

```c
int *a = malloc(n * sizeof(int));
int *b = malloc(n * sizeof(int));

a[0] = 1;
b[0] = 2;
b = malloc(2 * n * sizeof(int));
b[0] = 3;

free(a);
free(b);
```

Compila sin un solo aviso, y rompe dos de las tres reglas.

Ninguno de los tres `malloc` se pregunta por `NULL`, así que la escritura
`a[0] = 1` puede caer en ninguna parte. Y el segundo `malloc` sobre `b`
pisa la única dirección del bloque anterior: ese bloque queda sin dueño y
su `free` ya no existe. Es la fuga del servidor en miniatura. Los dos
`free` del final alcanzan dos de los tres bloques pedidos.

El arreglo se escribió en clase línea por línea: cada escritura se
protege con su verificación, y el bloque viejo de `b` se libera antes de
reasignar el puntero.

```c
int n = 100;
int *a = malloc(n * sizeof(int));
int *b = malloc(n * sizeof(int));

if (a != NULL) {
    a[0] = 1;
}

if (b != NULL) {
    b[0] = 2;
}

free(b);
b = NULL;

b = malloc(2 * n * sizeof(int));

if (b != NULL) {
    b[0] = 3;
}

free(a);
free(b);
a = NULL;
b = NULL;
```

El orden del tramo del medio es el que hace toda la diferencia: primero
`free(b)`, después el `malloc` nuevo. Al revés, la dirección del primer
bloque se pierde en la asignación y ya no hay a quién liberarle nada.

Y toda liberación arrastra su `= NULL`. Las tres reglas no se aplican por
separado: se aplican las tres a cada bloque.

### Ejercicio de cierre: las temperaturas

Escriba un programa completo que lea una cantidad $n$, reserve espacio
para $n$ temperaturas, las lea, calcule el promedio, cuente cuántas lo
superan e imprima ambos resultados devolviendo la memoria.

La primera decisión es el tipo. El enunciado dice temperaturas y no dice
más, pero una temperatura tiene decimales, así que el bloque se pide con
`sizeof(double)` y no con `sizeof(int)`. Eso arrastra los formatos: `%lf`
para leer un `double` con `scanf`, y `%.4lf` para imprimirlo.

```c
#include <stdio.h>
#include <stdlib.h>

int main() {

  int n;
  scanf("%d", &n);
  double *temperaturas = malloc(n * sizeof(double));
  // double temperaturas[n]; // C99 lo permite, pero queda en la pila
  if (temperaturas != NULL) {
    for (int i = 0; i < n; i++) {
      scanf("%lf", &temperaturas[i]);
      // scanf("%lf", temperaturas + i); // otra forma de hacerlo
    }
    double promedio = 0.0;
    for (int i = 0; i < n; i++) {
      promedio += temperaturas[i];
      // promedio += *(temperaturas + i); // otra forma de hacerlo
    }
    promedio /= n;
    int mayores_promedio = 0;
    for (int i = 0; i < n; i++) {
      if (temperaturas[i] > promedio) {
        mayores_promedio++;
      }
    }
    printf("Promedio: %.4lf\n", promedio);
    printf("Cantidad de temperaturas mayores al promedio: %d\n",
           mayores_promedio);
    free(temperaturas);
    temperaturas = NULL;
  } else {
    printf("Error al asignar memoria\n");
  }
}
```

Con las diez temperaturas del archivo de prueba:

```text
Promedio: 6.0300
Cantidad de temperaturas mayores al promedio: 5
```

La línea comentada merece atención, porque es la tentación obvia:
`double temperaturas[n]` compila en C desde el estándar de 1999, y a
primera vista ahorra el `malloc` entero. El problema es dónde queda ese
arreglo. Un arreglo declarado así vive en la pila, que es la región
pequeña y que además se recupera al salir de la función; si el usuario
escribe un $n$ grande, no hay `NULL` que avise, simplemente el programa
se cae. El montículo es más grande, avisa cuando no puede, y el bloque
sobrevive a la función que lo pidió. Para un tamaño que llega de la
entrada, la reserva dinámica es la respuesta.

Queda la pregunta que acompaña al ejercicio: ¿por qué este problema no se
puede resolver leyendo los valores de a uno, sin guardarlos? Porque
comparar cada temperatura contra el promedio exige conocer el promedio, y
el promedio solo se sabe después de haber leído la última. El primer dato
hay que volverlo a mirar cuando ya se leyó el último, y eso obliga a
tenerlos todos. Es el argumento que va a justificar, una y otra vez,
guardar en memoria en lugar de procesar al vuelo.

Sobre el recorrido: son tres pasadas sobre el arreglo, una para leer,
otra para sumar y otra para contar. Las dos primeras se podrían fundir en
una sola, sumando a medida que se lee. Da igual para la clase de
complejidad: tres recorridos de $n$ son $3n$ operaciones y eso sigue
siendo $O(n)$, porque el número de pasadas es una constante y las
constantes las absorbe el testigo $c$.

## Para practicar en casa

### Propuesto 1

Escriba un programa que lea $n$, reserve un arreglo de $n$ enteros, lo
llene con los primeros $n$ impares ($1, 3, 5, \ldots$) y lo imprima de la
última posición a la primera, con verificaciones y `free`.

Pista: el impar $i$-ésimo es $2i + 1$. El esqueleto es el del arreglo del
tamaño justo; solo cambian el llenado y el sentido del recorrido de
impresión.

### Propuesto 2

Este fragmento compila sin avisos y aun así tiene un error de memoria.
¿Cuál es y en qué línea nace?

```c
int *mayores = malloc(n * sizeof(int));
int *todos = malloc(2 * n * sizeof(int));
if (mayores == NULL || todos == NULL) {
    estado = 1;
} else {
    /* ... se usan ambos arreglos ... */
    mayores = todos;
    free(mayores);
    free(todos);
}
```

Pista: cuente los `malloc` y los `free` de cada bloque. La asignación
`mayores = todos` pierde la única dirección del primer bloque, y los dos
`free` llegan al mismo bloque. Liberar dos veces es tan grave como usar
después de liberar.

### Propuesto 3

Sobre el fragmento de los dos errores: si en el examen aparece el mismo
código con líneas en blanco donde falta algo, ¿qué escribiría en cada una?
Es la pregunta que se anunció en clase, y se contesta con las tres reglas
en la mano.

## Ejercicios interactivos

Tres actividades de esta sesión se pueden trabajar en el navegador, con
predicción y ejecución paso a paso: la traza del puntero que se muda de
una variable a otra, el ejercicio de `a`, `b`, `p` y `q`, y la caza de los
dos errores de memoria:
[página de ejercicios interactivos](./Ejercicios.md).

## Código de la clase

Compilación y ejecución:

```bash
gcc -Wall -Wextra archivo.c -o archivo && ./archivo
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

El ejercicio de cierre lee de la entrada estándar, así que el archivo de
prueba se le pasa directo:

```bash
gcc -Wall -Wextra EjercicioCierre.c -o cierre && ./cierre < ejercicioCierre.in
```

**La memoria por dentro**

- [tamanos.c](codigo/tamanos.c)
- [tamanos_todos.c](codigo/tamanos_todos.c)
- [direcciones.c](codigo/direcciones.c)
- [segmentos.c](codigo/segmentos.c)

**Punteros**

- [punteros.c](codigo/punteros.c)
- [Ejemplo.cpp](codigo/Ejemplo.cpp) — el mismo programa, con los `printf`
  de `p` y de `*p` que se agregaron en clase
- [dos_punteros.c](codigo/dos_punteros.c)
- [sin_inicializar.c](codigo/sin_inicializar.c)
- [Malo.cpp](codigo/Malo.cpp) — el puntero sin inicializar

**Montículo**

- [arreglo_dinamico.c](codigo/arreglo_dinamico.c)
- [EjercicioCierre.c](codigo/EjercicioCierre.c),
  [ejercicioCierre.in](codigo/ejercicioCierre.in) — el ejercicio de cierre

**Lo que sale mal**

- [fuga.c](codigo/fuga.c)
- [colgante.c](codigo/colgante.c)
- [errores_ejercicio.c](codigo/errores_ejercicio.c) — el fragmento con los
  dos errores
- [Ejercicio2.c](codigo/Ejercicio2.c) — la versión que se corrigió en clase

## Referencias

- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 6: sección 6.1, introducción a punteros y asignación dinámica
  de memoria.
- N. Kalicharan. *Data Structures in C*. 2008. Uso de `malloc`, `sizeof`
  y `free`.
