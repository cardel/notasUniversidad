# Reduce y Fold en Scala

## Reduce

La operación `reduce` permite combinar los elementos de una lista usando una función binaria (de dos parámetros):

1. **Acumulador**: Es el valor acumulado a medida que se recorre la lista
2. **Elemento**: Es el valor actual que se está procesando (cabeza de la lista)

Esta operación puede realizarse en dos sentidos:

1. **Por la izquierda** (`reduceLeft`): Opera el primer elemento con el segundo, el resultado con el tercero, y así sucesivamente
2. **Por la derecha** (`reduceRight`): Opera el último elemento con el penúltimo, el resultado con el antepenúltimo, y así sucesivamente

Si la operación es asociativa, ambas direcciones darán el mismo resultado.

```scala
scala> val l = List(1,2,3,4,5,6)
val l: List[Int] = List(1, 2, 3, 4, 5, 6)

// Suma asociativa: mismo resultado en ambas direcciones
scala> l reduceLeft (_ + _)
val res18: Int = 21

scala> l reduceRight (_ + _)
val res19: Int = 21

// Resta NO asociativa: resultados diferentes
scala> l reduceLeft (_ - _)
val res20: Int = -19  // (((((1-2)-3)-4)-5)-6) = -19

scala> l reduceRight (_ - _)
val res21: Int = -3   // (1-(2-(3-(4-(5-6))))) = -3

// Error al intentar reducir una lista vacía
scala> List[Int]() reduceLeft(_ + _)
java.lang.UnsupportedOperationException: empty.reduceLeft
  at scala.collection.IterableOnceOps.reduceLeft(IterableOnce.scala:864)
  at scala.collection.IterableOnceOps.reduceLeft$(IterableOnce.scala:862)
  at scala.collection.AbstractIterable.reduceLeft(Iterable.scala:936)
  ... 38 elided
```

## Fold

La operación `fold` es similar a `reduce`, pero permite especificar un valor inicial (acumulador inicial), lo que permite trabajar con listas vacías. Un `fold` es una función de alto orden que espera un valor inicial y retorna una función que a su vez espera la función de reducción `(acumulador, elemento)`.

```scala
scala> (l foldLeft 0)_
val res23: ((Int, Int) => Int) => Int = $Lambda$1253/0x00007f2c005bae98@2d059642

// FoldLeft con valor inicial 0 y operación de suma
scala> (l foldLeft 0)(_ + _)
val res24: Int = 21

scala> (List[Int]() foldLeft 0)_
val res26: ((Int, Int) => Int) => Int = $Lambda$1256/0x00007f2c005bccd8@59226ee6

// FoldLeft con lista vacía - retorna el valor inicial
scala> (List[Int]() foldLeft 0)(_ + _)
val res27: Int = 0
```

Esto nos permite combinar listas y retornar valores que son combinaciones de sus elementos. Mientras que `map` aplica una función a cada elemento preservando el orden, la reducción combina todos los elementos en un solo valor.

```scala
scala> l
val res28: List[Int] = List(1, 2, 3, 4, 5, 6)

// Invertir una lista usando foldLeft
scala> (l foldLeft List[Int]())((acc,x)=> x::acc)
val res30: List[Int] = List(6, 5, 4, 3, 2, 1)
```

Observe que hemos construido una nueva lista cambiando el orden de los elementos.

Tener en cuenta que `foldRight` es más útil cuando tenemos operaciones que son asociativas por la derecha, como la construcción de una lista concatenando elementos.

```scala
scala> l
val res31: List[Int] = List(1, 2, 3, 4, 5, 6)

scala> val k = List(10,20,30)
val k: List[Int] = List(10, 20, 30)

// Error: orden incorrecto de parámetros (acumulador, elemento) vs (elemento, acumulador)
scala> (l foldRight k)((acc,x)=>x :: acc)
                                  ^
       error: value :: is not a member of Int

// Correcto: concatenar l al principio de k usando foldRight
scala> (l foldRight k)((x,acc)=>x :: acc)
val res33: List[Int] = List(1, 2, 3, 4, 5, 6, 10, 20, 30)

// Error similar con foldLeft - parámetros en orden incorrecto
scala> (l foldLeft k)((x,acc)=>x :: acc)
                                 ^
       error: value :: is not a member of Int
```

