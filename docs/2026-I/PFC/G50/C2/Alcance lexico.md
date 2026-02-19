# Alcance léxico

Para la raíz cuadrada usamos el método de Newton, que consiste en calcular la raíz de $x$, que es $y$, mediante la aproximación:

- $y$ arranca en 1.0
- Si no se cumple que $|y \cdot y - x| < \text{valor pequeño}$ mejoramos la estimación

$$y_2 = \frac{\frac{x}{y} + y}{2}$$

- Repetimos el proceso hasta que cumpla la condición

```scala
  // Función que calcula el valor absoluto de un número
  def abs(x:Double):Double = if (x < 0) -x else x

  // Función que mejora la estimación actual usando la fórmula de Newton
  // Recibe la estimación actual y el valor del cual queremos encontrar la raíz
  def mejorar(estimacion:Double, x:Double):Double = (x / estimacion + estimacion) / 2

  // Función que verifica si la estimación es suficientemente buena
  // Compara el cuadrado de la estimación con el valor original
  // La estimación es buena si el error absoluto es menor a 0.001
  def esBuenaEstimacion(estimacion:Double, x:Double):Boolean = abs(estimacion * estimacion - x) < 0.001

  // Función recursiva que calcula la raíz cuadrada iterativamente
  // Continúa mejorando la estimación hasta que sea suficientemente buena
  def raizCuadrada(x:Double, estimacion:Double):Double = {
    if (esBuenaEstimacion(estimacion, x)) estimacion
    else raizCuadrada(x, mejorar(estimacion, x))
  }

  // Función principal que inicia el cálculo con una estimación inicial de 1.0
  def raiz(x:Double):Double = raizCuadrada(x, 1.0)

  def main(args: Array[String]): Unit = {
    println(raiz(2))
    println(raiz(3))
    println(raiz(4))
  }
```

Ahora vamos a mejorar la estructura de este código. Bajo este enfoque los bloques permiten tener secuencialidad y encapsulamiento de funciones auxiliares.

```scala
  // La función raiz utiliza un bloque para encapsular las funciones auxiliares
  // De esta forma, mejorar, esBuenaEstimacion y raizCuadrada no son accesibles desde fuera
  def raiz(x:Double):Double = {

    // abs es una función local. Tiene un parámetro x que genera shadowing (ocultamiento)
    // El parámetro x de abs oculta el parámetro x de raiz dentro del cuerpo de abs
    // Fuera de abs, el x que se encuentra en el bloque de raiz sigue siendo el parámetro de raiz
    def abs(x:Double):Double = if (x < 0) -x else x

    // mejorar es una función que accede al parámetro x de raiz gracias al alcance léxico
    // No es necesario pasar x como parámetro porque puede accederlo desde su ámbito exterior
    // Esta función mejora la estimación usando la fórmula: (x/estimacion + estimacion)/2
    def mejorar(estimacion:Double):Double = (x / estimacion + estimacion) / 2

    // esBuenaEstimacion también accede al parámetro x de raiz por alcance léxico
    // Utiliza la función local abs para calcular el valor absoluto de la diferencia
    // Retorna verdadero si la estimación al cuadrado está lo suficientemente cerca de x
    def esBuenaEstimacion(estimacion:Double):Boolean = abs(estimacion * estimacion - x) < 0.001

    // raizCuadrada es una función recursiva que mejora iterativamente la estimación
    // Accede a mejorar y esBuenaEstimacion, que a su vez acceden a x por alcance léxico
    // Esta es una recursión lineal de cola, que optimiza la memoria en Scala
    def raizCuadrada(estimacion:Double):Double = {
      if (esBuenaEstimacion(estimacion)) estimacion
      else raizCuadrada(mejorar(estimacion))
    }

    // El bloque devuelve el valor de raizCuadrada con estimación inicial 1.0
    // Este es el último valor evaluado dentro del bloque
    raizCuadrada(1.0)
  }

  def main(args: Array[String]): Unit = {
    println(raiz(2))
    println(raiz(3))
    println(raiz(4))
  }
```

Utilizando bloques puedo integrar funciones auxiliares de tal forma que no sean accesibles desde afuera y puedo aprovechar que hay referencias que son las mismas. Este es el caso de $x$ en las funciones `mejorar`, `esBuenaEstimacion` y `raizCuadrada`. Gracias al alcance léxico, estas funciones pueden acceder a $x$ sin que sea necesario pasarlo como parámetro explícitamente.

El bloque siempre devuelve como resultado el último valor evaluado en su interior:

```scala
// Ejemplo de cómo un bloque en Scala devuelve su última expresión
scala> val x = {
       1
       2
       3
       4}

// x ahora contiene el valor 4, que es el último valor evaluado en el bloque
scala> x
val res1: Int = 4
```

## Conceptos teóricos relevantes

**Método de Newton (o método Newton-Raphson)**: es un algoritmo iterativo para encontrar aproximaciones de raíces de funciones diferenciables. Para calcular la raíz cuadrada de un número $a$, comenzamos con una estimación inicial $x_0$ y aplicamos iterativamente la fórmula:

$$x_{n+1} = \frac{1}{2}\left(x_n + \frac{a}{x_n}\right)$$

Este método converge rápidamente hacia la raíz verdadera. En nuestro código, la estimación inicial es 1.0 y mejoramos usando la función `mejorar`.

**Alcance léxico (lexical scoping)**: es el mecanismo mediante el cual las funciones pueden acceder a las variables y parámetros de las funciones en cuyas que están definidas. El alcance se determina en el momento de la definición, no en el de la ejecución. En nuestro ejemplo, `mejorar` y `esBuenaEstimacion` pueden acceder a $x$ porque están definidas dentro del bloque de `raiz`, que tiene $x$ como parámetro. Este parámetro permanece accesible durante toda la ejecución de las funciones internas.

