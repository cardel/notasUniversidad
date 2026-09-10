# Clase 10. Abstracción de datos y tipos abstractos de datos

Miércoles 9 de septiembre de 2026.

El paso de parámetros dejó una pregunta abierta. Una clase decide quién puede
tocar sus datos, pero `promedio()` sobre un estudiante sin notas respondía
`-nan` sin que nadie protestara: `private` dice *cómo* se guardan los datos y
no dice *qué* se puede pedir ni en qué estado. Hoy se escribe esa parte que
faltaba. La sesión entera se hizo escribiendo código en pantalla, y el camino
fue este: un experimento con `double` que sale mal, un tipo nuevo para
arreglarlo, la especificación de ese tipo antes de escribirlo, la clase que la
cumple, y al final una segunda clase que cumple la misma especificación de otra
manera para comprobar que el programa de arriba no se entera.

Al final de la sesión el objetivo era poder distinguir la interfaz de un tipo
de su implementación, especificar un TAD con su dominio, las firmas de sus
operaciones y sus ecuaciones, escribir código que solo dependa de la interfaz y
sobreviva sin cambios a un cambio de representación, y enunciar el invariante
de representación de una implementación diciendo quién lo establece y quién lo
preserva.

## Diapositivas

![](clase10.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Antes de entrar: la factorización de la arena

La sesión abrió repasando el problema de la arena que pide descomponer un
número en factores primos y escribirlo en forma compacta. El teorema
fundamental de la aritmética dice que todo entero mayor que uno se escribe como
producto de primos, y de una sola manera. La salida pide los factores en orden
ascendente separados por comas, cada uno con su exponente cuando el exponente
pasa de uno.

La cuenta a mano es dividir por primos en orden, y cada división que da exacta
se anota:

| Número | Se divide entre | Queda |
|---:|---:|---:|
| 360 | 2 | 180 |
| 180 | 2 | 90 |
| 90 | 2 | 45 |
| 45 | 3 | 15 |
| 15 | 3 | 5 |
| 5 | 5 | 1 |

De ahí sale $360 = 2^3 \cdot 3^2 \cdot 5$, que en el formato pedido se escribe
`2^3,3^2,5`. Un número primo se descompone en sí mismo: 97 no se deja dividir
por 2, 3, 5 ni 7, y su respuesta es `97`.

La parte que decide el veredicto es hasta dónde se prueba. Recorrer los
divisores de 2 hasta $n$ cuesta $O(n)$ por caso, y con cien casos de hasta un
millón eso se va en tiempo límite excedido. La observación que lo arregla es
que si $n = a \cdot b$ con $a \leq b$, entonces $a \leq \sqrt{n}$: ningún
divisor por debajo de la raíz puede escaparse, y basta con probar hasta ahí.
Cada divisor que se encuentra se saca completo, dividiendo mientras la división
siga siendo exacta —así queda el exponente—, y lo que sobre al final, si es
mayor que uno, es primo y entra como último factor. Con $n \leq 10^6$ la raíz
son mil pasos y el problema deja de ser un problema de tiempo.

## El experimento que motiva un tipo nuevo

```cpp
double tercio = 1.0 / 3.0;
double suma = 0.1 + 0.2;

printf("1.0/3.0     = %.20f\n", tercio);
printf("tercio * 3  = %.20f\n", tercio * 3.0);
printf("0.1 + 0.2   = %.20f\n", suma);
printf("0.3         = %.20f\n", 0.3);
printf("0.1 + 0.2 == 0.3: %d\n", suma == 0.3);
```

```text
1.0/3.0     = 0.33333333333333331483
tercio * 3  = 1.00000000000000000000
0.1 + 0.2   = 0.30000000000000004441
0.3         = 0.29999999999999998890
0.1 + 0.2 == 0.3: 0
```

Es el error de truncamiento de la sesión anterior, visto desde otro ángulo. Un
tercio no cabe en base 2, ni un décimo tampoco, y el `double` guarda el vecino
más cercano; la comparación con `==` responde sobre esas aproximaciones y no
sobre los números. La tercera línea es la que más incomoda: $0.1 + 0.2$ y $0.3$
son dos valores distintos para la máquina.

Un tercio, en cambio, se puede guardar exacto si se guarda como lo que es: dos
enteros, un numerador y un denominador. El lenguaje no trae ese tipo. Hay que
construirlo.

## Interfaz e implementación

Antes de escribir la clase, la idea que la sostiene. La abstracción de datos
separa un tipo en dos mitades: la **interfaz**, que dice qué representa el dato
y qué operaciones ofrece, y la **implementación**, que dice cómo se guarda en
memoria y cómo funciona cada operación.

El ejemplo está a la mano, en un lenguaje que ya usan:

```python
a = 1
a + 2          # 3
a.__add__(2)   # 3
```

Ese `1` se ve como un número y se usa como un número, y por dentro es un objeto
con métodos. En C++ el `1` son cuatro bytes con 32 bits, y también se suma con
`+`. Las dos implementaciones son completamente distintas y no se distinguen
desde afuera, porque desde afuera solo se ve la interfaz: operaciones
aritméticas, relacionales y de bits.

```python
a = 1
a << 2   # 4
2 & 1    # 0
4 | 3    # 7
```

El corrimiento `a << 2` mueve los bits dos lugares a la izquierda: el `1` que
en binario es `1` se vuelve `100`, que es 4. Estas operaciones vuelven a
aparecer más adelante, cuando el índice de una estructura se recorre por los
bits de su posición.

La diferencia entre las dos implementaciones aparece cuando se estira el dato:

```python
2 ** 100 + 1   # 1267650600228229401496703205377
```

El entero de Python crece pidiendo memoria y el de C++ tiene cuatro bytes y da
la vuelta. Misma interfaz, distinto techo. Esa es exactamente la libertad que se
va a usar hoy: elegir la representación que convenga sin que el programa de
arriba cambie una línea.

!!! note "Tipo abstracto de datos (Thareja, capítulo 2)"

    Un **tipo abstracto de datos** (TAD) es un conjunto de valores junto con
    sus operaciones y las propiedades de esas operaciones, especificado con
    precisión e independiente de cualquier implementación.

## La especificación del TAD Racional

Primero hace falta una manera de hablar del valor sin hablar de la memoria. Se
escribe $\lceil x \rceil$ para decir «alguna representación del valor $x$, sin
decir cuál». Y se necesita porque una misma fracción tiene muchas memorias:

| `num` | `den` | Es |
|---:|---:|---|
| 9 | 18 | $\lceil 1/2 \rceil$ |
| 1 | 2 | $\lceil 1/2 \rceil$ |

Dos memorias distintas, el mismo racional. La especificación habla del valor; la
memoria es asunto de la implementación.

!!! note "El TAD Racional"

    **Dominio**

    $$\{\, p/q \;:\; p \in \mathbb{Z},\ q \in \mathbb{Z},\ q \neq 0 \,\}$$

    **Firmas**

    $$
    \begin{aligned}
      \texttt{crear} &: \text{Entero} \times \text{Entero} \to \text{Racional},
        \quad \text{exige } q \neq 0\\
      \texttt{numerador} &: \text{Racional} \to \text{Entero}\\
      \texttt{denominador} &: \text{Racional} \to \text{Entero}
    \end{aligned}
    $$

    **Ecuaciones**, para $r = \texttt{crear}(p, q)$ con $q \neq 0$

    $$
    \begin{aligned}
      \texttt{denominador}(r) &\neq 0\\
      \texttt{numerador}(r) \cdot q &= \texttt{denominador}(r) \cdot p
    \end{aligned}
    $$

La segunda ecuación dice que el cociente se conserva. Y conviene fijarse en lo
que **no** dice: no exige que `numerador(r)` devuelva el $p$ que llegó. Esa
libertad es de la implementación, y más abajo se usa.

Sobre esa interfaz se escribe el resto sin volver a mirar la memoria:

$$
\frac{a}{b} + \frac{c}{d} = \frac{ad + cb}{bd}
\qquad
\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}
$$

