# Map y filter

Map aplica una función a cada elemento de una colección y retorna una nueva colección con los valores transformados por dicha función.

Una característica importante de `map` es que puede cambiar el tipo de la colección resultante. Por ejemplo, se puede transformar una `List[Int]` en una `List[String]`.

```scala
// Lista original de enteros del 1 al 20
val l: List[Int] = (1 to 20).toList

// Aplicando map para transformar cada número en una cadena de "x" repetida ese número de veces
// Resultado: List("x", "xx", "xxx", ...)
l.map(x => "x" * x)

// Similar al anterior, pero con la cadena "como vas"
l.map(x => "como vas" * x)

// Similar al anterior, pero con la cadena "america"
l.map(x => "america" * x)
```

Filter aplica una función predicado (que retorna `Boolean`) a cada elemento de una colección para determinar qué elementos se conservan en el resultado. Solo los elementos para los cuales la función retorna `true` son incluidos.

```scala
// Lista original
val l = (1 to 20).toList

// Elevar cada número al cuadrado
l.map(x => x * x)

// Filtrar los números cuyo cuadrado sea par
l.filter(x => x * x % 2 == 0)

// Filtrar los números cuyo cuadrado sea divisible por 3
l.filter(x => x * x % 3 == 0)

// filterNot hace lo contrario: conserva los elementos para los que el predicado es false
l.filterNot(x => x * x % 3 == 0)

// partition divide la lista en dos: una con los elementos que cumplen el predicado y otra con los que no
l.partition(x => x * x % 3 == 0)

// Accediendo a la primera tupla (elementos que cumplen)
l.partition(x => x * x % 3 == 0)._1

// Accediendo a la segunda tupla (elementos que no cumplen)
l.partition(x => x * x % 3 == 0)._2

// takeWhile toma elementos desde el inicio mientras se cumple el predicado
l.takeWhile(x => x * x % 3 == 0) // Retorna lista vacía porque el primer elemento (1) no cumple

// takeWhile con condición de cuadrado menor a 120
l.takeWhile(x => x * x < 120)

// dropWhile elimina elementos desde el inicio mientras se cumple el predicado
l.dropWhile(x => x * x < 120)

// span es similar a partition pero parte la lista en el primer elemento que no cumple el predicado
l.span(x => x * x < 120)
```

Las operaciones `map` y `filter` (junto con otras como `takeWhile`, `dropWhile`, `partition`, `span`) se pueden combinar para construir transformaciones más complejas.

```scala
// Aplicar map para convertir cada número en un booleano (verdadero si es menor a 5)
l.map(_ < 5)

// Equivalente a lo anterior, con sintaxis explícita
l.map(x => x < 5)

// Combinación: primero elevar al cuadrado, luego filtrar los resultados menores a 80
l.map(x => x * x).filter(_ < 80)

// Equivalente con sintaxis explícita en el filter
l.map(x => x * x).filter(x => x < 80)
```

## Tabla de resumen de conceptos

| Concepto | Descripción | Ejemplo clave |
|----------|-------------|---------------|
| `map` | Transforma cada elemento de una colección aplicando una función, pudiendo cambiar el tipo de dato resultante. | `List(1,2,3).map(_ * 2)` → `List(2,4,6)` |
| `filter` | Filtra elementos de una colección conservando solo aquellos que satisfacen un predicado (función que retorna `Boolean`). | `List(1,2,3,4).filter(_ % 2 == 0)` → `List(2,4)` |
| `filterNot` | Conserva los elementos que **no** cumplen el predicado. | `List(1,2,3,4).filterNot(_ % 2 == 0)` → `List(1,3)` |
| `partition` | Divide la colección en dos tuplas: la primera con elementos que cumplen el predicado, la segunda con los que no. | `List(1,2,3,4).partition(_ % 2 == 0)` → `(List(2,4), List(1,3))` |
| `takeWhile` | Toma elementos desde el inicio de la colección **mientras** se cumple el predicado. | `List(1,2,3,4).takeWhile(_ < 3)` → `List(1,2)` |
| `dropWhile` | Elimina elementos desde el inicio **mientras** se cumple el predicado, retornando el resto. | `List(1,2,3,4).dropWhile(_ < 3)` → `List(3,4)` |
| `span` | Similar a `partition`, pero divide la lista en el **primer elemento** que no cumple el predicado. | `List(1,2,3,4).span(_ < 3)` → `(List(1,2), List(3,4))` |
| **Composición** | Las operaciones se pueden encadenar para crear pipelines de transformación y filtrado. | `list.map(f).filter(g).takeWhile(h)` |

