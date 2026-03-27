# Currying

El **currying** es una técnica para transformar funciones de varios parámetros en funciones que retornan funciones que esperan un parámetro. Esto es útil en funciones cuyos parámetros no suelen cambiar mucho, para poder reutilizarlas sin necesidad de enviar este parámetro repetidamente.

```scala
// Función tradicional de dos parámetros
def suma(a:Int, b:Int):Int = a+b

// Versión con currying: múltiples listas de parámetros
def sumaC(a:Int)(b:Int):Int = a+b

// Aplicación parcial: fijamos el primer parámetro (a=5)
val f1 = sumaC(5)_
// Aplicación parcial: fijamos el primer parámetro (a=10)
val f2 = sumaC(10)_
```

`f1` representa todas las funciones donde `a = 5`, es decir, no necesitamos enviar este valor nuevamente. De manera similar, `f2` representa todas las funciones donde `a = 10`.

A continuación, veremos un ejemplo de mapeo utilizando currying:

```scala
object Currying{

  // Función de orden superior con currying: recibe una función de transformación
  // y retorna una función que espera una lista para aplicar el mapeo
  def mapeo(f:Int => Int)(l:List[Int]):List[Int] = {
    l match {
      case Nil => Nil
      case x :: xs => f(x) :: mapeo(f)(xs)
    }
  }

  def main(arr:Array[String]):Unit = {
    // Aplicación parcial: fijamos la función de transformación
    val f1 = mapeo(x => x*x)_ // Conjunto de funciones que aplican la transformación x = x*x
    val f2 = mapeo(x => x+2)_ // Conjunto de funciones que aplican la transformación x = x+2
    val f3 = mapeo(x => 2*x)_ // Conjunto de funciones que aplican la transformación x = 2*x

    val l1 = List(1,2,3,4,5,6,7,8,9,10)
    val l2 = List(2,4,6,8,10,12)

    // Aplicamos las funciones f1, f2, f3 a diferentes listas
    println(f1(l1)) // Aplica cuadrado a l1
    println(f1(l2)) // Aplica cuadrado a l2

    println(f2(l1)) // Aplica suma de 2 a l1
    println(f2(l2)) // Aplica suma de 2 a l2

    println(f3(l1)) // Aplica multiplicación por 2 a l1
    println(f3(l2)) // Aplica multiplicación por 2 a l2
  }
}
```

Las funciones `f1` representan todas aquellas que elevan al cuadrado los elementos de cualquier lista, `f2` las funciones que suman 2, y `f3` las funciones que multiplican por 2.

Con este enfoque, si la función de transformación no cambia, nos evitamos tener que enviarla repetidamente.

## Fundamentación teórica

Formalmente, dada una función $f(a,b): \mathbb{N} \times \mathbb{N} \rightarrow \mathbb{N}$, podemos construir una función intermedia $g_a = f(a)\_$ donde $g_a: \mathbb{N} \rightarrow \mathbb{N}$ y la aplicación de $g_a(b)$ produce un $\mathbb{N}$ que es el resultado de $f(a,b)$. En otras palabras, $g_a$ es una función en la que hemos establecido el valor de $a$, por lo tanto $g_a$ es un conjunto de funciones dependiendo del valor de $a$.

El currying transforma una función que toma múltiples argumentos en una secuencia de funciones que toman un solo argumento. Matemáticamente, esto se expresa como:

$f: A \times B \rightarrow C$ se transforma en $g: A \rightarrow (B \rightarrow C)$

Donde $g(a)$ es una función que toma $b$ y retorna $f(a,b)$.

---

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scala |
|----------|-------------|------------------|
| **Currying** | Técnica que transforma una función con múltiples argumentos en una secuencia de funciones de un argumento. | `def f(a:Int)(b:Int):Int` |
| **Aplicación parcial** | Proceso de fijar algunos argumentos de una función currificada para obtener una nueva función. | `val suma5 = sumaC(5)_` |
| **Función de orden superior** | Función que toma o retorna otras funciones, facilitada por el currying. | `def mapeo(f:Int=>Int)(l:List[Int])` |
| **Reutilización de código** | Patrón que permite crear funciones especializadas a partir de funciones generales. | `val cuadrado = mapeo(x=>x*x)_` |
| **Composición funcional** | El currying facilita la combinación de funciones para crear comportamientos complejos. | `val transformar = mapeo(f)_` |

---

## Comentarios adicionales

- El currying debe su nombre al lógico Haskell Curry, aunque el concepto fue introducido originalmente por Moses Schönfinkel.
- En Scala, el currying se implementa mediante múltiples listas de parámetros, no como una transformación automática de funciones de múltiples argumentos.
- Esta técnica es fundamental en lenguajes funcionales puros como Haskell, donde todas las funciones están currificadas por defecto.
- El currying permite una mayor flexibilidad en la composición de funciones y es la base para conceptos más avanzados como los monoides y mónadas.
- Una desventaja potencial es que puede afectar el rendimiento debido a la creación de múltiples objetos función, aunque en la práctica esto rara vez es un problema significativo.
- El currying es particularmente útil en combinación con funciones de orden superior como `map`, `filter` y `fold`, donde permite crear versiones especializadas sin repetir código.