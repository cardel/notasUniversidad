# Tuplas en Scala

Las tuplas son agrupaciones de datos de diferentes tipos en Scala que son inmutables. Permiten agrupar o desagrupar valores según la necesidad, facilitando el manejo de múltiples valores como una sola unidad.

## Definición y acceso a elementos

```scala
scala> val t1 = (1,2,3)
val t1: (Int, Int, Int) = (1,2,3)

// Reconocimiento de patrones para desestructurar la tupla
scala> val (x,y,z) = t1
val x: Int = 1
val y: Int = 2
val z: Int = 3

// Acceso a elementos individuales mediante índices (comenzando en 1)
scala> t1._1
val res2: Int = 1

scala> t1._2
val res3: Int = 2

scala> t1._3
val res4: Int = 3

// Las tuplas en Scala pueden contener hasta 22 elementos
scala> (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22)
val res5: (Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int, Int) = (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22)

scala> (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23)
                                                                 ^
       error: tuples may not have more than 22 elements, but 23 given
```

## Reconocimiento de patrones con tuplas

Las tuplas permiten agrupar valores y capturarlos directamente con una expresión `match`, evitando `match` anidados que son difíciles de leer y mantener.

### Problema con match anidados
```scala
a match {
  case <caso1> => b match {
    // ...
  }
  case <caso2> => b match {
    // ...
  }
  // ...
  case <cason> => b match {
    // ...
  }
}
```

### Solución con tuplas
```scala
(a,b) match {
  case (<caso1>, ...) => // ...
  case (<caso1>, ...) => // ...
  // ...
  case (<cason>, ...) => // ...
}
```

Esta aproximación agrupa los casos y evita la anidación excesiva, mejorando la legibilidad del código.

## Ejemplo: Cálculo de distancia entre puntos

### Versión específica para enteros
```scala
object Distancia {

  // Función que calcula la distancia euclidiana entre dos puntos
  def distancia(p1: List[Int], p2: List[Int]): Double = {
    
    // Función auxiliar recursiva de cola para eficiencia
    @scala.annotation.tailrec
    def distanciaAux(p1: List[Int], p2: List[Int], acc: Double = 0.0): Double = {
      // Uso de tuplas en el pattern matching para comparar ambas listas simultáneamente
      (p1, p2) match {
        case (Nil, Nil) => acc  // Ambas listas vacías: cálculo completo
        case (_, Nil) => throw new Exception("p1 es más grande que p2")  // p1 tiene más elementos
        case (Nil, _) => throw new Exception("p2 es más grande que p1")  // p2 tiene más elementos
        case (x :: xs, y :: ys) => distanciaAux(xs, ys, acc + Math.pow(x - y, 2))  // Procesar elementos actuales
      }
    }
    
    Math.sqrt(distanciaAux(p1, p2))  // Raíz cuadrada de la suma de cuadrados
  }

  def main(arr: Array[String]): Unit = {
    println(distancia(List(0, 0), List(2, 2)))  // raíz(8) ≈ 2.828
    println(distancia(List(1, 1), List(4, 5)))  // 5.0
  }
}
```

### Versión genérica para diferentes tipos numéricos
```scala
object Distancia {

  // Función genérica que acepta cualquier tipo T y una función para calcular diferencias
  def distancia[T](p1: List[T], p2: List[T])(dif: (T, T) => Double): Double = {
    
    // Función auxiliar recursiva de cola
    @scala.annotation.tailrec
    def distanciaAux(p1: List[T], p2: List[T], acc: Double = 0.0): Double = {
      // Pattern matching con tuplas para manejar ambas listas
      (p1, p2) match {
        case (Nil, Nil) => acc  // Caso base: ambas listas procesadas
        case (_, Nil) => throw new Exception("p1 es más grande que p2")  // Error: dimensiones diferentes
        case (Nil, _) => throw new Exception("p2 es más grande que p1")  // Error: dimensiones diferentes
        case (x :: xs, y :: ys) => distanciaAux(xs, ys, acc + Math.pow(dif(x, y), 2))  // Procesar con función dif
      }
    }
    
    Math.sqrt(distanciaAux(p1, p2))  // Calcular raíz cuadrada final
  }

  def main(arr: Array[String]): Unit = {
    // Ejemplos con diferentes tipos numéricos
    println(distancia(List(0, 0), List(2, 2))((x: Int, y: Int) => x - y))  // raíz(8) ≈ 2.828
    println(distancia(List(1, 1), List(4, 5))((x: Int, y: Int) => x - y))  // 5.0
    println(distancia(List(1L, 1L), List(4L, 5L))((x: Long, y: Long) => x - y))  // Con Long
    println(distancia(List(1.0, 1.0), List(4.0, 5.0))((x: Double, y: Double) => x - y))  // Con Double
  }
}
```

