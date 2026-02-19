# Expresiones

## Condicionales

Toda expresión en un lenguaje funcional retorna un valor, sin importar cuál sea. Esto requiere que expresiones como el condicional (`if-else`) **siempre tengan una rama `else`** para garantizar que se retorne un valor en todos los casos posibles.

```scala
// Ejemplo 1: Condicional que retorna un String
scala> if (x > 18) "Mayor de edad" else "Menor edad"
val res0: String = Menor edad
// El condicional evalúa la condición (x > 18)
// Si es verdadera, retorna "Mayor de edad"
// Si es falsa, retorna "Menor edad"
// En este caso x = 15, por lo que retorna "Menor edad"

// Ejemplo 2: Asignar el resultado de un condicional a una variable
scala> val t = if (x > 18) "Mayor de edad" else "Menor edad"
val t: String = Menor edad
// El resultado del condicional (una String) se asigna a la variable t
// La variable t ahora contiene el valor "Menor edad"

// Ejemplo 3: Acceder al valor almacenado
scala> t
val res1: String = Menor edad
// Se accede al valor de la variable t, que es "Menor edad"
```

**Concepto clave**: Dado que **todo debe retornar un valor**, la rama `else` es obligatoria. Sin ella, el compilador no podría garantizar que siempre se retorne un valor en todos los caminos de ejecución.

## Booleanos

Los booleanos son valores de verdad que pueden ser `true` (verdadero) o `false` (falso). En Scala, existen dos tipos de operadores booleanos con comportamientos diferentes:

### Operadores de cortocircuito (`&&` y `||`)

Los operadores de cortocircuito evalúan condiciones de manera perezosa (lazy):

- **Operador `&&` (AND de cortocircuito)**: Cuando el primer operando es `false`, la evaluación se detiene inmediatamente y se retorna `false` sin evaluar el segundo operando.
- **Operador `||` (OR de cortocircuito)**: Cuando el primer operando es `true`, la evaluación se detiene inmediatamente y se retorna `true` sin evaluar el segundo operando.

### Operadores no cortocircuito (`&` y `|`)

Los operadores no cortocircuito evalúan ambos operandos independientemente:

- **Operador `&` (AND sin cortocircuito)**: Ambos operandos siempre se evalúan.
- **Operador `|` (OR sin cortocircuito)**: Ambos operandos siempre se evalúan.

```scala
// Creación de un array de enteros
scala> val k = Array(1, 2, 3)
val k: Array[Int] = Array(1, 2, 3)
// k es un array con tres elementos en los índices 0, 1, 2

// Ejemplo 1: Tuple con elementos del array
scala> (k(0), k(1), k(2))
val res4: (Int, Int, Int) = (1, 2, 3)
// Se accede a cada elemento del array y se crea una tupla
// k(0) = 1, k(1) = 2, k(2) = 3

// Ejemplo 2: Intento de acceder a un índice fuera de rango
scala> k(3)
java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
// Error: El índice 3 no existe en el array (solo 0, 1, 2)
// Esto lanza una excepción

// Asignación de valor
scala> val i = 3
val i: Int = 3
// i ahora tiene el valor 3

// Ejemplo 3: Uso de operador de cortocircuito &&
scala> (i < 3) && k(i) >= 5
val res6: Boolean = false
// Evaluación:
// 1. Se evalúa (i < 3) = (3 < 3) = false
// 2. Como el resultado es false y se usa &&, la evaluación se corta
// 3. k(i) nunca se evalúa, por lo que NO ocurre IndexOutOfBoundsException
// 4. Se retorna false sin evaluar el segundo operando

// Ejemplo 4: Uso de operador sin cortocircuito &
scala> (i < 3) & k(i) >= 5
java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
// Evaluación:
// 1. Se evalúa (i < 3) = (3 < 3) = false
// 2. Con el operador &, ambos operandos SIEMPRE se evalúan
// 3. Se intenta evaluar k(i) = k(3), lo cual causa IndexOutOfBoundsException
// 4. El error ocurre porque no hay cortocircuito
```

