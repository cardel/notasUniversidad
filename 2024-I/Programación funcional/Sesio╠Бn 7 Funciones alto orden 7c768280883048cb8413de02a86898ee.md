# Sesión 7: Funciones alto orden

Tuplas

Las tuplas son inmutables y nos permiten capturar salidas que vienen en colecciones, ejemplo

```scala
val (l1,l2) = l splitAt 5
val tupla = (1,2)
println(tupla._1)
println(tupla._2)

//Podemos agrupar variables en un match

(l1,l2) match {
	case (_,Nil) => ...
	case (Nil,_) => ....
	....
}

val (l1,l2) = l splitAt n
// n es un entero
//(l1, l2) l1 son los elementos desde 0 hasta n-1, y l2 es el resto
```

---

Map

Nos permite aplicar una operación a los elementos de una colección

```scala
val l1 = List(1,2,3,4)
l1 map (x => x*x)
```

---

Filtros

Nos permiten seleccionar un conjunto de elementos que cumplen un criterio

```scala
val l = List(1,2,3,4,5,6)
l filter (x => x%2 == 0)
//Variantes del filtro
l filterNot (x => x%2 == 0)
// Variantes
l partition (x => x%2 == 0)
// (los que cumplen, los que no cumplen)
l takeWhile (x => x%2 == 0) 
// Nos devuelve todos los elementos desde 0 hasta n que cumplan consecutivos
l dropWhile (x => x%2 == 0)
// Devuelve el resto de aplicar takeWhile
l span (x => x%2 == 0)
//Tupla, cuyo primer elemento es takeWhile y el segundo es DropWhie
```

---

reduce

(del primero hacia el ultimo)

reduceRight

(del ultimo hacia el primero)

Permite aplicar una operación a los elementos de una lista dandonos un resultado único

```scala
val l = List(1,2,3)
0::l reduce ((x,y)=>x+y)
```

Se requiere especificar el acumulador inicial, ya que esto no acepta Listas vacias

---

foldLeft

foldRight

### foldLeft

Dada una coleccion l (x1,x2,..xn), un acumulador z y una operación f = (x,y) ⇒ …

```scala
l foldLeft z // Retorna una función que espera una función de dos argumentos
(l foldLeft z)(f)
```

$$
(((z\:f x_0) \: f \: x_1) \: f \: x_2)\: f \ldots x_n)\ldots)
$$

### foldRight

Dada una coleccion l (x1,x2,..xn), un acumulador z y una operación f = (x,y) ⇒ …

```scala
l foldRight z // Retorna una función que espera una función de dos argumentos
(l foldRight z)(f)
```

$$
(((x_n\:f z) \: f \: x_{n-1}) \: f \: x_{n-2})\: f \ldots x_1)\ldots)
$$

---

Colecciones

- Rangos: Inclusivos o exclusivos

```scala
(x to y) //Inclusivo
(x until y) //Exclusivo
(x to y by z) //Inclusivo cambio z
(x until y by z) //Exclusivo cambio z
```

- Vectores: A diferencia de las listas son mutables y no son RECURSIVOS, funcionan como listas enlazadas (Ver ADA I)
- Arrays: Equivalentes a los arreglos

---

Operaciones adicionales

- forall (aplica un and a toda una coleccion que ha sido mapeada con alguna función predicado: T ⇒ bool)
- exists (aplica un or a toda … función predicado T⇒bool)
- flatMap aplica un producto cartesiano con alguna función

```scala
val a = List(1,2,3)
val b = List(2,3,5)
a flatMap (x => b map ((x,y) => x+y))
//Retorna
/*
(3,4,6,4,5,7,5,6,8)
*/ 
```