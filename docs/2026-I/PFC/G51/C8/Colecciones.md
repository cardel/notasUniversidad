# Colecciones en Scala

## Vector

Un Vector es una colección inmutable que permite acceso rápido a los elementos mediante índices. Internamente utiliza una estructura de árbol de ramificación ancha (wide branching tree), lo que proporciona un buen rendimiento tanto para operaciones de acceso aleatorio como para modificaciones. Al igual que las listas, los vectores son inmutables, por lo que cualquier operación que modifique el contenido devuelve un nuevo vector.

```scala
// Creación de un Vector con elementos del 1 al 5
scala> val v = Vector(1,2,3,4,5)
val v: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4, 5)

// Obtener el primer elemento del vector
scala> v.head
val res0: Int = 1

// Obtener todos los elementos excepto el primero
scala> v.tail
val res1: scala.collection.immutable.Vector[Int] = Vector(2, 3, 4, 5)

// Acceso por índice (acceso rápido O(log32(n)))
scala> v(2)
val res2: Int = 3

// Añadir un elemento al final del vector (crea un nuevo vector)
scala> v :+ 3
val res3: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4, 5, 3)

// Transformar cada elemento aplicando una función (elevar al cubo)
scala> v.map(x => x*x*x)
val res4: scala.collection.immutable.Vector[Int] = Vector(1, 8, 27, 64, 125)

// foldLeft con inicialización parcial (solo se pasa el valor inicial)
scala> v.foldLeft(0)_
val res6: ((Int, Int) => Int) => Int = $Lambda$1150/0x00007ffb1c585898@57df93c1

// Suma de todos los elementos usando foldLeft
scala> v.foldLeft(0)((acc,x) => acc+x)
val res7: Int = 15

// Multiplicación con acumulador inicial 0 (siempre da 0)
scala> v.foldLeft(0)((acc,x) => acc*x)
val res8: Int = 0

// Multiplicación correcta con acumulador inicial 1
scala> v.foldLeft(1)((acc,x) => acc*x)
val res9: Int = 120
```

## Rangos

Los rangos (Range) son secuencias de números enteros equidistantes. Son colecciones perezosas (lazy) que solo generan los elementos cuando se necesitan. Existen dos tipos principales: inclusivo (`to`) y exclusivo (`until`).

```scala
// Rango inclusivo del 0 al 10 (incluye el 10)
scala> val f = 0 to 10
val f: scala.collection.immutable.Range.Inclusive = Range 0 to 10

scala> f
val res10: scala.collection.immutable.Range.Inclusive = Range 0 to 10

// Rango exclusivo del 0 hasta el 10 (excluye el 10)
scala> val g = 0 until 10
val g: scala.collection.immutable.Range = Range 0 until 10

// Convertir rango inclusivo a lista
scala> f.toList
val res11: List[Int] = List(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// Convertir rango exclusivo a lista
scala> g.toList
val res12: List[Int] = List(0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

// Rango descendente con paso -1
scala> val h = 10 to 1 by -1
val h: scala.collection.immutable.Range = Range 10 to 1 by -1

// Convertir rango descendente a lista
scala> h.toList
val res13: List[Int] = List(10, 9, 8, 7, 6, 5, 4, 3, 2, 1)

// Rango vacío: no se puede crear rango ascendente con límite inferior mayor
scala> val h = 10 to 1
val h: scala.collection.immutable.Range.Inclusive = empty Range 10 to 1

// Lista vacía resultante
scala> h.toList
val res14: List[Int] = List()
```

## Array y String

Los Array y String en Scala son interoperables con Java, pero Scala les añade métodos de colecciones funcionales. Los Array son mutables pero de tamaño fijo, mientras que los String son inmutables.

```scala
// Creación de un Array de enteros
scala> val arr = Array(1,2,3,4,5,6)
val arr: Array[Int] = Array(1, 2, 3, 4, 5, 6)

// Creación de un String
scala> val s = "Hola mundo"
val s: String = Hola mundo

// Transformar cada elemento del array sumando 1
scala> arr.map(x => x+1)
val res15: Array[Int] = Array(2, 3, 4, 5, 6, 7)

// Operaciones con caracteres: suma de valores ASCII + 32
scala> s.map(x => x+32)
val res19: IndexedSeq[Int] = ArraySeq(104, 143, 140, 129, 64, 141, 149, 142, 132, 143)

// Resta de valores ASCII - 32
scala> s.map(x => x-32)
val res20: IndexedSeq[Int] = ArraySeq(40, 79, 76, 65, 0, 77, 85, 78, 68, 79)

// Conversión a caracteres después de sumar 32 (resultado inesperado por caracteres extendidos)
scala> s.map(x => (x+32).toChar)
val res22: String = h@

// Conversión redundante (ya son caracteres)
scala> s.map(x => x.toChar)
val res23: String = Hola mundo

// Otra conversión con resultado inesperado
scala> s.map(x => (x+32).toChar)
val res24: String = h@

// Suma de todos los valores ASCII de los caracteres en el string
scala> s.foldLeft(0)((acc,x) => x + acc)
val res25: Int = 967
```

Al igual que List y Vector, en Array y String podemos aplicar operaciones de alto orden como `map`, `filter` y `fold`/`reduce`. Es importante notar que `String` en Scala es tratado como una secuencia de caracteres (`Char`), lo que permite aplicar estas operaciones directamente sobre sus caracteres.

## Tabla de Resumen

Concepto | Tipo | Mutabilidad | Características Principales | Uso Típico | Complejidad Acceso
--- | --- | --- | --- | --- | ---
Vector | Colección secuencial | Inmutable | Acceso rápido por índice, buen rendimiento para operaciones aleatorias y modificaciones | Cuando se necesita acceso aleatorio frecuente y modificaciones | O(log32(n))
Rango (Range) | Secuencia numérica | Inmutable | Generación perezosa de secuencias aritméticas, eficiente en memoria | Iteraciones, generación de secuencias numéricas | O(1) para creación
Array | Colección indexada | Mutable (contenido), tamaño fijo | Interoperable con Java, acceso muy rápido por índice | Interoperación con Java, algoritmos de bajo nivel | O(1)
String | Secuencia de caracteres | Inmutable | Tratado como colección de Char, interoperable con Java | Manipulación de texto, procesamiento de cadenas | O(1) por índice

## Comentarios Adicionales

1. **Elección de colección**: La elección entre Vector, List y Array depende del uso. Vector es ideal para acceso aleatorio y modificaciones, List para operaciones al principio de la secuencia, y Array para interoperabilidad con Java o máximo rendimiento.

2. **Inmutabilidad**: Todas las colecciones mencionadas (excepto el contenido de Array) son inmutables. Esto favorece la programación funcional y la seguridad en concurrencia.

3. **Operaciones de alto orden**: Todas estas colecciones implementan operaciones como `map`, `filter`, `fold`, `reduce`, lo que permite un estilo de programación declarativo.

4. **Rendimiento de Vector**: Vector utiliza un árbol de ramificación ancha (32-ary tree) que proporciona un buen equilibrio entre acceso aleatorio y operaciones de actualización.

5. **Strings como colecciones**: En Scala, los String son tratados como colecciones de caracteres, lo que permite usar todas las operaciones funcionales directamente sobre ellos.

6. **Conversiones implícitas**: Array y String tienen conversiones implícitas a tipos de colección de Scala, lo que permite usar métodos como `map` y `filter` aunque originalmente sean tipos de Java.

7. **Rangos perezosos**: Los rangos no almacenan todos los valores en memoria, sino que los calculan bajo demanda, lo que los hace eficientes para secuencias grandes.