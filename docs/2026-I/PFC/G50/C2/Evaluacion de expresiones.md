# Evaluación de expresiones

Las expresiones se evalúan de izquierda a derecha, tomando en cuenta los operadores de precedencia.

```scala
scala> 1 + 2 + 3 + 4 + 5
val res2: Int = 15
// Evaluación: ((((1 + 2) + 3) + 4) + 5) = 15

scala> 3 + 3 + 4 + 5
val res3: Int = 15
// Evaluación: ((((3 + 3) + 4) + 5) = 15

scala> 6 + 4 + 5
val res4: Int = 15
// Evaluación: (((6 + 4) + 5) = 15

scala> 10 + 5
val res5: Int = 15
// Evaluación: (10 + 5) = 15

scala> 15
val res6: Int = 15
// Resultado final
```

Por ejemplo, la multiplicación tiene mayor precedencia que la suma, por lo que se ejecuta primero:

```scala
scala> 1+2*3
val res7: Int = 7
// Evaluación: 1 + (2 * 3) = 1 + 6 = 7

scala> (1+2)*3
val res8: Int = 9
// Evaluación: (1 + 2) * 3 = 3 * 3 = 9
```

En caso tal, usted puede especificar el orden de evaluación utilizando paréntesis para alterar la precedencia de operadores.

## Funciones

Las funciones son valores que esperan otros valores (parámetros) y efectúan una operación sobre ellos. Ejemplo:

```scala
scala> def f(x:Int):Int = x+2*x*x
def f(x: Int): Int
// Definición de función que toma un parámetro entero x y retorna x + 2*x*x

scala> f
val res9: Int => Int = Lambda$1634/0x00007f22d8583940@27c243a3
// f es un valor de tipo función que toma un Int y retorna un Int

scala> f(10)
val res10: Int = 210
// Evaluación: 10 + 2*10*10 = 10 + 200 = 210
```

## Estrategias de evaluación de expresiones

Una estrategia de evaluación es el método mediante el cual se reducen todas las expresiones a un valor final. Existen dos estrategias principales:

### 1. Evaluación por Valor (Call By Value - CBV)

En esta estrategia, los argumentos de una función se evalúan **antes** de pasar a la función. Esto significa que:

- Se evalúan todos los parámetros de izquierda a derecha
- Se evalúan todas las operaciones de izquierda a derecha
- Cada parámetro se evalúa exactamente una vez

**Ventaja:** Cada valor se evalúa solo una vez, lo que puede ser más eficiente cuando los parámetros se usan múltiples veces.

### 2. Evaluación por Nombre (Call By Name - CBN)

En esta estrategia, los argumentos se pasan **sin evaluar** y se evalúan solo cuando se usan dentro de la función. Esto significa que:

- Los parámetros se sustituyen directamente en el cuerpo de la función
- Se evalúan solo cuando se necesitan
- Un parámetro no usado nunca se evalúa

**Ventaja:** Si un parámetro no se usa en la función, no se realiza su evaluación, lo que ahorra cálculos innecesarios.

---

## Ejemplo comparativo de estrategias

Consideremos la siguiente definición:

```scala
def test(x: Int, y: Int) = x*x
// Función que ignora el parámetro y y solo usa x
```

### Caso 1: `test(2, 3)`

**CBV (Evaluación por Valor):**
```scala
// Paso 1: Evalúa 2 → 2
// Paso 2: Evalúa 3 → 3
// Paso 3: Aplica función: 2*2 → 4
// Total: 3 pasos
```

**CBN (Evaluación por Nombre):**
```scala
// Paso 1: Sustituye directamente: 2*2
// Paso 2: Evalúa: 2*2 → 4
// Total: 2 pasos
```

**Resultado:** CBN es más eficiente

---

### Caso 2: `test(3+4, 8)`

**CBV (Evaluación por Valor):**
```scala
// Paso 1: Evalúa 3+4 → 7
// Paso 2: Evalúa 8 → 8
// Paso 3: Aplica función: 7*7 → 49
// Total: 3 pasos
```

