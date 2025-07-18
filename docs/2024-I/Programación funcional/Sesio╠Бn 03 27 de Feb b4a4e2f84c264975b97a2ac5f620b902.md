# Sesión 03: 27 de Feb

# Recursión y procesos

Recursión vs proceso

- No son lo MISMO
- Una función recursiva NO NECESARIAMENTE genera un proceso recursivo, este puede ser iterativo

---

Recusión lineal (cola)

NO TODOS los lenguajes de programción la SOPORTAN

- Python: NO
- Java:NO
- C/C++: NO
- Lisp, Racket, Scala, Ruby, Clojure, Earlang (Lenguajes funcionales)

Esta recursión usa uno de los parámetros de entrada como la salida acumulada

```scala
def fac(n):Int = {
	@tailrec
	def facAux(cnt:Int, acc:Int):Int = {
		if cnt > n:
			acc
		else
			facAux(cnt+1,cnt*acc)
	}
	facAux(1,1)
}
//El argumento acc va acumulando la salida a medida que se llama
///El complador internamente optimiza los llamados
```

---

Recursión de árbol

Dos o más llamados recursivos, NO ES FACIL convertir en recursión cola (no es recomendable)

Los llamados se manejan en INORDEN de 

IZQUIERDA A DERECHA (Evalua Scala)

Es aquella recursión que tiene dos o más llamados

```scala
def fib(n){
	if (n==0) 1
	else {
		if (n==1) 1
		else
			fib(n-1)+fib(n-2)
	}
}
```

# Funciones de alto orden

Funciones cómo argumentos

Las funciones pueden ingresar como argumentos o ser salidas*

*Veremos próxima sesión

```scala
def fun(f:Int=>Int,....):Int
   ...

//f es una función que ingresa a fun y recibe un entero y saca un entero
```

---

Funciones (tipos)
Las funciones tambien tiempo un tipo

- Tipos de entrada
- TIPO de salida

```scala
Int => Int
(Int,Int) => Boolean
Int => (Int,Int) => Int
(Int,(Int,Int)=>Int)=>(Int,Int)=>Int
```

---

Funciones como valores (anónimas)

Las funciones son valores directamente, no necesitamos declararlos en nombres (no es necesario nombrarlas).

Son valores que se INVOCAN

```scala
(x:Int) => x
(x:Int,y:Boolean) => if (y) x+1 else x+2
```