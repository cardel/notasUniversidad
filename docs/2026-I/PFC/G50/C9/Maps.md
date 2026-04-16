# Maps

Los **Maps** (mapas o diccionarios) son colecciones de pares clave-valor donde las claves no se pueden repetir. Cada clave está asociada a exactamente un valor, lo que permite realizar búsquedas eficientes por clave.

## Definición y creación

```scala
// Creación de un Map con departamentos y sus capitales en Colombia
scala> val capitales = Map("Valle" -> "Cali", "Antioquia" -> "Medellin", "Choco" -> "Quibdo", "Vaupes" -> "Mitu", "Guania" -> "Puerto Inirida", "Caqueta" -> "Florencia")
val capitales: scala.collection.immutable.Map[String,String] = HashMap(Guania -> Puerto Inirida, Vaupes -> Mitu, Valle -> Cali, Antioquia -> Medellin, Choco -> Quibdo, Caqueta -> Florencia)
```

## Operaciones con Maps

### Filtrado de elementos
```scala
// Intentar filtrar departamentos cuyo nombre comienza con "M"
// Nota: Ningún departamento en nuestro Map comienza con "M"
scala> capitales.filter { case (k,v) => k.startsWith("M")}
val res30: scala.collection.immutable.Map[String,String] = HashMap()

// Verificar que el Map original no ha sido modificado (inmutabilidad)
scala> capitales
val res31: scala.collection.immutable.Map[String,String] = HashMap(Guania -> Puerto Inirida, Vaupes -> Mitu, Valle -> Cali, Antioquia -> Medellin, Choco -> Quibdo, Caqueta -> Florencia)

// Filtrar departamentos cuyo nombre comienza con "C"
scala> capitales.filter { case (k,v) => k.startsWith("C")}
val res32: scala.collection.immutable.Map[String,String] = HashMap(Choco -> Quibdo, Caqueta -> Florencia)
```

## Manejo de claves inexistentes

### El problema de las claves no encontradas
Al intentar acceder a una clave que no existe en un Map, Scala lanza una excepción `NoSuchElementException`. Para evitar esto, se puede usar el método `withDefaultValue`.

### Solución con `withDefaultValue`
```scala
// Crear un Map con un valor por defecto para claves no encontradas
scala> val capitales = Map("Valle" -> "Cali", "Antioquia" -> "Medellin", "Choco" -> "Quibdo", "Vaupes" -> "Mitu", "Guania" -> "Puerto Inirida", "Caqueta" -> "Florencia").withDefaultValue("No se")
val capitales: scala.collection.immutable.Map[String,String] = Map(Guania -> Puerto Inirida, Vaupes -> Mitu, Valle -> Cali, Antioquia -> Medellin, Choco -> Quibdo, Caqueta -> Florencia)

// Acceder a una clave que no existe en el Map
scala> capitales("Arauca")
val res33: String = No se
```

## Conceptos teóricos importantes

1. **Inmutabilidad**: El Map creado es inmutable por defecto. Las operaciones como `filter` devuelven un nuevo Map sin modificar el original.

2. **Estructura de datos**: Los Maps en Scala están implementados como tablas hash, lo que proporciona acceso constante en tiempo promedio O(1) para operaciones de búsqueda.

3. **Sintaxis de creación**: La notación `clave -> valor` es azúcar sintáctico para `(clave, valor)`. Internamente se crea una tupla.

4. **Pattern matching en filtros**: La expresión `{ case (k,v) => ... }` es una función parcial que utiliza pattern matching para desestructurar los pares clave-valor.

5. **Alternativas para manejar claves inexistentes**:
   - `get(key)`: Devuelve `Option[V]` (`Some(valor)` o `None`)
   - `getOrElse(key, default)`: Devuelve el valor o un valor por defecto
   - `withDefaultValue(default)`: Configura un valor por defecto para todo el Map

## Tabla de resumen

| Concepto | Descripción | Ejemplo/Notas |
|----------|-------------|---------------|
| **Map** | Colección de pares clave-valor con claves únicas | `Map("a" -> 1, "b" -> 2)` |
| **Inmutabilidad** | Los Maps por defecto son inmutables | Las operaciones devuelven nuevos Maps |
| **Acceso por clave** | Obtener el valor asociado a una clave | `map("clave")` o `map.get("clave")` |
| **`filter`** | Filtrar elementos según una condición | `map.filter { case (k,v) => cond }` |
| **`withDefaultValue`** | Establecer valor por defecto para claves no encontradas | Evita `NoSuchElementException` |
| **Pattern matching** | Desestructurar pares clave-valor en operaciones | `{ case (k, v) => ... }` |
| **Complejidad temporal** | Acceso promedio O(1) para operaciones de búsqueda | Implementación con tablas hash |
| **Claves únicas** | No se permiten claves duplicadas | Claves repetidas sobrescriben valores anteriores |

## Comentarios adicionales

1. **Tipos de Maps**: Scala ofrece varias implementaciones de Maps:
   - `HashMap`: Implementación estándar basada en tablas hash
   - `TreeMap`: Implementación basada en árboles rojo-negro (claves ordenadas)
   - `ListMap`: Implementación basada en listas (mantiene orden de inserción)

2. **Maps mutables**: Para usar Maps mutables, importar `scala.collection.mutable.Map`. Útiles cuando se necesita modificar frecuentemente la estructura.

3. **Operaciones comunes**:
   - `map.keys`: Obtener todas las claves
   - `map.values`: Obtener todos los valores
   - `map.contains(key)`: Verificar si una clave existe
   - `map.updated(key, value)`: Agregar o actualizar un par clave-valor
   - `map.removed(key)`: Eliminar una clave

4. **Uso con `get`**: Es una práctica recomendada usar `map.get(key)` que devuelve `Option[V]` en lugar de `map(key)` que lanza excepción, especialmente cuando no se está seguro de la existencia de la clave.

5. **Transformaciones**: Los Maps son funtores y monadas, por lo que se pueden usar con `map`, `flatMap` y en expresiones `for`:
   ```scala
   for ((k, v) <- capitales if k.startsWith("C")) yield (k, v.toUpperCase)
   ```

6. **Consideraciones de rendimiento**: Para Maps muy grandes, considerar el factor de carga y el tamaño inicial para optimizar el rendimiento de las operaciones hash.

Los Maps son estructuras de datos fundamentales en programación que permiten modelar relaciones entre elementos de manera eficiente, siendo especialmente útiles para tablas de búsqueda, diccionarios, configuraciones y cachés.