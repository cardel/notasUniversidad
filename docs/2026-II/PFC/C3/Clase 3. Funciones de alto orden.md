# Clase 3. Funciones de alto orden

Jueves 24 de septiembre de 2026.

Tres funciones que suman de 1 a `n` —los enteros, sus cuadrados, sus cubos—
se escriben igual salvo por una línea. La sesión convierte esa línea en un
parámetro, y después repite la operación con lo que queda: cómo se avanza al
siguiente término y cómo se combinan los resultados. Al final la función
recibe tres funciones y devuelve otra.

Las diapositivas están en el Campus Virtual. Aquí quedan las notas de lo que
se dijo en el salón y el código que se escribió en vivo, en
[`codigo/`](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/PFC/C3/codigo).
Los doce ejercicios interactivos de la sesión están en
[Ejercicios](./Ejercicios.md).

Referencia: Odersky, Spoon y Venners, *Programming in Scala*, 3.ª edición,
capítulos 8 y 9; Abelson y Sussman, *Structure and Interpretation of Computer
Programs*, sección 1.3, *Formulating Abstractions with Higher-Order
Procedures*.

## El esquema que se repite

Las tres primeras funciones se escribieron con recursión de cola y
acumulador:

```scala
def sumar(n: Int): Int = {
  @tailrec
  def sumarAux(n: Int, acc: Int): Int = {
    if (n == 0) acc
    else sumarAux(n - 1, acc + n)
  }
  sumarAux(n, 0)
}
```

`sumarCuadrado` es la misma, con `acc + n * n` en lugar de `acc + n`.
`producto` cambia dos cosas: `acc * n` y el arranque en 1 en vez de 0.

```
sumar(10)         = 55
sumarCuadrado(10) = 385
producto(10)      = 3628800
```

Puestas una debajo de otra, lo que se repite es todo menos un pedazo:

| | Término | Avance | Arranque |
|---|---|---|---|
| `sumar` | `n` | `n - 1` | 0 |
| `sumarCuadrado` | `n * n` | `n - 1` | 0 |
| `producto` | `n` (multiplicando) | `n - 1` | 1 |

En el tablero quedó marcado así: el `n - 1` circulado en rojo, igual en las
tres, y `acc + n` frente a `acc + n * n` circulado aparte, con la palabra
*diferente*. Sumar los cubos pediría una cuarta copia del mismo esqueleto, y
cada copia es una ocasión más de equivocarse.

## Funciones como parámetro

Lo que cambia es *qué se le hace a cada término*, y eso no es un número: es
una función. Para dejarlo como hueco hay que poder pasar una función como
argumento.

```scala
def sumaGenerico(n: Int, f: Int => Int): Int = {
  @tailrec
  def sumarAux(n: Int, acc: Int): Int = {
    if (n == 0) acc
    else sumarAux(n - 1, acc + f(n))
  }
  sumarAux(n, 0)
}
```

El cuerpo es idéntico al de `sumar`; lo único distinto es `acc + f(n)` en
lugar de `acc + n`. Con tres funciones con nombre, las tres sumas salen de
la misma definición:

```scala
def identidad(n: Int): Int = n
def cuadrado(n: Int): Int = n * n
def cubo(n: Int): Int = n * n * n
```

```
sumaGenerico(10, identidad) = 55
sumaGenerico(10, cuadrado)  = 385
sumaGenerico(10, cubo)      = 3025
```

Una **función de alto orden** recibe funciones como argumento, devuelve una
función como resultado, o las dos cosas.

### Leer el tipo

`Int => Int` se lee de izquierda a derecha: a la izquierda de la flecha, la
entrada; a la derecha, la salida. La salida es un solo tipo; las entradas
pueden ser varias, y entonces van entre paréntesis:

```
(x: Int) => x        tiene tipo  Int => Int
(x: Int) => x * x    tiene tipo  Int => Int
(x: Int, y: Int) => x + y    tiene tipo  (Int, Int) => Int
```

Escritas en el REPL sin nombre, Scala responde con el tipo y con una
referencia al objeto función: `val res0: Int => Int = $Lambda$...`. El tipo
es lo que interesa; la referencia solo dice que ahí hay una función.

## Funciones anónimas

