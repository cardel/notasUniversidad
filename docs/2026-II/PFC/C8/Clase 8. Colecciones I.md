# Clase 8. Colecciones I

Jueves 29 de octubre de 2026.

Llegar al quinto elemento de una lista cuesta pasar por los cuatro anteriores,
y al elemento 100 000, pasar por 99 999. De ahí salen las otras secuencias de
la biblioteca, y con ellas la forma de combinar dos colecciones sin que el
resultado quede anidado.

Las diapositivas están en el Campus Virtual. El código que se escribió en vivo
quedó en
[`codigo/`](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/PFC/C8/codigo),
y los once ejercicios interactivos, en
[Ejercicios](../../../actividades/pfc/colecciones-secuencias-y-conjuntos/index.md).

Referencia: Odersky, Spoon y Venners, *Programming in Scala*, 3.ª edición,
capítulos 17, Working with Other Collections, y 23, For Expressions Revisited.

## De la lista a las otras colecciones

En la cima de la jerarquía está `Iterable`. Debajo hay tres familias: `Seq`,
las secuencias, donde cada elemento tiene una posición y entre ellas están
`List`, `Vector`, `Array`, `Range` y `String`; `Set`, los conjuntos; y `Map`,
que empareja clave con valor. Lo que se escribió sobre listas sirve para
todas, porque `map`, `filter`, `exists`, `forall`, `reduce` y `fold` tienen la
misma forma en cualquiera de ellas. Lo que cambia de una a otra es el costo de
cada operación y qué promete la estructura.

Una lista se construye con cabeza y cola, así que solo sabe llegar a su primer
elemento. Al quinto se llega recorriendo:

```scala
scala> val lst = List(1,2,3,4,5)
val lst: List[Int] = List(1, 2, 3, 4, 5)

scala> lst.tail.tail.tail.tail.head
val res0: Int = 5

scala> lst(4)
val res1: Int = 5
```

`lst(4)` escribe lo mismo más corto y cuesta lo mismo: cuatro pasos. Para el
elemento 100 000 son 99 999, de modo que el acceso por índice es O(n).
Agregar al final tiene el mismo problema, porque hay que llegar al final. La
lista es la estructura correcta mientras el trabajo avance de la cabeza hacia
la cola; cuando hace falta llegar a una posición cualquiera, deja de serlo.

## Array y Vector

Un `Array` de Scala es el arreglo de Java: tamaño fijo, decidido al crearlo, y
elementos de un solo tipo. Lo que lo distingue de las demás colecciones del
curso es que se puede actualizar en su sitio.

```scala
val a = Array(1, 2, 3, 4)
val b = Vector(1, 2, 3, 4)

a(3) = 10
println(a.toList)   // List(1, 2, 3, 10)
// b(3) = 10  no compila: value update is not a member of Vector[Int]
```

El `toList` está porque un arreglo se imprime por su referencia, algo de
la forma `[I@` con unos dígitos que cambian en cada corrida, y no por sus
elementos. Y la asignación `a(3) = 10` cambia el
contenido de una posición, no el tamaño: agregar un quinto elemento a un
`Array` de cuatro no es una operación que exista.

`Vector` es una estructura inmutable, y en lugar de la actualización en su
sitio tiene los dos agregados, que devuelven un vector nuevo y dejan el
original como estaba:

```scala
println(1 +: b)     // Vector(1, 1, 2, 3, 4)
println(b :+ 1)     // Vector(1, 2, 3, 4, 1)
```

Los dos puntos apuntan siempre hacia la colección: `+:` pone el elemento al
inicio y `:+` lo pone al final.

Por dentro, un vector es un árbol con ramificación 32, y su profundidad crece
como el logaritmo en base 32 del tamaño. Un vector de un millón de elementos
tiene cuatro niveles, y llegar a cualquier posición es bajar esos cuatro. Ese
acceso efectivamente logarítmico es lo que lo hace preferible a `List` cuando
el trabajo pide posiciones arbitrarias, y la inmutabilidad lo que lo hace
preferible a `Array` cuando nada debe cambiar en su sitio.

Las operaciones de las listas están igual en los dos:

```scala
println((a map (_ * 2)).toList)          // List(2, 4, 6, 20)
println(b filter (_ % 2 == 0))           // Vector(2, 4)
println(b reduce ((acc, x) => x + acc))  // 10
```

## Rangos

Un rango es una secuencia de números de un valor a otro con paso constante.
`to` incluye el extremo, `until` lo deja fuera y `by` fija el paso.

