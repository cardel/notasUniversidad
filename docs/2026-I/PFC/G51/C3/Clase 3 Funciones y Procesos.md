# Como vamos

1. Programación funcional es resolver problemas
	1. Variables inmutables (ligaduras)
	2. Toda expresión se vuelve un valor
	3. Funciones de alto orden; Funciones que reciben  funciones y retornan funciones
	4. Recursión como método natural para resolver problemas
2. Evaluación de expresiones
	1. CBV Evaluación por valor o ansiosa, se evaluan todos los parametros antes de invocar la función
	2. CBN Evaluación por nombre, se evaluan solamente cuando es necesario

Ejemplo evaluación por valor

```scala
def f(n:Int, m:Int):Int = g(n+m)+g(n*m)
def g(a:Int):Int = a*a+2*a

//CBV
f(10*3,10+8)
f(30,10+8)
f(30,18)
g(30+18)+g(30*18)
g(48)+g(30*18)
48*48+2*48+g(30*18)
2304+2*48+g(30*18)
2304+96+g(30*18)
2400+g(30*18)
2400+g(540)
2400+540*540+2*540
2400+291600+2*540
294000+2*540
294000+1080
295080
```

Ejemplo de evaluación por nombre

```scala
def f(n: => Int, m: => Int):Int = g(n+m)+g(n*m)
def g(a: => Int):Int = a*a+2*a

//CBN
f(10*3,10+8)
g(10*3+10+8)+g(10*3*(10+8))
(10*3+10+8)*(10*3+10+8)+2*(10*3+10+8)+g(10*3*(10+8))
(30+10+8)*(10*3+10+8)+2*(10*3+10+8)+g(10*3*(10+8))
(40+8)*(10*3+10+8)+2*(10*3+10+8)+g(10*3*(10+8))
48*(10*3+10+8)+2*(10*3+10+8)+g(10*3*(10+8))
48*(30+10+8)+2*(10*3+10+8)+g(10*3*(10+8))
48*(40+8)+2*(10*3+10+8)+g(10*3*(10+8))
48*48+2*(10*3+10+8)+g(10*3*(10+8))
2304+2*(10*3+10+8)+g(10*3*(10+8))
2304+2*(30+10+8)+g(10*3*(10+8))
2304+2*(40+8)+g(10*3*(10+8))
2304+2*48+g(10*3*(10+8))
2304+96+g(10*3*(10+8))
2400+g(10*3*(10+8))
2400+(10*3*(10+8))*(10*3*(10+8))+2*(10*3*(10+8))
2400+(30*(10+8))*(10*3*(10+8))+2*(10*3*(10+8))
2400+(30*18)*(10*3*(10+8))+2*(10*3*(10+8))
2400+540*(10*3*(10+8))+2*(10*3*(10+8))
2400+540*(30*(10+8))+2*(10*3*(10+8))
2400+540*(30*18)+2*(10*3*(10+8))
2400+540*540+2*(10*3*(10+8))
2400+291600+2*(10*3*(10+8))
294000+2*(10*3*(10+8))
294000+2*(30*(10+8))
294000+2*(30*18)
294000+2*540
294000+1080
295080
```

3. Alcance léxico
```scala
def f(x:Int, y:Int) {
	x+y
}

val x = 10
val y = 20

f(20,30)
```

En caso tenemos shadowing el x, y de f ocultan el x, y de contexto global.

El x, y de f solo viven en el.

# Temas

1. [Recursión lineal](Recursión%20lineal.md)
2. [Recursion de cola](Recursion%20de%20cola.md)
3. [Recursion de arbol](Recursion%20de%20arbol.md)
4. [Recursión estructural](Recursión%20estructural.md)
5. [Resumen](Resumen.md)