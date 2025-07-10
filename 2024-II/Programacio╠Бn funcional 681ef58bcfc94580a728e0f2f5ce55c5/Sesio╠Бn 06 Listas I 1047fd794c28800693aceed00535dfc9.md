# Sesión 06: Listas I

# Reconocimiento de clases

¿Que es?

Es interpretar una clase T, de acuerdo a sus hijas Ti. Ejemplo Expr tiene dos clases hijas: Numero y Suma

```scala
expr math {
	Numero(n) => ...
	Suma(e1,e2) => ....
}

//Equivalente

if (expr isInstaceof Numero.class) {
	expr.numero
}
else {
	val e1 = expr.izq;
	val e2 = expr.der;
	//evaluar e1 y e2
}
```

---

Que ventajas tiene reconocer clases (patrones)

1. No es necesario crear variables booleanas para representar condiciones
2. Extrae directamente los campos de la clase
3. El código es mucho más limpio

---

match

```scala
<valor> match {
	case p => hacer ...
	...
	case _ => else...
}
```

Los patrones se evaluan de arriba hacia abajo, tener cuidado de que un patrón no tome los casos de otro, usted debe asegurar que los patrones sean conjuntos disyuntos

# Listas

¿Que son?

Son una colección de elementos del mismo tipo (ANY incluir cualquiera)

Son una estructura **inmutable y recursiva**

- head (cabeza) Any
- tail (cola) List[T]
- caso base: Nil : List[T]

---

¿Como construimos listas?

```scala
List(1,2....)
1::2::3:: ... :: Nil //Asociativo a la derecha
(1::(2::(3::Nil)))
```

---

¿Como trabajamos listas?

1. Usamos reconocimiento de patrones para identificar cómo están “construidas”
2. Posteriormente procesamos tomando en cuenta que una lista
    1. tail (cola Lista)
    2. head (cabeza)

```scala
val a = List(1,2,3,4)
a.head
a.tail //List(2,3,4)
a.tail.head // 2
a.tail.tail //List(3,4)
a.tail.tail.head //3
a.tail.tail.tail //List(4)
a.tail.tail.tail.head //4
a.tail.tail.tail.tail //Nil

a match {
	 case Nil => ----
	 case 2::xs => ....
	 case x::List(1,2,3) => ...
	 case x::xs => ....
	 case x::y::xs => ....
	 case List(x,y,xs) => ...
}

def suma(l:List[Int]):Int = {

	l match {
		case Nil => 0
		case x::xs => x + suma(xs)
}

def suma(l:list[Int]):Int = {
	if (l.isEmpty) 0
	else {
		l.head + suma(l.tail)
	}
}
```

---

## Resumen

- Patrones con clases: A partir de un esquema de clases (con relación de herencia) podemos reconocer las diferentes implementaciones usando reconocimiento de patrones

```scala
abstract class Mamifero(edad:Int)
case class Perro(color:String)
case class Gato(velocidad:Int)
case class Buho(altura:Int)

obj match {
	case Perro(n,x) => .... n es s la edad y x es el color
	case Gato(n,x) => ... n es la edad y x es la velocidad
	case Buho(n,x) => ... n es la edad y x la altura
}

```

- Listas como colecciones del mismo tipo
    - No se pueden alterar (no mutables) y son recursivas (cabeza y cola), con case base lista vacia
    - Se pueden armar con List(…) o :: este ultimo es asociativo a la derecha
- Como trabajamos listas con reconocimiento de patrones

```scala
lst match {
	case Nil => ...
	case x::xs => x es la cabeza y xs es la cola
}
```

- Con el uso de reconocimiento de patrones
    - ¿Que ganamos? Un código mas limpio y legible, no tener que declarar variables extrayendo información de las estructuras/valores/objetos
    - Ofrece un diseño facilmente escalable
    - Las funciones son más cortas
    - ¿Que desventajas? No podemos verificar cosas como x < y, para esto debemos usar un if