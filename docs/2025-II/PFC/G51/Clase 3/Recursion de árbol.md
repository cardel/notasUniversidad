# Recursión de Árbol: El caso de Fibonacci

## Definición matemática

La sucesión de Fibonacci se define recursivamente como:
$$
\text{fib}(n) = \begin{cases}
0 & n = 0 \\
1 & n = 1 \\
\text{fib}(n-1) + \text{fib}(n-2) & n \geq 2
\end{cases}
$$

## Implementación recursiva en Scala

```scala
def fib(n: Int): Int = {
    if (n <= 1) n
    else fib(n - 1) + fib(n - 2)  // Dos llamados recursivos
}
```

## Análisis del árbol de llamados para fib(5)

```
                fib(5)
               /       \
          fib(4)       fib(3)
         /      \      /     \
    fib(3)   fib(2)  fib(2) fib(1)
    /   \    /   \   /   \
fib(2) f(1) f(1)f(0)f(1)f(0)
 /   \
f(1) f(0)
```

**Total de llamados:** 15 para fib(5)

## Complejidad computacional

La ecuación de recurrencia es:
$$T(n) = T(n-1) + T(n-2) + O(1)$$

Resolviendo la ecuación característica:
$$r^2 - r - 1 = 0$$
$$r = \frac{1 \pm \sqrt{5}}{2}$$

La solución es de la forma:
$$T(n) = A\left(\frac{1+\sqrt{5}}{2}\right)^n + B\left(\frac{1-\sqrt{5}}{2}\right)^n$$

**Complejidad asintótica:** $O(\phi^n)$ donde $\phi = \frac{1+\sqrt{5}}{2} \approx 1.618$
**Aproximación práctica:** $O(2^n)$ llamados

## Problemas de la recursión de árbol

1. **Crecimiento exponencial:** Para $n = 40$ → $\approx 2^{40} = 1.1 \times 10^{12}$ llamados
2. **Recomputación:** Mismos valores calculados múltiples veces
3. **Stack overflow:** Profundidad recursiva de $O(n)$

## Solución iterativa recomendada
**nota** Esto no es funcional!.

```scala
def fibIterative(n: Int): Int = {
    if (n <= 1) return n
    
    var a = 0
    var b = 1
    var result = 0
    
    for (i <- 2 to n) {
        result = a + b
        a = b
        b = result
    }
    result
}
```

**Complejidad:** $O(n)$ tiempo, $O(1)$ espacio

## Conclusión

Para problemas con recursión de árbol como Fibonacci:
- **Evitar** la implementación recursiva naive ($O(2^n)$)
- **Preferir** implementación iterativa ($O(n)$)
- **Considerar** programación dinámica cuando sea necesario (técnicas de optimización)

La recursión de árbol solo es viable para valores muy pequeños de $n$ debido al crecimiento exponencial de llamados.