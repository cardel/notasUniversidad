# Mecanismos de evaluación

En los lenguajes funcionales, **toda expresión se va a reducir a un VALOR**. No existen situaciones donde no se retorne un valor, donde el programa simplemente termine sin resultado o donde se realice un salto de código hacia otra rutina. El modelo de sustitución es el mecanismo mediante el cual se reduce una expresión a un valor.

## Evaluación por valor (CBV - Call By Value)

En la evaluación por valor, antes de evaluar un procedimiento o función, todos los argumentos deben ser evaluados a valores. Los argumentos se evalúan una única vez y los valores resultantes se pasan a la función.

```scala
// Ejemplo: sumOfSquares(3, 2+2)
// Proceso de evaluación paso a paso:

sumOfSquares(3, 2+2)
// Paso 1: Evaluar los argumentos a valores
sumOfSquares(3, 4)
// Paso 2: Sustituir los argumentos evaluados en el cuerpo de la función
square(3) + square(4)
// Paso 3: Evaluar square(3)
3*3 + square(4)
// Paso 4: Evaluar 3*3
9 + square(4)
// Paso 5: Evaluar square(4)
9 + 4*4
// Paso 6: Evaluar 4*4
9 + 16
// Paso 7: Evaluar 9 + 16
25
```

## Evaluación por nombre (CBN - Call By Name)

En la evaluación por nombre, los argumentos se pasan sin evaluar (como expresiones) a la función. Estos se evalúan solo cuando se utilizan en el cuerpo de la función. Si un argumento no se utiliza, nunca se evalúa.

```scala
// Ejemplo: sumOfSquares(3, 2+2)
// Proceso de evaluación paso a paso:

sumOfSquares(3, 2+2)
// Paso 1: No evaluar los argumentos, pasar las expresiones directamente
square(3) + square(2+2)
// Paso 2: Evaluar square(3) sustituyendo 3 en el cuerpo
3*3 + square(2+2)
// Paso 3: Evaluar 3*3
9 + square(2+2)
// Paso 4: Evaluar square(2+2) sustituyendo (2+2) en el cuerpo
9 + (2+2)*(2+2)
// Paso 5: Evaluar el primer (2+2)
9 + 4*(2+2)
// Paso 6: Evaluar el segundo (2+2)
9 + 4*4
// Paso 7: Evaluar 4*4
9 + 16
// Paso 8: Evaluar 9 + 16
25
```

Nota: Con CBN no se resuelve `2+2` hasta que es estrictamente necesario. Además, observe que la expresión `2+2` se evalúa dos veces (una en cada llamada a `square`), mientras que con CBV se evalúa solo una vez.

## Evaluación en Scala

En Scala, por defecto se utiliza evaluación por valor (CBV). Si se requiere evaluación por nombre, es necesario cambiar la firma de la función utilizando el operador `=>` en los parámetros.

```scala
// Sintaxis para evaluación por nombre en Scala
def f(x: => Int): Int = {
  // El operador => indica que x se evalúa por nombre
  // x es de tipo Int pero se pasa como una expresión sin evaluar
  // ...
}
```

### Comparación de estrategias de evaluación

**Evaluación por valor (CBV)**:
1. Los argumentos se evalúan exactamente una vez
2. Es más eficiente en términos de número de evaluaciones
3. Es más predecible en términos de efectos secundarios

**Evaluación por nombre (CBN)**:
1. Los argumentos se evalúan solo cuando se utilizan
2. Si un argumento no se usa, nunca se evalúa
3. Puede realizar más evaluaciones si un argumento se utiliza múltiples veces

### Ejemplo 1: Función con evaluación por valor que causa problemas

```scala
// Definición de una función recursiva infinita
scala> def loop: Int = loop
// warning: Infinite recursive call

def loop: Int
// La función 'loop' se llama a sí misma sin caso base, causando recursión infinita

// Definición de una función que solo usa el primer argumento
scala> def f(x: Int, l: Int): Int = x*x
def f(x: Int, l: Int): Int
// La función f tiene dos parámetros pero solo usa x

// Intento de llamar a f con CBV
scala> f(10, loop)
// Error: El programa intenta evaluar loop antes de pasar el resultado a f
// Como loop es una recursión infinita, el programa nunca termina
// El parámetro l nunca se utiliza en el cuerpo de f, pero igual se evalúa
```

### Ejemplo 2: Función con evaluación por nombre que evita el problema

```scala
// Definición de una función recursiva infinita (misma que antes)
scala> def loop: Int = loop
// warning: Infinite recursive call

def loop: Int

// Definición de una función con evaluación por nombre
scala> def f(x: => Int, l: => Int): Int = x*x
def f(x: => Int, l: => Int): Int
// Los parámetros x y l se declaran con => para evaluación por nombre
// Las expresiones se pasan sin evaluar y solo se evalúan si se usan

// Llamada a f con CBN
scala> f(10, loop)
val res32: Int = 100
// Resultado: 100
// Explicación: loop nunca se evalúa porque no se utiliza en el cuerpo de f
// Solo se evalúa x (que es 10) y se retorna 10*10 = 100
```

