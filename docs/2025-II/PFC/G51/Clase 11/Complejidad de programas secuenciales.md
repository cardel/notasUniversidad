# Complejidad de programas secuenciales

Para estudiar la **complejidad de programas secuenciales** utilizamos la **notación asintótica**. Vamos a dar esta complejidad en términos de funciones generales:

- **$O(f(n))$**: Peor caso (usualmente se utiliza)
- **$\Omega(f(n))$**: Mejor caso  
- **$\Theta(f(n))$**: Ajustada

Esto nos va a permitir estudiar los algoritmos de acuerdo a su **complejidad**. La **complejidad** es el número de pasos que requiere un algoritmo para resolver un problema en términos del **tamaño de la entrada $n$**.

Esto nos permite saber cómo se comporta un algoritmo de acuerdo a la entrada que se le envía.

## Estimación de la complejidad en programas secuenciales

Para esto vamos a estimar el número de pasos que requiere un algoritmo para resolver un problema.

```scala
// Este código es ilustrativo y no es funcional
def sumar(arr: Array[Int]): Int = {
    var sum = 0
    for(e <- arr) {
        sum += e
    }
    return sum
}
```

En este caso vamos a requerir hacer **$n$ pasos** donde **$n$** es el tamaño del arreglo, por lo tanto decimos que el algoritmo toma tiempo **$O(n)$** para resolver el problema, es decir, es **lineal**.

En los **algoritmos secuenciales** vamos a considerar que los pasos suceden en el orden de especificación.

## Ejemplo

```scala
def sumSegment(a: Array[Int], i: Int, f: Int): Int = {
    (i until f).map(x => a(x)).sum
}
```

Vemos que:

1. `(i until f)` genera un rango desde **i** hasta **f** sin incluirlo
2. `map(x => a(x))` aplica una función que genera una colección con los elementos de **a**
3. `.sum` suma los elementos

Para resolver este problema requiero hacer **$O(f - i)$ pasos** asumiendo que cada paso tiene el mismo valor.

```scala
def suma(a: Array[Int], i: Int, f: Int): Int = {
    if (f - i <= limite) 
        sumSegment(a, i, f)
    else {
        val m: Int = (i + f) / 2
        val (s1, s2) = (
            suma(a, i, m),
            suma(a, m, f)
        )
        s1 + s2
    }
}
```

![[Pasted image 20251030073728.png]]

![[Pasted image 20251030073738.png]]

A pesar de que **dividimos el problema**, sólo se ejecuta una función a la vez, por lo tanto vamos a tener el mismo número de pasos que haciéndolo directamente sin dividir.

$$
w(i,f) = \begin{cases} 
O(f-i) & \texttt{si} & f - i \leq lim \\
W(i,m) + W(m,f) + O(1)
\end{cases}
$$

Al resolver esta **relación de recurrencia** se obtiene **$O(f-i)$**.

Es decir que **dividir el problema** en operaciones secuenciales **no representa ninguna ganancia en tiempo**.

```scala
def suma(a: Array[Int], i: Int, f: Int): Int = {
    if (f - i <= limite) 
        sumSegment(a, i, f)
    else {
        val m: Int = (i + f) / 2
        val (s1, s2) = parallel (
            suma(a, i, m),
            suma(a, m, f)
        )
        s1 + s2
    }
}
```

![[Pasted image 20251030074938.png]]

Vemos que al partir el problema y asumiendo **paralelismo ilimitado** se logra la complejidad de **$O(log(n))$**. Formalmente:

$$
D(i,f) = \begin{cases} 
O(f-i) & \texttt{si} & f - i \leq lim \\
max(D(i,m), D(m,f)) + O(1)
\end{cases}
$$

Al resolver esta **relación de recurrencia** obtenemos **$O(log(n))$**. Esto nos indica que podemos resolver problemas que se puedan **paralelizar por completo** en tiempo **logarítmico** con respecto a su versión secuencial.

---

## Tabla de Resumen de Conceptos

| Concepto | Definición | Ejemplo/Aplicación | Complejidad |
|----------|------------|-------------------|-------------|
| **Notación asintótica** | Herramienta matemática para describir el comportamiento límite de funciones | $O(f(n))$, $\Omega(f(n))$, $\Theta(f(n))$ | - |
| **Complejidad algorítmica** | Número de pasos que requiere un algoritmo en función del tamaño de entrada $n$ | Análisis de eficiencia de algoritmos | Depende del algoritmo |
| **Caso lineal $O(n)$** | El tiempo de ejecución crece proporcionalmente al tamaño de entrada | Suma de elementos de un arreglo con bucle simple | $O(n)$ |
| **División secuencial** | Dividir un problema en subproblemas que se ejecutan secuencialmente | Suma recursiva sin paralelismo | $O(n)$ (sin mejora) |
| **Paralelismo** | Ejecución simultánea de múltiples operaciones | Uso de `parallel` para ejecutar sumas concurrentes | $O(log(n))$ |
| **Relación de recurrencia** | Ecuación que define una función en términos de sus valores en entradas más pequeñas | $D(i,f) = max(D(i,m), D(m,f)) + O(1)$ | Herramienta de análisis |
| **Complejidad logarítmica** | Tiempo de ejecución crece logarítmicamente con el tamaño de entrada | Algoritmos que dividen el problema en mitades | $O(log(n))$ |

**Conceptos importantes destacados:**
- **Complejidad algorítmica**
- **Notación asintótica** ($O$, $\Omega$, $\Theta$)
- **Tamaño de entrada $n$**
- **Algoritmos secuenciales**
- **Paralelismo**
- **Relación de recurrencia**
- **Complejidad lineal vs logarítmica**
- **División de problemas**