```scala
println(2 to 8 by 2)             // Range 2 to 8 by 2
println((2 to 8 by 2).toList)    // List(2, 4, 6, 8)
println((2 until 8 by 2).toList) // List(2, 4, 6)
println((2 to 8).toList)         // List(2, 3, 4, 5, 6, 7, 8)
println((2 until 8).toList)      // List(2, 3, 4, 5, 6, 7)
```

La primera línea muestra lo que un rango guarda: inicio, fin y paso, no sus
elementos. Imprimirlo da la descripción, y `toList` es lo que obliga a
producirlos uno por uno. Un rango vacío también se describe en lugar de
mostrarse: `2 to 1` se imprime `empty Range 2 to 1`. El rango vacío reaparece
en el test de primalidad.

## exists y forall

Un predicado es una función que devuelve un booleano, y a una colección entera
se le hacen dos preguntas con él. `exists` es la existencial, verdadera cuando
al menos un elemento cumple. `forall` es la universal, verdadera cuando todos
cumplen.

```scala
scala> Vector(1,2,3,4).exists(x => x > 3)
val res0: Boolean = true

scala> Vector(1,2,3,4).forall(x => x > 3)
val res1: Boolean = false

scala> Vector(1,2,3,4).forall(x => x > 0)
val res2: Boolean = true
```

Sobre la colección vacía las dos responden sin examinar nada, y sus respuestas
no son simétricas:

```scala
scala> Vector[Int]().forall(x => x > 0)
val res3: Boolean = true

scala> Vector[Int]().exists(x => x > 0)
val res4: Boolean = false
```

`forall` da verdadero porque no hay ningún elemento que incumpla, y `exists`
da falso porque no hay ninguno que cumpla. Las dos respuestas son las que
corresponden, y la primera hay que tenerla presente cuando el rango sobre el
que se pregunta puede quedar sin elementos.

## Cuándo un número es primo

Un entero mayor que 1 es primo cuando sus únicos divisores son 1 y él mismo.
Dicho con residuos, que es la forma que se puede programar, ningún entero
entre 2 y n - 1 lo divide: todos dejan residuo distinto de cero.

El teorema fundamental de la aritmética dice que todo entero mayor que 1 se
descompone en un producto de primos, y que esa descomposición es única salvo
el orden de los factores. Así, 8 = 2³ y 18 = 2 · 3².

Para decidir si n es primo basta explorar de 2 hasta la raíz de n, y lo que lo
justifica es el menor divisor. Si n es compuesto se escribe n = a · b con
1 < a ≤ b, y entonces a · a ≤ a · b = n, es decir a ≤ √n. El menor divisor no
trivial de un compuesto nunca pasa de la raíz, así que cuando nada entre 2 y
√n divide a n, tampoco lo divide nada mayor.

```scala
def esPrimo(n: Int): Boolean =
  n >= 2 && (2 to Math.sqrt(n).toInt).forall(x => n % x != 0)
```

Los residuos se ven con un `map` antes de resumirlos con `forall`:

```scala
println((2 to Math.sqrt(17).toInt) map (x => 17 % x != 0))  // Vector(true, true, true)
println((2 to Math.sqrt(22).toInt) map (x => 22 % x != 0))  // Vector(false, true, true)
```

Para 17 el rango es `2 to 4` y ninguno de los tres divide. Para 22 el primer
divisor ya aparece, y con ese falso `forall` puede responder.

La guarda `n >= 2` sostiene la definición en los extremos. Para n = 1 el rango
`2 to Math.sqrt(1).toInt` es `empty Range 2 to 1`, y `forall` sobre lo vacío es
verdadero, de modo que 1, 0 y los negativos quedarían clasificados como
primos. Para 2 y para 3 el rango también queda vacío, y ahí el verdadero por
vacuidad es la respuesta correcta: no hay divisor posible entre 2 y la raíz.

```scala
println(esPrimo(2))   // true
println(esPrimo(3))   // true
println(esPrimo(4))   // false

println((1 to 21) map (x => (x, esPrimo(x))))
// Vector((1,false), (2,true), (3,true), (4,false), (5,true), (6,false),
//        (7,true), (8,false), (9,false), (10,false), (11,true), (12,false),
//        (13,true), (14,false), (15,false), (16,false), (17,true),
//        (18,false), (19,true), (20,false), (21,false))
```

## Combinar dos colecciones

Con un `map` dentro de otro, cada elemento del primer vector produce un vector
entero, y el resultado queda en dos niveles:

