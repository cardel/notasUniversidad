# Alcance léxico

El alcance léxico (lexical scope) es el mecanismo mediante el cual se determina qué variables y funciones son visibles (accesibles) en una parte específica del código. En Scala, el alcance se determina por la estructura del código fuente, no por el orden de ejecución.

## Ejemplo introductorio: Encapsulación de funciones auxiliares

Analizaremos el siguiente ejemplo:

```scala
object Distancia {
  // Funciones auxiliares definidas a nivel del objeto
  def raiz(n: Double): Double = {
    Math.sqrt(n)
  }

  def sumaCuadrados(a: Double, b: Double): Double = {
    a*a + b*b
  }

  def diferencia(a: Double, b: Double): Double = {
    a - b
  }

  // Función principal que usa las funciones auxiliares
  def distancia(x0: Double, y0: Double, x1: Double, y1: Double): Double = {
    raiz(sumaCuadrados(diferencia(x0, x1), diferencia(y0, y1)))
  }

  def main(args: Array[String]): Unit = {
    // Se invoca la función distancia
    println(distancia(0, 0, 1, 1))
    // Cálculo: distancia entre (0,0) y (1,1) = √((1-0)² + (1-0)²) = √2 ≈ 1.414
    
    println(distancia(2, 2, 4, 4))
    // Cálculo: distancia entre (2,2) y (4,4) = √((4-2)² + (4-2)²) = √8 ≈ 2.828
  }
}
```

### Problema: Funciones auxiliares expuestas

En el código anterior, las funciones `raiz`, `sumaCuadrados` y `diferencia` son visibles a nivel del objeto `Distancia`. Sin embargo, estas son solo funciones auxiliares que deberían usarse únicamente dentro de `distancia`. **Estas funciones no deberían ser visibles desde el exterior**.

### Solución: Encapsulación mediante anidamiento

Para solucionar esto, encapsulamos las funciones auxiliares dentro de `distancia`, limitando su alcance solo a esa función:

```scala
object Distancia {
  // Función principal que contiene sus funciones auxiliares
  def distancia(x0: Double, y0: Double, x1: Double, y1: Double): Double = {
    // Función auxiliar: calcula la raíz cuadrada
    def raiz(n: Double): Double = {
      Math.sqrt(n)
      // Calcula la raíz cuadrada usando la biblioteca Math de Scala
    }

    // Función auxiliar: calcula la suma de cuadrados
    def sumaCuadrados(a: Double, b: Double): Double = {
      a*a + b*b
      // Retorna a² + b²
    }

    // Función auxiliar: calcula la diferencia entre dos valores
    def diferencia(a: Double, b: Double): Double = {
      a - b
      // Retorna a - b
    }

    // Cuerpo de la función distancia usando las funciones auxiliares
    raiz(sumaCuadrados(diferencia(x0, x1), diferencia(y0, y1)))
    // Cálculo: √((x0-x1)² + (y0-y1)²)
  }

  // Función principal del programa
  def main(args: Array[String]): Unit = {
    // Se invoca la función distancia
    println(distancia(0, 0, 1, 1))
    // Cálculo: distancia entre (0,0) y (1,1) = √2 ≈ 1.414
    
    println(distancia(2, 2, 4, 4))
    // Cálculo: distancia entre (2,2) y (4,4) = √8 ≈ 2.828
  }
}
```

**Ventaja**: Ahora las funciones `raiz`, `sumaCuadrados` y `diferencia` solo son accesibles dentro del alcance de `distancia`. No son visibles desde fuera de la función, mejorando el encapsulamiento y reduciendo la complejidad del API público.

## Shadowing (Enmascaramiento de variables)

El shadowing ocurre cuando una variable o parámetro en un alcance interno tiene el mismo nombre que una variable en un alcance externo. La variable interna "oculta" o "enmascara" la variable externa, haciendo que la variable externa sea inaccesible dentro de ese alcance.

```scala
// Ejemplo de shadowing
val x = 10
// x se define en el alcance externo con valor 10

def f(x: Int): Int = x + 3
// El parámetro x en f enmascara (shadows) la variable x del alcance externo
// Dentro de f, x se refiere al parámetro, no a la variable externa

scala> f(5)
// Invocación: se pasa 5 como argumento
// Dentro de f: x = 5 (no 10)
// Resultado: 5 + 3 = 8
val res0: Int = 8

scala> f(x)
// Invocación: se pasa la variable x (que tiene valor 10)
// Dentro de f: x = 10 (el parámetro recibe el valor de la variable x)
// Resultado: 10 + 3 = 13
val res1: Int = 13
```

**Explicación**: Dentro de `f`, la ocurrencia de `x` siempre se refiere al parámetro `x`, no a la variable global `x`. Esto es el shadowing: el parámetro local enmascara la variable del alcance externo.

## Bloques y valor de retorno

En Scala, un bloque es una secuencia de expresiones encerradas entre llaves `{}`. **El valor del bloque es siempre el valor de la última expresión dentro del bloque**. Todas las expresiones anteriores se evalúan, pero sus valores se descartan (aunque pueden tener efectos secundarios).

```scala
// Ejemplo: Bloque que asigna a una variable
scala> val x = {
     |   1
     |   2
     |   3
     |   34
     |   4
     |   5
     | }
       1
       ^
On line 2: warning: a pure expression does nothing in statement position
       2
       ^
On line 3: warning: a pure expression does nothing in statement position
       3
       ^
On line 4: warning: a pure expression does nothing in statement position
       34
       ^
On line 5: warning: a pure expression does nothing in statement position
       4
       ^
On line 6: warning: a pure expression does nothing in statement position
val x: Int = 5
// El compilador advierte que las expresiones 1, 2, 3, 34, 4 no hacen nada
// Su valor se descarta, solo 5 (la última expresión) es el valor del bloque
// Por lo tanto, x = 5

scala> x
val res0: Int = 5
// Se verifica que x contiene el valor 5
```

