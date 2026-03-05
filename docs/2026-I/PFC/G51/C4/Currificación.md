# Funciones que retornan funciones

En programación funcional podemos especificar funciones que retornan otras funciones como resultado.

```scala
object Funciones {
  // Función que recibe dos enteros y retorna una función (Int, Int) => Int
  def f(a: Int, b: Int): (Int, Int) => Int = {
    // Función interna que será retornada
    def aux(c: Int, d: Int): Int = {
      a + b + c + d  // Accede a los parámetros externos a y b (closure)
    }
    aux  // Retorna la función aux
  }

  def main(args: Array[String]): Unit = {
    println(f(1, 2))  // Imprime la representación de la función lambda
    println(f(1, 2)(3, 4))  // Evalúa: 1 + 2 + 3 + 4 = 10
  }
}
```

- `f(1, 2)` retorna una función que espera dos enteros y devuelve un entero
- `f(1, 2)(3, 4)` primero evalúa `f(1, 2)` (que establece `a = 1` y `b = 2`), luego aplica `(3, 4)` a la función retornada (estableciendo `c = 3` y `d = 4`), devolviendo el valor entero `10`

# Currificación (Currying)

La currificación es una técnica que transforma una función con múltiples argumentos en una secuencia de funciones, cada una con un solo argumento. En lugar de `f(a, b, c)`, tenemos `f(a)(b)(c)`.

```scala
object Suma {
  // Versión tradicional con múltiples parámetros
  def suma(a: Int, b: Int): Int = a + b

  // Versión currificada: recibe un parámetro y retorna una función
  def sumac(a: Int)(b: Int): Int = a + b

  def main(args: Array[String]): Unit = {
    println(suma(1, 3))  // 4
    println(sumac(1)_)   // Aplicación parcial: retorna una función Int => Int
    println(sumac(1)(3)) // 4
  }
}
```

La versión `suma` recibe dos parámetros simultáneamente, mientras que la versión currificada `sumac` recibe primero `a` y retorna una función que recibe `b`.

```scala
sumac(1)   // Aplicación parcial: establece a = 1, retorna función Int => Int
sumac(1)(2) // Aplicación completa: establece a = 1, b = 2, retorna 3
```

## Ventajas de la currificación

1. **Aplicación parcial**: Permite fijar algunos argumentos y crear nuevas funciones especializadas
2. **Mayor expresividad**: Facilita la notación infija en operadores
3. **Composición de funciones**: Mejora la capacidad de combinar funciones

La notación infija (como `x + 10` en lugar de `x.+(10)`) es posible gracias a que los operadores en Scala son métodos que reciben un solo parámetro, lo que se relaciona conceptualmente con la currificación.

Ejemplo en Python (para comparación):
```python
>>> x = 3
>>> x + 10  # Notación infija
13
>>> x.__add__(10)  # Notación de método
13
```

## Ejemplos avanzados de currificación

```scala
// Función currificada con tres grupos de parámetros
def fun(x: Int)(f: Int => Int)(g: (Int, Int) => Int): Int = g(f(x), f(x))

// Uso progresivo:
fun(10)_                     // Retorna: (Int => Int) => ((Int, Int) => Int) => Int
fun(10)(x => x)_             // Retorna: ((Int, Int) => Int) => Int
fun(10)(x => x)((a: Int, b: Int) => a + b)  // Retorna: 20
```

En general, la currificación permite especificar funciones únicamente con un solo parámetro por cada nivel de aplicación.

## Aplicación práctica: Derivada numérica

```scala
// Función currificada para calcular derivadas numéricas
// dx: incremento infinitesimal
// f: función a derivar
// x: punto donde evaluar la derivada
def derivada(dx: Double)(f: Double => Double)(x: Double): Double = 
  (f(x + dx) - f(x)) / dx

// Ejemplos de uso:
derivada(0.00001)(x => 3 * x * x * x)(10)        // Derivada de 3x³ en x=10 ≈ 900
derivada(0.00001)(x => 8 * Math.exp(x))(10)      // Derivada de 8e^x en x=10 ≈ 176212.6
derivada(0.00001)(x => 2 * x + 3)(10)            // Derivada de 2x+3 en x=10 ≈ 2.0
```

# Conceptos teóricos adicionales

## Closures (Cierres)
Un closure es una función que captura variables de su contexto léxico. En el ejemplo inicial, la función `aux` captura los parámetros `a` y `b` de su función contenedora `f`.

## Aplicación parcial vs. total
- **Aplicación total**: Se proporcionan todos los argumentos de una función
- **Aplicación parcial**: Se proporcionan algunos argumentos, creando una nueva función con los restantes

