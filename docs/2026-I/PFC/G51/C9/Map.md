# Map

Un **Map** (también llamado diccionario o tabla de hash) es una colección de pares **llave-valor** que extiende de `Iterable`. Cada llave está asociada a un valor, y las llaves deben ser únicas.

```scala
// Creación de un Map inmutable con ciudades y temperaturas
val x = Map("Bogota" -> 22, "Cali" -> 33, "Medellin" -> 27)
// x: Map[String, Int] = Map(Bogota -> 22, Cali -> 33, Medellin -> 27)

// Obtener todas las llaves del Map (devuelve un Iterable)
x.keys
// res10: Iterable[String] = Set(Bogota, Cali, Medellin)

// Aplicar una transformación a cada par llave-valor usando map
// Se duplica el valor asociado a cada ciudad
x.map({ case (k, v) => (k, 2 * v) })
// res12: Map[String, Int] = Map(Bogota -> 44, Cali -> 66, Medellin -> 54)
```

## Características principales

- Los **Map** permiten indexar valores mediante una llave de cualquier tipo de dato (no solo índices numéricos como en los arreglos).
- Las **llaves deben ser únicas** dentro del Map. Si se intenta agregar una llave duplicada, el valor anterior se sobrescribe (en Map mutables) o se produce un error en ciertos contextos.
- Extienden de `Iterable[(K, V)]`, por lo que se pueden iterar como secuencias de tuplas `(llave, valor)`.
- En Scala, `Map` por defecto es **inmutable** (pertenece a `scala.collection.immutable`). Existe también una versión mutable en `scala.collection.mutable`.

## Operaciones comunes (implícitas en el ejemplo)

- **Acceso por llave**: `x("Bogota")` devuelve `22`.
- **Agregar/actualizar**: `x + ("Barranquilla" -> 30)` crea un nuevo Map con el par adicional.
- **Eliminar**: `x - "Cali"` elimina la entrada con llave `"Cali"`.
- **Verificación de llave**: `x.contains("Medellin")` devuelve `true`.

---

## Tabla de resumen

Concepto | Descripción | Observaciones
--- | --- | ---
Map | Colección de pares llave-valor donde las llaves son únicas. | Extiende `Iterable[(K, V)]`.
Llave (Key) | Identificador único para acceder a un valor en el Map. | Puede ser de cualquier tipo (String, Int, case class, etc.).
Valor (Value) | Dato asociado a una llave. | Puede ser de cualquier tipo, incluso otro Map o colección.
Inmutabilidad | Por defecto, los Map en Scala son inmutables. | Cualquier operación de modificación devuelve un nuevo Map.
`keys` | Método que devuelve un iterable con todas las llaves. | Suele devolver un `Set` porque las llaves son únicas.
`map` sobre Map | Transforma cada par (k, v) aplicando una función. | La función debe devolver un nuevo par (k', v') para mantener la estructura de Map.
Acceso por llave | `map(llave)` devuelve el valor asociado. | Lanza excepción si la llave no existe (usar `get` para opción segura).
`get` | `map.get(llave)` devuelve `Option[V]`. | `Some(valor)` si existe, `None` si no.

---

## Comentarios adicionales

- El operador `->` usado en la creación (`"Bogota" -> 22`) es un método que crea una tupla `(String, Int)`. Es equivalente a escribir `("Bogota", 22)`.
- Cuando se itera un Map con `map`, la función recibe una tupla `(K, V)`. El uso de `{ case (k, v) => ... }` es un **partial function** que permite desestructurar la tupla directamente.
- Para Maps inmutables, el orden de las entradas no está garantizado (aunque en la práctica se suele preservar el orden de inserción en versiones recientes de Scala).
- Existen variantes especializadas como `HashMap`, `TreeMap` (ordenado por llave), y `ListMap` (que preserva el orden de inserción).
- Para evitar excepciones al acceder a una llave inexistente, se recomienda usar `map.getOrElse(key, defaultValue)` o verificar con `containsKey`. o usar withDefaultValue