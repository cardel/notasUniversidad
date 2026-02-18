# Geometrica

Se ve en los fractales, los cuales tienen reglas de generación, en la cual vamos a ver la misma estructura inicial a medida que el fractal se va generando (iteraciones), esto hace que a medida que hacemos zoom **siempre veamos la misma estructura**

Ejemplo: Triángulo de Sierpinski

![](attachments/Pasted%20image%2020260218172218.png)

Cada vez que hacemos zoom vemos la misma estructura

---

# Recursión matemática

La recursión matemática son funciones que permiten generar conjuntos donde tenemos dos casos:

1. **Caso base**: Respuesta inmediata, que detiene la recursión y proporciona un valor definido
2. **Caso recursivo**: El cual tiene respuesta dependiendo de valores anteriores. El caso recursivo eventualmente me lleva hacia el caso base

**Ejemplo: Factorial**

$$f(n) = \begin{cases}
1 & \text{si } n = 0 \\
n \cdot f(n-1) & \text{en otro caso}
\end{cases}$$

Observe que el caso recursivo va restando 1 a $n$ de forma paulatina, así que eventualmente va a llegar a 0. Es de anotar que el factorial está definido para los números enteros mayores o iguales a 0.

**Ejemplo: Sucesión de Fibonacci**

$$fib(n) = \begin{cases}
0 & \text{si } n = 0 \\
1 & \text{si } n = 1 \\
fib(n-1) + fib(n-2) & \text{en otro caso}
\end{cases}$$

En este caso tenemos que la función recursiva depende de dos valores anteriores. Ejemplo: $fib(2)$ depende de $fib(1)$ y $fib(0)$.

---

# Definición de conjuntos recursivos

Los conjuntos recursivos se definen de forma inductiva mediante:
- Un **caso base**: elemento(s) que pertenecen al conjunto
- Una o más **reglas de construcción**: que permiten generar nuevos elementos a partir de los existentes

**Ejemplo: Números pares**

$2 \in S$

$x \in S, y \in S \therefore x + y \in S$

Entonces: $2 + 2 = 4$, $4 + 2 = 6$, $4 + 4 = 8$, $6 + 4 = 10$, ...

**Ejemplo: Listas de números**

$Nil \in S$

$x \in \mathbb{N} \wedge l \in S \therefore x :: l \in S$

donde $::$ es el operador de construcción (cons) que antepone un elemento a una lista.

Ejemplos:

```scala
// Caso base: lista vacía
scala> List()
val res0: List[Nothing] = List()

// Anteponer 5 a lista vacía
scala> 5 :: List()
val res1: List[Int] = List(5)

// Anteponer 6 a List(5), construyendo una nueva lista
scala> 6 :: List(5)
val res2: List[Int] = List(6, 5)
```

---

# Tabla de resumen

| Concepto | Definición | Características | Aplicación |
|---|---|---|---|
| **Recursión Geométrica** | Estructuras que se repiten a diferentes escalas (fractales) | Autosimilitud, iteraciones que generan complejidad | Triángulo de Sierpinski, conjunto de Mandelbrot |
| **Caso Base** | Condición que detiene la recursión | Valor conocido y definido explícitamente | Ejemplo: $f(0) = 1$ en factorial |
| **Caso Recursivo** | Definición de la función en términos de sí misma | Depende de valores anteriores o más pequeños | Ejemplo: $f(n) = n \cdot f(n-1)$ |
| **Recursión Matemática** | Función definida inductivamente | Siempre tiene caso base y caso recursivo | Factorial, Fibonacci, sumatorias |
| **Conjuntos Recursivos** | Conjuntos definidos inductivamente | Elemento(s) base + reglas de construcción | Números pares, listas, árboles binarios |
| **Operador cons (::)** | Operación que antepone un elemento a una estructura | Construye estructuras de forma recursiva | Construcción de listas enlazadas |

**Comentarios adicionales:**

- La recursión es fundamental en matemáticas y programación porque permite expresar problemas complejos en términos de casos más simples.
- Es crucial que el caso recursivo **siempre converja hacia el caso base**, de lo contrario se produce una recursión infinita.
- La complejidad temporal de funciones recursivas puede variar significativamente; Fibonacci ingenuo tiene complejidad exponencial mientras que versiones optimizadas (memoización, programación dinámica) reducen esto.
- Los lenguajes funcionales como Scala enfatizan la recursión como mecanismo primario de iteración, a diferencia de lenguajes imperativos que usan bucles.
- La definición inductiva de conjuntos recursivos es equivalente a la definición recursiva de funciones.