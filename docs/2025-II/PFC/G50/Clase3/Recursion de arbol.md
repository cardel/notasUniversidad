# Recursión de Árbol

## 🌳 Concepto Fundamental

La **recursión de árbol** ocurre cuando una función realiza **múltiples llamados recursivos** en un mismo caso, creando una estructura similar a un árbol en su ejecución.

## 🧮 Ejemplo: Sucesión de Fibonacci

### Definición Matemática
$$
fib(n) = \begin{cases}
0 & \text{si } n = 0 \\
1 & \text{si } n = 1 \\
fib(n-1) + fib(n-2) & \text{en otro caso}
\end{cases}
$$

### Implementación en Scala
```scala
def fib(n: Int): Int = {
    if (n <= 1) n
    else fib(n - 1) + fib(n - 2)
}
```

## 📊 Estructura de Llamados para fib(5)

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

### 📝 Desglose de Cálculos
```
fib(5) = fib(4) + fib(3)
fib(4) = fib(3) + fib(2)  
fib(3) = fib(2) + fib(1)
fib(2) = fib(1) + fib(0) = 1 + 0 = 1
fib(3) = 1 + 1 = 2
fib(4) = 2 + 1 = 3
fib(5) = 3 + 2 = 5
```

## ⚠️ Problemas de la Recursión de Árbol

### 1. **Complejidad Exponencial**
- fib(n) realiza aproximadamente $O(2^n)$ operaciones
- fib(5): 15 llamados
- fib(10): 177 llamados  
- fib(20): 21,891 llamados

### 2. **Re-cálculos Múltiples**
- fib(3) se calcula 2 veces en fib(5)
- fib(2) se calcula 3 veces
- fib(1) se calcula 5 veces

### 3. **Consumo de Memoria**
- Cada llamado ocupa espacio en la pila
- Alto riesgo de **stack overflow**

## 📊 Comparativa de Tipos de Recursión

| Aspecto          | Recursión Lineal      | Recursión de Cola           | Recursión de Árbol               |
| ---------------- | --------------------- | --------------------------- | -------------------------------- |
| **Llamados**     | 1 llamado por paso    | 1 llamado por paso          | Múltiples llamados               |
| **Memoria**      | $O(n)$ stack frames   | $O(1)$ (optimizado)         | $O(2^n)$ en peor caso            |
| **Eficiencia**   | Moderada              | Alta                        | Muy Baja                         |
| **Optimización** | No optimizable        | Tail recursion optimization | Memoization posible ** ADA II ** |
| **Uso típico**   | Factorial, recorridos | Iteraciones, acumuladores   | Divide y vencerás                |

## 🎯 Cuándo Evitar Recursión de Árbol

### ❌ Casos Problemáticos
- Cálculos con muchos re-cálculos
- Valores de n grandes
- Aplicaciones con restricciones de memoria

### ✅ Alternativas Recomendadas
1. **Programación Dinámica** (memoization)
2. **Iteración con variables**
3. **Recursión de cola** cuando sea posible
4. **Soluciones cerradas** matemáticas

## 💡 Conclusión

La recursión de árbol es **elegante conceptualmente** pero **poco eficiente computacionalmente**. Debe usarse con precaución y solo cuando:
- Los problemas son pequeños
- La legibilidad es prioritaria sobre el rendimiento
- No existen alternativas iterativas simples

**En este curso:** La usaremos para entender conceptos, pero en aplicaciones reales se preferirán optimizaciones como memoization o soluciones iterativas.