**CBN (Evaluación por Nombre):**
```scala
// Paso 1: Sustituye directamente: (3+4)*(3+4)
// Paso 2: Evalúa primer (3+4) → 7*(3+4)
// Paso 3: Evalúa segundo (3+4) → 7*7
// Paso 4: Evalúa: 7*7 → 49
// Total: 4 pasos
```

**Resultado:** CBV es más eficiente. CBN realiza evaluaciones redundantes del parámetro x.

---

### Caso 3: `test(7, 2*4)`

**CBV (Evaluación por Valor):**
```scala
// Paso 1: Evalúa 7 → 7
// Paso 2: Evalúa 2*4 → 8
// Paso 3: Aplica función: 7*7 → 49
// Total: 3 pasos
```

**CBN (Evaluación por Nombre):**
```scala
// Paso 1: Sustituye directamente: 7*7
// Paso 2: Evalúa: 7*7 → 49
// Total: 2 pasos
// Nota: El parámetro y (2*4) nunca se evalúa porque no se usa en la función
```

**Resultado:** CBN es más eficiente. El parámetro y no se utiliza, por lo que su evaluación es innecesaria.

---

### Caso 4: `test(3+4, 2*4)`

**CBV (Evaluación por Valor):**
```scala
// Paso 1: Evalúa 3+4 → 7
// Paso 2: Evalúa 2*4 → 8
// Paso 3: Aplica función: 7*7 → 49
// Total: 3 pasos
```

**CBN (Evaluación por Nombre):**
```scala
// Paso 1: Sustituye directamente: (3+4)*(3+4)
// Paso 2: Evalúa primer (3+4) → 7*(3+4)
// Paso 3: Evalúa segundo (3+4) → 7*7
// Paso 4: Evalúa: 7*7 → 49
// Total: 4 pasos
// Nota: El parámetro y (2*4) nunca se evalúa, pero x se evalúa dos veces
```

**Resultado:** CBV es más eficiente

---

## Tabla de resumen de conceptos

| Concepto | Descripción | Ventajas | Desventajas |
|----------|-------------|----------|-------------|
| **Evaluación por Valor (CBV)** | Los parámetros se evalúan antes de pasar a la función | Cada parámetro se evalúa una sola vez; más predecible | Parámetros no utilizados se evalúan innecesariamente |
| **Evaluación por Nombre (CBN)** | Los parámetros se sustituyen sin evaluar; se evalúan al usarse | Parámetros no usados no se evalúan; eficiente para valores costosos | Un parámetro usado múltiples veces se evalúa varias veces |
| **Precedencia de operadores** | Orden en que se ejecutan operaciones sin paréntesis explícitos | Multiplicación y división antes que suma y resta | Puede ser confuso sin paréntesis |
| **Paréntesis** | Alteran el orden de evaluación de expresiones | Permiten especificar explícitamente el orden deseado | Pueden hacer el código más verboso |
| **Función** | Valor que toma parámetros y realiza una operación | Reutilización de código; abstracción | Requiere comprensión de estrategias de evaluación |

## Comentarios adicionales

- En Scala, la evaluación por defecto es **Call By Value (CBV)**. Sin embargo, es posible usar **Call By Name (CBN)** especificando el parámetro con `=>` en la definición de la función.

- La elección entre CBV y CBN depende del contexto y del costo computacional de evaluar los parámetros. Para parámetros costosos, CBN puede ser más eficiente.

- Algunos lenguajes como Haskell utilizan **lazy evaluation** (una forma de CBN optimizada) por defecto, lo que permite trabajar de manera eficiente incluso con estructuras de datos infinitas.

- El concepto de **reducción** es fundamental en la evaluación de expresiones. Una reducción es un paso que reemplaza una subexpresión por su valor equivalente.

- La **asociatividad** de los operadores también es importante: el operador `+` es asociativo hacia la izquierda, por lo que `1 + 2 + 3` se evalúa como `(1 + 2) + 3`, no como `1 + (2 + 3)`.

- En el análisis de eficiencia, se cuenta el número de **pasos de reducción**, no el tiempo real, para hacer las comparaciones independientes del hardware.