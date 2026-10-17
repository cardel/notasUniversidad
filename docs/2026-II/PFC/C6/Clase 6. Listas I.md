# Clase 6. Listas I

Jueves 15 de octubre de 2026.

Una lista tiene dos formas y ninguna más: o está vacía, o es un elemento
seguido de otra lista. De ahí sale el resto: cómo se construye, cómo se
descompone, por qué llegar al elemento número mil cuesta mil pasos y qué se
gana a cambio de ese costo.

Las diapositivas están en el Campus Virtual. El código que se escribió en vivo
quedó en
[`codigo/`](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/PFC/C6/codigo),
y los cuatro ejercicios interactivos, en
[Ejercicios](../../../actividades/pfc/listas/index.md).

Referencia: Odersky, Spoon y Venners, *Programming in Scala*, 3.ª edición,
capítulo 16, Working with Lists.

## Qué es una lista

Una colección ordenada de elementos del mismo tipo, con dos propiedades que
mandan sobre lo demás. Es **inmutable**: no se cambia, y si hace falta otra
cosa se construye una lista nueva. Es **recursiva**: se define en términos de
sí misma, una cabeza y otra lista más pequeña.

Sirve la imagen de una fila de personas. La primera es la cabeza, el resto de
la fila es la cola, y no se puede sacar a alguien del medio sin reorganizar la
fila entera.

```scala
scala> List(1, 2, 3)
val res0: List[Int] = List(1, 2, 3)

scala> List("Hola", "Mundo")
val res1: List[String] = List(Hola, Mundo)

scala> List(false, true, false)
val res2: List[Boolean] = List(false, true, false)

scala> List()
val res3: List[Nothing] = List()
```

El tipo de la lista vacía es `List[Nothing]`: Scala todavía no sabe qué va a
guardar, y lo resuelve cuando se le ponen elementos.

Scala acepta `List(1, "hola", true)` y le asigna el tipo `List[Any]`. Una
función recursiva sobre una lista así no tiene cómo operar los elementos: cada
uno pediría un tratamiento distinto.

## Los dos constructores

Toda lista se arma con dos piezas: `Nil`, la lista vacía, y `::`, que se lee
cons y recibe un elemento a la izquierda y una lista a la derecha.

```scala
scala> 1 :: 2 :: 3 :: Nil
val res4: List[Int] = List(1, 2, 3)

scala> Nil
val res5: collection.immutable.Nil.type = List()
```

`Nil` es el caso base: cualquier lista nace de ahí, sea de números, de cadenas
o de otras listas. `List(1, 2, 3, 4)` es azúcar sintáctico de
`1 :: 2 :: 3 :: 4 :: Nil`.

### El operador asocia por la derecha

A diferencia de los demás operadores de Scala, `::` se resuelve de derecha a
izquierda. Primero `4 :: Nil`, que da la lista de un elemento; después
`3 :: List(4)`; después `2 :: List(3, 4)`; al final `1 :: List(2, 3, 4)`.

```scala
1 :: 2 :: 3 :: 4 :: Nil
1 :: 2 :: 3 :: List(4)
1 :: 2 :: List(3, 4)
1 :: List(2, 3, 4)
```

Las cuatro líneas dan `List(1, 2, 3, 4)`, y `List(4)` es `4 :: Nil`.

La razón es de tipos: el segundo operando de `::` tiene que ser una lista, y
al agrupar por la izquierda deja de serlo:

```scala
scala> (1 :: 2) :: Nil
                 ^
       error: value :: is not a member of Int
```

El paréntesis obliga a evaluar `1 :: 2` primero, y un `Int` no tiene `::`.

### Agrupar cambia el tipo del resultado

```scala
scala> 1 :: 2 :: 3 :: Nil :: 1 :: 2 :: 3 :: Nil
val res6: List[Any] = List(1, 2, 3, List(), 1, 2, 3)

scala> (1 :: 2 :: 3 :: Nil) :: (1 :: 2 :: 3 :: Nil) :: Nil
val res7: List[List[Int]] = List(List(1, 2, 3), List(1, 2, 3))
```

Sin paréntesis, ese `Nil` del medio queda como un elemento más de la lista y
el tipo se va a `List[Any]`. Con paréntesis, cada grupo es una lista y el
resultado es una lista de listas.

## Cabeza y cola

