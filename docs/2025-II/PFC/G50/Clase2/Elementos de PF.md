# Tipos de evaluación

## Evaluación por valor

Se les conoce como evaluación ansiosa, esto quiere decir que se evaluan de inmediato
La evaluación ocurre de izquierda a derecha

**Evaluación por Valor en Scala (Paso a Paso)**

La evaluación por valor evalúa **todos los argumentos de izquierda a derecha** antes de invocar la función. Cada parámetro se reduce a un valor concreto secuencialmente.

---

**Ejemplo 1: Función Simple**
```scala
def funcion(a:Int, b:Int): Int = {
    a
}

funcion(2, 3)
```

**Evaluación paso a paso:**
1. `funcion(2, 3)` ← Se evalúa primer argumento (2)
2. `funcion(2, 3)` ← Se evalúa segundo argumento (3)  
3. `funcion(2, 3)` ← Ahora se invoca la función con valores concretos
4. `2` ← La función devuelve el primer parámetro

---

**Ejemplo 2: Función con Expresiones Anidadas**
```scala
def suma(a:Int, b:Int):Int = {
    a + b
}

def f(a:Int, b:Int): Int = {
    suma(a, a + b)
}

def g(x:Int, y:Int): Int = {
    f(x, x)
}

g(3, 4)
```

**Evaluación paso a paso (izquierda a derecha):**
1. `g(3, 4)` ← Evalúa x=3 (primer argumento)
2. `g(3, 4)` ← Evalúa y=4 (segundo argumento)
3. `f(3, 3)` ← Evalúa x=3 (primer argumento de f)
4. `f(3, 3)` ← Evalúa x=3 (segundo argumento de f)
5. `suma(3, 3 + 3)` ← Evalúa a=3 (primer argumento de suma)
6. `suma(3, 6)` ← Evalúa a+b → 3+3=6 (segundo argumento de suma)
7. `3 + 6` ← Ejecuta la suma con valores concretos
8. `9` ← Resultado final

---

**Reglas Clave de Evaluación por Valor:**
1. **Orden izquierda-derecha**: Los argumentos se evalúan en el orden en que aparecen
2. **Evaluación completa**: Cada expresión se reduce completamente antes de continuar
3. **Una sola evaluación**: Cada parámetro se calcula exactamente una vez
4. **Invocación con valores**: La función solo se ejecuta con valores concretos

**Ventaja:** Evita cálculos repetidos de los mismos parámetros
**Caso típico:** Cuando los parámetros se usan múltiples veces dentro de la función

Este enfoque garantiza predictibilidad y eficiencia, aunque puede calcular valores que eventualmente no se utilicen en el cuerpo de la función.

# Evaluación por nombre

Los parametros se evaluan **cuando se utilizan**, para esto se debe tener en cuenta que únicamente vamos a evaluar un parámetro cuando lo requerimos en una operación
Los parametros se evaluan de izquierda a derecha

**Evaluación por Nombre en Scala (Paso a Paso)**

En la evaluación por nombre, los parámetros **no se evalúan inmediatamente**. En su lugar, se evalúan **solo cuando se utilizan** dentro del cuerpo de la función, y siempre de izquierda a derecha según el orden de uso.

---

**Ejemplo 1: Función Simple**
```scala
def funcion(a: => Int, b: => Int): Int = {
    a  // Solo se evalúa 'a' cuando se usa aquí
}

funcion(2, 3)
```

**Evaluación paso a paso:**
1. `funcion(2, 3)` ← No se evalúan los parámetros todavía
2. `a` ← Se evalúa el primer parámetro (2) cuando se usa
3. `2` ← Resultado final (nunca se evaluó 'b')

---

**Ejemplo 2: Función con Expresiones Anidadas**
```scala
def suma(a: => Int, b: => Int): Int = {
    a + b  // Se evalúan en orden de uso (primero a, luego b)
}

def f(a: => Int, b: => Int): Int = {
    suma(a, a + b)  // Los parámetros se evalúan cuando suma los use
}

def g(x: => Int, y: => Int): Int = {
    f(x, x)  // Los parámetros se evalúan cuando f los use
}

g(3, 4)
```

**Evaluación paso a paso:**
1. `g(3, 4)` ← No se evalúan x ni y todavía
2. `f(x, x)` ← Se invoca f, pero aún no se evalúan parámetros
3. `suma(a, a + b)` ← Se invoca suma
4. `a` ← Se evalúa primer parámetro de suma: x → 3
5. `a + b` ← Se evalúa segundo parámetro: a + b
6. `a` ← Se evalúa a: x → 3
7. `b` ← Se evalúa b: x → 3
8. `3 + 3` ← Resultado: 6
9. `suma(3, 6)` ← Ahora se ejecuta la suma
10. `3 + 6` ← Operación con valores concretos
11. `9` ← Resultado final

---

