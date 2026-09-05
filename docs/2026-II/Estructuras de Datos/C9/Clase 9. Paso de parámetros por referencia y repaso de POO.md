# Clase 9. Paso de parámetros por referencia y repaso de POO

Viernes 4 de septiembre de 2026.

Los arreglos dejaron una pregunta abierta. En `suma(A, 5)` viajó una
dirección y no una copia del arreglo, y por eso la función necesitó que le
dijeran `n`. Si el arreglo viaja como dirección, ¿qué viaja cuando el
argumento es un `int` suelto? La respuesta ordena tres cosas de una vez:
explica el misterio del `&` en `scanf`, decide qué puede y qué no puede
hacer una función con las variables de quien la llamó, y prepara la forma en
que se mueven los objetos. Al final la sesión gira la pregunta: si lo que
viaja es una copia de 4 bytes, ¿qué cabe exactamente en esos 4 bytes?

Al final de la sesión el objetivo era poder explicar qué recibe una función
según el modo de paso —una copia, una dirección o un alias—, escribir
funciones que modifican variables del llamador con punteros en C y
referencias en C++, devolver más de un resultado por parámetros de salida,
reconstruir las piezas de una clase y pasar objetos por referencia, y
deducir el rango de un tipo a partir de sus bits.

## Diapositivas

