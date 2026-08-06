# Clase 3. Introducción a la complejidad computacional

Miércoles 5 de agosto de 2026.

La clase pasada terminó con `gcc -Wall -Wextra` y con las cuatro etapas
que convierten un archivo de texto en un ejecutable. Las banderas avisan
de fallas posibles, pero no dicen nada sobre si el programa resuelve bien
el problema. Y "bien" admite varias medidas: qué tan difícil fue
escribirlo, cuánta memoria pide, cuánto se tarda. Esta sesión se ocupa de
la última, y la ataca sin cronómetro: contando instrucciones.

## Diapositivas

![](clase03.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## El problema del que salió todo

Dado un arreglo de $n$ enteros, contar cuántos valores pares están en
posiciones pares.

Para $\{4, 7, 3, 1, 8, 5\}$ la respuesta es 2. Conviene hacer la traza
completa antes de escribir código, porque hay dos condiciones que se
tienen que cumplir a la vez y es fácil confundirlas:

| Posición | ¿Posición par? | Valor | ¿Valor par? |
|---|---|---|---|
| 0 | sí | 4 | sí |
| 1 | no | 7 | |
| 2 | sí | 3 | no |
| 3 | no | 1 | |
| 4 | sí | 8 | sí |
| 5 | no | 5 | |

Las posiciones pares son 0, 2 y 4, con valores 4, 3 y 8. El 3 no es par,
así que no cuenta. Quedan dos.

La primera solución recorre todo el arreglo y pregunta por las dos
condiciones en cada paso:

```c title="contar_v1"
int contar_v1(int datos[], int n) {
    int cuenta = 0;
    int i = 0;
    while (i < n) {
        if (i % 2 == 0 && datos[i] % 2 == 0) {
            cuenta = cuenta + 1;
        }
        i = i + 1;
    }
    return cuenta;
}
```

La segunda se ahorra la mitad del trabajo saltando de dos en dos: si el
índice arranca en 0 y avanza de a dos, todas las posiciones que visita ya
son pares y sobra preguntarlo.

```c title="contar_v2"
int contar_v2(int datos[], int n) {
    int cuenta = 0;
    int i = 0;
    while (i < n) {
        if (datos[i] % 2 == 0) {
            cuenta = cuenta + 1;
        }
        i = i + 2;
    }
    return cuenta;
}
```

Sobre $\{4, 7, 3, 1, 8, 5\}$ ambas responden 2. Las dos son correctas, y
esa es justamente la incomodidad: si las dos sirven, ¿con cuál se queda
uno?

## Un paréntesis: los operadores de cortocircuito

Antes de responder salió una pregunta que valía la pena atender de una
vez, porque el `&&` de `contar_v1` no es un detalle de escritura. En C hay
dos formas de escribir la conjunción: `&&` y `&`. La primera es un
**operador de cortocircuito**; la segunda no.

En clase se abrió un archivo nuevo para verlo:

```c title="Operadores.cpp"
#include <stdio.h>

int main() {
  int arr[] = {1, 2, 3, 4};
  int index = 4;

  // EL operador dde cortocircuito && si la primera es falsa no verifica mas
  //  El operador de cortocircuito || si la primera es verdadero no verifica las
  //  demás
  //  //EL operador dde cortocircuito && si la primera es falsa no verifica mas
  //   El operador de cortocircuito || si la primera es verdadero no verifica
  //   las demás
  printf(" Ejemplo %b", index < 4 && arr[index] % 2 == 0);
  printf(" Ejemplo %b", index <= 4 & arr[index] % 2 == 0);
  return 0;
}
```

```console
$ gcc -Wall -Wextra Operadores.cpp -o exe
Operadores.cpp:14:31: warning: suggest parentheses around comparison in
 operand of ‘&’ [-Wparentheses]
   14 |   printf(" Ejemplo %b", index <= 4 & arr[index] % 2 == 0);
      |                         ~~~~~~^~~~
$ ./exe
 Ejemplo 0 Ejemplo 1
```

El arreglo tiene cuatro casillas, con índices de 0 a 3, e `index` vale 4.
Preguntar por `arr[4]` es salirse.

En la primera línea, `index < 4` es falso. Con `&&` eso basta para decidir
que toda la conjunción es falsa —en una conjunción, una premisa falsa
tumba el resultado— y el programa **ni siquiera evalúa** `arr[index]`. Por
eso imprime 0 y nada malo pasa.

En la segunda, con `index <= 4`, la primera condición es verdadera; y como
`&` no corta, la segunda se evalúa igual. Ahí sí se lee la posición 4 del
arreglo, que no existe: lo que salió fue la basura que hubiera en esa
dirección de memoria, y dio verdadero. El programa imprimió 1 sin
quejarse.

El `||` funciona al revés y por la misma razón: si la primera condición es
verdadera, la disyunción ya está decidida y las demás no se revisan.

!!! tip "El cortocircuito como guardia"

    Este comportamiento se usa a propósito. Cuando se recorre un arreglo o
    una matriz con condiciones que pueden mover el índice fuera del área
    válida, se pone primero la comprobación de rango:

    ```c
    while (i < n && datos[i] != v) { ... }
    ```

    Si `i` alcanza a `n`, la primera condición falla y `datos[i]` no llega
    a evaluarse nunca. Escrito con `&`, ese mismo ciclo leería memoria
    ajena en la última vuelta. El truco aparece otra vez más adelante, en
    `buscar_corte`.

Dos apuntes sobre el archivo tal como quedó: `%b` es el formato de C23 para
imprimir en binario, y por eso los valores 0 y 1 se ven bien; y la
advertencia de `-Wparentheses` es gcc pidiendo paréntesis en la línea del
`&`, que es exactamente la línea donde está la trampa.

## ¿Cuál de las dos es mejor?

Vuelta al problema. Para escoger hace falta un criterio, y en la clase se
pusieron tres sobre la mesa.

El primero, **la longitud del código**, no discrimina nada: las dos
versiones tienen prácticamente las mismas líneas, y la única diferencia es
una condición de más en el `if`. Quedan dos recursos por examinar.

- Cuánto se tarda el algoritmo: **complejidad computacional**.
- Cuánta memoria necesita: **complejidad espacial**.

De aquí en adelante esos dos nombres se usan con ese significado exacto.
Ambos importan. Un programa que resuelve el problema guardando una matriz
gigante cuando le bastaba un arreglo lo resuelve igual de bien, pero
desperdicia memoria, y eso es una decisión de diseño mala aunque el
resultado sea correcto. En el curso el peso mayor se lo lleva la
complejidad computacional, que es también la que se hereda hacia Árboles y
Grafos: cuando allá pidan "un algoritmo de complejidad lineal" o "de
complejidad cuadrática", están hablando de esto.

## El reloj no mide el algoritmo

Parece que la manera obvia de comparar es cronometrar. Para probarlo se
tomó un programa pequeño, que suma los enteros de 0 a $m - 1$:

```c title="suma_hasta.c"
long suma_hasta(long m) {
    long i = 0;
    long suma = 0;
    while (i < m) {
        suma = suma + i;
        i = i + 1;
    }
    return suma;
}
```

Linux trae el comando `time`, que informa cuánto tardó un programa. Con
tres entradas distintas:

| $m$ | Tiempo |
|---:|---:|
| $10^{7}$ | 0,012 s |
| $10^{8}$ | 0,118 s |
| $10^{9}$ | 1,141 s |

Cada vez que $m$ se multiplica por diez, el tiempo se multiplica por cerca
de diez. El reloj sí está midiendo algo real.

El problema aparece al repetir la medición. El mismo programa, la misma
máquina, la misma entrada $m = 10^{9}$:

| Corrida | Tiempo |
|---|---:|
| Primera | 1,418 s |
| Segunda | 0,958 s |
| Tercera | 0,948 s |
| Compilado con `gcc -O2` | 0,266 s |

Tres corridas idénticas dieron tres tiempos distintos. Y la cuarta fila es
peor todavía: `-O2` es una bandera de optimización, así que el programa
corrió cuatro veces más rápido **sin que el código cambiara ni una letra**.
Lo que cambió fue cómo se compiló.

Detrás de esa variación hay procesos del sistema operativo compitiendo por
el procesador, latencias de acceso a memoria y, sobre todo, la memoria
caché. Cuando un programa se ejecuta se carga en RAM, pero el procesador no
lee de la RAM directamente: pasa primero por la caché, que es mucho más
pequeña y mucho más rápida. Los procesadores modernos tienen varios
niveles —L1 por núcleo, L2 por núcleo, L3 compartida—, y la caché es uno de
los datos que vale la pena mirar al comprar un computador, porque un
procesador grande con caché pequeña se pasa el tiempo esperando datos.
Nada de eso tiene que ver con el algoritmo.

!!! warning "Esto aplica a los informes del curso"

    Cuando midan tiempos para un informe, tengan presente de qué dependen
    esos números. Si mientras corre la medición hay otro programa pesado
    abierto, los tiempos cambian. Reportar una sola corrida como si fuera
    "el tiempo del algoritmo" es reportar una anécdota.

Hace falta una medida que dé lo mismo en cualquier máquina.

## Contar instrucciones

> La complejidad computacional es una medida de la cantidad de recursos que
> un algoritmo usa para resolver un problema. Los dos recursos principales
> son el procesamiento y la memoria.

El modelo de conteo viene de CLRS, sección 2.2, y es deliberadamente
grueso: **cada instrucción simple cuesta lo mismo, una unidad**. Una
asignación, una comparación, una operación aritmética, la creación de una
variable: todas valen 1. El costo del algoritmo es el número de
instrucciones que ejecuta, escrito como una función del tamaño de la
entrada.

Ese número es idéntico en un portátil viejo y en un servidor nuevo. Solo
depende del algoritmo y de la entrada.

El método consiste en anotar al frente de cada línea cuántas veces se
ejecuta, y sumar. El caso más simple:

| Línea | Veces |
|---|---:|
| `int doble(int n) {` | |
| `    int resultado = 2 * n;` | 1 |
| `    return resultado;` | 1 |
| `}` | |

Las llaves no ejecutan nada. La multiplicación con su asignación es una
operación elemental y vale 1; el `return` también. Entonces

$$T(n) = 1 + 1 = 2.$$

`doble(4)` y `doble(1000)` ejecutan las mismas dos instrucciones. Cuando
$T$ no depende de la entrada, el costo es **constante**.

## El ciclo y la evaluación que sobra

Con `suma_hasta` la cosa deja de ser mecánica, porque el bloque de adentro
del `while` no se ejecuta una vez sino tantas como se repita el ciclo.

Para saber cuántas, hay que hacer la prueba de escritorio. Con $m = 3$:

| Evaluación | $i$ | ¿$i < 3$? | Acción |
|---|---|---|---|
| 1 | 0 | cierto | `suma` $= 0$, $i = 1$ |
| 2 | 1 | cierto | `suma` $= 1$, $i = 2$ |
| 3 | 2 | cierto | `suma` $= 3$, $i = 3$ |
| 4 | 3 | falso | sale del ciclo |

La condición se evaluó cuatro veces; el cuerpo se ejecutó tres. Esa
diferencia de uno es el punto que más cuesta ver.

La razón es que **la evaluación que falla también se ejecuta**. El programa
tiene que preguntar `3 < 3` para enterarse de que debe salir; esa pregunta
es una comparación, y cuesta lo mismo que cualquier otra. Entre 0 y $m-1$
hay $m$ valores que dan cierto, y hace falta uno más, el que da falso.
Entonces la condición entra $m + 1$ veces.

El conteo completo:

| Línea | Veces |
|---|---:|
| `int i = 0;` | 1 |
| `int suma = 0;` | 1 |
| `while (i < m)` | $m + 1$ |
| `    suma = suma + i;` | $m$ |
| `    i = i + 1;` | $m$ |
| `return suma;` | 1 |

$$T(m) = 1 + 1 + (m + 1) + m + m + 1 = 3m + 4.$$

El cuerpo aporta $2m$ porque tiene dos instrucciones y se repite $m$ veces;
la condición aporta el $m + 1$; las inicializaciones y el `return` aportan
las tres constantes.

!!! note "El ciclo `for` se cuenta igual"

    Un `for` no cambia el análisis: tiene las mismas partes que el `while`,
    solo que escritas en una sola línea. La inicialización se ejecuta una
    vez, la condición $m + 1$ veces y el incremento $m$ veces.

Probando valores de $m$:

| $m$ | $T(m) = 3m + 4$ |
|---:|---:|
| 3 | 13 |
| 10 | 34 |
| 100 | 304 |
| 1000 | 3004 |

Cada vez que $m$ se multiplica por diez, $T(m)$ se multiplica por cerca de
diez. Es el mismo patrón que mostró el cronómetro al principio
($0{,}012 \to 0{,}118 \to 1{,}141$), pero ahora el número no depende de la
máquina, no cambia entre corridas y no lo altera `-O2`. Cuando $T$ se
comporta así, el costo es **lineal**: el número de instrucciones crece como
una función lineal del tamaño de la entrada.

Y ese es el vocabulario que se va a usar de aquí en adelante. Decir que un
algoritmo es lineal es decir que su $T$ se comporta como una recta.

## Ahora usted: sumar un arreglo

El mismo ejercicio, cambiando el acumulador por una lectura del arreglo:

| Línea | Veces |
|---|---:|
| `int i = 0;` | 1 |
| `int suma = 0;` | 1 |
| `while (i < n)` | $n + 1$ |
| `    suma = suma + datos[i];` | $n$ |
| `    i = i + 1;` | $n$ |
| `return suma;` | 1 |

$$T(n) = 3n + 4.$$

El esqueleto es idéntico al de `suma_hasta`. Un ciclo que recorre la
entrada completa produce un costo lineal, sin importar qué haga adentro
mientras el adentro sea de tamaño fijo.

## Cuando el conteo depende de los datos

Hasta aquí todo salió con solo mirar el código. Ahora entra un `if` dentro
del ciclo, y con él la primera dificultad de verdad:

```c title="buscar.c"
int buscar(int datos[], int n, int v) {
    int esta = 0;
    int i = 0;
    while (i < n) {
        if (datos[i] == v) {
            esta = 1;
        }
        i = i + 1;
    }
    return esta;
}
```

Las primeras líneas se cuentan como siempre. La condición del `while` se
evalúa $n + 1$ veces y el `if` se pregunta $n$ veces, porque la pregunta se
hace en cada vuelta pase lo que pase. El problema es la línea de adentro:

| Línea | Veces |
|---|---:|
| `int esta = 0;` | 1 |
| `int i = 0;` | 1 |
| `while (i < n)` | $n + 1$ |
| `    if (datos[i] == v)` | $n$ |
| `        esta = 1;` | $k$ |
| `    i = i + 1;` | $n$ |
| `return esta;` | 1 |

$$T(n) = 3n + k + 4.$$

Esa $k$ no se puede escribir en función de $n$: es el número de veces que
la condición del `if` resultó cierta, y eso depende de **cómo viene la
entrada**, no de su tamaño. Si `v` no aparece nunca, $k = 0$. Si aparece en
todas las posiciones, $k = n$.

> Para un tamaño de entrada $n$, el **peor caso** es la entrada que obliga a
> ejecutar el mayor número de instrucciones, y el **mejor caso**, la que
> exige el menor.

Para `buscar`:

- Mejor caso: `v` no está, $k = 0$, y $T(n) = 3n + 4$.
- Peor caso: `v` está en todas las posiciones, $k = n$, y $T(n) = 4n + 4$.

Los dos casos son lineales, porque este algoritmo recorre el arreglo
completo pase lo que pase. La entrada mueve la constante, no el
comportamiento.

Esa es la señal que hay que aprender a reconocer: **apenas aparece un `if`
adentro de un ciclo, hay que preguntarse qué pasa si nunca entra y qué pasa
si entra siempre**.

## El mismo código, dos comportamientos

Ahora la variación interesante: cortar el recorrido apenas se encuentra el
valor. El truco es la condición compuesta, con el cortocircuito del
principio de la clase haciendo de guardia.

```c title="buscar_corte.c"
int buscar_corte(int datos[], int n, int v) {
    int esta = 0;
    int i = 0;
    while (i < n && esta == 0) {
        if (datos[i] == v) {
            esta = 1;
        }
        i = i + 1;
    }
    return esta;
}
```

Se trazaron los dos extremos con `datos` $= \{3, 4, 5, 1, 6\}$, que tiene
cinco elementos.

**Con `v` $= 3$**, el valor está de primero:

| Evaluación | $i$ | ¿$i < n$? | ¿`esta` $= 0$? | Acción |
|---|---|---|---|---|
| 1 | 0 | cierto | cierto | `esta` $= 1$, $i = 1$ |
| 2 | 1 | cierto | falso | sale del ciclo |

Dos inicializaciones, dos evaluaciones de la condición, un `if`, una
asignación, un incremento y un `return`:

$$T = 8.$$

Ocho instrucciones. Y aquí está lo importante: ocho da igual si el arreglo
tiene cinco elementos, mil o un millón. Si el valor buscado es el primero,
el ciclo entra una vez y sale. **El mejor caso es constante.**

**Con `v` $= 9$**, que no está, el ciclo recorre todo y `esta` nunca cambia:

| Línea | Veces ($n = 5$) | Veces (general) |
|---|---:|---:|
| `int esta = 0;` | 1 | 1 |
| `int i = 0;` | 1 | 1 |
| `while (i < n && esta == 0)` | 6 | $n + 1$ |
| `    if (datos[i] == v)` | 5 | $n$ |
| `        esta = 1;` | 0 | 0 |
| `    i = i + 1;` | 5 | $n$ |
| `return esta;` | 1 | 1 |

Suman 19, que es exactamente $3 \cdot 5 + 4$:

$$T(n) = 3n + 4.$$

El mismo código, entonces, es constante en el mejor caso y lineal en el
peor. Lo que decide no es el tamaño de la entrada sino su forma: si lo
buscado está de primero, o si no está.

!!! note "Cuál de los dos se reporta"

    Cuando no se dice otra cosa, en este curso se analiza el **peor caso**.
    Es la única garantía que el algoritmo cumple con cualquier entrada: sea
    lo que sea que le den, no va a costar más que eso. También existe el
    caso promedio, y para muchos algoritmos está alrededor de la mitad del
    peor caso, pero calcularlo exige suponer cómo se distribuyen las
    entradas, y esa suposición casi nunca se puede justificar. El peor caso
    no necesita suposiciones.

Vale la pena guardar este par de ejemplos, porque el mismo patrón vuelve en
los algoritmos de ordenamiento del semestre entrante: varios tienen un peor
caso cuadrático y un mejor caso mucho más barato, y la diferencia está en
cómo viene ordenada la entrada.

## Un ciclo adentro de otro

```c title="suma_productos.c"
int suma_productos(int datos[], int n) {
    int suma = 0;
    int i = 0;
    while (i < n) {
        int j = 0;
        while (j < n) {
            suma = suma + datos[i] * datos[j];
            j = j + 1;
        }
        i = i + 1;
    }
    return suma;
}
```

Las líneas de afuera se cuentan como siempre: dos inicializaciones, la
condición externa $n + 1$ veces, el incremento de `i` $n$ veces, un
`return`. Y `int j = 0;` se ejecuta $n$ veces, porque está adentro del ciclo
externo.

El bloque de adentro se analiza aparte. Conviene ir despacio:

- El ciclo externo le da a `i` los valores $0, 1, 2, \ldots, n-1$. Son $n$
  valores.
- Para **cada uno** de esos valores, `j` arranca en 0 y llega hasta $n-1$.
  Son $n$ valores de `j` cada vez.
- Como `j` no depende de `i`, el recorrido interno es el mismo las $n$
  veces.

Entonces las dos instrucciones del cuerpo interno se ejecutan $n$ veces por
cada una de las $n$ vueltas del externo: $n^{2}$ cada una.

Y falta lo que más se olvida. La condición `j < n` no se evalúa $n$ veces
por vuelta sino $n + 1$, porque el ciclo interno también tiene que salir. Y
eso se repite $n$ veces:

$$\text{evaluaciones de } \texttt{j < n} = n(n + 1) = n^{2} + n.$$

| Línea | Veces |
|---|---:|
| `int suma = 0;` | 1 |
| `int i = 0;` | 1 |
| `while (i < n)` | $n + 1$ |
| `    int j = 0;` | $n$ |
| `    while (j < n)` | $n(n + 1)$ |
| `        suma = suma + datos[i] * datos[j];` | $n^{2}$ |
| `        j = j + 1;` | $n^{2}$ |
| `    i = i + 1;` | $n$ |
| `return suma;` | 1 |

$$T(n) = 1 + 1 + (n + 1) + n + (n^{2} + n) + n^{2} + n^{2} + n + 1 = 3n^{2} + 4n + 4.$$

Este análisis funcionó porque los dos ciclos son independientes. Más
adelante van a aparecer casos donde el interno arranca en `i`, o llega
hasta `i`, y ahí ya no se puede multiplicar: toca sumar vuelta por vuelta.
El ejercicio de cierre es justamente uno de esos.

La tabla de crecimiento pone la diferencia en números:

| $n$ | $3n + 4$ | $3n^{2} + 4n + 4$ |
|---:|---:|---:|
| 10 | 34 | 344 |
| 100 | 304 | 30 404 |
| 1000 | 3004 | 3 004 004 |

Con $n = 1000$ el ciclo anidado ejecuta mil veces más instrucciones. Y eso
es lo que hace que un programa deje de escalar: funciona perfecto en las
pruebas del computador de uno, con datos pequeños, y se cae cuando le
llegan los datos de verdad. Para $n$ grande el término que más crece decide
todo lo demás; ponerle nombre a esa idea es el tema de la próxima sesión.

## La respuesta a la pregunta del inicio

Con lo de hoy ya se puede comparar `contar_v1` y `contar_v2` con números.
Para $n$ par, con $k$ valores pares en posiciones pares:

| Línea | `contar_v1` | `contar_v2` |
|---|---:|---:|
| Inicializaciones | 2 | 2 |
| Condición del `while` | $n + 1$ | $n/2 + 1$ |
| `if` | $n$ | $n/2$ |
| `cuenta = cuenta + 1;` | $k$ | $k$ |
| Incremento de `i` | $n$ | $n/2$ |
| `return` | 1 | 1 |

$$T_{1}(n) = 3n + k + 4 \qquad T_{2}(n) = \tfrac{3}{2}n + k + 4.$$

Con $n = 1000$ y $k = 250$: $T_{1} = 3254$ contra $T_{2} = 1754$.

Las dos soluciones crecen igual —son lineales, y al multiplicar $n$ por
diez ambas multiplican su costo por cerca de diez—, pero `contar_v2`
ejecuta cerca de la mitad de las instrucciones porque no visita las
posiciones que de todos modos iba a descartar. La diferencia está en la
constante que acompaña al término lineal.

## Ejercicios

### Ejercicio 1

Cuente las instrucciones de `menor` y escriba $T$. ¿Tiene mejor y peor
caso?

```c title="menor.c"
int menor(int a, int b) {
    int m = a;
    if (b < a) {
        m = b;
    }
    return m;
}
```

Se resolvió en clase. No hay ciclos: `int m = a;` vale 1, el `if` vale 1 y
el `return` vale 1. La asignación `m = b;` se ejecuta $k$ veces, con $k$
igual a 0 o a 1, así que

$$T = 3 + k.$$

El mejor caso es $b \geq a$: la condición da falso, no se entra y $T = 3$.
El peor es $b < a$, con $T = 4$. Es constante en ambos casos, pero el par
mejor/peor existe igual.

### Ejercicio 2

Dos ciclos, uno después del otro. Escriba $T(n)$. ¿El costo es lineal o
cuadrático?

```c title="doble_suma.c"
int doble_suma(int n) {
    int i = 0;
    int suma = 0;
    while (i < n) {
        suma = suma + i;
        i = i + 1;
    }
    i = 0;
    while (i < n) {
        suma = suma + i * i;
        i = i + 1;
    }
    return suma;
}
```

Cuente cada ciclo por separado y sume los totales, sin olvidar el `i = 0;`
del medio. Dos recorridos completos siguen siendo un costo lineal: lo
cuadrático aparece al anidar, no al encadenar.

### Ejercicio 3

El índice avanza de tres en tres. ¿Cuántas veces itera el ciclo? Escriba
$T(n)$.

```c title="saltos.c"
int saltos(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        cuenta = cuenta + 1;
        i = i + 3;
    }
    return cuenta;
}
```

También se resolvió en clase, y la técnica sirve para cualquier ciclo con
saltos: cuando no se ve de una, se le dan valores concretos a $n$ y se
listan los valores que toma el índice.

| $n$ | Valores de `i` | Iteraciones |
|---:|---|---:|
| 10 | 0, 3, 6, 9 | 4 |
| 19 | 0, 3, 6, 9, 12, 15, 18 | 7 |
| 31 | 0, 3, …, 27, 30 | 11 |

Los conteos son 4, 7 y 11, y $n/3$ da 3,33, 6,33 y 10,33. La función que
lleva de lo uno a lo otro es el **techo**, que redondea hacia arriba
($\lceil 3{,}2 \rceil = 4$), no el piso, que redondea hacia abajo
($\lfloor 3{,}9 \rfloor = 3$). Entonces el ciclo itera
$\lceil n/3 \rceil$ veces, la condición se evalúa
$\lceil n/3 \rceil + 1$ veces y

$$T(n) = 3\left\lceil \frac{n}{3} \right\rceil + 4.$$

Sigue siendo lineal, con una constante tres veces menor.

### Ejercicio de cierre

El ciclo interno depende del externo. Encuentre $T(n)$.

```c title="triangulo.c"
int triangulo(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}
```

Aquí no sirve multiplicar, porque la cantidad de vueltas del ciclo interno
cambia en cada vuelta del externo. Haga la tabla de cuántas veces corre el
interno para $i = 0, 1, 2, \ldots, n-1$ y sume la columna. La traza con
$n = 4$ muestra el patrón.

## Para la próxima sesión

1. Escriba `Operadores.cpp` cambiando `&&` por `&` en la primera línea.
   ¿Qué imprime ahora? Corra el programa varias veces: ¿el resultado es
   siempre el mismo?
2. Mida `suma_hasta` con `time` en su propio computador, cinco veces con la
   misma entrada. Compare la dispersión de los tiempos con la del conteo de
   instrucciones, que es siempre $3m + 4$.
3. Compile `suma_hasta` con y sin `-O2` y mire la diferencia. ¿Cambió $T$?
4. Resuelva los ejercicios 2 y de cierre.

## Código de la clase

Compilación y ejecución:

```bash
gcc -Wall -Wextra archivo.c -o archivo && ./archivo
```

**El problema del inicio**

- [contar.c](codigo/contar.c) — las dos versiones, con su `main` de prueba

**El paréntesis de los operadores**

- [Operadores.cpp](codigo/Operadores.cpp) — el archivo escrito en clase

**El conteo línea a línea**

- [suma_hasta.c](codigo/suma_hasta.c) — recibe $m$ por argumento, para medirlo con `time`
- [suma_arreglo.c](codigo/suma_arreglo.c)

**Mejor y peor caso**

- [buscar.c](codigo/buscar.c)
- [buscar_corte.c](codigo/buscar_corte.c)

**Ciclos anidados**

- [suma_productos.c](codigo/suma_productos.c)

**Ejercicios**

- [menor.c](codigo/menor.c)
- [doble_suma.c](codigo/doble_suma.c)
- [saltos.c](codigo/saltos.c)
- [triangulo.c](codigo/triangulo.c)

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to
  Algorithms*. 4.ª ed., MIT Press, 2022. Sección 2.2 (*Analyzing
  algorithms*).
- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 2.