## Comentarios adicionales

- **Inmutabilidad**: Todas estas operaciones retornan una **nueva colección**; la original permanece inalterada.
- **Evaluación perezosa (lazy)**: En colecciones como `Stream` o `LazyList`, estas operaciones se evalúan solo cuando se necesita el resultado.
- **Legibilidad**: Encadenar `map`, `filter`, etc., permite escribir código declarativo y fácil de leer, expresando *qué* se quiere hacer más que *cómo*.
- **Rendimiento**: Cada operación intermedia crea una colección nueva. Para secuencias muy largas, considerar el uso de `view` para realizar las transformaciones de manera perezosa y evitar colecciones intermedias.
- **Uso de `_` (placeholder)**: La sintaxis `_` es azúcar sintáctica para funciones anónimas de un parámetro. Por ejemplo, `_.toString` equivale a `x => x.toString`.

El símbolo `=>` en la expresión `x => x + x` es el **operador de flecha** que separa los **parámetros** de la **cuerpo** en una **función anónima** (también llamada *lambda* o *función literal*) en Scala.

## Desglose de la sintaxis:

```
x     =>     x + x
│            │
└─ Parámetro └─ Cuerpo/expresión
```

### 1. **Parte izquierda (antes de `=>`)**:
   - `x` es el **parámetro** de la función.
   - Puede haber múltiples parámetros: `(x, y) => x + y`
   - Puede tener tipos explícitos: `(x: Int) => x * 2`

### 2. **Parte derecha (después de `=>`)**:
   - `x + x` es el **cuerpo** de la función.
   - Es la expresión que se evalúa y retorna cuando se llama la función.
   - En Scala, la última expresión del cuerpo es el valor de retorno (no se usa `return` explícito).

## Ejemplos en contexto:

```scala
// Función anónima que duplica un número
val duplicar = (x: Int) => x + x

// Usada con map
List(1, 2, 3).map(x => x + x)  // Resultado: List(2, 4, 6)

// Equivalente con sintaxis más explícita
List(1, 2, 3).map((x: Int) => { x + x })

// Múltiples parámetros
val sumar = (a: Int, b: Int) => a + b
```

## Diferencia con `_` (placeholder):

```scala
// Con función anónima explícita
List(1, 2, 3).map(x => x + x)

// Con placeholder (solo cuando el parámetro se usa una vez en el mismo orden)
List(1, 2, 3).map(_ + _)  // Error: necesita dos parámetros
List(1, 2, 3).map(_ * 2)  // Correcto: equivale a x => x * 2
```

## Características clave:

1. **Anónima**: No tiene nombre, se define en el lugar donde se usa.
2. **De primera clase**: Puede asignarse a variables, pasarse como argumento, retornarse como resultado.
3. **Inferencia de tipos**: Scala suele inferir los tipos de los parámetros automáticamente.
4. **Cierre léxico (closure)**: Puede capturar variables del ámbito exterior.

```scala
val factor = 3
List(1, 2, 3).map(x => x * factor)  // 'factor' es capturado del ámbito exterior
```

## Tabla de comparación:

| Sintaxis | Significado | Cuándo usarla |
|----------|-------------|---------------|
| `x => x + x` | Función anónima con parámetro `x` que retorna `x + x` | Cuando necesitas nombrar el parámetro para usarlo múltiples veces o con lógica compleja |
| `_ * 2` | Placeholder, equivalente a `x => x * 2` | Cuando el parámetro se usa una vez y en orden directo |
| `(a, b) => a + b` | Función con dos parámetros | Para funciones de múltiples parámetros |
| `{ x => val y = x*2; y + 1 }` | Cuerpo con múltiples expresiones | Cuando necesitas lógica más compleja con variables intermedias |

El operador `=>` es fundamental en la programación funcional en Scala, permitiendo crear funciones concisas directamente donde se necesitan, especialmente útil con métodos como `map`, `filter`, `reduce`, etc.