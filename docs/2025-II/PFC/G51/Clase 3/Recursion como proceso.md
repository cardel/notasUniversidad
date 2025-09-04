# Recursión: Lineal vs Cola

## Recursión Lineal

La recursión lineal almacena todos los llamados pendientes en la pila de ejecución hasta alcanzar el caso base.

**Definición matemática:**
$$
\text{fact}(n) = \begin{cases}
1 & \text{si } n = 0 \\
n \times \text{fact}(n-1) & \text{si } n > 0
\end{cases}
$$

**Implementación en Scala:**
```scala
def fact(n: Int): Long = {
    if (n == 0) 1
    else n * fact(n - 1)  // Llamado no terminal
}
```

**Proceso de ejecución:**
```
fact(5) = 5 * fact(4)      // PUSH
fact(4) = 4 * fact(3)      // PUSH  
fact(3) = 3 * fact(2)      // PUSH
fact(2) = 2 * fact(1)      // PUSH
fact(1) = 1 * fact(0)      // PUSH
fact(0) = 1                // Caso base

fact(1) = 1 * 1 = 1        // POP
fact(2) = 2 * 1 = 2        // POP
fact(3) = 3 * 2 = 6        // POP
fact(4) = 4 * 6 = 24       // POP
fact(5) = 5 * 24 = 120     // POP
```

**Problema:** Para $n$ grande se produce stack overflow debido al crecimiento lineal de la pila ($O(n)$ espacio).

## Recursión de Cola (Tail Recursion)

La recursión de cola realiza el llamado recursivo como última operación, permitiendo optimización.

**Implementación optimizada:**
```scala
import scala.annotation.tailrec

@tailrec
final def fact(n: Int, acc: Long = 1): Long = {
    if (n == 0) acc
    else fact(n - 1, n * acc)  // Llamado terminal
}
```

**Proceso de ejecución:**
```
fact(5, 1) = fact(4, 5)
fact(4, 5) = fact(3, 20) 
fact(3, 20) = fact(2, 60)
fact(2, 60) = fact(1, 120)
fact(1, 120) = fact(0, 120)
fact(0, 120) = 120
```

**Ventajas:**
- Uso constante de memoria ($O(1)$ espacio)
- Optimizable a iteración por el compilador
- Evita stack overflow

## Diferencias clave

| Aspecto | Recursión Lineal | Recursión de Cola |
|---------|-----------------|-------------------|
| Uso de memoria | $O(n)$ | $O(1)$ |
| Operación final | Multiplicación | Llamado recursivo |
| Optimizable | No | Sí |
| Stack safe | No | Sí |

## Soporte de lenguajes

Scala optimiza automáticamente la recursión de cola (con `@tailrec`). Java no realiza esta optimización, por lo que incluso la recursión de cola consume espacio de pila.

La recursión de cola es esencial para algoritmos recursivos eficientes en programación funcional, permitiendo procesar secuencias largas sin riesgo de desbordamiento.

https://en.wikipedia.org/wiki/Tail_call#Language_support 