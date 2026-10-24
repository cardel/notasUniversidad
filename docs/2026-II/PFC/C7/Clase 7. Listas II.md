# Clase 7. Listas II

Jueves 22 de octubre de 2026.

Dos listas a la vez no caben en un `match` sobre una sola, y de ahí sale la
tupla.

Las diapositivas están en el Campus Virtual. El código que se escribió en vivo
quedó en
[`codigo/`](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/PFC/C7/codigo),
y los once ejercicios interactivos, en
[Ejercicios](../../../actividades/pfc/ordenamiento-y-alto-orden/index.md).

Referencia: Odersky, Spoon y Venners, *Programming in Scala*, 3.ª edición,
capítulo 16, Working with Lists.

## Tuplas

Una tupla agrupa valores separados por comas. Se escribe entre paréntesis, y el
tipo que devuelve el intérprete dice cuántos son y de qué tipo es cada uno.

```scala
scala> (1,2)
val res0: (Int, Int) = (1,2)

scala> (1,2,3)
val res1: (Int, Int, Int) = (1,2,3)

scala> val tu = (1,2,3,4)
val tu: (Int, Int, Int, Int) = (1,2,3,4)

scala> tu._1
val res3: Int = 1

scala> tu._4
val res6: Int = 4
```

A diferencia de la lista, la tupla tiene tamaño fijo, decidido al escribirla, y
puede mezclar tipos, mientras que la lista es homogénea. Tampoco es recursiva:
no hay cabeza ni cola, y a cada componente se llega por su posición con `_1`,
`_2` y así hasta `_22`, que es el límite del lenguaje.

La otra forma de llegar a los componentes es nombrarlos todos de una vez:

```scala
scala> val (a,b,c,d) = (1,2,3,4)
val a: Int = 1
val b: Int = 2
val c: Int = 3
val d: Int = 4
```

Es el mismo reconocimiento de patrones de las listas, aplicado a una tupla, y
quien venga de Python lo reconocerá: ahí se descompone igual.

## Mirar dos listas a la vez

La suma de dos vectores suma elemento a elemento: `List(1,2,3)` con
`List(4,5,6)` da `List(5,7,9)`. Con un `match` sobre la primera lista hay que
abrir otro `match` sobre la segunda dentro de cada caso, y el resultado son
dos niveles de anidamiento para una idea que no los necesita.

Al poner las dos listas en una tupla, los cuatro casos quedan al mismo nivel:

```scala
def sumarVec(u: List[Int], v: List[Int]): List[Int] =
  (u, v) match {
    case (Nil, Nil)         => Nil
    case (Nil, _)           => throw new Exception("Distinto tamanio")
    case (_, Nil)           => throw new Exception("Distinto tamanio")
    case (x :: xs, y :: ys) => (x + y) :: sumarVec(xs, ys)
  }
```

El primer caso es el que carga el argumento: si a las dos listas se les va
quitando la cabeza al mismo tiempo, llegar ambas a `Nil` en el mismo paso solo
puede pasar si tenían el mismo tamaño. Los dos casos del medio son el otro
lado de esa afirmación: una lista se acabó antes que la otra, y por eso lanzan
la excepción.

El `match` no necesita que la tupla esté en una variable. En clase se escribió
directamente sobre dos listas:

```scala
scala> (List(1,2,3), List(4,5,6)) match {
     |   case (Nil, Nil) => 0
     |   case (_, Nil) => throw new Exception("l1 es mas larga")
     |   case (Nil, _) => throw new Exception("l2 es mas larga")
     |   case (x::xs, y::ys) => x + y }
val res1: Int = 5
```

Cuatro más uno es cinco: el patrón del último caso partió las dos listas en
cabeza y cola a la vez, y la expresión solo usó las dos cabezas.

## Ordenamiento por mezcla