Tres primitivas descomponen una lista. `head` devuelve el primer elemento;
`tail`, la lista sin él; `isEmpty` dice si está vacía.

```scala
scala> val l = 1 :: 2 :: 3 :: 4 :: 5 :: Nil
val l: List[Int] = List(1, 2, 3, 4, 5)

scala> l.head
val res8: Int = 1

scala> l.tail
val res9: List[Int] = List(2, 3, 4, 5)

scala> l.tail.tail.tail.tail.tail
val res10: List[Int] = List()
```

El recorrido es siempre el mismo: avanzar por la cola y sacar la cabeza.
`l.tail.head` es el segundo, `l.tail.tail.head` el tercero, y así. Toda lista
bien formada termina en `Nil`, que el REPL imprime como `List()`.

La lista vacía no tiene cabeza ni cola, así que `head` y `tail` sobre ella
fallan.

## Por qué el cuarto elemento cuesta cuatro pasos

Scala deja escribir `l(3)`, pero eso no es indexación. Es exactamente
`l.tail.tail.tail.head`: tres colas y una cabeza. Para llegar a un elemento
hay que haber pasado por todos los anteriores, y el costo crece con la
posición.

El contraste está en un arreglo de C:

```c
#include "stdio.h"
#include "stdlib.h"

int main() {
  int n = 10;
  int *arr = (int *)malloc(n * sizeof(int));

  for (int i = 0; i < n; i++) {
    *(arr + i) = 10;
    printf("%p \n", arr + i);
  }
}
```

`*(arr + i) = 10` es lo mismo que `arr[i] = 10`. Un arreglo es un bloque
contiguo de memoria, y las direcciones que imprime el programa lo muestran:

```
0x556d8b9f1010
0x556d8b9f1014
0x556d8b9f1018
0x556d8b9f101c
0x556d8b9f1020
```

Suben de cuatro en cuatro, en hexadecimal, porque un `int` de 32 bits ocupa
cuatro bytes. Llegar a la posición `i` es calcular `arr + i`, y esa suma
cuesta lo mismo con diez elementos que con un millón: tiempo constante, O(1).

En la lista no hay dirección que calcular. Para llegar al elemento un millón
hay que recorrer los novecientos noventa y nueve mil novecientos noventa y
nueve anteriores, y el acceso es O(n).

A cambio, la lista crece y decrece cada vez que se reconstruye, mientras que
un arreglo en C tiene tamaño fijo. Un `vector` de C++ sí crece: por debajo
pide otro bloque y muda el contenido.

Por eso una lista se recorre con cabeza y cola en vez de pedirle una posición.

## Reconocimiento de patrones con listas

Como la lista solo se presenta de dos maneras, un `match` sobre ella tiene un
caso por cada una:

```scala
def sumar(lst: List[Int]): Int = lst match {
  case Nil     => 0
  case x :: xs => x + sumar(xs)
}
```

`x` captura la cabeza y `xs` la cola. Sobre `List(1, 2, 3)` las capturas van
así: primero `x = 1` y `xs = List(2, 3)`; después `x = 2` y `xs = List(3)`;
después `x = 3` y `xs = Nil`; y la siguiente llamada cae en el caso base.

Además de esos dos, hay patrones para formas concretas:

| Patrón | Qué captura |
|---|---|
| `Nil` | la lista vacía |
| `x :: Nil` | una lista de exactamente un elemento |
| `x :: y :: Nil` | una lista de exactamente dos |
| `x :: xs` | cualquier lista no vacía |

Cuando el valor capturado no se usa se escribe un guion bajo. `longitud` no
mira el elemento, solo lo cuenta:

```scala
def longitud[T](lst: List[T]): Int = lst match {
  case Nil     => 0
  case _ :: xs => 1 + longitud(xs)
}
```

### El orden de los casos decide cuál gana

Los patrones se leen de arriba hacia abajo, y varios pueden coincidir con la
misma lista. Este `match` está mal ordenado a propósito:

```scala
def f(l: List[Int]): Int = l match {
  case x :: xs       => 1
  case x :: Nil      => 2
  case x :: y :: Nil => 3
  case Nil           => 0
}
```

`f(List(1))` devuelve 1, no 2. La lista de un elemento también tiene la forma
`x :: xs`, con `xs` igual a `Nil`, y el primer caso la atrapa. El compilador
lo avisa:

```
warn: unreachable code
    case x :: Nil      => 2
```

Los patrones van del más específico al más general, empezando por `Nil`, y
`case _` queda de último si aparece.

### Cuándo sigue haciendo falta un `if`

El `match` reconoce la forma del dato, no compara valores. Para preguntar si
un elemento es igual a otro, el `if` sigue haciendo falta:

```scala
def contiene[T](lst: List[T], elem: T): Boolean = lst match {
  case Nil     => false
  case x :: xs =>
    if (x == elem) true
    else contiene(xs, elem)
}
```

Frente a la versión con `isEmpty`, `head` y `tail`, el `match` se lee mejor,
deja que el compilador avise si falta un caso y entrega cabeza y cola sin
llamar a nada.

## Lo que se escribió en vivo

### Sumar con recursión de cola

En el grupo de la mañana la suma salió con un acumulador, primero con las
primitivas y después con patrones:

```scala
object ListasEjemplo {

  def sumarRecursivo(l: List[Int]): Int = {
    @annotation.tailrec
    def aux(l: List[Int], acc: Int): Int = {
      if (l.isEmpty) acc
      else aux(l.tail, acc + l.head)
    }
    aux(l, 0)
  }

  def sumarPatrones(l: List[Int]): Int = {
    @annotation.tailrec
    def aux(l: List[Int], acc: Int): Int = {
      l match {
        case Nil     => acc
        case x :: xs => aux(xs, acc + x)
      }
    }
    aux(l, 0)
  }

  def main(arr: Array[String]): Unit = {
    val l = List(1, 2, 3, 4, 5)
    println(sumarRecursivo(l))
    println(sumarPatrones(l))
  }
}
```

Las dos imprimen 15. La segunda no llama a `head` ni a `tail`: el patrón ya
entregó las dos piezas.

### La suma genérica que no compila

En el grupo de la tarde la función arrancó como una suma sobre una lista de
cualquier tipo, con una variable de tipo `T`:

```scala
def sumar[T](l: List[T]): T = {
  @annotation.tailrec
  def aux(l: List[T], acc: T): T = {
    if (l.isEmpty) acc
    else aux(l.tail, acc + l.head)
  }
  aux(l, 0)
}
```

El compilador responde:

```
error: type mismatch;
 found   : T
 required: String
      else aux(l.tail, acc + l.head)
                             ^^^^^^
error: type mismatch;
 found   : Int(0)
 required: T
    aux(l, 0)
           ^
```

El `+` está sobrecargado: suma enteros, dobles y longs, y concatena cadenas.
Con un `T` que puede ser cualquier cosa, Scala no sabe cuál de esas
operaciones se pide, y se queda con la única que acepta cualquier valor a la
izquierda, la concatenación de cadenas. De ahí el `required: String`. El
segundo error viene del mismo lado: `0` es un `Int` y el acumulador tiene que
ser un `T`.

La salida fue cambiar la pregunta. Contar elementos no necesita sumarlos: el
acumulador y el resultado pasan a ser `Int`, y `T` queda solo en el tipo de la
lista:

```scala
object Listas {

  def longitud[T](l: List[T]): Int = {
    @annotation.tailrec
    def aux(l: List[T], acc: Int): Int = {
      if (l.isEmpty) acc
      else {
        aux(l.tail, acc + 1)
      }
    }
    aux(l, 0)
  }

  def longitudRec[T](l: List[T]): Int = {
    @annotation.tailrec
    def aux(l: List[T], acc: Int): Int = {
      l match {
        case Nil      => acc
        case _ :: xs  => aux(xs, 1 + acc)
      }
    }
    aux(l, 0)
  }

  def main(arr: Array[String]): Unit = {
    val l: List[Int] = List(1, 2, 3, 4, 5, 6, 7)
    println(longitud[Int](l))
    println(longitudRec[Int](l))
    println(longitudRec(List("Hola", "Mundo")))
    println(longitudRec(List(1L, 10L, 100L)))
  }
}
```

Imprime 7, 7, 2 y 3: la misma función cuenta listas de `Int`, de `String` y de
`Long`. Ahí está el trabajo de la variable de tipo. Si entra una lista de
enteros `T` vale `Int`; si entra una de cadenas, `String`.