`identidad`, `cuadrado` y `cubo` se usan una sola vez cada una. Declararlas
con nombre para eso es trabajo de más: el literal se pasa directo.

```scala
sumaGenerico(10, (x: Int) => x)
sumaGenerico(10, (x: Int) => x * x)
sumaGenerico(10, (x: Int) => x * x * x)
```

Dan lo mismo que las tres anteriores. El criterio que se dio en clase: una
función que se va a reutilizar muchas veces conviene declararla con nombre;
una que se usa una vez y ahí queda, no.

Un literal es un valor, igual que un `15`. Y con una función hay dos cosas
que se pueden hacer: **evaluarla** —pasarle argumentos— o **componerla**,
que incluye mandársela a otra función.

## Los otros dos huecos

Sumar los impares pide cambiar el avance, no el término. Ese es el segundo
hueco, y entra como otra función:

```scala
def sumaGenericaV2(n: Int, f: Int => Int, g: Int => Int): Int = {
  @tailrec
  def aux(a: Int, b: Int, acc: Int): Int = {
    if (a > b) acc
    else aux(g(a), b, f(a) + acc)
  }
  aux(1, n, 0)
}
```

```
sumaGenericaV2(15, identidad, suc)      = 120
sumaGenericaV2(15, identidad, dosEnDos) = 64
sumaGenericaV2(15, cuadrado, dosEnDos)  = 680
```

El segundo es `1 + 3 + 5 + ... + 15`, y el tercero los mismos impares al
cuadrado. Con `f` y `g` separados, la combinación sale sin escribir una
función nueva.

Falta el tercer hueco: `+` está escrito en el cuerpo, y la productoria
necesita `*`. Una función que recibe dos enteros y devuelve uno,
`(Int, Int) => Int`:

```scala
def operacionGenerica(n: Int, f: Int => Int, g: Int => Int, h: (Int, Int) => Int): Int = {
  @tailrec
  def aux(a: Int, b: Int, acc: Int): Int = {
    if (a > b) acc
    else aux(g(a), b, h(f(a), acc))
  }
  val neutro = if (h(0, 1) == 0) 1 else 0
  aux(1, n, neutro)
}
```

### El acumulador que arranca mal

La primera corrida con `h` en multiplicación devolvió 0. El acumulador
arrancaba en 0, que es el neutro de la suma; en un producto, cualquier cosa
por cero es cero.

Poner 1 fijo tampoco sirve: arruina la suma. El valor de arranque tiene que
depender de la operación, y la operación llega como parámetro, así que se
le pregunta a ella misma:

```scala
val neutro = if (h(0, 1) == 0) 1 else 0
```

Con `h` en suma, `h(0, 1)` es 1 y el neutro queda en 0. Con `h` en
multiplicación, `h(0, 1)` es 0 y el neutro queda en 1. Es una salida por
tanteo —así se presentó en el salón— y funciona porque el 0 absorbe en el
producto y no en la suma.

```
operacionGenerica(15, identidad, suc, suma) = 120
operacionGenerica(15, identidad, suc, mul)  = 2004310016
```

El segundo número no es 15!. Es lo que queda de $15! = 1\,307\,674\,368\,000$
después de desbordar el `Int`, que llega hasta $2^{31} - 1$. El cálculo
corrió entero y el tipo no alcanzó; `Long` o `BigInt` lo sostienen.

## Funciones que devuelven funciones

El otro lado del trato: el resultado también puede ser una función.

```scala
def sumador(n: Int): Int => Int = (x: Int) => x + n
```

`sumador(10)` no es un número, es *la función que suma diez*. Imprimirla
muestra la referencia del objeto, no un entero:

```
FuncionesQueDevuelven$$$Lambda$2/0x00007fed3c093788@5d3411d
25
```

El 25 es `sumador(10)(15)`: el primer paréntesis fabrica la función, el
segundo la aplica. Hacen falta los dos para llegar a un entero.

La motivación fue un llamado que repite un argumento:

```scala
println(suma(5, 1)); println(suma(5, 11)); println(suma(5, 18))
```

El 5 se escribe cada vez. Con una función que devuelve función, se fija una
sola vez:

```scala
def sumaR(a: Int): Int => Int = {
  (b: Int) => a + b
}

val sumaCinco = sumaR(5)
```