La igualdad es la que obliga a pensar. Comparar campo a campo diría que $9/18$
y $1/2$ son distintos, y son el mismo número. El criterio que sirve con
cualquier representación son los productos cruzados:

!!! note "Igualdad de racionales"

    Sean $b \neq 0$ y $d \neq 0$. Entonces

    $$\frac{a}{b} = \frac{c}{d} \iff a \cdot d = b \cdot c.$$

Con $2/8$ y $1/4$: $2 \cdot 4 = 8$ y $8 \cdot 1 = 8$, así que son iguales.

Quedan entonces tres capas, y cada una habla solo con la de abajo:

| Capa | Qué vive ahí |
|---|---|
| Área del programador | `sumar`, `multiplicar`, `igual`, `imprimir` |
| Interfaz | `crear`, `numerador`, `denominador` |
| Implementación | `int num`, `int den` y su disciplina interna |

## La clase, en tres archivos

En pantalla el tipo se armó con compilación separada, que es la forma en que se
reparte un programa en C++: la declaración de la clase en un archivo de
cabecera y su código en otro.

`racional.h` lleva la interfaz y nada más:

```cpp
#ifndef RACIONAL_H
#define RACIONAL_H

class Racional {
private:
    int num;
    int den;

    int mcd(int a, int b);
    void simplificar();

public:
    Racional(int p, int q);
    int numerador();
    int denominador();
    void imprimir();
    Racional sumar(Racional r);
    Racional multiplicar(Racional r);
    bool igual(Racional r);
};

#endif
```