## Funciones recursivas sobre listas

Cuatro funciones, una misma forma: un caso base y un caso recursivo que recibe
la cola.

```scala
def ultimo[T](lst: List[T]): T = lst match {
  case Nil      => throw new Error("ultimo de lista vacia")
  case x :: Nil => x
  case _ :: xs  => ultimo(xs)
}
```

Sobre `List(1, 2, 3, 4)` baja por `List(2, 3, 4)`, `List(3, 4)` y `List(4)`,
que coincide con `x :: Nil` y devuelve 4. Es O(n): hay que recorrer todos los
elementos. En un arreglo el último se obtiene directo.

```scala
def inicio[T](lst: List[T]): List[T] = lst match {
  case Nil      => throw new Error("inicio de lista vacia")
  case _ :: Nil => Nil
  case x :: xs  => x :: inicio(xs)
}
```

`inicio(List(1, 2, 3))` se desarma en `1 :: inicio(List(2, 3))`, luego
`1 :: 2 :: inicio(List(3))`, y esa última llamada devuelve `Nil` por ser una
lista de un solo elemento. Queda `List(1, 2)`.

```scala
def concat[T](xs: List[T], ys: List[T]): List[T] = xs match {
  case Nil     => ys
  case z :: zs => z :: concat(zs, ys)
}
```

Con `List(1, 2)` y `List(3, 4)`: `1 :: concat(List(2), List(3, 4))`, luego
`1 :: 2 :: concat(Nil, List(3, 4))`, y el caso base entrega la segunda lista
completa. Resultado `List(1, 2, 3, 4)`. Cuesta O(n) sobre la longitud de la
primera lista, que es la única que se recorre. El operador `++` hace lo mismo.

```scala
def reversa[T](lst: List[T]): List[T] = lst match {
  case Nil     => Nil
  case x :: xs => reversa(xs) ++ List(x)
}
```

La cola se invierte primero y la cabeza se pega al final. Sobre
`List(1, 2, 3)`:

```
reversa(List(1, 2, 3))
  = reversa(List(2, 3)) ++ List(1)
  = (reversa(List(3)) ++ List(2)) ++ List(1)
  = ((reversa(Nil) ++ List(3)) ++ List(2)) ++ List(1)
  = (List(3) ++ List(2)) ++ List(1)
  = List(3, 2) ++ List(1)
  = List(3, 2, 1)
```

Esta versión es cuadrática: cada uno de los n pasos ejecuta una concatenación
que cuesta O(n), y O(n) por O(n) da O(n²). La versión lineal lleva un
acumulador.

## Ordenamiento por inserción

Una lista de un solo elemento ya está ordenada. De ahí se insertan los demás,
cada uno en el sitio que le toca dentro de lo que ya quedó ordenado:

```
4,5,6,8,9,1,3,2      se parte del 4
4,5,6,8,9,1,3,2      5 va después del 4
4,5,6,8,9,1,3,2      6 va después del 5
4,5,6,8,9,1,3,2      8 y 9 ya están en su sitio
1,4,5,6,8,9,3,2      1 va al principio
1,3,4,5,6,8,9,2      3 va después del 1
1,2,3,4,5,6,8,9      2 va después del 1
```

Con recursión son dos funciones: `insertar` ubica un elemento en una lista
ordenada, e `iSort` ordena la cola y después inserta la cabeza:

```scala
def insertar(x: Int, xs: List[Int]): List[Int] = xs match {
  case Nil     => List(x)
  case y :: ys =>
    if (x <= y) x :: xs
    else y :: insertar(x, ys)
}

def iSort(xs: List[Int]): List[Int] = xs match {
  case Nil     => Nil
  case y :: ys => insertar(y, iSort(ys))
}
```

`insertar(4, List(2, 7, 10))` compara 4 con 2, que es menor, así que el 2 se
queda adelante y la búsqueda sigue en `List(7, 10)`. Ahí 4 sí es menor o igual
que 7, y se detiene:

```
insertar(4, List(2, 7, 10))
  = 2 :: insertar(4, List(7, 10))
  = 2 :: 4 :: List(7, 10)
  = List(2, 4, 7, 10)
```

El ordenamiento completo baja hasta la lista vacía y después inserta en el
camino de vuelta:

