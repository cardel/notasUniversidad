# Sesión 02. Elementos de PF

20 de Agosto del 2023

# Paradigmas de programación

¿Que es un paradigma de programación?

Conceptos aplicados a la programación: Forma de resolver problemas

- Imperativo: Secuencialidad y estado. Estructuras de control.
- Orientado a objetos: Objeto como elemento de abstracción del mundo real: estado y encapsulamiento
- Orientado a eventos: Acciones que puede realizar el usuario: Teclado, acciones de ratón, etc
- Funcional: Inmutabilidad de las variables, funciones de alto orden, recursividad.
- Relacional: Enfocado a operaciones entre conjuntos

---

Programación funcional

- Basado en funciones: Dominio y un rango. Dominio: Son los elementos del conjunto de entrada a la función, Rango: Elementos del conjunto de salida de la función.
- Tener operaciones como la composición de funciones
- Funciones son ciudadanos de primera clase: Pueden ser entradas o salidas
- Toda operación tiene un **valor**

---

## Resumen

Un paradigma de programación es un conjunto de practicas o formas para resolver problemas.

Diferencia entre paradigma y lenguaje de programación: Paradigma metodologia/forma de resolver, lenguaje es la herramienta.

Programación funcional: 1) Variables no mutables: las variables (nombres/ligaduras) no cambian, no tenemos estructuras de control imperativas: for ni while, tenemos que las funciones son de alto orden (recibe funciones y puede retornar funciones) funciones son ciudadanos de primera clase

En scala tenemos que la clase principal es un object (clase estática) la cual debe contener el método main

# Elementos de programación funcional

Expresiones

- Primitiva: Representa operaciones atómicas (que no se pueden separar en otras operaciones)
- No primitivas: Aplica un operador a unos operandos: función, estos se evaluan a izquierda a derecha

---

Evaluación por valor

- Se calculan los valores antes de llamar la función
- Las declaramos **val**

```scala
def f(a:Int, b:Int): Int = b
def g(a:Int, b:Int): Int = f(a,b)
g(4,5)
```

Suponiendo evaluación por valor

1. g(4,5)
2. f(4,b)
3. f(4,5)
4. 5

Antes de llamar la función **calcula los valores de los argumentos de izquierda a derecha**

Evaluación por nombre

- Los argumentos se calculan **cuando se necesitan**
- Las declaramos como **def**

```scala
def f(a:Int, b:Int): Int = b
def g(a:Int, b:Int): Int = f(a,b)
g(4,5)
```

1. g(4,5)
2. f(a,b)
3. b
4. 5

---

Diferencia entre CBV y CBN

CBV puede no terminar donde CBN si, es el caso de las definiciones recursivas (sin condición de parada)

```scala
def x:Int = x
def y:Int = 5
def f(a:Int, b:Int):Int = b

f(x,y)
```

En evaluación por valor → No termina porque x no se puede calcular

En evaluación por nombre, termina dando 5

---

Expresiones condicionales

Nos ayuda a difurcar el código de acuerdo a una condición booleana; En estas condiciones se suelen usar operadores relacionales: < > ≤ ≥ == =! is in .empty()

```scala
/*
if (condicion) <expresion verdadera>
else <expresion falsa>
*/

if (x >= 5) x else 8
```

---

Funciones

Funciones reciben 0 o más argumentos, y terminan un valor

```scala
def f(x:Int, y:Int):Int = x + y
def f(x:=>Int, y:Int):Int =x + y
def g(h:(Int->Int), p:Int):Int = h(p)
```

---

Bloques de código

- Definen el alcance léxico de los nombres y definiciones de funciones
- Un bloque no puede ser visto desde afuera

```scala
{
	def ..
	def ..
	def ..
	val ..
	val ..
	<operacion>
	...
	...
	<expresion>
}
/** 
El bloque retorna lo último que se ha hecho
**/
```

Ejemplo

```scala
def f(x:Int):Int = {
	val a = x+1
	val b = x*2
	a + b
}
```

---

Diseño de programas funcionales

- Tome las funciones auxiliares y coloquelas dentro de un **bloque**
- Cada función se encarga de **una tarea específica**
- Quite de los parametros de entrada las variables que son iguales

```scala
def distancia(x0:Int, y0:Int, x1:Int, y1:Int): Double = Math.sqrt(calcularSumaCuadrados(x0,y0,x1,y1))

def calcularSumaCuadrados(x0:Int, y0:Int, x1:Int, y1:Int):Double = {
	restaC(x0,x1) + restaC(y0,y1)
}

def restaC(n0:Int, n1:Int):Double = {
	n1*n1 - n0*n0
}
```

```scala
def distancia(x0:Int, y0:Int, x1:Int, y1:Int): Double ={
	def calcularSumaCuadrados():Double = {
		restaC(x0,x1) + restaC(y0,y1)
	}
	
	def restaC(n0:Int, n1:Int):Double = {
		n1*n1 - n0*n0
	}
 Math.sqrt(calcularSumaCuadrados())
}

```