```
sumaCinco(1)  = 6
sumaCinco(11) = 16
sumaCinco(18) = 23
```

El tipo de `sumaR` es `Int => (Int => Int)`: recibe un entero y devuelve una
función que espera otro entero.

### La derivada

El mismo patrón sobre funciones de `Double`. La derivada es el límite del
cociente incremental cuando el paso tiende a cero; con un paso fijo y
pequeño queda una función que recibe una función y devuelve otra:

```scala
def derivada(f: Double => Double): Double => Double =
  (x: Double) => (f(x + 0.001) - f(x)) / 0.001
```

Con `cubo`, la derivada exacta es $3x^2$. Lo que sale con paso `0.001`:

```
derivada(cubo)(1) = 3.0030009999995055
derivada(cubo)(2) = 12.0060009999996
derivada(cubo)(3) = 27.009000999996147
```

Cerca de 3, 12 y 27, y ninguno exacto. El paso no puede ser cero —sería una
división por cero— y cualquier paso mayor deja residuo.

A eso se suma el **error de truncamiento**. Un `Double` son 64 bits: uno de
signo, 11 de exponente y el resto de mantisa, que es la que fija cuántos
decimales caben. Lo que no cabe se corta, y las operaciones propagan ese
corte. Por eso los bancos no manejan pesos en `Double`: operan en centavos,
con enteros, y dividen por 100 al mostrar el saldo. Un entero se representa
exacto; un decimal, no siempre.

## Currificación

Los argumentos se pueden entregar en grupos separados, un paréntesis por
grupo:

```scala
def sumaC(a: Int)(b: Int): Int = a + b
```

Cada grupo que se llena deja fija esa parte y devuelve una función que
espera el resto. En el REPL:

```
val g = sumaC(10) _
g(11) = 21
g(15) = 25
```

`g` es *sumar diez*. El guion bajo pide la función sin terminar de aplicar.

Una función currificada recibe un argumento y devuelve otra función con ese
argumento ya fijado. El tipo se escribe anidado y la flecha asocia a la
derecha, así que `Int => Int => Int` es `Int => (Int => Int)`.

### La operación genérica, currificada

```scala
def operacionGenerica(f: Int => Int)(g: Int => Int)(h: (Int, Int) => Int)(n: Int): Int
```

Su tipo completo, sin aplicar nada, es una cadena de cuatro funciones:

```
(Int => Int) => ((Int => Int) => (((Int, Int) => Int) => (Int => Int)))
```

Cuatro grupos, cuatro aplicaciones antes de llegar al entero. Y con los tres
primeros llenos quedan funciones con nombre propio:

```scala
val sumatoria = operacionGenerica((x: Int) => x)((y: Int) => y + 1)((a: Int, b: Int) => a + b) _
val sumatoriaImpares = operacionGenerica((x: Int) => x)((y: Int) => y + 2)((a: Int, b: Int) => a + b) _
```

```
sumatoria(15)        = 120
sumatoria(10)        = 55
sumatoriaImpares(15) = 64
sumatoriaImpares(10) = 25
```

Para eso sirve currificar: de una función genérica se sacan funciones
específicas, fijando de a un grupo, sin escribir cada una desde cero.

## Lo que queda

Los doce ejercicios de [Ejercicios](./Ejercicios.md) siguen los temas de la
sesión en este mismo orden. En clase se recorrieron varios: el que arma el
par `f` / `prox` para tres sumas escritas en matemáticas, la tabla de traza
que se llena antes de correr, la reducción paso a paso y la que pide
encontrar el paso equivocado en una traza escrita.

El ejercicio de la sesión se resuelve con `./gradlew test`, que corre
Scalastyle y después las pruebas. Al hacer *push*, las *actions* del fork
repiten lo mismo y dejan el informe de pruebas como artefacto descargable:
se baja, se descomprime y se abre `index.html`, que es el mismo reporte que
queda en `app/build/reports/tests/test/` al correrlo en el equipo.

Lo que sigue: listas, y sobre ellas `map`, `filter` y `reduce`. Encadenadas
resuelven en una línea lo que hoy pide una función con tres parámetros —
`List(1, 2, 3).map(x => x * x).filter(x => x % 2 != 0)` y de ahí en
adelante— y cada una de esas operaciones recibe justamente una función.
