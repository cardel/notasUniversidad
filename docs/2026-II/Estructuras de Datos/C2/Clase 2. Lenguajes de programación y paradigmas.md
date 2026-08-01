# Clase 2. Lenguajes de programación y paradigmas

Viernes 31 de julio de 2026.

La clase pasada se escribió `gcc -Wall -Wextra Mayor.cpp -o exe` sin
preguntar qué hacía. Esta sesión abre esa caja: qué es un lenguaje de
programación, quién traduce lo que escribimos, en qué se diferencian un
intérprete y un compilador, por qué hay familias de lenguajes que ni
siquiera usan variables, y cuáles son las cuatro etapas que separan un
archivo de texto de un programa que corre.

## Diapositivas

![](clase02.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Repaso: objetos, clases y relaciones

Antes de entrar en materia se repasó lo que traen de programación
orientada a objetos, porque más adelante en el semestre vamos a definir
tipos abstractos de datos y ese vocabulario hace falta.

Un **objeto** es una abstracción de algo del mundo: tiene atributos, que
son sus características, y comportamiento, que es lo que sabe hacer. Un
carro tiene marca, color y placa; sabe arrancar, acelerar y frenar. La
**clase** es la plantilla desde la que se fabrican los objetos: describe
qué atributos y qué operaciones tendrá cada uno, y de una sola clase
salen tantos objetos como se quieran.

Entre clases hay tres relaciones que conviene distinguir:

| Relación | Qué expresa | Ejemplo |
|---|---|---|
| Herencia | Es un tipo de | Un mamífero es un animal |
| Agregación | Usa a, pero puede existir sin él | Un curso usa un salón |
| Composición | Está hecho de, y no sobrevive por separado | Un carro y su motor |

El **polimorfismo** es lo que permite tratar a un mamífero y a un reptil
como animales cuando lo único que interesa es que ambos respiran. Se
llama a la misma operación y cada uno responde a su manera.

!!! note "Ningún lenguaje pertenece a un solo paradigma"

    Java se concibió como orientado a objetos y hoy tiene expresiones
    lambda; C++ permite escribir C puro, clases, o plantillas genéricas.
    Los paradigmas describen formas de pensar el programa, no
    compartimentos donde cada lenguaje cabe una sola vez.

## La orden que nadie preguntó

```bash
gcc -Wall -Wextra hola.c -o hola
```

Tres preguntas que la clase pasada quedaron sin hacer: qué es `gcc`, qué
le hace exactamente al archivo, y por qué hay que pedirle `-Wall` si el
programa ya funciona.

La tercera tiene respuesta inmediata, y es el mismo programa de la
sesión anterior:

```c title="warn_asignacion.c"
/* La condicion asigna en vez de comparar: compila, pero miente */
#include <stdio.h>

int main(void) {
    int x;

    x = 0;
    if (x = 5) {
        printf("entro al if aunque x valia 0\n");
    }
    return 0;
}
```

Sin banderas, `gcc` compila callado. Con ellas aparece el aviso:

```console
$ gcc -Wall -Wextra warn_asignacion.c -o warn_asignacion
warn_asignacion.c:8:9: warning: suggest parentheses around assignment
 used as truth value [-Wparentheses]
    8 |     if (x = 5) {
      |         ~~^~~
```

Lo nuevo hoy es de dónde sale ese mensaje. No lo produce `gcc` como un
todo: nace en una fase concreta del compilador, y al final de la sesión
vamos a poder señalarla con el dedo.

## Dígale esto al computador

> Sume los números de la lista y muéstreme el resultado.

Un compañero de curso entendería la frase sin problema. El computador
no, y la razón no es que sea bruto: es que la frase admite más de una
lectura.

- "Los números de la lista": ¿la lista entera, o solo hasta el primer
  negativo? Las dos lecturas son legítimas y la frase no elige.
- "Muéstreme el resultado": ¿escribirlo en pantalla, o devolverlo a
  quien preguntó para que siga calculando? Tampoco lo dice.

El español vive cómodo con esa holgura porque quien escucha completa lo
que falta. Un lenguaje de programación no puede permitírsela: cada
construcción tiene que significar exactamente una cosa, siempre la
misma.

## Qué es un lenguaje de programación

!!! abstract "Definición"

    Los algoritmos se desarrollan e implementan mediante lenguajes de
    programación. Un lenguaje de programación es un mecanismo de
    comunicación compuesto por un vocabulario y un conjunto de reglas
    gramaticales, cuyo propósito es ordenarle al computador que realice
    una tarea específica.

    Sebesta, *Concepts of Programming Languages*, cap. 1.

El vocabulario son las palabras admitidas: `int`, `while`, `return`, los
operadores y los nombres que uno inventa. Las reglas gramaticales dicen
en qué orden pueden aparecer. La definición deja algo por fuera, y esa
omisión es medio tema de la clase: falta el **significado** de cada
construcción. Volvemos a eso cuando hablemos de semántica.

## El nivel de un lenguaje

!!! abstract "Definición"

    Un lenguaje puede hacer el desarrollo de programas más fácil o más
    difícil según el nivel de abstracción que requiera y la cantidad de
    conocimiento del funcionamiento interno del computador que exija.
    Entre más familiar sea el lenguaje para expresar el problema, más
    alto es su nivel.

De abajo hacia arriba, cada peldaño se aleja del hardware y se acerca al
problema:

| Nivel | Qué hay que saber para escribirlo |
|---|---|
| Lenguaje de máquina | Bits; el juego de instrucciones del procesador |
| Ensamblador | Registros, direcciones, la pila |
| C | Memoria, tipos, tamaños |
| C++, Java | Objetos, tipos, algo de memoria |
| Python, Scheme | Casi solo el problema |

Que un lenguaje sea de alto nivel no lo hace mejor. Lo hace más cómodo
para expresar cierta clase de problemas y más lejano de la máquina, con
lo que eso implica en control y en rendimiento. Este curso vive en C y
C++ justamente porque queremos ver la memoria.

## Los enteros de C tienen bordes

En C una variable no es un número: es un espacio de tamaño fijo donde
cabe un número. El tamaño decide cuántos valores distintos se pueden
guardar, y ese conteo se agota.

| Tipo | Bits | Rango |
|---|---:|---|
| `int` | 32 | −2 147 483 648 a 2 147 483 647 |
| `unsigned int` | 32 | 0 a 4 294 967 295 |
| `long` | 64 | −9 223 372 036 854 775 808 a 9 223 372 036 854 775 807 |

Con 32 bits hay 2³² combinaciones posibles. Si se reserva la mitad para
los negativos quedan 2³¹ para cada lado, y por eso el máximo es
2³¹ − 1: el cero ocupa un puesto. Renunciar al signo con `unsigned` no
regala capacidad, solo la corre toda hacia arriba.

En clase se escribió este programa para pararse justo en los dos bordes
y dar un paso más:

```c title="desborde.c"
#include <stdio.h>

int main() {

  int a = 2147483647;

  printf("%d\n", ++a);

  int b = -2147483648;
  printf("%d\n", --b);
}
```

```console
$ gcc -Wall -Wextra -o desborde desborde.c
$ ./desborde
-2147483648
2147483647
```

Sumarle uno al máximo no produjo un error ni un aviso: produjo el
mínimo. Restarle uno al mínimo devolvió el máximo. El contador dio la
vuelta como el odómetro de un carro viejo.

Vale la pena mirar el `++a` en lugar de `a = a + 1`. Escrito antes de la
variable, el incremento ocurre primero y `printf` recibe el valor ya
aumentado; si fuera `a++`, `printf` imprimiría el valor viejo y el
aumento quedaría para después. Aquí la diferencia decide si se ve el
desbordamiento o no.

El primer intento tenía `%ld` donde iba `%d`, y `-Wall` no lo dejó
pasar:

```console
desborde.c:7:13: warning: format ‘%ld’ expects argument of type
 ‘long int’, but argument 2 has type ‘int’ [-Wformat=]
    7 |   printf("%ld\n", ++a);
      |           ~~^     ~~~
      |             |     |
      |             |     int
      |             long int
      |           %d
```

`printf` no tiene forma de saber qué le mandaron: lee el formato y desde
ahí decide cuántos bytes sacar de la pila. Con `%ld` iba a leer 8 bytes
donde solo había 4. El compilador sí puede compararlos, y esa es la
única razón por la que el error no llegó a ejecución. La misma
compilación avisó también de un `unused variable ‘b’` mientras la
segunda mitad del programa estaba a medio escribir.

!!! warning "El desbordamiento no avisa"

    Este es de los errores más caros que hay, porque el programa sigue
    corriendo con un número equivocado y nadie se entera hasta que el
    resultado final no cuadra. La única defensa es saber en qué rango se
    está trabajando y escoger el tipo con eso en la cabeza.

    Un detalle para quien quiera hilar fino: el estándar de C dice que
    el desbordamiento de un entero **con signo** es comportamiento
    indefinido, es decir, el compilador puede hacer cualquier cosa. Lo
    que se vio en la máquina de la clase —la vuelta al mínimo— es lo que
    hace gcc en x86-64, no una garantía del lenguaje. En `unsigned` sí
    está definido y siempre da la vuelta.

Un apunte práctico: en el programa los dos límites se escribieron a
mano, pero `limits.h` ya los trae con nombre. `INT_MAX`, `INT_MIN`,
`LONG_MAX` y `UINT_MAX` evitan teclear diez dígitos, y sobre todo
siguen siendo correctos si el programa se compila en una máquina donde
los tipos no midan lo mismo.

## En Python el entero no se desborda

El mismo experimento en Python da otra cosa:

```python title="desborde.py"
a = 2147483647
a = a + 1
print(a, 10 * a)
a = 129832198398123890123890129803129803821939812389012398128903912389123980
print(a, 10 * a)
print(type(a))
print(a.__pow__(10))
```

```console
$ python3 desborde.py
2147483648 21474836480
129832198398123890123890129803129803821939812389012398128903912389123980 1298321983981...
<class 'int'>
136089340347119865874712190179451998066255642940372590779352335673432235787654359430460...
```

El mismo valor que en C dio la vuelta, aquí simplemente pasó a
2 147 483 648. Y multiplicarlo por diez tampoco lo rompe. Se puede
escribir un número de setenta dígitos, elevarlo a la décima potencia y
Python devuelve los setecientos y pico dígitos exactos, sin redondear
nada.

La tercera respuesta explica todo lo anterior. `type(a)` contesta
`<class 'int'>`: en Python el entero es un **objeto**, no una casilla de
32 bits. Y como es un objeto, sus operaciones son métodos: `a.__pow__(10)`
es literalmente lo que ocurre por debajo cuando uno escribe `a ** 10`.
Cuando el número deja de caber, el objeto pide más memoria y sigue.

Nada es gratis. Cada suma en Python es una llamada a un método sobre un
objeto; en C es una instrucción del procesador. Esa diferencia es la que
vamos a medir en un momento.

!!! tip "Esto es una estructura de datos, y ustedes la van a construir"

    Un entero de precisión arbitraria no es magia del lenguaje: es una
    estructura de datos que guarda el número por pedazos y define cómo
    sumarlos y multiplicarlos. Alguien la escribió. Buena parte del
    semestre se trata precisamente de eso: mirar la operación cómoda que
    otro ya empacó y aprender a construirla.

## Nadie ejecuta C

El procesador solo entiende secuencias de bits. `factorial.c` es texto
plano que se abre con cualquier editor. Entre lo uno y lo otro hay una
traducción, y la pregunta interesante no es quién la hace sino **cuándo**
la hace.

### El intérprete

Traduce el programa línea por línea, cada vez que se ejecuta, y va
produciendo sobre la marcha lo que la máquina entiende. Si el programa
se corre mil veces, se traduce mil veces. No queda nada en disco.

### El compilador

Traduce una sola vez y deja otro archivo: el ejecutable. Para volver a
correrlo se reutiliza esa traducción. El fuente ya no hace falta.

### Las cinco diferencias

| | Intérprete | Compilador |
|---|---|---|
| Cuándo traduce | En cada ejecución | Una sola vez |
| Qué produce | Nada que quede en disco | Un ejecutable |
| Al ejecutar de nuevo | Vuelve a traducir | Reutiliza la traducción |
| Cuándo aparecen los errores | Al llegar a la línea | Antes de correr |
| Qué debe estar instalado | El intérprete | Nada, solo el ejecutable |

La cuarta fila tiene una consecuencia práctica que se siente al
programar. Un error de escritura en una rama del programa que casi nunca
se ejecuta, en C lo encuentra el compilador de una vez; en Python
aparece el día en que un usuario cae en esa rama.

### Ni tan puro lo uno ni lo otro

Python compila cada módulo a un código intermedio y lo guarda en
archivos `.pyc` dentro de `__pycache__`, para no repetir ese trabajo en
la siguiente ejecución. Ese código intermedio es lo que después
interpreta.

Java hace lo mismo de forma más explícita: `javac` produce archivos
`.class` con *bytecode*, y la máquina virtual de Java lo ejecuta. La
misma clase compilada corre en Linux, Windows o Android sin volver a
compilarse, porque lo que cambia de máquina en máquina es la JVM y no el
programa.

Los dos son híbridos. La división limpia entre "lenguajes compilados" y
"lenguajes interpretados" describe implementaciones típicas, no
propiedades de los lenguajes: nada impide escribir un compilador de
Python, y de hecho existen.

## Cuánto cuesta interpretar

El mismo ciclo, sumando los enteros de 0 a 49 999 999, en los dos
lenguajes:

```c title="suma_ciclo.c"
/* Mismo ciclo en C: se suman los enteros de 0 a 49 999 999 */
#include <stdio.h>

int main(void) {
    long suma;
    long i;

    suma = 0;
    i = 0;
    while (i < 50000000) {
        suma = suma + i;
        i = i + 1;
    }
    printf("%ld\n", suma);
    return 0;
}
```

```python title="suma_ciclo.py"
# Mismo ciclo en Python: se suman los enteros de 0 a 49 999 999
suma = 0
i = 0
while i < 50000000:
    suma = suma + i
    i = i + 1
print(suma)
```

Los dos imprimen `1249999975000000`. Lo que no es igual es el tiempo:

| Versión | Cómo se ejecuta | Tiempo |
|---|---|---:|
| C, `gcc -O0` | Compilada | 0,065 s |
| Python 3 | Interpretada | 9,295 s |

Unas 140 veces, medidas en el equipo de la clase. Cada vuelta del ciclo
en Python revisa de qué tipo son los operandos, busca el método que
corresponde y construye un objeto nuevo; en C son tres instrucciones del
procesador.

!!! note "Qué se midió y qué no"

    Lo medido es la implementación, no la elegancia del lenguaje. Y el
    ciclo es el peor caso posible para Python: cuando el trabajo pesado
    ocurre dentro de bibliotecas escritas en C, la diferencia se
    encoge. Aun así, el orden de magnitud es real y explica por qué este
    curso trabaja en C: cuando se estudian estructuras de datos, el
    costo de cada operación tiene que verse.

## Del fuente al ensamblador

Para ver la traducción se escribió en vivo un factorial recursivo:

```c title="factorial_rec.c"
#include <stdio.h>

long factorial(int n) {
  if (n == 0 || n == 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

int main() { printf("Factorial of 10 is %ld\n", factorial(10)); }
```

```console
$ gcc -Wall -Wextra factorial_rec.c -o factorial_rec
$ ./factorial_rec
Factorial of 10 is 3628800
```

La opción `-S` de `gcc` detiene la traducción justo antes del binario y
deja el ensamblador en un archivo de texto que se puede abrir y leer:

```console
$ gcc -S factorial_rec.c -o factorial.s
```

```text title="fragmento de factorial.s"
factorial:
    pushq   %rbp
    movq    %rsp, %rbp
    pushq   %rbx
    subq    $24, %rsp
    movl    %edi, -20(%rbp)
    cmpl    $0, -20(%rbp)
    je      .L2
    cmpl    $1, -20(%rbp)
    jne     .L3
.L2:
    movl    $1, %eax
    jmp     .L4
.L3:
    movl    -20(%rbp), %eax
    movslq  %eax, %rbx
    movl    -20(%rbp), %eax
    subl    $1, %eax
    movl    %eax, %edi
    call    factorial
    imulq   %rbx, %rax
.L4:
    movq    -8(%rbp), %rbx
    leave
    ret
```

No hay variables con nombre: hay registros (`%eax`, `%rbx`) y
desplazamientos respecto de `%rbp`, que marca dónde empieza el espacio
de esta llamada en la pila. No hay `if`: hay dos comparaciones (`cmpl`)
y dos saltos, uno por cada mitad del `||`. El `return` es `ret`, la
multiplicación es `imulq` y la llamada recursiva es un `call` a la misma
etiqueta, que es exactamente lo que uno espera de una función que se
llama a sí misma.

Casi todo lo que se ve son abreviaturas de la operación y del tamaño:
`mov` mueve, `push` empuja a la pila, `sub` resta, `cmp` compara, `j`
salta. La `l` final significa 32 bits y la `q`, 64. Nadie escribe así
hoy, pero saber leerlo quita el misterio de lo que pasa entre el archivo
de texto y el programa.

!!! abstract "Definición"

    El código ensamblador es una versión menos abstracta del código de
    máquina. Trabaja directamente con direcciones de memoria, registros
    del procesador, la pila del programa e interrupciones del sistema
    operativo. Cada procesador tiene su propio juego de instrucciones,
    y ese juego constituye su lenguaje ensamblador.

Que el ensamblador dependa del procesador tiene consecuencias que se ven
todos los días. Un ejecutable compilado para x86-64 no corre en el ARM
de un teléfono ni en un Mac con Apple Silicon: hay que recompilar, o
traducir en tiempo de ejecución, que es lo que hacen las capas de
compatibilidad y por eso cuestan rendimiento.

Si al archivo ya compilado se le mira el contenido con un visor
hexadecimal, aparece la última capa: bytes. Los pocos pedazos legibles
son las cadenas de texto del programa, guardadas en ASCII, donde `a` es
97 y `A` es 65. Todo lo demás son instrucciones que solo el procesador
lee.

## Imperativo y declarativo

Estos dos programas calculan lo mismo:

```c
long factorial(int n) {
    long resultado;
    int i;

    resultado = 1;
    i = 2;
    while (i <= n) {
        resultado = resultado * i;
        i = i + 1;
    }
    return resultado;
}
```

```scheme
(define (factorial n)
  (if (= n 0)
      1
      (* n (factorial (- n 1)))))
```

Para `n = 5` los dos responden `120`. Leídos instrucción por
instrucción, no se parecen en nada, y esa diferencia tiene nombre.

!!! abstract "Paradigma de programación"

    Un paradigma determina aspectos de la programación tales como los
    conceptos algorítmicos empleados para crear programas, el concepto
    de variable, la noción de tipo de dato y las estructuras de datos, y
    el uso de la memoria. Existe una gran variedad de paradigmas, pero
    la mayoría son variaciones o extensiones de dos: el declarativo y el
    imperativo.

### Declarativo: QUÉ se calcula

En los lenguajes declarativos el programador se concentra en especificar
qué desea calcular, sin decir cómo. El cómo —las operaciones de bajo
nivel, su orden, el manejo de memoria— queda del lado del lenguaje.

La variable declarativa se usa en el sentido de las funciones
matemáticas: una entidad que se sustituye por un valor pero cuyo valor
nunca cambia. No hay estado explícito, y por lo tanto no hay asociación
entre la variable, el espacio que ocupa en memoria y la forma de
manipular ese espacio.

En Scheme:

```scheme title="factorial.scm"
; Paradigma funcional: se dice QUE es el factorial, no como calcularlo
(define (factorial n)
  (if (= n 0)
      1
      (* n (factorial (- n 1)))))

(display (factorial 5))
(newline)
```

Evaluar `(factorial 4)` a mano es sustituir, no ejecutar:

| Paso | Expresión |
|---|---|
| 0 | `(factorial 4)` |
| 1 | `(* 4 (factorial 3))` |
| 2 | `(* 4 (* 3 (factorial 2)))` |
| 3 | `(* 4 (* 3 (* 2 (factorial 1))))` |
| 4 | `(* 4 (* 3 (* 2 (* 1 1))))` |
| 5 | `24` |

Ninguna casilla de memoria cambió de contenido. `n` nunca pasó de 4 a 3:
cada llamada tiene su propio `n` y ninguno se modifica. Lo que ocurrió
fue que la expresión se reescribió hasta quedar en un número.

La otra variación declarativa es la programación lógica. En Prolog uno
declara hechos y reglas, y un motor busca la respuesta:

```prolog title="factorial.pl"
% Paradigma logico: se declaran los hechos y las reglas que definen la relacion
factorial(0, 1).
factorial(N, F) :-
    N > 0,
    M is N - 1,
    factorial(M, G),
    F is N * G.

% Consulta:  ?- factorial(5, F).
%            F = 120.
```

La primera línea es un hecho: el factorial de 0 es 1. La segunda es una
regla: `F` es el factorial de `N` si se cumplen las cuatro submetas de
la derecha. Al consultar `factorial(4, F)`, el motor unifica, desciende
resolviendo submetas hasta tropezar con el hecho, y al regresar liga
`F = 24`. No es un ciclo ni exactamente una llamada: es unificación con
retroceso.

!!! warning "Prolog no se ejecutó en clase"

    El equipo de la clase no tiene intérprete de Prolog instalado. El
    archivo va como ilustración y deja la consulta comentada; ese
    `F = 120` no se corrió aquí.

!!! tip "Por qué esto no es solo curiosidad histórica"

    Haskell y Erlang se usan hoy en sistemas concurrentes y en la nube,
    y la razón es justamente la inmutabilidad. Cuando dos procesos
    intentan modificar la misma variable al mismo tiempo aparece una
    **condición de carrera**: el resultado depende de cuál llegó
    primero, y el programa produce respuestas distintas en ejecuciones
    distintas con los mismos datos. Si el valor no puede cambiar, esa
    clase de error no existe. Es un problema que vuelve en los cursos de
    sistemas operativos y de computación paralela.

### Imperativo: CÓMO se calcula

En contraste, en los lenguajes imperativos el programador especifica
cómo realizar el cálculo: qué operaciones, en qué orden y sobre qué
espacios de memoria.

Aquí la variable es una referencia, un nombre o un alias de un espacio
de memoria. Está asociada a un tamaño que determina qué valores puede
almacenar, y su valor cambia durante la ejecución: hay estado explícito.
Un programa imperativo es una secuencia de pasos que dice qué espacios
usar, cómo varían los valores guardados en ellos y cómo se construye
progresivamente el resultado.

```c title="factorial.c"
/* Paradigma imperativo: se dice COMO calcular el factorial */
long factorial(int n) {
    long resultado;
    int i;

    resultado = 1;
    i = 2;
    while (i <= n) {
        resultado = resultado * i;  /* la variable cambia de valor */
        i = i + 1;
    }
    return resultado;
}
```

Traza de `factorial(4)`:

| Iteración | ¿`i <= 4`? | `resultado` | `i` |
|:---:|:---:|:---:|:---:|
| inicio | — | 1 | 2 |
| 1 | sí | 2 | 3 |
| 2 | sí | 6 | 4 |
| 3 | sí | 24 | 5 |
| 4 | no | \- | \- |

Vale la pena poner las dos trazas lado a lado. En Scheme la expresión
crecía hasta colapsar en un número; en C dos casillas se sobrescriben
cuatro veces. El resultado es el mismo, `24`. El camino no.

El ciclo es lo imperativo por excelencia: la condición se evalúa contra
una variable que la propia repetición va cambiando. Sin estado no hay
ciclo, y por eso los lenguajes funcionales usan recursión donde nosotros
usamos `while`.

### Orientado a objetos: el estado se muda

```cpp title="factorial_oo.cpp"
class Factorial {
  private:
    long resultado;

  public:
    Factorial() {
        resultado = 1;
    }

    long calcular(int n) {
        int i;

        resultado = 1;
        i = 2;
        while (i <= n) {
            resultado = resultado * i;
            i = i + 1;
        }
        return resultado;
    }
};
```

El ciclo es idéntico al de C: se sigue diciendo el cómo. Lo que cambió
es dónde vive el estado; `resultado` dejó de ser una variable local y
pasó a ser un atributo del objeto. Por eso la orientación a objetos es
una variación del paradigma imperativo y no un paradigma aparte.

### Los cuatro, en una tabla

| Paradigma | Lenguaje | Idea central | La variable |
|---|---|---|---|
| Imperativo | C | Una secuencia de pasos | Casilla de memoria que cambia |
| Orientado a objetos | C++ | Los pasos y el estado viven dentro de un objeto | Atributo del objeto |
| Funcional | Scheme | La función se define a sí misma | Nombre que se sustituye por un valor |
| Lógico | Prolog | Hechos y reglas; el motor busca la respuesta | Incógnita que el motor liga |

Los tres primeros se ejecutaron en el equipo de la clase y los tres
imprimieron `120`.

## Cinco rasgos de los lenguajes de alto nivel

Por distintos que se vean, todos los lenguajes de alto nivel traen las
mismas cinco piezas:

1. Datos y tipos de datos.
2. Operaciones primitivas.
3. Secuencias de control.
4. Almacenamiento.
5. Interacción con el ambiente.

En C ya las vimos todas: `int` y `long`; `+` y `*`; `if` y `while`; los
arreglos; `printf` y `scanf`. El resto del semestre profundiza sobre
todo en la primera y la cuarta, que son las que tocan las estructuras de
datos.

## Sintaxis y semántica

!!! abstract "Definición"

    Al igual que cualquier lenguaje, incluido el español, los lenguajes
    de programación tienen una sintaxis y una semántica. La sintaxis es
    la forma en que los programas se escriben; la semántica es el
    significado que se le da a esas construcciones sintácticas.

Una lista de diez reales, en Pascal:

```text
var V: array [1..10] of real;
```

En C y C++:

```c
double V[10];
```

La semántica es prácticamente la misma: diez casillas contiguas de
números con decimales. La sintaxis no se parece en nada. Pascal numera
de 1 a 10 y lo dice; C escribe el tamaño y numera de 0 a 9 sin decirlo,
que es de donde salen la mitad de los errores de índice.

### Los tokens

!!! abstract "Definición"

    La sintaxis de un lenguaje está definida como la escogencia y
    organización de varios elementos sintácticos básicos. Esos
    elementos, llamados tokens, pueden ser caracteres, identificadores,
    operadores, palabras reservadas, comentarios, espacios en blanco y
    delimitadores. La especificación léxica del lenguaje es la
    definición de estos elementos.

Una línea cualquiera, partida en tokens:

```c
resultado = resultado * i;
```

| Token | Categoría |
|---|---|
| `resultado` | Identificador |
| `=` | Operador |
| `resultado` | Identificador |
| `*` | Operador |
| `i` | Identificador |
| `;` | Delimitador |

Los espacios separan los tokens y después sobran: no aparecen en la
tabla.

### Los delimitadores cambian de lenguaje a lenguaje

Cada lenguaje escoge cómo marcar dónde empieza y dónde termina un
bloque, y esa decisión se siente al escribir:

| Lenguaje | Cómo delimita un bloque |
|---|---|
| C, C++, Java | Llaves `{ }` |
| Python | Indentación |
| Ruby, Pascal | Palabra `end` |

En C el espacio en blanco no significa nada: el programa entero cabe en
una línea y compila igual. En Python la indentación **es** sintaxis, y
por eso mezclar tabuladores con espacios rompe programas que a la vista
se ven perfectos. Los dos caracteres ocupan el mismo lugar en la
pantalla y son tokens distintos.

## BNF: escribir la gramática

!!! abstract "Definición"

    Los tokens conforman expresiones, declaraciones y, en general, la
    estructura de un programa. La organización de esos elementos en
    categorías sintácticas determina la gramática del lenguaje. La
    gramática consta de un conjunto de definiciones, llamadas reglas o
    producciones, que especifican el orden particular en que deben estar
    ubicados los elementos para que un programa esté bien escrito.

La forma más usada de especificar una gramática es la **BNF**
(*Backus-Naur Form*), que John Backus desarrolló en 1960. Cada categoría
se escribe en términos de otras categorías y de tokens:

```text
<identificador> ::= <letra>
                  | "_"
                  | <identificador> ( <letra> | "_" )
                  | <identificador> <digito>

        <letra> ::= <mayuscula> | <minuscula>
    <minuscula> ::= "a" | "b" | ... | "z"
    <mayuscula> ::= "A" | "B" | ... | "Z"
       <digito> ::= "0" | "1" | ... | "9"
```

Lo que está entre ángulos es una categoría sintáctica; lo que está entre
comillas es un token literal; la barra vertical separa alternativas. La
primera regla se nombra a sí misma, y de ahí sale que un identificador
pueda tener el largo que sea.

### Por qué `2suma` no compila

Ninguna de las cuatro alternativas empieza por un dígito: la primera
arranca con una letra, la segunda con el guion bajo, y las dos últimas
arrancan con otro identificador, que a su vez tiene que empezar con
letra o guion bajo. En cambio `suma2` sí es válido, por la cuarta
alternativa: identificador seguido de dígito.

El compilador no tiene una lista de nombres prohibidos. Tiene esta
gramática.

!!! note "La gramática de Java existe y se puede leer"

    En clase se abrió la especificación de Java y ahí está la BNF
    completa del lenguaje, producción por producción. No es un objeto
    teórico: es el documento contra el que se implementan los
    compiladores. Las palabras reservadas aparecen como un nivel
    adicional de restricción: `int` cumple la regla de identificador,
    pero está apartada para el lenguaje y por eso no sirve como nombre
    de variable.

### La asignación y la expresión aritmética

```text
     <asignacion> ::= <identificador> "=" <exp_aritmetica> ";"

 <exp_aritmetica> ::= <entero>
                    | <identificador>
                    | <exp_aritmetica> "+" <exp_aritmetica>
                    | <exp_aritmetica> "-" <exp_aritmetica>
                    | <exp_aritmetica> "*" <exp_aritmetica>
                    | <exp_aritmetica> "/" <exp_aritmetica>

         <entero> ::= <digito_sin_cero> <digito>*  |  "0"
<digito_sin_cero> ::= "1" | ... | "9"
```

El asterisco de `<digito>*` es la **estrella de Kleene** y significa
"cero o más repeticiones". Es lo que permite que un número tenga los
dígitos que sea sin escribir una regla por cada longitud.

Con estas producciones se puede verificar que `W = Y * 10 + V;` está
bien escrita, armando el árbol que la deriva:

```text
                       <sentencia>
        ┌──────────────┬────┴───────────────┐
      <id>            "="              <expr>          ";"
        │                    ┌────────────┼────────┐
        W                 <expr>         "+"     <expr>
                    ┌───────┼──────┐               │
                 <expr>    "*"   <expr>           <id>
                    │              │               │
                  <id>          <num>              V
                    │              │
                    Y             10
```

`Y * 10` queda colgando por debajo de la suma. Esa forma no es un
accidente del dibujo: es lo que después convierte la semántica en una
orden.

## Cuando la sintaxis no basta

!!! abstract "Definición"

    Además de una sintaxis, cada lenguaje tiene asociada una semántica.
    La semántica determina las acciones que se llevan a cabo en un
    algoritmo, el resultado y el procedimiento realizado en cada
    operación. También fija propiedades asociadas a los tipos y valores
    de las variables, el comportamiento de las estructuras de control y
    de repetición, y otras propiedades ligadas al paradigma del
    lenguaje.

Dos consecuencias concretas.

La primera: en `W = Y * 10 + V;` la multiplicación se hace antes que la
suma, y eso no depende de cuál se escribió primero. Si la línea fuera
`W = V + Y * 10;` el producto seguiría abajo en el árbol y seguiría
evaluándose primero. La precedencia es semántica, no orden de lectura.

La segunda:

```c
int x;

x = "cinco";
```

Identificador, `=`, expresión, punto y coma: la gramática está contenta.
La semántica no. `x` es un espacio para un entero y lo que se le quiere
meter es la dirección de una cadena. Ese desacuerdo lo detecta una fase
concreta del compilador, y ya estamos en condiciones de nombrarla.

## Compilar son cuatro etapas

!!! abstract "Definición"

    Para hacer la traducción del programa deben superarse varias
    etapas, que pueden verse como los componentes intermedios del
    compilador: el preprocesamiento, el compilador propiamente dicho, el
    ensamblador, y los enlazadores y cargadores.

El archivo que se siguió paso a paso en clase:

```c title="Pasos.c"
#include <stdio.h>

int main() {
  int pasos = 0;
  int n = 10; // Número de pasos a dar

  for (int i = 0; i < n; i++) {
    pasos++;
    printf("Paso %d\n", pasos);
  }

  return 0;
}
```

Trece líneas. `gcc` puede hacerlo todo de un tirón, pero también permite
detenerse en cada frontera:

| Etapa | Orden | Qué produce |
|---|---|---|
| Preprocesamiento | `gcc -E Pasos.c -o Pasos.i` | `Pasos.i`, texto |
| Compilación | `gcc -S Pasos.i -o Pasos.s` | `Pasos.s`, ensamblador |
| Ensamblado | `gcc -c Pasos.s -o Pasos.o` | `Pasos.o`, binario |
| Enlazado | `gcc Pasos.o -o Pasos` | `Pasos`, ejecutable |

### Etapa 1: preprocesamiento

El código fuente puede estar repartido en varios archivos o módulos, y
puede haber macros. Todos esos componentes se recolectan para tener un
único programa fuente.

```console
$ gcc -E Pasos.c -o Pasos.i
$ wc -l Pasos.c Pasos.i
   13 Pasos.c
  851 Pasos.i
```

Trece líneas entraron y salieron 851. Las 838 nuevas son `stdio.h`
entero, pegado donde estaba el `#include`. Ahí adentro está, entre otras
mil cosas, la línea que declara `printf`:

```c
extern int printf (const char *__restrict __format, ...);
```

Eso es todo lo que el compilador necesita saber de `printf` para
aceptarlo: cómo se llama, qué recibe y qué devuelve. El código de la
función no está por ninguna parte, y aun así el archivo compila. Esa
promesa pendiente se cobra en la etapa 4.

El preprocesador tampoco entiende C. Pega texto y reemplaza texto; si un
`#define` dice que `SALUDO` es una cadena, donde diga `SALUDO` quedará
la cadena, sin preguntarse si el resultado tiene sentido.

### Etapa 2: el compilador propiamente dicho

```console
$ gcc -S Pasos.i -o Pasos.s
$ wc -l Pasos.s
   43 Pasos.s
```

```text title="fragmento de Pasos.s"
.LC0:
    .string "Paso %d\n"
main:
    pushq   %rbp
    movq    %rsp, %rbp
    subq    $16, %rsp
    movl    $0, -12(%rbp)     # pasos = 0
    movl    $10, -4(%rbp)     # n = 10
    movl    $0, -8(%rbp)      # i = 0
    jmp     .L2
.L3:
    addl    $1, -12(%rbp)     # pasos++
    movl    -12(%rbp), %eax
    leaq    .LC0(%rip), %rdx
    movl    %eax, %esi
    movq    %rdx, %rdi
    call    printf@PLT
    addl    $1, -8(%rbp)      # i++
.L2:
    movl    -8(%rbp), %eax
    cmpl    -4(%rbp), %eax    # i < n ?
    jl      .L3
    movl    $0, %eax
    leave
    ret
```

Entraron 851 líneas y salieron 43. El `for` desapareció: quedó un salto
al final del ciclo, la comparación abajo, y un salto de regreso si
todavía se cumple. Las tres variables perdieron el nombre y son ahora
tres desplazamientos: `pasos` vive en `-12(%rbp)`, `n` en `-4(%rbp)` e
`i` en `-8(%rbp)`.

### Etapa 3: el ensamblador

```console
$ gcc -c Pasos.s -o Pasos.o
$ file Pasos.o
Pasos.o: ELF 64-bit LSB relocatable, x86-64, version 1 (SYSV), not stripped
```

Aquí se acaba el texto: `Pasos.o` ya es binario. *Relocatable* quiere
decir que todavía no tiene decidido en qué direcciones va a vivir.

Se le puede preguntar qué sabe y qué no:

```console
$ nm Pasos.o
0000000000000000 T main
                 U printf
```

La `T` de `main` dice que el símbolo está definido aquí, en la sección
de texto. La `U` de `printf` dice *undefined*: el objeto usa esa función
pero no la tiene. Alguien la tendrá que poner.

### Etapa 4: enlazadores y cargadores

Los enlazadores y cargadores cargan y enlazan el código objeto y las
bibliotecas ya creadas al programa que se está traduciendo: archivos
`.dll` en Windows, `.so` y `.a` en Linux.

```console
$ gcc Pasos.o -o Pasos
$ ./Pasos
Paso 1
Paso 2
...
Paso 10
$ file Pasos
Pasos: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV),
 dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2
```

El enlazador buscó `printf` en la biblioteca estándar de C y resolvió la
`U`. Trece líneas de texto, cuatro órdenes, un ejecutable. Y note el
cambio de descripción: `Pasos.o` era *relocatable*, `Pasos` es
*executable*.

!!! note "Un detalle del deck que vale la pena reproducir"

    Las diapositivas hacen el mismo recorrido con un programa que
    imprime una cadena fija, `printf("%s\n", SALUDO)`, y ahí `nm` no
    reporta `printf` sino `puts`. Como la cadena no lleva formatos que
    resolver, `gcc` cambió la llamada por una más barata. En `Pasos.c`
    no puede hacerlo, porque el `%d` obliga a formatear de verdad. El
    compilador no traduce palabra por palabra: entiende y después
    decide.

!!! note "De dónde salen los errores de DLL"

    Ese `System32` lleno de `.dll` que aparece en los mensajes de
    Windows es exactamente esto: bibliotecas compartidas que los
    programas esperan encontrar al arrancar. Cuando falta una, o la
    versión instalada no es la que el programa espera, el enlace en
    tiempo de ejecución falla y sale el aviso. En Linux el papel lo
    hacen los `.so`.

    El código objeto, una vez pasado el ensamblador, puede usarse como
    biblioteca para otros programas. Los componentes intermedios del
    compilador son separables, que es justo lo que se acaba de hacer a
    mano.

## Adentro del compilador: seis fases

!!! abstract "Definición"

    Conceptualmente, el proceso de transformar el programa fuente en un
    programa ensamblador se descompone en seis fases: análisis léxico,
    análisis sintáctico, análisis semántico, generación de código
    intermedio, optimización y generación de código.

Las tres primeras entienden el programa; las tres últimas lo producen.
Todas ocurren dentro de la segunda etapa, la que convierte `Pasos.i` en
`Pasos.s`.

| Fase | Qué recibe | Qué hace | Qué entrega |
|---|---|---|---|
| 1. Análisis léxico | Caracteres | Agrupa en tokens, descarta espacios | Tokens |
| 2. Análisis sintáctico | Tokens | Los acomoda en un árbol según la BNF | Árbol sintáctico |
| 3. Análisis semántico | Árbol | Revisa tipos, flujo y unicidad | Árbol decorado |
| 4. Código intermedio | Árbol decorado | Genera instrucciones de tres direcciones | Código intermedio |
| 5. Optimización | Código intermedio | Mejora el rendimiento | Código optimizado |
| 6. Generación de código | Código optimizado | Traduce al juego del procesador | Ensamblador |

Tres precisiones sobre las fases de análisis:

- El **análisis léxico** escanea los caracteres en busca de símbolos que
  no pertenecen al alfabeto del lenguaje, y arma los tokens. Es la fase
  que produjo la tabla de `resultado = resultado * i;`. No sabe nada de
  estructura: para ella `; ; ;` son tres tokens perfectamente
  respetables.
- El **análisis sintáctico** arma el árbol y lo compara con la BNF. Es
  el árbol de `W = Y * 10 + V;`, solo que aquí lo construye un programa.
  Si los tokens no se dejan acomodar en ningún árbol válido, la
  compilación se detiene. Al árbol que queda después de podar lo que ya
  no aporta significado se le llama **árbol de sintaxis abstracta**, o
  AST.
- El **análisis semántico** busca errores de tipos (que los operadores
  se apliquen a operandos correctos y que los valores quepan en el
  espacio reservado), de control de flujo (que un `break` tenga a dónde
  transferirlo) y de unicidad (que no haya dos variables distintas con
  el mismo nombre en el mismo alcance).

El `printf` convertido en `puts` es una decisión de las tres últimas
fases.

## Cuatro programas rotos

La pregunta con la que se cerró: ¿en qué fase muere cada uno?

```c
int x = 5 @ 3;      /* err_lexico.c     */

int x = 5           /* err_sintactico.c */
printf("%d\n", x);

int x;
x = "cinco";        /* err_semantico.c  */

int poder_de_butters(int n);   /* err_enlace.c: se declara,
                                  nunca se define */
printf("%d\n", poder_de_butters(3));
```

**Léxico.** El escáner encontró un carácter que no pertenece al alfabeto
de C y ni siquiera intentó darle sentido. `stray` es "suelto,
extraviado":

```console
err_lexico.c:4:15: error: stray '@' in program
    4 |     int x = 5 @ 3;
      |               ^
```

**Sintáctico.** Todos los tokens son legales; lo que falla es el orden.
La gramática exige un punto y coma donde apareció un identificador:

```console
err_sintactico.c:5:5: error: expected ',' or ';' before 'printf'
    5 |     printf("%d\n", x);
      |     ^~~~~~
```

**Semántico.** La forma es impecable: identificador, `=`, expresión,
punto y coma. Para quejarse, el compilador tuvo que saber que `x` es
`int` y que `"cinco"` es `char *`. Eso ya no es gramática:

```console
err_semantico.c:6:7: error: assignment to 'int' from 'char *' makes
 integer from pointer without a cast [-Wint-conversion]
    6 |     x = "cinco";
      |       ^
```

Compare con el error anterior. Allá `gcc` citaba tokens; acá cita tipos.

**Enlace.** El cuarto no muere en ninguna fase. Las seis pasan sin una
queja y el objeto queda escrito:

```console
$ gcc -Wall -Wextra -c err_enlace.c -o err_enlace.o
$ ls -l err_enlace.o
-rw-r--r-- 1576 err_enlace.o
```

Y sin embargo el programa no existe. Al pedir el ejecutable:

```console
$ gcc err_enlace.o -o err_enlace
/usr/bin/ld: err_enlace.o: in function 'main':
err_enlace.c:(.text+0xa): undefined reference to 'poder_de_butters'
collect2: error: ld returned 1 exit status
```

Quien se queja ya no es `gcc`: es `ld`, el enlazador, en la cuarta
etapa. La declaración le prometió al compilador que la función existía
en alguna parte. El compilador creyó. El enlazador fue a buscarla y no
estaba.

### El mapa completo

| Síntoma | Quién se queja | Dónde |
|---|---|---|
| `stray '@' in program` | Analizador léxico | Fase 1 |
| `expected ';' before ...` | Analizador sintáctico | Fase 2 |
| `makes integer from pointer` | Analizador semántico | Fase 3 |
| `undefined reference to ...` | `ld` | Etapa 4, enlazado |

Hay un quinto caso que aparece pronto en la práctica: definir la misma
función en dos archivos que se enlazan juntos. El mensaje habla de
*multiple definition*, y también viene de `ld`. La regla general es que
leer quién se queja ahorra la mitad de la depuración.

## Resumen

- Un lenguaje de programación es un vocabulario más un conjunto de
  reglas gramaticales, y sirve para ordenarle una tarea al computador
  sin ambigüedad.
- El intérprete traduce en cada ejecución; el compilador traduce una vez
  y deja un ejecutable reutilizable. Python y Java son híbridos.
- El paradigma fija el concepto de variable: en el declarativo se
  sustituye por un valor y no cambia; en el imperativo es un espacio de
  memoria con estado.
- La sintaxis dice cómo se escriben los programas y se especifica en
  BNF; la semántica dice qué significan.
- Compilar son cuatro etapas separables, y dentro de la segunda hay seis
  fases. Cada error tiene su fase.

## Para la próxima sesión

1. Tome `Pasos.c` y córralo con las cuatro órdenes por separado: `-E`,
   `-S`, `-c` y el enlazado. Mire cuántas líneas tiene cada archivo
   intermedio y qué reporta `nm` sobre el `.o`.
2. Compile ahora `hola.c`, que imprime una cadena fija, y mire su
   ensamblador. ¿Aparece `printf` o `puts`? Cambie
   `printf("%s\n", SALUDO)` por `printf("%s y %d\n", SALUDO, 7)` y
   vuelva a mirar.
3. Escriba tres programas rotos, uno por fase de análisis, y prediga el
   mensaje de `gcc` antes de compilarlos.
4. Corra `desborde.c` cambiando `int` por `long` y por `unsigned int`.
   ¿En qué valor da la vuelta cada uno?

## Código de la clase

Compilación y ejecución de cada archivo:

```bash
gcc -Wall -Wextra archivo.c -o archivo && ./archivo
g++ -Wall -Wextra factorial_oo.cpp -o factorial_oo && ./factorial_oo
python3 archivo.py
guile -s factorial.scm
```

**Paradigmas**

- [factorial.c](codigo/factorial.c) — imperativo, con ciclo
- [factorial_rec.c](codigo/factorial_rec.c) — la versión recursiva escrita en clase
- [factorial_oo.cpp](codigo/factorial_oo.cpp) — orientado a objetos
- [factorial.scm](codigo/factorial.scm) — funcional, en Scheme
- [factorial.pl](codigo/factorial.pl) — lógico, en Prolog
- [factorial.py](codigo/factorial.py) — el mismo cálculo con la biblioteca estándar

**Intérprete y compilador**

- [suma_ciclo.c](codigo/suma_ciclo.c)
- [suma_ciclo.py](codigo/suma_ciclo.py)

**Rangos y desbordamiento**

- [desborde.c](codigo/desborde.c)
- [desborde.py](codigo/desborde.py)

**Compilación paso a paso**

- [Pasos.c](codigo/Pasos.c) — el que se recorrió etapa por etapa
- [hola.c](codigo/hola.c) — la variante del deck, donde `printf` se vuelve `puts`
- [warn_asignacion.c](codigo/warn_asignacion.c)

**Los cuatro programas rotos**

- [err_lexico.c](codigo/err_lexico.c)
- [err_sintactico.c](codigo/err_sintactico.c)
- [err_semantico.c](codigo/err_semantico.c)
- [err_enlace.c](codigo/err_enlace.c)

## Referencias

- R. Sebesta. *Concepts of Programming Languages*. Pearson, 2015.
  Capítulos 1 (*Preliminaries*) y 3 (*Describing Syntax and Semantics*).
- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 1 (*Introduction to C*).
- C. A. Ramírez Restrepo. *Estructuras de Datos: Paradigmas de
  Programación*. Pontificia Universidad Javeriana Cali, 2025-2.
