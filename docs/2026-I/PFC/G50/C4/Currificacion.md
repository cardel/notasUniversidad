# Currificación

La currificación es un proceso en el cual transformamos funciones de 2 o más argumentos en funciones de un solo argumento que devuelven funciones. Este concepto proviene de la lógica matemática y fue introducido por el lógico Haskell Curry, de quien toma su nombre.

En programación funcional, la currificación permite descomponer una función que toma múltiples parámetros en una cadena de funciones que toman un solo parámetro cada una. Esto facilita la aplicación parcial de argumentos y la creación de nuevas funciones especializadas.

```scala
object Currying {
  // Función tradicional de dos argumentos
  def suma(a: Int, b: Int): Int = {
    a + b
  }

  // Función currificada usando sintaxis de múltiples listas de parámetros
  // Esta es la forma idiomática en Scala
  def sumaC(a: Int)(b: Int): Int = {
    a + b
  }

  // Función currificada explícita que retorna una función
  // Esto muestra explícitamente lo que hace la currificación
  def sumaD(a: Int): Int => Int = {
    def sumaDaux(b: Int): Int = {
      a + b
    }
    sumaDaux
  }

  def main(args: Array[String]): Unit = {
    println(suma(1, 3)) // 4 - llamada normal
    
    // Aplicación parcial: fijamos el primer argumento
    val sumaConUno = sumaC(1)_ // Retorna una función Int => Int
    println(sumaConUno) // Muestra la representación de la función
    
    println(sumaC(1)(3)) // 4 - llamada currificada completa
    
    println(sumaD(1)) // Muestra la función retornada
    println(sumaD(1)(3)) // 4 - llamada a la función retornada
  }
}
```

Observe que `suma` se puede currificar usando `sumaC`, que recibe `a` y retorna una función que espera `b`, y posteriormente evaluarla. Esto es equivalente a `sumaD`, que retorna directamente una función, sin la necesidad de colocar los tipos explícitamente (la sintaxis de `sumaC` es más concisa).

En general, esta técnica es ampliamente utilizada en programación funcional:

1. **Se utiliza en funciones de alto orden** como `foldLeft` o `foldRight` (operaciones de reducción), donde la currificación permite aplicar argumentos parcialmente.
2. **Permite la abstracción de datos** para operaciones binarias en notación infija (veremos en la próxima sesión).
3. **Facilita la composición de funciones**, ya que las funciones currificadas pueden combinarse más fácilmente.
4. **Habilita la aplicación parcial**, donde podemos "pre-configurar" algunos argumentos de una función para crear funciones más específicas.

## Conceptos teóricos adicionales

**Currificación vs. aplicación parcial**: 
- La currificación es la transformación de una función de múltiples argumentos en una cadena de funciones de un argumento.
- La aplicación parcial es el proceso de fijar algunos argumentos de una función para crear una nueva función con menos parámetros.

**Ventajas de la currificación**:
- Mayor modularidad y reutilización de código
- Facilita el razonamiento sobre funciones
- Permite crear funciones especializadas a partir de funciones generales
- Es fundamental para el estilo point-free (tacit programming)

**En Scala**: Scala soporta currificación de forma nativa a través de múltiples listas de parámetros. La función `sumaC(a: Int)(b: Int)` es automáticamente currificada por el compilador.

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scala | Aplicación |
|----------|-------------|------------------|------------|
| **Función tradicional** | Función que toma todos sus argumentos a la vez | `def f(a: Int, b: Int): Int` | Llamada directa: `f(1, 2)` |
| **Función currificada** | Función que toma un argumento y retorna otra función | `def f(a: Int)(b: Int): Int` | Llamada secuencial: `f(1)(2)` |
| **Aplicación parcial** | Fijar algunos argumentos para crear nueva función | `val g = f(1)_` | `g(2)` retorna 3 |
| **Sintaxis explícita** | Definición manual de función que retorna función | `def f(a: Int): Int => Int` | Muestra el mecanismo interno |
| **Ventaja principal** | Permite especialización y composición de funciones | Crear funciones específicas a partir de generales | Reutilización de código |

## Comentarios adicionales

1. **Eficiencia**: En algunos lenguajes, la currificación puede tener un costo en rendimiento debido a la creación de múltiples closures, pero en Scala las optimizaciones del compilador mitigan este efecto.

2. **Interoperabilidad**: En Scala, las funciones currificadas pueden convertirse fácilmente a tuplas y viceversa usando los métodos `.tupled` y `.curried` en funciones.

3. **Uso en APIs**: Muchas bibliotecas funcionales en Scala utilizan currificación para crear APIs más expresivas. Por ejemplo, en Spark, muchas transformaciones usan este patrón.

4. **Relación con tipos de datos algebraicos**: La currificación está relacionada con el isomorfismo de Curry-Howard, que conecta sistemas de tipos con lógica proposicional.

5. **En otros paradigmas**: Aunque originada en programación funcional, la currificación se ha adoptado en otros paradigmas. Por ejemplo, en JavaScript se usa frecuentemente con librerías como Lodash y Ramda.

6. **Práctica común**: En Scala, es común usar guiones bajos (`_`) para indicar aplicación parcial cuando se trabaja con funciones currificadas, como se muestra en `sumaC(1)_`.