## Sintaxis de guión bajo (`_`)
El guión bajo `_` en Scala tiene múltiples usos:
1. **Aplicación parcial**: `sumac(1)_` convierte la función currificada en una función de un argumento
2. **Placeholder**: `_ + _` representa una función anónima con dos parámetros
3. **Ignorar parámetros**: En patrones matching, `case _ =>` captura cualquier valor

## Notación infija
En Scala, cualquier método que recibe un solo parámetro puede usarse con notación infija:
```scala
// Estas dos expresiones son equivalentes:
x.+(10)
x + 10
```

## Diferencias entre currificación y funciones de múltiples parámetros

| Aspecto | Función tradicional | Función currificada |
|---------|-------------------|-------------------|
| **Firma** | `(A, B) => C` | `A => B => C` |
| **Aplicación** | `f(a, b)` | `f(a)(b)` |
| **Aplicación parcial** | Requiere función wrapper | Directa: `f(a)_` |
| **Composición** | Menos flexible | Más flexible |

# Tabla de resumen

| Concepto | Definición | Ejemplo en Scala | Aplicación |
|----------|------------|------------------|------------|
| **Función que retorna función** | Función cuyo tipo de retorno es otra función | `def f(a:Int): Int => Int` | Creación de funciones especializadas |
| **Currificación** | Transformación de función multi-parámetro en cadena de funciones unarias | `def f(a:Int)(b:Int): Int` | Aplicación parcial, composición |
| **Closure** | Función que captura variables de su contexto léxico | `def f(a:Int) = (b:Int) => a + b` | Mantener estado entre llamadas |
| **Aplicación parcial** | Proporcionar algunos argumentos a una función | `sumac(1)_` | Crear funciones especializadas |
| **Notación infija** | Sintaxis `objeto método argumento` para métodos de un parámetro | `x + 10` en lugar de `x.+(10)` | Mejorar legibilidad de operadores |
| **Derivada numérica** | Aproximación de derivada usando diferencia finita | `(f(x+dx)-f(x))/dx` | Cálculo numérico, análisis matemático |

# Comentarios adicionales

1. **Ventajas de la currificación**:
   - **Flexibilidad**: Permite crear funciones especializadas mediante aplicación parcial
   - **Composicionalidad**: Facilita la combinación de funciones
   - **Lazy evaluation**: Los argumentos pueden evaluarse en diferentes momentos
   - **Interfaz fluida**: Mejora la legibilidad en DSLs (Domain Specific Languages)

2. **Consideraciones de rendimiento**:
   - La currificación puede crear múltiples objetos función en tiempo de ejecución
   - En algunos casos, puede afectar el rendimiento por la creación de closures
   - Para código crítico, evaluar el uso de funciones tradicionales

3. **Patrones de diseño relacionados**:
   - **Factory pattern**: Funciones que retornan funciones especializadas
   - **Strategy pattern**: Intercambio de algoritmos mediante funciones parámetro
   - **Decorator pattern**: Envolver funciones con comportamiento adicional

4. **Aplicaciones prácticas**:
   - **Configuración**: `configurar(dbUrl)(dbUser)(dbPass)`
   - **Validación**: `validar(regla1)(regla2)(dato)`
   - **Transformaciones**: `transformar(preproceso)(proceso)(postproceso)`
   - **Inyección de dependencias**: `servicio(config)(logger)(db)`

5. **Buenas prácticas**:
   - Usar currificación cuando se beneficie de aplicación parcial
   - Documentar claramente los grupos de parámetros
   - Considerar límites razonables (más de 3-4 niveles puede ser confuso)
   - Usar tipos de alias para funciones complejas: `type Transformador = Int => Int => Int`

6. **Extensiones del concepto**:
   - **Currificación automática**: Scala puede currificar automáticamente con `curried`
   - **Uncurrying**: Proceso inverso con `uncurried`
   - **Funciones de orden superior currificadas**: `def map[A,B](f: A => B): List[A] => List[B]`

7. **Relación con cálculo lambda**:
   - La currificación es natural en cálculo lambda, donde todas las funciones son unarias
   - `λa.λb.a+b` es la forma currificada de la suma
   - Esta correspondencia fundamenta teóricamente la currificación en lenguajes funcionales

8. **En la biblioteca estándar de Scala**:
   - Muchas funciones en colecciones están currificadas
   - Los métodos `foldLeft` y `foldRight` usan currificación implícita
   - Los operadores (`+`, `-`, `*`, `/`) son métodos currificados por diseño