`msort` divide la lista en dos mitades, ordena cada una y mezcla las dos
mitades ordenadas. La mezcla es la parte con contenido, y es otra vez un
`match` sobre una tupla de dos listas:

```scala
def msort(xs: List[Int]): List[Int] = {
  def merge(l1: List[Int], l2: List[Int]): List[Int] =
    (l1, l2) match {
      case (Nil, _) => l2
      case (_, Nil) => l1
      case (m :: ms, n :: ns) =>
        if (m < n) m :: merge(ms, l2)
        else       n :: merge(l1, ns)
    }
  val n = xs.length / 2
  if (n == 0) xs
  else {
    val (izq, der) = xs.splitAt(n)
    merge(msort(izq), msort(der))
  }
}
```

`splitAt` devuelve una tupla con las dos partes, y
`val (izq, der) = xs.splitAt(n)` la descompone en el acto. El caso base pregunta
por `n == 0`, no por el tamaño de la lista: como `n` es `xs.length / 2` con
división entera, vale cero tanto para la lista vacía como para la de un
elemento, que son justamente las dos que ya están ordenadas.

La traza de `msort(List(3,9,5,1,2))`, con `n = 2`, `izq = List(3,9)` y
`der = List(5,1,2)`:

```
msort(List(3,9,5,1,2))
merge(msort(List(3,9)), msort(List(5,1,2)))
merge(merge(msort(List(3)), msort(List(9))), msort(List(5,1,2)))
merge(merge(List(3), List(9)), msort(List(5,1,2)))
merge(List(3,9), msort(List(5,1,2)))
merge(List(3,9), merge(msort(List(5)), msort(List(1,2))))
merge(List(3,9), merge(List(5), merge(List(1), List(2))))
merge(List(3,9), merge(List(5), List(1,2)))
merge(List(3,9), List(1,2,5))
List(1,2,3,5,9)
```

La recursión se resuelve de izquierda a derecha: la mitad izquierda se ordena
entera antes de empezar con la derecha. La mezcla final, paso a paso:

```
merge(List(3,9), List(1,2,5))
1 :: merge(List(3,9), List(2,5))
1 :: 2 :: merge(List(3,9), List(5))
1 :: 2 :: 3 :: merge(List(9), List(5))
1 :: 2 :: 3 :: 5 :: merge(List(9), Nil)
1 :: 2 :: 3 :: 5 :: List(9)
List(1,2,3,5,9)
```

Cada paso compara las dos cabezas, escribe la menor y vuelve a llamarse con el
resto de esa lista y la otra entera. El costo es `n log n`, y la demostración
se ve en Análisis y Diseño de Algoritmos.

Para ordenar listas de otro tipo no basta con escribir `msort[T]`: el operador
`<` no está definido para un `T` cualquiera. La salida es pasar la comparación
como parámetro, `(T, T) => Boolean`, y dejar que quien llame decida qué
significa menor.

## La suma genérica, otra vez