**Reglas Clave de Evaluación por Nombre:**
1. **Evaluación diferida**: Los parámetros se evalúan solo cuando se necesitan
2. **Orden de uso**: Se evalúan de izquierda a derecha según aparecen en las operaciones
3. **Posible reevaluación**: Si un parámetro se usa múltiples veces, se evalúa cada vez
4. **Sintaxis**: `: => Tipo` indica evaluación por nombre

**Ventaja:** Evita cálculos innecesarios de parámetros que no se usan
**Desventaja:** Puede recalcular múltiples veces el mismo parámetro

# Comparativa evaluación por valor y evaluación por nombre

**Explicación de Evaluación por Valor vs. Por Nombre en REPL**

---

**Caso 1: `val x: Int = x` (Evaluación por Valor)**
```scala
val x: Int = x
// ↑ Evaluación por VALOR: Se intenta evaluar 'x' inmediatamente
// Pero 'x' aún no está definida → Error de referencia circular
// Scala asigna valor por defecto (0) para evitar el error
```

**Comportamiento:**
- Evaluación por valor **exige evaluación inmediata** del lado derecho
- Como `x` se referencia a sí misma antes de existir, sería recursión infinita
- **Propiedad del lenguaje**: Scala asigna valor por defecto (0 para Int) para evitar crash
- Resultado: `val x: Int = 0`

---

**Caso 2: `def x: Int = x` (Evaluación por Nombre)**
```scala
def x: Int = x
// ↑ Evaluación por NOMBRE: 'x' no se evalúa inmediatamente
// Solo se evalúa cuando se invoca → Recursión infinita al usarla
```

**Comportamiento:**
- La definición se crea sin problemas (evaluación diferida)
- Al invocar `x`, se evalúa el cuerpo: `x → x → x → ...`
- **Stack overflow** en tiempo de ejecución (no compilación)
- No hay valor por defecto porque es una definición, no asignación

---

**Diferencias Clave:**

| Aspecto        | `val x: Int = x` (Por Valor) | `def x: Int = x` (Por Nombre) |
| -------------- | ---------------------------- | ----------------------------- |
| **Evaluación** | Inmediata                    | Diferida                      |
| **Error**      | En compilación               | En ejecución                  |
| **Solución**   | Valor por defecto (0)        | Stack overflow                |
| **Naturaleza** | Asignación de valor          | Definición de método          |

**Por qué `val` tiene valor por defecto:**
- Scala prioriza la seguridad en inicialización de variables
- Evita errores de null para tipos primitivos
- Mantiene la consistencia del programa aunque haya referencia circular
- Es una decisión de diseño del lenguaje para prevenir crashes

**Conclusión:** La evaluación estricta (por valor) con valores por defecto previene errores de compilación, mientras que la evaluación por nombre difiere el problema hasta el momento de uso.
# Bloques

Son un elemento secuencial dentro de la programación funcional, el valor que se toma es el último.
```scala
{
 //instruccion 1
 //instruccion 2
 //..
 //instruccion n
}
```
En este caso se va retornar el último valor


**Explicación de Bloques y Ocultamiento de Variables en Scala**

En Scala, los bloques `{}` definen un **ámbito léxico** donde las variables declaradas dentro existen solo dentro de ese bloque. Las variables internas **ocultan** (shadow) las externas con el mismo nombre.

---

**Código con Explicación:**
```scala
object Alcance {
  def main(args: Array[String]): Unit = {
    // Bloque 1
    val x = {
      val x = 8      // x interno (oculta cualquier x externa)
      val y = 2      // y solo existe en este bloque
      x + y          // resultado: 8 + 2 = 10
    }
    println(x)       // Imprime 10 (el valor asignado a x externa)
    
    // Bloque 2
    val z = {
      // Bloque interno 2.1
      val t = {
        val x = 4    // x interno (oculta x externa)
        println("x = " + x)  // Imprime "x = 4" (x interno)
        val y = 5    // y interno
        x * y        // 4 * 5 = 20
      }
      
      println("x = " + x)  // Imprime "x = 10" (x del scope principal)
      val z = 8      // z interno (oculta z externa)
      val w = 2      // w interno
      t + z + w      // 20 + 8 + 2 = 30
    }
    println(z)       // Imprime 30 (z del scope principal)
  }
}
```

---

**Conceptos Clave:**

1. **Bloques con ámbito**: Cada `{}` crea un nuevo ámbito donde las variables son locales
2. **Ocultamiento (Shadowing)**: Una variable interna con el mismo nombre oculta la externa
3. **Jerarquía de ámbitos**: Los bloques internos pueden acceder variables externas, pero no viceversa
4. **Evaluación de bloques**: El valor del bloque es el resultado de su última expresión

**Salida del Programa:**
```
10
x = 4
x = 10
30
```

**Ventajas Funcionales:**
- Encapsulación natural de variables temporales
- Evita efectos secundarios entre diferentes partes del código
- Permite reuso de nombres de variables sin conflictos
- Favorece la inmutabilidad dentro de bloques locales

Este patrón es fundamental en programación funcional para manejar el estado de manera controlada y predecible.