# Sesión 6: Reconocimiento de patrones

Patrones por clases

Nos permite declarar directamente las clases y sus clases hijas sin tener que definirlas en DETALLE

Podemos declarar un trait o una clase abstracta y extenderla

```scala
trait x
case class y(a:Int) extends x
case class z(b:Int) extends x

object y {
	def apply(a:Int) new y(a)
}
object z {
	def apply(b:Int) new z(b)
}
```

---

Reconocimiento de patrones

Lo hacemos con match

```scala
abstract class Empleado
case class Ejecutivo(n:Int)
case class Operativo(s:String)
case class Externo(t:Int,f:Int)

//Reconocer un objetivo
val obj = new ...
obj match {
	case Ejecutivo(10) =>
	case Ejecutivo(d) => ...
	case Operativo(s) => ...
	case Externo(t,f) => 
	case _  : =>
}
```

---

Listas

Una lista es una colección de elementos del MISMO TIPO

En scala y los lenguajes funciones (racket) las listas son INMUTABLES y RECURSIVAS

```scala
val l = List(1,2,3)
val s = 1::2::3::Nil

print(l.head) // 1
print(l.tail) // List(2,3)
print(l.tail.head) // 2
print(l.tail.tail) // List(3)
print(l.tail.tail.head) // 3
print(l.tail.tail.tail) // Nil 
```

---

Trabajar con listas y patrones

Las listas se pueden capturar de diferentes formas

```scala
lst match {
	case Nil => ..
	case List() => ...
	case h::t => h cabeza, t cola
	case h::t => h match {
		case Nil => ..
		case m::t => Lista
		case m:Int::t => Prim nt
		case t:Int => Entero
		case t:String => ....
		case 1::t => lista con 1 inicial
	}

}
```