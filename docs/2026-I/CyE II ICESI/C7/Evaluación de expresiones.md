# Evaluación de expresiones

En Scala, las expresiones se evalúan de izquierda a derecha.

```scala
1+2+3+4+5

(1+2)+3+4+5
3+3+4+5

(3+3)+4+5
6+4+5

(6+4)+5
10+5

15
```

Es importante tener en cuenta el **orden de los operadores**, es decir, la **precedencia**.

```scala
3+4*5

3+20  // La multiplicación tiene mayor precedencia que la suma

23
```

Teniendo esto en cuenta, vamos a evaluar operaciones en Scala:

```scala
def f(n:Int):Int = {
    n*g(n)  // Función f que multiplica n por g(n)
}

def g(x:Int):Int = {
    x+1  // Función g que suma 1 a x
}

f(1+2*3)  // Llamada a f con la expresión 1+2*3
```

Resulta que existen dos estrategias principales para evaluar esta operación en Scala:

1. **Evaluación por valor (CBV - Call By Value)**
2. **Evaluación por nombre (CBN - Call By Name)** ← Análogo a las referencias

## Evaluación por valor (CBV)

Primero evalúa los parámetros antes de invocar la función. Este es el método clásico en la mayoría de los lenguajes de programación.

```scala
def f(n:Int):Int = {
    n*g(n)  // Función f que multiplica n por g(n)
}

def g(x:Int):Int = {
    x+1  // Función g que suma 1 a x
}

f(1+2*3)
f(1+6)      // Primero evalúa el argumento: 1+2*3 = 7
f(7)        // Luego llama a f con el valor 7
7*g(7)      // Sustituye n por 7 en el cuerpo de f
7*(7+1)     // Evalúa g(7) = 7+1 = 8
7*8         // Multiplica 7*8
56          // Resultado final
```

## Evaluación por nombre (CBN)

Los parámetros se calculan cuando se necesitan, no antes de la llamada a la función.

```scala
def f(n:Int):Int = {
    n*g(n)  // Función f que multiplica n por g(n)
}

def g(x:Int):Int = {
    x+1  // Función g que suma 1 a x
}

f(1+2*3)
(1+2*3)*g(1+2*3)  // Sustituye n por la expresión sin evaluar
(1+6)*g(1+2*3)    // Evalúa 1+2*3 cuando se necesita
7*g(1+2*3)        // Continúa evaluando
7*(1+2*3+1)       // Sustituye x por 1+2*3 en g
7*(1+6+1)         // Evalúa 1+2*3 dentro de g
7*(7+1)           // Simplifica
7*8               // Multiplica
56                // Resultado final
```

## Aspectos en Scala

1. **`val`** para definir evaluación por valor (ansiosa/eager)
2. **`def`** para definir evaluación por nombre (a necesidad/lazy)
3. **Evaluación por valor** en parámetros: `def f(x: Int): Int`
4. **Evaluación por nombre** en parámetros: `def f(x: => Int): Int`
5. **Evaluación por valor** evalúa el parámetro solo una vez, mientras que **evaluación por nombre** lo evalúa cada vez que se necesita

### Ejemplo ilustrativo

```scala
scala> def loop:Int = loop  // Definición recursiva infinita
                      ^
       warning: method loop does nothing other than call itself recursively
def loop: Int

scala> def f(x:Int, y:Int):Int = x  // Función con evaluación por valor
def f(x: Int, y: Int): Int

scala> f(10, loop)  // Intenta evaluar loop (que es infinito)
^C  // Es necesario detener el programa porque en CBV intenta calcular el valor de loop
```

```scala
scala> def loop:Int = loop  // Definición recursiva infinita
                      ^
       warning: method loop does nothing other than call itself recursively
def loop: Int

scala> def f(x: => Int, y: => Int):Int = x  // Función con evaluación por nombre
def f(x: => Int, y: => Int): Int

scala> f(10, loop)  // No evalúa loop porque no se necesita
val res0: Int = 10  // Resultado exitoso
```

## Tabla de resumen

| Concepto | Descripción | Características clave | Ejemplo en Scala |
|----------|-------------|----------------------|------------------|
| **Evaluación por valor (CBV)** | Evalúa los argumentos antes de pasar a la función | 1. Evalúa argumentos una vez<br>2. Más eficiente si el argumento se usa múltiples veces<br>3. Puede causar evaluación innecesaria | `def f(x: Int): Int` |
| **Evaluación por nombre (CBN)** | Pasa la expresión sin evaluar y la evalúa cuando se necesita | 1. Evalúa solo cuando se usa<br>2. Puede evitar cálculos innecesarios<br>3. Menos eficiente si el argumento se usa múltiples veces | `def f(x: => Int): Int` |
| **Precedencia de operadores** | Orden en que se evalúan los operadores en una expresión | 1. Multiplicación/división antes que suma/resta<br>2. Paréntesis tienen la mayor precedencia | `3+4*5 = 23` (no 35) |
| **Evaluación izquierda-derecha** | Dirección en que se evalúan las expresiones | 1. Para operadores con misma precedencia<br>2. Aplica a operadores asociativos | `1+2+3 = (1+2)+3 = 6` |
| **`val` vs `def`** | Diferencia en evaluación de definiciones | 1. `val`: evaluación ansiosa (eager)<br>2. `def`: evaluación perezosa (lazy) | `val x = expr` vs `def x = expr` |
| **Terminación** | Comportamiento con expresiones no terminantes | 1. CBV: puede no terminar si argumento no termina<br>2. CBN: puede terminar si no necesita el argumento | `f(10, loop)` con loop infinito |

## Comentarios adicionales

- **Estrategias híbridas**: Algunos lenguajes usan estrategias mixtas, como evaluación perezosa (lazy evaluation) que memoriza resultados.
- **Optimizaciones**: Los compiladores pueden transformar evaluación por nombre en evaluación por valor cuando es seguro (cuando el argumento es un valor puro).
- **Efectos secundarios**: La evaluación por nombre puede causar que efectos secundarios se ejecuten en momentos inesperados si el argumento se evalúa múltiples veces.
- **Scala específico**: En Scala, los parámetros por defecto son evaluados por valor. Para usar evaluación por nombre se requiere la sintaxis `=>`.
- **Rendimiento**: La evaluación por valor generalmente es más eficiente en términos de tiempo de ejecución, mientras que la evaluación por nombre puede ser más eficiente en términos de uso de memoria al evitar cálculos innecesarios.
- **Aplicación práctica**: La evaluación por nombre es útil para implementar estructuras de control como `if-else`, `while`, y para crear DSLs (Domain Specific Languages) donde se quiere retrasar la evaluación.


# Anotación

Scala tiene la politica de java de valores por defecto, cuando intento consultar un valor no inicializado, le asigna uno.

```scala
scala> val loop:Int = loop
                      ^
       warning: value loop does nothing other than call itself recursively
val loop: Int = 0
```
