# Resumen de conceptos de programación funcional y Scala

## Introducción a Scala

Scala es un lenguaje de programación multiparadigma que combina características de programación imperativa, orientada a objetos, basada en eventos, funcional y concurrente. En este contexto, nos enfocamos principalmente en el paradigma funcional.

## Principios fundamentales de programación funcional

1. **Inmutabilidad:** Se utilizan valores inmutables (`val`) en lugar de variables mutables (`var`). Una vez asignado un valor, no puede cambiar.
2. **Expresiones sobre instrucciones:** Todo en Scala es una expresión que retorna un valor, incluyendo bloques de código.
3. **Recursión:** En lugar de usar bucles iterativos, se emplea recursión para procesar estructuras de datos.
4. **Funciones como ciudadanos de primera clase:** Las funciones pueden asignarse a variables, pasarse como argumentos y retornarse como resultados.

## Conceptos clave de Scala

### Declaraciones básicas

```scala
// Función que recibe parámetros y retorna un valor
def funcion(a: Int, b: Int): Int = {
    // Cuerpo de la función
    a + b  // Última expresión es el valor retornado
}

// Valor inmutable (equivalente a 'final' en Java)
val valorInmutable = 10

// Función sin parámetros (se evalúa cada vez que se llama)
def valorCalculado = 5 * 2
```

### Object en Scala

En Scala, `object` define una clase singleton (estática), con una sola instancia en todo el programa. Esto es necesario para el método `main`, que debe estar en un objeto.

## Comparación con Java

### Paradigma imperativo vs. funcional

**Java (imperativo/OO):**
- Variables mutables (`int a = 5; a = 10;`)
- Bucles iterativos (`for`, `while`)
- Control de flujo explícito (`return`, `break`, `continue`)
- Efectos secundarios permitidos

**Scala (funcional):**
- Valores inmutables (`val a = 5`)
- Recursión en lugar de bucles
- Sin control de flujo explícito (sin `return`, `break`)
- Minimización de efectos secundarios

### Ejemplo comparativo: Fibonacci

**Java (imperativo):**
```java
public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}
```

**Scala (funcional con recursión de cola):**
```scala
import scala.annotation.tailrec

def fibonacci(n: Int): Int = {
    @tailrec
    def loop(acc: Int, prev: Int, n: Int): Int = {
        if (n <= 0) acc
        else loop(prev, acc + prev, n - 1)
    }
    loop(0, 1, n)
}
```

## Conceptos teóricos adicionales

### 1. Transparencia referencial
Una función es referencialmente transparente si puede reemplazarse por su valor sin cambiar el comportamiento del programa. Esto es fundamental en programación funcional.

### 2. Funciones de orden superior
Funciones que toman otras funciones como parámetros o retornan funciones como resultado.

### 3. Pattern matching
Mecanismo para descomponer datos basado en patrones, más poderoso que los `switch` de Java.

### 4. Case classes
Clases inmutables optimizadas para pattern matching y comparación estructural.

### 5. For-comprehensions
Sintaxis declarativa para trabajar con colecciones, similar a los "list comprehensions" de otros lenguajes funcionales.

## Tabla de resumen de conceptos

Concepto | Descripción | Ejemplo Scala | Equivalente Java
--- | --- | --- | ---
`val` | Valor inmutable (no reasignable) | `val x = 10` | `final int x = 10;`
`var` | Variable mutable (evitar en FP) | `var y = 20` | `int y = 20;`
`def` | Definición de método/función | `def suma(a:Int,b:Int)=a+b` | `int suma(int a, int b) { return a+b; }`
`object` | Clase singleton (una instancia) | `object App { ... }` | Clase con todos métodos estáticos
Inferencia de tipos | Compilador deduce tipos | `val lista = List(1,2,3)` | No disponible (Java 10+ tiene `var`)
Funciones de orden superior | Funciones que operan sobre funciones | `lista.map(_ * 2)` | Streams API (Java 8+)
Recursión | Función que se llama a sí misma | `def fact(n:Int):Int=...` | Similar, pero menos común
Recursión de cola | Optimización para recursión | `@tailrec def loop(...)` | No soportada directamente
Pattern matching | Descomposición basada en patrones | `x match { case 1 => ... }` | `switch` (limitado)
Case class | Clase inmutable para datos | `case class Persona(nombre:String)` | `record` (Java 14+)
Colecciones inmutables | Estructuras que no modifican estado | `List(1,2,3)` | `Collections.unmodifiableList()`
For-comprehension | Sintaxis declarativa para colecciones | `for(x<-lista)yield x*2` | Streams API

## Comentarios adicionales

### 1. Ventajas de la programación funcional
- **Código más predecible:** Sin efectos secundarios, es más fácil razonar sobre el código
- **Facilidad para pruebas:** Funciones puras son más fáciles de probar unitariamente
- **Concurrencia más segura:** La inmutabilidad elimina condiciones de carrera
- **Composición:** Las funciones puras se componen fácilmente

### 2. Desafíos en la transición
- **Cambio de mentalidad:** De imperativo a declarativo
- **Curva de aprendizaje:** Conceptos como monads, functors, etc.
- **Depuración:** Stack traces con recursión pueden ser menos intuitivas
- **Performance:** La inmutabilidad puede tener overhead de memoria

### 3. Aplicaciones prácticas
- **Procesamiento de datos:** Apache Spark (escrito en Scala)
- **Sistemas concurrentes:** Akka framework
- **APIs web:** Play Framework
- **Scripting y herramientas:** sbt (Scala Build Tool)

### 4. Mejores prácticas
1. **Preferir `val` sobre `var`:** Solo usar `var` cuando sea estrictamente necesario
2. **Usar funciones puras:** Minimizar efectos secundarios
3. **Aprovechar la inferencia de tipos:** Pero ser explícito en APIs públicas
4. **Utilizar recursión de cola:** Con `@tailrec` para optimización


### 5. Recursos para profundizar
- **Libros:** "Programming in Scala" (Martin Odersky), "Functional Programming in Scala"
- **Cursos:** "Functional Programming Principles in Scala" (Coursera)
- **Comunidad:** Scala Center, Scala Users groups
- **Herramientas:** sbt, ScalaTest, IntelliJ IDEA con plugin Scala

### 6. Relación con ejercicios anteriores
Los ejercicios vistos en [[Repaso conceptos]] ilustran el contraste entre el enfoque imperativo de Java y el enfoque funcional que se adopta en Scala. Mientras Java utiliza bucles anidados y mutabilidad, Scala favorecería soluciones basadas en recursión, funciones de orden superior y colecciones inmutables.