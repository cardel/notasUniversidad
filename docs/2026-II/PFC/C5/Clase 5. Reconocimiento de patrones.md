# Clase 5. Reconocimiento de patrones

Jueves 8 de octubre de 2026.

Un conjunto de enteros se puede guardar como un árbol binario de búsqueda, y
ese árbol tiene exactamente dos formas: o está vacío, o es un elemento con dos
hijos. La sesión parte de ahí y recorre dos maneras de escribir esa
distinción, la jerarquía de clases y el `match` sobre la forma, hasta llegar
a los tipos sellados, donde el compilador avisa si falta un caso.

Las diapositivas están en el Campus Virtual. Los diez ejercicios interactivos
de la sesión están en
[Ejercicios](../../../actividades/pfc/arboles-algebraicos-y-patrones/index.md).

Referencia: Odersky, Spoon y Venners, *Programming in Scala*, 3.ª edición,
capítulos 10, 12 y 15.

## Un conjunto como árbol

La especificación es corta: `insertar` devuelve un conjunto con el elemento, y
`pertenece` dice si está. La clase que la declara no se puede instanciar,
porque no hay un «conjunto genérico», así que es abstracta:

```scala
abstract class ConjEnt {
  def insertar(x: Int): ConjEnt
  def pertenece(x: Int): Boolean
}
```

Las dos formas la implementan. El vacío responde que no a todo:

```
Vacio.pertenece(x)   false, para cualquier x
```

y no por descuido: sobre el conjunto vacío, *x pertenece* es falso para todo
`x`, porque no hay elementos. El no vacío compara contra su elemento y baja al
hijo que corresponde; si el elemento ya está, `insertar` devuelve el mismo
conjunto, porque un conjunto no repite.

Nada se modifica: cada inserción construye un árbol nuevo.

## Despacho dinámico

`conj.pertenece(7)` no dice qué código corre. Lo decide el objeto que recibe la
llamada: si es un vacío, la versión que devuelve `false`; si es un nodo, la que
compara y baja. Eso es polimorfismo, y la forma concreta se llama despacho
dinámico: el método se resuelve según el objeto, no según el tipo escrito.

Sobre un nodo que guarda el 7, `pertenece(7)` pregunta dos veces: ¿7 es menor
que 7? No. ¿Es mayor? Tampoco. Entonces es él, y responde `true`.

## Implementar, sobreescribir y el objeto único

Una clase hija **implementa** lo que la madre dejó sin cuerpo, y
**sobreescribe**, con `override`, lo que la madre ya traía escrito.

El vacío no guarda nada: no tiene campos y todas sus instancias serían
idénticas. Para eso está `object`:

```scala
object Vacio extends ConjEnt
```

Hay una sola instancia en todo el programa y se usa sin `new`. Es el mismo
mecanismo del `main`, que es el punto de entrada y por eso no se instancia.

Toda clase que no declara de quién hereda, hereda de `Object`, la raíz. De ahí
viene `equals`, y de ahí viene un tropiezo conocido: dos objetos `Persona` con
el mismo nombre y la misma edad son distintos para `==` mientras nadie
sobreescriba `equals`, porque lo que se compara es la referencia y no los
campos.

## Traits

Scala tiene herencia simple: una clase extiende una sola. Para compartir
comportamiento que cruza jerarquías están los traits, que son lo que en Java
son las interfaces, con una diferencia: un trait sí puede traer métodos ya
implementados.

```scala
trait Plano { def alto: Int; def ancho: Int; def area: Int = alto * ancho }
trait Movible { def mover(dx: Int, dy: Int): Rectangulo }

class Rectangulo(...) extends Plano with Movible
```

```
Rectangulo(en 0,0; 3x4)
12
Rectangulo(en 10,5; 3x4)
```

El `area` del trait lo hereda el rectángulo sin escribirlo, y `mover` devuelve
un rectángulo nuevo.

**Por qué no hay herencia múltiple.** Con tres padres que a su vez tienen tres
padres, buscar un método se vuelve una explosión; y si dos padres definen
`mover`, no hay forma de decidir. Python resuelve tomando el primero en el
orden de herencia, y aun así el problema sigue ahí.

**Cuándo cada uno.** Clase abstracta cuando hay una jerarquía clara y hace falta
un constructor con parámetros. Trait para comportamiento transversal, que se
mezcla en clases que no comparten ancestro.

## Reconocimiento de patrones

Hasta aquí, preguntar por la forma del dato obliga a algo así:

```scala
if (conj.isInstanceOf[NoVacio]) {
  val elem = conj.asInstanceOf[NoVacio].elem
  ...
}
```

El `match` hace las dos cosas de una vez: distingue la forma y saca los campos.

```scala
def listaEnteros(conj: ConjEnt): List[Int] = conj match {
  case Vacio()                 => List()
  case NoVacio(elem, izq, der) => listaEnteros(izq) ++ List(elem) ++ listaEnteros(der)
}
```

`case NoVacio(elem, izq, der)` no compara contra nada: nombra las tres partes
para usarlas en el cuerpo. Y `++` concatena listas.

Sobre el árbol con 10 en la raíz, 8 a la izquierda (con 6 y 9) y 15 a la
derecha (con 13 y 16):

```
List(6, 8, 9, 10, 13, 15, 16)
```

Sale ordenado porque el recorrido va izquierda, raíz, derecha: eso es el
recorrido **en orden**. Poniendo `List(elem)` al principio queda **preorden**;
al final, **postorden**.

