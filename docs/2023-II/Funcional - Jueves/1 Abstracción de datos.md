# 1. Abstracción de datos

### Recall

¿Que es abstracción de datos?

¿Que ventajas nos ofrece la abstracción de datos?

¿Como establezco una representación entendible en un objeto en Scala?

¿Que elementos debe tener una representación de datos?

¿Como establezco precondiciones a las abstraccion?

Como manejo las excepciones/error en la representación de datos

¿Que es el this o el self en un lenguaje?

¿Que es un modificador de acceso a un tipo de dato?

Jerarquia de los objetos

### Notes

Es la capacidad de representar información compleja utilizando los elementos del lenguaje de programación

- Incrementar la modularidad: ¿Porque el ejemplo del Racional es modular? Se dejan de representar de como numeros (nivel bajo de abstracción), a una de más alto nivel   a/b
- Elevar el nivel de abstraccion: Numero → a/b
- Fortalecer el nivel expresion del lenguaje → Evitar representaciones complejas de los datos o dificiles de entender 0.6666 (dificil de entender) 2/3 es más facil de entender
    
    ```scala
    override
    def toString():String = {
    	//Lo que quiera representar
    }
    //Hace
    print(instancia) //La representación del objeto
    ```
    

Un CONSTRUCTOR (permite instanciar el tipo de dato)

SELECTORES Permite acceder a los datos o ejecutar operaciones

```scala
//Constructor
class Racional(Int: a, Int:b) {
	//Selectores
	def num = a
	def den = b
	def suma(r:Racional) = {...}
	def mult(r:Racional) = {..}
}
```

Una precondición establece que se debe cumplir para que el dato sea VALIDO

```scala
require(dato == condicion, "Mensaje de error")
assert(...condicion verdadera...)
```

Debo generar una excepción que me permita comunicar la situación que genera el problema, el require genera una excepción IllegalArgumentException (argumento no válido)

Es una ligadura dinámica que está al mismo objeto, permite ejecutar metodos o usar la representación de la instancia dentro del código de la clase.

Es restringir que elementos se pueden usar desde afuera de la clase

```scala
class Racional(Int: a, Int:b) {
	//Selectores
	def num = a //Publico
	def den = b //publico
	private def mcm(a:Int, b:Int) {..} //Privado
}
```

![Untitled-2023-09-28-1347.png](1%20Abstraccio%CC%81n%20de%20datos%2070a4a402168a4e6d9c80f0dd9875269a/Untitled-2023-09-28-1347.png)