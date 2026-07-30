# Clase 1. Repaso de programación básica

Miércoles 29 de julio de 2026.

Primera sesión: presentación del curso y repaso de lo que ya traen de
programación. Leer datos, decidir, repetir, guardar varios valores en un
arreglo y comprobar con una traza que el programa hace lo que creemos que
hace. Nada de esto es nuevo, pero conviene dejarlo en firme porque todo el
semestre se construye encima.

## Diapositivas

![](clase01.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Compilar y ejecutar desde la terminal

Todo el trabajo de la clase se hizo en la terminal, sin botones de "Run". La
razón es sencilla: cuando algo falla, el compilador dice exactamente qué pasó,
y esa conversación con el compilador es parte del curso.

La orden que se usó una y otra vez fue esta:

```bash
g++ -o exe Mayor.cpp -Wall -Wextra
```

Pieza por pieza:

| Parte | Qué hace |
|---|---|
| `g++` | El compilador de C++. Para archivos `.c` se usa `gcc`. |
| `-o exe` | Le pone nombre al ejecutable. Sin esta opción el resultado se llama `a.out`. |
| `Mayor.cpp` | El archivo fuente que se va a traducir. |
| `-Wall -Wextra` | Enciende las advertencias del compilador. |

Compilar no ejecuta nada: produce un archivo nuevo. Para correrlo:

```bash
./exe
```

El `./` no sobra. La terminal busca los programas en las carpetas del `PATH`, y
la carpeta actual no está ahí; `./exe` le dice "el ejecutable que está justo
aquí".

Los archivos de la clase se llaman `.cpp` y se compilan con `g++`, pero por
dentro son C: `#include <stdio.h>`, `scanf`, `printf`. Durante buena parte del
semestre vamos a trabajar así, en el subconjunto de C que C++ hereda, y solo
más adelante entra la STL.

!!! warning "Las advertencias no son opcionales"

    En este curso se compila **siempre** con `-Wall -Wextra`. Una advertencia
    casi nunca es ruido: es un error que todavía no se ha manifestado. Más
    abajo hay un programa que demuestra exactamente eso.

## El mayor de tres números

El primer problema de la clase: leer tres enteros e imprimir el mayor.

```c++ title="Mayor.cpp"
#include <stdio.h>

int main() {
  int mayor, a, b, c;
  scanf("%d %d %d", &a, &b, &c);
  mayor = a;

  if (b > mayor) {
    mayor = b;
  }

  if (c > mayor) {
    mayor = c;
  }

  printf("El mayor es %d", mayor);
}
```

La idea es la de siempre: se supone que el mayor es `a` y se corrige cada vez
que otro valor lo supera. Dos preguntas, dos posibles reemplazos, y al final
`mayor` tiene la respuesta.

```console
$ g++ -o exe Mayor.cpp -Wall -Wextra
$ ./exe
5 6 7
El mayor es 7
```

Dos detalles que salieron en vivo:

- El `printf` no termina en `\n`, así que el prompt de la terminal queda pegado
  a la salida. No es un error, pero se ve feo; el `\n` final es buena costumbre.
- `main` no tiene `return 0;` y aun así compila sin quejas. En C++ el `return 0`
  de `main` es implícito. Nosotros lo vamos a escribir de todas formas: en C
  clásico sí hace falta y ayuda a leer dónde termina el programa.

## Por qué se compila con advertencias

Este programa es el argumento completo a favor de `-Wall -Wextra`:

```c++ title="Malo.cpp"
#include <stdio.h>

int main() {
  int x = 0;
  if (x = 5) {
    printf("Soy el mejor\n");
  }
}
```

Compilado sin advertencias, el compilador no dice nada y el programa entra al
`if` aunque `x` valía 0:

```console
$ g++ -o exe Malo.cpp
$ ./exe
Soy el mejor
```

Con las advertencias encendidas, aparece el aviso:

```console
$ g++ -o exe Malo.cpp -Wall -Wextra
Malo.cpp: In function ‘int main()’:
Malo.cpp:5:9: warning: suggest parentheses around assignment used as truth value [-Wparentheses]
    5 |   if (x = 5) {
      |       ~~^~~
```

Lo que pasa es que `x = 5` no compara: asigna. Y como toda asignación en C vale
lo que se asignó, la condición del `if` termina valiendo 5, que es distinto de
cero y por lo tanto verdadero. El programa "funciona", solo que no hace lo que
uno quería.

| Operador | Significado | `x` vale 0, condición `x ? 5` |
|---|---|---|
| `=` | Asigna | `x = 5` → `x` pasa a valer 5, la condición es verdadera |
| `==` | Compara | `x == 5` → falso, no entra al `if` |

Este es el tipo de error que se vuelve invisible en un programa de 300 líneas.
El compilador lo ve gratis si uno lo deja hablar.

## El ejercicio de la clase

Sobre un arreglo de cinco enteros leídos del teclado: imprimirlo en orden
inverso, hallar el máximo y calcular el promedio con decimales.

```c++ title="Ejercicio.cpp"
#include <stdio.h>

int main() {
  int datos[5];

  for (int i = 0; i < 5; i++) {
    scanf("%d", &datos[i]);
  }

  // Imprimir en orden inverso
  for (int i = 4; i >= 0; i--) {
    printf("%d ", datos[i]);
  }
  printf("\n");

  // Maximo y promedio;
  int maximo;
  double promedio;
  promedio = datos[0];
  maximo = datos[0];
  for (int i = 1; i < 5; i++) {
    promedio += datos[i];
    if (datos[i] > maximo) {
      maximo = datos[i];
    }
  }
  promedio = promedio / 5.0;
  printf("El maximo es %d y el promedio %0.3f", maximo, promedio);
}
```

Tres recorridos, cada uno con un propósito. El primero llena el arreglo. El
segundo lo imprime hacia atrás, arrancando en el índice 4 y restando. El
tercero hace dos cosas a la vez: acumula la suma y va corrigiendo el máximo,
con la misma estrategia de `Mayor.cpp` pero dentro de un ciclo.

### Traza del tercer ciclo con la entrada `1 2 3 4 5`

| `i` | `datos[i]` | `promedio` (acumulada) | `maximo` |
|:---:|:---:|:---:|:---:|
| inicio | — | 1 | 1 |
| 1 | 2 | 3 | 2 |
| 2 | 3 | 6 | 3 |
| 3 | 4 | 10 | 4 |
| 4 | 5 | 15 | 5 |

Al salir, `promedio = 15 / 5.0 = 3.0`.

```console
$ g++ -o exe Ejercicio.cpp -Wall -Wextra
$ ./exe
1
2
3
4
5
5 4 3 2 1
El maximo es 5 y el promedio 3.000
```

Vale la pena mirar dos decisiones del código:

- `promedio` es `double` desde el principio y la división es entre `5.0`, no
  entre `5`. Si ambos operandos fueran enteros, C descartaría los decimales y
  el promedio de `1 2 3 4 5` saldría 3 por pura suerte, pero el de `1 1 1 1 2`
  saldría 1 en lugar de 1.2.
- El `%0.3f` de `printf` es lo que fija tres decimales en la salida. Con `%f` a
  secas salen seis: `3.000000`.

!!! note "Los ciclos: `for` o `while`"

    El código de la clase usa `for` y las diapositivas usan `while`. Son
    equivalentes: `for (inicio; condición; avance)` empaca en una línea las tres
    piezas que en el `while` quedan repartidas. Escriban el que les deje la
    condición más clara de leer.

## Entrada y salida por archivo

Escribir cinco números a mano cada vez que se prueba el programa cansa al tercer
intento. La terminal permite conectar la entrada a un archivo:

```bash
./exe < entrada.in
```

Con `entrada.in` conteniendo los cinco números, uno por línea. El programa ni se
entera: sigue llamando a `scanf`, solo que los datos llegan del archivo y no del
teclado.

La salida se redirige igual, con `>`:

```bash
./exe < entrada.in > salida.out
```

Ahora nada aparece en pantalla; todo queda escrito en `salida.out`. Esto es
exactamente lo que hace el juez automático cuando califica: le pasa una entrada,
captura la salida y la compara con la esperada, carácter por carácter.

!!! tip "Si el programa parece congelado"

    `./exe > salida.out` (sin el `<`) redirige la salida pero deja la entrada en
    el teclado, y como los `printf` ya no se ven, el programa parece trabado
    cuando en realidad está esperando que uno escriba. `Ctrl+C` lo cancela.

## Cómo compilar en Windows

En clase se trabajó en Linux, pero nada de lo anterior es exclusivo de Linux.
Hay tres caminos razonables en Windows y los tres terminan en la misma terminal
con `g++`.

### MinGW-w64

Es el port de GCC para Windows: da `gcc` y `g++` nativos, sin máquinas virtuales
de por medio. Se descarga desde [mingw-w64.org](https://www.mingw-w64.org); la
vía más cómoda de instalarlo es a través de [MSYS2](https://www.msys2.org), que
además mantiene el compilador actualizado.

Después de instalarlo hay que agregar la carpeta `bin` de MinGW al `PATH` de
Windows, cerrar y volver a abrir la terminal, y comprobar que responde:

```powershell
g++ --version
g++ -o exe Mayor.cpp -Wall -Wextra
.\exe
```

Dos diferencias frente a Linux: el ejecutable se llama `exe.exe` (Windows le
pone la extensión) y se invoca con `.\exe` en PowerShell, con contrabarra.
Las redirecciones `<` y `>` funcionan igual.

### Visual Studio Code

VS Code es un editor, no un compilador. Sirve para escribir el código con
resaltado, autocompletado y depurador, pero por debajo sigue necesitando
MinGW-w64 instalado. La combinación que recomiendo es:

1. Instalar MinGW-w64 como se explicó arriba.
2. Instalar [VS Code](https://code.visualstudio.com) y la extensión **C/C++** de
   Microsoft.
3. Abrir la terminal integrada con ``Ctrl+` `` y compilar ahí con las mismas
   órdenes.

Conviene resistir la tentación de compilar solo con el botón de "Run": el botón
esconde la orden que realmente se ejecutó, y cuando algo salga mal van a
necesitar verla.

### WSL

WSL (*Windows Subsystem for Linux*) instala un Ubuntu completo dentro de
Windows. Se habilita desde PowerShell como administrador:

```powershell
wsl --install
```

Y dentro de la terminal de Ubuntu que aparece:

```bash
sudo apt update
sudo apt install build-essential
```

A partir de ahí el entorno es idéntico al de la clase: mismas órdenes, mismos
mensajes de error, mismo `./exe`. VS Code se conecta a WSL con la extensión
**WSL** de Microsoft y edita los archivos como si fueran locales.

### Cuál elegir

| Opción | Ventaja | Costo |
|---|---|---|
| MinGW-w64 | Ligero, ejecutables nativos de Windows | Configurar el `PATH` a mano |
| VS Code + MinGW-w64 | Editor cómodo, depurador integrado | Necesita MinGW-w64 igual |
| WSL | Idéntico a lo que ven en clase y en el juez | Ocupa más disco |

Si no tienen preferencia, WSL les evita las diferencias pequeñas entre Windows y
Linux, que es donde se pierde el tiempo. Cualquiera de las tres sirve para el
curso.

## Reglas de código del curso

Se mencionaron al final de la sesión y aplican a tareas, parciales y proyecto:

- Sin `break`, sin `continue`, sin `goto`.
- Un solo `return` por función, al final.
- Preferir las construcciones simples sobre las ingeniosas.
- Solo biblioteca estándar; comentarios en español.
- El código compila sin advertencias con `-Wall -Wextra`.

No son caprichos de estilo. Una función con una sola salida y un ciclo cuya
condición cuenta la historia completa se pueden trazar en el tablero sin
sorpresas, y trazar es lo que vamos a hacer todo el semestre.

## Para practicar

Del cierre de las diapositivas:

1. Leer un entero positivo e imprimir cuántos dígitos tiene.
2. Contar cuántos de cinco números leídos son pares, con una función `es_par`.
3. Reescribir los ciclos de `Ejercicio.cpp` con `while` y verificar que la
   salida no cambia.

## Código de la clase

- [Mayor.cpp](codigo/Mayor.cpp)
- [Malo.cpp](codigo/Malo.cpp)
- [Ejercicio.cpp](codigo/Ejercicio.cpp)
- [entrada.in](codigo/entrada.in)

## Referencias

- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulos 1 (*Introduction to C*) y 3 (*Arrays*).
- N. Kalicharan. *Data Structures in C*, 2008. Capítulo 1.
