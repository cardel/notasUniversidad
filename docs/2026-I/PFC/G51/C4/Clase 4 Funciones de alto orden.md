# Como vamos

1. Elementos de PF
	1. Variables inmutables
	2. Uso de recursión como método de solución
	3. Toda expresión es un valor (no hay elementos como Null, Return, Continue)
	4. Funciones son ciudadanos de primera clase (o de alto orden)
2. Evaluación de expresion
	1. De izquierda a derecha
	2. CBV Evaluación por valor, los valores se calculan antes de ejecutar la función
	3. CBN Evaluación por nombre, los valores se calculan cuando se van a utilizar
3. Alcance léxico
```scala
val x = 10
{
	val x = x+3 //este x toma el de afuera
	x //x interno
}

def f(x:Int) = x*2

f(30) //60 porque el x de la función oculta al externo

```
El alcance está dado por la ubicación del código, es decir que en una función podemos ocultar una variable externa (shadowing) y no poder a su valor directamente.
4. Recursión:
	1. Recursión lineal: Abre marcos de pila para cada llamado, es sencilla de programar dado que solo basta con programar caso base y caso recursivo
	2. Recursión de cola: Solo abre un marco de pila, pero requiere ajustar el acumulador
	3. Recursión de árbol: Multiples llamados

# Tema

1. [Funciones de alto orden](Funciones%20de%20alto%20orden.md)
2. [Ejercicio de funciones alto orden](Ejercicio%20de%20funciones%20alto%20orden.md)
3. [Currificación](Currificación.md)
4. [Resumen](Resumen.md)