## Conceptos teóricos adicionales

**Modelo de sustitución**: Es el modelo conceptual mediante el cual se reduce una expresión a un valor. Consiste en reemplazar las variables por sus valores correspondientes y evaluar las expresiones resultantes.

**Estrategia de evaluación**: Es el orden y mecanismo mediante el cual se evalúan los argumentos de una función y se reduce una expresión. Diferentes estrategias pueden dar el mismo resultado final pero con diferentes números de pasos o efectos secundarios.

**Efectos secundarios**: Son cambios en el estado del programa que ocurren como resultado de evaluar una expresión (p. ej., imprimir en pantalla, modificar variables globales). La evaluación por nombre puede afectar cuándo ocurren estos efectos.

**Complejidad de evaluación**: CBV es generalmente más eficiente porque evalúa cada argumento una sola vez. CBN puede ser ineficiente si un argumento se usa múltiples veces, pero es más eficiente si un argumento no se usa.

**Valores grandes en memoria**: Cuando se pasa un argumento que representa una estructura grande en memoria (como una lista), CBV mantiene todo en memoria durante la ejecución de la función. CBN solo evalúa (carga en memoria) la parte que se utiliza, lo que puede ahorrar memoria en ciertos casos.

**Laziness y evaluación perezosa**: CBN está relacionado con el concepto de evaluación perezosa (lazy evaluation), donde se retrasa la evaluación de las expresiones hasta que sea absolutamente necesario.

**Terminación de programas**: CBN puede permitir que programas terminen cuando CBV causaría bucles infinitos, como se ve en el ejemplo con `loop`. Esta es una ventaja importante en ciertos contextos.

---

## Tabla de resumen

| Concepto | Definición | Característica principal |
|---|---|---|
| **Evaluación por valor (CBV)** | Los argumentos se evalúan a valores antes de pasar a la función | Cada argumento se evalúa exactamente una vez |
| **Evaluación por nombre (CBN)** | Los argumentos se pasan como expresiones y se evalúan solo si se usan | Un argumento no utilizado nunca se evalúa |
| **Modelo de sustitución** | Mecanismo para reducir expresiones reemplazando variables por sus valores | Proporciona la base teórica para la evaluación |
| **Estrategia de evaluación** | Orden y mecanismo de evaluación de argumentos y expresiones | Diferentes estrategias pueden tener diferentes efectos |
| **Operador =>** | Sintaxis en Scala para indicar evaluación por nombre en parámetros | `def f(x: => Int)` |
| **Efectos secundarios** | Cambios de estado que ocurren durante la evaluación | CBN afecta cuándo ocurren los efectos secundarios |
| **Bucle infinito en CBV** | Función con recursión infinita causa bloqueo si se pasa como argumento | Se evalúa incluso si no se utiliza |
| **Bucle infinito en CBN** | Función con recursión infinita no causa problema si no se utiliza | Se evalúa solo si se necesita |
| **Complejidad de evaluación** | Número de pasos necesarios para reducir una expresión | CBV es más eficiente en general |
| **Consumo de memoria** | Cantidad de memoria requerida durante la evaluación | CBN puede ahorrar memoria con estructuras grandes no utilizadas |

### Comentarios adicionales

- **Elección de estrategia**: En Scala se usa CBV por defecto por razones de eficiencia y predictibilidad, pero CBN está disponible cuando se necesita (p. ej., para implementar estructuras de control como `if`, `while`, `&&`, `||`).

- **Operadores de cortocircuito**: En Scala, operadores lógicos como `&&` y `||` utilizan evaluación por nombre para el segundo argumento, permitiendo cortocircuitar (evitar evaluar el segundo argumento si no es necesario).

- **Valores vs expresiones**: En CBN, los parámetros son expresiones (thunks) que se reevalúan cada vez que se usan. En CBV, son valores fijos que se evalúan una única vez.

- **Performance vs laziness**: CBV es más rápido en la mayoría de los casos porque evita reevaluaciones. CBN es más "perezoso" y solo evalúa lo necesario, útil para secuencias infinitas o estructuras parcialmente evaluadas.

- **Lenguajes funcionales puros**: Lenguajes como Haskell utilizan evaluación por nombre como estrategia por defecto, permitiendo trabajar con estructuras de datos infinitas.

- **Debugging**: La evaluación por nombre puede hacer que el debugging sea más difícil ya que las expresiones pueden evaluarse en momentos inesperados o múltiples veces.