![](clase09.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## La fila de mayor suma

La sesión abrió resolviendo en pantalla el ejercicio que había quedado: leer
$n$ y $m$, reservar una matriz de $n \times m$ enteros, leer sus valores,
encontrar la fila cuya suma es mayor, imprimirla con su índice y devolver la
memoria. Se escribió dos veces, con las dos formas de armar la matriz que ya
se habían visto.

### La matriz en un solo bloque

```c
void forma1(int n, int m) {
    int *arr = malloc(n * m * sizeof(int));

    if (arr != NULL) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                scanf("%d", &arr[i * m + j]);
            }
        }
        ...
    }
}
```

Las dos escrituras de la casilla siguen siendo la misma cuenta, y en la
lectura conviven sin problema:

```c
scanf("%d", &arr[i * m + j]);   /* la direccion de la casilla */
scanf("%d", arr + i * m + j);   /* la misma direccion, sin corchete */
```

En la segunda no hace falta `&`: `arr + i * m + j` ya *es* una dirección.
Ese fue el punto de la sesión anterior, ahora usado sin ceremonia.

### Por qué la suma no arranca en cero

La primera decisión del recorrido no es la del ciclo, es la del valor
inicial:

```c
int suma = 0;
int fila = 0;

for (int j = 0; j < m; j++) {
    suma += arr[0 * m + j];
}
for (int i = 1; i < n; i++) {
    int suma_fila = 0;
    ...
}
```

Se suma primero la fila 0 completa y el recorrido arranca en la fila 1. La
razón es que los valores pueden ser negativos: si el máximo se inicializa en
cero y todas las filas suman negativo, la respuesta sería un cero que no
está en los datos. La alternativa —arrancar en menos infinito— no existe
para un `int`, que tiene un mínimo concreto. Tomar el primer elemento y
comparar contra el resto sirve igual para el máximo y para el mínimo, y es
el mismo esqueleto que ya se había usado sobre un arreglo de una dimensión.

### La segunda forma: un arreglo de punteros

```c
void forma2(int n, int m) {
    int **arr = malloc(n * sizeof(int *));

    if (arr != NULL) {
        for (int i = 0; i < n; i++) {
            arr[i] = malloc(m * sizeof(int));
            ...
        }
    }
}
```

Aquí `arr` no guarda enteros: guarda $n$ direcciones, y cada una apunta a
una fila de $m$ enteros. Un arreglo bidimensional visto así es una colección
de arreglos de una dimensión. La lectura cambia de forma, aunque el destino
sea el mismo:

```c
scanf("%d", &arr[i][j]);        /* con doble indice */
scanf("%d", *(arr + i) + j);    /* la misma casilla, en direcciones */
```

La expresión `*(arr + i) + j` se lee de adentro hacia afuera. `arr + i` es
dónde vive el puntero de la fila $i$; el `*` saca ese puntero, que es la
dirección donde empieza la fila; y `+ j` avanza $j$ casillas dentro de ella.
Son dos saltos, no uno, y esa es toda la diferencia con `arr + i * m + j`,
que llega a la casilla con una sola cuenta sobre un bloque continuo.

Al leer el valor, el paréntesis vuelve a abrirse:

```c
suma_fila += *(*(arr + i) + j);
```

El primer `*` saca el puntero de la fila; el segundo saca el entero.

### Cuál de las dos usar

Las dos entregan el mismo resultado y ninguna es más rápida de forma
apreciable. La diferencia está en lo que permiten:

- El bloque único obliga a que todas las filas midan $m$. Es un solo
  `malloc` y un solo `free`, y no hay forma de que quede armado a medias.
- El arreglo de punteros pide una fila a la vez, así que cada una puede
  tener un tamaño distinto. El precio es que la construcción puede fallar en
  la mitad, con unas filas ya reservadas y otras no.

### Lo que mide un puntero

En `malloc(n * sizeof(int *))` el `sizeof` no es 4:

| Tipo | `sizeof` |
|---|---:|
| `char` | 1 |
| `int` | 4 |
| `char *` | 8 |
| `int *` | 8 |
| `int **` | 8 |

Todos los punteros miden lo mismo, sin importar a qué apunten, porque lo que
guardan es una dirección y el procesador es de 64 bits. El tipo apuntado
decide cuánto avanza `p + 1`; no decide cuánto ocupa `p`.

De ahí sale el límite de memoria de una máquina: con direcciones de 32 bits
solo se pueden nombrar $2^{32}$ bytes, es decir 4 GB, y los sistemas de
entonces reservaban la mitad para el núcleo, con lo que a un programa le
quedaban unos 2 GB por más memoria que tuviera instalada el equipo. Con 64
bits el techo deja de ser el problema.

### Una entrada de prueba en un archivo

Para probar el programa con una matriz de $10 \times 10$ no se escribieron
cien números a mano. Se dejaron en un archivo y se le entregaron al programa
por la entrada estándar:

```bash
gcc -Wall -Wextra fila_mayor.c -o fila_mayor
./fila_mayor < fila_mayor.in
```

```text
La fila de mayor suma es 5 y su valor es 154
La fila de mayor suma es 5 y su valor es 154
```

Es exactamente el flujo de trabajo de la arena. Cada problema publica una
entrada y una salida de ejemplo; lo primero que conviene hacer es guardarlas
en dos archivos, correr la solución sobre la primera y comparar con la
segunda:

```bash
./solucion < entrada.txt > mi_salida.txt
diff mi_salida.txt salida_esperada.txt
```

Si `diff` no imprime nada, las dos salidas son idénticas. No garantiza que
el problema esté resuelto —los casos de prueba reales son otros—, pero un
programa que falla el ejemplo del enunciado no tiene por qué enviarse.

### Salir a mitad de camino deja memoria reservada

En la versión con punteros, cuando una fila no se puede reservar, la salida
inmediata es lo primero que uno escribe:

```c
arr[i] = malloc(m * sizeof(int));
if (arr[i] != NULL) {
    ...
} else {
    printf("Error al asignar la fila %d\n", i);
    return;
}
```

El mensaje está bien y la intención también, pero el `return` se va con las
filas anteriores todavía reservadas y con el arreglo de punteros vivo: nadie
las va a liberar. La construcción que falla tiene que deshacer lo que
alcanzó a hacer antes de rendirse, y por eso conviene que reservar sea una
función aparte que devuelve `NULL` solo después de haber limpiado:

```c
int **reservar(int n, int m) {
    int **M = malloc(n * sizeof(int *));
    int reservadas = 0;
    int i = 0;

    if (M != NULL) {
        while (i < n) {
            M[i] = malloc(m * sizeof(int));
            if (M[i] != NULL) {
                reservadas = reservadas + 1;
            }
            i = i + 1;
        }
        if (reservadas < n) {
            i = 0;
            while (i < n) {
                free(M[i]);
                M[i] = NULL;
                i = i + 1;
            }
            free(M);
            M = NULL;
        }
    }
    return M;
}
```

`free(NULL)` no hace nada, así que el ciclo de limpieza pasa sin cuidado por
las filas que nunca se pudieron pedir. Quien llama recibe la matriz completa
o no recibe nada, y no hay un estado intermedio del que ocuparse.

La liberación del final es la regla de siempre, de adentro hacia afuera:
primero cada fila, después el arreglo de punteros, y cada puntero a `NULL`
después de su `free`. Si el programa termina, el sistema recupera todo de
todas formas; el problema es el programa que sigue corriendo y pidiendo
memoria que ya no le van a dar.

## Qué viaja en una llamada

### El intercambio que no intercambia

```c
void intercambiar(int a, int b) {
    int temporal = a;

    a = b;
    b = temporal;
}

int main(void) {
    int x = 10;
    int y = 2;

    intercambiar(x, y);
    printf("x = %d y = %d\n", x, y);
    return 0;
}
```

```text
x = 10 y = 2
```

La función corrió, `temporal` hizo su baile y las variables quedaron igual.
Dentro de la función `a` y `b` sí terminaron intercambiadas. El problema no
es el intercambio: es *quiénes son* `a` y `b`.

### El paso por valor

!!! note "Paso por valor (Sebesta, capítulo 9)"

    La llamada evalúa cada argumento y copia el resultado en una variable
    local nueva de la función. La función trabaja con sus copias, y las
    copias mueren cuando la función retorna.

Cada función activa tiene su propio **marco de pila**, con sus variables
locales separadas de las de las demás. En el marco de `main` viven `x` con
10 y `y` con 2; en el marco de `intercambiar` nacen `a` con 10, `b` con 2 y
`temporal`. El intercambio ocurre ahí adentro, y ese marco entero se destruye
al retornar. El trabajo se fue con él.

Salvo indicación contraria, todo lo que no sea un arreglo viaja así, y la
única puerta de salida de una función por valor es su `return`.

### Una traza con un puntero en escena

La misma función de siempre, ahora con un puntero del llamador metido en la
historia para que no todo cambio venga de la función:

```c
int algo(int a, int b) {
    int ans = a + b;

    a = a + 1;
    b = b - 1;
    return ans;
}

int main(void) {
    int x = 10;
    int y = 2;
    int z = 8;
    int *w = &y;

    printf("x = %d y = %d z = %d\n", x, y, z);
    *w = algo(x, y);
    printf("x = %d y = %d z = %d\n", x, y, z);
    return 0;
}
```

```text
x = 10 y = 2 z = 8
x = 10 y = 12 z = 8
```

`x` no cambió: `a` era una copia y el `a = a + 1` se quedó en el marco de
`algo`. `y` sí cambió, pero no lo hizo `algo`: lo hizo `main` al escribir
`*w = 12` con el valor retornado, porque `w` guarda la dirección de `y`. Y a
`z` no la toca nadie.

## El paso por referencia

### La dirección viaja

Para que la función alcance `x` no se le manda el valor: se le manda dónde
vive.

!!! note "Paso por referencia con punteros (Thareja, capítulo 6)"

    El argumento es la dirección de la variable y el parámetro es un
    puntero. La función recibe una copia de la dirección, y con ella lee y
    escribe la celda original del llamador.

```c
void intercambiar(int *a, int *b) {
    int temporal = *a;

    *a = *b;
    *b = temporal;
}

int main(void) {
    int x = 10;
    int y = 2;

    intercambiar(&x, &y);
    printf("x = %d y = %d\n", x, y);
    return 0;
}
```

```text
x = 2 y = 10
```

Lo copiado sigue siendo el argumento; solo que ahora el argumento es una
dirección, y una copia de la dirección llega a la misma casa. Las dos marcas
del modo están a la vista: `&` en la llamada, para entregar la dirección, y
`*` adentro, para usar la celda apuntada. El `*a = *b` escribe en la celda
de `x` aunque `main` no haya movido un dedo.

La misma traza de antes, cambiando una sola cosa en la firma:

```c
int algo(int *a, int b) {
    int ans = *a + b;

    *a = *a + 1;
    b = b - 1;
    return ans;
}
```

```text
x = 10 y = 2 z = 8
x = 11 y = 12 z = 8
```

| Variable | ¿Cambió? | Quién escribió |
|---|---|---|
| `x` | $10 \to 11$ | `algo`, vía `*a` |
| `y` | $2 \to 12$ | `main`, vía `*w` |
| `z` | no | nadie |

Una misma firma puede mezclar los dos modos: `a` por referencia y `b` por
valor. Lo que decide no es la función, es cada parámetro.

### El misterio del `&` en `scanf`

Desde la primera lectura de datos se venía escribiendo

```c
scanf("%d", &n);
```

y el `&` iba por fe. `scanf` necesita *escribir* lo leído en `n`: es una
función que modifica variables del llamador, y por eso recibe la dirección.
Es el mismo paso por referencia de `intercambiar`, sin nada especial. Y
`printf` solo necesita leer el valor, así que `n` viaja sin `&`: paso por
valor.

Pasarle a `printf` un `&n` donde espera un `int` no imprime la variable,
imprime la dirección o algo peor, porque los tipos no coinciden: `int` mide
4 bytes y `int *` mide 8.

### Devolver más de un valor

Una función devuelve *un* valor. ¿Y si el recorrido necesita entregar dos,
como el menor y el mayor de un arreglo en una sola pasada?

```c
void minimo_y_maximo(int *A, int n, int *minimo, int *maximo) {
    int i = 1;

    *minimo = A[0];
    *maximo = A[0];
    while (i < n) {
        if (A[i] < *minimo) {
            *minimo = A[i];
        }
        if (A[i] > *maximo) {
            *maximo = A[i];
        }
        i = i + 1;
    }
}

int main(void) {
    int A[6] = {7, 3, 9, 1, 8, 4};
    int menor, mayor;

    minimo_y_maximo(A, 6, &menor, &mayor);
    printf("minimo = %d maximo = %d\n", menor, mayor);
    return 0;
}
```

```text
minimo = 1 maximo = 9
```

`A` y `n` son entradas; `minimo` y `maximo` son **parámetros de salida**:
direcciones donde la función deja sus resultados. El llamador declara
`menor` y `mayor` y presta sus celdas con `&`. Una pasada, dos respuestas, y
el `return` quedó libre.

Vale la pena detenerse en esto, porque rompe algo que se venía dando por
sentado. Un parámetro no es forzosamente una entrada. Con punteros hay
parámetros que entran, se leen, se escriben y salen con la respuesta
adentro, y una función deja de estar limitada a un único resultado.

### Los arreglos ya viajaban por referencia

```c
/* Escribe en A los primeros n numeros pares: 0, 2, 4, ... */
void llenar_pares(int *A, int n) {
    int i = 0;

    while (i < n) {
        A[i] = 2 * i;
        i = i + 1;
    }
}
```

```text
0 2 4 6 8
```

En la llamada no hay `&`: el nombre `A` ya vale `&A[0]`. Los arreglos nacen
con la dirección puesta, y por eso toda función sobre arreglos ha podido
leerlos y modificarlos desde el principio. El `int` suelto es el que
necesita el `&`; el arreglo, no.

La matriz del tamaño justo viaja igual, porque es un bloque único: se
entregan su dirección y sus dos tamaños, y adentro se sigue escribiendo
`M[i * m + j]`. Nada se copia, tenga la matriz doce casillas o un millón.

### Las referencias de C++

C++ agrega una tercera vía:

```cpp
int main() {
    int x = 0;
    int y = 10;
    int &z = x;

    printf("x = %d y = %d z = %d\n", x, y, z);
    z = y + x;
    printf("x = %d y = %d z = %d\n", x, y, z);
    return 0;
}
```

```text
x = 0 y = 10 z = 0
x = 10 y = 10 z = 10
```

`int &z = x` no crea una celda: le pone un segundo nombre a la celda de `x`.
`z` es un **alias**. El `z = y + x` escribe 10 en esa única celda, y por eso
`x` amanece en 10. La referencia se ata una vez, al nacer, y no se puede
redirigir después: no es un puntero que se mueve, es un nombre fijo.

Con el alias en la firma, el intercambio queda sin asteriscos:

```cpp
void intercambiar(int &a, int &b) {
    int temporal = a;

    a = b;
    b = temporal;
}

int main() {
    int x = 10;
    int y = 2;

    intercambiar(x, y);
    printf("x = %d y = %d\n", x, y);
    return 0;
}
```

```text
x = 2 y = 10
```

Durante la llamada, `a` *es* `x`. El cuerpo se lee igual que la versión por
valor y la llamada se lee igual que la que falló.

!!! warning "La llamada no avisa"

    En C, `intercambiar(&x, &y)` grita que `x` puede cambiar. En C++,
    `intercambiar(x, y)` puede ser por valor o por referencia: para saber si
    el argumento corre peligro hay que leer la **firma** de la función.

### Tres maneras de pasar un `int`

|  | Por valor | Por puntero | Por referencia |
|---|---|---|---|
| La función recibe | una copia | una dirección | un alias |
| La llamada | `f(x)` | `f(&x)` | `f(x)` |
| En la firma | `int a` | `int *a` | `int &a` |
| Adentro se usa | `a` | `*a` | `a` |
| ¿Puede cambiar `x`? | no | sí | sí |
| Disponible en | C y C++ | C y C++ | solo C++ |

## Repaso de POO

### Del paquete de datos al objeto

Un estudiante del curso son un código y sus notas. Con lo visto hasta aquí,
esos datos andarían sueltos:

```c
int codigo;
double notas[3];
int registradas;

registrar_nota(notas, &registradas, 4.0);
```

Tres variables que deben moverse juntas, y una función aparte que cualquiera
puede saltarse escribiendo `notas[0]` directo.

!!! note "La clase y el objeto (Sebesta, capítulos 11 y 12)"

    Una clase reúne en una sola pieza los datos de una entidad
    (*atributos*) y las operaciones que los manejan (*métodos*). Un objeto
    es un ejemplar concreto de la clase, con sus propios valores en los
    atributos.

Una clase es un *template*: el diseño a partir del cual se construyen los
ejemplares. Construir uno —darle valores a sus atributos— es
**instanciarla**, y el resultado de esa operación es el objeto.

### La clase `Estudiante`

```cpp
class Estudiante {
private:
    int codigo;
    double notas[3];
    int registradas;

public:
    Estudiante(int c) {
        codigo = c;
        registradas = 0;
    }

    void registrar_nota(double nota) {
        if (registradas < 3) {
            notas[registradas] = nota;
            registradas = registradas + 1;
        }
    }

    double promedio() {
        double suma = 0;
        int i = 0;

        while (i < registradas) {
            suma = suma + notas[i];
            i = i + 1;
        }
        return suma / registradas;
    }

    int obtener_codigo() {
        return codigo;
    }
};
```

Los atributos van en `private`: solo los métodos de la clase pueden
tocarlos. El **constructor** `Estudiante(int c)` corre al crear el objeto y
lo deja en un estado sano, con cero notas registradas. Y `registrar_nota`
valida antes de escribir, así que el arreglo no se desborda porque la clase
no lo permite: solo caben tres notas y la cuarta no entra.

```cpp
int main() {
    Estudiante e(1023);

    e.registrar_nota(4.0);
    e.registrar_nota(3.5);
    e.registrar_nota(4.5);
    printf("Estudiante %d: promedio %.2f\n",
           e.obtener_codigo(), e.promedio());
    return 0;
}
```

```text
Estudiante 1023: promedio 4.00
```

`e.registrar_nota(4.0)` es una llamada con un participante implícito: el
objeto `e`, cuyos atributos el método lee y escribe sin que aparezcan en la
lista de parámetros.

### `private` cierra la puerta

```cpp
int main() {
    Estudiante e(1023);

    e.notas[0] = 5.0;
    return 0;
}
```

No compila:

```text
error: 'double Estudiante::notas [3]' is private
       within this context
   19 |     e.notas[0] = 5.0;
```

Las notas solo cambian pasando por `registrar_nota`, que valida el cupo.
Esto es la **encapsulación**, y es más que esconder: quien diseña la clase
decide qué se puede ver, cómo se puede ver y cómo se puede modificar. Aquí
la decisión fue que ni el código, ni las notas, ni el número de notas
registradas se tocan desde afuera.

Así como la condición del ciclo cuidaba los límites del arreglo, la clase
cuida los suyos, y esta vez el error se atrapa antes de ejecutar: el
compilador es el portero.

### El objeto también viaja

```cpp
/* Recibe una copia del estudiante */
void premiar_copia(Estudiante e) {
    e.registrar_nota(5.0);
}

/* Recibe el estudiante mismo */
void premiar(Estudiante &e) {
    e.registrar_nota(5.0);
}

int main() {
    Estudiante e(1023);

    e.registrar_nota(4.0);
    e.registrar_nota(3.0);
    printf("promedio: %.2f\n", e.promedio());
    premiar_copia(e);
    printf("tras premiar_copia: %.2f\n", e.promedio());
    premiar(e);
    printf("tras premiar: %.2f\n", e.promedio());
    return 0;
}
```

```text
promedio: 3.50
tras premiar_copia: 3.50
tras premiar: 4.00
```

`premiar_copia` copió el objeto entero —código, notas y contador— y la nota
5.0 quedó en la copia, que murió con el marco. En el original siguen las dos
notas y el promedio no se mueve. `premiar` recibió un alias: la nota quedó
donde importa y el promedio subió a $\frac{4.0 + 3.0 + 5.0}{3} = 4.0$.

Copiar un objeto copia *todos* sus atributos; la referencia cuesta lo que
una dirección. Por eso los objetos viajan por referencia.

### El promedio de nadie

```cpp
Estudiante e(1023);

printf("promedio sin notas: %.2f\n", e.promedio());
```

```text
promedio sin notas: -nan
```

!!! warning "La operación existe, la respuesta no"

    Con `registradas` en 0, la división $0/0$ no es un número y el programa
    imprime basura sin fallar. La clase protege *cómo* se guardan los datos,
    pero aún no dice *qué* se puede pedir y en qué estado. Ese contrato
    —operaciones, condiciones y significado— es el tema de la abstracción de
    datos.

### Relaciones entre clases

Las clases no viven sueltas, y las formas de relacionarlas son tres.

**Herencia.** Una clase toma los atributos y los métodos de otra, y puede
agregar más o redefinir los que heredó. Java tiene herencia **simple**: se
hereda de una sola clase. C++ y Python admiten herencia **múltiple**, que
trae su propio problema: si dos padres traen un método con el mismo nombre,
alguien tiene que decidir cuál gana, y la regla es del lenguaje, no del
programa. Para suplir la herencia simple, Java ofrece las **interfaces**:
declaran las operaciones sin implementarlas, no heredan de nadie y no se
instancian, y una clase puede implementar varias.

**Uso.** Una clase usa los métodos de otra sin que esa otra sea parte suya.
Un estudiante usa una calculadora; la calculadora no es un pedazo del
estudiante.

**Composición.** Una clase está compuesta por otras. Una biblioteca tiene
libros y computadores, y esos sí son parte de ella.

Sobre la herencia se monta el **polimorfismo**: un mismo método con
comportamientos distintos según la clase concreta que haya del otro lado.

```java
Mamifero ma1 = new Gato();
Mamifero ma2 = new Perro();
```

Las dos variables son `Mamifero`, pero `ma1.hacer_sonido()` y
`ma2.hacer_sonido()` no hacen lo mismo. Quien decide es el objeto, no el
tipo de la variable. Lo habitual es que arriba haya una **clase abstracta**
que declara la operación sin implementarla y deja esa tarea a las clases
hijas, aunque hasta dónde puede implementar una clase abstracta cambia de un
lenguaje a otro.

## Los tipos por dentro

Cuando `intercambiar(x, y)` recibió los enteros por valor, se copió algo.
¿Cuánto pesa ese algo y qué cabe adentro?

### El rango sale de los bits

Un `int` mide 4 bytes, que son 32 bits, y con 32 bits se escriben
$2^{32} = 4\,294\,967\,296$ combinaciones de ceros y unos, ni una más. Esas
combinaciones son todos los valores que el tipo podrá tomar en su vida.
Falta decir cuáles.

!!! note "Rango de un entero de $b$ bits"

    Sin signo, los valores van de $0$ a $2^{b} - 1$. Con signo, en
    complemento a dos, van de $-2^{b-1}$ a $2^{b-1} - 1$.

| Tipo | Bits | Rango |
|---|---:|---|
| `char` | 8 | $[-128,\; 127]$ |
| `unsigned char` | 8 | $[0,\; 255]$ |
| `int` | 32 | $[-2\,147\,483\,648,\; 2\,147\,483\,647]$ |
| `unsigned int` | 32 | $[0,\; 4\,294\,967\,295]$ |
| `long` | 64 | $[-2^{63},\; 2^{63} - 1]$ |

El signo se paga con la mitad del rango. Y hay un negativo más que positivos
por una razón que viene de complemento a dos: con el primer bit como signo y
el resto como valor, el cero se podría escribir de dos maneras, todo ceros y
uno seguido de ceros. Como no tiene sentido gastar dos combinaciones en el
mismo número, la segunda se aprovecha para el menor negativo. De ahí que el
`int` llegue a $2^{31} - 1$ por arriba y a $-2^{31}$ por abajo.

El `unsigned char` es el caso donde la cuenta se ve con los ojos: el código
ASCII extendido va de 0 a 255, que son justo los 256 valores de ocho bits.

Nada de esto lo decide el lenguaje: es cuántos bits hay.

### La máquina lo confirma

Los topes no hay que memorizarlos, vienen escritos en `limits.h`:

```c
#include <stdio.h>
#include <limits.h>

int main(void) {
    printf("int  %d bytes  [%d, %d]\n",
           (int) sizeof(int), INT_MIN, INT_MAX);
    printf("long %d bytes  [%ld, %ld]\n",
           (int) sizeof(long), LONG_MIN, LONG_MAX);
    return 0;
}
```

```text
int  4 bytes  [-2147483648, 2147483647]
long 8 bytes  [-9223372036854775808, 9223372036854775807]
```

El mismo `sizeof` que decidía cuánto avanza `p + 1` es el que decide hasta
dónde llega el tipo.

### El contador da la vuelta

```c
int mayor = INT_MAX;
unsigned int tope = UINT_MAX;
int paso = 1;

printf("INT_MAX + 1   = %d\n", mayor + paso);
printf("UINT_MAX + 1  = %u\n", tope + paso);
```

```text
INT_MAX       = 2147483647
INT_MAX + 1   = -2147483648
UINT_MAX      = 4294967295
UINT_MAX + 1  = 0
```

El rango es circular. Después del último valor no hay ninguno, así que se
vuelve al primero: sumarle uno al mayor `int` aterriza en el menor, y
restarle uno a un `unsigned` en cero aterriza en el máximo. Es el odómetro
de un carro que después de 99 999 kilómetros marca cero.

!!! danger "Nadie avisa"

    Ni el compilador ni el programa dicen nada, igual que cuando se leía
    `A[4]` en un arreglo de cuatro: el resultado es un número perfectamente
    válido y perfectamente equivocado. Un positivo multiplicado por dos que
    sale negativo no es una falla de la máquina, que hizo lo que se le pidió
    con los bits que tenía; es que el valor esperado no cabía.

En `unsigned` la vuelta está en la definición del tipo; en `int` es lo que
hace la máquina, no algo que el lenguaje prometa. El único cuidado real es
el del programador: si la suma puede pasarse, el tipo se elige más ancho.

### Los reales tampoco caben

Un `float` son 4 bytes y un `double` son 8, repartidos entre el signo, el
exponente y los dígitos significativos, según el estándar IEEE 754:

| Tipo | Signo | Exponente | Mantisa |
|---|---:|---:|---:|
| `float` | 1 | 8 | 23 |
| `double` | 1 | 11 | 52 |

Con el bit implícito, el `double` trabaja con 53 bits de precisión y el
`float` con 24. Y con esos bits contados hay que representar una recta
infinita: entre 1 y 1.1 hay infinitos números y la memoria no lo es.

```c
double a = 0.1;
double b = 0.2;

printf("0.1 + 0.2 (double) = %.20f\n", a + b);
printf("0.3       (double) = %.20f\n", 0.3);
```

```text
0.1 + 0.2 (double) = 0.30000000000000004441
0.3       (double) = 0.29999999999999998890
La comparacion dice que son distintos
0.1 + 0.2 (float)  = 0.30000001192092895508
```

En base 2, $0.1$ es periódico, como $1/3$ en base 10: escribirlo exacto pide
infinitos dígitos. Lo que se guarda es el vecino más cercano, y esa
diferencia es el **error de truncamiento**. Al sumar, los errores de los dos
operandos se acumulan, mientras que el `0.3` escrito directo solo carga el
suyo: por eso los dos resultados no coinciden.

El `float` falla mucho antes, con la mitad de los bits de mantisa, y por eso
en el curso los reales son `double`. La única razón para preferir un `float`
es una limitación de memoria; fuera de ese caso, se paga imprecisión sin
recibir nada a cambio. Y en el `double`, la precisión también se degrada a
medida que el número crece: los mismos 53 bits reparten cada vez menos
detalle cuando el valor es enorme.

!!! warning "Los reales no se comparan con `==`"

    `a + b == 0.3` es falso y el programa tiene razón: son dos números
    distintos. Lo que se pregunta es si están cerca, $|a - b| < \varepsilon$
    con un $\varepsilon$ del tamaño del problema.

Donde el error no se puede aceptar —una aplicación bancaria, por ejemplo— no
se usan los tipos nativos: se usan bibliotecas numéricas de alta precisión,
que representan los números de otra forma. COBOL las trae desde el
principio, y por eso sigue vivo en los bancos.

### Cuando el número es un objeto

```python
import sys

print(2 ** 100)
print(sys.getsizeof(0), sys.getsizeof(1000), sys.getsizeof(2 ** 100))
print(0.1 + 0.2)
print(sys.getsizeof(1.5))
print(sys.getsizeof([1, 2, 3, 4, 5]))
```

```text
1267650600228229401496703205376
28 28 40
0.30000000000000004
24
104
```

No hay desbordamiento porque no hay 4 bytes: un entero de Python es un
**objeto**, con su encabezado y un arreglo de dígitos que crece pidiendo más
memoria. Es la misma idea de la abstracción de datos: eso no es un número,
pero se comporta como uno, y quien lo usa no tiene por qué distinguir.

El precio son 28 bytes para guardar un cero, siete veces lo que cuesta un
`int`, y una suma que ya no es una instrucción del procesador sino una
llamada a un método que arma un objeto nuevo con el resultado.

El real no se salvó: es el mismo `double`, con el mismo
`0.30000000000000004`. Lo que cambió fue el entero, porque el problema del
entero era el tope y el del real es la representación.

!!! note "La lista tampoco es un bloque de números"

    `sys.getsizeof([1, 2, 3, 4, 5])` responde 104, y los cinco números no
    están ahí: la lista guarda cinco direcciones de 8 bytes y cada entero
    vive aparte, con sus 28.

Esto explica por qué en Python los cálculos intensivos se dejan en manos de
NumPy. Sus arreglos sí son bloques de números del mismo tamaño, y las
operaciones corren en C por debajo. Un ciclo de Python que recorre un arreglo
de NumPy elemento por elemento devuelve la ventaja: la idea es pedirle a la
biblioteca la operación completa.

### Java tiene las dos cosas

`int` es un primitivo de 4 bytes; `Integer` es una clase, y su instancia es
un objeto con dirección propia.

```java
int mayor = Integer.MAX_VALUE;
System.out.println(mayor + 1);
System.out.println(Double.MIN_VALUE);

Integer a = Integer.valueOf("127");
Integer b = Integer.valueOf("127");
Integer c = Integer.valueOf("128");
Integer d = Integer.valueOf("128");
System.out.println((a == b) + " " + (c == d) + " " + c.equals(d));
```

```text
-2147483648
4.9E-324
true false true
```

El primitivo desborda igual que en C: mismos 32 bits, misma vuelta al menor.
Y `Double.MIN_VALUE` no es el más negativo, es el positivo más pequeño que
se puede representar; el más negativo es `-Double.MAX_VALUE`.

!!! danger "`==` entre objetos compara direcciones"

    Con 127 da `true` y con 128 da `false`, y los valores no tienen nada que
    ver: Java guarda en caché los `Integer` de $-128$ a $127$, así que los
    dos primeros son el mismo objeto y los otros dos son objetos distintos
    con el mismo contenido.

El caso no es una rareza de los números. Dos objetos `Estudiante` con
exactamente los mismos datos también dan `false` con `==`, porque están en
direcciones distintas. Comparar contenidos es otra operación, y hay que
escribirla: en Java es `equals`, y en C++ se define el operador `==` para la
clase, atributo por atributo. En Python el `==` de los tipos de la
biblioteca ya viene implementado así, y por eso ahí la comparación entre dos
listas iguales responde lo que uno espera.

### Lo que cuesta la comodidad

|  | `int A[5]` en C | `[1, 2, 3, 4, 5]` en Python |
|---|---|---|
| Lo que ocupa | 20 bytes seguidos | 104 bytes de direcciones |
| Cada elemento | 4 bytes del bloque | un objeto aparte, 28 bytes |
| `A + 1` avanza | 4 bytes | no hay paso fijo |
| Fuera de rango | silencio | `IndexError` |
| Al pasarse del tope | da la vuelta | no hay tope |

Lo que se gana —sin desbordamiento, sin `sizeof`, sin liberar— se paga en
memoria y en saltos: los objetos están dispersos y cada acceso puede costar
una traída de caché.

Que indexar cueste $O(1)$ depende de que las casillas sean del mismo tamaño
y estén pegadas. Las estructuras que vienen se construyen sobre el bloque de
bytes, que es donde esa cuenta se puede hacer.

## Ejercicios de la sesión

### Cociente y residuo en una sola llamada

Escribir la función

```c
void dividir(int a, int b, int *cociente, int *residuo);
```

que deje en las salidas el cociente y el residuo de `a` entre `b`, de modo
que este `main` imprima `17 = 3 * 5 + 2`:

```c
int main(void) {
    int c, r;

    dividir(17, 5, &c, &r);
    printf("17 = %d * 5 + %d\n", c, r);
    return 0;
}
```

La pregunta previa es cuáles parámetros son de entrada y cuáles de salida.

```c
/* Deja en *cociente y *residuo el resultado
   de dividir a entre b */
void dividir(int a, int b, int *cociente, int *residuo) {
    *cociente = a / b;
    *residuo = a % b;
}
```

```text
17 = 3 * 5 + 2
```

`a` y `b` entran por valor porque solo se leen; `cociente` y `residuo` son
salidas por dirección, la misma receta de `minimo_y_maximo`. La división y
el residuo los calcula la máquina de una sola vez, y una firma así los
entrega juntos.

### `mejor_nota`

Agregar a la clase `Estudiante` el método `double mejor_nota()`, que
devuelve la más alta de las notas registradas.

```cpp
double mejor_nota() {
    double mejor = notas[0];
    int i = 1;

    while (i < registradas) {
        if (notas[i] > mejor) {
            mejor = notas[i];
        }
        i = i + 1;
    }
    return mejor;
}
```

```text
mejor nota: 4.5
```

Es el recorrido de buscar el mayor, ahora dentro de la clase: corre sobre
los atributos propios y no recibe parámetros. Con cero notas registradas,
`notas[0]` es basura y el contrato pendiente crece un renglón más.

### Ejercicio de cierre

Un programa completo que:

1. Lea $n$ y reserve en el montículo un arreglo de $n$ reales (`double`).
2. Con `void llenar(double *A, int n)`, lea los $n$ valores usando `scanf`.
3. Con
   `void estadisticas(double *A, int n, double *promedio, double *maxima)`,
   calcule el promedio y la nota más alta en una sola pasada.
4. Imprima los dos resultados y devuelva la memoria.

Con las verificaciones de siempre: el `NULL` de `malloc`, y tras el `free`,
el puntero a `NULL`.

## La tarea 1

Sigue publicada en la arena y se entrega el lunes 14 de septiembre a las
23:59. Cómo entrar, enviar y leer los veredictos está en el
[apéndice del juez automático](../A1/Apéndice%20A.%20El%20juez%20automático.md).

## Para practicar en casa

### Propuesto 1

Sin correrlo: ¿qué imprime? Es la traza de la sesión, con la firma en su
tercera variante.

```cpp
int algo(int &a, int b) {
    int ans = a + b;

    a = a + 1;
    b = b - 1;
    return ans;
}

int main() {
    int x = 10;
    int y = 2;
    int z = 8;
    int *w = &y;

    printf("x = %d y = %d z = %d\n", x, y, z);
    *w = algo(x, y);
    printf("x = %d y = %d z = %d\n", x, y, z);
    return 0;
}
```

### Propuesto 2

Escribir la función

```c
void intercambiar_extremos(int *A, int n);
```

que intercambia la primera y la última casilla de `A` reutilizando la
función `intercambiar` de la sesión, sin mover datos por su cuenta. Probarla
con `{1, 2, 3, 4, 5}`.

### Propuesto 3

Escribir la clase `Rectangulo` con `base` y `altura` privadas, constructor, y
los métodos `area()`, `perimetro()` y `escalar(int factor)`, que multiplica
ambos lados por el factor. Con base 3 y altura 4, escalar por 2. Antes de
correr: ¿el área se duplica? ¿Y el perímetro?

### Propuesto 4

Sin correrlo: ¿qué imprime?

```c
void misterio(int a, int *b) {
    a = a + *b;
    *b = *b + 1;
}

int main(void) {
    int u = 3;
    int v = 5;

    misterio(u, &v);
    printf("%d %d\n", u, v);
    return 0;
}
```

¿Cuál de los dos parámetros viaja por valor?

### Pistas

- **Propuesto 1**: `a` es alias de `x`, así que `x` sube a 11; `y` recibe el
  12 por `*w`. Imprime `x = 11 y = 12 z = 8`: el mismo resultado de la
  versión con punteros, con la llamada de la versión por valor.
- **Propuesto 2**: los extremos viven en `&A[0]` y `&A[n - 1]`; la función
  nueva no mueve datos, solo le entrega esas dos direcciones a
  `intercambiar`. Queda `5 2 3 4 1`.
- **Propuesto 3**: el perímetro se duplica ($14 \to 28$), pero el área se
  cuadruplica ($12 \to 48$): `escalar` multiplica los dos lados y el área los
  multiplica entre sí.
- **Propuesto 4**: `a` viaja por valor y `u` sigue en 3; `*b` escribe y `v`
  pasa a 6. Imprime `3 6`.

## Ejercicios interactivos

Dos actividades de esta sesión se pueden trabajar en el navegador: las tres
trazas de una misma función según el modo de paso de su segundo parámetro, y
una clase `Cuenta` cuyas operaciones validan antes de escribir:
[página de ejercicios interactivos](./Ejercicios.md). Los programas no son
los de arriba: mismo tema, ronda nueva.

## Código de la clase

Compilación y ejecución:

```bash
gcc -Wall -Wextra archivo.c -o archivo && ./archivo
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

Los tres programas de la fila de mayor suma leen de la entrada estándar:

```bash
gcc -Wall -Wextra fila_mayor_bloque.c -o fila_mayor
./fila_mayor < fila_mayor.in
```

**La fila de mayor suma**

- [fila_mayor.c](codigo/fila_mayor.c) — las dos formas tal como quedaron en
  pantalla
- [fila_mayor_bloque.c](codigo/fila_mayor_bloque.c) — la matriz en un solo
  bloque, con la búsqueda por parámetros de salida
- [fila_mayor_punteros.c](codigo/fila_mayor_punteros.c) — el arreglo de
  punteros, con la reserva que limpia lo suyo cuando falla
- [fila_mayor.in](codigo/fila_mayor.in) — la matriz de $10 \times 10$ de
  prueba

**Qué viaja en una llamada**

- [intercambio_valor.c](codigo/intercambio_valor.c) — el intercambio que no
  intercambia
- [traza_valor.c](codigo/traza_valor.c) — la traza con todo por valor
- [intercambio_punteros.c](codigo/intercambio_punteros.c) — el intercambio
  con `&` y `*`
- [traza_punteros.c](codigo/traza_punteros.c) — la misma traza con el primer
  parámetro por dirección
- [alias.cpp](codigo/alias.cpp) — `int &z = x`, el segundo nombre de una
  celda
- [intercambio_referencias.cpp](codigo/intercambio_referencias.cpp) — el
  intercambio con referencias
- [traza_referencia.cpp](codigo/traza_referencia.cpp) — la traza en su
  tercera variante, el propuesto 1

**Parámetros de salida**

- [minimo_maximo.c](codigo/minimo_maximo.c) — dos respuestas en una pasada
- [llenar_pares.c](codigo/llenar_pares.c) — el arreglo que viaja sin `&`
- [dividir.c](codigo/dividir.c) — el cociente y el residuo
- [misterio.c](codigo/misterio.c) — el propuesto 4

**Objetos**

- [estudiante.cpp](codigo/estudiante.cpp) — la clase completa y su `main`
- [acceso_privado.cpp](codigo/acceso_privado.cpp) — el que no compila, a
  propósito
- [premiar.cpp](codigo/premiar.cpp) — copia contra referencia
- [promedio_vacio.cpp](codigo/promedio_vacio.cpp) — el promedio de nadie
- [mejor_nota.cpp](codigo/mejor_nota.cpp) — el método del ejercicio
- [rectangulo.cpp](codigo/rectangulo.cpp) — el propuesto 3

**Los tipos por dentro**

- [rangos.c](codigo/rangos.c) — tamaños y topes de `limits.h`
- [desborde.c](codigo/desborde.c) — la vuelta del contador
- [reales.c](codigo/reales.c) — `0.1 + 0.2` con veinte decimales
- [enteros.py](codigo/enteros.py) — el entero como objeto
- [Enteros.java](codigo/Enteros.java) — el primitivo y la clase, y el `==`
  entre objetos

`Enteros.java` se compila y se ejecuta aparte:

```bash
javac Enteros.java && java Enteros
```

**Para practicar**

- [extremos.c](codigo/extremos.c) — el propuesto 2

## Referencias

- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 6 (paso de argumentos usando punteros).
- R. Sebesta. *Concepts of Programming Languages*. Pearson, 2015. Capítulo 6
  (tipos de datos primitivos), capítulo 9 (subprogramas y paso de
  parámetros), capítulos 11 y 12 (encapsulación y orientación a objetos).
- N. Kalicharan. *Data Structures in C*. 2008. Funciones y punteros.