Las tres líneas `#ifndef`, `#define` y `#endif` son la guarda de inclusión. Un
archivo `.h` puede terminar incluido dos veces en la misma compilación —una
directa y otra a través de un tercer archivo—, y declarar la clase dos veces es
un error. La guarda define un nombre la primera vez y en la segunda pasada el
`#ifndef` encuentra ese nombre ya definido y salta el bloque entero.

`racional.cpp` lleva el código de cada método, con el nombre de la clase por
delante:

```cpp
#include "racional.h"
#include <cassert>
#include <cstdio>

/* Precondicion: q > 0. El signo lo carga el numerador */
Racional::Racional(int p, int q) {
    assert(q > 0);
    this->num = p;
    this->den = q;
    this->simplificar();
}

int Racional::numerador() { return this->num; }

int Racional::denominador() { return this->den; }

void Racional::imprimir() { printf("%d/%d\n", this->num, this->den); }
```

El `Racional::` dice a qué clase pertenece cada función. Y las comillas de
`#include "racional.h"` son las de un archivo propio; los `<>` son los de la
biblioteca.

Compilar y enlazar son dos pasos:

```bash
g++ -Wall -Wextra -c racional.cpp -o racional.o
g++ -Wall -Wextra -c main_racional.cpp -o main_racional.o
g++ -Wall -Wextra racional.o main_racional.o -o racional
```

`-c` compila sin enlazar y produce un `.o` con el código de ese archivo y las
referencias sin resolver. El último comando junta los `.o` y resuelve esas
referencias. La ventaja aparece cuando el programa crece: al cambiar un solo
archivo se recompila ese `.o` y se vuelve a enlazar, en vez de compilarlo todo.

### El puntero escondido: `this`

Dentro de un método, escribir `num` es una abreviatura. La forma completa es
`this->num`.

!!! note "Qué es `this`"

    En cada método, `this` es un puntero al objeto sobre el que corre el
    método; en los de `Racional` su tipo es `Racional *`. Un método es una
    función que recibe, además de sus parámetros, la **dirección** del objeto:
    el paso por dirección de la sesión anterior, escondido en la sintaxis.

Eso explica por qué `a.numerador()` y `b.numerador()` ejecutan el mismo código
con resultados distintos: cambia la dirección que viaja en `this`. La caja del
TAD pide $\texttt{numerador}: \text{Racional} \to \text{Entero}$, una operación
que recibe un racional, y ese argumento no va entre paréntesis: viaja en `this`.

Se vuelve indispensable cuando un parámetro tapa a un campo con su nombre:

```cpp
Racional(int num, int den) {
    this->num = num;
    this->den = den;
}
```

A la izquierda de cada asignación está el campo del objeto; a la derecha, el
parámetro. Sin `this` no habría forma de distinguirlos. De ahí sale la práctica
que se adopta de aquí en adelante: dentro de un método, los atributos se
escriben siempre con `this->`, y así la lectura no depende de adivinar qué
nombre tapa a cuál.

### Las operaciones

```cpp
Racional Racional::sumar(Racional r) {
    int p = this->num * r.denominador() + this->den * r.numerador();
    int q = this->den * r.denominador();

    return Racional(p, q);
}

Racional Racional::multiplicar(Racional r) {
    int p = this->num * r.numerador();
    int q = this->den * r.denominador();

    return Racional(p, q);
}

/* Productos cruzados: a/b = c/d si y solo si a*d = b*c */
bool Racional::igual(Racional r) {
    return this->num * r.denominador() == this->den * r.numerador();
}
```

