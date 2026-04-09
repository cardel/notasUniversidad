# Listas

Las listas son una colección recursiva que tiene dos casos:

1. Lista vacía: `Nil` o `List()`
2. Lista no vacía: compuesta por una cabeza (elemento) y una cola (lista)

En las listas se pueden aplicar funciones de orden superior como `map`, `filter` y `fold`.

# Jerarquía de Colecciones

Scala maneja tres grandes tipos de colecciones que heredan de la clase `Iterable`:

1. **Seq**: Colecciones ordenadas donde existe un primer elemento, un segundo elemento, etc.
2. **Set**: Colecciones sin duplicados y sin orden definido.
3. **Map**: Colecciones de pares clave-valor.

# Vector

Es una secuencia de acceso balanceado, lo que significa que acceder a cualquier posición del vector es rápido.

```scala
scala> val vec1 = Vector(1, 2, 3, 4, 5)
val vec1: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4, 5)

// Acceso por índice: O(1) en promedio
scala> vec1(0)
val res16: Int = 1

scala> vec1(4)
val res17: Int = 5
```

Para agregar elementos se usa `+:` al principio y `:+` al final. Estas operaciones devuelven un nuevo vector.

```scala
// Agregar al final
scala> vec1 :+ 10
val res18: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4, 5, 10)

// Agregar al inicio
scala> 20 +: vec1
val res19: scala.collection.immutable.Vector[Int] = Vector(20, 1, 2, 3, 4, 5)
```

**¿Cuándo es mejor usar Vector en lugar de List?**

1. Cuando se necesita acceso aleatorio a posiciones arbitrarias (Vector tiene acceso O(1) en promedio).
2. Cuando se agregan elementos al inicio o al final de manera frecuente.
3. List es ideal cuando se trabaja con recursión o reconocimiento de patrones, debido a su estructura cabeza-cola.

# Rango

Un rango es una colección que representa una secuencia de enteros espaciados de forma uniforme. Es eficiente en memoria porque no almacena todos los valores explícitamente.

```scala
// Rango desde 1 hasta 9 (exclusivo)
scala> 1 until 10
val res21: scala.collection.immutable.Range = Range 1 until 10

// Rango desde 1 hasta 10, saltando de 2 en 2
scala> 1 to 10 by 2
val res22: scala.collection.immutable.Range = inexact Range 1 to 10 by 2

// Rango desde 1 hasta 9, saltando de 2 en 2
scala> 1 until 10 by 2
val res23: scala.collection.immutable.Range = inexact Range 1 until 10 by 2

// Rango descendente
scala> 10 to 1 by -1
val res24: scala.collection.immutable.Range = Range 10 to 1 by -1

// Rango vacío porque el inicio es mayor que el fin sin step negativo
scala> 10 to 1
val res25: scala.collection.immutable.Range.Inclusive = empty Range 10 to 1
```

# Array

Es una secuencia ordenada de elementos mutable y de tamaño fijo. Es equivalente al array de Java y ofrece acceso por índice en tiempo constante O(1). A diferencia de `Vector` y `List`, los arrays son mutables.

# String

En Scala, un `String` es una secuencia de caracteres y se trata como una colección inmutable. Hereda de `CharSequence` y se puede usar con muchas operaciones de colecciones como `map`, `filter`, etc.

---

## Tabla de Resumen

Concepto | Tipo | Características Principales | Uso Recomendado | Mutabilidad
--- | --- | --- | --- | ---
Lista | Seq | Recursiva (cabeza-cola), acceso secuencial | Recursión, pattern matching, operaciones head/tail | Inmutable
Vector | Seq | Acceso balanceado O(1), buen rendimiento en actualizaciones | Acceso aleatorio, adición al inicio/final | Inmutable
Rango | Seq | Secuencia uniforme de enteros, eficiente en memoria | Iteraciones numéricas, bucles | Inmutable
Array | Seq | Tamaño fijo, acceso O(1), equivalente a Java | Interoperabilidad con Java, rendimiento crítico | Mutable
Set | Set | Sin duplicados, sin orden | Verificación de pertenencia, eliminación de duplicados | Inmutable/Mutable
Map | Map | Pares clave-valor, claves únicas | Diccionarios, asociaciones | Inmutable/Mutable
String | Seq[Char] | Secuencia de caracteres, inmutable | Manipulación de texto | Inmutable

**Comentarios adicionales:**

- Las colecciones en Scala se dividen en **inmutables** (por defecto) y **mutables** (ubicadas en `scala.collection.mutable`). Se recomienda usar las inmutables siempre que sea posible para evitar efectos secundarios.
- La **jerarquía de colecciones** permite polimorfismo: una función que recibe un `Iterable` puede trabajar con `List`, `Vector`, `Set`, etc.
- **Funciones de orden superior** (`map`, `filter`, `fold`, `flatMap`) son fundamentales para el estilo de programación funcional en Scala y se pueden aplicar a todas las colecciones.
- La **lazy evaluation** está disponible en colecciones como `Stream` y `LazyList` (Scala 2.13+), que calculan elementos bajo demanda.
- Para operaciones de **concatenación** frecuentes, considera `ListBuffer` o `ArrayBuffer` si necesitas mutabilidad, ya que `List` y `Vector` crean nuevas colecciones en cada operación.