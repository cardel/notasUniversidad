## Funciones como valores y funciones anónimas

### Funciones que se pasan como valores

```scala
object Ejemplo {
  // Define una función que recibe:
  // - f: función que toma dos enteros y devuelve un booleano
  // - x, y: dos valores enteros
  // Devuelve: una función que toma un entero y devuelve un entero
  def funcion(f: (Int, Int) => Boolean, x: Int, y: Int): (Int) => Int = {
    if (f(x, y)) { 
      // Si f(x, y) es true, devuelve la función cuadrática
      (x) => Math.pow(x, 2).toInt
    } else { 
      // Si f(x, y) es false, devuelve la función raíz cuadrada
      (x) => Math.pow(x, 0.5).toInt
    }
  }
  
  def main(args: Array[String]): Unit = {
    // Muestra la función resultante (sin evaluar)
    println(funcion((x, y) => x > y, 4, 2))
    
    // Evalúa la función resultante con argumento 10
    println(funcion((x, y) => x > y, 4, 2)(10))
    
    // Evalúa la función alternativa con argumento 10
    println(funcion((x, y) => x < y, 4, 2)(10))
  }
}
```

**Explicación:**
1. La función `funcion` recibe tres parámetros: una función `f` de tipo `(Int, Int) => Boolean` y dos enteros `x` e `y`
2. Devuelve una función de tipo `(Int) => Int` que depende del resultado de evaluar `f(x, y)`
3. Si `f(x, y)` es verdadero, devuelve la función cuadrática $x^2$
4. Si `f(x, y)` es falso, devuelve la función raíz cuadrada $\sqrt{x}$
5. Es fundamental respetar los tipos de entrada y salida en el diseño

### Funciones anónimas

Las funciones anónimas son declaraciones de funciones como valores, donde la única operación posible es su evaluación. Scala generalmente infiere los tipos automáticamente.

**Sintaxis básica:**
```scala
(x, y) => x + y           // Inferencia automática de tipos
(x: Int, y: Int) => x + y // Tipos explícitos de entrada
```

**Ejemplos en REPL:**
```scala
scala> (x: Int, y: Int) => x + y
val res1: (Int, Int) => Int = $Lambda$2452/0x00007fe5945cd0e0@52035328

scala> val m: (Int, Int) => Int = (x, y) => x * y
val m: (Int, Int) => Int = $Lambda$2456/0x00007fe5945ce0f8@41289e88
```

**Características:**
- Los tipos de entrada pueden especificarse directamente en los parámetros
- El tipo de retorno generalmente se infiere o debe especificarse al asignar a una variable
- Permiten crear funciones directamente como valores sin necesidad de nombres
- La inferencia de tipos funciona en la mayoría de casos, pero puede requerir anotaciones explícitas en situaciones ambiguas