# Funciones de alto orden

Son funciones que reciben otras funciones como parámetros o retornan funciones como resultado.

Las funciones de alto orden nos permiten realizar un proceso llamado **abstracción funcional**, que es la capacidad de reescribir múltiples funciones que realizan tareas similares en una sola función generalizada. Consideremos el caso de operar números entre `a` y `b`:

$$
\begin{align}
a + (a+1) + (a+2) + \ldots + b \\
a^2 + (a+1)^2 + (a+2)^2 + \ldots + b^2 \\
a + (a+2) + (a+4) + \ldots + b \\ 
a \times (a+1) \times (a+2) \times \ldots \times b
\end{align}
$$

Para esto podríamos escribir cuatro funciones diferentes, pero estas tienen elementos en común que podemos abstraer.

```scala
object Ejemplo {
  // Función que suma todos los números desde a hasta b
  def sumaAB(a:Int, b:Int):Int = {
    @scala.annotation.tailrec
    def sumaABAux(a:Int, acc:Int):Int = {
      if (a > b) acc
      else sumaABAux(a+1, a+acc)
    }
    sumaABAux(a, 0)
  }

  // Función que suma los cuadrados desde a hasta b
  @scala.annotation.tailrec
  def sumaCAB(a:Int, b:Int, acc:Int=0):Int = {
    if (a > b) acc
    else sumaCAB(a+1, b, a*a + acc)
  }
  
  // Función que suma números alternados (de dos en dos) desde a hasta b
  @scala.annotation.tailrec
  def sumaAltAB(a:Int, b:Int, acc:Int = 0):Int = {
    if (a > b) acc
    else sumaAltAB(a+2, b, a + acc)
  }

  // Función que multiplica todos los números desde a hasta b
  @scala.annotation.tailrec
  def prodAB(a:Int, b:Int, acc:Int=1):Int = {      if (a > b) acc
    else prodAB(a+1, b, a * acc)
  }

  // Función de alto orden que generaliza todas las operaciones anteriores
  // f: función que determina el siguiente valor en la secuencia
  // g: función que combina el valor actual con el acumulador
  def operaAB(a:Int, b:Int, f:Int => Int, g:(Int, Int) => Int, acc:Int = 0):Int = {
    @scala.annotation.tailrec
    def operaABAux(a:Int, acc:Int):Int = {
      if (a > b) acc
      else operaABAux(f(a), g(a, acc))
    }
    operaABAux(a, acc)
  }

  def main(args: Array[String]): Unit = {
    println(sumaAB(0,10)) // n*(n+1)/2 = 10*11/2 = 55
    println(sumaCAB(0,10)) // n(n+1)(2n+1)/6 = 10*11*21/6 = 385
    println(sumaAltAB(0,10)) // 0+2+4+6+8+10 = 30 
    println(prodAB(1,6,1)) // 1*2*3*4*5*6 = 720
    
    // Usando la función de alto orden para replicar las operaciones anteriores
    println(operaAB(0,10, x => x+1, (a:Int, acc:Int) => a+acc)) // Suma normal
    println(operaAB(0,10, x => x+1, (a:Int, acc:Int) => a*a+acc)) // Suma de cuadrados
    println(operaAB(0,10, x => x+2, (a:Int, acc:Int) => a+acc)) // Suma alternada
    println(operaAB(1,6, x => x+1, (a:Int, acc:Int) => a*acc, 1)) // Producto
  }
}
```

Al utilizar `f` y `g` como parámetros (funciones que determinan el siguiente valor y cómo combinar con el acumulador), evitamos tener que escribir varias funciones específicas y logramos mayor reutilización de código.

## Funciones como valores de primera clase

En Scala, las funciones son **valores de primera clase**, lo que significa que pueden ser asignadas a variables, pasadas como argumentos y retornadas como resultados, al igual que cualquier otro valor.

