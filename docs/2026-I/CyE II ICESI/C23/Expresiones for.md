

Cuando queremos combinar diferentes colecciones (producto cartesiano) y luego aplicar `map` y `filter`, es necesario hacer una combinación de funciones de alto orden. Por ejemplo, si queremos tener una colección que contenga elementos cuyo primer componente sea el cuadrado de un número par y el segundo componente sea el cubo de un número múltiplo de 3, debemos realizar un proceso similar a este:

```scala
// Producto cartesiano entre (1 to 10) y (1 to 10) usando flatMap y map
(1 to 10).flatMap(x => 
  // Para cada x, generamos pares (x, y) con todos los y
  (1 to 10).map(y => (x, y))
)
// Filtramos: x debe ser par y y debe ser múltiplo de 3
.filter(x => x._1 % 2 == 0 && x._2 % 3 == 0)
// Transformamos: cuadrado de x y cubo de y
.map(x => (x._1 * x._1, x._2 * x._2 * x._2))
```

Esto es difícil de entender o modificar.
**Nota:** Cuando se operan colecciones entre sí, se debe usar `flatMap` para aplanar el resultado y obtener una sola colección en lugar de una colección de colecciones.

Para simplificar esto, podemos usar una **expresión `for`**, que combina de manera más legible los generadores (equivalentes a `map`/`flatMap`), los filtros (equivalentes a `filter`) y la transformación final (equivalente a `map`):

```scala
// Expresión for equivalente al código anterior
for {
  x <- 1 to 10          // Generador: itera sobre x (equivalente a flatMap)
  y <- 1 to 10          // Generador: itera sobre y (equivalente a map)
  if (x % 2 == 0 && y % 3 == 0)  // Filtro: solo pares donde x es par e y múltiplo de 3
} yield (x * x, y * y * y)  // Transformación: produce el resultado final
```

**Conceptos teóricos clave:**

- **Expresión `for`**: Es azúcar sintáctico que se traduce internamente a combinaciones de `map`, `flatMap`, `filter` (o `withFilter`) y `foreach`. Permite escribir código más legible cuando se trabaja con múltiples colecciones y transformaciones.
- **Generadores**: Las líneas con `<-` definen cómo se itera sobre las colecciones. El primer generador se traduce a `flatMap`, y los siguientes a `map`.
- **Filtros**: Las líneas con `if` dentro del `for` se traducen a `withFilter` (versión lazy de `filter`), que evita crear colecciones intermedias innecesarias.
- **`yield`**: Produce una nueva colección con los resultados transformados. Sin `yield`, el `for` se comporta como `foreach` (efectos secundarios).

**Tabla de resumen:**

| Concepto | Descripción | Ejemplo en código |
| :--- | :--- | :--- |
| **Expresión `for`** | Azúcar sintáctico que combina `map`, `flatMap` y `filter` de forma legible | `for { x <- col1; y <- col2; if cond } yield expr` |
| **Generador** | Define la iteración sobre una colección; el primero usa `flatMap`, los siguientes `map` | `x <- 1 to 10` |
| **Filtro** | Condición que deben cumplir los elementos; se traduce a `withFilter` | `if (x % 2 == 0)` |
| **`yield`** | Palabra clave que transforma y recolecta los resultados en una nueva colección | `yield (x * x, y * y * y)` |
| **Producto cartesiano** | Combinación de todos los elementos de dos o más colecciones | `for { x <- A; y <- B } yield (x, y)` |
| **`flatMap` vs `map`** | `flatMap` aplana colecciones anidadas; `map` transforma cada elemento | Ver código original |

**Comentarios adicionales:**

- Las expresiones `for` son especialmente útiles cuando se trabaja con **mónadas** como `Option`, `Try` o `Future`, no solo con colecciones. En esos casos, el comportamiento es similar pero con semántica de manejo de errores o efectos.
- La versión con `for` es generalmente preferible por su claridad, pero es importante entender la traducción a `map`/`flatMap`/`filter` para depurar o cuando se necesita un control más fino.
- El uso de `withFilter` (en lugar de `filter`) en las expresiones `for` evita crear colecciones intermedias, mejorando el rendimiento en colecciones grandes.
- Las expresiones `for` pueden anidarse y combinarse con patrones, lo que las hace muy poderosas para desestructurar datos complejos.