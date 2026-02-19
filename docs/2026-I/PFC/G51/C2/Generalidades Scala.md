# Expresiones y operaciones

1. **Expresiones primitivas**: En Scala, las expresiones primitivas incluyen tipos básicos como `Int`, `Boolean` y `Char`. Estas representan valores fundamentales que pueden ser evaluados para producir resultados.

2. **Operaciones entre expresiones**: Las operaciones aritméticas y de otro tipo (como `+`, `-`, `.size`, etc.) permiten combinar expresiones primitivas para crear expresiones más complejas.

3. **Orden de evaluación y precedencia de operadores**: Las operaciones se evalúan de izquierda a derecha, pero respetando la precedencia de los operadores (por ejemplo, la multiplicación tiene mayor precedencia que la suma). Los paréntesis tienen la máxima prioridad en la evaluación.

```scala
// Ejemplo 1: Suma simple evaluada de izquierda a derecha
scala> 1+2+3+4+5
val res4: Int = 15
// Evaluación: ((((1+2)+3)+4)+5) = 15

scala> 3+3+4+5
val res5: Int = 15
// Evaluación: ((((3+3)+4)+5) = 15

scala> 6+4+5
val res6: Int = 15
// Evaluación: ((6+4)+5) = 15

scala> 10+5
val res7: Int = 10 + 5 = 15

scala> 15
val res8: Int = 15
// Resultado final tras todas las evaluaciones anteriores

// Ejemplo 2: Expresión con multiplicación que respeta precedencia
scala> 2+3+4*5
val res9: Int = 25
// Evaluación: 2+3+(4*5) = 2+3+20 = 25
// La multiplicación se evalúa antes que la suma debido a su mayor precedencia

// Ejemplo 3: Uso de paréntesis para alterar la precedencia
scala> (2+3+4)*5
val res10: Int = 45
// Evaluación: (2+3+4)*5 = 9*5 = 45
// Los paréntesis fuerzan la evaluación de la suma antes de la multiplicación
```

## Conceptos teóricos adicionales

**Expresión**: En Scala, una expresión es una construcción sintáctica que se evalúa para producir un valor. Todo en Scala es una expresión, incluyendo estructuras de control como `if`, `while` y `for`.

**Precedencia de operadores**: Scala sigue reglas estándar de precedencia similares a las matemáticas. El orden de precedencia (de mayor a menor) es aproximadamente:
- Multiplicación (`*`), división (`/`), módulo (`%`)
- Suma (`+`), resta (`-`)
- Asignación y operadores especiales

**Asociatividad**: La mayoría de los operadores aritméticos son asociativos a la izquierda, lo que significa que `a + b + c` se evalúa como `(a + b) + c`.

# Funciones

Una función en Scala es una abstracción que encapsula un cálculo o un conjunto de operaciones. Las funciones reciben parámetros (también llamados argumentos) y devuelven un valor basado en esos parámetros.

```scala
// Ejemplo 1: Definición de un valor sin parámetros
scala> def a = 10
def a: Int
// 'a' es un valor definido como 10, de tipo Int
// No requiere parámetros

// Ejemplo 2: Definición de una función con un parámetro
scala> def f(x:Int):Int = 10
def f(x: Int): Int
// 'f' es una función que recibe un parámetro 'x' de tipo Int
// La función retorna un valor de tipo Int (en este caso siempre 10)
// La función ignora el parámetro x y devuelve una constante

// Ejemplo 3: Acceso a un valor definido sin parámetros
scala> a
val res11: Int = 10
// Al acceder a 'a', se obtiene directamente el valor 10

// Ejemplo 4: Acceso a una función sin invocarla
scala> f
val res12: Int => Int = Lambda$1608/0x00007f31505d0000@46eaf531
// Al referenciar 'f' sin paréntesis, se obtiene un objeto de tipo "Int => Int"
// Este tipo indica una función que recibe un Int y retorna un Int
// Lambda$1608... es la representación interna de la función en memoria
// Para invocar la función se debe usar f(valor)
```

## Conceptos teóricos adicionales

**Parámetros vs Argumentos**: Los parámetros son los nombres de las variables definidas en la firma de la función (como `x` en `def f(x:Int)`), mientras que los argumentos son los valores reales pasados al invocar la función (como `5` en `f(5)`).

**Tipo de retorno**: El tipo especificado después de los parámetros (como `:Int` después del paréntesis) indica el tipo de valor que la función devuelve.

**Diferencia entre valores y funciones sin argumentos**: Un valor definido como `def a = 10` puede accederse directamente sin paréntesis. Una función `def f(x:Int):Int = 10` requiere paréntesis para ser invocada, incluso si no hay parámetros reales (se escribiría `f(5)`).

**Tipo función**: El tipo `Int => Int` representa una función que recibe un `Int` como entrada y produce un `Int` como salida. Es un tipo de dato en sí mismo, lo que permite pasar funciones como parámetros a otras funciones (funciones de orden superior).

---

## Tabla de resumen

| Concepto | Definición | Ejemplo |
|---|---|---|
| **Expresión primitiva** | Valor fundamental de un tipo básico en Scala | `5`, `true`, `'a'` |
| **Operación aritmética** | Combinación de expresiones usando operadores | `2 + 3`, `4 * 5` |
| **Precedencia de operadores** | Regla que determina qué operaciones se evalúan primero | `2 + 3 * 4 = 14` (no 20) |
| **Asociatividad (izquierda)** | Evaluación de izquierda a derecha en operadores del mismo nivel | `10 - 3 - 2 = 5` (no 9) |
| **Paréntesis** | Símbolos que alteran el orden de evaluación | `(2 + 3) * 4 = 20` |
| **Función** | Abstracción que encapsula cálculos y recibe parámetros | `def f(x:Int):Int = x * 2` |
| **Parámetro** | Variable en la definición de una función | `x` en `def f(x:Int)` |
| **Tipo de retorno** | Tipo de dato que una función devuelve | `:Int` en `def f(x:Int):Int` |
| **Tipo función** | Tipo que representa una función como valor | `Int => Int` |
| **Evaluación** | Proceso de ejecutar una expresión para obtener su valor | Entrada → Cálculo → Resultado |

### Comentarios adicionales

- **Todo es una expresión**: A diferencia de muchos lenguajes de programación, en Scala incluso las definiciones de funciones y las estructuras de control producen valores que pueden ser utilizados.

- **Inferencia de tipos**: Aunque en los ejemplos se muestran tipos explícitos, Scala puede inferir tipos automáticamente en muchos casos, permitiendo código más conciso.

- **Inmutabilidad por defecto**: Los valores definidos con `def` son inmutables por defecto, lo que promueve un estilo de programación funcional.

- **Funciones como valores de primera clase**: En Scala, las funciones son valores que pueden ser pasados, almacenados y retornados como cualquier otro dato, lo que es una característica fundamental de los lenguajes de programación funcionales.
