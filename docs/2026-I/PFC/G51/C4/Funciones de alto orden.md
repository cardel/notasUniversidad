# Funciones de orden superior

Las funciones que reciben otras funciones como parámetros o devuelven funciones como resultado se denominan **funciones de orden superior**. Estas funciones permiten realizar un proceso llamado **abstracción funcional**, que consiste en agrupar funciones que realizan procesos similares en una sola función general.

Por ejemplo, para realizar operaciones entre listas tenemos:

```scala
object AltoOrden {

  // Suma todos los elementos de una lista
  def sumarLista(l: List[Int]): Int = {
    @scala.annotation.tailrec
    def sumarListaAux(l: List[Int], acc: Int): Int = {
      if (l.isEmpty) acc
      else sumarListaAux(l.tail, l.head + acc)
    }
    sumarListaAux(l, 0)
  }

  // Suma los cuadrados de todos los elementos de una lista
  def sumarListaC(l: List[Int]): Int = {
    @scala.annotation.tailrec
    def sumarListaCAux(l: List[Int], acc: Int): Int = {
      if (l.isEmpty) acc
      else sumarListaCAux(l.tail, l.head * l.head + acc)
    }
    sumarListaCAux(l, 0)
  }

  // Multiplica todos los elementos de una lista
  def multiLista(l: List[Int]): Int = {
    @scala.annotation.tailrec
    def multiListaAux(l: List[Int], acc: Int): Int = {
      if (l.isEmpty) acc
      else multiListaAux(l.tail, l.head * acc)
    }
    multiListaAux(l, 1)
  }

  // Multiplica los cuadrados de todos los elementos de una lista
  def multiListaC(l: List[Int]): Int = {
    @scala.annotation.tailrec
    def multiListaCAux(l: List[Int], acc: Int): Int = {
      if (l.isEmpty) acc
      else multiListaCAux(l.tail, l.head * l.head * acc)
    }
    multiListaCAux(l, 1)
  }

  def main(args: Array[String]): Unit = {
    println(sumarLista(List(1, 2, 3)))    // 6
    println(sumarListaC(List(1, 2, 3)))   // 14
    println(multiLista(List(1, 2, 3)))    // 6
    println(multiListaC(List(1, 2, 3)))   // 36
  }
}
```

Como se observa, se implementa una función para cada operación solicitada. Sin embargo, estas funciones presentan una estructura muy similar entre sí.

**¿Es posible crear una única función que agrupe todas estas operaciones?** La respuesta es sí, utilizando funciones como parámetros de entrada:

```scala
// Función de orden superior que generaliza operaciones sobre listas
// l: lista de enteros
// f: función de transformación (Int => Int)
// g: función de combinación (Int, Int) => Int
// acc: valor inicial del acumulador (por defecto 0)
def Operar(l: List[Int], f: Int => Int, g: (Int, Int) => Int, acc: Int = 0): Int = {
  @scala.annotation.tailrec
  def OperarAux(l: List[Int], acc: Int): Int = {
    if (l.isEmpty) acc
    else OperarAux(l.tail, g(f(l.head), acc))
  }
  OperarAux(l, acc)
}

// Ejemplos de uso:
println(Operar(List(1, 2, 3), (x) => x, (x: Int, acc: Int) => x + acc))           // 6
println(Operar(List(1, 2, 3), (x) => x * x, (x: Int, acc: Int) => x + acc))       // 14
println(Operar(List(1, 2, 3), (x) => x, (x: Int, acc: Int) => x * acc, 1))        // 6
println(Operar(List(1, 2, 3), (x) => x * x, (x: Int, acc: Int) => x * acc, 1))    // 36
```

# Funciones anónimas

Las funciones anónimas son funciones que se declaran directamente como valores, sin asignarles un nombre. Estas funciones solo existen en el contexto donde se declaran y no son accesibles globalmente.

El objetivo principal es evitar escribir funciones que se utilizan pocas veces, generando así un código más claro y reducido.

