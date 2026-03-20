# Método del Maestro

El método del maestro resuelve ecuaciones de recurrencia de la forma:

$$
T(n) = aT\left(\frac{n}{b}\right) + f(n)
$$

Mediante tres casos, comparando $n^{\log_b(a)}$ contra $f(n)$.

1. **Caso 1:** Si $f(n)$ es $O(n^{\log_b(a) - \epsilon})$ para algún $\epsilon > 0$, es decir, $f(n)$ es polinómicamente inferior a $n^{\log_b(a)}$. Entonces la solución es $\Theta(n^{\log_b(a)})$.
2. **Caso 2:** Si $f(n)$ es $\Theta(n^{\log_b(a)})$, es decir, $f(n)$ está en el mismo nivel polinomial que $n^{\log_b(a)}$. Entonces la solución es $\Theta(n^{\log_b(a)} \cdot \log(n))$.
3. **Caso 3:** Si $f(n)$ es $\Omega(n^{\log_b(a) + \epsilon})$ para algún $\epsilon > 0$, es decir, $f(n)$ es polinómicamente superior a $n^{\log_b(a)}$, y además se cumple la **condición de regularidad**: $a f\left(\frac{n}{b}\right) \leq c f(n)$ para alguna constante $c < 1$ y $n$ suficientemente grande. Entonces la solución es $\Theta(f(n))$.

## Método para resolver

1. Identificar $a$, $b$ y $f(n)$.
2. Evaluar el caso correspondiente comparando $f(n)$ con $n^{\log_b(a)}$.
3. Aplicar la solución según el caso.

## Ejemplo

Sea la recurrencia:

$T(n) = 4T\left(\frac{n}{2}\right) + 8n^2$

Identificamos:
- $a = 4$
- $b = 2$
- $f(n) = 8n^2$

Calculamos $n^{\log_b(a)} = n^{\log_2(4)} = n^2$.

Ahora evaluamos los casos:

1. **Caso 1:** ¿Es $8n^2$ $O(n^{2 - \epsilon})$ para algún $\epsilon > 0$?  
   No, porque $8n^2$ crece al menos tan rápido como $n^2$, no es polinómicamente inferior.

2. **Caso 2:** ¿Es $8n^2$ $\Theta(n^2)$?  
   Sí, porque $8n^2$ es exactamente del mismo orden que $n^2$.

3. **Caso 3:** ¿Es $8n^2$ $\Omega(n^{2 + \epsilon})$ para algún $\epsilon > 0$?  
   No, porque $8n^2$ no es polinómicamente superior a $n^2$.

Dado que se cumple el **Caso 2**, la solución es:

$\Theta(n^{\log_b(a)} \cdot \log(n)) = \Theta(n^2 \cdot \log(n))$

**Nota:** En el ejemplo original se calculó incorrectamente $\log_4(2)$ en lugar de $\log_2(4)$. La corrección es crucial para aplicar el método correctamente.

## Tabla de resumen

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| **Forma general** | Recurrencia $T(n) = aT(n/b) + f(n)$ con $a \geq 1$, $b > 1$ | $T(n) = 4T(n/2) + 8n^2$ |
| **Función de comparación** | $n^{\log_b(a)}$: costo de las hojas del árbol de recurrencia | Para $a=4$, $b=2$: $n^{\log_2(4)} = n^2$ |
| **Caso 1** | $f(n)$ es polinómicamente menor que $n^{\log_b(a)}$. Solución: $\Theta(n^{\log_b(a)})$ | $f(n) = n^{1.5}$ vs $n^2$ |
| **Caso 2** | $f(n)$ es del mismo orden que $n^{\log_b(a)}$. Solución: $\Theta(n^{\log_b(a)} \log n)$ | $f(n) = 8n^2$ vs $n^2$ |
| **Caso 3** | $f(n)$ es polinómicamente mayor y cumple condición de regularidad. Solución: $\Theta(f(n))$ | $f(n) = n^3$ vs $n^2$, con $a f(n/b) \leq c f(n)$ |
| **Condición de regularidad** | Requisito adicional para el Caso 3: $a f(n/b) \leq c f(n)$ para $c < 1$ y $n$ grande | Verifica que $f(n)$ domina consistentemente |

## Comentarios adicionales

- El método del maestro es aplicable solo a recurrencias que siguen la forma específica $T(n) = aT(n/b) + f(n)$.
- La condición de regularidad en el Caso 3 asegura que el término no recursivo $f(n)$ domina suficientemente sobre los términos recursivos.
- Es común confundir el cálculo de $\log_b(a)$; verificar cuidadosamente la base del logaritmo es esencial.
- El método no cubre todos los posibles órdenes de crecimiento; para recurrencias que no encajan en los tres casos, se requieren otros métodos como el árbol de recurrencia o la sustitución.
- En la práctica, el Caso 2 es frecuente en algoritmos como Merge Sort, donde $a = b = 2$ y $f(n) = \Theta(n)$, resultando en $T(n) = \Theta(n \log n)$.