**Observación**: Los avisos (warnings) indican que las expresiones `1`, `2`, `3`, `34` y `4` son expresiones puras que no tienen efectos secundarios, por lo que sus valores se descartan. Solo la última expresión (`5`) contribuye al valor final del bloque.

### Uso práctico de bloques

```scala
// Ejemplo 1: Bloque con definiciones y cálculo
val resultado = {
  val a = 10
  val b = 20
  // Variables definidas dentro del bloque, no visibles fuera
  a + b
  // La última expresión es el valor del bloque
}
// resultado = 30

// Ejemplo 2: Bloque con efectos secundarios
val z = {
  println("Calculando...")
  // Efecto secundario: imprime en pantalla
  100
  // Última expresión, valor del bloque
}
// z = 100
// La salida será: "Calculando..."
```

## Conceptos teóricos adicionales

**Alcance (scope)**: Es la región del código donde una variable o función es accesible. El alcance está determinado por la estructura léxica del código fuente.

**Alcance léxico vs alcance dinámico**: En Scala se utiliza alcance léxico, que significa que el alcance de una variable se determina por donde está definida en el código fuente. El alcance dinámico, usado en algunos lenguajes como versiones antiguas de Lisp, determinaba el alcance en tiempo de ejecución.

**Encapsulación**: Es la práctica de ocultar detalles de implementación (como funciones auxiliares) dentro de una función o módulo, exponiendo solo lo necesario. El anidamiento de funciones es una forma de encapsulación.

**Variable oculta (shadowing)**: Ocurre cuando una nueva variable con el mismo nombre se define en un alcance más interno, ocultando la variable del alcance externo. Aunque sintácticamente válido, generalmente se considera una mala práctica porque puede causar confusión.

**Ligadura de variables (variable binding)**: Es el proceso de asociar un nombre a un valor o expresión. Las ligaduras se resuelven usando alcance léxico en Scala.

**Bloques como expresiones**: En Scala, los bloques son expresiones completas que retornan valores, permitiendo una composición flexible del código.

**Variables locales**: Variables definidas dentro de una función o bloque que no son accesibles fuera de ese ámbito.

**Efectos secundarios en bloques**: Aunque un bloque retorna solo el valor de la última expresión, las expresiones anteriores pueden tener efectos secundarios (como imprimir, modificar estado global, etc.) que ocurren durante la evaluación.

---

## Tabla de resumen

| Concepto | Definición | Ejemplo |
|---|---|---|
| **Alcance léxico** | Región del código donde una variable es accesible, determinada por la estructura del código fuente | Variable accesible dentro de la función donde se define |
| **Encapsulación** | Práctica de ocultar detalles de implementación dentro de una función o módulo | Funciones auxiliares anidadas dentro de una función principal |
| **Función anidada** | Función definida dentro de otra función, accesible solo en el alcance de la función externa | `def distancia(...) { def raiz(...) { ... } }` |
| **Shadowing** | Enmascaramiento de una variable externa por una variable local con el mismo nombre | Parámetro `x` oculta la variable global `x` |
| **Bloque** | Secuencia de expresiones encerradas entre llaves `{}` | `val x = { 1; 2; 3 }` |
| **Valor de bloque** | La última expresión dentro de un bloque es su valor de retorno | En `{ 1; 2; 5 }`, el valor es 5 |
| **Expresión pura** | Expresión sin efectos secundarios cuyo valor se descarta | `1`, `2`, `3` en un bloque cuando no es la última |
| **Variable local** | Variable definida dentro de una función o bloque, no accesible fuera | Variables dentro de una función `def` |
| **Ligadura de variables** | Asociación de un nombre a un valor o expresión | `val x = 10` liga `x` al valor 10 |
| **Alcance dinámico** | Alcance determinado en tiempo de ejecución por la pila de llamadas | No se usa en Scala, contrario al alcance léxico |
| **Efectos secundarios** | Cambios de estado observables durante la ejecución (imprimir, modificar variables globales) | `println(...)` es un efecto secundario |

### Comentarios adicionales

- **Preferencia por encapsulación**: Es una buena práctica encapsular funciones auxiliares dentro de funciones principales cuando solo se usan internamente. Esto mejora la claridad del código y reduce la complejidad del API público.

- **Evitar shadowing**: Aunque Scala permite shadowing, generalmente se considera una mala práctica porque puede causar confusión y errores sutiles. Es mejor usar nombres distintos para variables en diferentes alcances.

- **Bloques y funciones anónimas**: Los bloques son la base de las funciones anónimas en Scala. Una función anónima es esencialmente un bloque que toma parámetros.

- **Valor vs efecto secundario**: Es importante distinguir entre el valor de una expresión (el resultado que se retorna) y sus efectos secundarios (cambios observables en el estado). El valor de un bloque es el de la última expresión, pero todas las expresiones anteriores pueden tener efectos secundarios.

- **Advertencias del compilador**: Los avisos del compilador sobre expresiones puras que no hacen nada son útiles para identificar código que probablemente no es intencional. Si una expresión intermedia es necesaria por sus efectos secundarios (como `println`), debería aparecer antes de la última expresión.

- **Alcance en colecciones**: Las funciones anidadas en colecciones (como en `map`, `filter`) tienen acceso a las variables del alcance donde se define la función, permitiendo crear closures que capturan variables externas.

- **Reasignación en bloques**: A diferencia de funciones, `val` dentro de un bloque no puede ser reasignado dentro de ese bloque. Si se necesita reasignación, se debe usar `var`, aunque esto se desalienta en programación funcional.