```scala
scala> (x: Int) => x
val res0: Int => Int = $Lambda$1108/0x00007f7ac8529428@36525ab

scala> val f = (x: Int) => x
val f: Int => Int = $Lambda$1115/0x00007f7ac853a428@22c29aa8

scala> f
val res1: Int => Int = $Lambda$1115/0x00007f7ac853a428@22c29aa8

scala> f(10)
val res2: Int = 10
```

La sintaxis general para definir una función anónima es:

$(x_1: T_1, x_2: T_2, \dots, x_n: T_n) => E$

Donde:
- $x_i$ son los parámetros
- $T_i$ son los tipos de los parámetros
- $E$ es la expresión que define el cuerpo de la función

Ejemplo:

```scala
(x: Int, y: Int, z: Int, w: Boolean) => Int
```

# Conceptos teóricos adicionales

## Abstracción funcional
La abstracción funcional es un principio de programación que permite identificar patrones comunes en diferentes funciones y encapsularlos en una función más general. Esto reduce la duplicación de código y facilita el mantenimiento.

## Recursividad de cola (Tail Recursion)
Las funciones auxiliares en los ejemplos utilizan recursividad de cola, donde la llamada recursiva es la última operación que se ejecuta. Scala optimiza este tipo de recursión para evitar desbordamientos de pila.

## Funciones como ciudadanos de primera clase
En Scala, las funciones son tratadas como ciudadanos de primera clase, lo que significa que pueden ser asignadas a variables, pasadas como argumentos y devueltas como resultados de otras funciones.

## Funciones de orden superior comunes
En la biblioteca estándar de Scala existen funciones de orden superior predefinidas como `map`, `filter`, `reduce` y `fold`, que implementan patrones comunes de procesamiento de colecciones.

# Tabla de resumen

| Concepto | Definición | Ejemplo en Scala | Aplicación |
|----------|------------|------------------|------------|
| **Función de orden superior** | Función que recibe o devuelve otras funciones | `def Operar(l: List[Int], f: Int => Int, g: (Int, Int) => Int): Int` | Abstracción de patrones comunes |
| **Función anónima** | Función sin nombre, definida directamente como valor | `(x: Int) => x * x` | Uso puntual sin necesidad de declaración formal |
| **Abstracción funcional** | Proceso de generalizar funciones similares en una sola | Unificar `sumarLista`, `multiLista`, etc. en `Operar` | Reducción de duplicación de código |
| **Recursividad de cola** | Recursión donde la llamada recursiva es la última operación | `def sumarListaAux(l: List[Int], acc: Int): Int` | Optimización de memoria y prevención de StackOverflow |
| **Función como parámetro** | Pasar una función como argumento a otra función | `f: Int => Int` en `Operar` | Flexibilidad en el comportamiento de funciones |
| **Valor por defecto** | Valor inicial predefinido para un parámetro | `acc: Int = 0` en `Operar` | Simplificación de llamadas a funciones |

# Comentarios adicionales

1. **Ventajas de las funciones de orden superior**:
   - **Reutilización de código**: Patrones comunes se implementan una sola vez
   - **Flexibilidad**: El comportamiento puede variarse mediante funciones parámetro
   - **Expresividad**: Código más conciso y declarativo
   - **Mantenibilidad**: Cambios se realizan en un solo lugar

2. **Consideraciones de rendimiento**:
   - Las funciones anónimas pueden crear objetos adicionales en tiempo de ejecución
   - En Scala 3, muchas optimizaciones reducen este overhead
   - Para código crítico en rendimiento, considerar alternativas

3. **Relación con programación funcional**:
   - Las funciones de orden superior son fundamentales en la programación funcional
   - Permiten composición de funciones y construcción de DSLs (Domain Specific Languages)
   - Facilitan la implementación de monoides, mónadas y otros patrones funcionales

4. **Buenas prácticas**:
   - Nombrar claramente los parámetros que son funciones
   - Documentar el comportamiento esperado de las funciones parámetro
   - Utilizar tipos explícitos cuando mejore la legibilidad
   - Considerar el uso de funciones parcialmente aplicadas y currying

5. **Aplicaciones comunes**:
   - Procesamiento de colecciones (map, filter, reduce)
   - Manejo de errores (Try, Either)
   - Programación asíncrona (Futures, Promises)
   - Inyección de dependencias y estrategias