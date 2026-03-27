# Map y Filter en Scala

## Map

La función `map` permite tomar una lista y aplicar una función de transformación a cada uno de sus elementos. Esto implica que el tipo de la lista de salida no necesariamente es el mismo que el tipo de la lista de entrada, ya que la función de transformación puede cambiar el tipo de los elementos.

```scala
scala> val l = List(1,2,3,4)
val l: List[Int] = List(1, 2, 3, 4)

// Multiplicar cada elemento por 2 (mismo tipo Int)
scala> l map (x => x*2)
val res0: List[Int] = List(2, 4, 6, 8)

// Multiplicar por 2.0, cambiando el tipo a Double
scala> l map (x => x*2.0)
val res1: List[Double] = List(2.0, 4.0, 6.0, 8.0)

// Multiplicar por 2L, cambiando el tipo a Long
scala> l map (x => x*2L)
val res2: List[Long] = List(2, 4, 6, 8)

// Crear strings repetidos, cambiando el tipo a String
scala> l map (x => "x"*x)
val res3: List[String] = List(x, xx, xxx, xxxx)

// Evaluar condición, cambiando el tipo a Boolean
scala> l map (x => x % 3 == 0)
val res4: List[Boolean] = List(false, false, true, false)

// Crear tuplas, cambiando el tipo a (Int, String)
scala> l map (x => (x,"x"*x))
val res5: List[(Int, String)] = List((1,x), (2,xx), (3,xxx), (4,xxxx))
```

## Filter

La función `filter` toma una lista y retorna una nueva lista que contiene solo los elementos que cumplen con una condición específica (predicado). La función `filterNot` hace lo contrario: retorna los elementos que NO cumplen la condición.

```scala
scala> l
val res6: List[Int] = List(1, 2, 3, 4)

// Filtrar elementos pares
scala> l filter (x => x%2==0)
val res7: List[Int] = List(2, 4)

// Filtrar elementos que NO son pares (equivalentes a impares)
scala> l filterNot (x => x%2==0)
val res8: List[Int] = List(1, 3)

// Tomar elementos mientras se cumpla la condición (se detiene al primer false)
scala> l takeWhile (x => x%2==0)
val res9: List[Int] = List()  // Primer elemento (1) no cumple, retorna lista vacía

// Eliminar elementos mientras se cumpla la condición
scala> l dropWhile (x => x%2==0)
val res10: List[Int] = List(1, 2, 3, 4)  // Primer elemento (1) no cumple, retorna toda la lista

// Tomar elementos mientras sean impares
scala> l takeWhile (x => x%2!=0)
val res11: List[Int] = List(1)  // Se detiene en el 2 que es par

// Eliminar elementos mientras sean impares
scala> l dropWhile (x => x%2!=0)
val res12: List[Int] = List(2, 3, 4)  // Elimina el 1, luego retorna el resto

// Dividir la lista en dos partes: elementos que cumplen y el resto
scala> l span (x => x%2 == 0)
val res14: (List[Int], List[Int]) = (List(),List(1, 2, 3, 4))  // Tupla con (cumplen, resto)

// Dividir la lista en impares y el resto
scala> l span (x => x%2 != 0)
val res15: (List[Int], List[Int]) = (List(1),List(2, 3, 4))  // (impares iniciales, resto)

// Particionar la lista en dos listas: elementos que cumplen y que no cumplen
scala> l partition (x => x%2 == 0)
val res17: (List[Int], List[Int]) = (List(2, 4),List(1, 3))  // (pares, impares)
```

## Conceptos teóricos adicionales

### Características de map
- **Transformación de tipos**: `map` puede cambiar el tipo de los elementos de la colección
- **Inmutabilidad**: Retorna una nueva colección sin modificar la original
- **Orden preservado**: Mantiene el orden original de los elementos
- **Evaluación perezosa**: En colecciones como `Stream` o `LazyList`, la transformación se aplica solo cuando se necesita