**Tabla comparativa de operadores booleanos**:

| Operador | Tipo | Comportamiento |
|---|---|---|
| `&&` | Cortocircuito | Se detiene si el primer operando es `false` |
| `\|\|` | Cortocircuito | Se detiene si el primer operando es `true` |
| `&` | Sin cortocircuito | Siempre evalúa ambos operandos |
| `\|` | Sin cortocircuito | Siempre evalúa ambos operandos |

## Definiciones con `def` y `val`

### `def` - Evaluación por nombre

La palabra clave `def` se utiliza para definir funciones y valores que se evalúan **por nombre**. Esto significa que la expresión no se evalúa en el momento de la definición, sino únicamente cuando se invoca o se accede a ella.

```scala
// Ejemplo 1: Definición de una función con def
scala> def f(x: Int): Int = x
def f(x: Int): Int
// f es una función que toma un entero y lo retorna
// La función no se evalúa en este momento

// Ejemplo 2: Intento de definir una función con val
scala> val f(x: Int): Int = x
           ^
       error: not found: value f
// Error: No se puede usar val para definir funciones
// val espera un valor, no una definición de función

// Ejemplo 3: Intento similar con otro nombre
scala> val g(x: Int): Int = x
           ^
       error: not found: value g
// Error: Similar al anterior, val no puede definir funciones
```

### `val` - Evaluación por valor

La palabra clave `val` se utiliza para definir **valores inmutables** que se evalúan **por valor** en el momento de la definición.

```scala
// Ejemplo 1: Definición de función recursiva con def (evaluación por nombre)
scala> def loop1: Int = loop1
                       ^
       warning: method loop1 does nothing other than call itself recursively
def loop1: Int
// loop1 se define como una función recursiva infinita
// La definición es aceptada porque def evalúa por nombre
// loop1 no se evalúa en este momento, solo cuando se invoque
// Si se invocara loop1, causaría un StackOverflowError

// Ejemplo 2: Definición de valor recursivo con val (evaluación por valor)
scala> val loop2: Int = loop2
                       ^
       warning: value loop2 does nothing other than call itself recursively
val loop2: Int = 0
// loop2 intenta evaluarse inmediatamente (por valor)
// Esto causaría una recursión infinita
// Scala aplica la política de inicialización de Java, asignando 0 por defecto
// loop2 = 0 (valor predeterminado para Int en Java)

// Ejemplo 3: Asignación de una función recursiva definida con def a una variable val
scala> val loop3: Int = loop1
// loop3 = ?
// Explicación:
// loop1 es una definición por nombre (función recursiva infinita)
// Cuando se intenta asignar el valor de loop1 a loop3 (que es val, por valor)
// Se requiere evaluar loop1
// Como loop1 se define recursivamente sin caso base y se intenta evaluar,
// genera una recursión infinita que nunca termina
// (o causa StackOverflowError si hay límite de pila)
```

## Conceptos teóricos adicionales

**Expresión total vs expresión parcial**: Una expresión total es aquella que retorna un valor en todos los casos posibles. Una expresión parcial es aquella que solo retorna un valor en algunos casos. En lenguajes funcionales puros, las expresiones deben ser totales.

**Valor por defecto en Java/Scala**: Cuando se inicializa una variable con `val` de tipo `Int` sin un valor explícito, Scala/Java asigna 0 como valor por defecto. Esto es una característica de la interoperabilidad con Java.

**Evaluación perezosa vs evaluación estricta**: `def` implementa evaluación perezosa (la expresión se evalúa cuando se necesita), mientras que `val` implementa evaluación estricta (la expresión se evalúa inmediatamente).

