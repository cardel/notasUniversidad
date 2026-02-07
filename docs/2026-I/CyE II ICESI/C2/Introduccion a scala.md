
Scala es un lenguaje de programación que trabaja sobre la máquina virtual de Java, a la larga es un librería que funciona sobre Java.

- Scala ofrece mayor expresividad que Java
- Scala permite tener programación funcional PURA
- Scala nos va  permitir tener mejores herramientas en la Recursión


## Base

```scala
object Main {
	def main(args: Array[String]):Unit = {
		...
	}
}
```

1. ```args:Array[String]``` cuando declaran una ligadura se coloca su nombre, luego : y despues su tipo (iniciar con Mayúscula)
2. ```Unit``` representa void, es decir no hay retorno

```scala
def pollito(a:Int, b:Int):Boolean = {
	//Instruccion 1
	//Instruccion 2
	
	//,,
	//Instruccion n
}
```

3. La funcion va a devolver el valor de la instruccion n
4. **Toda expresión en un lenguaje funcional se reduce a un valor**

## Valores inmutables

En programación funcional los valores son **inmutables** es decir que **NO CAMBIAN** por esta razon los vamos a declarar ```val``` o ```def``` 

```scala
val a:Int = 3
def b:Boolean = True
//Ambos son valores INMUTABLES
def funcion = x => x+3
def funcionB(x:Int):Int = {
	x+3
}

```
No de permite que los valores cambien durante la ejecución
## Funciones como valores

Las funciones se toman **valores** es decir no son diferentes a los otros tipo como Int, Boolean, Double, String, etc, lo unico que puedo hacer con ellas es **invocarlas**, es decir se pueden enviar como parametros o recibir como resultado

```scala
def funcion(a:Int, b:Int):Double = {  
  val c = a+b  
  val d = a*b  
  c/d  
  
}

println(funcion _) //Ver el valor
println(funcion(8,9)) //Invocarla
```

No se debe usar **return** en las funciones.