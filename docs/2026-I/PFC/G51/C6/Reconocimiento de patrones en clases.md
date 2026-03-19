# Reconocimiento de patrones en clases

El reconocimiento de patrones (pattern matching) permite analizar la estructura de un dato y evitar verificaciones manuales mediante:

1. Preguntar por un valor específico
2. Validar con condicionales `if` si un dato cumple una condición

Por ejemplo:

```scala
// Definición de un tipo algebraico de datos (ADT) para conjuntos de enteros
sealed abstract class ConjEnt{}  // Clase base sellada - todas las subclases deben estar en este archivo

case class Vacio() extends ConjEnt{}  // Caso base: conjunto vacío

case class NoVacio(elm:Int, izq:ConjEnt, der:ConjEnt){}  // Caso recursivo: conjunto no vacío

// Función que utiliza pattern matching para procesar conjuntos
def funcion(conj:ConjEnt):X = {
  conj match {  // Inicio del pattern matching
    case Vacio() => ...  // Patrón para el caso vacío
    case NoVacio(elm, izq, der) => ...  // Patrón para el caso no vacío, desestructura los parámetros
  }
}
```

## Conceptos teóricos adicionales

**Pattern Matching**: Es una característica funcional que permite descomponer datos según su estructura. Es más expresivo y seguro que usar cadenas de `if-else`.

**Tipos Algebraicos de Datos (ADTs)**: La combinación de `sealed abstract class` con `case class` es el patrón estándar para definir ADTs en Scala. Los ADTs permiten modelar datos con un conjunto fijo de formas.

**Exhaustividad**: Cuando se usa `sealed`, el compilador puede verificar que el pattern matching es exhaustivo (cubre todos los casos posibles). Si falta algún caso, genera una advertencia.

**Desestructuración**: El pattern matching permite extraer valores de case classes directamente en variables, como se ve en `case NoVacio(elm, izq, der)`.

**Guardias (Guards)**: Se pueden agregar condiciones adicionales a los patrones usando `if`, por ejemplo: `case NoVacio(elm, _, _) if elm > 0 => ...`

**Patrones anidados**: Se pueden hacer coincidencias de patrones dentro de patrones para estructuras de datos complejas.

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scala | Beneficios |
|----------|-------------|------------------|------------|
| Pattern Matching | Mecanismo para descomponer datos según su estructura | `valor match { case Patrón => resultado }` | - Más legible que if-else anidados<br>- Verificación de exhaustividad<br>- Desestructuración automática |
| Sealed classes | Clases que restringen la herencia al mismo archivo | `sealed abstract class ConjEnt` | - Pattern matching exhaustivo<br>- Control total sobre las subclases<br>- Útil para ADTs |
| Case classes | Clases especiales para datos inmutables | `case class Vacio() extends ConjEnt` | - Habilitan pattern matching<br>- Métodos equals, hashCode, toString automáticos<br>- Desestructuración fácil |
| ADTs (Tipos Algebraicos de Datos) | Tipos compuestos por una suma de productos | `sealed trait + case classes` | - Modelado de datos con formas fijas<br>- Pattern matching exhaustivo<br>- Seguridad en tiempo de compilación |
| Desestructuración | Extracción de valores de estructuras de datos | `case NoVacio(elm, izq, der)` | - Acceso directo a componentes<br>- Código más conciso<br>- Evita acceso por métodos getter |
| Exhaustividad | Verificación de que todos los casos están cubiertos | Compilador advierte si falta un caso en match | - Menos errores en tiempo de ejecución<br>- Mejor mantenibilidad<br>- Refactorización más segura |

## Comentarios adicionales

- El pattern matching en Scala es más poderoso que el `switch` de Java, ya que puede coincidir con tipos, desestructurar objetos y usar guardias.
- La combinación de `sealed` y case classes permite al compilador realizar análisis de exhaustividad, lo que previene errores comunes.
- Los ADTs son fundamentales en programación funcional para modelar dominios de negocio de manera segura y expresiva.
- El pattern matching funciona no solo con case classes, sino también con tuples, lists, options, y cualquier tipo que tenga un extractor (método `unapply`).
- Para optimizar el rendimiento, Scala compila el pattern matching a tablas de salto (jump tables) cuando es posible.
- El uso de `_` (guión bajo) en patrones sirve como comodín para partes del dato que no nos interesan.
- El pattern matching se puede usar en asignaciones: `val NoVacio(primerElem, _, _) = miConjunto` (aunque esto lanzará excepción si no coincide).
- En programación funcional, el pattern matching es preferible a la herencia con métodos polimórficos para ciertos tipos de problemas, especialmente cuando se añaden nuevas operaciones sobre tipos existentes.