```scala
scala> Vector(1,2,3).map(x => Vector(4,5,6).map(y => (x,y)))
val res0: Vector[Vector[(Int, Int)]] = Vector(Vector((1,4), (1,5), (1,6)), Vector((2,4), (2,5), (2,6)), Vector((3,4), (3,5), (3,6)))
```

`flatMap` hace el mismo recorrido y concatena los trozos, de modo que las
nueve parejas salen en un solo vector:

```scala
scala> Vector(1,2,3).flatMap(x => Vector(4,5,6).map(y => (x,y)))
val res1: Vector[(Int, Int)] = Vector((1,4), (1,5), (1,6), (2,4), (2,5), (2,6), (3,4), (3,5), (3,6))
```

Las nueve parejas son el producto cartesiano de los dos vectores. Con tres
colecciones se anidan dos `flatMap` y el último paso vuelve a ser un `map`:

```scala
Vector(1,2,3).flatMap(x => Vector(4,5,6).flatMap(y => Vector(7,8,9).map(z => (x,y,z))))
// Vector((1,4,7), (1,4,8), (1,4,9), (1,5,7), ..., (3,6,9))
```

Son 27 ternas, las 3 · 3 · 3 combinaciones. La regla se repite con cualquier
número de colecciones: el último paso arma el elemento y los anteriores
aplanan lo que viene de arriba. Cada colección que entra así se llama un
generador.

`zip` empareja de otra manera, por posición, y se detiene en la más corta de
las dos secuencias:

```scala
scala> Vector(1,2,3) zip Vector(4,5,6)
val res2: Vector[(Int, Int)] = Vector((1,4), (2,5), (3,6))

scala> (Vector(1,2,3) zip Vector(4,5,6)).map(p => p._1 * p._2).sum
val res3: Int = 32
```

Tres parejas, no nueve, y con ellas el producto escalar:
1 · 4 + 2 · 5 + 3 · 6 = 32. La distinción conviene fijarla, porque las dos
operaciones reciben lo mismo y devuelven cosas distintas: `flatMap` da todas
las combinaciones, `zip` solo las que comparten posición.

### Las parejas cuya suma es prima

Entre 1 y n, generar las parejas (i, j) con i < j cuya suma sea un número
primo:

```scala
def generadorMap(n: Int): Seq[(Int, Int)] =
  (1 to n).flatMap(i =>
    (i + 1 to n).filter(j => esPrimo(i + j)).map(j => (i, j)))
```

El segundo generador arranca en `i + 1`, y eso resuelve dos cosas de una vez:
asegura que i sea menor que j y deja cada pareja una sola vez, porque (3, 4) y
(4, 3) son la misma. Con `1 to n` en el segundo generador aparecerían las dos,
y con `i to n` aparecería además la pareja de un número consigo mismo.

El filtro se aplica al rango de los j, antes de armar la pareja, porque la
condición habla de i + j. Puesto después del `map` recibiría la pareja ya
construida y tendría que descomponerla con un patrón,
`filter { case (x, y) => esPrimo(x + y) }`.

El `flatMap` de afuera es el que evita el vector de vectores:

```scala
scala> (1 to 4).map(i => (i + 1 to 4).map(j => (i,j)))
val res4: IndexedSeq[IndexedSeq[(Int, Int)]] = Vector(Vector((1,2), (1,3), (1,4)), Vector((2,3), (2,4)), Vector((3,4)), Vector())
```

El último vector está vacío porque para i = 4 el rango `5 to 4` no tiene
elementos. Con n = 10 hay 45 parejas posibles, y 18 pasan el filtro:

```
Vector((1,2), (1,4), (1,6), (1,10), (2,3), (2,5), (2,9), (3,4), (3,8),
       (3,10), (4,7), (4,9), (5,6), (5,8), (6,7), (7,10), (8,9), (9,10))
```

## Cadenas y conjuntos

Un `String` es una secuencia de caracteres, y acepta las operaciones de
cualquier otra secuencia. Filtrar un texto devuelve un texto, y transformar
sus caracteres también:

```scala
scala> "funcional".toList
val res0: List[Char] = List(f, u, n, c, i, o, n, a, l)

scala> "funcional".filter(c => c != 'n')
val res1: String = fucioal

scala> "funcional".map(c => c.toUpper)
val res2: String = FUNCIONAL

scala> "funcional".length
val res3: Int = 9
```

Un `Set` es una colección cuyos elementos no se repiten y que no promete
ningún orden:

```scala
val s1 = (1 to 6).toSet
val s2 = Set(2, 3, 4, 5)
println(s1)   // HashSet(5, 1, 6, 2, 3, 4)
println(s2)   // Set(2, 3, 4, 5)
```

