![](../../G50/Clase5/attachments/Pasted%20image%2020250916103056.png)
## Jerarquía de clases en Scala

### Scala.Any
- **Clase raíz** de toda la jerarquía de tipos
- Todos los tipos en Scala heredan de Any
- Define métodos universales: `==`, `!=`, `equals`, `hashCode`, `toString`

### Scala.AnyVal
- **Clase base para tipos de valor** (value types)
- Representa tipos primitivos: Int, Double, Boolean, Char, etc.
- **Optimización**: Se almacenan directamente en la pila (stack) sin boxing
- **9 tipos concretos**: Byte, Short, Int, Long, Float, Double, Char, Boolean, Unit

### Scala.AnyRef
- **Clase base para tipos de referencia**
- Equivalente a `java.lang.Object` en Java
- Todos los tipos definidos por el usuario y clases de Java heredan de AnyRef
- Se almacenan en el heap con semántica de referencia

## Relación con Java

Scala se ejecuta sobre la **JVM (Java Virtual Machine)** y es totalmente interoperable con Java:

### Capa funcional sobre Java imperativo
- **AnyRef ↔ java.lang.Object**: Mapeo directo, todas las clases Java son AnyRef
- **Tipos primitivos**: Scala elimina la distinción primitivo/objeto mediante AnyVal
- **Colecciones**: Scala ofrece colecciones inmutables y funcionales mientras mantiene acceso a Java Collections

### Programación funcional pura vs Java imperativo
- **Inmutabilidad**: Scala promueve valores inmutables (case classes, colecciones inmutables)
- **Funciones de primera clase**: Lambdas y higher-order functions integradas en el lenguaje
- **Pattern matching**: Mecanismo poderoso para desestructuración y lógica condicional
- **Type system más rico**: Traits, tipos algebraicos, inferencia de tipos

### Ventaja clave
Scala mantiene **compatibilidad total con Java** mientras añade:
- Expresividad funcional
- Sistema de tipos más seguro
- Sintaxis concisa
- Mejor soporte para concurrencia (Actors, Futures)

Scala es esencialmente una **evolución funcional** de Java que conserva toda su infraestructura y ecosistema.