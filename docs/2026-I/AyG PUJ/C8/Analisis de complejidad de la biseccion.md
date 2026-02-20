# Análisis de complejidad de la bisección

## Bisección discreta

Aplica el mismo análisis de la búsqueda binaria. Supongamos que el intervalo $[a,b]$ tiene tamaño $n$. Como siempre divido a la mitad:

1. **Complejidad temporal:** $T(n) = T(\frac{n}{2}) + O(1)$, lo que resulta en $O(\log n)$.
2. **Complejidad espacial:** Tengo 3 variables (`l`, `r`, `mid`) y tengo activo un máximo de $O(\log n)$ marcos de pila (frames de llamada recursiva). Por lo tanto, la complejidad espacial es $O(\log n)$.

**Concepto teórico añadido:** La recurrencia $T(n) = T(n/2) + O(1)$ es característica de los algoritmos de "divide y vencerás" que reducen el problema a la mitad en cada paso. Se resuelve aplicando el Teorema Maestro o expandiendo la recurrencia: $T(n) = T(n/2) + c = T(n/4) + 2c = ... = T(1) + c \cdot \log_2 n = O(\log n)$.

## Bisección continua

Aquí dividimos el intervalo $[a,b]$ hasta que tenga tamaño menor que $\epsilon$, por lo que el análisis depende enteramente de este valor.

En este análisis voy a suponer que $a=0$ y $b=n$, por lo que el tamaño inicial del intervalo es $n$.

1. Iteración 1: $[0, n]$ (tamaño $n$)
2. Iteración 2: $[0, \frac{n}{2}]$ (tamaño $\frac{n}{2}$)
3. Iteración 3: $[0, \frac{n}{4}]$ (tamaño $\frac{n}{4}$)
...
k. Iteración k: tamaño = $\frac{n}{2^k}$

El algoritmo se detiene cuando $\frac{n}{2^k} < \epsilon$. Aplicando álgebra:
$\frac{n}{2^k} < \epsilon \implies 2^k > \frac{n}{\epsilon} \implies k > \log_2\left(\frac{n}{\epsilon}\right)$

Por lo tanto, la complejidad es $O\left(\log\left(\frac{n}{\epsilon}\right)\right)$.

 Cuando $\epsilon = 10^{-9}$, tenemos $O(\log(10^9 \cdot n)) = O(\log n + \log(10^9)) = O(\log n + 9\log 10)$. Aunque $\log(10^9)$ es una constante grande (~29.9 cuando la base es 2), en la notación O grande las constantes se omiten, dando $O(\log n)$. Sin embargo, en la práctica, cuando $\epsilon$ es muy pequeño, el término constante puede ser significativo y afectar el rendimiento real.

**Diferencia entre análisis asintótico y rendimiento práctico:** Mientras que $O(\log n)$ y $O\left(\log\left(\frac{n}{\epsilon}\right)\right)$ son asintóticamente equivalentes (ya que $\epsilon$ es constante), en implementaciones reales el valor de $\epsilon$ afecta directamente el número de iteraciones. Para $\epsilon = 10^{-9}$ y $n = 1000$, se necesitan aproximadamente $\log_2(1000 / 10^{-9}) = \log_2(10^{12}) \approx 40$ iteraciones, mientras que para $\epsilon = 10^{-3}$ solo se necesitan $\log_2(1000 / 10^{-3}) = \log_2(10^6) \approx 20$ iteraciones.

## Tabla de resumen de conceptos

| Concepto | Descripción | Observaciones |
| :--- | :--- | :--- |
| **Complejidad temporal (discreta)** | $O(\log n)$, donde $n$ es el tamaño del intervalo inicial. | Se deriva de la recurrencia $T(n) = T(n/2) + O(1)$. |
| **Complejidad espacial (discreta, recursiva)** | $O(\log n)$, debido a la profundidad de la pila de llamadas recursivas. | Una implementación iterativa reduce la complejidad espacial a $O(1)$. |
| **Complejidad temporal (continua)** | $O\left(\log\left(\frac{n}{\epsilon}\right)\right)$, donde $n$ es el tamaño inicial del intervalo y $\epsilon$ la tolerancia. | El número de iteraciones depende tanto de $n$ como de $\epsilon$. |
| **Criterio de parada (continua)** | El algoritmo se detiene cuando $\frac{n}{2^k} < \epsilon$, después de $k$ iteraciones. | Esto garantiza que el error en $x$ sea menor que $\epsilon$. |
| **Análisis asintótico vs. práctico** | Asintóticamente, $O\left(\log\left(\frac{n}{\epsilon}\right)\right) = O(\log n)$ si $\epsilon$ es constante. | En la práctica, $\epsilon$ afecta significativamente el número de iteraciones cuando es muy pequeño. |
| **Recurrencia característica** | $T(n) = T(n/2) + O(1)$ para algoritmos que dividen el problema a la mitad. | Es un caso del Teorema Maestro con $a=1$, $b=2$, $f(n)=O(1)$. |

## Comentarios adicionales

1.  **Implementación iterativa:** Para la bisección discreta, una implementación iterativa usando un bucle `while` tendría complejidad espacial $O(1)$, ya que no utiliza la pila de llamadas recursivas. Esto es preferible para intervalos muy grandes donde $O(\log n)$ marcos de pila podrían causar desbordamiento.

2.  **Elección de $\epsilon$ en la práctica:** El valor de $\epsilon$ debe elegirse considerando:
    - La precisión requerida por la aplicación.
    - La precisión de la aritmética de punto flotante (no tiene sentido usar $\epsilon < 10^{-15}$ para `double` en muchos casos).
    - El tiempo de ejecución disponible.

3.  **Comparación con otros métodos:** Para funciones monótonas, la bisección es robusta y garantiza convergencia, pero puede ser más lenta que métodos como Newton-Raphson cuando estos convergen. Sin embargo, Newton-Raphson requiere derivadas y puede divergir, mientras que la bisección siempre converge si la función es continua y cambia de signo en el intervalo.

4.  **Análisis de complejidad para búsqueda de raíces:** Cuando se usa bisección para encontrar raíces ($f(x) = 0$), el análisis es similar al caso continuo presentado, pero el criterio de parada puede ser $|f(mid)| < \delta$ en lugar de (o además de) $r-l < \epsilon$.

5.  **Generalización a dimensiones superiores:** El concepto de dividir el espacio de búsqueda se extiende a algoritmos como la búsqueda binaria en matrices ordenadas, árboles de segmentos y métodos de optimización en múltiples dimensiones, aunque con complejidades diferentes.