Las tres construyen su respuesta con el constructor y leen al otro operando por
`r.numerador()` y `r.denominador()`, nunca por `r.num`. Ninguna toca la memoria
del vecino.

## El invariante de representación

La clase tal como va cumple las ecuaciones, y aun así `Racional(2, 8)` imprime
`2/8`. La pregunta de la sesión fue si se puede lograr que imprima `1/4` sin
tocar el `main`. La respuesta es una promesa que la implementación se hace a sí
misma y escribe como fórmula:

!!! note "Invariante de representación"

    Todo objeto con campos $(\mathit{num}, \mathit{den})$ cumple

    $$
    \begin{aligned}
      I_1&: \quad \mathit{den} > 0\\
      I_2&: \quad \operatorname{mcd}(|\mathit{num}|, \mathit{den}) = 1
    \end{aligned}
    $$

$I_1$ manda el signo al numerador, para que $1/{-2}$ y $-1/2$ no sean dos
objetos distintos. $I_2$ deja la fracción en su forma más pequeña. De los dos
juntos sale que el cero es único: si $\mathit{num} = 0$ entonces
$\operatorname{mcd}(0, \mathit{den}) = \mathit{den}$, que por $I_2$ vale 1, y el
cero siempre es $0/1$.

**Quién lo establece**: el constructor, que llama a `simplificar()` antes de
terminar. **Quién lo preserva**: todas las operaciones del área del
programador, porque construyen sus resultados con el constructor y ninguna
escribe `num` ni `den` a mano.

### El máximo común divisor

Simplificar es dividir numerador y denominador por su máximo común divisor, y
para eso está el algoritmo de Euclides: se toma el residuo de la división, se
repite con el divisor y ese residuo, y el último residuo antes del cero es la
respuesta.

```text
mcd(25, 15)
    25 mod   15 =   10
    15 mod   10 =    5
    10 mod    5 =    0
  ultimo residuo antes del cero: 5

mcd(27, 18)
    27 mod   18 =    9
    18 mod    9 =    0
  ultimo residuo antes del cero: 9

mcd(22, 40)
    22 mod   40 =   22
    40 mod   22 =   18
    22 mod   18 =    4
    18 mod    4 =    2
     4 mod    2 =    0
  ultimo residuo antes del cero: 2
```

La tercera traza tiene un detalle que vale la pena mirar: cuando el primer
argumento es menor que el segundo, `22 mod 40` devuelve 22 y el primer paso lo
único que hace es intercambiarlos. El algoritmo se acomoda solo.

En código, con el caso base cuando el residuo llega a cero:

```cpp
/* Algoritmo de Euclides: el ultimo residuo antes del cero */
int Racional::mcd(int a, int b) {
    int resultado = a;

    if (b != 0) {
        resultado = this->mcd(b, a % b);
    }
    return resultado;
}

/* Establece el invariante: den > 0 y mcd(|num|, den) = 1 */
void Racional::simplificar() {
    int magnitud = this->num;
    int divisor = 0;

    if (magnitud < 0) {
        magnitud = -magnitud;
    }
    divisor = this->mcd(magnitud, this->den);
    this->num = this->num / divisor;
    this->den = this->den / divisor;
}

Racional::Racional(int p, int q) {
    assert(q > 0);
    this->num = p;
    this->den = q;
    this->simplificar();
}
```

`mcd` y `simplificar` son privados: son maquinaria del invariante y nadie de
afuera tiene por qué llamarlos.

### La corrida

```cpp
int main() {
    Racional a = Racional(2, 8);
    Racional b = Racional(15, 50);
    Racional s = a.sumar(b);
    Racional m = a.multiplicar(b);
    Racional un_cuarto = Racional(1, 4);

    printf("a  = ");
    a.imprimir();
    printf("b  = ");
    b.imprimir();
    printf("a + b = ");
    s.imprimir();
    printf("a * b = ");
    m.imprimir();
    printf("a igual a 1/4: %d\n", a.igual(un_cuarto));
    printf("a igual a b:   %d\n", a.igual(b));
    return 0;
}
```

```text
a  = 1/4
b  = 3/10
a + b = 11/20
a * b = 3/40
a igual a 1/4: 1
a igual a b:   0
```

