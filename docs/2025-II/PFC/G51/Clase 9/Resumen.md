
# Programación funcional

1. Estrategias de evaluación: nombre, valor y perezosa
2. Programación en funciones de alto orden (funciones que reciben funciones o devuelven funciones), funciones son ciudadanos de primera clase, son tratados como valores
3. Funciones de alto orden: map, filter, reduce
4. Abstraccion funcional: Representacion de datos usando clases
5. Reconocimiento de patrones
6. Expresiones for
7. Ausencia de estado explicito (no variables si no ligaduras) y colecciones inmutables

**RESUMEN DE CLASE - PROGRAMACIÓN FUNCIONAL CON SCALA**

Esta clase aborda dos conceptos fundamentales del paradigma funcional en Scala: **expresiones for-comprehension** y **evaluación perezosa**, ambos tratados extensivamente en el libro de Odersky.

**EXPRESIONES FOR-COMPREHENSION**
- Equivalente funcional a las consultas SELECT de SQL
- Permiten composición de operaciones sobre colecciones de manera declarativa
- Combinan `map`, `flatMap` y `filter` de forma sintácticamente clara
- Mantienen el tipado fuerte de Scala vs el tipado débil de SQL

**EVALUACIÓN PEREZOSA (LAZY EVALUATION)**
- Técnica donde los valores se calculan solo bajo demanda
- Implementada mediante `LazyList` (sucesor de `Stream`)
- Permite trabajar con estructuras de datos potencialmente infinitas
- Optimiza uso de memoria y evita cálculos innecesarios

**TABLA DE CONCEPTOS RELEVANTES**

| Concepto | Descripción | Ejemplo en Código | Relación con Odersky |
|----------|-------------|-------------------|---------------------|
| **For-comprehension** | Sintaxis para composición de monadas | `for { x <- lista if cond } yield x` | Cap. 23: For Expressions |
| **LazyList** | Colección perezosa para secuencias | `LazyList.cons(n, generador(n+1))` | Cap. 24: Collections in Depth |
| **Evaluación perezosa** | Cálculo bajo demanda | `sol(5)` fuerza evaluación | Cap. 9: Control Abstraction |
| **Pattern matching** | Verificación de tipos en tiempo de ejecución | `isInstanceOf[EmpleadoOperativo]` | Cap. 15: Case Classes and Pattern Matching |
| **Higher-order functions** | Funciones que toman/retornan funciones | Operaciones sobre colecciones | Cap. 8: Functions and Closures |
| **Inmutabilidad** | Estructuras de datos no modificables | `List[Empleado]` | Cap. 17: Working with Other Collections |
| **Recursión** | Técnica fundamental en programación funcional | `generador(n+1)` | Cap. 8: Tail Recursion |

**APLICACIONES PRÁCTICAS**
- Consultas tipo SQL sobre colecciones in-memory
- Generación de secuencias matemáticas infinitas
- Búsqueda eficiente en espacios de solución grandes
- Optimización de recursos computacionales

La clase demuestra cómo Scala integra conceptos de programación funcional pura con necesidades prácticas de procesamiento de datos, manteniendo la seguridad de tipos y la expresividad del lenguaje.
