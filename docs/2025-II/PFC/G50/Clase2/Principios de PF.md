La programación funcional es un paradigma de programación que tiene los siguientes elementos:

1. Funciones determinan la programación, se orienta a las funciones y las relaciones entre ellas
2. Tenemos ligaduras o nombres **que no cambian durante la ejecución**
3. El uso de diferentes estrategias para resolver problemas, entre ellas tenemos el **reconocimiento de patrones, expresiones for, evaluación perezosa, entre otras.**
4. Abstracción funcional: Utilizar diferentes herramientas para resolver problemas desde un alto nivel

Diferentes lenguajes de programación funcionales
1. Haskell
2. Earlang
3. Clojure
4. Lisp / Racket
5. Scala <-- Multiparadigma

# Scala
Está basado en java, es una capa encima de Java, para el curso vamos a tener:
1. Java 17
2. Scala 2.3

## Declaración de clases

```scala
// Definición de clase con parámetros de constructor (inmutables por defecto)
class Ejemplo(campo1:Int, campo2:Boolean) {

  // Método que devuelve el valor del campo1 (getter)
  def getCampo1():Int = {
    campo1
  }

  // Método que realiza una operación usando campo1 y un parámetro
  def operacion(campo3:Int):Int = {
    campo1 + campo3
   }
}
```

**Explicación:**

Esta clase Scala muestra conceptos de programación funcional:
- Los parámetros del constructor (`campo1`, `campo2`) son inmutables por defecto
- Los métodos son funciones que operan sobre los campos de la clase
- `getCampo1()` es un método accesor que devuelve el valor del campo
- `operacion()` demuestra cómo los métodos pueden tomar parámetros y combinarlos con los campos de la clase
- La inmutabilidad de los campos promueve un estilo funcional donde el estado no cambia después de la creación

## Declaración de clases estáticas

```scala
// Objeto singleton o una clase estática que contiene el punto de entrada del programa
object Main {
  
  // Método principal (punto de entrada de la aplicación)
  def main(args: Array[String]): Unit = {
    
    // Creación de una instancia de la clase Ejemplo
    val ejemploObj:Ejemplo  = new Ejemplo(2,true)
    
    // Imprime la representación en string del objeto (por defecto)
    println(ejemploObj)
    
    // Llama al método operacion con parámetro 5 e imprime el resultado
    println(ejemploObj.operacion(5))
  }
}
```

**Explicación:**

Este objeto `Main` demuestra:
- `object` crea un singleton (única instancia)
- `main` es el método de entrada estándar en aplicaciones Scala
- Se crea una instancia de `Ejemplo` usando `new` con parámetros concretos
- Las llamadas a métodos muestran cómo interactuar con los objetos creados
- Los resultados se imprimen para verificar el comportamiento
# Listas
Son colecciones de elementos del mismo TIPO
Una lista puede ser
- Vacía (Empty o List())
- No vacia: Tiene dos partes
	- Cabeza: Del tipo de la lista
	- Cola: Que es siempre una lista
```scala
// Objeto para demostrar operaciones básicas con listas
object Listas {
  def main(args: Array[String]): Unit = {
    // Creación de una lista inmutable de enteros
    val lista:List[Int] = List(1,2,3,4,5)
    
    // Accede al primer elemento de la lista
    println(lista.head) // Imprime el primer elemento de la lista
    
    // Obtiene la lista sin el primer elemento
    println(lista.tail) // Imprime la lista sin el primer elemento
    
    // Accede al primer elemento del tail (segundo elemento original)
    println(lista.tail.head)
    
    // Obtiene la lista sin los dos primeros elementos
    println(lista.tail.tail)
    
    // Lista sin los tres primeros elementos
    println(lista.tail.tail.tail) // Lista(4,5)
    
    // Lista sin los cuatro primeros elementos
    println(lista.tail.tail.tail.tail) // Lista(5)
    
    // Lista vacía (sin elementos)
    println(lista.tail.tail.tail.tail.tail) // Empty List
  }
}
```

**Explicación:**

Este código muestra el patrón funcional de recursión estructural en listas:
- Las listas en Scala son inmutables y estructuradas como listas enlazadas
- `head` devuelve el primer elemento
- `tail` devuelve el resto de la lista (sin el head)
- Las operaciones sucesivas de `tail` permiten recorrer la lista
- El caso base es la lista vacía (`Nil`) cuando no quedan elementos

