# Clase 1. Principios y elementos de programación funcional

Jueves 10 de septiembre de 2026.

Programar sin variables que cambien suena a una restricción arbitraria hasta
que se ve de dónde sale. La sesión empieza con un problema que cualquiera
resuelve con un ciclo y un acumulador, muestra qué se pierde por el camino, y
termina con las reglas que dicen en qué orden se reemplaza una expresión hasta
que queda un valor.

Las diapositivas están en el Campus Virtual. Aquí quedan las notas de lo que se
dijo en el salón y el código que se escribió en vivo, en
[`codigo/`](codigo/). Los dos ejercicios interactivos de la sesión están en
[Ejercicios](./Ejercicios.md).

Referencia: Odersky, Spoon y Venners, *Programming in Scala*, 3.ª edición,
capítulos 1 y 2. El curso de Coursera del mismo autor sigue este libro.

## El problema que abrió la clase

Sumar los cuadrados de los pares hasta cien. Con lo que ya se sabe, sale un
ciclo:

```scala
var suma = 0
for (i <- 1 to 100)
  if (i % 2 == 0) suma = suma + i * i
suma
```

Funciona. Y para saber qué devuelve hay que simular la memoria: cien pasos, y
en cada uno `suma` vale otra cosa.

Dentro de ese ciclo hay tres decisiones distintas metidas en el mismo lugar:
**qué números tomar**, **qué hacerle a cada uno** y **cómo juntarlos**. Ninguna
se puede cambiar sin releer las otras dos. Si mañana piden los cubos de los
múltiplos de tres, se reescribe todo.

Antes de programar nada se hizo el ejercicio de separar entradas y salidas. La
entrada es un entero `n`, el tope del recorrido. La salida es la suma de los
cuadrados de los pares entre 1 y `n`. Con un caso pequeño, `n = 10`:

```
pares:      2    4    6    8   10
cuadrados:  4   16   36   64  100
suma:       4   20   56  120  220
```

Alguien respondió 385, y vale la pena mirar de dónde sale ese número: es la
suma de los cuadrados de **todos** los enteros de 1 a 10, no solo de los pares.
El filtro se perdió. En la versión con ciclo ese filtro vivía escondido dentro
del `if`, mezclado con el acumulador, y por eso se cae tan fácil.

Con las tres decisiones separadas, cada una se lee sola:

```scala
def paresHasta(n: Int): List[Int] = (2 to n by 2).toList
def cuadrado(x: Int): Int = x * x
def sumaCuadradosPares(n: Int): Int = paresHasta(n).map(cuadrado).sum
```

```
paresHasta(10)          = List(2, 4, 6, 8, 10)
cuadrados               = List(4, 16, 36, 64, 100)
sumaCuadradosPares(10)  = 220
sumaCuadradosPares(100) = 171700
cuadrados de 1 a 10     = 385
```

Cambiar de pares a múltiplos de tres toca una línea y deja las otras dos
intactas.

## Paradigmas

Un paradigma es un patrón de pensamiento que domina una disciplina. En
programación conviven varios, y ya se han visto tres.

El **imperativo** trabaja sobre el estado: variables que cambian, lectura como
instrucción de carga, asignación como instrucción de almacenamiento,
estructuras de control como saltos. Eso viene del esquema de von Neumann, donde
datos y código viven en el mismo segmento de memoria; una variable mutable es
una celda de esa memoria.

El **declarativo** dice qué se quiere, no cómo se hace. HTML es declarativo: al
escribir `<img src="...">` se pide que aparezca una imagen, sin decir cómo
dibujarla. El funcional es de esta familia.

El **lógico** es el de las operaciones y los cuantificadores de Discretas I. Y
están además el concurrente, el orientado a objetos, el orientado a eventos y
el relacional. Cada uno intenta resolver el mismo problema a su manera.

En este curso: sin variables mutables, sin asignación, sin ciclos, sin `return`.
Ninguna de esas construcciones está permitida, y la plantilla que se entrega
para los talleres está configurada para fallar si aparecen. No importa si el
programa funciona: importa cómo está hecho.

## Las funciones son valores

Un valor se calcula una vez. Una función se vuelve a usar con otros argumentos.