```
iSort(List(8, 4, 11, 2))
  = insertar(8, iSort(List(4, 11, 2)))
  = insertar(8, insertar(4, iSort(List(11, 2))))
  = insertar(8, insertar(4, insertar(11, iSort(List(2)))))
  = insertar(8, insertar(4, insertar(11, insertar(2, iSort(Nil)))))
  = insertar(8, insertar(4, insertar(11, insertar(2, Nil))))
  = insertar(8, insertar(4, insertar(11, List(2))))
  = insertar(8, insertar(4, List(2, 11)))
  = insertar(8, List(2, 4, 11))
  = List(2, 4, 8, 11)
```

El recorrido termina porque sacar cabeza y cola repetidamente llega siempre a
la lista vacía. El costo está entre O(n) y O(n²), según cuánto haya que
desplazar en cada inserción; el detalle es materia de Algoritmos I.

## Métodos predefinidos

La biblioteca ya trae varias de esas funciones:

| Método | Qué da sobre `List(10, 20, 30, 40, 50)` |
|---|---|
| `length` | `5` |
| `last` | `50` |
| `init` | `List(10, 20, 30, 40)` |
| `take(3)` | `List(10, 20, 30)` |
| `drop(2)` | `List(30, 40, 50)` |
| `splitAt(3)` | `(List(10, 20, 30), List(40, 50))` |

Y sobre `List(1, 2, 3)`:

| Método | Resultado |
|---|---|
| `++ List(4, 5)` | `List(1, 2, 3, 4, 5)` |
| `reverse` | `List(3, 2, 1)` |
| `updated(1, 99)` | `List(1, 99, 3)` |
| `indexOf(2)` | `1` |
| `indexOf(7)` | `-1` |
| `contains(3)` | `true` |

`updated` no modifica nada: devuelve una lista nueva con el cambio.

## Aplanar

Hay algoritmos que entregan listas de listas cuando se quiere una sola.
`flatten` las junta en un nivel:

```scala
scala> val l = List(List(1, 2, 3), List(2, 3), List(4, 5, 6))
val l: List[List[Int]] = List(List(1, 2, 3), List(2, 3), List(4, 5, 6))

scala> l.flatten
val res11: List[Int] = List(1, 2, 3, 2, 3, 4, 5, 6)
```

Si se mezclan listas con elementos sueltos, el tipo se va a `List[Any]` y
`flatten` no sabe qué hacer con los elementos que no son listas:

```scala
scala> List(List(1, 2), 3, List(4)).flatten
       error: No implicit view available from Any => scala.collection.IterableOnce[B].
```

Escrita a mano, la función separa la lista vacía, la cabeza que resulta ser
otra lista y la cabeza que es un valor suelto.

```scala
def aplanar(xs: List[Any]): List[Any] = xs match {
  case Nil                => Nil
  case (y: List[_]) :: ys => aplanar(y) ++ aplanar(ys)
  case y :: ys            => y :: aplanar(ys)
}
```

Sobre `List(List(1, 1), 2, List(3, List(5, 8)))` el recorrido va así: la
cabeza `List(1, 1)` se aplana y se concatena con el aplanado del resto;
después la cabeza es 2, que no es una lista y se pega al frente; y
`List(3, List(5, 8))` se vuelve a abrir, porque adentro hay otra lista.
Resultado: `List(1, 1, 2, 3, 5, 8)`.

## Ejercicios propuestos

Para escribir con recursión y patrones:

1. `duplicar`, que repita cada elemento: `duplicar(List(1, 2, 3))` da
   `List(1, 1, 2, 2, 3, 3)`.
2. `tomar`, sin usar `take`: `tomar(List(10, 20, 30, 40), 2)` da
   `List(10, 20)`.
3. `compactar`, que elimine repeticiones consecutivas:
   `compactar(List(1, 1, 2, 3, 3, 3, 2, 2))` da `List(1, 2, 3, 2)`.
4. `esPalindromo`, que verifique si la lista se lee igual en los dos sentidos.
   `esPalindromo(List(1, 2, 3, 2, 1))` da `true`.

## Lo que queda

La `reversa` cuadrática pide una versión lineal con acumulador, y es lo
primero que sigue. Después vienen las tuplas, el ordenamiento por mezcla y las
funciones de alto orden, `map` y `filter`, genéricas igual que la
`longitud[T]` de aquí.