```scala
scala> (a:Int, acc:Int) => a + acc
val res3: (Int, Int) => Int = $Lambda$1124/0x00007f4c08539440@46994f26

scala> (x:Int) => x + 1
val res4: Int => Int = $Lambda$1125/0x00007f4c0853a458@103478b8

scala> (a:Int, b:Int, acc:Int) => a*b + acc
val res5: (Int, Int, Int) => Int = $Lambda$1142/0x00007f4c0853b290@5a31abe9
```

Esta representación muestra funciones como valores, que pueden ser declaradas y utilizadas posteriormente:

```scala
scala> val f = (x:Int) => x + 1
val f: Int => Int = $Lambda$1143/0x00007f4c08584000@767cc126

scala> f(10)
val res6: Int = 11
```

## Conceptos teóricos adicionales

### Abstracción funcional
La abstracción funcional es un principio fundamental en programación funcional que permite identificar patrones comunes en diferentes funciones y encapsularlos en una función más general. Esto reduce la duplicación de código y mejora la mantenibilidad.

### Funciones de orden superior vs. funciones de primer orden
- **Funciones de primer orden**: Operan solo sobre datos primitivos (números, cadenas, etc.).
- **Funciones de orden superior**: Pueden recibir funciones como parámetros y/o retornar funciones como resultado.

### Ventajas de las funciones de alto orden
1. **Reutilización de código**: Una sola función puede adaptarse a múltiples escenarios.
2. **Expresividad**: El código se vuelve más declarativo y menos verboso.
3. **Composición**: Las funciones pequeñas y específicas pueden combinarse para crear comportamientos complejos.
4. **Flexibilidad**: El comportamiento de una función puede modificarse en tiempo de ejecución.

### Tail recursion en Scala
La anotación `@scala.annotation.tailrec` garantiza que la recursión sea optimizada por el compilador para evitar desbordamiento de pila. Esto es especialmente importante en programación funcional donde la recursión es común.

## Tabla de resumen

Concepto | Descripción | Ejemplo en Scala
--- | --- | ---
Función de alto orden | Función que recibe otras funciones como parámetros o retorna funciones como resultado | `def map(f: A => B): List[B]`
Abstracción funcional | Proceso de identificar patrones comunes y crear funciones generalizadas | `operaAB` que reemplaza `sumaAB`, `sumaCAB`, etc.
Funciones como valores | Las funciones pueden asignarse a variables, pasarse como argumentos y retornarse | `val f = (x:Int) => x + 1`
Lambda/ función anónima | Función sin nombre definida en el lugar donde se usa | `(x:Int) => x * 2`
Tail recursion | Recursión donde la llamada recursiva es la última operación, optimizable | `@tailrec def fact(n:Int, acc:Int=1):Int`
Composición funcional | Combinar funciones simples para crear comportamientos complejos | `val h = f compose g`

## Comentarios adicionales


1. **Patrones comunes**: Las funciones de alto orden como `map`, `filter` y `reduce` son ejemplos clásicos de este paradigma y están disponibles en la biblioteca estándar de Scala.

2. **Currying**: Técnica relacionada donde una función con múltiples parámetros se transforma en una secuencia de funciones con un solo parámetro cada una. Esto facilita la creación de funciones especializadas.

3. **Aplicaciones prácticas**: Las funciones de alto orden son fundamentales en procesamiento de colecciones, programación reactiva, y en la implementación de DSLs (Domain Specific Languages).

4. **Inmutabilidad**: En combinación con funciones de alto orden, la inmutabilidad de datos permite un razonamiento más sencillo sobre el código y facilita la paralelización.

5. **Type inference**: Scala infiere automáticamente los tipos de las funciones en muchos casos, reduciendo la verbosidad del código mientras mantiene la seguridad de tipos.

La adopción de funciones de alto orden representa un cambio de mentalidad desde un enfoque imperativo (cómo hacer las cosas) hacia uno declarativo (qué queremos hacer), lo que conduce a un código más limpio, modular y mantenible.