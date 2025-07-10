# Clase 26 Marzo: Relaciones RR y Funciones alto orden

# Apuntes adicionales

## Estimación complejidad algoritmo recursivo

T(n) = aT(n/b)  + f(n)
a numero suproblemas
n/b tamaño de cada problema
f(n) lo que cuesta dividir + combinar

## Ejemplo de función recursiva para encontrar elementos repetidos

```scala
def buscarRepetidos(l1:List[Int], l2:List[Int], acc:List[Int]=Nil):List[Int] = {
	(l1, l2) match {
		case (Nil, _) => acc
		case (x::xs, _) =>
			buscarRepetidos(xs,l2, buscarRep(x,l2, acc))
	}
}

def buscarRep(x:Int, l:List[Int], acc:List[Int]):List[Int] = {
     match l {
         case Nil => acc
         case y :: ys =>
             if (y = x) acc :+ x
             else buscarRep(x, ys, acc)
     }
 }
```

```scala
l2.filter(x => l2.count(x) > 1)
```