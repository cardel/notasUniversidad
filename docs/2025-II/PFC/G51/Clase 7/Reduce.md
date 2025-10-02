La reducción es una operación en la cual vamos a transformar una lista en un valor especifico

1. Sumar los valores de una lista de enteros
2. Sumar los tamaños de una lista de string


Reduccion vamos a tomar el primer elemento como el acumulador inicial.

1. Es que el acumulador debe ser del mismo tipo de la lista de entrada
2. No trabaja sobre listas vacias

El reduce utiliza asociación

1. Asociación por la izquierda
2. Asociación por la derecha

# Asociacion reduce

```scala
List(1,2,3,4)
//Asociación por la izquierda
(((1+2)+3)+4)
//Asociación por la derecha
(1 + (2+(4+3)))

```
Esto funciona bien con operaciones asociativas, pero que pasa con operaciones no asociativas

```scala
List(1,2,3,4)
//Asociación por la izquierda
(((1-2)-3)-4) // -8
//Asociación por la derecha
(1-(2-(3-4))) // -2
```

Analizando `reducir(List(1,2,3,4))((acc,x) => acc - x)`:

**Evolución paso a paso reduceLeft:**

```
reducirI(List(2,3,4))(1)      // acc = 1 (primer elemento)
reducirI(List(3,4))(f(1,2)= -1)  // acc = 1 - 2 = -1
reducirI(List(4))(f(-1,3)= -4)   // acc = -1 - 3 = -4
reducirI(Nil)(f(-4,4)= -8)       // acc = -4 - 4 = -8
Resultado: -8
```

**Explicación del cálculo:**
- **Paso 1:** `1` (elemento inicial)
- **Paso 2:** `1 - 2 = -1`
- **Paso 3:** `-1 - 3 = -4`
- **Paso 4:** `-4 - 4 = -8`

**Observación importante:**
La función calcula `((1 - 2) - 3) - 4` en lugar de `1 - 2 - 3 - 4` (que sería lo mismo). Esto ocurre porque la resta no es asociativa, por lo que el orden de evaluación importa.

Analizando `reduceR(List(1,2,3,4))((x,y) => x - y)`:

**Evolución paso a paso ReduceRight:**

```
reduceR(List(1,2,3,4))((x,y) => x - y)
= f(1, reduceR(List(2,3,4))((x,y) => x - y))
= f(1, f(2, reduceR(List(3,4))((x,y) => x - y)))
= f(1, f(2, f(3, reduceR(List(4))((x,y) => x - y))))
= f(1, f(2, f(3, 4)))  // Caso base: x :: Nil => x
= f(1, f(2, 3 - 4))    // f(3,4) = 3 - 4 = -1
= f(1, 2 - (-1))       // f(2,-1) = 2 - (-1) = 3
= 1 - 3                // f(1,3) = 1 - 3 = -2
Resultado: -2
```

**Explicación del cálculo:**
- **Nivel 4:** `reduceR(List(4)) = 4`
- **Nivel 3:** `f(3,4) = 3 - 4 = -1`
- **Nivel 2:** `f(2,-1) = 2 - (-1) = 3`
- **Nivel 1:** `f(1,3) = 1 - 3 = -2`

**Resultado final:** `-2`

**Diferencia clave con la versión anterior:**
- La versión anterior (tailrec) calculaba: `((1 - 2) - 3) - 4 = -8`
- Esta versión (recursiva) calcula: `1 - (2 - (3 - 4)) = -2`

La recursión hacia atrás cambia completamente el orden de evaluación de la resta.

# Implementación de Reduce

```scala
import scala.annotation.tailrec

object Reducir {


	// Redución por la izquierda  
  def reducir[U](l:List[U])(f: (U,U) => U):U = {
    @tailrec
    def reducirI(l:List[U])(acc:U):U = {
      l match {
        case Nil => acc  // Lista vacía, retorna acumulador
        case x :: xs => reducirI(xs)(f(acc,x))  // Aplica función y recursión tail
      }
    }
    l match {
      case Nil => throw new Exception("Reducir no funciona en listas vacias")
      case x :: xs => reducirI(xs)(x)  // Primer elemento como acumulador inicial
    }
  }

	// Reducción por la derecha
  def reduceR[U](l:List[U])(f : (U,U)=>U):U = {
    l match {
      case Nil => throw new Exception("No se aceptan listas vacias") 
      case x :: Nil => x  // Caso base: un solo elemento
      case x :: xs => f(x, reduceR(xs)(f))  // Recursión hacia atrás
    }
  }

  def main(args: Array[String]): Unit = {
    // Pruebas con reducir (tailrec - izquierda)
    println(reducir[Int](List(1,2,3))((acc,x) => acc+x))  // Suma: 1+2+3 = 6
    println(reducir[Int](List(1,2,3,4))((acc,x) => acc*x))  // Multiplicación: 1*2*3*4 = 24
  
    // Comparación resta con reduceLeft (mismo orden)
    println(reducir[Int](List(1,2,3,4))((acc,x) => acc-x))  // ((1-2)-3)-4 = -8
    println(List(1,2,3,4) reduceLeft ((acc,x) => acc-x))  // Mismo resultado: -8
  
    // Comparación resta con reduceRight (orden diferente)
    println(reduceR[Int](List(1,2,3,4))((acc,x) => acc-x))  // 1-(2-(3-4)) = -2
    println(List(1,2,3,4) reduceRight ((acc,x) => acc-x))  // Mismo resultado: -2
  }
}
```
# Limitacion

Si queremos transformar List de tipo U a tipo T, no podemos ya que el primer elemento / ultimo es el acumulador inicial

```scala
scala> List("Hola","Mundo","Cruel") reduceLeft ((acc,x) => acc + x.length)
val res5: String = Hola55

scala> List("Hola","Mundo","Cruel") reduceRight (acc,x) => acc + x.length)
                                                        ^
       error: ';' expected but '=>' found.

scala> List("Hola","Mundo","Cruel") reduceRight ((acc,x) => acc + x.length)
val res6: String = Hola6
```