```scala
val radio = 3.0
val areaVal = math.Pi * radio * radio     // esto ya es un número

def areaDef(r: Double) = math.Pi * r * r  // esto se puede volver a llamar
```

Decir que las funciones son valores significa que no hay diferencia de
categoría entre una función y un número: se pueden pasar como argumento,
devolver como resultado y combinar con operadores. Sobre un número se puede
sumar o multiplicar; sobre una función hay exactamente dos operaciones,
**invocarla** —pasarle argumentos— o **componerla** con otra.

## El modelo de sustitución

Evaluar es reemplazar hasta que no quede nada por reemplazar. Las reglas:
identificar el operador principal según su prioridad, evaluar los operandos de
izquierda a derecha, y aplicar el operador a los operandos ya reducidos.

Con `def doble(n: Int) = 2 * n`, la expresión `doble(21) + doble(21)`:

| Paso | Expresión | Qué se hizo |
|---:|---|---|
| 1 | `doble(21) + doble(21)` | |
| 2 | `2 * 21 + doble(21)` | se reemplaza la primera llamada por el cuerpo |
| 3 | `42 + doble(21)` | aritmética |
| 4 | `42 + 2 * 21` | se reemplaza la segunda |
| 5 | `42 + 42` | aritmética |
| 6 | `84` | la suma final |

Ahora la misma función, pero que anuncia lo que hace:

```scala
def dobleConRuido(n: Int): Int =
  println(s"calculando el doble de $n")
  2 * n
```

```
dobleConRuido(21) + dobleConRuido(21):
calculando el doble de 21
calculando el doble de 21
84

con el resultado ligado a un nombre:
calculando el doble de 21
84
```

El número es 84 en los dos casos. Lo que cambió es cuántos anuncios salieron, y
el tipo `Int` de la firma no dice nada al respecto: el efecto es invisible desde
afuera. Esa es la razón de fondo para trabajar con funciones que solo devuelven
un valor y no hacen nada más por el camino.

## Composición: `andThen` y `compose`

Una función tiene un **dominio**, los valores que recibe, y un **rango**, los
que produce. Para componer dos, el rango de la primera tiene que caber en el
dominio de la segunda. Es la condición que ya apareció en Discretas I.

Scala trae los dos órdenes, y se recorren al revés:

```scala
def siguiente(n: Int) = n + 1
def alCuadrado(n: Int) = n * n

val mismaCosa = siguiente andThen alCuadrado   // (x + 1)^2
val alReves   = siguiente compose alCuadrado   // x^2 + 1
```

`f andThen g` aplica primero `f`; es `g(f(x))`. `f compose g` aplica primero
`g`; es `f(g(x))`. Con las mismas dos funciones dan cosas distintas:

```
  x | (x+1)^2 | x^2+1
  0 |       1 |     1
  1 |       4 |     2
  2 |       9 |     5
  3 |      16 |    10
  4 |      25 |    17
```

Coinciden en cero y se separan de ahí en adelante.

El caso que se usó en clase fue redondear un área a dos decimales. El truco del
redondeo es multiplicar por 100, redondear a entero y dividir por 100.0; para
tres decimales, por 1000:

```scala
def area(r: Double) = math.Pi * r * r
def dosDecimales(x: Double) = math.round(x * 100) / 100.0

val areaRedondeada = area _ andThen dosDecimales
```

```
area(2.0)           = 12.566370614359172
areaRedondeada(2.0) = 12.57
```

Escrito como una sola función que hace las dos cosas, pedir el área sin
redondear obligaría a escribirla de nuevo. Separadas, cada mitad se prueba
sola y se reusa.

## Cinco formas de definir una función

El enésimo número triangular es la suma de los enteros de 1 a `n`. Para `n = 4`
vale 10.

1. **Tabulación**: escribir la respuesta para cada entrada.
2. **Fórmula**: `n * (n + 1) / 2`, la suma de Gauss de Discretas I.
3. **Composición**: `sumar(n, triangularFormula(n - 1))`.
4. **Por casos**.
5. **Recursión**: `if (n <= 0) 0 else n + triangularRecursivo(n - 1)`.