Los dos se construyeron con sus elementos en orden y se imprimen de dos
maneras: con nombres distintos, y el primero además con los elementos
revueltos. Ni el nombre que aparece ni el orden forman parte de lo que un
conjunto promete: dependen de la implementación que quede detrás, y un
programa que se apoye en ellos se rompe cuando el conjunto crece.

La pertenencia se pregunta de dos formas que son la misma pregunta:

```scala
println(s1 contains 1)    // true
println(s1 contains 10)   // false
println(s1(1))            // true
println(s1(10))           // false
```

Aplicar el conjunto a un elemento, como si fuera una función, da su
pertenencia. Un conjunto se comporta como el predicado que lo define.

Las operaciones entre conjuntos son las de la teoría:

```scala
println(s1 union s2)      // HashSet(5, 1, 6, 2, 3, 4)
println(s1 intersect s2)  // HashSet(5, 2, 3, 4)
println(s1 diff s2)       // HashSet(1, 6)
```

`s2` está contenido en `s1`, así que la unión tiene los seis elementos de `s1`
y la intersección es `s2`. La diferencia deja el 1 y el 6, los de `s1` que
`s2` no tiene.

`map` y `filter` también están, y en un conjunto el primero tiene una
consecuencia que no tiene en una secuencia:

```scala
println(s1 filter (x => x > 2))     // HashSet(5, 6, 3, 4)
println(s1 forall (x => x > 2))     // false
println(s1 map (x => x / 2))        // HashSet(0, 1, 2, 3)
```

Seis elementos entran al `map` y salen cuatro. La división entera manda 2 y 3
al 1, y 4 y 5 al 2, y el conjunto guarda un solo ejemplar de cada valor.

## Expresiones for

Una expresión `for` con `yield` escribe en un solo lugar la combinación de
`flatMap`, `map` y `filter`. Las parejas de suma prima se escriben así:

```scala
def generadorFor(n: Int): Seq[(Int, Int)] = {
  for {
    i <- 1 to n
    j <- i + 1 to n
    if esPrimo(i + j)
  } yield (i, j)
}
```

```scala
println(generadorFor(10) == generadorMap(10))  // true
```

Cada `<-` es un generador, cada `if` es un filtro y `yield` arma el elemento
del resultado. La traducción es la que se escribió a mano antes: todos los
generadores menos el último se vuelven `flatMap`, el último se vuelve `map`, y
el `if` se vuelve un paso de filtrado. El compilador lo hace con `withFilter`,
la versión perezosa de `filter`, que no construye la colección intermedia.

La forma de la expresión decide dos cosas. El último generador es el que varía
más rápido, porque para cada `i` se recorre entero el rango de `j`. Y el tipo
del resultado lo fija el primer generador: con un rango sale un `IndexedSeq`,
que se imprime como `Vector`, y `toList` o `toSet` lo convierten en otra cosa.

Conviene no confundirla con el ciclo que comparte el nombre. Aquí no hay
contador ni estado que avance, y la expresión completa vale la colección que
los `yield` construyen.

Los primos de 1 a 100, con un generador y un filtro:

```scala
println(for { i <- 1 to 100; if esPrimo(i) } yield i)
// Vector(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59,
//        61, 67, 71, 73, 79, 83, 89, 97)
```

Son los 25 primos menores que 100.

Las ternas pitagóricas piden tres generadores y el teorema de Pitágoras como
filtro:

```scala
scala> for { x <- 1 to 20; y <- x to 20; z <- 1 to 20; if x*x + y*y == z*z } yield (x,y,z)
val res0: IndexedSeq[(Int, Int, Int)] = Vector((3,4,5), (5,12,13), (6,8,10), (8,15,17), (9,12,15), (12,16,20))
```

Seis ternas hasta 20. El segundo generador arranca en `x`, y eso quita los
duplicados: con `1 to 20` saldrían (3,4,5) y (4,3,5), que son la misma terna
con los catetos cambiados de orden. El procedimiento es búsqueda exhaustiva:
se prueban todas las combinaciones y el filtro deja las que cumplen.

## Las fechas de un intervalo de años

El ejercicio de la sesión: con `Fecha(dia, mes, año)` de componentes
numéricos, generar todas las fechas válidas desde un año inicial hasta un año
final.

```scala
case class Fecha(dia:Int, mes:Int, año:Int)
```

Tres generadores anidados producen los candidatos y un filtro descarta los que
no existen. El día va de 1 a 31 para cualquier mes:

