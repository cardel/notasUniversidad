# Sesión 4: 05 de Marzo Funciones anónimas, currificación y abstracción

Función anónima

Es un valor que representa una función, es equivalente a tener un número, cadena de texto etc. La única forma de usarlo es invocandolo/llamadolo

```scala
(x:Int,y:Int) => x+y
//(Int,Int)=>Int (tipo)
```

---

Currificación

Convertir las funciones a un sólo parametro

```scala
def suma(a:Int,b:Int):Int = x+y
def sumaC(a:Int)(b:Int):Int = x+y
```

Ventajas

Una función puede ir adquiriendo los valores de sus parametros a medida que la ejecutamos, podemos pasar funciones con parametros parciales entre diferentes clases, las cuales pueden ir ligandolos. Un parametro se liga invocando la función, esta nos retorna una función que espera otro parametro.

```scala
sumaC(5)_ //Retorna una función que espera un parametro b
sumaC(5)(10) //15, ya que hemos ligado a y b
```

---

Abstracción de datos

- Clases
- Poliformismo (interesante el comportamiento al sobreescribir las operaciones aritmeticas (se conserva la prelación)
- Representación de objeto a través de sobreescribir toString

La programación funcional permite construir tipo de datos a alto nivel sin preocuparnos por las operaciones, por ejemplo un número complejo

```scala
class Complex(r:Double, i:Double) {
	val real = r
	val img = i
	def suma(C2:Complex):Complex = {
		new Complex(
			real + C2.real,
			img + C2.img
		)
	}

  override
	def toString():
		real + "+" + img + "j"
}
```

---

Operación binaria

Recibe dos parametros

- This: Instancia de clase
- Arg. Argumento de entrada

Estas operaciones se evaluan de IZQUIERDA a DERECHA; con algunas excepciones (sobreescribir operaciones aritméticas)

Sucede cuando tenemos funciones que recibe un sólo parametro (currificadas)

```scala
class X(a:Int,b:Int)
{
	def f(xi:X):X
		....
}

val x0 = new X(1,2)
x0.f(new X(3,2))
x0 f new X(3,2)

//Es una operación binaria
```