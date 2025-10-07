El día de hoy, vimos

1. Colecciones: Iterables: Vector, List, Array, String
2. Colecciones: No iterables: Set
3. Colecciones: Rangos, una colección de enteros que siguen un patron (incremento o decremento desde inicio hasta un final) to (inclusivo) until (exclusivo)
4. Operaciones de alto orden: exists, forall, empaquetar (zip y unzip) colecciones paralelas
5. Operaciones con flatMap que permite operar mas de una colección y retornar una colección (no una colección de colecciones) la operación de aplanar
6. Expresiones for: Que es una combinación de rangos, flatMap, map y filter
7. Sets son colecciones desorganizadas de elementos que no se repiten.

# Resumen de Conceptos de Colecciones en Scala

## Tabla de Conceptos Principales

| Concepto            | Descripción                       | Ejemplo                        | Complejidad/Notas        |
| ------------------- | --------------------------------- | ------------------------------ | ------------------------ |
| **Iterable**        | Raíz de todas las colecciones     | `Iterable(1,2,3)`              | Jerarquía base           |
| **Seq**             | Colecciones indexadas             | `List`, `Vector`, `Range`      | Acceso por posición      |
| **List**            | Estructura recursiva (head, tail) | `List(1,2,3)`                  | $O(n)$ acceso            |
| **Vector**          | Arreglo eficiente para acceso     | `Vector(1,2,3)`                | $O(1)$ acceso            |
| **Range**           | Secuencia de enteros uniformes    | `1 to 10`                      | Lazy evaluation          |
| **Array**           | Arreglo mutable                   | `Array(1,2,3)`                 | Interoperabilidad Java   |
| **Set**             | Colección sin orden ni duplicados | `Set(1,2,2,3)`                 | Operaciones de conjuntos |
| **Map**             | Colección clave-valor             | `Map("a"->1,"b"->2)`           | Diccionarios             |
| **flatMap**         | Aplana colecciones anidadas       | `list.flatMap(x => List(x,x))` | Evita nested collections |
| **forall**          | Cuantificador universal           | `list.forall(_ > 0)`           | $\forall x P(x)$         |
| **exists**          | Cuantificador existencial         | `list.exists(_ == 5)`          | $\exists x P(x)$         |
| **zip**             | Combina dos colecciones           | `list1 zip list2`              | Pares ordenados          |
| **expresiones for** | Sintaxis declarativa              | `for(x<-xs;y<-ys)yield(x,y)`   | Traducción a flatMap     |

## Conceptos Adicionales del Curso Odersky

### 1. **Inmutabilidad por Defecto**
- Las colecciones de Scala son inmutables por defecto
- Para mutabilidad: `scala.collection.mutable`
- Ventajas: thread-safe, razonamiento más simple

### 2. **Lazy Collections**
- `Stream`, `LazyList`, `View`
- Evaluación perezosa: `(1 to 1000000).view.map(_ * 2).take(10)`

### 3. **Pattern Matching con Colecciones**
```scala
list match {
  case head :: tail => // procesar
  case Nil => // lista vacía
}
```

### 4. **Higher-Order Functions Avanzadas**
- `foldLeft/foldRight`: acumulación con operador
- `scanLeft/scanRight`: acumulación con todos los pasos intermedios
- `groupBy`: agrupación por clave

### 5. **Performance Characteristics**
- **List**: $O(1)$ head/tail, $O(n)$ acceso aleatorio
- **Vector**: $O(1)$ acceso, $O(log_{32}n)$ actualización
- **Set**: $O(1)$ promedio para HashSet

### 6. **Collection Conversions**
```scala
list.toSet
set.toList
array.toVector
```

### 7. **String como Colección**
- Los String son Seq[Char]
- `"hello".map(_.toUpper)` → "HELLO"
- `"abc".filter(_ != 'b')` → "ac"

## Ejemplos Prácticos Combinados

### Producto Cartesiano con Filtros
```scala
// Combinación de flatMap y for-comprehension
val paresPrimos = for {
  i <- 1 to M
  j <- 1 to M
  if i % 2 == 0 && j % 3 == 0
  if esPrimo(i + j)
} yield (i, j)

// Equivalente con flatMap
val equivalente = (1 to M).flatMap(i => 
  (1 to M).filter(j => i % 2 == 0 && j % 3 == 0 && esPrimo(i + j))
    .map(j => (i, j))
```

### Operaciones de Conjuntos
```scala
val A = Set(1,2,3,4)
val B = Set(3,4,5,6)

A union B      // Set(1,2,3,4,5,6)
A intersect B  // Set(3,4)
A diff B       // Set(1,2)
```

### Transformaciones con zip
```scala
// Producto escalar
val v1 = Vector(1,2,3)
val v2 = Vector(4,5,6)
val producto = (v1 zip v2).map{case (a,b) => a * b}.sum  // 32
```

## Buenas Prácticas

1. **Preferir Vector sobre List** para acceso aleatorio
2. **Usar expresiones for** para código más legible
3. **Aplicar transformaciones lazy** con `view` para grandes colecciones
4. **Utilizar pattern matching** para desestructurar colecciones
5. **Considerar inmutabilidad** para evitar efectos secundarios


