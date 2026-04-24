# División entera

Si $a \in \mathbb{Z} \wedge d \in \mathbb{Z^+}$, entonces existen enteros únicos $q$ (cociente) y $r$ (residuo) tales que:

$a = d \cdot q + r$, con $0 \leq r < d$

El residuo $r$ es siempre no negativo y menor que el divisor $d$.

En muchos lenguajes de programación, el operador módulo (`%`) devuelve un residuo con el signo del dividendo, lo cual puede dar resultados negativos cuando el dividendo es negativo. Para obtener siempre un residuo no negativo (según la definición matemática), se puede implementar la siguiente función:

```scala
def modulo(n: Int, d: Int): Int = {
    // Primero calcula el residuo con signo
    // Luego suma d para asegurar un valor no negativo
    // Finalmente aplica módulo nuevamente para garantizar r < d
    ((n % d) + d) % d
}
```

# Máximo común divisor

El **máximo común divisor** (mcd) de dos enteros $a$ y $b$, denotado $\text{mcd}(a,b)$, es el mayor entero positivo $d$ tal que $d$ divide a $a$ y $d$ divide a $b$.

Un método para calcularlo es mediante la **factorización prima** de cada número: se toman todos los factores primos comunes elevados al menor exponente.

**Ejemplo:**  
$120 = 2^3 \cdot 3^1 \cdot 5^1$  
$500 = 2^2 \cdot 5^3$  
$\text{mcd}(120, 500) = 2^{\min(3,2)} \cdot 3^{\min(1,0)} \cdot 5^{\min(1,3)} = 2^2 \cdot 3^0 \cdot 5^1 = 4 \cdot 1 \cdot 5 = 20$

# Mínimo común múltiplo

El **mínimo común múltiplo** (mcm) de dos enteros $a$ y $b$, denotado $\text{mcm}(a,b)$, es el menor entero positivo $d$ tal que $a$ divide a $d$ y $b$ divide a $d$.

Se puede calcular mediante la factorización prima tomando todos los factores primos (comunes y no comunes) elevados al mayor exponente.

**Ejemplo:**  
$120 = 2^3 \cdot 3^1 \cdot 5^1$  
$500 = 2^2 \cdot 5^3$  
$\text{mcm}(120, 500) = 2^{\max(3,2)} \cdot 3^{\max(1,0)} \cdot 5^{\max(1,3)} = 2^3 \cdot 3^1 \cdot 5^3 = 8 \cdot 3 \cdot 125 = 3000$

**Relación entre mcd y mcm:**  
Para cualesquiera enteros positivos $a$ y $b$ se cumple:  
$a \cdot b = \text{mcd}(a,b) \cdot \text{mcm}(a,b)$

# Coprimos

Dos enteros $a$ y $b$ son **coprimos** (o primos relativos) si y solo si $\text{mcd}(a,b) = 1$. Esto significa que no comparten factores primos comunes.

---

## Tabla de resumen

| Concepto | Definición | Método de cálculo (usando factorización prima) | Ejemplo (120 y 500) |
|----------|------------|-----------------------------------------------|---------------------|
| **División entera** | Dados $a \in \mathbb{Z}$ y $d \in \mathbb{Z^+}$, existen únicos $q$ (cociente) y $r$ (residuo) con $a = d \cdot q + r$, $0 \leq r < d$ | No aplica | $120 = 500 \cdot 0 + 120$ |
| **Máximo común divisor (mcd)** | Mayor entero positivo que divide a ambos números | Factores comunes con el menor exponente | $\text{mcd}(120,500) = 2^2 \cdot 5^1 = 20$ |
| **Mínimo común múltiplo (mcm)** | Menor entero positivo divisible por ambos números | Todos los factores con el mayor exponente | $\text{mcm}(120,500) = 2^3 \cdot 3^1 \cdot 5^3 = 3000$ |
| **Coprimos** | Dos números cuyo mcd es 1 | Verificar que no haya factores primos comunes | $\text{mcd}(7,15) = 1$ → son coprimos |

**Comentarios adicionales:**

- El algoritmo de Euclides es un método más eficiente para calcular el mcd que la factorización prima, especialmente con números grandes.
- La propiedad $a \cdot b = \text{mcd}(a,b) \cdot \text{mcm}(a,b)$ permite calcular uno si se conoce el otro.
- En programación, es importante distinguir entre el módulo matemático (residuo no negativo) y la operación resto implementada en muchos lenguajes, que puede devolver valores negativos.
- Los números coprimos son fundamentales en teoría de números y criptografía, por ejemplo, en el algoritmo RSA.