El `_` cubre lo que no casó, como el `default` de un `switch`. Los patrones que
aparecen en el curso son constantes, valores con su tipo, tuplas, la forma
`cabeza :: cola` de una lista, y el comodín.

## Listas

Una lista es una colección de elementos del mismo tipo, y se construye de dos
maneras que dan lo mismo:

```
scala> List(1, 2, 3)
val res0: List[Int] = List(1, 2, 3)

scala> 1 :: 2 :: 3 :: Nil
val res1: List[Int] = List(1, 2, 3)
```

`Nil` es la lista vacía y cierra toda construcción con `::`. De una lista se
piden dos cosas: `head`, el primer elemento, y `tail`, el resto.

```
scala> val l = List(1, 2, 3, 4)
scala> l.head        1
scala> l.tail        List(2, 3, 4)
scala> l.tail.head   2
scala> l.tail.tail.tail.tail   List()
```

El segundo elemento es `l.tail.head` y el tercero `l.tail.tail.head`. Scala
permite además `l(2)`, que devuelve el tercero, y **en este curso no se usa**:
indexar es recorrer con un índice, que es la forma imperativa. Una lista se
recorre con `head` y `tail`.

### Sumar una lista, tres veces

Recursión lineal:

```scala
def sumarLista(l: List[Int]): Int =
  if (l.isEmpty) 0 else l.head + sumarLista(l.tail)
```

Recursión de cola, con acumulador y `@tailrec`:

```scala
def sumarLista(l: List[Int]): Int = {
  @tailrec
  def auxiliar(l: List[Int], acc: Int): Int =
    if (l.isEmpty) acc else auxiliar(l.tail, acc + l.head)
  auxiliar(l, 0)
}
```

Y con `match`, que es la misma idea escrita sobre la forma:

```scala
def sumarLista(l: List[Int]): Int = l match {
  case Nil     => 0
  case x :: xs => x + sumarLista(xs)
}
```

Las tres dan 6 sobre `List(1, 2, 3)`. El caso base es siempre la lista vacía, y
se llega a ella aplicando `tail` las veces que haga falta.

## Tipos sellados y case classes

Un árbol de expresiones aritméticas se puede intentar con un solo tipo que
cargue banderas:

```scala
def esNumero: Boolean
def esSuma: Boolean
def esProducto: Boolean
def valor: Int
def opIzq: Expr
def opDer: Expr
```

y entonces `Numero` responde `true` a la primera, `false` a las otras dos, y
lanza un error si alguien le pide operandos. Funciona, y agregar la división
obliga a tocar todas las clases para añadir `esDiv`.

La alternativa declara las formas y nada más:

```scala
sealed trait Expr
case class Numero(valor: Int) extends Expr
case class Suma(e1: Expr, e2: Expr) extends Expr
case class Prod(e1: Expr, e2: Expr) extends Expr
```

`case class` da el constructor sin `new`, la comparación por campos y el patrón
para el `match`. `sealed` cierra la jerarquía: todas las formas están en este
archivo, así que **el compilador avisa cuando un `match` deja un caso por
fuera**. Esa advertencia es la que no existe con las banderas booleanas.

Las operaciones quedan afuera, cada una un `match`:

```scala
def eval(e: Expr): Int = e match {
  case Numero(n)   => n
  case Suma(a, b)  => eval(a) + eval(b)
  case Prod(a, b)  => eval(a) * eval(b)
}
```

```
mostrar(Suma(Numero(3), Prod(Numero(2), Numero(5))))   3 + 2 * 5
eval(...)                                              13
eval(Div(Suma(Numero(10), Numero(2)), Resta(Numero(6), Numero(3))))   4
mostrarConParentesis(Prod(Suma(Numero(1), Numero(2)), Numero(4)))   (1 + 2) * 4
```

El 13 sale de evaluar primero el producto, 10, y sumarle 3. Y los paréntesis de
la última línea no están en el dato: los pone `mostrarConParentesis` al bajar
por cada operación compuesta.

## El ejercicio de la sesión

Un robot en una cuadrícula, con el modelo de datos ya dado: `Direccion` con las
cuatro, `Orden` con `Avanzar(n)`, `Girar(sentido)`, `Repetir(n, orden)` y
`Secuencia(ordenes)`, y un `Estado(x, y, direccion)` que arranca en el origen
mirando al norte.

```
ejecutar(inicial, Avanzar(3))                             (0, 3) norte
Secuencia(Avanzar(2), Girar(Derecha), Avanzar(4))         (4, 2) este
Repetir(4, Secuencia(Avanzar(1), Girar(Derecha)))         vuelve al origen
Avanzar(-2)                                               (0, -2) norte
Repetir(0, Avanzar(5))                                    no se mueve
```

Después, dos funciones que se escriben con `match` sobre la orden:
`cuentaBasicas`, que da 1 para una orden básica y suma las de adentro, de modo
que el cuadrado da 8; y `profundidad`, que da 1 para una básica y 1 más el
máximo de lo que contenga: `Avanzar(3)` es 1, una secuencia de básicas es 2, y el
cuadrado, 3.

## Lo que queda

Las listas apenas se abrieron aquí: el recorrido con `head` y `tail` y el
patrón `x :: xs`. Lo que sigue es construirlas y operarlas, insertando,
aplanando y agrupando en corridas, y después las tuplas, el ordenamiento por
mezcla y las
funciones de alto orden sobre listas.
