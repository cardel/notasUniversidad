Scala es un lenguaje de programación multiparadigma: imperativo, orientado a objetos, basado en eventos, funcional, concurrente, etc.

Nos vamos a enfocar en el paradigma funcional, por lo tanto debemos usar elementos como:

1. `def` o `val` para declarar funciones o valores inmutables; no podemos usar `var`.
2. Todo lo que se hace va a terminar en un valor.
3. Accedemos a las estructuras usando recursión.

## Anotaciones

1. **Object** es una clase estática, porque hay una sola instancia de esa clase en todo el programa; no se permite tener más instancias. Por esta razón, la clase que contiene el método `main` debe ser estática.
2. **Declaraciones:**

```scala
// Declaración de una función que recibe dos enteros y retorna un entero
def funcion(a: Int, b: Int): Int = {
    // muchas instrucciones
    // Va a retornar la última expresión evaluada
    a + b  // Esta sería la expresión retornada
}
```

```scala
// Declaración de un valor inmutable (equivalente a 'final' en Java)
def variableA = 5  // Esto es una función sin parámetros que siempre retorna 5
val variableB = 8  // Esto es un valor inmutable
```

## Conceptos teóricos adicionales

### Características principales de Scala

1. **Interoperabilidad con Java:** Scala corre en la JVM y puede usar bibliotecas Java directamente.
2. **Inferencia de tipos:** El compilador puede deducir tipos en muchas situaciones, reduciendo código boilerplate.
3. **Pattern matching:** Mecanismo poderoso para descomponer datos, similar a `switch` en otros lenguajes pero más expresivo.
4. **Case classes:** Clases especiales optimizadas para pattern matching y inmutabilidad.
5. **Traits:** Similar a interfaces en Java pero pueden contener implementación de métodos (mixin composition).
6. **For-comprehensions:** Sintaxis para trabajar con colecciones de manera declarativa.

### Programación funcional en Scala

1. **Funciones como ciudadanos de primera clase:** Las funciones pueden ser asignadas a variables, pasadas como argumentos y retornadas como resultados.
2. **Inmutabilidad por defecto:** Se favorece el uso de `val` sobre `var` para evitar efectos secundarios.
3. **Funciones puras:** Funciones que no tienen efectos secundarios y siempre retornan el mismo resultado para los mismos argumentos.
4. **Recursión:** En lugar de bucles, se usa recursión. Scala optimiza la recursión de cola con `@tailrec`.
5. **Colecciones inmutables:** Scala proporciona colecciones inmutables como `List`, `Set`, `Map` en el paquete `scala.collection.immutable`.

### Ejemplo de código Scala funcional

```scala
// Ejemplo de función recursiva para calcular factorial
def factorial(n: Int): Int = {
    if (n <= 1) 1
    else n * factorial(n - 1)
}

// Versión con recursión de cola (optimizada)
import scala.annotation.tailrec

def factorialTailRec(n: Int): Int = {
    @tailrec
    def loop(acc: Int, n: Int): Int = {
        if (n <= 1) acc
        else loop(acc * n, n - 1)
    }
    loop(1, n)
}

// Uso de funciones de orden superior
val numbers = List(1, 2, 3, 4, 5)
val doubled = numbers.map(x => x * 2)  // List(2, 4, 6, 8, 10)
val sum = numbers.foldLeft(0)(_ + _)   // 15
```

## Tabla de resumen de conceptos

