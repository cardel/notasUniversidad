# 1. Conceptos abstracción de datos

### Pregunta

¿Que es una clase abstracta?

¿Que es un trait?

¿Como se incluyen?

Despacho dinámico de métodos

### Notes

Es una clase donde NO se definen métodos ni campos

No se puede instanciar, puede ser hija de otras clases

Definimos el QUE y no el COMO

```scala
abstract class Nombre {
	def a ...
	def b ...
	def metodo(...)
}
```

Es analogo a una interfaz en Java

Es una plantilla que NO hereda de otras clases

No se puede instanciar directamente

Puede tener implementación o no tenerla

```scala
trait Nombre {
	def a
	def b = 5
	def metodo1()
	def metodo2() .... bla bla bla...
}
```

```scala
class A extends B with C with D
....
//Recordar definir lo que no está implementado
/*
B puede ser clase o trait
 C, D deben ser trait
*/
```

Se ejecuta un método, pero en tiempo de ejecución se determina la clase sobre la cual va ser ejecutado

```scala
abstract class B {
	def metodo() ...
}
class A extends B {
	def metodo() ... this.?
}
class C extends B {
	def metodo() ... this.?
}

object Main {

	def main(args:Array[String]) {
		val x = new A()
		x.metodo() //Puede psar que se ejecute en A o ejecute n C
	}
}

```