La cuenta de la suma, paso a paso: $\frac{1}{4} + \frac{3}{10}$ tiene numerador
$1 \cdot 10 + 4 \cdot 3 = 22$ y denominador $4 \cdot 10 = 40$; el constructor
calcula $\operatorname{mcd}(22, 40) = 2$ y guarda $11/20$. Nadie del `main`
pidió que se simplificara.

## El contrato: qué exige cada operación

La caja dice que `crear` exige $q \neq 0$. Eso es una **precondición**: una
obligación de quien llama, no de quien implementa. Si el llamador la viola,
ninguna ecuación promete nada.

Sin nada que la vigile, `Racional(10, 0)` compila y corre. La biblioteca
estándar permite vigilarla en la frontera:

```cpp
#include <cassert>

Racional::Racional(int p, int q) {
    assert(q > 0);
    ...
}
```

!!! note "Qué hace `assert`"

    Evalúa la condición. Si es verdadera, el programa sigue como si la línea no
    existiera. Si es falsa, detiene el programa en ese punto y anuncia el
    archivo, la línea y la condición que falló.

```cpp
Racional bueno = Racional(2, 3);

printf("antes del racional prohibido: ");
bueno.imprimir();

Racional prohibido = Racional(10, 0);
prohibido.imprimir();
```

```text
antes del racional prohibido: 2/3
prohibido: racional.cpp:7: Racional::Racional(int, int): Assertion `q > 0' failed.
```

El programa alcanza a imprimir el racional bueno, se detiene dentro del
constructor del prohibido y termina con código de salida 134. Compárese con el
retiro que no ocurría y no avisaba de la sesión anterior: la violación del
contrato ahora suena, y suena en el punto exacto donde ocurrió.

Un detalle de la corrida, por si la salida se guarda en un archivo: ahí la
primera línea desaparece. `abort` mata el proceso sin vaciar el búfer de la
salida estándar, y fuera de la terminal ese búfer se vacía por bloques y no por
líneas.

### La exigencia también se diseña

La especificación pedía $q \neq 0$ y el `assert` escrito exige $q > 0$. Son dos
contratos distintos y ninguno es el correcto por definición:

| | exige $q \neq 0$ | exige $q > 0$ |
|---|---|---|
| `crear(1, -2)` | vale y queda $-1/2$ | viola la precondición |
| El signo lo acomoda | `simplificar` | quien llama |
| `simplificar` hace | mcd y ajuste de signo | solo el mcd |
| El `assert` dice | `assert(q != 0)` | `assert(q > 0)` |

Con $q \neq 0$ el llamador vive tranquilo y la implementación trabaja de más.
Con $q > 0$ la implementación pierde el ajuste de signo y la carga se muda a
cada punto del programa que construya racionales. Lo que daña el diseño es no
decidir, o decidir y no escribirlo: la precondición elegida va en la caja del
TAD y el `assert` la copia textual.

### El operador `+`

C++ permite darle a la clase el operador `+`, y entonces el área del programador
se escribe con la notación de siempre sin dejar de pasar por la interfaz:

```cpp
Racional operator+(Racional r) {
    int p = this->num * r.denominador() + this->den * r.numerador();
    int q = this->den * r.denominador();

    return Racional(p, q);
}

bool operator==(Racional r) {
    return this->num * r.denominador() == this->den * r.numerador();
}
```

```cpp
Racional s = a + b;
printf("a + b == 11/20: %d\n", s == once_veinteavos);
```

```text
a + b = 11/20
a + b == 11/20: 1
```

Es el mismo `sumar` con otro nombre. Y el `==` de la clase compara valores, no
direcciones, porque quien lo escribe decide qué significa.

## La prueba de la barrera

Hasta aquí todo es una promesa. La forma de comprobarla es escribir una segunda
implementación de la **misma** `racional.h` que guarde la fracción tal como
llega, sin simplificar:

```cpp
/* racional_directo.cpp */
Racional::Racional(int p, int q) {
    assert(q > 0);
    this->num = p;
    this->den = q;
}

