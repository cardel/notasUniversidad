Las abstracciones de datos no permite elevar el nivel conceptual al pensar los datos en su poder expresividad en lugar de pensar en sus detalles, ejemplo

$$
\frac{1}{6}
$$
Pero si queremos implementarlo

```scala
val num = 1
val dem = 6
```

Para hacer esto vamos a usar las clases en Scala, para esto vamos a definir

1. Constructor: Como vamos a construir el tipo de dato, en el caso de Racional recibo dos enteros y retorno un racional
2. Selectores: Campos de la clase, en el caso de Racional numer y xenom
3. Operaciones: Suma, Resta, Multulicación, etc
4. Comperación: Igualdad, MayorQue, etc


```scala
class Racional(x:Int, y:Int) {
	def numer = x
	def denom = y
}
```

El constructor de Racional recibe dos parametros (x e y) y tenemos dos selectores numer y denom

```scala
val x = new Racional(10,5)
val y = new Racional(33,66)
```

# Operacion de datos

Los datos podemos operarlos con funciones externas, por ejemplo

```scala
def suma(r1:Racional, r2:Racional):Racional = {
  new Racional( ...)
}


def resta(r1:Racional, r2:Racional):Racional = {
  new Racional( ...)
}


def division(r1:Racional, r2:Racional):Racional = {
  new Racional( ...)
}
```

¿Que problema hay? Que necesitamos muchas funciones para hacer todas la operaciones **esto no es eficiente**


La estrategia es hacer los métodos dentro de la clase y usar el parametro implicito **this** para referenciar al mismo objeto

```scala
class Racional(x:Int, y:Int) {
	def numer = x
	def denom = y
	
	def suma(r:Racional):Racional = {
		new Racional(this.numer...)
	}
	
	def resta(r:Racional):Racional = {
		new Racional
	}
	
	//Continua
	
	override def toString = this.numer + "/" + this.demon //Cuando imprimo el objeto veo num/den
}
```

this es un parametro implicito de los métodos que permite acceder a la mismo objeto

# Encapsulacioń

Por ejemplo si quiero simplificar los racionales

$$\frac{66}{42} = \frac{11}{7}$$

Puedo utilizar el algoritmo de euclides (Discretas I), puedo hacerlo directamente en la declaración de la clase Racional

```scala
class Racional(x:Int, y:Int) {

	private def mcd(a:Int, b:Int):Int = 
		if (b==0) a else mcd(b,a%b)
		
	val numer = x/mcd(x,y)
	val denom = y/mcd(x,y)
	

	
	def suma(r:Racional):Racional = {
		new Racional(this.numer...)
	}
	
	def resta(r:Racional):Racional = {
		new Racional
	}
	
	//Continua
	
	override def toString = this.numer + "/" + this.demon //Cuando imprimo el objeto veo num/den
}
```

El private es un control de acceso para controlar que el metodo mcd no sea accedido por fuera de la clase