**Diferencia funcional entre `def` y `val`**: Aunque ambos pueden parecer similares sintácticamente, `def` define una función (que se puede invocar múltiples veces) mientras que `val` define un valor inmutable (que se calcula una sola vez y se almacena).

**Recursión infinita**: Una función recursiva sin caso base que se define con `def` no causa error en la definición porque no se evalúa. Pero si se intenta usar (invocar), causa un `StackOverflowError` debido a la pila de llamadas infinita.

**Binding tardío vs binding temprano**: `def` proporciona binding tardío (la evaluación se pospone), mientras que `val` proporciona binding temprano (la evaluación ocurre inmediatamente).

---

## Tabla de resumen

| Concepto | Definición | Ejemplo |
|---|---|---|
| **Expresión total** | Retorna un valor en todos los caminos de ejecución | `if (cond) a else b` |
| **Expresión parcial** | Retorna un valor solo en algunos caminos | `if (cond) a` (sin else) |
| **Condicional (if-else)** | Estructura que evalúa una condición y retorna diferentes valores | `if (x > 18) "Mayor" else "Menor"` |
| **Booleano** | Tipo de dato que representa verdad o falsedad | `true`, `false` |
| **Operador `&&`** | AND con cortocircuito, se detiene en el primer `false` | `(i < 3) && k(i) >= 5` |
| **Operador `\|\|`** | OR con cortocircuito, se detiene en el primer `true` | `(x == 0) \|\| (y > 0)` |
| **Operador `&`** | AND sin cortocircuito, evalúa ambos operandos | Ambos operandos siempre se evalúan |
| **Operador `\|`** | OR sin cortocircuito, evalúa ambos operandos | Ambos operandos siempre se evalúan |
| **`def`** | Define funciones o valores evaluados por nombre (lazy) | `def f(x: Int): Int = x` |
| **`val`** | Define valores inmutables evaluados por valor (strict) | `val x = 5` |
| **Evaluación por nombre** | La expresión se evalúa solo cuando se necesita | Implementado por `def` |
| **Evaluación por valor** | La expresión se evalúa en el momento de la asignación | Implementado por `val` |
| **Recursión infinita** | Función que se llama a sí misma sin caso base | `def loop: Int = loop` |
| **StackOverflowError** | Error lanzado cuando la pila de llamadas se desborda | Resultado de invocar recursión infinita |
| **Cortocircuito** | Técnica para evitar evaluar operandos innecesarios | `&&` y `\|\|` |

### Comentarios adicionales

- **Seguridad del cortocircuito**: Los operadores de cortocircuito (`&&` y `||`) son especialmente importantes para evitar excepciones cuando la evaluación del segundo operando dependería de que el primero sea verdadero/falso.

- **Acceso a arrays**: En Scala, los arrays se acceden usando `array(índice)` (notación de paréntesis). Los índices son basados en 0, por lo que un array de longitud `n` tiene índices válidos de 0 a n-1.

- **Tuplas**: Una tupla es una colección ordenada e inmutable de elementos de posiblemente diferentes tipos. Se crea usando paréntesis: `(elem1, elem2, elem3)`.

- **Preferencia por cortocircuito**: En la mayoría de los casos, se recomienda usar los operadores con cortocircuito (`&&` y `||`) en lugar de sus versiones sin cortocircuito (`&` y `|`) porque son más eficientes y evitan evaluaciones innecesarias y posibles errores.

- **Funciones vs valores**: Una función definida con `def` es callable (se puede invocar con argumentos), mientras que un valor definido con `val` es un dato que se puede usar directamente. Aunque se pueden asignar funciones a valores, el comportamiento es diferente.

- **Uso práctico**: En la práctica, se usa `def` para funciones y métodos que se invocarán múltiples veces, y `val` para almacenar resultados de cálculos que no cambian.

- **Inferencia de tipos**: En muchos casos, Scala puede inferir el tipo de una variable `val` sin que sea necesario especificarlo explícitamente, haciendo el código más conciso.