/* Esta representacion no promete forma minima */
void Racional::simplificar() {}
```

El `main` no se toca. Solo cambia con qué archivo se enlaza:

```bash
g++ -Wall -Wextra racional.cpp          main_racional.cpp -o simplificado
g++ -Wall -Wextra racional_directo.cpp  main_racional.cpp -o directo
```

```text
$ ./simplificado                  $ ./directo
a  = 1/4                          a  = 2/8
b  = 3/10                         b  = 15/50
a + b = 11/20                     a + b = 220/400
a * b = 3/40                      a * b = 30/400
a igual a 1/4: 1                  a igual a 1/4: 1
a igual a b:   0                  a igual a b:   0
```

Las dos últimas líneas son las que cuentan. Las memorias no se parecen —una
guarda 1 y 4, la otra 2 y 8— y las respuestas del TAD coinciden, porque `igual`
está escrita con los productos cruzados y no con una comparación campo a campo.
Lo único que cambió afuera es lo que imprime `imprimir`, que es la operación que
sí muestra la representación.

## El TAD Natural: números sin techo

La segunda mitad de la sesión llevó la idea al extremo. Si la representación es
libre, se puede construir un tipo numérico cuyo techo no sea el del `int`.

!!! note "El TAD Natural"

    **Firmas**

    $$
    \begin{aligned}
      \texttt{cero} &: \to \text{Natural}\\
      \texttt{esCero} &: \text{Natural} \to \text{Booleano}\\
      \texttt{sucesor} &: \text{Natural} \to \text{Natural}\\
      \texttt{predecesor} &: \text{Natural} \to \text{Natural},
        \quad \text{exige } \texttt{esCero} \text{ falso}
    \end{aligned}
    $$

Cuatro operaciones, y ninguna es la suma. La representación es un arreglo de
dígitos en base 10, del menos significativo al más significativo:

| `digitos[0]` | `digitos[1]` | `digitos[2]` |
|---:|---:|---:|
| 5 | 0 | 3 |

Ese arreglo es el 305. Y el invariante que lo sostiene es corto:

!!! note "Invariante de representación"

    $$\forall i,\ 0 \leq i < \texttt{TAM}: \quad 0 \leq \mathit{digitos}[i] \leq 9$$

`sucesor` suma uno al dígito menos significativo y propaga el acarreo mientras
encuentre nueves; `predecesor` pide prestado en la otra dirección mientras
encuentre ceros.

```cpp
/* Suma uno al digito menos significativo y propaga el acarreo */
void Natural::sucesor() {
    int pos = 0;

    while (pos < TAM && this->digitos[pos] == 9) {
        this->digitos[pos] = 0;
        pos = pos + 1;
    }
    if (pos < TAM) {
        this->digitos[pos] = this->digitos[pos] + 1;
    }
}

/* Precondicion: el numero no es cero. Pide prestado hacia la izquierda */
void Natural::predecesor() {
    int pos = 0;

    assert(!this->esCero());
    while (pos < TAM && this->digitos[pos] == 0) {
        this->digitos[pos] = 9;
        pos = pos + 1;
    }
    if (pos < TAM) {
        this->digitos[pos] = this->digitos[pos] - 1;
    }
}
```

El ciclo se escribe pensando primero en el caso límite. El caso corriente —un
dígito que no es 9— no entra al `while` y le suma uno al primero; el caso
interesante es el 199, donde el acarreo tiene que recorrer dos posiciones antes
de encontrar dónde caer.

Sobre una representación de cuatro dígitos, paso a paso:

```text
sucesor de 199
  antes               0199
    acarreo, pos = 1
    acarreo, pos = 2
  despues             0200

sucesor de 200
  antes               0200
  despues             0201

predecesor de 1000
  antes               1000
    prestamo, pos = 1
    prestamo, pos = 2
    prestamo, pos = 3
  despues             0999
