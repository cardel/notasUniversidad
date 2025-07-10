# Sesión 05: Extendiendo la abstracción

Restricciones a la clases

Para precondiciones (a la hora de instanciar)

```scala
class pepito(x:Int,y:Int){
	require(x>0,"x debe ser mayor que 0")
}
```

En caso de que no se cumpla, se lanza una excepción

Para poscondiciones (a la hora ejecutar)

```scala
assert(...)

```

La condición que está en assert debe ser TRUE de lo contrario el programa lanza una excepción, utilizamos para las pruebas de software

---

Herencia

Una clase puede tomar atributos y metodos de otra clase a través de la herencia

```scala
class a {..}
class b extends a
```

La clase b toma los campos y metodos de la clase a

---

Clases abstractas

La clases abtractas permiten definir los atributos y métodos de las clases hijas, pero estas DEBEN IMPLEMENTARLOS

```scala
abstract class pepito {
	def a()
	def b()
}

class luisito(x:Int) extends pepito {
	def a() ...
	def b() ...
}
```

Una clase abstracta permite definir que métodos y que campos van a tener las clases hijas, sin embargo estas deben implementarlos, una clase abstracta NO SE PUEDE INSTANCIAR DIRECTAMENTE

```scala
abstract class a{}
class b extends a
class c extends a

val objA = new b()
val objB = new c()
```

objA y objB son de tipo a, pero su implementación es diferente, esto es POLIFORMISMO, un objeto tipo a tiene dos comportamiento, uno dado por b y otro dado por c

---

Traits

Son similares a las interfaces de java, no permiten heredar a otras clases, no se puede instanciar

```scala
trait Nombre {
	def a
	def b
	def c = a+b
	def metodo(a:Int) ...	
}
```

Una clase sólo puede heredar de UNA y SOLA UNA; pero puede extender de uno o más traits

```scala
class A extends X with T1 with T2 {
}
```

---

Despacho dinámico de métodos

Un método de un objeto dado puede tener diferente comportamiento DEPENDIENDO DE LA IMPLEMENTACION que se esté usando..

```scala
abstract class Animal {
	def sonido() = "grrr"
}
class Gato extends Animal {
	override
	def sonido() = "miau"
}

class Leon extends Animal 
{
}

val a1:Animal = new Gato()
print(a1.sonido()) //miau
val a2:Animal = new Leon()
print(a2.sonido()) // grrr
```