La suma sobre una lista de tipo `T` había quedado sin compilar en
[Listas I](../C6/Clase%206.%20Listas%20I.md#la-suma-generica-que-no-compila),
con dos errores: `found: T, required: String` en el `+`, y `found: Int(0),
required: T` en el acumulador. Es el mismo obstáculo del `<` del ordenamiento,
y tiene la misma salida.

En el grupo de la mañana la función suma dos listas elemento a elemento, y
devuelve otra lista:

```scala
import scala.annotation.tailrec

object Suma{

  def sumar[T](l1:List[T], l2:List[T])(f: (T,T)=>T):List[T] = {
    @tailrec
    def aux(l1:List[T], l2:List[T], acc:List[T]):List[T] = {
      (l1,l2) match {
        case (Nil, Nil) => acc
        case (_ , Nil ) => throw new Exception("Tamaño distinto")
        case (Nil, _ ) => throw new Exception("Tamaño distinto")
        case (x::xs, y::ys) => aux(xs, ys, f(x,y) :: acc)
      }
    }
    aux(l1,l2, Nil)
  }

  def main(arr:Array[String]):Unit = {
    val l1 = List(1,2,3,4)
    val l2 = List(2,4,6,8)
    println(sumar[Int](l1,l2)((x:Int, y:Int) => x + y))
    val l3 = List(1L, 2L, 3L, 4L)
    val l4 = List(10L, 20L, 30L, 40L)
    println(sumar[Long](l3,l4)((x:Long, y:Long) => x + y))
  }

}
```

Imprime `List(12, 9, 6, 3)` y `List(44, 33, 22, 11)`. El acumulador crece por
el frente, porque `f(x,y) :: acc` pone cada resultado nuevo delante de los
anteriores, así que la lista sale en orden contrario al de entrada.

En el grupo de la tarde la función combina las dos listas en un solo valor, y
entonces el acumulador inicial también tiene que entrar por parámetro, porque
`0` no es un `T`:

```scala
object Ejemplo {

  def sumar[T](l1:List[T],l2:List[T])(f:(T,T)=>T)(acc:T):T = {
    @scala.annotation.tailrec
    def aux(l1:List[T], l2:List[T], acc:T):T = {
         (l1,l2) match {
           case (Nil, Nil) => acc
           case (_, Nil) => throw new Exception("l1 es mas grande")
           case (Nil, _) => throw new Exception("l2 es mas grande")
           case (x::xs, y::ys) => aux(xs,ys,f(f(acc,x),y))
         }
    }

         aux(l1,l2,acc)
  }

  def main(arr:Array[String]):Unit = {
    val l1 = List(1,2,3)
    val l2 = List(4,5,6)
    println(sumar[Int](l1,l2)((x:Int,y:Int)=>x+y)(0))

    val l3 = List(1L, 10L, 20L)
    val l4 = List(100L, 20L, 30L)

    println(sumar[Long](l3,l4)((x:Long,y:Long)=>x+y)(0L))

    val l5 = List("Hola","Mundo", "Cruel", "Feo")
    val l6 = List("Quiero","Vivir","Sin","Trabajar")
    println(sumar[String](l5,l6)((x:String,y:String)=>x+y)(""))
  }

}
```

Imprime `21`, `181` y `HolaQuieroMundoVivirCruelSinFeoTrabajar`. Una sola
función sirve para tres tipos distintos, y la tercera salida muestra por qué el
compilador se negaba antes: el `+` de las cadenas concatena, el de los enteros
suma y el de los `Long` suma otros números. Son operaciones distintas con el
mismo nombre, y con un `T` sin más información Scala no puede elegir una.

El `f(f(acc,x),y)` del último caso suma tres valores componiendo dos veces una
función que solo sabe sumar dos. Vale porque la suma es asociativa.

Los parámetros van en listas separadas, `(l1,l2)(f)(acc)`. Es currificación,
la misma de las funciones de alto orden.

## map

Aplica una función a cada elemento y devuelve la lista de los resultados.

```scala
scala> List(1,2,3).map(x => x*x)
val res0: List[Int] = List(1, 4, 9)

scala> List(1,2,3).map(x => x*x).map(j => j+1)
val res1: List[Int] = List(2, 5, 10)

scala> List(1,2,3).map(x => x*x).map(j => "h"*j)
val res2: List[String] = List(h, hhhh, hhhhhhhhh)
```

La tercera línea es la que vale la pena mirar: entró una `List[Int]` y salió
una `List[String]`. `map` puede cambiar el tipo de la lista, porque el tipo de
salida lo decide la función que se le pasa.

## filter y su familia

Un predicado es una función que devuelve un booleano. `filter` recorre la lista
entera y conserva los elementos que lo cumplen.

```scala
scala> val l = List(1,2,3,4,5,6)
val l: List[Int] = List(1, 2, 3, 4, 5, 6)

scala> l.filter(x => x%2 != 0)
val res0: List[Int] = List(1, 3, 5)

scala> l.filterNot(x => x%2 != 0)
val res2: List[Int] = List(2, 4, 6)
```

`takeWhile` se parece, pero se detiene en el primer elemento que no cumple y
no mira lo que sigue:

```scala
scala> l.takeWhile(x => x%2 != 0)
val res4: List[Int] = List(1)

scala> l.takeWhile(x => x < 3)
val res6: List[Int] = List(1, 2)

scala> l.dropWhile(x => x < 3)
val res7: List[Int] = List(3, 4, 5, 6)

scala> l.span(x => x < 3)
val res8: (List[Int], List[Int]) = (List(1, 2),List(3, 4, 5, 6))
```

La diferencia se ve mejor con la lista que se probó en el grupo de la tarde,
donde el predicado vuelve a cumplirse después de fallar:

```scala
scala> val l = List(1,2,3,4,5,0,1,2)
val l: List[Int] = List(1, 2, 3, 4, 5, 0, 1, 2)

scala> l.filter(x => x < 3)
val res8: List[Int] = List(1, 2, 0, 1, 2)

scala> l.takeWhile(x => x < 3)
val res10: List[Int] = List(1, 2)

scala> l.dropWhile(x => x < 3)
val res11: List[Int] = List(3, 4, 5, 0, 1, 2)
```

`filter` encuentra los cinco elementos menores que tres repartidos por toda la
lista. `takeWhile` se detiene en el 3 y entrega dos, y `dropWhile` devuelve
exactamente lo que `takeWhile` dejó.

`span` hace las dos cosas en una sola pasada y devuelve la tupla con los dos
pedazos. `partition` es su pariente sin corte: devuelve los que cumplen y los
que no, tomados de toda la lista.

### empaquetar y codificar

Con `span` se agrupan los iguales consecutivos. El predicado compara contra la
cabeza, de modo que el primer pedazo es el grupo y el segundo es lo que falta
por agrupar:

```scala
def empaquetar[T](xs: List[T]): List[List[T]] =
  xs match {
    case Nil => Nil
    case x :: _ =>
      val (grupo, resto) = xs.span(y => y == x)
      grupo :: empaquetar(resto)
  }
```

Sobre `List("a","a","a","b","b","c","c","a","a")` el primer `span` devuelve
`(List(a,a,a), List(b,b,c,c,a,a))`, y la recursión sigue con el resto hasta
`Nil`. El resultado es
`List(List(a,a,a), List(b,b), List(c,c), List(a,a))`.

Contar cuántos hay de cada grupo es un `map` sobre una lista de listas, donde
cada elemento es una lista y por eso tiene `head` y `length`:

```scala
def codificar[T](xs: List[T]): List[(T, Int)] =
  empaquetar(xs).map(g => (g.head, g.length))
```

Devuelve `List((a,3), (b,2), (c,2), (a,2))`.

## Reducir y plegar

Reducir es combinar todos los elementos en un solo valor con un operador de
dos argumentos. `reduceLeft` empieza por los dos primeros y arrastra el
resultado hacia la derecha; `reduceRight` empieza por los dos últimos y
arrastra hacia la izquierda.

```scala
scala> List(1,2,3,4).reduceLeft((x,y) => x - y)
val res0: Int = -8

scala> List(1,2,3,4).reduceRight((x,y) => x - y)
val res1: Int = -2
```

El primero calcula `((1-2)-3)-4` y el segundo `1-(2-(3-4))`. La diferencia
aparece porque la resta no es asociativa. Con la suma o el producto los dos
lados coinciden y la elección deja de importar para el resultado, aunque
siga importando para el costo.

`(_ - _)` es la forma corta de `(x, y) => x - y`, con un guion bajo por cada
parámetro en el orden en que aparecen.

La limitación de `reduce` es la lista vacía:

```scala
scala> List[Int]().reduceLeft((x,y) => x + y)
java.lang.UnsupportedOperationException: empty.reduceLeft
```

Toma el primer elemento como valor inicial, y si no hay elementos no hay de
dónde empezar. `fold` recibe ese valor inicial por parámetro, y por eso
responde sobre cualquier lista:

```scala
scala> List[Int]().foldLeft(0)((x,y) => x + y)
val res1: Int = 0

scala> List(1,2,3,4).foldLeft(0)((x,y) => x + y)
val res2: Int = 10
```

`foldLeft` se escribe con recursión de cola y `foldRight` con recursión
lineal, que apila un marco por elemento. Entre dos resultados iguales, esa es
la razón para preferir `foldLeft`.

### Cuándo manda la asociatividad del operador

El operador `::` recibe un elemento a la izquierda y una lista a la derecha, y
asocia por la derecha: `1 :: 2 :: Nil` es `1 :: (2 :: Nil)`. Agrupado al otro
lado, `(1 :: 2) :: Nil` no tiene sentido, porque `2` no es una lista.

Eso decide cuál de los dos pliegues sirve para concatenar:

```scala
scala> List(1,2).foldRight(List(3,4))((x, acc) => x :: acc)
val res0: List[Int] = List(1, 2, 3, 4)
```

La segunda lista entra como valor inicial y cada elemento de la primera se le
pone delante: `1 :: (2 :: List(3,4))`.

Invertir con `foldRight` no sale:

```scala
scala> List(1,2,3,4).foldRight(List[Int]())((x, acc) => x :: acc)
val res1: List[Int] = List(1, 2, 3, 4)
```

Devuelve la misma lista, y tiene que ser así: reconstruye `1 :: 2 :: 3 :: 4 ::
Nil`, que es la lista original escrita con sus constructores. Para invertir
hay que empezar por el otro extremo, y ese es `foldLeft`:

```scala
scala> List(1,2,3,4).foldLeft(List[Int]())((acc, x) => x :: acc)
val res2: List[Int] = List(4, 3, 2, 1)
```

El acumulador arranca vacío y cada elemento se pone al frente de lo que ya se
había acumulado: `List(1)`, `List(2,1)`, `List(3,2,1)`, `List(4,3,2,1)`. Es el
mismo efecto que dejaba la suma genérica de la mañana con su acumulador.

El tipo del acumulador hay que escribirlo. Con `List()` a secas el compilador
lo toma como `List[Nothing]` y la operación no cuadra:

```
error: type mismatch;
 found   : rassoc$1.type (with underlying type Int)
 required: Nothing
  List(1,2,3,4).foldLeft(List())((acc, x) => x :: acc)
                                                   ^
```

## Ejercicios propuestos

1. `cuantos`, que cuente cuántos elementos cumplen un predicado:
   `cuantos(List(1,2,3,4,5,6), (x: Int) => x % 2 == 0)` da `3`.
2. `promedio` de una lista de enteros con un solo `foldLeft`, acumulando la
   suma y la cantidad en una tupla.
3. `maximo` con `reduceLeft`, y decidir qué hacer con la lista vacía.
4. `descomprimir`, que deshaga lo que hizo `codificar`:
   `descomprimir(List(("a",3), ("b",2)))` da
   `List(a, a, a, b, b)`.
5. Escribir la versión de `msort` que recibe la comparación por parámetro y
   usarla para ordenar `List(3,9,5,1,2)` de mayor a menor y
   `List("pera","uva","mango")` alfabéticamente, sin tocar `merge` entre una
   llamada y otra.

## Lo que queda

Las expresiones `for`, los mapas y las secuencias perezosas son las
herramientas del
[Taller 3](https://github.com/EjerciciosClasesCardel/pfc-taller-3-registro-sismico),
publicado y con cierre el jueves 12 de noviembre. Después va la presentación
del proyecto final.
