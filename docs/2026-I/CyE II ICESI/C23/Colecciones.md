

---

## Colecciones en Scala

Las colecciones en Scala se dividen en dos grandes categorías: **mutables** e **inmutables**. Por defecto, Scala utiliza colecciones inmutables. Las principales colecciones inmutables son `List`, `Vector`, `Set`, `Map` y `Array` (aunque `Array` es mutable, pero se incluye por compatibilidad con Java).

A continuación se muestran ejemplos de creación y conversión entre colecciones:

```scala
// Vector: colección indexada, eficiente para acceso aleatorio y actualización al final
scala> val v = Vector(1,2,3,4)
val v: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3, 4)

// Acceso por índice: v(1) devuelve el elemento en la posición 1 (segundo elemento)
scala> v(1)
val res22: Int = 2

// Conversión a List: preserva el orden y los elementos duplicados
scala> v.toList
val res23: List[Int] = List(1, 2, 3, 4)

// Conversión a Array: estructura mutable de tamaño fijo
scala> v.toArray
val res24: Array[Int] = Array(1, 2, 3, 4)

// Conversión a Set: elimina duplicados, no preserva el orden
scala> v.toSet
val res25: scala.collection.immutable.Set[Int] = Set(1, 2, 3, 4)

// Lista con elementos duplicados
scala> val k = List(1,1,1,2,2,3,3,3,4,4,1,1)
val k: List[Int] = List(1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 1, 1)

// toList sobre una Lista: devuelve la misma lista (operación identidad)
scala> k.toList
val res26: List[Int] = List(1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 1, 1)

// Conversión a Array: preserva todos los elementos incluyendo duplicados
scala> k.toArray
val res27: Array[Int] = Array(1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 1, 1)

// Conversión a Vector: preserva el orden y los duplicados
scala> k.toVector
val res28: scala.collection.immutable.Vector[Int] = Vector(1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 1, 1)

// Conversión a Set: elimina duplicados, solo quedan valores únicos
scala> k.toSet
val res29: scala.collection.immutable.Set[Int] = Set(1, 2, 3, 4)

// Operaciones sobre conjuntos (Set):
// union: combina elementos de ambos conjuntos sin duplicados
scala> Set(1,2,3) union Set(2,3,4)
val res30: scala.collection.immutable.Set[Int] = Set(1, 2, 3, 4)

// intersect: elementos comunes a ambos conjuntos
scala> Set(1,2,3) intersect Set(2,3,4)
val res31: scala.collection.immutable.Set[Int] = Set(2, 3)

// diff: elementos del primer conjunto que no están en el segundo
scala> Set(1,2,3) diff Set(2,3,4)
val res34: scala.collection.immutable.Set[Int] = Set(1)

// Conversión de un Map a otras colecciones:
// toList sobre un Map: devuelve una lista de tuplas (clave, valor)
scala> p.toList
val res36: List[(String, String)] = List((Colombia,Bogota), (Peru,Lima))

// toArray sobre un Map: devuelve un array de tuplas
scala> p.toArray
val res37: Array[(String, String)] = Array((Colombia,Bogota), (Peru,Lima))

// toSet sobre un Map: devuelve un conjunto de tuplas
scala> p.toSet
val res38: scala.collection.immutable.Set[(String, String)] = Set((Colombia,Bogota), (Peru,Lima))

// Conversión de una lista de tuplas a Map:
// Nota: si hay claves duplicadas, se conserva la última
scala> List((2,1),(2,2),(3,3),(5,4)).toMap
val res40: scala.collection.immutable.Map[Int,Int] = Map(2 -> 2, 3 -> 3, 5 -> 4)

// Conversión de una lista de tuplas a Set:
// Elimina tuplas duplicadas (si las hubiera)
scala> List((2,1),(2,2),(3,3),(5,4)).toSet
val res41: scala.collection.immutable.Set[(Int, Int)] = Set((2,1), (2,2), (3,3), (5,4))
```

**Conceptos teóricos clave:**

- **`Vector`**: Colección inmutable con acceso indexado eficiente (O(log n) para la mayoría de operaciones). Ideal para acceso aleatorio y actualizaciones al final.
- **`List`**: Colección inmutable enlazada. Eficiente para operaciones en la cabeza (prepend), pero lenta para acceso por índice (O(n)).
- **`Set`**: Colección inmutable que no permite elementos duplicados. Las operaciones `union`, `intersect` y `diff` son fundamentales para álgebra de conjuntos.
- **`Map`**: Colección inmutable de pares clave-valor. Las claves son únicas. Al convertir una lista de tuplas a `Map`, si hay claves duplicadas, se conserva la última.
- **Conversiones**: Los métodos `toList`, `toVector`, `toArray`, `toSet` y `toMap` permiten transformar entre colecciones. Es importante notar que `Set` y `Map` eliminan duplicados, mientras que `List`, `Vector` y `Array` los preservan.

**Tabla de resumen:**

| Concepto | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **Vector** | Colección inmutable indexada, acceso O(log n) | `Vector(1,2,3,4)` |
| **List** | Colección inmutable enlazada, acceso O(n) | `List(1,2,3,4)` |
| **Set** | Colección inmutable sin duplicados | `Set(1,2,3)` |
| **Map** | Colección inmutable de pares clave-valor | `Map("a" -> 1, "b" -> 2)` |
| **Array** | Colección mutable de tamaño fijo (Java) | `Array(1,2,3,4)` |
| **`union`** | Combinación de dos conjuntos | `Set(1,2) union Set(2,3)` → `Set(1,2,3)` |
| **`intersect`** | Intersección de dos conjuntos | `Set(1,2) intersect Set(2,3)` → `Set(2)` |
| **`diff`** | Diferencia de conjuntos | `Set(1,2) diff Set(2,3)` → `Set(1)` |
| **`toList`** | Convierte a Lista | `Vector(1,2).toList` → `List(1,2)` |
| **`toSet`** | Convierte a Set (elimina duplicados) | `List(1,1,2).toSet` → `Set(1,2)` |
| **`toMap`** | Convierte lista de tuplas a Map | `List((1,"a")).toMap` → `Map(1 -> "a")` |

**Comentarios adicionales:**

- Las colecciones inmutables son la opción preferida en Scala por seguridad en concurrencia y previsibilidad. Las mutables se usan cuando el rendimiento es crítico o hay restricciones de memoria.
- La jerarquía de colecciones en Scala es rica: `Seq`, `Set`, `Map` son los tres subtipos principales de `Iterable`. `List` y `Vector` son subtipos de `Seq`.
- Al usar `toMap` con claves duplicadas, el comportamiento es "last wins" (la última clave prevalece), lo cual puede ser fuente de errores si no se controla.
- Las operaciones `union`, `intersect` y `diff` también están disponibles para `Map` (operan sobre las claves) y para `Seq` (aunque con semántica diferente, preservando duplicados).