**Shadowing (ocultamiento de variables)**: ocurre cuando una variable o parámetro en un ámbito interno tiene el mismo nombre que una variable en un ámbito exterior. El identificador interno "oculta" o "sombrea" al externo, impidiendo el acceso directo a este último dentro del ámbito interno. En nuestro código, el parámetro $x$ de `abs` oculta el parámetro $x$ de `raiz` dentro del cuerpo de `abs`. Sin embargo, esto no causa conflictos porque dentro de `abs` solo usamos el $x$ local, y en las otras funciones usamos el $x$ externo.

**Encapsulamiento mediante bloques**: los bloques en Scala permiten agrupar definiciones y expresiones dentro de un ámbito local. Las funciones definidas dentro de un bloque no son visibles fuera de él, lo que proporciona encapsulamiento y evita contaminar el espacio de nombres global. El resultado del bloque es el de la última expresión evaluada.


**Iteración vs. Recursión**: aunque `raizCuadrada` está implementada recursivamente, el proceso es esencialmente iterativo: cada llamada genera una nueva estimación y verifica si es suficientemente buena. La recursión de cola permite que Scala ejecute esto de manera eficiente, similar a un bucle `while` en lenguajes imperativos.

## Tabla de resumen

| Concepto | Descripción | Ejemplo en el código |
|----------|-------------|----------------------|
| Método de Newton | Algoritmo iterativo que utiliza la derivada para aproximar raíces. Fórmula: $x_{n+1} = \frac{1}{2}(x_n + \frac{a}{x_n})$ | `mejorar(estimacion):Double = (x / estimacion + estimacion) / 2` |
| Alcance léxico | Capacidad de una función interna para acceder a variables y parámetros de la función que la contiene. El alcance se determina por la estructura del código, no por el flujo de ejecución. | `mejorar` y `esBuenaEstimacion` acceden al parámetro `x` de `raiz` sin recibirlo como argumento |
| Shadowing | Cuando una variable local tiene el mismo nombre que una variable en un ámbito exterior, la local oculta a la externa. | El parámetro `x` de `abs` oculta el parámetro `x` de `raiz` dentro del cuerpo de `abs` |
| Bloque en Scala | Estructura que agrupa expresiones y definiciones. Devuelve el valor de la última expresión. Las definiciones son locales al bloque. | `def raiz(x:Double):Double = { def abs(...) { ... } ... raizCuadrada(1.0) }` |
| Encapsulamiento | Ocultar funciones y variables auxiliares dentro de un ámbito para evitar acceso no autorizado y mantener la interfaz simple. | Las funciones `abs`, `mejorar`, `esBuenaEstimacion` y `raizCuadrada` son locales a `raiz` |
| Recursión de cola | Recursión donde la llamada recursiva es la última operación. Scala la optimiza a un bucle iterativo. | `raizCuadrada` se llama a sí misma como última operación en la rama `else` |
| Criterio de convergencia | Condición que determina cuándo el algoritmo ha encontrado una solución lo suficientemente buena. | `abs(estimacion * estimacion - x) < 0.001` verifica si el error es menor a 0.001 |
| Estimación inicial | Valor de partida para el algoritmo iterativo. Afecta la cantidad de iteraciones necesarias. | `raizCuadrada(1.0)` inicia con estimación 1.0 para cualquier valor de entrada |

## Comentarios adicionales

- **Eficiencia del método de Newton**: el método de Newton converge cuadráticamente, lo que significa que el número de dígitos correctos se duplica aproximadamente con cada iteración. Esto lo hace muy eficiente comparado con otros métodos de aproximación.

- **Tolerancia y precisión**: la tolerancia de 0.001 es un compromiso entre precisión y velocidad. Un valor más pequeño (como 0.00001) proporciona mayor precisión pero requiere más iteraciones. Un valor más grande reduce el número de iteraciones pero sacrifica precisión.

- **Casos especiales**: el código actual no maneja casos especiales como números negativos o cero. Para $x \leq 0$, el algoritmo podría no converger o comportarse inesperadamente. Una implementación robusta debería validar la entrada.

- **Ventajas del alcance léxico**: además de permitir acceso a variables externas, el alcance léxico facilita la creación de **clausuras** (closures), funciones que "recuerdan" el contexto en el que fueron definidas. Esta es una característica fundamental de la programación funcional.

- **Diferencia con el primer código**: en la versión inicial, `mejorar`, `esBuenaEstimacion` y `raizCuadrada` recibían $x$ como parámetro explícito. En la versión mejorada con bloques, estas funciones lo acceden a través del alcance léxico. Esto reduce la cantidad de parámetros que deben pasarse y hace el código más limpio.

- **Optimización de compilación**: Scala aplica automáticamente la **optimización de recursión de cola** (@tailrec) a funciones como `raizCuadrada`, convirtiéndolas en bucles eficientes. Opcionalmente, se puede anotar con `@scala.annotation.tailrec` para que el compilador genere un error si la optimización no es posible.

- **Comparación con bucles imperativos**: aunque usamos recursión, el resultado es equivalente a:
  ```scala
  var estimacion = 1.0
  while (abs(estimacion * estimacion - x) >= 0.001) {
    estimacion = (x / estimacion + estimacion) / 2
  }
  estimacion
  ```
  Sin embargo, la versión recursiva es más declarativa y segura (no usa variables mutables).