## FoldLeft vs FoldRight

1. **Operaciones asociativas**: Preferir `FoldLeft` porque es recursión de cola (evita stack overflow)
2. **Operaciones por la derecha** (como `::`): Preferir `foldRight`

## Conceptos teóricos adicionales

### Características de reduce
- **Requiere lista no vacía**: `reduce` lanza excepción en listas vacías
- **Sin valor inicial**: Opera directamente sobre los elementos de la lista
- **Asociatividad importante**: Para operaciones no asociativas, la dirección afecta el resultado

### Características de fold
- **Valor inicial**: Permite especificar un acumulador inicial
- **Maneja listas vacías**: Retorna el valor inicial cuando la lista está vacía
- **Flexibilidad**: Puede cambiar el tipo de retorno respecto al tipo de los elementos

### Orden de parámetros
- **foldLeft**: `(acumulador, elemento) => resultado`
- **foldRight**: `(elemento, acumulador) => resultado`

### Eficiencia y recursión
- **foldLeft**: Implementado con recursión de cola, más eficiente en memoria
- **foldRight**: Implementado con recursión normal, puede causar stack overflow en listas grandes

## Tabla de resumen

| Operación | Descripción | Valor inicial | Lista vacía | Asociatividad | Eficiencia |
|-----------|-------------|---------------|-------------|---------------|------------|
| `reduceLeft` | Combina elementos de izquierda a derecha | No tiene | Lanza excepción | Importante | Recursión de cola |
| `reduceRight` | Combina elementos de derecha a izquierda | No tiene | Lanza excepción | Importante | Recursión normal |
| `foldLeft` | Combina con valor inicial, izquierda a derecha | Requerido | Retorna valor inicial | Menos crítica | Recursión de cola |
| `foldRight` | Combina con valor inicial, derecha a izquierda | Requerido | Retorna valor inicial | Menos crítica | Recursión normal |

## Comentarios adicionales

1. **Elección entre reduce y fold**:
   - Use `reduce` cuando la lista nunca estará vacía y no necesita valor inicial
   - Use `fold` cuando necesite manejar listas vacías o especificar un valor inicial

2. **Sintaxis de placeholder**:
   ```scala
   l.foldLeft(0)(_ + _)    // Suma todos los elementos
   l.foldLeft(1)(_ * _)    // Producto de todos los elementos
   ```

3. **Cambio de tipo**:
   `fold` puede cambiar el tipo del resultado respecto al tipo de los elementos:
   ```scala
   // De List[Int] a String
   l.foldLeft("")(_ + _.toString)
   ```

4. **Operaciones comunes**:
   - `sum`: `list.foldLeft(0)(_ + _)`
   - `product`: `list.foldLeft(1)(_ * _)`
   - `max`: `list.foldLeft(Int.MinValue)(Math.max)`
   - `min`: `list.foldLeft(Int.MaxValue)(Math.min)`

5. **fold vs reduce en paralelismo**:
   - `fold` es más adecuado para operaciones paralelas porque el valor inicial se aplica a cada partición
   - `reduce` asume que la operación es asociativa y conmutativa para paralelización

6. **Errores comunes**:
   - Confundir el orden de parámetros entre `foldLeft` y `foldRight`
   - Usar `reduce` con listas potencialmente vacías
   - No considerar la no asociatividad de operaciones como resta y división

7. **Buenas prácticas**:
   - Use `foldLeft` por defecto por su eficiencia (recursión de cola)
   - Use `foldRight` solo cuando la operación sea naturalmente derecha-asociativa (como `::`)
   - Documente claramente el valor inicial en operaciones complejas
   - Considere usar métodos específicos como `sum`, `product`, `min`, `max` cuando estén disponibles