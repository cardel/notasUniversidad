# Funciones de orden superior

Dado que las funciones son ciudadanos de primera clase (valores), estas pueden ser pasadas como parámetros o ser retornadas.

Esto permite que funciones denominadas como **de orden superior** puedan recibirlas o emitirlas.

Esto tiene especial utilidad cuando tenemos funciones que realizan operaciones similares.

```scala
object Filtros {

  // Filtra solo los números pares de una lista
  def pares(l:List[Int]):List[Int] = {
    l match{
      case Nil => Nil
      case x :: xs =>
        if (x%2 == 0)  x :: pares(xs) else pares(xs)
    }
  }

  // Filtra solo los números impares de una lista
  def impares(l:List[Int]):List[Int] = {
    l match{
      case Nil => Nil
      case x :: xs =>
        if (x%2 != 0)  x :: impares(xs) else impares(xs)
    }
  }

  // Filtra solo los números mayores que 5
  def mayorQue(l:List[Int]):List[Int] = {
    l match{
      case Nil => Nil
      case x :: xs =>
        if (x > 5)  x :: mayorQue(xs) else mayorQue(xs)
    }
  }

  // Función de orden superior: recibe una lista y una función predicado
  // f: Int => Boolean determina qué elementos se conservan
  def filtroHO(l:List[Int], f:Int=>Boolean):List[Int] = {
    l match{
      case Nil => Nil
      case x :: xs =>
        if (f(x)) x :: filtroHO(xs,f) else filtroHO(xs,f)
    }
  }

  // Versión con múltiples listas de parámetros (currying)
  // Permite aplicar parcialmente la lista y obtener una función que espera el predicado
  def filtroHOR(l:List[Int])(f:Int=>Boolean):List[Int] = {
    l match{
      case Nil => Nil
      case x :: xs =>
        if (f(x)) x :: filtroHOR(xs)(f) else filtroHOR(xs)(f)
    }
  }
 

  def main(arr:Array[String]):Unit = {
    val l = List(1,2,3,4,5,6,7,8,9,10,11,12)
    println(pares(l))
    println(impares(l))
    println(mayorQue(l))
    
    // Definiciones explícitas de funciones predicado
    def esPar(x:Int):Boolean = x % 2 == 0
    def esImpar(x:Int):Boolean = x % 2 != 0
    def mayorQueF(x:Int):Boolean = x > 5
    
    // Usando filtroHO con funciones definidas
    println(filtroHO(l,esPar))
    println(filtroHO(l,esImpar))
    println(filtroHO(l,mayorQueF))

    // Usando filtroHO con funciones anónimas (lambdas)
    println(filtroHO(l, (x:Int) => x%2 == 0))
    println(filtroHO(l, (x:Int) => x%2 != 0))
    println(filtroHO(l, (x:Int) => x > 5))

    // Aplicación parcial: fijamos la lista l y obtenemos una función que espera el predicado
    val filtroL = filtroHOR(l) _
    println(filtroL)

    // Usamos la función resultante con diferentes predicados
    println(filtroL((x:Int) => x%2 == 0))
    println(filtroL((x:Int) => x%2 != 0))
    println(filtroL((x:Int) => x > 5))
  }
}
```

Los casos de `pares`, `impares` y `mayorQue` tienen una estructura prácticamente idéntica; solamente cambia la condición de filtro, es decir, qué datos se agregan a la salida.

Bajo este enfoque creamos `filtroHO`, el cual recibe la función que determina la selección de los elementos. Esta función tiene tipo `Int => Boolean`. Podemos definir funciones como `esPar`, `esImpar`, `mayorQueF` que validan si un elemento cumple una condición.

Sin embargo, esto requiere definir las funciones explícitamente, y a veces solo las utilizamos una vez, lo que dificulta la lectura del código.

Para esto contamos con **funciones anónimas** (también llamadas *lambda expressions* o *lambdas*).

Una función anónima es un valor que se comporta como una función y tiene la siguiente estructura:

```scala
(Argumento1:Tipo1, Argumento2:Tipo2, ..., Argumenton:Tipon) => expresión
```

Se recomienda tipar los argumentos, aunque el compilador puede inferirlos. En algunos casos es útil cuando tenemos diferentes tipos pero la operación es compatible (por ejemplo, la suma `+` con `Int`, `Double`, `Float`, `Long`, `Short`).

Ejemplo:

