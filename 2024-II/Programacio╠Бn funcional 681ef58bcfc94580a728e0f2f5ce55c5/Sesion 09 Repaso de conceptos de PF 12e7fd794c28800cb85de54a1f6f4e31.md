# Sesion 09: Repaso de conceptos de PF

# Introducción a la programación funcional

---

¿Que es la programación funcional?

- Es un paradigma de programación
- Las variables son inmutable
- Se trabaja bajo el concepto de entrada y salida
- Las funciones son consideradas valores

---

Tipos de evaluación

- Valor: Se calculan los valores antes de invocar la función se declaran con val
- Nombre: Se calculan los valores únicamente cuando se requieren con def

```scala
def a(a:Int, b=>Int) ...
```

---

Bloques

- Se ejecutan secuencialmente, pero retorna el último valor

```scala
{
	1+2
	2+3
	3+4
	5+6
}

//Este bloque va a retorna 11
```

---

Diseño de programas en PF

- Se agrupan las funciones con entradas comunes (que se pueden obviar) dentro un alcance lexico

```scala
def f(x:Int) = {
	def g(y:Int) = x+y
	def h(x:Int, z:Int) = x+z
  g(x) + h(x+2,x)
}
f(10)

//20 + 22 = 42

```

- Se prefiere currificar las funciones

---

Currificación

- Diseño funcional buscando que las funciones sólo reciban un argumento
- Es especialmente util para la abstracción funcional (Racional) para expresar operaciones BINARIAS

```scala
def suma(a:Int, b:Int):Int = a+b

def sumaC(a:Int)(b:Int):Int = a+b

suma(1,2)
sumaC(1)(2
```

---

## Recursión

Recursión lineal

Cuando una función se llama a sí misma, los llamados se van apilando en la pila

```scala
def factorial(n:Int):Int = {
	if (n==0) 1
	else n*factorial(n-1)
}

/*
factorial(5)
5*factorial(4) //Pila
4*factorial(3) //Pila
...
1*factorial(0) //Pila
```

---

Recursión de cola / Tail recursion

- Solo se almacena un llamado a la pila
- Se usan acumuladores para tener los resultados parciales
- NO TODOS LOS LENGUAJES optimizan la recursión
- Es equivalente a tener un ciclo ITERATIVO

```scala
@tailrec
def factorial(n:Int, acc:Int=1) {
	if (n == 0) acc
	else factorial(n-1, n*acc)
}
```

---

Recursión de árbol

Ya involucra dos o más llamados recursivos, no es facil de convertir en recursión de cola

```scala
def fib(n:Int):Int = {
	if (n <= 1) n
	else fib(n-1)+fib(n-2)

}
```

---

# Funciones de alto orden

¿Que son?

Son funciones que reciben o retornan funciones

```scala
def f(g:Int=>Int, h:Int):Int = {
	g(h)
}

def x(a:Int):Int=>Int = {
	...
}

x(3) //Funcion
x(3)(10) //Int
```

---

Funciones anonimas

Funciones que se declaran directamente valores

```scala
(x:Int) => x+2
f(w:Int=>w+2, 5)
```

# Abstracción de datos

¿Que es?

Nos permite trabajar datos complejos sin preocuparnos como funcionan internamente

Ejemplo de racional

```scala
Racional(10,2) // 10/2 5/1
Racional(10,0) // Error, assert
Racional(10,-3) // Error, require

println(Racional(8,3)) // 8/3
/**
Se modifica 
override
def toString():

Es un método hereado desde Any (object) para representar los objetos
**/
```

---

Operaciones binarias

Importancia de la currificación

¿Porque funciona?

```scala
val a = new Racional(4,3)
val b = new Racional(2,5)

a.suma(b)
a.+(b)

a + b
a suma b
```

```scala
new Racional(78,2) ....
....
this
.....
```

# Colecciones

## Listas

¿Que son las listas?

Son agrupaciones de elementos del mismo tipo y son inmutables

Son naturalmente recursivas

- Caso base: Lista vacia: empty
- Caso recusivo: Cabeza: Elemento, Cola. Lista

```scala
val l = List(1,2,3)
l.head //1
l.tail //List(2,3)
l.tail.head

l.splitAt(n) // 0..n-1, n ... final
l.take(n) //retorna los primeros n elemento
l.drop(n) //elimina los primeros n elemento
```

## Tuplas

¿Que son?

- Son agrupaciones de elementos indexados desde 1 tambien son inmutables

```scala
val b = (1,2,3)
b._1
b._2
b._3
```

## Rangos

¿Que son?

Son secuencias de valores enteros

```scala
//Inclusivo
a to b
//Exclusivo
a until b
// Cambiamos el incremeto
a to b by c
```

## Arreglos

¿Que son? ¿COmo se diferencian de los demas?

Son reservas de espacio en memoria continuos, no pueden crecer dinámicamente, pero son mutables

# Reconocimiento de patrones

¿Que podemos reconocer?

- Clases
- Colecciones

```scala
trait Conjunto() ...
class ConjuntoV() extends Conjunto
class ConjuntoNV() extends Conjunto

trait Conjunto()
case class ConjuntoV() extends Conjunto
case class ConjuntoNV() extends Conjunto
```

Reconociendo case classes

```scala
elm match {
	case ConjuntoV() => ...
	case COnjuntoNV(..) => ...
	case _ => ....
}
```

Reconocimiento colecciones

```scala
em match {
	case x::xs => ...
	case List() => ..
	case 1::xs => ...
}
```

```scala
(a,b) match {
	case (x::xs, y::ys) => ...
	case (List(), y::ys) => ....
}
```

---

Funciones de alto orden

- map: Aplica una función a una colección, por ejemplo, elevar al cuadrado
- filter: Retorna los elementos que cumplen una condición (función que ingresa)
- reduceLeft: Retorna un valor al aplicar una operacion a una coleccion, no se aceptan colecciones vacia primero con segundo, luego tercero y así
- reduceRight: Lo mismo, pero ultimo con penultimo, luego con antepenultimo, …
- foldLeft Reduce con acumulador