```
  n | tabla | formula | composicion | casos | recursivo
  0 |     0 |       0 |           0 |     0 |         0
  1 |     1 |       1 |           1 |     1 |         1
  2 |     3 |       3 |           3 |     3 |         3
  3 |     6 |       6 |           6 |     6 |         6
  4 |    10 |      10 |          10 |    10 |        10
  5 |    -1 |      15 |          15 |    15 |        15
  6 |    -1 |      21 |          21 |    21 |        21
```

Donde se rompe la tabulación se ve en la fila del 5: el dominio de los enteros
es infinito y la tabla se acabó. De las cinco, las que se usan en la práctica
son la fórmula y la recursión.

Desplegando la recursión para `n = 5`:

```
triangular(5) = 5 + triangular(4)
              = 5 + (4 + triangular(3))
              = 5 + (4 + (3 + triangular(2)))
              = 5 + (4 + (3 + (2 + triangular(1))))
              = 5 + (4 + (3 + (2 + (1 + triangular(0)))))
```

y `triangular(0)` es el caso base, que vale 0. De ahí se devuelve la suma.

## Scala

Corre sobre la máquina virtual de Java —Java 17 en adelante—, trata las
funciones como valores, ofrece concurrencia de alto nivel y sostiene
procesamiento de grandes volúmenes de datos. Su sintaxis se parece a la de
Java, que es la ventaja frente a Haskell o Erlang para quien viene de ahí.

**El curso usa Scala 2.13, no Scala 3.** Las librerías del material están
versionadas para esa versión.

Hay lenguajes puramente funcionales —Haskell y los de su familia, mientras no
se recurra a la mónada de entrada y salida— y otros que permiten escapes hacia
el estado: Racket, Clojure, SML, OCaml, F#, Scala. Scala es de los segundos, y
en este curso ese escape se usa con cuentagotas; aparece más adelante, en unas
partes de concurrencia.

## Expresiones, ligaduras y una división que sorprende

Un lenguaje da tres cosas: expresiones primitivas —un `2`, un `true`—, maneras
de combinarlas —los operadores— y maneras de nombrarlas.

A eso último no se le dice asignación sino **ligadura**, y la diferencia es de
fondo: una asignación se puede cambiar después, una ligadura no.

Con el REPL a mano:

```
1 / 3     = 0
1.0 / 3   = 0.3333333333333333
```

La misma operación, resultados distintos. Los dos operandos de la primera son
enteros y la división entera trunca; el `.0` de la segunda la vuelve división de
flotantes.

## Evaluación por valor y por nombre

Son dos maneras de reducir una llamada, y solo se diferencian en cuándo se
reducen los argumentos.

**Por valor** (CBV): se evalúan los argumentos de izquierda a derecha, se
reemplaza la llamada por el cuerpo con cada parámetro ya reducido, y se evalúa.

**Por nombre** (CBN): el argumento entra sin reducir, y se reduce solo si el
cuerpo lo usa.

Con `square` y `sumOfSquares`, sobre `sumOfSquares(3, 2 + 2)`, las dos llegan a
25: por valor en ocho pasos, por nombre en nueve. El de más sale de que `2 + 2`
queda escrito dos veces dentro del cuerpo y se paga dos veces.

Las dos dan el mismo valor si la expresión es puramente funcional **y si las dos
terminan**. La segunda condición no es un adorno:

```scala
def bucle: Int = bucle
def primero(x: Int, y: Int): Int = x
```

`primero(1, bucle)` debería contestar 1 sin mirar el segundo argumento. Por
valor no puede: hay que reducir `bucle` antes de entrar, y `bucle` no se deja
reducir. Corrido con un límite de veinte segundos, el programa no alcanza a
imprimir una sola línea y hay que matarlo:

```
$ timeout 20 scala-cli run 05b_por_valor_se_cuelga.scala
[warn] Infinite recursive call
[warn] def bucle: Int = bucle
$ echo $?
124
```

El aviso es del compilador. El 124 dice que se agotó el plazo.

Basta una flecha en el tipo del parámetro para cambiar la estrategia de ese
argumento:

```scala
def primeroPorNombre(x: Int, y: => Int): Int = x
```

```
primeroPorNombre(1, bucle) = 1
```

Contando evaluaciones con una función que se anuncia:

```
porValor(ruidoso(3), ruidoso(4)):
  evaluando 3
  evaluando 4
9
porNombre(ruidoso(3), ruidoso(4)):
  evaluando 3
9
dosVeces(ruidoso(5)):
  evaluando 5
  evaluando 5
10
```

Las dos primeras muestran lo esperado: por valor se evalúan los dos argumentos
aunque el cuerpo use uno solo. La tercera muestra el malentendido más común con
`=>`. En `dosVeces(y) = y + y` el argumento aparece dos veces y se evalúa dos
veces. **Por nombre significa cada vez que se use, no una vez y guardado.**

## `val` frente a `def`

Es la misma distinción, aplicada a nombrar en lugar de a pasar argumentos.

```scala
def anuncia(): Int =
  println("hola")
  4

val conVal = anuncia()   // se evalúa aquí, una vez
def conDef = anuncia()   // se evalúa cada vez que se use
```

```
hola                     <- salió al ligar conVal, antes de todo lo demás
--- val frente a def ---
conVal = 4
conVal = 4
ahora con def, dos usos:
hola
conDef = 4
hola
conDef = 4
```

Por eso `bucle` se escribió con `def` y no con `val`: un `val` lo habría
evaluado en el punto de definición y el programa se habría colgado ahí mismo.

## Condicionales y cortocircuito

En un lenguaje imperativo el `if` es una bifurcación: dos caminos de ejecución.
Aquí no. El `if` es una expresión que se reduce a un valor, uno u otro según la
condición:

```scala
val k = if (umbral < 3) 2 else 11
```

Con `umbral = 5`, `k` vale 11, y es como si estuviera escrito el 11 ahí mismo.
Todo se reduce a un valor: sea una lista, sea una raíz, sea lo que sea.

Sobre `&&` y `&`: los dos dan el mismo resultado, y no evalúan lo mismo.

```
false && ruidosoBool(true):
false
false & ruidosoBool(true):
  evaluando true
false
```

`&&` es un operador de cortocircuito: al encontrar el primer `false` para y
devuelve `false`, porque en una conjunción con un falso ya está todo decidido.
`&` evalúa los dos operandos. Con `||` pasa lo análogo con el primer `true`.

Y es el mismo mecanismo del parámetro por nombre: `&&` nombra su segundo
operando sin evaluarlo.

## Bloques y alcance léxico

Cuando hace falta calcular algo antes de devolver, se usa un bloque. Un bloque
contiene definiciones y expresiones, y **su valor es el de la última
expresión**.

Esta se armó en el salón, buscando que el cuadrado conserve el signo de la
entrada:

```scala
def cuadradoConSigno(x: Int): Int =
  val positivo = if (x < 0) -x else x
  positivo * x
```

```
cuadradoConSigno(5)  = 25
cuadradoConSigno(-5) = -25
```

El primer intento fue reasignar `x`, que aquí no se puede. Con una ligadura
nueva sí: se calcula el auxiliar, y la última línea es lo que sale.

Adentro de un bloque se ve lo de afuera; afuera no se ve lo de adentro. Y un
nombre repetido adentro **tapa** al de afuera sin cambiarlo — eso es
ocultamiento:

```scala
val x = 5
def f(y: Int): Int = y + 1

val resultado =
  val bloque =
    val x = f(3)     // este x es otro, vale 4
    x * x            // 16
  bloque + x         // el x de afuera sigue siendo 5
```

```
resultado = 21
x de afuera sigue siendo 5
```

El bloque interno se reduce a 16 y desaparece; queda `16 + 5`. Los dos `x` son
nombres distintos que se escriben igual, y como son ligaduras, ninguno cambia
al otro.

## Lo que queda

En el campus están los dos chequeos de lectura de esta semana —esta sesión
cubrió dos temas, y por eso son dos— y el ejercicio práctico de introducción a
Scala, que se entrega haciendo *fork* del repositorio y habilitando las
*actions*: al hacer *push* corre un flujo que dice si está bien.

De los catorce chequeos del semestre se descartan los dos más bajos.

Lo que sigue: el modelo de sustitución aplicado a funciones recursivas, y la
diferencia entre las que dejan trabajo pendiente y las que no.