```scala
(x:Int,y:Int,z:Int) => x + y + z
(x,y,z) => x+y+z // Cuidado: el compilador infiere los tipos
```

También podemos tener funciones que retornan funciones, como en el caso de `filtroHOR`. Esta función recibe primero la lista y retorna una función que espera un predicado `Int => Boolean`.

```scala
scala>   def filtroHOR(l:List[Int])(f:Int=>Boolean):List[Int] = {
     |     l match{
     |       case Nil => Nil
     |       case x :: xs =>
     |         if (f(x)) x :: filtroHOR(xs)(f) else filtroHOR(xs)(f)
     |     }
     |   }
def filtroHOR(l: List[Int])(f: Int => Boolean): List[Int]

scala> filtroHOR _
val res1: List[Int] => ((Int => Boolean) => List[Int]) = $Lambda$1225/0x00007f4180599000@795faad

scala> val l = List(1,2,3,4,5,6,7,8)
val l: List[Int] = List(1, 2, 3, 4, 5, 6, 7, 8)

scala> val filtroL = filtroHOR(l)_
val filtroL: (Int => Boolean) => List[Int] = $Lambda$1229/0x00007f41805a6a60@4eb73cc8
```

Gracias a esto podemos tener familias de funciones que trabajan con datos en común.

```scala
scala> val l = List(1,2,3,4,5,6,7,8)
val l: List[Int] = List(1, 2, 3, 4, 5, 6, 7, 8)

scala> val filtroL = filtroHOR(l)_
val filtroL: (Int => Boolean) => List[Int] = $Lambda$1229/0x00007f41805a6a60@4eb73cc8

scala> val l2 = List(2,3,4,5,6)
val l2: List[Int] = List(2, 3, 4, 5, 6)

scala> val filtroL2 = filtroHOR(l2)_
val filtroL2: (Int => Boolean) => List[Int] = $Lambda$1232/0x00007f41805a5428@3f2d2f22
```

Podemos usar `filtroL` para operar cualquier función con la lista `l` sin tener que enviarla nuevamente, y lo mismo ocurre con `filtroL2` y la lista `l2`.

---

## Conceptos teóricos clave

1. **Ciudadanos de primera clase**: En Scala, las funciones son valores que pueden asignarse a variables, pasarse como argumentos y retornarse como resultados.
2. **Función de orden superior**: Función que toma una o más funciones como parámetros y/o devuelve una función como resultado.
3. **Función anónima (lambda)**: Función sin nombre, definida en el lugar donde se usa. Permite escribir código más conciso.
4. **Currying**: Técnica que transforma una función con múltiples argumentos en una secuencia de funciones con un solo argumento. En Scala se implementa con múltiples listas de parámetros.
5. **Aplicación parcial**: Proceso de fijar algunos argumentos de una función, produciendo una nueva función con los argumentos restantes.
6. **Función predicado**: Función que toma un argumento y devuelve un valor booleano, usada comúnmente en operaciones de filtrado.

---

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scala |
|----------|-------------|------------------|
| **Función de orden superior** | Función que recibe o retorna otras funciones. | `def map(f: A => B): List[B]` |
| **Función anónima (lambda)** | Función sin nombre, definida inline. | `(x: Int) => x * 2` |
| **Currying** | Descomposición de una función multi‑argumento en una cadena de funciones de un argumento. | `def f(a: Int)(b: Int): Int` |
| **Aplicación parcial** | Fijar algunos argumentos de una función para obtener otra función con los argumentos restantes. | `val suma5 = sum(5)_` |
| **Función predicado** | Función que devuelve `Boolean`, usada para condiciones. | `(x: Int) => x > 0` |
| **Ciudadano de primera clase** | Las funciones pueden ser tratadas como cualquier otro valor. | Asignar una función a una variable: `val f = (x: Int) => x + 1` |

---

## Comentarios adicionales

- Las funciones de orden superior son fundamentales en la programación funcional y permiten un alto nivel de abstracción y reutilización de código.
- En Scala, la biblioteca estándar ofrece muchas funciones de orden superior como `map`, `filter`, `fold`, `reduce`, que operan sobre colecciones.
- El uso de funciones anónimas mejora la legibilidad cuando la lógica es simple y no justifica una definición separada.
- El currying facilita la composición de funciones y la creación de funciones especializadas a partir de funciones más generales.
- La aplicación parcial es útil para crear funciones específicas a partir de plantillas genéricas, promoviendo el principio DRY (Don't Repeat Yourself).