### Características de filter
- **Predicado**: La función debe retornar un `Boolean` (true/false)
- **Completitud**: Evalúa todos los elementos de la colección
- **Inmutabilidad**: Crea una nueva colección sin modificar la original

### Diferencias clave entre funciones relacionadas
- **filter vs filterNot**: Complementarios, uno selecciona elementos que cumplen, el otro los que no cumplen
- **takeWhile vs filter**: `takeWhile` se detiene al primer elemento que no cumple, `filter` evalúa todos
- **span vs partition**: `span` divide en elementos iniciales que cumplen y el resto; `partition` divide en todos los que cumplen vs todos los que no cumplen

### Notación de punto vs notación infija
Scala permite ambas notaciones:
```scala
// Notación de punto (más común en otros lenguajes)
l.map(x => x*2)
l.filter(x => x%2==0)

// Notación infija (más idiomático en Scala)
l map (x => x*2)
l filter (x => x%2==0)
```

## Tabla de resumen

| Función | Descripción | Tipo de retorno | Comportamiento clave |
|---------|-------------|-----------------|----------------------|
| `map` | Aplica una función de transformación a cada elemento | `List[B]` donde `B` es el tipo de retorno de la función | Puede cambiar el tipo de los elementos |
| `filter` | Selecciona elementos que cumplen un predicado | `List[A]` (mismo tipo) | Evalúa todos los elementos |
| `filterNot` | Selecciona elementos que NO cumplen un predicado | `List[A]` (mismo tipo) | Complemento de `filter` |
| `takeWhile` | Toma elementos mientras se cumpla la condición | `List[A]` (mismo tipo) | Se detiene al primer `false` |
| `dropWhile` | Elimina elementos mientras se cumpla la condición | `List[A]` (mismo tipo) | Se detiene al primer `false` |
| `span` | Divide la lista en dos: elementos iniciales que cumplen y el resto | `(List[A], List[A])` | Similar a `(takeWhile, dropWhile)` |
| `partition` | Divide la lista en dos: todos los que cumplen vs todos los que no | `(List[A], List[A])` | Evalúa todos los elementos |

## Comentarios adicionales

1. **Composición de operaciones**: `map` y `filter` se pueden encadenar para crear transformaciones complejas:
   ```scala
   l.filter(_ % 2 == 0).map(_ * 2)  // Doble de los números pares
   ```

2. **Sintaxis de placeholder**: Para funciones simples, se puede usar la sintaxis `_`:
   ```scala
   l.map(_ * 2)        // Equivalente a: l.map(x => x*2)
   l.filter(_ % 2 == 0) // Equivalente a: l.filter(x => x%2==0)
   ```

3. **Eficiencia**: Tanto `map` como `filter` tienen complejidad O(n) y crean nuevas colecciones. Para operaciones en cadena, considere usar `view` para evaluación perezosa:
   ```scala
   l.view.filter(_ % 2 == 0).map(_ * 2).toList
   ```

4. **Applicable a otras colecciones**: Estas operaciones no son exclusivas de `List`, también están disponibles en `Array`, `Vector`, `Set`, `Map`, y otras colecciones de Scala.

5. **Relación con for-comprehensions**: Las operaciones `map` y `filter` tienen equivalencia con las for-comprehensions:
   ```scala
   // Con map y filter
   l.filter(_ % 2 == 0).map(_ * 2)
   
   // Equivalente con for-comprehension
   for (x <- l if x % 2 == 0) yield x * 2
   ```

6. **Errores comunes**:
   - Olvidar que `filter` retorna una nueva colección (no modifica la original)
   - Confundir `takeWhile` con `filter` (el primero se detiene al primer false)
   - Usar `map` cuando se necesita `filter` (transformar vs seleccionar)

7. **Buenas prácticas**:
   - Use nombres descriptivos en las funciones lambda cuando la lógica es compleja
   - Prefiera la sintaxis de placeholder (`_`) para operaciones simples
   - Considere usar for-comprehensions para mejorar la legibilidad de operaciones encadenadas
   - Tenga en cuenta el tipo de retorno al usar `map` con funciones que cambian el tipo