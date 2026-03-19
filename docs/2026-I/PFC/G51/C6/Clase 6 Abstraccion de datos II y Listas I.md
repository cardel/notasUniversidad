
# Como vamos

1. Abstracción de datos: Es una técnica que nos permite representar diferentes conjuntos usando estrategias de programacion, en este caso PF y P O.O
2. Racional $x \in \mathbb{Z} \wedge y \in \wedge{Z} \wedge y  !=  0, \frac{x}{y} \in \mathbb{Q}$, racional tiene dos números, TAD (Tipo abstracto dato) que permite representar los número racionales
3. Hablamos la O.O orientada a objetos ofrece la encapsulación: podemos controlar como y de que forma se acceden los datos dentro una clase (private, public, protected)
4. El **this** o ligadura dinámica es aquella que se crea cuando instanciamos una clase, esto permite saber cómo se instancio y su estado actual, esto es clave en la programación O.O
5. Requiere establece una precondición de tal forma la clase no se instancia si esta no se cumple, assert permite instaciar pero falla si no se cumple
6. Currificación:hacer métodos que solo acepten un argumento, hace que podamos representarlos en notación infija (binaria), dado que estos métodos tienen un segundo argumento implicito que es el **this** a la referencia a la misma clase
```scala
class ClaseA(arg:Tipo) {

	def metodo(argM:Tipoa):TipoB = {
		...
	}
}

val obj = new ClaseA(...)
obj.metodo(arg)
obj metodo arg
```
Es como si este fuera una función externa
7. Esto nos permite abstraer la idea de un conjunto como los Racionales en un TAD de tal manera el programador lo utilice como si fuera una entidad sin necesidad de preocuparse por la implementación, puedo sumar dos racionales sin preocuparme en como se realiza.


# Temas

1. [Herencia](Herencia.md)
2. [Traits y case class](Traits%20y%20case%20class.md)
3. [Reconocimiento de patrones en clases](Reconocimiento%20de%20patrones%20en%20clases.md)
4. [Reconocimiento de patrones sobre listas](Reconocimiento%20de%20patrones%20sobre%20listas.md)