# Set

Los conjuntos (Set) son una colección que no permite elementos duplicados. En Scala, los conjuntos pueden ser mutables o inmutables (por defecto son inmutables). No garantizan un orden específico de los elementos.

```scala
// Creación de un Set: los elementos duplicados se eliminan automáticamente
scala> Set(1, 2, 11, 1, 1, 1, 1, 1, 1, 1, 1)
val res42: scala.collection.immutable.Set[Int] = Set(1, 2, 11)

// Definición de dos conjuntos para operaciones de álgebra de conjuntos
scala> val a = Set(1, 2, 3)
val a: scala.collection.immutable.Set[Int] = Set(1, 2, 3)

scala> val b = Set(2, 4, 6)
val b: scala.collection.immutable.Set[Int] = Set(2, 4, 6)

// Unión: elementos que están en a, en b o en ambos
scala> a union b
val res43: scala.collection.immutable.Set[Int] = HashSet(1, 6, 2, 3, 4)

// Intersección: elementos comunes a ambos conjuntos
scala> a intersect b
val res44: scala.collection.immutable.Set[Int] = Set(2)

// Diferencia: elementos que están en a pero no en b
scala> a diff b
val res45: scala.collection.immutable.Set[Int] = Set(1, 3)

// Verificación de pertenencia: comprueba si un elemento está en el conjunto
scala> a contains 3
val res46: Boolean = true
```

---

## Tabla de Resumen

Concepto/Operación | Descripción | Sintaxis Scala | Complejidad Típica | Notas
--- | --- | --- | --- | ---
Definición | Colección sin elementos duplicados | `Set(1, 2, 3)` | O(1) para creación | Inmutable por defecto
Unión | Elementos en A, B o ambos | `a union b` o `a | b` | O(n+m) | Conmutativa: `a union b == b union a`
Intersección | Elementos comunes a A y B | `a intersect b` o `a & b` | O(min(n,m)) | Conmutativa
Diferencia | Elementos en A pero no en B | `a diff b` o `a &~ b` | O(n) | No conmutativa
Pertenencia | Verifica si elemento está en Set | `a contains x` | O(1) promedio | Usa hash code para eficiencia
Subconjunto | Verifica si A ⊆ B | `a subsetOf b` | O(n) | |
Igualdad | Compara igualdad de conjuntos | `a == b` | O(n) promedio | Independiente del orden
Add/Remove | Agrega/elimina elemento | `a + x`, `a - x` | O(1) promedio | Devuelve nuevo conjunto (inmutable)

**Comentarios adicionales:**

- **Implementaciones de Set**: Scala ofrece varias implementaciones:
  - `HashSet`: Basado en tabla hash, acceso O(1) promedio, sin orden.
  - `TreeSet`: Basado en árbol rojo-negro, elementos ordenados, acceso O(log n).
  - `BitSet`: Optimizado para enteros no negativos, usa bits para representar presencia.
  - `ListSet`: Implementado como lista enlazada, preserva orden de inserción (poco usado).

- **Mutabilidad**: Para conjuntos mutables, importar `scala.collection.mutable.Set`. Las operaciones modifican el conjunto original en lugar de crear uno nuevo.

- **Operaciones adicionales**:
  - `++` y `--`: Sintaxis alternativa para unión y diferencia.
  - `&~`: Operador para diferencia.
  - `subsetOf`: Verifica si un conjunto es subconjunto de otro.
  - `mkString`: Convierte a string con separador personalizado.

- **Consideraciones de rendimiento**:
  - `HashSet` es generalmente la opción más eficiente para operaciones de pertenencia, unión, intersección y diferencia.
  - `TreeSet` es útil cuando se necesita recorrer elementos en orden o obtener rangos.
  - Para conjuntos pequeños, `Set` por defecto (que usa hash) es suficiente.

- **Comparación con otras colecciones**:
  - A diferencia de `List` y `Vector`, `Set` no mantiene orden ni permite duplicados.
  - Las operaciones de `Set` se basan en la igualdad de objetos (usando `hashCode` y `equals`).
  - Para tipos personalizados, es crucial implementar correctamente `hashCode` y `equals` para un comportamiento adecuado en `Set`.

- **Uso en programación funcional**:
  - Los conjuntos inmutables son ideales para programación funcional ya que evitan efectos secundarios.
  - Se pueden usar con funciones de orden superior: `map`, `filter`, `flatMap`, `fold`, etc.
  - Útiles para eliminar duplicados de otras colecciones: `list.toSet` o `list.distinct`.