```

### Aritmética con lo que hay

La interfaz no trae suma. Y con `sucesor`, `predecesor` y `esCero` alcanza:
sumar $b$ a $a$ es aplicarle `sucesor` a $a$ tantas veces como `predecesor` haga
falta para agotar $b$.

```cpp
/* Los dos naturales llegan por copia: la funcion gasta a b contando */
Natural sumar(Natural a, Natural b) {
    while (!b.esCero()) {
        a.sucesor();
        b.predecesor();
    }
    return a;
}
```

| Paso | `a` | `b` |
|---:|---:|---:|
| inicio | 123 | 45 |
| 1 | 124 | 44 |
| 2 | 125 | 43 |
| $\vdots$ | $\vdots$ | $\vdots$ |
| 44 | 167 | 1 |
| 45 | 168 | 0 |

La función destruye sus dos parámetros y eso está bien, porque los dos llegaron
por valor: son copias, y el `a` y el `b` del llamador no se enteran. Es el paso
por valor de la sesión anterior, ahora usado a propósito.

La multiplicación se para sobre la suma con la misma idea:

```cpp
Natural multiplicar(Natural a, Natural b) {
    Natural salida = Natural();

    while (!b.esCero()) {
        salida = sumar(salida, a);
        b.predecesor();
    }
    return salida;
}
```

| Vuelta | `salida` | `b` |
|---:|---:|---:|
| inicio | 0 | 10 |
| 1 | 45 | 9 |
| 2 | 90 | 8 |
| $\vdots$ | $\vdots$ | $\vdots$ |
| 10 | 450 | 0 |

Arrancar `salida` en cero, y no en `a`, es lo que hace que $b = 0$ no necesite
un caso aparte: el `while` no entra y la respuesta es cero.

```text
a         = 0000000123
b         = 0000000045
d         = 0000000010
a + b     = 0000000168
b * d     = 0000000450
a * (b*d) = 0000055350
a sigue en 0000000123
```

La última línea es la que confirma lo de las copias: después de haber sido
sumado y multiplicado, `a` sigue valiendo 123.

### Cambiar la representación sin tocar el programa

`TAM` en `natural.h` vale 10. Cambiarlo a 3 es una línea, y ni `main_natural.cpp`
ni `sumar` ni `multiplicar` se enteran:

```cpp
static const int TAM = 3;
```

```text
a         = 123
b         = 045
d         = 010
a + b     = 168
b * d     = 450
a * (b*d) = 350
```

Compila, enlaza y corre. Y en la última línea aparece el precio de haber
elegido tres dígitos: 55 350 no cabe, y lo que sale es 350, que son los tres
dígitos de abajo. El acarreo del `while` llegó al final del arreglo, encontró
`pos == TAM` y el `if` no lo dejó escribir en ninguna parte:

```text
sucesor de 9999, el tope de la representacion
  antes               9999
    acarreo, pos = 1
    acarreo, pos = 2
    acarreo, pos = 3
    acarreo, pos = 4
  despues             0000
