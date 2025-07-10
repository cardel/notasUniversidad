# Sesión 07: Listas II

# Tuplas

Son colecciones de datos que se pueden utiliza para patrones, estas pueden contener 2 o más elementos

```scala
val tupla = (1,2,3,4)
//Sumar dos vectores
def sumaVec(a:List[Int], b:List[Int]): List[Int] = {
	a match {
		case Nil => Nil
		case x:xs => {
			b match {
				case Nil => Nil
				case y:ys => x+y :: sumaVec(xs,ys)
			}
		}
	}
}

def sumaVec(a:List[Int], b:List[Int]): List[Int] = {
	(a,b) match {
		case (Nil,Nil) => Nil
		case (x:xs, y:ys) =>
			x+y :: sumaVec(xs,ys)
		case _ => error
	}
```

---

# Funciones de alto orden

Map

Aplica una función a todos los elementos de una lista, la función debe aceptar un sólo argumento y su salida debe ser igual tipo de la lista 

```scala
val l = List(1,2,3,4)
l.map(x => x*2)
```

---

Filter

Aplica a función a todos los elementos de una lista retorna aquellos que cumplen condición (función predicado, es una función que le ingresa un elemento y retorna un booleano)

```scala
val l = List(1,2,3,4,5)
l.filter(x => x > 3)
```

---

Reduce

Función que aplica una operación entre los elementos de una colección y nos retorna un elemento

```scala
val l = List(1,2,3,4,5)
l.reduce( (acc,x) => acc + x, 0)
```

ReduceLeft (((((1 + 2) + 3) + 4) + 5)

ReduceRight (1 + (2 + (3 + (4 + 5))))

Para que de lo mismo la operación **debe ser asociativa**

---

FoldLeft

FoldRIght

Son operaciones de reducción, son operaciones que reciben dos o más colecciones y nos permiten combinarlas

- Fold recibe inicialmente al acumulador y me retorna una función que espera la función de reducción (dos parametros x, acc)
- La función retornada la evaluamos con la función de reducción

```scala
val l = List(1,2,3)

l.foldLeft(0)_ //Retorna una función que espera una función
l.foldLeft(0)((x,acc) => x + acc)

//¿Cual es la diferencia entre reduceLeft y reduceRight)
//La forma de asociar
//ReduceLeft ((primer op segundo) op tercero) .. op acc)
//ReduceRight (primer op (    ...     (penultimo op (ultimo op acc)) ...)
```