Concepto | Descripción | Ejemplo en Scala
--- | --- | ---
`val` | Declara un valor inmutable (no puede reasignarse) | `val x = 10`
`var` | Declara una variable mutable (puede reasignarse) | `var y = 20` (evitar en programación funcional)
`def` | Declara un método o función | `def suma(a: Int, b: Int): Int = a + b`
`object` | Define una clase singleton (una sola instancia) | `object MiApp { def main(args: Array[String]): Unit = ... }`
Inferencia de tipos | El compilador deduce el tipo automáticamente | `val lista = List(1, 2, 3)` // List[Int]
Funciones de orden superior | Funciones que reciben o retornan otras funciones | `lista.map(x => x * 2)`
Pattern matching | Descomposición de datos basada en patrones | `x match { case 1 => "uno"; case _ => "otro" }`
Case class | Clase optimizada para pattern matching e inmutabilidad | `case class Persona(nombre: String, edad: Int)`
Trait | Similar a interfaz con implementación parcial | `trait Animal { def sonido: String }`
Recursión de cola | Recursión donde la llamada recursiva es la última operación | `@tailrec def loop(...): ...`
Colecciones inmutables | Estructuras de datos que no pueden modificarse después de creadas | `List(1, 2, 3)`, `Set(1, 2, 3)`, `Map("a" -> 1)`
For-comprehension | Sintaxis para trabajar con colecciones de manera declarativa | `for (x <- lista if x > 0) yield x * 2`

## Comentarios adicionales

1. **Transición de Java a Scala:** Para programadores Java, Scala puede parecer complejo inicialmente debido a su sintaxis concisa y capacidades funcionales. Sin embargo, Scala permite escribir código más expresivo y seguro, especialmente para procesamiento de datos y programación concurrente.

2. **Aplicaciones típicas de Scala:**
   - Procesamiento de datos a gran escala (Apache Spark está escrito en Scala)
   - Sistemas distribuidos y concurrentes
   - APIs web (usando frameworks como Akka HTTP, Play Framework)
   - Scripting y herramientas de línea de comandos

3. **Herramientas del ecosistema Scala:**
   - **sbt:** Herramienta de construcción principal
   - **ScalaTest, Specs2:** Frameworks de testing
   - **Cats, ZIO:** Bibliotecas para programación funcional pura
   - **Akka:** Toolkit para sistemas concurrentes y distribuidos

4. **Mejores prácticas en Scala funcional:**
   - Preferir `val` sobre `var` siempre que sea posible
   - Usar `Option`, `Either`, `Try` en lugar de `null` o excepciones para manejo de errores
   - Aprovechar la inferencia de tipos pero ser explícito en APIs públicas
   - Usar recursión de cola con `@tailrec` para evitar desbordamiento de pila
   - Aplicar principios de inmutabilidad y transparencia referencial

5. **Relación con los ejercicios en Java:** Los ejercicios vistos en [[Repaso conceptos]] pueden reescribirse en Scala de manera más concisa y funcional. Por ejemplo, la búsqueda de tripletas podría implementarse usando for-comprehensions y la serie de Fibonacci podría implementarse con streams/lazy evaluation para mayor eficiencia.

6. **Desafíos comunes:**
   - Curva de aprendizaje pronunciada para programadores imperativos
   - Compilación más lenta que Java en proyectos grandes
   - Necesidad de entender tanto programación funcional como orientada a objetos

7. **Recursos recomendados:**
   - "Programming in Scala" de Martin Odersky (creador de Scala)
   - "Functional Programming in Scala" (libro rojo)
   - Documentación oficial en scala-lang.org
   - Coursera: "Functional Programming Principles in Scala"# Solución del problema

1. Programe una función que genere todos 
los números entre n y m, n <= m, que cumplan 
a³ + b³ = c³ y  debe retornar una estructura que 
tenga todas las tuplas (a,b,c) que cumplen esto.
2. Genere un programa que me de la lista de
la serie de fibunnaci desde 0 hasta n. Recursivo

```scala
/*
 * This Scala source file was generated by the Gradle 'init' task.
 */
package taller

object App {

  def punto1(n:Int, m:Int):List[List[Int]] = {
    (for {
     a <- (n to m).toList
     b <- (n to m).toList
     c <- (n to m).toList
     if (a*a*a+b*b*b == c*c*c)
    } yield List(a,b,c)).toList

  }
  def fibunnacci(n:Int):Int = {
    if (n<=1) n
    else fibunnacci(n-1)+fibunnacci(n-2)
  }

  def listaFibunnacci(n:Int):List[Int] = {
    (0 to n).map(x => fibunnacci(x)).toList
  }

  def main(args: Array[String]): Unit = {
    println(punto1(1,100))
    println(listaFibunnacci(10))
  }

}
```