## Conceptos teóricos adicionales

### Inmutabilidad
Las tuplas en Scala son inmutables, lo que significa que una vez creadas no pueden modificarse. Esta característica las hace seguras para programación concurrente y funcional.

### Tipado estático
Cada tupla tiene un tipo específico que depende del número y tipo de sus elementos. Por ejemplo, `(Int, String)` es un tipo diferente de `(String, Int)`.

### Uso común
- Retornar múltiples valores desde una función
- Agrupar datos relacionados temporalmente
- Simplificar pattern matching complejo
- Implementar funciones que requieren pares de valores

### Limitaciones
- Máximo 22 elementos (limitación de la JVM)
- No son colecciones en el sentido tradicional (no tienen métodos como `map`, `filter`)
- El acceso por índice (`_1`, `_2`, etc.) no es tan expresivo como nombres de campos

## Tabla de resumen

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| Definición | Agrupación inmutable de elementos de diferentes tipos | `val t = (1, "hola", true)` |
| Inmutabilidad | No se pueden modificar después de creadas | `t._1 = 5` // Error |
| Acceso por índice | Se accede con `_1`, `_2`, etc. (comienza en 1) | `t._1` retorna `1` |
| Desestructuración | Asignación directa a variables mediante pattern matching | `val (a, b, c) = t` |
| Límite de elementos | Máximo 22 elementos por tupla | `(1 to 22).toTuple` funciona, `(1 to 23).toTuple` error |
| Pattern matching | Permite comparar múltiples valores simultáneamente | `(x, y) match { case (1, 2) => ... }` |
| Tipado | El tipo depende del número y tipo de elementos | `(Int, String)` ≠ `(String, Int)` |
| Uso en funciones | Útil para retornar múltiples valores | `def div(a: Int, b: Int): (Int, Int) = (a/b, a%b)` |

## Comentarios adicionales

1. **Alternativas a tuplas**: Para estructuras de datos más complejas o con más de 22 elementos, considere usar case classes, que proporcionan nombres significativos a los campos y mayor flexibilidad.

2. **Interoperabilidad**: Las tuplas son especialmente útiles para interoperar con APIs Java que retornan múltiples valores, aunque en Scala se prefieren case classes para código interno.

3. **Rendimiento**: Las tuplas tienen un overhead mínimo y son eficientes en memoria comparadas con crear clases específicas para cada combinación de tipos.

4. **Scala 3**: En versiones recientes de Scala, las tuplas han sido mejoradas con características como:
   - Sintaxis más concisa para tipos de tuplas
   - Mejor soporte para tuplas de tamaño variable
   - Métodos adicionales para manipulación

5. **Buenas prácticas**:
   - Use tuplas para agrupaciones temporales de datos
   - Prefiera case classes para estructuras de datos con semántica de dominio
   - Limite el uso de tuplas grandes (más de 4-5 elementos)
   - Documente el significado de cada posición en tuplas usadas en APIs públicas

6. **Errores comunes**:
   - Confundir `_1` con índice 0 (en Scala comienza en 1)
   - Intentar modificar una tupla (son inmutables)
   - Usar tuplas donde se necesita comportamiento de colección (iteración, transformación)