```scala
def fechasFor(ini:Int, fin:Int):Seq[Fecha] = {
  for {
    a <- (ini to fin)
    m <- (1 to 12)
    d <- (1 to 31)
    if validarFecha(d,m,a)
  } yield Fecha(d,m,a)
}
```

El año por fuera y el día por dentro es lo que hace salir las fechas en orden
cronológico, porque el último generador es el que varía más rápido.

El filtro es una función aparte, porque la condición depende de los tres
números a la vez:

```scala
def validarFecha(dia:Int, mes:Int, año:Int):Boolean = {
  if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
    dia <= 30
  }
  else {
    if (mes == 2) {
      if(año % 4 == 0 && (año % 400 == 0 || año % 100 != 0)) {
        dia <= 29
      }
      else{
        dia <= 28
      }
    }
    else{
      true
    }
  }
}
```

Los meses de 31 días no necesitan caso propio: el generador no produce días
mayores que 31, así que para ellos la respuesta es `true`. Abril, junio,
septiembre y noviembre piden `dia <= 30`. Febrero es el único que mira el año,
y la condición del bisiesto, tal como está escrita, pide que el año sea
divisible por 4 y además divisible por 400 o no divisible por 100. Es la regla
de cada cuatro años, con los múltiplos de 100 fuera y los de 400 otra vez
dentro.

Dos intervalos lo comprueban. `fechasFor(1900,1901)` devuelve 730 fechas, y en
ellas febrero de 1900 termina el 28, porque 1900 es divisible por 100 y no por
400. `fechasFor(2000,2001)` devuelve 731, con el 29 de febrero de 2000
incluido. Dos años comunes dan 730 días; uno bisiesto y uno común, 731.

La misma generación con funciones de alto orden es la traducción del `for`
escrita a mano:

```scala
def fechasMap(ini:Int, fin:Int):Seq[Fecha] = {
   (ini to fin) flatMap { a =>
    (1 to 12) flatMap { m =>
      (1 to 31) filter { d =>
        validarFecha(d,m,a)
      } map { d =>
        Fecha(d,m,a)
      }
    }
  }
}
```

Son dos `flatMap` para los dos primeros generadores, el filtro sobre el rango
de los días y un `map` al final para armar la fecha. Las dos versiones
devuelven la misma secuencia en los tres intervalos probados:

```scala
println(fechasFor(2020,2026) == fechasMap(2020,2026))  // true
println(fechasFor(1900,1901) == fechasMap(1900,1901))  // true
println(fechasFor(2000,2001) == fechasMap(2000,2001))  // true
```

## Ejercicios propuestos

1. Las fechas, escritas sin mirar la versión de la sesión. Con
   `Fecha(dia, mes, año)` de componentes numéricos, generar todas las fechas
   válidas entre un año inicial y uno final: enero, marzo, mayo, julio,
   agosto, octubre y diciembre tienen 31 días; abril, junio, septiembre y
   noviembre, 30; febrero tiene 28, o 29 cuando el año es divisible por 4,
   salvo los divisibles por 100 que no lo sean por 400. Hacerlo con `map`,
   `flatMap` y `filter`, y con una expresión `for`, y comprobar que las dos
   secuencias son iguales.
2. `esPrimo` escrita con `exists`, negando que exista un divisor, y la
   comprobación de que coincide con la versión de `forall` en todos los
   valores de 1 a 100.
3. El producto escalar de dos vectores del mismo tamaño con `zip`, `map` y
   `sum`. Después, decir qué devuelve `for { x <- a; y <- b } yield x * y` y
   por qué no es el producto escalar.
4. Las ternas pitagóricas hasta 100 con `flatMap` y `filter` en lugar de la
   expresión `for`, y qué cambia en el resultado y en el trabajo que se hace
   si el tercer generador arranca en `y`.
5. Con `toSet` sobre una palabra, cuántas letras distintas tiene; con
   `intersect`, las letras que dos palabras comparten. Y por qué `toSet` no
   sirve para decidir si dos palabras son anagramas.

## Lo que queda

De las colecciones faltan los mapas, que guardan pares de clave y valor y se
consultan por la clave, y los flujos, cuyos elementos no se producen hasta que
alguien los pide y que por eso pueden ser infinitos.

Con las expresiones `for` ya está todo lo que pide el
[Taller 3](https://github.com/EjerciciosClasesCardel/pfc-taller-3-registro-sismico).
El proyecto final mide la similitud entre documentos comparando huellas que
son conjuntos, con el índice de Jaccard entre ellas.