```

!!! danger "El tope se mudó, no desapareció"

    Con `TAM = 3` el tipo da la vuelta en 999 exactamente como el `int` da la
    vuelta en $2^{31} - 1$: en silencio, con un resultado perfectamente válido y
    perfectamente equivocado. Lo que cambió es quién fija ese tope. Ya no es el
    procesador: es una línea de la implementación, y subirla a 10, a 100 o a
    1000 dígitos no toca el programa que usa el tipo.

Ahí está el pago de la abstracción, y es el mismo que hace que el entero de
Python no se desborde. La eficiencia es otra historia: contar de uno en uno
para multiplicar es lentísimo, y esa cuenta se hace más adelante.

## Ejercicios de la sesión

### Predecir la igualdad

```cpp
Racional a = Racional(2, 8);
Racional b = Racional(1, 4);
printf("%d\n", a.igual(b));
```

Los dos productos cruzados son $2 \cdot 4 = 8$ y $8 \cdot 1 = 8$. Como
coinciden, imprime `1`. La respuesta no depende de si la clase simplifica: es
la misma sobre las dos implementaciones.

### Especificar sin implementar: el TAD Dinero

Escribir la caja del TAD Dinero para montos en pesos y centavos:

- El **dominio**: qué pares $(\mathit{pesos}, \mathit{centavos})$ son montos
  válidos.
- Las **firmas** de `crear`, `pesos`, `centavos` y `sumar`, con sus
  precondiciones.
- Dos **ecuaciones** para `crear`: una para el rango de los centavos y una que
  diga que el monto se conserva.

Pista: $\texttt{crear}(3, 250)$ puede ser un llamado válido o una violación de
precondición. Las dos decisiones son defendibles; el contrato debe tomar una y
decirla. Si es violación, escribir también el `assert` que la vigila.

## Para practicar en casa

### Propuesto 1

Agregar `restar` al área del programador usando solo `crear`, `numerador` y
`denominador`. Verificar que corre idéntica sobre las dos implementaciones,
enlazando el mismo `main` primero con `racional.cpp` y después con
`racional_directo.cpp`.

### Propuesto 2

¿Puede la representación interna ser un solo `double` con el valor de la
división? Usar la ecuación
$\texttt{numerador}(r) \cdot q = \texttt{denominador}(r) \cdot p$ y el
experimento del tercio para argumentar por qué no.

### Propuesto 3

Proponer una tercera representación: campos
$(\mathit{signo}, \mathit{num}, \mathit{den})$ con $\mathit{num} \geq 0$ y
$\mathit{den} > 0$. Escribir su invariante de representación y decir qué cambia
en la clase y qué queda intacto afuera.

### Propuesto 4

`imprimir` del Natural muestra los ceros de la izquierda: el 123 sale como
`0000000123`. Escribir una versión que arranque en el dígito significativo más
alto y que imprima `0` cuando el número sea cero. Es un cambio que vive entero
dentro de la clase.

### Propuesto 5

Sobre el Natural, implementar el **TAD Entero** como pareja
$(\mathit{signo}, \mathit{magnitud})$ con la misma interfaz. Dos cosas para
observar al escribirlo: el invariante que hace único al cero, y que
`predecesor` pierde su precondición, porque en $\mathbb{Z}$ todo número tiene
predecesor. Un contrato puede volverse más generoso al cambiar el dominio.

### Pistas

- **Propuesto 1**: $\frac{a}{b} - \frac{c}{d} = \frac{ad - cb}{bd}$. Con
  `crear` exigiendo $q > 0$, el denominador $bd$ ya es positivo si los dos lo
  eran.
- **Propuesto 2**: la ecuación pide dos enteros que cumplan una igualdad exacta.
  Un `double` que guarde $1/3$ no puede devolver un numerador y un denominador
  que la satisfagan, porque el valor guardado ya no es $1/3$.
- **Propuesto 3**: el invariante gana una condición sobre el signo del cero, y
  `imprimir` es el único método que cambia de forma visible.
- **Propuesto 4**: recorrer desde `TAM - 1` hacia abajo buscando el primer
  dígito distinto de cero; si no aparece ninguno, el número es cero.
- **Propuesto 5**: `sucesor` de un negativo es `predecesor` de su magnitud, y
  al revés.

## Ejercicios interactivos

Dos actividades de esta sesión se trabajan en el navegador: un TAD Hora con dos
implementaciones que hay que clasificar de qué lado de la barrera vive cada
línea, y el mismo TAD con la precondición en juego —una hora 26 que despierta al
`assert` y dos contratos que reparten distinto el desborde de los minutos:
[página de ejercicios interactivos](./Ejercicios.md). Los programas no son los
de arriba: mismo tema, ronda nueva.

## Código de la clase

Compilación y ejecución:

```bash
g++ -Wall -Wextra archivo.cpp -o archivo && ./archivo
```

Los archivos con cabecera se enlazan de a dos:

```bash
g++ -Wall -Wextra racional.cpp main_racional.cpp -o racional && ./racional
g++ -Wall -Wextra natural.cpp  main_natural.cpp  -o natural  && ./natural
```

**El problema que motiva**

- [tercio.cpp](codigo/tercio.cpp) — el tercio y el `0.1 + 0.2` con veinte
  decimales

**El TAD Racional**

- [racional.h](codigo/racional.h) — la interfaz, con su guarda de inclusión
- [racional.cpp](codigo/racional.cpp) — la implementación que simplifica en el
  constructor
- [racional_directo.cpp](codigo/racional_directo.cpp) — la otra implementación
  de la misma cabecera, que guarda lo que llega
- [main_racional.cpp](codigo/main_racional.cpp) — el programa que corre igual
  sobre las dos
- [racional_prohibido.cpp](codigo/racional_prohibido.cpp) — el `assert` que
  detiene el programa
- [racional_operador.cpp](codigo/racional_operador.cpp) — la misma clase con
  `operator+` y `operator==`
- [traza_euclides.cpp](codigo/traza_euclides.cpp) — el máximo común divisor
  paso a paso

**El TAD Natural**

- [natural.h](codigo/natural.h) — la interfaz y el `TAM` que fija la
  representación
- [natural.cpp](codigo/natural.cpp) — el acarreo y el préstamo
- [main_natural.cpp](codigo/main_natural.cpp) — `sumar` y `multiplicar` escritas
  solo con la interfaz
- [traza_sucesor.cpp](codigo/traza_sucesor.cpp) — el acarreo, el préstamo y el
  tope de la representación

## Referencias

- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 2 (tipos abstractos de datos).
- R. Sebesta. *Concepts of Programming Languages*. Pearson, 2015. Capítulo 11
  (abstracción de datos y encapsulación).
- N. Kalicharan. *Data Structures in C*. 2008. Tipos definidos por el
  programador.
