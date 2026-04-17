# Reduce y Fold

## Reduce

Permite aplicar una operación binaria a los elementos de una colección para combinarlos en un solo valor resultante. Por ejemplo, sumarlos, restarlos o multiplicarlos.

```scala
// Lista de ejemplo
scala> val l = List(1,2,3,4,5)
val l: List[Int] = List(1, 2, 3, 4, 5)

// reduceLeft aplica la operación de izquierda a derecha
// Nota: el primer parámetro 'acc' es el acumulador, el segundo 'x' es el elemento actual
// Aquí se resta el acumulador del elemento actual: ((((1 - 2) - 3) - 4) - 5) NO, en realidad es:
// Paso a paso: acc=1, x=2 => 2-1=1; acc=1, x=3 => 3-1=2; acc=2, x=4 => 4-2=2; acc=2, x=5 => 5-2=3
scala> l.reduceLeft((acc,x) => x-acc)
val res25: Int = 3

// Aquí se resta el elemento actual del acumulador: ((((1 - 2) - 3) - 4) - 5) = -13
scala> l.reduceLeft((acc,x) => acc-x)
val res26: Int = -13

// Verificación de la operación anterior
scala> 1-2-3-4-5
val res27: Int = -13

// reduceRight aplica la operación de derecha a izquierda
// Equivalente a: (1 - (2 - (3 - (4 - 5)))) = 3
scala> l.reduceRight((acc,x) => acc-x)
val res29: Int = 3

// Verificación de reduceRight
scala> (1 - (2 - (3 - (4-5))))
val res30: Int = 3
```

**Importante**: `reduce` no funciona con listas vacías, ya que necesita al menos un elemento para comenzar la reducción.

```scala
scala> l
val res31: List[Int] = List(1, 2, 3, 4, 5)

// reduce sin especificar dirección (usa reduceLeft por defecto)
// Multiplicación de todos los elementos: 1 * 2 * 3 * 4 * 5 = 120
scala> l.reduce((acc,x) => x*acc)
val res32: Int = 120

// Error al intentar reducir una lista vacía
scala> List[Int]().reduce((acc,x) => acc+x)
java.lang.UnsupportedOperationException: empty.reduceLeft
  at scala.collection.IterableOnceOps.reduceLeft(IterableOnce.scala:864)
  at scala.collection.IterableOnceOps.reduceLeft$(IterableOnce.scala:862)
  at scala.collection.AbstractIterable.reduceLeft(Iterable.scala:936)
  at scala.collection.IterableOnceOps.reduce(IterableOnce.scala:823)
  at scala.collection.IterableOnceOps.reduce$(IterableOnce.scala:823)
  at scala.collecti
```

## Fold

A diferencia de `reduce`, `fold` requiere un **valor inicial** (elemento neutro o caso base) que se utiliza como punto de partida para la operación de plegado.

```scala
scala> l
val res37: List[Int] = List(1, 2, 3, 4, 5)

// Sintaxis de foldLeft: primer parámetro es el valor inicial, segundo es la función binaria
// Suma todos los elementos comenzando desde 0: 0 + 1 + 2 + 3 + 4 + 5 = 15
scala> l.foldLeft(0)((acc,x) => acc + x)
val res39: Int = 15

// fold funciona con listas vacías, retornando el valor inicial
scala> List[Int]().foldLeft(0)((acc,x) => acc + x)
val res40: Int = 0
```

El funcionamiento de `foldLeft` es similar a `reduceLeft` y `foldRight` es similar a `reduceRight`, pero con la ventaja de poder manejar colecciones vacías gracias al valor inicial.

## Conceptos teóricos importantes:

1. **Operación binaria**: Tanto `reduce` como `fold` requieren una función que tome dos parámetros del mismo tipo y retorne un valor del mismo tipo (asociativa).

2. **Asociatividad**: `reduceLeft` y `reduceRight` pueden dar resultados diferentes si la operación no es asociativa (como la resta).

3. **Valor inicial (fold)**: Proporciona un caso base para la operación y permite trabajar con colecciones vacías.

4. **Orden de evaluación**: 
   - `reduceLeft`/`foldLeft`: evalúa de izquierda a derecha
   - `reduceRight`/`foldRight`: evalúa de derecha a izquierda

## Tabla de resumen

| Concepto | Descripción | Valor inicial | Manejo de vacías | Ejemplo |
|----------|-------------|---------------|------------------|---------|
| `reduce` | Combina elementos con operación binaria | No tiene (usa primer elemento) | Lanza excepción | `List(1,2,3).reduce(_+_)` = 6 |
| `reduceLeft` | Combina de izquierda a derecha | No tiene (usa primer elemento) | Lanza excepción | `List(1,2,3).reduceLeft(_-_)` = -4 |
| `reduceRight` | Combina de derecha a izquierda | No tiene (usa último elemento) | Lanza excepción | `List(1,2,3).reduceRight(_-_)` = 2 |
| `fold` | Versión genérica de reduce | Requerido | Retorna valor inicial | `List(1,2,3).fold(0)(_+_)` = 6 |
| `foldLeft` | Plegado de izquierda a derecha | Requerido | Retorna valor inicial | `List(1,2,3).foldLeft(0)(_+_)` = 6 |
| `foldRight` | Plegado de derecha a izquierda | Requerido | Retorna valor inicial | `List(1,2,3).foldRight(0)(_+_)` = 6 |

## Comentarios adicionales

1. **Elección entre reduce y fold**: Use `fold` cuando pueda haber colecciones vacías o necesite un valor inicial específico. Use `reduce` cuando esté seguro de que la colección no está vacía.

2. **Asociatividad**: Para operaciones no asociativas (como resta o división), `reduceLeft` y `reduceRight` producen resultados diferentes. Elija según la semántica deseada.

3. **Rendimiento**: `foldLeft` suele ser más eficiente que `foldRight` en listas enlazadas porque es recursivo por cola (tail-recursive).

4. **Operaciones comunes predefinidas**: Scala ofrece métodos como `sum`, `product`, `min`, `max` que internamente usan `fold` o `reduce`.

5. **Uso con tipos no numéricos**: `reduce` y `fold` no se limitan a números. Pueden usarse con strings (`reduceLeft(_ + _)` para concatenar), listas, u otros tipos con operaciones binarias.

6. **Sintaxis con `_`**: Se puede usar el placeholder: `list.foldLeft(0)(_ + _)` equivale a `list.foldLeft(0)((acc, x) => acc + x)`.