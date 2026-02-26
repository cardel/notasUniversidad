
# Como vamos

1. Alcance léxico
```scala
{
 //Val x , val y
 //Estos viven dentro del bloque
 val x = 10
 val y = 20
 def f(x:Int, y:Int):Int = x+y
 f(30,40)
}
```

¿Que pasa con el x, y de la función, este x,y ocultan los del contexto global, esto se conoce como ocultamiento o shadowing

2. Listas
```scala
//Listas es estructura recursiva que tiene cabeza y cola
val y = List(2,3,4,5)
y.head //2
y.tail //List(3,4,5)

//La recursión de la lista termina en Lista vacia
2 :: 3 :: 4 :: 5 :: Nil
//Recordar que el operador :: es asociativo por la derecha
(2 :: (3 :: (4 :: (5 :: Nil))))
```

3. Condicionales
```scala
if <condicion> <expresion_true> else <expresion-false>
```

4. Estrategias de evaluación

Recordar que las expresiones se evaluan de izquierda a derecha
	1. CBN: Los valores se evaluan cuando se van a utilizar
```scala
	   def f(x: => Int, y: => Int):Int = {
		   g(x+y,x*y)
	   }
	   
	   def g(a: => Int, b: => Int):Int = {
		   a+a*b
	   }
	   
	   /*
	   1) f(10*4, 12+3)
	   2) g(10*4+12+3,(10*4)*(12+3))
	   3) 10*4+12+3+(10*4+12+3)*(10*4)*(12+3)
	   4) 40+12+3+(10*4+12+3)*(10*4)*(12+3)
	   5) 52+3+(10*4+12+3)*(10*4)*(12+3)
	   6) 55+(10*4+12+3)*(10*4)*(12+3)
	   7) 55+(40+12+3)*(10*4)*(12+3)
	   8) 55+(52+3)*(10*4)*(12+3)
	   9) 55+55*(10*4)*(12+3)
	   10) 55+55*40*(12+3)
	   11) 55+55*40*15
	   12) 55+2200*15
	   13) 55+33000
	   14) 33055
```
	2. CBV Evaluación por valor: Antes de invocar la función, evaluamos todas las expresiones
```scala
	   def f(x:Int, y:Int):Int = {
		   g(x+y,x*y)
	   }
	   
	   def g(a:Int, b:Int):Int = {
		   a+a*b
	   }
	   
	   /*
	   1) f(10*4, 12+3)
	   2) f(40, 12+3)
	   3) f(40,15)
	   4) g(40+15,40*15)
       5) g(55,40*15)
       6) g(55,600)
       7) 55 + 55*600
       8) 55 + 33000
       9) 33055
```

# Temas.

1. [Recursion lineal](Recursion%20lineal.md)
2. [Ejemplo de recursion lineal y de cola](Ejemplo%20de%20recursion%20lineal%20y%20de%20cola.md)
3. [Recursión de arbol](Recursión%20de%20arbol.md)
4. [Resumen](Resumen.md)